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
  "1440x900/0/0": "57afee2a5fadbc79d337133ac2536c237ea1252676c1a16b36944c21b20b426a",
  "1440x900/0/1": "fe977f1c5b8341060ccffa51423c87a7496b5555377b0b144ded8246afa26f7a",
  "1440x900/0/2": "e1ee5b5dacb61a0aa6930d8e5201e90bde6425aee249a2e9bc8b9917ddf9abfa",
  "1440x900/0/3": "133f74f8d11009e0f56bce670f1af28f15c57f7906aa5dea1b46200189dddf73",
  "1440x900/0/4": "bbd81503d5543d49a0ead69c468c991fbd4b1df254b4985b74034135716cdda0",
  "1440x900/0/5": "f2fc1609575f869058ea842662ec3d20a800c321026657cef4647414339dadfc",
  "1440x900/0/6": "bffe9dac1436df13ce46e10de9a82f444000285d5ed81358bb98a4104ad4b789",
  "412x730/0/0": "2db8f36cba282a659f7868254eac17b1c0cdbdffb1e1d15842eba40ec3635489",
  "412x730/0/1": "a6bdcc5c4a854fd70105d2f0cec686326e4462b0f8522232e838b8848e0a111b",
  "412x730/0/2": "c900524a59d578a302702800b91273f5527c1ef81a19a3b40572f16f9fc77fbd",
  "412x730/0/3": "20f996e4f7c07f090fb59e18b89d89bb4dd2fd722ef21560a5ca5d76f30a13cd",
  "412x730/0/4": "a52d863ce96045fc5ffe61c4ef75536d7427d33d71960bf7f2186a5a2bcea4db",
  "412x730/0/5": "cacf8d5b810a43484b1d5a6f5f99d94d38c443f4c910a3d264a9ba145c53ecf1",
  "412x730/0/6": "0bb3ff14cf325bd703ac65f1e67ffad40c37c16d270b60d187c1ebf13b4a972f",
  "412x730/1200/0": "51c6482f54e42eaefc6d2ed0a321d48d7d5e2dbf97f8ac766be4a324ce596e7d",
  "412x730/1200/1": "05d0f04db2347e138ff3ec55208be8ddaa3161f1260ce22a504a4246e953bcbf",
  "412x730/1200/2": "2c786b65c4695b428f49525ae3594102435e41ab095093beb555e2849c60831e",
  "412x730/1200/3": "58d475f0f0406900848a7d70d6ccf3978ec0ac0d01294b4582b892d35d237c98",
  "412x730/1200/4": "1bd755a477dbda59186488f49bac0ed1056e9edcf17892592f1826535101a5d1",
  "412x730/1200/5": "71d69e47f265d19a114b0352a39064251757fa1020599e6889d755d1a27350a3",
  "412x730/1200/6": "d8ad1ae64e0f6364a497477a657019410326f277455b30fd74b036d3dc25dc51"
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
