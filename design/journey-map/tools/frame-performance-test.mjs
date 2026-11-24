// Actual DOM-writer recording, not browser raster/FPS evidence.
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import * as data from '../data.mjs';
import * as art from '../art.mjs';
import * as current from '../trip.mjs';
const baseline=process.argv.includes('--baseline');
let api=current;
if(baseline){
  const packed=readFileSync(new URL('../dist/journey-map.html',import.meta.url),'utf8');
  const src=packed.split('// ---- trip.mjs ----\n')[1]?.split('// ---- depth.mjs ----')[0];
  assert.ok(src&&!src.includes('E.raster'),'--baseline requires the pre-change packed standalone');
  const deps={...data,...art};api=new Function(...Object.keys(deps),src+'\nreturn {tripBuild,tripResize,tripState,tripApply,VIEW,SEQ,labelScale};')(...Object.values(deps));
}
let total=0;
class RecordNode {
  constructor(dataset={}){this.attrs={};this.dataset=dataset;this.writes=0;this.style=new Proxy({}, {set:(o,k,v)=>{this.writes++;total++;o[k]=String(v);return true;}});this.parentElement=this;}
  setAttribute(k,v){this.attrs[k]=String(v);this.writes++;total++;}
  getAttribute(k){return this.attrs[k]??null;}
  appendChild(){}
  querySelector(){return new RecordNode();}
  querySelectorAll(){return [];}
}
globalThis.document={createElement:()=>new RecordNode()};
const labels=['name','sub','small','legend','marker'].map(label=>new RecordNode({label})),cam=new RecordNode(),svg=new RecordNode();
svg.querySelectorAll=s=>s==='.label-scale'?labels:s==='.coast'?[new RecordNode(),new RecordNode()]:[];
const els={svg,cam,...Object.fromEntries(['sea','fill','coastG','detail','finds','done','x','caption','cue','mini'].map(k=>[k,new RecordNode()]))};
api.tripBuild(els);api.tripResize(412,730,96);
const end=api.SEQ.find(s=>s.kind==='rest'),state=scale=>{const st=api.tripState(end.a);st.exploreK=1;st.exploring=true;st.exploreDt=1/60;st.cam={s:scale,tx:206-300*scale,ty:365-450*scale,ax:206,ay:365};return st;};
const initial=state(api.VIEW.s0);api.tripApply(initial);
const expected=labels.map(n=>Number(n.attrs.transform.slice(6,-1)));
const counts={cam:cam.writes,labels:labels.reduce((a,n)=>a+n.writes,0)},baseS=api.VIEW.s0;
function mapped(st){
  const m=cam.attrs.transform.match(/-?[\d.]+(?:e[+-]?\d+)?/g).map(Number),css=svg.style.transform;
  const outer=css&&css!=='none'?css.match(/-?[\d.]+(?:e[+-]?\d+)?/g).map(Number):[1,0,0,1,0,0];
  for(const p of [[0,0],[300,450],[600,900]]){
    const x=m[0]*p[0]+m[4],y=m[3]*p[1]+m[5];
    assert.ok(Math.abs(outer[0]*x+outer[4]-(st.cam.s*p[0]+st.cam.tx))<.1,'composited camera x');
    assert.ok(Math.abs(outer[3]*y+outer[5]-(st.cam.s*p[1]+st.cam.ty))<.1,'composited camera y');
  }
}
let last;
for(let i=1;i<=72;i++){
  const st=state(baseS*(1+2*i/72));st.exploreMoving=true;
  labels.forEach((n,j)=>{const k=api.labelScale(n.dataset.label,st.cam.s);if(Math.abs(k/expected[j]-1)>data.LABELS.epsilon)expected[j]=k;});
  api.tripApply(st);mapped(st);last=st;
}
const during={cam:cam.writes-counts.cam,labels:labels.reduce((a,n)=>a+n.writes,0)-counts.labels};
last.exploreMoving=false;let frames=1,pending=api.tripApply(last);mapped(last);
while(pending&&frames<30){frames++;pending=api.tripApply(last);mapped(last);}
console.log(`${baseline?'BEFORE':'AFTER'} 412x730 / 72 moving frames: #cam writes ${during.cam}; label writes ${during.labels}; recovery ${frames} frames / ${(frames/60*1000).toFixed(1)} ms`);
if(!baseline){
  assert.equal(during.cam,0);assert.equal(during.labels,0);assert.equal(cam.writes-counts.cam,1,'one camera commit after motion');assert.ok(frames/60<=.15,'label recovery <=150 ms');
  labels.forEach((n,i)=>assert.equal(n.attrs.transform,'scale('+expected[i]+')','same rest text scale as old epsilon writer'));
  assert.equal(svg.style.willChange,'transform, opacity');assert.equal(svg.style.overflow,'visible','pan reveals the complete map raster');
}
const idle=total;for(let i=0;i<20;i++)api.tripApply(last);assert.equal(total,idle,'identical idle frames write nothing');
if(!baseline){
  const stopped=state(baseS*3);stopped.exploreMoving=true;api.tripApply(stopped); // Interrupt a label recovery with another gesture.
  const zoom=state(baseS*2);zoom.exploreMoving=true;api.tripApply(zoom);mapped(zoom);zoom.exploreMoving=false;
  for(let i=0;i<12;i++)api.tripApply(zoom);mapped(zoom);
  api.tripResize(390,844,96);api.tripApply(api.tripState(end.a));assert.equal(svg.style.transform,'none');assert.equal(svg.style.willChange,'');assert.equal(svg.style.overflow,'');
  console.log('ok: compositor/virtual camera agree within original matrix rounding; one settle commit; rest label scales unchanged; interrupted zoom, resize/exit cleanup and zero idle writes');
}
