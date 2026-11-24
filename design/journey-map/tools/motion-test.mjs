// Node fake-clock measurements only. No browser, rendered frames or pixels.
import { strict as assert } from 'node:assert';
import { BEATS } from '../pace.mjs';
import { STEPS, STOPS } from '../data.mjs';
import { JOURNEY, stepsBuild, stepsFrame } from '../steps.mjs';
import { GLIDES, glideSeconds, tripResize, tripState, tripCardPlace, VIEW } from '../trip.mjs';

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
  // Content-height fixtures exercise the new pair anchors, not the old 45/55 fallback. These are not browser measurements.
  VIEW.cards = (w <= 640 ? [355,400,355,410,390,470] : [360,420,370,420,390,440]).map(height => tripCardPlace(height));
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
// D5: real controls on the fake clock. Gates are brief values, independent of tuning.
// Four-ms clock ticks let the two presses be exactly 300 ms apart. Each measured
// velocity still spans 16 ms, with a fresh 16 ms sampling phase at each press.
const carryResults = [], carryFailures = [];
const carryGate = (ok, label) => { if (!ok && !carryFailures.includes(label)) carryFailures.push(label); };
for (const [w,h,bar] of [[1440,900,120],[390,844,96]]) {
  tripResize(w,h,bar);
  // Content-height fixtures exercise the new pair anchors, not the old 45/55 fallback. These are not browser measurements.
  VIEW.cards = (w <= 640 ? [355,400,355,410,390,470] : [360,420,370,420,390,440]).map(height => tripCardPlace(height));
  const points = [[.5,.5],[.25,.25],[.75,.25],[.25,.75],[.75,.75]].map(p => [p[0]*w,p[1]*h]);
  const flow = (a,b) => points.map(p => [(b.tx+(p[0]-a.tx)*b.s/a.s-p[0])/.016,(b.ty+(p[1]-a.ty)*b.s/a.s-p[1])/.016]);
  for (let i=0;i<GLIDES.length;i++) for (const direction of [1,-1]) {
    const g=GLIDES[i], a=BEATS[i+1], b=BEATS[i+2], from=direction>0?a:b, to=direction>0?b:a, D=glideSeconds(g);
    const cases=[...[.25,.5,.75].flatMap(f=>[{kind:'Back',f},{kind:'Next',f}]),{kind:'Back-Next',f:.5},{kind:'go-back',f:.5},{kind:'go-next',f:.5},...[.9,.95,.99].map(f=>({kind:direction>0?'Back':'Next',f}))];
    for (const test of cases) {
      JOURNEY.set(from.P); advance(0); direction>0?JOURNEY.next():JOURNEY.back();
      const start=Math.round(D*1000*test.f/16)*16, frames=new Map();
      frames.set(-start,{P:JOURNEY.P,cam:tripState(JOURNEY.P).cam});
      for(let ms=16;ms<=start;ms+=16){const st=advance(16);frames.set(ms-start,{P:st.P,cam:st.cam});}
      const label=`${w} ${from.id}->${to.id} ${test.kind} ${test.f}`, hurry=test.kind==='Next'&&direction>0;
      let since=0, eventAt=0, arrival=null, target, previous=frames.get(0).cam, speed=flow(frames.get(-16).cam,previous), peak=0, peakFive=0, acceleration=0, incoming=direction*(g.b-g.a)/D, micro=0;
      const events=[];
      const press=(kind)=>{
        const before=JOURNEY.P, back=kind==='Back'||kind==='go-back';
        target=back?a.P:b.P;
        if(kind==='Back')JOURNEY.back();else if(kind==='Next')JOURNEY.next();else JOURNEY.go(back?a.id:b.id);
        carryGate(JOURNEY.P===before,label+' press changed P');
        events.push({at:since,P:before,v:incoming,minimum:hurry?.45:Math.max(.35,D*Math.abs(target-before)/(g.b-g.a))});
        // Independent one-sided derivative probe, then complete the clock tick
        // below. This also works for a bounded rational quintic near a beat.
        const probe=advance(.0001);micro=.0001;
        carryGate(Math.abs((probe.P-before)/1e-7-incoming)<.002,label+' analytic incoming speed lost');
      };
      press(test.kind==='Back-Next'?'Back':test.kind);
      while(since<12000&&(arrival===null||since<arrival+32)){
        let st;
        if(test.kind==='Back-Next'&&since+4===300){const before=advance(4-micro-.0001);st=advance(.0001);incoming=(st.P-before.P)/1e-7;}
        else st=advance(4-micro);
        micro=0;since+=4;frames.set(since,{P:st.P,cam:st.cam});
        carryGate(st.P>=g.a-1e-9&&st.P<=g.b+1e-9,label+' crossed a beat');
        if(test.kind==='Back-Next'&&since===300){
          eventAt=300;previous=st.cam;speed=flow(frames.get(284).cam,previous);press('Next');
        }
        if(since>eventAt&&(since-eventAt)%16===0){
          const v=flow(previous,st.cam),acc=Math.hypot(...v[0].map((x,k)=>(x-speed[0][k])/.016));
          acceleration=Math.max(acceleration,acc);peak=Math.max(peak,Math.hypot(...v[0]));peakFive=Math.max(peakFive,...v.map(v=>Math.hypot(...v)));previous=st.cam;speed=v;
        }
        if(!JOURNEY.moving&&arrival===null)arrival=since;
      }
      carryGate(arrival!==null,label+' did not arrive');
      carryGate(JOURNEY.P===target,label+' arrival not exact');
      carryGate(acceleration<=Math.max(w,h)*(hurry?3:1.2)+1e-6,label+' acceleration '+acceleration.toFixed(2));
      if(hurry)carryGate(arrival/1000<D-start/1000,label+' hurry did not arrive sooner');
      for(const event of events){
        if(event===events.at(-1))carryGate((arrival-event.at)/1000>=event.minimum-1e-8,label+' duration below minimum');
      }
      const mid=frames.get(Math.floor(arrival/8)*4),movingCam=mid.cam;
      JOURNEY.set(mid.P);advance(0);assert.deepEqual(tripState(JOURNEY.P).cam,movingCam,label+' fresh set(P) camera');
      JOURNEY.set(target);advance(0);assert.deepEqual(tripState(JOURNEY.P).cam,frames.get(arrival+32).cam,label+' arrival did not settle');
      carryResults.push({view:`${w}x${h}`,kind:hurry?'hurry':test.kind==='Next'?'Next-reverse':test.kind,acceleration,peak,peakFive,seconds:Math.ceil((arrival-eventAt)/16)*.016,totalSeconds:Math.ceil(arrival/16)*.016});
    }
  }
}
console.log('D5 view | press | runs | worst centre acceleration | five-point peak | arrival range s | total range s');
for(const view of ['1440x900','390x844'])for(const kind of ['Back','hurry','Next-reverse','Back-Next','go-back','go-next']){
  const rows=carryResults.filter(r=>r.view===view&&r.kind===kind), range=k=>`${Math.min(...rows.map(r=>r[k])).toFixed(3)}-${Math.max(...rows.map(r=>r[k])).toFixed(3)}`;
  console.log(`${view} | ${kind} | ${rows.length} | ${Math.max(...rows.map(r=>r.acceleration)).toFixed(2)} | ${Math.max(...rows.map(r=>r.peakFive)).toFixed(2)} | ${range('seconds')} | ${range('totalSeconds')}`);
}
// A request with <450 ms left cannot last >=450 ms AND arrive sooner. Keep
// the uninterrupted curve in this contradictory case; never add a final jolt.
for(const [w,h,bar] of [[1440,900,120],[390,844,96]]){
  tripResize(w,h,bar);
  // Content-height fixtures exercise the new pair anchors, not the old 45/55 fallback. These are not browser measurements.
  VIEW.cards = (w <= 640 ? [355,400,355,410,390,470] : [360,420,370,420,390,440]).map(height => tripCardPlace(height));
  for(let i=0;i<GLIDES.length;i++){
    const from=BEATS[i+1],D=glideSeconds(GLIDES[i]),start=Math.round(D*.95/.016)*16;
    const begin=()=>{JOURNEY.set(from.P);advance(0);JOURNEY.next();for(let t=0;t<start;t+=16)advance(16);};
    begin();const expected=[];while(JOURNEY.moving)expected.push(advance(16).P);
    begin();JOURNEY.next();for(const P of expected)carryGate(Math.abs(advance(16).P-P)<1e-8,`${w} ${from.id} late hurry changed its curve`);
    carryGate(!JOURNEY.moving,`${w} ${from.id} late hurry delayed arrival`);
  }
}
if(carryFailures.length)console.log(`D5 FAIL ${carryFailures.length} checks: ${carryFailures.slice(0,16).join('; ')}`);
assert.deepEqual(failures,[]);
assert.equal(carryFailures.length,0,`${carryFailures.length} D5 carry checks failed`);
console.log('ok: 28 rest glides, 336 carry runs and 14 late-hurry guards; 16 ms acceleration/five probes, analytic continuity, bounded reversals through 99 percent, exact settled arrivals, faster feasible hurry and fresh set(P) equality');
