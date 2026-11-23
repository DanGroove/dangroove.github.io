const fs = require('fs');
const { chromium } = require('playwright');
const [SCR, FONT, OUT] = process.argv.slice(2);
const INK = '#151314', PAPER = '#F7F6F3', RED = '#F0484F', LINE = '#2E2B29', MID = '#4A4541', DIM = '#9A948D', NOTE = '#C9C4BD', LAND = '#1F1C1D', NAVY = '#1E345D', GREEN = '#0D7247';
const uri = (p, m) => `data:${m};base64,` + fs.readFileSync(p).toString('base64');
const LOGO = uri(SCR + '/hmc/logo.png', 'image/png'), MOCK = uri(SCR + '/hmc/mock.jpg', 'image/jpeg');
const rnd = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const f = n => +(+n).toFixed(1);
const T = (x, y, s, o = {}) => `<text x="${x}" y="${y}" font-size="${o.s || 8}" fill="${o.c || DIM}" font-weight="${o.w || 500}" text-anchor="${o.a || 'start'}"${o.i ? ' font-style="italic"' : ''}${o.ls ? ` letter-spacing="${o.ls}"` : ''}${o.h ? ' class="h"' : ''}${o.t ? ` transform="${o.t}"` : ''}${o.op ? ` opacity="${o.op}"` : ''}>${s}</text>`;
const N = (x, y, s, a) => T(x, y, s, { s: 8.5, c: NOTE, i: 1, a });
const G = (x, y, k, s, rot) => `<g transform="translate(${x} ${y})${rot ? ` rotate(${rot})` : ''} scale(${k})">${s}</g>`;
const dots = (seed, n, x, y, w, h) => { const r = rnd(seed); let s = ''; for (let i = 0; i < n; i++) s += `<circle cx="${f(x + r() * w)}" cy="${f(y + r() * h)}" r="${f(.4 + r() * .8)}" fill="${r() < .07 ? RED : PAPER}" opacity="${f(.2 + r() * .45)}"/>`; return s; };
const sp = (x, y, s, c) => `<path transform="translate(${x} ${y})" d="M0 ${-s}Q0 0 ${s} 0Q0 0 0 ${s}Q0 0 ${-s} 0Q0 0 0 ${-s}Z" fill="${c || PAPER}"/>`;
const trav = (x, y) => `<circle cx="${x}" cy="${y}" r="11" fill="${RED}" opacity=".22"/>` + sp(x, y, 6.5, RED);
const cursor = (x, y) => `<path transform="translate(${x} ${y})" d="M0 0v15l4.2 -3.6l2.8 6.4l2.6 -1.1l-2.8 -6.3h5.6z" fill="${PAPER}" stroke="${INK}" stroke-width=".9"/>`;
const mk = (x, y, n) => `<circle cx="${x}" cy="${y}" r="6.2" fill="${INK}" stroke="${RED}" stroke-width="1.2"/><text x="${x}" y="${y + 2.6}" font-size="7.5" font-weight="800" fill="${RED}" text-anchor="middle">${n}</text>`;
const chev = (x, y) => `<path class="t" d="M${x} ${y - 7}l8 7l-8 7"/>`;
const ar = (x, y, c) => `<path d="M${x} ${y}h10m-4 -4l4 4l-4 4" fill="none" stroke="${c}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
const ne = (x, y, s, c) => `<path d="M${x} ${y + s}L${x + s} ${y}M${f(x + s * .3)} ${y}H${x + s}V${f(y + s * .7)}" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`;

// geometry
const spline = (P, closed, seg = 10) => { const n = P.length, out = [], g = i => closed ? P[(i + n) % n] : P[Math.max(0, Math.min(n - 1, i))]; for (let i = 0; i < (closed ? n : n - 1); i++) { const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2); for (let j = 0; j < seg; j++) { const t = j / seg, t2 = t * t, t3 = t2 * t; out.push([0, 1].map(k => .5 * (2 * p1[k] + (p2[k] - p0[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * t3))); } } if (!closed) out.push(P[n - 1]); return out; };
const D = (P, closed) => 'M' + P.map(p => f(p[0]) + ' ' + f(p[1])).join('L') + (closed ? 'Z' : '');
const inside = (pt, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const xi = poly[i][0], yi = poly[i][1], xj = poly[j][0], yj = poly[j][1]; if ((yi > pt[1]) != (yj > pt[1]) && pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi) c = !c; } return c; };
const A = spline([[108, 196], [128, 150], [200, 132], [290, 146], [380, 128], [452, 150], [492, 196], [486, 236], [460, 266], [440, 294], [470, 322], [506, 342], [524, 392], [516, 452], [548, 504], [540, 540], [498, 566], [430, 590], [345, 578], [262, 606], [178, 592], [116, 540], [84, 462], [100, 392], [72, 322], [84, 250]], 1);
const Bz = spline([[196, 690], [262, 660], [340, 668], [420, 656], [476, 684], [494, 736], [462, 784], [392, 806], [300, 800], [222, 796], [182, 750]], 1);
const W = [[158, 214], [186, 222], [214, 212], [252, 228], [300, 238], [352, 228], [402, 240], [452, 262], [420, 278], [372, 272], [330, 286], [284, 272], [244, 292], [226, 326], [198, 346], [216, 362], [182, 370], [150, 372], [160, 400], [150, 428], [190, 452], [250, 470], [318, 468], [378, 452], [428, 404], [452, 362], [470, 332], [496, 372], [508, 430], [508, 490], [506, 540], [474, 598], [440, 630], [404, 662], [376, 694], [330, 720], [290, 746], [256, 768]];
const TR = spline(W, 0, 8);
const land = p => inside(p, A) || inside(p, Bz);

// terrain
const peak = (x, y, s) => `<path class="g" d="M${f(x - s)} ${y}L${x} ${f(y - s * 1.5)}L${f(x + s)} ${y}"/><path class="t" d="M${x} ${f(y - s * 1.5)}l${f(s * .28)} ${f(s * .55)}l${f(-s * .2)} ${f(s * .3)}M${f(x + s * .34)} ${f(y - s * .62)}l${f(-s * .1)} ${f(s * .42)}M${f(x + s * .6)} ${f(y - s * .32)}l${f(-s * .08)} ${f(s * .24)}"/>`;
const tree = (x, y, s) => `<path class="t" d="M${x} ${y}v${f(-s)}"/><circle class="g" cx="${x}" cy="${f(y - s * 1.7)}" r="${s}"/>`;
const pine = (x, y, s) => `<path class="t" d="M${x} ${y}v${f(-s * .6)}"/><path class="g" d="M${f(x - s)} ${f(y - s * .5)}L${x} ${f(y - s * 2.7)}L${f(x + s)} ${f(y - s * .5)}Z"/>`;
const hill = (x, y, s) => `<path class="l" d="M${f(x - s)} ${y}q${s} ${f(-s * 1.1)} ${f(2 * s)} 0"/><path class="t" d="M${f(x + s * .2)} ${f(y - s * .42)}l${f(s * .12)} ${f(s * .22)}M${f(x + s * .5)} ${f(y - s * .28)}l${f(s * .1)} ${f(s * .18)}"/>`;
const wave = (x, y) => `<path class="t" d="M${x} ${y}q2.5 -3 5 0t5 0t5 0"/>`;

// things (local units, origin at the foot)
const rose = (r, ang, lab, hi) => {
  let s = `<circle class="o" r="${r}"/><circle class="t" r="${f(r * .84)}"/>`;
  for (let i = 0; i < 32; i++) { const a = i * Math.PI / 16, r1 = r * (i % 4 ? .9 : .86); s += `<path class="t" d="M${f(Math.cos(a) * r1)} ${f(Math.sin(a) * r1)}L${f(Math.cos(a) * r * .97)} ${f(Math.sin(a) * r * .97)}"/>`; }
  const pt = (a, L, b, w) => `<path class="o" d="M${f(Math.cos(a) * L)} ${f(Math.sin(a) * L)}L${f(Math.cos(a - w) * b)} ${f(Math.sin(a - w) * b)}L0 0Z"/><path class="pf" d="M${f(Math.cos(a) * L)} ${f(Math.sin(a) * L)}L${f(Math.cos(a + w) * b)} ${f(Math.sin(a + w) * b)}L0 0Z"/>`;
  for (let i = 0; i < 4; i++) s += pt(i * Math.PI / 2 + Math.PI / 4, r * .5, r * .13, Math.PI / 8);
  for (let i = 0; i < 4; i++) s += pt(i * Math.PI / 2, r * .8, r * .17, Math.PI / 4);
  if (lab) [[0, -(r + 7), 'middle'], [r + 8, 3, 'start'], [0, r + 14, 'middle'], [-(r + 8), 3, 'end']].forEach(([x, y, a], i) => s += T(x, y, lab[i], { s: 7.5, w: 700, c: i === hi ? RED : PAPER, a, ls: lab[i].length > 1 ? 1.4 : 0 }));
  const a = ang * Math.PI / 180, q = (d, L) => f(Math.cos(a + d) * r * L) + ' ' + f(Math.sin(a + d) * r * L);
  return s + `<path class="rf" d="M${q(0, .66)}L${q(1.571, .06)}L${q(3.142, .2)}L${q(-1.571, .06)}Z"/><circle class="o" r="${f(r * .05)}"/>`;
};
const chest = open => `${open ? `<path class="o" d="M-27 -34V-56Q0 -74 27 -56V-34Z"/><path class="t" d="M-17 -34V-62M17 -34V-62"/>` : ''}<rect class="g" x="-30" y="-34" width="60" height="34" rx="2"/><path class="t" d="M-18 -34V0M18 -34V0M-30 -22H30"/>${open ? `<ellipse cx="0" cy="-35" rx="26" ry="5" fill="${PAPER}"/>` : `<path class="g" d="M-30 -34Q0 -56 30 -34Z"/><path class="t" d="M-18 -42V-34M18 -42V-34"/>`}<rect class="pf" x="-4.5" y="-27" width="9" height="10" rx="1.5"/>`;
const spy = () => `<path class="l" d="M0 -38L-15 0M0 -38L15 0M0 -38L3 0"/><g transform="translate(0 -38) rotate(-28)"><rect class="g" x="-36" y="-4" width="18" height="8" rx="1"/><rect class="g" x="-19" y="-5.5" width="24" height="11" rx="1"/><rect class="g" x="4" y="-7.5" width="30" height="15" rx="1.5"/><path class="t" d="M-12 -5.5v11M10 -7.5v15M28 -7.5v15"/><ellipse class="pf" cx="34" cy="0" rx="2.6" ry="7.5"/></g>`;
const tube = (d, w, k) => `<path d="${d}" fill="none" stroke="${PAPER}" stroke-width="${w}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${LAND}" stroke-width="${f(w - 2.2 / k)}" stroke-linecap="round"/>`;
const serpent = k => {
  let s = tube('M58 4C62 -14 74 -18 80 -8', 7, k) + `<path class="g" d="M79 -9l9 -8l-1 12z"/>`;
  [[34, 11], [4, 14], [-28, 16]].forEach(([cx, R]) => { s += tube(`M${cx - R} 4A${R} ${R} 0 0 1 ${cx + R} 4`, 9, k); for (let i = 1; i < 6; i++) { const a = Math.PI * i / 6; s += `<path class="t" d="M${f(cx - Math.cos(a) * (R - 3))} ${f(4 - Math.sin(a) * (R - 3))}L${f(cx - Math.cos(a) * (R + 3))} ${f(4 - Math.sin(a) * (R + 3))}"/>`; } s += `<path class="g" d="M${cx - 4} ${-R}l4 -8l4 8z"/>`; });
  s += tube('M-58 6C-58 -22 -62 -34 -76 -40', 10, k) + `<path class="g" d="M-70 -47Q-86 -55 -101 -40Q-88 -29 -70 -34Z"/><circle class="pf" cx="-84" cy="-43" r="1.5"/><path class="t" d="M-100 -40l6 -1M-73 -48l4 -8l3 8"/>`;
  s += `<rect x="-112" y="4" width="214" height="13" fill="${INK}"/>`;
  [-98, -72, -44, -12, 20, 50, 76].forEach((x, i) => s += `<path class="t" d="M${x} ${7 + (i % 2) * 3}q4 -3 8 0t8 0"/>`);
  return s;
};
const ship = () => `<path class="g" d="M-26 -9Q-22 4 -14 5H14Q22 4 27 -9Z"/><path class="t" d="M-20 -3H21"/><path class="l" d="M-6 -9V-46M11 -9V-38"/><path class="o" d="M-19 -42H5Q9 -29 5 -17H-19Q-15 -29 -19 -42Z"/><path class="o" d="M4 -35H21Q24 -26 21 -17H4Q7 -26 4 -35Z"/><path class="rf" d="M-6 -46l11 3l-11 3z"/><path class="t" d="M-36 8q4 -3 8 0t8 0M16 9q4 -3 8 0t8 0"/>`;
const light = (rot, len) => `${len ? `<path d="M0 -48L${-len} ${f(-48 - len * .2)}L${-len} ${f(-48 + len * .2)}Z" fill="url(#beam)" transform="rotate(${rot} 0 -48)"/>` : ''}<path class="g" d="M-20 0q4 -9 11 -4q8 -7 15 0q7 -5 14 4z"/><path class="g" d="M-8 -3L-5.5 -44H5.5L8 -3Z"/><path class="pf" d="M-7.4 -12L-6.9 -21H6.9L7.4 -12Z"/><path class="pf" d="M-6.3 -30L-5.8 -38H5.8L6.3 -30Z"/><path class="l" d="M-8 -44H8"/><rect class="o" x="-4.5" y="-52" width="9" height="8"/><path class="g" d="M-6 -52L0 -60L6 -52Z"/><circle class="pf" cx="0" cy="-48" r="1.8"/>`;
const post = poster => `<rect class="g" x="-2" y="-62" width="4" height="62"/><path class="g" d="M2 -58h24l6 5l-6 5h-24z"/><path class="g" d="M-2 -46h-22l-6 5l6 5h22z"/>${poster ? `<g transform="rotate(-4)"><rect x="-13" y="-34" width="26" height="32" fill="${PAPER}"/><rect x="-8" y="-24" width="16" height="12" fill="none" stroke="${INK}" stroke-width=".8"/><path d="M-9 -8h18M-9 -5h12" stroke="${INK}" stroke-width=".8"/><text x="0" y="-26.5" font-size="5.2" font-weight="800" text-anchor="middle" fill="${INK}">WANTED</text><circle cx="0" cy="-32.5" r="1" fill="${RED}"/></g>` : ''}`;
const dice = () => `<g transform="rotate(-12 -8 -6)"><rect class="o" x="-14" y="-12" width="12" height="12" rx="2"/><circle fill="${PAPER}" cx="-8" cy="-6" r="1.1"/><circle fill="${PAPER}" cx="-11" cy="-9" r="1.1"/><circle fill="${PAPER}" cx="-5" cy="-3" r="1.1"/></g><g transform="rotate(14 8 -5)"><rect class="o" x="2" y="-11" width="12" height="12" rx="2"/><circle fill="${PAPER}" cx="5" cy="-8" r="1.1"/><circle fill="${PAPER}" cx="11" cy="-2" r="1.1"/><circle fill="${PAPER}" cx="11" cy="-8" r="1.1"/><circle fill="${PAPER}" cx="5" cy="-2" r="1.1"/></g>`;
const bottle = () => `<g transform="rotate(32)"><rect class="l" x="-5" y="-18" width="10" height="18" rx="3.5"/><rect class="l" x="-2" y="-25" width="4" height="8"/><rect class="pf" x="-2.2" y="-28" width="4.4" height="3"/><rect x="-2.5" y="-14" width="5" height="10" fill="${PAPER}" opacity=".8"/></g><path class="t" d="M-14 3q4 -3 8 0t8 0t8 0"/>`;
const hall = () => `<rect class="g" x="-16" y="-18" width="32" height="18"/><path class="g" d="M-19 -18L0 -31L19 -18Z"/><rect class="o" x="-3" y="-9" width="6" height="9"/><path class="t" d="M-11 -12h4v4h-4zM7 -12h4v4h-4z"/><path class="l" d="M0 -31V-46"/><path class="pf" d="M0 -46l12 3.5l-12 3.5z"/>`;
const campus = () => `<rect class="g" x="-22" y="-14" width="28" height="14"/><rect class="g" x="6" y="-24" width="15" height="24"/><path class="t" d="M-18 -9h20M-18 -5h20M9 -19h9M9 -14h9M9 -9h9M9 -4h9"/><path class="l" d="M13 -24V-38"/><path class="pf" d="M13 -38l11 3l-11 3z"/>`;
const dock = () => `<rect class="g" x="0" y="-3" width="44" height="5"/><path class="l" d="M6 2v6M18 2v6M30 2v6M42 2v6M10 -3V-17M24 -3V-17M38 -3V-17"/><path class="pf" d="M10 -17l8 2.5l-8 2.5zM24 -17l8 2.5l-8 2.5zM38 -17l8 2.5l-8 2.5z"/>`;
const boat = () => `<path class="g" d="M-9 -1q9 8 18 0z"/><path class="l" d="M0 -1V-18"/><path class="o" d="M1.5 -17L10 -4H1.5Z"/>`;
const city = () => { let s = ''; [[-24, 14, 26], [-4, 16, 38], [18, 17, 54]].forEach(([x, w, h]) => { s += `<rect class="g" x="${x}" y="${-h}" width="${w}" height="${h}"/><rect x="${x + 2}" y="${-h + 3}" width="${w - 4}" height="${h - 5}" fill="url(#win)"/>`; }); return s + `<path class="l" d="M46 0V-68"/><ellipse class="g" cx="46" cy="-46" rx="5" ry="2.6"/><path class="t" d="M-30 0H54"/>`; };
const fogG = `<g filter="url(#blur)" opacity=".7"><ellipse cx="-8" cy="-22" rx="20" ry="10" fill="${PAPER}"/><ellipse cx="12" cy="-12" rx="18" ry="9" fill="${PAPER}"/></g><path d="M-30 -4h60" stroke="${PAPER}" stroke-width="2.3" stroke-linecap="round" stroke-dasharray=".1 6"/>`;
const lakeG = `<ellipse class="o" cx="0" cy="-16" rx="30" ry="15"/><ellipse class="t" cx="0" cy="-16" rx="18" ry="8"/><ellipse class="t" cx="0" cy="-16" rx="8" ry="3.4"/>`;

const shore = (P, seed) => { const r = rnd(seed), n = P.length; let s = '', ar2 = 0; for (let i = 0; i < n; i++) { const a = P[i], b = P[(i + 1) % n]; ar2 += a[0] * b[1] - b[0] * a[1]; } const sg = ar2 > 0 ? 1 : -1; for (let i = 0; i < n; i++) { const a = P[i], b = P[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; for (let j = 0; j < 3; j++) { const d = 4 + Math.pow(r(), 1.7) * 30, t = r(), x = a[0] + dx * t + sg * dy / L * d, y = a[1] + dy * t - sg * dx / L * d; if (land([x, y]) || y > 818) continue; s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(.35 + r() * .55)}" fill="${r() < .05 ? RED : PAPER}" opacity="${f(Math.max(.12, .8 - d / 45))}"/>`; } } return s; };

function bigMap() {
  const r = rnd(11); let s = '', top = ''; const LB = [];
  const lab = (x, y, t, o = {}) => { const sz = o.s || 8, w = t.length * (sz * .56 + (o.ls || 0)), x1 = o.a == 'end' ? x - w : o.a == 'middle' ? x - w / 2 : x; LB.push([x1 - 3, y - sz - 2, x1 + w + 3, y + 3]); return T(x, y, t, { ...o, h: 1 }); };
  const stop = (i, n, sub, x, y, a) => { const px = W[i][0], py = W[i][1]; top += `<circle cx="${px}" cy="${py}" r="5" fill="${INK}" stroke="${PAPER}" stroke-width="1.5"/><circle cx="${px}" cy="${py}" r="1.8" fill="${PAPER}"/>` + lab(x, y, n, { s: 9.5, w: 700, c: PAPER, a }) + lab(x, y + 9.5, sub, { s: 6.3, c: NOTE, a }); };
  stop(0, 'Laurier', '2016 to 2017, game design', 158, 236, 'middle');
  stop(7, 'HMC Connections', 'summers 2018, 2020, 2021', 466, 250, 'start');
  stop(17, 'Mohawk', '2019 to 2021', 124, 387, 'middle');
  stop(26, 'HMC, again', 'on contract, 2021 to 2022', 458, 322, 'end');
  stop(29, 'Interkom', 'autumn 2022', 498, 468, 'end');
  stop(35, 'Lennard', '2023 to now', 322, 706, 'end');
  const cap = (x, y, t, o = {}) => lab(x, y, t, { s: 5.8, ls: 1.6, c: DIM, a: 'middle', ...o });
  top += cap(150, 170, 'LAURIER LANDING') + cap(318, 198, 'THE NORTH WOODS') + cap(140, 258, 'MOUNT MOHAWK') + cap(172, 540, 'THE MARGINS') + cap(300, 636, 'KERNING NARROWS', { i: 1 }) + cap(412, 768, 'LENNARD CITY') + cap(486, 124, 'HERE BE DEADLINES');
  top += lab(238, 356, 'the diploma climb', { s: 6.5, i: 1, c: NOTE }) + lab(301, 396, 'Lake Undo', { s: 5.6, i: 1, c: NOTE, a: 'middle' }) + lab(104, 464, 'the fog of 2020', { s: 6.5, i: 1, c: NOTE }) + lab(172, 549, 'left intentionally blank', { s: 5.6, i: 1, a: 'middle' }) + lab(470, 613, 'the 2023 crossing', { s: 6.3, i: 1, c: NOTE }) + lab(268, 172, 'the road not taken: game dev', { s: 6, i: 1, c: NOTE });
  top += lab(272, 776, 'X marks the work', { s: 8.5, w: 700, c: RED }) + lab(272, 785.5, 'case studies and everything else', { s: 6.3, c: NOTE });
  top += T(40, 380, 'SEA OF REVISIONS', { s: 5.8, ls: 2.4, a: 'middle', t: 'rotate(-90 40 380)' });

  // sea
  let rh = ''; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8 + .2; rh += `M92 716L${f(92 + Math.cos(a) * 1200)} ${f(716 + Math.sin(a) * 1200)}`; }
  s += `<g clip-path="url(#neat)"><path d="${rh}" stroke="${PAPER}" stroke-opacity=".07" stroke-width=".7" fill="none"/>`;
  for (let i = 0; i < 330; i++) { const x = 24 + r() * 552, y = 24 + r() * 790; if (land([x, y])) continue; s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(.35 + r() * .8)}" fill="${r() < .07 ? RED : PAPER}" opacity="${f(.2 + r() * .5)}"/>`; }
  [[40, 200], [52, 300], [36, 560], [150, 640], [60, 610], [536, 300], [548, 420], [552, 600], [520, 690], [250, 630], [340, 622], [120, 790], [540, 780], [380, 100], [330, 70], [560, 170], [40, 420]].forEach(p => s += wave(p[0], p[1]));
  s += shore(A, 5) + shore(Bz, 6) + '</g>';
  [[A, 'cA'], [Bz, 'cB']].forEach(([P, id]) => { const d = D(P, 1); s += `<path d="${d}" fill="none" stroke="${PAPER}" stroke-opacity=".38" stroke-width="12" stroke-dasharray=".7 2.5"/><path d="${d}" fill="${LAND}"/><path d="${d}" fill="none" stroke="#2B2728" stroke-width="12" clip-path="url(#${id})"/><path d="${d}" fill="none" stroke="${PAPER}" stroke-width="1.2" stroke-opacity=".9"/>`; });

  // water on land, cliff
  const riv = d => `<path d="${d}" fill="none" stroke="${PAPER}" stroke-opacity=".75" stroke-width="2.8" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${LAND}" stroke-width="1.4" stroke-linecap="round"/>`;
  s += riv(D(spline([[214, 392], [236, 399], [252, 393], [268, 395]]))) + riv(D(spline([[306, 410], [311, 440], [320, 470], [322, 520], [333, 556], [337, 582]])));
  s += `<path d="${D(spline([[266, 392], [280, 377], [306, 372], [330, 380], [338, 396], [322, 410], [296, 412], [274, 406]], 1), 1)}" fill="${INK}" stroke="${PAPER}" stroke-width="1"/><path class="t" d="M280 384q4 -3 8 0t8 0M306 404q4 -3 8 0t8 0"/>`;
  s += `<path d="M196 296Q216 330 207 366Q203 384 214 404" fill="none" stroke="${PAPER}" stroke-opacity=".45" stroke-width="7" stroke-dasharray=".8 2.6"/><path class="l" d="M208 374v13M212 372v17M216 374v13"/><path class="t" d="M203 393q9 5 18 0"/>`;
  [[96, 306, 13], [126, 292, 17], [160, 300, 14], [186, 314, 11], [84, 340, 11], [112, 334, 15], [146, 336, 12], [92, 374, 10]].sort((a, b) => a[1] - b[1]).forEach(p => s += peak(p[0], p[1], p[2]));
  [[140, 516, 11], [206, 522, 9], [128, 568, 10], [222, 574, 8], [408, 478, 9], [404, 548, 9], [230, 700, 8]].forEach(p => s += hill(p[0], p[1], p[2]));

  // trees
  const near = (x, y, P, d) => P.some(p => Math.hypot(p[0] - x, p[1] - y) < d), SP = spline([[214, 212], [240, 196], [262, 176]], 0, 6);
  const KEEP = [[300, 392, 46], [366, 350, 14], [250, 506, 22], [208, 262, 12], [452, 556, 12], [456, 184, 24], [256, 768, 16], [408, 738, 42], [228, 722, 12], [134, 200, 26], [470, 520, 70]], tr = [];
  const grove = (cx, cy, rx, ry, n) => { for (let i = 0, k = 0; i < 500 && k < n; i++) { const a = r() * 6.283, d = Math.sqrt(r()), x = cx + Math.cos(a) * d * rx, y = cy + Math.sin(a) * d * ry; if (![[x, y], [x - 8, y], [x + 8, y], [x, y - 15], [x, y + 6]].every(land)) continue; if (near(x, y - 5, TR, 11) || near(x, y - 5, SP, 9)) continue; if (LB.some(b => x > b[0] - 5 && x < b[2] + 5 && y > b[1] - 2 && y < b[3] + 13)) continue; if (KEEP.some(c => Math.hypot(c[0] - x, c[1] - y) < c[2])) continue; if (tr.some(t => Math.hypot(t[0] - x, t[1] - y) < 9)) continue; tr.push([x, y, 3 + r() * 1.6, r() < .45]); k++; } };
  grove(318, 186, 90, 38, 36); grove(392, 372, 36, 46, 10); grove(424, 536, 56, 28, 9); grove(352, 782, 46, 13, 6); grove(190, 498, 36, 16, 5); grove(300, 318, 42, 20, 6);
  tr.sort((a, b) => a[1] - b[1]).forEach(t => s += t[3] ? pine(f(t[0]), f(t[1]), f(t[2])) : tree(f(t[0]), f(t[1]), f(t[2])));

  // trail
  s += `<path d="${D(SP)}" fill="none" stroke="${PAPER}" stroke-opacity=".45" stroke-width="1.7" stroke-linecap="round" stroke-dasharray=".1 4.6"/>` + G(207, 209, .3, post(0));
  s += `<rect x="308" y="463" width="22" height="10" fill="${LAND}"/><path class="l" d="M307 463h24M307 473h24"/>`;
  s += `<path d="M34 108Q56 150 92 176" class="t" stroke-dasharray="2 3"/>`;
  s += `<path d="${D(TR)}" fill="none" stroke="${PAPER}" stroke-width="2.3" stroke-linecap="round" stroke-dasharray=".1 5.6"/>`;

  // places and things
  s += G(134, 208, .62, hall()) + G(96, 181, .6, boat()) + G(112, 222, .5, dice());
  s += G(458, 271, .55, dock()) + G(473, 321, .55, dock()) + G(487, 297, .5, boat()) + G(470, 304, .42, boat());
  s += G(456, 192, .42, spy()) + G(124, 372, .6, campus());
  s += `<g filter="url(#blur)" opacity=".42"><ellipse cx="150" cy="428" rx="26" ry="11" fill="${PAPER}"/><ellipse cx="180" cy="444" rx="24" ry="10" fill="${PAPER}"/><ellipse cx="134" cy="446" rx="18" ry="8" fill="${PAPER}"/></g>`;
  s += G(536, 514, .6, light(-14, 230)) + T(424, 516, 'psst', { s: 6, i: 1, c: PAPER }) + G(404, 752, .62, city()) + `<path class="l" d="M404 662v-11"/>`;
  s += G(452, 622, .55, ship()) + G(486, 98, .62, serpent(.62)) + G(92, 716, 1, rose(46, -62, ['P', 'V', 'M', 'S'], -1)) + G(46, 476, .6, bottle()) + G(250, 516, .5, post(1));
  [[208, 266], [366, 354], [128, 502], [452, 558], [228, 728]].forEach(([x, y]) => s += G(x, y, .26, chest(0)) + `<path class="t" d="M${x + 11} ${y - 7}l5 5m0 -5l-5 5"/>`);
  s += `<g transform="translate(256 768)" filter="url(#rough)"><path d="M-9 -9L9 9M9 -9L-9 9" stroke="${RED}" stroke-width="3.6" stroke-linecap="round" fill="none"/></g>`;
  s += top + trav(158, 214);
  s += mk(148, 672, 1) + mk(382, 346, 2) + mk(478, 176, 3) + mk(550, 74, 4) + mk(558, 478, 5) + mk(270, 492, 6);

  // title, legend, scale
  s += T(44, 78, 'The journey so far', { s: 30, w: 800, c: PAPER, ls: -.6 }) + `<rect x="42" y="86" width="204" height="13" fill="${INK}"/>` + T(45, 95, 'A MAP OF HOW I GOT HERE, 2016 TO NOW', { s: 6.5, ls: 1.8 }) + `<path class="t" d="M45 103h196"/>`;
  s += `<rect x="23" y="822" width="554" height="55" fill="${INK}"/><line x1="23" y1="822.5" x2="577" y2="822.5" stroke="${PAPER}" stroke-opacity=".3"/>`;
  s += `<circle cx="46" cy="838" r="4" fill="${INK}" stroke="${PAPER}" stroke-width="1.3"/>` + T(57, 840.5, 'a stop', { s: 6.5, c: NOTE }) + `<path d="M42 853l8 8m0 -8l-8 8" stroke="${RED}" stroke-width="2" stroke-linecap="round"/>` + T(57, 859.5, 'the work', { s: 6.5, c: NOTE });
  s += mk(110, 838, 1) + T(121, 840.5, 'something to play with', { s: 6.5, c: NOTE }) + `<path d="M104 857h14" stroke="${PAPER}" stroke-width="2.3" stroke-linecap="round" stroke-dasharray=".1 4.5"/>` + T(121, 859.5, 'the trail', { s: 6.5, c: NOTE });
  const X = y => f(252 + (y - 2016) / 11 * 308), blk = (a, b, row) => `<rect x="${X(a)}" y="${row ? 855 : 840}" width="${f(X(b) - X(a))}" height="5" rx="1.2" fill="${row ? '#B9B4AD' : '#6F6A64'}"/>`;
  s += T(252, 834, 'SCALE: ONE TICK IS ONE YEAR. IT IS ALSO THE TIMELINE YOU DRAG.', { s: 5.2, ls: .9 }) + `<line x1="252" y1="850" x2="560" y2="850" stroke="${MID}"/>`;
  for (let y = 2016; y < 2028; y++) s += `<line x1="${X(y)}" y1="847" x2="${X(y)}" y2="853" stroke="${DIM}" stroke-width=".8"/>` + (y < 2027 ? T(+X(y) + 2, 871, "'" + (y % 100), { s: 5.5 }) : '');
  s += blk(2016.67, 2017.95, 0) + blk(2019, 2021.3, 0) + blk(2018.3, 2018.65, 1) + blk(2020.45, 2020.65, 1) + blk(2021.45, 2022.2, 1) + blk(2022.67, 2022.95, 1) + blk(2023.75, 2026.9, 1) + T(566, 844.5, 'school', { s: 4.8, a: 'end', op: .01 }) + sp(+X(2016.67), 850, 4.5, RED);
  s += `<rect x="14.5" y="14.5" width="571" height="871" fill="none" stroke="${PAPER}" stroke-opacity=".35"/><rect x="18" y="18" width="564" height="864" fill="none" stroke="${PAPER}" stroke-opacity=".28" stroke-width="5" stroke-dasharray="1 15"/><rect x="22.5" y="22.5" width="555" height="855" fill="none" stroke="${PAPER}" stroke-opacity=".2"/>`;
  return s;
}

// close-ups
const p1 = () => {
  let s = dots(21, 40, 0, 0, 400, 270) + G(138, 138, 1, rose(80, 90, ['PRINT', 'VIDEO', 'MOTION', 'SCREEN'], 2)) + cursor(146, 196);
  s += `<path d="M276 34C316 66 262 108 312 138S386 190 338 240" fill="none" stroke="${PAPER}" stroke-width="2.2" stroke-linecap="round" stroke-dasharray=".1 6" opacity=".7"/>`;
  [[274, 52, 0], [312, 92, 1], [278, 130, 0], [346, 148, 1], [318, 198, 0]].forEach(([x, y, lit]) => { s += lit ? `<circle cx="${x + 19}" cy="${y + 13}" r="36" fill="url(#glow)" opacity=".5"/><rect x="${x}" y="${y}" width="38" height="26" rx="3" fill="${PAPER}"/><path d="M${x + 15} ${y + 7}v12l10 -6z" fill="${RED}"/>` : `<rect x="${x}" y="${y}" width="38" height="26" rx="3" fill="none" stroke="${MID}"/>`; });
  return s + N(392, 26, 'Motion pieces light up.', 'end') + N(392, 260, 'The rest of the map dims.', 'end');
};
const p2 = () => {
  let s = dots(22, 30, 0, 0, 400, 150) + `<path class="t" d="M14 214H386"/>`;
  s += `<path class="l" stroke-dasharray="3 3.4" d="M52 198l24 13M76 198l-24 13"/><path class="t" d="M36 214l-3 -7M41 214l1 -8M92 214l3 -7M98 214l-1 -6"/>` + cursor(80, 196) + N(64, 240, 'a scratch in the ground', 'middle') + chev(116, 196);
  s += G(190, 226, 1, chest(0)) + `<path d="M140 215q50 -13 100 0v24h-100z" fill="${INK}"/><path class="l" d="M138 214q16 -9 30 -5M212 209q14 -4 30 5"/><path class="t" d="M150 186l-6 -8M160 174l-3 -9M222 180l5 -9M234 190l7 -6M190 152v-9"/>` + N(190, 240, 'tap: it digs itself up', 'middle') + chev(254, 196);
  s += `<circle cx="318" cy="150" r="72" fill="url(#glow)" opacity=".4"/>` + G(318, 214, 1.25, chest(1));
  [[280, 132, 5], [300, 104, 7], [336, 118, 4.5], [358, 146, 5.5], [272, 96, 3.5], [318, 82, 4], [294, 62, 3]].forEach(([x, y, z], i) => s += sp(x, y, z, i % 3 == 1 ? RED : PAPER));
  s += `<path class="t" stroke-dasharray="2 3" d="M330 150Q352 112 352 84"/><rect x="322" y="18" width="62" height="42" rx="4" fill="#211F20" stroke="${PAPER}"/><path d="M328 54l12 -14l9 9l7 -6l12 11z" fill="${MID}"/><circle cx="372" cy="29" r="4" fill="${PAPER}"/>` + T(353, 72, 'See the case study', { s: 6.5, w: 700, c: RED, a: 'middle' }) + N(318, 240, 'a real piece floats up', 'middle');
  return s;
};
const p3 = () => {
  let s = dots(23, 30, 0, 0, 400, 270) + `<path class="t" d="M10 238H132"/>` + G(70, 238, 1.7, spy());
  s += `<path class="t" stroke-dasharray="2 4" d="M122 146L246 31M122 146L246 225"/><circle cx="270" cy="128" r="106" fill="none" stroke="${PAPER}" stroke-opacity=".5" stroke-width="5" stroke-dasharray=".8 6.6"/><circle cx="270" cy="128" r="100" fill="#0D0C0D" stroke="${PAPER}" stroke-width="1.4"/>`;
  s += `<g clip-path="url(#lens)"><rect x="170" y="28" width="200" height="200" fill="#1B1819"/><circle cx="318" cy="88" r="30" fill="${RED}"/><rect x="196" y="92" width="74" height="74" fill="${PAPER}" transform="rotate(-12 233 129)"/><path d="M170 196L250 138L300 182L340 156L370 178V230H170Z" fill="${INK}"/></g>`;
  s += `<circle cx="270" cy="128" r="24" fill="${INK}" opacity=".75"/><path d="M262 115v26l22 -13z" fill="${PAPER}"/>` + T(270, 214, '00:03 / 00:05', { s: 7.5, c: PAPER, a: 'middle', w: 600 });
  return s + `<path d="M270 28A100 100 0 1 1 211.2 208.9" fill="none" stroke="${RED}" stroke-width="3.2" stroke-linecap="round"/>` + N(70, 258, 'it follows the cursor', 'middle');
};
const p4 = () => {
  let s = dots(24, 30, 0, 0, 400, 120) + T(200, 40, 'HERE BE DEADLINES', { s: 11, w: 700, c: PAPER, a: 'middle', ls: 5 });
  for (let i = 0; i < 26; i++) s += wave(10 + (i * 61) % 376, 206 + (i * 37) % 52);
  s += G(214, 172, 1.8, serpent(1.8)) + `<path class="t" stroke-dasharray="1.5 3" d="M63 94L36 64"/>` + cursor(24, 46);
  s += `<g transform="translate(27 106) rotate(8)"><rect x="-11" y="0" width="22" height="26" fill="${PAPER}"/><rect x="-11" y="0" width="22" height="7" fill="${RED}"/><text x="0" y="5.6" font-size="5" font-weight="800" text-anchor="middle" fill="${PAPER}">FRI</text><text x="0" y="19" font-size="8" font-weight="800" text-anchor="middle" fill="${INK}">5 PM</text></g>`;
  return s + N(386, 260, 'poke it and it dives', 'end');
};
const p5 = () => {
  let s = dots(25, 40, 0, 0, 400, 270) + `<g opacity=".3">${hill(150, 226, 16)}${hill(232, 238, 13)}${hill(318, 228, 17)}${tree(196, 240, 5)}${pine(270, 232, 5)}${pine(362, 240, 5)}${tree(120, 246, 4)}</g>`;
  s += T(140, 256, 'more notes hide in the dark', { s: 8.5, i: 1, c: PAPER, op: .16 }) + T(196, 200, 'and here', { s: 8.5, i: 1, c: PAPER, op: .14 });
  s += G(58, 238, 2.3, light(172, 140)) + T(226, 96, 'a note in invisible ink', { s: 9.5, i: 1, c: PAPER }) + `<path class="t" d="M226 101h94"/>` + T(288, 128, 'and another', { s: 9, i: 1, c: PAPER, op: .85 });
  return s + cursor(366, 66) + N(386, 260, 'drag the beam', 'end');
};
const p6 = () => {
  let s = dots(26, 30, 0, 0, 400, 270) + `<path class="t" d="M10 240H150"/>` + G(66, 240, 1.9, post(1)) + chev(152, 140);
  s += `<g transform="rotate(2 284 135)"><rect x="203" y="27" width="170" height="226" fill="#000" opacity=".4"/><rect x="198" y="22" width="170" height="226" fill="${PAPER}"/><circle cx="208" cy="31" r="2" fill="${RED}"/><circle cx="358" cy="31" r="2" fill="${RED}"/>`;
  s += `<text x="283" y="62" font-size="27" font-weight="800" text-anchor="middle" fill="${INK}" letter-spacing="1">WANTED</text><rect x="214" y="72" width="138" height="88" fill="#D9D5CD"/><circle cx="283" cy="104" r="17" fill="${INK}"/><path d="M247 160q4 -34 36 -34t36 34z" fill="${INK}"/>`;
  s += `<text x="283" y="180" font-size="12.5" font-weight="800" text-anchor="middle" fill="${INK}">ONE DESIGNER</text><text x="283" y="194" font-size="7.5" text-anchor="middle" fill="${INK}">who sees a job through, from</text><text x="283" y="204" font-size="7.5" text-anchor="middle" fill="${INK}">first sketch to final cut</text><text x="276" y="228" font-size="9.5" font-weight="800" text-anchor="middle" fill="#C0262E">REWARD: THE WORK</text>`;
  s += `<path d="M368 248h-22l22 -22z" fill="#BFBAB1"/><g transform="rotate(-14 350 198)"><circle cx="350" cy="198" r="14" fill="none" stroke="#C0262E" stroke-width="1.5"/><text x="350" y="200.4" font-size="6" font-weight="800" text-anchor="middle" fill="#C0262E" letter-spacing=".8">PRINT</text></g></g>`;
  return s + N(66, 260, 'it flaps in the wind', 'middle');
};
const strip = () => { let s = T(18, 22, 'ALSO DOTTED AROUND THE MAP', { s: 7, ls: 2 }); [[dice(), 1.6, 'Dice at Laurier', 'Roll them for a fact from', 'the game design year.'], [fogG, 1, 'The fog of 2020', 'Wipe it off the trail', 'with the cursor.'], [bottle(), 1.5, 'A bottle in the sea', 'Uncork it: a note from', 'someone I worked with.'], [lakeG, 1, 'Lake Undo', 'Tap it and the ripples', 'run backwards.'], [ship(), 1, 'The ship', 'Carries the red star', 'across 2023.']].forEach(([g, k, t, l1, l2], i) => { const x = 18 + i * 246; s += G(x + 36, 96, k, g) + T(x + 84, 62, t, { s: 11, w: 700, c: PAPER }) + T(x + 84, 78, l1, { s: 9, c: NOTE }) + T(x + 84, 91, l2, { s: 9, c: NOTE }); }); return s; };

// cards
const b1 = () => {
  let s = dots(31, 60, 0, 0, 640, 400) + `<path d="M0 186C50 168 112 180 140 216C160 250 122 292 98 332C82 362 62 382 40 400H0Z" fill="${LAND}" stroke="${PAPER}" stroke-opacity=".5"/>`;
  s += `<path d="M0 372C40 340 70 304 94 266S110 228 118 214" fill="none" stroke="${PAPER}" stroke-width="2.3" stroke-linecap="round" stroke-dasharray=".1 6" opacity=".6"/><path d="M118 214L232 44V356Z" fill="${PAPER}" opacity=".05"/><circle cx="118" cy="214" r="48" fill="url(#glow)" opacity=".3"/>` + G(140, 228, 1, dock()) + `<circle cx="118" cy="214" r="6.5" fill="${NAVY}" stroke="${PAPER}" stroke-width="1.6"/>`;
  const x = 232, y = 40, w = 384, h = 320;
  s += `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="${NAVY}"/><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="10" fill="url(#plus)"/><image href="${LOGO}" x="${x + 18}" y="${y + 14}" width="117" height="80"/>`;
  s += `<rect x="${x + w - 130}" y="${y + 22}" width="112" height="20" rx="10" fill="${GREEN}"/>` + T(x + w - 74, y + 35.5, '2018 to 2022', { s: 8, w: 700, c: '#fff', a: 'middle' });
  s += T(x + 20, y + 126, 'Three summers, then a contract.', { s: 17, w: 800, c: '#fff', ls: -.3 }) + T(x + 20, y + 142, 'Graphic designer, video editor, web designer, marketing specialist', { s: 7.5, c: '#B8C4DA' });
  for (let i = 0; i < 4; i++) s += `<rect x="${x + 20}" y="${y + 158 + i * 10}" width="${i == 3 ? 110 : 172}" height="3.5" rx="1.75" fill="#fff" opacity=".3"/>`;
  s += T(x + 20, y + 214, 'WHAT I TOOK WITH ME', { s: 5.5, ls: 1, c: '#B8C4DA' }) + `<rect x="${x + 20}" y="${y + 220}" width="150" height="3.5" rx="1.75" fill="#fff" opacity=".9"/>`;
  s += `<image href="${MOCK}" x="440" y="198" width="158" height="105" preserveAspectRatio="xMidYMid slice" clip-path="url(#mkc)"/>` + T(440, 314, 'Annual report, 2020 to 2021', { s: 6.5, c: '#B8C4DA' });
  s += `<rect x="440" y="322" width="158" height="28" rx="14" fill="${GREEN}"/>` + T(512, 339.5, 'See the case study', { s: 8.5, w: 700, c: '#fff', a: 'middle' }) + ar(562, 336.5, '#fff');
  for (let i = 0; i < 4; i++) s += `<rect x="${x + 20 + i * 14}" y="338" width="10" height="4" rx="1" fill="#fff" opacity="${i ? .35 : 1}"/>`;
  return s + N(16, 28, 'The view closes in and the stop opens into its card.') + N(232, 384, 'Logo, navy and green come from your HMC annual report. The picture is the report.');
};
const CARDS = [
  { n: 'laurier', full: 'Wilfrid Laurier University', lw: 140, lh: 42, top: '#FFFFFF', bot: '#330172', hd: '#FFFFFF', sub: '#CFC3E0', btn: '#EAA41E', btx: '#330172', pill: '#EAA41E', ptx: '#330172', role: 'Game Design and Development', date: '2016 to 2017', sw: ['#330172', '#EAA41E', '#FFFFFF'] },
  { n: 'mohawk', full: 'Mohawk College', lw: 160, lh: 28.4, top: '#030303', bot: '#030303', hd: '#F4F4F4', sub: '#A3A3A3', btn: '#FB9632', btx: '#030303', pill: '#991030', ptx: '#FFFFFF', role: 'Graphic Design, advanced diploma', date: '2019 to 2021', sw: ['#030303', '#FB9632', '#991030'] },
  { n: 'interkom', full: 'Interkom', lw: 150, lh: 26.3, top: '#F7F3E2', bot: '#F7F3E2', hd: '#242021', sub: '#5E5A56', btn: '#E85155', btx: '#F7F3E2', pill: '#242021', ptx: '#F7F3E2', role: 'Junior graphic designer, on contract', date: 'Autumn 2022', sw: ['#F7F3E2', '#E85155', '#242021'] },
  { n: 'lennard', full: 'Lennard Commercial Realty', lw: 120, lh: 41.1, top: '#FFFFFF', bot: '#FF4E02', hd: '#FFFFFF', sub: '#FFE1D2', btn: '#FFFFFF', btx: '#FF4E02', pill: '#0F151E', ptx: '#FFFFFF', role: 'Freelance, junior, now graphic designer', date: '2023 to now', sw: ['#FF4E02', '#FFFFFF', '#0F151E'] },
];
const realCards = () => CARDS.map((c, i) => {
  const x = i * 318, w = 294;
  let s = `<rect x="${x}" y="0" width="${w}" height="236" rx="10" fill="${c.bot}"/><path d="M${x} 92V10a10 10 0 0 1 10 -10H${x + w - 10}a10 10 0 0 1 10 10V92Z" fill="${c.top}"/>`;
  s += `<image href="${uri(SCR + '/logos/' + c.n + '.png', 'image/png')}" x="${x + 18}" y="${f(46 - c.lh / 2)}" width="${c.lw}" height="${c.lh}"/>`;
  s += `<rect x="${x + w - 96}" y="37" width="78" height="18" rx="9" fill="${c.pill}"/>` + T(x + w - 57, 48.6, c.date, { s: 7, w: 700, c: c.ptx, a: 'middle' });
  s += T(x + 18, 122, c.role, { s: 12.5, w: 800, c: c.hd, ls: -.2 }) + T(x + 18, 137, c.full, { s: 7.5, c: c.sub });
  for (let j = 0; j < 3; j++) s += `<rect x="${x + 18}" y="${150 + j * 10}" width="${j == 2 ? 120 : 200}" height="3.5" rx="1.75" fill="${c.hd}" opacity=".3"/>`;
  s += `<rect x="${x + 18}" y="194" width="126" height="26" rx="13" fill="${c.btn}"/>` + T(x + 73, 210.5, 'See the case study', { s: 7.5, w: 700, a: 'middle', c: c.btx }) + ar(x + 120, 207.5, c.btx);
  c.sw.forEach((k, j) => s += `<circle cx="${x + w - 58 + j * 17}" cy="207" r="6.5" fill="${k}" stroke="${c.hd}" stroke-opacity=".6" stroke-width=".8"/>`);
  return s + `<rect x="${x + .5}" y=".5" width="${w - 1}" height="235" rx="10" fill="none" stroke="${MID}"/>`;
}).join('');
const b2 = () => {
  let s = realCards();
  [].forEach(([n, r2], i) => {
    const x = i * 318, sk = `fill="none" stroke="${PAPER}" stroke-opacity=".5" stroke-dasharray="5 4"`;
    s += `<rect x="${x + 1}" y="1" width="292" height="234" rx="10" ${sk}/><rect x="${x + 18}" y="18" width="110" height="46" rx="6" ${sk}/>` + T(x + 73, 45, 'LOGO', { s: 8, ls: 2.5, a: 'middle' });
    for (let j = 0; j < 3; j++) s += `<circle cx="${x + 232 + j * 18}" cy="34" r="6.5" ${sk}/>`;
    s += T(x + 250, 56, 'their colours', { s: 6.5, a: 'middle', i: 1, c: NOTE }) + T(x + 18, 104, n, { s: 15, w: 800, c: PAPER, ls: -.2 }) + T(x + 18, 120, r2, { s: 7.5 });
    for (let j = 0; j < 3; j++) s += `<rect x="${x + 18}" y="${138 + j * 10}" width="${j == 2 ? 120 : 200}" height="3.5" rx="1.75" fill="${MID}"/>`;
    s += `<rect x="${x + 18}" y="188" width="118" height="26" rx="13" ${sk}/>` + T(x + 77, 204.5, 'See the case study', { s: 7.5, w: 700, a: 'middle', c: NOTE }) + T(x + 276, 204.5, 'waiting for the logo file', { s: 7, i: 1, a: 'end', c: NOTE });
  });
  s += `<line x1="0" y1="262.5" x2="1248" y2="262.5" stroke="${LINE}"/>` + T(18, 300, 'The rule for every card', { s: 16, w: 800, c: PAPER }) + T(18, 318, 'Ground, type and button colours are sampled', { s: 9, c: NOTE }) + T(18, 331, 'from the logo and the site of each place.', { s: 9, c: NOTE });
  s += `<rect x="330" y="284" width="150" height="88" rx="8" fill="${NAVY}"/><image href="${LOGO}" x="356" y="294" width="98" height="67"/>` + T(405, 390, '1. The logo file', { s: 8, a: 'middle', c: NOTE }) + chev(506, 328);
  [[NAVY, 'ground'], [GREEN, 'accent'], ['#FFFFFF', 'type']].forEach(([c, l], j) => { s += `<circle cx="${570 + j * 62}" cy="318" r="22" fill="${c}" stroke="${PAPER}" stroke-opacity=".5"/>` + T(570 + j * 62, 354, l, { s: 7.5, a: 'middle', c: NOTE }) + T(570 + j * 62, 364, c, { s: 6, a: 'middle' }); });
  s += T(632, 390, '2. Its colours', { s: 8, a: 'middle', c: NOTE }) + chev(752, 328);
  s += `<rect x="800" y="284" width="150" height="88" rx="8" fill="${NAVY}"/><image href="${LOGO}" x="808" y="290" width="44" height="30"/><rect x="896" y="294" width="44" height="10" rx="5" fill="${GREEN}"/><rect x="812" y="330" width="70" height="4" rx="2" fill="#fff"/><rect x="812" y="340" width="52" height="3" rx="1.5" fill="#fff" opacity=".4"/><rect x="812" y="348" width="52" height="3" rx="1.5" fill="#fff" opacity=".4"/><rect x="896" y="346" width="44" height="14" rx="7" fill="${GREEN}"/>` + T(875, 390, '3. The card', { s: 8, a: 'middle', c: NOTE });
  return s + N(1000, 312, 'All five are real. HMC comes from your annual') + N(1000, 326, 'report, the other four from their own websites,') + N(1000, 340, 'pulled through your Chrome.');
};

// footer
const fx = (cx, cy, L, wd) => { let d = ''; for (let i = 0; i < 4; i++) { const a = Math.PI / 4 + i * Math.PI / 2, c = Math.cos(a), sn = Math.sin(a); d += `M${f(cx + c * L)} ${f(cy + sn * L)}L${f(cx - sn * wd)} ${f(cy + c * wd)}L${f(cx + sn * wd)} ${f(cy - c * wd)}Z`; } return `<path d="${d}" fill="url(#flare)"/>`; };
const NP = (x, y, s) => `<rect x="${x - 8}" y="${y - 12}" width="${f(s.length * 3.9 + 18)}" height="18" rx="9" fill="${INK}" opacity=".86"/>` + N(x, y, s);
const f1 = () => {
  const r = rnd(41), cx = 214, cy = 132; let s = `<path d="M0 30C80 10 300 0 400 40V250H0Z" fill="${LAND}"/><path d="M0 30C80 10 300 0 400 40" fill="none" stroke="${PAPER}" stroke-opacity=".6"/>`;
  s += `<path d="M10 62C70 52 120 70 140 96S170 124 ${cx - 18} ${cy - 8}" fill="none" stroke="${PAPER}" stroke-width="2.3" stroke-linecap="round" stroke-dasharray=".1 6"/>`;
  for (let i = 0; i < 80; i++) { const x = r() * 400, y = r() * 250, dx = cx - x, dy = cy - y, L = Math.hypot(dx, dy); if (L < 44) continue; s += `<path d="M${f(x)} ${f(y)}l${f(dx / L * 10)} ${f(dy / L * 10)}" stroke="${PAPER}" stroke-opacity=".35" stroke-width=".7"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(.6 + r())}" fill="${r() < .1 ? RED : PAPER}" opacity="${f(.4 + r() * .5)}"/>`; }
  s += `<g transform="translate(${cx} ${cy})" filter="url(#rough)"><path d="M-24 -24L24 24M24 -24L-24 24" stroke="${RED}" stroke-width="7" stroke-linecap="round" fill="none"/></g>` + trav(cx - 34, cy - 14);
  return s + NP(16, 238, 'The stars start to lean toward it.');
};
const f2 = () => {
  const r = rnd(42), cx = 200, cy = 125; let s = `<circle cx="${cx}" cy="${cy}" r="160" fill="url(#rglow)" opacity=".6"/>`;
  for (let i = 0; i < 180; i++) { const a = r() * 6.283, d = 14 + Math.pow(r(), 1.6) * 200, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * .78, t = a + 1.9, L = 4 + 600 / d; s += `<path d="M${f(x)} ${f(y)}l${f(Math.cos(t) * L)} ${f(Math.sin(t) * L)}" stroke="${PAPER}" stroke-opacity=".3" stroke-width=".7"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(.5 + r() * .9)}" fill="${r() < .12 ? RED : PAPER}" opacity="${f(.45 + r() * .5)}"/>`; }
  s += fx(cx, cy, 150, 5) + `<circle cx="${cx}" cy="${cy}" r="46" fill="url(#glow)"/><circle cx="${cx}" cy="${cy}" r="8" fill="#fff"/>`;
  return s + NP(16, 238, 'The arms of the X stretch into four spikes.');
};
const f3 = () => {
  const r = rnd(43), cx = 200, cy = 125; let s = `<circle cx="${cx}" cy="${cy}" r="230" fill="url(#rglow)"/><circle cx="${cx}" cy="${cy}" r="130" fill="url(#oglow)"/>`;
  for (let i = 0; i < 100; i++) { const a = r() * 6.283, d1 = 34 + r() * 70, d2 = d1 + 14 + r() * 80, c = Math.cos(a), sn = Math.sin(a); s += `<path d="M${f(cx + c * d1)} ${f(cy + sn * d1)}L${f(cx + c * d2)} ${f(cy + sn * d2)}" stroke="${r() < .3 ? RED : PAPER}" stroke-opacity="${f(.3 + r() * .6)}" stroke-width="${f(.6 + r())}" stroke-linecap="round"/>`; }
  for (let i = 0; i < 120; i++) { const a = r() * 6.283, d = 96 + r() * 140; s += `<circle cx="${f(cx + Math.cos(a) * d)}" cy="${f(cy + Math.sin(a) * d)}" r="${f(.5 + r())}" fill="${r() < .15 ? RED : PAPER}" opacity="${f(.4 + r() * .5)}"/>`; }
  s += `<circle cx="${cx}" cy="${cy}" r="88" fill="none" stroke="${RED}" stroke-width="8" opacity=".3"/><circle cx="${cx}" cy="${cy}" r="88" fill="none" stroke="${PAPER}" stroke-width="2" opacity=".9"/><circle cx="${cx}" cy="${cy}" r="120" fill="none" stroke="${PAPER}" stroke-width=".7" opacity=".35"/>`;
  s += fx(cx, cy, 190, 6) + `<circle cx="${cx}" cy="${cy}" r="72" fill="url(#glow)"/><circle cx="${cx}" cy="${cy}" r="13" fill="#fff"/>`;
  return s + NP(16, 238, 'The same blast the hero makes when you let go.');
};
const f4 = () => {
  const r = rnd(44), cx = 462, cy = 150; let s = `<ellipse cx="${cx - 60}" cy="${cy + 60}" rx="380" ry="260" fill="url(#rglow)"/><ellipse cx="${cx + 10}" cy="${cy}" rx="190" ry="140" fill="url(#oglow)"/>`;
  const keep = [[30, 58, 300, 112], [30, 114, 272, 162], [30, 230, 612, 294], [30, 296, 310, 312], [30, 336, 610, 356], [404, 32, 610, 50], [380, 376, 610, 392]];
  for (let i = 0; i < 300; i++) { const a = r() * 6.283, d = 10 + Math.pow(r(), 1.4) * 340, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * .8, rr = f(.4 + r() * .9), col = r() < .12 ? RED : PAPER, op = f(.3 + r() * .6); if (keep.some(([x0, y0, x1, y1]) => x > x0 && x < x1 && y > y0 && y < y1)) continue; s += `<circle cx="${f(x)}" cy="${f(y)}" r="${rr}" fill="${col}" opacity="${op}"/>`; }
  s += `<mask id="nk"><rect width="640" height="400" fill="#fff"/><rect x="424" y="33" width="184" height="16" rx="8" fill="#000"/></mask><g mask="url(#nk)"><circle cx="${cx}" cy="${cy}" r="92" fill="none" stroke="${PAPER}" stroke-width=".8" opacity=".3"/><circle cx="${cx}" cy="${cy}" r="150" fill="none" stroke="${PAPER}" stroke-width=".6" opacity=".14"/></g>` + fx(cx, cy, 74, 2.8) + `<circle cx="${cx}" cy="${cy}" r="28" fill="url(#glow)"/>` + sp(cx, cy, 7);
  s += T(38, 80, 'Got an idea that needs', { s: 21, w: 800, c: PAPER, ls: -.4 }) + T(38, 104, 'carrying to the final cut?', { s: 21, w: 800, c: PAPER, ls: -.4 });
  s += `<rect x="38" y="120" width="136" height="36" rx="18" fill="${RED}"/>` + T(96, 142.5, "Let's talk", { s: 12, w: 800, c: INK, a: 'middle' }) + ar(138, 138.5, INK) + N(186, 142, 'the call to action');
  s += `<text id="gnm" x="38" y="288" font-size="73.5" font-weight="800" letter-spacing="-1.47" fill="${PAPER}">Danial Endrawes</text>`;
  s += T(38, 306, 'From first sketch to final cut, and everything in between.', { s: 9.5, c: PAPER, w: 600 });
  s += `<line x1="38" y1="326" x2="602" y2="326" stroke="${MID}"/><circle cx="602" cy="326" r="3.2" fill="${RED}"/>`;
  s += `<text id="gl1" x="38" y="350" font-size="14" font-weight="800" letter-spacing="-.2" fill="${PAPER}">Case studies</text>` + ne(123, 340.5, 7.5, PAPER) + `<text id="gl2" x="148" y="350" font-size="14" font-weight="800" letter-spacing="-.2" fill="${PAPER}">Work</text>` + ne(188, 340.5, 7.5, PAPER) + T(602, 349, 'LINKEDIN  /  EMAIL  /  RESUME', { s: 6.5, ls: 1, a: 'end' });
  return s + N(602, 44, 'The supernova keeps glowing behind your name.', 'end') + N(212, 349.5, 'the links, below your name') + N(602, 386, 'The timeline settles as the rule under your name.', 'end');
};
const morph = () => {
  const r = rnd(45), cy = 54, C = i => 380 + i * 196;
  let s = T(18, 26, 'THE MORPH, SHAPE BY SHAPE', { s: 7, ls: 2 }) + T(18, 56, 'One X the whole way', { s: 15, w: 800, c: PAPER, ls: -.2 }) + T(18, 74, 'Its two strokes thin, stretch and brighten into the', { s: 9, c: NOTE }) + T(18, 87, 'four spikes of a star. Nothing new is swapped in.', { s: 9, c: NOTE });
  s += `<g transform="translate(${C(0)} ${cy})" filter="url(#rough)"><path d="M-22 -22L22 22M22 -22L-22 22" stroke="${RED}" stroke-width="7" stroke-linecap="round" fill="none"/></g>`;
  s += `<circle cx="${C(1)}" cy="${cy}" r="42" fill="url(#rglow)" opacity=".5"/>`;
  for (let i = 0; i < 28; i++) { const a = r() * 6.283, d = 30 + r() * 36, x = C(1) + Math.cos(a) * d, y = cy + Math.sin(a) * d * .62, L = 5 + r() * 6; s += `<path d="M${f(x)} ${f(y)}L${f(x - Math.cos(a) * L)} ${f(y - Math.sin(a) * L * .62)}" stroke="${PAPER}" stroke-opacity=".4" stroke-width=".7"/><circle cx="${f(x)}" cy="${f(y)}" r="${f(.5 + r() * .7)}" fill="${PAPER}" opacity=".8"/>`; }
  s += `<path d="M${C(1) - 24} ${cy - 24}L${C(1) + 24} ${cy + 24}M${C(1) + 24} ${cy - 24}L${C(1) - 24} ${cy + 24}" stroke="${RED}" stroke-width="5" stroke-linecap="round" fill="none"/><circle cx="${C(1)}" cy="${cy}" r="16" fill="url(#glow)"/><path d="M${C(1) - 13} ${cy - 13}L${C(1) + 13} ${cy + 13}M${C(1) + 13} ${cy - 13}L${C(1) - 13} ${cy + 13}" stroke="#fff" stroke-width="2.6" stroke-linecap="round" fill="none"/>`;
  s += `<circle cx="${C(2)}" cy="${cy}" r="46" fill="url(#rglow)" opacity=".6"/>` + fx(C(2), cy, 66, 3.8) + `<circle cx="${C(2)}" cy="${cy}" r="18" fill="url(#glow)"/><circle cx="${C(2)}" cy="${cy}" r="3.6" fill="#fff"/>`;
  s += `<circle cx="${C(3)}" cy="${cy}" r="50" fill="url(#rglow)"/><circle cx="${C(3)}" cy="${cy}" r="34" fill="url(#oglow)"/>`;
  for (let i = 0; i < 36; i++) { const a = r() * 6.283, d1 = 14 + r() * 14, d2 = d1 + 8 + r() * 20, c = Math.cos(a), sn = Math.sin(a); s += `<path d="M${f(C(3) + c * d1)} ${f(cy + sn * d1)}L${f(C(3) + c * d2)} ${f(cy + sn * d2)}" stroke="${r() < .3 ? RED : PAPER}" stroke-opacity="${f(.35 + r() * .55)}" stroke-width="${f(.5 + r() * .7)}" stroke-linecap="round"/>`; }
  s += `<circle cx="${C(3)}" cy="${cy}" r="30" fill="none" stroke="${RED}" stroke-width="5" opacity=".3"/><circle cx="${C(3)}" cy="${cy}" r="30" fill="none" stroke="${PAPER}" stroke-width="1.4" opacity=".9"/>` + fx(C(3), cy, 72, 4) + `<circle cx="${C(3)}" cy="${cy}" r="24" fill="url(#glow)"/><circle cx="${C(3)}" cy="${cy}" r="5.5" fill="#fff"/>`;
  s += `<circle cx="${C(4)}" cy="${cy}" r="50" fill="url(#rglow)" opacity=".55"/><circle cx="${C(4)}" cy="${cy}" r="34" fill="none" stroke="${PAPER}" stroke-width=".7" opacity=".3"/>`;
  for (let i = 0; i < 24; i++) { const a = r() * 6.283, d = 8 + r() * 40; s += `<circle cx="${f(C(4) + Math.cos(a) * d)}" cy="${f(cy + Math.sin(a) * d * .8)}" r="${f(.4 + r() * .7)}" fill="${PAPER}" opacity="${f(.3 + r() * .6)}"/>`; }
  s += fx(C(4), cy, 22, 1.8) + `<circle cx="${C(4)}" cy="${cy}" r="10" fill="url(#glow)"/>` + sp(C(4), cy, 4.5);
  ['The X on the map', 'It heats white as the stars pour in', 'Its arms stretch into spikes', 'It blows', 'It cools into the light behind your name'].forEach((t, i) => { s += T(C(i), 116, t, { s: 8, a: 'middle', c: NOTE }); if (i < 4) s += chev(C(i) + 94, cy); });
  return s;
};

const fig = (w, h, inner, t, d) => `<figure style="width:${w}px"><svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><rect width="${w}" height="${h}" fill="${INK}"/>${inner}<rect x=".5" y=".5" width="${w - 1}" height="${h - 1}" rx="8" fill="none" stroke="${LINE}"/></svg>${t ? `<figcaption><b>${t}</b><span>${d}</span></figcaption>` : ''}</figure>`;
const head = (t, line, right) => `<h1><b>Concept 4, round 2</b>&nbsp; ${t}</h1><p class="sub"><span>${line}</span><i>${right}</i></p>`;
const css = `*{box-sizing:border-box}body{margin:0;background:#0B0A0B;color:${PAPER};font-family:Outfit,Arial,sans-serif}${FONT ? `@font-face{font-family:Outfit;src:url(data:font/woff2;base64,${fs.readFileSync(FONT).toString('base64')}) format('woff2');font-weight:100 900}` : ''}
section{padding:28px;width:max-content}h1{font-size:26px;font-weight:800;letter-spacing:-.02em;margin:0 0 6px}h1 b{color:${RED}}.sub{font-size:13.5px;color:${NOTE};margin:0 0 18px;display:flex;justify-content:space-between;gap:40px;align-items:baseline}.sub i{color:${DIM};font-style:normal;font-size:11px}
.row{display:flex;gap:24px;align-items:flex-start}.grid{display:grid;gap:22px 24px;grid-template-columns:repeat(3,400px)}figure{margin:0}figcaption{padding:10px 2px 0}figcaption b{display:block;font-size:13.5px;font-weight:700;margin-bottom:3px}figcaption span{display:block;font-size:12px;line-height:1.45;color:${NOTE}}
svg{display:block;border-radius:8px}svg text{font-family:Outfit,Arial,sans-serif}
.l,.o,.g,.pf,.t{stroke:${PAPER};stroke-width:1.1;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}.l{fill:none}.o{fill:${INK}}.g{fill:${LAND}}.pf{fill:${PAPER}}.t{fill:none;stroke-opacity:.5;stroke-width:.7}.rf{fill:${RED}}
.h{paint-order:stroke;stroke:#1A1819;stroke-width:3px;stroke-linejoin:round}`;
const defs = `<svg width="0" height="0" style="position:absolute"><defs>
<radialGradient id="glow"><stop offset="0" stop-color="${PAPER}" stop-opacity=".85"/><stop offset="1" stop-color="${PAPER}" stop-opacity="0"/></radialGradient>
<radialGradient id="rglow"><stop offset="0" stop-color="${RED}" stop-opacity=".75"/><stop offset=".55" stop-color="${RED}" stop-opacity=".22"/><stop offset="1" stop-color="${RED}" stop-opacity="0"/></radialGradient>
<radialGradient id="oglow"><stop offset="0" stop-color="#FF8A4C" stop-opacity=".55"/><stop offset="1" stop-color="#FF8A4C" stop-opacity="0"/></radialGradient>
<radialGradient id="flare"><stop offset="0" stop-color="#fff"/><stop offset=".3" stop-color="${PAPER}" stop-opacity=".8"/><stop offset="1" stop-color="${RED}" stop-opacity="0"/></radialGradient>
<linearGradient id="beam" x1="1" x2="0"><stop offset="0" stop-color="${PAPER}" stop-opacity=".55"/><stop offset="1" stop-color="${PAPER}" stop-opacity="0"/></linearGradient>
<pattern id="win" width="4" height="5" patternUnits="userSpaceOnUse"><rect x="1" y="1" width="1.6" height="2.2" fill="${PAPER}" opacity=".55"/></pattern>
<pattern id="plus" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M6 9h6M9 6v6" stroke="#fff" stroke-opacity=".09" stroke-width="1.4"/><circle cx="22" cy="22" r="1.3" fill="#fff" opacity=".08"/></pattern>
<filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="2.2"/></filter>
<filter id="blur" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="6"/></filter>
<clipPath id="cA"><path d="${D(A, 1)}"/></clipPath><clipPath id="cB"><path d="${D(Bz, 1)}"/></clipPath><clipPath id="neat"><rect x="22" y="22" width="556" height="856"/></clipPath>
<clipPath id="lens"><circle cx="270" cy="128" r="100"/></clipPath><clipPath id="mkc"><rect x="440" y="198" width="158" height="105" rx="6"/></clipPath>
</defs></svg>`;
const html = `<!doctype html><meta charset="utf-8"><style>${css}</style>${defs}
<section id="a">${head('The map, drawn in detail', 'Your note: the things along the trail were too simple. Here is the whole map, with six of them drawn up close.', 'Rough sketch: content and behaviour, not final art. The map stays ink, paper and red until a card opens.')}
<div class="row">${fig(600, 900, bigMap(), 'The whole map', 'It fits the height of the screen when you arrive. The trail winds from the landing at the top to the X at the bottom, and the numbers mark the things you can play with.')}
<div><div class="grid">${fig(400, 270, p1(), '1. The compass picks a craft', 'At rest the needle drifts. Drag it to Print, Video, Motion or Screen and every piece of that craft on the map lights up.')}${fig(400, 270, p2(), '2. Chests hold the work', 'A scratch in the ground near each stop. Tap it and the chest digs itself up, the lid pops, stars burst out and a real piece from that stop floats up with its link.')}${fig(400, 270, p3(), '3. The spyglass plays the reel', 'It tracks your cursor from the headland. Tap it and the lens fills with five seconds of video, then irises shut.')}${fig(400, 270, p4(), '4. The serpent', 'It loops through the waves and watches the cursor. Poke it and it dives, then surfaces with a deadline story in its teeth.')}${fig(400, 270, p5(), '5. The lighthouse', 'The beam sweeps on its own. Drag it across the map and notes in invisible ink show up where the light lands.')}${fig(400, 270, p6(), '6. The wanted poster', 'It flaps on a signpost. Tap it and it unrolls full size as a real printed piece, with the stock and the brief on the back.')}</div>
<div style="margin-top:22px">${fig(1248, 118, strip())}</div></div></div></section>
<section id="b">${head('Cards and footer', 'Your notes: the real logo and brand colours on each card, a call to action in the footer, the X turning into a supernova, and your name as the giant text.', 'All five logos and their colours are real, taken from the places themselves.')}
<div class="row">${fig(640, 400, b1(), 'A stop opens, in that place\'s own brand', 'The card wears the place\'s logo and colours. This one is real: the HMC logo, the navy and the green come from your annual report, and the picture is that report.')}${fig(1248, 400, b2(), 'The other four, by the same rule', 'Each card takes its ground, type and button colours from the place\'s own logo and site. Laurier and Lennard keep their logos on white, as on their sites, over a field of their colour.')}</div>
<div class="row" style="margin-top:28px"><div><div class="row">${fig(400, 250, f1(), '1. The red star reaches the X', 'The trail ends on the X, at the bottom of the map.')}${fig(400, 250, f2(), '2. Every star rushes in', 'The stars on the page pour into the X, and its four arms stretch into spikes.')}${fig(400, 250, f3(), '3. Supernova', 'The X blows. The ring and the flying stars fill the screen.')}</div><div style="margin-top:22px">${fig(1248, 126, morph())}</div></div>${fig(640, 400, f4(), '4. It settles as the footer', 'The glow stays behind your name, set edge to edge. The call to action sits above it, and the links sit below it on the rule the timeline becomes.')}</div></section>`;
(async () => {
  const file = SCR + '/round2.html'; fs.writeFileSync(file, html);
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 2100, height: 1200 }, deviceScaleFactor: 2 });
  await p.goto('file://' + file); await p.evaluate(() => document.fonts.ready);
  console.log(JSON.stringify(await p.evaluate(() => ['gnm', 'gl1', 'gl2'].map(id => { const b = document.getElementById(id).getBBox(); return [id, Math.round(b.x * 10) / 10, Math.round((b.x + b.width) * 10) / 10]; }))));
  await p.locator('#a').screenshot({ path: OUT + '/treasure-map-in-detail.png' });
  await p.locator('#b').screenshot({ path: OUT + '/treasure-map-cards-and-footer.png' });
  await b.close();
})();
