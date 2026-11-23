// Scroll progress, acts, camera, traveller. Everything here is a pure function of progress P (in viewport heights).
import { ACTS, CAMERA, HOLD, MAP, STOPS, COPY } from './data.mjs';
import { TRAIL, polyLen, COAST_A, COAST_B, onLand, miniMapSvg } from './art.mjs';

export const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (a, b, v) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
export const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// ---- geometry along the trail ----
const CUM = [0]; for (let i = 1; i < TRAIL.length; i++) CUM.push(CUM[i - 1] + Math.hypot(TRAIL[i][0] - TRAIL[i - 1][0], TRAIL[i][1] - TRAIL[i - 1][1]));
export const TRAIL_LEN = CUM[CUM.length - 1];
export const STOP_U = STOPS.map(s => CUM[s.w * MAP.trailSeg]);
export const X_U = CUM[MAP.xIdx * MAP.trailSeg];
export const pointAt = u => {
  if (u <= 0) return TRAIL[0].slice(); if (u >= TRAIL_LEN) return TRAIL[TRAIL.length - 1].slice();
  let lo = 0, hi = CUM.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (CUM[m] <= u) lo = m; else hi = m; }
  const t = (u - CUM[lo]) / (CUM[hi] - CUM[lo] || 1); return [lerp(TRAIL[lo][0], TRAIL[hi][0], t), lerp(TRAIL[lo][1], TRAIL[hi][1], t)];
};
const smoothCenter = u => { let x = 0, y = 0; const n = 4, w = CAMERA.smooth; for (let k = -n; k <= n; k++) { const p = pointAt(Math.max(0, Math.min(TRAIL_LEN, u + k * w / n))); x += p[0]; y += p[1]; } return [x / (2 * n + 1), y / (2 * n + 1)]; };
// the water crossing, found from the coasts
export const WATER = (() => { let a = null, b = null; for (let u = STOP_U[4]; u < STOP_U[5]; u += 1) { const w = !onLand(pointAt(u)); if (w && a === null) a = u; if (!w && a !== null && b === null && u > a + 10) b = u; } return [a - 2, b + 2]; })();
// trail dots: one star per dot
export const TRAIL_DOTS = (() => { const out = []; for (let u = 0; u <= X_U; u += MAP.dotGap) out.push(pointAt(u)); return out; })();

// ---- dates ----
const NOW = (() => { const d = new Date(); return d.getFullYear() + d.getMonth() / 12 + d.getDate() / 365; })();
export const yearOf = (v, end) => { if (v === 'now') return NOW; const [y, m] = v.split('-').map(Number); return y + (end ? m : m - 1) / 12; };
export const DATE_NOW = NOW;
const STOP_DATES = STOPS.map(s => [yearOf(s.spans[0][0]), yearOf(s.spans[s.spans.length - 1][1], 1)]);

// ---- acts ----
export const SEQ = (() => {
  const seq = []; let p = 0; const add = (kind, len, i) => { seq.push({ kind, a: p, len, i }); p += len; };
  add('hero', ACTS.hero); add('handoff', ACTS.handoff); add('overview', ACTS.overview); add('pushIn', ACTS.pushIn);
  STOPS.forEach((s, i) => { add('hold', ACTS.hold, i); const u1 = i < STOPS.length - 1 ? STOP_U[i + 1] : X_U; add(i < STOPS.length - 1 ? 'leg' : 'legX', (u1 - STOP_U[i]) * ACTS.legPerUnit, i); });
  const F = ACTS.footer; add('rush', F.rush); add('blast', F.blast); add('settle', F.settle); add('rest', F.rest);
  return seq;
})();
export const TOTAL_P = SEQ.reduce((a, s) => a + s.len, 0);
const seqOf = (kind, i) => SEQ.find(s => s.kind === kind && (i === undefined || s.i === i));
export const holdStart = i => seqOf('hold', i).a;
export const progressForStop = i => holdStart(i) + ACTS.hold * .5;
const datePieces = () => { const out = []; STOPS.forEach((s, i) => { const h = seqOf('hold', i); out.push([h.a, h.a + h.len, STOP_DATES[i][0], STOP_DATES[i][1]]); const l = SEQ.find(q => (q.kind === 'leg' || q.kind === 'legX') && q.i === i); out.push([l.a, l.a + l.len, STOP_DATES[i][1], i < STOPS.length - 1 ? STOP_DATES[i + 1][0] : NOW]); }); return out; };
const PIECES = datePieces();
export const dateAt = P => { if (P <= PIECES[0][0]) return PIECES[0][2]; for (const q of PIECES) if (P <= q[1]) return lerp(q[2], q[3], clamp01((P - q[0]) / (q[1] - q[0]))); return NOW; };
export const progressForDate = d => { for (const q of PIECES) { const lo = Math.min(q[2], q[3]), hi = Math.max(q[2], q[3]); if (d >= lo && d <= hi && q[3] !== q[2]) return lerp(q[0], q[1], (d - q[2]) / (q[3] - q[2])); } return d <= PIECES[0][2] ? PIECES[0][0] : PIECES[PIECES.length - 1][1]; };

// ---- view ----
export const VIEW = { w: 1, h: 1, phone: false, s0: 1, ox: 0, oy: 0, sT: 1, unit: 1 };
export function tripResize(w, h, tlH) {
  const m = w <= CAMERA.phoneMax ? 16 : 28;
  VIEW.w = w; VIEW.h = h; VIEW.phone = w <= CAMERA.phoneMax; VIEW.unit = h / 100;
  const availH = h - m - (tlH + 10);
  VIEW.s0 = Math.min((w - 2 * m) / MAP.w, (availH - m) / MAP.h);
  VIEW.ox = (w - MAP.w * VIEW.s0) / 2; VIEW.oy = m + (availH - m - MAP.h * VIEW.s0) / 2;
  VIEW.sT = VIEW.s0 * (VIEW.phone ? CAMERA.pushScalePhone : CAMERA.pushScale);
}
const camOverview = () => ({ cx: MAP.w / 2, cy: MAP.h / 2, s: VIEW.s0, ax: VIEW.ox + MAP.w / 2 * VIEW.s0, ay: VIEW.oy + MAP.h / 2 * VIEW.s0 });
const camTrip = (u, zoom) => { const c = smoothCenter(u); return { cx: c[0], cy: c[1], s: VIEW.sT * zoom, ax: CAMERA.anchorX * VIEW.w, ay: CAMERA.anchorY * VIEW.h }; };
const camMix = (a, b, t) => ({ cx: lerp(a.cx, b.cx, t), cy: lerp(a.cy, b.cy, t), s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), t)), ax: lerp(a.ax, b.ax, t), ay: lerp(a.ay, b.ay, t) });
const camFinal = c => ({ s: c.s, tx: c.ax - c.cx * c.s, ty: c.ay - c.cy * c.s });

// ---- state for a progress value ----
export function tripState(P) {
  const st = { P, kind: 'hero', t: 0, i: -1, u: 0, zoom: 1, cardK: STOPS.map(() => 0), visited: STOPS.map((s, i) => P >= holdStart(i) + ACTS.hold * HOLD.visited), dim: 1,
    heroT: 0, handoffT: 0, overviewT: 0, pushT: 0, inTrip: false, rushT: 0, blastT: 0, settleT: 0, restT: 0, legXT: 0 };
  let seg = SEQ[SEQ.length - 1];
  for (const q of SEQ) if (P < q.a + q.len) { seg = q; break; }
  st.kind = seg.kind; st.i = seg.i; st.t = clamp01((P - seg.a) / seg.len);
  const idx = SEQ.indexOf(seg), passed = k => SEQ.findIndex(q => q.kind === k) < idx;
  st.heroT = seg.kind === 'hero' ? st.t : 1;
  st.handoffT = seg.kind === 'handoff' ? st.t : passed('handoff') ? 1 : 0;
  st.overviewT = seg.kind === 'overview' ? st.t : passed('overview') ? 1 : 0;
  st.pushT = seg.kind === 'pushIn' ? st.t : passed('pushIn') ? 1 : 0;
  st.rushT = seg.kind === 'rush' ? st.t : passed('rush') ? 1 : 0;
  st.blastT = seg.kind === 'blast' ? st.t : passed('blast') ? 1 : 0;
  st.settleT = seg.kind === 'settle' ? st.t : passed('settle') ? 1 : 0;
  st.restT = seg.kind === 'rest' ? st.t : 0;
  st.legXT = seg.kind === 'legX' ? st.t : passed('legX') ? 1 : 0;
  let cam;
  if (['hero', 'handoff', 'overview'].includes(seg.kind)) cam = camOverview();
  else if (seg.kind === 'pushIn') cam = camMix(camOverview(), camTrip(0, 1), easeIO(st.t));
  else if (seg.kind === 'hold') {
    st.u = STOP_U[seg.i];
    const z = smooth(HOLD.zoomIn[0], HOLD.zoomIn[1], st.t) * (1 - smooth(HOLD.zoomOut[0], HOLD.zoomOut[1], st.t));
    st.zoom = 1 + (CAMERA.holdZoom - 1) * z; st.dim = lerp(1, CAMERA.holdDim, z);
    st.cardK[seg.i] = smooth(HOLD.open[0], HOLD.open[1], st.t) * (1 - smooth(HOLD.fold[0], HOLD.fold[1], st.t));
    cam = camTrip(st.u, st.zoom);
  } else if (seg.kind === 'leg' || seg.kind === 'legX') {
    const u0 = STOP_U[seg.i], u1 = seg.kind === 'leg' ? STOP_U[seg.i + 1] : X_U;
    st.u = lerp(u0, u1, easeIO(st.t)); cam = camTrip(st.u, 1);
  } else { // footer acts: X fixed, anchor slides
    st.u = X_U; const base = camTrip(X_U, 1); base.cx = MAP.x[0]; base.cy = MAP.x[1];
    const fx = VIEW.phone ? CAMERA.footerXPhone : CAMERA.footerX;
    const e1 = easeIO(st.rushT), e2 = easeIO(smooth(0, .8, st.settleT));
    base.ax = lerp(lerp(CAMERA.anchorX * VIEW.w, VIEW.w / 2, e1), fx[0] * VIEW.w, e2);
    base.ay = lerp(lerp(CAMERA.anchorY * VIEW.h, VIEW.h / 2, e1), fx[1] * VIEW.h, e2);
    cam = base;
  }
  st.inTrip = st.pushT > 0;
  st.cam = camFinal(cam);
  st.trav = st.handoffT < 1 ? null : pointAt(st.u);
  st.date = dateAt(P);
  st.cardOpen = Math.max(...st.cardK);
  return st;
}
export const toScreen = (st, p) => [p[0] * st.cam.s + st.cam.tx, p[1] * st.cam.s + st.cam.ty];

// ---- DOM ----
const TRIP_EL = {};
export function tripBuild(els) {
  Object.assign(TRIP_EL, els);
  TRIP_EL.coasts = [...els.svg.querySelectorAll('.coast')];
  TRIP_EL.coastLen = [polyLen(COAST_A, 1), polyLen(COAST_B, 1)];
  TRIP_EL.ship = els.svg.querySelector('.ls-ship');
  els.mini.innerHTML = `<svg viewBox="0 0 600 900" aria-hidden="true">${miniMapSvg()}<rect class="mm-view" x="0" y="0" width="1" height="1"/><circle class="mm-trav" r="10"/></svg>`
    + STOPS.map((s, i) => `<button class="mm-stop" data-i="${i}" style="left:${(MAP.waypoints[s.w][0] / 6).toFixed(2)}%;top:${(MAP.waypoints[s.w][1] / 9).toFixed(2)}%" aria-label="${COPY.stoneGo.replace('{name}', s.name).replace('{dates}', s.dates)}"><i></i></button>`).join('');
  TRIP_EL.mmView = els.mini.querySelector('.mm-view'); TRIP_EL.mmTrav = els.mini.querySelector('.mm-trav');
  TRIP_EL.mmStops = [...els.mini.querySelectorAll('.mm-stop')];
}
export function tripApply(st) {
  const E = TRIP_EL, c = st.cam;
  E.cam.setAttribute('transform', `matrix(${c.s.toFixed(4)} 0 0 ${c.s.toFixed(4)} ${c.tx.toFixed(2)} ${c.ty.toFixed(2)})`);
  const h = st.handoffT, fade = 1 - smooth(0, .45, st.blastT);
  E.sea.style.opacity = smooth(.2, .7, h) * fade; E.fill.style.opacity = smooth(.25, .75, h) * fade;
  E.detail.style.opacity = smooth(.45, .95, h) * fade; E.finds.style.opacity = smooth(.5, 1, h) * fade;
  E.coastG.style.opacity = fade;
  const dr = smooth(.12, .75, h);
  E.coasts.forEach((p, i) => { if (dr >= 1) { p.style.strokeDasharray = 'none'; return; } const L = E.coastLen[i] * c.s; p.style.strokeDasharray = `${L.toFixed(1)} ${L.toFixed(1)}`; p.style.strokeDashoffset = (L * (1 - dr)).toFixed(1); });
  // solid trail behind the traveller (dash in screen units because the stroke does not scale)
  const L = TRAIL_LEN * c.s; E.done.style.strokeDasharray = `${L.toFixed(1)} ${L.toFixed(1)}`; E.done.style.strokeDashoffset = ((TRAIL_LEN - st.u) * c.s).toFixed(1);
  E.done.style.opacity = st.inTrip ? fade : 0;
  // the longship rides the crossing
  const sp = pointAt(Math.max(WATER[0], Math.min(WATER[1], st.u))); E.ship.setAttribute('transform', `translate(${n2(sp[0])} ${n2(sp[1] + 5)}) scale(.55)`);
  E.svg.style.opacity = st.dim;
  E.caption.style.opacity = 1 - smooth(0, .3, h);
  E.cue.style.opacity = smooth(.2, .5, st.overviewT) * (1 - smooth(0, .3, st.pushT));
  // mini-map
  const mo = smooth(.5, 1, st.pushT) * (1 - smooth(0, .4, st.rushT));
  E.mini.style.opacity = mo; E.mini.style.visibility = mo > .01 ? 'visible' : 'hidden';
  if (mo > .01) {
    E.mmView.setAttribute('transform', `translate(${n2(-c.tx / c.s)} ${n2(-c.ty / c.s)}) scale(${n2(VIEW.w / c.s)} ${n2(VIEW.h / c.s)})`);
    const tp = pointAt(st.u); E.mmTrav.setAttribute('transform', `translate(${n2(tp[0])} ${n2(tp[1])})`);
  }
}
const n2 = v => v.toFixed(2);
export function tripMiniVisited(st) { TRIP_EL.mmStops.forEach((b, i) => b.classList.toggle('on', st.visited[i])); }
