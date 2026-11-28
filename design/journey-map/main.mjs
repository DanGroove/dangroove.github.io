// Wires the journey map together: builds the stage, listens to scroll and resize, runs the one frame loop.
import { COMB, FINDS, C, COPY, MAP, CAMERA, PALETTES, STOPS, STEPS, DEPTH, NOVA } from './data.mjs';
import { bigMap, mapDefs, stoneDefs, pathD, TRAIL } from './art.mjs';
import { tripBuild, tripResize, tripState, tripFocus, tripApply, tripVeil, tripMiniVisited, VIEW, SEQ, tripMeasureLabels, tripXCamera, toScreen, smooth } from './trip.mjs';
import { starsBuild, starsResize, starsFrame, starsStill, starsTick, starsSkyVisible } from './stars.mjs';
import { cardsBuild, cardsResize, cardsFrame, cardsList, cardsOverride, cardsClose, cardsReduced } from './cards.mjs';
import { tlBuild, tlResize, tlFrame, tlReduced, tlCurrent, tlSetCount } from './timeline.mjs';
import { footerBuild, footerBuildX, footerResize, footerNovaResize, footerFrame, footerMotion } from './footer.mjs';
import { findsBuild, findsFrame, findsPointer, findsCloseAll } from './finds.mjs';
import { FD, findIdleBox } from './findkit.mjs';
import { JOURNEY, stepsBuild, stepsFrame, stepsResize, stepsProgress, stepsPause, stepsFocusNow, stepsReduced } from './steps.mjs';
import { depthBuild, depthResize, depthFrame, depthLook, depthInvalidate, novaPress } from './depth.mjs';
import { exploreBuild, exploreResize, exploreApply, exploreActive, exploreReduced } from './explore.mjs';

// The walked trail is built once; only its current short piece is dashed.
const DONE_PIECES = (() => {
  const length = 40, out = []; let pts = [TRAIL[0]], acc = 0, u0 = 0;
  for (let i = 1; i < TRAIL.length; i++) {
    const a = TRAIL[i-1], b = TRAIL[i], seg = Math.hypot(b[0]-a[0],b[1]-a[1]); let t0 = 0;
    while (seg > 0 && acc+seg*(1-t0) >= length) {
      const t = t0+(length-acc)/seg, q = [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
      pts.push(q); out.push({pts,u0,u1:u0+length}); u0+=length; pts=[q]; acc=0; t0=t;
    }
    acc+=seg*(1-t0); pts.push(b);
  }
  if (pts.length>1) out.push({pts,u0,u1:u0+acc}); return out;
})();

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
<svg id="map" class="map" role="group" aria-label="${COPY.srMap}">${mapDefs()}<g id="cam"><g id="b-all"><g id="b-sea">${M.sea}</g><g id="b-fill">${M.fill}</g><g id="b-coast">${M.coast}</g><g id="b-detail">${M.detail}</g></g><path id="trail-done" class="done" d="${pathD(TRAIL)}"/><g id="trail-pieces">${DONE_PIECES.map(q => `<path class="done-p" data-u0="${q.u0}" data-u1="${q.u1}" d="M${q.pts.map(p => p.join(' ')).join('L')}"/>`).join('')}</g><g id="finds">${M.finds}</g><g id="fxg" transform="translate(${MAP.x[0]} ${MAP.x[1]})"></g></g></svg>
<canvas id="map-veil" class="map" aria-hidden="true"></canvas><svg id="map-veil-defs" aria-hidden="true" pointer-events="none" width="0" height="0"><defs><radialGradient id="veil-soft"><stop offset=".6" stop-color="black"/><stop offset="1" stop-color="black" stop-opacity="0"/></radialGradient><mask id="veil-mask" maskUnits="userSpaceOnUse"><rect id="veil-mask-frame" fill="white"/><g id="veil-holes"></g></mask><clipPath id="veil-lines-clip" clipPathUnits="userSpaceOnUse"><path id="veil-line-cuts" clip-rule="evenodd"/></clipPath><rect id="veil-fill" fill="${C.shade}" mask="url(#veil-mask)"/></defs><g id="cam-veil"><g id="wf-lines" clip-path="url(#veil-lines-clip)" pointer-events="none"></g></g></svg>
<canvas id="nova" aria-hidden="true"></canvas><canvas id="stars" aria-hidden="true"></canvas>
<canvas id="air" aria-hidden="true"></canvas><div id="sky" aria-hidden="true"></div>
<button type="button" class="fx-hit" id="nova-hit" tabindex="-1" aria-label="${COPY.steps.dig}" aria-disabled="true"></button>
<div class="ov">${stoneDefs()}<p class="caption">${COPY.heroCaption}</p><p class="cue">${COPY.cue}</p><div class="cards" id="cards" inert></div><div class="mini" id="mini" role="navigation" aria-label="${COPY.miniMap}"></div><div class="pop" id="pop" role="status"></div><div class="sheet" id="sheet" role="dialog" aria-modal="true"></div><footer class="ft" id="ft"></footer></div>
</div></section><div class="rm-cards" id="rmcards"></div><div class="tl" id="tl"></div>`;

const $ = id => document.getElementById(id);
// L2: the base (sea, land, coasts and the land's marks before the tree) gets its own svg right under svg#map.
{
  const NS = 'http://www.w3.org/2000/svg', det = $('b-detail'), kids = [...det.children], yi = kids.findIndex(k => k.classList.contains('ygg'));
  const base = document.createElementNS(NS, 'svg'); base.id = 'map-base'; base.setAttribute('class', 'map map-base'); base.setAttribute('aria-hidden', 'true');
  const camB = document.createElementNS(NS, 'g'); camB.id = 'cam-base'; base.appendChild(camB);
  const rest = document.createElementNS(NS, 'g'); rest.id = 'b-rest';
  const detail = document.createElementNS(NS, 'g'); detail.id = 'b-rest-detail'; rest.appendChild(detail);
  if (yi >= 0) kids.slice(yi).forEach(k => detail.appendChild(k));
  camB.appendChild($('b-all')); $('cam').prepend(rest); $('map').before(base);
  // One layer for the whole map (pinch recheck, 2026-11-27): Chrome split svg#map into layers by where its art sat and joined
  // them mid-move, and each new layer was blank for a frame (the ash, stop names and finds dropping out in the phone films).
  // An invisible rect under it all, as far as the art reaches, keeps it one layer at every camera.
  const cover = document.createElementNS(NS, 'rect'), pad = MAP.w;
  Object.entries({ id: 'map-cover', x: -pad, y: -pad / 2, width: MAP.w + 2 * pad, height: MAP.h + pad, fill: C.black, 'fill-opacity': 0, 'pointer-events': 'none' }).forEach(([k, v]) => cover.setAttribute(k, v));
  $('cam').prepend(cover);
  // L5 (2026-11-27): the names and trail, then the finds and the X, get svgs of their own over svg#map in div#map-stack, so
  // their writes on every frame of a move no longer redraw the map (phone-p27: it repainted nearly every frame of Set out).
  // The stack takes the fade (faded one by one, the trail showed through the longship); each keeps a cover to stay one layer.
  const stack = document.createElement('div'); stack.id = 'map-stack'; $('map').before(stack); stack.appendChild($('map'));
  for (const id of ['live', 'finds', 'anim']) {
    const svg = document.createElementNS(NS, 'svg'), cam = document.createElementNS(NS, 'g'), inner = cover.cloneNode();
    svg.id = 'map-' + id; svg.setAttribute('class', 'map'); svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('pointer-events', 'none');
    cam.id = 'cam-' + id; inner.id = 'map-' + id + '-cover'; cam.appendChild(inner); svg.appendChild(cam); stack.appendChild(svg);
  }
  const lines = document.createElementNS(NS, 'svg'), lineCam = document.createElementNS(NS, 'g');
  lines.id = 'map-lines'; lines.setAttribute('class', 'map'); lines.setAttribute('aria-hidden', 'true'); lines.setAttribute('pointer-events', 'none');
  lineCam.id = 'cam-lines'; lineCam.appendChild($('wf-lines')); lines.appendChild(lineCam); $('map-veil').after(lines);
}
const SVG = $('map'), CANVAS = $('stars'), TLEL = $('tl'), MAP_STACK = $('map-stack'), MAP_SVGS = [SVG, $('map-live'), $('map-finds'), $('map-anim'), $('map-lines')];
// timeline sits in the stage overlay so it can become the footer rule; in reduced motion it is a sticky jump menu
const FTWORLD = document.createElement('div'); FTWORLD.id = 'ft-world'; $('stage').querySelector('.ov').appendChild(FTWORLD); FTWORLD.append($('ft'), TLEL);

let P = 0, dirty = true;
let mainCurrent = 0, mainModeVersion = 0;
const mainHeroEnd = SEQ.find(s=>s.kind==='handoff').a, mainMapStart = SEQ.find(s=>s.kind==='overview').a;
const goStop = i => { mainCurrent = i; tlCurrent(Math.min(i, STOPS.length - 1), true); if (RM) { if (i < 0) { window.scrollTo({top:(JOIN.heroStart ? mainMapStart : 0)*VIEW.unit,behavior:'instant'}); return; } if (i >= STOPS.length) { $('ft').scrollIntoView({behavior:'auto',block:'start'}); return; } cardsList()[i].el.scrollIntoView({ behavior: 'auto', block: 'start' }); return; } JOURNEY.go(STOPS[i].id, { jump: exploreActive() }); };

tripBuild({ svg: SVG, base: $('map-base'), camBase: $('cam-base'), rest: $('b-rest-detail'), cam: $('cam'), sea: $('b-sea'), fill: $('b-fill'), coastG: $('b-coast'), detail: $('b-detail'), finds: $('finds'), done: $('trail-done'), x: $('fxg'), caption: document.querySelector('.caption'), cue: document.querySelector('.cue'), mini: $('mini') });
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
findsBuild(SVG, $('pop'), $('sheet'), { style: { set opacity(v) { $('b-all').style.opacity = v; $('b-rest').style.opacity = v; const live = $('live-rest'); if (live) live.style.opacity = v; } } }, RM);
// The same six markers move in screen space, so their type never needs to be
// resized and rasterized on every camera frame. No marker is copied.
// Part 17c: 96 px marker svgs, viewBox centred on the map spot, moved by CSS in an HTML layer (no SVG layout per move).
const mainMarkerLayer = document.createElement('div'), MAIN_MARK_R = 48; mainMarkerLayer.className = 'marker-layer';
$('stage').querySelector('.ov').appendChild(mainMarkerLayer);
const mainMarkers = FINDS.filter(f => f.n).map(f => { const el = $('mk-' + f.id), place = document.createElementNS('http://www.w3.org/2000/svg', 'svg'), R = MAIN_MARK_R; place.setAttribute('width', 2 * R); place.setAttribute('height', 2 * R); place.setAttribute('viewBox', `${f.mark[0] - R} ${f.mark[1] - R} ${2 * R} ${2 * R}`); el.dataset.screen = 'true'; place.appendChild(el); mainMarkerLayer.appendChild(place); return { el, place, at: f.mark, transform: '' }; });
// COMB-T: the moved HMC chest's ink remains reachable where numbered marker padding overlaps it.
const mainHmcHit=document.createElement('div');mainHmcHit.className='hmc1-screen-hit find hit';mainHmcHit.dataset.findProxy='hoard-hmc1';mainHmcHit.setAttribute('aria-hidden','true');$('stage').querySelector('.ov').appendChild(mainHmcHit);
for(const type of ['pointerdown','pointermove','pointerup','pointercancel','click'])mainHmcHit.addEventListener(type,e=>{e.stopPropagation();const target=$('f-hoard-hmc1');if(type==='click')target.dispatchEvent(new MouseEvent(type,{bubbles:true,detail:e.detail,clientX:e.clientX,clientY:e.clientY}));else target.dispatchEvent(new PointerEvent(type,{bubbles:true,pointerId:e.pointerId,pointerType:e.pointerType,clientX:e.clientX,clientY:e.clientY,button:e.button,buttons:e.buttons}));});
// L5's moves follow the builds above, which look inside svg#map. The names keep their order (tier 2, tier 1, the subs).
{
  const NS = 'http://www.w3.org/2000/svg', rest = document.createElementNS(NS, 'g'), detail = document.createElementNS(NS, 'g');
  rest.id = 'live-rest'; detail.id = 'live-detail'; rest.appendChild(detail);
  detail.append(...[...$('b-rest-detail').children].filter(el => el.matches('.map-tier2, .map-tier1, .map-subs')));
  $('cam-live').append(rest, $('trail-done'), $('trail-pieces'));
  $('cam-finds').append($('finds'), $('fxg')); $('cam-finds').setAttribute('pointer-events', 'visiblePainted');
}
// COMB-R: retain live objects and original hit groups; only their ink moves to the idle raster.
{
  const NS = 'http://www.w3.org/2000/svg', copies = new Map(), destination = $('cam-anim'); FD.animCopies = [];
  const parent = source => {
    if (!source || /^cam(?:-|$)/.test(source.id)) return destination;
    if (copies.has(source)) return copies.get(source);
    const clone = document.createElementNS(NS, 'g');
    for (const key of ['transform','opacity','style','clip-path','mask']) if (source.hasAttribute(key)) clone.setAttribute(key, source.getAttribute(key));
    const cls = source.getAttribute('class'); if (cls) clone.setAttribute('class', cls.replace(/\bfind\b/g, 'anim-find'));
    if (source.id.startsWith('f-')) clone.dataset.animSource = source.id;
    parent(source.parentElement).appendChild(clone); copies.set(source, clone); FD.animCopies.push({ source, clone }); return clone;
  };
  const rock = document.querySelector('.ls-rock'); rock?.parentElement.append(...rock.querySelectorAll('.hit'));
  const ink = '.bc-glow,.bc-light,.bc-flame,#f-beacon > g > path,#f-beacon > g > rect:not(.hit),.ls-rock,.hd-glint,#f-bits,.yg-rat,.yg-eagle,.rv-a,.rv-b,.rv-gifts,.jg-head,.jg-file,.jf-name,.rs-trace,.wl-rip,.ash-crown-surface,.ash-effects,#hn-rings,#bc-notes,.hm-lift,.hm-spark,.wf-needle,.wf-runes,.wf-arm,.wf-all,.wf-hub';
  for (const node of document.querySelectorAll(ink)) { if (node.closest('#map-anim')) continue; parent(node.parentElement).appendChild(node); }
}
// COMB-S: split the looping ink after its first pose has been placed.
{
  FD.buildIdleLayers=()=>{
    const NS='http://www.w3.org/2000/svg';FD.idleLayers=[];
    const selected=[...document.querySelectorAll('#map-anim .rv-a,#map-anim .rv-b,#map-anim .jg-head,#map-anim .jg-file,#map-anim .jf-name,#map-anim .bc-light,#map-anim .bc-flame,#map-anim .bc-glow,#map-anim .ls-rock,#map-anim .hd-glint,#map-anim .yg-rat,#map-anim .yg-eagle,#map-anim .wl-rip,#map-anim .ash-crown-surface,#map-anim .ash-effects,#map-anim .rs-trace,#map-anim #bc-notes,#map-anim #f-bits')];
    const picked=new Set(selected),roots=[];
    const partition=n=>{if(n.id==='map-anim-cover')return;if(picked.has(n)||!selected.some(s=>n.contains(s)))roots.push(n);else for(const child of [...n.children])partition(child);};
    for(const child of [...$('cam-anim').children])partition(child);
    let previous=$('map-anim');
    for(const[node,i]of roots.map((n,i)=>[n,i])){
      const ancestors=[];for(let p=node.parentElement;p&&p.id!=='cam-anim';p=p.parentElement)ancestors.unshift(p);
      let owner=[...ancestors,node].map(p=>p.dataset.animSource).filter(Boolean).at(-1)?.replace(/^f-/,'');
      if(node.matches('.yg-rat,.yg-eagle,.ash-crown-surface,.ash-effects,.wl-rip'))owner='ash';if(node.id==='bc-notes')owner='beacon';
      const box=findIdleBox(node),pad=node.matches('.jf-name')?64:8;
      const el=document.createElementNS(NS,'svg'),cam=document.createElementNS(NS,'g');el.id='idle-'+i;el.setAttribute('class','map idle-layer');el.setAttribute('data-idle',owner||'bits');el.setAttribute('aria-hidden','true');el.setAttribute('pointer-events','none');el.appendChild(cam);
      const chain=[];let parent=cam;
      for(const source of ancestors){const clone=document.createElementNS(NS,'g');for(const a of source.attributes)if(a.name!=='id')clone.setAttribute(a.name,a.value);parent.appendChild(clone);FD.animCopies.push({source,clone});parent=clone;chain.push(clone);}
      parent.appendChild(node);chain.push(node);previous.after(el);previous=el;
      const q={el,cam,node,owner,actor:FD.list[owner]||FD.list.hoards?.items.find(o=>o.id===owner),chain,box:[box.x-pad,box.y-pad,box.x+box.width+pad,box.y+box.height+pad],time:FD.now,dt:0,running:false,visible:true,bits:node.id==='f-bits',loop:picked.has(node),pad,contentKey:node.childElementCount+'/'+node.textContent};
      el.__jmIdle=q;if(q.trail)node.__jmTrail=q;for(const e of[node,...node.querySelectorAll('*')])e.__jmIdle=q;FD.idleLayers.push(q);
    }
    // S3: one clipped trail SVG avoids a composited surface for every short segment.
    {
      const node=$('trail-pieces'),el=document.createElementNS(NS,'svg'),cam=document.createElementNS(NS,'g');
      el.id='live-piece-0';el.setAttribute('class','map idle-layer live-piece');el.setAttribute('data-idle','trail');el.setAttribute('aria-hidden','true');el.setAttribute('pointer-events','none');el.appendChild(cam);cam.appendChild(node);$('map-live').after(el);
      const box=node.getBBox(),pad=8,pieces=[...node.querySelectorAll('.done-p')].map(node=>({node,u0:+node.dataset.u0,u1:+node.dataset.u1}));
      const q={el,cam,node,chain:[node],box:[box.x-pad,box.y-pad,box.x+box.width+pad,box.y+box.height+pad],time:FD.now,dt:0,running:false,visible:true,loop:false,trailGroup:true,pieces,pad,contentKey:node.childElementCount+'/'+node.textContent};
      el.__jmIdle=q;node.__jmIdle=q;for(const p of pieces){p.node.__jmIdle=q;p.node.__jmTrail=q;}FD.idleLayers.push(q);
    }
    FD.buildIdleLayers=null;
  };
}
function mainPlaceChestHit(st) {
  // Part 17c: only this writes the hit's transform, so the last write is kept instead of read back.
  const h=mainHmcHit.hoard||(mainHmcHit.hoard=FD.list.hoards.items.find(h=>h.id==='hoard-hmc1')),c=st.cam,place='translate('+((h.d.x-19)*c.s+c.tx)+'px,'+((h.d.y-20)*c.s+c.ty)+'px) scale('+c.s+')';
  if(mainHmcHit.placed!==place){mainHmcHit.placed=place;mainHmcHit.style.transform=place;}
  const hitVisible=h.el.tabIndex===0&&MAP_STACK.style.visibility!=='hidden'&&st.handoffT>=COMB.mapFindsIn;
  if(mainHmcHit.hidden===hitVisible)mainHmcHit.hidden=!hitVisible;

}
function mainPlaceMarkers(st) {
  mainPlaceChestHit(st);
  mainMarkers.forEach(m => { const p = toScreen(st, m.at), transform = `translate(${p[0] - MAIN_MARK_R}px,${p[1] - MAIN_MARK_R}px)`; if (m.transform !== transform) { m.transform = transform; m.place.style.transform = transform; } });
  const opacity = String(smooth(.5, 1, st.handoffT) * Number(MAP_STACK.style.opacity || 1)); if (mainMarkerLayer.style.opacity !== opacity) mainMarkerLayer.style.opacity = opacity;
  const visible=Number(opacity)>0&&MAP_STACK.style.visibility!=='hidden'?'visible':'hidden'; if (mainMarkerLayer.style.visibility!==visible) mainMarkerLayer.style.visibility=visible;
}
exploreBuild({ stage: $('stage'), world: FTWORLD, journey: JOURNEY, rm: false });

// Touch padding can overlap at the overview. Resolve it by the nearest drawing
// before either target handles the press; keep native drag/pinch ownership.
let mainTouchPick = null;
window.addEventListener('pointerdown', e => {
  if (!e.isTrusted || e.pointerType !== 'touch') return;
  mainTouchPick = null;
  if (RM || JOURNEY.moving || FD.sheetOwner || !FD.st || FD.st.exploring || e.target.closest?.('.pop,.go,.tl,.tl-count,[data-review]')) return;
  if (e.target.closest?.('.find') && !e.target.closest('.hit')) return;
  const candidates = [...Object.values(FD.list), ...FD.list.hoards.items].filter(o => o.id !== 'hoards' && o.el.tabIndex === 0).map(o => ({ el: o.el, p: toScreen(FD.st, [o.x, o.y]) }));
  if ($('nova-hit').getAttribute('aria-disabled') !== 'true') candidates.push({el:$('nova-hit'),p:toScreen(FD.st,MAP.x)});
  cardsList().filter(c => !c.btn.inert && c.btn.tabIndex === 0).forEach(c => { const p = toScreen(FD.st, MAP.waypoints[c.stop.w]), stone = Math.max(14, Math.min(36, 10 * FD.st.cam.s)); candidates.push({ el: c.btn, p: [p[0], p[1] - stone / 2 - 3] }); });
  const ranked = candidates.map(c => ({ ...c, d: Math.hypot(e.clientX-c.p[0],e.clientY-c.p[1]) })).filter(c => c.d <= COMB.target / 2).sort((a,b) => a.d-b.d);
  const chest = ranked.find(c => c.el.id === 'f-hoard-lennard'), xHit = ranked.find(c => c.el.id === 'nova-hit');
  const near = VIEW.h <= 440 && VIEW.w > 640 && chest && xHit && chest.d < xHit.d ? chest : ranked[0];
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
  $('stage').style.height = h + 'px';
  const stepMode = !RM;
  const room = stepMode ? (phone ? STEPS.nav.bar : STEPS.nav.h + STEPS.nav.gap + 6) : 0;
  tripResize(w, h, RM ? 0 : (phone ? 44 : 56) + room);
  MAP_SVGS.forEach(svg => { svg.setAttribute('width', w); svg.setAttribute('height', h); svg.setAttribute('viewBox', `0 0 ${w} ${h}`); });
  tripMeasureLabels(); starsResize(w, h);
  footerNovaResize(w, h);
  depthResize(w, h);
  if (!RM) cardsResize(stepMode);
  if (FTWORLD) FTWORLD.style.transform = 'none';
  const rule = footerResize();
  tlResize(RM ? null : rule);
  if (!RM) { $('trip').style.height = h + 'px'; exploreResize(); }
  stepsResize(); P = stepsProgress(); dirty = true; mainHeroTidy = false;
  if (RM) still();
  if (JOIN.resize) JOIN.resize(w, h);
}
const OVERVIEW_P = SEQ.find(s => s.kind === 'overview').a + 1;
function still() { const st = tripState(OVERVIEW_P); st.reduced = true; tripApply(st); mainPlaceMarkers(st); starsStill(st); depthFrame(st, 0, 0, [.5, .5], { look: [0, 0], changed: false, fine: false }, true); FIXED = st; }
let FIXED = null;

window.addEventListener('scroll', () => { if (RM) dirty = true; }, { passive: true });
window.addEventListener('jm-explore', () => { dirty = true; });
window.addEventListener('resize', resize);
window.addEventListener('jm-depth', () => { dirty = true; mainHeroTidy = false; depthInvalidate(); if (RM && FIXED) still(); });
const PTR = [.5, .5];
window.addEventListener('pointermove', e => { PTR[0] = e.clientX / VIEW.w; PTR[1] = e.clientY / VIEW.h; findsPointer(e.clientX, e.clientY); }, { passive: true });

let raf = 0, lastP = -1, lastVisited = '', mainTs = null, mainSkyDraw = -Infinity, mainTuning = '', mainTuneN = 0, mainFocus = '', mainKeys = '', mainMapPending = false, mainHeroTidy = false;
function frame(ts) {
  const time = ts / 1000;
  const dt = mainTs === null ? 0 : Math.max(0, Math.min(STEPS.frameMax, (ts - mainTs) / 1000)); mainTs = ts;
  P = stepsFrame(ts);
  if (JOIN.leave) JOIN.leave(P);
  if (RM) { findsFrame(time, FIXED);mainPlaceChestHit(FIXED);tripVeil(FIXED); const jr = JOIN.frame && JOIN.frame(FIXED, true, P); if (jr) starsFrame(0, FIXED, [.5, .5], { ...jr, still: true }); raf = requestAnimationFrame(frame); return; }
  const st = tripState(P); st.frameDt = dt;
  // Under the opaque hero the map's frame is skipped (F2), but only once a full frame has put every map layer in its hero
  // state (shields, cards, footer, mini-map, timeline, explore): after a load or a resize, and after a cut or a glide back
  // to the top, where the map's last frame would otherwise stay drawn over the hero.
  if (JOIN.heroStart && P < mainHeroEnd && mainHeroTidy) {
    const jo=JOIN.frame(st,true,P);
    if(jo!==false)starsFrame(time,st,PTR,jo||{});
    dirty=true;raf=requestAnimationFrame(frame);return;
  }
  const f = stepsFocusNow(); if (f) tripFocus(st, f.view, f.k);
  const explored = exploreApply(st, dt), folded = cardsOverride(st, dt, JOURNEY.moving);
  if (f && f.k > 0) mainCurrent = -1; else if (!JOURNEY.moving && st.settleT >= 1 && !st.exploring) mainCurrent = STOPS.length; else if (!JOURNEY.moving && st.kind === 'hold') mainCurrent = st.i; else if (['hero','handoff','overview'].includes(st.kind)) mainCurrent = JOIN.heroStart && st.P < mainHeroEnd ? -2 : -1;
  st.visiting = JOURNEY.visiting;
  const novaAway = !(st.exploreK > 0) && (st.rushT > 0 || st.blastT > 0);
  if (ROOT.classList.contains('jm-nova-away') !== novaAway) ROOT.classList.toggle('jm-nova-away', novaAway);
  const novaFlashed = st.blastT > 0;
  if (ROOT.classList.contains('jm-nova-flashed') !== novaFlashed) ROOT.classList.toggle('jm-nova-flashed', novaFlashed);
  // Nothing unseen takes the keyboard: the stone marks and the timeline wait for the map's hand-over; the timeline leaves in explore.
  st.focusId = f?.id; if (ROOT.dataset.find !== (f?.id || '')) ROOT.dataset.find = f?.id || '';
  const mapKeys = st.handoffT >= 1 && (st.blastT === 0 || st.exploreK > 0);
  const timelineKeys = mapKeys && st.rushT === 0 && !st.exploring && !(st.exploreK > 0);
  const keys = `${mapKeys}/${timelineKeys}`;
  if (keys !== mainKeys) { mainKeys = keys; $('cards').inert = !mapKeys; TLEL.inert = !timelineKeys; TLEL.tabIndex = timelineKeys ? 0 : -1; TLEL.setAttribute('aria-hidden', !timelineKeys); }
  // Part 17b: live DEPTH/NOVA edits are looked for every 16th frame.
  const focusKey = JSON.stringify(f), tuning = (++mainTuneN & 15) && mainTuning ? mainTuning : JSON.stringify([DEPTH, NOVA]), moved = dirty || explored || folded || mainMapPending || P !== lastP || tuning !== mainTuning || focusKey !== mainFocus;
  mainFocus = focusKey;
  const aim = depthLook(dt, PTR);
  // The X's stroke follows the map's raster scale (st.rasterS, set by tripApply), so a move rewrites it only at a rebase.
  if (moved) { mainMapPending = tripApply(st, f); const xp = toScreen(st, MAP.x); if (st.rushT === 0 && xp[0] >= 0 && xp[0] <= VIEW.w && xp[1] >= 0 && xp[1] <= VIEW.h) { const weight = String(3.6 * Math.min(1, tripXCamera().s / (st.rasterS || st.cam.s))); mainXStrokes.forEach(el => { if (el.getAttribute('stroke-width') !== weight) el.setAttribute('stroke-width', weight); }); } tlFrame(st); footerFrame(st); if (!JOIN.frame && CANVAS.style.opacity !== String(st.dim)) CANVAS.style.opacity = st.dim; lastP = P; mainTuning = tuning; dirty = false; const v = st.visited.join(); if (v !== lastVisited) { lastVisited = v; tripMiniVisited(st); } }
  if (moved) mainPlaceMarkers(st);
  const jo = JOIN.frame ? JOIN.frame(st, moved, P) : undefined;
  depthFrame(st, time, dt, PTR, aim, moved);
  footerMotion(time, dt, st, aim.look, moved);
  const starsChanged = starsTick(dt, st);
  const skyIdle = starsSkyVisible(st) && time - mainSkyDraw >= 1 / DEPTH.idleFps;
  if (jo !== false && (moved || starsChanged || st.handoffT < 1 || jo || aim.changed || skyIdle || st.blastT > 0)) {
    starsFrame(time, st, PTR, { ...(jo || {}), look: aim.look }); mainSkyDraw = time;
  }
  if (st.rushT > 0 && st.settleT < 1 && !RM) { const hit = $('nova-hit'), tab = st.blastT > 0 ? -1 : 0; if (hit.tabIndex !== tab) hit.tabIndex = tab; if (hit.getAttribute('aria-disabled') !== 'false') hit.setAttribute('aria-disabled', 'false'); if (hit.getAttribute('aria-label') !== COMB.novaSay) hit.setAttribute('aria-label', COMB.novaSay); }
  const shown=st.handoffT>=COMB.mapFindsIn,cardVisibility=shown?'':'hidden';
  if($('cards').style.visibility!==cardVisibility)$('cards').style.visibility=cardVisibility;
  if(shown){st.smallMoved=moved;cardsFrame(st, aim.look, PTR);findsFrame(time, st);mainPlaceChestHit(st);}
  tripVeil(st);
  mainHeroTidy = !!JOIN.heroStart && P < mainHeroEnd && !mainMapPending;
  raf = requestAnimationFrame(frame);
}
document.addEventListener('visibilitychange', () => { stepsPause(); mainTs = null; if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else if (!raf) raf = requestAnimationFrame(frame); });
document.fonts?.addEventListener('loadingdone', resize);
const start = () => { if (RM) mainReduced(true, true); resize(); raf = requestAnimationFrame(frame); };
if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();

function mainReduced(on, initial = false) {
  const version=++mainModeVersion; mainHeroTidy = false;
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
