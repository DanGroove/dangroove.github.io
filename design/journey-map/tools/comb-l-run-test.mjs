import {spawnSync} from 'node:child_process';
import {appendFileSync} from 'node:fs';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l';
const jobs=process.argv.slice(2).length?process.argv.slice(2):['check','depth-test','explore-test','steps-test','motion-test','nova-test','finds-test','frame-render-test','whirl2-test','comb-d-pins-test','comb-f-pins-test','comb-l-scope-test'];
let failed=0;
for(const name of jobs){const args=['tools/'+name+'.mjs'],r=spawnSync(process.execPath,args,{encoding:'utf8',maxBuffer:64*1024*1024});const code=r.status??1;appendFileSync(root+'/tests.log','\nnode '+args.join(' ')+'\n'+r.stdout+r.stderr+'\nexit '+code+'\n');appendFileSync(root+'/exits.jsonl',JSON.stringify({name:'tools/'+name+'.mjs',exit:code})+'\n');console.log(name,code);failed+=code!==0;}
process.exitCode=failed?1:0;
