// Real-font, real-render B10-B13 checks using only the local Edge fixture.
import { combBBrowser, combBWait } from './comb-b-browser-test.mjs';
import { appendFileSync } from 'node:fs';
const b=await combBBrowser(), output=[], failures=[];
const log=s=>{console.log(s);output.push(s);};
const require=(ok,s)=>{if(!ok)failures.push(s);};
function labelMeasure(){
  const rect=e=>{const r=e.getBoundingClientRect();return[r.left,r.top,r.right,r.bottom];};
  const gap=(a,b)=>Math.hypot(Math.max(a[0]-b[2],b[0]-a[2],0),Math.max(a[1]-b[3],b[1]-a[3],0));
  const visible=e=>{let a=1;for(let p=e;p&&p!==document.body;p=p.parentElement){const s=getComputedStyle(p);a*=Number(s.opacity);if(s.visibility==='hidden'||s.display==='none')return false;}return a>.01;};
  const drawings=[];
  for(const el of document.querySelectorAll('#b-detail path,#b-detail circle,#b-detail ellipse,#b-detail rect,#b-detail line')){
    if(el.closest('.label-anchor,.map-tier1,.map-tier2,.lg,.legend-symbol,defs')||!visible(el))continue;
    const local=el.getBBox();if(local.width>500&&local.height>800)continue;
    drawings.push({box:rect(el),name:el.tagName+' '+el.getAttribute('class')});
  }
  for(const selector of ['#f-wayfinder path:not(.hit)','#f-wayfinder circle:not(.hit)','#f-wayfinder text','#f-ravens .rv-tree','#f-ravens .rv-a','#f-ravens .rv-b','#f-serpent .jg-head','#f-serpent .jg-pad','#f-beacon > g > .g','#f-runestone > g','#f-hammer .hm-lift','#f-horn .hn-horn','#f-mist .mist-cloud','.hd-scratch','.jg-hump','.marker-layer .mk','.st-line'])for(const el of document.querySelectorAll(selector))if(visible(el)&&rect(el).some((v,i)=>i>1&&v!==rect(el)[i-2]))drawings.push({box:rect(el),name:selector});
  const paths=[...document.querySelectorAll('#trail-done,.coast')].map(el=>{
    const length=el.getTotalLength(),m=el.getScreenCTM(),points=[];
    for(let u=0;u<=length;u+=.5){const p=el.getPointAtLength(u);points.push(new DOMPoint(p.x,p.y).matrixTransform(m));}
    return{points,name:el.id||'coast',half:el.id==='trail-done'?1.5:Math.max(.6,Number(document.querySelector('.coast-ticks')?.getAttribute('stroke-width')||0)/2)};
  });
  const rows=[];
  for(const el of document.querySelectorAll('.label-anchor')){
    if(!visible(el))continue;const box=rect(el.querySelector('text'));let min=Infinity,near='';
    for(const d of drawings){const distance=gap(box,d.box)-.6;if(distance<min){min=distance;near=d.name;}}
    for(const path of paths)for(const p of path.points){const distance=gap(box,[p.x,p.y,p.x,p.y])-path.half;if(distance<min){min=distance;near=path.name;}}
    rows.push({text:el.textContent,gap:+min.toFixed(2),near,at:el.dataset.exploreAt,from:el.dataset.exploreFrom});
  }
  return rows;
}
try{
  if(!process.argv.includes('--behaviour')) for(const[w,h]of[[412,730],[390,844],[360,640],[1440,900]]){
    await b.size(w,h);await b.page('dist/journey-map.html');await b.evaluate('window.__jm.go("end",{instant:true})');await combBWait(1600);await b.evaluate('document.querySelector(".go-next").click()');await combBWait(2600);
    for(let zoom=0;zoom<3;zoom++){
      if(zoom) {await b.evaluate(`(()=>{const p=window.__jm.finds.place('well');for(let i=0;i<${zoom===1?3:18};i++)document.getElementById('stage').dispatchEvent(new WheelEvent('wheel',{clientX:p[0],clientY:p[1]-30,deltaY:-120,ctrlKey:${zoom===1?'false':'true'},bubbles:true,cancelable:true}));})()`);await combBWait(1800);}
      const rows=await b.evaluate('('+labelMeasure.toString()+')()');log(w+'x'+h+' zoom '+zoom+': '+JSON.stringify(rows));
      require(rows.length>=7,w+' zoom '+zoom+' missing names');for(const r of rows)require(r.gap>=4,w+' zoom '+zoom+' '+r.text+' gap '+r.gap+' to '+r.near);
      await b.shot('final-'+w+'x'+h+'-explore-'+zoom);
    }
  }
  if(!process.argv.includes('--labels')) for(const[w,h]of[[1440,900],[1280,720],[1024,600],[820,1180],[412,730],[390,844],[360,640],[844,390]]){
    await b.size(w,h);await b.page('dist/journey-joined.html');
    const overlap=await b.evaluate(`(()=>{const e=document.querySelector('.jm-review button'),r=e.getBoundingClientRect(),a=[r.left,r.top+r.height/2-22,r.right,r.top+r.height/2+22];return [...document.querySelectorAll('[data-hero] a,[data-hero] button')].filter(e=>{const r=e.getBoundingClientRect();return r.width&&r.height&&a[0]<r.right&&a[2]>r.left&&a[1]<r.bottom&&a[3]>r.top;}).map(e=>e.textContent.trim());})()`);
    require(!overlap.length,w+' review covers hero '+overlap);if(w===412||w===360||w===1440)await b.shot('final-'+w+'x'+h+'-hero');
    await b.evaluate('window.__jm.go("x",{instant:true})');await combBWait(1800);
    // Start by native keyboard focus traversal, then Enter on Dig here.
    await b.evaluate('document.querySelector(".go-back").focus()');await b.key('Tab');
    require(await b.evaluate('document.activeElement===document.querySelector(".go-next")'),w+' Tab did not reach Dig here');
    await b.key('Enter');await combBWait(300);
    const build=await b.evaluate(`({focus:document.activeElement.id,ring:getComputedStyle(document.getElementById('nova-hit')).outlineStyle,count:getComputedStyle(document.querySelector('.tl-count')).opacity})`);
    require(build.focus==='nova-hit'&&build.ring!=='none',w+' no keyboard build-up ring '+JSON.stringify(build));require(Number(build.count)===0,w+' counter visible in build-up');
    if(w===412||w===1440)await b.shot('final-'+w+'x'+h+'-build-up');
    const samples=await b.evaluate(`new Promise(resolve=>{const rows=[];const timer=setInterval(()=>{const hit=document.getElementById('nova-hit');rows.push({flashed:document.documentElement.classList.contains('jm-nova-flashed'),count:Number(getComputedStyle(document.querySelector('.tl-count')).opacity),ring:getComputedStyle(hit).outlineStyle,beat:document.documentElement.dataset.beat,focus:document.activeElement.className});if(document.documentElement.dataset.beat==='end'&&!window.__jm.moving||rows.length>=200){clearInterval(timer);resolve(rows);}},50);})`);
    require(samples.every(r=>r.count===0),w+' counter during blast/end');require(samples.filter(r=>r.flashed).every(r=>r.ring==='none'),w+' ring remains after flash');
    require(await b.evaluate('document.activeElement===document.querySelector(".go-next")'),w+' end focus missing');if(w===412||w===1440)await b.shot('final-'+w+'x'+h+'-end');
    await b.key('Enter');await combBWait(2200);
    const boxes=await b.evaluate(`(()=>{const r=document.querySelector('.tl-count').getBoundingClientRect(),s=getComputedStyle(document.querySelector('.tl-count'));return {count:s.opacity,overlaps:[...document.querySelectorAll('.go button,.jm-review')].filter(e=>{const q=e.getBoundingClientRect();return q.width&&q.height&&r.left<q.right&&r.right>q.left&&r.top<q.bottom&&r.bottom>q.top;}).map(e=>e.className)}})()`);
    require(Number(boxes.count)>.99&&!boxes.overlaps.length,w+' explore counter boxes '+JSON.stringify(boxes));
    log(w+'x'+h+': hero review overlaps '+JSON.stringify(overlap)+'; '+samples.length+' rush/end samples, build-up '+JSON.stringify(build)+'; explore '+JSON.stringify(boxes));
  }
  if(!process.argv.includes('--labels')){
    await b.size(412,730);await b.page('dist/journey-map.html');await b.evaluate('window.__jm.go("end",{instant:true})');await combBWait(1600);
    require(await b.evaluate('Number(getComputedStyle(document.querySelector(".tl-count")).opacity)===0'),'end counter must be hidden before reduced-motion switch');
    await b.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});await combBWait(1800);
    const reduced=await b.evaluate('({reduced:document.documentElement.classList.contains("rm"),opacity:getComputedStyle(document.querySelector(".tl-count")).opacity,screen:document.querySelector(".tl-count").classList.contains("tl-count-screen")})');
    require(reduced.reduced&&Number(reduced.opacity)===1&&!reduced.screen,'reduced-motion counter recovery '+JSON.stringify(reduced));log('412x730 reduced-motion switch at end: '+JSON.stringify(reduced));
  }
  require(!b.errors.length,'browser exceptions '+JSON.stringify(b.errors));
}catch(e){failures.push(e.stack);}
finally{await b.close();log('Failures: '+JSON.stringify(failures));appendFileSync('COMB-B-BUILD.md','\n## node tools/comb-b-layout-test.mjs '+process.argv.slice(2).join(' ')+' (exit '+(failures.length?1:0)+')\n\n```text\n'+output.join('\n').replace(/[^\x00-\x7f]/g,'?')+'\n```\n');}
process.exitCode=failures.length?1:0;
