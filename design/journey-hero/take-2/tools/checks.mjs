// Geometry and clock checks. No browser, filesystem writes or dependencies.
import assert from 'node:assert/strict';
import { ART, ROWS } from '../art.mjs';
import { TONES } from '../sq.mjs';
import { SHOW, LOOP, SCENES, SCREEN, MAT, frameAt, sceneAt } from '../stage.mjs';

let frames = 0, pieces = 0;
const errors = [];
function fail(time, message) {
  if (errors.length < 30) errors.push(`${time.toFixed(6)}s (${sceneAt(time).scene.key}): ${message}`);
}
function finite(value, name, time) {
  if (typeof value === 'number' && !Number.isFinite(value)) fail(time, `${name} is not finite`);
  else if (value && typeof value === 'object') {
    for (const [key, v] of Object.entries(value)) finite(v, `${name}.${key}`, time);
  }
}
function check(time) {
  const { scene, at } = sceneAt(time), list = frameAt(time);
  frames++; pieces += list.length;
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
      if (!pc.clip || pc.clip.some((n, j) => n !== [0, 0, 1, -MAT.z][j])) fail(time, `piece ${i}: floor slot plane changed`);
    }
  });
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
assert.equal(LOOP, 40.35);
assert.equal(sceneAt(LOOP).i, 0);
assert.equal(sceneAt(-0.01).scene.key, 'fig');
assert.deepEqual(frameAt(-0.01), frameAt(LOOP - 0.01));
assert.deepEqual(frameAt(0), frameAt(LOOP));
assert.throws(() => frameAt(NaN), TypeError);
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} differs from ${b}`);
const tip = list => {
  const pc = list.find(pc => pc.art === 'cursor');
  return [pc.p[0] - 0.46 * (0.5 - 10 / 96), pc.p[1] + 0.46 * (0.5 - 6 / 96)];
};
// A drag follows the same rectangle it moves or the same plane it reveals.
for (let at = 1.3; at < 2.4; at += 1 / 60) {
  const list = frameAt(at), raw = list.find(pc => pc.art === 'kPhotoB' && pc.window);
  near(tip(list)[0], raw.p[0] + raw.s[0]);
}
for (const [a, b, art] of [[0.7, 1.5, 'kMap'], [1.65, 2.25, 'kLoc']]) {
  for (let at = a + 1 / 60; at < b; at += 1 / 60) {
    const list = frameAt(4.3 + at), map = list.find(pc => pc.art === art);
    near(tip(list)[0], Math.min(map.clip[3], map.p[0] + map.s[0]));
  }
}
for (const [start, a, b, art] of [[9.35, 0.55, 1, 'kMap'], [18.75, 1.8, 2.35, 'trans'], [18.75, 2.8, 3.3, 'fx'], [33.95, 1, 1.4, 'uiWide']]) {
  for (let at = a; at < b; at += 1 / 60) {
    const list = frameAt(start + at), work = list.find(pc => pc.art === art && pc.where === 'travel');
    assert.ok(work, `missing dragged ${art}`);
    const [x, y] = tip(list); near(x, work.p[0]); near(y, work.p[1]);
  }
}
// The new slide law must leave the approved parked list in exactly its old place.
const rows = SCENES[4]().filter(pc => pc.art === 'rowA' || pc.art === 'rowB');
assert.equal(rows.length, 3);
ROWS.forEach(([x, y, w, h], i) => {
  near(rows[i].p[0], SCREEN.l + (1.33 + (x + w / 2) * 1.92 / 480) * 1.15);
  near(rows[i].p[1], SCREEN.b + (1.5 + 1.08 - (y + h / 2) * 1.08 / 270) * 1.15);
  assert.deepEqual(rows[i].window, [0, 0, 1, 1]);
});
// The booklet strip is a reading pose, while the rest of InDesign stays at its still time.
for (const at of [-1, -0.7, 0, 0.3, 1, 1.4, 2, 2.76, 4]) {
  const list = SCENES[2]({ at });
  assert.ok(list.some(pc => pc.where === 'floor'));
  assert.ok(list.filter(pc => pc.where === 'floor').every(pc => pc.p[2] >= MAT.z));
}
assert.ok(SCREEN.w > 0);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`checked ${frames} frames, ${pieces} pieces`);
  console.log('all clean');
}
