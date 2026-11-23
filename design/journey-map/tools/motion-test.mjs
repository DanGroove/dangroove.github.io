// Node fake-clock measurements only. No browser, rendered frames or pixels.
import { strict as assert } from 'node:assert';
import { BEATS } from '../pace.mjs';
import { STEPS, STOPS } from '../data.mjs';
import { JOURNEY, stepsBuild, stepsFrame } from '../steps.mjs';
import { GLIDES, glideSeconds, tripResize, tripState } from '../trip.mjs';

class MotionNode {
  constructor(tag = 'div') {
    this.tagName = tag; this.children = []; this.attrs = {}; this.dataset = {}; this.listeners = {}; this.className = '';
    this.style = { setProperty(k, v) { this[k] = v; } };
    this.classList = { contains: c => this.className.split(' ').includes(c), add: c => this.classList.toggle(c, true), remove: c => this.classList.toggle(c, false), toggle: (c, on) => { const set = new Set(this.className.split(' ').filter(Boolean)); if (on ?? !set.has(c)) set.add(c); else set.delete(c); this.className = [...set].join(' '); } };
  }
  setAttribute(k, v) { this.attrs[k] = String(v); if (k === 'class') this.className = v; }
  appendChild(n) { this.children.push(n); n.parentElement = this; return n; }
  prepend(...ns) { ns.reverse().forEach(n => { this.children.unshift(n); n.parentElement = this; }); }
  set innerHTML(html) { const stack = [this]; this.children = []; for (const m of html.matchAll(/<\/?([\w-]+)([^>]*?)\/?\s*>/g)) { if (m[0].startsWith('</')) { if (stack.length > 1) stack.pop(); continue; } const n = new MotionNode(m[1]); for (const a of m[2].matchAll(/([\w-]+)(?:="([^"]*)")?/g)) n.setAttribute(a[1], a[2] || ''); stack.at(-1).appendChild(n); if (!m[0].endsWith('/>') && m[1] !== 'img') stack.push(n); } }
  matches(s) { return s.startsWith('.') ? this.classList.contains(s.slice(1)) : s.startsWith('[') ? Object.hasOwn(this.attrs,s.slice(1,-1)) : this.tagName===s; }
  querySelectorAll(s) { return this.children.flatMap(n => [...(n.matches(s) ? [n] : []), ...n.querySelectorAll(s)]); }
  querySelector(s) { return this.querySelectorAll(s)[0] || null; }
  addEventListener(t, fn) { (this.listeners[t] ??= []).push(fn); }
  contains(n) { return n === this || this.children.some(c => c.contains(n)); }
  focus() { document.activeElement = this; }
  getBoundingClientRect() { throw Error('unexpected layout read'); }
}
const win = new MotionNode(), stage = new MotionNode(), root = new MotionNode(), body = new MotionNode();
globalThis.window = Object.assign(win, { location: { search: '' }, scrollY: 0, scrollTo() {}, dispatchEvent() {} });
globalThis.document = { documentElement: root, body, activeElement: body, createElement: tag => new MotionNode(tag), getElementById: id => stage.children.find(n => n.id === id) };
globalThis.history = {};
stepsBuild({ stage, rm: false, joinedTop: () => false });
let clock = 0; stepsFrame(clock);
const advance = ms => { clock += ms; stepsFrame(clock); return tripState(JOURNEY.P); };
const diff = (a, b) => Math.max(...['s','tx','ty'].map(k => Math.abs(a[k] - b[k])));
const results = [];
const failures = [], gate = (condition, message) => { if (!condition && !failures.includes(message)) failures.push(message); };
console.log('view | move | measured seconds | centre peak px/s | five-point peak px/s | centre acceleration px/s^2');
for (const [w,h,bar] of [[1440,900,120],[390,844,96]]) {
  tripResize(w,h,bar);
  const points = [[.5,.5],[.25,.25],[.75,.25],[.25,.75],[.75,.75]].map(p => [p[0]*w,p[1]*h]);
  for (let i = 0; i < GLIDES.length; i++) for (const direction of [1,-1]) {
    const g = GLIDES[i], a = BEATS[i+1], b = BEATS[i+2], from = direction > 0 ? a : b, to = direction > 0 ? b : a;
    JOURNEY.set(from.P); advance(0); direction > 0 ? JOURNEY.next() : JOURNEY.back();
    assert.equal(JOURNEY.moving,true,'press must start glide');
    const first = tripState(JOURNEY.P), frames = [first], velocities = [], speeds = [], states = [];
    let elapsed = 0, previous = first.cam, peak = 0, peakCentre = 0, acceleration = 0, lastVelocity = [0,0], foldAt = null, foldedAt = null, openAt = null, openingAt = null, accelAt = 0;
    const leaving = STOPS.findIndex(s => s.id === from.id), arriving = STOPS.findIndex(s => s.id === to.id);
    while (JOURNEY.moving && elapsed < 5000) {
      const state = advance(16); elapsed += 16; const cam = state.cam;
      const vectors = points.map(p => [(cam.tx + (p[0]-previous.tx)*cam.s/previous.s - p[0])/.016,(cam.ty + (p[1]-previous.ty)*cam.s/previous.s - p[1])/.016]);
      const speed = Math.max(...vectors.map(v => Math.hypot(...v))), centre = Math.hypot(...vectors[0]);
      const acc = Math.hypot(...vectors[0].map((v,k)=>(v-lastVelocity[k])/.016));
      if(acc>acceleration){acceleration=acc;accelAt=elapsed;}
      lastVelocity = vectors[0]; peak = Math.max(peak,speed); peakCentre = Math.max(peakCentre,centre);
      if (leaving >= 0 && state.cardK[leaving] < 1 && foldAt === null) foldAt = elapsed;
      if (leaving >= 0 && state.cardK[leaving] === 0 && foldedAt === null) foldedAt = elapsed;
      if (arriving >= 0 && state.cardK[arriving] > 0 && openingAt === null) openingAt = elapsed;
      if (arriving >= 0 && state.cardK[arriving] === 1 && openAt === null) openAt = elapsed;
      states.push(state); frames.push(cam); velocities.push(vectors); speeds.push(speed); previous = cam;
    }
    const label = `${w} ${from.id}->${to.id}`;
    console.log(`${w}x${h} | ${from.id}->${to.id} | ${(elapsed/1000).toFixed(3)} | ${peakCentre.toFixed(2)} | ${peak.toFixed(2)} | ${acceleration.toFixed(2)} @ ${accelAt}`);
    results.push({view:`${w}x${h}`,move:`${from.id}->${to.id}`,seconds:elapsed/1000,peakCentre,peak,acceleration});
    gate(diff(first.cam,frames[2])>1e-8,label+' must move by 32 ms');
    const halfway = speeds.findIndex(v=>v>=peak*.5), crest = speeds.findIndex((v,n)=>n>=halfway&&v>=peak*.6), descent = speeds.findLastIndex(v=>v>=peak*.6);
    // The .5-to-.6 interval is the initial ascent. Once at .6, any later
    // return above .6 would expose an interior stop/trough under the brief's gate.
    gate(speeds.slice(crest,descent+1).every(v=>v>=peak*.6),label+' interior speed trough');
    gate(peakCentre<=w*.6+1e-6,label+' centre speed exceeds .6 widths/s');
    gate(acceleration<=w*1.2+1e-6,label+' centre acceleration exceeds 1.2 widths/s^2');
    assert.ok(elapsed>=2600&&elapsed<=4400,label+' duration outside 2.6-4.4 s');
    assert.ok(Math.abs(elapsed/1000-glideSeconds(g))<=.016+1e-9,label+' duration rule');
    if(leaving>=0){assert.ok(foldAt<=100,label+' outgoing card starts late');assert.ok(foldedAt<=STEPS.glide.fold*1000+16,label+' outgoing card fold window');}
    if(arriving>=0){assert.ok(openAt!==null&&openAt<=elapsed+300,label+' incoming card opens late');assert.ok(openingAt>=glideSeconds(g)*1000-STEPS.glide.openWindow*1000,label+' incoming card opens before last .6 s');}
    assert.deepEqual(advance(16).cam,previous,label+' camera did not stay settled');
    for(const state of states.slice().reverse())assert.deepEqual(tripState(state.P).cam,state.cam,label+' same P reversed');
  }
}
// Hurry traverses the same pure frames, with no second progress owner.
JOURNEY.set(BEATS[3].P); JOURNEY.next(); advance(400); const before=JOURNEY.P; JOURNEY.next();
for(let ms=0;JOURNEY.moving&&ms<400;ms+=16){const st=advance(16);assert.ok(st.P>=before);assert.deepEqual(tripState(st.P).cam,st.cam);}
assert.equal(JOURNEY.moving,false);assert.equal(JOURNEY.P,BEATS[4].P);
assert.deepEqual(failures,[]);
console.log('ok: 28 desktop/phone forward/back glides move by 32 ms, have one speed hill, meet speed/acceleration/duration/card gates, reproduce the same P and still hurry');
