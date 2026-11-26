import assert from 'node:assert/strict';
import {pBrowser,save} from './comb-p-fixture.mjs';
const b=await pBrowser(),rows=[],fail=[];
try{for(const[w,h]of[[412,915],[390,844],[1920,950]]){
 await b.size(w,h,w<641);await b.page(false,'laurier');
 for(const height of[h,h-56]){await b.size(w,height,w<641);await b.advance(200);
 const row=await b.read('({w:innerWidth,h:innerHeight,stage:document.getElementById("stage").getBoundingClientRect().height,bottom:document.getElementById("go").getBoundingClientRect().bottom})');rows.push(row);
 if(Math.abs(row.stage-row.h)>.01||row.bottom>row.h+.01)fail.push(row);
 await b.click('.go-back',w<641);await b.rest();assert.equal(await b.read('document.documentElement.dataset.beat'),'map');
 await b.click('.go-next',w<641);await b.rest();
 }}assert.deepEqual(fail,[]);assert.deepEqual(b.errors,[]);console.log(rows);}finally{save('p-bar',{rows,fail});await b.close();}
