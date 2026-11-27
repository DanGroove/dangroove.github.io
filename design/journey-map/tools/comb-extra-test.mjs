// COMB-T, 2026-11-27: the ash replaces the well find and is the tree zoom anchor.
import { combBrowser, combWait } from './comb-browser.mjs';
import { appendFileSync } from 'node:fs';
const b=await combBrowser(),lines=[];let failed=0;
const check=(ok,name,value)=>{const line=(ok?'PASS ':'FAIL ')+name+' '+JSON.stringify(value);lines.push(line);console.log(line);if(!ok)failed++;};
const open=async id=>{await b.evaluate('window.__jm.go("map",{instant:true})');await combWait(600);await b.evaluate(`(()=>{const e=document.querySelector('#f-${id}');e.focus({preventScroll:true});e.dispatchEvent(new MouseEvent('click',{bubbles:true}));})()`);};
try {
  await b.page('dist/journey-map.html');
  for(const[w,h]of [[1440,900],[412,730]]) {
    await b.size(w,h);await b.evaluate('window.__jm.go("laurier",{instant:true})');await combWait(600);
    const scale=await b.evaluate(`(()=>{const a=window.__jm.finds.place('hammer'),c=window.__jm.finds.place('ash');return (c[0]-a[0])/190;})()`);
    await open('wayfinder');await combWait(900);await b.evaluate(`document.querySelector('#f-wayfinder').dispatchEvent(new KeyboardEvent('keydown',{bubbles:true,cancelable:true,key:'ArrowRight'}))`);await combWait(1000);
    const way=await b.evaluate(`({focus:document.documentElement.dataset.find,words:[...document.querySelectorAll('.wf-word')].map(e=>{const r=e.getBoundingClientRect();return {t:e.textContent,x:r.x,y:r.y,right:r.right,bottom:r.bottom}}),names:[...document.querySelectorAll('.label-anchor[data-row]')].filter(e=>getComputedStyle(e).opacity>0.5).length})`);
    check(way.focus==='wayfinder'&&way.words.every(r=>r.x>=0&&r.right<=w&&r.y>=40&&r.bottom<h-100),'wayfinder fits named result '+w,way);await b.shot(w+'x'+h+'-wayfinder');
    await b.evaluate('window.__jm.go("end",{instant:true})');await combWait(600);await b.evaluate('document.querySelector(".go-next").click()');await combWait(1800);
    await b.evaluate(`(()=>{for(let i=0;i<24;i++)window.dispatchEvent(new KeyboardEvent('keydown',{key:'=',bubbles:true,cancelable:true}));})()`);await combWait(1200);
    const zoom=await b.evaluate(`(()=>{const a=window.__jm.finds.place('hammer'),c=window.__jm.finds.place('ash');return (c[0]-a[0])/190;})()`);
    check(zoom>=scale,'explore reaches hold scale '+w,{hold:scale,explore:zoom});
  }
  await b.size(844,390);await open('hammer');await combWait(1300);
  const hammer=await b.evaluate(`(()=>{const e=document.querySelector('.hm-card');return {scroll:e.scrollHeight-e.clientHeight,buttons:[...document.querySelectorAll('.hm-panel button')].filter(e=>!e.disabled&&e.getClientRects().length).map(e=>{const r=e.getBoundingClientRect();return {t:e.textContent,w:r.width,h:r.height,bottom:r.bottom}})};})()`);
  check(hammer.scroll<=1&&hammer.buttons.every(r=>r.w>=43.9&&r.h>=43.9&&r.bottom<=390),'landscape hammer panel and targets',hammer);await b.shot('844x390-hammer');
  await b.evaluate('document.querySelector("#sheet-dismiss").click()');await combWait(300);await open('runestone');await combWait(5500);
  const rune=await b.evaluate(`[...document.querySelectorAll('.pz-ctl button')].filter(e=>!e.hidden).map(e=>{const r=e.getBoundingClientRect();return {t:e.textContent,w:r.width,h:r.height,top:r.top,bottom:r.bottom};})`);
  check(rune.length>0&&rune.every(r=>r.w>=43.9&&r.h>=43.9&&r.top>=0&&r.bottom<=390),'landscape rubbing controls',rune);await b.shot('844x390-rubbing');
  check(b.errors.length===0,'no browser exceptions',b.errors);
}catch(e){check(false,'unexpected error',e.stack);}finally{await b.close();appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/inherited-tests.log','\n## Extra browser checks\n\n```text\n'+lines.join('\n').replace(/[^\x00-\x7F]/g,'?')+'\n```\n');}
process.exitCode=failed?1:0;
