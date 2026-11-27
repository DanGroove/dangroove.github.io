// COMB-S observations. Input always goes through CDP; clocks alone are deterministic.
import {rBrowser,gRoot} from './comb-r-fixture.mjs';
import {writeFileSync} from 'node:fs';
export {gRoot};
export const save=(name,value)=>writeFileSync(gRoot+'/'+name+'.json',JSON.stringify(value,null,2));
export async function sBrowser(){const b=await rBrowser();
 await b.send('Page.addScriptToEvaluateOnNewDocument',{source:`(()=>{
 const s=window.__s={record:false,commits:[],writes:[],frames:[]};
 const observer=new MutationObserver(ms=>{if(!s.record)return;const g=window.__g;if(!g)return;const st=g.FD.st;
 const ids=[...new Set(ms.filter(m=>m.attributeName==='transform'&&/^cam(?:-(?:base|live|finds|anim|lines|veil))?$/.test(m.target.id)&&m.oldValue!==m.target.getAttribute('transform')).map(m=>m.target.id))];
 if(ids.length)s.commits.push({now:performance.now(),ids,forced:st?.rasterForced||[],cam:st&&{...st.cam}});
 for(const m of ms){const e=m.target;if(!e.closest?.('#map-stack'))continue;const layer=e.closest('svg');s.writes.push({now:performance.now(),id:e.id,cls:e.getAttribute('class'),attr:m.attributeName,old:m.oldValue,value:e.getAttribute(m.attributeName),layer:layer?.id,visible:layer?.dataset.idleVisible,moving:!!(st?.gliding||st?.exploreMoving),idle:!!e.closest('[data-idle]'),loop:!!e.closest('.rv-body,.rv-head,.jg-file,.jf-name,.bc-beam,.bc-flame,.ls-rock,.ls-sail,.hd-glint,.yg-rat,.yg-eagle,.yg-wings,.wl-rip')});}
 });observer.observe(document,{attributes:true,attributeOldValue:true,subtree:true,childList:true});
 const tick=()=>{if(s.record&&window.__g?.FD.st){const st=__g.FD.st;s.frames.push({now:performance.now(),cam:{...st.cam},moving:!!(st.gliding||st.exploreMoving),clocks:(__g.FD.idleLayers||[]).map(o=>({id:o.el.id,visible:o.visible,time:o.time,box:o.screenBox,loop:o.loop,pose:o.node?.getAttribute('transform'),poses:o.loop?[o.node,...o.node.querySelectorAll('.rv-body,.rv-head,.jg-file,.jf-name,.bc-beam,.bc-flame,.ls-rock,.ls-sail,.hd-glint,.yg-rat,.yg-eagle,.yg-wings,.wl-rip')].map((e,i)=>({key:i+':'+e.getAttribute('class'),transform:e.getAttribute('transform'),x:+e.getAttribute('x'),y:+e.getAttribute('y')})):[]})),coverage:(()=>{const p=__g.TRIP_EL.baseRaster?.camera,b=__g.VIEW.baseBox,c=st.cam;if(!p||!b)return null;const k=c.s/p.s,x=c.tx-p.tx*k,y=c.ty-p.ty*k;return[-b.ox*k+x,-b.oy*k+y,(__g.VIEW.w+b.ox)*k+x,(__g.VIEW.h+b.oy)*k+y,__g.VIEW.w,__g.VIEW.h]})(),trail:(__g.FD.idleLayers||[]).flatMap(o=>o.trailGroup&&o.visible&&o.camera&&!st.exploreK?o.pieces.filter(p=>st.u>p.u0&&st.u<p.u1).map(p=>({id:o.el.id,error:Math.abs(parseFloat(p.node.style.strokeDasharray)-(st.u-p.u0)*o.camera.s)})):[]),rasters:__g.TRIP_EL.raster?.layerCams,forced:st.rasterForced});}requestAnimationFrame(tick);};requestAnimationFrame(tick);
 })()`});return b;}
export async function begin(b){await b.raw('Object.assign(__s,{record:true,commits:[],writes:[],frames:[]})');}
export async function end(b){return b.raw('(__s.record=false,{commits:__s.commits,writes:__s.writes,frames:__s.frames,cameras:__g.TRIP_EL.raster?.layerCams,cam:{...__g.FD.st.cam},errors:__g.FD.st.rasterForced})');}
export const equal=(a,b)=>a&&b&&['s','tx','ty'].every(k=>Math.abs(a[k]-b[k])<1e-8);
