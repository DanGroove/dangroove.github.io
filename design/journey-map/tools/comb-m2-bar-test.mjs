// Attribute/state checks only. Journey input is exclusively real CDP input.
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {gBrowser,gRoot} from './comb-m-fixture.mjs';
const b=await gBrowser(),rows=[];
try {
 assert.match((await b.send('Browser.getVersion',{},null)).product,/158\./);
 for(const [w,h,dpr,touch] of [[360,660,3,true],[1920,950,2,false]]) {
  await b.size(w,h,touch,dpr);
  for(const beat of ['laurier','hmc1','mohawk','end']) {
   await b.page(true,beat);
   await b.read(`(()=>{const e=document.querySelector('#go');window.__bar={changes:[],states:[],on:true};new MutationObserver(ms=>{for(let i=0;i<ms.length;i++){const a=ms[i].oldValue||'',z=i+1<ms.length?ms[i+1].oldValue:e.className;const has=s=>s.split(/\\s+/).includes('go-end');if(has(a)!==has(z))__bar.changes.push({from:has(a),to:has(z),moving:!!(__g.SC.move||__g.SC.cut),explore:!!__g.EX.motion});}}).observe(e,{attributes:true,attributeFilter:['class'],attributeOldValue:true});const sample=()=>{if(!__bar.on)return;__bar.states.push({moving:!!(__g.SC.move||__g.SC.cut),explore:!!__g.EX.motion,end:e.classList.contains('go-end')});requestAnimationFrame(sample);};requestAnimationFrame(sample);})()`);
   assert.equal(await b.read("document.querySelector('#go').classList.contains('go-end')"),beat==='end');
   await b.click('.go-next',touch);
   if(beat==='end')await b.until('__g.EX.active&&!__g.EX.motion&&!__g.FD.st.exploreMoving',20000);else await b.until('!__g.SC.move&&!__g.SC.cut',20000);
   const result=await b.read('(__bar.on=false,{changes:__bar.changes,states:__bar.states})');
   rows.push({w,h,dpr,touch,beat,...result});
   assert.equal(result.changes.length,0,'go-end changed during '+beat);
   const moving=result.states.filter(s=>s.moving||s.explore);assert(moving.length>0,'observed motion '+beat);assert(moving.every(s=>s.end===(beat==='end')));
   assert.equal(await b.read("document.querySelector('#go').classList.contains('go-end')"),beat==='end');
   console.log('PASS',w,beat,'no go-end changes;',moving.length,'motion states');
  }
 }
 assert.deepEqual(b.errors,[]);
} finally {writeFileSync(gRoot+'/bar-results.json',JSON.stringify(rows,null,2));await b.close();}
