import {gBrowser,gRoot,gWait} from './comb-g2-browser-test.mjs';
import {writeFileSync} from 'node:fs';
const b=await gBrowser(),rows=[],fail=[];
function point(id){const e=document.getElementById('f-'+id);for(const p of e.querySelectorAll('path')){if(p.closest('defs'))continue;const m=p.getScreenCTM(),L=p.getTotalLength();for(let d=0;d<=L;d+=2){const v=p.getPointAtLength(d),q=new DOMPoint(v.x,v.y).matrixTransform(m);if(q.x>2&&q.x<innerWidth-2&&q.y>40&&q.y<innerHeight-110&&document.elementFromPoint(q.x,q.y)?.closest('.find')===e)return[q.x,q.y];}}return null;}
try{
 for(const[w,h,touch]of[[1440,900,false],[412,730,true]]){
  await b.size(w,h,touch);
  for(const id of ['hoard-laurier','ravens'])for(const destination of ['Next','Back','Home','End','timeline']){
   await b.page();await b.click('.go-next',touch);const p=await b.read('('+point.toString()+')('+JSON.stringify(id)+')');if(!p)throw Error('No visible '+id+' '+w);
   await b.tap(...p,touch);const pending=await b.read('__g.FD.pendingPress?.id');
   if(destination==='Next'||destination==='Back')await b.click(destination==='Next'?'.go-next':'.go-back',touch);
   else if(destination==='timeline')await b.click('.tl-blk[data-i="1"]',touch);
   else await b.key(destination);
   await b.rest();await gWait(3000);const s=await b.read('({pending:__g.FD.pendingPress?.id,focus:__g.SC.focus?.id,pop:__g.FD.popOwner?.id,sheet:__g.FD.sheetOwner?.id,digs:__g.FD.list.hoards.items[0].digs})');
   const ok=pending==='f-'+id&&!s.pending&&!s.focus&&!s.pop&&!s.sheet&&s.digs===0;rows.push({w,id,destination,pending,s,ok});if(!ok)fail.push(w+' '+id+' '+destination);
  }
  for(const id of ['hoard-laurier','ravens']){
   await b.page();await b.click('.go-next',touch);const p=await b.read('('+point.toString()+')('+JSON.stringify(id)+')');await b.tap(...p,touch);await b.rest();await gWait(1700);
   const s=await b.read('({focus:__g.SC.focus?.id,digs:__g.FD.list.hoards.items[0].digs,ravens:__g.FD.list.ravens.stage})');const ok=s.focus===id&&(id!=='hoard-laurier'||s.digs===1);rows.push({w,id,destination:'uncontested',s,ok});if(!ok)fail.push(w+' '+id+' uncontested');
  }
 }
 if(b.errors.length)fail.push(...b.errors);
}catch(e){fail.push(e.stack);}finally{await b.close();writeFileSync(gRoot+'/pending-results.json',JSON.stringify({fail,rows},null,2));}
console.log(JSON.stringify({fail,rows},null,2));process.exitCode=fail.length?1:0;
