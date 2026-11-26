// Runs only the named behaviour/state/pixel checks. Full output stays in COMB_RUN.
import {spawn} from 'node:child_process';
import {mkdirSync,createWriteStream,writeFileSync,appendFileSync} from 'node:fs';
import {resolve} from 'node:path';
const root=resolve('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-o');mkdirSync(root,{recursive:true});
const tests=process.argv.slice(2),results=[];let at=0;
async function worker(){while(at<tests.length){const test=tests[at++],file='tools/'+test+'.mjs',logName=test+'-'+process.pid+'.log',log=createWriteStream(root+'/'+logName);const child=spawn(process.execPath,['--experimental-loader','./tools/comb-o-loader.mjs',file],{env:{...process.env,COMB_RUN:'comb-o'},stdio:['ignore','pipe','pipe']});child.stdout.pipe(log,{end:false});child.stderr.pipe(log,{end:false});const code=await new Promise(r=>child.on('exit',r));log.end();results.push({test,exit:code,log:logName});appendFileSync(root+'/test-exits.ndjson',JSON.stringify({test,exit:code,log:logName})+'\n');writeFileSync(root+'/suite-last.json',JSON.stringify(results,null,2));console.log(test+': '+code);}}
await Promise.all([worker(),worker(),worker()]);process.exitCode=results.some(r=>r.exit!==0)?1:0;
