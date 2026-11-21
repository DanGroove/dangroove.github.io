// Round 11 (CORRECTIONS-11, C1): the craft list changes with a wipe. Node only, on the pure model in craft-wipe.mjs.
//   node design/journey-hero/take-2/tools/round11-checks.mjs [--controls]
// The negative control edits one exact site in memory (where a change takes its "from" row) and must fail at its gate.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { EASE } from '../../../../public/journey/hero/engine.mjs';
import { SHOW, LOOP, sceneAt } from '../stage.mjs';
import { ENTRANCE, loopAt } from '../entrance.mjs';

const TAKE = new URL('../', import.meta.url);
const read = name => fs.readFileSync(new URL(name, TAKE), 'utf8');
async function load(name, source = read(name)) {
  const url = new URL(name, TAKE);
  const fixed = source.replace(/from (['"])(\.{1,2}\/[^'"]+)\1/g, (_all, _quote, ref) => `from '${new URL(ref, url).href}'`);
  return import('data:text/javascript;base64,' + Buffer.from(fixed).toString('base64'));
}
const DT = 0.005, EPS = 1e-12;
const same = (a, b, message) => { assert.ok(Math.abs(a[0] - b[0]) <= EPS && Math.abs(a[1] - b[1]) <= EPS, `${message}: ${JSON.stringify(a)} != ${JSON.stringify(b)}`); };
const rest = (craft, n = 4) => Array.from({ length: n }, (_, i) => (i === craft ? [0, 1] : [0, 0]));
const samples = (from, to) => Array.from({ length: Math.round((to - from) / DT) + 1 }, (_, k) => from + k * DT);
const full = s => s[0] === 0 && s[1] === 1;
// Geometry of a 1440 x 900 row: 380 px wide, number box to 33.3 px, word from 47.3 px (rounded from the page).
const ROW = { w: 380, numberRight: 33.3, wordLeft: 47.3 };

// ---- one change, 0 to 1 at time 0: every row against the timetable, ending exactly at rest.
export function checkOne(M) {
  const W = M.CRAFT_WIPE;
  assert.deepEqual([W.clear, W.delay, W.draw, W.total], [0.35, 0.1, 0.4, 0.5], 'C1 timing: 0.35 s clear, 0.1 s delay, 0.4 s draw, 0.5 s in all');
  const m = M.createCraftModel();
  m.set(0);
  assert.equal(m.change(1, 0), true, 'C1 one change: 0 to 1 is a change');
  let n = 0, lastClear = -1, lastDraw = -1;
  for (const t of samples(0, 0.7)) {
    const s = m.spans(t), u = Math.min(1, Math.max(0, t / 0.35)), v = Math.min(1, Math.max(0, (t - 0.1) / 0.4));
    same(s[0], t >= 0.35 ? [0, 0] : EASE.wipe(u) >= 1 ? [0, 0] : [EASE.wipe(u), 1], `C1 one change: row 0 at ${t.toFixed(3)} s`);
    same(s[1], t >= 0.5 ? [0, 1] : t <= 0.1 ? [0, 0] : [0, EASE.wipe(v)], `C1 one change: row 1 at ${t.toFixed(3)} s`);
    same(s[2], [0, 0], 'C1 one change: row 2 untouched'); same(s[3], [0, 0], 'C1 one change: row 3 untouched');
    // The rule and the text share the span, so one front: the clearing front only moves right, the drawing front only right.
    if (s[0][1] > 0) { assert.ok(s[0][0] >= lastClear - EPS, 'C1 one change: the clearing front went back'); lastClear = s[0][0]; }
    if (s[1][1] > 0) { assert.ok(s[1][1] >= lastDraw - EPS, 'C1 one change: the drawing front went back'); lastDraw = s[1][1]; }
    assert.ok(s.filter(full).length <= 1, `C1 one change: two rows current at ${t.toFixed(3)} s`);
    // The word's hard stops are the same front in the word's own px.
    const st = M.rowStyle(s[1], ROW);
    assert.ok(Math.abs(st.xb - (s[1][1] * ROW.w - ROW.wordLeft)) < 1e-9 && st.wa === s[1][0] && st.wb === s[1][1], 'C1 one change: rule and text fronts differ');
    n++;
  }
  assert.equal(m.busy(0.4999), true, 'C1 one change: over before 0.5 s');
  assert.equal(m.busy(0.5), false, 'C1 one change: still busy at 0.5 s');
  m.spans(0.5).forEach((s, i) => assert.deepEqual(s, rest(1)[i], 'C1 one change: not exactly at rest at 0.5 s'));
  return n;
}

// ---- the number cuts when the front passes its right edge, in both rows.
export function checkNumber(M) {
  const m = M.createCraftModel(), at = ROW.numberRight / ROW.w;
  m.set(0); m.change(1, 0);
  let on = null, off = null, prev = [true, false];
  for (const t of samples(0, 0.6)) {
    const s = m.spans(t), lit = [M.rowStyle(s[0], ROW).lit, M.rowStyle(s[1], ROW).lit];
    assert.equal(lit[0], s[0][1] > s[0][0] && s[0][0] < at, `C1 number: old row's number not cut with the front at ${t.toFixed(3)} s`);
    assert.equal(lit[1], s[1][1] >= at, `C1 number: new row's number not cut with the front at ${t.toFixed(3)} s`);
    if (prev[0] && !lit[0]) off = t;
    if (!prev[1] && lit[1]) on = t;
    assert.ok(!(lit[0] !== prev[0] && lit[0]) && !(lit[1] !== prev[1] && !lit[1]), 'C1 number: a number cut back');
    prev = lit;
  }
  assert.ok(off > 0 && off < 0.35 && on > 0.1 && on < 0.5, `C1 number: cuts at ${off} s (off) and ${on} s (on)`);
  // A cut, not a fade: the state is a boolean and flips once each.
  return { off, on };
}

// ---- a second change 0.2 s into the first: 0 to 1 at 0, 1 to 2 at 0.2.
export function checkSecond(M) {
  const m = M.createCraftModel();
  m.set(0); m.change(1, 0);
  const f1 = EASE.wipe(0.1 / 0.4);
  same(m.spans(0.2)[1], [0, f1], 'C1 second change: row 1 at 0.2 s');
  m.change(2, 0.2);
  for (const t of samples(0.2, 0.9)) {
    const s = m.spans(t), u = (t - 0.2) / 0.35;
    same(s[0], t >= 0.35 ? [0, 0] : [EASE.wipe(t / 0.35), 1], `C1 second change: row 0 does not finish clearing at ${t.toFixed(3)} s`);
    const g = EASE.wipe(Math.min(1, Math.max(0, u)));
    same(s[1], u >= 1 || g >= f1 ? [0, 0] : [Math.max(0, g), f1], `C1 second change: row 1 does not clear from where it was at ${t.toFixed(3)} s`);
    const v = Math.min(1, Math.max(0, (t - 0.3) / 0.4));
    same(s[2], t >= 0.7 ? [0, 1] : t <= 0.3 ? [0, 0] : [0, EASE.wipe(v)], `C1 second change: row 2 does not draw from the start at ${t.toFixed(3)} s`);
    same(s[3], [0, 0], 'C1 second change: row 3 touched');
    assert.ok(s.filter(full).length <= 1, `C1 second change: two rows current at ${t.toFixed(3)} s`);
  }
  assert.equal(m.busy(0.7), false, 'C1 second change: not over 0.5 s after the second change');
  m.spans(0.7).forEach((s, i) => assert.deepEqual(s, rest(2)[i], 'C1 second change: not at rest with only row 2'));
  // Back to a row still clearing: it draws from the start, and nothing ever rests with two rows.
  const b = M.createCraftModel();
  b.set(0); b.change(1, 0); b.change(0, 0.15);
  for (const t of samples(0.15, 0.8)) assert.ok(b.spans(t).filter(full).length <= 1, 'C1 second change: two rows current going back');
  same(b.spans(0.15)[0], [0, 0], 'C1 second change: the newest row (still clearing) does not draw from the start');
  b.spans(0.65).forEach((s, i) => assert.deepEqual(s, rest(0)[i], 'C1 second change: back to 0 is not at rest'));
}

// ---- a click from 01 to 03 touches only those two rows. The player's own path: the loop is on scene ps (craft 0), the
// click sets t to the first ae scene; followCraft sees craft 2.
export function checkClick(M) {
  const m = M.createCraftModel(), starts = SHOW.map((_, i) => SHOW.slice(0, i).reduce((n, s) => n + s.len, 0));
  let clock = 10;
  M.followCraft(m, sceneAt(3.0).scene.craft, clock);
  assert.equal(m.current, 0, 'C1 click: the loop at 3 s is on 01');
  clock += 2;
  const t = starts[SHOW.findIndex(s => s.craft === 2)];
  assert.equal(M.followCraft(m, sceneAt(t).scene.craft, clock), 'change', 'C1 click: 01 to 03 is not a change');
  let touchedZero = false, touchedTwo = false;
  for (const at of samples(clock, clock + 0.6)) {
    const s = m.spans(at);
    same(s[1], [0, 0], `C1 click 01 to 03: row 02 touched at +${(at - clock).toFixed(3)} s`);
    same(s[3], [0, 0], `C1 click 01 to 03: row 04 touched at +${(at - clock).toFixed(3)} s`);
    if (s[0][1] > 0 && s[0][0] > 0) touchedZero = true;
    if (s[2][1] > 0 && s[2][1] < 1) touchedTwo = true;
  }
  assert.ok(touchedZero && touchedTwo, 'C1 click 01 to 03: 01 does not clear or 03 does not draw');
  m.spans(clock + 0.5).forEach((s, i) => assert.deepEqual(s, rest(2)[i], 'C1 click 01 to 03: not at rest on 03'));
}

// ---- reduced motion cuts at once; and the cut is used mid-change if reduced motion switches on.
export function checkReduced(M) {
  const m = M.createCraftModel();
  M.followCraft(m, 0, 0, { reduced: true });
  assert.equal(M.followCraft(m, 1, 1, { reduced: true }), 'set', 'C1 reduced: a change is not a cut');
  m.spans(1).forEach((s, i) => assert.deepEqual(s, rest(1)[i], 'C1 reduced: not at rest at once'));
  assert.equal(m.busy(1), false, 'C1 reduced: busy after a cut');
  const b = M.createCraftModel();
  M.followCraft(b, 0, 0); M.followCraft(b, 1, 5);
  M.followCraft(b, 1, 5.2, { reduced: true });
  b.spans(5.2).forEach((s, i) => assert.deepEqual(s, rest(1)[i], 'C1 reduced: switching on mid-change does not cut to rest'));
}

// ---- the entrance and the first loop start are no change; the loop's own changes are 44.285, 60.967, 76.049 and the wrap.
export function checkLoop(M) {
  const m = M.createCraftModel();
  let clock = 0;
  for (let time = 0; time <= ENTRANCE.end + 1e-9; time += 1 / 60) { M.followCraft(m, sceneAt(loopAt(time)).scene.craft, clock, { cut: true }); clock += 1 / 60; }
  assert.equal(m.current, sceneAt(0).scene.craft, 'C1 entrance: the entrance does not set the loop start\'s craft');
  assert.equal(m.changes, 0, 'C1 entrance: the entrance made a change');
  m.spans(clock).forEach((s, i) => assert.deepEqual(s, rest(0)[i], 'C1 entrance: the current row is not at rest after the entrance'));
  // The loop: one pass from where the entrance left it, then the wrap.
  const seen = [];
  let t = loopAt(ENTRANCE.end), prev = m.current;
  for (let k = 0; k < Math.ceil(LOOP * 60) + 120; k++) {
    t = ((t + 1 / 60) % LOOP + LOOP) % LOOP; clock += 1 / 60;
    if (M.followCraft(m, sceneAt(t).scene.craft, clock) === 'change') { seen.push([prev, m.current, t]); prev = m.current; }
    if (seen.length === 0) assert.equal(m.changes, 0, `C1 entrance: a change before 44.285 s (at ${t.toFixed(3)} s)`);
  }
  const want = [[0, 1, 44.285], [1, 2, 60.967], [2, 3, 76.049], [3, 0, 0]];
  assert.equal(seen.length, 4, `C1 loop: ${seen.length} changes in one pass and the wrap`);
  seen.forEach(([a, b, at], i) => {
    assert.deepEqual([a, b], want[i].slice(0, 2), `C1 loop: change ${i} is ${a} to ${b}`);
    assert.ok(Math.abs(at - want[i][2]) < 0.02 || (want[i][2] === 0 && at < 0.02), `C1 loop: change ${i} at ${at.toFixed(3)} s`);
  });
  return seen;
}

export async function checkRound11(source = read('craft-wipe.mjs')) {
  const M = await load('craft-wipe.mjs', source);
  const n = checkOne(M), cut = checkNumber(M);
  checkClick(M); checkSecond(M); checkReduced(M);
  const seen = checkLoop(M);
  return `C1 wipe: one change sampled ${n} times at ${DT} s: 01 clears [front, 1] in 0.35 s and 02 draws [0, front] from 0.1 s to 0.5 s with EASE.wipe, exactly at rest at 0.5 s; the numbers cut at +${cut.off.toFixed(3)} s (off) and +${cut.on.toFixed(3)} s (on) as the front passes their right edge; a second change at 0.2 s lets 01 finish, clears 02 from where it was and draws 03 from the start, at rest on 03 alone at 0.7 s; a click 01 to 03 leaves 02 and 04 untouched; reduced motion cuts at once; the entrance is no change, and the loop changes ${seen.map(([a, b, t]) => `${a + 1}>${b + 1} at ${t.toFixed(3)}`).join(', ')} s.`;
}

const ROUND11_CONTROLS = [
  { id: 'from-previous-scene', file: 'craft-wipe.mjs', search: 'const from = current;', replacement: 'const from = (to + count - 1) % count; // the loop\'s previous scene', gate: 'C1 click 01 to 03' },
];
export async function checkRound11Controls() {
  const out = [];
  for (const c of ROUND11_CONTROLS) {
    const source = read(c.file);
    assert.equal(source.split(c.search).length - 1, 1, `round 11 control ${c.id} must match one site`);
    let message = '';
    try { await checkRound11(source.replace(c.search, c.replacement)); } catch (error) { message = error.message; }
    assert.ok(message.startsWith(c.gate), `round 11 control ${c.id} not caught at ${c.gate} (${message || 'passed'})`);
    out.push(`${c.id} caught: ${message.split('\n')[0]}`);
  }
  return out.join('; ');
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(await checkRound11());
  if (process.argv.includes('--controls')) console.log('Round 11 negative controls: ' + await checkRound11Controls());
}
