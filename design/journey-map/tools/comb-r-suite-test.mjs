// Requested regression inventory; logs and exits are evidence, never a suite pass.
import{spawn}from'node:child_process';
import{readFileSync,readdirSync,createWriteStream,appendFileSync,mkdirSync,writeFileSync}from'node:fs';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-r',phase=process.argv[2]||'baseline';mkdirSync(root+'/'+phase,{recursive:true});
const explicit='check finds-test steps-test explore-test layout-test depth-test whirl2-test frame-render-test comb-p-quiet-test comb-p-style-test comb-b-art-test comb-d-drawings-test comb-l2-all-finds-test comb-m-layers-test comb-n-hold-test comb-q-serpent-test'.split(' ');
const matches=readdirSync('tools').filter(f=>f.endsWith('test.mjs')&&!f.startsWith('comb-r-')&&/compass|wayfinder|beacon|horn|serpent|wf-|findWay|veil|bc-|hn-|jg-|jo-|\.lg|legend|cardsClose|c-card|explore/.test(readFileSync('tools/'+f,'utf8'))).map(f=>f.slice(0,-4));
const omitted=[],tests=[...new Set(process.argv.length>3?process.argv.slice(3):[...explicit,...matches])].filter(t=>{
 const s=readFileSync('tools/'+t+'.mjs','utf8');let reason='';
 if(/suite-test|run-test|regression-test/.test(t))reason='orchestrator (leaf checks run directly)';
 if(/comb-(?:c|d|e|l2)?-?report-test/.test(t)&&/writeFileSync/.test(s)&&t!=='comb-f-report-test')reason='writes protected historical report';
 if(t==='comb-f-sharpness-test')reason='historical timing pass; measurements reserved for R9';
 if(/pins-test|record-test|setup-test/.test(t))reason='historical re-recording writer changes unrelated assertions';
 if(/\b(?:execSync|spawnSync|spawn|execFileSync)\([^\n]*['"]git/.test(s))reason='prohibited git command';
 if(reason)omitted.push({test:t,reason});return !reason;
});
writeFileSync(root+'/'+phase+'/inventory.json',JSON.stringify({tests,omitted},null,2));
let at=0;async function worker(){while(at<tests.length){const test=tests[at++],src=readFileSync('tools/'+test+'.mjs','utf8');let part=src.match(/COMB_RUN\s*!==\s*['"](comb-[\w]+)['"]/)?.[1];if(!part&&/pBrowser/.test(src))part='comb-p';if(!part&&/oBrowser/.test(src))part='comb-o';part||='comb-r';
 const log=createWriteStream(root+'/'+phase+'/'+test+'.log');const child=spawn(process.execPath,['--experimental-loader','./tools/comb-r-loader.mjs','tools/'+test+'.mjs'],{env:{...process.env,COMB_RUN:part},stdio:['ignore','pipe','pipe']});child.stdout.pipe(log,{end:false});child.stderr.pipe(log,{end:false});const code=await new Promise(r=>child.on('exit',r));log.end();appendFileSync(root+'/'+phase+'/exits.ndjson',JSON.stringify({test,exit:code,part})+'\n');console.log(test+': '+code);}}
await Promise.all(Array.from({length:Number(process.env.COMB_WORKERS||3)},()=>worker()));
