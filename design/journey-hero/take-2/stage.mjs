// Second take, reworked to Dan's brief: one big floating screen. Each craft is a real app on it (drawn simply, with its logo) that
// builds a piece of work, and on Export the piece lands in front of the screen, lying flat in one tidy block.
// One clock builds every piece: the persistent shell, wiped content, travelling work and the floor.
import { HOME, EASE, bezier } from '../../../public/journey/hero/engine.mjs';
import { box, cyl, turn, corners } from './kit.mjs';
import { SPOT, subwayPath, BALL, BALL_FROM, BALL_VIA, ROWS } from './art.mjs';

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
const outline = (l, b, w, h, { line = 0.016, lift = 0.085, tone = 'red' } = {}) => [[l, b, w, line], [l, b + h - line, w, line], [l, b, line, h], [l + w - line, b, line, h]].map(([x, y, bw, bh]) => on(tone, x, y, bw, bh, { lift, t: 0.006 }));
const handle = (x, y) => on('red', x - 0.03, y - 0.03, 0.06, 0.06, { lift: 0.09, t: 0.01, art: 'anchor' });   // one of a selection's points, by its middle
// a thin red bar from one point of the screen to another: a piece of a selected path, or the arm of a handle
function bar(a, b, { line = 0.018, lift = 0.085, tone = 'red' } = {}) {
  const pc = on(tone, a[0] - line / 2, a[1] - line / 2, Math.hypot(b[0] - a[0], b[1] - a[1]) + line, line, { lift, t: 0.006 });
  return turn(pc, [SCREEN.l + a[0] * U, SCREEN.b + a[1] * U, 0], [0, 0, 1], Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI);
}
// the part of the line from a to b that lies inside a box [left, top, width, height], or nothing
function inside(a, b, [l, t, w, h]) {
  const d = [b[0] - a[0], b[1] - a[1]];
  let t0 = 0, t1 = 1;
  for (const [p, q] of [[-d[0], a[0] - l], [d[0], l + w - a[0]], [-d[1], a[1] - t], [d[1], t + h - a[1]]]) {
    if (p === 0) { if (q < 0) return null; } else if (p < 0) t0 = Math.max(t0, q / p); else t1 = Math.min(t1, q / p);
  }
  return t0 < t1 ? [[a[0] + d[0] * t0, a[1] + d[1] * t0], [a[0] + d[0] * t1, a[1] + d[1] * t1]] : null;
}
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
function shell(i, t, cursorAt, pressed) {
  const P = [], scene = SHOW[i], old = SHOW[(i + SHOW.length - 1) % SHOW.length];
  P.push(box('dark', [SCREEN.l + SCREEN.w / 2, SCREEN.b + SCREEN.h / 2, SCREEN.z], [SCREEN.w, SCREEN.h, SCREEN.t]));
  P.push(on('night', 0, H - BAR, W, BAR, { lift: 0, t: 0.03 }));
  const p = progress(t, 0.05, 0.5), angle = p * 180;
  const tile = on('ink', 0.07, H - BAR + 0.03, 0.38, 0.38, { lift: 0.04 + 0.2 * Math.sin(Math.PI * p), t: 0.07, art: APPS[old.app][0], more: { e: [0.1, 0.22] } });
  const back = { ...tile, p: tile.p.slice(), q: tile.q, art: APPS[scene.app][0], s: tile.s.slice() };
  back.s[2] = 0.002; back.p[2] = tile.p[2] - tile.s[2] - 0.001;
  turn(back, back.p, [0, 1, 0], 180);
  const pivot = tile.p.slice();
  turn(tile, pivot, [0, 1, 0], angle); turn(back, pivot, [0, 1, 0], angle);
  P.push(tile, back);
  const firstName = t < 0.275, nameProgress = firstName ? progress(t, 0.05, 0.275) : progress(t, 0.275, 0.5);
  const name = firstName ? icon(APPS[old.app][1], 0.56, H - BAR + 0.12, 1.14, 0.2, 'night', 0.031) : icon(APPS[scene.app][1], 0.56, H - BAR + 0.12, 1.14, 0.2, 'night', 0.031);
  const edge = SCREEN.l + (0.56 + 1.14 * nameProgress) * U;
  name.clip = firstName ? [1, 0, 0, -edge] : [-1, 0, 0, edge]; P.push(name);
  const before = PLATES[old.layout], after = PLATES[scene.layout], f = progress(t, 0, 0.5);
  for (const role of Object.keys(after)) {
    const rect = rectMix(before[role], after[role], f);
    if (rect[2] <= 0 || rect[3] <= 0) continue;
    P.push(on('night', ...rect, role === 'tools' ? { lift: 0.05, t: 0.04, more: { e: [0.1, 0.5] } } : {}));
  }
  const [a, b] = EXPORTS[i], clicked = held(t, a, a + 0.12), lift = 0.05 - (clicked ? 0.035 : 0), run = held(t, a, b);
  const button = [W - 0.98, H - BAR + 0.08, 0.86, 0.28];
  if (run) {
    const e = linear(t, a, b), x = button[0], w = button[2];
    if (e > 0) P.push({ ...on('red', x, button[1], w * e, button[3], { lift, t: 0.06, art: 'export' }), window: [0, 0, e, 1] });
    if (e < 1) P.push({ ...on('ink', x + w * e, button[1], w * (1 - e), button[3], { lift, t: 0.06, art: 'export' }), window: [e, 0, 1, 1] });
  } else P.push(on('red', ...button, { lift, t: 0.06, art: 'export' }));
  const cw = 0.46, tip = [10 / 96, 6 / 96];
  P.push({ ...box('paper', [SCREEN.l + cursorAt[0] * U + cw * (0.5 - tip[0]), SCREEN.b + cursorAt[1] * U - cw * (0.5 - tip[1]), ZF + (pressed || clicked ? 0.12 : 0.22)], [cw, cw, 0.004]), art: 'cursor', cut: true });
  return P;
}
// the tools down the left of a design app, one of them lit
function rail(P, tools, lit) {
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
// Only InDesign's export lands on the floor. The photograph and the maps go on into the next app, so the floor stays empty until then.

// What InDesign exports, squared up into one block that is as wide as the open booklet and sits in the middle of the mat.
// Behind: a stack of closed copies, the post in a phone, the e-blast in a tablet. In front: the copy that is taken off the top
// of the stack, opened and leafed through.
const DEEP = 1.45, LEAF = DEEP * 440 / 340;              // a page of the booklet: how deep it is (toward us) and how wide
const GUT = 0.12, PHONE = 0.7, TABLET = LEAF - PHONE - 2 * GUT;   // the gutter between two things in the block, and the two devices that share a page's width with it
const SHEET = 0.01, COPY = 5 * SHEET, COPIES = 6;        // how thick one leaf is, and one closed copy (the four leaves that turn, and the rest); how many copies land
export const BLOCK = { x0: MAT.x + MAT.w / 2 - LEAF, x1: MAT.x + MAT.w / 2 + LEAF, z0: MAT.z, z1: MAT.z + 2 * DEEP + GUT, up: 0.6 };   // the room the block takes, for the tools that crop a still to it

// A closed copy: the white edges of its pages under a dark cover. x, z: its back left corner. y: what it lies on.
function closed(P, x, z, y = 0, art = 'kCover') {
  const skin = 0.008;
  P.push(flat('paper', x, z, LEAF, DEEP, COPY - skin, undefined, y), flat('ink', x, z, LEAF, DEEP, skin, art, y + COPY - skin));
}
// The booklet's leaves from the cover inward: what is printed on the front of each, and on its back. The copy on the mat turns
// these four, so it opens at The Offering, then Location, then Amenities, then the gallery. LAST: the page the fourth one uncovers.
const LEAVES = [['kCover', 'kOfferL'], ['kOfferR', 'kLocL'], ['kLocR', 'kAmL'], ['kAmR', 'kGalL']], LAST = 'kGalR';
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
// 1 is open at The Offering, 2 at Location, 3 at Amenities, 4 at the gallery.
function copy(P, x, z, from, at) {
  if (at <= 0) {                                          // on its way: up off the stack, toward us, then across (clear of the devices), and down
    const u = clamp(at + 1, 0, 1), e = u * u * (3 - 2 * u);
    return closed(P, mix(from[0], x + LEAF, e * e), mix(from[2], z, 1 - (1 - e) ** 2), mix(from[1], 0, e) + 0.55 * Math.sin(Math.PI * u));
  }
  const i = Math.min(Math.floor(at), LEAVES.length - 1), f = Math.min(at - i, 1), [front, back] = LEAVES[i];
  const right = (LEAVES.length - i) * SHEET, left = i * SHEET;   // how thick the pages are on each side of the leaf that is turning
  P.push(flat('paper', x + LEAF, z, LEAF, DEEP, right, LEAVES[i + 1] ? LEAVES[i + 1][0] : LAST));
  if (left) P.push(flat('paper', x, z, LEAF, DEEP, left, LEAVES[i - 1][1]));
  if (f === 0) P.push(flat('paper', x + LEAF, z, LEAF, DEEP, SHEET, front, right));
  else if (f === 1) P.push(flat('paper', x, z, LEAF, DEEP, SHEET, back, left));
  else leaf(P, x + LEAF, z, mix(right, left, f) + SHEET / 2, f, front, back);
}
// at: where the copy that is being read has got to (see copy). By default a leaf is landing on the Location spread.
function prints(P, at = 1.82) {
  const x = BLOCK.x0, z = BLOCK.z0, n = COPIES - 1;
  for (let i = 0; i < n; i++) closed(P, x, z, i * COPY, i === n - 1 ? 'kCover' : undefined);                  // the stack, less the copy that was taken
  P.push(...device(x + LEAF + GUT, z, PHONE, DEEP, 'post', { rim: 0.04 }), ...device(x + LEAF + 2 * GUT + PHONE, z, TABLET, DEEP, 'mail', { rim: 0.05, round: 0.1 }));
  copy(P, x, z + DEEP + GUT, [x, n * COPY, z], at);
}

// Photoshop comes first: the building's photograph, half way through its edit. Every later piece uses it. Nothing lands on the floor.
function photoshop(t) {
  const P = [];
  rail(P, ['tMove', 'tMarquee', 'tBrush', 'tType', 'tRect', 'tDrop'], 2);
  // the panel on the right: levels, two sliders, the layers
  P.push(icon('histo', PANEL + 0.09, TOP - 0.42, 0.67, 0.28));
  [mix(0.2, 0.55, progress(t, 1.3, 2.4)), mix(0.5, 0.3, progress(t, 1.3, 2.4))].forEach((v, i) => {
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
  const ih = 2.05, iw = ih * 526 / 360, x = CANVAS.l + (CANVAS.w - iw) / 2, y = CANVAS.b + (CANVAS.h - ih) / 2, cut = 1 - progress(t, 1.3, 2.4);
  const photo = [x, y, iw, ih], split = x + iw * cut;
  if (t < 3.2) {
    if (cut > 0) P.push({ ...on('ink', x, y, iw * cut, ih, { lift: 0.06, t: 0.02, art: 'kPhotoB' }), window: [0, 0, cut, 1] });
    if (cut < 1) P.push({ ...on('ink', split, y, iw * (1 - cut), ih, { lift: 0.06, t: 0.02, art: 'kPhoto' }), window: [cut, 0, 1, 1] });
  } else travel(P, 'photo', photo, DOCK.photo, t, 3.2, 3.7);
  if (t < 2.55) {
    const h = (ih + 0.1) * (1 - progress(t, 2.4, 2.55));
    if (h > 0) P.push(on('paper', split - 0.012, y + ih / 2 - h / 2, 0.024, h, { lift: 0.085, t: 0.01 }));
    if (t < 2.4) P.push(dot('paper', split, y + ih / 2, 0.09, { lift: 0.085, t: 0.02 }), dot('red', split, y + ih / 2, 0.045, { lift: 0.105, t: 0.01 }));
  }
  P.cursor = cursor(t, [[0.6, EXPORT], [1.2, [x + iw, y + ih / 2]], [1.3, [x + iw, y + ih / 2]], [2.4, [x, y + ih / 2]], [2.6, [x, y + ih / 2]], [3.1, EXPORT]]);
  P.pressed = held(t, 1.3, 2.4);
  return P;
}

// Illustrator comes second: the booklet's two maps, which are line work. Nothing lands on the floor.
const FLYER = { gold: ['#9B7C29', '#86691F', '#5E4915'], lite: ['#CEAB48', '#B3933B', '#836A28'], coal: ['#282928', '#1F201F', '#161716'], black: ['#0A0F16', '#080C12', '#05080C'] };   // the flyer's colours, lit, on top and in shade
function illustrator(t) {
  const P = [];
  rail(P, ['tArrow', 'tPen', 'tType', 'tRect', 'tCircle', 'tDrop'], t < 2.3 ? 1 : 0);
  // down the right: swatches in the flyer's colours, type, layers
  P.push(on('night', PANEL, 0.1, 0.85, TOP - 0.1));
  [FLYER.gold, FLYER.lite, 'paper', FLYER.coal, FLYER.black, 'grey'].forEach((tone, i) => {
    const pc = on(typeof tone === 'string' ? tone : 'paper', PANEL + 0.09 + (i % 3) * 0.235, TOP - 0.3 - Math.floor(i / 3) * 0.235, 0.2, 0.2, { lift: 0.05, t: 0.02 });
    P.push(typeof tone === 'string' ? pc : { ...pc, tones: tone });
  });
  P.push(icon('aa', PANEL + 0.09, TOP - 1.06, 0.5, 0.34));
  [0.67, 0.5, 0.6, 0.42].forEach((w, i) => P.push(on(i === 0 ? 'grey' : 'dark', PANEL + 0.09, TOP - 1.4 - i * 0.2, w, 0.1, { lift: 0.05, t: 0.02 })));
  // The canvas: two artboards. Above, King Street from the Amenities spread. Below, downtown from the Location spread, and beside it
  // a closer view of the part that the red frame marks. The lower row is as tall as lets the map and its close-up fill the width.
  const [sx, sy, sw, sh] = SPOT, pw = 3.2, ph = pw * 850 / 2200, gap = 0.1, low = (pw - gap) / (1352 / 850 + sw / sh), lw = low * 1352 / 850, cw = low * sw / sh;
  const x = CANVAS.l + (CANVAS.w - pw) / 2, y2 = CANVAS.b + (CANVAS.h - ph - low - gap) / 2, y = y2 + low + gap, x2 = x + lw + gap, k = lw / 1352;
  const upper = [x, y, pw, ph], lower = [x, y2, lw, low], close = [x2, y2, cw, low];
  const frame = [x + sx * k, y2 + low - (sy + sh) * k, sw * k, sh * k];
  for (const rect of [upper, lower]) P.push({ ...on('ink', ...rect, { lift: 0.055, t: 0.02 }), tones: FLYER.coal });
  if (t < 4.25) reveal(P, on('ink', ...upper, { lift: 0.06, t: 0.02, art: 'kMap' }), x, pw, progress(t, 0.7, 1.5));
  else travel(P, 'map', upper, DOCK.map, t, 4.25, 4.75);
  if (t < 4.45) reveal(P, on('ink', ...lower, { lift: 0.06, t: 0.02, art: 'kLoc' }), x, lw, progress(t, 1.65, 2.25));
  else travel(P, 'loc', lower, DOCK.loc, t, 4.45, 4.95);
  if (t >= 2.35 && t < 4.2) {
    const p = progress(t, 2.35, 2.65);
    if (p > 0) P.push(...outline(frame[0], frame[1] + frame[3] * (1 - p), frame[2] * p, frame[3] * p));
  }
  if (t >= 2.7 && t < 4.45) {
    const p = t < 4.2 ? progress(t, 2.7, 3.2) : 1 - progress(t, 4.2, 4.45);
    P.push(on('ink', ...rectMix(frame, close, p), { lift: 0.075 + 0.08 * Math.sin(Math.PI * p), t: 0.02, art: 'kLocClose' }));
  }
  const z = cw / sw, at = ([X, Y]) => [x2 + (X - sx) * z, y2 + low - (Y - sy) * z], { line, knots, arms } = subwayPath();
  const segments = line.slice(1).map((b, i) => inside(line[i], b, SPOT)).filter(Boolean);
  if (t >= 3.25 && t < 4.2) {
    const p = progress(t, 3.25, 3.6) * segments.length;
    segments.forEach(([a, b], i) => { const f = clamp(p - i, 0, 1); if (f > 0) P.push(bar(at(a), at(rectMix(a, b, f)))); });
    if (t >= 3.6) {
      arms.slice(0, 2).forEach(([a, b]) => { const end = at(b); P.push(bar(at(a), end, { line: 0.012 }), dot('red', end[0], end[1], 0.026, { lift: 0.085, t: 0.012 })); });
      knots.filter(([X, Y]) => X > sx && X < sx + sw && Y > sy && Y < sy + sh).forEach(p => P.push(handle(...at(p))));
    }
  }
  chip(P, 'photo');
  const upLeft = [x, y + ph * (1 - 426 / 850)], upRight = [x + pw, upLeft[1]], lowLeft = [x, y2 + low * (1 - 368 / 850)], lowRight = [x + lw, lowLeft[1]];
  const fTop = [frame[0], frame[1] + frame[3]], fBottom = [frame[0] + frame[2], frame[1]], selected = at([750, 506]);
  P.cursor = cursor(t, [[0.3, EXPORT], [0.7, upLeft], [1.5, upRight], [1.65, lowLeft], [2.25, lowRight], [2.35, fTop], [2.65, fBottom], [3.2, fBottom], [3.25, selected], [3.7, selected], [4.15, EXPORT]]);
  P.pressed = held(t, 0.7, 1.5) || held(t, 1.65, 2.25) || held(t, 2.35, 2.65) || held(t, 3.25, 3.37);
  return P;
}

// InDesign comes last: the booklet, and the LinkedIn post and the e-blast that follow it. Its export is what lands (see prints).
// at: where the copy that is being read has got to.
function indesign(t, { at: pages } = {}) {
  const P = [];
  rail(P, ['tArrow', 'tType', 'tFrame', 'tRect', 'tLine', 'tDrop'], 0);
  // the pages panel: the cover, four spreads, the back, with the spread on the canvas lit
  P.push(on('night', PANEL, 0.1, 0.85, TOP - 0.1));
  const tw = 0.36, th = tw * 340 / 440, mid = PANEL + 0.425;
  [[null, 'kCover'], ['kOfferL', 'kOfferR'], ['kLocL', 'kLocR'], ['kAmL', 'kAmR'], ['kGalL', 'kGalR'], ['kBack', null]].forEach(([l, r], i) => {
    const y = TOP - 0.13 - (i + 1) * th - i * 0.1;
    if (i === 3) P.push(on('red', mid - tw - 0.03, y - 0.03, tw * 2 + 0.06, th + 0.06, { lift: 0.05, t: 0.01 }));
    if (l) P.push(on('ink', mid - tw, y, tw, th, { lift: 0.065, t: 0.008, art: i === 2 && t < 1.25 ? undefined : l }));
    if (r) P.push(on('ink', mid, y, tw, th, { lift: 0.065, t: 0.008, art: i === 2 && t < 1.25 ? undefined : r }));
  });
  // the canvas: the Amenities spread above, with the map from Illustrator placed and selected; under it the cover, the post and the e-blast
  const gap = 0.12, low = 1.0, pw = 1.6, ph = pw * 340 / 440, x = CANVAS.l + (CANVAS.w - 2 * pw) / 2, y2 = CANVAS.b + (CANVAS.h - ph - low - gap) / 2, y = y2 + low + gap;
  const cw = low * 440 / 340, ew = 2 * pw - cw - low - 2 * gap;
  const cover = [x, y2, cw, low], post = [x + cw + gap, y2, low, low], mail = [x + cw + low + 2 * gap, y2, ew, low];
  P.push({ ...on('ink', x, y, pw, ph, { lift: 0.06, t: 0.02, art: t >= 1 ? 'kAmL' : undefined }), tones: FLYER.coal }, { ...on('ink', x + pw, y, pw, ph, { lift: 0.06, t: 0.02, art: t >= 1 ? 'kAmR' : undefined }), tones: FLYER.coal });
  const at = (X, Y) => [x + X / 1100 * pw, y + ph - Y / 850 * ph];
  const [fl, ft] = at(34, 84), [fr, fb] = at(2056, 826), frame = [fl, fb, fr - fl, ft - fb];
  if (t < 1) emptyFrame(P, frame, false);
  if (t < 1.8) emptyFrame(P, cover, true, progress(t, 1.55, 1.8));
  if (t < 2) emptyFrame(P, post, true, progress(t, 1.7, 2));
  if (t < 2.15) emptyFrame(P, mail, true, progress(t, 1.85, 2.15));
  if (t < 0.55) chip(P, 'map');
  else if (t < 1) travel(P, 'map', DOCK.map, frame, t, 0.55, 1, [34 / 2200, 84 / 850, 2056 / 2200, 826 / 850]);
  if (t < 0.8) chip(P, 'loc');
  else if (t < 1.25) {
    const ty = TOP - 0.13 - 3 * th - 0.2;
    travel(P, 'loc', DOCK.loc, [mid - tw, ty, 2 * tw * 1352 / 2200, th], t, 0.8, 1.25);
  }
  const photo = [x + cw * 380 / 1100, y2 + (low - cw * (1 - 380 / 1100) * 360 / 526) / 2, cw * (1 - 380 / 1100), cw * (1 - 380 / 1100) * 360 / 526];
  if (t < 1.1) chip(P, 'photo');
  else if (t < 1.8) travel(P, 'photo', DOCK.photo, photo, t, 1.1, 1.55);
  reveal(P, on('ink', ...cover, { lift: 0.06 + 0.035 * (1 - progress(t, 1.55, 1.8)), t: 0.02, art: 'kCover' }), x, cw, progress(t, 1.55, 1.8));
  reveal(P, on('ink', ...post, { lift: 0.06, t: 0.02, art: 'kPost' }), post[0], low, progress(t, 1.7, 2));
  reveal(P, { ...on('ink', ...mail, { lift: 0.06, t: 0.02, art: 'eblast' }), window: [0, 0, 1, Math.min(1, low / ew * 320 / 472)] }, mail[0], ew, progress(t, 1.85, 2.15));
  if (t >= 1) {
    P.push(...outline(fl, fb, fr - fl, ft - fb, { line: 0.012 }));
    [[fl, ft], [(fl + fr) / 2, ft], [fr, ft], [fl, (ft + fb) / 2], [fr, (ft + fb) / 2], [fl, fb], [(fl + fr) / 2, fb], [fr, fb]].forEach(([ax, ay]) => P.push(handle(ax, ay)));
  }
  const read = pages ?? bookAt(t), floor = [];
  prints(floor, read);
  feed(P, [...floor.slice(0, 10), ...floor.slice(14)], t, 2.8, 3.3);
  feed(P, floor.slice(10, 12), t, 2.95, 3.4);
  feed(P, floor.slice(12, 14), t, 3.1, 3.55);
  takeBack(P, t, 8.9, 9.4);
  const mapCentre = centre(DOCK.map), target = centre(frame);
  P.cursor = cursor(t, [[0.25, EXPORT], [0.55, mapCentre], [1, target], [2.25, target], [2.7, EXPORT]]);
  P.pressed = held(t, 0.55, 1);
  return P;
}

// ---- The screens the other crafts export to. They lie in one row across the mat: a tablet on its side, then two phones.
const ROW = 1.8, SLIM = 0.955, WIDE = MAT.w - 2 * SLIM - 2 * MAT.gap;            // the row's depth, a phone's width, the tablet's width: their screens are 16:9 and 9:18
function screens(P, wide, tall, third) {
  const { x, z, gap: g } = MAT;
  P.push(...device(x, z, WIDE, ROW, wide, { rim: 0.075, round: 0.09 }), ...device(x + WIDE + g, z, SLIM, ROW, tall, { rim: 0.055 }), ...device(x + WIDE + SLIM + 2 * g, z, SLIM, ROW, third, { rim: 0.055 }));
}

// ---- 02 Video: Premiere Pro has cut a video (captions, a transition, an effect) and exported it wide, tall and square
function video(t) {
  const P = [];
  const top = TOP, mid = 1.3;                             // the panels' top edge, and where the timeline's share of the screen begins
  // the bin: clips to cut from
  ['thumbA', 'thumbB', 'thumbC', 'thumbB', 'thumbA', 'thumbC'].forEach((art, i) => P.push(on('ink', 0.14 + (i % 2) * 0.39, top - 0.3 - Math.floor(i / 2) * 0.28, 0.35, 0.197, { lift: 0.05, t: 0.015, art })));
  [0.6, 0.44].forEach((w, i) => P.push(on('dark', 0.14, mid + 0.22 - i * 0.12, w, 0.05, { lift: 0.05, t: 0.01 })));
  // the viewer: the frame under the playhead, with its caption
  const play = t >= 3.65 && t < 5.25, at = play ? 3.9 * linear(t, 3.65, 5.25) : 0.9;
  const view = [1.33, mid + 0.2, 1.92, 1.08];
  P.push(on('ink', ...view, { lift: 0.06, t: 0.02, art: at < 1.46 ? 'shotA' : at < 2.7 ? 'shotB' : 'shotCfx' }));
  if (at >= 1.14 && at < 1.46) reveal(P, on('ink', ...view, { lift: 0.082, t: 0.004, art: 'shotB' }), view[0], view[2], EASE.wipe((at - 1.14) / 0.32));
  const cap = play ? CAPTIONS.findIndex(([x, w]) => at >= x && at < x + w) : 1;
  if (cap >= 0 && t >= 1.2) {
    const l = view[0] + (view[2] - 0.704) / 2;
    reveal(P, on('paper', l, view[1] + 0.28 - 0.148, 0.704, 0.148, { lift: 0.09, t: 0.004, art: ['cap1', 'cap2', 'cap3', 'cap1', 'cap2'][cap] }), l, 0.704, progress(t, 1.2, 1.4));
  }
  P.push(icon('transport', 2.04, mid + 0.045, 0.5, 0.1));
  // The grade follows the effect landing.
  const ex = 3.64;
  const grade = progress(t, 3.3, 3.5);
  for (let i = 0; i < 3; i++) {
    P.push(dot('dark', ex + 0.22 + i * 0.355, top - 0.3, 0.15));
    P.push(dot(i === 1 ? 'red' : 'paper', ex + 0.22 + i * 0.355 + [0.05, -0.04, 0.02][i] * grade, top - 0.3 + [0.03, 0.05, -0.06][i] * grade, 0.035, { lift: 0.08, t: 0.01 }));
  }
  [mix(0.5, 0.62, grade), mix(0.5, 0.3, grade)].forEach((v, i) => {
    const y = top - 0.66 - i * 0.2;
    P.push(on('dark', ex + 0.1, y, 0.95, 0.03, { lift: 0.05, t: 0.01 }), on(i === 0 ? 'red' : 'grey', ex + 0.1, y, 0.95 * v, 0.03, { lift: 0.06, t: 0.012 }));
    P.push(on('paper', ex + 0.1 + 0.95 * v - 0.025, y - 0.04, 0.05, 0.11, { lift: 0.07, t: 0.02 }));
  });
  // the timeline: captions above, the cut with its transition in the middle, sound below, and the playhead across them all
  const x0 = 0.44;
  P.push(icon('ruler', x0, 1.01, W - 0.2 - x0, 0.06));
  [['tT', 0.84], ['tV', 0.54], ['tA', 0.18]].forEach(([art, y]) => P.push(icon(art, 0.16, y, 0.2, 0.2)));
  CAPTIONS.forEach(([x, w], i) => {
    const p = progress(t, 0.95 + i * 0.09, 1.13 + i * 0.09);
    if (p > 0) P.push(on(i === 2 ? 'paper' : 'grey', x0 + x, 0.88, w * p, 0.09, { lift: 0.05, t: 0.02 }));
  });
  [[0, 1.3, 'grey', 'thumbA'], [1.3, 1.4, 'red', 'thumbB'], [2.7, 1.2, 'grey', 'thumbC']].forEach(([x, w, tone, art]) => {
    P.push(on(tone, x0 + x + 0.01, 0.48, w - 0.02, 0.32, { lift: 0.05, t: 0.03 }), on('ink', x0 + x + 0.04, 0.51, 0.46, 0.26, { lift: 0.085, t: 0.004, art }));
  });
  const transFrom = [3.74, mid + 0.07, 0.2, 0.2], transTo = [x0 + 1.3 - 0.16, 0.48, 0.32, 0.32];
  const fxFrom = [4.04, mid + 0.07, 0.36, 0.2], fxTo = [x0 + 3.44, 0.54, 0.36, 0.2];
  travelling(P, on('paper', ...rectMix(transFrom, transTo, progress(t, 1.8, 2.35)), { lift: 0.1, t: 0.02, art: 'trans' }), held(t, 1.8, 2.35));
  travelling(P, on('red', ...rectMix(fxFrom, fxTo, progress(t, 2.8, 3.3)), { lift: 0.09, t: 0.015, art: 'fx' }), held(t, 2.8, 3.3));
  P.push(on('dark', x0 + 0.01, 0.15, 3.88, 0.26, { lift: 0.05, t: 0.02, art: 'wave' }));
  const head = x0 + at;
  P.push(on('red', head - 0.015, 0.13, 0.03, 0.95, { lift: 0.13, t: 0.01 }), on('red', head - 0.07, 1.01, 0.14, 0.1, { lift: 0.13, t: 0.02 }));

  feedScreens(P, t, ['playerWide', 'reel', 'feedSq'], [[5.8, 6.3], [5.95, 6.4], [6.05, 6.45]], [7.6, 8]);
  P.cursor = cursor(t, [[0.55, EXPORT], [0.9, [0.26, 0.94]], [1.45, [0.26, 0.94]], [1.75, centre(transFrom)], [1.8, centre(transFrom)], [2.35, centre(transTo)], [2.45, centre(transTo)], [2.75, centre(fxFrom)], [2.8, centre(fxFrom)], [3.3, centre(fxTo)], [3.4, centre(fxTo)], [3.6, [2.29, mid + 0.095]], [5.3, [2.29, mid + 0.095]], [5.7, EXPORT]]);
  P.pressed = held(t, 0.9, 1.02) || held(t, 1.8, 2.35) || held(t, 2.8, 3.3) || held(t, 3.6, 3.72);
  return P;
}

// ---- 03 Motion: After Effects has animated words and shapes, the way a SaaS promo moves, and exported it to the same three screens
// each layer: its icon, its label's tone, how long its name is, when its bar starts and how long it is, and where its keyframes are
export const LAYERS = [
  ['tT', 'red', 0.5, 0, 3.2, [0.1, 0.6]], ['tT', 'red', 0.36, 0.2, 3, [0.35, 0.85]], ['lStar', 'paper', 0.28, 0.6, 2.6, [0.75, 1.45]],
  ['lStar', 'grey', 0.44, 1, 2.2, [1.2, 1.7]], ['lStar', 'grey', 0.44, 1.15, 2.05, [1.35, 1.85]], ['lStar', 'grey', 0.44, 1.3, 1.9, [1.5, 2]],
];
function motion(t) {
  const P = [];
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
  const at = t >= 2.65 && t < 4.25 ? 2.4 * linear(t, 2.65, 4.25) : 1.6, selected = t >= 0.9;
  const fx = 1.33, fy = mid + 0.2, fw = 1.92, fh = 1.08, k = fw / 480;
  P.push(on('paper', fx, fy, fw, fh, { lift: 0.06, t: 0.02 }));
  const comp = ([x, y]) => [fx + x * k, fy + fh - y * k];
  const layerProgress = i => linear(at, ...LAYERS[i][5]);
  [[28, 62, 232, 62, 'wMake'], [28, 136, 168, 52, 'wMove']].forEach(([x, y, w, h, art], i) => {
    const [l, top] = comp([x, y]);
    reveal(P, on('paper', l, top - h * k, w * k, h * k, { lift: 0.083, t: 0.004, art }), l, w * k, EASE.wipe(layerProgress(i)));
  });
  const bp = BALL_EASE(layerProgress(2)), pos = quadratic(BALL_FROM, BALL_VIA, BALL, bp), [bx, by] = comp(pos), half = (BALL[2] + 8) * k;
  if (at >= LAYERS[2][5][0]) {
    P.push(dot('red', bx, by, BALL[2] * k, { lift: 0.085, t: 0.006 }));
    if (selected) {
      P.push(...outline(bx - half, by - half, half * 2, half * 2, { line: 0.012 }));
      for (const dx of [-1, 1]) for (const dy of [-1, 1]) P.push(on('red', bx + dx * half - 0.02, by + dy * half - 0.02, 0.04, 0.04, { lift: 0.09, t: 0.008 }));
    }
  }
  ROWS.forEach(([x, y, w, h], i) => {
    if (at < LAYERS[i + 3][5][0]) return;
    // saas() records the approved parked pose. Recover the rest position so this pose survives the new timing.
    const parked = 1 - EASE.enter(linear(1.6, ...LAYERS[i + 3][5]));
    const rest = x - parked * 0.75 * w, [l, top] = comp([rest + (1 - EASE.enter(layerProgress(i + 3))) * 0.75 * w, y]);
    const visible = clamp((fx + fw - l) / (w * k), 0, 1);
    if (visible > 0) P.push({ ...on('paper', l, top - h * k, w * k * visible, h * k, { lift: 0.083, t: 0.004, art: i ? 'rowB' : 'rowA' }), window: [0, 0, visible, 1] });
  });
  if (selected) {
    for (let i = 1; i < 12; i++) { const [x, y] = comp(quadratic(BALL_FROM, BALL_VIA, BALL, i / 12)), w = 60 * 0.056 * k; P.push(on('dark', x - w / 2, y - w / 2, w, w, { lift: 0.086, t: 0.004 })); }
    const [x, y] = comp(BALL_FROM), w = 60 * 0.16 * k;
    P.push(...outline(x - w / 2, y - w / 2, w, w, { tone: 'dark', line: 60 * 0.04 * k }));
  }
  P.push(icon('transport', 2.04, mid + 0.045, 0.5, 0.1));
  // the graph: the ease between the ball's two keyframes
  const ex = 3.64;
  P.push(icon('graphGrid', ex + 0.1, mid + 0.3, 0.95, 0.79));
  const graph = ([x, y]) => [ex + 0.1 + x / 240 * 0.95, mid + 0.3 + (1 - y / 200) * 0.79];
  const g0 = [24, 176], g1 = [216, 24], bend = progress(t, 1.5, 2.1);
  const h0 = rectMix([88, 176 - 152 / 3], [128, 176], bend), h1 = rectMix([152, 24 + 152 / 3], [112, 24], bend);
  if (selected) {
    for (let i = 0; i < 14; i++) P.push(bar(graph(cubic(g0, h0, h1, g1, i / 14)), graph(cubic(g0, h0, h1, g1, (i + 1) / 14)), { line: 0.95 * 6 / 240, lift: 0.057 }));
    for (const [a, b] of [[g0, h0], [g1, h1]]) { const end = graph(b); P.push(bar(graph(a), end, { tone: 'grey', line: 0.95 * 3 / 240, lift: 0.058 }), dot('grey', ...end, 0.95 * 6 / 240, { lift: 0.06, t: 0.004 })); }
    for (const [x, y] of [g0, g1].map(graph)) P.push(on('paper', x - 0.95 * 8 / 240, y - 0.79 * 8 / 200, 0.95 * 16 / 240, 0.79 * 16 / 200, { lift: 0.065, t: 0.004 }));
  }
  [0.5, 0.32].forEach((w, i) => P.push(on(i ? 'dark' : 'grey', ex + 0.1, mid + 0.17 - i * 0.09, w, 0.04, { lift: 0.05, t: 0.01 })));
  // the timeline: a row for each layer, with its bar and its keyframes, and the playhead across them all
  const x0 = 1.34;
  P.push(icon('ruler', x0, 1.01, W - 0.2 - x0, 0.06));
  LAYERS.forEach(([kind, tone, name, from, len, keys], i) => {
    const y = 0.84 - i * 0.14, lit = selected && i === 2;
    if (lit) P.push(on('dark', 0.12, y - 0.02, W - 0.24, 0.13, { lift: 0.035, t: 0.006 }));
    P.push(on(tone, 0.17, y + 0.015, 0.06, 0.06, { lift: 0.05, t: 0.01 }), icon(kind, 0.28, y - 0.015, 0.12, 0.12, lit ? 'dark' : 'night', lit ? 0.042 : 0.051), on(lit ? 'paper' : 'grey', 0.46, y + 0.025, name, 0.04, { lift: 0.05, t: 0.01 }));
    P.push(on(lit ? 'grey' : 'dark', x0 + from, y, len, 0.09, { lift: 0.05, t: 0.012 }));
    keys.forEach(t => P.push(icon(lit ? 'kfOn' : 'kf', x0 + t - 0.045, y, 0.09, 0.09, lit ? 'grey' : 'dark', 0.063)));
  });
  const head = x0 + at;
  P.push(on('red', head - 0.015, 0.13, 0.03, 0.95, { lift: 0.13, t: 0.01 }), on('red', head - 0.07, 1.01, 0.14, 0.1, { lift: 0.13, t: 0.02 }));

  feedScreens(P, t, ['motWide', 'motTall', 'motSq'], [[4.8, 5.3], [4.95, 5.4], [5.05, 5.45]], [6.8, 7.2]);
  P.cursor = cursor(t, [[0.5, EXPORT], [0.85, [0.7, 0.605]], [1.1, [0.7, 0.605]], [1.45, graph([88, 176 - 152 / 3])], [1.5, graph([88, 176 - 152 / 3])], [2.1, graph([128, 176])], [2.3, graph([128, 176])], [2.6, [2.29, mid + 0.095]], [4.3, [2.29, mid + 0.095]], [4.7, EXPORT]]);
  P.pressed = held(t, 0.9, 1.02) || held(t, 1.5, 2.1) || held(t, 2.6, 2.72);
  return P;
}

// ---- 04 UX/UI: Figma, with this page's own hero in it: its wireframes above and its designs below, on a desktop and on a phone in
// two states. A prototype link runs from the second craft in the phone's list to the state it leads to. Exported to the same screens.
// each layer in the list: its icon, how far it is set in, and how long its name is
const TREE = [['lFrame', 0, 0.34], ['lFrame', 0, 0.34], ['tT', 1, 0.2], ['tV', 1, 0.26], ['tV', 2, 0.18], ['tV', 2, 0.14], ['tV', 1, 0.2], ['lFrame', 0, 0.3], ['lFrame', 0, 0.36], ['lFrame', 0, 0.36]];
function figma(t) {
  const P = [];
  const LW = 0.72, cl = 0.08 + LW + 0.08, cr = PANEL - 0.08;     // how wide the list of layers is, and the canvas's left and right edges
  // down the left: two pages, then the layers, with the one that carries the link lit
  [0.36, 0.26].forEach((w, i) => P.push(on(i ? 'dark' : 'grey', 0.17, TOP - 0.19 - i * 0.12, w, 0.05, { lift: 0.05, t: 0.01 })));
  P.push(on('dark', 0.14, TOP - 0.4, LW - 0.12, 0.012, { lift: 0.05, t: 0.006 }));
  TREE.forEach(([kind, set, len], i) => {
    const y = TOP - 0.58 - i * 0.145, x = 0.16 + set * 0.1, lit = i === 5 && t >= 2.2;
    if (lit) P.push(on('dark', 0.11, y - 0.025, LW - 0.06, 0.13, { lift: 0.035, t: 0.006 }));
    P.push(icon(kind, x, y - 0.005, 0.09, 0.09, lit ? 'dark' : 'night', lit ? 0.042 : 0.051), on(lit ? 'paper' : 'grey', x + 0.13, y + 0.02, len, 0.04, { lift: 0.05, t: 0.01 }));
  });
  // down the right: the Prototype tab, lit. Where the flow starts, the link itself (this layer, then the frame it goes to), and its ease.
  P.push(on('night', PANEL, 0.1, 0.85, TOP - 0.1));
  P.push(on('dark', PANEL + 0.09, TOP - 0.2, 0.26, 0.05, { lift: 0.05, t: 0.01 }), on('paper', PANEL + 0.43, TOP - 0.2, 0.33, 0.05, { lift: 0.05, t: 0.01 }), on('red', PANEL + 0.43, TOP - 0.265, 0.33, 0.02, { lift: 0.05, t: 0.01 }));
  if (t >= 2.9) P.push(on('red', PANEL + 0.09, TOP - 0.54, 0.15, 0.15, { lift: 0.05, t: 0.015 }), icon('pPlay', PANEL + 0.12, TOP - 0.51, 0.09, 0.09, 'red', 0.066), on('grey', PANEL + 0.31, TOP - 0.49, 0.4, 0.045, { lift: 0.05, t: 0.01 }));
  const ly = TOP - 0.9;
  if (t >= 2.97) P.push(on('dark', PANEL + 0.06, ly, 0.73, 0.22, { lift: 0.04, t: 0.008 }), on('grey', PANEL + 0.11, ly + 0.09, 0.2, 0.045, { lift: 0.06, t: 0.01 }), on('paper', PANEL + 0.48, ly + 0.09, 0.26, 0.045, { lift: 0.06, t: 0.01 }));
  if (t >= 2.97) P.push(bar([PANEL + 0.35, ly + 0.112], [PANEL + 0.44, ly + 0.112], { line: 0.014, lift: 0.06 }), bar([PANEL + 0.44, ly + 0.112], [PANEL + 0.405, ly + 0.147], { line: 0.014, lift: 0.06 }), bar([PANEL + 0.44, ly + 0.112], [PANEL + 0.405, ly + 0.077], { line: 0.014, lift: 0.06 }));
  if (t >= 3.04) P.push(icon('graph', PANEL + 0.09, 0.56, 0.67, 0.56));
  [0.5, 0.32].forEach((w, i) => { if (t >= 3.11 + i * 0.07) P.push(on(i ? 'dark' : 'grey', PANEL + 0.09, 0.42 - i * 0.1, w, 0.045, { lift: 0.05, t: 0.01 })); });
  // the canvas: a desktop and two phones in each row, each frame with its name over it
  const h = 0.86, g = 0.18, dw = h * 1.6, pw = h * 180 / 390, x = cl + (cr - cl - dw - 2 * pw - 2 * g) / 2, yUI = 0.46, yWire = yUI + h + 0.26;
  const cols = [[x, dw], [x + dw + g, pw], [x + dw + g + pw + g, pw]];
  cols.forEach(([fx, fw], i) => {
    P.push(on('paper', fx, yWire, fw, h, { lift: 0.06, t: 0.02, art: ['wireWide', 'wireTall', 'wireTall2'][i] }), on('grey', fx, yWire + h + 0.035, i ? 0.17 : 0.26, 0.03, { lift: 0.05, t: 0.008 }));
    const start = 1 + i * 0.15, end = start + 0.4, p = progress(t, start, end);
    const pc = on('ink', fx, mix(yWire, yUI, p), fw, h, { lift: mix(0.03, 0.06, p), t: 0.02, art: ['uiWide', 'uiTall', 'uiTall2'][i] });
    travelling(P, pc, held(t, start, end));
    if (t >= end) P.push(on('grey', fx, yUI + h + 0.035, i ? 0.17 : 0.26, 0.03, { lift: 0.05, t: 0.008 }));
  });
  const [p1] = cols[1], [p2] = cols[2], hy = yUI + h * 0.129, spot = [p1 + pw * 0.49, hy - 0.035, pw * 0.27, 0.07];
  const from = [spot[0] + spot[2], hy], to = [p2, yUI + h * 0.5], end = rectMix(from, to, progress(t, 2.25, 2.85));
  if (t >= 2.2) {
    P.push(...outline(...spot, { line: 0.012 }), dot('red', ...from, 0.03, { lift: 0.085, t: 0.012 }), dot('paper', ...from, 0.012, { lift: 0.097, t: 0.006 }));
    const reach = Math.min(0.16, Math.hypot(end[0] - from[0], end[1] - from[1]) / 3);
    const along = p => cubic(from, [from[0] + reach, from[1]], [end[0] - reach, end[1]], end, p);
    if (t > 2.25) for (let i = 0; i < 8; i++) P.push(bar(along(i / 8), along((i + 1) / 8)));
    if (t >= 2.85) P.push(bar(to, [to[0] - 0.07, to[1] + 0.05]), bar(to, [to[0] - 0.07, to[1] - 0.05]));
  }
  // the tools float over the foot of the canvas
  const tw = 1.0, tx = (cl + cr - tw) / 2;
  ['tArrow', 'tHash', 'tRect', 'tPen', 'tType', 'tChat'].forEach((art, i) => {
    const ix = tx + 0.065 + i * 0.15;
    if (i === 0) P.push(on('red', ix - 0.02, 0.165, 0.17, 0.17, { lift: 0.09, t: 0.012 }));
    P.push(icon(art, ix, 0.185, 0.13, 0.13, i === 0 ? 'red' : 'night', i === 0 ? 0.103 : 0.091));
  });

  feedScreens(P, t, ['siteWide', 'siteTall', 'siteTall2'], [[3.8, 4.3], [3.95, 4.4], [4.05, 4.45]], [6, 6.4]);
  const desktopFrom = [x + dw / 2, yWire + h / 2], desktopTo = [x + dw / 2, yUI + h / 2];
  P.cursor = cursor(t, [[0.6, EXPORT], [0.95, desktopFrom], [1, desktopFrom], [1.4, desktopTo], [1.85, desktopTo], [2.15, from], [2.25, from], [2.85, to], [3.3, to], [3.7, EXPORT]]);
  P.pressed = held(t, 1, 1.4) || held(t, 2.2, 2.85);
  return P;
}

// ---- The clock and the shared choreography. All times are local to the current scene.
const linear = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const progress = (t, a, b) => EASE.wipe(linear(t, a, b));
const held = (t, a, b) => t >= a && t < b;
const rectMix = (a, b, p) => a.map((v, i) => mix(v, b[i], p));
const centre = r => [r[0] + r[2] / 2, r[1] + r[3] / 2];
const EXPORT = [W - 0.42, H - 0.26];
const EXPORTS = [[3.15, 3.65], [4.2, 4.7], [2.75, 3.55], [5.75, 6.45], [4.75, 5.45], [3.75, 4.45]];
const WIPES = [[0.4, 0.8, 4, 4.3], [0.1, 0.5, 4.75, 5.05], [0.1, 0.5, 9.1, 9.4], [0.4, 0.8, 7.7, 8], [0.1, 0.5, 6.9, 7.2], [0.4, 0.8, 6.1, 6.4]];
const CAPTIONS = [[0.08, 0.5], [0.66, 0.42], [1.5, 0.56], [2.14, 0.4], [2.9, 0.62]];
const DOCK = { photo: [1.9, H - BAR + 0.09, 0.38, 0.26], map: [2.36, H - BAR + 0.09, 0.673, 0.26], loc: [3.11, H - BAR + 0.09, 0.414, 0.26] };
const PICTURES = { photo: 'kPhoto', map: 'kMap', loc: 'kLoc' };
const MID = 1.3, TOOL_X = (0.88 + PANEL - 0.08 - 1) / 2;
const foldedView = [1.04, TOP, 2.5, 0], foldedTime = [0.08, 0.1, W - 0.16, 0], foldedTools = [TOOL_X + 0.5, 0.14, 0, 0.22];
const PLATES = {
  design: { left: [0.08, 0.1, 0.36, TOP - 0.1], right: [PANEL, 0.1, 0.85, TOP - 0.1], view: foldedView, time: foldedTime, tools: foldedTools },
  edit: { left: [0.08, MID, 0.86, TOP - MID], right: [3.64, MID, 1.15, TOP - MID], view: [1.04, MID, 2.5, TOP - MID], time: [0.08, 0.1, W - 0.16, MID - 0.2], tools: foldedTools },
  board: { left: [0.08, 0.1, 0.72, TOP - 0.1], right: [PANEL, 0.1, 0.85, TOP - 0.1], view: foldedView, time: foldedTime, tools: [TOOL_X, 0.14, 1, 0.22] },
};
const BALL_EASE = bezier(0.542, 0, 0.458, 1);
const quadratic = (a, b, c, t) => [0, 1].map(i => (1 - t) ** 2 * a[i] + 2 * (1 - t) * t * b[i] + t * t * c[i]);
const cubic = (a, b, c, d, t) => [0, 1].map(i => (1 - t) ** 3 * a[i] + 3 * (1 - t) ** 2 * t * b[i] + 3 * (1 - t) * t * t * c[i] + t ** 3 * d[i]);
const leftOf = x => [-1, 0, 0, SCREEN.l + x * U];
function cursor(t, points) {
  const stops = [[0, EXPORT], ...points];
  for (let i = 1; i < stops.length; i++) if (t < stops[i][0]) return rectMix(stops[i - 1][1], stops[i][1], progress(t, stops[i - 1][0], stops[i][0]));
  return stops.at(-1)[1];
}
function reveal(P, pc, x, w, p) {
  if (p <= 0) return;
  if (p < 1) pc.clip = leftOf(x + w * p);
  P.push(pc);
}
function travelling(P, pc, moving) { if (moving) pc.where = 'travel'; P.push(pc); }
function chip(P, key) {
  const [x, y, w, h] = DOCK[key];
  P.push({ ...on('grey', x - 0.012, y - 0.012, w + 0.024, h + 0.024, { lift: 0.04, t: 0.012 }), where: 'travel' }, { ...on('ink', x, y, w, h, { lift: 0.055, t: 0.02, art: PICTURES[key] }), where: 'travel' });
}
function travel(P, key, from, to, t, a, b, endWindow = [0, 0, 1, 1]) {
  const p = progress(t, a, b), rect = rectMix(from, to, p), dockStart = from === DOCK[key], lift = (dockStart ? mix(0.055, 0.06, p) : mix(0.06, 0.055, p)) + 0.08 * Math.sin(Math.PI * p), [x, y, w, h] = rect;
  // The picture is the same piece throughout. The dock's rim folds down as it leaves, or grows as it lands.
  const rim = 0.012 * (dockStart ? 1 - p : p);
  if (rim > 0) P.push({ ...on('grey', x - rim, y - rim, w + 2 * rim, h + 2 * rim, { lift: lift - 0.015, t: 0.012 }), where: 'travel' });
  P.push({ ...on('ink', ...rect, { lift, t: 0.02, art: PICTURES[key] }), window: rectMix([0, 0, 1, 1], endWindow, p), where: 'travel' });
}
function emptyFrame(P, [x, y, w, h], plate = true, revealed = 0) {
  const start = P.length;
  if (plate) P.push(on('night', x, y, w, h, { lift: 0.05, t: 0.02 }));
  P.push(...outline(x, y, w, h, { tone: 'dark', line: 0.012, lift: 0.075 }), bar([x, y], [x + w, y + h], { tone: 'dark', line: 0.01, lift: 0.075 }), bar([x, y + h], [x + w, y], { tone: 'dark', line: 0.01, lift: 0.075 }));
  if (revealed > 0) for (let i = start; i < P.length; i++) P[i].clip = [1, 0, 0, -(SCREEN.l + (x + w * revealed) * U)];
}
function bookAt(t) {
  if (t < 3.9) return -1;
  if (t < 4.6) return -1 + linear(t, 3.9, 4.6);
  return progress(t, 4.7, 5.3) + progress(t, 5.6, 6.2) + progress(t, 6.5, 7.1) + progress(t, 7.4, 8);
}
function feed(P, pieces, t, a, b) {
  if (t <= a) return;
  const back = t < b ? Math.max(...pieces.flatMap(pc => corners(pc).map(p => p[2]))) - MAT.z + 0.05 : 0, dz = -back * (1 - EASE.enter(linear(t, a, b)));
  for (const pc of pieces) { pc.where = 'floor'; pc.p[2] += dz; pc.clip = [0, 0, 1, -MAT.z]; P.push(pc); }
}
function takeBack(P, t, a, b) {
  if (t <= a) return;
  // Every floor piece shares one displacement, including an open copy and all its strips.
  const dz = -(BLOCK.z1 - MAT.z + 0.05) * EASE.exit(linear(t, a, b));
  for (const pc of P) if (pc.where === 'floor') pc.p[2] += dz;
}
function feedScreens(P, t, art, spans, off) {
  const row = []; screens(row, ...art);
  spans.forEach(([a, b], i) => feed(P, row.slice(i * 2, i * 2 + 2), t, a, b));
  takeBack(P, t, ...off);
}
function inverseWipe(p) {
  let lo = 0, hi = 1;
  for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (EASE.wipe(mid) < p) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}
export const SHOW = [
  { key: 'ps', app: 'ps', layout: 'design', craft: 0, len: 4.3, still: 1.3 + 1.1 * inverseWipe(0.56) },
  { key: 'ai', app: 'ai', layout: 'design', craft: 0, len: 5.05, still: 3.9 },
  { key: 'id', app: 'id', layout: 'design', craft: 0, len: 9.4, still: 5.6 + 0.6 * inverseWipe(0.82) },
  { key: 'pr', app: 'pr', layout: 'edit', craft: 1, len: 8, still: 6.9 },
  { key: 'ae', app: 'ae', layout: 'edit', craft: 2, len: 7.2, still: 6.2 },
  { key: 'fig', app: 'fig', layout: 'board', craft: 3, len: 6.4, still: 5.3 },
];
export const LOOP = SHOW.reduce((sum, scene) => sum + scene.len, 0);
const starts = SHOW.map((_, i) => SHOW.slice(0, i).reduce((sum, scene) => sum + scene.len, 0));
const builders = [photoshop, illustrator, indesign, video, motion, figma];
export function sceneAt(t) {
  if (!Number.isFinite(t)) throw new TypeError('time must be finite');
  let at = t % LOOP;
  if (at < 0) at += LOOP;
  for (let i = SHOW.length - 1; i >= 0; i--) if (at >= starts[i]) return { i, scene: SHOW[i], at: at - starts[i] };
}
function build(i, at, o) {
  const app = builders[i](at, o), P = shell(i, at, app.cursor || EXPORT, app.pressed);
  const [a, b, c, d] = WIPES[i], opening = at < b, closing = at >= c;
  const edge = SCREEN.l + W * U * (opening ? progress(at, a, b) : closing ? progress(at, c, d) : 1);
  for (const pc of app) {
    if (pc.where === 'floor' || pc.where === 'travel') { P.push(pc); continue; }
    if (at <= a || at >= d) continue;
    pc.where = 'content';
    if (closing) pc.clip = [1, 0, 0, -edge];
    else if (opening) pc.clip = [-1, 0, 0, Math.min(edge, pc.clip?.[0] === -1 ? pc.clip[3] : Infinity)];
    else pc.clip ??= leftOf(W);
    P.push(pc);
  }
  return P;
}
export function frameAt(t, o = {}) { const { i, at } = sceneAt(t); return build(i, at, o); }
export const SCENES = SHOW.map((scene, i) => (o = {}) => frameAt(starts[i] + scene.still, o));
export const CRAFT = SHOW.map(scene => scene.craft);
