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
  "1440x900/0/0": "8d8c6490b1ba0493981e8b1c11a7758b749ef0f0614ecf23a9721747d56b9290",
  "1440x900/0/1": "b62d10b5b7b5e3c8d2828bfef94618c1947d221fe275b89467ec39b53a1f86dd",
  "1440x900/0/2": "0832427740676820aa440e2cbff730fd571fff5b8e3d4bf8d93048ef8bce9d40",
  "1440x900/0/3": "3132b9f77deb78bdb355a345476636fd5b99a310c176c908edf8304a77b1e7c2",
  "1440x900/0/4": "ddb3d2d18d2f46b148e46e5599a12256863ef34800627d1526a2670677abe102",
  "1440x900/0/5": "011d1444d9a335806533be34b41814e174b16f077a180f9c3ad6c540f3fe5a00",
  "1440x900/0/6": "915bb176ee7575f11d18bb54df665165711e8557686799d386aaa764e798a73b",
  "412x730/0/0": "a85d73f6d6700414e5bc779aacc13b329b82b4bebe84930cad7fdad8c20aaa86",
  "412x730/0/1": "6fc19c32098df306d1dcdc1eb6a6bcc058899cd162d5fd43e97a8c14c811c6cc",
  "412x730/0/2": "e03bf080a9d7362eca334e6091050543d8f69e64a9a519bfec52d4bc5e08b4cd",
  "412x730/0/3": "9e6f95ced57745a58afc80f61634572bf19ac2957d43a5c2e60c130fd5729d87",
  "412x730/0/4": "09fbd0a3d87c949913aff3b2517a22cfb56c54d148ad676a79c547246238588f",
  "412x730/0/5": "2b8eb9559b23088b0fa73e71c4a946e10af5e2e811760c77f976e388d8af277b",
  "412x730/0/6": "e8533aecdecaef559a176b6fdbbe292dc98d62634b840870376e54f69628be21",
  "412x730/1200/0": "82c39ec903aefd40c4c9a7bdb84e322a3c0c033b7278e83ecc35b1c1159ab8a7",
  "412x730/1200/1": "e32f3433455f8dd05202002277be33b1fe10389c8699fed87b5de6e5fbf910a4",
  "412x730/1200/2": "fd553dad9998dd08d238ec0771980159b4441924aaaa22c9bbf6df3280799b88",
  "412x730/1200/3": "763ce8446b41ed30346f810fa9a2b9a9a45d2434363c2daa26279a8ccb7f1831",
  "412x730/1200/4": "a4e89a6f65c182f7e37109a03b08f6d9814e38bc3de8b715d1fafdd070cc91b4",
  "412x730/1200/5": "9a436e422764b02beb1f88b338e951ad4c01425de000edb5360b823960b7814b",
  "412x730/1200/6": "edd369ae43e603b1efd97370dcd5e1fd81b07f337ee7d3e43d241810b04688d5"
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
