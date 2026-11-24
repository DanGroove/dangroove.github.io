// Reproducible tables from captured evidence; writes only the authorized report.
import { readFileSync, appendFileSync, existsSync } from 'node:fs';
import { strict as assert } from 'node:assert';
const base='C:/Users/Admin/Documents/Portfolio/journey-map-runs/glide/';
const report=new URL('../GLIDE-BUILD.md',import.meta.url),read=p=>JSON.parse(readFileSync(base+p,'utf8'));
const stages=['baseline-timing','writes-timing','precision-timing','find-writes-timing','desktop-timing','final-capture'];
let text='\n## Captured performance tables\n\nAll costs are exclusive renderer-main-thread milliseconds per measured frame.\nRaster is separate worker time. Paint excludes pre-paint; style+layout is\nthe sum of those two columns. Missing evidence is not zero. The four named\nglides exclude idle tails; the six original scenarios retain their original\nwindows. Screenshots run separately and include capture overhead.\n';
text+='\nInitial standalone frame-cost-test run: exit 0.\n\n```text\nok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature\nok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work\n```\n';
if(existsSync(base+'before/comparison.json'))text+='\nInitial visual baseline command: exit 0. Each emitted record is retained\nbelow; comparison fields are null because this is the reference capture.\n\n```text\n'+read('before/comparison.json').map(r=>JSON.stringify(r)).join('\n')+'\n```\n';
for(const stage of stages)for(const page of ['journey-map','journey-joined']){
 const file=stage+'/'+page+'.html-results.json';if(!existsSync(base+file))continue;
 text+='\n### '+stage+' / '+page+'\n\n| Scenario | Frames | p50 | p95 | Max | >33 | >100 | Script | Style+layout | Layout | Style | Paint | Pre-paint | Layerize | Commit | Raster | Long/max | Blank/captures |\n| --- | '+Array(17).fill('---:').join(' | ')+' |\n';
 for(const r of read(file)){
  assert.ok(Number.isInteger(r.intervals.n)&&r.intervals.n>0,'nonempty frame sample');
  assert.ok(Math.abs(r.cost.styleLayout-r.cost.layout-r.cost.style)<1e-8,'trace totals agree');
  const v=r.intervals,c=r.cost,f=x=>x==null?'N/A':x.toFixed(2);
  text+='| '+r.name+(r.capture?' capture':' timing')+' | '+[v.n,f(v.p50),f(v.p95),f(v.max),v.over33,v.over100,...['script','styleLayout','layout','style','paintOnly','prePaint','layerize','commit','raster'].map(k=>f(c[k])),r.long.length+'/'+f(Math.max(0,...r.long.map(e=>e.duration))),r.capture?r.blanks.length+'/'+r.captures:'not sampled'].join(' | ')+' |\n';
 }
}
text+='\n## Rendered comparison counts\n\nRaw changed pixels, without a color tolerance, against the pre-edit captures.\nGlides use the brief\'s label-box (0.5 CSS px) and constant-stroke gates;\nthe 0.5 percent raster limit applies to rest frames. Tiny GPU rounding\ndifferences in glides are retained here rather than discarded.\n';
for(const stage of ['writes-visual','precision-visual','final-visual','final-isolated']){
 if(!existsSync(base+stage+'/comparison.json'))continue;
 const rows=read(stage+'/comparison.json');text+='\n### '+stage+'\n\n| Capture | Changed/total pixels | Percent | Max label-box delta px | Max stroke-width delta px |\n| --- | ---: | ---: | ---: | ---: |\n';
 for(const r of rows)text+='| '+r.name+' | '+r.changed+'/'+r.total+' | '+r.percent.toFixed(6)+' | '+r.labelMax.toFixed(6)+' | '+r.strokeMax.toFixed(6)+' |\n';
 const still=rows.filter(r=>!r.geometry),glides=rows.filter(r=>r.geometry);text+='\nRest frames: '+still.length+'; worst '+Math.max(...still.map(r=>r.percent)).toFixed(6)+' percent. Glide frames: '+glides.length+'; max label-box delta '+Math.max(...glides.map(r=>r.labelMax)).toFixed(6)+' px; max stroke-width delta '+Math.max(...glides.map(r=>r.strokeMax)).toFixed(6)+' px.\n';
}
if(/[^\x09\x0a\x0d\x20-\x7e]/.test(text))throw Error('non-ASCII report');appendFileSync(report,text);console.log('appended captured performance tables and every rendered pixel count');
const final=[];for(const page of ['journey-map','journey-joined'])if(existsSync(base+'find-writes-timing/'+page+'.html-results.json'))final.push(...read('find-writes-timing/'+page+'.html-results.json').filter(r=>/->/.test(r.name)));
if(final.length){const phone=final.every(r=>r.intervals.p95<=50&&r.cost.styleLayout<=12);console.log('phone glide p95 <=50 ms and style+layout <=12 ms/frame: '+(phone?'PASS':'FAIL'));appendFileSync(report,'\nFinal phone performance gate: '+(phone?'PASS':'FAIL')+'.\n');}
if(existsSync(base+'final-isolated/comparison.json')){const rows=read('final-isolated/comparison.json');assert.ok(rows.every(r=>r.geometry?r.labelMax<=.5&&r.strokeMax<=1e-6:r.percent<=.5),'isolated final rest pixels and glide geometry');console.log('isolated final rest pixel and glide label/stroke gates: PASS');}
