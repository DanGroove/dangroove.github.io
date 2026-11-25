// D1's opening ink gate advances a controlled rAF clock between measurements.
// Its geometry queries therefore cannot contaminate the separate timing trace.
import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {combDInk} from './comb-d-ink-test.mjs';
import {combDClock,combDAdvance} from './comb-d-clock-test.mjs';
import {MAP,STOPS,MARK,NOVA,EXPLORE} from '../data.mjs';
import {appendFileSync} from 'node:fs';
const constants={points:[...STOPS.map(s=>MAP.waypoints[s.w]),MAP.x],ids:STOPS.map(s=>s.id),rim:(MARK.radius+MARK.rim/2)/MARK.box,spike:NOVA.base.spikeEnd*EXPLORE.calmScale*(1-NOVA.spike[1])*(1-NOVA.pulse[1]-NOVA.pulse[3])*.95,angles:NOVA.base.angles.map(a=>a*Math.PI/180)};
function measure(C){
 const m=document.getElementById('cam').getScreenCTM(),s=Math.hypot(m.a,m.b),rect=e=>{const r=e.getBoundingClientRect();return[r.left,r.top,r.right,r.bottom];};
 const visible=e=>{for(let p=e;p&&p!==document.body;p=p.parentElement){const v=getComputedStyle(p);if(v.visibility==='hidden'||v.display==='none'||Number(v.opacity)<.02)return false;}return true;};
 const frame=[new DOMPoint(23,23).matrixTransform(m),new DOMPoint(577,818).matrixTransform(m)];
 return [...document.querySelectorAll('.label-anchor')].filter(e=>e.querySelector('[data-stop-sub="false"]')).map((e,i)=>{
  const b=rect(e.querySelector('text')),r=i<6?rect(document.querySelector('#stop-'+C.ids[i]+' .stone')):null,p=C.points[i],c=r?[(r[0]+r[2])/2,(r[1]+r[3])/2]:[m.a*p[0]+m.e,m.d*p[1]+m.f];
  const d=(x,y)=>Math.hypot(Math.max(b[0]-x,0,x-b[2]),Math.max(b[1]-y,0,y-b[3]));let gap=r?d(...c)-(r[2]-r[0])*C.rim:Infinity;
  if(!r)for(const a of C.angles)for(let n=-64;n<=64;n++){const t=n/64*C.spike*s/C.endScale;gap=Math.min(gap,d(c[0]+Math.cos(a)*t,c[1]+Math.sin(a)*t));}
  return {text:e.textContent,visible:visible(e),world:[(b[0]-m.e)/s,(b[1]-m.f)/s],s,gap,height:b[3]-b[1],frame:b[0]>=frame[0].x-.5&&b[1]>=frame[0].y-.5&&b[2]<=frame[1].x+.5&&b[3]<=frame[1].y+.5,lines:e.querySelectorAll('tspan').length};
 });
}
const b=await combBBrowser(),output=[],failures=[],log=s=>{console.log(s);output.push(s);};
try{
 await combDClock(b);
 for(const page of ['journey-map','journey-joined'])for(const[w,h]of[[412,730],[390,844],[360,640],[1440,900]]){
  await b.size(w,h);await b.page('dist/'+page+'.html');await b.evaluate('window.__jm.go("end",{instant:true})');await combDAdvance(b,2000);await combBWait(2000);
  constants.endScale=await b.evaluate('document.getElementById("cam").getScreenCTM().a');
  let previous=await b.evaluate('('+measure.toString()+')('+JSON.stringify(constants)+')');
  await b.evaluate('window.__dT=performance.now();document.querySelector(".go-next").click()');let worstJump=0,inkMisses=0,geometryMisses=0;const collisions=new Map();
  for(let i=0;i<=16;i++){
   if(i)await combDAdvance(b,100);
   const rows=await b.evaluate('('+measure.toString()+')('+JSON.stringify(constants)+')'),ink=await b.evaluate('('+combDInk.toString()+')()');
   for(let j=0;j<rows.length;j++){const r=rows[j],p=previous[j];if(r.visible&&p.visible)worstJump=Math.max(worstJump,Math.hypot(r.world[0]-p.world[0],r.world[1]-p.world[1])*Math.min(r.s,p.s));if(r.visible&&(!r.frame||r.gap>r.height+.6||r.lines>1)){geometryMisses++;collisions.set('geometry '+r.text,{ms:i*100,...r});}}
   for(const r of ink)if(r.gap<1.9){inkMisses++;collisions.set('ink '+r.text,{ms:i*100,text:r.text,gap:r.gap,who:r.who});}
   previous=rows;
  }
  const result={worstJump:+worstJump.toFixed(2),geometryMisses,inkMisses,examples:[...collisions.values()]};log(page+' '+w+'x'+h+' controlled-rAF 0..1600 ms: '+JSON.stringify(result));
  if(!previous.some(r=>r.visible)||worstJump>2.01||geometryMisses||inkMisses)failures.push(page+' '+w+' opening '+JSON.stringify({jump:result.worstJump,geometryMisses,inkMisses,visibleAtRest:previous.some(r=>r.visible)}));
 }
}catch(e){failures.push(e.stack);}finally{await b.close();log('Failures: '+JSON.stringify(failures));appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-e/inherited-tests.log','\n## node tools/comb-d-opening-ink-test.mjs (exit '+(failures.length?1:0)+')\n\n```text\n'+output.join('\n').replace(/[^\x00-\x7f]/g,'?')+'\n```\n');}
process.exitCode=failures.length?1:0;
