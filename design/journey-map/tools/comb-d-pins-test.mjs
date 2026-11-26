// Explicit D2-D10 pin update. Protected depth source and the pre-D cloud table stay pinned.
import {bigMap} from '../art.mjs';
import {STARS,DEPTH,NOVA,FIND_PLAY} from '../data.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import {strict as assert} from 'node:assert';
const digest=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
const source=name=>digest(readFileSync(name,'utf8').replace(/\r\n/g,'\n'));
const prior=structuredClone(DEPTH);prior.clouds.list[9][0]=330;prior.dpr=2;prior.field.sprite=128;const oldStars=structuredClone(STARS);oldStars.dprCap=2;delete oldStars.fall;
assert.equal(digest(JSON.stringify([oldStars,prior,NOVA])),1102335767,'D10 may change that one cloud only');
assert.equal(source('depth.mjs'),324351587);
const H=FIND_PLAY.horn,values=H.paths[2].match(/-?[\d.]+/g).map(Number),mouth=[values[0],(values[1]+values[7])/2],angle=H.turn*Math.PI/180,dx=mouth[0]-H.pivot[0],dy=mouth[1]-H.pivot[1];
const bell=[H.scale*(H.lift[0]+H.pivot[0]+dx*Math.cos(angle)-dy*Math.sin(angle)),H.scale*(H.lift[1]+H.pivot[1]+dx*Math.sin(angle)+dy*Math.cos(angle))];
assert.ok(Math.hypot(...bell.map((v,i)=>(i===0?-v:v)-H.bell[i]))<.1,'D4 sound rings must start at the raised mouth');
const chart=bigMap(),pins={sea:[chart.sea.length,digest(chart.sea)],data:source('data.mjs'),trip:source('trip.mjs'),depth:source('depth.mjs'),sky:digest(JSON.stringify([STARS,DEPTH,NOVA]))};
if(process.argv.includes('--record')){
 let s=readFileSync('tools/finds-test.mjs','utf8');
 s=s.replace(/sea: \[\d+, \d+\]/,'sea: ['+pins.sea.join(', ')+']').replace(/digest\(JSON.stringify\(\[STARS, DEPTH, NOVA\]\)\), \d+/,'digest(JSON.stringify([STARS, DEPTH, NOVA])), '+pins.sky).replace(/sourceDigest\('trip.mjs'\), \d+/,'sourceDigest(\'trip.mjs\'), '+pins.trip).replace(/sourceDigest\('data.mjs'\), \d+/,'sourceDigest(\'data.mjs\'), '+pins.data).replace('Math.min(F.most * VIEW.sT','Math.min((view[4] ?? F.most) * VIEW.sT');
 if(!s.includes('D10: restore'))s=s.replace("console.log('ok: DEPTH/NOVA", "// D10: restore only the moved cloud to verify all other sky data.\nconst beforeD = structuredClone(DEPTH); beforeD.clouds.list[9][0] = 330;\nassert.equal(digest(JSON.stringify([STARS,beforeD,NOVA])),1102335767);\nconsole.log('ok: DEPTH/NOVA");
 writeFileSync('tools/finds-test.mjs',s);
}
console.log('D pins '+JSON.stringify(pins));
console.log('ok: restoring cloud 9 and F10 density settings reproduces the original sky table pin; COMB-L depth source pinned');
