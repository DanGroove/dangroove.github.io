// COMB-B local Edge fixture and drawing evidence. No external HTTP requests.
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync, appendFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
export const combBRoot = resolve('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2');
export const combBWait = ms => new Promise(r => setTimeout(r, ms));
export async function combBBrowser() {
  mkdirSync(combBRoot, { recursive: true });
  const profile = join(combBRoot, 'profile-' + Date.now());
  const child = spawn('C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', ['--headless=new', '--remote-debugging-port=0', '--remote-debugging-address=127.0.0.1', '--user-data-dir=' + profile, '--disk-cache-dir=' + join(profile,'cache'), '--crash-dumps-dir=' + profile, '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-extensions', '--mute-audio', 'about:blank'], { stdio: 'ignore' });
  const portFile = join(profile, 'DevToolsActivePort');
  for (let i=0;i<100&&!existsSync(portFile);i++) await combBWait(100);
  const [port, endpoint] = readFileSync(portFile,'utf8').trim().split('\n'), url=`ws://127.0.0.1:${port}${endpoint}`;
  const socket = new WebSocket(url); await new Promise((ok,fail)=>{socket.onopen=ok;socket.onerror=fail;});
  let seq=0,sid; const pending=new Map(),errors=[];
  socket.onmessage=e=>{const m=JSON.parse(e.data);if(m.id){const p=pending.get(m.id);if(!p)return;pending.delete(m.id);clearTimeout(p.timer);m.error?p.fail(Error(m.error.message)):p.ok(m.result);}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text);};
  const send=(method,params={},sessionId=sid)=>new Promise((ok,fail)=>{const id=++seq,timer=setTimeout(()=>fail(Error(method+' timeout')),30000);pending.set(id,{ok,fail,timer});socket.send(JSON.stringify({id,method,params,...(sessionId?{sessionId}:{})}));});
  const {targetId}=await send('Target.createTarget',{url:'about:blank'},null);({sessionId:sid}=await send('Target.attachToTarget',{targetId,flatten:true},null));
  await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('Network.setBlockedURLs',{urls:['http://*','https://*']});
  await send('Page.bringToFront');
  const evaluate=async expression=>{const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description||r.exceptionDetails.text);return r.result.value;};
  return {send,evaluate,errors,url,
    async size(w,h,dpr=2){await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:dpr,mobile:w<641});await send('Emulation.setTouchEmulationEnabled',{enabled:w<641,maxTouchPoints:5});await combBWait(180);},
    async page(file){await send('Page.navigate',{url:pathToFileURL(resolve(file)).href});for(let i=0;i<120;i++){if(await evaluate('!!window.__jm'))break;await combBWait(50);}await evaluate('document.fonts.ready.then(()=>true)');await combBWait(500);},
    async shot(name){const{data}=await send('Page.captureScreenshot',{format:'png'});writeFileSync(join(combBRoot,name+'.png'),Buffer.from(data,'base64'));},
    async key(key,code=key,vk=key==='Enter'?13:key==='Escape'?27:9){for(const type of ['keyDown','keyUp'])await send('Input.dispatchKeyEvent',{type,key,code,windowsVirtualKeyCode:vk,nativeVirtualKeyCode:vk,...(type==='keyDown'&&key==='Enter'?{text:'\r',unmodifiedText:'\r'}:{})});},
    async close(){try{await send('Browser.close',{},null);}catch{}socket.close();child.kill();}
  };
}
export async function combBCapture(phase) {
  const b=await combBBrowser();
  try {
    for(const[w,h]of[[412,730],[1440,900]]){
      const tag=phase+'-'+w+'x'+h;
      await b.size(w,h);await b.page('dist/journey-map.html');
      const go=async id=>{await b.evaluate(`window.__jm.go(${JSON.stringify(id)},{instant:true})`);await combBWait(1800);};
      await go('map');await b.shot(tag+'-overview');
      for(const id of ['well','mist','horn','serpent','ravens','hoard-hmc1','hammer']){
        await go('map');await b.evaluate(`document.getElementById('f-${id}').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))`);await combBWait(id==='ravens'?4200:2400);await b.shot(tag+'-'+id);
        if(id==='ravens'){await b.evaluate(`document.getElementById('f-ravens').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))`);await combBWait(3700);await b.shot(tag+'-raven-gift');}
        if(id==='hammer'){await b.evaluate(`document.querySelector('.hm-start')?.click()`);await combBWait(180);await b.shot(tag+'-shield-wall');}
        if(id==='horn'){await b.evaluate(`document.getElementById('f-horn').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))`);await combBWait(5500);await b.shot(tag+'-horn-found');}
        await b.key('Escape');await combBWait(600);
      }
      await go('end');await b.shot(tag+'-end');await b.evaluate(`document.querySelector('.go-next').click()`);await combBWait(2600);await b.shot(tag+'-explore');
      // Reach maximum explore zoom through its public control, anchored on the tree.
      await b.evaluate(`(()=>{window.__combBChanges=[];window.__combBObserver=new MutationObserver(r=>window.__combBChanges.push(...r.map(x=>({name:x.attributeName,type:x.type,anchor:x.target.classList?.contains('label-anchor')}))));document.querySelectorAll('.label-anchor').forEach(e=>window.__combBObserver.observe(e,{attributes:true,childList:true,subtree:true}));})()`);
      await b.evaluate(`(()=>{const p=window.__jm.finds.place('well'),q=window.__jm.finds.place('hammer'),s=(p[0]-q[0])/192;for(let i=0;i<18;i++)document.getElementById('stage').dispatchEvent(new WheelEvent('wheel',{clientX:p[0]+2*s,clientY:p[1]-50*s,deltaY:-120,ctrlKey:true,bubbles:true,cancelable:true}));})()`);
      await combBWait(2000);await b.shot(tag+'-deep');
      const changes=await b.evaluate(`(()=>{window.__combBObserver.disconnect();return {anchorTransforms:window.__combBChanges.filter(r=>r.anchor&&r.name==='transform').length,markup:window.__combBChanges.filter(r=>r.type==='childList').length,visibilityChanges:window.__combBChanges.filter(r=>r.anchor&&r.name==='style').length};})()`);
      if(changes.anchorTransforms||changes.markup)throw Error('new per-frame explore placement/markup writes: '+JSON.stringify(changes));console.log(tag+' cached explore label zoom writes: '+JSON.stringify(changes));
      await b.evaluate(`(()=>{document.querySelectorAll('.ygg .t,.yg-edge,.yg-hatch').forEach(e=>e.style.visibility='hidden');const e=document.querySelector('.yg-canopy');if(e)e.setAttribute('d',e.getAttribute('d').split('ZM')[0]+'Z');})()`);await b.shot(tag+'-crown-silhouette');
      await b.page('dist/journey-joined.html');await combBWait(1000);await b.shot(tag+'-hero');
    }
    console.log('ok: '+phase+' phone/desktop drawing captures at DPR 2; exceptions='+JSON.stringify(b.errors));
  } finally {await b.close();}
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/comb-b-browser-test.mjs')){
  try{await combBCapture(process.argv[2]||'after');}catch(e){console.error(e);process.exitCode=1;}
}
