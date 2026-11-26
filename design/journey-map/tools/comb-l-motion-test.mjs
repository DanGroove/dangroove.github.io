import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {lBrowser,lSave,gWait,gRoot} from './comb-l-probe.mjs';
const joined=process.argv.includes('--joined'),historical=process.argv.includes('--historical'),before=process.argv.includes('--before')||historical,tag=historical?'9c895f9':joined?'after-joined':before?'before':'after',file=gRoot+'/'+tag+'-motion.json',rows=process.argv.includes('--resume')&&existsSync(file)?JSON.parse(readFileSync(file)):[];
const b=await lBrowser();
let caseIndex=0;
async function sample(name,act){if(caseIndex++<rows.length){await act();await b.rest();return;}await b.reset(name);await b.traceStart();await act();await b.rest();const trace=await b.traceEnd(tag+'-'+name);const r=await b.result();rows.push({name,...r,trace});lSave(tag+'-motion',rows);}
try{
 for(const [w,h,dpr] of [[1440,900,1],[1920,950,2],[412,730,2.625]]){
  await b.size(w,h,w<641,dpr);await b.page(historical||joined,'map',historical?'9c895f9':before);
  for(let i=0;i<7;i++)await sample(w+'-next-'+i,()=>b.click('.go-next',w<641));
  for(let i=6;i>=0;i--)await sample(w+'-back-'+i,()=>b.click('.go-back',w<641));
  await b.key('End');await b.rest();await b.click('.go-next',w<641);await b.until('__g.EX.active&&!__g.EX.motion');await gWait(500);
  await sample(w+'-wheel',async()=>{for(let i=0;i<10;i++){await b.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:w*.65,y:h*.45,deltaX:0,deltaY:-80});await gWait(50);}await b.until('!__g.EX.motion&&!__g.FD.st.exploreMoving');});
  await sample(w+'-drag',async()=>{const x=w*.6,y=h*.5;await b.send('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',clickCount:1});for(let i=1;i<=20;i++){await b.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:x-i*8,y,button:'left',buttons:1});await gWait(20);}await b.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:x-160,y,button:'left',clickCount:1});await b.until('!__g.FD.st.exploreMoving');});
  if(w<641)await sample(w+'-pinch',async()=>{const x=w/2,y=h*.45;await b.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-35,y,id:1},{x:x+35,y,id:2}]});for(let i=1;i<=12;i++){await b.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-35-i*4,y,id:1},{x:x+35+i*4,y,id:2}]});await gWait(30);}await b.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await b.until('!__g.FD.st.exploreMoving');});
 }
 assert.deepEqual(b.errors,[]);console.log(tag,'motion scenarios',rows.length);
}finally{lSave(tag+'-motion',rows);await b.close();}
