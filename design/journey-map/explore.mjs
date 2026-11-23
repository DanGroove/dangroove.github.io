// End-only camera. The geometry helpers are pure and can be imported by Node.
import { EXPLORE, DEPTH, COPY, STEPS } from './data.mjs';
import { VIEW, tripState, lerp, clamp01, easeIO } from './trip.mjs';

export const exploreLayer = (cam, end) => { const c = cam.s / end.s; return { c, dx: cam.tx - end.tx * c, dy: cam.ty - end.ty * c }; };
export const exploreLayerPoint = (p, layer) => [p[0] * layer.c + layer.dx, p[1] * layer.c + layer.dy];
export const exploreLayerInverse = (p, layer) => [(p[0] - layer.dx) / layer.c, (p[1] - layer.dy) / layer.c];
export const exploreWorld = (cam, p) => [(p[0] - cam.tx) / cam.s, (p[1] - cam.ty) / cam.s];
export const exploreMix = (a, b, k) => ({ s: a.s * (b.s / a.s) ** k, tx: lerp(a.tx, b.tx, k), ty: lerp(a.ty, b.ty, k) });
export function exploreClamp(cam, bounds, view, fit, top) {
  const s = Math.max(fit, Math.min(top, cam.s));
  const axis = (lo, hi, size, translation) => {
    const half = size / (2 * s), centre = (size / 2 - translation) / s;
    const at = hi - lo <= 2 * half ? (lo + hi) / 2 : Math.max(lo + half, Math.min(hi - half, centre));
    return size / 2 - at * s;
  };
  return { s, tx: axis(bounds[0], bounds[2], view.w, cam.tx), ty: axis(bounds[1], bounds[3], view.h, cam.ty) };
}
export function exploreZoom(cam, point, factor, fit, top) {
  const s = Math.max(fit, Math.min(top, cam.s * factor)), p = exploreWorld(cam, point);
  return { s, tx: point[0] - p[0] * s, ty: point[1] - p[1] * s };
}
export function exploreGlide(cam, velocity, dt, bounds, view, fit, top) {
  const damp = Math.exp(-EXPLORE.friction * dt), distance = (1 - damp) / EXPLORE.friction;
  const desired = { ...cam, tx: cam.tx + velocity[0] * distance, ty: cam.ty + velocity[1] * distance };
  const next = exploreClamp(desired, bounds, view, fit, top);
  const v = velocity.map((speed, i) => Math.abs(speed * damp) < DEPTH.epsilon || Math.abs(next[i ? 'ty' : 'tx'] - desired[i ? 'ty' : 'tx']) > DEPTH.epsilon ? 0 : speed * damp);
  return { cam: next, velocity: v };
}

const EX = { active: false, k: 0, cam: null, target: null, end: null, bounds: null, view: null, fit: 1, top: 1,
  motion: null, velocity: [0, 0], pointers: new Map(), gesture: null, samples: [], layer: { c: 1, dx: 0, dy: 0 },
  stage: null, world: null, journey: null, rm: true, hint: null, hintUsed: false, hintLeft: 0, changed: false, suppress: false, departing: false };
export const exploreActive = () => EX.active;
export const exploreBusy = () => EX.active || EX.k > 0;
export const exploreTransform = () => EX.layer;
const exploreAllowed = () => !EX.rm && EX.end && !EX.journey.moving && Math.abs(EX.journey.P - EX.journey.beats.at(-1).P) < Number.EPSILON;
const exploreBound = cam => exploreClamp(cam, EX.bounds, EX.view, EX.fit, EX.top);
const exploreFitCam = () => ({ s: EX.fit, tx: EX.view.w / 2 - (EX.bounds[0] + EX.bounds[2]) / 2 * EX.fit, ty: EX.view.h / 2 - (EX.bounds[1] + EX.bounds[3]) / 2 * EX.fit });
const exploreNotify = () => { EX.changed = true; window.dispatchEvent(new Event('jm-explore')); };
const exploreHintOff = () => { EX.hintLeft = 0; EX.hint?.classList.remove('on'); };
function exploreClearPointers() {
  for (const id of EX.pointers.keys()) if (EX.stage.hasPointerCapture?.(id)) EX.stage.releasePointerCapture(id);
  EX.pointers.clear(); EX.gesture = null; EX.samples = []; EX.stage?.classList.remove('is-dragging');
}
export function exploreReset() {
  if (!EX.active && !EX.k && !EX.departing) return;
  EX.active = false; EX.k = 0; EX.departing = false; EX.motion = null; EX.velocity = [0, 0]; EX.cam = EX.end && { ...EX.end }; EX.target = EX.cam && { ...EX.cam };
  exploreClearPointers(); exploreHintOff(); EX.layer = { c: 1, dx: 0, dy: 0 };
  if (EX.world) EX.world.style.transform = 'none';
  document.documentElement.classList.remove('jm-explore'); exploreNotify();
}
// A cut ends input immediately, retaining the painted view only until its cover is opaque and P changes.
export function exploreDepart() {
  if (!exploreBusy()) return;
  EX.active = false; EX.departing = true; EX.motion = null; EX.velocity = [0, 0];
  exploreClearPointers(); exploreHintOff(); document.documentElement.classList.remove('jm-explore'); exploreNotify();
}
export function exploreStart() {
  if (!exploreAllowed() || exploreBusy()) return false;
  EX.active = true; EX.departing = false; EX.cam = { ...EX.end }; EX.target = exploreFitCam(); EX.velocity = [0, 0];
  EX.motion = { from: { ...EX.cam }, to: { ...EX.target }, k0: 0, k1: 1, elapsed: 0, duration: EXPLORE.in };
  document.documentElement.classList.add('jm-explore');
  if (!EX.hintUsed) { EX.hintUsed = true; EX.hintLeft = EXPLORE.hintTime; EX.hint.textContent = VIEW.phone ? COPY.explore.hintPhone : COPY.explore.hint; EX.hint.classList.add('on'); }
  document.getElementById('go-say').textContent = COPY.explore.say;
  exploreNotify(); return true;
}
export function exploreEnd() {
  if (!EX.active) return false;
  EX.active = false; EX.target = { ...EX.end }; EX.velocity = [0, 0];
  EX.motion = { from: { ...EX.cam }, to: { ...EX.end }, k0: EX.k, k1: 0, elapsed: 0, duration: EXPLORE.out };
  exploreClearPointers(); exploreHintOff(); document.documentElement.classList.remove('jm-explore'); exploreNotify(); return true;
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
  const margin = VIEW.phone ? EXPLORE.marginPhone : EXPLORE.margin;
  EX.view = { w: VIEW.w, h: VIEW.h - (VIEW.phone ? STEPS.nav.bar : STEPS.nav.h + STEPS.nav.gap), stageH: VIEW.h };
  EX.fit = Math.min((EX.view.w - 2 * margin) / (EX.bounds[2] - EX.bounds[0]), (EX.view.h - 2 * margin) / (EX.bounds[3] - EX.bounds[1]));
  EX.top = Math.max(EX.fit, EXPLORE.most * VIEW.sT);
  if (exploreBusy() && world) {
    const s = lerp(EX.fit, EX.top, share); EX.cam = exploreBound({ s, tx: EX.view.w / 2 - world[0] * s, ty: EX.view.stageH / 2 - world[1] * s }); EX.target = { ...EX.cam };
    if (EX.motion) EX.motion = { from: { ...EX.cam }, to: EX.active ? exploreFitCam() : { ...EX.end }, k0: EX.k, k1: EX.active ? 1 : 0, elapsed: 0, duration: EX.active ? EXPLORE.in : EXPLORE.out };
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
  const before = JSON.stringify([EX.cam, EX.k]), motion = EX.motion;
  if (motion) {
    motion.elapsed = Math.min(motion.duration, motion.elapsed + dt);
    const q = easeIO(motion.duration ? motion.elapsed / motion.duration : 1);
    EX.k = lerp(motion.k0, motion.k1, q);
    if (motion.from) EX.cam = exploreMix(motion.from, motion.to, q);
    if (motion.elapsed === motion.duration) { EX.motion = null; if (!EX.active) { EX.cam = { ...EX.end }; EX.target = { ...EX.end }; exploreNotify(); } }
  }
  if (EX.active && !EX.motion?.from && !EX.gesture?.dragged) {
    if (EX.velocity.some(Boolean)) { const glide = exploreGlide(EX.cam, EX.velocity, dt, EX.bounds, EX.view, EX.fit, EX.top); EX.cam = glide.cam; EX.target = { ...EX.cam }; EX.velocity = glide.velocity; }
    else {
      const q = 1 - Math.exp(-dt / EXPLORE.ease);
      EX.cam = exploreBound({ s: lerp(EX.cam.s, EX.target.s, q), tx: lerp(EX.cam.tx, EX.target.tx, q), ty: lerp(EX.cam.ty, EX.target.ty, q) });
      if (['s', 'tx', 'ty'].every(key => Math.abs(EX.cam[key] - EX.target[key]) < DEPTH.epsilon)) EX.cam = { ...EX.target };
    }
  }
  if (EX.hintLeft > 0) { EX.hintLeft = Math.max(0, EX.hintLeft - dt); if (!EX.hintLeft) exploreHintOff(); }
  st.exploreK = EX.k; st.exploring = EX.active; st.sEnd = EX.end?.s || st.cam.s;
  if (EX.k > 0 || EX.active) {
    st.cam = { ...EX.cam, ax: VIEW.w / 2, ay: VIEW.h / 2 };
    st.cardK = st.cardK.map(() => 0); st.cardOpen = 0;
    EX.layer = exploreLayer(st.cam, EX.end);
  } else EX.layer = { c: 1, dx: 0, dy: 0 };
  if (EX.world) EX.world.style.transform = EX.k > 0 || EX.active ? `translate(${EX.layer.dx}px,${EX.layer.dy}px) scale(${EX.layer.c})` : 'none';
  const changed = EX.changed || before !== JSON.stringify([EX.cam, EX.k]); EX.changed = false; return changed;
}
const exploreExcluded = target => target?.closest?.('.find, button, a, input, textarea, select, .stop, .tl, .pop, .sheet, [data-review], .ft-name, [role="button"]');
const explorePoint = e => [e.clientX, e.clientY];
function exploreSample(e) {
  const time = e.timeStamp / 1000; EX.samples.push({ time, tx: EX.cam.tx, ty: EX.cam.ty });
  while (EX.samples.length > 1 && time - EX.samples[0].time > EXPLORE.velocityWindow) EX.samples.shift();
}
function exploreGesture() {
  const points = [...EX.pointers.values()];
  if (!points.length) { EX.gesture = null; return; }
  const midpoint = points.length > 1 ? points[0].map((v, i) => (v + points[1][i]) / 2) : points[0];
  EX.gesture = { from: midpoint, world: exploreWorld(EX.cam, midpoint), cam: { ...EX.cam }, distance: points.length > 1 ? Math.hypot(points[0][0] - points[1][0], points[0][1] - points[1][1]) : 0, dragged: points.length > 1 };
  EX.samples = [];
}
export function exploreBuild({ stage, world, journey, rm }) {
  Object.assign(EX, { stage, world, journey, rm }); if (rm) return;
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
    if (!EX.active || exploreExcluded(e.target) || EX.pointers.size >= 2 || (e.pointerType === 'mouse' && e.button !== 0)) return;
    EX.pointers.set(e.pointerId, explorePoint(e)); stage.setPointerCapture(e.pointerId);
    if (EX.pointers.size === 2) exploreTakeover();
    exploreGesture(); exploreSample(e);
  });
  stage.addEventListener('pointerdown', () => { EX.suppress = false; }, true);
  stage.addEventListener('pointermove', e => {
    if (!EX.active || !EX.pointers.has(e.pointerId)) return;
    EX.pointers.set(e.pointerId, explorePoint(e));
    const points = [...EX.pointers.values()], g = EX.gesture;
    const mid = points.length > 1 ? points[0].map((v, i) => (v + points[1][i]) / 2) : points[0];
    if (!g.dragged && Math.hypot(mid[0] - g.from[0], mid[1] - g.from[1]) <= EXPLORE.slop) return;
    if (!g.dragged) { exploreTakeover(); g.cam = { ...EX.cam }; g.world = exploreWorld(EX.cam, g.from); g.dragged = true; }
    e.preventDefault(); EX.suppress = true; stage.classList.add('is-dragging');
    const distance = points.length > 1 ? Math.hypot(points[0][0] - points[1][0], points[0][1] - points[1][1]) : g.distance;
    const s = Math.max(EX.fit, Math.min(EX.top, g.cam.s * (g.distance ? distance / g.distance : 1)));
    EX.cam = exploreBound({ s, tx: mid[0] - g.world[0] * s, ty: mid[1] - g.world[1] * s }); EX.target = { ...EX.cam }; EX.changed = true; exploreSample(e);
  });
  const release = e => {
    if (!EX.pointers.has(e.pointerId)) return;
    const dragged = EX.gesture?.dragged; exploreSample(e); EX.pointers.delete(e.pointerId);
    if (stage.hasPointerCapture?.(e.pointerId)) stage.releasePointerCapture(e.pointerId);
    if (EX.pointers.size) { exploreGesture(); return; }
    if (dragged && e.type === 'pointerup' && EX.samples.length > 1) { const a = EX.samples[0], b = EX.samples.at(-1), dt = b.time - a.time; EX.velocity = dt ? [(b.tx - a.tx) / dt, (b.ty - a.ty) / dt] : [0, 0]; }
    else EX.velocity = [0, 0];
    EX.gesture = null; stage.classList.remove('is-dragging');
  };
  stage.addEventListener('pointerup', release); stage.addEventListener('pointercancel', release);
  stage.addEventListener('lostpointercapture', e => { if (EX.pointers.has(e.pointerId)) { EX.pointers.delete(e.pointerId); EX.velocity = [0, 0]; exploreGesture(); stage.classList.remove('is-dragging'); } });
  stage.addEventListener('click', e => { if (EX.suppress) { EX.suppress = false; e.preventDefault(); e.stopImmediatePropagation(); } }, true);
  window.addEventListener('keydown', e => {
    if (!EX.active || e.defaultPrevented || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === 'Escape' || e.key === '0') { e.preventDefault(); exploreEnd(); return; }
    if (e.target?.closest?.('.sheet.on, input, textarea, select')) return;
    const arrows = { ArrowLeft: [1, 0], ArrowRight: [-1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] };
    if (arrows[e.key]) { e.preventDefault(); exploreTakeover(); const direction = arrows[e.key], distance = EXPLORE.keyPan * (e.shiftKey ? EXPLORE.keyShift : 1); EX.target = exploreBound({ ...EX.target, tx: EX.target.tx + direction[0] * distance, ty: EX.target.ty + direction[1] * distance }); return; }
    if (!['+', '=', '-'].includes(e.key)) return;
    e.preventDefault(); exploreTakeover(); EX.target = exploreBound(exploreZoom(EX.cam, [VIEW.w / 2, VIEW.h / 2], EX.target.s * (e.key === '-' ? 1 / EXPLORE.key : EXPLORE.key) / EX.cam.s, EX.fit, EX.top));
  });
  window.addEventListener('blur', () => { exploreClearPointers(); EX.velocity = [0, 0]; });
}
