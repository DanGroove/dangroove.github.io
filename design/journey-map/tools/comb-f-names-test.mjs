import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {combDClock,combDAdvance} from './comb-d-clock-test.mjs';
import {STOPS} from '../data.mjs';
const b=await combBBrowser(),fail=[];
try{
 await combDClock(b);
 for(const[w,h]of[[1440,900],[1280,720],[1024,600],[820,1180],[412,730],[390,844],[360,640],[844,390]]){
  await b.size(w,h);await b.page('dist/journey-map.html');await combDAdvance(b,1600);
  const check=async tag=>{const r=await b.evaluate(`(()=>{const rows=[...document.querySelectorAll('.label-anchor')],texts=rows.map(e=>e.textContent);return {names:rows.filter(e=>e.querySelector('[data-label="name"]')).length,subs:rows.filter(e=>e.querySelector('[data-stop-sub="true"]')).map(e=>e.textContent),texts};})()`);if(r.names!==6||r.subs.length!==1||STOPS.some(s=>r.texts.includes(s.label.sub)))fail.push(w+' '+tag+' '+JSON.stringify(r));};
  await b.evaluate('__jm.go("map",{instant:true})');await combDAdvance(b,1000);await check('map');
  for(const s of STOPS){await b.evaluate('__jm.go('+JSON.stringify(s.id)+',{instant:true})');await combDAdvance(b,700);await check(s.id);const dates=await b.evaluate('document.getElementById("stop-'+s.id+'").textContent');if(!dates.includes(s.dates))fail.push(w+' '+s.id+' card dates missing');}
  await b.evaluate('__jm.go("end",{instant:true})');await combDAdvance(b,1000);await b.evaluate('document.querySelector(".go-next").click()');await combDAdvance(b,2200);
  for(let z=0;z<4;z++){await check('explore '+z);await b.evaluate('window.dispatchEvent(new KeyboardEvent("keydown",{key:"+",bubbles:true,cancelable:true}))');await combDAdvance(b,1000);}
  console.log(w+'x'+h+' names alone at overview, 6 holds and 4 Explore zooms; all card dates retained');
 }
 if(b.errors.length)fail.push(...b.errors);
}finally{await b.close();}
console.log('Failures '+JSON.stringify(fail));process.exitCode=fail.length?1:0;
