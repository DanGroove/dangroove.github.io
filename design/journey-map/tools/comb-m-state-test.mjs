// Navigation memory and covered input, exclusively through real CDP input.
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {gBrowser,gRoot,gWait} from './comb-m-fixture.mjs';
const b=await gBrowser(),rows=[],fail=[];
async function check(name,fn){try{await fn();rows.push({name,ok:true});console.log('PASS',name);}catch(e){rows.push({name,ok:false,error:e.stack});fail.push(name);console.log('FAIL',name,e.message);}}
async function setup(){await b.page(true,'end');await b.click('.go-next');await b.until('__g.EX.active&&!__g.EX.motion');await b.click('#stop-laurier .st-btn');await b.rest();assert.equal(await b.read('__g.SC.exploreStop'),'laurier');}
const origin=()=>b.read('__g.SC.exploreStop');
try{
 await b.size(1920,950,false,2);
 await check('input during cover lift',async()=>{await setup();await b.click('#stop-laurier .c-close');await b.until('__g.SC.cut?.placed&&__g.EX.active');const a=await b.read('({s:__g.EX.target.s,cover:document.querySelector(".jm-cut").hidden,moving:window.__jm.moving})');assert(!a.cover&&a.moving);await b.key('-');await b.until('!__g.SC.cut&&!__g.FD.st.exploreMoving');assert((await b.read('__g.EX.cam.s'))<a.s);});
 await check('mini map carries direct origin',async()=>{await setup();await b.click('.mm-stop[data-i="2"]');await b.rest();assert.equal(await origin(),'mohawk');await b.click('#stop-mohawk .c-close');await b.rest();assert(await b.read('__g.EX.active'));});
 await check('timeline key carries direct origin',async()=>{await setup();await b.tabTo('#tl');await b.key('ArrowRight');await b.rest();assert.equal(await origin(),'hmc1');await b.click('#stop-hmc1 .c-close');await b.rest();assert(await b.read('__g.EX.active'));});
 await check('Back forgets',async()=>{await setup();await b.click('.go-back');await b.rest();assert.equal(await origin(),null);});
 await check('top and Start forget',async()=>{await setup();await b.key('Home');await b.rest();assert.equal(await origin(),null);await b.click('.jm-start');await b.rest();assert.equal(await origin(),null);});
 await check('timeline scrub calls set and forgets',async()=>{await setup();const r=await b.box('#tl');const x=r.x+r.w*.4,y=r.y+r.h*.5;await b.send('Input.dispatchMouseEvent',{type:'mousePressed',x,y,button:'left',buttons:1,clickCount:1});for(let i=1;i<=5;i++)await b.send('Input.dispatchMouseEvent',{type:'mouseMoved',x:x+i*15,y,buttons:1});await b.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:x+75,y,button:'left',buttons:0,clickCount:1});await gWait(150);assert.equal(await origin(),null);});
 await check('reduced motion switch forgets',async()=>{await setup();await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await b.until('window.__jm.mode==="scroll"');assert.equal(await origin(),null);assert(!await b.read('__g.EX.active'));await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});});
 await check('original and revised card evidence',async()=>{for(const before of[true,false]){await b.page(true,'laurier',before);await b.shot((before?'original':'revised')+'-laurier-card');await b.click('#stop-laurier .c-close');await gWait(550);await b.shot((before?'original':'revised')+'-laurier-folded');rows.push({before,dim:await b.read('__g.FD.st.dim')});}});
 assert.deepEqual(b.errors,[]);
}finally{writeFileSync(gRoot+'/state-results.json',JSON.stringify({rows,fail},null,2));await b.close();}
process.exitCode=fail.length?1:0;
