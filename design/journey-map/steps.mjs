// The single progress owner for both clock-driven Steps and the original Scroll mode.
import { STEPS, COPY, STOPS, DEPTH, NOVA } from './data.mjs';
import { VIEW, TOTAL_P } from './trip.mjs';
import { BEATS, paceMove, paceAt, paceP } from './pace.mjs';
import { arrowSvg } from './cards.mjs';

const SC = {
  mode: 'steps', P: 0, rm: false, move: null, cut: null, lastTs: null, fill: 0, returnP: null,
  root: null, go: null, cover: null, say: null, review: null, resize: null, joinedTop: null,
  restoreP: null, restoration: 'auto', announced: null, shown: false, ready: false, wheel: null, touch: null,
};
const stepsEnd = BEATS[BEATS.length - 1].P;
const stepsClamp = p => Math.max(0, Math.min(stepsEnd, Number.isFinite(p) ? p : 0));
const stepsNextBeat = () => BEATS.find(b => b.P > SC.P + .5);
const stepsBackBeat = () => BEATS.slice().reverse().find(b => b.P < SC.P - .5);
const stepsRestBeat = () => BEATS.find(b => Math.abs(b.P - SC.P) < 1e-6);
const stepsName = b => b ? COPY.steps.names[b.id] || STOPS.find(s => s.id === b.id).short : COPY.steps.names.top;
const stepsFormat = (s, values) => s.replace(/\{(\w+)\}/g, (m, k) => values[k]);
const stepsReadScroll = () => { SC.P = window.scrollY / VIEW.unit; return SC.P; };
const stepsScrollTo = (p, smooth) => {
  window.scrollTo({ top: p * VIEW.unit, behavior: smooth && !SC.rm ? 'smooth' : 'instant' });
  if (!smooth || SC.rm) stepsReadScroll();
};

export const JOURNEY = {
  get mode() { return SC.mode; }, get P() { return SC.P; }, get moving() { return !!(SC.move || SC.cut); },
  get visiting() { return SC.returnP !== null; }, depth: DEPTH, nova: NOVA, setDepth: stepsSetDepth,
  beats: BEATS, go: stepsGo, next: stepsNext, back: stepsBack, set: stepsSet, setMode: stepsSetMode,
};
export const stepsProgress = () => SC.P;
export const stepsPause = () => { SC.lastTs = null; };
export const stepsJumping = () => !!SC.cut;

function stepsClasses() {
  if (SC.rm) return;
  SC.root.classList.toggle('jm-steps', SC.mode === 'steps'); SC.root.classList.toggle('jm-scroll', SC.mode === 'scroll');
  try { history.scrollRestoration = SC.mode === 'steps' ? 'manual' : SC.restoration; } catch {}
  if (SC.review) SC.review.querySelectorAll('[data-mode]').forEach(b => b.setAttribute('aria-pressed', b.dataset.mode === SC.mode));
}
function stepsSetDepth(on) {
  VIEW.depth = on ? 1 : 0;
  if (SC.review) SC.review.querySelector('[data-depth]').setAttribute('aria-pressed', String(!!VIEW.depth));
  window.dispatchEvent(new Event('jm-depth'));
}
function stepsButtons() {
  if (!SC.go) return;
  const top = SC.P <= 1e-6, end = !JOURNEY.moving && Math.abs(SC.P - stepsEnd) < 1e-6;
  SC.go.hidden = !SC.ready || SC.mode !== 'steps' || (top && SC.joinedTop());
  SC.go.classList.toggle('go-end', end);
  const back = SC.go.querySelector('.go-back'), next = SC.go.querySelector('.go-next'), home = SC.go.querySelector('.go-top');
  const focus = document.activeElement;
  back.hidden = top && SC.returnP === null; next.hidden = end; home.hidden = !end;
  if (!SC.go.hidden && ((next.hidden && focus === next) || (home.hidden && focus === home))) back.focus({ preventScroll: true });
  if (!SC.go.hidden && back.hidden && focus === back) next.focus({ preventScroll: true });
  back.setAttribute('aria-label', SC.returnP !== null ? COPY.steps.returnTo : stepsFormat(COPY.steps.back, { name: stepsName(stepsBackBeat()) }));
  if (!SC.go.hidden && !SC.shown) { SC.shown = true; SC.go.classList.add('go-reveal'); }
  SC.root.classList.toggle('jm-moving', JOURNEY.moving);
  SC.go.querySelector('.go-fill').style.transform = `scaleX(${SC.move ? SC.fill : 0})`;
}
function stepsArrive() {
  if (SC.rm) return;
  if (SC.mode === 'scroll') { SC.root.dataset.beat = ''; SC.say.textContent = ''; SC.announced = null; stepsButtons(); return; }
  const beat = stepsRestBeat(), next = stepsNextBeat(), s = COPY.steps;
  SC.root.dataset.beat = beat ? beat.id : '';
  let label = s.dig;
  if (next) label = next.id === 'map' ? s.start : next.id === STOPS[0].id ? s.setOut : next.id === 'x' ? s.toX : next.id === 'end' ? s.dig : stepsFormat(s.next, { name: stepsName(next) });
  SC.go.querySelector('.go-t').textContent = label;
  if (beat && SC.announced !== beat.id) {
    const i = STOPS.findIndex(stop => stop.id === beat.id);
    SC.say.textContent = i < 0 ? s.say[beat.id] : stepsFormat(s.say.stop, { n: i + 1, t: STOPS.length, name: STOPS[i].name, dates: STOPS[i].dates });
  }
  SC.announced = beat ? beat.id : null;
  stepsButtons();
}
function stepsCancel() {
  SC.move = null; SC.cut = null; SC.fill = 0;
  if (SC.cover) { SC.cover.style.opacity = 0; SC.cover.hidden = true; }
}
function stepsPlay(target) {
  const p = stepsClamp(target);
  if (SC.move && Math.abs(SC.move.P1 - p) < 1e-6) {
    const left = SC.move.D - SC.move.elapsed;
    SC.move = { ...paceMove(SC.P, p), D: Math.min(left, STEPS.hurry), elapsed: 0, hurry: true, baseFill: SC.fill };
  } else SC.move = { ...paceMove(SC.P, p), elapsed: 0, baseFill: 0 };
  SC.root.dataset.beat = ''; stepsButtons();
}
function stepsJump(target, after) {
  stepsCancel(); SC.cut = { target: stepsClamp(target), elapsed: 0, placed: false, after };
  SC.cover.hidden = false; SC.cover.style.opacity = 0; SC.root.dataset.beat = ''; stepsButtons();
}
function stepsNavigate(target, opts = {}) {
  if (SC.cut) return;
  if (SC.mode === 'scroll') { stepsScrollTo(target, !opts.instant); return; }
  if (opts.instant) { stepsCancel(); SC.P = stepsClamp(target); if (SC.restoreP !== null) SC.restoreP = SC.P; stepsArrive(); return; }
  const lo = Math.min(SC.P, target), hi = Math.max(SC.P, target);
  if (opts.jump || (!opts.move && BEATS.some(b => b.P > lo + 1e-6 && b.P < hi - 1e-6))) stepsJump(target);
  else stepsPlay(target);
}
function stepsGo(id, opts = {}) {
  if (SC.cut) return;
  const beat = BEATS.find(b => b.id === id); if (!beat) return;
  SC.returnP = null; stepsNavigate(beat.P, opts);
}
function stepsNext() {
  if (SC.cut) return;
  SC.returnP = null; const beat = stepsNextBeat(); if (beat) stepsNavigate(beat.P, { move: true });
  stepsButtons();
}
function stepsBack() {
  if (SC.cut) return;
  if (SC.returnP !== null && SC.mode === 'steps') { const p = SC.returnP; SC.returnP = null; stepsJump(p); return; }
  SC.returnP = null; const beat = stepsBackBeat(); if (beat) stepsNavigate(beat.P, { move: true });
}
function stepsSet(P) {
  if (SC.cut) return;
  SC.returnP = null;
  if (SC.mode === 'scroll') { stepsScrollTo(Math.max(0, Math.min(TOTAL_P, P)), false); return; }
  stepsCancel(); SC.P = stepsClamp(P); if (SC.restoreP !== null) SC.restoreP = SC.P; stepsArrive();
}
export function stepsFind(P, after) {
  if (SC.cut || SC.mode !== 'steps') return;
  SC.returnP = SC.P; stepsJump(P, after);
}
function stepsSetMode(mode) {
  if (SC.rm || SC.cut || !['steps', 'scroll'].includes(mode) || mode === SC.mode) return;
  const p = SC.mode === 'scroll' ? stepsReadScroll() : SC.P;
  stepsCancel(); SC.returnP = null; SC.mode = mode; SC.P = mode === 'steps' ? stepsClamp(p) : p; SC.restoreP = SC.P;
  SC.wheel = null; SC.touch = null; stepsClasses();
  if (mode === 'steps') window.scrollTo({ top: 0, behavior: 'instant' });
  try { sessionStorage.setItem('jm-mode', mode); } catch {}
  SC.resize(); window.dispatchEvent(new Event('jm-mode'));
  stepsArrive();
  if (mode === 'steps') {
    const nearest = BEATS.reduce((a, b) => Math.abs(b.P - SC.P) < Math.abs(a.P - SC.P) ? b : a);
    stepsPlay(nearest.P);
  }
}
export function stepsResize() {
  if (SC.restoreP !== null) {
    SC.P = SC.restoreP; SC.restoreP = null;
    if (SC.mode === 'scroll') stepsScrollTo(SC.P, false);
    else window.scrollTo({ top: 0, behavior: 'instant' });
  } else if (SC.mode === 'scroll') stepsReadScroll();
  stepsButtons();
}
export function stepsFrame(ts) {
  SC.ready = true;
  const dt = SC.lastTs === null ? 0 : Math.max(0, Math.min(STEPS.frameMax, (ts - SC.lastTs) / 1000)); SC.lastTs = ts;
  if (SC.mode === 'scroll') { stepsReadScroll(); if (!SC.rm) stepsArrive(); return SC.P; }
  const move = SC.move, cut = SC.cut;
  if (move) {
    move.elapsed = Math.min(move.D, move.elapsed + dt);
    const q = move.D ? move.elapsed / move.D : 1;
    SC.P = move.hurry ? paceP(move.T0 + (move.T1 - move.T0) * (1 - Math.pow(1 - q, 3))) : paceAt(move, move.elapsed);
    SC.fill = move.baseFill + (1 - move.baseFill) * q;
    if (q >= 1) { SC.P = move.P1; SC.move = null; stepsArrive(); }
  } else if (cut) {
    cut.elapsed += dt;
    if (cut.elapsed < STEPS.cut[0]) SC.cover.style.opacity = cut.elapsed / STEPS.cut[0];
    else if (!cut.placed) { cut.placed = true; SC.P = cut.target; SC.cover.style.opacity = 1; }
    else SC.cover.style.opacity = Math.max(0, 1 - (cut.elapsed - STEPS.cut[0]) / STEPS.cut[1]);
    if (cut.placed && cut.elapsed >= STEPS.cut[0] + STEPS.cut[1]) {
      SC.cut = null; SC.cover.hidden = true; stepsArrive(); if (cut.after) cut.after();
    }
  }
  stepsButtons(); return SC.P;
}
const stepsTarget = e => e.target && e.target.closest ? e.target : null;
const stepsCanScroll = (face, direction) => !!(face && direction && (direction > 0 ? face.scrollTop + face.clientHeight < face.scrollHeight - 1 : face.scrollTop > 1));
function stepsWheel(e) {
  if (SC.mode !== 'steps' || SC.rm || e.ctrlKey) return;
  const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? window.innerHeight : 1), direction = Math.sign(dy);
  const target = stepsTarget(e);
  if (stepsCanScroll(target && target.closest('.face'), direction)) return;
  e.preventDefault(); if (!direction) return;
  if (!SC.wheel || e.timeStamp - SC.wheel.time >= STEPS.wheel.quiet || SC.wheel.direction !== direction) SC.wheel = { time: e.timeStamp, direction, sum: 0, used: false };
  const gesture = SC.wheel; gesture.time = e.timeStamp; gesture.sum += Math.abs(dy);
  if (!gesture.used && gesture.sum >= STEPS.wheel.min) { gesture.used = true; if (direction > 0) stepsNext(); else stepsBack(); }
}
function stepsKey(e) {
  if (SC.mode !== 'steps' || SC.rm || e.defaultPrevented || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
  const target = stepsTarget(e);
  if (target && target.closest('.tl')) return;
  if (e.key === ' ' && target && target.closest('button, a, input, textarea, select, .find, [role="button"]')) return;
  let act = null;
  if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey)) act = stepsNext;
  else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey)) act = stepsBack;
  else if (e.key === 'Home') act = () => stepsGo('top');
  else if (e.key === 'End') act = () => stepsGo('end');
  if (act) { e.preventDefault(); act(); }
}
function stepsTouchStart(e) {
  SC.touch = null; if (SC.mode !== 'steps' || SC.rm || e.touches.length !== 1) return;
  const target = stepsTarget(e);
  if (target && target.closest('.tl, .find, .pop, .sheet, .go, [data-review]')) return;
  const t = e.touches[0], face = target && target.closest('.face');
  SC.touch = { id: t.identifier, x: t.clientX, y: t.clientY, up: stepsCanScroll(face, -1), down: stepsCanScroll(face, 1), used: false };
}
function stepsTouchMove(e) {
  if (e.touches.length !== 1) { SC.touch = null; return; }
  stepsTouchAct(e, e.touches[0]);
}
function stepsTouchAct(e, t) {
  const touch = SC.touch;
  if (!touch || touch.used || !t || t.identifier !== touch.id || SC.mode !== 'steps') return;
  const dy = touch.y - t.clientY, dx = t.clientX - touch.x;
  if (Math.abs(dy) < STEPS.swipe.min || Math.abs(dy) < Math.abs(dx) * STEPS.swipe.slope) return;
  touch.used = true; if (dy > 0 ? touch.down : touch.up) return;
  if (e.cancelable) e.preventDefault(); if (dy > 0) stepsNext(); else stepsBack();
}
function stepsTouchEnd(e) {
  if (e.touches.length) { SC.touch = null; return; }
  stepsTouchAct(e, e.changedTouches[0]); SC.touch = null;
}
export function stepsBuild({ stage, rm, resize, joinedTop }) {
  SC.root = document.documentElement; SC.rm = rm; SC.resize = resize; SC.joinedTop = joinedTop;
  VIEW.depth = new URLSearchParams(window.location.search).get('depth') === '0' ? 0 : 1;
  window.__jm = JOURNEY;
  window.addEventListener('scroll', () => { if (SC.mode === 'scroll') stepsReadScroll(); }, { passive: true });
  if (rm) { SC.mode = 'scroll'; return; }
  const params = new URLSearchParams(window.location.search); let saved;
  try { saved = sessionStorage.getItem('jm-mode'); } catch {}
  const requested = params.get('mode'); SC.mode = ['steps', 'scroll'].includes(requested) ? requested : ['steps', 'scroll'].includes(saved) ? saved : 'steps';
  try { SC.restoration = history.scrollRestoration; } catch {}
  const beat = BEATS.find(b => b.id === params.get('beat'));
  SC.P = beat ? beat.P : SC.mode === 'scroll' ? Math.max(0, window.scrollY / (window.innerHeight / 100)) : 0;
  SC.restoreP = SC.P;
  const s = COPY.steps;
  SC.go = document.createElement('div'); SC.go.className = 'go'; SC.go.id = 'go'; SC.go.hidden = true; SC.go.setAttribute('role', 'group'); SC.go.setAttribute('aria-label', s.group);
  SC.go.innerHTML = `<button class="go-back" type="button" aria-label="${s.back.replace('{name}', s.names.top)}">${arrowSvg}</button><button class="go-next" type="button"><i class="go-fill" aria-hidden="true"></i><span class="go-t">${s.start}</span>${arrowSvg}</button><button class="go-top" type="button">${s.top}</button>`;
  SC.say = document.createElement('p'); SC.say.className = 'sr'; SC.say.id = 'go-say'; SC.say.setAttribute('role', 'status');
  SC.cover = document.createElement('div'); SC.cover.className = 'jm-cut'; SC.cover.hidden = true; SC.cover.setAttribute('aria-hidden', 'true');
  stage.prepend(SC.go, SC.say, SC.cover);
  SC.go.addEventListener('animationend', () => SC.go.classList.remove('go-reveal'));
  SC.go.querySelector('.go-back').addEventListener('click', stepsBack); SC.go.querySelector('.go-next').addEventListener('click', stepsNext); SC.go.querySelector('.go-top').addEventListener('click', () => stepsGo('top'));
  SC.review = document.createElement('div'); SC.review.className = 'jm-review'; SC.review.dataset.review = ''; SC.review.setAttribute('role', 'group'); SC.review.setAttribute('aria-label', s.review.label);
  SC.review.innerHTML = `<span>${s.review.label}</span><button type="button" data-mode="steps">${s.review.steps}</button><button type="button" data-mode="scroll">${s.review.scroll}</button><button type="button" data-depth aria-pressed="${!!VIEW.depth}">${s.review.depth}</button>`;
  SC.review.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => stepsSetMode(b.dataset.mode)));
  SC.review.querySelector('[data-depth]').addEventListener('click', () => stepsSetDepth(!VIEW.depth)); document.body.appendChild(SC.review);
  const vars = { 'go-h': STEPS.nav.h + 'px', 'go-gap': STEPS.nav.gap + 'px', 'go-bar': STEPS.nav.bar + 'px', 'go-reveal': STEPS.reveal + 's' };
  Object.entries(vars).forEach(([k, v]) => SC.root.style.setProperty('--' + k, v));
  stepsClasses(); stepsArrive();
  if (SC.mode === 'steps') window.scrollTo({ top: 0, behavior: 'instant' });
  window.addEventListener('wheel', stepsWheel, { passive: false }); window.addEventListener('keydown', stepsKey);
  window.addEventListener('touchstart', stepsTouchStart, { passive: true }); window.addEventListener('touchmove', stepsTouchMove, { passive: false }); window.addEventListener('touchend', stepsTouchEnd, { passive: false });
}
