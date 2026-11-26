import assert from 'node:assert/strict';
import {readFileSync,readdirSync,writeFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {resolve,relative} from 'node:path';
const run='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l',root=resolve('../..'),base='design/journey-map/';
const hashes=JSON.parse(readFileSync(run+'/scope-before.json')),changed=[],allowed=['main.mjs','trip.mjs','explore.mjs','cards.mjs','steps.mjs','findsheets.mjs','depth.mjs','stars.mjs','join.mjs','art.mjs','footer.mjs','findkit.mjs','findhoards.mjs','findcreatures.mjs','findwater.mjs','map.css','join.css','data.mjs','tools/check.mjs','joined.html','dist/journey-map.html','dist/journey-joined.html','COMB-L-BUILD.md'];
for(const [f,hash] of Object.entries(hashes)){const now=createHash('sha256').update(readFileSync(resolve(root,f))).digest('hex');if(now!==hash){assert.ok(f.startsWith(base));const name=f.slice(base.length);assert.ok(allowed.includes(name)||name.startsWith('tools/'),f);changed.push(name);}}
const old=f=>readFileSync(run+'/before/'+f,'utf8').replaceAll('\r\n','\n'),now=f=>readFileSync(f,'utf8').replaceAll('\r\n','\n');
assert.equal(now('data.mjs').replace(/export const FRAME_PERF = .*?;/,''),old('data.mjs').replace(/export const FRAME_PERF = .*?;/,''),'all facts/art/timing outside FRAME_PERF retained');
for(const f of ['main.mjs','trip.mjs','findkit.mjs','findsheets.mjs','finds.mjs','findwater.mjs','findcreatures.mjs','findhoards.mjs','footer.mjs','join.mjs','map.css','join.css','pace.mjs'])assert.equal(now(f),old(f),f+' preserved');
assert.equal(now('cards.mjs'),old('cards.mjs').replace('c.tilt.forEach((v, j) => { c.tilt[j] = lift ? v + (target[j] - v) * cfg.ease : 0; if (Math.abs(c.tilt[j]) < cfg.flat) c.tilt[j] = 0; });','const nextTilt = c.tilt.map((v, j) => lift ? v + (target[j] - v) * cfg.ease : 0);\n    c.tilt = lift && nextTilt.every((v,j) => Math.abs(v-target[j]) < cfg.flat) ? target : nextTilt;'),'only L1 tilt changed');
assert.equal(now('steps.mjs'),old('steps.mjs').replace("SC.shown = false; SC.go.classList.add('go-leaving');","SC.shown = false; if (!SC.go.classList.contains('go-leaving')) SC.go.classList.add('go-leaving');").replace("if (!blasting) SC.go.classList.remove('go-leaving');","if (!blasting && SC.go.classList.contains('go-leaving')) SC.go.classList.remove('go-leaving');"),'only L1 class guards changed');
assert.equal(now('explore.mjs'),old('explore.mjs').replace('  const ratio = EX.cam.s / before[0];\n','').replace(/  st\.exploreSharp = [^\n]+;/,'  st.exploreSharp = false;'),'only L5 tail signal changed');
const cut=(s,a,z)=>s.slice(s.indexOf(a),s.indexOf(z,s.indexOf(a)));
for(const [a,z] of [['function depthSky','function depthMistEntering'],['export function depthLook','export function depthInvalidate'],['export const depthLift','const DP'],['export function depthBuild','// An additive hook']])assert.equal(cut(now('depth.mjs'),a,z),cut(old('depth.mjs'),a,z),'protected depth block '+a);
for(const f of readdirSync('.').filter(f=>f.endsWith('.mjs'))){const r=spawnSync(process.execPath,['--check',f],{encoding:'utf8'});assert.equal(r.status,0,f+' '+r.stderr);}
if(existsSync('COMB-L-BUILD.md')){const report=readFileSync('COMB-L-BUILD.md','utf8');assert.ok(!/[^\x00-\x7f]/.test(report),'ASCII report');assert.ok(!report.includes('RESULTS_PENDING'),'report is complete');}
writeFileSync(run+'/scope-after.json',JSON.stringify({changed,protected:'non-FRAME_PERF data; cloud code; joins; all finds; motion clocks; footer; all non-allowlist paths'},null,2));
console.log('Scope and protected rendering/input blocks pass; runtime module syntax passes.');
