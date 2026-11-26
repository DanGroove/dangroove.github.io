import assert from 'node:assert/strict';
import {appendFileSync} from 'node:fs';
import {lBrowser,lSave,gWait,gRoot} from './comb-l-probe.mjs';
const joined=process.argv.includes('--joined'),historical=process.argv.includes('--historical'),before=process.argv.includes('--before')||historical,quick=process.argv.includes('--quick'),tag=historical?'9c895f9':joined?'after-joined':before?'before':'after',rows=[];
const b=await lBrowser();
try{
 for(const [w,h,dpr] of quick?[[1440,900,1]]:[[1440,900,1],[1920,950,2],[412,730,2.625],[844,390,3]]){
  await b.size(w,h,w<641,dpr);
  for(const beat of quick?['map','laurier','end']:['map','laurier','hmc1','mohawk','hmc2','interkom','lennard','x','end']){
   await b.page(historical||joined,beat,historical?'9c895f9':before);await gWait(1800);
   for(const park of w<641?['off']:['off','on']){
    await b.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:park==='on'?w/2:3,y:park==='on'?h/2:3});await gWait(3000);await b.reset(beat+'-'+park);await gWait(2000);
    const r=await b.result();rows.push({w,h,dpr,beat,park,...r});appendFileSync(gRoot+'/'+tag+'-rest-final.jsonl',JSON.stringify(rows.at(-1))+'\n');
    if(!before){assert.equal(r.page.mutations['#go/class']?.writes||0,0,'go class settles');for(const [key,v] of Object.entries(r.page.mutations))if(key.startsWith('stop-')||key.startsWith('#stop-'))assert.equal(v.writes,0,key);}
   }
   if(['map','laurier','x','end'].includes(beat))await b.shot(tag+'-'+w+'-'+beat);
  }
 }
 assert.deepEqual(b.errors,[]);console.log(tag,'rest structural rows',rows.length);
}finally{lSave(tag+'-rest',rows);await b.close();}
