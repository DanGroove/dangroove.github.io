// COMB-T regressions use COMB-S's last exits, without an initial rerun.
import {spawn} from 'node:child_process';
import {readFileSync,existsSync,createWriteStream,appendFileSync,mkdirSync,writeFileSync} from 'node:fs';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-t',phase=process.argv[2]||'regressions';mkdirSync(root+'/'+phase,{recursive:true});
const table=readFileSync('COMB-S-BUILD.md','utf8'),prior={};for(const m of table.matchAll(/^\| ([\w-]+) \| [^|]+ \| (\d+) \|/gm))if(existsSync('tools/'+m[1]+'.mjs'))prior[m[1]]=+m[2];
const tests=process.argv.length>3?process.argv.slice(3):Object.keys(prior),omitted=[];
const allowed=tests.filter(t=>{const s=readFileSync('tools/'+t+'.mjs','utf8');let why='';if(/suite-test|report-test/.test(t)&&t!=='comb-f-report-test')why='orchestrator or historical report writer';if(/\b(?:execSync|spawnSync|spawn|execFileSync)\([^\n]*['"]git/.test(s))why='prohibited git command';if(why)omitted.push({test:t,why});return !why;});
writeFileSync(root+'/'+phase+'/inventory.json',JSON.stringify({tests:allowed,prior,omitted},null,2));
let at=0;async function worker(){while(at<allowed.length){const test=allowed[at++],s=readFileSync('tools/'+test+'.mjs','utf8');let part=s.match(/COMB_RUN\s*!==\s*['"](comb-[\w]+)['"]/)?.[1];if(!part&&/pBrowser/.test(s))part='comb-p';if(!part&&/oBrowser/.test(s))part='comb-o';part||='comb-t';
 const log=createWriteStream(root+'/'+phase+'/'+test+'.log'),child=spawn(process.execPath,['--no-warnings','--experimental-loader','./tools/comb-t-loader.mjs','tools/'+test+'.mjs'],{env:{...process.env,COMB_RUN:part},stdio:['ignore','pipe','pipe']});child.stdout.pipe(log,{end:false});child.stderr.pipe(log,{end:false});let timedOut=false;const timer=setTimeout(()=>{timedOut=true;child.kill();},+process.env.COMB_TEST_TIMEOUT||240000);const exit=await new Promise(r=>child.on('exit',r));clearTimeout(timer);log.end();const row={test,exit,timedOut,part,prior:prior[test]??null,newFailure:prior[test]===0&&exit!==0};appendFileSync(root+'/'+phase+'/exits.ndjson',JSON.stringify(row)+'\n');console.log(JSON.stringify(row));}}
await Promise.all(Array.from({length:+process.env.COMB_WORKERS||3},()=>worker()));
