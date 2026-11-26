import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,readdirSync,statSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-m',prefix='design/journey-map/';
const before=JSON.parse(readFileSync(root+'/starting-hashes.json','utf8')),changed=[],added=[];
const hash=f=>createHash('sha256').update(readFileSync(f)).digest('hex');
function walk(p){for(const name of readdirSync(p)){const file=p+'/'+name,key=prefix+file.slice(2);if(statSync(file).isDirectory())walk(file);else if(!before[key])added.push(file.slice(2));else if(before[key]!==hash(file))changed.push(file.slice(2));}}
walk('.');
// Hash keys are worktree-relative; execution here is from the journey-map folder.
const modified=[];for(const[file,h]of Object.entries(before)){const p=file.slice(prefix.length);assert(statSync(p).isFile());if(hash(p)!==h)modified.push(p);}
const allowed=['steps.mjs','cards.mjs','explore.mjs','map.css','tools/check.mjs','joined.html','dist/journey-map.html','dist/journey-joined.html'];
for(const file of modified)assert(allowed.includes(file)||file.startsWith('tools/'),'unauthorized change '+file);
for(const file of added)assert(file.startsWith('tools/')||file==='COMB-M-BUILD.md','unauthorized new file '+file);
if(existsSync('COMB-M-BUILD.md'))assert(!/[^\x00-\x7f]/.test(readFileSync('COMB-M-BUILD.md','utf8')),'report must be ASCII');
const cssBefore=readFileSync(root+'/before/map.css','utf8'),css=readFileSync('map.css','utf8');assert(css.startsWith(cssBefore));assert.equal(css.slice(cssBefore.length).replace(/\r\n/g,'\n'),'\n/* Keep markers and the bar composited as glide opacities reach one. */\n.marker-layer, .marker-layer .mk, #go { will-change: opacity; }\n');
for(const name of ['steps.mjs','cards.mjs','explore.mjs']){const a=readFileSync(root+'/before/'+name,'utf8'),b=readFileSync(name,'utf8');assert.equal(b.includes('\r\n'),a.includes('\r\n'),'line endings '+name);}
const result={modified,added,mainUnchanged:hash('main.mjs')===before[prefix+'main.mjs'],mapCssExact:true};writeFileSync(root+'/scope-results.json',JSON.stringify(result,null,2));console.log(result);
