# Journey hero, second take

This is the unpublished prototype. `CORRECTIONS-10.md` (gathered stars ease into the mark's look and blasted stars ease back to their own) controls this revision, on top of `CORRECTIONS-9.md` (a long hold draws the DG mark in stars), `CORRECTIONS-8.md` (the name reacts as the live page's headline does, a star field behind the hero with hold-and-blast, no floor hover, and no frames lifting while a picture is carried), `CORRECTIONS-7.md` (one hand easing for the cursor, longer moves taking longer), `CORRECTIONS-6.md` (the one-time entrance and the labels' exit), `CORRECTIONS-5.md` and its second addendum after `d7e0de5`; rounds 1–4 and the motion briefs supply the retained rules. The allowed range is 70–92 seconds (raised from 86 for round 7's K2). Groups align on world x 0.200; waits never click. The loop is **91.498 seconds at PACE 1** (83.040 before round 7; scenes 8.046, 13.148, 23.091, 16.681, 15.082 and 15.449 s). Every document opens empty and is built by one cursor. Round 5 adds the lasting spread draw, longer InDesign labels, lower-left-facing laptop, measured text offsets, wide-screen centring and floor hover. The supplied browser review accepts H9/H10 and the rest of round 5. H11 keeps phone craft numbers in their own columns; H12 centres from the name's ink and lede/craft-list boxes, independently of word wrapping. Those two fixes have Node evidence and exact negative controls in BUILD.md; their browser checks remain external. No browser command was run locally. The committed hardware reports measure incoming `48aea47`.

## The design being carried forward

The approved six stills and the earlier browser review are the reference. The screen stays large and detailed enough to read as a real app. Its rails, panel hierarchy, document proportions, square corners, Outfit, ink, paper and red stay. The flyer's landscape pages keep their black, charcoal, two golds, woven grounds, asymmetric photographs and dense map structure. The firm's mark and the building's mark are blobs. No contact details or names from the source flyer are included.

Graphic design is one pipeline: Photoshop's photograph goes to the dock; Illustrator's two maps join it; InDesign places those same assets into the spread, cover, post and e-blast. Only the finished InDesign group reaches the floor. A closed stack sits behind the reading copy, alongside a phone and tablet. The reading copy still bends through fourteen strips per leaf, through The Offering, Location, Amenities and the gallery.

Video and motion retain their landscape tablet and two phones. UX/UI uses an open laptop facing world +z (lower left), a portrait tablet and one phone. Every complete footprint, including the laptop deck and lid, is centred on `SCREEN.l + SCREEN.w / 2` in world x. The light pool shares that middle. The slot remains the undrawn plane at `MAT.z`, shifted with the Figma row to `MAT.z + UI_ROW.forward` for H10; only the laptop enters in x, whole and unclipped, from 1.6 units to its left. All returns use the shared z withdrawal.

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
- `take-2.css`, `page-layout.mjs`, `view.mjs`: take-two-only text alignment, guarded upward offset and scene placement. The stylesheet loads after the borrowed `journey.css` and is inlined by the preview packer. Font ink is measured with actual glyph metrics and DOM character positions, including wrapped text. Both name lines use weight 800 for their left offset. First-column craft numbers share the lede's ink edge; other columns remove only their own number's side bearing. The scene's text-right input is the maximum of name ink and lede/craft-list box rights. The name's weight animates only in the round 6 entrance (`entrance.mjs`); the CSS `name-in` animation is switched off in `take-2.css`. Text and word measurements are cached; playback performs no layout reads. Resize, font loading and the name's weight animation refresh the cache. The side gutter ramps continuously from 40 to 64 px between widths 1120 and 1200 to avoid the inherited breakpoint jump.
- `entrance.mjs` (round 6, `CORRECTIONS-6.md`): the one-time entrance on first load, about 1.4 s, timed from the first frame that can draw. The DG mark wipes in (0–0.30), Journey and Contact cut in (0.24, 0.30), each name line wipes up from its baseline while its weight goes 300→800 (Danial 0.08–0.40, Endrawes 0.16–0.48), the lede wipes in line by line (0.40–0.75), the craft hairlines draw with each row's number and word cutting in as the line passes (0.55–0.95), the floor's dots and pool switch on inside a hard circle growing from the pool's centre (0.20–0.90), the app screen and its shadow are revealed by a world clip plane rising from its bottom edge (0.50–1.10), and Scroll for the journey and Pause cut in (1.10, 1.20). The loop's clock starts at 0 at 1.10; on that first pass the Photoshop shell starts as itself (`frameAt(t, { first: true })`). Only clip-path, the name's weight and renderer uniforms (`look.reveal`, `floor.reveal`) change per frame. A click on a craft, the stage or Pause ends it at once and then acts; seek, reduced-motion change and `__hero.entrance(null)` also end it. The floor hover starts at 0.90. Reduced motion and `?t=` get no entrance. Until the first frame, `take-2.css` hides the entering parts only under `(scripting: enabled)` and no reduced-motion preference. `window.__hero.entrance(time)` holds the entrance at `time` (0–1.4) and draws it; `__hero.entrance(null)` ends the hold and plays on; `__hero.entering` reads the entrance clock (null when none). `tools/entrance-checks.mjs` checks the timetable and the player in Node, with two negative controls; `checks.mjs` runs both.
- Labels' exit (round 6, E4): each label leaves as its entrance played backwards, ending at the old cut (`off`): the word wipes back toward its line's end over off−0.30…off−0.20 s, then the line retracts into its mark until `off`, where the ring and mark cut out as before (`calloutsAt` in `stage.mjs`; values are the smaller of entrance and exit). No timing or the loop moves.
- Floor hover (round 5's `floor-hover.mjs`): removed in round 8 (F3). The floor's dots, pool and click are otherwise as before; the floor reacts to nothing on hover.
- `name-react.mjs` (round 8, N1): the name reacts as the live page's headline (`public/holding/title.js`) does, with its numbers. A red copy (`#F0484F`) shows inside a circle of 0.95 em around a mouse pointer, opening within 1.2 em of the name's box; the letters within 1.3 em lift up to 0.07 em on title.js's spring; a click or tap knocks them up 0.16 em in a wave (55 ms per em from where it landed). The flow text in each `.name-line` is never split: once live it is painted transparent and an overlay of the same letters (CSS generated content at each letter's measured pen position, so no new text reaches the page's ink measurement or screen readers) and its red copy draw it. Only transform and clip-path change per frame; geometry is read on resize, scroll and fonts ready. Live only after the entrance ends (off while it plays or is held with `__hero.entrance(t)`) and never with reduced motion. A click on the name does not change the craft. `window.__hero.name` reads `{ live, open, lift }`.
- `stars.mjs` (round 8, B1/B2): the star field behind the whole hero, drawn by the renderer as its first pass (one `gl.POINTS` draw, `sq.mjs`), under the scene and the page's text. About 1,200 stars at 1440 × 900 (scaled with the area, at most 2,000), depth 0–1: 0.6–2.2 px, paper (3 % red `#F0484F`) mixed 12–55 % into ink, no fades. Mouse parallax: −(pointer fraction) × 28 px × (0.12 + 0.88 d²), followed critically damped (0.3 s); scroll parallax: near stars up to 12 % faster than the page. Stirring: the pointer's path since the last frame pushes stars within 60 px along it, `(1 − smoothstep(0, 60, r))²`, with its speed capped at 1,500 px/s; each star (hashed mass 0.6–1.6) coasts (drag 2.3/√mass) and returns home on e^−age, under 40 px. Hold to gather: a mouse or pen press anywhere in the hero except links, buttons and the name captures stars within 80 + 260 × min(1, held/2.5) px into a slowly turning cluster; release blasts them out at (300 + 1700 × min(1, held/2.5))/mass px/s, weaker for stars within twice the radius; offsets stay under 45 % of the hero's width. Round 9 (L1): from 1.4 s held the cluster stops turning and the captured stars form the DG mark, sampled from the page's own `[data-mark]` SVG paths (`sampleMark`, farthest-point order, 600 points prepared at measure time; paper paths are G, the red path D), 20 % of the hero's height (180 px at 1440 × 900), centred on the hold's anchor and clamped 16 px inside the hero; each star goes to its point critically damped from rest (τ 0.12 s) and, within 1 px, cuts to paper `#F7F6F3` (G) or red `#F0484F` (D) at 2.6 px, cutting back only at home; stars beyond the points turn in a ring outside the mark; captured stars draw in front of the scene (a second POINTS draw while any is out). A star that starts falling home after a kick never grows or swings past home again. A stage press under 0.25 s that moves under 6 px is still a click (next craft); a longer press does not change the craft. The stars switch on in rings from the stage's centre at 0.20–0.90 s of the entrance. Reduced motion: static; touch: scroll parallax only; Pause stops the loop, not the field. The floor shader now writes its colour premultiplied, unchanged over ink, so the field shows only where the floor adds nothing. `?stars=0` turns the field off for review; `window.__hero.stars` reads its state (round 9 adds `flags` and `mark`: points, height, formed, assigned, arrived, ring, front, centre). Round 10 (R1, R2): no more cuts in the stars' look. The pass behind now draws every star in its own look, and the pass in front draws each star that is out again over it: a captured star's front copy fades in over 0.4 s, eases from its own colour and size to the mark's by m = 1 − (distance to its point past 1 px) / (that distance when given the point), exactly 1 on arrival (ring stars keep their own look), keeps that mix at the release, and fades out on the way home by w = offset / largest offset since the release (1 until the offset falls), at most 0.09 a frame for either weight, so a star comes home at w ≤ 0.02 and leaves the front pass with no pop (`__hero.stars` adds `weights`, `alpha` and `mixes`).
- `stage.mjs` G1 (round 8): while a drag carries pieces (`carriedStack`: the current action's travel pieces and the cursor), `separateFaces()` places everything else as if the stack were not there, so nothing it passes over moves; the stack keeps its own place, InDesign's `liftDragStack` runs as before, and `clearCarried` lifts the stack along the view (no move on the page) only where it would tie with a face it passes over. `frameAt(t, { withoutCarried: true })` builds a frame without the stack, for the check. Premiere's music drag now names its action like the other drags.
- `tools/round8-checks.mjs` (run by `checks.mjs`): N1's model against title.js's numbers and the player's gate, F3, B1, B2, G1 and one negative control each.
- `tools/round9-checks.mjs` (run by `checks.mjs`; `--controls` alone): L1's sampler on the mark read from `public/journey/index.html` (inside its own path, gaps, D share), timing, formation, colour, overflow, release and clicks, with three negative controls.
- `tools/round10-checks.mjs` (run by `checks.mjs`; `--controls` alone): R2's fade-in and mark weight during the hold, R1's return weight after the release, and the two passes through a WebGL call recorder on the real renderer, with two negative controls (round 9's cut on arrival; w held at 1 until home).
- `tools/correction-checks.mjs`: R9–R15, full 240 Hz cursor continuity, landed-face and fixed-mark checks, 0.005 s frame/plate lifetimes, Figma geometry and canvas/toolbar/lid clearance, frozen withdrawal, photograph registration and parametric label routes.
- `tools/controls.mjs`: reversible negative controls against the real checker, restoring source in `finally`; each exact edit must match one location; round-three evidence is in `.scratch/corrections3/controls/` and BUILD.md. The tool writes no results.json.
- `tools/browser-check.mjs`: actual marks/fonts, gutters, outward routes, words clear of every ring/mark/line, page overlap, reduced motion and laptop entry/return at ten sizes. Its new `checkRound5Layout(page)` adds font-ink/guard/target checks, four wider reference sizes and the 555-size resize sweep. `checkBrowser(page)` accepts a review page; its CLI is for the external review machine only. These checks were not run here.
- `tools/hand-checks.mjs` (round 7, K3, run by `checks.mjs`): the cursor's projected peak speed at S 103.6 every 1/120 s over the loop (limit 1,500 px/s), a carried piece within 0.002 units of the cursor in every drag/draw/slide/stroke, the cursor on `HAND` in every approach and hand action, and three in-memory negative controls. `tools/hand-patch.mjs` applies round 7's hand edit to the frozen snapshots the older checks compare with, and maps instants named from the 83.04 s timetable to now.
- `tools/drag-checks.mjs`: round-four Node sweeps every 0.0005 s over all five InDesign drags and the old 25.20–25.30 s window (mapped to now through the actions around it). They compare stack offsets and projected corners with the saved incoming `48aea47` source, check projected box occlusion and F1's frame lifetimes, record shadow-pass position uniforms, and compare the five retained emitted stills with incoming `50b51b8` (numeric tolerance 1e-8). H2 timing and H3's Figma change are checked separately. These are computed checks, not rendered frames or shadows. `checks.mjs` includes them.
- `tools/round5-checks.mjs`, `tools/round5-controls.mjs`: H1's exact spread boundary, 0.005 s growing bounds and all 23 draw-end comparisons; H2 clocks and still poses; H3 geometry/anchor/entry; H6 centring, target, modeled sizes and continuity; H7 rays, whole-dot rule and input scheduling. The frozen round-four source/labels are in `tools/fixtures/round5-source.json`. Every deliberate fault matches one site and is restored byte-for-byte. Model size results are not browser measurements.
- `tools/round5-addendum-checks.mjs`, `tools/round5-addendum-controls.mjs`: H9 exercises the real page-layout logic with exact, shorter decimal and 1/64 px CSSOM storage through ten measurements and an away/back resize at all ten sizes. H10 samples the complete laptop and app outlines every 0.02 s, including clipped withdrawal, and the Laptop ring's outer stroke at S=103.6. Frozen incoming sources let it check retained pieces and report before/after. Three one-site negative controls run entirely in memory. The main checks include these gates; the browser checker also includes real repeated-measure/away-back assertions.
- `tools/round5-second-addendum-checks.mjs`, `tools/round5-second-addendum-controls.mjs`: H11 exercises all four craft pairs at fourteen review sizes plus the 719/720 breakpoint, three measurements each. H12 exercises a 357→396 px modeled lede rewrap and 555 resize samples through the actual layout function. Shared browser assertions test column ownership, number/label placement, overlaps, the stable text-right input and resize steps. Both incoming faults are rejected by exact one-site in-memory controls. These are DOM/glyph stand-ins, not real Outfit or browser evidence; the existing label-fit suite and external browser/pixel gates remain necessary.
- `tools/drag-controls.mjs`: fourteen reversible single-site controls for those gates, plus the changed cursor-route and legacy clearance checks; source bytes are restored in `finally`. Evidence is in `.scratch/corrections4/controls/` and BUILD.md. The frozen reference sources in `tools/fixtures/drag-sources.json` let the checks run without `.scratch` snapshots.
- `tools/measure-phases.mjs`, `tools/phase-checks.mjs`: isolated phase orchestration and its browser-free failure-path fixture.
- `tools/page.mjs`: writes the existing page markup with the prototype's player or still script and the take-two stylesheet. Its output guard protects all seven briefs and the protected review records. `tools/sheet.mjs` and `tools/film.mjs` remain the external browser review tools.
- `BUILD.md`: this pass's decisions, acceptance criteria, stage checkpoints and limits.

## The six scenes

Times below are seconds at PACE 1. The first 0.5 seconds change shell; the next 0.3 wipe on the furniture. The last 0.3 wipe the content off. Every action's approach is computed from its cursor distance d: min(0.5, 0.18 + 0.07 d) seconds, and a drag, draw, slide, stroke or run of path length d lasts at least 0.12 + 0.08 d seconds; either is lengthened further where needed to keep the cursor's projected peak under 1,500 px/s at the 1440 x 900 fit (round 7, K2/K3). The hand (the cursor's approaches, and every drag, draw, slide, stroke and run with everything it carries) uses `HAND`, the minimum-jerk curve in `stage.mjs`; a path is walked by its length. Every other move uses the engine's wipe, enter or exit curve; playheads run at constant speed. The booklet keeps its approved pickup and bending law.

| App | Global start | Length | Local still | What is built |
| --- | ---: | ---: | ---: | --- |
| Photoshop | 0.000 | 8.046 | 7.095311 | Raw photo; levels; sky; seamless heals; grade; photograph to dock |
| Illustrator | 8.046 | 13.148 | 10.835164 | Empty artboards; maps, close-up and subway; maps to dock |
| InDesign | 21.194 | 23.091 | 20.189380 | Styled photo drops, typed titles and drawn blobs; labels during the 3.0 s landing hold; four bending leaves |
| Premiere Pro | 44.285 | 16.681 | 13.631291 | Clips, voice, captions and sound; shared playback; fully revealed export labels |
| After Effects | 60.967 | 15.082 | 12.032090 | Words, shapes, keys and graph; shared playback; fully revealed export labels |
| Figma | 76.049 | 15.449 | 13.149236 | Laptop/tablet/phone wireframes and designs; tap/change-state/instant interaction; scrolled Video still |

The scripts contain lengths, never hand-authored start times. `script()` derives each approach, start and end. PACE scales those lengths, cursor approaches, shell transition, feed/return and device clocks together. The first typed text in each app takes at least 0.6 seconds; every later text takes at least 0.4 seconds. Repeat runs retain their brisk timings. The resulting scene lengths supersede the second pass's individual targets and fit the revised loop (70–92 seconds since round 7). After Effects also visibly moves the first ball key from zero to 0.75, so the new stopwatch operation can create its key at zero while the finished animation keeps the approved stagger.

InDesign's four leaf turns still last 0.6 seconds each, separated by 0.3 seconds, and its pickup lasts 0.7 seconds. Its landing hold is 3.0 seconds; the final reading hold remains 0.3 seconds. `spreadType` runs for 0.476 seconds (0.3 authored, lengthened by round 7's distance rule). Photoshop's levels slides each take 0.5 seconds, its sky wipe 0.7 seconds, and each healing scrub 0.25 seconds with the patch cutting in at release. Its closing wipe finishes 0.3 seconds after the photograph docks, removing the former 1.4-second empty hold.

Every action start and end follows. These are local times; multiply by PACE and add the scene's global start. Gaps are the scheduler's cursor approaches. Wait actions cover physical work or a deliberate hold, with the cursor still and unpressed at its previous point. Export is clicked once; the cursor rests through landing, pickup, the leaf turns, reading and return. A wait never sinks the Export button; any already-running export progress continues.

| App | Action | Kind | Start | End |
| --- | --- | --- | ---: | ---: |
| ps | open | click | 1.171 | 1.471 |
| ps | black | slide | 1.796 | 2.296 |
| ps | white | slide | 2.491 | 2.991 |
| ps | sky | click | 3.302 | 4.002 |
| ps | cone | stroke | 4.331 | 4.581 |
| ps | crane | stroke | 4.909 | 5.159 |
| ps | grade | slide | 5.382 | 6.482 |
| ps | shrink | wait | 6.482 | 6.632 |
| ps | export | export | 7.096 | 7.746 |
| ai | board0 | draw | 1.251 | 1.727 |
| ai | board1 | draw | 2.132 | 2.432 |
| ai | street | stroke | 2.793 | 3.293 |
| ai | markers | run | 3.682 | 4.014 |
| ai | labels | type | 4.380 | 4.980 |
| ai | title | type | 5.194 | 5.594 |
| ai | badge | draw | 5.855 | 6.035 |
| ai | block | draw | 6.302 | 6.482 |
| ai | blocks | run | 6.669 | 6.859 |
| ai | streets | stroke | 7.105 | 7.605 |
| ai | pins | run | 7.889 | 8.102 |
| ai | cityLabels | type | 8.360 | 8.760 |
| ai | marquee | draw | 8.965 | 9.265 |
| ai | close | wait | 9.265 | 9.765 |
| ai | subway | stroke | 10.035 | 10.385 |
| ai | inspect | wait | 10.385 | 10.525 |
| ai | export | export | 10.836 | 10.886 |
| ai | closeBack | wait | 10.886 | 11.136 |
| ai | mapExport | drag | 11.488 | 11.988 |
| ai | locExport | drag | 12.348 | 12.848 |
| id | frame0 | draw | 1.173 | 1.649 |
| id | frame1 | draw | 2.053 | 2.353 |
| id | frame2 | draw | 2.604 | 2.904 |
| id | frame3 | draw | 3.154 | 3.454 |
| id | map | drag | 3.877 | 4.327 |
| id | heading | type | 4.621 | 5.221 |
| id | spreadType | run | 5.667 | 6.143 |
| id | loc | drag | 6.442 | 6.892 |
| id | photo | drag | 7.259 | 7.709 |
| id | blob | draw | 7.946 | 8.129 |
| id | coverTitle | type | 8.325 | 8.725 |
| id | pages | run | 9.128 | 9.369 |
| id | postPhoto | drag | 9.754 | 10.054 |
| id | postTitle | type | 10.260 | 10.660 |
| id | postBlob | draw | 10.888 | 11.068 |
| id | postButton | draw | 11.258 | 11.438 |
| id | mailPhoto | drag | 11.730 | 12.030 |
| id | mailTitle | type | 12.243 | 12.643 |
| id | mailBlob | draw | 12.840 | 13.020 |
| id | mailButton | draw | 13.235 | 13.415 |
| id | mailFlyer | type | 13.609 | 14.009 |
| id | export | export | 14.391 | 15.191 |
| id | land | wait | 15.191 | 18.191 |
| id | pickup | wait | 18.191 | 18.891 |
| id | open | wait | 18.891 | 18.991 |
| id | leaf1 | wait | 18.991 | 19.591 |
| id | pause1 | wait | 19.591 | 19.891 |
| id | leaf2 | wait | 19.891 | 20.491 |
| id | pause2 | wait | 20.491 | 20.791 |
| id | leaf3 | wait | 20.791 | 21.391 |
| id | pause3 | wait | 21.391 | 21.691 |
| id | leaf4 | wait | 21.691 | 22.291 |
| id | read | wait | 22.291 | 22.591 |
| id | return | wait | 22.591 | 23.091 |
| pr | bin | run | 1.271 | 1.551 |
| pr | clipA | drag | 1.765 | 2.165 |
| pr | clipB | drag | 2.469 | 2.869 |
| pr | clipC | drag | 3.262 | 3.818 |
| pr | cut | click | 4.061 | 4.111 |
| pr | offcut | click | 4.301 | 4.421 |
| pr | closeGap | wait | 4.421 | 4.671 |
| pr | transition | drag | 4.920 | 5.370 |
| pr | effect | drag | 5.733 | 6.133 |
| pr | caption | type | 6.481 | 7.081 |
| pr | caption2 | type | 7.081 | 7.481 |
| pr | caption3 | type | 7.481 | 7.881 |
| pr | captions | run | 8.145 | 8.335 |
| pr | music | drag | 8.777 | 9.177 |
| pr | duck | slide | 9.382 | 9.632 |
| pr | fade | slide | 9.971 | 10.221 |
| pr | play | play | 10.568 | 12.168 |
| pr | export | export | 12.531 | 13.231 |
| ae | comp | click | 1.142 | 1.442 |
| ae | make | type | 1.681 | 2.281 |
| ae | move | type | 2.478 | 2.878 |
| ae | ball | draw | 3.127 | 3.377 |
| ae | row | draw | 3.569 | 3.819 |
| ae | copies | run | 4.034 | 4.174 |
| ae | select | click | 4.520 | 4.570 |
| ae | stopwatch | click | 4.781 | 4.831 |
| ae | head | drag | 5.045 | 5.295 |
| ae | path | drag | 5.577 | 5.927 |
| ae | marquee | draw | 6.192 | 6.503 |
| ae | keys | run | 6.834 | 7.184 |
| ae | staggerBall | drag | 7.507 | 7.707 |
| ae | graph | slide | 8.054 | 8.654 |
| ae | play | play | 8.969 | 10.569 |
| ae | export | export | 10.932 | 11.632 |
| fig | frame0 | draw | 1.222 | 1.522 |
| fig | frame1 | draw | 1.763 | 2.063 |
| fig | frame2 | draw | 2.304 | 2.604 |
| fig | pictureBox | draw | 2.937 | 3.187 |
| fig | heading | type | 3.461 | 4.061 |
| fig | button | draw | 4.261 | 4.461 |
| fig | details | run | 4.690 | 5.076 |
| fig | marquee | draw | 5.462 | 5.847 |
| fig | copies | drag | 6.126 | 6.526 |
| fig | fill0 | set | 6.753 | 6.803 |
| fig | fill1 | set | 7.063 | 7.113 |
| fig | fill2 | set | 7.340 | 7.390 |
| fig | hero | drag | 7.657 | 8.057 |
| fig | name | type | 8.303 | 8.703 |
| fig | accent0 | set | 8.930 | 8.980 |
| fig | accent1 | set | 9.240 | 9.290 |
| fig | accent2 | set | 9.517 | 9.567 |
| fig | hotspot | click | 9.892 | 9.942 |
| fig | link | drag | 9.942 | 10.542 |
| fig | panel | run | 10.874 | 11.141 |
| fig | export | export | 11.499 | 12.199 |

## Exports that play

The first device lands 0.55 seconds after Export. Video and motion keep two 1.6-second plays followed by a 0.4-second return. Their viewer, playhead and devices share that clock, including withdrawal. Their held stills move 0.016668 seconds later than the incoming stills, to the first frame after all three labels finish their 0.4-second reveal.

UX/UI remains static before the shared export clock starts at the first landing, then has one 3.0-second cycle on all three canvas designs and all three devices: tap Video (0–0.15), wipe its red selection and picture (0.15–0.30), scroll up 40% (0.40–1.00), hold and tap/lift a card at 1.25, scroll back (1.55–2.15), tap Graphic design (2.15–2.30), wipe back (2.30–2.45), then hold. During the 0.4 s withdrawal, all three devices and canvas designs hold the completed cycle; no new tap or cycle starts. The existing thin progress rail advances through the cycle. Page pictures move through cropped viewports, with no page stretching; browser/status chrome stays. The still is at 1.10 seconds, scrolled in Video before the card tap. Return begins at landing + 3.0 seconds and lasts 0.4 seconds.

The laptop screen is 16:10, faces +z and leans back 12 degrees above its back-edge hinge. A simple keyboard and trackpad lie on the deck. The tablet and phone screens are 3:4 and 9:19.5. The laptop picture is widest and both gaps are 0.3 units. H10 moves the whole Figma row, its label anchors and its clipping slot forward by 0.4 world units. Its x footprint stays inside the old mat ends; the depth band translates with it. This keeps at least 15.730823 px between the complete laptop and app outline throughout the sampled scene, with 19.651534 px minimum Laptop ring clearance at S=103.6. The six-still fit envelope stays unchanged. The laptop still cuts in and slides 1.6 units in x over 0.5 seconds, without an entry clip. The tablet and phone retain their slot-feed motion relative to the shifted slot. All playback clocks and withdrawal timing stay. Phone visibility, frame appearance and browser layout remain external checks for this change. The Figma canvas uses those same three ratios in two rows 0.86 high. Its hotspot marks Video and ends beside its own frame; the inspector states On tap / Change to Video / Instant. No extra state frame is made.

## Labels on the exports

`calloutsAt(t)` is pure and returns the specified world marks, words, side, level and two wipe progresses. Photoshop and Illustrator return none. InDesign labels Flyer / LinkedIn post / Email; video labels YouTube / TikTok / Instagram; motion labels Website / Story / Feed post; UX/UI labels Laptop / Tablet / Phone.

Marks are on the top-left, bottom-middle and top-right faces, respectively; the laptop uses the top-left of its actual lid screen. Corner insets are 0.1 units, bottom middles 0.06; the laptop uses 0.08 along and 0.06 down. Each mark is a 3 px bright-red square surrounded by six equal dashes, turning at 60 degrees per hero second and stationary under reduced motion. Radius/stroke are 8/1.25 px, or 5.5/1 px below S=70. Paper leaders start 3 px outside the ring, run diagonally at 45 degrees, bend once and end horizontally. Upper elbows are 0.45 S above the mark; lower leaders share a level 0.45 S below the lowest low mark. Left/right word columns use the group’s left edge and screen’s right edge, with 0.35 S / 0.27 S offsets and 7 px word gaps. Both columns constrain the view fit. All left labels share one end x, moved outward as necessary; horizontal runs are at least 12 px, or 8 px below S=70. Elbows stay at least 3 px outward from line starts. Words clear all rings by radius + 2 px and all marks and lines. Page content can shorten a diagonal while keeping the run outward. Device anchors use their own landed bodies or fixed lid-screen face, independent of playback layers; InDesign anchors are unchanged.

Words are real uppercase Outfit 400, 11 px (9 below S=70), 1.2 line height, 0.12em spacing, without wrapping. The pointer-free, aria-hidden SVG/text overlay is above the canvas and below controls. Nothing is drawn below S=34. Nodes are reused. A mark/ring cuts in on its own landing, a line wipes for 0.25 seconds, then its words wipe for 0.15 seconds. Rows cut all labels at `off[0]`; InDesign holds its landing for 3.0 seconds (36.39–39.39 globally) and cuts labels at pickup. The InDesign reading still has none; all three later stills have complete labels. Seeks redraw immediately, including the overlay.

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
node design/journey-hero/take-2/tools/round5-checks.mjs
node design/journey-hero/take-2/tools/round5-controls.mjs --audit
node design/journey-hero/take-2/tools/round5-controls.mjs
node design/journey-hero/take-2/tools/round5-addendum-checks.mjs --out=design/journey-hero/take-2/.scratch/corrections5-addendum/report.json
node design/journey-hero/take-2/tools/round5-addendum-controls.mjs
node design/journey-hero/take-2/tools/round5-second-addendum-checks.mjs
node design/journey-hero/take-2/tools/round5-second-addendum-controls.mjs
node design/journey-hero/take-2/tools/round5-second-addendum-controls.mjs --audit
```

`checks.mjs --timeline` also prints the derived action table. `round5-checks.mjs --only=H1` (also H2, H3, H6, H7) isolates a computed gate. The addendum checker accepts `--only=H9`, `H10`, `H10-gap` or `H10-ring`; its optional report includes every Figma sample. `frameAt(t)` wraps positive and negative times. `SCENES[i]()` builds the new still; `SCENES[2]({ at })` still gives any booklet reading pose with the complete group out. The player supports `?t=12.5` and `window.__hero.seek(t)`, and exposes its clock, SHOW, LOOP and cached layout metrics. `window.__hero.measure()` clears the expanded target's inline left/width before reading the CSS stage; it then refreshes the view and target. `stage.html?s=0..5` holds a scene, `?t=` holds a loop time, `?atlas=1` shows every atlas page, and yaw/pitch inspect the geometry.

The external browser review can continue using `tools/sheet.mjs` and `tools/film.mjs`, including phone frames and the 0–91.498-second range. They were not run in the build itself; the browser review recorded under "The design being carried forward" ran them afterwards. The retained hardware reports describe incoming `48aea47`, including both D2 runs. Round 3 was not remeasured on hardware because it changes which pieces are drawn and where labels sit, not the renderer.

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

These are the committed incoming-build runs. Their flags retain the external review’s classification. Rounds 3–5 were not remeasured on hardware; round 8 removed the floor-hover shader, and its star field pass has no hardware performance evidence. The protected reports and sheets are unchanged. The earlier contact-sheet scale departure remains in those reports: frames are fitted to the 1600 px sheet cap; scan comparisons keep full capture resolution.

## Round-three computed checks and browser limit

`tools/browser-check.mjs` checks the labels at ten sizes: 390 × 664, 390 × 844, 360 × 780, 375 × 667, 412 × 915, 768 × 1024, 820 × 1180, 1024 × 768, 1440 × 900 and 1920 × 1080. Its command needs Playwright installed in the repository; without it, it reports the sizes as UNRUN and launches nothing. Its exported `checkBrowser(page)` can be run on a page from any Playwright. The builder's machine has no Playwright, so the reviewers ran `checkBrowser` on the packed preview of `50b51b8` and `7590b44` in the cloud: it passed at all ten sizes (150 rows). The exported route assertions also run in Node against parametric layout geometry, including their negative control. BUILD.md contains exact outputs and control edits.

Those round-three/four reviews used the historical 81.240-second loop. Round 5 used 83.040 seconds; round 7 uses 91.498 seconds, with the starts/stills in the current table above. The supplied review accepted the rest of round 5; the H9/H10 fixes await external browser/frame review. Numeric tests cover frame/plate continuity, drawing order, fixed marks, playback content, toolbar clearance, narrow-stage gutters, measurement stability and the full laptop/app gap. No hardware rerun or measurement entry point was invoked.
