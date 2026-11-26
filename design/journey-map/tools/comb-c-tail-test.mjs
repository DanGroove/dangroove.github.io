import { strict as assert } from 'node:assert';
import { cardsTailLayout } from '../cards.mjs';
import { tripResize,tripCardPlace,VIEW,easeIO,smooth,lerp } from '../trip.mjs';
import { MARK,CARD_TAIL,DEPTH,CAMERA } from '../data.mjs';
import { starsEmberReach } from '../stars.mjs';
let frames=0;
for(const [w,h,H] of [[1440,900,432],[1024,600,325],[412,730,398],[390,844,398],[360,640,398],[844,390,254]]) {
  tripResize(w,h,w>640?120:96); const p=tripCardPlace(H,true,40),stonePx=Math.max(MARK.min,Math.min(MARK.max,MARK.k*VIEW.sT*CAMERA.holdZoom));
  let max=0;
  for(let i=0;i<=90;i++) {
    const e=easeIO((i%31)/30),k0=stonePx/Math.max(p.w,H),k=k0**(1-e),t=smooth(.12,1,e);
    for(const tilt of [false,true]) {
      const f={W:p.w,H,k,cx:(p.x-p.sx)*t,cy:(p.y-p.sy)*t,stonePx,rx:tilt?4:0,ryTilt:tilt?3:0,sx:tilt?1:0,sy:tilt?-1:0,lift:tilt,e,phone:w<=640};
      const r=cardsTailLayout(f),base=Math.hypot(...r.b0.map((v,j)=>v-r.b1[j]));
      if(r.visible){assert.ok(Math.abs(Math.hypot(...r.tip)-r.ring-5)<.001,'leader starts outside traveller ring');assert.ok(Math.abs(Math.hypot(...r.end.map((v,j)=>v-r.mid[j]))-9)<.001,'leader stops short of card');if(w<=640)assert.ok(r.length>=16-.001,'phone minimum visible line');}
      assert.ok(Math.abs(base-32)<.001,'32 px bar'); max=Math.max(max,r.length);frames++;
      if(e===0)assert.equal(r.visible,false,'inside shield hides tail');
    }
  }
  console.log(w+'x'+h+': leader max '+max.toFixed(3)+' px, 32 px bar, closed tail hidden');
}
for(let i=0;i<360;i++)assert.ok(Number.isFinite(starsEmberReach(i*Math.PI/180))&&starsEmberReach(i*Math.PI/180)>0);
console.log('ok: '+frames+' projected card samples; 360 ember/coast rays');
