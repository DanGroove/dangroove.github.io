// Wires the journey map together: builds the stage, listens to scroll and resize, runs the one frame loop.
import { COMB, FINDS, C, COPY, MAP, CAMERA, PALETTES, STOPS, STEPS, DEPTH, NOVA } from './data.mjs';
import { bigMap, mapDefs, stoneDefs, pathD, TRAIL } from './art.mjs';
import { tripBuild, tripResize, tripState, tripFocus, tripApply, tripMiniVisited, VIEW, SEQ, tripMeasureLabels, tripXCamera, toScreen, smooth } from './trip.mjs';
import { starsBuild, starsResize, starsFrame, starsStill, starsTick, starsSkyVisible } from './stars.mjs';
import { cardsBuild, cardsResize, cardsFrame, cardsList, cardsOverride, cardsClose, cardsReduced } from './cards.mjs';
import { tlBuild, tlResize, tlFrame, tlReduced, tlCurrent, tlSetCount } from './timeline.mjs';
import { footerBuild, footerBuildX, footerResize, footerNovaResize, footerFrame, footerMotion } from './footer.mjs';
import { findsBuild, findsFrame, findsPointer, findsCloseAll } from './finds.mjs';
import { FD } from './findkit.mjs';
import { JOURNEY, stepsBuild, stepsFrame, stepsResize, stepsProgress, stepsPause, stepsFocusNow, stepsReduced } from './steps.mjs';
import { depthBuild, depthResize, depthFrame, depthLook, depthInvalidate, novaPress } from './depth.mjs';
import { exploreBuild, exploreResize, exploreApply, exploreActive, exploreReduced } from './explore.mjs';

let RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Set by join.mjs on the joined page only (the real hero in the stage): frame(st, moved, P) returns false to leave the star
// canvas alone, options for starsFrame, or nothing for the map's own rule; resize(w, h) follows the map's resize.
export const JOIN = { leave: null, frame: null, resize: null, reduce: null, heroStart: false };
const ROOT = document.documentElement;
Object.entries(C).forEach(([k, v]) => ROOT.style.setProperty('--' + k, v));
if (RM) ROOT.classList.add('rm');
document.title = COPY.docTitle;

const MAIN = document.getElementById('jm');
const M = bigMap();
MAIN.innerHTML = `<h1 class="sr">${COPY.title}</h1><section class="trip" id="trip" aria-label="${COPY.srMap}"><div class="stage" id="stage">
<canvas id="deep" aria-hidden="true"></canvas>
<svg id="map" class="map" role="group" aria-label="${COPY.srMap}">${mapDefs()}<g id="cam"><g id="b-all"><g id="b-sea">${M.sea}</g><g id="b-fill">${M.fill}</g><g id="b-coast">${M.coast}</g><g id="b-detail">${M.detail}</g></g><path id="trail-done" class="done" d="${pathD(TRAIL)}"/><g id="finds">${M.finds}</g><g id="fxg" transform="translate(${MAP.x[0]} ${MAP.x[1]})"></g></g></svg>
<canvas id="nova" aria-hidden="true"></canvas><canvas id="stars" aria-hidden="true"></canvas>
<canvas id="air" aria-hidden="true"></canvas><svg id="sky" aria-hidden="true"></svg>
<button type="button" class="fx-hit" id="nova-hit" tabindex="-1" aria-label="${COPY.steps.dig}" aria-disabled="true"></button>
<div class="ov">${stoneDefs()}<p class="caption">${COPY.heroCaption}</p><p class="cue">${COPY.cue}</p><div class="cards" id="cards" inert></div><div class="mini" id="mini" role="navigation" aria-label="${COPY.miniMap}"></div><div class="pop" id="pop" role="status"></div><div class="sheet" id="sheet" role="dialog" aria-modal="true"></div><footer class="ft" id="ft"></footer></div>
</div></section><div class="rm-cards" id="rmcards"></div><div class="tl" id="tl"></div>`;

const $ = id => document.getElementById(id);
const SVG = $('map'), CANVAS = $('stars'), TLEL = $('tl');
// timeline sits in the stage overlay so it can become the footer rule; in reduced motion it is a sticky jump menu
const FTWORLD = document.createElement('div'); FTWORLD.id = 'ft-world'; $('stage').querySelector('.ov').appendChild(FTWORLD); FTWORLD.append($('ft'), TLEL);

let P = 0, dirty = true;
let mainCurrent = 0, mainModeVersion = 0;
const mainHeroEnd = SEQ.find(s=>s.kind==='handoff').a, mainMapStart = SEQ.find(s=>s.kind==='overview').a;
const goStop = i => { mainCurrent = i; tlCurrent(Math.min(i, STOPS.length - 1), true); if (RM) { if (i < 0) { window.scrollTo({top:(JOIN.heroStart ? mainMapStart : 0)*VIEW.unit,behavior:'instant'}); return; } if (i >= STOPS.length) { $('ft').scrollIntoView({behavior:'auto',block:'start'}); return; } cardsList()[i].el.scrollIntoView({ behavior: 'auto', block: 'start' }); return; } JOURNEY.go(STOPS[i].id, { jump: exploreActive() }); };

tripBuild({ svg: SVG, cam: $('cam'), sea: $('b-sea'), fill: $('b-fill'), coastG: $('b-coast'), detail: $('b-detail'), finds: $('finds'), done: $('trail-done'), x: $('fxg'), caption: document.querySelector('.caption'), cue: document.querySelector('.cue'), mini: $('mini') });
$('mini').querySelectorAll('.mm-stop').forEach(b => { const p = PALETTES[STOPS[+b.dataset.i].palette]; b.style.setProperty('--mk', p.mark); if (STOPS[+b.dataset.i].palette === 'interkom') { b.classList.add('mm-interkom'); b.style.setProperty('--shield-a', p.shield[1]); b.style.setProperty('--shield-b', p.shield[0]); } p.shield.forEach((v, j) => b.style.setProperty('--shield-' + 'abc'[j], v)); b.addEventListener('click', () => goStop(+b.dataset.i)); });
$('mini').addEventListener('click', e => {
  if (!e.detail || !e.target.closest?.('.mm-stop')) return;
  const r = $('mini').getBoundingClientRect(), distances = STOPS.map(s => { const p = MAP.waypoints[s.w]; return Math.hypot(e.clientX-r.left-p[0]/MAP.w*r.width,e.clientY-r.top-p[1]/MAP.h*r.height); });
  e.preventDefault(); e.stopImmediatePropagation(); goStop(distances.indexOf(Math.min(...distances)));
}, true);
starsBuild(CANVAS);
depthBuild($('deep'), $('air'), $('sky'), RM);
cardsBuild($('cards'), goStop, false);
cardsList().forEach(c => c.el.querySelectorAll('img').forEach(img => img.addEventListener('load', () => { if (!RM) { cardsResize(true); dirty = true; } })));
tlBuild(TLEL, { jump: goStop, scrub: p => JOURNEY.set(p), moving: () => JOURNEY.moving }, false);
footerBuild($('ft'), false); footerBuildX($('fxg'), false, $('nova'), $('nova-hit'));
const mainXStrokes = [...SVG.querySelectorAll('.fx-red')];

stepsBuild({ stage: $('stage'), rm: false, resize, joinedTop: () => JOIN.heroStart, reducedGo: id => { if (id === 'top') window.scrollTo({top:0,behavior:'instant'}); else goStop(id === 'map' ? -1 : id === 'end' ? STOPS.length : STOPS.findIndex(s=>s.id===id)); } });
findsBuild(SVG, $('pop'), $('sheet'), $('b-all'), RM);
// The same six markers move in screen space, so their type never needs to be
// resized and rasterized on every camera frame. No marker is copied.
const mainMarkerLayer = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); mainMarkerLayer.classList.add('marker-layer');
$('stage').querySelector('.ov').appendChild(mainMarkerLayer);
const mainMarkers = FINDS.filter(f => f.n).map(f => { const el = $('mk-' + f.id), place = document.createElementNS('http://www.w3.org/2000/svg', 'g'); el.dataset.screen = 'true'; place.appendChild(el); mainMarkerLayer.appendChild(place); return { el, place, at: f.mark }; });
function mainPlaceMarkers(st) {
  mainMarkers.forEach(m => { const p = toScreen(st, m.at), transform = `translate(${p[0]-m.at[0]} ${p[1]-m.at[1]})`; if (m.place.getAttribute('transform') !== transform) m.place.setAttribute('transform', transform); });
  const opacity = String(smooth(.5, 1, st.handoffT) * Number(SVG.style.opacity || 1)); if (mainMarkerLayer.style.opacity !== opacity) mainMarkerLayer.style.opacity = opacity;
  const visible=Number(opacity)>0&&SVG.style.visibility!=='hidden'?'visible':'hidden'; if (mainMarkerLayer.style.visibility!==visible) mainMarkerLayer.style.visibility=visible;
}
exploreBuild({ stage: $('stage'), world: FTWORLD, journey: JOURNEY, rm: false });

// Touch padding can overlap at the overview. Resolve it by the nearest drawing
// before either target handles the press; keep native drag/pinch ownership.
let mainTouchPick = null;
window.addEventListener('pointerdown', e => {
  if (!e.isTrusted || e.pointerType !== 'touch') return;
  mainTouchPick = null;
  if (RM || JOURNEY.moving || FD.sheetOwner || !FD.st || FD.st.exploring || e.target.closest?.('.pop,.go,.tl,.tl-count,[data-review]')) return;
  const candidates = [...Object.values(FD.list), ...FD.list.hoards.items].filter(o => o.id !== 'hoards' && o.el.tabIndex === 0).map(o => ({ el: o.el, p: toScreen(FD.st, [o.x, o.y]) }));
  if ($('nova-hit').getAttribute('aria-disabled') !== 'true') candidates.push({el:$('nova-hit'),p:toScreen(FD.st,MAP.x)});
  cardsList().filter(c => !c.btn.inert && c.btn.tabIndex === 0).forEach(c => { const p = toScreen(FD.st, MAP.waypoints[c.stop.w]), stone = Math.max(14, Math.min(36, 10 * FD.st.cam.s)); candidates.push({ el: c.btn, p: [p[0], p[1] - stone / 2 - 3] }); });
  const near = candidates.map(c => ({ ...c, d: Math.hypot(e.clientX-c.p[0],e.clientY-c.p[1]) })).filter(c => c.d <= COMB.target / 2).sort((a,b) => a.d-b.d)[0];
  if (!near || near.el.contains(e.target)) return;
  mainTouchPick = { el: near.el, x: e.clientX, y: e.clientY };
  e.preventDefault(); e.stopImmediatePropagation();
  near.el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, pointerId: e.pointerId, pointerType: 'touch', clientX: e.clientX, clientY: e.clientY, button: 0, buttons: 1, isPrimary: e.isPrimary }));
}, true);
window.addEventListener('pointerup', e => {
  const p = mainTouchPick; if (!p || !e.isTrusted) return; mainTouchPick = null;
  e.preventDefault(); e.stopImmediatePropagation();
  p.el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, pointerId: e.pointerId, pointerType: 'touch', clientX: e.clientX, clientY: e.clientY }));
  if (Math.hypot(e.clientX-p.x,e.clientY-p.y) <= 6) p.el.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1, clientX: e.clientX, clientY: e.clientY }));
}, true);
window.addEventListener('click', e => {
  const p = mainTouchPick; mainTouchPick = null;
  if (!e.isTrusted || !p || p.el.contains(e.target) || Math.hypot(e.clientX-p.x,e.clientY-p.y) > 6) return;
  e.preventDefault(); e.stopImmediatePropagation(); p.el.dispatchEvent(new MouseEvent('click', { bubbles: true, detail: 1, clientX: e.clientX, clientY: e.clientY }));
}, true);
$('nova-hit')?.addEventListener('click', e => { const st = tripState(JOURNEY.P); if (st.rushT > 0 && st.settleT < 1) { e.stopImmediatePropagation(); novaPress(); } }, true);
document.addEventListener('dragstart', e => e.preventDefault(), true);
// Escape folds the open card, but not while a find is still letting go of the camera (a quick second Escape after leaving a find).
window.addEventListener('keydown', e => { if (e.key === 'Escape' && !e.defaultPrevented && !RM && !JOURNEY.moving && !stepsFocusNow() && cardsClose()) e.preventDefault(); });

function resize() {
  const w = window.innerWidth, h = window.innerHeight, phone = w <= CAMERA.phoneMax;
  const stepMode = !RM;
  const room = stepMode ? (phone ? STEPS.nav.bar : STEPS.nav.h + STEPS.nav.gap + 6) : 0;
  tripResize(w, h, RM ? 0 : (phone ? 44 : 56) + room);
  SVG.setAttribute('width', w); SVG.setAttribute('height', h); SVG.setAttribute('viewBox', `0 0 ${w} ${h}`);
  mainMarkerLayer.setAttribute('viewBox', `0 0 ${w} ${h}`);
  tripMeasureLabels(); starsResize(w, h);
  footerNovaResize(w, h);
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
function still() { const st = tripState(OVERVIEW_P); st.reduced = true; tripApply(st); mainPlaceMarkers(st); starsStill(st); depthFrame(st, 0, 0, [.5, .5], { look: [0, 0], changed: false, fine: false }, true); FIXED = st; }
let FIXED = null;

window.addEventListener('scroll', () => { if (RM) dirty = true; }, { passive: true });
window.addEventListener('jm-explore', () => { dirty = true; });
window.addEventListener('resize', resize);
window.addEventListener('jm-depth', () => { dirty = true; depthInvalidate(); if (RM && FIXED) still(); });
const PTR = [.5, .5];
window.addEventListener('pointermove', e => { PTR[0] = e.clientX / VIEW.w; PTR[1] = e.clientY / VIEW.h; findsPointer(e.clientX, e.clientY); }, { passive: true });

let raf = 0, lastP = -1, lastVisited = '', mainTs = null, mainSkyDraw = -Infinity, mainTuning = '', mainFocus = '', mainKeys = '', mainMapPending = false;
function frame(ts) {
  const time = ts / 1000;
  const dt = mainTs === null ? 0 : Math.max(0, Math.min(STEPS.frameMax, (ts - mainTs) / 1000)); mainTs = ts;
  P = stepsFrame(ts);
  if (JOIN.leave) JOIN.leave(P);
  if (RM) { findsFrame(time, FIXED); const jr = JOIN.frame && JOIN.frame(FIXED, true, P); if (jr) starsFrame(0, FIXED, [.5, .5], { ...jr, still: true }); raf = requestAnimationFrame(frame); return; }
  const st = tripState(P); const f = stepsFocusNow(); if (f) tripFocus(st, f.view, f.k);
  const explored = exploreApply(st, dt), folded = cardsOverride(st, dt, JOURNEY.moving);
  if (f && f.k > 0) mainCurrent = -1; else if (!JOURNEY.moving && st.settleT >= 1 && !st.exploring) mainCurrent = STOPS.length; else if (!JOURNEY.moving && st.kind === 'hold') mainCurrent = st.i; else if (['hero','handoff','overview'].includes(st.kind)) mainCurrent = JOIN.heroStart && st.P < mainHeroEnd ? -2 : -1;
  st.visiting = JOURNEY.visiting;
  const novaAway = !(st.exploreK > 0) && ((st.kind === 'rush' && JOURNEY.moving) || st.rushT > 0 || st.blastT > 0);
  if (ROOT.classList.contains('jm-nova-away') !== novaAway) ROOT.classList.toggle('jm-nova-away', novaAway);
  // Nothing unseen takes the keyboard: the stone marks and the timeline wait for the map's hand-over; the timeline leaves in explore.
  st.focusId = f?.id; if (ROOT.dataset.find !== (f?.id || '')) ROOT.dataset.find = f?.id || '';
  const mapKeys = st.handoffT >= 1 && (st.blastT === 0 || st.exploreK > 0);
  const timelineKeys = mapKeys && st.rushT === 0 && !st.exploring && !(st.exploreK > 0);
  const keys = `${mapKeys}/${timelineKeys}`;
  if (keys !== mainKeys) { mainKeys = keys; $('cards').inert = !mapKeys; TLEL.inert = !timelineKeys; TLEL.tabIndex = timelineKeys ? 0 : -1; TLEL.setAttribute('aria-hidden', !timelineKeys); }
  const focusKey = JSON.stringify(f), tuning = JSON.stringify([DEPTH, NOVA]), moved = dirty || explored || folded || mainMapPending || P !== lastP || tuning !== mainTuning || focusKey !== mainFocus;
  mainFocus = focusKey;
  const aim = depthLook(dt, PTR);
  if (moved) { const xp = toScreen(st, MAP.x); if (st.rushT === 0 && xp[0] >= 0 && xp[0] <= VIEW.w && xp[1] >= 0 && xp[1] <= VIEW.h) { const weight = String(3.6 * Math.min(1, tripXCamera().s / st.cam.s)); mainXStrokes.forEach(el => { if (el.getAttribute('stroke-width') !== weight) el.setAttribute('stroke-width', weight); }); } mainMapPending = tripApply(st); tlFrame(st); footerFrame(st); if (!JOIN.frame && CANVAS.style.opacity !== String(st.dim)) CANVAS.style.opacity = st.dim; lastP = P; mainTuning = tuning; dirty = false; const v = st.visited.join(); if (v !== lastVisited) { lastVisited = v; tripMiniVisited(st); } }
  if (moved) mainPlaceMarkers(st);
  const jo = JOIN.frame ? JOIN.frame(st, moved, P) : undefined;
  depthFrame(st, time, dt, PTR, aim, moved);
  footerMotion(time, dt, st, aim.look, moved);
  const starsChanged = starsTick(dt, st);
  const skyIdle = starsSkyVisible(st) && time - mainSkyDraw >= 1 / DEPTH.idleFps;
  if (jo !== false && (moved || starsChanged || st.handoffT < 1 || jo || aim.changed || skyIdle || st.blastT > 0)) {
    starsFrame(time, st, PTR, { ...(jo || {}), look: aim.look }); mainSkyDraw = time;
  }
  if (st.rushT > 0 && !RM) { const hit = $('nova-hit'); hit.tabIndex = 0; hit.setAttribute('aria-disabled', 'false'); hit.setAttribute('aria-label', COMB.novaSay); }
  cardsFrame(st, aim.look, PTR);
  findsFrame(time, st);
  raf = requestAnimationFrame(frame);
}
document.addEventListener('visibilitychange', () => { stepsPause(); mainTs = null; if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else if (!raf) raf = requestAnimationFrame(frame); });
document.fonts?.addEventListener('loadingdone', resize);
const start = () => { if (RM) mainReduced(true, true); resize(); raf = requestAnimationFrame(frame); };
if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();

function mainReduced(on, initial = false) {
  const version=++mainModeVersion;
  if (initial) mainCurrent = -1;
  const priorEpoch = FD.overlayEpoch;
  const request = FD.readyAction?.owner || (FD.list.ravens?.queued ? FD.list.ravens : FD.list.hoards?.items.find(h => h.queued));
  if (on && request) { FD.pendingPress = request.el; FD.readyAction = null; }
  if (on && FD.pendingPress) mainCurrent = -1;
  const place=mainCurrent;
  findsCloseAll(); RM = on; JOIN.reduce?.(on); ROOT.classList.toggle('rm', on); FD.rm = on; cardsReduced(on); tlReduced(on); exploreReduced(on); stepsReduced(on, mainCurrent);
  for (const c of cardsList()) { (on ? $('rmcards') : $('cards')).appendChild(c.el); if (on) { c.el.style.transform = ''; c.el.style.width = ''; c.el.style.height = ''; c.el.style.opacity = ''; c.card.removeAttribute('style'); c.face.removeAttribute('style'); c.inn.removeAttribute('style'); c.face.inert = false; } }
  if (on) {
    $('rmcards').appendChild(TLEL); MAIN.appendChild($('ft')); $('cards').inert = true; TLEL.inert = false; TLEL.tabIndex = 0; TLEL.removeAttribute('aria-hidden');
    TLEL.style.opacity = 1; TLEL.querySelectorAll('.tl-f').forEach(el => el.style.opacity = 1); TLEL.querySelector('.tl-rows').style.transform = 'none';
    const ft = $('ft'); ft.style.visibility = 'visible'; ft.inert = false; ft.querySelector('.ft-in').style.opacity = 1; ft.querySelectorAll('.ft-r').forEach(el => { el.style.opacity = 1; el.style.transform = ''; });
    $('fxg').style.visibility = 'visible'; mainXStrokes.forEach(el => el.setAttribute('stroke-width', 3.6));
    FD.bits.forEach(bit => { bit.live = false; bit.el.style.display = 'none'; }); FD.flight = null; FD.flights = []; FD.landed = FD.found.size; if (FD.star) FD.star.style.opacity = 0; tlSetCount(FD.landed, FINDS.length);
  }
  else FTWORLD.append($('ft'), TLEL);
  mainKeys = ''; dirty = true; resize(); if (on) VIEW.stageTop = $('stage').getBoundingClientRect().top; if (on && mainCurrent < 0) tlCurrent(-1); if (on && !initial) { const park=()=>{if(place < -1)window.scrollTo({top:0,behavior:'instant'});else goStop(place);}; park(); const settle=left=>requestAnimationFrame(()=>{if(!RM||version!==mainModeVersion)return;park();if(left)settle(left-1);}); settle(3); }
  if (on) { FD.st = FIXED; Object.values(FD.list).forEach(o => o.reduce?.(o.overlayEpoch === priorEpoch)); }
}
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', e => mainReduced(e.matches));
window.addEventListener('scroll', () => { if (!RM) return; VIEW.stageTop = $('stage').getBoundingClientRect().top; const list = cardsList(); let near = 0, distance = Infinity; list.forEach((c,i) => { const d = Math.abs(c.el.getBoundingClientRect().top - VIEW.h / 3); if (d < distance) { distance = d; near = i; } }); mainCurrent = JOIN.heroStart && scrollY/VIEW.unit < mainHeroEnd ? -2 : VIEW.stageTop + VIEW.h > VIEW.h / 2 ? -1 : $('ft').getBoundingClientRect().top < VIEW.h / 2 ? STOPS.length : near; tlCurrent(Math.min(mainCurrent, STOPS.length - 1)); }, { passive: true });
