// Every drawing as a function that returns an SVG string. Geometry and glyphs ported from reference/round2.cjs.
import { C, MAP, COPY, STOPS, FINDS, FIND_COPY, FIND_PLAY, HAMMER, YGG, MARK, LABELS, RAVEN_RIG } from './data.mjs';

export const rnd = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
export const n1 = n => +(+n).toFixed(1);
export const spline = (P, closed, seg = 10) => { const n = P.length, out = [], g = i => closed ? P[(i + n) % n] : P[Math.max(0, Math.min(n - 1, i))]; for (let i = 0; i < (closed ? n : n - 1); i++) { const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2); for (let j = 0; j < seg; j++) { const t = j / seg, t2 = t * t, t3 = t2 * t; out.push([0, 1].map(k => .5 * (2 * p1[k] + (p2[k] - p0[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * t3))); } } if (!closed) out.push(P[n - 1]); return out; };
// a tapered tube round a centreline: width w0 at the start to w1 at the end, optional wobble
export const tube = (P, w0, w1 = 0, wob = 0, seed = 1) => {
  const S = spline(P, false, YGG.tube.seg), n = S.length, L = [], Rt = [];
  let s0 = seed; const r = () => { s0 = (s0 * YGG.tube.mult) % YGG.tube.mod; return s0 / YGG.tube.mod; };
  for (let i = 0; i < n; i++) {
    const a = S[Math.max(0, i - 1)], c = S[Math.min(n - 1, i + 1)], dx = c[0] - a[0], dy = c[1] - a[1], l = Math.hypot(dx, dy) || 1, t = i / (n - 1);
    const w = (w0 + (w1 - w0) * Math.pow(t, YGG.tube.power)) / 2 * (1 + (wob ? (r() - .5) * wob : 0));
    L.push([S[i][0] - dy / l * w, S[i][1] + dx / l * w]); Rt.push([S[i][0] + dy / l * w, S[i][1] - dx / l * w]);
  }
  return pathD([...L, ...Rt.reverse()], true);
};



export const pathD = (P, closed) => 'M' + P.map(p => n1(p[0]) + ' ' + n1(p[1])).join('L') + (closed ? 'Z' : '');
export const insidePoly = (pt, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1]; if ((yi > pt[1]) != (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
export const polyLen = (P, closed) => { let L = 0; for (let i = 1; i < P.length; i++) L += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); if (closed) L += Math.hypot(P[0][0] - P[P.length - 1][0], P[0][1] - P[P.length - 1][1]); return L; };
export const COAST_A = spline(MAP.coastA, 1);
export const COAST_B = spline(MAP.coastB, 1);
export const TRAIL = spline(MAP.waypoints, 0, MAP.trailSeg);
export const onLand = p => insidePoly(p, COAST_A) || insidePoly(p, COAST_B);

// ---- Elder Futhark: 24 runes as straight strokes on a 2.5 by 8 grid ----
export const RUNES = [
  ['fehu', 'f', [[[0, 0], [0, 8]], [[0, 3.2], [2.5, 1]], [[0, 5.4], [2.5, 3.2]]]],
  ['uruz', 'u', [[[0, 8], [0, 0], [2.5, 2.6], [2.5, 8]]]],
  ['thurisaz', 'th', [[[0, 0], [0, 8]], [[0, 2], [2.5, 4], [0, 6]]]],
  ['ansuz', 'a', [[[0, 0], [0, 8]], [[0, 0], [2.5, 2]], [[0, 2.6], [2.5, 4.6]]]],
  ['raido', 'r', [[[0, 8], [0, 0], [2.5, 2], [0, 4], [2.5, 8]]]],
  ['kaunan', 'k', [[[2.2, 0], [0, 2], [2.2, 4]]]],
  ['gebo', 'g', [[[0, 1], [2.5, 7]], [[2.5, 1], [0, 7]]]],
  ['wunjo', 'w', [[[0, 8], [0, 0], [2.5, 2], [0, 4]]]],
  ['hagalaz', 'h', [[[0, 0], [0, 8]], [[2.5, 0], [2.5, 8]], [[0, 3], [2.5, 5]]]],
  ['naudiz', 'n', [[[1.25, 0], [1.25, 8]], [[0, 3], [2.5, 5]]]],
  ['isaz', 'i', [[[0, 0], [0, 8]]]],
  ['jera', 'j', [[[1.2, .6], [0, 2.6], [1.2, 4.6]], [[1.3, 3.4], [2.5, 5.4], [1.3, 7.4]]]],
  ['eihwaz', 'ei', [[[1.25, 0], [1.25, 8]], [[1.25, 0], [2.5, 1.5]], [[1.25, 8], [0, 6.5]]]],
  ['perthro', 'p', [[[0, 0], [0, 8]], [[0, 0], [2.5, 2]], [[2.5, 2], [1.3, 3]], [[0, 8], [2.5, 6]], [[2.5, 6], [1.3, 5]]]],
  ['algiz', 'z', [[[1.25, 0], [1.25, 8]], [[1.25, 3], [0, .6]], [[1.25, 3], [2.5, .6]]]],
  ['sowilo', 's', [[[2.5, 0], [0, 3], [2.5, 5], [0, 8]]]],
  ['tiwaz', 't', [[[1.25, 0], [1.25, 8]], [[0, 2], [1.25, 0], [2.5, 2]]]],
  ['berkanan', 'b', [[[0, 0], [0, 8], [2.5, 6], [0, 4], [2.5, 2], [0, 0]]]],
  ['ehwaz', 'e', [[[0, 8], [0, 0], [1.25, 2], [2.5, 0], [2.5, 8]]]],
  ['mannaz', 'm', [[[0, 8], [0, 0], [2.5, 3]], [[2.5, 8], [2.5, 0], [0, 3]]]],
  ['laguz', 'l', [[[0, 8], [0, 0], [2.5, 2]]]],
  ['ingwaz', 'ng', [[[1.25, 2], [2.5, 4], [1.25, 6], [0, 4], [1.25, 2]]]],
  ['dagaz', 'd', [[[0, 0], [0, 8], [2.5, 0], [2.5, 8], [0, 0]]]],
  ['othala', 'o', [[[0, 8], [2.5, 4], [1.25, 1.5], [0, 4], [2.5, 8]]]],
];
const RUNE_BY_KEY = Object.fromEntries(RUNES.map(r => [r[1], r[2]]));
const runeKeys = word => {
  const w = word.toLowerCase(), out = [];
  for (let i = 0; i < w.length; i++) {
    const c = w[i], two = w.slice(i, i + 2);
    if (two === 'th' || two === 'ng') { out.push(two); i++; continue; }
    if (c === ' ') { out.push(' '); continue; }
    if ('ckq'.includes(c)) out.push('k');
    else if ('vw'.includes(c)) out.push('w');
    else if ('jy'.includes(c)) out.push('j');
    else if (c === 'x') out.push('k', 's');
    else if (RUNE_BY_KEY[c]) out.push(c);
  }
  return out;
};
// One rune: path data for a rune of height h with its top-left at x, y.
export const runeGlyph = (key, h, x = 0, y = 0) => {
  const k = h / 8, S = RUNE_BY_KEY[key] || [];
  const w = Math.max(...S.flat().map(p => p[0]), 0) * k;
  return { d: S.map(st => 'M' + st.map(p => n1(x + p[0] * k) + ' ' + n1(y + p[1] * k)).join('L')).join(''), w };
};
// Sets a word in runes. Returns path data and width; anchor 'start' | 'middle' | 'end'.
export const runeWord = (word, h, x = 0, y = 0, anchor = 'start') => {
  const keys = runeKeys(word), gap = h * .32, space = h * .7;
  let w = 0; keys.forEach((k, i) => { w += k === ' ' ? space : runeGlyph(k, h).w + (i < keys.length - 1 ? gap : 0); });
  let cx = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x, d = '';
  keys.forEach(k => { if (k === ' ') { cx += space; return; } const g = runeGlyph(k, h, cx, y); d += g.d; cx += g.w + gap; });
  return { d, w };
};
const runeSvg = (word, h, x, y, a, cls = 'rn') => `<path class="${cls}" d="${runeWord(word, h, x, y, a).d}"/>`;

// ---- small helpers ----
export const svgText = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 8}" fill="${o.c || C.dim}" font-weight="${o.w || 500}" text-anchor="${o.a || 'start'}"${o.i ? ' font-style="italic"' : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.h ? ' class="h"' : ''}${o.t ? ` transform="${o.t}"` : ''}${o.op ? ` opacity="${o.op}"` : ''}${o.cls ? ` class="${o.cls}"` : ''}>${s}</text>`;
const grp = (x, y, k, s, rot) => `<g transform="translate(${x} ${y})${rot ? ` rotate(${rot})` : ''} scale(${k})">${s}</g>`;
export const starPath = (x, y, s) => `M${n1(x)} ${n1(y - s)}Q${n1(x)} ${n1(y)} ${n1(x + s)} ${n1(y)}Q${n1(x)} ${n1(y)} ${n1(x)} ${n1(y + s)}Q${n1(x)} ${n1(y)} ${n1(x - s)} ${n1(y)}Q${n1(x)} ${n1(y)} ${n1(x)} ${n1(y - s)}Z`;
const marker = (x, y, n, id) => `<g class="mk"${id ? ` id="mk-${id}"` : ''}><g transform="translate(${x} ${y})"><g class="mk-size"><circle r="6.2" fill="${C.ink}" stroke="${C.red}" stroke-width="1.2"/><g><g><text y="2.6" font-size="7.5" font-weight="800" fill="${C.red}" text-anchor="middle">${n}</text></g></g></g></g></g>`;

// ---- terrain ----
const peak = (x, y, s) => `<path class="g" d="M${n1(x - s)} ${y}L${x} ${n1(y - s * 1.5)}L${n1(x + s)} ${y}"/><path class="t" d="M${x} ${n1(y - s * 1.5)}l${n1(s * .28)} ${n1(s * .55)}l${n1(-s * .2)} ${n1(s * .3)}M${n1(x + s * .34)} ${n1(y - s * .62)}l${n1(-s * .1)} ${n1(s * .42)}M${n1(x + s * .6)} ${n1(y - s * .32)}l${n1(-s * .08)} ${n1(s * .24)}"/>`;
const tree = (x, y, s) => `<path class="t" d="M${x} ${y}v${n1(-s)}"/><circle class="g" cx="${x}" cy="${n1(y - s * 1.7)}" r="${s}"/>`;
const pine = (x, y, s) => `<path class="t" d="M${x} ${y}v${n1(-s * .6)}"/><path class="g" d="M${n1(x - s)} ${n1(y - s * .5)}L${x} ${n1(y - s * 2.7)}L${n1(x + s)} ${n1(y - s * .5)}Z"/>`;
const hill = (x, y, s) => `<path class="l" d="M${n1(x - s)} ${y}q${s} ${n1(-s * 1.1)} ${n1(2 * s)} 0"/><path class="t" d="M${n1(x + s * .2)} ${n1(y - s * .42)}l${n1(s * .12)} ${n1(s * .22)}M${n1(x + s * .5)} ${n1(y - s * .28)}l${n1(s * .1)} ${n1(s * .18)}"/>`;
const wave = (x, y) => `<path class="t" d="M${x} ${y}q2.5 -3 5 0t5 0t5 0"/>`;
const sign = () => `<rect class="g" x="-2" y="-62" width="4" height="62"/><path class="g" d="M2 -58h24l6 5l-6 5h-24z"/><path class="g" d="M-2 -46h-22l-6 5l6 5h22z"/>`;
const hall = () => `<rect class="g" x="-16" y="-18" width="32" height="18"/><path class="g" d="M-19 -18L0 -31L19 -18Z"/><rect class="o" x="-3" y="-9" width="6" height="9"/><path class="t" d="M-11 -12h4v4h-4zM7 -12h4v4h-4z"/><path class="l" d="M0 -31V-46"/><path class="pf" d="M0 -46l12 3.5l-12 3.5z"/>`;
const campus = () => `<rect class="g" x="-22" y="-14" width="28" height="14"/><rect class="g" x="6" y="-24" width="15" height="24"/><path class="t" d="M-18 -9h20M-18 -5h20M9 -19h9M9 -14h9M9 -9h9M9 -4h9"/><path class="l" d="M13 -24V-38"/><path class="pf" d="M13 -38l11 3l-11 3z"/>`;
const dock = () => `<rect class="g" x="0" y="-3" width="44" height="5"/><path class="l" d="M6 2v6M18 2v6M30 2v6M42 2v6M10 -3V-17M24 -3V-17M38 -3V-17"/><path class="pf" d="M10 -17l8 2.5l-8 2.5zM24 -17l8 2.5l-8 2.5zM38 -17l8 2.5l-8 2.5z"/>`;
const boat = () => `<path class="g" d="M-9 -1q9 8 18 0z"/><path class="l" d="M0 -1V-18"/><path class="o" d="M1.5 -17L10 -4H1.5Z"/>`;
export const toronto = () => MAP.toronto.drawing;
const shore = (P, seed) => {
  const r=rnd(seed),n=P.length,batches=[];let ar2=0;
  for(let i=0;i<n;i++){const a=P[i],b=P[(i+1)%n];ar2+=a[0]*b[1]-b[0]*a[1];}
  const sg=ar2>0?1:-1;
  for(let i=0;i<n;i++){
    const a=P[i],b=P[(i+1)%n],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1;
    for(let j=0;j<3;j++){
      const d=4+Math.pow(r(),1.7)*30,t=r(),x=a[0]+dx*t+sg*dy/L*d,y=a[1]+dy*t-sg*dx/L*d;
      if(onLand([x,y])||y>818)continue;
      const px=n1(x),py=n1(y),width=n1(.45+r()*.65),alpha=n1(Math.max(.12,.8-d/45));
      // Equal paints can share a path. Keep same-paint dots far apart so their
      // antialias coverage and opacity never merge at any reachable map scale.
      let batch=batches.find(b=>b.width===width&&b.alpha===alpha&&b.points.every(p=>Math.hypot(p[0]-px,p[1]-py)>32));
      if(!batch){batch={width,alpha,points:[]};batches.push(batch);}batch.points.push([px,py]);
    }
  }
  // The alpha is the stroke's, not the path's opacity (pinch recheck, 2026-11-27): opacity made each of the ~200 batches its own
  // offscreen layer in every tile, about 80 % of the sea and land layer's redraw cost while zooming. With one stroke and no fill
  // the two draw the same pixels, since the dots of a batch never touch.
  return batches.map(b=>'<path class="sea-stipple" d="'+b.points.map(p=>'M'+p[0]+' '+p[1]+'h.01').join('')+'" fill="none" stroke="'+C.paper+'" stroke-width="'+b.width+'" stroke-linecap="round" vector-effect="non-scaling-stroke" stroke-opacity="'+b.alpha+'"/>').join('');
};

// ---- Norse landmarks ----
export function yggdrasil(x, y) {
  const Y = YGG, actor = (cls, p, body) => '<g class="' + cls + '" transform="translate(' + p.join(' ') + ')">' + body + '</g>';
  return '<g class="ygg" transform="translate(' + x + ' ' + y + ')">' + Y.drawing + actor('yg-eagle', Y.eagleAt, Y.eagle) + actor('yg-rat', Y.ratAt, '<g transform="scale(2.6)">'+Y.rat+'</g>') + '</g>';
}
// interlace knot, about 22 units: a rounded square and a diamond woven over and under by quadrant
export const knot = (cx, cy) => {
  const sq = 'M-7 -7.5Q0 -11 7 -7.5Q11 0 7 7.5Q0 11 -7 7.5Q-11 0 -7 -7.5Z';
  const di = 'M0 -11Q4.5 -4.5 11 0Q4.5 4.5 0 11Q-4.5 4.5 -11 0Q-4.5 -4.5 0 -11Z';
  const band = (d, cp) => `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="2.6"${cp}/><path class="l" d="${d}"${cp}/>`;
  return `<g class="chart-knot" transform="translate(${cx} ${cy})">${band(sq, '')}${band(di, '')}${band(sq, ' clip-path="url(#kq)"')}<circle class="pf" r="1.1"/></g>`;
};
// standing stone for the stop marks (HTML), viewBox 0 0 260 400
export function shieldSvg() {
  const M = MARK, c = M.centre, circle = (r, attrs) => '<circle cx="' + c + '" cy="' + c + '" r="' + r + '" ' + attrs + '/>';
  const lines = M.planks.map(x => { const h = Math.sqrt(M.radius ** 2 - x ** 2); return 'M' + (c + x) + ' ' + (c - h) + 'V' + (c + h); }).join('');
  const shadow = M.shadow, hi = M.highlight;
  return '<svg class="stone" viewBox="0 0 ' + M.box + ' ' + M.box + '" aria-hidden="true">' + circle(M.centre, 'class="st-glow" fill="url(#stoneGlow)"') + '<ellipse cx="' + shadow[0] + '" cy="' + shadow[1] + '" rx="' + shadow[2] + '" ry="' + shadow[3] + '" fill="' + C.black + '" opacity="' + shadow[4] + '"/>' + circle(M.radius, 'class="st-ink"') + '<path d="' + lines + '" fill="none" stroke="' + C.paper + '" stroke-opacity="' + M.plankAlpha + '" stroke-width="' + M.plankLine + '"/><g class="st-fill">' + circle(M.radius, 'fill="var(--shield-b)"') + '<path d="' + M.quarters + '" fill="var(--shield-a)"/><path d="' + lines + '" fill="none" stroke="' + C.ink + '" stroke-opacity="' + M.paintAlpha + '" stroke-width="' + M.plankLine + '"/></g>' + circle(M.radius, 'class="st-line" stroke-width="' + M.rim + '"') + circle(M.boss, 'fill="' + C.ink + '"') + circle(M.boss, 'class="st-boss-paint" fill="var(--shield-c)"') + circle(M.boss, 'fill="none" stroke="' + C.paper + '" stroke-width="' + M.bossLine + '"') + '<circle cx="' + hi[0] + '" cy="' + hi[1] + '" r="' + hi[2] + '" fill="' + C.paper + '" opacity="' + hi[3] + '"/>' + Array.from({ length: M.studs }, (_, i) => { const angle = i * Math.PI * 2 / M.studs; return '<circle cx="' + (c + Math.cos(angle) * M.radius) + '" cy="' + (c + Math.sin(angle) * M.radius) + '" r="' + M.stud + '" fill="' + C.ink + '" stroke="' + C.paper + '" stroke-width="' + M.studLine + '"/>'; }).join('') + '</svg>';
}

export function cardTailSvg() { return '<svg class="c-tail" viewBox="0 0 1 1" aria-hidden="true"><line class="c-leader-line"/><circle class="c-leader-dot"/><path class="c-leader-bar"/></svg>'; }

// ---- finds (each wrapped in a group the finds module wires up) ----
const findWrap = (id, label, inner, x, y) => `<g class="find" id="f-${id}" role="button" tabindex="0" aria-label="${label}" data-x="${x}" data-y="${y}">${inner}</g>`;
const findDrawing = kind => FIND_PLAY.drawings[kind].replace(/\{\{([\w.]+)\}\}/g, (match, path) => path === 'hoard.glintPath' ? starPath(...FIND_PLAY.hoard.glintAt, FIND_PLAY.hoard.glintSize) : path.split('.').reduce((value, key) => value[key], FIND_PLAY)).replace(/<text\b[^]*?<\/text>/g, text => '<g class="' + (kind === 'wayfinder' ? 'map-tier2 wf-result' : 'map-tier2') + '">' + text + '</g>');
const wayfinder = () => findDrawing('wayfinder');
export function hoardInside(lean) {
  const [w, d, crown] = FIND_PLAY.hoard.inside;
  return `M${-w} 0L${-w + lean} ${-d}Q0 ${-d - crown} ${w - lean} ${-d}L${w} 0Z`;
}
const hoard = id => {
  const H = { ...FIND_PLAY.hoard, scratchPath: 'M-36 2H36M-28 2Q-2 -13 27 2M6 -4L10 -19M5 -20L15 -18M2 -6L10 -4L7 3L3 0ZM-38 4L-35 0L-31 4ZM30 5L34 1L38 4ZM-23 6L-19 3L-15 6Z' }, [x, y, r] = H.hit, [cx, cy, cw, ch] = H.clip;
  return `<circle class="hit" cx="${x}" cy="${y}" r="${r}"/><path class="l hd-scratch" d="${H.scratchPath}"/><ellipse class="o hd-hole" rx="0" ry="0"/><defs><clipPath id="clip-${id}" clipPathUnits="userSpaceOnUse"><rect x="${cx}" y="${cy}" width="${cw}" height="${ch}"/><ellipse class="hd-clip-hole" rx="0" ry="0"/></clipPath></defs><g class="hd-clods" pointer-events="none"></g><g transform="translate(${H.pileAt.join(' ')})"><path class="g hd-pile" d="${H.pilePath}" opacity="0"/></g><path class="pf hd-glint" d="${starPath(...H.glintAt, H.glintSize)}" opacity="0"/><g clip-path="url(#clip-${id})"><circle class="hd-glow" cy="${H.rim}" r="${H.glowR}" fill="url(#litGlow)" opacity="0"/><g class="hd-chest" transform="translate(0 ${H.travel})">${H.body}<g class="hd-inside" transform="translate(0 ${H.rim}) scale(1 0)"><path class="g hd-face" fill-rule="nonzero" d="${hoardInside(0)}"/>${H.insideLines.map((d, i) => '<path class="t hd-plank-' + i + '" d="' + d + '"/>').join('')}</g><g class="hd-mouth" transform="translate(0 ${H.rim}) scale(1 0)"><path class="o" d="${H.mouth}"/><path d="${H.mouthLine}" fill="none" stroke="${C.warm}" stroke-opacity="${H.mouthAlpha}" stroke-width="${H.mouthWidth}" vector-effect="non-scaling-stroke"/></g><g class="hd-lid">${H.dome}</g></g></g><path class="t hd-rim" d="${H.rimPath}" transform="scale(0 0)"/><g class="hd-stars">${Array.from({ length: H.starCount }, (_, i) => `<path class="pf hd-star" d="${starPath(0, H.starY, H.starSizes[i % H.starSizes.length])}" opacity="0"/>`).join('')}</g>`;
};
export const ravenPose = (a, b, t) => {
  const A = typeof a === 'string' ? RAVEN_RIG.POSES[a] : a, B = typeof b === 'string' ? RAVEN_RIG.POSES[b] : b;
  return Object.fromEntries(Object.keys(A).map(k => [k, Array.isArray(A[k]) ? A[k].map((v, i) => v + (B[k][i] - v) * t) : A[k] + (B[k] - A[k]) * t]));
};
export const ravenPoseTransforms = q => {
  const R = RAVEN_RIG, tr = a => `rotate(${a[0]}) scale(${a[1]} ${a[2]})`, pivot = R.PIV;
  return { body: `rotate(${q.body} ${pivot.join(' ')}) translate(${pivot.join(' ')}) scale(${q.sq.join(' ')}) translate(${pivot.map(v => -v).join(' ')})`, near: tr(q.wing), far: tr(q.far), legs: `translate(${R.HIP.join(' ')}) scale(1 ${q.legs}) translate(${R.HIP.map(v => -v).join(' ')})`, head: `translate(${R.N.join(' ')}) rotate(${q.head})` };
};
const ravenBird = i => {
  const R = RAVEN_RIG, T = ravenPoseTransforms(R.POSES.sit), side = i ? 1 : -1, k = FIND_PLAY.raven.birdScale, p = R.PERCHES[i];
  return `<g class="rv-${i ? 'b' : 'a'}" transform="translate(${p.join(' ')}) rotate(0) scale(${side * k} ${k})"><g class="rv-body" transform="${T.body}"><g transform="translate(${R.S.map((v, j) => v + R.farOffset[j]).join(' ')})"><g class="rv-far" transform="${T.far}"><path class="o" d="${R.WING}"/></g></g><g class="rv-legs" transform="${T.legs}"><path class="l" d="${R.LEGS}"/></g><path class="g" d="${R.BODY}"/><path class="t" d="${R.TAILLINES}"/><g class="rv-head" transform="${T.head}"><path class="g" style="stroke:none" d="${R.HEADFILL}"/><path class="l" d="${R.HEADOUT}"/><path class="t" d="${R.BILL}"/><circle class="pf" cx="${R.EYE[0]}" cy="${R.EYE[1]}" r="${R.EYE[2]}"/><g class="rv-item" opacity="0"></g></g><g transform="translate(${R.S.join(' ')})"><g class="rv-near" transform="${T.near}"><path class="g" d="${R.WING}"/><path class="t" d="${R.WINGLINES}"/></g></g></g></g>`;
};
const ravens = () => {
  const R = RAVEN_RIG, [x, y, w, h] = R.hit;
  return `<rect class="hit" x="${x}" y="${y}" width="${w}" height="${h}"/><g class="rv-tree" transform="scale(${R.TK})">` + R.TREE.map(d => `<path class="g" style="stroke-width:${R.treeLine}" d="${d}"/>`).join('') + R.TREE.map(d => `<path class="g" style="stroke:none" d="${d}"/>`).join('') + `<path class="t" d="${R.TREELINES}"/></g><g class="rv-gifts" pointer-events="none"></g>${ravenBird(0)}${ravenBird(1)}<g class="rv-tally">${FIND_PLAY.raven.tally.map(d => `<path class="t" d="${d}" opacity="0"/>`).join('')}</g>`;
};
const serpent = () => findDrawing('serpent');
const beacon = () => {
  const f=FINDS.find(f=>f.id==='beacon'),k=FIND_PLAY.beacon.scale;
  // The clip is outside the animated aim group, in the tower's local map
  // coordinates. It follows the camera with the chart, never the beam angle.
  return `<defs><clipPath id="beacon-frame" clipPathUnits="userSpaceOnUse"><rect x="${(23-f.x)/k}" y="${(23-f.y)/k}" width="${554/k}" height="${854/k}"/></clipPath></defs>`+findDrawing('beacon');
};
const runestone = () => findDrawing('runestone');
const hammerMapArt = () => { const M = HAMMER.map, h = M.hit; return `<rect class="hit" x="${h[0]}" y="${h[1]}" width="${h[2]}" height="${h[3]}"/><path class="g" d="${M.stone}"/><path class="t hm-kept" d="${M.kept}" opacity="0"/><g class="hm-lift"><path class="g" d="${M.hammer}"/><path class="l hm-spark" d="${M.spark}" opacity="0" pointer-events="none"/></g>`; };
const horn = () => { const H = FIND_PLAY.horn, [x, y, w, h] = H.hit; return `<g transform="scale(-1 1)"><rect class="hit" x="${x}" y="${y}" width="${w}" height="${h}"/><g class="hn-horn"><path class="g" d="${H.paths[0]}"/><path class="t" d="${H.paths[1]}"/><path class="o" d="${H.paths[2]}"/><path class="t hn-kept" d="${H.kept}" opacity="0"/></g><path class="t" d="${H.paths[3]}"/></g>`; };
const mist = () => { const M = FIND_PLAY.mist, [x, y, w, h] = M.box; return `<defs><radialGradient id="find-mist-wipe"><stop offset="${M.soft[1]}" stop-color="${C.black}"/><stop offset="1" stop-color="${C.black}" stop-opacity="0"/></radialGradient></defs>` + M.cairns.map(p => `<g transform="translate(${p[0]} ${p[1]}) scale(${M.cairnScale})">${M.cairn}<path class="pf mist-glint" pointer-events="none" d="${starPath(...M.glintAt, M.glintSize)}" opacity="0"/></g>`).join('') + `<rect class="hit" x="${x}" y="${y}" width="${w}" height="${h}"/><g class="mist-drift" pointer-events="none"><g mask="url(#mistMask)"><g class="mist-cloud" opacity="${M.alpha}"><path d="${M.fill}" fill="${C.paper}" fill-opacity=".07"/>${M.strokes.map(d => `<path class="l" d="${d}"/>`).join('')}</g></g></g>`; };
const well = () => { const W = FIND_PLAY.well; return `<ellipse class="hit" rx="${W.hit[0]}" ry="${W.hit[1]}"/><g class="wl-rip" pointer-events="none">${Array.from({ length: W.rings }, () => `<ellipse class="t" rx="${W.ringR[0]}" ry="${W.ringR[1]}" opacity="0"/>`).join('')}</g><circle class="pf wl-pebble" r="${W.pebbleR}" opacity="0" pointer-events="none"/>`; };
const longship = () => {
  const S = FIND_PLAY.ship, P = S.paths, [x, y, w, h] = S.hit;
  return `<g class="ls-rock"><rect class="hit" x="${x}" y="${y}" width="${w}" height="${h}"/><path class="g" d="${P.hull}"/><path class="l" d="${P.ends}"/><path class="l" d="${P.mast}"/><g class="ls-sail"><path class="o" d="${P.sail}"/><path class="t" d="${P.stripes}"/></g><path class="l ls-oars" opacity="0" d="${P.oars}"/>` + S.shields.map((sx, i) => `<circle class="o ls-shield ls-shield-${i}" cx="${sx}" cy="${S.shieldY}" r="${S.shieldR}"/><circle class="pf" cx="${sx}" cy="${S.shieldY}" r="${S.bossR}"/>`).join('') + `<path class="pf ls-pennant" opacity="0" d="${P.pennant}"/><g class="ls-lamp" opacity="0" pointer-events="none"><circle cx="${S.lamp[0]}" cy="${S.lamp[1]}" r="${S.lamp[3]}" fill="url(#glow)"/><circle class="pf" cx="${S.lamp[0]}" cy="${S.lamp[1]}" r="${S.lamp[2]}"/></g><path class="t" d="${P.water}"/></g>`;
};

// map defs (gradients, clips, masks) shared by map and stones
export const mapDefs = () => `<defs>
<radialGradient id="glow"><stop offset="0" stop-color="${C.paper}" stop-opacity=".85"/><stop offset="1" stop-color="${C.paper}" stop-opacity="0"/></radialGradient>
<radialGradient id="litGlow"><stop offset="0" stop-color="${C.paper}" stop-opacity=".45"/><stop offset="1" stop-color="${C.paper}" stop-opacity="0"/></radialGradient>
<radialGradient id="rglow"><stop offset="0" stop-color="${C.red}" stop-opacity=".75"/><stop offset=".55" stop-color="${C.red}" stop-opacity=".22"/><stop offset="1" stop-color="${C.red}" stop-opacity="0"/></radialGradient>
<radialGradient id="oglow"><stop offset="0" stop-color="${C.warm}" stop-opacity=".6"/><stop offset="1" stop-color="${C.warm}" stop-opacity="0"/></radialGradient>
<radialGradient id="flare"><stop offset="0" stop-color="${C.white}"/><stop offset=".3" stop-color="${C.paper}" stop-opacity=".8"/><stop offset="1" stop-color="${C.red}" stop-opacity="0"/></radialGradient>
<linearGradient id="spike" x1="0" x2="1"><stop offset="0" stop-color="${C.red}" stop-opacity="0"/><stop offset=".5" stop-color="${C.white}"/><stop offset="1" stop-color="${C.red}" stop-opacity="0"/></linearGradient>
<linearGradient id="beam" x1="1" x2="0"><stop offset="0" stop-color="${C.paper}" stop-opacity=".5"/><stop offset="1" stop-color="${C.paper}" stop-opacity="0"/></linearGradient>
<filter id="rough" filterUnits="userSpaceOnUse" x="-20" y="-8" width="40" height="16"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="2.2"/></filter>
<filter id="blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6"/></filter>
<clipPath id="cA"><path d="${pathD(COAST_A, 1)}"/></clipPath><clipPath id="cB"><path d="${pathD(COAST_B, 1)}"/></clipPath><clipPath id="neat"><rect x="22" y="22" width="556" height="856"/></clipPath>
<clipPath id="kq"><rect x="0" y="-14" width="14" height="14"/><rect x="-14" y="0" width="14" height="14"/></clipPath>

<mask id="mistMask" maskUnits="userSpaceOnUse" x="80" y="390" width="160" height="100"><rect x="80" y="390" width="160" height="100" fill="${C.white}"/><g id="mistWipes"></g></mask>
</defs>`;

export const stoneDefs = () => `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><radialGradient id="stoneGlow"><stop offset="0" stop-color="${C.paper}" stop-opacity=".5"/><stop offset="1" stop-color="${C.paper}" stop-opacity="0"/></radialGradient></defs></svg>`;

// The whole map. Returns the inner of the camera group.
export function bigMap() {
  const r = rnd(11); let s = '', top = '', top2 = '';  const LB = []; GROVE.length = 0;
  const lab = (x, y, t, o = {}) => { const sz = o.s || 8, w = t.length * (sz * .56 + (o.ls || 0)), x1 = o.a == 'end' ? x - w : o.a == 'middle' ? x - w / 2 : x; LB.push([x1 - 3, y - sz - 2, x1 + w + 3, y + 3]); return svgText(x, y, t, { ...o, h: 1 }); };
  const W = MAP.waypoints;
  const tier = row => { const text = row.lines ? row.lines.map((line,i)=>'<tspan x="0" y="' + i * row.unit * LABELS.line + '">' + line + (i < row.lines.length-1 ? ' ' : '') + '</tspan>').join('') : row.text; return '<g class="label-anchor" data-row="' + row.i + '" transform="translate(' + row.x + ' ' + row.y + ')"><g class="label-scale" data-label="' + row.kind + '" data-unit="' + row.unit + '" data-stop-sub="' + !!row.stopSub + '">' + lab(0, 0, text, { s: row.unit, w: row.name ? 700 : 500, c: row.red ? C.red : row.name ? C.paper : C.note, a: row.anchor, ls: row.ls }) + '</g></g>'; };
  const labelRows = mapLabelRows(); labelRows.forEach(row => { const width = row.text.length * row.unit * LABELS.width, left = row.anchor === 'end' ? row.x - width : row.anchor === 'middle' ? row.x - width / 2 : row.x; LB.push([left - 3, row.y - row.unit - 2, left + width + 3, row.y + 3]); }); top += labelRows.filter(row => !row.stopSub).map(tier).join('');
  top2 += '<g class="map-subs">' + labelRows.filter(row => row.stopSub).map(tier).join('') + '</g>';
  // regions, notes and captions carry their map-unit box, for trip.mjs's fade under the timeline, step bar and hint (L-17)
  const t2 = (box, inner) => '<g class="t2b" data-b="' + box.map(v => +v.toFixed(1)).join(' ') + '">' + inner + '</g>';
  const lab2 = (...a) => { const piece = lab(...a); return t2(LB.at(-1), piece); };
  COPY.regions.forEach(g => { let piece = lab(g.x, g.y, g.t, { s: 5.8, ls: 1.6, c: C.dim, a: 'middle', i: g.i }), box = LB.at(-1).slice(); if (g.rune) { const rw = runeWord(g.rune, 3.2, g.x, g.y + 2.6, 'middle'), rb = [g.x - rw.w / 2 - 2, g.y + 2, g.x + rw.w / 2 + 2, g.y + 7]; LB.push(rb); box = [Math.min(box[0], rb[0]), box[1], Math.max(box[2], rb[2]), rb[3]]; piece += '<path class="rn rn-dim" d="' + rw.d + '"/>'; } top2 += t2(box, piece); });
  COPY.notes.forEach(nt => top2 += lab2(nt.x, nt.y, nt.t, { s: nt.s, i: 1, c: nt.dim ? C.dim : C.note, a: nt.a }));
  const seaW = COPY.sea.length * (5.8 * .56 + 2.4);
  top2 += t2([33, 380 - seaW / 2, 42, 380 + seaW / 2], svgText(40, 380, COPY.sea, { s: 5.8, ls: 2.4, a: 'middle', t: 'rotate(-90 40 380)' }));
  const [gx, gy] = MAP.ygg, [wx, wy] = MAP.well;
  top2 += lab2(...YGG.label, COPY.ygg, { s: 5.4, ls: 1.4, c: C.dim }) + lab2(wx + 58, wy + 32, COPY.well, { s: 4.8, ls: .8, c: C.note, a: 'middle' }) + lab2(wx + 58, wy + 39, COPY.wellSub, { s: 4.4, i: 1, c: C.dim, a: 'middle' });

  // sea
  let rh = ''; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8 + .2; rh += `M92 716L${n1(92 + Math.cos(a) * 1200)} ${n1(716 + Math.sin(a) * 1200)}`; }
  let sea = `<g clip-path="url(#neat)"><path d="${rh}" stroke="${C.paper}" stroke-opacity=".07" stroke-width=".7" fill="none"/>`;
  [[40, 200], [52, 300], [36, 560], [150, 640], [60, 610], [536, 300], [548, 420], [552, 600], [520, 690], [250, 630], [340, 622], [120, 790], [540, 780], [380, 100], [330, 70], [560, 170], [40, 420]].forEach(p => sea += wave(p[0], p[1]));
  sea += shore(COAST_A, 5) + shore(COAST_B, 6) + jormungandr() + '</g>';
  let fill = '', coast = '';
  [[COAST_A, 'cA'], [COAST_B, 'cB']].forEach(([P, id]) => { const d = pathD(P, 1); fill += `<path d="${d}" fill="none" stroke="${C.paper}" class="coast-ticks" data-weight="12" stroke-opacity=".38" stroke-width="12" stroke-dasharray=".7 2.5" vector-effect="non-scaling-stroke"/><path d="${d}" fill="${C.land}"/><path d="${d}" fill="none" stroke="${C.landEdge}" stroke-width="12" clip-path="url(#${id})"/>`; coast += `<path class="coast" d="${d}" fill="none" stroke="${C.paper}" stroke-width="1.2" stroke-opacity=".9" vector-effect="non-scaling-stroke"/>`; });

  // water on land, the well, cliff
  const riv = d => `<path d="${d}" fill="none" stroke="${C.paper}" stroke-opacity=".75" stroke-width="2.8" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${C.land}" stroke-width="1.4" stroke-linecap="round"/>`;
  s += riv(pathD(spline([[214, 392], [236, 399], [252, 393], [268, 395]]))) + riv(pathD(spline([[306, 410], [311, 440], [320, 470], [322, 520], [333, 556], [337, 582]])));
  s += `<path class="wl-bank" d="${pathD(spline([[266, 392], [280, 377], [306, 372], [330, 380], [338, 396], [322, 410], [296, 412], [274, 406]], 1), 1)}" fill="${C.ink}" stroke="${C.paper}" stroke-width="1" vector-effect="non-scaling-stroke"/><path class="t" d="M276 386q4 -3 8 0t8 0M314 404q4 -3 8 0t8 0"/>`;
  s += `<path d="M196 296Q216 330 207 366Q203 384 214 404" fill="none" stroke="${C.paper}" stroke-opacity=".45" stroke-width="7" stroke-dasharray=".8 2.6"/><path class="l" d="M208 374v13M212 372v17M216 374v13"/><path class="t" d="M203 393q9 5 18 0"/>`;
  [[96, 306, 13], [126, 292, 17], [160, 300, 14], [186, 314, 11], [100, 340, 11], [112, 334, 15], [146, 336, 12], [112, 374, 10]].sort((a, b) => a[1] - b[1]).forEach(p => s += peak(p[0], p[1], p[2]));
  [[140, 516, 11], [206, 522, 9], [158, 562, 10], [222, 574, 8], [408, 478, 9], [404, 548, 9], [230, 700, 8]].forEach(p => s += hill(p[0], p[1], p[2]));

  // trees
  const near = (x, y, P, d) => P.some(p => Math.hypot(p[0] - x, p[1] - y) < d), SP = spline([[214, 212], [240, 196], [262, 176]], 0, 6);
  const KEEP = [[300, 392, 46], [370, 330, 26], [372, 368, 16], [404, 300, 16], [250, 506, 22], [208, 262, 14], [452, 556, 14], [456, 184, 26], [256, 768, 16], [228, 724, 14], [134, 200, 26], [470, 520, 70], ...FIND_COPY.beaconNotes.map(n => [n.x, n.y, 16])], tr = [];
  const grove = (cx, cy, rx, ry, n) => { for (let i = 0, k = 0; i < 500 && k < n; i++) { const a = r() * 6.283, d = Math.sqrt(r()), x = cx + Math.cos(a) * d * rx, y = cy + Math.sin(a) * d * ry; if (![[x, y], [x - 8, y], [x + 8, y], [x, y - 15], [x, y + 6]].every(onLand)) continue; if (near(x, y - 5, TRAIL, 11) || near(x, y - 5, SP, 9)) continue; if (LB.some(b => x > b[0] - 5 && x < b[2] + 5 && y > b[1] - 2 && y < b[3] + 13)) continue; if (!yggClear([x, y], YGG.clearance + YGG.groveReach) || inWorldBox([x, y], MAP.toronto.box, YGG.groveReach)) continue; if (KEEP.some(c => Math.hypot(c[0] - x, c[1] - y) < c[2])) continue; if (tr.some(t => Math.hypot(t[0] - x, t[1] - y) < 9)) continue; tr.push([x, y, 3 + r() * 1.6, r() < .45]); k++; } };
  grove(318, 186, 90, 38, 36); grove(392, 372, 36, 46, 10); grove(424, 536, 56, 28, 9); grove(352, 782, 46, 13, 6); grove(190, 498, 36, 16, 5);
  // Move only the three audited pines, preserving the seeded inventory and density.
  for (const [i, dx, dy] of MAP.treeNudges) { tr[i][0] += dx; tr[i][1] += dy; }
  GROVE.push(...tr); tr.sort((a, b) => a[1] - b[1]).forEach(t => s += t[3] ? pine(n1(t[0]), n1(t[1]), n1(t[2])) : tree(n1(t[0]), n1(t[1]), n1(t[2])));
  s += yggdrasil(gx, gy);

  // side trail, bridge, places
  s += `<path d="${pathD(SP)}" fill="none" stroke="${C.paper}" stroke-opacity=".45" stroke-width="1.7" stroke-linecap="round" stroke-dasharray=".1 4.6"/>` + grp(207, 209, .3, sign());
  s += `<rect x="308" y="463" width="22" height="10" fill="${C.land}"/><path class="l" d="M307 463h24M307 473h24"/>`;
  s += `<path d="M34 108Q56 150 92 176" class="t" stroke-dasharray="2 3"/>`;
  s += grp(134, 208, .62, hall()) + grp(96, 181, .6, boat());
  s += grp(458, 271, .55, dock()) + grp(473, 321, .55, dock()) + grp(516, 271, .5, boat()) + grp(533, 259, .42, boat());
  s += grp(124, 372, .6, campus()) + grp(...MAP.toronto.at, 1, toronto()) + `<path class="l" d="M404 662v-11"/>`;
  s += '<g class="map-tier2">' + top2 + '</g>';
  FINDS.filter(f => f.n).forEach(f => s += marker(f.mark[0], f.mark[1], f.n, f.id));

  // title, legend, frame, knots
  // The title and kicker's own group: tripApply fades it out as the journey sets out, back in at the overview and in explore.
  top += '<g class="map-title">' + svgText(44, 78, COPY.title, { s: 30, w: 800, c: C.paper, ls: -.6 });
  const K = LABELS.kicker, P = LABELS.plate, rule = LABELS.rule;
  top += '<g transform="translate(' + K.join(' ') + ')"><g class="label-scale" data-label="small" data-unit="' + LABELS.small.unit + '"><rect x="' + P[0] + '" y="' + P[1] + '" width="' + P[2] + '" height="' + P[3] + '" fill="' + C.ink + '" class="kick-r"/>' + svgText(0, 0, COPY.kicker, { s: LABELS.small.unit, ls: 1.8, cls: 'kick' }) + '<path class="t kick-r" d="M' + rule[0] + ' ' + rule[1] + 'h' + rule[2] + '"/></g></g></g>';
  s += `<rect x="23" y="822" width="554" height="55" fill="${C.ink}"/><line x1="23" y1="822.5" x2="577" y2="822.5" stroke="${C.paper}" stroke-opacity=".3"/>`;
  const M = MARK.legend, [sx, sy, sr, sw, sb, sa] = M;
  s += '<g class="legend-symbol" data-i="0" data-x="68" data-y="836" transform="translate(' + sx + ' ' + sy + ')"><circle class="o" r="' + sr + '"/><path d="M0 0V-' + sr + 'A' + sr + ' ' + sr + ' 0 0 1 ' + sr + ' 0ZM0 0V' + sr + 'A' + sr + ' ' + sr + ' 0 0 1 -' + sr + ' 0Z" fill="' + C.note + '" opacity="' + sa + '"/><circle class="l" r="' + sr + '" stroke-width="' + sw + '"/><circle class="pf" r="' + sb + '"/></g>';
  s += '<path class="legend-symbol" data-i="1" data-x="68" data-y="857" d="M64 853l8 8m0 -8l-8 8" stroke="' + C.red + '" stroke-width="2" stroke-linecap="round"/>' + marker(140, 838, 1).replace('class="mk"', 'class="mk legend-symbol" data-i="2" data-x="140" data-y="838"') + '<path class="legend-symbol" data-i="3" data-x="140" data-y="857" d="M133 857h14" stroke="' + C.paper + '" stroke-width="2.3" stroke-linecap="round" stroke-dasharray=".1 4.5"/>';
  top += Object.values(COPY.legend).map((text, i) => { const p = LABELS.legendAt[i]; return '<g class="lg" transform="translate(' + p.join(' ') + ')"><g class="label-scale" data-label="legend" data-unit="' + LABELS.legend.unit + '">' + svgText(0, 0, text, { s: LABELS.legend.unit, c: C.note }) + '</g></g>'; }).join('');
  s += '<g class="map-tier1">' + top + '</g>';

  s += `<rect x="14.5" y="14.5" width="571" height="871" fill="none" stroke="${C.paper}" stroke-opacity=".35"/><rect x="18" y="18" width="564" height="864" fill="none" stroke="${C.paper}" class="frame-ticks" data-weight="5" stroke-opacity=".28" stroke-width="5" stroke-dasharray="1 15" vector-effect="non-scaling-stroke"/><rect x="22.5" y="22.5" width="555" height="855" fill="none" stroke="${C.paper}" stroke-opacity=".2"/>`;
  s += knot(36, 36) + knot(564, 36) + knot(36, 864) + knot(564, 864);

  // finds
  const F = Object.fromEntries(FINDS.map(f => [f.id, f]));
  let fd = '';
  const at = (id, k, inner) => { const f = F[id]; return findWrap(id, f.label, grp(f.x, f.y, k, inner), f.x, f.y); };
  fd += at('wayfinder', 1, wayfinder());
  fd += `<g id="f-hoards" role="group" aria-label="${F.hoards.label}" data-x="${F.hoards.x}" data-y="${F.hoards.y}">` + FIND_COPY.hoards.map(h => `<g class="find hoard" id="f-${h.id}" role="button" tabindex="0" aria-label="${h.label}" data-x="${h.x}" data-y="${h.y}">${grp(h.x, h.y, FIND_PLAY.hoard.scale, hoard(h.id))}</g>`).join('') + `</g>`;
  fd += at('ravens', FIND_PLAY.raven.scale, ravens()) + at('serpent', FIND_PLAY.serpent.scale, serpent()) + at('beacon', FIND_PLAY.beacon.scale, beacon()) + at('runestone', FIND_PLAY.rune.scale, runestone());
  fd += at('hammer', HAMMER.map.scale, hammerMapArt()) + findWrap('mist', F.mist.label, mist(), F.mist.x, F.mist.y) + at('horn', FIND_PLAY.horn.scale, horn()) + at('well', 1, well());
  fd += `<g id="bc-notes">` + FIND_COPY.beaconNotes.map(n => { const B = FIND_PLAY.beacon; return `<g class="bc-note" opacity="0" transform="translate(${n.x} ${n.y})"><g class="bc-note-in">${runeSvg(n.rune, B.runeSize, 0, B.runeY, 'middle', 'rn rn-note')}<g class="bc-en" opacity="0">${n.t.todo ? svgText(0, B.todoY, COPY.todo, { s: B.todoFont, c: C.dim, a: 'middle' }) : ''}${svgText(0, B.lineY, typeof n.t === 'object' ? n.t.t : n.t, { s: B.noteFont, c: C.paper, a: 'middle', i: 1 })}</g></g></g>`; }).join('') + `</g>`;
  fd += findWrap('longship', F.longship.label, `<g class="ls-ship" transform="translate(${F.longship.x} ${F.longship.y}) scale(${FIND_PLAY.ship.scale})">${longship()}</g>`, F.longship.x, F.longship.y);

  return { sea, fill, coast, detail: s, finds: fd };
}

// The mini-map drawing (viewBox 0 0 600 900)
export const miniMapSvg = () => `<path d="${pathD(COAST_A, 1)}" class="mm-coast"/><path d="${pathD(COAST_B, 1)}" class="mm-coast"/><path d="${pathD(TRAIL)}" class="mm-trail"/>`;

// New sky drawings only. Their exact geometry is supplied from the live data table.
export const depthCloudDrawing = paths => `<path class="o" d="${paths[0]}"/><path class="t" d="${paths[1]}"/><path class="t" d="${paths[2]}"/>`;
export const depthRavenDrawing = paths => `<g class="sky-wing sky-right"><path class="o" d="${paths.wing}"/></g><g class="sky-wing sky-left"><path class="o" d="${paths.wing}"/></g><path class="o" d="${paths.tail}"/><path class="o" d="${paths.body}"/><path class="pf" d="${paths.beak}"/>`;

// New find drawing helpers; their geometry is supplied by the live data tables.
export const findRnd = rnd(FIND_PLAY.seed);
export const pieceIcon = kind => FIND_PLAY.icons[kind] || '';
export function rubbingRunes() {
  const R = FIND_PLAY.rune, letters = [];
  FIND_COPY.runestoneRunes.split(' ').forEach((word, row) => {
    const keys = runeKeys(word), width = keys.reduce((sum, key) => sum + runeGlyph(key, R.runeHeight).w, 0) + Math.max(0, keys.length - 1) * R.runeHeight * R.runeGap;
    let x = R.cx - width / 2;
    keys.forEach((key, i) => { const glyph = runeGlyph(key, R.runeHeight, x, R.tops[row]); letters.push({ d: glyph.d, x: x + glyph.w / 2, y: R.tops[row] + R.runeHeight, letter: word[i].toUpperCase() }); x += glyph.w + R.runeHeight * R.runeGap; });
  });
  return letters;
}
export function rubbingSvg() {
  const R = FIND_PLAY.rune, random = findRnd, paths = rubbingRunes();
  let hatch = '';
  R.hatch.forEach(([a, b, step, lean, width, alpha]) => { for (let x = a; x <= b; x += step) { const dx = (random() * 2 - 1) * R.jitter; hatch += `<path d="M${x + dx} 0L${x - lean + dx} ${R.height}" fill="none" stroke="${C.ink}" stroke-width="${width}" opacity="${alpha}"/>`; } });
  return `<svg class="rubbing" viewBox="0 0 ${R.width} ${R.height}" aria-hidden="true"><defs><radialGradient id="rub-soft"><stop offset="${R.maskCore}" stop-color="${C.white}"/><stop offset="1" stop-color="${C.white}" stop-opacity="0"/></radialGradient><clipPath id="rub-stone"><path d="${R.outline}"/></clipPath><mask id="rub-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="${R.width}" height="${R.height}"><rect width="${R.width}" height="${R.height}" fill="${C.black}"/><g class="rub-circles"></g><rect class="rub-fill" width="${R.width}" height="${R.height}" fill="${C.white}" opacity="0"/></mask></defs><rect width="${R.width}" height="${R.height}" fill="${C.paper}"/><path d="${R.outline}" fill="none" stroke="${C.ink}" opacity="${R.guide}"/><g clip-path="url(#rub-stone)" mask="url(#rub-mask)"><path d="${R.outline}" fill="${C.ink}" opacity="${R.charcoal}"/>${hatch}<path d="${R.outline}" fill="none" stroke="${C.ink}" stroke-width="${R.outlineWidth}" opacity="${R.outlineAlpha}"/><path d="${R.outer}${R.inner}${R.feet}${paths.map(p => p.d).join('')}" fill="none" stroke="${C.paper}" stroke-width="${R.carvingWidth}" stroke-linecap="round"/><circle cx="${R.dot[0]}" cy="${R.dot[1]}" r="${R.dot[2]}" fill="${C.paper}"/></g>${paths.map(p => `<text class="rub-letter" x="${p.x}" y="${p.y + R.letterDown}" text-anchor="middle" font-size="${R.letterSize}" font-weight="${R.letterWeight}" fill="${C.paper}" opacity="0">${p.letter}</text>`).join('')}</svg>`;
}

// Shared sampled geometry: checks and moving parts use the same outlines as the drawing.
export const segmentGap = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy || 1))); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); };
export const outlineGap = (p, poly, closed = true) => Math.min(...poly.slice(closed ? 0 : 1).map((v, i) => segmentGap(p, closed ? poly[(i + poly.length - 1) % poly.length] : poly[i], v)));
export const inWorldBox = (p, b, pad = 0) => p[0] >= b[0] - pad && p[0] <= b[2] + pad && p[1] >= b[1] - pad && p[1] <= b[3] + pad;
export const YGG_CROWN = YGG.crown.map(p => p.map((v, i) => v + MAP.ygg[i]));
export const YGG_ROOTS = YGG.roots.map(row => { const P = spline(row[0], false, YGG.tube.seg).map(p => p.map((v, i) => v + MAP.ygg[i])); P.widths = spline(row[2].map((w, i) => [i, w]), false, YGG.tube.seg).map(p => p[1]); return P; });
export const YGG_TRUNK = YGG.trunkLine.map(p => p.map((v, i) => v + MAP.ygg[i]));
export const yggClear = (p, gap) => !insidePoly(p, YGG_CROWN) && outlineGap(p, YGG_CROWN) >= gap && outlineGap(p, YGG_TRUNK, false) >= gap + 14 && YGG_ROOTS.every(P => P.slice(1).every((b, i) => segmentGap(p, P[i], b) >= gap + Math.max(P.widths[i], P.widths[i + 1]) / 2));
export const GROVE = [];
export const JORM = (() => { const S = spline([...MAP.jorm.lead, ...MAP.jorm.ring.slice(3, -1), ...MAP.jorm.tailEnd], false, MAP.jorm.seg), cum = [0]; for (let i = 1; i < S.length; i++) cum.push(cum[i - 1] + Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1])); return { S, cum, L: cum.at(-1) }; })();
export function jormPoint(u) {
  const at = Math.max(0, Math.min(JORM.L, u)); let i = 1; while (i < JORM.cum.length - 1 && JORM.cum[i] < at) i++;
  const a = JORM.S[i - 1], b = JORM.S[i], q = (at - JORM.cum[i - 1]) / (JORM.cum[i] - JORM.cum[i - 1] || 1);
  return { x: a[0] + (b[0] - a[0]) * q, y: a[1] + (b[1] - a[1]) * q, angle: Math.atan2(b[1] - a[1], b[0] - a[0]) * FIND_PLAY.kit.deg / Math.PI };
}
export function jormEdges(a, b, taper = 0) {
  const J = MAP.jorm, left = [], right = [], mid = [], shares = [a, ...JORM.cum.map(u => u / JORM.L).filter(t => t > a && t < b), b];
  shares.forEach(t => { const p = jormPoint(t * JORM.L), angle = p.angle * Math.PI / FIND_PLAY.kit.deg, u = taper ? Math.min(1, (t - a) / taper, b >= 1 ? 1 : (b - t) / taper) : 1, w = J.w * (t < J.taper[0] ? 1 : 1 - (t - J.taper[0]) / J.taper[1] * J.taper[2]) / 2 * (taper ? J.edgeNarrow[0] + J.edgeNarrow[1] * Math.sin(Math.PI / 2 * Math.max(0, u)) : 1); left.push([p.x - Math.sin(angle) * w, p.y + Math.cos(angle) * w]); right.push([p.x + Math.sin(angle) * w, p.y - Math.cos(angle) * w]); mid.push([p.x, p.y]); });
  return { left, right, mid };
}
// Option A's ribbon kit. The interior ring is unchanged; the approved lead and tail join its ends.
const joTracks = new Map();
function joTrack(open = 0) {
  if (joTracks.has(open)) return joTracks.get(open);
  const J = MAP.jorm, end = [J.ring.at(-2), ...J.tailEnd].map((p, i) => p.map((v, k) => v + (J.tailOpen[i][k] - v) * open));
  const S = spline([...J.lead, ...J.ring.slice(3, -2), ...end], false, J.seg), cum = [0];
  for (let i = 1; i < S.length; i++) cum.push(cum[i - 1] + Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1]));
  const L = cum.at(-1), at = u => { u = Math.max(0, Math.min(L, u)); let i = 1; while (i < cum.length - 1 && cum[i] < u) i++; const a = S[i - 1], b = S[i], q = (u - cum[i - 1]) / (cum[i] - cum[i - 1] || 1), dx = b[0] - a[0], dy = b[1] - a[1], length = Math.hypot(dx, dy) || 1; return { x: a[0] + dx * q, y: a[1] + dy * q, tx: dx / length, ty: dy / length }; };
  const T = { L, at }; if (open === 0 || open === 1) joTracks.set(open, T); return T;
}
function joRibbon(T, a, b, width, step = 2.5) {
  const left = [], right = [], mid = [], n = Math.max(2, Math.ceil((b - a) / step));
  for (let i = 0; i <= n; i++) { const u = a + (b - a) * i / n, p = T.at(u), w = width(u) / 2; left.push([p.x - p.ty * w, p.y + p.tx * w]); right.push([p.x + p.ty * w, p.y - p.tx * w]); mid.push([p.x, p.y, p.tx, p.ty, w]); }
  return { left, right, mid };
}
const joWidth = (T, u, lumps = []) => { const J = MAP.jorm, t = u / T.L; return J.w * (t < .9 ? 1 : 1 - (t - .9) / .1 * .8) * (1 + J.neck * Math.exp(-u / 30)) + lumps.reduce((sum, p) => sum + (p.horn ? J.hornExtra : J.swellExtra) * Math.exp(-((u - p.u * T.L) ** 2) / 70), 0); };
export function jormSegment(index, open = 0, lumps = []) {
  const T = joTrack(open), J = MAP.jorm, [a, b] = J.surf[index], u0 = a * joTrack().L, u1 = index === J.surf.length - 1 ? T.L : b * joTrack().L;
  const e = joRibbon(T, u0, u1, u => { const d = Math.min(index === 0 ? 1e9 : u - u0, index === J.surf.length - 1 ? 1e9 : u1 - u); return joWidth(T, u, lumps) * (.35 + .65 * Math.sin(Math.PI / 2 * Math.min(1, d / 22))); });
  const inner = k => e.mid.map(m => [m[0] - m[3] * m[4] * k, m[1] + m[2] * m[4] * k]); let bands = '', studs = '';
  e.mid.forEach((m, i) => {
    if (i % 2 === 1 && m[4] > 2.2) studs += 'M' + n1(m[0] - .55) + ' ' + n1(m[1]) + 'a.55 .55 0 1 0 1.1 0a.55 .55 0 1 0 -1.1 0';
    if (i % 18 === 14 && m[4] > 2.5) for (const o of [-1.3, 1.3]) { const x = m[0] + m[2] * o, y = m[1] + m[3] * o; bands += 'M' + n1(x - m[3] * m[4]) + ' ' + n1(y + m[2] * m[4]) + 'L' + n1(x + m[3] * m[4]) + ' ' + n1(y - m[2] * m[4]); }
  });
  return { outer: pathD([...e.left, ...e.right.slice().reverse()], true), inner: pathD(inner(.5)) + pathD(inner(-.5)), bands, studs };
}
export function jormSubTail(open = 0) {
  const T = joTrack(open), e = joRibbon(T, MAP.jorm.surf.at(-1)[0] * joTrack().L, T.L - 4, u => joWidth(T, u) * .75, 4);
  return { fill: pathD([...e.left, ...e.right.slice().reverse()], true), edge: pathD(e.left) + pathD(e.right) };
}
export function jormungandr() {
  const J = MAP.jorm, T = joTrack(), e = joRibbon(T, 0, J.surf.at(-1)[0] * T.L, u => joWidth(T, u) * .75, 4), tail = jormSubTail(), shadow = (fill, edge, cls = '') => '<path class="jo-sub-fill ' + cls + '" d="' + fill + '" fill="' + C.ink + '" opacity=".55"/><path class="jo-sub-edge ' + cls + '" d="' + edge + '" fill="none" stroke="' + C.paper + '" stroke-opacity=".22" stroke-width=".8" stroke-dasharray="3 2.2" vector-effect="non-scaling-stroke"/>';
  let s = '<g class="jo-body jg-ring">' + shadow(pathD([...e.left, ...e.right.slice().reverse()], true), pathD(e.left) + pathD(e.right)) + shadow(tail.fill, tail.edge, 'jo-tail-sub');
  J.surf.forEach(([a, b], i) => {
    const p = jormSegment(i); s += '<g class="jo-surface" data-i="' + i + '"><path class="o jo-outline" d="' + p.outer + '"/><path class="t jo-inner" d="' + p.inner + '"/><g class="jd"><path class="pf jo-studs" stroke="none" d="' + p.studs + '"/></g><path class="l jo-bands" d="' + p.bands + '"/></g>';
    for (const u of [i ? a * T.L : null, i < J.surf.length - 1 ? b * T.L : null]) if (u !== null) { const p = T.at(u); s += '<path class="t" d="M' + n1(p.x - 7) + ' ' + n1(p.y + 1) + 'q2.4 -2 4.8 0t4.8 0"/><g class="jd"><path class="t" d="M' + n1(p.x - 4) + ' ' + n1(p.y + 4.5) + 'q1.7 -2 3.4 0t3.4 0"/></g>'; }
  });
  s += '<path class="t jo-release-ripple" d="M433 129q4 -2 8 0t8 0" opacity="0"/>';
  s += Array.from({ length: 4 }, () => '<g class="jg-swell" opacity="0"><path class="o jg-gulp" d="M-3.6 -4.6H1.4L3.6 -2.4V4.6H-3.6Z" transform="rotate(90)"/><path class="t jg-file-lines" d="M-2 -1.6V1.6M0 -1.6V1.6"/><path class="o jg-hear" d="' + J.hornPath + '" opacity="0"/></g>').join('');
  return s + '</g>';
}


export function mapLabelRows() {
  const rows = []; STOPS.forEach(st => { const L = st.label; rows.push({ kind: 'name', unit: LABELS.name.unit, text: L.t, x: L.x, y: L.y + LABELS.nameDY, anchor: L.a, name: true, ls: L.tracking, stop: st.id }); });
  rows.push({ kind: 'x', unit: LABELS.x.unit, text: COPY.xLabel, lines: COPY.xLabel.split(LABELS.xBreak).map((s,i)=>i ? LABELS.xBreak.trimStart()+s : s), x: MAP.x[0] + LABELS.xAt[0], y: MAP.x[1] + LABELS.xAt[1] + LABELS.nameDY, anchor: 'start', name: true, red: true, stop: 'x' }, { kind: 'sub', unit: LABELS.sub.unit, text: COPY.xSub, x: MAP.x[0] + LABELS.xSubAt[0], y: MAP.x[1] + LABELS.xSubAt[1] + LABELS.xSubDY, anchor: 'start', stopSub: true, stop: 'x' });
  rows.forEach((row, i) => { row.i = i; }); return rows;
}

export function mapLabelBox(row, s, phone) {
  const L = LABELS[row.kind], k = Math.max(1, (phone ? L.phone : L.floor) / (row.unit * s));
  const length = Math.max(...(row.lines || [row.text]).map(s=>s.length)), width = (length * row.unit * LABELS.width + (length - 1) * (row.ls || 0)) * k;
  const left = row.anchor === 'end' ? row.x - width : row.anchor === 'middle' ? row.x - width / 2 : row.x, halo = ['name','x','sub'].includes(row.kind) ? LABELS.halo * k : 0;
  return [left - halo, row.y - row.unit * k * LABELS.ascent - halo, left + width + halo, row.y + row.unit * k * (LABELS.descent + ((row.lines?.length || 1) - 1) * LABELS.line) + halo];
}
