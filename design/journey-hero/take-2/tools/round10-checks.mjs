// Round 10 (CORRECTIONS-10): R1, after the release a blasted star eases back to its own look on its way home; R2, while a hold
// gathers them, stars ease into the mark's look. Node only.
//   node design/journey-hero/take-2/tools/round10-checks.mjs [--controls]
// The weight is checked on the pure model (stars.mjs); the draw on the real renderer (sq.mjs) through a WebGL call recorder,
// which sees which buffers are uploaded and how many POINTS draws run, not rasterisation. The negative control edits one exact
// site in memory and must fail at its gate.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { markPaths } from './round9-checks.mjs';
import { HOME } from '../../../../public/journey/hero/engine.mjs';

const TAKE = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, TAKE), 'utf8');
async function load(name, source = read(name)) {
  const url = new URL(name, TAKE);
  const fixed = source.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_all, _quote, ref) => `from '${new URL(ref, url).href}'`);
  return import('data:text/javascript;base64,' + Buffer.from(fixed).toString('base64'));
}
const W = 1440, H = 900, DT = 1 / 60;
let paths = null;

// ---- the weight: 1 at the release, never grows, 1 until the offset falls, at most 0.02 at home, at most 0.1 a frame.
export async function checkWeight(source = read('stars.mjs')) {
  const M = await load('stars.mjs', source);
  paths ||= markPaths();
  const mark = M.placeMark(M.sampleMark(paths, 600), W, H), out = { holds: 0, stars: 0, home: 0, worstHome: 0, worstStep: 0, limited: 0, frames: 0 };
  for (const P of [[700, 450], [200, 200], [1300, 800]]) for (const held of [0.3, 1.0, 1.5, 2.5, 3.0]) {
    const F = M.createField(W, H, mark), hold = F.press(...P), n = F.stars.length, at = `(${held} s at ${P})`;
    while (hold.held < held - 1e-9) {
      F.gather(hold, P, DT); F.step(DT);
      for (const i of F.cluster.keys()) assert.equal(F.weights[i], 1, `R1 weight: captured star ${i} is not at full opacity during the hold ${at}`);
    }
    const ids = [...F.cluster.keys()];
    F.blast(hold, P);
    for (const i of ids) assert.equal(F.weights[i], 1, `R1 weight: star ${i} is not 1 at the release ${at}`);
    // R2: a star keeps the mix it had at the release until it is home.
    const kept = Float32Array.from(F.mixes);
    const w = new Float64Array(n).fill(1), len = new Float64Array(n), top = new Float64Array(n), fell = new Uint8Array(n), out1 = new Uint8Array(n).fill(1);
    for (const i of ids) { len[i] = top[i] = Math.hypot(F.offsets[2 * i], F.offsets[2 * i + 1]); }
    for (let k = 0; k < 60 * 25 && ids.some(i => out1[i]); k++) {
      F.step(DT); out.frames++;
      for (const i of ids) {
        if (!out1[i]) continue;
        const now = Math.hypot(F.offsets[2 * i], F.offsets[2 * i + 1]), v = F.weights[i];
        assert.equal(F.mixes[i], kept[i], `R2 release: star ${i}'s mix changed on the way home ${at}`);
        if (!F.flags[i]) {
          // Home: the front copy leaves the front pass here, already (almost) transparent.
          assert.ok(v <= 0.02, `R1 weight: near 0 at home: star ${i} came home at weight ${v.toFixed(3)} ${at}`);
          out.worstHome = Math.max(out.worstHome, v); out.home++; out1[i] = 0;
        }
        assert.ok(v <= w[i] + 1e-7, `R1 weight: star ${i}'s weight grew from ${w[i]} to ${v} ${at}`);
        assert.ok(w[i] - v <= 0.1 + 1e-7, `R1 weight: star ${i}'s weight fell by ${(w[i] - v).toFixed(3)} in one frame ${at}`);
        out.worstStep = Math.max(out.worstStep, w[i] - v);
        if (out1[i]) {
          // Falls: shrinks from one frame to the next after the kick's first frame (as round 9's guard counts it).
          if (k > 0 && now < len[i]) fell[i] = 1;
          top[i] = Math.max(top[i], now);
          if (!fell[i]) assert.equal(v, 1, `R1 weight: star ${i} faded before its offset fell ${at}`);
          // The weight is offset / largest offset since the release, held back only where that would fall over 0.1 in a frame.
          const ratio = now / top[i];
          assert.ok(v >= ratio - 1e-4, `R1 weight: star ${i} is below its offset ratio (${v} < ${ratio}) ${at}`);
          if (v > ratio + 1e-3) out.limited++;
        }
        w[i] = v; len[i] = now;
      }
    }
    assert.ok(ids.every(i => !out1[i]), `R1 weight: a star did not come home in 25 s ${at}`);
    out.holds++; out.stars += ids.length;
  }
  return out;
}

// ---- R2: the fade-in (0 at capture, never falling, 1 by 0.4 s); the mark weight m (0 when given a point, never falling,
// 1 on arrival, at most 0.1 a 60 Hz frame); ring stars keep m at 0.
export async function checkGather(source = read('stars.mjs')) {
  const M = await load('stars.mjs', source);
  paths ||= markPaths();
  const sample = M.sampleMark(paths, 600), out = { holds: 0, captured: 0, given: 0, arrived: 0, late: 0, worstStep: 0, ring: 0 };
  for (const [P, points, upto] of [[[700, 450], 600, 3.5], [[200, 200], 600, 3.5], [[1300, 800], 600, 3.5], [[700, 450], 40, 3.0]]) {
    const mark = M.placeMark(points < 600 ? { ...sample, points: sample.points.slice(0, points) } : sample, W, H);
    const F = M.createField(W, H, mark), hold = F.press(...P), at = `(${points} points at ${P})`;
    const caught = new Map(), given = new Set(), fade = new Map(), mix = new Map(), arrived = new Set();
    while (hold.held < upto - 1e-9) {
      F.gather(hold, P, DT); F.step(DT);
      for (const [i, c] of F.cluster) {
        const a = F.fade[i], m = F.mixes[i];
        if (!caught.has(i)) { caught.set(i, hold.held); assert.equal(a, 0, `R2 capture: star ${i}'s front copy is at ${a}, not 0, at its capture ${at}`); }
        assert.ok(!fade.has(i) || a >= fade.get(i), `R2 capture: star ${i}'s front copy fell from ${fade.get(i)} to ${a} ${at}`);
        if (hold.held - caught.get(i) >= 0.4 - 1e-9) assert.equal(a, 1, `R2 capture: star ${i}'s front copy is at ${a}, not 1, 0.4 s after its capture ${at}`);
        assert.equal(F.alpha[i], Math.fround(a), `R2 capture: star ${i} is not drawn at its fade-in ${at}`);
        fade.set(i, a);
        if (c.ring || c.point === undefined) { assert.equal(m, 0, `R2 mark: ${c.ring ? 'ring' : 'unassigned'} star ${i} has m ${m} ${at}`); continue; }
        if (!given.has(i)) { given.add(i); assert.equal(m, 0, `R2 mark: star ${i} has m ${m}, not 0, when given its point ${at}`); }
        const before = mix.get(i) ?? 0;
        assert.ok(m - before <= 0.1 + 1e-6, `R2 mark: star ${i}'s m rose by ${(m - before).toFixed(3)} in one frame ${at}`);
        assert.ok(m >= before, `R2 mark: star ${i}'s m fell from ${before} to ${m} ${at}`);
        out.worstStep = Math.max(out.worstStep, m - before);
        if (c.arrived && !arrived.has(i)) {
          arrived.add(i);
          // Exactly 1 on arrival; a star given a point within about 2 px rises to 1 at 0.09 a frame instead (counted).
          if (m !== 1) { assert.ok(c.e0 < 2.5, `R2 mark: star ${i} arrived at m ${m}, not 1 ${at}`); out.late++; }
        }
        if (m === 1) assert.ok(c.arrived, `R2 mark: star ${i} reached m 1 before arriving ${at}`);
        mix.set(i, m);
      }
    }
    for (const [i, c] of F.cluster) if (c.ring) out.ring++;
    out.holds++; out.captured += caught.size; out.given += given.size; out.arrived += arrived.size;
  }
  assert.ok(out.ring > 0, 'R2 mark: no ring stars were checked');
  return out;
}

// ---- the draw: the pass behind draws every star in its own look; the pass in front only the stars that are out, at their
// weights; two POINTS draws at most, one when no star is out. The renderer's own code runs under a call recorder.
export async function checkDraw(source = read('stars.mjs'), rendererSource = read('sq.mjs')) {
  assert.ok(rendererSource.includes('bool on = distance(aHome, uRings.xy) <= uRings.z && (!front || (aFlag > 0.5 && aWeight > 0.0));')
    && rendererSource.includes('float flag = front ? aFlag : 0.0;') && rendererSource.includes('vW = front ? aWeight : 1.0;')
    && rendererSource.includes('* min(1.0, 2.0 * vR) * vW;') && rendererSource.includes('layout(location = 4) in float aWeight;')
    && rendererSource.includes('float m = flag > 1.5 ? clamp(aMix, 0.0, 1.0) : 0.0;') && rendererSource.includes('layout(location = 5) in float aMix;'),
    'R1 draw: the shader does not draw every star behind and the out stars in front at their weights');
  const M = await load('stars.mjs', source), R = await load('sq.mjs', rendererSource);
  paths ||= markPaths();
  const F = M.createField(W, H, M.placeMark(M.sampleMark(paths, 600), W, H)), P = [700, 450], hold = F.press(...P);
  // A recorder: buffers by id, what each holds, the attribute each feeds, and every POINTS draw with uPass.
  let next = 0, bound = null, current = null, pass = null, attrs = {};
  const data = new Map(), points = [];
  const gl = new Proxy({}, { get: (_, key) => {
    if (/^[A-Z_0-9]+$/.test(key)) return key;
    if (key === 'createProgram' || key === 'createBuffer') return () => ++next;
    if (key === 'getProgramParameter') return (_, p) => p === 'ACTIVE_UNIFORMS' ? 1 : true;
    if (key === 'getShaderParameter') return () => true;
    if (key === 'getActiveUniform') return () => ({ name: 'uPass' });
    if (key === 'getUniformLocation') return (_, name) => ({ name });
    if (key === 'bindBuffer') return (_, b) => { bound = b; };
    if (key === 'bufferSubData') return (_, o, d) => { data.set(bound, d); };
    if (key === 'vertexAttribPointer') return loc => { attrs[loc] = bound; };
    if (key === 'useProgram') return p => { current = p; };
    if (key === 'uniform1f') return (u, v) => { if (u?.name === 'uPass') pass = v; };
    if (key === 'drawArrays') return (mode, first, count) => { if (mode === 'POINTS') points.push({ pass, count, flags: Float32Array.from(data.get(attrs[3]) || []), weights: Float32Array.from(data.get(attrs[4]) || []), mixes: Float32Array.from(data.get(attrs[5]) || []) }); };
    return () => ({});
  } });
  const renderer = R.createRenderer({ getContext: () => gl, width: W, height: H });
  const look = () => ({ count: F.stars.length, attrs: new Float32Array(F.stars.length * 5), attrsVersion: 1, offsets: F.offsets, flags: F.flags, weights: F.weights, alpha: F.alpha, mixes: F.mixes, front: F.front, markSize: M.STARS.mark.size, version: F.version, par: [0, 0], scroll: 0, reveal: null, centre: [0, 0] });
  const frame = () => { points.length = 0; renderer.draw([], { W, H, S: 100, cx: 720, cy: 450, cam: HOME }, { outline: 0, stars: look() }); return points.slice(); };
  const seen = { settled: 0, held: 0, returning: 0, partial: 0 };
  const settled = frame();
  assert.ok(settled.length === 1 && settled[0].pass === 0 && settled[0].count === F.stars.length, 'R1 draw: a settled field is not one POINTS draw of every star');
  seen.settled = settled.length;
  while (hold.held < 2.5 - 1e-9) { F.gather(hold, P, DT); F.step(DT); }
  const held = frame();
  assert.ok(held.length === 2 && held[0].pass === 0 && held[1].pass === 1 && held.every(d => d.count === F.stars.length), 'R1 draw: a hold is not two POINTS draws (behind, then in front)');
  // R2: during the hold the front copy's opacity is its fade-in (1 once 0.4 s captured), its look mixed by m.
  assert.ok([...F.cluster.keys()].every(i => held[1].flags[i] > 0 && held[1].weights[i] === F.fade[i] && held[1].mixes[i] === F.mixes[i]), 'R1 draw: a captured star is not drawn in front at its fade-in and mark weight');
  seen.held = held.length;
  F.blast(hold, P);
  for (let k = 0; k < 60 * 25 && F.awake; k++) {
    F.step(DT);
    const d = frame();
    assert.ok(d.length === (F.front > 0 ? 2 : 1) && d[0].pass === 0, `R1 draw: ${d.length} POINTS draws with ${F.front} stars out`);
    if (d.length === 2) {
      // Every star is in the pass behind (it draws them all: no flag or weight is read there); in front, each out star's
      // own weight was uploaded, and a star at home is not drawn in front.
      for (let i = 0; i < F.stars.length; i++) {
        assert.equal(d[1].flags[i], F.flags[i], 'R1 draw: the flags uploaded are not the field\'s');
        if (F.flags[i]) assert.equal(d[1].weights[i], Math.fround(F.fade[i] * F.weights[i]), `R1 draw: star ${i}'s weight is not the one drawn`);
        if (F.flags[i] && F.weights[i] > 0.05 && F.weights[i] < 0.95) seen.partial++;
      }
      seen.returning++;
    }
  }
  assert.ok(!F.awake && frame().length === 1, 'R1 draw: the field did not settle to one draw');
  assert.ok(seen.partial > 0, 'R1 draw: no star was ever drawn partway home');
  return seen;
}

export const ROUND10_CONTROLS = [
  { id: "round 9's cut on arrival", file: 'stars.mjs', search: 'if (c.given) c.given = false; else mixes[i] = Math.max(mixes[i], Math.min(want, mixes[i] + STARS.fade * dt));', replacement: 'if (c.given) c.given = false; else mixes[i] = d <= STARS.mark.arrive ? 1 : 0;', gate: 'R2 mark: star', run: s => checkGather(s) },
  { id: 'weight held at 1 until home (the old pop)', file: 'stars.mjs', search: 'weights[i] = Math.min(weights[i], Math.max(far[i] > 0 ? now / far[i] : 0, weights[i] - STARS.fade * dt));', replacement: 'weights[i] = 1;', gate: 'R1 weight: near 0 at home', run: s => checkWeight(s) },
];
export async function checkRound10Controls() {
  const out = [];
  for (const c of ROUND10_CONTROLS) {
    const source = read(c.file);
    assert.equal(source.split(c.search).length - 1, 1, `round 10 control ${c.id} must match one site`);
    let message = '';
    try { await c.run(source.replace(c.search, c.replacement)); } catch (error) { message = error.message; }
    assert.ok(message.startsWith(c.gate), `round 10 control ${c.id} not caught at ${c.gate} (${message || 'passed'})`);
    out.push(`${c.id} caught: ${message.split('\n')[0]}`);
  }
  return out.join('; ');
}

export async function checkRound10() {
  const g = await checkGather(), w = await checkWeight(), d = await checkDraw();
  return `R2 gather: ${g.holds} holds to 3.0-3.5 s (one with 40 points), ${g.captured} captures: each front copy 0 at capture, never falling, 1 by 0.4 s; ${g.given} given points, m 0 then, never falling, largest rise in a 60 Hz frame ${g.worstStep.toFixed(3)} (limit 0.1); ${g.arrived} arrived, m exactly 1 on arrival for all but ${g.late} given a point within 2.5 px (they rise to 1 at 0.09 a frame); ${g.ring} ring stars keep m 0.
R1 weight: ${w.holds} holds (0.3-3.0 s at 3 places), ${w.stars} stars released; each 1 during the hold and at the release, 1 until its offset falls, never grows; all ${w.home} home at weight <= ${w.worstHome.toFixed(4)} (limit 0.02); largest fall in a 60 Hz frame ${w.worstStep.toFixed(3)} (limit 0.1; ${w.limited} star-frames held back by that rate, the rest offset / largest offset).
R1 draw: settled ${d.settled} POINTS draw; holding ${d.held} (every star behind, captured stars in front at their fade-in and mark weight); ${d.returning} returning frames with 2 draws, each out star's weight uploaded (${d.partial} star-frames partway, 0.05-0.95); 1 draw again once home.`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(await checkRound10());
  if (process.argv.includes('--controls')) console.log('Round 10 negative controls: ' + await checkRound10Controls());
}
