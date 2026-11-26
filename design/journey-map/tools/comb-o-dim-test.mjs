import assert from 'node:assert/strict';
import {oBrowser,collect,begin,end,gRoot,gWait,png,compare,save,version} from './comb-o-fixture.mjs';
import {STOPS,MAP,FIND_COPY,FINDS,C,DEPTH} from '../data.mjs';
const b=await oBrowser(true),rows=[],fail=[],old=new Map();const check=(v,m)=>{if(!v)fail.push(m)};
const box=e=>{const r=e.getBoundingClientRect();return[r.left,r.top,r.right,r.bottom]};
async function settle(){await b.until('!__g.SC.move&&!__g.SC.cut&&(!__g.SC.focus||__g.SC.focus.k>=1)');await b.advance(1200);await gWait(350);}
async function point(){return (b.raw||b.read)('(()=>{const f=__g.FD.list.wayfinder,c=__g.FD.st.cam;return [f.x*c.s+c.tx,f.y*c.s+c.ty]})()');}
async function setup(mode,touch,before,w,h){
 await b.page(false,mode==='steps'?'map':'end',before);
 if(mode==='steps'){await b.click('#mk-wayfinder',touch);await settle();return;}
 await b.click('.go-next',touch);await b.until('__g.EX.active&&!__g.EX.motion&&!__g.FD.st.exploreMoving');
 for(let j=0;j<8;j++){
  const scale=await b.read('__g.FD.st.cam.s');if(scale>=(touch?1.5:2.5))break;const[x,y]=await point();
  if(touch){await b.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:x-20,y,id:1},{x:x+20,y,id:2}]});for(let i=1;i<=5;i++){await b.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:x-20-i*2,y,id:1},{x:x+20+i*2,y,id:2}]});await b.advance(30);}await b.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
  else await b.send('Input.dispatchMouseEvent',{type:'mouseWheel',x,y,deltaY:-200,deltaX:0});
  await b.until('!__g.FD.st.exploreMoving');
 }
 const[x,y]=await point(),dx=__zero(w/2-x),dy=__zero(h*.46-y),sx=w*.85,sy=h*.65;
 if(touch)await b.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:sx,y:sy,id:1}]});else await b.send('Input.dispatchMouseEvent',{type:'mousePressed',x:sx,y:sy,button:'left',buttons:1,clickCount:1});
 for(let i=1;i<=10;i++){const p={x:sx+dx*Math.min(i,8)/8,y:sy+dy*Math.min(i,8)/8};if(touch)await b.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{...p,id:1}]});else await b.send('Input.dispatchMouseEvent',{type:'mouseMoved',...p,button:'left',buttons:1});await b.advance(30);await gWait(20);}
 if(touch)await b.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});else await b.send('Input.dispatchMouseEvent',{type:'mouseReleased',x:sx+dx,y:sy+dy,button:'left',buttons:0,clickCount:1});
 await b.until('!__g.FD.st.exploreMoving');await settle();
}
const __zero=x=>Math.abs(x)<.1?0:x;

const lists=data=>[...new Set(data.mutations.filter(m=>!m.sky).map(m=>m.node+'/'+m.attr+(m.style.length?':'+m.style.join(','):'')))].sort();
async function pressWord(craft,touch){const p=await b.raw('(()=>{const r=document.querySelectorAll(".wf-word")['+craft+'].getBoundingClientRect();return[r.x+r.width/2,r.y+r.height/2]})()');await b.tap(...p,touch);}
async function trial({w,h,dpr,touch,mode,before,craft,hub,press}){
 await b.size(w,h,touch,dpr);await setup(mode,touch,before,w,h);
 if(hub){await pressWord(craft,touch);await b.advance(1800);await gWait(350);}
 await b.raw('(async()=>{await __oClock.advance((Math.floor(__oClock.now/10000)+1)*10000-__oClock.now)})()');
 const tag=[before?'ace2798':'after',mode,w,craft,hub?'hub':'word',press?'press':'control'].join('-');
 const prior=await b.raw('({cam:__g.FD.st.cam,craft:__g.FD.list.wayfinder.craft})');
 await begin(b);
 if(press){if(hub){const[x,y]=await point();await b.tap(x,y,touch);}else await pressWord(craft,touch);}
 const transition=await b.raw('(()=>{const e=document.getElementById("map-veil");return e?{opacity:getComputedStyle(e).opacity,will:getComputedStyle(e).willChange,animations:e.getAnimations().map(a=>({type:a.constructor.name,property:a.transitionProperty}))}:null})()');
 await b.advance(600);await gWait(600);const data=await b.raw('(__o.record=false,{frames:__o.frames,mutations:__o.mutations})');await b.advance(400);await gWait(400);
 const state=await b.raw('(()=>{const w=__g.FD.list.wayfinder,box=e=>{const r=e.getBoundingClientRect();return[r.left,r.top,r.right,r.bottom]};return {craft:w.craft,mask:w.mask,cam:__g.FD.st.cam,veil:document.getElementById("map-veil")?{opacity:getComputedStyle(document.getElementById("map-veil")).opacity,will:getComputedStyle(document.getElementById("map-veil")).willChange,visibility:getComputedStyle(document.getElementById("map-veil")).visibility}:null,words:[...document.querySelectorAll(".wf-word,.wf-tally")].map(box),stops:__g.TRIP_EL.rows.filter(r=>w.mask?.[r.stop]).map(r=>[r.row.stop,box(r.el)]),chests:__g.FD.list.hoards.items.filter(h=>h.craftLit).map(h=>[h.id,box(h.el.querySelector(".hd-chest"))]),lines:[...document.querySelectorAll("#wf-lines path")].map(e=>({opacity:getComputedStyle(e).opacity,scale:e.getAttribute("transform"),box:box(e),point:(()=>{const p=e.getPointAtLength(e.getTotalLength()*.65),m=e.getScreenCTM();return [p.x*m.a+p.y*m.c+m.e,p.x*m.b+p.y*m.d+m.f]})()})),holes:[...document.querySelectorAll("#veil-holes circle")].map(e=>[+e.getAttribute("cx"),+e.getAttribute("cy"),+e.getAttribute("r")]),camera:document.getElementById("cam").getAttribute("transform"),veilCamera:document.getElementById("cam-veil")?.getAttribute("transform"),mapTransform:document.getElementById("map").style.transform,veilTransform:document.getElementById("map-veil")?.style.transform}})()');
 await b.shotAt(tag,await b.raw('__oClock.now'));return {tag,prior,state,data,transition,shot:tag};
}

const lum=rgb=>rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722,shade=lum([1,3,5].map(i=>parseInt(C.shade.slice(i,i+2),16)));
function ink(p,x,y){x=Math.round(x);y=Math.round(y);if(x<0||y<0||x>=p.w||y>=p.h)return null;const i=(y*p.w+x)*4;return lum(p.pixels.subarray(i,i+3));}
const median=a=>a.length?a.sort((x,y)=>x-y)[Math.floor(a.length/2)]:null;
function dimRatio(rest,pressed,restCam,cam,holes,dpr){const values=[],f=DEPTH.frame.outer;for(let y=4;y<pressed.h-4;y+=7)for(let x=4;x<pressed.w-4;x+=7){const mx=(x/dpr-cam.tx)/cam.s,my=(y/dpr-cam.ty)/cam.s;if(mx<f[0]||mx>f[2]||my<f[1]||my>f[3]||holes.some(h=>Math.hypot(mx-h[0],my-h[1])<h[2]+4/cam.s))continue;const rx=(mx*restCam.s+restCam.tx)*dpr,ry=(my*restCam.s+restCam.ty)*dpr,a=ink(rest,rx,ry),z=ink(pressed,x,y);if(a!==null&&a-shade>90&&z-shade>5)values.push((z-shade)/(a-shade));}return{samples:values.length,ratio:median(values)};}
function lineContrast(p,point,dpr){const[x,y]=point.map(v=>v*dpr),core=[],surround=[];for(let dy=-7;dy<=7;dy++)for(let dx=-7;dx<=7;dx++){const v=ink(p,x+dx,y+dy);if(v!==null)(Math.abs(dx)<=2&&Math.abs(dy)<=2?core:surround).push(v);}return core.length?Math.max(...core)-median(surround):0;}
try{await version(b);await collect(b);for(const[w,h,dpr,touch]of[[1920,950,2,false],[412,915,2.625,true]])for(const mode of ['explore','steps'])for(const craft of [0,1,2,3])for(const hub of (craft===3?[false,true]:[false]))for(const before of [true,false]){
 const args={w,h,dpr,touch,mode,before,craft,hub},control=await trial({...args,press:false}),press=await trial({...args,press:true}),state=press.state;
 const extra=press.data.mutations.filter(m=>!m.sky&&!m.way&&!control.data.mutations.some(z=>z.node===m.node&&z.attr===m.attr)&&!(m.hoard&&/hd-scratch/.test(m.node))&&!m.node.endsWith('@f-bits'));
 const row={...args,baseline:lists(control.data),press:lists(press.data),extra:lists({mutations:extra}),transition:press.transition,state,shot:press.shot,control:control.shot,controlCam:control.state.cam,frames:press.data.frames};rows.push(row);
 check(state.craft===(hub?-1:craft),press.tag+' selected '+state.craft);
 const key=[w,mode,craft,hub].join('-');if(before)old.set(key,row);else{
  check(state.camera===state.veilCamera&&state.mapTransform===state.veilTransform,press.tag+' shared camera');check(!extra.length,press.tag+' unexpected map mutations '+extra.length);
  check(Math.abs(+state.veil.opacity-(hub?0:.45))<.001,press.tag+' veil opacity');if(!hub){check(press.transition.animations.some(a=>a.type==='CSSTransition'&&a.property==='opacity'),press.tag+' CSS transition');check(state.veil.will.includes('opacity'),press.tag+' promoted opacity');}else check(state.veil.visibility==='hidden',press.tag+' veil hidden after hub');
  const ace=old.get(key),a=png(gRoot+'/'+ace.shot+'.png'),z=png(gRoot+'/'+press.shot+'.png');const compass=FINDS.find(f=>f.id==='wayfinder'),cx=compass.x*state.cam.s+state.cam.tx,cy=compass.y*state.cam.s+state.cam.ty,cr=42*state.cam.s+2;row.instrumentPixels=compare(a,z,[cx-cr,cy-cr,cx+cr,cy+cr],dpr);check(row.instrumentPixels.share<=.005,press.tag+' instrument pixels');row.pixels=state.words.map(box=>compare(a,z,box,dpr));row.stopPixels=state.stops.map(([id,box])=>({id,...compare(a,z,box,dpr)}));row.chestPixels=state.chests.map(([id,box])=>({id,...compare(a,z,box,dpr)}));
  check(row.pixels.every(p=>p.share<=.005),press.tag+' compass pixels');check(row.stopPixels.every(p=>p.share<=.005),press.tag+' lit label pixels');check(row.chestPixels.every(p=>p.share<=.005),press.tag+' lit chest pixels');
  // The fully removed veil must reproduce the same-phase before page, including the map beat.
  if(hub){row.hubReference=compare(a,z);const initial=rows.find(r=>r.w===w&&r.mode===mode&&r.craft===3&&!r.hub&&!r.before);row.restore=compare(png(gRoot+'/'+initial.control+'.png'),z);check(row.restore.share<=.005,press.tag+' restored frame '+row.restore.share);}
  if(!hub){const aceRest=png(gRoot+'/'+ace.control+'.png'),newRest=png(gRoot+'/'+control.shot+'.png');row.dimBefore=dimRatio(aceRest,a,ace.controlCam,ace.state.cam,state.holes,dpr);row.dimAfter=dimRatio(newRest,z,control.state.cam,state.cam,state.holes,dpr);check(row.dimBefore.ratio!==null&&row.dimAfter.ratio!==null&&Math.abs(row.dimAfter.ratio/row.dimBefore.ratio-1)<=.15,press.tag+' unlit pixel ratio '+JSON.stringify([row.dimBefore,row.dimAfter]));row.linePixels=state.lines.filter(l=>l.scale!=='scale(0 1)').map(l=>({point:l.point,before:lineContrast(a,l.point,dpr),after:lineContrast(z,l.point,dpr)}));const usable=row.linePixels.filter(l=>l.before>10);check(usable.length>0&&median(usable.map(l=>l.after/l.before))>=.85,press.tag+' bright line pixels');}
 }
 save('o-dim-results',{rows,fail});console.log([w,mode,craft,hub?'hub':'word',before?'ace2798':'after'].join(' '));
}check(!b.errors.length,'console '+b.errors);console.log(JSON.stringify({fail}));assert.equal(fail.length,0);}finally{save('o-dim-results',{rows,fail});await b.close();}
