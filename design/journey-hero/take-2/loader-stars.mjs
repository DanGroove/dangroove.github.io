// Shared pure star geometry and L4 timing. Inlined by tools/page.mjs; no DOM, imports, fonts or pictures.
export const STARS = {
  density: 1200 / (1440 * 900), most: 2000,
  size: [0.6, 2.2],             // px across, far to near
  mix: [0.12, 0.55],            // paper (or red) into ink, far to near
  red: 0.03,
  ink: '#151314', paper: '#F7F6F3', redInk: '#F0484F',
  parallax: 28, tau: 0.3,       // px at a full half-hero offset; follow time constant
  scroll: 0.12,                 // the nearest stars move this much faster than the page
  mass: [0.6, 1.6], drag: 2.3,  // drag / sqrt(mass), per second
  push: { reach: 60, gain: 0.09, cap: 1500, max: 39 },
  hold: { base: 80, grow: 260, full: 2.5, orbit: [6, 36], turn: Math.PI / 2, pull: 5, follow: 12, blast: [300, 1700], reach: 2, weak: 0.5, max: 0.45 },
  click: { time: 0.25, move: 6 },
  rest: { offset: 0.05, speed: 0.5 },
  // Round 10: the return weight (R1) and the mark weight (R2) change at most this much per second (0.09 a frame at 60); a
  // captured star's front copy fades in over fadeIn seconds (R2).
  fade: 5.4, fadeIn: 0.4,
  // Round 9 (L1): the captured stars form the DG mark, read from the page's own SVG. height: of the hero's height; tau: the
  // formation's time constant (see BUILD.md, CORRECTIONS-9); arrive: px; size: px across once arrived.
  // Round 12 (S1): the formation starts once the hold has captured `threshold` stars (round 9 started it at 1.4 s held).
  // Round 16 (R1): the extra stars make a band round the mark's weight centre: its inner edge ringGap of the mark's height
  // outside the farthest point, ringBand of the mark's height deep, outward.
  mark: { threshold: 300, height: 0.2, margin: 16, count: 600, tau: 0.12, arrive: 1, size: 2.6, ringGap: 0.095, ringBand: 0.1, cells: 24000, edge: 2 },
  // C18-7: keep the charge's diagnostic ramp, but it no longer displaces held stars.
  charge: { start: 5.6, ramp: 2, amp: 1.5, hz: [10, 16] },
};


const clamp01 = x => Math.min(1, Math.max(0, x));
// A fixed hash of a star's index and a channel, 0 to 1.
export function hash(i, k = 0) {
  let h = Math.imul((i | 0) + 0x9e3779b9, 0x85ebca6b) ^ Math.imul((k | 0) + 0x7f4a7c15, 0xc2b2ae35);
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d); h = Math.imul(h ^ (h >>> 12), 0x297a2d39); h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}
export const starCount = (W, H) => Math.min(STARS.most, Math.round(STARS.density * W * H));
// The field for a hero of W x H: home position, depth, size, mix, red, mass. Homes scale with the box.
export function makeStars(W, H) {
  const n = starCount(W, H), stars = [];
  for (let i = 0; i < n; i++) {
    const d = hash(i, 2);
    stars.push({ x: hash(i, 0) * W, y: hash(i, 1) * H, d, size: STARS.size[0] + (STARS.size[1] - STARS.size[0]) * d, mix: STARS.mix[0] + (STARS.mix[1] - STARS.mix[0]) * d, red: hash(i, 3) < STARS.red, m: STARS.mass[0] + (STARS.mass[1] - STARS.mass[0]) * hash(i, 4) });
  }
  return stars;
}
function segmentDistance(px, py, a, b) {
  const vx = b[0] - a[0], vy = b[1] - a[1], len2 = vx * vx + vy * vy;
  const t = len2 ? clamp01(((px - a[0]) * vx + (py - a[1]) * vy) / len2) : 0;
  return Math.hypot(px - a[0] - t * vx, py - a[1] - t * vy);
}

// ---- Round 9 (L1): the DG mark. A pure sampler over the mark's paths ([{ d, fill }], SVG units, y down like the page), then
// its placement for a hero size. Points from paper paths are G points; points from any other fill (the red path) are D points.
export const markKind = fill => String(fill || '').trim().toUpperCase() === STARS.paper ? 'G' : 'D';
// A star's colour code for the renderer: 0 behind (own colour), 1 in front (own colour), 2 in front as G, 3 in front as D.
// Round 10 (R2): 2 and 3 are set when the star is given a point; its front look goes toward that colour by its mark weight.
export const markFlag = kind => kind === 'D' ? 3 : 2;
export const FLAG_INK = [null, null, STARS.paper, STARS.redInk];
// Flattens an SVG path (M, L, C, Z, absolute or relative) into closed rings of [x, y].
export function flattenPath(d, segments = 24) {
  const tokens = String(d).match(/[MLCZmlcz]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g) || [];
  const rings = []; let ring = null, cmd = null, k = 0, x = 0, y = 0, sx = 0, sy = 0;
  const num = () => { const v = +tokens[k++]; if (!Number.isFinite(v)) throw new Error('bad path number'); return v; };
  const close = () => { if (ring && ring.length > 2) rings.push(ring); ring = null; };
  while (k < tokens.length) {
    if (/^[A-Za-z]$/.test(tokens[k])) cmd = tokens[k++];
    if (!cmd) throw new Error('path data without a command');
    const rel = cmd !== cmd.toUpperCase(), C = cmd.toUpperCase(), bx = rel ? x : 0, by = rel ? y : 0;
    if (C === 'Z') { close(); x = sx; y = sy; cmd = null; continue; }
    if (C === 'M') { close(); x = bx + num(); y = by + num(); sx = x; sy = y; ring = [[x, y]]; cmd = rel ? 'l' : 'L'; }
    else if (C === 'L') { x = bx + num(); y = by + num(); ring.push([x, y]); }
    else if (C === 'C') {
      const x1 = bx + num(), y1 = by + num(), x2 = bx + num(), y2 = by + num(), x3 = bx + num(), y3 = by + num(), x0 = x, y0 = y;
      for (let j = 1; j <= segments; j++) {
        const t = j / segments, u = 1 - t;
        ring.push([u * u * u * x0 + 3 * u * u * t * x1 + 3 * u * t * t * x2 + t * t * t * x3, u * u * u * y0 + 3 * u * u * t * y1 + 3 * u * t * t * y2 + t * t * t * y3]);
      }
      x = x3; y = y3;
    } else throw new Error('unsupported path command ' + cmd);
  }
  close();
  return rings;
}
// Nonzero winding (SVG's default fill rule) of the rings around (px, py).
export function winding(rings, px, py) {
  let w = 0;
  for (const r of rings) for (let j = 0; j < r.length; j++) {
    const a = r[j], b = r[(j + 1) % r.length], side = (b[0] - a[0]) * (py - a[1]) - (px - a[0]) * (b[1] - a[1]);
    if (a[1] <= py) { if (b[1] > py && side > 0) w++; } else if (b[1] <= py && side < 0) w--;
  }
  return w;
}
// The sampler: a fine jittered grid inside the fills (the topmost path that covers a cell owns it; cells closer than
// STARS.mark.edge units to their path's edge are dropped), then farthest-point order, so any first N cover the whole mark
// evenly. Returns { points: [{ x, y, kind, path }], box: [x0, y0, x1, y1], area: { G, D } } in the paths' own units.
export function sampleMark(paths, count = STARS.mark.count) {
  const shapes = paths.map((p, path) => ({ rings: flattenPath(p.d), kind: markKind(p.fill), path }));
  const all = shapes.flatMap(s => s.rings.flat());
  if (!all.length) return { points: [], box: [0, 0, 0, 0], area: { G: 0, D: 0 } };
  const box = [Math.min(...all.map(p => p[0])), Math.min(...all.map(p => p[1])), Math.max(...all.map(p => p[0])), Math.max(...all.map(p => p[1]))];
  const step = Math.sqrt((box[2] - box[0]) * (box[3] - box[1]) / STARS.mark.cells), cx = [], cy = [], owner = [];
  const area = { G: 0, D: 0 }, margin = STARS.mark.edge;
  // Each row of cells needs only the edges that reach its band (for the winding test and for the edge margin).
  const edges = shapes.map(sh => sh.rings.flatMap(r => r.map((a, j) => [a, r[(j + 1) % r.length]])));
  for (let gy = 0, id = 0; box[1] + gy * step < box[3]; gy++) {
    const lo = box[1] + gy * step - margin, hi = box[1] + (gy + 1) * step + margin;
    const band = edges.map(list => list.filter(e => Math.max(e[0][1], e[1][1]) >= lo && Math.min(e[0][1], e[1][1]) <= hi));
    for (let gx = 0; box[0] + gx * step < box[2]; gx++, id++) {
      const x = box[0] + (gx + 0.15 + 0.7 * hash(id, 7)) * step, y = box[1] + (gy + 0.15 + 0.7 * hash(id, 8)) * step;
      for (let s = shapes.length - 1; s >= 0; s--) {
        let w = 0, far = true;
        for (const [a, b] of band[s]) {
          const side = (b[0] - a[0]) * (y - a[1]) - (x - a[0]) * (b[1] - a[1]);
          if (a[1] <= y) { if (b[1] > y && side > 0) w++; } else if (b[1] <= y && side < 0) w--;
          if (far && segmentDistance(x, y, a, b) < margin) far = false;
        }
        if (!w) continue;
        area[shapes[s].kind] += step * step;
        if (far) { cx.push(x); cy.push(y); owner.push(s); }
        break;
      }
    }
  }
  const m = cx.length, gap = new Float64Array(m).fill(Infinity), points = [];
  if (!m) return { points, box, area };
  // Farthest-point order, from the cell nearest the mark's centre.
  const mx = (box[0] + box[2]) / 2, my = (box[1] + box[3]) / 2;
  let next = 0;
  for (let j = 1; j < m; j++) if (Math.hypot(cx[j] - mx, cy[j] - my) < Math.hypot(cx[next] - mx, cy[next] - my)) next = j;
  for (let k = 0; k < Math.min(count, m); k++) {
    const px = cx[next], py = cy[next], sh = shapes[owner[next]];
    points.push({ x: px, y: py, kind: sh.kind, path: sh.path });
    let far = -1, pick = 0;
    for (let j = 0; j < m; j++) {
      const dx = cx[j] - px, dy = cy[j] - py, g = Math.min(gap[j], dx * dx + dy * dy);
      gap[j] = g; if (g > far) { far = g; pick = j; }
    }
    next = pick;
  }
  return { points, box, area };
}
// The mark for a hero of W x H: about 20 % of its height, the mark's own proportions, never wider than the hero allows.
// Points are px from the mark's centre (y down, upright, not mirrored); half is its half size; reach its farthest point.
// Round 16 (R1): weight is the mean of the points (the fill's centroid, the points being even over it), in px from the box
// centre; the ring's band is centred on it: its inner edge (radius) ringGap of the mark's height outside the farthest point
// from it, its depth (band) ringBand of the mark's height.
export function placeMark(sample, W, H, height = STARS.mark.height) {
  const [x0, y0, x1, y1] = sample.box, bw = x1 - x0, bh = y1 - y0, m = STARS.mark.margin;
  if (!sample.points.length || !(bw > 0) || !(bh > 0)) return null;
  const h = Math.max(1, Math.min(height * H, (W - 2 * m) * bh / bw, H - 2 * m)), s = h / bh, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const points = sample.points.map(p => ({ x: (p.x - cx) * s, y: (p.y - cy) * s, kind: p.kind }));
  const weight = [0, 1].map(k => points.reduce((sum, p) => sum + (k ? p.y : p.x), 0) / points.length);
  const radius = Math.max(...points.map(p => Math.hypot(p.x - weight[0], p.y - weight[1]))) + STARS.mark.ringGap * h;
  return { points, half: [bw * s / 2, bh * s / 2], height: h, scale: s, reach: Math.max(...points.map(p => Math.hypot(p.x, p.y))), weight, ring: { centre: weight, radius, band: STARS.mark.ringBand * h } };
}
// L4: progress has real 25/50/25 shares. .85 displayed progress launches the last star;
// .85 / 1.4 is deliberately stricter than 1 / 1.4, so launches themselves span 1.4 s.
export const LOADER = {
  launchEnd: 0.85, gatherSeconds: 1.4, flight: 1.0, hold: 0.15, shrink: 0.35, compressed: 0.08, swell: 0.18, burst: 1.696,
  shares: { fonts: 0.25, atlas: 0.5, frame: 0.25 },
};
const cubicInOut = p => p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
// Hash the home, so L8's two stars sharing it still arrive together.
export const loaderDuration = (home, i) => (1 + 0.6 * (1 - home.d)) * (0.94 + 0.12 * hash(i, 21));
export const launchShare = (i, count = STARS.mark.count) => LOADER.launchEnd * i / Math.max(1, count - 1);
// Farthest-point sampling already supplies a spatially even prefix, across both letters.
// No sort by path, colour or side is introduced for the loader.
export function loaderAt(time, boot = {}, { review = false, reduced = false, count = STARS.mark.count } = {}) {
  if (review) return { phase: 'skipped', fill: 0, target: 0, done: true, burstTime: null, entranceStart: null, entranceTime: null, pointer: false };
  const events = Object.entries(LOADER.shares)
    .filter(([key]) => Number.isFinite(boot[key]) && boot[key] >= 0)
    .map(([key, share]) => [boot[key], share]).sort((a, b) => a[0] - b[0]);
  const rate = LOADER.launchEnd / LOADER.gatherSeconds;
  const progress = t => {
    let fill = 0, target = 0, cursor = 0;
    for (const [at, share] of events) {
      if (at > t) break;
      fill = Math.min(target, fill + (at - cursor) * rate);
      target += share; cursor = at;
    }
    return { fill: Math.min(target, fill + Math.max(0, t - cursor) * rate), target };
  };
  // Invert the continuous piecewise-linear progress, including pauses at a boot plateau.
  const crossing = share => {
    let fill = 0, target = 0, cursor = 0;
    for (const [at, amount] of events) {
      if (target > 0 && share <= target && share <= fill + (at - cursor) * rate) return cursor + Math.max(0, share - fill) / rate;
      fill = Math.min(target, fill + (at - cursor) * rate);
      target += amount; cursor = at;
    }
    return target > 0 && share <= target ? cursor + Math.max(0, share - fill) / rate : Infinity;
  };
  const { fill, target } = progress(time), ready = events.length === Object.keys(LOADER.shares).length;
  const launches = Array.from({ length: count }, (_, i) => crossing(launchShare(i, count)));
  const formedAt = launches.at(-1) + LOADER.flight;
  const fullAt = ready ? crossing(1) : Infinity;
  const holdAt = ready ? Math.max(formedAt, fullAt, events.at(-1)[0]) : Infinity;
  const shrinkStart = holdAt + LOADER.hold, compressedStart = shrinkStart + LOADER.shrink, swellStart = compressedStart + LOADER.compressed;
  const burstStart = swellStart + LOADER.swell;
  if (reduced) return { phase: ready && time >= events.at(-1)[0] ? 'cut' : 'loading', fill: target, target,
    done: ready && time >= events.at(-1)[0], entranceStart: null, entranceTime: null, pointer: false,
    launches, arrived: count, formedAt: 0, burst: 0, burstTime: null, reduced: true };
  const shrink = clamp01((time - shrinkStart) / LOADER.shrink), swell = clamp01((time - swellStart) / LOADER.swell);
  const scale = time >= swellStart ? 0.78 + (1.10 - 0.78) * swell ** 3 : 1 - 0.22 * cubicInOut(shrink);
  const charge = 1 + 0.3 * cubicInOut(clamp01((time - shrinkStart) / (LOADER.shrink + LOADER.compressed)));
  return loaderLanding({ phase: time >= swellStart ? 'swell' : time >= compressedStart ? 'compressed' : time >= shrinkStart ? 'shrink' : time >= holdAt ? 'hold' : 'loading',
    fill, target, launches, formedAt, fullAt, holdAt, shrinkStart, compressedStart, swellStart, scale, charge, burstStart,
    arrived: launches.filter(at => time >= at + LOADER.flight).length,
    burstTime: time >= burstStart ? time - burstStart : null,
    time }, LOADER.burst);
}
// The early clock has a conservative bound before layout is known. The painter uses
// individual durations; the entrance view resolves this same clock to the actual last landing.
export function loaderLanding(state, duration) {
  if (state.reduced || state.phase === 'skipped') return state;
  const { time, burstStart } = state, end = burstStart + duration;
  const entranceStart = end;
  return { ...state, end, entranceStart, entranceTime: time >= entranceStart ? time - entranceStart : null,
    done: time >= end, pointer: time >= end, burst: time >= end ? 1 : clamp01((time - burstStart) / duration),
    phase: time >= end ? 'entrance' : time >= burstStart ? 'burst' : state.phase };
}

const rgb = hex => [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16));
const mixRGB = (a, b, p) => a.map((v, k) => v + (b[k] - v) * p);
// Home attributes are float32, exactly as uploaded by stars.mjs. Sampling and mark size remain float64.
export function loaderScene(sample, W, H, viewport = { width: W, height: H, left: 0, top: 0 }) {
  const mark = placeMark(sample, W, H), centre = [viewport.width / 2 - viewport.left, viewport.height / 2 - viewport.top];
  const homes = makeStars(W, H).map(s => {
    const d = Math.fround(s.d), red = s.red;
    return { ...s, x: Math.fround(s.x), y: Math.fround(s.y) - Math.max(0, -viewport.top) * STARS.scroll * d, d, size: Math.fround(s.size),
      colour: mixRGB(rgb(STARS.ink), rgb(red ? STARS.redInk : STARS.paper), STARS.mix[0] + (STARS.mix[1] - STARS.mix[0]) * d) };
  });
  const points = mark.points.map((p, i) => {
    const edge = i % 4, q = hash(i, 19), gap = STARS.mark.size + 2;
    const start = edge === 0 ? [-gap, q * viewport.height] : edge === 1 ? [viewport.width + gap, q * viewport.height]
      : edge === 2 ? [q * viewport.width, -gap] : [q * viewport.width, viewport.height + gap];
    const x = centre[0] + p.x, y = centre[1] + p.y, sx = start[0] - viewport.left, sy = start[1] - viewport.top;
    const dx = x - sx, dy = y - sy, len = Math.max(1, Math.hypot(dx, dy)), bend = (hash(i, 20) - 0.5) * Math.min(W, H) * 0.16;
    return { x, y, size: STARS.mark.size, flag: markFlag(p.kind), colour: rgb(FLAG_INK[markFlag(p.kind)]),
      edge, start: [sx, sy], control: [(sx + x) / 2 - dy / len * bend, (sy + y) / 2 + dx / len * bend],
      home: null };
  });
  const weight = [centre[0] + mark.weight[0], centre[1] + mark.weight[1]];
  const angle = p => Math.atan2(p.y - weight[1], p.x - weight[0]);
  const order = list => list.map((p, i) => i).sort((a, b) => angle(list[a]) - angle(list[b]) || a - b);
  const markOrder = order(points), homeOrder = order(homes), paired = points.length, used = new Set();
  // L8: every mark star gets a home. Fewer homes share consecutive angular ranks;
  // more homes keep L7's evenly spaced selection, with the others fading in at home.
  for (let rank = 0; rank < paired; rank++) {
    const i = markOrder[Math.floor(rank * points.length / paired)], home = homeOrder[Math.floor(rank * homes.length / paired)];
    points[i].home = home; used.add(home);
  }
  const unpairedHomes = homeOrder.filter(i => !used.has(i));
  for (const m of points) m.duration = loaderDuration(homes[m.home], m.home);
  const duration = Math.max(...points.map(m => m.duration));
  // Earliest crossing of each radius by any ray, including a star that later lands.
  // Solve in eased progress, then invert the cubic: no frame-step or browser clock approximation.
  const rays = points.map(m => {
    const x = (m.x - weight[0]) * 1.10, y = (m.y - weight[1]) * 1.10, home = homes[m.home];
    const dx = home.x - weight[0] - x, dy = home.y - weight[1] - y;
    return { x, y, dx, dy, a: dx * dx + dy * dy, b: 2 * (x * dx + y * dy), duration: m.duration };
  });
  const wave = unpairedHomes.map(i => {
    const home = homes[i], radius2 = (home.x - weight[0]) ** 2 + (home.y - weight[1]) ** 2;
    let start = Infinity;
    for (const ray of rays) {
      const c = ray.x * ray.x + ray.y * ray.y - radius2;
      if (c < 0 && (ray.a === 0 || ray.a + ray.b + c <= 0)) continue;
      const g = c >= 0 ? 0 : clamp01((-ray.b + Math.sqrt(ray.b * ray.b - 4 * ray.a * c)) / (2 * ray.a));
      start = Math.min(start, ray.duration * (1 - Math.cbrt(1 - g)));
    }
    return { home: i, start };
  });
  return { W, H, centre, weight, mark, points, homes, unpairedHomes, duration, wave };
}
function flightPoint(m, flight) {
  const t = 1 - (1 - flight) ** 3, u = 1 - t;
  return [u * u * m.start[0] + 2 * u * t * m.control[0] + t * t * m.x,
    u * u * m.start[1] + 2 * u * t * m.control[1] + t * t * m.y];
}
function burstPoint(m, home, weight, time) {
  const p = clamp01(time / m.duration), blend = 1 - (1 - p) ** 3;
  const x = weight[0] + (m.x - weight[0]) * 1.10, y = weight[1] + (m.y - weight[1]) * 1.10;
  return { x: p === 1 ? home.x : x + (home.x - x) * blend,
    y: p === 1 ? home.y : y + (home.y - y) * blend, blend };
}
const trail = (x, y, tail) => ({ tail, streak: Math.hypot(x - tail[0], y - tail[1]) });
// L9: preserve L7's lines and L8's homes; depth breaks up the scaled-picture look.
export function loaderDots(scene, state) {
  const { points, homes, weight } = scene, dots = [];
  const done = state.burstTime !== null && state.time >= state.burstStart + scene.duration, landed = new Set();
  const elapsed = done ? Math.max(scene.duration, state.burstTime) : state.burstTime;
  for (let i = 0; i < points.length; i++) {
    const m = points[i], home = homes[m.home];
    if (state.reduced) { dots.push({ ...m, alpha: 1 }); continue; }
    const flight = clamp01((state.time - state.launches[i]) / LOADER.flight);
    if (!(flight > 0)) continue;
    if (state.burstTime === null) {
      if (state.time >= state.formedAt) {
        dots.push({ ...m, x: weight[0] + (m.x - weight[0]) * state.scale,
          y: weight[1] + (m.y - weight[1]) * state.scale, size: m.size * state.charge, alpha: 1 });
        continue;
      }
      const [x, y] = flightPoint(m, flight), tail = flightPoint(m, clamp01((state.time - state.launches[i] - 1 / 50) / LOADER.flight));
      dots.push({ ...m, x, y, ...trail(x, y, tail), alpha: 1 });
      continue;
    }
    // Shared stars have the same home/depth/hash, so merge at their own landing.
    const arrived = state.time >= state.burstStart + m.duration;
    if (arrived) {
      if (landed.has(m.home)) continue;
      landed.add(m.home);
    }
    const target = home, { x, y, blend } = burstPoint(m, target, weight, arrived ? m.duration : elapsed);
    const previous = burstPoint(m, target, weight, Math.max(0, elapsed - 1 / 50));
    const depth = 1 + 1.6 * Math.max(0, target.d - 0.4) * Math.sin(Math.PI * blend);
    const flare = 1 + 0.7 * (1 - clamp01(elapsed / 0.3)) ** 3;
    dots.push({ x, y, ...trail(x, y, [previous.x, previous.y]),
      size: blend === 1 ? target.size : (m.size + (target.size - m.size) * blend) * depth * flare,
      colour: blend === 1 ? target.colour : mixRGB(m.colour, target.colour, blend),
      flag: blend === 1 ? 0 : m.flag, star: i, home: m.home, alpha: 1 });
  }
  if (elapsed !== null) for (const { home: i, start } of scene.wave) {
    // A home beyond every ray has no wave crossing. Preserve the exact field handover there.
    const alpha = done ? 1 : 1 - (1 - clamp01((elapsed - start) / 0.2)) ** 3;
    dots.push({ ...homes[i], home: i, flag: 0, alpha });
  }
  return dots;
}
