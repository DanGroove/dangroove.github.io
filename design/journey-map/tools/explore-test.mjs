import { bigMap, mapDefs } from '../art.mjs';
import { findsBuild, findsFrame } from '../finds.mjs';
import { FD } from '../findkit.mjs';
import { tlBuild } from '../timeline.mjs';
// Node geometry and state checks. This is a recording environment, not a visual browser check.
import { strict as assert } from 'node:assert';
import { EXPLORE, MAP, FOOT_NAME, FIND_PLAY } from '../data.mjs';
import { tripResize, tripState, VIEW } from '../trip.mjs';
import { BEATS } from '../pace.mjs';
import { exploreClamp, exploreZoom, exploreWorld, exploreGlide, exploreLayer, exploreLayerPoint, exploreLayerInverse, exploreBuild, exploreResize, exploreStart, exploreApply, exploreEnd, exploreActive, exploreBusy, exploreReset, exploreDepart } from '../explore.mjs';
import { footerBuild, footerFrame } from '../footer.mjs';
import { footBezier, footLetterStep, footOpenTarget, footRest } from '../footname.mjs';

const near = (a, b, message) => assert.ok(Math.abs(a - b) < 1e-7, `${message}: ${a}/${b}`);
for (const view of [{ w: 1440, h: 800 }, { w: 390, h: 612 }]) {
  const bounds = [-30, 10, 800, 1500], fit = Math.min(view.w / 830, view.h / 1490), top = fit * 10;
  for (const scale of [fit / 100, fit, fit * 2, top, top * 100]) for (const x of [-1e6, 0, 1e6]) for (const y of [-1e6, 0, 1e6]) {
    const cam = exploreClamp({ s: scale, tx: x, ty: y }, bounds, view, fit, top), centre = exploreWorld(cam, [view.w / 2, view.h / 2]);
    assert.ok(cam.s >= fit && cam.s <= top);
    assert.ok(centre[0] >= bounds[0] && centre[0] <= bounds[2] && centre[1] >= bounds[1] && centre[1] <= bounds[3]);
    if ((bounds[2] - bounds[0]) * cam.s <= view.w) near(centre[0], (bounds[0] + bounds[2]) / 2, 'small bounds centred x');
    if ((bounds[3] - bounds[1]) * cam.s <= view.h) near(centre[1], (bounds[1] + bounds[3]) / 2, 'small bounds centred y');
  }
  // polish round 1 (L-15): pans keep a share of the view on the map frame, or the whole frame where it is smaller
  const keep = { frame: [14.5, 14.5, 585.5, 885.5], share: EXPLORE.keep };
  for (const scale of [fit, fit * 2, fit * 5, top]) for (const x of [-1e6, 0, 1e6]) for (const y of [-1e6, 0, 1e6]) {
    const kept = exploreClamp({ s: scale, tx: x, ty: y }, bounds, view, fit, top, keep), a = exploreWorld(kept, [0, 0]), b = exploreWorld(kept, [view.w, view.h]);
    for (const i of [0, 1]) { const over = Math.min(b[i], keep.frame[i + 2]) - Math.max(a[i], keep.frame[i]), need = Math.min(keep.share * (b[i] - a[i]), keep.frame[i + 2] - keep.frame[i]); assert.ok(over >= need - 1e-6, 'pan keeps the map frame in view'); }
  }
  const cam = { s: fit * 3, tx: -130, ty: -270 }, point = [view.w * .31, view.h * .67];
  for (const factor of [.0001, .7, 1.25, 1000]) {
    const zoomed = exploreZoom(cam, point, factor, fit, top), a = exploreWorld(cam, point), b = exploreWorld(zoomed, point);
    near(a[0], b[0], 'zoom anchor x'); near(a[1], b[1], 'zoom anchor y'); assert.ok(zoomed.s >= fit && zoomed.s <= top);
  }
  for (const velocity of [[200, -150], [1e5, 1e5], [-1e5, -1e5]]) {
    let current = exploreClamp(cam, bounds, view, fit, top), speed = velocity, previous = Math.hypot(...speed);
    for (let i = 0; i < 2000; i++) {
      const result = exploreGlide(current, speed, 1 / 60, bounds, view, fit, top); current = result.cam; speed = result.velocity;
      const mag = Math.hypot(...speed); assert.ok(mag <= previous); previous = mag;
      assert.deepEqual(exploreClamp(current, bounds, view, fit, top), current, 'glide crossed bounds');
    }
    assert.deepEqual(speed, [0, 0]);
  }
  const free = exploreClamp(cam, bounds, view, fit, top), glide = exploreGlide(free, [0, 10], 1 / 60, bounds, view, fit, top);
  assert.ok(glide.velocity[1] > 0 && glide.velocity[1] < 10, 'a free glide must continue while slowing');
  const end = { s: 2, tx: -250, ty: -1300 };
  for (const testCam of [end, cam, { s: .1, tx: 300, ty: 200 }]) {
    const layer = exploreLayer(testCam, end), p = [157, 888], roundtrip = exploreLayerInverse(exploreLayerPoint(p, layer), layer);
    near(roundtrip[0], p[0], 'layer inverse x'); near(roundtrip[1], p[1], 'layer inverse y');
    const endScreen = [MAP.x[0] * end.s + end.tx, MAP.x[1] * end.s + end.ty], transformed = exploreLayerPoint(endScreen, layer);
    near(transformed[0], MAP.x[0] * testCam.s + testCam.tx, 'world layer x'); near(transformed[1], MAP.x[1] * testCam.s + testCam.ty, 'world layer y');
  }
}
console.log('ok: desktop/phone zoom limits, bounded/centred cameras, fixed zoom anchor, damped glides with no overshoot, layer/inverse round trips');

// Exercise end gating, entry interruption, exit, pointer input, resize and progress invariance.
const listeners = {}, classes = new Set(), hint = { classList: { add() {}, remove() {} }, setAttribute() {} }, world = { style: {} }, status = {};
const eventTarget = { closest: () => null };
const captures = new Set(), listenerOptions = {};
const stage = { classList: hint.classList, appendChild() {}, addEventListener(type, fn, options) { (listeners['stage:' + type] ??= []).push(fn); (listenerOptions[type] ??= []).push(options); }, setPointerCapture(id) { captures.add(id); }, releasePointerCapture(id) { captures.delete(id); }, hasPointerCapture: id => captures.has(id) };
globalThis.window = { addEventListener(type, fn) { (listeners[type] ??= []).push(fn); }, dispatchEvent() {}, getComputedStyle() { throw new Error('frame layout read'); } };
globalThis.document = { createElement: () => hint, getElementById: () => status, documentElement: { classList: { add: c => classes.add(c), remove: c => classes.delete(c) } } };
const journey = { P: 0, moving: false, beats: BEATS }, endP = BEATS.at(-1).P;
exploreBuild({ stage, world, journey, rm: false }); tripResize(1440, 900, 120); exploreResize(); assert.equal(exploreStart(), false);
journey.P = endP; journey.moving = true; assert.equal(exploreStart(), false); journey.moving = false; assert.equal(exploreStart(), true);
const apply = dt => { const st = tripState(journey.P), before = structuredClone(st); exploreApply(st, dt); assert.equal(st.P, before.P); assert.deepEqual(st.trav, before.trav); return st; };
let st = apply(EXPLORE.in / 2); assert.ok(st.exploreK > 0 && st.exploreK < 1);
const dispatch = (type, fields = {}, prefix = '') => { const e = { type, target: eventTarget, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; }, stopImmediatePropagation() { this.stopped = true; }, ...fields }; (listeners[prefix + type] || []).forEach(fn => fn(e)); return e; };
dispatch('wheel', { deltaY: -50, deltaMode: 0, clientX: 700, clientY: 450 }); st = apply(0); // takeover has no discontinuity at the instant of the event
const beforePan = st.cam.tx;
// Zoom enough to leave room for keyboard pan, then verify arrow ownership and bounded movement.
dispatch('wheel',{deltaY:-120,deltaMode:0,clientX:700,clientY:450});apply(.3);
for(let i=0;i<24;i++){dispatch('keydown',{key:'+'});apply(.5);}
const keyTravel=[0,0];
for(const key of ['ArrowRight','ArrowLeft','ArrowUp','ArrowDown']){const before=apply(0).cam,e=dispatch('keydown',{key,shiftKey:key==='ArrowDown'});assert.equal(e.defaultPrevented,true);st=apply(1);assert.equal(journey.P,endP);const axis=['ArrowRight','ArrowLeft'].includes(key)?0:1,prop=axis?'ty':'tx',delta=st.cam[prop]-before[prop],sign=['ArrowRight','ArrowDown'].includes(key)?-1:1;assert.ok(delta*sign>=-1e-8,'arrow pans in its direction');assert.ok(Math.abs(delta)<=EXPLORE.keyPan*(key==='ArrowDown'?3:1)+1e-8,'arrow overshot target');keyTravel[axis]+=Math.abs(delta);}
assert.ok(keyTravel.every(d=>d>0),'arrow keys must move both camera axes');

dispatch('pointerdown', { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 700, clientY: 450, timeStamp: 1000 }, 'stage:');
dispatch('pointermove', { pointerId: 1, clientX: 730, clientY: 460, timeStamp: 1020 }, 'stage:'); assert.equal(apply(0).exploring, true);
dispatch('pointerup', { type: 'pointerup', pointerId: 1, timeStamp: 1030 }, 'stage:');
st = apply(EXPLORE.in); assert.equal(st.exploreK, 1); assert.equal(journey.P, endP); assert.ok(Number.isFinite(beforePan));
tripResize(390, 664, 96); exploreResize(); st = apply(0); assert.ok(Number.isFinite(st.cam.s));
assert.equal(dispatch('keydown',{key:'Escape'}).defaultPrevented,true); assert.equal(exploreActive(), false); st = apply(EXPLORE.out); assert.equal(st.exploreK, 0); assert.equal(exploreBusy(), false); assert.equal(world.style.transform, 'none');
assert.equal(exploreStart(), true); apply(EXPLORE.in); journey.P = BEATS[2].P; st = apply(0); assert.equal(exploreBusy(), false); assert.equal(st.exploreK, 0); exploreReset();
console.log('ok: end-only CTA entry, input takeover, pan/release, resize, exit and immediate departure reset; P and traveller unchanged');

for (const curve of [FOOT_NAME.wipe, FOOT_NAME.enter]) { near(footBezier(curve, 0), 0, 'curve start'); near(footBezier(curve, 1), 1, 'curve end'); let previous = 0; for (let i = 1; i <= 100; i++) { const value = footBezier(curve, i / 100); assert.ok(value >= previous); previous = value; } }
assert.equal(footOpenTarget(50, 20, { left: 0, top: 0, right: 100, bottom: 40 }, 20), 1); assert.equal(footRest(0, 0, 20), FOOT_NAME.rise);
const letter = { y: 0, vy: 0, kick: 1 }; footLetterStep(letter, 0, 1 / 60, 2); assert.ok(letter.y > 0);
for (let i = 0; i < 1000; i++) footLetterStep(letter, 0, 1 / 60, i + 3); assert.ok(Math.abs(letter.y) < 1e-6);
console.log('ok: copied name curves monotone, lens/rest geometry and knock spring settling');

console.log('ok: arrows pan during explore without changing P; Escape ends explore');

// Record the actual footer writer with its name animation disabled; no layout/rendering is simulated.
const footerPart = name => ({ style:{}, classList:{contains:cls=>cls===name} });
const footerInner=footerPart('ft-in'),footerName=footerPart('ft-name'),footerSpan=footerPart('span'),footerRule=footerPart('ft-rule'),footerRows=[footerPart('ft-cta'),footerName,footerPart('ft-tag'),footerPart('ft-links')];
const footerSurface={style:{},set innerHTML(html){this.html=html;},querySelector:s=>s==='.ft-in'?footerInner:s==='.ft-name span'?footerSpan:footerRule,querySelectorAll:()=>footerRows};
footerBuild(footerSurface,true);
journey.P=endP; exploreReset(); assert.equal(exploreStart(),true);
let entryElapsed=0;
for(const dt of [0,.1,.15,.35,1]){entryElapsed+=dt;const state=apply(dt);footerFrame(state);near(+footerInner.style.opacity,Math.max(0,1-entryElapsed/EXPLORE.footerFade),'linear footer opacity');assert.equal(footerSurface.inert,true);if(entryElapsed>=.6)assert.equal(+footerInner.style.opacity,0,'footer is gone at 600 ms');}
assert.equal(+footerInner.style.opacity,0,'footer is gone by 600 ms and stays gone');
exploreEnd(); let exit=apply(EXPLORE.out-EXPLORE.footerFade);footerFrame(exit);near(+footerInner.style.opacity,0,'footer waits until last half second of exit');
exit=apply(EXPLORE.footerFade/2);footerFrame(exit);near(+footerInner.style.opacity,.5,'footer returns linearly');
exit=apply(EXPLORE.footerFade/2);footerFrame(exit);near(+footerInner.style.opacity,1,'footer restored');assert.equal(footerSurface.inert,false);
console.log('ok: actual footer fades in linear time, is gone by 600 ms, returns over last 500 ms of exit, and stays inert while exploring');

// Synthetic targets stand in for hit elements. These checks exercise event ownership, not browser hit testing.
const fakeTarget = selectors => ({ closest: query => query.split(',').some(s => selectors.includes(s.trim())) ? {} : null });
const novaTarget=fakeTarget(['button','[role="button"]']), stopTarget=fakeTarget(['.stop']), hornTarget=fakeTarget(['.find','#f-horn']), wayTarget=fakeTarget(['.find','#f-wayfinder']);
const point=(type,id,x,y,target=eventTarget)=>dispatch(type,{pointerId:id,pointerType:'touch',button:0,clientX:x,clientY:y,timeStamp:2000+x,target},'stage:');
const click=detail=>dispatch('click',{detail},'stage:');
const fresh=()=>{exploreReset();journey.P=endP;assert.equal(exploreStart(),true);apply(EXPLORE.in);};
const pinch=(a,b)=>{
  const before=apply(0).cam.s;
  point('pointerdown',21,100,200,a);assert.equal(captures.size,0,'first pointer is not captured');
  point('pointerdown',22,200,200,b);assert.deepEqual([...captures],[21,22],'pinch captures both pointers');
  point('pointermove',22,300,200,b);assert.ok(apply(0).cam.s>=before*1.2,'pinch must change scale by at least 20 percent');
  point('pointerup',22,300,200,b);point('pointerup',21,100,200,a);assert.equal(captures.size,0);
};
for(const target of [novaTarget,stopTarget,hornTarget])for(const pair of [[target,eventTarget],[target,target],[eventTarget,target]]){fresh();pinch(...pair);assert.equal(click(1).defaultPrevented,true,'pinch-ending click is eaten');assert.equal(click(1).defaultPrevented,false,'only one click is eaten');}
fresh();point('pointerdown',1,100,200,novaTarget);point('pointermove',1,103,202,novaTarget);point('pointerup',1,103,202,novaTarget);assert.equal(click(1).defaultPrevented,false,'nova tap is a press');assert.equal(captures.size,0);
const drag=target=>{point('pointerdown',1,100,200,target);point('pointermove',1,130,220,target);point('pointerup',1,130,220,target);};
const zoomForPan=()=>{for(let i=0;i<6;i++){dispatch('keydown',{key:'+'});apply(1);}apply(1);};
// FRAMES: pointercancel has no fling. Its final, stationary camera still has to
// wake the frame loop once so the held SVG raster can be committed and sharpened.
fresh();zoomForPan();point('pointerdown',1,100,200,novaTarget);point('pointermove',1,130,220,novaTarget);
assert.equal(apply(0).exploreMoving,true);point('pointercancel',1,130,220,novaTarget);
const released=tripState(journey.P);assert.equal(exploreApply(released,0),true,'stationary release invalidates');assert.equal(released.exploreMoving,false);
assert.equal(exploreApply(tripState(journey.P),0),false,'release invalidates only once');
console.log('ok: FRAMES stationary pointer cancellation wakes one raster commit, then returns to idle');
for(const target of [novaTarget,stopTarget,eventTarget])for(const detail of [1,0]){fresh();zoomForPan();const before=apply(0).cam;drag(target);assert.notDeepEqual(apply(0).cam,before,'ordinary target can pan');assert.equal(click(detail).defaultPrevented,detail===1,'pointer clicks only after drag');}
fresh();pinch(novaTarget,hornTarget);dispatch('keydown',{key:'Tab'});assert.equal(click(1).defaultPrevented,false,'any key clears suppression');
fresh();pinch(novaTarget,hornTarget);exploreEnd();assert.equal(click(1).defaultPrevented,false,'exit clears suppression');
fresh();pinch(novaTarget,hornTarget);exploreDepart();assert.equal(click(1).defaultPrevented,false,'departure clears suppression');
fresh();pinch(novaTarget,hornTarget);exploreReset();assert.equal(click(1).defaultPrevented,false,'reset clears suppression');
fresh();pinch(novaTarget,hornTarget);await new Promise(resolve=>setTimeout(resolve,EXPLORE.clickRelease+30));assert.equal(click(1).defaultPrevented,false,'release timeout clears suppression');
fresh();pinch(novaTarget,hornTarget);point('pointerdown',1,100,200,novaTarget);point('pointerup',1,100,200,novaTarget);assert.equal(click(1).defaultPrevented,false,'next pointerdown clears suppression');
fresh();zoomForPan();const beforeOwn=apply(0).cam;drag(wayTarget);assert.deepEqual(apply(0).cam,beforeOwn,'wayfinder owns a single drag');assert.equal(click(1).defaultPrevented,false);
assert.equal(world.style.willChange,'','no world promotion at rest');
point('pointerdown',1,100,200,novaTarget);assert.equal(world.style.willChange,'transform');point('pointerup',1,100,200,novaTarget);assert.equal(world.style.willChange,'');
for(const target of [fakeTarget(['.sheet.on']),fakeTarget(['input']),fakeTarget(['textarea']),fakeTarget(['select']),fakeTarget(['.tl']),fakeTarget(['[data-review]'])]){point('pointerdown',1,100,200,target);assert.equal(captures.size,0);point('pointermove',1,300,200,target);point('pointerup',1,300,200,target);assert.deepEqual(apply(0).cam,beforeOwn);}
assert.equal(listenerOptions.pointerdown[0],true,'pointerdown precedes find capture');assert.equal(listenerOptions.pointermove[0],true);assert.equal(listenerOptions.pointerup[0],true);
exploreReset();
console.log('ok: capture-phase pinch on nova/stop/horn; nova taps; owned single drags; drag-only pointer clicks; key/end/depart/reset/down/500 ms suppression clearing; temporary world promotion');

// D3 uses findsBuild and the real handlers on a recording event tree.
let exploreInFrame = false;
class ExploreContext {
  constructor() { this.commands = 0; this.clipPaths = []; }
  record(...args) { this.commands++; for (const a of args) if (typeof a === 'number') assert.ok(Number.isFinite(a), 'nonfinite canvas command'); }
  setTransform(...args) { this.record(...args); } scale(...args) { this.record(...args); } translate(...args) { this.record(...args); }
  rotate(...args) { this.record(...args); } fillRect(...args) { this.record(...args); } drawImage(...args) { this.record(...args); }
  stroke(...args) { this.record(...args); } clip(...args) { this.record(...args); this.clipPaths.push(args[0].path); } fill(...args) { this.record(...args); } save() {} restore() {}
}
class ExploreNode {
  constructor(tag = 'div') { this.tagName = tag; this.attrs = {}; this.children = []; this.listeners = {}; this.nodeType = 1; this.style = { setProperty(k, v) { this[k] = v; } }; this.dataset = {}; this.hidden = false; this.classList = { add: (...xs) => xs.forEach(x => this.toggleClass(x, true)), remove: (...xs) => xs.forEach(x => this.toggleClass(x, false)), toggle: (x, force) => this.toggleClass(x, force), contains: x => this.className.split(/\s+/).includes(x) }; }
  get id() { return this.attrs.id || ''; } set id(v) { this.attrs.id = v; }
  get className() { return this.attrs.class || ''; } set className(v) { this.attrs.class = v; }
  get firstElementChild() { return this.children[0]; } get firstChild() { return this.children[0]; }
  get isConnected() { return true; }
  toggleClass(x, force) { const set = new Set(this.className.split(/\s+/).filter(Boolean)); const on = force ?? !set.has(x); if (on) set.add(x); else set.delete(x); this.className = [...set].join(' '); return on; }
  setAttribute(k, v) { assert.ok(!/NaN/.test(String(v)), `NaN attribute ${this.id}/${k}: ${v}`); this.attrs[k] = String(v); if (k.startsWith('data-')) this.dataset[k.slice(5)] = String(v); }
  getAttribute(k) { return this.attrs[k] ?? null; }
  after() {}
  appendChild(node) { if (node.parentElement) node.parentElement.children = node.parentElement.children.filter(c => c !== node); this.children.push(node); node.parentElement = this; return node; }
  append(...nodes) { nodes.forEach(n => this.appendChild(n)); }
  remove() { if (this.parentElement) this.parentElement.children = this.parentElement.children.filter(c => c !== this); this.parentElement = null; }
  prepend(...nodes) { nodes.reverse().forEach(n => { this.children.unshift(n); n.parentElement = this; }); }
  set innerHTML(html) {
    this.recordedHTML = String(html); this.children = []; const stack = [this];
    for (const token of String(html).matchAll(/<\/?([\w:-]+)([^>]*?)\/?\s*>/g)) {
      if (token[0].startsWith('</')) { if (stack.length > 1) stack.pop(); continue; }
      const node = new ExploreNode(token[1]);
      for (const a of token[2].matchAll(/([\w:-]+)(?:="([^"]*)"|='([^']*)')?/g)) { node.setAttribute(a[1], a[2] ?? a[3] ?? ''); if (a[1] === 'hidden') node.hidden = true; }
      stack[stack.length - 1].appendChild(node);
      if (!/\/\s*>$/.test(token[0]) && !['img', 'input', 'br', 'hr', 'meta', 'link'].includes(token[1])) stack.push(node);
    }
  }
  matches(selector) {
    if (selector.includes(':not([hidden])')) { if (this.hidden) return false; selector = selector.replace(':not([hidden])', ''); }
    const tag = selector.match(/^[\w-]+/); if (tag && this.tagName !== tag[0]) return false;
    for (const m of selector.matchAll(/#([\w-]+)/g)) if (this.id !== m[1]) return false;
    for (const m of selector.matchAll(/\.([\w-]+)/g)) if (!this.classList.contains(m[1])) return false;
    for (const m of selector.matchAll(/\[([\w-]+)(?:="([^"]*)")?\]/g)) if (!Object.hasOwn(this.attrs, m[1]) || m[2] !== undefined && this.attrs[m[1]] !== m[2]) return false;
    return true;
  }
  querySelectorAll(selector) {
    const results = [], nodes = []; const collect = node => node.children.forEach(c => { nodes.push(c); collect(c); }); collect(this);
    for (const node of nodes) {
      const matched = selector.split(',').some(choice => {
        const parts = choice.trim().split(/\s+/); let current = node;
        if (!current.matches(parts.pop())) return false;
        while (parts.length) {
          const part = parts.pop(); if (part === '>') { const parent = parts.pop(); current = current.parentElement; if (!current?.matches(parent)) return false; }
          else { do { current = current.parentElement; } while (current && !current.matches(part)); if (!current) return false; }
        }
        return true;
      });
      if (matched) results.push(node);
    }
    return results;
  }
  querySelector(selector) { return this.querySelectorAll(selector)[0] || null; }
  closest(selector) { for (let node = this; node; node = node.parentElement) if (selector.split(',').some(s => node.matches(s.trim()))) return node; return null; }
  contains(node) { for (let n = node; n; n = n.parentElement) if (n === this) return true; return false; }
  getContext() { return this.context ??= new ExploreContext(); }
  addEventListener(type, fn, capture = false) { (this.listeners[type] ??= []).push({ fn, capture: capture === true }); }
  dispatchEvent(event) {
    event.target = this; const path = []; for (let p = this; p; p = p.parentElement) path.push(p);
    for (const node of path.slice().reverse()) for (const l of node.listeners[event.type] || []) { if (l.capture && !event.stopped) l.fn(event); }
    for (const node of path) { if (event.stopped) break; for (const l of node.listeners[event.type] || []) { if (event.immediate) break; if (!l.capture) l.fn(event); } if (!event.bubbles) break; }
    return !event.defaultPrevented;
  }
  focus() { document.activeElement = this; }
  setPointerCapture() {}
  getAnimations() { return []; }
  animate() { return { cancel() {} }; }
  getBoundingClientRect() { assert.equal(exploreInFrame, false, 'layout read in frame callback'); return { left: 30, top: 40, width: this.classList.contains('tl-count') ? 90 : 240, height: this.classList.contains('tl-count') ? 20 : 140 }; }
}
class ExploreEvent {
  constructor(type, props = {}) { Object.assign(this, { type, bubbles: true, detail: 0, preventDefault() { this.defaultPrevented = true; }, stopPropagation() { this.stopped = true; }, stopImmediatePropagation() { this.stopped = this.immediate = true; } }, props); }
}

const originalTimers={setTimeout:globalThis.setTimeout,clearTimeout:globalThis.clearTimeout,Event:globalThis.Event};
globalThis.Event=ExploreEvent;
let intentMS=0,intentSerial=0;const intentTimers=new Map();
globalThis.setTimeout=(fn,delay=0)=>{const id=++intentSerial;intentTimers.set(id,{fn,at:intentMS+delay});return id;};
globalThis.clearTimeout=id=>intentTimers.delete(id);
const realChart=bigMap();let realStage,realSvg,realJourney;
function realFrame(dt=0){const st=tripState(endP);exploreApply(st,dt);findsFrame(1+intentMS/1000,st);return st;}
async function realWait(ms){const n=Math.max(1,Math.ceil(ms/16));for(let i=0;i<n;i++){intentMS+=ms/n;FD.now=1+intentMS/1000;for(const [id,timer] of intentTimers)if(timer.at<=intentMS){intentTimers.delete(id);timer.fn();}realFrame(ms/n/1000);await Promise.resolve();}}
function realFresh(){
  exploreReset();intentTimers.clear();intentMS=0;
  const html=new ExploreNode('html'),body=new ExploreNode('body'),doc=new ExploreNode('document');html.appendChild(body);doc.appendChild(html);
  Object.assign(doc,{documentElement:html,body,activeElement:body,createElement:tag=>new ExploreNode(tag),createElementNS:(ns,tag)=>new ExploreNode(tag),getElementById:id=>html.querySelector('#'+id)});
  const win=new ExploreNode('window');Object.assign(win,{location:{search:''},matchMedia:()=>({matches:false,addEventListener(){}})});
  Object.assign(globalThis,{document:doc,window:win,matchMedia:win.matchMedia,localStorage:{getItem:()=>null},Path2D:class {constructor(path){this.path=path;}}});window.__jm={};
  const liveStatus=new ExploreNode();liveStatus.id='go-say';body.appendChild(liveStatus);realStage=new ExploreNode();realSvg=new ExploreNode('svg');const pop=new ExploreNode(),sheet=new ExploreNode(),timeline=new ExploreNode();body.appendChild(realStage);realStage.append(realSvg,pop,sheet,timeline);
  realStage.setPointerCapture=id=>captures.add(id);realStage.releasePointerCapture=id=>captures.delete(id);realStage.hasPointerCapture=id=>captures.has(id);captures.clear();
  realSvg.innerHTML=mapDefs()+'<g id="b-all">'+realChart.detail+'</g><g id="finds">'+realChart.finds+'</g>';
  FD.found=new Set();FD.list={};FD.bits=[];FD.flights=[];FD.flight=null;FD.landed=0;FD.popOwner=FD.sheetOwner=null;
  tlBuild(timeline,{jump(){},scrub(){}},false);findsBuild(realSvg,pop,sheet,realSvg.querySelector('#b-all'),false);
  tripResize(390,844,96);realJourney={P:endP,moving:false,beats:BEATS};exploreBuild({stage:realStage,world:new ExploreNode(),journey:realJourney,rm:false});exploreResize();assert.equal(exploreStart(),true);realFrame(EXPLORE.in);
}
function realPointer(type,id,x,y,target=realStage){const e=new ExploreEvent(type,{pointerId:id,pointerType:'touch',button:0,clientX:x,clientY:y,timeStamp:intentMS});target.dispatchEvent(e);return e;}
const realState=id=>window.__jm.finds.state(id);
try{
  for(const id of ['horn','hoard-hmc1','beacon'])for(const delay of [0,30,100]){
    realFresh();const target=realSvg.querySelector('#f-'+id),before=realState(id),foundBefore=window.__jm.finds.found(),scale=realFrame().cam.s;
    realPointer('pointerdown',1,100,200,target);assert.equal(captures.size,0,'wait does not capture');await realWait(delay);
    realPointer('pointerdown',2,200,200);realPointer('pointermove',2,300,200);await realWait(180);
    assert.ok(realFrame().cam.s>=scale*1.2,id+' pinch scales camera');assert.deepEqual(window.__jm.finds.found(),foundBefore,id+' pinch never found');
    assert.equal(realState(id).stage,before.stage,id+' pinch never changes stage');assert.equal(realState(id).digs,before.digs);assert.equal(realState(id).up,before.up);assert.equal(realState(id).manualTs,before.manualTs);
    realPointer('pointerup',2,300,200);realPointer('pointerup',1,100,200);target.dispatchEvent(new ExploreEvent('click',{detail:1}));
    assert.deepEqual(window.__jm.finds.found(),foundBefore);
    target.dispatchEvent(new ExploreEvent('click',{detail:0}));realFrame();
    if(id==='horn')assert.equal(realState(id).stage,'raised','keyboard click after pinch reaches horn');
    else if(id.startsWith('hoard'))assert.equal(realState(id).digs,1,'keyboard click after pinch reaches chest');
    else assert.ok(FD.list.beacon.snap,'keyboard click after pinch reaches beacon');
  }
  for(const id of ['horn','hoard-hmc1','beacon']){
    realFresh();const target=realSvg.querySelector('#f-'+id);realPointer('pointerdown',1,100,200,target);await realWait(30);realPointer('pointerup',1,101,201,target);target.dispatchEvent(new ExploreEvent('click',{detail:1}));realFrame();
    if(id==='horn')assert.equal(realState(id).stage,'raised');else if(id.startsWith('hoard'))assert.equal(realState(id).digs,1);else assert.ok(FD.list.beacon.snap,'beacon tap snaps');
  }
  realFresh();const chest=realSvg.querySelector('#f-hoard-hmc1');realPointer('pointerdown',1,100,200,chest);await realWait(120);assert.equal(realState('hoard-hmc1').digs,1);await realWait(1000);assert.ok(realState('hoard-hmc1').digs>1,'chest hold repeats');realPointer('pointerup',1,100,200,chest);
  for(const id of ['beacon','mist','wayfinder']){
    realFresh();const target=realSvg.querySelector('#f-'+id);realPointer('pointerdown',1,100,200,target);const before=realFrame().cam;realPointer('pointermove',1,150,260,target);realFrame();assert.deepEqual(realFrame().cam,before,id+' owns drag');
    if(id==='beacon')assert.ok(FD.list.beacon.drag&&FD.list.beacon.dragged&&FD.found.has(id),'beacon still aims');
    if(id==='wayfinder')assert.equal(FD.list.wayfinder.drag,true);if(id==='mist')assert.equal(FD.list.mist.down,true);realPointer('pointerup',1,150,260,target);
  }
  for(const id of ['horn','hoard-hmc1']){
    realFresh();for(let i=0;i<4;i++){window.dispatchEvent(new ExploreEvent('keydown',{key:'+'}));realFrame(1);}const target=realSvg.querySelector('#f-'+id),before=realFrame().cam,stageBefore=realState(id).stage;
    realPointer('pointerdown',1,100,200,target);realPointer('pointermove',1,140,220,target);assert.notDeepEqual(realFrame().cam,before,id+' pending press becomes pan');await realWait(180);assert.equal(realState(id).stage,stageBefore);realPointer('pointerup',1,140,220);target.dispatchEvent(new ExploreEvent('click',{detail:1}));
  }
  console.log('ok: D3 real findsBuild horn/chest/beacon pinches at 0/30/100 ms preserve found/stage and zoom >=20%; taps act once, chest hold repeats, owned drags aim/wipe/turn and press drags pan');
}finally{exploreReset();Object.assign(globalThis,originalTimers);}
