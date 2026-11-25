import {spawn} from 'node:child_process';
import {appendFileSync,mkdirSync} from 'node:fs';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2';
mkdirSync(root,{recursive:true});
export async function combERun(args){
 if(args.some(a=>/^(?:tools\/)?(?:frame-cost|comb-[bc]-cost-test)\.mjs$/.test(a)))throw Error('Prohibited launcher');
 const child=spawn(process.execPath,args,{stdio:['ignore','pipe','pipe']}),chunks=[];
 for(const stream of[child.stdout,child.stderr])stream.on('data',b=>chunks.push(b));
 const code=await new Promise(ok=>child.on('close',ok)),output=Buffer.concat(chunks).toString();
 appendFileSync(root+'/tests.log','\n## node '+args.join(' ')+' (exit '+code+')\n'+output+'\n');
 appendFileSync(root+'/exits.jsonl',JSON.stringify({command:'node '+args.join(' '),code})+'\n');
 console.log(args.join(' ')+' -> '+code+'\n'+output.trim().split('\n').slice(-2).join('\n'));
 return code;
}
if(process.argv[1]?.replaceAll('\\','/').endsWith('/comb-e-run-test.mjs'))process.exitCode=await combERun(process.argv.slice(2));
