# Journey hero, second take

This is the unpublished prototype. `MOTION-2.md` controls the second pass; `MOTION.md` supplies the renderer, shell, dock, printer slot and player rules that it keeps. The browser-review corrections recorded in `BUILD.md` set the revised 70–78-second range. The loop is **77.73 seconds at PACE 1**. Every document opens empty, is built by one cursor, and reaches the approved composition before export. The last three exports play with their app's viewer.

## The design being carried forward

The approved six stills and the earlier browser review are the reference. The screen stays large and detailed enough to read as a real app. Its rails, panel hierarchy, document proportions, square corners, Outfit, ink, paper and red stay. The flyer's landscape pages keep their black, charcoal, two golds, woven grounds, asymmetric photographs and dense map structure. The firm's mark and the building's mark are blobs. No contact details or names from the source flyer are included.

Graphic design is one pipeline: Photoshop's photograph goes to the dock; Illustrator's two maps join it; InDesign places those same assets into the spread, cover, post and e-blast. Only the finished InDesign group reaches the floor. A closed stack sits behind the reading copy, alongside a phone and tablet. The reading copy still bends through fourteen strips per leaf, through The Offering, Location, Amenities and the gallery.

Video, motion and UX/UI export to a landscape tablet and two phones. Everything lies flat and square to the screen. The approved sizes, gutters and back edge stay. Each group now has its own x position, solved in HOME camera coordinates; its footprint's midpoint aligns with the screen face's midpoint. The light pool shares that alignment.

The prior build was reviewed in Chromium on 19 November 2026, with held frames on desktop and phone, a pixel comparison of its stills, and an offline preview checked for requests. The second pass was then reviewed in a real browser: stacked pictures flickered, the comp's construction was hidden, typing was too fast, and Photoshop needed clearer, better-paced edits. Those findings are the evidence for this correction. The corrective revision was then reviewed the same way on 19 November 2026 (Chromium with software rendering): held frames at each corrected moment (Photoshop's sky, both healed distractions and the graded photo; Premiere Pro's typed caption; After Effects' typed words; the playing devices of the last three apps) show no flicker, ghost or garbled text; a film of the whole loop reads cleanly; and the offline preview runs at desktop and phone size with no requests and no errors. **Still unmeasured:** frame rate on a real graphics card and on phones, and Safari and Firefox.

## What runs the show

- `stage.mjs`: PACE, the action scheduler, six scripts, shell, dock, floor and shared finished-piece players. `SHOW`, `LOOP`, `sceneAt`, `frameAt`, `SCENES`, `CRAFT`, `BLOCK`, `SCREEN`, `MAT` and `floorAt` keep their meanings. `SCRIPTS` exposes the derived action times for checks and review; `POOL` supplies the light's centre.
- `art.mjs`: the approved pictures, staged photograph and map drawings, opaque text prefixes, measured text regions and device chrome. Fonts are measured when the atlas is made, including rotated map lettering. The atlas occupies five pages, each no larger than 2048 square.
- `sq.mjs`: the existing WebGL2 renderer, unchanged in this pass. Its world clip plane covers colour, outline and shadow; its light mesh handles sharp pieces; its atlas supports pages.
- `kit.mjs`: the existing piece geometry helpers, unchanged.
- `play.mjs`, `stills.mjs`, `stage.html`: player, approved-pose entry points, and individual scene/atlas inspection. The player still fits from the six stills and caps drawing at two device pixels per CSS pixel. A paused craft choice now uses its finished still; graphic design uses InDesign. Reduced motion never starts playback. Hidden/off-screen states stop drawing.
- `tools/checks.mjs`: Node geometry, actions, clocks, atlas, player logic and offline-module checks. Every sampled frame checks at least 0.0006 height separation between overlapping screen/floor faces, shared 0.0008 painter steps and interaction marks above the pictures. Regression checks cover typing minimums, comp/thumbnail construction, heal coverage, completed photo stacks, sky colours and Photoshop timings. Its canvas and DOM stand-ins are logic checks, not pixel renders.
- `tools/preview.mjs`: the offline frame packer, titled **Journey hero take two**, with stylesheet, four local font files and all modules embedded. No bundler, network or installation is needed.
- `tools/page.mjs`: writes the existing page markup with the prototype's player or still script. Its output guard protects both briefs. `tools/sheet.mjs` and `tools/film.mjs` remain the external browser review tools.
- `BUILD.md`: this pass's decisions, acceptance criteria, stage checkpoints and limits.

## The six scenes

Times below are seconds at PACE 1. The first 0.5 seconds change shell; the next 0.3 wipe on the furniture. The last 0.3 wipe the content off. Every action's approach is computed from its cursor distance: 0.12, 0.20 or 0.28 seconds. All moves use the engine's wipe, enter or exit curve; playheads run at constant speed. The booklet keeps its approved pickup and bending law.

| App | Global start | Length | Local still | What is built |
| --- | ---: | ---: | ---: | --- |
| Photoshop | 0.000 | 7.500 | 6.549 | Raw photo; two levels adjustments; sky; separate cone and crane heals; grade; photograph to dock |
| Illustrator | 7.500 | 11.400 | 9.239 | Empty artboards; amenities street, markers, labels, title and badge; city blocks, streets, pins and labels; close-up and selected subway; maps carried to dock |
| InDesign | 18.900 | 16.210 | 13.307961 | Four empty frames; map and upright heading; location thumbnail; cover photograph, blob and title; post and e-blast; export, pickup and four bending leaves |
| Premiere Pro | 35.110 | 14.560 | 11.493333 | Empty bin and timeline; shots with voice; blade and offcut; presets; typed caption and repeats; music, ducking and stepped fade; play and live exports |
| After Effects | 49.670 | 14.030 | 10.963333 | Empty comp; words, ball and rows; layers, stopwatch and keys; path; stagger; graph handle; play and live exports |
| Figma | 63.700 | 14.030 | 10.963333 | Empty frames; wireframe parts; selected copies; fills, picture, typed name and accents; hotspot, link and properties; live prototype exports |

The scripts contain lengths, never hand-authored start times. `script()` derives each approach, start and end. PACE scales those lengths, cursor approaches, shell transition, feed/return and device clocks together. The first typed text in each app takes at least 0.6 seconds; every later text takes at least 0.4 seconds. Repeat runs retain their brisk timings. The resulting scene lengths supersede the second pass's individual targets and fit the revised 70–78-second loop. After Effects also visibly moves the first ball key from zero to 0.75, so the new stopwatch operation can create its key at zero while the finished animation keeps the approved stagger.

InDesign's four leaf turns still last 0.6 seconds each, separated by 0.3 seconds, and its pickup lasts 0.7 seconds. Its settle and final reading holds are 0.3 seconds. Photoshop's levels slides each take 0.5 seconds, its sky wipe 0.7 seconds, and each healing scrub 0.25 seconds with the patch cutting in at release. Its closing wipe finishes 0.3 seconds after the photograph docks, removing the former 1.4-second empty hold.

Every action start and end follows. These are local times; multiply by PACE and add the scene's global start. Gaps are the scheduler's cursor approaches. Wait actions cover physical work or a deliberate hold, with the cursor resting at its previous point.

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
| id | postPhoto | drag | 7.410 | 7.710 |
| id | postTitle | type | 7.830 | 8.230 |
| id | postButton | draw | 8.350 | 8.530 |
| id | mailPhoto | drag | 8.810 | 9.110 |
| id | mailTitle | type | 9.230 | 9.630 |
| id | mailButton | draw | 9.750 | 9.930 |
| id | export | export | 10.210 | 11.010 |
| id | land | wait | 11.010 | 11.310 |
| id | pickup | wait | 11.310 | 12.010 |
| id | open | wait | 12.010 | 12.110 |
| id | leaf1 | wait | 12.110 | 12.710 |
| id | pause1 | wait | 12.710 | 13.010 |
| id | leaf2 | wait | 13.010 | 13.610 |
| id | pause2 | wait | 13.610 | 13.910 |
| id | leaf3 | wait | 13.910 | 14.510 |
| id | pause3 | wait | 14.510 | 14.810 |
| id | leaf4 | wait | 14.810 | 15.410 |
| id | read | wait | 15.410 | 15.710 |
| id | return | wait | 15.710 | 16.210 |
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
| pr | captions | run | 6.390 | 6.670 |
| pr | music | drag | 6.950 | 7.350 |
| pr | duck | slide | 7.470 | 7.720 |
| pr | fade | slide | 8.000 | 8.250 |
| pr | play | play | 8.530 | 10.130 |
| pr | export | export | 10.410 | 11.110 |
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

- **All six stills:** the light pool moves to the screen's projected middle, and the common fitted framing is remeasured from the new stills. InDesign's deeper group and the three-device rows move horizontally to centre below the screen. Their sizes, gaps, depth and slot stay. This correction adds the small height separations needed by rounded picture/plate faces and raises selections, carets, handles, taps and the cursor above picture stacks; the still times in the tables follow the longer typing actions.
- **Photoshop:** its still is now the finished graded photograph, before Export, rather than a split edit. The split bar and handle are gone; the sliders finish at 0.55 and 0.30; the cursor is on Export. The last rail icon is the wand needed by the sky step. The completed four layer rows and today's histogram remain. This correction draws the graded photograph alone at the still, removing the cone and patch ghosts. During construction the raw sky stays flat grey; the replacement and clean base both use the graded blue sky, so the grade does not change it again. The cone patch includes the barrier and its posts; both completed heals use one clean picture.
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

The external browser review can continue using `tools/sheet.mjs` and `tools/film.mjs`, including phone frames and the new 0–77.73-second range. They were not run in the build itself; the browser review recorded under "The design being carried forward" ran them afterwards. No GPU frame-rate measurement has been made.

All authored changes and the packed output are confined to this folder. Neither brief, the first take, public files, source site, dependencies nor deployment was changed.
