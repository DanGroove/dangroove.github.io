// Shared life, particles, overlays and first-found feedback. No progress mutation.
import { FINDS, FIND_COPY, FIND_PLAY, FIND_TIMING, COPY, EXPLORE, COMB } from './data.mjs';
import { VIEW, toScreen, clamp01, lerp, easeIO, WATER, pointAt, tripVisible, tripCardCover, longshipPoint } from './trip.mjs';
import { findRnd, starPath } from './art.mjs';
import { tlSetCount } from './timeline.mjs';
import { JOURNEY, stepsFocus, stepsRelease, stepsFocusNow } from './steps.mjs';

export const FD = { st: null, now: 0, dt: 0, pointer: [-Infinity, -Infinity], pointerT: -Infinity, found: new Set(), last: null, list: {}, popOwner: null, sheetOwner: null, bits: [], serial: 0, flights: [], flight: null, landed: 0, hover: false, focusId: null, overlayEpoch: 0 };
export const D = s => FD.rm ? Number.EPSILON : s;
export const ease = t => easeIO(clamp01(t));
export const out3 = t => 1 - (1 - clamp01(t)) ** 3;
export const fEsc = s => String(typeof s === 'object' ? s.t : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
export const attr = (el, k, v) => { const layer=FD.idleOnly&&findIdleLayer(el);if(layer&&el!==layer.el&&!layer.visible)return;const text = String(v); if (el.getAttribute(k) !== text) el.setAttribute(k, text); };
// COMB-S: bounded SVGs own idle ink and its paused clocks.
const findIdleLayer = el => el?.__jmIdle || el?.closest?.('svg[data-idle]')?.__jmIdle;
export const findIdleTime = el => { const layer=findIdleLayer(el); return layer ? layer.time : FD.now; };
export const findIdleDelta = el => findIdleLayer(el)?.dt ?? FD.dt;
export const findIdleVisible = el => findIdleLayer(el)?.visible ?? true;
export function findIdleFrame(st,advance=true) {
  const moving=!!(st.gliding||st.exploreMoving),c=st.cam,dpr=globalThis.devicePixelRatio||1;
  for(const q of FD.idleLayers||[]){
    const actor=q.actor,active=actor&&(actor.playing||actor.drag||actor.busy||actor.hearing||FD.sheetOwner===actor||['flight','hear','landing','reel','chase','eating','waking','trace','opening','sheet','closing','sliding','reply','pebble','sounding','echo','pull','lifting','rising','rattling','bouncing'].includes(actor.stage)||q.owner==='wayfinder'&&FD.focusId===q.owner);
    if(q.placed&&!st.smallMoved){
      if(advance){const run=q.visible&&!moving;q.dt=q.loop&&run&&q.running?FD.dt:0;q.time+=q.dt;q.running=run;continue;}
      if(!q.loop&&!active||!q.visible&&!active)continue;
    }
    q.placed=true;
    const contentKey=q.node.childElementCount+'/'+q.node.textContent;
    if(contentKey!==q.contentKey&&!q.bits){q.contentKey=contentKey;const b=q.node.getBBox();q.box=[b.x-q.pad,b.y-q.pad,b.x+b.width+q.pad,b.y+b.height+q.pad];}
    let b=q.box;
    if(q.bits){
      const live=FD.bits.filter(b=>b.live);const extra=[...q.node.children].some(e=>!FD.bits.some(b=>b.el===e)&&+(e.getAttribute('opacity')||1)>0);
      if(!live.length&&!extra){q.visible=false;q.running=false;q.dt=0;findStyle(q.el,'visibility','hidden');findStyle(q.el,'opacity',0);continue;}
      b=extra?[-c.tx/c.s,-c.ty/c.s,(VIEW.w-c.tx)/c.s,(VIEW.h-c.ty)/c.s]:[Math.min(...live.map(b=>b.x))-20,Math.min(...live.map(b=>b.y))-20,Math.max(...live.map(b=>b.x))+20,Math.max(...live.map(b=>b.y))+20];
    }else{
      const chainKey=q.chain.map(e=>e.getAttribute('transform')).join('/');
      if(q.boundsKey===chainKey&&q.boundsBox===q.box)b=q.worldBox;
      else {let m=new DOMMatrix();
      for(const e of q.chain){const t=e.transform?.baseVal;if(t)for(let i=0;i<t.numberOfItems;i++)m=m.multiply(t.getItem(i).matrix);}
      const corners=[[b[0],b[1]],[b[2],b[1]],[b[0],b[3]],[b[2],b[3]]].map(([x,y])=>new DOMPoint(x,y).matrixTransform(m));
      b=[Math.min(...corners.map(p=>p.x)),Math.min(...corners.map(p=>p.y)),Math.max(...corners.map(p=>p.x)),Math.max(...corners.map(p=>p.y))];q.boundsKey=chainKey;q.boundsBox=q.box;q.worldBox=b;}
    }
    const raw=[b[0]*c.s+c.tx,b[1]*c.s+c.ty,b[2]*c.s+c.tx,b[3]*c.s+c.ty];
    const visible=raw[2]>-8&&raw[0]<VIEW.w+8&&raw[3]>-8&&raw[1]<VIEW.h+8;
    q.visible=visible;
    if(advance){const run=visible&&!moving;q.dt=run&&q.running?FD.dt:0;q.time+=q.dt;q.running=run;}
    const shown=String(visible);if(q.el.dataset.idleVisible!==shown)q.el.dataset.idleVisible=shown;
    findStyle(q.el,'visibility',visible?'inherit':'hidden');findStyle(q.el,'opacity',visible?(q.opacity??''):0);
    // An idle CSS stroke animation has the same visibility/movement clock.
    const run=visible&&!moving;if(q.animationRun!==run){q.animationRun=run;for(const a of q.node.getAnimations?.({subtree:true})||[])if(a.id==='jm-idle'){if(run)a.play();else a.pause();}}
    if(!visible)continue;


    const rect=active?[0,0,VIEW.w,VIEW.h]:[Math.max(0,Math.floor(raw[0]*dpr)/dpr),Math.max(0,Math.floor(raw[1]*dpr)/dpr),Math.min(VIEW.w,Math.ceil(raw[2]*dpr)/dpr),Math.min(VIEW.h,Math.ceil(raw[3]*dpr)/dpr)];
    if(rect[2]<=rect[0]||rect[3]<=rect[1])continue;
    const p=q.camera,k=p?c.s/p.s:1,tx=p?c.tx-p.tx*k+q.origin[0]*k:0,ty=p?c.ty-p.ty*k+q.origin[1]*k:0;
    const covers=p&&rect[0]>=tx-.01&&rect[1]>=ty-.01&&rect[2]<=tx+q.width*k+.01&&rect[3]<=ty+q.height*k+.01;
    if(!p||!moving||!covers||k<.8||k>1.25){
      const key=[c.s,c.tx,c.ty,...rect].join('/');
      if(key!==q.key){
        q.key=key;q.camera={...c};q.origin=rect.slice(0,2);q.width=rect[2]-rect[0];q.height=rect[3]-rect[1];
        attr(q.el,'width',q.width);attr(q.el,'height',q.height);findStyle(q.el,'width',q.width+'px');findStyle(q.el,'height',q.height+'px');
        attr(q.cam,'transform','matrix('+c.s.toFixed(4)+' 0 0 '+c.s.toFixed(4)+' '+(+c.tx.toFixed(2)-rect[0])+' '+(+c.ty.toFixed(2)-rect[1])+')');
      }
    }
    const v=q.camera,scale=c.s/v.s;
    findStyle(q.el,'transform','matrix('+scale+',0,0,'+scale+','+(c.tx-v.tx*scale+q.origin[0]*scale)+','+(c.ty-v.ty*scale+q.origin[1]*scale)+')');
    if(q.trailGroup)for(const p of q.pieces){const full=st.exploreK||st.u>=p.u1,hidden=!full&&st.u<=p.u0,s=q.camera.s;findStyle(p.node,'opacity',hidden?'0':'');findStyle(p.node,'strokeDasharray',full||hidden?'none':((st.u-p.u0)*s).toFixed(1)+' '+((p.u1-p.u0)*s+20).toFixed(1));}
    q.screenBox=[...q.origin,q.width,q.height];
  }
}
const findStyleWrites = new WeakMap();
export function findStyle(el, key, value) {
  const layer=FD.idleOnly&&findIdleLayer(el);if(layer&&el!==layer.el&&!layer.visible)return;
  const text = String(value), cache = findStyleWrites.get(el) || {}, old = cache[key];
  // A --name property goes through setProperty and getPropertyValue.
  const custom = key.startsWith('--'), read = () => custom ? el.style.getPropertyValue?.(key) ?? el.style[key] : el.style[key];
  if (old?.text === text && read() === old.value) return;
  if (custom) el.style.setProperty(key, text); else el.style[key] = value;
  cache[key] = { text, value: read() }; findStyleWrites.set(el, cache);
}

// Explore touch intent is shared by every pointerdown find. Nothing acts or captures
// until tap/hold/owned-drag intent is known; a second finger cancels the whole wait.
const findPointers = new Map();
export function findPointerCancel() {
  for (const p of findPointers.values()) { clearTimeout(p.timer); p.cancel?.(); p.el._dragged = false; }
  findPointers.clear();
}
export function findPointerMove(e) {
  const p = findPointers.get(e.pointerId);
  if (!p || p.active || Math.hypot(e.clientX - p.e.clientX, e.clientY - p.e.clientY) <= EXPLORE.slop) return false;
  clearTimeout(p.timer);
  if (p.drag) { p.active = true; p.start(p.e); }
  else { findPointers.delete(e.pointerId); p.el._dragged = false; return true; }
  return false;
}
export function findPointer(el, start, { drag = false, tap = null, cancel = null } = {}) {
  el.addEventListener('pointerdown', e => {
    if (FD.rm || !FD.st?.exploring || e.pointerType !== 'touch') { start(e); return; }
    el._dragged = false;
    const p = { el, start, drag, cancel, e, active: false };
    p.timer = setTimeout(() => { if (findPointers.get(e.pointerId) !== p) return; p.active = true; start(e); }, EXPLORE.pressWait);
    findPointers.set(e.pointerId, p);
  });
  el.addEventListener('pointermove', findPointerMove);
  const release = e => {
    const p = findPointers.get(e.pointerId); if (!p || p.el !== el) return;
    clearTimeout(p.timer); findPointers.delete(e.pointerId);
    if (!p.active && e.type === 'pointerup' && Math.hypot(e.clientX - p.e.clientX, e.clientY - p.e.clientY) <= EXPLORE.slop) {
      tap?.(e);
      el._dragged = true;
    }
    cancel?.();
  };
  el.addEventListener('pointerup', release); el.addEventListener('pointercancel', release);
}
export const toMap = p => [(p[0] - FD.st.cam.tx) / FD.st.cam.s, (p[1] - FD.st.cam.ty - (FD.rm ? VIEW.stageTop : 0)) / FD.st.cam.s];
export const findScreen = p => { const at = toScreen(FD.st,p); if (FD.rm) at[1] += VIEW.stageTop; return at; };
export const FIND_BY = Object.fromEntries(FINDS.map(f => [f.id, f]));
export const findRandom = findRnd;
export const findReady = id => {
  if (FD.rm || FD.st?.exploring) return true;
  const f = stepsFocusNow();
  return JOURNEY.mode === 'steps' && JOURNEY.focus === id && f?.id === id && f.k === 1 && f.swapped;
};
// All delayed find actions share the same arrival gate.
export function findWhenReady(owner, action) {
  if (findReady(owner.id)) { action(); return; }
  FD.readyAction = { owner, action, epoch: FD.overlayEpoch };
}
export const findRange = pair => lerp(pair[0], pair[1], findRandom());
export const findFormat = (s, values) => s.replace(/\{(\w+)\}/g, (m, k) => values[k]);
export const findAngleDelta = (a, b) => ((b - a + FIND_PLAY.kit.deg) % FIND_PLAY.kit.turn + FIND_PLAY.kit.turn) % FIND_PLAY.kit.turn - FIND_PLAY.kit.deg;
export const findSvg = (tag, attributes = {}) => { const el = document.createElementNS('http://www.w3.org/2000/svg', tag); Object.entries(attributes).forEach(([k, v]) => attr(el, k, v)); return el; };
export const findSlot = line => typeof line === 'object' && line.todo ? `<div class="find-slot"><span class="pop-k">${fEsc(COPY.todo)}</span><p>${fEsc(line)}</p></div>` : `<p class="pop-t">${fEsc(line)}</p>`;
export const findPlace = id => {
  const h = FIND_COPY.hoards.find(d => d.id === id); if (h) return [h.x, h.y];
  if (id === 'longship' && FD.st) return longshipPoint(FD.st.u);
  const f = FD.list[id], d = FIND_BY[id]; return f?.place ? f.place() : d ? [d.x, d.y] : null;
};
export const findView = id => {
  const p = findPlace(id), delta = id.startsWith('hoard') ? FIND_PLAY.focus.chest : id === 'longship' ? FIND_PLAY.focus.ship : null;
  if (delta) return [p[0] + delta[0], p[1] + delta[1], delta[2]];
  const d = FIND_BY[id]; return VIEW.phone && d.viewPhone ? d.viewPhone : d.view; // a find may give a narrow screen a view of its own
};
export function attend(find, reach) {
  if (!FD.st) return null;
  if (FD.hover && FD.now - FD.pointerT <= FIND_PLAY.fresh) { const p = toMap(FD.pointer); if (Math.hypot(p[0] - find.x, p[1] - find.y) <= reach) return p; }
  const p = FD.st.trav; return p && Math.hypot(p[0] - find.x, p[1] - find.y) <= 2 * reach ? p : null;
}
export function findLife(o, x, y, rad, reach = rad) {
  o.x = x; o.y = y; o.rad = rad;
  const p = toScreen(FD.st, [x, y]), edge = rad * FD.st.cam.s + FIND_PLAY.kit.margin;
  o.onScreen = p[0] >= -edge && p[0] <= VIEW.w + edge && p[1] >= -edge && p[1] <= VIEW.h + edge;
  const pointer = FD.hover && FD.now - FD.pointerT <= FIND_PLAY.fresh ? toMap(FD.pointer) : null;
  o.awake = JOURNEY.focus === o.id || document.activeElement === o.el || !!(pointer && Math.hypot(pointer[0] - x, pointer[1] - y) <= reach);
  o.kept ??= false;
  if (o.id === 'hoards') { if (o.el.tabIndex !== -1) o.el.tabIndex = -1; attr(o.el,'aria-hidden',false); return; }
  // Only a find on screen after the hand-over is in the tab order; the focused one keeps its place.
  const hit = COMB.target / FD.st.cam.s, box = [x - hit / 2, y - hit / 2, x + hit / 2, y + hit / 2];
  const covered = tripCardCover(FD.st, box), seen = tripVisible(FD.st, box);
  const tab = o.id !== 'hoards' && (seen && covered < .05) ? 0 : -1;
  if (o.el && o.el.tabIndex !== tab) o.el.tabIndex = tab;
  if (o.el) {
    attr(o.el, 'aria-hidden', !seen || covered >= .95);
    // Through --jm-find (map.css): an opacity fade would give the find a layer of its own.
    findStyle(o.el, '--jm-find', 1 - covered);
    if (o.cover !== covered) { o.cover = covered; findStyle(o.el, 'visibility', covered >= .995 ? 'hidden' : ''); }
    if (o.hit) { attr(o.hit, 'cx', x); attr(o.hit, 'cy', y); }
    if (o.focusRing) { attr(o.focusRing, 'cx', x); attr(o.focusRing, 'cy', y); attr(o.focusRing, 'r', Math.min(rad, 50)); }
  }
}
export function found(id, atId = id) {
  if (FD.found.has(id)) return;
  FD.found.add(id); (FD.svg.querySelector('#mk-' + id) || document.getElementById('mk-' + id))?.classList.add('found');
  if (FD.rm) { FD.landed = FD.found.size; findLandCount(); return; }
  FD.flights.push({ id: atId, number: FD.found.size }); findStartFlight();
}
function findLandCount() { tlSetCount(FD.landed, FINDS.length); if (FD.landed === FINDS.length) FD.allPending = true; }
function findStartFlight() {
  if (FD.flight || FD.flightWaiting || !FD.flights.length) return;
  const moving = FD.count.getAnimations?.().filter(a => a.transitionProperty === 'translate') || [];
  if (moving.length) { FD.flightWaiting = true; Promise.all(moving.map(a => a.finished.catch(() => {}))).then(() => { FD.flightWaiting = false; findStartFlight(); }); return; }
  const next = FD.flights.shift(), box = FD.count.getBoundingClientRect();
  FD.flight = { ...next, from: toScreen(FD.st, findPlace(next.id)), to: [box.left + box.width / 2, box.top + box.height / 2], ts: FD.now };
}
export function opened(o) { o.overlayEpoch = FD.overlayEpoch; if (o.id !== 'well') FD.last = o; }
export const press = (el, fn) => {
  el.addEventListener('click', e => { if (el._dragged) { el._dragged = false; return; } fn(e); });
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(e); } });
};
export function showPop(owner, anchor, html, cls = '', side = 'auto') {
  if (owner.overlayEpoch !== undefined && owner.overlayEpoch !== FD.overlayEpoch) return false;
  closePop(); FD.popOwner = owner; FD.popAnchor = anchor; FD.popSide = side; FD.popP = FD.st.P; FD.popTs = FD.now;
  FD.pop.className = 'pop on ' + cls;
  FD.pop.innerHTML = `<div class="pop-in"><div class="pop-body">${html}</div><i class="pop-tail" aria-hidden="true"></i></div>`;
  FD.popInner = FD.pop.firstElementChild; FD.popTail = FD.pop.querySelector('.pop-tail'); FD.popBody = FD.pop.querySelector('.pop-body');
  const box = FD.popInner.getBoundingClientRect(); FD.popSize = [box.width, box.height];
  // Measure drawing ink once at open. Project its map-space box through the
  // existing camera each frame; never read layout during a pan or zoom.
  const inkSelector='.hd-chest,.hn-horn,.jg-head,.rv-tree,.ls-rock';
  const ink=owner.el?.querySelector(inkSelector)||[...document.querySelectorAll('[data-anim-source="'+owner.el?.id+'"]')].map(g=>g.querySelector(inkSelector)).find(Boolean)||owner.el;
  const inkCam=ink?.closest?.('svg')?.querySelector('[id^="cam"]')||FD.svg.querySelector('#cam');
  FD.popBox = null;FD.popShape=null;
  if (ink?.getBBox && ink.getCTM?.()) {
    const b = ink.getBBox(), matrix = inkCam.getCTM().inverse().multiply(ink.getCTM());
    const points = [[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]].map(([x,y])=>[matrix.a*x+matrix.c*y+matrix.e,matrix.b*x+matrix.d*y+matrix.f]);
    FD.popBox = [Math.min(...points.map(p=>p[0])),Math.min(...points.map(p=>p[1])),Math.max(...points.map(p=>p[0])),Math.max(...points.map(p=>p[1]))];
    // The raised horn turns, so the corners of its box reach far past the drawing: sample its outline once here instead.
    if(owner.id==='horn'){const pts=[];ink.querySelectorAll('path').forEach(p=>{const L=p.getTotalLength?.()||0,n=Math.max(8,Math.ceil(L));if(L>0)for(let i=0;i<=n;i++){const q=p.getPointAtLength(L*i/n);pts.push([q.x,q.y]);}});FD.popShape={b,pts,matrix:inkCam.getCTM().inverse().multiply(ink.parentElement.getCTM())};}
  }
  // A popup stays clear of the step buttons and the timeline: their boxes are read once here, when it opens, never in the
  // frame loop. A bar in the bottom half is a floor; a bar in the top half (the end and explore bar on a computer) is a ceiling.
  const controls=document.querySelector('.jm-review'), bars=[...document.querySelectorAll('.go:not([hidden]), .tl, .jm-focus .find-hint:not(.explore-hint)')].map(e => e.getBoundingClientRect()).filter(r => r.height > 0), low=r=>r.top+r.height/2>=VIEW.h/2;
  FD.popCeiling=Math.max(48,controls?.getBoundingClientRect().bottom+8||0,...bars.filter(r=>!low(r)).map(r=>r.bottom+8));
  FD.popFloor = Math.min(VIEW.h, ...bars.filter(low).map(r => r.top));
  FD.popOrigin=[box.width/2,box.height];placePop();
  FD.popInner.style.transformOrigin = `${FD.popOrigin[0]}px ${FD.popOrigin[1]}px`;
  return true;
}
export function closePop() {
  const o = FD.popOwner; if (!o) return;
  const inner = FD.popInner, focused = FD.pop.contains(document.activeElement);
  FD.popOwner = null;
  // Move the same outgoing popup into its own anchored wrapper. Its completion
  // only removes that wrapper, never the popup that may have replaced it.
  const exit = document.createElement('div'); exit.className = FD.pop.className + ' pop-exit'; exit.style.transform = FD.pop.style.transform;
  FD.pop.after?.(exit); if (inner) exit.appendChild(inner); exit.inert = true;
  FD.pop.className = 'pop';
  if (FD.rm) exit.remove?.();
  else { const a = inner?.animate?.([{ transform: inner.style.transform, opacity: 1 }, { transform: `scale(${FIND_PLAY.kit.popup.scale})`, opacity: 0 }], { duration: COMB.popClose * 1000, easing: 'ease-in', fill: 'forwards' }); if (a) a.onfinish = () => exit.remove?.(); }
  if (o.onPopClose) o.onPopClose();
  if (focused) setTimeout(() => { const a=document.activeElement; if (!FD.popOwner && (a===document.body || exit.contains?.(a))) findReturnFocus(o); }, 0);
}
function findReturnFocus(owner) {
  let target=owner.el;
  const returning=!JOURNEY.focus && stepsFocusNow();
  if (JOURNEY.moving || returning) { const nova=FD.st?.kind==='rush' || FD.st?.blastT>0 && FD.st?.settleT<1; target=nova ? document.getElementById?.('nova-hit') : document.querySelector?.(returning&&!JOURNEY.moving || JOURNEY.direction==='back' ? '.go-back' : '.go-next'); }
  else if (!findOwnerVisible(owner)) target=document.getElementById?.('tl');
  if (target && !target.inert) target.focus({preventScroll:true});
}
function findOwnerVisible(owner) { const p=findPlace(owner.id), r=COMB.target/(2*FD.st.cam.s); return !!p && tripVisible(FD.st,[p[0]-r,p[1]-r,p[0]+r,p[1]+r]); }
export function placePop() {
  if (!FD.popOwner) return;
  const K = FIND_PLAY.kit.popup, anchor = typeof FD.popAnchor === 'function' ? FD.popAnchor() : FD.popAnchor, p = findScreen(anchor), [w, h] = FD.popSize;
  const q = FD.rm ? 1 : clamp01((FD.now - FD.popTs) / K.time), back = 1 + (K.over - 1) / (1 - K.scale);
  const v = 1 + (back + 1) * (q - 1) ** 3 + back * (q - 1) ** 2;
  findStyle(FD.popInner, 'transform', `scale(${lerp(K.scale, 1, q === 1 ? 1 : v)})`); findStyle(FD.popBody, 'opacity', q);
  let worldBox=FD.popBox;
  if(FD.popShape&&FD.popOwner.popPose){const {b,pts,matrix:m}=FD.popShape,[tx,ty,angle,s]=FD.popOwner.popPose,[px,py]=FIND_PLAY.horn.pivot,c=Math.cos(angle*Math.PI/180),sn=Math.sin(angle*Math.PI/180),points=(pts?.length?pts:[[b.x,b.y],[b.x+b.width,b.y],[b.x,b.y+b.height],[b.x+b.width,b.y+b.height]]).map(([x,y])=>{const u=x*s-px,v=y*s-py,X=tx+px+c*u-sn*v,Y=ty+py+sn*u+c*v;return[m.a*X+m.c*Y+m.e,m.b*X+m.d*Y+m.f];});worldBox=[Math.min(...points.map(p=>p[0])),Math.min(...points.map(p=>p[1])),Math.max(...points.map(p=>p[0])),Math.max(...points.map(p=>p[1]))];}
  const a = worldBox ? findScreen(worldBox.slice(0,2)) : p, b = worldBox ? findScreen(worldBox.slice(2)) : p;
  const gap = K.anchorGap, ceiling = FD.popCeiling ?? K.edge, floor = (FD.popFloor ?? VIEW.h) - K.edge;
  const cx = (a[0]+b[0])/2, cy = (a[1]+b[1])/2;
  const across = Math.max(K.edge,Math.min(VIEW.w-w-K.edge,cx-w/2)), down = Math.max(ceiling,Math.min(floor-h,cy-h/2));
  const options = [[across,a[1]-gap-h,'above'],[b[0]+gap,down,'right'],[a[0]-gap-w,down,'left'],[across,b[1]+gap,'below']];
  const visible=b[0]>0&&a[0]<VIEW.w&&b[1]>0&&a[1]<VIEW.h;
  const at = visible&&options.find(([x,y])=>x>=K.edge&&x+w<=VIEW.w-K.edge&&y>=ceiling&&y+h<=floor&&Math.hypot(Math.max(x-b[0],a[0]-x-w,0),Math.max(y-b[1],a[1]-y-h,0))<=K.anchorMax);
  findStyle(FD.pop,'visibility',at?'visible':'hidden');
  if (!at) return;
  const [x,y,side] = at, below = side === 'below';
  const aim = side === 'above' || below ? [Math.max(a[0],Math.min(b[0],x+w/2)),below?a[1]:b[1]] : [side==='right'?b[0]:a[0],Math.max(a[1],Math.min(b[1],y+h/2))];
  FD.popOrigin = [Math.max(0,Math.min(w,aim[0]-x)),Math.max(0,Math.min(h,aim[1]-y))];
  if(FD.pop.dataset.side!==side)FD.pop.dataset.side=side;
  findStyle(FD.pop, 'transform', `translate(${x}px,${y}px)`);
  const tx = side==='right'?-K.tail[1]:side==='left'?w:Math.max(0,Math.min(w-K.tail[0],aim[0]-x-K.tail[0]/2));
  const ty = side==='above'?h:below?-K.tail[1]:Math.max(0,Math.min(h-K.tail[0],aim[1]-y-K.tail[0]/2));
  findStyle(FD.popTail,'width',(side==='left'||side==='right'?K.tail[1]:K.tail[0])+'px');
  findStyle(FD.popTail,'height',(side==='left'||side==='right'?K.tail[0]:K.tail[1])+'px');
  findStyle(FD.popTail,'clipPath',side==='right'?'polygon(100% 0,100% 100%,0 50%)':side==='left'?'polygon(0 0,100% 50%,0 100%)':below?'polygon(0 100%,50% 0,100% 100%)':'polygon(0 0,100% 0,50% 100%)');
  findStyle(FD.popTail, 'transform', `translate(${tx}px,${ty}px)`);
}
function findSheetBars() {
  const tl = document.getElementById('tl');
  if (tl) tl.inert = !!FD.sheetOwner && VIEW.h <= 440 && VIEW.w > 640;
}
export function findSheet(owner, cls, html, anchor) {
  if (owner.overlayEpoch !== undefined && owner.overlayEpoch !== FD.overlayEpoch) return false;
  if (findSheetReopen(owner)) return true;
  if (FD.sheetOwner) return false;
  closePop();
  FD.sheetOwner = owner; FD.sheetP = FD.st.P; FD.sheetFrom = findScreen(anchor); FD.sheetTs = FD.now;
  FD.sheetAnchor = anchor;
  FD.sheetK = FD.rm ? 1 : 0; FD.sheetClosing = false; FD.sheetMotion = { from: FD.sheetK, to: 1, ts: FD.now, duration: FIND_PLAY.kit.sheet.grow };
  // The first frame grows from the find, never the last sheet's full size (a one-frame flash on Dan's phone, 2026-11-24)
  if (!FD.rm) FD.sheet.style.transform = `translate(${FD.sheetFrom[0]}px,${FD.sheetFrom[1]}px) scale(${FIND_PLAY.kit.sheet.from})`;
  FD.sheet.className = 'sheet on ' + cls; FD.sheet.innerHTML = html; FD.sheet.inert = !FD.rm;
  document.documentElement.classList.add('jm-sheet-open'); findSheetBars();
  FD.dismiss.hidden = false; FD.dismiss.setAttribute('aria-label', COPY.close + ': ' + FIND_BY[owner.id].label.split('. ')[0]);
  FD.sheet.setAttribute('aria-owns', 'sheet-dismiss');
  FD.sheet.setAttribute('aria-label', FIND_BY[owner.id].label); FD.sheet.tabIndex = -1;
  const target = FD.rm ? FD.sheet.querySelector('button:not([hidden])') || FD.sheet : FD.dismiss; target.focus({ preventScroll: true });
  return true;
}
function findSheetReopen(owner) {
  if (FD.sheetOwner !== owner || !FD.sheetClosing) return false;
  FD.sheetClosing = false; FD.sheetMotion = { from: FD.sheetK, to: 1, ts: FD.now, duration: FIND_PLAY.kit.sheet.grow };
  owner.onSheetReopen?.(); return true;
}
export function closeSheet(force = false) {
  const o = FD.sheetOwner; if (!o) return;
  if (!FD.rm) { if (!FD.sheetClosing) { FD.sheetClosing = true; FD.sheetMotion = { from: FD.sheetK, to: 0, ts: FD.now, duration: COMB.sheetClose }; } return; }
  findSheetDone(o);
}
function findSheetDone(o) {
  if (FD.sheetOwner !== o) return;
  const active=document.activeElement, restore=active===document.body || active===FD.dismiss || FD.sheet.contains?.(active);
  FD.sheetOwner = null; FD.sheet.className = 'sheet'; FD.sheet.innerHTML = '';
  FD.dismiss.hidden = true;
  document.documentElement.classList.remove('jm-sheet-open'); findSheetBars();
  if (o.onSheetClose) o.onSheetClose(); if (restore) findReturnFocus(o);
}
export function findSheetFrame(owner, fit, y = VIEW.h / 2, iris = null, irisIn = null) {
  if (FD.sheetOwner !== owner) return 0;
  const m = FD.sheetMotion, q = FD.rm ? 1 : clamp01((FD.now - m.ts) / m.duration);
  FD.sheetK = lerp(m.from, m.to, easeIO(q));
  const k = FD.sheetK, from = FD.sheetClosing ? findScreen(FD.sheetAnchor) : FD.sheetFrom;
  if (FD.sheet.inert !== (k < .96)) FD.sheet.inert = k < .96;
  if (FD.sheetFit !== fit) { FD.sheetFit = fit; FD.sheet.style.setProperty('--sheet-unit', 1 / fit); }
  findStyle(FD.sheet, 'transform', `translate(${lerp(from[0], VIEW.w / 2, k)}px,${lerp(from[1], y, k)}px) scale(${lerp(FIND_PLAY.kit.sheet.from, fit, k)})`);
  if (iris) { const v = Math.max(Number.EPSILON, k); findStyle(iris, 'transform', `scale(${v})`); findStyle(irisIn, 'transform', `scale(${1 / v})`); }
  if (m.to === 0 && q === 1) queueMicrotask(() => { if (FD.sheetClosing && FD.sheetMotion === m) findSheetDone(owner); });
  return k;
}
export function findBits(kind, x, y, n, options = {}) {
  if (FD.rm) return;
  const B = FIND_PLAY.bits, v = { ...B.base, ...options };
  for (let i = 0; i < n; i++) {
    const bit = FD.bits.find(b => !b.live) || FD.bits.reduce((a, b) => a.serial < b.serial ? a : b);
    const [path, cls] = kind === 'star' ? [starPath(0, 0, B.starSize), 'pf'] : B.kinds[kind];
    const angle = findRange(v.dir) * Math.PI / FIND_PLAY.kit.deg, speed = findRange(v.speed);
    Object.assign(bit, { live: true, idle: !!FD.idleOnly, owner: FD.currentFind, serial: FD.serial++, x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, age: 0, life: findRange(v.life), spin: v.spin, g: v.g, drag: v.drag, size: v.size, alpha: kind === 'puff' ? Math.min(B.puffAlpha, v.alpha) : v.alpha, kind });
    attr(bit.el, 'd', path); attr(bit.el, 'class', cls); bit.el.style.display = ''; if (['star', 'drop', 'puff', 'wisp'].includes(kind)) bit.el.style.stroke = 'none'; else bit.el.style.stroke = '';
    attr(bit.el, 'transform', `translate(${x} ${y}) scale(${v.size[0]})`); attr(bit.el, 'opacity', bit.alpha);
  }
}
export function findKitBuild(svg, pop, sheet, base, rm) {
  Object.assign(FD, { svg, pop, sheet, base, rm, hover: matchMedia('(hover: hover)').matches, count: document.querySelector('.tl-count') });
  const pool = findSvg('g', { id: 'f-bits', 'pointer-events': 'none' }); svg.querySelector('#finds').appendChild(pool);
  FD.hint = document.createElement('p'); FD.hint.className = 'find-hint'; FD.hint.setAttribute('aria-hidden', 'true'); (document.getElementById('go')?.parentElement || document.body).appendChild(FD.hint);
  for (let i = 0; i < FIND_PLAY.bits.pool; i++) { const el = findSvg('path'); el.style.display = 'none'; pool.appendChild(el); FD.bits.push({ el, live: false, serial: -1 }); }
  FD.star = document.createElement('div'); FD.star.className = 'find-star'; FD.star.setAttribute('aria-hidden', 'true');
  FD.star.innerHTML = `<svg viewBox="-1 -1 2 2"><path d="${starPath(0, 0, 1)}"/></svg>`; pop.parentElement.appendChild(FD.star);
  FD.dismiss = document.createElement('button'); FD.dismiss.id = 'sheet-dismiss'; FD.dismiss.className = 'sheet-dismiss'; FD.dismiss.type = 'button'; FD.dismiss.textContent = COPY.close; FD.dismiss.hidden = true; sheet.after?.(FD.dismiss); FD.dismiss.addEventListener('click', () => closeSheet());
  findKitStyle(); window.addEventListener('resize', () => requestAnimationFrame(findSheetBars));
  // an open sheet keeps Tab and Shift+Tab inside it (B-4)
  sheet.addEventListener('keydown', e => {
    if (e.key === 'Tab' && FD.sheetOwner) { const f = [...sheet.querySelectorAll('button:not([hidden]):not([disabled]),[tabindex="0"]'), FD.dismiss], i = f.indexOf(document.activeElement); if (!f.length || (e.shiftKey ? i <= 0 : i === f.length - 1)) { e.preventDefault(); f.at(e.shiftKey ? -1 : 0)?.focus(); } return; }
    if (e.key === 'Escape' || FD.sheetOwner?.id === 'hammer') return;
    e.stopPropagation(); if (!['Enter', ' '].includes(e.key) || !e.target.closest?.('button')) e.preventDefault(); });
  sheet.addEventListener('wheel', e => { e.preventDefault(); e.stopPropagation(); }, { passive: false });
  document.addEventListener('keydown', e => { if (e.key !== 'Escape') return; if (FD.popOwner || FD.sheetOwner) { e.preventDefault(); closePop(); closeSheet(); } else if (stepsRelease(true)) e.preventDefault(); });
  // A popup closes on a press anywhere but a find (a find opens its own popup or keeps it) or a control inside the popup.
  // On a phone in explore a popup can sit over the other chests, and there is no Escape key to close it.
  document.addEventListener('pointerdown', e => { if (FD.sheetOwner && !FD.sheet.contains(e.target) && e.target !== FD.dismiss) closeSheet(); if (!FD.popOwner) return; const t = e.target?.closest ? e.target : null; if (t && (t.closest('.find') || t.closest('.pop button, .pop a'))) return; closePop(); }, true);
  window.addEventListener('keydown', e => { if (!FD.sheetOwner || FD.sheet.contains(e.target)) return; if (e.key === 'Escape') { e.preventDefault(); closeSheet(); } else if (e.key === 'Tab') { e.preventDefault(); const items = [...FD.sheet.querySelectorAll('button:not([hidden]):not([disabled]),[tabindex="0"]')].filter(el => !el.getClientRects || el.getClientRects().length); items.at(e.shiftKey ? -1 : 0)?.focus(); } else if (e.target !== FD.dismiss || !['Enter',' '].includes(e.key)) e.preventDefault(); e.stopImmediatePropagation(); }, true);
  matchMedia('(hover: hover)').addEventListener('change', e => FD.hover = e.matches);
  FD.say = document.createElement('p'); FD.say.className = 'sr'; FD.say.setAttribute('role', 'status'); pop.after?.(FD.say);
  tlSetCount(0, FINDS.length);
}
export function findKitStyle() {
  const P = FIND_PLAY, root = document.documentElement;
  const vars = { 'find-pop-edge': P.kit.popup.edge + 'px', 'find-pop-w': P.kit.popup.width + 'px', 'find-pop-r': P.kit.popup.radius + 'px', 'find-pop-pad': P.kit.popup.pad.map(n => n + 'px').join(' '), 'find-pop-font': P.kit.popup.font + 'px', 'find-pop-line': P.kit.popup.line, 'find-kicker': P.kit.popup.kicker + 'px', 'find-gap': P.kit.popup.gap + 'px', 'find-tail-w': P.kit.popup.tail[0] + 'px', 'find-tail-h': P.kit.popup.tail[1] + 'px', 'find-slot-weight': P.kit.slot.weight, 'find-star-z': P.kit.starZ, 'find-slot-font': P.kit.slot.font + 'px', 'find-slot-rule': P.kit.slot.border + 'px', 'find-slot-pad': P.kit.slot.pad + 'px', 'find-star': P.star.size + 'px', 'find-piece': P.hoard.width + 'px', 'find-piece-top': P.hoard.top + 'px', 'find-icon': P.hoard.icon + 'px', 'find-arm': P.way.armWidth + 'px', 'find-rune-flip': P.rune.flipTime + 's', 'find-rune-w': P.rune.width + 'px', 'find-rune-h': P.rune.height + 'px', 'find-rune-perspective': P.rune.perspective + 'px', 'find-ctl-top': P.rune.controlTop + 'px', 'find-reel-w': P.raven.reel.width + 'px', 'find-iris': P.raven.reel.iris + 'px', 'find-reel-label': P.raven.reel.labelTop + 'px', 'find-reel-slot': P.raven.reel.slotBottom + 'px' };
  Object.entries(vars).forEach(([k, v]) => root.style.setProperty('--' + k, v));
}
export function findKitFrame() {
  const dt = FD.dt;

  FD.bits.forEach(b => {
    if (!b.live) return;
    if(b.idle){const c=FD.st.cam,x=b.x*c.s+c.tx,y=b.y*c.s+c.ty;if(FD.st.gliding||FD.st.exploreMoving||x < -8||x > VIEW.w+8||y < -8||y > VIEW.h+8)return;}
    b.age += dt;
    if (b.age >= b.life) { b.live = false; attr(b.el, 'opacity', 0); queueMicrotask(() => { if (!b.live) b.el.style.display = 'none'; }); return; }
    b.vy += b.g * dt; b.vx *= Math.max(0, 1 - b.drag * dt); b.vy *= Math.max(0, 1 - b.drag * dt); b.x += b.vx * dt; b.y += b.vy * dt;
    const q = b.age / b.life;
    attr(b.el, 'transform', `translate(${b.x} ${b.y}) rotate(${b.spin * b.age}) scale(${lerp(b.size[0], b.size[1], q)})`); attr(b.el, 'opacity', b.alpha * (1 - q ** 2));
  });
  const f = FD.flight;
  if (f) {
    const q = clamp01((FD.now - f.ts) / FIND_PLAY.star.time), k = ease(q);
    findStyle(FD.star, 'opacity', 1); findStyle(FD.star, 'transform', `translate(${lerp(f.from[0], f.to[0], k)}px,${lerp(f.from[1], f.to[1], k) - FIND_PLAY.star.arc * Math.sin(Math.PI * q)}px)`);
    if (q === 1) { FD.landed = f.number; FD.bump = FD.now; FD.flight = null; FD.star.style.opacity = 0; queueMicrotask(() => { findLandCount(); findStartFlight(); }); }
  }
  if (FD.bump !== undefined) { const q = clamp01((FD.now - FD.bump) / FIND_PLAY.star.bump); FD.count.style.transform = `scale(${lerp(FIND_PLAY.star.peak, 1, ease(q))})`; if (q === 1) FD.bump = undefined; }
  placePop();
  if (FD.popOwner && Math.abs(FD.st.P - FD.popP) > FIND_TIMING.closeScroll) closePop();
  if (FD.sheetOwner && Math.abs(FD.st.P - FD.sheetP) > FIND_TIMING.closeScroll) closeSheet();
  if (FD.rm && FD.popOwner && !findOwnerVisible(FD.popOwner)) closePop();
  if (FD.rm && FD.sheetOwner && !findOwnerVisible(FD.sheetOwner)) closeSheet();
  const ready = FD.readyAction;
  if (ready && findReady(ready.owner.id)) { FD.readyAction = null; if (ready.epoch === FD.overlayEpoch) queueMicrotask(ready.action); }
  if (FD.pendingPress && !JOURNEY.moving) { const el = FD.pendingPress; FD.pendingPress = null; queueMicrotask(() => { const dragged = el._dragged; el._dragged = false; el.dispatchEvent(new MouseEvent('click', { bubbles: true })); if (dragged) el._dragged = true; }); }
  if (FD.allPending && !FD.popOwner && !FD.sheetOwner && !JOURNEY.focus && !JOURNEY.moving && (FD.rm || !Object.values(FD.list).some(o => o.playing))) { FD.allPending = false; FD.all?.start(); }
}
// The hint line keeps its words while it fades out, so it changes only when a find takes the camera.
export function findHint(id) { if (FD.hint && id) FD.hint.textContent = id === 'horn' ? COMB.hornHints[FD.list.horn?.stage === 'raised' ? 1 : ['sounding','echo'].includes(FD.list.horn?.stage) ? 2 : 0] : FD.list.hoards?.items.find(h => h.id === id)?.hintLine || FIND_COPY.hints[id.startsWith('hoard') ? 'hoards' : id] || ''; }
let findPress = null;
export function findCapture(e) {
  if (findPress && e.type === 'touchmove') { e.preventDefault(); e.stopImmediatePropagation(); return; }
  if (findPress && ['pointermove','pointerup','pointercancel'].includes(e.type)) {
    const p = findPress; if (e.pointerId !== p.id) return;
    if (Math.hypot(e.clientX-p.x,e.clientY-p.y) > 6 || e.type === 'pointercancel') p.el._focusBlocked = true;
    e.stopImmediatePropagation(); if (e.type !== 'pointermove') findPress = null; return;
  }
  if (FD.rm || JOURNEY.mode !== 'steps' || !FD.st || ['pointermove','pointerup','pointercancel'].includes(e.type)) return;
  if (e.type === 'keydown' && !['Enter', ' '].includes(e.key)) return;
  const el = e.target.closest?.('.find'); if (!el) return;
  const key = el.id.slice(2);
  if (e.type === 'pointerdown') el._focusBlocked = false;
  if (e.type === 'pointerdown' && (JOURNEY.moving || JOURNEY.focus !== key)) {
    el._dragged = false;
    findPress = { el, id: e.pointerId, x: e.clientX, y: e.clientY }; e.stopImmediatePropagation(); return;
  }
  if (e.type === 'click' && el._focusBlocked) { el._focusBlocked = false; e.preventDefault(); e.stopImmediatePropagation(); return; }
  if (JOURNEY.moving) { FD.pendingPress = el; e.preventDefault(); e.stopImmediatePropagation(); return; }

  if (FD.sheetOwner?.id === key && FD.sheetClosing) { if (!FD.rm && JOURNEY.focus !== key) stepsFocus(key,findView(key)); FD.sheetOwner.overlayEpoch = FD.overlayEpoch; if (findSheetReopen(FD.sheetOwner)) return; }
  if (JOURNEY.focus === key) return;
  if (!stepsFocus(key, findView(key))) { if (e.type === 'pointerdown') el._focusBlocked = true; e.preventDefault(); e.stopImmediatePropagation(); }
  else { findHint(key); FD.overlayEpoch++; closePop(); closeSheet(true); if (e.type === 'pointerdown') el._focusBlocked = false; }
}
