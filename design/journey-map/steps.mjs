// The single progress owner: top/map scroll, then button/key Steps.
import { STEPS, COPY, STOPS, DEPTH, NOVA, FIND_PLAY, EXPLORE, WORLD, PHONE_LAYOUT, COMB } from './data.mjs';
import { VIEW, TOTAL_P, tripState, easeIO, lerp, glideMove, GLIDES, glideSeconds, tripWarmGlides } from './trip.mjs';
import { BEATS, PACE_PARTS, paceMove, paceAt, paceEase } from './pace.mjs';
import { arrowSvg } from './cards.mjs';
import { exploreActive, exploreBusy, exploreStart, exploreEnd, exploreReset, exploreDepart } from './explore.mjs';

const SC = {
  mode: 'steps', P: 0, rm: false, move: null, cut: null, lastTs: null, fill: 0, focus: null,
  root: null, go: null, cover: null, say: null, review: null, joinedTop: null,
  restoreP: null, announced: null, shown: false, ready: false, endShown: false,
  scrollLive: true, scroll: null, touch: null, pointerOwned: false, swallow: false, holdTop: null,
};
const stepsEnd = BEATS[BEATS.length - 1].P;
const stepsMap = BEATS[1].P;
const stepsClamp = p => Math.max(0, Math.min(stepsEnd, Number.isFinite(p) ? p : 0));
const stepsNextBeat = () => BEATS.find(b => b.P > SC.P + .5);
const stepsBackBeat = () => BEATS.slice().reverse().find(b => b.P < SC.P - .5);
const stepsRestBeat = () => BEATS.find(b => Math.abs(b.P - SC.P) < 1e-6);
const stepsName = b => b ? COPY.steps.names[b.id] || STOPS.find(s => s.id === b.id).short : COPY.steps.names.top;
const stepsBackName = b => b ? STOPS.find(s => s.id === b.id)?.short || COPY.steps.names[b.id] : COPY.steps.names.top;
const stepsFormat = (s, values) => s.replace(/\{(\w+)\}/g, (m, k) => values[k]);
const stepsReadScroll = () => { SC.P = window.scrollY / VIEW.unit; return SC.P; };
const stepsDestination = () => window.dispatchEvent(new Event('jm-destination'));

export const JOURNEY = {
  get direction() { return SC.direction; }, get mode() { return SC.mode; }, get P() { return SC.P; }, get moving() { return !!(SC.move || SC.cut); },
  get visiting() { return !!SC.focus?.held; }, get focus() { return SC.focus?.held ? SC.focus.id : null; }, depth: DEPTH, nova: NOVA, setDepth: stepsSetDepth,
  beats: BEATS, go: stepsGo, next: stepsNext, back: stepsBack, set: stepsSet,
};
export const stepsProgress = () => SC.P;
export const stepsPause = () => { SC.lastTs = null; };

export function stepsFocusNow() {
  const f = SC.focus; if (!f) return null;
  const q = easeIO(f.swap), view = Array.from({ length: Math.max(f.from.length, f.to.length) }, (_, i) => { const a = f.from[i] ?? FIND_PLAY.focus.least, b = f.to[i] ?? FIND_PLAY.focus.least; return i === 2 ? a * (b / a) ** q : lerp(a, b, q); });
  return { id: f.id, view, k: easeIO(f.k), swapped: f.swap === 1 };
}
export function stepsFocus(id, view) {
  const st = tripState(SC.P);
  // A find takes the camera only at rest: a press during a move (a glide, the hurry, a jump) is ignored, so the journey never parks between beats.
  if (SC.rm || SC.mode !== 'steps' || SC.cut || SC.move || st.handoffT !== 1 || st.rushT !== 0) return false;
  const now = stepsFocusNow(), old = SC.focus;
  stepsCancel();
  SC.focus = { id, from: now ? now.view : view.slice(), to: view.slice(), swap: now ? 0 : 1, k: old ? old.k : 0, held: true };
  SC.scrollLive = false; SC.root.classList.add('jm-focus'); stepsArrive(); return true;
}
export function stepsRelease(returnFocus = false) {
  if (!SC.focus || !SC.focus.held) return false;
  SC.focus.held = false; SC.root.classList.remove('jm-focus');
  window.dispatchEvent(new Event('jm-find-release')); stepsButtons();
  if (returnFocus && (document.activeElement===document.body || document.activeElement?.closest?.('.find,.pop,.sheet'))) SC.go?.querySelector('.go-back')?.focus({preventScroll:true});
  return true;
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
  const beatState = tripState(SC.P), blasting = beatState.kind === 'rush' ? !!SC.move || beatState.t > 0 : ['blast', 'settle'].includes(beatState.kind);
  if (blasting && !SC.go.hidden) { SC.returnFocus ||= SC.go.contains(document.activeElement); SC.shown = false; if (!SC.go.classList.contains('go-leaving')) SC.go.classList.add('go-leaving'); if (SC.returnFocus) { const nova = document.getElementById('nova-hit'); nova?.focus({ preventScroll: true }); } if (SC.say.textContent !== COMB.novaSay) SC.say.textContent = COMB.novaSay; }
  // Joined page: the bar waits for the map, so one Start shows at a time; focus follows (the bar at the map, the hero's Start above).
  const hero = SC.joinedTop() && SC.P < stepsMap - 1e-6, wasHidden = SC.go.hidden;
  if (hero && !wasHidden && SC.go.contains(document.activeElement)) SC.heroFocus = true;
  const hidden = !SC.ready || SC.mode !== 'steps' || hero || blasting;
  const aside = VIEW.h <= 440 && VIEW.w > 640 && SC.root.classList.contains('jm-sheet-open');
  if (SC.go.inert !== (hidden || aside)) SC.go.inert = hidden || aside;
  if (!blasting && SC.go.classList.contains('go-leaving')) SC.go.classList.remove('go-leaving');
  const faded = blasting && SC.go.classList.contains('go-leaving');
  if (faded && !SC.goFade) { SC.goFade = true; setTimeout(() => { SC.goFade = false; if (SC.go.classList.contains('go-leaving')) SC.go.hidden = true; }, 180); }
  if (!faded && SC.go.hidden !== hidden) SC.go.hidden = hidden;
  const lost = !document.activeElement || document.activeElement === document.body || !!document.activeElement.closest?.('[data-hero]');
  if (SC.heroFocus && top && !JOURNEY.moving) { SC.heroFocus = false; const start = document.querySelector?.('.jm-start'); if (start && lost) start.focus({ preventScroll: true }); }
  const landed = !JOURNEY.moving && Math.abs(SC.P - stepsMap) < 1e-6;
  if (landed && !SC.mapLanded && SC.joinedTop() && !SC.go.hidden && lost) SC.go.querySelector('.go-next').focus({ preventScroll: true });
  SC.mapLanded = landed;
  if (!hero) SC.heroFocus = false;
  if (SC.go.classList.contains('go-end') !== end) SC.go.classList.toggle('go-end', end);
  const back = SC.go.querySelector('.go-back'), next = SC.go.querySelector('.go-next'), home = SC.go.querySelector('.go-top');
  const focus = document.activeElement;
  for (const [el, hidden] of [[back, top && !JOURNEY.visiting], [next, end && exploreBusy()], [home, !end]]) if (el.hidden !== hidden) el.hidden = hidden;
  if (end && !SC.endShown) { SC.endShown = true; SC.go.classList.add('go-reveal'); }
  if (!end) SC.endShown = false;
  if (!SC.go.hidden && ((next.hidden && focus === next) || (home.hidden && focus === home))) back.focus({ preventScroll: true });
  if (!SC.go.hidden && back.hidden && focus === back) next.focus({ preventScroll: true });
  const returning = exploreActive() ? COPY.explore.back : JOURNEY.visiting ? COPY.steps.returnTo : '';
  const label = returning || stepsFormat(COPY.steps.back, { name: stepsBackName(stepsBackBeat()) });
  if (back.getAttribute('aria-label') !== label) back.setAttribute('aria-label', label);
  const words = back.querySelector('span'); if (words.textContent !== returning) words.textContent = returning;
  if (end) { const words = SC.go.querySelector('.go-t'); if (words.textContent !== COPY.explore.button) words.textContent = COPY.explore.button; }
  if (!SC.go.hidden && SC.returnFocus) { SC.returnFocus = false; if (focus === document.getElementById('nova-hit')) next.focus({ preventScroll: true }); }
  if (end && !SC.go.hidden && focus === document.getElementById('nova-hit')) next.focus({ preventScroll: true });
  if (!SC.go.hidden && !SC.shown) { SC.shown = true; SC.go.classList.add('go-reveal'); }
  if (SC.root.classList.contains('jm-moving') !== JOURNEY.moving) SC.root.classList.toggle('jm-moving', JOURNEY.moving);
  const fill = SC.go.querySelector('.go-fill'), transform = `scaleX(${SC.move ? SC.fill : 0})`;
  if (fill.style.transform !== transform) fill.style.transform = transform;
}
// The Next button's words for the beat at P. A jump writes them as soon as it lands under its cover, so the button never names
// the old next stop over the new view.
function stepsLabel() {
  const beat = stepsRestBeat(), next = stepsNextBeat(), s = COPY.steps;
  let label = s.dig;
  if (beat && beat.P === stepsEnd) label = COPY.explore.button;
  else if (next) label = next.id === 'map' ? s.start : next.id === STOPS[0].id ? s.setOut : next.id === 'x' ? s.toX : next.id === 'end' ? s.dig : stepsFormat(s.next, { name: stepsName(next) });
  SC.go.querySelector('.go-t').textContent = label;
}
function stepsArrive() {
  if (SC.rm) return;
  const beat = stepsRestBeat(), next = stepsNextBeat(), s = COPY.steps;
  if (beat) tripWarmGlides(beat.P);
  if (beat?.id === 'top') SC.scrollLive = true;
  SC.root.dataset.beat = beat ? beat.id : '';
  stepsLabel();
  if (beat && SC.announced !== beat.id) {
    const i = STOPS.findIndex(stop => stop.id === beat.id);
    SC.say.textContent = i < 0 ? s.say[beat.id] : stepsFormat(s.say.stop, { n: i + 1, t: STOPS.length, name: STOPS[i].name, dates: STOPS[i].dates });
  }
  SC.announced = beat ? beat.id : null;
  stepsButtons();
  if (beat?.id === 'map') queueMicrotask(stepsFirstShine);
}
function stepsCancel() {
  SC.move = null; SC.cut = null; SC.fill = 0; SC.pendingTarget = null;
  if (SC.cover) { SC.cover.style.opacity = 0; SC.cover.hidden = true; }
}
function stepsPlay(target, next = false) {
  const p = stepsClamp(target);
  const old = SC.move;
  SC.move = old ? stepsCarry(old, p, next && Math.abs(old.P1 - p) < 1e-6 && !old.hurry) : { ...(glideMove(SC.P, p) || paceMove(SC.P, p)), elapsed: 0, baseFill: 0 };
  // If the bounded carry cannot brake before the beat, remember the requested
  // reversal and turn there. Never discard an acknowledged press.
  SC.pendingTarget = old && SC.move === old && p !== old.P1 ? p : null;
  SC.root.dataset.beat = ''; SC.announced = null; stepsButtons();
}
// Exact position and derivative of the active clock. Camera/cards remain pure P functions.
function stepsCarryAt(move, q, speed = false) {
  const u = 1 - q, B = [u ** 5, 5 * u ** 4 * q, 10 * u ** 3 * q * q, 10 * u * u * q ** 3, 5 * u * q ** 4, q ** 5];
  const N = B.reduce((s, b, i) => s + b * move.points[i], 0), Z = B.reduce((s, b, i) => s + b * move.weights[i], 0);
  if (!speed) return N / Z;
  const dB = [u ** 4, 4 * u ** 3 * q, 6 * u * u * q * q, 4 * u * q ** 3, q ** 4];
  const dN = 5 * dB.reduce((s, b, i) => s + b * (move.points[i + 1] - move.points[i]), 0), dZ = 5 * dB.reduce((s, b, i) => s + b * (move.weights[i + 1] - move.weights[i]), 0);
  return (dN * Z - N * dZ) / (move.D * Z * Z);
}
function stepsMoveAt(move, t) {
  if (t <= 0) return move.P0;
  if (t >= move.D) return move.P1;
  const q = t / move.D;
  return move.carry ? move.P0 + stepsCarryAt(move, q) : move.glide ? lerp(move.P0, move.P1, q) : paceAt(move, t);
}
function stepsMoveSpeed(move, t) {
  if (t < 0 || t > move.D) return 0;
  const q = t / move.D;
  if (move.carry) return stepsCarryAt(move, q, true);
  if (move.glide) return (move.P1 - move.P0) / move.D;
  const r = Math.min(.5, STEPS.ramp / move.D), slope = q < r ? q / r : q > 1 - r ? (1 - q) / r : 1;
  const T = move.T0 + (move.T1 - move.T0) * paceEase(q, move.D);
  const part = PACE_PARTS.find(s => move.T1 > move.T0 ? T < s.t + s.seconds : T <= s.t + s.seconds) || PACE_PARTS.at(-1);
  return (part.b - part.a) / part.seconds * (move.T1 - move.T0) / move.D * slope / (1 - r);
}
function stepsCarryCurve(P0, P1, D, v0, v1, lo, hi) {
  // One rational quintic Hermite curve, with exact endpoint velocities and zero
  // endpoint P acceleration. Positive weights shorten handles near a beat while
  // keeping those derivatives. Its entire control hull stays in the stretch.
  const room0 = v0 > 0 ? hi - P0 : P0 - lo, room1 = v1 > 0 ? P1 - lo : hi - P1;
  if (P1 < lo || P1 > hi || v0 && room0 <= 0 || v1 && room1 <= 0) return null;
  const w = Math.max(1, v0 ? Math.abs(v0) * D / (5 * room0) : 1, v1 ? Math.abs(v1) * D / (5 * room1) : 1), delta = P1 - P0;
  const z = Math.max(1, v0 ? Math.abs(v0) * D * (5 * w - 1) / (10 * room0) : 1, v1 ? Math.abs(v1) * D * (5 * w - 1) / (10 * room1) : 1);
  const handle = (5 * w - 1) / (10 * z), weights = [1, w, z, z, w, 1];
  const points = [0, v0 * D / (5 * w), v0 * D * handle, delta - v1 * D * handle, delta - v1 * D / (5 * w), delta];
  return { weights, points: points.map((p, i) => p * weights[i]) };
}
function stepsCarryGate(move, old) {
  const dt = STEPS.carry.sample;
  if (!move.glide) {
    // Pace-score continuity uses the uninterrupted move's largest 16 ms speed change.
    let largest = 0, before = stepsMoveSpeed(old, 0);
    for (let t = dt; t < old.D + dt; t += dt) { const v = stepsMoveSpeed(old, Math.min(t, old.D)); largest = Math.max(largest, Math.abs(v - before)); before = v; }
    return Math.abs(stepsMoveSpeed(move, dt) - stepsMoveSpeed(old, old.elapsed - dt)) <= largest + 1e-9;
  }
  const points = [[.5,.5],[.25,.25],[.75,.25],[.25,.75],[.75,.75]].map(p => [p[0] * VIEW.w, p[1] * VIEW.h]);
  const velocity = (a, b) => points.map(p => [(b.tx + (p[0] - a.tx) * b.s / a.s - p[0]) / dt, (b.ty + (p[1] - a.ty) * b.s / a.s - p[1]) / dt]);
  let camera = tripState(move.P0).cam;
  let speed = velocity(tripState(stepsMoveAt(old, old.elapsed - dt)).cam, camera);
  // Measured against the screen's longer side, so a portrait phone brakes as firmly as a desktop (critique round 5, D5-1).
  const limit = Math.max(VIEW.w, VIEW.h) * (move.hurry ? STEPS.carry.hurryAcceleration : STEPS.carry.acceleration);
  for (let t = dt; t < move.D + 2 * dt; t += dt) {
    const next = tripState(stepsMoveAt(move, t)).cam, v = velocity(camera, next);
    if (!v.flat().every(Number.isFinite) || Math.hypot(...v[0].map((x, k) => (x - speed[0][k]) / dt)) > limit) return false;
    camera = next; speed = v;
  }
  return true;
}
function stepsCarry(old, target, hurry) {
  const cfg = STEPS.carry, normal = glideMove(SC.P, target) || paceMove(SC.P, target);
  const left = old.D - old.elapsed;
  const g = normal.glide && GLIDES.find(g => SC.P >= g.a && SC.P <= g.b && target >= g.a && target <= g.b);
  const lo = BEATS.filter(b => b.P <= SC.P).at(-1).P, hi = BEATS.find(b => b.P > SC.P)?.P ?? stepsEnd;
  const v0 = stepsMoveSpeed(old, old.elapsed), v1 = g ? Math.sign(target - SC.P) * (g.b - g.a) / glideSeconds(g) : 0;
  const start = hurry ? cfg.hurryMin : Math.max(cfg.min, normal.D);
  for (let n = 0; ; n++) {
    const D = start + n * cfg.searchStep;
    if (D > cfg.searchMax || hurry && D >= left) break;
    const curve = stepsCarryCurve(SC.P, target, D, v0, v1, g ? g.a : lo, g ? g.b : hi);
    if (!curve) break;
    // the fill never jumps (K-7): a hurry carries it on to full, a new target eases it onto the new move's progress
    const move = { ...normal, ...curve, D, carry: true, hurry, elapsed: 0, baseFill: hurry ? SC.fill : 0, fill0: SC.fill };
    if (stepsCarryGate(move, old)) return move;
  }
  // An arbitrarily late hurry cannot both last >= hurryMin and arrive earlier.
  // Keep the current curve if no bounded candidate satisfies all constraints.
  return old;
}
function stepsJump(target, after) {
  if (target !== stepsEnd) exploreDepart();
  stepsCancel(); SC.cut = { target: stepsClamp(target), elapsed: 0, placed: false, after };
  SC.cover.hidden = false; SC.cover.style.opacity = 0; SC.root.dataset.beat = ''; stepsButtons();
  if (target === BEATS.find(b => b.id === 'x').P) {
    SC.say.textContent = COPY.steps.say.x; SC.go.querySelector('.go-t').textContent = COPY.steps.dig;
    SC.go.querySelector('.go-next').focus({ preventScroll: true });
  }
}
function stepsNavigate(target, opts = {}) {
  if (SC.cut) return;
  if (document.activeElement?.closest?.('.c-card, .find')) SC.go?.querySelector(target < SC.P ? '.go-back' : '.go-next')?.focus({ preventScroll: true });
  SC.scroll = null; SC.touch = null;
  if (target > stepsMap || opts.start) SC.scrollLive = false;
  if (SC.rm) { window.scrollTo({ top: target * VIEW.unit, behavior: 'instant' }); stepsReadScroll(); return; }
  if (opts.instant) { if (target !== stepsEnd) exploreReset(); stepsCancel(); SC.P = stepsClamp(target); if (SC.restoreP !== null) SC.restoreP = SC.P; stepsArrive(); return; }
  const lo = Math.min(SC.P, target), hi = Math.max(SC.P, target);
  if (opts.jump || (!opts.move && BEATS.some(b => b.P > lo + 1e-6 && b.P < hi - 1e-6))) stepsJump(target);
  else { if (target !== stepsEnd) exploreReset(); stepsPlay(target, opts.next); }
}
function stepsGo(id, opts = {}) {
  stepsDestination();
  if (SC.cut) return;
  const beat = BEATS.find(b => b.id === id); if (!beat) return;
  // A shield pressed during its own arrival keeps the current landing clock.
  if (!opts.instant && STOPS.some(s => s.id === id) && SC.move && SC.move.P1 === beat.P) return;
  stepsRelease(); if (SC.rm && SC.reducedGo) { SC.reducedGo(id); stepsReadScroll(); return; } stepsNavigate(beat.P, { ...opts, start: id === 'map' });
}
function stepsNext() {
  stepsDestination();
  if (SC.cut) return;
  // Dig-to-end has one clock. Repeated Next must never replace it with a hurry.
  const x = BEATS.find(b => b.id === 'x').P;
  if (SC.move && SC.P >= x && SC.P < stepsEnd) return;
  SC.direction = 'next'; stepsRelease(); const beat = stepsNextBeat(); if (beat) stepsNavigate(beat.P, { move: true, start: true, next: true });
  stepsButtons();
}
function stepsBack() {
  stepsDestination();
  if (SC.cut) return;
  if (exploreEnd()) { stepsButtons(); return; }
  if (stepsRelease(true)) return;
  SC.direction = 'back'; const x = BEATS.find(b => b.id === 'x');
  const beat = SC.move?.P1 === x.P && SC.P >= x.P ? x : stepsBackBeat(); if (beat) stepsNavigate(beat.P, { move: true, next: true });
}
function stepsSet(P) {
  stepsDestination();
  if (SC.cut) return;
  stepsRelease();
  SC.scroll = null; SC.touch = null; if (P > stepsMap) SC.scrollLive = false;
  if (SC.rm) { window.scrollTo({ top: Math.max(0, Math.min(TOTAL_P, P)) * VIEW.unit, behavior: 'instant' }); stepsReadScroll(); return; }
  if (Math.abs(P - stepsEnd) > 1e-6) exploreReset();
  stepsCancel(); SC.P = stepsClamp(P); if (SC.restoreP !== null) SC.restoreP = SC.P; stepsArrive();
}
export function stepsResize() {
  if (VIEW.phone) { const boxes = stepsExploreBoxes(VIEW.w, VIEW.h); SC.root.style.setProperty('--phone-exploreTop', (boxes.top[2] - boxes.top[0]) + 'px'); }
  if (SC.restoreP !== null) {
    SC.P = SC.restoreP; SC.restoreP = null;
    window.scrollTo({ top: 0, behavior: 'instant' });
  } else if (SC.rm) stepsReadScroll();
  stepsButtons();
}
export function stepsExploreBoxes(w, h) {
  const L = PHONE_LAYOUT, y = h - L.exploreBottom - STEPS.nav.h;
  return { back: [L.edge, y, L.edge + L.exploreBack, y + STEPS.nav.h], top: [L.edge + L.exploreBack + L.exploreGap, y, Math.min(w - L.edge, L.edge + L.exploreBack + L.exploreGap + L.exploreTop), y + STEPS.nav.h] };
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
    SC.P = stepsMoveAt(move, move.elapsed);
    SC.fill = move.baseFill + (1 - move.baseFill) * q;
    if (move.fill0 !== undefined && !move.hurry) SC.fill = lerp(move.fill0, SC.fill, easeIO(Math.min(1, q / STEPS.carry.fillBlend)));
    if (q >= 1) { SC.P = move.P1; SC.move = null; const pending = SC.pendingTarget; SC.pendingTarget = null; if (pending !== null && pending !== undefined) stepsPlay(pending); else stepsArrive(); }
  } else if (cut) {
    cut.elapsed += dt;
    if (cut.elapsed < STEPS.cut[0]) SC.cover.style.opacity = cut.elapsed / STEPS.cut[0];
    else if (!cut.placed) { cut.placed = true; SC.P = cut.target; SC.cover.style.opacity = 1; stepsLabel(); }
    else SC.cover.style.opacity = Math.max(0, 1 - (cut.elapsed - STEPS.cut[0]) / STEPS.cut[1]);
    if (cut.placed && cut.elapsed >= STEPS.cut[0] + STEPS.cut[1]) {
      SC.cut = null; SC.cover.hidden = true; stepsArrive(); if (cut.after) cut.after();
    }
  }
  stepsButtons(); return SC.P;
}
const stepsTarget = e => e.target && e.target.closest ? e.target : null;
// The joined page holds scrolls, swipes and keys at the top while the hero's loader still runs (join.mjs gives the test), so
// nothing moves behind the loader. A held gesture still counts as a gesture: its own momentum never starts the move later.
export function stepsHoldTop(test) { SC.holdTop = test; }
const stepsHeld = () => !!(SC.holdTop && SC.P <= stepsMap && SC.holdTop());
function stepsShine(forward) {
  const button = SC.go.querySelector(forward ? '.go-next' : '.go-back'), now = performance.now();
  if (button.hidden || now - (button._shineAt ?? -Infinity) < STEPS.shine.cooldown) return;
  button._shineAt = now; button.classList.add('go-shining');
}
function stepsFirstShine() {
  if (SC.shineSeen || SC.P !== stepsMap || JOURNEY.moving || SC.go.hidden || SC.go.classList.contains('go-reveal')) return;
  SC.shineSeen = true; stepsShine(true);
}
function stepsCardScroll(pixels, target) {
  if (!target?.closest('.c-card')) return false;
  for (let el = target; el?.closest('.c-card'); el = el.parentElement) {
    if (/auto|scroll/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 1 && (pixels > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight - 1 : el.scrollTop > 1)) return el;
  }
  return false;
}
function stepsNudge(pixels, stamp, target) {
  const same = SC.shineStamp !== undefined && stamp - SC.shineStamp < STEPS.scroll.gesture;
  SC.shineStamp = stamp;
  if (same || !pixels || SC.P < stepsMap || JOURNEY.moving || SC.go.hidden || SC.go.inert || stepsHeld() || exploreBusy() || SC.root.classList.contains('jm-sheet-open') || document.querySelector('.pop.on') || target?.closest('.sheet') || stepsCardScroll(pixels, target)) return;
  stepsShine(pixels > 0);
}
function stepsBlockWheel(e) {
  if (SC.rm || e.ctrlKey || exploreActive() || e.defaultPrevented) return;
  const target = stepsTarget(e);
  const card = stepsCardScroll(e.deltaY, target);
  if (card) { card.scrollTop += e.deltaY; SC.shineStamp = e.timeStamp; e.preventDefault(); return; }
  if (target?.closest('.sheet.on')) { e.preventDefault(); return; }
  e.preventDefault();
  if (stepsHeld()) { SC.scroll = { stamp: e.timeStamp }; return; }
  if (SC.scrollLive && !SC.cut && SC.P <= stepsMap) stepsScrollBy(e.deltaY, e.timeStamp);
  if (Math.abs(e.deltaY) > Math.abs(e.deltaX || 0)) stepsNudge(e.deltaY, e.timeStamp, target);
}
function stepsScrollBy(pixels, stamp) {
  if (!pixels) return;
  const same = SC.scroll && stamp - SC.scroll.stamp < STEPS.scroll.gesture;
  SC.scroll = { stamp };
  if (same) return;
  const target = pixels > 0 ? stepsMap : 0;
  if (SC.move?.P1 === target || !SC.move && Math.abs(SC.P - target) < 1e-6) return;
  stepsDestination();
  SC.direction = pixels > 0 ? 'next' : 'back'; stepsPlay(target);
}
const stepsTouchExcluded = target => target?.closest('.sheet.on, .sheet-dismiss, .pop button, .pop a, .tl, input, textarea, select, [data-review]');
function stepsTouchOwned(target) {
  const hero = target?.closest('[data-hero]'); if (!hero) return false;
  for (let el = target; el; el = el.parentElement) {
    if (window.getComputedStyle?.(el).touchAction === 'none') return true;
    if (el === hero) break;
  }
  return false;
}
function stepsTouchStart(e) {
  SC.swallow = false;
  if (SC.rm || exploreActive() || e.touches.length !== 1 || e.defaultPrevented || SC.pointerOwned || stepsTouchExcluded(stepsTarget(e)) || stepsTouchOwned(stepsTarget(e))) { SC.touch = null; return; }
  const p = e.touches[0]; SC.touch = { x: p.clientX, y: p.clientY, last: p.clientY, samples: [[e.timeStamp, p.clientY]], dragged: false };
}
function stepsTouchMove(e) {
  const touch = SC.touch; if (!touch) return;
  if (e.defaultPrevented || e.touches.length !== 1) { SC.touch = null; return; }
  const p = e.touches[0], dx = p.clientX - touch.x, dy = p.clientY - touch.y;
  // A vertical finger is the page's from the slop on, so the browser never takes the gesture over and later cancels are
  // honoured; it only counts as a swipe from STEPS.scroll.swipe on (F1), and only a swipe swallows the tap.
  if (!touch.held && Math.abs(dy) <= STEPS.scroll.slop) return;
  if (!touch.held && Math.abs(dx) >= Math.abs(dy)) { SC.touch = null; return; }
  const card = touch.card || (!touch.held && stepsCardScroll(-dy, stepsTarget(e)));
  if (card) { touch.card = card; card.scrollTop -= p.clientY - touch.last; touch.last = p.clientY; SC.swallow = true; if (e.cancelable) e.preventDefault(); return; }
  touch.held = true; if (e.cancelable) e.preventDefault();
  if (!touch.dragged && Math.abs(dy) < STEPS.scroll.swipe) return;
  const first = !touch.dragged;
  touch.dragged = true; SC.swallow = true;
  if (SC.scrollLive && !SC.cut && SC.P <= stepsMap) {
    if (stepsHeld()) SC.scroll = { stamp: e.timeStamp };
    else if (first) stepsScrollBy(-dy, e.timeStamp);
    else if (SC.scroll) SC.scroll.stamp = e.timeStamp;
  }
  if (first) stepsNudge(-dy, e.timeStamp, stepsTarget(e));
  touch.last = p.clientY; touch.samples.push([e.timeStamp, p.clientY]);
  while (touch.samples.length > 2 && e.timeStamp - touch.samples[0][0] > STEPS.scroll.velocityWindow) touch.samples.shift();
}
function stepsTouchEnd(e) {
  const touch = SC.touch; SC.touch = null; SC.pointerOwned = false;
  if (touch?.dragged && SC.scroll) SC.scroll.stamp = e.timeStamp;
  if (touch?.dragged) SC.shineStamp = e.timeStamp;
}
function stepsKey(e) {
  SC.root.classList.remove('jm-pointer-focus');
  if (SC.mode !== 'steps' || SC.rm || exploreActive() || e.defaultPrevented || e.repeat || e.ctrlKey || e.metaKey || e.altKey) return;
  const target = stepsTarget(e), backSpace = e.key === ' ' && e.shiftKey;
  if (target && target.closest('.sheet.on') || SC.root.classList.contains('jm-sheet-open') || !backSpace && target?.closest('.tl')) return;
  if (e.key === ' ' && !e.shiftKey && target && target.closest('button, a, input, textarea, select, .find, [role="button"]')) return;
  let act = null;
  if (['ArrowDown', 'ArrowRight', 'PageDown'].includes(e.key) || (e.key === ' ' && !e.shiftKey)) act = stepsNext;
  else if (['ArrowUp', 'ArrowLeft', 'PageUp'].includes(e.key) || (e.key === ' ' && e.shiftKey)) act = stepsBack;
  else if (e.key === 'Home') act = () => stepsGo('top', { jump: true });
  else if (e.key === 'End') act = () => stepsGo('end', { jump: true });
  if (act && stepsHeld()) { e.preventDefault(); return; }
  if (act) { e.preventDefault(); if (backSpace) e.stopImmediatePropagation(); act(); }
}
export function stepsBuild({ stage, rm, joinedTop, reducedGo = null }) {
  SC.root = document.documentElement; SC.rm = rm; SC.joinedTop = joinedTop; SC.reducedGo = reducedGo;
  VIEW.depth = new URLSearchParams(window.location.search).get('depth') === '0' ? 0 : 1;
  window.__jm = JOURNEY;
  window.addEventListener('scroll', () => { if (SC.rm) stepsReadScroll(); }, { passive: true });
  if (rm) { SC.mode = 'scroll'; return; }
  const params = new URLSearchParams(window.location.search); SC.mode = 'steps';
  const beat = BEATS.find(b => b.id === params.get('beat'));
  SC.P = beat ? beat.P : 0;
  SC.scrollLive = SC.P <= stepsMap; SC.scroll = null; SC.touch = null;
  SC.restoreP = SC.P;
  const s = COPY.steps;
  SC.go = document.createElement('div'); SC.go.className = 'go'; SC.go.id = 'go'; SC.go.hidden = true; SC.go.setAttribute('role', 'group'); SC.go.setAttribute('aria-label', s.group);
  SC.go.innerHTML = `<button class="go-back" type="button" aria-label="${s.back.replace('{name}', s.names.top)}">${arrowSvg}<span></span></button><button class="go-next" type="button"><i class="go-fill" aria-hidden="true"></i><span class="go-t">${s.start}</span>${arrowSvg}</button><button class="go-top" type="button">${s.top}</button>`;
  SC.say = document.createElement('p'); SC.say.className = 'sr'; SC.say.id = 'go-say'; SC.say.setAttribute('role', 'status');
  SC.cover = document.createElement('div'); SC.cover.className = 'jm-cut'; SC.cover.hidden = true; SC.cover.setAttribute('aria-hidden', 'true');
  stage.prepend(SC.go, SC.say, SC.cover);
  for (const button of SC.go.querySelectorAll('.go-next, .go-back')) {
    const light = document.createElement('i'); light.className = 'go-light'; light.setAttribute('aria-hidden', 'true'); button.appendChild(light);
  }
  SC.go.addEventListener('animationend', e => {
    if (e.target === SC.go) { SC.go.classList.remove('go-reveal'); stepsFirstShine(); }
    else if (e.animationName === 'goGlow') e.target.parentElement.classList.remove('go-shining');
  });
  SC.go.addEventListener('animationcancel', e => { if (e.animationName === 'goGlow') e.target.parentElement.classList.remove('go-shining'); });
  SC.go.querySelector('.go-back').addEventListener('click', stepsBack);
  SC.go.querySelector('.go-next').addEventListener('click', () => { if (!JOURNEY.moving && SC.P === stepsEnd) { exploreStart(); stepsButtons(); } else stepsNext(); });
  SC.go.querySelector('.go-top').addEventListener('click', () => stepsGo('top'));
  SC.review = document.createElement('div'); SC.review.className = 'jm-review'; SC.review.dataset.review = ''; SC.review.setAttribute('role', 'group'); SC.review.setAttribute('aria-label', s.review.label);
  SC.review.innerHTML = `<span>${s.review.label}</span><button type="button" data-depth aria-pressed="${!!VIEW.depth}">${s.review.depth}</button>`;
  SC.review.querySelector('[data-depth]').addEventListener('click', () => stepsSetDepth(!VIEW.depth)); document.body.appendChild(SC.review);
  const vars = { 'go-h': STEPS.nav.h + 'px', 'go-gap': STEPS.nav.gap + 'px', 'go-bar': STEPS.nav.bar + 'px', 'go-reveal': STEPS.reveal + 's', 'go-top-pad': WORLD.card.topPad + 'px', 'go-top-pad-x': WORLD.card.topPadX + 'px' };
  Object.entries(vars).forEach(([k, v]) => SC.root.style.setProperty('--' + k, v));
  Object.entries(STEPS.shine).forEach(([k, v]) => SC.root.style.setProperty('--go-shine-' + k, v + (['time', 'reduced'].includes(k) ? 'ms' : k === 'glow' ? 'px' : '')));
  Object.entries(EXPLORE.bar).forEach(([k, v]) => SC.root.style.setProperty('--explore-' + k, v + 'px'));
  Object.entries(PHONE_LAYOUT).forEach(([k, v]) => SC.root.style.setProperty('--phone-' + k, v + 'px'));
  stepsClasses(); stepsArrive();
  if (SC.mode === 'steps') window.scrollTo({ top: 0, behavior: 'instant' });
  window.addEventListener('wheel', stepsBlockWheel, { passive: false }); window.addEventListener('keydown', stepsKey);
  window.addEventListener('keydown', e => { if (e.key === ' ' && e.shiftKey) stepsKey(e); }, true);
  window.addEventListener('pointerdown', e => { SC.root.classList.add('jm-pointer-focus'); SC.swallow = false; if (e.pointerType === 'touch') SC.pointerOwned = e.defaultPrevented || stepsTouchOwned(stepsTarget(e)); });
  window.addEventListener('touchstart', stepsTouchStart, { passive: true });
  window.addEventListener('touchmove', stepsTouchMove, { passive: false });
  window.addEventListener('touchend', stepsTouchEnd); window.addEventListener('touchcancel', stepsTouchEnd);
  window.addEventListener('click', e => { if (SC.swallow && e.detail !== 0) { SC.swallow = false; e.preventDefault(); e.stopImmediatePropagation(); } }, true);
}

export function stepsReduced(on, i = 0) {
  stepsCancel(); SC.focus = null; SC.root.classList.remove('jm-focus'); SC.rm = on; SC.mode = on ? 'scroll' : 'steps';
  SC.root.classList.toggle('jm-steps', !on); SC.go.hidden = on;
  if (!on) { SC.P = i < -1 ? 0 : i >= STOPS.length ? stepsEnd : BEATS[Math.max(1, i + 2)].P; window.scrollTo({ top: 0, behavior: 'instant' }); stepsArrive(); }
}
