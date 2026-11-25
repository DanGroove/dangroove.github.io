import {gBrowser,gRoot,gWait} from './comb-g2-browser-test.mjs';
import {writeFileSync} from 'node:fs';
const b=await gBrowser(),rows=[];
try{
 for(const[w,h]of[[412,730],[1440,900],[844,390],[730,412]]){
  await b.size(w,h,w!==1440);
  for(const before of [true,false]){await b.page(false,'map',before);await gWait(600);await b.shot((before?'before':'after')+'-overview-'+w+'x'+h);rows.push({w,h,before,bar:await b.box('.go'),next:await b.box('.go-next'),back:await b.box('.go-back')});}
 }
 if(b.errors.length)throw Error(b.errors.join('\n'));
}finally{await b.close();writeFileSync(gRoot+'/evidence-geometry.json',JSON.stringify(rows,null,2));}
console.log('Before/after map and bar captured at DPR 2, portrait, desktop and both short landscapes.');
