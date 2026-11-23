// Every drawing as a function that returns an SVG string. Geometry and glyphs ported from reference/round2.cjs.
import { C, MAP, COPY, STOPS, FINDS, FIND_COPY, FIND_PLAY, HAMMER } from './data.mjs';

export const rnd = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
export const n1 = n => +(+n).toFixed(1);
export const spline = (P, closed, seg = 10) => { const n = P.length, out = [], g = i => closed ? P[(i + n) % n] : P[Math.max(0, Math.min(n - 1, i))]; for (let i = 0; i < (closed ? n : n - 1); i++) { const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2); for (let j = 0; j < seg; j++) { const t = j / seg, t2 = t * t, t3 = t2 * t; out.push([0, 1].map(k => .5 * (2 * p1[k] + (p2[k] - p0[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * t3))); } } if (!closed) out.push(P[n - 1]); return out; };
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
const marker = (x, y, n, id) => `<g class="mk"${id ? ` id="mk-${id}"` : ''}><circle cx="${x}" cy="${y}" r="6.2" fill="${C.ink}" stroke="${C.red}" stroke-width="1.2"/><text x="${x}" y="${y + 2.6}" font-size="7.5" font-weight="800" fill="${C.red}" text-anchor="middle">${n}</text></g>`;
const tube = (d, w, k, cls = '') => `<path${cls} d="${d}" fill="none" stroke="${C.paper}" stroke-width="${w}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${C.land}" stroke-width="${n1(w - 2.2 / k)}" stroke-linecap="round"/>`;

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
const city = () => { let s = ''; [[-24, 14, 26], [-4, 16, 38], [18, 17, 54]].forEach(([x, w, h]) => { s += `<rect class="g" x="${x}" y="${-h}" width="${w}" height="${h}"/><rect x="${x + 2}" y="${-h + 3}" width="${w - 4}" height="${h - 5}" fill="url(#win)"/>`; }); return s + `<path class="l" d="M46 0V-68"/><ellipse class="g" cx="46" cy="-46" rx="5" ry="2.6"/><path class="t" d="M-30 0H54"/>`; };
const shore = (P, seed) => { const r = rnd(seed), n = P.length; let s = '', ar2 = 0; for (let i = 0; i < n; i++) { const a = P[i], b = P[(i + 1) % n]; ar2 += a[0] * b[1] - b[0] * a[1]; } const sg = ar2 > 0 ? 1 : -1; for (let i = 0; i < n; i++) { const a = P[i], b = P[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; for (let j = 0; j < 3; j++) { const d = 4 + Math.pow(r(), 1.7) * 30, t = r(), x = a[0] + dx * t + sg * dy / L * d, y = a[1] + dy * t - sg * dx / L * d; if (onLand([x, y]) || y > 818) continue; s += `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(.35 + r() * .55)}" fill="${C.paper}" opacity="${n1(Math.max(.12, .8 - d / 45))}"/>`; } } return s; };

// ---- Norse landmarks ----
export const yggdrasil = (x, y) => `<g class="ygg"><path class="g" d="M${x - 30} ${y - 36}Q${x - 42} ${y - 50} ${x - 27} ${y - 58}Q${x - 22} ${y - 72} ${x - 3} ${y - 68}Q${x + 13} ${y - 75} ${x + 24} ${y - 63}Q${x + 40} ${y - 56} ${x + 31} ${y - 40}Q${x + 18} ${y - 30} ${x + 2} ${y - 34}Q${x - 14} ${y - 29} ${x - 30} ${y - 36}Z"/>`
  + `<path class="g" d="M${x - 3} ${y}L${x - 2.2} ${y - 36}H${x + 2.2}L${x + 3} ${y}Z"/>`
  + `<path class="t" d="M${x} ${y - 34}L${x - 20} ${y - 50}M${x} ${y - 38}L${x + 21} ${y - 52}M${x} ${y - 44}L${x - 9} ${y - 62}M${x} ${y - 44}L${x + 10} ${y - 63}M${x - 12} ${y - 42}L${x - 24} ${y - 44}M${x + 12} ${y - 44}L${x + 25} ${y - 46}"/>`
  + `<path class="l" d="M${x - 3} ${y}Q${x - 12} ${y + 3} ${x - 20} ${y + 11}M${x + 3} ${y}Q${x + 12} ${y + 4} ${x + 19} ${y + 11}M${x - 1} ${y}Q${x - 3} ${y + 8} ${x - 7} ${y + 15}M${x + 1} ${y}Q${x + 4} ${y + 8} ${x + 7} ${y + 14}"/></g>`;
// interlace knot, about 22 units: a rounded square and a diamond woven over and under by quadrant
export const knot = (cx, cy) => {
  const sq = 'M-7 -7.5Q0 -11 7 -7.5Q11 0 7 7.5Q0 11 -7 7.5Q-11 0 -7 -7.5Z';
  const di = 'M0 -11Q4.5 -4.5 11 0Q4.5 4.5 0 11Q-4.5 4.5 -11 0Q-4.5 -4.5 0 -11Z';
  const band = (d, cp) => `<path d="${d}" fill="none" stroke="${C.ink}" stroke-width="2.6"${cp}/><path class="l" d="${d}"${cp}/>`;
  return `<g class="chart-knot" transform="translate(${cx} ${cy})">${band(sq, '')}${band(di, '')}${band(sq, ' clip-path="url(#kq)"')}<circle class="pf" r="1.1"/></g>`;
};
// standing stone for the stop marks (HTML), viewBox 0 0 260 400
export const stoneSvg = rune => `<svg class="stone" viewBox="0 0 260 400" aria-hidden="true"><circle class="st-glow" cx="130" cy="200" r="190" fill="url(#stoneGlow)"/><path class="st-ink" d="M44 392L30 150Q36 34 130 10Q224 34 230 156L218 392Z"/><path class="st-fill" d="M44 392L30 150Q36 34 130 10Q224 34 230 156L218 392Z"/><path class="st-line" d="M44 392L30 150Q36 34 130 10Q224 34 230 156L218 392Z"/><path class="st-rune" d="${runeGlyph(rune, 190, 130 - runeGlyph(rune, 190).w / 2, 110).d}"/></svg>`;

// ---- finds (each wrapped in a group the finds module wires up) ----
const findWrap = (id, label, inner, x, y) => `<g class="find" id="f-${id}" role="button" tabindex="0" aria-label="${label}" data-x="${x}" data-y="${y}">${inner}</g>`;
const findDrawing = kind => FIND_PLAY.drawings[kind].replace(/\{\{([\w.]+)\}\}/g, (match, path) => path === 'hoard.glintPath' ? starPath(...FIND_PLAY.hoard.glintAt, FIND_PLAY.hoard.glintSize) : path.split('.').reduce((value, key) => value[key], FIND_PLAY));
const wayfinder = () => findDrawing('wayfinder');
const hoard = () => findDrawing('hoard');
const ravens = () => findDrawing('ravens');
const serpent = () => findDrawing('serpent');
const beacon = () => findDrawing('beacon');
const runestone = () => findDrawing('runestone');
const hammerMapArt = () => { const M = HAMMER.map, h = M.hit; return `<rect class="hit" x="${h[0]}" y="${h[1]}" width="${h[2]}" height="${h[3]}"/><path class="g" d="${M.stone}"/><g class="hm-lift"><path class="l" d="${M.hammer}"/><path class="l hm-spark" d="${M.spark}" opacity="0" pointer-events="none"/></g>`; };
const horn = () => { const H = FIND_PLAY.horn, [x, y, w, h] = H.hit; return `<rect class="hit" x="${x}" y="${y}" width="${w}" height="${h}"/><g class="hn-horn"><path class="g" d="${H.paths[0]}"/><path class="t" d="${H.paths[1]}"/><path class="l" d="${H.paths[2]}"/></g><path class="t" d="${H.paths[3]}"/>`; };
const mist = () => { const M = FIND_PLAY.mist, [x, y, w, h] = M.box; return `<defs><radialGradient id="find-mist-soft"><stop stop-color="${C.paper}"/><stop offset="1" stop-color="${C.paper}" stop-opacity="0"/></radialGradient><radialGradient id="find-mist-wipe"><stop offset="${M.soft[1]}" stop-color="${C.black}"/><stop offset="1" stop-color="${C.black}" stop-opacity="0"/></radialGradient></defs>` + M.cairns.map(p => `<g transform="translate(${p[0]} ${p[1]}) scale(${M.cairnScale})">${M.cairn}<path class="pf mist-glint" pointer-events="none" d="${starPath(...M.glintAt, M.glintSize)}" opacity="0"/></g>`).join('') + `<rect class="hit" x="${x}" y="${y}" width="${w}" height="${h}"/><g class="mist-drift" pointer-events="none"><g mask="url(#mistMask)"><g class="mist-cloud" opacity="${M.alpha}">${M.ellipses.map(p => `<ellipse cx="${p[0]}" cy="${p[1]}" rx="${p[2]}" ry="${p[3]}" fill="url(#find-mist-soft)"/>`).join('')}</g></g></g>`; };
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
<pattern id="win" width="4" height="5" patternUnits="userSpaceOnUse"><rect x="1" y="1" width="1.6" height="2.2" fill="${C.paper}" opacity=".55"/></pattern>
<filter id="rough" filterUnits="userSpaceOnUse" x="-20" y="-8" width="40" height="16"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="2.2"/></filter>
<filter id="blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6"/></filter>
<clipPath id="cA"><path d="${pathD(COAST_A, 1)}"/></clipPath><clipPath id="cB"><path d="${pathD(COAST_B, 1)}"/></clipPath><clipPath id="neat"><rect x="22" y="22" width="556" height="856"/></clipPath>
<clipPath id="kq"><rect x="0" y="-14" width="14" height="14"/><rect x="-14" y="0" width="14" height="14"/></clipPath>
<clipPath id="hclip"><rect x="-44" y="-140" width="88" height="140"/></clipPath>
<mask id="mistMask" maskUnits="userSpaceOnUse" x="80" y="390" width="160" height="100"><rect x="80" y="390" width="160" height="100" fill="${C.white}"/><g id="mistWipes"></g></mask>
</defs>`;

export const stoneDefs = () => `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><radialGradient id="stoneGlow"><stop offset="0" stop-color="${C.paper}" stop-opacity=".5"/><stop offset="1" stop-color="${C.paper}" stop-opacity="0"/></radialGradient></defs></svg>`;

// The whole map. Returns the inner of the camera group.
export function bigMap() {
  const r = rnd(11); let s = '', top = ''; const LB = [];
  const lab = (x, y, t, o = {}) => { const sz = o.s || 8, w = t.length * (sz * .56 + (o.ls || 0)), x1 = o.a == 'end' ? x - w : o.a == 'middle' ? x - w / 2 : x; LB.push([x1 - 3, y - sz - 2, x1 + w + 3, y + 3]); return svgText(x, y, t, { ...o, h: 1 }); };
  const W = MAP.waypoints;
  STOPS.forEach(st => { const L = st.label; top += lab(L.x, L.y, L.t, { s: 9.5, w: 700, c: C.paper, a: L.a }) + lab(L.x, L.y + 9.5, L.sub, { s: 6.3, c: C.note, a: L.a }); });
  COPY.regions.forEach(g => { top += lab(g.x, g.y, g.t, { s: 5.8, ls: 1.6, c: C.dim, a: 'middle', i: g.i }); if (g.rune) { const rw = runeWord(g.rune, 3.2, g.x, g.y + 2.6, 'middle'); LB.push([g.x - rw.w / 2 - 2, g.y + 2, g.x + rw.w / 2 + 2, g.y + 7]); top += `<path class="rn rn-dim" d="${rw.d}"/>`; } });
  COPY.notes.forEach(nt => top += lab(nt.x, nt.y, nt.t, { s: nt.s, i: 1, c: nt.dim ? C.dim : C.note, a: nt.a }));
  const [xx, xy] = MAP.x;
  top += lab(xx + 16, xy + 8, COPY.xLabel, { s: 8.5, w: 700, c: C.red }) + lab(xx + 16, xy + 17.5, COPY.xSub, { s: 6.3, c: C.note });
  top += svgText(40, 380, COPY.sea, { s: 5.8, ls: 2.4, a: 'middle', t: 'rotate(-90 40 380)' });
  const [gx, gy] = MAP.ygg, [wx, wy] = MAP.well;
  top += lab(gx + 36, gy - 46, COPY.ygg, { s: 5.4, ls: 1.4, c: C.dim }) + lab(wx, wy + 1, COPY.well, { s: 4.8, ls: .8, c: C.note, a: 'middle' }) + lab(wx, wy + 8, COPY.wellSub, { s: 4.4, i: 1, c: C.dim, a: 'middle' });

  // sea
  let rh = ''; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8 + .2; rh += `M92 716L${n1(92 + Math.cos(a) * 1200)} ${n1(716 + Math.sin(a) * 1200)}`; }
  let sea = `<g clip-path="url(#neat)"><path d="${rh}" stroke="${C.paper}" stroke-opacity=".07" stroke-width=".7" fill="none"/>`;
  [[40, 200], [52, 300], [36, 560], [150, 640], [60, 610], [536, 300], [548, 420], [552, 600], [520, 690], [250, 630], [340, 622], [120, 790], [540, 780], [380, 100], [330, 70], [560, 170], [40, 420]].forEach(p => sea += wave(p[0], p[1]));
  sea += shore(COAST_A, 5) + shore(COAST_B, 6) + '</g>';
  let fill = '', coast = '';
  [[COAST_A, 'cA'], [COAST_B, 'cB']].forEach(([P, id]) => { const d = pathD(P, 1); fill += `<path d="${d}" fill="none" stroke="${C.paper}" stroke-opacity=".38" stroke-width="12" stroke-dasharray=".7 2.5"/><path d="${d}" fill="${C.land}"/><path d="${d}" fill="none" stroke="${C.landEdge}" stroke-width="12" clip-path="url(#${id})"/>`; coast += `<path class="coast" d="${d}" fill="none" stroke="${C.paper}" stroke-width="1.2" stroke-opacity=".9" vector-effect="non-scaling-stroke"/>`; });

  // water on land, the well, cliff
  const riv = d => `<path d="${d}" fill="none" stroke="${C.paper}" stroke-opacity=".75" stroke-width="2.8" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${C.land}" stroke-width="1.4" stroke-linecap="round"/>`;
  s += riv(pathD(spline([[214, 392], [236, 399], [252, 393], [268, 395]]))) + riv(pathD(spline([[306, 410], [311, 440], [320, 470], [322, 520], [333, 556], [337, 582]])));
  s += `<path d="${pathD(spline([[266, 392], [280, 377], [306, 372], [330, 380], [338, 396], [322, 410], [296, 412], [274, 406]], 1), 1)}" fill="${C.ink}" stroke="${C.paper}" stroke-width="1" vector-effect="non-scaling-stroke"/><path class="t" d="M276 386q4 -3 8 0t8 0M314 404q4 -3 8 0t8 0"/>`;
  s += `<path d="M196 296Q216 330 207 366Q203 384 214 404" fill="none" stroke="${C.paper}" stroke-opacity=".45" stroke-width="7" stroke-dasharray=".8 2.6"/><path class="l" d="M208 374v13M212 372v17M216 374v13"/><path class="t" d="M203 393q9 5 18 0"/>`;
  [[96, 306, 13], [126, 292, 17], [160, 300, 14], [186, 314, 11], [84, 340, 11], [112, 334, 15], [146, 336, 12], [92, 374, 10]].sort((a, b) => a[1] - b[1]).forEach(p => s += peak(p[0], p[1], p[2]));
  [[140, 516, 11], [206, 522, 9], [128, 568, 10], [222, 574, 8], [408, 478, 9], [404, 548, 9], [230, 700, 8]].forEach(p => s += hill(p[0], p[1], p[2]));

  // trees
  const near = (x, y, P, d) => P.some(p => Math.hypot(p[0] - x, p[1] - y) < d), SP = spline([[214, 212], [240, 196], [262, 176]], 0, 6);
  const KEEP = [[300, 392, 46], [300, 340, 44], [370, 330, 26], [366, 354, 16], [404, 300, 16], [250, 506, 22], [208, 262, 14], [452, 556, 14], [456, 184, 26], [256, 768, 16], [408, 738, 42], [228, 724, 14], [134, 200, 26], [470, 520, 70], ...FIND_COPY.beaconNotes.map(n => [n.x, n.y, 16])], tr = [];
  const grove = (cx, cy, rx, ry, n) => { for (let i = 0, k = 0; i < 500 && k < n; i++) { const a = r() * 6.283, d = Math.sqrt(r()), x = cx + Math.cos(a) * d * rx, y = cy + Math.sin(a) * d * ry; if (![[x, y], [x - 8, y], [x + 8, y], [x, y - 15], [x, y + 6]].every(onLand)) continue; if (near(x, y - 5, TRAIL, 11) || near(x, y - 5, SP, 9)) continue; if (LB.some(b => x > b[0] - 5 && x < b[2] + 5 && y > b[1] - 2 && y < b[3] + 13)) continue; if (KEEP.some(c => Math.hypot(c[0] - x, c[1] - y) < c[2])) continue; if (tr.some(t => Math.hypot(t[0] - x, t[1] - y) < 9)) continue; tr.push([x, y, 3 + r() * 1.6, r() < .45]); k++; } };
  grove(318, 186, 90, 38, 36); grove(392, 372, 36, 46, 10); grove(424, 536, 56, 28, 9); grove(352, 782, 46, 13, 6); grove(190, 498, 36, 16, 5);
  tr.sort((a, b) => a[1] - b[1]).forEach(t => s += t[3] ? pine(n1(t[0]), n1(t[1]), n1(t[2])) : tree(n1(t[0]), n1(t[1]), n1(t[2])));
  s += yggdrasil(gx, gy);

  // side trail, bridge, places
  s += `<path d="${pathD(SP)}" fill="none" stroke="${C.paper}" stroke-opacity=".45" stroke-width="1.7" stroke-linecap="round" stroke-dasharray=".1 4.6"/>` + grp(207, 209, .3, sign());
  s += `<rect x="308" y="463" width="22" height="10" fill="${C.land}"/><path class="l" d="M307 463h24M307 473h24"/>`;
  s += `<path d="M34 108Q56 150 92 176" class="t" stroke-dasharray="2 3"/>`;
  s += grp(134, 208, .62, hall()) + grp(96, 181, .6, boat());
  s += grp(458, 271, .55, dock()) + grp(473, 321, .55, dock()) + grp(487, 297, .5, boat()) + grp(470, 304, .42, boat());
  s += grp(124, 372, .6, campus()) + grp(404, 752, .62, city()) + `<path class="l" d="M404 662v-11"/>`;
  s += top;
  FINDS.filter(f => f.n).forEach(f => s += marker(f.mark[0], f.mark[1], f.n, f.id));

  // title, legend, frame, knots
  s += svgText(44, 78, COPY.title, { s: 30, w: 800, c: C.paper, ls: -.6 }) + `<rect x="42" y="86" width="204" height="13" fill="${C.ink}"/>` + svgText(45, 95, COPY.kicker, { s: 6.5, ls: 1.8 }) + `<path class="t" d="M45 103h196"/>`;
  s += `<rect x="23" y="822" width="554" height="55" fill="${C.ink}"/><line x1="23" y1="822.5" x2="577" y2="822.5" stroke="${C.paper}" stroke-opacity=".3"/>`;
  s += `<path class="l" d="M64 843L63.4 834Q64 830 68 829Q72 830 72.6 834L72 843Z"/><path class="rn" d="${runeGlyph('l', 5, 67, 832.5).d}"/>` + svgText(80, 840.5, COPY.legend.stop, { s: 6.5, c: C.note }) + `<path d="M64 853l8 8m0 -8l-8 8" stroke="${C.red}" stroke-width="2" stroke-linecap="round"/>` + svgText(80, 859.5, COPY.legend.work, { s: 6.5, c: C.note });
  s += marker(140, 838, 1) + svgText(151, 840.5, COPY.legend.find, { s: 6.5, c: C.note }) + `<path d="M133 857h14" stroke="${C.paper}" stroke-width="2.3" stroke-linecap="round" stroke-dasharray=".1 4.5"/>` + svgText(151, 859.5, COPY.legend.trail, { s: 6.5, c: C.note });
  s += `<rect x="14.5" y="14.5" width="571" height="871" fill="none" stroke="${C.paper}" stroke-opacity=".35"/><rect x="18" y="18" width="564" height="864" fill="none" stroke="${C.paper}" stroke-opacity=".28" stroke-width="5" stroke-dasharray="1 15"/><rect x="22.5" y="22.5" width="555" height="855" fill="none" stroke="${C.paper}" stroke-opacity=".2"/>`;
  s += knot(36, 36) + knot(564, 36) + knot(36, 864) + knot(564, 864);

  // finds
  const F = Object.fromEntries(FINDS.map(f => [f.id, f]));
  let fd = '';
  const at = (id, k, inner) => { const f = F[id]; return findWrap(id, f.label, grp(f.x, f.y, k, inner), f.x, f.y); };
  fd += `<g id="wf-lines" pointer-events="none"></g>` + at('wayfinder', 1, wayfinder());
  fd += `<g id="f-hoards" role="button" tabindex="0" aria-label="${F.hoards.label}" data-x="${F.hoards.x}" data-y="${F.hoards.y}">` + FIND_COPY.hoards.map(h => `<g class="find hoard" id="f-${h.id}" role="button" tabindex="0" aria-label="${h.label}" data-x="${h.x}" data-y="${h.y}">${grp(h.x, h.y, FIND_PLAY.hoard.scale, hoard())}</g>`).join('') + `</g>`;
  fd += at('ravens', FIND_PLAY.raven.scale, ravens()) + at('serpent', FIND_PLAY.serpent.scale, `<g class="sp-swim">${serpent(FIND_PLAY.serpent.scale)}</g>`) + at('beacon', FIND_PLAY.beacon.scale, beacon()) + at('runestone', FIND_PLAY.rune.scale, runestone());
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
