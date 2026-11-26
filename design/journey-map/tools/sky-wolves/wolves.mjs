// Sköll and Hati, take 3. Wolf faces +x, y down. Outline traced head -> back -> tail -> belly -> chest -> jaw,
// which in screen space puts the outside on the right of the direction of travel: outward normal = (-ty, tx).
import { WOLF } from './wolf-base.mjs';
const f = n => +n.toFixed(2);
const P = p => `${f(p[0])} ${f(p[1])}`;
const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const bulge = (a, b, k) => { const dx = b[0] - a[0], dy = b[1] - a[1], m = lerp(a, b, 0.5); return [m[0] - dy * k, m[1] + dx * k]; };
// A run of tufts along the straight base A->B (continuing the current subpath, which must sit at A).
// h: heights (cycled), tipT: where the tip sits along each tuft's base, lean: world offset added to each tip,
// k1/k2: bulge of the two edges (+ convex, - concave).
export const tufts = (A, B, n, h, tipT, lean, k1 = 0.18, k2 = -0.12) => {
  const dx = B[0] - A[0], dy = B[1] - A[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  let d = '';
  for (let i = 0; i < n; i++) {
    const p0 = lerp(A, B, i / n), p1 = lerp(A, B, (i + 1) / n), m = lerp(p0, p1, tipT), hh = h[i % h.length];
    const tip = [m[0] + nx * hh + lean[0], m[1] + ny * hh + lean[1]];
    d += `Q${P(bulge(p0, tip, k1))} ${P(tip)}Q${P(bulge(tip, p1, k2))} ${P(p1)}`;
  }
  return d;
};
const spiral = (cx, cy, r0, r1, turns, start, dir = 1) => { let d = ''; const n = 28; for (let i = 0; i <= n; i++) { const t = i / n, a = start + dir * t * turns * Math.PI * 2, r = r0 + (r1 - r0) * t; d += (i ? 'L' : 'M') + f(cx + Math.cos(a) * r) + ' ' + f(cy + Math.sin(a) * r); } return d; };
const crescent = (cx, cy, R, rot) => { const a = rot * Math.PI / 180, p = (x, y) => [f(cx + x * Math.cos(a) - y * Math.sin(a)), f(cy + x * Math.sin(a) + y * Math.cos(a))]; const A = p(0, -R), B = p(0, R); return `M${A[0]} ${A[1]}A${R} ${R} 0 0 1 ${B[0]} ${B[1]}A${f(R * 1.25)} ${f(R * 1.25)} 0 0 0 ${A[0]} ${A[1]}Z`; };

// Sköll: the sun wolf. The sketch's sleek wolf, long and light, ears up, smooth coat, sun spirals.
export const SKOLL = {
  ...WOLF,
  marks: [spiral(12.6, -2.6, 0.6, 3.6, 1.15, 0.6), spiral(-19.4, -3.2, 0.6, 3.8, 1.15, 2.6, -1)],
  lines: ['M17.2 -14Q15.6 -10 16.8 -6.4', 'M-36.6 -8.6Q-44.6 -9.6 -52.6 -9', 'M29.6 -10.6Q27.8 -8.4 26.8 -5.6'],
};

// Hati: the moon wolf. Heavier and shaggier: head carried low, ears laid back, a swept mane,
// a big tufted tail, a fringed belly and throat, a broad jaw with two fangs, moon crescents.
const hatiBody = (() => {
  let d = 'M41.6 -6.2';
  d += 'C40.4 -8.6 37.4 -10.4 33.6 -11.8';            // top of the snout
  d += 'C31.8 -13.6 30 -14.8 28.2 -15.2';              // brow
  d += 'L21.6 -19.6L24.4 -15.4';                        // near ear, laid back
  d += 'L18.8 -18.2L21 -14.6';                          // far ear
  d += tufts([21, -14.6], [1.6, -16], 4, [4.4, 5.8, 5.4, 4.2], 0.92, [-3, 0.4], 0.24, -0.12); // mane over the neck
  d += 'C-6 -15.2 -12.4 -14.2 -18 -13.6';               // back
  d += 'C-22.4 -13.4 -25.6 -13 -28 -11.6';              // rump
  d += tufts([-28, -11.6], [-58, -12.8], 4, [3.2, 4, 4.2, 3.4], 0.85, [-2.6, 0.6], 0.22, -0.1); // top of the tail
  d += 'L-63.4 -8.8';                                   // tail tip
  d += tufts([-63.4, -8.8], [-31, -1.6], 4, [2.6, 3.4, 3.6, 3], 0.12, [-2.6, 0.4], -0.1, 0.22); // under the tail
  d += 'C-28.8 2.4 -23 5 -16.6 5.2';                    // haunch
  d += tufts([-16.6, 5.2], [7.4, 9.6], 4, [2.4, 2.8, 2.8, 2.4], 0.12, [-1.6, 0.2], -0.1, 0.22); // belly fringe
  d += 'C11.4 9.8 15.2 8.8 18.2 6.6';                   // chest
  d += tufts([18.2, 6.6], [28.8, -1.6], 3, [2.4, 3, 2.6], 0.12, [-1.4, 1], -0.1, 0.22); // throat ruff
  d += 'C32.4 -2.2 36 -2.4 38.8 -2.6';                  // broad lower jaw
  d += 'C39.8 -2.8 40.2 -3.2 39.6 -3.6';
  d += 'L37.4 -4.2L36.9 -5.9L35.9 -4.5';                // lower fang
  d += 'L32.8 -5.4L37 -6.4L37.5 -4.8L38.4 -6.7';        // back of the mouth and upper fang
  d += 'L40.6 -6.4C41.4 -6.4 41.8 -6 41.6 -6.2Z';
  return d;
})();
export const HATI = {
  front: 'M5 -10C0 -4 2 4 9.5 9C14 12 19 13.6 23.6 14.6C26.2 15 28.4 16.2 31 16C32.8 15.6 33 13.8 31.4 13.2C29 12.2 27 12 24.8 11C21.2 9.6 19.8 7 19.2 4C18.6 1 19.2 -2.6 18 -5.6C15.8 -10.2 10 -11.6 5 -10Z',
  hind: 'M-12 -10.6C-9.4 -4.6 -10.4 2.4 -15.4 6.8C-19.6 10 -24.8 11 -29.6 12C-33.8 12.8 -37.8 14 -41.2 15C-43.8 15.6 -45.8 15.2 -45.4 13.6C-45 12.4 -43.2 12 -41.2 11.6C-38 10.8 -34.4 9.6 -31.2 8C-28.4 6.4 -27.4 3 -27.6 -1C-27.8 -5.8 -25.2 -9.8 -21 -11.2C-17.6 -12.4 -14 -12.2 -12 -10.6Z',
  farFrontT: 'translate(-2.6 2) rotate(13 10 -2)', farHindT: 'translate(2 1.6) rotate(-12 -19 -4)',
  body: hatiBody,
  marks: [crescent(12.6, -2.4, 3.6, -30), crescent(-19.4, -3.2, 3.8, -30)],
  lines: ['M-40 -9.4Q-47 -10.4 -54 -9.8', 'M29.6 -9Q28 -7.2 27.2 -4.8'],
  eye: 'M29.2 -11.4L32.2 -10.6L29.4 -9.8Z',
};

const C = { paper: '#F7F6F3', warm: '#FF8A4C', ink: '#151314' };
// look: { outline, fill, mark, markW, markA, eye }
export const LOOKS = {
  skoll: { outline: C.paper, fill: C.ink, mark: C.warm, markW: 1.1, markA: 1, eye: C.warm },
  skollWarm: { outline: C.warm, fill: C.ink, mark: C.warm, markW: 1.1, markA: 1, eye: C.warm },
  hati: { outline: C.paper, fill: C.ink, mark: C.paper, markW: 0.9, markA: 0.75, eye: C.paper },
  hatiGrey: { outline: C.paper, fill: '#4A4541', mark: C.paper, markW: 0.9, markA: 0.85, eye: C.paper },
  hatiLine: { outline: C.paper, fill: '#2E2B29', mark: C.paper, markW: 0.9, markA: 0.8, eye: C.paper },
};
export const wolfSvg3 = (W, look) => {
  const o = `fill="${look.fill}" stroke="${look.outline}" stroke-width="1.1" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"`;
  const t = `fill="none" stroke="${look.outline}" stroke-opacity=".5" stroke-width=".7" vector-effect="non-scaling-stroke" stroke-linecap="round"`;
  const leg = (k, d, tr) => `<g data-leg="${k}"><path ${o}${tr ? ` transform="${tr}"` : ''} d="${d}"/></g>`;
  const mark = `stroke="${look.mark}" stroke-opacity="${look.markA}" stroke-width="${look.markW}" fill="none" vector-effect="non-scaling-stroke" stroke-linecap="round"`;
  return leg('ff', W.front, W.farFrontT) + leg('fh', W.hind, W.farHindT) + `<path ${o} d="${W.body}"/>` + leg('nh', W.hind) + leg('nf', W.front)
    + `<g class="sk-detail">${W.lines.map(d => `<path ${t} d="${d}"/>`).join('')}${W.marks.map(d => `<path ${mark} d="${d}"/>`).join('')}<path fill="${look.eye}" stroke="none" d="${W.eye}"/></g>`;
};
