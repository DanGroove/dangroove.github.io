// Jörmungandr options, in map coordinates (600 x 900). Classes: .l .o .g .pf .t  (jd = close-up-only detail, the page's tier 2)
const INK = '#151314', PAPER = '#F7F6F3';
const RING0 = [[500,101],[524,106],[546,122],[558,150],[563,190],[562,240],[560,290],[563,340],[563,390],[562,440],[563,490],[563,535],[552,572],[524,604],[484,622],[440,626],[396,622],[350,614],[300,618],[252,624],[204,618],[160,600],[124,572],[98,532],[80,490],[62,446],[56,400],[56,350],[56,300],[62,252],[76,206],[98,166],[128,132],[168,116],[214,112],[262,116],[312,120],[362,113],[410,108],[444,105],[468,102.5]];
const SURF = [[0,0.085],[0.235,0.29],[0.43,0.5],[0.655,0.715],[0.885,1]];
const n1 = v => +v.toFixed(1);
const spline = (P, seg = 10) => { const n = P.length, out = [], g = i => P[Math.max(0, Math.min(n - 1, i))]; for (let i = 0; i < n - 1; i++) { const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2); for (let j = 0; j < seg; j++) { const t = j / seg, t2 = t * t, t3 = t2 * t; out.push([0, 1].map(k => .5 * (2 * p1[k] + (p2[k] - p0[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2 + (3 * p1[k] - p0[k] - 3 * p2[k] + p3[k]) * t3))); } } out.push(P[n - 1]); return out; };
function track(ring) {
  const S = spline(ring), cum = [0]; for (let i = 1; i < S.length; i++) cum.push(cum[i - 1] + Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1]));
  const L = cum.at(-1);
  const at = u => { u = Math.max(0, Math.min(L, u)); let i = 1; while (i < cum.length - 1 && cum[i] < u) i++; const a = S[i - 1], b = S[i], q = (u - cum[i - 1]) / (cum[i] - cum[i - 1] || 1), dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return { x: a[0] + dx * q, y: a[1] + dy * q, tx: dx / l, ty: dy / l }; };
  return { L, at };
}
const P = pts => pts.map((p, i) => (i ? 'L' : 'M') + n1(p[0]) + ' ' + n1(p[1])).join('');
function ribbon(T, u0, u1, wf, step = 2.5) { const left = [], right = [], mid = [], us = []; const n = Math.max(2, Math.ceil((u1 - u0) / step)); for (let i = 0; i <= n; i++) { const u = u0 + (u1 - u0) * i / n, p = T.at(u), w = wf(u) / 2; left.push([p.x - p.ty * w, p.y + p.tx * w]); right.push([p.x + p.ty * w, p.y - p.tx * w]); mid.push([p.x, p.y, p.tx, p.ty, w]); us.push(u); } return { left, right, mid, us }; }
const ripple = (x, y, k = 1) => `<path class="t" d="M${n1(x)} ${n1(y)}q${n1(2.4 * k)} -2 ${n1(4.8 * k)} 0t${n1(4.8 * k)} 0"/>`;
const sub = (T, a, b, wf) => { const e = ribbon(T, a, b, wf, 4); return `<path d="${P([...e.left, ...e.right.slice().reverse()])}Z" fill="${INK}" opacity=".55"/><path d="${P(e.left)}${P(e.right)}" fill="none" stroke="${PAPER}" stroke-opacity=".22" stroke-width=".8" stroke-dasharray="3 2.2" vector-effect="non-scaling-stroke"/>`; };

// the file, its name tag and the stamp (shared by the strip)
function fileArt(f) {
  if (!f) return '';
  const [x, y] = f.at, r = f.rot || 0; let s = `<g class="jf" transform="translate(${x} ${y}) rotate(${r})">`;
  s += `<path class="o" d="M-6 -7.5H2.5L6 -4V7.5H-6Z"/><path class="l" d="M2.5 -7.5V-4H6"/><path class="t" d="M-3.4 -2H3.4M-3.4 .8H3.4M-3.4 3.6H1"/>`;
  if (f.stamp) s += `<g transform="translate(.5 1.2) rotate(-14)"><rect class="o" x="-11.5" y="-3.4" width="23" height="6.8" rx="1"/><rect class="t" x="-10.6" y="-2.5" width="21.2" height="5" rx=".5"/><text text-anchor="middle" y="1.55" font-family="Outfit" font-size="4.3" font-weight="800" letter-spacing=".7" fill="${PAPER}">SHIPPED</text></g>`;
  s += `</g>`;
  if (f.name) { const [a, b, c] = f.name; s += `<text class="jf-name" x="${x + (f.nameDx || 0)}" y="${y - 11.5 + (f.nameDy || 0)}" text-anchor="middle" font-family="Outfit" font-size="${f.size || 5}" fill="${PAPER}" font-weight="500">${a}<tspan font-weight="800" text-decoration="underline">${b || ''}</tspan>${f.caret ? `<tspan fill="#FF8A4C" font-weight="300">|</tspan>` : ''}${c || ''}</text>`; }
  if (f.spit) s += `<path class="l" d="M${x + 9} ${y + 3}l4 1.2M${x + 9.5} ${y - 1}l4.6 -.6M${x + 10} ${y + 7}l3.4 2.4"/>`;
  return s;
}
// the lump with the file's outline, riding the body at u
function lumpArt(T, u, w) { const p = T.at(u), a = Math.atan2(p.ty, p.tx) * 180 / Math.PI; return `<g transform="translate(${n1(p.x)} ${n1(p.y)}) rotate(${n1(a)})"><path class="o" d="M-3.6 -4.6H1.4L3.6 -2.4V4.6H-3.6Z" transform="rotate(90)"/><path class="t" d="M-2 -1.6V1.6M0 -1.6V1.6" /></g>`; }

function build(opt, st = {}) {
  const O = OPTS[opt], ring = RING0.slice(3, st.open ? -2 : -1); ring.unshift(...O.lead); ring.push(...(st.open ? O.tailOpen : O.tailEnd));
  const T = track(ring), L = T.L, base = O.w;
  const lumpU = st.lump;
  const wf = u => { const t = u / L; let w = base * (t < 0.9 ? 1 : 1 - (t - 0.9) / 0.1 * 0.8) * (1 + O.neck * Math.exp(-u / 30)); if (lumpU != null) w += 9 * Math.exp(-((u - lumpU) ** 2) / 70); return w; };
  let body = '<g class="jo-body">';
  body += sub(T, 0, L - 4, u => wf(u) * .75);
  SURF.forEach(([a, b], si) => { const u0 = a * L, u1 = Math.min(b * L, L);
    const end = u => { const d = Math.min(si === 0 ? 1e9 : u - u0, si === SURF.length - 1 ? 1e9 : u1 - u); return .35 + .65 * Math.sin(Math.PI / 2 * Math.min(1, d / 22)); };
    body += O.stretch(T, u0, u1, u => wf(u) * end(u), si);
    [si ? u0 : null, si < SURF.length - 1 ? u1 : null].forEach(u => { if (u == null) return; const p = T.at(u); body += ripple(p.x - 7, p.y + 1) + `<g class="jd">${ripple(p.x - 4, p.y + 4.5, .7)}</g>`; });
  });
  if (lumpU != null) body += lumpArt(T, lumpU);
  body += '</g>';
  const head = `<g class="jo-head" transform="translate(${O.at[0]} ${O.at[1]})">${O.head(st)}</g>` + fileArt(st.file);
  return { body, head };
}

// ---------- A: the carved serpent (Urnes-style ribbon beast) ----------
const A = { w: 9, neck: 1.25, at: [500, 101], lead: [[510, 101], [530, 101.4], [545, 108], [554, 126]], tailEnd: [[462, 103.6], [482, 104.4]], tailOpen: [[434, 107.5], [443, 116], [442, 129]],
  stretch(T, u0, u1, wf) { const e = ribbon(T, u0, u1, wf); let s = `<path class="o" d="${P([...e.left, ...e.right.slice().reverse()])}Z"/>`;
    const inn = k => e.mid.map(m => [m[0] - m[3] * m[4] * k, m[1] + m[2] * m[4] * k]); s += `<path class="t" d="${P(inn(.5))}${P(inn(-.5))}"/>`;
    let d = '<g class="jd">'; e.mid.forEach((m, i) => { if (i % 2 === 1 && m[4] > 2.2) d += `<circle class="pf" cx="${n1(m[0])}" cy="${n1(m[1])}" r=".55" stroke="none"/>`; }); 
    // collar bands every ~46 units
    let bands = ''; e.mid.forEach((m, i) => { if (i % 18 === 14 && m[4] > 2.5) { [-1.3, 1.3].forEach(o => { const cx = m[0] + m[2] * o, cy = m[1] + m[3] * o; bands += `M${n1(cx - m[3] * m[4])} ${n1(cy + m[2] * m[4])}L${n1(cx + m[3] * m[4])} ${n1(cy - m[2] * m[4])}`; }); } });
    return s + d + '</g>' + `<path class="l" d="${bands}"/>`; },
  head(st) { const j = -(st.jaw || 0);
    return `
<g class="jo-jaw" transform="rotate(${j} 8 8)"><path fill="${INK}" d="M-12 2.5L-40 6C-43.6 6.4 -45.4 8 -44.6 9.8C-43 12.2 -37 12.8 -31 12.6C-21 12.4 -10 12 0 10.6C10 9.4 20 8.6 32 8L32 0Z"/><path class="l" d="M-12 2.5L-40 6C-43.6 6.4 -45.4 8 -44.6 9.8C-43 12.2 -37 12.8 -31 12.6C-21 12.4 -10 12 0 10.6C6 9.9 11 9.4 16 9"/><path class="l" d="M-43 11C-46 13 -47.6 16.6 -45 18.4C-43 19.8 -40.4 18 -41.4 16.2C-42.2 15 -43.8 15.6 -43.4 16.8"/><path class="pf" d="M-38.6 5.7L-37.4 1.8L-36 5.4Z"/><g class="jd"><path class="t" d="M-36 9.6C-28 10.4 -16 10 -4 8.2"/></g></g>
<path fill="${INK}" d="M33 -8C25 -14.6 13 -18.4 1 -17.8C-9 -17.2 -17 -13.6 -25 -10.2C-33 -7 -41 -7.6 -47 -8.8C-51 -9.6 -54.6 -7.2 -54 -3.8C-53.6 -1.2 -51 .4 -48 .2L-40 -.2C-32 -.8 -22 .4 -12 2.5L33 8Z"/>
<path class="l" d="M33 -8C25 -14.6 13 -18.4 1 -17.8C-9 -17.2 -17 -13.6 -25 -10.2C-33 -7 -41 -7.6 -47 -8.8C-51 -9.6 -54.6 -7.2 -54 -3.8C-53.6 -1.2 -51 .4 -48 .2L-40 -.2C-32 -.8 -22 .4 -12 2.5"/>
<path class="l" d="M-46.4 -8.7C-50.6 -10.4 -55.6 -13.4 -54.6 -18C-53.8 -21.2 -49 -21 -49 -17.6C-49 -15.6 -51.6 -15.4 -51.8 -17.2"/>
<path class="pf" d="M-47.6 0L-46 5.6L-44 -.1ZM-41 -.2L-39.9 3.4L-38.6 -.3ZM-34.6 -.5L-33.7 2.4L-32.6 -.3Z"/>
<path class="l" d="M-28.5 -7.2C-24 -12.2 -15 -12.8 -9.6 -8C-14 -4.2 -23 -3.8 -28.5 -7.2Z"/><circle class="pf" cx="-17.6" cy="-8.2" r="1.7"/>
<path class="l" d="M-31 -9.4C-25 -15.4 -12 -16.2 -5 -10.4"/>
<path class="l" d="M-12 2.5C-6 5.2 1 4.4 2.2 0C3 -3.4 -1.6 -5 -3.4 -2.4C-4.6 -.6 -2.8 1 -1.6 .2"/>
<path fill="${INK}" d="M-7 -16.6C0 -28 13 -35 25 -33C32 -31.8 34.6 -25.6 31 -22.6C24.6 -27.6 14 -24 9 -16Z"/><path class="l" d="M-7 -16.6C0 -28 13 -35 25 -33C32 -31.8 34.6 -25.6 31 -22.6C28.4 -20.6 25 -22.6 26.2 -25.4C27 -27.2 29.6 -26.8 29.2 -25M9 -16.4C13 -22.6 19 -26.6 25.6 -27.2"/>
<path class="l" d="M14 -15.2C19 -20 25 -21.4 30.6 -19.2C33.4 -18 33.2 -14.6 30.8 -14.4"/>
<path class="l" d="M16 9C22 8.6 28 8.2 33 8"/><path class="l" d="M19 -13.4C23 -5 23 3 20 9.6M25.4 -11.2C28.6 -4 28.6 2 26 8.8"/>
<g class="jd"><circle class="pf" cx="23.6" cy="-6" r=".7"/><circle class="pf" cx="24.6" cy="-1" r=".7"/><circle class="pf" cx="24" cy="4" r=".7"/><path class="t" d="M-44 -5.4C-36 -4 -30 -4.6 -24 -7M2 -14.6C8 -13.6 13 -11 17 -7.6M3 -24C8 -28 14 -30 21 -30"/><path class="t" d="M-50.4 -5.6C-49.6 -4.6 -48.6 -4.4 -47.8 -4.8"/></g>`; },
};

// ---------- B: the sea-chart beast (rears out of the water in humps) ----------
const B = { w: 8, neck: 0, at: [500, 101], lead: [[528, 103], [548, 117]], tailEnd: [[462, 104.4], [482, 104.6]], tailOpen: [[434, 108], [443, 117], [442, 129]],
  stretch(T, u0, u1, wf, si) { let s = ''; const L = T.L;
    if (si === 0) u0 = 34; let tailFrom = null; if (si === 4) { tailFrom = L - 50; u1 = tailFrom - 6; }
    const n = Math.max(1, Math.round((u1 - u0) / 36)), len = (u1 - u0) / n, gap = 7;
    for (let i = 0; i < n; i++) { const a = T.at(u0 + i * len + gap / 2), b = T.at(u0 + (i + 1) * len - gap / 2), m = T.at(u0 + (i + .5) * len); let nx = m.ty, ny = -m.tx; if (Math.abs(m.tx) > .6 ? ny > 0 : (nx * (m.x - 300) < 0)) { nx = -nx; ny = -ny; }
      const k = Math.min(1, wf((u0 + (i + .5) * len)) / 8), h = (Math.abs(m.tx) > .6 ? 21 : 15) * k, th = 8.4 * k, cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2, dx = (b.x - a.x), dy = (b.y - a.y), l = Math.hypot(dx, dy), ux = dx / l, uy = dy / l;
      const q = (t, hh, inset) => { const ax = a.x + ux * inset, ay = a.y + uy * inset, bx = b.x - ux * inset, by = b.y - uy * inset, qx = cx + nx * hh, qy = cy + ny * hh; return [(1 - t) ** 2 * ax + 2 * t * (1 - t) * qx + t * t * bx, (1 - t) ** 2 * ay + 2 * t * (1 - t) * qy + t * t * by]; };
      const outer = [], inner = []; for (let j = 0; j <= 12; j++) { outer.push(q(j / 12, h, 0)); inner.push(q(j / 12, h - th * 2, th * .9)); }
      s += `<path class="o" d="${P([...outer, ...inner.reverse()])}Z"/>`;
      let sp = '', bd = ''; for (let j = 2; j <= 10; j++) { const p0 = q((j - .32) / 12, h, 0), p1 = q((j + .32) / 12, h, 0), pm = q(j / 12, h, 0), hgt = 2.6 * k * Math.sin(Math.PI * j / 12); sp += `M${n1(p0[0])} ${n1(p0[1])}L${n1(pm[0] + nx * hgt - ux * .8)} ${n1(pm[1] + ny * hgt - uy * .8)}L${n1(p1[0])} ${n1(p1[1])}`; }
      for (let j = 1; j <= 11; j++) { const o = q(j / 12, h, 0), ii = q(j / 12, h - th * 2, th * .9); bd += `M${n1(ii[0])} ${n1(ii[1])}L${n1(ii[0] + (o[0] - ii[0]) * .45)} ${n1(ii[1] + (o[1] - ii[1]) * .45)}`; }
      s += `<path class="l" d="${sp}"/><g class="jd"><path class="t" d="${bd}"/></g>` + ripple(a.x - 6, a.y + 1.2) + ripple(b.x - 6, b.y + 1.2) + `<g class="jd">${ripple(cx - 5, cy + 3, .8)}</g>`;
    }
    if (tailFrom != null) { const e = ribbon(T, tailFrom, L, u => 6.6 * (.3 + .7 * (L - u) / 50) * (.1 + .9 * Math.sin(Math.PI / 2 * Math.min(1, (u - tailFrom) / 20)))); const p = T.at(tailFrom); s += `<path class="o" d="${P([...e.left, ...e.right.slice().reverse()])}Z"/>` + ripple(p.x - 8, p.y + 2) + `<g class="jd">${ripple(p.x - 4, p.y + 5, .7)}</g>`; }
    return s; },
  head(st) { const j = -(st.jaw || 0);
    return `
<path fill="${INK}" d="M57 15C54 -3 42 -14 27 -16.4L20 7C28 5 35 7 39 15Z"/><path class="l" d="M57 15C54 -3 42 -14 27 -16.4M20 7C28 5 35 7 39 15"/>
<path class="l" d="M53.6 3.4L58.6 0L56.4 8.4M48 -6.6L52 -11.4L52 -2M40 -12.6L41.4 -16.4L45 -9.8M31.4 -15.6L33 -21.8L36.4 -14"/>
<g class="jo-jaw" transform="rotate(${j} -4 6)"><path fill="${INK}" d="M-10 3L-42 6.6C-46 7 -48.4 9.2 -47 11.4C-44.4 14.6 -36 15.6 -28 15.2C-16 14.6 -4 13.4 6 10.4C12 8.6 18 7 24 6.4L24 -2Z"/><path class="l" d="M-10 3L-42 6.6C-46 7 -48.4 9.2 -47 11.4C-44.4 14.6 -36 15.6 -28 15.2C-16 14.6 -4 13.4 6 10.4C12 8.6 18 7 23 6.6"/><path class="pf" d="M-40.4 6.3L-39.2 2L-37.6 6ZM-33 5.5L-32 2.8L-30.8 5.3Z"/><path class="l" d="M-41 14C-42 19 -46.6 21.6 -50 19.6M-34 15C-33.6 20.4 -37 24.6 -41.6 24.4"/><g class="jd"><path class="t" d="M-40 10.6H-36M-33 11.2H-28M-24 11.4H-18M-14 10.8L-8 10M-4 9.4L2 8"/></g></g>
<path class="o" d="M2 -17L7 -34Q12.6 -27.6 15.6 -32Q19.6 -25.4 23.6 -28.6Q26 -22 30.6 -23Q30 -17.4 34.6 -15.4L21 -11.4Z"/><path class="t" d="M9 -17L7.6 -32M12 -17L15.4 -30.4M15 -17L23.2 -27.4M18 -16.6L29.6 -22M22 -15.6L33 -15.6"/><path fill="${INK}" d="M27 -16.4C17 -19.6 6 -19.4 -2 -16.4C-8 -14.2 -12 -11.2 -18 -9.8C-28 -7.8 -37 -10.6 -45 -9C-51 -7.8 -54.4 -4.6 -52.6 -1.4C-51.6 .4 -49 .9 -46 .6L-22 .8L-10 3L24 7Z"/>
<path class="l" d="M27 -16.4C17 -19.6 6 -19.4 -2 -16.4C-8 -14.2 -12 -11.2 -18 -9.8C-28 -7.8 -37 -10.6 -45 -9C-51 -7.8 -54.4 -4.6 -52.6 -1.4C-51.6 .4 -49 .9 -46 .6L-22 .8L-10 3"/>
<path class="pf" d="M-47.4 .6L-45.6 6.4L-43.6 .6ZM-40.6 .7L-39.6 3.6L-38.4 .7ZM-35 .7L-34 3.2L-33 .7ZM-29.6 .7L-28.6 3L-27.6 .7ZM-24 .8L-22.6 5.4L-21 1Z"/>
<path class="l" d="M-49.6 -5.4C-48.4 -6.8 -46.4 -6.6 -46 -5"/>
<circle class="l" cx="-11" cy="-8.8" r="3.3"/><circle class="pf" cx="-11.8" cy="-8.8" r="1.5"/><path class="l" d="M-19.6 -10.6C-15.6 -15 -8 -15.4 -3.4 -11.6"/>
<path class="l" d="M-10 3C-5 5.4 0 4.6 3 1.6"/>

<g class="jd"><path class="t" d="M22 -9Q25 -6.4 22 -3.6M29 -8Q32 -5 29.4 -2M36 -5Q39 -2 36.6 1.4M25 -1Q28 2 25 5M32 1Q35 4 32.6 7.6M40 3Q43 6 41 9.6M44 -3Q47 0 45 3.6M48 6Q50.6 9 49 12.6"/><path class="t" d="M-44 -5.6C-36 -5 -28 -5.6 -22 -7.6"/></g>
${ripple(31, 15.6)}${ripple(46, 17.6)}<g class="jd">${ripple(38, 20, .8)}<path class="t" d="M36 12.4l-1.6 -2.6M60.4 12.6l2 -2.4"/></g>`; },
};

// ---------- C: the adder from above (plan view, like the map itself) ----------
const C = { w: 11, neck: .15, at: [500, 104], lead: [[510, 104], [532, 107], [550, 125]], tailEnd: [[452, 104], [464, 104]], tailOpen: [[430, 108], [438, 117], [436, 129]],
  stretch(T, u0, u1, wf) { const e = ribbon(T, u0, u1, wf, 3); let s = `<path class="o" d="${P([...e.left, ...e.right.slice().reverse()])}Z"/>`;
    const zz = e.mid.map((m, i) => { const k = (i % 2 ? .46 : -.46); return [m[0] - m[3] * m[4] * k, m[1] + m[2] * m[4] * k]; }); s += `<path class="l" d="${P(zz)}"/>`;
    let d = '<g class="jd">'; e.mid.forEach((m, i) => { if (m[4] < 2.6) return; const k = (i % 2 ? -.66 : .66); d += `<circle class="pf" cx="${n1(m[0] - m[3] * m[4] * k)}" cy="${n1(m[1] + m[2] * m[4] * k)}" r=".5" stroke="none"/>`; }); return s + d + '</g>'; },
  head(st) { return `
<path class="o" d="M-2 -13.6C8 -22 20 -26 31 -24.6C25 -22.6 18 -18 13 -10.6ZM-2 13.6C8 22 20 26 31 24.6C25 22.6 18 18 13 10.6Z"/>
<path class="o" d="M-51 0C-51 -5 -45 -8.2 -37 -9.4C-27 -11 -17 -16 -6 -15.4C4 -15 12 -9.6 25 -7L25 7C12 9.6 4 15 -6 15.4C-17 16 -27 11 -37 9.4C-45 8.2 -51 5 -51 0Z"/>
<path class="l" d="M-30 -9.6C-26 -13 -19 -13.4 -15 -10.4C-18 -6.4 -26 -6 -30 -9.6ZM-30 9.6C-26 13 -19 13.4 -15 10.4C-18 6.4 -26 6 -30 9.6Z"/>
<path class="pf" d="M-25.6 -10.6L-19 -9.4L-25.4 -8.6ZM-25.6 10.6L-19 9.4L-25.4 8.6Z"/>
<path class="l" d="M-46.4 -3.2l1.6 .8M-46.4 3.2l1.6 -.8"/>
<path class="l" d="M22 -5.4L4 -9.4L-10 0L4 9.4L22 5.4M-10 0H-34"/>
<path class="l" d="M-34 0L-40 -5M-34 0L-40 5"/>
<g class="jd"><path class="t" d="M-2 -5.6L8 0L-2 5.6M10 -6.6L18 0L10 6.6M-36 -9.4C-38 -6 -38 -3 -36 0M-36 9.4C-38 6 -38 3 -36 0M-8 -15.2C-6 -11 -2 -9 4 -9.4M-8 15.2C-6 11 -2 9 4 9.4"/><path class="t" d="M6 -17.6C12 -20.6 18 -22.4 24 -23M6 17.6C12 20.6 18 22.4 24 23"/></g>`; },
};
const OPTS = { A, B, C };
const CSS = `.l,.o,.g,.pf,.t{stroke:${PAPER};stroke-width:1.1;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke}.l{fill:none}.o{fill:${INK}}.g{fill:#1F1C1D}.pf{fill:${PAPER}}.t{fill:none;stroke-opacity:.5;stroke-width:.7}`;
const standalone = (opt, st) => { const b = build(opt, st); return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900"><!-- Jörmungandr option ${opt}. Map coordinates. .jo-body goes in #b-sea, .jo-head in #finds. g.jd = close-up-only detail (tier 2). --><style>${CSS}</style><rect width="600" height="900" fill="${INK}"/>${b.body}${b.head}</svg>`; };
module.exports = { build, standalone, OPTS };
if (require.main === module) { const fs = require('fs'); for (const k of 'ABC') fs.writeFileSync(__dirname + '/jormungandr-' + k + '.svg', standalone(k)); }
