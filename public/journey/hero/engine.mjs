// Journey hero: the maths and the geometry of a bar. No drawing happens here.
// Units: W = 1 is the stripe width. World axes: X toward the lower right of the screen, Y up, Z toward the lower left.

export const W = 1, T = 0.3, GAP = 0.2997;
export const SA = 28.3 * Math.PI / 180;                     // the stripe angle from the DG mark
const SIN_PHI = Math.tan(SA), COS_PHI = Math.sqrt(1 - SIN_PHI * SIN_PHI);
export const HALO = GAP * COS_PHI * Math.cos(SA);           // 0.2224 W: the gap, as it measures on screen between two wall bars

export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
export const norm = a => { const l = Math.hypot(a[0], a[1], a[2]); return [a[0] / l, a[1] / l, a[2] / l]; };
export const lerp = (a, b, t) => a + (b - a) * t;
export const lerp3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
export const rotY = (p, deg) => { const t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t); return [p[0] * c + p[2] * s, p[1], -p[0] * s + p[2] * c]; };
export const rotAxis = (p, k, rad) => { const c = Math.cos(rad), s = Math.sin(rad); return add(add(mul(p, c), mul(cross(k, p), s)), mul(k, dot(k, p) * (1 - c))); };   // turn p about the unit axis k
export const rotX = (p, deg) => { const t = deg * Math.PI / 180, c = Math.cos(t), s = Math.sin(t); return [p[0], p[1] * c - p[2] * s, p[1] * s + p[2] * c]; };

// ---- camera: orthographic. Home view: yaw 45deg, elevation asin(tan 28.3deg), so both ground axes sit at exactly 28.3deg on screen.
export function makeCamera(yaw = 0, pitch = 0) {            // offsets from the home view, in degrees
  const y = (45 + yaw) * Math.PI / 180, phi = Math.asin(SIN_PHI) + pitch * Math.PI / 180;
  const c = Math.cos(phi), s = Math.sin(phi);
  return {
    v: [c * Math.sin(y), s, c * Math.cos(y)],               // toward the camera
    r: [Math.cos(y), 0, -Math.sin(y)],                      // screen right
    u: [-s * Math.sin(y), c, -s * Math.cos(y)],             // screen up
  };
}
export const HOME = makeCamera();
export const project = (p, cam, S, cx, cy) => [cx + S * dot(cam.r, p), cy - S * dot(cam.u, p)];

// ---- rotations as quaternions [x, y, z, w]
export function quatFromBasis(ex, ey) {
  const ez = cross(ex, ey);
  const m00 = ex[0], m01 = ey[0], m02 = ez[0], m10 = ex[1], m11 = ey[1], m12 = ez[1], m20 = ex[2], m21 = ey[2], m22 = ez[2];
  const tr = m00 + m11 + m22; let q;
  if (tr > 0) { const s = Math.sqrt(tr + 1) * 2; q = [(m21 - m12) / s, (m02 - m20) / s, (m10 - m01) / s, s / 4]; }
  else if (m00 > m11 && m00 > m22) { const s = Math.sqrt(1 + m00 - m11 - m22) * 2; q = [s / 4, (m01 + m10) / s, (m02 + m20) / s, (m21 - m12) / s]; }
  else if (m11 > m22) { const s = Math.sqrt(1 + m11 - m00 - m22) * 2; q = [(m01 + m10) / s, s / 4, (m12 + m21) / s, (m02 - m20) / s]; }
  else { const s = Math.sqrt(1 + m22 - m00 - m11) * 2; q = [(m02 + m20) / s, (m12 + m21) / s, s / 4, (m10 - m01) / s]; }
  return q;
}
export function quatSlerp(a, b, t) {
  let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  if (d < 0) { b = b.map(x => -x); d = -d; }
  if (d > 0.9995) { const q = a.map((x, i) => lerp(x, b[i], t)); const l = Math.hypot(...q); return q.map(x => x / l); }
  const th = Math.acos(d), s = Math.sin(th), wa = Math.sin((1 - t) * th) / s, wb = Math.sin(t * th) / s;
  return a.map((x, i) => x * wa + b[i] * wb);
}
export function quatRotate(q, p) {
  const [x, y, z, w] = q, u = [x, y, z];
  const uv = cross(u, p), uuv = cross(u, uv);
  return add(p, add(mul(uv, 2 * w), mul(uuv, 2)));
}

// ---- cubic bezier easing, as in CSS
export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx, cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const fx = t => ((ax * t + bx) * t + cx) * t, fy = t => ((ay * t + by) * t + cy) * t, dfx = t => (3 * ax * t + 2 * bx) * t + cx;
  return x => {
    if (x <= 0) return 0; if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) { const e = fx(t) - x; if (Math.abs(e) < 1e-7) break; const d = dfx(t); if (Math.abs(d) < 1e-7) break; t -= e / d; }
    if (!(t >= 0 && t <= 1) || Math.abs(fx(t) - x) > 1e-5) { let lo = 0, hi = 1; t = x; for (let i = 0; i < 40; i++) { const e = fx(t) - x; if (e > 0) hi = t; else lo = t; t = (lo + hi) / 2; } }
    return fy(t);
  };
}
export const EASE = {
  wipe: bezier(0.475, 0, 0.075, 1),      // the brand wipe: every move from one pose to the next
  enter: bezier(0.23, 1, 0.32, 1),       // something arriving or letting go
  exit: bezier(0.5, 0, 0.75, 0),         // something leaving or striking: it accelerates into the hit
};

// ---- a bar
// { id, c, ex, ey, len, arms, drop, half, lab, col, wipe }
//   c      centre of the main run (world)
//   ex ey  unit axes: along the run, and across it (the label's up). ez = ex x ey is the labelled face.
//   len    length of the centre line of the main run. Ends are square caps, so the solid is len + W long.
//   arms   0..1, only the frame bar: two arms draw from the ends of the main run, down `drop` and in `half` to meet.
//   lab    where the label starts, measured along ex from c
//   col    'paper' | 'red'.  wipe: null or { to, x }: the first x (0..1) of the solid's length is already colour `to`.
export const TONES = {
  paper: { face: '#F7F6F3', up: '#B9B4AE', side: '#706966', text: '#151314' },
  red: { face: '#C0262E', up: '#A31D25', side: '#7A151B', text: '#FFFFFF' },
};
export const INK = '#151314';

// cells: axis-aligned rectangles in the bar's own plane (x along ex, y along ey), each extruded T thick
export function barCells(bar) {
  const h = bar.len / 2;
  let rects;
  if (bar.arms > 1e-6) {
    const D = bar.drop, B = bar.half, path = [[0, -D], [-h, -D], [-h, 0], [h, 0], [h, -D], [0, -D]];
    const a0 = B + D, a1 = a0 + bar.len, reach = (B + D) * bar.arms;
    rects = trimRects(path, a0 - reach, a1 + reach);
  } else rects = [{ x0: -h - W / 2, x1: h + W / 2, y0: -W / 2, y1: W / 2 }];
  const xs = [...new Set(rects.flatMap(r => [r.x0, r.x1]).map(v => +v.toFixed(6)))].sort((a, b) => a - b);
  const ys = [...new Set(rects.flatMap(r => [r.y0, r.y1]).map(v => +v.toFixed(6)))].sort((a, b) => a - b);
  let cut = null;
  if (bar.wipe && bar.arms <= 1e-6 && bar.wipe.x > 1e-6 && bar.wipe.x < 1 - 1e-6) { cut = -h - W / 2 + (bar.len + W) * bar.wipe.x; xs.push(cut); xs.sort((a, b) => a - b); }
  const filled = (x, y) => rects.some(r => x > r.x0 && x < r.x1 && y > r.y0 && y < r.y1);
  const cells = [];
  for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) {
    const mx = (xs[i] + xs[i + 1]) / 2, my = (ys[j] + ys[j + 1]) / 2;
    if (!filled(mx, my)) continue;
    let color = bar.col;
    if (bar.wipe) { if (cut !== null) color = mx < cut ? bar.wipe.to : bar.col; else if (bar.wipe.x >= 1 - 1e-6) color = bar.wipe.to; }
    cells.push({ i, j, x0: xs[i], x1: xs[i + 1], y0: ys[j], y1: ys[j + 1], color });
  }
  return cells;
}
function trimRects(path, t0, t1) {
  const rects = []; let acc = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i], b = path[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]), d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
    const s0 = acc, s1 = acc + len; acc = s1;
    const lo = Math.max(t0, s0), hi = Math.min(t1, s1);
    if (hi - lo < 1e-9) continue;
    const p0 = [a[0] + d[0] * (lo - s0) - d[0] * W / 2, a[1] + d[1] * (lo - s0) - d[1] * W / 2];
    const p1 = [a[0] + d[0] * (hi - s0) + d[0] * W / 2, a[1] + d[1] * (hi - s0) + d[1] * W / 2];
    const nx = -d[1] * W / 2, ny = d[0] * W / 2;
    const xs = [p0[0] + nx, p0[0] - nx, p1[0] + nx, p1[0] - nx], ys = [p0[1] + ny, p0[1] - ny, p1[1] + ny, p1[1] - ny];
    rects.push({ x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) });
  }
  return rects;
}

const point = (bar, ez, x, y, z) => add(bar.c, add(mul(bar.ex, x), add(mul(bar.ey, y), mul(ez, z))));

// visible faces of a bar: [{ pts, n, main, color }]
export function barFaces(bar, cam) {
  const cells = barCells(bar), ez = cross(bar.ex, bar.ey), h = T / 2, P = (x, y, z) => point(bar, ez, x, y, z);
  const at = (i, j) => cells.find(c => c.i === i && c.j === j);
  const out = [];
  for (const c of cells) {
    const { x0, x1, y0, y1 } = c;
    const cand = [
      { n: ez, main: true, pts: [P(x0, y0, h), P(x1, y0, h), P(x1, y1, h), P(x0, y1, h)] },
      { n: mul(ez, -1), main: true, pts: [P(x0, y0, -h), P(x0, y1, -h), P(x1, y1, -h), P(x1, y0, -h)] },
      { n: bar.ex, hide: at(c.i + 1, c.j), pts: [P(x1, y0, -h), P(x1, y1, -h), P(x1, y1, h), P(x1, y0, h)] },
      { n: mul(bar.ex, -1), hide: at(c.i - 1, c.j), pts: [P(x0, y0, -h), P(x0, y0, h), P(x0, y1, h), P(x0, y1, -h)] },
      { n: bar.ey, hide: at(c.i, c.j + 1), pts: [P(x0, y1, -h), P(x0, y1, h), P(x1, y1, h), P(x1, y1, -h)] },
      { n: mul(bar.ey, -1), hide: at(c.i, c.j - 1), pts: [P(x0, y0, -h), P(x1, y0, -h), P(x1, y0, h), P(x0, y0, h)] },
    ];
    for (const f of cand) if (!f.hide && dot(f.n, cam.v) > 1e-6) out.push({ pts: f.pts, n: f.n, main: !!f.main, color: c.color });
  }
  return out;
}
// the eight corners of every cell, for the knockout and for the collision check
export function barBoxes(bar) {
  const ez = cross(bar.ex, bar.ey), h = T / 2;
  return barCells(bar).map(c => {
    const corners = [];
    for (const x of [c.x0, c.x1]) for (const y of [c.y0, c.y1]) for (const z of [-h, h]) corners.push(point(bar, ez, x, y, z));
    return { corners, centre: point(bar, ez, (c.x0 + c.x1) / 2, (c.y0 + c.y1) / 2, 0), axes: [bar.ex, bar.ey, ez], half: [(c.x1 - c.x0) / 2, (c.y1 - c.y0) / 2, h] };
  });
}
export function hull2(points) {                              // convex hull of 2D points, counter-clockwise
  const p = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lo = [], up = [];
  for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 1e-9) lo.pop(); lo.push(q); }
  for (const q of p.slice().reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 1e-9) up.pop(); up.push(q); }
  return lo.slice(0, -1).concat(up.slice(0, -1));
}
