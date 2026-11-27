// COMB-T, 2026-11-27: the ash replaces the well find and is the tree zoom anchor.
// Deterministic rendered comparison. Only loopback CDP; captures only in the
// explicitly authorized run directory. Does not launch or install a browser.
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, join, sep } from 'node:path';
import { deflateSync, crc32 } from 'node:zlib';
import { framePNG } from './frame-cost.mjs';

const args=Object.fromEntries(process.argv.slice(2).flatMap((v,i,a)=>v.startsWith('--')?[[v.slice(2),a[i+1]]]:[]));
const root=resolve('C:/Users/Admin/Documents/Portfolio/journey-map-runs/glide'),out=resolve(args.out||join(root,args.stage||'before'));
if(out!==root&&!out.startsWith(root+sep))throw Error('capture path outside authorized run folder');
mkdirSync(out,{recursive:true});
const pause=ms=>new Promise(ok=>setTimeout(ok,ms));
let ws,sid,target,seq=0,server;const pending=new Map();
const send=(method,params={},sessionId=sid)=>new Promise((ok,fail)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);fail(Error(method+' timeout'));},30000);pending.set(id,{ok,fail,timer});ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));});
const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
const clockSource=`(()=>{
 const epoch=Date.parse('2026-11-23T17:00:00Z'),RealDate=Date;let now=0,id=0,seed=123456789;
 const raf=new Map(),timers=new Map();
 globalThis.Date=class extends RealDate{constructor(...a){super(...(a.length?a:[epoch+now]))}static now(){return epoch+now}};
 Object.defineProperty(performance,'now',{value:()=>now});Math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 requestAnimationFrame=f=>{raf.set(++id,f);return id};cancelAnimationFrame=i=>raf.delete(i);
 setTimeout=(f,delay=0,...a)=>{timers.set(++id,{f,a,at:now+Number(delay)});return id};clearTimeout=i=>timers.delete(i);
 setInterval=(f,delay=0,...a)=>{timers.set(++id,{f,a,at:now+Number(delay),repeat:Number(delay)||1});return id};clearInterval=clearTimeout;
 globalThis.__glideClock={get now(){return now},step(dt){now+=dt;for(const[i,t]of [...timers])if(t.at<=now){timers.delete(i);if(t.repeat){t.at=now+t.repeat;timers.set(i,t)}t.f(...t.a)}const list=[...raf.values()];raf.clear();for(const f of list)f(now)},advance(ms){const count=Math.ceil(ms/(1000/60));for(let i=0;i<count;i++)this.step(ms/count)}};
 try{localStorage.clear()}catch{}
})()`;
const advance=ms=>evaluate(`__glideClock.advance(${ms})`);
async function load(url){await send('Page.navigate',{url});for(let n=0;n<120;n++){if(await evaluate('!!window.__jm && !!document.querySelector(".go-next")'))break;await pause(50);}await evaluate('document.fonts.ready');await pause(100);await advance(100);await pause(100);await evaluate('document.getAnimations().forEach(a=>a.finish())');}
function imagePNG(w,h,pixels){
 const chunk=(kind,b)=>{const q=Buffer.alloc(b.length+12);q.writeUInt32BE(b.length);q.write(kind,4);b.copy(q,8);q.writeUInt32BE(crc32(q.subarray(4,-4)),q.length-4);return q;};
 const head=Buffer.alloc(13);head.writeUInt32BE(w);head.writeUInt32BE(h,4);head[8]=8;head[9]=2;
 const raw=Buffer.alloc((w*3+1)*h);for(let y=0;y<h;y++)pixels.copy(raw,y*(w*3+1)+1,y*w*3,(y+1)*w*3);
 return Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),chunk('IHDR',head),chunk('IDAT',deflateSync(raw)),chunk('IEND',Buffer.alloc(0))]);
}
const rows=[];
async function shot(name,geometry=false){
 await evaluate('document.getAnimations().forEach(a=>{try{a.finish()}catch{}})');
 // A screenshot flushes the pending DOM/canvas work without advancing the fake clock.
 let last='',data='',stable=false;
 for(let n=0;n<(args.stable?4:1);n++){({data}=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false}));if(data===last){stable=true;break}last=data;}
 const buffer=Buffer.from(data,'base64');writeFileSync(join(out,name+'.png'),buffer);
 const metrics=await evaluate(`(()=>{const box=e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.width,r.height]};return {clock:__glideClock.now,P:__jm.P,labels:[...document.querySelectorAll('.map text')].map(e=>({text:e.textContent,box:box(e)})),strokes:[...document.querySelectorAll('.map .l,.map .o,.map .g,.map .pf,.map .t,.map .rn,.map .done')].map(e=>{const s=getComputedStyle(e),m=e.getScreenCTM();return [s.vectorEffect,parseFloat(s.strokeWidth)*(s.vectorEffect==='non-scaling-stroke'?1:Math.hypot(m.a,m.b))]})}})()`);
 writeFileSync(join(out,name+'.json'),JSON.stringify(metrics));
 let row={name,stable,changed:null,total:null,labelMax:null,strokeMax:null};
 if(args.compare){const baseline=join(resolve(args.compare),name+'.png');if(!existsSync(baseline))throw Error('missing baseline '+name);
   const a=framePNG(readFileSync(baseline)),b=framePNG(buffer);if(a.w!==b.w||a.h!==b.h)throw Error('size mismatch '+name);
   let changed=0;const diff=Buffer.alloc(a.w*a.h*3);let x0=a.w,y0=a.h,x1=-1,y1=-1;
   for(let i=0;i<a.w*a.h;i++){let different=false;for(let c=0;c<3;c++)if(a.pixels[i*a.channels+c]!==b.pixels[i*b.channels+c])different=true;if(different){changed++;x0=Math.min(x0,i%a.w);x1=Math.max(x1,i%a.w);y0=Math.min(y0,Math.floor(i/a.w));y1=Math.max(y1,Math.floor(i/a.w));diff[i*3]=255;diff[i*3+1]=80;diff[i*3+2]=80}else for(let c=0;c<3;c++)diff[i*3+c]=Math.round(a.pixels[i*a.channels+c]*.3);}
   const old=JSON.parse(readFileSync(join(resolve(args.compare),name+'.json'),'utf8'));if(old.labels.length!==metrics.labels.length||old.strokes.length!==metrics.strokes.length)throw Error('element count changed '+name);
   const labelMax=Math.max(0,...metrics.labels.flatMap((l,i)=>l.box.map((v,j)=>Math.abs(v-old.labels[i].box[j])))),strokeMax=Math.max(0,...metrics.strokes.map((s,i)=>s[0]===old.strokes[i][0]?Math.abs(s[1]-old.strokes[i][1]):Infinity));
   row={name,stable,changed,total:a.w*a.h,percent:changed/(a.w*a.h)*100,bounds:changed?[x0,y0,x1,y1]:null,labelMax,strokeMax,geometry};
   if(changed)writeFileSync(join(out,name+'-diff.png'),imagePNG(a.w,a.h,diff));
   if(!geometry&&row.percent>.5||geometry&&(labelMax>.5||strokeMax>1e-6))process.exitCode=1;
 }
 rows.push(row);if(!geometry&&row.percent>.5||geometry&&(row.labelMax>.5||row.strokeMax>1e-6))console.log(JSON.stringify(row));
}
async function key(key){await evaluate(`window.dispatchEvent(new KeyboardEvent('keydown',{key:${JSON.stringify(key)},bubbles:true,cancelable:true}))`);}
async function go(id){await evaluate(`__jm.go(${JSON.stringify(id)},{instant:true})`);await advance(2400);}
async function capturePlan(url,tag){
 if(args.plan!=='glides'){
 await load(url);const beats=await evaluate('__jm.beats.map(b=>b.id)');
 for(const id of beats){await go(id);await shot(tag+'-beat-'+id);}
 // Every card open is included above. Close and reopen through its actual controls.
 for(const id of ['laurier','hmc1','mohawk','hmc2','interkom','lennard']){await go(id);await evaluate(`document.querySelector('#stop-${id} .c-close').click()`);await advance(800);await shot(tag+'-closed-'+id);}
 await go('end');await evaluate('document.querySelector(".go-next").click()');await advance(3200);await shot(tag+'-explore');
 // Rest views and focused finds, through the same keyboard controls as a visitor.
 const finds=['wayfinder','hoard-laurier','hoard-hmc1','hoard-hmc2','hoard-interkom','hoard-lennard','ravens','serpent','beacon','runestone','hammer','mist','horn','ash','longship'];
 await key('Escape');await advance(2000);
 for(const id of finds){await go('map');await evaluate(`(()=>{const e=document.getElementById('f-'+${JSON.stringify(id)});if(!e)throw Error('missing find '+${JSON.stringify(id)});e.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))})()`);await advance(2000);await shot(tag+'-find-'+id);await key('Escape');await advance(1800);}
 }
 // Fresh page, known history and exact 12 times in the whole-map-to-Laurier glide.
 await load(url);await go('map');await evaluate('__jm.next()');
 for(let i=1;i<=12;i++){await advance(300);await shot(tag+'-glide-'+String(i*300).padStart(4,'0'),true);}
}
try{
 const endpoint=new URL(args.cdp);if(endpoint.protocol!=='ws:'||endpoint.hostname!=='127.0.0.1')throw Error('only local CDP');
 ws=new WebSocket(endpoint);await new Promise((ok,fail)=>{ws.onopen=ok;ws.onerror=fail});ws.onmessage=e=>{const m=JSON.parse(e.data),p=pending.get(m.id);if(p){clearTimeout(p.timer);pending.delete(m.id);m.error?p.fail(Error(m.error.message)):p.ok(m.result)}else if(m.method==='Fetch.requestPaused'){const u=new URL(m.params.request.url),allowed=u.protocol==='data:'||u.protocol==='blob:'||u.hostname==='127.0.0.1'&&u.port===String(server.address().port);void send(allowed?'Fetch.continueRequest':'Fetch.failRequest',allowed?{requestId:m.params.requestId}:{requestId:m.params.requestId,errorReason:'BlockedByClient'})}};
 const pages=new Map(['journey-map.html','journey-joined.html'].map(p=>['/'+p,readFileSync(new URL('../dist/'+p,import.meta.url))]));
 server=createServer((req,res)=>{const html=pages.get(req.url);res.writeHead(html?200:404,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(html||'')});await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
 ({targetId:target}=await send('Target.createTarget',{url:'about:blank'},null));({sessionId:sid}=await send('Target.attachToTarget',{targetId:target,flatten:true},null));await send('Page.enable');await send('Runtime.enable');await send('Fetch.enable',{patterns:[{urlPattern:'*'}]});await send('Page.addScriptToEvaluateOnNewDocument',{source:clockSource});
 if(args['default-text'])await send('Page.addScriptToEvaluateOnNewDocument',{source:`document.addEventListener('DOMContentLoaded',()=>{const s=document.createElement('style');s.textContent='.map text { text-rendering:auto !important }';document.head.appendChild(s)})`});
 await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:args.reduced?'reduce':'no-preference'}]});
 const sizes=args.sizes?args.sizes.split(','):['1440x900x1','412x730x1','412x730x2.625'];
 for(const size of sizes){const[w,h,dpr]=size.split('x').map(Number);await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:dpr,mobile:w<=640});await send('Emulation.setTouchEmulationEnabled',{enabled:w<=640,maxTouchPoints:5});
  for(const path of pages.keys())if(!args.page||path.endsWith(args.page))await capturePlan('http://127.0.0.1:'+server.address().port+path,size+'-'+path.slice(1,-5));
 }
}catch(e){console.error(e.stack);process.exitCode=1}
finally{writeFileSync(join(out,'comparison.json'),JSON.stringify(rows,null,2));console.log(JSON.stringify({captures:rows.length,changed:rows.filter(r=>r.changed>0).length,maxPercent:Math.max(0,...rows.map(r=>r.percent||0)),labelMax:Math.max(0,...rows.filter(r=>r.geometry).map(r=>r.labelMax||0)),strokeMax:Math.max(0,...rows.filter(r=>r.geometry).map(r=>r.strokeMax||0))}));if(target)try{await send('Target.closeTarget',{targetId:target},null)}catch{}server?.close();ws?.close();for(const p of pending.values())clearTimeout(p.timer);}
