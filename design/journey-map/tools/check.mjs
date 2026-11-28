// Data sanity checks for the journey map. Run: node tools/check.mjs
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { STOPS, PALETTES, FINDS, FIND_COPY, COPY, ACTS, CRAFTS, MAP, STEPS, DEPTH, NOVA, STARS, C, FIND_PLAY, EXPLORE, FOOT_NAME, CARD_CLOSE, HAMMER, YGG, MARK, LABELS, WORLD, RAVEN_RIG } from '../data.mjs';
import { RUNES, bigMap, GROVE, YGG_CROWN, YGG_ROOTS, yggClear, insidePoly, outlineGap, segmentGap, JORM, TRAIL, COAST_A, COAST_B, mapLabelRows, mapLabelBox, toronto, runeWord } from '../art.mjs';
import { hammerText, hammerRuneNumber } from '../findhammer.mjs';
import { SEQ, TOTAL_P, tripState, tripResize, VIEW, labelScale } from '../trip.mjs';
import { BEATS } from '../pace.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errs = []; const ok = (c, m) => { if (!c) errs.push(m); };
const ym = v => v === 'now' ? Infinity : +v.slice(0, 4) * 12 + +v.slice(5, 7);

// six stops, spans in order
ok(STOPS.length === 6, 'there must be six stops');
ok(new Set(STOPS.map(s => s.id)).size === 6, 'stop ids must be unique');
let prevStart = -1;
STOPS.forEach(s => {
  ok(s.spans.length > 0, `${s.id}: no spans`);
  s.spans.forEach(([a, b], i) => { ok(ym(a) <= ym(b), `${s.id}: span ${i} ends before it starts`); if (i) ok(ym(a) >= ym(s.spans[i - 1][0]), `${s.id}: spans out of order`); });
  ok(ym(s.spans[0][0]) >= prevStart, `${s.id}: stops out of date order`); prevStart = ym(s.spans[0][0]);
  ok(['school', 'work'].includes(s.track), `${s.id}: bad track`);
  ok(s.crafts.every(c => CRAFTS.includes(c)), `${s.id}: unknown craft`);
  ok(PALETTES[s.palette], `${s.id}: no palette`);
  ok(s.copy.draft === true, `${s.id}: copy must be marked draft`);
  ok(s.w >= 0 && s.w < MAP.waypoints.length, `${s.id}: waypoint out of range`);
});
ok(STOPS.map(s => s.w).join() === '0,7,17,26,29,35' && MAP.xIdx === 37, 'stops must sit at W 0, 7, 17, 26, 29, 35 and the X at 37');

// palettes complete
const HEX = /^#[0-9A-Fa-f]{6}$/, PK = ['ground', 'text', 'sub', 'button', 'buttonText', 'pill', 'pillText', 'band', 'headline', 'mark', 'hairline'];
Object.entries(PALETTES).forEach(([k, p]) => { PK.forEach(f => ok(HEX.test(p[f] || ''), `palette ${k}: ${f} missing or not a colour`)); ok(/^assets\/logos\/\w+\.png$/.test(p.logo), `palette ${k}: logo`); ok(['ground', 'band'].includes(p.layout), `palette ${k}: layout`); });
Object.entries(PALETTES).forEach(([k, p]) => {
  Object.keys(p).forEach(f => ok([...PK, 'shield', 'logo', 'logoH', 'layout', 'smallWeight', 'chip', 'chipText', 'arrow', 'panel', 'panelText', 'panelHair', 'panelButton', 'panelButtonText'].includes(f), `palette ${k}: unknown key ${f}`));
  ok(Array.isArray(p.shield) && p.shield.length === 3 && p.shield.every(v => HEX.test(v)), `palette ${k}: three shield colours must be 6-digit hex`);
  if (p.smallWeight !== undefined) ok(Number.isFinite(p.smallWeight) && p.smallWeight > 0, `palette ${k}: smallWeight`);
  ['chip', 'chipText'].forEach(f => { if (p[f] !== undefined) ok(HEX.test(p[f]), `palette ${k}: ${f}`); });
  if (k !== 'lennard') ok(['smallWeight', 'chip', 'chipText'].every(f => p[f] === undefined), `palette ${k}: Lennard-only keys`);
});
const lennardExpected = { logo: 'assets/logos/lennard.png', layout: 'band', ground: '#FF4C00', text: '#FFFFFF', sub: '#FFFFFF', button: '#FFFFFF', buttonText: '#706259', pill: '#706259', pillText: '#FFFFFF', band: '#FFFFFF', headline: '#FFFFFF', mark: '#FF4C00', hairline: '#FFFFFF', smallWeight: 500, chip: '#FFFFFF', chipText: '#706259' };
Object.entries(lennardExpected).forEach(([k, v]) => ok(PALETTES.lennard[k] === v, `lennard: ${k} differs from STEPS section 12`));
ok(!/#0F151E|#1A1A1A|#000000/i.test(JSON.stringify(PALETTES.lennard)), 'lennard card must not use the old darks or black');

// eleven finds with unique ids and spoken labels
ok(FINDS.length === 11, 'there must be eleven finds');
ok(new Set(FINDS.map(f => f.id)).size === 11, 'find ids must be unique');
FINDS.forEach(f => ok(typeof f.label === 'string' && f.label.trim().length > 8, `find ${f.id}: no spoken label`));
ok(FINDS.filter(f => f.n).map(f => f.n).join() === '1,2,3,4,5,6,7', 'COMB-T, 2026-11-27: seven numbered finds including ash');
ok(FIND_COPY.hoards.length === 5 && FIND_COPY.hoards.every(h => h.title && h.label), 'five hoards with titles and labels');
ok(FIND_COPY.serpentLines.length === 3 && FIND_COPY.beaconNotes.length === 3, 'three serpent lines and three beacon notes');

// ACTS adds up
const F = ACTS.footer;
ok(F.rush + F.blast + F.settle + F.rest === ACTS.footerTotal && ACTS.footerTotal === 320, 'footer acts must add up to 320');
ok(ACTS.hero === 100 && ACTS.handoff === 120 && ACTS.overview === 70 && ACTS.pushIn === 60 && ACTS.hold === 130 && ACTS.legPerUnit === .45, 'ACTS values differ from the brief');
ok(Math.abs(SEQ.reduce((a, s) => a + s.len, 0) - TOTAL_P) < 1e-9 && SEQ.filter(s => s.kind === 'hold').length === 6, 'act sequence does not add up');

const checkStepsNumbers = (v, path) => {
  if (path === 'STEPS.heroCurve.0') ok(v===0,'F15 opening curve begins at zero');
  else if (path === 'STEPS.glide.ease') ok(v === 'cosine-ramp', 'D4 one configured glide ease');
  else if (typeof v === 'number') ok(Number.isFinite(v) && v > 0, `${path}: must be finite and positive`);
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => checkStepsNumbers(x, `${path}.${k}`));
  else ok(false, `${path}: expected a number or a table of numbers`);
};
checkStepsNumbers(STEPS, 'STEPS');
const checkDepthNumbers = (v, path) => {
  if (typeof v === 'number') ok(Number.isFinite(v), `${path}: must be finite`);
  else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => checkDepthNumbers(x, `${path}.${k}`));
};
checkDepthNumbers(DEPTH, 'DEPTH'); checkDepthNumbers(NOVA, 'NOVA'); checkDepthNumbers(STARS, 'STARS');
checkDepthNumbers(FIND_PLAY, 'FIND_PLAY');
checkDepthNumbers(EXPLORE, 'EXPLORE'); checkDepthNumbers(FOOT_NAME, 'FOOT_NAME'); checkDepthNumbers(CARD_CLOSE, 'CARD_CLOSE');
ok(!Object.hasOwn(STEPS, 'wheel') && !Object.hasOwn(STEPS, 'swipe'), 'wheel/swipe stepping tables must be removed');
ok(NOVA.flare.cap === 8 && NOVA.flare.coreMax === 1.2 && NOVA.flare.kickMax === 0.3, 'flare caps differ from EXPLORE');
ok(NOVA.gather.ring === 0.32 && NOVA.gather.swirl === 0.35 && NOVA.gather.sky === 0.5, 'gather values differ from EXPLORE');
ok(FOOT_NAME.red === C.red && FOOT_NAME.wipe.join() === '0.475,0,0.075,1' && FOOT_NAME.enter.join() === '0.23,1,0.32,1', 'footer name must copy the hero curves/red');
ok(CARD_CLOSE.hit === 44 && CARD_CLOSE.time === 0.45, 'card close size/time');
ok(COPY.explore.button === 'Explore the map' && COPY.explore.back === 'Back to the end' && COPY.cardClose === 'Close the {name} card', 'explore/card copy');
const findSlots = (v, path) => { if (!v || typeof v !== 'object') return; if (v.todo) ok(typeof v.t === 'string' && v.t.trim().length > 0, `${path}: slot needs text`); Object.entries(v).forEach(([k, x]) => findSlots(x, `${path}.${k}`)); };
findSlots(FIND_COPY, 'FIND_COPY');
ok(FIND_COPY.hoards.length === 5 && FIND_COPY.hoards.every(h => Object.hasOwn(FIND_PLAY.icons, h.kind)), 'five hoards need known piece kinds');
ok(FIND_COPY.serpentLeaves.length === 3 && FIND_COPY.serpentLeaves.every(row => row.length === 2 && row.every(t => typeof t === 'string' && t.length)), 'three serpent calendar leaves');
ok(FIND_PLAY.serpent.scale === 1 && !FIND_PLAY.serpent.spots, 'world serpent has one fixed joint');
const serpentFind = FINDS.find(f => f.id === 'serpent'), sb = FIND_PLAY.serpent.bounds; ok(serpentFind.x + sb[0] >= 22.5 && serpentFind.x + sb[2] <= 577.5 && serpentFind.y + sb[1] >= 22.5 && serpentFind.y + sb[3] <= 877.5, 'serpent head/pad inside inner frame');
ok(FINDS.filter(f => f.view).length === 9, 'nine finds have fixed camera views');
FINDS.forEach(f => ok(['hoards', 'longship'].includes(f.id) ? !f.view : f.view?.length === 3 && f.view.every(Number.isFinite) && f.view[2] > 0, `${f.id}: camera view`));
ok(FINDS.filter(f=>f.viewCap!==undefined).length===1&&FINDS.find(f=>f.id==='horn').viewCap===12,'D4 only the horn owns an extra view cap');
['mist', 'horn', 'well', 'ash', 'ship', 'all'].forEach(k => ok(FIND_PLAY[k] && typeof FIND_PLAY[k] === 'object', `Part B needs FIND_PLAY.${k}`));
ok(FIND_COPY.hammerFact.t && FIND_COPY.horn[1].t && FIND_COPY.longship.t, 'three Part B author lines have text');
ok(!FIND_COPY.norns && FIND_COPY.hints.ash && !FIND_COPY.hints.well, 'COMB-T, 2026-11-27: ash replaces the retired well answers');
ok(FIND_PLAY.mist.strokes.length === 5 && FIND_PLAY.mist.fill.endsWith('Z') && FIND_PLAY.mist.cairns.length === 3 && FIND_PLAY.mist.grid.join() === '8,4', 'B2: five ink mist layers, closed faint fill, three cairns and unchanged 8x4 wipe coverage grid');
ok(FIND_PLAY.ash.leaves.length===6 && FIND_PLAY.ash.leaves.every(l=>l.at.length===2 && l.from.length===2 && Number.isFinite(l.angle)), 'COMB-T, 2026-11-27: six place leaves');
ok(FIND_PLAY.ship.shields.length === STOPS.length, 'one longship shield per stop');
checkDepthNumbers(HAMMER, 'HAMMER');
ok(FINDS.some(f => f.id === 'hammer' && f.n === 0 && Math.hypot(f.x-112,f.y-222)<=10 && f.view.join() === '108,224,34'), 'F4 hammer place/view beside Laurier');
ok(!FINDS.some(f => f.id === 'tafl') && !FIND_PLAY.tafl && !Object.keys(FIND_COPY).some(k => k.startsWith('tafl')), 'retired board data removed');
ok(HAMMER.runes.map(r => r.key).join() === 'th,r,k,g,h,n,i,j,ei,l,d,e', 'game needs exactly the twelve approved runes');
HAMMER.runes.forEach(r => { ok(RUNES.some(row => row[1] === r.key), `unknown game rune ${r.key}`); ok(!['z', 's', 't', 'o'].includes(r.key), `excluded game rune ${r.key}`); });
ok(HAMMER.field.w === 300 && HAMMER.field.h === 400 && HAMMER.step === 1 / 120 && HAMMER.steps === 8, 'field/fixed-step geometry');
ok(HAMMER.ui.w === HAMMER.ui.fieldW + 2 * (HAMMER.ui.pad + HAMMER.ui.border), 'hammer field fits panel');
ok(HAMMER.ui.h === HAMMER.ui.header + HAMMER.ui.fieldH + HAMMER.ui.status + HAMMER.ui.buttons + HAMMER.ui.gap * 3 + 2 * (HAMMER.ui.pad + HAMMER.ui.border), 'hammer rows fit panel');
DEPTH.clouds.list.forEach((row, i) => {
  ok(row.length === 6 && row.every(Number.isFinite), `DEPTH.clouds.list[${i}]: needs six finite numbers`);
  ok([1, 2, 3].includes(row[3]) && [1, -1].includes(row[4]), `DEPTH.clouds.list[${i}]: bad drawing/flip`);
});
ok(Object.hasOwn(C, DEPTH.rings.colour), 'DEPTH.rings.colour must name a key of C');
ok(BEATS.length === 10 && new Set(BEATS.map(b => b.id)).size === 10, 'ten beats with unique ids');
BEATS.forEach((b, i) => ok(Number.isFinite(b.P) && (!i || b.P > BEATS[i - 1].P), `beat ${b.id}: P must rise strictly`));
ok(BEATS.map(b => b.id).join() === ['top', 'map', ...STOPS.map(s => s.id), 'x', 'end'].join(), 'beat ids/order differ from the brief');
for (const [w, h] of [[1440, 900], [390, 664]]) {
  tripResize(w, h, h > 800 ? 120 : 96);
  const x = BEATS.find(b => b.id === 'x').P, before = tripState(x - 1e-6).cam, at = tripState(x).cam;
  ok(['s', 'tx', 'ty'].every(k => Math.abs(before[k] - at[k]) < 1e-3), `camera jumps at the X (${w}x${h})`);
}

// Round 7 C1 acceptance gates. Text boxes use conservative analytic metrics, not browser measurements.
const c1map = bigMap();
const crownMasses = [skylineSamples(YGG.canopy).map(p=>p.map((v,k)=>v+MAP.ygg[k]))];
// Part 13b (2026-11-26): the old ash (tools/ygg-old-ash) replaces the hatched canopy. The map draws the approved drawing verbatim.
const yggBody=String(YGG.drawing).replace(/<!--[\s\S]*?-->/g,'').trim();
ok(c1map.detail.includes(yggBody)&&(c1map.detail.match(/class="yg-crown"/g)||[]).length===1,'B1 one closed connected ash canopy (the approved old ash, drawn verbatim)');
const massPoints=crownMasses.flat(),crownWidth=Math.max(...massPoints.map(p=>p[0]))-Math.min(...massPoints.map(p=>p[0])),crownHeight=Math.max(...massPoints.map(p=>p[1]))-Math.min(...massPoints.map(p=>p[1]));
ok(crownWidth>crownHeight,'B1 broad ash crown');
const yggStart=c1map.detail.indexOf('<g class="ygg"'),yggParts=['yg-roots','yg-trunk','yg-crown'].map(k=>c1map.detail.indexOf('class="'+k+'"',yggStart));
ok(yggStart>=0&&yggParts.every((v,i)=>v>yggStart&&(!i||v>yggParts[i-1])),'B1 clean forks are occluded by the foliage (roots, then trunk, then crown)');
ok((!YGG.windows||YGG.windows.endsWith('Z'))&&YGG.canopy.endsWith('Z'),'D6 closed silhouette; optional true canopy windows');
ok(!/yg-nid|yg-canopy|yg-edge|yg-hatch/.test(c1map.detail),'B1 only the old ash: no root creature, old canopy, bough edges or hatch');
GROVE.forEach((tree, i) => ok(yggClear(tree, YGG.clearance + YGG.groveReach), 'grove ' + i + ': crown/trunk/root clearance'));
const labelBoxPoints = []; for (let x = YGG.labelBox[0]; x <= YGG.labelBox[2]; x++) for (let y = YGG.labelBox[1]; y <= YGG.labelBox[3]; y++) labelBoxPoints.push([x,y]);
labelBoxPoints.forEach(p => { ok(!insidePoly(p, YGG_CROWN) && outlineGap(p, YGG_CROWN) >= YGG.labelGap, 'Yggdrasil label crown clearance'); ok(YGG_ROOTS.every(P => outlineGap(p, P, false) >= YGG.labelGap), 'Yggdrasil label root clearance'); ok(Math.abs(p[0] - MAP.ygg[0]) >= YGG.labelGap + YGG.roots[0][1], 'Yggdrasil label trunk/Ratatoskr clearance'); const h = FIND_COPY.hoards.find(h => h.id === 'hoard-hmc2'); ok(Math.hypot(p[0] - h.x, p[1] - h.y) >= YGG.labelGap + FIND_PLAY.hoard.scale * 27, 'Yggdrasil label scratch clearance'); });
// COMB-T, 2026-11-27: crown star batches are retired; leaf poses are verified by comb-t-ash-test.
// Part 13b (2026-11-26): the carved serpent's approved ribbon is wider (w 9, was 6.4). Where he surfaces, 6 units of water stay between his body and the coast; the faint dashed edges of the submerged stretches keep 5.
const jormSurfaced=u=>MAP.jorm.surf.some(([a,b])=>u>=a&&u<=b);
JORM.S.forEach((p, i) => { ok(p[0] >= 22.5 && p[0] <= 577.5 && p[1] >= 22.5 && p[1] <= 877.5, 'ring sample outside inner frame'); [COAST_A, COAST_B].forEach(coast => ok(outlineGap(p,coast) >= MAP.jorm.w / 2 + (jormSurfaced(JORM.cum[i] / JORM.L) ? 6 : 5), 'ring coast clearance')); });
const cross2 = (a,b,c) => (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
const pointBoxGap=(p,b)=>Math.hypot(Math.max(b[0]-p[0],0,p[0]-b[2]),Math.max(b[1]-p[1],0,p[1]-b[3]));
const boxCoastGap=(b,P)=>{
  const corners=[[b[0],b[1]],[b[2],b[1]],[b[2],b[3]],[b[0],b[3]]];let distance=Infinity;
  P.forEach((a,i)=>{const z=P[(i+1)%P.length];if(!pointBoxGap(a,b)||corners.some((c,j)=>{const d=corners[(j+1)%4];return cross2(a,z,c)*cross2(a,z,d)<=0&&cross2(c,d,a)*cross2(c,d,z)<=0;}))distance=0;
    distance=Math.min(distance,pointBoxGap(a,b),pointBoxGap(z,b),...corners.map(p=>segmentGap(p,a,z)));});return distance;
};
let crossings = 0; TRAIL.slice(1).forEach((b,i) => JORM.S.slice(1).forEach((d,j) => { const a=TRAIL[i],c=JORM.S[j]; if(cross2(a,b,c)*cross2(a,b,d)<0 && cross2(c,d,a)*cross2(c,d,b)<0)crossings++; })); ok(crossings === 1, 'trail must cross ring exactly once');
const T = MAP.toronto, heights = T.buildings.map(([id]) => T.facts[id] * T.k);
ok(heights[1] === Math.max(...heights) && T.facts.fcp > Math.max(...T.buildings.filter(([id])=>!['cn','fcp'].includes(id)).map(([id])=>T.facts[id])), 'Toronto tallest landmarks');
ok(T.buildings.every((row,i)=>!i||row[1]>T.buildings[i-1][1]), 'Toronto west-to-east order');
const drawnBuildings = [...toronto().matchAll(/<path class="[go]" d="([^"]+)"/g)].map(m=>m[1]);
T.buildings.forEach(([id,x]) => { const path = drawnBuildings.find(p=>Math.abs(Number(p.match(/^M([\d.]+)/)?.[1])-(id==='cn'?21.8:x))<.01); if(id==='cn')ok(toronto().includes('V-58.1'), 'CN Tower height'); else { const ys=[...path.matchAll(/(?:V|[ ,])(-[\d.]+)/g)].map(m=>-Number(m[1])); const height=id==='rogers'? (4.6+13.4)/2:Math.max(...ys); ok(Math.abs(height-T.facts[id]*T.k)<=.15,id+': height differs from metres x scale'); } });
// Sample every skyline stroke, including the dome and reflected shoreline quadratics.
function skylineSamples(path) {
  const tok=path.match(/[a-zA-Z]|[-+]?(?:\d*\.)?\d+(?:e[-+]?\d+)?/g), points=[];let i=0,cmd='',p=[0,0],home=p,last=null;
  const num=()=>Number(tok[i++]), point=(rel)=>{const q=[num(),num()];return rel?q.map((v,k)=>v+p[k]):q;};
  while(i<tok.length){if(/[a-zA-Z]/.test(tok[i]))cmd=tok[i++];const rel=cmd===cmd.toLowerCase(),C=cmd.toUpperCase();if(C==='Z'){p=home.slice();points.push(p);cmd='';continue;}const start=p.slice();
    if(C==='M'||C==='L'){p=point(rel);if(C==='M'){home=p.slice();cmd=rel?'l':'L';}points.push(p);last=null;}
    else if(C==='H'){p=[num()+(rel?p[0]:0),p[1]];points.push(p);last=null;}
    else if(C==='V'){p=[p[0],num()+(rel?p[1]:0)];points.push(p);last=null;}
    else if(C==='Q'||C==='T'||C==='C'){const a=C==='T'?(last?start.map((v,k)=>2*v-last[k]):start):point(rel),b=C==='C'?point(rel):null,end=point(rel);for(let n=1;n<=20;n++){const t=n/20;points.push(start.map((v,k)=>C==='C'?(1-t)**3*v+3*(1-t)**2*t*a[k]+3*(1-t)*t*t*b[k]+t**3*end[k]:(1-t)**2*v+2*(1-t)*t*a[k]+t*t*end[k]));}p=end;last=b||a;}
    else throw Error('unknown Toronto path command '+cmd);
  }return points;
}
for(const m of toronto().matchAll(/d="([^"]+)"/g))skylineSamples(m[1]).forEach(p=>ok(insidePoly(p.map((v,k)=>v+T.at[k]),COAST_B),'Toronto stroke outside south coast'));
for(let x=T.box[0]+6;x<=T.at[0]+T.width+4;x+=1)ok(insidePoly([x,T.at[1]],COAST_B),'Toronto shoreline outside south coast');
for(const [w,h,bar] of [[1440,900,120],[390,844,96]]) {
  tripResize(w,h,bar); const rows=mapLabelRows().filter(r=>!r.stopSub).concat([{kind:'small',unit:LABELS.small.unit,text:COPY.kicker,x:LABELS.kicker[0],y:LABELS.kicker[1],ls:1.8}],Object.values(COPY.legend).map((text,i)=>({kind:'legend',unit:LABELS.legend.unit,text,x:LABELS.legendAt[i][0],y:LABELS.legendAt[i][1]})));
  const boxes=rows.map(row=>{const k=labelScale(row.kind,VIEW.s0),floor=['name','x'].includes(row.kind)?VIEW.phone?9:10:9;ok(row.unit*VIEW.s0*k>=floor-1e-9,w+': '+row.kind+' below '+floor+' px');return{...row,b:mapLabelBox(row,VIEW.s0,VIEW.phone)};});
  const ringPx=Math.max(MARK.min,Math.min(MARK.max,MARK.k*VIEW.s0)),ringRadius=ringPx*(MARK.radius+MARK.rim/2)/MARK.box/VIEW.s0;
  const rings=STOPS.map(stop=>{const p=MAP.waypoints[stop.w];return[p[0],p[1]-(ringPx/2+MARK.stand)/VIEW.s0];});
  for(const row of boxes){
    const coast=Math.min(...[COAST_A,COAST_B].map(P=>boxCoastGap(row.b,P)))-.6/VIEW.s0;
    const ring=Math.min(...rings.map(p=>pointBoxGap(p,row.b)-ringRadius));
    ok(coast>=2,w+': D3 tier-1 coast clearance '+row.text+' '+coast.toFixed(2));ok(ring>=2,w+': D3 tier-1 stop-ring clearance '+row.text+' '+ring.toFixed(2));
    if(process.argv.includes('--label-options')&&row.kind==='name'&&row.text.startsWith('HMC')){
      let best={gap:-Infinity};for(let dx=-6;dx<=6;dx+=.25)for(let dy=-6;dy<=6;dy+=.25){if(Math.hypot(dx,dy)>6)continue;const b=row.b.map((v,i)=>v+(i%2?dy:dx)),c=Math.min(...[COAST_A,COAST_B].map(P=>boxCoastGap(b,P)))-.6/VIEW.s0,r=Math.min(...rings.map(p=>pointBoxGap(p,b)-ringRadius)),g=Math.min(c,r);if(g>best.gap)best={gap:g,dx,dy,coast:c,ring:r};}const witness=[COAST_A,COAST_B].flat().find(p=>p[0]>=row.b[0]+6&&p[0]<=row.b[2]-6&&p[1]>=row.b[1]+6&&p[1]<=row.b[3]-6);console.log(w+' bounded label search '+row.text+' '+JSON.stringify({box:row.b,witness,best}));
    }
  }
  boxes.forEach((row,i)=>{const b=row.b;ok(b[0]>=22.5&&b[1]>=22.5&&b[2]<=577.5&&b[3]<=877.5,w+': label outside frame: '+row.text);boxes.slice(0,i).forEach(other=>{const q=other.b;ok(!(b[0]<q[2]&&b[2]>q[0]&&b[1]<q[3]&&b[3]>q[1]),w+': label overlap '+row.text+'/'+other.text);});});
  const rectGap=(a,b)=>Math.hypot(Math.max(a[0]-b[2],b[0]-a[2],0),Math.max(a[1]-b[3],b[1]-a[3],0));
  const stroke=.55/VIEW.s0, crown=crownMasses.flat(), crownBox=[Math.min(...crown.map(p=>p[0]))-stroke,Math.min(...crown.map(p=>p[1]))-stroke,Math.max(...crown.map(p=>p[0]))+stroke,Math.max(...crown.map(p=>p[1]))+stroke];
  const glyphs=GROVE.map(([x,y,s,pine],i)=>({name:(pine?'caret':'tent')+' '+i,b:[x-s-stroke,y-2.7*s-stroke,x+s+stroke,y+stroke]})).concat([{name:'crown',b:crownBox}]);
  boxes.forEach(row=>{boxes.filter(other=>other!==row).forEach(other=>ok(rectGap(row.b,other.b)>=2,w+': labels need 2 units: '+row.text+'/'+other.text));glyphs.forEach(g=>ok(rectGap(row.b,g.b)>=2,w+': '+row.text+'/'+g.name+' gap '+rectGap(row.b,g.b).toFixed(2)+' '+JSON.stringify(g.b)));});
  ok(mapLabelRows().filter(r=>r.stop!=='x').every(r=>!r.stopSub),'F0: names alone on the map');
  // 2026-11-23: HMC Connections sits in the fork of its two trails with its dates above the name, HMC, again in the harbour above its pier.
  // At the stop zoom both names and date lines clear the coast by 2 units and the trail centreline by 1.5 (a dot is about 1 unit wide).
  const trailGap=b=>Math.min(...TRAIL.slice(1).map((z,i)=>{const a=TRAIL[i];let d=Infinity;for(let k=0;k<=8;k++)d=Math.min(d,pointBoxGap([a[0]+(z[0]-a[0])*k/8,a[1]+(z[1]-a[1])*k/8],b));return d;}));
  mapLabelRows().filter(r=>/^HMC|^summers|^on contract/.test(r.text)).forEach(r=>{const b=mapLabelBox(r,VIEW.sT,VIEW.phone);ok(Math.min(...[COAST_A,COAST_B].map(P=>boxCoastGap(b,P)))>=2,w+': '+r.text+' clears the coast at trip scale');ok(trailGap(b)>=1.5,w+': '+r.text+' clears the trail at trip scale');});
  const xRows=mapLabelRows().filter(r=>r.kind==='x'||r.text===COPY.xSub);ok(rectGap(...xRows.map(r=>mapLabelBox(r,VIEW.sT,VIEW.phone)))>=2,'two-line X label clears its faded sub-line at trip scale');
  // Walk actual text markup, inheriting the secondary visibility and geometric scales.
  for(const source of [c1map.detail,c1map.finds]){const stack=[{scale:1,secondary:false}];for(const tag of source.matchAll(/<\/?([\w-]+)([^>]*?)\/?\s*>/g)){
    if(tag[0].startsWith('</')){if(stack.length>1)stack.pop();continue;}
    const a=Object.fromEntries([...tag[2].matchAll(/([\w-]+)="([^"]*)"/g)].map(m=>[m[1],m[2]])),parent=stack.at(-1),kind=a['data-label'];let scale=parent.scale; if (a.class?.split(' ').includes('mk-size')) scale=17/(12.4*VIEW.s0);
    for(const m of (a.transform||'').matchAll(/scale\(([-\d.]+)/g))scale*=Number(m[1]);if(kind)scale*=labelScale(kind,VIEW.s0);
    const secondary=parent.secondary||a.opacity==='0'||(a.class||'').split(' ').includes('map-tier2');
    if(tag[1]==='text'&&!secondary)ok(Number(a['font-size'])*scale*VIEW.s0>=6-1e-9,w+': visible text below 6 px '+tag[0]);
    if(!tag[0].endsWith('/>'))stack.push({scale,secondary});
  }}
}
const way=FINDS.find(f=>f.id==='wayfinder'), screenRight=way.x-46, screenLeft=screenRight-FIND_COPY.crafts[3].length*(6.5*.56+1.2), videoRight=way.x+46+FIND_COPY.crafts[1].length*(6.5*.56+1.2);
ok(screenLeft>=22.5+4,'SCREEN frame clearance');ok(outlineGap([videoRight,way.y+2.5],COAST_B)>=10,'VIDEO coast halo clearance');
const luminance = hex => {const rgb=hex.slice(1).match(/../g).map(n=>parseInt(n,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
const contrast = (a,b) => {const x=luminance(a),y=luminance(b);return(Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
Object.entries(PALETTES).forEach(([id,p])=>{const g=p.panel||p.ground,text=p.panelText||p.text,sub=p.panelText||p.sub;ok(contrast(text,g)>=4.5&&contrast(sub,g)>=4.5,id+': small text contrast');ok(contrast(p.panelButtonText||p.buttonText,p.panelButton||p.button)>=4.5,id+': button contrast');ok(contrast(p.pillText,p.pill)>=4.5,id+': pill contrast');ok(contrast(p.headline,p.ground)>=3,id+': headline contrast');});
ok(readFileSync(join(ROOT,'map.css'),'utf8').includes('-webkit-tap-highlight-color: transparent'),'tap highlight');
console.log('ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast');

// C2 clearances use the ported rest drawing, including its wing transforms, rather than a hand-entered box.
const RG = RAVEN_RIG, RF = FINDS.find(f => f.id === 'ravens'), RP = FIND_PLAY.raven;
const rotateRig = (p, a) => { const r=a*Math.PI/180;return[p[0]*Math.cos(r)-p[1]*Math.sin(r),p[0]*Math.sin(r)+p[1]*Math.cos(r)]; };
const restRig = [RG.BODY,RG.TAILLINES,RG.LEGS].flatMap(skylineSamples).concat([RG.HEADFILL,RG.HEADOUT,RG.BILL].flatMap(skylineSamples).map(p=>p.map((v,i)=>v+RG.N[i])));
for(const [key,offset] of [['wing',[0,0]],['far',RG.farOffset]]) {const [a,sx,sy]=RG.POSES.sit[key];restRig.push(...skylineSamples(RG.WING).map(p=>rotateRig([p[0]*sx,p[1]*sy],a).map((v,i)=>v+RG.S[i]+offset[i])));}
const restLocal=RG.TREE.flatMap(skylineSamples).concat(skylineSamples(RG.TREELINES)).map(p=>p.map(v=>v*RG.TK)).concat(RG.PERCHES.flatMap((p,j)=>restRig.map(v=>[p[0]+(j?1:-1)*v[0]*RP.birdScale,p[1]+v[1]*RP.birdScale])),RP.tally.flatMap(skylineSamples));
const restMap=restLocal.map(p=>[RF.x+p[0]*RP.scale,RF.y+p[1]*RP.scale]);
let ravenCoast=Infinity,ravenMark=Infinity,ravenRegion=Infinity;
const regionBoxes=COPY.regions.flatMap(row=>{const width=row.t.length*(5.8*.56+1.6),boxes=[[row.x-width/2-1.5,row.y-5.8*.8-1.5,row.x+width/2+1.5,row.y+5.8*.2+1.5]];if(row.rune){const rw=runeWord(row.rune,3.2);boxes.push([row.x-rw.w/2-.45,row.y+2.6-.45,row.x+rw.w/2+.45,row.y+5.8+.45]);}return boxes;});
restMap.forEach(p=>{ravenCoast=Math.min(ravenCoast,...[COAST_A,COAST_B].map(c=>outlineGap(p,c)-6));ravenMark=Math.min(ravenMark,Math.hypot(p[0]-RF.mark[0],p[1]-RF.mark[1])-6.2);regionBoxes.forEach(b=>ravenRegion=Math.min(ravenRegion,Math.hypot(Math.max(b[0]-p[0],0,p[0]-b[2]),Math.max(b[1]-p[1],0,p[1]-b[3]))));});
ok(ravenCoast>=4,'raven rest drawing coast band clearance: '+ravenCoast);ok(ravenMark>=4,'raven drawing/mark 4-unit clearance (also mark 3-unit minimum): '+ravenMark);ok(ravenRegion>=4,'raven rest drawing region label clearance: '+ravenRegion);
const rb=[Math.min(...restLocal.map(p=>p[0])),Math.min(...restLocal.map(p=>p[1])),Math.max(...restLocal.map(p=>p[0])),Math.max(...restLocal.map(p=>p[1]))];
ok(rb[0]-RG.hit[0]>=3&&rb[1]-RG.hit[1]>=3&&RG.hit[0]+RG.hit[2]-rb[2]>=3&&RG.hit[1]+RG.hit[3]-rb[3]>=3,'raven hit area 3-unit padding');
const hoardTag=c1map.finds.match(/<g id="f-hoards"[^>]*>/)?.[0];ok(hoardTag?.includes('role="group"')&&hoardTag.includes('aria-label="')&&!hoardTag.includes('tabindex'),'hoards labelled group without tabindex');
const sourceC2=name=>readFileSync(join(ROOT,name),'utf8');
const flashFooter = sourceC2('footer.mjs'), flashX = flashFooter.slice(flashFooter.indexOf('const xStroke'), flashFooter.indexOf('export function footerBuild(el'));
ok(!/fx-(?:rg|og|rays|lobes|waves|flares|streaks|ringr|ring|r1|r2|core|white)\b|fxray/.test(flashX), 'animated nova classes/gradient must leave the SVG build string');
ok(/<svg id="map"[^]*?<\/svg>\s*<canvas id="nova" aria-hidden="true"><\/canvas>\s*<canvas id="stars"/.test(sourceC2('main.mjs')), 'nova canvas must be directly after map and before stars');
ok(/'ArrowLeft'.*'ArrowRight'.*'ArrowUp'.*'ArrowDown'.*'PageUp'.*'PageDown'.*'Home'.*'End'/.test(sourceC2('timeline.mjs'))&&/TL\.pending = e\.key === 'Home' \? \(TL\.rm \? -1 : 0\) : STOPS\.length - 1; jump\(TL\.pending\)/.test(sourceC2('timeline.mjs'))&&/const jump = i => \{ window\.dispatchEvent\(new Event\('jm-destination'\)\); TL\.hooks\.jump\(i\); \}/.test(sourceC2('timeline.mjs')),'timeline Home/End stop navigation');
ok(/P = stepsFrame\(ts\);\s*if \(JOIN.leave\) JOIN.leave\(P\);/.test(sourceC2('main.mjs')),'hero leave hook directly after stepsFrame');ok(/JOIN.leave = place;/.test(sourceC2('join.mjs'))&&!/JOIN.frame =[^]*?\{\s*place\(P\)/.test(sourceC2('join.mjs')),'join frame no longer writes leave');
ok(/\.jm-sheet-open \.find-hint\s*\{\s*opacity: 0;/.test(sourceC2('map.css'))&&sourceC2('findkit.mjs').includes("classList.add('jm-sheet-open')")&&sourceC2('findkit.mjs').includes("classList.remove('jm-sheet-open')"),'sheet hides find hint and close clears class');
for(const row of FIND_COPY.hammer.runes)ok(!/\{n\} (?:more )?(?:foes|hearts|neighbours|ending blows|hail shards|times)\b/.test(row[1]),'hammer numeral needs plural mark: '+row[1]);
ok(FIND_COPY.hammer.heartLost==='A heart lost. {n} heart{s} left.','heart loss singular/plural copy');
const checkHammerLine = line => { ok(!/\d\.\d{3,}|undefined|\{\w+\}/.test(line),'unformatted hammer number: '+line); ok(!/\b1 (?:more )?(?:foes|hearts|neighbours|ending blows|hail shards|times)\b/.test(line),'singular hammer count: '+line); ok(!/\b2 (?:more )?(?:foe|heart|neighbour|ending blow|hail shard|time)\b/.test(line),'plural hammer count: '+line); };
for(let r=0;r<HAMMER.runes.length;r++)for(let level=1;level<=HAMMER.runes[r].max;level++){const n=hammerRuneNumber(r,level);ok(Number.isInteger(n),'rune count must be whole');checkHammerLine(FIND_COPY.hammer.runes[r][1].replace('{n}',n).replace('{s}',n===1?'':'s'));}
// Test every numeric field independently, so a second count cannot accidentally control the noun.
for(const [key,line] of Object.entries(FIND_COPY.hammer))if(typeof line==='string'&&/\{(?:n|max|silver|foes|key)\}/.test(line)){
  const keys=[...new Set([...line.matchAll(/\{(n|max|silver|foes|key)\}/g)].map(m=>m[1]))];
  for(let mask=0;mask<2**keys.length;mask++){const values={name:'Rune',line:'Effect'};keys.forEach((k,i)=>values[k]=1+((mask>>i)&1));checkHammerLine(hammerText(key,values));}
}
for(const row of FIND_COPY.hammer.runes)for(const n of [1,2])checkHammerLine(row[1].replace('{n}',n).replace('{s}',n===1?'':'s'));
console.log('ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts');
console.log('C2 analytic rest clearances coast '+ravenCoast.toFixed(2)+', mark '+ravenMark.toFixed(2)+', regions '+ravenRegion.toFixed(2)+' map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals');

// no empty copy
const walk = (v, path) => { if (typeof v === 'string') ok(v.trim().length > 0 || /caption$/.test(path), `empty copy at ${path}`); else if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`)); else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walk(x, `${path}.${k}`)); };
walk(COPY, 'COPY'); walk(FIND_COPY, 'FIND_COPY'); STOPS.forEach(s => { walk(s.copy, `${s.id}.copy`); ok(!s.copy.piece || s.copy.caption, `${s.id}: piece without caption`); });

// module rules: unique top-level names, no default exports, no colour literals outside data.mjs
const mods = readdirSync(ROOT).filter(f => f.endsWith('.mjs')), names = {};
mods.forEach(f => {
  const src = readFileSync(join(ROOT, f), 'utf8');
  ok(!/export\s+default|import\s*\(|^\s*await\s/m.test(src), `${f}: default export, dynamic import or top-level await`);
  src.split('\n').filter(line => /^import\b/.test(line)).forEach(line => ok(/^import\s+\{[^}]*\}\s+from\s+'\.\/[\w-]+\.mjs';\s*$/.test(line), `${f}: import must be named, one line, from a sibling module`));
  for (const m of src.matchAll(/^(?:export\s+)?(?:const|let|function|class)\s+([\w$]+)/gm)) { const n = m[1]; ok(!names[n], `top-level name ${n} in both ${names[n]} and ${f}`); names[n] = f; }
  if (f !== 'data.mjs') ok(!/['"`]#[0-9A-Fa-f]{3}(?:[0-9A-Fa-f]{3})?['"`]/.test(src), `${f}: colour literal outside data.mjs`);
});
ok(!/#[0-9A-Fa-f]{3,6}\b(?![\w-]*\))/.test(readFileSync(join(ROOT, 'map.css'), 'utf8').replace(/url\([^)]*\)/g, '')), 'map.css: colour literal');

// Compressed delivery budgets include all top-level runtime modules and CSS, never hero-copy. The combined budget was
// raised from 160 to 185 KB on 2026-11-24, after part 4's 32 fixes took it to 171 KB; the packed pages' budgets below,
// which are what a visitor downloads, are unchanged.
const RUNTIME_KB = 228.2; // Part 17f (lag spikes), 2026-11-28: the compass lines drawn in the veil's canvas (tripVeil), so a press no longer redraws their svg: +1.37 KB: 228.17 KB runtime, 344.53 KB map, 591.18 KB joined. // Part 17e (lag spikes), 2026-11-28: the compass veil drawn as a canvas at the shown camera (tripVeil), so a press no longer redraws a masked screen-sized layer: +1.31 KB: 226.73 KB runtime, 343.03 KB map, 589.73 KB joined. // Part 17d (lag spikes), 2026-11-28: the compass lines cut by a clip, the idle stroke animations listed, a glide table's ends worked out once: +0.75 KB: 225.42 KB runtime, 341.78 KB map, 588.48 KB joined. // Part 17c (lag), 2026-11-28: markers and minimap moved by CSS (no SVG layout per move), the timeline's ink on its own layer, the finds' change watchers and kept last writes: +1.7 KB: 224.67 KB runtime, 340.97 KB map, 587.68 KB joined. // Part 17b (lag), 2026-11-28: closed cards hidden, stones snapped while moving, config checks every 16th frame, idle writes without read-back, hidden veil and lines and the off-screen X hit left alone, the rings' scalar path: +0.8 KB: 223.01 KB runtime, 339.35 KB map, 586.02 KB joined. // Part 17 (lag), 2026-11-28: drawing ahead in zoom-in glides, the small layers' hold check and margin, and the hidden veil's skip add 0.7 KB: 222.19 KB runtime, 338.54 KB map, 585.19 KB joined. // COMB-T review, 2026-11-27: part 15's idle-layer fixes (shown only while on screen, the beam's turn box) and the particle layer's re-show add 0.4 KB: 221.50 KB runtime, 337.89 KB map, 584.52 KB joined. // COMB-T final, 2026-11-27: 220.91 KB runtime, 337.32 KB map, 583.96 KB joined, including the moved chest's bounded hit. // COMB-T, 2026-11-27: 220.41 KB runtime, 336.86 KB standalone and 583.50 KB repacked joined; allow the requested effects and S joined refresh. // COMB-S, 2026-11-27: runtime 218.28 KB and standalone 334.53 KB; both budgets rise by 1.9 KB for this part. // COMB-R, 2026-11-27: requested layers, visits, tankards, pyre, neck and legend add 8.41 KB; its review's foam drips and phone note gap 0.37 KB more.
// // 2026-11-26: part 13 review fixes (+0.6 KB) and COMB-Q, the old ash and revision loop (+3.4 KB); 2026-11-27: edge fades on the clock, still timeline and Next fill (+0.8 KB); the pinch recheck's fixes (finds quiet while explore moves, the explore hold band, word and scrim fades on the clock, the hint and count pill fades: +1.1 KB): 204.06 KB, read with LF on every machine; the label warm-up's own path walk (pathWalk, +1.3 KB) and the sea dots drawn one path each (+0.2 KB): 206.54 KB. L5, the names, trail and finds in svgs of their own over svg#map (+1 KB): 207.51 KB. Preview 28 notes (wolves full width, the traveller clears only its path, margins and crossing labels, three art removals: +0.2 KB): 207.72 KB.
const gzipKB = content => gzipSync(content).length / 1024;
// Line endings are evened out (2026-11-27) so a checkout with CRLF on the PC reads the same sizes as the cloud.
const readLF = f => Buffer.from(readFileSync(join(ROOT, f), 'utf8').replace(/\r\n/g, '\n'));
const runtimeSources = [...mods, 'map.css'].map(f => { const src = readLF(f); ok(gzipKB(src) <= 160, `${f}: exceeds 160 KB gzip`); return src; });
const runtimeKB = gzipKB(Buffer.concat(runtimeSources)); ok(runtimeKB <= RUNTIME_KB, `combined map modules/CSS exceed ${RUNTIME_KB} KB gzip`);
const hammerKB = gzipKB(readFileSync(join(ROOT, 'hammer.mjs'), 'utf8') + readFileSync(join(ROOT, 'findhammer.mjs'), 'utf8') + JSON.stringify([HAMMER, FIND_COPY.hammer, FIND_COPY.hammerFact, FIND_COPY.hints.hammer]) + readFileSync(join(ROOT, 'art.mjs'), 'utf8').match(/const hammerMapArt[^\n]+/)[0]);
ok(hammerKB < 30, 'hammer rules/find/data/drawings exceed 30 KB gzip');
console.log(`gzip: hammer ${hammerKB.toFixed(2)} KB / 30; all map modules + CSS ${runtimeKB.toFixed(2)} KB / ${RUNTIME_KB}`);
// The joined page's budget rose from 540 to 567 KB on 2026-11-24 with the hero copy's refresh to v44 (5d2347b), which added
// 26.5 KB of the hero's own code (its loader and round 19); the map's headroom inside it stays what it was at bfc6a94.
// The map page's budget rose from 320 to 321 KB and the joined page's from 567 to 568 KB on 2026-11-27 with the pinch
// recheck's fixes and the stops hidden until placed (320.50 and 567.03 KB). The map page's rose to 322 KB the same day with the
// one-layer map (the cover under svg#map, the Next fill redrawn in place and the legend marker without a fade): 321.27 KB.
// Both rose again the same day with the label warm-up's own path walk (pathWalk) and the sea dots drawn one path each: 322.86 and
// 569.37 KB. Both rose again with L5 (the names, trail and finds in svgs of their own over svg#map): 323.87 and 570.39 KB.
// 2026-11-27: the joined page repacked with COMB-R in the cloud (Codex left it, since pack-joined also writes joined.html): 578.89 KB.
// 2026-11-27, COMB-R review: the tankards' foam drips and the phone note gap add about 0.2 KB to each page.
for (const [file, budget] of [['dist/journey-map.html', 344.6], ['dist/journey-joined.html', 591.2]]) {
  if (!existsSync(join(ROOT, file))) continue;
  const kb = gzipKB(readLF(file)); ok(kb <= budget, `${file}: exceeds ${budget} KB gzip`); console.log(`gzip: ${file} ${kb.toFixed(2)} KB / ${budget}`);
}

if (errs.length) { console.error('FAIL\n' + errs.map(e => ' - ' + e).join('\n')); process.exit(1); }
console.log(`ok: 6 stops, ${Object.keys(PALETTES).length} palettes (Lennard band verified), 11 finds, acts total ${TOTAL_P.toFixed(1)} vh, ${mods.length} modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; ${DEPTH.clouds.list.length} cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, ash leaves, fog, shields, hammer rows and approved runes valid`);
