// The star canvas: hero field, the hand-off into trail dots, sea sparkle, the rush and the blast.
import { STARS, C, MAP } from './data.mjs';
import { rnd, onLand } from './art.mjs';
import { TRAIL_DOTS, VIEW, toScreen, smooth, lerp, clamp01, easeIO } from './trip.mjs';

const SK = { cv: null, ctx: null, dpr: 1, list: [], trav: null };

export function starsBuild(canvas) {
  SK.cv = canvas; SK.ctx = canvas.getContext('2d');
  const r = rnd(7), nDots = TRAIL_DOTS.length, n = Math.max(STARS.count, nDots + 60);
  const list = [];
  for (let i = 0; i < n; i++) list.push({ hx: r(), hy: r(), z: .25 + r() * .75, r: .5 + r() * 1.1, a: .35 + r() * .6, red: r() < STARS.red, ang: r() * Math.PI * 2, far: r(), sgn: r() < .5 ? -1 : 1, keep: r() < .3, kr: r(), ord2: r() });
  // red stars go to the sea; the rest are shuffled onto trail dots
  const order = list.map((s, i) => i).sort((a, b) => (list[a].red - list[b].red) || (r() - .5));
  order.forEach((idx, k) => { const s = list[idx]; if (k < nDots) { s.kind = 'trail'; s.map = TRAIL_DOTS[k]; s.ord = k / nDots; } else { s.kind = 'sea'; let p; for (let t = 0; t < 60; t++) { p = [30 + r() * 540, 30 + r() * 780]; if (!onLand(p)) break; } s.map = p; s.ord = r(); } });
  SK.list = list; SK.trav = { hx: .62, hy: .4, z: 1 };
}
export function starsResize(w, h) {
  SK.dpr = Math.min(STARS.dprCap, window.devicePixelRatio || 1);
  SK.cv.width = Math.round(w * SK.dpr); SK.cv.height = Math.round(h * SK.dpr);
}
const fourStar = (ctx, x, y, s) => { ctx.beginPath(); ctx.moveTo(x, y - s); ctx.quadraticCurveTo(x, y, x + s, y); ctx.quadraticCurveTo(x, y, x, y + s); ctx.quadraticCurveTo(x, y, x - s, y); ctx.quadraticCurveTo(x, y, x, y - s); ctx.fill(); };

export function starsFrame(time, st, pointer) {
  const ctx = SK.ctx, W = VIEW.w, H = VIEW.h; if (!ctx) return;
  ctx.setTransform(SK.dpr, 0, 0, SK.dpr, 0, 0); ctx.clearRect(0, 0, W, H);
  const h = st.handoffT, px = (pointer[0] - .5) * STARS.parallax, py = (pointer[1] - .5) * STARS.parallax;
  const Xs = toScreen(st, MAP.x), diag = Math.hypot(W, H);
  const dotR = Math.min(2.1, .75 + .38 * st.cam.s);
  const heroPos = s => [(((s.hx + time * STARS.drift * s.z) % 1) + 1) % 1 * W + px * s.z, s.hy * H + py * s.z];
  for (const s of SK.list) {
    let x, y, rad = s.r, al = s.a, col = s.red && h < .5 ? C.red : C.paper, tail = null;
    if (h <= 0) { [x, y] = heroPos(s); }
    else {
      const m = toScreen(st, s.map);
      if (h < 1) { const e = easeIO(clamp01((h - .05 - s.ord * .45) / .45)), hp = heroPos(s); x = lerp(hp[0], m[0], e); y = lerp(hp[1], m[1], e) - Math.sin(Math.PI * e) * 30 * s.z; rad = lerp(s.r, s.kind === 'trail' ? dotR : s.r * .8, e); al = lerp(s.a, s.kind === 'trail' ? .9 : s.a * .45, e); }
      else { x = m[0]; y = m[1]; rad = s.kind === 'trail' ? dotR : s.r * .8; al = s.kind === 'trail' ? .9 : s.a * .45; }
      if (st.legXT > 0 && st.rushT === 0) { const dx = Xs[0] - x, dy = Xs[1] - y, d = Math.hypot(dx, dy), R = 260; if (d < R) { const k = .12 * st.legXT * (1 - d / R); x += dx * k; y += dy * k; tail = [dx / d * 6 * st.legXT, dy / d * 6 * st.legXT]; } }
      if (st.rushT > 0 && st.blastT === 0) {
        const tt = clamp01((st.rushT - s.ord2 * .35) / .6), e = tt * tt * (3 - 2 * tt);
        const dx = Xs[0] - x, dy = Xs[1] - y, mx = x + dx * .5 - dy * .35 * s.sgn, my = y + dy * .5 + dx * .35 * s.sgn;
        const bx = (1 - e) * (1 - e) * x + 2 * (1 - e) * e * mx + e * e * Xs[0], by = (1 - e) * (1 - e) * y + 2 * (1 - e) * e * my + e * e * Xs[1];
        tail = [(bx - x) * .08, (by - y) * .08]; x = bx; y = by; al = Math.max(al, .6);
      }
      if (st.blastT > 0) {
        const b = 1 - Math.pow(1 - clamp01(st.blastT / .7), 3), dist = s.keep ? 60 + s.kr * Math.min(W, H) * .55 : diag * (.8 + s.far);
        const ca = Math.cos(s.ang), sa = Math.sin(s.ang);
        x = Xs[0] + ca * dist * b; y = Xs[1] + sa * dist * b * .85;
        if (b < .98) tail = [-ca * 30 * (1 - b), -sa * 30 * (1 - b)];
        al = s.keep ? lerp(.9, .25 + s.kr * .45, smooth(.5, 1, st.blastT)) : .9; rad = s.r * .9;
        col = s.red && s.keep ? C.red : C.paper;
      }
    }
    if (x < -10 || y < -10 || x > W + 10 || y > H + 10) continue;
    ctx.globalAlpha = al; ctx.fillStyle = col;
    if (tail) { ctx.strokeStyle = col; ctx.lineWidth = .7; ctx.globalAlpha = al * .5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x - tail[0], y - tail[1]); ctx.stroke(); ctx.globalAlpha = al; }
    ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.2832); ctx.fill();
  }
  // the traveller: one red star from the hero to the X
  const T = SK.trav; let tx, ty;
  const hp = [T.hx * W + px, T.hy * H + py];
  if (h <= 0) { tx = hp[0]; ty = hp[1]; }
  else { const m = toScreen(st, st.trav || MAP.waypoints[0]); const e = easeIO(smooth(.5, 1, h)); tx = lerp(hp[0], m[0], e); ty = lerp(hp[1], m[1], e); }
  const ta = 1 - smooth(.2, .7, st.rushT);
  if (ta > 0) {
    ctx.fillStyle = C.red; ctx.globalAlpha = .22 * ta; ctx.beginPath(); ctx.arc(tx, ty, 11, 0, 6.2832); ctx.fill();
    ctx.globalAlpha = ta; fourStar(ctx, tx, ty, 7);
  }
  ctx.globalAlpha = 1;
}
// one still frame for reduced motion
export function starsStill(st) { starsFrame(0, st, [.5, .5]); }
