import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {combDInk} from './comb-d-ink-test.mjs';
import {FINDS,MAP,STOPS,MARK,NOVA,EXPLORE} from '../data.mjs';
import {appendFileSync} from 'node:fs';
const b=await combBBrowser(),failures=[],output=[];
const log=s=>{console.log(s);output.push(s);},require=(ok,s)=>{if(!ok)failures.push(s);};
function geometry(constants){
 const rect=e=>{const b=e.getBoundingClientRect();return[b.left,b.top,b.right,b.bottom];};
 const matrix=document.getElementById('cam').getScreenCTM(),scale=Math.hypot(matrix.a,matrix.b),frame=[new DOMPoint(23,23).matrixTransform(matrix),new DOMPoint(577,818).matrixTransform(matrix)];
 const rows=[...document.querySelectorAll('.label-anchor')].filter(e=>e.querySelector('[data-stop-sub="false"]')).map((e,i)=>{
  const box=rect(e.querySelector('text')),p=constants.points[i],stone=i<6?document.querySelector('#stop-'+constants.ids[i]+' .stone'):null,r=stone?rect(stone):null;
  const centre=r?[(r[0]+r[2])/2,(r[1]+r[3])/2]:[matrix.a*p[0]+matrix.e,matrix.d*p[1]+matrix.f],radius=r?(r[2]-r[0])*constants.rim:8;
  let distance=Math.hypot(Math.max(box[0]-centre[0],0,centre[0]-box[2]),Math.max(box[1]-centre[1],0,centre[1]-box[3]))-radius;
  if(!r){
   // The X is the remnant's two diagonal strokes, not an invented fixed circle.
   // This minimum-length subset is inside the breathing stroke at every clock.
   const reach=constants.spike*scale/constants.endScale;distance=Infinity;
   for(const angle of constants.angles)for(let n=-64;n<=64;n++){const t=n/64,x=centre[0]+Math.cos(angle)*reach*t,y=centre[1]+Math.sin(angle)*reach*t;distance=Math.min(distance,Math.hypot(Math.max(box[0]-x,0,x-box[2]),Math.max(box[1]-y,0,y-box[3])));}
  }
  const world=[(box[0]-matrix.e)/scale,(box[1]-matrix.f)/scale,(box[2]-matrix.e)/scale,(box[3]-matrix.f)/scale];
  return{text:e.textContent,anchor:[e.transform.baseVal.consolidate().matrix.e,e.transform.baseVal.consolidate().matrix.f],box,world,distance,height:box[3]-box[1],frame:box[0]>=frame[0].x-.5&&box[1]>=frame[0].y-.5&&box[2]<=frame[1].x+.5&&box[3]<=frame[1].y+.5,screen:box[0]>=-.5&&box[2]<=innerWidth+.5,lines:e.querySelectorAll('tspan').length};
 });const subs=[...document.querySelectorAll('.label-scale[data-stop-sub="true"]')].map(e=>{const a=e.closest('.label-anchor');return {text:a.textContent,box:rect(e.querySelector('text')),from:Number(a.dataset.exploreFrom),opacity:Number(getComputedStyle(a).opacity),name:Math.floor(Number(a.dataset.row)/2)};});return{scale,rows,subs};
}
const constants={points:[...STOPS.map(s=>MAP.waypoints[s.w]),MAP.x],ids:STOPS.map(s=>s.id),rim:(MARK.radius+MARK.rim/2)/MARK.box,spike:NOVA.base.spikeEnd*EXPLORE.calmScale*(1-NOVA.spike[1])*(1-NOVA.pulse[1]-NOVA.pulse[3])*.95,angles:NOVA.base.angles.map(a=>a*Math.PI/180)};
try{
 for(const page of ['journey-map','journey-joined'])for(const[w,h]of[[412,730],[390,844],[360,640],[1440,900]]){
  await b.size(w,h);await b.page('dist/'+page+'.html');await b.evaluate('window.__jm.go("end",{instant:true})');await combBWait(1700);
  constants.endScale=await b.evaluate('document.getElementById("cam").getScreenCTM().a');
  await b.evaluate(`window.__dOpening=[];window.__dLong=[];window.__dObs=new PerformanceObserver(l=>window.__dLong.push(...l.getEntries().map(e=>({start:e.startTime,duration:e.duration}))));window.__dObs.observe({entryTypes:['longtask']});window.__dStart=performance.now();window.__dTimer=setInterval(()=>window.__dOpening.push((${geometry.toString()})(${JSON.stringify(constants)})),100);document.querySelector('.go-next').click()`);
  await combBWait(1900);
  const opening=await b.evaluate('(()=>{clearInterval(window.__dTimer);window.__dObs.disconnect();return {frames:window.__dOpening,long:window.__dLong.filter(e=>e.start-window.__dStart<1000)}})()');
  require(!opening.long.some(e=>e.duration>16),page+' '+w+' opening long task '+JSON.stringify(opening.long));
  // World-normalized offsets remove camera travel; residual motion is the label's own.
  let jump=0;for(let i=1;i<opening.frames.length;i++)for(let j=0;j<7;j++){const a=opening.frames[i-1],c=opening.frames[i];jump=Math.max(jump,Math.hypot(c.rows[j].anchor[0]-a.rows[j].anchor[0],c.rows[j].anchor[1]-a.rows[j].anchor[1])*Math.min(a.scale,c.scale));}
  require(jump<=2.01,page+' '+w+' opening label drift '+jump.toFixed(2));
  require(opening.frames.some(f=>f.subs.some(s=>s.opacity>0&&s.opacity<1)),page+' '+w+' no intermediate sub-line fade');
  const idle=await b.evaluate(`new Promise(resolve=>{const records=[],observer=new MutationObserver(rows=>records.push(...rows.map(r=>r.attributeName||r.type)));document.querySelectorAll('.label-anchor').forEach(e=>observer.observe(e,{attributes:true,childList:true,subtree:true}));setTimeout(()=>{observer.disconnect();resolve(records);},350);})`);
  require(!idle.length,page+' '+w+' new idle label writes '+JSON.stringify(idle));
  log(page+' '+w+' opening anchors: max drift '+jump.toFixed(2)+' px; idle label writes '+idle.length);
  for(let z=0;z<4;z++){
   if(z){await b.evaluate(`(()=>{const p=window.__jm.finds.place('well');for(let i=0;i<${z===3?18:3};i++)document.getElementById('stage').dispatchEvent(new WheelEvent('wheel',{clientX:p[0],clientY:p[1]-30,deltaY:-120,ctrlKey:${z===3},bubbles:true,cancelable:true}));})()`);await combBWait(1300);}
   const g=await b.evaluate('('+geometry.toString()+')('+JSON.stringify(constants)+')'),ink=await b.evaluate('('+combDInk.toString()+')()');
   for(const r of g.rows){require(r.frame,page+' '+w+' z'+z+' outside frame '+r.text);if(!z)require(r.screen,page+' '+w+' rest clipped '+r.text);require(r.distance<=r.height+.6,page+' '+w+' z'+z+' rim gap '+r.text+' '+r.distance.toFixed(2)+' > '+r.height.toFixed(2));require(r.lines<=1,page+' '+w+' wrapped '+r.text);}
   for(const s of g.subs){if(z===3)require(Number.isFinite(s.from),page+' '+w+' sub-line never fits '+s.text);if(s.opacity>.02)require(s.box[1]>=g.rows[s.name].box[3]-.5,page+' '+w+' sub-line above its name '+s.text);}
   for(const r of ink)require(r.gap>=1.9,page+' '+w+' z'+z+' ink '+r.text+' '+r.gap+' '+r.who);
   log(page+' '+w+'x'+h+' z'+z+': '+JSON.stringify({names:g.rows.map(r=>({t:r.text,gap:+r.distance.toFixed(2),h:+r.height.toFixed(2)})),ink:ink.map(r=>({t:r.text,gap:r.gap})),openingJump:+jump.toFixed(2),long:opening.long}));
   await b.shot('after-'+page+'-'+w+'x'+h+'-explore-'+z);
  }
 }
 require(!b.errors.length,'browser exceptions '+JSON.stringify(b.errors));
}catch(e){failures.push(e.stack);}finally{await b.close();log('Failures: '+JSON.stringify(failures));appendFileSync('COMB-D-BUILD.md','\n## node tools/comb-d-layout-test.mjs (exit '+(failures.length?1:0)+')\n\n```text\n'+output.join('\n').replace(/[^\x00-\x7f]/g,'?')+'\n```\n');}
process.exitCode=failures.length?1:0;
