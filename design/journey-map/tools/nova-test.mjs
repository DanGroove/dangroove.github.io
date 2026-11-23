// Node recording fakes only. No pixels, browser, layout, or device performance are checked.
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { C, MAP, NOVA, DEPTH, EXPLORE, STEPS } from '../data.mjs';
import { mapDefs } from '../art.mjs';
import { tripBuild, tripResize, tripState, tripApply, SEQ, VIEW, smooth, novaBuild, novaBuildGather } from '../trip.mjs';
import { starsBuild, starsResize, starsTick, starsFrame, novaGatherPoint } from '../stars.mjs';
import { footerBuild, footerBuildX, footerNovaResize, footerFrame, footerMotion } from '../footer.mjs';

class NovaNode {
  constructor() {
    this.attrs = {}; this.writes = 0; this.listeners = {}; this.classList = { contains: () => false };
    this.style = new Proxy({}, { set: (o, k, v) => { this.writes++; o[k] = String(v); return true; } });
  }
  setAttribute(k, v) { this.writes++; this.attrs[k] = String(v); }
  getAttribute(k) { return this.attrs[k] ?? null; }
  addEventListener(k, fn) { this.listeners[k] = fn; }
  appendChild() {}
  querySelectorAll() { return []; }
  querySelector() { return new NovaNode(); }
  set tabIndex(v) { this.writes++; this.tab = v; }
  get tabIndex() { return this.tab; }
}
const contexts = [], images = [];
function novaContext() {
  const calls = [], state = [], ctx = { calls, globalAlpha: 1, lineWidth: 1, strokeStyle: '', fillStyle: '' };
  for (const name of ['setTransform','clearRect','drawImage','fillRect','translate','rotate','scale','setLineDash','beginPath','moveTo','lineTo','quadraticCurveTo','closePath','arc','stroke','fill']) ctx[name] = (...args) => calls.push({ name, args, alpha: ctx.globalAlpha, width: ctx.lineWidth, colour: ctx.strokeStyle });
  ctx.save = () => { state.push({ globalAlpha:ctx.globalAlpha, lineWidth:ctx.lineWidth, strokeStyle:ctx.strokeStyle, fillStyle:ctx.fillStyle }); };
  ctx.restore = () => Object.assign(ctx,state.pop());
  for (const name of ['createLinearGradient','createRadialGradient']) ctx[name] = (...args) => { const gradient = { stops:[], addColorStop(at, colour) { this.stops.push([at,colour]); } }; calls.push({ name,args,gradient }); return gradient; };
  contexts.push(ctx); return ctx;
}
function novaCanvas() { const cv = new NovaNode(), ctx = novaContext(); cv.getContext = () => ctx; cv.ctx = ctx; return cv; }
globalThis.window = { devicePixelRatio: 3, addEventListener() {} };
globalThis.document = { createElement: tag => tag === 'canvas' ? novaCanvas() : new NovaNode() };
globalThis.Image = class { constructor() { images.push(this); } set src(v) { this.source = v; } };

// Build the footer with the independent name renderer disabled, then enable only the nova writer.
const inner = new NovaNode(), span = new NovaNode(), rule = new NovaNode(), footer = new NovaNode();
footer.querySelector = s => s === '.ft-in' ? inner : s === '.ft-name span' ? span : rule;
footerBuild(footer,true);
const x = new NovaNode(), canvas = novaCanvas(), hit = new NovaNode();
footerBuildX(x,false,canvas,hit);
assert.equal((x.innerHTML.match(/class="fx-red"/g)||[]).length,2);
assert.ok(!/fx-(?:rg|og|rays|lobes|waves|flares|streaks|ringr|ring|r1|r2|core|white|hit)\b|fxray/.test(x.innerHTML));
assert.equal(hit.listeners.keydown,undefined,'native button owns keyboard activation');
const main = readFileSync(new URL('../main.mjs',import.meta.url),'utf8');
assert.match(main,/<svg id="map"[^]*?<\/svg>\s*<canvas id="nova" aria-hidden="true"><\/canvas>\s*<canvas id="stars"/);
assert.ok(main.indexOf('id="nova-hit"') < main.indexOf('class="cards"'),'press target precedes cards/footer');
assert.match(main, /RM \? '' : `<button type="button" class="fx-hit"/);
console.log('ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is omitted in reduced motion');

const all = [], node = () => { const n = new NovaNode(); all.push(n); return n; };
const svg=node(), cam=node(), sea=node(), fill=node(), coastG=node(), detail=node(), finds=node(), done=node(), mini=node(), tier=node(), subs=node(), subHome=node(), ship=node(), coasts=[node(),node()];
subs.parentElement=subHome;svg.parentElement=node();
svg.querySelector = s => ({'.map-tier2':tier,'.map-subs':subs,'.ls-ship':ship})[s];
svg.querySelectorAll = s => s === '.coast' ? coasts : [];
tripBuild({svg,cam,sea,fill,coastG,detail,finds,done,mini,caption:node(),cue:node()});
tripResize(1440,900,120);footerNovaResize(1440,900);
assert.equal(canvas.width,2880);assert.equal(canvas.height,1800);
assert.equal(images.length,1,'rough stroke image is prepared at resize');
let rough = decodeURIComponent(images[0].source.split(',').slice(1).join(','));
assert.ok(rough.includes(mapDefs().match(/<filter id="rough"[^]*?<\/filter>/)[0]));
assert.match(rough,/viewBox="-20 -8 40 16"/);assert.match(rough,/d="M-12.7 0H12.7"/);
const segment = (kind,t) => { const q=SEQ.find(s=>s.kind===kind);return tripState(q.a+q.len*t); };
const run = (st,dt=0) => { tripApply(st);footerFrame(st);footerMotion(1,dt,st,[0,0],false); };
const count = name => canvas.ctx.calls.filter(c=>c.name===name).length;
run(segment('rush',0));assert.equal(canvas.ctx.calls.length,0,'before rush canvas stays empty');
run(segment('rush',.001));assert.equal(count('clearRect'),1);assert.equal(x.style.visibility,'hidden');
assert.ok(canvas.ctx.calls.some(c=>c.name==='stroke'&&c.colour===C.red&&c.width===3.6),'plain round stroke is available before image loads');
images[0].onload();
for (const [kind,t] of [['rush',.2],['blast',.2],['settle',.6]]) {
  const st=segment(kind,t), before=count('clearRect');run(st,.016);run(st,.016);assert.equal(count('clearRect'),before+2,kind+' draws every frame');
  const mapping=canvas.ctx.calls.filter(c=>c.name==='setTransform'&&c.args[0]===2).at(-1).args;
  assert.deepEqual(mapping,[2,0,0,2,(MAP.x[0]*st.cam.s+st.cam.tx)*2,(MAP.x[1]*st.cam.s+st.cam.ty)*2]);
  all.forEach(n=>n.writes=0);x.writes=hit.writes=0;run(st,0);
  assert.equal(all.reduce((sum,n)=>sum+n.writes,0)+x.writes,0,kind+' identical frame does not write SVG');
  assert.equal(hit.writes,0,kind+' identical frame does not write press target');
}
assert.ok(canvas.ctx.calls.some(c=>c.name==='drawImage'&&c.args[0].ctx?.calls.some(call=>call.name==='drawImage'&&call.args[0]===images[0])),'ready rough sprite is drawn');
assert.equal(hit.getAttribute('aria-disabled'),'true');assert.equal(hit.tabIndex,-1);
const before=count('clearRect');run(segment('rush',0));assert.equal(count('clearRect'),before+1);assert.equal(x.style.visibility,'visible');
run(segment('rush',0));assert.equal(count('clearRect'),before+1,'hidden nova clears once then stops');
const partial=segment('blast',.2);run(partial);assert.equal(+svg.style.opacity,partial.dim*(1-smooth(...DEPTH.fade.blast,partial.blastT)));
for(const g of [sea,fill,coastG,detail,finds,done])assert.equal(g.style.opacity,'1','blast does not fade individual groups');
assert.equal(svg.style.willChange,'opacity');
run(segment('blast',.8));assert.equal(svg.style.opacity,'0');assert.equal(svg.style.visibility,'hidden');assert.equal(svg.style.willChange,'');
const explored=segment('rest',0);explored.exploreK=.5;explored.sEnd=explored.cam.s*2;explored.cam.s/=2;explored.dim=.6;
run(explored);assert.equal(svg.style.visibility,'visible');assert.equal(svg.style.willChange,'opacity');assert.equal(canvas.style.opacity,'0.6');
assert.equal(hit.getAttribute('aria-disabled'),'false');assert.equal(hit.tabIndex,0);
assert.equal(hit.style.width,(NOVA.flare.hit*explored.cam.s/explored.sEnd*2).toFixed(2)+'px');
explored.exploreK=1;run(explored);assert.equal(svg.style.willChange,'');
console.log('ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade');

// Grow after a ready sprite, and verify that its raster density covers the largest visible red stroke.
const imageCount=images.length;tripResize(2400,1600,120);footerNovaResize(2400,1600);assert.ok(images.length>imageCount);
rough=decodeURIComponent(images.at(-1).source.split(',').slice(1).join(','));
const rasterWidth=+rough.match(/width="(\d+)"/)[1];assert.ok(rasterWidth>=40*Math.max(VIEW.s0,VIEW.sT*EXPLORE.most)*NOVA.base.rushLen*2);
// D3: sample the real score, renderer and gathering stars. Recording only, no pixels.
assert.equal(STEPS.pace.rush,3);
const scoreFrames=Array.from({length:3001},(_,i)=>novaBuild(i/3000));
assert.ok(scoreFrames.every(frame=>Math.hypot(...frame.jitter)<=2),'screen jitter magnitude stays within 2 px');
for(let i=scoreFrames.length-1;i>=0;i--)assert.deepEqual(novaBuild(i/3000),scoreFrames[i],'reverse score must reproduce forward values');
const maxima=[];
for(let i=601;i<2280;i++)if(scoreFrames[i].glow>scoreFrames[i-1].glow&&scoreFrames[i].glow>scoreFrames[i+1].glow)maxima.push(i);
assert.equal(maxima.length,4);maxima.forEach((at,i)=>{assert.ok(Math.abs(at/3000-NOVA.build.throbs[i])<.001);if(i){assert.ok((at-maxima[i-1])/1000>=.34);assert.ok(scoreFrames[at].glow>scoreFrames[maxima[i-1]].glow);}});
for(const phone of [false,true])for(let ms=0;ms<=2984;ms++){
  const a=novaBuild(ms/3000,phone),b=novaBuild((ms+16)/3000,phone);
  for(const key of ['glowAlpha','veil','coreAlpha','heat'])assert.ok(Math.abs(a[key]-b[key])<=.08+1e-9,key+' 16 ms delta at '+ms);
}
assert.ok(novaBuild(.93).len<novaBuild(.72).len);assert.equal(novaBuild(1).len,NOVA.build.compressed);assert.deepEqual(novaBuild(.93).jitter,[0,0]);
for(let order=0;order<=1;order+=.01){const q=novaBuildGather(.93,order);assert.equal(q,1);assert.deepEqual(novaGatherPoint([10,20],[500,400],order*6,150,q),[500,400]);}
for(const size of [[1440,900,120],[390,844,96]]){
  tripResize(...size);footerNovaResize(size[0],size[1]);
  const rush=segment('rush',.76), blast=segment('blast',.4/STEPS.pace.blast);
  const savedPush=NOVA.build.push,savedPhone=NOVA.build.pushPhone;NOVA.build.push=NOVA.build.pushPhone=0;
  const base=segment('rush',.76),recoiled=segment('blast',.4/STEPS.pace.blast);NOVA.build.push=savedPush;NOVA.build.pushPhone=savedPhone;
  assert.ok(Math.abs(rush.cam.s/base.cam.s-1-(VIEW.phone?savedPhone:savedPush))<1e-9);
  assert.deepEqual(blast.cam,recoiled.cam);
  assert.ok(Math.hypot(...[0,1].map(i=>MAP.x[i]*rush.cam.s+(i?rush.cam.ty:rush.cam.tx)-MAP.x[i]*base.cam.s-(i?base.cam.ty:base.cam.tx)))<1e-9,'push anchors on X');
}
tripResize(1440,900,120);footerNovaResize(1440,900);
const canvasSnapshot=t=>{canvas.ctx.calls.length=0;run(segment('rush',t),.017);return JSON.stringify(canvas.ctx.calls.map(c=>[c.name,c.args.map(a=>typeof a==='number'?+a.toFixed(8):a?.stops||a?.constructor?.name||a),/^(drawImage|fill|fillRect|stroke)$/.test(c.name)?c.alpha:null]));};
const recorded=[.001,.16,.26,.45,.60,.72,.82,.92,.96].map(t=>[t,canvasSnapshot(t)]);
for(const [t,frame] of recorded.slice().reverse())assert.equal(canvasSnapshot(t),frame,'actual canvas repeats and reverses');
canvas.ctx.calls.length=0;run(segment('blast',.00001));
const scale=canvas.ctx.calls.find(c=>c.name==='scale');assert.ok(scale.args[0]/segment('blast',.00001).cam.s>=NOVA.build.compressed&&scale.args[0]/segment('blast',.00001).cam.s<.602,'blast starts compressed');
for(const dpr of [1,3]){
  window.devicePixelRatio=dpr;footerNovaResize(1440,900);canvas.ctx.calls.length=0;run(segment('rush',.00000001));
  const redScale=canvas.ctx.calls.find(c=>c.name==='scale').args;
  assert.ok(Math.abs(redScale[0]-segment('rush',.00000001).cam.s)<1e-8&&Math.abs(redScale[1]-segment('rush',.00000001).cam.s)<1e-8,'handoff keeps SVG length/3.6 width');
  assert.ok(canvas.ctx.calls.some(c=>c.name==='drawImage'&&c.args[1]===-20&&c.args[2]===-8),'handoff uses rough sprite in original user space');
}
const starCanvas=novaCanvas();starsBuild(starCanvas);starsResize(1440,900);
const starSnapshot=(t,time)=>{starCanvas.ctx.calls.length=0;const st=segment('rush',t);starsTick(.1,st);starsFrame(time,st,[.5,.5]);return JSON.stringify(starCanvas.ctx.calls.map(c=>[c.name,c.args,/^(fill|fillRect|stroke)$/.test(c.name)?c.alpha:null]));};
const starForward=[.01,.26,.45,.60,.72,.83,.93,.97].map(t=>[t,starSnapshot(t,3)]);
for(const [t,frame] of starForward.slice().reverse())assert.ok(starSnapshot(t,200)===frame,'stars ignore elapsed clock during rush at '+t);
starSnapshot(.93,1);const heldState=segment('rush',.93),heldX=[MAP.x[0]*heldState.cam.s+heldState.cam.tx,MAP.x[1]*heldState.cam.s+heldState.cam.ty];assert.ok(!starCanvas.ctx.calls.some(c=>(c.name==='fillRect'||c.name==='arc')&&Math.hypot(c.args[0]-heldX[0],c.args[1]-heldX[1])<3),'gathered stars vanish before held breath');
// The actual writer already has zero identical-frame map writes; reject new SVG effects too.
assert.ok(!/createElementNS|findSvg\(/.test(readFileSync(new URL('../footer.mjs',import.meta.url),'utf8')));
console.log('ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart; 16 ms alpha deltas <=.08; gather complete at .93; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3');
const rmX=new NovaNode(),rmCanvas=novaCanvas();footerBuildX(rmX,true,rmCanvas,hit);footerNovaResize(390,844);footerMotion(2,.016,segment('rest',0),[0,0],true);
assert.equal(rmCanvas.ctx.calls.length,0);assert.equal(rmX.style.visibility,undefined);assert.ok(!/fx-hit|fx-white/.test(rmX.innerHTML));
console.log('ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged');
