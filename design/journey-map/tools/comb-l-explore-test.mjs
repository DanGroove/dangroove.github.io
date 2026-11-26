import assert from 'node:assert/strict';
import {lBrowser,lSave,gWait} from './comb-l-probe.mjs';
const joined=process.argv.includes('--joined'),historical=process.argv.includes('--historical'),tag=historical?'9c895f9':joined?'after-joined':'after',b=await lBrowser(),rows=[];
try{for(const [w,h,dpr]of [[1440,900,1],[1920,950,2],[412,730,2.625],[844,390,3]]){
 await b.size(w,h,w<641,dpr);await b.page(historical||joined,'end',historical?'9c895f9':false);await b.click('.go-next',w<641);await b.until('__g.EX.active&&!__g.EX.motion&&!__g.FD.st.exploreMoving');
 for(const park of w<641?['off']:['off','on']){await b.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:park==='on'?w/2:3,y:park==='on'?h/2:3});await gWait(3000);await b.reset('explore-rest');await gWait(2000);const r=await b.result();rows.push({w,h,dpr,park,name:'rest',...r});if(!historical){assert.equal(r.page.canvas.deep?.calls.clearRect||0,0);assert.equal(r.page.mutations['#go/class']?.writes||0,0);}lSave(tag+'-explore',rows);}
 await b.reset('zoom-key');await b.key('+');await b.until('!__g.FD.st.exploreMoving');await gWait(300);rows.push({w,h,dpr,name:'key',...await b.result()});lSave(tag+'-explore',rows);
 await b.shot(tag+'-'+w+'-explore');
 }assert.deepEqual(b.errors,[]);console.log(tag,'explore rest/key cases',rows.length);
}finally{lSave(tag+'-explore',rows);await b.close();}
