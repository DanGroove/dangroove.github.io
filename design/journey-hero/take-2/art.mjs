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
function text(ctx, s, x, y, px, { w = 800, fill = C.ink, align = 'left', track = -0.02, family = 'Outfit, sans-serif' } = {}) {
  ctx.font = `${w} ${px}px ${family}`; ctx.fillStyle = fill; ctx.textAlign = align; ctx.textBaseline = 'alphabetic';
  if ('letterSpacing' in ctx) ctx.letterSpacing = `${track * px}px`;
  ctx.fillText(s, x, y);
}
const fill = (ctx, c, x, y, w, h) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };
const disc = (ctx, c, x, y, r) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); };
const lines = (ctx, c, x, y, widths, h = 8, gap = 12) => widths.forEach((w, i) => fill(ctx, c, x, y + i * (h + gap), w, h));
const stroke = (ctx, c, w) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.lineJoin = 'miter'; ctx.lineCap = 'butt'; };

// ---- footage: three shots, each drawn to fill any frame, so the wide, tall and square exports are the same shot reframed
function person(c, cx, base, k, col = C.ink) {          // a head and shoulders. k: half the width of the shoulders
  c.fillStyle = col; c.beginPath(); c.ellipse(cx, base, k, k * 0.95, 0, Math.PI, 0); c.fill(); disc(c, col, cx, base - k * 1.42, k * 0.46);
}
function caption(c, cx, y, px, words = 'Move well.') {   // a burned in caption: ink words on a paper bar
  c.font = `800 ${px}px Outfit, sans-serif`; if ('letterSpacing' in c) c.letterSpacing = `${-0.02 * px}px`;
  const w = c.measureText(words).width + px * 0.7;
  fill(c, C.paper, cx - w / 2, y - px * 0.98, w, px * 1.36); text(c, words, cx, y, px, { align: 'center' });
}
const SHOTS = {
  a(c, w, h, { k = h * 0.36, cx = w / 2, cap = true, capY = h * 0.84, capPx = h * 0.1 } = {}) {      // someone talking to the camera
    fill(c, C.red, 0, 0, w, h); fill(c, '#A31D25', w * 0.62, 0, w * 0.38, h); person(c, cx, h, k);
    if (cap) caption(c, w / 2, capY, capPx);
  },
  b(c, w, h) { fill(c, C.ink, 0, 0, w, h); disc(c, C.red, w * 0.68, h * 0.42, h * 0.24); fill(c, C.slate, 0, h * 0.68, w, h * 0.32); fill(c, C.grey, 0, h * 0.68, w, h * 0.04); },     // a sun over a horizon
  c(c, w, h) { fill(c, C.grey, 0, 0, w, h); [[0.08, 0.5, 0.2], [0.3, 0.25, 0.24], [0.58, 0.42, 0.16], [0.78, 0.6, 0.22]].forEach(([x, y, bw]) => fill(c, C.ink, w * x, h * y, w * bw, h)); disc(c, C.paper, w * 0.84, h * 0.22, h * 0.1); },   // buildings
};
const island = (c, w) => { c.fillStyle = C.ink; c.beginPath(); c.roundRect(w / 2 - 44, 12, 88, 24, 12); c.fill(); };      // the pill at the top of a phone's screen
const playIcon = (c, col, x, y, r) => { c.fillStyle = col; c.beginPath(); c.moveTo(x - r * 0.7, y - r); c.lineTo(x + r, y); c.lineTo(x - r * 0.7, y + r); c.closePath(); c.fill(); };
function heart(c, col, x, y, r) { c.fillStyle = col; c.beginPath(); c.moveTo(x, y + r); c.bezierCurveTo(x - r * 1.7, y - r * 0.1, x - r * 0.9, y - r * 1.3, x, y - r * 0.45); c.bezierCurveTo(x + r * 0.9, y - r * 1.3, x + r * 1.7, y - r * 0.1, x, y + r); c.fill(); }

// ---- Dan's 1 King Street W flyer for Lennard, drawn very simply: a 20 page landscape booklet in black, charcoal and two golds.
// No agent's name or contact details are drawn anywhere: Dan asked for them to be left out.
// Its faces are Georgia, Rockwell and Helvetica Neue. Gelasio and Rokkitt, open faces of the same build (./fonts), stand in for the first two.
// A page is drawn in hundredths of an inch, 1100 x 850, and scaled to whatever size its picture has.
const K = { black: '#030A12', weave: '#2B2C28', coal: '#262626', comb: '#4A4841', gold: '#A67A03', lite: '#D9AB2E', white: '#FFFFFF', soft: 'rgba(255,255,255,0.62)' };
const SERIF = 'Gelasio, Georgia, serif', SLAB = 'Rokkitt, Rockwell, serif', SANS = "'Helvetica Neue', Helvetica, Arial, 'Liberation Sans', sans-serif";
const page = draw => (c, w, h) => { c.scale(w / 1100, h / 850); draw(c); };
const lerp = (a, b, t) => a + (b - a) * t;
function quad(c, col, pts) { c.fillStyle = col; c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath(); c.fill(); }

// The covers' pattern: hexagons of upright lines, each with a V of slanted lines above it. R: half the height of a hexagon.
function weave(c, x, y, w, h, col = K.weave, R = 57) {
  const a = 3.2 * R, dx = a * 0.866, s = 0.24 * R, t = Math.tan(Math.PI / 6);
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip(); stroke(c, col, R * 0.07); c.beginPath();
  for (let i = -1; (i - 1) * dx < w; i++) for (let j = -1; (j - 1) * a < h; j++) {
    const cx = x + i * dx, cy = y + j * a + (i & 1 ? a / 2 : 0);
    for (let k = -3; k <= 3; k++) { const half = R - Math.abs(k) * s * t; c.moveTo(cx + k * s, cy - half); c.lineTo(cx + k * s, cy + half); }
    for (let k = 0; k < 6; k++) for (const d of [-1, 1]) { const y0 = cy - 1.1 * R - k * s; c.moveTo(cx + d * 0.04 * R, y0); c.lineTo(cx + d * 1.74 * R, y0 - R); }
  }
  c.stroke(); c.restore();
}
// a word set to a given cap height, then squeezed or stretched to a given width (so the logo keeps its shape in any serif)
function fit(c, s, x, base, width, cap, col, weight = 700, family = SERIF) {
  c.font = `${weight} ${cap / 0.692}px ${family}`; if ('letterSpacing' in c) c.letterSpacing = '0px';
  const k = width / c.measureText(s).width;
  c.save(); c.translate(x, base); c.scale(k, 1); c.fillStyle = col; c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillText(s, 0, 0); c.restore();
}
// The property's logo: a giant slab 1 behind KING, over Street W. x, y: its top left corner. w: its width; it is 0.54 w tall.
function kingLogo(c, x, y, w, shadow = false) {
  c.save();
  c.fillStyle = K.gold; c.fillRect(x + 0.131 * w, y, 0.116 * w, 0.5405 * w); c.fillRect(x, y + 0.417 * w, 0.3205 * w, 0.1235 * w);     // the 1: its stem and its foot,
  quad(c, K.gold, [[x + 0.131 * w, y], [x, y + 0.077 * w], [x, y + 0.181 * w], [x + 0.131 * w, y + 0.181 * w]]);                    // and its flag
  if (shadow) { const t = c.getTransform(), k = Math.hypot(t.a, t.b) * w; c.shadowColor = 'rgba(0,0,0,0.6)'; c.shadowBlur = 0.014 * k; c.shadowOffsetX = c.shadowOffsetY = 0.008 * k; }
  fit(c, 'KING', x + 0.131 * w, y + 0.3166 * w, 0.869 * w, 0.22 * w, K.lite);
  fit(c, 'Street W', x + 0.131 * w, y + 0.506 * w, 0.869 * w, 0.154 * w, K.lite, 400);
  c.restore();
}
// the flyer's tab: a gold block with one big rounded corner, a white keyline, and two lines of words
function tab(c, x, y, w, h, r, small, big) {
  c.fillStyle = K.gold; c.beginPath(); c.roundRect(x, y, w, h, [r, 0, 0, 0]); c.fill(); stroke(c, K.white, h * 0.024); c.stroke();
  text(c, small, x + h * 0.27, y + h * 0.44, h * 0.27, { w: 300, fill: K.white, track: 0, family: SANS }); text(c, big, x + h * 0.27, y + h * 0.8, h * 0.27, { w: 700, fill: K.white, track: 0, family: SANS });
}

// The photograph every piece uses: the stone building on its corner, seen from the street, with glass towers behind it.
// It fills a box of any shape: the building's corner stands at `at` of the box's width, and everything is sized by the box's height.
// zoom and drop reframe it. raw: as it came off the camera on a flat grey day, which is what Photoshop starts from.
function panes(c, col, [tl, tr, br, bl], cols, rows, { u0 = 0.06, u1 = 0.96, v0 = 0.05, v1 = 0.95, fw = 0.55, fh = 0.6 } = {}) {   // the windows of a face seen at an angle
  const at = (u, v) => [lerp(lerp(tl[0], tr[0], u), lerp(bl[0], br[0], u), v), lerp(lerp(tl[1], tr[1], u), lerp(bl[1], br[1], u), v)];
  c.fillStyle = col; c.beginPath();
  for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
    const ua = lerp(u0, u1, i / cols), ub = lerp(u0, u1, (i + fw) / cols), va = lerp(v0, v1, j / rows), vb = lerp(v0, v1, (j + fh) / rows);
    [at(ua, va), at(ub, va), at(ub, vb), at(ua, vb)].forEach(([x, y], n) => (n ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath();
  }
  c.fill();
}
const LOOK = {
  graded: { sky: ['#6E9CD6', '#D9E6F1'], lit: '#EFE4CC', shade: '#C2B394', win: '#473D31', far: '#D9CDB5', glass: '#86A9C8', glass2: '#C6DAEA', dark: '#2B363F', dark2: '#566673', slab: '#8F8C84', road: '#47484C', kerb: '#6A6B6F', mark: '#ECECE8', car: '#F4F4F0', tram: '#C2332B', lamp: '#EDB816' },
  raw: { sky: ['#B5B9BB', '#D2D3D1'], lit: '#D1CDC2', shade: '#AFAA9F', win: '#65625C', far: '#C2BDB2', glass: '#9FA8AD', glass2: '#BDC4C7', dark: '#555A5E', dark2: '#72787B', slab: '#96948F', road: '#6F6F6E', kerb: '#838382', mark: '#C4C4C0', car: '#D6D6D2', tram: '#9A6B66', lamp: '#B49F52' },
};
function street(c, x, y, w, h, { at = 0.45, raw = false, zoom = 1, drop = 0 } = {}) {
  const T = raw ? LOOK.raw : LOOK.graded;
  c.save(); c.beginPath(); c.rect(x, y, w, h); c.clip();
  const sky = c.createLinearGradient(0, y, 0, y + h * 0.72); sky.addColorStop(0, T.sky[0]); sky.addColorStop(1, T.sky[1]); c.fillStyle = sky; c.fillRect(x, y, w, h);
  c.translate(x + w * at, y + h * drop); c.scale(h * zoom, h * zoom);      // from here 1 is the box's height, and x counts from the building's corner
  const face = (col, pts, win, cols, rows, o) => { quad(c, col, pts); if (win) panes(c, win, pts, cols, rows, o); };
  face(T.glass, [[-0.15, -1], [0.08, -1], [0.1, 0.5], [-0.17, 0.5]], T.glass2, 1, 50, { u0: 0, u1: 1, fw: 1, fh: 0.36 });                    // the glass tower behind
  face(T.dark, [[-1.6, -1], [-0.5, -1], [-0.46, 0.72], [-1.6, 0.72]], T.dark2, 14, 26, { fw: 0.7 });                                          // dark glass, far left
  face(T.shade, [[-0.47, 0.42], [-0.2, 0.36], [-0.2, 0.66], [-0.47, 0.67]], T.win, 5, 6);                                                     // further down the street
  face(T.far, [[0.33, -1], [0.5, -1], [0.5, 0.4], [0.33, 0.4]], T.win, 4, 30, { fw: 0.4 });                                                   // a stone tower, far right
  face(T.dark, [[0.44, -1], [2, -1], [2, 0.5], [0.44, 0.3]], T.dark2, 9, 9, { fw: 0.8, fh: 0.8 });                                            // dark glass, near right
  face(T.dark, [[0.215, 0.13], [0.36, 0.17], [0.36, 0.62], [0.215, 0.62]], T.dark2, 4, 12);
  face(T.slab, [[0.2, 0.415], [2, 0.16], [2, 0.76], [0.2, 0.67]], T.glass, 8, 2, { v0: 0.24, v1: 0.98, fw: 0.86, fh: 0.84 });                 // the low block beside it
  const right = [[0, 0.043], [0.21, 0.118], [0.21, 0.7], [0, 0.685]], left = [[-0.2, 0.3], [0, 0.043], [0, 0.685], [-0.2, 0.645]];           // the building itself: its lit face and its shaded one
  face(T.lit, right, T.win, 5, 12, { v0: 0.07, v1: 0.74 }); panes(c, T.win, right, 3, 1, { v0: 0.81, v1: 0.975, fw: 0.62, fh: 1 });
  face(T.shade, left, T.win, 6, 12, { v0: 0.07, v1: 0.74 }); panes(c, T.win, left, 4, 1, { v0: 0.82, v1: 0.975, fw: 0.6, fh: 1 });
  quad(c, T.kerb, [[-3, 0.63], [0, 0.68], [3, 0.72], [3, 0.75], [0, 0.705], [-3, 0.66]]);                                                     // the pavement, then the road
  quad(c, T.road, [[-3, 0.66], [0, 0.705], [3, 0.75], [3, 3], [-3, 3]]);
  [[0.3, 0.86], [0.46, 0.9], [0.62, 0.94]].forEach(([mx, my]) => quad(c, T.mark, [[mx, my], [mx + 0.3, my - 0.035], [mx + 0.32, my - 0.02], [mx + 0.02, my + 0.015]]));
  c.fillStyle = T.tram; c.fillRect(0.31, 0.672, 0.11, 0.034);
  c.fillStyle = T.car; c.beginPath(); c.roundRect(0.055, 0.705, 0.18, 0.062, 0.012); c.fill(); c.fillStyle = T.dark; c.fillRect(0.075, 0.713, 0.075, 0.022);
  disc(c, T.dark, 0.092, 0.768, 0.017); disc(c, T.dark, 0.198, 0.768, 0.017);
  c.fillStyle = T.lamp; c.fillRect(-0.236, 0.462, 0.03, 0.066); c.fillRect(0.148, 0.508, 0.018, 0.042);
  c.restore();
}

// the covers' left side: black, with the pattern, fading into the photograph between x0 and x1
function fadeIn(c, x0, x1, h, R = 57) {
  fill(c, K.black, 0, 0, x0 + 2, h);
  const g = c.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, K.black); g.addColorStop(1, 'rgba(3,10,18,0)'); c.fillStyle = g; c.fillRect(x0, 0, x1 - x0, h);
  const ink = c.createLinearGradient(x0, 0, x1, 0); ink.addColorStop(0, K.weave); ink.addColorStop(0.45, 'rgba(120,120,112,0.5)'); ink.addColorStop(1, 'rgba(190,190,180,0)');
  weave(c, 0, 0, x1, h, ink, R);
}
// The first gallery spread: photographs with charcoal gutters between them and the room's name on a block, across the fold. off: where this page starts.
const GALLERY = [[0, 0, 345, 245], [0, 255, 345, 325], [357, 0, 567, 363], [357, 372, 567, 212], [0, 595, 922, 255], [935, 0, 578, 248], [935, 258, 357, 250], [935, 517, 357, 333], [1525, 0, 363, 248], [1900, 0, 300, 367], [1900, 378, 300, 245], [1303, 635, 443, 215], [1758, 635, 442, 215]];
function gallery(c, off) {
  c.save(); c.translate(-off, 0);
  GALLERY.forEach(([x, y, w, h], i) => (i === 1 ? street(c, x, y, w, h, { at: 0.55 }) : room(c, x, y, w, h, i)));
  weave(c, 1303, 258, 585, 367, '#30302E', 40);
  text(c, 'Main', 1333, 450, 190, { w: 800, fill: K.gold, track: 0, family: SLAB }); text(c, 'Lobby', 1442, 530, 133, { w: 700, fill: K.lite, track: 0, family: SERIF });
  c.restore();
}

// what the inside pages share
const lennard = (c, col = K.lite) => text(c, 'Lennard:', 50, 72, 32, { w: 700, fill: col, track: 0, family: SERIF });
function folio(c, x, n) { fill(c, K.gold, x, 800, 44, 50); text(c, n, x + 22, 833, 20, { w: 800, fill: K.white, align: 'center', track: 0, family: SANS }); }
function upTitle(c, words) { c.save(); c.translate(1052, 672); c.rotate(-Math.PI / 2); text(c, words, 0, 0, 80, { w: 700, fill: K.gold, track: 0, family: SERIF }); c.restore(); }   // a section's title, reading upward at the page's edge
function heading(c, words, x, base, rows = 1) { fill(c, K.gold, x, base - 36, 4, 36 + (rows - 1) * 50); text(c, words, x + 24, base, 50, { w: 700, fill: K.white, track: 0.01, family: SERIF }); }
function pins(c, off) {                                        // the row of pins along the top of The Offering, which runs across the fold
  for (let i = 0; i < 23; i++) {
    const x = 288 + i * 72 - off;
    stroke(c, i % 2 ? K.lite : K.gold, 6); c.beginPath(); c.moveTo(x - 8, -8); c.lineTo(x + 64, 59); c.stroke();
    if (i % 2) { c.beginPath(); c.arc(x + 72, 66, 9, 0, Math.PI * 2); c.stroke(); } else disc(c, K.gold, x + 72, 66, 11);
  }
}
function gIcon(c, kind, x, y) {                                // the gold icons of the offering table, each 48 across. x, y: its middle
  stroke(c, K.lite, 5); c.fillStyle = K.lite;
  if (kind === 0) { c.strokeRect(x - 20, y - 20, 40, 40); c.beginPath(); c.moveTo(x - 20, y - 20); c.lineTo(x + 20, y + 20); c.moveTo(x + 20, y - 20); c.lineTo(x - 20, y + 20); c.stroke(); }
  else if (kind === 1) text(c, '$', x, y + 24, 70, { w: 700, fill: K.lite, align: 'center', track: 0, family: SERIF });
  else if (kind === 2) { c.beginPath(); c.roundRect(x - 18, y - 22, 36, 44, 6); c.stroke(); fill(c, K.lite, x - 9, y - 10, 18, 5); fill(c, K.lite, x - 9, y + 2, 18, 5); }
  else { c.beginPath(); c.roundRect(x - 24, y - 4, 48, 20, 6); c.fill(); quad(c, K.lite, [[x - 15, y - 4], [x - 9, y - 18], [x + 9, y - 18], [x + 15, y - 4]]); disc(c, K.coal, x - 13, y + 16, 6); disc(c, K.coal, x + 13, y + 16, 6); }
}
// a stand-in for one gallery photograph: a room with a wall, a floor and a window's light
const ROOMS = [['#9A6A3C', '#5F4630', '#E9D9B8'], ['#DAD3C6', '#8E8A84', '#F6F1E6'], ['#C9B58A', '#7B6A50', '#F1E3C0'], ['#B9C69A', '#7A6248', '#F3F1E4'], ['#A7AFB8', '#5F6468', '#E8EEF2'], ['#7C5433', '#4B3523', '#DFC79B'], ['#E6E0D4', '#A39A8C', '#FFFFFF'], ['#8D99A6', '#4D545B', '#DDE6EE']];
function room(c, x, y, w, h, i) { const [wall, floor, light] = ROOMS[i % 8]; fill(c, wall, x, y, w, h); fill(c, floor, x, y + h * 0.64, w, h * 0.36); fill(c, light, x + w * 0.14, y + h * 0.14, w * 0.3, h * 0.36); fill(c, light, x + w * 0.56, y + h * 0.14, w * 0.2, h * 0.36); }
// The Location spread's map, which runs across the fold. off: where this page starts.
function cityMap(c, off) {
  c.save(); c.translate(-off, 0); c.beginPath(); c.rect(0, 0, 1352, 850); c.clip();
  fill(c, K.coal, 0, 0, 1352, 850); stroke(c, K.black, 16); c.beginPath();
  [70, 175, 280, 367, 440, 513, 640, 740].forEach(y => { c.moveTo(0, y); c.lineTo(1352, y); }); [130, 255, 400, 545, 690, 870, 1110, 1280].forEach(x => { c.moveTo(x, 0); c.lineTo(x, 850); }); c.stroke();
  fill(c, K.gold, 0, 173, 1352, 4); fill(c, K.gold, 0, 365, 1352, 4);                                    // Queen Street and King Street
  stroke(c, K.gold, 4); c.beginPath(); c.moveTo(125, 0); c.lineTo(125, 800); c.lineTo(640, 820); c.lineTo(775, 783); c.lineTo(775, 540); c.stroke();
  fill(c, '#12827C', 0, 568, 1352, 14); fill(c, '#E8862E', 0, 582, 650, 10);                              // the GO line, and the airport train under it
  [[640, 100, 90, 40], [770, 55, 90, 40], [155, 595, 70, 40], [245, 600, 60, 66], [650, 548, 86, 62], [670, 632, 86, 30]].forEach(([mx, my, mw, mh]) => { c.fillStyle = K.gold; c.beginPath(); c.roundRect(mx, my, mw, mh, 6); c.fill(); });
  c.fillStyle = K.black; c.beginPath(); c.roundRect(795, 498, 118, 60, 30); c.fill(); stroke(c, K.lite, 5); c.stroke(); kingLogo(c, 822, 510, 68);
  c.restore();
}

// every picture: its size in px, and how to draw it. A picture with no background of its own is see-through there.
export const ART = {
  // ---- graphic design: one brand, rolled out
  guideL: { w: 352, h: 496, draw(c, w, h) {            // the mark on its construction grid, and the three ways it is set
    fill(c, C.paper, 0, 0, w, h); text(c, 'Logo', 30, 46, 17, { w: 600, fill: C.slate, track: 0.02 });
    [92, 168, 244].forEach(y => fill(c, C.grey, 30, y, 292, 1.5)); [61, 176, 291].forEach(x => fill(c, C.grey, x, 66, 1.5, 204));
    mark(c, 61, 83, 230);
    [[C.ink, C.paper, C.red], [C.red, C.paper, C.ink], [C.grey, C.ink, C.red]].forEach(([bg, g, d], i) => { fill(c, bg, 30 + i * 101, 316, 90, 90); mark(c, 45 + i * 101, 339, 60, g, d); });
    lines(c, C.grey, 30, 430, [292, 230], 7, 11);
  } },
  guideR: { w: 352, h: 496, draw(c, w, h) {            // the palette and the typeface
    fill(c, C.paper, 0, 0, w, h);
    text(c, 'Palette', 30, 46, 17, { w: 600, fill: C.slate, track: 0.02 });
    [[C.ink, '151314'], [C.red, 'C0262E'], [C.grey, 'B9B4AE']].forEach(([col, name], i) => { fill(c, col, 30 + i * 101, 62, 90, 90); text(c, name, 30 + i * 101, 170, 11, { w: 500, fill: C.slate, track: 0.04 }); });
    text(c, 'Type', 30, 226, 17, { w: 600, fill: C.slate, track: 0.02 });
    text(c, 'Aa', 22, 366, 160); text(c, 'Outfit', 222, 300, 24, { w: 600 }); lines(c, C.grey, 222, 320, [100, 76, 100], 6, 8);
    lines(c, C.grey, 30, 410, [292, 292, 190], 7, 11);
  } },
  // ---- the building's photograph, before and after its edit in Photoshop, and that app's own bits
  kPhotoB: { w: 396, h: 360, draw(c, w, h) { street(c, 0, 0, w, h, { at: 0.42, raw: true }); } },
  kPhoto: { w: 396, h: 360, draw(c, w, h) { street(c, 0, 0, w, h, { at: 0.42 }); } },
  eye: { w: 48, h: 48, draw(c) { c.fillStyle = C.grey; c.beginPath(); c.ellipse(24, 24, 19, 11, 0, 0, Math.PI * 2); c.fill(); disc(c, C.night, 24, 24, 6); } },
  histo: { w: 160, h: 64, draw(c, w, h) { c.fillStyle = C.grey; c.beginPath(); c.moveTo(0, h); [[0, 52], [18, 44], [34, 20], [50, 34], [70, 8], [92, 30], [112, 22], [132, 46], [160, 54]].forEach(([x, y]) => c.lineTo(x, y)); c.lineTo(w, h); c.closePath(); c.fill(); } },
  // ---- the 1 King Street W booklet: its front cover and The Offering at full size, and three more pages small, for the pages panel
  kCover: { w: 440, h: 340, draw: page(c => {
    street(c, 380, 0, 720, 850, { at: 0.47 }); fadeIn(c, 380, 650, 850);
    lennard(c); kingLogo(c, 50, 482, 588, true); tab(c, 779, 670, 330, 130, 45, 'Office Space', 'For Sale');
  }) },
  kOfferL: { w: 440, h: 340, draw: page(c => {
    fill(c, K.coal, 0, 0, 1100, 850); pins(c, 0); lennard(c);
    heading(c, 'Property Summary', 50, 166); text(c, 'One King West: Premier Office Destination', 50, 221, 25, { w: 700, fill: K.lite, track: 0, family: SANS });
    lines(c, K.soft, 50, 247, [560, 548, 556, 562, 550, 562, 520, 270], 7, 22); lines(c, K.soft, 50, 491, [540, 480, 556, 552, 548, 556, 530, 548, 510, 350], 7, 22);
    const frame = () => { c.beginPath(); c.roundRect(659, 204, 388, 700, [0, 172, 0, 0]); };          // the photograph's frame: one big rounded corner, running off the foot of the page
    c.save(); frame(); c.clip(); street(c, 659, 204, 388, 646, { at: 0.5 }); c.restore(); stroke(c, K.gold, 7); frame(); c.stroke();
    folio(c, 50, '1');
  }) },
  kOfferR: { w: 440, h: 340, draw: page(c => {
    fill(c, K.coal, 0, 0, 1100, 850); pins(c, 1100); kingLogo(c, 950, 50, 98); heading(c, 'Offering Breakdown', 50, 166);
    const rows = [350, 487, 621, 759];
    [[337, '1201', 404, [74, 100, 88, 14]], [734, '1502', 802, [74, 86, 88, 12]]].forEach(([x, n, mid, widths]) => {
      text(c, 'Unit', x, 256, 50, { w: 700, fill: K.white, track: 0, family: SANS }); text(c, n, x + 23, 276, 45, { w: 700, fill: K.lite, track: 0.03, family: SERIF });
      rows.forEach((y, r) => fill(c, K.soft, mid - widths[r] / 2, y - 4, widths[r], 9));
    });
    fill(c, K.gold, 601, 219, 3, 581);
    rows.forEach((y, r) => { gIcon(c, r, 77, y); fill(c, K.white, 116, y - (r > 1 ? 15 : 5), [44, 62, 82, 78][r], 10); if (r > 1) fill(c, K.white, 116, y + 5, [0, 0, 124, 62][r], 10); });
    upTitle(c, 'The Offering'); folio(c, 1006, '2');
  }) },
  kMapL: { w: 220, h: 170, draw: page(c => { cityMap(c, 0); folio(c, 47, '3'); }) },
  kMapR: { w: 220, h: 170, draw: page(c => {
    fill(c, K.coal, 0, 0, 1100, 850); cityMap(c, 1100); fill(c, K.gold, 253, 0, 20, 850); kingLogo(c, 950, 50, 98);
    heading(c, 'Public Transportation', 300, 183);
    [263, 380, 503].forEach((y, i) => {
      disc(c, K.white, 363, y, 40); stroke(c, K.gold, 6); c.beginPath(); c.arc(363, y, 40, 0, Math.PI * 2); c.stroke(); c.fillStyle = K.gold; c.beginPath(); c.roundRect(347, y - 20, 32, 36, 7); c.fill();
      fill(c, K.lite, 423, y - 24, [250, 300, 290][i], 14); fill(c, K.soft, 423, y + 4, [210, 220, 230][i], 9);
    });
    heading(c, 'Direct indoor', 300, 650, 2); text(c, 'access to the PATH', 324, 700, 50, { w: 700, fill: K.white, track: 0.01, family: SERIF });
    upTitle(c, 'Location'); folio(c, 1006, '4');
  }) },
  kGalL: { w: 220, h: 170, draw: page(c => { fill(c, K.coal, 0, 0, 1100, 850); gallery(c, 0); lennard(c); folio(c, 47, '7'); }) },
  kGalR: { w: 220, h: 170, draw: page(c => { fill(c, K.coal, 0, 0, 1100, 850); gallery(c, 1100); upTitle(c, 'Gallery'); kingLogo(c, 950, 50, 98); folio(c, 1006, '8'); }) },
  kBack: { w: 220, h: 170, draw: page(c => {
    fill(c, K.black, 0, 0, 1100, 850); weave(c, 0, 0, 1100, 850);
    c.save(); c.beginPath(); c.moveTo(35, 0); c.lineTo(427, 0); c.lineTo(621, 850); c.lineTo(211, 850); c.closePath(); c.clip(); street(c, 0, 0, 640, 850, { at: 0.52, zoom: 0.8, drop: 0.2 }); c.restore();
    quad(c, K.gold, [[24, 0], [35, 0], [211, 850], [200, 850]]); quad(c, K.gold, [[427, 0], [438, 0], [632, 850], [621, 850]]);
    kingLogo(c, 86, 530, 495, true);
    c.fillStyle = K.gold; c.beginPath(); c.moveTo(460, 143); c.lineTo(841, 143); c.arcTo(941, 143, 941, 243, 100); c.lineTo(941, 290); c.lineTo(493, 290); c.closePath(); c.fill();   // the panel, with the firm's name only
    text(c, 'Lennard:', 550, 236, 56, { w: 700, fill: K.white, track: 0, family: SERIF });
    fill(c, K.soft, 780, 712, 270, 9); fill(c, K.soft, 940, 736, 110, 9); fill(c, K.lite, 955, 760, 95, 9); fill(c, 'rgba(255,255,255,0.3)', 650, 786, 400, 4); fill(c, 'rgba(255,255,255,0.3)', 670, 796, 380, 4);
  }) },
  // ---- the same listing as a LinkedIn post and as an e-blast. Dan left these to me: they follow the flyer loosely.
  kPost: { w: 400, h: 400, draw(c, w, h) {               // the post: the photograph edge to edge, the pattern as a band along the top, the logo over a dark foot
    c.scale(w / 1000, h / 1000); street(c, 0, 0, 1000, 1000, { at: 0.56, zoom: 0.9, drop: 0.14 });
    fill(c, K.black, 0, 0, 1000, 150); weave(c, 0, 0, 1000, 150, K.weave, 44); text(c, 'Lennard:', 56, 100, 50, { w: 700, fill: K.lite, track: 0, family: SERIF });
    const g = c.createLinearGradient(0, 500, 0, 1000); g.addColorStop(0, 'rgba(3,10,18,0)'); g.addColorStop(0.7, 'rgba(3,10,18,0.9)'); g.addColorStop(1, K.black); c.fillStyle = g; c.fillRect(0, 500, 1000, 500);
    kingLogo(c, 50, 610, 600, true); tab(c, 690, 788, 320, 146, 50, 'Office Space', 'For Sale');
  } },
  post: { w: 300, h: 600, draw(c, w, h) {                 // that post in the LinkedIn feed, on a phone
    fill(c, '#FFFFFF', 0, 0, w, h); island(c, w);
    c.fillStyle = '#0A66C2'; c.beginPath(); c.roundRect(16, 50, 28, 28, 5); c.fill(); text(c, 'in', 30, 71, 19, { w: 700, fill: '#FFFFFF', align: 'center', track: 0, family: SANS });
    c.fillStyle = '#EEF0F2'; c.beginPath(); c.roundRect(56, 52, 176, 24, 12); c.fill(); disc(c, C.grey, 264, 64, 9); fill(c, '#E4E3DF', 0, 90, w, 1.5);
    disc(c, K.black, 36, 122, 17); text(c, 'L:', 36, 128, 17, { w: 700, fill: K.lite, align: 'center', track: 0, family: SERIF });
    fill(c, C.ink, 64, 111, 96, 9); fill(c, C.grey, 64, 127, 62, 6); for (let i = 0; i < 3; i++) disc(c, C.slate, 262 + i * 9, 120, 2.6);
    lines(c, C.grey, 18, 150, [250, 190], 6, 8);
    c.save(); c.translate(0, 184); ART.kPost.draw(c, 300, 300); c.restore();
    [0, 1, 2, 3].forEach(i => { stroke(c, C.slate, 3); c.strokeRect(32 + i * 68, 500, 16, 14); fill(c, C.grey, 24 + i * 68, 522, 32, 5); });
    fill(c, '#E4E3DF', 0, 540, w, 1.5); for (let i = 0; i < 5; i++) fill(c, i === 0 ? C.ink : C.grey, 27 + i * 56, 554, 20, 20); fill(c, C.ink, 100, 588, 100, 5);
  } },
  eblast: { w: 320, h: 472, draw(c, w, h) {              // the e-blast: the photograph in the flyer's frame with the logo across its corner, then the two units
    c.scale(w / 800, h / 1180); fill(c, K.coal, 0, 0, 800, 1180);
    fill(c, K.black, 0, 0, 800, 120); weave(c, 0, 0, 800, 120, K.weave, 40); text(c, 'Lennard:', 44, 78, 46, { w: 700, fill: K.lite, track: 0, family: SERIF });
    const frame = () => { c.beginPath(); c.roundRect(300, 168, 456, 470, [0, 170, 0, 0]); };
    c.save(); frame(); c.clip(); street(c, 300, 168, 456, 470, { at: 0.55 }); c.restore(); stroke(c, K.gold, 7); frame(); c.stroke();
    kingLogo(c, 44, 404, 430, true);
    heading(c, 'Office Space For Sale', 44, 726); fill(c, K.lite, 44, 752, 330, 12); lines(c, K.soft, 44, 786, [712, 690, 520], 9, 17);
    [[150, '1201'], [520, '1502']].forEach(([x, n]) => {
      text(c, 'Unit', x, 930, 50, { w: 700, fill: K.white, track: 0, family: SANS }); text(c, n, x + 23, 950, 45, { w: 700, fill: K.lite, track: 0.03, family: SERIF });
      fill(c, K.soft, x, 978, 130, 9); fill(c, K.soft, x, 1000, 96, 9);
    });
    fill(c, K.gold, 399, 880, 3, 132);
    c.fillStyle = K.gold; c.beginPath(); c.roundRect(44, 1040, 262, 72, [28, 0, 0, 0]); c.fill(); text(c, 'View the flyer', 70, 1087, 30, { w: 700, fill: K.white, track: 0, family: SANS });
    fill(c, K.black, 0, 1140, 800, 40);
  } },
  mail: { w: 320, h: 472, draw(c, w, h) {                 // the e-blast, open in a mail app on a tablet
    fill(c, '#F3F2EE', 0, 0, w, 58); disc(c, K.black, 30, 29, 15); text(c, 'L:', 30, 34, 15, { w: 700, fill: K.lite, align: 'center', track: 0, family: SERIF });
    fill(c, C.ink, 56, 17, 150, 9); fill(c, C.grey, 56, 34, 96, 6); for (let i = 0; i < 3; i++) disc(c, C.slate, 284 + i * 9, 29, 2.6);
    c.save(); c.translate(0, 58); ART.eblast.draw(c, 320, 472); c.restore();
  } },
  // ---- video: one edit, on three screens
  frameWide: { w: 480, h: 270, draw(c, w, h) { SHOTS.a(c, w, h); } },
  playerWide: { w: 480, h: 270, draw(c, w, h) {
    SHOTS.a(c, w, h, { capY: h * 0.76 });
    playIcon(c, C.paper, 30, 245, 9); fill(c, 'rgba(247,246,243,0.45)', 54, 243, 400, 5); fill(c, C.paper, 54, 243, 236, 5); fill(c, C.paper, 286, 237, 6, 17);
  } },
  reel: { w: 300, h: 600, draw(c, w, h) {
    SHOTS.a(c, w, h, { k: 172, capY: 462, capPx: 40 });
    [318, 372, 426].forEach((y, i) => { if (i === 0) heart(c, C.paper, 266, y, 13); else if (i === 1) { stroke(c, C.paper, 4); c.beginPath(); c.arc(266, y, 11, 0, Math.PI * 2); c.stroke(); } else playIcon(c, C.paper, 266, y, 11); });
    disc(c, C.paper, 34, 530, 15); fill(c, C.paper, 60, 520, 96, 9); fill(c, 'rgba(247,246,243,0.6)', 60, 537, 64, 6); lines(c, 'rgba(247,246,243,0.6)', 20, 562, [210, 150], 6, 8);
    fill(c, 'rgba(247,246,243,0.4)', 20, 50, 260, 4); fill(c, C.paper, 20, 50, 150, 4); island(c, w); fill(c, C.paper, 100, 588, 100, 5);
  } },
  sqPost: { w: 360, h: 360, draw(c, w, h) {
    SHOTS.a(c, w, h, { k: 126, capY: 290, capPx: 34 });
    fill(c, C.ink, 300, 20, 40, 40); playIcon(c, C.paper, 320, 40, 10); fill(c, 'rgba(247,246,243,0.45)', 0, 350, w, 10); fill(c, C.paper, 0, 350, 210, 10);
  } },
  thumbA: { w: 96, h: 54, draw(c, w, h) { SHOTS.a(c, w, h, { cap: false }); } },
  thumbB: { w: 96, h: 54, draw(c, w, h) { SHOTS.b(c, w, h); } },
  thumbC: { w: 96, h: 54, draw(c, w, h) { SHOTS.c(c, w, h); } },
  wave: { w: 512, h: 34, draw(c, w, h) { for (let i = 1; i < 127; i++) { const a = 0.5 + 0.5 * Math.sin(i * 0.37) * Math.sin(i * 0.11 + 1), b = 0.35 + 0.65 * Math.abs(Math.sin(i * 1.7 + Math.sin(i * 0.9) * 2)), v = Math.max(0.08, a * b) * (h - 8); fill(c, C.paper, i * 4, (h - v) / 2, 2.4, v); } } },
  ruler: { w: 512, h: 20, draw(c, w, h) { for (let i = 0; i <= 64; i++) fill(c, C.grey, i * 8, i % 8 ? 12 : 2, 2, i % 8 ? 8 : 18); } },
  trans: { w: 64, h: 64, draw(c) { fill(c, C.paper, 6, 6, 52, 52); c.fillStyle = C.ink; c.beginPath(); c.moveTo(12, 52); c.lineTo(52, 12); c.lineTo(52, 52); c.closePath(); c.fill(); } },
  fx: { w: 72, h: 40, draw(c) { text(c, 'fx', 36, 30, 34, { fill: C.paper, align: 'center', track: 0 }); } },
  transport: { w: 200, h: 40, draw(c) { fill(c, C.grey, 38, 10, 5, 20); playIcon(c, C.grey, 58, 20, -10); playIcon(c, C.paper, 100, 20, 13); playIcon(c, C.grey, 142, 20, 10); fill(c, C.grey, 157, 10, 5, 20); } },
  tT: { w: 40, h: 40, draw(c) { fill(c, C.grey, 8, 8, 24, 6); fill(c, C.grey, 17, 8, 6, 26); } },
  tV: { w: 40, h: 40, draw(c) { stroke(c, C.grey, 5); c.strokeRect(7, 10, 26, 20); } },
  tA: { w: 40, h: 40, draw(c) { [10, 22, 14, 26, 12].forEach((v, i) => fill(c, C.grey, 6 + i * 6.4, 20 - v / 2, 3.6, v)); } },
  // ---- the apps' own logos, because Dan wants people to know which app this is: two letters on a dark tile, in each app's colours
  appAi: { w: 128, h: 128, draw(c, w, h) { fill(c, '#330000', 0, 0, w, h); text(c, 'Ai', 64, 88, 68, { w: 600, fill: '#FF9A00', align: 'center', track: 0 }); } },
  appId: { w: 128, h: 128, draw(c, w, h) { fill(c, '#49021F', 0, 0, w, h); text(c, 'Id', 64, 88, 68, { w: 600, fill: '#FF3366', align: 'center', track: 0 }); } },
  appPs: { w: 128, h: 128, draw(c, w, h) { fill(c, '#001E36', 0, 0, w, h); text(c, 'Ps', 64, 88, 68, { w: 600, fill: '#31A8FF', align: 'center', track: 0 }); } },
  nameAi: { w: 320, h: 56, draw(c) { text(c, 'Illustrator', 2, 42, 40, { w: 500, fill: C.paper, track: 0 }); } },
  nameId: { w: 320, h: 56, draw(c) { text(c, 'InDesign', 2, 42, 40, { w: 500, fill: C.paper, track: 0 }); } },
  namePs: { w: 320, h: 56, draw(c) { text(c, 'Photoshop', 2, 42, 40, { w: 500, fill: C.paper, track: 0 }); } },
  anchor: { w: 32, h: 32, draw(c, w, h) { fill(c, C.red, 0, 0, w, h); fill(c, C.paper, 6, 6, 20, 20); } },
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
  tFrame: { w: 64, h: 64, draw(c) { stroke(c, C.paper, 5); c.strokeRect(12, 14, 40, 36); c.beginPath(); c.moveTo(12, 14); c.lineTo(52, 50); c.moveTo(52, 14); c.lineTo(12, 50); c.stroke(); } },
  tLine: { w: 64, h: 64, draw(c) { stroke(c, C.paper, 6); c.beginPath(); c.moveTo(14, 50); c.lineTo(50, 14); c.stroke(); } },
  tMove: { w: 64, h: 64, draw(c) { fill(c, C.paper, 29, 14, 6, 36); fill(c, C.paper, 14, 29, 36, 6); [[32, 6, 0], [58, 32, 1], [32, 58, 2], [6, 32, 3]].forEach(([x, y, r]) => { c.save(); c.translate(x, y); c.rotate(r * Math.PI / 2); c.fillStyle = C.paper; c.beginPath(); c.moveTo(0, 0); c.lineTo(9, 10); c.lineTo(-9, 10); c.closePath(); c.fill(); c.restore(); }); } },
  tMarquee: { w: 64, h: 64, draw(c) { stroke(c, C.paper, 5); c.setLineDash([9, 6]); c.strokeRect(12, 14, 40, 36); c.setLineDash([]); } },
  tBrush: { w: 64, h: 64, draw(c) { c.save(); c.translate(32, 32); c.rotate(Math.PI / 4); fill(c, C.paper, -5, -28, 10, 30); fill(c, C.paper, -8, 6, 16, 8); c.beginPath(); c.moveTo(-8, 16); c.lineTo(8, 16); c.lineTo(0, 30); c.closePath(); c.fill(); c.restore(); } },
  tDrop: { w: 64, h: 64, draw(c) { stroke(c, C.paper, 8); c.beginPath(); c.moveTo(14, 50); c.lineTo(38, 26); c.stroke(); c.save(); c.translate(44, 20); c.rotate(Math.PI / 4); fill(c, C.paper, -9, -14, 18, 24); c.restore(); } },
};

// Lay every picture out in one canvas, in rows, tallest first. The canvas is `size` wide and as tall as the rows need.
// Returns { canvas, places: { key: [x, y, w, h] as shares of the canvas } }. The page's fonts must be ready before this is called.
export function makeAtlas({ size = 2048, pad = 8, scale = 1 } = {}) {
  const spots = [];
  let x = pad, y = pad, row = 0;
  for (const [key, a] of Object.entries(ART).sort((p, q) => q[1].h - p[1].h)) {
    const w = Math.round(a.w * scale), h = Math.round(a.h * scale);
    if (x + w + pad > size) { x = pad; y += row + pad; row = 0; }
    spots.push([key, a, x, y, w, h]);
    x += w + pad; row = Math.max(row, h);
  }
  const tall = Math.ceil((y + row + pad) / 4) * 4;
  if (tall > 4096) throw new Error('the pictures need an atlas ' + tall + ' px tall, and 4096 is the most a phone is sure to take');
  const canvas = document.createElement('canvas'); canvas.width = size; canvas.height = tall;
  const ctx = canvas.getContext('2d'), places = {};
  for (const [key, a, px, py, w, h] of spots) {
    ctx.save(); ctx.translate(px, py); ctx.scale(scale, scale); ctx.beginPath(); ctx.rect(0, 0, a.w, a.h); ctx.clip(); a.draw(ctx, a.w, a.h); ctx.restore();
    places[key] = [(px + 0.5) / size, (py + 0.5) / tall, (w - 1) / size, (h - 1) / tall];
  }
  return { canvas, places };
}
// The page's own face, and the stand-ins for the flyer's faces, which live beside this file so that every page that draws the pictures gets them.
const FACES = [['Gelasio', '400', 'gelasio-400.woff2'], ['Gelasio', '700', 'gelasio-700.woff2'], ['Rokkitt', '800', 'rokkitt-800.woff2']];
export async function fontsReady() {
  await Promise.all(FACES.map(([family, weight, file]) => { const f = new FontFace(family, `url(${new URL('./fonts/' + file, import.meta.url)})`, { weight }); document.fonts.add(f); return f.load(); }));
  await Promise.all(['800 64px Outfit', '600 32px Outfit', '500 16px Outfit', '400 16px Outfit'].map(f => document.fonts.load(f)));
}
