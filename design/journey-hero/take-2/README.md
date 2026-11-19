# Journey hero, second take

This is the unpublished prototype. `MOTION-2.md` controls this pass; `MOTION.md` supplies the renderer, shell, dock, printer slot and player rules that it keeps. The loop is **74.71 seconds at PACE 1**. Every document opens empty, is built by one cursor, and reaches the approved composition before export. The last three exports play with their app's viewer.

## The design being carried forward

The approved six stills and the earlier browser review are the reference. The screen stays large and detailed enough to read as a real app. Its rails, panel hierarchy, document proportions, square corners, Outfit, ink, paper and red stay. The flyer's landscape pages keep their black, charcoal, two golds, woven grounds, asymmetric photographs and dense map structure. The firm's mark and the building's mark are blobs. No contact details or names from the source flyer are included.

Graphic design is one pipeline: Photoshop's photograph goes to the dock; Illustrator's two maps join it; InDesign places those same assets into the spread, cover, post and e-blast. Only the finished InDesign group reaches the floor. A closed stack sits behind the reading copy, alongside a phone and tablet. The reading copy still bends through fourteen strips per leaf, through The Offering, Location, Amenities and the gallery.

Video, motion and UX/UI export to a landscape tablet and two phones. Everything lies flat and square to the screen. The approved sizes, gutters and back edge stay. Each group now has its own x position, solved in HOME camera coordinates; its footprint's midpoint aligns with the screen face's midpoint. The light pool shares that alignment.

The prior build was reviewed in Chromium on 19 November 2026, with held frames on desktop and phone, a pixel comparison of its stills, and an offline preview checked for requests. That record applies to the incoming build. **This pass has not been rendered or reviewed in a browser.** Its visual comparison and graphics-card frame-rate check happen elsewhere. No reviewer agents or browser tools were run here.

## What runs the show

- `stage.mjs`: PACE, the action scheduler, six scripts, shell, dock, floor and shared finished-piece players. `SHOW`, `LOOP`, `sceneAt`, `frameAt`, `SCENES`, `CRAFT`, `BLOCK`, `SCREEN`, `MAT` and `floorAt` keep their meanings. `SCRIPTS` exposes the derived action times for checks and review; `POOL` supplies the light's centre.
- `art.mjs`: the approved pictures, staged photograph and map drawings, opaque text prefixes, measured text regions and device chrome. Fonts are measured when the atlas is made, including rotated map lettering. The atlas occupies five pages, each no larger than 2048 square.
- `sq.mjs`: the existing WebGL2 renderer, unchanged in this pass. Its world clip plane covers colour, outline and shadow; its light mesh handles sharp pieces; its atlas supports pages.
- `kit.mjs`: the existing piece geometry helpers, unchanged.
- `play.mjs`, `stills.mjs`, `stage.html`: player, approved-pose entry points, and individual scene/atlas inspection. The player still fits from the six stills and caps drawing at two device pixels per CSS pixel. A paused craft choice now uses its finished still; graphic design uses InDesign. Reduced motion never starts playback. Hidden/off-screen states stop drawing.
- `tools/checks.mjs`: Node geometry, actions, clocks, atlas, player logic and offline-module checks. Its canvas and DOM stand-ins are logic checks, not pixel renders.
- `tools/preview.mjs`: the offline frame packer, titled **Journey hero take two**, with stylesheet, four local font files and all modules embedded. No bundler, network or installation is needed.
- `tools/page.mjs`: writes the existing page markup with the prototype's player or still script. Its output guard protects both briefs. `tools/sheet.mjs` and `tools/film.mjs` remain the external browser review tools.
- `BUILD.md`: this pass's decisions, acceptance criteria, stage checkpoints and limits.

## The six scenes

Times below are seconds at PACE 1. The first 0.5 seconds change shell; the next 0.3 wipe on the furniture. The last 0.3 wipe the content off. Every action's approach is computed from its cursor distance: 0.12, 0.20 or 0.28 seconds. All moves use the engine's wipe, enter or exit curve; playheads run at constant speed. The booklet keeps its approved pickup and bending law.

| App | Global start | Length | Local still | What is built |
| --- | ---: | ---: | ---: | --- |
| Photoshop | 0 | 8.000 | 5.649 | Raw photo; two levels adjustments; sky; separate cone and crane heals; grade; photograph to dock |
| Illustrator | 8.000 | 10.500 | 8.339 | Empty artboards; amenities street, markers, labels, title and badge; city blocks, streets, pins and labels; close-up and selected subway; maps carried to dock |
| InDesign | 18.500 | 15.000 | 12.097961 | Four empty frames; map and upright heading; location thumbnail; cover photograph, blob and title; post and e-blast; export, pickup and four bending leaves |
| Premiere Pro | 33.500 | 14.310 | 11.243333 | Empty bin and timeline; shots with voice; blade and offcut; presets; typed caption and repeats; music, ducking and stepped fade; play and live exports |
| After Effects | 47.810 | 13.450 | 10.383333 | Empty comp; words, ball and rows; layers, stopwatch and keys; path; stagger; graph handle; play and live exports |
| Figma | 61.260 | 13.450 | 10.383333 | Empty frames; wireframe parts; selected copies; fills, picture, typed name and accents; hotspot, link and properties; live prototype exports |

The scripts contain lengths, never hand-authored start times. `script()` derives each approach, start and end. PACE scales those lengths, cursor approaches, shell transition, feed/return and device clocks together. Runs and typing in the dense Illustrator, InDesign and Figma scenes are shortened first to meet the scene targets. No construction step is dropped. After Effects also visibly moves the first ball key from zero to 0.75, so the new stopwatch operation can create its key at zero while the finished animation keeps the approved stagger.

InDesign's four leaf turns still last 0.6 seconds each, separated by 0.3 seconds, and its pickup lasts 0.7 seconds. Its settle and final reading holds are 0.3 seconds to fit the new construction within fifteen seconds.

Every action start and end follows. These are local times; multiply by PACE and add the scene's global start. Gaps are the scheduler's cursor approaches. Wait actions cover physical work or a deliberate hold, with the cursor resting at its previous point.

| App | Action | Kind | Start | End |
| --- | --- | --- | ---: | ---: |
| ps | open | click | 1.080 | 1.380 |
| ps | black | slide | 1.660 | 2.010 |
| ps | white | slide | 2.130 | 2.480 |
| ps | sky | click | 2.760 | 3.260 |
| ps | cone | click | 3.540 | 3.590 |
| ps | crane | click | 3.870 | 3.920 |
| ps | grade | slide | 4.120 | 5.220 |
| ps | shrink | wait | 5.220 | 5.370 |
| ps | export | export | 5.650 | 6.300 |
| ai | board0 | draw | 1.080 | 1.380 |
| ai | board1 | draw | 1.660 | 1.960 |
| ai | street | stroke | 2.240 | 2.740 |
| ai | markers | run | 3.020 | 3.230 |
| ai | labels | type | 3.510 | 3.690 |
| ai | title | type | 3.810 | 3.950 |
| ai | badge | draw | 4.150 | 4.330 |
| ai | block | draw | 4.530 | 4.710 |
| ai | blocks | run | 4.830 | 4.970 |
| ai | streets | stroke | 5.170 | 5.670 |
| ai | pins | run | 5.870 | 6.070 |
| ai | cityLabels | type | 6.270 | 6.450 |
| ai | marquee | draw | 6.570 | 6.870 |
| ai | close | wait | 6.870 | 7.370 |
| ai | subway | stroke | 7.570 | 7.920 |
| ai | inspect | wait | 7.920 | 8.060 |
| ai | export | export | 8.340 | 8.390 |
| ai | closeBack | wait | 8.390 | 8.640 |
| ai | mapExport | drag | 8.920 | 9.420 |
| ai | locExport | drag | 9.700 | 10.200 |
| id | frame0 | draw | 1.080 | 1.380 |
| id | frame1 | draw | 1.660 | 1.960 |
| id | frame2 | draw | 2.160 | 2.460 |
| id | frame3 | draw | 2.660 | 2.960 |
| id | map | drag | 3.240 | 3.690 |
| id | heading | type | 3.970 | 4.120 |
| id | spreadType | run | 4.400 | 4.480 |
| id | loc | drag | 4.760 | 5.210 |
| id | photo | drag | 5.490 | 5.940 |
| id | blob | draw | 6.140 | 6.320 |
| id | coverTitle | type | 6.440 | 6.570 |
| id | postPhoto | drag | 6.690 | 6.990 |
| id | postTitle | type | 7.110 | 7.240 |
| id | postButton | draw | 7.360 | 7.540 |
| id | mailPhoto | drag | 7.820 | 8.120 |
| id | mailTitle | type | 8.240 | 8.420 |
| id | mailButton | draw | 8.540 | 8.720 |
| id | export | export | 9.000 | 9.800 |
| id | land | wait | 9.800 | 10.100 |
| id | pickup | wait | 10.100 | 10.800 |
| id | open | wait | 10.800 | 10.900 |
| id | leaf1 | wait | 10.900 | 11.500 |
| id | pause1 | wait | 11.500 | 11.800 |
| id | leaf2 | wait | 11.800 | 12.400 |
| id | pause2 | wait | 12.400 | 12.700 |
| id | leaf3 | wait | 12.700 | 13.300 |
| id | pause3 | wait | 13.300 | 13.600 |
| id | leaf4 | wait | 13.600 | 14.200 |
| id | read | wait | 14.200 | 14.500 |
| id | return | wait | 14.500 | 15.000 |
| pr | bin | run | 1.080 | 1.360 |
| pr | clipA | drag | 1.480 | 1.880 |
| pr | clipB | drag | 2.160 | 2.560 |
| pr | clipC | drag | 2.840 | 3.240 |
| pr | cut | click | 3.440 | 3.490 |
| pr | offcut | click | 3.610 | 3.730 |
| pr | closeGap | wait | 3.730 | 3.980 |
| pr | transition | drag | 4.180 | 4.630 |
| pr | effect | drag | 4.910 | 5.310 |
| pr | caption | type | 5.590 | 5.940 |
| pr | captions | run | 6.140 | 6.420 |
| pr | music | drag | 6.700 | 7.100 |
| pr | duck | slide | 7.220 | 7.470 |
| pr | fade | slide | 7.750 | 8.000 |
| pr | play | play | 8.280 | 9.880 |
| pr | export | export | 10.160 | 10.860 |
| ae | comp | click | 1.080 | 1.380 |
| ae | make | type | 1.580 | 1.825 |
| ae | move | type | 1.945 | 2.120 |
| ae | ball | draw | 2.320 | 2.570 |
| ae | row | draw | 2.690 | 2.940 |
| ae | copies | run | 3.140 | 3.280 |
| ae | select | click | 3.560 | 3.610 |
| ae | stopwatch | click | 3.730 | 3.780 |
| ae | head | drag | 3.900 | 4.150 |
| ae | path | drag | 4.350 | 4.700 |
| ae | marquee | draw | 4.900 | 5.150 |
| ae | keys | run | 5.430 | 5.780 |
| ae | staggerBall | drag | 6.060 | 6.260 |
| ae | graph | slide | 6.540 | 7.140 |
| ae | play | play | 7.420 | 9.020 |
| ae | export | export | 9.300 | 10.000 |
| fig | frame0 | draw | 1.080 | 1.380 |
| fig | frame1 | draw | 1.580 | 1.880 |
| fig | frame2 | draw | 2.080 | 2.380 |
| fig | pictureBox | draw | 2.660 | 2.910 |
| fig | heading | type | 3.110 | 3.250 |
| fig | button | draw | 3.370 | 3.570 |
| fig | details | run | 3.770 | 3.980 |
| fig | marquee | draw | 4.260 | 4.510 |
| fig | copies | drag | 4.710 | 5.110 |
| fig | fill0 | set | 5.310 | 5.360 |
| fig | fill1 | set | 5.560 | 5.610 |
| fig | fill2 | set | 5.810 | 5.860 |
| fig | hero | drag | 6.060 | 6.460 |
| fig | name | type | 6.660 | 6.940 |
| fig | accent0 | set | 7.140 | 7.190 |
| fig | accent1 | set | 7.390 | 7.440 |
| fig | accent2 | set | 7.640 | 7.690 |
| fig | hotspot | click | 7.890 | 7.940 |
| fig | link | drag | 7.940 | 8.540 |
| fig | panel | run | 8.820 | 9.020 |
| fig | export | export | 9.300 | 10.000 |

## Exports that play

The first device lands 0.55 seconds after Export. That is the common zero for two 1.6-second plays; the row then returns over 0.4 seconds. Later devices join the same clock as they feed out. The viewer and its playhead run with them, and keep that clock during withdrawal.

Video uses one shot/caption/wipe function for the viewer and the devices, with wide, tall and square footage drawings. Motion uses one word/ball/row function, with each device's original layout. The prototype's phones start on opposite screens: a tap, a short delay and a hard upright wipe swap them, then another tap 0.8 seconds later returns them. The desktop's four craft markers advance every 0.4 seconds and its little screen changes tone. A bead travels the app's red link on each tap.

Each device retains picture chrome around its moving picture area. Progress grows on the existing player/story/feed rail where one existed; motion's square post and the prototype gain a thin progress line at the picture/page foot. The secondary reel bars and progress rails use opaque colours rather than newly introducing renderer blending.

## Still changes to compare in the browser

This inventory describes known changes from the incoming motion build and the approved sheet; it is not a claim of a completed pixel comparison.

- **All six stills:** the light pool moves to the screen's projected middle, and the common fitted framing is remeasured from the new stills. InDesign's deeper group and the three-device rows move horizontally to centre below the screen. Their sizes, gaps, depth and slot stay.
- **Photoshop:** its still is now the finished graded photograph, before Export, rather than a split edit. The split bar and handle are gone; the sliders finish at 0.55 and 0.30; the cursor is on Export. The last rail icon is the wand needed by the sky step. The completed four layer rows and today's histogram remain.
- **Illustrator:** the finished maps, close-up, selected path, points and handles keep their approved measures. The cursor is now on Export, rather than still approaching it. The photo chip stays in the bar as introduced by MOTION.md; the inspect beat returns the lit tool to the arrow.
- **InDesign:** its finished app content and its leaf pose at exactly 1.82 stay. The horizontal centring and moved pool are the changes; the booklet, stack and two device pictures keep their approved sizes and artwork.
- **Premiere:** the bin now contains three source shots and music. The timeline adds three attached voice strips, a music lane, level line, square keys, ducked waveform and stepped taper; the clip/voice/caption lanes and preset landing heights fit those into the existing plate. A small lit timeline-tool tile shows the blade/type/arrow actions. The still is one third through export playback: the viewer/playhead and the three devices show that live phase rather than the parked shot A and burned-in caption. Device progress follows that phase. The two effects sliders from MOTION.md remain.
- **After Effects:** the still is one third through playback, so its word reveal, ball/outline position, list visibility, playhead and exported pictures differ from the old parked 1.6 pose. There is now a visible stopwatch beside the ball row and a small lit tool tile. The graph grid and end keys, finished timeline keys, project list and layer measures stay. The third list row remains solid, as MOTION.md required. The ball now uses the permitted engine wipe ease; the old separate ball curve is gone. Its graph handles finish at (115.2,176) and (38.4,24), rather than (128,176) and (112,24), so the graph describes the actual engine wipe. This departure resolves MOTION-2's three-curve rule over MOTION.md's separate ball curve.
- **Figma:** the still is one third through the first prototype play. The desktop highlights video and its little screen changes accordingly; the two phones have swapped states after the first tap, in both the app and the exported devices. The wireframes, frame measures, link, layers and filled properties keep their approved places. Progress lines now show the shared phase. A tap mark and travelling bead appear only around their tap beats, not at this still.
- **Device pictures:** the last three apps' picture areas are live pieces instead of baked stills. Their chrome, feed/browser surroundings and original aspect-specific layout remain; live progress and solid utility-bar colours are deliberate changes. Small text is drawn on opaque plates and never uses the renderer's cut mode.

## Checking and sharing this prototype

From the repository root, the two commands used in this pass are:

```
node design/journey-hero/take-2/tools/checks.mjs
node design/journey-hero/take-2/tools/preview.mjs design/journey-hero/take-2/.scratch/preview.html
```

`checks.mjs --timeline` also prints the derived action table. `frameAt(t)` wraps positive and negative times. `SCENES[i]()` builds the new still; `SCENES[2]({ at })` still gives any booklet reading pose with the complete group out. The player supports `?t=12.5` and `window.__hero.seek(t)`, and exposes its clock, SHOW and LOOP. `stage.html?s=0..5` holds a scene, `?t=` holds a loop time, `?atlas=1` shows every atlas page, and yaw/pitch inspect the geometry.

The external browser review can continue using `tools/sheet.mjs` and `tools/film.mjs`, including phone frames and the new 0–74.71-second range. They were not run here. The offline preview was packed and its JavaScript parsed, but no browser, screenshot, pixel comparison or GPU frame-rate measurement was attempted in this run.

All authored changes and the packed output are confined to this folder. Neither brief, the first take, public files, source site, dependencies nor deployment was changed.
