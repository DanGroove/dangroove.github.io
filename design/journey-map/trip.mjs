// Scroll progress, acts, camera, traveller. Everything here is a pure function of progress P (in viewport heights).
import { FINDS, ACTS, CAMERA, HOLD, MAP, STOPS, COPY, DEPTH, FIND_PLAY, LABELS, WORLD, STEPS, NOVA, MARK, CARD_TAIL, FRAME_PERF, COMB, EXPLORE, FIND_COPY } from './data.mjs';
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
// A berth in the open-water lane south of the ring, shared by drawing, hit
// target, focus view and popup. Only the ship is offset from the route.
export const longshipPoint = u => { const B = FIND_PLAY.kit.shipBerth, p = pointAt(Math.max(WATER[0] + B[0], Math.min(WATER[1] - B[1], u))); return [p[0], p[1] + B[2]]; };
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
export const VIEW = { w: 1, h: 1, phone: false, s0: 1, ox: 0, oy: 0, sT: 1, unit: 1, depth: 1, footerY: null, cards: [], stageTop: 0, mapReady: true };
export function tripCardPlace(height, steps = true, reviewFloor = WORLD.card.gap) {
  const Q = WORLD.card, stone = Math.max(MARK.min, Math.min(MARK.max, MARK.k * VIEW.sT * CAMERA.holdZoom)), rim = stone * (MARK.radius + MARK.rim / 2) / MARK.box;
  // Short landscape screens keep the shorter link, so the card keeps its width and still fits above the buttons.
  const len = VIEW.h <= 440 ? CARD_TAIL.lenShort : CARD_TAIL.len;
  const width = VIEW.phone ? VIEW.w : Math.min(Q.w + (VIEW.h <= 440 ? 96 : 0), VIEW.w - 2 * Q.edge - stone / 2 - rim - len);
  const floor = VIEW.phone ? VIEW.h - Q.phoneBottom - (steps ? STEPS.nav.bar : 0) : steps ? VIEW.h - 56 - STEPS.nav.gap - STEPS.nav.h - Q.gap : VIEW.h - Q.gap;
  const left = VIEW.phone ? 0 : (VIEW.w - (stone / 2 + rim + len + width)) / 2;
  const top = VIEW.phone ? floor - height : Math.max(reviewFloor, Math.min(VIEW.h / 2 - Q.gap - height / 2, floor - height));
  // Phones: the shield sits high enough over the docked card for the whole leader (ring gap, the shortest line, edge gap).
  const lead = MARK.ringGap + MARK.ringWidth + CARD_TAIL.ringGap + CARD_TAIL.minLine + CARD_TAIL.edgeGap;
  const sx = VIEW.phone ? VIEW.w / 2 : left + stone / 2, sy = VIEW.phone ? top - lead - rim : top + height / 2;
  return { w: width, h: height, x: VIEW.phone ? VIEW.w / 2 : sx + rim + len + width / 2, y: top + height / 2, sx, sy };
}
export function tripVisible(st, box) {
  if (st.reduced && !VIEW.mapReady || st.handoffT < 1 || st.blastT > 0 && !st.exploreK) return false;
  const c = st.cam, top = st.reduced ? VIEW.stageTop : 0, b = [box[0] * c.s + c.tx, box[1] * c.s + c.ty + top, box[2] * c.s + c.tx, box[3] * c.s + c.ty + top];
  const floor = VIEW.h - (st.reduced ? 56 : VIEW.phone ? STEPS.nav.bar + 44 : 56 + STEPS.nav.h + STEPS.nav.gap);
  return b[0] >= 0 && b[2] <= VIEW.w && b[1] >= 40 && b[3] <= floor;
}
export function tripCardCover(st, box, except = -1) {
  if (st.cardOpen === 0) return 0;
  const c = st.cam, b = [box[0] * c.s + c.tx, box[1] * c.s + c.ty, box[2] * c.s + c.tx, box[3] * c.s + c.ty];
  const cards = st.coverRects ||= VIEW.cards.map((p,i) => ({ p, i, k: st.cardK[i] })).filter(r => r.k > 0 && r.p.h);
  let cover = 0;
  cards.forEach(({p,i,k}) => { if (i !== except && b[0] < p.x + p.w / 2 && b[2] > p.x - p.w / 2 && b[1] < p.y + p.h / 2 && b[3] > p.y - p.h / 2) cover = Math.max(cover, k); });
  return cover;
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
  if (TRIP_EL.base) tripBaseBox(w, h);
}
// The base's svg reaches FRAME_PERF.baseMargin screens past each edge, with its corner on a whole device pixel. Its layer
// is hinted, and the compositor does not snap a hinted layer: with overflow visible the layer started at the drawing's
// own corner, which mostly fell between device pixels and drew the whole base slightly soft at rest (cloud review of 10b).
const NO_BOX = { ox: 0, oy: 0 };
function tripBaseBox(w, h) {
  const dpr = globalThis.devicePixelRatio || 1, edge = n => {
    const want = Math.ceil(n * FRAME_PERF.baseMargin); let best = want, err = 1;
    for (let m = want; m < want + 64 && err > 1e-6; m++) { const e = Math.abs(m * dpr - Math.round(m * dpr)); if (e < err) { best = m; err = e; } }
    return best; };
  const ox = edge(w), oy = edge(h), el = TRIP_EL.base;
  VIEW.baseBox = { ox, oy };
  el.setAttribute('width', w + 2 * ox); el.setAttribute('height', h + 2 * oy); el.setAttribute('viewBox', `${-ox} ${-oy} ${w + 2 * ox} ${h + 2 * oy}`);
  Object.assign(el.style, { left: -ox + 'px', top: -oy + 'px', width: w + 2 * ox + 'px', height: h + 2 * oy + 'px', transformOrigin: `${ox}px ${oy}px` });
}
// A glide's path table is about 2,000 camera samples: at rest, build the glides either side of the beat, one per task (M5-1).
let glideWarmTimer = null;
export function tripWarmGlides(P) {
  if (typeof setTimeout !== 'function') return;
  clearTimeout(glideWarmTimer);
  const queue = GLIDES.filter(g => Math.abs(g.a - P) < 1e-6 || Math.abs(g.b - P) < 1e-6);
  const step = () => { if(globalThis.window?.__jm?.moving){glideWarmTimer=setTimeout(step,120);glideWarmTimer?.unref?.();return;} const g = queue.shift(); if (!g) return; glidePath(g, .5); glideWarmTimer = setTimeout(step, STEPS.glide.warmGap * 1000); glideWarmTimer?.unref?.(); };
  glideWarmTimer = setTimeout(step, STEPS.glide.warmDelay * 1000); glideWarmTimer?.unref?.();
}
const camOverview = () => ({ cx: MAP.w / 2, cy: MAP.h / 2, s: VIEW.s0, ax: VIEW.ox + MAP.w / 2 * VIEW.s0, ay: VIEW.oy + MAP.h / 2 * VIEW.s0 });
const camTrip = (u, zoom) => { const c = smoothCenter(u); return { cx: c[0], cy: c[1], s: VIEW.sT * zoom, ax: CAMERA.anchorX * VIEW.w, ay: CAMERA.anchorY * VIEW.h }; };
export function tripStopCamera(i, zoom = CAMERA.holdZoom) {
  const pos = VIEW.cards[i]; if (!pos) return camTrip(STOP_U[i], zoom);
  const p = MAP.waypoints[STOPS[i].w], size = Math.max(MARK.min, Math.min(MARK.max, MARK.k * VIEW.sT * zoom));
  return { cx: p[0], cy: p[1], s: VIEW.sT * zoom, ax: pos.sx, ay: pos.sy + (size / 2 + MARK.stand) * MARK.lift };
}
const camMix = (a, b, t) => ({ cx: lerp(a.cx, b.cx, t), cy: lerp(a.cy, b.cy, t), s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), t)), ax: lerp(a.ax, b.ax, t), ay: lerp(a.ay, b.ay, t) });
const camFinal = c => ({ s: c.s, tx: c.ax - c.cx * c.s, ty: c.ay - c.cy * c.s, ax: c.ax, ay: c.ay });

export const labelScale = (kind, s, phone = VIEW.phone) => { const L = LABELS[kind]; return Math.max(1, (phone ? L.phone : L.floor) / (L.unit * s)); };

// COMB-T, 2026-11-27: reuse local boxes at the label writer's exact scale.
function tripLegendLayout(k){
  const E=TRIP_EL,L=E.legendLayout;if(!L||VIEW.h<=440&&VIEW.w>640)return;
  const inside=8/VIEW.s0,gap=16/VIEW.s0,total=L.boxes.reduce((n,b,i)=>n+L.sym[i].width+inside+b.width*k,0)+3*gap;
  let x=300-total/2;
  E.legend.forEach((g,i)=>{const b=L.boxes[i],sg=L.sym[i],symbol=L.symbols[i];
    tripWrite(symbol.el,'transform','translate('+(x-sg.x)+' '+(864-(sg.y+sg.height/2))+') '+symbol.base,true);
    g.place=g.p=[x+sg.width+inside-b.x*k,864+L.mid*k];g.box=b;
    tripWrite(g.el,'transform','translate('+g.p.join(' ')+')',true);
    x+=sg.width+inside+b.width*k+gap;
  });
}
// The X beat's view. Phones: the X and its label centred across the screen at the trip's scale, as low as lets the map's
// bottom edge rest on the floor above the timeline (inside the xBand). Portrait tablets keep the desktop scale and the floor.
export function tripXCamera(frameGroup = true) {
  const band = CAMERA.xBand;
  // Frame the actual group, including the whole Toronto skyline. Keep the
  // pre-existing footer/build-up anchor and score; only this resting view fits.
  const group = [MAP.x[0] - 20, MAP.toronto.box[1] - 12, MAP.toronto.box[2] + 12, MAP.x[1] + 38];
  const room = VIEW.h - (VIEW.phone ? STEPS.nav.bar + 44 : 56 + STEPS.nav.h + STEPS.nav.gap) - 64;
  const fitGroup = base => {
    const half = Math.max(MAP.x[0]-group[0],group[2]-MAP.x[0]);
    const fitted = Math.min(base.s,(VIEW.w/2-CAMERA.xMargin)/half,room/(group[3]-group[1]));
    const oldPhone = Math.min(base.s,(VIEW.w-2*CAMERA.xMargin)/(group[2]-group[0]),room/(group[3]-group[1]));
    const s = frameGroup ? Math.max(VIEW.phone ? CAMERA.xPhoneFloor*oldPhone : 0,fitted) : base.s;
    // Phones: the X stays centred unless that would cut the city; then it moves left just enough to show the whole skyline.
    const ax = VIEW.phone && frameGroup ? Math.max(CAMERA.xMargin+(MAP.x[0]-group[0])*s, Math.min(VIEW.w/2, VIEW.w-CAMERA.xMargin-(group[2]-MAP.x[0])*s)) : VIEW.w/2;
    return { ...base, cx:MAP.x[0], cy:MAP.x[1], ax, ay:base.ay+(MAP.x[1]-base.cy)*s, s };
  };
  if (VIEW.phone) {
    const g = CAMERA.xGroupPhone, h = VIEW.h - STEPS.nav.bar, s = Math.min(VIEW.sT, (VIEW.w - 2 * CAMERA.xMargin) / (g[1] - g[0]));
    const floor = h - CAMERA.timeline - CAMERA.xGap, ay = Math.max(band[0] * h, Math.min(band[1] * h, floor - (CAMERA.frameBottom - MAP.x[1]) * s));
    return fitGroup({ cx: MAP.x[0] + (g[0] + g[1]) / 2, cy: MAP.x[1], s, ax: VIEW.w / 2, ay });
  }
  const base = camTrip(X_U, 1), floor = VIEW.h - CAMERA.timeline - STEPS.nav.gap - STEPS.nav.h - CAMERA.xGap;
  base.ay = CAMERA.xAnchorY * VIEW.h;
  const fit = (floor - base.ay) / (CAMERA.frameBottom - base.cy); base.s = Math.max(VIEW.sT * CAMERA.xFloor, Math.min(base.s, fit));
  if (VIEW.h > VIEW.w) base.ay = Math.max(base.ay, Math.min(band[1] * VIEW.h, floor - (CAMERA.frameBottom - base.cy) * base.s));
  return fitGroup(base);
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
  st.handoffT = P < ACTS.hero + ACTS.handoff ? clamp01((P - ACTS.hero + COMB.handoverOverlap) / (ACTS.handoff + COMB.handoverOverlap)) : 1;
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
    if (glide.i === STOPS.length) {
      const traveller = pointAt(st.u), trail = tripStopCamera(STOPS.length-1), x = tripXCamera(), t = easeIO(smooth(...CAMERA.xEase,st.glideT));
      cam.cx = traveller[0]; cam.cy = traveller[1];
      cam.ax = lerp(trail.ax,x.ax,t); cam.ay = lerp(trail.ay,x.ay,t);
    }
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
    if (seg.kind === 'legX') {
      cam = camMix(cam, tripXCamera(), easeIO(smooth(...CAMERA.xEase, st.t)));
      const traveller = pointAt(st.u); cam.cx = traveller[0]; cam.cy = traveller[1];
    }
  } else { // footer acts: X fixed, anchor slides
    st.u = X_U; const base = camMix(tripXCamera(), tripXCamera(false), smooth((NOVA.handover.fadeIn + NOVA.handover.fadeOut) / STEPS.pace.rush, .3, st.rushT)), startAX = base.ax, startAY = base.ay;
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
export const TRIP_EL = {};
export function tripBuild(els) {
  Object.assign(TRIP_EL, els);
  TRIP_EL.labels = [...els.svg.querySelectorAll('.label-scale')].map(el => ({ el, kind: el.dataset.label, stopSub: el.dataset.stopSub === 'true', k: null }));
  TRIP_EL.rows = mapLabelRows().map(row => ({ row, el: els.svg.querySelector(`.label-anchor[data-row="${row.i}"]`), stop: STOPS.findIndex(s => s.id === row.stop), o: '' })).filter(r => r.el);
  TRIP_EL.legend = [...els.svg.querySelectorAll('.lg')].map((el, i) => ({ el, p: LABELS.legendAt[i], n: Object.values(COPY.legend)[i].length, o: '' }));
  TRIP_EL.t2 = [...els.svg.querySelectorAll('.t2b')].map(el => ({ el, b: String(el.dataset?.b || el.getAttribute?.('data-b') || '').split(' ').map(Number), o: '' })).filter(t => t.b.length === 4 && t.b.every(Number.isFinite));
  TRIP_EL.title = els.svg.querySelector('.map-title'); TRIP_EL.tier1 = els.svg.querySelector('.map-tier1'); TRIP_EL.tier2 = els.svg.querySelector('.map-tier2'); TRIP_EL.subs = els.svg.querySelector('.map-subs');
  if (TRIP_EL.subs?.parentElement) (els.rest || els.detail).appendChild(TRIP_EL.subs);
  TRIP_EL.secondary = [...els.svg.querySelectorAll('.map-tier2')]; if (!TRIP_EL.secondary.length) TRIP_EL.secondary = [TRIP_EL.tier2];
  TRIP_EL.secondaryText = TRIP_EL.secondary.filter(g => g !== TRIP_EL.tier2).flatMap(g => [...g.querySelectorAll('text')].map(el => ({ el, group: g, fill: Number(el.getAttribute('fill-opacity') ?? 1), stroke: Number(el.getAttribute('stroke-opacity') ?? 1) })));
  TRIP_EL.focusFade = null;
  TRIP_EL.scrim = document.createElement('div'); TRIP_EL.scrim.className = 'stage-scrim'; TRIP_EL.scrim.setAttribute('aria-hidden', 'true'); TRIP_EL.scrim.style.height = WORLD.scrim[VIEW.phone ? 1 : 0] + 'px'; TRIP_EL.scrim.style.background = 'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--ink) ' + WORLD.scrim[2] * 100 + '%, transparent))'; (els.svg.closest?.('.stage') || els.svg.parentElement).appendChild(TRIP_EL.scrim);
  const both = sel => [...(els.base ? els.base.querySelectorAll(sel) : []), ...els.svg.querySelectorAll(sel)];
  TRIP_EL.coasts = both('.coast');
  TRIP_EL.coastLen = [polyLen(COAST_A, 1), polyLen(COAST_B, 1)];
  TRIP_EL.ship = els.svg.querySelector('.ls-ship');
  TRIP_EL.markers = [...els.svg.querySelectorAll('.mk-size')];
  TRIP_EL.symbols = [...els.svg.querySelectorAll('.legend-symbol')].map(el => ({ el, base: el.getAttribute('transform') || '' }));
  TRIP_EL.ticks = both('.coast-ticks, .frame-ticks');
  // 24 px stone targets (B-9): overlapping ones (the HMC stops) push apart along the axis that parts them, the dots stay put.
  // 104 / 600: the mini-map's CSS width over the map's (25: 24 and its 1 px border's share).
  const mm = STOPS.map(s => MAP.waypoints[s.w].map(v => v * 104 / 600)), off = mm.map(() => [0, 0]);
  for (let n = 0; n < 12; n++) mm.forEach((a, i) => mm.forEach((b, j) => { if (j <= i) return; const p = [0, 1].map(k => a[k] + off[i][k] - b[k] - off[j][k]), k = +(Math.abs(p[1]) >= Math.abs(p[0])), o = 25 - Math.abs(p[k]); if (Math.abs(p[1 - k]) < 25 && o > 0) { const m = Math.sign(p[k] || 1) * o / 2; off[i][k] += m; off[j][k] -= m; } }));
  els.mini.innerHTML = `<svg viewBox="0 0 600 900" aria-hidden="true">${miniMapSvg()}<rect class="mm-view" x="0" y="0" width="1" height="1"/><circle class="mm-trav" r="10"/></svg>`
    + STOPS.map((s, i) => `<button class="mm-stop" data-i="${i}" style="left:${(MAP.waypoints[s.w][0] / 6).toFixed(2)}%;top:${(MAP.waypoints[s.w][1] / 9).toFixed(2)}%;--ox:${off[i][0].toFixed(1)}px;--oy:${off[i][1].toFixed(1)}px" aria-label="${COPY.stoneGo.replace('{name}', s.name).replace('{dates}', s.dates)}"><i></i></button>`).join('');
  TRIP_EL.mmView = els.mini.querySelector('.mm-view'); TRIP_EL.mmTrav = els.mini.querySelector('.mm-trav');
  TRIP_EL.mmStops = [...els.mini.querySelectorAll('.mm-stop')];
  globalThis.window?.addEventListener('jm-explore', () => {
    const on = document.documentElement.classList.contains('jm-explore');
    if (TRIP_EL.exploreOn === on) return;
    TRIP_EL.exploreOn = on;
    // Ink placement is warmed before this input task.
    for (const r of TRIP_EL.rows) if (r.exploreMarkup) r.el.querySelector('text').innerHTML = TRIP_EL.exploreOn ? r.exploreMarkup : r.normalMarkup;
  });
}
// Font metrics and the placed card boxes are read only at resize/font boundaries.
export function tripMeasureLabels() {
  const E = TRIP_EL; if (!E.rows) return;
  for (const r of E.rows) {
    const text = r.el.querySelector('text'), row = r.row, pos = COMB.labels[row.stop];
    text.setAttribute('text-anchor', row.anchor || 'start');
    if (r.exploreMarkup && E.exploreOn) text.innerHTML = r.normalMarkup;
    if (row.stop === 'x' && !row.stopSub) text.textContent = COPY.xLabel;
    r.base = pos ? [pos[0], pos[1] + (row.stopSub ? 18 : 0)] : [row.x, row.y];
    if (row.stop === 'x') r.base[1] = MAP.x[1] + (row.stopSub ? 14 : -4);
    if (row.stop === 'hmc1' || row.stop === 'hmc2') { r.base = [574, (row.stop === 'hmc1' ? 253 : 350) + (row.stopSub ? 18 : 0)]; text.setAttribute('text-anchor', 'end'); }
    r.box = text.getBBox ? text.getBBox() : null;
    if (r.box && typeof DOMPoint !== 'undefined') {
      r.normalMarkup = text.innerHTML;
      r.exploreMarkup = null; r.exploreBox = r.box;
    }
    r.overview = r.base.slice();
    if (row.stopSub) r.overview[1] += Math.max(0, 16 / VIEW.s0 - 18);
    if (row.stop === 'x' && row.stopSub) r.overview[1] = MAP.x[1] - 4 + 14 / VIEW.s0;
    if (VIEW.h <= 440 && VIEW.w > 640 && row.stop !== 'x') {
      const i = STOPS.findIndex(s => s.id === row.stop), left = i < 3;
      r.overview = [(left ? VIEW.w * .23 : VIEW.w * .76) / VIEW.s0 - VIEW.ox / VIEW.s0, (120 + i % 3 * 56 + (row.stopSub ? 16 : 0) - VIEW.oy) / VIEW.s0];
      text.setAttribute('text-anchor', 'middle');
      r.box = text.getBBox ? text.getBBox() : r.box; r.exploreBox = r.box;
    }
  }
  E.markers?.forEach(el => el.setAttribute('transform', `scale(${COMB.markerPx / (12.4 * (el.parentElement?.parentElement?.dataset.screen ? 1 : VIEW.s0))})`));
  const kicker = E.title?.querySelector('.kick');
  if (kicker) {
    const lines = VIEW.h <= 720 || VIEW.phone ? COPY.kicker.split(', ') : [COPY.kicker];
    kicker.innerHTML = lines.map((t,i) => `<tspan x="0" y="${i * 9}">${t}${i < lines.length-1 ? ', ' : ''}</tspan>`).join('');
    const host = kicker.closest('.label-scale'), width = Math.min(200, MAP.w * VIEW.s0 * .6) / (VIEW.s0 * labelScale('small', VIEW.s0));
    host?.querySelector('path')?.setAttribute('d', `M0 ${lines.length > 1 ? 15 : 8}h${width}`);
    host?.querySelector('rect')?.setAttribute('width', width + 6);
  }
  const short = VIEW.h <= 440 && VIEW.w > 640;
  if (E.title) {
    const title = E.title.querySelector('text');
    title?.setAttribute('font-size', short ? 20 / VIEW.s0 : 30);
    E.title.setAttribute('transform', short ? `translate(${(24 - VIEW.ox) / VIEW.s0 - 44} ${(55 - VIEW.oy) / VIEW.s0 - 78})` : '');
    kicker?.closest('.label-scale')?.parentElement.setAttribute('transform', `translate(45 ${short || VIEW.h <= 720 || VIEW.phone ? 78 + 19 / VIEW.s0 : 101})`);
  }
  if(short){
  E.legend?.forEach((g,i) => {
    const col = i > 1, line = i % 2;
    g.place = short ? [(VIEW.w * .78 - VIEW.ox) / VIEW.s0, (269 + i * 17 - VIEW.oy) / VIEW.s0] : [80 + (col ? 66 / VIEW.s0 : 0), 840.5 + line * 18 / VIEW.s0];
    g.el.setAttribute('transform', `translate(${g.place.join(' ')})`);
    g.p = g.place;
    const text = g.el.querySelector('text'); g.box = text?.getBBox?.();
  });
  E.symbols?.forEach(s => { const p = E.legend[+s.el.dataset.i].place; s.el.setAttribute('transform', `translate(${p[0] - 16 / VIEW.s0 - +s.el.dataset.x} ${p[1] - 3 / VIEW.s0 - +s.el.dataset.y}) ${s.base}`); });
  } else if(E.legend?.length&&E.symbols?.length&&typeof E.legend[0].el.querySelector('text')?.getBBox==='function'){
    const symbols=E.symbols.slice().sort((a,b)=>+a.el.dataset.i-+b.el.dataset.i),texts=E.legend.map(g=>g.el.querySelector('text'));
    symbols.forEach(s=>s.el.querySelector('.mk-size')?.setAttribute('transform','scale(1)'));
    texts.forEach(t=>{t.setAttribute('font-size',LABELS.legend.unit);t.setAttribute('text-rendering','geometricPrecision');});
    E.legendLayout={symbols,sym:symbols.map(s=>{const b=s.el.getBBox(),m=/translate\(([-\d.]+)[ ,]+([-\d.]+)\)/.exec(s.base);return{x:b.x+(+m?.[1]||0),y:b.y+(+m?.[2]||0),width:b.width,height:b.height};}),boxes:texts.map(t=>t.getBBox())};
    // Retain the overview's existing 8.5 px narrow-phone fallback, with T2's fixed gaps.
    const L=E.legendLayout,k=labelScale('legend',VIEW.s0),width=L.boxes.reduce((n,b,i)=>n+L.sym[i].width+b.width*k+8/VIEW.s0,0)+48/VIEW.s0;
    if(VIEW.phone&&width>506-15.1/VIEW.s0){const ratio=8.5/9;texts.forEach(t=>t.setAttribute('font-size',LABELS.legend.unit*ratio));L.boxes=L.boxes.map(b=>({x:b.x*ratio,y:b.y*ratio,width:b.width*ratio,height:b.height*ratio}));}
    const font=getComputedStyle(texts[0]),ctx=document.createElement('canvas').getContext('2d');
    ctx.font=font.fontStyle+' '+font.fontWeight+' '+font.fontSize+' '+font.fontFamily;
    const ink=ctx.measureText('x');E.legendLayout.mid=(ink.actualBoundingBoxAscent-ink.actualBoundingBoxDescent)/2;
    tripLegendLayout(labelScale('legend',VIEW.s0));
  }
  E.t2?.forEach(t => {
    const words = t.el.textContent;
    if (words.includes(COPY.ygg) || words.includes(COPY.well) || words.includes(COPY.wellSub)) t.el.classList.add('well-name');
    if (words.includes('HERE BE REVISIONS')) t.el.setAttribute('transform', 'translate(-46 -58)');
    if (words.includes('the diploma climb')) t.el.setAttribute('transform', 'translate(220 348) rotate(-75) translate(-238 -356)');
    if (words.includes('MOHAWKFJELL')) t.el.setAttribute('transform', 'translate(0 16)');
    if (t.el.getBBox && typeof DOMPoint !== 'undefined') { const b = t.el.getBBox(), m = t.el.transform.baseVal.consolidate()?.matrix, corners = [[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y]) => m ? new DOMPoint(x,y).matrixTransform(m) : {x,y}); t.b = [Math.min(...corners.map(p=>p.x))-2, Math.min(...corners.map(p=>p.y))-2, Math.max(...corners.map(p=>p.x))+2, Math.max(...corners.map(p=>p.y))+2]; }
  });
  E.exploreReady = false;
  tripMeasureExploreLabels();
  // Resize rebuilt the normal text while Explore is already open. Publish its fresh seed immediately.
  if (E.exploreOn) for (const r of E.rows) { if (r.exploreMarkup) r.el.querySelector('text').innerHTML = r.exploreMarkup; if (r.row.stop === 'x' && r.row.stopSub) r.exploreFrom = 0; }
}
// Chrome's point-at-length walk (svg_path_query.cc) in floats, once per path: walk(u) for rising u. Native calls re-walked the
// path each time: 2 of 3.2 ms of JS per frame at rest for a minute after load (2026-11-27). Same points to 0.0004; arcs stay native.
function pathWalk(d) {
  const F=Math.fround,tk=d.match(/[a-zA-Z]|[-+]?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g)||[],st=[];
  const len=(a,b,c,e)=>{const x=F(c-a),y=F(e-b);return F(Math.sqrt(x*x+y*y));},mid=(a,b)=>F(F(a+b)/2);
  let i=0,cmd='',x=0,y=0,sx=0,sy=0,cx=0,cy=0,prev='',T=0,part=0,mag=0,cur=null;
  const num=()=>F(+tk[i++]);
  const next=()=>{
    if(st.length){
      // halve a cubic until its control polygon is within 1e-8 of its chord (CurveLength)
      const [a0,b0,a1,b1,a2,b2,a3,b3,k]=st.pop(),l=F(F(len(a0,b0,a1,b1)+len(a1,b1,a2,b2))+len(a2,b2,a3,b3)),q=F(l-len(a0,b0,a3,b3));
      if(q*q/mag>1e-16&&k<20){
        const mx=mid(a1,a2),my=mid(b1,b2),l1x=mid(a0,a1),l1y=mid(b0,b1),r2x=mid(a2,a3),r2y=mid(b2,b3),l2x=mid(l1x,mx),l2y=mid(l1y,my),r1x=mid(r2x,mx),r1y=mid(r2y,my),ex=mid(l2x,r1x),ey=mid(l2y,r1y);
        st.push([ex,ey,r1x,r1y,r2x,r2y,a3,b3,k+1],[a0,b0,l1x,l1y,l2x,l2y,ex,ey,k+1]);return next();
      }
      part=F(part+l);cur=[a0,b0,a3,b3,F(T+part),1];if(!st.length)T=F(T+part);return true;
    }
    if(i>=tk.length)return false;
    if(/[a-zA-Z]/.test(tk[i]))cmd=tk[i++];else if(cmd==='M')cmd='L';else if(cmd==='m')cmd='l';
    const r=cmd>'Z',C=cmd.toUpperCase(),A=(o,v)=>r?F(o+v):v;
    const line=(nx,ny)=>{T=F(T+len(x,y,nx,ny));cur=[x,y,nx,ny,T,0];x=nx;y=ny;prev='L';return true;};
    const cubic=(a1,b1,a2,b2,nx,ny)=>{mag=(x*x+y*y+a1*a1+b1*b1+a2*a2+b2*b2+nx*nx+ny*ny)/16;if(mag>=1e-16){part=0;st.push([x,y,a1,b1,a2,b2,nx,ny,0]);}x=nx;y=ny;return next();};
    if(C==='Z'){line(sx,sy);prev='Z';return true;}
    if(C==='M'){x=A(x,num());y=A(y,num());sx=x;sy=y;cur=[x,y,x,y,T,2];prev='M';return true;}
    if(C==='L'){const nx=A(x,num());return line(nx,A(y,num()));}
    if(C==='H')return line(A(x,num()),y);
    if(C==='V')return line(x,A(y,num()));
    if(C==='Q'||C==='T'){let qx,qy;if(C==='Q'){qx=A(x,num());qy=A(y,num());}else{qx=prev==='Q'?2*x-cx:x;qy=prev==='Q'?2*y-cy:y;}
      const nx=A(x,num()),ny=A(y,num()),b=(p,c)=>F(F(p+F(2*c))/3),ox=x,oy=y;cx=qx;cy=qy;prev='Q';return cubic(b(ox,qx),b(oy,qy),b(nx,qx),b(ny,qy),nx,ny);}
    if(C==='C'||C==='S'){let ax,ay;if(C==='C'){ax=A(x,num());ay=A(y,num());}else{ax=prev==='C'?2*x-cx:x;ay=prev==='C'?2*y-cy:y;}
      const bx=A(x,num()),by=A(y,num()),nx=A(x,num()),ny=A(y,num());cx=bx;cy=by;prev='C';return cubic(ax,ay,bx,by,nx,ny);}
    i++;return next();
  };
  // the first piece whose running total reaches u (a cubic's passes it), stepped back along that piece
  return u=>{
    const fu=F(u);
    while(!cur||!(cur[5]===1?cur[4]>fu:cur[4]>=fu))if(!next())break;
    if(!cur)return{x:0,y:0};if(cur[5]===2)return{x:cur[0],y:cur[1]};
    const back=cur[4]-fu,dx=cur[2]-cur[0],dy=cur[3]-cur[1],l=Math.hypot(dx,dy);
    return back<=0||!l?{x:cur[2],y:cur[3]}:{x:cur[2]-back*dx/l,y:cur[3]-back*dy/l};
  };
}
// Short idle tasks warm real ink, not empty drawing boxes, before Explore.
// Placement is fixed in map space; the existing frame writer is unchanged.
function tripMeasureExploreLabels() {
  const E=TRIP_EL;
  if(!E.rows?.every(r=>r.box)||typeof DOMPoint==='undefined')return;
  const epoch=E.exploreEpoch=(E.exploreEpoch||0)+1;
  // Read the existing public journey state only from an idle callback, never
  // from the animation loop. The joined hero stays excluded until it is away.
  const busy=()=>{
    const j=globalThis.window?.__jm,root=document.documentElement;
    return document.hidden||E.exploreOn||j?.moving||root.classList.contains('jm-focus')||
      root.classList.contains('jm-joined')&&!document.querySelector('[data-hero]')?.classList.contains('jm-away')||
      j&&['handoff','pushIn','leg','legX','rush','blast','settle'].includes(tripState(j.P).kind);
  };
  const later=()=>{
    if(epoch!==E.exploreEpoch)return;
    if(busy()){setTimeout(later,120);return;}
    if(globalThis.requestIdleCallback)requestIdleCallback(run,{timeout:32});
    else setTimeout(()=>run({timeRemaining:()=>4}),32);
  };
  const run=deadline=>{
    if(epoch!==E.exploreEpoch)return;
    if(busy()){setTimeout(later,120);return;}
    const start=performance.now(),budget=Math.min(2,Math.max(1,deadline.timeRemaining()-.2));
    while(performance.now()-start<budget){if(work.next().done)return;}
    later();
  };
  const end=tripState(TOTAL_P).cam,f=DEPTH.frame.outer,m=VIEW.phone?EXPLORE.marginPhone:EXPLORE.margin;
  const bounds=[Math.min(f[0],-end.tx/end.s),Math.min(f[1],-end.ty/end.s),Math.max(f[2],(VIEW.w-end.tx)/end.s),Math.max(f[3],(VIEW.h-end.ty)/end.s)];
  const fit=Math.min((VIEW.w-2*m)/(bounds[2]-bounds[0]),(VIEW.h-(VIEW.phone?STEPS.nav.bar:STEPS.nav.h+STEPS.nav.gap)-2*m)/(bounds[3]-bounds[1]));
  const top=Math.max(fit,Math.max(EXPLORE.most,CAMERA.holdZoom)*VIEW.sT),grid=new Map(),cell=12;
  const add=(x,y,half=0,fixed=false,offset=null,trail=false)=>{if(x<10||x>590||y<120||y>820)return;const key=Math.floor(x/cell)+','+Math.floor(y/cell);if(!grid.has(key))grid.set(key,[]);grid.get(key).push([x,y,half,fixed,offset,trail]);};
  const elements=[...(E.base?E.base.querySelectorAll('#b-detail path,#b-detail circle,#b-detail ellipse,#b-detail rect,#b-detail line,#b-sea path,#b-sea circle'):[]),...(document.getElementById('map-stack') || E.svg).querySelectorAll('#b-detail path,#b-detail circle,#b-detail ellipse,#b-detail rect,#b-detail line,#b-rest path,#b-rest circle,#b-rest ellipse,#b-rest rect,#b-rest line,#b-sea path,#b-sea circle,#finds path,#finds circle,#finds ellipse,#finds rect')];
  function* sample(){
    for(const el of elements){
      yield;
      if(el.closest('.label-anchor,.map-tier1,.map-tier2,.lg,.legend-symbol,.mk,defs,.bc-beam,.bc-glow,#f-hoard-hmc1,.hd-chest,.hd-stars,.hd-glow,.jg-swell,.wl-rip,.rv-gifts')||el.matches('.hit,.touch-hit,.find-focus-ring')||el.getAttribute('opacity')==='0')continue;
      // Ignore hidden parts, while still warming the chart behind its global
      // hand-off fade. Those layer fades are not the drawing's occupied ink.
      let hidden=false;
      for(let parent=el;parent&&parent!==E.detail&&parent!==E.rest&&parent!==E.finds&&parent!==E.sea;parent=parent.parentElement){const style=getComputedStyle(parent);if(Number(style.opacity)<.02||style.display==='none'||parent.style.visibility==='hidden'||parent.getAttribute('visibility')==='hidden'){hidden=true;break;}}
      if(hidden)continue;
      const b=el.getBBox();if(b.width>500&&b.height>800)continue;
      const style=getComputedStyle(el);if(style.stroke==='none'&&style.fill==='none')continue;
      const camera=E.base?.contains(el)?E.camBase:E.cam, matrix=camera.getCTM().inverse().multiply(el.getCTM());
      const scale=Math.hypot(matrix.a,matrix.b),fixed=style.vectorEffect==='non-scaling-stroke',half=(parseFloat(style.strokeWidth)*(fixed?1:scale)/2)||.5;
      // These batched paths are explicit M x y h .01 dots. Read each dot
      // once, exactly, instead of thousands of native path-length queries.
      if(el.classList.contains('sea-stipple')){
        for(const match of el.getAttribute('d').matchAll(/M(-?[\d.]+) (-?[\d.]+)h\.01/g)){
          const x=+match[1]+.005,y=+match[2];add(matrix.a*x+matrix.c*y+matrix.e,matrix.b*x+matrix.d*y+matrix.f,half+.005,fixed);yield;
        }
        continue;
      }
      const L=el.getTotalLength?.();yield;if(!L||L>6000)continue;
      const d=el.tagName==='path'&&el.getAttribute('d'),walk=d&&!/[Aa]/.test(d)?pathWalk(d):null;
      for(let u=0;u<=L;u+=Math.min(1,.75/Math.max(.1,scale))){const p=walk?walk(u):el.getPointAtLength(u);add(matrix.a*p.x+matrix.c*p.y+matrix.e,matrix.b*p.x+matrix.d*p.y+matrix.f,half,fixed);yield;}
    }
    for(const P of [COAST_A,COAST_B,TRAIL])for(let j=1;j<P.length;j++){
      const a=P[j-1],b=P[j],dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy),n=[-dy/L,dx/L];
      if(P!==TRAIL&&onLand([(a[0]+b[0])/2+n[0],(a[1]+b[1])/2+n[1]])){n[0]*=-1;n[1]*=-1;}
      for(let u=0;u<=L;u+=.6){const x=lerp(a[0],b[0],u/L),y=lerp(a[1],b[1],u/L);add(x,y,P===TRAIL?1.4:.6,true,null,P===TRAIL);if(P!==TRAIL)add(x,y,3*VIEW.s0,true,n.map(v=>v*3*VIEW.s0));yield;}
    }
  }
  const gap=(a,b)=>Math.hypot(Math.max(a[0]-b[2],b[0]-a[2],0),Math.max(a[1]-b[3],b[1]-a[3],0)),placed=[];
  const box=(r,local,s)=>{const k=labelScale(r.row.kind,s);return[local[0]*k+r.explore[0],local[1]*k+r.explore[1],local[2]*k+r.explore[0],local[3]*k+r.explore[1]];};
  const clear=(q,s,trailPad=2.4)=>{
    if(q[0]<24||q[2]>576||q[1]<130||q[3]>816){return false;}
    const pad=2.4/s,reach=Math.max(pad,trailPad/s)+4;
    for(let x=Math.floor((q[0]-reach)/cell);x<=Math.floor((q[2]+reach)/cell);x++)for(let y=Math.floor((q[1]-reach)/cell);y<=Math.floor((q[3]+reach)/cell);y++)for(const p of grid.get(x+','+y)||[])if(gap(q,[p[0]+(p[4]?.[0]||0)/s,p[1]+(p[4]?.[1]||0)/s,p[0]+(p[4]?.[0]||0)/s,p[1]+(p[4]?.[1]||0)/s])<(p[5]?trailPad/s:pad)+(p[3]?p[2]/s:p[2])){return false;}
    if(placed.some(p=>(!p.r.row.stopSub||s>=p.r.exploreFrom)&&gap(q,box(p.r,p.at,s))<pad)){return false;}
    if(FINDS.some(f=>f.mark&&gap(q,[...f.mark,...f.mark])<(COMB.markerPx/2+2.4)/s))return false;
    return !STOPS.some(st=>{const p=MAP.waypoints[st.w],size=Math.max(MARK.min,Math.min(MARK.max,MARK.k*s)),rad=size*(MARK.radius+MARK.rim/2)/MARK.box/s,cy=p[1]-(size/2+MARK.stand)*MARK.lift/s;return gap(q,[p[0],cy,p[0],cy])<rad+pad;});
  };
  const scales=Array.from({length:13},(_,i)=>fit*(top/fit)**(i/12)),rows=E.rows.filter(r=>!r.row.stopSub).concat(E.rows.filter(r=>r.row.stopSub)).map(r=>({...r}));
  const markup=(r,at)=>'<tspan x="'+(at[0]-r.box.x)+'" y="'+(at[1]-r.box.y)+'">'+r.row.text.replaceAll('&','&amp;').replaceAll('<','&lt;')+'</tspan>';
  // Constant-cost seed for a press before the idle work completes. All rows
  // already belong to their shields and stay fixed throughout that session.
  for(const r of E.rows){
    const p=r.stop>=0?MAP.waypoints[STOPS[r.stop].w]:MAP.x,b=r.box,k=labelScale(r.row.kind,fit),px=1/(fit*k),side=COMB.exploreSides[r.row.stop],size=Math.max(MARK.min,Math.min(MARK.max,MARK.k*fit));
    const cy=-(size/2+MARK.stand)*MARK.lift*px,rad=size*(MARK.radius+MARK.rim/2)/MARK.box*px;
    const x=Math.max((24-p[0])/k,Math.min((576-p[0])/k-b.width,side==='below-left'?-b.width-(rad+7*px)/Math.SQRT2:side==='left'?-b.width-18*px:side==='below'?-b.width/2:18*px)),y=(side==='below-left'?cy+(rad+7*px)/Math.SQRT2:side==='below'?cy+rad+5*px:cy-b.height/2)+(r.row.stopSub?22*px:0);
    const at=[x,y,x+b.width,y+b.height];r.explore=p.slice();r.exploreLocal=at;r.exploreBox={x,y,width:b.width,height:b.height};r.exploreFrom=r.row.stopSub?Infinity:0;r.exploreMarkup=markup(r,at);
  }
  function* place(r){
    const sub=r.row.stopSub,name=sub?rows.find(n=>n.row.stop===r.row.stop&&!n.row.stopSub):null;
    const p=r.stop>=0?MAP.waypoints[STOPS[r.stop].w]:MAP.x,b=r.box,k=labelScale(r.row.kind,fit),px=1/(fit*k),candidates=[];r.explore=p.slice();
    if(sub){
      const n=name.exploreLocal,nk=labelScale(name.row.kind,fit),nx=n[0]*nk/k,ny=n[3]*nk/k,w=b.width;
      for(let dy=4*px;dy<=20*px;dy+=2*px)for(const x of[nx,n[2]*nk/k-w,(nx+n[2]*nk/k-w)/2])for(const shift of [0,-2,2,-4,4,-6,6,-8,8])candidates.push([x+shift*px,ny+dy,x+shift*px+w,ny+dy+b.height]);
    }else{
      const size=Math.max(MARK.min,Math.min(MARK.max,MARK.k*fit)),cy=-(r.row.stop==='x'?0:(size/2+MARK.stand)*MARK.lift)*px,rad=(r.row.stop==='x'?8:size*(MARK.radius+MARK.rim/2)/MARK.box)*px,preference=COMB.exploreSides[r.row.stop]||'right';
      for(let y=cy-rad-b.height-16*px;y<=cy+rad+16*px;y+=2*px)for(let x=-rad-b.width-16*px;x<=rad+16*px;x+=2*px){
        yield;
        const q=[x,y,x+b.width,y+b.height],distance=gap(q,[0,cy,0,cy])-rad;
        if(distance<3*px||distance>b.height+4*px)continue;
        const side=preference==='below-left'?q[2]<0&&q[1]>cy:preference==='left'?q[2]<=0:preference==='below'?q[1]>=cy:q[0]>=0;
        if(preference==='below-left'&&!side)continue;
        candidates.push(Object.assign(q,{score:(distance>b.height?100000:0)+(side?0:10000)+Math.abs(distance-7*px)*8+Math.abs(y+b.height/2-cy)}));
      }
      candidates.sort((a,b)=>a.score-b.score);
    }
    const inside=q=>q[0]>=24&&q[1]>=130&&q[2]<=576&&q[3]<=816;
    const near=(q,s)=>{
      if(r.row.stop==='x')return true;
      const size=Math.max(MARK.min,Math.min(MARK.max,MARK.k*s)),rad=size*(MARK.radius+MARK.rim/2)/MARK.box/s,cy=p[1]-(size/2+MARK.stand)*MARK.lift/s;
      return gap(q,[p[0],cy,p[0],cy])-rad<=b.height*labelScale(r.row.kind,s);
    };
    const bounded=[];
    if(!sub)for(const q of candidates){if(inside(box(r,q,fit))&&scales.every(s=>near(box(r,q,s),s)))bounded.push(q);yield;}
    if(!sub&&bounded.length){candidates.length=0;candidates.push(...bounded);}
    let at,from=fit;
    if(sub){
      // Each candidate is tested once from close to far, not once per suffix.
      let best=scales.length;
      for(const q of candidates){let i=scales.length-1;for(;i>=0;i--){const ok=clear(box(r,q,scales[i]),scales[i],r.row.stop==='mohawk'?7.15:2.4);yield;if(!ok)break;}if(i+1<best){best=i+1;at=q;from=scales[best];}if(best===0)break;}
    }else{
      for(const q of candidates){let ok=true;for(const s of scales){ok=clear(box(r,q,s),s,r.row.stop==='mohawk'?7.15:2.4);yield;if(!ok)break;}if(ok){at=q;break;}}
      // Refine the first promising coarse neighbourhoods at half-pixel steps.
      if(!at)for(const q of candidates.slice(0,48)){
        for(let dy=-1.5;dy<=1.5&&!at;dy+=.5)for(let dx=-1.5;dx<=1.5;dx+=.5){const v=q.map((n,i)=>n+(i%2?dy:dx)*px);let ok=inside(box(r,v,fit));for(const s of scales){if(!ok)break;ok=near(box(r,v,s),s)&&clear(box(r,v,s),s,r.row.stop==='mohawk'?7.15:2.4);yield;}if(ok){at=v;break;}}
        if(at)break;
      }
    }
    const allClear=!!at;
    at ||= candidates.find(p=>clear(box(r,p,fit),fit,r.row.stop==='mohawk'?7.15:2.4))||candidates.find(p=>inside(box(r,p,fit)))||candidates[0]||[b.x,b.y,b.x+b.width,b.y+b.height];
    r.exploreLocal=at;r.exploreBox={x:at[0],y:at[1],width:b.width,height:b.height};r.exploreFrom=sub?(allClear?from:Infinity):0;
    r.exploreMarkup=markup(r,at);r.exploreClear=allClear;
    if(!sub||Number.isFinite(r.exploreFrom))placed.push({r,at});
  }
  function* warm(){
    yield* sample();
    // Work on private rows. Publish once at idle, never a row at a time while
    // Explore is visible. An early opening retains its stable seed layout.
    for(const r of rows)yield* place(r);
    for(const r of rows){
      const target=E.rows.find(n=>n.row.i===r.row.i);
      for(const key of ['explore','exploreLocal','exploreBox','exploreFrom','exploreMarkup'])target[key]=r[key];
      r.el.dataset.exploreClear=String(r.exploreClear);r.el.dataset.exploreAt=r.explore.join(' ');r.el.dataset.exploreFrom=String(r.exploreFrom||fit);
    }
    E.exploreReady=true;
  }
  const work=warm();later();
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
// A find that takes the camera fades tier 1 (stop names, title, legend) and the sub-line on each label (E.groupFade). The groups
// only hide at zero: a fading group gave the names layers of their own and split the moving map (the find press stutter).
function tripFocusFade(st) {
  const E = TRIP_EL, focusFade = 1 - smooth(0, .4, st.focusK || 0), keep = ['wayfinder','all-found'].includes(st.focusId);
  if (E.focusFade === null || keep !== E.focusKeep || Math.abs(focusFade - E.focusFade) > .01 || (focusFade === 0 || focusFade === 1) && focusFade !== E.focusFade) {
    E.focusFade = focusFade; E.focusKeep = keep;
    E.groupFade = keep ? 1 : focusFade;
    for (const group of [E.tier1, E.subs]) if (group) tripWrite(group, 'visibility', keep || focusFade !== 0 ? 'visible' : 'hidden');
  }
}
// Labels give way (polish round 1): a stop's label fades as its card opens (L-6) and the map's other words dim (L-8); all of
// them fade under the timeline, the step bar and a find's hint, and off the screen's sides (K-2, L-17). Explore frees them.
// The edge fade runs on the clock: its share-based target is reached at no more than 1 / LABELS.edgeFade a second, so a label
// the camera sweeps past an edge fades over edgeFade instead of in a frame or two. Calls without a frame time (the reduced
// still, a resize) and the first call for a label take the target at once.
function tripEdge(r, target, dt) {
  if (r.edge === undefined || !(dt > 0)) { r.edge = target; return target; }
  const step = dt / LABELS.edgeFade, d = target - r.edge;
  r.edge = Math.abs(d) <= step ? target : r.edge + Math.sign(d) * step;
  if (r.edge !== target) TRIP_EL.edgeFading = true;
  return r.edge;
}
// The same clock for a zoom-led fade: o[key] moves toward target at no more than 1 / LABELS.edgeFade a second.
function tripClock(o, key, target, dt) {
  const v = o[key];
  if (v === undefined || !(dt > 0)) { o[key] = target; return target; }
  const step = dt / LABELS.edgeFade, d = target - v;
  o[key] = Math.abs(d) <= step ? target : v + Math.sign(d) * step;
  if (o[key] !== target) TRIP_EL.clockFading = true;
  return o[key];
}
function tripLabels(st, t2Fade = 1) {
  const E = TRIP_EL, c = st.cam, phone = VIEW.phone, L = LABELS, open = Math.max(0, ...st.cardK), dim = 1 - L.cardDim[phone ? 1 : 0], group = E.groupFade ?? 1;
  const dt = st.reduced ? 0 : st.frameDt || 0; E.edgeFading = false;
  const free = !!st.exploring || st.exploreK > 0, lift = st.focusK > 0 ? L.hint : 0, timeline = VIEW.h - (phone ? STEPS.nav.bar : 0) - CAMERA.timeline;
  const floor = phone ? timeline - lift : timeline, bar = phone ? null : [VIEW.w / 2 - L.bar[0], timeline - STEPS.nav.gap - STEPS.nav.h - L.bar[1] - lift, VIEW.w / 2 + L.bar[0]];
  const gone = b => { const x0 = b[0] * c.s + c.tx, x1 = b[2] * c.s + c.tx, y0 = b[1] * c.s + c.ty, y1 = b[3] * c.s + c.ty, tall = Math.max(1, y1 - y0);
    let under = clamp01((y1 - floor) / tall);
    if (bar && x1 > bar[0] && x0 < bar[2]) under = Math.max(under, clamp01((y1 - bar[1]) / tall));
    return (1 - smooth(0, L.underFade, under)) * (1 - smooth(0, L.sideFade, Math.max(-x0, x1 - VIEW.w) / Math.max(1, x1 - x0))); };
  const put = (r, o) => { const v = o > .995 ? '' : o.toFixed(3); if (v !== r.o) { r.o = v; r.el.style.opacity = v; } };
  E.subFading=false;
  E.rows.forEach(r => {
    let o = 1;
    if (r.stop >= 0) { let other = 0; st.cardK.forEach((k, i) => { if (i !== r.stop && k > other) other = k; }); o = (1 - st.cardK[r.stop]) * (1 - dim * other); }
    else o = 1 - dim * open;
    const blend=1-smooth(1.05,1.7,c.s/VIEW.s0),at=free&&r.explore?r.explore:r.base?r.base.map((v,i)=>lerp(v,r.overview[i],blend)):[r.row.x,r.row.y];
    tripWrite(r.el, 'transform', `translate(${at[0]} ${at[1]})`, true);
    const row = { ...r.row, x: at[0], y: at[1] }, k = labelScale(row.kind,c.s), b = free ? r.exploreBox || r.box : r.box, box = b ? [at[0] + (b.x - LABELS.halo) * k, at[1] + (b.y - LABELS.halo) * k, at[0] + (b.x + b.width + LABELS.halo) * k, at[1] + (b.y + b.height + LABELS.halo) * k] : mapLabelBox(row, c.s, phone);
    o *= 1 - tripCardCover(st, box);
    if (free && r.row.stopSub && r.exploreFrom) {
      const target=c.s>=r.exploreFrom?1:0,dt=st.exploreDt||0;r.subOpacity ??= 0;
      r.subOpacity+=Math.sign(target-r.subOpacity)*Math.min(Math.abs(target-r.subOpacity),dt/.2);o*=r.subOpacity;E.subFading ||= r.subOpacity!==target;
    }
    o *= tripEdge(r, free ? 1 : gone(box), dt);
    put(r, o * group);
  });
  const u = L.legend.unit * labelScale('legend', c.s), back = 1 - dim * open;
  (E.t2 || []).forEach(t => put(t, (free ? 1 : back) * tripEdge(t, free ? 1 : gone(t.b), dt) * (1 - tripCardCover(st, t.b)) * t2Fade));
  const xQuiet = st.legXT * (1 - (st.exploreK || 0));
  E.symbols?.forEach(s => tripWrite(s.el, 'opacity', 1 - .85 * xQuiet));
  (E.legend || []).forEach(g => { const k = labelScale('legend', c.s), b = g.box, box = b ? [g.p[0]+b.x*k,g.p[1]+b.y*k,g.p[0]+(b.x+b.width)*k,g.p[1]+(b.y+b.height)*k] : [g.p[0],g.p[1]-u*L.ascent,g.p[0]+g.n*u*L.width,g.p[1]+u*L.descent]; put(g, (free ? 1 : back) * tripEdge(g, free ? 1 : gone(box), dt) * (1-tripCardCover(st,box)) * (1-.85*xQuiet) * group); });
}
export function tripGliding() { return !!TRIP_EL.raster?.gliding; }
// COMB-S: every camera owner uses the same slot, including focus and rest.
function tripRasters(E,r,st,focus,layers,veil,camVeil,moving,camMoved,lastCam) {
  const c=st.cam, equal=(a,b)=>a&&b&&['s','tx','ty'].every(k=>Math.abs(a[k]-b[k])<1e-10);
  const matrix=p=>'matrix('+p.s.toFixed(4)+' 0 0 '+p.s.toFixed(4)+' '+p.tx.toFixed(2)+' '+p.ty.toFixed(2)+')';
  const records=[['map',E.svg,E.cam],['base',E.base,E.camBase],...layers.map(([svg,cam])=>[svg.id.slice(4),svg,cam]),['veil',veil,camVeil]].filter(([,svg,cam])=>svg&&cam);
  r.layerCams ||= {};
  const slack=FRAME_PERF.slack, free=!!st.exploring||st.exploreK>0;
  const change=lastCam?Math.max(c.s/lastCam.s,lastCam.s/c.s):1;
  // Queue the cohort before its common deadline, but always raster at the shown camera.
  const lead=moving?Math.min(1.4,change**(records.length+1)):1;
  st.gliding=moving;
  const requests=(VIEW.skyPlan?.(st)||[]).map(q=>({...q,kind:'sky'})),forced=[];
  for(const[id,svg,cam]of records){
    const p=r.layerCams[id],k=p?c.s/p.s:1;
    const lo=free?FRAME_PERF.exploreMin:id==='base'?FRAME_PERF.baseMin:FRAME_PERF.scaleMin;
    const hi=free?FRAME_PERF.exploreMax:id==='base'?FRAME_PERF.baseMax:FRAME_PERF.scaleMax;
    let covers=true;
    if(id==='base'&&p){
      const box=VIEW.baseBox||NO_BOX,sx=Math.max(0,box.ox-1),sy=Math.max(0,box.oy-1);
      const tx=c.tx-p.tx*k,ty=c.ty-p.ty*k;
      covers=-tx/k>=-sx&&(VIEW.w-tx)/k<=VIEW.w+sx&&-ty/k>=-sy&&(VIEW.h-ty)/k<=VIEW.h+sy;
    }
    const due=!p||!covers||(moving?k<lo*lead||k>hi/lead:!equal(c,p));
    if(!due)continue;
    const q={kind:id,svg,cam,score:!p||!covers?Infinity:Math.max(lo/k,k/hi)};
    requests.push(q);
    if(!p||!covers||moving&&(k<lo/slack||k>hi*slack))forced.push({...q,reason:!p?'initial':!covers?'base coverage':'slack'});
  }
  const chosen=forced.length?null:requests.sort((a,b)=>b.score-a.score)[0]||null;
  const jobs=forced.length?forced:chosen&&chosen.kind!=='sky'?[chosen]:[];
  for(const q of jobs){r.layerCams[q.kind]={...c};tripWrite(q.cam,'transform',matrix(c),true);}
  r.base=r.layerCams.map||{...c};E.veilRaster=r.layerCams.veil||{...c};
  for(const[id,svg]of records){
    const p=r.layerCams[id];if(!p)continue;const k=c.s/p.s;
    tripWrite(svg,'transform',equal(c,p)?'none':'matrix('+k+',0,0,'+k+','+(c.tx-p.tx*k)+','+(c.ty-p.ty*k)+')');
  }
  if(E.base){const B=E.baseRaster??={};B.camera=r.layerCams.base;B.last={...c,P:st.P,focus:focus?.k||0};B.held=!equal(c,B.camera);B.w=VIEW.w;B.h=VIEW.h;B.box=VIEW.baseBox||NO_BOX;}
  const pending=!moving&&records.some(([id])=>!equal(r.layerCams[id],c));
  st.rasterForced=forced.map(q=>q.kind);st.rasterReasons=forced.map(q=>({layer:q.kind,reason:q.reason}));
  st.rasterLayers=jobs.map(q=>q.kind);st.rasterLayer=st.rasterLayers[0]||null;
  st.rasterRebased=jobs.some(q=>q.kind==='finds');
  st.rasterS=(r.layerCams.finds||r.base).s;
  st.rasterBudget={used:!!jobs.length,sky:chosen?.kind==='sky'?chosen.object:null,baseForced:forced.some(q=>q.kind==='base')};
  E.rasterFrame=st.rasterBudget;
  if(focus&&focus.k<(r.focusK??0))r.focusRelease=true;
  else if(focus&&focus.k>(r.focusK??0))r.focusRelease=false;
  const key=JSON.stringify([focus?.id||'',E.focusAim?.serial||0,!!r.focusRelease]);
  if(moving&&(!r.wasMoving||key!==r.moveKey)){
    const glide=GLIDES.find(g=>st.P>=g.a&&st.P<g.b);
    const target=tripState(st.P);if(focus&&!r.focusRelease)tripFocus(target,E.focusAim?.view||focus.view,1);
    st.rasterDestination={...(focus?target.cam:st.exploreDestination|| (glide?tripState(lastCam&&st.P<lastCam.P?glide.a:glide.b).cam:c))};
  }
  if(!moving&&jobs.some(q=>q.kind==='veil'))st.veilRestCommit=true;
  r.wasMoving=moving;r.moveKey=key;r.focusK=focus?.k||0;
  r.gliding=moving||pending;r.promo=!st.reduced&&(st.handoffT>=1||moving);r.soft=false;
  st.gliding=r.gliding;
  return {pending:moving||pending};
}
export function tripApply(st, focus = null) {
  const E = TRIP_EL, c = st.cam; E.clockFading = false;
  const veil = E.veil ??= document.getElementById('map-veil'), camVeil = E.camVeil ??= document.getElementById('cam-veil');
  // L5: the names-and-trail and finds svgs ride svg#map's raster camera; div#map-stack takes the fade.
  const layers = E.layers ??= ['live', 'finds', 'anim', 'lines'].map(id => [document.getElementById('map-' + id), document.getElementById('cam-' + id)]).filter(([svg, cam]) => svg && cam), stack = E.stack ??= document.getElementById('map-stack');
  const free = !!st.exploring || st.exploreK > 0;
  const r = E.raster ??= { base: null, moving: false, scale: c.s, elapsed: FRAME_PERF.labelSettle, w: VIEW.w, h: VIEW.h };
  if (r.w !== VIEW.w || r.h !== VIEW.h) { r.base = null; r.layerCams = null; r.focusRun = null; E.veilRaster = null; r.moving = false; r.scale = c.s; r.elapsed = FRAME_PERF.labelSettle; r.w = VIEW.w; r.h = VIEW.h; }
  const lastCam=r.lastCam,camMoved=!!lastCam&&['s','tx','ty'].some(k=>lastCam[k]!==c[k]);
  r.lastCam={...c,P:st.P,focus:focus?.k||0};
  const glideHold=FRAME_PERF.glideHold&&!free&&!st.reduced&&st.handoffT>=1;
  const moving=!st.reduced&&(camMoved||!!st.exploreMoving||!!focus&&(focus.k<1||!focus.swapped));
  const raster=tripRasters(E,r,st,focus,layers,veil,camVeil,moving,camMoved,lastCam);
  // Keep the displayed label state across camera commits. Its own size and tier
  // clock eases continuously, including across interrupted gestures/rebases.
  const settle = free ? 1 - Math.exp(-(st.exploreDt || 0) / (FRAME_PERF.labelSettle / 3)) : 1;
  r.settleLeft = st.exploreMoving ? FRAME_PERF.labelSettle : Math.max(0, (r.settleLeft ?? FRAME_PERF.labelSettle) - (st.exploreDt || 0));
  r.scale = free && !st.exploreScripted ? r.scale * (c.s / r.scale) ** settle : c.s;
  if (!r.settleLeft || Math.abs(r.scale / c.s - 1) < .0001) r.scale = c.s;
  r.moving = moving;
  const paint = r.base, labelS = free ? r.scale : c.s;
  // The zoom-led fade of the small words and the bottom scrim runs on the clock too: a fast pinch or a find's move crossed
  // its whole zoom range in a frame or two, so words popped in and the scrim dropped over the map (phone film scans, 2026-11-27).
  const labelFade = tripClock(E, 'labelFadeK', smooth(...LABELS.fade, labelS / VIEW.s0), st.reduced ? 0 : st.frameDt || 0);
  tripFocusFade(st);
  if (E.rows) tripLabels(st, labelFade);
  E.labels.forEach(label => {
    const raster= r.layerCams?.[(label.el.closest?.('svg')?.id||'map').replace(/^map-?/,'')||'map'] || paint;
    const ideal = labelScale(label.kind,raster.s);
    // Follow the old epsilon rule in memory even while the visible label is held.
    // The held opening eases them too (pinch recheck, 2026-11-27): it no longer redraws every frame, so without the ease its
    // redraws and its landing popped the names by 10-15 % in one frame (cloud landing probe).
    // The final text size therefore equals the old writer's at the same camera.
    label.target ??= label.k;
    if (label.target === null || Math.abs(ideal / label.target - 1) > LABELS.epsilon) label.target = ideal;
    const from = label.k ?? label.target;
    const remaining = Math.abs(from / label.target - 1);
    const eased = free && r.settleLeft && remaining > .0001 ? from * (label.target / from) ** Math.min(settle, .09 / Math.max(.09, Math.abs(Math.log(label.target / from)))) : label.target;
    const trueSize = labelScale(label.kind,c.s);
    const k = free ? Math.max(trueSize * FRAME_PERF.scaleMin, Math.min(trueSize * FRAME_PERF.scaleMax, eased)) : eased;
    if (label.k !== k) { label.el.setAttribute('transform', 'scale(' + k + ')'); label.k = k; if(label.kind==='legend')tripLegendLayout(k); }
  });
  E.markers?.forEach(el => { tripWrite(el, 'transform', el.closest?.('.legend-symbol')&&!(VIEW.h<=440&&VIEW.w>640)?'scale(1)':`scale(${COMB.markerPx / (12.4 * (el.parentElement?.parentElement?.dataset.screen ? 1 : paint.s))})`, true); const mk = el.parentElement?.parentElement, f = FINDS.find(f=>mk?.id === 'mk-'+f.id); if (f) { const half = COMB.markerPx / (2*c.s), cover = tripCardCover(st,[f.mark[0]-half,f.mark[1]-half,f.mark[0]+half,f.mark[1]+half]); tripWrite(mk,'opacity',(1-cover)*(1-(st.focusK||0))); tripWrite(mk,'visibility',cover>=.995||st.focusK>=1?'hidden':''); } });
  E.ticks?.forEach(el => tripWrite(el, 'stroke-width', Math.min(+el.dataset.weight * paint.s, +el.dataset.weight * VIEW.s0), true));
  E.secondary.forEach(group => { tripWrite(group, 'opacity', ''); tripWrite(group, 'visibility', labelFade === 0 ? 'hidden' : 'visible'); });
  E.secondaryText?.forEach(t => { const fade = t.group.classList.contains('wf-result') && document.documentElement.classList.contains('jm-way') ? 1 : labelFade; tripWrite(t.el, 'fillOpacity', t.fill * fade); tripWrite(t.el, 'strokeOpacity', t.stroke * fade); });
  tripWrite(E.scrim, 'opacity', labelFade);
  const h = st.handoffT, fade = 1 - smooth(...DEPTH.fade.blast, st.blastT) * (1 - (st.exploreK || 0));
  tripWrite(E.sea, 'opacity', smooth(...DEPTH.fade.sea, h)); tripWrite(E.fill, 'opacity', smooth(.25, .75, h));
  tripWrite(E.detail, 'opacity', smooth(.45, .95, h)); if (E.rest) tripWrite(E.rest, 'opacity', smooth(.45, .95, h));
  const liveDetail = E.liveDetail ??= document.getElementById('live-detail'); if (liveDetail) tripWrite(liveDetail, 'opacity', smooth(.45, .95, h)); tripWrite(E.finds, 'opacity', smooth(.5, 1, h));
  tripWrite(E.coastG, 'opacity', 1);
  const dr = coastDrawn(h);
  E.coasts.forEach((p, i) => { if (dr >= 1) { tripWrite(p, 'strokeDasharray', 'none'); return; } const L = E.coastLen[i] * c.s; tripWrite(p, 'strokeDasharray', `${L.toFixed(1)} ${L.toFixed(1)}`); tripWrite(p, 'strokeDashoffset', (L * (1 - dr)).toFixed(1)); });
  // solid trail behind the traveller (dash in screen units because the stroke does not scale)
  if (!FRAME_PERF.trailPieces) {
    const L = TRAIL_LEN * paint.s; tripWrite(E.done, 'strokeDasharray', L.toFixed(1)+' '+L.toFixed(1)); tripWrite(E.done, 'strokeDashoffset', (st.exploreK ? 0 : (TRAIL_LEN-st.u)*paint.s).toFixed(1));
    tripWrite(E.done, 'opacity', st.inTrip ? 1 : 0);
  } else {
    tripWrite(E.done, 'opacity', 0);
    const group = E.pieceG ??= document.getElementById('trail-pieces');
    const pieces = E.pieceList ??= [...group.querySelectorAll('.done-p')].map(el => ({ el, u0: +el.dataset.u0, u1: +el.dataset.u1 }));
    tripWrite(group, 'opacity', st.inTrip ? 1 : 0);
    for (const q of pieces) {
      if(q.el.__jmTrail)continue;
      const full = st.exploreK || st.u >= q.u1, hidden = !full && st.u <= q.u0;
      tripWrite(q.el, 'opacity', hidden ? '0' : '');
      tripWrite(q.el, 'strokeDasharray', full || hidden ? 'none' : ((st.u-q.u0)*paint.s).toFixed(1)+' '+((q.u1-q.u0)*paint.s+20).toFixed(1));
    }
  }
  // the longship rides the crossing
  const sp = longshipPoint(st.u); tripWrite(E.ship, 'transform', `translate(${n2(sp[0])} ${n2(sp[1])}) scale(.55)`, true);
  const opacity = st.dim * fade;
  const fadeEl = stack || E.svg;
  tripWrite(fadeEl, 'opacity', opacity); tripWrite(fadeEl, 'visibility', opacity === 0 ? 'hidden' : 'visible');
  tripWrite(E.svg, 'willChange', r.promo ? 'transform, opacity' : fade > 0 && fade < 1 ? 'opacity' : '');
  tripWrite(E.svg, 'overflow', free || glideHold ? 'visible' : '');
  for (const [svg] of layers) { tripWrite(svg, 'willChange', E.svg.style.willChange); tripWrite(svg, 'overflow', E.svg.style.overflow); }
  // The stack's own will-change only for a fade: over three layers it costs a full-screen surface each frame.
  if (stack) tripWrite(stack, 'willChange', !r.promo && fade > 0 && fade < 1 ? 'opacity' : '');
  if (veil) { tripWrite(veil, 'overflow', E.svg.style.overflow); tripWrite(veil, 'willChange', E.svg.style.willChange || (veil.style.visibility === 'visible' ? 'opacity' : '')); }
  if (E.base) { tripWrite(E.base, 'opacity', opacity); tripWrite(E.base, 'visibility', opacity === 0 ? 'hidden' : 'visible'); tripWrite(E.base, 'willChange', 'transform'); }
  tripWrite(E.caption, 'opacity', 1 - smooth(0, .3, h));
  // the X fades in with the sea, so neither page shows it before the map exists
  if (E.x) tripWrite(E.x, 'opacity', h < 1 ? smooth(.2, .7, h).toFixed(3) : '');
  // In explore the title fades as the camera zooms in past the overview, before it can grow huge and run off the screen (Dan's recording, 2026-11-24).
  if (E.title) { const t = (1 - smooth(...WORLD.titleOut, st.pushT) * (1 - (st.exploreK || 0))) * (1 - (st.exploreK || 0) * smooth(...WORLD.titleZoom, labelS / VIEW.s0)); tripWrite(E.title, 'opacity', t * (E.groupFade ?? 1)); tripWrite(E.title, 'visibility', t === 0 ? 'hidden' : 'visible'); }
  tripWrite(E.cue, 'opacity', smooth(.2, .5, st.overviewT) * (1 - smooth(0, .3, st.pushT)));
  // mini-map
  const mo = smooth(.5, 1, st.pushT) * (1 - smooth(0, .4, st.rushT));
  tripWrite(E.mini, 'opacity', mo); tripWrite(E.mini, 'visibility', mo > .01 ? 'visible' : 'hidden');
  if (mo > .01) {
    tripWrite(E.mmView, 'transform', `translate(${n2(-c.tx / c.s)} ${n2(-c.ty / c.s)}) scale(${n2(VIEW.w / c.s)} ${n2(VIEW.h / c.s)})`, true);
    const tp = pointAt(st.u); tripWrite(E.mmTrav, 'transform', `translate(${n2(tp[0])} ${n2(tp[1])})`, true);
  }
  return raster.pending || (free && (r.scale !== c.s || E.labels.some(label => label.k !== label.target)||E.subFading)) || !!E.edgeFading || !!E.clockFading || !!E.baseRaster?.held;
}
const n2 = v => v.toFixed(2);
export function tripMiniVisited(st) { TRIP_EL.mmStops.forEach((b, i) => b.classList.toggle('on', st.visited[i])); }

// Rewrites only the frame's camera and card strength; progress and traveller stay on the trail.
export function tripFocus(st, view, k) {
  if (k === 0) return;
  delete st.coverRects;
  const F = FIND_PLAY.focus, [x, y, r, least = F.least] = view;
  const horn=FINDS.find(f=>f.id==='horn'), cap=view.slice(0,3).every((v,i)=>v===horn.view[i])?horn.viewCap:F.most;
  const target = Math.max(Math.max(VIEW.s0, least * VIEW.sT), Math.min(cap * VIEW.sT, F.fill * Math.min(VIEW.w, VIEW.h) / (2 * r)));
  const before = toScreen(st, [x, y]), at = [F.at[0] * VIEW.w, F.at[1] * VIEW.h];
  const s = st.cam.s * (target / st.cam.s) ** k;
  st.cam = { s, tx: lerp(before[0], at[0], k) - x * s, ty: lerp(before[1], at[1], k) - y * s, ax: lerp(st.cam.ax, at[0], k), ay: lerp(st.cam.ay, at[1], k) };
  st.cardK = st.cardK.map(v => v * (1 - k)); st.cardOpen *= 1 - k; st.dim = lerp(st.dim, 1, k);
  st.focusK = k;
}
