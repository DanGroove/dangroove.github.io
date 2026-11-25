// Load/hero/first-glide renderer trace, separate from the deferred cost pass.
import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {writeFileSync} from 'node:fs';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g',b=await combBBrowser(),fail=[];
let trace=[],done=false;
b.on('Tracing.dataCollected',p=>trace.push(...p.value));b.on('Tracing.tracingComplete',()=>done=true);
try{
 await b.send('Page.addScriptToEvaluateOnNewDocument',{source:`(()=>{
 const idle=window.requestIdleCallback;window.__eWarm=[];
 window.requestIdleCallback=(fn,opts)=>idle.call(window,d=>{const j=window.__jm,start=performance.now(),busy=!!(j?.moving||document.documentElement.classList.contains('jm-explore')||document.documentElement.classList.contains('jm-joined')&&!document.querySelector('[data-hero]')?.classList.contains('jm-away'));fn(d);window.__eWarm.push({start,ms:performance.now()-start,busy,kind:j?.P});},opts);
 })()`});
 for(const page of ['journey-map','journey-joined'])for(const[w,h]of[[412,730],[1440,900]]){
  await b.size(w,h);await b.send('Emulation.setCPUThrottlingRate',{rate:4});trace=[];done=false;
  await b.send('Tracing.start',{categories:'devtools.timeline,disabled-by-default-devtools.timeline,toplevel,v8.execute',transferMode:'ReportEvents'},null);
  await b.page('dist/'+page+'.html');await combBWait(page==='journey-joined'?6000:1500);
  await b.evaluate('window.__jm.go("map",{instant:true})');await combBWait(120);
  await b.evaluate('window.__jm.go("laurier")');await combBWait(2400);
  await b.evaluate('window.__jm.go("map",{instant:true})');await combBWait(9000);
  const warm=await b.evaluate('window.__eWarm');
  // Open before a resize-triggered warm-up can complete, then retain text for
  // a whole idle interval. No delayed row replacement may reach the screen.
  await b.evaluate('window.__jm.go("end",{instant:true});window.dispatchEvent(new Event("resize"));document.querySelector(".go-next").click()');
  await combBWait(1800);const a=await b.evaluate('[...document.querySelectorAll(".label-anchor text")].map(e=>e.innerHTML)');await combBWait(2000);const c=await b.evaluate('[...document.querySelectorAll(".label-anchor text")].map(e=>e.innerHTML)');
  if(JSON.stringify(a)!==JSON.stringify(c))fail.push(page+' '+w+' early Explore label changed');
  await b.send('Tracing.end',{},null);for(let n=0;n<100&&!done;n++)await combBWait(50);
  writeFileSync(root+'/warm-'+page+'-'+w+'.json',JSON.stringify({traceEvents:trace}));
  const threads=new Set(trace.filter(e=>e.name==='thread_name'&&e.args?.name==='CrRendererMain').map(e=>e.pid+':'+e.tid));
  const tasks=trace.filter(e=>e.ph==='X'&&/RunTask/.test(e.name)&&threads.has(e.pid+':'+e.tid));
  const max=Math.max(0,...warm.map(r=>r.ms)),over=tasks.filter(t=>t.dur>16000);
  console.log(page+' '+w+'x'+h+' CPU x4: '+warm.length+' idle callbacks; max '+max.toFixed(2)+' ms; busy callbacks '+warm.filter(r=>r.busy&&r.ms>1).length+'; renderer tasks '+tasks.length+', over16 '+over.length+' (includes initial load/paint). Early Explore unchanged.');
  console.log('Longest renderer task children '+JSON.stringify(over.sort((a,b)=>b.dur-a.dur).slice(0,4).map(t=>({ms:t.dur/1000,children:trace.filter(e=>e.ph==='X'&&e.pid===t.pid&&e.tid===t.tid&&e.ts>=t.ts&&e.ts+(e.dur||0)<=t.ts+t.dur&&e!==t).sort((a,b)=>(b.dur||0)-(a.dur||0)).slice(0,5).map(e=>({name:e.name,ms:e.dur/1000,data:e.args?.data}))}))));
  if(!warm.length||max>8)fail.push(page+' '+w+' warm slice '+max.toFixed(2)+' ms');
  if(warm.some(r=>r.busy&&r.ms>1))fail.push(page+' '+w+' warm during motion');
  await b.send('Emulation.setCPUThrottlingRate',{rate:1});
 }
}finally{await b.close();}
console.log('Failures: '+JSON.stringify(fail));process.exitCode=fail.length?1:0;
