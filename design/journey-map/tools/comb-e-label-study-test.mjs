import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
const b=await combBBrowser(),out=[];
const html=readFileSync('dist/journey-map.html','utf8').replace('</script>','\nwindow.__eDebug={TRIP_EL,VIEW};\n</script>');
try{
 for(const[w,h]of[[412,730],[390,844],[360,640],[1440,900]]){
  await b.size(w,h);await b.send('Page.navigate',{url:'data:text/html;base64,'+Buffer.from(html).toString('base64')});await combBWait(1000);await b.evaluate('document.fonts.ready.then(()=>true)');
  await b.evaluate('window.__jm.go("map",{instant:true})');
  for(let i=0;i<80;i++){if(await b.evaluate('window.__eDebug.TRIP_EL.exploreReady'))break;await combBWait(250);}
  const row=await b.evaluate(`({w:innerWidth,h:innerHeight,ready:window.__eDebug.TRIP_EL.exploreReady,rows:window.__eDebug.TRIP_EL.rows.map(r=>({id:r.row.stop,sub:!!r.row.stopSub,at:r.exploreLocal,from:Number.isFinite(r.exploreFrom)?r.exploreFrom:null,clear:r.el.dataset.exploreClear}))})`);out.push(row);console.log(JSON.stringify(row));
 }
}finally{await b.close();}
writeFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/label-study.json',JSON.stringify(out,null,2));
if(out.some(r=>!r.ready))process.exitCode=1;
