import {readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
const files=[...readdirSync('.').filter(f=>f.endsWith('.mjs')),...readdirSync('tools').filter(f=>f.endsWith('.mjs')&&!/^(frame-cost|comb-[bc]-cost-test)\.mjs$/.test(f)).map(f=>'tools/'+f)];let failed=0;
for(const file of files){const r=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});console.log(file+' '+r.status+(r.stderr?'\n'+r.stderr:''));if(r.status)failed++;}
console.log(files.length+' files syntax checked; '+failed+' failed. Deferred launchers excluded.');process.exitCode=failed?1:0;
