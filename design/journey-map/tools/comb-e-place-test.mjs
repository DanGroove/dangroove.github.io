// Read-only placement study from actual text boxes at the eight requested sizes.
import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {writeFileSync} from 'node:fs';
import {FIND_COPY,MAP,FIND_PLAY} from '../data.mjs';
import {jormPoint,jormEdges,JORM} from '../art.mjs';
const b=await combBBrowser(),cases=[];
try{
 for(const[w,h]of[[1440,900],[1280,720],[1024,600],[820,1180],[412,730],[390,844],[360,640],[844,390]]){
  await b.size(w,h);await b.page('dist/journey-map.html');await b.evaluate('window.__jm.go("map",{instant:true})');await combBWait(1000);
  cases.push(await b.evaluate(`(()=>{
   const visible=e=>{for(let p=e;p&&p!==document.body;p=p.parentElement){const s=getComputedStyle(p);if(s.visibility==='hidden'||s.display==='none'||+s.opacity<.02)return false;}return true;};
   const m=document.getElementById('cam').getScreenCTM(),s=m.a;
   const labels=[...document.querySelectorAll('#b-detail text,#b-detail .rn-dim')].filter(e=>visible(e)&&!e.closest('.lg')).map(e=>{const r=e.getBoundingClientRect();return {t:e.textContent,b:[(r.left-m.e)/s,(r.top-m.f)/s,(r.right-m.e)/s,(r.bottom-m.f)/s]};});
   const marks=[...document.querySelectorAll('.hd-scratch')].map(e=>{const q=e.getScreenCTM(),L=e.getTotalLength(),points=[];for(let u=0;u<=L;u+=1){const p=e.getPointAtLength(u);points.push([(q.a*p.x+q.c*p.y+q.e-m.e)/s,(q.b*p.x+q.d*p.y+q.f-m.f)/s]);}return points;});
   return {w:innerWidth,h:innerHeight,s,labels,marks};
  })()`));
 }
}finally{await b.close();}
const gap=(b,x,y)=>Math.hypot(Math.max(b[0]-x,0,x-b[2]),Math.max(b[1]-y,0,y-b[3]));
const clear=(points,c)=>{let min=Infinity,who='';for(const l of c.labels)for(const p of points){const v=gap(l.b,...p)*c.s-.55;if(v<min){min=v;who=l.t;}}return{min,who};};
const hoards=FIND_COPY.hoards.map((h,i)=>{
 let best=null;
 for(let dy=-16;dy<=16;dy++)for(let dx=-16;dx<=16;dx++){
  const distance=Math.hypot(dx,dy);if(distance>16)continue;
  const results=cases.map(c=>clear(c.marks[i].map(p=>[p[0]+dx,p[1]+dy]),c)),min=Math.min(...results.map(r=>r.min));
  const score=Math.min(4.5,min)*100-distance;
  if(!best||score>best.score)best={id:h.id,x:h.x+dx,y:h.y+dy,dx,dy,min,score,limiting:results.map((r,j)=>({...r,w:cases[j].w}))};
 }return best;
});
const humps=MAP.jorm.surf.map(([a,z],i)=>{
 const edge=jormEdges(a,z,a===0?0:MAP.jorm.surfaceTaper),points=[...edge.left,...edge.right];
 const results=cases.map(c=>clear(points,c));return {i,interval:[a,z],min:Math.min(...results.map(r=>r.min)),limiting:results.map((r,j)=>({...r,w:cases[j].w}))};
});const out={cases,hoards,humps};writeFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-f/placement-study.json',JSON.stringify(out,null,2));
console.log(JSON.stringify({hoards,humps},null,2));
