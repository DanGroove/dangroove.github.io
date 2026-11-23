// The star canvas: hero field, the hand-off into trail dots, sea sparkle, the rush and the blast.
// On the joined page (join.mjs) the list is built from the real hero's stars instead of the stand-in field.
import { STARS, C, MAP, NOVA, DEPTH } from './data.mjs';
import { rnd, onLand, COAST_A, COAST_B, polyLen } from './art.mjs';
import { TRAIL_DOTS, VIEW, toScreen, smooth, lerp, clamp01, easeIO } from './trip.mjs';
import { depthFrameBox, depthFrameCovers, novaRingRadius, novaFlare, novaShare, NOVA_LIVE } from './depth.mjs';

const SK = { cv: null, ctx: null, dpr: 1, list: [], trav: null, src: null, n: -1, standN: 0, seaN: 0, keepP: .3, bins: new Map(), tails: new Map(), pt: [0, 0], drift: 0, orbit: 0, burn: 0, skyPointer: [0.5, 0.5], skyCount: 0, tuning: '', assignment: '', skyVisible: false };
const HERO_MOST = 2000;

export function starsBuild(canvas) {
  SK.cv = canvas; SK.ctx = canvas.getContext('2d');
  const r = rnd(7), nDots = TRAIL_DOTS.length, n = Math.max(STARS.count, nDots + 60);
  const list = [];
  for (let i = 0; i < n; i++) list.push({ hx: r(), hy: r(), z: .25 + r() * .75, r: .5 + r() * 1.1, a: .35 + r() * .6, red: r() < STARS.red, ang: r() * Math.PI * 2, far: r(), sgn: r() < .5 ? -1 : 1, keep: r() < .3, kr: r(), ord2: r() });
  // red stars go to the sea; the rest are shuffled onto trail dots
  const order = list.map((s, i) => i).sort((a, b) => (list[a].red - list[b].red) || (r() - .5));
  order.forEach((idx, k) => { const s = list[idx]; if (k < nDots) { s.kind = 'trail'; s.map = TRAIL_DOTS[k]; s.ord = k / nDots; } else { s.kind = 'sea'; s.map = seaPoint(r); s.ord = r(); } });
  SK.list = list; SK.trav = { hx: .62, hy: .4, z: 1, i: -1 };
  SK.standN = n; SK.seaN = n - nDots;
  SK.skyCount = 0; starsAddSky();
}
function starsAddSky() {
  while (SK.skyCount < STARS.sky) {
    const i = SK.skyCount++, r = rnd(STARS.skySeed + i);
    SK.list.push({ kind: 'sky', si: i, hx: r(), hy: r(), uz: r(), ur: r(), ua: r(), ured: r(), f: r(), phase: r() * Math.PI * 2 });
  }
  starsAngles();
}
// Independent seeded shuffles prevent neighbouring map places sharing an arrival side.
function starsAngles() {
  const r = rnd(NOVA.seed), map = SK.list.filter(s => s.kind !== 'sky'), sky = SK.list.filter(s => s.kind === 'sky');
  for (const list of [map, sky]) {
    for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [list[i], list[j]] = [list[j], list[i]]; }
    list.forEach((s, i) => { s.ang = (i * NOVA.gather.golden % 1) * Math.PI * 2; s.gather = s.kind !== 'sky' || i < Math.floor(sky.length * NOVA.gather.sky); s.ord2 ??= r(); });
  }
}
// One C1 path: a cubic meets the ring with the spiral's exact tangent, then curls into the X.
export function novaGatherPoint(from, centre, angle, radius, t) {
  const G = NOVA.gather, j = G.join, turn = G.swirl * Math.PI * 2, a = angle - turn;
  const ring = [centre[0] + radius * Math.cos(a), centre[1] + radius * Math.sin(a)];
  if (t >= j) { const q = (t - j) / (1 - j), r = radius * (1 - q) ** 2, theta = a + turn * q; return [centre[0] + Math.cos(theta) * r, centre[1] + Math.sin(theta) * r]; }
  const tangent = [radius * (-2 * Math.cos(a) - turn * Math.sin(a)) / (1 - j), radius * (-2 * Math.sin(a) + turn * Math.cos(a)) / (1 - j)];
  const c1 = from.map((v, i) => v + (ring[i] - v) / 3), c2 = ring.map((v, i) => v - tangent[i] * j / 3), q = t / j;
  return from.map((v, i) => (1 - q) ** 3 * v + 3 * (1 - q) ** 2 * q * c1[i] + 3 * (1 - q) * q * q * c2[i] + q ** 3 * ring[i]);
}
function seaPoint(r) { let p; for (let t = 0; t < 60; t++) { p = [30 + r() * 540, 30 + r() * 780]; if (!onLand(p)) break; } return p; }

// ---- the joined page: the hero's own stars ----
// src = { count, drawn(i, out), look(i) } from the hero's window.__heroJoin.stars
export function starsJoin(src) { SK.src = src; SK.n = -1; }
const COASTS = [COAST_A, COAST_B].map(P => { const cum = [0]; for (let i = 1; i <= P.length; i++) { const a = P[i - 1], b = P[i % P.length]; cum.push(cum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); } return { P, cum, L: polyLen(P, 1) }; });
const alongCoast = (c, d) => { const { P, cum } = c; let i = 1; while (i < cum.length - 1 && cum[i] < d) i++; const t = (d - cum[i - 1]) / (cum[i] - cum[i - 1] || 1), a = P[i - 1], b = P[i % P.length]; return [lerp(a[0], b[0], t), lerp(a[1], b[1], t)]; };
// the progress of the fall at which the coast line has drawn itself to fraction u (trip.mjs draws it by smooth(.12, .75, h))
const coastAt = u => .12 + .63 * (.5 - Math.sin(Math.asin(1 - 2 * clamp01(u)) / 3));
const ANGLE = (x, y) => Math.atan2(y, x);

function heroList() {
  const src = SK.src, N = Math.min(HERO_MOST, src.count), r = rnd(7), nDots = TRAIL_DOTS.length, nSea = SK.seaN, W = VIEW.w, H = VIEW.h;
  const at = [], red = [];
  for (let i = 0; i < N; i++) { at.push(src.drawn(i, [0, 0])); red.push(src.look(i).colour === C.red); }
  // the traveller: the red star nearest the middle of the view (any star if the field has no red one)
  let tv = -1, best = Infinity;
  for (const want of [true, false]) { for (let i = 0; i < N; i++) { if (want && !red[i]) continue; const d = Math.hypot(at[i][0] - W / 2, at[i][1] - H / 2); if (d < best) { best = d; tv = i; } } if (tv >= 0) break; }
  // Choose the far sky before handing out any falling places. Reserve enough real stars for the fall.
  const f = STARS.skyMargin, frame = DEPTH.frame.outer.map((v, i) => (i % 2 ? VIEW.oy : VIEW.ox) + v * VIEW.s0);
  const candidates = [];
  for (let i = 0; i < N; i++) if (i !== tv && Math.hypot(Math.max(frame[0] - at[i][0], 0, at[i][0] - frame[2]), Math.max(frame[1] - at[i][1], 0, at[i][1] - frame[3])) >= f) candidates.push(i);
  for (let k = candidates.length - 1; k > 0; k--) { const j = Math.floor(r() * (k + 1)); [candidates[k], candidates[j]] = [candidates[j], candidates[k]]; }
  const skyIds = candidates.slice(0, Math.max(0, Math.min(candidates.length, Math.floor(N * STARS.skyShare), N - 1 - nDots - nSea - STARS.skyReserve))), skySet = new Set(skyIds);
  const ids = []; for (let i = 0; i < N; i++) if (i !== tv && !skySet.has(i)) ids.push(i);
  for (let k = ids.length - 1; k > 0; k--) { const j = Math.floor(r() * (k + 1)); [ids[k], ids[j]] = [ids[j], ids[k]]; }
  // trail dots first by the build's own rule (red stars go to the sea), then the sea sparkle, then the coasts
  const order = ids.filter(i => !red[i]).concat(ids.filter(i => red[i]));
  const nCoast = Math.max(0, order.length - nDots - nSea);
  const list = [], keepP = .3 * SK.standN / (nDots + nSea);
  const star = i => ({ i, red: i >= 0 && red[i], z: .25 + r() * .75, ang: r() * Math.PI * 2, far: r(), sgn: r() < .5 ? -1 : 1, keep: r() < keepP, kr: r(), ord2: r() });
  for (let k = 0; k < nDots + nSea; k++) {
    const s = star(k < order.length ? order[k] : -1);
    s.fade = s.i < 0; // fewer hero stars than places (small phones): the missing ones fade up in place
    if (k < nDots) { s.kind = 'trail'; s.map = TRAIL_DOTS[k]; s.ord = k / nDots; } else { s.kind = 'sea'; s.map = seaPoint(r); s.ord = r(); }
    list.push(s);
  }
  // the rest fall evenly along the coast outlines, matched by angle so each lands on the side of the view it came from
  const rest = order.slice(nDots + nSea).sort((a, b) => ANGLE(at[a][0] / W - .5, at[a][1] / H - .5) - ANGLE(at[b][0] / W - .5, at[b][1] / H - .5));
  const total = COASTS[0].L + COASTS[1].L, places = [];
  for (let j = 0; j < nCoast; j++) {
    let d = (j + .5) / nCoast * total, c = 0; if (d > COASTS[0].L) { d -= COASTS[0].L; c = 1; }
    const u = d / COASTS[c].L, m = alongCoast(COASTS[c], d), hu = coastAt(u), t1 = hu - .02, t0 = t1 - Math.min(.45, Math.max(.06, t1 - .02));
    places.push({ m, hu, t0: Math.max(.02, t0), t1 });
  }
  places.sort((a, b) => ANGLE(a.m[0] / MAP.w - .5, a.m[1] / MAP.h - .5) - ANGLE(b.m[0] / MAP.w - .5, b.m[1] / MAP.h - .5));
  rest.forEach((i, j) => { const s = star(i), p = places[j]; s.kind = 'coast'; s.map = p.m; s.hu = p.hu; s.t0 = p.t0; s.t1 = p.t1; s.ord = 0; list.push(s); });
  skyIds.forEach(i => { const s = star(i); s.kind = 'sky'; s.f = r(); s.phase = r() * Math.PI * 2; list.push(s); });
  SK.list = list; SK.trav = { hx: .62, hy: .4, z: 1, i: tv }; SK.n = src.count;
  starsAngles();
}
// a star of the hero's look as a 2D disc (or square) of the same total light as the hero's point sprite: the sprite's
// coverage ramp is one device px wide, so its light is pi (r^2 + 1/12) for r >= .5 device px, less below.
const lightR = rad => { const r = rad * SK.dpr, I = r < .5 ? 2 * r * Math.PI * Math.pow(r + .5, 3) / 3 : Math.PI * (r * r + 1 / 12); return Math.sqrt(I / Math.PI) / SK.dpr; };

export function starsResize(w, h) {
  SK.dpr = Math.min(STARS.dprCap, window.devicePixelRatio || 1);
  SK.cv.width = Math.round(w * SK.dpr); SK.cv.height = Math.round(h * SK.dpr);
  if (SK.src) SK.n = -1;
}
export function starsTick(dt, st) {
  const tuning = JSON.stringify([STARS, NOVA, DEPTH.foot.stars]), changed = tuning !== SK.tuning;
  if (changed) { SK.tuning = tuning; if (!SK.src) starsAddSky(); }
  const assignment = JSON.stringify([STARS.skyShare, STARS.skyReserve, STARS.skyMargin, DEPTH.frame.outer]);
  if (assignment !== SK.assignment) { SK.assignment = assignment; if (SK.src) SK.n = -1; }
  SK.drift += dt * (1 - smooth(0, 1, st.handoffT));
  if (st.blastT > 0) { SK.orbit += dt * smooth(...NOVA.orbitIn, st.blastT); SK.burn += dt; }
  else { SK.orbit = 0; SK.burn = 0; }
  return changed;
}
export const starsSkyVisible = st => st.handoffT > 0 && SK.skyVisible && (st.blastT > 0 || !depthFrameCovers(st));
const fourStar = (ctx, x, y, s) => { ctx.beginPath(); ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x, y, x + s, y); ctx.quadraticCurveTo(x, y, x, y + s); ctx.quadraticCurveTo(x, y, x - s, y); ctx.quadraticCurveTo(x, y, x, y - s); ctx.fill(); };

// ---- batching: stars are grouped by colour and opacity; under 1.5 px across they are squares ----
const binOf = (map, col, al) => { const q = Math.min(64, Math.round(al * 64)); if (q <= 0) return null; const key = col + q; let b = map.get(key); if (!b) { b = { col, a: q / 64, sq: [], arc: [] }; map.set(key, b); } return b; };
function put(x, y, rad, al, col) {
  const b = binOf(SK.bins, col, al); if (!b) return;
  if (rad < .75) { const s = rad * 1.7725; b.sq.push(x - s / 2, y - s / 2, s); } else b.arc.push(x, y, rad);
}
function putTail(x, y, tail, al, col) { const b = binOf(SK.tails, col, al * .5); if (b) b.arc.push(x, y, x - tail[0], y - tail[1]); }
function flush(ctx) {
  ctx.lineWidth = .7;
  for (const b of SK.tails.values()) { const v = b.arc; if (!v.length) continue; ctx.globalAlpha = b.a; ctx.strokeStyle = b.col; ctx.beginPath(); for (let k = 0; k < v.length; k += 4) { ctx.moveTo(v[k], v[k + 1]); ctx.lineTo(v[k + 2], v[k + 3]); } ctx.stroke(); v.length = 0; }
  for (const b of SK.bins.values()) {
    if (!b.sq.length && !b.arc.length) continue;
    ctx.globalAlpha = b.a; ctx.fillStyle = b.col;
    const s = b.sq; for (let k = 0; k < s.length; k += 3) ctx.fillRect(s[k], s[k + 1], s[k + 2], s[k + 2]);
    const v = b.arc; if (v.length) { ctx.beginPath(); for (let k = 0; k < v.length; k += 3) { ctx.moveTo(v[k] + v[k + 2], v[k + 1]); ctx.arc(v[k], v[k + 1], v[k + 2], 0, 6.2832); } ctx.fill(); }
    s.length = 0; v.length = 0;
  }
}

// opt (joined page only): ink, an opaque ground under the stars at this opacity (while the hero is still behind the canvas);
// sky, the hero's whole field drawn where it is at this opacity; map, the opacity of everything else (reduced motion's cross-fade).
export function starsFrame(time, st, pointer, opt = {}) {
  const ctx = SK.ctx, W = VIEW.w, H = VIEW.h; if (!ctx) return;
  SK.skyVisible = false;
  const src = SK.src && SK.src.count > 0 ? SK.src : null;
  if (src && src.count !== SK.n) heroList();
  ctx.setTransform(SK.dpr, 0, 0, SK.dpr, 0, 0); ctx.clearRect(0, 0, W, H);
  if (opt.ink) { ctx.globalAlpha = opt.ink; ctx.fillStyle = C.ink; ctx.fillRect(0, 0, W, H); }
  const P = SK.pt;
  if (src && opt.sky) { const N = Math.min(HERO_MOST, src.count); for (let i = 0; i < N; i++) { src.drawn(i, P); const lk = src.look(i); put(P[0], P[1], lightR(lk.size / 2), lk.alpha * opt.sky, lk.colour); } }
  const K = opt.map ?? 1;
  if (K <= 0) { flush(ctx); ctx.globalAlpha = 1; return; }
  const h = st.handoffT, px = (pointer[0] - .5) * STARS.parallax, py = (pointer[1] - .5) * STARS.parallax;
  const Xs = toScreen(st, MAP.x), diag = Math.hypot(W, H), worldScale = st.exploreK ? st.cam.s / st.sEnd : 1;
  const gatherRadius = NOVA.gather.ring * Math.min(W, H), gatherT = s => clamp01((st.rushT - s.ord2 * NOVA.gather.stagger) / NOVA.gather.time);
  const dotR = Math.min(2.1, .75 + .38 * st.cam.s);
  if (h <= 0) SK.skyPointer = pointer.slice();
  const heroPos = (s, sky = false) => { const pt = sky && h > 0 ? SK.skyPointer : pointer; return [(((s.hx + SK.drift * STARS.drift * s.z) % 1) + 1) % 1 * W + (pt[0] - .5) * STARS.parallax * s.z, s.hy * H + (pt[1] - .5) * STARS.parallax * s.z]; };
  const look = opt.look || [0, 0], box = depthFrameBox(st), centre = toScreen(st, [MAP.w / 2, MAP.h / 2]), c0 = [VIEW.ox + MAP.w / 2 * VIEW.s0, VIEW.oy + MAP.h / 2 * VIEW.s0];
  const late = src ? .02 : .05; // joined: the first stars move within the first 3 % of the fall
  for (const s of SK.list) {
    let x, y, rad, al, col, tail = null;
    if (s.kind === 'sky') {
      if (!src && s.si >= STARS.sky) continue;
      if (!src) { s.z = lerp(...STARS.fieldZ, s.uz); s.r = lerp(...STARS.fieldR, s.ur); s.a = lerp(...STARS.fieldAlpha, s.ua); s.red = s.ured < STARS.red; }
      if (src) {
        if (h <= 0 || !s.skyFrozen) { src.drawn(s.i, P); const lk = src.look(s.i); s.sx = P[0]; s.sy = P[1]; s.sr = lightR(lk.size / 2); s.sa = lk.alpha; s.sc = lk.colour; s.skyFrozen = h > 0; }
        x = s.sx; y = s.sy; rad = s.sr; al = s.sa; col = h < .5 ? s.sc : C.paper;
      } else { [x, y] = heroPos(s, true); rad = s.r; al = s.a; col = s.red && h < .5 ? C.red : C.paper; }
      const follow = smooth(...STARS.skyMove, h);
      x += follow * (look[0] * s.z * STARS.skyLook + (centre[0] - c0[0]) * STARS.skyFollow);
      y += follow * (look[1] * s.z * STARS.skyLook + (centre[1] - c0[1]) * STARS.skyFollow);
      if (h > 0) {
        const outside = Math.hypot(Math.max(box[0] - x, 0, x - box[2]), Math.max(box[1] - y, 0, y - box[3]));
        al *= 1 - smooth(...STARS.skyCover, h) * (1 - smooth(0, STARS.skyEdge, outside)) * (1 - smooth(...DEPTH.fade.blast, st.blastT) * (1 - (st.exploreK || 0))) * (s.gather ? 1 - smooth(0, 1, st.rushT) : 1);
        if (!opt.still) al *= 1 - STARS.twinkle * follow * (.5 + .5 * Math.sin(time * lerp(...STARS.skyF, s.f) + s.phase));
      }
      if (s.gather && st.rushT > 0 && !opt.still) {
        const home = [x, y], gt = gatherT(s), q = st.blastT > 0 ? 1 - easeIO(st.blastT) : gt * gt * (3 - 2 * gt);
        const at = novaGatherPoint(home, Xs, s.ang, gatherRadius, q), prior = novaGatherPoint(home, Xs, s.ang, gatherRadius, Math.max(0, q - NOVA.gather.tail));
        x = at[0]; y = at[1]; tail = [(at[0] - prior[0]) * NOVA.gather.tailGain / NOVA.gather.tail, (at[1] - prior[1]) * NOVA.gather.tailGain / NOVA.gather.tail];
        if (st.blastT > 0) tail = tail.map(v => -v);
      } else if (st.blastT > 0 && !opt.still) {
        const dx = x - Xs[0], dy = y - Xs[1], d = Math.hypot(dx, dy), bump = Math.exp(-(((d - novaRingRadius(st)) / STARS.skyShock) ** 2)) * (1 - smooth(...NOVA.base.ringFade, st.blastT));
        if (d) { x += dx / d * STARS.skyPush * bump; y += dy / d * STARS.skyPush * bump; }
        al *= 1 + bump;
      }
      if (x >= -STARS.skyMargin && y >= -STARS.skyMargin && x <= W + STARS.skyMargin && y <= H + STARS.skyMargin) { if (al * K > 0) SK.skyVisible = true; if (tail) putTail(x, y, tail, al * K, col); put(x, y, rad, al * K, col); }
      continue;
    }
    if (src) {
      if (s.kind === 'coast' && h >= s.hu + .06 && st.rushT === 0) continue;
      if (s.i >= 0 && h < 1) { src.drawn(s.i, P); const lk = src.look(s.i); x = P[0]; y = P[1]; rad = lightR(lk.size / 2); al = lk.alpha; col = h < .5 ? lk.colour : C.paper; }
      else { rad = 1; al = 0; col = C.paper; }
    } else { rad = s.r; al = s.a; col = s.red && h < .5 ? C.red : C.paper; }
    if (h <= 0) { if (!src) [x, y] = heroPos(s); else if (s.i < 0) continue; }
    else {
      const m = toScreen(st, s.map);
      const tr = s.kind === 'trail', endR = src ? (tr ? dotR : s.kind === 'coast' ? .7 : .6) : (tr ? dotR : s.r * .8), endA = src ? (tr ? .9 : s.kind === 'coast' ? .75 : .45) : (tr ? .9 : s.a * .45);
      if (h < 1) {
        const e = easeIO(s.kind === 'coast' ? clamp01((h - s.t0) / (s.t1 - s.t0)) : clamp01((h - late - s.ord * .45) / .45));
        if (src && s.fade) { x = m[0]; y = m[1]; rad = endR; al = endA * e; }
        else { const hp = src ? [x, y] : heroPos(s), r0 = src ? rad : s.r, a0 = src ? al : s.a; x = lerp(hp[0], m[0], e); y = lerp(hp[1], m[1], e) - Math.sin(Math.PI * e) * 30 * s.z; rad = lerp(r0, endR, e); al = lerp(a0, endA, e); }
        if (s.kind === 'coast') al *= 1 - smooth(s.hu, s.hu + .06, h); // the coast line passes it and it dissolves into the line
      }
      else { x = m[0]; y = m[1]; rad = endR; al = endA; }
      if (st.legXT > 0 && st.rushT === 0) { const dx = Xs[0] - x, dy = Xs[1] - y, d = Math.hypot(dx, dy), R = 260; if (d < R) { const k = .12 * st.legXT * (1 - d / R); x += dx * k; y += dy * k; tail = [dx / d * 6 * st.legXT, dy / d * 6 * st.legXT]; } }
      if (st.rushT > 0 && st.blastT === 0) {
        const tt = gatherT(s), e = tt * tt * (3 - 2 * tt);
        const at = novaGatherPoint(m, Xs, s.ang, gatherRadius, e), prior = novaGatherPoint(m, Xs, s.ang, gatherRadius, Math.max(0, e - NOVA.gather.tail));
        tail = [(at[0] - prior[0]) * NOVA.gather.tailGain / NOVA.gather.tail, (at[1] - prior[1]) * NOVA.gather.tailGain / NOVA.gather.tail]; x = at[0]; y = at[1]; al = s.kind === 'coast' ? .6 * smooth(0, NOVA.gather.join, tt) : Math.max(al, .6);
      }
      if (st.blastT > 0) {
        const b = 1 - Math.pow(1 - clamp01(st.blastT / NOVA.base.starBlast), 3), kick = opt.still ? 0 : novaShare(NOVA.flare.kick, NOVA.flare.kickMax);
        const dist = (s.keep ? (NOVA.base.starInner + s.kr * Math.min(W, H) * NOVA.base.starReach) * (1 + kick) : diag * (.8 + s.far)) * worldScale;
        const angle = s.ang + (s.keep && !opt.still ? NOVA.orbit * (NOVA.base.starSpeed[0] + NOVA.base.starSpeed[1] * (1 - s.kr)) * SK.orbit : 0), ca = Math.cos(angle), sa = Math.sin(angle);
        x = Xs[0] + ca * dist * b; y = Xs[1] + sa * dist * b * NOVA.base.starAspect;
        if (b < .98) tail = [-ca * 30 * (1 - b), -sa * 30 * (1 - b)];
        al = s.keep ? lerp(.9, .25 + s.kr * .45, smooth(.5, 1, st.blastT)) : .9; rad = (src ? .6 : s.r) * .9;
        col = s.red && s.keep ? C.red : C.paper;
        if (st.exploreK > 0) {
          const q = smooth(s.ord2 * NOVA.gather.stagger, s.ord2 * NOVA.gather.stagger + NOVA.gather.time, st.exploreK);
          const at = novaGatherPoint(m, Xs, s.ang, gatherRadius * worldScale, 1 - q), remaining = (1 - q) ** 3;
          x = at[0] + (x - Xs[0]) * remaining; y = at[1] + (y - Xs[1]) * remaining;
          rad = lerp(rad, endR, q); al = lerp(al, endA, q); col = C.paper; tail = null;
        }
      }
    }
    if (x < -10 || y < -10 || x > W + 10 || y > H + 10) continue;
    al *= K;
    if (tail) putTail(x, y, tail, al, col);
    put(x, y, rad, al, col);
  }
  if (st.blastT > 0 && !opt.still) {
    const E = NOVA.embers, count = VIEW.phone ? E.nPhone : E.n, big = Math.max(W, H), fade = smooth(...NOVA.motionIn, st.blastT);
    const spark = (i, age, round, burst) => {
      const r = rnd(NOVA.seed + i + round * (count + 1)), angle = r() * Math.PI * 2, reach = lerp(...E.reach, r()) * big;
      const distance = reach * (1 - (1 - age) ** E.slow) * worldScale, rad = lerp(...E.r, r()) * worldScale;
      put(Xs[0] + Math.cos(angle) * distance, Xs[1] + Math.sin(angle) * distance, rad, E.alpha * (1 - smooth(...E.fade, age)) * fade * K * burst, C.warm);
    };
    for (let i = 0; i < count; i++) {
      const life = lerp(...E.life, rnd(NOVA.seed + i)()), age = SK.burn / life + i / count, round = Math.floor(age);
      spark(i, age - round, round, 1);
      NOVA_LIVE.flares.forEach(flare => spark(i, novaFlare(flare), flare.serial, E.burst));
    }
  }
  flush(ctx);
  // the traveller: one red star from the hero to the X (on the joined page, a real red star of the hero's field)
  const T = SK.trav; let tx, ty, g = 1, lk = null;
  let hp = [T.hx * W + px, T.hy * H + py];
  if (src && T.i >= 0) { hp = src.drawn(T.i, [0, 0]); lk = src.look(T.i); g = smooth(.02, .6, h); }
  if (h <= 0) { tx = hp[0]; ty = hp[1]; }
  else { const m = toScreen(st, st.trav || MAP.waypoints[0]); const e = easeIO(smooth(.5, 1, h)); tx = lerp(hp[0], m[0], e); ty = lerp(hp[1], m[1], e); }
  const ta = (1 - smooth(.2, .7, st.rushT)) * K;
  if (lk && g < 1) { put(tx, ty, lightR(lk.size / 2), lk.alpha * (1 - g) * K, lk.colour); flush(ctx); }
  if (ta > 0 && g > 0) {
    const r0 = lk ? lightR(lk.size / 2) : 7;
    ctx.fillStyle = C.red; ctx.globalAlpha = .22 * ta * g; ctx.beginPath(); ctx.arc(tx, ty, lerp(r0, 11, g), 0, 6.2832); ctx.fill();
    ctx.globalAlpha = ta * g; fourStar(ctx, tx, ty, lerp(r0, 7, g));
  }
  ctx.globalAlpha = 1;
}
// one still frame for reduced motion
export function starsStill(st) { starsFrame(0, st, [.5, .5], { still: true }); }
