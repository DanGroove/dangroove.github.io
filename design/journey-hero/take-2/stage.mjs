// Second take, reworked to Dan's brief: one big floating screen. Each craft is a real app on it (drawn simply, with its logo) that
// builds a piece of work, and on Export the piece lands in front of the screen, lying flat in one tidy block.
// One clock builds every piece: the persistent shell, wiped content, travelling work and the floor.
import { HOME, EASE, dot as dot3, quatFromBasis, quatRotate } from '../../../public/journey/hero/engine.mjs';
import { box, cyl, turn, corners, qAxis, qMul } from './kit.mjs';
import { SPOT, subwayPath, BALL as COMP_BALL, BALL_FROM, BALL_VIA, ROWS, TYPE_EDGES, TYPE_BOXES, ART, ART_TEXT, HISTOGRAM, AM_MARKERS, AM_LABEL_BARS, CITY_BLOCKS, CITY_PINS } from './art.mjs';

// All authored durations, including the cursor's journeys, share this one control.
export const PACE = 1;

// the screen: its left and bottom edges, its size, the z of its middle, its thickness
export const SCREEN = { l: -2.6, b: 0.6, w: 5.6, h: 3.6, z: -1.8, t: 0.1 };
// An app is laid out in the screen's own units, U of the world's to each, from the screen's bottom left corner.
const U = 1.15, ZF = SCREEN.z + SCREEN.t / 2, W = SCREEN.w / U, H = SCREEN.h / U;
const BAR = 0.44, TOP = H - BAR - 0.1;                  // the bar along the top, and where an app's panels start under it

// a flat thing on the screen, placed by its left and bottom edges. lift: its gap from the screen's face.
export function on(tone, l, b, w, h, { lift = 0.02, t = 0.03, art, cut, round, more, overlay } = {}) {
  return { ...box(tone, [SCREEN.l + (l + w / 2) * U, SCREEN.b + (b + h / 2) * U, ZF + (lift + t / 2) * U], [w * U, h * U, t * U], { round, more }), art, cut, overlay };
}
// a flat picture on a panel: a plate of the panel's own tone, so that only the picture shows. (A cut-out would lose thin lines when it is drawn small.)
const icon = (art, l, b, w, h, tone = 'night', lift = 0.051) => on(tone, l, b, w, h, { lift, t: 0.004, art });
// a disc on the screen, by its middle
const dot = (tone, cx, cy, r, { lift = 0.05, t = 0.02, overlay } = {}) => ({ ...cyl(tone, [SCREEN.l + cx * U, SCREEN.b + cy * U, ZF + (lift + t / 2) * U], 'z', r * U, t * U), overlay });
// the outline of a selection: four thin red bars around a box on the screen
const outline = (l, b, w, h, { line = 0.016, lift = 0.085, tone = 'red' } = {}) => [[l, b, w, line], [l, b + h - line, w, line], [l, b, line, h], [l + w - line, b, line, h]].map(([x, y, bw, bh]) => on(tone, x, y, bw, bh, { lift, t: 0.006, overlay: true }));
const handle = (x, y) => on('red', x - 0.03, y - 0.03, 0.06, 0.06, { lift: 0.09, t: 0.01, art: 'anchor', overlay: true });   // one of a selection's points, by its middle
// a thin red bar from one point of the screen to another: a piece of a selected path, or the arm of a handle
function bar(a, b, { line = 0.018, lift = 0.085, tone = 'red' } = {}) {
  const pc = on(tone, a[0] - line / 2, a[1] - line / 2, Math.hypot(b[0] - a[0], b[1] - a[1]) + line, line, { lift, t: 0.006, overlay: true });
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

// CORRECTIONS-12 X1: every export group, and the light pool under it, sits this far along world x from the screen's middle
// (Dan's centring rule of round 2, then this one shift). One number: Dan may pick another from a comparison sheet.
export const EXPORT_SHIFT = -0.3;
const screenMiddle = SCREEN.l + SCREEN.w / 2, exportMiddle = screenMiddle + EXPORT_SHIFT;
// CORRECTIONS-15 S1, S2 (they replace round 13's drop and its backwards return): Export pops a red ball out of the button. It arcs
// to the floor, splits immediately into one red block per format (each the exact footprint and thickness of its format), holds, and a
// hard wipe turns each block into its format; when the scene's exports leave, they sink straight down through the floor. Each
// beat's length in seconds at PACE 1, as one table to tune: the pop, the arc, the rest, the split, the hold, each piece's wipe
// (become), the wipes' stagger left to right, Figma's laptop lid opening after its wipe, and the sink.
export const BALL = { pop: 0.3, arc: 0.8, rest: 0, split: 0.6, hold: 0.15, become: 0.6, stagger: 0.1, lid: 0.4, sink: 1.0 };
// World units: full diameter, starting radius, and the peak's height above the Export button's top side.
export const BALL_PATH = { size: 0.6, start: 0.1, rise: 0.6 };
// CORRECTIONS-12 D1: phones in true proportion to the tablets beside them. The reference bodies, in mm: a phone 71.6 x 147.6
// and a tablet 179.5 x 248.6. A phone is 147.6 / 248.6 of an upright tablet's height, 147.6 / 179.5 of one on its side.
export const BODY = { phone: [71.6, 147.6], tablet: [179.5, 248.6] };
const PHONE_SHAPE = BODY.phone[0] / BODY.phone[1];
export const PHONE_BESIDE = { upright: BODY.phone[1] / BODY.tablet[1], side: BODY.phone[1] / BODY.tablet[0] };
// a phone's rim that keeps its screen's picture at w : h inside a body of width bw and depth bd
const rimFor = (bw, bd, w, h) => (bw - bd * w / h) / (2 * (1 - w / h));
// ---- the floor. Everything exported lies flat on it, face up, squared to the screen, in one block: the mat.
// The mat's back left corner, its width (the row of screens across it, D1) and the gap between two screens on it.
const ROW = 1.8, SLIM_D = ROW * PHONE_BESIDE.side, SLIM = SLIM_D * PHONE_SHAPE, WIDE = 3.09;   // the row's depth, a phone's depth and width, the tablet's width
const MAT_W = WIDE + 2 * SLIM + 2 * 0.25;
export const MAT = { x: exportMiddle - MAT_W / 2, z: -1.4, w: MAT_W, gap: 0.25 };
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
// first: the page's first pass, where nothing came before Photoshop, so its shell starts as itself (round 6 entrance).
function shell(i, t, cursorAt, pressed, first = false) {
  const P = [], scene = SHOW[i], old = first ? scene : SHOW[(i + SHOW.length - 1) % SHOW.length];
  const change = t / PACE;
  P.push(box('dark', [SCREEN.l + SCREEN.w / 2, SCREEN.b + SCREEN.h / 2, SCREEN.z], [SCREEN.w, SCREEN.h, SCREEN.t]));
  P.push(on('night', 0, H - BAR, W, BAR, { lift: 0, t: 0.03 }));
  const p = first ? 0 : progress(change, 0.05, 0.5), angle = p * 180;
  const tile = on('ink', 0.07, H - BAR + 0.03, 0.38, 0.38, { lift: 0.04 + 0.2 * Math.sin(Math.PI * p), t: 0.07, art: APPS[old.app][0], more: { e: [0.1, 0.22] } });
  const back = { ...tile, p: tile.p.slice(), q: tile.q, art: APPS[scene.app][0], s: tile.s.slice() };
  back.s[2] = 0.002; back.p[2] = tile.p[2] - tile.s[2] - 0.001;
  turn(back, back.p, [0, 1, 0], 180);
  const pivot = tile.p.slice();
  turn(tile, pivot, [0, 1, 0], angle); turn(back, pivot, [0, 1, 0], angle);
  P.push(tile, back);
  const firstName = change < 0.275, nameProgress = firstName ? progress(change, 0.05, 0.275) : progress(change, 0.275, 0.5);
  const name = firstName ? icon(APPS[old.app][1], 0.56, H - BAR + 0.12, 1.14, 0.2, 'night', 0.031) : icon(APPS[scene.app][1], 0.56, H - BAR + 0.12, 1.14, 0.2, 'night', 0.031);
  const edge = SCREEN.l + (0.56 + 1.14 * nameProgress) * U;
  if (!first) name.clip = firstName ? [1, 0, 0, -edge] : [-1, 0, 0, edge];
  P.push(name);
  const before = PLATES[old.layout], after = PLATES[scene.layout], f = progress(change, 0, 0.5);
  for (const role of Object.keys(after)) {
    const rect = rectMix(before[role], after[role], f);
    if (rect[2] <= 0 || rect[3] <= 0) continue;
    P.push(on('night', ...rect, role === 'tools' ? { lift: 0.05, t: 0.04, more: { e: [0.1, 0.5] } } : {}));
  }
  const [a, b] = exportSpan(i), clicked = held(t, a, a + 0.05 * PACE), lift = 0.05 - (clicked ? 0.035 : 0), run = held(t, a, b);
  const button = BUTTON;
  if (run) {
    const e = linear(t, a, b), x = button[0], w = button[2];
    if (e > 0) P.push({ ...on('red', x, button[1], w * e, button[3], { lift, t: 0.06, art: 'export' }), window: [0, 0, e, 1] });
    if (e < 1) P.push({ ...on('ink', x + w * e, button[1], w * (1 - e), button[3], { lift, t: 0.06, art: 'export' }), window: [e, 0, 1, 1] });
  } else P.push(on('red', ...button, { lift, t: 0.06, art: 'export' }));
  const cw = 0.46, tip = [10 / 96, 6 / 96];
  P.push({ ...box('paper', [SCREEN.l + cursorAt[0] * U + cw * (0.5 - tip[0]), SCREEN.b + cursorAt[1] * U - cw * (0.5 - tip[1]), ZF + (pressed || clicked ? 0.12 : 0.22)], [cw, cw, 0.004]), art: 'cursor', cut: true, overlay: true });
  return P;
}
// the tools down the left of a design app, one of them lit
function rail(P, tools, lit) {
  const furniture = P.length;
  tools.forEach((art, i) => {
    const y = TOP - 0.34 - i * 0.36;
    if (i === lit) P.push(on('red', 0.11, y - 0.03, 0.3, 0.3, { lift: 0.05, t: 0.015 }));
    P.push(icon(art, 0.14, y, 0.24, 0.24, i === lit ? 'red' : 'night', i === lit ? 0.066 : 0.051));
  });
  for (const pc of P.slice(furniture)) pc.furniture = true;
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
// The gutter between two things in the block, and the two devices that share a page's width with it. D1: the phone is in true
// proportion to the upright tablet beside it, and the tablet widens to a real tablet's shape (179.5 : 248.6) within the width the
// phone frees. The gutters stay; the row behind (stack, phone, tablet) is centred in the block, so the block keeps its middle
// whether the copy lies on the stack or open in front. The phone's front edge lines up with the tablet's.
const GUT = 0.12, PHONE_D = DEEP * PHONE_BESIDE.upright, PHONE = PHONE_D * PHONE_SHAPE, TABLET = DEEP * BODY.tablet[0] / BODY.tablet[1];
const BACK = (2 * LEAF - (LEAF + PHONE + TABLET + 2 * GUT)) / 2;   // the width D1's smaller phone freed on each side of the row
// CORRECTIONS-13 I2: the row behind spans exactly the open copy's width, its outer edges on BLOCK.x0 and BLOCK.x1; the freed width
// goes equally into its two gutters (this supersedes D1's "keep the gaps" for this row only).
const ROW_GUT = GUT + BACK;
const SHEET = 0.01, COPY = 5 * SHEET, COPIES = 6;        // how thick one leaf is, and one closed copy (the four leaves that turn, and the rest); how many copies land
export const BLOCK = { x0: exportMiddle - LEAF, x1: exportMiddle + LEAF, z0: MAT.z, z1: MAT.z + 2 * DEEP + GUT, up: 0.6 };
// where the three things in the row behind lie: [x, z, w, d]
export const BLOCK_ROW = { stack: [BLOCK.x0, BLOCK.z0, LEAF, DEEP], phone: [BLOCK.x0 + LEAF + ROW_GUT, BLOCK.z0 + DEEP - PHONE_D, PHONE, PHONE_D], tablet: [BLOCK.x0 + LEAF + 2 * ROW_GUT + PHONE, BLOCK.z0, TABLET, DEEP], gutter: ROW_GUT, phoneRim: rimFor(PHONE, PHONE_D, 300, 664) };
export const POOL = { x: exportMiddle, z: MAT.z + DEEP };

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
  const [sx, z] = BLOCK_ROW.stack, n = COPIES - 1, phone = BLOCK_ROW.phone, tablet = BLOCK_ROW.tablet;
  for (let i = 0; i < n; i++) closed(P, sx, z, i * COPY, i === n - 1 ? 'kCover' : undefined);                  // the stack, less the copy that was taken
  // D1: the phone's rim keeps the post's 300 x 664 screen; the tablet's screen is the mail art's own shape (see art.mjs).
  P.push(...device(...phone, 'post', { rim: BLOCK_ROW.phoneRim }), ...device(...tablet, 'mail', { rim: 0.05, round: 0.1 }));
  copy(P, BLOCK.x0, z + DEEP + GUT, [sx, n * COPY, z], at);
}

const FLYER = { gold: ['#9B7C29', '#86691F', '#5E4915'], lite: ['#CEAB48', '#B3933B', '#836A28'], coal: ['#282928', '#1F201F', '#161716'], black: ['#0A0F16', '#080C12', '#05080C'] };   // the flyer's colours, lit, on top and in shade
// The approved finished document, shared by its constructed destination and its reading still.
function approvedDocument() {
  const P = [], tw = 0.36, th = tw * 340 / 440, mid = PANEL + 0.425;
  rail(P, ['tArrow', 'tType', 'tFrame', 'tRect', 'tLine', 'tDrop'], 0);
  P.push({ ...on('night', PANEL, 0.1, 0.85, TOP - 0.1), furniture: true });
  [[null, 'kCover'], ['kOfferL', 'kOfferR'], ['kLocL', 'kLocR'], ['kAmL', 'kAmR'], ['kGalL', 'kGalR'], ['kBack', null]].forEach(([l, r], i) => {
    const echoStart = P.length, y = TOP - 0.13 - (i + 1) * th - i * 0.1;
    if (i === 3) P.push(on('red', mid - tw - 0.03, y - 0.03, tw * 2 + 0.06, th + 0.06, { lift: 0.05, t: 0.01 }));
    if (l) P.push(on('ink', mid - tw, y, tw, th, { lift: 0.065, t: 0.008, art: l }));
    if (r) P.push(on('ink', mid, y, tw, th, { lift: 0.065, t: 0.008, art: r }));
    tagEcho(P, ['coverTitle', 'pages', 'loc', 'spreadType', 'pages', 'pages'][i], echoStart);
  });
  P.push({ ...on('ink', ...ID.left, { lift: 0.06, t: 0.02, art: 'kAmL' }), tones: FLYER.coal, page: 'map' }, { ...on('ink', ...ID.right, { lift: 0.06, t: 0.02, art: 'kAmR' }), tones: FLYER.coal, page: 'map' });
  finishedSpreadLayers(P);
  P.push(on('ink', ...ID.cover, { lift: 0.06, t: 0.02, art: 'kCover' }), on('ink', ...ID.post, { lift: 0.06, t: 0.02, art: 'kPost' }), on('ink', ...ID.mail, { lift: 0.06, t: 0.02, art: 'eblast' }));
  // Keep the typed cut-outs in their own slots; a finished page must not collapse overlapping lines of type backward.
  mapTyping(P, ID.mail, 'eblast', 1, part => part.words !== 'View the flyer');
  // CORRECTIONS-15 N1: the placed amenities map has no selection outline or handles.
  return P;
}
function spreadPatches(P, n = 6) {
  const first = P.length;
  const patches = [[ID.left, 'kAmL', [0, 0, 0.2, 0.12]], [ID.right, 'kAmR', [0.84, 0, 0.16, 0.12]], [ID.left, 'kAmL', [0, 0.92, 0.1, 0.08]], [ID.right, 'kAmR', [0.9, 0.92, 0.1, 0.08]]];
  patches.forEach(([r, art, region], i) => { if (n >= i) pictureRegion(P, r, art, region); });
  // These finished-page pixels must keep their slot when the placed map below is replaced by the finished page.
  for (const pc of P.slice(first)) Object.defineProperty(pc, 'depthSlot', { value: 2 });
}
function finishedSpreadLayers(P) {
  // F1/G: retain the finished page's own region pixels, never a second rasterisation of its map.
  const first = P.length;
  spreadPatches(P);
  for (const pc of P.slice(first)) registerPicture(pc, 0.080);
}
// ---- The screens the other crafts export to. They lie in one row across the mat: a tablet on its side, then two phones.
// (ROW, SLIM, SLIM_D and WIDE are set with the mat above. D1: the tablet keeps its 3.09 x 1.8; each phone is in true proportion to
// it, its front edge on the tablet's. A phone's 300 x 600 picture keeps its shape, centred along the phone's taller screen.)
const SLIM_RIM = 0.04, SLIM_SCREEN = (() => { const w = SLIM - 2 * SLIM_RIM, d = w * 600 / 300; return [SLIM_RIM, (SLIM_D - d) / 2, w, d]; })();
// ---- 03 Motion: After Effects has animated words and shapes, the way a SaaS promo moves, and exported it to the same three screens
// each layer: its icon, its label's tone, how long its name is, when its bar starts and how long it is, and where its keyframes are
export const LAYERS = [
  ['tT', 'red', 0.5, 0, 3.2, [0.1, 0.6]], ['tT', 'red', 0.36, 0.2, 3, [0.35, 0.85]], ['lStar', 'paper', 0.28, 0.6, 2.6, [0.75, 1.45]],
  ['lStar', 'grey', 0.44, 1, 2.2, [1.2, 1.7]], ['lStar', 'grey', 0.44, 1.15, 2.05, [1.35, 1.85]], ['lStar', 'grey', 0.44, 1.3, 1.9, [1.5, 2]],
];
// ---- 04 UX/UI: Figma, with this page's own hero in it: its wireframes above and its designs below, on a desktop and on a phone in
// two states. A prototype link runs from the second craft in the phone's list to the state it leads to. Exported to the same screens.
// each layer in the list: its icon, how far it is set in, and how long its name is
const TREE = [['lFrame', 0, 0.34], ['lFrame', 0, 0.34], ['tT', 1, 0.2], ['tV', 1, 0.26], ['tV', 2, 0.18], ['tV', 2, 0.14], ['tV', 1, 0.2], ['lFrame', 0, 0.3], ['lFrame', 0, 0.36], ['lFrame', 0, 0.36]];
// ---- The clock and the shared choreography. All times are local to the current scene.
const linear = (t, a, b) => clamp((t - a) / (b - a), 0, 1);
const progress = (t, a, b) => EASE.wipe(linear(t, a, b));
// CORRECTIONS-7 K1: the hand's one easing. Minimum jerk: no overshoot, top speed 1.875 times its average
// (EASE.wipe's is 3.8). It moves the cursor and everything the cursor carries; nothing else uses it.
// Clamped only against rounding: the polynomial reaches 1 + 2e-15 just before x = 1.
export const HAND = x => Math.min(1, Math.max(0, x * x * x * (10 + x * (6 * x - 15))));
export const HAND_KINDS = ['drag', 'draw', 'slide', 'stroke', 'run'];
const held = (t, a, b) => t >= a && t < b;
const rectMix = (a, b, p) => a.map((v, i) => mix(v, b[i], p));
const centre = r => [r[0] + r[2] / 2, r[1] + r[3] / 2];
const EXPORT = [W - 0.42, H - 0.26];
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
const quadratic = (a, b, c, t) => [0, 1].map(i => (1 - t) ** 2 * a[i] + 2 * (1 - t) * t * b[i] + t * t * c[i]);
const cubic = (a, b, c, d, t) => [0, 1].map(i => (1 - t) ** 3 * a[i] + 3 * (1 - t) ** 2 * t * b[i] + 3 * (1 - t) * t * t * c[i] + t ** 3 * d[i]);
const leftOf = x => [-1, 0, 0, SCREEN.l + x * U];
function chip(P, key) {
  const [x, y, w, h] = DOCK[key];
  P.push({ ...on('grey', x - 0.012, y - 0.012, w + 0.024, h + 0.024, { lift: 0.04, t: 0.012 }), where: 'travel' }, { ...on('ink', x, y, w, h, { lift: 0.055, t: 0.02, art: PICTURES[key] }), where: 'travel' });
}
// CORRECTIONS-15 N2: a carried picture keeps one height above the screen's face from pickup to drop, its placed height, and moves
// on a straight line; where it passes over taller content it is raised only along the view (clearCarried).
function travel(P, key, from, to, t, a, b, endWindow = [0, 0, 1, 1], curve = EASE.wipe, id = from === DOCK[key] ? key : key === 'photo' ? 'export' : key + 'Export') {
  const p = curve(linear(t, a, b)), rect = rectMix(from, to, p), dockStart = from === DOCK[key], lift = dockStart ? (key === 'loc' ? 0.053 : 0.06) : 0.055, [x, y, w, h] = rect;
  // The picture is the same piece throughout. The dock's rim folds down as it leaves, or grows as it lands.
  const rim = 0.012 * (dockStart ? 1 - p : p);
  if (rim > 0) P.push({ ...on('grey', x - rim, y - rim, w + 2 * rim, h + 2 * rim, { lift: lift - 0.015, t: 0.012 }), where: 'travel', action: id });
  P.push({ ...on('ink', ...rect, { lift, t: 0.02, art: PICTURES[key] }), window: rectMix([0, 0, 1, 1], endWindow, p), where: 'travel', action: id });
}
// ---- CORRECTIONS-15 S1, S2: the ball. Times are local to the scene; beats are seconds after Export, at PACE 1. Every scene that
// exports to the floor has three pieces, numbered left to right in world x (j); piece j's wipe starts BALL.stagger after piece
// j - 1's. Figma's laptop (j 0) opens its lid over BALL.lid once its wipe has ended, and its "become" ends there.
export function ballBeats(key, j) {
  const pop = BALL.pop, arc = pop + BALL.arc, rest = arc + BALL.rest, split = rest + BALL.split, hold = split + BALL.hold;
  const wipe = hold + j * BALL.stagger, wiped = wipe + BALL.become;
  return { start: 0, pop, arc, rest, split, hold, wipe, wiped, become: key === 'fig' && j === 0 ? wiped + BALL.lid : wiped };
}
export const ballLength = key => Math.max(...[0, 1, 2].map(j => ballBeats(key, j).become));
// The Export button and the launch centre: just inside its top side, already clear of its face.
const BUTTON = [W - 0.98, H - BAR + 0.08, 0.86, 0.28], BUTTON_FACE = ZF + (0.05 + 0.06) * U;
export const EXPORT_BUTTON = { rect: [SCREEN.l + BUTTON[0] * U, SCREEN.b + BUTTON[1] * U, SCREEN.l + (BUTTON[0] + BUTTON[2]) * U, SCREEN.b + (BUTTON[1] + BUTTON[3]) * U], face: BUTTON_FACE };
export const BALL_START = [SCREEN.l + (BUTTON[0] + BUTTON[2] / 2) * U, EXPORT_BUTTON.rect[3] - BALL_PATH.start, BUTTON_FACE + BALL_PATH.start + 0.001];
// The ball u seconds after Export: one ballistic centre path throughout pop + arc, linear x/z, constant gravity. Only its
// radius grows during pop. Until its bottom clears the button's top side, that horizontal plane clips its colour and shadow.
export function ballAt(u, to) {
  const R = BALL_PATH.size / 2, c0 = BALL_START, end = [to[0], R, to[1]], T = BALL.pop + BALL.arc, s = clamp(u, 0, T);
  // One launch, including emergence: solve gravity from the peak and touchdown. Nothing restarts at pop's end.
  const h = EXPORT_BUTTON.rect[3] + BALL_PATH.rise - c0[1], fall = c0[1] - R;
  const root = (Math.sqrt(2 * h) + Math.sqrt(2 * (h + fall))) / T, gravity = root * root, vy = root * Math.sqrt(2 * h);
  const c = [mix(c0[0], end[0], s / T), c0[1] + vy * s - gravity * s * s / 2, mix(c0[2], end[2], s / T)];
  const r = mix(BALL_PATH.start, R, clamp(s / BALL.pop, 0, 1));
  return { c: s === T ? end : c, r, ...(s < BALL.pop && c[1] - r < EXPORT_BUTTON.rect[3] ? { clip: [0, 1, 0, -EXPORT_BUTTON.rect[3]] } : {}) };
}
// A red piece lying on the floor the way every export lies (local x along world x, local y toward the back, local z up), so the
// ball has its shapes' rotation from the start and nothing has to turn later. solid: a volume, kept out of the faces' separation.
const LYING = qAxis([1, 0, 0], -90);
const redPiece = (c, s, e, morph, part) => ({ tone: 'red', p: c, q: LYING.slice(), s, e, taper: [0, 0], shear: 0, where: 'floor', solid: true, morph, part });
// A lying piece's block: [x, z, w, d, top, e].
const lyingShape = pc => [pc.p[0] - pc.s[0], pc.p[2] - pc.s[1], 2 * pc.s[0], 2 * pc.s[1], pc.p[1] + pc.s[2], pc.e.slice()];
// Figma's laptop lid at lean theta (degrees: -90 shut on the deck, 12 open): its box and its screen's pictures turn together about
// the hinge. Keys and trackpad are left out while it is forward of upright. A picture is left out while its face is turned away from the
// view: the lid's own box is in front of it then.
function poseLid({ pieces, pivot, details = [] }, theta) {
  const by = 12 - theta, lift = 0;
  if (by) turn(pieces, pivot, [1, 0, 0], by);
  for (const pc of pieces) { pc.p[1] += lift; if (pc.lidPicture) pc.hide = dot3(quatRotate(pc.q, [0, 0, 1]), HOME.v) <= 0; }
  for (const pc of details) pc.hide = theta < 0;
}
// The export of one scene. formats: its three pieces left to right, each { pieces: built in their final landed pose (as round 13
// left them), shape: their block [x, z, w, d, thickness, e], lid?: Figma's laptop lid, posed shut until its wipe has ended }.
function exportOut(P, s, t, key, formats) {
  const a = action(s, 'export').start, { off } = playbackSpans(s);
  if (t < a || t >= off[1]) return;
  const u = (t - a) / PACE, all = formats.flatMap(f => f.pieces);
  for (const pc of all) pc.where = 'floor';
  if (u >= ballLength(key)) {
    // Close fully before sinking. The other two devices keep the cycle's last frame.
    for (const f of formats) if (f.lid) poseLid(f.lid, mix(12, -90, EASE.wipe(linear(t, off[0] - BALL.lid * PACE, off[0]))));
    if (t >= off[0]) {
      separateFaces(all.filter(pc => !pc.hide));
      // S2: everything sinks together, straight down (x and z fixed), cut by the floor's plane in every pass, until nothing is left.
      const g = EASE.wipe(linear(t, off[0], off[1]));
      const heights = formats.map(f => Math.max(...f.pieces.filter(pc => !pc.hide).flatMap(corners).map(c => c[1])));
      // A fixed 0.02 on unequal heights hides the thin devices earlier. Scale the clearance too, so all tops cross y=0 together.
      const clearance = 1 + 0.02 / Math.max(...heights);
      for (const [j, f] of formats.entries()) {
        const depth = heights[j] * clearance;
        for (const pc of f.pieces) { pc.p[1] -= depth * g; pc.clip = [0, 1, 0, 0]; pc.sink = true; }
      }
    }
    P.push(...all.filter(pc => !pc.hide)); return;
  }
  // The ball comes to rest at the middle of the three blocks' combined footprint.
  const blocks = formats.map(f => f.shape), to = [(Math.min(...blocks.map(r => r[0])) + Math.max(...blocks.map(r => r[0] + r[2]))) / 2, (Math.min(...blocks.map(r => r[1])) + Math.max(...blocks.map(r => r[1] + r[3]))) / 2];
  if (u < ballBeats(key, 0).rest) {
    const { c, r, clip } = ballAt(u, to), ball = redPiece(c, [r, r, r], [1, 1], 'ball');
    if (clip) ball.clip = clip;
    P.push(ball); return;
  }
  const R = BALL_PATH.size / 2;
  formats.forEach((f, j) => {
    const b = ballBeats(key, j), [x, z, w, d, h, e] = f.shape;
    if (u < b.split) {
      // Split: from three exact copies of the resting ball, each moves along the floor to its place while it becomes its block.
      const k = EASE.enter(linear(u, b.rest, b.split)), size = [mix(R, w / 2, k), mix(R, d / 2, k), mix(R, h / 2, k)];
      P.push(redPiece([mix(to[0], x + w / 2, k), size[2], mix(to[1], z + d / 2, k)], size, [mix(1, e[0], k), mix(1, e[1], k)], 'split', j));
      return;
    }
    const block = () => redPiece([x + w / 2, h / 2, z + d / 2], [w / 2, d / 2, h / 2], e.slice(), 'shape', j);
    if (u < b.wipe) { P.push(block()); return; }
    if (f.lid) poseLid(f.lid, u < b.wiped ? -90 : mix(-90, 12, EASE.wipe(linear(u, b.wiped, b.become))));
    if (u < b.wiped) {
      // Become: one hard wipe left to right in world x. Behind its edge the format, ahead of it the block: one plane, two signs.
      const edge = mix(x, x + w, EASE.wipe(linear(u, b.wipe, b.wiped))), red = block();
      red.clip = [1, 0, 0, -edge]; red.edge = edge; P.push(red);
      for (const pc of f.pieces) if (!pc.hide) { pc.clip = [-1, 0, 0, edge]; pc.edge = edge; pc.wiped = j; P.push(pc); }
      return;
    }
    for (const pc of f.pieces) if (!pc.hide) P.push(pc);
  });
}
// Video and motion: the ball becomes the tablet on its side and the two phones. Their plays start once every piece is built, in
// step with the viewer.
function screensOut(P, t, s, art) {
  const key = s === SCRIPTS.pr ? 'pr' : 'ae', a = action(s, 'export').start, { land, off } = playbackSpans(s);
  if (t < a || t >= off[1]) return;
  const kind = art[0] === 'playerWide' ? 'video' : 'motion';
  const clock = playClock(t, land, off[0], key), widths = [WIDE, SLIM, SLIM];
  let left = MAT.x;
  const formats = widths.map((w, i) => {
    const face = [], rim = i ? SLIM_RIM : 0.075, d = i ? SLIM_D : ROW, z = MAT.z + ROW - d;
    const slab = { ...device(left, z, w, d, undefined, { rim, round: i ? 0.16 : 0.09 })[0], deviceBody: true };
    const F = i ? [left + SLIM_SCREEN[0], z + SLIM_SCREEN[1], SLIM_SCREEN[2], SLIM_SCREEN[3]] : [left + rim, z + rim, w - 2 * rim, d - 2 * rim];
    playback(face, floorPainter(face, F), kind, i, clock);
    for (const pc of [slab, ...face]) { pc.clock = clock; pc.device = i; }
    left += w + MAT.gap;
    return { pieces: [slab, ...face], shape: lyingShape(slab) };
  });
  exportOut(P, s, t, key, formats);
  P.clock = clock;
}

// The laptop hinge runs in x along the back edge; its unmirrored screen faces +z.
const LID_ANGLE = 12 * Math.PI / 180;
const lidU = [1, 0, 0], lidV = [0, Math.cos(LID_ANGLE), -Math.sin(LID_ANGLE)], lidN = [0, Math.sin(LID_ANGLE), Math.cos(LID_ANGLE)];
export const UI_ROW = (() => {
  // D1: the phone is in true proportion to the upright tablet (1.8 deep), its front edge on the tablet's, and its rim keeps the
  // 9 : 19.5 screen the prototype's phone pictures are drawn for.
  // CORRECTIONS-13 U1: the tablet is as deep as the laptop's deck, its back and front edges on the deck's, its 3 : 4 screen and rim
  // kept; the phone (D1's rule against this tablet) shares that front edge. tabZ, phoneZ: their back edges from MAT.z.
  const depth = 1.65, lidW = 1.55, lidH = 1.1, deck = 1.1, rim = 0.06, tabD = deck, tabW = (tabD - rim * 2) * 3 / 4 + rim * 2, gap = 0.3;
  const lean = lidH * Math.sin(LID_ANGLE) + 0.02, tabZ = lean;
  const phoneD = tabD * PHONE_BESIDE.upright, phoneW = phoneD * PHONE_SHAPE, phoneRim = rimFor(phoneW, phoneD, 9, 19.5), phoneZ = tabZ + tabD - phoneD;
  const width = lidW + tabW + phoneW + 2 * gap, left = exportMiddle - width / 2;
  return { depth, lidW, lidH, screenH: (lidW - 0.08) / 1.6, deck, rim, tabD, tabZ, tabW, phoneW, phoneD, phoneRim, phoneZ, gap, left, lean, forward: 0.46, hinge: left, tablet: left + lidW + gap, phone: left + lidW + gap + tabW + gap };
})();
const lidHinge = () => [UI_ROW.hinge, 0.08, MAT.z + UI_ROW.lean];
function lidPoint(u, v, lift = 0) {
  // The lower edge of the lid's front surface meets the deck's back top edge. Its centre plane is half a lid behind it.
  return lidHinge().map((n, i) => n + lidU[i] * u + lidV[i] * v + lidN[i] * (lift - 0.02));
}
function lidPainter(P) {
  let height = 0.026;
  const g = UI_ROW, w = g.lidW - 0.08, h = g.screenH, chin = g.lidH - h - 0.04;
  const draw = (tone, r, art, window) => {
    height += LAYER_STEP;
    // The screen's own face is fixed; page layers below it may change their count.
    if (art === 'chromeLaptop') height = 0.04;
    const pc = { ...box(tone, lidPoint(0.04 + (r[0] + r[2] / 2) * w, chin + (1 - r[1] - r[3] / 2) * h, height), [r[2] * w, r[3] * h, 0.001]), q: quatFromBasis(lidU, lidV), art, window, lidPicture: true };
    P.push(pc); return pc;
  };
  draw.size = [w, h]; return draw;
}
// UX/UI: the ball becomes the laptop (closed: the deck with the lid shut on it), the tablet and the phone. The laptop's lid opens
// to its 12 degree lean once its wipe has ended (CORRECTIONS-15: it no longer slides in from the top left). The shared cycle
// starts once the lid is open; Figma's three frames stay on the canvas throughout.
function prototypeOut(P, t, s) {
  const a = action(s, 'export').start, g = UI_ROW, { land, off } = playbackSpans(s);
  if (t < a || t >= off[1]) return;
  const clock = Math.max(0, (Math.min(t, land + 3 * PACE) - land) / PACE) / 3, shown = t < land ? -1 : clock;
  const formats = [0, 1, 2].map(i => {
    const kind = ['laptop', 'tablet', 'phone'][i], body = [], face = [];
    if (i === 0) {
      body.push({ ...flat('ink', g.hinge, MAT.z + g.lean, g.lidW, g.deck, 0.08), deviceBody: true });
      body.push(flat('night', g.hinge + 0.065, MAT.z + g.lean + 0.12, 1.42, 0.62, 0.008, undefined, 0.081), flat('dark', g.hinge + 0.5, MAT.z + g.lean + 0.85, 0.55, 0.18, 0.008, undefined, 0.081));
      for (let row = 0; row < 5; row++) for (let key = 0; key < 9; key++) body.push(flat('dark', g.hinge + 0.09 + key * 0.151, MAT.z + g.lean + 0.14 + row * 0.115, 0.115, 0.082, 0.005, undefined, 0.091));
      body.push({ ...box('ink', lidPoint(g.lidW / 2, g.lidH / 2), [g.lidW, g.lidH, 0.04]), q: quatFromBasis(lidU, lidV), lid: true });
      prototype(lidPainter(face), 0, shown);
    } else {
      const x = i === 1 ? g.tablet : g.phone, w = i === 1 ? g.tabW : g.phoneW, d = i === 1 ? g.tabD : g.phoneD, z = MAT.z + (i === 1 ? g.tabZ : g.phoneZ), rim = i === 1 ? g.rim : g.phoneRim;
      body.push({ ...device(x, z, w, d, undefined, { rim, round: 0.03 })[0], deviceBody: true });
      prototype(floorPainter(face, [x + rim, z + rim, w - 2 * rim, d - 2 * rim]), i, shown);
    }
    // R17: the taller lid needs 0.06 beyond H10's 0.4 shift to keep the approved 12 px app clearance.
    for (const pc of [...body, ...face]) { pc.p[2] += g.forward; pc.device = i; pc.deviceKind = kind; pc.clock = clock; }
    if (i) return { pieces: [...body, ...face], shape: lyingShape(body[0]) };
    // The closed laptop's block: the deck's footprint, up to the top of the lid lying shut on it (see poseLid), sharp like the deck.
    const pivot = lidHinge().map((n, k) => n + (k === 2 ? g.forward : 0));
    return { pieces: [...body, ...face], shape: [g.hinge, MAT.z + g.lean + g.forward, g.lidW, g.deck, pivot[1] + 0.04, body[0].e.slice()], lid: { pieces: [body.at(-1), ...face], details: body.slice(1, -1), pivot } };
  });
  exportOut(P, s, t, 'fig', formats);
  P.clock = clock;
}

// A painter maps the same finished piece either onto a viewer or onto a device lying flat.
// Cropping changes both the rectangle and its picture window; it never stretches a reveal.
// Each viewer/device owns its depth stack. Counts only record drawing order across painters; they never set a face's height.
const LAYER_STEP = 0.0008;
let stacks;
function screenPainter(P, rect, faceLift = 0.08, thickness = 0.004) {
  let height = -Infinity;
  const draw = (tone, r, art, window, lift = faceLift) => {
    const face = height = Math.max(lift + thickness, height + LAYER_STEP);
    lift = face - thickness;
    const [x, y, w, h] = rect, pc = on(tone, x + r[0] * w, y + (1 - r[1] - r[3]) * h, r[2] * w, r[3] * h, { lift, t: thickness, art });
    pc.paintLayer = stacks.screenCount++;
    Object.defineProperty(pc, 'paintStack', { value: draw });
    if (window) pc.window = window;
    P.push(pc); return pc;
  };
  draw.size = [rect[2] * U, rect[3] * U];
  return draw;
}
function floorPainter(P, rect) {
  let height = 0.09 - LAYER_STEP;
  const draw = (tone, r, art, window) => {
    // Reserve the face above this device's maximum six content layers. Chrome cannot ride the changing content count.
    const face = height = art?.startsWith('chrome') ? 0.09 + 8 * LAYER_STEP : height + LAYER_STEP;
    const [x, z, w, d] = rect, pc = flat(tone, x + r[0] * w, z + r[1] * d, r[2] * w, r[3] * d, 0.002, art, face - 0.002);
    pc.paintLayer = stacks.floorCount++;
    Object.defineProperty(pc, 'paintStack', { value: draw });
    if (window) pc.window = window;
    P.push(pc); return pc;
  };
  draw.size = [rect[2], rect[3]];
  return draw;
}
function cropPicture(draw, tone, rect, art, p, direction = 'right') {
  p = clamp(p, 0, 1);
  if (p <= 0) return;
  const [x, y, w, h] = rect;
  if (direction === 'up') return draw(tone, [x, y + h * (1 - p), w, h * p], art, art ? [0, 1 - p, 1, 1] : undefined);
  return draw(tone, [x, y, w * p, h], art, art ? [0, 0, p, 1] : undefined);
}
function replayPainter(paint) {
  const draw = (...args) => { const pc = paint(...args); pc.playback = true; return pc; };
  draw.size = paint.size; return draw;
}
function echoPainter(paint, id) {
  const draw = (...args) => { const pc = paint(...args); pc.echo = id; return pc; };
  draw.size = paint.size; return draw;
}
function tagEcho(P, id, first) { for (const pc of P.slice(first)) pc.echo = id; }
function movie(draw, shape, p) {
  draw = replayPainter(draw);
  const at = p * 3.9, suffix = ['', 'Tall', 'Sq'][shape];
  const frame = shape === 2 ? [0, 112 / 600, 1, 0.5] : [0, 0, 1, 1];
  draw('ink', frame, (at < 1.46 ? 'shotA' : at < 2.7 ? 'shotB' : 'shotCfx') + suffix);
  if (at >= 1.14 && at < 1.46) cropPicture(draw, 'ink', frame, 'shotB' + suffix, EASE.wipe((at - 1.14) / 0.32));
  const cap = CAPTIONS.findIndex(([x, w]) => at >= x && at < x + w);
  if (cap >= 0) {
    const rect = shape === 0 ? [0.3167, 0.715, 0.3666, 0.137] : shape === 1 ? [0.12, 0.70, 0.76, 0.09] : [0.17, 0.54, 0.66, 0.064];
    draw('paper', rect, ['cap1', 'cap2', 'cap3', 'cap1', 'cap2'][cap]);
  }
}
function animatedComp(draw, shape, p) {
  draw = replayPainter(draw);
  const o = shape === 0 || shape === 3 ? { w: 480, h: 270, x: 34, y: shape === 3 ? 116 : 104, px: 60, rows: [296, 62, 140, 3] } : shape === 1 ? { w: 300, h: 600, x: 26, y: 236, px: 62, rows: [26, 366, 180, 3] } : { w: 300, h: 600, x: 20, y: 276, px: 50, rows: [146, 364, 120, 2] };
  const { w, h, x, y, px, rows: [rx, ry, rw, n] } = o, k = px / 60, at = p * 2.4;
  draw('paper', shape === 2 ? [0, 184 / 600, 1, 0.5] : [0, 0, 1, 1], 'paperTile');
  const norm = r => [r[0] / w, r[1] / h, r[2] / w, r[3] / h];
  cropPicture(draw, 'paper', norm([x - 6 * k, y - 54 * k, 232 * k, 62 * k]), 'wMake', EASE.wipe(linear(at, ...LAYERS[0][5])));
  cropPicture(draw, 'paper', norm([x - 6 * k, y + px * 1.07 - 44.2 * k, 168 * k, 52 * k]), 'wMove', EASE.wipe(linear(at, ...LAYERS[1][5])));
  const end = [x + (2.462 + 0.2) * px, y + px * 0.92], from = [end[0] + px * 0.9, y - px * 1.3], via = [end[0] + px, end[1] - px * 0.3];
  if (at >= LAYERS[2][5][0]) {
    const pos = quadratic(from, via, end, EASE.wipe(linear(at, ...LAYERS[2][5]))), r = px * 0.15;
    draw('paper', norm([pos[0] - r, pos[1] - r, r * 2, r * 2]), 'redBall');
  }
  for (let i = 0; i < n; i++) {
    const f = EASE.enter(linear(at, ...LAYERS[i + 3][5]));
    if (f <= 0) continue;
    const parked = 1 - EASE.enter(linear(1.6, ...LAYERS[i + 3][5]));
    const l = rx + [0, 0.09, 0.24][i] * rw - parked * 0.75 * rw + (1 - f) * 0.75 * rw;
    const visible = clamp((w - l) / rw, 0, 1);
    if (visible > 0) draw('paper', norm([l, ry + i * rw * 0.27 * 1.3, rw * visible, rw * 0.27]), i ? 'rowB' : 'rowA', [0, 0, visible, 1]);
  }
}
// One tall page is viewed through a moving window. Intersection changes both geometry and UVs.
export function prototypeState(p) {
  if (p < 0) return { at: 0, scroll: 0, video: 0, lifted: false, tap: null };
  const at = p >= 1 ? 3 : ((p * 3) % 3 + 3) % 3;
  const scroll = at < 0.4 ? 0 : at < 1 ? 0.4 * EASE.wipe(linear(at, 0.4, 1)) : at < 1.55 ? 0.4 : at < 2.15 ? 0.4 * (1 - EASE.wipe(linear(at, 1.55, 2.15))) : 0;
  return { at, scroll, video: at < 0.15 ? 0 : at < 0.3 ? EASE.wipe(linear(at, 0.15, 0.3)) : at < 2.3 ? 1 : at < 2.45 ? 1 - EASE.wipe(linear(at, 2.3, 2.45)) : 0, lifted: at >= 1.25 && at < 1.55, tap: at < 0.15 ? 'video' : at >= 1.25 && at < 1.4 ? 'card' : at >= 2.15 && at < 2.3 ? 'graphic' : null };
}
function pageWindow(draw, viewport, rect, art, uv = [0, 0, 1, 1], options = {}) {
  const x = Math.max(rect[0], viewport[0]), y = Math.max(rect[1], viewport[1]), right = Math.min(rect[0] + rect[2], viewport[0] + viewport[2]), bottom = Math.min(rect[1] + rect[3], viewport[1] + viewport[3]);
  if (right <= x || bottom <= y) return;
  const window = [uv[0] + (x - rect[0]) / rect[2] * (uv[2] - uv[0]), uv[1] + (y - rect[1]) / rect[3] * (uv[3] - uv[1]), uv[0] + (right - rect[0]) / rect[2] * (uv[2] - uv[0]), uv[1] + (bottom - rect[1]) / rect[3] * (uv[3] - uv[1])];
  return Object.assign(draw('ink', [x, y, right - x, bottom - y], art, window.map(n => clamp(n, 0, 1))), options);
}
function prototype(draw, shape, p, chrome = true) {
  draw = replayPainter(draw);
  const state = prototypeState(p), suffix = ['Wide', 'Tablet', 'Tall'][shape];
  const viewport = chrome ? shape === 0 ? [0, 0.08, 1, 0.92] : [0, 0.055, 1, 0.91] : [0, 0, 1, 1];
  const [x, y, w, h] = viewport, page = [x, y - state.scroll * h, w, 1.4];
  pageWindow(draw, viewport, page, 'uiPage' + suffix + '0');
  if (state.video > 0) {
    const rect = [page[0], page[1], page[2] * state.video, page[3]];
    pageWindow(draw, viewport, rect, 'uiPage' + suffix + '1', [0, 0, state.video, 1]);
  }
  for (let i = 0; i < 3; i++) pageWindow(draw, viewport, [x + (0.045 + i * 0.31) * w, y + 1.035 - state.scroll * h - (i === 0 && state.lifted ? 0.04 : 0), 0.285 * w, 0.30], 'uiWork' + suffix + i);
  if (state.tap) {
    const pageW = shape ? 180 : 480, pageH = [300, 240, 390][shape], m = Math.min(pageW / 390, pageH / 664);
    const craft = shape === 0 ? [0.16, state.tap === 'video' ? 0.675 : 0.636] : [(state.tap === 'video' ? 253.5 : 103) * m / pageW, 1 - 109 * m / pageH];
    const point = state.tap === 'card' ? [0.18, 1.12 - state.scroll * h] : [craft[0], craft[1] - state.scroll * h];
    const [dw, dh] = draw.size, tw = 0.05 / dw, th = 0.05 / dh;
    pageWindow(draw, viewport, [x + point[0] * w - tw / 2, y + point[1] - th / 2, tw, th], 'tapDot', [0, 0, 1, 1], { cut: true, overlay: true });
  }
  if (chrome) { const pc = draw('ink', [0, 0, 1, 1], ['chromeLaptop', 'chromeTablet', 'chromeHandset'][shape]); pc.cut = true; }
  // Keep the prototype's existing progress rail, also on the three app-canvas viewports.
  draw('grey', [x, y + h - 0.006, w, 0.006]).progressRail = true; draw('paper', [x, y + h - 0.006, w * Math.max(0, p), 0.006]).progressRail = true;
}
function playback(P, draw, kind, shape, p) {
  if (kind === 'video') movie(draw, shape, p);
  else animatedComp(draw, shape, p);
  const chrome = { video: ['chromePlayer', 'chromeReel', 'chromeFeed'], motion: ['chromeMotion', 'chromeStory', 'chromeMotionFeed'] }[kind][shape];
  const pc = draw('ink', [0, 0, 1, 1], chrome); pc.cut = true;
  const line = !shape ? [54 / 480, 243 / 270, 400 / 480, 5 / 270] : kind === 'video' ? (shape === 1 ? [20 / 300, 50 / 600, 260 / 300, 4 / 600] : [0, 404 / 600, 1, 8 / 600]) : shape === 1 ? [20 / 300, 50 / 600, 84 / 300, 4 / 600] : [0, 484 / 600, 1, 0.006];
  draw(kind === 'motion' ? 'ink' : 'paper', [line[0], line[1], line[2] * p, line[3]]);
}

// One scheduler owns action starts and the cursor's approach. Scene code asks for progress by name.
export function script(definitions, { hold = 0, tail = 0.3, start = EXPORT } = {}) {
  let time = 0.8, previous = start, typed = false;
  const actions = definitions.map(def => {
    const from = def.from || def.to || previous, to = def.to || from;
    const distance = Math.hypot(from[0] - previous[0], from[1] - previous[1]);
    // CORRECTIONS-7 K2: longer moves take longer. An approach of distance d takes min(0.5, 0.18 + 0.07 d);
    // a hand action of path length d takes at least 0.12 + 0.08 d (its path's segments, or from to to).
    const move = distance < 1e-8 ? 0 : Math.max(Math.min(0.5, 0.18 + 0.07 * distance), handTime({ from: previous, to: from }));
    let duration = def.duration ?? (def.kind === 'type' ? Math.min(0.6, def.text.length * 0.035) : def.kind === 'run' ? Math.max(0.07, def.count * 0.07) : 0.05);
    if (def.kind === 'type') { duration = Math.max(typed ? 0.4 : 0.6, duration); typed = true; }
    if (HAND_KINDS.includes(def.kind)) duration = Math.max(duration, 0.12 + 0.08 * pathLength(def.path || [from, to]), handTime({ ...def, from, to }));
    const action = { ...def, from, to, previous, move: move * PACE, approach: time * PACE, start: (time + move) * PACE, end: (time + move + duration) * PACE };
    // The measured origins are the script's text insertion points, including rotated map labels.
    if (def.textArt) Object.defineProperty(action, 'points', { enumerable: true, get: () => (ART_TEXT[def.textArt] || []).filter(part => def.id !== 'title' || part.words.startsWith('King Street')).map(part => mapPoint(def.textRect, ...part.origin, ART[def.textArt].w, ART[def.textArt].h)) });
    time += move + duration; previous = to;
    return action;
  });
  return { actions, start, len: (time + hold + tail) * PACE, first: actions[0]?.start ?? 0.8 * PACE };
}
// CORRECTIONS-7: a path is walked by its length, so the hand's speed does not jump from segment to segment.
// Returns the segment and the fraction of it reached at fraction p of the whole length.
function alongPath(points, p) {
  const lengths = points.slice(1).map((b, i) => Math.hypot(b[0] - points[i][0], b[1] - points[i][1])), total = lengths.reduce((n, d) => n + d, 0);
  let left = p * total;
  for (let i = 0; i < lengths.length; i++) { if (left <= lengths[i] || i === lengths.length - 1) return [i, lengths[i] ? clamp(left / lengths[i], 0, 1) : 1]; left -= lengths[i]; }
}
// K2's floor from K3's limit: the distance rule assumed about 86 px per unit, but HOME draws a diagonal
// down-right move at up to 119 px per unit. So a move also takes at least the time that keeps its projected
// peak speed, along its own route at HAND, under HAND_PAGE.limit at the 1440 x 900 fit (S 103.6).
export const HAND_PAGE = { S: 103.6, limit: 1500 };
function handTime(route) {
  const page = ([x, y]) => [0, 1].map(k => HAND_PAGE.S * U * dot3([HOME.r, HOME.u][k], [x, y, 0])), n = 1000;
  let peak = 0, last = page(actionPoint(route, 0));
  for (let i = 1; i <= n; i++) { const p = page(actionPoint(route, HAND(i / n))); peak = Math.max(peak, Math.hypot(p[0] - last[0], p[1] - last[1]) * n); last = p; }
  // A straight route's exact peak is 1.875 times its length; the sampled one is never above it.
  if (!route.curve && !route.path) { const [a, b] = [page(route.from), page(route.to)]; peak = 1.875 * Math.hypot(b[0] - a[0], b[1] - a[1]); }
  return peak / HAND_PAGE.limit;
}
function pathLength(points) { let d = 0; for (let i = 1; i < points.length; i++) d += Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]); return d; }
const action = (s, id) => s.actions.find(a => a.id === id);
const begun = (s, id, t) => t >= action(s, id).start;
const done = (s, id, t) => t >= action(s, id).end;
const phase = (s, id, t) => linear(t, action(s, id).start, action(s, id).end);
// Everything that is not the hand keeps the brand's wipe; a hand action read through it is a mistake.
const eased = (s, id, t) => { const a = action(s, id); if (HAND_KINDS.includes(a.kind)) throw new Error(`${id} is a hand action: read it with handed()`); return EASE.wipe(linear(t, a.start, a.end)); };
// The cursor's point and every piece it moves read this, so they stay together.
const handed = (s, id, t) => { const a = action(s, id); if (!HAND_KINDS.includes(a.kind)) throw new Error(`${id} is not a hand action`); return HAND(linear(t, a.start, a.end)); };
function actionCursor(P, s, t) {
  let point = s.start, active, tool;
  for (const a of s.actions) {
    if (t < a.approach) break;
    if (t < a.start) { point = rectMix(a.previous, a.from, HAND(linear(t, a.approach, a.start))); break; }
    if (a.tool) tool = a.tool;
    if (t < a.end) {
      active = a;
      point = HAND_KINDS.includes(a.kind) ? actionPoint(a, handed(s, a.id, t)) : a.from;
      break;
    }
    point = a.to;
  }
  P.cursor = point;
  P.pressed = !!active && active.kind !== 'wait' && (['drag', 'draw', 'slide', 'stroke'].includes(active.kind) || t < active.start + 0.05 * PACE);
  P.action = active?.id;
  P.tool = tool;
}
function actionPoint(a, p) {
  if (a.curve) return quadratic(...a.curve, p);
  if (a.path) { const [i, f] = alongPath(a.path, p); return rectMix(a.path[i], a.path[i + 1], f); }
  return rectMix(a.from, a.to, p);
}
function inverseWipe(p) {
  let lo = 0, hi = 1;
  for (let i = 0; i < 50; i++) { const mid = (lo + hi) / 2; if (EASE.wipe(mid) < p) lo = mid; else hi = mid; }
  return (lo + hi) / 2;
}
const PHOTO = (() => { const h = 2.05, w = h * 526 / 360; return [CANVAS.l + (CANVAS.w - w) / 2, CANVAS.b + (CANVAS.h - h) / 2, w, h]; })();
const photoPoint = (u, v) => [PHOTO[0] + u * PHOTO[2], PHOTO[1] + v * PHOTO[3]];
const sliderPoint = (i, v) => [PANEL + 0.09 + 0.67 * v, TOP - 0.62 - i * 0.17];
const VIEW = [1.33, 1.5, 1.92, 1.08], PLAY = [2.29, 1.395];
const BINS = [0, 1, 2, 3].map(i => [0.14 + i % 2 * 0.39, TOP - 0.3 - Math.floor(i / 2) * 0.28, 0.35, 0.197]);
const TRANS_FROM = [3.74, 1.37, 0.2, 0.2], TRANS_TO = [0.44 + 1.3 - 0.16, 0.51, 0.32, 0.29];
const FX_FROM = [4.04, 1.37, 0.36, 0.2], FX_TO = [0.44 + 3.44, 0.55, 0.36, 0.2];
const compPoint = ([x, y]) => [VIEW[0] + x * VIEW[2] / 480, VIEW[1] + VIEW[3] - y * VIEW[3] / 270];
const compRect = ([x, y, w, h]) => [VIEW[0] + x * VIEW[2] / 480, VIEW[1] + VIEW[3] - (y + h) * VIEW[3] / 270, w * VIEW[2] / 480, h * VIEW[3] / 270];
const graphPoint = ([x, y]) => [3.74 + x / 240 * 0.95, 1.6 + (1 - y / 200) * 0.79];
function inPageSpot(x, y, w, h) { return [x + w * 0.045, y + h * (1 - 0.675 - 0.0225), w * 0.27, h * 0.045]; }
// D1: the canvas mirrors the devices. The phone's frame is to the tablet's frame as the phone's screen is to the tablet's on the
// floor (both 9 : 19.5 and 3 : 4 as before), top-aligned in its row as Figma lines frames up.
export const FIG_PHONE = (UI_ROW.phoneD - 2 * UI_ROW.phoneRim) / (UI_ROW.tabD - 2 * UI_ROW.rim);
// CORRECTIONS-13 U1: all three frames mirror their screens' heights (the laptop's lid screen, the tablet's and the phone's), the
// tallest 0.86 high as before.
export const FIG_SCREENS = [UI_ROW.screenH, UI_ROW.tabD - 2 * UI_ROW.rim, UI_ROW.phoneD - 2 * UI_ROW.phoneRim];
export const FIG = (() => {
  const h = 0.86, k = h / Math.max(...FIG_SCREENS), tall = FIG_SCREENS.map(n => n * k), g = 0.14, dw = tall[0] * 1.6, tw = tall[1] * 3 / 4, pw = tall[2] * 9 / 19.5, cl = 0.9, cr = PANEL - 0.1, x = cl + (cr - cl - dw - tw - pw - 2 * g) / 2;
  const cols = [[x, dw], [x + dw + g, tw], [x + dw + g + tw + g, pw]];
  const designs = cols.map(([x, w], i) => [x, 0.46 + h - tall[i], w, tall[i]]), wires = cols.map(([x, w], i) => [x, 1.58 + h - tall[i], w, tall[i]]);
  const [lx, ly, , lh] = designs[0], spot = inPageSpot(lx, ly, dw, lh);
  return { cols, designs, wires, spot, from: [spot[0] + spot[2], spot[1] + spot[3] / 2], to: [lx + dw + 0.06, ly + lh * 0.325] };
})();
const topLeft = r => [r[0], r[1] + r[3]], bottomRight = r => [r[0] + r[2], r[1]];
const inRect = (outer, r) => [outer[0] + r[0] * outer[2], outer[1] + (1 - r[1] - r[3]) * outer[3], r[2] * outer[2], r[3] * outer[3]];
const HERO_REGION = [665 / 1440, 119 / 900, 678 / 1440, 682 / 900], HERO_SOURCE = [PANEL + 0.15, TOP - 1.05, 0.55, 0.55];
export const ID = (() => {
  const gap = 0.12, low = 1, pw = 1.6, ph = pw * 340 / 440, x = CANVAS.l + (CANVAS.w - 2 * pw) / 2, y2 = CANVAS.b + (CANVAS.h - ph - low - gap) / 2, y = y2 + low + gap;
  const cw = low * 440 / 340, ew = 2 * pw - cw - low - 2 * gap, cover = [x, y2, cw, low], post = [x + cw + gap, y2, low, low], mail = [x + cw + low + 2 * gap, y2, ew, low];
  const frame = [x + 34 / 1100 * pw, y + ph - 826 / 850 * ph, (2056 - 34) / 1100 * pw, (826 - 84) / 850 * ph];
  const photoW = cw * (1 - 380 / 1100), photo = [x + cw * 380 / 1100, y2, photoW, low];
  const th = 0.36 * 340 / 440, loc = [PANEL + 0.425 - 0.36, TOP - 0.13 - 3 * th - 0.2, 0.72 * 1352 / 2200, th];
  return { spread: [x, y, pw * 2, ph], left: [x, y, pw, ph], right: [x + pw, y, pw, ph], frame, cover, post, mail, mailPhoto: inRect(mail, [300 / 800, 168 / 1180, 456 / 800, 470 / 1180]), photo, loc };
})();
const AI = (() => {
  const [sx, sy, sw, sh] = SPOT, pw = 3.2, ph = pw * 850 / 2200, gap = 0.1, low = (pw - gap) / (1352 / 850 + sw / sh), lw = low * 1352 / 850, cw = low * sw / sh;
  const x = CANVAS.l + (CANVAS.w - pw) / 2, y2 = CANVAS.b + (CANVAS.h - ph - low - gap) / 2, y = y2 + low + gap, k = lw / 1352;
  const close = [x + lw + gap, y2, cw, low], frame = [x + sx * k, y2 + low - (sy + sh) * k, sw * k, sh * k];
  const at = ([X, Y]) => [close[0] + (X - sx) * cw / sw, y2 + low - (Y - sy) * low / sh], subway = subwayPath();
  const segments = subway.line.slice(1).map((b, i) => inside(subway.line[i], b, SPOT)).filter(Boolean);
  return { upper: [x, y, pw, ph], lower: [x, y2, lw, low], close, frame, at, segments, subway };
})();
const mapPoint = (r, x, y, w, h) => [r[0] + x / w * r[2], r[1] + (1 - y / h) * r[3]];
// After Export's 0.7 s: the ball, two video plays / one motion play / Figma's cycle and lid closing.
const EXPORT_HOLD = { pr: ballLength('pr') + 3.2 - 0.7, ae: ballLength('ae') + 3.2 - 0.7, fig: ballLength('fig') + 3 + BALL.lid - 0.7 };
export const SCRIPTS = {
  ps: script([
    { id: 'open', kind: 'click', from: centre(PHOTO), duration: 0.3, tool: 'tMove' },
    { id: 'black', kind: 'slide', from: sliderPoint(0, 0.2), to: sliderPoint(0, 0.3), duration: 0.5 },
    { id: 'white', kind: 'slide', from: sliderPoint(1, 0.5), to: sliderPoint(1, 0.45), duration: 0.5 },
    { id: 'sky', kind: 'click', from: photoPoint(0.6, 0.9), duration: 0.7, tool: 'tWand' },
    { id: 'cone', kind: 'stroke', from: photoPoint(0.06, 0.23), to: photoPoint(0.19, 0.23), duration: 0.25, tool: 'healing' },
    { id: 'crane', kind: 'stroke', from: photoPoint(0.70, 0.94), to: photoPoint(0.96, 0.80), duration: 0.25, tool: 'healing' },
    { id: 'grade', kind: 'slide', from: photoPoint(1, 0.5), to: photoPoint(0, 0.5), duration: 1.1, tool: 'tBrush' },
    { id: 'shrink', kind: 'wait', duration: 0.15 },
    { id: 'export', kind: 'export', from: EXPORT, duration: 0.65 },
  ]),
  pr: script([
    { id: 'bin', kind: 'run', from: centre(BINS[0]), to: centre(BINS[3]), count: 4 },
    { id: 'clipA', kind: 'drag', from: centre(BINS[0]), to: [0.44 + 0.65, 0.655], duration: 0.4 },
    { id: 'clipB', kind: 'drag', from: centre(BINS[1]), to: [0.44 + 2.15, 0.655], duration: 0.4 },
    { id: 'clipC', kind: 'drag', from: centre(BINS[2]), to: [0.44 + 3.6, 0.655], duration: 0.4 },
    { id: 'cut', kind: 'click', from: [0.44 + 2.7, 0.655], tool: 'blade' },
    { id: 'offcut', kind: 'click', from: [0.44 + 2.85, 0.655], duration: 0.12, tool: 'arrow' },
    { id: 'closeGap', kind: 'wait', duration: 0.25 },
    { id: 'transition', kind: 'drag', from: centre(TRANS_FROM), to: centre(TRANS_TO), duration: 0.45 },
    { id: 'effect', kind: 'drag', from: centre(FX_FROM), to: centre(FX_TO), duration: 0.4 },
    { id: 'caption', kind: 'type', from: [VIEW[0] + 0.608, VIEW[1] + 0.28], text: 'Look good.', tool: 'type' },
    { id: 'caption2', kind: 'type', from: [VIEW[0] + 0.608, VIEW[1] + 0.28], text: 'Move well.', duration: 0.4, tool: 'type' },
    { id: 'caption3', kind: 'type', from: [VIEW[0] + 0.608, VIEW[1] + 0.28], text: 'Work right.', duration: 0.4, tool: 'type' },
    { id: 'captions', kind: 'run', from: [0.44 + 2.34, 0.925], to: [0.44 + 3.21, 0.925], count: 2 },
    { id: 'music', kind: 'drag', from: centre(BINS[3]), to: [2.39, 0.245], duration: 0.4, tool: 'arrow' },
    { id: 'duck', kind: 'slide', from: [2.05, 0.31], to: [2.05, 0.245], duration: 0.25 },
    { id: 'fade', kind: 'slide', from: [4.33, 0.31], to: [4.33, 0.16], duration: 0.25 },
    { id: 'play', kind: 'play', from: PLAY, duration: 1.6 },
    { id: 'export', kind: 'export', from: EXPORT, duration: 0.7 },
  ], { hold: EXPORT_HOLD.pr, tail: BALL.sink }),
  ae: script([
    { id: 'comp', kind: 'click', from: centre(VIEW), duration: 0.3 },
    { id: 'make', kind: 'type', from: compPoint([34, 98]), text: 'Make it', tool: 'type' },
    { id: 'move', kind: 'type', from: compPoint([34, 162]), text: 'move.', tool: 'type' },
    { id: 'ball', kind: 'draw', from: compPoint([BALL_FROM[0] - COMP_BALL[2], BALL_FROM[1] - COMP_BALL[2]]), to: compPoint([BALL_FROM[0] + COMP_BALL[2], BALL_FROM[1] + COMP_BALL[2]]), duration: 0.25, tool: 'ellipse' },
    { id: 'row', kind: 'draw', from: compPoint(ROWS[0]), to: compPoint([ROWS[0][0] + ROWS[0][2], ROWS[0][1] + ROWS[0][3]]), duration: 0.25, tool: 'rectangle' },
    { id: 'copies', kind: 'run', from: compPoint(ROWS[1]), to: compPoint(ROWS[2]), count: 2 },
    { id: 'select', kind: 'click', from: [0.7, 0.605], tool: 'arrow' },
    { id: 'stopwatch', kind: 'click', from: [1.14, 0.605] },
    { id: 'head', kind: 'drag', from: [1.34, 1.06], to: [2.79, 1.06], duration: 0.25 },
    { id: 'path', kind: 'drag', from: compPoint(BALL_FROM), to: compPoint(COMP_BALL), curve: [BALL_FROM, BALL_VIA, COMP_BALL].map(compPoint), duration: 0.35 },
    { id: 'marquee', kind: 'draw', from: [1.36, 0.93], to: [3.46, 0.13], duration: 0.25 },
    { id: 'keys', kind: 'run', from: [1.44, 0.885], to: [3.34, 0.185], count: 5 },
    { id: 'staggerBall', kind: 'drag', from: [1.34, 0.605], to: [2.09, 0.605], duration: 0.2 },
    { id: 'graph', kind: 'slide', from: graphPoint([88, 176 - 152 / 3]), to: graphPoint([115.2, 176]), duration: 0.6 },
    { id: 'play', kind: 'play', from: PLAY, duration: 1.6 },
    { id: 'export', kind: 'export', from: EXPORT, duration: 0.7 },
  ], { hold: EXPORT_HOLD.ae, tail: BALL.sink }),
  fig: script([
    ...FIG.wires.map((r, i) => ({ id: 'frame' + i, kind: 'draw', from: topLeft(r), to: bottomRight(r), duration: 0.3, tool: 'frame' })),
    { id: 'pictureBox', kind: 'draw', from: topLeft(inRect(FIG.wires[0], HERO_REGION)), to: bottomRight(inRect(FIG.wires[0], HERO_REGION)), duration: 0.25, tool: 'rectangle' },
    { id: 'heading', kind: 'type', from: topLeft(inRect(FIG.wires[0], [64 / 1440, 252 / 900, 420 / 1440, 174 / 900])), text: 'Portfolio', duration: 0.6, tool: 'type' },
    { id: 'button', kind: 'draw', from: topLeft(inRect(FIG.wires[0], [64 / 1440, 555 / 900, 380 / 1440, 35 / 900])), to: bottomRight(inRect(FIG.wires[0], [64 / 1440, 555 / 900, 380 / 1440, 35 / 900])), duration: 0.2, tool: 'rectangle' },
    { id: 'details', kind: 'run', from: topLeft(FIG.wires[0]), to: bottomRight(FIG.wires[2]), count: 9, duration: 0.21 },
    { id: 'marquee', kind: 'draw', from: topLeft(FIG.wires[0]), to: [FIG.wires[2][0] + FIG.wires[2][2], FIG.wires[0][1]], duration: 0.25, tool: 'arrow' },   // D1: round the whole row, down to its tallest frame's foot
    { id: 'copies', kind: 'drag', from: [(FIG.wires[0][0] + FIG.wires[2][0] + FIG.wires[2][2]) / 2, 2.01], to: [(FIG.wires[0][0] + FIG.wires[2][0] + FIG.wires[2][2]) / 2, 0.89], duration: 0.4 },
    ...FIG.designs.map((r, i) => ({ id: 'fill' + i, kind: 'set', from: centre(r), duration: 0.05, tool: 'arrow' })),
    { id: 'hero', kind: 'drag', from: centre(HERO_SOURCE), to: centre(inRect(FIG.designs[0], HERO_REGION)), duration: 0.4 },
    { id: 'name', kind: 'type', from: topLeft(inRect(FIG.designs[0], [18 / 480, 74 / 300, 160 / 480, 38 / 300])), text: 'Danial Endrawes', duration: 0.4, tool: 'type' },
    ...FIG.designs.map((r, i) => ({ id: 'accent' + i, kind: 'set', from: centre(r), duration: 0.05, tool: 'arrow' })),
    { id: 'hotspot', kind: 'click', from: FIG.from, tool: 'arrow' },
    { id: 'link', kind: 'drag', from: FIG.from, to: FIG.to, duration: 0.6 },
    { id: 'panel', kind: 'run', from: [PANEL + 0.2, TOP - 0.46], to: [PANEL + 0.45, 0.32], count: 5, duration: 0.2 },
    { id: 'export', kind: 'export', from: EXPORT, duration: 0.7 },
  ], { hold: EXPORT_HOLD.fig, tail: BALL.sink }),
  id: script([
    // CORRECTIONS-12 I1: no frames are drawn. The document opens with its blank pages already there (see blankPages).
    { id: 'map', kind: 'drag', from: centre(DOCK.map), to: centre(ID.frame), duration: 0.45, tool: 'arrow' },
    { id: 'heading', kind: 'type', from: [ID.right[0] + ID.right[2] * 1052 / 1100, ID.right[1] + ID.right[3] * (1 - 672 / 850)], text: 'Amenities', duration: 0.6, tool: 'type' },
    { id: 'spreadType', kind: 'run', from: topLeft(ID.left), to: bottomRight(ID.right), count: 6, duration: 0.3 },
    { id: 'loc', kind: 'drag', from: centre(DOCK.loc), to: centre(ID.loc), duration: 0.45, tool: 'arrow' },
    { id: 'photo', kind: 'drag', from: centre(DOCK.photo), to: centre(ID.photo), duration: 0.45 },
    { id: 'blob', kind: 'draw', from: topLeft(inRect(ID.cover, [50 / 1100, 482 / 850, 588 / 1100, 320 / 850])), to: bottomRight(inRect(ID.cover, [50 / 1100, 482 / 850, 588 / 1100, 320 / 850])), duration: 0.18, tool: 'rectangle' },
    { id: 'coverTitle', kind: 'type', from: topLeft(inRect(ID.cover, [800 / 1100, 690 / 850, 300 / 1100, 110 / 850])), text: 'Office Space For Sale', duration: 0.4, tool: 'type' },
    { id: 'pages', kind: 'run', from: [PANEL + 0.425, TOP - 0.13 - 2 * (0.36 * 340 / 440) - 0.1], to: [PANEL + 0.425, TOP - 0.13 - 6 * (0.36 * 340 / 440) - 0.5], count: 3 },
    { id: 'postPhoto', kind: 'drag', from: centre(ID.photo), to: centre(ID.post), duration: 0.3, tool: 'arrow' },
    { id: 'postTitle', kind: 'type', from: topLeft(inRect(ID.post, [0.71, 0.81, 0.28, 0.12])), text: 'Office Space For Sale', duration: 0.4, tool: 'type' },
    { id: 'postBlob', kind: 'draw', from: topLeft(inRect(ID.post, [0.05, 0.61, 0.60, 0.31])), to: bottomRight(inRect(ID.post, [0.05, 0.61, 0.60, 0.31])), duration: 0.18, tool: 'rectangle' },
    { id: 'postButton', kind: 'draw', from: topLeft(inRect(ID.post, [0.69, 0.788, 0.31, 0.146])), to: bottomRight(inRect(ID.post, [0.69, 0.788, 0.31, 0.146])), duration: 0.18, tool: 'rectangle' },
    { id: 'mailPhoto', kind: 'drag', from: centre(ID.photo), to: centre(ID.mailPhoto), duration: 0.3, tool: 'arrow' },
    { id: 'mailTitle', kind: 'type', textArt: 'eblast', textRect: ID.mail, from: topLeft(inRect(ID.mail, [44 / 800, 690 / 1180, 700 / 800, 60 / 1180])), text: 'Office Space For Sale', duration: 0.4, tool: 'type' },
    { id: 'mailBlob', kind: 'draw', from: topLeft(inRect(ID.mail, [44 / 800, 404 / 1180, 430 / 800, 230 / 1180])), to: bottomRight(inRect(ID.mail, [44 / 800, 404 / 1180, 430 / 800, 230 / 1180])), duration: 0.18, tool: 'rectangle' },
    { id: 'mailButton', kind: 'draw', from: topLeft(inRect(ID.mail, [44 / 800, 1040 / 1180, 262 / 800, 72 / 1180])), to: bottomRight(inRect(ID.mail, [44 / 800, 1040 / 1180, 262 / 800, 72 / 1180])), duration: 0.18, tool: 'rectangle' },
    { id: 'mailFlyer', kind: 'type', from: topLeft(inRect(ID.mail, [70 / 800, 1057 / 1180, 225 / 800, 30 / 1180])), text: 'View the flyer', duration: 0.4, tool: 'type' },
    { id: 'export', kind: 'export', from: EXPORT, duration: 0.8 },
    { id: 'drop', kind: 'wait', duration: ballLength('id') - 0.8 },   // CORRECTIONS-15: the ball goes on after the button has filled
    { id: 'land', kind: 'wait', duration: 3.0 },
    { id: 'pickup', kind: 'wait', duration: 0.7 },
    { id: 'open', kind: 'wait', duration: 0.1 },
    { id: 'leaf1', kind: 'wait', duration: 0.6 },
    { id: 'pause1', kind: 'wait', duration: 0.3 },
    { id: 'leaf2', kind: 'wait', duration: 0.6 },
    { id: 'pause2', kind: 'wait', duration: 0.3 },
    { id: 'leaf3', kind: 'wait', duration: 0.6 },
    { id: 'pause3', kind: 'wait', duration: 0.3 },
    { id: 'leaf4', kind: 'wait', duration: 0.6 },
    { id: 'read', kind: 'wait', duration: 0.3 },
    { id: 'return', kind: 'wait', duration: BALL.sink },   // CORRECTIONS-15 S2: the sink
  ], { tail: 0, start: centre(DOCK.loc) }),
  ai: script([
    ...[AI.upper, AI.lower].map((r, i) => ({ id: 'board' + i, kind: 'draw', from: topLeft(r), to: bottomRight(r), duration: 0.3, tool: 'rectangle' })),
    { id: 'street', kind: 'stroke', from: mapPoint(AI.upper, 0, 426, 2200, 850), to: mapPoint(AI.upper, 2200, 426, 2200, 850), duration: 0.5, tool: 'pen' },
    { id: 'markers', kind: 'run', from: mapPoint(AI.upper, 150, 358, 2200, 850), to: mapPoint(AI.upper, 1970, 464, 2200, 850), count: AM_MARKERS.length, duration: 0.21 },
    { id: 'labels', kind: 'type', from: mapPoint(AI.upper, 150, 344, 2200, 850), text: 'Street and shop labels', textArt: 'kMap', textRect: AI.upper, duration: 0.6, tool: 'type' },
    { id: 'title', kind: 'type', from: mapPoint(AI.upper, 470, 426, 2200, 850), text: 'King Street W King Street E', textArt: 'kMap', textRect: AI.upper, duration: 0.4 },
    { id: 'badge', kind: 'draw', from: mapPoint(AI.upper, 1273, 457, 2200, 850), to: mapPoint(AI.upper, 1345, 603, 2200, 850), duration: 0.18, tool: 'rectangle' },
    { id: 'block', kind: 'draw', from: mapPoint(AI.lower, 660, 16, 1352, 850), to: mapPoint(AI.lower, 722, 84, 1352, 850), duration: 0.18 },
    { id: 'blocks', kind: 'run', from: mapPoint(AI.lower, 770, 16, 1352, 850), to: mapPoint(AI.lower, 680, 716, 1352, 850), count: CITY_BLOCKS.length - 1, duration: 0.14 },
    { id: 'streets', kind: 'stroke', from: mapPoint(AI.lower, 0, 368, 1352, 850), to: mapPoint(AI.lower, 1352, 368, 1352, 850), duration: 0.5, tool: 'pen' },
    { id: 'pins', kind: 'run', from: mapPoint(AI.lower, 180, 100, 1352, 850), to: mapPoint(AI.lower, 960, 640, 1352, 850), count: CITY_PINS.length, duration: 0.2 },
    { id: 'cityLabels', kind: 'type', from: mapPoint(AI.lower, 200, 167, 1352, 850), text: 'Street and station labels', textArt: 'kLoc', textRect: AI.lower, duration: 0.4, tool: 'type' },
    { id: 'marquee', kind: 'draw', from: topLeft(AI.frame), to: bottomRight(AI.frame), duration: 0.3, tool: 'arrow' },
    { id: 'close', kind: 'wait', duration: 0.5 },
    { id: 'subway', kind: 'stroke', from: AI.at(AI.segments[0][0]), to: AI.at(AI.segments.at(-1)[1]), path: [AI.segments[0][0], ...AI.segments.map(([, b]) => b)].map(AI.at), duration: 0.35, tool: 'pen' },
    { id: 'inspect', kind: 'wait', duration: 0.14, tool: 'arrow' },
    { id: 'export', kind: 'export', from: EXPORT, duration: 0.05 },
    { id: 'closeBack', kind: 'wait', duration: 0.25 },
    { id: 'mapExport', kind: 'drag', from: centre(AI.upper), to: centre(DOCK.map), duration: 0.5, tool: 'arrow' },
    { id: 'locExport', kind: 'drag', from: centre(AI.lower), to: centre(DOCK.loc), duration: 0.5 },
  ]),
};
function exportSpan(i) {
  const s = SCRIPTS[SHOW[i].key];
  const a = action(s, 'export'); return [a.start, SHOW[i].key === 'ai' ? action(s, 'locExport').end : a.end];
}
function editedPhoto(t) {
  const P = [], s = SCRIPTS.ps;
  actionCursor(P, s, t);
  const current = s.actions.filter(a => t >= a.start).at(-1), tool = current?.tool || 'tBrush';
  rail(P, ['tMove', 'tMarquee', 'tBrush', 'tType', 'tRect', 'tWand'], tool === 'tMove' ? 0 : tool === 'tWand' ? 5 : 2);
  // The empty panel retains its sliders; histogram and layers belong to the document.
  const g = handed(s, 'grade', t);
  const levels = [mix(0.2, 0.3, handed(s, 'black', t)), mix(0.5, 0.45, handed(s, 'white', t))];
  const values = [mix(levels[0], 0.55, g), mix(levels[1], 0.3, g)];
  values.forEach((v, i) => {
    const [hx, y] = sliderPoint(i, v);
    P.push(on('dark', PANEL + 0.09, y, 0.67, 0.03, { lift: 0.05, t: 0.01 }), on(i ? 'grey' : 'red', PANEL + 0.09, y, 0.67 * v, 0.03, { lift: 0.06, t: 0.012 }), on('paper', hx - 0.025, y - 0.04, 0.05, 0.11, { lift: 0.07, t: 0.02 }));
  });
  if (!begun(s, 'open', t)) return P;
  const doc = [];
  const histogramMix = (handed(s, 'black', t) + handed(s, 'white', t)) / 2;
  HISTOGRAM.forEach(([dark, graded], i) => {
    const h = mix(dark, graded, histogramMix) * 0.28;
    doc.push({ ...on('grey', PANEL + 0.09 + i * 0.67 / 48, TOP - 0.42, 0.67 / 48 * 0.8, h, { lift: 0.051, t: 0.004 }), histogram: i, histogramMix });
  });
  const rows = [begun(s, 'open', t), done(s, 'black', t), begun(s, 'sky', t), begun(s, 'cone', t)];
  rows.forEach((visible, i) => {
    if (!visible) return;
    const y = TOP - 1.26 - i * 0.31, art = [null, 'kPhoto', 'kPhotoB', null][i];
    if (!i) doc.push(on('dark', PANEL + 0.05, y - 0.04, 0.75, 0.28, { lift: 0.05, t: 0.008 }));
    doc.push(icon('eye', PANEL + 0.08, y + 0.03, 0.14, 0.14, i ? 'night' : 'dark', i ? 0.051 : 0.059), on(i ? 'ink' : 'paper', PANEL + 0.27, y, 0.28, 0.2, { lift: 0.07, t: 0.01, art }), on(i ? 'dark' : 'grey', PANEL + 0.6, y + 0.07, 0.17, 0.05, { lift: 0.07, t: 0.008 }));
  });
  for (const pc of doc) pc.echo = 'open';
  if (!begun(s, 'export', t)) {
    const draw = echoPainter(screenPainter(doc, PHOTO), 'open');
    const white = begun(s, 'white', t), base = done(s, 'grade', t) ? 'kPhoto' : done(s, 'crane', t) ? 'photoClean' : done(s, 'cone', t) ? 'photoNoCone' : done(s, 'sky', t) ? 'photoSky' : begun(s, 'sky', t) ? 'photoLevels' : white ? 'photoHalf' : 'photoRaw';
    const pc = cropPicture(draw, 'ink', [0, 0, 1, 1], base, eased(s, 'open', t));
    if (pc && !begun(s, 'sky', t)) {
      pc.artB = white ? 'photoLevels' : 'photoHalf';
      pc.artMix = handed(s, white ? 'white' : 'black', t);
    }
    if (begun(s, 'sky', t) && !done(s, 'sky', t)) cropPicture(draw, 'ink', [0, 0, 1, 1], 'photoSky', eased(s, 'sky', t));
    // Each heal replaces the whole base on release, so no patch edge can survive.
    if (begun(s, 'grade', t)) {
      if (!done(s, 'grade', t)) draw('ink', [1 - g, 0, g, 1], 'kPhoto', [1 - g, 0, 1, 1]);
      const split = PHOTO[0] + PHOTO[2] * (1 - g), h = (PHOTO[3] + 0.1) * (1 - eased(s, 'shrink', t));
      if (h > 0) doc.push(on('paper', split - 0.012, PHOTO[1] + PHOTO[3] / 2 - h / 2, 0.024, h, { lift: 0.085, t: 0.01, overlay: true }));
      if (!done(s, 'grade', t)) doc.push(dot('paper', split, PHOTO[1] + PHOTO[3] / 2, 0.09, { lift: 0.085, overlay: true }), dot('red', split, PHOTO[1] + PHOTO[3] / 2, 0.045, { lift: 0.105, t: 0.01, overlay: true }));
    }
  } else { const a = action(s, 'export'); travel(P, 'photo', PHOTO, DOCK.photo, t, a.start, a.end); }
  if (P.tool === 'healing') P.push({ ...on('paper', P.cursor[0] - 0.07, P.cursor[1] - 0.07, 0.14, 0.14, { lift: 0.18, t: 0.004, art: 'brushRing', overlay: true }), cut: true });
  doc.forEach(pc => pc.document = true); P.push(...doc);
  return P;
}
function typedPicture(P, rect, art, words, p, { tone = 'paper', colour = 'ink', direction = 'right', caret: showCaret = true } = {}) {
  if (p < 0) return;
  const n = p >= 1 ? words.length : Math.floor(clamp(p, 0, 1) * words.length), size = ART[art];
  const edges = TYPE_EDGES[art] || Array.from({ length: words.length + 1 }, (_, i) => size.w * i / words.length);
  const birth = P.length;
  const edge = clamp(edges[n] / (direction === 'up' ? size.h : size.w), 0, 1), draw = screenPainter(P, rect);
  if (p >= 1) draw(tone, [0, 0, 1, 1], art);
  else {
    cropPicture(draw, tone, [0, 0, 1, 1], art, edge, direction);
    if (!showCaret) return;
    const [x, y, w, h] = rect;
    const bounds = TYPE_BOXES[art] || { top: 0, height: size.h };
    const caretTone = Array.isArray(colour) ? 'paper' : colour;
    const caret = direction === 'up' ? on(caretTone, x + w * 0.1, y + h * edge, w * 0.8, 0.012, { lift: 0.095, t: 0.004 }) : on(caretTone, x + w * edge, y + (1 - (bounds.top + bounds.height) / size.h) * h, 0.012, bounds.height / size.h * h, { lift: 0.095, t: 0.004 });
    caret.tones = Array.isArray(colour) ? colour : Array(3).fill({ ink: '#151314', paper: '#F7F6F3', red: '#C0262E', grey: '#B9B4AE' }[colour]);
    caret.overlay = true; P.push(caret);
  }
  for (const pc of P.slice(birth)) { pc.text = { key: art, words, count: n, total: words.length, prefix: p < 1 }; if (pc.overlay) pc.caret = art; }
}
function dragPicture(P, s, id, t, from, to, art, tone = 'ink') {
  if (!begun(s, id, t)) { P.push(on(tone, ...from, { lift: 0.07, t: 0.015, art })); return; }
  const p = handed(s, id, t), rect = rectMix(from, to, p);
  const pc = on(tone, ...rect, { lift: s === SCRIPTS.id ? 0.065 : 0.08, t: 0.015, art });   // N2/F1: one height, landing on its page
  if (ART[art].photoProfile) {
    const aspect = ART[art].w / ART[art].h, ratio = rect[2] / rect[3];
    const w = Math.min(1, ratio / aspect), h = Math.min(1, aspect / ratio);
    pc.window = [(1 - w) / 2, (1 - h) / 2, (1 + w) / 2, (1 + h) / 2];
    pc.photoProfile = ART[art].photoProfile;
    if (from === DOCK.photo && p < 1) {
      const rim = 0.012 * (1 - p);
      P.push({ ...on('grey', rect[0] - rim, rect[1] - rim, rect[2] + rim * 2, rect[3] + rim * 2, { lift: s === SCRIPTS.id ? 0.045 : 0.06, t: 0.012 }), where: 'travel', action: id });
    }
  }
  if (!done(s, id, t)) { pc.where = 'travel'; pc.action = id; }
  P.push(pc);
}
// CORRECTIONS-15: each piece's span runs from the Export click to the end of its "become" (its wipe; the laptop's lid); land is when
// every piece is built, which starts the plays (two of 1.6 s, or Figma's one 3.0 s cycle) and the labels. off: the sink, BALL.sink
// long. InDesign's sink is its own wait, 'return'.
export function playbackSpans(s) {
  const key = Object.keys(SCRIPTS).find(k => SCRIPTS[k] === s), a = action(s, 'export').start;
  const spans = [0, 1, 2].map(j => { const b = ballBeats(key, j); return [a + b.start * PACE, a + b.become * PACE]; }), land = a + ballLength(key) * PACE;
  if (key === 'id') { const back = action(s, 'return'); return { spans, land, off: [back.start, back.end] }; }
  return { spans, land, off: [land + (key === 'fig' ? 3 + BALL.lid : 3.2) * PACE, s.len] };
}
function playClock(t, land, stop, key) {
  const elapsed = Math.max(0, (Math.min(t, stop) - land) / PACE), cycles = 2;
  return elapsed >= cycles * 1.6 - 1e-9 ? 1 : elapsed % 1.6 / 1.6;
}
function exportPlay(s, t) {
  const { land, off } = playbackSpans(s);
  if (s === SCRIPTS.fig) return t >= land && t < off[1] ? Math.min(1, (t - land) / (3 * PACE)) : null;
  // CORRECTIONS-15 S2: the plays hold their frame while the exports sink (as Figma's cycle always has), so nothing moves but down.
  return t >= land && t < off[1] ? playClock(t, land, off[0], s === SCRIPTS.ae ? 'ae' : 'pr') : null;
}
function editedVideo(t) {
  const P = [], D = [], s = SCRIPTS.pr;
  actionCursor(P, s, t);
  const run = begun(s, 'bin', t) ? Math.min(4, 1 + Math.floor(phase(s, 'bin', t) * 4)) : 0;
  BINS.forEach((r, i) => { if (i < run) D.push(on(i === 3 ? 'dark' : 'ink', ...r, { lift: 0.05, t: 0.015, art: ['thumbA', 'thumbB', 'thumbC', 'wave'][i] })); });
  [0.6, 0.44].forEach((w, i) => P.push(on('dark', 0.14, 1.52 - i * 0.12, w, 0.05, { lift: 0.05, t: 0.01 })));
  P.push(icon('transport', 2.04, 1.345, 0.5, 0.1), icon('ruler', 0.44, 1.01, W - 0.64, 0.06));
  if (begun(s, 'bin', t)) { P.push(on('red', 0.15, 1.025, 0.18, 0.18, { lift: 0.05, t: 0.012 }), icon(P.tool === 'blade' ? 'tBlade' : P.tool === 'type' ? 'tType' : 'tArrow', 0.17, 1.045, 0.14, 0.14, 'red', 0.065)); }
  [['tT', 0.84], ['tV', 0.54], ['tA', 0.30], ['tA', 0.13]].forEach(([art, y]) => P.push(icon(art, 0.16, y, 0.2, 0.16)));
  // Neutral wheels and empty lanes are furniture; footage, captions and sound are document pieces.
  const grade = handed(s, 'effect', t);
  for (let i = 0; i < 3; i++) P.push(dot('dark', 3.86 + i * 0.355, TOP - 0.3, 0.15), dot(i === 1 ? 'red' : 'paper', 3.86 + i * 0.355 + [0.05, -0.04, 0.02][i] * grade, TOP - 0.3 + [0.03, 0.05, -0.06][i] * grade, 0.035, { lift: 0.08, t: 0.01 }));
  [mix(0.5, 0.62, grade), mix(0.5, 0.3, grade)].forEach((v, i) => {
    const y = TOP - 0.66 - i * 0.2;
    P.push(on('dark', 3.74, y, 0.95, 0.03, { lift: 0.05, t: 0.01 }), on(i ? 'grey' : 'red', 3.74, y, 0.95 * v, 0.03, { lift: 0.06, t: 0.012 }), on('paper', 3.74 + 0.95 * v - 0.025, y - 0.04, 0.05, 0.11, { lift: 0.07, t: 0.02 }));
  });
  dragPicture(P, s, 'transition', t, TRANS_FROM, TRANS_TO, 'trans', 'paper');
  dragPicture(P, s, 'effect', t, FX_FROM, FX_TO, 'fx', 'red');
  const gap = 0.3 * (1 - eased(s, 'closeGap', t));
  ['clipA', 'clipB', 'clipC'].forEach((id, i) => {
    if (!begun(s, id, t)) return;
    const p = handed(s, id, t), cut = begun(s, 'cut', t), removed = done(s, 'offcut', t);
    const length = [1.3, cut ? 1.4 : 1.7, 1.2][i], start = [0, 1.3, 2.7 + gap][i];
    const to = [0.45 + start, 0.51, length - 0.02, 0.29], r = rectMix(BINS[i], to, p), moving = !done(s, id, t);
    const lift = 0.05, clip = on(i === 1 ? 'red' : 'grey', ...r, { lift, t: 0.03 });
    const thumb = rectMix(BINS[i], [to[0] + 0.03, 0.54, 0.46, 0.23], p);
    const image = on('ink', ...thumb, { lift: lift + 0.035, t: 0.004, art: ['thumbA', 'thumbB', 'thumbC'][i] });
    const voice = on('dark', r[0], r[1] - 0.10, r[2], 0.075, { lift, t: 0.01, art: 'wave' });
    [clip, image, voice].forEach(pc => { pc.echo = id; if (moving) { pc.where = 'travel'; pc.action = id; } D.push(pc); });
    if (i === 1 && cut && !removed) {
      const echoStart = D.length;
      D.push(on('red', 0.44 + 2.7, 0.51, 0.015, 0.29, { lift: 0.095, t: 0.008 }), on('red', 0.44 + 2.7, 0.51, 0.3, 0.29, { lift: 0.05, t: 0.03 }), on('dark', 0.44 + 2.7, 0.41, 0.3, 0.075, { lift: 0.05, t: 0.01, art: 'wave' }));
      if (begun(s, 'offcut', t)) D.push(...outline(0.44 + 2.7, 0.51, 0.3, 0.29));
      tagEcho(D, 'cut', echoStart);
    }
  });
  const exported = exportPlay(s, t), playing = begun(s, 'play', t) && !done(s, 'play', t);
  const clock = exported ?? (playing ? phase(s, 'play', t) : null);
  const repeated = begun(s, 'captions', t) ? Math.min(2, 1 + Math.floor(phase(s, 'captions', t) * 2)) : 0;
  const captionIndex = begun(s, 'play', t) ? 1 : repeated ? repeated + 2 : begun(s, 'caption3', t) ? 2 : begun(s, 'caption2', t) ? 1 : 0;
  const at = clock === null ? begun(s, 'play', t) ? 0.9 : CAPTIONS[captionIndex][0] : clock * 3.9;
  if (done(s, 'clipA', t)) {
    const echoStart = D.length;
    const draw = screenPainter(D, VIEW);
    if (clock !== null) movie(draw, 0, clock);
    else {
      draw('ink', [0, 0, 1, 1], at < 1.46 ? 'shotA' : at < 2.7 ? 'shotB' : 'shotCfx');
      if (begun(s, 'caption', t)) {
        const cap = ['cap1', 'cap2', 'cap3', 'cap1', 'cap2'][captionIndex], id = ['caption', 'caption2', 'caption3'][captionIndex];
        typedPicture(D, [VIEW[0] + 0.608, VIEW[1] + 0.132, 0.704, 0.148], cap, cap === 'cap3' ? 'Work right.' : cap === 'cap2' ? 'Move well.' : 'Look good.', repeated || begun(s, 'play', t) ? 1 : phase(s, id, t));
      }
    }
    tagEcho(D, 'clipA', echoStart);
  }
  CAPTIONS.forEach(([x, w], i) => {
    const p = i < 3 ? phase(s, ['caption', 'caption2', 'caption3'][i], t) : repeated >= i - 2 ? 1 : 0;
    if (p > 0) D.push({ ...on(i === 2 ? 'paper' : 'grey', 0.44 + x, 0.88, w * p, 0.09, { lift: 0.05, t: 0.02 }), echo: i < 3 ? ['caption', 'caption2', 'caption3'][i] : 'captions' });
  });
  if (begun(s, 'music', t)) {
    const echoStart = D.length;
    const p = handed(s, 'music', t), target = [0.45, 0.16, 3.88, 0.17], r = rectMix(BINS[3], target, p);
    if (!done(s, 'music', t)) { const pc = on('dark', ...r, { lift: 0.08, t: 0.02, art: 'wave' }); pc.where = 'travel'; pc.action = 'music'; D.push(pc); }
    else {
      D.push(on('dark', ...target, { lift: 0.05, t: 0.02 }));
      const duck = handed(s, 'duck', t), fade = handed(s, 'fade', t);
      const level = u => (1 - 0.5 * duck * (u > 0.08 && u < 0.87 ? 1 : 0)) * (u > 0.8 ? 1 - fade * Math.floor((u - 0.8) * 25) / 5 : 1);
      for (let i = 0; i < 64; i++) {
        const u = i / 64, h = (0.025 + Math.abs(Math.sin(i * 1.7) * Math.sin(i * 0.4)) * 0.11) * Math.max(0, level(u));
        D.push(on('paper', 0.46 + u * 3.84, 0.245 - h / 2, 0.025, h, { lift: 0.078, t: 0.004 }));
      }
      const points = [[0.45, 0.31], [0.76, 0.31], [1.02, mix(0.31, 0.245, duck)], [3.82, mix(0.31, 0.245, duck)], [4.33, mix(0.31, 0.16, fade)]];
      points.slice(1).forEach((b, i) => D.push(bar(points[i], b, { tone: 'paper', line: 0.009, lift: 0.09 })));
      points.forEach(([x, y]) => D.push(on('paper', x - 0.018, y - 0.018, 0.036, 0.036, { lift: 0.095, t: 0.004 })));
    }
    tagEcho(D, 'music', echoStart);
  }
  const headStart = D.length;
  if (begun(s, 'clipA', t)) D.push(on('red', 0.44 + at - 0.015, 0.13, 0.03, 0.95, { lift: 0.13, t: 0.01 }), on('red', 0.44 + at - 0.07, 1.01, 0.14, 0.1, { lift: 0.13, t: 0.02 }));
  tagEcho(D, 'clipA', headStart);
  D.forEach(pc => pc.document = true); P.push(...D);
  screensOut(P, t, s, ['playerWide', 'reel', 'feedSq']);
  P.clock = exported;
  return P;
}
// Building shows the whole work at its authored positions; only Play applies animation keys.
function constructedComp(P, rect, s, t, born, carets = true) {
  const draw = screenPainter(P, rect), norm = ([x, y, w, h]) => [x / 480, y / 270, w / 480, h / 270];
  if (born(0)) typedPicture(P, inRect(rect, norm([28, 62, 232, 62])), 'wMake', 'Make it', phase(s, 'make', t), { caret: carets });
  if (born(1)) typedPicture(P, inRect(rect, norm([28, 136, 168, 52])), 'wMove', 'move', phase(s, 'move', t), { colour: 'red', caret: carets });
  if (born(2)) {
    const p = handed(s, 'ball', t), pos = begun(s, 'path', t) ? quadratic(BALL_FROM, BALL_VIA, COMP_BALL, handed(s, 'path', t)) : BALL_FROM, r = COMP_BALL[2];
    draw('paper', norm([pos[0] - r, pos[1] - r, 2 * r * p, 2 * r * p]), 'redBall');
  }
  ROWS.forEach((r, i) => {
    if (!born(i + 3)) return;
    const p = i ? 1 : handed(s, 'row', t);
    if (!i && !done(s, 'row', t)) draw('ink', norm([r[0], r[1], r[2] * p, r[3] * p]));
    else draw('paper', norm(r), i ? 'rowB' : 'rowA');
  });
}
function editedMotion(t) {
  const P = [], D = [], s = SCRIPTS.ae;
  actionCursor(P, s, t);
  P.push(icon('transport', 2.04, 1.345, 0.5, 0.1), icon('ruler', 1.34, 1.01, W - 1.54, 0.06), icon('graphGrid', 3.74, 1.6, 0.95, 0.79));
  P.push(on('red', 0.15, 1.025, 0.18, 0.18, { lift: 0.05, t: 0.012 }), icon(P.tool === 'type' ? 'tType' : P.tool === 'ellipse' ? 'tCircle' : P.tool === 'rectangle' ? 'tRect' : 'tArrow', 0.17, 1.045, 0.14, 0.14, 'red', 0.065));
  if (!begun(s, 'comp', t)) return P;
  const born = i => i === 0 ? begun(s, 'make', t) : i === 1 ? begun(s, 'move', t) : i === 2 ? begun(s, 'ball', t) : i === 3 ? begun(s, 'row', t) : begun(s, 'copies', t) && phase(s, 'copies', t) * 2 >= i - 4;
  const selected = begun(s, 'select', t), exported = exportPlay(s, t), playing = begun(s, 'play', t) && !done(s, 'play', t), clock = exported ?? (playing ? phase(s, 'play', t) : null);
  const draw = screenPainter(D, VIEW);
  const thumb = [0.14, TOP - 0.5, 0.74, 0.416], thumbnail = screenPainter(D, thumb, 0.05, 0.015);
  if (clock === null) {
    cropPicture(echoPainter(draw, 'comp'), 'paper', [0, 0, 1, 1], undefined, eased(s, 'comp', t));
    thumbnail('paper', [0, 0, 1, 1]).echo = 'comp';
    constructedComp(D, VIEW, s, t, born);
    const echoStart = D.length;
    constructedComp(D, thumb, s, t, born, false); tagEcho(D, 'comp', echoStart);
  } else { animatedComp(draw, 3, clock); animatedComp(thumbnail, 3, clock); }
  ['red', 'grey', 'paper', 'grey'].forEach((tone, i) => {
    if (!born(i + 2)) return;
    const echoStart = D.length, y = TOP - 0.68 - i * 0.14;
    D.push(on(tone, 0.14, y, 0.08, 0.08, { lift: 0.05, t: 0.01 }), on(i ? 'dark' : 'grey', 0.28, y + 0.015, [0.5, 0.36, 0.44, 0.3][i], 0.05, { lift: 0.05, t: 0.01 }));
    tagEcho(D, ['ball', 'row', 'copies', 'copies'][i], echoStart);
  });
  if (selected) {
    const at = clock === null ? 1.6 : clock * 2.4, pos = clock === null ? quadratic(BALL_FROM, BALL_VIA, COMP_BALL, handed(s, 'path', t)) : quadratic(BALL_FROM, BALL_VIA, COMP_BALL, EASE.wipe(linear(at, ...LAYERS[2][5])));
    const [x, y] = compPoint(pos), half = (COMP_BALL[2] + 8) * VIEW[2] / 480;
    if (clock === null || at >= LAYERS[2][5][0]) {
      D.push(...outline(x - half, y - half, half * 2, half * 2, { line: 0.012 }));
      for (const dx of [-1, 1]) for (const dy of [-1, 1]) D.push(on('red', x + dx * half - 0.02, y + dy * half - 0.02, 0.04, 0.04, { lift: 0.09, t: 0.008, overlay: true }));
    }
    const n = begun(s, 'path', t) ? Math.floor(handed(s, 'path', t) * 12) : 0;
    for (let i = 1; i < Math.min(12, n + 1); i++) { const [px, py] = compPoint(quadratic(BALL_FROM, BALL_VIA, COMP_BALL, i / 12)), w = 60 * 0.056 * VIEW[2] / 480; D.push(on('dark', px - w / 2, py - w / 2, w, w, { lift: 0.086, t: 0.004 })); }
    const [sx, sy] = compPoint(BALL_FROM), w = 60 * 0.16 * VIEW[2] / 480;
    if (begun(s, 'stopwatch', t)) D.push(...outline(sx - w / 2, sy - w / 2, w, w, { tone: 'dark', line: 60 * 0.04 * VIEW[2] / 480 }));
  }
  // These handles describe EASE.wipe itself, so the graph and the ball's actual timing agree.
  const bend = handed(s, 'graph', t), g0 = [24, 176], g1 = [216, 24], h0 = rectMix([88, 176 - 152 / 3], [115.2, 176], bend), h1 = rectMix([152, 24 + 152 / 3], [38.4, 24], bend);
  if (done(s, 'path', t)) {
    const echoStart = D.length;
    for (let i = 0; i < 14; i++) D.push(bar(graphPoint(cubic(g0, h0, h1, g1, i / 14)), graphPoint(cubic(g0, h0, h1, g1, (i + 1) / 14)), { line: 0.95 * 6 / 240, lift: 0.057 }));
    for (const [a, b] of [[g0, h0], [g1, h1]]) { const end = graphPoint(b); D.push(bar(graphPoint(a), end, { tone: 'grey', line: 0.95 * 3 / 240, lift: 0.058 }), dot('grey', ...end, 0.95 * 6 / 240, { lift: 0.06, t: 0.004 })); }
    for (const [x, y] of [g0, g1].map(graphPoint)) D.push(on('paper', x - 0.95 * 8 / 240, y - 0.79 * 8 / 200, 0.95 * 16 / 240, 0.79 * 16 / 200, { lift: 0.065, t: 0.004 }));
    [0.5, 0.32].forEach((w, i) => D.push(on(i ? 'dark' : 'grey', 3.74, 1.47 - i * 0.09, w, 0.04, { lift: 0.05, t: 0.01 })));
    tagEcho(D, 'path', echoStart);
  }
  LAYERS.forEach(([kind, tone, name, from, len, keys], i) => {
    const echoStart = D.length;
    if (!born(i)) return;
    const y = 0.84 - i * 0.14, lit = selected && i === 2;
    if (lit) D.push(on('dark', 0.12, y - 0.02, W - 0.24, 0.13, { lift: 0.035, t: 0.006 }));
    D.push(on(tone, 0.17, y + 0.015, 0.06, 0.06, { lift: 0.05, t: 0.01 }), icon(kind, 0.28, y - 0.015, 0.12, 0.12, lit ? 'dark' : 'night', lit ? 0.042 : 0.051), on(lit ? 'paper' : 'grey', 0.46, y + 0.025, name, 0.04, { lift: 0.05, t: 0.01 }), on(lit ? 'grey' : 'dark', 1.34 + from, y, len, 0.09, { lift: 0.05, t: 0.012 }));
    // A stopwatch is a control; its first key is document content created on the click.
    if (i === 2) D.push(icon('tClock', 1.08, y, 0.1, 0.09));
    keys.forEach((key, j) => {
      const visible = i === 2 ? j === 0 ? begun(s, 'stopwatch', t) : done(s, 'path', t) : begun(s, 'keys', t) && phase(s, 'keys', t) * 5 >= (i < 2 ? i : i - 1);
      const position = i === 2 && j === 0 ? key * handed(s, 'staggerBall', t) : key;
      if (visible) D.push(icon(lit ? 'kfOn' : 'kf', 1.34 + position - 0.045, y, 0.09, 0.09, lit ? 'grey' : 'dark', 0.063));
    });
    tagEcho(D, ['make', 'move', 'ball', 'row', 'copies', 'copies'][i], echoStart);
  });
  const laneStart = D.length;
  const head = 1.34 + (clock !== null ? clock * 2.4 : begun(s, 'play', t) ? 1.6 : 1.45 * handed(s, 'head', t));
  D.push(on('red', head - 0.015, 0.13, 0.03, 0.95, { lift: 0.13, t: 0.01 }), on('red', head - 0.07, 1.01, 0.14, 0.1, { lift: 0.13, t: 0.02 }));
  if (begun(s, 'marquee', t) && !done(s, 'marquee', t)) { const p = handed(s, 'marquee', t); D.push(...outline(1.36, 0.93 - 0.8 * p, 2.1 * p, 0.8 * p, { line: 0.012 })); }
  if (begun(s, 'head', t)) tagEcho(D, 'head', laneStart);
  for (const pc of D.slice(laneStart)) pc.overlay = true;
  D.forEach(pc => pc.document = true); P.push(...D);
  screensOut(P, t, s, ['motWide', 'motTall', 'motSq']); P.clock = exported;
  return P;
}
// Reveal a rectangular part of a finished atlas picture at its original size and place.
function pictureRegion(P, rect, art, region, amount = 1) {
  if (amount <= 0) return;
  const [u, v, w, h] = region, r = inRect(rect, [u, v, w * amount, h]);
  P.push({ ...on('paper', ...r, { lift: 0.084, t: 0.004, art }), window: [u, v, u + w * amount, v + h] });
}
function drawnRegion(P, rect, art, region, p) {
  if (p <= 0) return;
  const [u, v, w, h] = region, r = inRect(rect, [u, v, w * p, h * p]);
  P.push({ ...on('paper', ...r, { lift: 0.09, t: 0.004, art }), window: [u, v, u + w * p, v + h * p] });
}
// A region's face may need its own depth slot, but its ink belongs to its page's plane. Moving along the view keeps the
// projected corners registered when separation raises that slot. The reference is the page's persistent face, not its layer count.
function registerPicture(pc, face) {
  pc.p[2] = ZF + face * U - pc.s[2];
  Object.defineProperty(pc, 'registered', { value: true, writable: true });
}
function drawnFrame(P, r, p, tone = 'paper') {
  if (p <= 0) return;
  const [x, y, w, h] = r, growing = [x, y + h * (1 - p), w * p, h * p];
  P.push(on(tone, ...growing, { lift: 0.06, t: 0.02 }));
}
// CORRECTIONS-12 I1: the document opens as a new InDesign document does, with its pages already there and nothing on them: the
// spread's two pages, then the cover, the post and the e-blast as plain pages with their edges. No empty frames, no crossed lines.
// Each picture is dragged straight onto its page. The spread's pages stay under what is placed on them. A single page's edges
// stop at its own picture's first contact (as the frames' outlines did) and its plate stays until the picture is placed on it.
function blankPages(D, s, t) {
  [ID.spread, ID.cover, ID.post, ID.mail].forEach((r, i) => {
    const id = ['map', 'photo', 'postPhoto', 'mailPhoto'][i], before = D.length;
    if (i === 0) {
      if (!done(s, 'spreadType', t)) for (const rect of [ID.left, ID.right]) D.push({ ...on('ink', ...rect, { lift: 0.06, t: 0.02 }), tones: FLYER.coal });
    }
    else if (!done(s, id, t)) {
      const [x, y, w, h] = r, line = 0.012, [from, to] = [[DOCK.photo, ID.photo], [ID.photo, ID.post], [ID.photo, ID.mailPhoto]][i - 1];
      D.push(on('night', x, y, w, h, { lift: 0.06, t: 0.02 }));
      if (!pageContact(s, id, t, from, to, r)) for (const edge of [[x, y, w, line], [x, y + h - line, w, line], [x, y, line, h], [x + w - line, y, line, h]]) D.push({ ...on('dark', ...edge, { lift: 0.075, t: 0.006 }), pageEdge: true });
    }
    for (const pc of D.slice(before)) pc.page = id;
  });
}
// Rectangles interpolate linearly in hand progress (HAND). Solve their first intersection with the page once in that space.
function pageContact(s, id, t, from, to, page) {
  if (!begun(s, id, t)) return false;
  let first = 0, last = 1;
  const pad = 0.03;
  const bounds = r => [r[0] + r[2] - page[0] + pad, page[0] + page[2] - r[0] + pad, r[1] + r[3] - page[1] + pad, page[1] + page[3] - r[1] + pad];
  const a = bounds(from), b = bounds(to);
  for (let i = 0; i < 4; i++) {
    const d = b[i] - a[i];
    if (Math.abs(d) < 1e-12) { if (a[i] <= 0) return false; }
    else if (d > 0) first = Math.max(first, -a[i] / d);
    else last = Math.min(last, -a[i] / d);
  }
  return first <= last && handed(s, id, t) >= first;
}
function editedFigma(t) {
  const P = [], D = [], s = SCRIPTS.fig;
  actionCursor(P, s, t);
  P.push(on('dark', 0.14, TOP - 0.4, 0.6, 0.012, { lift: 0.05, t: 0.006 }));
  P.push(on('dark', PANEL + 0.09, TOP - 0.2, 0.26, 0.05, { lift: 0.05, t: 0.01 }), on('paper', PANEL + 0.43, TOP - 0.2, 0.33, 0.05, { lift: 0.05, t: 0.01 }), on('red', PANEL + 0.43, TOP - 0.265, 0.33, 0.02, { lift: 0.05, t: 0.01 }));
  const tw = 1, tx = TOOL_X, tools = ['tArrow', 'tHash', 'tRect', 'tPen', 'tType', 'tChat'], lit = P.tool === 'frame' ? 1 : P.tool === 'rectangle' ? 2 : P.tool === 'type' ? 4 : 0;
  tools.forEach((art, i) => { const x = tx + 0.065 + i * 0.15; if (i === lit) P.push(on('red', x - 0.02, 0.165, 0.17, 0.17, { lift: 0.09, t: 0.012 })); P.push(icon(art, x, 0.185, 0.13, 0.13, i === lit ? 'red' : 'night', i === lit ? 0.103 : 0.091)); });
  const wireArts = ['wireWide', 'wireTablet', 'wireTall'];
  FIG.wires.forEach((r, i) => {
    if (done(s, 'frame' + i, t)) D.push({ ...on('grey', r[0], r[1] + r[3] + 0.015, i ? 0.17 : 0.26, 0.03, { lift: 0.05, t: 0.008 }), echo: 'frame' + i });
    if (done(s, 'details', t)) D.push({ ...on('paper', ...r, { lift: 0.06, t: 0.02, art: wireArts[i] }), echo: 'details' });
    else drawnFrame(D, r, handed(s, 'frame' + i, t));
    if (i === 0) {
      const box = inRect(r, HERO_REGION); if (!done(s, 'pictureBox', t)) drawnFrame(D, box, handed(s, 'pictureBox', t), 'grey');
      if (done(s, 'pictureBox', t)) pictureRegion(D, r, wireArts[i], HERO_REGION);
      if (begun(s, 'heading', t)) {
        const birth = D.length;
        const p = phase(s, 'heading', t), chars = Math.floor(p * 9) / 9;
        const regions = [[64 / 1440, 252 / 900, 300 / 1440, 76 / 900], [64 / 1440, 350 / 900, 420 / 1440, 76 / 900]];
        regions.forEach((region, j) => pictureRegion(D, r, wireArts[i], region, clamp(chars * 2 - j, 0, 1)));
        if (p < 1) { const j = chars < 0.5 ? 0 : 1, caret = inRect(r, regions[j]); D.push(on('grey', caret[0] + caret[2] * clamp(chars * 2 - j, 0, 1), caret[1], 0.012, caret[3], { lift: 0.095, t: 0.004, overlay: true })); }
        for (const pc of D.slice(birth)) { pc.text = { key: 'wireHeading', count: Math.floor(p * 9), total: 9, prefix: p < 1 }; if (pc.overlay) pc.caret = 'wireHeading'; }
      }
      const p = handed(s, 'button', t), button = inRect(r, [64 / 1440, 555 / 900, 380 / 1440, 35 / 900]); drawnFrame(D, button, p, 'grey');
      if (begun(s, 'details', t)) {
        const n = Math.floor(phase(s, 'details', t) * 9);
        [[0, 0, 1, 0.13], [0, 0.49, 0.46, 0.13], [0, 0.61, 0.46, 0.39]].forEach((region, j) => { if (n >= j) pictureRegion(D, r, wireArts[i], region); });
      }
    } else if (begun(s, 'details', t)) {
      const n = Math.floor(phase(s, 'details', t) * 9) - 3 - (i - 1) * 3;
      [[0, 0, 1, 0.18], [0, 0.18, 1, 0.40], [0, 0.58, 1, 0.42]].forEach((region, j) => { if (n >= j) pictureRegion(D, r, wireArts[i], region); });
    }
  });
  if (begun(s, 'marquee', t) && !done(s, 'copies', t)) {
    const a = topLeft(FIG.wires[0]), b = action(s, 'marquee').to, p = handed(s, 'marquee', t);
    D.push(...outline(a[0], a[1] + (b[1] - a[1]) * p, (b[0] - a[0]) * p, (a[1] - b[1]) * p, { line: 0.012 }));
  }
  const clock = exportPlay(s, t);
  FIG.designs.forEach((r, i) => {
    if (!begun(s, 'copies', t)) return;
    const p = handed(s, 'copies', t), place = rectMix(FIG.wires[i], r, p), suffix = ['Wide', 'Tablet', 'Tall'][i];
    let art = wireArts[i];
    if (begun(s, 'fill' + i, t)) art = 'uiBuild1' + suffix;
    if (done(s, 'hero', t)) art = 'uiBuild2' + suffix;
    if (done(s, 'name', t)) art = 'uiBuild3' + suffix;
    if (begun(s, 'accent' + i, t)) art = ['uiWide', 'uiTablet', 'uiTall'][i];
    const pc = on('ink', ...place, { lift: 0.06, t: 0.02, art });   // N2: one height, no arc
    if (!done(s, 'copies', t)) { pc.where = 'travel'; pc.action = 'copies'; }
    pc.echo = 'copies';
    if (clock === null) D.push(pc);
    if (done(s, 'copies', t)) D.push({ ...on('grey', r[0], r[1] + r[3] + 0.015, i ? 0.17 : 0.26, 0.03, { lift: 0.05, t: 0.008 }), echo: 'copies' });
    if (i === 0 && begun(s, 'name', t) && !done(s, 'name', t)) {
      const f = phase(s, 'name', t) * 14;
      typedPicture(D, inRect(r, [18 / 480, 74 / 300, 160 / 480, 38 / 300]), 'siteName0', 'Danial', clamp(f / 6, 0, 1), { tone: 'ink', colour: 'paper' });
      if (f >= 6) typedPicture(D, inRect(r, [18 / 480, 107 / 300, 160 / 480, 38 / 300]), 'siteName1', 'Endrawes', clamp((f - 6) / 8, 0, 1), { tone: 'ink', colour: 'paper' });
    }
    if (clock !== null) {
      const draw = screenPainter(D, r, 0.06, 0.02);
      prototype(draw, i, clock, false);
    }
  });
  for (const pc of D) if (pc.where !== 'travel') pc.canvas = true;
  if (!begun(s, 'hero', t)) P.push(on('ink', ...HERO_SOURCE, { lift: 0.07, t: 0.015, art: 'heroSource' }));
  else if (!done(s, 'hero', t)) dragPicture(D, s, 'hero', t, HERO_SOURCE, inRect(FIG.designs[0], HERO_REGION), 'heroSource');
  if (begun(s, 'hotspot', t)) {
    D.push(...outline(...FIG.spot, { line: 0.012 }), dot('red', ...FIG.from, 0.03, { lift: 0.085, t: 0.012, overlay: true }), dot('paper', ...FIG.from, 0.012, { lift: 0.097, t: 0.006, overlay: true }));
    const end = rectMix(FIG.from, FIG.to, handed(s, 'link', t)), reach = Math.min(0.16, Math.hypot(end[0] - FIG.from[0], end[1] - FIG.from[1]) / 3), along = p => cubic(FIG.from, [FIG.from[0] + reach, FIG.from[1]], [end[0] - reach, end[1]], end, p);
    if (begun(s, 'link', t)) for (let i = 0; i < 8; i++) D.push(bar(along(i / 8), along((i + 1) / 8)));
    if (done(s, 'link', t)) D.push(bar(FIG.to, [FIG.to[0] - 0.07, FIG.to[1] + 0.05]), bar(FIG.to, [FIG.to[0] - 0.07, FIG.to[1] - 0.05]));
    
  }
  for (const pc of D) if (pc.where !== 'travel') pc.canvas = true;
  const panelStart = D.length;
  const count = begun(s, 'panel', t) ? Math.min(5, 1 + Math.floor(phase(s, 'panel', t) * 5)) : 0, ly = TOP - 0.9;
  if (count > 0) D.push(on('red', PANEL + 0.09, TOP - 0.54, 0.15, 0.15, { lift: 0.05, t: 0.015 }), icon('pPlay', PANEL + 0.12, TOP - 0.51, 0.09, 0.09, 'red', 0.066), on('grey', PANEL + 0.31, TOP - 0.49, 0.4, 0.045, { lift: 0.05, t: 0.01 }));
  if (count > 1) { D.push(on('dark', PANEL + 0.06, ly, 0.73, 0.22, { lift: 0.04, t: 0.008 }), on('grey', PANEL + 0.11, ly + 0.09, 0.2, 0.045, { lift: 0.06, t: 0.01 }), on('paper', PANEL + 0.48, ly + 0.09, 0.26, 0.045, { lift: 0.06, t: 0.01 }), bar([PANEL + 0.35, ly + 0.112], [PANEL + 0.44, ly + 0.112], { line: 0.014, lift: 0.06 }), bar([PANEL + 0.44, ly + 0.112], [PANEL + 0.405, ly + 0.147], { line: 0.014, lift: 0.06 }), bar([PANEL + 0.44, ly + 0.112], [PANEL + 0.405, ly + 0.077], { line: 0.014, lift: 0.06 })); }
  if (count > 2) D.push(icon('interaction', PANEL + 0.09, 0.56, 0.67, 0.56));
  [0.5, 0.32].forEach((w, i) => { if (count > i + 3) D.push(on(i ? 'dark' : 'grey', PANEL + 0.09, 0.42 - i * 0.1, w, 0.045, { lift: 0.05, t: 0.01 })); });
  tagEcho(D, 'panel', panelStart);
  const treeStart = D.length;
  const layerCount = begun(s, 'details', t) ? Math.min(10, 3 + Math.floor(phase(s, 'details', t) * 7)) : FIG.wires.filter((_, i) => begun(s, 'frame' + i, t)).length;
  if (layerCount) [0.36, 0.26].forEach((w, i) => D.push(on(i ? 'dark' : 'grey', 0.17, TOP - 0.19 - i * 0.12, w, 0.05, { lift: 0.05, t: 0.01 })));
  TREE.slice(0, layerCount).forEach(([kind, set, len], i) => { const y = TOP - 0.58 - i * 0.145, x = 0.16 + set * 0.1, lit = i === 5 && begun(s, 'hotspot', t); if (lit) D.push(on('dark', 0.11, y - 0.025, 0.66, 0.13, { lift: 0.035, t: 0.006 })); D.push(icon(kind, x, y - 0.005, 0.09, 0.09, lit ? 'dark' : 'night', lit ? 0.042 : 0.051), on(lit ? 'paper' : 'grey', x + 0.13, y + 0.02, len, 0.04, { lift: 0.05, t: 0.01 })); });
  tagEcho(D, begun(s, 'details', t) ? 'details' : 'frame0', treeStart);
  for (const pc of D) if (pc.canvas && (pc.art || pc.paintLayer !== undefined) && !pc.overlay) registerPicture(pc, 0.08);
  D.forEach(pc => pc.document = true); P.push(...D);
  prototypeOut(P, t, s); P.clock = clock;
  return P;
}
function typePatch(P, rect, key, p, length = 21) {
  const n = Math.floor(clamp(p, 0, 1) * length), art = key + n, a = ART[art];
  P.push({ ...on('ink', ...rect, { lift: 0.09, t: 0.004, art }), text: { key, count: n, total: length, prefix: p < 1 } });
  if (p < 1) {
    const [x, y, h] = a.caret || [a.w * n / 21, 0, a.h];
    P.push({ ...on('paper', rect[0] + x / a.w * rect[2], rect[1] + (1 - (y + h) / a.h) * rect[3], 0.012, h / a.h * rect[3], { lift: 0.1, t: 0.004, overlay: true }), caret: key });
  }
}
function readBook(s, t) {
  if (!begun(s, 'pickup', t)) return -1;
  if (!done(s, 'pickup', t)) return -1 + phase(s, 'pickup', t);
  return ['leaf1', 'leaf2', 'leaf3', 'leaf4'].reduce((n, id) => n + eased(s, id, t), 0);
}
function editedInDesign(t, { at: pages } = {}) {
  const P = [], D = [], s = SCRIPTS.id;
  actionCursor(P, s, t);
  if (done(s, 'mailFlyer', t)) {
    // The approved finished document is also the destination of every construction region below.
    const final = approvedDocument();
    final.forEach(pc => { if (!pc.furniture) pc.document = true; if (pc.labelSource) registerPicture(pc, 0.080); else if (pc.art && !pc.furniture) Object.defineProperty(pc, 'registered', { value: true }); }); P.push(...final);
  } else {
    rail(P, ['tArrow', 'tType', 'tFrame', 'tRect', 'tLine', 'tDrop'], P.tool === 'frame' ? 2 : P.tool === 'type' ? 1 : P.tool === 'rectangle' ? 3 : 0);
    blankPages(D, s, t);
    if (done(s, 'spreadType', t)) {
      D.push({ ...on('ink', ...ID.left, { lift: 0.06, t: 0.02, art: 'kAmL' }), page: 'map' }, { ...on('ink', ...ID.right, { lift: 0.06, t: 0.02, art: 'kAmR' }), page: 'map' });
      finishedSpreadLayers(D);
    }
    else if (begun(s, 'map', t)) {
      const a = action(s, 'map'), window = [34 / 2200, 84 / 850, 2056 / 2200, 826 / 850];
      if (done(s, 'map', t)) D.push({ ...on('ink', ...ID.frame, { lift: 0.076, t: 0.004, art: 'kMap' }), window, placed: 'map' });
      else travel(P, 'map', DOCK.map, ID.frame, t, a.start, a.end, window, HAND);
      if (begun(s, 'heading', t)) typedPicture(D, inRect(ID.right, [970 / 1100, 180 / 850, 100 / 1100, 500 / 850]), 'idHeading', 'Amenities', phase(s, 'heading', t), { colour: FLYER.gold, direction: 'up' });
      if (begun(s, 'spreadType', t)) {
        const n = Math.floor(phase(s, 'spreadType', t) * 6);
        spreadPatches(D, n);
      }
    }
    // CORRECTIONS-15 N1: once placed, the map shows as it is, with no selection outline or handles.
    const tw = 0.36, th = tw * 340 / 440, mid = PANEL + 0.425;
    [[null, 'kCover'], ['kOfferL', 'kOfferR'], ['kLocL', 'kLocR'], ['kAmL', 'kAmR'], ['kGalL', 'kGalR'], ['kBack', null]].forEach(([left, right], i) => {
      const repeat = [1, 4, 5].indexOf(i);
      const visible = i === 0 ? done(s, 'coverTitle', t) : i === 2 ? done(s, 'loc', t) : i === 3 ? done(s, 'spreadType', t) : begun(s, 'pages', t) && phase(s, 'pages', t) * action(s, 'pages').count >= repeat;   // K2: one page per third of the run, however long it takes
      if (!visible) return;
      const echoStart = D.length, y = TOP - 0.13 - (i + 1) * th - i * 0.1;
      if (i === 3) D.push(on('red', mid - tw - 0.03, y - 0.03, tw * 2 + 0.06, th + 0.06, { lift: 0.05, t: 0.01 }));
      if (left) D.push(on('ink', mid - tw, y, tw, th, { lift: 0.065, t: 0.008, art: left }));
      if (right) D.push(on('ink', mid, y, tw, th, { lift: 0.065, t: 0.008, art: right }));
      tagEcho(D, ['coverTitle', 'pages', 'loc', 'spreadType', 'pages', 'pages'][i], echoStart);
    });
    if (begun(s, 'loc', t) && !done(s, 'loc', t)) { const a = action(s, 'loc'); travel(P, 'loc', DOCK.loc, ID.loc, t, a.start, a.end, undefined, HAND); }
    if (begun(s, 'photo', t) && !done(s, 'coverTitle', t)) {
      if (!done(s, 'photo', t)) dragPicture(P, s, 'photo', t, DOCK.photo, ID.photo, 'coverImage');
      if (done(s, 'photo', t)) {
        // Cropped regions keep the final photograph and woven ground at their approved measures.
        D.push(on('ink', ...ID.cover, { lift: 0.06, t: 0.02, art: begun(s, 'coverTitle', t) ? 'coverDecor' : done(s, 'blob', t) ? 'coverBlob' : 'coverPhoto' }));
        if (!done(s, 'blob', t)) drawnRegion(D, ID.cover, 'coverBlob', [50 / 1100, 482 / 850, 588 / 1100, 320 / 850], handed(s, 'blob', t));
        if (begun(s, 'coverTitle', t)) typePatch(D, inRect(ID.cover, [311.6 / 440, 268 / 340, 128.4 / 440, 52 / 340]), 'idCover', phase(s, 'coverTitle', t));
      }
    }
    if (done(s, 'coverTitle', t)) D.push(on('ink', ...ID.cover, { lift: 0.06, t: 0.02, art: 'kCover' }));
    for (const [key, rect, art, patch, region] of [
      ['post', ID.post, 'kPost', 'idPost', [276 / 400, 315.2 / 400, 124 / 400, 58.4 / 400]],
      ['mail', ID.mail, 'eblast', 'idMail', [17.6 / 320, 268 / 472, 284.8 / 320, 28 / 472]],
    ]) {
      if (!begun(s, key + 'Photo', t)) continue;
      if (done(s, key + 'Blob', t) && done(s, key === 'mail' ? 'mailFlyer' : 'postButton', t)) {
        D.push(on('ink', ...rect, { lift: 0.06, t: 0.02, art }));
        continue;
      }
      if (!done(s, key + 'Photo', t)) dragPicture(D, s, key + 'Photo', t, ID.photo, key === 'mail' ? ID.mailPhoto : rect, key + 'Image');
      if (done(s, key + 'Photo', t)) {
        D.push(on('ink', ...rect, { lift: 0.06, t: 0.02, art: key === 'post' ? 'postPhoto' : 'mailPhoto' }));
        if (begun(s, key + 'Title', t)) {
          if (key === 'post') typePatch(D, inRect(rect, region), patch, phase(s, key + 'Title', t));
          else mapTyping(D, rect, art, phase(s, key + 'Title', t), part => part.words !== 'View the flyer');
        }
        const blobRegion = key === 'post' ? [0.05, 0.61, 0.60, 0.31] : [44 / 800, 404 / 1180, 430 / 800, 230 / 1180];
        if (begun(s, key + 'Blob', t)) drawnRegion(D, rect, art, blobRegion, handed(s, key + 'Blob', t));
        if (begun(s, key + 'Button', t)) {
          const p = handed(s, key + 'Button', t), a = action(s, key + 'Button'), r = [a.from[0], a.to[1], a.to[0] - a.from[0], a.from[1] - a.to[1]];
          if (key === 'mail') drawnRegion(D, rect, 'mailButtonStyle', [44 / 800, 1040 / 1180, 262 / 800, 72 / 1180], p);
          else if (p > 0 && p < 1) D.push(...outline(r[0], r[1] + r[3] * (1 - p), r[2] * p, r[3] * p, { tone: 'grey', line: 0.01 }));
        }
        if (key === 'mail' && begun(s, 'mailFlyer', t)) typePatch(D, inRect(rect, [17.6 / 320, 416 / 472, 105 / 320, 29 / 472]), 'idFlyer', phase(s, 'mailFlyer', t), 14);
      }
    }
  }
  for (const pc of D) if (pc.art && pc.where !== 'travel') {
    const face = pc.p[0] > SCREEN.l + PANEL * U ? 0.073 : 0.080;
    registerPicture(pc, face);
  }
  for (const key of ['map', 'loc', 'photo']) if (!begun(s, key, t)) chip(P, key);
  D.forEach(pc => pc.document = true); P.push(...D);
  const floor = [], at = pages ?? readBook(s, t);
  prints(floor, at);
  bookletOut(P, s, t, floor);
  return P;
}
// InDesign: the ball becomes the booklet stack (with the copy that is read lying on top), the LinkedIn post's phone and the
// e-blast's tablet. The land, pickup, opening and leaf turns follow as before; on the sink the copy lying open goes down with them.
// floor: as prints() builds it: the stack's five copies (0-9), the phone (10, 11), the tablet (12, 13), then the copy that is
// read: on the stack (14, 15), or open (14 its right pages, 15 its left pages, 16 the leaf that landed on them).
function bookletOut(P, s, t, floor) {
  const formats = [[...floor.slice(0, 10), ...floor.slice(14)], floor.slice(10, 12), floor.slice(12, 14)].map(pieces => ({ pieces }));
  formats[0].shape = [...BLOCK_ROW.stack, COPIES * COPY, floor[0].e.slice()];
  formats[1].shape = lyingShape(floor[10]); formats[2].shape = lyingShape(floor[12]);
  exportOut(P, s, t, 'id', formats);
}
function mapRegion(P, rect, art, r, w, h, amount = 1, upward = false) {
  const [x, y, rw, rh] = r;
  if (upward) pictureRegion(P, rect, art, [x / w, (y + rh * (1 - amount)) / h, rw / w, rh * amount / h]);
  else pictureRegion(P, rect, art, [x / w, y / h, rw / w, rh / h], amount);
}
function mapTyping(P, rect, art, p, filter = () => true) {
  const a = ART[art], parts = (ART_TEXT[art] || []).filter(filter).sort((a, b) => a.region[1] - b.region[1] || a.region[0] - b.region[0]);
  let chars = Math.floor(parts.reduce((n, part) => n + part.words.length, 0) * clamp(p, 0, 1));
  for (const part of parts) {
    const count = Math.min(chars, part.words.length); chars -= count;

    // Atlas places span texel centres (0..size-1). Invert that same mapping for a cropped label, so its pixels sample exactly
    // where they do in the full map, including the half-texel inset. Using l/size here would shift a far-edge label by a pixel.
    const [l, top, r, bottom] = part.crop, u0 = l / (a.w - 1), v0 = top / (a.h - 1), u1 = (r - 1) / (a.w - 1), v1 = (bottom - 1) / (a.h - 1);
    if (u1 <= u0 || v1 <= v0) continue;
    const work = on('ink', ...inRect(rect, [u0, v0, u1 - u0, v1 - v0]), { lift: 0.084, t: 0.004, art: part.picture, cut: true });
    work.labelRegion = [u0, v0, u1, v1];
    work.labelSource = art;
    if (count < part.words.length) {
      const px = part.origin[0] + part.axis[0] * part.edges[count], py = part.origin[1] + part.axis[1] * part.edges[count], edge = mapPoint(rect, px, py, a.w, a.h);
      const normal = [part.axis[0] / a.w * rect[2], -part.axis[1] / a.h * rect[3]], len = Math.hypot(...normal), nx = normal[0] / len, ny = normal[1] / len;
      work.clip = [-nx, -ny, 0, nx * (SCREEN.l + edge[0] * U) + ny * (SCREEN.b + edge[1] * U)];
      const c0 = mapPoint(rect, px - part.down[0] * 0.8, py - part.down[1] * 0.8, a.w, a.h), c1 = mapPoint(rect, px + part.down[0] * 0.2, py + part.down[1] * 0.2, a.w, a.h), caret = bar(c0, c1, { tone: 'paper', line: 0.012, lift: 0.1 });
      if (/^#[\da-f]{6}$/i.test(part.colour)) caret.tones = [part.colour, part.colour, part.colour];
      caret.caret = art; P.push(caret);
    }
    work.text = { key: art, words: parts.map(part => part.words).join(' '), count: Math.floor(parts.reduce((n, part) => n + part.words.length, 0) * p), total: parts.reduce((n, part) => n + part.words.length, 0), prefix: p < 1 };
    P.push(work);
    if (count < part.words.length) break;
  }
}
function editedIllustrator(t) {
  const P = [], D = [], s = SCRIPTS.ai;
  actionCursor(P, s, t);
  rail(P, ['tArrow', 'tPen', 'tType', 'tRect', 'tCircle', 'tDrop'], P.tool === 'pen' ? 1 : P.tool === 'type' ? 2 : P.tool === 'rectangle' ? 3 : 0);
  [FLYER.gold, FLYER.lite, 'paper', FLYER.coal, FLYER.black, 'grey'].forEach((tone, i) => { const pc = on(typeof tone === 'string' ? tone : 'paper', PANEL + 0.09 + i % 3 * 0.235, TOP - 0.3 - Math.floor(i / 3) * 0.235, 0.2, 0.2, { lift: 0.05, t: 0.02 }); if (typeof tone !== 'string') pc.tones = tone; P.push(pc); });
  P.push(icon('aa', PANEL + 0.09, TOP - 1.06, 0.5, 0.34));
  const layerCount = begun(s, 'board0', t) ? begun(s, 'pins', t) ? 4 : begun(s, 'block', t) ? 3 : begun(s, 'street', t) ? 2 : 1 : 0;
  [0.67, 0.5, 0.6, 0.42].slice(0, layerCount).forEach((w, i) => D.push({ ...on(i ? 'dark' : 'grey', PANEL + 0.09, TOP - 1.4 - i * 0.2, w, 0.1, { lift: 0.05, t: 0.02 }), echo: ['board0', 'street', 'block', 'pins'][i] }));
  [AI.upper, AI.lower].forEach((r, i) => {
    const p = handed(s, 'board' + i, t), temp = []; drawnFrame(temp, r, p, 'ink'); temp.forEach(pc => { pc.tones = FLYER.coal; pc.p[2] -= 0.005 * U; }); D.push(...temp);
  });
  if (begun(s, 'mapExport', t)) { const a = action(s, 'mapExport'); travel(P, 'map', AI.upper, DOCK.map, t, a.start, a.end, undefined, HAND); }
  else {
    const draw = screenPainter(D, AI.upper); cropPicture(draw, 'ink', [0, 0, 1, 1], done(s, 'badge', t) ? 'kMap' : 'mapStreet', handed(s, 'street', t));
    if (begun(s, 'markers', t)) {
      const n = Math.min(AM_MARKERS.length, 1 + Math.floor(phase(s, 'markers', t) * AM_MARKERS.length));
      AM_MARKERS.slice(0, n).forEach(r => mapRegion(D, AI.upper, 'kMap', r, 2200, 850));
      mapRegion(D, AI.upper, 'kMap', [88, 90, 82, 96], 2200, 850);
    }
    if (begun(s, 'labels', t)) {
      const f = phase(s, 'labels', t) * AM_LABEL_BARS.length;
      AM_LABEL_BARS.forEach((r, i) => mapRegion(D, AI.upper, 'kMap', r, 2200, 850, Math.floor(clamp(f - i, 0, 1) * 8) / 8, true));
      mapTyping(D, AI.upper, 'kMap', phase(s, 'labels', t), p => !p.words.startsWith('King Street') && p.words !== 'N');
    }
    if (begun(s, 'title', t)) mapTyping(D, AI.upper, 'kMap', phase(s, 'title', t), p => p.words.startsWith('King Street'));
    if (begun(s, 'badge', t)) drawnRegion(D, AI.upper, 'kMap', [1273 / 2200, 457 / 850, 72 / 2200, 146 / 850], handed(s, 'badge', t));
  }
  if (begun(s, 'locExport', t)) { const a = action(s, 'locExport'); travel(P, 'loc', AI.lower, DOCK.loc, t, a.start, a.end, undefined, HAND); }
  else {
    if (begun(s, 'block', t)) {
      drawnRegion(D, AI.lower, 'locBlocks', [660 / 1352, 16 / 850, 62 / 1352, 68 / 850], handed(s, 'block', t));
    }
    if (begun(s, 'blocks', t)) { const n = Math.min(CITY_BLOCKS.length - 1, 1 + Math.floor(phase(s, 'blocks', t) * (CITY_BLOCKS.length - 1))); CITY_BLOCKS.slice(1, n + 1).forEach(r => mapRegion(D, AI.lower, 'locBlocks', r, 1352, 850)); }
    if (begun(s, 'streets', t)) cropPicture(screenPainter(D, AI.lower), 'ink', [0, 0, 1, 1], done(s, 'cityLabels', t) ? 'kLoc' : 'locStreets', handed(s, 'streets', t));
    if (begun(s, 'pins', t)) { const n = Math.min(CITY_PINS.length, 1 + Math.floor(phase(s, 'pins', t) * CITY_PINS.length)); CITY_PINS.slice(0, n).forEach(r => mapRegion(D, AI.lower, 'locPins', r, 1352, 850)); }
    if (begun(s, 'cityLabels', t)) mapTyping(D, AI.lower, 'kLoc', phase(s, 'cityLabels', t));
  }
  if (begun(s, 'marquee', t) && !begun(s, 'export', t)) {
    const p = handed(s, 'marquee', t), [x, y, w, h] = AI.frame;
    if (p > 0) D.push(...outline(x, y + h * (1 - p), w * p, h * p));
  }
  if (begun(s, 'close', t) && !done(s, 'closeBack', t)) {
    const p = begun(s, 'closeBack', t) ? 1 - eased(s, 'closeBack', t) : eased(s, 'close', t);
    D.push({ ...on('ink', ...rectMix(AI.frame, AI.close, p), { lift: 0.075 + 0.08 * Math.sin(Math.PI * p), t: 0.02, art: 'kLocClose' }), echo: 'marquee' });
  }
  if (begun(s, 'subway', t) && !begun(s, 'export', t)) {
    // The line is drawn to the cursor: the same fraction of the path's length.
    const [reached, part] = alongPath(action(s, 'subway').path, handed(s, 'subway', t));
    AI.segments.forEach(([a, b], i) => { const f = i < reached ? 1 : i === reached ? part : 0; if (f > 0) D.push(bar(AI.at(a), AI.at(rectMix(a, b, f)))); });
    if (done(s, 'subway', t)) {
      AI.subway.arms.slice(0, 2).forEach(([a, b]) => { const end = AI.at(b); D.push(bar(AI.at(a), end, { line: 0.012 }), dot('red', ...end, 0.026, { lift: 0.085, t: 0.012, overlay: true })); });
      const [sx, sy, sw, sh] = SPOT;
      AI.subway.knots.filter(([X, Y]) => X > sx && X < sx + sw && Y > sy && Y < sy + sh).forEach(p => D.push(handle(...AI.at(p))));
    }
  }
  for (const pc of D) if (pc.art && !pc.overlay && pc.art !== 'kLocClose') registerPicture(pc, 0.084);
  D.forEach(pc => pc.document = true); P.push(...D); chip(P, 'photo');
  return P;
}
export const SHOW = [
  { key: 'ps', app: 'ps', layout: 'design', craft: 0, len: SCRIPTS.ps.len, still: action(SCRIPTS.ps, 'export').start - 0.001 * PACE },
  { key: 'ai', app: 'ai', layout: 'design', craft: 0, len: SCRIPTS.ai.len, still: action(SCRIPTS.ai, 'export').start - 0.001 * PACE },
  { key: 'id', app: 'id', layout: 'design', craft: 0, len: SCRIPTS.id.len, still: action(SCRIPTS.id, 'leaf2').start + 0.6 * PACE * inverseWipe(0.82) },
  // CORRECTIONS-13: every device is built at land, so the held still keeps round 12's play frame (0.55 s into the plays, labels complete at 0.4).
  { key: 'pr', app: 'pr', layout: 'edit', craft: 1, len: SCRIPTS.pr.len, still: playbackSpans(SCRIPTS.pr).land + 0.550001 * PACE },
  { key: 'ae', app: 'ae', layout: 'edit', craft: 2, len: SCRIPTS.ae.len, still: playbackSpans(SCRIPTS.ae).land + 0.550001 * PACE },
  { key: 'fig', app: 'fig', layout: 'board', craft: 3, len: SCRIPTS.fig.len, still: playbackSpans(SCRIPTS.fig).land + 1.1 * PACE },
];
export const LOOP = SHOW.reduce((sum, scene) => sum + scene.len, 0);
const starts = SHOW.map((_, i) => SHOW.slice(0, i).reduce((sum, scene) => sum + scene.len, 0));
const builders = [editedPhoto, editedIllustrator, editedInDesign, editedVideo, editedMotion, editedFigma];
export function sceneAt(t) {
  if (!Number.isFinite(t)) throw new TypeError('time must be finite');
  let at = t % LOOP;
  if (at < 0) at += LOOP;
  for (let i = SHOW.length - 1; i >= 0; i--) if (at >= starts[i]) return { i, scene: SHOW[i], at: at - starts[i] };
}
function build(i, at, o) {
  stacks = { screenCount: 0, floorCount: 0 };
  const app = builders[i](at, o), P = shell(i, at, app.cursor || EXPORT, app.pressed, !!o.first && i === 0);
  P.clock = app.clock;
  P.action = app.action;
  P.pressed = app.pressed;
  P.tool = app.tool;
  const [a, b, c, d] = [0.5 * PACE, 0.8 * PACE, SHOW[i].len - 0.3 * PACE, SHOW[i].len], opening = at < b, closing = at >= c;
  const edge = SCREEN.l + W * U * (opening ? progress(at, a, b) : closing ? progress(at, c, d) : 1);
  for (const pc of app) {
    if (pc.s.some(v => v <= 0)) continue;
    if (pc.where === 'floor' || pc.where === 'travel') { P.push(pc); continue; }
    if (at <= a || at >= d) continue;
    pc.where = 'content';
    if (closing) pc.clip = [1, 0, 0, -edge];
    else if (opening) pc.clip = [-1, 0, 0, Math.min(edge, pc.clip?.[0] === -1 ? pc.clip[3] : Infinity)];
    else pc.clip ??= leftOf(W);
    P.push(pc);
  }
  // Opaque word pictures keep their approved front faces, but have no shaded side faces.
  for (const pc of P) if (pc.art === 'wMake' || pc.art === 'wMove') pc.cut = true;
  // G1 (round 8): the carried stack of the current drag (its travel pieces and the cursor) stays out of the page's own
  // separation, so nothing it passes over moves. The stack keeps the place it had before; any tie that leaves is cleared by
  // lifting the stack along the view, which does not move it on the page.
  const carried = carriedStack(P);
  if (o.withoutCarried) { for (const pc of carried) P.splice(P.indexOf(pc), 1); separateFaces(P); return P; }
  if (carried.length) {
    // The stack itself is placed exactly as before (with the whole page), so its own order and clearance are unchanged;
    // everything else is placed as if the stack were not there.
    const authored = P.map(pc => pc.p.slice());
    separateFaces(P);
    const placed = carried.map(pc => pc.p);
    P.forEach((pc, k) => { pc.p = authored[k]; });
    separateFaces(P.filter(pc => !carried.includes(pc)));
    // CORRECTIONS-15 N2: the carried pictures keep their authored height (one height from pickup to drop), so the page's
    // separation never moves them in the picture; clearCarried lifts them along the view instead. The cursor keeps its place.
    carried.forEach((pc, k) => { pc.p = pc.art === 'cursor' ? placed[k] : authored[P.indexOf(pc)]; });
  } else separateFaces(P);
  if (i === 2) liftDragStack(P);
  clearCarried(P, carried);
  // CORRECTIONS-15 S1: where the export's ball or blocks come in front of the cursor, the cursor stays in front, in depth only.
  const cursor = P.find(pc => pc.art === 'cursor'), solids = P.filter(pc => pc.solid);
  if (cursor && solids.length) {
    const near = Math.max(...solids.map(pc => dot3(HOME.v, pc.p) + Math.hypot(...pc.s))) - (dot3(HOME.v, cursor.p) - cursor.s[2]) + 0.05;
    if (near > 0) cursor.near = near;
  }
  return P;
}
// G1: with the stack out of the page's separation, a carried face may now sit level with a face it passes over. Lift the
// whole stack along the view (no move on the page) just enough to clear every such tie; nothing else moves.
// CORRECTIONS-15 N2: the carried pictures now keep one height, so the lift clears every face they overlap, not only near ties:
// each carried face ends at least one layer step above every face it passes over (the cursor goes up with them).
function clearCarried(P, stack) {
  if (!stack.length) return;
  const step = LAYER_STEP * U;
  const faces = list => list.filter(pc => pc.where !== 'floor').map(pc => {
    const points = corners(pc).filter((_, i) => i % 2 === 1), x = points.map(p => dot3(HOME.r, p)), y = points.map(p => dot3(HOME.u, p)), depth = points.map(p => dot3(HOME.v, p));
    return { top: Math.max(...depth), bottom: Math.min(...depth), r: [Math.min(...x), Math.min(...y), Math.max(...x), Math.max(...y)] };
  });
  const mine = faces(stack.filter(pc => pc.art !== 'cursor')), others = faces(P.filter(pc => !stack.includes(pc)));
  let rise = 0;
  for (const c of mine) for (const o of others) {
    if (!(c.r[0] < o.r[2] - 1e-9 && c.r[2] > o.r[0] + 1e-9 && c.r[1] < o.r[3] - 1e-9 && c.r[3] > o.r[1] + 1e-9)) continue;
    rise = Math.max(rise, o.top + step - c.bottom);
  }
  if (!(rise > 0)) return;
  const offset = HOME.v.map(n => n * rise);
  for (const pc of stack) { pc.shadowP ??= pc.p; pc.p = pc.p.map((n, axis) => n + offset[axis]); }
}
export function carriedStack(P) {
  const stack = P.action ? P.filter(pc => pc.where === 'travel' && pc.action === P.action) : [];
  const cursor = stack.length ? P.find(pc => pc.art === 'cursor') : null;
  return cursor ? [...stack, cursor] : stack;
}
// InDesign's carried faces and cursor keep their relative order. Moving toward the
// home camera clears crossed frames without changing any projected picture corner.
function liftDragStack(P) {
  if (!['map', 'loc', 'photo', 'postPhoto', 'mailPhoto'].includes(P.action)) return;
  const stack = P.filter(pc => pc.where === 'travel' && pc.action === P.action);
  if (!stack.length) return;
  const bounds = pc => {
    const points = corners(pc).map(p => [dot3(HOME.r, p), dot3(HOME.u, p)]);
    return [Math.min(...points.map(p => p[0])), Math.min(...points.map(p => p[1])), Math.max(...points.map(p => p[0])), Math.max(...points.map(p => p[1]))];
  };
  const rects = stack.map(bounds), cursor = P.find(pc => pc.art === 'cursor');
  const bottom = Math.min(...stack.map(pc => pc.p[2] - pc.s[2]));
  let rise = 0;
  for (const pc of P) {
    // The spread's selection guides may stay above the picture, as in the original.
    if (stack.includes(pc) || pc === cursor || pc.overlay) continue;
    const b = bounds(pc);
    if (rects.some(r => r[0] < b[2] && r[2] > b[0] && r[1] < b[3] && r[3] > b[1])) rise = Math.max(rise, pc.p[2] + pc.s[2] + LAYER_STEP * U - bottom);
  }
  // CORRECTIONS-7: the lifted cursor must not come to rest level with a guide it covers (a depth tie).
  // Raise the one shared offset until it clears them; the stack only rises further from what it covers.
  const flat = pc => { const points = corners(pc); return [Math.min(...points.map(p => p[0])), Math.min(...points.map(p => p[1])), Math.max(...points.map(p => p[0])), Math.max(...points.map(p => p[1]))]; };
  if (cursor) {
    const c = flat(cursor), top = cursor.p[2] + cursor.s[2];
    const covered = P.filter(pc => !stack.includes(pc) && pc !== cursor && pc.where !== 'floor').filter(pc => { const b = flat(pc); return c[0] < b[2] - 1e-9 && c[2] > b[0] + 1e-9 && c[1] < b[3] - 1e-9 && c[3] > b[1] + 1e-9; }).map(pc => pc.p[2] + pc.s[2]);
    for (let k = 0; k < covered.length; k++) {
      const tie = covered.filter(h => Math.abs(top + rise - h) < LAYER_STEP * U);
      if (!tie.length) break;
      rise = Math.max(...tie) + LAYER_STEP * U - top;
    }
  }
  const offset = HOME.v.map(n => n * rise / HOME.v[2]);
  for (const pc of [...stack, cursor]) {
    // Keep the authored shadow caster where it was; the lift only resolves colour depth.
    pc.shadowP = pc.p;
    pc.p = pc.p.map((n, axis) => n + offset[axis]);
  }
}
// Keep legacy plates clear too. Preserve their height order and move only faces that collide.
// Selections and cursors clear the tallest picture, even when several painters share its area.
function separateFaces(P) {
  for (const floor of [false, true]) {
    const axis = floor ? 1 : 2, across = floor ? 2 : 1, step = LAYER_STEP * (floor ? 1 : U);
    const faces = P.filter(pc => (pc.where === 'floor') === floor && !pc.solid && !pc.sink).flatMap(pc => {   // Sinks were separated before their independent translations.
      const [x, y, z, w] = pc.q, normal = floor ? 2 * (y * z - w * x) : 1 - 2 * (x * x + y * y);
      if (normal < 1 - 1e-9) return [];
      const points = corners(pc), xs = points.map(p => p[0]), ys = points.map(p => p[across]);
      return [{ pc, height: pc.p[axis] + pc.s[2] + (floor ? 0 : pc.depthSlot || 0) * step, rect: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] }];
    });
    const placed = [];
    const painted = new Map();
    for (const overlay of [false, true]) {
      const group = faces.filter(f => !!f.pc.overlay === overlay);
      const top = Math.max(-Infinity, ...placed.filter(f => f.pc.art || f.pc.paintLayer !== undefined).map(f => f.height));
      if (overlay) for (const f of group) f.height = Math.max(f.height, top + step + 2 * f.pc.s[2]);
      group.sort((a, b) => a.height - b.height);
      // Preserve paint order where independent painters overlap, without lifting disjoint viewers or devices.
      const paints = group.filter(f => f.pc.paintLayer !== undefined).sort((a, b) => a.pc.paintLayer - b.pc.paintLayer);
      let nextPaint = 0;
      for (let i = 0; i < group.length; i++) if (group[i].pc.paintLayer !== undefined) group[i] = paints[nextPaint++];
      for (const f of group) {
        if (!overlay && f.pc.paintLayer !== undefined) f.height = Math.max(f.height, (painted.get(f.pc.paintStack) ?? -Infinity) + step);
        const r = f.rect;
        for (const before of placed) {
          const b = before.rect;
          if (Math.min(r[2], b[2]) - Math.max(r[0], b[0]) > 1e-9 && Math.min(r[3], b[3]) - Math.max(r[1], b[1]) > 1e-9 && f.height - before.height < step) f.height = before.height + step;
        }
        const rise = f.height - f.pc.s[2] - f.pc.p[axis];
        if (!floor && f.pc.registered) { f.pc.p[0] += HOME.v[0] * rise / HOME.v[2]; f.pc.p[1] += HOME.v[1] * rise / HOME.v[2]; }
        f.pc.p[axis] += rise; placed.push(f);
        if (!overlay && f.pc.paintLayer !== undefined) painted.set(f.pc.paintStack, f.height);
      }
    }
  }
}
export function frameAt(t, o = {}) { const { i, at } = sceneAt(t); return build(i, at, o); }
export const SCENES = SHOW.map((scene, i) => (o = {}) => frameAt(starts[i] + scene.still, o));
export const CRAFT = SHOW.map(scene => scene.craft);

// Anchors use the emitted top faces, including the painter's clearance. No camera lives in this data.
export function calloutsAt(t) {
  const { scene, at } = sceneAt(t), key = scene.key;
  if (!['id', 'pr', 'ae', 'fig'].includes(key)) return [];
  const s = SCRIPTS[key], timing = playbackSpans(s), exp = action(s, 'export');
  const ends = timing.spans.map(() => timing.land);   // CORRECTIONS-15: all from the last piece's "become" end (Figma's lid open)
  const off = key === 'id' ? action(s, 'pickup').start : timing.off[0] - (key === 'fig' ? BALL.lid * PACE : 0);
  if (at < Math.min(...ends) - 1e-9 || at >= off - 1e-9) return [];
  const P = frameAt(t), floor = P.filter(pc => pc.where === 'floor');
  const words = { id: ['Flyer', 'LinkedIn post', 'Email'], pr: ['YouTube', 'TikTok', 'Instagram'], ae: ['Website', 'Story', 'Feed post'], fig: ['Laptop', 'Tablet', 'Phone'] }[key];
  const rects = key === 'id' ? [BLOCK_ROW.stack, BLOCK_ROW.phone, BLOCK_ROW.tablet] : key === 'fig' ? [null, [UI_ROW.tablet, MAT.z + UI_ROW.forward + UI_ROW.tabZ, UI_ROW.tabW, UI_ROW.tabD], [UI_ROW.phone, MAT.z + UI_ROW.forward + UI_ROW.phoneZ, UI_ROW.phoneW, UI_ROW.phoneD]] : [[MAT.x, MAT.z, WIDE, ROW], [MAT.x + WIDE + MAT.gap, MAT.z + ROW - SLIM_D, SLIM, SLIM_D], [MAT.x + WIDE + SLIM + 2 * MAT.gap, MAT.z + ROW - SLIM_D, SLIM, SLIM_D]];
  return words.flatMap((word, i) => {
    if (at < ends[i]) return [];
    let mark;
    if (key === 'fig' && i === 0) {
      const face = floor.find(pc => pc.lidPicture && pc.art === 'chromeLaptop');
      // Screen-local left is the low-x top corner; down is opposite lidV.
      const local = [-face.s[0] + 0.08, face.s[1] - 0.06, face.s[2]];
      mark = quatRotate(face.q, local).map((n, j) => n + face.p[j]);
    } else {
      const [x, z, w, d] = rects[i], px = i === 0 ? x + 0.1 : i === 1 ? x + w / 2 : x + w - 0.1, pz = i === 1 ? z + d - 0.06 : z + 0.1;
      const faces = floor.filter(pc => {
        if (key !== 'id' && (!pc.deviceBody || pc.device !== i)) return false;
        if (quatRotate(pc.q, [0, 0, 1])[1] < 1 - 1e-8) return false;
        const cs = corners(pc), xs = cs.map(p => p[0]), zs = cs.map(p => p[2]);
        return px >= Math.min(...xs) - 1e-8 && px <= Math.max(...xs) + 1e-8 && pz >= Math.min(...zs) - 1e-8 && pz <= Math.max(...zs) + 1e-8;
      });
      mark = [px, Math.max(...faces.map(pc => pc.p[1] + pc.s[2])), pz];
    }
    const growIn = progress(at, ends[i], ends[i] + 0.25 * PACE), textIn = growIn === 1 ? progress(at, ends[i] + 0.25 * PACE, ends[i] + 0.4 * PACE) : 0;
    // E4 (round 6): every label of the scene leaves together, as its entrance played backwards, ending at the old cut (off):
    // the word wipes back toward the line's end over off-0.30..off-0.20, then the line retracts into the mark until off.
    const growOut = progress(off - at, 0, 0.2 * PACE), textOut = progress(off - at, 0.2 * PACE, 0.3 * PACE);
    return [{ id: key + '-' + i, words: word, mark, side: i === 2 ? 'right' : 'left', level: i === 0 ? 'up' : 'low', grow: Math.min(growIn, growOut), text: Math.min(textIn, textOut) }];
  });
}
