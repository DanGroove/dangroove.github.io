// COMB-R review (2026-11-27): each cup's found-look foam drip (.hn-kept) is left out of the approved parts it compares.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {rBrowser,save} from './comb-r-fixture.mjs';
const b=await rBrowser(),rows=[],fail=[];const check=(v,m)=>{if(!v)fail.push(m);};
const approved=readFileSync('tools/skal-cups/tankards-approved.svg','utf8'),paths=[...approved.matchAll(/<path d="([^"]+)"/g)].map(m=>m[1]).filter(d=>d!=='M-18 4H18').slice(0,4);
try{for(const reduced of[false,true]){
 await b.size(1920,950,false,1);await b.send('Emulation.setEmulatedMedia',{features:reduced?[{name:'prefers-reduced-motion',value:'reduce'}]:[]});await b.page(false,'map');
 const initialLabel=await b.raw(`document.querySelector('#f-horn').getAttribute('aria-label')`),parts=await b.raw(`[...document.querySelectorAll('.hn-cup-left path:not(.hn-kept)')].map(e=>e.getAttribute('d'))`);check(JSON.stringify(parts)===JSON.stringify(paths),'tankard parts differ from approved drawing');check(initialLabel==='Two tankards on the shore. Press to raise them, press again to clink them.','old horn words');
 await b.tabTo('#f-horn');await b.key('Enter');if(!reduced)await b.until('__g.FD.st.focusK===1');await b.advance(500);const raised=await b.raw('window.__jm.finds.state("horn")');check(raised.stage==='raised','first raise stage');
 await b.key('Enter');const poses=[];for(let i=0;i<45;i++){await b.advance(1000/60);poses.push(await b.raw(`({stage:__g.FD.list.horn.stage,pose:document.querySelector('.hn-cup-left')?.getAttribute('transform'),ring:document.querySelector('.hn-ring')?.getAttribute('transform'),splash:+document.querySelector('.hn-splash')?.getAttribute('opacity')})`));}
 if(!reduced){check(new Set(poses.map(p=>p.pose)).size>3,'clink did not travel');check(poses.some(p=>p.splash>0),'no splash at contact');check(poses.some(p=>p.ring&&!p.ring.includes('undefined')),'no clink rings');}
 const hit=await b.raw(`(()=>{const h=document.querySelector('#f-horn rect.hit').getBoundingClientRect(),c=[...document.querySelectorAll('.hn-cup-left,.hn-cup-right')].map(e=>e.getBoundingClientRect());return {hit:[h.left,h.top,h.right,h.bottom],cups:c.map(r=>[r.left,r.top,r.right,r.bottom]),label:document.querySelector('#f-horn').getAttribute('aria-label')}})()`);for(const r of hit.cups)check(r[0]>=hit.hit[0]&&r[1]>=hit.hit[1]&&r[2]<=hit.hit[2]&&r[3]<=hit.hit[3],'hit box misses cup');rows.push({reduced,parts,initialLabel,raised,poses,hit});
 }check(!b.errors.length,'browser errors '+b.errors);
}finally{await b.close();save('r-skal-results',{rows,fail});}console.log(JSON.stringify({fail}));assert.deepEqual(fail,[]);
