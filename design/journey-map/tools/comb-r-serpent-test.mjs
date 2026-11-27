import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rBrowser,save} from './comb-r-fixture.mjs';
const b=await rBrowser(),rows=[],fail=[];const check=(v,m)=>{if(!v)fail.push(m);};
const names=['final','final_v2','final_v2_FINAL','final_v3_FINAL','final_v3_FINAL_real'];
const originalProbe=readFileSync('tools/comb-q-serpent-test.mjs','utf8'),clearanceSource=originalProbe.slice(originalProbe.indexOf('function clearance(){'),originalProbe.indexOf('\nconst b=')).replace("!e.closest('#f-serpent,.jo-body')","!e.closest('#f-serpent,[data-anim-source=\"f-serpent\"],.jo-body')");
function joint(){
 const map=document.querySelector('.jo-surface[data-i="0"] .jo-outline'),head=document.querySelector('.jg-head'),crown=head?.querySelector('.jg-crown'),lower=head?.querySelector('.jg-neck-edge');if(!map||!crown||!lower)return null;
 const inv=map.getScreenCTM().inverse(),project=(e,p)=>new DOMPoint(p.x,p.y).matrixTransform(inv.multiply(e.getScreenCTM()));
 return [crown,lower].map((e,i)=>{const L=e.getTotalLength(),a=project(e,e.getPointAtLength(i?L:0)),z=project(e,e.getPointAtLength(i?L-.02:.02));let best={gap:Infinity};const total=map.getTotalLength();for(let u=0;u<=total;u+=.03){const p=map.getPointAtLength(u),d=Math.hypot(a.x-p.x,a.y-p.y);if(d<best.gap){const q=map.getPointAtLength(Math.min(total,u+.03)),ax=z.x-a.x,ay=z.y-a.y,bx=q.x-p.x,by=q.y-p.y,dot=Math.abs((ax*bx+ay*by)/(Math.hypot(ax,ay)*Math.hypot(bx,by)||1));best={gap:d,angle:Math.acos(Math.min(1,dot))*180/Math.PI,a:[a.x,a.y],p:[p.x,p.y]};}}return best;});
}
try{for(const[w,h]of[[1920,950],[1440,900],[412,915]]){
 await b.size(w,h,w<641,1);await b.page(false,'map');await b.click('#mk-serpent',w<641);await b.until('__g.FD.st.focusK===1');await b.advance(400);
 const states=[];for(let poke=0;poke<=5;poke++){if(poke){await b.tabTo('#f-serpent');await b.key('Enter');await b.until('!__g.FD.list.serpent.playing&&["ready","asleep"].includes(__g.FD.list.serpent.stage)',20000);}const s=await b.raw('window.__jm.finds.state("serpent")');check(s.fileName===names[Math.min(poke,4)]+'.pdf',w+' revision '+poke+': '+s.fileName);check(s.stage===(poke===5?'asleep':'ready'),w+' ship poke '+poke);const clear=await b.raw('('+clearanceSource+')()');if(clear.nameBox)check(clear.nameBox[0]>=4&&clear.nameBox[2]<=w-4,w+' revision '+poke+' name viewport clearance');for(const l of clear.labels)if(l.gap!==null)check(l.gap>=(l.kick?3:4),w+' revision '+poke+' '+l.text+' gap '+l.gap);states.push({s,clear});}
 await b.key('Enter');await b.until('__g.FD.list.serpent.stage==="ready"');check((await b.raw('window.__jm.finds.state("serpent")')).fileName==='final.mp4',w+' next round extension');
 const joints=[];for(const side of[-1,0,1]){const p=await b.raw(`(()=>{const c=__g.FD.st.cam;return [(465)*c.s+c.tx,(101+${side}*40)*c.s+c.ty]})()`);await b.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:p[0],y:p[1]});await b.advance(1200);const j=await b.raw('('+joint.toString()+')()');check(!!j,w+' joint hooks missing');if(j)for(const n of j){check(n.gap<=.2,w+' joint endpoint gap '+n.gap);check(n.angle<=6,w+' joint tangent '+n.angle);}joints.push({side,j});}rows.push({w,h,states,joints});
 }
 await b.size(1920,950,false,1);await b.page(false,'map');await b.tabTo('#f-horn');await b.key('Enter');await b.until('__g.FD.list.horn.stage==="raised"');await b.key('Enter');await b.until('__g.FD.list.serpent.swells.some(s=>s.live&&s.horn)');const heard=[];for(let i=0;i<20;i++){await b.advance(40);const j=await b.raw('('+joint.toString()+')()');if(j)for(const n of j){check(n.gap<=.2,'hear joint endpoint '+n.gap);check(n.angle<=6,'hear joint tangent '+n.angle);}heard.push({j,state:await b.raw('window.__jm.finds.state("serpent")')});}rows.push({hear:true,heard});
 check(!b.errors.length,'browser errors '+b.errors);
}finally{await b.close();save('r-serpent-results',{rows,fail});}console.log(JSON.stringify({fail}));assert.deepEqual(fail,[]);
