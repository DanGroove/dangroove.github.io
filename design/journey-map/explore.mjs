// End-only camera. The geometry helpers are pure and can be imported by Node.
import { EXPLORE, DEPTH, COPY, STEPS } from './data.mjs';
import { VIEW, tripState, lerp, clamp01, easeIO } from './trip.mjs';
import { findPointerCancel, findPointerMove } from './findkit.mjs';

export const exploreLayer = (cam, end) => { const c = cam.s / end.s; return { c, dx: cam.tx - end.tx * c, dy: cam.ty - end.ty * c }; };
export const exploreLayerPoint = (p, layer) => [p[0] * layer.c + layer.dx, p[1] * layer.c + layer.dy];
export const exploreLayerInverse = (p, layer) => [(p[0] - layer.dx) / layer.c, (p[1] - layer.dy) / layer.c];
export const exploreWorld = (cam, p) => [(p[0] - cam.tx) / cam.s, (p[1] - cam.ty) / cam.s];
export const exploreMix = (a, b, k) => ({ s: a.s * (b.s / a.s) ** k, tx: lerp(a.tx, b.tx, k), ty: lerp(a.ty, b.ty, k) });
// keep ({ frame, share }) holds share of the view's width and height on the map frame, or all of a smaller frame (L-15)
export function exploreClamp(cam, bounds, view, fit, top, keep) {
  const s = Math.max(fit, Math.min(top, cam.s)), f = keep ? keep.frame : [];
  const axis = (lo, hi, size, translation, f0, f1) => {
    const half = size / (2 * s), centre = (size / 2 - translation) / s;
    let a = lo + half, b = hi - half;
    if (keep) { const need = Math.min(keep.share * 2 * half, f1 - f0); a = Math.max(a, f0 + need - half); b = Math.min(b, f1 - need + half); }
    const at = hi - lo <= 2 * half ? (lo + hi) / 2 : Math.max(a, Math.min(b, centre));
    return size / 2 - at * s;
  };
  return { s, tx: axis(bounds[0], bounds[2], view.w, cam.tx, f[0], f[2]), ty: axis(bounds[1], bounds[3], view.h, cam.ty, f[1], f[3]) };
}
export function exploreZoom(cam, point, factor, fit, top) {
  const s = Math.max(fit, Math.min(top, cam.s * factor)), p = exploreWorld(cam, point);
  return { s, tx: point[0] - p[0] * s, ty: point[1] - p[1] * s };
}
export function exploreGlide(cam, velocity, dt, bounds, view, fit, top, keep) {
  const damp = Math.exp(-EXPLORE.friction * dt), distance = (1 - damp) / EXPLORE.friction;
  const desired = { ...cam, tx: cam.tx + velocity[0] * distance, ty: cam.ty + velocity[1] * distance };
  const next = exploreClamp(desired, bounds, view, fit, top, keep);
  const v = velocity.map((speed, i) => Math.abs(speed * damp) < DEPTH.epsilon || Math.abs(next[i ? 'ty' : 'tx'] - desired[i ? 'ty' : 'tx']) > DEPTH.epsilon ? 0 : speed * damp);
  return { cam: next, velocity: v };
}

const EX = { active: false, k: 0, cam: null, target: null, end: null, bounds: null, keep: null, view: null, fit: 1, top: 1,
  motion: null, velocity: [0, 0], pointers: new Map(), gesture: null, samples: [], layer: { c: 1, dx: 0, dy: 0 },
  stage: null, world: null, journey: null, rm: true, hint: null, hintUsed: false, hintLeft: 0, changed: false, suppress: false, suppressTimer: null, owners: new Set(), footer: 1, departing: false };
export const exploreActive = () => EX.active;
export const exploreBusy = () => EX.active || EX.k > 0;
export const exploreTransform = () => EX.layer;
const exploreAllowed = () => !EX.rm && EX.end && !EX.journey.moving && Math.abs(EX.journey.P - EX.journey.beats.at(-1).P) < Number.EPSILON;
const exploreBound = cam => exploreClamp(cam, EX.bounds, EX.view, EX.fit, EX.top, EX.keep);
const exploreFitCam = () => ({ s: EX.fit, tx: EX.view.w / 2 - (EX.bounds[0] + EX.bounds[2]) / 2 * EX.fit, ty: EX.view.h / 2 - (EX.bounds[1] + EX.bounds[3]) / 2 * EX.fit });
const exploreNotify = () => { EX.changed = true; window.dispatchEvent(new Event('jm-explore')); };
const exploreHintOff = () => { EX.hintLeft = 0; EX.hint?.classList.remove('on'); };
const exploreSuppressClear = () => { EX.suppress = false; clearTimeout(EX.suppressTimer); EX.suppressTimer = null; };
const exploreWorldStyle = (key, value) => { if (EX.world && EX.world.style[key] !== value) EX.world.style[key] = value; };
const explorePromote = () => exploreWorldStyle('willChange', EX.motion || EX.velocity.some(Boolean) || EX.gesture || (EX.active && JSON.stringify(EX.cam) !== JSON.stringify(EX.target)) ? 'transform' : '');
function exploreClearPointers() {
  findPointerCancel();
  for (const id of EX.pointers.keys()) if (EX.stage.hasPointerCapture?.(id)) EX.stage.releasePointerCapture(id);
  EX.pointers.clear(); EX.owners.clear(); EX.gesture = null; EX.samples = []; EX.stage?.classList.remove('is-dragging');
}
export function exploreReset() {
  exploreSuppressClear();
  if (!EX.active && !EX.k && !EX.departing) return;
  EX.active = false; EX.k = 0; EX.departing = false; EX.motion = null; EX.velocity = [0, 0]; EX.cam = EX.end && { ...EX.end }; EX.target = EX.cam && { ...EX.cam };
  exploreClearPointers(); exploreHintOff(); EX.layer = { c: 1, dx: 0, dy: 0 };
  EX.footer = 1; exploreWorldStyle('transform', 'none'); explorePromote();
  document.documentElement.classList.remove('jm-explore'); exploreNotify();
}
// A cut ends input immediately, retaining the painted view only until its cover is opaque and P changes.
export function exploreDepart() {
  exploreSuppressClear();
  if (!exploreBusy()) return;
  EX.active = false; EX.departing = true; EX.motion = null; EX.velocity = [0, 0];
  exploreClearPointers(); exploreHintOff(); explorePromote(); document.documentElement.classList.remove('jm-explore'); exploreNotify();
}
export function exploreStart() {
  if (!exploreAllowed() || exploreBusy()) return false;
  EX.active = true; EX.departing = false; EX.footer = 1; EX.cam = { ...EX.end }; EX.target = exploreFitCam(); EX.velocity = [0, 0];
  EX.motion = { from: { ...EX.cam }, to: { ...EX.target }, k0: 0, k1: 1, elapsed: 0, duration: EXPLORE.in };
  document.documentElement.classList.add('jm-explore');
  if (!EX.hintUsed) { EX.hintUsed = true; EX.hintLeft = EXPLORE.hintTime; EX.hint.textContent = VIEW.phone ? COPY.explore.hintPhone : COPY.explore.hint; EX.hint.classList.add('on'); }
  document.getElementById('go-say').textContent = COPY.explore.say;
  explorePromote(); exploreNotify(); return true;
}
export function exploreEnd() {
  exploreSuppressClear();
  if (!EX.active) return false;
  EX.active = false; EX.target = { ...EX.end }; EX.velocity = [0, 0];
  EX.motion = { from: { ...EX.cam }, to: { ...EX.end }, k0: EX.k, k1: 0, elapsed: 0, duration: EXPLORE.out, footer0: EX.footer };
  const say = document.getElementById?.('go-say'); if (say) say.textContent = COPY.steps.say.end;
  exploreClearPointers(); exploreHintOff(); explorePromote(); document.documentElement.classList.remove('jm-explore'); exploreNotify(); return true;
}
// Called on resize with the new trip view already measured. No frame reads layout.
export function exploreResize() {
  if (EX.rm) return;
  const oldView = EX.view, oldCam = EX.cam, oldFit = EX.fit, oldTop = EX.top;
  const world = oldCam && oldView ? exploreWorld(oldCam, [oldView.w / 2, oldView.stageH / 2]) : null;
  const share = oldCam ? clamp01((oldCam.s - oldFit) / (oldTop - oldFit || 1)) : 0;
  const end = tripState(EX.journey.beats.at(-1).P).cam, f = DEPTH.frame.outer;
  EX.end = { s: end.s, tx: end.tx, ty: end.ty };
  EX.bounds = [Math.min(f[0], -end.tx / end.s), Math.min(f[1], -end.ty / end.s), Math.max(f[2], (VIEW.w - end.tx) / end.s), Math.max(f[3], (VIEW.h - end.ty) / end.s)];
  EX.keep = { frame: f, share: EXPLORE.keep };
  const margin = VIEW.phone ? EXPLORE.marginPhone : EXPLORE.margin;
  EX.view = { w: VIEW.w, h: VIEW.h - (VIEW.phone ? STEPS.nav.bar : STEPS.nav.h + STEPS.nav.gap), stageH: VIEW.h };
  EX.fit = Math.min((EX.view.w - 2 * margin) / (EX.bounds[2] - EX.bounds[0]), (EX.view.h - 2 * margin) / (EX.bounds[3] - EX.bounds[1]));
  EX.top = Math.max(EX.fit, EXPLORE.most * VIEW.sT);
  if (exploreBusy() && world) {
    const s = lerp(EX.fit, EX.top, share); EX.cam = exploreBound({ s, tx: EX.view.w / 2 - world[0] * s, ty: EX.view.stageH / 2 - world[1] * s }); EX.target = { ...EX.cam };
    if (EX.motion) EX.motion = { from: { ...EX.cam }, to: EX.active ? exploreFitCam() : { ...EX.end }, k0: EX.k, k1: EX.active ? 1 : 0, elapsed: 0, duration: EX.active ? EXPLORE.in : EXPLORE.out, footer0: EX.footer };
    exploreClearPointers(); EX.velocity = [0, 0];
  } else { EX.cam = { ...EX.end }; EX.target = { ...EX.end }; }
  EX.changed = true;
}
function exploreTakeover() {
  if (EX.motion?.from) {
    // cam is the last painted blend: input takes over exactly there, while the map reveal finishes.
    EX.motion = EX.k < 1 ? { from: null, to: null, k0: EX.k, k1: 1, elapsed: 0, duration: EXPLORE.in * (1 - EX.k) } : null;
    EX.target = { ...EX.cam };
  }
  EX.velocity = [0, 0]; exploreHintOff();
}
export function exploreApply(st, dt) {
  if (EX.rm) return false;
  const coveredDeparture = EX.departing && EX.journey.moving && EX.journey.P === EX.journey.beats.at(-1).P;
  if (exploreBusy() && !exploreAllowed() && !coveredDeparture) exploreReset();
  const before = [EX.cam.s, EX.cam.tx, EX.cam.ty, EX.k, EX.footer], motion = EX.motion;
  if (EX.active) EX.footer = Math.max(0, EX.footer - dt / EXPLORE.footerFade);
  if (motion) {
    motion.elapsed = Math.min(motion.duration, motion.elapsed + dt);
    const q = easeIO(motion.duration ? motion.elapsed / motion.duration : 1);
    EX.k = lerp(motion.k0, motion.k1, q);
    if (!EX.active) EX.footer = lerp(motion.footer0 ?? EX.footer, 1, clamp01((motion.elapsed - motion.duration + EXPLORE.footerFade) / EXPLORE.footerFade));
    if (motion.from) EX.cam = exploreMix(motion.from, motion.to, q);
    if (motion.elapsed === motion.duration) { EX.motion = null; if (!EX.active) { EX.cam = { ...EX.end }; EX.target = { ...EX.end }; exploreNotify(); } }
  }
  if (EX.active && !EX.motion?.from && !EX.gesture?.dragged) {
    if (EX.velocity.some(Boolean)) { const glide = exploreGlide(EX.cam, EX.velocity, dt, EX.bounds, EX.view, EX.fit, EX.top, EX.keep); EX.cam = glide.cam; EX.target = { ...EX.cam }; EX.velocity = glide.velocity; }
    else {
      const q = 1 - Math.exp(-dt / EXPLORE.ease);
      EX.cam = exploreBound({ s: lerp(EX.cam.s, EX.target.s, q), tx: lerp(EX.cam.tx, EX.target.tx, q), ty: lerp(EX.cam.ty, EX.target.ty, q) });
      if (['s', 'tx', 'ty'].every(key => Math.abs(EX.cam[key] - EX.target[key]) < DEPTH.epsilon)) EX.cam = { ...EX.target };
    }
  }
  if (EX.hintLeft > 0) { EX.hintLeft = Math.max(0, EX.hintLeft - dt); if (!EX.hintLeft) exploreHintOff(); }
  st.exploreK = EX.k; st.exploring = EX.active; st.exploreFooter = EX.footer; st.sEnd = EX.end?.s || st.cam.s;
  // The SVG camera stays at its last raster while input/glide changes this virtual camera.
  st.exploreMoving = !!(EX.motion || EX.gesture?.dragged || EX.velocity.some(Boolean) || EX.active && ['s', 'tx', 'ty'].some(key => EX.cam[key] !== EX.target[key]));
  st.exploreDt = dt;
  if (EX.k > 0 || EX.active) {
    st.cam = { ...EX.cam, ax: VIEW.w / 2, ay: VIEW.h / 2 };
    st.cardK = st.cardK.map(() => 0); st.cardOpen = 0;
    EX.layer = exploreLayer(st.cam, EX.end);
  } else EX.layer = { c: 1, dx: 0, dy: 0 };
  exploreWorldStyle('transform', EX.k > 0 || EX.active ? `translate(${EX.layer.dx}px,${EX.layer.dy}px) scale(${EX.layer.c})` : 'none'); explorePromote();
  const after = [EX.cam.s, EX.cam.tx, EX.cam.ty, EX.k, EX.footer];
  const changed = EX.changed || before.some((value, i) => value !== after[i]); EX.changed = false; return changed;
}
const exploreExcluded = target => target?.closest?.('.sheet.on, input, textarea, select, .tl, [data-review]');
const exploreOwned = target => target?.closest?.('#f-wayfinder, #f-beacon, .find.hoard, .rubbing, #f-mist, #f-horn, .hm-canvas, .ft-name');
const explorePoint = e => [e.clientX, e.clientY];
function exploreSample(e) {
  const time = e.timeStamp / 1000; EX.samples.push({ time, tx: EX.cam.tx, ty: EX.cam.ty });
  while (EX.samples.length > 1 && time - EX.samples[0].time > EXPLORE.velocityWindow) EX.samples.shift();
}
function exploreGesture(dragged = false) {
  const points = [...EX.pointers.values()];
  if (!points.length) { EX.gesture = null; return; }
  const midpoint = points.length > 1 ? points[0].map((v, i) => (v + points[1][i]) / 2) : points[0];
  EX.gesture = { from: midpoint, world: exploreWorld(EX.cam, midpoint), cam: { ...EX.cam }, distance: points.length > 1 ? Math.hypot(points[0][0] - points[1][0], points[0][1] - points[1][1]) : 0, dragged: dragged || points.length > 1, owned: !dragged && points.length === 1 && EX.owners.has(EX.pointers.keys().next().value) };
  EX.samples = [];
}
export function exploreBuild({ stage, world, journey, rm }) {
  Object.assign(EX, { stage, world, journey, rm }); if (rm) return;
  document.documentElement.style?.setProperty('--explore-row-delay', EXPLORE.rowDelay + 's');
  document.documentElement.style?.setProperty('--explore-row-fade', EXPLORE.rowFade + 's');
  EX.hint = document.createElement('p'); EX.hint.className = 'find-hint explore-hint'; EX.hint.setAttribute('aria-hidden', 'true'); stage.appendChild(EX.hint);
  window.addEventListener('wheel', e => {
    if (!EX.active || e.defaultPrevented) return;
    if (e.target?.closest?.('.sheet.on')) { e.preventDefault(); return; }
    if (e.target?.closest?.('.face')) return;
    e.preventDefault(); exploreTakeover();
    const dy = Math.max(-EXPLORE.wheelMax, Math.min(EXPLORE.wheelMax, e.deltaY * (e.deltaMode === 1 ? EXPLORE.linePx : e.deltaMode === 2 ? VIEW.h : 1)));
    const factor = Math.exp(-dy * (e.ctrlKey ? EXPLORE.pinchWheel : EXPLORE.wheel));
    EX.target = exploreBound(exploreZoom(EX.cam, explorePoint(e), EX.target.s * factor / EX.cam.s, EX.fit, EX.top));
  }, { passive: false });
  stage.addEventListener('pointerdown', e => {
    exploreSuppressClear();
    if (!EX.active || exploreExcluded(e.target) || EX.pointers.size >= 2 || (e.pointerType === 'mouse' && e.button !== 0)) return;
    EX.pointers.set(e.pointerId, explorePoint(e)); if (exploreOwned(e.target)) EX.owners.add(e.pointerId);
    if (EX.pointers.size === 2) { findPointerCancel(); exploreTakeover(); for (const id of EX.pointers.keys()) stage.setPointerCapture(id); EX.suppress = true; stage.classList.add('is-dragging'); e.preventDefault(); e.stopImmediatePropagation(); }
    exploreGesture(); exploreSample(e); explorePromote();
  }, true);
  stage.addEventListener('pointermove', e => {
    if (!EX.active || !EX.pointers.has(e.pointerId)) return;
    EX.pointers.set(e.pointerId, explorePoint(e));
    const points = [...EX.pointers.values()], g = EX.gesture;
    if (findPointerMove(e)) { EX.owners.delete(e.pointerId); g.owned = false; }
    if (g.owned) return;
    const mid = points.length > 1 ? points[0].map((v, i) => (v + points[1][i]) / 2) : points[0];
    if (!g.dragged && Math.hypot(mid[0] - g.from[0], mid[1] - g.from[1]) <= EXPLORE.slop) return;
    if (!g.dragged) { exploreTakeover(); g.cam = { ...EX.cam }; g.world = exploreWorld(EX.cam, g.from); g.dragged = true; for (const id of EX.pointers.keys()) stage.setPointerCapture(id); }
    e.preventDefault(); EX.suppress = true; stage.classList.add('is-dragging');
    const distance = points.length > 1 ? Math.hypot(points[0][0] - points[1][0], points[0][1] - points[1][1]) : g.distance;
    const s = Math.max(EX.fit, Math.min(EX.top, g.cam.s * (g.distance ? distance / g.distance : 1)));
    EX.cam = exploreBound({ s, tx: mid[0] - g.world[0] * s, ty: mid[1] - g.world[1] * s }); EX.target = { ...EX.cam }; EX.changed = true; exploreSample(e);
  }, true);
  const release = e => {
    if (!EX.pointers.has(e.pointerId)) return;
    const dragged = EX.gesture?.dragged, samples = EX.samples; exploreSample(e); EX.pointers.delete(e.pointerId); EX.owners.delete(e.pointerId);
    if (dragged) EX.suppress = true;
    if (EX.suppress) { clearTimeout(EX.suppressTimer); EX.suppressTimer = setTimeout(exploreSuppressClear, EXPLORE.clickRelease); }
    if (stage.hasPointerCapture?.(e.pointerId)) stage.releasePointerCapture(e.pointerId);
    if (EX.pointers.size) { exploreGesture(dragged); return; }
    if (dragged && e.type === 'pointerup' && samples.length > 1) { const a = samples[0], b = samples.at(-1), dt = b.time - a.time; EX.velocity = dt ? [(b.tx - a.tx) / dt, (b.ty - a.ty) / dt] : [0, 0]; }
    else EX.velocity = [0, 0];
    EX.gesture = null; stage.classList.remove('is-dragging'); explorePromote();
    if (dragged) EX.changed = true; // A stationary release must still commit the held SVG raster.
  };
  stage.addEventListener('pointerup', release, true); stage.addEventListener('pointercancel', release, true);
  stage.addEventListener('lostpointercapture', e => { if (e.target === stage && !stage.hasPointerCapture?.(e.pointerId) && EX.pointers.has(e.pointerId)) { const dragged = EX.gesture?.dragged; EX.pointers.delete(e.pointerId); EX.owners.delete(e.pointerId); EX.velocity = [0, 0]; exploreGesture(dragged); EX.changed = true; stage.classList.remove('is-dragging'); explorePromote(); } });
  stage.addEventListener('click', e => { if (EX.suppress && e.detail !== 0) { exploreSuppressClear(); e.preventDefault(); e.stopImmediatePropagation(); } }, true);
  window.addEventListener('keydown', exploreSuppressClear, true);
  window.addEventListener('keydown', e => {
    if (!EX.active || e.defaultPrevented || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Escape' || e.key === '0') { e.preventDefault(); exploreEnd(); return; }
    if (e.target?.closest?.('.sheet.on, input, textarea, select')) return;
    const arrows = { ArrowLeft: [1, 0], ArrowRight: [-1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] };
    if (arrows[e.key]) { e.preventDefault(); exploreTakeover(); const direction = arrows[e.key], distance = EXPLORE.keyPan * (e.shiftKey ? EXPLORE.keyShift : 1); EX.target = exploreBound({ ...EX.target, tx: EX.target.tx + direction[0] * distance, ty: EX.target.ty + direction[1] * distance }); return; }
    if (!['+', '=', '-'].includes(e.key)) return;
    e.preventDefault(); exploreTakeover(); EX.target = exploreBound(exploreZoom(EX.cam, [VIEW.w / 2, VIEW.h / 2], EX.target.s * (e.key === '-' ? 1 / EXPLORE.key : EXPLORE.key) / EX.cam.s, EX.fit, EX.top));
  });
  window.addEventListener('blur', () => { exploreClearPointers(); exploreSuppressClear(); EX.velocity = [0, 0]; EX.changed = true; explorePromote(); });
}
