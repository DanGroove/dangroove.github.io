// COMB-S regression inventory: every COMB-R leaf plus its own leaf tests.
import {spawn} from 'node:child_process';
import {readFileSync,readdirSync,createWriteStream,appendFileSync,mkdirSync,writeFileSync} from 'node:fs';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-s',phase=process.argv[2]||'baseline';
mkdirSync(root+'/'+phase,{recursive:true});
const old=JSON.parse(readFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-r/final/inventory.json','utf8'));
const tests=process.argv.length>3?process.argv.slice(3):[...new Set(['comb-s-raster-test','comb-s-idle-test','comb-s-picture-test','comb-s-scope-test','comb-s-marker-test',...old.tests,...readdirSync('tools').filter(f=>/^comb-r-.*-test\.mjs$/.test(f)&&f!=='comb-r-suite-test.mjs').map(f=>f.slice(0,-4))])];
writeFileSync(root+'/'+phase+'/inventory.json',JSON.stringify({tests,omitted:old.omitted},null,2));
let at=0;async function worker(){while(at<tests.length){const test=tests[at++],src=readFileSync('tools/'+test+'.mjs','utf8');
 if(/\b(?:execSync|spawnSync|spawn|execFileSync)\([^\n]*['"]git/.test(src))throw Error('Prohibited git: '+test);
 let part=src.match(/COMB_RUN\s*!==\s*['"](comb-[\w]+)['"]/)?.[1];if(!part&&/pBrowser/.test(src))part='comb-p';if(!part&&/oBrowser/.test(src))part='comb-o';part||='comb-s';
 const log=createWriteStream(root+'/'+phase+'/'+test+'.log'),child=spawn(process.execPath,['--experimental-loader','./tools/comb-s-loader.mjs','tools/'+test+'.mjs'],{env:{...process.env,COMB_RUN:part,COMB_PHASE:phase},stdio:['ignore','pipe','pipe']});child.stdout.pipe(log,{end:false});child.stderr.pipe(log,{end:false});
 const exit=await new Promise(r=>child.on('exit',r));log.end();appendFileSync(root+'/'+phase+'/exits.ndjson',JSON.stringify({test,exit,part})+'\n');console.log(test+': '+exit);
 }}await Promise.all(Array.from({length:Number(process.env.COMB_WORKERS||5)},()=>worker()));
