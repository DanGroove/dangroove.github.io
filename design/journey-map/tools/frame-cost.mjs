// Read-only phone audit, Node 22+, no dependencies or output files.
// Attach to an EXISTING local headless Edge/Chrome. Creating a browser profile
// is outside FRAMES.md's write allowlist, so this tool never launches a browser.
// node tools/frame-cost.mjs --cdp ws://127.0.0.1:PORT/devtools/browser/ID
// Optional: --page dist/journey-map.html (default: both packed pages).
// Screenshot decoding and trace reduction run AFTER each measured gesture.
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

export function framePNG(buffer) {
  if (!buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) throw Error('not PNG');
  let w, h, channels, compressed = [];
  for (let p = 8; p < buffer.length;) {
    const n = buffer.readUInt32BE(p), kind = buffer.toString('ascii', p + 4, p + 8), b = buffer.subarray(p + 8, p + 8 + n); p += n + 12;
    if (kind === 'IHDR') {
      w = b.readUInt32BE(0); h = b.readUInt32BE(4); channels = b[9] === 6 ? 4 : b[9] === 2 ? 3 : 0;
      if (b[8] !== 8 || !channels || b[12]) throw Error('requires non-interlaced RGB/RGBA8 PNG');
    } else if (kind === 'IDAT') compressed.push(b);
  }
  const raw = inflateSync(Buffer.concat(compressed)), stride = w * channels, pixels = Buffer.alloc(h * stride);
  if (raw.length !== h * (stride + 1)) throw Error('invalid PNG scanline length');
  const paeth = (a,b,c) => { const p=a+b-c, x=Math.abs(p-a), y=Math.abs(p-b), z=Math.abs(p-c); return x<=y && x<=z ? a : y<=z ? b : c; };
  for (let y=0; y<h; y++) {
    const filter=raw[y*(stride+1)]; if (filter>4) throw Error('invalid PNG filter');
    for (let x=0; x<stride; x++) {
      const at=y*stride+x, a=x>=channels?pixels[at-channels]:0, b=y?pixels[at-stride]:0, c=y&&x>=channels?pixels[at-stride-channels]:0;
      pixels[at]=(raw[y*(stride+1)+1+x]+[0,a,b,Math.floor((a+b)/2),paeth(a,b,c)][filter])&255;
    }
  }
  return {w,h,channels,pixels};
}

// Neutral light connected marks, excluding tiny detached stars and the UI bands.
// A candidate is a middle frame with < half the line pixels of BOTH neighbours.
// Report candidates, samples and timestamps: screencast can drop frames itself;
// zero candidates is not proof that every displayed device frame was nonblank.
export function frameLines(png) {
  const {w,h,channels,pixels}=png, mask=new Uint8Array(w*h), queue=new Int32Array(w*h);
  for(let y=Math.ceil(h*.09);y<Math.floor(h*.87);y++)for(let x=0;x<w;x++) {
    const p=(y*w+x)*channels, r=pixels[p],g=pixels[p+1],b=pixels[p+2];
    if(Math.min(r,g,b)>95 && Math.max(r,g,b)-Math.min(r,g,b)<28)mask[y*w+x]=1;
  }
  let lines=0;
  for(let i=0;i<mask.length;i++)if(mask[i]) {
    let head=0,tail=1,x0=w,x1=0,y0=h,y1=0;queue[0]=i;mask[i]=0;
    while(head<tail) {
      const p=queue[head++], x=p%w,y=Math.floor(p/w);x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);
      for(const [dx,dy]of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[-1,1],[1,-1]]) {
        const nx=x+dx,ny=y+dy,q=ny*w+nx;if(nx>=0&&nx<w&&ny>=0&&ny<h&&mask[q]){mask[q]=0;queue[tail++]=q;}
      }
    }
    if(tail>=6&&Math.max(x1-x0,y1-y0)>=5)lines+=tail;
  }
  return lines;
}
export function frameIntervals(values) {
  const sorted=[...values].sort((a,b)=>a-b), q=p=>sorted.length?sorted[Math.min(sorted.length-1,Math.ceil(p*sorted.length)-1)]:null;
  return {n:values.length,p50:q(.5),p95:q(.95),max:sorted.at(-1)??null,over33:values.filter(x=>x>33).length,over100:values.filter(x=>x>100).length};
}
export function frameTrace(events, start, end, frames, pid) {
  const renderer=events.find(e=>e.ph==='M'&&e.name==='thread_name'&&e.args?.name==='CrRendererMain'&&(pid===undefined||e.pid===pid)), totals={script:0,styleLayout:0,paint:0,raster:0};
  const classify=e=> /RasterTask|Rasterize/.test(e.name)?'raster':/^(Layout|UpdateLayoutTree|RecalculateStyles)$/.test(e.name)?'styleLayout':/^(Paint|PrePaint|PaintImage)$/.test(e.name)?'paint':/^(FunctionCall|EvaluateScript|RunMicrotasks|EventDispatch|TimerFire|FireAnimationFrame|V8.Execute)$/.test(e.name)?'script':null;
  const stack=new Map(), spans=[];
  for(const e of events) {
    const key=e.pid+'/'+e.tid;
    if(e.ph==='B'){const a=stack.get(key)||[];a.push(e);stack.set(key,a);}
    else if(e.ph==='E'){const a=stack.get(key),b=a?.pop();if(b)spans.push({...b,dur:e.ts-b.ts});}
    else if(e.ph==='X'&&e.dur>0)spans.push(e);
  }
  const edges=[];
  for(const e of spans) {
    const category=classify(e), a=Math.max(start,e.ts), b=Math.min(end,e.ts+e.dur);if(!category||b<=a)continue;
    if(category==='raster'){if(!renderer||e.pid===renderer.pid)totals.raster+=(b-a)/1000;continue;}
    if(!renderer||e.pid!==renderer.pid||e.tid!==renderer.tid)continue;
    edges.push({t:a,add:category},{t:b,remove:category});
  }
  edges.sort((a,b)=>a.t-b.t);const active={script:0,styleLayout:0,paint:0};let last=start;
  for(const e of edges){const category=active.styleLayout?'styleLayout':active.paint?'paint':active.script?'script':null;if(category)totals[category]+=(e.t-last)/1000;if(e.add)active[e.add]++;else active[e.remove]--;last=e.t;}
  return {mainThread:!!renderer,...Object.fromEntries(Object.entries(totals).map(([k,v])=>[k,frames?v/frames:null]))};
}

const frameArgs=Object.fromEntries(process.argv.slice(2).flatMap((v,i,a)=>v.startsWith('--')?[[v.slice(2),a[i+1]]]:[]));
const framePages=frameArgs.page?[frameArgs.page]:['dist/journey-map.html','dist/journey-joined.html'];
const frameScenarios=['pinch x3 / 300 ms out + 300 ms in / three repeats','fling + glide','wayfinder / one turn in 1.5 s','slow pan with glow','stop glide','rush into blast'];
const frameWait=ms=>new Promise(ok=>setTimeout(ok,ms));
let frameWS,frameSession,frameTarget,frameServer,frameSeq=0,frameCapture=null,frameTraceEvents=null;
const framePending=new Map(),frameHandlers=new Map();
const frameSend=(method,params={},sessionId=frameSession)=>new Promise((ok,fail)=>{
  const id=++frameSeq,timer=setTimeout(()=>{framePending.delete(id);fail(Error(method+' timed out'));},20000);
  framePending.set(id,{ok,fail,timer});frameWS.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));
});
const frameEval=async expression=>{const r=await frameSend('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
const frameOnce=method=>new Promise(ok=>frameHandlers.set(method,p=>{frameHandlers.delete(method);ok(p);}));
async function frameConnect(endpoint) {
  const url=new URL(endpoint);if(url.protocol!=='ws:'||url.hostname!=='127.0.0.1')throw Error('--cdp must be ws://127.0.0.1');
  frameWS=new WebSocket(url);await new Promise((ok,fail)=>{frameWS.onopen=ok;frameWS.onerror=fail;});
  frameWS.onmessage=e=>{
    const m=JSON.parse(e.data),p=framePending.get(m.id);
    if(p){clearTimeout(p.timer);framePending.delete(m.id);m.error?p.fail(Error(m.error.message)):p.ok(m.result);}
    else if(m.method==='Tracing.dataCollected')frameTraceEvents?.push(...m.params.value);
    else if(m.method==='Page.screencastFrame'){
      if(frameCapture)frameCapture.push({png:Buffer.from(m.params.data,'base64'),time:m.params.metadata.timestamp});
      void frameSend('Page.screencastFrameAck',{sessionId:m.params.sessionId}).catch(()=>{});
    }else frameHandlers.get(m.method)?.(m.params);
  };
  const v=await frameSend('Browser.getVersion',{},null);if(!/HeadlessChrome/.test(v.userAgent)||!/Chrome|Edg/.test(v.product))throw Error('requires existing headless Edge/Chrome');
  console.log('browser: '+v.product+'; 412x730; DPR 2.625; mobile/touch; CPU x4');
  ({targetId:frameTarget}=await frameSend('Target.createTarget',{url:'about:blank'},null));
  ({sessionId:frameSession}=await frameSend('Target.attachToTarget',{targetId:frameTarget,flatten:true},null));
  await frameSend('Page.enable');await frameSend('Runtime.enable');
  await frameSend('Emulation.setDeviceMetricsOverride',{width:412,height:730,deviceScaleFactor:2.625,mobile:true});
  await frameSend('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5});
  await frameSend('Emulation.setCPUThrottlingRate',{rate:4});
  await frameSend('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  await frameSend('Fetch.enable',{patterns:[{urlPattern:'*'}]});
  frameHandlers.set('Fetch.requestPaused',p=>{
    const u=new URL(p.request.url), allowed=u.protocol==='data:' || u.protocol==='blob:' || u.protocol==='http:'&&u.hostname==='127.0.0.1'&&u.port===String(frameServer.address().port);
    void frameSend(allowed?'Fetch.continueRequest':'Fetch.failRequest',allowed?{requestId:p.requestId}:{requestId:p.requestId,errorReason:'BlockedByClient'}).catch(()=>{});
  });
}
async function frameTouch(type,points){await frameSend('Input.dispatchTouchEvent',{type,touchPoints:points.map(([x,y],i)=>({x,y,id:i+1,radiusX:2,radiusY:2,force:1}))});}
async function frameTap(x,y){await frameTouch('touchStart',[[x,y]]);await frameWait(45);await frameTouch('touchEnd',[]);}
// Absolute deadlines avoid adding CDP latency to every nominal 16 ms sample.
async function frameMoves(duration,draw){const start=performance.now();let t=0;while(t<1){t=Math.min(1,(performance.now()-start)/duration);await draw(t);const next=start+Math.min(duration,Math.ceil((performance.now()-start)/16)*16);await frameWait(Math.max(0,next-performance.now()));}}
async function frameZoom(point=[206,330],factor=3,duration=300,back=false){const at=t=>{const r=30*(back?factor**(1-t):factor**t);return [[point[0]-r,point[1]],[point[0]+r,point[1]]];};await frameTouch('touchStart',at(0));await frameMoves(duration,t=>frameTouch('touchMove',at(t)));await frameTouch('touchEnd',[]);}
async function frameExplore(){
  if(await frameEval('document.documentElement.classList.contains("jm-explore")')){await frameSend('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await frameSend('Input.dispatchKeyEvent',{type:'keyUp',key:'Escape',code:'Escape',windowsVirtualKeyCode:27});await frameWait(1600);}
  await frameEval('window.__jm.go("end",{instant:true})');await frameWait(2200);const p=await frameEval('(()=>{const r=document.querySelector(".go-next").getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]})()');await frameTap(...p);await frameWait(2600);if(!await frameEval('document.documentElement.classList.contains("jm-explore")'))throw Error('explore did not open');
}
async function frameMeasure(name,gesture,capture) {
  frameTraceEvents=[];
  await frameSend('Tracing.start',{categories:'devtools.timeline,disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.frame,blink.user_timing,toplevel,cc',options:'record-as-much-as-possible'},null);
  if(capture){frameCapture=[];await frameSend('Page.startScreencast',{format:'png',maxWidth:412,maxHeight:730,everyNthFrame:1});}
  await frameEval(`(()=>{const o=window.__frameCost={times:[],long:[],live:true};o.observer=new PerformanceObserver(l=>o.long.push(...l.getEntries().map(e=>({start:e.startTime,duration:e.duration}))));o.observer.observe({type:'longtask'});o.start=performance.now();performance.mark('frame-cost-start');const f=t=>{if(o.live){o.times.push(t);requestAnimationFrame(f)}};requestAnimationFrame(f)})()`);
  await gesture();await frameWait(180);
  const sample=await frameEval(`(()=>{const o=window.__frameCost;o.end=performance.now();performance.mark('frame-cost-end');o.live=false;o.long.push(...o.observer.takeRecords().map(e=>({start:e.startTime,duration:e.duration})));o.observer.disconnect();return {times:o.times,start:o.start,end:o.end,long:o.long}})()`);
  if(capture)await frameSend('Page.stopScreencast');const images=frameCapture||[];frameCapture=null;
  const complete=frameOnce('Tracing.tracingComplete');await frameSend('Tracing.end',{},null);await complete;
  const events=frameTraceEvents;frameTraceEvents=null;
  const begin=events.find(e=>e.name==='frame-cost-start'),end=events.find(e=>e.name==='frame-cost-end');
  if(!begin||!end)throw Error('trace did not contain time bounds');
  const times=sample.times.filter(t=>t>=sample.start&&t<=sample.end),intervals=times.slice(1).map((t,i)=>t-times[i]);
  const cost=frameTrace(events,begin.ts,end.ts,intervals.length,begin.pid),coverage=images.map(i=>({time:i.time,lines:frameLines(framePNG(i.png))}));
  const blanks=coverage.filter((p,i)=>i>0&&i<coverage.length-1&&p.lines<.5*Math.min(coverage[i-1].lines,coverage[i+1].lines));
  const long=sample.long.filter(t=>t.start<sample.end&&t.start+t.duration>sample.start);
  const f=n=>n===null?'N/A':n.toFixed(2),v=frameIntervals(intervals);
  console.log(`| ${name} ${capture?'capture':'timing'} | ${v.n} | ${f(v.p50)} | ${f(v.p95)} | ${f(v.max)} | ${v.over33} | ${v.over100} | ${cost.mainThread?f(cost.script):'N/A'} | ${cost.mainThread?f(cost.styleLayout):'N/A'} | ${cost.mainThread?f(cost.paint):'N/A'} | ${events.some(e=>/RasterTask|Rasterize/.test(e.name))?f(cost.raster):'N/A'} | ${long.length} / ${f(Math.max(0,...long.map(t=>t.duration)))} | ${capture?blanks.length+' / '+images.length:'N/A'} |`);
  if(blanks.length)console.log('blank candidates (s): '+blanks.map(b=>b.time.toFixed(3)).join(', '));
}
async function frameScenario(index) {
  if(index<4){await frameExplore();if(index===1||index===3){const at=index===3?await frameEval('(()=>{const r=document.getElementById("nova-hit").getBoundingClientRect();return [r.x+r.width/2,r.y+r.height/2]})()'):[206,330];await frameZoom(at,3);await frameWait(1800);}}
  else {await frameEval('window.__jm.go('+JSON.stringify(index===4?'hmc1':'x')+',{instant:true})');await frameWait(2200);}
  if(index===2){const p=await frameEval('window.__jm.finds.place("wayfinder")');await frameZoom(p,3);await frameWait(1600);}
  if(index===0)return async()=>{for(let n=0;n<3;n++){await frameZoom();await frameZoom([206,330],3,300,true);}};
  if(index===1||index===3)return async()=>{const start=[260,index===3?470:350];await frameTouch('touchStart',[start]);await frameMoves(index===3?3000:160,t=>frameTouch('touchMove',[[start[0]-170*t,start[1]-(index===3?80:100)*t]]));await frameTouch('touchEnd',[]);await frameWait(index===3?300:1800);};
  if(index===2)return async()=>{const p=await frameEval('window.__jm.finds.place("wayfinder")');await frameTap(...p);const r=20;await frameTouch('touchStart',[[p[0],p[1]-r]]);await frameMoves(1500,t=>frameTouch('touchMove',[[p[0]+Math.sin(t*Math.PI*2)*r,p[1]-Math.cos(t*Math.PI*2)*r]]));await frameTouch('touchEnd',[]);await frameWait(1000);};
  return async()=>{await frameEval('window.__jm.next()');await frameWait(index===4?4700:6200);};
}
async function frameRun() {
  const pages=new Map(framePages.map(p=>['/'+p.split(/[\\/]/).at(-1),readFileSync(new URL('../'+p,import.meta.url))]));
  frameServer=createServer((req,res)=>{const html=pages.get(req.url);res.writeHead(html?200:404,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(html||'');});
  await new Promise(ok=>frameServer.listen(0,'127.0.0.1',ok));await frameConnect(frameArgs.cdp);
  for(const path of pages.keys()) {
    await frameSend('Page.navigate',{url:'http://127.0.0.1:'+frameServer.address().port+path});
    for(let n=0;n<160;n++){if(await frameEval('!!window.__jm && !!document.querySelector(".go-next")'))break;await frameWait(50);}await frameEval('document.fonts.ready');await frameWait(2500);
    console.log('\n'+path+' (timing pass excludes screenshots; capture pass measures its own overhead)');
    console.log('| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script ms/f | style+layout ms/f | paint ms/f | raster ms/f | long tasks / max ms | blank candidates / captures |');
    console.log('| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |');
    for(let i=0;i<frameScenarios.length;i++)for(const capture of [false,true])await frameMeasure(frameScenarios[i],await frameScenario(i),capture);
  }
}
if(process.argv[1]&&new URL(import.meta.url).pathname.toLowerCase().endsWith(process.argv[1].replaceAll('\\','/').toLowerCase().split('/').at(-1))) {
  if(!frameArgs.cdp){
    for(const page of framePages){console.log(page+' - 412x730, DPR 2.625, touch, CPU x4');console.log('| scenario | intervals / script / style+layout / paint / raster / long tasks | blank frames |');console.log('| --- | --- | --- |');for(const name of frameScenarios)console.log('| '+name+' | NOT RUN | NOT MEASURED |');}
    console.log('NOT RUN: no existing local headless CDP endpoint; write allowlist forbids creating a browser profile. Pass --cdp ws://127.0.0.1:PORT/devtools/browser/ID.');process.exitCode=2;
  }else {
    try{await frameRun();}catch(e){console.error('frame-cost: FAIL '+e.message);process.exitCode=1;}
    finally{if(frameTarget)try{await frameSend('Target.closeTarget',{targetId:frameTarget},null);}catch{}frameServer?.close();frameWS?.close();for(const p of framePending.values())clearTimeout(p.timer);}
  }
}
