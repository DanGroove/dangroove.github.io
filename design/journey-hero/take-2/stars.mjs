// Round 8 (B1, B2): the star field behind the hero. Pure rules and a small simulation first (checked in Node), then the pointer
// controller the player uses. All lengths are CSS px in the hero's own box (0, 0 at its top left); times are seconds.
// The field's look (parallax, scroll, the entrance's rings) is computed by the renderer from three uniforms; only the stars'
// own offsets (stirring, gathering, the blast) live here, in one Float32Array uploaded only while something moves.

export const STARS = {
  density: 1200 / (1440 * 900), most: 2000,
  size: [0.6, 2.2],             // px across, far to near
  mix: [0.12, 0.55],            // paper (or red) into ink, far to near
  red: 0.03,
  ink: '#151314', paper: '#F7F6F3', redInk: '#F0484F',
  parallax: 28, tau: 0.3,       // px at a full half-hero offset; follow time constant
  scroll: 0.12,                 // the nearest stars move this much faster than the page
  mass: [0.6, 1.6], drag: 2.3,  // drag / sqrt(mass), per second
  push: { reach: 60, gain: 0.09, cap: 1500, max: 39 },
  hold: { base: 80, grow: 260, full: 2.5, orbit: [6, 36], turn: Math.PI / 2, pull: 5, follow: 12, blast: [300, 1700], reach: 2, weak: 0.5, max: 0.45 },
  click: { time: 0.25, move: 6 },
  rest: { offset: 0.05, speed: 0.5 },
};

const clamp01 = x => Math.min(1, Math.max(0, x));
const smooth = x => { x = clamp01(x); return x * x * (3 - 2 * x); };
// A fixed hash of a star's index and a channel, 0 to 1.
export function hash(i, k = 0) {
  let h = Math.imul((i | 0) + 0x9e3779b9, 0x85ebca6b) ^ Math.imul((k | 0) + 0x7f4a7c15, 0xc2b2ae35);
  h = Math.imul(h ^ (h >>> 15), 0x2c1b3c6d); h = Math.imul(h ^ (h >>> 12), 0x297a2d39); h ^= h >>> 15;
  return (h >>> 0) / 4294967296;
}
export const starCount = (W, H) => Math.min(STARS.most, Math.round(STARS.density * W * H));
// The field for a hero of W x H: home position, depth, size, mix, red, mass. Homes scale with the box.
export function makeStars(W, H) {
  const n = starCount(W, H), stars = [];
  for (let i = 0; i < n; i++) {
    const d = hash(i, 2);
    stars.push({ x: hash(i, 0) * W, y: hash(i, 1) * H, d, size: STARS.size[0] + (STARS.size[1] - STARS.size[0]) * d, mix: STARS.mix[0] + (STARS.mix[1] - STARS.mix[0]) * d, red: hash(i, 3) < STARS.red, m: STARS.mass[0] + (STARS.mass[1] - STARS.mass[0]) * hash(i, 4) });
  }
  return stars;
}
// B1 parallax: a star's offset for the field's (followed) pointer fraction f = [fx, fy], each -0.5 to 0.5.
export const depthWeight = d => 0.12 + 0.88 * d * d;
export const parallaxOffset = (f, d) => [-f[0] * STARS.parallax * depthWeight(d), -f[1] * STARS.parallax * depthWeight(d)];
export const pointerFraction = (x, y, W, H) => [Math.min(0.5, Math.max(-0.5, x / W - 0.5)), Math.min(0.5, Math.max(-0.5, y / H - 0.5))];
// Scroll: s px of the hero scrolled away moves a star of depth d up by s * 0.12 * d more than the page.
export const scrollOffset = (s, d) => -Math.max(0, s) * STARS.scroll * d;
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
export function createField(W, H) {
  const stars = makeStars(W, H), n = stars.length;
  const offsets = new Float32Array(n * 2), S = new Float32Array(n * 2), V = new Float32Array(n * 2), age = new Float32Array(n);
  const big = new Uint8Array(n), moving = new Uint8Array(n);
  let awake = false, version = 0, par = [0, 0], cluster = null;
  // The largest offsets: under 40 px for stirring, under 45 % of the hero's width after a blast (a hard limit, kept just inside).
  const cap = i => (big[i] ? STARS.hold.max * W : STARS.push.max) * 0.995;
  const shown = i => { const e = Math.exp(-age[i]); return [S[2 * i] * e, S[2 * i + 1] * e]; };
  function rebase(i) {
    const e = Math.exp(-age[i]);
    S[2 * i] *= e; S[2 * i + 1] *= e; V[2 * i] *= e; V[2 * i + 1] *= e; age[i] = 0;
  }
  function kick(i, vx, vy, large = false) { rebase(i); V[2 * i] += vx; V[2 * i + 1] += vy; if (large) big[i] = 1; moving[i] = 1; awake = true; }
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
  function press(x, y) { cluster = new Map(); return { anchor: [x, y], anchorV: [0, 0], held: 0 }; }
  function gather(hold, pointer, dt) {
    hold.held += dt;
    [hold.anchor[0], hold.anchorV[0]] = follow(hold.anchor[0], hold.anchorV[0], pointer[0], dt, 1 / STARS.hold.follow);
    [hold.anchor[1], hold.anchorV[1]] = follow(hold.anchor[1], hold.anchorV[1], pointer[1], dt, 1 / STARS.hold.follow);
    const R = captureRadius(hold.held);
    for (let i = 0; i < n; i++) {
      if (cluster.has(i)) continue;
      const [px, py] = position(i);
      if (Math.hypot(px - pointer[0], py - pointer[1]) > R) continue;
      const rho = Math.max(1e-6, Math.hypot(px - hold.anchor[0], py - hold.anchor[1]));
      cluster.set(i, { rho, rv: 0, theta: Math.atan2(py - hold.anchor[1], px - hold.anchor[0]) });
    }
    const scale = cluster.size;
    for (const [i, c] of cluster) {
      // Radius: critically damped toward the star's own orbit, from rest, so it never passes it (nor the pointer).
      [c.rho, c.rv] = follow(c.rho, c.rv, orbitRadius(i, scale), dt, 1 / STARS.hold.pull);
      c.theta += STARS.hold.turn * dt;
      const s = stars[i], p = parallaxOffset(par, s.d);
      const tx = hold.anchor[0] + c.rho * Math.cos(c.theta) - s.x - p[0], ty = hold.anchor[1] + c.rho * Math.sin(c.theta) - s.y - p[1];
      S[2 * i] = tx; S[2 * i + 1] = ty; V[2 * i] = V[2 * i + 1] = 0; age[i] = 0; big[i] = 1; moving[i] = 1;
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
      if (c) kick(i, dir[0] * blastImpulse(hold.held, stars[i].m), dir[1] * blastImpulse(hold.held, stars[i].m), true);
      else if (r < STARS.hold.reach * R) { const k = STARS.hold.weak * (1 - r / (STARS.hold.reach * R)) ** 2; kick(i, dir[0] * k * blastImpulse(hold.held, stars[i].m), dir[1] * k * blastImpulse(hold.held, stars[i].m), true); }
    }
    const captured = cluster.size;
    cluster = null;
    return captured;
  }

  function step(dt) {
    if (!awake || !(dt > 0)) return awake;
    let any = !!cluster;
    for (let i = 0; i < n; i++) {
      if (!moving[i] || cluster?.has(i)) { if (cluster?.has(i)) { const [x, y] = shown(i); offsets[2 * i] = x; offsets[2 * i + 1] = y; } continue; }
      const c = Math.exp(-STARS.drag / Math.sqrt(stars[i].m) * dt);
      S[2 * i] += V[2 * i] * dt; S[2 * i + 1] += V[2 * i + 1] * dt;
      V[2 * i] *= c; V[2 * i + 1] *= c; age[i] += dt;
      let [x, y] = shown(i);
      const len = Math.hypot(x, y), limit = cap(i);
      if (len > limit) { const k = limit / len; S[2 * i] *= k; S[2 * i + 1] *= k; x *= k; y *= k; }
      const e = Math.exp(-age[i]);
      if (Math.hypot(x, y) < STARS.rest.offset && Math.hypot(V[2 * i] * e, V[2 * i + 1] * e) < STARS.rest.speed) {
        S[2 * i] = S[2 * i + 1] = V[2 * i] = V[2 * i + 1] = age[i] = 0; x = y = 0; moving[i] = 0; big[i] = 0;
      } else any = true;
      offsets[2 * i] = x; offsets[2 * i + 1] = y;
    }
    version++;
    awake = any;
    return awake;
  }
  function reset() { S.fill(0); V.fill(0); age.fill(0); offsets.fill(0); big.fill(0); moving.fill(0); cluster = null; awake = false; version++; }
  return {
    stars, offsets, W, H, push, press, gather, blast, step, reset, position, shown,
    setParallax(f) { par = f; },
    get awake() { return awake; }, get version() { return version; }, get cluster() { return cluster; },
  };
}

// ---- the controller. frame(view) is called by each draw and returns the renderer's star values.
export function createStars(hero, { reduced, win = hero.ownerDocument.defaultView, raf = f => win.requestAnimationFrame(f), draw, running, available, open = () => true, clock = () => win.performance.now() / 1000 } = {}) {
  let field = null, box = null, top = 0, scrollY = 0, pointer = null, previous = null, target = [0, 0], f = [0, 0], fv = [0, 0];
  let hold = null, holdStart = null, swallow = false, last = null, pending = false, attrs = null, attrsVersion = 0;
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
    if (!field || field.W !== rect.width || field.H !== rect.height) {
      field = createField(rect.width, rect.height); attrsVersion++;
      attrs = new Float32Array(field.stars.length * 5);
      field.stars.forEach((s, i) => attrs.set([s.x, s.y, s.d, s.size, s.red ? 1 : 0], i * 5));
    }
  }
  const local = e => box ? [e.clientX - box.left, e.clientY - (top - scrollY)] : null;
  win.addEventListener('scroll', () => { scrollY = win.scrollY || 0; redraw(); }, { passive: true });
  win.addEventListener('pointermove', e => {
    if (!usable(e) || !box) return;
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
    return {
      count: field.stars.length, attrs, attrsVersion, offsets: field.offsets, version: field.version,
      par: [f[0] * STARS.parallax, f[1] * STARS.parallax], scroll: still ? 0 : Math.max(0, scrollY - top), reveal, centre,
    };
  }
  const settled = () => Math.hypot(f[0] - target[0], f[1] - target[1]) < 1e-4 && Math.hypot(fv[0], fv[1]) < 1e-4;
  const busy = () => !!field && !reduced.matches && (!!hold || field.awake || !settled());
  return {
    measure, frame, after() { if (busy()) redraw(); }, busy,
    // The stage's click handler asks once: was that a hold (no craft change)?
    swallowClick() { const s = swallow; swallow = false; return s; },
    get field() { return field; }, get holding() { return hold ? hold.held : null; }, get fraction() { return f.slice(); },
  };
}
