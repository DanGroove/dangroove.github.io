// Coastal footing, trail and Interkom pair clearance at the critical sizes.
import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {appendFileSync} from 'node:fs';
const b=await combBBrowser(),output=[],failures=[];
function check(){
 const box=e=>{const r=e.getBoundingClientRect();return[r.left,r.top,r.right,r.bottom];},gap=(a,b)=>Math.hypot(Math.max(a[0]-b[2],b[0]-a[2],0),Math.max(a[1]-b[3],b[1]-a[3],0));
 const ink=[...document.querySelectorAll('#f-beacon .g,#f-beacon .o,#f-beacon .l,#f-beacon .t,#f-beacon .bc-flame')],boxes=ink.map(box),q=[Math.min(...boxes.map(b=>b[0])),Math.min(...boxes.map(b=>b[1])),Math.max(...boxes.map(b=>b[2])),Math.max(...boxes.map(b=>b[3]))],card=document.querySelector('#stop-interkom');
 const blockers=['.face','.stone','.c-tail'].map(s=>({name:s,gap:gap(q,box(card.querySelector(s)))}));
 const path=document.getElementById('trail-done'),matrix=path.getScreenCTM(),L=path.getTotalLength(),trail=[];
 for(let u=0;u<=L;u+=.25){const p=path.getPointAtLength(u);trail.push(new DOMPoint(p.x,p.y).matrixTransform(matrix));}
 let clearance=Infinity;
 for(const e of ink){const m=e.getScreenCTM(),L=e.getTotalLength();for(let u=0;u<=L;u+=.5/Math.hypot(m.a,m.b)){const p=e.getPointAtLength(u),at=new DOMPoint(p.x,p.y).matrixTransform(m);for(const t of trail)clearance=Math.min(clearance,Math.hypot(at.x-t.x,at.y-t.y)-2.05);}}
 const review=box(document.querySelector('.jm-review')),overlap=q[0]<review[2]&&q[2]>review[0]&&q[1]<review[3]&&q[3]>review[1];
 const s=card.querySelector('.stone').getBoundingClientRect(),target=document.elementFromPoint(s.left+s.width/2,s.top+s.height/2),shieldTarget=target?.closest('.stop,.mk,.find')?.id;
 return{blockers,trailGap:clearance,reviewOverlap:overlap,shieldTarget};
}
try{for(const[w,h]of[[1440,900],[1024,600],[360,640]]){await b.size(w,h);await b.page('dist/journey-map.html');for(const beat of['map','interkom']){await b.evaluate(`window.__jm.go('${beat}',{instant:true})`);await combBWait(1700);const r=await b.evaluate('('+check.toString()+')()');const line=w+'x'+h+' '+beat+': '+JSON.stringify(r);output.push(line);console.log(line);if(r.trailGap<-.1)failures.push('trail '+w+' '+beat);if(beat==='interkom'&&r.blockers.some(x=>x.gap<12))failures.push('card '+w);if(r.shieldTarget!=='stop-interkom')failures.push('shield hit '+w+' '+beat+' '+r.shieldTarget);await b.shot('final-'+w+'x'+h+'-beacon-'+beat);}}}catch(e){failures.push(e.stack);}finally{await b.close();output.push('Failures: '+JSON.stringify(failures));appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/inherited-tests.log','\n## node tools/comb-d-beacon-probe-test.mjs (exit '+(failures.length?1:0)+')\n\n```text\n'+output.join('\n').replace(/[^\x00-\x7f]/g,'?')+'\n```\n');}
process.exitCode=failures.length?1:0;
