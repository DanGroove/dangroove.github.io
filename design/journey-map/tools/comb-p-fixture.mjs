import {writeFileSync} from 'node:fs';
import {gBrowser,gRoot} from './comb-m-fixture.mjs';
import {fixedClock} from './comb-o-fixture.mjs';
export {gRoot};
export {save,png,compare} from './comb-n-fixture.mjs';
export async function pBrowser(clock=true){
 if(process.env.COMB_RUN!=='comb-p')throw Error('Set COMB_RUN=comb-p');
 const b=await gBrowser(); if(clock)await fixedClock(b);
 b.patch=html=>html.replace('window.__g={FD,','window.__g={MAP,C,MARK,CARD_TAIL,CAMERA,FD,');
 await b.send('Page.addScriptToEvaluateOnNewDocument',{source:`(()=>{
 const p=window.__p={record:false,frame:0,frames:[],records:[]};
 const observer=new MutationObserver(ms=>{if(!p.record)return;for(const m of ms){const e=m.target;if(!e.closest?.('#map,#map-base,#sky'))continue;p.records.push({frame:p.frame,id:e.id,tag:e.tagName,cls:e.getAttribute('class')||'',owner:e.closest('.find')?.id,sky:e.closest('[data-sky]')?.getAttribute('data-sky'),root:e.matches('[data-sky]'),attr:m.attributeName,value:e.getAttribute(m.attributeName),old:m.oldValue,inMap:!!e.closest('#map'),label:!!e.closest('.label-anchor,.label-scale,.map-tier1,.map-tier2,.lg,.legend-symbol'),trail:!!e.closest('#trail-pieces'),ship:!!e.closest('#f-longship')});}});
 observer.observe(document,{subtree:true,attributes:true,attributeOldValue:true});
 const sample=()=>{p.frame++;queueMicrotask(()=>{if(p.record&&window.__g?.FD.st){const g=__g,s=g.FD.st,t=s.trav&&[s.trav[0]*s.cam.s+s.cam.tx,s.trav[1]*s.cam.s+s.cam.ty];p.frames.push({frame:p.frame,P:s.P,kind:s.kind,moving:!!g.SC.move,focus:g.SC.focus?.id,gliding:!!s.gliding,baseForced:!!g.TRIP_EL.rasterFrame?.baseForced,mapRatio:g.TRIP_EL.raster?.base?s.cam.s/g.TRIP_EL.raster.base.s:1,cloudRatios:g.DP.clouds.filter(c=>c.scale&&getComputedStyle(c.el).visibility==='visible').map(c=>{const r=c.el.getBoundingClientRect();return {id:c.el.dataset.sky,ratio:c.lastScale/c.scale,box:[r.left,r.top,r.right,r.bottom],onScreen:r.right>0&&r.bottom>0&&r.left<innerWidth&&r.top<innerHeight};}),cam:{...s.cam},trav:t,skyline:g.MAP?[g.MAP.toronto.box[0]*s.cam.s+s.cam.tx,g.MAP.toronto.box[2]*s.cam.s+s.cam.tx]:null,wolves:g.DP.birds.map(b=>({name:b.name,chase:b.chase,eclipse:b.eclipse,visible:getComputedStyle(b.el).visibility==='visible',fills:[...b.el.querySelectorAll('[fill]')].map(e=>e.getAttribute('fill'))}))});}});requestAnimationFrame(sample);};requestAnimationFrame(sample);
 })()`});
 b.captureExact=async name=>{const {data}=await b.send('Page.captureScreenshot',{format:'png'});writeFileSync(gRoot+'/'+name+'.png',Buffer.from(data,'base64'));};
 b.begin=()=>b.read('Object.assign(__p,{record:true,frames:[],records:[]})');
 b.end=()=>b.read('(__p.record=false,{frames:__p.frames,records:__p.records})');
 b.rest=async()=>{await b.until('!__g.SC.move&&!__g.SC.cut');if(clock)await b.advance(700);};
 return b;
}
