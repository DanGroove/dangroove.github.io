// No --out: the legacy harness allows a different run folder, so all results stay in the report.
import { combBBrowser } from './comb-b-browser-test.mjs';
import { spawn } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';
const b=await combBBrowser(),baseline=readFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/glide/comb-c/frame-cost-timing.txt','utf8');
const rows=s=>{let page='';const out={};for(const line of s.split('\n')){if(line.startsWith('/journey-'))page=line.split(' ')[0];if(/^\| (map ->|Laurier ->|HMC again ->|Interkom ->)/.test(line)){const a=line.split('|').map(x=>x.trim());out[page+'/'+a[1]]=Number(a[4]);}}return out;};
let failed=false;
try{
  const runs=process.argv.includes('--final-glides')?[['frame-cost',['--passes','timing','--scenarios','6,7,8,9']]]:[['origin-check',[]],['frame-cost',['--passes','timing']],['frame-cost',['--passes','timing','--scenarios','6,7,8,9','--width','1440','--height','900','--dpr','1','--cpu','1']]];
  for(const[tool,args]of runs){
    const child=spawn(process.execPath,['tools/'+tool+'.mjs','--cdp',b.url,...args],{stdio:['ignore','pipe','pipe']});let output='';
    for(const stream of[child.stdout,child.stderr])stream.on('data',v=>{output+=v;process.stdout.write(v);});
    const code=await new Promise(ok=>child.on('close',ok));failed ||= !!code;
    appendFileSync('COMB-B-BUILD.md','\n## node tools/'+tool+'.mjs --cdp LOCAL '+args.join(' ')+' (exit '+code+')\n\n```text\n'+output.replace(/[^\x00-\x7f]/g,'?')+'```\n');
    if(tool==='frame-cost'&&!args.includes('--width')){
      const before=rows(baseline),after=rows(output),comparison=Object.entries(before).map(([key,p95])=>({key,before:p95,after:after[key],pass:after[key]<=p95}));
      const result='COMB-C last-table p95 comparison: '+JSON.stringify(comparison);console.log(result);appendFileSync('COMB-B-BUILD.md','\n```text\n'+result+'\n```\n');failed ||= comparison.some(r=>!r.pass);
    }
  }
}finally{await b.close();}
process.exitCode=failed?1:0;
