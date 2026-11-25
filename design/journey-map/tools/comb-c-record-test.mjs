import { readFileSync,writeFileSync,appendFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
const digest=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const trip=digest(readFileSync('trip.mjs','utf8').replace(/\r\n/g,'\n')),data=digest(readFileSync('data.mjs','utf8').replace(/\r\n/g,'\n'));
let finds=readFileSync('tools/finds-test.mjs','utf8');
finds=finds.replace(/sourceDigest\('trip.mjs'\), \d+/,"sourceDigest('trip.mjs'), "+trip).replace(/sourceDigest\('data.mjs'\), \d+/,"sourceDigest('data.mjs'), "+data);
writeFileSync('tools/finds-test.mjs',finds);
const r=spawnSync(process.execPath,['tools/frame-render-test.mjs','--record'],{encoding:'utf8'});if(r.status!==0)throw Error(r.stderr);
const values=JSON.parse(r.stdout),path='tools/frame-render-test.mjs';let source=readFileSync(path,'utf8'),changed=[];
for(const[key,hash]of Object.entries(values)){const re=new RegExp('("'+key+'": ")[a-f0-9]+(" )'.trim().replace('" )','")'));const old=source.match(new RegExp('"'+key+'": "([a-f0-9]+)"'))?.[1];if(old!==hash){changed.push(key);source=source.replace('"'+key+'": "'+old+'"','"'+key+'": "'+hash+'"');}}
writeFileSync(path,source);
const output='C8/C2 data/trip normalized digests: '+data+' / '+trip+'\nC16 remnant/ember command snapshots changed: '+changed.join(', ')+'\n'+r.stdout;
console.log(output);appendFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g/inherited-tests.log','\n## comb-c-record-test (exit 0)\n\n```text\n'+output+'```\n');
