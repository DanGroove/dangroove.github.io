import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {combDClock,combDAdvance} from './comb-d-clock-test.mjs';
const b=await combBBrowser(),fail=[];
const tick=async ms=>{for(let t=0;t<ms;t+=100)await combDAdvance(b,Math.min(100,ms-t));};
const wheel=async dy=>b.evaluate(`(()=>{const e=new WheelEvent('wheel',{deltaY:${dy},bubbles:true,cancelable:true});Object.defineProperty(e,'timeStamp',{value:__dClock.now});window.dispatchEvent(e)})()`);
const at=async id=>{await b.evaluate('__jm.set(0)');if(id==='map'){await wheel(100);await tick(5000);}};
const endpoint=async(id,tag)=>{const r=await b.evaluate('({p:__jm.P,m:__jm.moving,map:__jm.beats[1].P})');if(r.m||Math.abs(r.p-(id==='map'?r.map:0))>.001)fail.push(tag+' '+JSON.stringify(r));};
try{await combDClock(b);for(const page of ['journey-map','journey-joined'])for(const[w,h]of[[412,730],[1440,900]]){
 await b.size(w,h);await b.page('dist/'+page+'.html');for(let n=0;n<220;n++){await tick(100);await combBWait(2);if(n>70&&await b.evaluate('!document.documentElement.classList.contains("jm-joined")||!!window.__ready'))break;}await tick(6000);
 await at('top');await wheel(100);if(!await b.evaluate('__jm.moving'))fail.push(page+' first wheel did not start');await tick(5000);await endpoint('map',page+' notch');await wheel(-100);await tick(5000);await endpoint('top',page+' up');
 await at('top');for(let n=0;n<40;n++){await wheel(3);await tick(15);}await tick(5000);await endpoint('map',page+' burst');
 await at('top');for(let n=0;n<300;n++){await wheel(n>280?-2:2);await tick(15);}await endpoint('map',page+' arrival momentum');
 for(const slow of [false,true]){await at('top');await b.evaluate(`window.__fTouch=(type,y)=>{const target=document.getElementById('stage'),p=new Touch({identifier:1,target,clientX:100,clientY:y});const e=new TouchEvent(type,{touches:type==='touchend'?[]:[p],bubbles:true,cancelable:true});Object.defineProperty(e,'timeStamp',{value:__dClock.now});target.dispatchEvent(e)};__fTouch('touchstart',400)`);await tick(slow?400:20);await b.evaluate('__fTouch("touchmove",376)');if(!await b.evaluate('__jm.moving'))fail.push(page+' swipe starts on move');await b.evaluate('__fTouch("touchmove",330);__fTouch("touchend",330)');await tick(5000);await endpoint('map',page+' swipe '+slow);}
 await at('top');await wheel(100);await tick(600);const p=await b.evaluate('__jm.P');await wheel(-100);if(await b.evaluate('__jm.P')!==p)fail.push(page+' reverse jump');await tick(8000);await endpoint('top',page+' reverse');
 await at('top');await b.evaluate('__jm.next()');await wheel(-100);await tick(5000);await endpoint('map',page+' Start lock');await wheel(-100);await tick(5000);await endpoint('map',page+' locked at map');
 console.log(page+' '+w+'x'+h+' notch, burst, quick/slow 24px swipe, arrival momentum, fresh reverse and Start lock checked');
 }if(b.errors.length)fail.push(...b.errors);}finally{await b.close();}console.log('Failures '+JSON.stringify(fail));process.exitCode=fail.length?1:0;
