// COMB-D evidence only; files stay in the authorized run folder.
import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
const b=await combBBrowser(),phase=process.argv[2]||'before';
try{
 for(const[w,h]of[[412,730],[360,640],[1440,900]]){
  const tag=phase+'-'+w+'x'+h;await b.size(w,h);await b.page('dist/journey-map.html');
  const go=async id=>{await b.key('Escape');await b.evaluate(`window.__jm.go(${JSON.stringify(id)},{instant:true})`);await combBWait(1700);};
  await go('map');await b.shot(tag+'-overview');
  if(w!==360){
   for(const id of ['hoard-hmc1','serpent','horn','hammer','well','mist','beacon']){
    await go('map');await b.evaluate(`document.getElementById('f-${id}').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))`);await combBWait(1900);
    if(id==='hammer'){await b.key('Escape');await combBWait(700);await b.evaluate(`window.__jm.go('map',{instant:true})`);await combBWait(1600);}
    await b.shot(tag+'-'+id);
    if(id==='horn'){await b.evaluate(`document.getElementById('f-horn').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))`);await combBWait(5700);await b.shot(tag+'-horn-found');}
    if(id==='hammer'){await b.evaluate(`document.getElementById('f-hammer').dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}))`);await combBWait(1900);await b.evaluate('document.querySelector(".hm-start").click()');await combBWait(120);await b.key('Escape');await combBWait(700);await b.shot(tag+'-hammer-found');}
   }
   await go('interkom');await b.shot(tag+'-interkom-card');
  }
  await go('end');await b.evaluate('document.querySelector(".go-next").click()');
  if(w===412){for(let i=0;i<=12;i++){await b.shot(tag+'-opening-'+String(i*100).padStart(4,'0'));await combBWait(100);}}
  await combBWait(2100);await b.shot(tag+'-explore-0');
  for(let z=1;z<=3;z++){await b.evaluate(`(()=>{const p=window.__jm.finds.place('well');for(let i=0;i<${z===3?18:3};i++)document.getElementById('stage').dispatchEvent(new WheelEvent('wheel',{clientX:p[0],clientY:p[1]-30,deltaY:-120,ctrlKey:${z===3},bubbles:true,cancelable:true}));})()`);await combBWait(1300);await b.shot(tag+'-explore-'+z);}
  console.log(tag+' overview, finds, cards and explore captured');
 }
 if(b.errors.length)throw Error(JSON.stringify(b.errors));
}finally{await b.close();}
