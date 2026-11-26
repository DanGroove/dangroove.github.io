// The required COMB-B Node suite, with all output retained in the authorized report.
import { spawn } from 'node:child_process';
import { appendFileSync, readdirSync } from 'node:fs';
const tests=['check','steps-test','nova-test','depth-test','layout-test','explore-test','finds-test','motion-test','hammer-test','frame-cost-test','frame-performance-test','frame-render-test','whirl2-test','comb-c-tail-test','comb-b-art-test'];
const run=async(args)=>{
  const child=spawn(process.execPath,args,{stdio:['ignore','pipe','pipe']});let output='';
  for(const stream of[child.stdout,child.stderr])stream.on('data',b=>{output+=b;});
  const code=await new Promise(ok=>child.on('close',ok));
  appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/inherited-tests.log','\n## node '+args.join(' ')+' (exit '+code+')\n\n```text\n'+(output||'(no output)\n').replace(/[^\x00-\x7f]/g,'?')+'```\n');
  console.log('node '+args.join(' ')+' -> '+code+'\n'+(code?output:output.split('\n').filter(Boolean).slice(-2).join('\n')));
  return code;
};
let failed=0;
for(const file of[...readdirSync('.').filter(f=>f.endsWith('.mjs')),...readdirSync('tools').filter(f=>f.endsWith('.mjs')&&!/^(frame-cost|comb-[bc]-cost-test)\.mjs$/.test(f)).map(f=>'tools/'+f)])failed+=!!await run(['--check',file]);
for(const test of tests)failed+=!!await run(['tools/'+test+'.mjs']);
console.log(failed+' failed checks');process.exitCode=failed?1:0;
