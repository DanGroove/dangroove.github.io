# Journey hero, second take

This is the unpublished prototype. `MOTION-2.md` controls the second pass; `MOTION.md` supplies the renderer, shell, dock, printer slot and player rules that it keeps. The browser-review corrections recorded in `BUILD.md` set the revised 70–82-second range. The owner's C15/C16 corrections override the older camera-centring instruction: exported groups align in world x, and waits never click. The loop is **80.24 seconds at PACE 1**. Every document opens empty, is built by one cursor, and reaches the approved composition before export. The last three exports play with their app's viewer.

## The design being carried forward

The approved six stills and the earlier browser review are the reference. The screen stays large and detailed enough to read as a real app. Its rails, panel hierarchy, document proportions, square corners, Outfit, ink, paper and red stay. The flyer's landscape pages keep their black, charcoal, two golds, woven grounds, asymmetric photographs and dense map structure. The firm's mark and the building's mark are blobs. No contact details or names from the source flyer are included.

Graphic design is one pipeline: Photoshop's photograph goes to the dock; Illustrator's two maps join it; InDesign places those same assets into the spread, cover, post and e-blast. Only the finished InDesign group reaches the floor. A closed stack sits behind the reading copy, alongside a phone and tablet. The reading copy still bends through fourteen strips per leaf, through The Offering, Location, Amenities and the gallery.

Video, motion and UX/UI export to a landscape tablet and two phones. Everything lies flat and square to the screen. The approved sizes, gutters and back edge stay. Every complete group's footprint is centred on SCREEN.l + SCREEN.w / 2 in world x, including the whole InDesign block and its reading copy. The light pool shares that world-x middle. Depth and all z-only feed/return paths are unchanged; the slot is an undrawn clipping plane at MAT.z, with no line width to centre.

| Middle | World x |
| --- | ---: |
| Screen | 0.200 |
| InDesign block | 0.200 |
| Premiere Pro row | 0.200 |
| After Effects row | 0.200 |
| Figma row | 0.200 |
| Light pool | 0.200 |

The prior build was reviewed in Chromium on 19 November 2026, with held frames on desktop and phone, a pixel comparison of its stills, and an offline preview checked for requests. The second pass was then reviewed in a real browser: stacked pictures flickered, the comp's construction was hidden, typing was too fast, and Photoshop needed clearer, better-paced edits. Those findings are the evidence for this correction. The corrective revision was then reviewed the same way on 19 November 2026 (Chromium with software rendering): held frames at each corrected moment (Photoshop's sky, both healed distractions and the graded photo; Premiere Pro's typed caption; After Effects' typed words; the playing devices of the last three apps) show no flicker, ghost or garbled text; a film of the whole loop reads cleanly; and the offline preview runs at desktop and phone size with no requests and no errors. The latest hardware run below supplies RTX 4090 desktop measurements for C15/C16. **Still unmeasured:** phones, Safari and Firefox.

## What runs the show

- `stage.mjs`: PACE, the action scheduler, six scripts, shell, dock, floor and shared finished-piece players. `SHOW`, `LOOP`, `sceneAt`, `frameAt`, `SCENES`, `CRAFT`, `BLOCK`, `SCREEN`, `MAT` and `floorAt` keep their meanings. `SCRIPTS` exposes the derived action times for checks and review; `POOL` supplies the light's centre.
- `art.mjs`: the approved pictures, staged photograph and map drawings, opaque text prefixes, measured text regions and device chrome. Fonts are measured when the atlas is made, including rotated map lettering. The atlas occupies five pages, each no larger than 2048 square.
- `sq.mjs`: the existing WebGL2 renderer, unchanged in this pass. Its world clip plane covers colour, outline and shadow; its light mesh handles sharp pieces; its atlas supports pages.
- `kit.mjs`: the existing piece geometry helpers, unchanged.
- `play.mjs`, `stills.mjs`, `stage.html`: player, approved-pose entry points, and individual scene/atlas inspection. The player still fits from the six stills with the same 0.5-unit padding and caps drawing at two device pixels per CSS pixel. Node checks cover the whole loop and dense booklet poses at 1440 × 900 and 390 × 664, including the leaves at their widest. A paused craft choice now uses its finished still; graphic design uses InDesign. Reduced motion never starts playback. Hidden/off-screen states stop drawing.
- `tools/checks.mjs`: Node geometry, actions, clocks, atlas, player logic and offline-module checks. Every sampled frame checks at least 0.0006 height separation between overlapping screen/floor faces, shared 0.0008 painter steps and interaction marks above the pictures. Regression checks cover typing minimums, comp/thumbnail construction, heal coverage, completed photo stacks, sky colours and Photoshop timings. Its canvas and DOM stand-ins are logic checks, not pixel renders.
- `tools/preview.mjs`: the offline frame packer, titled **Journey hero take two**, with stylesheet, four local font files and all modules embedded. No bundler, network or installation is needed.
- `tools/page.mjs`: writes the existing page markup with the prototype's player or still script. Its output guard protects both briefs. `tools/sheet.mjs` and `tools/film.mjs` remain the external browser review tools.
- `BUILD.md`: this pass's decisions, acceptance criteria, stage checkpoints and limits.

## The six scenes

Times below are seconds at PACE 1. The first 0.5 seconds change shell; the next 0.3 wipe on the furniture. The last 0.3 wipe the content off. Every action's approach is computed from its cursor distance: 0.12, 0.20 or 0.28 seconds. All moves use the engine's wipe, enter or exit curve; playheads run at constant speed. The booklet keeps its approved pickup and bending law.

| App | Global start | Length | Local still | What is built |
| --- | ---: | ---: | ---: | --- |
| Photoshop | 0.000 | 7.500 | 6.549000 | Raw photo; levels; sky; separate seamless cone/crane bases; grade; photograph to dock |
| Illustrator | 7.500 | 11.400 | 9.239000 | Empty artboards; amenities and city maps; close-up and subway; maps to dock |
| InDesign | 18.900 | 18.060 | 15.157961 | Empty frames; placed map; page rows as made; styled photo drops; drawn blobs and typed titles/button; export and four bending leaves |
| Premiere Pro | 36.960 | 15.220 | 12.153333 | Empty bin/timeline; shots and voice; blade and presets; three typed captions and two repeats; sound; play and exports |
| After Effects | 52.180 | 14.030 | 10.963333 | Empty comp; words, ball and rows; keys and path; graph; play and exports |
| Figma | 66.210 | 14.030 | 10.963333 | Empty frames; wireframes and copies; fills; panel asset carried into place; typed name; arrow-set accents; prototype exports |

The scripts contain lengths, never hand-authored start times. `script()` derives each approach, start and end. PACE scales those lengths, cursor approaches, shell transition, feed/return and device clocks together. The first typed text in each app takes at least 0.6 seconds; every later text takes at least 0.4 seconds. Repeat runs retain their brisk timings. The resulting scene lengths supersede the second pass's individual targets and fit the revised 70–82-second loop. After Effects also visibly moves the first ball key from zero to 0.75, so the new stopwatch operation can create its key at zero while the finished animation keeps the approved stagger.

InDesign's four leaf turns still last 0.6 seconds each, separated by 0.3 seconds, and its pickup lasts 0.7 seconds. Its settle and final reading holds are 0.3 seconds. Photoshop's levels slides each take 0.5 seconds, its sky wipe 0.7 seconds, and each healing scrub 0.25 seconds with the patch cutting in at release. Its closing wipe finishes 0.3 seconds after the photograph docks, removing the former 1.4-second empty hold.

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
| id | spreadType | run | 4.850 | 4.930 |
| id | loc | drag | 5.210 | 5.660 |
| id | photo | drag | 5.940 | 6.390 |
| id | blob | draw | 6.590 | 6.770 |
| id | coverTitle | type | 6.890 | 7.290 |
| id | pages | run | 7.570 | 7.780 |
| id | postPhoto | drag | 8.060 | 8.360 |
| id | postTitle | type | 8.480 | 8.880 |
| id | postBlob | draw | 9.080 | 9.260 |
| id | postButton | draw | 9.380 | 9.560 |
| id | mailPhoto | drag | 9.840 | 10.140 |
| id | mailTitle | type | 10.260 | 10.660 |
| id | mailBlob | draw | 10.780 | 10.960 |
| id | mailButton | draw | 11.080 | 11.260 |
| id | mailFlyer | type | 11.380 | 11.780 |
| id | export | export | 12.060 | 12.860 |
| id | land | wait | 12.860 | 13.160 |
| id | pickup | wait | 13.160 | 13.860 |
| id | open | wait | 13.860 | 13.960 |
| id | leaf1 | wait | 13.960 | 14.560 |
| id | pause1 | wait | 14.560 | 14.860 |
| id | leaf2 | wait | 14.860 | 15.460 |
| id | pause2 | wait | 15.460 | 15.760 |
| id | leaf3 | wait | 15.760 | 16.360 |
| id | pause3 | wait | 16.360 | 16.660 |
| id | leaf4 | wait | 16.660 | 17.260 |
| id | read | wait | 17.260 | 17.560 |
| id | return | wait | 17.560 | 18.060 |
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
| fig | hotspot | click | 8.470 | 8.520 |
| fig | link | drag | 8.520 | 9.120 |
| fig | panel | run | 9.400 | 9.600 |
| fig | export | export | 9.880 | 10.580 |

## Exports that play

The first device lands 0.55 seconds after Export. That is the common zero for two 1.6-second plays; the row then returns over 0.4 seconds. Later devices join the same clock as they feed out. The viewer and its playhead run with them, and keep that clock during withdrawal.

Video uses one shot/caption/wipe function for the viewer and the devices, with wide, tall and square footage drawings. Motion uses one word/ball/row function, with each device's original layout. The prototype's phones start on opposite screens: a tap, a short delay and a hard upright wipe swap them, then another tap 0.8 seconds later returns them. The desktop's four craft markers advance every 0.4 seconds and its little screen changes tone. A bead travels the app's red link on each tap.

Each device retains picture chrome around its moving picture area. Progress grows on the existing player/story/feed rail where one existed; motion's square post and the prototype gain a thin progress line at the picture/page foot. The secondary reel bars and progress rails use opaque colours rather than newly introducing renderer blending.

## Still changes to compare in the browser

This inventory describes known changes from the incoming motion build and the approved sheet; it is not a claim of a completed pixel comparison.

- **All six stills:** C15 permits only the floor groups and light pool to move in world x, to the screen's own middle at 0.200. Relative to the incoming build, InDesign's complete block moves left by 1.860 units and each three-device row by 1.250. Nothing else in the still geometry or artwork moves; sizes, gaps, depth and slot stay. The common framing is recalculated from these stills with the existing fit formula and padding. This correction adds the small height separations needed by rounded picture/plate faces and raises selections, carets, handles, taps and the cursor above picture stacks; the still times in the tables follow the longer typing actions.
- **Photoshop:** its still is now the finished graded photograph, before Export, rather than a split edit. The split bar and handle are gone; the sliders finish at 0.55 and 0.30; the cursor is on Export. The last rail icon is the wand needed by the sky step. The completed four layer rows and today's histogram remain. This correction draws the graded photograph alone at the still, removing the cone and patch ghosts. During construction the raw sky stays flat grey; the replacement and clean base both use the graded blue sky, so the grade does not change it again. Each completed heal switches the whole base: photoNoCone retains the crane after the cone/barrier are gone; photoClean removes the crane.
- **Illustrator:** the finished maps, close-up, selected path, points and handles keep their approved measures. The cursor is now on Export, rather than still approaching it. The photo chip stays in the bar as introduced by MOTION.md; the inspect beat returns the lit tool to the arrow.
- **InDesign:** its finished app content and its leaf pose at exactly 1.82 stay. The horizontal centring and moved pool are the changes; the booklet, stack and two device pictures keep their approved sizes and artwork.
- **Premiere:** the bin now contains three source shots and music. The timeline adds three attached voice strips, a music lane, level line, square keys, ducked waveform and stepped taper; the clip/voice/caption lanes and preset landing heights fit those into the existing plate. A small lit timeline-tool tile shows the blade/type/arrow actions. The still is one third through export playback: the viewer/playhead and the three devices show that live phase rather than the parked shot A and burned-in caption. Device progress follows that phase. The two effects sliders from MOTION.md remain.
- **After Effects:** the still is one third through playback, so its word reveal, ball/outline position, list visibility, playhead and exported pictures differ from the old parked 1.6 pose. This correction makes the project thumbnail show that same live phase instead of its former baked picture. While building, both comp and thumbnail show typed words, the growing and dragged ball, and whole rows at their authored positions; the keyed reveal applies only during playback. There is now a visible stopwatch beside the ball row and a small lit tool tile. The graph grid and end keys, finished timeline keys, project list and layer measures stay. The third list row remains solid, as MOTION.md required. The ball now uses the permitted engine wipe ease; the old separate ball curve is gone. Its graph handles finish at (115.2,176) and (38.4,24), rather than (128,176) and (112,24), so the graph describes the actual engine wipe. This departure resolves MOTION-2's three-curve rule over MOTION.md's separate ball curve.
- **Figma:** the still is one third through the first prototype play. The desktop highlights video and its little screen changes accordingly; the two phones have swapped states after the first tap, in both the app and the exported devices. The wireframes, frame measures, link, layers and filled properties keep their approved places. Progress lines now show the shared phase. A tap mark and travelling bead appear only around their tap beats, not at this still.
- **Device pictures:** the last three apps' picture areas are live pieces instead of baked stills. Their chrome, feed/browser surroundings and original aspect-specific layout remain; live progress and solid utility-bar colours are deliberate changes. This correction separates captions, words and rows from their underlying pictures to remove the browser's garbled overlaps. Small text is drawn on opaque plates and never uses the renderer's cut mode.

## Checking and sharing this prototype

From the repository root, the two commands used in this pass are:

```
node design/journey-hero/take-2/tools/checks.mjs
node design/journey-hero/take-2/tools/preview.mjs design/journey-hero/take-2/.scratch/preview.html
```

`checks.mjs --timeline` also prints the derived action table. `frameAt(t)` wraps positive and negative times. `SCENES[i]()` builds the new still; `SCENES[2]({ at })` still gives any booklet reading pose with the complete group out. The player supports `?t=12.5` and `window.__hero.seek(t)`, and exposes its clock, SHOW and LOOP. `stage.html?s=0..5` holds a scene, `?t=` holds a loop time, `?atlas=1` shows every atlas page, and yaw/pitch inspect the geometry.

The external browser review can continue using `tools/sheet.mjs` and `tools/film.mjs`, including phone frames and the new 0–80.24-second range. They were not run in the build itself; the browser review recorded under "The design being carried forward" ran them afterwards. The existing measuring tool was rerun once for C15/C16 on the RTX 4090; review/hardware/measure.md records this build's timing, memory and scan findings.

All authored changes and the packed output are confined to this folder. Neither brief, the first take, public files, source site, dependencies nor deployment was changed.

## Round-one corrections and acceptance

CORRECTIONS-1.md supplies the ground rules; the owner's C15/C16 instructions supersede its still restriction for floor centring. In C1–C14, a structural comparison of every piece's tone, picture, position, rotation, size, window and clip found only five added paperTile picture bindings in After Effects (screen, thumbnail and three devices); all geometry was unchanged within 1e-8. For C15/C16, a fresh comparison of 4,821 loop/still frames finds only the specified floor-x translations and released wait-cursor lifts. The six stills differ only by floor-x translation. Neither comparison is a pixel comparison. The devices now use the same paper colour as the opaque word plates; the screen and thumbnail retain their paper appearance.

Frame style arrives exactly on each photo release, not on a title, blob or button action:

- Cover: the woven ground and the firm's small blob arrive with photo. Its building blob is drawn separately; the gold title tab starts with coverTitle's text-frame click.
- Post: the woven top band, dark foot and firm's small blob arrive with postPhoto. postTitle supplies its final-looking tag while typing; postBlob draws the large gold building mark. postButton touches only its button/tag area.
- E-blast: the top band, gold photo frame, divider and firm's small blob arrive with mailPhoto. mailTitle types the body text, mailBlob draws its large building mark, mailButton draws the button, and mailFlyer types View the flyer with a caret for 0.4 seconds.

Amenities, Location and cover thumbnails follow their own completion. Offering, Gallery and back cover are a three-row pages run at 0.07-second intervals. No photo-bearing thumbnail precedes photo's release. Finished pictures replace their construction only after all their parts exist. The landed amenities map sits above the spread plates and retains its outline/handles. Frame diagonals stop on the corresponding photo release.

Premiere types Look good., Move well. and Work right. separately, with growing lane blocks and the correct viewer shot. Only the two repeated captions use a run. Figma's hero source belongs to the panel's opening furniture; its own slot empties during the drag. Fills and accents explicitly name the arrow. tick clamps one time step to 0.1 seconds; seeking still draws the requested time exactly.

R1–R8 sample emitted pieces, measured text prefixes and carets, page births, photo releases, blob completion, tool icons, landed-image clearance and resting waits. R8 checks the released state, cursor position/lift and Export-button lift throughout sampled wait interiors. The new-object exemptions are a closed role/reason list in the checker. Each rule was observed failing with its correction undone, then restored. For R8, restoring the old press expression produced failures including Photoshop shrink at 6.133333 s and InDesign land at 31.766667 s; the corrected build passes. Footprints and the pool are checked within 0.001 of the screen's world x; feeding/returning is checked for z-only travel. These checks cannot replace the external browser's pixel and whole-loop review.

## Cost and production work

The atlas has five RGBA8 pages, each at most 2048 × 2048: a page costs width × height × 4 bytes plus one third for its mip chain. The maximum five-page allowance is 106.67 MiB; the measured pages are 2048 × 1896, 2048 × 1752, 2048 × 1808, 2048 × 1908 and 2048 × 1492, together 69.19 MiB before mipmaps and 92.25 MiB with them. Mipmaps are allocated even though sampling is capped at level three. The 2D atlas canvases also retain their pixel storage until released.

The hero canvas covers the hero, not just the visible stage; its drawing buffer is capped at 2 device pixels per CSS pixel (four times the CSS pixel area). Budget width × height × 4 for resolved colour, plus multisample colour and depth at the real sample count. At DPR 2, 1440 × 900 CSS pixels become 2880 × 1800 buffer pixels, and 1920 × 1080 become 3840 × 2160. Antialiasing is requested; its actual samples and depth bits must be queried. The 2048 × 2048 DEPTH_COMPONENT24 shadow map normally occupies a 32-bit allocation, about 16 MiB, with no mipmaps. Browser/compositor buffers, mesh/driver overhead and retained 2D canvases add to the GPU allocation estimate; the estimate is not a measured process working set.

preserveDrawingBuffer: true exists so external review tools can seek, draw once and capture that held WebGL frame after compositing. It is a review convenience, with a memory/performance cost. The production build switches it off; this prototype keeps it on for those captures.

Production work still required:

- Handle a lost WebGL context: this prototype has no restoration path, so its canvas stays blank.
- Handle no WebGL2: renderer creation throws, leaving dead controls and no still.
- Measure actual phones, battery/thermal behaviour, Safari and Firefox; desktop headless timing does not establish phone performance.
- Ship a fallback to approved stills for unsupported/lost WebGL and constrained devices, with usable craft controls and reduced-motion behaviour.

Run the local-only measuring tool with node design/journey-hero/take-2/tools/measure.mjs. It uses an isolated headless browser, the packed file and no page network requests; the graphics card, software-renderer warning, frame timing, allocation estimate and flicker scan belong in review/hardware/measure.md.

## Latest hardware run, 19 November 2026

[measure.md](review/hardware/measure.md) and [measure.json](review/hardware/measure.json) record the C15/C16 rerun, 22:40:45.497–22:44:29.375 UTC, using Edge 157.0.4341.60. WebGL reports Google Inc. (NVIDIA), ANGLE NVIDIA GeForce RTX 4090 through Direct3D11. No software renderer was detected. WebGL2 exists; navigation to ready took 152.5 ms. No console errors or page network requests were recorded. The spawned Edge closed and its isolated profile was removed.

At DPR 1, each full loop recorded 19,249 frames: median 4.20 ms and P95 4.30 ms, with zero gaps above 50 ms after the first second. Worst gaps were 4.50 ms at 1440 × 900 and 5.10 ms at 1920 × 1080. The hero clock advanced 80.2413 seconds over 80.2437 wall seconds at the first size, and 80.2413 over 80.2426 at the second. Measured canvases matched those pixel sizes, with four MSAA samples and 24-bit depth. GPU allocation estimates are 152.74 MiB and 179.44 MiB respectively; the 69.19 MiB retained 2D atlas pixels and unknown driver/compositor overhead sit outside those estimates.

The scan captured 569 times twice after an intervening seek: zero repeat failures, but **1,355 blink blocks** (Photoshop 50, InDesign 1,009, Premiere 171, After Effects 87, Figma 38). All times/8 × 8 block spans are retained for the external review. These flags have not been visually classified or declared harmless. Five labelled JPEG sheets and both reports occupy about 754 KB. No local visual review was performed.

Contact-sheet constraint departure, unchanged from C14: the stage capture is 775 pixels wide, so eight half-size frames would make a 3100-pixel sheet. To obey the 1600-pixel maximum, the tool fits them to 200 pixels per frame (25.806% of source, below half size). The scan keeps full 775 × 772 stage captures. The flags and this scale conflict remain open for the external review; neither is a claimed pass.
