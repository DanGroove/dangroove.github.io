// Confine inherited test fixtures and full outputs to this round's run folder.
import {readFileSync,writeFileSync,readdirSync,mkdirSync} from 'node:fs';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-f';
mkdirSync(root,{recursive:true});
for(const file of readdirSync('tools').filter(f=>/^comb-[bd].*test\.mjs$/.test(f))){
 const path='tools/'+file,old=readFileSync(path,'utf8');
 let next=old.replaceAll('journey-map-runs/comb-f','journey-map-runs/comb-f');
 next=next.replace(/appendFileSync\('COMB-D-BUILD\.md'/g,"appendFileSync('"+root+"/inherited-tests.log'");
 if(next!==old)writeFileSync(path,next);
}
console.log('Inherited test profiles, captures and appended output confined to '+root);
