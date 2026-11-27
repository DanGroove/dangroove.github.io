import assert from 'node:assert/strict';
import {pBrowser,save} from './comb-p-fixture.mjs';
const b=await pBrowser(),rows=[],fail=[];
const counts=data=>Object.fromEntries(['cam','cam-base',...new Set(data.records.filter(r=>r.sky&&r.attr==='viewBox').map(r=>r.sky))].map(id=>[id,data.records.filter(r=>r.id===id&&r.attr==='transform'||r.sky===id&&r.root&&r.attr==='viewBox').length]));
try{await b.size(1920,950,false,2);
 for(const before of[true,false])for(const beat of(before?['map']:['map','laurier','hmc1','interkom','wayfinder-focus'])){
 await b.page(false,beat==='wayfinder-focus'?'map':beat,before);await b.begin();if(beat==='wayfinder-focus'){await b.click('#mk-wayfinder');await b.until('__g.FD.st.focusK===1');await b.advance(700);}else{await b.click('.go-next');await b.rest();}const data=await b.end(),label=(before?'base ':'after ')+beat;
 const frames=new Map(data.frames.map(f=>[f.frame,f]));
 const camera=new Set(data.records.filter(r=>r.id==='cam'&&r.attr==='transform').map(r=>r.frame));
 // Allowed during held glides: camera rebases, trail chunks, labels/fades, marker cover, crossing ship, active pressed find.
 const illegal=data.records.filter(r=>r.inMap&&r.id!=='map'&&frames.get(r.frame)?.gliding&&!['cam'].includes(r.id)&&!r.trail&&!r.label&&!r.ship&&!(r.cls.includes('mk-size')||r.cls.includes('ticks'))&&!(r.cls.split(' ').includes('mk')&&r.attr==='style')&&!(r.owner&&frames.get(r.frame)?.focus===r.owner.replace('f-','')));
 const unrebased=data.records.filter(r=>r.inMap&&(r.cls.includes('mk-size')||r.cls.includes('ticks')||r.cls.includes('label-scale')||(r.cls.includes('wf-word')||r.cls.includes('wf-tally'))&&r.attr!=='style')&&!camera.has(r.frame)&&frames.get(r.frame)?.gliding);
 const perFrame=new Map();for(const r of data.records){if((r.id==='cam'||r.id==='cam-base')&&r.attr==='transform'||r.root&&r.attr==='viewBox'){if(!perFrame.has(r.frame))perFrame.set(r.frame,new Set());perFrame.get(r.frame).add(r.id||r.sky);}}
 const overlaps=[...perFrame].filter(([f,l])=>l.size>1&&!frames.get(f)?.baseForced);
 const ranges=data.frames.filter(f=>f.gliding).map(f=>({frame:f.frame,map:f.mapRatio,clouds:f.cloudRatios}));
 const labelPositions=data.records.filter(r=>r.label&&r.attr==='transform'&&r.cls.includes('label-anchor')&&frames.get(r.frame)?.gliding&&!camera.has(r.frame));
 const row={before,beat,labelPositions:labelPositions.slice(0,5),labelPositionCount:labelPositions.length,ranges,counts:counts(data),frames:data.frames.length,illegal:illegal.slice(0,120),illegalCount:illegal.length,unrebased:unrebased.slice(0,30),overlaps};rows.push(row);
 if(!before){if(labelPositions.length)fail.push(label+' label anchor moves outside rebase: '+labelPositions.length);if(beat==='wayfinder-focus'){const n=counts(data);if(n.cam>2||n['cam-base']>2)fail.push(label+' focus layer exceeded two commits');}else if(ranges.some(f=>f.map<.87*.9-1e-6||f.map>1.15*1.1+1e-6))fail.push(label+' map waited beyond 10%');if(ranges.some(f=>f.clouds.some(c=>c.ratio<.8*.9-1e-6||c.ratio>1.3*1.1+1e-6)))fail.push(label+' cloud waited beyond 10%');if(illegal.length)fail.push(label+' writes outside quiet allowlist: '+illegal.length);if(unrebased.length)fail.push(label+' screen-size writes without cam: '+unrebased.length);if(overlaps.length)fail.push(label+' simultaneous raster writes: '+overlaps.length);}
 }
 const base=rows[0].counts,after=rows[1].counts;
 if(after.cam>base.cam*.6)fail.push('Set out map ratio '+after.cam+'/'+base.cam);
 for(const id of Object.keys(base).filter(k=>k.startsWith('cloud-')))if((after[id]||0)>base[id]*.4)fail.push(id+' ratio '+(after[id]||0)+'/'+base[id]);
 if(b.errors.length)fail.push(...b.errors);console.log(JSON.stringify({rows,fail}));assert.deepEqual(fail,[]);
}finally{save('p-quiet',{rows,fail});await b.close();}
