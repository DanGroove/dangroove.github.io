// The second take in the built hero's layout. One clock also supports held review frames.
import { makeCamera, dot } from '../../../public/journey/hero/engine.mjs';
import { createRenderer } from './sq.mjs';
import { corners } from './kit.mjs';
import { makeAtlas, fontsReady } from './art.mjs';
import { SHOW, LOOP, SCENES, BLOCK, POOL, sceneAt, frameAt, calloutsAt } from './stage.mjs';
import { createCallouts } from './labels.mjs';

const query = new URLSearchParams(location.search);
const num = (key, fallback) => query.has(key) && Number.isFinite(+query.get(key)) ? +query.get(key) : fallback;
const hero = document.querySelector('[data-hero]');
const canvas = hero.querySelector('[data-art]'), stage = hero.querySelector('[data-stage-box]');
const crafts = [...hero.querySelectorAll('[data-craft]')], pause = hero.querySelector('[data-pause]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const renderer = createRenderer(canvas), cam = makeCamera(num('yaw', 0), num('pitch', 0));
const callouts = createCallouts(hero);
const starts = SHOW.map((_, i) => SHOW.slice(0, i).reduce((sum, scene) => sum + scene.len, 0));
const stills = [2, 3, 4, 5];

// Fit from exactly the same six stills and padding as stills.mjs, once per camera.
let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
for (const make of SCENES) for (const pc of make()) for (const c of corners(pc)) {
  const x = dot(cam.r, c), y = dot(cam.u, c);
  x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y);
}
const need = { w: x1 - x0 + 0.5, h: y1 - y0 + 0.5, x: (x0 + x1) / 2, y: (y0 + y1) / 2 };
const wrap = t => ((t % LOOP) + LOOP) % LOOP;
let t = query.has('t') ? wrap(num('t', 0)) : reduced.matches ? starts[2] + SHOW[2].still : 0;
let stopped = query.has('t'), visible = true, ready = false, request = 0, previous = null, lastView;

function draw() {
  const h = hero.getBoundingClientRect(), b = stage.getBoundingClientRect();
  if (!b.width || !b.height || !h.width || !h.height) return;
  const S = Math.min(b.width / need.w, b.height / need.h);
  const cx = b.left - h.left + b.width / 2 - S * need.x, cy = b.top - h.top + b.height / 2 + S * need.y;
  const W = h.width, H = h.height, dpr = Math.min(2, devicePixelRatio || 1, Math.sqrt(5.2e6 / (W * H)));
  const view = callouts.fit({ W, H, dpr, S, cx, cy, cam }, need, b.left - h.left), pieces = frameAt(t);
  lastView = view;
  renderer.draw(pieces, view, { outline: 0, floor: { ...POOL, radius: num('pool', 4.8) } });
  callouts.draw(calloutsAt(t), pieces, view, t, reduced.matches);
  hero.classList.remove('is-entering');
  const { scene } = sceneAt(t);
  crafts.forEach((c, i) => i === scene.craft ? c.setAttribute('aria-current', 'true') : c.removeAttribute('aria-current'));
  pause.textContent = stopped || reduced.matches ? 'Play' : 'Pause';
  const at = [BLOCK.x0, BLOCK.x1].flatMap(x => [BLOCK.z0, BLOCK.z1].flatMap(z => [0, BLOCK.up].map(y => [h.left + view.cx + view.S * dot(cam.r, [x, y, z]), h.top + view.cy - view.S * dot(cam.u, [x, y, z])])));
  const lay = [Math.min(...at.map(p => p[0])), Math.min(...at.map(p => p[1])), Math.max(...at.map(p => p[0])), Math.max(...at.map(p => p[1]))].map(Math.round);
  window.__need = { ...need, S: view.S, box: [Math.round(b.width), Math.round(b.height)], lay };
}

function running() { return ready && !stopped && !reduced.matches && visible && !document.hidden; }
function tick(now) {
  request = 0;
  if (!running()) { previous = null; return; }
  if (previous !== null) t = wrap(t + Math.min(0.1, (now - previous) / 1000));
  previous = now;
  draw(); request = requestAnimationFrame(tick);
}
function schedule() {
  previous = null;
  if (request) cancelAnimationFrame(request);
  request = running() ? requestAnimationFrame(tick) : 0;
}
function seek(time) {
  if (!Number.isFinite(time)) throw new TypeError('time must be finite');
  stopped = true; t = wrap(time); schedule();
  if (ready) draw();
}
window.__hero = { seek, get t() { return t; }, get callouts() { return callouts.layout; }, get view() { return lastView; }, get pieces() { return frameAt(t); }, LOOP, SHOW };

function choose(craft) {
  const i = reduced.matches || stopped ? stills[craft] : SHOW.findIndex(s => s.craft === craft);
  t = starts[i] + (reduced.matches || stopped ? SHOW[i].still : 0);
  previous = null; draw();
}
crafts.forEach((button, i) => button.addEventListener('click', () => choose(i)));
stage.addEventListener('click', () => choose((sceneAt(t).scene.craft + 1) % 4));
pause.addEventListener('click', () => {
  if (reduced.matches) return;
  stopped = !stopped; draw(); schedule();
});
reduced.addEventListener('change', () => {
  if (reduced.matches) choose(sceneAt(t).scene.craft);
  draw(); schedule();
});
document.addEventListener('visibilitychange', schedule);
new IntersectionObserver(entries => {
  visible = entries[0].isIntersecting;
  schedule();
}, { threshold: 0 }).observe(hero);
new ResizeObserver(() => { if (ready && visible && !document.hidden) draw(); }).observe(hero);

await fontsReady();
renderer.setAtlas(makeAtlas());
await document.fonts.ready;
ready = true; draw(); window.__ready = true; schedule();
