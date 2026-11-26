import assert from 'node:assert/strict';
import {lBrowser,lSave,gWait} from './comb-l-probe.mjs';
const before=process.argv.includes('--before'),tag=before?'9c895f9':'after',rows=[],b=await lBrowser();
async function record(name,act){await b.reset(name);await act();await b.rest();const r=await b.result();rows.push({name,...r});lSave(tag+'-layers',rows);}
try{for(const [w,h,touch]of [[1440,900,false],[412,730,true]]){
 await b.size(w,h,touch,2);await b.page(true,'map',before?'9c895f9':false);
 for(let i=0;i<7;i++)await record(w+'-next-'+i,()=>b.click('.go-next',touch));
 for(let i=6;i>=0;i--)await record(w+'-back-'+i,()=>b.click('.go-back',touch));
 await b.page(true,'map',before?'9c895f9':false);
 for(const id of ['hammer','ravens','wayfinder']){await record(w+'-find-'+id,async()=>{await b.tabTo('#f-'+id);await b.key('Enter');await gWait(1800);});await record(w+'-release-'+id,async()=>{for(let i=0;i<6&&await b.read('!!__g.SC.focus||!!__g.FD.sheetOwner');i++){await b.key('Escape');await gWait(400);}await b.until('!__g.SC.focus&&!__g.FD.sheetOwner');});}
 await b.key('End');await b.rest();await record(w+'-explore-in',async()=>{await b.click('.go-next',touch);await b.until('__g.EX.active&&!__g.EX.motion');});await record(w+'-explore-out',async()=>{await b.click('.go-back',touch);await b.until('!__g.EX.active&&!__g.EX.motion');});
 await b.key('Home');await b.rest();await record(w+'-hero-map',()=>b.click('.jm-start',touch));
 }assert.deepEqual(b.errors,[]);console.log(tag,'per-frame layer scenarios',rows.length);
}finally{lSave(tag+'-layers',rows);await b.close();}
