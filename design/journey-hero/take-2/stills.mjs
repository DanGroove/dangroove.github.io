// Second take, in the page: one object, held still, in the hero's own layout (?o=0..3). For stills only: see tools/sheet.mjs.
import { makeCamera, dot } from '/public/journey/hero/engine.mjs';
import { createRenderer } from './sq.mjs';
import { corners } from './kit.mjs';
import { OBJECTS } from './objects.mjs';

const q = new URLSearchParams(location.search), num = (k, d) => q.has(k) ? +q.get(k) : d;
const hero = document.querySelector('[data-hero]'), canvas = hero.querySelector('[data-art]'), stage = hero.querySelector('[data-stage-box]');
const crafts = [...hero.querySelectorAll('[data-craft]')];
const R = createRenderer(canvas), cam = makeCamera(num('yaw', 0), num('pitch', 0));

// the room all four objects need, measured once in the home view
const all = OBJECTS.map(make => make());
let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
for (const pieces of all) for (const pc of pieces) for (const c of corners(pc)) { const x = dot(cam.r, c), y = dot(cam.u, c); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
const NEED = { w: x1 - x0 + 0.8, h: y1 - y0 + 0.8, x: (x0 + x1) / 2, y: (y0 + y1) / 2 };

function draw() {
  const h = hero.getBoundingClientRect(), b = stage.getBoundingClientRect(), o = num('o', 0);
  const S = Math.min(b.width / NEED.w, b.height / NEED.h);
  const cx = b.left - h.left + b.width / 2 - S * NEED.x, cy = b.top - h.top + b.height / 2 + S * NEED.y;
  R.draw(all[o], { W: h.width, H: h.height, dpr: devicePixelRatio, S, cx, cy, cam }, { outline: 0, floor: { radius: num('pool', 4.6) } });
  hero.classList.remove('is-entering');
  crafts.forEach((c, i) => i === o ? c.setAttribute('aria-current', 'true') : c.removeAttribute('aria-current'));
  window.__need = { ...NEED, S };
}
document.fonts.ready.then(() => { draw(); window.__ready = true; });
addEventListener('resize', draw);
