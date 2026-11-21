// Round 9 (CORRECTIONS-9): L1, a long hold draws the DG mark in stars. Node only, as a pure model.
//   node design/journey-hero/take-2/tools/round9-checks.mjs [--controls]
// The mark's paths are read from public/journey/index.html (read only). The geometry below (path flattening, the fill test,
// areas) is the check's own, finer than the sampler's, so the sampler is not checked against itself. The negative controls edit
// one exact site in memory and must fail at their gate.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TAKE = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, TAKE), 'utf8');
async function load(name, source = read(name)) {
  const url = new URL(name, TAKE);
  const fixed = source.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_all, _quote, ref) => `from '${new URL(ref, url).href}'`);
  return import('data:text/javascript;base64,' + Buffer.from(fixed).toString('base64'));
}
const PAPER = '#F7F6F3', RED = '#F0484F', W = 1440, H = 900, DT = 1 / 60;

// ---- the mark, from the page (the hero's [data-mark] link), and the check's own geometry.
export function markPaths() {
  const html = fs.readFileSync(new URL('../../../public/journey/index.html', TAKE), 'utf8');
  const at = html.indexOf('data-mark'), svg = html.slice(at, html.indexOf('</svg>', at));
  assert.ok(at > 0 && svg.includes('viewBox="0 0 1080 797.3"'), 'L1 sampler: no [data-mark] SVG in public/journey/index.html');
  return [...svg.matchAll(/<path[\s\S]*?\/>/g)].map(m => ({ fill: m[0].match(/fill="([^"]*)"/)[1], d: m[0].match(/\sd="([^"]*)"/)[1] }));
}
function rings(d, segments = 64) {
  const t = d.match(/[A-Za-z]|-?\d*\.?\d+/g), out = [];
  let k = 0, ring, x, y;
  while (k < t.length) {
    const c = t[k++];
    assert.ok('MLCZ'.includes(c), `L1 sampler: the mark uses ${c} (only M, L, C and Z expected)`);
    if (c === 'M') { x = +t[k++]; y = +t[k++]; ring = [[x, y]]; }
    else if (c === 'L') { while (k < t.length && !/[A-Za-z]/.test(t[k])) { x = +t[k++]; y = +t[k++]; ring.push([x, y]); } }
    else if (c === 'C') while (k < t.length && !/[A-Za-z]/.test(t[k])) {
      const p = t.slice(k, k + 6).map(Number); k += 6;
      for (let j = 1; j <= segments; j++) {
        const s = j / segments, u = 1 - s, b = [u * u * u, 3 * u * u * s, 3 * u * s * s, s * s * s];
        ring.push([b[0] * x + b[1] * p[0] + b[2] * p[2] + b[3] * p[4], b[0] * y + b[1] * p[1] + b[2] * p[3] + b[3] * p[5]]);
      }
      x = p[4]; y = p[5];
    } else { out.push(ring); ring = null; }
  }
  return out;
}
function inside(rs, px, py) {
  let w = 0;
  for (const r of rs) for (let j = 0; j < r.length; j++) {
    const a = r[j], b = r[(j + 1) % r.length];
    if ((a[1] <= py) !== (b[1] <= py)) { const x = a[0] + (py - a[1]) / (b[1] - a[1]) * (b[0] - a[0]); if (x > px) w += b[1] > a[1] ? 1 : -1; }
  }
  return w !== 0;
}
const area = rs => Math.abs(rs.reduce((sum, r) => sum + r.reduce((s, a, j) => { const b = r[(j + 1) % r.length]; return s + a[0] * b[1] - b[0] * a[1]; }, 0) / 2, 0));
const kindOf = fill => fill.toUpperCase() === PAPER ? 'G' : 'D';

// ---- the sampler: inside its own path, even cover for any first N, the D share by area.
export async function checkSampler(source = read('stars.mjs')) {
  const M = await load('stars.mjs', source), paths = markPaths(), shapes = paths.map(p => rings(p.d));
  assert.deepEqual(paths.map(p => p.fill.toUpperCase()), [PAPER, PAPER, '#C0262E'], 'L1 sampler: the mark is not two paper paths and one red path');
  const t0 = performance.now(), sample = M.sampleMark(paths, 600), ms = performance.now() - t0;
  assert.equal(sample.points.length, 600, 'L1 sampler: not 600 points');
  sample.points.forEach((p, k) => {
    assert.ok(inside(shapes[p.path], p.x, p.y), `L1 sampler: point ${k} (${p.x.toFixed(1)}, ${p.y.toFixed(1)}) is outside its path ${p.path}`);
    assert.equal(p.kind, kindOf(paths[p.path].fill), `L1 sampler: point ${k} has the wrong shape`);
  });
  const A = { G: 0, D: 0 };
  shapes.forEach((s, i) => { A[kindOf(paths[i].fill)] += area(s); });
  const total = A.G + A.D, dArea = A.D / total;
  // The test points: a 3-unit grid over the whole mark.
  const test = [];
  for (let y = 1.5; y < 797.3; y += 3) for (let x = 1.5; x < 1080; x += 3) if (shapes.some(s => inside(s, x, y))) test.push(x, y);
  assert.ok(Math.abs(test.length / 2 * 9 - total) < 0.01 * total, 'L1 sampler: the test grid and the areas disagree (the paths overlap?)');
  const gaps = [];
  for (const N of [100, 200, 300, 600]) {
    const pts = sample.points.slice(0, N);
    let worst = 0;
    for (let j = 0; j < test.length; j += 2) {
      let best = Infinity;
      for (const p of pts) { const dx = p.x - test[j], dy = p.y - test[j + 1], d2 = dx * dx + dy * dy; if (d2 < best) best = d2; }
      if (best > worst) worst = best;
    }
    // The largest empty gap: the diameter of the largest empty circle centred inside the mark.
    const gap = 2 * Math.sqrt(worst), limit = 2.2 * Math.sqrt(total / N);
    assert.ok(gap <= limit, `L1 sampler: first ${N} points leave a gap of ${gap.toFixed(1)} > ${limit.toFixed(1)}`);
    const share = pts.filter(p => p.kind === 'D').length / N;
    assert.ok(Math.abs(share - dArea) <= 0.1 * dArea, `L1 sampler: first ${N} points are ${(100 * share).toFixed(1)} % D, the D is ${(100 * dArea).toFixed(1)} % of the area`);
    gaps.push({ N, ratio: +(gap / Math.sqrt(total / N)).toFixed(3), share: +(100 * share).toFixed(1) });
  }
  // The placement: 180 px tall at 1440 x 900, the mark's own proportions, centred on its box, y down (upright, not mirrored).
  const m = M.placeMark(sample, W, H), s = 180 / 797.3;
  assert.ok(Math.abs(m.height - 180) < 1e-9 && Math.abs(m.half[0] * 2 - 1080 * s) < 1e-6 && Math.abs(m.half[1] * 2 - 180) < 1e-6, 'L1 sampler: the mark is not 180 px tall at its own proportions');
  m.points.forEach((p, k) => assert.ok(Math.hypot(p.x - (sample.points[k].x - 540) * s, p.y - (sample.points[k].y - 398.65) * s) < 1e-6, `L1 sampler: point ${k} is not placed upright`));
  // Read once per hero size at measure time: the controller samples only in measure().
  const measure = source.slice(source.indexOf('function measure('), source.indexOf('const local ='));
  assert.ok(source.split('sampleMark(').length === 3 && measure.includes('sampleMark(paths, STARS.mark.count)') && measure.includes('placeMark(sample'), 'L1 sampler: the mark is not prepared at measure time');
  return { ms: +ms.toFixed(1), area: { G: Math.round(A.G), D: Math.round(A.D), dShare: +(100 * dArea).toFixed(1) }, gaps, test: test.length / 2, ring: +m.reach.toFixed(1) };
}

// ---- the field, held: shared helpers.
async function fieldWith(source, { points } = {}) {
  const M = await load('stars.mjs', source), sample = M.sampleMark(markPaths(), 600);
  const mark = M.placeMark(points ? { ...sample, points: sample.points.slice(0, points) } : sample, W, H);
  return { M, sample, mark, F: M.createField(W, H, mark) };
}
const pointOf = (F, i) => { const c = F.cluster.get(i), C = F.markState().centre, p = F.mark.points[c.point]; return [C[0] + p.x, C[1] + p.y]; };

// ---- timing: no point before the formation starts; until then the cluster turns exactly as round 8's. Round 12 (S1): the
// formation starts once STARS.mark.threshold (300) stars are captured, not at 1.4 s held (round12-checks.mjs checks the rule).
export async function checkTiming(source = read('stars.mjs')) {
  const { M, F } = await fieldWith(source), plain = M.createField(W, H), P = [700, 450];
  const a = F.press(...P), b = plain.press(...P);
  let frames = 0, firstAt = null;
  for (let k = 0; k < 200; k++) {
    F.gather(a, P, DT); F.step(DT); plain.gather(b, P, DT); plain.step(DT);
    const any = [...F.cluster.values()].some(c => c.point !== undefined || c.ring);
    if (a.formedAt === null) {
      assert.ok(!any, `L1 timing: a star has a point at ${a.held.toFixed(3)} s held`);
      assert.ok(F.offsets.every((v, i) => v === plain.offsets[i]), `L1 timing: the cluster differs from round 8's at ${a.held.toFixed(3)} s`);
      frames++;
    } else if (firstAt === null && any) firstAt = a.held;
  }
  assert.ok(firstAt !== null && firstAt === a.formedAt, `L1 formation: no star given a point when the formation starts (first at ${firstAt}, start ${a.formedAt})`);
  return { frames, firstAt: +firstAt.toFixed(4) };
}

// ---- formation: distances never grow; formed 1 s after it starts (round 9: 1.4 to 2.4 s; round 12: from the threshold);
// upright, centred on the anchor, inside the hero at the corners (where, since round 12, the radius grows on to catch 300).
export async function checkFormation(source = read('stars.mjs')) {
  const out = {};
  for (const [name, start, moveTo] of [['centre', [700, 450]], ['moving', [600, 400], [820, 520]], ['top left', [3, 3]], ['top right', [W - 3, 3]], ['bottom left', [3, H - 3]], ['bottom right', [W - 3, H - 3]]]) {
    const { F, mark } = await fieldWith(source), P = start.slice(), hold = F.press(...P);
    const dist = new Map();
    let first = null, at24 = null;
    // Round 12: a corner hold catches its 300 with a radius near 640 px, so its stars start up to twice as far from their
    // points as round 9's (at 340 px) and the same formation (tau 0.12 s) takes 1.25 s to bring every one within 1 px.
    const settle = /(top|bottom) (left|right)/.test(name) ? 1.25 : 1.0;
    for (let k = 0; hold.formedAt === null ? hold.held < 12 : hold.held < hold.formedAt + settle + 3 * DT; k++) {
      if (moveTo && hold.held >= 1.6 && hold.held < 2.0) for (const j of [0, 1]) P[j] += (moveTo[j] - start[j]) * DT / 0.4;
      F.gather(hold, P, DT); F.step(DT);
      const state = F.markState();
      for (const [i, c] of F.cluster) {
        if (c.point === undefined) continue;
        if (first === null) first = new Set([...F.cluster].filter(([, q]) => q.point !== undefined).map(([j]) => j));
        // d is the star's distance to its point in the model; the drawn position (float32 offsets) agrees within 0.001 px.
        const target = pointOf(F, i), [x, y] = F.position(i), d = Math.hypot(c.e[0], c.e[1]);
        assert.ok(Math.abs(Math.hypot(x - target[0], y - target[1]) - d) < 1e-3, `L1 formation: star ${i} is not where its offset says (${name})`);
        assert.ok(!dist.has(i) || d <= dist.get(i) + 1e-6, `L1 formation: star ${i}'s distance to its point grew from ${dist.get(i)} to ${d} (${name})`);
        dist.set(i, d);
      }
      if (at24 === null && hold.formedAt !== null && hold.held >= hold.formedAt + settle - 1e-9) {
        assert.ok(first && first.size > 0, `L1 formation: no star given a point when the formation starts (${name})`);
        const late = [...first].filter(i => !(dist.get(i) <= 1));
        assert.equal(late.length, 0, `L1 formation: ${late.length} of ${first.size} stars assigned at the start are not within 1 px ${settle} s later (${name})`);
        at24 = { assigned: first.size, arrived: state.arrived, captured: F.cluster.size, start: +hold.formedAt.toFixed(3), settle };
      }
      // The mark's centre is the anchor, clamped so every point stays 16 px inside the hero. Round 16 (R3): and the whole ring
      // round the weight centre too, out to its band's outer edge (it fits on both axes at 1440 x 900; round16-checks.mjs
      // checks the fallbacks).
      const C = state.centre, r = mark.ring.radius + mark.ring.band, w = mark.weight, lo = [0, 1].map(j => Math.max(16 + mark.half[j], 16 + r - w[j])), hi = [0, 1].map(j => Math.min([W, H][j] - 16 - mark.half[j], [W, H][j] - 16 - r - w[j]));
      const want = [0, 1].map(j => Math.min(hi[j], Math.max(lo[j], hold.anchor[j])));
      assert.ok(Math.hypot(C[0] - want[0], C[1] - want[1]) < 1e-9, `L1 formation: the mark is not centred on the (clamped) anchor (${name})`);
      for (const p of mark.points) assert.ok(C[0] + p.x >= 16 - 1e-9 && C[0] + p.x <= W - 16 + 1e-9 && C[1] + p.y >= 16 - 1e-9 && C[1] + p.y <= H - 16 + 1e-9, `L1 formation: the mark leaves the hero (${name})`);
    }
    assert.ok(at24, `L1 formation: the hold never formed, or never reached 1 s after (${name})`);
    // Upright and not mirrored: an arrived star sits at its SVG point, scaled about the mark's box centre, y down.
    const s = mark.scale, C = F.markState().centre, raw = (await load('stars.mjs', source)).sampleMark(markPaths(), 600).points;
    for (const [i, c] of F.cluster) if (c.arrived) {
      const [x, y] = F.position(i), q = raw[c.point];
      assert.ok(Math.hypot(x - C[0] - (q.x - 540) * s, y - C[1] - (q.y - 398.65) * s) <= 1 + 1e-9, `L1 formation: star ${i} is not on the upright mark (${name})`);
    }
    out[name] = { ...at24, centre: C.map(v => +v.toFixed(1)) };
  }
  return out;
}

// ---- colour: its own colour or its own mark colour; full mark colour only on arriving within 1 px. Round 10 rewrites this rule:
// R2 eases the front look toward the mark colour by the mark weight m (round 9 cut it on arrival), and R1 fades the front copy
// out on the way home instead of cutting it back at home (both checked in round10-checks.mjs). Here: the colour code names the
// point's own colour from when it is given a point, m is 1 only once arrived within 1 px, and the front copy leaves only at home.
export async function checkColour(source = read('stars.mjs'), rendererSource = read('sq.mjs')) {
  const { M, F } = await fieldWith(source), P = [700, 450], hold = F.press(...P), n = F.stars.length;
  assert.ok(M.STARS.mark.size >= 2 && M.STARS.mark.size <= 3, 'L1 colour: a mark star is not 2 to 3 px across');
  // The renderer: flag 2 is paper and flag 3 red, both at full strength, at least the mark size; the uniforms are the brand's.
  // Round 10: the flag's look is the front copy's (the copy behind is always the star's own look), mixed from its own by m.
  assert.ok(rendererSource.includes('float flag = front ? aFlag : 0.0;') && rendererSource.includes('vCol = mix(own, flag > 2.5 ? uRedInk : uPaper, m);') && rendererSource.includes('mix(aLook.y, max(aLook.y, uMarkSize), m)')
    && rendererSource.includes("uPaper, hex('#F7F6F3')") && rendererSource.includes("uRedInk, hex('#F0484F')"), 'L1 colour: the shader does not cut flags 2 and 3 to paper and red');
  const ink = (i, flag) => flag >= 2 ? M.FLAG_INK[flag] : 'own';
  const kind = new Map(), prev = new Float32Array(n), cuts = { G: 0, D: 0 }, backs = [0], full = new Set();
  const look = released => {
    for (let i = 0; i < n; i++) {
      const f = F.flags[i], p = prev[i], c = F.cluster?.get(i);
      if (c?.kind) kind.set(i, c.kind);
      const k = kind.get(i);
      if (f >= 2) assert.equal(ink(i, f), k === 'D' ? RED : PAPER, `L1 colour: a ${k} star shows ${ink(i, f)}`);
      if (f >= 2 && p < 2) assert.ok(c && c.point !== undefined, `L1 colour: star ${i} has a mark colour code but no point`);
      if (!released && f >= 2 && F.mixes[i] === 1 && !full.has(i)) {
        assert.ok(c && c.arrived && Math.hypot(c.e[0], c.e[1]) <= 1, `L1 colour: star ${i} reached the full mark colour before arriving`);
        full.add(i); cuts[k]++;
      }
      if (p >= 2) assert.ok(f === p || f === 0, `L1 colour: star ${i} changed from ${p} to ${f}`);
      if (p >= 2 && f === 0) { assert.ok(released && F.offsets[2 * i] === 0 && F.offsets[2 * i + 1] === 0, `L1 colour: star ${i}'s front copy left before home`); backs[0]++; }
      if (p === 1 && f === 0) assert.ok(released && F.offsets[2 * i] === 0 && F.offsets[2 * i + 1] === 0, `L1 colour: star ${i} went behind before home`);
      prev[i] = f;
    }
  };
  while (hold.held < 3.5 - 1e-9) { F.gather(hold, P, DT); F.step(DT); look(false); }
  const formed = F.markState();
  F.blast(hold, P);
  for (let k = 0; k < 60 * 25; k++) { F.step(DT); look(true); }
  assert.ok(cuts.G > 0 && cuts.D > 0, 'L1 colour: no G or no D star reached the mark colour');
  assert.ok(F.flags.every(f => f === 0) && F.front === 0, 'L1 colour: a star is still in the mark colour at home');
  return { cuts, backs: backs[0], formed: { assigned: formed.assigned, arrived: formed.arrived } };
}

// ---- overflow: once every point is taken, further stars keep turning as a ring outside the mark. Round 16: measured from the
// ring's centre (the mark's weight centre), against the farthest point from it; the ring's count is markState().ring.count.
export async function checkOverflow(source = read('stars.mjs')) {
  const { F, mark } = await fieldWith(source, { points: 40 }), P = [700, 450], hold = F.press(...P);
  // Round 16 (R5): the hold keeps gathering past the formation, so the last capture comes when the radius has reached every
  // star (about 7 s held here, not at 2.5 s); the hold runs to 1.5 s after it, as round 9's 4 s was 1.5 s after 2.5 s.
  let last = new Map(), lastCapture = 0, size = 0;
  while (hold.held < lastCapture + 1.5 - 1e-9 || size < F.stars.length) {
    F.gather(hold, P, DT); F.step(DT);
    if (F.cluster.size !== size) { size = F.cluster.size; lastCapture = hold.held; }
    assert.ok(hold.held < 20, 'L1 overflow: the hold never captured every star');
    const now = new Map();
    for (const [i, c] of F.cluster) if (c.ring) now.set(i, c.theta);
    if (hold.held > lastCapture + 1.3) for (const [i, th] of now) if (last.has(i)) assert.ok(th - last.get(i) > 0.9 * Math.PI / 2 * DT, `L1 overflow: ring star ${i} does not turn`);
    last = now;
  }
  const s = F.markState(), C = s.ring.centre, far = Math.max(...mark.points.map(p => Math.hypot(p.x - mark.weight[0], p.y - mark.weight[1])));
  assert.ok(s.assigned === 40 && s.ring.count > 0 && s.ring.count === F.cluster.size - 40, `L1 overflow: ${s.assigned} in the mark, ${s.ring.count} in the ring of ${F.cluster.size}`);
  // 1.5 s after the last capture every ring star turns outside the mark's farthest point (from the ring centre, round 16).
  let settled = 0;
  for (const [i, c] of F.cluster) if (c.ring) {
    const [x, y] = F.position(i);
    assert.ok(Math.hypot(x - C[0], y - C[1]) > far, `L1 overflow: ring star ${i} is inside the mark`);
    settled++;
  }
  return { captured: F.cluster.size, ring: s.ring.count, settled, reach: +far.toFixed(1) };
}

// ---- release: a formed mark blasts with B2's impulses; every star goes home monotonically, no overshoot.
export async function checkRelease(source = read('stars.mjs')) {
  const { M, F } = await fieldWith(source), P = [700, 450], hold = F.press(...P);
  let first = 0;
  while (hold.held < 3.5 - 1e-9) { F.gather(hold, P, DT); F.step(DT); if (!first) first = F.markState().assigned; }
  const ids = [...F.cluster.keys()], before = F.markState();
  // Formed: every star given a point when the formation started is on it (later captures may still be on their way). Round
  // 12: released at 3.5 s held (round 9 released at 2.5 s, 1.1 s after its 1.4 s start); the impulse is capped at 2.5 s.
  assert.ok(first > 0 && before.arrived >= first, `L1 release: the mark is not formed at 2.5 s (${before.arrived} of ${first})`);
  F.blast(hold, P);
  for (const i of ids) {
    const v = F.velocity(i), [x, y] = F.position(i), r = Math.hypot(x - P[0], y - P[1]), want = M.blastImpulse(hold.held, F.stars[i].m);
    assert.ok(Math.abs(Math.hypot(...v) - want) < 1e-3 * want && (v[0] * (x - P[0]) + v[1] * (y - P[1])) / (r * Math.hypot(...v)) > 0.999999, `L1 release: star ${i} is not blasted with B2's impulse`);
  }
  const traces = new Map(ids.map(i => [i, []]));
  let largest = 0;
  for (let k = 0; k < 60 * 25; k++) { F.step(DT); for (const i of ids) { const v = [F.offsets[2 * i], F.offsets[2 * i + 1]]; traces.get(i).push(v); largest = Math.max(largest, Math.hypot(...v)); } }
  assert.ok(largest < 0.45 * W, `L1 release: an offset reached ${largest}`);
  for (const [i, h] of traces) {
    const lengths = h.map(v => Math.hypot(...v)), peak = lengths.indexOf(Math.max(...lengths)), dir = h[peak];
    for (let k = peak + 1; k < h.length; k++) assert.ok(lengths[k] <= lengths[k - 1] + 1e-3 && h[k][0] * dir[0] + h[k][1] * dir[1] >= -1e-9, `L1 release: star ${i} does not return home monotonically`);
    assert.equal(lengths.at(-1), 0, `L1 release: star ${i} did not settle`);
  }
  return { blasted: ids.length, inMark: before.assigned, arrived: before.arrived, largest: +largest.toFixed(1), impulse: +M.blastImpulse(hold.held, 1).toFixed(1) };
}

// ---- clicks: a short stage click changes the craft and forms no mark; a hold changes no craft and forms the mark.
export async function checkClicks(source = read('stars.mjs')) {
  const M = await load('stars.mjs', source), paths = markPaths(), outcomes = [];
  for (const [held, click] of [[0.1, true], [0.24, true], [0.3, false], [1.3, false], [2.0, false], [3.0, false]]) {
    const handlers = {}, add = target => (name, f) => { (handlers[target + name] ||= []).push(f); };
    const win = { scrollY: 0, addEventListener: add('win:'), performance: { now: () => 0 } };
    const link = { querySelectorAll: () => paths.map(p => ({ getAttribute: k => p[k] })) };
    const hero = { addEventListener: add('hero:'), querySelector: s => s === '[data-mark]' ? link : null, ownerDocument: { addEventListener: add('doc:') } };
    const fire = (name, e) => (handlers[name] || []).forEach(f => f(e));
    let now = 0;
    const c = M.createStars(hero, { reduced: { matches: false, addEventListener() {} }, win, raf: () => 0, draw() {}, running: () => true, available: () => true, clock: () => now });
    c.measure({ left: 0, top: 0, width: W, height: H }, 0); c.frame(null, [0, 0]);
    assert.ok(c.field.mark && c.field.mark.points.length === 600 && Math.abs(c.field.mark.height - 180) < 1e-9, 'L1 clicks: the controller did not read the mark from the page');
    fire('hero:pointerdown', { pointerType: 'mouse', button: 0, clientX: 900, clientY: 400, target: { closest: s => s === '[data-stage-box]' ? {} : null } });
    for (let k = 0; k < Math.round(held / DT); k++) { now += DT; c.frame(null, [0, 0]); }
    const state = c.mark;
    fire('win:pointerup', { pointerType: 'mouse', clientX: 900, clientY: 400 });
    const swallowed = c.swallowClick();
    assert.equal(swallowed, !click, `L1 clicks: a ${held} s press ${click ? 'did not change the craft' : 'changed the craft'}`);
    // Round 12: formed exactly when the press has captured the threshold (by 3.0 s near the middle, not by 2.0 s).
    assert.equal(state.formed, state.captured >= M.STARS.mark.threshold, `L1 clicks: a ${held} s press with ${state.captured} captured ${state.formed ? 'formed a mark' : 'formed no mark'}`);
    assert.equal(state.formed, held >= 3.0, `L1 clicks: a ${held} s press ${held >= 3.0 ? 'formed no mark' : 'formed a mark'}`);
    if (!state.formed) assert.equal(state.assigned, 0, `L1 clicks: a ${held} s press gave stars points`);
    outcomes.push(`${held} s ${click ? 'next craft' : 'no craft change'}, ${state.formed ? `mark ${state.assigned} stars` : 'no mark'}`);
  }
  return outcomes;
}

export const ROUND9_CONTROLS = [
  { id: 'formation off', file: 'stars.mjs', search: 'if (mark && hold.formedAt !== null) {', replacement: 'if (false) {', gate: 'L1 formation:', run: s => checkTiming(s).then(() => checkFormation(s)) },
  { id: 'D and G colours swapped', file: 'stars.mjs', search: "export const markFlag = kind => kind === 'D' ? 3 : 2;", replacement: "export const markFlag = kind => kind === 'D' ? 2 : 3;", gate: 'L1 colour:', run: s => checkColour(s) },
  { id: 'a point outside the mark', file: 'stars.mjs', search: '  return { points, box, area };\n}\n// The mark for a hero', replacement: '  points[7] = { ...points[7], x: box[0] - 40 };\n  return { points, box, area };\n}\n// The mark for a hero', gate: 'L1 sampler:', run: s => checkSampler(s) },
];
export async function checkRound9Controls() {
  const out = [];
  for (const c of ROUND9_CONTROLS) {
    const source = read(c.file);
    assert.equal(source.split(c.search).length - 1, 1, `round 9 control ${c.id} must match one site`);
    let message = '';
    try { await c.run(source.replace(c.search, c.replacement)); } catch (error) { message = error.message; }
    assert.ok(message.startsWith(c.gate), `round 9 control ${c.id} not caught at ${c.gate} (${message || 'passed'})`);
    out.push(`${c.id} caught: ${message.split('\n')[0]}`);
  }
  return out.join('; ');
}

export async function checkRound9() {
  const s = await checkSampler(), t = await checkTiming(), f = await checkFormation(), c = await checkColour(), o = await checkOverflow(), r = await checkRelease(), k = await checkClicks();
  return `L1 sampler: 600 points in ${s.ms} ms, each inside its own path; areas G ${s.area.G}, D ${s.area.D} (D ${s.area.dShare} %); largest gap / sqrt(area/N) ${s.gaps.map(g => `N ${g.N} ${g.ratio}`).join(', ')} (limit 2.2); D share ${s.gaps.map(g => g.share + ' %').join('/')}; 180 px tall at 1440 x 900, upright.
L1 timing: ${t.frames} frames before the formation starts identical to round 8's turning cluster; first points at ${t.firstAt} s held (the 300th capture, round 12).
L1 formation: ${Object.entries(f).map(([k, v]) => `${k} ${v.assigned} assigned at ${v.start} s, all within 1 px ${v.settle} s later, centre ${v.centre.join(',')}`).join('; ')}; distances never grow; upright; inside the hero at every corner.
L1 colour: full mark colour G ${c.cuts.G}, D ${c.cuts.D}, each only once arrived within 1 px (eased in on the way, round 10); ${c.backs} front copies leave only at home (faded on the way, round 10); each code its own point's colour.
L1 overflow: 40 points, ${o.captured} captured, ${o.ring} turning in the ring (${o.settled} settled outside ${o.reach} px).
L1 release at 3.5 s: ${r.blasted} blasted (${r.inMark} given points, ${r.arrived} arrived) at ${r.impulse}/mass px/s, largest ${r.largest} px, all home monotonically.
L1 clicks: ${k.join('; ')}.`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(await checkRound9());
  if (process.argv.includes('--controls')) console.log('Round 9 negative controls: ' + await checkRound9Controls());
}
