import {gBrowser,gRoot,gWait} from './comb-g-browser-test.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import {strict as assert} from 'node:assert';
import './comb-g2-preservation-test.mjs';
const b=await gBrowser(),rows=[];
try{await b.size(844,390);await b.page(false,'mohawk');await b.click('#stop-mohawk .c-close');await gWait(500);const p=await b.read('(()=>{const e=document.getElementById("f-hammer");for(const p of e.querySelectorAll("path")){const m=p.getScreenCTM(),L=p.getTotalLength();for(let d=0;d<=L;d+=.5){const v=p.getPointAtLength(d),q=new DOMPoint(v.x,v.y).matrixTransform(m);if(q.x>=0&&q.x<innerWidth&&q.y>=0&&q.y<innerHeight&&document.elementFromPoint(q.x,q.y)?.closest(".find")===e)return[q.x,q.y];}}return null;})()');assert.ok(p,'G14 Mohawk hammer has a reachable drawing point');await b.tap(...p);await gWait(1700);assert.equal(await b.read('__g.SC.focus?.id'),'hammer');await b.shot('after-G14-mohawk-hammer-open-844x390');rows.push({mohawkHammer:p});
 await b.size(1440,900);await b.page();await b.key('End');await b.rest();await b.click('.go-next');await gWait(2000);await b.tabTo('#f-hammer');await b.key('Enter');await b.until('__g.FD.sheetOwner?.id==="hammer"&&!__g.FD.sheet.inert');const panel=await b.box('.hm-panel'),bar=await b.box('.go');assert.ok(panel.y>=bar.y+bar.h,'G1 explore top bar is a ceiling');rows.push({explorePanel:panel,bar});await b.shot('after-G1-explore-1440x900');
 await b.key('Escape');await gWait(600);await b.key('Escape');await gWait(2000);assert.ok(!await b.read('!!__g.SC.focus?.held'),'held find Escape release retained');assert.ok(!b.errors.length,b.errors.join('\n'));
}finally{await b.close();writeFileSync(gRoot+'/preservation-results.json',JSON.stringify(rows,null,2));}
console.log('Cloud fixes byte-preserved; authorized G12/G16/G27 paths covered by G2; Escape retained; accents preserved; Mohawk hit and Explore sheet tested with real input.');
