# Journey hero, second take

This is the unpublished prototype. `CORRECTIONS-4.md` controls this revision; `CORRECTIONS-3.md`, `CORRECTIONS-2.md`, `CORRECTIONS-1.md`, `MOTION-2.md` and `MOTION.md` supply the retained rules. The allowed range is 70–86 seconds. Groups align on world x 0.200; waits never click. The loop is **81.240 seconds at PACE 1**. Every document opens empty and is built by one cursor. Round 4 has computed Node evidence for all five InDesign drags. The current browser checker covers ten sizes; browser frames, rendered shadows and pixel still comparisons remain for the external machine. No browser command was run for round 4. The committed hardware reports measure the incoming `48aea47` build; no hardware rerun was made for rounds 3 or 4.

## The design being carried forward

The approved six stills and the earlier browser review are the reference. The screen stays large and detailed enough to read as a real app. Its rails, panel hierarchy, document proportions, square corners, Outfit, ink, paper and red stay. The flyer's landscape pages keep their black, charcoal, two golds, woven grounds, asymmetric photographs and dense map structure. The firm's mark and the building's mark are blobs. No contact details or names from the source flyer are included.

Graphic design is one pipeline: Photoshop's photograph goes to the dock; Illustrator's two maps join it; InDesign places those same assets into the spread, cover, post and e-blast. Only the finished InDesign group reaches the floor. A closed stack sits behind the reading copy, alongside a phone and tablet. The reading copy still bends through fourteen strips per leaf, through The Offering, Location, Amenities and the gallery.

Video and motion retain their landscape tablet and two phones. UX/UI uses an open laptop facing world +x, a portrait tablet and one phone. Every complete footprint, including the laptop deck and lid, is centred on `SCREEN.l + SCREEN.w / 2` in world x. The light pool shares that middle. The slot remains the undrawn plane at `MAT.z`; only the laptop enters in x, whole and unclipped, from 1.6 units to its left. All returns use the shared z withdrawal.

| Middle | World x |
| --- | ---: |
| Screen | 0.200 |
| InDesign block | 0.200 |
| Premiere Pro row | 0.200 |
| After Effects row | 0.200 |
| Figma row | 0.200 |
| Light pool | 0.200 |

The prior build was reviewed in Chromium on 19 November 2026, with held frames on desktop and phone, a pixel comparison of its stills, and an offline preview checked for requests. The second pass was then reviewed in a real browser: stacked pictures flickered, the comp's construction was hidden, typing was too fast, and Photoshop needed clearer, better-paced edits. Those findings are the evidence for this correction. The corrective revision was then reviewed the same way on 19 November 2026 (Chromium with software rendering): held frames at each corrected moment (Photoshop's sky, both healed distractions and the graded photo; Premiere Pro's typed caption; After Effects' typed words; the playing devices of the last three apps) show no flicker, ghost or garbled text; a film of the whole loop reads cleanly; and the offline preview runs at desktop and phone size with no requests and no errors. The committed hardware runs below measure incoming `48aea47`; they do not measure round 3. **Still unmeasured:** phones, Safari and Firefox.

## What runs the show

- `stage.mjs`: PACE, the action scheduler, six scripts, shell, dock, floor and shared finished-piece players. `SHOW`, `LOOP`, `sceneAt`, `frameAt`, `SCENES`, `CRAFT`, `BLOCK`, `SCREEN`, `MAT` and `floorAt` keep their meanings. `SCRIPTS` exposes the derived action times for checks and review; `POOL` supplies the light's centre.
- `art.mjs`: the approved pictures, staged photograph and map drawings, opaque text prefixes, measured text regions and device chrome. Fonts are measured when the atlas is made, including rotated map lettering. The atlas occupies five pages, each no larger than 2048 square.
- `sq.mjs`: the existing WebGL2 renderer. A carried InDesign stack's colour lift retains its original shadow-caster position through `shadowP`. Its world clip plane covers colour, outline and shadow; its light mesh handles sharp pieces; its atlas supports pages.
- `kit.mjs`: the existing piece geometry helpers, unchanged.
- `play.mjs`, `stills.mjs`, `stage.html`: player, approved-pose entry points, and individual scene/atlas inspection. Both players fit from the six stills and 0.5-unit padding. A shared fit solves both label columns at the largest feasible scale and keeps the stage within 16 px side gutters down to 280 px. The backing store is capped at 2x and 5.2 million device pixels. Node checks cover the whole loop and dense booklet poses at 1440 × 900 and 390 × 664, including the leaves at their widest. A paused craft choice now uses its finished still; graphic design uses InDesign. Reduced motion never starts playback. Hidden/off-screen states stop drawing.
- `tools/checks.mjs`: Node geometry, actions, clocks, atlas, player logic and offline-module checks. Every sampled frame checks at least 0.0006 height separation between overlapping screen/floor faces, shared 0.0008 painter steps and interaction marks above the pictures. Regression checks cover typing minimums, comp/thumbnail construction, heal coverage, completed photo stacks, sky colours and Photoshop timings. Its canvas and DOM stand-ins are logic checks, not pixel renders.
- `tools/preview.mjs`: the offline frame packer, titled **Journey hero take two**, with stylesheet, four local font files and all modules embedded. No bundler, network or installation is needed.
- `labels.mjs`: one reused SVG/text overlay, projected by the canvas camera, with measured word widths, content avoidance and deterministic hero-time rings. Both players use it.
- `tools/correction-checks.mjs`: R9–R15, full 240 Hz cursor continuity, landed-face and fixed-mark checks, 0.005 s frame/plate lifetimes, Figma geometry and canvas/toolbar/lid clearance, frozen withdrawal, photograph registration and parametric label routes.
- `tools/controls.mjs`: reversible negative controls against the real checker, restoring source in `finally`; each exact edit must match one location; round-three evidence is in `.scratch/corrections3/controls/` and BUILD.md. The tool writes no results.json.
- `tools/browser-check.mjs`: actual marks/fonts, gutters, outward routes, words clear of every ring/mark/line, page overlap, reduced motion and laptop entry/return at ten sizes. `checkBrowser(page)` accepts a review page; direct execution attempts only its own headless Playwright browser, closing only that browser. No browser was launched here because Playwright is unavailable in the repository.
- `tools/drag-checks.mjs`: round-four Node sweeps every 0.0005 s over all five InDesign drags and 25.20–25.30 s. They compare stack offsets and projected corners with the saved incoming `48aea47` source, check projected box occlusion and F1's frame lifetimes, record shadow-pass position uniforms, and compare all six emitted stills with incoming `50b51b8`. These are computed checks, not rendered frames or shadows. `checks.mjs` includes them.
- `tools/drag-controls.mjs`: fourteen reversible single-site controls for those gates, plus the changed cursor-route and legacy clearance checks; source bytes are restored in `finally`. Evidence is in `.scratch/corrections4/controls/` and BUILD.md. The frozen reference sources in `tools/fixtures/drag-sources.json` let the checks run without `.scratch` snapshots.
- `tools/measure-phases.mjs`, `tools/phase-checks.mjs`: isolated phase orchestration and its browser-free failure-path fixture.
- `tools/page.mjs`: writes the existing page markup with the prototype's player or still script. Its output guard protects all four briefs and the protected critique record. `tools/sheet.mjs` and `tools/film.mjs` remain the external browser review tools.
- `BUILD.md`: this pass's decisions, acceptance criteria, stage checkpoints and limits.

## The six scenes

Times below are seconds at PACE 1. The first 0.5 seconds change shell; the next 0.3 wipe on the furniture. The last 0.3 wipe the content off. Every action's approach is computed from its cursor distance: 0.12, 0.20 or 0.28 seconds. All moves use the engine's wipe, enter or exit curve; playheads run at constant speed. The booklet keeps its approved pickup and bending law.

| App | Global start | Length | Local still | What is built |
| --- | ---: | ---: | ---: | --- |
| Photoshop | 0.000 | 7.500 | 6.549000 | Raw photo; levels; sky; seamless heals; grade; photograph to dock |
| Illustrator | 7.500 | 11.400 | 9.239000 | Empty artboards; maps, close-up and subway; maps to dock |
| InDesign | 18.900 | 19.180 | 16.277961 | Styled photo drops, typed titles and drawn blobs; labels during the 1.2 s landing hold; four bending leaves |
| Premiere Pro | 38.080 | 15.220 | 12.170001 | Clips, voice, captions and sound; shared playback; fully revealed export labels |
| After Effects | 53.300 | 14.030 | 10.980001 | Words, shapes, keys and graph; shared playback; fully revealed export labels |
| Figma | 67.330 | 13.910 | 11.610000 | Laptop/tablet/phone wireframes and designs; tap/change-state/instant interaction; scrolled Video still |

The scripts contain lengths, never hand-authored start times. `script()` derives each approach, start and end. PACE scales those lengths, cursor approaches, shell transition, feed/return and device clocks together. The first typed text in each app takes at least 0.6 seconds; every later text takes at least 0.4 seconds. Repeat runs retain their brisk timings. The resulting scene lengths supersede the second pass's individual targets and fit the revised 70–86-second loop. After Effects also visibly moves the first ball key from zero to 0.75, so the new stopwatch operation can create its key at zero while the finished animation keeps the approved stagger.

InDesign's four leaf turns still last 0.6 seconds each, separated by 0.3 seconds, and its pickup lasts 0.7 seconds. Its landing hold is 1.2 seconds; the final reading hold remains 0.3 seconds. `spreadType` runs for 0.3 seconds. Photoshop's levels slides each take 0.5 seconds, its sky wipe 0.7 seconds, and each healing scrub 0.25 seconds with the patch cutting in at release. Its closing wipe finishes 0.3 seconds after the photograph docks, removing the former 1.4-second empty hold.

Every action start and end follows. These are local times; multiply by PACE and add the scene's global start. Gaps are the scheduler's cursor approaches. Wait actions cover physical work or a deliberate hold, with the cursor still and unpressed at its previous point. Export is clicked once; the cursor rests through landing, pickup, the leaf turns, reading and return. A wait never sinks the Export button; any already-running export progress continues.

| App | Action | Kind | Start | End |
| --- | --- | --- | ---: | ---: |
| ps | open | click | 1.080 | 1.380 |
| ps | black | slide | 1.660 | 2.160 |
| ps | white | slide | 2.280 | 2.780 |
| ps | sky | click | 3.060 | 3.760 |
| ps | cone | stroke | 4.040 | 4.290 |
| ps | crane | stroke | 4.570 | 4.820 |
| ps | grade | slide | 5.020 | 6.120 |
| ps | shrink | wait | 6.120 | 6.270 |
| ps | export | export | 6.550 | 7.200 |
| ai | board0 | draw | 1.080 | 1.380 |
| ai | board1 | draw | 1.660 | 1.960 |
| ai | street | stroke | 2.240 | 2.740 |
| ai | markers | run | 3.020 | 3.230 |
| ai | labels | type | 3.510 | 4.110 |
| ai | title | type | 4.230 | 4.630 |
| ai | badge | draw | 4.830 | 5.010 |
| ai | block | draw | 5.210 | 5.390 |
| ai | blocks | run | 5.510 | 5.650 |
| ai | streets | stroke | 5.850 | 6.350 |
| ai | pins | run | 6.550 | 6.750 |
| ai | cityLabels | type | 6.950 | 7.350 |
| ai | marquee | draw | 7.470 | 7.770 |
| ai | close | wait | 7.770 | 8.270 |
| ai | subway | stroke | 8.470 | 8.820 |
| ai | inspect | wait | 8.820 | 8.960 |
| ai | export | export | 9.240 | 9.290 |
| ai | closeBack | wait | 9.290 | 9.540 |
| ai | mapExport | drag | 9.820 | 10.320 |
| ai | locExport | drag | 10.600 | 11.100 |
| id | frame0 | draw | 1.080 | 1.380 |
| id | frame1 | draw | 1.660 | 1.960 |
| id | frame2 | draw | 2.160 | 2.460 |
| id | frame3 | draw | 2.660 | 2.960 |
| id | map | drag | 3.240 | 3.690 |
| id | heading | type | 3.970 | 4.570 |
| id | spreadType | run | 4.850 | 5.150 |
| id | loc | drag | 5.430 | 5.880 |
| id | photo | drag | 6.160 | 6.610 |
| id | blob | draw | 6.810 | 6.990 |
| id | coverTitle | type | 7.110 | 7.510 |
| id | pages | run | 7.790 | 8.000 |
| id | postPhoto | drag | 8.280 | 8.580 |
| id | postTitle | type | 8.700 | 9.100 |
| id | postBlob | draw | 9.300 | 9.480 |
| id | postButton | draw | 9.600 | 9.780 |
| id | mailPhoto | drag | 10.060 | 10.360 |
| id | mailTitle | type | 10.480 | 10.880 |
| id | mailBlob | draw | 11.000 | 11.180 |
| id | mailButton | draw | 11.300 | 11.480 |
| id | mailFlyer | type | 11.600 | 12.000 |
| id | export | export | 12.280 | 13.080 |
| id | land | wait | 13.080 | 14.280 |
| id | pickup | wait | 14.280 | 14.980 |
| id | open | wait | 14.980 | 15.080 |
| id | leaf1 | wait | 15.080 | 15.680 |
| id | pause1 | wait | 15.680 | 15.980 |
| id | leaf2 | wait | 15.980 | 16.580 |
| id | pause2 | wait | 16.580 | 16.880 |
| id | leaf3 | wait | 16.880 | 17.480 |
| id | pause3 | wait | 17.480 | 17.780 |
| id | leaf4 | wait | 17.780 | 18.380 |
| id | read | wait | 18.380 | 18.680 |
| id | return | wait | 18.680 | 19.180 |
| pr | bin | run | 1.080 | 1.360 |
| pr | clipA | drag | 1.480 | 1.880 |
| pr | clipB | drag | 2.160 | 2.560 |
| pr | clipC | drag | 2.840 | 3.240 |
| pr | cut | click | 3.440 | 3.490 |
| pr | offcut | click | 3.610 | 3.730 |
| pr | closeGap | wait | 3.730 | 3.980 |
| pr | transition | drag | 4.180 | 4.630 |
| pr | effect | drag | 4.910 | 5.310 |
| pr | caption | type | 5.590 | 6.190 |
| pr | caption2 | type | 6.190 | 6.590 |
| pr | caption3 | type | 6.590 | 6.990 |
| pr | captions | run | 7.190 | 7.330 |
| pr | music | drag | 7.610 | 8.010 |
| pr | duck | slide | 8.130 | 8.380 |
| pr | fade | slide | 8.660 | 8.910 |
| pr | play | play | 9.190 | 10.790 |
| pr | export | export | 11.070 | 11.770 |
| ae | comp | click | 1.080 | 1.380 |
| ae | make | type | 1.580 | 2.180 |
| ae | move | type | 2.300 | 2.700 |
| ae | ball | draw | 2.900 | 3.150 |
| ae | row | draw | 3.270 | 3.520 |
| ae | copies | run | 3.720 | 3.860 |
| ae | select | click | 4.140 | 4.190 |
| ae | stopwatch | click | 4.310 | 4.360 |
| ae | head | drag | 4.480 | 4.730 |
| ae | path | drag | 4.930 | 5.280 |
| ae | marquee | draw | 5.480 | 5.730 |
| ae | keys | run | 6.010 | 6.360 |
| ae | staggerBall | drag | 6.640 | 6.840 |
| ae | graph | slide | 7.120 | 7.720 |
| ae | play | play | 8.000 | 9.600 |
| ae | export | export | 9.880 | 10.580 |
| fig | frame0 | draw | 1.080 | 1.380 |
| fig | frame1 | draw | 1.580 | 1.880 |
| fig | frame2 | draw | 2.080 | 2.380 |
| fig | pictureBox | draw | 2.660 | 2.910 |
| fig | heading | type | 3.110 | 3.710 |
| fig | button | draw | 3.830 | 4.030 |
| fig | details | run | 4.230 | 4.440 |
| fig | marquee | draw | 4.720 | 4.970 |
| fig | copies | drag | 5.170 | 5.570 |
| fig | fill0 | set | 5.770 | 5.820 |
| fig | fill1 | set | 6.020 | 6.070 |
| fig | fill2 | set | 6.270 | 6.320 |
| fig | hero | drag | 6.520 | 6.920 |
| fig | name | type | 7.120 | 7.520 |
| fig | accent0 | set | 7.720 | 7.770 |
| fig | accent1 | set | 7.970 | 8.020 |
| fig | accent2 | set | 8.220 | 8.270 |
| fig | hotspot | click | 8.550 | 8.600 |
| fig | link | drag | 8.600 | 9.200 |
| fig | panel | run | 9.480 | 9.680 |
| fig | export | export | 9.960 | 10.660 |

## Exports that play

The first device lands 0.55 seconds after Export. Video and motion keep two 1.6-second plays followed by a 0.4-second return. Their viewer, playhead and devices share that clock, including withdrawal. Their held stills move 0.016668 seconds later than the incoming stills, to the first frame after all three labels finish their 0.4-second reveal.

UX/UI remains static before the shared export clock starts at the first landing, then has one 3.0-second cycle on all three canvas designs and all three devices: tap Video (0–0.15), wipe its red selection and picture (0.15–0.30), scroll up 40% (0.40–1.00), hold and tap/lift a card at 1.25, scroll back (1.55–2.15), tap Graphic design (2.15–2.30), wipe back (2.30–2.45), then hold. During the 0.4 s withdrawal, all three devices and canvas designs hold the completed cycle; no new tap or cycle starts. The existing thin progress rail advances through the cycle. Page pictures move through cropped viewports, with no page stretching; browser/status chrome stays. The still is at 1.10 seconds, scrolled in Video before the card tap. Return begins at landing + 3.0 seconds and lasts 0.4 seconds.

The laptop screen is 16:10, faces +x and leans back 12 degrees above its left-edge hinge. A simple keyboard and trackpad lie on the deck. The tablet and phone screens are 3:4 and 9:19.5. The laptop picture is widest, both gaps are 0.3 units, and the complete footprint is inside the old mat ends and depth band. Its whole device cuts in and slides 1.6 units in x over 0.5 seconds; it has no entry clip. At 390 × 664 and 390 × 844 it appears whole and fully on screen, then slides; the former off-frame-phone description is superseded. This is established by projected geometry over the phone stage-height range, not by a browser render. The tablet and phone use the original slot feed. The Figma canvas uses those same three ratios in two rows 0.86 high. Its hotspot marks Video and ends beside its own frame; the inspector states On tap / Change to Video / Instant. No extra state frame is made.

## Labels on the exports

`calloutsAt(t)` is pure and returns the specified world marks, words, side, level and two wipe progresses. Photoshop and Illustrator return none. InDesign labels Flyer / LinkedIn post / Email; video labels YouTube / TikTok / Instagram; motion labels Website / Story / Feed post; UX/UI labels Laptop / Tablet / Phone.

Marks are on the top-left, bottom-middle and top-right faces, respectively; the laptop uses the top-left of its actual lid screen. Corner insets are 0.1 units, bottom middles 0.06; the laptop uses 0.08 along and 0.06 down. Each mark is a 3 px bright-red square surrounded by six equal dashes, turning at 60 degrees per hero second and stationary under reduced motion. Radius/stroke are 8/1.25 px, or 5.5/1 px below S=70. Paper leaders start 3 px outside the ring, run diagonally at 45 degrees, bend once and end horizontally. Upper elbows are 0.45 S above the mark; lower leaders share a level 0.45 S below the lowest low mark. Left/right word columns use the group’s left edge and screen’s right edge, with 0.35 S / 0.27 S offsets and 7 px word gaps. Both columns constrain the view fit. All left labels share one end x, moved outward as necessary; horizontal runs are at least 12 px, or 8 px below S=70. Elbows stay at least 3 px outward from line starts. Words clear all rings by radius + 2 px and all marks and lines. Page content can shorten a diagonal while keeping the run outward. Device anchors use their own landed bodies or fixed lid-screen face, independent of playback layers; InDesign anchors are unchanged.

Words are real uppercase Outfit 400, 11 px (9 below S=70), 1.2 line height, 0.12em spacing, without wrapping. The pointer-free, aria-hidden SVG/text overlay is above the canvas and below controls. Nothing is drawn below S=34. Nodes are reused. A mark/ring cuts in on its own landing, a line wipes for 0.25 seconds, then its words wipe for 0.15 seconds. Rows cut all labels at `off[0]`; InDesign cuts them at pickup. The InDesign reading still has none; all three later stills have complete labels. Seeks redraw immediately, including the overlay.

## Still changes to compare in the browser

This inventory describes known changes from the incoming motion build and the approved sheet; it is not a claim of a completed pixel comparison.

- **All six stills:** C15 permits only the floor groups and light pool to move in world x, to the screen's own middle at 0.200. Relative to the incoming build, InDesign's complete block moves left by 1.860 units and each three-device row by 1.250. That statement describes the incoming C15 change. This round adds labels and the three Figma device layouts; its small-screen framing may also shift/reduce the common view to clear the label column. The common framing is recalculated from these stills with the existing fit formula and padding. This correction adds the small height separations needed by rounded picture/plate faces and raises selections, carets, handles, taps and the cursor above picture stacks; the still times in the tables follow the longer typing actions.
- **Photoshop:** its still is now the finished graded photograph, before Export, rather than a split edit. The split bar and handle are gone; the sliders finish at 0.55 and 0.30; the cursor is on Export. The last rail icon is the wand needed by the sky step. The completed four layer rows and today's histogram remain. This correction draws the graded photograph alone at the still, removing the cone and patch ghosts. During construction the raw sky stays flat grey; the replacement and clean base both use the graded blue sky, so the grade does not change it again. Each completed heal switches the whole base: photoNoCone retains the crane after the cone/barrier are gone; photoClean removes the crane.
- **Illustrator:** the finished maps, close-up, selected path, points and handles keep their approved measures. The cursor is now on Export, rather than still approaching it. The photo chip stays in the bar as introduced by MOTION.md; the inspect beat returns the lit tool to the arrow.
- **InDesign:** its finished app content and its leaf pose at exactly 1.82 stay. The horizontal centring and moved pool are the changes; the booklet, stack and two device pictures keep their approved sizes and artwork.
- **Premiere:** the bin now contains three source shots and music. The timeline adds three attached voice strips, a music lane, level line, square keys, ducked waveform and stepped taper; the clip/voice/caption lanes and preset landing heights fit those into the existing plate. A small lit timeline-tool tile shows the blade/type/arrow actions. The still is 0.550001 seconds into export playback: the viewer/playhead and the three devices show that live phase rather than the parked shot A and burned-in caption. Device progress follows that phase. The two effects sliders from MOTION.md remain.
- **After Effects:** the still is one third through playback, so its word reveal, ball/outline position, list visibility, playhead and exported pictures differ from the old parked 1.6 pose. This correction makes the project thumbnail show that same live phase instead of its former baked picture. While building, both comp and thumbnail show typed words, the growing and dragged ball, and whole rows at their authored positions; the keyed reveal applies only during playback. There is now a visible stopwatch beside the ball row and a small lit tool tile. The graph grid and end keys, finished timeline keys, project list and layer measures stay. The third list row remains solid, as MOTION.md required. The ball now uses the permitted engine wipe ease; the old separate ball curve is gone. Its graph handles finish at (115.2,176) and (38.4,24), rather than (128,176) and (112,24), so the graph describes the actual engine wipe. This departure resolves MOTION-2's three-curve rule over MOTION.md's separate ball curve.
- **Figma:** the 1.10-second scrolled Video phase replaces the former parked desktop/two-phone arrangement. Both canvas rows are laptop/tablet/phone layouts; the floor is an open laptop, portrait tablet and phone. Each plays the same sequence with its own viewport and fixed chrome. All three labels are complete. The card tap has not happened at this still.
- **Device pictures:** the last three apps' picture areas are live pieces instead of baked stills. Their chrome, feed/browser surroundings and original aspect-specific layout remain; live progress and solid utility-bar colours are deliberate changes. This correction separates captions, words and rows from their underlying pictures to remove the browser's garbled overlaps. Small text stays on opaque plates; the two large motion-word plates use face-only cut mode to remove their side faces while preserving their opaque fronts.

## Checking and sharing this prototype

From the repository root, the two commands used in this pass are:

```
node design/journey-hero/take-2/tools/checks.mjs
node design/journey-hero/take-2/tools/preview.mjs design/journey-hero/take-2/.scratch/preview.html
```

`checks.mjs --timeline` also prints the derived action table. `frameAt(t)` wraps positive and negative times. `SCENES[i]()` builds the new still; `SCENES[2]({ at })` still gives any booklet reading pose with the complete group out. The player supports `?t=12.5` and `window.__hero.seek(t)`, and exposes its clock, SHOW and LOOP. `stage.html?s=0..5` holds a scene, `?t=` holds a loop time, `?atlas=1` shows every atlas page, and yaw/pitch inspect the geometry.

The external browser review can continue using `tools/sheet.mjs` and `tools/film.mjs`, including phone frames and the new 0–81.24-second range. They were not run in the build itself; the browser review recorded under "The design being carried forward" ran them afterwards. The retained hardware reports describe incoming `48aea47`, including both D2 runs. Round 3 was not remeasured on hardware because it changes which pieces are drawn and where labels sit, not the renderer.

All authored changes and the packed output are confined to this folder. Neither brief, the first take, public files, source site, dependencies nor deployment was changed.

## Round-one corrections and acceptance

CORRECTIONS-1.md supplies the ground rules; the owner's C15/C16 instructions supersede its still restriction for floor centring. In C1–C14, a structural comparison of every piece's tone, picture, position, rotation, size, window and clip found only five added paperTile picture bindings in After Effects (screen, thumbnail and three devices); all geometry was unchanged within 1e-8. For C15/C16, a fresh comparison of 4,821 loop/still frames finds only the specified floor-x translations and released wait-cursor lifts. The six stills differ only by floor-x translation. Neither comparison is a pixel comparison. The devices now use the same paper colour as the opaque word plates; the screen and thumbnail retain their paper appearance.

Frame style arrives exactly on each photo release, not on a title, blob or button action:

- Cover: the woven ground and the firm's small blob arrive with photo. Its building blob is drawn separately; the gold title tab starts with coverTitle's text-frame click.
- Post: the woven top band, dark foot and firm's small blob arrive with postPhoto. postTitle supplies its final-looking tag while typing; postBlob draws the large gold building mark. postButton touches only its button/tag area.
- E-blast: the top band, gold photo frame, divider and firm's small blob arrive with mailPhoto. mailTitle types the body text, mailBlob draws its large building mark, mailButton draws the button, and mailFlyer types View the flyer with a caret for 0.4 seconds.

Amenities, Location and cover thumbnails follow their own completion. Offering, Gallery and back cover are a three-row pages run at 0.07-second intervals. No photo-bearing thumbnail precedes photo's release. Finished pictures replace their construction only after all their parts exist. The landed amenities map sits above the spread plates and retains its selection/handles. Each empty frame’s outline and cross stop only at its own picture’s first contact and never return. Its plate remains until placement; that frame contains the styled replacement immediately. InDesign travelling pictures draw above other frames’ intact outlines and crosses. Each carried photograph is cropped to its destination’s framing before release; the cover’s photo aperture now matches the full-height photo already printed in the approved cover. Finished post and e-blast pictures replace their construction pieces, which stop in that same frame.

Premiere types Look good., Move well. and Work right. separately, with growing lane blocks and the correct viewer shot. Only the two repeated captions use a run. Figma's hero source belongs to the panel's opening furniture; its own slot empties during the drag. Fills and accents explicitly name the arrow. tick clamps one time step to 0.1 seconds; seeking still draws the requested time exactly.

R1–R15 check photo releases, page births, drawn blobs, typed ancestry, cursor-owned births, placed-image clearance, tools, legitimate press windows, action-end occlusion, 240 Hz cursor continuity and labels’ words/poses/wipes/face anchors. Echo exemptions require an explicit source-action tag whose action has started; there are no region exemptions. R9 also checks plain document pieces and excludes only identical atlas mappings, named echoes, playback and overlays. Every final negative control exits 1 with its intended rule. Figma checks additionally cover the actual device count/ratios/gaps/band/centre, the x-path exception, projected lid intersections, canvas/toolbar clearance and changes on every viewport between 0.6-second samples, excluding progress rails. R15 checks frame and plate persistence through their own contact/placement; its same-frame replacement exception is controlled. Fixed marks and low levels are checked at 60 Hz to 1e-9. These are numeric/logic gates; they do not replace pixel or whole-loop browser review.

## Cost and production work

The atlas has five RGBA8 pages, all within 2048 square: 2048 × 1844, 2048 × 1700, 2048 × 1800, 2048 × 1876 and 2048 × 1244. They cost 66.13 MiB before mipmaps and 88.17 MiB with them. These are computed from packed dimensions, not GPU resident-memory readings. Old baked UX/UI device pictures remain as code references but are not packed. The approved artwork, new crop pictures and scrolling page pictures fit in those five pages. Retained 2D canvases add their base pixel storage outside the GPU estimate.

The canvas covers the hero. Both players use `dpr = Math.min(2, devicePixelRatio || 1, Math.sqrt(5.2e6 / (W * H)))`: a nominal ceiling of 5.2 million device pixels; renderer integer rounding can add fewer than one row/column of pixels. 1440 × 900 stays at 2x (2880 × 1800). At 1920 × 1080 and requested DPR 2 the ratio is about 1.584, rather than 2. The review must report the real rounded backing dimensions.

Conservative allocation at that cap, term by term: atlas with mipmaps **92.25 MiB** (the incoming allowance; this revision actually uses 88.17 MiB), shadow **16 MiB**, resolved RGBA8 colour **4 bytes/device pixel**, 4x multisample colour **16 bytes/device pixel**, 4x depth **16 bytes/device pixel**. The 36-byte pixel term is **178.53 MiB**, for **286.78 MiB, about 287 MiB** total using the atlas allowance. This revision’s actual atlas lowers that arithmetic to about 282.69 MiB. Integer rounding adds a small fraction of a MiB. Antialiasing’s real sample count/depth bits must be queried; browser/compositor buffers, mesh/driver overhead and retained 2D canvases are outside the estimate.

preserveDrawingBuffer: true exists so external review tools can seek, draw once and capture that held WebGL frame after compositing. It is a review convenience, with a memory/performance cost. The production build switches it off; this prototype keeps it on for those captures.

Production work still required:

- Handle a lost WebGL context: this prototype has no restoration path, so its canvas stays blank.
- Handle no WebGL2: renderer creation throws, leaving dead controls and no still.
- Measure actual phones, battery/thermal behaviour, Safari and Firefox; desktop headless timing does not establish phone performance.
- Ship a fallback to approved stills for unsupported/lost WebGL and constrained devices, with usable craft controls and reduced-motion behaviour.

The external reviewer runs the local-only `tools/measure.mjs` with `--dpr <n>` (default 1). Each playback, scan and sheets phase records its own failure; failed playback cannot skip the scan/sheets, marks the report **playback incomplete**, and yields exit 1. `--playback-limit <milliseconds>` enables the forced-timeout review. It was not run in this build; the Node-only phase fixture exercised the coordinator and actual report formatter. It uses an isolated headless browser, the packed file and no page network requests; the graphics card, software-renderer warning, frame timing, allocation estimate and flicker scan belong in review/hardware/measure.md.

## Committed hardware runs of `48aea47`

[Default report](review/hardware/measure.md): 2026-11-20 01:01:12.463–01:05:26.701 UTC, Edge 157.0.4341.60, RTX 4090 through D3D11, WebGL2, no software renderer reported, ready in 153.9 ms. DPR 1: 1440 × 900 recorded 19,486 frames, median/P95 4.20/4.30 ms, worst 16.80 ms, zero gaps over 50 ms, allocation estimate 148.66 MiB. 1920 × 1080 recorded 19,489 frames, median/P95 4.20/4.30 ms, worst 5.20 ms, zero gaps over 50 ms, allocation estimate 175.36 MiB. Both playback phases, scan and sheets completed. Scan: 587 frames, zero repeat failures, 1,342 flagged blink blocks (46/882/261/129/24 in scene order excluding Illustrator).

[DPR-2 report](review/hardware/dpr2/measure.md): 01:05:29.680–01:13:06.347 UTC, same browser/GPU, ready in 164.6 ms. Requested 1920 × 1080 at DPR 2; actual backing 3040 × 1710, ratio 1.5833. 19,487 frames, median/P95 4.20/4.30 ms, worst 8.30 ms, zero gaps over 50 ms, allocation estimate 282.64 MiB. Scan: 587 frames, zero repeat failures, 11,535 flagged blink blocks (356/7080/2090/1430/579). Both reports record zero console errors and zero network violations. Both use four MSAA samples and 24-bit depth; allocation estimates exclude driver/compositor overhead and 66.13 MiB retained 2D atlas storage.

These are the committed incoming-build runs, not pending measurements and not round-three performance evidence. Their flags retain the external review’s classification. Round 3 was not remeasured on hardware: this revision changes which pieces are drawn and where labels sit, not the renderer. The protected reports and sheets are unchanged. The earlier contact-sheet scale departure remains in those reports: frames are fitted to the 1600 px sheet cap; scan comparisons keep full capture resolution.

## Round-three computed checks and browser limit

`tools/browser-check.mjs` checks the labels at ten sizes: 390 × 664, 390 × 844, 360 × 780, 375 × 667, 412 × 915, 768 × 1024, 820 × 1180, 1024 × 768, 1440 × 900 and 1920 × 1080. Its command needs Playwright installed in the repository; without it, it reports the sizes as UNRUN and launches nothing. Its exported `checkBrowser(page)` can be run on a page from any Playwright. The builder's machine has no Playwright, so the reviewers ran `checkBrowser` on the packed preview of `50b51b8` and `7590b44` in the cloud: it passed at all ten sizes (150 rows). The exported route assertions also run in Node against parametric layout geometry, including their negative control. BUILD.md contains exact outputs and control edits.

Timing is unchanged: PACE 1, loop 81.240 seconds, original scene starts and all six still times. The first three stills retain identical emitted canvas geometry/art; rendered pixel identity remains unverified without Playwright. Numeric tests cover frame/plate continuity, drawing order, fixed marks, playback content, toolbar clearance and narrow-stage gutters. No hardware rerun or measurement entry point was invoked.
