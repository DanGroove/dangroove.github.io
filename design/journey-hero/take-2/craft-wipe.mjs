// Round 11 (C1): the craft list changes with a wipe. A red rule over the current row's top hairline marks it; on a change,
// the old row clears (0.35 s) and, 0.1 s later, the new row draws (0.4 s), both left to right with the brand's wipe. The
// rule and the text's colour share one hard-edged span per row, so the colour change is a front moving through the letters,
// never a fade; the number cuts as the front passes its right edge. Pure model first (checked in Node), then the page view,
// which writes only custom properties and one class per row (clip-path on an overlay rule, a hard-stop text fill), so no
// layout number moves. It runs on its own clock, like the name's reaction, not on the loop's time.
import { EASE } from '../../../public/journey/hero/engine.mjs';

export const CRAFT_WIPE = { clear: 0.35, delay: 0.1, draw: 0.4, total: 0.5 };

const clamp01 = x => Math.min(1, Math.max(0, x));
const EMPTY = [0, 0], FULL = [0, 1];
// Within a nanosecond of its end a wipe is over, so sums of the timetable's decimals end exactly on time.
const DONE = 1 - 1e-9;
const tidy = ([lo, hi]) => (hi - lo <= 1e-9 ? EMPTY : [lo, hi]);

// A row's span [lo, hi] (fractions of its width) holds both its red rule and its "on" colours. [0, 1] is the current row
// at rest, [0, 0] a row at rest off. Drawing: [0, front]. Clearing: [front, 1] (or less, when it was cut off mid-draw).
export function createCraftModel({ count = 4, ease = EASE.wipe } = {}) {
  const T = CRAFT_WIPE;
  let current = null, latest = null, changes = 0;
  let rows = Array.from({ length: count }, () => ({ mode: 'off' }));
  function spanOf(r, time) {
    if (r.mode === 'on') return FULL;
    if (r.mode === 'off') return EMPTY;
    if (r.mode === 'draw') {
      const u = (time - r.start) / T.draw;
      if (u >= DONE) return FULL;
      return tidy([0, ease(clamp01(u))]);
    }
    const u = (time - r.start) / T.clear;   // clear
    if (u >= DONE) return EMPTY;
    return tidy([Math.max(r.lo, ease(clamp01(u))), r.hi]);
  }
  // Rest every row at once on `craft`, with no wipe: the first frame, the entrance, reduced motion.
  function set(craft) {
    current = craft;
    rows = rows.map((_, i) => ({ mode: i === craft ? 'on' : 'off' }));
  }
  // A change at `time` on this model's clock. It always runs from the craft that is actually current.
  function change(to, time) {
    if (to === current) return false;
    if (current === null) { set(to); return false; }
    const from = current;
    rows = rows.map((r, i) => {
      if (i === to) return { mode: 'draw', start: time + T.delay };          // the newest row draws from the start
      if (i === from) { const [lo, hi] = spanOf(r, time); return hi > lo ? { mode: 'clear', start: time, lo, hi } : { mode: 'off' }; }
      return r;                                                              // a row still clearing finishes clearing
    });
    current = to; latest = time; changes++;
    return true;
  }
  const spans = time => rows.map(r => spanOf(r, time));
  const busy = time => rows.some(r => (r.mode === 'draw' && (time - r.start) / T.draw < DONE) || (r.mode === 'clear' && (time - r.start) / T.clear < DONE));
  // Collapse finished rows to rest, so the model never carries old schedules.
  function settle(time) { rows = rows.map(r => { const [lo, hi] = spanOf(r, time); return r.mode === 'draw' || r.mode === 'clear' ? (hi - lo >= 1 ? { mode: 'on' } : hi > lo ? r : { mode: 'off' }) : r; }); }
  return { set, change, spans, busy, settle, get current() { return current; }, get latest() { return latest; }, get changes() { return changes; } };
}

// The player's rule for each frame: the entrance (and the first frame) set; reduced motion cuts; anything else is a change.
// Returns 'change', 'set' (a cut to rest) or '' (nothing to do).
export function followCraft(model, craft, time, { cut = false, reduced = false } = {}) {
  if (craft === model.current) { if ((reduced || cut) && model.busy(time)) { model.set(craft); return 'set'; } return ''; }
  if (model.current === null || cut || reduced) { model.set(craft); return 'set'; }
  return model.change(craft, time) ? 'change' : '';
}

// The number cuts when the front passes its right edge (`at`, a fraction of the row's width).
export const numberLit = ([lo, hi], at) => lo < at && at <= hi;

// What the page writes for one row: the rule's clip fractions, the word's hard stops in its own px, the number's state.
export function rowStyle(span, g) {
  const [lo, hi] = span;
  return { wa: lo, wb: hi, xa: lo * g.w - g.wordLeft, xb: hi * g.w - g.wordLeft, lit: numberLit(span, g.numberRight / g.w) };
}

// ---- the page
export function createCraftWipe(hero, { reduced, win = hero.ownerDocument.defaultView, raf = f => win.requestAnimationFrame(f), cancel = id => win.cancelAnimationFrame(id), now = () => win.performance.now() / 1000 } = {}) {
  const list = hero.querySelector('[data-crafts]'), rows = [...list.querySelectorAll('li')];
  const model = createCraftModel({ count: rows.length });
  let geo = rows.map(() => ({ w: 1, wordLeft: 0, numberRight: 0 })), written = rows.map(() => ''), request = 0, held = null, offset = 0;
  list.classList.add('is-wiped');
  const clock = () => (held ? held.time : now() - offset);

  // Layout reads happen only here (start, resize, fonts), after the craft numbers' H12 shift is in place.
  function measure() {
    geo = rows.map(li => {
      const box = li.getBoundingClientRect(), n = li.querySelector('.n'), word = n.nextElementSibling;
      return { w: box.width || 1, wordLeft: word.getBoundingClientRect().left - box.left, numberRight: n.getBoundingClientRect().right - box.left };
    });
    written = written.map(() => '');
    paint();
  }
  function paint() {
    request = 0;
    const time = clock(), spans = model.spans(time);
    rows.forEach((li, i) => {
      const s = rowStyle(spans[i], geo[i]), key = `${s.wa}|${s.wb}|${s.xa.toFixed(2)}|${s.xb.toFixed(2)}|${s.lit}`;
      if (key === written[i]) return;
      written[i] = key;
      li.style.setProperty('--wa', String(+s.wa.toFixed(5)));
      li.style.setProperty('--wb', String(+s.wb.toFixed(5)));
      li.style.setProperty('--xa', s.xa.toFixed(2) + 'px');
      li.style.setProperty('--xb', s.xb.toFixed(2) + 'px');
      li.classList.toggle('is-lit', s.lit);
    });
    if (!held && model.busy(time)) request = raf(paint);
    else if (!held) model.settle(time);
  }
  function wake() { if (!request) request = raf(paint); }
  function follow(craft, options = {}) {
    const did = followCraft(model, craft, clock(), { ...options, reduced: reduced.matches });
    if (!did) return;
    if (did === 'change' && held) held.time = model.latest + held.p * CRAFT_WIPE.total;
    if (request) { cancel(request); request = 0; }
    paint();
  }
  // Review: hold the latest change at progress p (0 to 1), or null to let it run on from there.
  function hold(p) {
    if (p === null) { if (held) { offset = now() - held.time; held = null; } wake(); return state(); }
    if (!Number.isFinite(p)) throw new TypeError('p must be finite or null');
    const base = model.latest ?? clock();
    held = { p: clamp01(p), time: base + clamp01(p) * CRAFT_WIPE.total };
    if (request) { cancel(request); request = 0; }
    paint();
    return state();
  }
  function state() {
    const time = clock(), spans = model.spans(time);
    return { current: model.current, changes: model.changes, held: held ? held.p : null, busy: model.busy(time), spans, lit: spans.map((s, i) => numberLit(s, geo[i].numberRight / geo[i].w)) };
  }
  return { measure, follow, hold, get state() { return state(); } };
}
