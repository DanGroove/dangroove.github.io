// Second take, in the page: one scene, held still, in the hero's own layout (?s=0..5). For stills only: see tools/sheet.mjs.
// ?at=1.5 sets where the copy of the booklet that is being read has got to, in the InDesign scene (see copy in stage.mjs).
import { makeCamera, dot } from '../../../public/journey/hero/engine.mjs';
import { createRenderer } from './sq.mjs';
import { corners } from './kit.mjs';
import { makeAtlas, fontsReady } from './art.mjs';
import { SCENES, CRAFT, BLOCK, POOL } from './stage.mjs';

const q = new URLSearchParams(location.search), num = (k, d) => q.has(k) ? +q.get(k) : d;
const hero = document.querySelector('[data-hero]'), canvas = hero.querySelector('[data-art]'), stage = hero.querySelector('[data-stage-box]');
const crafts = [...hero.querySelectorAll('[data-craft]')];
const R = createRenderer(canvas), cam = makeCamera(num('yaw', 0), num('pitch', 0));

// the room all the scenes need, measured once in the home view
const all = SCENES.map(make => make());
let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
for (const pieces of all) for (const pc of pieces) for (const c of corners(pc)) { const x = dot(cam.r, c), y = dot(cam.u, c); x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
const NEED = { w: x1 - x0 + 0.5, h: y1 - y0 + 0.5, x: (x0 + x1) / 2, y: (y0 + y1) / 2 };

function draw() {
  const h = hero.getBoundingClientRect(), b = stage.getBoundingClientRect(), s = Math.min(num('s', 0), all.length - 1);
  const pieces = q.has('at') ? SCENES[s]({ at: num('at') }) : all[s];
  const S = Math.min(b.width / NEED.w, b.height / NEED.h);
  const cx = b.left - h.left + b.width / 2 - S * NEED.x, cy = b.top - h.top + b.height / 2 + S * NEED.y;
  R.draw(pieces, { W: h.width, H: h.height, dpr: Math.min(2, devicePixelRatio || 1), S, cx, cy, cam }, { outline: 0, floor: { ...POOL, radius: num('pool', 4.8) } });
  hero.classList.remove('is-entering');
  crafts.forEach((c, i) => i === CRAFT[s] ? c.setAttribute('aria-current', 'true') : c.removeAttribute('aria-current'));
  // where the flat lay is in the page, so that a tool can crop a still to it
  const at = [BLOCK.x0, BLOCK.x1].flatMap(x => [BLOCK.z0, BLOCK.z1].flatMap(z => [0, BLOCK.up].map(y => [h.left + cx + S * dot(cam.r, [x, y, z]), h.top + cy - S * dot(cam.u, [x, y, z])])));
  const lay = [Math.min(...at.map(p => p[0])), Math.min(...at.map(p => p[1])), Math.max(...at.map(p => p[0])), Math.max(...at.map(p => p[1]))].map(Math.round);
  window.__need = { ...NEED, S, box: [Math.round(b.width), Math.round(b.height)], lay };
}
await fontsReady();
R.setAtlas(makeAtlas());
await document.fonts.ready;
draw(); window.__ready = true;
addEventListener('resize', draw);
