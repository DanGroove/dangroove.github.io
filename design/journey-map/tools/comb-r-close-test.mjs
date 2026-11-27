import assert from 'node:assert/strict';
import {rBrowser,save,record,stop,sameCam} from './comb-r-fixture.mjs';
const b=await rBrowser(),rows=[],fail=[];const check=(v,m)=>{if(!v)fail.push(m);};
try{for(const[w,h]of[[1920,950],[412,915]]){
 await b.size(w,h,w<641,1);await b.page(false,'laurier');const cam=await b.raw('({...__g.FD.st.cam})');await record(b);await b.click('#stop-laurier .c-close',w<641);await b.advance(650);const closing=await stop(b);check(closing.every(f=>sameCam(f.cam,cam)),w+' X moved camera');check(closing.at(-1).k[0]===0,w+' X not closed');
 await record(b);await b.click('#stop-laurier .st-btn',w<641);await b.advance(650);const opening=await stop(b);check(opening.every(f=>sameCam(f.cam,cam)),w+' reopen moved camera');
 const differences=[];for(const a of closing.filter(f=>f.k[0]>.05&&f.k[0]<.95)){const z=opening.reduce((best,f)=>Math.abs(f.k[0]-a.k[0])<Math.abs(best.k[0]-a.k[0])?f:best);if(Math.abs(z.k[0]-a.k[0])<.0001){const delta=Math.max(...a.box.map((v,i)=>Math.abs(v-z.box[i])));differences.push(delta);check(delta<.1,w+' reverse path differs '+delta);}}check(differences.length>=3,w+' insufficient matching reverse samples');rows.push({w,closing,opening,differences});
 }check(!b.errors.length,'browser errors '+b.errors);
}finally{await b.close();save('r-close-results',{rows,fail});}console.log(JSON.stringify({fail}));assert.deepEqual(fail,[]);
