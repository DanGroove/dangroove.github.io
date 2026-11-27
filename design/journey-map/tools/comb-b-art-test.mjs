// Drawing-specific geometry and preserved find hit geometry, independent of browser rendering.
import { strict as assert } from 'node:assert';
import { bigMap, GROVE, n1, outlineGap, insidePoly } from '../art.mjs';
import { FIND_PLAY, HAMMER, YGG } from '../data.mjs';
const map=bigMap(),box=t=>{const[x,y,s,p]=t.map((v,i)=>i<3?n1(v):v);return[x-s,y-2.7*s,x+s,y-(p?.5:.7)*s];};
const gap=(a,b)=>Math.hypot(Math.max(a[0]-b[2],b[0]-a[2],0),Math.max(a[1]-b[3],b[1]-a[3],0));
for(const[a,b]of[[5,19],[40,41],[56,59]]){
  const units=gap(box(GROVE[a]),box(GROVE[b])),ink=units*.576-1.1;
  assert.ok(ink>=1.5,'crown boxes need a visible gap at the smallest tested phone fit');
  console.log('T'+(a+1)+'/T'+(b+1)+': '+units.toFixed(2)+' map units between crowns; '+ink.toFixed(2)+' CSS px between ink at 360 fit');
}
const crown=t=>{const[x,y,s,p]=t;return p?[[x-s,y-.5*s],[x,y-2.7*s],[x+s,y-.5*s]]:Array.from({length:64},(_,i)=>[x+Math.cos(i*Math.PI/32)*s,y-1.7*s+Math.sin(i*Math.PI/32)*s]);};
const crownGap=(a,b)=>a.some(p=>insidePoly(p,b))||b.some(p=>insidePoly(p,a))?0:Math.min(...a.map(p=>outlineGap(p,b)),...b.map(p=>outlineGap(p,a)));
// COMB-R, 2026-11-27: the two audited pines are named by their seeded, nudged positions.
// COMB-R review, 2026-11-27: the second pine moves up 3.5 units, clear of the round tree below it (it touched at the 360 fit).
for(const [x,y] of [[357.8,158.1],[403,347.9]]){
  const i=GROVE.findIndex(t=>n1(t[0])===x&&n1(t[1])===y);assert.ok(i>=0,'audited seeded pine is present');
  const minimum=Math.min(...GROVE.map((t,j)=>i===j?Infinity:crownGap(crown(GROVE[i]),crown(t))));
  assert.ok(minimum*.576-1.1>=1,'moving a named pine must not create a new tangent with any neighbour');
  console.log('T'+(i+1)+': all-neighbour ink gap >= '+(minimum*.576-1.1).toFixed(2)+' CSS px at 360 fit');
}
assert.deepEqual(HAMMER.map.hit,[-6,-6,34,34]);assert.deepEqual(FIND_PLAY.horn.hit,[-24,-36,48,44]);
assert.deepEqual(FIND_PLAY.mist.box,[102,410,104,50]);assert.deepEqual(FIND_PLAY.serpent.hit,[-50,-30,62,42]);
assert.ok(!/find-mist-soft|filter=/.test(map.finds.match(/id="f-mist"[^]*?(?=<g class="find" id="f-horn")/)?.[0]||''));
assert.ok(YGG.rat.includes('yg-tail')&&YGG.rat.includes('<path')&&!Object.hasOwn(YGG,'nid')&&!map.detail.includes('yg-nid'),'Q1 keeps the squirrel hook and removes the root creature');
const radius=(HAMMER.shield.cell-HAMMER.field.line)/2-.25;
assert.ok(radius+HAMMER.field.line/2<HAMMER.shield.cell/2,'complete rim including ink fits each live tile');
assert.ok(map.finds.includes('hm-kept')&&map.finds.includes('hn-kept'));
console.log('ok: unchanged hammer/horn/mist/serpent hits; ink-only masked mist; squirrel and no root creature; full cell rims and persistent sign hooks');
