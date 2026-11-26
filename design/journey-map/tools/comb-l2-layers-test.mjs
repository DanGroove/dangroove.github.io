import assert from 'node:assert/strict';
import{lBrowser,lSave,gWait}from'./comb-l-probe.mjs';
const browser=process.env.COMB_BROWSER||'edge',b=await lBrowser(),rows=[],pending=new Set();let reasons={};
b.on('LayerTree.layerTreeDidChange',p=>{for(const l of p.layers||[]){if(reasons[l.layerId])continue;reasons[l.layerId]={node:l.backendNodeId};const job=(async()=>{try{reasons[l.layerId].reasons=(await b.send('LayerTree.compositingReasons',{layerId:l.layerId})).compositingReasons;if(l.backendNodeId){const{node}=await b.send('DOM.describeNode',{backendNodeId:l.backendNodeId});reasons[l.layerId].element={tag:node.nodeName,attributes:node.attributes};}}catch(e){reasons[l.layerId].unavailable=e.message;}})();pending.add(job);job.finally(()=>pending.delete(job));}});
async function sample(name,act){reasons={};await b.reset(name);await act();await b.rest();await Promise.allSettled([...pending]);const r=await b.result();const counts=r.layerFrames.map(f=>f.layers.length);rows.push({name,...r,reasons,range:counts.length?[Math.min(...counts),Math.max(...counts)]:null});console.log(name,rows.at(-1).range);lSave(browser+'-l4',rows);}
try{for(const[w,h,dpr]of[[1440,900,1],[1920,950,2],[412,730,2.625]])for(const forced of[false,true]){
b.patch=html=>forced?html.replace('</head>','<style>.map-tier2, .map-tier2 * { opacity: 1 !important; }</style></head>'):html;
await b.size(w,h,w<641,dpr);await b.page(true,'map');await gWait(1400);const prefix=w+'-'+(forced?'forced':'built');
await sample(prefix+'-first',()=>b.click('.go-next',w<641));
await b.key('End');await b.rest();await sample(prefix+'-explore-in',async()=>{await b.click('.go-next',w<641);await b.until('__g.EX.active&&!__g.EX.motion');});
await sample(prefix+'-explore-out',async()=>{await b.click('.go-back',w<641);await b.until('!__g.EX.active&&!__g.EX.motion');});
}
for(const w of[1440,1920,412])for(const move of['first','explore-in','explore-out']){const a=rows.find(r=>r.name===w+'-built-'+move),z=rows.find(r=>r.name===w+'-forced-'+move);assert.ok(Math.abs(a.range[1]-z.range[1])<=1,w+' '+move+' peak '+a.range+' vs '+z.range);}
assert.deepEqual(b.errors,[]);console.log('L4 paired peaks pass');
}finally{lSave(browser+'-l4',rows);await b.close();}
