import assert from 'node:assert/strict';
import {rBrowser,save,record,stop} from './comb-r-fixture.mjs';
const b=await rBrowser(),rows=[],fail=[];const check=(v,m)=>{if(!v)fail.push(m);};
try{
 await b.size(1920,950,false,2);await b.page(false,'map');await b.click('#mk-wayfinder');await b.until('__g.FD.st.focusK===1');await b.advance(800);
 await b.raw(`(()=>{window.__rHoles=[];window.__rWrites=[];window.__rCount=false;new MutationObserver(ms=>{__rHoles.push({s:__g.FD.st.cam.s,moving:__g.FD.st.gliding,records:ms.length})}).observe(document.getElementById('veil-holes'),{childList:true});const o=new MutationObserver(ms=>{if(__rCount)__rWrites.push(...ms.map(m=>({cls:m.target.getAttribute('class'),attr:m.attributeName})))});for(const e of document.querySelectorAll('.wf-needle,.wf-runes,.wf-arm,.wf-all'))o.observe(e,{attributes:true,subtree:true});})()`);
 for(let craft=0;craft<4;craft++){
  await b.raw('__rHoles=[]');await record(b);const p=await b.raw(`(()=>{const r=document.querySelectorAll('.wf-word')[${craft}].getBoundingClientRect();return[r.x+r.width/2,r.y+r.height/2]})()`);await b.tap(...p);await b.advance(4000);const frames=await stop(b);
  await b.raw('(__rWrites=[],__rCount=true)');await b.advance(2000);const writes=await b.raw('(__rCount=false,__rWrites)'),holes=await b.raw('__rHoles');check(writes.length===0,craft+' settled compass wrote '+writes.length+' attributes');check(holes.length<=2,craft+' veil holes rebuilt '+holes.length+' times');check((await b.raw('window.__jm.finds.state("wayfinder")')).craft===craft,'wrong craft '+craft);
  const counts=Array.from({length:6},(_,i)=>new Set(frames.map(f=>f.rasters[i])).size-1);for(let i=0;i<counts.length;i++)check(counts[i]<=2,craft+' layer '+i+' rebased '+counts[i]);check(frames.every((f,i)=>!i||f.rasters.filter((v,j)=>v!==frames[i-1].rasters[j]).length<=1),craft+' multiple raster cameras changed in one frame');rows.push({craft,writes,holes,counts});
 }
 const parents=await b.raw(`Object.fromEntries(['.bc-flame','.bc-glow','.bc-light','.ls-rock','.hd-glint','#f-bits','.yg-rat'].map(q=>[q,[...document.querySelectorAll(q)].map(e=>e.closest('svg')?.id)]))`);for(const[q,ids]of Object.entries(parents))check(ids.length>0&&ids.every(id=>id==='map-anim'),q+' outside map-anim: '+ids);rows.push({parents});
 await b.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:0,y:0});await b.key('Escape');await b.advance(4000);const angle=await b.raw('__g.FD.list.wayfinder.angle');check(Math.abs(angle)<.05,'unpicked compass did not rest at zero');check(!b.errors.length,'browser errors '+b.errors);

}finally{await b.close();save('r-compass-results',{rows,fail});}console.log(JSON.stringify({fail}));assert.deepEqual(fail,[]);
