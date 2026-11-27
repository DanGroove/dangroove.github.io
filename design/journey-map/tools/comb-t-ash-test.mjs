// COMB-T: real marker/tree, keyboard and well input. No control is invoked through the observation hook.
import assert from 'node:assert/strict';
import {tBrowser,save,begin,end} from './comb-t-fixture.mjs';
import {FIND_PLAY,STOPS,FINDS} from '../data.mjs';
const b=await tBrowser(),rows=[],fail=[],check=(v,m)=>{if(!v)fail.push(m);};
try{for(const[w,h]of[[1920,950],[412,915]]){const touch=w<641;await b.size(w,h,touch,1);await b.page(false,'map');
 check(FINDS.length===11,'eleven finds');check(!!await b.box('#mk-ash'),'marker seven exists');
 await b.click('#mk-ash',touch);await b.until('__g.FD.st.focusK===1');await b.advance(2200);
 for(let i=0;i<6;i++){
  if(i){if(i===2||i===3){await b.tabTo('#f-ash');await b.key(i===2?'Enter':' ');}else await b.click('#f-ash .ash-hit',touch);await b.advance(2400);}
  const r=await b.raw(`(()=>{const g=[...document.querySelectorAll('.ash-leaf')][${i}],t=g.transform.baseVal.consolidate().matrix;return{state:window.__jm.finds.state('ash'),at:[t.e+304,t.f+374],pop:document.querySelector('.pop-body')?.textContent}})()`);
  check(r.state.presses===i+1,w+' leaf order '+i);check(Math.hypot(...r.at.map((v,j)=>v-FIND_PLAY.ash.leaves[i].at[j]))<=.5,w+' leaf resting spot '+i+' '+r.at);check(r.pop?.includes(STOPS[i].label.t)&&r.pop?.includes(STOPS[i].label.sub),w+' leaf pop '+i+' '+r.pop);rows.push({w,h,i,...r});
  await begin(b);await b.advance(800);const settled=await end(b);check(!settled.writes.some(m=>/ash-leaf|ash-arcs|yg-crown/.test(m.cls||'')&&m.old!==m.value),w+' settled ash wrote '+i);const contained=await b.raw('(()=>{const e=[...document.querySelectorAll(".ash-leaf")]['+i+'],r=e.getBoundingClientRect(),s=e.closest("svg").getBoundingClientRect();return r.left>=s.left-1&&r.right<=s.right+1&&r.top>=s.top-1&&r.bottom<=s.bottom+1})()');check(contained,w+' resting leaf clipped '+i);
 }
 await b.click('#f-ash .ash-hit',touch);await b.advance(70);check((await b.raw('window.__jm.finds.state("ash")')).presses===6,w+' seventh adds no leaf');check(await b.raw('document.querySelector(".yg-crown").getAttribute("transform")!=="rotate(0 0 -30)"'),w+' seventh shakes');await b.advance(900);
 const ts=await b.raw('__g.FD.list.ash.shakeTs'),p=await b.raw('(()=>{const c=__g.FD.st.cam;return[300*c.s+c.tx,390*c.s+c.ty]})()');await b.tap(...p,touch);await b.advance(900);check(await b.raw('__g.FD.list.ash.shakeTs')===ts,w+' well accepted press');
 await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await b.page(false,'map');
 for(let i=0;i<6;i++){await b.click('#f-ash .ash-hit',touch);const r=await b.raw('({presses:__g.FD.list.ash.presses,kept:__g.FD.list.ash.kept,pop:document.querySelector(".pop-body")?.textContent})');check(r.presses===i+1&&r.kept&&r.pop?.includes(STOPS[i].label.t),w+' reduced leaf immediate '+i);}
 await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});
 }check(!b.errors.length,'console '+b.errors);}finally{await b.close();save('t-ash-results',{rows,fail});}console.log(JSON.stringify({rows:rows.length,fail}));assert.deepEqual(fail,[]);
