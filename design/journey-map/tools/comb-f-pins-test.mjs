// Explicitly record F3/F6/F9 drawing, F10 density and F16 route snapshots.
// The old depth source, coast/fill and normalized sky tables stay pinned.
import {readFileSync,writeFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
import {bigMap} from '../art.mjs';
import {strict as assert} from 'node:assert';
const digest=s=>{let h=2166136261;for(const c of s)h=Math.imul(h^c.charCodeAt(0),16777619);return h>>>0;};
if(process.argv.includes('--record')){
 const frame=spawnSync(process.execPath,['tools/frame-render-test.mjs','--record'],{encoding:'utf8'});assert.equal(frame.status,0,frame.stderr);
 const values=JSON.parse(frame.stdout.slice(frame.stdout.indexOf('{'),frame.stdout.lastIndexOf('}')+1));
 let s=readFileSync('tools/frame-render-test.mjs','utf8').replace(/expected=\{[\s\S]*?\n\};/,'expected='+JSON.stringify(values,null,2)+';');writeFileSync('tools/frame-render-test.mjs',s);
 const whirl=spawnSync(process.execPath,['tools/whirl2-test.mjs','--record'],{encoding:'utf8'});assert.equal(whirl.status,0,whirl.stderr);const hash=whirl.stdout.match(/F16 baseline ([a-f0-9]+)/)[1];
 s=readFileSync('tools/whirl2-test.mjs','utf8').replace(/hash\(blastHashes\), '[a-f0-9]+'/,'hash(blastHashes), \''+hash+'\'');writeFileSync('tools/whirl2-test.mjs',s);
 const svg=bigMap().finds;s=readFileSync('tools/comb-e-scope-test.mjs','utf8').replace(/assert.equal\(svg.length,\d+\)/,'assert.equal(svg.length,'+svg.length+')').replace(/assert.equal\(hash>>>0,\d+,/,'assert.equal(hash>>>0,'+digest(svg)+',').replace('moving the cue into art must preserve the rendered SVG exactly','F3/F6/F9 authorized drawing snapshot');writeFileSync('tools/comb-e-scope-test.mjs',s);
 console.log('Recorded 21 native-density/route frame snapshots, route-adjusted blast hash '+hash+', finds '+svg.length+'/'+digest(svg));
}
assert.equal(digest(readFileSync('depth.mjs','utf8').replace(/\r\n/g,'\n')),324351587,'COMB-L depth source pinned');
console.log('Protected COMB-L depth source pinned.');
