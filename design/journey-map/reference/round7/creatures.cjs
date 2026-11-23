// Round 7 reference drawings for part C2: Huginn and Muninn as one raven rig, their bare ash, and the chest lid.
// Reference only: port the shapes and the rules into art.mjs, data.mjs, findcreatures.mjs and findhoards.mjs; never import this file.
// Classes are the map's own: g = Land fill and Paper line, l = Paper line, o = Ink fill and Paper line,
// t = thin half-strength line, pf = Paper fill. The PNGs beside this file were drawn from sheet(), strip(), perchSheet() and chestSheet().
//
// THE RAVEN. One drawing for every moment: sitting, taking off, flapping, gliding, landing. The folded wing is the open
// wing turned and squashed (transforms only, no second wing drawing), so any two poses mix with mix() and the bird
// never swaps one picture for another. A pose is:
//   sq   [x, y]  the body's squash, about PIV (stretched long and low in flight)
//   body deg     the body's tilt about PIV (nose up is negative on screen because the rig faces right and y runs down)
//   head deg     the head's turn about the neck point N
//   wing [deg, sx, sy]  the near wing about the shoulder S: turn, then scale along and across
//   far  [deg, sx, sy]  the far wing (class o, behind the body) about S + (1.2, -0.8)
//   legs 0..1    leg length about HIP (tucked in flight)
// The rig faces right; mirror -1 faces left. Local units, origin at the feet on the perch.
// Order of drawing, back to front: far wing, legs, body and tail lines, head (fill without a stroke, then the open
// outline, so no seam shows at the neck), near wing.
'use strict';
const n1 = n => +(+n).toFixed(2);
const P = a => a.map(([c, ...v]) => c + v.map(n1).join(' ')).join('');
// rounded bumps along a polyline (outward = left of travel), for feather edges
const bumps = (pts, b) => { let d = ''; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], c = pts[i + 1], mx = (a[0] + c[0]) / 2, my = (a[1] + c[1]) / 2, dx = c[0] - a[0], dy = c[1] - a[1], L = Math.hypot(dx, dy) || 1; d += `Q${n1(mx + dy / L * b * L)} ${n1(my - dx / L * b * L)} ${n1(c[0])} ${n1(c[1])}`; } return d; };
// body and tail, one outline
const BODY = P([['M', 6.4, -12.4], ['C', 7.4, -10.4, 6.9, -7.3, 4.5, -5.3], ['C', 2.7, -3.9, -0.8, -3.4, -4.0, -4.0],
  ['L', -8.8, -0.6], ['L', -13.4, 2.1], ['L', -12.9, -0.4], ['L', -12.4, -1.8], ['L', -7.6, -6.6],
  ['C', -6.2, -9.0, -3.2, -12.0, 0.6, -13.8], ['C', 2.4, -14.7, 4.2, -15.0, 5.6, -14.6], ['Z']]);
const TAILLINES = P([['M', -8.6, -3.4], ['L', -12.6, 0.6], ['M', -9.0, -5.0], ['L', -12.5, -1.0]]);
// head, relative to the neck point N: a fill that reaches into the body, and an open outline (no seam at the neck)
const N = [4.4, -14.2];
const HEADLINE = [['M', -2.2, -0.6], ['C', -2.2, -2.0, -1.4, -3.2, 0.2, -3.7], ['C', 1.4, -4.0, 2.6, -3.8, 3.6, -3.2],
  ['C', 5.8, -3.1, 8.4, -2.3, 10.2, -0.7], ['C', 10.3, -0.4, 10.1, -0.1, 9.8, -0.1], ['C', 8.0, -0.1, 6.0, 0.1, 4.0, 0.3],
  ['L', 3.5, 0.2], ['L', 3.7, 1.1], ['L', 2.8, 0.8], ['L', 3.0, 1.9], ['L', 2.0, 1.5], ['L', 2.1, 2.6], ['L', 1.3, 2.1], ['L', 1.4, 3.0]];
const HEADFILL = P([...HEADLINE, ['L', -1.0, 3.4], ['L', -3.0, 1.6], ['Z']]);
const HEADOUT = P(HEADLINE);
const BILL = P([['M', 3.4, -1.2], ['C', 5.2, -1.4, 7.2, -1.1, 8.8, -0.6], ['M', 3.6, -3.1], ['C', 4.3, -2.6, 4.9, -2.1, 5.3, -1.6]]);
const EYE = [1.5, -2.2, 0.4];
// the wing, drawn open with its length straight up from the shoulder (origin), the hand's fingers at the top, the fan to the back (-x)
const TIPS = [[-1.0, -20.0], [-3.3, -21.2], [-5.8, -20.8], [-8.0, -19.2], [-9.7, -16.6]];
const HC = [-4.6, -10.0]; // the hand's centre, for the notches between fingers
const fingers = () => {
  let d = ''; const dir = t => { const dx = t[0] - HC[0], dy = t[1] - HC[1], L = Math.hypot(dx, dy); return [dx / L, dy / L]; };
  TIPS.forEach((t, i) => {
    const [ux, uy] = dir(t), px = -uy, py = ux, w = 0.85, r = 1.1;
    const a = [t[0] - ux * r + px * w, t[1] - uy * r + py * w], b = [t[0] - ux * r - px * w, t[1] - uy * r - py * w];
    d += `L${n1(a[0])} ${n1(a[1])}Q${n1(t[0] + ux * 0.5)} ${n1(t[1] + uy * 0.5)} ${n1(b[0])} ${n1(b[1])}`;
    if (i < TIPS.length - 1) { const nx = (t[0] + TIPS[i + 1][0]) / 2, ny = (t[1] + TIPS[i + 1][1]) / 2, k = 0.42; d += `L${n1(nx + (HC[0] - nx) * k)} ${n1(ny + (HC[1] - ny) * k)}`; }
  });
  return d;
};
const TRAIL = [[-10.0, -13.8], [-9.8, -10.6], [-9.0, -7.6], [-7.8, -4.8], [-5.8, -2.2], [-3.0, 0.0], [0.8, 0.6]];
const WING = `M0.8 0.6C1.2 -3.6 1.0 -7.6 -0.2 -11.4` + fingers() + `L-10.0 -13.8` + bumps(TRAIL, 0.16) + 'Z';
const WINGLINES = P([['M', -0.6, -11.2], ['C', -3.4, -10.0, -6.6, -10.2, -9.6, -11.6], ['M', -0.4, -6.2], ['C', -2.8, -5.4, -5.6, -5.4, -8.8, -6.6]]);
const S = [0.4, -11.8]; // shoulder
const LEGS = P([['M', -0.9, -3.8], ['L', -0.7, 0], ['M', 1.3, -3.9], ['L', 1.6, 0], ['M', -2.2, 0.1], ['L', 0.4, 0.1], ['M', 0.4, 0.1], ['L', 2.8, 0.2]]);
const HIP = [0.2, -4.0], PIV = [-2.0, -8.0]; // the body group turns about PIV
const POSES = {
  sit: { sq: [1, 1], body: 0, head: 0, wing: [-121, 0.3, 0.66], far: [-121, 0.26, 0.6], legs: 1 },
  unfold: { sq: [1.03, 0.94], body: 12, head: -6, wing: [-72, 0.66, 0.84], far: [-70, 0.58, 0.78], legs: 0.7 },
  up: { sq: [1.08, 0.84], body: 26, head: -18, wing: [-34, 1, 1], far: [-26, 0.86, 0.9], legs: 0 },
  mid: { sq: [1.08, 0.84], body: 28, head: -20, wing: [-92, 1, 0.55], far: [-88, 0.86, 0.5], legs: 0 },
  down: { sq: [1.08, 0.84], body: 28, head: -20, wing: [-150, 1, 0.82], far: [-148, 0.86, 0.75], legs: 0 },
  glide: { sq: [1.1, 0.82], body: 28, head: -22, wing: [-62, 1, 0.62], far: [-56, 0.86, 0.56], legs: 0 },
  flare: { sq: [1.02, 0.96], body: 4, head: -2, wing: [-22, 1, 1], far: [-14, 0.86, 0.92], legs: 0.8 },
};
const mix = (a, b, t) => { const A = POSES[a], B = POSES[b], m = (u, v) => Array.isArray(u) ? u.map((x, i) => x + (v[i] - x) * t) : u + (v - u) * t; const o = {}; for (const k in A) o[k] = m(A[k], B[k]); return o; };
const bird = (pose, x, y, k = 1, mirror = 1) => {
  const q = typeof pose === 'string' ? POSES[pose] : pose, tr = (a, sx, sy) => `rotate(${a}) scale(${sx} ${sy})`;
  return `<g transform="translate(${x} ${y}) scale(${k * mirror} ${k})">`
    + `<g transform="rotate(${q.body} ${PIV[0]} ${PIV[1]}) translate(${PIV[0]} ${PIV[1]}) scale(${q.sq[0]} ${q.sq[1]}) translate(${-PIV[0]} ${-PIV[1]})">`
    + `<g transform="translate(${S[0] + 1.2} ${S[1] - 0.8})"><g transform="${tr(...q.far)}"><path class="o" d="${WING}"/></g></g>`
    + `<g transform="translate(${HIP[0]} ${HIP[1]}) scale(1 ${q.legs}) translate(${-HIP[0]} ${-HIP[1]})"><path class="l" d="${LEGS}"/></g>`
    + `<path class="g" d="${BODY}"/><path class="t" d="${TAILLINES}"/>`
    + `<g transform="translate(${N[0]} ${N[1]}) rotate(${q.head})"><path class="g" style="stroke:none" d="${HEADFILL}"/><path class="l" d="${HEADOUT}"/><path class="t" d="${BILL}"/><circle class="pf" cx="${EYE[0]}" cy="${EYE[1]}" r="${EYE[2]}"/></g>`
    + `<g transform="translate(${S[0]} ${S[1]})"><g transform="${tr(...q.wing)}"><path class="g" d="${WING}"/><path class="t" d="${WINGLINES}"/></g></g>`
    + `</g></g>`;
};
// the perch: a bare, wind-bent ash with two boughs at different heights
const spl = (Pt, seg = 8) => { const n = Pt.length, out = []; const g = i => Pt[Math.max(0, Math.min(n - 1, i))]; for (let i = 0; i < n - 1; i++) { const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2); for (let j = 0; j < seg; j++) { const t = j / seg, t2 = t * t, t3 = t2 * t; out.push([0, 1].map(k => .5 * (2 * p1[k] + (p2[k] - p0[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * t3))); } } out.push(Pt[n - 1]); return out; };
const tube = (Pt, w0, w1) => { const S = spl(Pt), n = S.length, L = [], R = []; for (let i = 0; i < n; i++) { const a = S[Math.max(0, i - 1)], c = S[Math.min(n - 1, i + 1)], dx = c[0] - a[0], dy = c[1] - a[1], l = Math.hypot(dx, dy) || 1, t = i / (n - 1), w = (w0 + (w1 - w0) * t) / 2; L.push([S[i][0] - dy / l * w, S[i][1] + dx / l * w]); R.push([S[i][0] + dy / l * w, S[i][1] - dx / l * w]); } return 'M' + [...L, ...R.reverse()].map(p => n1(p[0]) + ' ' + n1(p[1])).join('L') + 'Z'; };
const TK = 1.45; // the tree is drawn at 1/1.45 and scaled up
const PERCHES = [[-11 * TK, -18.2 * TK], [11 * TK, -28.4 * TK]]; // Huginn (faces left), Muninn (faces right)
const TREE = [
  tube([[0, 0.6], [0.4, -5], [0.6, -10], [0.8, -13.4]], 4.6, 2.8),
  tube([[0.4, -11.6], [-3, -15.2], [-7, -17.4], [-11, -18.2], [-15.6, -18.6]], 2.6, 0.5),
  tube([[0.8, -13], [2.6, -18], [5, -23.4], [8, -27], [11, -28.4], [15.4, -29.2]], 2.4, 0.5),
  tube([[-6.4, -17.1], [-7.4, -20.4], [-7.0, -23.6]], 1.0, 0.3),
  tube([[4.6, -22.6], [3.4, -27.4], [3.8, -31.2]], 1.0, 0.3),
  tube([[0.3, -7.6], [-2.6, -9.0], [-4.4, -9.2]], 1.2, 0.4),
];
const TREELINES = 'M-1.6 0.6Q-3.6 1.2 -5.4 1.8M1.8 0.6Q3.8 1.2 5.6 1.6M-0.4 -2V-9M1.2 -3.2V-8.4M-15 2H15';
// drawn as one shape: every limb's outline first at double width, then every fill on top, so no seams show where limbs meet
const perchTree = () => `<g transform="scale(${TK})">` + TREE.map(d => `<path class="g" style="stroke-width:2.2" d="${d}"/>`).join('') + TREE.map(d => `<path class="g" style="stroke:none" d="${d}"/>`).join('') + `<path class="t" d="${TREELINES}"/></g>`;
function strip() {
  const w = 1600, h = 520; let s = '';
  const seq = [['sit', 'unfold'], ['sit', 'unfold'], ['sit', 'unfold'], ['unfold', 'up'], ['unfold', 'up'], ['up', 'mid'], ['mid', 'down'], ['down', 'mid'], ['mid', 'up']];
  const ts = [0, 0.5, 1, 0.5, 1, 1, 1, 1, 1];
  seq.forEach(([a, b], i) => { s += bird(mix(a, b, ts[i]), 80 + i * 170, 150, 4.2); });
  const land = [['glide', 'flare'], ['glide', 'flare'], ['glide', 'flare'], ['flare', 'sit'], ['flare', 'sit'], ['flare', 'sit'], ['flare', 'sit']];
  const lt = [0, 0.5, 1, 0.25, 0.5, 0.75, 1];
  land.forEach(([a, b], i) => { s += bird(mix(a, b, lt[i]), 80 + i * 200, 380, 4.2); });
  s += `<path class="l" d="M40 150H1560M40 380H1560" stroke-opacity=".25"/>`;
  const pt = (x, y, k) => `<g transform="translate(${x} ${y}) scale(${k})">${perchTree()}${bird('sit', PERCHES[0][0], PERCHES[0][1], 0.85, -1)}${bird('sit', PERCHES[1][0], PERCHES[1][1], 0.85, 1)}</g>`;
  return { svg: `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${s}</svg>`, w, h, pt };
}
function perchSheet() {
  const w = 900, h = 560; const { pt } = strip();
  let s = pt(330, 520, 6.2) + pt(700, 520, 2.6) + pt(820, 520, 1.2);
  return { svg: `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${s}</svg>`, w, h };
}
function sheet() {
  const names = Object.keys(POSES), w = 1140, h = 560; let s = '';
  names.forEach((nm, i) => { const cx = 90 + i * 150; s += bird(nm, cx, 200, 5) + `<text x="${cx - 40}" y="320" font-size="18">${nm}</text>`; });
  names.forEach((nm, i) => { const cx = 90 + i * 150; s += bird(nm, cx, 470, 2.4) + bird(nm, cx + 60, 470, 1.2); });
  s += `<path class="l" d="M40 200H1100M40 470H1100" stroke-opacity=".25"/>`;
  return { svg: `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${s}</svg>`, w, h };
}

// THE CHEST. The lid is hinged at the back edge, as a real chest's is, and the chest is seen front-on and a little from
// above. Local units as in FIND_PLAY.drawings.hoard (rim at y -34, half-width 30). At angle a the lid's front (the dome)
// rises by D*sin(a) and squashes toward the rim by cos(a); its inside (a plank face, class g) grows up from the rim by
// sin(a) and leans back past 90 degrees; the dark mouth with its warm line opens under the rim over the first 60 degrees.
// Draw body, inside face, mouth, then the dome. Past 90 degrees the dome is gone (cos < 0) and only the inside shows.
// The lid opens to 118 degrees and settles back to 110 (overshoot no more than 8 degrees).
const RIM = -34, D = 24; // the rim line and the chest's depth (front to back)
const body = `<rect class="g" x="-30" y="-34" width="60" height="34" rx="2"/><path class="t" d="M-18 -34V0M18 -34V0M-30 -22H30"/><rect class="pf" x="-4.5" y="-27" width="9" height="10" rx="1.5"/>`;
// the opening seen a little from above: a dark lens under the rim line that opens with the lid
const mouth = k => k <= 0 ? '' : `<g transform="translate(0 ${RIM}) scale(1 ${n1(k)})"><path class="o" d="M-29 0L-27 -4.5H27L29 0Z"/><path d="M-22 -2.2H22" fill="none" stroke="#FF8A4C" stroke-opacity=".7" stroke-width="1.2" vector-effect="non-scaling-stroke"/></g>`;
// the lid's front: the dome, squashed toward the rim line by cos(angle)
const lidFront = (c, up) => c <= 0 ? '' : `<g transform="translate(0 ${n1(RIM - up)}) scale(1 ${n1(c)}) translate(0 ${-RIM})"><path class="g" d="M-30 -34Q0 -56 30 -34Z"/><path class="t" d="M-18 -42V-34M18 -42V-34"/></g>`;
// the lid's inside: a plank face growing up from the rim line by sin(angle), leaning back past 90 degrees
const lidIn = (sn, lean) => sn <= 0 ? '' : `<g transform="translate(0 ${RIM}) scale(1 ${n1(sn)})"><path class="g" d="M-30 0L${n1(-30 + lean)} ${-D}Q0 ${-D - 6} ${n1(30 - lean)} ${-D}L30 0Z"/><path class="t" d="M-18 0L${n1(-18 + lean * .6)} ${-D - 2}M18 0L${n1(18 - lean * .6)} ${-D - 2}M-29 -6H29"/></g>`;
const chest = deg => {
  const a = deg * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a), lean = deg > 90 ? (deg - 90) / 20 * 2.4 : 0;
  const open = Math.min(1, Math.max(0, deg / 60));
  return `${body}${lidIn(sn, lean)}${mouth(open)}${lidFront(c, D * sn)}`;
};
function chestSheet() {
  const w = 1500, h = 360, angles = [0, 20, 40, 60, 80, 95, 110, 118, 110]; let s = '';
  angles.forEach((d, i) => { s += `<g transform="translate(${90 + i * 160} 250) scale(2.2)">${chest(d)}</g><text x="${60 + i * 160}" y="320" font-size="16">${d} deg</text>`; });
  return { svg: `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${s}</svg>`, w, h };
}

module.exports = { POSES, mix, bird, perchTree, PERCHES, TREE, TREELINES, BODY, HEADFILL, HEADOUT, BILL, EYE, WING, WINGLINES, LEGS, TAILLINES, S, N, PIV, HIP, TK, chest, sheet, strip, perchSheet, chestSheet };
