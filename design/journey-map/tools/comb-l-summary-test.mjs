import{combL2Records}from'./comb-l2-records-test.mjs';
// Post-process structural records only. This never opens or drives a page.
import {readFileSync,writeFileSync,existsSync} from 'node:fs';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l2/';
const read=name=>JSON.parse(readFileSync(root+name+'.json','utf8'));
const range=values=>values.length?[Math.min(...values),Math.max(...values)]:null;
function simple(r){const id=Object.entries(r.owners||{}).find(([,name])=>name==='svg#map')?.[0],paints=(r.layerFrames||[]).flatMap(f=>f.layers.filter(l=>l.id===id).map(l=>l.paint)),tiles=r.trace?.byLayer?.[id];return {
 name:r.name,w:r.w,h:r.h,dpr:r.dpr,beat:r.beat,park:r.park,frames:r.page.frames.length,
 layers:range((r.layerFrames||[]).map(f=>f.layers.length)),mapPaint:range(paints),mapPaintDelta:paints.length?Math.max(...paints)-Math.min(...paints):null,
 mapCameraWrites:r.page.mutations['#cam/transform']?.writes||0,goWrites:r.page.mutations['#go/class']?.writes||0,cardWrites:Object.entries(r.page.mutations).filter(([k])=>/stop-/.test(k)).reduce((n,[,v])=>n+v.writes,0),
 mapTiles:tiles?{total:tiles.total,worst:Math.max(...Object.values(tiles.frames)),perFrame:tiles.frames}:null,
 canvas:Object.fromEntries(Object.entries(r.page.canvas).map(([id,c])=>{const n=c.calls.clearRect||0;return [id,{redraws:n,calls:c.calls,perRedraw:n?Object.fromEntries(Object.entries(c.calls).map(([k,v])=>[k,Number((v/n).toFixed(3))])):null}];}))};}
const metrics={sources:{before:'saved joined page labeled 9c895f9',after:'after rest, motion and explore are standalone; after layers are joined; 10b paired joined counts are in part10-to-10b-summary.json'}};
for(const tag of ['9c895f9','after'])for(const name of ['rest','motion','layers','explore']){const preferred=tag==='after'&&name!=='layers'?'after-joined-'+name:tag+'-'+name;const file=existsSync(root+preferred+'.json')?preferred:tag+'-'+name;if(existsSync(root+file+'.json')){const list=metrics[tag+'-'+name]=[];for await(const r of combL2Records(root+file+'.json'))list.push(simple(r));}}
metrics.pixels=read('pixels');metrics.pixelFailures=metrics.pixels.filter(r=>!r.pass);
if(existsSync(root+'fit-drag.json'))metrics.fitDrag=read('fit-drag').map(simple);
metrics.firstGlide={};for(const tag of ['9c895f9','after']){const data=[];for await(const r of combL2Records(root+tag+'-layers.json'))if(/next-0$/.test(r.name))data.push(r);metrics.firstGlide[tag]=data.filter(r=>/next-0$/.test(r.name)).map(r=>({name:r.name,counts:r.layerFrames.map(f=>[f.frame,f.layers.length])}));}
writeFileSync(root+'metrics.json',JSON.stringify(metrics,null,2));
const names=[...new Set((metrics['after-motion']||[]).map(r=>r.name))];
let csv='scenario,before_map_tiles,after_map_tiles,before_worst_frame,after_worst_frame,before_map_paints,after_map_paints,before_camera_writes,after_camera_writes\n';
for(const name of names){const a=metrics['9c895f9-motion']?.find(r=>r.name===name),b=metrics['after-motion']?.find(r=>r.name===name);csv+=[name,a?.mapTiles?.total,b?.mapTiles?.total,a?.mapTiles?.worst,b?.mapTiles?.worst,a?.mapPaintDelta,b?.mapPaintDelta,a?.mapCameraWrites,b?.mapCameraWrites].join(',')+'\n';}
writeFileSync(root+'glides.csv',csv);writeFileSync(root+'first-glide-layers.json',JSON.stringify(metrics.firstGlide));
console.log('Structural summaries saved; pixel failures',metrics.pixelFailures.map(r=>({w:r.w,beat:r.beat,canvas:r.id,raw:r.raw.max,blur:r.blur.max})));
