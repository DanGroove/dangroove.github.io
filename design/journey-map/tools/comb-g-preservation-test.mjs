import {gBrowser,gRoot,gWait} from './comb-g-browser-test.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import {strict as assert} from 'node:assert';
const old=f=>readFileSync(gRoot+'/before-source/'+f,'utf8').replaceAll('\r\n','\n'),now=f=>readFileSync(f,'utf8').replaceAll('\r\n','\n');
for(const f of ['depth.mjs','findkit.mjs','join.mjs','stars.mjs','pace.mjs','findwater.mjs'])assert.equal(now(f),old(f),f+' protected or outside current items');
assert.equal(now('main.mjs').replace('st.rushT > 0 && st.settleT < 1 && !RM','st.rushT > 0 && !RM'),old('main.mjs'),'only G23 nova guard changed in main');
const cut=(s,a,z)=>s.slice(s.indexOf(a),s.indexOf(z,s.indexOf(a)));
assert.equal(cut(now('trip.mjs'),'  // Explore promotes','  // Keep the displayed'),cut(old('trip.mjs'),'  // Explore promotes','  // Keep the displayed'),'cloud promotion block');
assert.equal(cut(now('steps.mjs'),'// The joined page holds scrolls','function stepsKey'),cut(old('steps.mjs'),'// The joined page holds scrolls','function stepsKey'),'cloud loader and vertical slop block');
assert.equal(cut(now('findsheets.mjs'),'      // the rubbing is read','      attr(o.fill'),cut(old('findsheets.mjs'),'      // the rubbing is read','      attr(o.fill'),'cloud hint cleanup');
const accent=s=>[...s].filter(c=>/[\u00c0-\u024f]/.test(c)).join('');assert.equal(accent(now('data.mjs')),accent(old('data.mjs')),'accented letters preserved');
const b=await gBrowser(),rows=[];
try{await b.size(844,390);await b.page(false,'mohawk');await b.click('#stop-mohawk .c-close');await gWait(500);const p=await b.read('(()=>{const e=document.getElementById("f-hammer");for(const p of e.querySelectorAll("path")){const m=p.getScreenCTM(),L=p.getTotalLength();for(let d=0;d<=L;d+=.5){const v=p.getPointAtLength(d),q=new DOMPoint(v.x,v.y).matrixTransform(m);if(q.x>=0&&q.x<innerWidth&&q.y>=0&&q.y<innerHeight&&document.elementFromPoint(q.x,q.y)?.closest(".find")===e)return[q.x,q.y];}}return null;})()');assert.ok(p,'G14 Mohawk hammer has a reachable drawing point');await b.tap(...p);await gWait(1700);assert.equal(await b.read('__g.SC.focus?.id'),'hammer');await b.shot('after-G14-mohawk-hammer-open-844x390');rows.push({mohawkHammer:p});
 await b.size(1440,900);await b.page();await b.key('End');await b.rest();await b.click('.go-next');await gWait(2000);await b.tabTo('#f-hammer');await b.key('Enter');await b.until('__g.FD.sheetOwner?.id==="hammer"&&!__g.FD.sheet.inert');const panel=await b.box('.hm-panel'),bar=await b.box('.go');assert.ok(panel.y>=bar.y+bar.h,'G1 explore top bar is a ceiling');rows.push({explorePanel:panel,bar});await b.shot('after-G1-explore-1440x900');
 await b.key('Escape');await gWait(600);await b.key('Escape');await gWait(2000);assert.ok(!await b.read('!!__g.SC.focus?.held'),'held find Escape release retained');assert.ok(!b.errors.length,b.errors.join('\n'));
}finally{await b.close();writeFileSync(gRoot+'/preservation-results.json',JSON.stringify(rows,null,2));}
console.log('Cloud fixes byte-preserved; pending press, Escape, G16/G27 paths retained; accents preserved; Mohawk hit and Explore sheet tested with real input.');
