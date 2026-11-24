// Round 6: the one-time entrance. Pure timetable and renderer values first; the DOM view only writes clip-path and weight.
// Hard-edged except the stars/name. Entrance times are seconds from the loader's burst landing.
import { EASE } from '../../../public/journey/hero/engine.mjs';
import { SCREEN } from './stage.mjs';
import { LOADER, loaderAt } from './loader-stars.mjs';
export { LOADER, loaderAt };

export const ENTRANCE = {
  end: 3.8,
  mark: [0, 0.45],                             // DG mark, wipe left to right
  nav: [0.35, 0.45],                           // Journey, Contact: cuts
  name: [[0.4, 1.0], [0.6, 1.2]],             // Danial, Endrawes: wipe up from the baseline, weight 300 to 800
  lede: { start: 1.05, end: 2.0, step: 0.15 }, // one wipe per line, left to right
  crafts: { start: 3.0, end: 3.6, step: 0.1, lines: 5 },   // four top hairlines and the last row's bottom one
  floor: [1.8, 2.8],                           // hard circle of dots and pool, centre outward
  starPointer: 0,                             // L5: entrance zero is the burst landing
  stars: null,                               // L4: the loader burst replaces the star entrance ring
  screen: [2.4, 3.2],                          // clip plane rising from the screen's bottom edge to its top
  foot: [3.6, 3.7],                            // Scroll for the journey, Pause: cuts
};

const linear = (t, a, b) => Math.min(1, Math.max(0, (t - a) / (b - a)));
const wipe = (t, a, b) => EASE.wipe(linear(t, a, b));

// The early inline canvas owns its clock and painting; the player owns the same-frame WebGL handover.
// Stand-alone/review harnesses can still exercise the pure timing without an inline bridge.
export function createLoaderView(hero) {
  const bridge = hero.ownerDocument?.defaultView?.__loaderStars;
  return {
    state: bridge ? now => bridge.state(now) : null,
    boot: key => bridge?.boot(key),
    measure: box => bridge?.measure(box),
    motion: reduced => bridge?.motion(reduced),
    // The inline bridge's legacy entranceTime input only switches the burst's transparent backing.
    // Keep that switch at burst start while the page's entranceTime waits for the landing.
    apply(state) { bridge?.apply({ ...state, entranceTime: state.burstTime }); },
    clear() { bridge?.clear(); hero.classList.remove('is-loading'); },
  };
}
// The loop's clock starts at 0 when the screen's wipe ends.
export const loopAt = time => Math.max(0, time - ENTRANCE.screen[1]);

// Each part starts `step` after the one before and the last one ends at `end`, whatever the count.
export function staggerSpans({ start, end, step }, count) {
  const gap = Math.min(step, (end - start) / (count + 1)), length = end - start - gap * (count - 1);
  return Array.from({ length: count }, (_, i) => [start + i * gap, start + i * gap + length]);
}

export function entranceAt(time, { ledeLines = 3 } = {}) {
  const E = ENTRANCE;
  return {
    time,
    done: time >= E.end,
    mark: wipe(time, ...E.mark),
    nav: E.nav.map(at => time >= at),
    name: E.name.map(([a, b]) => ({ reveal: wipe(time, a, b), weight: 300 + 500 * EASE.enter(linear(time, a, b)) })),
    lede: staggerSpans(E.lede, ledeLines).map(span => wipe(time, ...span)),
    crafts: staggerSpans(E.crafts, E.crafts.lines).map(span => wipe(time, ...span)),
    floor: wipe(time, ...E.floor),
    stars: E.stars === null ? 1 : wipe(time, ...E.stars),
    screen: wipe(time, ...E.screen),
    foot: E.foot.map(at => time >= at),
    hover: time >= E.floor[1],
    loop: loopAt(time),
  };
}

// The screen's clip plane keeps world points at or below a rising height. null once the wipe is complete.
const SCREEN_LOW = SCREEN.b - 0.02, SCREEN_HIGH = SCREEN.b + SCREEN.h + 0.02;
export function screenPlane(p) {
  return p >= 1 ? null : [0, -1, 0, SCREEN_LOW + (SCREEN_HIGH - SCREEN_LOW) * p];
}
// The floor's hard circle, in world units from the pool's centre. null once it has reached the pool's edge.
export const floorReach = (p, radius) => p >= 1 ? null : p * radius;
// Mirrors FRAG_FLOOR: a dot is decided by its grid centre alone, so it is wholly on or off.
export function revealDot(x, z, centre, reach, pitch = 0.5) {
  const cell = [Math.floor(x / pitch + 0.5) * pitch, Math.floor(z / pitch + 0.5) * pitch];
  return reach === null || Math.hypot(cell[0] - centre.x, cell[1] - centre.z) <= reach;
}
export const revealPool = (x, z, centre, reach) => reach === null || Math.hypot(x - centre.x, z - centre.z) <= reach;

// ---- the page. Geometry is read once (on start and on layout changes); each frame only writes styles.
const HIDDEN = 'inset(0 100% 0 0)';
const rect = (x0, y0, x1, y1) => `M${x0.toFixed(2)} ${y0.toFixed(2)}H${x1.toFixed(2)}V${y1.toFixed(2)}H${x0.toFixed(2)}Z`;
const clipPath = parts => parts.length ? `path('${parts.join('')}')` : HIDDEN;

export function createEntranceView(hero) {
  const q = s => hero.querySelector(s);
  const mark = q('[data-mark]'), links = [...hero.querySelectorAll('[data-nav] a')], lede = q('[data-lede]');
  const rows = [...hero.querySelectorAll('[data-crafts] li')], foot = [q('[data-cue]'), q('[data-pause]')];
  let lines = [], geo = null;
  const all = () => [mark, ...links, ...lines, lede, ...rows, ...foot];
  function measure(nameInks) {
    lines = [...hero.querySelectorAll('[data-name] .name-line')];
    const name = lines.map((line, i) => {
      const box = line.getBoundingClientRect(), ink = nameInks?.[i];
      return ink ? { top: ink.top - box.top, bottom: ink.bottom - box.top } : { top: 0, bottom: box.height };
    });
    const l = lede.getBoundingClientRect(), range = hero.ownerDocument.createRange();
    range.selectNodeContents(lede);
    const ledeLines = [];
    for (const r of range.getClientRects()) {
      if (!r.width || !r.height) continue;
      const line = ledeLines.find(n => Math.abs(n.mid - (r.top + r.bottom) / 2) < r.height / 2);
      if (line) { line.left = Math.min(line.left, r.left); line.right = Math.max(line.right, r.right); line.top = Math.min(line.top, r.top); line.bottom = Math.max(line.bottom, r.bottom); }
      else ledeLines.push({ left: r.left, right: r.right, top: r.top, bottom: r.bottom, mid: (r.top + r.bottom) / 2 });
    }
    ledeLines.sort((a, b) => a.top - b.top);
    const crafts = rows.map(li => {
      const box = li.getBoundingClientRect(), n = li.querySelector('.n').getBoundingClientRect(), word = li.querySelector('.n').nextElementSibling.getBoundingClientRect();
      return { w: box.width, h: box.height, numberRight: n.right - box.left, wordRight: word.right - box.left, split: (n.right + word.left) / 2 - box.left };
    });
    geo = { name, lede: ledeLines.map(n => ({ left: n.left - l.left, right: n.right - l.left, top: n.top - l.top, bottom: n.bottom - l.top })), crafts };
    return geo;
  }
  function apply(s) {
    if (!geo) return;
    mark.style.clipPath = s.mark >= 1 ? '' : `inset(0 ${(100 * (1 - s.mark)).toFixed(3)}% 0 0)`;
    links.forEach((a, i) => { a.style.clipPath = s.nav[i] ?? true ? '' : HIDDEN; });
    lines.forEach((line, i) => {
      const { reveal, weight } = s.name[i] || s.name.at(-1), g = geo.name[i];
      // The clip's top edge rises from just under the baseline (the ink's bottom, with room for round overshoots at any weight)
      // to above the ink's top, so nothing of the line shows before its turn.
      const y = g.bottom + 3 - (g.bottom - g.top + 7) * reveal;
      line.style.clipPath = reveal >= 1 ? '' : `polygon(-50% ${y.toFixed(2)}px, 150% ${y.toFixed(2)}px, 150% 200%, -50% 200%)`;
      line.style.fontWeight = reveal >= 1 && weight >= 800 ? '' : weight.toFixed(1);
    });
    lede.style.clipPath = s.lede.every(p => p >= 1) ? '' : clipPath(geo.lede.flatMap((n, i) => {
      const p = s.lede[i] ?? 1, x0 = n.left - 2;
      return p > 0 ? [rect(x0, n.top - 1, x0 + (n.right - n.left + 4) * p, n.bottom + 1)] : [];
    }));
    rows.forEach((li, i) => {
      const g = geo.crafts[i], p = s.crafts[i], last = i === rows.length - 1, bottom = last ? s.crafts[rows.length] ?? 1 : 1, tip = g.w * p;
      if (p >= 1 && bottom >= 1) { li.style.clipPath = ''; return; }
      const parts = [];
      if (p > 0) parts.push(rect(0, -1, tip, 1));
      // A row's number and word cut in as its line passes them.
      if (tip >= g.numberRight) parts.push(rect(-40, 1, g.split, g.h - 1));
      if (tip >= g.wordRight) parts.push(rect(g.split, 1, g.w + 40, g.h - 1));
      if (last && bottom > 0) parts.push(rect(0, g.h - 1, g.w * bottom, g.h + 1));
      li.style.clipPath = clipPath(parts);
    });
    foot.forEach((node, i) => { node.style.clipPath = s.foot[i] ? '' : HIDDEN; });
  }
  function clear() { for (const node of all()) { node.style.clipPath = ''; node.style.fontWeight = ''; } }
  return { measure, apply, clear, get lines() { return geo ? geo.lede.length : 0; } };
}
