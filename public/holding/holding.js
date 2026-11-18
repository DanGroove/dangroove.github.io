/*
  "Under construction" page: the barrier chain.

  The links use the proportions of the G in the DG mark. Per mean radius:
  stroke 0.447, the over/under gap 0.134 a side, and each ring 1.42 on from
  the last, so every link passes through the next the way the D passes
  through the G.

  The chain is a small rigid-link simulation. It hangs between two hooks just
  off the page edges, can be grabbed and pulled, and comes off a hook when it
  is pulled hard enough (or from the "Unhook the chain" button).
*/
(() => {
  'use strict';

  const root = document.documentElement;
  if (root.classList.contains('is-classic')) return;

  const NS = 'http://www.w3.org/2000/svg';
  const $ = (sel) => document.querySelector(sel);
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Light and dark ---------- */

  const themeBtn = $('[data-theme-toggle]');
  const themeMeta = $('meta[name="theme-color"]');
  const dark = window.matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => {
    const set = root.getAttribute('data-theme');
    return set ? set === 'dark' : dark.matches;
  };
  const syncTheme = () => {
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(isDark()));
    if (themeMeta) themeMeta.setAttribute('content', isDark() ? '#151314' : '#e9ebed');
  };
  if (themeBtn) {
    themeBtn.hidden = false;
    themeBtn.addEventListener('click', () => {
      const next = isDark() ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try {
        localStorage.setItem('dg-theme', next);
      } catch (e) {
        /* private mode: the choice just lasts for this visit */
      }
      syncTheme();
    });
  }
  if (dark.addEventListener) dark.addEventListener('change', syncTheme);
  syncTheme();

  /* ---------- The chain ---------- */

  const stage = $('[data-stage]');
  const svg = $('[data-chain]');
  const unhookBtn = $('[data-unhook]');
  const openEl = $('[data-open]');
  const live = $('[data-live]');
  if (!stage || !svg) {
    window.__hpReady = true;
    return;
  }

  // Proportions, in mean radii of a ring.
  const STROKE = 0.447;
  const HALO = 0.715;
  const STEP = 1.42;
  const DIAM = 2 + STROKE; // outer diameter

  // Feel.
  const SUB = 1 / 120; // physics step, seconds
  const ITER = 32; // constraint passes per step
  const DAMP = 0.9925; // velocity kept per step
  const POP = 1.25; // pull or push this far past what the chain has (ring diameters) and a hook lets go
  const GIVE = 0.22; // how far past taut the chain follows the hand, as a share of the pull
  const EASY = 28; // the bend per link, in degrees, that the chain takes without complaint
  const BEND = 1.91; // closest the links either side of a link may sit, in link spacings (a bend of 34.5 degrees)
  const CATCH = 18; // physics steps the held link takes to catch up with the hand once a hook lets go
  const PACE = 0.33; // the most the held link moves in one physics step, in link spacings
  const SNARL = 0.12; // links left this far off their spacing (in spacings) for a moment mean a tangle
  const STAGGER = 52; // ms between links on the way in (matches the CSS)
  const KICK = 1.5; // drop speed of each link as it lands, ring diameters per second
  const NUDGE = 0.05; // how much a passing cursor pushes a link

  let W = 0;
  let H = 0;
  let D = 0; // ring outer diameter
  let r = 0; // ring mean radius
  let s = 0; // link spacing
  let n = 0; // number of spaces between links (n + 1 links)
  let rest = null; // hanging pose
  let grav = 0; // gravity, px per second squared
  let popAt = 0; // how far past what the chain has, in px, the hand has to go to free a hook
  let bend = 0; // closest the links either side of a link may sit, in px
  let lean = [0, 0, 0, 0]; // how far the held chain has moved hook A (x, y) and hook B (x, y) out of place
  let pannable = false; // the page scrolls, so a swipe on the chain must be free to scroll it
  let ax = 0;
  let ay = 0;
  let bx = 0;
  let by = 0;
  let x = [];
  let y = [];
  let px = [];
  let py = [];
  let free = [];
  let rings = [];
  let overs = [];

  let hookA = true;
  let hookB = true;
  let isOpen = false;
  let grab = null;
  let settle = 0; // steps left of extra calm after the chain is back on both hooks
  const SETTLE = 150;
  let carry = null; // hanging the chain back up: an unseen hand takes the loose end over to its hook
  let kicks = null;
  let running = false;
  let raf = 0;
  let last = 0;
  let acc = 0;
  let calm = 0;
  let unseen = 0;
  let snarl = 0;

  const el = (name, attrs) => {
    const node = document.createElementNS(NS, name);
    if (attrs) for (const key in attrs) node.setAttribute(key, attrs[key]);
    return node;
  };
  const fix = (v) => Math.round(v * 100) / 100;

  // How n rigid links hang between two hooks: the slope steps evenly from link to link.
  function hangPose(count, step, dip) {
    const mid = (count - 1) / 2;
    const dipFor = (k) => {
      let d = 0;
      for (let j = 0; j < count; j++) {
        const t = k * (mid - j);
        if (t > 0) d += (step * t) / Math.sqrt(1 + t * t);
      }
      return d;
    };
    let lo = 0;
    let hi = 8;
    for (let q = 0; q < 48; q++) {
      const k = (lo + hi) / 2;
      if (dipFor(k) < dip) lo = k;
      else hi = k;
    }
    const k = (lo + hi) / 2;
    const dx = [];
    const dy = [];
    let span = 0;
    for (let j = 0; j < count; j++) {
      const t = k * (mid - j);
      const c = 1 / Math.sqrt(1 + t * t);
      dx.push(step * c);
      dy.push(step * t * c);
      span += step * c;
    }
    return { dx, dy, span };
  }

  // Where the page itself scrolls, an up or down swipe that starts on the chain has to stay a scroll.
  function markPannable() {
    pannable = root.scrollHeight > window.innerHeight + 1;
    svg.classList.toggle('is-pannable', pannable);
  }

  function layout() {
    const box = stage.getBoundingClientRect();
    W = box.width;
    H = box.height;
    // Links the size of a hand, not of the page: about a seventh of the width.
    const room = H - 8;
    D = Math.max(72, Math.min(clamp(W * 0.14, 120, 210), room / 1.45));
    r = D / DIAM;
    s = r * STEP;
    // A barrier chain's sag: deeper on a wide page, never deeper than the stage.
    const dip = clamp(0.13 * W, 0.45 * D, Math.max(0.45 * D, room - D));
    grav = 6 * D + 600;
    popAt = Math.max(POP * D, 160);
    bend = BEND * s;
    lean = [0, 0, 0, 0];
    markPannable();
    // Both hooks sit just past the page edges, so the chain runs off both sides.
    const reach = W + 1.04 * D;
    n = Math.max(4, Math.ceil(reach / s));
    rest = hangPose(n, s, dip);
    while (rest.span < reach) {
      n += 1;
      rest = hangPose(n, s, dip);
    }
    ax = (W - rest.span) / 2;
    bx = ax + rest.span;
    ay = by = Math.max(D / 2, (H - (D + dip)) / 2 + D / 2);
  }

  function pose() {
    x = [ax];
    y = [ay];
    for (let j = 0; j < n; j++) {
      x.push(x[j] + rest.dx[j]);
      y.push(y[j] + rest.dy[j]);
    }
    px = x.slice();
    py = y.slice();
    free = x.map(() => 1);
  }

  function ring(i, clipGap, clipBody) {
    const group = el('g', { class: 'hp-link' });
    group.style.setProperty('--i', String(Math.max(0, i - 1))); // its turn on the way in
    const gap = el('circle', { class: 'hp-gap', r: fix(r), 'stroke-width': fix(HALO * r) });
    const body = el('circle', {
      class: 'hp-ring ' + (i % 2 ? 'is-b' : 'is-a'),
      r: fix(r),
      'stroke-width': fix(STROKE * r),
      'data-i': i,
    });
    if (clipGap) gap.setAttribute('clip-path', 'url(#' + clipGap + ')');
    if (clipBody) body.setAttribute('clip-path', 'url(#' + clipBody + ')');
    group.appendChild(gap);
    group.appendChild(body);
    return group;
  }

  function build() {
    svg.textContent = '';
    const defs = el('defs');
    const under = el('g');
    const over = el('g');
    rings = [];
    overs = [];
    for (let i = 0; i <= n; i++) {
      const group = ring(i);
      under.appendChild(group);
      rings.push(group);
    }
    // Each link is drawn once more on the lower side of the line to the next link,
    // which is where it passes over. The windows are set in that pair's own frame
    // (x toward the next link, y to the lower side) and turn with the chain. They
    // start where the two bands first meet, so a bend in the chain never reaches the
    // crossing before, and the gap's window is a touch tighter than the ring's so
    // no hairline shows at the join.
    for (let i = 0; i < n; i++) {
      const idGap = 'hp-g' + i;
      const idBody = 'hp-b' + i;
      const cg = el('rect', { x: fix(0.27 * r), y: fix(0.012 * r), width: fix((STEP - 0.37) * r), height: fix(1.4 * r) });
      const cb = el('rect', { x: fix(0.22 * r), y: 0, width: fix((STEP - 0.27) * r), height: fix(1.46 * r) });
      const clipGap = el('clipPath', { id: idGap });
      const clipBody = el('clipPath', { id: idBody });
      clipGap.appendChild(cg);
      clipBody.appendChild(cb);
      defs.appendChild(clipGap);
      defs.appendChild(clipBody);
      const group = ring(i, idGap, idBody);
      over.appendChild(group);
      overs.push({ group, cg, cb });
    }
    svg.appendChild(defs);
    svg.appendChild(under);
    svg.appendChild(over);
  }

  function render() {
    for (let i = 0; i <= n; i++) {
      rings[i].setAttribute('transform', 'translate(' + fix(x[i]) + ' ' + fix(y[i]) + ')');
    }
    for (let i = 0; i < n; i++) {
      const turn = 'rotate(' + fix((Math.atan2(y[i + 1] - y[i], x[i + 1] - x[i]) * 180) / Math.PI) + ')';
      const o = overs[i];
      o.group.setAttribute('transform', 'translate(' + fix(x[i]) + ' ' + fix(y[i]) + ')');
      o.cg.setAttribute('transform', turn);
      o.cb.setAttribute('transform', turn);
    }
  }

  function step() {
    const g = grav * SUB * SUB;
    // While it is carried back up, and for a moment after, the chain is held steady so it
    // settles onto its hooks instead of whipping across the page.
    const keep = reduce.matches ? 0.9 : carry ? 0.972 : settle > 0 ? DAMP - ((DAMP - 0.972) * settle--) / SETTLE : DAMP;
    free[0] = hookA ? 0 : 1;
    free[n] = hookB ? 0 : 1;
    for (let i = 0; i <= n; i++) {
      if (!free[i] || (grab && grab.i === i)) continue;
      const vx = (x[i] - px[i]) * keep;
      const vy = (y[i] - py[i]) * keep;
      px[i] = x[i];
      py[i] = y[i];
      x[i] += vx;
      y[i] += vy + g;
    }
    if (carry) lift();
    if (grab) {
      // The held link goes to the hand, but never in one jump: a link has weight, and just
      // after a hook lets go it takes a moment to catch up, so the loose end swings after it
      // instead of cracking like a whip.
      const i = grab.i;
      const dx = grab.tx - x[i];
      const dy = grab.ty - y[i];
      const d = Math.hypot(dx, dy);
      const k = Math.min(grab.catching > 0 ? 1 / grab.catching-- : 1, d ? (PACE * s) / d : 1);
      x[i] = px[i] = x[i] + dx * k;
      y[i] = py[i] = y[i] + dy * k;
      // Each hook the chain is still on keeps its place by the held link. Pulled past
      // straight, it leans after the link. Pushed past its tightest fold, it gives way, as
      // if the chain were being fed off the page.
      for (const [k0, on, hx, hy, m] of [
        [0, hookA, ax, ay, i],
        [2, hookB, bx, by, n - i],
      ]) {
        const [over, ux, uy] = on ? past(hx, hy, m, x[i], y[i]) : [0, 0, 0];
        lean[k0] = ux * over;
        lean[k0 + 1] = uy * over;
      }
    } else {
      // With the hand off, the hooks spring back to where they belong.
      for (let k = 0; k < 4; k++) lean[k] = Math.abs(lean[k]) < 0.02 ? 0 : lean[k] * 0.92;
    }
    if (hookA) {
      x[0] = px[0] = ax + lean[0];
      y[0] = py[0] = ay + lean[1];
    }
    if (hookB) {
      x[n] = px[n] = bx + lean[2];
      y[n] = py[n] = by + lean[3];
    }
    const held = grab ? grab.i : -1;
    for (let pass = 0; pass < ITER; pass++) {
      for (let q = 0; q < n; q++) {
        const j = pass % 2 ? n - 1 - q : q; // sweep both ways so neither end leads
        const wa = free[j] && j !== held ? 1 : 0;
        const wb = free[j + 1] && j + 1 !== held ? 1 : 0;
        const sum = wa + wb;
        if (!sum) continue;
        const dx = x[j + 1] - x[j];
        const dy = y[j + 1] - y[j];
        const d = Math.hypot(dx, dy) || 1e-6;
        const k = (d - s) / d / sum;
        x[j] += dx * k * wa;
        y[j] += dy * k * wa;
        x[j + 1] -= dx * k * wb;
        y[j + 1] -= dy * k * wb;
      }
      // A chain of rings only bends so far: the links either side of a link stay clear
      // of each other, so loose links cannot fold into a pile.
      for (let q = 0; q < n - 1; q++) {
        const j = pass % 2 ? n - 2 - q : q;
        const dx = x[j + 2] - x[j];
        const dy = y[j + 2] - y[j];
        const d = Math.hypot(dx, dy) || 1e-6;
        if (d >= bend) continue;
        const wa = free[j] && j !== held ? 1 : 0;
        const wb = free[j + 2] && j + 2 !== held ? 1 : 0;
        const sum = wa + wb;
        if (!sum) continue;
        const k = (d - bend) / d / sum;
        x[j] += dx * k * wa;
        y[j] += dy * k * wa;
        x[j + 2] -= dx * k * wb;
        y[j + 2] -= dy * k * wb;
      }
    }
    // Thrown about hard enough, the links between the hand and a hook can be left in a
    // tangle that nothing but more slack will undo. Rather than stay that way, the chain
    // comes off the hook on that side.
    let worst = 0;
    let where = 0;
    if (grab && !carry && (hookA || hookB)) {
      for (let j = 0; j < n; j++) {
        const off = Math.abs(Math.hypot(x[j + 1] - x[j], y[j + 1] - y[j]) - s);
        if (off > worst) {
          worst = off;
          where = j;
        }
      }
    }
    snarl = worst > SNARL * s ? snarl + 1 : 0;
    if (snarl > 12) {
      snarl = 0;
      const side = where < grab.i ? 'a' : 'b';
      if (side === 'a' ? hookA : hookB) unhook(side);
    }
  }

  function frame(now) {
    raf = 0;
    if (!running) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    acc += dt;

    // On the way in, each link lands with a little weight, one after the other.
    if (kicks) {
      while (kicks.next <= n && now >= kicks.from + Math.max(0, kicks.next - 1) * STAGGER) {
        if (kicks.next > 0 && kicks.next < n) py[kicks.next] -= KICK * D * SUB;
        kicks.next += 1;
      }
      if (kicks.next > n) kicks = null;
    }

    let steps = 0;
    while (acc >= SUB && steps < 6) {
      step();
      acc -= SUB;
      steps += 1;
    }
    if (steps === 6) acc = 0;
    render();

    let fastest = 0;
    for (let i = 0; i <= n; i++) {
      fastest = Math.max(fastest, Math.abs(x[i] - px[i]), Math.abs(y[i] - py[i]));
    }
    calm = fastest < 0.012 && !grab && !kicks ? calm + 1 : 0;

    if (isOpen && !grab) {
      // Once the loose chain has swung out of sight, put it away.
      const view = stage.getBoundingClientRect();
      const half = D / 2;
      const top = -view.top - half;
      const bottom = window.innerHeight - view.top + half;
      let seen = false;
      for (let i = 0; i <= n && !seen; i++) {
        seen = x[i] > -half && x[i] < W + half && y[i] > top && y[i] < bottom;
      }
      unseen = seen ? 0 : unseen + 1;
      if (unseen > 24 || calm > 40) {
        running = false;
        svg.classList.add('is-away');
        return;
      }
    } else if (calm > 40) {
      running = false;
      return;
    }
    raf = window.requestAnimationFrame(frame);
  }

  function wake() {
    if (running || svg.classList.contains('is-away')) return;
    running = true;
    calm = 0;
    unseen = 0;
    acc = 0;
    last = window.performance.now();
    if (!raf) raf = window.requestAnimationFrame(frame);
  }

  const say = (text) => {
    if (live) live.textContent = text;
  };

  // Take the chain off one hook. The first to go opens the way through.
  function unhook(side) {
    if (carry) {
      // Still on its way back up: it simply drops from the hook it is on.
      carry = null;
      grab = null;
      side = 'a';
    }
    if (side === 'a') hookA = false;
    else hookB = false;
    if (grab) grab.catching = CATCH;
    if (!isOpen) {
      isOpen = true;
      kicks = null;
      svg.classList.remove('is-in');
      if (unhookBtn) unhookBtn.textContent = 'Hang it back up';
      if (openEl) openEl.hidden = false;
      say('The chain is unhooked. A link to the previous site is now showing, just before this button.');
    }
    if (reduce.matches && !grab) {
      svg.classList.add('is-away');
      return;
    }
    wake();
  }

  function hang() {
    isOpen = false;
    hookA = hookB = true;
    letGo();
    if (unhookBtn) unhookBtn.textContent = 'Unhook the chain';
    if (openEl) openEl.hidden = true;
    say('The chain is back up.');
    running = false;
    svg.classList.remove('is-away');
    layout();
    build();
    pose();
    if (reduce.matches) {
      render();
      return;
    }
    // Hang it back the way a person would: the chain drops from the near hook, then the
    // loose end is lifted across the page and set on the far hook, and the chain swings
    // into place by itself.
    hookB = false;
    for (let i = 0; i <= n; i++) {
      x[i] = px[i] = ax + i * 0.02 * s;
      y[i] = py[i] = ay + i * s * 0.999;
    }
    render();
    const now = window.performance.now();
    carry = { t0: now + 60, x0: x[n], y0: y[n], cx: 0.5 * W, cy: by + 1.1 * D };
    grab = { i: n, tx: x[n], ty: y[n], vx: 0, vy: 0, catching: 0, ghost: true };
    wake();
  }

  // Where the unseen hand has the loose end, this moment, on its way to the far hook.
  const CARRY = 1400; // ms from the chain dropping to it being back on the far hook
  function lift() {
    const t = Math.min(1, Math.max(0, (window.performance.now() - carry.t0) / CARRY));
    const e = 1 - Math.pow(1 - t, 3); // quick to lift, slow to set down
    const u = 1 - e;
    grab.tx = u * u * carry.x0 + 2 * u * e * carry.cx + e * e * bx;
    grab.ty = u * u * carry.y0 + 2 * u * e * carry.cy + e * e * by;
    if (t >= 1 && Math.hypot(x[n] - bx, y[n] - by) < 0.5) {
      carry = null;
      grab = null;
      hookB = true;
      lean[2] = lean[3] = 0;
      settle = SETTLE;
    }
  }

  function enter() {
    svg.classList.remove('is-in');
    if (reduce.matches) return;
    void svg.getBoundingClientRect(); // restart the link-by-link animation
    svg.classList.add('is-in');
    kicks = { from: window.performance.now(), next: 0 };
    wake();
  }

  /* ---------- Hands on ---------- */

  const local = (e) => {
    const box = svg.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  };

  const within = (qx, qy, cx, cy, radius) => {
    const dx = qx - cx;
    const dy = qy - cy;
    const d = Math.hypot(dx, dy);
    if (d <= radius || !d) return [qx, qy];
    return [cx + (dx / d) * radius, cy + (dy / d) * radius];
  };

  // The nearest spot to (qx, qy) that the held link can reach from the hooks it is still on.
  function nearest(qx, qy, ra, rb) {
    if (!hookA && !hookB) return [qx, qy];
    if (!hookB) return within(qx, qy, ax, ay, ra);
    if (!hookA) return within(qx, qy, bx, by, rb);
    const inA = Math.hypot(qx - ax, qy - ay) <= ra;
    const inB = Math.hypot(qx - bx, qy - by) <= rb;
    if (inA && inB) return [qx, qy];
    let best = [qx, qy];
    let bestD = Infinity;
    const offer = (cx, cy) => {
      const d = Math.hypot(cx - qx, cy - qy);
      if (d < bestD) {
        best = [cx, cy];
        bestD = d;
      }
    };
    // Taut to one hook with slack to the other...
    const pa = within(qx, qy, ax, ay, ra);
    if (Math.hypot(pa[0] - bx, pa[1] - by) <= rb + 1e-6) offer(pa[0], pa[1]);
    const pb = within(qx, qy, bx, by, rb);
    if (Math.hypot(pb[0] - ax, pb[1] - ay) <= ra + 1e-6) offer(pb[0], pb[1]);
    // ...or taut to both at once, above or below the line between the hooks.
    const dx = bx - ax;
    const dy = by - ay;
    const d = Math.hypot(dx, dy) || 1e-6;
    const a = (ra * ra - rb * rb + d * d) / (2 * d);
    const h = Math.sqrt(Math.max(0, ra * ra - a * a));
    const mx = ax + (dx / d) * a;
    const my = ay + (dy / d) * a;
    offer(mx - (dy / d) * h, my + (dx / d) * h);
    offer(mx + (dy / d) * h, my - (dx / d) * h);
    return best;
  }

  // The nearest the held link can come to a hook with m links between them, in link spacings,
  // before those links are asked to fold more tightly than a chain of rings does. Two or
  // three links have no room to bow, so they stay all but straight. More of them bow into an
  // arc, and then into a loop that only closes so far.
  function fold(m) {
    if (m < 2) return m;
    if (m < 4) return 0.97 * m;
    const half = (EASY * Math.PI) / 360;
    return Math.sin(Math.min(m * half, Math.PI / 2)) / Math.sin(half);
  }

  // How far the chain between a hook and a link at (qx, qy), with m links between them, is
  // past straight (above zero) or past its tightest fold (below zero), and which way the
  // link lies from the hook.
  function past(hx, hy, m, qx, qy) {
    const dx = qx - hx;
    const dy = qy - hy;
    const d = Math.hypot(dx, dy) || 1e-6;
    const far = m * s;
    const near = fold(m) * s;
    return [d > far ? d - far : d < near ? d - near : 0, dx / d, dy / d];
  }

  function aim(p, time) {
    const i = grab.i;
    const tx = p.x + grab.ox;
    const ty = p.y + grab.oy;
    // The link can only go as far as the chain reaches from each hook it is still on.
    const ra = i * s;
    const rb = (n - i) * s;
    const [cx, cy] = nearest(tx, ty, ra, rb);
    const ex = tx - cx;
    const ey = ty - cy;
    const strain = Math.hypot(ex, ey);
    if (strain > popAt) {
      // Pulled this hard, it comes off the hook that is taking more of the pull.
      const da = Math.hypot(tx - ax, ty - ay);
      const db = Math.hypot(tx - bx, ty - by);
      unhook(!hookB || (hookA && da - ra >= db - rb) ? 'a' : 'b');
      aim(p, time);
      return;
    }
    // Past taut, the link follows the hand part of the way and each hook it is still on
    // leans after it by as much (see the physics step), so the pull shows before anything
    // lets go.
    const give = strain ? (Math.min(strain, popAt) * GIVE) / strain : 0;
    grab.tx = cx + ex * give;
    grab.ty = cy + ey * give;
    // Carried far enough into a hook that its links have nowhere left to fold, the chain
    // comes off that hook too.
    const pushA = hookA ? -past(ax, ay, i, grab.tx, grab.ty)[0] : 0;
    const pushB = hookB ? -past(bx, by, n - i, grab.tx, grab.ty)[0] : 0;
    if (Math.max(pushA, pushB) > popAt) {
      unhook(pushA > pushB ? 'a' : 'b');
      aim(p, time);
      return;
    }
    const dt = Math.max(1, time - grab.time) / 1000;
    grab.vx = 0.6 * grab.vx + (0.4 * (p.x - grab.px)) / dt;
    grab.vy = 0.6 * grab.vy + (0.4 * (p.y - grab.py)) / dt;
    grab.px = p.x;
    grab.py = p.y;
    grab.time = time;
  }

  function letGo(time) {
    if (!grab) return;
    const i = grab.i;
    if (!reduce.matches) {
      // Carry the hand's speed into the link, within reason, unless the hand had come to rest.
      const top = 9 * D;
      const speed = Math.hypot(grab.vx, grab.vy) || 1;
      const still = time ? Math.max(0, time - grab.time) : Infinity;
      const k = Math.min(1, top / speed) * Math.max(0, 1 - still / 120) * SUB;
      px[i] = x[i] - grab.vx * k;
      py[i] = y[i] - grab.vy * k;
    }
    grab = null;
    svg.classList.remove('is-held');
  }

  svg.addEventListener('pointerdown', (e) => {
    const target = e.target;
    if (carry || e.button || !target || !target.hasAttribute || !target.hasAttribute('data-i')) return;
    const i = Number(target.getAttribute('data-i'));
    const p = local(e);
    grab = { i, id: e.pointerId, ox: x[i] - p.x, oy: y[i] - p.y, tx: x[i], ty: y[i], px: p.x, py: p.y, vx: 0, vy: 0, time: e.timeStamp, catching: 0 };
    kicks = null;
    try {
      target.setPointerCapture(e.pointerId);
    } catch (err) {
      /* the drag still works while the pointer stays over the page */
    }
    svg.classList.add('is-held');
    e.preventDefault();
    wake();
  });

  svg.addEventListener('pointermove', (e) => {
    if (!grab || e.pointerId !== grab.id) return;
    aim(local(e), e.timeStamp);
    wake();
  });

  const drop = (e) => {
    if (!grab || e.pointerId !== grab.id) return;
    letGo(e.timeStamp);
    if (isOpen && reduce.matches) svg.classList.add('is-away');
    wake();
  };
  // Touch. Where the page does not scroll, any drag takes hold of the chain. Where it does,
  // only a sideways drag takes hold and an up or down swipe goes on scrolling the page.
  let touch = null;
  svg.addEventListener(
    'touchstart',
    (e) => {
      const t = e.changedTouches[0];
      touch = t ? { x: t.clientX, y: t.clientY, held: !pannable } : null;
    },
    { passive: true }
  );
  svg.addEventListener(
    'touchmove',
    (e) => {
      if (!grab || !touch) return;
      if (!touch.held) {
        const t = e.changedTouches[0];
        const dx = Math.abs(t.clientX - touch.x);
        const dy = Math.abs(t.clientY - touch.y);
        if (dx < 4 && dy < 4) return; // too soon to tell
        if (dy > dx) {
          touch = null; // a scroll: leave it to the page
          return;
        }
        touch.held = true;
      }
      if (e.cancelable) e.preventDefault();
    },
    { passive: false }
  );

  svg.addEventListener('pointerup', drop);
  svg.addEventListener('pointercancel', drop);
  svg.addEventListener('lostpointercapture', drop);

  // A cursor passing through a link gives it a push.
  let hover = null;
  window.addEventListener(
    'pointermove',
    (e) => {
      if (grab || isOpen || e.pointerType !== 'mouse' || reduce.matches || !rings.length) {
        hover = null;
        return;
      }
      const p = local(e);
      if (hover) {
        let dx = p.x - hover.x;
        let dy = p.y - hover.y;
        const moved = Math.hypot(dx, dy);
        if (moved > 0.5) {
          const cap = Math.min(moved, 0.12 * D) / moved;
          dx *= cap;
          dy *= cap;
          const band = 0.32 * r;
          let touched = false;
          for (let i = 1; i < n; i++) {
            const off = Math.abs(Math.hypot(x[i] - p.x, y[i] - p.y) - r);
            if (off < band) {
              const k = NUDGE * (1 - off / band);
              px[i] -= dx * k;
              py[i] -= dy * k;
              touched = true;
            }
          }
          if (touched) wake();
        }
      }
      hover = p;
    },
    { passive: true }
  );

  if (unhookBtn) {
    unhookBtn.hidden = false;
    unhookBtn.addEventListener('click', () => {
      if (isOpen) hang();
      else unhook('a'); // the left end comes off, and the chain swings away to the right
    });
  }

  /* ---------- Start, and keep up with the window ---------- */

  let started = false;
  let queued = 0;

  function refit() {
    if (!started) return;
    const box = stage.getBoundingClientRect();
    if (Math.abs(box.width - W) < 1 && Math.abs(box.height - H) < 1) return;
    letGo();
    carry = null;
    kicks = null;
    running = false;
    layout();
    build();
    pose();
    svg.classList.remove('is-in');
    if (isOpen) {
      svg.classList.add('is-away');
      return;
    }
    hookA = hookB = true;
    render();
  }

  function start() {
    if (started) return;
    started = true;
    layout();
    build();
    pose();
    render();
    enter();
    if ('ResizeObserver' in window) {
      new ResizeObserver(() => {
        window.cancelAnimationFrame(queued);
        queued = window.requestAnimationFrame(refit);
      }).observe(stage);
    } else {
      window.addEventListener('resize', refit);
    }
    window.addEventListener('resize', markPannable);
  }

  window.__hpReady = true;

  // Wait a beat for the typeface so the chain is fitted to the settled layout.
  const fonts = document.fonts;
  if (fonts && fonts.ready && fonts.status !== 'loaded') {
    const fallback = window.setTimeout(start, 900);
    fonts.ready.then(() => {
      window.clearTimeout(fallback);
      start();
    });
  } else {
    start();
  }
})();
