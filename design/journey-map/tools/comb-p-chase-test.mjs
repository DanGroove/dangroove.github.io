import assert from'node:assert/strict';import{pBrowser,save}from'./comb-p-fixture.mjs';import{DEPTH,C}from'../data.mjs';
const b=await pBrowser(),rows=[],fail=[];const check=(v,m)=>{if(!v)fail.push(m);};
try{for(const[w,h,touch]of[[1440,900,false],[1920,950,false],[412,915,true]]){await b.size(w,h,touch,touch?2.625:2);
 for(const[beat,name]of[['mohawk','skoll'],['interkom','hati']]){
 await b.page(false,beat);check(await b.read('__g.DP.birds.every(b=>getComputedStyle(b.el).visibility==="hidden")'),w+' rest');await b.begin();await b.click('.go-next',touch);await b.until('__g.DP.birds.some(b=>b.name==='+JSON.stringify(name)+'&&b.chase?.alpha>.8&&b.chase.u>.4)');await b.captureExact('p-chase-'+w+'-'+name+'-mid');await b.rest();const data=await b.end(),visible=data.frames.flatMap(f=>f.wolves.filter(v=>v.name===name&&v.visible&&v.chase?.alpha>0));
 check(visible.length>0,w+' '+name+' visible');let max=0;const ws=Math.max(DEPTH.wolves.size[0],Math.min(DEPTH.wolves.size[1],w/DEPTH.wolves.size[2]))*DEPTH.wolves[name].k;
 for(const v of visible){max=Math.max(max,Math.abs(v.chase.wolf[0]-v.chase.lead[0]-DEPTH.wolves.lag*ws));check(Math.abs(v.chase.R-DEPTH.wolves.sunR*ws/DEPTH.wolves[name].k)<.001,w+' fixed disc');check(JSON.stringify(v.fills)===JSON.stringify(visible[0].fills),w+' '+name+' fixed fills');check(Math.abs(Math.hypot(v.chase.wolf[0]-v.chase.lead[0],v.chase.wolf[1]-v.chase.lead[1])-v.chase.gap)<.001,w+' gap hook');}
 check(max<=1,w+' '+name+' horizontal lag '+max);check(await b.read('!document.querySelector('+JSON.stringify('.sky-bite,.sky-ghost,.sky-dim,[data-sky$="-halo"],[data-sky$="-stars"],clipPath[id^="eclipse-"]')+')'),w+' removed eclipse elements');
 check(!data.records.some(r=>['skoll','hati'].includes(r.sky)&&r.attr==='fill'),w+' no fill mutations');
 rows.push({w,beat,name,samples:visible.length,maxLagError:max});await b.shot('p-chase-'+w+'-'+name+'-arrival');
 await b.begin();await b.click('.go-back',touch);await b.rest();const back=await b.end();check(back.frames.every(f=>f.wolves.every(v=>!v.visible||!v.chase?.alpha)),w+' Back hidden');
 }
 await b.page(false,'end');await b.click('.go-next',touch);await b.until('__g.EX.active&&!__g.EX.motion');check(await b.read('__g.DP.birds.every(b=>getComputedStyle(b.el).visibility==="hidden")'),w+' explore hidden');
 }check(!b.errors.length,'console '+b.errors);console.log({rows,fail});assert.deepEqual(fail,[]);}finally{save('p-chase',{rows,fail});await b.close();}
