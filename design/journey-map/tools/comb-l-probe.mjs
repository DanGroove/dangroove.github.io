// Structural CDP probe. Event timestamps only join raster events to frames; no durations or rates are measured.
import {writeFileSync,appendFileSync,renameSync} from 'node:fs';
import {gRoot,gWait,gBrowser} from './comb-l-browser-test.mjs';
export {gRoot,gWait};
export async function lBrowser(){
 const b=await gBrowser(); b.layers=[];b.layerEvents=[];b.paints=[];b.layerFrames=[];
 b.on('LayerTree.layerTreeDidChange',p=>{b.layers=p.layers||[];b.layerEvents.push(b.layers.map(l=>({id:l.layerId,node:l.backendNodeId,paint:l.paintCount,w:l.width,h:l.height,draw:l.drawsContent})));});
 b.on('LayerTree.layerPainted',p=>b.paints.push(p));
 b.on('Runtime.bindingCalled',p=>{if(p.name==='__combLFrame')b.layerFrames.push({frame:Number(p.payload),layers:b.layers.map(l=>({id:l.layerId,paint:l.paintCount}))});});
 await b.send('DOM.enable');await b.send('LayerTree.enable');await b.send('Runtime.addBinding',{name:'__combLFrame'});
 const page=b.page;b.page=async(...args)=>{await page(...args);await b.send('LayerTree.enable');await gWait(100);};
 await b.send('Page.addScriptToEvaluateOnNewDocument',{source:`(()=>{
  let seed=7127;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};
  const P=window.__lp={frame:0,frames:[],mutations:{},canvas:{},phase:'load',record:false};
  const owner=e=>e.id?'#'+e.id:e.closest?.('.stop,.find,#sky,#map-front,#b-detail')?.id||e.tagName+'.'+(e.getAttribute?.('class')||'');
  const raf=window.requestAnimationFrame;let last=-1;
  window.requestAnimationFrame=cb=>raf(ts=>{if(ts!==last){last=ts;P.frame++;if(P.record){window.__combLFrame?.(String(P.frame));const s=window.__g?.FD.st;P.frames.push({n:P.frame,P:window.__g?.SC.P,cam:s?.cam,focus:s?.focusK,explore:s?.exploreK,base:document.getElementById('map-base')?.style.transform,map:document.getElementById('cam')?.getAttribute('transform'),baseCam:document.getElementById('cam-base')?.getAttribute('transform'),beam:window.__g?.DP.beam,airForce:window.__g?.DP.airForce,snap:!!window.__g?.FD.list.beacon?.snap,held:window.__g?.TRIP_EL.baseRaster?.held});}}cb(ts);});
  new MutationObserver(rows=>{if(!P.record)return;for(const m of rows){const e=m.target,key=owner(e)+'/'+m.attributeName;const r=P.mutations[key]??={writes:0,same:0};r.writes++;if(e.getAttribute(m.attributeName)===m.oldValue)r.same++;}}).observe(document,{subtree:true,attributes:true,attributeOldValue:true});
  for(const name of ['clearRect','stroke','fill','fillRect','drawImage','arc','clip','beginPath','lineTo','moveTo','quadraticCurveTo']){const original=CanvasRenderingContext2D.prototype[name];CanvasRenderingContext2D.prototype[name]=function(...a){if(P.record){const id=this.canvas.id||'offscreen',c=P.canvas[id]??={calls:{},redraws:[]};c.calls[name]=(c.calls[name]||0)+1;if(name==='clearRect')c.redraws.push({frame:P.frame,calls:{...c.calls}});}return original.apply(this,a);};}
 })()`});
 b.reset=async phase=>{b.layerEvents=[];b.paints=[];b.layerFrames=[];await b.read(`Object.assign(__lp,{phase:${JSON.stringify(phase)},frames:[],mutations:{},canvas:{},record:true})`);};
 b.result=async()=>{await b.read('__lp.record=false');const owners={};for(const l of new Map([...b.layerEvents.flat(),...b.layers].map(l=>[l.id||l.layerId,{...l,layerId:l.id||l.layerId,backendNodeId:l.node||l.backendNodeId}])).values()){if(!l.backendNodeId)continue;try{const {node}=await b.send('DOM.describeNode',{backendNodeId:l.backendNodeId});const a=node.attributes||[],i=a.indexOf('id'),j=a.indexOf('class');owners[l.layerId]=node.nodeName+(i>=0?'#'+a[i+1]:j>=0?'.'+a[j+1]:'');}catch{}}
 return {page:await b.read('({frames:__lp.frames,mutations:__lp.mutations,canvas:__lp.canvas})'),layers:b.layers,owners,layerEvents:b.layerEvents,layerFrames:b.layerFrames,paints:b.paints};};
 b.traceStart=async()=>{await b.send('Tracing.start',{categories:'disabled-by-default-devtools.timeline,disabled-by-default-devtools.timeline.frame',transferMode:'ReturnAsStream'});};
 b.traceEnd=async name=>{const done=new Promise(r=>b.on('Tracing.tracingComplete',r));await b.send('Tracing.end');const {stream}=await done;let raw='';for(;;){const v=await b.send('IO.read',{handle:stream});raw+=v.data;if(v.eof)break;}await b.send('IO.close',{handle:stream});writeFileSync(gRoot+'/'+name+'.trace.json',raw);const events=JSON.parse(raw).traceEvents,frames=events.filter(e=>e.name==='BeginFrame'),rasters=events.filter(e=>e.name==='RasterTask'&&e.ph!=='E'),byLayer={};for(const e of rasters){const d=e.args?.tileData||e.args?.data?.tileData;if(!d)continue;const id=d.layerId,frame=d.sourceFrameNumber??d.frameNumber??frames.filter(f=>f.ts<=e.ts).at(-1)?.args?.frameSeqId??'unknown';const l=byLayer[id]??={total:0,frames:{}};l.total++;l.frames[frame]=(l.frames[frame]||0)+1;}return {rasterEvents:rasters.length,byLayer};};
 return b;
}
export function lSave(name,value){const file=gRoot+'/'+name+'.json',temp=file+'.tmp';if(Array.isArray(value)){writeFileSync(temp,'[');value.forEach((row,i)=>appendFileSync(temp,(i?',':'')+JSON.stringify(row)));appendFileSync(temp,']');}else writeFileSync(temp,JSON.stringify(value,null,2));renameSync(temp,file);}
