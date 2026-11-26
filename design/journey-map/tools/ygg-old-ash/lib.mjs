// Small drawing kit for the Yggdrasil sketches. Units: map units, origin at the tree's foot, y down.
export const rnd = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
export const n1 = v => Math.round(v * 10) / 10;
export const LAND = '#1F1C1D', INK = '#151314', PAPER = '#F7F6F3';
// Catmull-Rom through points
export function spline(P, closed = false, seg = 8) {
  const n = P.length, out = [], g = i => closed ? P[(i + n) % n] : P[Math.max(0, Math.min(n - 1, i))];
  for (let i = 0; i < (closed ? n : n - 1); i++) { const a = g(i - 1), b = g(i), c = g(i + 1), d = g(i + 2);
    for (let j = 0; j < seg; j++) { const t = j / seg, t2 = t * t, t3 = t2 * t; out.push([0, 1].map(k => .5 * (2 * b[k] + (c[k] - a[k]) * t + (2 * a[k] - 5 * b[k] + 4 * c[k] - d[k]) * t2 + (3 * b[k] - a[k] - 3 * c[k] + d[k]) * t3))); } }
  if (!closed) out.push(P[n - 1]); return out;
}
// smooth path through points using midpoint quadratics
export function smooth(P, closed = false) {
  const m = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], f = p => n1(p[0]) + ' ' + n1(p[1]);
  if (closed) { let d = 'M' + f(m(P[P.length - 1], P[0])); P.forEach((p, i) => { d += 'Q' + f(p) + ' ' + f(m(p, P[(i + 1) % P.length])); }); return d + 'Z'; }
  if (P.length < 3) return 'M' + P.map(f).join('L');
  let d = 'M' + f(P[0]); for (let i = 1; i < P.length - 1; i++) d += 'Q' + f(P[i]) + ' ' + f(i === P.length - 2 ? P[i + 1] : m(P[i], P[i + 1])); return d;
}
const area = P => P.reduce((s, p, i) => { const q = P[(i + 1) % P.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0);
// tapered limb: centre points [x,y,width]; returns polygon (consistent winding)
export function limb(C, { seg = 6, wob = 0, r = Math.random, tip = true } = {}) {
  const S = spline(C.map(c => [c[0], c[1]]), false, seg), W = spline(C.map((c, i) => [i, c[2]]), false, seg).map(p => p[1]);
  const L = [], R = [];
  S.forEach((p, i) => { const a = S[Math.max(0, i - 1)], b = S[Math.min(S.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, w = Math.max(.15, W[i] / 2 * (1 + wob * (r() - .5)));
    L.push([p[0] + dy / l * w, p[1] - dx / l * w]); R.push([p[0] - dy / l * w, p[1] + dx / l * w]); });
  const P = [...L, ...R.reverse()]; return area(P) < 0 ? P.reverse() : P;
}
export const centre = (C, seg = 6) => spline(C.map(c => [c[0], c[1]]), false, seg);
// union look: one outline round a set of overlapping shapes
export function union(polys, { fill = LAND, cls = 'g', w = 2.3 } = {}) {
  const d = polys.map(P => smooth(P, true)).join('');
  return `<path class="${cls}" style="stroke-width:${w}" d="${d}"/><path d="${d}" fill="${fill}" stroke="none"/>`;
}
// scalloped closed outline round a loop of points
export function scallop(P, r, { step = 6, bump = [.3, .25], jit = .35 } = {}) {
  const S = spline(P, true, 10), pts = []; let acc = 0, next = 0;
  S.forEach((p, i) => { const q = S[(i + 1) % S.length]; acc += Math.hypot(q[0] - p[0], q[1] - p[1]); if (acc >= next) { pts.push(p); next = acc + step * (1 - jit / 2 + r() * jit); } });
  const cw = area(pts) > 0 ? 1 : -1, f = p => n1(p[0]) + ' ' + n1(p[1]); let d = 'M' + f(pts[0]);
  pts.forEach((a, i) => { const b = pts[(i + 1) % pts.length], dx = b[0] - a[0], dy = b[1] - a[1], k = (bump[0] + r() * bump[1]) * cw;
    d += 'Q' + f([(a[0] + b[0]) / 2 + dy * k * 2, (a[1] + b[1]) / 2 - dx * k * 2]) + ' ' + f(b); });
  return { d: d + 'Z', pts };
}
export const inside = (p, P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) if ((P[i][1] > p[1]) !== (P[j][1] > p[1]) && p[0] < (P[j][0] - P[i][0]) * (p[1] - P[i][1]) / (P[j][1] - P[i][1]) + P[i][0]) c = !c; return c; };
export const blob = (cx, cy, rx, ry, r, n = 9, j = .18) => Array.from({ length: n }, (_, i) => { const a = i / n * Math.PI * 2, k = 1 + (r() - .5) * 2 * j; return [cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]; });
