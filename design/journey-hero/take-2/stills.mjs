import { sceneEnvelope } from './view.mjs';
// Second take, in the page: one scene, held still, in the hero's own layout (?s=0..5). For stills only: see tools/sheet.mjs.
// ?at=1.5 sets where the copy of the booklet that is being read has got to, in the InDesign scene (see copy in stage.mjs).
import { makeCamera, dot } from '../../../public/journey/hero/engine.mjs';
import { createRenderer } from './sq.mjs';
import { corners } from './kit.mjs';
import { makeAtlas, fontsReady } from './art.mjs';
import { SCENES, CRAFT, BLOCK, POOL, SHOW, calloutsAt } from './stage.mjs';
import { createCallouts } from './labels.mjs';
import { createPageLayout } from './page-layout.mjs';

const q = new URLSearchParams(location.search), num = (k, d) => q.has(k) ? +q.get(k) : d;
const hero = document.querySelector('[data-hero]'), canvas = hero.querySelector('[data-art]'), stage = hero.querySelector('[data-stage-box]');
const crafts = [...hero.querySelectorAll('[data-craft]')];
const R = createRenderer(canvas), cam = makeCamera(num('yaw', 0), num('pitch', 0));
const callouts = createCallouts(hero), reduced = matchMedia('(prefers-reduced-motion: reduce)');
const layout = createPageLayout(hero, stage, callouts);

// the room all the scenes need, measured once in the home view
const all = SCENES.map(make => make());
const NEED = sceneEnvelope(SCENES, corners, dot, cam);

function draw() {
  const { h, b } = layout.metrics, s = Math.min(num('s', 0), all.length - 1);
  const pieces = q.has('at') ? SCENES[s]({ at: num('at') }) : all[s];
  const W = h.width, H = h.height, view = layout.view(NEED, cam, Math.min(2, devicePixelRatio || 1, Math.sqrt(5.2e6 / (W * H))));
  layout.cover(view, NEED);
  R.draw(pieces, view, { outline: 0, floor: { ...POOL, radius: num('pool', 4.8) } });
  const time = SHOW.slice(0, s).reduce((sum, scene) => sum + scene.len, 0) + SHOW[s].still;
  callouts.draw(calloutsAt(time), pieces, view, time, reduced.matches);
  hero.classList.remove('is-entering');
  crafts.forEach((c, i) => i === CRAFT[s] ? c.setAttribute('aria-current', 'true') : c.removeAttribute('aria-current'));
  // where the flat lay is in the page, so that a tool can crop a still to it
  const at = [BLOCK.x0, BLOCK.x1].flatMap(x => [BLOCK.z0, BLOCK.z1].flatMap(z => [0, BLOCK.up].map(y => [h.left + view.cx + view.S * dot(cam.r, [x, y, z]), h.top + view.cy - view.S * dot(cam.u, [x, y, z])])));
  const lay = [Math.min(...at.map(p => p[0])), Math.min(...at.map(p => p[1])), Math.max(...at.map(p => p[0])), Math.max(...at.map(p => p[1]))].map(Math.round);
  window.__need = { ...NEED, S: view.S, box: [Math.round(b.width), Math.round(b.height)], lay };
}
await fontsReady();
R.setAtlas(makeAtlas());
await document.fonts.ready;
const measure = () => { layout.measure(); draw(); };
measure(); window.__ready = true;
addEventListener('resize', measure);
document.fonts.addEventListener('loadingdone', measure);
const name = hero.querySelector('[data-name]');
name.addEventListener('animationend', measure);
let weighing = false;
function watchName() {
  if (weighing || !name.getAnimations?.().some(a => a.playState === 'running')) return;
  weighing = true;
  const weigh = () => { measure(); if (name.getAnimations().some(a => a.playState === 'running')) requestAnimationFrame(weigh); else weighing = false; };
  requestAnimationFrame(weigh);
}
name.addEventListener('animationstart', watchName);
watchName();
