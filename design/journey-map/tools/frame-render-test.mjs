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
  "1440x900/0/0": "a76b1e95ba298d093ac9168b5e00b0f3a8c060585f9c4c64538161b08cad4cb8",
  "1440x900/0/1": "643118161d7feaefb667c5a092d54a30f22b34055de4aa6b9c87fb31b2b2b625",
  "1440x900/0/2": "e6bd47bc1cc4c74f4498227f47aba10c7f448ed1548e5fce16055957707cc10b",
  "1440x900/0/3": "9bcbf832a686e8e90169b31ea834cfae7e7669320e482fb2c0bfd32c096de19e",
  "1440x900/0/4": "56fc11e7fe607aeb1fc4f4d2ea9ba285bfdebdc4a5631b1f327d2cd8d9d4da17",
  "1440x900/0/5": "832c19de891003eb81be61969f1189d79fa93eef70d4497c6056ddd8cb795374",
  "1440x900/0/6": "5e34adbcae8f61b083c792afdd5b4fd281a855ae84931801d710cd6819057458",
  "412x730/0/0": "de1d8423649b63a2ca69cabf631b332dee747dfb98f137196c5d86242ae2534c",
  "412x730/0/1": "0b31e6289175353ca9eeb178917cbb09971e47a2d5f463d9f1373f528b53f38e",
  "412x730/0/2": "5c3c5bca58c301d3bb55d8cccef76d8c738e0dae41796b6b3a269d62cdc513c5",
  "412x730/0/3": "bb725ebea004bb701dc88e0b6a938fc7b8af3d6980c89a8c29f57545fcc4254b",
  "412x730/0/4": "7ef2f50b28da51ad0ad5e6d8e180c260087d99514ed451a8ce9d0637112a7a6d",
  "412x730/0/5": "75de9db3b6fedb74ec2c75025f631e9c42c45748709bd75dd12ac365c132c3da",
  "412x730/0/6": "e545bae22696a918266f9c2b5ef2c4dc58fd1f86bc17baf19e972a695ef16de9",
  "412x730/1200/0": "e43c832d4a60fb7dc376b9a2e0ff6fdf161ab07e09584cbca33794b064ea095c",
  "412x730/1200/1": "5518818512f23318684761ac584df64d27d06d9fd02913cf7062596f950e46f9",
  "412x730/1200/2": "f8ebfc054059723febb72e0b9878a0ed720ba4b491506058fa5c3f383be35997",
  "412x730/1200/3": "5d09036a38343a60ff39d0d306a1d64747f56af63af53a78d9782c120cdd3046",
  "412x730/1200/4": "2769f01781441edc3a0e3cb364021d027ffc3b40cf1d38e4f7500607b8db83df",
  "412x730/1200/5": "2563831d87d30156ad41c3bb0e591a290980173b1f9a8e959a700d502009896b",
  "412x730/1200/6": "40275570ea7b55630be1f0c1932170dc649d2083665289192172b32e1759bd6d"
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
