import { combBrowser,combWait,combRoot } from './comb-browser.mjs';
import { appendFileSync,writeFileSync,readFileSync,existsSync } from 'node:fs';
import { join } from 'node:path';
import { LABELS } from '../data.mjs';
const b=await combBrowser(),film=process.argv.includes('--film'),lines=[],captures=[];let failed=0;
const log=(name,ok,value)=>{const text=(ok?'PASS ':'FAIL ')+name+(value===undefined?'':' '+JSON.stringify(value));lines.push(text);console.log(text);if(!ok)failed++;};
const clock=`(()=>{let t=100000,serial=0,carry=0,queue=new Map();window.requestAnimationFrame=fn=>{queue.set(++serial,fn);return serial};window.cancelAnimationFrame=id=>queue.delete(id);window.__combAdvance=ms=>{carry+=ms;while(carry>=16){carry-=16;t+=16;const batch=[...queue.values()];queue.clear();for(const fn of batch)fn(t);window.__combProbe?.(t)}return t};Object.defineProperty(performance,'now',{value:()=>t})})()`;
const advance=ms=>b.evaluate('window.__combAdvance('+ms+')');
const shot=async name=>{if(film){await b.shot(name);captures.push(name+'.png');}};
const geometry=`(()=>{const a=document.querySelector('.stop[data-state="open"]')||document.getElementById('stop-laurier'),face=a.querySelector('.face'),tail=a.querySelector('.c-tail'),stone=a.querySelector('.stone'),s=stone.getBoundingClientRect(),f=face.getBoundingClientRect(),m=tail.getScreenCTM(),coords=tail.querySelector('path').getAttribute('d').match(/-?[0-9.]+(?:e[+-]?[0-9]+)?/g).map(Number),points=[0,2,4].map(i=>new DOMPoint(coords[i],coords[i+1]).matrixTransform(m)),mid={x:(points[0].x+points[2].x)/2,y:(points[0].y+points[2].y)/2},tip=points[1],base=Math.hypot(points[0].x-points[2].x,points[0].y-points[2].y),length=Math.hypot(tip.x-mid.x,tip.y-mid.y),shown=+getComputedStyle(tail).opacity>0;return {length:shown?length:0,base:shown?base:0,shield:s.width,opacity:+getComputedStyle(face).opacity,face:[f.left,f.top,f.right,f.bottom],stone:[s.left,s.top,s.right,s.bottom],focus:document.activeElement?.className}})()`;
async function sequence(prefix,duration,step,inspect){const rows=[];for(let ms=0;ms<=duration;ms+=step){if(ms)await advance(step);const row=inspect?await b.evaluate(inspect):{};rows.push({ms,...row});await shot(prefix+'-'+String(ms).padStart(4,'0'));}return rows;}
const explore=async()=>{await b.evaluate('window.__jm.go("end",{instant:true})');await advance(100);await b.evaluate('document.querySelector(".go-next").click()');};
try {
  await b.send('Page.addScriptToEvaluateOnNewDocument',{source:clock});
  for(const page of ['dist/journey-map.html','dist/journey-joined.html'])for(const[w,h,dpr]of[[1440,900,1],[412,730,2.625],...(process.argv.includes('--open-only')?[[1024,600,1]]:[])]) {
    const tag=(page.includes('joined')?'joined':'map')+'-'+w+'x'+h;
    await b.send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:dpr,mobile:w<=640});await b.page(page);await advance(100);
    if(process.argv.includes('--open-only')) {
      await b.evaluate('window.__jm.go("laurier",{instant:true})');await advance(700);await b.evaluate('document.querySelector("#stop-laurier .st-btn").click()');await advance(700);
      for(const kind of ['open','close','reopen']){await b.evaluate('document.querySelector("#stop-laurier .st-btn").click()');const rows=await sequence(tag+'-origin-'+kind,464,16,geometry);log(tag+' 16 ms '+kind+' tail bounds',rows.every(r=>r.length<=Math.min(w<=640?14:38,1.5*r.shield)+.03));if(kind==='open'){const first=rows.find(r=>r.opacity>.005);log(tag+' opening answers <=100 ms',first?.ms<=100,first);}}
      continue;
    }
    if(!process.argv.includes('--explore-only')) {
    for(const id of ['laurier','hmc1','mohawk','hmc2','interkom','lennard']) {
      await b.evaluate('window.__jm.go('+JSON.stringify(id)+',{instant:true})');await advance(700);
      const g=await b.evaluate(geometry),rest=Math.min(w<=640?14:38,1.5*g.shield);
      log(tag+' '+id+' tail proportions',g.length<=rest+.02&&g.base<=g.shield*.8+.02,g);
      const state=await b.evaluate(`(()=>{const a=document.querySelector('#stop-${id}'),f=a.querySelector('.face'),r=f.getBoundingClientRect(),bar=document.getElementById('go').getBoundingClientRect(),btn=a.querySelector('.st-btn'),cv=document.getElementById('stars'),tail=a.querySelector('.c-tail path').getBoundingClientRect(),ratio=cv.width/innerWidth,x=Math.max(0,Math.floor((tail.left-6)*ratio)),y=Math.max(0,Math.floor((tail.top-6)*ratio)),width=Math.min(cv.width-x,Math.ceil((tail.width+12)*ratio)),height=Math.min(cv.height-y,Math.ceil((tail.height+12)*ratio));let red=0;if(width>0&&height>0){const pixels=cv.getContext('2d').getImageData(x,y,width,height).data;for(let i=0;i<pixels.length;i+=4)if(pixels[i+3]>0&&pixels[i]>35&&pixels[i]>pixels[i+1]*1.5&&pixels[i+2]>pixels[i+1])red++;}return {scroll:f.scrollHeight-f.clientHeight,bottom:r.bottom,bar:bar.top,kick:getComputedStyle(a.querySelector('.c-kick')).fontSize,craft:getComputedStyle(a.querySelector('.c-crafts')).fontSize,name:btn.getAttribute('aria-label'),red,shadowBelow:!a.querySelector('.c-card').contains(a.querySelector('.c-sh'))};})()`);
      log(tag+' '+id+' fit/paint',state.scroll===0&&state.bottom<=state.bar+.5&&state.shadowBelow&&(w>640||state.red===0),state);await shot(tag+'-card-'+id);
      if(id==='interkom') {const clear=await b.evaluate(`(()=>{const a=document.getElementById('stop-interkom'),flame=document.querySelector('#f-beacon .bc-flame').getBoundingClientRect(),hit=r=>r.left<flame.right&&r.right>flame.left&&r.top<flame.bottom&&r.bottom>flame.top;return {shield:hit(a.querySelector('.stone').getBoundingClientRect()),tail:hit(a.querySelector('.c-tail path').getBoundingClientRect()),card:hit(a.querySelector('.face').getBoundingClientRect())}})()`);log(tag+' beacon clears Interkom',!clear.shield&&!clear.tail&&!clear.card,clear);}
    }
    const hair=await b.evaluate(`(()=>{const e=document.querySelector('#stop-lennard .c-tail-edge'),m=e.getScreenCTM();return {stroke:parseFloat(getComputedStyle(e).strokeWidth),a:m.a,b:m.b,c:m.c,d:m.d}})()`);log(tag+' tail edge is 1 screen px',hair.stroke===1&&Math.abs(hair.a-1)<.001&&Math.abs(hair.d-1)<.001&&Math.abs(hair.b)+Math.abs(hair.c)<.001,hair);
    await b.evaluate('window.__jm.go("map",{instant:true})');await advance(700);
    for(let i=0;i<4;i++){await b.evaluate('document.getElementById("f-hoard-interkom").dispatchEvent(new KeyboardEvent("keydown",{bubbles:true,cancelable:true,key:"Enter"}))');await advance(1400);}
    for(let i=0;i<4;i++){await b.evaluate('document.getElementById("f-beacon").dispatchEvent(new KeyboardEvent("keydown",{bubbles:true,cancelable:true,key:"Enter"}))');await advance(2500);await shot(tag+'-beacon-reading-'+(i+1));}
    const beacon=await b.evaluate('({fire:window.__jm.finds.state("beacon").fire,chest:window.__jm.finds.state("hoard-interkom").open})');log(tag+' four beacon readings with chest open',beacon.fire===4&&beacon.chest,beacon);
    await b.evaluate('window.__jm.go("laurier",{instant:true})');await advance(700);
    await b.evaluate('document.querySelector("#stop-laurier .st-btn").focus();document.querySelector("#stop-laurier .st-btn").click()');
    const close=await sequence(tag+'-card-close',464,16,geometry);log(tag+' shield closes and retains focus',close.at(-1).opacity===0&&close.at(-1).focus==='st-btn');
    const focus=await b.evaluate(`(()=>{const el=document.activeElement,s=getComputedStyle(el);return {width:parseFloat(s.outlineWidth),box:el.getBoundingClientRect().width,name:el.getAttribute('aria-label')}})()`);log(tag+' focus ring >=2 px and Open name',focus.width>=2&&focus.box>=44&&focus.name.startsWith('Open'),focus);
    await b.evaluate('document.querySelector("#stop-laurier .st-btn").dispatchEvent(new MouseEvent("click",{bubbles:true,detail:1}))');
    const open=await sequence(tag+'-card-reopen',464,16,geometry),first=open.find(r=>r.opacity>.005),touch=first&&first.face[0]<=first.stone[2]&&first.face[2]>=first.stone[0]&&first.face[1]<=first.stone[3]&&first.face[3]>=first.stone[1];
    log(tag+' first visible frame touches shield <=100 ms',first?.ms<=100&&touch,first);
    log(tag+' 16 ms close/reopen tails bounded',[...open,...close].every(r=>r.length<=Math.min(w<=640?14:38,1.5*r.shield)+.03&&r.base<=.8*r.shield+.03));
    await b.evaluate('document.querySelector("#stop-laurier .c-close").click()');await sequence(tag+'-card-close-x',464,16,geometry);
    }
    if(!process.argv.includes('--cards-only')) {
    if(!process.argv.includes('--explore-only')) {
    await b.evaluate('window.__jm.go("x",{instant:true})');await advance(100);
    const rest=await sequence(tag+'-x-rest',3000,50,'(()=>{const c=document.getElementById("stars"),p=c.getContext("2d").getImageData(0,0,c.width,c.height).data;let hash=0;for(let i=0;i<p.length;i+=17)hash=(hash*33+p[i])>>>0;return {hash}})()');log(tag+' X twinkles for 3 s',new Set(rest.map(r=>r.hash)).size>10);
    await b.evaluate('window.__jm.next()');
    const nova=[];for(let ms=0;ms<=6200;ms+=50){if(ms)await advance(50);if(ms===1500)await b.evaluate('window.__jm.next()');const row=await b.evaluate('({P:window.__jm.P,moving:window.__jm.moving,legend:[...document.querySelectorAll(".lg,.legend-symbol")].every(e=>+getComputedStyle(e).opacity<=.16)})');nova.push({ms,...row});await shot(tag+'-next2-'+String(ms).padStart(4,'0'));}
    log(tag+' second Next preserves full supernova',nova.find(r=>!r.moving)?.ms>=5800,nova.find(r=>!r.moving));log(tag+' legend stays dimmed or hidden through blast',nova.filter(r=>r.moving&&r.ms>0).every(r=>r.legend),{failedFrames:nova.filter(r=>r.moving&&r.ms>0&&!r.legend).map(r=>r.ms)});
    }
    await explore();const opening=await sequence(tag+'-explore-open',1900,50,'({cam:document.getElementById("cam").getAttribute("transform"),outer:document.getElementById("map").style.transform})');log(tag+' opening uses true camera',opening.slice(1,30).every(r=>r.outer==='none')&&new Set(opening.map(r=>r.cam)).size>25);
    const exControls=await b.evaluate('([...document.querySelectorAll(".face")].every(e=>e.inert)&&[...document.querySelectorAll(".c-close")].every(e=>e.inert))');log(tag+' explore card controls inert',exControls);
    const probe='({cam:document.getElementById("cam").getAttribute("transform"),outer:document.getElementById("map").style.transform,labels:[...document.querySelectorAll(".label-scale")].map(e=>e.getScreenCTM().a)})';
    await b.evaluate('window.__combSpecs='+JSON.stringify(LABELS));
    await b.evaluate(`(()=>{window.__combFrames=[];window.__combProbe=t=>{const a=document.getElementById('cam').getAttribute('transform').match(/-?[\\d.]+(?:e[+-]?\\d+)?/g).map(Number),text=document.getElementById('map').style.transform,b=text&&text!=='none'?text.match(/-?[\\d.]+(?:e[+-]?\\d+)?/g).map(Number):[1,0,0,1,0,0];window.__combFrames.push({t,s:a[0]*b[0],tx:a[4]*b[0]+b[4],ty:a[5]*b[0]+b[5],sharp:text==='none',outer:b[0],labels:[...document.querySelectorAll('.label-scale')].map(e=>e.getScreenCTM().a)})};window.__combProbe(performance.now())})()`);
    await b.evaluate(`(()=>{const sample=window.__combProbe;window.__combProbe=t=>{sample(t);const r=window.__combFrames.at(-1);r.labelError=Math.max(...[...document.querySelectorAll('.label-scale')].map(el=>{const spec=window.__combSpecs[el.dataset.label],m=el.getScreenCTM(),ideal=Math.max(r.s,(innerWidth<=640?spec.phone:spec.floor)/spec.unit);return Math.abs(Math.hypot(m.a,m.b)/ideal-1)}))}})()`);
    if(w>640){for(let i=0;i<3;i++){await b.send('Input.dispatchMouseEvent',{type:'mouseWheel',x:w/2,y:h/2,deltaX:0,deltaY:-120});await shot(tag+'-wheel-'+String(i*50).padStart(4,'0'));await advance(50);}}
    else {await b.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:176,y:330,id:1},{x:236,y:330,id:2}]});for(let i=1;i<=12;i++){await b.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:206-30*(1+i/6),y:330,id:1},{x:206+30*(1+i/6),y:330,id:2}]});await advance(25);await shot(tag+'-pinch-'+String(i*25).padStart(4,'0'));}await b.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});}
    const zoom=await sequence(tag+'-zoom-settle',1800,50,probe),scales=zoom.map(r=>r.outer&&r.outer!=='none'?Number(r.outer.slice(7).split(',')[0]):1);log(tag+' compositor scale bounded',scales.every(k=>k>=.85&&k<=1.18),{min:Math.min(...scales),max:Math.max(...scales)});
    const last=zoom.at(-1);log(tag+' sharp final camera',last.outer==='none');
    const frames=await b.evaluate('window.__combProbe=null;window.__combFrames'),tail=frames.slice(w>640?10:20);let quiet,sharp,maxLabel=0;
    for(let i=1;i<tail.length;i++){const a=tail[i-1],c=tail[i],k=c.s/a.s,step=Math.max(...[[0,0],[w,0],[0,h],[w,h]].map(([x,y])=>Math.hypot(c.tx+(x-a.tx)*k-x,c.ty+(y-a.ty)*k-y)));if(!quiet&&step<.5)quiet=c.t;if(quiet&&!sharp&&c.sharp)sharp=c.t;if(quiet)c.labels.forEach((v,j)=>maxLabel=Math.max(maxLabel,Math.abs(v/a.labels[j]-1)));}
    log(tag+' sharp within 150 ms of <0.5 px/frame',quiet&&sharp&&sharp-quiet<=150,{delay:sharp-quiet,maxLabelStep:maxLabel});log(tag+' settle label steps <=10%',maxLabel<=.1);log(tag+' full gesture composited scale bounded',frames.every(r=>r.outer>=.85&&r.outer<=1.18),{min:Math.min(...frames.map(r=>r.outer)),max:Math.max(...frames.map(r=>r.outer)),zoom:frames.at(-1).s/frames[0].s});
    const labelError=Math.max(...frames.map(r=>r.labelError||0));log(tag+' labels stay within 15% of true size',labelError<=.151,{maxError:labelError});
    }
    if(w<=640){await b.size(390,844);for(const id of ['laurier','hmc1','mohawk','hmc2','interkom','lennard']){await b.evaluate('window.__jm.go('+JSON.stringify(id)+',{instant:true})');await advance(700);await b.evaluate('(()=>{const a=document.getElementById("stop-'+id+'");if(a.dataset.state!=="open")a.querySelector(".st-btn").click()})()');await advance(700);const red=await b.evaluate(`(()=>{const t=document.querySelector('#stop-${id} .c-tail path').getBoundingClientRect(),c=document.getElementById('stars'),k=c.width/innerWidth,x=Math.max(0,Math.floor((t.left-6)*k)),y=Math.max(0,Math.floor((t.top-6)*k)),p=c.getContext('2d').getImageData(x,y,Math.min(c.width-x,Math.ceil((t.width+12)*k)),Math.min(c.height-y,Math.ceil((t.height+12)*k))).data;let n=0;for(let i=0;i<p.length;i+=4)if(p[i+3]>0&&p[i]>35&&p[i]>p[i+1]*1.5&&p[i+2]>p[i+1])n++;return n})()`);log(tag+' 390x844 '+id+' no traveller pixels at tail',red===0,red);await shot(tag+'-390x844-'+id);}}
  }
  for(const[w,h]of[[1024,600],[1280,720],[360,640],[844,390]]) {
    await b.size(w,h);await b.page('dist/journey-map.html');await advance(200);
    for(const id of ['laurier','hmc1','mohawk','hmc2','interkom','lennard']){await b.evaluate('window.__jm.go('+JSON.stringify(id)+',{instant:true})');await advance(600);const r=await b.evaluate(`(()=>{const a=document.getElementById('stop-${id}'),f=a.querySelector('.face'),r=f.getBoundingClientRect(),bar=document.getElementById('go').getBoundingClientRect();return {bottom:r.bottom,bar:bar.top,scroll:f.scrollHeight-f.clientHeight,kick:getComputedStyle(a.querySelector('.c-kick')).fontSize,craft:getComputedStyle(a.querySelector('.c-crafts')).fontSize}})()`);log(w+'x'+h+' '+id+' compact fit',r.scroll===0&&r.bottom<=r.bar+.5&&r.craft==='9px'&&r.kick==='9px',r);if(w===844||w===360)await shot(w+'x'+h+'-'+id);}
  }
  log('no browser exceptions',b.errors.length===0,b.errors);
} catch(e){log('browser run exception',false,e.stack);} finally {
  appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2/inherited-tests.log','\n## comb-c-browser-test '+process.argv.slice(2).join(' ')+'\n\n```text\n'+lines.join('\n').replace(/[^\x00-\x7f]/g,'?')+'\n```\n');
  if(film){const path=join(combRoot,'captures.json'),prior=existsSync(path)?JSON.parse(readFileSync(path,'utf8')):[];writeFileSync(path,JSON.stringify([...new Set([...prior,...captures])].sort(),null,2));}await b.close();
}
process.exitCode=failed?1:0;
