import { combBrowser } from './comb-browser.mjs';
import { spawn } from 'node:child_process';
import { appendFileSync } from 'node:fs';
const browser = await combBrowser();
try {
  for (const [tool,options] of [['origin-check',[]],['frame-cost',['--passes','timing','--scenarios','6,7,8,9']],['frame-cost',['--passes','timing','--scenarios','6,7,8,9','--width','1440','--height','900','--dpr','1','--cpu','1']]]) {
    const args=['tools/'+tool+'.mjs','--cdp',browser.url,...options]; let output='';
    const child=spawn(process.execPath,args,{stdio:['ignore','pipe','pipe']});
    for(const stream of [child.stdout,child.stderr])stream.on('data',chunk=>{output+=chunk;process.stdout.write(chunk);});
    const status=await new Promise(ok=>child.on('close',ok));
    appendFileSync('COMB-A-BUILD.md','\n## '+tool+' '+options.join(' ')+' (exit '+status+')\n\n```text\n'+output.replace(/[^\x00-\x7F]/g,'?')+'```\n');
  }
} finally { await browser.close(); }
