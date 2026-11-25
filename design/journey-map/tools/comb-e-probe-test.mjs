import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {readFileSync} from 'node:fs';
const b=await combBBrowser();
try{
 const html=readFileSync('dist/journey-map.html','utf8').replace('const later=()=>{','const later=()=>{window.__eLater=(window.__eLater||0)+1;window.__eBusy=busy();').replace('const run=deadline=>{','const run=deadline=>{window.__eRun=(window.__eRun||0)+1;').replace('</script>','\nwindow.__eDebug={TRIP_EL,VIEW,tripMeasureExploreLabels};\n</script>');
 await b.size(412,730);await b.send('Page.navigate',{url:'data:text/html;base64,'+Buffer.from(html).toString('base64')});await combBWait(1500);
 await b.evaluate('window.__jm.go("map",{instant:true})');await combBWait(12000);
 console.log(await b.evaluate(`JSON.stringify({hidden:document.hidden,idle:typeof requestIdleCallback,classes:document.documentElement.className,rows:window.__eDebug.TRIP_EL.rows.map(r=>({id:r.row.stop,box:!!r.box})),ready:window.__eDebug.TRIP_EL.exploreReady,epoch:window.__eDebug.TRIP_EL.exploreEpoch,P:window.__jm.P,moving:window.__jm.moving,point:typeof DOMPoint})`));
 console.log('errors '+JSON.stringify(b.errors));
 console.log(await b.evaluate('JSON.stringify({later:window.__eLater,busy:window.__eBusy,run:window.__eRun})'));
 console.log(await b.evaluate('new Promise(resolve=>requestIdleCallback(d=>resolve({idle:true,remaining:d.timeRemaining()}),{timeout:1000}))'));
 await b.page('dist/journey-map.html');await b.evaluate('window.__jm.go("map",{instant:true})');await combBWait(1200);
 console.log(await b.evaluate('JSON.stringify({file:true,hidden:document.hidden,classes:document.documentElement.className,idle:typeof requestIdleCallback,P:window.__jm.P})'));
}finally{await b.close();}
