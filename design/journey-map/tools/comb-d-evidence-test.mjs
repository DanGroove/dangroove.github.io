// DPR 2 product captures. The in-memory copy exposes only the existing focus API
// so the map drawing can be studied in its own view before the game sheet opens.
import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {FINDS} from '../data.mjs';
import {readFileSync,appendFileSync} from 'node:fs';
const b=await combBBrowser(),output=[],failures=[],log=s=>{console.log(s);output.push(s);};
const html=readFileSync('dist/journey-map.html','utf8').replace('</script>','\nwindow.__dFocus=stepsFocus;\n</script>');
const views=Object.fromEntries(FINDS.filter(f=>f.view).map(f=>[f.id,f.view]));
const go=async id=>{await b.key('Escape');await b.evaluate(`window.__jm.go(${JSON.stringify(id)},{instant:true})`);await combBWait(1700);};
const focus=async id=>{await go('map');await b.evaluate(`window.__dFocus(${JSON.stringify(id)},${JSON.stringify(views[id])})`);await combBWait(1000);};
try{
 for(const[w,h]of[[412,730],[1440,900]]){
  await b.size(w,h);await b.send('Page.navigate',{url:'data:text/html;base64,'+Buffer.from(html).toString('base64')});await combBWait(1800);await b.evaluate('document.fonts.ready.then(()=>true)');
  const tag='final-'+w+'x'+h;
  await go('map');await b.shot(tag+'-overview');
  for(const id of ['serpent','well','mist','beacon','hammer','horn']){
   await focus(id);await b.shot(tag+'-'+id+'-rest');
   if(id==='horn'){
    const rest=await b.evaluate(`(()=>{const r=document.querySelector('.hn-horn').getBoundingClientRect();return {width:r.width,share:r.width/innerWidth};})()`);log(w+'x'+h+' horn unfound view: '+JSON.stringify(rest));if(rest.share<.2)failures.push('unfound horn too small '+w);
    await b.evaluate(`document.getElementById('f-horn').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))`);await combBWait(700);await b.shot(tag+'-horn-popup');
    const metrics=await b.evaluate(`(()=>{const h=document.querySelector('.hn-horn').getBoundingClientRect(),p=document.querySelector('.pop-in').getBoundingClientRect();return {width:h.width,share:h.width/innerWidth,overlap:h.left<p.right&&h.right>p.left&&h.top<p.bottom&&h.bottom>p.top};})()`);log(w+'x'+h+' horn close view: '+JSON.stringify(metrics));if(metrics.share<.2||metrics.overlap)failures.push('horn '+w+' '+JSON.stringify(metrics));
    await b.evaluate(`document.getElementById('f-horn').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))`);await combBWait(5800);await b.shot(tag+'-horn-found');
   }
   if(id==='hammer'){
    await b.evaluate(`document.getElementById('f-hammer').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))`);await combBWait(900);await b.evaluate('document.querySelector(".hm-start").click()');await combBWait(120);await b.key('Escape');await combBWait(600);await b.evaluate(`window.__dFocus('hammer',${JSON.stringify(views.hammer)})`);await combBWait(900);await b.shot(tag+'-hammer-found');
   }
   if(id==='beacon'){
    for(let i=0;i<4;i++){await b.evaluate(`document.getElementById('f-beacon').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))`);await combBWait(2100);}
    const state=await b.evaluate('window.__jm.finds.state("beacon")');log(w+' beacon read state '+JSON.stringify({fire:state.fire,read:state.read}));if(state.fire!==4)failures.push(w+' beacon readings unreachable');await b.shot(tag+'-beacon-read');
   }
  }
  await go('map');await b.evaluate(`document.getElementById('f-hoard-hmc1').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))`);await combBWait(1800);await b.shot(tag+'-dig-close');
  await go('map');await b.shot(tag+'-found-overview');
  const kept=await b.evaluate(`[document.querySelector('.hn-kept').getAttribute('opacity'),document.querySelector('.hm-kept').getAttribute('opacity')]`);log(w+' lasting horn/hammer ink '+JSON.stringify(kept));if(kept.some(v=>v!=='1'))failures.push(w+' lost lasting sign');
  await go('interkom');await b.shot(tag+'-interkom-card');
  await go('end');const start=Date.now();await b.evaluate('document.querySelector(".go-next").click()');
  if(w===412)for(let i=0;i<=16;i++){await combBWait(Math.max(0,start+i*100-Date.now()));const actual=Date.now()-start;await b.shot(tag+'-opening-'+String(i*100).padStart(4,'0'));log('opening capture nominal '+i*100+' ms; actual '+actual+' ms');}
  await combBWait(2000);await b.shot(tag+'-explore-0');
  for(let z=1;z<=3;z++){await b.evaluate(`(()=>{const p=window.__jm.finds.place('well');for(let i=0;i<${z===3?18:3};i++)document.getElementById('stage').dispatchEvent(new WheelEvent('wheel',{clientX:p[0],clientY:p[1]-30,deltaY:-120,ctrlKey:${z===3},bubbles:true,cancelable:true}));})()`);await combBWait(1300);await b.shot(tag+'-explore-'+z);}
  log(tag+' DPR 2 overview, close/rest/found drawings, phone/card seam, beacon notes and four explore zooms captured');
 }
 if(b.errors.length)failures.push(...b.errors);
}catch(e){failures.push(e.stack);}finally{await b.close();log('Failures: '+JSON.stringify(failures));appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-f/inherited-tests.log','\n## node tools/comb-d-evidence-test.mjs (exit '+(failures.length?1:0)+')\n\n```text\n'+output.join('\n').replace(/[^\x00-\x7f]/g,'?')+'\n```\n');}
process.exitCode=failures.length?1:0;
