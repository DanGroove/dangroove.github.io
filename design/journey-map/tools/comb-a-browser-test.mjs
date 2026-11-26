import { combBrowser, combWait } from './comb-browser.mjs';
import { appendFileSync } from 'node:fs';
const b = await combBrowser(), log = []; let failures = 0;
const record = line => { console.log(line); log.push(line); };
try {
  for (const page of ['dist/journey-map.html','dist/journey-joined.html']) { await b.page(page);
  for (const [w,h] of [[1440,900],[1280,720],[1024,600],[820,1180],[412,730],[390,844],[360,640],[844,390]]) {
    await b.size(w,h); await b.evaluate('window.__jm.go("map",{instant:true})'); await combWait(300);
    const result = await b.evaluate(`(() => {
      const vis = e => { for(let p=e;p&&p!==document.body;p=p.parentElement){const s=getComputedStyle(p);if(s.visibility==='hidden'||+s.opacity<.1)return false;} return true; };
      const box=e=>{const r=e.getBoundingClientRect();return [r.x,r.y,r.right,r.bottom];};
      const rows=[...document.querySelectorAll('.label-anchor text,.lg text,.kick,.map-title > text')].filter(vis).map(e=>({text:e.textContent,box:box(e)}));
      const overlap=[]; for(let i=0;i<rows.length;i++)for(let j=i+1;j<rows.length;j++){const a=rows[i],b=rows[j];if(a.box[0]<b.box[2]&&a.box[2]>b.box[0]&&a.box[1]<b.box[3]&&a.box[3]>b.box[1])overlap.push([a.text,b.text]);}
      const count=document.querySelector('.tl-count'), c=box(count), hidden=rows.filter(r=>r.box[0]<0||r.box[2]>innerWidth||r.box[1]<0||r.box[3]>innerHeight);
      return {overlap,offscreen:hidden,count:count.textContent,countVisible:vis(count),countAboveGradient:document.elementFromPoint((c[0]+c[2])/2,(c[1]+c[3])/2)?.closest('.tl-count')===count,rows};
    })()`);
    if (result.overlap.length || result.offscreen.length || !result.countVisible || !result.countAboveGradient) failures++;
    record(`${page} ${w}x${h} overview ${JSON.stringify(result)}`);
    if (w===1440||w===412||w===844) await b.shot(`${page.includes('joined')?'joined':'map'}-${w}x${h}-map`);
    for (const id of ['laurier','hmc1','mohawk','hmc2','interkom','lennard']) {
      await b.evaluate(`window.__jm.go('${id}',{instant:true})`); await combWait(400);
      const r=await b.evaluate(`(()=>{const a=document.querySelector('#stop-${id} .c-in'),r=a.getBoundingClientRect(),c=document.querySelector('.c-close'),sh=[...document.querySelectorAll('.st-btn')].filter(e=>e.tabIndex===0&&!e.inert).length;return {height:r.height,top:r.top,bottom:r.bottom,scroll:a.scrollHeight-a.clientHeight,shields:sh};})()`);
      const collision=await b.evaluate(`(()=>{const a=document.querySelector('#stop-${id} .face').getBoundingClientRect(),c=document.querySelector('.tl-count').getBoundingClientRect();return a.left<c.right&&a.right>c.left&&a.top<c.bottom&&a.bottom>c.top;})()`); if (collision) failures++;
      record(`${w}x${h} ${id} ${JSON.stringify({...r,countOverlap:collision})}`);
      if ((w===1440||w===412||w===844)&&id==='lennard') await b.shot(`${w}x${h}-lennard`);
    }
    await b.evaluate('window.__jm.go("x",{instant:true})'); await combWait(300);
    const city = await b.evaluate(`(()=>{const e=[...document.querySelectorAll('#b-detail g')].find(e=>e.getAttribute('transform')==='translate(368 752) scale(1)');if(!e)return null;const r=e.getBoundingClientRect();return {left:r.left,right:r.right,top:r.top,bottom:r.bottom};})()`);
    if (!city || city.left < 16 || city.right > w-16 || city.top < 40) failures++;
    record(`${page} ${w}x${h} X skyline ${JSON.stringify(city)}`);
    if (w===1440||w===412||w===844) await b.shot(`${page.includes('joined')?'joined':'map'}-${w}x${h}-x`);
    await b.evaluate('window.__jm.go("end",{instant:true})'); await combWait(200);
    if (w===1440||w===412||w===844) await b.shot(`${page.includes('joined')?'joined':'map'}-${w}x${h}-end`);
    record(`${w}x${h} end ${JSON.stringify(await b.evaluate(`({cardsInert:document.querySelector('#cards').inert,timelineInert:document.querySelector('#tl').inert,shields:[...document.querySelectorAll('.st-btn')].filter(e=>e.tabIndex===0&&!e.inert).length})`))}`);
  }
  }
  await b.size(412,730); await b.page('dist/journey-joined.html'); await combWait(1600);
  for (const [w,h] of [[412,730],[360,640]]) { await b.size(w,h); record(`joined ${w}x${h} Start ${JSON.stringify(await b.evaluate(`(()=>{const e=document.querySelector('.jm-start'),r=e.getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,bottom:r.bottom};})()`))}`); await b.shot(`${w}x${h}-start`); }
  for (const [w,h] of [[1440,900],[412,730]]) { await b.size(w,h); for (const P of [85,100,120]) { await b.evaluate('window.__jm.set('+P+')'); await combWait(120); await b.shot(w+'x'+h+'-handover-'+P); } }
  failures += b.errors.length; record('browser exceptions: '+JSON.stringify(b.errors));
} finally { await b.close(); appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/inherited-tests.log','\n## Browser measurements\n\n```text\n'+log.join('\n').replace(/[^\x00-\x7F]/g,'?')+'\n```\n'); }

console.log('browser layout failures:',failures); process.exitCode=failures?1:0;
