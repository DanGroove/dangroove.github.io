// Sköll and Hati, the base wolf (Sköll) and the sun and moon. Wolf faces +x, y down, about 100 units nose to tail tip.
const f = n => +n.toFixed(2);
const spiral = (cx, cy, r0, r1, turns, start, dir = 1) => { let d = ''; const n = 28; for (let i = 0; i <= n; i++) { const t = i / n, a = start + dir * t * turns * Math.PI * 2, r = r0 + (r1 - r0) * t; d += (i ? 'L' : 'M') + f(cx + Math.cos(a) * r) + ' ' + f(cy + Math.sin(a) * r); } return d; };
export const WOLF = {
  front: 'M6 -10C2 -4 4 4 10.5 8.6C15 11.6 20 13.2 24.6 14C27.2 14.4 29.4 15.4 32 15C33.6 14.6 33.8 13 32.4 12.4C30 11.6 28 11.6 25.8 10.8C22.2 9.6 20.6 7.2 19.8 4.4C19.2 1.6 19.6 -2 18.6 -5C16.6 -9.6 11 -11.4 6 -10Z',
  hind: 'M-12 -10.6C-9.6 -5 -10.6 2 -15.4 6.2C-19.4 9.2 -24.6 10.4 -29.4 11.4C-33.6 12.2 -38 13.4 -41.6 14.4C-44.2 15 -46.2 14.6 -45.8 13C-45.4 11.8 -43.6 11.4 -41.6 11C-38.4 10.2 -34.6 9 -31.4 7.4C-28.6 5.8 -27.4 2.6 -27.4 -1.2C-27.4 -5.6 -25 -9.4 -21 -11C-17.6 -12.2 -14 -12 -12 -10.6Z',
  farFrontT: 'translate(-2.6 2) rotate(13 10 -2)', farHindT: 'translate(2 1.6) rotate(-12 -19 -4)',
  body: 'M40.6 -9.2C39 -11 35.8 -12.2 32.2 -13.2C30.6 -15.4 29 -17 27 -17.8L23.6 -25.2L21.8 -18.4L19.8 -24.2L18.2 -17.6C16.2 -17.8 14 -17.6 12.6 -16.6C10.6 -15.4 8.4 -14.8 6 -14.4C-3 -12.6 -10 -11.6 -17 -12.2C-21.4 -12.6 -24.8 -12.2 -27.4 -10.6C-34 -14.2 -43.6 -15 -50.4 -13.4C-54.4 -12.4 -57.6 -10.4 -59 -8.2C-53.6 -5.8 -46 -4.4 -38.6 -4.4C-33.6 -4.2 -30.4 -3 -28.8 -0.8C-26.4 2.8 -21 4.8 -15.4 4.4C-9 4 -3 7.6 4 8.8C9.4 9.6 14.6 9.2 18.6 6.2C21.6 3.8 23.4 0.6 25 -1.2L24.4 1L26.6 -0.4L28.6 -2.2C31.6 -3 35.4 -3.6 38.4 -4.2C39.2 -4.4 39.6 -4.8 39.2 -5.2L32.6 -7.4L37.4 -7.9L37.9 -6.4L38.5 -8.1L40.2 -8.3C40.8 -8.4 40.9 -8.9 40.6 -9.2Z',
  lines: [spiral(12.6, -2.6, 0.6, 3.6, 1.15, 0.6), spiral(-19.4, -3.2, 0.6, 3.8, 1.15, 2.6, -1), 'M17.2 -14Q15.6 -10 16.8 -6.4', 'M13 -14.6Q11.8 -11.4 12.8 -8.8', 'M-36.6 -8.6Q-44.6 -9.6 -52.6 -9', 'M29.6 -10.6Q27.8 -8.4 26.8 -5.6'],
  eye: 'M28.6 -13.2L31.2 -12.4L28.8 -11.8Z',
};
export const sunPath = (r = 6.4, n = 12, r1 = 8.6, long = 13, short = 11, w = 1.25) => {
  let d = `M${r} 0A${r} ${r} 0 1 1 ${-r} 0A${r} ${r} 0 1 1 ${r} 0Z`;
  for (let i = 0; i < n; i++) {
    const a = i / n * Math.PI * 2, L = i % 2 ? short : long, c = Math.cos(a), s = Math.sin(a), px = -s, py = c;
    d += `M${f(c * r1 + px * w)} ${f(s * r1 + py * w)}L${f(c * L)} ${f(s * L)}L${f(c * r1 - px * w)} ${f(s * r1 - py * w)}Z`;
  }
  return d;
};
// crescent: outer circle r R at 0,0 minus a circle r Ri at (ox, oy)
export const moonPaths = (R = 7.4, Ri = 6.4, ox = 3.4, oy = -2.2) => {
  const d = Math.hypot(ox, oy), a = (R * R - Ri * Ri + d * d) / (2 * d), h = Math.sqrt(R * R - a * a);
  const ux = ox / d, uy = oy / d, mx = ux * a, my = uy * a;
  const p1 = [mx - uy * h, my + ux * h], p2 = [mx + uy * h, my - ux * h];
  const crescent = `M${f(p1[0])} ${f(p1[1])}A${R} ${R} 0 1 1 ${f(p2[0])} ${f(p2[1])}A${Ri} ${Ri} 0 1 0 ${f(p1[0])} ${f(p1[1])}Z`;
  const ghost = `M${R} 0A${R} ${R} 0 1 1 ${-R} 0A${R} ${R} 0 1 1 ${R} 0`;
  return { crescent, ghost };
};
export const wolfSvg = (cls = '') => `<g class="${cls}"><path class="o" transform="${WOLF.farFrontT}" d="${WOLF.front}"/><path class="o" transform="${WOLF.farHindT}" d="${WOLF.hind}"/><path class="o" d="${WOLF.body}"/><path class="o" d="${WOLF.hind}"/><path class="o" d="${WOLF.front}"/>${WOLF.lines.map(d => `<path class="t" d="${d}"/>`).join('')}<path class="pf" d="${WOLF.eye}"/></g>`;
export const sunSvg = () => `<path class="pf" d="${sunPath()}"/>`;
export const moonSvg = () => { const m = moonPaths(); return `<path class="t" d="${m.ghost}"/><path class="pf" d="${m.crescent}"/>`; };
