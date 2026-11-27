import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {appendFileSync,readFileSync} from 'node:fs';
import {FINDS,FIND_COPY,FIND_PLAY} from '../data.mjs';
function measure(){
 const visible=e=>{for(let p=e;p&&p!==document.body;p=p.parentElement){const s=getComputedStyle(p);if(s.visibility==='hidden'||s.display==='none'||Number(s.opacity)<.02)return false;}return true;};
 const box=e=>{const r=e.getBoundingClientRect();return[r.left,r.top,r.right,r.bottom];};
 const gap=(a,b)=>Math.hypot(Math.max(a[0]-b[2],b[0]-a[2],0),Math.max(a[1]-b[3],b[1]-a[3],0));
 const segmentRect=(a,b,r)=>{
  let best=Math.min(gap(r,[...a,...a]),gap(r,[...b,...b]));const dx=b[0]-a[0],dy=b[1]-a[1],d=dx*dx+dy*dy;
  for(const x of[r[0],r[2]])for(const y of[r[1],r[3]]){const t=Math.max(0,Math.min(1,((x-a[0])*dx+(y-a[1])*dy)/(d||1)));best=Math.min(best,Math.hypot(x-a[0]-dx*t,y-a[1]-dy*t));}
  for(const x of[r[0],r[2]]){const t=(x-a[0])/dx,y=a[1]+t*dy;if(t>=0&&t<=1&&y>=r[1]&&y<=r[3])return 0;}
  for(const y of[r[1],r[3]]){const t=(y-a[1])/dy,x=a[0]+t*dx;if(t>=0&&t<=1&&x>=r[0]&&x<=r[2])return 0;}
  return best;
 };

 // Flatten the approved ash's long compound curves once, at subpixel accuracy.
 const treeSegments=(d,m)=>{
  const tokens=d.match(/[a-zA-Z]|-?(?:\d*\.)?\d+(?:e[-+]?\d+)?/g)||[],out=[];let i=0,cmd='',at=[0,0],home=[0,0];
  const screen=p=>[m.a*p[0]+m.c*p[1]+m.e,m.b*p[0]+m.d*p[1]+m.f],line=(a,b)=>out.push([screen(a),screen(b)]),middle=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
  const flat=P=>{const a=P[0],b=P.at(-1),dx=b[0]-a[0],dy=b[1]-a[1],L=Math.hypot(dx,dy)||1;return Math.max(...P.slice(1,-1).map(p=>Math.abs(dy*(p[0]-a[0])-dx*(p[1]-a[1]))/L));};
  const curve=(P,depth=0)=>{if(flat(P)<.12||depth>12){out.push([P[0],P.at(-1)]);return;}let row=P,left=[row[0]],right=[row.at(-1)];while(row.length>1){row=row.slice(1).map((p,i)=>middle(row[i],p));left.push(row[0]);right.push(row.at(-1));}curve(left,depth+1);curve(right.reverse(),depth+1);};
  while(i<tokens.length){if(/[a-zA-Z]/.test(tokens[i]))cmd=tokens[i++];const op=cmd.toUpperCase(),rel=cmd!==op,point=()=>{const p=[+tokens[i++],+tokens[i++]];return rel?p.map((v,k)=>v+at[k]):p;};if(op==='M'){at=point();home=at.slice();cmd=rel?'l':'L';}else if(op==='L'){const p=point();line(at,p);at=p;}else if(op==='H'){const p=[+tokens[i++]+(rel?at[0]:0),at[1]];line(at,p);at=p;}else if(op==='V'){const p=[at[0],+tokens[i++]+(rel?at[1]:0)];line(at,p);at=p;}else if(op==='Q'){const c=point(),p=point();curve([at,c,p].map(screen));at=p;}else if(op==='C'){const a=point(),b=point(),p=point();curve([at,a,b,p].map(screen));at=p;}else if(op==='Z'){line(at,home);at=home.slice();cmd='';}else return null;}return out;
 };
 const labels=[...document.querySelectorAll('#b-detail text,#b-detail .rn-dim,#bc-notes text')].filter(e=>visible(e)&&!e.closest('.lg')).map(e=>({b:box(e),text:e.textContent||'region runes'}));
 const result=[];
 for(const[id,selector]of Object.entries({...Object.fromEntries(['laurier','hmc1','hmc2','interkom','lennard'].map(id=>['dig-'+id,'#f-hoard-'+id+' .hd-scratch'])),serpent:'.jg-ring path,.jg-head path,.jg-tail path,.jg-pad path,.jg-pad rect,.jg-pad circle',horn:'.hn-horn path',hammer:'#f-hammer .g',ygg:'.ygg path',well:'.wl-rip ellipse,.wl-bank',mist:'#f-mist path.g',beacon:':is(#f-beacon,[data-anim-source="f-beacon"]) .g,:is(#f-beacon,[data-anim-source="f-beacon"]) .o,:is(#f-beacon,[data-anim-source="f-beacon"]) .l,:is(#f-beacon,[data-anim-source="f-beacon"]) .t,:is(#f-beacon,[data-anim-source="f-beacon"]) .bc-flame'})){
  let min=Infinity,near='';
  for(const e of document.querySelectorAll(selector)){
   if(!visible(e))continue;const screen=e.getBoundingClientRect();if(screen.right < -4||screen.left>innerWidth+4||screen.bottom < -4||screen.top>innerHeight+4)continue;const m=e.getScreenCTM(),s=getComputedStyle(e),L=e.getTotalLength?.();if(!L)continue;
   const scale=Math.hypot(m.a,m.b),half=parseFloat(s.strokeWidth)/2*(s.vectorEffect==='non-scaling-stroke'?1:scale);
   // F3 restores long polyline bands. Check their segments exactly instead of
   // thousands of native whole-path length queries at every close view.
   const d=e.getAttribute('d');
   if(e.closest('.ygg')){const lines=treeSegments(d,m);if(lines){for(const[a,b]of lines)for(const l of labels){const v=segmentRect(a,b,l.b)-half;if(v<min){min=v;near=l.text;}}continue;}}

   // COMB-Q's studs are circles encoded in one path; test each actual circle without repeated whole-path sampling.
   if(e.matches('.jo-studs')){for(const q of d.matchAll(/M(-?[\d.]+) (-?[\d.]+)/g)){const x=m.a*(+q[1]+.55)+m.c*+q[2]+m.e,y=m.b*(+q[1]+.55)+m.d*+q[2]+m.f;for(const l of labels){const v=gap(l.b,[x,y,x,y])-.55*scale;if(v<min){min=v;near=l.text;}}}continue;}

   if(e.closest('.jg-ring')&&d&&!/[CQAHVSTcqahvst]/.test(d)){
    let last,home;for(const q of d.matchAll(/([MLZ])(?:(-?[\d.]+) (-?[\d.]+))?/g)){const p=q[1]==='Z'?home:[m.a*+q[2]+m.c*+q[3]+m.e,m.b*+q[2]+m.d*+q[3]+m.f];if(q[1]==='M')home=p;else if(last&&p)for(const l of labels){const v=segmentRect(last,p,l.b)-half;if(v<min){min=v;near=l.text;}}last=p;}continue;
   }
   for(let u=0;u<=L;u+=.5/Math.max(.1,scale)){const p=e.getPointAtLength(u),x=m.a*p.x+m.c*p.y+m.e,y=m.b*p.x+m.d*p.y+m.f;for(const l of labels){const d=gap(l.b,[x,y,x,y])-half;if(d<min){min=d;near=l.text;}}}
  }result.push({id,gap:Number.isFinite(min)?+min.toFixed(2):null,near});
 }
 const article=document.querySelector('.stop[data-state="open"]'),beacon=[...document.querySelectorAll(':is(#f-beacon,[data-anim-source="f-beacon"]) .g,:is(#f-beacon,[data-anim-source="f-beacon"]) .bc-flame')].map(box),union=[Math.min(...beacon.map(b=>b[0])),Math.min(...beacon.map(b=>b[1])),Math.max(...beacon.map(b=>b[2])),Math.max(...beacon.map(b=>b[3]))];
 const blockers=article?['.face','.stone','.c-tail'].map(s=>({name:s,gap:+gap(union,box(article.querySelector(s))).toFixed(2)})):[];
 const card=article&&box(article.querySelector('.face')),bar=box(document.getElementById('go')),face=article?.querySelector('.face');
 const beam=document.querySelector('.bc-beam path'),inverse=beam.getScreenCTM().inverse(),beamHits=[];
 for(const l of labels.concat([...document.querySelectorAll('.stop .stone')].filter(visible).map(e=>({b:box(e),text:'shield'})))){
  const q=l.b,points=[];for(let x=q[0];x<=q[2];x+=2)points.push([x,q[1]],[x,q[3]]);for(let y=q[1];y<=q[3];y+=2)points.push([q[0],y],[q[2],y]);
  if(points.some(([x,y])=>beam.isPointInFill(new DOMPoint(x,y).matrixTransform(inverse))))beamHits.push(l.text);
 }
 return{result,blockers,beamHits,phoneCard:innerWidth<=640&&face?{gap:+(bar[1]-card[3]).toFixed(2),scroll:face.scrollHeight-face.clientHeight,corners:[getComputedStyle(face).borderBottomLeftRadius,getComputedStyle(face).borderBottomRightRadius]}:null};
}
const b=await combBBrowser(),failures=[],output=[],log=s=>{console.log(s);output.push(s);};
const html=readFileSync('dist/journey-map.html','utf8').replace('</script>','\nwindow.__dFocus=stepsFocus;\n</script>');
try{
 for(const[w,h]of[[1440,900],[1280,720],[1024,600],[820,1180],[412,730],[390,844],[360,640],[844,390]]){
  await b.size(w,h);await b.send('Page.navigate',{url:'data:text/html;base64,'+Buffer.from(html).toString('base64')});await combBWait(1800);await b.evaluate('document.fonts.ready.then(()=>true)');
  for(const beat of ['map','interkom']){
   await b.evaluate(`window.__jm.go('${beat}',{instant:true})`);await combBWait(1700);const r=await b.evaluate('('+measure.toString()+')()');
   log(w+'x'+h+' '+beat+': '+JSON.stringify(r));
   for(const d of r.result)if(d.gap!==null&&d.gap<3.9)failures.push(w+' '+beat+' '+d.id+' gap '+d.gap+' '+d.near);
   if(r.beamHits.length)failures.push(w+' '+beat+' rest beam '+JSON.stringify(r.beamHits));
   if(beat==='interkom'){for(const d of r.blockers)if(d.gap<11.9)failures.push(w+' beacon/card '+d.name+' '+d.gap);if(r.phoneCard&&(Math.abs(r.phoneCard.gap)>.6||r.phoneCard.scroll||r.phoneCard.corners.some(s=>s!=='0px')))failures.push(w+' phone card '+JSON.stringify(r.phoneCard));}
  }
  // All six phone cards retain their floor without an inner scroll.
  if(w<=640)for(const id of ['laurier','hmc1','mohawk','hmc2','lennard']){await b.evaluate(`window.__jm.go('${id}',{instant:true})`);await combBWait(1500);const r=await b.evaluate('('+measure.toString()+')()');if(r.phoneCard&&(Math.abs(r.phoneCard.gap)>.6||r.phoneCard.scroll))failures.push(w+' '+id+' card '+JSON.stringify(r.phoneCard));}
  const closeViews=FINDS.filter(f=>['horn','hammer','well','mist','beacon','serpent'].includes(f.id)).map(f=>[f.id,f.view]).concat(FIND_COPY.hoards.map(h=>['hoards',[h.x+FIND_PLAY.focus.chest[0],h.y+FIND_PLAY.focus.chest[1],FIND_PLAY.focus.chest[2]],h.id]));
  if(process.argv.includes('--final-small'))closeViews.splice(0,closeViews.length,...closeViews.filter(([id,view,tag])=>['hammer','well','beacon','serpent'].includes(id)||tag==='hoard-hmc2'));
  for(const[id,view,tag=id]of closeViews){
   await b.key('Escape');await b.evaluate('window.__jm.go("map",{instant:true})');await combBWait(600);await b.evaluate(`window.__dFocus(${JSON.stringify(id)},${JSON.stringify(view)})`);await combBWait(900);
   const r=await b.evaluate('('+measure.toString()+')()');log(w+'x'+h+' closest '+tag+': '+JSON.stringify(r.result));
   for(const d of r.result)if(d.gap!==null&&d.gap<3.9)failures.push(w+' closest '+tag+' '+d.id+' gap '+d.gap+' '+d.near);
  }
 }
 if(b.errors.length)failures.push(...b.errors);
}catch(e){failures.push(e.stack);}finally{await b.close();log('Failures: '+JSON.stringify(failures));appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/inherited-tests.log','\n## node tools/comb-d-drawings-test.mjs (exit '+(failures.length?1:0)+')\n\n```text\n'+output.join('\n').replace(/[^\x00-\x7f]/g,'?')+'\n```\n');}
process.exitCode=failures.length?1:0;
