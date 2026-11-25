// D1 only: one second of renderer task slices. Never imports or launches frame-cost.
import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {appendFileSync} from 'node:fs';
const b=await combBBrowser(),output=[],failures=[],log=s=>{console.log(s);output.push(s);};
let trace=[],done=false;
b.on('Tracing.dataCollected',p=>trace.push(...p.value));b.on('Tracing.tracingComplete',()=>done=true);
try{
 for(const page of process.argv.includes('--diagnose')?['journey-map']:['journey-map','journey-joined'])for(const[w,h]of process.argv.includes('--diagnose')?[[412,730],[390,844]]:[[412,730],[390,844],[360,640],[1440,900]]){
  await b.size(w,h);await b.page('dist/'+page+'.html');await b.evaluate('window.__jm.go("end",{instant:true})');await combBWait(2000);trace=[];done=false;
  await b.send('Tracing.start',{categories:'devtools.timeline,disabled-by-default-devtools.timeline,toplevel',transferMode:'ReportEvents'},null);
  await b.evaluate('document.querySelector(".go-next").click()');await combBWait(1000);await b.send('Tracing.end',{},null);
  for(let i=0;i<100&&!done;i++)await combBWait(50);
  const threads=new Set(trace.filter(e=>e.name==='thread_name'&&e.args?.name==='CrRendererMain').map(e=>e.pid+':'+e.tid));
  const tasks=trace.filter(e=>e.ph==='X'&&/RunTask/.test(e.name)&&threads.has(e.pid+':'+e.tid)),max=Math.max(0,...tasks.map(e=>e.dur/1000));
  log(page+' '+w+'x'+h+': '+tasks.length+' renderer RunTask slices; max '+max.toFixed(3)+' ms; over 16 ms '+tasks.filter(e=>e.dur>16000).length);
  if(process.argv.includes('--diagnose'))for(const t of tasks.filter(e=>e.dur>16000))log('slow task detail '+JSON.stringify(trace.filter(e=>e.ph==='X'&&e.pid===t.pid&&e.tid===t.tid&&e.ts>=t.ts&&e.ts+(e.dur||0)<=t.ts+t.dur&&e!==t).sort((a,b)=>(b.dur||0)-(a.dur||0)).slice(0,12).map(e=>({name:e.name,ms:e.dur/1000,data:e.args?.data}))));
  if(!tasks.length||max>16)failures.push(page+' '+w+' task max '+max.toFixed(3)+' ms, '+tasks.length+' slices');
 }
}catch(e){failures.push(e.stack);}finally{await b.close();log('Failures: '+JSON.stringify(failures));appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2/inherited-tests.log','\n## node tools/comb-d-opening-test.mjs '+process.argv.slice(2).join(' ')+' (exit '+(failures.length?1:0)+')\n\n```text\n'+output.join('\n').replace(/[^\x00-\x7f]/g,'?')+'\n```\n');}
process.exitCode=failures.length?1:0;
