import { sceneEnvelope } from './view.mjs';
// The second take in the built hero's layout. One clock also supports held review frames.
import { makeCamera, dot } from '../../../public/journey/hero/engine.mjs';
import { createRenderer } from './sq.mjs';
import { corners } from './kit.mjs';
import { makeAtlas, fontsReady } from './art.mjs';
import { SHOW, LOOP, SCENES, BLOCK, POOL, sceneAt, frameAt, calloutsAt, buildingLastState } from './stage.mjs';
import { createCallouts } from './labels.mjs';
import { createPageLayout } from './page-layout.mjs';
import { ENTRANCE, entranceAt, screenPlane, floorReach, createEntranceView, loaderAt, createLoaderView } from './entrance.mjs';
import { createNameReact } from './name-react.mjs';
import { createStars, starReach } from './stars.mjs';
import { createCraftWipe } from './craft-wipe.mjs';

const query = new URLSearchParams(location.search);
const num = (key, fallback) => query.has(key) && Number.isFinite(+query.get(key)) ? +query.get(key) : fallback;
const hero = document.querySelector('[data-hero]');
const canvas = hero.querySelector('[data-art]'), stage = hero.querySelector('[data-stage-box]');
const crafts = [...hero.querySelectorAll('[data-craft]')], pause = hero.querySelector('[data-pause]');
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const renderer = createRenderer(canvas), cam = makeCamera(num('yaw', 0), num('pitch', 0));
const callouts = createCallouts(hero);
const layout = createPageLayout(hero, stage, callouts);
const starts = SHOW.map((_, i) => SHOW.slice(0, i).reduce((sum, scene) => sum + scene.len, 0));
const stills = [2, 3, 4, 5];

const need = sceneEnvelope(SCENES, corners, dot, cam);
const wrap = t => ((t % LOOP) + LOOP) % LOOP;
let t = query.has('t') ? wrap(num('t', 0)) : reduced.matches ? starts[2] + SHOW[2].still : 0;
let stopped = query.has('t'), visible = true, ready = false, request = 0, previous = null, lastView;
// Round 6: the entrance plays once per load. intro is its clock while it shows; held is a review hold (__hero.entrance).
// first keeps Photoshop's own shell on the first pass, until the loop first wraps or is moved.
let intro = null, held = false, first = false;
const entrance = createEntranceView(hero);
const loader = createLoaderView(hero), boot = {};
let loading = !query.has('t');
let loaderStart = null;
if (!loading) loader.clear();
function loaderState(now) {
  if (loader.state) return loader.state(now);
  // Boot may block the main thread before its first paint. Start the visible clock on rAF, so that work cannot
  // consume the loader's minimum duration unseen. Milestones already complete then belong to time zero.
  const time = loaderStart === null ? 0 : Math.max(0, now - loaderStart);
  const progress = Object.fromEntries(Object.entries(boot).map(([key, at]) => [key, loaderStart === null ? 0 : Math.max(0, at - loaderStart)]));
  return loaderAt(time, progress, { reduced: reduced.matches });
}
function bootDone(key) {
  const now = performance.now() / 1000;
  boot[key] = now;
  loader.boot?.(key);
  if (loading) loader.apply(loaderState(now));
}
const frameNow = () => frameAt(t, first && t < 0.5 ? { first: true } : {});
// Round 8: the name reacts once the entrance has ended (N1); the star field (B1, B2) is drawn first in every frame and takes
// the pointer once the loader burst lands (entrance zero). Neither stops with Pause, and neither moves the loop.
const nameReact = createNameReact(hero, { reduced });
// Round 14 (K1, replacing round 12's selection box): the craft list's letters roll from the old row to the new on its own
// clock; the entrance sets it, so the current row appears lit as its row cuts in.
const craftWipe = createCraftWipe(hero, { reduced });
const nameOn = () => nameReact.setLive(ready && !loading && !intro && !held && !reduced.matches);
const stars = query.get('stars') === '0' ? null : createStars(hero, { reduced, draw, running, available: () => ready && !loading && visible && !document.hidden, open: () => !loading && (!intro || intro.time >= ENTRANCE.starPointer - 1e-12) });

function draw() {
  const { h, b } = layout.metrics;
  if (!b.width || !b.height || !h.width || !h.height) return;
  const W = h.width, H = h.height, dpr = Math.min(2, devicePixelRatio || 1, Math.sqrt(5.2e6 / (W * H)));
  const view = layout.view(need, cam, dpr), pieces = frameNow();
  layout.cover(view, need);
  lastView = view;
  const floor = { ...POOL, radius: num('pool', 4.8) }, state = (intro || (loading && !reduced.matches)) && entranceAt(intro?.time ?? 0, { ledeLines: entrance.lines });
  // F3 (round 8): the floor has no hover. The screen and its shadow share one rising clip plane.
  if (state) floor.reveal = floorReach(state.floor, floor.radius);
  const centre = [b.left - h.left + b.width / 2, b.top - h.top + b.height / 2];
  const field = stars?.frame(state ? starReach(state.stars, centre, W, H) : null, centre);
  renderer.draw(pieces, view, { outline: 0, floor, reveal: state ? screenPlane(state.screen) : null, stars: loading ? null : field });
  callouts.draw(calloutsAt(t), pieces, view, t, reduced.matches);
  if (state) entrance.apply(state);
  hero.classList.remove('is-entering');
  const { scene } = sceneAt(t);
  crafts.forEach((c, i) => i === scene.craft ? c.setAttribute('aria-current', 'true') : c.removeAttribute('aria-current'));
  craftWipe.follow(scene.craft, { cut: !!intro });
  pause.textContent = stopped || reduced.matches ? 'Play' : 'Pause';
  const at = [BLOCK.x0, BLOCK.x1].flatMap(x => [BLOCK.z0, BLOCK.z1].flatMap(z => [0, BLOCK.up].map(y => [h.left + view.cx + view.S * dot(cam.r, [x, y, z]), h.top + view.cy - view.S * dot(cam.u, [x, y, z])])));
  const lay = [Math.min(...at.map(p => p[0])), Math.min(...at.map(p => p[1])), Math.max(...at.map(p => p[0])), Math.max(...at.map(p => p[1]))].map(Math.round);
  window.__need = { ...need, S: view.S, box: [Math.round(b.width), Math.round(b.height)], lay };
  stars?.after();
  if (loading && boot.frame === undefined) bootDone('frame');
}

function running() { return visible && !document.hidden && (loading || (ready && !stopped && !held && !reduced.matches)); }
function tick(now) {
  request = 0;
  if (!running()) { previous = null; return; }
  if (loading) {
    if (loaderStart === null) loaderStart = now / 1000;
    const state = loaderState(now / 1000);
    loader.apply(state);
    if (!reduced.matches && state.entranceTime !== null) {
      if (!intro) { first = true; startEntrance(state.entranceTime); }
      else intro.time = state.entranceTime;
      t = Math.max(0, intro.time - ENTRANCE.screen[1]);
    }
    if (state.done) {
      loading = false;
      // Draw the field's homes before removing its canvas copy, in this same main-thread frame.
      nameOn(); draw(); loader.clear(); previous = now;
    } else if (intro) draw();
    if (running()) request = requestAnimationFrame(tick);
    return;
  }
  if (previous !== null) {
    const step = Math.min(0.1, (now - previous) / 1000);
    if (intro) {
      const next = intro.time + step;
      // Repeated frame steps can land a few ulps below the endpoint; do not add a frame to the entrance.
      intro.time = next >= ENTRANCE.end - 1e-12 ? ENTRANCE.end : next;
      t = Math.max(0, intro.time - ENTRANCE.screen[1]);
    }
    else { const next = wrap(t + step); if (next < t) first = false; t = next; }
  }
  previous = now;
  if (intro && intro.time >= ENTRANCE.end) endEntrance();
  draw(); request = requestAnimationFrame(tick);
}
function startEntrance(time) {
  intro = { time };
  entrance.clear(); entrance.measure(layout.metrics?.nameLines); nameOn();
}
// Ends the entrance at once, everything shown; the caller then does what it was asked to.
function endEntrance() {
  if (!intro && !held && !(loading && ready)) return;
  if (loading && ready) { loading = false; loader.clear(); }
  intro = null; held = false; entrance.clear(); nameOn();
}
function hold(time) {
  if (time === null) { endEntrance(); if (ready) { draw(); schedule(); } return; }
  if (!Number.isFinite(time)) throw new TypeError('time must be finite or null');
  if (!ready || reduced.matches) return;
  if (loading) { loading = false; loader.clear(); }
  const at = Math.min(ENTRANCE.end, Math.max(0, time));
  held = true; first = true; startEntrance(at);
  t = Math.max(0, at - ENTRANCE.screen[1]);
  schedule(); draw();
}
function schedule() {
  previous = null;
  if (request) cancelAnimationFrame(request);
  request = running() ? requestAnimationFrame(tick) : 0;
}
function seek(time) {
  if (!Number.isFinite(time)) throw new TypeError('time must be finite');
  endEntrance(); first = false;
  stopped = true; t = wrap(time); schedule();
  if (ready) draw();
}
if (renderer.buildings) renderer.buildings.lastState = id => renderer.buildings.readPlan(buildingLastState(id));
window.__hero = { buildings: renderer.buildings, seek, measure, entrance: hold, get loading() { return loading; }, get entering() { return intro ? intro.time : null; }, get t() { return t; }, get callouts() { return callouts.layout; }, get view() { return lastView; }, get pieces() { return frameNow(); }, get layout() { return layout.metrics; }, crafts: p => craftWipe.hold(p), get craftWipe() { return craftWipe.state; }, get name() { return { live: nameReact.live, open: nameReact.open, lift: nameReact.letters.map(l => l.y) }; }, get stars() { return stars && { holding: stars.holding, radius: stars.radius, fraction: stars.fraction, awake: stars.field?.awake ?? false, count: stars.field?.stars.length ?? 0, offsets: stars.field && Array.from(stars.field.offsets), flags: stars.field && Array.from(stars.field.flags), weights: stars.field && Array.from(stars.field.weights), alpha: stars.field && Array.from(stars.field.alpha), mixes: stars.field && Array.from(stars.field.mixes), mark: stars.mark }; }, LOOP, SHOW };

function choose(craft) {
  endEntrance(); first = false;
  const i = reduced.matches || stopped ? stills[craft] : SHOW.findIndex(s => s.craft === craft);
  t = starts[i] + (reduced.matches || stopped ? SHOW[i].still : 0);
  previous = null; draw();
}
crafts.forEach((button, i) => button.addEventListener('click', () => choose(i)));
// B2: a hold on the stage gathers stars; only a short, still press is a click that changes the craft.
stage.addEventListener('click', () => { if (stars?.swallowClick()) return; choose((sceneAt(t).scene.craft + 1) % 4); });
pause.addEventListener('click', () => {
  if (reduced.matches) return;
  endEntrance();
  stopped = !stopped; draw(); schedule();
});
reduced.addEventListener('change', () => {
  if (loading) {
    loader.motion?.(reduced.matches);
    if (reduced.matches) intro = null;
    first = !reduced.matches;
    t = reduced.matches ? starts[2] + SHOW[2].still : 0;
    entrance.clear();
    nameOn(); if (ready) draw(); schedule(); return;
  }
  endEntrance(); nameOn();
  if (reduced.matches) choose(sceneAt(t).scene.craft);
  draw(); schedule();
});
document.addEventListener('visibilitychange', schedule);
new IntersectionObserver(entries => {
  visible = entries[0].isIntersecting;
  schedule();
}, { threshold: 0 }).observe(hero);
// The entrance's inline weights and clips come off while the page is measured, then go back on from fresh geometry.
function measure() {
  if (!ready) return;
  if (intro || loading) entrance.clear();
  layout.measure();
  if (intro || loading) entrance.measure(layout.metrics.nameLines);
  stars?.measure(layout.metrics.h); loader.measure?.(layout.metrics.h); nameReact.measure(); craftWipe.measure();
  if (visible && !document.hidden) draw();
}
new ResizeObserver(measure).observe(hero);
document.fonts.addEventListener('loadingdone', measure);
const name = hero.querySelector('[data-name]');
name.addEventListener('animationend', measure);
// Catch an entrance already in progress when fonts finish, as well as a fresh animationstart.
let weighing = false;
function watchName() {
  if (weighing || !name.getAnimations?.().some(a => a.playState === 'running')) return;
  weighing = true;
  const weigh = () => {
    measure();
    if (name.getAnimations().some(a => a.playState === 'running')) requestAnimationFrame(weigh);
    else weighing = false;
  };
  requestAnimationFrame(weigh);
}
name.addEventListener('animationstart', watchName);

schedule();
await fontsReady();
await document.fonts.ready;
bootDone('fonts');
renderer.setAtlas(makeAtlas());
bootDone('atlas');
ready = true; layout.measure(); loader.measure?.(layout.metrics.h); stars?.measure(layout.metrics.h); craftWipe.measure();
if (loading && !reduced.matches) { first = true; entrance.measure(layout.metrics.nameLines); }
nameOn(); document.fonts.ready.then(() => nameReact.measure());
draw(); window.__ready = true; schedule(); watchName();
