import { combBrowser, combWait } from './comb-browser.mjs';
import { appendFileSync } from 'node:fs';
const b=await combBrowser(),lines=[];let failed=0;
const check=(ok,name,data)=>{const line=(ok?'PASS ':'FAIL ')+name+' '+JSON.stringify(data);lines.push(line);console.log(line);if(!ok)failed++;};
try {
  await b.size(412,730);await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await b.page('dist/journey-joined.html');await combWait(600);
  const hero=await b.evaluate(`({marker:+getComputedStyle(document.querySelector('.marker-layer')).opacity,bar:getComputedStyle(document.querySelector('#tl')).visibility,inert:document.querySelector('#tl').inert})`);
  check(hero.marker===0&&hero.bar==='hidden'&&hero.inert,'joined reduced hero has no map-control bleed',hero);
  await b.evaluate('window.__jm.go("map",{instant:true})');await combWait(500);
  const map=await b.evaluate(`({top:document.querySelector('#stage').getBoundingClientRect().top,marker:+getComputedStyle(document.querySelector('.marker-layer')).opacity,bar:getComputedStyle(document.querySelector('#tl')).visibility,inert:document.querySelector('#tl').inert,value:document.querySelector('#tl').getAttribute('aria-valuenow')})`);
  check(Math.abs(map.top)<1&&map.marker===1&&map.bar==='visible'&&!map.inert&&map.value==='0','joined reduced Map is fully fitted with its fixed timeline',map);
  await b.evaluate('window.__jm.go("hmc2",{instant:true})');await combWait(400);
  await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});await combWait(500);
  check(await b.evaluate('window.__jm.P===window.__jm.beats.find(b=>b.id==="hmc2").P'),'joined motion switch keeps the current stop');
  await b.evaluate('window.__jm.go("end",{instant:true})');await combWait(400);await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await combWait(500);
  const footer=await b.evaluate('document.querySelector("#ft").getBoundingClientRect().top');check(footer<365,'joined reduced switch keeps the footer',footer);
  await b.evaluate('document.querySelector("#tl").focus({preventScroll:true})');for(const type of ['keyDown','keyUp'])await b.send('Input.dispatchKeyEvent',{type,key:'Home',code:'Home',windowsVirtualKeyCode:36});await combWait(400);
  const home=await b.evaluate(`({top:document.querySelector('#stage').getBoundingClientRect().top,value:document.querySelector('#tl').getAttribute('aria-valuenow'),bar:getComputedStyle(document.querySelector('#tl')).visibility})`);check(Math.abs(home.top)<1&&home.value==='0'&&home.bar==='visible','reduced timeline Home returns to Map with focus still visible',home);
  check(b.errors.length===0,'no browser exceptions',b.errors);
}catch(e){check(false,'unexpected error',e.stack);}finally{await b.close();appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/inherited-tests.log','\n## Joined reduced-motion checks\n\n```text\n'+lines.join('\n').replace(/[^\x00-\x7F]/g,'?')+'\n```\n');}
process.exitCode=failed?1:0;
