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
  "1440x900/0/0": "79c8284841f9cafe11c90739a26059435f501a1cbe479fe711411060ed6119f2",
  "1440x900/0/1": "75243a03488b36b5eff4f4bd3a4b5d7b09ff2d774c8308f263449023ae45508e",
  "1440x900/0/2": "93ed489708fadb6ef16b5dc6d01ca12070cc179673553d6203a3473fe80edcff",
  "1440x900/0/3": "c83133da6799d65eeb5acc5a45638a5a69c6537dbf25bf21825708809ef04b53",
  "1440x900/0/4": "65ece0dd6770cdc7cf4db92e3f8ea707ac0e67f221125ecb896e5cd63611ee61",
  "1440x900/0/5": "562b098177416c09e01cdd1245d4aaf26d70c8419a565a3253b60876f52f1ad0",
  "1440x900/0/6": "7bc53cdc8d2b04d7d7d358e5137d073b6862e88be9ced76b5e407fa452028c34",
  "412x730/0/0": "dd8a09f7cc62ccb452058b3114512c21733d97f31e4c2fbd27eefdf587a7fd01",
  "412x730/0/1": "e700e5757951d3b168314ae15390f57e22cc0a91337ef95aff78718e265b8a72",
  "412x730/0/2": "fc22a8127a518479c38bb8c8e892cdbc33e0e75cfd9f95e4b6ff158b23a616cb",
  "412x730/0/3": "138c353e42bdc9ce3f9cd446e731929cf29b20004f15783f705f6ee221a9dc51",
  "412x730/0/4": "aef2f7a8f81f06c2bf0520a86fbdba6131fcd6cf3cbdf7a5e07460ee1f30b7bb",
  "412x730/0/5": "b59355531f9437c23e41cb6224df3eb0804d9f8b786571911eeaa703400185fa",
  "412x730/0/6": "17962c996f916e9cdcfc13e350d63bf62fc3f021ab25b649c2ad0dc9194ee191",
  "412x730/1200/0": "aaac112a7af25973203ac928611d19a64cd14934d3c21acfeb0fef2cebee32c3",
  "412x730/1200/1": "c10236e835b0ac049bf6a8b2749ab31557dbb16e4a75c5012b926248367c0271",
  "412x730/1200/2": "0563b19fcfee29aaebbe8d05140a8bb51ce8c3685f0e4f275f2560e13f6c5d10",
  "412x730/1200/3": "f75cfdec925fae073089614cab2421cf6476ab838ef1ef6cf473a38ad103621d",
  "412x730/1200/4": "8effa9a35a0fe58fe3bacab27537cb31ac734118d2480844c48ad0d3f2d69829",
  "412x730/1200/5": "acd64c1808d5a4b8210908efc96a375f30062c1b123903340f953087c8ef43c8",
  "412x730/1200/6": "4ab5f677e8034186cafac6b1672c1b7041c70557e925b4e2309429dc2f4b5759"
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
assert.equal(STARS.dprCap,3,'F10 uses native canvas scale up to 3');
