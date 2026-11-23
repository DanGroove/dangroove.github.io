// Node geometry and state checks. This is a recording environment, not a visual browser check.
import { strict as assert } from 'node:assert';
import { EXPLORE, MAP, FOOT_NAME } from '../data.mjs';
import { tripResize, tripState, VIEW } from '../trip.mjs';
import { BEATS } from '../pace.mjs';
import { exploreClamp, exploreZoom, exploreWorld, exploreGlide, exploreLayer, exploreLayerPoint, exploreLayerInverse, exploreBuild, exploreResize, exploreStart, exploreApply, exploreEnd, exploreActive, exploreBusy, exploreReset } from '../explore.mjs';
import { footBezier, footLetterStep, footOpenTarget, footRest } from '../footname.mjs';

const near = (a, b, message) => assert.ok(Math.abs(a - b) < 1e-7, `${message}: ${a}/${b}`);
for (const view of [{ w: 1440, h: 800 }, { w: 390, h: 612 }]) {
  const bounds = [-30, 10, 800, 1500], fit = Math.min(view.w / 830, view.h / 1490), top = fit * 10;
  for (const scale of [fit / 100, fit, fit * 2, top, top * 100]) for (const x of [-1e6, 0, 1e6]) for (const y of [-1e6, 0, 1e6]) {
    const cam = exploreClamp({ s: scale, tx: x, ty: y }, bounds, view, fit, top), centre = exploreWorld(cam, [view.w / 2, view.h / 2]);
    assert.ok(cam.s >= fit && cam.s <= top);
    assert.ok(centre[0] >= bounds[0] && centre[0] <= bounds[2] && centre[1] >= bounds[1] && centre[1] <= bounds[3]);
    if ((bounds[2] - bounds[0]) * cam.s <= view.w) near(centre[0], (bounds[0] + bounds[2]) / 2, 'small bounds centred x');
    if ((bounds[3] - bounds[1]) * cam.s <= view.h) near(centre[1], (bounds[1] + bounds[3]) / 2, 'small bounds centred y');
  }
  const cam = { s: fit * 3, tx: -130, ty: -270 }, point = [view.w * .31, view.h * .67];
  for (const factor of [.0001, .7, 1.25, 1000]) {
    const zoomed = exploreZoom(cam, point, factor, fit, top), a = exploreWorld(cam, point), b = exploreWorld(zoomed, point);
    near(a[0], b[0], 'zoom anchor x'); near(a[1], b[1], 'zoom anchor y'); assert.ok(zoomed.s >= fit && zoomed.s <= top);
  }
  for (const velocity of [[200, -150], [1e5, 1e5], [-1e5, -1e5]]) {
    let current = exploreClamp(cam, bounds, view, fit, top), speed = velocity, previous = Math.hypot(...speed);
    for (let i = 0; i < 2000; i++) {
      const result = exploreGlide(current, speed, 1 / 60, bounds, view, fit, top); current = result.cam; speed = result.velocity;
      const mag = Math.hypot(...speed); assert.ok(mag <= previous); previous = mag;
      assert.deepEqual(exploreClamp(current, bounds, view, fit, top), current, 'glide crossed bounds');
    }
    assert.deepEqual(speed, [0, 0]);
  }
  const free = exploreClamp(cam, bounds, view, fit, top), glide = exploreGlide(free, [0, 10], 1 / 60, bounds, view, fit, top);
  assert.ok(glide.velocity[1] > 0 && glide.velocity[1] < 10, 'a free glide must continue while slowing');
  const end = { s: 2, tx: -250, ty: -1300 };
  for (const testCam of [end, cam, { s: .1, tx: 300, ty: 200 }]) {
    const layer = exploreLayer(testCam, end), p = [157, 888], roundtrip = exploreLayerInverse(exploreLayerPoint(p, layer), layer);
    near(roundtrip[0], p[0], 'layer inverse x'); near(roundtrip[1], p[1], 'layer inverse y');
    const endScreen = [MAP.x[0] * end.s + end.tx, MAP.x[1] * end.s + end.ty], transformed = exploreLayerPoint(endScreen, layer);
    near(transformed[0], MAP.x[0] * testCam.s + testCam.tx, 'world layer x'); near(transformed[1], MAP.x[1] * testCam.s + testCam.ty, 'world layer y');
  }
}
console.log('ok: desktop/phone zoom limits, bounded/centred cameras, fixed zoom anchor, damped glides with no overshoot, layer/inverse round trips');

// Exercise end gating, entry interruption, exit, pointer input, resize and progress invariance.
const listeners = {}, classes = new Set(), hint = { classList: { add() {}, remove() {} }, setAttribute() {} }, world = { style: {} }, status = {};
const eventTarget = { closest: () => null };
const stage = { classList: hint.classList, appendChild() {}, addEventListener(type, fn) { (listeners['stage:' + type] ??= []).push(fn); }, setPointerCapture() {}, releasePointerCapture() {}, hasPointerCapture: () => false };
globalThis.window = { addEventListener(type, fn) { (listeners[type] ??= []).push(fn); }, dispatchEvent() {}, getComputedStyle() { throw new Error('frame layout read'); } };
globalThis.document = { createElement: () => hint, getElementById: () => status, documentElement: { classList: { add: c => classes.add(c), remove: c => classes.delete(c) } } };
const journey = { P: 0, moving: false, beats: BEATS }, endP = BEATS.at(-1).P;
exploreBuild({ stage, world, journey, rm: false }); tripResize(1440, 900, 120); exploreResize(); assert.equal(exploreStart(), false);
journey.P = endP; journey.moving = true; assert.equal(exploreStart(), false); journey.moving = false; assert.equal(exploreStart(), true);
const apply = dt => { const st = tripState(journey.P), before = structuredClone(st); exploreApply(st, dt); assert.equal(st.P, before.P); assert.deepEqual(st.trav, before.trav); return st; };
let st = apply(EXPLORE.in / 2); assert.ok(st.exploreK > 0 && st.exploreK < 1);
const dispatch = (type, fields = {}, prefix = '') => { const e = { target: eventTarget, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, ...fields }; (listeners[prefix + type] || []).forEach(fn => fn(e)); return e; };
dispatch('wheel', { deltaY: -50, deltaMode: 0, clientX: 700, clientY: 450 }); st = apply(0); // takeover has no discontinuity at the instant of the event
const beforePan = st.cam.tx;
dispatch('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 700, clientY: 450, timeStamp: 1000 }, 'stage:');
dispatch('pointermove', { pointerId: 1, clientX: 730, clientY: 460, timeStamp: 1020 }, 'stage:'); assert.equal(apply(0).exploring, true);
dispatch('pointerup', { type: 'pointerup', pointerId: 1, timeStamp: 1030 }, 'stage:');
st = apply(EXPLORE.in); assert.equal(st.exploreK, 1); assert.equal(journey.P, endP); assert.ok(Number.isFinite(beforePan));
tripResize(390, 664, 96); exploreResize(); st = apply(0); assert.ok(Number.isFinite(st.cam.s));
assert.equal(exploreEnd(), true); assert.equal(exploreActive(), false); st = apply(EXPLORE.out); assert.equal(st.exploreK, 0); assert.equal(exploreBusy(), false); assert.equal(world.style.transform, 'none');
assert.equal(exploreStart(), true); apply(EXPLORE.in); journey.P = BEATS[2].P; st = apply(0); assert.equal(exploreBusy(), false); assert.equal(st.exploreK, 0); exploreReset();
console.log('ok: end-only CTA entry, input takeover, pan/release, resize, exit and immediate departure reset; P and traveller unchanged');

for (const curve of [FOOT_NAME.wipe, FOOT_NAME.enter]) { near(footBezier(curve, 0), 0, 'curve start'); near(footBezier(curve, 1), 1, 'curve end'); let previous = 0; for (let i = 1; i <= 100; i++) { const value = footBezier(curve, i / 100); assert.ok(value >= previous); previous = value; } }
assert.equal(footOpenTarget(50, 20, { left: 0, top: 0, right: 100, bottom: 40 }, 20), 1); assert.equal(footRest(0, 0, 20), FOOT_NAME.rise);
const letter = { y: 0, vy: 0, kick: 1 }; footLetterStep(letter, 0, 1 / 60, 2); assert.ok(letter.y > 0);
for (let i = 0; i < 1000; i++) footLetterStep(letter, 0, 1 / 60, i + 3); assert.ok(Math.abs(letter.y) < 1e-6);
console.log('ok: copied name curves monotone, lens/rest geometry and knock spring settling');
