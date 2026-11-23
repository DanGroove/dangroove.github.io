// The single progress owner: button/key Steps, with scroll only for the reduced-motion page.
import { STEPS, COPY, STOPS, DEPTH, NOVA, FIND_PLAY, EXPLORE, WORLD } from './data.mjs';
import { VIEW, TOTAL_P, tripState, easeIO, lerp } from './trip.mjs';
import { BEATS, paceMove, paceAt, paceP } from './pace.mjs';
import { arrowSvg } from './cards.mjs';
import { exploreActive, exploreBusy, exploreStart, exploreEnd, exploreReset, exploreDepart } from './explore.mjs';

const SC = {
  mode: 'steps', P: 0, rm: false, move: null, cut: null, lastTs: null, fill: 0, focus: null,
  root: null, go: null, cover: null, say: null, review: null, joinedTop: null,
  restoreP: null, announced: null, shown: false, ready: false, endShown: false,
};
const stepsEnd = BEATS[BEATS.length - 1].P;
const stepsClamp = p => Math.max(0, Math.min(stepsEnd, Number.isFinite(p) ? p : 0));
const stepsNextBeat = () => BEATS.find(b => b.P > SC.P + .5);
const stepsBackBeat = () => BEATS.slice().reverse().find(b => b.P < SC.P - .5);
const stepsRestBeat = () => BEATS.find(b => Math.abs(b.P - SC.P) < 1e-6);
const stepsName = b => b ? COPY.steps.names[b.id] || STOPS.find(s => s.id === b.id).short : COPY.steps.names.top;
const stepsFormat = (s, values) => s.replace(/\{(\w+)\}/g, (m, k) => values[k]);
const stepsReadScroll = () => { SC.P = window.scrollY / VIEW.unit; return SC.P; };

export const JOURNEY = {
  get mode() { return SC.mode; }, get P() { return SC.P; }, get moving() { return !!(SC.move || SC.cut); },
  get visiting() { return !!SC.focus?.held; }, get focus() { return SC.focus?.held ? SC.focus.id : null; }, depth: DEPTH, nova: NOVA, setDepth: stepsSetDepth,
  beats: BEATS, go: stepsGo, next: stepsNext, back: stepsBack, set: stepsSet,
};
export const stepsProgress = () => SC.P;
export const stepsPause = () => { SC.lastTs = null; };
export const stepsJumping = () => !!SC.cut;

export function stepsFocusNow() {
  const f = SC.focus; if (!f) return null;
  const q = easeIO(f.swap), view = Array.from({ length: Math.max(f.from.length, f.to.length) }, (_, i) => { const a = f.from[i] ?? FIND_PLAY.focus.least, b = f.to[i] ?? FIND_PLAY.focus.least; return i === 2 ? a * (b / a) ** q : lerp(a, b, q); });
  return { id: f.id, view, k: easeIO(f.k) };
}
export function stepsFocus(id, view) {
  const st = tripState(SC.P);
  if (SC.rm || SC.mode !== 'steps' || SC.cut || st.handoffT !== 1 || st.rushT !== 0) return false;
  const now = stepsFocusNow(), old = SC.focus;
  stepsCancel();
  SC.focus = { id, from: now ? now.view : view.slice(), to: view.slice(), swap: now ? 0 : 1, k: old ? old.k : 0, held: true };
  SC.root.classList.add('jm-focus'); stepsArrive(); return true;
}
export function stepsRelease() {
  if (!SC.focus || !SC.focus.held) return false;
  SC.focus.held = false; SC.root.classList.remove('jm-focus');
  window.dispatchEvent(new Event('jm-find-release')); stepsButtons(); return true;
}

function stepsClasses() {
  if (SC.rm) return;
  SC.root.classList.add('jm-steps');
  try { history.scrollRestoration = 'manual'; } catch {}
}
function stepsSetDepth(on) {
  VIEW.depth = on ? 1 : 0;
  if (SC.review) SC.review.querySelector('[data-depth]').setAttribute('aria-pressed', String(!!VIEW.depth));
  window.dispatchEvent(new Event('jm-depth'));
}
function stepsButtons() {
  if (!SC.go) return;
  const top = SC.P <= 1e-6, end = !JOURNEY.moving && Math.abs(SC.P - stepsEnd) < 1e-6;
  const beatState = tripState(SC.P), blasting = beatState.kind === 'rush' ? JOURNEY.moving || beatState.t > 0 : ['blast', 'settle'].includes(beatState.kind);
  if (blasting && !SC.go.hidden) { SC.returnFocus = SC.go.contains(document.activeElement); SC.shown = false; }
  SC.go.hidden = !SC.ready || SC.mode !== 'steps' || (top && SC.joinedTop()) || blasting;
  SC.go.classList.toggle('go-end', end);
  const back = SC.go.querySelector('.go-back'), next = SC.go.querySelector('.go-next'), home = SC.go.querySelector('.go-top');
  const focus = document.activeElement;
  back.hidden = top && !JOURNEY.visiting; next.hidden = end && exploreBusy(); home.hidden = !end;
  if (end && !SC.endShown) { SC.endShown = true; SC.go.classList.add('go-reveal'); }
  if (!end) SC.endShown = false;
  if (!SC.go.hidden && ((next.hidden && focus === next) || (home.hidden && focus === home))) back.focus({ preventScroll: true });
  if (!SC.go.hidden && back.hidden && focus === back) next.focus({ preventScroll: true });
  const returning = exploreActive() ? COPY.explore.back : JOURNEY.visiting ? COPY.steps.returnTo : '';
  back.setAttribute('aria-label', returning || stepsFormat(COPY.steps.back, { name: stepsName(stepsBackBeat()) }));
  back.querySelector('span').textContent = returning;
  if (end) SC.go.querySelector('.go-t').textContent = COPY.explore.button;
  if (!SC.go.hidden && SC.returnFocus) { SC.returnFocus = false; next.focus({ preventScroll: true }); }
  if (!SC.go.hidden && !SC.shown) { SC.shown = true; SC.go.classList.add('go-reveal'); }
  SC.root.classList.toggle('jm-moving', JOURNEY.moving);
  SC.go.querySelector('.go-fill').style.transform = `scaleX(${SC.move ? SC.fill : 0})`;
}
function stepsArrive() {
  if (SC.rm) return;
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
  if (target !== stepsEnd) exploreDepart();
  stepsCancel(); SC.cut = { target: stepsClamp(target), elapsed: 0, placed: false, after };
  SC.cover.hidden = false; SC.cover.style.opacity = 0; SC.root.dataset.beat = ''; stepsButtons();
}
function stepsNavigate(target, opts = {}) {
  if (SC.cut) return;
  if (SC.rm) { window.scrollTo({ top: target * VIEW.unit, behavior: 'instant' }); stepsReadScroll(); return; }
  if (opts.instant) { if (target !== stepsEnd) exploreReset(); stepsCancel(); SC.P = stepsClamp(target); if (SC.restoreP !== null) SC.restoreP = SC.P; stepsArrive(); return; }
  const lo = Math.min(SC.P, target), hi = Math.max(SC.P, target);
  if (opts.jump || (!opts.move && BEATS.some(b => b.P > lo + 1e-6 && b.P < hi - 1e-6))) stepsJump(target);
  else { if (target !== stepsEnd) exploreReset(); stepsPlay(target); }
}
function stepsGo(id, opts = {}) {
  if (SC.cut) return;
  const beat = BEATS.find(b => b.id === id); if (!beat) return;
  stepsRelease(); stepsNavigate(beat.P, opts);
}
function stepsNext() {
  if (SC.cut) return;
  stepsRelease(); const beat = stepsNextBeat(); if (beat) stepsNavigate(beat.P, { move: true });
  stepsButtons();
}
function stepsBack() {
  if (SC.cut) return;
  if (exploreEnd()) { stepsButtons(); return; }
  if (stepsRelease()) return;
  const beat = stepsBackBeat(); if (beat) stepsNavigate(beat.P, { move: true });
}
function stepsSet(P) {
  if (SC.cut) return;
  stepsRelease();
  if (SC.rm) { window.scrollTo({ top: Math.max(0, Math.min(TOTAL_P, P)) * VIEW.unit, behavior: 'instant' }); stepsReadScroll(); return; }
  if (Math.abs(P - stepsEnd) > 1e-6) exploreReset();
  stepsCancel(); SC.P = stepsClamp(P); if (SC.restoreP !== null) SC.restoreP = SC.P; stepsArrive();
}
export function stepsResize() {
  if (SC.restoreP !== null) {
    SC.P = SC.restoreP; SC.restoreP = null;
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else if (SC.rm) stepsReadScroll();
  stepsButtons();
}
export function stepsFrame(ts) {
  SC.ready = true;
  const dt = SC.lastTs === null ? 0 : Math.max(0, Math.min(STEPS.frameMax, (ts - SC.lastTs) / 1000)); SC.lastTs = ts;
  if (SC.rm) { stepsReadScroll(); return SC.P; }
  const move = SC.move, cut = SC.cut;
  if (SC.focus) {
    const f = SC.focus, cfg = FIND_PLAY.focus;
    f.swap = Math.min(1, f.swap + dt / cfg.swap);
    f.k = f.held ? Math.min(1, f.k + dt / cfg.in) : Math.max(0, f.k - dt / cfg.out);
    if (!f.held && f.k === 0) SC.focus = null;
  }
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
function stepsBlockWheel(e) {
  if (SC.rm || e.ctrlKey || exploreActive() || e.defaultPrevented) return;
  const target = stepsTarget(e), direction = Math.sign(e.deltaY);
  if (target?.closest('.sheet.on')) { e.preventDefault(); return; }
  if (stepsCanScroll(target?.closest('.face'), direction)) return;
  e.preventDefault();
}
function stepsKey(e) {
  if (SC.mode !== 'steps' || SC.rm || exploreActive() || e.defaultPrevented || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
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
export function stepsBuild({ stage, rm, joinedTop }) {
  SC.root = document.documentElement; SC.rm = rm; SC.joinedTop = joinedTop;
  VIEW.depth = new URLSearchParams(window.location.search).get('depth') === '0' ? 0 : 1;
  window.__jm = JOURNEY;
  window.addEventListener('scroll', () => { if (SC.rm) stepsReadScroll(); }, { passive: true });
  if (rm) { SC.mode = 'scroll'; return; }
  const params = new URLSearchParams(window.location.search); SC.mode = 'steps';
  const beat = BEATS.find(b => b.id === params.get('beat'));
  SC.P = beat ? beat.P : 0;
  SC.restoreP = SC.P;
  const s = COPY.steps;
  SC.go = document.createElement('div'); SC.go.className = 'go'; SC.go.id = 'go'; SC.go.hidden = true; SC.go.setAttribute('role', 'group'); SC.go.setAttribute('aria-label', s.group);
  SC.go.innerHTML = `<button class="go-back" type="button" aria-label="${s.back.replace('{name}', s.names.top)}">${arrowSvg}<span></span></button><button class="go-next" type="button"><i class="go-fill" aria-hidden="true"></i><span class="go-t">${s.start}</span>${arrowSvg}</button><button class="go-top" type="button">${s.top}</button>`;
  SC.say = document.createElement('p'); SC.say.className = 'sr'; SC.say.id = 'go-say'; SC.say.setAttribute('role', 'status');
  SC.cover = document.createElement('div'); SC.cover.className = 'jm-cut'; SC.cover.hidden = true; SC.cover.setAttribute('aria-hidden', 'true');
  stage.prepend(SC.go, SC.say, SC.cover);
  SC.go.addEventListener('animationend', () => SC.go.classList.remove('go-reveal'));
  SC.go.querySelector('.go-back').addEventListener('click', stepsBack);
  SC.go.querySelector('.go-next').addEventListener('click', () => { if (!JOURNEY.moving && SC.P === stepsEnd) { exploreStart(); stepsButtons(); } else stepsNext(); });
  SC.go.querySelector('.go-top').addEventListener('click', () => stepsGo('top'));
  SC.review = document.createElement('div'); SC.review.className = 'jm-review'; SC.review.dataset.review = ''; SC.review.setAttribute('role', 'group'); SC.review.setAttribute('aria-label', s.review.label);
  SC.review.innerHTML = `<span>${s.review.label}</span><button type="button" data-depth aria-pressed="${!!VIEW.depth}">${s.review.depth}</button>`;
  SC.review.querySelector('[data-depth]').addEventListener('click', () => stepsSetDepth(!VIEW.depth)); document.body.appendChild(SC.review);
  const vars = { 'go-h': STEPS.nav.h + 'px', 'go-gap': STEPS.nav.gap + 'px', 'go-bar': STEPS.nav.bar + 'px', 'go-reveal': STEPS.reveal + 's', 'go-top-pad': WORLD.card.topPad + 'px', 'go-top-pad-x': WORLD.card.topPadX + 'px' };
  Object.entries(vars).forEach(([k, v]) => SC.root.style.setProperty('--' + k, v));
  Object.entries(EXPLORE.bar).forEach(([k, v]) => SC.root.style.setProperty('--explore-' + k, v + 'px'));
  stepsClasses(); stepsArrive();
  if (SC.mode === 'steps') window.scrollTo({ top: 0, behavior: 'instant' });
  window.addEventListener('wheel', stepsBlockWheel, { passive: false }); window.addEventListener('keydown', stepsKey);
}
