// Byte preservation of protected files, and structural preservation of unlisted data/art.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {pathToFileURL} from 'node:url';
import * as current from '../data.mjs';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-r',before=JSON.parse(readFileSync(root+'/starting-hashes.json','utf8'));
const source='findhoards.mjs trip.mjs findsheets.mjs findwater.mjs findkit.mjs finds.mjs main.mjs map.css steps.mjs explore.mjs cards.mjs data.mjs art.mjs findhorn.mjs findcreatures.mjs'.split(' '),tests='finds-test steps-test explore-test comb-b-art-test comb-q-serpent-test comb-d-readings-test comb-e-beam-test comb-d-drawings-test comb-d-beacon-probe-test comb-g2-actions-test comb-c-browser-test comb-g-layout-test comb-g-spatial-test comb-g2-spatial-test comb-l-spatial-test comb-l-spatial2-test comb-g3-interaction-test comb-g3-card-test comb-g3-press-test comb-g3-extra-test comb-d-evidence-test comb-p-quiet-test'.split(' ').map(n=>'tools/'+n+'.mjs');
const allowed=new Set([...source,...tests,'tools/check.mjs','tools/phone-fps.mjs','tools/comb-r-loader.mjs','tools/comb-r-suite-test.mjs','dist/journey-map.html','COMB-R-BUILD.md']),changed=[],unexpected=[];
for(const[f,hash]of Object.entries(before)){const next=createHash('sha256').update(readFileSync(f)).digest('hex');if(next!==hash){changed.push(f);if(!allowed.has(f)&&!/^tools\/comb-r-/.test(f))unexpected.push(f);}}
const old=await import(pathToFileURL(root+'/source/data.mjs').href),plain=m=>JSON.parse(JSON.stringify(m)),strip=m=>{const x=plain(m);for(const key of['horn','beacon','serpent'])delete x.FIND_PLAY[key];delete x.FIND_PLAY.drawings.serpent;for(const key of['beaconNotes','serpentNames','horn'])delete x.FIND_COPY[key];delete x.FIND_COPY.hints.horn;delete x.FINDS.find(f=>f.id==='horn').label;delete x.COMB.readings;delete x.COMB.hornHints;delete x.LABELS.legendAt;delete x.MARK.legend;return x;};
assert.deepEqual(strip(current),strip(old),'unlisted data changed');
const normalized=f=>readFileSync(f,'utf8').replaceAll('\r\n','\n'),art=s=>s.replace(/const horn = \(\) =>[^]*?(?=\nconst mist =)/,'<horn>').replace(/export function jormSegment\([^]*?(?=\nexport function jormSubTail)/,'<neck>').split('\n').map(line=>/legend-symbol|top \+= Object.values\(COPY.legend\)|s \+= `<rect x="23" y="(?:822|851)"|fd \+= `<g id="bc-notes"/.test(line)?'<authorized-art>':line).join('\n');
assert.equal(art(normalized('art.mjs')),art(normalized(root+'/source/art.mjs')),'unlisted art changed');
for(const[f,marker]of[['findhoards.mjs','export function findHoards'],['findsheets.mjs','export const beaconLit']])assert.equal(normalized(f).slice(normalized(f).indexOf(marker)),normalized(root+'/source/'+f).slice(normalized(root+'/source/'+f).indexOf(marker)),f+' unlisted find changed');
assert.equal(normalized('findcreatures.mjs').split('export function findSerpent')[0],normalized(root+'/source/findcreatures.mjs').split('export function findSerpent')[0],'ravens changed');
writeFileSync(root+'/scope-results.json',JSON.stringify({changed,unexpected,protectedUnchanged:Object.keys(before).length-changed.length},null,2));assert.deepEqual(unexpected,[]);console.log('Protected file hashes, unlisted data/art and other find functions unchanged');
