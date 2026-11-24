import { combBrowser } from './comb-browser.mjs';
import { spawn } from 'node:child_process';
import { appendFileSync } from 'node:fs';
const phase = process.argv[2] || 'after', browser = await combBrowser();
try {
  const runs = phase === 'before' ? [['frame-cost',['--passes','timing','--scenarios','0,1,2,3']]] : phase === 'final' ? [['origin-check',[]],['frame-cost',['--passes','timing','--scenarios','0,1,2,3,6,7,8,9']],['frame-cost',['--passes','timing','--scenarios','6,7,8,9','--width','1440','--height','900','--dpr','1','--cpu','1']]] : [['origin-check',[]],['frame-cost',['--passes','timing','--scenarios','0,1,2,3,6,7,8,9']],['frame-cost',['--passes','capture','--scenarios','0,1,2,3']]];
  if(phase==='final')runs.push(['frame-cost',['--passes','capture','--scenarios','0,1,2,3']]);
  for (const [tool, options] of runs) {
    const child=spawn(process.execPath,['tools/'+tool+'.mjs','--cdp',browser.url,...options],{stdio:['ignore','pipe','pipe']}); let output='';
    for(const stream of [child.stdout,child.stderr]) stream.on('data',b=>{output+=b;process.stdout.write(b);});
    const status=await new Promise(ok=>child.on('close',ok));
    appendFileSync('COMB-C-BUILD.md','\n## '+phase+' '+tool+' '+options.join(' ')+' (exit '+status+')\n\n```text\n'+output.replace(/[^\x00-\x7f]/g,'?')+'```\n');
  }
} finally { await browser.close(); }
