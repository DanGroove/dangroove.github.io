// Run authorized checks and keep every command's actual output in the report.
import { spawn } from 'node:child_process';
import { appendFileSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url)),report=new URL('../GLIDE-BUILD.md',import.meta.url);
const args=process.argv.slice(2),mode=args.shift()||'suite';
const run=argv=>new Promise(resolve=>{
 let output='';const p=spawn(process.execPath,argv,{cwd:root,stdio:['ignore','pipe','pipe']});
 for(const stream of[p.stdout,p.stderr])stream.on('data',b=>{const s=b.toString();output+=s;process.stdout.write(s)});
 p.on('close',code=>{appendFileSync(report,'\n### '+mode+': node '+argv.join(' ')+'\n\nExit '+code+'.\n\n```text\n'+output.replace(/[^\x09\x0a\x0d\x20-\x7e]/g,'?')+'```\n');if(code)process.exitCode=1;resolve(code)});
});
if(mode==='suite')for(const name of['check','steps-test','nova-test','depth-test','layout-test','explore-test','finds-test','motion-test','hammer-test','frame-cost-test','frame-performance-test','frame-render-test'])await run(['tools/'+name+'.mjs']);
else if(mode==='pack')for(const name of['pack','pack-joined'])await run(['tools/'+name+'.mjs']);
else if(mode==='final-check')for(const name of['check','whirl2-test'])await run(['tools/'+name+'.mjs']);
else if(mode==='report')await run(['tools/glide-report-test.mjs']);
else if(mode==='syntax'){
 const files=[...readdirSync(root).filter(f=>f.endsWith('.mjs')),...readdirSync(root+'tools').filter(f=>f.endsWith('.mjs')).map(f=>'tools/'+f)];
 for(const f of files)await run(['--check',f]);console.log('syntax checked '+files.length+' files');
}else{
 const [port,path]=readFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/glide/profile/DevToolsActivePort','utf8').trim().split(/\r?\n/),cdp='ws://127.0.0.1:'+port+path;
 const tool=mode==='origin'?'origin-check':mode.startsWith('visual')?'glide-visual-test':'frame-cost';
 await run(['tools/'+tool+'.mjs','--cdp',cdp,...args]);
}
