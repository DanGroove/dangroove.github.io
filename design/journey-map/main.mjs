// Wires the journey map together: builds the stage, listens to scroll and resize, runs the one frame loop.
import { C, COPY, MAP, CAMERA, PALETTES, STOPS, STEPS, DEPTH, NOVA } from './data.mjs';
import { bigMap, mapDefs, stoneDefs, pathD, TRAIL } from './art.mjs';
import { tripBuild, tripResize, tripState, tripFocus, tripApply, tripMiniVisited, VIEW, SEQ } from './trip.mjs';
import { starsBuild, starsResize, starsFrame, starsStill, starsTick, starsSkyVisible } from './stars.mjs';
import { cardsBuild, cardsResize, cardsFrame, cardsList, cardsOverride, cardsClose } from './cards.mjs';
import { tlBuild, tlResize, tlFrame } from './timeline.mjs';
import { footerBuild, footerBuildX, footerResize, footerFrame, footerMotion } from './footer.mjs';
import { findsBuild, findsFrame, findsPointer } from './finds.mjs';
import { JOURNEY, stepsBuild, stepsFrame, stepsResize, stepsProgress, stepsPause, stepsFocusNow } from './steps.mjs';
import { depthBuild, depthResize, depthFrame, depthLook, depthInvalidate } from './depth.mjs';
import { exploreBuild, exploreResize, exploreApply, exploreActive } from './explore.mjs';

const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Set by join.mjs on the joined page only (the real hero in the stage): frame(st, moved, P) returns false to leave the star
// canvas alone, options for starsFrame, or nothing for the map's own rule; resize(w, h) follows the map's resize.
export const JOIN = { leave: null, frame: null, resize: null, heroStart: false };
const ROOT = document.documentElement;
Object.entries(C).forEach(([k, v]) => ROOT.style.setProperty('--' + k, v));
if (RM) ROOT.classList.add('rm');
document.title = COPY.docTitle;

const MAIN = document.getElementById('jm');
const M = bigMap();
MAIN.innerHTML = `<h1 class="sr">${COPY.title}</h1><section class="trip" id="trip" aria-label="${COPY.srMap}"><div class="stage" id="stage">
<canvas id="deep" aria-hidden="true"></canvas>
<svg id="map" class="map" role="group" aria-label="${COPY.srMap}">${mapDefs()}<g id="cam"><g id="b-all"><g id="b-sea">${M.sea}</g><g id="b-fill">${M.fill}</g><g id="b-coast">${M.coast}</g><g id="b-detail">${M.detail}</g></g><path id="trail-done" class="done" d="${pathD(TRAIL)}"/><g id="finds">${M.finds}</g><g id="fxg" transform="translate(${MAP.x[0]} ${MAP.x[1]})"></g></g></svg>
<canvas id="stars" aria-hidden="true"></canvas>
<canvas id="air" aria-hidden="true"></canvas><svg id="sky" aria-hidden="true"></svg>
<div class="ov">${stoneDefs()}<p class="caption">${COPY.heroCaption}</p><p class="cue">${COPY.cue}</p><div class="cards" id="cards"></div><div class="mini" id="mini" role="navigation" aria-label="${COPY.miniMap}"></div><div class="pop" id="pop" role="status"></div><div class="sheet" id="sheet" role="dialog" aria-modal="false"></div><footer class="ft" id="ft"></footer></div>
</div></section><div class="rm-cards" id="rmcards"></div><div class="tl" id="tl"></div>`;

const $ = id => document.getElementById(id);
const SVG = $('map'), CANVAS = $('stars'), TLEL = $('tl');
// timeline sits in the stage overlay so it can become the footer rule; in reduced motion it is a sticky jump menu
let FTWORLD = null;
if (!RM) { FTWORLD = document.createElement('div'); FTWORLD.id = 'ft-world'; $('stage').querySelector('.ov').appendChild(FTWORLD); FTWORLD.append($('ft'), TLEL); }
else { $('rmcards').appendChild(TLEL); MAIN.appendChild($('ft')); }

let P = 0, dirty = true;
const goStop = i => { if (RM) { cardsList()[i].el.scrollIntoView({ behavior: 'auto', block: 'start' }); return; } JOURNEY.go(STOPS[i].id, { jump: exploreActive() }); };

tripBuild({ svg: SVG, cam: $('cam'), sea: $('b-sea'), fill: $('b-fill'), coastG: $('b-coast'), detail: $('b-detail'), finds: $('finds'), done: $('trail-done'), caption: document.querySelector('.caption'), cue: document.querySelector('.cue'), mini: $('mini') });
$('mini').querySelectorAll('.mm-stop').forEach(b => { b.style.setProperty('--mk', PALETTES[STOPS[+b.dataset.i].palette].mark); b.addEventListener('click', () => goStop(+b.dataset.i)); });
starsBuild(CANVAS);
depthBuild($('deep'), $('air'), $('sky'), RM);
cardsBuild(RM ? $('rmcards') : $('cards'), goStop, RM);
tlBuild(TLEL, { jump: goStop, scrub: p => JOURNEY.set(p) }, RM);
footerBuild($('ft'), RM); footerBuildX($('fxg'), RM);
if (RM) $('rmcards').appendChild(TLEL);
stepsBuild({ stage: $('stage'), rm: RM, resize, joinedTop: () => JOIN.heroStart });
findsBuild(SVG, $('pop'), $('sheet'), $('b-all'), RM);
exploreBuild({ stage: $('stage'), world: FTWORLD, journey: JOURNEY, rm: RM });
document.addEventListener('dragstart', e => e.preventDefault(), true);
window.addEventListener('keydown', e => { if (e.key === 'Escape' && !e.defaultPrevented && !RM && !JOURNEY.moving && cardsClose()) e.preventDefault(); });

function resize() {
  const w = window.innerWidth, h = window.innerHeight, phone = w <= CAMERA.phoneMax;
  const stepMode = !RM;
  const room = stepMode ? (phone ? STEPS.nav.bar : STEPS.nav.h + STEPS.nav.gap + 6) : 0;
  tripResize(w, h, RM ? 0 : (phone ? 44 : 56) + room);
  SVG.setAttribute('width', w); SVG.setAttribute('height', h); SVG.setAttribute('viewBox', `0 0 ${w} ${h}`);
  starsResize(w, h);
  depthResize(w, h);
  if (!RM) cardsResize(stepMode);
  if (FTWORLD) FTWORLD.style.transform = 'none';
  const rule = footerResize();
  tlResize(RM ? null : rule);
  if (!RM) { $('trip').style.height = h + 'px'; exploreResize(); }
  stepsResize(); P = stepsProgress(); dirty = true;
  if (RM) still();
  if (JOIN.resize) JOIN.resize(w, h);
}
const OVERVIEW_P = SEQ.find(s => s.kind === 'overview').a + 1;
function still() { const st = tripState(OVERVIEW_P); tripApply(st); starsStill(st); depthFrame(st, 0, 0, [.5, .5], { look: [0, 0], changed: false, fine: false }, true); FIXED = st; }
let FIXED = null;

window.addEventListener('scroll', () => { if (RM) dirty = true; }, { passive: true });
window.addEventListener('jm-explore', () => { dirty = true; });
window.addEventListener('resize', resize);
window.addEventListener('jm-depth', () => { dirty = true; depthInvalidate(); if (RM && FIXED) still(); });
const PTR = [.5, .5];
window.addEventListener('pointermove', e => { PTR[0] = e.clientX / VIEW.w; PTR[1] = e.clientY / VIEW.h; findsPointer(e.clientX, e.clientY); }, { passive: true });

let raf = 0, lastP = -1, lastVisited = '', mainTs = null, mainSkyDraw = -Infinity, mainTuning = '', mainFocus = '';
function frame(ts) {
  const time = ts / 1000;
  const dt = mainTs === null ? 0 : Math.max(0, Math.min(STEPS.frameMax, (ts - mainTs) / 1000)); mainTs = ts;
  P = stepsFrame(ts);
  if (JOIN.leave) JOIN.leave(P);
  if (RM) { findsFrame(time, FIXED); const jr = JOIN.frame && JOIN.frame(FIXED, true, P); if (jr) starsFrame(0, FIXED, [.5, .5], { ...jr, still: true }); raf = requestAnimationFrame(frame); return; }
  const st = tripState(P); const f = stepsFocusNow(); if (f) tripFocus(st, f.view, f.k);
  const explored = exploreApply(st, dt), folded = cardsOverride(st, dt, JOURNEY.moving);
  st.visiting = JOURNEY.visiting;
  const focusKey = JSON.stringify(f), tuning = JSON.stringify([DEPTH, NOVA]), moved = dirty || explored || folded || P !== lastP || tuning !== mainTuning || focusKey !== mainFocus;
  mainFocus = focusKey;
  const aim = depthLook(dt, PTR);
  if (moved) { tripApply(st); tlFrame(st); footerFrame(st); if (!JOIN.frame) CANVAS.style.opacity = st.dim; lastP = P; mainTuning = tuning; dirty = false; const v = st.visited.join(); if (v !== lastVisited) { lastVisited = v; tripMiniVisited(st); } }
  const jo = JOIN.frame ? JOIN.frame(st, moved, P) : undefined;
  depthFrame(st, time, dt, PTR, aim, moved);
  footerMotion(time, dt, st, aim.look, moved);
  const starsChanged = starsTick(dt, st);
  const skyIdle = starsSkyVisible(st) && time - mainSkyDraw >= 1 / DEPTH.idleFps;
  if (jo !== false && (moved || starsChanged || st.handoffT < 1 || jo || aim.changed || skyIdle || st.blastT > 0)) {
    starsFrame(time, st, PTR, { ...(jo || {}), look: aim.look }); mainSkyDraw = time;
  }
  cardsFrame(st, aim.look, PTR);
  findsFrame(time, st);
  raf = requestAnimationFrame(frame);
}
document.addEventListener('visibilitychange', () => { stepsPause(); mainTs = null; if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else if (!raf) raf = requestAnimationFrame(frame); });
const start = () => { resize(); raf = requestAnimationFrame(frame); };
if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
