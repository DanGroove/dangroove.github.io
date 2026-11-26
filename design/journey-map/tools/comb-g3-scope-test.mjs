import {readFileSync,readdirSync,writeFileSync} from 'node:fs';import {spawnSync} from 'node:child_process';import {createHash} from 'node:crypto';import {strict as assert} from 'node:assert';
process.chdir('../..');
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3',base='design/journey-map/',hashes=JSON.parse(readFileSync(root+'/before-hashes.json','utf8')),allowed=['steps.mjs','findkit.mjs','finds.mjs','findhammer.mjs','timeline.mjs','main.mjs','map.css','join.css','joined.html','dist/journey-map.html','dist/journey-joined.html','COMB-G3-BUILD.md'];let changed=[];
for(const[f,hash]of Object.entries(hashes)){const now=createHash('sha256').update(readFileSync(f)).digest('hex');if(now!==hash){const name=f.slice(base.length);assert.ok(allowed.includes(name)||name.startsWith('tools/'),name+' forbidden write');changed.push(name);}}
const normal=s=>s.replaceAll('\r\n','\n'),old=f=>normal(readFileSync(root+'/before-source/'+f,'utf8')),now=f=>normal(readFileSync(base+f,'utf8')),slice=(s,a,z)=>s.slice(s.indexOf(a),s.indexOf(z,s.indexOf(a)));
assert.equal(slice(old('findkit.mjs'),'export function showPop','export function closePop'),slice(now('findkit.mjs'),'export function showPop','export function closePop'),'cloud popup ceiling/outline');
assert.equal(old('main.mjs').slice(old('main.mjs').indexOf('let raf =')),now('main.mjs').slice(now('main.mjs').indexOf('let raf =')),'cloud main frame gates');
assert.equal(slice(old('steps.mjs'),'export function stepsHoldTop','function stepsShine'),slice(now('steps.mjs'),'export function stepsHoldTop','function stepsShine'),'loader gates');
assert.equal(slice(old('map.css'),'.go-light {','@media (max-width: 640px) { .go:not'),slice(now('map.css'),'.go-light { position: absolute','@media (max-width: 640px) { .go:not'),'shine styles/timing preserved');
let syntax=[];for(const f of readdirSync(base).filter(f=>f.endsWith('.mjs'))){const r=spawnSync(process.execPath,['--check',base+f],{encoding:'utf8'});assert.equal(r.status,0,r.stderr);syntax.push(f);}writeFileSync(root+'/scope.json',JSON.stringify({changed,syntax,protected:'all unchanged except allowlist; depth, hero-copy, data, art, trip, drawing and motion pins retained'},null,2));
console.log('Allowed source scope, cloud gates, unchanged shine styles, and '+syntax.length+' module syntax checks pass.');

