import {MAP,FIND_PLAY} from '../data.mjs';
import {COAST_A,COAST_B,onLand,outlineGap,JORM} from '../art.mjs';
import {pointAt,WATER,longshipPoint} from '../trip.mjs';
import {readFileSync} from 'node:fs';
import {strict as assert} from 'node:assert';
const gap=p=>Math.min(outlineGap(p,COAST_A),outlineGap(p,COAST_B));
for(let t=0;t<=1;t+=.1){const p=pointAt(WATER[0]+t*(WATER[1]-WATER[0]));console.log('crossing '+t.toFixed(1)+' '+JSON.stringify(p));}
// Find water placements for the whole hull, clear of shore and the ring. This
// is offline diagnosis, never a per-frame placement search.
if(process.argv.includes('--study'))for(const t of [0,.5,1]){
 const base=pointAt(WATER[0]+t*(WATER[1]-WATER[0]));let best=null;
 for(let y=592;y<680;y+=1)for(let x=380;x<550;x+=1){
  const hull=Array.from({length:31},(_,i)=>[x+(i-15)*1.1,y+2.75]);hull.push([x-14.3,y-3.3],[x+14.3,y-3.3]);
  if(hull.some(p=>onLand(p)||gap(p)<3||outlineGap(p,JORM.S,false)<10))continue;
  const distance=Math.hypot(x-base[0],y-base[1]);if(!best||distance<best.distance)best={x,y,distance,shore:Math.min(...hull.map(gap)),ring:Math.min(...hull.map(p=>outlineGap(p,JORM.S,false)))};
 }
 console.log('safe hull '+t+' '+JSON.stringify(best));
}
let failed=0;
const src=readFileSync('art.mjs','utf8');
for(const kind of ['peak','hill']){
 const m=src.match(new RegExp('(\\[\\[[^;\\n]+?)\\.'+(kind==='peak'?'sort':'forEach')+'[^;\\n]*s \\+= '+kind+'\\('));
 if(!m)throw Error('missing terrain '+kind);
 const rows=JSON.parse(m[1]);
 for(const [x,y,s]of rows){const points=[];
  for(let i=0;i<=100;i++){const t=i/100;if(kind==='hill')points.push([x-s+2*s*t,y-2*s*1.1*t*(1-t)]);else for(const [a,b]of [[[x-s,y],[x,y-1.5*s]],[[x,y-1.5*s],[x+s,y]]])points.push(a.map((v,k)=>v+(b[k]-v)*t));}
  const min=Math.min(...points.map(gap)),land=points.every(onLand);console.log(kind+' '+[x,y,s]+' coast gap '+min.toFixed(2)+' land '+land);if(!land||min<3)failed++;
 }
}
for(let i=0;i<=100;i++){
 const p=longshipPoint(WATER[0]+(WATER[1]-WATER[0])*i/100),hull=Array.from({length:31},(_,j)=>[p[0]+(j-15)*1.1,p[1]+2.75]);hull.push([p[0]-14.3,p[1]-3.3],[p[0]+14.3,p[1]-3.3]);
 assert.ok(hull.every(q=>!onLand(q)&&gap(q)>=3),'ship hull clears land '+i);
}
console.log('ship hull clear throughout crossing');assert.equal(failed,0,'terrain clearance failures');
