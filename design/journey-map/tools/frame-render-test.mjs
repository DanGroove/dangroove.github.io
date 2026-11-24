// Drawing-command snapshots. These are not pixel/visual/FPS tests.
import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { STARS, NOVA, C } from '../data.mjs';
import { VIEW, tripResize, tripState, SEQ } from '../trip.mjs';
import { starsBuild, starsResize, starsJoin, starsFrame, starsTick } from '../stars.mjs';
import { footerBuild, footerBuildX, footerNovaResize, footerMotion } from '../footer.mjs';
import { NOVA_LIVE } from '../depth.mjs';

const recording=process.argv.includes('--record'), expected={
  "1440x900/0/0": "98ae6440883e2b3d6904abd3207c41ad053e38719d2849422ebef782ad24bf03",
  "1440x900/0/1": "d325590a52c1594c009532c58457b1694a931865bcb502cfbb5bbb673f5af0c1",
  "1440x900/0/2": "e8d54896b099fdd4f872dacac5f8addbfce25c7aac31bacbd76265da5bb3f903",
  "1440x900/0/3": "e6f8987c5c26b396cc338bfb321a58ad609482b6325a6963ed30f165b218bfaa",
  "1440x900/0/4": "e5b9f742d33650699117fbfff1ac4192dbfa6a516e2bd6e70b723e645f1a6178",
  "1440x900/0/5": "8fa01c5226c75921b33e5c7ef8370420559da35ab0d91cb43028bc41d9c8c399",
  "1440x900/0/6": "686c36a8a87ffcac0ae91074f8b951a34ad35d53760ec4993730cd91ea292b00",
  "412x730/0/0": "e1624cf891c54f310639bd42b2ff95ef4752cc862d558397acfc64cfde6f9499",
  "412x730/0/1": "a2fbe6f4e532e1cab995a1571cf81e3fd50473dba9c6c45ba6d7a541b6333849",
  "412x730/0/2": "e04bbc7d92e7c9b346163854ebb107a467e7db8370c3bfc484d019b9427c743f",
  "412x730/0/3": "501b19d9db0df95f239e83578266badc7bedd9dfe28ec6908752ec0391d454dc",
  "412x730/0/4": "9530f8d23a1623c56ad510815efa1d374802910e90214b978e44fd599a9f793c",
  "412x730/0/5": "d13266d1880c83177a877ba806745641a38ae94eabaa51ad0b0cd79f386425e0",
  "412x730/0/6": "98c89160277c49dd9a15972f505d427787a33cc6b83e825b1ccfd9daeb062fda",
  "412x730/1200/0": "578c51f67a8df70dd74c4af2f83e191def6ff57640e36f4fc53fb72ff6397b1e",
  "412x730/1200/1": "1b8c1dcd678ef2e598484e5fc6eaee40ec0920d0a33a7c30ecf1db1512de3f74",
  "412x730/1200/2": "ac50b92af95d1a9b3d6b2ce9bfc87333d54ce644d6d36cf749a1d438ed185d3d",
  "412x730/1200/3": "34ae4a9ffefded660d5ff2c17d349dcdee079c117a9e0172277507f66bf74771",
  "412x730/1200/4": "496102fae29829fb42beff6898575646ff08d987f7d2c4ba6b771323d75b5a00",
  "412x730/1200/5": "bf54cfadd0f51c2e6babe18e8a8dd8a95c2415be22c2cd1a818f658d3c3e3f3d",
  "412x730/1200/6": "b886b551dd761dba92838dc84f732bfccc017c9f36d35465b6482d576174375c"
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
