// Real CDP Next, transform observations, and offline geometry; no timing measurements.
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
import {gBrowser,gRoot,gWait} from './comb-m-fixture.mjs';
import {pointAt,WATER,longshipPoint} from '../trip.mjs';
import {FIND_PLAY,MAP} from '../data.mjs';
import {COAST_A,COAST_B,onLand,outlineGap,JORM,jormEdges} from '../art.mjs';
const points=[[-26,-6],[-20,1],[-10,5],[0,5],[12,5],[20,1],[26,-6],[-29,-20],[-33,-13],[-25,-25],[28,-15],[31,-11]];
const berths=[longshipPoint(-Infinity),longshipPoint(Infinity)],ringEdges=jormEdges(0,1-MAP.jorm.tail/JORM.L),report={berths,clearances:[],holds:[],crossings:[],labels:[]};
for(const [i,p] of berths.entries()) {
 const hull=points.map(q=>q.map((v,j)=>p[j]+v*.55));
 const coast=Math.min(...hull.map(q=>Math.min(outlineGap(q,COAST_A),outlineGap(q,COAST_B)))),ringCentre=Math.min(...hull.map(q=>outlineGap(q,JORM.S,false))),ring=Math.min(...hull.map(q=>Math.min(outlineGap(q,ringEdges.left,false),outlineGap(q,ringEdges.right,false))));
 report.clearances.push({berth:i,coast,ringCentre,ring});assert(hull.every(q=>!onLand(q)));assert(coast>=3);
}
const b=await gBrowser();
const place=()=>b.read(`(()=>{const s=document.querySelector('.ls-ship').getAttribute('transform'),m=s.match(/translate\\(([-\\d.]+)[ ,]+([-\\d.]+)/);return {place:[+m[1],+m[2]],transform:s,u:__g.FD.st.u};})()`);
const distance=(a,b)=>Math.hypot(a[0]-b[0],a[1]-b[1]);
try {
 assert.match((await b.send('Browser.getVersion',{},null)).product,/158\./);
 for(const [w,h,dpr,touch] of [[360,660,3,true],[1920,950,2,false]]) {
  await b.size(w,h,touch,dpr);
  for(const beat of ['map','interkom','lennard','end']) {await b.page(true,beat);const r=await place(),expected=berths[['lennard','end'].includes(beat)?1:0];report.holds.push({w,h,beat,...r});assert(distance(r.place,expected)<=.5,'berth '+beat);}
  await b.page(true,'interkom');
  await b.read(`(()=>{window.__shipSamples=[];window.__shipRecord=true;const sample=()=>{if(!__shipRecord)return;const s=document.querySelector('.ls-ship').getAttribute('transform'),m=s.match(/translate\\(([-\\d.]+)[ ,]+([-\\d.]+)/);__shipSamples.push({p:[+m[1],+m[2]],u:__g.FD.st.u,moving:!!__g.SC.move});requestAnimationFrame(sample);};requestAnimationFrame(sample);})()`);
  await b.click('.go-next',touch);await b.until('!__g.SC.move&&!__g.SC.cut',20000);
  const samples=await b.read('(__shipRecord=false,__shipSamples)'),middle=samples.filter(s=>s.moving&&s.u>=WATER[0]+FIND_PLAY.kit.shipBerth[0]&&s.u<=WATER[1]-FIND_PLAY.kit.shipBerth[1]);
  assert(middle.length>2,'crossing sampled');const error=Math.max(...middle.map(s=>distance(s.p,pointAt(s.u))));assert(error<=.5);report.crossings.push({w,h,samples:middle.length,error,observations:samples});
 }
 for(const [w,h] of [[1440,900],[1280,720],[1024,600],[820,1180],[412,730],[390,844],[360,640],[844,390]]) {
  await b.size(w,h,w<641,2);
  for(const [i,beat] of ['map','end'].entries()) {
   await b.page(false,beat);if(i===1){await b.click('.go-next',w<641);await b.until('__g.EX.active&&!__g.EX.motion&&!__g.FD.st.exploreMoving');await gWait(300);}
   const labels=await b.read(`(()=>{const ship=document.querySelector('.ls-ship'),S=ship.getScreenCTM(),b=ship.getBBox(),v=[[b.x,b.y],[b.x+b.width,b.y],[b.x+b.width,b.y+b.height],[b.x,b.y+b.height]].map(p=>new DOMPoint(...p).matrixTransform(S)),r={left:Math.min(...v.map(p=>p.x)),right:Math.max(...v.map(p=>p.x)),top:Math.min(...v.map(p=>p.y)),bottom:Math.max(...v.map(p=>p.y))};return [...document.querySelectorAll('#map text')].filter(e=>!e.closest('defs,.stop,.find,.mm')).map(e=>{const q=e.getBoundingClientRect();let visible=q.width>0&&q.height>0;for(let n=e;n&&n!==document.body;n=n.parentElement){const z=getComputedStyle(n);if(z.visibility==='hidden'||z.display==='none'||+z.opacity<.05)visible=false;}return {name:e.textContent,visible,gap:Math.hypot(Math.max(q.left-r.right,r.left-q.right,0),Math.max(q.top-r.bottom,r.top-q.bottom,0))};}).filter(q=>q.gap<4);})()`);
   report.labels.push({w,h,berth:i,view:beat,closerThan4:labels});console.log('labels',w,h,i,JSON.stringify(labels));
   if([412,1440].includes(w))await b.shot('ship-'+w+'-'+beat);
  }
 }
 for(const [w,h] of [[412,730],[1440,900]]) {await b.size(w,h,w<641,2);await b.page(false,'map',true);await b.shot('ship-'+w+'-before-map');}
 assert.deepEqual(b.errors,[]);console.log(JSON.stringify({berths,clearances:report.clearances,crossings:report.crossings.map(({observations,...r})=>r)},null,2));
 assert(report.clearances.every(r=>r.ring>=9.5),'hull is less than 9.5 map units from the serpent ring edge: '+JSON.stringify(report.clearances));
} finally {writeFileSync(gRoot+'/ship-results.json',JSON.stringify(report,null,2));await b.close();}
