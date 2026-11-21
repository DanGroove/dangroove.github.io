// Second take: the pictures. Everything flat that sits on a piece (words, the mark, a page layout, an icon) is drawn here with
// the 2D canvas into one atlas, which the renderer then maps onto pieces. Browser only (it needs Path2D and the page's fonts).

export const C = { ink: '#151314', paper: '#F7F6F3', red: '#C0262E', grey: '#B9B4AE', line: '#2E2B29', slate: '#706966', night: '#3B3735', dark: '#5A5552' };
// Atlas creation records glyph edges with the actual loaded font. Node checks use the deterministic fallback.
export const TYPE_EDGES = {};
export const TYPE_BOXES = {};
export const ART_TEXT = {};
// The graded bars sample the old histogram's outline at the same 48 bin centres as the dark bars.
const HISTO_OUTLINE = [[0, 52], [18, 44], [34, 20], [50, 34], [70, 8], [92, 30], [112, 22], [132, 46], [160, 54]];
export const HISTOGRAM = Array.from({ length: 48 }, (_, i) => {
  const x = (i + 0.5) * 160 / 48, j = HISTO_OUTLINE.findIndex(p => p[0] >= x), a = HISTO_OUTLINE[j - 1], b = HISTO_OUTLINE[j];
  return [(8 + 78 * Math.exp(-(((i - 10) / 8) ** 2)) * (0.6 + 0.4 * Math.abs(Math.sin(i * 1.7)))) / 100, 1 - (a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0])) / 64];
});
let captureText = null, hideText = false, hideLogos = false, hideTabs = false, hideBuilding = false;
function recordType(c, key, words, x, px, align = 'left', baseline = px) {
  c.font = `800 ${px}px Outfit, sans-serif`; if ('letterSpacing' in c) c.letterSpacing = `${-0.02 * px}px`;
  const left = x - (align === 'center' ? c.measureText(words).width / 2 : 0);
  TYPE_EDGES[key] = [left, ...Array.from(words, (_, i) => left + c.measureText(words.slice(0, i + 1)).width)];
  const m = c.measureText(words), ascent = m.actualBoundingBoxAscent ?? px * 0.8, descent = m.actualBoundingBoxDescent ?? px * 0.2;
  TYPE_BOXES[key] = { top: baseline - ascent, height: ascent + descent };
}

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
  if (captureText) {
    const t = ctx.getTransform(), base = captureText.base, m = ctx.measureText(s), width = m.width, left = align === 'center' ? x - width / 2 : x;
    const local = (X, Y) => [(t.a * X + t.c * Y + t.e - base.e) / base.a, (t.b * X + t.d * Y + t.f - base.f) / base.d];
    const ascent = m.actualBoundingBoxAscent ?? px, descent = m.actualBoundingBoxDescent ?? px * 0.2;
    const inkLeft = Math.min(left, x - (m.actualBoundingBoxLeft ?? x - left)) - 1, inkRight = Math.max(left + width, x + (m.actualBoundingBoxRight ?? left + width - x)) + 1;
    const points = [[inkLeft, y - ascent - 1], [inkRight, y - ascent - 1], [inkLeft, y + descent + 1], [inkRight, y + descent + 1]].map(([X, Y]) => local(X, Y));
    const xs = points.map(p => p[0]), ys = points.map(p => p[1]);
    captureText.parts.push({ words: s, colour: fill, region: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)], origin: local(left, y), axis: [t.a / base.a, t.b / base.d], down: [t.c / base.a * px, t.d / base.d * px], edges: [0, ...Array.from(s, (_, i) => ctx.measureText(s.slice(0, i + 1)).width)] });
  }
  if (!hideText) ctx.fillText(s, x, y);
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
  b(c, w, h) { fill(c, C.ink, 0, 0, w, h); disc(c, C.red, w * 0.68, h * 0.42, Math.min(h, w) * 0.24); fill(c, C.slate, 0, h * 0.68, w, h * 0.32); fill(c, C.grey, 0, h * 0.68, w, h * 0.04); },     // a sun over a horizon
  c(c, w, h, ground = C.grey) { fill(c, ground, 0, 0, w, h); [[0.08, 0.5, 0.2], [0.3, 0.25, 0.24], [0.58, 0.42, 0.16], [0.78, 0.6, 0.22]].forEach(([x, y, bw]) => fill(c, C.ink, w * x, h * y, w * bw, h)); disc(c, C.paper, w * 0.84, h * 0.22, Math.min(h, w) * 0.1); },   // buildings
};
const playIcon = (c, col, x, y, r) => { c.fillStyle = col; c.beginPath(); c.moveTo(x - r * 0.7, y - r); c.lineTo(x + r, y); c.lineTo(x - r * 0.7, y + r); c.closePath(); c.fill(); };
function heart(c, col, x, y, r) { c.fillStyle = col; c.beginPath(); c.moveTo(x, y + r); c.bezierCurveTo(x - r * 1.7, y - r * 0.1, x - r * 0.9, y - r * 1.3, x, y - r * 0.45); c.bezierCurveTo(x + r * 0.9, y - r * 1.3, x + r * 1.7, y - r * 0.1, x, y + r); c.fill(); }

// ---- motion: one animation of words and shapes, the way a SaaS promo moves, in Dan's own colours. It is drawn to fill any frame,
// so the wide, tall and square exports are the same animation laid out again. The full stop is a ball that has just flown in along
// its path, and the rows of the list slide in one after another: the last one is still on its way.
// o: where the words start and their size, and the list's left edge, top, width and number of rows.
const MOVE = 2.462;                                           // how wide "move" is set in Outfit 800, in ems
const ballAt = ({ x, y, px }) => [x + (MOVE + 0.2) * px, y + px * 0.92, px * 0.15];
const WIDE = { x: 34, y: 116, px: 60, rows: [296, 62, 140, 3] };
export const BALL = ballAt(WIDE);
export const BALL_FROM = [BALL[0] + WIDE.px * 0.9, WIDE.y - WIDE.px * 1.3];
export const BALL_VIA = [BALL[0] + WIDE.px, BALL[1] - WIDE.px * 0.3];
export const ROWS = [0, 1, 2].map(i => [WIDE.rows[0] + [0, 0.09, 0.24][i] * WIDE.rows[2], WIDE.rows[1] + i * WIDE.rows[2] * 0.27 * 1.3, WIDE.rows[2], WIDE.rows[2] * 0.27]);                             // where the ball is in the wide frame, and its radius, for the selection drawn around it
function saas(c, w, h, o = WIDE) {
  const { x, y, px, rows: [rx, ry, rw, n] } = o, [bx, by, r] = ballAt(o);
  fill(c, C.paper, 0, 0, w, h);
  text(c, 'Make it', x, y, px); text(c, 'move', x, y + px * 1.07, px, { fill: C.red });
  const from = [bx + px * 0.9, y - px * 1.3], via = [bx + px * 1.0, by - px * 0.3];                             // the ball's path: a curve of dots, with a keyframe at its start
  for (let i = 1; i < 12; i++) { const t = i / 12, u = 1 - t; disc(c, C.slate, u * u * from[0] + 2 * u * t * via[0] + t * t * bx, u * u * from[1] + 2 * u * t * via[1] + t * t * by, px * 0.028); }
  stroke(c, C.slate, px * 0.04); c.strokeRect(from[0] - px * 0.08, from[1] - px * 0.08, px * 0.16, px * 0.16);
  disc(c, C.red, bx, by, r);
  const rh = rw * 0.27;
  for (let i = 0; i < n; i++) {
    const ox = rx + [0, 0.09, 0.24][i] * rw, oy = ry + i * rh * 1.3;
    fill(c, C.ink, ox, oy, rw, rh); fill(c, i === 0 ? C.red : C.paper, ox + rh * 0.25, oy + rh * 0.25, rh * 0.5, rh * 0.5); fill(c, C.paper, ox + rh, oy + rh * 0.28, rw * 0.45, rh * 0.16); fill(c, C.slate, ox + rh, oy + rh * 0.58, rw * 0.3, rh * 0.13);
  }
}

// ---- UX/UI: the work is this page's own hero, as its wireframe and as its finished design, on a desktop and on a phone. It is
// drawn to fill any frame. The measures are the built page's own, at 1440 x 900 and at 390 x 664, and the frame scales them:
// what hangs from the right edge or the foot of the real page does so here too.
// craft: which craft is lit in the list (0 graphic design, 1 video), which also sets what the little stage shows.
const quad = (c, col, pts) => { c.fillStyle = col; c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath(); c.fill(); };
// a slanted face, by three of its corners (where it starts, the far end of its top edge, the far end of its left edge): returns a way to fill a part of it
const face = (c, [o, a, b]) => (col, u0, v0, u1, v1) => quad(c, col, [[u0, v0], [u1, v0], [u1, v1], [u0, v1]].map(([u, v]) => [o[0] + u * (a[0] - o[0]) + v * (b[0] - o[0]), o[1] + u * (a[1] - o[1]) + v * (b[1] - o[1])]));
function littleStage(c, craft, screen, floor) {
  const S = face(c, screen), F = face(c, floor);
  S(C.dark, 0, 0, 1, 1); S(C.night, 0, 0, 1, 0.13); S(craft ? '#9999FF' : '#FF3366', 0.02, 0.025, 0.08, 0.105); S(C.red, 0.8, 0.025, 0.97, 0.105);      // the screen, its bar, the app's tile and Export
  if (craft === 0) {                                             // InDesign: the spread, three pieces under it, and what it exported
    S(C.night, 0.02, 0.17, 0.09, 0.96); S(C.night, 0.82, 0.17, 0.98, 0.96);
    S('#282928', 0.13, 0.2, 0.78, 0.6); S('#9B7C29', 0.17, 0.385, 0.74, 0.415); S('#6E9CD6', 0.13, 0.66, 0.36, 0.94); S('#6E9CD6', 0.39, 0.66, 0.57, 0.94); S('#282928', 0.6, 0.66, 0.78, 0.94);
    F('#0A0F16', 0, 0, 0.5, 0.48); F('#6E9CD6', 0.2, 0.04, 0.48, 0.44); F('#FFFFFF', 0.53, 0, 0.72, 0.48); F('#282928', 0.75, 0, 1, 0.48); F('#282928', 0, 0.52, 1, 1); F('#9B7C29', 0.62, 0.52, 0.64, 1);
  } else {                                                       // Premiere Pro: the viewer, the timeline, and the three screens
    S(C.night, 0.02, 0.17, 0.2, 0.56); S(C.night, 0.23, 0.17, 0.72, 0.56); S([C.red, C.red, C.paper, C.grey][craft], 0.3, 0.21, 0.65, 0.5); S(C.night, 0.75, 0.17, 0.98, 0.56);
    S(C.night, 0.02, 0.62, 0.98, 0.96); S(C.grey, 0.1, 0.72, 0.36, 0.86); S(C.red, 0.36, 0.72, 0.64, 0.86); S(C.grey, 0.64, 0.72, 0.9, 0.86);
    F(C.red, 0, 0, 0.56, 0.6); F(C.red, 0.6, 0, 0.78, 0.6); F('#FFFFFF', 0.82, 0, 1, 0.6);
  }
}
function site(c, w, h, { craft = 0, wire = false, build = 4 } = {}) {
  const tall = h > w, [dw, dh] = tall ? [390, 664] : [1440, 900], m = Math.min(w / dw, h / dh);
  const X = x => x * m, R = x => w - (dw - x) * m, Y = y => y * m, B = y => h - (dh - y) * m;           // a measure from the left, from the right, from the top, from the foot
  const ground = wire ? '#FFFFFF' : C.ink, word = wire ? C.slate : C.paper, soft = wire ? C.grey : C.slate, hot = wire || build < 4 ? C.slate : C.red;
  const bar = (col, x, y, long, thick) => fill(c, col, x, y - thick * m / 2, long * m, thick * m);       // a line of words: its left end, its middle, how long and how thick
  fill(c, ground, 0, 0, w, h);
  const box = (x0, y0, x1, y1) => {                              // a wireframe's stand-in for a picture: a box with a cross
    fill(c, '#ECEAE6', x0, y0, x1 - x0, y1 - y0); stroke(c, C.grey, Math.max(1, 3 * m * (tall ? 0.3 : 1))); c.strokeRect(x0, y0, x1 - x0, y1 - y0);
    c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.moveTo(x1, y0); c.lineTo(x0, y1); c.stroke();
  };
  if (!tall) {
    if (wire) { fill(c, C.grey, X(64), Y(31), 60 * m, 44 * m); box(R(665), Y(119), R(1343), Y(801)); }
    else { mark(c, X(64), Y(31), 60 * m, C.paper, build < 4 ? C.slate : C.red); if (build >= 2) littleStage(c, craft, [[R(909), Y(119)], [R(1343), Y(338)], [R(909), Y(446)]], [[R(896), Y(523)], [R(1182), Y(677)], [R(665), Y(647)]]); else box(R(665), Y(119), R(1343), Y(801)); }
    bar(hot, R(1199), Y(53), 68, 10); bar(soft, R(1305), Y(53), 70, 10);
    if (wire) { fill(c, word, X(64), Y(252), 300 * m, 76 * m); fill(c, word, X(64), Y(350), 420 * m, 76 * m); }
    else if (build >= 3) { text(c, 'Danial', X(59), Y(328), 106 * m, { fill: C.paper }); text(c, 'Endrawes', X(59), Y(426), 106 * m, { fill: C.paper }); }
    else if (build < 2) { fill(c, C.grey, X(64), Y(252), 300 * m, 76 * m); fill(c, C.grey, X(64), Y(350), 420 * m, 76 * m); }
    bar(soft, X(64), Y(475), 439, 12); bar(soft, X(64), Y(502), 240, 12);
    for (let i = 0; i < 4; i++) {
      const y = 573 + i * 34.7;
      fill(c, wire ? '#E4E3DF' : C.line, X(64), Y(y - 17.5), 380 * m, Math.max(1, 1.4 * m));
      bar(i === craft ? hot : soft, X(64), Y(y), 17, 10); bar(i === craft ? (craft === 1 ? hot : word) : soft, X(99), Y(y), [126, 46, 60, 42][i], 10);
    }
    bar(soft, X(64), B(863), 199, 10); bar(soft, R(1329), B(863), 46, 10);
  } else {
    const drop = (h / m - dh) / 2, D = y => (y + drop) * m;      // a taller phone gives the stage more room, and it sits in the middle of that room
    if (wire) { fill(c, C.grey, X(16), Y(16), 43 * m, 32 * m); box(X(66), D(76), X(322.5), D(334)); }
    else { mark(c, X(16), Y(16), 43 * m, C.paper, build < 4 ? C.slate : C.red); if (build >= 2) littleStage(c, craft, [[X(159), D(76)], [X(322.5), D(161)], [X(159), D(197.5)]], [[X(153.3), D(228.7)], [X(262), D(287.1)], [X(66), D(275.7)]]); else box(X(66), D(76), X(322.5), D(334)); }
    bar(hot, R(224), Y(32), 64, 8); bar(soft, R(308), Y(32), 65, 8);
    if (wire) { fill(c, word, X(16), B(359), 170 * m, 42 * m); fill(c, word, X(16), B(410), 240 * m, 42 * m); }
    else if (build >= 3) { text(c, 'Danial', X(13.5), B(400), 58.6 * m, { fill: C.paper }); text(c, 'Endrawes', X(13.5), B(451.5), 58.6 * m, { fill: C.paper }); }
    else if (build < 2) { fill(c, C.grey, X(16), B(359), 170 * m, 42 * m); fill(c, C.grey, X(16), B(410), 240 * m, 42 * m); }
    bar(soft, X(16), B(486), 316, 9); bar(soft, X(16), B(510), 287, 9);
    for (let i = 0; i < 4; i++) {
      const x = [16, 203][i % 2], y = B([555, 598.5][i >> 1]);
      bar(i === craft ? hot : soft, X(x), y, 14, 8); bar(i === craft ? (craft === 1 ? hot : word) : soft, X(x + 29), y, [116, 43, 55, 39][i], 8);
    }
    bar(soft, X(16), B(641), 183, 7); bar(soft, R(331), B(641), 42, 7);
  }
}
// that page in a phone's browser: the browser's bar with the address in it, the page, and a strip at the foot with the bar to swipe home
const sitePhone = craft => ({ w: 300, h: 650, draw(c, w, h) {
  fill(c, C.line, 0, 0, w, h); c.fillStyle = C.ink; c.beginPath(); c.roundRect(24, 46, w - 48, 20, 10); c.fill(); fill(c, C.slate, 96, 54, 108, 4);
  c.save(); c.translate(0, 74); c.beginPath(); c.rect(0, 0, w, 550); c.clip(); site(c, w, 550, { craft }); c.restore();
  fill(c, C.paper, 100, 636, 100, 5);
} });

// ---- the 1 King Street W flyer, drawn very simply: a 20 page landscape booklet in black, charcoal and two golds.
// No agent's name or contact details are drawn anywhere: Dan asked for them to be left out.
// Its faces are Georgia, Rockwell and Helvetica Neue. Gelasio and Rokkitt, open faces of the same build (./fonts), stand in for the first two.
// A page is drawn in hundredths of an inch, 1100 x 850, and scaled to whatever size its picture has.
const K = { black: '#0A0F16', weave: '#30302D', coal: '#282928', comb: '#4C4B44', gold: '#9B7C29', lite: '#CEAB48', white: '#FFFFFF', soft: 'rgba(255,255,255,0.62)' };   // sampled from the flyer as Acrobat shows it
const SERIF = 'Gelasio, Georgia, serif', SLAB = 'Rokkitt, Rockwell, serif', SANS = "'Helvetica Neue', Helvetica, Arial, 'Liberation Sans', sans-serif";
const page = draw => (c, w, h) => { c.scale(w / 1100, h / 850); draw(c); };
const lerp = (a, b, t) => a + (b - a) * t;

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
// Dan asked for the two logos on the flyer, the firm's and the building's, to be shown as blobs: a soft, lumpy shape that says
// "a logo goes here" without drawing anyone's mark. So neither real logo is drawn anywhere in these pictures.
// lumps: how far each point of the shape is from its middle, going round, as shares of the box. The curve through them is smooth.
function blob(c, col, x, y, w, h, lumps) {
  const n = lumps.length, at = i => { const k = ((i % n) + n) % n, a = k / n * Math.PI * 2; return [x + w / 2 * (1 + Math.cos(a) * lumps[k]), y + h / 2 * (1 + Math.sin(a) * lumps[k])]; };
  c.fillStyle = col; c.beginPath(); c.moveTo(...at(0));
  for (let i = 0; i < n; i++) {
    const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
    c.bezierCurveTo(p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6, p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6, p2[0], p2[1]);
  }
  c.closePath(); c.fill();
}
const FIRM = [1, 1.14, 0.9, 1.1, 0.97, 1.18, 0.86, 1.05], BUILDING = [1, 1.12, 0.88, 1.16, 0.94, 1.02, 0.84, 1.2];   // each logo has its own shape
// the firm's logo: a small blob, by its top left corner and its width
const firmLogo = (c, col = K.lite, x = 50, y = 40, w = 138) => { if (!hideLogos) blob(c, col, x, y, w, w * 0.28, FIRM); };
// The building's logo: a bigger blob. x, y, w: the top left corner and the width of the room the real logo takes, which is 0.54 w tall.
// The real one is a few letters with air between them, so a solid shape of the same weight is smaller: it starts at the same left edge.
function kingLogo(c, x, y, w, shadow = false) {
  if (hideLogos || hideBuilding) return;
  c.save();
  if (shadow) { const t = c.getTransform(), k = Math.hypot(t.a, t.b) * w; c.shadowColor = 'rgba(0,0,0,0.6)'; c.shadowBlur = 0.014 * k; c.shadowOffsetX = c.shadowOffsetY = 0.008 * k; }
  blob(c, K.gold, x, y + 0.08 * w, 0.7 * w, 0.38 * w, BUILDING);
  c.restore();
}
// the flyer's tab: a gold block with one big rounded corner, a white keyline, and two lines of words
function tab(c, x, y, w, h, r, small, big) {
  if (hideTabs) return;
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
// The copied photograph is reframed for its destination while carried, before the frame style lands.
export const PHOTO_VIEWS = { cover: { at: 0.47, zoom: 1, drop: 0 }, post: { at: 0.56, zoom: 0.9, drop: 0.14 }, mail: { at: 0.55, zoom: 1, drop: 0 } };
function street(c, x, y, w, h, { at = 0.45, raw = false, zoom = 1, drop = 0, look } = {}) {
  const T = look || (raw ? LOOK.raw : LOOK.graded);
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
  const g = c.createLinearGradient(x0, 0, x1, 0); g.addColorStop(0, K.black); g.addColorStop(1, 'rgba(10,15,22,0)'); c.fillStyle = g; c.fillRect(x0, 0, x1 - x0, h);
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
// The map on the Location spread, simplified: downtown as black streets on charcoal, with what the flyer picks out in colour. Two
// streetcar lines and the loop to the lake are gold, the subway is a grey U with its stations, the railway is teal and orange, the
// walkways under the towers are thin grey lines, and each landmark is a gold badge. Nobody's logo is drawn: a badge carries bars
// where its name would be, and the building's own logo is its blob, in a ring. In the spread's units; the map ends at x = 1352.
// A line is a list of points. A point with four numbers is a curve (its control point, then its end), and one with six is a bezier.
const trace = (c, pts) => pts.forEach((p, i) => (i === 0 ? c.moveTo(...p) : p.length === 2 ? c.lineTo(...p) : p.length === 4 ? c.quadraticCurveTo(...p) : c.bezierCurveTo(...p)));
function run(c, col, width, lists) { stroke(c, col, width); c.lineJoin = 'round'; c.beginPath(); lists.forEach(pts => trace(c, pts)); c.stroke(); }
// The subway's line: down University Avenue, round under Front Street in a wide curve, and up Yonge Street after a tight one.
export const SUBWAY = [[550, 0], [550, 176], [583, 404], [598, 506, 672, 506], [826, 506], [866, 506, 866, 466], [866, 0]];
const CITY = {
  expressway: [[0, 755], [550, 752], [980, 631], [1352, 631]],
  streets: [
    [[876, 72], [1352, 72]], [[0, 167], [1352, 167]], [[0, 216], [1120, 216], [1150, 228], [1352, 228]], [[0, 285], [1090, 285], [1120, 301], [1352, 301]],   // Shuter, Queen, Richmond, Adelaide
    [[0, 357], [1352, 357]], [[0, 439], [1062, 439]], [[0, 533], [250, 513], [876, 513]], [[876, 498], [1170, 405], [1352, 405]],                             // King, Wellington, Front
    [[0, 645], [140, 645, 220, 705, 325, 705], [400, 705, 400, 652, 470, 652], [627, 652]], [[770, 750], [850, 740, 860, 652, 940, 652], [1352, 652]], [[0, 815], [625, 815], [1352, 700]],   // Bremner, Lake Shore, Queens Quay
    [[136, 0], [136, 815]], [[257, 167], [257, 513]], [[315, 0], [315, 167]], [[543, 0], [543, 176], [576, 404], [591, 513, 665, 513]], [[627, 513], [627, 815]],   // Spadina, Blue Jay Way, University, York
    [[750, 0], [750, 575]], [[775, 580], [775, 800]], [[876, 0], [876, 790]], [[1020, 0], [1020, 448]], [[1123, 0], [1123, 600], [1135, 735]], [[1289, 0], [1289, 712]],                  // Bay, Yonge, Church, Jarvis, Sherbourne
  ],
  blocks: [                                                     // the towers' footprints, a shade lighter than the ground
    [660, 16, 62, 68], [770, 0, 52, 36], [766, 104, 58, 46], [600, 232, 60, 38], [668, 232, 60, 38], [770, 236, 38, 32], [814, 236, 40, 32], [596, 300, 64, 42], [664, 300, 64, 42], [770, 300, 84, 42],
    [606, 376, 50, 48], [662, 376, 66, 48], [770, 376, 30, 48], [806, 376, 30, 48], [640, 454, 88, 44], [770, 454, 60, 30], [366, 378, 70, 46], [370, 454, 60, 46], [436, 454, 58, 46], [570, 668, 40, 50], [640, 672, 40, 44],
  ],
  walks: [                                                      // the walkways that join the towers below ground
    [[684, 139], [684, 192]], [[638, 192], [866, 192]], [[841, 95], [841, 262]], [[790, 262], [853, 262]], [[638, 192], [638, 462], [700, 462], [740, 488], [740, 506]],
    [[536, 318], [891, 318]], [[717, 318], [717, 400]], [[600, 400], [820, 400], [820, 470]], [[397, 400], [440, 400], [440, 420], [457, 468], [457, 492], [418, 492]],
    [[505, 556], [649, 556]], [[456, 600], [649, 600]], [[689, 664], [689, 792]], [[689, 780], [752, 772]],
  ],
  tracks: [[[0, 177], [1352, 177]], [[0, 368], [1352, 368]], [[126, 0], [126, 801], [625, 818], [775, 791], [767, 745], [767, 582]]],   // the streetcars: Queen Street, King Street, and Spadina Avenue's loop round to the station
  stops: [[550, 176], [577, 366], [700, 506], [866, 366], [866, 176]],
  stopNames: [['OSGOODE', 496, 167], ['ST ANDREW', 516, 357], ['UNION', 697, 533], ['KING', 897, 357], ['QUEEN', 905, 167]],
  names: [                                                      // a street's name sits on the street: where its middle is, and how far it is turned
    ['Queen Street W', 361, 167], ['Richmond Street W', 361, 216], ['Adelaide Street W', 361, 285], ['King Street W', 361, 357], ['Wellington Street W', 361, 439], ['Front Street W', 361, 514],
    ['Shuter Street', 1010, 72], ['Queen Street E', 1010, 167], ['Richmond Street E', 1010, 216], ['Adelaide Street E', 1010, 285], ['Bremner Boulevard', 540, 652], ['Gardiner Expy', 467, 753], ['Lake Shore Boulevard E', 1012, 652],
    ['Spadina Avenue', 136, 262, -90], ['Blue Jay Way', 257, 262, -90], ['University Avenue', 551, 248, 81.8], ['Bay Street', 750, 78, -90], ['Yonge Street', 877, 262, 90], ['York Street', 627, 720, -90],
    ['Jarvis Street', 1123, 510, -90], ['Sherbourne Street', 1289, 510, -90], ['Front Street E', 1000, 459, -17.6], ['Queens Quay E', 990, 757, -9],
  ],
  badges: [[636, 101, 97, 38], [772, 48, 88, 47], [451, 394, 103, 24], [154, 596, 75, 40], [244, 603, 62, 64], [649, 550, 90, 64], [669, 631, 90, 33]],   // city hall, a mall, a concert hall, a stadium, a tower, the station, an arena
  transit: [['#12827C', 344, 535, 82, 34], ['#12827C', 958, 535, 82, 34], ['#E8862E', 361, 592, 48, 35]],                                               // where the trains' own marks are, as plain badges
  routes: [[64, 48, '510'], [64, 689, '510'], [572, 156, '501'], [680, 348, '504'], [768, 689, '510']],
};
// a landmark: a rounded block with a bar or two where its name would be
function badge(c, col, x, y, w, h) {
  c.fillStyle = col; c.beginPath(); c.roundRect(x, y, w, h, 7); c.fill();
  const rows = h > 36 ? 2 : 1;
  for (let i = 0; i < rows; i++) fill(c, K.white, x + w * (i ? 0.29 : 0.17), y + h / 2 + (i - (rows - 1) / 2) * 14 - 3.5, w * (i ? 0.42 : 0.66), 7);
}
// a streetcar route: a small car and the route's number
function chip(c, x, y, n) { fill(c, K.gold, x, y, 60, 20); c.fillStyle = K.white; c.beginPath(); c.roundRect(x + 7, y + 4, 9, 12, 2.5); c.fill(); text(c, n, x + 23, y + 15.5, 15, { w: 700, fill: K.white, track: 0.08, family: SANS }); }
function label(c, words, x, y, deg = 0, w = 700) { c.save(); c.translate(x, y); c.rotate(deg * Math.PI / 180); text(c, words, 0, 5.4, 15, { w, fill: K.white, align: 'center', track: w > 700 ? 0.05 : 0, family: SANS }); c.restore(); }
// north: a gold disc with a pointer. x, y: its middle. r: its radius.
function north(c, x, y, r = 31) {
  c.save(); c.translate(x, y); c.scale(r / 31, r / 31);
  quad(c, K.lite, [[36, -50], [7, -29], [32, -4]]); disc(c, K.gold, 0, 0, 31); disc(c, K.lite, 0, 0, 25);
  text(c, 'N', 0, 13, 37, { w: 700, fill: K.white, align: 'center', track: 0, family: SERIF });
  c.restore();
}
// off: where this page starts, because the map runs across the fold.
function cityMap(c, off = 0, { blocks = true, streets = true, pins = true } = {}) {
  c.save(); c.translate(-off, 0); c.beginPath(); c.rect(0, 0, 1352, 850); c.clip();
  fill(c, K.coal, 0, 0, 1352, 850);
  if (blocks) for (const [x, y, w, h] of CITY.blocks) fill(c, '#343533', x, y, w, h);
  if (streets) {
  run(c, '#111C27', 24, [CITY.expressway]); run(c, K.black, 19, CITY.streets); run(c, '#8D8D8A', 3, CITY.walks);
  fill(c, '#12827C', 0, 569, 1352, 11); fill(c, '#E8862E', 0, 580, 649, 12);                                // the railway: the commuter trains, and the airport's train as far as the station
  run(c, K.gold, 4, CITY.tracks); run(c, '#474A56', 5, [SUBWAY]);
  }
  if (pins) {
  for (const [x, y] of CITY.stops) { disc(c, '#474A56', x, y, 9); disc(c, K.white, x, y, 5.5); }
  for (const [words, x, y, deg] of CITY.names) label(c, words, x, y, deg);
  for (const [words, x, y] of CITY.stopNames) label(c, words, x, y, 0, 800);
  for (const b of CITY.badges) badge(c, K.gold, ...b);
  for (const b of CITY.transit) badge(c, ...b);
  for (const r of CITY.routes) chip(c, ...r);
  stroke(c, K.lite, 4); c.beginPath(); c.moveTo(852, 499); c.lineTo(852, 393); c.stroke(); c.beginPath(); c.arc(852, 385, 8, 0, Math.PI * 2); c.stroke();   // the building: a ring on its corner, and a line down to its logo
  c.fillStyle = K.coal; c.beginPath(); c.roundRect(794, 499, 117, 58, 29); c.fill(); stroke(c, K.lite, 5); c.stroke(); kingLogo(c, 823, 505, 84);
  north(c, 217, 86, 26);
  }
  c.restore();
}
// The part of that map which Illustrator shows close up: its left edge, its top, its width and its height, in the spread's units.
// It is framed so that no name and no badge is cut by its edge.
export const SPOT = [448, 321, 478, 350];
// The subway's line as points, for the selection that Illustrator draws along it: the line with each curve in `steps` straight
// pieces, the points at the two ends of each curve, and each curve's two handles (from a point, to the handle's end).
export function subwayPath(steps = 5) {
  const line = [SUBWAY[0]], knots = [], arms = [];
  for (const p of SUBWAY.slice(1)) {
    if (p.length === 2) { line.push(p); continue; }
    const a = line[line.length - 1], [cx, cy, bx, by] = p;
    for (let i = 1; i <= steps; i++) { const t = i / steps, u = 1 - t; line.push([u * u * a[0] + 2 * u * t * cx + t * t * bx, u * u * a[1] + 2 * u * t * cy + t * t * by]); }
    knots.push(a, [bx, by]); arms.push([a, [a[0] + (cx - a[0]) * 2 / 3, a[1] + (cy - a[1]) * 2 / 3]], [[bx, by], [bx + (cx - bx) * 2 / 3, by + (cy - by) * 2 / 3]]);
  }
  return { line, knots, arms };
}
// one of the round signs on the Location page: a gold vehicle, seen from the front, on a white disc with a gold rim
function sign(c, x, y, kind) {
  disc(c, K.white, x, y, 40); stroke(c, K.gold, 6); c.beginPath(); c.arc(x, y, 40, 0, Math.PI * 2); c.stroke();
  c.fillStyle = K.gold; c.beginPath(); c.roundRect(x - 17, y - 23, 34, 38, kind === 2 ? 6 : 11); c.fill();
  fill(c, K.white, x - 11, y - 16, 22, 13); disc(c, K.white, x - 9, y + 7, 3.5); disc(c, K.white, x + 9, y + 7, 3.5);       // its window and its lights
  if (kind === 2) { fill(c, K.gold, x - 15, y + 15, 9, 7); fill(c, K.gold, x + 6, y + 15, 9, 7); }                             // a coach stands on wheels,
  else { stroke(c, K.gold, 4); c.beginPath(); c.moveTo(x - 9, y + 15); c.lineTo(x - 15, y + 24); c.moveTo(x + 9, y + 15); c.lineTo(x + 15, y + 24); c.stroke(); }   // and a train on rails
}

// The map on the Amenities spread, simplified: King Street as one thick line across the fold, the streets that cross it, a square
// for each shop or restaurant with its name set sideways, and the building's own logo in a ring. Drawn in the spread's units, 2200 x 850.
// The flyer has about twice as many squares, and they are smaller. Their names are drawn as bars; the streets' names are spelled out.
const STREETS = [['York Street', 338], ['Bay Street', 946], ['Yonge Street', 1380], ['Church Street', 2026]];
const KING = { y: 426, runs: [[92, 438], [762, 1007], [1319, 1600], [1912, 2037]], names: [['King Street W', 600], ['King Street W', 1163], ['King Street E', 1760]] };
const BADGE = [1273, 457, 72, 146];
// each run of squares: where the first one starts, the step to the next, and how long the names are above the street and below it
const SHOPS = [
  [150, 55, [111, 212, 189], [102, 205, 162]],
  [380, 72, [108, 140, 200, 126, 54, 113, 113, 153], [187, 248, 221, 171, 105, 140, 227, 282]],
  [985, 60, [101, 151, 50, 239, 160, 74], [47, 158, 149, 230]],
  [1420, 72, [205, 185, 95, 248, 176, 168, 177, 59], [117, 263, 187, 232, 74, 90, 225, 243]],
];
const NAME = 'rgba(255,255,255,0.5)';                       // a shop's name: light type, which is a soft grey from far off
// one street that crosses King Street: a thin line, broken twice by the street's name. xAt: where the line is at a given height.
function crossing(c, name, xAt, tilt = Math.PI / 2) {
  c.font = `400 28px ${SANS}`; if ('letterSpacing' in c) c.letterSpacing = '0px';
  const half = c.measureText(name).width / 2 + 14;
  stroke(c, K.lite, 3); c.beginPath();
  for (const [a, b] of [[98, 225 - half], [225 + half, 630 - half], [630 + half, 755]]) if (b - a > 10) { c.moveTo(xAt(a), a); c.lineTo(xAt(b), b); }
  c.stroke();
  for (const y of [225, 630]) { c.save(); c.translate(xAt(y), y); c.rotate(tilt); text(c, name, 0, 10, 28, { w: 400, fill: K.lite, align: 'center', track: 0, family: SANS }); c.restore(); }
}
function amenities(c, off = 0, { markers = true, labels = true, badge = true } = {}) {
  c.save(); c.translate(-off, 0);
  for (const [name, x] of STREETS) crossing(c, name, () => x);
  crossing(c, 'University Avenue', y => 52 + (y - 98) * 99 / 654, Math.atan2(654, 99));                       // which crosses at a slant
  stroke(c, K.gold, 20); c.lineCap = 'round'; c.beginPath(); for (const [a, b] of KING.runs) { c.moveTo(a + 10, KING.y); c.lineTo(b - 10, KING.y); } c.stroke();
  for (const [name, x] of KING.names) text(c, name, x, KING.y + 15, 44, { w: 700, fill: K.gold, align: 'center', track: 0, family: SANS });
  for (const [x0, step, above, below] of SHOPS) {
    above.forEach((len, i) => { if (markers) fill(c, K.white, x0 + i * step, 358, 30, 30); if (labels) fill(c, NAME, x0 + i * step + 9.5, 344 - len, 11, len); });
    below.forEach((len, i) => { if (markers) fill(c, K.white, x0 + i * step, 464, 30, 30); if (labels) fill(c, NAME, x0 + i * step + 9.5, 508, 11, len); });
  }
  if (badge) {
  const [bx, by, bw, bh] = BADGE;
  c.fillStyle = K.coal; c.beginPath(); c.roundRect(bx, by, bw, bh, bw / 2); c.fill(); stroke(c, K.lite, 6); c.stroke();
  c.save(); c.translate(bx + bw / 2, by + bh / 2); c.rotate(Math.PI / 2); kingLogo(c, -52, -28, 104); c.restore();
  }
  if (markers) north(c, 128, 150);
  c.restore();
}

// every picture: its size in px, and how to draw it. A picture with no background of its own is see-through there.
export const ART = {
  ...Object.fromEntries([['Tablet', 59, 41], ['Phone', 18, 39], ['Sq', 8, 8]].map(([shape, w, h]) => ['paper' + shape, { w, h, draw(c, w, h) { fill(c, C.paper, 0, 0, w, h); } }])),
  paperTile: { w: 8, h: 8, draw(c, w, h) { fill(c, C.paper, 0, 0, w, h); } },
  ...Object.fromEntries([['cover', 288, 340], ['post', 400, 400], ['mail', 228, 235]].map(([key, w, h]) => [key + 'Image', { w, h, photoProfile: key, draw(c, w, h) { street(c, 0, 0, w, h, PHOTO_VIEWS[key]); } }])),
  // Frame styles retain the firm's small mark, bands, grounds, frame and divider.
  ...Object.fromEntries([['coverPhoto', 'kCover', true, true], ['coverBlob', 'kCover', false, true], ['coverDecor', 'kCover', false, false], ['postPhoto', 'kPost', true, true], ['mailPhoto', 'eblast', true, true]].map(([key, source, noBuilding, noTab]) => [key, { w: source === 'kCover' ? 440 : source === 'kPost' ? 400 : 320, h: source === 'kCover' ? 340 : source === 'kPost' ? 400 : 472, draw(c, w, h) {
    hideText = true; hideBuilding = noBuilding; hideTabs = noTab;
    try { ART[source].draw(c, w, h); } finally { hideText = hideBuilding = hideTabs = false; }
  } }])),
  mailButtonStyle: { w: 320, h: 472, draw(c, w, h) { hideText = true; try { ART.eblast.draw(c, w, h); } finally { hideText = false; } } },
  mapStreet: { w: 1100, h: 425, draw(c, w, h) { c.scale(w / 2200, h / 850); fill(c, K.coal, 0, 0, 2200, 850); hideText = true; try { amenities(c, 0, { markers: false, labels: false, badge: false }); } finally { hideText = false; } } },
  locBlocks: { w: 541, h: 340, draw(c, w, h) { c.scale(w / 1352, h / 850); hideText = true; try { cityMap(c, 0, { streets: false, pins: false }); } finally { hideText = false; } } },
  locStreets: { w: 541, h: 340, draw(c, w, h) { c.scale(w / 1352, h / 850); hideText = true; try { cityMap(c, 0, { pins: false }); } finally { hideText = false; } } },
  locPins: { w: 541, h: 340, draw(c, w, h) { c.scale(w / 1352, h / 850); hideText = true; try { cityMap(c); } finally { hideText = false; } } },
  idHeading: { w: 100, h: 500, draw(c) {
    c.font = `700 80px ${SERIF}`; if ('letterSpacing' in c) c.letterSpacing = '0px';
    TYPE_EDGES.idHeading = [8, ...Array.from('Amenities', (_, i) => 8 + c.measureText('Amenities'.slice(0, i + 1)).width)];
    c.translate(-970, -180); ART.kAmR.draw(c, 1100, 850);
  } },
  ...Object.fromEntries([1, 2, 3].flatMap(build => ['Wide', 'Tablet', 'Tall'].map((shape, i) => ['uiBuild' + build + shape, { w: i === 1 ? 164 : i ? 180 : 480, h: [300, 236, 390][i], draw(c, w, h) { site(c, w, h, { build }); } }]))),
  heroSource: { w: 226, h: 228, draw(c) { c.translate(-665 / 3, -119 / 3); site(c, 480, 300); } },
  ...Object.fromEntries(['Danial', 'Endrawes'].map((words, i) => ['siteName' + i, { w: 160, h: 38, draw(c) { fill(c, C.ink, 0, 0, 160, 38); recordType(c, 'siteName' + i, words, 59 / 3 - 18, 106 / 3); text(c, words, 59 / 3 - 18, (i ? 426 : 328) / 3 - (i ? 107 : 74), 106 / 3, { fill: C.paper }); } }])),
  ...Object.fromEntries(['Raw', 'Half', 'Levels', 'Sky'].map((step, i) => ['photo' + step, { w: 526, h: 360, draw(c, w, h) {
    const darken = (hex, amount) => '#' + hex.slice(1).match(/../g).map(v => Math.round(parseInt(v, 16) * amount).toString(16).padStart(2, '0')).join('');
    const look = Object.fromEntries(Object.entries(LOOK.raw).map(([key, value]) => [key, Array.isArray(value) ? value : darken(value, [0.8, 0.9, 1, 1][i])]));
    look.sky = i < 3 ? ['#C1C2BF', '#C1C2BF'] : LOOK.graded.sky;
    street(c, 0, 0, w, h, { at: 0.44, look });
    // Two deliberate distractions, removed by separate healing clicks.
    quad(c, '#D37632', [[68, 286], [83, 245], [98, 286]]); fill(c, '#E1D6BA', 73, 264, 20, 7); fill(c, '#494846', 62, 286, 42, 7);
    fill(c, '#A58751', 28, 260, 45, 8); fill(c, '#494846', 31, 268, 4, 23); fill(c, '#494846', 65, 268, 4, 23);
    stroke(c, '#8F7850', 7); c.beginPath(); c.moveTo(364, 20); c.lineTo(511, 69); c.stroke();
    stroke(c, '#8F7850', 2); c.beginPath(); c.moveTo(364, 20); c.lineTo(502, 42); c.lineTo(511, 69); c.moveTo(459, 53); c.lineTo(459, 92); c.stroke();
  } }])),
  photoNoCone: { w: 526, h: 360, draw(c, w, h) {
    street(c, 0, 0, w, h, { at: 0.44, look: { ...LOOK.raw, sky: LOOK.graded.sky } });
    stroke(c, '#8F7850', 7); c.beginPath(); c.moveTo(364, 20); c.lineTo(511, 69); c.stroke();
    stroke(c, '#8F7850', 2); c.beginPath(); c.moveTo(364, 20); c.lineTo(502, 42); c.lineTo(511, 69); c.moveTo(459, 53); c.lineTo(459, 92); c.stroke();
  } },
  photoClean: { w: 526, h: 360, draw(c, w, h) { street(c, 0, 0, w, h, { at: 0.44, look: { ...LOOK.raw, sky: LOOK.graded.sky } }); } },
  brushRing: { w: 64, h: 64, draw(c) { stroke(c, C.paper, 5); c.beginPath(); c.arc(32, 32, 28, 0, Math.PI * 2); c.stroke(); } },
  tWand: { w: 64, h: 64, draw(c) { stroke(c, C.paper, 6); c.beginPath(); c.moveTo(12, 52); c.lineTo(42, 22); c.stroke(); [[40, 6], [57, 23], [25, 8]].forEach(([x, y]) => { fill(c, C.paper, x - 2, y - 5, 4, 10); fill(c, C.paper, x - 5, y - 2, 10, 4); }); } },
  tClock: { w: 40, h: 40, draw(c) { stroke(c, C.grey, 3); c.beginPath(); c.arc(20, 23, 12, 0, Math.PI * 2); c.moveTo(20, 14); c.lineTo(20, 23); c.lineTo(27, 23); c.stroke(); fill(c, C.grey, 15, 3, 10, 4); fill(c, C.grey, 18, 6, 4, 5); } },
  tBlade: { w: 40, h: 40, draw(c) { quad(c, C.paper, [[7, 28], [24, 5], [35, 13], [18, 36]]); stroke(c, C.red, 2); c.beginPath(); c.moveTo(15, 25); c.lineTo(25, 12); c.stroke(); } },
  histoDark: { w: 240, h: 100, draw(c) { for (let i = 0; i < 48; i++) { const v = 8 + 78 * Math.exp(-(((i - 10) / 8) ** 2)) * (0.6 + 0.4 * Math.abs(Math.sin(i * 1.7))); fill(c, C.grey, i * 5, 100 - v, 4, v); } } },
  redBall: { w: 32, h: 32, draw(c) { fill(c, C.paper, 0, 0, 32, 32); disc(c, C.red, 16, 16, 16); } },
  tapDot: { w: 32, h: 32, draw(c) { disc(c, C.paper, 16, 16, 16); } },
  ...Object.fromEntries(['a', 'b', 'c'].flatMap((shot, i) => ['Tall', 'Sq', 'Tablet'].map((shape, j) => [(['shotA', 'shotB', 'shotCfx'][i]) + shape, { w: j === 2 ? 472 : 300, h: j === 2 ? 328 : j ? 300 : 650, draw(c, w, h) { if (shot === 'a') SHOTS.a(c, w, h, { k: j === 2 ? h * 0.36 : j ? 105 : 138, cap: false }); else if (shot === 'b') SHOTS.b(c, w, h); else SHOTS.c(c, w, h, C.red); } }]))),
  ...Object.fromEntries(['Wide', 'Tablet', 'Tall'].flatMap((shape, i) => [0, 1].map(craft => ['uiPage' + shape + craft, { w: i === 1 ? 164 : i ? 180 : 480, h: [420, 330, 546][i], draw(c, w, h) { const vh = h / 1.4; site(c, w, vh, { craft }); fill(c, C.ink, 0, vh, w, h - vh); } }]))),
  ...Object.fromEntries([['Wide', 152, 100], ['Tablet', 156, 236], ['Tall', 114, 260]].flatMap(([shape, w, h]) => [0, 1, 2].map(i => ['uiWork' + shape + i, { w, h, draw(c, w, h) { fill(c, C.line, 0, 0, w, h); if (!i) SHOTS.a(c, w, h * 0.68, { cap: false }); else if (i === 1) SHOTS.b(c, w, h * 0.68); else SHOTS.c(c, w, h * 0.68); fill(c, C.paper, w * 0.08, h * 0.79, w * 0.60, h * 0.04); fill(c, C.slate, w * 0.08, h * 0.89, w * 0.42, h * 0.03); } }]))),
  interaction: { w: 200, h: 160, draw(c) { fill(c, C.night, 0, 0, 200, 160); ['On tap', 'Change to Video', 'Instant'].forEach((s, i) => { text(c, s, 10, 30 + i * 45, 17, { w: 400, fill: C.paper, track: 0 }); fill(c, C.line, 10, 39 + i * 45, 180, 1); }); } },
  chromeLaptop: { w: 480, h: 300, draw(c, w) { fill(c, C.line, 0, 0, w, 24); for (let i = 0; i < 3; i++) disc(c, C.slate, 14 + i * 12, 12, 3); fill(c, C.ink, 120, 5, 240, 14); fill(c, C.slate, 136, 11, 110, 3); } },
  chromeTablet: { w: 164, h: 236, draw(c, w, h) { fill(c, C.line, 0, 0, w, h * 0.055); fill(c, C.paper, 8, 5, 14, 2); fill(c, C.slate, w - 25, 5, 17, 2); fill(c, C.line, 0, h * 0.965, w, h * 0.035); fill(c, C.paper, w * 0.36, h * 0.98, w * 0.28, 1.5); } },
  chromeHandset: { w: 180, h: 390, draw(c, w, h) { ART.chromeTablet.draw(c, w, h); } },
  // Chrome contains only the device's furniture. The moving picture is made of pieces underneath.
  chromePlayer: { w: 472, h: 328, draw(c) { playIcon(c, C.paper, 30, 303, 9); fill(c, C.slate, 54, 301, 392, 5); } },
  chromeReel: { w: 300, h: 650, draw(c, w) {
    [368, 422, 476].forEach((y, i) => { if (i === 0) heart(c, C.paper, 266, y, 13); else if (i === 1) { stroke(c, C.paper, 4); c.beginPath(); c.arc(266, y, 11, 0, Math.PI * 2); c.stroke(); } else playIcon(c, C.paper, 266, y, 11); });
    disc(c, C.paper, 34, 580, 15); fill(c, C.paper, 60, 570, 96, 9); fill(c, C.grey, 60, 587, 64, 6); lines(c, C.grey, 20, 612, [210, 150], 6, 8); fill(c, C.slate, 20, 50, 260, 4); fill(c, C.paper, 100, 638, 100, 5);
  } },
  chromeFeed: { w: 300, h: 650, draw(c, w, h) { ART.feedSq.draw(c, w, h); c.clearRect(0, 112, 300, 300); fill(c, C.ink, 252, 124, 34, 34); playIcon(c, C.paper, 269, 141, 8); fill(c, C.grey, 0, 404, 300, 8); } },
  chromeMotion: { w: 472, h: 328, draw(c) { playIcon(c, C.ink, 30, 303, 9); fill(c, C.grey, 54, 301, 392, 5); } },
  chromeStory: { w: 300, h: 650, draw(c, w) {
    for (let i = 0; i < 3; i++) fill(c, C.grey, 20 + i * 88, 50, 84, 4);
    disc(c, C.ink, 34, 82, 13); fill(c, C.ink, 56, 74, 90, 8); fill(c, C.grey, 56, 88, 56, 6);
    fill(c, C.red, 90, 598, 120, 30); fill(c, C.paper, 118, 610, 64, 6); fill(c, C.ink, 100, 638, 100, 5);
  } },
  chromeMotionFeed: { w: 300, h: 650, draw(c, w, h) { ART.motSq.draw(c, w, h); c.clearRect(0, 184, 300, 300); } },
  chromeBrowser: { w: 480, h: 270, draw(c, w, h) { ART.siteWide.draw(c, w, h); c.clearRect(0, 24, w, h - 24); } },
  chromePhone: { w: 300, h: 650, draw(c, w, h) { ART.siteTall.draw(c, w, h); c.clearRect(0, 74, w, 550); } },
  // ---- the building's photograph, before and after its edit in Photoshop, and that app's own bits
  kPhotoB: { w: 526, h: 360, draw(c, w, h) { street(c, 0, 0, w, h, { at: 0.44, raw: true }); } },
  kPhoto: { w: 526, h: 360, draw(c, w, h) { street(c, 0, 0, w, h, { at: 0.44 }); } },
  eye: { w: 48, h: 48, draw(c) { c.fillStyle = C.grey; c.beginPath(); c.ellipse(24, 24, 19, 11, 0, 0, Math.PI * 2); c.fill(); disc(c, C.night, 24, 24, 6); } },
  histo: { w: 160, h: 64, draw(c, w, h) { c.fillStyle = C.grey; c.beginPath(); c.moveTo(0, h); [[0, 52], [18, 44], [34, 20], [50, 34], [70, 8], [92, 30], [112, 22], [132, 46], [160, 54]].forEach(([x, y]) => c.lineTo(x, y)); c.lineTo(w, h); c.closePath(); c.fill(); } },
  // ---- the booklet's two maps, as Illustrator's artboards: King Street from the Amenities spread, downtown from the Location spread,
  // and a part of the second close up
  kMap: { w: 1100, h: 425, draw(c, w, h) { c.scale(w / 2200, h / 850); fill(c, K.coal, 0, 0, 2200, 850); amenities(c); } },
  kLoc: { w: 541, h: 340, draw(c, w, h) { c.scale(w / 1352, h / 850); cityMap(c); } },
  kLocClose: { w: SPOT[2], h: SPOT[3], draw(c, w, h) { c.scale(w / SPOT[2], h / SPOT[3]); c.translate(-SPOT[0], -SPOT[1]); cityMap(c); } },
  // ---- the 1 King Street W booklet: its front cover and the four openings it turns through, and its back cover small, for the pages panel
  kCover: { w: 440, h: 340, draw: page(c => {
    street(c, 380, 0, 720, 850, PHOTO_VIEWS.cover); fadeIn(c, 380, 650, 850);
    firmLogo(c); kingLogo(c, 50, 482, 588, true); tab(c, 779, 670, 330, 130, 45, 'Office Space', 'For Sale');
  }) },
  kOfferL: { w: 440, h: 340, draw: page(c => {
    fill(c, K.coal, 0, 0, 1100, 850); pins(c, 0); firmLogo(c);
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
  kAmL: { w: 440, h: 340, draw: page(c => { fill(c, K.coal, 0, 0, 1100, 850); amenities(c, 0); firmLogo(c); folio(c, 50, '5'); }) },
  kAmR: { w: 440, h: 340, draw: page(c => { fill(c, K.coal, 0, 0, 1100, 850); amenities(c, 1100); kingLogo(c, 950, 50, 98); upTitle(c, 'Amenities'); folio(c, 1006, '6'); }) },
  kLocL: { w: 440, h: 340, draw: page(c => { cityMap(c, 0); folio(c, 50, '3'); }) },
  kLocR: { w: 440, h: 340, draw: page(c => {
    fill(c, K.coal, 0, 0, 1100, 850); cityMap(c, 1100); fill(c, K.gold, 253, 0, 20, 850); kingLogo(c, 950, 50, 98);
    heading(c, 'Public Transportation', 300, 183);
    [[264, ['King Subway Station'], 212], [385, ['Union Station / Via Rail /', 'GO Transit / UP Express'], 222], [506, ['Toronto Coach Terminal'], 232]].forEach(([y, names, len], i) => {
      const top = y - (names.length > 1 ? 22 : 7);            // the first line's foot: the ways to travel are spelled out, and how long each takes is a bar
      sign(c, 364, y, i); names.forEach((name, n) => text(c, name, 424, top + n * 30, 24, { w: 700, fill: K.gold, track: 0, family: SANS }));
      fill(c, K.soft, 424, top + names.length * 30 - 12, len, 8);
    });
    heading(c, 'Direct indoor', 300, 650, 2); text(c, 'access to the PATH', 324, 700, 50, { w: 700, fill: K.white, track: 0.01, family: SERIF });
    upTitle(c, 'Location'); folio(c, 1006, '4');
  }) },
  kGalL: { w: 440, h: 340, draw: page(c => { fill(c, K.coal, 0, 0, 1100, 850); gallery(c, 0); firmLogo(c); folio(c, 47, '7'); }) },
  kGalR: { w: 440, h: 340, draw: page(c => { fill(c, K.coal, 0, 0, 1100, 850); gallery(c, 1100); upTitle(c, 'Gallery'); kingLogo(c, 950, 50, 98); folio(c, 1006, '8'); }) },
  kBack: { w: 220, h: 170, draw: page(c => {
    fill(c, K.black, 0, 0, 1100, 850); weave(c, 0, 0, 1100, 850);
    c.save(); c.beginPath(); c.moveTo(35, 0); c.lineTo(427, 0); c.lineTo(621, 850); c.lineTo(211, 850); c.closePath(); c.clip(); street(c, 0, 0, 640, 850, { at: 0.52, zoom: 0.8, drop: 0.2 }); c.restore();
    quad(c, K.gold, [[24, 0], [35, 0], [211, 850], [200, 850]]); quad(c, K.gold, [[427, 0], [438, 0], [632, 850], [621, 850]]);
    kingLogo(c, 86, 530, 495, true);
    c.fillStyle = K.gold; c.beginPath(); c.moveTo(460, 143); c.lineTo(841, 143); c.arcTo(941, 143, 941, 243, 100); c.lineTo(941, 290); c.lineTo(493, 290); c.closePath(); c.fill();   // the panel, with the firm's name only
    firmLogo(c, K.white, 548, 186, 240);
    fill(c, K.soft, 780, 712, 270, 9); fill(c, K.soft, 940, 736, 110, 9); fill(c, K.lite, 955, 760, 95, 9); fill(c, 'rgba(255,255,255,0.3)', 650, 786, 400, 4); fill(c, 'rgba(255,255,255,0.3)', 670, 796, 380, 4);
  }) },
  // ---- the same listing as a LinkedIn post and as an e-blast. Dan left these to me: they follow the flyer loosely.
  kPost: { w: 400, h: 400, draw(c, w, h) {               // the post: the photograph edge to edge, the pattern as a band along the top, the logo over a dark foot
    c.scale(w / 1000, h / 1000); street(c, 0, 0, 1000, 1000, PHOTO_VIEWS.post);
    fill(c, K.black, 0, 0, 1000, 150); weave(c, 0, 0, 1000, 150, K.weave, 44); firmLogo(c, K.lite, 56, 48, 214);
    const g = c.createLinearGradient(0, 500, 0, 1000); g.addColorStop(0, 'rgba(10,15,22,0)'); g.addColorStop(0.7, 'rgba(10,15,22,0.9)'); g.addColorStop(1, K.black); c.fillStyle = g; c.fillRect(0, 500, 1000, 500);
    kingLogo(c, 50, 610, 600, true); tab(c, 690, 788, 320, 146, 50, 'Office Space', 'For Sale');
  } },
  post: { w: 300, h: 650, draw(c, w, h) {                 // that post in the LinkedIn feed, on a phone
    fill(c, '#FFFFFF', 0, 0, w, h);
    c.fillStyle = '#0A66C2'; c.beginPath(); c.roundRect(16, 50, 28, 28, 5); c.fill(); text(c, 'in', 30, 71, 19, { w: 700, fill: '#FFFFFF', align: 'center', track: 0, family: SANS });
    c.fillStyle = '#EEF0F2'; c.beginPath(); c.roundRect(56, 52, 176, 24, 12); c.fill(); disc(c, C.grey, 264, 64, 9); fill(c, '#E4E3DF', 0, 90, w, 1.5);
    disc(c, K.black, 36, 122, 17); firmLogo(c, K.lite, 24, 118.5, 24);
    fill(c, C.ink, 64, 111, 96, 9); fill(c, C.grey, 64, 127, 62, 6); for (let i = 0; i < 3; i++) disc(c, C.slate, 262 + i * 9, 120, 2.6);
    lines(c, C.grey, 18, 150, [250, 190], 6, 8);
    c.save(); c.translate(0, 184); ART.kPost.draw(c, 300, 300); c.restore();
    for (let i = 0; i < 3; i++) disc(c, ['#0A66C2', C.red, '#4C9A52'][i], 24 + i * 11, 504, 7); fill(c, C.grey, 62, 501, 44, 6); fill(c, C.grey, 214, 501, 68, 6);    // who reacted, and how many comments
    fill(c, '#E4E3DF', 18, 522, w - 36, 1.5);
    [0, 1, 2, 3].forEach(i => { stroke(c, C.slate, 3); c.strokeRect(32 + i * 68, 540, 16, 14); fill(c, C.grey, 24 + i * 68, 562, 32, 5); });
    fill(c, '#E4E3DF', 0, 576, w, 1.5); for (let i = 0; i < 5; i++) fill(c, i === 0 ? C.ink : C.grey, 27 + i * 56, 592, 20, 20); fill(c, C.ink, 100, 636, 100, 5);
  } },
  eblast: { w: 320, h: 472, draw(c, w, h) {              // the e-blast: the photograph in the flyer's frame with the logo across its corner, then the two units
    c.scale(w / 800, h / 1180); fill(c, K.coal, 0, 0, 800, 1180);
    fill(c, K.black, 0, 0, 800, 120); weave(c, 0, 0, 800, 120, K.weave, 40); firmLogo(c, K.lite, 44, 34, 196);
    const frame = () => { c.beginPath(); c.roundRect(300, 168, 456, 470, [0, 170, 0, 0]); };
    c.save(); frame(); c.clip(); street(c, 300, 168, 456, 470, PHOTO_VIEWS.mail); c.restore(); stroke(c, K.gold, 7); frame(); c.stroke();
    kingLogo(c, 44, 404, 430, true);
    heading(c, 'Office Space For Sale', 44, 726); fill(c, K.lite, 44, 752, 330, 12); lines(c, K.soft, 44, 786, [712, 690, 520], 9, 17);
    [[150, '1201'], [520, '1502']].forEach(([x, n]) => {
      text(c, 'Unit', x, 930, 50, { w: 700, fill: K.white, track: 0, family: SANS }); text(c, n, x + 23, 950, 45, { w: 700, fill: K.lite, track: 0.03, family: SERIF });
      fill(c, K.soft, x, 978, 130, 9); fill(c, K.soft, x, 1000, 96, 9);
    });
    fill(c, K.gold, 399, 880, 3, 132);
    if (!hideTabs) { c.fillStyle = K.gold; c.beginPath(); c.roundRect(44, 1040, 262, 72, [28, 0, 0, 0]); c.fill(); text(c, 'View the flyer', 70, 1087, 30, { w: 700, fill: K.white, track: 0, family: SANS }); }
    fill(c, K.black, 0, 1140, 800, 40);
  } },
  // R12: a 1640:2360 mail viewport. The complete e-blast fits below its header, on the app's own ground.
  mail: { w: 328, h: 472, draw(c, w, h) {                 // the e-blast, open in a mail app on a tablet
    fill(c, '#F3F2EE', 0, 0, w, h); disc(c, K.black, 30, 29, 15); firmLogo(c, K.lite, 19.5, 26, 21);
    fill(c, C.ink, 56, 17, 150, 9); fill(c, C.grey, 56, 34, 96, 6); for (let i = 0; i < 3; i++) disc(c, C.slate, w - 36 + i * 9, 29, 2.6);
    c.save(); const eh = h - 58, ew = eh * 800 / 1180; c.translate((w - ew) / 2, 58); ART.eblast.draw(c, ew, eh); c.restore();
  } },
  // ---- video: one edit, on three screens
  shotA: { w: 480, h: 270, draw(c, w, h) { SHOTS.a(c, w, h, { cap: false }); } },
  shotB: { w: 480, h: 270, draw(c, w, h) { SHOTS.b(c, w, h); } },
  shotCfx: { w: 480, h: 270, draw(c, w, h) { SHOTS.c(c, w, h, C.red); } },
  ...Object.fromEntries(['Look good.', 'Move well.', 'Work right.'].map((words, i) => ['cap' + (i + 1), { w: 352, h: 74, draw(c, w, h) { fill(c, C.paper, 0, 0, w, h); recordType(c, 'cap' + (i + 1), words, w / 2, 54, 'center', 55); text(c, words, w / 2, 55, 54, { align: 'center' }); } }])),
  playerWide: { w: 472, h: 328, draw(c, w, h) {
    SHOTS.a(c, w, h, { capY: h * 0.76 });
    playIcon(c, C.paper, 30, 303, 9); fill(c, 'rgba(247,246,243,0.45)', 54, 301, 392, 5); fill(c, C.paper, 54, 301, 236, 5); fill(c, C.paper, 286, 295, 6, 17);
  } },
  reel: { w: 300, h: 650, draw(c, w, h) {
    SHOTS.a(c, w, h, { k: 138, capY: 462, capPx: 40 });
    [368, 422, 476].forEach((y, i) => { if (i === 0) heart(c, C.paper, 266, y, 13); else if (i === 1) { stroke(c, C.paper, 4); c.beginPath(); c.arc(266, y, 11, 0, Math.PI * 2); c.stroke(); } else playIcon(c, C.paper, 266, y, 11); });
    disc(c, C.paper, 34, 580, 15); fill(c, C.paper, 60, 570, 96, 9); fill(c, 'rgba(247,246,243,0.6)', 60, 587, 64, 6); lines(c, 'rgba(247,246,243,0.6)', 20, 612, [210, 150], 6, 8);
    fill(c, 'rgba(247,246,243,0.4)', 20, 50, 260, 4); fill(c, C.paper, 20, 50, 150, 4); fill(c, C.paper, 100, 638, 100, 5);
  } },
  feedSq: { w: 300, h: 650, draw(c, w, h) {               // the square cut, in a feed on a phone
    fill(c, '#FFFFFF', 0, 0, w, h);
    const ring = c.createLinearGradient(18, 60, 54, 96); ring.addColorStop(0, '#F9A23B'); ring.addColorStop(1, '#D62D7B'); stroke(c, ring, 3.5); c.beginPath(); c.arc(36, 78, 17, 0, Math.PI * 2); c.stroke(); disc(c, C.ink, 36, 78, 12);
    fill(c, C.ink, 64, 68, 96, 9); fill(c, C.grey, 64, 84, 62, 6); for (let i = 0; i < 3; i++) disc(c, C.slate, 262 + i * 9, 78, 2.6);
    c.save(); c.translate(0, 112); SHOTS.a(c, 300, 300, { k: 105, capY: 242, capPx: 28 }); c.restore();
    fill(c, C.ink, 252, 124, 34, 34); playIcon(c, C.paper, 269, 141, 8); fill(c, 'rgba(247,246,243,0.45)', 0, 404, w, 8); fill(c, C.paper, 0, 404, 175, 8);
    heart(c, C.red, 30, 442, 11); stroke(c, C.slate, 3); c.beginPath(); c.arc(68, 441, 10, 0, Math.PI * 2); c.stroke(); playIcon(c, C.slate, 104, 441, 10);
    lines(c, C.grey, 18, 470, [250, 170], 6, 8); disc(c, C.ink, 36, 564, 13); fill(c, C.ink, 64, 554, 96, 9); fill(c, C.grey, 64, 570, 62, 6); fill(c, '#E4E3DF', 0, 590, w, 1.5); for (let i = 0; i < 5; i++) fill(c, i === 0 ? C.ink : C.grey, 27 + i * 56, 604, 20, 20); fill(c, C.ink, 100, 638, 100, 5);
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
  // ---- motion: the animation's frame, the three screens it is exported to, and After Effects' own bits
  wMake: { w: 232, h: 62, draw(c) { fill(c, C.paper, 0, 0, 232, 62); recordType(c, 'wMake', 'Make it', 6, 60, 'left', 54); text(c, 'Make it', 6, 54, 60); } },
  wMove: { w: 168, h: 52, draw(c) { fill(c, C.paper, 0, 0, 168, 52); recordType(c, 'wMove', 'move', 6, 60, 'left', 44.2); text(c, 'move', 6, 44.2, 60, { fill: C.red }); } },
  rowA: { w: 140, h: 38, draw(c) { c.translate(-ROWS[0][0], -ROWS[0][1]); saas(c, 480, 270); } },
  rowB: { w: 140, h: 38, draw(c) { c.translate(-ROWS[1][0], -ROWS[1][1]); saas(c, 480, 270); } },
  graphGrid: { w: 240, h: 200, draw(c, w, h) { for (let i = 0; i < 5; i++) { fill(c, C.dark, 0, 19 + i * 40, w, 2); fill(c, C.dark, 19 + i * 50, 0, 2, h); } } },
  compWide: { w: 480, h: 270, draw(c, w, h) { saas(c, w, h); } },
  motWide: { w: 472, h: 328, draw(c, w, h) {               // in a player
    saas(c, w, h, { x: 34, y: 133, px: 60, rows: [288, 91, 140, 3] }); playIcon(c, C.ink, 30, 303, 9); fill(c, 'rgba(21,19,20,0.25)', 54, 301, 392, 5); fill(c, C.ink, 54, 301, 250, 5); fill(c, C.ink, 300, 295, 6, 17);
  } },
  motTall: { w: 300, h: 650, draw(c, w, h) {               // as a story, with its call to act
    saas(c, w, h, { x: 26, y: 236, px: 62, rows: [26, 366, 180, 3] });
    for (let i = 0; i < 3; i++) fill(c, i === 0 ? C.ink : 'rgba(21,19,20,0.25)', 20 + i * 88, 50, 84, 4);
    disc(c, C.ink, 34, 82, 13); fill(c, C.ink, 56, 74, 90, 8); fill(c, C.grey, 56, 88, 56, 6);
    fill(c, C.red, 90, 598, 120, 30); fill(c, C.paper, 118, 610, 64, 6); fill(c, C.ink, 100, 638, 100, 5);
  } },
  motSq: { w: 300, h: 650, draw(c, w, h) {                 // square, as a post in a feed
    fill(c, '#FFFFFF', 0, 0, w, h);
    c.fillStyle = '#0A66C2'; c.beginPath(); c.roundRect(16, 50, 28, 28, 5); c.fill(); text(c, 'in', 30, 71, 19, { w: 700, fill: '#FFFFFF', align: 'center', track: 0, family: SANS });
    c.fillStyle = '#EEF0F2'; c.beginPath(); c.roundRect(56, 52, 176, 24, 12); c.fill(); disc(c, C.grey, 264, 64, 9); fill(c, '#E4E3DF', 0, 90, w, 1.5);
    disc(c, C.ink, 36, 122, 17); fill(c, C.ink, 64, 111, 96, 9); fill(c, C.grey, 64, 127, 62, 6); for (let i = 0; i < 3; i++) disc(c, C.slate, 262 + i * 9, 120, 2.6);
    lines(c, C.grey, 18, 150, [250, 190], 6, 8);
    c.save(); c.translate(0, 184); c.beginPath(); c.rect(0, 0, 300, 300); c.clip(); saas(c, 300, 300, { x: 20, y: 92, px: 50, rows: [146, 180, 120, 2] }); c.restore();
    [0, 1, 2, 3].forEach(i => { stroke(c, C.slate, 3); c.strokeRect(32 + i * 68, 500, 16, 14); fill(c, C.grey, 24 + i * 68, 522, 32, 5); });
    disc(c, C.ink, 36, 564, 13); fill(c, C.ink, 64, 554, 96, 9); fill(c, C.grey, 64, 570, 62, 6); fill(c, '#E4E3DF', 0, 590, w, 1.5); for (let i = 0; i < 5; i++) fill(c, i === 0 ? C.ink : C.grey, 27 + i * 56, 604, 20, 20); fill(c, C.ink, 100, 638, 100, 5);
  } },
  graph: { w: 240, h: 200, draw(c, w, h) {                 // the ease between two keyframes: slow out of the first, slow into the second
    for (let i = 0; i < 5; i++) { fill(c, C.dark, 0, 19 + i * 40, w, 2); fill(c, C.dark, 19 + i * 50, 0, 2, h); }
    stroke(c, C.grey, 3); c.beginPath(); c.moveTo(24, 176); c.lineTo(128, 176); c.moveTo(216, 24); c.lineTo(112, 24); c.stroke(); disc(c, C.grey, 128, 176, 6); disc(c, C.grey, 112, 24, 6);
    stroke(c, C.red, 6); c.beginPath(); c.moveTo(24, 176); c.bezierCurveTo(128, 176, 112, 24, 216, 24); c.stroke();
    fill(c, C.paper, 16, 168, 16, 16); fill(c, C.paper, 208, 16, 16, 16);
  } },
  kf: { w: 32, h: 32, draw(c) { c.translate(16, 16); c.rotate(Math.PI / 4); fill(c, C.paper, -9, -9, 18, 18); } },         // a keyframe, and one that is selected
  kfOn: { w: 32, h: 32, draw(c) { c.translate(16, 16); c.rotate(Math.PI / 4); fill(c, C.red, -10, -10, 20, 20); } },
  lStar: { w: 40, h: 40, draw(c) { c.fillStyle = C.grey; c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 7 : 16; c.lineTo(20 + r * Math.cos(a), 21 + r * Math.sin(a)); } c.closePath(); c.fill(); } },   // a shape layer
  // ---- UX/UI: the page's hero as Figma's frames (wireframes and designs), the same page exported to three screens, and Figma's own bits
  uiWide: { w: 480, h: 300, draw(c, w, h) { site(c, w, h); } },
  uiTall: { w: 180, h: 390, draw(c, w, h) { site(c, w, h); } },
  uiTablet: { w: 164, h: 236, draw(c, w, h) { site(c, w, h); } },
  wireWide: { w: 320, h: 200, draw(c, w, h) { site(c, w, h, { wire: true }); } },
  wireTall: { w: 120, h: 260, draw(c, w, h) { site(c, w, h, { wire: true }); } },
  wireTablet: { w: 164, h: 236, draw(c, w, h) { site(c, w, h, { wire: true }); } },
  siteWide: { w: 480, h: 270, draw(c, w, h) {              // in a browser, on a tablet: the window's bar, then the page
    fill(c, C.line, 0, 0, w, 24); for (let i = 0; i < 3; i++) disc(c, C.slate, 14 + i * 12, 12, 3.4);
    c.fillStyle = C.ink; c.beginPath(); c.roundRect(120, 5, 240, 14, 7); c.fill(); fill(c, C.slate, 136, 10.5, 110, 3);
    c.save(); c.translate(0, 24); c.beginPath(); c.rect(0, 0, w, h - 24); c.clip(); site(c, w, h - 24); c.restore();
  } },
  siteTall: sitePhone(0),
  siteTall2: sitePhone(1),
  lFrame: { w: 40, h: 40, draw(c) { [12, 24].forEach(v => { fill(c, C.grey, v, 5, 4, 30); fill(c, C.grey, 5, v, 30, 4); }); } },                     // a frame, in the list of layers
  pPlay: { w: 40, h: 40, draw(c) { playIcon(c, C.paper, 20, 20, 11); } },                                                                           // where a flow starts
  tHash: { w: 64, h: 64, draw(c) { [20, 38].forEach(v => { fill(c, C.paper, v, 9, 6, 46); fill(c, C.paper, 9, v, 46, 6); }); } },                     // the frame tool
  tChat: { w: 64, h: 64, draw(c) { c.fillStyle = C.paper; c.beginPath(); c.roundRect(11, 12, 42, 32, 9); c.fill(); c.beginPath(); c.moveTo(18, 42); c.lineTo(18, 55); c.lineTo(31, 42); c.closePath(); c.fill(); } },   // a comment
  // ---- the apps' own logos, because Dan wants people to know which app this is: two letters on a dark tile, in each app's colours
  appAi: { w: 128, h: 128, draw(c, w, h) { fill(c, '#330000', 0, 0, w, h); text(c, 'Ai', 64, 88, 68, { w: 600, fill: '#FF9A00', align: 'center', track: 0 }); } },
  appId: { w: 128, h: 128, draw(c, w, h) { fill(c, '#49021F', 0, 0, w, h); text(c, 'Id', 64, 88, 68, { w: 600, fill: '#FF3366', align: 'center', track: 0 }); } },
  appPs: { w: 128, h: 128, draw(c, w, h) { fill(c, '#001E36', 0, 0, w, h); text(c, 'Ps', 64, 88, 68, { w: 600, fill: '#31A8FF', align: 'center', track: 0 }); } },
  appPr: { w: 128, h: 128, draw(c, w, h) { fill(c, '#00005B', 0, 0, w, h); text(c, 'Pr', 64, 88, 68, { w: 600, fill: '#9999FF', align: 'center', track: 0 }); } },
  appAe: { w: 128, h: 128, draw(c, w, h) { fill(c, '#00005B', 0, 0, w, h); text(c, 'Ae', 64, 88, 68, { w: 600, fill: '#9999FF', align: 'center', track: 0 }); } },
  appFig: { w: 128, h: 128, draw(c, w, h) {               // Figma's mark: five shapes in two columns
    fill(c, '#1E1E1E', 0, 0, w, h);
    [['#F24E1E', 34, 19, [15, 0, 0, 15]], ['#FF7262', 64, 19, [0, 15, 15, 0]], ['#A259FF', 34, 49, [15, 0, 0, 15]], ['#0ACF83', 34, 79, [15, 0, 15, 15]]].forEach(([col, x, y, r]) => { c.fillStyle = col; c.beginPath(); c.roundRect(x, y, 30, 30, r); c.fill(); });
    disc(c, '#1ABCFE', 79, 64, 15);
  } },
  namePr: { w: 320, h: 56, draw(c) { text(c, 'Premiere Pro', 2, 42, 40, { w: 500, fill: C.paper, track: 0 }); } },
  nameAe: { w: 320, h: 56, draw(c) { text(c, 'After Effects', 2, 42, 40, { w: 500, fill: C.paper, track: 0 }); } },
  nameFig: { w: 320, h: 56, draw(c) { text(c, 'Figma', 2, 42, 40, { w: 500, fill: C.paper, track: 0 }); } },
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

// These small patches carry real prefixes, rather than slicing through a letter while it is typed.
// The surrounding plate is opaque, so small lettering never passes through the alpha test.
for (const [key, source, crop, mask, px, x, baselines, family, track, weights] of [
  ['idCover', 'kCover', [311.6, 268, 128.4, 52], [13, 10, 113, 36], 14.04, 14.04, [22.88, 41.6], SANS, 0, [300, 700]],
  ['idPost', 'kPost', [276, 315.2, 124, 58.4], [15, 10, 108, 42], 15.768, 15.768, [25.696, 46.72], SANS, 0, [300, 700]],
  ['idMail', 'eblast', [17.6, 268, 284.8, 28], [9, 0, 276, 28], 20, 9.6, [22.4], SERIF, 0.01, [700]],
]) {
  const words = key === 'idMail' ? ['Office Space For Sale'] : ['Office Space', 'For Sale'];
  for (let n = 0; n <= 21; n++) {
    const a = { w: Math.ceil(crop[2]), h: Math.ceil(crop[3]), draw(c) {
      c.save(); c.translate(-crop[0], -crop[1]); ART[source].draw(c, ART[source].w, ART[source].h); c.restore();
      fill(c, key === 'idMail' ? K.coal : K.gold, ...mask);
      let remaining = n;
      words.forEach((line, i) => {
        const part = line.slice(0, Math.max(0, remaining));
        text(c, part, x, baselines[i], px, { w: weights[i], fill: K.white, family, track });
        if (remaining >= 0 && remaining <= line.length) a.caret = [x + c.measureText(part).width, baselines[i] - px, px];
        remaining -= line.length + 1;
      });
    } };
    ART[key + n] = a;
  }
}

// The button's opaque prefixes preserve its final frame while its words are typed.
for (let n = 0; n <= 14; n++) {
  const a = { w: 105, h: 29, draw(c) {
    c.save(); c.translate(-17.6, -416); hideText = true;
    try { ART.eblast.draw(c, 320, 472); } finally { hideText = false; c.restore(); }
    const part = 'View the flyer'.slice(0, n);
    text(c, part, 10.4, 18.8, 12, { w: 700, fill: K.white, track: 0, family: SANS });
    a.caret = [10.4 + c.measureText(part).width, 6.8, 12];
  } };
  ART['idFlyer' + n] = a;
}

// Each label has its own transparent crop. A crop from a shared letters texture could expose a neighbour whose ink overlaps
// its rectangle (the e-blast's Unit/number pairs do). Replay the source's transforms, allowing only this one text call to paint.
function letterPictures(ctx, source) {
  ctx.save(); captureText = { base: ctx.getTransform(), parts: [] };
  try { ART[source].draw(ctx, ART[source].w, ART[source].h); ART_TEXT[source] = captureText.parts; }
  finally { captureText = null; ctx.restore(); }
  for (const key of Object.keys(ART)) if (key.startsWith(source + 'Letters')) delete ART[key];
  ART_TEXT[source].forEach((part, index) => {
    const [l, t, r, b] = part.region, crop = [Math.max(0, Math.floor(l)), Math.max(0, Math.floor(t)), Math.min(ART[source].w, Math.ceil(r)), Math.min(ART[source].h, Math.ceil(b))], picture = source + 'Letters' + index;
    part.crop = crop; part.picture = picture;
    if (crop[2] <= crop[0] || crop[3] <= crop[1]) return;
    ART[picture] = { w: crop[2] - crop[0], h: crop[3] - crop[1], lettersOnly: true, source, sourceRect: crop, labelIndex: index, draw(c) {
      const paint = new Set(['fill', 'stroke', 'fillRect', 'strokeRect', 'clearRect', 'drawImage', 'putImageData']); let call = 0;
      const letters = new Proxy(c, { get(target, key) {
        if (key === 'fillText') return (...args) => { if (call++ === index) target.fillText(...args); };
        const value = target[key]; return paint.has(key) ? () => {} : typeof value === 'function' ? value.bind(target) : value;
      }, set(target, key, value) { target[key] = value; return true; } });
      c.save(); c.translate(-crop[0], -crop[1]);
      try { ART[source].draw(letters, ART[source].w, ART[source].h); } finally { c.restore(); }
    } };
  });
}

// F3: the alpha test must see the support of the finished letters, not their antialiased stroke opacity. Grow that support by
// one texel for filtering, and copy the finished picture's RGB there, including its already-composited antialiased edges.
export function letterMask(letters, finished, w, h) {
  const result = new Uint8ClampedArray(letters.length);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!(letters[(y * w + x) * 4 + 3] > 0)) continue;
    for (let v = Math.max(0, y - 1); v <= Math.min(h - 1, y + 1); v++) for (let u = Math.max(0, x - 1); u <= Math.min(w - 1, x + 1); u++) {
      const i = (v * w + u) * 4;
      result[i] = finished[i]; result[i + 1] = finished[i + 1]; result[i + 2] = finished[i + 2]; result[i + 3] = 255;
    }
  }
  return result;
}

// Read both drawings from the completed atlas, so integer crop translations, source transforms and the browser's font
// rasterisation are identical. The raw companion still executes exactly one source text call; no other paint defines its mask.
export function maskLetterPictures(pages, spots) {
  const byKey = new Map(spots.map(spot => [spot[0], spot])), sources = new Map();
  for (const [key, a, px, py, w, h, page] of spots) {
    if (!a.lettersOnly) continue;
    const ctx = pages[page].getContext('2d'), letters = ctx.getImageData(px, py, w, h);
    // The Node drawing/packing stand-ins have no pixel buffers. The separate F3 gate exercises this path with pixel fixtures.
    if (!letters?.data) continue;
    const [, source, sx, sy, sw, sh, sp] = byKey.get(a.source), [l, t, r, b] = a.sourceRect;
    if (!sources.has(a.source)) sources.set(a.source, pages[sp].getContext('2d').getImageData(sx, sy, sw, sh));
    const finished = sources.get(a.source), pixels = new Uint8ClampedArray(w * h * 4);
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      // Match the full picture's texel-centre UV map, including non-unit atlas scales.
      const X = (l + x / Math.max(1, w - 1) * (r - l - 1)) / (source.w - 1) * (sw - 1);
      const Y = (t + y / Math.max(1, h - 1) * (b - t - 1)) / (source.h - 1) * (sh - 1);
      const x0 = Math.floor(X), y0 = Math.floor(Y), fx = X - x0, fy = Y - y0, i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const sample = (u, v) => finished.data[(Math.min(sh - 1, v) * sw + Math.min(sw - 1, u)) * 4 + c];
        pixels[i + c] = (1 - fy) * ((1 - fx) * sample(x0, y0) + fx * sample(x0 + 1, y0)) + fy * ((1 - fx) * sample(x0, y0 + 1) + fx * sample(x0 + 1, y0 + 1));
      }
    }
    letters.data.set(letterMask(letters.data, pixels, w, h));
    ctx.putImageData(letters, px, py);
  }
}

// Pack rows into pages no larger than 2048 square. Places include their page number.
export function makeAtlas({ size = 2048, pad = 8, scale = 1 } = {}) {
  if (size > 2048 || size < 1 || scale <= 0 || pad < 0) throw new Error('invalid atlas measures');
  const measure = document.createElement('canvas'); measure.width = 1100; measure.height = 472;
  const context = measure.getContext('2d');
  for (const source of ['kMap', 'kLoc', 'eblast']) letterPictures(context, source);
  const sheets = [[]];
  let x = pad, y = pad, row = 0;
  // Retain these old drawings as references; the new prototype never renders their baked device states.
  const referenceOnly = new Set(['siteWide', 'siteTall', 'siteTall2', 'chromeBrowser', 'chromePhone']);
  for (const [key, a] of Object.entries(ART).filter(([key]) => !referenceOnly.has(key)).sort((p, q) => q[1].h - p[1].h)) {
    const w = Math.round(a.w * scale), h = Math.round(a.h * scale);
    if (w + 2 * pad > size || h + 2 * pad > size) throw new Error('picture too large: ' + key);
    if (x + w + pad > size) { x = pad; y += row + pad; row = 0; }
    if (y + h + pad > size) { sheets.push([]); x = pad; y = pad; row = 0; }
    sheets.at(-1).push([key, a, x, y, w, h]);
    x += w + pad; row = Math.max(row, h);
  }
  const places = {}, pages = sheets.map((spots, page) => {
    const tall = Math.min(size, Math.ceil(Math.max(...spots.map(p => p[3] + p[5] + pad)) / 4) * 4);
    const canvas = document.createElement('canvas'); canvas.width = size; canvas.height = tall;
    const ctx = canvas.getContext('2d');
    for (const [key, a, px, py, w, h] of spots) {
      ctx.save(); ctx.translate(px, py); ctx.scale(scale, scale); ctx.beginPath(); ctx.rect(0, 0, a.w, a.h); ctx.clip();
      a.draw(ctx, a.w, a.h);
      ctx.restore();
      places[key] = [page, (px + 0.5) / size, (py + 0.5) / tall, (w - 1) / size, (h - 1) / tall];
    }
    return canvas;
  });
  maskLetterPictures(pages, sheets.flatMap((spots, page) => spots.map(spot => [...spot, page])));
  return { pages, places };
}
export const AM_MARKERS = SHOPS.flatMap(([x, step, above, below]) => [...above.map((_, i) => [x + i * step, 358, 30, 30]), ...below.map((_, i) => [x + i * step, 464, 30, 30])]);
export const AM_LABEL_BARS = SHOPS.flatMap(([x, step, above, below]) => [...above.map((len, i) => [x + i * step + 9.5, 344 - len, 11, len]), ...below.map((len, i) => [x + i * step + 9.5, 508, 11, len])]);
export const CITY_BLOCKS = CITY.blocks;
// The building's ring has a centred 5-unit stroke; include its outer half before adding the crop's raster fringe.
export const CITY_PINS = [...CITY.badges, ...CITY.transit.map(([, ...r]) => r), ...CITY.stops.map(([x, y]) => [x - 11, y - 11, 22, 22]), ...CITY.routes.map(([x, y]) => [x, y, 60, 20]), [791.5, 372.5, 122, 187], [177, 40, 80, 80]];
// The page's own face, and the stand-ins for the flyer's faces, which live beside this file so that every page that draws the pictures gets them.
const FACES = [['Gelasio', '400', 'gelasio-400.woff2'], ['Gelasio', '700', 'gelasio-700.woff2'], ['Rokkitt', '800', 'rokkitt-800.woff2']];
export async function fontsReady() {
  await Promise.all(FACES.map(([family, weight, file]) => { const f = new FontFace(family, `url(${(globalThis.__heroFonts?.[file] || new URL('./fonts/' + file, import.meta.url))})`, { weight }); document.fonts.add(f); return f.load(); }));
  await Promise.all(['800 64px Outfit', '600 32px Outfit', '500 16px Outfit', '400 16px Outfit'].map(f => document.fonts.load(f)));
}

