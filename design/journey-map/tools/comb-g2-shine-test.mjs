import {gBrowser,gRoot,gWait} from './comb-g2-browser-test.mjs';
import {writeFileSync} from 'node:fs';
const b=await gBrowser(),rows=[],fail=[];let w,h,touch;
const check=(ok,name,detail)=>{rows.push({name,ok,detail});if(!ok)fail.push(name);};
const count=()=>b.read('__g.shines.length');
async function wheel(dy){await b.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:12,y:Math.floor(h/2),deltaX:0,deltaY:dy});}
async function swipe(dy,dx=0,x=w-12,y=h/2){await b.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});for(let i=1;i<=3;i++){await gWait(15);await b.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x+dx*i/3,y:y+dy*i/3,id:1}]});}await b.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
async function shine(forward,kind,name,shot=false){
 await gWait(2600);const n=await count(),start=await b.read('performance.now()'),sel=forward?'.go-next':'.go-back',box=await b.box(sel),focus=await b.read('document.activeElement?.className.replace(" go-shining", "")');
 if(kind==='touch')await swipe(forward?-60:60);else await wheel(forward?100:-100);
 await gWait(35);const state=await b.read('({events:__g.shines.slice('+n+'),active:document.querySelector('+JSON.stringify(sel)+').classList.contains("go-shining"),focus:document.activeElement?.className.replace(" go-shining", "")})');
 check(state.active&&state.events.length===1&&state.events[0].at-start<=100&&state.focus===focus,name+' starts promptly',state);
 await gWait(230);if(shot)await b.shot(name.replaceAll(' ','-')+'-mid');const after=await b.box(sel);check(JSON.stringify(box)===JSON.stringify(after),name+' keeps geometry',{box,after});
 await gWait(800);check(!await b.read('!!document.querySelector(".go-shining")'),name+' ends');
}
try{
 for(const size of [[412,730,true],[844,390,true],[1440,900,false]]){
  [w,h,touch]=size;await b.size(w,h,touch);await b.page(true,'top');
  if(touch)await swipe(-60);else await wheel(100);
  await gWait(180);check(await count()===0,'G30 no shine at top '+w);
  await b.until('!__g.SC.move&&document.documentElement.dataset.beat==="map"',16000);await b.until('__g.shines.length===1');
  await gWait(230);await b.shot('G30-first-map-'+w+'-mid');check(await count()===1,'G30 first map shines once '+w);
  await b.click('.go-next',touch);await b.rest();await b.click('.go-back',touch);await b.rest();check(await count()===1,'G30 no repeated arrival '+w);
  await shine(true,touch?'touch':'wheel','G30 '+w+' map Next',true);
  await shine(false,touch?'touch':'wheel','G30 '+w+' map Back',true);
  await b.click('.go-next',touch);await b.rest();await b.click('#stop-laurier .c-close',touch);await gWait(500);
  await shine(true,'wheel','G30 '+w+' stop Next');await shine(false,touch?'touch':'wheel','G30 '+w+' stop Back');
  await gWait(2600);let n=await count();for(let i=0;i<10;i++){await wheel(20);await gWait(20);}await gWait(100);check(await count()===n+1,'G30 one shine per wheel burst '+w);await wheel(100);await gWait(100);check(await count()===n+1,'G30 cooldown '+w);
  n=await count();await b.tap(w-12,Math.floor(h/2),touch);if(touch)await swipe(3,-60,w-12,h/2);await gWait(1000);check(await count()===n,'G30 tap and horizontal do not shine '+w);
  await b.page(false,'x');await shine(true,touch?'touch':'wheel','G30 '+w+' X Next');await shine(false,'wheel','G30 '+w+' X Back');
  await b.page();await b.tabTo('#f-hammer');await b.key('Enter');await b.until('__g.FD.sheetOwner?.id==="hammer"&&!__g.FD.sheet.inert');await gWait(2700);n=await count();if(touch)await swipe(-60,0,w/2,h/2);else await wheel(100);await gWait(1000);check(await count()===n,'G30 open sheet no shine '+w);
  await b.key('Escape');await gWait(600);await b.key('End');await b.rest();await b.click('.go-next',touch);await gWait(2000);check(await b.read('__g.EX.mode!=="end"&&document.documentElement.classList.contains("jm-explore")'),'G30 reached explore '+w);n=await count();if(touch)await swipe(-70,0,w/2,h/2);else {await b.send('Input.dispatchMouseEvent',{type:'mousePressed',x:w/2,y:h/2,button:'left',clickCount:1});await b.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:w/2+80,y:h/2-70,button:'left',buttons:1});await b.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:w/2+80,y:h/2-70,button:'left',clickCount:1});}await gWait(1000);check(await count()===n,'G30 explore drag no shine '+w);
 }
 check(!b.errors.length,'no runtime errors',b.errors);
}catch(e){fail.push(e.stack);}finally{await b.close();writeFileSync(gRoot+'/shine-results.json',JSON.stringify({fail,rows},null,2));}
console.log(JSON.stringify({fail,rows},null,2));process.exitCode=fail.length?1:0;
