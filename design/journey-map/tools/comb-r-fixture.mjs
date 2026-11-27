// COMB-R: real CDP input and read-only observations, with a deterministic animation clock.
import {writeFileSync} from 'node:fs';
import {gBrowser,gRoot} from './comb-m-fixture.mjs';
import {fixedClock} from './comb-o-fixture.mjs';
export {gRoot};
export async function rBrowser(){const b=await gBrowser();await fixedClock(b);return b;}
export const save=(name,value)=>writeFileSync(gRoot+'/'+name+'.json',JSON.stringify(value,null,2));
export async function record(b){await b.raw(`(()=>{window.__rFrames=[];window.__rRecording=true;const tick=()=>{if(!window.__rRecording)return;const s=window.__g?.FD.st;if(s){const c=document.querySelector('.c-card'),r=c?.getBoundingClientRect();__rFrames.push({cam:{...s.cam},k:s.cardK.slice(),open:s.cardOpen,exploring:s.exploring,moving:s.exploreMoving,cut:!!__g.SC.cut,coverShown:!!__g.SC.cover&&!__g.SC.cover.hidden&&+getComputedStyle(__g.SC.cover).opacity>0,forced:s.rasterForced||[],rasters:['cam','cam-base','cam-live','cam-finds','cam-anim','cam-veil','cam-lines'].map(id=>document.getElementById(id)?.getAttribute('transform')),box:r&&[r.x,r.y,r.width,r.height]});}requestAnimationFrame(tick)};requestAnimationFrame(tick);})()`);}
export async function stop(b){return b.raw('(__rRecording=false,__rFrames)');}
export const sameCam=(a,b)=>Math.abs(a.s-b.s)<=.0001&&Math.abs(a.tx-b.tx)<=.01&&Math.abs(a.ty-b.ty)<=.01;
