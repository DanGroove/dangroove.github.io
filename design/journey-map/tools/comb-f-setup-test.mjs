import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2';
for(const f of readdirSync('tools').filter(f=>f.endsWith('.mjs')&&f!=='frame-cost.mjs'&&!/^comb-[bc]-cost-test/.test(f))){const p='tools/'+f,s=readFileSync(p,'utf8');const n=s.replace(/journey-map-runs\/comb-[abcde](?=[/'"])/g,'journey-map-runs/comb-g2').replace(/appendFileSync\('COMB-[A-E]-BUILD\.md'/g,"appendFileSync('"+root+"/inherited-tests.log'");if(n!==s)writeFileSync(p,n);}
console.log('Test artifacts confined to comb-f.');
