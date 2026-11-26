// Reachable close views of all three grove pairs, an uncluttered crown study, and DPR 1 game rims.
import { combBBrowser, combBWait } from './comb-b-browser-test.mjs';
import { appendFileSync } from 'node:fs';
const b=await combBBrowser(),output=[];
try{
  for(const[w,h]of[[412,730],[1440,900]]){
    const tag='final-'+w+'x'+h;await b.size(w,h);await b.page('dist/journey-map.html');
    if(process.argv.includes('--refresh')){
      await b.evaluate('window.__jm.go("map",{instant:true})');await combBWait(1700);await b.shot(tag+'-overview');
      await b.evaluate('window.__jm.go("end",{instant:true})');await combBWait(1700);await b.evaluate('document.querySelector(".go-next").click()');await combBWait(2400);await b.shot(tag+'-explore');
      await b.evaluate(`(()=>{const p=window.__jm.finds.place('well'),q=window.__jm.finds.place('hammer'),s=(p[0]-q[0])/192;for(let i=0;i<18;i++)document.getElementById('stage').dispatchEvent(new WheelEvent('wheel',{clientX:p[0]+65*s,clientY:p[1]+386*s,deltaY:-120,ctrlKey:true,bubbles:true,cancelable:true}));})()`);await combBWait(1500);await b.shot(tag+'-south-grove');
      await b.evaluate('window.__jm.go("map",{instant:true})');await combBWait(1700);await b.evaluate(`document.getElementById('f-horn').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))`);await combBWait(1200);await b.evaluate(`document.getElementById('f-horn').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))`);await combBWait(4500);await b.key('Escape');await combBWait(600);
      await b.evaluate('window.__jm.go("map",{instant:true})');await combBWait(1700);await b.evaluate(`document.getElementById('f-hammer').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))`);await combBWait(2100);await b.evaluate('document.querySelector(".hm-start").click()');await combBWait(150);await b.key('Escape');await combBWait(700);await b.shot(tag+'-hammer-found');
      await b.evaluate('window.__jm.go("map",{instant:true})');await combBWait(1700);await b.shot(tag+'-found-overview');
      const kept=await b.evaluate(`[document.querySelector('.hm-kept').getAttribute('opacity'),document.querySelector('.hn-kept').getAttribute('opacity')]`);if(kept.some(v=>v!=='1'))throw Error('lasting drawing signs '+JSON.stringify(kept));
      output.push(w+'x'+h+': refreshed final overview, explore and south grove after T60 neighbour correction; closed-game hammer and found-map signs remain '+JSON.stringify(kept));continue;
    }
    await b.evaluate('window.__jm.go("map",{instant:true})');await combBWait(1700);
    await b.evaluate(`document.getElementById('f-well').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))`);await combBWait(2000);
    await b.evaluate(`(()=>{document.querySelectorAll('.ygg .t,.yg-edge,.yg-hatch').forEach(e=>e.style.visibility='hidden');const e=document.querySelector('.yg-canopy');e.setAttribute('d',e.getAttribute('d').split('ZM')[0]+'Z');})()`);await b.shot(tag+'-crown-silhouette-wide');
    // Reload after the temporary silhouette study. The actual page is never saved with this treatment.
    await b.page('dist/journey-map.html');await b.evaluate('window.__jm.go("end",{instant:true})');await combBWait(1700);await b.evaluate('document.querySelector(".go-next").click()');await combBWait(2400);
    for(const[name,x,y]of[['north-grove',367,162],['east-grove',402,354],['south-grove',234,750]]){
      await b.evaluate(`(()=>{for(let i=0;i<18;i++)document.getElementById('stage').dispatchEvent(new WheelEvent('wheel',{clientX:innerWidth/2,clientY:innerHeight/2,deltaY:120,ctrlKey:true,bubbles:true,cancelable:true}));})()`);await combBWait(1100);
      await b.evaluate(`(()=>{const p=window.__jm.finds.place('well'),q=window.__jm.finds.place('hammer'),s=(p[0]-q[0])/192;for(let i=0;i<18;i++)document.getElementById('stage').dispatchEvent(new WheelEvent('wheel',{clientX:p[0]+(${x}-302)*s,clientY:p[1]+(${y}-392)*s,deltaY:-120,ctrlKey:true,bubbles:true,cancelable:true}));})()`);await combBWait(1500);await b.shot(tag+'-'+name);
    }
    await b.page('dist/journey-map.html');await b.size(w,h,1);await b.evaluate('window.__jm.go("map",{instant:true})');await combBWait(1600);await b.evaluate(`document.getElementById('f-hammer').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))`);await combBWait(2100);await b.evaluate('document.querySelector(".hm-start").click()');await combBWait(150);await b.shot(tag+'-shield-wall-dpr1');
    output.push(w+'x'+h+': three deepest-zoom grove views, full crown silhouette at the well view (DPR 2), shield field at DPR 1; no browser exceptions');
  }
  if(b.errors.length)throw Error(JSON.stringify(b.errors));
}catch(e){output.push('FAIL '+e.stack);process.exitCode=1;}
finally{await b.close();for(const line of output)console.log(line);appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/inherited-tests.log','\n## node tools/comb-b-detail-test.mjs '+process.argv.slice(2).join(' ')+' (exit '+(process.exitCode||0)+')\n\n```text\n'+output.join('\n').replace(/[^\x00-\x7f]/g,'?')+'\n```\n');}
