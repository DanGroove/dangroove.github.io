// Round 12 (CORRECTIONS-12), S1 and L2. Node only, on the pure models.
//   node design/journey-hero/take-2/tools/round12-stars-list-checks.mjs [--controls]
// S1: the stars form the logo only once 300 are captured, and past 2.5 s the capture radius keeps growing until then
// (stars.mjs). L2: the craft list's current row is selected, and the selection travels to the new row leading edge first
// (craft-wipe.mjs; it replaces round 11's red rule, so this file also carries round 11's kept rules: the change runs from the
// craft actually current, reduced motion cuts, the entrance and the loop's start make no change, the loop's own changes).
// The negative controls edit one exact site in memory and must fail at their gate.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EASE } from '../../../../public/journey/hero/engine.mjs';
import { SHOW, LOOP, sceneAt } from '../stage.mjs';
import { ENTRANCE, loopAt } from '../entrance.mjs';
import { markPaths } from './round9-checks.mjs';

const TAKE = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, TAKE), 'utf8');
async function load(name, source = read(name)) {
  const url = new URL(name, TAKE);
  const fixed = source.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_all, _quote, ref) => `from '${new URL(ref, url).href}'`);
  return import('data:text/javascript;base64,' + Buffer.from(fixed).toString('base64'));
}
const W = 1440, H = 900, DT = 1 / 60;
let sample = null;

// ================================================================ S1
async function fieldFor(M, w = W, h = H) {
  sample ||= M.sampleMark(markPaths(), 600);
  return M.createField(w, h, M.placeMark(sample, w, h));
}
// One hold, frame by frame: when the formation starts, what was captured then, and the radius every frame.
function run(F, P, until) {
  const hold = F.press(...P), frames = [];
  let firstPoint = null;
  while (hold.held < until - 1e-9) {
    F.gather(hold, P, DT); F.step(DT);
    const pointed = [...F.cluster.values()].some(c => c.point !== undefined || c.ring);
    frames.push({ held: hold.held, radius: hold.radius, captured: F.cluster.size, formed: F.markState().formed, pointed });
    if (firstPoint === null && pointed) firstPoint = frames.at(-1);
  }
  return { hold, frames, firstPoint };
}

// ---- no star is given a point before 300 are captured (anywhere: the middle, off centre, a moving hold, the corners).
export async function checkThreshold(source = read('stars.mjs')) {
  const M = await load('stars.mjs', source), out = [];
  assert.equal(M.STARS.mark.threshold, 300, 'S1 threshold: STARS.mark.threshold is not 300');
  for (const [name, P] of [['middle', [720, 450]], ['off centre', [200, 200]], ['top left', [3, 3]], ['bottom right', [W - 3, H - 3]]]) {
    const F = await fieldFor(M), { frames, firstPoint } = run(F, P, 7);
    for (const f of frames) if (f.pointed) { assert.ok(f.captured >= 300, `S1 threshold: a star has a point at ${f.held.toFixed(3)} s held with ${f.captured} captured (${name})`); break; }
    assert.ok(firstPoint, `S1 threshold: no formation within 7 s (${name})`);
    // It starts in the very frame the 300th star is caught.
    const before = frames[frames.indexOf(firstPoint) - 1];
    assert.ok(before.captured < 300 && firstPoint.captured >= 300, `S1 threshold: the formation did not start with the 300th capture (${name})`);
    out.push({ name, at: +firstPoint.held.toFixed(3), captured: firstPoint.captured, radius: +firstPoint.radius.toFixed(1) });
  }
  // At the middle of a 1440 x 900 hero: about 2.3 s (a uniform field holds 300 stars inside 321 px, the radius at 2.32 s).
  const mid = out[0];
  assert.ok(mid.at >= 2.2 && mid.at <= 2.5, `S1 threshold: at the middle the formation starts at ${mid.at} s, not about 2.3 s`);
  return out;
}

// ---- the radius: 80 to 340 px over 2.5 s as before; then, short of 300, on at 104 px a second until 300 are caught; then
// still. At the middle the formation starts before 2.5 s and the radius keeps round 8's curve.
export async function checkRadius(source = read('stars.mjs')) {
  const M = await load('stars.mjs', source), out = {};
  assert.ok(Math.abs(M.growthRate() - 104) < 1e-9, 'S1 radius: the growth rate is not 104 px a second');
  for (const [name, P] of [['top left', [3, 3]], ['top right', [W - 3, 3]], ['bottom left', [3, H - 3]], ['bottom right', [W - 3, H - 3]]]) {
    const F = await fieldFor(M), { hold, frames } = run(F, P, 8);
    const start = hold.formedAt;
    assert.ok(start !== null && start > 2.5, `S1 radius: the corner hold formed at ${start} s (${name})`);
    let still = null;
    for (const f of frames) {
      if (f.held <= 2.5 + 1e-9) assert.ok(Math.abs(f.radius - M.captureRadius(f.held)) < 1e-9, `S1 radius: ${f.radius} px at ${f.held.toFixed(3)} s is not round 8's (${name})`);
      else if (f.held <= start + 1e-9) {
        assert.ok(Math.abs(f.radius - (340 + 104 * (f.held - 2.5))) < 1e-6, `S1 radius: ${f.radius.toFixed(2)} px at ${f.held.toFixed(3)} s is not 340 + 104 px/s (${name})`);
        if (f.held < start - 1e-9) assert.ok(f.captured < 300, `S1 radius: 300 caught before the formation (${name})`);
      } else {
        still ??= frames.find(g => Math.abs(g.held - start) < 1e-9).radius;
        assert.equal(f.radius, still, `S1 radius: the radius moved after the formation started, at ${f.held.toFixed(3)} s (${name})`);
      }
    }
    assert.ok(still > 340, `S1 radius: the corner radius did not grow past 340 px (${name})`);
    out[name] = { start: +start.toFixed(3), radius: +still.toFixed(1) };
  }
  // The middle: the formation starts before 2.5 s; the radius goes on to 340 px at 2.5 s on round 8's curve and stays.
  const F = await fieldFor(M), { hold, frames } = run(F, [720, 450], 4);
  assert.ok(hold.formedAt < 2.5, 'S1 radius: the middle hold did not form before 2.5 s');
  for (const f of frames) assert.ok(Math.abs(f.radius - M.captureRadius(f.held)) < 1e-9, `S1 radius: the middle radius left round 8's curve at ${f.held.toFixed(3)} s`);
  // A hero too small to hold 300 stars (600 x 400 has 222): the radius reaches the diagonal and the logo forms with what it has.
  const small = await fieldFor(M, 600, 400), s = run(small, [300, 200], 10), diag = Math.hypot(600, 400);
  assert.ok(small.stars.length < 300 && s.hold.formedAt !== null && Math.abs(s.firstPoint.radius - diag) < 1e-9, 'S1 radius: a hero short of 300 stars does not form at its diagonal');
  assert.ok(s.frames.every(f => f.radius <= diag), 'S1 radius: the radius passed the hero\'s diagonal');
  out.small = { stars: small.stars.length, start: +s.hold.formedAt.toFixed(3), captured: s.firstPoint.captured, diagonal: +diag.toFixed(1) };
  // The blast is unchanged: the impulse still scales with held time capped at 2.5 s.
  const C = await fieldFor(M), c = run(C, [3, 3], 6), ids = [...C.cluster.keys()];
  C.blast(c.hold, [3, 3]);
  for (const i of ids.slice(0, 50)) { const v = Math.hypot(...C.velocity(i)); assert.ok(Math.abs(v - 2000 / C.stars[i].m) < 1e-3 * v, `S1 blast: a ${c.hold.held.toFixed(2)} s corner hold blasts star ${i} at ${v.toFixed(1)}, not 2000/m`); }
  return out;
}

export async function checkS1(source = read('stars.mjs')) {
  return { threshold: await checkThreshold(source), radius: await checkRadius(source) };
}

// ================================================================ L2
const STEP = 0.005, TOL = 1e-9, ease = EASE.wipe;
const samples = (from, to) => Array.from({ length: Math.round((to - from) / STEP) + 1 }, (_, k) => +(from + k * STEP).toFixed(10));
const clamp01 = x => Math.min(1, Math.max(0, x));
const tween = (from, to, a, b, t) => { const u = (t - a) / (b - a); return u <= 0 ? from : u >= 1 - 1e-9 ? to : from + (to - from) * ease(clamp01(u)); };
// The page's own geometry at 1440 x 900 and 390 x 844 (measured from the packed page; rowRects is checked against it).
const DESK_BOXES = [0, 34.59375, 69.1875, 103.78125].map((top, i) => ({ left: 0, right: 380, top, bottom: top + (i === 3 ? 35.59375 : 34.59375) }));
const PHONE_BOXES = [[0, 0], [187, 0], [0, 44.390625], [187, 44.390625]].map(([left, top]) => ({ left, right: left + 171, top, bottom: top + 44.390625 }));
const near = (a, b, message) => assert.ok(Math.abs(a - b) <= TOL, `${message}: ${a} != ${b}`);
const sameRect = (s, g, message) => ['l', 'r', 't', 'b'].forEach(k => near(s[k], g[k], `${message} (${k})`));

export function checkGeometry(M) {
  const d = M.rowRects(DESK_BOXES, true), p = M.rowRects(PHONE_BOXES, false);
  // Desktop: the top on the row's own hairline, the bottom on the next row's (the last row's own bottom hairline), sides at
  // the row's edges. Phones: just inside each cell.
  d.forEach((r, i) => { assert.deepEqual([r.l, r.r, r.t], [0, 379, DESK_BOXES[i].top], `L2 geometry: row ${i + 1}'s rectangle`); near(r.b, i < 3 ? DESK_BOXES[i + 1].top : DESK_BOXES[3].bottom - 1, `L2 geometry: row ${i + 1}'s bottom line`); });
  p.forEach((r, i) => sameRect(r, { l: PHONE_BOXES[i].left, r: PHONE_BOXES[i].right - 1, t: PHONE_BOXES[i].top, b: PHONE_BOXES[i].bottom - 1 }, `L2 geometry: phone cell ${i + 1}`));
  return { desk: d, phone: p };
}

// ---- one change, 01 to 02 at time 0: the bottom (leading) edge moves over 0.3 s, the top (trailing) from 0.1 to 0.45 s.
export function checkOne(M, G) {
  const T = M.CRAFT_SELECT;
  assert.deepEqual([T.lead, T.trail, T.total, T.handle], [[0, 0.3], [0.1, 0.45], 0.45, 5], 'L2 timing: lead 0 to 0.3 s, trail 0.1 to 0.45 s, 5 px handles');
  const m = M.createCraftModel({ rects: G }), a = G[0], b = G[1];
  m.set(0);
  assert.equal(m.change(1, 0), true, 'L2 one change: 01 to 02 is a change');
  assert.deepEqual(m.roles(), { l: null, r: null, t: 'trail', b: 'lead' }, 'L2 one change: the bottom edge does not lead');
  let n = 0;
  for (const t of samples(0, 0.7)) {
    const s = m.rect(t);
    near(s.b, tween(a.b, b.b, 0, 0.3, t), `L2 one change: the bottom edge at ${t.toFixed(3)} s`);
    near(s.t, tween(a.t, b.t, 0.1, 0.45, t), `L2 one change: the top edge at ${t.toFixed(3)} s`);
    near(s.l, a.l, 'L2 one change: the left edge moved'); near(s.r, a.r, 'L2 one change: the right edge moved');
    assert.ok(s.b > s.t, `L2 one change: the selection turned inside out at ${t.toFixed(3)} s`);
    n++;
  }
  assert.equal(m.busy(0.4499), true, 'L2 one change: over before 0.45 s');
  assert.equal(m.busy(0.45), false, 'L2 one change: still busy at 0.45 s');
  sameRect(m.rect(0.45), b, 'L2 one change: not exactly on 02 at 0.45 s');
  return n;
}

// ---- leading edge first: through a change, the leading edge is always at least as far along as the trailing edge, and
// strictly further while both move; so the selection stretches over the rows between, then closes up.
export function checkLeading(M, G, from = 0, to = 1, label = '01 to 02') {
  const m = M.createCraftModel({ rects: G });
  m.set(from); m.change(to, 0);
  // The check's own reading of the brief, from the geometry alone: the leading edge is on the side it moves toward.
  const a = G[from], b = G[to], out = { l: -1, r: 1, t: -1, b: 1 }, moving = ['l', 'r', 't', 'b'].filter(k => b[k] !== a[k]);
  const lead = moving.filter(k => (b[k] - a[k]) * out[k] > 0), trail = moving.filter(k => (b[k] - a[k]) * out[k] < 0);
  assert.ok(lead.length && trail.length, `L2 leading edge first: ${label} has no leading or no trailing edge`);
  let stretched = 0;
  for (const t of samples(0.005, 0.445)) {
    const s = m.rect(t), along = k => (s[k] - a[k]) / (b[k] - a[k]);
    for (const l of lead) for (const r of trail) assert.ok(along(l) > along(r) + 1e-6, `L2 leading edge first: ${label} at ${t.toFixed(3)} s, the leading ${l} edge is ${along(l).toFixed(3)} along, the trailing ${r} ${along(r).toFixed(3)}`);
    if (['l', 'r', 't', 'b'].some(k => s[k] !== a[k] && s[k] !== b[k]) && (s.r - s.l > Math.max(a.r - a.l, b.r - b.l) + 1 || s.b - s.t > Math.max(a.b - a.t, b.b - b.t) + 1)) stretched++;
  }
  assert.ok(stretched > 0, `L2 leading edge first: ${label} never stretches`);
  return stretched;
}

// ---- the cuts: the new row lights when the leading edge reaches its far side; the old row goes back when the trailing edge
// leaves it; hard cuts (booleans, one flip each); rows in between never light.
export function checkCuts(M, G, from, to, label, want) {
  const m = M.createCraftModel({ rects: G });
  m.set(from); m.change(to, 0);
  let on = null, off = null, prev = m.lit(0);
  assert.ok(prev[from] && !prev[to], `L2 cuts: ${label}, the old row is not lit at the change`);
  for (const t of samples(0, 0.6)) {
    const lit = m.lit(t), s = m.rect(t);
    lit.forEach((v, i) => { if (i !== from && i !== to) assert.equal(v, false, `L2 cuts: ${label}, row ${i + 1} lit at ${t.toFixed(3)} s`); });
    if (!prev[to] && lit[to]) on = t;
    if (prev[from] && !lit[from]) off = t;
    assert.ok(!(prev[to] && !lit[to]) && !(!prev[from] && lit[from]), `L2 cuts: ${label}, a cut went back at ${t.toFixed(3)} s`);
    // The cut is the edge: lit new row exactly when the selection covers it; lit old row exactly while it overlaps it.
    assert.equal(lit[to], M.covers(s, G[to]), `L2 cuts: ${label}, the new row's cut is not where the leading edge reaches its far side (${t.toFixed(3)} s)`);
    assert.equal(lit[from], M.overlaps(s, G[from]), `L2 cuts: ${label}, the old row's cut is not where the trailing edge leaves it (${t.toFixed(3)} s)`);
    prev = lit;
  }
  near(on, want.on, `L2 cuts: ${label}, the new row lit at ${on} s`);
  assert.ok(off !== null && Math.abs(off - want.off) <= STEP + 1e-9, `L2 cuts: ${label}, the old row went back at ${off} s, not ${want.off.toFixed(3)} s`);
  return { on, off };
}
// When the trailing edge (from a to b over 0.1 to 0.45 s) crosses `edge` (bisection on the eased curve).
function crossing(a, b, edge) {
  let lo = 0.1, hi = 0.45;
  for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; ((tween(a, b, 0.1, 0.45, mid) - edge) * Math.sign(b - a) < 0 ? (lo = mid) : (hi = mid)); }
  return Math.ceil(hi / STEP - 1e-9) * STEP;
}

// ---- a change during a change: each edge goes on from where it is to its new target, with the same timing.
export function checkDuring(M, G) {
  const m = M.createCraftModel({ rects: G });
  m.set(0); m.change(1, 0);
  const at = m.rect(0.2), lit = m.lit(0.2);
  m.change(2, 0.2);
  assert.deepEqual(m.roles(), { l: null, r: null, t: 'trail', b: 'lead' }, 'L2 during: 02 to 03 at 0.2 s, the bottom edge does not lead');
  for (const t of samples(0.2, 0.9)) {
    const s = m.rect(t);
    near(s.b, tween(at.b, G[2].b, 0.2, 0.5, t), `L2 during: the bottom edge does not go on from where it was at ${t.toFixed(3)} s`);
    near(s.t, tween(at.t, G[2].t, 0.3, 0.65, t), `L2 during: the top edge does not go on from where it was at ${t.toFixed(3)} s`);
    assert.ok(s.b > s.t, `L2 during: inside out at ${t.toFixed(3)} s`);
    const l = m.lit(t);
    assert.equal(l[1], false, `L2 during: 02 (never reached) lit at ${t.toFixed(3)} s`);
    assert.equal(l[3], false, 'L2 during: 04 lit');
    if (t >= 0.5) assert.equal(l[2], true, `L2 during: 03 not lit at ${t.toFixed(3)} s`);
  }
  assert.ok(lit[0] && !lit[1], 'L2 during: at 0.2 s 01 should still be lit and 02 not yet');
  assert.equal(m.busy(0.65), false, 'L2 during: not over 0.45 s after the second change');
  sameRect(m.rect(0.65), G[2], 'L2 during: not on 03 at rest');
  assert.deepEqual(m.lit(0.65), [false, false, true, false], 'L2 during: two rows lit at rest');
  // Back again, 01 to 02 then 02 to 01 at 0.15 s: the top edge leads back up, the bottom trails; 01 stays lit throughout.
  const b = M.createCraftModel({ rects: G });
  b.set(0); b.change(1, 0); b.change(0, 0.15);
  assert.deepEqual(b.roles(), { l: null, r: null, t: 'lead', b: 'trail' }, 'L2 during: going back, the top edge does not lead');
  for (const t of samples(0.15, 0.8)) { const l = b.lit(t); assert.ok(l[0] && !l[1] && b.rect(t).b > b.rect(t).t, `L2 during: going back at ${t.toFixed(3)} s`); }
  sameRect(b.rect(0.6), G[0], 'L2 during: back on 01 not at rest');
}

// ---- 04 to 01 across the whole list: the top edge leads 03's, 02's and 01's hairlines up; the bottom trails.
export function checkJump(M, G) {
  const m = M.createCraftModel({ rects: G });
  m.set(3); m.change(0, 0);
  assert.deepEqual(m.roles(), { l: null, r: null, t: 'lead', b: 'trail' }, 'L2 jump: 04 to 01, the top edge does not lead');
  for (const t of samples(0, 0.5)) {
    const s = m.rect(t);
    near(s.t, tween(G[3].t, G[0].t, 0, 0.3, t), `L2 jump: the top edge at ${t.toFixed(3)} s`);
    near(s.b, tween(G[3].b, G[0].b, 0.1, 0.45, t), `L2 jump: the bottom edge at ${t.toFixed(3)} s`);
  }
  // The selection stretches across the rows between: 02 and 03 are each wholly inside it for a while (never lit).
  for (const i of [1, 2]) assert.ok(samples(0, 0.45).some(t => M.covers(m.rect(t), G[i])), `L2 jump: the selection does not stretch across row 0${i + 1}`);
  return checkCuts(M, G, 3, 0, '04 to 01', { on: 0.3, off: crossing(G[3].b, G[0].b, G[3].t + 1e-6) });
}

// ---- the phone grid: both directions at once, edge by edge.
export function checkPhone(M, P) {
  const out = {};
  for (const [from, to, roles] of [[0, 3, { l: 'trail', r: 'lead', t: 'trail', b: 'lead' }], [1, 2, { l: 'lead', r: 'trail', t: 'trail', b: 'lead' }], [3, 0, { l: 'lead', r: 'trail', t: 'lead', b: 'trail' }], [0, 1, { l: 'trail', r: 'lead', t: null, b: null }]]) {
    const m = M.createCraftModel({ rects: P }), label = `phone ${from + 1} to ${to + 1}`;
    m.set(from); m.change(to, 0);
    assert.deepEqual(m.roles(), roles, `L2 phone: ${label}, the wrong edges lead`);
    for (const t of samples(0, 0.5)) {
      const s = m.rect(t);
      for (const k of ['l', 'r', 't', 'b']) near(s[k], roles[k] ? tween(P[from][k], P[to][k], ...(roles[k] === 'lead' ? [0, 0.3] : [0.1, 0.45]), t) : P[to][k], `L2 phone: ${label}, the ${k} edge at ${t.toFixed(3)} s`);
      assert.ok(s.r > s.l && s.b > s.t, `L2 phone: ${label} inside out`);
    }
    checkLeading(M, P, from, to, label);
    // The old cell goes back when the last trailing edge leaves it (in the axis where the cells part).
    const offs = Object.keys(roles).filter(k => roles[k] === 'trail').map(k => {
      const dir = Math.sign(P[to][k] - P[from][k]), far = dir > 0 ? { l: 'r', t: 'b' }[k] : { r: 'l', b: 't' }[k];
      return crossing(P[from][k], P[to][k], P[from][far] - dir * 1e-6);
    });
    out[label] = checkCuts(M, P, from, to, label, { on: 0.3, off: Math.min(...offs) });
  }
  return out;
}

// ---- kept from round 11: the change runs from the craft actually current (a click 01 to 03 leaves 02's colours alone),
// reduced motion cuts, the entrance and the first loop start make no change, and the loop's own changes.
export function checkClick(M, G) {
  const m = M.createCraftModel({ rects: G }), starts = SHOW.map((_, i) => SHOW.slice(0, i).reduce((n, s) => n + s.len, 0));
  let clock = 10;
  M.followCraft(m, sceneAt(3.0).scene.craft, clock);
  assert.equal(m.current, 0, 'L2 click: the loop at 3 s is on 01');
  clock += 2;
  const t = starts[SHOW.findIndex(s => s.craft === 2)];
  assert.equal(M.followCraft(m, sceneAt(t).scene.craft, clock), 'change', 'L2 click: 01 to 03 is not a change');
  near(m.rect(clock).t, G[0].t, 'L2 click 01 to 03: the selection does not start from 01');
  near(m.rect(clock).b, G[0].b, 'L2 click 01 to 03: the selection does not start from 01');
  for (const at of samples(clock, clock + 0.6)) assert.equal(m.lit(at)[1], false, 'L2 click 01 to 03: 02 lit');
  sameRect(m.rect(clock + 0.45), G[2], 'L2 click 01 to 03: not at rest on 03');
}
export function checkReduced(M, G) {
  const m = M.createCraftModel({ rects: G });
  M.followCraft(m, 0, 0, { reduced: true });
  assert.equal(M.followCraft(m, 1, 1, { reduced: true }), 'set', 'L2 reduced: a change is not a cut');
  sameRect(m.rect(1), G[1], 'L2 reduced: not at rest at once');
  assert.ok(!m.busy(1) && m.lit(1).join() === 'false,true,false,false', 'L2 reduced: busy or wrongly lit after a cut');
  const b = M.createCraftModel({ rects: G });
  M.followCraft(b, 0, 0); M.followCraft(b, 1, 5); M.followCraft(b, 1, 5.2, { reduced: true });
  sameRect(b.rect(5.2), G[1], 'L2 reduced: switching on mid-change does not cut to rest');
}
export function checkLoop(M, G) {
  const m = M.createCraftModel({ rects: G });
  let clock = 0;
  for (let time = 0; time <= ENTRANCE.end + 1e-9; time += 1 / 60) { M.followCraft(m, sceneAt(loopAt(time)).scene.craft, clock, { cut: true }); clock += 1 / 60; }
  assert.ok(m.current === sceneAt(0).scene.craft && m.changes === 0, 'L2 entrance: the entrance made a change or left the wrong row');
  const seen = [];
  let t = loopAt(ENTRANCE.end), prev = m.current;
  for (let k = 0; k < Math.ceil(LOOP * 60) + 120; k++) {
    t = ((t + 1 / 60) % LOOP + LOOP) % LOOP; clock += 1 / 60;
    if (M.followCraft(m, sceneAt(t).scene.craft, clock) === 'change') { seen.push([prev, m.current, t]); prev = m.current; }
  }
  const want = [[0, 1], [1, 2], [2, 3], [3, 0]];
  assert.deepEqual(seen.map(s => s.slice(0, 2)), want, `L2 loop: the loop's changes are ${JSON.stringify(seen)}`);
  return seen;
}

// ---- the entrance: the lines draw with the row's hairlines; each handle cuts in as its corner's line arrives.
export function checkEntrance(M, G) {
  const r = G[1], w = r.r - r.l + 1;
  let order = [];
  for (let k = 0; k <= 400; k++) {
    const time = ENTRANCE.crafts.start + (ENTRANCE.crafts.end - ENTRANCE.crafts.start) * k / 400;
    // The entrance's own five line progresses (entrance.mjs's staggerSpans with EASE.wipe).
    const p = entranceLines(time), e = M.entranceParts(r, p, 1);
    assert.equal(e.top, p[1], 'L2 entrance: the top line is not row 02\'s own hairline'); assert.equal(e.bottom, p[2], 'L2 entrance: the bottom line is not the next hairline');
    assert.deepEqual(e.handles, [p[1] * w >= 0.5, p[1] * w >= w - 0.5, p[2] * w >= 0.5, p[2] * w >= w - 0.5], `L2 entrance: a handle is not cut in with its corner's line at ${time.toFixed(3)} s`);
    assert.deepEqual(e.sides, [e.handles[0] && e.handles[2], e.handles[1] && e.handles[3]], 'L2 entrance: a side is in before its handles');
    const now = e.handles.map((h, i) => (h ? i : -1)).filter(i => i >= 0);
    for (const i of now) if (!order.includes(i)) order.push(i);
  }
  assert.deepEqual(order, [0, 2, 1, 3], `L2 entrance: the handles cut in as ${order}`);
  assert.equal(M.entranceParts(r, [1, 1, 1, 1, 1], 1).done, true, 'L2 entrance: not done with every line drawn');
  return order;
}
let entranceAtFn = null;
const entranceLines = time => entranceAtFn(time).crafts;

// ---- the page view and styles: round 11's rule is gone; only custom properties and one class per row are written.
export function checkSources(view = read('craft-wipe.mjs'), css = read('take-2.css'), player = read('play.mjs')) {
  assert.ok(!css.includes('is-wiped') && !/li::before/.test(css) && !css.includes('background-clip: text'), 'L2 sources: round 11\'s red rule is still in take-2.css');
  const block = css.slice(css.indexOf('/* Round 12, L2'));
  assert.ok(block.includes('border: 1px solid var(--red-bright);') && block.includes('width: 5px;') && block.includes('height: 5px;') && block.includes('left: calc(var(--sl, 0px) - 2px);'), 'L2 sources: the rectangle is not 1 px red with 5 px handles centred on its corners');
  assert.ok(!/border-radius|transition|opacity|animation/.test(block), 'L2 sources: the selection has round corners, a fade or a transition');
  // Only these properties: boxes for the two absolute pseudo-elements, colours for the rows; no padding, margin, border or
  // font on the rows themselves.
  const props = [...block.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/^\s*([a-z-]+):(?!:)/gm)].map(m => m[1]);
  const allowed = ['position', 'content', 'display', 'box-sizing', 'pointer-events', 'left', 'top', 'width', 'height', 'border', 'clip-path', 'background', 'box-shadow', 'color'];
  assert.ok(props.every(p => allowed.includes(p)) && /::after \{[^}]*\}/.test(block) && block.includes('position: absolute;'), `L2 sources: a layout property is written (${props.filter(p => !allowed.includes(p)).join(', ')})`);
  const page = view.slice(view.indexOf('// ---- the page'));
  const writes = [...page.matchAll(/\.style\.(\w+)/g)].map(m => m[1]);
  assert.ok(writes.every(w => w === 'setProperty' || w === 'removeProperty') && page.includes("classList.toggle('is-lit'"), `L2 sources: the view writes ${writes.join(', ')}`);
  assert.ok(player.includes('craftWipe.follow(scene.craft, { cut: !!intro, entrance: state ? state.crafts : null });') && player.includes('crafts: p => craftWipe.hold(p)'), 'L2 sources: the player does not hand the list its craft and the entrance, or __hero.crafts is gone');
  return writes.length;
}

export async function checkL2(source = read('craft-wipe.mjs')) {
  const M = await load('craft-wipe.mjs', source);
  entranceAtFn ||= (await import('../entrance.mjs')).entranceAt;
  const { desk: G, phone: P } = checkGeometry(M);
  const n = checkOne(M, G), stretch = checkLeading(M, G), one = checkCuts(M, G, 0, 1, '01 to 02', { on: 0.3, off: 0.45 });
  checkDuring(M, G);
  const jump = checkJump(M, G), phone = checkPhone(M, P);
  checkClick(M, G); checkReduced(M, G);
  const seen = checkLoop(M, G), order = checkEntrance(M, G), writes = checkSources(source);
  return { n, stretch, one, jump, phone, seen, order, writes };
}

// ================================================================ controls
export const ROUND12_CONTROLS = [
  { id: 'S1 back to the 1.4 s start', file: 'stars.mjs', search: '(cluster.size >= STARS.mark.threshold || R >= diagonal)', replacement: '(hold.held >= 1.4)', gate: 'S1 threshold:', run: s => checkThreshold(s) },
  { id: 'L2 both edges together', file: 'craft-wipe.mjs', search: "const role = d * OUT[k] > 0 ? 'lead' : 'trail'", replacement: "const role = 'lead'", gate: 'L2 leading edge first:', run: s => load('craft-wipe.mjs', s).then(M => { const { desk } = checkGeometry(M); checkLeading(M, desk); }) },
  { id: 'L2 from the previous scene', file: 'craft-wipe.mjs', search: 'const now = rectAt(time), lit = litAt(time), g = geo[to];', replacement: 'const now = geo[(to + count - 1) % count], lit = litAt(time), g = geo[to];', gate: 'L2 click 01 to 03', run: s => load('craft-wipe.mjs', s).then(M => checkClick(M, checkGeometry(M).desk)) },
];
export async function checkRound12Controls() {
  const out = [];
  for (const c of ROUND12_CONTROLS) {
    const source = read(c.file);
    assert.equal(source.split(c.search).length - 1, 1, `round 12 control ${c.id} must match one site`);
    let message = '';
    try { await c.run(source.replace(c.search, c.replacement)); } catch (error) { message = error.message; }
    assert.ok(message.startsWith(c.gate), `round 12 control ${c.id} not caught at ${c.gate} (${message || 'passed'})`);
    out.push(`${c.id} caught: ${message.split('\n')[0]}`);
  }
  return out.join('; ');
}

export async function checkRound12StarsList() {
  const s = await checkS1(), l = await checkL2();
  const corners = Object.entries(s.radius).filter(([k]) => k !== 'small');
  return `S1 threshold: no star given a point before 300 are captured; formation starts with the 300th capture: ${s.threshold.map(t => `${t.name} ${t.at} s (${t.captured} caught, radius ${t.radius} px)`).join(', ')}.
S1 radius: round 8's 80-340 px over 2.5 s, then 340 + 104 px/s until 300 are caught, then still: ${corners.map(([k, v]) => `${k} forms at ${v.start} s, radius ${v.radius} px`).join('; ')}; the middle keeps round 8's curve; a ${s.radius.small.stars}-star hero (600 x 400) forms at its ${s.radius.small.diagonal} px diagonal at ${s.radius.small.start} s with ${s.radius.small.captured}; the blast stays 2000/mass at the 2.5 s cap.
L2 selection: one change 01 to 02 sampled ${l.n} times at ${STEP} s: bottom (leading) edge over 0-0.3 s, top (trailing) 0.1-0.45 s, EASE.wipe, exactly on 02 at 0.45 s; leading edge first (${l.stretch} stretched samples); 02 lit at +${l.one.on.toFixed(3)} s, 01 back at +${l.one.off.toFixed(3)} s; a change at 0.2 s sends each edge on from where it is (02 never lit, 03 at 0.5 s), going back keeps 01 lit; 04 to 01 stretches over 02 and 03 (01 lit at +${l.jump.on.toFixed(3)} s, 04 back at +${l.jump.off.toFixed(3)} s, 02 and 03 never lit); phone grid ${Object.entries(l.phone).map(([k, v]) => `${k.replace('phone ', '')} on +${v.on.toFixed(3)}/off +${v.off.toFixed(3)}`).join(', ')} s, both axes edge by edge; a click 01 to 03 runs from 01; reduced motion cuts; the entrance makes no change and the loop changes ${l.seen.map(([a, b, t]) => `${a + 1}>${b + 1} at ${t.toFixed(3)}`).join(', ')} s; entrance handles cut in ${l.order.map(i => ['TL', 'TR', 'BL', 'BR'][i]).join(', ')}; the view writes only custom properties (setProperty/removeProperty) and .is-lit.`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(await checkRound12StarsList());
  if (process.argv.includes('--controls')) console.log('Round 12 (S1, L2) negative controls: ' + await checkRound12Controls());
}
