import { spawnSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
const names = process.argv.slice(2);
const tests = names.length ? names : ['check','steps-test','nova-test','depth-test','layout-test','explore-test','finds-test','motion-test','hammer-test','whirl2-test','frame-cost-test','frame-performance-test','frame-render-test'];
let failures=0;
for (const name of tests) {
  const r=spawnSync(process.execPath,['tools/'+name+'.mjs'],{encoding:'utf8',maxBuffer:8*1024*1024,timeout:120000});
  const output=(r.stdout||'')+(r.stderr||'')+(r.error?'\n'+r.error.message:'');
  appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2/inherited-tests.log','\n## '+name+' (exit '+r.status+')\n\n```text\n'+output.replace(/[^\x00-\x7f]/g,'?')+'```\n');
  console.log(name+': exit '+r.status+'\n'+output.slice(0,3000));
  if(r.status!==0)failures++;
}
console.log('suite: '+tests.length+' runs, '+failures+' failures'); process.exitCode=failures?1:0;
