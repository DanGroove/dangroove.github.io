/*
  A faint field of dots behind the "under construction" page. Dots near the pointer lift
  and lean away from it, and a click or tap sends a ring out through them, like a ring
  dropped into the field. It never takes a click itself, and it keeps still for anyone
  who prefers reduced motion.
*/
(function () {
  'use strict';

  const root = document.documentElement;
  if (root.classList.contains('is-classic')) return;
  const page = document.getElementById('holding');
  if (!page || !window.requestAnimationFrame) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'hp-field';
  canvas.setAttribute('aria-hidden', 'true');
  page.insertBefore(canvas, page.firstChild);
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const GAP = 26; // px between dots
  const REACH = 150; // px around the pointer that the dots feel it
  const PUSH = 7; // px the nearest dots lean away
  const RING_SPEED = 620; // px per second a click ring travels
  const RING_LIFE = 1.4; // seconds a click ring lasts

  let w = 0;
  let h = 0;
  let dpr = 1;
  let dot = '#c9ced3';
  let hot = '#c0262e';
  let mx = -9999;
  let my = -9999;
  let seen = 0; // how strongly the pointer is felt, easing in and out
  let want = 0;
  const rings = [];
  let raf = 0;
  let last = 0;

  function colours() {
    const cs = getComputedStyle(root);
    dot = cs.getPropertyValue('--line').trim() || dot;
    hot = cs.getPropertyValue('--red').trim() || hot;
  }

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    colours();
    draw(0);
  }

  function draw(dt) {
    seen += (want - seen) * Math.min(1, dt * 6);
    const now = window.performance.now() / 1000;
    for (let k = rings.length - 1; k >= 0; k--) {
      if (now - rings[k].t > RING_LIFE) rings.splice(k, 1);
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const cols = Math.ceil(w / GAP) + 1;
    const rows = Math.ceil(h / GAP) + 1;
    const ox = (w - (cols - 1) * GAP) / 2;
    const oy = (h - (rows - 1) * GAP) / 2;

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let x = ox + col * GAP;
        let y = oy + row * GAP;
        let lift = 0;

        // Near the pointer, the dot swells a little and leans away.
        const dx = x - mx;
        const dy = y - my;
        const d = Math.hypot(dx, dy);
        if (seen > 0.01 && d < REACH) {
          const f = (1 - d / REACH) * seen;
          const ease = f * f * (3 - 2 * f);
          lift = Math.max(lift, ease);
          if (d > 0.5) {
            x += (dx / d) * PUSH * ease;
            y += (dy / d) * PUSH * ease;
          }
        }

        // A ring passing through lifts the dots it crosses, fading as it spreads.
        for (const ring of rings) {
          const age = now - ring.t;
          const front = age * RING_SPEED;
          const rx = x - ring.x;
          const ry = y - ring.y;
          const rd = Math.hypot(rx, ry);
          const band = Math.abs(rd - front);
          if (band < 34) {
            const f = (1 - band / 34) * (1 - age / RING_LIFE);
            lift = Math.max(lift, f);
            if (rd > 0.5) {
              x += (rx / rd) * 5 * f;
              y += (ry / rd) * 5 * f;
            }
          }
        }

        ctx.globalAlpha = 0.55 + 0.45 * lift;
        ctx.fillStyle = lift > 0.35 ? hot : dot;
        if (lift > 0.35) ctx.globalAlpha = 0.18 + 0.32 * lift;
        ctx.beginPath();
        ctx.arc(x, y, 1.1 + 1.3 * lift, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }

  function frame(t) {
    raf = 0;
    const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
    last = t;
    draw(dt);
    if (rings.length || Math.abs(want - seen) > 0.01 || want > 0) {
      if (want > 0 && !rings.length && Math.abs(want - seen) < 0.01 && t - moved > 600) {
        last = 0;
        return; // the pointer has settled: hold the last frame until it moves again
      }
      raf = window.requestAnimationFrame(frame);
    } else {
      last = 0;
    }
  }

  let moved = 0;
  function wake() {
    if (reduce.matches) return;
    moved = window.performance.now();
    if (!raf) raf = window.requestAnimationFrame(frame);
  }

  window.addEventListener(
    'pointermove',
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      want = 1;
      wake();
    },
    { passive: true }
  );
  window.addEventListener(
    'pointerdown',
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      want = e.pointerType === 'mouse' ? 1 : want;
      rings.push({ x: e.clientX, y: e.clientY, t: window.performance.now() / 1000 });
      if (rings.length > 6) rings.shift();
      wake();
    },
    { passive: true }
  );
  document.addEventListener('pointerleave', () => {
    want = 0;
    wake();
  });
  window.addEventListener('blur', () => {
    want = 0;
    wake();
  });
  window.addEventListener('resize', size);

  // The colours follow the light and dark themes, including the toggle on the page.
  new MutationObserver(() => {
    colours();
    draw(0);
  }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
    colours();
    draw(0);
  });

  size();
  // The theme fades between colours; catch up once it has.
  window.setTimeout(() => {
    colours();
    draw(0);
  }, 400);
})();
