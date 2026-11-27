// COMB-T, 2026-11-27: the ash replaces the well find and is the tree zoom anchor.
// Real-font, real-render B10-B13 checks using only the local Edge fixture.
import { combBBrowser, combBWait } from './comb-b-browser-test.mjs';
import {combDInk} from './comb-d-ink-test.mjs';
import { appendFileSync } from 'node:fs';
const b=await combBBrowser(), output=[], failures=[];
const log=s=>{console.log(s);output.push(s);};
const require=(ok,s)=>{if(!ok)failures.push(s);};
const labelMeasure=combDInk;
try{
  if(!process.argv.includes('--behaviour')) for(const[w,h]of[[412,730],[390,844],[360,640],[1440,900]]){
    await b.size(w,h);await b.page('dist/journey-map.html');await b.evaluate('window.__jm.go("end",{instant:true})');await combBWait(1600);await b.evaluate('document.querySelector(".go-next").click()');await combBWait(2600);
    for(let zoom=0;zoom<3;zoom++){
      if(zoom) {await b.evaluate(`(()=>{const p=window.__jm.finds.place('ash');for(let i=0;i<${zoom===1?3:18};i++)document.getElementById('stage').dispatchEvent(new WheelEvent('wheel',{clientX:p[0],clientY:p[1]-30,deltaY:-120,ctrlKey:${zoom===1?'false':'true'},bubbles:true,cancelable:true}));})()`);await combBWait(1800);}
      const rows=await b.evaluate('('+labelMeasure.toString()+')()');log(w+'x'+h+' zoom '+zoom+': '+JSON.stringify(rows));
      require(rows.length>=7,w+' zoom '+zoom+' missing names');for(const r of rows)require(r.gap>=1.9,w+' zoom '+zoom+' '+r.text+' gap '+r.gap+' to '+r.who);
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
finally{await b.close();log('Failures: '+JSON.stringify(failures));appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/inherited-tests.log','\n## node tools/comb-b-layout-test.mjs '+process.argv.slice(2).join(' ')+' (exit '+(failures.length?1:0)+')\n\n```text\n'+output.join('\n').replace(/[^\x00-\x7f]/g,'?')+'\n```\n');}
process.exitCode=failures.length?1:0;
