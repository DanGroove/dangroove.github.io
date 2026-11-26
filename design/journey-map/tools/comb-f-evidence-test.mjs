import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {combDClock,combDAdvance} from './comb-d-clock-test.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import {FINDS} from '../data.mjs';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3',tag=process.argv[2]||'before',mode=process.argv[3]||'capture',b=await combBBrowser();
const quant=a=>{a.sort((a,b)=>a-b);return {n:a.length,p50:a[Math.floor(a.length*.5)]||0,p95:a[Math.floor(a.length*.95)]||0,max:a.at(-1)||0};};
let trace=[],done=false;b.on('Tracing.dataCollected',p=>trace.push(...p.value));b.on('Tracing.tracingComplete',()=>done=true);
try{
 if(mode==='capture'){
  await combDClock(b);
  for(const[w,h]of[[412,730],[360,640],[1440,900]]){
   await b.size(w,h);let html=readFileSync('dist/journey-map.html','utf8').replace('</script>','\nwindow.__fFocus=stepsFocus;window.__fView=findView;\n</script>');
   await b.send('Page.navigate',{url:'data:text/html;base64,'+Buffer.from(html).toString('base64')});await combBWait(700);await b.evaluate('document.fonts.ready.then(()=>true)');await combDAdvance(b,2000);
   const go=async id=>{await b.key('Escape');await combDAdvance(b,900);await b.evaluate(`window.__jm.go(${JSON.stringify(id)},{instant:true})`);await combDAdvance(b,2000);};
   await go('map');await b.shot(tag+'-'+w+'x'+h+'-overview');
   if(w!==360)for(const id of (w===412?['serpent','well','beacon','horn','hoard-hmc1']:['serpent'])){
    await b.send('Page.navigate',{url:'data:text/html;base64,'+Buffer.from(html).toString('base64')});await combBWait(500);await combDAdvance(b,2000);
    await go('map');await b.evaluate(`window.__fFocus(${JSON.stringify(id)},window.__fView(${JSON.stringify(id)}))`);await combDAdvance(b,1600);
    const presses=id.startsWith('hoard')?4:['horn','beacon'].includes(id)?1:0;
    for(let p=0;p<presses;p++){await b.evaluate(`document.getElementById('f-${id}').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))`);for(let k=0;k<14;k++)await combDAdvance(b,100);}
    await b.shot(tag+'-'+w+'x'+h+'-'+id);
   }
   await go('end');await b.evaluate('document.querySelector(".go-next").click()');await combDAdvance(b,2400);await b.shot(tag+'-'+w+'x'+h+'-explore');
   if(w===1440){await b.evaluate(`(()=>{const p=window.__jm.finds.place('well');for(let i=0;i<9;i++)document.getElementById('stage').dispatchEvent(new WheelEvent('wheel',{clientX:p[0],clientY:p[1],deltaY:-120,bubbles:true,cancelable:true}));})()`);await b.shot(tag+'-1440-well-moving');await combDAdvance(b,1600);await b.shot(tag+'-1440-well-rest');}
   if(w===412){await go('top');await b.evaluate('window.__jm.next()');for(let ms=0;ms<=4200;ms+=200){if(ms)await combDAdvance(b,200);await b.shot(tag+'-move-'+String(ms).padStart(4,'0'));}}
   console.log(tag+' captures '+w+'x'+h);
  }
 }else if(mode==='trace'){
  for(const[w,h,dpr,cpu]of[[412,730,2.625,4],[1440,900,2,1]]){
   await b.size(w,h,dpr);await b.send('Emulation.setCPUThrottlingRate',{rate:cpu});await b.page('dist/journey-joined.html');await combBWait(8000);
   for(let n=0;n<100&&!await b.evaluate('window.__hero?.loading===false&&window.__hero?.entering===null');n++)await combBWait(100);
   if(!await b.evaluate('window.__hero?.loading===false&&window.__hero?.entering===null'))throw Error('hero entrance unfinished before trace');
   trace=[];done=false;await b.send('Tracing.start',{categories:'devtools.timeline,disabled-by-default-devtools.timeline,toplevel,v8.execute,blink.user_timing',transferMode:'ReportEvents'},null);
   await b.evaluate(`window.__fTrace={times:[],long:[],cost:{}};window.__fObs=new PerformanceObserver(l=>window.__fTrace.long.push(...l.getEntries().map(e=>({start:e.startTime,duration:e.duration}))));window.__fObs.observe({type:'longtask'});window.__fTrace.start=performance.now();window.__jm.next();(function f(t){if(window.__jm.moving){window.__fTrace.times.push(t);requestAnimationFrame(f)}else window.__fTrace.end=performance.now()})(performance.now());`);
   for(let i=0;i<100;i++){await combBWait(100);if(!await b.evaluate('window.__jm.moving'))break;}
   const sample=await b.evaluate('window.__fObs.disconnect();window.__fTrace');await b.send('Tracing.end',{},null);for(let i=0;i<100&&!done;i++)await combBWait(50);
   writeFileSync(root+'/'+tag+'-trace-'+w+'.json',JSON.stringify({traceEvents:trace,sample}));
   const totals=new Map();for(const e of trace)if(e.ph==='X'&&e.dur>0)totals.set(e.name,(totals.get(e.name)||0)+e.dur/1000);
   const result={width:w,dpr,cpu,intervals:quant(sample.times.slice(1).map((v,i)=>v-sample.times[i])),long:sample.long,costs:[...totals].sort((a,b)=>b[1]-a[1]).slice(0,20)};
   writeFileSync(root+'/'+tag+'-trace-summary-'+w+'.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result));
  }
 }
 if(b.errors.length)throw Error(b.errors.join('\n'));
}finally{await b.close();}
