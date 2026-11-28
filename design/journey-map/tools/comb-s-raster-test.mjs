// 2026-11-27: one true-camera raster commit per frame across all camera owners.
import assert from 'node:assert/strict';
import {sBrowser,save,begin,end,equal} from './comb-s-fixture.mjs';
const b=await sBrowser(),rows=[],fail=[];
async function move(label,act,ms=6500){await begin(b);await act();await b.advance(ms);const r=await end(b);
 for(const f of r.commits)if(f.ids.filter(id=>!f.forced.includes(id.replace(/^cam-?/,'')||'map')).length>1)fail.push(label+' simultaneous commits '+JSON.stringify(f));
 for(const f of r.frames){const b=f.coverage;if(b&&(b[0]>.001||b[1]>.001||b[2]<b[4]-.001||b[3]<b[5]-.001))fail.push(label+' base uncovered '+JSON.stringify(b));}
 for(const f of r.frames)for(const p of f.trail||[])if(p.error===null||p.error>.051)fail.push(label+' trail dash differs from its raster '+JSON.stringify(p));
 for(const[id,c]of Object.entries(r.cameras||{}))if(!equal(c,r.cam))fail.push(label+' unsharp '+id);
 // Part 17e (2026-11-28): the compass veil is a canvas drawn at the shown camera, so the other layers keep raster cameras;
 // part 17f: the compass lines are drawn in the veil's canvas, which leaves five.
 if(Object.keys(r.cameras||{}).length!==5||'veil' in(r.cameras||{})||'lines' in(r.cameras||{}))fail.push(label+' missing independent camera');
 rows.push({label,commits:r.commits,forced:r.commits.filter(f=>f.forced.length),last:r.cameras,cam:r.cam});}
try{for(const[w,h]of[[1920,950],[412,915]]){const touch=w<641;await b.size(w,h,touch,1);
 await b.page(false,'map');await move(w+' Set out',()=>b.click('.go-next',touch));
 await move(w+' arrive hmc1',()=>b.click('.go-next',touch));
 await move(w+' Back from hmc1',()=>b.click('.go-back',touch));
 await b.page(false,'hmc1');await move(w+' hmc1 Next',()=>b.click('.go-next',touch));
 await b.page(false,'end');await b.until('__g.TRIP_EL.exploreReady',120000);await move(w+' explore opening',()=>b.click('.go-next',touch));
 await move(w+' visit Laurier',()=>b.click('#stop-laurier .st-btn',touch));
 await b.key('Escape');await b.advance(700);
 await move(w+' wheel zoom',()=>b.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:w*.5,y:h*.3,deltaX:0,deltaY:-120}));
 await move(w+' pinch',async()=>{const x=w*.5,y=h*.25;await b.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-30,y,id:1},{x:x+30,y,id:2}]});for(let i=1;i<=15;i++){await b.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-30-i*2,y,id:1},{x:x+30+i*2,y,id:2}]});await b.advance(16.666667);}await b.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});});
 }if(b.errors.length)fail.push(...b.errors);
}finally{await b.close();save('s-raster-results',{rows,fail});}console.log(JSON.stringify({rows:rows.map(r=>({label:r.label,commits:r.commits.length,forced:r.forced.length})),fail}));assert.deepEqual(fail,[]);
