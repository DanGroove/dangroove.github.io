// Wires the journey map together: builds the stage, listens to scroll and resize, runs the one frame loop.
import { C, COPY, MAP, CAMERA, PALETTES, STOPS } from './data.mjs';
import { bigMap, mapDefs, stoneDefs, pathD, TRAIL } from './art.mjs';
import { tripBuild, tripResize, tripState, tripApply, tripMiniVisited, TOTAL_P, VIEW, progressForStop, SEQ } from './trip.mjs';
import { starsBuild, starsResize, starsFrame, starsStill } from './stars.mjs';
import { cardsBuild, cardsResize, cardsFrame, cardsList } from './cards.mjs';
import { tlBuild, tlResize, tlFrame } from './timeline.mjs';
import { footerBuild, footerBuildX, footerResize, footerFrame } from './footer.mjs';
import { findsBuild, findsFrame, findsPointer } from './finds.mjs';

const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Set by join.mjs on the joined page only (the real hero in the stage): frame(st, moved, P) returns false to leave the star
// canvas alone, options for starsFrame, or nothing for the map's own rule; resize(w, h) follows the map's resize.
export const JOIN = { frame: null, resize: null };
const ROOT = document.documentElement;
Object.entries(C).forEach(([k, v]) => ROOT.style.setProperty('--' + k, v));
if (RM) ROOT.classList.add('rm');
document.title = COPY.docTitle;

const MAIN = document.getElementById('jm');
const M = bigMap();
MAIN.innerHTML = `<h1 class="sr">${COPY.title}</h1><section class="trip" id="trip" aria-label="${COPY.srMap}"><div class="stage" id="stage">
<svg id="map" class="map" role="group" aria-label="${COPY.srMap}">${mapDefs()}<g id="cam"><g id="b-all"><g id="b-sea">${M.sea}</g><g id="b-fill">${M.fill}</g><g id="b-coast">${M.coast}</g><g id="b-detail">${M.detail}</g></g><path id="trail-done" class="done" d="${pathD(TRAIL)}"/><g id="finds">${M.finds}</g><g id="fxg" transform="translate(${MAP.x[0]} ${MAP.x[1]})"></g></g></svg>
<canvas id="stars" aria-hidden="true"></canvas>
<div class="ov">${stoneDefs()}<p class="caption">${COPY.heroCaption}</p><p class="cue">${COPY.cue}</p><div class="cards" id="cards"></div><div class="mini" id="mini" role="navigation" aria-label="${COPY.miniMap}"></div><div class="pop" id="pop" role="status"></div><div class="sheet" id="sheet" role="dialog" aria-modal="false"></div><footer class="ft" id="ft"></footer></div>
</div></section><div class="rm-cards" id="rmcards"></div><div class="tl" id="tl"></div>`;

const $ = id => document.getElementById(id);
const SVG = $('map'), CANVAS = $('stars'), TLEL = $('tl');
// timeline sits in the stage overlay so it can become the footer rule; in reduced motion it is a sticky jump menu
if (!RM) $('stage').querySelector('.ov').appendChild(TLEL); else { $('rmcards').appendChild(TLEL); MAIN.appendChild($('ft')); }

let P = 0, dirty = true;
const scrollToP = (p, smooth) => window.scrollTo({ top: p * VIEW.unit, behavior: smooth && !RM ? 'smooth' : 'auto' });
const goStop = i => { if (RM) { cardsList()[i].el.scrollIntoView({ behavior: 'auto', block: 'start' }); return; } scrollToP(progressForStop(i), true); };

tripBuild({ svg: SVG, cam: $('cam'), sea: $('b-sea'), fill: $('b-fill'), coastG: $('b-coast'), detail: $('b-detail'), finds: $('finds'), done: $('trail-done'), caption: document.querySelector('.caption'), cue: document.querySelector('.cue'), mini: $('mini') });
$('mini').querySelectorAll('.mm-stop').forEach(b => { b.style.setProperty('--mk', PALETTES[STOPS[+b.dataset.i].palette].mark); b.addEventListener('click', () => goStop(+b.dataset.i)); });
starsBuild(CANVAS);
cardsBuild(RM ? $('rmcards') : $('cards'), goStop);
tlBuild(TLEL, { jump: goStop, scrub: p => scrollToP(p, false) }, RM);
footerBuild($('ft')); footerBuildX($('fxg'));
findsBuild(SVG, $('pop'), $('sheet'), $('b-all'), RM);
if (RM) $('rmcards').appendChild(TLEL);

function resize() {
  const w = window.innerWidth, h = window.innerHeight, phone = w <= CAMERA.phoneMax;
  tripResize(w, h, RM ? 0 : (phone ? 44 : 56));
  SVG.setAttribute('width', w); SVG.setAttribute('height', h); SVG.setAttribute('viewBox', `0 0 ${w} ${h}`);
  starsResize(w, h);
  if (!RM) cardsResize();
  const rule = footerResize();
  tlResize(RM ? null : rule);
  if (!RM) $('trip').style.height = (TOTAL_P * VIEW.unit + h) + 'px';
  P = window.scrollY / VIEW.unit; dirty = true;
  if (RM) still();
  if (JOIN.resize) JOIN.resize(w, h);
}
const OVERVIEW_P = SEQ.find(s => s.kind === 'overview').a + 1;
function still() { const st = tripState(OVERVIEW_P); tripApply(st); starsStill(st); FIXED = st; }
let FIXED = null;

window.addEventListener('scroll', () => { P = window.scrollY / VIEW.unit; dirty = true; }, { passive: true });
window.addEventListener('resize', resize);
const PTR = [.5, .5];
window.addEventListener('pointermove', e => { PTR[0] = e.clientX / VIEW.w; PTR[1] = e.clientY / VIEW.h; findsPointer(e.clientX, e.clientY); }, { passive: true });

let raf = 0, lastP = -1, lastVisited = '';
function frame(ts) {
  const time = ts / 1000;
  if (RM) { findsFrame(time, FIXED); const jr = JOIN.frame && JOIN.frame(FIXED, true, P); if (jr) starsFrame(0, FIXED, [.5, .5], jr); raf = requestAnimationFrame(frame); return; }
  const st = tripState(P);
  const moved = dirty || P !== lastP;
  if (moved) { tripApply(st); tlFrame(st); footerFrame(st); CANVAS.style.opacity = st.dim; lastP = P; dirty = false; const v = st.visited.join(); if (v !== lastVisited) { lastVisited = v; tripMiniVisited(st); } }
  const jo = JOIN.frame ? JOIN.frame(st, moved, P) : undefined;
  if (jo !== false && (moved || st.handoffT < 1 || jo)) starsFrame(time, st, PTR, jo || undefined);
  cardsFrame(st);
  findsFrame(time, st);
  raf = requestAnimationFrame(frame);
}
document.addEventListener('visibilitychange', () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else if (!raf) raf = requestAnimationFrame(frame); });
const start = () => { resize(); raf = requestAnimationFrame(frame); };
if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
