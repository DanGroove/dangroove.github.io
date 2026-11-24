// Read-only browser audit. Attach to an existing local headless Edge/Chrome:
// node tools/origin-check.mjs --cdp ws://127.0.0.1:PORT/devtools/browser/ID
// No browser profile, screenshot, capture file or dependency is created here.
// ORIGIN's write allowlist rules out launching a browser with a new disk profile.
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { CARD_TAIL, MARK, STOPS } from '../data.mjs';

const originSizes = [[1440,900],[1280,720],[1024,600],[820,1180],[390,844],[412,730],[360,640]];
const originEndpoint = process.argv[process.argv.indexOf('--cdp') + 1];
const originWait = ms => new Promise(ok => setTimeout(ok, ms));
let originSocket, originSession, originTarget, originServer, originSeq = 0;
const originPending = new Map(), originEvents = new Map();
const originSend = (method, params = {}, sessionId = originSession) => new Promise((ok, fail) => {
  const id = ++originSeq, timer = setTimeout(() => { originPending.delete(id); fail(Error(method + ' timed out')); }, 15000);
  originPending.set(id, { ok, fail, timer }); originSocket.send(JSON.stringify({ id, method, params, ...(sessionId ? {sessionId} : {}) }));
});
const originEval = async expression => {
  const r = await originSend('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
};
const originReady = async () => {
  for (let i=0;i<100;i++) { if (await originEval('!!window.__jm && !window.__jm.moving && !!document.querySelector(".stop[data-state=open]")')) return; await originWait(50); }
  throw Error('card did not open within 5 seconds');
};

// Run inside the actual browser. The SVG's own CTM supplies the tail tip;
// the shield's rendered box and authored rim supply an independent circle.
function originMeasure(id, constants) {
  const article = document.getElementById('stop-' + id), face = article.querySelector('.face'), shield = article.querySelector('.st-btn'), close = article.querySelector('.c-close'), tail = article.querySelector('.c-tail');
  const rect = node => { const b = node.getBoundingClientRect(); return {x:b.x,y:b.y,left:b.left,right:b.right,top:b.top,bottom:b.bottom,width:b.width,height:b.height}; };
  const f = rect(face), s = rect(shield), sw = document.querySelector('[data-review]'), review = sw && getComputedStyle(sw).display !== 'none' ? rect(sw) : null, bar = rect(document.getElementById('go'));
  const matrix = tail.getScreenCTM(), tip = new DOMPoint(1,.5).matrixTransform(matrix), centre = [s.x+s.width/2,s.y+s.height/2], radius = s.width * constants.rim;
  const vertices = [[0,0],[1,.5],[0,1]].map(p => new DOMPoint(...p).matrixTransform(matrix));
  const rimError = Math.abs(Math.hypot(tip.x-centre[0],tip.y-centre[1]) - radius - constants.gap);
  const inside = b => b.left >= -.75 && b.top >= -.75 && b.right <= innerWidth+.75 && b.bottom <= innerHeight+.75;
  const overlaps = (a,b) => a && b && a.left < b.right-.5 && a.right > b.left+.5 && a.top < b.bottom-.5 && a.bottom > b.top+.5;
  const errors=[];
  if (face.scrollHeight !== face.clientHeight || face.scrollWidth !== face.clientWidth) errors.push('face scrolls');
  if (!inside(f)) errors.push('face off screen'); if (!inside(s)) errors.push('shield off screen');
  if (vertices.some(p => p.x < -.75 || p.y < -.75 || p.x > innerWidth+.75 || p.y > innerHeight+.75)) errors.push('tail off screen');
  if (overlaps(f,s)) errors.push('face covers shield');
  for (const [name,b] of [['step bar',bar],['review switch',review]]) {
    if (overlaps(s,b)) errors.push(name+' covers shield'); if (overlaps(f,b)) errors.push(name+' covers face');
  }
  if (review && s.top < review.bottom+constants.reviewGap-.75) errors.push('shield above review clearance');
  if (!face.contains(close)) errors.push('close outside face');
  if (close.getBoundingClientRect().width < 43.5 || close.getBoundingClientRect().height < 43.5) errors.push('close target below 44 px');
  if (rimError > 1.5) errors.push('tail rim error '+rimError.toFixed(3));
  if (Number(getComputedStyle(shield).opacity) < .999) errors.push('shield faded');
  const topmost = document.elementFromPoint(...centre); if (topmost && !shield.contains(topmost)) errors.push('shield covered by another element');
  return {id,height:face.clientHeight,rimError,errors};
}

async function originRun() {
  const endpoint = new URL(originEndpoint);
  if (endpoint.protocol !== 'ws:' || endpoint.hostname !== '127.0.0.1') throw Error('--cdp must be a ws://127.0.0.1 endpoint');
  originSocket = new WebSocket(endpoint);
  await new Promise((ok,fail) => { originSocket.onopen=ok; originSocket.onerror=fail; });
  originSocket.onmessage = e => {
    const m=JSON.parse(e.data), p=originPending.get(m.id);
    if(p){clearTimeout(p.timer);originPending.delete(m.id);m.error?p.fail(Error(m.error.message)):p.ok(m.result);}
    else originEvents.get(m.method)?.(m.params);
  };
  const version = await originSend('Browser.getVersion',{},null);
  if (!/HeadlessChrome/.test(version.userAgent) || !/Chrome|Edg/.test(version.product)) throw Error('existing endpoint is not headless Chrome/Edge');
  ({targetId:originTarget}=await originSend('Target.createTarget',{url:'about:blank'},null));
  ({sessionId:originSession}=await originSend('Target.attachToTarget',{targetId:originTarget,flatten:true},null));
  await originSend('Page.enable'); await originSend('Runtime.enable');
  await originSend('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
  const html=readFileSync(new URL('../dist/journey-map.html',import.meta.url));
  originServer=createServer((req,res)=>{if(req.url!=='/journey-map.html'){res.writeHead(404);res.end();return;}res.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});res.end(html);});
  await new Promise(ok=>originServer.listen(0,'127.0.0.1',ok));
  const local='http://127.0.0.1:'+originServer.address().port+'/journey-map.html';
  await originSend('Fetch.enable',{patterns:[{urlPattern:'*'}]});
  originEvents.set('Fetch.requestPaused',p=>{void originSend(p.request.url===local||p.request.url.startsWith('data:')?'Fetch.continueRequest':'Fetch.failRequest',p.request.url===local||p.request.url.startsWith('data:')?{requestId:p.requestId}:{requestId:p.requestId,errorReason:'BlockedByClient'});});
  const constants={rim:(MARK.radius+MARK.rim/2)/MARK.box,gap:CARD_TAIL.gap,reviewGap:CARD_TAIL.reviewGap};
  const expression=id=>'('+originMeasure.toString()+')('+JSON.stringify(id)+','+JSON.stringify(constants)+')';
  let failed=false;
  for(const[w,h]of originSizes){
    const failures=[],heights=[];let maxRim=0;
    try {
      await originSend('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1,mobile:w<=640});
      await originSend('Emulation.setTouchEmulationEnabled',{enabled:w<=640,maxTouchPoints:5});
      await originSend('Page.navigate',{url:local});
      for(let n=0;n<100;n++){if(await originEval('!!window.__jm'))break;await originWait(50);}
      await originEval('document.fonts.ready');
      for(const{id}of STOPS){
        await originEval('window.__jm.go('+JSON.stringify(id)+', {instant:true})'); await originReady(); await originWait(500);
        const r=await originEval(expression(id)); heights.push(id+':'+r.height);maxRim=Math.max(maxRim,r.rimError);failures.push(...r.errors.map(e=>id+' '+e));
      }
      if(w===1440||w===390){
        await originEval('window.__jm.go("laurier",{instant:true})');await originReady();await originWait(250);
        for(const[phase,selector]of [['close','.c-close'],['open','.st-btn']]){
          const samples=await originEval('new Promise(resolve=>{const rows=[];document.querySelector("#stop-laurier '+selector+'").click();const timer=setInterval(()=>{rows.push('+expression('laurier')+');if(rows.length===12){clearInterval(timer);resolve(rows);}},50);})');
          samples.forEach((r,n)=>{maxRim=Math.max(maxRim,r.rimError);if(r.rimError>1.5)failures.push(phase+' rim at '+(n+1)*50+' ms');});
        }
        await originReady();
      }
    }catch(e){failures.push(e.message);}
    failed ||= failures.length>0;
    console.log(w+'x'+h+': '+(failures.length?'FAIL':'PASS')+' heights ['+heights.join(', ')+']; max rim error '+maxRim.toFixed(3)+' px'+(failures.length?'; '+failures.join('; '):''));
  }
  if(failed)process.exitCode=1;
}

if(process.argv.indexOf('--cdp')<0){
  for(const[w,h]of originSizes)console.log(w+'x'+h+': NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured');
  process.exitCode=2;
}else{
  try{await originRun();}catch(e){console.error('origin-check: FAIL '+e.message);process.exitCode=1;}
  finally{
    if(originTarget)try{await originSend('Target.closeTarget',{targetId:originTarget},null);}catch{}
    originServer?.close();originSocket?.close();for(const p of originPending.values())clearTimeout(p.timer);
  }
}
