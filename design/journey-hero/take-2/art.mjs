// Second take: the pictures. Everything flat that sits on a piece (words, the mark, a page layout, an icon) is drawn here with
// the 2D canvas into one atlas, which the renderer then maps onto pieces. Browser only (it needs Path2D and the page's fonts).

export const C = { ink: '#151314', paper: '#F7F6F3', red: '#C0262E', grey: '#B9B4AE', line: '#2E2B29', slate: '#706966', night: '#3B3735', dark: '#5A5552' };

// the DG mark, as it is drawn in the page header: two parts of the G, then the D. 1080 x 797.3.
const MARK_D = [
  "M1078.2 361.1L1068.7 361.1L967.5 361.1L947.1 361.1L931.6 361.1L780.5 361.1L780.5 503.8L911.6 503.8C871.7 591.1 783.6 651.7 681.4 651.7C541.4 651.7 427.6 537.3 428.3 397.3C428.4 375.9 431.2 355 436.3 335.2C436.7 333.8 436.6 332.5 436.2 331.2C418.1 281.3 380.7 240.7 333 218.4C329.7 216.9 325.7 218.3 324.1 221.6C297.6 274.9 282.7 335 282.7 398.6C282.7 618.9 462.7 798.2 683 797.3C902.4 796.4 1080 618.3 1080 398.6C1080 386 1079.4 373.4 1078.2 361.1Z",
  "M596.1 85.3C614.4 103.7 631 123.4 645.8 144.4C647.2 146.5 649.6 147.6 652.1 147.3C661.7 146.2 671.5 145.6 681.4 145.6C771.7 145.6 851 193 895.8 264.3L1024.1 195.1C954.6 78.3 827.1 0 681.4 0C631.9 0 584.6 9 540.9 25.5C535.8 27.4 534.9 34.2 539.3 37.3C559.4 51.6 578.4 67.6 596.1 85.3Z",
  "M368 712C345.6 689.7 325.9 665.3 309 639.1C307.5 636.7 304.6 635.6 301.9 636.2C284.9 639.9 267.3 641.9 249.2 641.9L184.1 641.9L184.1 155.4L247 155.4C382 155.4 493.7 265.9 492.5 401C492.3 422.2 489.3 442.9 484 462.5C483.7 463.8 483.7 465.2 484.1 466.5C505.9 529.7 557.3 579.2 621.7 598.5C624.7 599.4 627.9 598.1 629.5 595.4C662.5 537.3 681.4 470.1 681.4 398.4C681.2 177.9 500.7 0 280.2 0L0 0L0 797.3L282.7 797.3C332.1 797.3 379.5 788.3 423.2 771.8C428.2 769.9 429.1 763.1 424.7 760C404.6 745.7 385.7 729.7 368 712Z"
];
let MARK = null;
function mark(ctx, x, y, width, g = C.ink, d = C.red) {
  MARK = MARK || MARK_D.map(p => new Path2D(p));
  const k = width / 1080;
  ctx.save(); ctx.translate(x, y); ctx.scale(k, k);
  ctx.fillStyle = g; ctx.fill(MARK[0]); ctx.fill(MARK[1]); ctx.fillStyle = d; ctx.fill(MARK[2]);
  ctx.restore();
}
function text(ctx, s, x, y, px, { w = 800, fill = C.ink, align = 'left', track = -0.02 } = {}) {
  ctx.font = `${w} ${px}px Outfit, sans-serif`; ctx.fillStyle = fill; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${track * px}px`;
  ctx.fillText(s, x, y);
}
const fill = (ctx, c, x, y, w, h) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
const disc = (ctx, c, x, y, r) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
const lines = (ctx, c, x, y, widths, h = 8, gap = 12) => widths.forEach((w, i) => fill(ctx, c, x, y + i * (h + gap), w, h));
const stroke = (ctx, c, w) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineJoin = 'miter'; ctx.lineCap = 'butt'; };

// every picture: its size in px, and how to draw it. A picture with no background of its own is see-through there.
export const ART = {
  // ---- graphic design: one brand, rolled out
  logo: { w: 320, h: 320, draw(c, w, h) { fill(c, C.paper, 0, 0, w, h); mark(c, 55, 82, 210); } },
  guideL: { w: 352, h: 480, draw(c, w, h) {
    fill(c, C.ink, 0, 0, w, h); mark(c, 36, 40, 92, C.paper, C.red);
    text(c, 'Brand', 34, 356, 70, { fill: C.paper }); text(c, 'guide', 34, 424, 70, { fill: C.paper });
    fill(c, C.red, 36, 448, 60, 6);
  } },
  guideR: { w: 352, h: 480, draw(c, w, h) {
    fill(c, C.paper, 0, 0, w, h);
    text(c, 'Palette', 36, 54, 17, { w: 600, fill: C.slate, track: 0.02 });
    [[C.ink, '151314'], [C.red, 'C0262E'], [C.grey, 'B9B4AE']].forEach(([col, name], i) => { fill(c, col, 36 + i * 98, 70, 84, 84); text(c, name, 36 + i * 98, 172, 11, { w: 500, fill: C.slate, track: 0.04 }); });
    text(c, 'Type', 36, 226, 17, { w: 600, fill: C.slate, track: 0.02 });
    text(c, 'Aa', 28, 356, 150); text(c, 'Outfit', 216, 300, 22, { w: 600 }); lines(c, C.grey, 216, 318, [100, 76, 100], 6, 8);
    lines(c, C.grey, 36, 396, [280, 280, 190], 7, 11);
  } },
  flyerFront: { w: 352, h: 496, draw(c, w, h) {
    fill(c, C.red, 0, 0, w, h); disc(c, C.ink, 286, 150, 158);
    mark(c, 30, 32, 64, C.paper, C.ink);
    text(c, 'Look', 26, 366, 104, { fill: C.paper }); text(c, 'good.', 26, 456, 104, { fill: C.paper });
  } },
  flyerInL: { w: 352, h: 496, draw(c, w, h) {
    fill(c, C.paper, 0, 0, w, h); fill(c, C.ink, 30, 30, 292, 206); disc(c, C.red, 236, 133, 62); fill(c, C.paper, 52, 190, 96, 10); fill(c, C.grey, 52, 208, 60, 6);
    text(c, 'Move well.', 30, 290, 40); lines(c, C.grey, 30, 318, [292, 270, 292, 250, 292, 180], 7, 12);
    fill(c, C.red, 30, 446, 40, 5);
  } },
  flyerInR: { w: 352, h: 496, draw(c, w, h) {
    fill(c, C.paper, 0, 0, w, h); text(c, 'Work the way', 30, 76, 36); text(c, 'they should.', 30, 116, 36);
    lines(c, C.grey, 30, 146, [292, 292, 262, 292, 200], 7, 12);
    fill(c, C.red, 30, 262, 292, 160); disc(c, C.paper, 100, 342, 44); fill(c, C.ink, 168, 318, 124, 12); fill(c, C.ink, 168, 344, 90, 12); fill(c, C.paper, 168, 372, 60, 8);
    mark(c, 286, 446, 36);
  } },
  flyerBack: { w: 352, h: 496, draw(c, w, h) {
    fill(c, C.ink, 0, 0, w, h); mark(c, 126, 150, 100, C.paper, C.red);
    fill(c, C.red, 156, 258, 40, 5); lines(c, C.slate, 116, 404, [120], 6, 10); fill(c, C.slate, 136, 420, 80, 6); fill(c, C.slate, 126, 436, 100, 6);
  } },
  postArt: { w: 400, h: 400, draw(c, w, h) {
    fill(c, C.ink, 0, 0, w, h); disc(c, C.red, 286, 132, 104);
    text(c, 'Look', 28, 296, 92, { fill: C.paper }); text(c, 'good.', 28, 374, 92, { fill: C.paper });
    mark(c, 30, 30, 58, C.paper, C.red);
  } },
  post: { w: 300, h: 600, draw(c, w, h) {
    fill(c, C.paper, 0, 0, w, h);
    disc(c, C.red, 36, 50, 18); fill(c, C.ink, 64, 40, 92, 10); fill(c, C.grey, 64, 57, 60, 7); for (let i = 0; i < 3; i++) disc(c, C.slate, 262 + i * 9, 50, 2.6);
    c.save(); c.translate(0, 84); c.scale(0.75, 0.75); ART.postArt.draw(c, 400, 400); c.restore();
    // heart, comment, send
    c.fillStyle = C.red; c.beginPath(); c.moveTo(36, 432); c.bezierCurveTo(16, 418, 20, 400, 36, 408); c.bezierCurveTo(52, 400, 56, 418, 36, 432); c.fill();
    stroke(c, C.ink, 3.4); c.beginPath(); c.arc(80, 417, 11, 0, Math.PI * 2); c.stroke(); c.beginPath(); c.moveTo(112, 406); c.lineTo(136, 414); c.lineTo(118, 430); c.closePath(); c.stroke();
    fill(c, C.ink, 24, 452, 84, 9); lines(c, C.grey, 24, 474, [240, 170], 7, 10);
    fill(c, C.grey, 0, 540, w, 1.5); for (let i = 0; i < 4; i++) disc(c, i === 0 ? C.ink : C.grey, 48 + i * 68, 570, 9);
  } },
  // ---- the app's own furniture
  export: { w: 200, h: 64, draw(c, w, h) { text(c, 'Export', w / 2, 44, 36, { w: 600, fill: C.paper, align: 'center', track: 0 }); } },
  cursor: { w: 96, h: 96, tip: [10, 6], draw(c) {
    c.beginPath(); c.moveTo(10, 6); c.lineTo(10, 72); c.lineTo(27, 57); c.lineTo(39, 86); c.lineTo(52, 80); c.lineTo(40, 52); c.lineTo(62, 52); c.closePath();
    stroke(c, C.ink, 9); c.stroke(); c.fillStyle = C.paper; c.fill();
  } },
  aa: { w: 160, h: 110, draw(c, w, h) { text(c, 'Aa', 4, 92, 104, { fill: C.paper }); } },
  tArrow: { w: 64, h: 64, draw(c) { c.fillStyle = C.paper; c.beginPath(); c.moveTo(18, 8); c.lineTo(18, 50); c.lineTo(29, 40); c.lineTo(37, 57); c.lineTo(44, 54); c.lineTo(36, 37); c.lineTo(50, 37); c.closePath(); c.fill(); } },
  tPen: { w: 64, h: 64, draw(c) { c.fillStyle = C.paper; c.beginPath(); c.moveTo(32, 6); c.lineTo(48, 34); c.lineTo(38, 52); c.lineTo(26, 52); c.lineTo(16, 34); c.closePath(); c.fill(); fill(c, C.paper, 24, 55, 16, 5); disc(c, C.night, 32, 32, 5); } },
  tType: { w: 64, h: 64, draw(c) { fill(c, C.paper, 12, 10, 40, 9); fill(c, C.paper, 27, 10, 10, 46); } },
  tRect: { w: 64, h: 64, draw(c) { stroke(c, C.paper, 6); c.strokeRect(13, 13, 38, 38); } },
  tCircle: { w: 64, h: 64, draw(c) { stroke(c, C.paper, 6); c.beginPath(); c.arc(32, 32, 20, 0, Math.PI * 2); c.stroke(); } },
  tDrop: { w: 64, h: 64, draw(c) { stroke(c, C.paper, 8); c.beginPath(); c.moveTo(14, 50); c.lineTo(38, 26); c.stroke(); c.save(); c.translate(44, 20); c.rotate(Math.PI / 4); fill(c, C.paper, -9, -14, 18, 24); c.restore(); } },
};

// Lay every picture out in one canvas. Returns { canvas, places: { key: [x, y, w, h] as shares of the canvas } }.
// The page's fonts must be ready before this is called.
export function makeAtlas({ size = 2048, pad = 8, scale = 1 } = {}) {
  const canvas = document.createElement('canvas'); canvas.width = canvas.height = size;
  const ctx = canvas.getContext('2d'), places = {};
  let x = pad, y = pad, row = 0;
  for (const [key, a] of Object.entries(ART).sort((p, q) => q[1].h - p[1].h)) {
    const w = Math.round(a.w * scale), h = Math.round(a.h * scale);
    if (x + w + pad > size) { x = pad; y += row + pad; row = 0; }
    if (y + h + pad > size) throw new Error('the atlas is full at ' + key);
    ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale); ctx.beginPath(); ctx.rect(0, 0, a.w, a.h); ctx.clip(); a.draw(ctx, a.w, a.h); ctx.restore();
    places[key] = [(x + 0.5) / size, (y + 0.5) / size, (w - 1) / size, (h - 1) / size];
    x += w + pad; row = Math.max(row, h);
  }
  return { canvas, places };
}
export const fontsReady = () => Promise.all(['800 64px Outfit', '600 32px Outfit', '500 16px Outfit', '400 16px Outfit'].map(f => document.fonts.load(f)));
