import {gBrowser,gRoot,gWait} from './comb-g2-browser-test.mjs';
import {writeFileSync} from 'node:fs';
const b=await gBrowser(),rows=[],fail=[];
const check=(ok,name,detail)=>{rows.push({name,ok,detail});if(!ok)fail.push(name);};
async function swipe(dy,x=400,y=300){await b.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x,y,id:1}]});await b.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x,y:y+dy,id:1}]});await b.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
const wheel=dy=>b.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:12,y:300,deltaX:0,deltaY:dy});
try{
 await b.size(412,730,true);await b.page();check(await b.read('__g.shines.length===1'),'direct map load shines');
 await b.click('.go-next',true);await b.rest();await b.click('.go-back',true);await b.rest();
 for(const beat of ['map','laurier','x']){
  if(beat!=='map'){await b.page(false,beat);if(beat==='laurier'){await b.click('#stop-laurier .c-close',true);await gWait(500);}}
  for(const [forward,kind]of [[true,'wheel'],[false,'wheel'],[true,'touch'],[false,'touch']]){
   await gWait(2600);const n=await b.read('__g.shines.length');if(kind==='wheel')await wheel(forward?100:-100);else await swipe(forward?-60:60);await gWait(80);
   const events=await b.read('__g.shines.slice('+n+')');check(events.length===1&&events[0].button.includes(forward?'go-next':'go-back'),beat+' '+kind+' '+(forward?'Next':'Back'),events);
   if(beat==='map'&&forward&&kind==='wheel'){await gWait(450);await wheel(100);await gWait(80);check(await b.read('__g.shines.length')===n+1,'fresh gesture inside 2500ms cooldown is quiet');}
  }
 }
 await b.page(false,'end');await gWait(2700);let n=await b.read('__g.shines.length');await wheel(100);await gWait(80);check(await b.read('__g.shines.length')===n+1,'end Next shines');
 await b.page(false,'laurier');await gWait(2700);n=await b.read('__g.shines.length');const card=await b.box('#stop-laurier .c-card');await swipe(-60,206,Math.max(200,card.y+card.h/2));await gWait(1000);check(await b.read('__g.shines.length')===n+1,'H6 non-scrolling card swipe shines Next');
 await b.page();await b.tabTo('#f-longship');await b.key('Enter');await gWait(2700);n=await b.read('__g.shines.length');await wheel(100);await swipe(-60);await gWait(900);check(await b.read('__g.shines.length')===n,'open popup no shine');
 await b.page(false,'end');await b.click('.go-next',true);await gWait(1900);await b.click('.go-back',true);n=await b.read('__g.shines.length');check(await b.read('!__g.EX.active&&__g.EX.k>0'),'Explore closing interval reached');await wheel(-100);await gWait(100);check(await b.read('__g.shines.length')===n,'Explore closing camera suppresses shine');
 await b.page();await gWait(2700);await wheel(100);await gWait(100);await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await gWait(50);
 const rm=await b.read('(()=>{const rules=[...document.styleSheets].flatMap(s=>[...s.cssRules]).find(r=>r.conditionText==="(prefers-reduced-motion: reduce)"&&r.cssText.includes("go-shining"));return{duration:getComputedStyle(document.documentElement).getPropertyValue("--go-shine-reduced").trim(),rules:rules?.cssText,sweep:[...rules.cssRules].find(r=>r.selectorText.endsWith("::after")).style.animationName,hidden:__g.SC.go.hidden}})()');check(rm.duration==='600ms'&&rm.sweep==='none'&&rm.hidden,'reduced motion specifies 600ms glow and no sweep; stacked route hides bar',rm);
 n=await b.read('__g.shines.length');await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});await gWait(1400);check(await b.read('__g.shines.length')===n,'reduced-motion round trip does not replay a cancelled shine');
 await b.page(true,'map');await gWait(2700);n=await b.read('__g.shines.length');await wheel(100);await gWait(80);check(await b.read('__g.shines.length')===n+1,'shine starts before Top');await b.key('Home');await b.rest();await b.click('.jm-start',true);await b.rest();check(await b.read('__g.shines.length')===n+1,'Top/map round trip does not replay a cancelled shine');
 check(!b.errors.length,'no runtime errors',b.errors);
}catch(e){fail.push(e.stack);}finally{await b.close();writeFileSync(gRoot+'/shine-extra-results.json',JSON.stringify({fail,rows},null,2));}
console.log(JSON.stringify({fail,rows},null,2));process.exitCode=fail.length?1:0;
