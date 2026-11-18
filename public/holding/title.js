/*
  The headline has a red copy of itself underneath. Near the pointer, a circle around the
  cursor shows the red letters in place of the plain ones, opening as the pointer comes
  close and closing as it leaves, and the letters nearest the pointer lift a little. A click or tap on the headline knocks the letters up in
  a wave from where it landed, and they drop back into place. Screen readers get the plain
  heading, and nothing moves for anyone who prefers reduced motion.
*/
(function () {
  'use strict';

  const root = document.documentElement;
  if (root.classList.contains('is-classic')) return;
  const title = document.querySelector('.hp-title');
  if (!title || !window.requestAnimationFrame) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  const RADIUS = 0.95; // in ems of the headline: size of the circle
  const NEAR = 1.2; // in ems: how far outside the headline the circle starts to open
  const HOP = 0.16; // in ems: how high a knocked letter jumps
  const RISE = 0.07; // in ems: how far a letter lifts when the pointer is close
  const FEEL = 1.3; // in ems: how far from a letter the pointer is felt

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
      letters.push({ els: [el], cx: 0, cy: 0, y: 0, vy: 0, kick: 0 });
    }
  });

  // The red copy sits exactly over the headline, cut to a circle around the pointer.
  const red = document.createElement('span');
  red.className = 'hp-title__red';
  red.setAttribute('aria-hidden', 'true');
  let k = 0;
  [...title.childNodes].forEach((node) => {
    const copy = node.cloneNode(true);
    red.appendChild(copy);
    if (copy.querySelectorAll) copy.querySelectorAll('.hp-ch').forEach((el) => letters[k++].els.push(el));
  });
  title.appendChild(red);
  const sr = document.createElement('span');
  sr.className = 'hp-sr';
  sr.textContent = plain;
  title.appendChild(sr);

  let em = 16;
  let box = null;
  function place() {
    em = parseFloat(getComputedStyle(title).fontSize) || 16;
    box = title.getBoundingClientRect();
    for (const l of letters) {
      const r = l.els[0].getBoundingClientRect();
      l.cx = r.left + r.width / 2;
      l.cy = r.top + r.height / 2 + l.y * em;
    }
  }

  let mx = -1e5;
  let my = -1e5;
  let open = 0; // how far the circle is open, 0 to 1
  let raf = 0;
  let last = 0;

  function frame(t) {
    raf = 0;
    const dt = last ? Math.min((t - last) / 1000, 0.05) : 1 / 60;
    last = t;
    const now = window.performance.now();
    let busy = false;

    // The circle opens as the pointer nears the headline's box.
    const dx = Math.max(box.left - mx, 0, mx - box.right);
    const dy = Math.max(box.top - my, 0, my - box.bottom);
    const f = Math.max(0, 1 - Math.hypot(dx, dy) / (NEAR * em));
    const want = f * f * (3 - 2 * f);
    open += (want - open) * Math.min(1, dt * 9);
    if (Math.abs(want - open) > 0.003) busy = true;
    const r = RADIUS * em * open;
    red.style.clipPath =
      r < 0.5 ? 'circle(0px at 0px 0px)' : `circle(${r.toFixed(1)}px at ${(mx - box.left).toFixed(1)}px ${(my - box.top).toFixed(1)}px)`;

    for (const l of letters) {
      // A knock waits for the wave to reach the letter, then the letter springs.
      if (l.kick && now >= l.kick) {
        l.vy += HOP * 26;
        l.kick = 0;
      }
      // Near the pointer, a letter rests a little higher, and springs there.
      const d = Math.hypot(mx - l.cx, (my - l.cy) * 1.4) / (FEEL * em);
      const g = d < 1 ? 1 - d : 0;
      const rest = RISE * g * g * (3 - 2 * g);
      l.vy += (-(l.y - rest) * 240 - l.vy * 12) * dt;
      l.y += l.vy * dt;
      const tf = Math.abs(l.y) > 0.001 ? `translateY(${(-l.y).toFixed(3)}em)` : '';
      for (const el of l.els) el.style.transform = tf;
      if (Math.abs(l.y - rest) > 0.0005 || Math.abs(l.vy) > 0.005 || l.kick) busy = true;
    }
    if (busy) raf = window.requestAnimationFrame(frame);
    else last = 0;
  }

  function wake() {
    if (reduce.matches) return;
    if (!box) place();
    if (!raf) raf = window.requestAnimationFrame(frame);
  }

  function away() {
    mx = my = -1e5;
    wake();
  }

  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return; // a finger leaves no pointer behind to follow
      mx = e.clientX;
      my = e.clientY;
      wake();
    },
    { passive: true }
  );
  document.addEventListener('pointerleave', away);
  window.addEventListener('blur', away);

  title.addEventListener('pointerdown', (e) => {
    if (reduce.matches) return;
    place();
    const now = window.performance.now();
    for (const l of letters) l.kick = now + (Math.abs(e.clientX - l.cx) / em) * 55;
    wake();
  });

  window.addEventListener('resize', place);
  window.addEventListener('scroll', place, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
  window.setTimeout(place, 300);
})();
