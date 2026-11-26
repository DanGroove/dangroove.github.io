import assert from 'node:assert/strict';
import {lBrowser,lSave,gWait} from './comb-l-probe.mjs';
const b=await lBrowser(),rows=[];
try{for(const before of [true,false])for(const [w,h,dpr]of [[1440,900,1],[1920,950,2]]){
 await b.size(w,h,false,dpr);await b.page(true,'end',before?'9c895f9':false);await b.click('.go-next');await b.until('__g.EX.active&&!__g.EX.motion&&!__g.FD.st.exploreMoving');await gWait(800);
 const name=(before?'9c895f9':'after')+'-'+w+'-fit-drag';await b.reset(name);await b.traceStart();const x=w*.8,y=h*.5;await b.send('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',buttons:1,clickCount:1});
 for(let i=1;i<=40;i++){await b.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:x-i*10,y,button:'left',buttons:1});await gWait(25);}await b.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:x-400,y,button:'left',clickCount:1});await b.until('!__g.FD.st.exploreMoving');await gWait(300);
 const trace=await b.traceEnd(name),result=await b.result();rows.push({name,w,h,dpr,...result,trace});lSave('fit-drag',rows);
 }assert.deepEqual(b.errors,[]);console.log('Joined full-fit 400px drag cases',rows.length);
}finally{lSave('fit-drag',rows);await b.close();}
