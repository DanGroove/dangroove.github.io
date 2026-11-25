import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {readFileSync} from 'node:fs';
import {combDInk} from './comb-d-ink-test.mjs';
const b=await combBBrowser();
try{
 let html=readFileSync('dist/journey-map.html','utf8').replace('E.exploreReady=true;','E.exploreReady=true;window.__fLabels={clear,box,rows:E.rows,scales};');
 await b.size(412,730);await b.send('Page.navigate',{url:'data:text/html;base64,'+Buffer.from(html).toString('base64')});await combBWait(600);await b.evaluate('__jm.go("map",{instant:true})');
 for(let n=0;n<160&&!await b.evaluate('!!window.__fLabels');n++)await combBWait(150);
 console.log(await b.evaluate('window.__fLabels?.rows.map(r=>({id:r.row.stop,sub:r.row.stopSub,clear:r.el.dataset.exploreClear,at:r.exploreLocal,box:r.box}))'));
 await b.evaluate('__jm.go("end",{instant:true})');await combBWait(800);await b.evaluate('document.querySelector(".go-next").click()');await combBWait(2000);
 let sampler=combDInk.toString().replace('let min=Infinity,who;','let min=Infinity,who,point;').replace('min=d;who=p.who;','min=d;who=p.who;point=p;').replace('box:b,gap:', 'box:b,point,gap:');
 console.log(await b.evaluate('('+sampler+')()'));await b.shot('f-labels-warmed');
}finally{await b.close();}
