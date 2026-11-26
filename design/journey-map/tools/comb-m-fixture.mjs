// Real CDP input fixture. Observations never invoke the page's controls.
import {spawn} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync,existsSync,rmSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
export const gRoot=resolve('C:/Users/Admin/Documents/Portfolio/journey-map-runs',process.env.COMB_RUN || 'comb-n');
export const gWait=ms=>new Promise(r=>setTimeout(r,ms));
export async function gBrowser(){
 mkdirSync(gRoot,{recursive:true});const profile=gRoot+'/profile-'+process.pid+'-'+Date.now();mkdirSync(profile+'/pages',{recursive:true});
 const child=spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',['--headless=new','--remote-debugging-port=0','--remote-debugging-address=127.0.0.1','--user-data-dir='+profile,'--disk-cache-dir='+profile+'/cache','--crash-dumps-dir='+profile,'--no-first-run','--no-default-browser-check','--disable-background-networking','--disable-component-update','--disable-sync','--disable-extensions','--mute-audio','about:blank'],{stdio:'ignore'});
 for(let i=0;i<100&&!existsSync(profile+'/DevToolsActivePort');i++)await gWait(100);
 const [port,ep]=readFileSync(profile+'/DevToolsActivePort','utf8').trim().split('\n'),ws=new WebSocket('ws://127.0.0.1:'+port+ep);await new Promise((r,j)=>{ws.onopen=r;ws.onerror=j;});
 let seq=0,sid;const pending=new Map(),errors=[];
 ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(!p)return;pending.delete(m.id);clearTimeout(p.timer);m.error?p.reject(Error(m.error.message)):p.resolve(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text);else if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')errors.push(m.params.args.map(a=>a.value||a.description).join(' '));};
 const hooks=new Map(); const receive=ws.onmessage;ws.onmessage=e=>{receive(e);const m=JSON.parse(e.data);for(const fn of hooks.get(m.method)||[])fn(m.params);};
 const send=(method,params={},sessionId=sid)=>new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>reject(Error(method+' timeout')),30000);pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));});
 const {targetId}=await send('Target.createTarget',{url:'about:blank'},null);({sessionId:sid}=await send('Target.attachToTarget',{targetId,flatten:true},null));
 for(const method of ['Page.enable','Runtime.enable','Network.enable','Page.bringToFront'])await send(method);await send('Network.setBlockedURLs',{urls:['http://*','https://*']});
 const read=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
 const b={send,read,errors,on(method,fn){if(!hooks.has(method))hooks.set(method,[]);hooks.get(method).push(fn);},
  async size(w,h,touch=w<641,dpr=2){await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:dpr,mobile:w<641});await send('Emulation.setTouchEmulationEnabled',{enabled:touch,maxTouchPoints:5});await send('Emulation.setEmulatedMedia',{features:[{name:'pointer',value:touch?'coarse':'fine'}]});await gWait(250);},
  async page(joined=true,beat='map',before=false){const file=(typeof before==='string'?before+'-':before?'before-':'after-')+(joined?'journey-joined':'journey-map')+'.html';let html=readFileSync(before==='9c895f9'?gRoot+'/before-9c895f9.html':before?gRoot+'/before/'+(joined?'journey-joined':'journey-map')+'.html':'dist/'+(joined?'journey-joined':'journey-map')+'.html','utf8');html=html.replace('</script>','</script>');const mark='// ---- main.mjs ----';if(!html.includes(mark))throw Error('pack marker missing');const end=html.indexOf('</script>',html.indexOf(mark));html=html.slice(0,end)+'\nwindow.__g={FD,SC,EX,TRIP_EL,VIEW,DP,CD,DEPTH,FRAME_PERF,COPY,CD,shines:[]};document.addEventListener("animationstart",e=>{if(e.animationName==="goGlow")__g.shines.push({at:performance.now(),button:e.target.parentElement.className});});\n'+html.slice(end);if(b.patch)html=b.patch(html);writeFileSync(profile+'/pages/'+file,html);await send('Page.navigate',{url:pathToFileURL(resolve(profile+'/pages/'+file)).href+'?beat='+beat});await b.until('!!window.__g',8000);await read('document.fonts.ready.then(()=>true)');if(joined)await b.until('window.__hero&&!__hero.loading&&__hero.entering===null',24000);await gWait(800);},
  async until(expr,timeout=12000){const start=Date.now();while(Date.now()-start<timeout){if(await read(expr))return;await gWait(60);}throw Error('Timeout '+expr);},
  async rest(){await b.until('!__g.SC.move&&!__g.SC.cut',16000);await gWait(650);},
  async box(sel){return read('(()=>{const e=document.querySelector('+JSON.stringify(sel)+');if(!e)return null;const r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height};})()');},
  async click(sel,touch=false){const r=await b.box(sel);if(!r)throw Error('Missing '+sel);await b.tap(r.x+r.w/2,r.y+r.h/2,touch);},
  async tap(x,y,touch=false){if(touch){await send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});await gWait(35);await send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}else{await send('Input.dispatchMouseEvent',{type:'mouseMoved',x,y});await send('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',clickCount:1});await send('Input.dispatchMouseEvent',{type:'mouseReleased',x,y,button:'left',clickCount:1});}},
  async key(key,shift=false){const vk={Enter:13,Escape:27,Tab:9,' ':32,ArrowLeft:37,ArrowRight:39,ArrowUp:38,ArrowDown:40,Home:36,End:35,PageUp:33,PageDown:34}[key]||key.toUpperCase().charCodeAt(0);for(const type of ['keyDown','keyUp'])await send('Input.dispatchKeyEvent',{type,key,code:key===' '?'Space':key,windowsVirtualKeyCode:vk,nativeVirtualKeyCode:vk,modifiers:shift?8:0,...(type==='keyDown'&&key==='Enter'?{text:'\r',unmodifiedText:'\r'}:{})});},
  async tabTo(sel){for(let i=0;i<100;i++){if(await read('document.activeElement?.matches('+JSON.stringify(sel)+')'))return;await b.key('Tab');}throw Error('Cannot tab to '+sel);},
  async shot(name){const {data}=await send('Page.captureScreenshot',{format:'png'});writeFileSync(gRoot+'/'+name+'.png',Buffer.from(data,'base64'));},
  async close(){
   const exited=child.exitCode!==null||child.signalCode!==null?Promise.resolve():new Promise(r=>child.once('exit',r));
   try{await send('Browser.close',{},null);}catch{}ws.close();
   if(child.exitCode===null&&child.signalCode===null)child.kill();await exited;
   const absolute=resolve(profile),allowed=resolve(gRoot);if(!absolute.startsWith(allowed+'/')&&!absolute.startsWith(allowed+'\\'))throw Error('Profile outside run folder');
   for(let attempt=0;attempt<50;attempt++){try{rmSync(absolute,{recursive:true,force:true,maxRetries:2,retryDelay:100});break;}catch(error){if(!existsSync(absolute))break;if(attempt===49)throw error;await gWait(100);}}
  }
 };return b;
}
