// Second take, reworked to Dan's brief: one big floating screen. Each craft is an app on it that builds work,
// and on Export the work lands outside the screen as objects. This file holds every scene as a list of pieces, held still.
import { HOME } from '../../../public/journey/hero/engine.mjs';
import { box, cyl, turn, move } from './kit.mjs';

// the screen: its left and bottom edges, its size, the z of its middle, its thickness
export const SCREEN = { l: -2.6, b: 0.9, w: 5.6, h: 3.6, z: -1.8, t: 0.1 };
// An app is laid out in the screen's own units, U of the world's to each, from the screen's bottom left corner.
const U = 1.15, ZF = SCREEN.z + SCREEN.t / 2, W = SCREEN.w / U, H = SCREEN.h / U;

// a flat thing on the screen, placed by its left and bottom edges. lift: its gap from the screen's face.
export function on(tone, l, b, w, h, { lift = 0.02, t = 0.03, art, cut, round } = {}) {
  return { ...box(tone, [SCREEN.l + (l + w / 2) * U, SCREEN.b + (b + h / 2) * U, ZF + (lift + t / 2) * U], [w * U, h * U, t * U], { round }), art, cut };
}
// The point of the floor that shows at a given place in the picture (x to the right, y up, from where the world's origin shows).
// Things outside the screen are placed this way, because what matters is where they sit in the frame.
export function floorAt(x, y) {
  const { r, u } = HOME, d = r[0] * u[2] - r[2] * u[0];
  return [(x * u[2] - r[2] * y) / d, 0, (r[0] * y - u[0] * x) / d];
}
// a sheet standing on the floor, facing us. at: the middle of its bottom edge.
export const sheet = (tone, at, w, h, t, art) => ({ ...box(tone, [at[0], at[1] + h / 2, at[2]], [w, h, t]), art });
// a sheet lying on the floor, face up, its top edge away from us
export const lying = (tone, at, w, h, t, art) => turn({ ...box(tone, [at[0], at[1] + h / 2, at[2]], [w, h, t]), art }, [at[0], at[1], at[2]], [1, 0, 0], -90);

// what every app shares: the screen, its top bar, the four workspaces (one lit), the Export button and the cursor
function shell(craft, cursorAt) {
  const P = [];
  P.push(box('dark', [SCREEN.l + W / 2, SCREEN.b + H / 2, SCREEN.z], [W, H, SCREEN.t]));
  P.push(on('night', 0, H - 0.34, W, 0.34, { lift: 0, t: 0.03 }));
  for (let i = 0; i < 4; i++) P.push(on(i === craft ? 'red' : 'dark', 0.14 + i * 0.3, H - 0.21, 0.22, 0.08, { lift: 0.03, t: 0.02 }));
  P.push(on('red', W - 0.98, H - 0.3, 0.86, 0.26, { lift: 0.05, t: 0.06, art: 'export' }));
  // the cursor: a flat arrow floating in front of the face. cursorAt is its tip, in the screen's units.
  const cw = 0.46, tip = [10 / 96, 6 / 96];
  P.push({ ...box('paper', [SCREEN.l + cursorAt[0] * U + cw * (0.5 - tip[0]), SCREEN.b + cursorAt[1] * U - cw * (0.5 - tip[1]), ZF + (cursorAt[2] ?? 0.22)], [cw, cw, 0.004]), art: 'cursor', cut: true });
  return P;
}

// 01 Graphic design: the design app has built a brand (the mark, its guide, a flyer, a post) and exported each one
export function graphic() {
  const P = shell(0, [W - 0.42, H - 0.2]);
  // tools down the left
  P.push(on('night', 0.08, 0.1, 0.36, H - 0.54));
  ['tArrow', 'tPen', 'tType', 'tRect', 'tCircle', 'tDrop'].forEach((art, i) => {
    if (i === 1) P.push(on('red', 0.11, H - 0.86 - i * 0.36, 0.3, 0.3, { lift: 0.05, t: 0.015 }));
    P.push(on('paper', 0.14, H - 0.83 - i * 0.36, 0.24, 0.24, { lift: 0.07, t: 0.004, art, cut: true }));
  });
  // swatches, type and layers down the right
  const rx = W - 0.93;
  P.push(on('night', rx, 0.1, 0.85, H - 0.54));
  ['red', 'paper', 'grey', 'ink', 'dark', 'paper'].forEach((tone, i) => P.push(on(tone, rx + 0.09 + (i % 3) * 0.235, H - 0.76 - Math.floor(i / 3) * 0.235, 0.2, 0.2, { lift: 0.05, t: 0.02 })));
  P.push(on('paper', rx + 0.09, H - 1.52, 0.5, 0.34, { lift: 0.05, t: 0.004, art: 'aa', cut: true }));
  [0.67, 0.5, 0.6, 0.42].forEach((w, i) => P.push(on(i === 0 ? 'grey' : 'dark', rx + 0.09, 1.2 - i * 0.2, w, 0.1, { lift: 0.05, t: 0.02 })));
  // the artboards: the mark, the guide and a post above; the flyer's four pages below
  const r1 = 1.67, r2 = 0.37, lift = { lift: 0.06, t: 0.02 }, pw = 0.73, phh = pw * 496 / 352;
  P.push(on('paper', 0.6, r1, 0.84, 0.84, { ...lift, art: 'logo' }));
  P.push(on('paper', 1.56, r1, 0.62, 0.84, { ...lift, art: 'guideL' }), on('paper', 2.18, r1, 0.62, 0.84, { ...lift, art: 'guideR' }));
  P.push(on('paper', 2.92, r1, 0.84, 0.84, { ...lift, art: 'postArt' }));
  P.push(on('paper', 0.6, r2, pw, phh, { ...lift, art: 'flyerFront' }));
  P.push(on('paper', 0.6 + pw + 0.12, r2, pw, phh, { ...lift, art: 'flyerInL' }), on('paper', 0.6 + 2 * pw + 0.12, r2, pw, phh, { ...lift, art: 'flyerInR' }));
  P.push(on('paper', 0.6 + 3 * pw + 0.24, r2, pw, phh, { ...lift, art: 'flyerBack' }));

  // what has been exported: the post on a phone, the mark on a block, the flyer shut and open, the guide lying open
  const ph = floorAt(-3.2, 1.0);
  P.push(box('ink', [ph[0], 0.9, ph[2]], [0.96, 1.8, 0.12], { round: 0.14 }));
  P.push(sheet('paper', [ph[0], 0.06, ph[2] + 0.065], 0.84, 1.68, 0.012, 'post'));
  P.push(sheet('paper', floorAt(-1.9, 1.9), 1.0, 1.0, 0.16, 'logo'));
  const cover = floorAt(-1.75, -0.1);
  P.push(turn(sheet('paper', cover, 0.98, 1.38, 0.03, 'flyerFront'), cover, [0, 1, 0], 10));
  const g = floorAt(0.3, -0.55);
  const guide = [lying('paper', [g[0] - 0.5, 0.03, g[2] + 0.68], 1.0, 1.36, 0.05, 'guideL'), lying('paper', [g[0] + 0.5, 0.03, g[2] + 0.68], 1.0, 1.36, 0.05, 'guideR')];
  P.push(...turn(guide, g, [0, 1, 0], -8));
  const spine = floorAt(1.95, -0.95);
  P.push(turn(sheet('paper', [spine[0] - 0.49, 0, spine[2]], 0.98, 1.38, 0.03, 'flyerInL'), spine, [0, 1, 0], -22));
  P.push(turn(sheet('paper', [spine[0] + 0.49, 0, spine[2]], 0.98, 1.38, 0.03, 'flyerInR'), spine, [0, 1, 0], 26));
  return P;
}

export const SCENES = [graphic];
