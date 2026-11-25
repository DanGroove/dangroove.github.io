import { combBrowser, combWait } from './comb-browser.mjs';
import { appendFileSync } from 'node:fs';
const b=await combBrowser(),lines=[];let failed=0;
const check=(ok,name,data)=>{const line=(ok?'PASS ':'FAIL ')+name+' '+JSON.stringify(data);lines.push(line);console.log(line);if(!ok)failed++;};
try {
  await b.size(412,730);await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});await b.page('dist/journey-map.html');
  await b.evaluate('window.__jm.go("map",{instant:true})');await combWait(500);
  const press=()=>b.evaluate(`(()=>{const e=document.querySelector('#f-ravens');e.focus({preventScroll:true});e.dispatchEvent(new MouseEvent('click',{bubbles:true}));})()`);
  await press();await combWait(4800);await press();await combWait(4300);
  const turned=await b.evaluate(`new Promise(resolve=>{const start=performance.now();const sample=()=>{const e=document.querySelector('#sheet .iris'),k=e?Number(e.style.transform.slice(6,-1)):0;if(e&&k>.01&&k<.98){document.querySelector('#f-ravens').dispatchEvent(new MouseEvent('click',{bubbles:true}));resolve({turned:true,k});}else if(performance.now()-start>7000)resolve({turned:false,k});else requestAnimationFrame(sample);};sample();})`);
  await combWait(600);const state=await b.evaluate(`({open:document.querySelector('#sheet').classList.contains('on'),time:document.querySelector('#sheet .tc')?.textContent,found:window.__jm.finds.found().length})`);
  check(turned.turned&&state.open&&/00:0[01]/.test(state.time),'natural reel exit reverses and remains open', {turned,state});
  check(b.errors.length===0,'no browser exceptions',b.errors);
}catch(e){check(false,'unexpected error',e.stack);}finally{await b.close();appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2/inherited-tests.log','\n## Natural reel exit reopening\n\n```text\n'+lines.join('\n').replace(/[^\x00-\x7F]/g,'?')+'\n```\n');}
process.exitCode=failed?1:0;
