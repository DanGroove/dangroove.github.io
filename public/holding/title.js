/*
  The headline is still being built. Near the pointer its letters thin out to their
  bare frame, turning red at the thinnest, and fill back in as the pointer moves on.
  A click or tap on the headline knocks the letters up in a wave from where it landed,
  and they drop back into place. Each letter keeps the width it has at full weight, so
  the line never shifts. Screen readers get the plain heading, and nothing moves for
  anyone who prefers reduced motion.
*/
(function () {
  'use strict';

  const root = document.documentElement;
  if (root.classList.contains('is-classic')) return;
  const title = document.querySelector('.hp-title');
  if (!title || !window.requestAnimationFrame) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  const BOLD = 800;
  const THIN = 130;
  const REACH = 1.7; // in ems of the headline: how far the pointer is felt
  const HOP = 0.16; // in ems: how high a knocked letter jumps

  // One span per letter, inside the existing word spans so the layout rules still apply.
  const plain = title.textContent.replace(/\s+/g, ' ').trim();
  const letters = [];
  title.querySelectorAll('span').forEach((word) => {
    const text = word.textContent;
    word.textContent = '';
    word.setAttribute('aria-hidden', 'true');
    for (const ch of text) {
      const el = document.createElement('span');
      el.className = 'hp-ch';
      el.textContent = ch;
      word.appendChild(el);
      letters.push({ el, cx: 0, cy: 0, thin: 0, y: 0, vy: 0, kick: 0 });
    }
  });
  const sr = document.createElement('span');
  sr.className = 'hp-sr';
  sr.textContent = plain;
  title.appendChild(sr);

  // Lock each letter to its full-weight width, in ems so it follows the headline's size.
  function lock() {
    const fs = parseFloat(getComputedStyle(title).fontSize) || 16;
    for (const l of letters) {
      l.el.style.width = '';
      l.el.style.fontVariationSettings = '';
      l.el.style.width = l.el.getBoundingClientRect().width / fs + 'em';
    }
    place();
  }

  let em = 16;
  function place() {
    em = parseFloat(getComputedStyle(title).fontSize) || 16;
    for (const l of letters) {
      const r = l.el.getBoundingClientRect();
      l.cx = r.left + r.width / 2;
      l.cy = r.top + r.height / 2 - l.y * em;
    }
  }

  let mx = -1e5;
  let my = -1e5;
  let raf = 0;
  let last = 0;

  function frame(t) {
    raf = 0;
    const dt = last ? Math.min((t - last) / 1000, 0.05) : 1 / 60;
    last = t;
    const now = window.performance.now();
    let busy = false;
    for (const l of letters) {
      // Thin out near the pointer, with a soft edge.
      const d = Math.hypot(mx - l.cx, (my - l.cy) * 1.3) / (REACH * em);
      const f = d < 1 ? 1 - d : 0;
      const want = f * f * (3 - 2 * f);
      l.thin += (want - l.thin) * Math.min(1, dt * 11);

      // A knock waits for the wave to reach the letter, then the letter springs.
      if (l.kick && now >= l.kick) {
        l.vy += HOP * 26;
        l.kick = 0;
      }
      l.vy += (-l.y * 240 - l.vy * 12) * dt;
      l.y += l.vy * dt;

      const thin = Math.max(l.thin, Math.min(1, l.y / HOP) * 0.7);
      const wght = Math.round(BOLD - (BOLD - THIN) * thin);
      l.el.style.fontVariationSettings = `"wght" ${wght}`;
      l.el.style.transform = l.y > 0.001 ? `translateY(${(-l.y).toFixed(3)}em)` : '';
      l.el.style.color = thin > 0.55 ? 'var(--red-ink)' : '';
      if (Math.abs(want - l.thin) > 0.004 || Math.abs(l.y) > 0.0005 || Math.abs(l.vy) > 0.005 || l.kick) busy = true;
    }
    if (busy) raf = window.requestAnimationFrame(frame);
    else last = 0;
  }

  function wake() {
    if (reduce.matches) return;
    if (!raf) raf = window.requestAnimationFrame(frame);
  }

  window.addEventListener(
    'pointermove',
    (e) => {
      mx = e.clientX;
      my = e.clientY;
      wake();
    },
    { passive: true }
  );
  document.addEventListener('pointerleave', () => {
    mx = my = -1e5;
    wake();
  });
  window.addEventListener('blur', () => {
    mx = my = -1e5;
    wake();
  });

  title.addEventListener('pointerdown', (e) => {
    if (reduce.matches) return;
    place();
    const now = window.performance.now();
    for (const l of letters) {
      const far = Math.abs(e.clientX - l.cx) / em;
      l.kick = now + far * 55;
    }
    // A tap on a touch screen has no pointer left behind to thin the letters.
    if (e.pointerType !== 'mouse') mx = my = -1e5;
    wake();
  });

  window.addEventListener('resize', place);
  window.addEventListener('scroll', place, { passive: true });
  lock();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(lock);
  // The headline font size depends on the column, which settles after the first layout.
  window.setTimeout(lock, 300);
  window.addEventListener('resize', () => {
    window.clearTimeout(lock.t);
    lock.t = window.setTimeout(lock, 150);
  });
})();
