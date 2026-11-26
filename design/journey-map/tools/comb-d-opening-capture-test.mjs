// Capture exactly spaced product rAF frames; PNG encoding cannot advance them.
import {combBBrowser,combBWait} from './comb-d-browser-test.mjs';
import {appendFileSync} from 'node:fs';
import {combDClock,combDAdvance} from './comb-d-clock-test.mjs';
const b=await combBBrowser(),output=[],log=s=>{console.log(s);output.push(s);};
try{
 await combDClock(b);
 await b.size(412,730);await b.page('dist/journey-map.html');await b.evaluate('window.__jm.go("end",{instant:true})');await combDAdvance(b,2000);await combBWait(2000);
 await b.evaluate('window.__dT=window.__dClock.now;document.querySelector(".go-next").click()');
 for(let i=0;i<=16;i++){
  if(i)await combDAdvance(b,100);
  const state=await b.evaluate('({elapsed:window.__dClock.now-window.__dT,cam:document.getElementById("cam").getAttribute("transform"),opacity:Number(getComputedStyle(document.getElementById("map")).opacity)})');await b.shot('final-412x730-opening-clock-'+String(i*100).padStart(4,'0'));log(i*100+' ms: '+JSON.stringify(state));
  if(Math.abs(state.elapsed-i*100)>.01||i===16&&state.opacity<.02)throw Error('clock/capture did not advance the visible map');
 }
}catch(e){log('FAIL '+e.stack);process.exitCode=1;}finally{await b.close();appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/inherited-tests.log','\n## node tools/comb-d-opening-capture-test.mjs (exit '+(process.exitCode||0)+')\n\n```text\n'+output.join('\n').replace(/[^\x00-\x7f]/g,'?')+'\n```\n');}
