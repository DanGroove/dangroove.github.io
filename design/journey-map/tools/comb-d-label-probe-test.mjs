// Read-only, in-memory diagnosis of the warmed label cache.
import {readFileSync,appendFileSync} from 'node:fs';
import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
let html=readFileSync('dist/journey-map.html','utf8');
const start=html.indexOf('  const clear=(q,s)=>{'),end=html.indexOf('  const scales=Array.from',start);
let block=html.slice(start,end).replace('const clear=(q,s)=>{','const clear=(q,s)=>{clear.why={kind:"shield",q,s};');
block=block.split('\n').map(line=>{
 const kind=line.includes('for(let x=')?'ink':line.includes('placed.some')?'label':line.includes('FINDS.some')?'marker':line.includes('q[0]<24')?'frame':null;
 if(!kind)return line;
 const value=kind==='ink'?'{kind:"ink",p,q,s}':'{kind:"'+kind+'",q,s}';
 if(line.includes('{return false;}'))return line.replace('{return false;}','{clear.why='+value+';return false;}');
 return line.replace('return false;','{clear.why='+value+';return false;}');
}).join('\n');
html=html.slice(0,start)+block+html.slice(end);
html=html.replace('E.exploreReady=true;','E.exploreReady=true;window.__probe={clear,box,rows:E.rows,scales,placed,labelScale};');
const b=await combBBrowser(),output=[];
try{
 await b.size(412,730);await b.send('Page.navigate',{url:'data:text/html;base64,'+Buffer.from(html).toString('base64')});await combBWait(3500);
 for(let i=0;i<80&&!await b.evaluate('!!window.__probe');i++)await combBWait(250);
 const result=await b.evaluate(`(()=>{const P=window.__probe,out=[];for(const id of ['hmc1','hmc2','lennard']){const r=P.rows.find(r=>r.row.stop===id&&r.row.stopSub),name=P.rows.find(r=>r.row.stop===id&&!r.row.stopSub),fit=P.scales[0],s=P.scales.at(-1),nk=P.labelScale(name.row.kind,fit),k=P.labelScale(r.row.kind,fit),n=name.exploreLocal,w=r.box.width,reasons={},clear=[];for(let dy=4/fit/k;dy<=20/fit/k;dy+=2/fit/k)for(const x of[n[0]*nk/k,n[2]*nk/k-w,(n[0]*nk/k+n[2]*nk/k-w)/2]){const q=[x,n[3]*nk/k+dy,x+w,n[3]*nk/k+dy+r.box.height],world=P.box(r,q,s);if(P.clear(world,s))clear.push(q);else{const reason=P.clear.why.kind;reasons[reason]=(reasons[reason]||0)+1;if(!out.some(o=>o.id===id&&o.reason===reason))out.push({id,reason,detail:P.clear.why});}}out.push({id,from:r.exploreFrom,name:name.exploreLocal,b:r.box,candidatesClearAtMax:clear.length,reasons});}return out;})()`);
 output.push(JSON.stringify(result,null,2));
}catch(e){output.push(e.stack);process.exitCode=1;}finally{await b.close();console.log(output.join('\n'));appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-e/inherited-tests.log','\n## node tools/comb-d-label-probe-test.mjs (exit '+(process.exitCode||0)+')\n\n```text\n'+output.join('\n').replace(/[^\x00-\x7f]/g,'?')+'\n```\n');}
