// Build the sole allowed Markdown record, retaining every accumulated formal log.
import {readFileSync,writeFileSync,readdirSync,existsSync,appendFileSync} from 'node:fs';
import {strict as assert} from 'node:assert';
const file='COMB-D-BUILD.md',root='C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g',marker='<!-- COMB-D LOG -->';
let raw=readFileSync(file,'utf8');if(raw.includes(marker))raw=raw.slice(raw.indexOf(marker)+marker.length).trimStart();
const latest=new Map();for(const m of raw.matchAll(/^## node (.*?) \(exit (\d+)\)/gm))latest.set(m[1].trim().replace(/--cdp\s+ws:\S+/,'--cdp LOCAL'),Number(m[2]));
const link=(name,label=name)=>'['+label+']('+root+'/'+name+'.png)';
const overview=(id)=>[412,1440].map(w=>{const h=w===412?730:900;return link('before-'+w+'x'+h+'-overview','before '+w+'x'+h)+' / '+link('final-'+w+'x'+h+'-overview','after '+w+'x'+h);}).join('; ');
const pair=(before,after)=>[412,1440].map(w=>{const h=w===412?730:900;return link('before-'+w+'x'+h+'-'+before,'before '+w+'x'+h)+' / '+link('final-'+w+'x'+h+'-'+after,'after '+w+'x'+h);}).join('; ');
const table=[...latest].filter(([s])=>!s.startsWith('--check')).sort(([a],[b])=>a.localeCompare(b)).map(([s,c])=>'| `node '+s+'` | '+c+' |').join('\n');
let head=`# COMB-D build and review record

This is not an all-pass COMB-D completion. The implementation and packed pages are reviewable, but the D1 spatial gates and D2 hoard-to-date clearances remain failing. The latest D1 first-second timing run passes all eight cases. Do not treat the passing preservation suite as acceptance of the remaining visual defects. Detailed failed results are retained below.

## Acceptance and preserved evidence

The acceptance criteria were recorded before editing in the original log below. BRIEF.md, COMB-B.md, COMB-B-BUILD.md, COMB-D.md, the approved sheet-map.jpg, AUDIT-R2.md and the relevant COMB-C/GLIDE intent were read. The reference's useful structure is the winding journey, labels tied to stops, a restrained hierarchy of words, thin Paper line work, repeated small glyphs, quiet regions and Red reserved for the work and markers. This pass preserves that structure and Dan's source copy.

The original/template and both phone/desktop renders were compared at overview and close view. Self-check categories were subject recognition, line craft and repetition, contrast, alignment, proximity, context with labels/coast/trail, motion continuity, card floors, and protected content. No numerical design scores or independent approval are claimed.

The preservation suite passes NOVA and WHIRL2, including NOVA's pinned trail run into the X during the build-up and the sea's map place. Those tests were not edited. The original coast/fill and depth-source pins remain; the allowed one-cloud change has its separate restoration proof below.

The [design-critique-loop skill](C:/Users/Admin/.codex/skills/design-critique-loop/SKILL.md) says, "Use two reviewers other than the implementer with complementary visual and integrity scopes." The user's explicit ban on all agents takes precedence. That independent gate is incomplete. UI routing, Impeccable polish/craft and motion-playbook guidance were also read. Launchers that could download or write outside the allowlist were omitted. RTK was unavailable; its attempted invocation returned CommandNotFoundException. No install was attempted.

## D1 - Explore labels and the X grove

Removed the two-line explore substitutions. Names remain one line. Placements are warmed in idle tasks at load/font/resize boundaries; Explore's input handler no longer measures or searches. The cache samples geometry along stroke lengths, excludes invisible hits and hidden internal parts, accounts for trail/coast ink and ticks, and derives find geometry from the actual SVG. It does not use the old hand-listed find boxes. Name offsets are inside the existing scaled label group, anchored to their own stop. A constrained fallback keeps the name in the frame and near its owner when the ink search cannot satisfy every condition. Sub-lines stay below their own name and use an elapsed 0.2 s opacity fade. The only added animation work is that opacity fade; no layout reads or new placement loop runs per frame.

The five X-side grove trees moved left and up off both lines of work text; the audited B8 pair spacing and tree count remain. The X words retain Red and their association with the X.

Incomplete: HMC Connections, Mohawk and HMC, again still have recorded ink collisions at some sizes/zooms. Some HMC sub-lines never find a valid threshold. The failed D1 and inherited B11 tests remain red. Earlier first-second renderer traces exceeded 16 ms; diagnosis showed style/layout/paint costs rather than on-press placement search. Grouping shore-dot paths reduced those costs without adding animation work. The final first-second run passed both pages at all four sizes, with maxima from 9.719 to 14.293 ms. A trial involving compressed lettering and harbour/pit nudges was removed after it failed other constraints and weakened the original relationships. The supplied normal date labels, trail, coasts and other find placements were kept. This is an unresolved implementation result, not a claim that the specification is impossible.

The controlled-clock opening check additionally finds labels/sub-lines crossing the Nova core, coast or hoard ink during the opening, and actual text-box drift above 2 px after camera normalization. That box measurement includes changes from the text floors; visual review should distinguish smooth resizing from an abrupt jump. The zero anchor-drift result alone is insufficient. The new canvas sampling also catches X sub-line collisions at some intermediate explore zooms. These are unresolved D1 failures, not passing evidence.

The D1 tests cover both packed pages, all four requested sizes, rest plus three zooms, opening samples every 100 ms, one-line form, frame/owner distance, visible sub-lines, ink/ticks/markers/shields and idle writes. The X proximity test uses a conservative subset of the protected remnant's diagonal strokes. The ink sampler also checks the live Nova canvas's red/white stroke cores at alpha 160/255 or above; soft glow is excluded. The separate controlled-rAF test measures actual visible text-box motion and ink during the opening, including the transition from the end view, without contaminating the timing trace with measurement work. Consult its recorded failures; unchanged label-anchor coordinates alone do not prove text continuity.

Explore pairs: ${[412,360,1440].map(w=>{const h=w===412?730:w===360?640:900;return link('before-'+w+'x'+h+'-explore-0','before '+w+'x'+h)+' / '+link('after-journey-map-'+w+'x'+h+'-explore-0','after '+w+'x'+h);}).join('; ')}. All rest/zoom captures on both pages are listed in the inventory.

## D2 - Dirt marks

Replaced the scalloped mound and curl with one smooth earth arc on a short ground line, a standing spade with grip and sunk blade, and three separate clods. The five pit positions, explicit hit circles, digging stages, chests and lid animation remain unchanged. This is the same shared drawing at all five hoards.

Incomplete: the 4 px check still finds normal-date collisions near Laurier, HMC and Lennard at the sizes recorded below. The trial foreground displacement of the cue was restored so the marker, pit and hit geometry stay together. No change to those protected normal date placements or hoard locations was made to force a pass. At 1024 x 600, Laurier's date box grown by 4 px covers the entire authored dig circle, while Lennard leaves only a 1.4 px top strip. The separate 44 px runtime target is unchanged. The conflict diagnostic records those native boxes. This makes a displaced cue a pit/hit tradeoff, not a clean clearance fix.

${overview()}. Close-up: ${pair('hoard-hmc1','dig-close')}.

## D3 - Serpent

Each surfaced stretch is a short, closed, constant-width band with blunt submerged feet, a back outline, short scale ticks inside the band and broken waterlines. Its rise is about one part to 2.5 parts length. The neck is also a closed band; the held tail tapers at its last part into a small fin. The two surfaced intervals beside SEA OF REVISIONS and KERNING NARROWS were moved along the unchanged ring after the expanded check found those region collisions. The calendar and waterline moved below and left of HERE BE DEADLINES. The ring path, feed clocks, leaves, head action and explicit hit rectangle remain.

${overview()}. Close-up: ${pair('serpent','serpent-rest')}.

## D4 - Horn on the shore

Moved the horn to (115, 520), enlarged its drawing to 1.15, and aimed its mouth west toward the water. The sound rings now start at the raised mouth. Its (125, 502, 42) view has a named, horn-only cap of 12; the extra cap does not propagate through the other find-view arrays. Shore dots keep their seeded positions and are now round, non-scaling stipple rather than magnified discs. The popup anchors beside/below the horn. The drawing and existing hit group move together; the small horn has no numbered marker.

The 1,072 shore dots are batched into 206 paths with identical coordinate, width and opacity tuples. Same-path dots are at least 32 world units apart. The native isolated raster check records antialiasing differences, not pixel identity: at most 0.281 percent of pixels differ, with maximum channel difference 8/255, below GLIDE's documented 0.5 percent pixel budget. Phone overview and close-view before/after dot captures were inspected; stipple density and individual-dot scale remain consistent. The first added test used an unnecessarily strict 1-channel/0.05-percent threshold and failed; that run is retained, and the test now uses the existing documented budget. This is a static drawing optimization, with no frame-loop work.

The evidence test checks the unfound horn's width as well as the raised horn, popup overlap, sounded state and lasting ink. The exact shares are in its output. Both phone and desktop are above one fifth, with no body/popup overlap.

${overview()}. Close-up: ${pair('horn','horn-popup')}. Current unfound/found pairs: ${[412,1440].map(w=>{const h=w===412?730:900;return link('final-'+w+'x'+h+'-horn-rest','unfound '+w)+' / '+link('final-'+w+'x'+h+'-horn-found','sounded '+w);}).join('; ')}.

## D5 - Mjolnir

The broad head now rests on its stone. The short handle rises from it, with a band and an end loop. The lasting scored sign is on the head. Moved the stone/find/view together to (110, 288), below Laurier's date line; the hit geometry is unchanged. The eight-size test checks every visible map label and closest views.

${overview()}. Baseline / current close: ${pair('hammer','hammer-rest')}. Current unplayed/played pairs: ${[412,1440].map(w=>{const h=w===412?730:900;return link('final-'+w+'x'+h+'-hammer-rest','unplayed '+w)+' / '+link('final-'+w+'x'+h+'-hammer-found','played and closed '+w);}).join('; ')}.

## D6 - Ash and well

Removed the book-shaped canopy windows, kept the limbs behind the canopy's filled outline, cleaned the right fork and replaced the bunting-like underside with one irregular leafy edge. The silhouette, crown footprint, eagle, trunk, roots and omitted tiny-actor hooks remain. Moved the two well-label baselines to (360, 424) and (360, 431), clear of the rings and river rather than merely below the water. The test samples the bank and active rings as well as the ash.

${overview()}. Close-up: ${pair('well','well-rest')}. The silhouette and named-grove studies are in the inventory.

## D7 - Mist cairn

Moved only the top cairn from (138, 418) to (195, 424), clear of Mohawk's date box. The other two cairns, mist drawing, wipe mask and interaction remain. The expanded eight-size check includes the cairns at overview and the reachable close views.

${overview()}. Close-up: ${pair('mist','mist-rest')}.

## D8 - Coast beacon

The tower now stands at (516.4, 425.5) on Interkom's coast. A slimmer tapered stone body, three masonry courses and a compact rock foot keep its ink off the trail and clear of the Interkom card pair. The fire basket remains the beacon's recognizable top; the scaled fire levels keep the resting found flame clear of HMC's date line. Its flame pivot, glow, beam origin, view, marker and four readings moved with it. Resting aiming is bounded at 8 degrees with a 0.5-degree sweep, including after all four notes are read; manual aiming and snap-to-unread behavior remain. The four notes sit outside the resting cone and remain reachable.

The critical-size probe records tower/trail and card/shield/tail gaps. The eight-size drawing check records resting beam intersections. Both phone and desktop evidence walks read all four notes. The source hit rectangle is unchanged inside the translated group.

${overview()}. Baseline / new view: ${pair('beacon','beacon-rest')}. Interkom card: ${pair('interkom-card','interkom-card')}. The 360 x 640 card capture is ${link('final-360x640-beacon-interkom','here')}.

## D9 - Phone card seam

WORLD.card.phoneBottom is 0 instead of 6. Every phone card ends at the step bar. The existing face CSS already has square bottom corners; the phone shadow now follows those corners. map.css, including its dense-screen text rule, was not edited. The ORIGIN audit and three-phone/all-six-card checks retain the type floors and report no inner scrolling. Subpixel seam error is recorded rather than hidden.

${link('before-412x730-interkom-card','before phone seam')} / ${link('final-412x730-interkom-card','after phone seam')}.

## D10 - One cloud

Moved DEPTH.clouds.list[9]'s x from 330 to 900, retaining its y, size and all motion values. That cloud at y 935 was the one peeking below the phone's top-return control. It now stays outside the phone view. The cloud count is unchanged. The test restores only this x to 330 and reproduces the original combined STARS/DEPTH/NOVA digest, proving that the other sky data remain intact. depth.mjs retains digest 4010889213.

${link('before-412x730-explore-0','before cloud')} / ${link('final-412x730-explore-0','after cloud')}.

## Tests changed or added

- check.mjs: D5's new hammer place/view, D6's optional canopy windows, and a check that only the horn owns the extra cap. Budgets were not raised.
- finds-test.mjs: re-recorded the D3 body/D4 stipple sea digest, authorized data/trip digests and D10's combined sky digest; added the one-cloud restoration proof. The expected focus calculation recognizes only the named horn cap. Protected fill, coast and depth-source pins remain.
- comb-b-browser-test.mjs, comb-b-detail-test.mjs, comb-b-layout-test.mjs and comb-b-suite-test.mjs: profiles/captures/report writes redirected to the permitted D paths. The well/hammer scale probe uses their new 192-unit x separation; the south-grove study follows its new center. B11 uses the D1 ink sampler and 2 px requirement. The suite omits the prohibited cost entry points even from syntax-only enumeration.
- comb-d-browser-test.mjs: local Edge/CDP fixture, DPR 2 captures, bounded profile/cache/crash paths, event collection and cleanup.
- comb-d-layout-test.mjs and comb-d-ink-test.mjs: both-page D1 geometry, 100 ms opening samples, fade intermediates, zero idle label writes, native stroke sampling, visible coast ticks, markers, shield occupancy and live Nova stroke cores. Failures remain visible.
- comb-d-opening-ink-test.mjs and comb-d-clock-test.mjs: every 100 ms on a controlled product rAF clock, on both pages at all four sizes, including visible end-view text continuity, frame/owner distance and rendered ink. The initial virtual-time-only driver did not reliably advance rAF or make the map visible, and counted hidden label-box movement; its run is retained but is not valid acceptance evidence. The corrected driver advances six existing product frame callbacks per sample, excludes hidden boxes and requires a visible map at rest. Product files are unmodified. Measurement time cannot inflate the separate opening timing trace.
- comb-d-drawings-test.mjs: each of five dirt marks separately, D3-D8 drawing strokes versus map labels at eight sizes, every reachable find view, coast-beam intersections, Interkom pair clearance and all phone card floors.
- comb-d-beacon-probe-test.mjs: critical-size trail and Interkom clearance, native shield hit testing, and a real 360 phone card capture.
- comb-d-readings-test.mjs: after-all-four resting-beam sweep endpoints against kept reading labels and shields; it also checks normal-map note/stop-label overlap.
- comb-d-opening-test.mjs: only the first second of Explore, with renderer RunTask slices and a strict 16 ms gate. This does not import or run the deferred frame-cost driver.
- comb-d-evidence-test.mjs, comb-d-capture-test.mjs and comb-d-opening-capture-test.mjs: before/after evidence, unobscured unfound map views, found signs, four readings, horn framing/overlap, and animation-clock captures.
- comb-d-pins-test.mjs: explicit pin recording with the protected depth and original-sky restoration assertions.
- comb-d-origin-test.mjs and comb-d-suite-test.mjs: existing read-only ORIGIN on a permitted profile and full ASCII test output retention.
- comb-d-conflict-test.mjs: native normal-date and authored pit-hit bounds, with the unchanged 44 px runtime target noted. This is diagnostic, not a clearance pass.
- comb-d-stipple-test.mjs: exact pre-batch dot tuples plus native isolated raster comparisons at five viewport/scale combinations, using the existing GLIDE pixel-difference budget. It saves both images and reports actual differences.
- comb-d-label-probe-test.mjs: in-memory diagnosis of rejected candidates; no product-file changes or acceptance verdict.
- comb-d-report-test.mjs: this record, capture/link checks and ASCII verification.

## Latest recorded test exits

Earlier failed and superseded runs are retained after the log marker. The table is the last recorded exit for each command, not a claim that all acceptance gates pass.

The failed opening --diagnose command predates shore batching. The later full eight-case opening trace is the current timing result and passes; the separate opening-ink command remains failing.

| Command | Exit |
| --- | --- |
${table}

## Limits and review handoff

D1 and D2 remain open as described above. Review the stop-label ink collisions, missing HMC sub-lines, opening text-box motion and Nova/core collisions, normal-date/hoard clearances, and the new coastal tower in an actual browser. Then judge the mound/spade recognition, serpent's body and fin, crown underside and well labels both alone and in the whole chart. Passing geometry is not a visual-quality score.

The user explicitly prohibited frame-cost.mjs and its comb-b/comb-c cost launchers. They were not run. The required pure frame-cost-test.mjs was run. The full quiet-PC timing pass remains for the next part. The D1-only first-second trace has its own recorded result, including any over-16-ms failures; it does not substitute for that timing pass.

The independent critique gate and an external project-notes file were omitted under the explicit no-agent and write-path rules. This allowed report carries the project decisions instead. No git, install, external network, other brief/report/audit edits, depth.mjs, join.css or hero-copy changes were made.

Before-capture limitations: the initial real-time PNG loop included encoding latency, so its nominal opening filenames are not exact 100 ms samples. Early CDP virtual-time samples were also insufficient to control rAF. The final opening-clock sequence advances the product's own frame callbacks at 60 fps, pauses them during encoding, and records actual callback-clock times at 100 ms intervals. The original unobscured hammer close-up and a verified original sounded-horn found state are incomplete. Current unfound/found close views are verified. Do not treat those baseline omissions as passing evidence.

The evidence walk exposes the existing focus API only in an in-memory copy of the packed map, so the map object can be inspected before a sheet opens. The saved product has no such test hook. The separate layout checks open the actual packed pages directly.

Formal test and capture-run output is retained below, including failures. Early non-asserting live-box/inspection probes were printed to the session but their entire transient stdout was not retained; the final asserting runs and final evidence are retained. That is a report-completeness limitation, not an omitted failure.

## Capture inventory

All captures below are in the authorized comb-d folder. Main before/after shots use DPR 2. Explicit dpr1 game compatibility shots are labeled. The pre-final copies retain the earlier failed revisions. study-* and d-compat-* files are development/compatibility evidence, not substituted final approval.

`;
function caption(name){
 if(name.includes('stipple'))return 'Isolated shore stipple before/after exact-style path batching; see the raster difference metrics.';
 if(name.includes('hoard-date-conflict'))return 'Normal date boxes and authored pit-hit geometry at 1024 x 600; see the diagnostic coordinates.';
 if(name.includes('opening-clock'))return 'Exact animation-clock opening frame; PNG encoding occurs with time paused.';
 if(name.includes('opening-'))return 'Real-time opening sample; use logged actual timing rather than the nominal filename.';
 if(name.includes('explore-'))return 'Explore rest or one of three reached zooms; consult the associated failed/passing geometry records.';
 if(name.includes('overview'))return 'Whole-chart context for drawings, stop ownership, labels, coast and trail.';
 if(name.includes('horn-found'))return name.startsWith('before')?'Baseline raised state is not a verified sounded state.':'Sounded horn, returned to rest with its lasting scoring.';
 if(name.includes('horn-popup'))return 'Raised horn and popup; body and mouth remain unobscured.';
 if(name.includes('horn-rest'))return 'Current unfound horn and shore in its own view.';
 if(name.includes('hammer-found'))return 'Game was started and closed; lasting head marks remain.';
 if(name.includes('hammer-rest'))return 'Unplayed map hammer, head on the stone, handle up, no sheet over it.';
 if(name.includes('interkom-card')||name.includes('beacon-interkom'))return 'Open Interkom card, shield, tail, coastal beacon and phone seam.';
 if(name.includes('beacon-read'))return 'All four beacon notes reached and read.';
 if(name.includes('beacon'))return 'Coast tower, beam and its relationship to nearby ink.';
 if(name.includes('well'))return 'Ash underside, limbs, roots, bank and well-label setting.';
 if(name.includes('serpent'))return 'Head, calendar, neck band and nearest surfaced body.';
 if(name.includes('mist'))return 'Ink mist and cairn placement beside the date line.';
 if(name.includes('dig')||name.includes('hoard'))return 'Mound/spade cue and treasure context in a reached view.';
 if(name.includes('grove'))return 'Named grove pair at reached maximum zoom; south study follows the relocated trees.';
 if(name.includes('silhouette'))return 'Canopy silhouette study, with inner strokes hidden only for this capture.';
 if(name.includes('shield-wall'))return 'Unchanged game-cell shield rims, including the explicitly named DPR 1 study.';
 if(name.includes('found-overview'))return 'Returned map with lasting find signs.';
 return 'Preservation or before/after context from the named beat/state.';
}
const captures=readdirSync(root).filter(n=>n.endsWith('.png')&&/^(before-|final-|after-journey-)/.test(n)).sort();
for(const n of captures)head+='- ['+n+']('+root+'/'+n+'): '+caption(n)+'\n';
head+='\n'+marker+'\n\n';
const report=(head+raw).replace(/[^\x00-\x7f]/g,'?');writeFileSync(file,report);
assert.ok([...report].every(c=>c.charCodeAt(0)<128),'report must use ASCII punctuation/text');
let links=0;for(const m of report.matchAll(/\]\((C:[^)]+)\)/g)){assert.ok(existsSync(m[1]),'missing evidence '+m[1]);links++;}
assert.ok(captures.length>60,'capture inventory incomplete');
const summary='ok: ASCII report; '+links+' existing local evidence links; '+captures.length+' inventoried captures; failures and limitations stated';
console.log(summary);appendFileSync(file,'\n## node tools/comb-d-report-test.mjs (exit 0)\n\n```text\n'+summary+'\n```\n');
