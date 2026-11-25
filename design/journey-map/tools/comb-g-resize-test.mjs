import {gBrowser,gRoot,gWait} from './comb-g-browser-test.mjs';
import {writeFileSync} from 'node:fs';
const b=await gBrowser(),before=process.argv.includes('--before'),tag=before?'before':'after',fail=[],rows=[];
try{
 await b.size(844,390);await b.page(false,'mohawk',before);await b.click('#stop-mohawk .c-close');await gWait(600);await b.shot(tag+'-G14-mohawk-844x390');
 await b.size(1440,900);await b.page(false,'map',before);await b.key('End');await b.rest();await b.click('.go-next');await gWait(2200);await b.key('+');await b.key('+');await gWait(1600);
 for(const[w,h]of[[1100,700],[844,390],[412,730],[1440,900]]){await b.size(w,h);await gWait(1100);const r=await b.read('__g.TRIP_EL.rows.map(r=>{const e=r.el.querySelector("text"),a=e.getBoundingClientRect(),s=r.stop>=0?document.querySelector("#stop-"+r.row.stop+" .stone").getBoundingClientRect():null;return{stop:r.row.stop,sub:r.row.stopSub,markup:e.innerHTML===r.exploreMarkup,overlap:s?Math.min(a.right,s.right)>Math.max(a.left,s.left)&&Math.min(a.bottom,s.bottom)>Math.max(a.top,s.top):false,opacity:+getComputedStyle(r.el).opacity,text:e.textContent};})');rows.push({w,h,r});for(const x of r){if(!x.markup)fail.push('G26 normal markup after resize '+w+' '+x.stop);if(x.overlap)fail.push('G26 own shield overlap '+w+' '+x.stop);if(x.stop==='x'&&x.sub&&x.opacity<.99)fail.push('G26 X second line hidden '+w);}await b.shot(tag+'-G26-'+w+'x'+h);}
}finally{await b.close();writeFileSync(gRoot+'/'+tag+'-resize.json',JSON.stringify({fail,rows},null,2));}
console.log(tag+' resize failures '+JSON.stringify(fail));process.exitCode=before?0:fail.length?1:0;
