import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {appendFileSync,readFileSync} from 'node:fs';
import {FINDS,FIND_COPY,FIND_PLAY} from '../data.mjs';
function measure(){
 const visible=e=>{for(let p=e;p&&p!==document.body;p=p.parentElement){const s=getComputedStyle(p);if(s.visibility==='hidden'||s.display==='none'||Number(s.opacity)<.02)return false;}return true;};
 const box=e=>{const r=e.getBoundingClientRect();return[r.left,r.top,r.right,r.bottom];};
 const gap=(a,b)=>Math.hypot(Math.max(a[0]-b[2],b[0]-a[2],0),Math.max(a[1]-b[3],b[1]-a[3],0));
 const labels=[...document.querySelectorAll('#b-detail text,#b-detail .rn-dim,#bc-notes text')].filter(e=>visible(e)&&!e.closest('.map-title,.lg')).map(e=>({b:box(e),text:e.textContent||'region runes'}));
 const result=[];
 for(const[id,selector]of Object.entries({...Object.fromEntries(['laurier','hmc1','hmc2','interkom','lennard'].map(id=>['dig-'+id,'#f-hoard-'+id+' .hd-scratch'])),serpent:'.jg-hump path,.jg-neck path,.jg-pad > path',horn:'.hn-horn path',hammer:'#f-hammer .g',ygg:'.ygg path',well:'.wl-rip ellipse,.wl-bank',mist:'#f-mist path.g',beacon:'#f-beacon .g,#f-beacon .o,#f-beacon .l,#f-beacon .t,#f-beacon .bc-flame'})){
  let min=Infinity,near='';
  for(const e of document.querySelectorAll(selector)){
   if(!visible(e))continue;const m=e.getScreenCTM(),s=getComputedStyle(e),L=e.getTotalLength?.();if(!L)continue;
   const scale=Math.hypot(m.a,m.b),half=parseFloat(s.strokeWidth)/2*(s.vectorEffect==='non-scaling-stroke'?1:scale);
   for(let u=0;u<=L;u+=.5/Math.max(.1,scale)){const p=e.getPointAtLength(u),x=m.a*p.x+m.c*p.y+m.e,y=m.b*p.x+m.d*p.y+m.f;for(const l of labels){const d=gap(l.b,[x,y,x,y])-half;if(d<min){min=d;near=l.text;}}}
  }result.push({id,gap:Number.isFinite(min)?+min.toFixed(2):null,near});
 }
 const article=document.querySelector('.stop[data-state="open"]'),beacon=[...document.querySelectorAll('#f-beacon .g,#f-beacon .bc-flame')].map(box),union=[Math.min(...beacon.map(b=>b[0])),Math.min(...beacon.map(b=>b[1])),Math.max(...beacon.map(b=>b[2])),Math.max(...beacon.map(b=>b[3]))];
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
  for(const[id,view,tag=id]of closeViews){
   await b.key('Escape');await b.evaluate('window.__jm.go("map",{instant:true})');await combBWait(600);await b.evaluate(`window.__dFocus(${JSON.stringify(id)},${JSON.stringify(view)})`);await combBWait(900);
   const r=await b.evaluate('('+measure.toString()+')()');log(w+'x'+h+' closest '+tag+': '+JSON.stringify(r.result));
   for(const d of r.result)if(d.gap!==null&&d.gap<3.9)failures.push(w+' closest '+tag+' '+d.id+' gap '+d.gap+' '+d.near);
  }
 }
 if(b.errors.length)failures.push(...b.errors);
}catch(e){failures.push(e.stack);}finally{await b.close();log('Failures: '+JSON.stringify(failures));appendFileSync('COMB-D-BUILD.md','\n## node tools/comb-d-drawings-test.mjs (exit '+(failures.length?1:0)+')\n\n```text\n'+output.join('\n').replace(/[^\x00-\x7f]/g,'?')+'\n```\n');}
process.exitCode=failures.length?1:0;
