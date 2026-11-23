// Shared life, particles, overlays and first-found feedback. No progress mutation.
import { FINDS, FIND_COPY, FIND_PLAY, FIND_TIMING, COPY, EXPLORE } from './data.mjs';
import { VIEW, toScreen, clamp01, lerp, easeIO, WATER, pointAt } from './trip.mjs';
import { findRnd, starPath } from './art.mjs';
import { tlSetCount } from './timeline.mjs';
import { JOURNEY, stepsFocus, stepsRelease, stepsFocusNow } from './steps.mjs';

export const FD = { st: null, now: 0, dt: 0, pointer: [-Infinity, -Infinity], pointerT: -Infinity, found: new Set(), last: null, list: {}, popOwner: null, sheetOwner: null, bits: [], serial: 0, flights: [], flight: null, landed: 0, hover: false, focusId: null, overlayEpoch: 0 };
export const D = s => FD.rm ? Number.EPSILON : s;
export const ease = t => easeIO(clamp01(t));
export const out3 = t => 1 - (1 - clamp01(t)) ** 3;
export const fEsc = s => String(typeof s === 'object' ? s.t : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
export const attr = (el, k, v) => { const text = String(v); if (el.getAttribute(k) !== text) el.setAttribute(k, text); };

// Explore touch intent is shared by every pointerdown find. Nothing acts or captures
// until tap/hold/owned-drag intent is known; a second finger cancels the whole wait.
const findPointers = new Map();
export function findPointerCancel() {
  for (const p of findPointers.values()) { clearTimeout(p.timer); p.cancel?.(); p.el._dragged = false; }
  findPointers.clear();
}
export function findPointerMove(e) {
  const p = findPointers.get(e.pointerId);
  if (!p || p.active || Math.hypot(e.clientX - p.e.clientX, e.clientY - p.e.clientY) <= EXPLORE.slop) return false;
  clearTimeout(p.timer);
  if (p.drag) { p.active = true; p.start(p.e); }
  else { findPointers.delete(e.pointerId); p.el._dragged = false; return true; }
  return false;
}
export function findPointer(el, start, { drag = false, tap = null, cancel = null } = {}) {
  el.addEventListener('pointerdown', e => {
    if (FD.rm || !FD.st?.exploring || e.pointerType !== 'touch') { start(e); return; }
    el._dragged = false;
    const p = { el, start, drag, cancel, e, active: false };
    p.timer = setTimeout(() => { if (findPointers.get(e.pointerId) !== p) return; p.active = true; start(e); }, EXPLORE.pressWait);
    findPointers.set(e.pointerId, p);
  });
  el.addEventListener('pointermove', findPointerMove);
  const release = e => {
    const p = findPointers.get(e.pointerId); if (!p || p.el !== el) return;
    clearTimeout(p.timer); findPointers.delete(e.pointerId);
    if (!p.active && e.type === 'pointerup' && Math.hypot(e.clientX - p.e.clientX, e.clientY - p.e.clientY) <= EXPLORE.slop) {
      tap?.(e);
      el._dragged = true;
    }
    cancel?.();
  };
  el.addEventListener('pointerup', release); el.addEventListener('pointercancel', release);
}
export const toMap = p => [(p[0] - FD.st.cam.tx) / FD.st.cam.s, (p[1] - FD.st.cam.ty) / FD.st.cam.s];
export const FIND_BY = Object.fromEntries(FINDS.map(f => [f.id, f]));
export const findRandom = findRnd;
export const findReady = id => {
  if (FD.rm || FD.st?.exploring) return true;
  const f = stepsFocusNow();
  return JOURNEY.mode === 'steps' && JOURNEY.focus === id && f?.id === id && f.k === 1 && f.swapped;
};
export const findRange = pair => lerp(pair[0], pair[1], findRandom());
export const findFormat = (s, values) => s.replace(/\{(\w+)\}/g, (m, k) => values[k]);
export const findAngleDelta = (a, b) => ((b - a + FIND_PLAY.kit.deg) % FIND_PLAY.kit.turn + FIND_PLAY.kit.turn) % FIND_PLAY.kit.turn - FIND_PLAY.kit.deg;
export const findSvg = (tag, attributes = {}) => { const el = document.createElementNS('http://www.w3.org/2000/svg', tag); Object.entries(attributes).forEach(([k, v]) => attr(el, k, v)); return el; };
export const findSlot = line => typeof line === 'object' && line.todo ? `<div class="find-slot"><span class="pop-k">${fEsc(COPY.todo)}</span><p>${fEsc(line)}</p></div>` : `<p class="pop-t">${fEsc(line)}</p>`;
export const findPlace = id => {
  const h = FIND_COPY.hoards.find(d => d.id === id); if (h) return [h.x, h.y];
  if (id === 'longship' && FD.st) { const p = pointAt(Math.max(WATER[0], Math.min(WATER[1], FD.st.u))); return [p[0], p[1] + FIND_PLAY.kit.shipY]; }
  const f = FD.list[id], d = FIND_BY[id]; return f?.place ? f.place() : d ? [d.x, d.y] : null;
};
export const findView = id => {
  const p = findPlace(id), delta = id.startsWith('hoard') ? FIND_PLAY.focus.chest : id === 'longship' ? FIND_PLAY.focus.ship : null;
  if (delta) return [p[0] + delta[0], p[1] + delta[1], delta[2]];
  const d = FIND_BY[id]; return VIEW.phone && d.viewPhone ? d.viewPhone : d.view; // a find may give a narrow screen a view of its own
};
export function attend(find, reach) {
  if (!FD.st) return null;
  if (FD.hover && FD.now - FD.pointerT <= FIND_PLAY.fresh) { const p = toMap(FD.pointer); if (Math.hypot(p[0] - find.x, p[1] - find.y) <= reach) return p; }
  const p = FD.st.trav; return p && Math.hypot(p[0] - find.x, p[1] - find.y) <= 2 * reach ? p : null;
}
export function findLife(o, x, y, rad, reach = rad) {
  o.x = x; o.y = y; o.rad = rad;
  const p = toScreen(FD.st, [x, y]), edge = rad * FD.st.cam.s + FIND_PLAY.kit.margin;
  o.onScreen = p[0] >= -edge && p[0] <= VIEW.w + edge && p[1] >= -edge && p[1] <= VIEW.h + edge;
  const pointer = FD.hover && FD.now - FD.pointerT <= FIND_PLAY.fresh ? toMap(FD.pointer) : null;
  o.awake = JOURNEY.focus === o.id || document.activeElement === o.el || !!(pointer && Math.hypot(pointer[0] - x, pointer[1] - y) <= reach);
  o.kept ??= false;
  // Only a find on screen after the hand-over is in the tab order; the focused one keeps its place.
  const seen = p[0] >= 0 && p[0] <= VIEW.w && p[1] >= 0 && p[1] <= VIEW.h, tab = FD.rm || (FD.st.handoffT >= 1 && (seen || document.activeElement === o.el)) ? 0 : -1;
  if (o.el && o.el.tabIndex !== tab) o.el.tabIndex = tab;
}
export function found(id, atId = id) {
  if (FD.found.has(id)) return;
  FD.found.add(id); FD.svg.querySelector('#mk-' + id)?.classList.add('found');
  if (FD.rm) { FD.landed = FD.found.size; findLandCount(); return; }
  FD.flights.push({ id: atId, number: FD.found.size }); findStartFlight();
}
function findLandCount() { tlSetCount(FD.landed, FINDS.length); if (FD.landed === FINDS.length) FD.all?.start(); }
function findStartFlight() {
  if (FD.flight || !FD.flights.length) return;
  const next = FD.flights.shift(), box = FD.count.getBoundingClientRect();
  FD.flight = { ...next, from: toScreen(FD.st, findPlace(next.id)), to: [box.left + box.width / 2, box.top + box.height / 2], ts: FD.now };
}
export function opened(o) { o.overlayEpoch = FD.overlayEpoch; if (o.id !== 'well') FD.last = o; }
export const press = (el, fn) => {
  el.addEventListener('click', e => { if (el._dragged) { el._dragged = false; return; } fn(e); });
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(e); } });
};
export function showPop(owner, anchor, html, cls = '', side = 'auto') {
  if (owner.overlayEpoch !== undefined && owner.overlayEpoch !== FD.overlayEpoch) return false;
  closePop(); FD.popOwner = owner; FD.popAnchor = anchor; FD.popSide = side; FD.popP = FD.st.P; FD.popTs = FD.now;
  FD.pop.className = 'pop on ' + cls;
  FD.pop.innerHTML = `<div class="pop-in"><div class="pop-body">${html}</div><i class="pop-tail" aria-hidden="true"></i></div>`;
  FD.popInner = FD.pop.firstElementChild; FD.popTail = FD.pop.querySelector('.pop-tail'); FD.popBody = FD.pop.querySelector('.pop-body');
  const box = FD.popInner.getBoundingClientRect(); FD.popSize = [box.width, box.height];
  // A popup stays above the step buttons and the timeline: their tops are read once here, when it opens, never in the frame loop.
  FD.popFloor = Math.min(VIEW.h, ...[...document.querySelectorAll('.go, .tl, .jm-focus .find-hint')].map(e => e.getBoundingClientRect()).filter(r => r.height > 0).map(r => r.top));
  placePop();
  FD.popInner.style.transformOrigin = `${FD.popOrigin[0]}px ${FD.popOrigin[1]}px`;
  return true;
}
export function closePop() {
  const o = FD.popOwner; if (!o) return;
  FD.popOwner = null; FD.pop.className = 'pop'; FD.pop.innerHTML = ''; if (o.onPopClose) o.onPopClose();
}
export function placePop() {
  if (!FD.popOwner) return;
  const K = FIND_PLAY.kit.popup, anchor = typeof FD.popAnchor === 'function' ? FD.popAnchor() : FD.popAnchor, p = toScreen(FD.st, anchor), [w, h] = FD.popSize;
  const below = FD.popSide === 'below' || FD.popSide !== 'above' && p[1] - h - K.tail[1] < K.edge;
  const x = Math.max(K.edge, Math.min(VIEW.w - w - K.edge, p[0] - w / 2));
  const y = Math.max(K.edge, Math.min((FD.popFloor ?? VIEW.h) - h - K.edge, below ? p[1] + K.tail[1] : p[1] - h - K.tail[1]));
  FD.popOrigin = [Math.max(0, Math.min(w, p[0] - x)), below ? 0 : h];
  FD.pop.style.transform = `translate(${x}px,${y}px)`;
  const q = FD.rm ? 1 : clamp01((FD.now - FD.popTs) / K.time), back = 1 + (K.over - 1) / (1 - K.scale);
  const v = 1 + (back + 1) * (q - 1) ** 3 + back * (q - 1) ** 2;
  FD.popInner.style.transform = `scale(${lerp(K.scale, 1, q === 1 ? 1 : v)})`; FD.popBody.style.opacity = q;
  FD.popTail.style.transform = `translate(${Math.max(0, Math.min(w - K.tail[0], p[0] - x - K.tail[0] / 2))}px,${below ? -K.tail[1] : h}px) rotate(${below ? FIND_PLAY.kit.deg : 0}deg)`;
}
export function findSheet(owner, cls, html, anchor) {
  if (owner.overlayEpoch !== undefined && owner.overlayEpoch !== FD.overlayEpoch) return false;
  closeSheet(true); closePop();
  FD.sheetOwner = owner; FD.sheetP = FD.st.P; FD.sheetFrom = toScreen(FD.st, anchor); FD.sheetTs = FD.now;
  FD.sheet.className = 'sheet on ' + cls; FD.sheet.innerHTML = html;
  document.documentElement.classList.add('jm-sheet-open');
  FD.sheet.setAttribute('aria-label', FIND_BY[owner.id].label); FD.sheet.tabIndex = -1;
  const target = FD.sheet.querySelector('button:not([hidden])') || FD.sheet; target.focus({ preventScroll: true });
  return true;
}
export function closeSheet(force = false) {
  const o = FD.sheetOwner; if (!o) return;
  if (!force && o.beginClose && o.beginClose()) return;
  FD.sheetOwner = null; FD.sheet.className = 'sheet'; FD.sheet.innerHTML = '';
  document.documentElement.classList.remove('jm-sheet-open');
  if (o.onSheetClose) o.onSheetClose(); o.el?.focus({ preventScroll: true });
}
export function findBits(kind, x, y, n, options = {}) {
  if (FD.rm) return;
  const B = FIND_PLAY.bits, v = { ...B.base, ...options };
  for (let i = 0; i < n; i++) {
    const bit = FD.bits.find(b => !b.live) || FD.bits.reduce((a, b) => a.serial < b.serial ? a : b);
    const [path, cls] = kind === 'star' ? [starPath(0, 0, B.starSize), 'pf'] : B.kinds[kind];
    const angle = findRange(v.dir) * Math.PI / FIND_PLAY.kit.deg, speed = findRange(v.speed);
    Object.assign(bit, { live: true, serial: FD.serial++, x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, age: 0, life: findRange(v.life), spin: v.spin, g: v.g, drag: v.drag, size: v.size, alpha: kind === 'puff' ? Math.min(B.puffAlpha, v.alpha) : v.alpha, kind });
    attr(bit.el, 'd', path); attr(bit.el, 'class', cls); bit.el.style.display = ''; if (['star', 'drop', 'puff', 'wisp'].includes(kind)) bit.el.style.stroke = 'none'; else bit.el.style.stroke = '';
    attr(bit.el, 'transform', `translate(${x} ${y}) scale(${v.size[0]})`); attr(bit.el, 'opacity', bit.alpha);
  }
}
export function findKitBuild(svg, pop, sheet, base, rm) {
  Object.assign(FD, { svg, pop, sheet, base, rm, hover: matchMedia('(hover: hover)').matches, count: document.querySelector('.tl-count') });
  const pool = findSvg('g', { id: 'f-bits', 'pointer-events': 'none' }); svg.querySelector('#finds').appendChild(pool);
  FD.hint = document.createElement('p'); FD.hint.className = 'find-hint'; FD.hint.setAttribute('aria-hidden', 'true'); (document.getElementById('go')?.parentElement || document.body).appendChild(FD.hint);
  for (let i = 0; i < FIND_PLAY.bits.pool; i++) { const el = findSvg('path'); el.style.display = 'none'; pool.appendChild(el); FD.bits.push({ el, live: false, serial: -1 }); }
  FD.star = document.createElement('div'); FD.star.className = 'find-star'; FD.star.setAttribute('aria-hidden', 'true');
  FD.star.innerHTML = `<svg viewBox="-1 -1 2 2"><path d="${starPath(0, 0, 1)}"/></svg>`; pop.parentElement.appendChild(FD.star);
  findKitStyle();
  // an open sheet keeps Tab and Shift+Tab inside it (B-4)
  sheet.addEventListener('keydown', e => {
    if (e.key === 'Tab' && FD.sheetOwner) { const f = [...sheet.querySelectorAll('button:not([hidden]):not([disabled]),[tabindex="0"]')], i = f.indexOf(document.activeElement); if (!f.length || (e.shiftKey ? i <= 0 : i === f.length - 1)) { e.preventDefault(); f.at(e.shiftKey ? -1 : 0)?.focus(); } return; }
    if (FD.sheetOwner?.id === 'hammer') return; if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) { e.preventDefault(); e.stopPropagation(); } });
  sheet.addEventListener('wheel', e => { e.preventDefault(); e.stopPropagation(); }, { passive: false });
  document.addEventListener('keydown', e => { if (e.key !== 'Escape') return; if (FD.popOwner || FD.sheetOwner) { e.preventDefault(); closePop(); closeSheet(); } else if (stepsRelease()) e.preventDefault(); });
  // A popup closes on a press anywhere but a find (a find opens its own popup or keeps it) or a control inside the popup.
  // On a phone in explore a popup can sit over the other chests, and there is no Escape key to close it.
  document.addEventListener('pointerdown', e => { if (!FD.popOwner) return; const t = e.target?.closest ? e.target : null; if (t && (t.closest('.find') || t.closest('.pop button, .pop a'))) return; closePop(); }, true);
  matchMedia('(hover: hover)').addEventListener('change', e => FD.hover = e.matches);
  tlSetCount(0, FINDS.length);
}
export function findKitStyle() {
  const P = FIND_PLAY, root = document.documentElement;
  const vars = { 'find-pop-edge': P.kit.popup.edge + 'px', 'find-pop-w': P.kit.popup.width + 'px', 'find-pop-r': P.kit.popup.radius + 'px', 'find-pop-pad': P.kit.popup.pad.map(n => n + 'px').join(' '), 'find-pop-font': P.kit.popup.font + 'px', 'find-pop-line': P.kit.popup.line, 'find-kicker': P.kit.popup.kicker + 'px', 'find-gap': P.kit.popup.gap + 'px', 'find-tail-w': P.kit.popup.tail[0] + 'px', 'find-tail-h': P.kit.popup.tail[1] + 'px', 'find-slot-weight': P.kit.slot.weight, 'find-star-z': P.kit.starZ, 'find-slot-font': P.kit.slot.font + 'px', 'find-slot-rule': P.kit.slot.border + 'px', 'find-slot-pad': P.kit.slot.pad + 'px', 'find-star': P.star.size + 'px', 'find-piece': P.hoard.width + 'px', 'find-piece-top': P.hoard.top + 'px', 'find-icon': P.hoard.icon + 'px', 'find-arm': P.way.armWidth + 'px', 'find-rune-flip': P.rune.flipTime + 's', 'find-rune-w': P.rune.width + 'px', 'find-rune-h': P.rune.height + 'px', 'find-rune-perspective': P.rune.perspective + 'px', 'find-ctl-top': P.rune.controlTop + 'px', 'find-reel-w': P.raven.reel.width + 'px', 'find-iris': P.raven.reel.iris + 'px', 'find-reel-label': P.raven.reel.labelTop + 'px', 'find-reel-slot': P.raven.reel.slotBottom + 'px' };
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty('--' + k, v));
}
export function findKitFrame() {
  const dt = FD.dt;
  FD.bits.forEach(b => {
    if (!b.live) return; b.age += dt;
    if (b.age >= b.life) { b.live = false; attr(b.el, 'opacity', 0); queueMicrotask(() => { if (!b.live) b.el.style.display = 'none'; }); return; }
    b.vy += b.g * dt; b.vx *= Math.max(0, 1 - b.drag * dt); b.vy *= Math.max(0, 1 - b.drag * dt); b.x += b.vx * dt; b.y += b.vy * dt;
    const q = b.age / b.life;
    attr(b.el, 'transform', `translate(${b.x} ${b.y}) rotate(${b.spin * b.age}) scale(${lerp(b.size[0], b.size[1], q)})`); attr(b.el, 'opacity', b.alpha * (1 - q ** 2));
  });
  const f = FD.flight;
  if (f) {
    const q = clamp01((FD.now - f.ts) / FIND_PLAY.star.time), k = ease(q);
    FD.star.style.opacity = 1; FD.star.style.transform = `translate(${lerp(f.from[0], f.to[0], k)}px,${lerp(f.from[1], f.to[1], k) - FIND_PLAY.star.arc * Math.sin(Math.PI * q)}px)`;
    if (q === 1) { FD.landed = f.number; FD.bump = FD.now; FD.flight = null; FD.star.style.opacity = 0; queueMicrotask(() => { findLandCount(); findStartFlight(); }); }
  }
  if (FD.bump !== undefined) { const q = clamp01((FD.now - FD.bump) / FIND_PLAY.star.bump); FD.count.style.transform = `scale(${lerp(FIND_PLAY.star.peak, 1, ease(q))})`; if (q === 1) FD.bump = undefined; }
  placePop();
  if (FD.popOwner && Math.abs(FD.st.P - FD.popP) > FIND_TIMING.closeScroll) closePop();
  if (FD.sheetOwner && Math.abs(FD.st.P - FD.sheetP) > FIND_TIMING.closeScroll) closeSheet();
}
// The hint line keeps its words while it fades out, so it changes only when a find takes the camera.
export function findHint(id) { if (FD.hint && id) FD.hint.textContent = FD.list.hoards?.items.find(h => h.id === id)?.hintLine || FIND_COPY.hints[id.startsWith('hoard') ? 'hoards' : id] || ''; }
export function findCapture(e) {
  if (FD.rm || JOURNEY.mode !== 'steps' || !FD.st) return;
  if (e.type === 'keydown' && !['Enter', ' '].includes(e.key)) return;
  const el = e.target.closest?.('.find'); if (!el) return;
  if (e.type === 'click' && el._focusBlocked) { el._focusBlocked = false; e.preventDefault(); e.stopImmediatePropagation(); return; }
  const id = el.id.slice(2), key = id === 'hoards' ? FIND_COPY.hoards[0].id : id;
  if (JOURNEY.focus === key) return;
  if (!stepsFocus(key, findView(key))) { if (e.type === 'pointerdown') el._focusBlocked = true; e.preventDefault(); e.stopImmediatePropagation(); }
  else { FD.overlayEpoch++; closePop(); closeSheet(true); if (e.type === 'pointerdown') el._focusBlocked = false; }
}
