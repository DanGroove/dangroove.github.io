// Drawing-command snapshots. These are not pixel/visual/FPS tests.
import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import { STARS, NOVA, C } from '../data.mjs';
import { VIEW, tripResize, tripState, SEQ } from '../trip.mjs';
import { starsBuild, starsResize, starsJoin, starsFrame, starsTick } from '../stars.mjs';
import { footerBuild, footerBuildX, footerNovaResize, footerMotion } from '../footer.mjs';
import { NOVA_LIVE } from '../depth.mjs';

const recording=process.argv.includes('--record'), expected={
  "1440x900/0/0": "c1295233b9bb9297beaa6d95d00f02597be5e2e8e3b347ef6d92b9574420b52a",
  "1440x900/0/1": "9b9104fba3b3249872b1a1b3eb3049981c469bc902a399b976bef7cb4de86bf7",
  "1440x900/0/2": "2dd9e5c9341791f17b3fccc38e94f5457e2f4eb510e465c7d8318dae9e24593a",
  "1440x900/0/3": "1759c05c0687c7919c0f097c4804e1525421cf6f80e292855e4e8e0ca770cfc2",
  "1440x900/0/4": "4da98936662e424f3e81e8c2c0054faacc97edd47cbf610ef249ed18bc345150",
  "1440x900/0/5": "bbd600a850a8927930cb947df9ff6a788143b6fe54d4fea44a578d2ef16a21ff",
  "1440x900/0/6": "460f29fb84442048856b32a9fc927799818b195fcf238da2067da40e2739cf2f",
  "412x730/0/0": "e1199b07f654053b356d94e8a3eddd222f35a23f034914be458029ab29435a75",
  "412x730/0/1": "bc3c98368213cbea9035fc5d201c2928d6070c506078f366a3c6e0609bac24dc",
  "412x730/0/2": "39579b6ad29acba334ec47d8aa76d394b96b738e5699af57528122ed5b9ec1da",
  "412x730/0/3": "672c5157a06c435bc0e68fc09881e6abbba468149a87636eed4c8acc5479eaf8",
  "412x730/0/4": "f801aeff8aeb52c2fde0e5bd712178f11279b9892248719235b0922eaeceed2c",
  "412x730/0/5": "dbae02a8cfb86f28cdc7741b5d301137643c0a4fb201df20bfe1be9cc2931b63",
  "412x730/0/6": "0efa0abe79d40484d3f2c3e10a622bf67731b526bb150ade236dd8981e6fb81b",
  "412x730/1200/0": "578c51f67a8df70dd74c4af2f83e191def6ff57640e36f4fc53fb72ff6397b1e",
  "412x730/1200/1": "ec36555db76cce758f27eed54237c54ae568e5c136491ff7a330fb4ed157234d",
  "412x730/1200/2": "476510a54c45c9e91d1301f94a5855475616937ba448c6983d8ca4a75d93745a",
  "412x730/1200/3": "e46b21aac56a68d5ec0182e09ecb3c2ab725b9abf47cd94bd88901ba17621b04",
  "412x730/1200/4": "2390eb748305e7f59a5198420685ad730f4383fb7cdbd9e77a58738f08b5209a",
  "412x730/1200/5": "c539e00e99fe9995634e8c023686945986214df3d3aacb8a9fbba97dbedb9018",
  "412x730/1200/6": "5318b5f5b33cec4b751d64dce8b8247e211b63060fa1ce4b5aa3eb3c816b7c75"
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
else console.log('ok: 21 desktop/phone/1200-star drawing-command snapshots match pre-FRAMES; not a pixel comparison');
assert.ok(NOVA.gather.stagger+NOVA.gather.time<=1,'full-explore star endpoint shortcut needs every star home');
assert.equal(STARS.dprCap,2);
