// Round 14 (CORRECTIONS-14), K1: the craft list's letter roll. Node only, on the pure model in craft-wipe.mjs.
//   node design/journey-hero/take-2/tools/round14-checks.mjs [--controls]
// One change against the timetable, the glyph order, a change during a change with no jump, 01 to 03 touching only its
// two rows, reduced motion, the entrance and the loop's start, the loop's own changes, and the sources (round 12's box gone,
// hard edges only, the view writes only transforms per frame and paints an aria-hidden overlay from measured pen positions).
// The negative controls edit one exact site in memory and must fail at their gate.
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
const ease = EASE.wipe, GLYPH = 0.38, STEP = 0.018, LIFT = 1.1, FPS = 60, DT = 1 / FPS;
const clamp01 = x => Math.min(1, Math.max(0, x));
// The brief's own curve for one glyph, written here independently of the model.
const roll = (from, to, start, t) => { const u = (t - start) / GLYPH; return u <= 0 ? from : u >= 1 - 1e-9 ? to : from + (to - from) * ease(clamp01(u)); };
const grid = (a, b, h) => Array.from({ length: Math.round((b - a) / h) + 1 }, (_, k) => +(a + k * h).toFixed(10));
const near = (a, b, tol, message) => assert.ok(Math.abs(a - b) <= tol, `${message}: ${a} != ${b}`);
const COUNTS = [16, 7, 8, 7];

// The bound for no jump: the most one glyph's roll can move in one 60 fps frame on the eased curve over a full roll (0 to
// 1); a copy moves LIFT times that, in line boxes. Found on a fine grid of frame starts (and checked at its maximum).
export function frameBound() {
  const h = DT / GLYPH;
  let best = 0, at = 0;
  for (let k = 0; k <= 200000; k++) { const u = -h + (1 + h) * k / 200000, d = ease(clamp01(u + h)) - ease(clamp01(u)); if (d > best) { best = d; at = u; } }
  return { roll: best, copy: best * LIFT, at };
}

// ---- the table: the brief's numbers, and each row's glyphs.
export function checkTable(M) {
  assert.deepEqual([M.CRAFT_ROLL.glyph, M.CRAFT_ROLL.step, M.CRAFT_ROLL.lift, M.CRAFT_ROLL.slack], [0.38, 0.018, 1.1, 0.2], 'K1 table: not 0.38 s a glyph, 0.018 s apart, 110 %, 0.2 em slack');
  assert.deepEqual(M.CRAFT_GLYPHS, COUNTS, 'K1 table: the rows do not have 16, 7, 8 and 7 glyphs');
  near(M.rollLength(16), 0.65, 1e-12, 'K1 table: "Graphic design" does not end at 0.65 s');
  const o0 = M.copyOffsets(0), o1 = M.copyOffsets(1);
  assert.ok(o0.out === 0 && o0.in === 1.1 && o1.out === -1.1 && o1.in === 0, 'K1 table: the copies are not at 0/110 % and -110 %/0 at rest');
}

// ---- one change, 01 to 02 at time 0: each glyph's offsets against time, ending exactly at rest.
export function checkOne(M) {
  const m = M.createCraftModel();
  m.set(0);
  assert.deepEqual(m.lit(0), [true, false, false, false], 'K1 one change: 01 is not lit at rest');
  assert.equal(m.change(1, 0), true, 'K1 one change: 01 to 02 is not a change');
  near(m.length, 0.65, 1e-12, 'K1 one change: the change is not 0.65 s long');
  let n = 0;
  for (const t of grid(0, 0.8, 0.0025)) {
    const r = m.rolls(t);
    for (const [row, from, to] of [[0, 1, 0], [1, 0, 1]]) r[row].forEach((s, i) => {
      near(s, roll(from, to, i * STEP, t), 1e-12, `K1 one change: row 0${row + 1} glyph ${i} at ${t.toFixed(4)} s`);
      const o = M.copyOffsets(s);
      near(o.out, -LIFT * s, 1e-12, 'K1 one change: the out copy'); near(o.in, LIFT * (1 - s), 1e-12, 'K1 one change: the in copy');
      n++;
    });
    for (const row of [2, 3]) assert.ok(r[row].every(s => s === 0), `K1 one change: row 0${row + 1} moved`);
  }
  // Exactly at rest: 02's last glyph lands at 0.38 + 6 x 0.018 = 0.488 s, 01's at 0.65 s.
  assert.ok(m.rolls(0.488)[1].every(s => s === 1), 'K1 one change: 02 not exactly in at 0.488 s');
  assert.ok(m.rolls(0.65)[0].every(s => s === 0), 'K1 one change: 01 not exactly out at 0.65 s');
  assert.equal(m.busy(0.6499), true, 'K1 one change: over before 0.65 s');
  assert.equal(m.busy(0.65), false, 'K1 one change: still busy at 0.65 s');
  assert.deepEqual(m.lit(0.65), [false, true, false, false], 'K1 one change: not at rest on 02');
  // A finished change can still be held (__hero.crafts(p) reads the model at change + p x its length).
  m.rolls(0.65 * 0.4).forEach((row, i) => row.forEach((s, k) => near(s, i === 0 ? roll(1, 0, k * STEP, 0.26) : i === 1 ? roll(0, 1, k * STEP, 0.26) : 0, 1e-12, 'K1 one change: a finished change cannot be held at p 0.4')));
  return n;
}

// ---- the order: glyph i starts i x 0.018 s after the change; digits (0, 1) lead, then the label left to right.
export function checkOrder(M) {
  const m = M.createCraftModel();
  m.set(1); m.change(0, 0);
  const starts = [];
  for (const [row, n] of [[0, 16], [1, 7]]) for (let i = 0; i < n; i++) {
    const rest = row === 0 ? 0 : 1, at = i * STEP;
    // Still at its rest through its own delay, moving 1 ms after it.
    for (const t of [...grid(0, Math.max(0, at - 0.001), 0.001), Math.max(0, at - 1e-9)]) assert.equal(m.rolls(t)[row][i], rest, `K1 order: row 0${row + 1} glyph ${i} moves at ${t.toFixed(3)} s, before its start at ${at.toFixed(3)} s`);
    assert.notEqual(m.rolls(at + 0.001)[row][i], rest, `K1 order: row 0${row + 1} glyph ${i} has not started 1 ms after ${at.toFixed(3)} s`);
    if (row === 0) starts.push(at);
  }
  // So the roll sweeps left to right: at every moment glyph i is at least as far along as glyph i + 1, strictly while both move.
  for (const t of grid(0.001, 0.649, 0.001)) {
    const r = m.rolls(t)[0];
    for (let i = 0; i + 1 < r.length; i++) {
      assert.ok(r[i] >= r[i + 1] - 1e-12, `K1 order: glyph ${i + 1} ahead of glyph ${i} at ${t.toFixed(3)} s`);
      if (t > (i + 1) * STEP && t < i * STEP + GLYPH) assert.ok(r[i] > r[i + 1], `K1 order: glyphs ${i} and ${i + 1} together at ${t.toFixed(3)} s`);
    }
  }
  return starts;
}

// ---- a change during a change, 0.2 s into 01 to 02 (02 to 03): no copy moves more than the curve allows in one frame,
// 02 rolls back from where it got to, 01 goes on rolling out on its own timetable, and every row ends at rest.
export function checkDuring(M, bound = frameBound()) {
  let worst = 0, frames = 0;
  // Several frame phases, so the second change falls on a frame and between frames.
  for (const phase of [0, 0.25, 0.5, 0.75]) {
    const m = M.createCraftModel(), times = grid(0, 1.2, DT).map(t => t + phase * DT);
    m.set(0); m.change(1, 0);
    const before = m.rolls(0.2);
    let prev = null, changed = false;
    for (const t of times) {
      if (!changed && t >= 0.2) { m.change(2, 0.2); changed = true; }
      const r = m.rolls(t);
      if (prev) r.forEach((row, i) => row.forEach((s, k) => {
        const d = Math.abs(s - prev[i][k]) * LIFT;
        worst = Math.max(worst, d);
        assert.ok(d <= bound.copy + 1e-6, `K1 no jump: row 0${i + 1} glyph ${k}'s copies move ${d.toFixed(4)} line boxes in one frame at ${t.toFixed(4)} s, more than the curve's ${bound.copy.toFixed(4)}`);
      }));
      // The list never shows two rows lit.
      assert.ok(m.lit(t).filter(Boolean).length <= 1, `K1 during: two rows lit at ${t.toFixed(3)} s`);
      prev = r; frames++;
    }
    // And at the change itself: every glyph is exactly where it was the instant before.
    const c = M.createCraftModel();
    c.set(0); c.change(1, 0);
    const pre = c.rolls(0.2);
    c.change(2, 0.2);
    c.rolls(0.2).forEach((row, i) => row.forEach((s, k) => assert.ok(Math.abs(s - pre[i][k]) < 1e-12, `K1 no jump: row 0${i + 1} glyph ${k} jumps from ${pre[i][k].toFixed(4)} to ${s.toFixed(4)} at the second change`)));
    // 02's glyphs roll back from where they were at 0.2 s, each on its own delay; 03 rolls in; 01 keeps its timetable.
    for (const t of grid(0.2, 1, 0.005)) {
      const r = m.rolls(t);
      r[1].forEach((s, k) => near(s, roll(before[1][k], 0, 0.2 + k * STEP, t), 1e-12, `K1 during: 02 glyph ${k} does not roll back from where it got to at ${t.toFixed(3)} s`));
      r[2].forEach((s, k) => near(s, roll(0, 1, 0.2 + k * STEP, t), 1e-12, `K1 during: 03 glyph ${k} at ${t.toFixed(3)} s`));
      r[0].forEach((s, k) => near(s, roll(1, 0, k * STEP, t), 1e-12, `K1 during: 01 glyph ${k} left its own timetable at ${t.toFixed(3)} s`));
    }
    assert.equal(m.busy(0.2 + M.rollLength(8)), false, 'K1 during: not over when 03 is in');
    assert.deepEqual(m.rolls(0.8).map((r, i) => r.every(s => s === (i === 2 ? 1 : 0))), [true, true, true, true], 'K1 during: a row is not at rest at 0.8 s');
    assert.deepEqual(m.lit(0.8), [false, false, true, false], 'K1 during: not at rest on 03');
  }
  // Back again, 01 to 02 then 02 to 01 at 0.15 s: 01 rolls back in from where it got to; 02 back out.
  const b = M.createCraftModel();
  b.set(0); b.change(1, 0);
  const mid = b.rolls(0.15);
  b.change(0, 0.15);
  for (const t of grid(0.15, 0.9, 0.005)) b.rolls(t)[0].forEach((s, k) => near(s, roll(mid[0][k], 1, 0.15 + k * STEP, t), 1e-12, `K1 during: going back, 01 glyph ${k} at ${t.toFixed(3)} s`));
  assert.deepEqual(b.lit(0.9), [true, false, false, false], 'K1 during: going back does not rest on 01');
  return { worst, frames };
}

// ---- 01 to 03 (a click) touches only rows 01 and 03, from the craft actually current.
export function checkClick(M) {
  const m = M.createCraftModel(), starts = SHOW.map((_, i) => SHOW.slice(0, i).reduce((n, s) => n + s.len, 0));
  let clock = 10;
  M.followCraft(m, sceneAt(3.0).scene.craft, clock);
  assert.equal(m.current, 0, 'K1 click: the loop at 3 s is on 01');
  clock += 2;
  const t = starts[SHOW.findIndex(s => s.craft === 2)];
  assert.equal(M.followCraft(m, sceneAt(t).scene.craft, clock), 'change', 'K1 click: 01 to 03 is not a change');
  assert.deepEqual(m.touched(), [true, false, true, false], 'K1 click 01 to 03: touches rows other than 01 and 03');
  for (const at of grid(clock, clock + 0.8, 0.005)) {
    const r = m.rolls(at);
    assert.ok(r[1].every(s => s === 0) && r[3].every(s => s === 0), `K1 click 01 to 03: 02 or 04 moved at ${(at - clock).toFixed(3)} s`);
    r[0].forEach((s, k) => near(s, roll(1, 0, clock + k * STEP, at), 1e-12, `K1 click 01 to 03: 01 does not roll out from in at ${(at - clock).toFixed(3)} s`));
  }
  assert.deepEqual(m.lit(clock + 0.65), [false, false, true, false], 'K1 click 01 to 03: not at rest on 03');
}

// ---- reduced motion cuts at once (also when it comes on mid-change).
export function checkReduced(M) {
  const m = M.createCraftModel();
  M.followCraft(m, 0, 0, { reduced: true });
  assert.equal(M.followCraft(m, 1, 1, { reduced: true }), 'set', 'K1 reduced: a change is not a cut');
  assert.ok(!m.busy(1) && m.lit(1).join() === 'false,true,false,false' && m.changes === 0, 'K1 reduced: not at rest at once');
  const b = M.createCraftModel();
  M.followCraft(b, 0, 0); M.followCraft(b, 1, 5); M.followCraft(b, 1, 5.2, { reduced: true });
  assert.ok(!b.busy(5.2) && b.lit(5.2).join() === 'false,true,false,false', 'K1 reduced: switching on mid-change does not cut to rest');
}

// ---- the entrance and the loop's first start make no change; the loop's own changes, with the wrap from 04 to 01.
export function checkLoop(M) {
  const m = M.createCraftModel();
  let clock = 0;
  for (let time = 0; time <= ENTRANCE.end + 1e-9; time += 1 / 60) { M.followCraft(m, sceneAt(loopAt(time)).scene.craft, clock, { cut: true }); clock += 1 / 60; }
  assert.ok(m.current === sceneAt(0).scene.craft && m.changes === 0 && m.lit(clock).join() === 'true,false,false,false', 'K1 entrance: the entrance made a change or left the wrong row lit');
  const seen = [];
  let t = loopAt(ENTRANCE.end), prev = m.current;
  for (let k = 0; k < Math.ceil(LOOP * 60) + 120; k++) {
    t = ((t + 1 / 60) % LOOP + LOOP) % LOOP; clock += 1 / 60;
    const did = M.followCraft(m, sceneAt(t).scene.craft, clock);
    if (k === 0) assert.equal(did, '', 'K1 loop: the loop\'s first frame after the entrance is a change');
    if (did === 'change') { seen.push([prev, m.current, t]); prev = m.current; }
    assert.ok(m.lit(clock).filter(Boolean).length <= 1, 'K1 loop: two rows lit');
  }
  assert.deepEqual(seen.map(s => s.slice(0, 2)), [[0, 1], [1, 2], [2, 3], [3, 0]], `K1 loop: the loop's changes are ${JSON.stringify(seen)}`);
  return seen;
}

// ---- the sources: round 12's box is gone; hard edges only; the view writes only transforms per frame.
export function checkSources(view = read('craft-wipe.mjs'), css = read('take-2.css'), player = read('play.mjs')) {
  assert.ok(!/is-selected|--sl\b|--sr\b|--st\b|--sb\b|--sel-|entranceParts|is-lit/.test(css + view), 'K1 sources: round 12\'s selection box is still there');
  assert.ok(!css.includes('is-wiped') && !/li::before/.test(css), 'K1 sources: round 11\'s rule is still in take-2.css');
  const block = css.slice(css.indexOf('/* Round 14, K1'));
  assert.ok(css.indexOf('/* Round 14, K1') > 0, 'K1 sources: no round 14 block in take-2.css');
  const rules = block.replace(/\/\*[\s\S]*?\*\//g, '');
  assert.ok(!/transition|opacity|animation|filter|blur|border-radius/.test(rules), 'K1 sources: the roll has a fade, a blur or a transition');
  assert.ok(/\.craft-g \{[^}]*overflow: hidden;/.test(rules) && /-webkit-text-fill-color: transparent;/.test(rules) && /\.craft-i \{[^}]*translateY\(110%\)/.test(rules), 'K1 sources: no hard mask, the flow text is not painted transparent, or the in copy does not wait below');
  // Only paint and absolute boxes: no padding, margin, gap, font or size on the list or its rows.
  const props = [...rules.matchAll(/^\s*([a-z-]+):(?!:)/gm)].map(m => m[1]);
  const allowed = ['position', 'color', '-webkit-text-fill-color', 'inset', 'display', 'pointer-events', 'user-select', 'overflow', 'top', 'height', 'white-space', 'content', 'transform'];
  assert.ok(props.every(p => allowed.includes(p)), `K1 sources: a layout property is written (${props.filter(p => !allowed.includes(p)).join(', ')})`);
  const page = view.slice(view.indexOf('// ---- the page'));
  assert.ok(page.includes("setAttribute('aria-hidden', 'true')") && page.includes('range.setStart(g.text, g.index)') && !/textContent\s*=|innerHTML|createTextNode|splitText|\.data\s*=/.test(page), 'K1 sources: the overlay is not aria-hidden, not placed from the flow text\'s ranges, or the flow text is touched');
  // Per frame (paint) only the copies' transform; boxes only in measure.
  const paint = page.slice(page.indexOf('function paint()'), page.indexOf('function wake()'));
  const writes = [...paint.matchAll(/\.style\.(\w+)/g)].map(m => m[1]);
  assert.ok(writes.length && writes.every(w => w === 'transform') && !/getBoundingClientRect|getComputedStyle/.test(paint), `K1 sources: a frame writes ${writes.join(', ')} or reads layout`);
  assert.ok(player.includes('craftWipe.follow(scene.craft, { cut: !!intro });') && player.includes('crafts: p => craftWipe.hold(p)') && player.includes('get craftWipe() { return craftWipe.state; }'), 'K1 sources: the player does not hand the list its craft, or __hero.crafts / __hero.craftWipe is gone');
  return writes.length;
}

export async function checkK1(source = read('craft-wipe.mjs')) {
  const M = await load('craft-wipe.mjs', source), bound = frameBound();
  checkTable(M);
  const n = checkOne(M), starts = checkOrder(M), during = checkDuring(M, bound);
  checkClick(M); checkReduced(M);
  const seen = checkLoop(M), writes = checkSources(source);
  return { n, starts, during, bound, seen, writes };
}

// ================================================================ controls
export const ROUND14_CONTROLS = [
  { id: 'K1 every glyph together', search: 'return { from, to: target, start: time + k * T.step };', replacement: 'return { from, to: target, start: time };', gate: 'K1 order:', run: M => checkOrder(M) },
  { id: 'K1 restart from rest', search: 'const from = at(g, time);', replacement: 'const from = 1 - target;', gate: 'K1 no jump:', run: M => checkDuring(M) },
];
export async function checkRound14Controls() {
  const out = [], source = read('craft-wipe.mjs');
  for (const c of ROUND14_CONTROLS) {
    assert.equal(source.split(c.search).length - 1, 1, `round 14 control ${c.id} must match one site`);
    let message = '';
    try { c.run(await load('craft-wipe.mjs', source.replace(c.search, c.replacement))); } catch (error) { message = error.message; }
    assert.ok(message.startsWith(c.gate), `round 14 control ${c.id} not caught at ${c.gate} (${message || 'passed'})`);
    out.push(`${c.id} caught: ${message.split('\n')[0]}`);
  }
  return out.join('; ');
}

export async function checkRound14() {
  const k = await checkK1();
  return `K1 letter roll: one change 01 to 02 checked at ${k.n} glyph samples against 0.38 s EASE.wipe per glyph, exactly at rest (02 in at 0.488 s, 01 out at 0.650 s); glyph i starts at i x 0.018 s (${k.starts.length} glyphs of 01, digits first, then the label left to right); a change 0.2 s in (02 to 03), ${k.during.frames} frames at 60 fps over four phases: the largest copy step ${k.during.worst.toFixed(4)} line boxes per frame, within the curve's bound of ${k.bound.copy.toFixed(4)} (EASE.wipe's steepest 1/60 s step is ${k.bound.roll.toFixed(4)} of a roll, at u ${k.bound.at.toFixed(3)}, x 1.1); 02 rolls back from where it got to, every row at rest, never two rows lit; 01 to 03 touches only 01 and 03; reduced motion cuts; the entrance and the loop's first start make no change; the loop changes ${k.seen.map(([a, b, t]) => `${a + 1}>${b + 1} at ${t.toFixed(3)}`).join(', ')} s; a frame writes only the copies' transform.`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(await checkRound14());
  if (process.argv.includes('--controls')) console.log('Round 14 (K1) negative controls: ' + await checkRound14Controls());
}
