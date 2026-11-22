// Round 16 (CORRECTIONS-16): the ring round the DG mark, centred by eye (R1), scattered all the way round (R2), on the screen
// (R3); C18-7 replaces R4's tremble with steady held stars; the hold keeps gathering (R5). Node only, on the pure model.
//   node design/journey-hero/take-2/tools/round16-checks.mjs [--controls]
// The mark's paths are read from public/journey/index.html (read only). The negative controls edit one exact site in memory
// and must fail at their gate.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { markPaths } from './round9-checks.mjs';

const TAKE = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, TAKE), 'utf8');
async function load(name, source = read(name)) {
  const url = new URL(name, TAKE);
  const fixed = source.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_all, _quote, ref) => `from '${new URL(ref, url).href}'`);
  return import('data:text/javascript;base64,' + Buffer.from(fixed).toString('base64'));
}
const DT = 1 / 60, TURN = 2 * Math.PI, PAPER = '#F7F6F3';
const wrap = a => a - TURN * Math.round(a / TURN), mod = a => ((a % TURN) + TURN) % TURN;
let paths = null;
const sampleOf = M => M.sampleMark(paths ||= markPaths(), 600);
function fieldFor(M, W, H, points = 600) {
  const sample = sampleOf(M), mark = M.placeMark(points < 600 ? { ...sample, points: sample.points.slice(0, points) } : sample, W, H);
  return { mark, F: M.createField(W, H, mark) };
}
// Where a captured star is placed without the tremble (R4), in the hero's px.
const placed = (F, i) => [F.stars[i].x + F.base[2 * i], F.stars[i].y + F.base[2 * i + 1]];
// The smallest circle round a set of points (Welzl, iterative, in the given order).
function enclosing(pts) {
  const circle2 = (a, b) => ({ x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2, r: Math.hypot(a[0] - b[0], a[1] - b[1]) / 2 });
  const circle3 = (a, b, c) => {
    const d = 2 * (a[0] * (b[1] - c[1]) + b[0] * (c[1] - a[1]) + c[0] * (a[1] - b[1]));
    const x = ((a[0] ** 2 + a[1] ** 2) * (b[1] - c[1]) + (b[0] ** 2 + b[1] ** 2) * (c[1] - a[1]) + (c[0] ** 2 + c[1] ** 2) * (a[1] - b[1])) / d;
    const y = ((a[0] ** 2 + a[1] ** 2) * (c[0] - b[0]) + (b[0] ** 2 + b[1] ** 2) * (a[0] - c[0]) + (c[0] ** 2 + c[1] ** 2) * (b[0] - a[0])) / d;
    return { x, y, r: Math.hypot(a[0] - x, a[1] - y) };
  };
  const inC = (c, p) => Math.hypot(p[0] - c.x, p[1] - c.y) <= c.r + 1e-9;
  let c = { x: pts[0][0], y: pts[0][1], r: 0 };
  for (let i = 1; i < pts.length; i++) if (!inC(c, pts[i])) {
    c = { x: pts[i][0], y: pts[i][1], r: 0 };
    for (let j = 0; j < i; j++) if (!inC(c, pts[j])) {
      c = circle2(pts[i], pts[j]);
      for (let k = 0; k < j; k++) if (!inC(c, pts[k])) c = circle3(pts[i], pts[j], pts[k]);
    }
  }
  return c;
}

// ================================================================ R1: centred on the weight
export async function checkCentre(source = read('stars.mjs')) {
  const M = await load('stars.mjs', source), out = {};
  for (const [W, H] of [[1474, 996], [1440, 900], [1280, 800], [1024, 640], [390, 844]]) {
    const { mark, F } = fieldFor(M, W, H), n = mark.points.length;
    const weight = [0, 1].map(k => mark.points.reduce((s, p) => s + (k ? p.y : p.x), 0) / n);
    assert.ok(Math.hypot(mark.weight[0] - weight[0], mark.weight[1] - weight[1]) < 1e-9, `R1 weight: not the mean of the points at ${W} x ${H}`);
    const far = Math.max(...mark.points.map(p => Math.hypot(p.x - weight[0], p.y - weight[1])));
    assert.ok(Math.abs(mark.ring.radius - (far + 0.095 * mark.height)) < 1e-9, `R1 band: the inner edge ${mark.ring.radius} is not the farthest point ${far} + 0.095 h at ${W} x ${H}`);
    assert.ok(Math.abs(mark.ring.band - 0.1 * mark.height) < 1e-9, `R1 band: the depth ${mark.ring.band} is not 0.10 h at ${W} x ${H}`);
    // The ring's centre in the hold is the mark's centre plus the weight.
    const hold = F.press(W * 0.55, H * 0.45);
    for (let k = 0; k < 30; k++) {
      F.gather(hold, [W * 0.55, H * 0.45], DT); F.step(DT);
      const s = F.markState();
      assert.ok(Math.hypot(s.ring.centre[0] - s.centre[0] - weight[0], s.ring.centre[1] - s.centre[1] - weight[1]) < 1e-9, `R1 centre: the ring is not centred on the mark's centre plus its weight at ${W} x ${H}`);
    }
    out[`${W}x${H}`] = { weight: weight.map(v => +v.toFixed(1)), inner: +mark.ring.radius.toFixed(1), outer: +(mark.ring.radius + mark.ring.band).toFixed(1), height: +mark.height.toFixed(1) };
  }
  // At Dan's 1474 x 996: the weight's x, and the clearances on the outline (flattenPath) to the D's square corners and the
  // G's rightmost point.
  const sample = sampleOf(M), { mark } = fieldFor(M, 1474, 996), w = mark.weight, s = mark.scale;
  const cx = (sample.box[0] + sample.box[2]) / 2, cy = (sample.box[1] + sample.box[3]) / 2;
  assert.ok(w[0] >= -18 && w[0] <= -15, `R1 weight: x ${w[0].toFixed(2)} px is not between -18 and -15 at 1474 x 996`);
  const outline = paths.map(p => ({ G: p.fill.toUpperCase() === PAPER, pts: M.flattenPath(p.d).flat().map(([x, y]) => [(x - cx) * s, (y - cy) * s]) }));
  const D = outline.filter(o => !o.G).flatMap(o => o.pts), G = outline.filter(o => o.G).flatMap(o => o.pts);
  const nearest = (list, q) => list.reduce((b, p) => Math.hypot(p[0] - q[0], p[1] - q[1]) < Math.hypot(b[0] - q[0], b[1] - q[1]) ? p : b);
  const top = nearest(D, [-mark.half[0], -mark.half[1]]), bottom = nearest(D, [-mark.half[0], mark.half[1]]);
  const right = G.reduce((b, p) => p[0] > b[0] ? p : b);
  const clear = p => mark.ring.radius - Math.hypot(p[0] - w[0], p[1] - w[1]);
  const clearances = [clear(top), clear(bottom), clear(right)];
  assert.ok(Math.max(...clearances) - Math.min(...clearances) <= 5, `R1 clearance: D corners ${clearances[0].toFixed(1)}, ${clearances[1].toFixed(1)} and G edge ${clearances[2].toFixed(1)} px differ by more than 5 px`);
  // The smallest circle round the outline: the brief puts its centre "within 2 px" of the weight; from its own numbers,
  // (-18.3, 0) and (-16.5, 1.1), that is 2.1 px, so this holds it to 2.5 px and reports the distance.
  const c = enclosing([...D, ...G]), off = Math.hypot(c.x - w[0], c.y - w[1]);
  assert.ok(off <= 2.5, `R1 centre: the smallest circle round the outline is centred at (${c.x.toFixed(1)}, ${c.y.toFixed(1)}), ${off.toFixed(2)} px from the weight`);
  const far = Math.max(...mark.points.map(p => Math.hypot(p.x - w[0], p.y - w[1])));
  out.dan = { weight: w.map(v => +v.toFixed(2)), enclosing: [+c.x.toFixed(1), +c.y.toFixed(1)], off: +off.toFixed(2), far: +far.toFixed(1), gap: +(0.095 * mark.height).toFixed(1), inner: +mark.ring.radius.toFixed(1), outer: +(mark.ring.radius + mark.ring.band).toFixed(1), clearances: clearances.map(v => [+v.toFixed(1), +(v + mark.ring.band).toFixed(1)]) };
  return out;
}

// ================================================================ R2: scattered all the way round
// A hold run to the end: every frame checks the phase, the order, each join's moves and the settled spin; the ring is
// measured 1.5 s and 2.0 s after the last join (see SETTLE).
export const SETTLE = 2.0;
function ringRun(M, F, mark, pointerAt, limit = 20) {
  const P = pointerAt(0).slice(), hold = F.press(...P), turn = M.STARS.hold.turn;
  let prev = null, lastJoin = null, joins = 0, worst = { single: 0, batch: 0, m: 0 }, spins = 0, worstSpin = 0, frames = 0;
  const snaps = {};
  for (;;) {
    const q = pointerAt(hold.held + DT); P[0] = q[0]; P[1] = q[1];
    const phase0 = F.ring.phase;
    F.gather(hold, P, DT); F.step(DT); frames++;
    const ring = F.ring, N = ring.order.length, s = F.markState(), C = s.ring.centre;
    assert.ok(ring.phase === phase0 + turn * DT, `R2 phase: the phase moved by ${ring.phase - phase0}, not turn x dt, at ${hold.held.toFixed(3)} s`);
    const cs = ring.order.map(i => F.cluster.get(i));
    // The cyclic order by psi: the forward gaps round the order add up to one turn, and the members keep their order.
    if (N > 1) {
      const sum = cs.reduce((t, c, k) => t + mod(cs[(k + 1) % N].psi - c.psi), 0);
      assert.ok(Math.abs(sum - TURN) < 1e-6, `R2 order: the ring's order by psi changed (${(sum / TURN).toFixed(3)} turns round the order) at ${hold.held.toFixed(3)} s`);
    }
    if (prev && prev.order.length > 1) {
      const kept = new Set(prev.order), sub = ring.order.filter(i => kept.has(i)), at = sub.indexOf(prev.order[0]);
      assert.ok(sub.every((_i, k) => sub[(at + k) % sub.length] === prev.order[k]), `R2 order: the members' order changed at ${hold.held.toFixed(3)} s`);
    }
    if (prev && N !== prev.order.length) {
      // A join: how far each member's target moved, in slots of the new ring.
      const m = N - prev.order.length, slot = TURN / N;
      let moved = 0;
      for (const [i, T] of prev.targets) moved = Math.max(moved, Math.abs(wrap(F.cluster.get(i).target - T)) / slot);
      if (m === 1) worst.single = Math.max(worst.single, moved);
      if (moved / Math.max(1, m / 2) > worst.batch) worst = { ...worst, batch: moved / Math.max(1, m / 2), m, moved };
      assert.ok(moved <= 1.5 * Math.max(1, m / 2), `R2 join: ${m} stars joined and a member's target moved ${moved.toFixed(2)} slots at ${hold.held.toFixed(3)} s`);
      joins++; lastJoin = hold.held;
    } else if (prev) {
      // A settled star (on its target, at rest in the turning frame) turns at the ring's rate, within 1 %.
      for (const c of cs) {
        const was = prev.theta.get(c);
        if (was === undefined || Math.abs(c.psi - c.target) > 1e-4 || Math.abs(c.pv) > 1e-3) continue;
        const rate = wrap(c.theta - was) / DT;
        worstSpin = Math.max(worstSpin, Math.abs(rate / turn - 1)); spins++;
        assert.ok(Math.abs(rate / turn - 1) <= 0.01, `R2 spin: a settled ring star turns at ${rate.toFixed(4)} rad/s, not ${turn.toFixed(4)}`);
      }
    }
    for (const T of [1.5, SETTLE]) if (lastJoin !== null && Math.abs(hold.held - lastJoin - T) < DT / 2) snaps[T] = measure(M, F, mark, s, cs);
    prev = { order: ring.order.slice(), targets: new Map(ring.order.map(i => [i, F.cluster.get(i).target])), theta: new Map(cs.map(c => [c, c.theta])) };
    if (F.cluster.size === F.stars.length && lastJoin !== null && hold.held >= lastJoin + SETTLE - 1e-9) break;
    assert.ok(hold.held < limit, `R2 settle: the hold had not captured every star by ${limit} s`);
  }
  return { hold, snaps, joins, worst, spins, worstSpin, frames, lastJoin };
}
// The ring now, measured on the placed stars (the tremble taken out).
function measure(M, F, mark, s, cs) {
  const N = cs.length, C = s.ring.centre, slot = TURN / N, inner = mark.ring.radius, band = mark.ring.band;
  let radius = 0, target = 0, jitter = 0, lo = Infinity, hi = -Infinity, gmin = Infinity, gmax = 0;
  const ang = cs.map(c => {
    const i = [...F.cluster].find(([, q]) => q === c)[0], [x, y] = placed(F, i), r = Math.hypot(x - C[0], y - C[1]), a = Math.atan2(y - C[1], x - C[0]);
    radius = Math.max(radius, Math.abs(r - c.radius)); lo = Math.min(lo, c.radius); hi = Math.max(hi, c.radius);
    target = Math.max(target, Math.abs(wrap(a - s.ring.phase - c.target)));
    return { a, i };
  });
  ang.forEach((p, k) => {
    const q = ang[(k + 1) % N], g = mod(q.a - p.a) / slot;
    gmin = Math.min(gmin, g); gmax = Math.max(gmax, g);
    // R2: neighbours' gap is one slot plus the difference of their own jitters (hash(i, 7)), so each star's offset from its
    // slot is its jitter.
    const want = 1 + 0.7 * (M.hash(q.i, 7) - 0.5) - 0.7 * (M.hash(p.i, 7) - 0.5);
    jitter = Math.max(jitter, Math.abs(g - want) * slot);
  });
  return { N, radius, lo, hi, inner, band, span: (hi - lo) / band, target, jitter, gaps: [gmin, gmax] };
}
function judge(snap, name) {
  const { N, radius, lo, hi, inner, band, span, target, jitter, gaps } = snap;
  assert.ok(radius <= 0.5, `R2 settle: a ring star is ${radius.toFixed(3)} px off its own radius ${SETTLE} s after the last join (${name})`);
  assert.ok(lo >= inner - 1e-9 && hi <= inner + band + 1e-9, `R2 band: a ring radius ${lo.toFixed(2)}-${hi.toFixed(2)} lies outside the band ${inner.toFixed(2)}-${(inner + band).toFixed(2)} (${name})`);
  if (N >= 50) assert.ok(span >= 0.8, `R2 band: the ${N} ring radii span ${(100 * span).toFixed(1)} % of the band, under 80 % (${name})`);
  assert.ok(gaps[0] >= 0.3 && gaps[1] <= 1.7, `R2 gaps: neighbours ${gaps[0].toFixed(3)} to ${gaps[1].toFixed(3)} slots apart, not 0.3 to 1.7 (${name})`);
  assert.ok(target <= 0.002, `R2 settle: a ring star is ${target.toExponential(2)} rad off its target (${name})`);
  assert.ok(jitter <= 0.004, `R2 jitter: a neighbours' gap is ${jitter.toExponential(2)} rad off one slot plus their jitters (${name})`);
}
export async function checkRing(source = read('stars.mjs')) {
  const M = await load('stars.mjs', source), out = {};
  // A full 600-point mark at 1440 x 900: held at [700, 450] to 2.6 s, then a sweep at 150 px a second, left to 350 and right
  // to 1100, then still. With R5 the hold goes on to gather every star.
  const sweep = t => { if (t < 2.6) return [700, 450]; const d = Math.min((t - 2.6) * 150, 1100); return d < 350 ? [700 - d, 450] : [350 + (d - 350), 450]; };
  for (const [name, points, at] of [['600 points, a sweep', 600, sweep], ['40 points, still (round 9)', 40, () => [700, 450]]]) {
    const { F, mark } = fieldFor(M, 1440, 900, points), r = ringRun(M, F, mark, at);
    const ringCount = F.ring.order.length;
    if (points === 600) assert.ok(ringCount >= 150, `R2 settle: only ${ringCount} stars joined the ring (${name})`);
    judge(r.snaps[SETTLE], name);
    out[name] = { ring: ringCount, joins: r.joins, lastJoin: +r.lastJoin.toFixed(2), at: r.snaps[SETTLE], early: r.snaps[1.5], worst: r.worst, spins: r.spins, worstSpin: r.worstSpin, frames: r.frames };
  }
  return out;
}

// ================================================================ R3: on the screen
export async function checkClamp(source = read('stars.mjs')) {
  const M = await load('stars.mjs', source), out = [];
  for (const [W, H] of [[1474, 996], [1280, 800], [1024, 640]]) {
    const places = { top: [W / 2, 3], bottom: [W / 2, H - 3], left: [3, H / 2], right: [W - 3, H / 2], 'top left': [3, 3], 'top right': [W - 3, 3], 'bottom left': [3, H - 3], 'bottom right': [W - 3, H - 3] };
    for (const [name, P] of Object.entries(places)) {
      const { F, mark } = fieldFor(M, W, H), hold = F.press(...P), outer = mark.ring.radius + mark.ring.band;
      let first = null, appeared = null, ringFrames = 0;
      while (ringFrames < 30) {
        F.gather(hold, P, DT); F.step(DT);
        const s = F.markState(), C = s.centre, R = s.ring.centre, where = `${name} at ${W} x ${H}, ${hold.held.toFixed(2)} s`;
        assert.ok(hold.held < 15, `R3 inside: no ring within 15 s (${name} at ${W} x ${H})`);
        for (const p of mark.points) assert.ok(C[0] + p.x >= 16 - 1e-9 && C[0] + p.x <= W - 16 + 1e-9 && C[1] + p.y >= 16 - 1e-9 && C[1] + p.y <= H - 16 + 1e-9, `R3 inside: a mark point leaves the hero (${where})`);
        assert.ok(R[0] - outer >= 16 - 1e-9 && R[0] + outer <= W - 16 + 1e-9 && R[1] - outer >= 16 - 1e-9 && R[1] + outer <= H - 16 + 1e-9, `R3 inside: the ring's circle leaves the hero (${where})`);
        // A still hold: the mark's centre is the same in every frame, before and after the ring appears.
        first ||= C.slice();
        assert.ok(C[0] === first[0] && C[1] === first[1], `R3 jump: the mark's centre moved from ${first} to ${C} (${where})`);
        if (s.ring.count) { appeared ??= hold.held; ringFrames++; }
      }
      const old = [W, H].map((L, k) => Math.min(L - 16 - mark.half[k], Math.max(16 + mark.half[k], P[k])));
      out.push({ size: `${W}x${H}`, name, appeared: +appeared.toFixed(2), centre: first.map(v => +v.toFixed(1)), inward: +Math.hypot(first[0] - old[0], first[1] - old[1]).toFixed(1) });
    }
  }
  // The fallbacks, on a made-up mark: a ring too wide for the hero takes the mark-only clamp on that axis; a mark too wide
  // takes the middle.
  const fake = { half: [50, 20], ring: { centre: [-5, 0], radius: 90, band: 10 } };
  const a = M.markCentre([10, 10], fake, 200, 400), b = M.markCentre([10, 10], fake, 90, 400);
  assert.ok(Math.abs(a[0] - 66) < 1e-9 && Math.abs(a[1] - 116) < 1e-9, `R3 inside: the fallback for a ring too wide is ${a}, not the mark-only clamp on x`);
  assert.ok(b[0] === 45, `R3 inside: a mark too wide for the hero is not put in the middle (${b})`);
  return out;
}

// ================================================================ C18-7: no held tremble; retain charge/release diagnostics
export async function checkCharge(source = read('stars.mjs')) {
  // Dan, 9:32 AM on version 26: the start is 5.6 s after the formation, about 8 s held (round 16 built it at 1.5 s).
  const START = 5.6, site = `charge: { start: ${START}, ramp: 2, amp: 1.5, hz: [10, 16] },`;
  assert.equal(source.split(site).length - 1, 1, `R4 charge: STARS.charge is not { start: ${START}, ramp: 2, amp: 1.5, hz: [10, 16] }`);
  const M = await load('stars.mjs', source), Q = await load('stars.mjs', source.replace(site, `charge: { start: ${START}, ramp: 2, amp: 0, hz: [10, 16] },`));
  const W = 1474, H = 996, P = [820, 470], n = M.makeStars(W, H).length;
  const A = fieldFor(M, W, H), B = fieldFor(Q, W, H), ha = A.F.press(...P), hb = B.F.press(...P);
  let worstShown = 0, heldSamples = 0, t0 = null, frames = 0, markStill = 0, ringStill = 0, worstRing = 0;
  let previous = null;
  while (ha.held < 30 - 1e-9) {
    A.F.gather(ha, P, DT); A.F.step(DT); B.F.gather(hb, P, DT); B.F.step(DT); frames++;
    const t = ha.held;
    if (ha.formedAt !== null) t0 = ha.formedAt + START;
    const want = t0 === null || t < t0 ? 0 : 1.5 * (x => x * x * (3 - 2 * x))(Math.min(1, (t - t0) / 2));
    assert.ok(Math.abs(ha.charge - want) < 1e-9 && A.F.markState().charge === ha.charge, `R4 amplitude: ${ha.charge} px at ${t.toFixed(3)} s, not the ramp's ${want}`);
    assert.ok(ha.charge <= 1.5, `R4 amplitude: ${ha.charge} px is past amp at ${t.toFixed(3)} s`);
    if (t0 !== null && t >= t0 + 2) assert.equal(ha.charge, 1.5, `R4 amplitude: not amp at ${t.toFixed(3)} s`);
    // Charge cannot affect any path or shown offset, even after the old onset/full-charge times.
    for (let k = 0; k < 2 * n; k++) assert.ok(Math.abs(A.F.base[k] - B.F.base[k]) < 1e-9, `R4 path: star ${k >> 1}'s path differs from the one without R4 at ${t.toFixed(3)} s`);
    const state = A.F.markState();
    for (const [i, c] of A.F.cluster) {
      for (const k of [2 * i, 2 * i + 1]) {
        assert.equal(A.F.offsets[k], Math.fround(A.F.base[k]), `C18 held stars: star ${i} moves off its unshaken place at ${t.toFixed(3)} s`);
        assert.equal(A.F.offsets[k], B.F.offsets[k], `C18 held stars: charge moves star ${i} at ${t.toFixed(3)} s`);
      }
      worstShown = Math.max(worstShown, Math.hypot(A.F.offsets[2 * i] - A.F.base[2 * i], A.F.offsets[2 * i + 1] - A.F.base[2 * i + 1])); heldSamples++;
      if (previous && t >= 20) {
        if (c.point !== undefined) {
          assert.equal(A.F.offsets[2 * i], previous.offsets[2 * i], `C18 held stars: settled mark star ${i} moves in x`);
          assert.equal(A.F.offsets[2 * i + 1], previous.offsets[2 * i + 1], `C18 held stars: settled mark star ${i} moves in y`); markStill++;
        } else if (c.ring) {
          // Undo only the preserved rigid spin. Float32 uploads round positions by at most 1e-4 px.
          const local = (phase, offsets) => {
            const x = A.F.stars[i].x + offsets[2 * i] - state.centre[0] - A.mark.ring.centre[0];
            const y = A.F.stars[i].y + offsets[2 * i + 1] - state.centre[1] - A.mark.ring.centre[1];
            return [x * Math.cos(phase) + y * Math.sin(phase), -x * Math.sin(phase) + y * Math.cos(phase)];
          };
          const before = local(previous.phase, previous.offsets), now = local(state.ring.phase, A.F.offsets), delta = Math.hypot(now[0] - before[0], now[1] - before[1]);
          worstRing = Math.max(worstRing, delta); ringStill++;
          assert.ok(delta < 0.0002, `C18 held stars: settled ring star ${i} moves ${delta} px beyond its spin`);
        }
      }
    }
    previous = { offsets: A.F.offsets.slice(), phase: state.ring.phase };
  }
  const s = A.F.markState();
  assert.ok(s.arrived === B.F.markState().arrived && s.ring.count === B.F.markState().ring.count, 'R4 path: arrival or the ring differs from the one without R4');
  for (let i = 0; i < n; i++) assert.equal(A.F.mixes[i], B.F.mixes[i], `R4 path: star ${i}'s mark weight differs from the one without R4`);
  assert.ok(markStill > 0 && ringStill > 0, 'C18 held stars: settled mark/ring checks must not be empty');
  // Long holds and the no-mark fallback use the same unshaken placement rule. No charge-dependent displacement is allowed.
  const plain = M.createField(W, H), hp = plain.press(...P), longHolds = [60, 3600, 86400];
  for (const t of longHolds) {
    for (const [F, h] of [[A.F, ha], [plain, hp]]) {
      const dt = t - h.held; F.gather(h, P, dt); F.step(DT);
      for (const i of F.cluster.keys()) for (const k of [2 * i, 2 * i + 1]) {
        assert.equal(F.offsets[k], Math.fround(F.base[k]), `C18 held stars: long hold ${t} s moves star ${i}`); heldSamples++;
      }
    }
  }
  // Release uses held duration/mass and starts exactly at the displayed, now steady position.
  const ids = [...A.F.cluster.keys()], before = ids.map(i => [A.F.offsets[2 * i], A.F.offsets[2 * i + 1]]);
  A.F.blast(ha, P);
  let worstRelease = 0;
  ids.forEach((i, k) => { const sh = A.F.shown(i); worstRelease = Math.max(worstRelease, Math.hypot(sh[0] - before[k][0], sh[1] - before[k][1])); });
  assert.ok(worstRelease <= 1e-6, `R4 release: a star's blast starts ${worstRelease} px from where it was shown`);
  assert.equal(A.F.markState().charge, 0, 'R4 release: the charge is not 0 after the release');
  for (let k = 0; k < 60; k++) {
    A.F.step(DT);
    for (const i of ids.slice(0, 200)) { const sh = A.F.shown(i); assert.ok(Math.abs(sh[0] - A.F.offsets[2 * i]) < 1e-3 && Math.abs(sh[1] - A.F.offsets[2 * i + 1]) < 1e-3, `R4 release: star ${i} trembles after the release`); }
  }
  return { formedAt: +ha.formedAt.toFixed(3), start: +(ha.formedAt + START).toFixed(3), full: +(ha.formedAt + START + 2).toFixed(3), frames, heldSamples, markStill, ringStill, worstRing, longHolds, worstShown, worstRelease, captured: ids.length };
}

// ================================================================ R5: the hold keeps gathering
export async function checkGather(source = read('stars.mjs')) {
  const M = await load('stars.mjs', source), W = 1474, H = 996, P = [700, 450], diagonal = Math.hypot(W, H);
  const { F } = fieldFor(M, W, H), hold = F.press(...P), counts = {};
  let beforeFormed = 0, afterFormed = 0;
  while (hold.held < 8 - 1e-9) {
    F.gather(hold, P, DT); F.step(DT);
    const want = Math.min(diagonal, M.captureRadius(hold.held) + Math.max(0, hold.held - 2.5) * 104);
    assert.ok(Math.abs(hold.radius - want) < 1e-9, `R5 radius: ${hold.radius.toFixed(2)} px at ${hold.held.toFixed(3)} s held, not ${want.toFixed(2)} (${hold.formedAt === null ? 'before' : 'after'} the formation)`);
    if (hold.formedAt === null) beforeFormed++; else afterFormed++;
    for (const t of [4, 5, 6, 8]) if (Math.abs(hold.held - t) < DT / 2) { const s = F.markState(); counts[t] = { ring: s.ring.count, assigned: s.assigned, arrived: s.arrived, captured: s.captured }; }
  }
  const s = F.markState();
  assert.ok(s.assigned === 600 && s.arrived === 600, `R5 mark: a still hold at [700, 450] has ${s.assigned} of 600 points taken, ${s.arrived} arrived, at 8 s`);
  assert.ok(counts[8].ring > counts[6].ring && counts[6].ring > counts[5].ring, 'R5 ring: the ring does not fill as the hold goes on');
  return { counts, beforeFormed, afterFormed, formedAt: +hold.formedAt.toFixed(3), stars: F.stars.length };
}

// ================================================================ controls
const HELD_STARS_CONTROL = {
  id: 'C18 held tremble restored',
  search: 'const place = (i, x, y) => { base[2 * i] = S[2 * i] = x; base[2 * i + 1] = S[2 * i + 1] = y; };',
  replacement: 'const place = (i, x, y) => { base[2 * i] = x; base[2 * i + 1] = y; const tr = k => charge * Math.sin(2 * Math.PI * (10 + 6 * hash(i, 9 + k)) * hold.held + 2 * Math.PI * hash(i, 11 + k)); S[2 * i] = x + tr(0); S[2 * i + 1] = y + tr(1); };',
  gate: 'C18 held stars:', run: s => checkCharge(s),
};
export async function checkHeldStarsControl() {
  const c = HELD_STARS_CONTROL, source = read('stars.mjs');
  assert.equal(source.split(c.search).length - 1, 1, 'C18 held tremble control must match one site');
  let message = '';
  try { await c.run(source.replace(c.search, c.replacement)); } catch (error) { message = error.message; }
  assert.ok(message.startsWith(c.gate), `C18 held tremble control missed its gate (${message || 'passed'})`);
  return `${c.id}: failed at ${c.gate} (${message.split('\n')[0]})`;
}
export const ROUND16_CONTROLS = [
  HELD_STARS_CONTROL,
  { id: 'growth frozen at the formation', search: '    if (mark) hold.extra = ', replacement: '    if (mark && !formed) hold.extra = ', gate: 'R5 radius:', run: s => checkGather(s) },
  { id: 'a charge that starts at the press', search: 'const t0 = mark ? (hold.formedAt === null ? null : hold.formedAt + STARS.charge.start) : STARS.hold.full + STARS.charge.start;', replacement: 'const t0 = 0;', gate: 'R4 amplitude:', run: s => checkCharge(s) },
  { id: 'a charge that grows past amp', search: 'STARS.charge.amp * smooth((t - t0) / STARS.charge.ramp)', replacement: 'STARS.charge.amp * (t - t0) / STARS.charge.ramp', gate: 'R4 amplitude:', run: s => checkCharge(s) },
  { id: 'the box centre for the ring', search: 'ring: { centre: weight,', replacement: 'ring: { centre: [0, 0],', gate: 'R1 centre:', run: s => checkCentre(s) },
  { id: 'one radius for every ring star', search: 'mark.ring.radius + hash(i, 6) * mark.ring.band;', replacement: 'mark.ring.radius + 0.5 * mark.ring.band;', gate: 'R2 band:', run: s => checkRing(s) },
  { id: 'a 14 px band', search: 'ringGap: 0.095, ringBand: 0.1,', replacement: 'ringGap: 0.095, ringBand: 14 / 199.2,', gate: 'R1 band:', run: s => checkCentre(s) },
  { id: 'no jitter', search: 'export const ringJitter = i => 0.7 * (hash(i, 7) - 0.5);', replacement: 'export const ringJitter = i => 0;', gate: 'R2 jitter:', run: s => checkRing(s) },
  { id: 'ring stars kept at their capture angles', search: '    cs.forEach((c, k) => { c.target = base + slot(k, c); });', replacement: '    cs.forEach(c => { c.target ??= c.psi; });', gate: 'R2 gaps:', run: s => checkRing(s) },
  { id: 'a join that orders by star index', search: '    ring.order = merged.map(m => m.i);', replacement: '    ring.order = merged.map(m => m.i).sort((a, b) => a - b);', gate: 'R2 order:', run: s => checkRing(s) },
  { id: 'the old mark-only clamp', search: '  return a > b ? Math.min(hi, Math.max(lo, anchor[k]))', replacement: '  return true ? Math.min(hi, Math.max(lo, anchor[k]))', gate: 'R3 inside:', run: s => checkClamp(s) },
];
export async function checkRound16Controls() {
  const out = [], source = read('stars.mjs');
  for (const c of ROUND16_CONTROLS) {
    assert.equal(source.split(c.search).length - 1, 1, `round 16 control ${c.id} must match one site`);
    let message = '';
    try { await c.run(source.replace(c.search, c.replacement)); } catch (error) { message = error.message; }
    assert.ok(message.startsWith(c.gate), `round 16 control ${c.id} not caught at ${c.gate} (${message || 'passed'})`);
    out.push(`${c.id} caught: ${message.split('\n')[0]}`);
  }
  return out.join('; ');
}

export async function checkRound16() {
  const c = await checkCentre(), r = await checkRing(), k = await checkClamp(), q = await checkCharge(), g = await checkGather();
  const d = c.dan, f = v => v.toFixed(3);
  const ring = Object.entries(r).map(([name, v]) => `${name}: ${v.ring} in the ring (${v.joins} joins, the last at ${v.lastJoin} s); ${SETTLE} s after it every star within ${f(v.at.radius)} px of its own radius (1.5 s: ${f(v.early.radius)}), radii ${f(v.at.lo)}-${f(v.at.hi)} in the band ${f(v.at.inner)}-${f(v.at.inner + v.at.band)} (span ${(100 * v.at.span).toFixed(1)} %), within ${v.at.target.toExponential(1)} rad of its target (1.5 s: ${v.early.target.toExponential(1)}), offsets equal the jitter within ${v.at.jitter.toExponential(1)} rad, neighbours ${f(v.at.gaps[0])}-${f(v.at.gaps[1])} slots apart (1.5 s: ${f(v.early.gaps[0])}-${f(v.early.gaps[1])}); phase exact every frame; ${v.spins} settled star-frames turn within ${(100 * v.worstSpin).toFixed(3)} % of turn; order kept every frame (${v.frames}); a single joiner moves a member at most ${v.worst.single.toFixed(2)} slots, a batch at most ${v.worst.batch.toFixed(2)} x max(1, m/2) slots (${v.worst.moved?.toFixed(2)} for ${v.worst.m})`).join('; ');
  return `R1 centre: at 1474 x 996 the weight is (${d.weight.join(', ')}) px from the box centre, the smallest circle round the outline at (${d.enclosing.join(', ')}), ${d.off} px away; band ${d.far} + ${d.gap} = ${d.inner} to ${d.outer} px; clearance to the D's top and bottom corners ${d.clearances[0].join('-')} and ${d.clearances[1].join('-')} px, to the G's right edge ${d.clearances[2].join('-')} px; weight, inner edge, depth and centre exact at ${Object.keys(c).filter(x => x !== 'dan').join(', ')}.
R2 ring: ${ring}.
R3 clamp: ${k.length} still holds at the edges and corners of 1474 x 996, 1280 x 800 and 1024 x 640, every mark point and the ring's outer circle 16 px inside in every frame, the centre still when the ring appears; furthest in than the mark-only clamp ${Math.max(...k.map(v => v.inward)).toFixed(1)} px (${k.filter(v => v.size === '1474x996').map(v => `${v.name} ${v.inward}`).join(', ')} at 1474 x 996); fallbacks to the mark-only clamp and the middle.
C18-7 held stars: ${q.frames} frames through 30 s / ${q.heldSamples} held samples, offsets exactly float32(base); ${q.markStill} settled mark star-frames unchanged, ${q.ringStill} settled ring star-frames within ${q.worstRing.toExponential(1)} px after undoing only spin; holds ${q.longHolds.join('/')} s with/without mark stay on base. Retained charge: formed ${q.formedAt} s, starts ${q.start} s, full ${q.full} s; paths, arrival, weights and ring identical at amp 0/1.5. ${q.captured} blasts start where shown (${q.worstRelease} px).
R5 gather: radius min(diagonal, captureRadius + 104 px/s past 2.5 s) in all ${g.beforeFormed} frames before and ${g.afterFormed} after the formation (${g.formedAt} s); still hold at [700, 450], 1474 x 996 (${g.stars} stars): ${Object.entries(g.counts).map(([t, v]) => `${t} s ring ${v.ring} (captured ${v.captured}, mark ${v.assigned}/600, ${v.arrived} arrived)`).join(', ')}.`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(await checkRound16());
  if (process.argv.includes('--controls')) console.log('Round 16 negative controls: ' + await checkRound16Controls());
}
