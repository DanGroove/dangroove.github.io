import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {readFileSync} from 'node:fs';
import {FINDS} from '../data.mjs';
const b=await combBBrowser(),tag=process.argv[2]||'after';
const html=readFileSync('dist/journey-map.html','utf8').replace('</script>','\nwindow.__eFocus=stepsFocus;\n</script>');
try{
 for(const[w,h]of[[412,730],[360,640],[1440,900]]){
  await b.size(w,h);await b.send('Page.navigate',{url:'data:text/html;base64,'+Buffer.from(html).toString('base64')});await combBWait(1200);
  await b.evaluate('document.fonts.ready.then(()=>true)');
  await b.evaluate('window.__jm.go("map",{instant:true})');await combBWait(1800);
  if(w!==360)await b.shot(tag+'-'+w+'x'+h+'-overview');
  if(w===412)for(const id of ['serpent','beacon','hoards']){
   const f=FINDS.find(f=>f.id===id),v=f.view||[404,304,40];
   await b.evaluate(`window.__eFocus(${JSON.stringify(id)},${JSON.stringify(v)})`);await combBWait(1000);await b.shot(tag+'-412x730-'+id);
   await b.key('Escape');await combBWait(700);
  }
  await b.evaluate('window.__jm.go("end",{instant:true})');await combBWait(1800);
  await b.evaluate('document.querySelector(".go-next").click()');await combBWait(2200);await b.shot(tag+'-'+w+'x'+h+'-explore');
  console.log(tag+' '+w+'x'+h+' DPR 2 captured');
 }
 if(b.errors.length)throw Error(b.errors.join('\n'));
}finally{await b.close();}
