import { combBrowser,combWait } from './comb-browser.mjs';
import { appendFileSync } from 'node:fs';
const b=await combBrowser(),out=[];
try {await b.page('dist/journey-map.html');await b.size(412,730);await b.evaluate('window.__jm.go("x",{instant:true})');await combWait(500);await b.evaluate('window.__jm.next()');
for(let i=0;i<12;i++){await combWait(400);out.push(await b.evaluate('({P:window.__jm.P,root:document.documentElement.className,legend:[...document.querySelectorAll(".lg,.legend-symbol")].map(e=>({tag:e.tagName,cls:e.getAttribute("class"),opacity:getComputedStyle(e).opacity,html:e.outerHTML.slice(0,120)}))})'));}
console.log(JSON.stringify(out,null,2));}finally{await b.close();appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g/inherited-tests.log','\n## comb-c-legend-test\n\n```text\n'+JSON.stringify(out,null,2)+'\n```\n');}
