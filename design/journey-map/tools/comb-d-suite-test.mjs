// Every invoked test's full output is retained in the sole authorized report.
import {spawn} from 'node:child_process';
import {appendFileSync,readdirSync} from 'node:fs';
export async function combDRun(args){
 const child=spawn(process.execPath,args,{stdio:['ignore','pipe','pipe']});let output='';
 for(const stream of[child.stdout,child.stderr])stream.on('data',b=>output+=b);
 const code=await new Promise(ok=>child.on('close',ok));
 appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-e/inherited-tests.log','\n## node '+args.join(' ')+' (exit '+code+')\n\n```text\n'+(output||'(no output)\n').replace(/[^\x00-\x7f]/g,'?')+'```\n');
 console.log(args.join(' ')+' -> '+code+'\n'+(code?output:output.trim().split('\n').slice(-2).join('\n')));return code;
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/comb-d-suite-test.mjs')){
 const tests=process.argv.slice(2),list=tests.length?tests:['check','steps-test','nova-test','depth-test','layout-test','explore-test','finds-test','motion-test','hammer-test','frame-cost-test','frame-performance-test','frame-render-test','whirl2-test','comb-c-tail-test','comb-b-art-test'];
 let failed=0;
 if(!tests.length)for(const file of readdirSync('.').filter(f=>f.endsWith('.mjs')))failed+=!!await combDRun(['--check',file]);
 for(const test of list){if(/^(frame-cost|comb-[bc]-cost-test)$/.test(test))throw Error('Prohibited timing entry point');failed+=!!await combDRun(['tools/'+test+'.mjs']);}
 console.log(failed+' failed checks');process.exitCode=failed?1:0;
}
