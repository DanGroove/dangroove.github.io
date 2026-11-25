// Round 8, N1: the name reacts the way the live page's headline does (public/holding/title.js), with the same numbers.
// Pure model first (checked in Node), then the page view. The flow text in each .name-line is never split or moved, so the
// name's layout, ink and alignment are exactly as before. Each line carries an overlay, made of letters drawn by CSS
// generated content at their measured pen positions (so no new text nodes or layout boxes reach the page's ink
// measurement), and a red copy of the same letters cut to a circle around the pointer. Per frame only transform and
// clip-path are written; geometry is read on measure (resize, scroll, fonts ready).

export const NAME = {
  radius: 0.95, // ems: the circle's radius
  near: 1.2,    // ems outside the name's box where the circle starts to open
  hop: 0.16,    // ems a knocked letter jumps
  rise: 0.07,   // ems a letter lifts with the pointer close
  feel: 1.3,    // ems from a letter that the pointer is felt
  wave: 55,     // ms per em of horizontal distance for a knock's wave
  open: 9,      // per second: how fast the circle follows its target
  spring: 240, damp: 12, kick: 26,
  red: '#F0484F',
};

const smooth = f => f * f * (3 - 2 * f);
// How open the circle wants to be for a pointer at (x, y) and the name's box (viewport px), 0 to 1.
export function openTarget(x, y, box, em) {
  const dx = Math.max(box.left - x, 0, x - box.right), dy = Math.max(box.top - y, 0, y - box.bottom);
  return smooth(Math.max(0, 1 - Math.hypot(dx, dy) / (NAME.near * em)));
}
export const stepOpen = (open, want, dt) => open + (want - open) * Math.min(1, dt * NAME.open);
export const circleRadius = (open, em) => NAME.radius * em * open;
// A letter's rest height (ems, up) for a pointer offset from the letter's centre (px).
export function restHeight(dx, dy, em) {
  const d = Math.hypot(dx, dy * 1.4) / (NAME.feel * em), g = d < 1 ? 1 - d : 0;
  return NAME.rise * smooth(g);
}
// A knock's start time for each letter: the wave leaves where the pointer landed.
export const knockDelays = (x, centres, em) => centres.map(cx => (Math.abs(x - cx) / em) * NAME.wave);
// One spring step for a letter, exactly as title.js: { y, vy, kick } (ems, ems/s, ms time or 0).
export function stepLetter(l, rest, dt, now) {
  if (l.kick && now >= l.kick) { l.vy += NAME.hop * NAME.kick; l.kick = 0; }
  l.vy += (-(l.y - rest) * NAME.spring - l.vy * NAME.damp) * dt;
  l.y += l.vy * dt;
  return l;
}
// The name reacts only once the entrance has ended (never while one plays or is held), and never with reduced motion.
export const nameLive = ({ ready, entering, reduced }) => !!ready && entering === null && !reduced;

// ---- the page
export function createNameReact(hero, { reduced, win = hero.ownerDocument.defaultView, raf = f => win.requestAnimationFrame(f), cancel = id => win.cancelAnimationFrame(id), clock = () => win.performance.now() } = {}) {
  const doc = hero.ownerDocument, name = hero.querySelector('[data-name]');
  let lines = [], letters = [], live = false, em = 16, box = null, mx = -1e5, my = -1e5, open = 0, request = 0, last = 0;

  function build() {
    lines = [...name.querySelectorAll('.name-line')].map(line => {
      line.querySelector('.name-fx')?.remove();
      const text = line.firstChild && line.firstChild.nodeType === 3 ? line.firstChild : null;
      const fx = doc.createElement('span'); fx.className = 'name-fx'; fx.setAttribute('aria-hidden', 'true');
      const red = doc.createElement('span'); red.className = 'name-red';
      const own = [];
      for (const ch of text ? text.data : '') {
        const plain = doc.createElement('span'), copy = doc.createElement('span');
        plain.className = copy.className = 'name-ch';
        plain.dataset.ch = copy.dataset.ch = ch;
        fx.append(plain); red.append(copy);
        own.push({ els: [plain, copy], ch, x: 0, cx: 0, cy: 0, y: 0, vy: 0, kick: 0 });
      }
      fx.append(red); line.append(fx);
      letters.push(...own);
      return { line, text, fx, red, own, left: 0, top: 0 };
    });
  }

  // Layout reads happen only here.
  function measure() {
    if (!live) return;
    em = parseFloat(win.getComputedStyle(name).fontSize) || 16;
    box = name.getBoundingClientRect();
    const range = doc.createRange();
    for (const l of lines) {
      const b = l.line.getBoundingClientRect();
      l.left = b.left; l.top = b.top;
      l.own.forEach((letter, i) => {
        if (!l.text) return;
        range.setStart(l.text, i); range.setEnd(l.text, i + 1);
        const r = range.getBoundingClientRect();
        letter.x = r.left - b.left;
        letter.cx = r.left + r.width / 2; letter.cy = r.top + r.height / 2;
        for (const el of letter.els) el.style.left = letter.x.toFixed(3) + 'px';
      });
    }
    wake();
  }

  function frame(t) {
    request = 0;
    if (!live) return;
    const dt = last ? Math.min((t - last) / 1000, 0.05) : 1 / 60;
    last = t;
    const now = clock();
    let busy = false;
    const want = openTarget(mx, my, box, em);
    open = stepOpen(open, want, dt);
    if (Math.abs(want - open) > 0.003) busy = true;
    const r = circleRadius(open, em);
    for (const l of lines) l.red.style.clipPath = r < 0.5 ? 'circle(0px at 0px 0px)' : `circle(${r.toFixed(1)}px at ${(mx - l.left).toFixed(1)}px ${(my - l.top).toFixed(1)}px)`;
    for (const l of letters) {
      const rest = restHeight(mx - l.cx, my - l.cy, em);
      stepLetter(l, rest, dt, now);
      const tf = Math.abs(l.y) > 0.001 ? `translateY(${(-l.y).toFixed(3)}em)` : '';
      for (const el of l.els) el.style.transform = tf;
      if (Math.abs(l.y - rest) > 0.0005 || Math.abs(l.vy) > 0.005 || l.kick) busy = true;
    }
    if (busy) request = raf(frame);
    else last = 0;
  }
  function wake() { if (live && box && !request) request = raf(frame); }

  function rest() {
    if (request) cancel(request);
    request = 0; last = 0; open = 0;
    for (const l of letters) { l.y = l.vy = l.kick = 0; for (const el of l.els) el.style.transform = ''; }
    for (const l of lines) l.red.style.clipPath = '';
  }
  function setLive(on) {
    on = !!on && !reduced.matches;
    if (on === live) { if (on) measure(); return live; }
    live = on;
    for (const l of lines) l.line.classList.toggle('is-live', on);
    if (on) measure(); else rest();
    return live;
  }

  win.addEventListener('pointermove', e => {
    if (e.pointerType !== 'mouse') return; // a finger leaves no pointer behind to follow
    mx = e.clientX; my = e.clientY; wake();
  }, { passive: true });
  const away = () => { mx = my = -1e5; wake(); };
  doc.addEventListener('pointerleave', away);
  win.addEventListener('blur', away);
  name.addEventListener('pointerdown', e => {
    if (!live) return;
    measure();
    const delays = knockDelays(e.clientX, letters.map(l => l.cx), em), now = clock();
    letters.forEach((l, i) => { l.kick = now + delays[i]; });
    wake();
  });
  win.addEventListener('scroll', measure, { passive: true });

  build();
  return { measure, setLive, get live() { return live; }, get letters() { return letters; }, get open() { return open; } };
}
