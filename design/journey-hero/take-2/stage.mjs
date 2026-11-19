// Second take, reworked to Dan's brief: one big floating screen. Each craft is a real app on it (drawn simply, with its logo) that
// builds a piece of work, and on Export the piece lands in front of the screen, lying flat in one tidy block.
// This file holds every scene as a list of pieces, held still.
import { HOME } from '../../../public/journey/hero/engine.mjs';
import { box, cyl, turn } from './kit.mjs';

// the screen: its left and bottom edges, its size, the z of its middle, its thickness
export const SCREEN = { l: -2.6, b: 0.6, w: 5.6, h: 3.6, z: -1.8, t: 0.1 };
// An app is laid out in the screen's own units, U of the world's to each, from the screen's bottom left corner.
const U = 1.15, ZF = SCREEN.z + SCREEN.t / 2, W = SCREEN.w / U, H = SCREEN.h / U;
const BAR = 0.44, TOP = H - BAR - 0.1;                  // the bar along the top, and where an app's panels start under it

// a flat thing on the screen, placed by its left and bottom edges. lift: its gap from the screen's face.
export function on(tone, l, b, w, h, { lift = 0.02, t = 0.03, art, cut, round, more } = {}) {
  return { ...box(tone, [SCREEN.l + (l + w / 2) * U, SCREEN.b + (b + h / 2) * U, ZF + (lift + t / 2) * U], [w * U, h * U, t * U], { round, more }), art, cut };
}
// a flat picture on a panel: a plate of the panel's own tone, so that only the picture shows. (A cut-out would lose thin lines when it is drawn small.)
const icon = (art, l, b, w, h, tone = 'night', lift = 0.051) => on(tone, l, b, w, h, { lift, t: 0.004, art });
// a disc on the screen, by its middle
const dot = (tone, cx, cy, r, { lift = 0.05, t = 0.02 } = {}) => cyl(tone, [SCREEN.l + cx * U, SCREEN.b + cy * U, ZF + (lift + t / 2) * U], 'z', r * U, t * U);
// The point of the floor that shows at a given place in the picture (x to the right, y up, from where the world's origin shows).
export function floorAt(x, y) {
  const { r, u } = HOME, d = r[0] * u[2] - r[2] * u[0];
  return [(x * u[2] - r[2] * y) / d, 0, (r[0] * y - u[0] * x) / d];
}

// ---- the floor. Everything exported lies flat on it, face up, squared to the screen, in one block: the mat.
export const MAT = { x: -3.3, z: -1.4, gap: 0.25 };      // the mat's back left corner, and the gap between two things on it
// a sheet lying on the floor. x, z: its back left corner. w: along the screen. d: toward us. t: how thick. y: what it lies on.
function flat(tone, x, z, w, d, t, art, y = 0) {
  const at = [x + w / 2, y + t / 2, z + d];
  return turn({ ...box(tone, [at[0], at[1] + d / 2, at[2]], [w, d, t]), art }, at, [1, 0, 0], -90);
}
// A few leaves in a pile: the top one carries the picture and the ones under it show at the edge, which is what makes a booklet
// read as a booklet. side: the way the pile fans, +1 to the right or -1 to the left.
function leaves(x, z, w, d, art, { n = 3, side = 1, t = 0.022, step = 0.03 } = {}) {
  return Array.from({ length: n }, (_, i) => {
    const k = (n - 1 - i) * step;
    return flat('paper', side > 0 ? x : x - k, z, w + k, d + k * 0.5, t, i === n - 1 ? art : undefined, i * t);
  });
}
const shut = (x, z, w, d, cover, n = 4) => leaves(x, z, w, d, cover, { n });
const open = (x, z, w, d, left, right, n = 3) => [...leaves(x, z, w, d, left, { n, side: -1 }), ...leaves(x + w, z, w, d, right, { n })];
// a device lying on its back: a dark slab with rounded corners and a picture for its screen
function device(x, z, w, d, art, { rim = 0.05, round = 0.16, t = 0.08 } = {}) {
  const at = [x + w / 2, t / 2, z + d];
  return [turn(box('ink', [at[0], at[1] + d / 2, at[2]], [w, d, t], { more: { e: [0.1, round] } }), at, [1, 0, 0], -90), flat('ink', x + rim, z + rim, w - rim * 2, d - rim * 2, 0.01, art, t)];
}

// ---- what every app shares: the screen, its bar with the app's logo and name, the Export button and the cursor
const APPS = { ai: ['appAi', 'nameAi'], id: ['appId', 'nameId'], ps: ['appPs', 'namePs'] };
function shell(app, cursorAt = [W - 0.42, H - 0.26]) {
  const P = [];
  P.push(box('dark', [SCREEN.l + SCREEN.w / 2, SCREEN.b + SCREEN.h / 2, SCREEN.z], [SCREEN.w, SCREEN.h, SCREEN.t]));
  P.push(on('night', 0, H - BAR, W, BAR, { lift: 0, t: 0.03 }));
  if (APPS[app]) {
    P.push(on('ink', 0.07, H - BAR + 0.03, 0.38, 0.38, { lift: 0.04, t: 0.07, art: APPS[app][0], more: { e: [0.1, 0.22] } }));
    P.push(icon(APPS[app][1], 0.56, H - BAR + 0.12, 1.14, 0.2, 'night', 0.031));
  }
  P.push(on('red', W - 0.98, H - BAR + 0.08, 0.86, 0.28, { lift: 0.05, t: 0.06, art: 'export' }));
  // the cursor: a flat arrow floating in front of the face. cursorAt is its tip, in the screen's units.
  const cw = 0.46, tip = [10 / 96, 6 / 96];
  P.push({ ...box('paper', [SCREEN.l + cursorAt[0] * U + cw * (0.5 - tip[0]), SCREEN.b + cursorAt[1] * U - cw * (0.5 - tip[1]), ZF + (cursorAt[2] ?? 0.22)], [cw, cw, 0.004]), art: 'cursor', cut: true });
  return P;
}
// the tools down the left of a design app, one of them lit
function rail(P, tools, lit) {
  P.push(on('night', 0.08, 0.1, 0.36, TOP - 0.1));
  tools.forEach((art, i) => {
    const y = TOP - 0.34 - i * 0.36;
    if (i === lit) P.push(on('red', 0.11, y - 0.03, 0.3, 0.3, { lift: 0.05, t: 0.015 }));
    P.push(icon(art, 0.14, y, 0.24, 0.24, i === lit ? 'red' : 'night', i === lit ? 0.066 : 0.051));
  });
}
// where a design app's canvas is, between the tools and the panel on the right: its left edge, its width, its bottom, its height
const PANEL = W - 0.93;                                  // the left edge of the panel on the right
const CANVAS = { l: 0.56, w: PANEL - 0.12 - 0.56, b: 0.1, h: TOP - 0.1 };

// ---- 01 Graphic design, as three projects in three apps

// Illustrator: the mark and its guide, which are one piece
export function illustrator() {
  const P = shell('ai');
  rail(P, ['tArrow', 'tPen', 'tType', 'tRect', 'tCircle', 'tDrop'], 1);
  // swatches, type and layers down the right
  P.push(on('night', PANEL, 0.1, 0.85, TOP - 0.1));
  ['red', 'paper', 'grey', 'ink', 'dark', 'paper'].forEach((tone, i) => P.push(on(tone, PANEL + 0.09 + (i % 3) * 0.235, TOP - 0.3 - Math.floor(i / 3) * 0.235, 0.2, 0.2, { lift: 0.05, t: 0.02 })));
  P.push(icon('aa', PANEL + 0.09, TOP - 1.06, 0.5, 0.34));
  [0.67, 0.5, 0.6, 0.42].forEach((w, i) => P.push(on(i === 0 ? 'grey' : 'dark', PANEL + 0.09, TOP - 1.4 - i * 0.2, w, 0.1, { lift: 0.05, t: 0.02 })));
  // the canvas: the guide's spread, with the path of the D selected
  const ph = 2.0, pw = ph * 352 / 496, x = CANVAS.l + (CANVAS.w - 2 * pw) / 2, y = CANVAS.b + (CANVAS.h - ph) / 2;
  P.push(on('paper', x, y, pw, ph, { lift: 0.06, t: 0.02, art: 'guideL' }), on('paper', x + pw, y, pw, ph, { lift: 0.06, t: 0.02, art: 'guideR' }));
  const k = 230 / 1080, at = (X, Y) => [x + (61 + X * k) / 352 * pw, y + ph - (83 + Y * k) / 496 * ph];   // a point of the mark, on the page
  [[0, 0], [0, 797], [282, 797], [681, 398], [280, 0]].forEach(([X, Y]) => { const [ax, ay] = at(X, Y); P.push(on('red', ax - 0.035, ay - 0.035, 0.07, 0.07, { lift: 0.085, t: 0.01, art: 'anchor' })); });
  const [hx, hy] = at(681, 398);
  P.push(on('red', hx - 0.009, hy - 0.3, 0.018, 0.6, { lift: 0.085, t: 0.006 }), dot('red', hx, hy - 0.3, 0.035, { lift: 0.085, t: 0.012 }), dot('red', hx, hy + 0.3, 0.035, { lift: 0.085, t: 0.012 }));

  designMat(P, 1);
  return P;
}

// The mat for graphic design. Everything on it is DEEP deep, in two rows, and it is split in two zones whose edges line up in both rows.
// It fills in the order the work is made: the guide (back right), then the photograph beside it, then the booklet (shut beside
// the photograph, open in front of them), the phone and the tablet. upTo: how many of the three apps have exported so far.
const DEEP = 1.3, LEAF = DEEP * 440 / 340, GUIDE = DEEP * 352 / 496;      // the booklet's page and the guide's page, each DEEP tall
function designMat(P, upTo) {
  const { x, z, gap: g } = MAT, z2 = z + DEEP + g, x2 = x + 2 * LEAF + g;
  P.push(...open(x2, z, GUIDE, DEEP, 'guideL', 'guideR', 2));                                                // from Illustrator: the guide
  if (upTo < 2) return;
  const px = x + LEAF + g, pw = LEAF - g, edge = 0.06;                                                        // from Photoshop: the photograph, as a print with a white edge
  P.push(flat('paper', px, z, pw, DEEP, 0.02), flat('ink', px + edge, z + edge, pw - 2 * edge, DEEP - 2 * edge, 0.004, 'kPhoto', 0.02));
  if (upTo < 3) return;
  P.push(...shut(x, z, LEAF, DEEP, 'kCover', 6), ...open(x, z2, LEAF, DEEP, 'kOfferL', 'kOfferR', 5));        // from InDesign: the booklet, shut and open,
  P.push(...device(x2, z2, 0.68, DEEP, 'post', { rim: 0.045 }), ...device(x2 + 0.68 + g, z2, 2 * GUIDE - 0.68 - g, DEEP, 'mail', { rim: 0.055, round: 0.1 }));   // the post on a phone, the e-blast on a tablet
}

// Photoshop: the building's photograph, half way through its edit. It comes second, because the pieces InDesign builds all use it.
export function photoshop() {
  const P = shell('ps');
  rail(P, ['tMove', 'tMarquee', 'tBrush', 'tType', 'tRect', 'tDrop'], 2);
  // the panel on the right: levels, two sliders, the layers
  P.push(on('night', PANEL, 0.1, 0.85, TOP - 0.1));
  P.push(icon('histo', PANEL + 0.09, TOP - 0.42, 0.67, 0.28));
  [0.55, 0.3].forEach((v, i) => {
    const sy = TOP - 0.62 - i * 0.17;
    P.push(on('dark', PANEL + 0.09, sy, 0.67, 0.03, { lift: 0.05, t: 0.01 }), on(i === 0 ? 'red' : 'grey', PANEL + 0.09, sy, 0.67 * v, 0.03, { lift: 0.06, t: 0.012 }), on('paper', PANEL + 0.09 + 0.67 * v - 0.025, sy - 0.04, 0.05, 0.11, { lift: 0.07, t: 0.02 }));
  });
  [null, 'kPhoto', 'kPhotoB', null].forEach((art, i) => {
    const ly = TOP - 1.26 - i * 0.31;
    if (i === 0) P.push(on('dark', PANEL + 0.05, ly - 0.04, 0.75, 0.28, { lift: 0.05, t: 0.008 }));
    P.push(icon('eye', PANEL + 0.08, ly + 0.03, 0.14, 0.14, i === 0 ? 'dark' : 'night', i === 0 ? 0.059 : 0.051));
    P.push(on(i === 0 ? 'paper' : 'ink', PANEL + 0.27, ly, 0.28, 0.2, { lift: 0.07, t: 0.01, art }), on(i === 0 ? 'grey' : 'dark', PANEL + 0.6, ly + 0.07, 0.17, 0.05, { lift: 0.07, t: 0.008 }));
  });
  // the canvas: the picture as it was shot on the left of the split, and graded on the right
  const ih = 2.2, iw = ih * 396 / 360, x = CANVAS.l + (CANVAS.w - iw) / 2, y = CANVAS.b + (CANVAS.h - ih) / 2, cut = 0.42;
  P.push({ ...on('ink', x, y, iw * cut, ih, { lift: 0.06, t: 0.02, art: 'kPhotoB' }), window: [0, 0, cut, 1] }, { ...on('ink', x + iw * cut, y, iw * (1 - cut), ih, { lift: 0.06, t: 0.02, art: 'kPhoto' }), window: [cut, 0, 1, 1] });
  P.push(on('paper', x + iw * cut - 0.012, y - 0.05, 0.024, ih + 0.1, { lift: 0.085, t: 0.01 }), dot('paper', x + iw * cut, y + ih / 2, 0.09, { lift: 0.085, t: 0.02 }), dot('red', x + iw * cut, y + ih / 2, 0.045, { lift: 0.105, t: 0.01 }));
  designMat(P, 2);
  return P;
}

// InDesign: the booklet, and the LinkedIn post and the e-blast that follow it
export function indesign() {
  const P = shell('id');
  rail(P, ['tArrow', 'tType', 'tFrame', 'tRect', 'tLine', 'tDrop'], 0);
  // the pages panel: the cover, three spreads, the back, with the spread on the canvas lit
  P.push(on('night', PANEL, 0.1, 0.85, TOP - 0.1));
  const tw = 0.36, th = tw * 340 / 440, mid = PANEL + 0.425;
  [[null, 'kCover'], ['kOfferL', 'kOfferR'], ['kMapL', 'kMapR'], ['kGalL', 'kGalR'], ['kBack', null]].forEach(([l, r], i) => {
    const y = TOP - 0.16 - (i + 1) * th - i * 0.12;
    if (i === 1) P.push(on('red', mid - tw - 0.03, y - 0.03, tw * 2 + 0.06, th + 0.06, { lift: 0.05, t: 0.01 }));
    if (l) P.push(on('ink', mid - tw, y, tw, th, { lift: 0.065, t: 0.008, art: l }));
    if (r) P.push(on('ink', mid, y, tw, th, { lift: 0.065, t: 0.008, art: r }));
  });
  // the canvas: a spread of the booklet above, with a picture frame selected; under it the cover, the post and the e-blast
  const gap = 0.12, low = 1.0, pw = 1.6, ph = pw * 340 / 440, x = CANVAS.l + (CANVAS.w - 2 * pw) / 2, y2 = CANVAS.b + (CANVAS.h - ph - low - gap) / 2, y = y2 + low + gap;
  P.push(on('ink', x, y, pw, ph, { lift: 0.06, t: 0.02, art: 'kOfferL' }), on('ink', x + pw, y, pw, ph, { lift: 0.06, t: 0.02, art: 'kOfferR' }));
  const cw = low * 440 / 340, ew = 2 * pw - cw - low - 2 * gap;                                                // the cover's width, and what is left for the e-blast
  P.push(on('ink', x, y2, cw, low, { lift: 0.06, t: 0.02, art: 'kCover' }), on('ink', x + cw + gap, y2, low, low, { lift: 0.06, t: 0.02, art: 'kPost' }));
  P.push({ ...on('ink', x + cw + low + 2 * gap, y2, ew, low, { lift: 0.06, t: 0.02, art: 'eblast' }), window: [0, 0, 1, Math.min(1, low / ew * 320 / 472)] });
  const at = (X, Y) => [x + X / 1100 * pw, y + ph - Y / 850 * ph];                                            // a point of the left page, in hundredths of an inch
  [[659, 204], [853, 204], [1047, 204], [659, 527], [1047, 527], [659, 850], [853, 850], [1047, 850]].forEach(([X, Y]) => { const [ax, ay] = at(X, Y); P.push(on('red', ax - 0.03, ay - 0.03, 0.06, 0.06, { lift: 0.085, t: 0.01, art: 'anchor' })); });
  designMat(P, 3);
  return P;
}

// ---- 02 Video: the editing app has cut a video (captions, a transition, an effect) and exported it to three screens
export function video() {
  const P = shell(null);
  const top = TOP, mid = 1.3;                             // the panels' top edge, and where the timeline's share of the screen begins
  // the bin: clips to cut from
  P.push(on('night', 0.08, mid, 0.86, top - mid));
  ['thumbA', 'thumbB', 'thumbC', 'thumbB', 'thumbA', 'thumbC'].forEach((art, i) => P.push(on('ink', 0.14 + (i % 2) * 0.39, top - 0.3 - Math.floor(i / 2) * 0.28, 0.35, 0.197, { lift: 0.05, t: 0.015, art })));
  [0.6, 0.44].forEach((w, i) => P.push(on('dark', 0.14, mid + 0.22 - i * 0.12, w, 0.05, { lift: 0.05, t: 0.01 })));
  // the viewer: the frame under the playhead, with its caption
  P.push(on('night', 1.04, mid, 2.5, top - mid));
  P.push(on('ink', 1.33, mid + 0.2, 1.92, 1.08, { lift: 0.06, t: 0.02, art: 'frameWide' }));
  P.push(icon('transport', 2.04, mid + 0.045, 0.5, 0.1));
  // effects: three colour wheels and three sliders
  const ex = 3.64;
  P.push(on('night', ex, mid, 1.15, top - mid));
  for (let i = 0; i < 3; i++) {
    P.push(dot('dark', ex + 0.22 + i * 0.355, top - 0.3, 0.15));
    P.push(dot(i === 1 ? 'red' : 'paper', ex + 0.22 + i * 0.355 + [0.05, -0.04, 0.02][i], top - 0.3 + [0.03, 0.05, -0.06][i], 0.035, { lift: 0.08, t: 0.01 }));
  }
  [0.62, 0.3, 0.8].forEach((v, i) => {
    const y = top - 0.66 - i * 0.2;
    P.push(on('dark', ex + 0.1, y, 0.95, 0.03, { lift: 0.05, t: 0.01 }), on(i === 0 ? 'red' : 'grey', ex + 0.1, y, 0.95 * v, 0.03, { lift: 0.06, t: 0.012 }));
    P.push(on('paper', ex + 0.1 + 0.95 * v - 0.025, y - 0.04, 0.05, 0.11, { lift: 0.07, t: 0.02 }));
  });
  // the timeline: captions above, the cut with its transition in the middle, sound below, and the playhead across them all
  P.push(on('night', 0.08, 0.1, W - 0.16, mid - 0.2));
  const x0 = 0.44;
  P.push(icon('ruler', x0, 1.01, W - 0.2 - x0, 0.06));
  [['tT', 0.84], ['tV', 0.54], ['tA', 0.18]].forEach(([art, y]) => P.push(icon(art, 0.16, y, 0.2, 0.2)));
  [[0.08, 0.5], [0.66, 0.42], [1.5, 0.56], [2.14, 0.4], [2.9, 0.62]].forEach(([x, w], i) => P.push(on(i === 2 ? 'paper' : 'grey', x0 + x, 0.88, w, 0.09, { lift: 0.05, t: 0.02 })));
  [[0, 1.3, 'grey', 'thumbA'], [1.3, 1.4, 'red', 'thumbB'], [2.7, 1.2, 'grey', 'thumbC']].forEach(([x, w, tone, art]) => {
    P.push(on(tone, x0 + x + 0.01, 0.48, w - 0.02, 0.32, { lift: 0.05, t: 0.03 }), on('ink', x0 + x + 0.04, 0.51, 0.46, 0.26, { lift: 0.085, t: 0.004, art }));
  });
  P.push(on('paper', x0 + 1.3 - 0.16, 0.48, 0.32, 0.32, { lift: 0.1, t: 0.02, art: 'trans' }));               // the transition, across the first cut
  P.push(on('red', x0 + 3.44, 0.54, 0.36, 0.2, { lift: 0.09, t: 0.015, art: 'fx' }));                          // an effect on the last clip
  P.push(on('dark', x0 + 0.01, 0.15, 3.88, 0.26, { lift: 0.05, t: 0.02, art: 'wave' }));
  const head = x0 + 2.05;
  P.push(on('red', head - 0.015, 0.13, 0.03, 0.95, { lift: 0.13, t: 0.01 }), on('red', head - 0.07, 1.01, 0.14, 0.1, { lift: 0.13, t: 0.02 }));

  // exported: the same edit, wide, tall on a phone, and square for a feed
  const g = MAT.gap, d = 1.5;
  P.push(...device(MAT.x, MAT.z, 2.56, d, 'playerWide', { rim: 0.07, round: 0.1 }));
  P.push(...device(MAT.x + 2.56 + g, MAT.z, 0.76, d, 'reel'));
  P.push(...device(MAT.x + 3.32 + 2 * g, MAT.z, d, d, 'sqPost', { rim: 0.07, round: 0.1 }));
  return P;
}

export const SCENES = [illustrator, photoshop, indesign, video];
export const CRAFT = [0, 0, 0, 1];                      // which of the four crafts each scene belongs to
