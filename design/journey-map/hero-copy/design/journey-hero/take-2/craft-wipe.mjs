// Round 14 (K1): the craft list's current row rolls its letters up into place. It replaces round 12's selection box (L2),
// which replaced round 11's red rule (C1). Every glyph of a row (the two digits of its number, then each letter of its
// label, spaces included) has two copies stacked in a hard mask the height of the line box: the out copy (the row's colour
// when not current: muted, or paper under hover) and the in copy (paper for the label, red for the number). A glyph's roll
// takes the out copy up by 110 % of the line box and brings the in copy up from 110 % below to 0; rolling back out is the
// same in reverse. Each glyph takes 0.38 s with EASE.wipe and glyph i starts i x 0.018 s after the change, so the roll sweeps
// the row left to right. A change during a change sends each glyph of a row whose target changed on from where it is, on
// the same timetable. Nothing fades. Pure model first (checked in Node), then the page view, which paints an aria-hidden
// overlay of the same glyphs at pen positions measured from the flow text (as name-react.mjs does for the name), so the
// font's kerning and the 0.12 em tracking are kept and no layout number moves. It runs on its own clock, not the loop's.
// (The file keeps round 11's name and its seams, createCraftModel, followCraft and createCraftWipe, for the player and the
// stand-ins in checks.mjs, entrance-checks.mjs and round8-checks.mjs.)
import { EASE } from '../../../public/journey/hero/engine.mjs';

// glyph: seconds per glyph; step: seconds between glyph starts; lift: the copies' travel in line boxes; slack: the mask's
// room left and right of a glyph, in ems.
export const CRAFT_ROLL = { glyph: 0.38, step: 0.018, lift: 1.1, slack: 0.2 };
// The four rows' glyphs: two digits, then the label's letters (spaces included). The view counts its own from the page.
export const CRAFT_TEXT = [['01', 'Graphic design'], ['02', 'Video'], ['03', 'Motion'], ['04', 'UX/UI']];
export const CRAFT_GLYPHS = CRAFT_TEXT.map(([n, label]) => n.length + label.length);
// How long a row of n glyphs takes to roll: the last glyph's start plus one glyph ("Graphic design": 0.38 + 15 x 0.018).
export const rollLength = n => (n > 0 ? CRAFT_ROLL.glyph + (n - 1) * CRAFT_ROLL.step : 0);
// A glyph's two copies for its roll s (0: out at rest, 1: in at rest), as fractions of the line box (down is positive).
export const copyOffsets = s => ({ out: -CRAFT_ROLL.lift * s, in: CRAFT_ROLL.lift * (1 - s) });

const clamp01 = x => Math.min(1, Math.max(0, x));
// Within a nanosecond of its end a glyph is home, so sums of the timetable's decimals end exactly on time.
const DONE = 1 - 1e-9;

export function createCraftModel({ counts = CRAFT_GLYPHS, ease = EASE.wipe } = {}) {
  const T = CRAFT_ROLL;
  let current = null, latest = null, length = 0, changes = 0, rows = [], touched = [];
  // Each row: its target (1 current, 0 not) and each glyph's roll { from, to, start } (static when start is null).
  const still = s => ({ from: s, to: s, start: null });
  function build(list) { rows = list.map(n => ({ target: 0, glyphs: Array.from({ length: n }, () => still(0)) })); }
  build(counts);
  function at(g, time) {
    if (g.start === null) return g.to;
    const u = (time - g.start) / T.glyph;
    if (u <= 0) return g.from;
    if (u >= DONE) return g.to;
    return g.from + (g.to - g.from) * ease(clamp01(u));
  }
  // Each row's glyphs' rolls at `time`, 0 (out) to 1 (in).
  const rollsAt = time => rows.map(r => r.glyphs.map(g => at(g, time)));
  // Rest every row at once on `craft`, with no roll: the first frame, the entrance, reduced motion, a new page geometry.
  function set(craft) {
    current = craft;
    rows.forEach((r, i) => { r.target = i === craft ? 1 : 0; r.glyphs = r.glyphs.map(() => still(r.target)); });
    touched = rows.map(() => false);
  }
  // A change at `time` on this model's clock: the new row rolls in and the old one rolls out, both at once, each glyph from
  // where it is. A row whose target does not change (one still rolling out from an earlier change) keeps its own timetable.
  function change(to, time) {
    if (to === current) return false;
    if (current === null) { set(to); return false; }
    length = 0; touched = rows.map(() => false);
    rows.forEach((r, i) => {
      const target = i === to ? 1 : 0;
      if (target === r.target) return;
      touched[i] = true;
      r.glyphs = r.glyphs.map((g, k) => {
        const from = at(g, time);
        return { from, to: target, start: time + k * T.step };
      });
      r.target = target;
      length = Math.max(length, rollLength(r.glyphs.length));
    });
    current = to; latest = time; changes++;
    return true;
  }
  const moving = (g, time) => g.start !== null && (time - g.start) / T.glyph < DONE;
  const busy = time => rows.some(r => r.glyphs.some(g => moving(g, time)));
  // A finished change keeps its schedules (each glyph is exactly at its target from its end on), so __hero.crafts(p) can
  // still hold it; the next change or cut replaces them.
  // The page's own glyph counts (from its text); the rows rest on the current craft.
  function setCounts(list) {
    if (list.length === rows.length && list.every((n, i) => n === rows[i].glyphs.length)) return;
    build(list);
    if (current !== null) set(current);
  }
  return {
    set, change, busy, setCounts, rolls: rollsAt,
    // Which rows the latest change rolls (its old and new rows).
    touched: () => touched.slice(),
    // A row is lit when every one of its glyphs is wholly in.
    lit: time => rollsAt(time).map(r => r.length > 0 && r.every(s => s === 1)),
    get counts() { return rows.map(r => r.glyphs.length); }, get current() { return current; }, get latest() { return latest; },
    get length() { return length; }, get changes() { return changes; },
  };
}

// The player's rule for each frame: the entrance (and the first frame) set; reduced motion cuts; anything else is a change.
// Returns 'change', 'set' (a cut to rest) or '' (nothing to do).
export function followCraft(model, craft, time, { cut = false, reduced = false } = {}) {
  if (craft === model.current) { if ((reduced || cut) && model.busy(time)) { model.set(craft); return 'set'; } return ''; }
  if (model.current === null || cut || reduced) { model.set(craft); return 'set'; }
  return model.change(craft, time) ? 'change' : '';
}

// ---- the page
// Per frame the view writes only `transform` on the glyph copies; geometry (each mask's left, top, width and height, from
// the flow text's own pen positions) is written on measure (start, resize, fonts, the phone grid switching).
const shift = v => (Math.abs(v) < 1e-9 ? 'none' : `translateY(${(v * 100).toFixed(3)}%)`);
export function createCraftWipe(hero, { reduced, win = hero.ownerDocument.defaultView, raf = f => win.requestAnimationFrame(f), cancel = id => win.cancelAnimationFrame(id), now = () => win.performance.now() / 1000 } = {}) {
  const doc = hero.ownerDocument, list = hero.querySelector('[data-crafts]');
  // Each row: its button, its two flow spans' text nodes, and its overlay of glyph masks (built once, from the flow text).
  const rows = [...list.querySelectorAll('li')].map(li => {
    const button = li.querySelector('button'), number = button.querySelector('.n'), label = number.nextElementSibling;
    button.querySelector('.craft-roll')?.remove();
    const fx = doc.createElement('span');
    fx.className = 'craft-roll'; fx.setAttribute('aria-hidden', 'true');
    const glyphs = [];
    for (const [span, digit] of [[number, true], [label, false]]) {
      const text = span.firstChild && span.firstChild.nodeType === 3 ? span.firstChild : null;
      for (let i = 0; text && i < text.length; i++) {
        const mask = doc.createElement('span'), out = doc.createElement('span'), inn = doc.createElement('span');
        mask.className = 'craft-g'; out.className = 'craft-o'; inn.className = digit ? 'craft-i is-n' : 'craft-i';
        out.dataset.ch = inn.dataset.ch = text.data[i];
        mask.append(out, inn); fx.append(mask);
        glyphs.push({ span, text, index: i, mask, out, inn, painted: null });
      }
    }
    button.append(fx);
    return { li, button, glyphs };
  });
  const model = createCraftModel({ counts: rows.map(r => r.glyphs.length) });
  let request = 0, held = null, offset = 0, measured = false, live = false, shown = { time: null, rolls: null };
  const clock = () => (held ? held.time : now() - offset);

  // Layout reads happen only here. Each glyph's mask sits on its flow letter's pen position (the range's left edge, which
  // carries the kerning and the tracking before it) with `slack` ems either side, over its span's line box. The slack is
  // rounded to the layout's 1/64 px, so the copies land on the measured positions exactly.
  function measure() {
    const range = doc.createRange();
    for (const r of rows) {
      const b = r.button.getBoundingClientRect(), em = parseFloat(win.getComputedStyle(r.button).fontSize) || 13, slack = Math.round(CRAFT_ROLL.slack * em * 64) / 64;
      const boxes = new Map();
      for (const g of r.glyphs) {
        if (!boxes.has(g.span)) boxes.set(g.span, g.span.getBoundingClientRect());
        const line = boxes.get(g.span);
        range.setStart(g.text, g.index); range.setEnd(g.text, g.index + 1);
        const c = range.getBoundingClientRect();
        g.x = c.left - b.left; g.y = line.top - b.top; g.w = c.width; g.h = line.height;
        Object.assign(g.mask.style, { left: (g.x - slack).toFixed(6) + 'px', top: g.y.toFixed(6) + 'px', width: (g.w + 2 * slack).toFixed(6) + 'px', height: g.h.toFixed(6) + 'px' });
        g.out.style.left = g.inn.style.left = slack.toFixed(6) + 'px';
      }
    }
    measured = true;
    paint();
  }
  function paint() {
    request = 0;
    const on = measured && !reduced.matches;
    if (on !== live) { live = on; list.classList.toggle('is-rolling', on); }
    const time = clock(), rolls = model.rolls(time);
    shown = { time, rolls };
    if (live) rows.forEach((r, i) => r.glyphs.forEach((g, k) => {
      const s = rolls[i]?.[k] ?? 0;
      if (s === g.painted) return;
      g.painted = s;
      const o = copyOffsets(s);
      g.out.style.transform = shift(o.out); g.inn.style.transform = shift(o.in);
    }));
    if (!held && model.busy(time)) request = raf(paint);
  }
  function wake() { if (!request) request = raf(paint); }
  function follow(craft, options = {}) {
    const did = followCraft(model, craft, clock(), { ...options, reduced: reduced.matches });
    if (did === 'change' && held) held.time = model.latest + held.p * model.length;
    if (!did && (measured && !reduced.matches) === live) return;
    if (request) { cancel(request); request = 0; }
    paint();
  }
  // Review: hold the latest change at progress p (0 to 1 over its whole length), or null to let it run on from there.
  function hold(p) {
    if (p === null) { if (held) { offset = now() - held.time; held = null; } wake(); return state(); }
    if (!Number.isFinite(p)) throw new TypeError('p must be finite or null');
    const base = model.latest ?? clock();
    held = { p: clamp01(p), time: base + clamp01(p) * model.length };
    if (request) { cancel(request); request = 0; }
    paint();
    return state();
  }
  function state() {
    const time = clock();
    return { current: model.current, changes: model.changes, held: held ? held.p : null, busy: model.busy(time), length: model.length, live, rolls: model.rolls(time), lit: model.lit(time), touched: model.touched(), shown };
  }
  return { measure, follow, hold, get state() { return state(); }, get glyphs() { return rows.map(r => r.glyphs.map(g => ({ ch: g.text.data[g.index], x: g.x, y: g.y, w: g.w, h: g.h }))); } };
}
