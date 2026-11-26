import assert from 'node:assert/strict';
import {lBrowser,lSave,gWait} from './comb-l-probe.mjs';
const b=await lBrowser(),rows=[];
try{await b.size(1440,900,false,1);await b.page(true,'map');await b.rest();
console.log(await b.read(`({version:navigator.userAgent,base:!!document.querySelector('#map-base #b-all'),rest:!!document.querySelector('#cam>#b-rest .ygg'),swells:__g.FD.list.serpent.swells.length,secondary:__g.TRIP_EL.secondary.length,texts:__g.TRIP_EL.secondaryText.length})`));
for(const beat of ['map','laurier','x','end']){await b.page(true,beat);await gWait(1800);await b.reset(beat);await gWait(2000);rows.push({beat,...await b.result()});console.log(beat,rows.at(-1).owners,await b.read('({held:__g.TRIP_EL.baseRaster.held,cam:document.querySelector("#cam-base").getAttribute("transform")})'));}
await b.page(true,'map');await b.reset('first');await b.click('.go-next');await b.rest();rows.push({beat:'first',...await b.result()});console.log('first camera writes',rows.at(-1).page.mutations['#cam-base/transform']);assert.deepEqual(b.errors,[]);
}finally{lSave('smoke',rows);await b.close();}
