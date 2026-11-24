// L14's geometry and event gates use emitted pieces, never a mutable playback cache.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as M from '../stage.mjs';
import { corners } from '../kit.mjs';
import { HOME, EASE } from '../../../../public/journey/hero/engine.mjs';
import { SPARKS, PUFF, sparkOrigin, sparkFrame, kickExportBursts } from '../export-sparks.mjs';
export const keys = ['id', 'pr', 'ae', 'fig'];
export const ks = [0, .15, .29, .31, .5, 1];
const stageSource = fs.readFileSync(new URL('../stage.mjs', import.meta.url), 'utf8');
const absolute = source => source.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_, q, ref) => `from '${new URL(ref, new URL('../stage.mjs', import.meta.url)).href}'`);
const unscaledSource = stageSource.replace('pc.p = pc.p.map((v, i) => origin[i] + (v - origin[i]) * scale); pc.s = pc.s.map(v => v * scale);', '// Leave source geometry at its own pose for the independent scale oracle.');
assert.notEqual(unscaledSource, stageSource, 'L14 scale oracle: mutation site');
const R = await import('data:text/javascript;base64,' + Buffer.from(absolute(unscaledSource)).toString('base64'));
export const startOf = (m, key) => m.SHOW.slice(0, m.SHOW.findIndex(s => s.key === key)).reduce((n, s) => n + s.len, 0);
export const bounds = pieces => {
  const ps = pieces.flatMap(corners);
  return [0, 1, 2].map(k => [Math.min(...ps.map(p => p[k])), Math.max(...ps.map(p => p[k]))]);
};
const near = (a, b, label, tolerance = 1e-7) => assert.ok(Math.abs(a - b) <= tolerance, `${label}: ${a} != ${b}`);
export function steps(m = M) {
  return keys.flatMap(key => ['in', 'out'].flatMap(direction => [0, 1, 2].map(part => {
    const s = m.SCRIPTS[key], click = s.actions.find(a => a.id === 'export').start;
    const at = startOf(m, key) + (direction === 'in' ? click + m.ballBeats(key, part).wipe * m.PACE
      : m.playbackSpans(s).off[0] + part * m.EXIT.stagger * m.PACE);
    return { key, direction, part, at, duration: (direction === 'in' ? m.BALL.become : m.EXIT.wipe) * m.PACE };
  })));
}
export function stepPieces(m, step, k) {
  // The completed step hands over to the following phase. Inspect its left limit at k=1.
  return m.frameAt(step.at + Math.min(k, 1 - 1e-9) * step.duration + (k === 0 ? 1e-10 : 0))
    .filter(p => p.assetPart === step.part);
}
const grouped = pieces => {
  const out = new Map();
  for (const p of pieces) { if (!out.has(p.assetUnit)) out.set(p.assetUnit, []); out.get(p.assetUnit).push(p); }
  return out;
};
export function checkPop(m = M) {
  let samples = 0, units = 0, worstScale = 0, minimumGap = Infinity;
  for (const step of steps(m)) {
    const baseline = grouped(stepPieces(m, step, step.direction === 'in' ? 1 : 0));
    const expectedCount = step.key === 'id' && step.direction === 'out' && step.part === 0 ? 2 : 1;
    assert.equal(baseline.size, expectedCount, 'L14 units: connected objects'); units += baseline.size;
    const times = new Set([...ks, .3, ...Array.from({ length: Math.ceil(step.duration * 60) + 1 }, (_, n) => Math.min(1, n / (step.duration * 60)))]);
    for (const k of times) {
      const pcs = stepPieces(m, step, k), groups = grouped(pcs), raw = grouped(stepPieces(R, step, k)), scale = k < .3 ? 1 + .08 * EASE.exit(k / .3) : 1.08 - .08 * EASE.enter((k - .3) / .7);
      assert.equal(groups.size, expectedCount, 'L14 units: missing unit');
      for (const [id, pieces] of groups) {
        const red = pieces.filter(p => p.morph === 'shape');
        assert.ok(!red.length || red.length === pieces.length, 'L14 never red and object at once');
        const showRed = step.direction === 'in' ? k < .3 : k >= .3;
        assert.equal(!!red.length, showRed, 'L14 cut: wrong side');
        assert.ok(pieces.every(p => !p.clip && p.edge === undefined), 'L14 pop: no clip planes or edges');
        const base = raw.get(id), original = bounds(base), actual = bounds(pieces), origin = [(original[0][0] + original[0][1]) / 2, original[1][0], (original[2][0] + original[2][1]) / 2];
        for (let axis = 0; axis < 3; axis++) for (let side = 0; side < 2; side++) {
          const want = origin[axis] + (original[axis][side] - origin[axis]) * scale;
          // Bound error relative to the original dimension measures the actual scale, including its pivot.
          const error = Math.abs(actual[axis][side] - want) / Math.max(1e-8, original[axis][1] - original[axis][0]);
          worstScale = Math.max(worstScale, error);
          assert.ok(error <= .005, `L14 scale: ${step.key}/${step.direction}/${step.part}/${id} k=${k} axis=${axis} error=${error} actual=${actual[axis][side]} expected=${want}`);
        }
        assert.ok(actual[1][0] >= -1e-9, 'L14 floor: geometry below floor');
        if (!red.length) {
          assert.equal(pieces.length, base.length, 'L14 rigid unit: missing layer');
          pieces.forEach((p, i) => {
            assert.equal(p.art, base[i].art, 'L14 rigid unit: picture changed'); assert.deepEqual(p.q, base[i].q, 'L14 rigid unit: rotation changed');
            p.s.forEach((v, axis) => near(v, base[i].s[axis] * scale, 'L14 rigid unit: half size', 1e-6));
            p.p.forEach((v, axis) => near(v, origin[axis] + (base[i].p[axis] - origin[axis]) * scale, 'L14 rigid unit: position', 1e-6));
          });
        }
      }
      // Include the other formats on their own clocks, not just the currently inspected one.
      const all = m.frameAt(step.at + Math.min(k, 1 - 1e-9) * step.duration + 1e-10).filter(p => p.where === 'floor');
      // A format that has already landed must still clear the next format's swell.
      for (const pc of all) if (pc.assetUnit === undefined) pc.assetUnit = `${pc.device ?? 0}:0`;
      const boxes = [...grouped(all).values()].map(bounds);
      for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
        const dx = Math.max(boxes[i][0][0], boxes[j][0][0]) - Math.min(boxes[i][0][1], boxes[j][0][1]);
        const dz = Math.max(boxes[i][2][0], boxes[j][2][0]) - Math.min(boxes[i][2][1], boxes[j][2][1]);
        minimumGap = Math.min(minimumGap, Math.max(dx, dz));
        assert.ok(dx >= -1e-9 || dz >= -1e-9, 'L14 units: overlapping footprints');
      }
      samples++;
    }
  }
  assert.equal(units, 25, 'L14 unit cuts: total');
  near(m.LOOP, 101.49089474781469, 'L14 unchanged loop');
  return { samples, units, worstScale, minimumGap };
}
export function checkPuffs(origin = sparkOrigin) {
  const events = M.popBursts(), view = { S: 100, cx: 720, cy: 450, cam: HOME };
  assert.equal(events.length, 25, 'L14 puff cuts: total'); assert.equal(PUFF.length, 35, 'L14 puff: 35 sparks');
  PUFF.forEach((s, i) => { const old = SPARKS[i * 4]; assert.deepEqual(s.d, old.d); near(s.v, old.v * .3, 'L14 puff speed'); near(s.life, old.life * .6, 'L14 puff life'); near(s.tau, old.tau, 'L14 puff braking'); near(s.size, old.size, 'L14 puff head'); assert.equal(s.red, old.red); });
  let heads = 0;
  for (const e of events) {
    const step = steps().find(s => s.key === e.key && s.part === e.part && s.direction === e.direction);
    near(e.at, step.at + .3 * step.duration, 'L14 cut time');
    const ps = stepPieces(M, step, .3 - 1e-8).filter(p => p.assetUnit === e.unit), b = bounds(ps);
    near(e.centre[1], b[1][1], 'L14 frozen top', 1e-6);
    near(e.centre[0], (b[0][0] + b[0][1]) / 2, 'L14 frozen top x', 1e-6);
    near(e.centre[2], (b[2][0] + b[2][1]) / 2, 'L14 frozen top z', 1e-6);
    near(e.hx, (b[0][1] - b[0][0]) / 2, 'L14 frozen top width', 1e-6);
    near(e.hz, (b[2][1] - b[2][0]) / 2, 'L14 frozen top depth', 1e-6);
    for (const spark of PUFF) {
      const p = origin(e, spark), x = Math.abs(p[0] - e.centre[0]), z = Math.abs(p[2] - e.centre[2]);
      const error = Math.max(Math.min(Math.abs(x - e.hx), Math.abs(z - e.hz)), x - e.hx, z - e.hz, Math.abs(p[1] - e.centre[1]));
      assert.ok(error * view.S <= 1, 'L14 spark edge: head not on frozen top edge'); heads++;
    }
    const frame = sparkFrame([e], e.at, M.LOOP, view); assert.equal(frame.count, 35, 'L14 puff first frame: all heads');
    PUFF.forEach((spark, i) => {
      const p = sparkOrigin(e, spark);
      near(frame.attrs[5 * i], view.cx + view.S * p.reduce((n, v, k) => n + v * HOME.r[k], 0), 'L14 emitted head x', .001);
      near(frame.attrs[5 * i + 1], view.cy - view.S * p.reduce((n, v, k) => n + v * HOME.u[k], 0), 'L14 emitted head y', .001);
    });
    assert.equal(sparkFrame([e], e.at + .75, M.LOOP, view).count, 0, 'L14 puff gone after .75');
  }
  const kicks = [], field = { burstAt(...args) { kicks.push(args); } };
  for (const e of events) kickExportBursts([e], e.at + .001, .01, M.LOOP, view, field);
  assert.equal(kicks.length, 0, 'L14 puff: must not push field');
  for (const e of M.exitBursts()) { assert.equal(sparkFrame([e], e.at, M.LOOP, view).count, 140); kickExportBursts([e], e.at + .001, .01, M.LOOP, view, field); }
  assert.equal(kicks.length, 4, 'L14 ball: original push');
  return { heads, events, puffLife: Math.max(...PUFF.map(s => s.life)), ballHeads: 140, ballKicks: kicks.length };
}
const read = file => fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8').replace(/\r\n/g, '\n');
export async function checkL14Controls() {
  let source = read('stage.mjs');
  const from = source.indexOf('export function assetStep('), to = source.indexOf('\nfunction exportOut(', from);
  assert.ok(from >= 0 && to > from, 'L14 wipe control: mutation site');
  const fault = `export function assetStep(P, objects, k, reverse, part) {
    assetUnits(objects).forEach((u, i) => u.parts.forEach(({pieces, object}) => {
      const b = objectBlock(pieces), red = redPiece(b.p, b.s, b.e, 'shape', part);
      const edge = b.p[0] - b.s[0] + 2*b.s[0]*EASE.wipe(clamp(k,0,1));
      const out = k <= 0 ? (reverse ? pieces : [red]) : k >= 1 ? (reverse ? [red] : pieces) : [red,...pieces];
      for(const pc of out) { pc.assetUnit = part+':'+i; pc.assetPart = part; pc.assetOrigin = [b.p[0],b.p[1]-b.s[2],b.p[2]];
        if(k>0 && k<1) pc.clip = [pc===red?-1:1,0,0,pc===red?edge:-edge]; P.push(pc); }
    }));
  }`;
  source = source.slice(0, from) + fault + source.slice(to);
  source = source.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_, q, ref) => `from '${new URL(ref, new URL('../stage.mjs', import.meta.url)).href}'`);
  const controls = [], fails = async (name, gate, fn) => {
    let message; try { await fn(); } catch(e) { message = e.message.split('\n')[0]; }
    assert.ok(message?.startsWith(gate), name + ' escaped: ' + message); controls.push({ name, message });
  };
  await fails('L13 wipe', 'L14 never red and object at once', async () => checkPop(await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'))));
  await fails('centre sparks', 'L14 spark edge:', () => checkPuffs(e => e.centre));
  return controls;
}
export async function checkL14() { return { pop: checkPop(), puffs: checkPuffs(), controls: await checkL14Controls() }; }
