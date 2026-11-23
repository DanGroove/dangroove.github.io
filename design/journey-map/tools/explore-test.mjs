// Node geometry and state checks. This is a recording environment, not a visual browser check.
import { strict as assert } from 'node:assert';
import { EXPLORE, MAP, FOOT_NAME } from '../data.mjs';
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
