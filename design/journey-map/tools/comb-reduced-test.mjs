import { combBrowser, combWait } from './comb-browser.mjs';
import { appendFileSync } from 'node:fs';
const b=await combBrowser(),lines=[];let failed=0;
const check=(ok,name,data)=>{const text=(ok?'PASS ':'FAIL ')+name+' '+JSON.stringify(data);lines.push(text);console.log(text);if(!ok)failed++;};
try {
  await b.size(412,730);await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await b.page('dist/journey-map.html');await combWait(300);
  const initial=await b.evaluate(`({scroll:scrollY,mode:window.__jm.mode,value:document.querySelector('#tl').getAttribute('aria-valuenow'),map:document.querySelector('#stage').getBoundingClientRect().top})`);
  check(initial.scroll===0&&initial.mode==='scroll'&&initial.value==='0'&&initial.map===0,'reduced load starts at map with a valid timeline value',initial);
  await b.evaluate(`document.querySelector('#tl').focus({preventScroll:true})`);await b.send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});await b.send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});await combWait(400);
  const first=await b.evaluate(`({value:document.querySelector('#tl').getAttribute('aria-valuetext'),tabs:[...document.querySelectorAll('.find')].filter(e=>e.tabIndex===0).length})`);
  check(/Laurier/.test(first.value)&&first.tabs===0,'first reduced arrow reaches Laurier and off-screen finds leave Tab order',first);
  await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});await combWait(500);
  await b.evaluate('window.__jm.go("map",{instant:true})'); await combWait(600);
  await b.evaluate("(()=>{const e=document.querySelector('#f-hammer');e.focus({preventScroll:true});e.dispatchEvent(new MouseEvent('click',{bubbles:true}));})()"); await combWait(1300);
  const found=await b.evaluate('window.__jm.finds.found().length');
  await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]}); await combWait(500);
  const sheet=await b.evaluate("({focus:document.documentElement.classList.contains('jm-focus'),open:document.querySelector('#sheet').classList.contains('on'),found:window.__jm.finds.found().length})");
  check(!sheet.focus&&!sheet.open&&sheet.found===found,'reduced switch closes an active sheet without stale focus or lost finds',sheet);
  await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]}); await combWait(500);
  for (const id of ['ravens','serpent','hoard-hmc1','well','horn','beacon']) {
    await b.evaluate('window.__jm.go("map",{instant:true})'); await combWait(600);
    const press=()=>b.evaluate(`(()=>{const e=document.querySelector('#f-${id}');e.focus({preventScroll:true});e.dispatchEvent(new MouseEvent('click',{bubbles:true}));})()`);
    await press(); await combWait(id==='ravens'?900:200); if(id==='horn'){await press();await combWait(200);}
    const count=await b.evaluate('window.__jm.finds.found().length');
    await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]}); await combWait(400);
    const before=await b.evaluate(`[...document.querySelectorAll('#f-${id} g[transform]')].map(e=>e.getAttribute('transform'))`); await combWait(350);
    const after=await b.evaluate(`[...document.querySelectorAll('#f-${id} g[transform]')].map(e=>e.getAttribute('transform'))`);
    const state=await b.evaluate(`window.__jm.finds.state('${id}')`), kept=await b.evaluate('window.__jm.finds.found().length');
    check(JSON.stringify(before)===JSON.stringify(after)&&kept===count,'active '+id+' settles without losing finds',{stage:state.stage,found:kept,digs:state.digs,notes:state.fire});
    await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]}); await combWait(400);
  }
  await b.evaluate('window.__jm.go("end",{instant:true})');await combWait(500);
  await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await combWait(500);
  const end=await b.evaluate(`({footerTop:document.querySelector('#ft').getBoundingClientRect().top,nova:getComputedStyle(document.querySelector('#nova')).display,hit:getComputedStyle(document.querySelector('#nova-hit')).display})`);
  check(end.footerTop<365&&end.nova==='none'&&end.hit==='none','live reduced switch keeps the footer and hides the animated nova',end);
  check(b.errors.length===0,'no browser exceptions',b.errors);
}catch(e){check(false,'unexpected error',e.stack);}finally{await b.close();appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-f/inherited-tests.log','\n## Reduced-motion edge checks\n\n```text\n'+lines.join('\n').replace(/[^\x00-\x7F]/g,'?')+'\n```\n');}
process.exitCode=failed?1:0;
