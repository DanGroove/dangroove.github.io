// Drawing-command snapshots. These are not pixel/visual/FPS tests.
import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { STARS, NOVA, C } from '../data.mjs';
import { VIEW, tripResize, tripState, SEQ } from '../trip.mjs';
import { starsBuild, starsResize, starsJoin, starsFrame, starsTick } from '../stars.mjs';
import { footerBuild, footerBuildX, footerNovaResize, footerMotion } from '../footer.mjs';
import { NOVA_LIVE } from '../depth.mjs';

// Re-recorded 2026-11-24 for the trail's run into the X (stars.mjs): the rush frames change by design; the standalone desktop
// overview gains two faint supply draws (the trail no longer counts toward a sector's whirl); blast, settle and explore draw
// the same primitives in a new bin order (bins keep the colour/alpha keys of earlier frames).
const recording=process.argv.includes('--record'), expected={
  "1440x900/0/0": "75c9ebcc35168b3b8138abe989ddf4518c78c3088c337a112ed1cebc7a7b8167",
  "1440x900/0/1": "ea18ae5c100bbec5e87abb423bab0af88e158239e66351033472ce321f093857",
  "1440x900/0/2": "e5fba21a520cda11ba502c2742a546912a8d78fa4df4427716022b0ab74c79e2",
  "1440x900/0/3": "b9ac255661a6c32422c14f4f9cf7ba679db236124c9ea9eb13106272ce05427b",
  "1440x900/0/4": "b7f0ffe7eb84833eebb15d4cf053e47da458182bbf9101acf99339609db663e2",
  "1440x900/0/5": "8ba7ebf7d7a74fc04557f33e949788ddfc385e5b28033b2a65ac19c8e9daf7aa",
  "1440x900/0/6": "076029e4e424cdbb782eae17dddd112cf1f335d1a57c2965aaa9503c62fff61d",
  "412x730/0/0": "e1624cf891c54f310639bd42b2ff95ef4752cc862d558397acfc64cfde6f9499",
  "412x730/0/1": "2b56bcfbf908d778e380260e2cb1c8df304b3957b41a4b5d756e0a7a7edad049",
  "412x730/0/2": "1ede72c4a40bee87edbcb1e6a813988a98e998df4857a54839d442ae331db365",
  "412x730/0/3": "0d9b4189e93a098271a1173ca78e34658c301e9e32ab343e33d9bef39893caae",
  "412x730/0/4": "2385b6ffbd582c9c29dba50fb6c1a038ae7c3ddbc8c9b49be96570141c2b1ca6",
  "412x730/0/5": "45f8508f0c323d9cce5a37fba7f21d0a9d1efb2f73b4fb1beb009d1b026e9088",
  "412x730/0/6": "e3bef9f66da68914ac385d7aec58fb31118f8663271182b110a728e828eda1a1",
  "412x730/1200/0": "578c51f67a8df70dd74c4af2f83e191def6ff57640e36f4fc53fb72ff6397b1e",
  "412x730/1200/1": "4476472c0de37f978fd6c336ce633065bfca6ac7fd42c71b97610bab0382e97c",
  "412x730/1200/2": "9aff50af74d17008bb425030a0561f82d13ca6ba415b7bdc4b8b90bf8e04948d",
  "412x730/1200/3": "39289beb287a62d8af3c0ae3931bb54bb234574972c80324ab086e3f11ff8767",
  "412x730/1200/4": "39a0cce6f71c66272049cbe9174ef8cc52c6ccdba05c46a5fbb72dcab612699d",
  "412x730/1200/5": "655d2277921e03a74c9263a69fc1ad38249b15b07a483023afb16d5e326c0896",
  "412x730/1200/6": "3e5854d39ddfcf10d77c5860b55c792d3e218265722e75cf736e0b1c3e331a4b"
};
let operations=[],serial=0,bandwidth={before:0,after:0};
function node(){return {style:{},classList:{contains:()=>false},setAttribute(){},querySelectorAll:()=>[],querySelector:()=>node(),addEventListener(){}};}
function canvas(){
  const el={...node(),serial:serial++,width:0,height:0},ctx={globalAlpha:1,fillStyle:'',strokeStyle:'',lineWidth:1},stack=[];
  for(const k of ['setTransform','clearRect','drawImage','fillRect','translate','rotate','scale','setLineDash','beginPath','moveTo','lineTo','quadraticCurveTo','closePath','arc','stroke','fill'])ctx[k]=(...args)=>{
    if(k==='clearRect'){
      if(el.serial>1&&el.width===Math.round(VIEW.w*2)&&el.height===Math.round(VIEW.h*2)){bandwidth.before+=el.width*el.height;bandwidth.after+=args[2]*args[3];}
      return;
    }
    // Full-screen scratch compositing is optimized separately. Pin its painted
    // children and alpha, rather than its source rectangle / copy bandwidth.
    if(k==='drawImage'&&args[0]?.width===Math.round(VIEW.w*2)&&args[0]?.height===Math.round(VIEW.h*2))return;
    operations.push([el.serial,k,args.map(a=>a?.serial!==undefined?{canvas:a.serial}:a),ctx.globalAlpha,ctx.fillStyle,ctx.strokeStyle,ctx.lineWidth]);
  };
  ctx.save=()=>stack.push({globalAlpha:ctx.globalAlpha,fillStyle:ctx.fillStyle,strokeStyle:ctx.strokeStyle,lineWidth:ctx.lineWidth});
  ctx.restore=()=>Object.assign(ctx,stack.pop());
  for(const k of ['createLinearGradient','createRadialGradient'])ctx[k]=(...args)=>({kind:k,args,stops:[],addColorStop(t,c){this.stops.push([t,c]);}});
  el.getContext=()=>ctx;return el;
}
globalThis.window={devicePixelRatio:2.625,addEventListener(){}};
globalThis.document={createElement:tag=>tag==='canvas'?canvas():node()};
globalThis.Image=class {set src(value){this.source=value;}};
const star=canvas(),nova=canvas();footerBuild(node(),true);footerBuildX(node(),false,nova);
const segment=(kind,t)=>{const q=SEQ.find(s=>s.kind===kind);return tripState(q.a+t*q.len);};
const output={};
for(const[w,h,n]of [[1440,900,0],[412,730,0],[412,730,1200]]){
  tripResize(w,h,w<=640?96:120);starsJoin(null);starsBuild(star);starsResize(w,h);footerNovaResize(w,h);
  if(n){starsJoin({count:n,drawn(i,out){out[0]=i*83%w;out[1]=i*137%h;return out;},look:i=>({size:2,alpha:.8,colour:i%20?C.paper:C.red})});starsFrame(0,segment('hero',0),[.5,.5]);}
  footerMotion(0,0,segment('overview',.5),[0,0],false);NOVA_LIVE.time=0;NOVA_LIVE.flares=[];
  const states=[segment('overview',.5),segment('rush',.3),segment('blast',.3),segment('settle',1)];
  for(const zoom of [1,2,3]){const st=segment('rest',0);st.sEnd=st.cam.s;st.cam={...st.cam,s:VIEW.s0*zoom,tx:w/2-300*VIEW.s0*zoom,ty:h/2-450*VIEW.s0*zoom};st.exploreK=1;st.exploring=true;states.push(st);}
  for(let i=0;i<states.length;i++){
    const st=states[i];operations=[];bandwidth={before:0,after:0};starsTick(0,st);starsFrame(1.25,st,[.5,.5]);footerMotion(1.25,0,st,[0,0],false);
    const key=`${w}x${h}/${n}/${i}`,hash=createHash('sha256').update(JSON.stringify(operations,(_,v)=>typeof v==='number'?Math.round(v*1e8)/1e8:v)).digest('hex');output[key]=hash;
    if(!recording)assert.equal(hash,expected[key],key+' drawing commands changed');
    assert.ok(bandwidth.after<=bandwidth.before,'scratch crop exceeds the old full-screen footprint');
    if(!recording&&w===412&&!n&&i>=4)console.log(`phone explore zoom ${i-3}: scratch pixels cleared ${bandwidth.before} -> ${bandwidth.after} (${(100*(1-bandwidth.after/bandwidth.before)).toFixed(1)}% less); same drawing commands`);
  }
}
if(recording)console.log(JSON.stringify(output,null,2));
else console.log('ok: 21 desktop/phone/1200-star WHIRL2 drawing-command snapshots; original blast primitives pinned by whirl2-test; not a pixel comparison');
assert.ok(NOVA.gather.stagger+NOVA.gather.time<=1,'full-explore star endpoint shortcut needs every star home');
assert.equal(STARS.dprCap,2);
