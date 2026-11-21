import { sceneEnvelope } from '../view.mjs';
// Geometry and clock checks. No browser, filesystem writes or dependencies.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { ART, ART_TEXT, BALL, BALL_FROM, BALL_VIA, ROWS, makeAtlas } from '../art.mjs';
import { HOME, EASE, dot, makeCamera, quatRotate } from '../../../../public/journey/hero/engine.mjs';
import { corners } from '../kit.mjs';
import { TONES } from '../sq.mjs';
import { HAND, SHOW, LOOP, SCENES, SCREEN, MAT, BLOCK, POOL, PACE, SCRIPTS, frameAt, sceneAt, calloutsAt, playbackSpans, UI_ROW, prototypeState, EXPORT_SHIFT } from '../stage.mjs';
import { runCorrections } from './correction-checks.mjs';
import { previewMarkup } from './preview.mjs';
import { checkPageLabels } from './label-page-checks.mjs';
import { checkDrags } from './drag-checks.mjs';
import { checkRound5 } from './round5-checks.mjs';
import { checkRound5Addendum } from './round5-addendum-checks.mjs';
import { checkRound5SecondAddendum } from './round5-second-addendum-checks.mjs';
import { checkEntrance, checkEntranceControls } from './entrance-checks.mjs';
import * as entranceModule from '../entrance.mjs';
import { checkHand, checkHandControls, describe } from './hand-checks.mjs';
import { retimer } from './hand-patch.mjs';
import { checkRound8, checkRound8Controls } from './round8-checks.mjs';
import { checkRound9, checkRound9Controls } from './round9-checks.mjs';
import { checkRound10, checkRound10Controls } from './round10-checks.mjs';
import { checkRound16, checkRound16Controls } from './round16-checks.mjs';
import { checkRound12StarsList, checkRound12Controls } from './round12-stars-list-checks.mjs';
import { checkRound14, checkRound14Controls } from './round14-checks.mjs';
import { checkRound12 as checkRound12Scene, checkRound12Controls as checkRound12SceneControls } from './round12-checks.mjs';
import { checkRows as checkRound13Rows, checkRowsControls as checkRound13RowsControls } from './round13-checks.mjs';
import { checkRound17, checkRound17Controls, checkRound17Exports as checkRound15, checkRound17RetainedControls as checkRound15Controls, checkPainterStacks, withSourceLines } from './round17-checks.mjs';
import * as stageModule from '../stage.mjs';

let frames = 0, pieces = 0, largest = 0;
const errors = [];
const visibleBounds = [Infinity, -Infinity, Infinity, -Infinity];
// Clip box edges too: a piece behind the printer slot is not part of the visible fit.
function visibleCorners(pc) {
  const points = corners(pc);
  if (!pc.clip) return points;
  const distances = points.map(p => dot(pc.clip, p) + pc.clip[3]);
  const visible = points.filter((_, i) => distances[i] >= 0);
  for (let i = 0; i < 8; i++) for (const bit of [1, 2, 4]) {
    const j = i ^ bit;
    if (i < j && distances[i] * distances[j] < 0) visible.push(points[i].map((v, k) => v + (points[j][k] - v) * distances[i] / (distances[i] - distances[j])));
  }
  return visible;
}
function includeFit(list) {
  for (const pc of list) for (const p of visibleCorners(pc)) {
    const x = dot(HOME.r, p), y = dot(HOME.u, p);
    visibleBounds[0] = Math.min(visibleBounds[0], x); visibleBounds[1] = Math.max(visibleBounds[1], x);
    visibleBounds[2] = Math.min(visibleBounds[2], y); visibleBounds[3] = Math.max(visibleBounds[3], y);
  }
}
// R8: only a real action may press, and every wait keeps the previous action's position, released, including its rendered lift.
function checkWait(time, list, scene, at) {
  const permitted = SCRIPTS[scene.key].actions.some(a => a.kind !== 'wait' && at >= a.start - 1e-9 && at < a.end && (['drag', 'draw', 'slide', 'stroke'].includes(a.kind) || at < a.start + 0.05 * PACE));
  if (list.pressed && !permitted) fail(time, 'R8: pressed cursor has no action behind it');
  const wait = SCRIPTS[scene.key].actions.find(a => a.kind === 'wait' && at > a.start + 1e-8 * PACE && at < a.end - 1e-8 * PACE);
  if (!wait) return;
  const resting = frameAt(time - at + wait.end - 1e-7 * PACE);
  const cursor = list.find(pc => pc.art === 'cursor'), reference = resting.find(pc => pc.art === 'cursor');
  if (list.pressed !== false) fail(time, 'R8: ' + wait.id + ' presses during a wait');
  const expected = [SCREEN.l + wait.previous[0] * 1.15, SCREEN.b + wait.previous[1] * 1.15];
  if (tip(list).some((v, i) => Math.abs(v - expected[i]) > 1e-8) || cursor.p.some((v, i) => Math.abs(v - reference.p[i]) > 1e-8)) fail(time, 'R8: ' + wait.id + ' moves the resting cursor');
  const buttons = list.filter(pc => pc.art === 'export'), restingButtons = resting.filter(pc => pc.art === 'export');
  // An export already in progress may keep filling; a wait must never sink the button.
  if (buttons.some(pc => Math.abs(pc.p[2] - restingButtons[0].p[2]) > 1e-8)) fail(time, 'R8: ' + wait.id + ' presses the Export button');
}
function fail(time, message) {
  if (errors.length < 30 && !errors.some(error => error.endsWith(': ' + message))) errors.push(`${time.toFixed(6)}s (${sceneAt(time).scene.key}): ${message}`);
}
function finite(value, name, time) {
  if (typeof value === 'number' && !Number.isFinite(value)) fail(time, `${name} is not finite`);
  else if (value && typeof value === 'object') {
    for (const [key, v] of Object.entries(value)) finite(v, `${name}.${key}`, time);
  }
}
function check(time) {
  const { scene, at } = sceneAt(time), list = frameAt(time);
  frames++; pieces += list.length; largest = Math.max(largest, list.length);
  includeFit(list); checkWait(time, list, scene, at);
  if (list.filter(pc => pc.art === 'cursor').length !== 1) fail(time, 'expected exactly one cursor');
  list.forEach((pc, i) => {
    finite(pc, `piece ${i}`, time);
    for (const [key, length] of [['p', 3], ['q', 4], ['s', 3], ['e', 2]]) {
      if (!Array.isArray(pc[key]) || pc[key].length !== length) fail(time, `piece ${i}: invalid ${key}`);
    }
    if (pc.s.some(n => n < 0)) fail(time, `piece ${i}: negative size`);
    if (!Object.hasOwn(TONES, pc.tone)) fail(time, `piece ${i}: unknown tone ${pc.tone}`);
    if (pc.tones && (pc.tones.length !== 3 || pc.tones.some(t => !/^#[\da-f]{6}$/i.test(t)))) fail(time, `piece ${i}: invalid custom tones`);
    if (pc.art && !Object.hasOwn(ART, pc.art)) fail(time, `piece ${i}: unknown picture ${pc.art}`);
    if (pc.window) {
      const [l, t, r, b] = pc.window;
      if (!pc.art || pc.window.length !== 4 || l < 0 || t < 0 || r > 1 || b > 1 || l > r || t > b) fail(time, `piece ${i}: invalid picture window`);
    }
    if (pc.clip && pc.clip.length !== 4) fail(time, `piece ${i}: invalid clip plane`);
    if (pc.where === 'content' && !pc.clip) fail(time, `piece ${i}: content has no wipe plane`);
    if ('opacity' in pc || 'alpha' in pc) fail(time, `piece ${i}: transparency is not a motion tool`);
    if (pc.where === 'floor') {
      if (scene.key === 'ps' || scene.key === 'ai' || at < 0.1) fail(time, `piece ${i}: floor must be empty`);
      // CORRECTIONS-13 E2: the slot at the mat's back edge is gone. CORRECTIONS-15: the only clips on the floor are the ball's at the
      // button's face while it pops, a format's or block's become wipe (one plane in x) and the sink's plane at y = 0.
      if (pc.clip && !(pc.morph === 'ball' && pc.clip[1] === 1 && !pc.clip[0] && !pc.clip[2]) && !(pc.edge !== undefined && Math.abs(pc.clip[0]) === 1 && !pc.clip[1] && !pc.clip[2]) && !(pc.sink && pc.clip.join() === '0,1,0,0')) fail(time, `piece ${i}: a floor piece is clipped outside the ball's pop, its wipes and the sink`);
      const s = SCRIPTS[scene.key], exp = s?.actions.find(a => a.id === 'export');
      if (exp && at < exp.start) fail(time, `piece ${i}: floor before export`);
      if (pc.device !== undefined && list.clock !== null && list.clock !== undefined && Math.abs(pc.clock - list.clock) > 1e-8) fail(time, `piece ${i}: device and viewer clocks differ`);
    }
  });
  // Check actual face geometry, including plates made outside the painters and selection joins.
  for (const floor of [false, true]) {
    const axis = floor ? 1 : 2, across = floor ? 2 : 1, unit = floor ? 1 : 1.15;
    const faces = list.flatMap((pc, i) => {
      if ((pc.where === 'floor') !== floor || pc.solid || quatRotate(pc.q, [0, 0, 1])[axis] < 1 - 1e-9) return [];   // CORRECTIONS-15: the ball's red volumes are not stacked faces
      const points = corners(pc), x = points.map(p => p[0]), y = points.map(p => p[across]);
      return [{ i, pc, height: (pc.p[axis] + pc.s[2]) / unit, rect: [Math.min(...x), Math.min(...y), Math.max(...x), Math.max(...y)] }];
    });
    for (let i = 0; i < faces.length; i++) for (let j = 0; j < i; j++) {
      const a = faces[i], b = faces[j];
      const overlap = Math.min(a.rect[2], b.rect[2]) - Math.max(a.rect[0], b.rect[0]) > 1e-9 && Math.min(a.rect[3], b.rect[3]) - Math.max(a.rect[1], b.rect[1]) > 1e-9;
      if (overlap && Math.abs(a.height - b.height) < 0.0006 - 1e-10) fail(time, `${floor ? 'floor' : 'screen'} faces ${a.i}/${b.i} overlap with less than 0.0006 clearance`);
    }
    // F2 replaces the frame-global stack with independent painter bases and retained order wherever painters overlap.
    try { checkPainterStacks(list, floor); } catch (error) { fail(time, error.message); }
    for (const f of faces.filter(f => f.pc.overlay && !f.pc.emptyFrame)) {
      // The original spread guides may cross a carried image; the cursor must clear it. G1 (round 8): in every app, marks the
      // carried stack passes over stay where they are, under it; only the cursor must clear the carried picture.
      const carried = p => (scene.key === 'id' && p.pc.shadowP) || (p.pc.where === 'travel' && p.pc.action !== undefined && p.pc.action === list.action);
      const top = Math.max(-Infinity, ...faces.filter(p => !p.pc.overlay && (p.pc.art || p.pc.paintLayer !== undefined) && !(f.pc.art !== 'cursor' && carried(p))).map(p => p.height));
      if ((f.pc.p[axis] - f.pc.s[2]) / unit < top + 0.0008 - 1e-10) fail(time, 'an interaction mark is below a picture stack');
    }
  }
}

let start = 0;
for (let i = 0; i < SHOW.length; i++) {
  const scene = SHOW[i];
  assert.equal(sceneAt(start).i, i, 'scene boundary');
  assert.equal(sceneAt(start + scene.len - 1e-8).i, i, 'scene end');
  assert.deepEqual(SCENES[i](), frameAt(start + scene.still), `${scene.key}: still differs`);
  for (let n = 0; n < Math.ceil(scene.len * 60); n++) check(start + n / 60);
  for (const at of [0, 0.05, 0.1, 0.5, scene.still, scene.len - 1e-8]) check(start + at);
  start += scene.len;
}
// CORRECTIONS-7 K2 lengthens the loop (about 90.8 s expected, 91.5 s with K3's speed floor); the round-2 ceiling of 86 s is raised to 92.
// CORRECTIONS-15 raises it to 100 for the ball and the sink (about 97.7 s).
if (Object.keys(SCRIPTS).length === 6) assert.ok(LOOP / PACE >= 70 && LOOP / PACE <= 100, `loop is ${LOOP / PACE}s`);
assert.equal(sceneAt(LOOP).i, 0);
assert.equal(sceneAt(-0.01).scene.key, 'fig');
assert.deepEqual(frameAt(-0.01), frameAt(LOOP - 0.01));
assert.deepEqual(frameAt(0), frameAt(LOOP));
assert.throws(() => frameAt(NaN), TypeError);
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} differs from ${b}`);
function tip(list) {
  const pc = list.find(pc => pc.art === 'cursor');
  const p = pc.shadowP || pc.p; // The drag's depth-only lift leaves its authored route intact.
  return [p[0] - 0.46 * (0.5 - 10 / 96), p[1] + 0.46 * (0.5 - 6 / 96)];
}
// The cursor must reach every action's start before pressing, then its end before releasing.
let sceneStart = 0;
for (const scene of SHOW) {
  const s = SCRIPTS[scene.key];
  if (s) {
    // CORRECTIONS-12 I1: InDesign's document opens with its blank pages already there, and nothing else on them.
    assert.ok(frameAt(sceneStart + s.first - 1e-6).every(pc => !pc.document || (scene.key === 'id' && pc.page)), `${scene.key}: document starts populated`);
    let end = 0.8 * PACE;
    let typed = false;
    for (const a of s.actions) {
      near(a.approach, end); assert.ok(a.end > a.start);
      if (a.kind === 'type') {
        assert.ok((a.end - a.start) / PACE >= (typed ? 0.4 : 0.6) - 1e-9, `${scene.key}/${a.id}: typing is too fast`);
        typed = true;
      }
      const first = tip(frameAt(sceneStart + a.start + 1e-8));
      near(first[0], SCREEN.l + a.from[0] * 1.15); near(first[1], SCREEN.b + a.from[1] * 1.15);
      const last = tip(frameAt(sceneStart + a.end - 1e-8));
      near(last[0], SCREEN.l + a.to[0] * 1.15); near(last[1], SCREEN.b + a.to[1] * 1.15);
      end = a.end;
    }
    assert.ok(frameAt(sceneStart + actionStart(s, 'export') - 1e-6).every(pc => pc.where !== 'floor'), `${scene.key}: floor before export`);
  }
  sceneStart += scene.len;
}
function actionStart(s, id) { return s.actions.find(a => a.id === id).start; }
// The new slide law must leave the approved parked list in exactly its old place.
const rows = frameAt(SHOW.slice(0, 4).reduce((n, s) => n + s.len, 0) + (SCRIPTS.ae ? actionStart(SCRIPTS.ae, 'export') - 1e-6 : 4.4)).filter(pc => pc.where === 'content' && pc.p[0] > SCREEN.l + 1.33 * 1.15 && (pc.art === 'rowA' || pc.art === 'rowB'));
assert.equal(rows.length, 3);
ROWS.forEach(([x, y, w, h], i) => {
  near(rows[i].p[0], SCREEN.l + (1.33 + (x + w / 2) * 1.92 / 480) * 1.15);
  near(rows[i].p[1], SCREEN.b + (1.5 + 1.08 - (y + h / 2) * 1.08 / 270) * 1.15);
  assert.deepEqual(rows[i].window || [0, 0, 1, 1], [0, 0, 1, 1]);
});
// The comp and its thumbnail build together, without applying playback's reveal or row offsets.
const aeStart = SHOW.slice(0, 4).reduce((n, s) => n + s.len, 0), ae = SCRIPTS.ae;
const atAction = (s, id, f) => { const a = s.actions.find(a => a.id === id); return a.start + (a.end - a.start) * f; };
for (const [id, art] of [['make', 'wMake'], ['move', 'wMove']]) {
  for (const f of [0.5, 1]) {
    const words = frameAt(aeStart + atAction(ae, id, f) + (f === 1 ? 1e-7 : 0)).filter(pc => pc.art === art);
    assert.equal(words.length, 2, `${id}: word missing from comp or thumbnail`);
    for (const pc of words) if (f === 1) assert.deepEqual(pc.window || [0, 0, 1, 1], [0, 0, 1, 1]);
    else assert.ok(pc.window[2] > 0 && pc.window[2] < 1, `${id}: typing prefix missing`);
  }
}
const halfway = HAND(0.5); // the ball follows the hand's drag (CORRECTIONS-7 K1)
for (const [id, f, pos] of [['ball', 1, BALL_FROM], ['path', 0.5, BALL_FROM.map((v, i) => (1 - halfway) ** 2 * v + 2 * (1 - halfway) * halfway * BALL_VIA[i] + halfway ** 2 * BALL[i])], ['path', 1, BALL]]) {
  const balls = frameAt(aeStart + atAction(ae, id, f) + (f === 1 ? 1e-7 : 0)).filter(pc => pc.art === 'redBall');
  assert.equal(balls.length, 2, `${id}: ball missing from comp or thumbnail`);
  for (const [i, rect] of [[0, [1.33, 1.5, 1.92, 1.08]], [1, [0.14, SCREEN.h / 1.15 - 0.44 - 0.1 - 0.5, 0.74, 0.416]]]) {
    near(balls[i].p[0], SCREEN.l + (rect[0] + pos[0] / 480 * rect[2]) * 1.15);
    near(balls[i].p[1], SCREEN.b + (rect[1] + (1 - pos[1] / 270) * rect[3]) * 1.15);
  }
}
const builtRows = frameAt(aeStart + atAction(ae, 'copies', 1) + 1e-7).filter(pc => pc.art === 'rowA' || pc.art === 'rowB');
assert.equal(builtRows.length, 6, 'constructed rows missing from comp or thumbnail');
assert.ok(builtRows.every(pc => !pc.window), 'constructed rows are revealed as if playing');
// Photoshop's heals cut on release, then completed edits replace their construction stack.
const ps = SCRIPTS.ps, photoArt = pc => pc.document && pc.p[0] < SCREEN.l + 3.8 * 1.15 && /^(?:photo|kPhoto)/.test(pc.art || '');
for (const [id, duration] of [['black', 0.5], ['white', 0.5], ['sky', 0.7], ['cone', 0.25], ['crane', 0.25]]) near((atAction(ps, id, 1) - atAction(ps, id, 0)) / PACE, duration);
near((SHOW[0].len - atAction(ps, 'export', 1)) / PACE, 0.3);
for (const id of ['cone', 'crane']) {
  const before = frameAt(atAction(ps, id, 1) - 1e-6).filter(photoArt);
  assert.ok(before.some(pc => pc.art === (id === 'cone' ? 'photoSky' : 'photoNoCone')), `${id}: distraction disappeared during scrub`);
}
for (const [id, art] of [['cone', 'photoNoCone'], ['crane', 'photoClean'], ['grade', 'kPhoto']]) {
  const pictures = frameAt(atAction(ps, id, 1)).filter(photoArt);
  assert.equal(pictures.length, 1, `${id}: completed picture still has its construction layers`);
  assert.equal(pictures[0].art, art);
  assert.deepEqual(pictures[0].window || [0, 0, 1, 1], [0, 0, 1, 1]);
}
// The booklet strip is a reading pose, while the rest of InDesign stays at its still time.
for (const at of [-1, -0.7, 0, 0.3, 1, 1.4, 2, 2.76, 4]) {
  const list = SCENES[2]({ at });
  assert.ok(list.some(pc => pc.where === 'floor'));
  assert.ok(list.filter(pc => pc.where === 'floor').every(pc => pc.p[2] >= MAT.z));
}
assert.ok(SCREEN.w > 0);
// Dan's centring rule (round 2), then CORRECTIONS-12 X1's one shift: every group's middle is the screen's middle plus EXPORT_SHIFT.
const middle = SCREEN.l + SCREEN.w / 2 + EXPORT_SHIFT;
const centred = (x, name) => assert.ok(Math.abs(x - middle) <= 0.001, name + ': footprint is not centred in world x');
centred((BLOCK.x0 + BLOCK.x1) / 2, 'InDesign block');
centred(MAT.x + MAT.w / 2, 'device mat');
centred(POOL.x, 'light pool');
for (const i of [2, 3, 4, 5]) {
  const xs = SCENES[i]().filter(pc => pc.where === 'floor').flatMap(corners).map(p => p[0]);
  centred((Math.min(...xs) + Math.max(...xs)) / 2, SHOW[i].key);
}
// CORRECTIONS-13 (replaces "feeding and returning translate only z"): once every body is built, nothing on the floor moves
// until the return, except the booklet's reading; the drop itself is checked by tools/round13-checks.mjs.
sceneStart = 0;
for (const scene of SHOW) {
  if (['id', 'pr', 'ae', 'fig'].includes(scene.key)) {
    const s = SCRIPTS[scene.key], { land, off } = playbackSpans(s), end = scene.key === 'id' ? s.actions.find(a => a.id === 'pickup').start : scene.key === 'fig' ? land + 3 * PACE : off[0];
    const floor = t => frameAt(sceneStart + t, { at: -1 }).filter(pc => pc.where === 'floor');
    const landed = floor(land + 1e-6 * PACE);
    const reference = scene.key === 'id' ? landed : landed.filter(pc => pc.deviceBody || pc.lid);
    assert.equal(reference.length, scene.key === 'id' ? 20 : scene.key === 'fig' ? 4 : 3, scene.key + ': missing export bodies');
    for (let n = 1; land + n * PACE / 120 < end; n++) {
      const list = floor(land + n * PACE / 120), bodies = scene.key === 'id' ? list : list.filter(pc => pc.deviceBody || pc.lid);
      assert.equal(bodies.length, reference.length, scene.key + ': export bodies changed');
      for (const pc of bodies) {
        const match = scene.key === 'id' ? reference.find(p => p.art === pc.art && p.tone === pc.tone && p.p.every((v, i) => Math.abs(v - pc.p[i]) < 1e-8)) : reference.find(p => p.device === pc.device && !!p.lid === !!pc.lid);
        assert.ok(match, scene.key + ': export moved after it was built');
        pc.p.forEach((v, i) => assert.ok(Math.abs(v - match.p[i]) < 1e-8, scene.key + ': export moved after it was built')); assert.deepEqual(pc.q, match.q); assert.deepEqual(pc.s, match.s);
      }
    }
  }
  sceneStart += scene.len;
}
// Canvas stand-ins exercise all picture functions and atlas packing, without pretending to render pixels.
let matrix = [1, 0, 0, 1, 0, 0];
const stack = [];
const gradients = [];
const context = new Proxy({
  font: '400 10px sans-serif', letterSpacing: '0px', textAlign: 'left',
  getTransform: () => Object.fromEntries(['a', 'b', 'c', 'd', 'e', 'f'].map((k, i) => [k, matrix[i]])),
  save() { stack.push({ matrix: matrix.slice(), font: this.font, letterSpacing: this.letterSpacing, textAlign: this.textAlign }); },
  restore() { const s = stack.pop(); matrix = s.matrix; this.font = s.font; this.letterSpacing = s.letterSpacing; this.textAlign = s.textAlign; },
  translate(x, y) { matrix[4] += matrix[0] * x + matrix[2] * y; matrix[5] += matrix[1] * x + matrix[3] * y; },
  scale(x, y) { matrix[0] *= x; matrix[1] *= x; matrix[2] *= y; matrix[3] *= y; },
  rotate(a) { const [x, y, z, w] = matrix, c = Math.cos(a), s = Math.sin(a); matrix[0] = x * c + z * s; matrix[1] = y * c + w * s; matrix[2] = -x * s + z * c; matrix[3] = -y * s + w * c; },
  measureText(s) { const px = +(this.font.match(/([\d.]+)px/)?.[1] || 10); return { width: s.length * px * 0.55, actualBoundingBoxAscent: px * 0.8, actualBoundingBoxDescent: px * 0.2 }; },
  createLinearGradient() { const stops = []; gradients.push(stops); return { addColorStop(at, colour) { stops.push([at, colour]); } }; },
}, { get: (o, k) => k in o ? o[k] : () => {} });
globalThis.Path2D = class {};
globalThis.document = { createElement: () => ({ getContext: () => context }) };
const atlas = makeAtlas();
assert.equal(atlas.pages.length, 5, 'the correction must keep the atlas at five pages');
assert.ok(atlas.pages.every(p => p.width <= 2048 && p.height <= 2048));
assert.ok(ART_TEXT.kMap.length > 10 && ART_TEXT.kLoc.length > 20, 'map lettering was not recorded');
const skyColours = key => { const first = gradients.length, art = ART[key]; art.draw(context, art.w, art.h); return gradients[first]; };
for (const key of ['photoRaw', 'photoHalf', 'photoLevels']) assert.deepEqual(skyColours(key), [[0, '#C1C2BF'], [1, '#C1C2BF']], `${key}: sky must stay flat grey`);
for (const key of ['photoSky', 'photoNoCone', 'photoClean', 'kPhoto']) assert.deepEqual(skyColours(key), [[0, '#6E9CD6'], [1, '#D9E6F1']], `${key}: replaced sky must stay blue through the grade`);
// Revisit every action after atlas-time font measurement, including rotated map type and carets.
sceneStart = 0;
for (const scene of SHOW) {
  const s = SCRIPTS[scene.key];
  for (const a of s.actions) for (const f of [0, 0.25, 0.5, 0.75, 0.999999]) check(sceneStart + a.start + (a.end - a.start) * f);
  if (['pr', 'ae', 'fig'].includes(scene.key)) {
    const exp = s.actions.find(a => a.id === 'export'), land = playbackSpans(s).land;   // CORRECTIONS-13: plays start once every body is built
    for (const f of [0.01, 0.2, 0.333333, 0.5, 0.7, 0.99, 1.2, 1.7, 1.99]) {
      if (scene.key === 'fig' && f >= 1) continue;
      const at = land + f * (scene.key === 'fig' ? 3 : 1.6) * PACE, list = frameAt(sceneStart + at);
      near(list.clock, f % 1);
      assert.ok(list.some(pc => pc.device === 0));
      for (const pc of list.filter(pc => pc.device !== undefined)) near(pc.clock, list.clock);
    }
    const list = frameAt(sceneStart + land + 0.16 * PACE);   // as before: 0.16 s into the plays
    const bodies = [0, 1, 2].map(i => list.find(pc => pc.where === 'floor' && pc.device === i && pc.deviceBody));
    assert.ok(bodies.every(Boolean), 'device row did not land');
    const footprint = (scene.key === 'fig' ? list.filter(pc => pc.where === 'floor') : bodies).flatMap(corners), xs = footprint.map(p => p[0]), zs = footprint.map(p => p[2]);
    centred((Math.min(...xs) + Math.max(...xs)) / 2, scene.key);
    if (scene.key !== 'fig') near(Math.min(...zs), MAT.z);
    else {   // CORRECTIONS-13 U1: the tablet's back edge now sits on the deck's (tabZ behind the row line), not on the mat's back edge.
      near(Math.min(...corners(bodies[1]).map(p => p[2])), MAT.z + UI_ROW.forward + UI_ROW.tabZ);
      assert.ok(Math.min(...zs) >= MAT.z + UI_ROW.forward - 0.02 - 1e-6, 'fig row reaches behind its row line');
    }
    assert.ok(list.some(pc => pc.where === 'content' && ['shotA', 'shotB', 'shotCfx', 'wMake', 'uiPageWide0', 'uiPageWide1'].includes(pc.art)), 'viewer is not playing with the devices');
  }
  sceneStart += scene.len;
}
// Changing PACE must stretch time alone, including the shell and every exported device clock.
const stageURL = new URL('../stage.mjs', import.meta.url);
const stretchedSource = fs.readFileSync(stageURL, 'utf8').replace('export const PACE = 1;', 'export const PACE = 2;').replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_all, _quote, ref) => `from '${new URL(ref, stageURL).href}'`);
const stretched = await import('data:text/javascript;base64,' + Buffer.from(stretchedSource).toString('base64'));
near(stretched.LOOP, LOOP * 2);
sceneStart = 0;
for (let i = 0; i < SHOW.length; i++) {
  near(stretched.SHOW[i].len, SHOW[i].len * 2);
  for (const f of [0.134, 0.3337, 0.7169, 0.981]) {
    const time = sceneStart + SHOW[i].len * f, normal = frameAt(time), slow = stretched.frameAt(time * 2);
    assert.equal(normal.length, slow.length, 'PACE changed the pieces');
    normal.forEach((pc, j) => {
      assert.equal(pc.art, slow[j].art);
      for (const field of ['p', 'q', 's', 'e']) pc[field].forEach((n, k) => near(n, slow[j][field][k]));
      if (pc.clock !== undefined) near(pc.clock, slow[j].clock);
    });
  }
  sceneStart += SHOW[i].len;
}
const readme = fs.readFileSync(new URL('../README.md', import.meta.url), 'utf8');
if (!process.argv.includes('--control')) for (const scene of SHOW) for (const a of SCRIPTS[scene.key].actions) assert.ok(readme.includes(`| ${scene.key} | ${a.id} | ${a.kind} | ${(a.start / PACE).toFixed(3)} | ${(a.end / PACE).toFixed(3)} |`), `README action table is stale at ${scene.key}/${a.id}`);
// Exercise the real player with drawing and DOM stand-ins. This is a logic check, never a browser review.
const node = rect => ({
  events: {}, attributes: {}, textContent: '', classList: { remove() {} },
  rect, getBoundingClientRect() { return this.rect; },
  addEventListener(name, f) { this.events[name] = f; },
  setAttribute(name, value) { this.attributes[name] = value; },
  removeAttribute(name) { delete this.attributes[name]; },
});
const hero = node({ left: 0, top: 0, width: 1440, height: 900 }), stage = node({ left: 760, top: 80, width: 600, height: 700 }), pause = node(), crafts = [0, 1, 2, 3].map(() => node());
hero.querySelector = s => s === '[data-stage-box]' ? stage : s === '[data-pause]' ? pause : node();
hero.querySelectorAll = () => crafts;
let scheduledTick;
const craftFollows = [];
const media = { matches: false, addEventListener(_name, f) { this.change = f; } }, win = {}, draws = [];
const playerDocument = { querySelector: () => hero, fonts: { ready: Promise.resolve(), addEventListener() {} }, hidden: false, addEventListener() {} };
const renderer = { setAtlas() {}, draw(pieces, view) { draws.push({ pieces, view }); } };
const observer = class { observe() {} };
const player = fs.readFileSync(new URL('../play.mjs', import.meta.url), 'utf8').replace(/^import\s+.*?;\s*$/gm, '');
const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
await new AsyncFunction('env', `const { sceneEnvelope, location, document, window, matchMedia, createRenderer, makeCamera, dot, corners, makeAtlas, fontsReady, SHOW, LOOP, SCENES, BLOCK, POOL, sceneAt, frameAt, calloutsAt, createCallouts, createPageLayout, createNameReact, createStars, starReach, createCraftWipe, ENTRANCE, entranceAt, screenPlane, floorReach, createEntranceView, devicePixelRatio, requestAnimationFrame, cancelAnimationFrame, IntersectionObserver, ResizeObserver } = env;\n${player}`)({
  sceneEnvelope, location: { search: '?t=0' }, document: playerDocument, window: win, matchMedia: () => media,
  createRenderer: () => renderer, makeCamera, dot, corners, makeAtlas: () => atlas, fontsReady: async () => {},
  SHOW, LOOP, SCENES, BLOCK, POOL, sceneAt, frameAt, calloutsAt, createCallouts: () => ({ draw() {}, fit: view => view, layout: [] }), devicePixelRatio: 3,
  createNameReact: () => ({ measure() {}, setLive() {}, live: false, open: 0, letters: [] }), createCraftWipe: () => ({ measure() {}, follow(craft, options) { craftFollows.push([craft, !!options?.cut]); }, hold: () => null, state: null }), createStars: () => ({ measure() {}, frame: () => null, after() {}, swallowClick: () => false, field: null }), starReach: () => null, createPageLayout: () => ({ measure() {}, cover() {}, get metrics() { return { h: hero.rect, b: stage.rect }; }, view(need, cam, dpr) { const h = hero.rect, b = stage.rect, S = Math.min(b.width / need.w, b.height / need.h); return { W: h.width, H: h.height, S, cx: b.left + b.width / 2 - S * need.x, cy: b.top + b.height / 2 + S * need.y, cam, dpr }; } }),
  ...entranceModule,
  requestAnimationFrame: callback => { scheduledTick = callback; return 1; }, cancelAnimationFrame() {}, IntersectionObserver: observer, ResizeObserver: observer,
});
assert.equal(win.__ready, true);
assert.ok(draws.at(-1).view.dpr <= 2);
hero.rect = { left: 0, top: 0, width: 1920, height: 1080 };
win.__hero.seek(0);
assert.ok(draws.at(-1).view.dpr ** 2 * 1920 * 1080 <= 5.2e6 + 1e-6, 'pixel ceiling: backing store exceeds 5.2 million pixels');
hero.rect = { left: 0, top: 0, width: 1440, height: 900 };
win.__hero.seek(0); near(draws.at(-1).view.dpr, 2);
crafts[0].events.click();
near(sceneAt(win.__hero.t).at, SHOW[2].still); // A paused graphic-design choice uses the InDesign still.
crafts[2].events.click();
near(sceneAt(win.__hero.t).at, SHOW[4].still);
pause.events.click(); crafts[0].events.click(); near(win.__hero.t, 0);
pause.events.click(); stage.events.click(); near(sceneAt(win.__hero.t).at, SHOW[3].still);
pause.events.click();
scheduledTick(0); const beforeStall = win.__hero.t;
scheduledTick(1000); near(win.__hero.t - beforeStall, 0.1);
scheduledTick(1100); near(win.__hero.t - beforeStall, 0.2);
pause.events.click();
media.matches = true; media.change(); near(sceneAt(win.__hero.t).at, SHOW[3].still);
// Rounds 11-14: every draw hands the craft list the scene's own craft; the stand-in page has no entrance (?t=0), so no cut.
assert.ok(craftFollows.length >= draws.length && craftFollows.at(-1)[0] === sceneAt(win.__hero.t).scene.craft && craftFollows.every(([, cut]) => !cut), 'C1: the player does not hand the craft list its craft on each draw');
win.__hero.seek(-0.01); near(win.__hero.t, LOOP - 0.01);
// Dense reading poses include the leaves at their widest, between the six fitted stills.
for (let n = -240; n <= 960; n++) includeFit(SCENES[2]({ at: n / 240 }));
for (const [width, height, box] of [[1440, 900, { left: 633.6, top: 88, width: 742.4, height: 740 }], [390, 664, { left: 0, top: 64, width: 390, height: 240 }]]) {
  hero.rect = { left: 0, top: 0, width, height }; stage.rect = box;
  win.__hero.seek(0);
  const { S, cx, cy } = draws.at(-1).view, padding = (0.13 - 0.001) * S;
  assert.ok(cx + S * visibleBounds[0] >= box.left + padding, width + ': left fit margin');
  assert.ok(cx + S * visibleBounds[1] <= box.left + box.width - padding, width + ': right fit margin');
  assert.ok(cy - S * visibleBounds[3] >= box.top + padding, width + ': top fit margin');
  assert.ok(cy - S * visibleBounds[2] <= box.top + box.height - padding, width + ': bottom fit margin');
}
// Parse the offline module without running it. All font URLs and page links must be self-contained.
const preview = previewMarkup(), moduleSource = preview.match(/<script type="module">([\s\S]*)<\/script>/)[1];
new AsyncFunction(moduleSource.replace(/import\.meta\.url/g, '"offline"'));
assert.ok(preview.startsWith('<title>Journey hero take two</title>'));
assert.ok(!/<!doctype|<html\b|<head\b|<body\b/i.test(preview));
assert.ok(!/\b(?:src|href)=/.test(preview.split('<script>')[0]));
assert.ok(!/url\((?!data:)/.test(preview.split('<script>')[0]));

// C12: inspect what was actually emitted, at regular samples and both sides of each action boundary.
// This is geometry/provenance evidence. It does not claim to inspect rendered pixels.
const rectOf = pc => {
  const p = corners(pc), xs = p.map(v => (v[0] - SCREEN.l) / 1.15), ys = p.map(v => (v[1] - SCREEN.b) / 1.15);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
};
const contains = (r, p) => p[0] >= r[0] - 1e-8 && p[0] <= r[2] + 1e-8 && p[1] >= r[1] - 1e-8 && p[1] <= r[3] + 1e-8;
const distanceTo = (r, p) => Math.hypot(Math.max(r[0] - p[0], 0, p[0] - r[2]), Math.max(r[1] - p[1], 0, p[1] - r[3]));
const overlaps = (a, b) => Math.min(a[2], b[2]) > Math.max(a[0], b[0]) + 1e-8 && Math.min(a[3], b[3]) > Math.max(a[1], b[1]) + 1e-8;
const topOf = pc => pc.p[2] + pc.s[2];
const panelX = SCREEN.w / 1.15 - 0.93, panelTop = SCREEN.h / 1.15 - 0.54;
const exemptions = {
  openingFurniture: 'App furniture belongs to the opening wipe; it is not a new document object.',
  playback: 'The viewer and exported devices replay work already made by the cursor.',
  runMember: 'The cursor makes the members of one explicit run inside its own bounding box.',
  sourceEcho: 'This piece explicitly names the cursor-made source action that it mirrors.',
  overlay: 'Selections, carets and playheads mark existing work.',
  carried: 'This is the piece currently being dragged by the cursor.',
  blankPage: "CORRECTIONS-12 I1: InDesign's document opens with its blank pages already there, as a new document does.",
};
function exemption(pc, scene, at, a, r) {
  if (pc.echo) {
    const source = SCRIPTS[scene].actions.find(a => a.id === pc.echo);
    assert.ok(source, 'R5: invalid echo source ' + pc.echo);
    assert.ok(at >= source.start - 1e-8, 'R5: echo precedes source action ' + pc.echo);
  }
  if (pc.overlay || pc.caret) return 'overlay';
  if (pc.where === 'floor' || pc.playback) return 'playback';
  if (pc.where === 'travel' && a?.kind === 'drag' && pc.action === a.id) return 'carried';
  if (!pc.document && at <= 0.8 * PACE) return 'openingFurniture';
  if (scene === 'id' && pc.page && at <= 0.8 * PACE) return 'blankPage';
  if (a?.kind === 'run' && at <= a.end + 1e-8) {
    const points = [a.from, a.to, ...(a.path || []), ...(a.points || [])];
    const bounds = [Math.min(...points.map(p => p[0])) - 0.6, Math.min(...points.map(p => p[1])) - 0.6, Math.max(...points.map(p => p[0])) + 0.6, Math.max(...points.map(p => p[1])) + 0.6];
    if (overlaps(r, bounds)) return 'runMember';
  }
  if (pc.echo) {
    return 'sourceEcho';
  }
  return null;
}
const textFamilies = { ps: {}, ai: { labels: 'kMap', title: 'kMap', cityLabels: 'kLoc' }, id: { heading: 'idHeading', coverTitle: 'idCover', postTitle: 'idPost', mailTitle: 'eblast', mailFlyer: 'idFlyer' }, pr: { caption: 'cap1', caption2: 'cap2', caption3: 'cap3' }, ae: { make: 'wMake', move: 'wMove' }, fig: { heading: 'wireHeading', name: 'siteName0' } };
const fullText = { kCover: 'idCover', kPost: 'idPost', eblast: 'eblast', cap1: 'cap1', cap2: 'cap2', cap3: 'cap3', uiBuild3Wide: 'siteName0', uiWide: 'siteName0' };
let ruleStart = 0;
for (const scene of SHOW) {
  const s = SCRIPTS[scene.key], byId = Object.fromEntries(s.actions.map(a => [a.id, a]));
  const samples = new Set(Array.from({ length: Math.ceil(scene.len * 60) }, (_, n) => n / 60));
  for (const a of s.actions) for (const f of [-1e-7, 0, 0.01, 0.1, 0.25, 0.5, 0.75, 0.999999, 1, 1.000001]) samples.add(a.start + (a.end - a.start) * f);
  const seen = new Set(), seenRows = new Set(), typed = new Set();
  for (const at of [...samples].filter(t => t >= 0 && t < scene.len - 0.3 * PACE).sort((a, b) => a - b)) {
    const time = ruleStart + at, list = frameAt(time), a = s.actions.filter(a => at >= a.start - 1e-9).at(-1);
    const active = a && at < a.end - 1e-9;
    checkWait(time, list, sceneAt(time).scene, sceneAt(time).at);
    const ruleFail = (rule, message) => fail(time, rule + ': ' + message);
    if (scene.key === 'id') {
      for (const pc of list.filter(pc => pc.document && pc.where === 'content')) {
        const r = rectOf(pc), inPanel = r[0] >= panelX - 0.01;
        // R1: these assets really contain the photo, including the small page thumbnails.
        if (/^(?:kCover|kOfferL|kGal[LR]|kBack|coverPhoto|coverBlob|coverDecor|kPost|postPhoto|eblast|mailPhoto|mailButtonStyle|idCover\d+|idPost\d+|idMail\d+|idFlyer\d+|kPhoto)$/.test(pc.art || '')) {
          const destination = inPanel ? 'photo' : ['photo', 'postPhoto', 'mailPhoto'].sort((a, b) => distanceTo(r, byId[a].to) - distanceTo(r, byId[b].to))[0];
          if (at < byId[destination].end - 1e-8) ruleFail('R1', pc.art + ' precedes its ' + destination + ' release');
        }
        if (inPanel && /^k(?:Cover|Offer[LR]|Loc[LR]|Am[LR]|Gal[LR]|Back)$/.test(pc.art || '')) {
          const th = 0.36 * 340 / 440, row = Math.round((panelTop - 0.13 - r[1] - th) / (th + 0.1));
          if (!seenRows.has(row)) {
            const maker = row === 0 ? byId.coverTitle : row === 2 ? byId.loc : row === 3 ? byId.spreadType : byId.pages;
            const expected = [1, 4, 5].includes(row) ? maker.start + [1, 4, 5].indexOf(row) * (maker.end - maker.start) / maker.count : maker.end;   // a third of the run each (CORRECTIONS-7 K2)
            if (at < expected - 1e-8 || at > expected + 1 / 60 + 1e-7) ruleFail('R2', 'page row ' + row + ' appeared outside ' + maker.id);
            seenRows.add(row);
          }
        }
        if (['kCover', 'kPost', 'eblast'].includes(pc.art) && (!pc.window || pc.window.every((v, i) => Math.abs(v - [0, 0, 1, 1][i]) < 1e-8))) {
          const id = { kCover: 'blob', kPost: 'postBlob', eblast: 'mailBlob' }[pc.art];
          if (!byId[id] || byId[id].kind !== 'draw' || at < byId[id].end - 1e-8) ruleFail('R3', pc.art + ' precedes its drawn blob');
        }
      }
    }
    // R4: the first visible prefix has a caret. A completed composite/caption must have typed ancestry.
    for (const pc of list.filter(pc => pc.document && pc.where === 'content' && !pc.caret)) {
      if (pc.text?.count > 0 && !typed.has(pc.text.key)) {
        if (!pc.text.prefix || !list.some(p => p.caret === pc.text.key)) ruleFail('R4', pc.text.key + ' first appeared without a typing prefix and caret');
        else typed.add(pc.text.key);
      }
      const family = fullText[pc.art];
      if (family && !pc.text && !pc.window && !typed.has(family)) ruleFail('R4', pc.art + ' appeared before its text was typed');
    }
    // R5: first appearance of actual document geometry, with a closed role/reason exemption list above.
    for (const pc of list.filter(pc => pc.document)) {
      const r = rectOf(pc), identity = [pc.art || pc.tone, ...r.map(n => n.toFixed(5)), pc.window?.join(',')].join('/');
      if (seen.has(identity)) continue;
      seen.add(identity);
      const role = exemption(pc, scene.key, at, a, r);
      if (role) { assert.ok(exemptions[role]); continue; }
      const cursor = tip(list).map((v, i) => (v - [SCREEN.l, SCREEN.b][i]) / 1.15), points = [cursor, ...(a ? [a.from, a.to, ...(a.points || []), ...(a.path || []), ...(a.curve || [])] : [])];
      if (!points.some(p => distanceTo(r, p) <= 0.6 + 1e-8)) ruleFail('R5', 'new ' + (pc.art || pc.tone) + ' is far from the cursor and action points');
    }
    // R6: every landed InDesign image remains present until an explicit replacement, never under a plain plate.
    const placements = {
      id: [['map', ['kMap', 'kAmL', 'kAmR']], ['photo', ['coverPhoto', 'coverBlob', 'coverDecor', 'kCover']], ['postPhoto', ['postPhoto', 'kPost']], ['mailPhoto', ['mailPhoto', 'eblast']]],
      ai: [['mapExport', ['kMap']], ['locExport', ['kLoc']]],
      pr: [['clipA', ['thumbA']], ['clipB', ['thumbB']], ['clipC', ['thumbC']]],
      ae: at < byId.play?.start ? [['path', ['redBall']]] : [],
      fig: [['hero', ['uiBuild2Wide', 'uiBuild3Wide', 'uiWide', 'uiPageWide0', 'uiPageWide1']]],
    };
    for (const [id, pictures] of placements[scene.key] || []) {
      if (at < byId[id].end + 1e-9) continue;   // the release instant itself can read as still dragging after global-to-local rounding
      let point = byId[id].to;
      const image = list.filter(pc => pictures.includes(pc.art) && (scene.key === 'pr' ? pc.where === 'content' && rectOf(pc)[3] < 1.12 : scene.key === 'ae' ? pc.where === 'content' && rectOf(pc)[0] > 1.3 : contains(rectOf(pc), point))).sort((a, b) => topOf(b) - topOf(a))[0];
      if (image && scene.key === 'pr') { const r = rectOf(image); point = [(r[0] + r[2]) / 2, (r[1] + r[3]) / 2]; }
      if (!image) { ruleFail('R6', id + ' disappeared after landing'); continue; }
      const r = rectOf(image);
      for (const plate of list.filter(pc => !pc.art && !pc.overlay && pc.where !== 'floor' && pc.where !== 'travel' && quatRotate(pc.q, [0, 0, 1])[2] > 1 - 1e-9)) {
        const pr = rectOf(plate);
        if (pr[2] - pr[0] > 0.08 && pr[3] - pr[1] > 0.08 && overlaps(r, pr) && topOf(image) - topOf(plate) < 0.0006 * 1.15 - 1e-9) ruleFail('R6', id + ' is behind a plain overlapping face');
      }
    }
    // R7: inspect the red tool icon emitted by the app, rather than trusting the scheduler's name alone.
    if (active && at > a.start + 1e-7 && ['set', 'drag', 'click'].includes(a.kind)) {
      const expected = a.tool || 'arrow', icons = { arrow: 'tArrow', type: 'tType', rectangle: 'tRect', frame: scene.key === 'fig' ? 'tHash' : 'tFrame', ellipse: 'tCircle', blade: 'tBlade' };
      const expectedIcon = icons[expected] || expected;
      const lit = list.filter(pc => pc.tone === 'red' && ['tArrow', 'tMove', 'tType', 'tRect', 'tFrame', 'tHash', 'tCircle', 'tBlade', 'tWand'].includes(pc.art));
      if (!lit.some(pc => pc.art === expectedIcon)) ruleFail('R7', a.id + ' lights ' + lit.map(pc => pc.art).join(',') + ' instead of ' + expectedIcon);
    }
  }
  for (const [id, key] of Object.entries(textFamilies[scene.key])) {
    const a = byId[id];
    if (!a || a.kind !== 'type') { fail(ruleStart, 'R4: ' + id + ' needs a type action'); continue; }
    const sample = frameAt(ruleStart + a.start + (a.end - a.start) * 0.4);
    if (!sample.some(pc => pc.text?.key === key && pc.text.count > 0 && pc.text.count < pc.text.total && pc.text.prefix) || !sample.some(pc => pc.caret === key)) fail(ruleStart + a.start, 'R4: ' + id + ' lacks a partial prefix/caret');
  }
  ruleStart += scene.len;
}
const timetable = await retimer({ SHOW, SCRIPTS });
runCorrections({ fail, frameAt, calloutsAt, SHOW, LOOP, SCREEN, MAT, SCRIPTS, PACE, UI_ROW, playbackSpans, prototypeState, tip, retime: timetable.local });
try { console.log(checkPageLabels()); } catch (error) { fail(SHOW.slice(0, 5).reduce((n, s) => n + s.len, 0) + playbackSpans(SCRIPTS.fig).land + 0.4 * PACE, error.message); }
try { console.log(await checkDrags()); } catch (error) { fail(timetable.global(25.25), error.message); }
try { const r = await checkRound5(); console.log(`H1–H7 computed: ${r.H1.draws} draw ends, ${r.H1.growingSamples} spread samples; loop ${r.H2.loop.toFixed(3)}s, land 3.0s; ${r.H3.samples} laptop poses; ${r.H6.continuitySamples} resize samples; ${r.H7.rays} floor rays; F3 no floor hover. Font ink, layout, pixels and frames UNRUN.`); } catch (error) { fail(0, error.message); }
try { const r = await checkRound5Addendum(); console.log(`H9/H10 computed: ${r.H9.measurements} CSSOM-model measurements, ten repeats and away/back at ten sizes; X1 envelope scale against round 4 ${r.H9.envelopeScale.map(n => n.toFixed(4)).join("–")}; ${r.H10.after.samples} Figma poses at 0.02 s; laptop/app gap ${r.H10.after.minimumGap.toFixed(6)} px, Laptop ring clearance ${r.H10.after.minimumRing.toFixed(6)} px (S=103.6); ${r.H10.preservedFrames} incoming-piece comparisons. Browser checks UNRUN.`); } catch (error) { fail(0, error.message); }
try { console.log(await checkRound5SecondAddendum()); } catch (error) { fail(0, error.message); }
try { console.log(await checkEntrance()); console.log('E1/E4 negative controls: ' + await withSourceLines(checkEntranceControls)); } catch (error) { fail(0, error.message); }
try { console.log(describe(await checkHand())); console.log('K3 negative controls: ' + await checkHandControls()); } catch (error) { fail(0, error.message); }
try { console.log(await checkRound8()); console.log('Round 8 negative controls: ' + await withSourceLines(checkRound8Controls)); } catch (error) { fail(0, error.message.split('\n')[0]); }
try { console.log(await checkRound9()); console.log('Round 9 negative controls: ' + await withSourceLines(checkRound9Controls)); } catch (error) { fail(0, error.message.split('\n')[0]); }
try { console.log(await checkRound10()); console.log('Round 10 negative controls: ' + await checkRound10Controls()); } catch (error) { fail(0, error.message.split('\n')[0]); }
// Round 12 (S1): its L2 checks (the selection box) are gone with the box; round 14's letter roll (K1) carries round 11's
// and round 12's kept rules for the craft list.
try { console.log(await checkRound12StarsList()); console.log('Round 12 (S1) negative controls: ' + await checkRound12Controls()); } catch (error) { fail(0, error.message.split('\n')[0]); }
try { console.log(await checkRound14()); console.log('Round 14 (K1) negative controls: ' + await checkRound14Controls()); } catch (error) { fail(0, error.message.split('\n')[0]); }
// Round 16 (R1-R5): the ring round the mark, the tremble, the hold that keeps gathering.
try { console.log(await checkRound16()); console.log('Round 16 (R1-R5) negative controls: ' + await checkRound16Controls()); } catch (error) { fail(0, error.message.split('\n')[0]); }
try { console.log(await checkRound12Scene()); console.log('Round 12 (D1, I1, X1) negative controls: ' + await checkRound12SceneControls()); } catch (error) { fail(0, error.message.split('\n')[0]); }
try { console.log(await checkRound13Rows(stageModule)); console.log('Round 13 (U1, I2) negative controls: ' + await checkRound13RowsControls()); } catch (error) { fail(0, error.message.split('\n')[0]); }
// CORRECTIONS-15: the ball and the sink (S1, S2), the map without its selection box (N1) and flat drags (N2); round 13's E1/E2 are retired.
try { console.log(await checkRound15(stageModule)); console.log('Round 15 (S1, S2, N1, N2) negative controls: ' + await checkRound15Controls()); } catch (error) { fail(0, error.message.split('\n')[0]); }
try { console.log(await checkRound17(stageModule)); console.log('Round 17 negative controls:\n' + await checkRound17Controls()); } catch (error) { fail(0, error.message.split('\n')[0]); }
console.log('R1–R8 sampled: photo releases, pages, blobs, typing, births, placed images, tools, resting waits');

if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`checked ${frames} frames, ${pieces} pieces (max ${largest}); ${atlas.pages.length} atlas pages; loop ${LOOP.toFixed(3)}s`);
  console.log(SHOW.map(s => `${s.key}: ${s.len.toFixed(3)}s`).join(', '));
  if (process.argv.includes('--metrics')) console.log(JSON.stringify({ atlas: atlas.pages.map(p => [p.width, p.height]), baseBytes: atlas.pages.reduce((n, p) => n + p.width * p.height * 4, 0), mipBytes: atlas.pages.reduce((n, p) => n + p.width * p.height * 4 * 4 / 3, 0) }));
  console.log('all clean');
  if (process.argv.includes('--timeline')) {
    console.log('| App | Action | Kind | Start | End |\n| --- | --- | --- | ---: | ---: |');
    for (const scene of SHOW) for (const a of SCRIPTS[scene.key].actions) console.log(`| ${scene.key} | ${a.id} | ${a.kind} | ${(a.start / PACE).toFixed(3)} | ${(a.end / PACE).toFixed(3)} |`);
  }
}
