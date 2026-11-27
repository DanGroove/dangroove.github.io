// COMB-S, 2026-11-27: original byte pins remain authoritative outside this brief.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-s',pins=JSON.parse(readFileSync(root+'/starting-hashes.json','utf8'));
const source=new Set('trip.mjs steps.mjs explore.mjs main.mjs map.css index.html art.mjs findkit.mjs finds.mjs findall.mjs findhoards.mjs findcreatures.mjs findsheets.mjs findwater.mjs findhorn.mjs cards.mjs timeline.mjs data.mjs tools/phone-fps.mjs tools/check.mjs dist/journey-map.html dist/journey-joined.html COMB-S-BUILD.md'.split(' '));
const changed=[],unexpected=[];let protectedUnchanged=0;
for(const[file,pin]of Object.entries(pins)){const f=file.replace(/^\.\//,''),hash=createHash('sha256').update(readFileSync(file)).digest('hex');if(hash===pin){protectedUnchanged++;continue;}changed.push(f);if(!source.has(f)&&!/^tools\/.*(?:test|fixture|loader)\.mjs$/.test(f))unexpected.push(f);}
writeFileSync(root+'/s-scope-results.json',JSON.stringify({changed,unexpected,protectedUnchanged},null,2));assert.deepEqual(unexpected,[]);console.log(JSON.stringify({changed,protectedUnchanged}));
