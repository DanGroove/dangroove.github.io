// Diagnose the fixed normal-date/pit conflict without moving either object.
import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {appendFileSync} from 'node:fs';
const b=await combBBrowser(),output=[];
try{
 await b.size(1024,600);await b.page('dist/journey-map.html');await b.evaluate('window.__jm.go("map",{instant:true})');await combBWait(1800);
 const r=await b.evaluate(`(()=>{const rect=e=>{const b=e.getBoundingClientRect();return[b.left,b.top,b.right,b.bottom].map(v=>+v.toFixed(2));};return [['laurier',1],['hmc1',3],['lennard',11]].map(([id,row])=>{const label=document.querySelector('.label-anchor[data-row="'+row+'"] text'),hit=document.querySelector('#f-hoard-'+id+' .hit:not(.touch-hit)'),l=rect(label),h=rect(hit),expanded=[l[0]-4,l[1]-4,l[2]+4,l[3]+4];return {id,label:label.textContent,labelBox:l,hitCircleBox:h,dateKeepOut:expanded,wholeHitBoxCovered:expanded[0]<=h[0]&&expanded[1]<=h[1]&&expanded[2]>=h[2]&&expanded[3]>=h[3],freeTopStrip:Math.max(0,expanded[1]-h[1]),explicitHit:[hit.getAttribute('cx'),hit.getAttribute('cy'),hit.getAttribute('r')],runtimeTargetDiameter:44};});})()`);
 output.push(JSON.stringify(r,null,2));await b.shot('final-1024x600-hoard-date-conflict');
}catch(e){output.push(e.stack);process.exitCode=1;}finally{await b.close();console.log(output.join('\n'));appendFileSync('COMB-D-BUILD.md','\n## node tools/comb-d-conflict-test.mjs (exit '+(process.exitCode||0)+')\n\n```text\n'+output.join('\n').replace(/[^\x00-\x7f]/g,'?')+'\n```\n');}
