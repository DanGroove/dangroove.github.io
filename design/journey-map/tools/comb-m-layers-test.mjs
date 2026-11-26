// Layer churn counts in the brief's observation windows; no traces or timing measurements.
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {gBrowser,gRoot,gWait} from './comb-m-fixture.mjs';
const b=await gBrowser(),rows=[];let current=[],record=false,events=[],previous=new Map(),known=new Set(),removed=new Set();
b.on('LayerTree.layerTreeDidChange',p=>{current=p.layers||[];if(!record)return;const next=new Map(current.map(l=>[l.layerId,l]));for(const[id,l]of next)if(!known.has(id)&&l.drawsContent)events.push({type:'built',id,w:l.width,h:l.height,node:l.backendNodeId});for(const[id,l]of previous)if(!next.has(id)&&l.drawsContent&&!removed.has(id))events.push({type:'destroyed',id,w:l.width,h:l.height,node:l.backendNodeId});for(const id of next.keys())known.add(id);for(const id of previous.keys())if(!next.has(id))removed.add(id);previous=next;});
try{
 const version=await b.send('Browser.getVersion',{},null);assert.match(version.product,/158\./);await b.send('LayerTree.enable');
 for(const[w,h,dpr,touch]of[[360,660,3,true],[1920,950,2,false]])for(const rule of[false,true]){
  await b.size(w,h,touch,dpr);await b.page(true,'map');await b.send('LayerTree.enable');
  if(!rule)await b.read(`(()=>{const s=document.createElement('style');s.textContent='.marker-layer, .marker-layer .mk, #go { will-change: auto !important; }';document.head.appendChild(s)})()`);
  await gWait(300);
  for(const name of['Set out','Laurier','HMC Connections','Mohawk','skip-HMC','skip-Interkom','skip-Lennard','Dig','Explore']){
   if(name==='Explore')await b.until('!__g.SC.move&&!__g.SC.cut');
   await b.click('.go-next',touch);await gWait(100);
   events=[];previous=new Map(current.map(l=>[l.layerId,l]));known=new Set(previous.keys());removed=new Set();record=true;
   if(name==='Explore')await b.until('__g.EX.active&&!__g.EX.motion&&!__g.FD.st.exploreMoving',20000);else await b.until('!__g.SC.move&&!__g.SC.cut',20000);
   await gWait(1000);record=false;
   if(name.startsWith('skip-'))continue;
   const built=events.filter(e=>e.type==='built'),destroyed=events.filter(e=>e.type==='destroyed'),large=built.filter(e=>e.w>48||e.h>48);
   for(const e of events){if(!e.node)continue;try{const {node}=await b.send('DOM.describeNode',{backendNodeId:e.node});e.owner={tag:node.nodeName,attributes:node.attributes};}catch{}} 
   const skipped=[];
   for(const e of large){if(!e.node)continue;try{const {object}=await b.send('DOM.resolveNode',{backendNodeId:e.node});const r=await b.send('Runtime.callFunctionOn',{objectId:object.objectId,functionDeclaration:'function(){return this.matches?.(".tl-count") || !!this.closest?.(".tl-count-screen");}',returnByValue:true});if(r.result.value)skipped.push(e);}catch{}}
   const eligible=large.filter(e=>!skipped.includes(e));
   const split=eligible.filter(e=>e.owner?.tag==='path'&&e.owner.attributes?.some((a,i,v)=>a==='class'&&/\brs-trace\b/.test(v[i+1]))),full=eligible.filter(e=>e.w===w&&e.h===h);
   const allowed=w===1920&&h===950&&name==='Mohawk'&&split.length===1&&full.length===1?[...split,...full]:[];
   const row={w,h,dpr,touch,rule,name,built:built.length,destroyed:destroyed.length,large:large.length,runestoneSplit:allowed.map(e=>e.id),skippedTimeline:skipped.length,unexpected:eligible.filter(e=>!allowed.includes(e)).length,events};rows.push(row);console.log(JSON.stringify({...row,events:undefined}));writeFileSync(gRoot+'/layers-results.json',JSON.stringify({version,rows},null,2));
  }
 }
 assert.deepEqual(b.errors,[]);
 const bad=rows.filter(r=>r.rule&&['Laurier','HMC Connections','Mohawk'].includes(r.name)&&r.unexpected);assert.equal(bad.length,0,'large painted layers built: '+JSON.stringify(bad.map(({events,...r})=>r)));
}finally{record=false;writeFileSync(gRoot+'/layers-results.json',JSON.stringify(rows,null,2));await b.close();}
