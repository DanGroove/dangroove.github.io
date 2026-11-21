// Round 12 (CORRECTIONS-12), S1. Node only, on the pure model.
//   node design/journey-hero/take-2/tools/round12-stars-list-checks.mjs [--controls]
// S1: the stars form the logo only once 300 are captured, and past 2.5 s the capture radius keeps growing until then
// (stars.mjs). Round 12's L2 (the craft list's selection box) was replaced by round 14's letter roll (CORRECTIONS-14, K1);
// its checks, with the round 11 rules they carried, are now in round14-checks.mjs.
// The negative control edits one exact site in memory and must fail at its gate.
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

// ---- the radius: 80 to 340 px over 2.5 s as before; then, short of 300, on at 104 px a second until 300 are caught; round
// 16 (R5): and on at that rate past the formation, up to the diagonal (round 12 held it still from the formation). At the
// middle the formation starts before 2.5 s and the radius keeps round 8's curve to 2.5 s.
export async function checkRadius(source = read('stars.mjs')) {
  const M = await load('stars.mjs', source), out = {};
  assert.ok(Math.abs(M.growthRate() - 104) < 1e-9, 'S1 radius: the growth rate is not 104 px a second');
  for (const [name, P] of [['top left', [3, 3]], ['top right', [W - 3, 3]], ['bottom left', [3, H - 3]], ['bottom right', [W - 3, H - 3]]]) {
    const F = await fieldFor(M), { hold, frames } = run(F, P, 8), diagonal = Math.hypot(W, H);
    const start = hold.formedAt;
    assert.ok(start !== null && start > 2.5, `S1 radius: the corner hold formed at ${start} s (${name})`);
    let still = null;
    for (const f of frames) {
      if (f.held <= 2.5 + 1e-9) assert.ok(Math.abs(f.radius - M.captureRadius(f.held)) < 1e-9, `S1 radius: ${f.radius} px at ${f.held.toFixed(3)} s is not round 8's (${name})`);
      else if (f.held <= start + 1e-9) {
        assert.ok(Math.abs(f.radius - (340 + 104 * (f.held - 2.5))) < 1e-6, `S1 radius: ${f.radius.toFixed(2)} px at ${f.held.toFixed(3)} s is not 340 + 104 px/s (${name})`);
        if (f.held < start - 1e-9) assert.ok(f.captured < 300, `S1 radius: 300 caught before the formation (${name})`);
      } else {
        // Round 16 (R5): the growth no longer stops at the formation; it goes on at 104 px a second up to the diagonal.
        still ??= frames.find(g => Math.abs(g.held - start) < 1e-9).radius;
        assert.ok(Math.abs(f.radius - Math.min(diagonal, 340 + 104 * (f.held - 2.5))) < 1e-6, `S1 radius: ${f.radius.toFixed(2)} px at ${f.held.toFixed(3)} s after the formation is not 340 + 104 px/s (${name})`);
      }
    }
    assert.ok(still > 340, `S1 radius: the corner radius did not grow past 340 px (${name})`);
    out[name] = { start: +start.toFixed(3), radius: +still.toFixed(1) };
  }
  // The middle: the formation starts before 2.5 s; the radius goes on to 340 px at 2.5 s on round 8's curve, and (round 16,
  // R5) then on at 104 px a second.
  const F = await fieldFor(M), { hold, frames } = run(F, [720, 450], 4);
  assert.ok(hold.formedAt < 2.5, 'S1 radius: the middle hold did not form before 2.5 s');
  for (const f of frames) assert.ok(Math.abs(f.radius - M.captureRadius(f.held) - 104 * Math.max(0, f.held - 2.5)) < 1e-9, `S1 radius: the middle radius left round 8's curve (plus 104 px/s past 2.5 s) at ${f.held.toFixed(3)} s`);
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

// ================================================================ controls
export const ROUND12_CONTROLS = [
  { id: 'S1 back to the 1.4 s start', file: 'stars.mjs', search: '(cluster.size >= STARS.mark.threshold || R >= diagonal)', replacement: '(hold.held >= 1.4)', gate: 'S1 threshold:', run: s => checkThreshold(s) },
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
  const s = await checkS1();
  const corners = Object.entries(s.radius).filter(([k]) => k !== 'small');
  return `S1 threshold: no star given a point before 300 are captured; formation starts with the 300th capture: ${s.threshold.map(t => `${t.name} ${t.at} s (${t.captured} caught, radius ${t.radius} px)`).join(', ')}.
S1 radius: round 8's 80-340 px over 2.5 s, then 340 + 104 px/s until 300 are caught and on past the formation (round 16, R5): ${corners.map(([k, v]) => `${k} forms at ${v.start} s, radius ${v.radius} px`).join('; ')}; the middle keeps round 8's curve to 2.5 s; a ${s.radius.small.stars}-star hero (600 x 400) forms at its ${s.radius.small.diagonal} px diagonal at ${s.radius.small.start} s with ${s.radius.small.captured}; the blast stays 2000/mass at the 2.5 s cap.`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(await checkRound12StarsList());
  if (process.argv.includes('--controls')) console.log('Round 12 (S1) negative controls: ' + await checkRound12Controls());
}
