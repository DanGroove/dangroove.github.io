// Scroll progress, acts, camera, traveller. Everything here is a pure function of progress P (in viewport heights).
import { ACTS, CAMERA, HOLD, MAP, STOPS, COPY, DEPTH, FIND_PLAY, LABELS, WORLD, STEPS, NOVA, MARK, CARD_TAIL } from './data.mjs';
import { TRAIL, polyLen, COAST_A, COAST_B, onLand, miniMapSvg, mapLabelRows, mapLabelBox } from './art.mjs';

export const clamp01 = v => v < 0 ? 0 : v > 1 ? 1 : v;
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (a, b, v) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
export const easeIO = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// One reversible score for all rush surfaces. Everything that moves or grows (the gathering stars, the spikes) follows one
// continuous pull that speeds up until the draw-in; the four heartbeat throbs only swell and relax the light (the glow's
// radius and alpha, the veil's hole), so nothing lurches in steps. Seconds only set the throb envelopes.
export function novaBuild(rushT, phone = VIEW.phone) {
  const B = NOVA.build, t = clamp01(rushT), u = clamp01(t / B.kindle), k = 1 - (1 - u) * (1 - u), d = smooth(B.draw, B.hold, t);
  const pulses = B.throbs.map(centre => smooth(centre - B.rise / STEPS.pace.rush, centre, t) * (1 - smooth(centre, centre + B.fall / STEPS.pace.rush, t)));
  const swell = pulses.reduce((sum, p, i) => sum + p * B.swell[i], 0), pulse = pulses.reduce((sum, p, i) => sum + p * B.throbAlpha[i], 0);
  // Motion has no heartbeat steps. Charge and compression continue right up to the first blast frame.
  const pull = (t / B.draw) ** B.pull, lit = t ** B.pull;
  const glow = (t > 0 ? lerp(B.kindleGlow, B.glow[0], k) : 0) * (1 + swell), len = 1 + B.spikeGrow * pull;
  const heat = (t > 0 ? lerp(B.kindleHeat, B.heat[0], k) : 0) + (B.heat[1] - B.heat[0]) * lit;
  // Seeded continuous noise: never integrates dt; its amplitude grows all the way into the blast.
  const noise = axis => { const v = t * STEPS.pace.rush * B.jitterHz, i = Math.floor(v), hash = n => { let h = Math.imul(n + NOVA.seed + axis * 101, 1597334677); h ^= h >>> 16; return (h >>> 0) / 4294967295 * 2 - 1; }; return lerp(hash(i), hash(i+1), smooth(0,1,v-i)); };
  const tremble = t > B.draw ? lerp(...B.jitter, d) * smooth(B.draw, B.draw + .02, t) : 0;
  const jitter = [noise(0), noise(1)], jitterLength = Math.max(1, Math.hypot(...jitter));
  return { len: d === 1 ? B.compressed : lerp(len, B.compressed, d), thin: lerp(1, B.thickness, d), heat: lerp(heat, B.heat[2], d),
    glow: lerp(glow, B.glow[1], d), glowAlpha: lerp((t > 0 ? lerp(B.kindleAlpha, B.glowAlpha[0], k) : 0) + (B.glowAlpha[1] - B.glowAlpha[0]) * lit + pulse, B.glowAlpha[2], d),
    core: B.core[0] * k + (B.core[2] - B.core[0]) * lit, coreAlpha: lerp(heat, 1, d),
    veil: (phone ? B.veilPhone : B.veil) * (0.2 * k + 0.6 * lit + 0.2 * d),
    hole: lerp(...B.hole, 0.2 * k + 0.6 * lit + 0.2 * d) * (1 + B.holeBreath * swell * (1 - d)),
    push: (phone ? B.pushPhone : B.push) * smooth(0, B.draw, t), jitter: tremble ? jitter.map(v => v * tremble / jitterLength) : [0, 0],
    gather: lit };
}

export const novaBuildGather = (rushT, order = 0) => {
  const B = NOVA.build, arrival = lerp(...B.arrival, clamp01(order / B.arrivalTail));
  return clamp01(rushT / arrival) ** B.pull;
};

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
export const VIEW = { w: 1, h: 1, phone: false, s0: 1, ox: 0, oy: 0, sT: 1, unit: 1, depth: 1, footerY: null, cards: [] };
export function tripCardPlace(height, steps = true, reviewFloor = WORLD.card.gap) {
  const Q = WORLD.card, stone = Math.max(MARK.min, Math.min(MARK.max, MARK.k * VIEW.sT * CAMERA.holdZoom)), rim = stone * (MARK.radius + MARK.rim / 2) / MARK.box;
  const width = VIEW.phone ? VIEW.w : Math.min(Q.w, VIEW.w - 2 * Q.edge - stone / 2 - rim - CARD_TAIL.len);
  const floor = VIEW.phone ? VIEW.h - Q.phoneBottom - (steps ? STEPS.nav.bar : 0) : steps ? VIEW.h - 56 - STEPS.nav.gap - STEPS.nav.h - Q.gap : VIEW.h - Q.gap;
  const left = VIEW.phone ? 0 : (VIEW.w - (stone / 2 + rim + CARD_TAIL.len + width)) / 2;
  const top = VIEW.phone ? floor - height : Math.max(reviewFloor, Math.min(VIEW.h / 2 - Q.gap - height / 2, floor - height));
  const sx = VIEW.phone ? VIEW.w / 2 : left + stone / 2, sy = VIEW.phone ? top - CARD_TAIL.lenPhone - rim : top + height / 2;
  return { w: width, x: VIEW.phone ? VIEW.w / 2 : sx + rim + CARD_TAIL.len + width / 2, y: top + height / 2, sx, sy };
}
export function tripResize(w, h, tlH) {
  glideCache.clear();
  const m = w <= CAMERA.phoneMax ? 16 : 28;
  VIEW.w = w; VIEW.h = h; VIEW.phone = w <= CAMERA.phoneMax; VIEW.unit = h / 100;
  VIEW.footerY = null;
  const availH = h - m - (tlH + 10);
  VIEW.s0 = Math.min((w - 2 * m) / MAP.w, (availH - m) / MAP.h);
  VIEW.ox = (w - MAP.w * VIEW.s0) / 2; VIEW.oy = m + (availH - m - MAP.h * VIEW.s0) / 2;
  VIEW.sT = VIEW.s0 * (VIEW.phone ? CAMERA.pushScalePhone : CAMERA.pushScale);
  if (TRIP_EL.scrim) TRIP_EL.scrim.style.height = WORLD.scrim[VIEW.phone ? 1 : 0] + 'px';
}
// A glide's path table is about 2,000 camera samples: at rest, build the glides either side of the beat, one per task (M5-1).
let glideWarmTimer = null;
export function tripWarmGlides(P) {
  if (typeof setTimeout !== 'function') return;
  clearTimeout(glideWarmTimer);
  const queue = GLIDES.filter(g => Math.abs(g.a - P) < 1e-6 || Math.abs(g.b - P) < 1e-6);
  const step = () => { const g = queue.shift(); if (!g) return; glidePath(g, .5); glideWarmTimer = setTimeout(step, STEPS.glide.warmGap * 1000); glideWarmTimer?.unref?.(); };
  glideWarmTimer = setTimeout(step, STEPS.glide.warmDelay * 1000); glideWarmTimer?.unref?.();
}
const camOverview = () => ({ cx: MAP.w / 2, cy: MAP.h / 2, s: VIEW.s0, ax: VIEW.ox + MAP.w / 2 * VIEW.s0, ay: VIEW.oy + MAP.h / 2 * VIEW.s0 });
const camTrip = (u, zoom) => { const c = smoothCenter(u); return { cx: c[0], cy: c[1], s: VIEW.sT * zoom, ax: CAMERA.anchorX * VIEW.w, ay: CAMERA.anchorY * VIEW.h }; };
export function tripStopCamera(i, zoom = CAMERA.holdZoom) {
  const pos = VIEW.cards[i]; if (!pos) return camTrip(STOP_U[i], zoom);
  const p = MAP.waypoints[STOPS[i].w], size = Math.max(MARK.min, Math.min(MARK.max, MARK.k * VIEW.sT * zoom));
  return { cx: p[0], cy: p[1], s: VIEW.sT * zoom, ax: pos.sx, ay: pos.sy + size / 2 + MARK.stand };
}
const camMix = (a, b, t) => ({ cx: lerp(a.cx, b.cx, t), cy: lerp(a.cy, b.cy, t), s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), t)), ax: lerp(a.ax, b.ax, t), ay: lerp(a.ay, b.ay, t) });
const camFinal = c => ({ s: c.s, tx: c.ax - c.cx * c.s, ty: c.ay - c.cy * c.s, ax: c.ax, ay: c.ay });

export const labelScale = (kind, s, phone = VIEW.phone) => { const L = LABELS[kind]; return Math.max(1, (phone ? L.phone : L.floor) / (L.unit * s)); };
// The X beat's view. Phones: the X and its label centred across the screen at the trip's scale, as low as lets the map's
// bottom edge rest on the floor above the timeline (inside the xBand). Portrait tablets keep the desktop scale and the floor.
export function tripXCamera() {
  const band = CAMERA.xBand;
  if (VIEW.phone) {
    const g = CAMERA.xGroupPhone, h = VIEW.h - STEPS.nav.bar, s = Math.min(VIEW.sT, (VIEW.w - 2 * CAMERA.xMargin) / (g[1] - g[0]));
    const floor = h - CAMERA.timeline - CAMERA.xGap, ay = Math.max(band[0] * h, Math.min(band[1] * h, floor - (CAMERA.frameBottom - MAP.x[1]) * s));
    return { cx: MAP.x[0] + (g[0] + g[1]) / 2, cy: MAP.x[1], s, ax: VIEW.w / 2, ay };
  }
  const base = camTrip(X_U, 1), floor = VIEW.h - CAMERA.timeline - STEPS.nav.gap - STEPS.nav.h - CAMERA.xGap;
  base.ay = CAMERA.xAnchorY * VIEW.h;
  const fit = (floor - base.ay) / (CAMERA.frameBottom - base.cy); base.s = Math.max(VIEW.sT * CAMERA.xFloor, Math.min(base.s, fit));
  if (VIEW.h > VIEW.w) base.ay = Math.max(base.ay, Math.min(band[1] * VIEW.h, floor - (CAMERA.frameBottom - base.cy) * base.s));
  return base;
}

// Each resting view owns one stretch of P. The clock is linear in this stretch;
// its single cosine-ramped ease drives camera, trail progress and the reversible card score.
const glideRests = [seqOf('overview').a + ACTS.overview / 2, ...STOPS.map((s, i) => progressForStop(i)), seqOf('rush').a];
export const GLIDES = glideRests.slice(1).map((b, i) => ({ a: glideRests[i], b, i,
  u0: i ? STOP_U[i - 1] : 0, u1: i < STOPS.length ? STOP_U[i] : X_U }));
const glideDistances = GLIDES.map(g => g.i ? g.u1 - g.u0 : STEPS.glide.overviewDistance);
export const glideSeconds = g => lerp(...(VIEW.phone ? STEPS.glide.secondsPhone : STEPS.glide.seconds), ((glideDistances[g.i] - Math.min(...glideDistances)) / (Math.max(...glideDistances) - Math.min(...glideDistances))) ** STEPS.glide.distancePower);
export const glideMove = (P0, P1) => {
  const lo = Math.min(P0, P1), hi = Math.max(P0, P1);
  const g = GLIDES.find(g => lo >= g.a - 1e-7 && hi <= g.b + 1e-7 && hi > lo);
  return g ? { P0, P1, D: glideSeconds(g) * (hi - lo) / (g.b - g.a), glide: true } : null;
};
const glideCache = new Map();
const glideView = (g, end) => g.i === 0 && !end ? camOverview() : g.i === STOPS.length && end ? tripXCamera() : tripStopCamera(end ? g.i : g.i - 1);
function glideRaw(g, q) {
  const A = glideView(g, false), B = glideView(g, true), G = STEPS.glide;
  let centre;
  if (!g.i) centre = [lerp(A.cx, B.cx, q), lerp(A.cy, B.cy, q)];
  else {
    // A broad Bezier through trail samples removes the polyline's tiny corners.
    const points = Array.from({ length: G.controls + 1 }, (_, i) => smoothCenter(lerp(g.u0, g.u1, i / G.controls)));
    const start = points[0].slice(), end = points.at(-1).slice();
    points.forEach((p, i) => p.forEach((v, k) => { p[k] += lerp([A.cx,A.cy][k] - start[k], [B.cx,B.cy][k] - end[k], i / G.controls); }));
    for (let n = points.length - 1; n > 0; n--) for (let i = 0; i < n; i++) points[i] = points[i].map((v, k) => lerp(v, points[i + 1][k], q));
    centre = points[0];
  }
  const depth = VIEW.depth && g.i ? Math.log(CAMERA.holdZoom / (1 - (VIEW.phone ? G.zoomOutPhone : G.zoomOut))) * Math.min(1, (g.u1 - g.u0) * ACTS.legPerUnit / G.zoomLength) : 0;
  return camFinal({ cx: centre[0], cy: centre[1], s: Math.exp(lerp(Math.log(A.s), Math.log(B.s), q) - depth * 4 * q * (1 - q)), ax: lerp(A.ax, B.ax, q), ay: lerp(A.ay, B.ay, q) });
}
function glidePath(g, distance) {
  if (distance <= 0) return 0;
  if (distance >= 1) return 1;
  const key = [g.i, VIEW.w, VIEW.h, VIEW.s0, VIEW.depth, ...VIEW.cards.flatMap(p => [p.sx, p.sy])].join('/');
  let table = glideCache.get(key);
  if (!table) {
    // Integrate the largest instantaneous screen velocity at the five test points.
    // Equal distance in this metric has no zoom/travel/zoom speed troughs.
    const points = [[.5,.5],[.25,.25],[.75,.25],[.25,.75],[.75,.75]].map(p => [p[0] * VIEW.w, p[1] * VIEW.h]);
    const N = STEPS.glide.samples; table = [0]; let before = glideRaw(g, 0);
    for (let i = 1; i <= N; i++) {
      const after = glideRaw(g, i / N), logScale = Math.log(after.s / before.s);
      const length = Math.max(...points.map(p => Math.hypot(after.tx - before.tx + (p[0] - (before.tx + after.tx) / 2) * logScale, after.ty - before.ty + (p[1] - (before.ty + after.ty) / 2) * logScale)));
      table.push(table.at(-1) + length); before = after;
    }
    glideCache.set(key, table);
  }
  const target = distance * table.at(-1); let lo = 0, hi = table.length - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (table[m] <= target) lo = m; else hi = m; }
  return (lo + (target - table[lo]) / (table[hi] - table[lo] || 1)) / (table.length - 1);
}
function glideState(st, g) {
  const t = clamp01((st.P - g.a) / (g.b - g.a)), r = STEPS.glide.ramp, width = 1 - 2 * r, swell = STEPS.glide.cruiseSwell, total = 1 - r + swell * width / 2;
  const onset = x => (x - r / Math.PI * Math.sin(Math.PI * x / r)) / (2 * total), x = t - r;
  const T = t < r ? onset(t) : t > 1 - r ? 1 - onset(1 - t) : (r / 2 + x + swell * (x / 2 - width / (4 * Math.PI) * Math.sin(2 * Math.PI * x / width))) / total;
  const q = glidePath(g, T), seconds = glideSeconds(g);
  st.glide = g.i; st.glideT = t; st.u = lerp(g.u0, g.u1, q);
  st.cardK.fill(0);
  if (g.i) st.cardK[g.i - 1] = 1 - smooth(0, STEPS.glide.fold, t * seconds);
  if (g.i < STOPS.length) st.cardK[g.i] = smooth(seconds - Math.min(STEPS.glide.open, STEPS.glide.openWindow), seconds, t * seconds);
  st.dim = lerp(1, CAMERA.holdDim, Math.max(...st.cardK));
  return glideRaw(g, q);
}

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
  const glide = GLIDES.find(g => P >= g.a && P < g.b);
  if (glide) {
    const camera = glideState(st, glide);
    cam = { ...camera, cx: (camera.ax - camera.tx) / camera.s, cy: (camera.ay - camera.ty) / camera.s };
  } else if (['hero', 'handoff', 'overview'].includes(seg.kind)) cam = camOverview();
  else if (seg.kind === 'pushIn') cam = camMix(camOverview(), camTrip(0, 1), easeIO(st.t));
  else if (seg.kind === 'hold') {
    st.u = STOP_U[seg.i];
    const z = smooth(HOLD.zoomIn[0], HOLD.zoomIn[1], st.t) * (1 - smooth(HOLD.zoomOut[0], HOLD.zoomOut[1], st.t));
    st.zoom = 1 + (CAMERA.holdZoom - 1) * z; st.dim = lerp(1, CAMERA.holdDim, z);
    st.cardK[seg.i] = smooth(HOLD.open[0], HOLD.open[1], st.t) * (1 - smooth(HOLD.fold[0], HOLD.fold[1], st.t));
    cam = tripStopCamera(seg.i, st.zoom);
  } else if (seg.kind === 'leg' || seg.kind === 'legX') {
    const u0 = STOP_U[seg.i], u1 = seg.kind === 'leg' ? STOP_U[seg.i + 1] : X_U;
    const arc = VIEW.depth ? DEPTH.arc * Math.min(1, seg.len / DEPTH.arcLen) * Math.sin(Math.PI * st.t) ** 2 : 0;
    st.u = lerp(u0, u1, easeIO(st.t)); cam = camTrip(st.u, 1 - arc);
    if (seg.kind === 'legX') cam = camMix(cam, tripXCamera(), easeIO(smooth(...CAMERA.xEase, st.t)));
  } else { // footer acts: X fixed, anchor slides
    st.u = X_U; const base = tripXCamera(), startAX = base.ax, startAY = base.ay;
    const fx = VIEW.phone ? CAMERA.footerXPhone : CAMERA.footerX;
    const e1 = easeIO(st.rushT), e2 = easeIO(smooth(0, .8, st.settleT));
    base.cx = lerp(base.cx, MAP.x[0], e1); base.cy = lerp(base.cy, MAP.x[1], e1);
    base.ax = lerp(lerp(startAX, VIEW.w / 2, e1), fx[0] * VIEW.w, e2);
    base.ay = lerp(lerp(startAY, VIEW.h / 2, e1), VIEW.phone && VIEW.footerY !== null ? VIEW.footerY : fx[1] * VIEW.h, e2);
    const push = novaBuild(st.rushT).push * (1 - clamp01(st.blastT * STEPS.pace.blast / NOVA.build.recoil)) ** 3;
    base.ax -= (MAP.x[0] - base.cx) * base.s * push; base.ay -= (MAP.x[1] - base.cy) * base.s * push;
    base.s *= 1 + push;
    cam = base;
  }
  st.inTrip = st.pushT > 0 || !!glide && P > glide.a;
  st.cam = camFinal(cam); st.tripS = st.cam.s;
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
  TRIP_EL.labels = [...els.svg.querySelectorAll('.label-scale')].map(el => ({ el, kind: el.dataset.label, stopSub: el.dataset.stopSub === 'true', k: null }));
  TRIP_EL.rows = mapLabelRows().map(row => ({ row, el: els.svg.querySelector(`.label-anchor[data-row="${row.i}"]`), stop: STOPS.findIndex(s => s.id === row.stop), o: '' })).filter(r => r.el);
  TRIP_EL.legend = [...els.svg.querySelectorAll('.lg')].map((el, i) => ({ el, p: LABELS.legendAt[i], n: Object.values(COPY.legend)[i].length, o: '' }));
  TRIP_EL.t2 = [...els.svg.querySelectorAll('.t2b')].map(el => ({ el, b: String(el.dataset?.b || el.getAttribute?.('data-b') || '').split(' ').map(Number), o: '' })).filter(t => t.b.length === 4 && t.b.every(Number.isFinite));
  TRIP_EL.title = els.svg.querySelector('.map-title'); TRIP_EL.tier1 = els.svg.querySelector('.map-tier1'); TRIP_EL.tier2 = els.svg.querySelector('.map-tier2'); TRIP_EL.subs = els.svg.querySelector('.map-subs');
  TRIP_EL.secondary = [...els.svg.querySelectorAll('.map-tier2')]; if (!TRIP_EL.secondary.length) TRIP_EL.secondary = [TRIP_EL.tier2];
  TRIP_EL.focusFade = null;
  TRIP_EL.scrim = document.createElement('div'); TRIP_EL.scrim.className = 'stage-scrim'; TRIP_EL.scrim.setAttribute('aria-hidden', 'true'); TRIP_EL.scrim.style.height = WORLD.scrim[VIEW.phone ? 1 : 0] + 'px'; TRIP_EL.scrim.style.background = 'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--ink) ' + WORLD.scrim[2] * 100 + '%, transparent))'; els.svg.parentElement.appendChild(TRIP_EL.scrim);
  TRIP_EL.coasts = [...els.svg.querySelectorAll('.coast')];
  TRIP_EL.coastLen = [polyLen(COAST_A, 1), polyLen(COAST_B, 1)];
  TRIP_EL.ship = els.svg.querySelector('.ls-ship');
  // 24 px stone targets (B-9): overlapping ones (the HMC stops) push apart along the axis that parts them, the dots stay put.
  // 104 / 600: the mini-map's CSS width over the map's (25: 24 and its 1 px border's share).
  const mm = STOPS.map(s => MAP.waypoints[s.w].map(v => v * 104 / 600)), off = mm.map(() => [0, 0]);
  for (let n = 0; n < 12; n++) mm.forEach((a, i) => mm.forEach((b, j) => { if (j <= i) return; const p = [0, 1].map(k => a[k] + off[i][k] - b[k] - off[j][k]), k = +(Math.abs(p[1]) >= Math.abs(p[0])), o = 25 - Math.abs(p[k]); if (Math.abs(p[1 - k]) < 25 && o > 0) { const m = Math.sign(p[k] || 1) * o / 2; off[i][k] += m; off[j][k] -= m; } }));
  els.mini.innerHTML = `<svg viewBox="0 0 600 900" aria-hidden="true">${miniMapSvg()}<rect class="mm-view" x="0" y="0" width="1" height="1"/><circle class="mm-trav" r="10"/></svg>`
    + STOPS.map((s, i) => `<button class="mm-stop" data-i="${i}" style="left:${(MAP.waypoints[s.w][0] / 6).toFixed(2)}%;top:${(MAP.waypoints[s.w][1] / 9).toFixed(2)}%;--ox:${off[i][0].toFixed(1)}px;--oy:${off[i][1].toFixed(1)}px" aria-label="${COPY.stoneGo.replace('{name}', s.name).replace('{dates}', s.dates)}"><i></i></button>`).join('');
  TRIP_EL.mmView = els.mini.querySelector('.mm-view'); TRIP_EL.mmTrav = els.mini.querySelector('.mm-trav');
  TRIP_EL.mmStops = [...els.mini.querySelectorAll('.mm-stop')];
}
const tripWrites = new WeakMap();
function tripWrite(el, key, value, attribute = false) {
  const text = String(value), cache = tripWrites.get(el) || {}; tripWrites.set(el, cache);
  const slot = (attribute ? 'attr:' : 'style:') + key;
  if (cache[slot] === text) return; cache[slot] = text;
  if (attribute) el.setAttribute(key, text); else el.style[key] = text;
}
// The coasts draw over WORLD.coastDraw of the fall, slowing as they close; coastAt is the inverse, for the coast stars.
export const coastDrawn = h => { const [a, b] = WORLD.coastDraw, x = clamp01((h - a) / (b - a)); return x * (2 - x); };
export const coastAt = u => { const [a, b] = WORLD.coastDraw; return a + (b - a) * (1 - Math.sqrt(1 - clamp01(u))); };
// Labels give way (polish round 1): a stop's label fades as its card opens (L-6) and the map's other words dim (L-8); all of
// them fade under the timeline, the step bar and a find's hint, and off the screen's sides (K-2, L-17). Explore frees them.
function tripLabels(st) {
  const E = TRIP_EL, c = st.cam, phone = VIEW.phone, L = LABELS, open = Math.max(0, ...st.cardK), dim = 1 - L.cardDim[phone ? 1 : 0];
  const free = !!st.exploring || st.exploreK > 0, lift = st.focusK > 0 ? L.hint : 0, timeline = VIEW.h - (phone ? STEPS.nav.bar : 0) - CAMERA.timeline;
  const floor = phone ? timeline - lift : timeline, bar = phone ? null : [VIEW.w / 2 - L.bar[0], timeline - STEPS.nav.gap - STEPS.nav.h - L.bar[1] - lift, VIEW.w / 2 + L.bar[0]];
  const gone = b => { const x0 = b[0] * c.s + c.tx, x1 = b[2] * c.s + c.tx, y0 = b[1] * c.s + c.ty, y1 = b[3] * c.s + c.ty, tall = Math.max(1, y1 - y0);
    let under = clamp01((y1 - floor) / tall);
    if (bar && x1 > bar[0] && x0 < bar[2]) under = Math.max(under, clamp01((y1 - bar[1]) / tall));
    return (1 - smooth(0, L.underFade, under)) * (1 - smooth(0, L.sideFade, Math.max(-x0, x1 - VIEW.w) / Math.max(1, x1 - x0))); };
  const put = (r, o) => { const v = o > .995 ? '' : o.toFixed(3); if (v !== r.o) { r.o = v; r.el.style.opacity = v; } };
  E.rows.forEach(r => {
    let o = 1;
    if (r.stop >= 0) { let other = 0; st.cardK.forEach((k, i) => { if (i !== r.stop && k > other) other = k; }); o = (1 - st.cardK[r.stop]) * (1 - dim * other); }
    else o = 1 - dim * open;
    if (!free && o > 0) o *= gone(mapLabelBox(r.row, c.s, phone));
    put(r, o);
  });
  const u = L.legend.unit * labelScale('legend', c.s), back = 1 - dim * open;
  (E.t2 || []).forEach(t => put(t, free ? 1 : back * gone(t.b)));
  (E.legend || []).forEach(g => put(g, free ? 1 : back * gone([g.p[0], g.p[1] - u * L.ascent, g.p[0] + g.n * u * L.width, g.p[1] + u * L.descent])));
}
export function tripApply(st) {
  const E = TRIP_EL, c = st.cam;
  if (E.rows) tripLabels(st);
  const labelFade = smooth(...LABELS.fade, c.s / VIEW.s0);
  E.labels.forEach(label => { const k = labelScale(label.kind, c.s); if (label.k === null || Math.abs(k / label.k - 1) > LABELS.epsilon) { label.el.setAttribute('transform', 'scale(' + k + ')'); label.k = k; } });
  const focusFade = 1 - smooth(0, .4, st.focusK || 0);
  if (E.focusFade === null || Math.abs(focusFade - E.focusFade) > .01 || (focusFade === 0 || focusFade === 1) && focusFade !== E.focusFade) {
    E.focusFade = focusFade;
    for (const group of [E.tier1, E.subs]) if (group) { tripWrite(group, 'opacity', focusFade); tripWrite(group, 'visibility', focusFade === 0 ? 'hidden' : 'visible'); }
  }
  E.secondary.forEach(group => { tripWrite(group, 'opacity', labelFade); tripWrite(group, 'visibility', labelFade === 0 ? 'hidden' : 'visible'); }); tripWrite(E.scrim, 'opacity', labelFade);
  tripWrite(E.cam, 'transform', `matrix(${c.s.toFixed(4)} 0 0 ${c.s.toFixed(4)} ${c.tx.toFixed(2)} ${c.ty.toFixed(2)})`, true);
  const h = st.handoffT, fade = 1 - smooth(...DEPTH.fade.blast, st.blastT) * (1 - (st.exploreK || 0));
  tripWrite(E.sea, 'opacity', smooth(...DEPTH.fade.sea, h)); tripWrite(E.fill, 'opacity', smooth(.25, .75, h));
  tripWrite(E.detail, 'opacity', smooth(.45, .95, h)); tripWrite(E.finds, 'opacity', smooth(.5, 1, h));
  tripWrite(E.coastG, 'opacity', 1);
  const dr = coastDrawn(h);
  E.coasts.forEach((p, i) => { if (dr >= 1) { tripWrite(p, 'strokeDasharray', 'none'); return; } const L = E.coastLen[i] * c.s; tripWrite(p, 'strokeDasharray', `${L.toFixed(1)} ${L.toFixed(1)}`); tripWrite(p, 'strokeDashoffset', (L * (1 - dr)).toFixed(1)); });
  // solid trail behind the traveller (dash in screen units because the stroke does not scale)
  const L = TRAIL_LEN * c.s; tripWrite(E.done, 'strokeDasharray', `${L.toFixed(1)} ${L.toFixed(1)}`); tripWrite(E.done, 'strokeDashoffset', (st.exploreK ? 0 : (TRAIL_LEN - st.u) * c.s).toFixed(1));
  tripWrite(E.done, 'opacity', st.inTrip ? 1 : 0);
  // the longship rides the crossing
  const sp = pointAt(Math.max(WATER[0], Math.min(WATER[1], st.u))); tripWrite(E.ship, 'transform', `translate(${n2(sp[0])} ${n2(sp[1] + 5)}) scale(.55)`, true);
  const opacity = st.dim * fade;
  tripWrite(E.svg, 'opacity', opacity); tripWrite(E.svg, 'visibility', opacity === 0 ? 'hidden' : 'visible');
  tripWrite(E.svg, 'willChange', fade > 0 && fade < 1 ? 'opacity' : '');
  tripWrite(E.caption, 'opacity', 1 - smooth(0, .3, h));
  // the X fades in with the sea, so neither page shows it before the map exists
  if (E.x) tripWrite(E.x, 'opacity', h < 1 ? smooth(.2, .7, h).toFixed(3) : '');
  // In explore the title fades as the camera zooms in past the overview, before it can grow huge and run off the screen (Dan's recording, 2026-11-24).
  if (E.title) { const t = (1 - smooth(...WORLD.titleOut, st.pushT) * (1 - (st.exploreK || 0))) * (1 - (st.exploreK || 0) * smooth(...WORLD.titleZoom, c.s / VIEW.s0)); tripWrite(E.title, 'opacity', t); tripWrite(E.title, 'visibility', t === 0 ? 'hidden' : 'visible'); }
  tripWrite(E.cue, 'opacity', smooth(.2, .5, st.overviewT) * (1 - smooth(0, .3, st.pushT)));
  // mini-map
  const mo = smooth(.5, 1, st.pushT) * (1 - smooth(0, .4, st.rushT));
  tripWrite(E.mini, 'opacity', mo); tripWrite(E.mini, 'visibility', mo > .01 ? 'visible' : 'hidden');
  if (mo > .01) {
    tripWrite(E.mmView, 'transform', `translate(${n2(-c.tx / c.s)} ${n2(-c.ty / c.s)}) scale(${n2(VIEW.w / c.s)} ${n2(VIEW.h / c.s)})`, true);
    const tp = pointAt(st.u); tripWrite(E.mmTrav, 'transform', `translate(${n2(tp[0])} ${n2(tp[1])})`, true);
  }
}
const n2 = v => v.toFixed(2);
export function tripMiniVisited(st) { TRIP_EL.mmStops.forEach((b, i) => b.classList.toggle('on', st.visited[i])); }

// Rewrites only the frame's camera and card strength; progress and traveller stay on the trail.
export function tripFocus(st, view, k) {
  if (k === 0) return;
  const F = FIND_PLAY.focus, [x, y, r, least = F.least] = view;
  const target = Math.max(Math.max(VIEW.s0, least * VIEW.sT), Math.min(F.most * VIEW.sT, F.fill * Math.min(VIEW.w, VIEW.h) / (2 * r)));
  const before = toScreen(st, [x, y]), at = [F.at[0] * VIEW.w, F.at[1] * VIEW.h];
  const s = st.cam.s * (target / st.cam.s) ** k;
  st.cam = { s, tx: lerp(before[0], at[0], k) - x * s, ty: lerp(before[1], at[1], k) - y * s, ax: lerp(st.cam.ax, at[0], k), ay: lerp(st.cam.ay, at[1], k) };
  st.cardK = st.cardK.map(v => v * (1 - k)); st.cardOpen *= 1 - k; st.dim = lerp(st.dim, 1, k);
  st.focusK = k;
}
