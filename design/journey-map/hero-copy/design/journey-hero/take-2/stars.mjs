// Round 8 (B1, B2): the star field behind the hero. Pure rules and a small simulation first (checked in Node), then the pointer
// controller the player uses. All lengths are CSS px in the hero's own box (0, 0 at its top left); times are seconds.
// The field's look (parallax, scroll, the entrance's rings) is computed by the renderer from three uniforms; only the stars'
// own offsets (stirring, gathering, the blast) live here, in one Float32Array uploaded only while something moves.

import { STARS, STREAK_WINDOW, hash, starCount, makeStars, markKind, markFlag, FLAG_INK, flattenPath, winding, sampleMark, placeMark, streakGeometry } from './loader-stars.mjs';
export { STARS, hash, starCount, makeStars, markKind, markFlag, FLAG_INK, flattenPath, winding, sampleMark, placeMark };
import { readStarLabels } from './star-labels.mjs';

// R2: the fade-in's step, landing on exactly 1 (sums of dt / 0.4 in float32 can stop just short of it).
const fadeUp = (a, dt) => { const v = a + dt / STARS.fadeIn; return v >= 1 - 1e-5 ? 1 : v; };
const clamp01 = x => Math.min(1, Math.max(0, x));
const smooth = x => { x = clamp01(x); return x * x * (3 - 2 * x); };
// Round 16 (R2): an angle brought into -pi to pi.
const TURN = 2 * Math.PI;
const wrapAngle = a => a - TURN * Math.round(a / TURN);
// B1 parallax: a star's offset for the field's (followed) pointer fraction f = [fx, fy], each -0.5 to 0.5.
export const depthWeight = d => 0.12 + 0.88 * d * d;
export const parallaxOffset = (f, d) => [-f[0] * STARS.parallax * depthWeight(d), -f[1] * STARS.parallax * depthWeight(d)];
export const pointerFraction = (x, y, W, H) => [Math.min(0.5, Math.max(-0.5, x / W - 0.5)), Math.min(0.5, Math.max(-0.5, y / H - 0.5))];
// Scroll: s px of the hero scrolled away moves a star of depth d up by s * 0.12 * d more than the page.
export const scrollOffset = (s, d) => -Math.max(0, s) * STARS.scroll * d;
// Positions between simulation frames are line segments. Interpolate the recorded path over the shared exposure window,
// rather than multiplying this frame's velocity (which loses curved stirring and the blast's braking).
export function createTrailHistory(count) {
  const samples = [], spare = [], trails = new Float32Array(count * 4);
  function reset() { for (const s of samples) spare.push(s.positions); samples.length = 0; trails.fill(0); }
  return { reset, record(time, positions) {
    if (samples.length && time < samples.at(-1).time) reset();
    if (samples.length && time === samples.at(-1).time) return trails;
    const copy = spare.pop() || new Float64Array(count * 2); copy.set(positions);
    samples.push({ time, positions: copy });
    const at = time - STREAK_WINDOW;
    while (samples.length > 2 && samples[1].time <= at) spare.push(samples.shift().positions);
    const a = samples[0], b = samples[1] || a;
    const f = b.time > a.time ? clamp01((at - a.time) / (b.time - a.time)) : 0;
    for (let i = 0; i < count; i++) {
      const k = 2 * i, x = positions[k], y = positions[k + 1];
      const tail = [a.positions[k] + (b.positions[k] - a.positions[k]) * f,
        a.positions[k + 1] + (b.positions[k + 1] - a.positions[k + 1]) * f];
      const shape = streakGeometry(x, y, 1, tail);
      trails.set([x - tail[0], y - tail[1], ...shape.normal], 4 * i);
    }
    return trails;
  } };
}
// The critically damped follow, solved exactly over dt: x is the value, v its velocity, towards target.
export function follow(x, v, target, dt, tau = STARS.tau) {
  const w = 1 / tau, x0 = x - target, e = Math.exp(-w * dt), c = v + w * x0;
  return [target + (x0 + c * dt) * e, (v - w * c * dt) * e];
}
// The entrance: rings from the stage's centre; a star is wholly on or off by its home.
export const starOn = (x, y, centre, reach) => reach === null || Math.hypot(x - centre[0], y - centre[1]) <= reach;
export const starReach = (p, centre, W, H) => p >= 1 ? null : p <= 0 ? -1 : p * Math.max(...[[0, 0], [W, 0], [0, H], [W, H]].map(([x, y]) => Math.hypot(x - centre[0], y - centre[1])));
// B2: the capture radius after `held` seconds, and the blast's impulse for a star of mass m.
export const captureRadius = held => STARS.hold.base + STARS.hold.grow * Math.min(1, Math.max(0, held) / STARS.hold.full);
// Round 12 (S1): with a mark, a hold whose radius has reached its full 2.5 s size with fewer than the threshold captured
// keeps growing it at the same rate (104 px a second), up to the hero's diagonal; extra is the hold's extra radius so far.
// Round 16 (R5): it no longer stops once the formation starts. The blast still uses captureRadius (2.5 s cap).
export const growthRate = () => STARS.hold.grow / STARS.hold.full;
export const holdRadius = (held, extra, diagonal) => Math.min(diagonal, captureRadius(held) + extra);
export const blastImpulse = (held, m) => (STARS.hold.blast[0] + STARS.hold.blast[1] * Math.min(1, Math.max(0, held) / STARS.hold.full)) / m;
export const orbitRadius = (i, captured) => (STARS.hold.orbit[0] + (STARS.hold.orbit[1] - STARS.hold.orbit[0]) * hash(i, 5)) * (1 + 0.35 * Math.log2(1 + captured / 24));
// The push weight at distance r from the pointer's path.
export const pushWeight = r => { const k = 1 - smooth(r / STARS.push.reach); return k * k; };
function segmentDistance(px, py, a, b) {
  const vx = b[0] - a[0], vy = b[1] - a[1], len2 = vx * vx + vy * vy;
  const t = len2 ? clamp01(((px - a[0]) * vx + (py - a[1]) * vy) / len2) : 0;
  return Math.hypot(px - a[0] - t * vx, py - a[1] - t * vy);
}

// The simulation. Each star: S (coasting displacement), v (velocity), age; shown offset D = S * exp(-age). An impulse rebases
// S to D and age to 0; then S moves with v, v decays by drag / sqrt(m), and D goes home on exp(-age). No spring, no overshoot.
// Round 9: mark (from placeMark) makes a hold that has captured STARS.mark.threshold stars form the DG mark (round 12, S1); flags holds each star's colour code (markFlag).
export function createField(W, H, mark = null, labels = []) {
  const stars = makeStars(W, H, labels), n = stars.length;
  const offsets = new Float32Array(n * 2), S = new Float32Array(n * 2), V = new Float32Array(n * 2), age = new Float32Array(n);
  const big = new Uint8Array(n), moving = new Uint8Array(n), flags = new Float32Array(n);
  // Round 9: once a star's offset starts to shrink after a kick, it may never grow again nor swing past the side of home it
  // fell from (an impulse with a part toward home could otherwise carry it past home and out again: an overshoot).
  const last = new Float32Array(n).fill(-1), peak = new Float32Array(n * 2), falling = new Uint8Array(n);
  // Separate from coasting age: stirring must not restart an explosion's clock.
  const exploding = new Uint8Array(n), explosionAge = new Float64Array(n);
  function explode(i, vx, vy) { kick(i, vx, vy, true); exploding[i] = 1; explosionAge[i] = 0; }
  // Round 10 (R1): each star drawn in front has a return weight, the front copy's opacity: 1 while captured and from the
  // release until its offset starts to shrink, then its offset over its largest offset since the release; it never grows.
  // far holds that largest offset (-1 while not returning).
  const weights = new Float32Array(n), far = new Float32Array(n).fill(-1);
  // R2: fade is the front copy's fade-in since its capture (0 to 1 over 0.4 s, never falling); mixes is the mark weight m, how
  // far its front look has gone from its own toward the mark's (0 when given a point, 1 on arrival). alpha = fade x w is what
  // the front pass draws the star at.
  const fade = new Float32Array(n), mixes = new Float32Array(n), alpha = new Float32Array(n);
  let awake = false, version = 0, par = [0, 0], displayScroll = 0, cluster = null, front = 0, centre = null, formed = false;
  // Round 16 (R2): the ring of the hold: its members in cyclic order and its phase (radians turned since the press).
  let ring = null, charge = 0;
  // Each captured star's authored offset, in float64; shown positions have only float32 rounding.
  const base = new Float64Array(n * 2);
  const diagonal = Math.hypot(W, H);
  // The largest offsets: under 40 px for stirring, under 45 % of the hero's width after a blast (a hard limit, kept just inside).
  const cap = i => (big[i] ? STARS.hold.max * W : STARS.push.max) * 0.995;
  const shown = i => { const e = Math.exp(-age[i]); return [S[2 * i] * e, S[2 * i + 1] * e]; };
  function rebase(i) {
    const e = Math.exp(-age[i]);
    S[2 * i] *= e; S[2 * i + 1] *= e; V[2 * i] *= e; V[2 * i + 1] *= e; age[i] = 0;
  }
  function kick(i, vx, vy, large = false) { rebase(i); last[i] = -1; falling[i] = 0; V[2 * i] += vx; V[2 * i + 1] += vy; if (large) big[i] = 1; moving[i] = 1; awake = true; }
  // Where a star shows now (home, parallax and offset; scroll moves the whole field and is left out).
  const position = i => { const s = stars[i], p = parallaxOffset(par, s.d); return [s.x + p[0] + offsets[2 * i], s.y + p[1] + offsets[2 * i + 1]]; };

  // B1: the pointer's path since the last frame pushes the stars near it, along it, in proportion to its speed (capped).
  function push(a, b, dt) {
    const dx = b[0] - a[0], dy = b[1] - a[1], len = Math.hypot(dx, dy);
    if (!(len > 1e-6) || !(dt > 0)) return 0;
    const dir = [dx / len, dy / len], speed = Math.min(len / dt, STARS.push.cap);
    let count = 0;
    for (let i = 0; i < n; i++) {
      if (cluster?.has(i)) continue;
      const [px, py] = position(i), w = pushWeight(segmentDistance(px, py, a, b));
      if (w <= 0) continue;
      const e = Math.exp(-age[i]), along = (V[2 * i] * dir[0] + V[2 * i + 1] * dir[1]) * e, target = STARS.push.gain * w * speed / stars[i].m;
      if (target <= along) continue;
      kick(i, (target - along) * dir[0], (target - along) * dir[1]);
      count++;
    }
    return count;
  }

  // B2: a hold. Stars inside the growing radius are captured and pulled into a slowly turning cluster round the pointer.
  function press(x, y) { cluster = new Map(); formed = false; centre = null; ring = { order: [], phase: 0 }; charge = 0; return { anchor: [x, y], anchorV: [0, 0], held: 0, next: 0, freePoints: new Set(mark ? mark.points.map((_, j) => j) : []), extra: 0, radius: STARS.hold.base, formedAt: null, charge: 0 }; }
  // L13c: the first batch keeps its radial pairing. Later stars wait in the ring until a free point is closer than the
  // mark's centre. Reconsider the ring each frame: its turn and the moving mark bring points to the waiting stars' side.
  function assign(hold, ids, C) {
    const at = ids.map(i => { const [x, y] = position(i); return { i, x, y, a: Math.atan2(y - C[1], x - C[0]) }; });
    const k = Math.min(at.length, hold.freePoints.size);
    let take, rest;
    if (hold.next === 0) {
      at.sort((a, b) => Math.hypot(a.x - C[0], a.y - C[1]) - Math.hypot(b.x - C[0], b.y - C[1]));
      take = at.slice(0, k).sort((a, b) => a.a - b.a); rest = at.slice(k);
      const pts = [...hold.freePoints].slice(0, k).sort((a, b) => Math.atan2(mark.points[a].y, mark.points[a].x) - Math.atan2(mark.points[b].y, mark.points[b].x));
      take.forEach((t, q) => { t.j = pts[q]; });
    } else {
      rest = at; take = [];
      for (const i of ring.order) {
        const [x, y] = position(i);
        rest.push({ i, x, y, ring: true });
      }
      const nearest = t => {
        t.j = -1; t.distance = Infinity; t.limit = (t.x - C[0]) ** 2 + (t.y - C[1]) ** 2;
        for (const j of hold.freePoints) {
          const p = mark.points[j], d = (t.x - C[0] - p.x) ** 2 + (t.y - C[1] - p.y) ** 2;
          if (d < t.limit && d < t.distance) { t.j = j; t.distance = d; }
        }
      };
      rest.forEach(nearest);
      while (hold.freePoints.size) {
        let best = -1;
        for (let q = 0; q < rest.length; q++) if (rest[q].j >= 0 && (best < 0 || rest[q].distance < rest[best].distance)) best = q;
        if (best < 0) break;
        const t = rest.splice(best, 1)[0]; take.push(t); hold.freePoints.delete(t.j);
        // Only candidates whose nearest point was just taken need another search.
        for (const r of rest) if (r.j === t.j) nearest(r);
      }
      const leaving = new Set(take.filter(t => t.ring).map(t => t.i));
      if (leaving.size) {
        ring.order = ring.order.filter(i => !leaving.has(i));
        if (ring.order.length) respaceRing();
      }
      rest = rest.filter(t => !t.ring);
    }
    take.forEach(t => {
      const c = cluster.get(t.i), p = mark.points[t.j];
      hold.freePoints.delete(t.j);
      c.ring = false; c.point = t.j; c.kind = p.kind; c.e = [t.x - C[0] - p.x, t.y - C[1] - p.y]; c.ev = [0, 0]; c.arrived = false;
      // R2: from here the front look eases from the star's own toward this point's (its colour code says which mark colour).
      c.e0 = Math.hypot(c.e[0], c.e[1]); c.given = true; flags[t.i] = markFlag(c.kind); mixes[t.i] = 0;
    });
    hold.next += take.length;
    if (rest.length) join(rest.map(t => t.i), C);
  }
  // Round 16 (R2): stars join the ring. Each starts at the angle it was captured at, as its ring angle psi (its angle round
  // the ring centre less the phase), from rest in the turning frame. It goes into the cyclic order by psi among the members,
  // whose own order never changes; star k's target is delta + (k + 0.5 + jitter_k) 2 pi / N, delta the circular mean of
  // (psi_k - (k + 0.5 + jitter_k) 2 pi / N), so the members already there move as little as possible.
  function join(ids, C) {
    const R = [C[0] + mark.ring.centre[0], C[1] + mark.ring.centre[1]], key = a => ((a % TURN) + TURN) % TURN;
    const fresh = ids.map(i => {
      const [x, y] = position(i), c = cluster.get(i);
      c.ring = true; c.rho = Math.max(1e-6, Math.hypot(x - R[0], y - R[1])); c.rv = 0; c.psi = Math.atan2(y - R[1], x - R[0]) - ring.phase; c.pv = 0;
      // R1: its own radius in the band; R2: its own offset from the middle of its slot, under half a slot either way.
      c.radius = ringRadius(i, mark); c.jitter = ringJitter(i);
      return { i, a: key(c.psi) };
    }).sort((a, b) => a.a - b.a);
    // The members, from the one with the smallest angle on; each joiner goes in before the first member past its angle.
    const old = ring.order.map(i => ({ i, a: key(cluster.get(i).psi) }));
    let start = 0;
    old.forEach((m, k) => { if (m.a < old[start].a) start = k; });
    const merged = old.slice(start).concat(old.slice(0, start));
    let at = 0;
    for (const f of fresh) { while (at < merged.length && merged[at].a <= f.a) at++; merged.splice(at, 0, f); at++; }
    ring.order = merged.map(m => m.i);
    respaceRing();
  }
  // Joining and departing members share the same circular-mean targets. Keep the current radii and angular velocities;
  // turnRing follows the new targets with its existing easing instead of moving the remaining stars to their slots.
  function respaceRing() {
    const N = ring.order.length;
    let sx = 0, sy = 0;
    const slot = (k, c) => TURN * (k + 0.5 + c.jitter) / N;
    ring.order.forEach((i, k) => { const c = cluster.get(i), r = c.psi - slot(k, c); sx += Math.cos(r); sy += Math.sin(r); });
    const delta = Math.atan2(sy, sx);
    // The targets are unwrapped together, by one whole number of turns, to the nearest equivalent of the stars' own psi (the
    // circular mean already puts each star's target within about half a turn of it). First each psi is written, by whole
    // turns (which moves nothing), as one rising run round the order; slots and psi then rise together, so every star moves
    // part way from one ordered run to another and no star is sent the other way round past its neighbours.
    const cs = ring.order.map(i => cluster.get(i));
    cs.forEach((c, k) => {
      if (!k) return;
      const up = Math.floor((c.psi - cs[k - 1].psi) / TURN);
      if (up) { c.psi -= TURN * up; if (c.target !== undefined) c.target -= TURN * up; }
    });
    let lift = 0;
    cs.forEach((c, k) => { lift += c.psi - delta - slot(k, c); });
    const base = delta + TURN * Math.round(lift / N / TURN);
    cs.forEach((c, k) => { c.target = base + slot(k, c); });
  }
  // Round 16 (R2): each ring star's radius and ring angle follow its own radius and its place in its slot (critically damped,
  // in the turning frame). No passing: should a pair of neighbours close to under half of the smaller of their gap and a
  // tenth of a slot in one frame (velocities carried over from earlier targets can do that while the ring spreads), both
  // move apart to that gap and share their mean speed. Settled neighbours are 0.3 slots apart or more, so it never acts then.
  function turnRing(dt) {
    const cs = ring.order.map(i => cluster.get(i)), N = cs.length, was = cs.map(c => c.psi), tau = 1 / STARS.hold.pull;
    for (const c of cs) { [c.rho, c.rv] = follow(c.rho, c.rv, c.radius, dt, tau); [c.psi, c.pv] = follow(c.psi, c.pv, c.target, dt, tau); }
    for (let pass = 0, again = N > 1; again && pass < N; pass++) {
      again = false;
      for (let k = 0; k < N; k++) {
        const j = (k + 1) % N, a = cs[k], b = cs[j], g0 = ((was[j] - was[k]) % TURN + TURN) % TURN;
        const g1 = g0 + (b.psi - was[j]) - (a.psi - was[k]), floor = 0.5 * Math.min(g0, 0.1 * TURN / N);
        if (g1 >= floor) continue;
        const half = (floor - g1) / 2, v = (a.pv + b.pv) / 2;
        a.psi -= half; b.psi += half; a.pv = b.pv = v; again = true;
      }
    }
  }
  function gather(hold, pointer, dt) {
    hold.held += dt;
    [hold.anchor[0], hold.anchorV[0]] = follow(hold.anchor[0], hold.anchorV[0], pointer[0], dt, 1 / STARS.hold.follow);
    [hold.anchor[1], hold.anchorV[1]] = follow(hold.anchor[1], hold.anchorV[1], pointer[1], dt, 1 / STARS.hold.follow);
    // S1: past the full 2.5 s size, the radius goes on growing (only with a mark to form). Round 16 (R5): for the whole hold,
    // not only until the formation, so a still hold completes the mark and then fills the ring.
    if (mark) hold.extra = Math.max(0, hold.held - STARS.hold.full) * growthRate();
    const R = hold.radius = holdRadius(hold.held, hold.extra, diagonal);
    // Round 16 (R2): the ring's phase advances at today's turn, STARS.hold.turn, every frame of the hold.
    ring.phase += STARS.hold.turn * dt;
    for (let i = 0; i < n; i++) {
      if (cluster.has(i)) continue;
      const [px, py] = position(i);
      if (Math.hypot(px - pointer[0], py - pointer[1]) > R) continue;
      const rho = Math.max(1e-6, Math.hypot(px - hold.anchor[0], py - hold.anchor[1]));
      cluster.set(i, { rho, rv: 0, theta: Math.atan2(py - hold.anchor[1], px - hold.anchor[0]), fresh: true });
      exploding[i] = 0;
      // R2: the front copy fades in from 0 (a star still out from an earlier release goes on from the opacity it had).
      fade[i] = flags[i] ? fade[i] * weights[i] : 0;
      flags[i] = 1; weights[i] = 1; far[i] = -1; mixes[i] = 0;
    }
    const scale = cluster.size;
    // L1: once formed, the cluster stops turning and forms the mark; later captures take free points. S1: it forms
    // once the threshold is captured (or, short of it, once the radius has reached the hero's diagonal).
    centre = mark ? markCentre(hold.anchor, mark, W, H) : null;
    if (mark && !formed && (cluster.size >= STARS.mark.threshold || R >= diagonal)) hold.formedAt = hold.held;
    // C18-7: charge remains observable, but holding adds no movement to the mark or its rotating ring.
    const t0 = mark ? (hold.formedAt === null ? null : hold.formedAt + STARS.charge.start) : STARS.hold.full + STARS.charge.start;
    charge = hold.charge = chargeAmp(hold.held, t0);
    const place = (i, x, y) => { base[2 * i] = S[2 * i] = x; base[2 * i + 1] = S[2 * i + 1] = y; };
    if (mark && hold.formedAt !== null) {
      const fresh = [];
      for (const [i, c] of cluster) if (c.point === undefined && !c.ring) fresh.push(i);
      formed = true;
      if (fresh.length || (hold.freePoints.size && ring.order.length)) assign(hold, fresh, centre);
    }
    if (mark) turnRing(dt);
    for (const [i, c] of cluster) {
      // R2: the fade-in, 0 in the frame of the capture, then up by dt / 0.4 s.
      if (c.fresh) c.fresh = false; else fade[i] = fadeUp(fade[i], dt);
      if (c.point !== undefined) {
        // Critically damped from rest toward the point, relative to the (clamped) anchor: e only shrinks along its own line.
        const p = mark.points[c.point], s = stars[i], q = parallaxOffset(par, s.d);
        for (const k of [0, 1]) [c.e[k], c.ev[k]] = follow(c.e[k], c.ev[k], 0, dt, STARS.mark.tau);
        // R2: m = 1 - (distance past the 1 px of arrival) / (that distance when given the point), so it is exactly 1 on
        // arrival; it never falls, and rises at most STARS.fade a second (only a star given a point within about 2 px of it).
        const d = Math.hypot(c.e[0], c.e[1]), want = c.e0 > STARS.mark.arrive ? 1 - Math.max(0, d - STARS.mark.arrive) / (c.e0 - STARS.mark.arrive) : 1;
        // In the frame it is given its point, m stays 0.
        if (c.given) c.given = false; else mixes[i] = Math.max(mixes[i], Math.min(want, mixes[i] + STARS.fade * dt));
        if (!c.arrived && d <= STARS.mark.arrive) c.arrived = true;
        place(i, centre[0] + p.x + c.e[0] - s.x - q[0], centre[1] + p.y + c.e[1] - s.y - q[1]);
        V[2 * i] = V[2 * i + 1] = 0; age[i] = 0; big[i] = 1; moving[i] = 1;
        continue;
      }
      if (c.ring) {
        // The ring includes overflow and stars waiting for an eligible point, turning as one by its phase.
        c.theta = c.psi + ring.phase;
        const s = stars[i], q = parallaxOffset(par, s.d), rx = centre[0] + mark.ring.centre[0], ry = centre[1] + mark.ring.centre[1];
        place(i, rx + c.rho * Math.cos(c.theta) - s.x - q[0], ry + c.rho * Math.sin(c.theta) - s.y - q[1]);
        V[2 * i] = V[2 * i + 1] = 0; age[i] = 0; big[i] = 1; moving[i] = 1;
        continue;
      }
      // Radius: critically damped toward the star's own orbit, from rest, so it never passes it (nor the pointer).
      [c.rho, c.rv] = follow(c.rho, c.rv, orbitRadius(i, scale), dt, 1 / STARS.hold.pull);
      c.theta += STARS.hold.turn * dt;
      const s = stars[i], p = parallaxOffset(par, s.d);
      const tx = hold.anchor[0] + c.rho * Math.cos(c.theta) - s.x - p[0], ty = hold.anchor[1] + c.rho * Math.sin(c.theta) - s.y - p[1];
      place(i, tx, ty); V[2 * i] = V[2 * i + 1] = 0; age[i] = 0; big[i] = 1; moving[i] = 1;
    }
    awake = true;
    return R;
  }
  // Release: every captured star is thrown outward from the pointer; the stars nearby get a weaker push.
  function blast(hold, pointer) {
    const R = captureRadius(hold.held);
    for (let i = 0; i < n; i++) {
      const [px, py] = position(i), dx = px - pointer[0], dy = py - pointer[1], r = Math.hypot(dx, dy);
      const c = cluster.get(i), dir = r > 1e-6 ? [dx / r, dy / r] : c ? [Math.cos(c.theta), Math.sin(c.theta)] : [1, 0];
      if (c) explode(i, dir[0] * blastImpulse(hold.held, stars[i].m), dir[1] * blastImpulse(hold.held, stars[i].m));
      else if (r < STARS.hold.reach * R) { const k = STARS.hold.weak * (1 - r / (STARS.hold.reach * R)) ** 2; explode(i, dir[0] * k * blastImpulse(hold.held, stars[i].m), dir[1] * k * blastImpulse(hold.held, stars[i].m)); }
    }
    const captured = cluster.size;
    // R1: every star in front starts (or, if still out from an earlier release, keeps) its return weight.
    for (let i = 0; i < n; i++) if (flags[i] && far[i] < 0) { weights[i] = 1; far[i] = Math.hypot(offsets[2 * i], offsets[2 * i + 1]); }
    cluster = null; formed = false; ring = null; charge = 0;
    return captured;
  }

  // The export ball uses the same capped dynamics, without changing capture or passes.
  function burstAt(x, y, reach, strength = 0.75 * STARS.hold.blast[0]) {
    for (let i = 0; i < n; i++) {
      if (cluster?.has(i)) continue;
      const [px, py] = position(i), dx = px - x, dy = py + scrollOffset(displayScroll, stars[i].d) - y, r = Math.hypot(dx, dy);
      if (!(r < reach) || r < 1e-6) continue;
      const impulse = strength * (1 - r / reach) ** 2 / stars[i].m;
      explode(i, dx / r * impulse, dy / r * impulse);
    }
  }
  // Use the largest actually drawn copy, including its current mark mix.
  function gateTrails(trails) {
    for (let i = 0; i < n; i++) {
      const own = stars[i].size, width = flags[i] > 1.5 ? own + (Math.max(own, STARS.mark.size) - own) * mixes[i] : own;
      if (exploding[i] && explosionAge[i] >= 0.05 && Math.hypot(trails[4 * i], trails[4 * i + 1]) <= width) exploding[i] = 0;
      if (!exploding[i]) trails.fill(0, 4 * i, 4 * i + 4);
    }
    return trails;
  }
  function step(dt) {
    if (!awake || !(dt > 0)) return awake;
    let any = !!cluster;
    front = 0;
    for (let i = 0; i < n; i++) {
      if (exploding[i]) explosionAge[i] += dt;
      if (flags[i]) front++;
      if (!moving[i] || cluster?.has(i)) { if (cluster?.has(i)) { const [x, y] = shown(i); offsets[2 * i] = x; offsets[2 * i + 1] = y; } continue; }
      const c = Math.exp(-STARS.drag / Math.sqrt(stars[i].m) * dt);
      S[2 * i] += V[2 * i] * dt; S[2 * i + 1] += V[2 * i + 1] * dt;
      V[2 * i] *= c; V[2 * i + 1] *= c; age[i] += dt;
      let [x, y] = shown(i);
      const len = Math.hypot(x, y), limit = cap(i);
      if (len > limit) { const k = limit / len; S[2 * i] *= k; S[2 * i + 1] *= k; x *= k; y *= k; }
      const e = Math.exp(-age[i]);
      if (last[i] >= 0) {
        const now = Math.hypot(x, y);
        if (!falling[i] && now < last[i]) { falling[i] = 1; peak[2 * i] = offsets[2 * i]; peak[2 * i + 1] = offsets[2 * i + 1]; }
        if (falling[i]) {
          let k = now > last[i] ? last[i] / now : 1;
          x *= k; y *= k;
          const pl = Math.hypot(peak[2 * i], peak[2 * i + 1]), ux = pl ? peak[2 * i] / pl : 0, uy = pl ? peak[2 * i + 1] / pl : 0, along = x * ux + y * uy;
          if (along < 1e-3) { x += (1e-3 - along) * ux; y += (1e-3 - along) * uy; }
          S[2 * i] = x / e; S[2 * i + 1] = y / e;
        }
      }
      last[i] = Math.hypot(x, y);
      if (flags[i]) fade[i] = fadeUp(fade[i], dt);
      if (flags[i] && far[i] >= 0) {
        // R1: the return weight: 1 until the guard sees the offset fall (a dip in the kick's first frame, before the guard
        // runs, does not count), then offset over its largest since the release, never growing.
        const now = last[i];
        if (now > far[i]) far[i] = now;
        if (falling[i]) weights[i] = Math.min(weights[i], Math.max(far[i] > 0 ? now / far[i] : 0, weights[i] - STARS.fade * dt));
      }
      if (Math.hypot(x, y) < STARS.rest.offset && Math.hypot(V[2 * i] * e, V[2 * i + 1] * e) < STARS.rest.speed) {
        // Home: the front copy, faded to its weight (near 0 by now, and kept in weights for the checks), leaves the front pass;
        // the copy behind is the star's own look, as it was all the way home.
        S[2 * i] = S[2 * i + 1] = V[2 * i] = V[2 * i + 1] = age[i] = 0; x = y = 0; moving[i] = 0; big[i] = 0; last[i] = -1; falling[i] = 0; exploding[i] = 0;
        if (flags[i]) { flags[i] = 0; front--; far[i] = -1; }
      } else any = true;
      offsets[2 * i] = x; offsets[2 * i + 1] = y;
    }
    // R2: the opacity each front copy is drawn at.
    for (let i = 0; i < n; i++) alpha[i] = flags[i] ? fade[i] * weights[i] : 0;
    version++;
    awake = any;
    return awake;
  }
  function reset() { exploding.fill(0); explosionAge.fill(0); weights.fill(0); fade.fill(0); mixes.fill(0); alpha.fill(0); far.fill(-1); S.fill(0); V.fill(0); age.fill(0); offsets.fill(0); big.fill(0); moving.fill(0); flags.fill(0); last.fill(-1); falling.fill(0); front = 0; cluster = null; formed = false; ring = null; charge = 0; awake = false; version++; }
  // What the checks and __hero.stars read about the mark.
  function markState() {
    let assigned = 0, arrived = 0;
    if (cluster) for (const c of cluster.values()) if (c.point !== undefined) { assigned++; if (c.arrived) arrived++; }
    // Round 16 (R2): the ring, its centre in the hero's px (null before the hold has a mark centre), radius, phase and count;
    // The retained charge diagnostic; it never offsets a held star.
    const circle = mark ? { centre: centre && [centre[0] + mark.ring.centre[0], centre[1] + mark.ring.centre[1]], radius: mark.ring.radius, phase: ring ? ring.phase : 0, count: ring ? ring.order.length : 0 } : null;
    return { points: mark ? mark.points.length : 0, height: mark ? mark.height : 0, formed, assigned, arrived, ring: circle, charge, front, centre: centre && centre.slice(), captured: cluster ? cluster.size : 0 };
  }
  return {
    stars, offsets, flags, weights, fade, mixes, alpha, mark, W, H, base, push, press, gather, blast, burstAt, gateTrails, exploding, explosionAge, step, reset, position, shown, markState,
    velocity: i => [V[2 * i] * Math.exp(-age[i]), V[2 * i + 1] * Math.exp(-age[i])],
    get front() { return front; },
    setParallax(f) { par = f; },
    setScroll(y) { displayScroll = y; },
    get awake() { return awake; }, get version() { return version; }, get cluster() { return cluster; }, get ring() { return ring; },
  };
}

// The mark's centre: the hold's anchor, clamped so the whole mark stays inside the hero with a 16 px margin. Round 16 (R3):
// and so the whole ring does too (its circle out to the band's outer edge, where the farthest ring stars sit); on an axis
// where the ring cannot fit, the mark-only clamp; where even the mark cannot fit, the middle.
export const markCentre = (anchor, mark, W, H) => [W, H].map((L, k) => {
  const m = STARS.mark.margin, lo = m + mark.half[k], hi = L - lo;
  if (lo > hi) return L / 2;
  const r = mark.ring.radius + mark.ring.band, w = mark.ring.centre[k], a = Math.max(lo, m + r - w), b = Math.min(hi, L - m - r - w);
  return a > b ? Math.min(hi, Math.max(lo, anchor[k])) : Math.min(b, Math.max(a, anchor[k]));
});
// Round 16 (R1): a ring star's own radius in the band (today's hash channel); R2: its own offset in its slot, in slots.
export const ringRadius = (i, mark) => mark.ring.radius + hash(i, 6) * mark.ring.band;
export const ringJitter = i => 0.7 * (hash(i, 7) - 0.5);
// The charge diagnostic t seconds held, starting at t0 (formedAt + start). Release uses held time, not this value.
export const chargeAmp = (t, t0) => t0 === null || t < t0 ? 0 : STARS.charge.amp * smooth((t - t0) / STARS.charge.ramp);
// The page's own mark, read from the DOM: the [data-mark] link's paths, their d and fill.
export function readMark(root) {
  const link = root?.querySelector?.('[data-mark]') || root?.ownerDocument?.querySelector?.('[data-mark]');
  const paths = link ? [...link.querySelectorAll('path')].map(p => ({ d: p.getAttribute('d'), fill: p.getAttribute('fill') })) : [];
  return paths.filter(p => p.d).length ? paths.filter(p => p.d) : null;
}

// ---- the controller. frame(view) is called by each draw and returns the renderer's star values.
// JOIN: lift (CSS px) is the journey map's lift, the hero's scroll term now that the hero is pinned in the map's stage.
export function createStars(hero, { reduced, win = hero.ownerDocument.defaultView, raf = f => win.requestAnimationFrame(f), draw, running, available, lift = () => 0, open = () => true, clock = () => win.performance.now() / 1000 } = {}) {
  let field = null, box = null, top = 0, scrollY = 0, pointer = null, previous = null, target = [0, 0], f = [0, 0], fv = [0, 0];
  let hold = null, holdStart = null, swallow = false, last = null, pending = false, attrs = null, attrsVersion = 0, markKey = null, sample = null;
  let shownPar = [0, 0], shownScroll = 0; // JOIN: the parallax and scroll term of the last frame handed to the renderer
  let history = null, positions = null, trailVersion = 0;
  let labelKey = null;
  const usable = e => !reduced.matches && (e.pointerType === 'mouse' || e.pointerType === 'pen');
  function redraw() {
    if (!available() || running() || pending) return;
    pending = true;
    raf(() => { pending = false; if (available() && !running()) draw(); });
  }
  // Geometry is read only here (start, resize, fonts), never per frame.
  function measure(rect, y = win.scrollY || 0) {
    box = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    top = rect.top + y; scrollY = y;
    // L1: the mark's paths are read from the page and sampled once; placed once per hero size, never per frame.
    const paths = readMark(hero), key = paths ? paths.map(p => p.fill + ' ' + p.d).join('|') : null, changed = key !== markKey;
    if (changed) { markKey = key; sample = paths ? sampleMark(paths, STARS.mark.count) : null; }
    const labels = readStarLabels(hero, rect), nextLabelKey = JSON.stringify(labels);
    if (!field || changed || field.W !== rect.width || field.H !== rect.height || labelKey !== nextLabelKey) {
      labelKey = nextLabelKey;
      hold = null; holdStart = null;
      field = createField(rect.width, rect.height, sample ? placeMark(sample, rect.width, rect.height) : null, labels); attrsVersion++;
      attrs = new Float32Array(field.stars.length * 5);
      history = createTrailHistory(field.stars.length); positions = new Float64Array(field.stars.length * 2);
      field.stars.forEach((s, i) => attrs.set([s.x, s.y, s.d, s.size, s.red ? 1 : 0], i * 5));
    }
  }
  const local = e => box ? [e.clientX - box.left, e.clientY - box.top] : null; // JOIN: pinned, the hero no longer scrolls with the window
  win.addEventListener('scroll', () => { scrollY = win.scrollY || 0; field?.setScroll(reduced.matches ? 0 : lift()); redraw(); }, { passive: true }); // JOIN: the scroll term is the lift
  win.addEventListener('pointermove', e => {
    if (!usable(e) || !box || !open()) return;
    pointer = local(e);
    target = pointerFraction(pointer[0], pointer[1], box.width, box.height);
    redraw();
  }, { passive: true });
  const away = () => { target = [0, 0]; pointer = null; previous = null; redraw(); };
  hero.ownerDocument.addEventListener('pointerleave', away);
  win.addEventListener('blur', away);
  // B2: a mouse or pen press anywhere in the hero, except where the page has its own clicks.
  hero.addEventListener('pointerdown', e => {
    if (!usable(e) || (e.button ?? 0) !== 0 || !open() || !field) return;
    if (e.target?.closest?.('a, button, [data-name]')) return;
    pointer = local(e);
    hold = field.press(...pointer);
    holdStart = { x: e.clientX, y: e.clientY, moved: 0, at: clock(), stage: !!e.target?.closest?.('[data-stage-box]') };
    redraw();
  });
  win.addEventListener('pointermove', e => { if (holdStart) holdStart.moved = Math.max(holdStart.moved, Math.hypot(e.clientX - holdStart.x, e.clientY - holdStart.y)); }, { passive: true });
  function release(e) {
    if (!hold) return;
    if (e && box) pointer = local(e);
    const held = clock() - holdStart.at, click = held <= STARS.click.time && holdStart.moved < STARS.click.move;
    // A short, still press on the stage stays a click (the next craft); a hold's release does not change the craft.
    swallow = holdStart.stage && !click;
    hold.held = Math.max(hold.held, held);
    field.blast(hold, pointer || hold.anchor);
    hold = null; holdStart = null; redraw();
  }
  win.addEventListener('pointerup', release);
  win.addEventListener('pointercancel', release);
  reduced.addEventListener?.('change', () => { hold = null; holdStart = null; target = [0, 0]; f = [0, 0]; fv = [0, 0]; field?.reset(); redraw(); });

  function frame(reveal = null, centre = [0, 0]) {
    if (!field) return null;
    const now = clock(), elapsed = last === null ? 1 / 60 : now - last, dt = elapsed <= 0 ? 0 : elapsed > 0.25 ? 1 / 60 : Math.min(elapsed, 0.05);
    last = now;
    const still = reduced.matches, live = !still && open();
    const want = live ? target : [0, 0];
    if (still) { f = [0, 0]; fv = [0, 0]; }
    else for (const k of [0, 1]) [f[k], fv[k]] = follow(f[k], fv[k], want[k], dt);
    field.setParallax(f);
    if (live && pointer && previous) field.push(previous, pointer, dt);
    previous = live && pointer ? pointer.slice() : null;
    if (live && hold) field.gather(hold, pointer || hold.anchor, dt);
    field.step(dt);
    // JOIN: the scroll term is the lift, not the window's scroll; both values are kept for drawn().
    const scroll = still ? 0 : lift();
    shownPar = [f[0] * STARS.parallax, f[1] * STARS.parallax]; shownScroll = scroll;
    field.setScroll(scroll);
    field.stars.forEach((s, i) => {
      // Own motion only. The renderer still adds parallax and scroll to the head.
      positions[2 * i] = attrs[5 * i] + field.offsets[2 * i];
      positions[2 * i + 1] = attrs[5 * i + 1] + field.offsets[2 * i + 1];
    });
    if (still || !live) history.reset();
    const trails = field.gateTrails(history.record(now, positions)); trailVersion++;
    return {
      count: field.stars.length, attrs, attrsVersion, offsets: field.offsets, flags: field.flags, weights: field.weights, alpha: field.alpha, mixes: field.mixes, front: field.front, markSize: STARS.mark.size, version: field.version,
      trails, trailVersion,
      par: shownPar, scroll: shownScroll, reveal, centre,
    };
  }
  const settled = () => Math.hypot(f[0] - target[0], f[1] - target[1]) < 1e-4 && Math.hypot(fv[0], fv[1]) < 1e-4;
  const busy = () => !!field && !reduced.matches && (!!hold || field.awake || !settled());
  // JOIN: where the renderer draws star i, in the hero's px: VERT_STARS's p (home, own offset, less parallax by depth weight,
  // less the scroll term by depth).
  function drawn(i, out = [0, 0]) {
    const s = field.stars[i], w = depthWeight(s.d);
    out[0] = s.x + field.offsets[2 * i] - shownPar[0] * w;
    out[1] = s.y + field.offsets[2 * i + 1] - shownPar[1] * w - shownScroll * STARS.scroll * s.d;
    return out;
  }
  // JOIN: its drawn look: size across (CSS px), colour, and opacity on the ink ground (paper or red mixed into ink by depth).
  // A star still out after a hold also has its front copy, at its weight, eased toward the mark's look by its mark weight;
  // the two are folded into one look (the larger size, the copy's colour once past half, opacity laid over).
  function look(i) {
    const s = field.stars[i], own = s.red ? STARS.redInk : STARS.paper, a = field.flags[i] ? field.alpha[i] : 0;
    if (!(a > 0)) return { size: s.size, colour: own, alpha: s.mix };
    const k = field.flags[i] > 1.5 ? clamp01(field.mixes[i]) : 0, mark = FLAG_INK[field.flags[i]] || own;
    const fa = s.mix + (1 - s.mix) * k;
    return { size: s.size + (Math.max(s.size, STARS.mark.size) - s.size) * k, colour: k > 0.5 ? mark : own, alpha: s.mix + (1 - s.mix) * fa * a };
  }
  return {
    drawn, look, letGo() { release(null); }, // JOIN: drawn, look; letGo releases any hold (for the lift)
    async prepare(yieldFrame) {
      const paths = readMark(hero);
      if (paths) { sample = await sampleMark(paths, STARS.mark.count, yieldFrame); markKey = paths.map(p => p.fill + ' ' + p.d).join('|'); }
    },
    get sample() { return sample; },
    measure, frame, after() { if (busy()) redraw(); }, busy,
    // The stage's click handler asks once: was that a hold (no craft change)?
    swallowClick() { const s = swallow; swallow = false; return s; },
    get field() { return field; }, get holding() { return hold ? hold.held : null; }, get radius() { return hold ? hold.radius : null; }, get fraction() { return f.slice(); },
    get mark() { return field ? field.markState() : null; },
  };
}
