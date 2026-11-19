// Second take, reworked to Dan's brief: one big floating screen. Each craft is a real app on it (drawn simply, with its logo) that
// builds a piece of work, and on Export the piece lands in front of the screen, lying flat in one tidy block.
// This file holds every scene as a list of pieces, held still.
import { HOME } from '../../../public/journey/hero/engine.mjs';
import { box, cyl, turn } from './kit.mjs';
import { CLOSE, BALL } from './art.mjs';

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
// the outline of a selection: four thin red bars around a box on the screen
const outline = (l, b, w, h, { line = 0.016, lift = 0.085 } = {}) => [[l, b, w, line], [l, b + h - line, w, line], [l, b, line, h], [l + w - line, b, line, h]].map(([x, y, bw, bh]) => on('red', x, y, bw, bh, { lift, t: 0.006 }));
const handle = (x, y) => on('red', x - 0.03, y - 0.03, 0.06, 0.06, { lift: 0.09, t: 0.01, art: 'anchor' });   // one of a selection's points, by its middle
// The point of the floor that shows at a given place in the picture (x to the right, y up, from where the world's origin shows).
export function floorAt(x, y) {
  const { r, u } = HOME, d = r[0] * u[2] - r[2] * u[0];
  return [(x * u[2] - r[2] * y) / d, 0, (r[0] * y - u[0] * x) / d];
}

// ---- the floor. Everything exported lies flat on it, face up, squared to the screen, in one block: the mat.
export const MAT = { x: -3.3, z: -1.4, w: 5.5, gap: 0.25 };   // the mat's back left corner, its width, and the gap between two screens on it
// a sheet lying on the floor. x, z: its back left corner. w: along the screen. d: toward us. t: how thick. y: what it lies on.
function flat(tone, x, z, w, d, t, art, y = 0) {
  const at = [x + w / 2, y + t / 2, z + d];
  return turn({ ...box(tone, [at[0], at[1] + d / 2, at[2]], [w, d, t]), art }, at, [1, 0, 0], -90);
}
// a device lying on its back: a dark slab with rounded corners and a picture for its screen
function device(x, z, w, d, art, { rim = 0.05, round = 0.16, t = 0.08 } = {}) {
  const at = [x + w / 2, t / 2, z + d];
  return [turn(box('ink', [at[0], at[1] + d / 2, at[2]], [w, d, t], { more: { e: [0.1, round] } }), at, [1, 0, 0], -90), flat('ink', x + rim, z + rim, w - rim * 2, d - rim * 2, 0.01, art, t)];
}

// ---- what every app shares: the screen, its bar with the app's logo and name, the Export button and the cursor
const APPS = { ai: ['appAi', 'nameAi'], id: ['appId', 'nameId'], ps: ['appPs', 'namePs'], pr: ['appPr', 'namePr'], ae: ['appAe', 'nameAe'], fig: ['appFig', 'nameFig'] };
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

// ---- 01 Graphic design, as three projects in three apps, in the order the work is made: Photoshop, Illustrator, InDesign.
// Only InDesign's export lands on the floor. The photograph and the map go on into the next app, so the floor stays empty until then.

// What InDesign exports, squared up into one block that is as wide as the open booklet and sits in the middle of the mat.
// Behind: a stack of closed copies, the post in a phone, the e-blast in a tablet. In front: the copy that is taken off the top
// of the stack, opened and leafed through.
const DEEP = 1.45, LEAF = DEEP * 440 / 340;              // a page of the booklet: how deep it is (toward us) and how wide
const GUT = 0.12, PHONE = 0.7, TABLET = LEAF - PHONE - 2 * GUT;   // the gutter between two things in the block, and the two devices that share a page's width with it
const SHEET = 0.01, COPY = 5 * SHEET, COPIES = 6;        // how thick one leaf is, and one closed copy; how many copies land
export const BLOCK = { x0: MAT.x + MAT.w / 2 - LEAF, x1: MAT.x + MAT.w / 2 + LEAF, z0: MAT.z, z1: MAT.z + 2 * DEEP + GUT, up: 0.6 };   // the room the block takes, for the tools that crop a still to it

// A closed copy: the white edges of its pages under a dark cover. x, z: its back left corner. y: what it lies on.
function closed(P, x, z, y = 0, art = 'kCover') {
  const skin = 0.008;
  P.push(flat('paper', x, z, LEAF, DEEP, COPY - skin, undefined, y), flat('ink', x, z, LEAF, DEEP, skin, art, y + COPY - skin));
}
// The booklet's leaves from the cover inward: what is printed on the front of each, and on its back. The copy on the mat turns
// these three, so it opens at The Offering, then Amenities, then the gallery. LAST: the page the third one uncovers.
const LEAVES = [['kCover', 'kOfferL'], ['kOfferR', 'kAmL'], ['kAmR', 'kGalL']], LAST = 'kGalR';
const STRIPS = 14, clamp = (v, a, b) => Math.min(b, Math.max(a, v)), mix = (a, b, t) => a + (b - a) * t;
// One leaf on its way over, bending the way paper does. It is a row of narrow strips, each hinged on the one before, so the leaf
// can curl: its free edge peels up first while the rest still lies flat, it swings over the spine in a shallow arc, and it lands
// from the spine outward, its edge coming down last. sx, y: the spine, and how high the leaf's root is. f: 0 lying on the right .. 1 on the left.
function leaf(P, sx, z, y, f, front, back) {
  const mid = 180 * f, lead = 34 * Math.sin(2 * Math.PI * f) + 12 * Math.sin(Math.PI * f);        // how far the free edge is ahead of the root, in degrees
  const root = clamp(mid - lead, 0, 180), edge = clamp(mid + lead, 0, 180), w = LEAF / STRIPS, t = SHEET / 2;
  let px = sx, py = y;
  for (let i = 0; i < STRIPS; i++) {
    const deg = mix(root, edge, ((i + 0.5) / STRIPS) ** 1.5), hinge = [px, py, 0], u0 = i / STRIPS, u1 = (i + 1) / STRIPS;
    P.push({ ...turn(flat('paper', px, z, w, DEEP, t, front, py), hinge, [0, 0, 1], deg), window: [u0, 0, u1, 1], shade: true });                   // the strip's front,
    P.push({ ...turn(flat('paper', px - w, z, w, DEEP, t, back, py), hinge, [0, 0, 1], deg - 180), window: [1 - u1, 0, 1 - u0, 1], shade: true });   // and its back
    px += w * Math.cos(deg * Math.PI / 180); py += w * Math.sin(deg * Math.PI / 180);
  }
}
// The copy that is taken off the top of the stack. x, z: the back left corner of the place where it lies open. from: where it
// lay on the stack. at: -1 on the stack .. 0 set down, still shut, in the right half of its place; then one leaf turns for each 1:
// 1 is open at The Offering, 2 at Amenities, 3 at the gallery.
function copy(P, x, z, from, at) {
  if (at <= 0) {                                          // on its way: up off the stack, toward us, then across (clear of the devices), and down
    const u = clamp(at + 1, 0, 1), e = u * u * (3 - 2 * u);
    return closed(P, mix(from[0], x + LEAF, e * e), mix(from[2], z, 1 - (1 - e) ** 2), mix(from[1], 0, e) + 0.55 * Math.sin(Math.PI * u));
  }
  const i = Math.min(Math.floor(at), LEAVES.length - 1), f = Math.min(at - i, 1), [front, back] = LEAVES[i];
  const right = (4 - i) * SHEET, left = i * SHEET;        // how thick the pages are on each side of the leaf that is turning
  P.push(flat('paper', x + LEAF, z, LEAF, DEEP, right, LEAVES[i + 1] ? LEAVES[i + 1][0] : LAST));
  if (left) P.push(flat('paper', x, z, LEAF, DEEP, left, LEAVES[i - 1][1]));
  if (f === 0) P.push(flat('paper', x + LEAF, z, LEAF, DEEP, SHEET, front, right));
  else if (f === 1) P.push(flat('paper', x, z, LEAF, DEEP, SHEET, back, left));
  else leaf(P, x + LEAF, z, mix(right, left, f) + SHEET / 2, f, front, back);
}
// at: where the copy that is being read has got to (see copy). By default a leaf is landing on Amenities.
function prints(P, at = 1.82) {
  const x = BLOCK.x0, z = BLOCK.z0, n = COPIES - 1;
  for (let i = 0; i < n; i++) closed(P, x, z, i * COPY, i === n - 1 ? 'kCover' : undefined);                  // the stack, less the copy that was taken
  P.push(...device(x + LEAF + GUT, z, PHONE, DEEP, 'post', { rim: 0.04 }), ...device(x + LEAF + 2 * GUT + PHONE, z, TABLET, DEEP, 'mail', { rim: 0.05, round: 0.1 }));
  copy(P, x, z + DEEP + GUT, [x, n * COPY, z], at);
}

// Photoshop comes first: the building's photograph, half way through its edit. Every later piece uses it. Nothing lands on the floor.
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
  // the canvas: the picture as it was shot on the left of the split, and graded on the right. The split runs down the building's corner.
  const ih = 2.05, iw = ih * 526 / 360, x = CANVAS.l + (CANVAS.w - iw) / 2, y = CANVAS.b + (CANVAS.h - ih) / 2, cut = 0.44;
  P.push({ ...on('ink', x, y, iw * cut, ih, { lift: 0.06, t: 0.02, art: 'kPhotoB' }), window: [0, 0, cut, 1] }, { ...on('ink', x + iw * cut, y, iw * (1 - cut), ih, { lift: 0.06, t: 0.02, art: 'kPhoto' }), window: [cut, 0, 1, 1] });
  P.push(on('paper', x + iw * cut - 0.012, y - 0.05, 0.024, ih + 0.1, { lift: 0.085, t: 0.01 }), dot('paper', x + iw * cut, y + ih / 2, 0.09, { lift: 0.085, t: 0.02 }), dot('red', x + iw * cut, y + ih / 2, 0.045, { lift: 0.105, t: 0.01 }));
  return P;
}

// Illustrator comes second: the map of King Street on the booklet's Amenities spread, which is line work. Nothing lands on the floor.
const FLYER = { gold: ['#9B7C29', '#86691F', '#5E4915'], lite: ['#CEAB48', '#B3933B', '#836A28'], coal: ['#282928', '#1F201F', '#161716'], black: ['#0A0F16', '#080C12', '#05080C'] };   // the flyer's colours, lit, on top and in shade
export function illustrator() {
  const P = shell('ai');
  rail(P, ['tArrow', 'tPen', 'tType', 'tRect', 'tCircle', 'tDrop'], 1);
  // down the right: swatches in the flyer's colours, type, layers
  P.push(on('night', PANEL, 0.1, 0.85, TOP - 0.1));
  [FLYER.gold, FLYER.lite, 'paper', FLYER.coal, FLYER.black, 'grey'].forEach((tone, i) => {
    const pc = on(typeof tone === 'string' ? tone : 'paper', PANEL + 0.09 + (i % 3) * 0.235, TOP - 0.3 - Math.floor(i / 3) * 0.235, 0.2, 0.2, { lift: 0.05, t: 0.02 });
    P.push(typeof tone === 'string' ? pc : { ...pc, tones: tone });
  });
  P.push(icon('aa', PANEL + 0.09, TOP - 1.06, 0.5, 0.34));
  [0.67, 0.5, 0.6, 0.42].forEach((w, i) => P.push(on(i === 0 ? 'grey' : 'dark', PANEL + 0.09, TOP - 1.4 - i * 0.2, w, 0.1, { lift: 0.05, t: 0.02 })));
  // the canvas: the whole artboard above, and under it a closer view of the part that the red frame marks
  const [cx, cy, cw, ch] = CLOSE, pw = 3.2, k = pw / 2200, ph = 850 * k, low = pw * ch / cw, gap = 0.1;
  const x = CANVAS.l + (CANVAS.w - pw) / 2, y2 = CANVAS.b + (CANVAS.h - ph - low - gap) / 2, y = y2 + low + gap;
  P.push(on('ink', x, y, pw, ph, { lift: 0.06, t: 0.02, art: 'kMap' }), on('ink', x, y2, pw, low, { lift: 0.06, t: 0.02, art: 'kMapClose' }));
  P.push(...outline(x + cx * k, y + ph - (cy + ch) * k, cw * k, ch * k));
  // close up, the ring around the building's logo is selected: a path, with its points and two of their handles
  const z = pw / cw, at = (X, Y) => [x + (X - cx) * z, y2 + low - (Y - cy) * z];
  [[1309, 457], [1345, 493], [1345, 567], [1309, 603], [1273, 567], [1273, 493]].forEach(([X, Y]) => P.push(handle(...at(X, Y))));
  [457, 603].forEach(Y => {
    const [hx, hy] = at(1309, Y), reach = 46 * z;
    P.push(on('red', hx - reach, hy - 0.008, reach * 2, 0.016, { lift: 0.085, t: 0.006 }), dot('red', hx - reach, hy, 0.028, { lift: 0.085, t: 0.012 }), dot('red', hx + reach, hy, 0.028, { lift: 0.085, t: 0.012 }));
  });
  return P;
}

// InDesign comes last: the booklet, and the LinkedIn post and the e-blast that follow it. Its export is what lands (see prints).
// at: where the copy that is being read has got to.
export function indesign({ at: pages } = {}) {
  const P = shell('id');
  rail(P, ['tArrow', 'tType', 'tFrame', 'tRect', 'tLine', 'tDrop'], 0);
  // the pages panel: the cover, four spreads, the back, with the spread on the canvas lit
  P.push(on('night', PANEL, 0.1, 0.85, TOP - 0.1));
  const tw = 0.36, th = tw * 340 / 440, mid = PANEL + 0.425;
  [[null, 'kCover'], ['kOfferL', 'kOfferR'], ['kLocL', 'kLocR'], ['kAmL', 'kAmR'], ['kGalL', 'kGalR'], ['kBack', null]].forEach(([l, r], i) => {
    const y = TOP - 0.13 - (i + 1) * th - i * 0.1;
    if (i === 3) P.push(on('red', mid - tw - 0.03, y - 0.03, tw * 2 + 0.06, th + 0.06, { lift: 0.05, t: 0.01 }));
    if (l) P.push(on('ink', mid - tw, y, tw, th, { lift: 0.065, t: 0.008, art: l }));
    if (r) P.push(on('ink', mid, y, tw, th, { lift: 0.065, t: 0.008, art: r }));
  });
  // the canvas: the Amenities spread above, with the map from Illustrator placed and selected; under it the cover, the post and the e-blast
  const gap = 0.12, low = 1.0, pw = 1.6, ph = pw * 340 / 440, x = CANVAS.l + (CANVAS.w - 2 * pw) / 2, y2 = CANVAS.b + (CANVAS.h - ph - low - gap) / 2, y = y2 + low + gap;
  P.push(on('ink', x, y, pw, ph, { lift: 0.06, t: 0.02, art: 'kAmL' }), on('ink', x + pw, y, pw, ph, { lift: 0.06, t: 0.02, art: 'kAmR' }));
  const cw = low * 440 / 340, ew = 2 * pw - cw - low - 2 * gap;                                                // the cover's width, and what is left for the e-blast
  P.push(on('ink', x, y2, cw, low, { lift: 0.06, t: 0.02, art: 'kCover' }), on('ink', x + cw + gap, y2, low, low, { lift: 0.06, t: 0.02, art: 'kPost' }));
  P.push({ ...on('ink', x + cw + low + 2 * gap, y2, ew, low, { lift: 0.06, t: 0.02, art: 'eblast' }), window: [0, 0, 1, Math.min(1, low / ew * 320 / 472)] });
  const at = (X, Y) => [x + X / 1100 * pw, y + ph - Y / 850 * ph];                                            // a point of the spread, in hundredths of an inch
  const [fl, ft] = at(34, 84), [fr, fb] = at(2056, 826);                                                       // the map's frame, which runs across the fold
  P.push(...outline(fl, fb, fr - fl, ft - fb, { line: 0.012 }));
  [[fl, ft], [(fl + fr) / 2, ft], [fr, ft], [fl, (ft + fb) / 2], [fr, (ft + fb) / 2], [fl, fb], [(fl + fr) / 2, fb], [fr, fb]].forEach(([ax, ay]) => P.push(handle(ax, ay)));
  prints(P, pages);
  return P;
}

// ---- The screens the other crafts export to. They lie in one row across the mat: a tablet on its side, then two phones.
const ROW = 1.8, SLIM = 0.955, WIDE = MAT.w - 2 * SLIM - 2 * MAT.gap;            // the row's depth, a phone's width, the tablet's width: their screens are 16:9 and 9:18
function screens(P, wide, tall, third) {
  const { x, z, gap: g } = MAT;
  P.push(...device(x, z, WIDE, ROW, wide, { rim: 0.075, round: 0.09 }), ...device(x + WIDE + g, z, SLIM, ROW, tall, { rim: 0.055 }), ...device(x + WIDE + SLIM + 2 * g, z, SLIM, ROW, third, { rim: 0.055 }));
}

// ---- 02 Video: Premiere Pro has cut a video (captions, a transition, an effect) and exported it wide, tall and square
export function video() {
  const P = shell('pr');
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

  screens(P, 'playerWide', 'reel', 'feedSq');             // exported: the same edit wide, tall as a reel, and square in a feed
  return P;
}

// ---- 03 Motion: After Effects has animated words and shapes, the way a SaaS promo moves, and exported it to the same three screens
// each layer: its icon, its label's tone, how long its name is, when its bar starts and how long it is, and where its keyframes are
const LAYERS = [
  ['tT', 'red', 0.5, 0, 3.2, [0.1, 0.6]], ['tT', 'red', 0.36, 0.2, 3, [0.35, 0.85]], ['lStar', 'paper', 0.28, 0.6, 2.6, [0.75, 1.45]],
  ['lStar', 'grey', 0.44, 1, 2.2, [1.2, 1.7]], ['lStar', 'grey', 0.44, 1.15, 2.05, [1.35, 1.85]], ['lStar', 'grey', 0.44, 1.3, 1.9, [1.5, 2]],
];
export function motion() {
  const P = shell('ae');
  const top = TOP, mid = 1.3;
  // the project: the comp, and what it is made of
  P.push(on('night', 0.08, mid, 0.86, top - mid));
  P.push(on('paper', 0.14, top - 0.5, 0.74, 0.416, { lift: 0.05, t: 0.015, art: 'compWide' }));
  ['red', 'grey', 'paper', 'grey'].forEach((tone, i) => {
    const y = top - 0.68 - i * 0.14;
    P.push(on(tone, 0.14, y, 0.08, 0.08, { lift: 0.05, t: 0.01 }), on(i === 0 ? 'grey' : 'dark', 0.28, y + 0.015, [0.5, 0.36, 0.44, 0.3][i], 0.05, { lift: 0.05, t: 0.01 }));
  });
  // the comp: one frame of the animation, with the ball's layer selected
  P.push(on('night', 1.04, mid, 2.5, top - mid));
  const fx = 1.33, fy = mid + 0.2, fw = 1.92, fh = 1.08, k = fw / 480, half = (BALL[2] + 8) * k, bx = fx + BALL[0] * k, by = fy + fh - BALL[1] * k;
  P.push(on('paper', fx, fy, fw, fh, { lift: 0.06, t: 0.02, art: 'compWide' }));
  P.push(...outline(bx - half, by - half, half * 2, half * 2, { line: 0.012 }));
  for (const dx of [-1, 1]) for (const dy of [-1, 1]) P.push(on('red', bx + dx * half - 0.02, by + dy * half - 0.02, 0.04, 0.04, { lift: 0.09, t: 0.008 }));
  P.push(icon('transport', 2.04, mid + 0.045, 0.5, 0.1));
  // the graph: the ease between the ball's two keyframes
  const ex = 3.64;
  P.push(on('night', ex, mid, 1.15, top - mid));
  P.push(icon('graph', ex + 0.1, mid + 0.3, 0.95, 0.79));
  [0.5, 0.32].forEach((w, i) => P.push(on(i ? 'dark' : 'grey', ex + 0.1, mid + 0.17 - i * 0.09, w, 0.04, { lift: 0.05, t: 0.01 })));
  // the timeline: a row for each layer, with its bar and its keyframes, and the playhead across them all
  P.push(on('night', 0.08, 0.1, W - 0.16, mid - 0.2));
  const x0 = 1.34;
  P.push(icon('ruler', x0, 1.01, W - 0.2 - x0, 0.06));
  LAYERS.forEach(([kind, tone, name, from, len, keys], i) => {
    const y = 0.84 - i * 0.14, lit = i === 2;
    if (lit) P.push(on('dark', 0.12, y - 0.02, W - 0.24, 0.13, { lift: 0.035, t: 0.006 }));
    P.push(on(tone, 0.17, y + 0.015, 0.06, 0.06, { lift: 0.05, t: 0.01 }), icon(kind, 0.28, y - 0.015, 0.12, 0.12, lit ? 'dark' : 'night', lit ? 0.042 : 0.051), on(lit ? 'paper' : 'grey', 0.46, y + 0.025, name, 0.04, { lift: 0.05, t: 0.01 }));
    P.push(on(lit ? 'grey' : 'dark', x0 + from, y, len, 0.09, { lift: 0.05, t: 0.012 }));
    keys.forEach(t => P.push(icon(lit ? 'kfOn' : 'kf', x0 + t - 0.045, y, 0.09, 0.09, lit ? 'grey' : 'dark', 0.063)));
  });
  const head = x0 + 1.6;
  P.push(on('red', head - 0.015, 0.13, 0.03, 0.95, { lift: 0.13, t: 0.01 }), on('red', head - 0.07, 1.01, 0.14, 0.1, { lift: 0.13, t: 0.02 }));

  screens(P, 'motWide', 'motTall', 'motSq');              // exported: in a player, as a story, and square in a feed
  return P;
}

export const SCENES = [photoshop, illustrator, indesign, video, motion];
export const CRAFT = [0, 0, 0, 1, 2];                      // which of the four crafts each scene belongs to
