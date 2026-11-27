import {gBrowser,gRoot,gWait} from './comb-g2-browser-test.mjs';
import {writeFileSync} from 'node:fs';
const b=await gBrowser(),rows=[],fail=[];
const check=(ok,name,detail)=>{rows.push({name,ok,detail});if(!ok)fail.push(name);};
const focus=async id=>{await b.tabTo('#f-'+id);await b.key('Enter');await gWait(1500);};
const open=async id=>{await focus(id);for(let i=0;i<3;i++){await b.key('Enter');await gWait(1000);}await gWait(900);};
try{
 for(const [w,h,touch] of [[1440,900,false],[412,730,true]]){
  await b.size(w,h,touch);
  for(const beat of ['map','lennard']){
   await b.page(false,beat);if(beat==='lennard'){await b.click('#stop-lennard .c-close',touch);await gWait(500);}
   await b.click('#nova-hit',touch);const samples=[];
   for(let i=0;i<11;i++){samples.push(await b.read('({say:document.querySelector("#go-say").textContent,hidden:__g.SC.go.hidden,leaving:__g.SC.go.classList.contains("go-leaving"),focus:document.activeElement.className,P:__g.SC.P,moving:!!(__g.SC.move||__g.SC.cut)})'));await gWait(100);}
   check(samples.every(s=>s.say==='The X'&&!s.hidden&&!s.leaving&&s.focus.includes('go-next')),'G27 '+w+' '+beat,samples);
   await b.shot('G27-'+w+'-'+beat+'-arrived');await b.click('.go-next',touch);await gWait(250);
   check(await b.read('!!__g.SC.move&&document.querySelector("#go-say").textContent.includes("building")'),'G27 real Dig starts '+w+' '+beat);
  }
  await b.page();await focus('longship');await gWait(4300);
  const initial=await b.read('__g.FD.list.longship.pullTs');
  check(await b.read('!__g.FD.list.longship.pennant&&__g.FD.list.longship.stage==="rest"'),'G16b single pull '+w);
  const starts=[];
  for(let i=0;i<3;i++){await b.click('.ls-sail',touch);starts.push(await b.read('__g.FD.list.longship.pullTs'));if(i<2)await gWait(touch?115:150);}
  const q=await b.read('__g.FD.list.longship.queued.length');
  for(let i=0;i<55;i++){starts.push(await b.read('__g.FD.list.longship.pullTs'));await gWait(55);}
  const unique=[...new Set(starts)].filter(t=>t!==initial);
  check(unique.length===3&&q===2&&await b.read('__g.FD.list.longship.pennant&&__g.FD.list.longship.queued.length===0&&__g.FD.list.longship.stage==="rest"'),'G16b three quick pulls '+w,{unique,q});
  await b.shot('G16b-'+w+'-pennant');
 }
 await b.size(1440,900);await b.page();await open('hoard-lennard');
 check(await b.read('__g.FD.pop.textContent.includes("Hoard 1 of 5")'),'G16a Lennard first');await b.key('Escape');await b.key('Escape');await gWait(1000);
 await open('hoard-hmc1');check(await b.read('__g.FD.pop.textContent.includes("Hoard 2 of 5")'),'G16a HMC second');await b.key('Escape');await b.key('Escape');await gWait(1000);
 await focus('hoard-lennard');check(await b.read('__g.FD.pop.textContent.includes("Hoard 1 of 5")'),'G16a Lennard keeps first');await b.shot('G16a-lennard-first-again');await b.key('Escape');await b.key('Escape');await gWait(900);
 await focus('hoard-hmc1');check(await b.read('__g.FD.pop.textContent.includes("Hoard 2 of 5")'),'G16a HMC keeps second');
 await b.key('Home');await b.rest();await b.click('.go-next');await b.rest();await focus('hoard-lennard');check(await b.read('__g.FD.pop.textContent.includes("Hoard 1 of 5")'),'G16a after top');
 await b.key('End');await b.rest();await b.click('.go-next');await gWait(1900);await focus('hoard-lennard');check(await b.read('__g.FD.pop.textContent.includes("Hoard 1 of 5")'),'G16a explore keeps first');
 check(!b.errors.length,'no runtime errors',b.errors);
}catch(e){fail.push(e.stack);}finally{await b.close();writeFileSync(gRoot+'/actions-results.json',JSON.stringify({fail,rows},null,2));}
console.log(JSON.stringify({fail,rows},null,2));process.exitCode=fail.length?1:0;

// COMB-T, 2026-11-27: moved HMC chest and note boxes, with real focus/dig/navigation input.
if(!fail.length){const{tSpatial}=await import('./comb-t-spatial-test.mjs');await tSpatial(['hoard','notes']);}
