// 2026-11-27: actual idle mutations, bounded SVG boxes, paused per-piece clocks and held poses.
import assert from 'node:assert/strict';
import {sBrowser,save,begin,end} from './comb-s-fixture.mjs';
const b=await sBrowser(),rows=[],fail=[],resume=[];
const numbers=s=>(s||'').match(/[-+]?(?:[0-9]*[.])?[0-9]+/g)?.map(Number)||[];
const position=p=>{const t=numbers(/translate\(([^)]*)\)/.exec(p.transform||'')?.[1]),r=numbers(/rotate\(([^)]*)\)/.exec(p.transform||'')?.[1]);return{x:t[0]||0,y:t[1]||0,angle:r[0]||0,nameX:p.x,nameY:p.y};};
const pose=`[...document.querySelectorAll('.rv-body,.rv-head,.jg-file,.jf-name,.bc-beam,.bc-flame,.ls-rock,.ls-sail,.hd-glint,.yg-rat,.yg-eagle,.yg-wings,.wl-rip')].map((e,i)=>({key:i+':'+e.getAttribute('class'),layer:e.closest('svg')?.id,transform:e.getAttribute('transform'),y:e.getAttribute('y')}))`;
// Camera-led label visibility/fill styles share two of these nodes; pose attributes
// below are the idle loops. S3 and the native paint pass cover the label styles.
async function sample(label,act,ms){await begin(b);await act();await b.advance(ms);const r=await end(b),loops=r.writes.filter(w=>w.loop&&w.attr!=='style'&&w.old!==w.value);
 for(const w of loops){if(!w.idle)fail.push(label+' idle wrote big layer '+w.layer+' '+w.cls);if(w.visible==='false')fail.push(label+' offscreen write '+w.cls);if(w.moving)fail.push(label+' repaint during camera move '+w.cls);}
 const boxes=await b.raw(`(__g.FD.idleLayers||[]).map(o=>{const r=o.el.getBoundingClientRect();return{id:o.el.id,box:[r.x,r.y,r.width,r.height],visible:o.visible,time:o.time}})`);
 for(const o of boxes)if(o.box[2]>await b.raw('innerWidth')+.01||o.box[3]>await b.raw('innerHeight')+.01)fail.push(label+' oversized idle '+o.id+' '+o.box);
 rows.push({label,boxes,loops,frames:r.frames});return r;}
try{for(const[w,h]of[[1920,950],[412,915]]){await b.size(w,h,w<641,1);await b.page(false,'map');
 await sample(w+' rest overview',async()=>{},2200);
 await sample(w+' focus camera',()=>b.click('#mk-wayfinder',w<641),2200);
 await sample(w+' compass rest offscreen',async()=>{},2200);
 const before=await b.raw(pose);await b.key('Escape');await b.advance(10);await sample(w+' resume camera',async()=>{},1800);const after=await b.raw(pose);
 // The resume boundary is measured from consecutive deterministic frames, not the entire moving interval.
 const clocks=rows.at(-1).frames;for(let i=1;i<clocks.length;i++)for(const o of clocks[i].clocks){const p=clocks[i-1].clocks.find(p=>p.id===o.id);if(p&&o.time-p.time>1/60+.00001)fail.push(w+' clock jumped '+o.id+' '+(o.time-p.time));if(p&&!p.visible&&!o.visible&&o.time!==p.time)fail.push(w+' offscreen clock ran '+o.id);}
 for(let i=1;i<clocks.length;i++)for(const o of clocks[i].clocks){if(!o.loop)continue;const p=clocks[i-1].clocks.find(p=>p.id===o.id);if(!p||!o.visible||!(clocks[i-1].moving&&!clocks[i].moving||!p.visible))continue;let units=0,degrees=0;for(const z of o.poses||[]){const a=p.poses?.find(a=>a.key===z.key);if(!a)continue;const A=position(a),Z=position(z);units=Math.max(units,Math.hypot(A.x-Z.x,A.y-Z.y),Math.hypot(A.nameX-Z.nameX,A.nameY-Z.nameY));degrees=Math.max(degrees,Math.abs(((Z.angle-A.angle+540)%360)-180));}resume.push({w,id:o.id,units,degrees});if(units>.5+.000001||degrees>2+.000001)fail.push(w+' resume jump '+o.id+' '+units+' units '+degrees+' degrees');}
 rows.push({label:w+' resume poses',before,after});
 }if(b.errors.length)fail.push(...b.errors);
}finally{await b.close();save('s-idle-results',{rows,resume,fail});}console.log(JSON.stringify({rows:rows.map(r=>({label:r.label,layers:r.boxes?.length,writes:r.loops?.length})),fail}));assert.deepEqual(fail,[]);
