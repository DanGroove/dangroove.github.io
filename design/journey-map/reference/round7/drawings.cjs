// Round 7 reference drawings for the journey map, in map units (the map is 600 x 900).
// Reference only: port the shapes and the rules into art.mjs and data.mjs; never import this file.
// Classes are the map's own: g = Land fill and Paper line, l = Paper line, o = Ink fill and Paper line,
// t = thin half-strength line, pf = Paper fill. #151314 is C.ink and #F7F6F3 is C.paper.
// Run `node drawings.cjs` to write drawings-preview.svg (the drawings alone, placed where they go on the map).
'use strict';
const n1 = n => +(+n).toFixed(1);
const spline = (P, closed, seg = 10) => { const n = P.length, out = [], g = i => closed ? P[(i + n) % n] : P[Math.max(0, Math.min(n - 1, i))]; for (let i = 0; i < (closed ? n : n - 1); i++) { const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2); for (let j = 0; j < seg; j++) { const t = j / seg, t2 = t * t, t3 = t2 * t; out.push([0, 1].map(k => .5 * (2 * p1[k] + (p2[k] - p0[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * t3))); } } if (!closed) out.push(P[n - 1]); return out; };
const pathD = (P, closed) => 'M' + P.map(p => n1(p[0]) + ' ' + n1(p[1])).join('L') + (closed ? 'Z' : '');
const rnd = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
// scalloped edge: points along a polyline, bumps outward (to the left of travel) of size b
const scallop = (P, b, closed = true) => {
  let d = `M${n1(P[0][0])} ${n1(P[0][1])}`; const n = P.length, m = closed ? n : n - 1;
  for (let i = 0; i < m; i++) { const a = P[i], c = P[(i + 1) % n], mx = (a[0] + c[0]) / 2, my = (a[1] + c[1]) / 2, dx = c[0] - a[0], dy = c[1] - a[1], L = Math.hypot(dx, dy) || 1; const bb = typeof b === 'function' ? b(i) : b; d += `Q${n1(mx + dy / L * bb)} ${n1(my - dx / L * bb)} ${n1(c[0])} ${n1(c[1])}`; }
  return d + (closed ? 'Z' : '');
};
// a tapered tube round a centreline: width w0 at the start to w1 at the end, optional wobble
const tube = (P, w0, w1 = 0, wob = 0, seed = 1) => {
  const S = spline(P, false, 8), n = S.length, L = [], Rt = [];
  let s0 = seed; const r = () => { s0 = (s0 * 16807) % 2147483647; return s0 / 2147483647; };
  for (let i = 0; i < n; i++) {
    const a = S[Math.max(0, i - 1)], c = S[Math.min(n - 1, i + 1)], dx = c[0] - a[0], dy = c[1] - a[1], l = Math.hypot(dx, dy) || 1, t = i / (n - 1);
    const w = (w0 + (w1 - w0) * Math.pow(t, 0.8)) / 2 * (1 + (wob ? (r() - .5) * wob : 0));
    L.push([S[i][0] - dy / l * w, S[i][1] + dx / l * w]); Rt.push([S[i][0] + dy / l * w, S[i][1] - dx / l * w]);
  }
  return pathD([...L, ...Rt.reverse()], true);
};


// ---- Yggdrasil: trunk foot at MAP.ygg moved to (304, 374) ----
// outline of the crown, clockwise from the lower left (relative to the trunk foot)
const CROWN = [[-50, -31], [-59, -36], [-64, -45], [-61, -55], [-53, -63], [-43, -70], [-31, -73], [-17, -77], [-2, -79], [13, -78], [27, -76], [41, -71], [54, -66], [65, -57], [71, -47], [71, -38], [63, -31],
  [50, -28], [37, -31], [24, -34], [12, -39], [0, -41], [-12, -38], [-24, -34], [-37, -30]];
// inner overlaps: chains of downward-hanging scallops (lower edges of upper foliage masses)
const LAYERS = [
  [[-55, -48], [-42, -55], [-28, -58], [-14, -60], [-2, -63]],
  [[6, -66], [20, -68], [34, -65], [48, -59], [60, -51]],
  [[-48, -38], [-34, -44], [-20, -46], [-6, -49], [8, -50], [22, -48], [36, -45], [50, -42], [62, -40]],
  [[-30, -64], [-18, -68], [-4, -70], [10, -70], [24, -67]],
];
function yggdrasil(fx, fy) {
  const at = (s, x = fx, y = fy) => `<g transform="translate(${n1(x)} ${n1(y)})">${s}</g>`;
  let s = '';
  // three great roots (to the well, to the left, to the right) and two small ones, behind the trunk
  const roots = [
    tube([[-5, -7], [-14, -4], [-24, -1], [-32, 3], [-41, 5]], 7, .6, .25, 3),
    tube([[5, -7], [15, -4], [27, 0], [38, 4], [49, 5]], 7, .6, .25, 4),
    tube([[-1, -2], [-2, 5], [0, 11], [-1, 17]], 6, .8, .2, 5),
    tube([[-4, -2], [-10, 3], [-16, 8], [-20, 11]], 4, .5, .2, 6),
    tube([[4, -2], [9, 3], [14, 7], [18, 9]], 4, .5, .2, 7),
  ];
  s += at(roots.map(d => `<path class="g" d="${d}"/>`).join(''));
  s += at('<path class="t" d="M-1 17C-2 20 -1 23 1 25M0 16C2 19 4 21 7 22M-1 14C-4 16 -6 18 -7 21M-20 11C-22 13 -22 15 -21 17M18 9C20 11 21 13 21 15"/>'); // rootlets in the water
  // trunk forking into three boughs, drawn before the crown so the crown's underside cuts them
  const trunk = 'M-9 1C-6 -5 -5 -12 -5.5 -19C-6 -24 -9 -30 -15 -36C-19 -40 -23 -43 -27 -46L-22 -47C-18 -43 -13 -39 -8 -34C-6 -32 -4 -31 -3 -34C-3 -40 -3 -46 -2 -52L2.5 -52C3 -46 3 -40 3.5 -34C4.5 -31 6.5 -32 9 -35C13 -39 18 -43 23 -47L27 -45C22 -41 16 -36 11 -31C7 -27 5.5 -23 5.5 -18C5.5 -11 6.5 -5 9 1C3 -.5 -3 -.5 -9 1Z';
  s += at(`<path class="g" d="${trunk}"/><path class="t" d="M-2.5 -3C-2.6 -10 -2.2 -18 -1.6 -26M1.8 -3C2 -10 1.8 -17 1.6 -24M-5 -1C-4 -5 -3.6 -8 -3.7 -11M5 -1C4.3 -4 4 -7 4 -10M-1 -14C0 -15.5 1 -15.5 1.6 -14C1 -12 -0.4 -12 -1 -14Z"/>`);
  // the crown: one outline with outward scallops, then inner overlaps and leaf marks
  const r = rnd(7), crown = scallop(CROWN, i => { const a = CROWN[i], c = CROWN[(i + 1) % CROWN.length]; return Math.hypot(c[0] - a[0], c[1] - a[1]) * (0.42 + r() * 0.16); });
  s += at(`<path class="g" d="${crown}"/>`);
  LAYERS.forEach((P, k) => { const rr = rnd(20 + k); s += at(`<path class="l" stroke-opacity=".75" d="${scallop(P, i => -(Math.hypot(P[i + 1][0] - P[i][0], P[i + 1][1] - P[i][1]) * (0.38 + rr() * .15)), false)}"/>`); });
  // leaf marks: little hanging ticks scattered in the crown, kept off the overlap lines
  let ticks = ''; const rt = rnd(33);
  for (let i = 0; i < 46; i++) { const x = -56 + rt() * 122, y = -80 + rt() * 44; const inside = (x / 64) ** 2 + ((y + 58) / 24) ** 2 < 1; if (!inside) continue; ticks += `M${n1(x - 1.8)} ${n1(y)}q1.8 1.5 3.6 0`; }
  s += at(`<path class="t" d="${ticks}"/>`);
  // the eagle on the crown's crown, wings raised, looking left
  const eagle = 'M-1.4 0L1.4 0L1.8 -3C2.2 -5 1.9 -7 1.1 -8.4C1.6 -9.3 1.5 -10.6 .5 -11.3C-.6 -12 -2 -11.6 -2.6 -10.8C-3.4 -11 -4.4 -10.7 -4.7 -9.7C-4.3 -10 -3.7 -9.9 -3.2 -9.4C-2.7 -9 -2.1 -8.7 -1.5 -8.6C-2.1 -7 -2.2 -5 -1.9 -3Z';
  const wingL = 'M-1.3 -7.6C-3.4 -9.6 -6.2 -12.4 -9.4 -15C-9.2 -13.8 -8.8 -13.2 -8.3 -12.8L-9.8 -12.6C-9.2 -11.6 -8.6 -11.2 -7.9 -11L-9.4 -10.4C-8.4 -9.6 -7.4 -9.3 -6.4 -9.2L-7.4 -8.4C-5.4 -7.8 -3.4 -6.8 -1.6 -5.6Z';
  const wingR = 'M1.2 -7.6C3.4 -9.8 6.4 -12.6 9.8 -15.2C9.6 -14 9.2 -13.4 8.7 -13L10.2 -12.8C9.6 -11.8 9 -11.4 8.3 -11.2L9.8 -10.6C8.8 -9.8 7.8 -9.5 6.8 -9.4L7.8 -8.6C5.8 -8 3.6 -6.9 1.6 -5.6Z';
  s += at(`<g transform="scale(1.1 .78)"><path class="g" d="${wingL}"/><path class="g" d="${wingR}"/></g><path class="g" d="${eagle}"/><circle class="pf" cx="-1.3" cy="-10.4" r=".35"/><path class="t" d="M-2 -1.5L-2.6 .8M2 -1.5L2.6 .8"/>`, fx - 4, fy - 77);
  // Ratatoskr climbing the trunk, head up, plumed tail to the right
  const squirrel = '<path class="g" d="M.6 -.6C2.4 -.4 3.4 -1.8 3.2 -3.6C3 -5.2 3.8 -6.6 5 -6.6C4.4 -5.6 4.4 -4.6 4.6 -3.4C4.9 -1.4 3.2 .6 .8 .4Z"/><path class="g" d="M-.8 0C-1.4 -1.4 -1.4 -3 -.9 -4.2C-.6 -5 -.6 -5.6 -1 -6.2C-1.2 -6.8 -.9 -7.4 -.3 -7.5C.3 -7.6 .8 -7.2 .9 -6.6C1.4 -6.2 1.4 -5.4 1 -4.8C1.4 -3.6 1.4 -1.6 .8 0Z"/><path class="l" d="M.3 -7.4L.5 -8.2M-1 -3.4L-1.8 -2.8"/><circle class="pf" cx="-.2" cy="-6.7" r=".25"/>';
  s += at(squirrel, fx + .6, fy - 9);
  // Nidhogg gnawing the left root's tip: horned head, jaws round the root, a coiled body sinking into the ground
  const nid = `<path class="g" d="${tube([[-8.6, .8], [-11.2, 2.6], [-12, 5.4], [-10.4, 7.6], [-8, 7.2], [-7.6, 5.6]], 2.8, .6)}"/>`
    + '<path class="g" d="M1 -1.4C-.6 -2.6 -2.6 -3.4 -4.6 -3.4C-6.4 -3.4 -7.8 -2.8 -8.8 -1.8C-9.6 -1 -9.8 .2 -9.2 1.2C-8.6 2.2 -7.2 2.6 -5.6 2.4C-3.8 2.2 -1.6 1.6 .6 .8L-2.4 .2L.8 -.6Z"/><path class="l" d="M-6.8 -3L-8.6 -5.6M-5 -3.4L-5.8 -6.2M-.4 -.9L-.9 -.2L-1.4 -.8M-.4 .6L-.9 0L-1.4 .5"/><circle class="pf" cx="-5.2" cy="-1.4" r=".45"/>';
  s += at(nid, fx - 40.5, fy + 5);
  return s;
}

// ---- Jormungandr: the ring round the main island and the head at its start ----
// The ring's centreline, clockwise round the main island, from the back of the head to the tail tip in its mouth.
const RING = [[500, 101], [524, 106], [546, 122], [558, 150], [563, 190], [562, 240], [560, 290], [563, 340], [563, 390], [562, 440], [563, 490], [563, 535], [552, 572],
  [524, 604], [484, 622], [440, 626], [396, 622], [350, 614], [300, 618], [252, 624], [204, 618], [160, 600], [124, 572], [98, 532], [80, 490], [62, 446], [56, 400],
  [56, 350], [56, 300], [62, 252], [76, 206], [98, 166], [128, 132], [168, 116], [214, 112], [262, 116], [312, 120], [362, 113], [410, 108], [444, 105], [468, 102.5]];
const SURF = [[0, .085], [.235, .29], [.43, .5], [.655, .715], [.885, 1]]; // surfaced stretches, as shares of the length
const W = 6.4; // body width
const sample = () => {
  const S = spline(RING, false, 10), cum = [0];
  for (let i = 1; i < S.length; i++) cum.push(cum[i - 1] + Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1]));
  return { S, cum, L: cum.at(-1) };
};
const width = t => W * (t < .9 ? 1 : 1 - (t - .9) / .1 * .7);
const edges = (S, cum, L, a, b, taper = 0) => {
  const left = [], right = [], mid = [];
  for (let i = 0; i < S.length; i++) {
    const t = cum[i] / L; if (t < a || t > b) continue;
    const p = S[Math.max(0, i - 1)], q = S[Math.min(S.length - 1, i + 1)], dx = q[0] - p[0], dy = q[1] - p[1], l = Math.hypot(dx, dy) || 1, u = taper ? Math.min(1, (t - a) / taper, b >= 1 ? 1 : (b - t) / taper) : 1, w = width(t) / 2 * (taper ? .45 + .55 * Math.sin(Math.PI / 2 * Math.max(0, u)) : 1);
    left.push([S[i][0] - dy / l * w, S[i][1] + dx / l * w]); right.push([S[i][0] + dy / l * w, S[i][1] - dx / l * w]); mid.push(S[i]);
  }
  return { left, right, mid };
};
function jormungandr() {
  const { S, cum, L } = sample(); let s = '';
  // submerged: the whole body faint, as if seen through the water
  const all = edges(S, cum, L, 0, 1);
  s += `<path d="${pathD([...all.left, ...all.right.slice().reverse()], true)}" fill="#151314" stroke="none" opacity=".55"/>`;
  s += `<path d="${pathD(all.left)}M${pathD(all.right).slice(1)}" fill="none" stroke="#F7F6F3" stroke-opacity=".22" stroke-width=".8" stroke-dasharray="3 2.2" vector-effect="non-scaling-stroke"/>`;
  // surfaced stretches: a solid band with scales and a spine, and water breaking at each end
  SURF.forEach(([a, b]) => {
    const e = edges(S, cum, L, a, b, a === 0 ? 0 : .012);
    s += `<path class="g" d="${pathD([...e.left, ...e.right.slice().reverse()], true)}" style="fill:#151314"/>`;
    // scales: chevrons along the band every ~3.2 units
    let sc = ''; for (let i = 2; i < e.mid.length - 2; i += 1) { const t = i; const p = e.left[t], q = e.right[t], m = e.mid[t], n = e.mid[t + 1]; if (i % 2) continue; const dx = n[0] - m[0], dy = n[1] - m[1], l = Math.hypot(dx, dy) || 1, f = 1.8; sc += `M${n1(p[0] + dx / l * f)} ${n1(p[1] + dy / l * f)}L${n1(m[0] - dx / l * .6)} ${n1(m[1] - dy / l * .6)}L${n1(q[0] + dx / l * f)} ${n1(q[1] + dy / l * f)}`; }
    s += `<path class="t" d="${sc}"/>`;
    // water breaks at both ends
    [e.mid[0], e.mid.at(-1)].forEach((m, k) => { s += `<path class="t" style="stroke-opacity:.8" d="M${n1(m[0] - 7)} ${n1(m[1] + 1)}q2.4 -2 4.8 0t4.8 0t4.8 0"/>`; });
  });
  return s;
}
// the head, in profile facing left, biting the tail tip; origin at the back of the head on the ring
const HEAD = `<g transform="translate(500 101)">
<path class="l" d="M-7 -8.4C-4 -12.6 1 -15.4 7 -15C11 -14.6 13 -11.8 11.6 -9.4C10.4 -7.6 7.8 -7.8 7.4 -9.6C7.2 -10.8 8.6 -11.4 9.4 -10.6"/>
<path d="M4 -3.2L0 -3.2C-3 -6.4 -7 -8.8 -12 -9.4C-16 -9.8 -20 -9.6 -23 -8.4C-26 -7.2 -29 -6.4 -32 -6.6C-34 -6.8 -35.6 -8 -36.6 -7.6C-37.8 -7 -37.6 -5 -36.2 -3.8C-35 -2.8 -33.4 -2.4 -32 -2.4L-24 -.6L-33.6 1.8C-35 2.2 -35.6 3.4 -35 4.4C-33.6 6.4 -29.6 7.4 -25 7.6C-20 7.8 -14 8 -9 7C-5 6.2 -2 5 0 3.2Z" fill="#151314"/><path class="l" d="M0 -3.2C-3 -6.4 -7 -8.8 -12 -9.4C-16 -9.8 -20 -9.6 -23 -8.4C-26 -7.2 -29 -6.4 -32 -6.6C-34 -6.8 -35.6 -8 -36.6 -7.6C-37.8 -7 -37.6 -5 -36.2 -3.8C-35 -2.8 -33.4 -2.4 -32 -2.4L-24 -.6L-33.6 1.8C-35 2.2 -35.6 3.4 -35 4.4C-33.6 6.4 -29.6 7.4 -25 7.6C-20 7.8 -14 8 -9 7C-5 6.2 -2 5 0 3.2Z"/>
<path class="l" d="M-22.6 -4.6C-21 -6.4 -17.6 -6.6 -15.6 -5.2C-14.6 -4.6 -13.4 -4.2 -12 -4.2C-13.6 -3 -15.4 -2.6 -17.2 -2.8C-19.4 -3 -21.4 -3.6 -22.6 -4.6Z"/><circle class="pf" cx="-18.6" cy="-4.4" r="1"/>
<path class="l" d="M-24 -.6C-20 1.6 -15 2.2 -11 1C-8.6 .2 -8 -2.2 -9.8 -2.8C-11.2 -3.2 -12 -1.8 -11 -1.2M-33.6 -6.6C-33 -5.6 -32.2 -5.2 -31.4 -5.4"/>
<path class="pf" d="M-30.6 -2.2L-29.6 .2L-28.8 -1.9ZM-27 -1.4L-26.2 .4L-25.4 -1.1ZM-31.6 1.6L-30.8 -.6L-29.9 1.3Z"/>
<path class="t" style="stroke-opacity:.9" d="M-6 -6.6C-4 -4.2 -2.6 -1.6 -2 1.2M-10 -8.6C-8 -6 -6.8 -3 -6.4 0"/>
</g>`;

// ---- The stop mark: a round shield, viewBox 0 0 400 400 (HTML, replaces stoneSvg). Use kind B. ----
// round shield stop mark, viewBox 0 0 400 400 (HTML, like the stone it replaces)
const RUNE = { l: 'M170 120V290L235 240', h: 'M160 110V290M240 110V290M160 170L240 230', m: 'M150 110V290M250 110V290M150 110L250 210M250 110L150 210', i: 'M200 110V290' };
// A: plain painted face; B: quartered (two opposite quarters painted)
const shield = (kind, colour, visited, runeKey) => {
  const face = visited ? colour : '#151314';
  const planks = [-120, -72, -24, 24, 72, 120].map(x => { const h = Math.sqrt(176 * 176 - x * x); return `M${200 + x} ${200 - h}V${200 + h}`; }).join('');
  let paint = '';
  if (kind === 'B') paint = visited ? `<path d="M200 200L200 24A176 176 0 0 1 376 200ZM200 200L200 376A176 176 0 0 1 24 200Z" fill="${colour}"/>` : '';
  const faceFill = kind === 'B' ? '#151314' : face;
  const rune = runeKey && kind === 'A' ? `<path d="${RUNE[runeKey]}" fill="none" stroke="#F7F6F3" stroke-width="22" stroke-linecap="round" stroke-linejoin="round" opacity="${visited ? .95 : .9}" transform="translate(0 -6) scale(1 .62) translate(0 ${-200 * .62 + 200 / .62 * .38 + 40})"/>` : '';
  return `<svg viewBox="0 0 400 400" width="100%" height="100%" style="overflow:visible">
  <ellipse cx="200" cy="392" rx="120" ry="10" fill="#000" opacity=".35"/>
  <circle cx="200" cy="200" r="176" fill="${faceFill}"/>${paint}
  <path d="${planks}" stroke="${visited ? '#151314' : '#F7F6F3'}" stroke-opacity="${visited ? .35 : .28}" stroke-width="7"/>
  <circle cx="200" cy="200" r="176" fill="none" stroke="#F7F6F3" stroke-width="20"/>
  <circle cx="200" cy="200" r="54" fill="#151314" stroke="#F7F6F3" stroke-width="16"/>
  <circle cx="186" cy="186" r="12" fill="#F7F6F3" opacity=".55"/>
  ${[0, 45, 90, 135, 180, 225, 270, 315].map(a => `<circle cx="${200 + Math.cos(a * Math.PI / 180) * 176}" cy="${200 + Math.sin(a * Math.PI / 180) * 176}" r="9" fill="#151314" stroke="#F7F6F3" stroke-width="5"/>`).join('')}
  </svg>`;
};

// ---- Toronto from the lake, base line at (368, 752) ----
// Toronto from the lake, west on the left. Base line y = 0, x in map units from the left end; heights at 0.105 units per metre.
const k = 0.105, H = m => +(m * k).toFixed(1);
const TORONTO_FACTS = { cn: 553.3, cnMain: 346, cnSky: 447, cnMastFoot: 457, rogers: 86, fcp: 298, scotia: 275, cibc: 241, ccw: 239, td: 223, bac: 218, brookfield: 207, rbp: 180 };
const box = (x, w, h, extra = '', cls = 'g') => `<path class="${cls}" d="M${x} 0V${-h}H${x + w}V0"/>${extra}`;
const rows = (x, w, h, step, inset = 1) => { let d = ''; for (let y = -step; y > -h + 1.5; y -= step) d += `M${x + inset} ${y.toFixed(1)}H${(x + w - inset).toFixed(1)}`; return `<path class="t" d="${d}"/>`; };
const cols = (x, w, h, n) => { let d = ''; for (let i = 1; i < n; i++) d += `M${(x + w * i / n).toFixed(1)} -1V${(-h + 1).toFixed(1)}`; return `<path class="t" d="${d}"/>`; };
function toronto() {
  const F = TORONTO_FACTS; let s = '';
  // a back row of towers, thin and dim, for depth: CityPlace by the tower's foot, and towers behind the core
  const back = [[18.5, 4, 15], [30.5, 4, 18], [33.6, 3.4, 13.5], [40.5, 4.2, 23], [52, 3.6, 26.5], [60.5, 4, 21], [77, 3.6, 24], [86, 4.2, 20], [101, 4, 17.5], [111, 3.6, 14]];
  s += `<path class="t" d="${back.map(([bx, bw, bh]) => `M${bx} 0V${-bh}H${bx + bw}V0`).join('')}"/>`;
  // Rogers Centre: a low dome on a drum, west of the tower
  s += `<path class="g" d="M0 0V-4.6Q10 -${H(F.rogers) + 2.4} 20 -4.6V0Z"/><path class="t" d="M0 -4.6H20M3.4 -7Q10 -10.6 16.6 -7"/>`;
  // CN Tower at x = 26: Y-shaped base, tapering shaft, main pod, SkyPod, mast
  const cx = 26, top = H(F.cn), main = H(F.cnMain), sky = H(F.cnSky), mast = H(F.cnMastFoot);
  s += `<path class="g" d="M${cx - 4.2} 0C${cx - 2.6} -6 ${cx - 1.5} -16 ${cx - 1.2} -${main - 2}H${cx + 1.2}C${cx + 1.5} -16 ${cx + 2.6} -6 ${cx + 4.2} 0Z"/>`;
  s += `<path class="t" d="M${cx} -1V-${main - 2.4}"/>`;
  s += `<path class="g" d="M${cx - 3.8} -${main - 1.2}Q${cx - 4.6} -${main + .6} ${cx - 3} -${main + 1.6}H${cx + 3}Q${cx + 4.6} -${main + .6} ${cx + 3.8} -${main - 1.2}Z"/><path class="t" d="M${cx - 4.1} -${main}H${cx + 4.1}"/>`;
  s += `<path class="g" d="M${cx - .9} -${main + 1.6}V-${sky - .8}H${cx + .9}V-${main + 1.6}"/>`;
  s += `<path class="g" d="M${cx - 1.7} -${sky - .8}H${cx + 1.7}V-${sky + 1}H${cx - 1.7}Z"/>`;
  s += `<path class="l" d="M${cx} -${sky + 1}V-${mast}"/><path class="l" d="M${cx} -${mast}V-${top}" stroke-opacity=".8"/>`;
  // the financial district, west to east
  let x = 36;
  // Royal Bank Plaza: sawtooth facade
  s += `<path class="g" d="M${x} 0V-${H(F.rbp)}L${x + 1.6} -${H(F.rbp) + .6}L${x + 3.2} -${H(F.rbp)}L${x + 4.8} -${H(F.rbp) + .6}L${x + 6.4} -${H(F.rbp)}V0"/>` + `<path class="t" d="M${x + 1.6} -1V-${H(F.rbp)}M${x + 4.8} -1V-${H(F.rbp)}"/>`; x += 7.6;
  // Brookfield Place, Bay Wellington Tower: stepped top
  s += `<path class="g" d="M${x} 0V-${H(F.brookfield) - 2}H${x + 1}V-${H(F.brookfield)}H${x + 5}V-${H(F.brookfield) - 2}H${x + 6}V0"/>` + rows(x, 6, H(F.brookfield) - 2, 2.4); x += 7.2;
  // TD Bank Tower: the black box
  s += box(x, 7, H(F.td), '', 'o') + cols(x, 7, H(F.td), 5) + rows(x, 7, H(F.td), 1.8, .5); x += 8.2;
  // First Canadian Place: the tallest, slim and white, chamfered corners
  s += `<path class="g" d="M${x} 0V-${H(F.fcp) - .8}L${x + .8} -${H(F.fcp)}H${x + 5.6}L${x + 6.4} -${H(F.fcp) - .8}V0"/><path class="t" d="M${x + .8} -1V-${H(F.fcp)}M${x + 5.6} -1V-${H(F.fcp)}"/>`; x += 7.6;
  // Commerce Court West: recessed crown band
  s += box(x, 6, H(F.ccw)) + `<path class="t" d="M${x} -${H(F.ccw) - 1.6}H${x + 6}M${x} -${H(F.ccw) - 2.2}H${x + 6}"/>` + cols(x, 6, H(F.ccw) - 2.4, 4); x += 7.2;
  // Scotia Plaza: the notched, chevron crown and a wider foot
  const sp = H(F.scotia);
  s += `<path class="g" d="M${x} 0V-${sp - 3}L${x + 1.4} -${sp - 1.4}V-${sp}L${x + 3.6} -${sp - 2.4}L${x + 5.8} -${sp}V-${sp - 1.4}L${x + 7.2} -${sp - 3}V0"/>` + cols(x, 7.2, sp - 3, 3); x += 8.4;
  // Bay Adelaide Centre West: a small setback
  s += `<path class="g" d="M${x} 0V-${H(F.bac) - 1.4}H${x + .8}V-${H(F.bac)}H${x + 5.2}V-${H(F.bac) - 1.4}H${x + 6}V0"/>` + rows(x, 6, H(F.bac) - 1.4, 2.2); x += 7.2;
  // CIBC Square: diagonal bracing, east by the rail lands
  s += box(x, 6.4, H(F.cibc)) + `<path class="t" d="M${x} -2L${x + 6.4} -8M${x} -9L${x + 6.4} -15M${x} -16L${x + 6.4} -22"/>`; x += 7.6;
  // lower towers to the east
  [[12, 4.2], [16, 4.6], [10, 5]].forEach(([h, w]) => { s += box(x, w, h) + rows(x, w, h, 1.6, .6); x += w + 1.2; });
  // the shoreline in front
  s += `<path class="l" d="M-4 0H${x + 4}"/><path class="t" d="M2 2.6q2.4 -1.8 4.8 0t4.8 0M${x - 20} 2.6q2.4 -1.8 4.8 0t4.8 0t4.8 0"/>`;
  return { svg: s, width: x };
}

module.exports = { yggdrasil, CROWN, LAYERS, jormungandr, RING, SURF, W, HEAD, shield, toronto, TORONTO_FACTS };
if (require.main === module) {
  const T = toronto();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="1200" height="1800"><style>.l,.o,.g,.pf,.t{stroke:#F7F6F3;stroke-width:1.1;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}.l{fill:none}.o{fill:#151314}.g{fill:#1F1C1D}.pf{fill:#F7F6F3}.t{fill:none;stroke-opacity:.5;stroke-width:.7}</style><rect width="600" height="900" fill="#151314"/>${jormungandr()}${HEAD}${yggdrasil(304, 374)}<g transform="translate(368 752)">${T.svg}</g><g transform="translate(40 820) scale(.1)">${shield('B', '#EAA41E', true)}</g><g transform="translate(90 820) scale(.1)">${shield('B', '#EAA41E', false)}</g></svg>`;
  require('fs').writeFileSync(require('path').join(__dirname, 'drawings-preview.svg'), svg);
  console.log('wrote drawings-preview.svg');
}
