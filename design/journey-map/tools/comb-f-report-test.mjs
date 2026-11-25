import {readFileSync,writeFileSync,existsSync} from 'node:fs';
import {strict as assert} from 'node:assert';
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g',file='COMB-F-BUILD.md';
const read=f=>JSON.parse(readFileSync(root+'/'+f,'utf8'));
const link=(f,t=f)=>'['+t+']('+root+'/'+f+')';
const latest=new Map();
for(const f of ['inherited-tests.log','tests.log'])if(existsSync(root+'/'+f))for(const m of readFileSync(root+'/'+f,'utf8').matchAll(/^## node (.*?) \(exit (\d+)\)/gm)){
 const args=m[1].trim();if(args.startsWith('--check '))continue;let key=args.replace(/^tools\//,'').replace(/ --cdp .*/, ' --cdp LOCAL');
 if(key.startsWith('comb-f-stars-test.mjs '))key='comb-f-stars-test.mjs';
 if(key.startsWith('comb-f-evidence-test.mjs '))key='comb-f-evidence-test.mjs '+(key.endsWith(' trace')?'trace':'capture');
 if(key.startsWith('comb-f-stop-test.mjs '))key='comb-f-stop-test.mjs PROFILE';
 latest.set(key,+m[2]);
}
if(existsSync(root+'/exits.jsonl'))for(const line of readFileSync(root+'/exits.jsonl','utf8').trim().split('\n')){if(!line)continue;const r=JSON.parse(line);let key=r.command.replace(/^node (?:tools\/)?/,'');if(key.startsWith('comb-f-stars-test.mjs '))key='comb-f-stars-test.mjs';if(key.startsWith('comb-f-evidence-test.mjs '))key='comb-f-evidence-test.mjs '+(key.endsWith(' trace')?'trace':'capture');if(key.startsWith('comb-f-stop-test.mjs '))key='comb-f-stop-test.mjs PROFILE';latest.set(key,r.code);}
const before=[412,1440].map(w=>read('before-trace-summary-'+w+'.json')),after=[412,1440].map(w=>read('release-trace-summary-'+w+'.json'));
const fmt=n=>(n||0).toFixed(2),intervals=r=>[r.intervals.p50,r.intervals.p95,r.intervals.max].map(fmt).join(' / ');
const cost=read('sharpness-cost.json'),pixels=read('raster-comparison.json'),popup=read('popup-measurements.json');
const allLogs=['inherited-tests.log','tests.log'].filter(f=>existsSync(root+'/'+f)).map(f=>readFileSync(root+'/'+f,'utf8')).join('\n');
const gzip=[...allLogs.matchAll(/gzip: hammer [^\n]+/g)].at(-1)?.[0]||'';
const mapGzip=[...allLogs.matchAll(/gzip: dist\/journey-map.html [^\n]+/g)].at(-1)?.[0]||'';
const joinedGzip=[...allLogs.matchAll(/gzip: dist\/journey-joined.html [^\n]+/g)].at(-1)?.[0]||'';
const tuple=r=>['stars','deep','air','nova'].map(k=>fmt(r.perFrame[k]||0)).join(' / ');
let text=`# COMB-F build record

Partial completion. The runtime/preservation suite and gzip budgets pass. Several visual-clearance, load/long-task and sharpness gates remain failed; this is not an all-pass delivery. The packed pages are ready for the separate real-browser review.

BRIEF, COMB-E, COMB-D, prior build records, part7-stopped.diff, the approved map/sketch and the named reference modules/captures informed this pass. Acceptance was the existing winding chart, thin Paper ink, branded cards and source facts, with only F's adaptations. The sliced idle label warm-up, focus/count/review behavior and protected depth source were retained. Two unsuccessful correction attempts were bounded rather than looped indefinitely.

| Item | Change, reason and result | Before/after evidence |
| --- | --- | --- |
| F0 | Removed the six stop sub-line rows from map markup. Names alone pass at eight sizes, six holds and Explore; dates remain on cards/timeline. | ${link('compare-overview-phone.png','phone pair')}, ${link('compare-overview-desktop.png','desktop pair')} |
| F0b | Kept the idle name search and E's T-grip spades/beam clip. Moved HMC1's dig mark to y288 and restored Lennard's to (228,728) for clearance. Name-to-ink and owner-distance gates still fail in Explore; no passing E1 score is claimed. | ${link('compare-explore-412.png','412 pair')}, ${link('compare-explore-360.png','360 pair')}, ${link('compare-explore-1440.png','desktop pair')} |
| F1 | Replaced wheel/swipe scrubbing and slide-back with a 250 ms gesture latch. One input starts the full move; momentum is consumed, a fresh reverse carries velocity, and Start/Set out lock scrolling. Both pages and sizes pass the browser/recording-input checks. Reduced-motion scroll remains native. | ${link('before-move-0000.png','before start')}, ${link('release-joined-move-strip.png','joined 200 ms strip')} |
| F15 | One quintic opening clock removes act-speed steps. Longer star windows, frozen stand-in source drift, live overlap-source positions and a longer traveller window remove measured darts. Final logs include the traveller and an initialized real hero after entrance. All measured distance/takeover limits pass. | ${link('release-joined-move-strip.png','after strip')}; logs below |
| F2 | Skip hidden map work under the opaque hero, skip invisible card/find work, prepare the star assignment at idle and pause glide warming during motion. Kept the hero's original partial overlap and its stop at full coverage. Observed phone p95 is much lower, but two >50 ms tasks remain. Added the guarded hero -> map scenario; did not run its launcher. | before/after traces below |
| F3 | Restored 6d71e9f's surface intervals, continuous bands, chevrons, head and held tail; retained the later calendar placement. Rest/feed clocks remain. The submerged ring still intersects the kicker/HMC words and some crossing-label views in the strict clearance check. | ${link('compare-serpent-phone.png','phone reference pair')}, ${link('compare-serpent-desktop.png','desktop reference pair')} |
| F4 | Hammer at (102,222), exactly 10 units from (112,222), with its view/hit following. Laurier's normal name moved 6 units right. D6's hammer drawing remains. Final targeted eight-size checks record no hammer clearance failure. | overview pairs above |
| F5 | Moved the two off-coast west peaks and the south-west hill; changed no other terrain. All terrain outline samples are on land; minimum measured margin is 6.58 map units. | overview pairs above |
| F6 | Restored five reference roots, including the well root, and visible Ratatoskr/Nidhogg; retained D6's canopy. Enlarged the actors and shifted Ratatoskr slightly left on the trunk. A 2.94 px canopy/diploma-note gap remains in the 844x390 beacon view. | ${link('compare-tree-phone.png','tree pair')} |
| F7 | The timeline base follows Explore's footer fade, reaches zero with the name, and returns to 1 for stops/footer/reduced motion. Rest and three-zoom checks plus opening checks pass. | Explore pairs above |
| F16 | Shaped the last route into an S using shared waypoints; Lennard's actual w35 point moved up 10 units, X stayed fixed. Dots, traveller, glides and nova use that same route. Moved Lennard's name up and its dig mark for room. X-word clearances still fail at several overview sizes; skyline margin is 2.42 px at 844x390. | ${link('compare-trail-sketch.png','sketch / held route')}, ${link('release-412x730-lennard-closed.png','phone route, card folded')} |
| F8 | Popups project drawing boxes, choose above/sides/below, aim their tails, follow the live horn pose and hide when the drawing leaves the screen. Chest focus leaves room above the drawing. Latest 60 samples are 9.00-13.54 px, but an earlier native longship phase measured 19.02 px and that motion margin is not certified. The extra camera fixture was clamped to Explore limits (zoom ratios below 1), so it does not prove the requested further zoom-in. | ${link('compare-hoard-phone.png','chest pair')}, ${link('compare-horn-phone.png','horn pair')}, ${link('popup-measurements.json','all measurements')} |
| F9 | Mirrored the horn's bell inland and moved it wholly onto the western land edge at (144,520). Its view, hit and popup follow; sound rings start at the mirrored raised bell. | horn pair above |
| F11 | Off-wayfinder taps/click-only activation clear the craft. Drags, pinches and another find's tap preserve it; the other find opens normally. Pointer bookkeeping clears on blur. | ${link('control-way-before-tap.png','selected')}, ${link('control-way-after-tap.png','after outside tap')} |
| F12 | Returned all four readings to the island near 375cd6a's positions, aimed the resting beam across land and kept its found reach at the normal length so it misses Yggdrasil. Four readings and the 12-angle native clip check pass. A kept reading still overlaps Interkom's normal label. | ${link('compare-beacon-phone.png','beacon pair')} |
| F13 | Pointer/touch no longer auto-rub; the 4 s hint and explicit rub button work. Keyboard auto-rub remains. | ${link('control-rune-waiting.png','waiting / hint')}, ${link('control-rune-explicit.png','after explicit rub')} |
| F14 | Shared a y645 water berth/path between ship drawing, focus, hit and popup. Hull samples clear both islands by >=3 units throughout. Full-rig ring/trail/label 4 px clearance and the traveller/berth relationship remain for review. | overview pairs above |
| F10 | Release SVG raster promotion at rest; stars/deep/nova use native DPR up to 3 and the depth sprite is 384. Stars and deep match fresh direct renders at three DPRs. SVG text antialiasing differs; the strict pixel comparison fails. Air stays 1x because depth.mjs hard-codes its dimensions and is protected. A <=150 ms pixel-recovery guarantee is not established. | ${link('before-1440-well-rest.png','before rest')}, ${link('before-1440-well-moving.png','before moving')}, ${link('sharpness-native-2.625-well-rest.png','native after')}, ${link('raster-comparison.json','direct-render comparison')} |

F11/F13 images are after-build interaction states, not invented before-build plays. Initial provided captures and all failed/intermediate evidence are retained. A shell encoding error was repaired before final packing.

## Measurements

Budget checks: ${gzip}; ${mapGzip}; ${joinedGzip}.

F2 frame intervals are p50 / p95 / maximum ms. These are single local runs, not a substitute for the deferred quiet-PC timing pass. Capture-tool exit 0 means acquisition succeeded, not that the long-task gate passed.

| View / CPU | Before | After | >50 ms tasks after |
| --- | --- | --- | --- |
${before.map((r,i)=>'| '+r.width+' / x'+r.cpu+' | '+intervals(r)+' | '+intervals(after[i])+' | '+after[i].long.filter(x=>x.duration>50).map(x=>x.duration+' ms').join(', ')+' |').join('\n')}

Phone p95 fell by ${(100*(1-after[0].intervals.p95/before[0].intervals.p95)).toFixed(1)}%. Main named trace totals include frame callbacks, style/layout, paint and layerization; these overlapping event totals are not additive. Remaining long tasks need finer initial map style/layout work. A lighter/cached hero leave API would also help the visible overlap (inference); the protected hero copy was not edited.

${link('before-trace-412.json','phone before full trace')} / ${link('release-trace-412.json','phone after full trace')}; ${link('before-trace-1440.json','desktop before')} / ${link('release-trace-1440.json','desktop after')}. Named costs are in ${link('before-trace-summary-412.json','before summary')} / ${link('release-trace-summary-412.json','after summary')}.

F15 at controlled 60 fps, DPR 2; moving-star medians/p95/max are stored per frame in each log. Maximum step and takeover error below include the traveller.

| View | Start max px | Wheel max px | Back max px | Worst takeover px |
| --- | --- | --- | --- | --- |
${[1440,412].map(w=>{const r=['start','wheel','back'].map(a=>read('release-stars-'+w+'-'+a+'.json'));return '| '+w+' | '+r.map((q,i)=>link('release-stars-'+w+'-'+['start','wheel','back'][i]+'.json',fmt(q.stars.max))).join(' | ')+' | '+fmt(Math.max(...r.map(q=>q.takeoverError)))+' |';}).join('\n')}

The opening stays 4.10 s forward / 2.46 s back. Adjacent moving-interval speed changes are <=3.12% / 5.24%. A valid new before-build real-hero star log is missing: early local harness runs had no initialized hero and are not used as a baseline. COMB-F's supplied preview-16 measurements remain the before evidence; no reconstructed log is presented as original.

F10 API submission ms/frame (Stars / Deep / Air / Nova), 412x730, DPR 2.625, CPU x4. Old-settings is a controlled reconstruction of F10 settings on this build, not the original snapshot. Instrumentation excludes GPU completion and is not a performance pass.

| Scenario | Old settings | Native settings |
| --- | --- | --- |
${['rest','glide','pinch','hero move'].map(s=>'| '+s+' | '+tuple(cost.rows.find(r=>r.mode==='old-settings'&&r.scenario===s))+' | '+tuple(cost.rows.find(r=>r.mode==='native-settings'&&r.scenario===s))+' |').join('\n')}

${link('sharpness-cost.json','Full canvas costs')}. At DPR 1 / 1.5 / 2.625, stars have zero changed pixels and deep has at most 1/255 channel difference against fresh direct renders. SVG crops differ in ${(pixels.rows.find(r=>r.dpr===1&&r.kind==='svg').fraction*100).toFixed(2)}% / ${(pixels.rows.find(r=>r.dpr===1.5&&r.kind==='svg').fraction*100).toFixed(2)}% / ${(pixels.rows.find(r=>r.dpr===2.625&&r.kind==='svg').fraction*100).toFixed(2)}% of pixels, maximum 84/255. Viewed crops show text antialiasing differences; this is not a full sharpness pass.

## Test changes and last exits

- Retargeted inherited fixture profiles/captures/logs to comb-f. No other build report was rewritten.
- F0 updated the name/sub-line counts and retired date-conflict/sub-line probes. X-caption checks remain. F1 replaces scrub/settle assertions with gesture-latch tests; existing carry, key, owned-drag and reduced-motion checks remain.
- F4 updates the hammer location pin; F6 replaces omitted-actor assertions. F8 accepts side-dependent popup origins. F10 updates DPR/promotion assertions while restoring old density values for the protected sky-table proof.
- Re-recorded finds-test and comb-d-pins data/trip/sea pins for authorized changes, 21 frame-render snapshots and the F16 route-dependent whirl baseline. Coast/fill and depth source stay pinned. Depth source digest is 4010889213.
- F3 drawing/ink probes check long linear bands as exact segments; off-screen drawing work is skipped. The beam raster test now clones/aims the native SVG instead of using a broken escaped replacement that produced an undefined gradient. E placement diagnostics now inspect bands, not removed humps.
- New comb-f tests cover names/cards, gestures, clock/star limits, hull/terrain, controls, popup bounds, route/skyline, native crops and costs. Setup/pin/syntax/trace/stop/suite/release/compare/report helpers confine and preserve evidence. frame-cost.mjs changed only for its new scenario and readiness wait.

All commands below are node tools/<name>. Last exits are grouped by script; capture/trace and full/focused drawing modes are distinct. Full output is in ${link('tests.log','tests.log')} and ${link('inherited-tests.log','inherited-tests.log')}, not pasted here.

| Test / tool | Last exit |
| --- | --- |
${[...latest].sort((a,b)=>a[0].localeCompare(b[0])).map(([k,v])=>'| '+k.replaceAll('|','/')+' | '+v+' |').join('\n')}

## Limits and review

The explicit file rules prevent changing the air canvas's hard-coded dimensions in depth.mjs. No workaround was made. Protected cards.mjs, join.css, hero-copy, briefs, audits, reference copies and other reports were left untouched. No git, install, external network, reviewer agent or other agent was used. Local servers/browsers were closed.

frame-cost.mjs and the comb-b/comb-c cost launchers were not run. The required pure frame-cost-test was run. COMB-D's report generator and the old setup mutator were omitted because they write protected reports or obsolete destinations. Read-only COMB-E report validation still fails against its intentionally stopped report. The inherited strict load-through-first-glide 16 ms gate also fails, despite label warm-up slices passing with no busy callbacks.

The [design-critique-loop skill](C:/Users/Admin/.codex/skills/design-critique-loop/SKILL.md) requires "Use two reviewers other than the implementer". The user's no-agent rule prevents that gate; no independent score or approval is claimed. Motion-playbook guidance was used. RTK was unavailable; network/install-based skill launchers were omitted. This permitted report holds the project record because the write boundary disallows a separate external Markdown record.

Review the failed name/ink relationships at phone and landscape overview/Explore sizes, serpent/kicker/HMC/crossing clearances, beacon reading over Interkom, X words and skyline on the final S, the ship's north berth/full rig and moving card, and real-PC zoom/rest sharpness. Browser gesture checks used dispatched wheel/touch events and CDP pinch; no physical phone or screen-reader pass is claimed. The 200 ms joined strip covers 0-4200 ms; the provided before strip stops at 4000 ms.
`;
text=text.replace(/[^\x00-\x7f]/g,'?');
if(process.argv.includes('--write'))writeFileSync(file,text);
const saved=readFileSync(file,'utf8');assert.ok(!/[^\x00-\x7f]/.test(saved),'ASCII report');let links=0;for(const m of saved.matchAll(/\]\(([^)]+)\)/g)){assert.ok(existsSync(m[1]),'missing report evidence '+m[1]);links++;}assert.ok(saved.includes('Partial completion')&&saved.includes('19.02')&&saved.includes('not a full sharpness pass'),'failed gates stated');console.log('ok: ASCII report, '+links+' existing evidence links; failed and blocked gates explicit.');
