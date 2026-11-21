// Second take: the building kit. Every helper returns one piece (see sq.mjs), in world units (1 = the stripe width of v1).
// World axes as before: X toward the lower right of the screen, Y up, Z toward the lower left.
import { add, sub, mul, cross, norm, quatRotate } from '../../../public/journey/hero/engine.mjs';

export const SHARP = 0.03;
export const qAxis = (axis, deg) => { const h = deg * Math.PI / 360, s = Math.sin(h), n = norm(axis); return [n[0] * s, n[1] * s, n[2] * s, Math.cos(h)]; };
export const qMul = (a, b) => [                             // b first, then a
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2],
];
const ID = [0, 0, 0, 1];
// the rotation that carries local +z onto a world axis
const AXIS = { 'z': ID, '-z': qAxis([0, 1, 0], 180), 'y': qAxis([1, 0, 0], -90), '-y': qAxis([1, 0, 0], 90), 'x': qAxis([0, 1, 0], 90), '-x': qAxis([0, 1, 0], -90) };

// a box by its centre and full sizes along world x, y, z
export const box = (tone, c, size, o = {}) => ({ tone, p: c.slice(), q: ID, s: size.map(v => v / 2), e: [o.round ?? SHARP, o.round ?? SHARP], taper: [0, 0], shear: o.shear || 0, ...o.more });
// a cylinder: centre, the world axis it runs along, radius, length
export const cyl = (tone, c, axis, r, len, o = {}) => ({ tone, p: c.slice(), q: AXIS[axis], s: [r, o.r2 ?? r, len / 2], e: [o.cap ?? SHARP, o.round ?? 1], taper: [o.taper || 0, o.taper || 0], shear: 0, ...o.more });
// a ball
export const ball = (tone, c, r, o = {}) => ({ tone, p: c.slice(), q: ID, s: [r, r, r], e: [1, 1], taper: [0, 0], shear: 0, ...o.more });
// a cone: base centre at one end, narrowing along the axis to `top` times the radius
export const cone = (tone, c, axis, r, len, top = 0, o = {}) => cyl(tone, c, axis, r, len, { ...o, taper: 1 - top });
// a wedge: a box whose local x narrows to nothing toward the given axis (a triangular prism)
export const wedge = (tone, c, axis, size, o = {}) => ({ tone, p: c.slice(), q: AXIS[axis], s: size.map(v => v / 2), e: [SHARP, SHARP], taper: [o.tx ?? 1, o.ty ?? 0], shear: 0, ...o.more });

// a round stick from one point to another
export function stick(tone, a, b, r, o = {}) {
  const d = sub(b, a), len = Math.hypot(d[0], d[1], d[2]), z = [d[0] / len, d[1] / len, d[2] / len];
  const ax = cross([0, 0, 1], z), sin = Math.hypot(ax[0], ax[1], ax[2]), ang = Math.atan2(sin, z[2]) * 180 / Math.PI;
  const q = sin < 1e-6 ? (z[2] > 0 ? ID : qAxis([0, 1, 0], 180)) : qAxis(ax, ang);
  return { tone, p: mul(add(a, b), 0.5), q, s: [r, r, len / 2], e: [o.cap ?? SHARP, o.round ?? 1], taper: [0, 0], shear: 0, ...o.more };
}

// turn pieces about a pivot
export function turn(pieces, pivot, axis, deg) {
  const q = qAxis(axis, deg);
  for (const pc of [].concat(pieces)) { pc.p = add(pivot, quatRotate(q, sub(pc.p, pivot))); pc.q = qMul(q, pc.q); }
  return pieces;
}
export function move(pieces, d) { for (const pc of [].concat(pieces)) pc.p = add(pc.p, d); return pieces; }

// the eight corners of the box around a piece, for fitting it on the stage
export function corners(pc) {
  const out = [], sh = Math.abs(pc.shear || 0) * pc.s[1];
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) out.push(add(pc.p, quatRotate(pc.q, [x * (pc.s[0] + sh), y * pc.s[1], z * pc.s[2]])));
  return out;
}
export { add, sub, mul, cross, norm };
