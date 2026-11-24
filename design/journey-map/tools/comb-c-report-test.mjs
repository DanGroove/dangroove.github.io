import { readFileSync,writeFileSync,existsSync } from 'node:fs';
import { strict as assert } from 'node:assert';
const file='COMB-C-BUILD.md',raw=readFileSync(file,'utf8'),marker='\n## Test output, chronological\n';
const front=raw.split(marker)[0].split('\n## Final handoff')[0],history=raw.split(marker).slice(1).join(marker);
const section=prefix=>{const at=history.lastIndexOf('\n## '+prefix);assert.ok(at>=0,'missing '+prefix);const next=history.indexOf('\n## ',at+5);return history.slice(at,next<0?undefined:next);};
function tables(text){let page='';const rows=[];for(const line of text.split('\n')){if(line.startsWith('/journey-'))page=line.split(' ')[0];if(!/^\| .+ (timing|capture) \| \d/.test(line))continue;const c=line.split('|').map(s=>s.trim());rows.push({page,name:c[1].replace(/ (timing|capture)$/,''),frames:+c[2],p50:+c[3],p95:+c[4],max:+c[5],script:+c[8],style:+c[9],raster:c[16]});}return rows;}
const before=tables(section('before frame-cost')),phone=tables(section('final frame-cost --passes timing --scenarios 0,1,2,3,6,7,8,9')),desktop=tables(section('final frame-cost --passes timing --scenarios 6,7,8,9'));
const baseline=tables(readFileSync('C:/Users/Admin/Documents/Portfolio/journey-map-runs/glide/dense-text/frame-cost-timing.txt','utf8'));
const captureStats=section('final frame-cost --passes capture').split('\n').filter(line=>line.includes(' capture |')).map(line=>line.split('|')[18].trim().split('/').map(Number));
assert.equal(captureStats.length,8,'complete final capture pass');
const blankTotal=captureStats.reduce((sum,row)=>sum+row[0],0),captureTotal=captureStats.reduce((sum,row)=>sum+row[1],0);
assert.equal(before.length,8);assert.equal(phone.length,16);assert.equal(desktop.length,8);assert.equal(baseline.length,8);
const names=['check','steps-test','nova-test','depth-test','layout-test','explore-test','finds-test','motion-test','hammer-test','whirl2-test','frame-cost-test','frame-performance-test','frame-render-test'];
for(const name of names){const hits=[...history.matchAll(new RegExp('^## '+name+' \\(exit (\\d+)\\)','gm'))];assert.equal(hits.at(-1)?.[1],'0','latest '+name);}
const root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-c',caps=JSON.parse(readFileSync(root+'/captures.json','utf8'));
assert.ok(caps.length>1000);for(const name of caps)assert.ok(existsSync(root+'/'+name),'missing capture '+name);
const f=n=>Number(n).toFixed(2),label=r=>r.page.includes('joined')?'joined':'map';
const frameTable=['| Page / scenario | Before p50 / p95 / max ms | Final p50 / p95 / max ms | Before script / style+layout / raster ms | Final script / style+layout / raster ms | Final p95 above 33 ms |','| --- | ---: | ---: | ---: | ---: | ---: |'];
for(const old of before){const now=phone.find(r=>r.page===old.page&&r.name===old.name);assert.ok(now);frameTable.push('| '+label(now)+' / '+now.name+' | '+[old.p50,old.p95,old.max].map(f).join(' / ')+' | '+[now.p50,now.p95,now.max].map(f).join(' / ')+' | '+[old.script,old.style,old.raster].join(' / ')+' | '+[now.script,now.style,now.raster].join(' / ')+' | '+f(Math.max(0,now.p95-33))+' |');}
const glides=['| Page / glide | Dense-text p95 ms | Final p95 ms | Difference ms | No worse |','| --- | ---: | ---: | ---: | --- |'];let regressions=0;
for(const old of baseline){const now=phone.find(r=>r.page===old.page&&r.name===old.name);assert.ok(now);const pass=now.p95<=old.p95;if(!pass)regressions++;glides.push('| '+label(now)+' / '+now.name+' | '+f(old.p95)+' | '+f(now.p95)+' | '+f(now.p95-old.p95)+' | '+(pass?'PASS':'FAIL')+' |');}
const desks=['| Page / glide | Frames | p50 ms | p95 ms | max ms | script ms | style+layout ms |','| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |',...desktop.map(r=>'| '+label(r)+' / '+r.name+' | '+[r.frames,r.p50,r.p95,r.max,r.script,r.style].join(' | ')+' |')];
const captureRows=[];
for(const page of ['map','joined'])for(const size of ['1440x900','412x730','1024x600'])for(const kind of ['origin-open','origin-close','origin-reopen','card-close','card-reopen','card-close-x','x-rest','next2','explore-open','zoom-settle','wheel','pinch','card','beacon-reading']){const prefix=page+'-'+size+'-'+kind+'-',pattern=new RegExp('^'+prefix+(kind==='card'?'(laurier|hmc1|mohawk|hmc2|interkom|lennard)':'[0-9]+')+'\\.png$'),files=caps.filter(n=>pattern.test(n));if(!files.length)continue;captureRows.push('| '+prefix+'* | '+files.length+' |');}
const finalCards=section('comb-c-browser-test --film --cards-only');assert.ok(!/^FAIL /m.test(finalCards),'final card browser gate failed');
assert.ok(!/^FAIL /m.test(section('comb-c-browser-test --film --open-only')),'origin film gate failed');
assert.ok(section('final origin-check').includes('(exit 0)'),'final native origin check');
const fullRuns=[...history.matchAll(/^## comb-c-browser-test --film\s*$/gm)];assert.ok(fullRuns.length);const fullStart=fullRuns.at(-1).index,fullEnd=history.indexOf('\n## ',fullStart+5),full=history.slice(fullStart,fullEnd<0?undefined:fullEnd);assert.ok(!/^FAIL /m.test(full),'latest full film gate failed');assert.equal((full.match(/labels stay within 15% of true size/g)||[]).length,4,'native label size gate on both pages and sizes');
const handoff=`
## Final handoff

Implemented C1-C16 within the file allowlist. The latest thirteen required Node suites, native origin check, full functional film pass and final card film pass pass. Performance gates are reported separately below: ${regressions} of the eight strict dense-text glide comparisons fail. The pinch still exceeds 33 ms; the exact excess is in the table. No independent design pass or real-phone pass is claimed.

### Item record

| Item | Change and location | Check and result |
| --- | --- | --- |
| C1 | stepsNext ignores repeat Next during Dig-to-end. Repeated Back targets X until its return completes. Home/End explicitly request jumps. | steps-test: 40 repeat-key cases at 0.5/1.5/2.5 s and in blast/settle retain the 5904 ms sampled clock; two Back presses stop at X; Home/End jump. Both-page films press Next again at 1.5 s and arrive near 5.95 s. |
| C2 | exploreApply marks scripted motion, uses 0.1 px axis / 0.1% scale residuals and a 6 px/s fling floor, and signals the quiet-motion camera commit. tripApply drives opening through cam and rebases gestures outside 0.87-1.15. Labels retain displayed state, ease with FRAME_PERF.labelSettle=0.25, and have their own explicit 15% true-size bound while easing. | Fifty opening camera writes in fifty frames; seven camera rebases in a 72-frame 3x model pinch; no translation-only camera/label rewrites; <=10% settle changes. Native wheel is 1.7789x and pinch about 3x. Sharp camera commit occurs on the first sampled <0.5 px/frame frame (0 ms delay). Full gesture scale ranges, actual label-size errors and settle steps are retained in the final explore film log. |
| C3 | cardsFrame shows the same face from its first growing frame at the shield. cardsTailLayout projects the actual tilted edge and moves the card in as needed to bound the join. Inside the face, the tail hides. | First visible native frame is 16 ms and overlaps the drawn shield. 1092 projected samples plus native 16 ms close/reopen sequences retain the cap. Desktop 38 px, phone 14 px; smaller shields cap further. |
| C4 | The shadow is a sibling under the tail and face. The base is <=0.8 shield widths; length is <=1.5 widths and the rest limit. A low-alpha Paper edge runs down the two long sides and around the face. The existing tail paths now use screen coordinates, with no CSS scale, so the hairline is really 1 px. Invisible faces/shadows keep their transforms until the first opening frame, avoiding extra hidden layer writes. | Native screen CTM is identity apart from translation, with 1 px computed stroke. Close-up review caught and corrected an early CSS-scaled thick edge. Final card films and Mohawk/Interkom stills were recaptured. |
| C5 | starsFrame fades the phone traveller and its glow before the opening tail becomes visible, restoring them as it folds away. | Raw stars-canvas readback finds zero traveller-red pixels in each tail box plus 6 px, for all six cards at 412x730 and 390x844 on both pages. |
| C6 | The current stop's shield toggles locally. Close/Open names come from COPY; pointer events and Tab eligibility include the open current shield. Closure retains focus on it. | Both native pages close with the shield, retain focus, and expose the Open name; reopened keyboard cards still focus X. |
| C7 | map.css gives the existing unscaled 44 px shield target an explicit 2 px Paper outline with an Ink separator. Part 4 had already removed the 400 px scaled hit box. | Native current-shield target is 44 px; outline is 2 px at desktop and phone. Same rule applies at overview and explore. |
| C8 | FINDS beacon moves to (514,472), with view (458,482,100) and marker (532,420), above the card and clear of the first reading. Interkom waypoint and all four approved COMB.readings stay unchanged. | Native flame bounds clear shield, tail and card at both main sizes/pages; all four readings complete with the Interkom chest open. Eight-size origin/card checks retain their clearances. The first attempted relocation put one note out of beam reach and was corrected. A later 2 px desktop edge overlap was also corrected. |
| C9 | The twinkle clock remains live into and at X. During the first 0.3 s of rush, light blends to deterministic rush twinkle without sweeping its clock. | nova-test compares positions only during those first 0.3 s, then positions and light. Rest X light changes without position changes. Both-page 3 s rest films show continuing twinkle. |
| C10 | main toggles jm-nova-away throughout Dig-to-end; map.css suppresses legend words and symbols. Reduced motion is exempt. | 50 ms film samples retain at most the X's 0.15 dim value, then zero. A separate real-time legend test records zero opacity through the build and blast. The test accepts dimmed or hidden, as C10 specifies. |
| C11 | Kept COMB-A's landscape reading grid and step-bar reservation. No extra compaction was needed. | Every 844x390 card has no inner scroll. Native bottoms are about 264-294 px, above the 302 px step-bar top. Eight-size origin check passes. |
| C12 | Removed the late 11 px compact-crafts override; compact crafts and kicker are 9 px. Roomy crafts stay 11 px. | All six cards at phone sizes, 1024x600, 1280x720 and 844x390 measure 9 px and fit without scrolling, including 360x640. |
| C13 | Preserved part 4's step-bar exit fade and focus return. cardsFrame independently keeps each face and Close inert during explore, even if its visual state is cached. | Existing steps/focus tests pass; all six faces and Close controls are inert during both-page explore. Inert faces remove their case-study controls from Tab too. |
| C14 | Mini-map dots use two broad colour regions instead of four quarters. Interkom stays cream-led with a smaller coral region. | CSS and 1x desktop still comparison; six-pixel dots retain the original paint clock and colours. timeline.mjs was not changed. |
| C15 | Removed stepsCanScroll and the face touch exclusion. X rest caches its rush plan by the X camera and viewport, rather than rebuilding each star frame. | Steps/gesture tests pass; whirl2-test retains the same plan object over 30 X rest draws per configuration. NOVA.build.core is unchanged. |
| C16 | Only in explore, footer remnant wave/flare/shell rings fade with wider scale; stars bound ember reach against the existing south coast with an 8-unit margin, blending the handover during opening. | Explore zoom 1/2/3 command snapshots refreshed (nine values only). 360 coast rays are finite. The protected pre-WHIRL2 blast/remnant primitive digest still passes. Wide explore films show fading rings and settled embers confined to the X island. depth.mjs is unchanged. |

### Films and visual comparison

All captures and profiles are under ${root}. There are ${caps.length} PNG captures, listed individually in captures.json. Films are frame sequences, not MP4 files. JS advances on a controlled 16 ms clock; native Edge draws every saved frame. CSS/compositor timing remains native, so the separate real-time frame-cost runs are the timing evidence. Desktop is 1440x900 DPR 1; Dan's phone is 412x730 DPR 2.625.

For each map/joined and desktop/phone prefix:

- origin-open, origin-close, origin-reopen, card-close, card-reopen and card-close-x: 0-464 ms every 16 ms. They show the same face growing from its shield, returning and reopening, with a bounded tail. The origin series also covers 1024x600 on both pages. The final screen-coordinate edge correction recaptured the card sequences and every card still; it does not paint in the already-recorded closed-card nova/explore films.
- next2: 0-6200 ms every 50 ms. A repeat Next at 1500 ms leaves the build-up, flash, blast and settle intact.
- x-rest: 0-3000 ms every 50 ms. The sky twinkles while X waits.
- explore-open: 0-1900 ms every 50 ms, including 300 ms after the 1.6 s opening. Real line weights and label floors persist.
- wheel: three notches 50 ms apart, followed by zoom-settle 0-1800 ms every 50 ms. The latter includes more than 300 ms after motion settles.
- pinch: phone gesture samples every 25 ms (including every 50 ms) from 1x to 3x, followed by the same settle sequence. The bounded raster remains in range throughout.
- card-<id>: each of the six open cards. Additional 390x844, 360x640 and 844x390 stills cover phone tails and compact fit.
- beacon-reading-1 through -4: all readings with the chest already open, preserving part 4's placement.

Viewed the approved reference/sheet-map.jpg and reference/sheet-cards-footer.jpg, then compared the retained COMB-A desktop Interkom image with the revision at the same reading scale. The original hierarchy, card content sections, real logos, band/field system, chart density and pair composition remain. The beacon is now a separate tower beside the shield; the cream tail has one continuous face colour. Reviewed the phone Mohawk edge close-up after correcting the scaled stroke, plus opening, wheel, pinch, nova and wide-explore frames in context. No reviewer score is invented.

| Capture prefix | Count |
| --- | ---: |
${captureRows.join('\n')}

### Test changes

- steps-test: adds repeat Next at the specified rush times, blast and settle for all four keys, repeated Back, and explicit Home/End; tail probes follow the same path's screen-coordinate tip.
- nova-test: first 0.3 s replay compares positions only, as C9 permits; later replay still compares positions and light. Adds live X twinkle with fixed positions.
- finds-test: normalized trip/data source pins re-recorded only for the authorized raster/label and data changes. Final trip/data hashes are 1367940136 / 4140766664. The depth pin stays 4010889213, and coast/sea/fill guards pass.
- whirl2-test: adds rush-plan identity reuse at X. Its protected original blast/remnant SHA-256 stays e8869ea46198b38fa9b82b73e3eb74a5dd399180ad685e9f2d149c5969274c0e.
- frame-performance-test: replaces the obsolete zero-camera-writes-during-3x-zoom expectation with bounded raster rebases; adds real-camera opening, translation-only reuse and <=10% label steps. Recovery is about 0.25 s (16 sampled frames / 266.7 ms), while camera sharpness is tested separately at 150 ms.
- frame-render-test: re-records the nine explore zoom/remnant/ember snapshots. Overview, rush, blast and settle snapshots are unchanged.
- origin-check: reads the actual screen-coordinate path tip instead of assuming a transformed unit triangle.
- comb-browser: only its profile/capture root changes to comb-c. New comb-c suite/cost/browser/tail/legend/record/report tests retain outputs, drive Edge and check the requested gates. The one-time probe migration helper was removed after use.

Every test run's full output, including failed/superseded runs, is below. Early failures were a missing recording-DOM API, the deliberately changed twinkle-light pin, old digest/zero-camera-write pins, an unreachable beacon note, and the over-strict zero-opacity film assertion. One 390x844 fixture measured a remembered-closed Laurier card; it now explicitly opens it before testing the open tail, and all six then pass. Geometry and visual checks also caught the beacon overlap and thick CSS-scaled edge; both were corrected. Film output from early runs is retained; matching PNG names were overwritten by the final applicable capture pass. Syntax checks on cards/trip/browser harness passed. The first probe migration printed: "ok: tail browser probes measure the existing path, not its 1 px overflow SVG viewport". Both pack tools exited 0 on every invocation; final outputs are dist/journey-map.html ${(readFileSync('dist/journey-map.html').length/1024).toFixed(1)} KB and dist/journey-joined.html ${(readFileSync('dist/journey-joined.html').length/1024).toFixed(1)} KB, with joined.html emitted by pack-joined. No packed file was hand-edited.

### Frame cost

FRAMES scenarios 1-4, before and final, at 412x730 DPR 2.625 CPU x4. Each measurement is an isolated real-time Edge timing pass without screenshots. Costs are ms/frame. The final pinch's p95 overrun is reported rather than traded for stretched strokes.

${frameTable.join('\n')}

Four named glides against the actual saved glide/dense-text/frame-cost-timing.txt (same phone emulation). Any positive difference is a strict failure, including timer-scale differences; no gate is silently relaxed.

${glides.join('\n')}

Desktop final timing, 1440x900 DPR 1 CPU x1. The named dense-text baseline file supplies phone values, so no desktop baseline is invented.

${desks.join('\n')}

The final FRAMES capture pass recorded ${blankTotal} blank candidates across ${captureTotal} captures in all eight page/scenario rows. These are sampled connected-line checks, not proof about every physical-device frame. Their full capture-cost tables remain below and are not mixed with timing-only costs. Intermediate timing runs overlapped a short Node verification and are retained as history; the final comparison uses the final build in a separate timing-only pass.

### Limits and real-phone review

No item was omitted because it required a forbidden production file. depth.mjs, art drawings, hero-copy, other briefs/reports/audits and all other non-allowlisted files were left untouched. The standing agent/reviewer loop and network-dependent routing CLI were omitted under the explicit no-agent/no-install/no-network instructions. This report is the only project record written, as the prompt allows no separate notes folder. RTK's unavailable wrapper is recorded above.

The 33 ms pinch target is not fully met. Strict glide results are exactly as listed above. A 4x desktop emulation is not Dan's actual phone GPU. No physical phone, Safari/Firefox or screen-reader session was available. Review on the phone: continuous line weight through opening/pinch, sharp release under repeated wheel/pinch input, dark-card tail edges and focus rings, rapid close/reopen, landscape rotation while a card opens, Interkom tower/beam/readings with its chest open, three-minute X idle into Dig, repeated Next/Back during the build-up, live reduced-motion changes, and wide explore rings/embers. Review those elements together with labels, controls and neighbouring drawings.
`;
const output=front+handoff+marker+history;assert.ok(!/[^\x00-\x7f]/.test(output),'report must be ASCII');
assert.ok(/min-resolution: 2dppx/.test(readFileSync('map.css','utf8'))&&/text-rendering: geometricPrecision/.test(readFileSync('map.css','utf8')));
writeFileSync(file,output);console.log('ok: 16 item records; '+caps.length+' existing captures; 13 latest suites pass; frame tables and '+regressions+' explicit glide failures; ASCII report');
