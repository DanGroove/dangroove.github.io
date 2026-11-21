// Round 12 (L2): the craft list shows the current row as selected, like a layer in a design app. It replaces round 11's red
// rule (C1). A 1 px red rectangle runs round the current row (its top and bottom on the row's own hairlines, its sides at the
// row's edges; on phones round the current cell of the 2 x 2 grid), with four 5 px square handles centred on its corners.
// On a change the selection travels edge by edge: an edge moving outward (toward the side the selection is going) leads,
// over 0.3 s; an edge moving inward trails, from 0.1 s to 0.45 s; both with EASE.wipe. So it stretches across the rows in
// between, then closes up on the new row. The new row cuts lit (text paper, number red) once the selection covers it (its
// leading edge has reached the row's far side); a row that was lit cuts back once the selection no longer overlaps it (the
// trailing edge has left it). Hard cuts, no fades. A change during a change sends each edge on from where it is to its new
// target, with the same timing. Pure model first (checked in Node), then the page view, which writes only custom properties
// on the list and one class per row, so no layout number moves. It runs on its own clock, not on the loop's time.
// (The file keeps round 11's name and exports so the player and its checks keep their seams.)
import { EASE } from '../../../public/journey/hero/engine.mjs';

export const CRAFT_SELECT = { lead: [0, 0.3], trail: [0.1, 0.45], total: 0.45, handle: 5 };

const clamp01 = x => Math.min(1, Math.max(0, x));
// Within a nanosecond of its end an edge is home, so sums of the timetable's decimals end exactly on time.
const DONE = 1 - 1e-9;
// Cover and overlap are exact (an edge lands exactly on its target): a row is covered once the leading edge is on its far
// side, and no longer overlapped once the trailing edge is on or past it (desktop rows share a hairline, so touching is not
// overlapping).
const EPS = 1e-6;
// The four edges of a rectangle, each a 1 px line's position (its left or top pixel): l, r (x) and t, b (y). The max edges
// (r, b) move outward when they grow; the min edges (l, t) when they shrink.
export const EDGES = ['l', 'r', 't', 'b'];
const OUT = { l: -1, r: 1, t: -1, b: 1 };

export const covers = (s, row) => s.l <= row.l + EPS && s.r >= row.r - EPS && s.t <= row.t + EPS && s.b >= row.b - EPS;
export const overlaps = (s, row) => s.l < row.r - EPS && s.r > row.l + EPS && s.t < row.b - EPS && s.b > row.t + EPS;

// rects: each row's rectangle at rest, { l, r, t, b } in px (the page view measures them; the checks give their own).
export function createCraftModel({ count = 4, rects = null, ease = EASE.wipe } = {}) {
  const T = CRAFT_SELECT;
  let current = null, latest = null, changes = 0;
  let geo = rects || Array.from({ length: count }, (_, i) => ({ l: 0, r: 379, t: 40 * i, b: 40 * (i + 1) }));
  // Each edge: { from, to, start, end } (static when start is null); base: each row's lit state when the segment began.
  let edges = null, base = Array(count).fill(false);
  function edgeAt(e, time) {
    if (e.start === null) return e.to;
    const u = (time - e.start) / (e.end - e.start);
    if (u <= 0) return e.from;
    if (u >= DONE) return e.to;
    return e.from + (e.to - e.from) * ease(clamp01(u));
  }
  const rectAt = time => (edges ? Object.fromEntries(EDGES.map(k => [k, edgeAt(edges[k], time)])) : null);
  // The current row is lit once covered (and stays lit); any other row stays lit, if it was, while overlapped.
  function litAt(time) {
    const s = rectAt(time);
    if (!s) return Array(count).fill(false);
    return geo.map((row, i) => (i === current ? base[i] || covers(s, row) : base[i] && overlaps(s, row)));
  }
  // Rest every row at once on `craft`, with no travel: the first frame, the entrance, reduced motion, a new geometry.
  function set(craft) {
    current = craft;
    const g = geo[craft];
    edges = Object.fromEntries(EDGES.map(k => [k, { from: g[k], to: g[k], start: null, end: null, role: null }]));
    base = geo.map((_, i) => i === craft);
  }
  // A change at `time` on this model's clock. It always runs from where the selection actually is.
  function change(to, time) {
    if (to === current) return false;
    if (current === null) { set(to); return false; }
    const now = rectAt(time), lit = litAt(time), g = geo[to];
    edges = Object.fromEntries(EDGES.map(k => {
      const d = g[k] - now[k];
      if (d === 0) return [k, { from: g[k], to: g[k], start: null, end: null, role: null }];
      const role = d * OUT[k] > 0 ? 'lead' : 'trail', [a, b] = T[role];
      return [k, { from: now[k], to: g[k], start: time + a, end: time + b, role }];
    }));
    base = lit; current = to; latest = time; changes++;
    return true;
  }
  const busy = time => !!edges && EDGES.some(k => edges[k].start !== null && (time - edges[k].start) / (edges[k].end - edges[k].start) < DONE);
  // Collapse a finished change to rest, so the model never carries old schedules.
  function settle(time) { if (current !== null && !busy(time)) set(current); }
  // Which edges lead and which trail in the latest change (null: an edge that does not move).
  const roles = () => (edges ? Object.fromEntries(EDGES.map(k => [k, edges[k].role])) : null);
  function setGeometry(rects2) { geo = rects2; if (current !== null) set(current); }
  return {
    set, change, busy, settle, setGeometry, roles, rect: rectAt, lit: litAt,
    get rects() { return geo; }, get current() { return current; }, get latest() { return latest; }, get changes() { return changes; },
  };
}

// The player's rule for each frame: the entrance (and the first frame) set; reduced motion cuts; anything else is a change.
// Returns 'change', 'set' (a cut to rest) or '' (nothing to do).
export function followCraft(model, craft, time, { cut = false, reduced = false } = {}) {
  if (craft === model.current) { if ((reduced || cut) && model.busy(time)) { model.set(craft); return 'set'; } return ''; }
  if (model.current === null || cut || reduced) { model.set(craft); return 'set'; }
  return model.change(craft, time) ? 'change' : '';
}

// A row's rectangle from its box (px from the list's top left). Where the list has hairlines, the top line is the row's own
// top hairline and the bottom line the next row's (or the last row's bottom hairline); without them (the phone grid), the
// rectangle runs just inside the cell.
export function rowRects(boxes, hairlines) {
  return boxes.map((b, i) => {
    const below = hairlines && boxes.find(o => Math.abs(o.top - b.bottom) < 0.5 && Math.abs(o.left - b.left) < 0.5);
    return { l: b.left, r: b.right - 1, t: b.top, b: below ? below.top : b.bottom - 1 };
  });
}

// The entrance: the selection's top and bottom lines draw with the current row's top and bottom hairlines (lines p, five of
// them, 0 to 1); each handle cuts in as its corner's line arrives there, and each side once both its handles are in.
export function entranceParts(rect, p, row) {
  const w = rect.r - rect.l + 1, top = clamp01(p[row] ?? 1), bottom = clamp01(p[row + 1] ?? 1);
  const at = (q, x) => q * w >= x + 0.5;
  const h = [at(top, 0), at(top, w - 1), at(bottom, 0), at(bottom, w - 1)];   // top left, top right, bottom left, bottom right
  return { w, top, bottom, handles: h, sides: [h[0] && h[2], h[1] && h[3]], done: top >= 1 && bottom >= 1 };
}

// ---- the page
const RED = 'var(--red-bright)';
const rectPath = (x0, y0, x1, y1) => `M${x0.toFixed(2)} ${y0.toFixed(2)}H${x1.toFixed(2)}V${y1.toFixed(2)}H${x0.toFixed(2)}Z`;
export function createCraftWipe(hero, { reduced, win = hero.ownerDocument.defaultView, raf = f => win.requestAnimationFrame(f), cancel = id => win.cancelAnimationFrame(id), now = () => win.performance.now() / 1000 } = {}) {
  const list = hero.querySelector('[data-crafts]'), rows = [...list.querySelectorAll('li')];
  const model = createCraftModel({ count: rows.length });
  let written = '', lit = rows.map(() => null), request = 0, held = null, offset = 0, intro = null, measured = false;
  list.classList.add('is-selected');
  const clock = () => (held ? held.time : now() - offset);

  // Layout reads happen only here (start, resize, fonts). A new geometry cuts the selection to rest on the current row.
  function measure() {
    const box = list.getBoundingClientRect();
    const boxes = rows.map(li => { const r = li.getBoundingClientRect(); return { left: r.left - box.left, right: r.right - box.left, top: r.top - box.top, bottom: r.bottom - box.top }; });
    const hairlines = rows.some(li => parseFloat(win.getComputedStyle(li).borderTopWidth) > 0);
    model.setGeometry(rowRects(boxes, hairlines));
    measured = true; written = ''; lit = rows.map(() => null);
    paint();
  }
  const put = (k, v) => (v === null ? list.style.removeProperty(k) : list.style.setProperty(k, v));
  function paint() {
    request = 0;
    const time = clock(), s = measured ? model.rect(time) : null, on = model.lit(time);
    let key = 'none';
    if (s) {
      const e = intro ? entranceParts(s, intro, model.current) : null;
      key = [s.l, s.r, s.t, s.b].map(v => v.toFixed(2)).join('|') + (e && !e.done ? `|${e.top.toFixed(4)}|${e.bottom.toFixed(4)}|${e.handles.join('')}` : '');
      if (key !== written) {
        put('--sel-show', 'block');
        put('--sl', s.l.toFixed(2) + 'px'); put('--sr', s.r.toFixed(2) + 'px'); put('--st', s.t.toFixed(2) + 'px'); put('--sb', s.b.toFixed(2) + 'px');
        if (e && !e.done) {
          // The rectangle's own box: lines are drawn by its border, so the entrance clips it to the parts that are in.
          const h = s.b - s.t + 1, parts = [];
          if (e.top > 0) parts.push(rectPath(0, 0, e.w * e.top, 1));
          if (e.bottom > 0) parts.push(rectPath(0, h - 1, e.w * e.bottom, h));
          if (e.sides[0]) parts.push(rectPath(0, 0, 1, h));
          if (e.sides[1]) parts.push(rectPath(e.w - 1, 0, e.w, h));
          put('--sel-clip', parts.length ? `path('${parts.join('')}')` : 'inset(0 100% 0 0)');
          e.handles.forEach((v, i) => put(`--h${i}`, v ? RED : 'transparent'));
        } else { put('--sel-clip', null); [0, 1, 2, 3].forEach(i => put(`--h${i}`, null)); }
      }
    } else if (key !== written) put('--sel-show', null);
    written = key;
    rows.forEach((li, i) => { if (on[i] !== lit[i]) { lit[i] = on[i]; li.classList.toggle('is-lit', on[i]); } });
    if (!held && model.busy(time)) request = raf(paint);
    else if (!held) model.settle(time);
  }
  function wake() { if (!request) request = raf(paint); }
  // entrance: the entrance's five line progresses while it shows (the player's entranceAt(...).crafts), else null.
  function follow(craft, options = {}) {
    const e = options.entrance ? [...options.entrance] : null, moved = (e ? e.join() : '') !== (intro ? intro.join() : '');
    intro = e;
    const did = followCraft(model, craft, clock(), { ...options, reduced: reduced.matches });
    if (did === 'change' && held) held.time = model.latest + held.p * CRAFT_SELECT.total;
    if (!did && !moved) return;
    if (request) { cancel(request); request = 0; }
    paint();
  }
  // Review: hold the latest change at progress p (0 to 1), or null to let it run on from there.
  function hold(p) {
    if (p === null) { if (held) { offset = now() - held.time; held = null; } wake(); return state(); }
    if (!Number.isFinite(p)) throw new TypeError('p must be finite or null');
    const base = model.latest ?? clock();
    held = { p: clamp01(p), time: base + clamp01(p) * CRAFT_SELECT.total };
    if (request) { cancel(request); request = 0; }
    paint();
    return state();
  }
  function state() {
    const time = clock();
    return { current: model.current, changes: model.changes, held: held ? held.p : null, busy: model.busy(time), rect: model.rect(time), rects: model.rects, lit: model.lit(time) };
  }
  return { measure, follow, hold, get state() { return state(); } };
}
