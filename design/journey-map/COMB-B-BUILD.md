# COMB-B build record

## Verification result

The authorized changes are implemented and both packed pages are rebuilt. This build does not pass every gate in COMB-B.md.

- PASS: every required Node suite command, including whirl2-test, nova-test trail/sea pins, frame-performance-test, frame-render-test and comb-c-tail-test. Protected DEPTH/NOVA/STARS and coast/fill pins remain.
- PASS: origin-check at all eight sizes; rendered explore label/path checks at all four requested sizes and three zooms; native keyboard focus, counter and review-target checks at all eight sizes. Reduced-motion counter recovery also passed.
- FAIL: the final COMB-C p95 comparison passes six of eight rows. Standalone map -> Laurier is 79.20 ms against 50.10 ms; joined Laurier -> HMC is 45.90 ms against 41.70 ms. Earlier failed comparisons and all final trace summaries remain below. The frame loop preservation tests pass, but the no-worse-p95 acceptance gate is unmet. No passing performance score is claimed.
- INCOMPLETE: full horn framing under the shared zoom cap, the missing original maximum-zoom/keyboard before captures, and independent review. See the limitations and capture index.

| Page | Glide | COMB-C p95 ms | Final p95 ms | Result |
| --- | --- | ---: | ---: | --- |
| journey-map | map -> Laurier | 50.10 | 79.20 | FAIL |
| journey-map | Laurier -> HMC | 45.90 | 45.80 | PASS |
| journey-map | HMC again -> Interkom | 41.80 | 41.70 | PASS |
| journey-map | Interkom -> HMC again / Back | 45.90 | 37.50 | PASS |
| journey-joined | map -> Laurier | 45.90 | 45.90 | PASS |
| journey-joined | Laurier -> HMC | 41.70 | 45.90 | FAIL |
| journey-joined | HMC again -> Interkom | 45.80 | 41.70 | PASS |
| journey-joined | Interkom -> HMC again / Back | 45.80 | 41.70 | PASS |

Final budgets (all within their limits):

- gzip: hammer 16.14 KB / 30; all map modules + CSS 175.33 KB / 185
- gzip: dist/journey-map.html 291.63 KB / 320
- gzip: dist/journey-joined.html 512.10 KB / 540

Packed outputs: dist/journey-map.html 729686 bytes; dist/journey-joined.html 1283206 bytes. The last source change only restores counter visibility when reduced motion is enabled; that branch is not used by the steps-mode benchmark.

The installed [design-critique-loop skill](C:/Users/Admin/.codex/skills/design-critique-loop/SKILL.md) says: "If two independent reviewers are unavailable, do the useful self-checks but clearly state that this independent-review gate is incomplete; do not fabricate reviewers or pass scores." The task explicitly prohibits reviewer agents, so this report records self-checks and leaves that gate incomplete.

## Changes by brief item

- B1: Replaced the five disconnected puffs with one closed, varied ash canopy, overlapping bough edges, two branch windows and one direction of hatching. The trunk and four forks share one outline with three tapering roots, so there is no flat lid, foot seam or line through the well label. Kept the eagle and well rings. Omitted the unreadable squirrel and dragon; their empty animation hooks keep the existing clock intact. The crown footprint and horizontal root spread remain.
- B2: Replaced the radial white mist blobs with five layered wavy ink paths over a faint closed fill. The same wipe mask, coverage grid and clearing animation remain. The three glyphs are now rounded cairns with overlapping stones.
- B3: Replaced the five surfaced bands and repeated zipper scales with bowed body humps, narrow feet and broken waterlines. The submerged ring centreline, swallow waves, head and feeding animation remain. Added binding prongs to the calendar pad so its empty outline no longer stands alone as a checkbox.
- B4: All five shared dig glyphs now use a closed mound and a curved spade nick, with no crossing X or letter-like strokes. Dig stages, chest geometry and hit areas remain.
- B5: The horn tapers into a curled tip, with an elliptical mouth rim and two bands. Its view moves from [46,470,30] to [64,466,20], bringing the shore into the composition. The hammer has a heavy closed head, a short banded handle and the existing stone. See the framing limitation below.
- B6: Huginn carries a rolled note with folds; Muninn carries a small framed play symbol. Both replace the white bar/frame primitives while using the same carried item nodes, flight and set-down animation.
- B7: Every live game cell owns one complete round rim and boss, entirely inside that cell. Cell shapes are precomputed at sheet opening and batched into three paths during the existing game draw. Removed the oversized shields clipped across tile boundaries. The three walls, gaps, live-cell state and collision geometry remain.
- B8: Moved only T06 left by 8 units, T42 up by 5 and T60 up by 5. At the 360 phone fit, the named pairs have 2.30, 2.13 and 2.51 CSS px between their ink edges. Checked every neighbour of each moved pine; a preliminary sideways T60 offset was removed because it crowded T56. Density and glyphs remain.
- B9: Sounding the horn leaves scored ink on its body. Opening the hammer game leaves a pair of struck arcs on the stone. These are lasting drawing details, written at the existing found events, without a new frame task or colour-only state.
- B10: The detached count fades out in 180 ms with the departing bar and stays at zero through rush, blast, settle, end and explore opening. Removed the end-only position jump. It returns only in open explore, at its original place above the buttons. Map-beat and reduced-motion placement remain. A switch to reduced motion restores the count opacity after an end view.
- B11: Font metrics are measured at resize/font boundaries. Occupied drawing boxes, explore positions and sub-line thresholds are computed at the first explore entry and cached; an open explore view is remeasured on resize. The HMC and X names wrap only in explore; long sub-lines appear from a zoom where they fit. Included the surfaced serpent, shore ticks, actual stop rims, find markers, resting finds and wayfinder words. The existing transform/opacity writers consume cached values; there is no frame layout read, placement search, new markup or continuously animated sub-line fade. Some labels use sea gutters, including the X at the lower left and Lennard at the east on 360. These placements need the real-browser review for association as well as clearance.
- B12: Keyboard focus stays visible on the nova during build-up, loses its outline by the first flash and returns to Explore the map at the end if it was still on the nova. Cached attribute writes replace the old repeated focus writes. Pointer focus styling remains unchanged.
- B13: On the joined phone hero the review switch sits below the menu at the left. It stays there until the hero is hidden, then resumes its map position. Its 44 px button target remains. The dense-screen geometricPrecision rule is unchanged.

## Test changes

- tools/check.mjs: replaced the obsolete six-mist-ellipse and exactly-five-separated-crown-mass assertions with ink layers and one connected canopy. Retained crown inset/star spacing, all grove/coast/crossing, facts, geometry and gzip gates.
- tools/finds-test.mjs: re-recorded the sea digest for B3 and data/trip source digests for the authorized drawings, horn view and explore labels. Fill, coasts, DEPTH, NOVA and STARS pins remain. The shield test now records complete cell glyph strokes and verifies that losing a cell removes its rim and boss, replacing the obsolete clip-tile assertion.
- Added comb-b-art-test for the named crown boxes, all neighbours of moved pines, preserved hit rectangles and complete cell rims.
- Added comb-b-browser-test and comb-b-detail-test for local Edge captures and the real-font zoom mutation check.
- Added comb-b-layout-test for actual rendered label/drawing boxes and sampled trail/coast paths at four sizes and three zooms, plus native Tab/Enter nova focus, counter and review-control checks at all eight sizes.
- Added comb-b-suite-test and comb-b-cost-test to run the required commands, retain all output here and compare the COMB-C last-table p95 values. Original test failures are retained below, including stale drawing pins, a missing Node window fixture guard, label collisions and a subpixel counter fade tail. Those correctness failures were corrected before the final passing Node/browser runs. The timing comparison remains failed, as stated above.

## Capture index

All files below are local headless Edge captures. The shared overviews show every changed map drawing together. Unless marked DPR 1, captures use device scale 2. Before/after means the original baseline and the final build; after-prefixed files are intermediate studies and are not the final result.

- Shared B1-B9 overview, 412x730: [before-412x730-overview](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-412x730-overview.png) / [final-412x730-overview](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-overview.png). Shows each drawing beside its neighbours, labels, coasts and trail.
- B1 world tree, 412x730: [before-412x730-well](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-412x730-well.png) / [final-412x730-well](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-well.png). Whole ash, eagle, roots, well label and rings at the reachable well view.
- B2 mist, 412x730: [before-412x730-mist](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-412x730-mist.png) / [final-412x730-mist](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-mist.png). The same partly wiped mist state, blurred blobs versus layered ink and rounded cairns.
- B3 serpent, 412x730: [before-412x730-serpent](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-412x730-serpent.png) / [final-412x730-serpent](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-serpent.png). Calendar pad, head and nearest surfaced body at the find view; the overview shows all five stretches.
- B4 dig glyph, 412x730: [before-412x730-hoard-hmc1](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-412x730-hoard-hmc1.png) / [final-412x730-hoard-hmc1](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-hoard-hmc1.png). One shared mound glyph at the HMC hoard close view, used at all five places.
- B5 horn, 412x730: [before-412x730-horn](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-412x730-horn.png) / [final-412x730-horn](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-horn.png). Raised horn and west shore, with the unchanged popup; mouth/curl geometry and revised framing.
- B5 hammer, 412x730: [before-412x730-hammer](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-412x730-hammer.png) / [final-412x730-hammer-found](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-hammer-found.png). Baseline game-open view versus the final closed-game map view. The baseline sheet obscures the original map hammer; this before close-up is incomplete.
- B6 raven gift, 412x730: [before-412x730-raven-gift](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-412x730-raven-gift.png) / [final-412x730-raven-gift](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-raven-gift.png). Original carried bar versus a rolled note, on the same branch and bird rig.
- B7 shield wall, 412x730: [before-412x730-shield-wall](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-412x730-shield-wall.png) / [final-412x730-shield-wall](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-shield-wall.png). The live game field at DPR 2, clipped oversize shields versus complete cell rims.
- B9 lasting found signs, 412x730: [before-412x730-explore](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-412x730-explore.png) / [final-412x730-found-overview](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-found-overview.png). Original visited map with no horn/hammer sign, and the final map after sounding/playing. Baseline horn was raised, not sounded; found-state before evidence is limited.
- B10 counter, 412x730: [before-412x730-end](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-412x730-end.png) / [final-412x730-end](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-end.png). Original count over the end headline versus no count at the final end.
- B11 explore labels, 412x730: [before-412x730-explore](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-412x730-explore.png) / [final-412x730-explore-0](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-explore-0.png). Original sub-line collisions versus final rest placement and withheld sub-lines.
- B13 review switch, 412x730: [before-412x730-hero](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-412x730-hero.png) / [final-412x730-hero](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-hero.png). Original control over Journey versus the final position below the hero menu.
- [final-412x730-deep](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-deep.png): B1: actual maximum explore zoom across the ash and well; pan is needed to see the whole wide canopy at this scale.
- [final-412x730-crown-silhouette-wide](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-crown-silhouette-wide.png): B1: full outer silhouette at the well view, with inner strokes temporarily hidden for the study. The saved product retains its boughs and hatching.
- [final-412x730-north-grove](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-north-grove.png): B8: T06/T20 separated at maximum explore zoom.
- [final-412x730-east-grove](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-east-grove.png): B8: T41/T42 separated at maximum explore zoom.
- [final-412x730-south-grove](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-south-grove.png): B8: T57/T60 and both surrounding pines, at maximum explore zoom.
- [final-412x730-shield-wall-dpr1](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-shield-wall-dpr1.png): B7: complete game shield rims at device scale 1.
- [final-412x730-horn-found](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-horn-found.png): B9: sounded horn at rest with its lasting scored marks.
- [final-412x730-build-up](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-build-up.png): B12: keyboard focus ring while the nova can be pressed during build-up.
- [final-412x730-end](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-412x730-end.png): B12: no nova ring, with focus returned to Explore the map.
- Shared B1-B9 overview, 1440x900: [before-1440x900-overview](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-1440x900-overview.png) / [final-1440x900-overview](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-overview.png). Shows each drawing beside its neighbours, labels, coasts and trail.
- B1 world tree, 1440x900: [before-1440x900-well](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-1440x900-well.png) / [final-1440x900-well](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-well.png). Whole ash, eagle, roots, well label and rings at the reachable well view.
- B2 mist, 1440x900: [before-1440x900-mist](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-1440x900-mist.png) / [final-1440x900-mist](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-mist.png). The same partly wiped mist state, blurred blobs versus layered ink and rounded cairns.
- B3 serpent, 1440x900: [before-1440x900-serpent](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-1440x900-serpent.png) / [final-1440x900-serpent](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-serpent.png). Calendar pad, head and nearest surfaced body at the find view; the overview shows all five stretches.
- B4 dig glyph, 1440x900: [before-1440x900-hoard-hmc1](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-1440x900-hoard-hmc1.png) / [final-1440x900-hoard-hmc1](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-hoard-hmc1.png). One shared mound glyph at the HMC hoard close view, used at all five places.
- B5 horn, 1440x900: [before-1440x900-horn](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-1440x900-horn.png) / [final-1440x900-horn](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-horn.png). Raised horn and west shore, with the unchanged popup; mouth/curl geometry and revised framing.
- B5 hammer, 1440x900: [before-1440x900-hammer](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-1440x900-hammer.png) / [final-1440x900-hammer-found](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-hammer-found.png). Baseline game-open view versus the final closed-game map view. The baseline sheet obscures the original map hammer; this before close-up is incomplete.
- B6 raven gift, 1440x900: [before-1440x900-raven-gift](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-1440x900-raven-gift.png) / [final-1440x900-raven-gift](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-raven-gift.png). Original carried bar versus a rolled note, on the same branch and bird rig.
- B7 shield wall, 1440x900: [before-1440x900-shield-wall](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-1440x900-shield-wall.png) / [final-1440x900-shield-wall](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-shield-wall.png). The live game field at DPR 2, clipped oversize shields versus complete cell rims.
- B9 lasting found signs, 1440x900: [before-1440x900-explore](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-1440x900-explore.png) / [final-1440x900-found-overview](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-found-overview.png). Original visited map with no horn/hammer sign, and the final map after sounding/playing. Baseline horn was raised, not sounded; found-state before evidence is limited.
- B10 counter, 1440x900: [before-1440x900-end](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-1440x900-end.png) / [final-1440x900-end](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-end.png). Original count over the end headline versus no count at the final end.
- B11 explore labels, 1440x900: [before-1440x900-explore](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-1440x900-explore.png) / [final-1440x900-explore-0](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-explore-0.png). Original sub-line collisions versus final rest placement and withheld sub-lines.
- B13 review switch, 1440x900: [before-1440x900-hero](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/before-1440x900-hero.png) / [final-1440x900-hero](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-hero.png). Original control over Journey versus the final position below the hero menu.
- [final-1440x900-deep](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-deep.png): B1: actual maximum explore zoom across the ash and well; pan is needed to see the whole wide canopy at this scale.
- [final-1440x900-crown-silhouette-wide](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-crown-silhouette-wide.png): B1: full outer silhouette at the well view, with inner strokes temporarily hidden for the study. The saved product retains its boughs and hatching.
- [final-1440x900-north-grove](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-north-grove.png): B8: T06/T20 separated at maximum explore zoom.
- [final-1440x900-east-grove](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-east-grove.png): B8: T41/T42 separated at maximum explore zoom.
- [final-1440x900-south-grove](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-south-grove.png): B8: T57/T60 and both surrounding pines, at maximum explore zoom.
- [final-1440x900-shield-wall-dpr1](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-shield-wall-dpr1.png): B7: complete game shield rims at device scale 1.
- [final-1440x900-horn-found](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-horn-found.png): B9: sounded horn at rest with its lasting scored marks.
- [final-1440x900-build-up](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-build-up.png): B12: keyboard focus ring while the nova can be pressed during build-up.
- [final-1440x900-end](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-b/final-1440x900-end.png): B12: no nova ring, with focus returned to Explore the map.

For 390x844 and 360x640, final-<size>-explore-0.png, -explore-1.png and -explore-2.png show rest, intermediate and maximum zoom. The same three captures also exist at 412x730 and 1440x900. Their actual box/path measurements are in the layout-test output below. Original keyboard build-up/flash captures were not taken; the before end images above are structural baselines, not before keyboard-ring evidence.

## Scope limitations and review handoff

- No reviewer agents were started. The independent design-critique-loop gate is incomplete under the explicit task prohibition; the checks here are implementation self-checks, without scores.
- The horn camera is improved within its permitted view data. The shared focus zoom cap still limits how much of the viewport its small drawing fills, and the sky dots remain. Changing tripFocus or the sky/depth rendering is outside this write scope, so that part of B5 is left for review rather than bypassing the cap.
- The original before captures include both overview sizes and each find's close view. The initial deepest-zoom capture command targeted a nonexistent control, so the before-deep files are overview duplicates and are not evidence of maximum zoom. Before maximum-zoom tree/grove studies and a separate unobscured hammer map close-up are missing. After captures include actual maximum zoom and DPR 1/2 shields. No reconstructed original is presented as a before capture.
- The external review should judge the ash edge/forks at normal size and close up, the serpent's body humps in the whole sea, whether the small lasting horn/hammer signs read clearly enough at overview, the horn framing, and the association of sea-gutter explore labels with their stops. Numerical box clearance is not a visual-quality verdict.
- An external project-notes file was not created because the task permits only this report and the listed source/test/output paths. This report carries the acceptance record and departures.

Scope: B1-B13 in COMB-B.md. Only the explicit write allowlist is used.

Acceptance criteria before editing:
- Preserve the dark chart, thin Paper ink, coasts, trail, find hit geometry and animation clocks.
- Read each drawing as its subject in context at phone and desktop overview and at its reachable close view.
- Give Yggdrasil a connected leafy silhouette, clean forks and three tapering roots; keep the eagle and well; omit the tiny creatures if they cannot read.
- Replace blurred mist and letter-like ground scratches with deliberate ink shapes; keep wiping and digging.
- Fit complete shield rims in live game cells without changing collision geometry.
- Give horn and hammer lasting ink signs, and separate the three named tree pairs by their crown boxes.
- Hide the counter during rush, blast, end and explore opening; restore it in open explore clear of controls.
- Keep keyboard focus visible only during actionable nova build-up and return it to Explore at the end.
- Keep the review control's 44 px target clear of the hero and journey controls.
- Place explore labels with at least 4 CSS px clearance from drawing boxes, coast ticks, markers and trail at four sizes and three zooms, with sub-lines withheld until they fit.
- Add no new per-frame drawing or label DOM writes; preserve nova-test's trail and sea pins, dense-screen text and COMB-C tails.

Evidence and limitations:
- Read BRIEF.md, COMB-B.md, AUDIT-R2.md, the named tree inventory, current source and the approved sheet-map.jpg.
- Read installed UI routing, Impeccable polish/craft and design-critique-loop guidance. CLI context loading is omitted because launchers may download or write outside the allowlist. The supplied project record and artifacts provide the constraints.
- Independent critique is incomplete: this task explicitly forbids all reviewer agents. No scores or independent verdicts are claimed.
- RTK is not installed/on PATH. Its attempted invocation returned CommandNotFoundException. Direct local commands are used; nothing was installed.

Implementation, captures and test output follow below.

## node --check art.mjs (exit 0)

```text
(no output)
```

## node --check cards.mjs (exit 0)

```text
(no output)
```

## node --check data.mjs (exit 0)

```text
(no output)
```

## node --check depth.mjs (exit 0)

```text
(no output)
```

## node --check explore.mjs (exit 0)

```text
(no output)
```

## node --check findall.mjs (exit 0)

```text
(no output)
```

## node --check findcreatures.mjs (exit 0)

```text
(no output)
```

## node --check findhammer.mjs (exit 0)

```text
(no output)
```

## node --check findhoards.mjs (exit 0)

```text
(no output)
```

## node --check findhorn.mjs (exit 0)

```text
(no output)
```

## node --check findkit.mjs (exit 0)

```text
(no output)
```

## node --check finds.mjs (exit 0)

```text
(no output)
```

## node --check findsheets.mjs (exit 0)

```text
(no output)
```

## node --check findwater.mjs (exit 0)

```text
(no output)
```

## node --check footer.mjs (exit 0)

```text
(no output)
```

## node --check footname.mjs (exit 0)

```text
(no output)
```

## node --check hammer.mjs (exit 0)

```text
(no output)
```

## node --check join.mjs (exit 0)

```text
(no output)
```

## node --check main.mjs (exit 0)

```text
(no output)
```

## node --check pace.mjs (exit 0)

```text
(no output)
```

## node --check stars.mjs (exit 0)

```text
(no output)
```

## node --check steps.mjs (exit 0)

```text
(no output)
```

## node --check timeline.mjs (exit 0)

```text
(no output)
```

## node --check trip.mjs (exit 0)

```text
(no output)
```

## node --check tools/audit-capture.mjs (exit 0)

```text
(no output)
```

## node --check tools/check.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-a-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-behaviour-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-browser.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-legend-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-record-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-tail-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-close-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-extra-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-joined-reduced-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-reduced-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-reopen-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/depth-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/explore-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/finds-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-cost.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-performance-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-render-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-visual-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/hammer-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/layout-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/motion-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/nova-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/origin-check.mjs (exit 0)

```text
(no output)
```

## node --check tools/pack-joined.mjs (exit 0)

```text
(no output)
```

## node --check tools/pack.mjs (exit 0)

```text
(no output)
```

## node --check tools/steps-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/whirl2-test.mjs (exit 0)

```text
(no output)
```

## node tools/check.mjs (exit 1)

```text
file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/check.mjs:91
ok(FIND_PLAY.mist.ellipses.length === 6 && FIND_PLAY.mist.cairns.length === 3 && FIND_PLAY.mist.grid.join() === '8,4', 'six fog ellipses, three cairns and 8x4 coverage grid');
                           ^

TypeError: Cannot read properties of undefined (reading 'length')
    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/check.mjs:91:28
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v26.7.0
```

## node tools/steps-test.mjs (exit 0)

```text
ok: paceT strictly rises; paceP round trips every whole P and the rest boundary within 1e-6
move | forward seconds | back seconds
top -> map | 4.100 | 2.460
map -> laurier | 3.813 | 3.813
laurier -> hmc1 | 3.841 | 3.841
hmc1 -> mohawk | 4.053 | 4.053
mohawk -> hmc2 | 4.200 | 4.200
hmc2 -> interkom | 3.345 | 3.345
interkom -> lennard | 3.834 | 3.834
lennard -> x | 2.600 | 2.600
x -> end | 5.900 | 3.540
ok: all 18 moves start/end correctly and never turn back; D4 glides use equal 2.6-4.4 s durations both ways; X-to-end keeps the 3 s rush plus blast/settle
ok: D4 map title top/map wheel and touch, 120 ms easing, 10/30 percent settle, clamps, Start/Set out lock, Back reset, flicks, owned drags and taps
ok: D4 joined hero top/map wheel and touch, 120 ms easing, 10/30 percent settle, clamps, Start/Set out lock, Back reset, flicks, owned drags and taps
ok: address cannot select Scroll; review only Depth; locked wheel never steps; only end CTA explores; two Back presses return then step; keyboard still advances
ok: C1 1440x900 20 repeated Next keys preserve 5904 ms arrival; repeated Back returns only to X
ok: C1 412x730 20 repeated Next keys preserve 5904 ms arrival; repeated Back returns only to X
ok: ORIGIN 50 ms desktop/phone open and reverse-close recording: tail stays on rim through tilt; shield never scales with the face or fades; X is inside the header
ok: six card X controls; local reopen focuses X without scrolling; mid-move X cannot focus departed mark; departure forgets override; reduced-motion list has no X
D5 pace 1440 joined leave: incoming 121.481481, outgoing 121.481487 P/s; cross-frame change 2.954143, uninterrupted maximum 45.843915 P/s; arrival 0.352 s; PASS
D5 pace 1440 joined fall: incoming 46.857143, outgoing 46.857145 P/s; cross-frame change 0.472015, uninterrupted maximum 45.843915 P/s; arrival 0.944 s; PASS
D5 pace 1440 X rush: incoming 28.348348, outgoing 28.348350 P/s; cross-frame change 0.306336, uninterrupted maximum 21.554523 P/s; arrival 0.720 s; PASS
D5 pace 390 joined leave: incoming 121.481481, outgoing 121.481487 P/s; cross-frame change 2.954143, uninterrupted maximum 45.843915 P/s; arrival 0.352 s; PASS
D5 pace 390 joined fall: incoming 46.857143, outgoing 46.857145 P/s; cross-frame change 0.472015, uninterrupted maximum 45.843915 P/s; arrival 0.944 s; PASS
D5 pace 390 X rush: incoming 28.348348, outgoing 28.348350 P/s; cross-frame change 0.306336, uninterrupted maximum 21.554523 P/s; arrival 0.720 s; PASS
ok: joined leave/fall and X rush Back carry exact dP/dt, meet the uninterrupted 16 ms continuity gate, turn within their beat and settle exactly
ok: X frame/phone box clear controls; rush through settle hides stepper and restores main focus
```

## node tools/nova-test.mjs (exit 0)

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is available for live reduced-motion switching
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 standalone: added 144; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 standalone 1.00s: 271.41 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.00s: 802.49 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.50s: 980.73 px/s, 157/168 on way
WHIRL 1440x900 standalone 2.90s: 998.14 px/s, 52/168 on way
WHIRL 1440x900 standalone 2.98s: 1115.28 px/s, 31/168 on way
WHIRL 1440x900 standalone: minimum 271.41 px/s vs 271.41 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 standalone: added 80; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 standalone 1.00s: 127.09 px/s, 96/96 on way
WHIRL 412x730 standalone 2.00s: 336.72 px/s, 96/96 on way
WHIRL 412x730 standalone 2.50s: 400.63 px/s, 90/96 on way
WHIRL 412x730 standalone 2.90s: 403.38 px/s, 30/96 on way
WHIRL 412x730 standalone 2.98s: 404.07 px/s, 18/96 on way
WHIRL 412x730 standalone: minimum 127.09 px/s vs 127.09 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 standalone: added 80; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 map: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 standalone 1.00s: 131.37 px/s, 96/96 on way
WHIRL 390x844 standalone 2.00s: 332.59 px/s, 96/96 on way
WHIRL 390x844 standalone 2.50s: 404.63 px/s, 90/96 on way
WHIRL 390x844 standalone 2.90s: 445.40 px/s, 30/96 on way
WHIRL 390x844 standalone 2.98s: 490.87 px/s, 18/96 on way
WHIRL 390x844 standalone: minimum 131.37 px/s vs 131.37 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 standalone: added 80; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 standalone 1.00s: 110.53 px/s, 96/96 on way
WHIRL 360x640 standalone 2.00s: 297.61 px/s, 96/96 on way
WHIRL 360x640 standalone 2.50s: 357.20 px/s, 90/96 on way
WHIRL 360x640 standalone 2.90s: 400.54 px/s, 30/96 on way
WHIRL 360x640 standalone 2.98s: 445.19 px/s, 18/96 on way
WHIRL 360x640 standalone: minimum 110.53 px/s vs 110.53 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 joined 1200: added 2; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 joined 1.00s: 305.59 px/s, 168/168 on way
WHIRL 1440x900 joined 2.00s: 868.53 px/s, 168/168 on way
WHIRL 1440x900 joined 2.50s: 1044.04 px/s, 157/168 on way
WHIRL 1440x900 joined 2.90s: 1093.23 px/s, 52/168 on way
WHIRL 1440x900 joined 2.98s: 1221.24 px/s, 31/168 on way
WHIRL 1440x900 joined: minimum 305.59 px/s vs 305.59 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 joined 278: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 joined 278: added 79; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 joined 1.00s: 109.12 px/s, 96/96 on way
WHIRL 412x730 joined 2.00s: 309.01 px/s, 96/96 on way
WHIRL 412x730 joined 2.50s: 377.79 px/s, 90/96 on way
WHIRL 412x730 joined 2.90s: 415.79 px/s, 30/96 on way
WHIRL 412x730 joined 2.98s: 532.71 px/s, 18/96 on way
WHIRL 412x730 joined: minimum 109.12 px/s vs 109.12 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 305: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 305: added 78; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 305: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 joined 1.00s: 110.39 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 299.25 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 363.45 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 413.50 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 521.90 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 110.39 px/s vs 110.39 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 joined 213: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 joined 213: added 81; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 joined 1.00s: 95.37 px/s, 96/96 on way
WHIRL 360x640 joined 2.00s: 274.00 px/s, 96/96 on way
WHIRL 360x640 joined 2.50s: 331.58 px/s, 90/96 on way
WHIRL 360x640 joined 2.90s: 371.06 px/s, 30/96 on way
WHIRL 360x640 joined 2.98s: 470.46 px/s, 18/96 on way
WHIRL 360x640 joined: minimum 95.37 px/s vs 95.37 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 240: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 240: added 77; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 240: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 joined 1.00s: 117.65 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 306.06 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 372.39 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 461.79 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 586.97 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 117.65 px/s vs 117.65 at 1s; minimum on way 17.71%; last 3.000000s
ok: WHIRL balanced visible sectors, own-side ring approach, continuous drain through last frame, speed/5%/last-arrival gates and rising late heat/core/glow alpha
ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged
```

## node tools/depth-test.mjs (exit 0)

```text
ok 1440x900: whole-map clouds intact/deck hidden; all high cloud/deck heights passed at dive end and every whole hold/leg/legX P; 10 low clouds stay, outside the frame
ok 1440x900: all 6 leg midpoints have mist visibility >0.5; camera boundaries agree within 1e-6; longest leg rises; pointer leaves ground fixed
ok 1440x900: D4 depth off keeps held scale continuously on ordinary glides; C1 X fit has its own camera
ok 1440x900: every find/phone/chest/wide view and explore zoom, k in .05 steps, deck follows tripS
ok 390x844: whole-map clouds intact/deck hidden; all high cloud/deck heights passed at dive end and every whole hold/leg/legX P; 10 low clouds stay, outside the frame
ok 390x844: all 6 leg midpoints have mist visibility >0.5; camera boundaries agree within 1e-6; longest leg rises; pointer leaves ground fixed
ok 390x844: D4 depth off keeps held scale continuously on ordinary glides; C1 X fit has its own camera
ok 390x844: every find/phone/chest/wide view and explore zoom, k in .05 steps, deck follows tripS
ok 1440x900: recording canvas preserves all 1200 hero positions at switch; sky freezes; nova continues; still drawing ignores motion clocks
ok 390x844: recording canvas preserves all 240 hero positions at switch; sky freezes; nova continues; still drawing ignores motion clocks
ok: presses stack independently; first expires on time; cap rejects without mutation; additive shares clamp; expired flares leave the list
ok: gather endpoints and continuous ring tangent for 32 arrival angles; explore restores depth fade
```

## node tools/layout-test.mjs (exit 0)

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

## node tools/explore-test.mjs (exit 0)

```text
ok: desktop/phone zoom limits, bounded/centred cameras, fixed zoom anchor, damped glides with no overshoot, layer/inverse round trips
ok: end-only CTA entry, input takeover, pan/release, resize, exit and immediate departure reset; P and traveller unchanged
ok: copied name curves monotone, lens/rest geometry and knock spring settling
ok: arrows pan during explore without changing P; Escape ends explore
ok: actual footer fades in linear time, is gone by 600 ms, returns over last 500 ms of exit, and stays inert while exploring
ok: FRAMES stationary pointer cancellation wakes one raster commit, then returns to idle
ok: capture-phase pinch on nova/stop/horn; nova taps; owned single drags; drag-only pointer clicks; key/end/depart/reset/down/500 ms suppression clearing; temporary world promotion
ok: D3 real findsBuild horn/chest/beacon pinches at 0/30/100 ms preserve found/stage and zoom >=20%; taps act once, chest hold repeats, owned drags aim/wipe/turn and press drags pan
```

## node tools/finds-test.mjs (exit 1)

```text
node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

94403 !== 100054

    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/finds-test.mjs:27:72
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: 94403,
  expected: 100054,
  operator: 'strictEqual',
  diff: 'simple'
}

Node.js v26.7.0
```

## node tools/motion-test.mjs (exit 0)

```text
view | move | measured seconds | centre peak px/s | five-point peak px/s | centre acceleration px/s^2
1440x900 | map->laurier | 3.824 | 226.46 | 383.45 | 528.63 @ 3488
1440x900 | laurier->map | 3.824 | 225.23 | 380.47 | 526.12 @ 352
1440x900 | laurier->hmc1 | 3.856 | 374.73 | 382.21 | 550.59 @ 368
1440x900 | hmc1->laurier | 3.856 | 374.07 | 383.61 | 558.24 @ 1504
1440x900 | hmc1->mohawk | 4.064 | 378.18 | 388.46 | 721.75 @ 1600
1440x900 | mohawk->hmc1 | 4.064 | 379.77 | 386.83 | 694.95 @ 2496
1440x900 | mohawk->hmc2 | 4.208 | 419.76 | 424.12 | 736.72 @ 2464
1440x900 | hmc2->mohawk | 4.208 | 420.32 | 425.49 | 741.84 @ 1776
1440x900 | hmc2->interkom | 3.360 | 290.50 | 291.60 | 494.00 @ 1696
1440x900 | interkom->hmc2 | 3.360 | 290.52 | 291.71 | 492.37 @ 1680
1440x900 | interkom->lennard | 3.840 | 414.00 | 422.55 | 1021.32 @ 1680
1440x900 | lennard->interkom | 3.840 | 416.58 | 421.07 | 1003.31 @ 2192
1440x900 | lennard->x | 2.608 | 170.15 | 179.17 | 416.84 @ 2320
1440x900 | x->lennard | 2.608 | 170.66 | 179.75 | 415.87 @ 304
390x844 | map->laurier | 3.968 | 139.30 | 221.15 | 311.15 @ 3632
390x844 | laurier->map | 3.968 | 138.60 | 219.75 | 309.67 @ 368
390x844 | laurier->hmc1 | 4.000 | 194.52 | 194.94 | 291.22 @ 384
390x844 | hmc1->laurier | 4.000 | 194.52 | 194.94 | 292.70 @ 3648
390x844 | hmc1->mohawk | 4.240 | 193.90 | 194.27 | 267.13 @ 432
390x844 | mohawk->hmc1 | 4.240 | 193.69 | 194.40 | 268.55 @ 3840
390x844 | mohawk->hmc2 | 4.400 | 233.59 | 234.12 | 311.29 @ 4016
390x844 | hmc2->mohawk | 4.400 | 233.61 | 234.01 | 309.81 @ 416
390x844 | hmc2->interkom | 3.440 | 136.66 | 136.99 | 223.74 @ 3136
390x844 | interkom->hmc2 | 3.440 | 136.65 | 136.98 | 222.92 @ 336
390x844 | interkom->lennard | 4.000 | 223.60 | 224.24 | 333.67 @ 368
390x844 | lennard->interkom | 4.000 | 223.57 | 224.43 | 335.29 @ 3648
390x844 | lennard->x | 2.608 | 81.17 | 103.46 | 290.08 @ 2400
390x844 | x->lennard | 2.608 | 81.26 | 103.83 | 290.01 @ 240
D5 view | press | runs | worst centre acceleration | five-point peak | arrival range s | total range s
1440x900 | Back | 42 | 1703.88 | 838.77 | 0.656-4.176 | 0.656-4.176
1440x900 | hurry | 49 | 4319.97 | 1755.52 | 0.464-4.768 | 0.464-5.056
1440x900 | Next-reverse | 42 | 1727.01 | 815.11 | 0.720-4.176 | 0.720-4.176
1440x900 | Back-Next | 7 | 1119.42 | 524.20 | 1.152-1.872 | 1.456-2.176
1440x900 | go-back | 14 | 1687.93 | 838.77 | 1.312-2.928 | 1.312-2.928
1440x900 | go-next | 14 | 1725.25 | 815.11 | 1.312-2.656 | 1.312-2.656
390x844 | Back | 42 | 1006.19 | 461.68 | 0.656-4.368 | 0.656-4.368
390x844 | hurry | 49 | 2530.15 | 950.09 | 0.464-6.720 | 0.464-7.024
390x844 | Next-reverse | 42 | 1011.15 | 461.68 | 0.768-4.368 | 0.768-4.368
390x844 | Back-Next | 7 | 714.22 | 282.55 | 1.152-1.952 | 1.456-2.256
390x844 | go-back | 14 | 925.68 | 461.68 | 1.312-2.224 | 1.312-2.224
390x844 | go-next | 14 | 890.26 | 461.68 | 1.312-2.224 | 1.312-2.224
ok: 28 rest glides, 336 carry runs and 14 late-hurry guards; 16 ms acceleration/five probes, analytic continuity, bounded reversals through 99 percent, exact settled arrivals, faster feasible hurry and fresh set(P) equality
```

## node tools/hammer-test.mjs (exit 0)

```text
ok: D3 foe heights incl stroke: giants/chief 16, hunched draugr 11, low full-width wolf 8; wave 1 varies; five overlapping shields span each unchanged segment
ok: original Norse foe silhouettes and their strokes fit unchanged hit boxes
ok: identical seeds and inputs match step for step
ok: 350 seeded formations/bosses fit their wave rows; unique fates; clay at 60%, heart at 30%
ok: 34 per-level rune effect checks; excluded runes absent
ok: cold includes both flights and glove; heat splits twice; draugr rises once; need multiplies the return upgrade; exposed stone heart doubles a hit
ok: return/catch, first-hit memory, shields, bridge loss; pool sizes and identities unchanged after 10,000 steps
steady: 200 seeds; wave 4 74.0%; wins 17.5%; ended by wave 3 26.0%; longest 223.6s; 0.00083 ms/step; 1.8s wall
ends {"6:bridge":6,"7:won":35,"5:bridge":10,"3:hearts":35,"5:hearts":42,"6:hearts":14,"4:hearts":28,"4:bridge":8,"2:hearts":12,"3:bridge":3,"7:hearts":5,"2:bridge":1,"1:hearts":1}
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00092 ms/step; 2.8s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

## node tools/frame-cost-test.mjs (exit 0)

```text
ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature
ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work
```

## node tools/frame-performance-test.mjs (exit 0)

```text
AFTER 412x730 / 72 moving frames: #cam writes 7; label writes 297; recovery 16 frames / 266.7 ms
ok: bounded pinch rasters agree with virtual camera; <=10% label settle steps; 250 ms recovery; translation-only raster; 50 real opening camera writes; interrupted zoom, resize/exit cleanup and zero idle writes
```

## node tools/frame-render-test.mjs (exit 0)

```text
phone explore zoom 1: scratch pixels cleared 3609120 -> 871895 (75.8% less); same drawing commands
phone explore zoom 2: scratch pixels cleared 3609120 -> 1037640 (71.2% less); same drawing commands
phone explore zoom 3: scratch pixels cleared 3609120 -> 760250 (78.9% less); same drawing commands
ok: 21 desktop/phone/1200-star WHIRL2 drawing-command snapshots; original blast primitives pinned by whirl2-test; not a pixel comparison
```

## node tools/whirl2-test.mjs (exit 0)

```text
ok: 1440x900/map 29 trip/find stills; added 144; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 412x730/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 360x640/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 1440x900/1200 29 trip/find stills; added 2; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 412x730/278 29 trip/find stills; added 79; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/305 29 trip/find stills; added 78; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 360x640/213 29 trip/find stills; added 81; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/240 29 trip/find stills; added 77; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: all sector targets survive full pointer look and 16 hero-dwell cases (1/5/30/120 s); no late creation or replacement
ok: WHIRL2 261 trail/sea still comparisons; 45 unchanged blast/remnant primitive comparisons (not pixels); source 0ea9f4bac16d6872c9f3798e45a58d9cbd5e461bdaab825cd3f70e1b2e17c246
```

## node tools/comb-c-tail-test.mjs (exit 0)

```text
1440x900: bounded tail max 38.000 px, proportional base, closed tail hidden
1024x600: bounded tail max 29.808 px, proportional base, closed tail hidden
412x730: bounded tail max 14.000 px, proportional base, closed tail hidden
390x844: bounded tail max 14.000 px, proportional base, closed tail hidden
360x640: bounded tail max 14.000 px, proportional base, closed tail hidden
844x390: bounded tail max 21.000 px, proportional base, closed tail hidden
ok: 1092 projected card samples; 360 ember/coast rays
```

## node --check art.mjs (exit 0)

```text
(no output)
```

## node --check cards.mjs (exit 0)

```text
(no output)
```

## node --check data.mjs (exit 0)

```text
(no output)
```

## node --check depth.mjs (exit 0)

```text
(no output)
```

## node --check explore.mjs (exit 0)

```text
(no output)
```

## node --check findall.mjs (exit 0)

```text
(no output)
```

## node --check findcreatures.mjs (exit 0)

```text
(no output)
```

## node --check findhammer.mjs (exit 0)

```text
(no output)
```

## node --check findhoards.mjs (exit 0)

```text
(no output)
```

## node --check findhorn.mjs (exit 0)

```text
(no output)
```

## node --check findkit.mjs (exit 0)

```text
(no output)
```

## node --check finds.mjs (exit 0)

```text
(no output)
```

## node --check findsheets.mjs (exit 0)

```text
(no output)
```

## node --check findwater.mjs (exit 0)

```text
(no output)
```

## node --check footer.mjs (exit 0)

```text
(no output)
```

## node --check footname.mjs (exit 0)

```text
(no output)
```

## node --check hammer.mjs (exit 0)

```text
(no output)
```

## node --check join.mjs (exit 0)

```text
(no output)
```

## node --check main.mjs (exit 0)

```text
(no output)
```

## node --check pace.mjs (exit 0)

```text
(no output)
```

## node --check stars.mjs (exit 0)

```text
(no output)
```

## node --check steps.mjs (exit 0)

```text
(no output)
```

## node --check timeline.mjs (exit 0)

```text
(no output)
```

## node --check trip.mjs (exit 0)

```text
(no output)
```

## node --check tools/audit-capture.mjs (exit 0)

```text
(no output)
```

## node --check tools/check.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-a-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-behaviour-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-browser.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-legend-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-record-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-tail-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-close-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-extra-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-joined-reduced-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-reduced-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-reopen-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/depth-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/explore-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/finds-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-cost.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-performance-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-render-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-visual-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/hammer-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/layout-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/motion-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/nova-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/origin-check.mjs (exit 0)

```text
(no output)
```

## node --check tools/pack-joined.mjs (exit 0)

```text
(no output)
```

## node --check tools/pack.mjs (exit 0)

```text
(no output)
```

## node --check tools/steps-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/whirl2-test.mjs (exit 0)

```text
(no output)
```

## node tools/check.mjs (exit 1)

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 16.14 KB / 30; all map modules + CSS 175.00 KB / 185
gzip: dist/journey-map.html 291.31 KB / 320
gzip: dist/journey-joined.html 511.77 KB / 540
FAIL
 - D3 ash crown needs exactly five masses
 - D3 crown wider than tall
 - D3 supporting limbs must be below all opaque foliage
 - D3 invisible ground fill occludes limbs
 - D3 broken leaf-clump edges and limb-direction hatch
 - well star inside actual ash foliage: 260,328
 - well star inside actual ash foliage: 280,314
 - well star inside actual ash foliage: 302,310
 - well star inside actual ash foliage: 327,313
 - well star inside actual ash foliage: 354,326
 - well star inside actual ash foliage: 256,335
 - well star inside actual ash foliage: 274,321
 - well star inside actual ash foliage: 294,318
 - well star inside actual ash foliage: 333,322
 - well star inside actual ash foliage: 362,334
 - well star inside actual ash foliage: 265,317
 - well star inside actual ash foliage: 287,305
 - well star inside actual ash foliage: 312,305
 - well star inside actual ash foliage: 341,311
 - well star inside actual ash foliage: 347,334
```

## node tools/steps-test.mjs (exit 0)

```text
ok: paceT strictly rises; paceP round trips every whole P and the rest boundary within 1e-6
move | forward seconds | back seconds
top -> map | 4.100 | 2.460
map -> laurier | 3.813 | 3.813
laurier -> hmc1 | 3.841 | 3.841
hmc1 -> mohawk | 4.053 | 4.053
mohawk -> hmc2 | 4.200 | 4.200
hmc2 -> interkom | 3.345 | 3.345
interkom -> lennard | 3.834 | 3.834
lennard -> x | 2.600 | 2.600
x -> end | 5.900 | 3.540
ok: all 18 moves start/end correctly and never turn back; D4 glides use equal 2.6-4.4 s durations both ways; X-to-end keeps the 3 s rush plus blast/settle
ok: D4 map title top/map wheel and touch, 120 ms easing, 10/30 percent settle, clamps, Start/Set out lock, Back reset, flicks, owned drags and taps
ok: D4 joined hero top/map wheel and touch, 120 ms easing, 10/30 percent settle, clamps, Start/Set out lock, Back reset, flicks, owned drags and taps
ok: address cannot select Scroll; review only Depth; locked wheel never steps; only end CTA explores; two Back presses return then step; keyboard still advances
ok: C1 1440x900 20 repeated Next keys preserve 5904 ms arrival; repeated Back returns only to X
ok: C1 412x730 20 repeated Next keys preserve 5904 ms arrival; repeated Back returns only to X
ok: ORIGIN 50 ms desktop/phone open and reverse-close recording: tail stays on rim through tilt; shield never scales with the face or fades; X is inside the header
ok: six card X controls; local reopen focuses X without scrolling; mid-move X cannot focus departed mark; departure forgets override; reduced-motion list has no X
D5 pace 1440 joined leave: incoming 121.481481, outgoing 121.481487 P/s; cross-frame change 2.954143, uninterrupted maximum 45.843915 P/s; arrival 0.352 s; PASS
D5 pace 1440 joined fall: incoming 46.857143, outgoing 46.857145 P/s; cross-frame change 0.472015, uninterrupted maximum 45.843915 P/s; arrival 0.944 s; PASS
D5 pace 1440 X rush: incoming 28.348348, outgoing 28.348350 P/s; cross-frame change 0.306336, uninterrupted maximum 21.554523 P/s; arrival 0.720 s; PASS
D5 pace 390 joined leave: incoming 121.481481, outgoing 121.481487 P/s; cross-frame change 2.954143, uninterrupted maximum 45.843915 P/s; arrival 0.352 s; PASS
D5 pace 390 joined fall: incoming 46.857143, outgoing 46.857145 P/s; cross-frame change 0.472015, uninterrupted maximum 45.843915 P/s; arrival 0.944 s; PASS
D5 pace 390 X rush: incoming 28.348348, outgoing 28.348350 P/s; cross-frame change 0.306336, uninterrupted maximum 21.554523 P/s; arrival 0.720 s; PASS
ok: joined leave/fall and X rush Back carry exact dP/dt, meet the uninterrupted 16 ms continuity gate, turn within their beat and settle exactly
ok: X frame/phone box clear controls; rush through settle hides stepper and restores main focus
```

## node tools/nova-test.mjs (exit 0)

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is available for live reduced-motion switching
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 standalone: added 144; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 standalone 1.00s: 271.41 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.00s: 802.49 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.50s: 980.73 px/s, 157/168 on way
WHIRL 1440x900 standalone 2.90s: 998.14 px/s, 52/168 on way
WHIRL 1440x900 standalone 2.98s: 1115.28 px/s, 31/168 on way
WHIRL 1440x900 standalone: minimum 271.41 px/s vs 271.41 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 standalone: added 80; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 standalone 1.00s: 127.09 px/s, 96/96 on way
WHIRL 412x730 standalone 2.00s: 336.72 px/s, 96/96 on way
WHIRL 412x730 standalone 2.50s: 400.63 px/s, 90/96 on way
WHIRL 412x730 standalone 2.90s: 403.38 px/s, 30/96 on way
WHIRL 412x730 standalone 2.98s: 404.07 px/s, 18/96 on way
WHIRL 412x730 standalone: minimum 127.09 px/s vs 127.09 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 standalone: added 80; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 map: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 standalone 1.00s: 131.37 px/s, 96/96 on way
WHIRL 390x844 standalone 2.00s: 332.59 px/s, 96/96 on way
WHIRL 390x844 standalone 2.50s: 404.63 px/s, 90/96 on way
WHIRL 390x844 standalone 2.90s: 445.40 px/s, 30/96 on way
WHIRL 390x844 standalone 2.98s: 490.87 px/s, 18/96 on way
WHIRL 390x844 standalone: minimum 131.37 px/s vs 131.37 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 standalone: added 80; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 standalone 1.00s: 110.53 px/s, 96/96 on way
WHIRL 360x640 standalone 2.00s: 297.61 px/s, 96/96 on way
WHIRL 360x640 standalone 2.50s: 357.20 px/s, 90/96 on way
WHIRL 360x640 standalone 2.90s: 400.54 px/s, 30/96 on way
WHIRL 360x640 standalone 2.98s: 445.19 px/s, 18/96 on way
WHIRL 360x640 standalone: minimum 110.53 px/s vs 110.53 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 joined 1200: added 2; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 joined 1.00s: 305.59 px/s, 168/168 on way
WHIRL 1440x900 joined 2.00s: 868.53 px/s, 168/168 on way
WHIRL 1440x900 joined 2.50s: 1044.04 px/s, 157/168 on way
WHIRL 1440x900 joined 2.90s: 1093.23 px/s, 52/168 on way
WHIRL 1440x900 joined 2.98s: 1221.24 px/s, 31/168 on way
WHIRL 1440x900 joined: minimum 305.59 px/s vs 305.59 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 joined 278: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 joined 278: added 79; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 joined 1.00s: 109.12 px/s, 96/96 on way
WHIRL 412x730 joined 2.00s: 309.01 px/s, 96/96 on way
WHIRL 412x730 joined 2.50s: 377.79 px/s, 90/96 on way
WHIRL 412x730 joined 2.90s: 415.79 px/s, 30/96 on way
WHIRL 412x730 joined 2.98s: 532.71 px/s, 18/96 on way
WHIRL 412x730 joined: minimum 109.12 px/s vs 109.12 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 305: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 305: added 78; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 305: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 joined 1.00s: 110.39 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 299.25 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 363.45 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 413.50 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 521.90 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 110.39 px/s vs 110.39 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 joined 213: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 joined 213: added 81; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 joined 1.00s: 95.37 px/s, 96/96 on way
WHIRL 360x640 joined 2.00s: 274.00 px/s, 96/96 on way
WHIRL 360x640 joined 2.50s: 331.58 px/s, 90/96 on way
WHIRL 360x640 joined 2.90s: 371.06 px/s, 30/96 on way
WHIRL 360x640 joined 2.98s: 470.46 px/s, 18/96 on way
WHIRL 360x640 joined: minimum 95.37 px/s vs 95.37 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 240: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 240: added 77; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 240: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 joined 1.00s: 117.65 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 306.06 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 372.39 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 461.79 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 586.97 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 117.65 px/s vs 117.65 at 1s; minimum on way 17.71%; last 3.000000s
ok: WHIRL balanced visible sectors, own-side ring approach, continuous drain through last frame, speed/5%/last-arrival gates and rising late heat/core/glow alpha
ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged
```

## node tools/depth-test.mjs (exit 0)

```text
ok 1440x900: whole-map clouds intact/deck hidden; all high cloud/deck heights passed at dive end and every whole hold/leg/legX P; 10 low clouds stay, outside the frame
ok 1440x900: all 6 leg midpoints have mist visibility >0.5; camera boundaries agree within 1e-6; longest leg rises; pointer leaves ground fixed
ok 1440x900: D4 depth off keeps held scale continuously on ordinary glides; C1 X fit has its own camera
ok 1440x900: every find/phone/chest/wide view and explore zoom, k in .05 steps, deck follows tripS
ok 390x844: whole-map clouds intact/deck hidden; all high cloud/deck heights passed at dive end and every whole hold/leg/legX P; 10 low clouds stay, outside the frame
ok 390x844: all 6 leg midpoints have mist visibility >0.5; camera boundaries agree within 1e-6; longest leg rises; pointer leaves ground fixed
ok 390x844: D4 depth off keeps held scale continuously on ordinary glides; C1 X fit has its own camera
ok 390x844: every find/phone/chest/wide view and explore zoom, k in .05 steps, deck follows tripS
ok 1440x900: recording canvas preserves all 1200 hero positions at switch; sky freezes; nova continues; still drawing ignores motion clocks
ok 390x844: recording canvas preserves all 240 hero positions at switch; sky freezes; nova continues; still drawing ignores motion clocks
ok: presses stack independently; first expires on time; cap rejects without mutation; additive shares clamp; expired flares leave the list
ok: gather endpoints and continuous ring tangent for 32 arrival angles; explore restores depth fade
```

## node tools/layout-test.mjs (exit 0)

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

## node tools/explore-test.mjs (exit 0)

```text
ok: desktop/phone zoom limits, bounded/centred cameras, fixed zoom anchor, damped glides with no overshoot, layer/inverse round trips
ok: end-only CTA entry, input takeover, pan/release, resize, exit and immediate departure reset; P and traveller unchanged
ok: copied name curves monotone, lens/rest geometry and knock spring settling
ok: arrows pan during explore without changing P; Escape ends explore
ok: actual footer fades in linear time, is gone by 600 ms, returns over last 500 ms of exit, and stays inert while exploring
ok: FRAMES stationary pointer cancellation wakes one raster commit, then returns to idle
ok: capture-phase pinch on nova/stop/horn; nova taps; owned single drags; drag-only pointer clicks; key/end/depart/reset/down/500 ms suppression clearing; temporary world promotion
ok: D3 real findsBuild horn/chest/beacon pinches at 0/30/100 ms preserve found/stage and zoom >=20%; taps act once, chest hold repeats, owned drags aim/wipe/turn and press drags pan
```

## node tools/finds-test.mjs (exit 0)

```text
ok: C1 ring sea baseline; coast unchanged; fill digest records only non-scaling coast tick metadata
ok: DEPTH/NOVA preserved; STARS.supply data digest recorded
ok: C1 camera/labels/tripS and deck source digests recorded
ok 1440x900: 36 views/cameras, k=0 deep-equal, k=1 centred/clamped/cards folded, monotone scale, P/traveller unchanged
ok 390x664: 36 views/cameras, k=0 deep-equal, k=1 centred/clamped/cards folded, monotone scale, P/traveller unchanged
ok: eleven accessible find groups, six marker ids and unnumbered legend id
ok: all-four mask derived from STOPS is Lennard alone; nineteen rune middles/letters; all piece icons available
ok: D2 tier-1 and sub-line groups fade to exact zero at find focus and return to one
ok: Jormungandr three leaves, five rapid pokes queue once, held leaf follows head, swells/closing/sleep/wake, one found count; eagle circle returns to perch
ok: recording DOM runs six Part A plays, kept state, all-four unlock, reel, chase, four notes, rubbing, copied review state and Back focus rules; no NaN attributes or frame layout reads
ok: hammer press/found/sheet; start/end fact; real button/rune focus; every game/explore key isolated, P unchanged; auto throwing; pointer speed; close/blur/hidden/focusout pause; resume/new seed; cached sprites; throwing storage reads/writes survive
ok: traveller wipes without finding; three mist thirds; all eleven hear timed horn; hold sounds, wide view and release; three Norns/stars/below tail; ship pennant/lamp; all-eleven landing/count/frame; overlays do not take pointers
ok: C2 ravens (tree drawn first, opaque birds, one drawing each, flights out of frame and back, facing, landing, reel and its kept items, epoch, shy hop, hear loop; outlines at least 1.20 units apart, largest pose step 7.78) and chests (staged dig, rattle, back lid, craft light, hints, kept popup): 1440x900: 1266 raven ticks; 390x844: 1266 raven ticks
ok: D2 falling quills fit one third of an open wing, stay behind takeoff/clear the other bird and expire by .8 s; 16 ms lid steps <=25 degrees, gentle start, .5 s peak, <=8 degree overshoot
ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast (8790 writes)
ok: reduced-motion serpent consumes leaves immediately with no swell; no shy hop; all tree actors stay still on hear
ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
ok: footer name layout reads 85 total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: {"resize":17,"fonts":17,"settle-end":17,"explore":34}
ok: actual timeline Home and End handlers select first and last stops
```

## node tools/motion-test.mjs (exit 0)

```text
view | move | measured seconds | centre peak px/s | five-point peak px/s | centre acceleration px/s^2
1440x900 | map->laurier | 3.824 | 226.46 | 383.45 | 528.63 @ 3488
1440x900 | laurier->map | 3.824 | 225.23 | 380.47 | 526.12 @ 352
1440x900 | laurier->hmc1 | 3.856 | 374.73 | 382.21 | 550.59 @ 368
1440x900 | hmc1->laurier | 3.856 | 374.07 | 383.61 | 558.24 @ 1504
1440x900 | hmc1->mohawk | 4.064 | 378.18 | 388.46 | 721.75 @ 1600
1440x900 | mohawk->hmc1 | 4.064 | 379.77 | 386.83 | 694.95 @ 2496
1440x900 | mohawk->hmc2 | 4.208 | 419.76 | 424.12 | 736.72 @ 2464
1440x900 | hmc2->mohawk | 4.208 | 420.32 | 425.49 | 741.84 @ 1776
1440x900 | hmc2->interkom | 3.360 | 290.50 | 291.60 | 494.00 @ 1696
1440x900 | interkom->hmc2 | 3.360 | 290.52 | 291.71 | 492.37 @ 1680
1440x900 | interkom->lennard | 3.840 | 414.00 | 422.55 | 1021.32 @ 1680
1440x900 | lennard->interkom | 3.840 | 416.58 | 421.07 | 1003.31 @ 2192
1440x900 | lennard->x | 2.608 | 170.15 | 179.17 | 416.84 @ 2320
1440x900 | x->lennard | 2.608 | 170.66 | 179.75 | 415.87 @ 304
390x844 | map->laurier | 3.968 | 139.30 | 221.15 | 311.15 @ 3632
390x844 | laurier->map | 3.968 | 138.60 | 219.75 | 309.67 @ 368
390x844 | laurier->hmc1 | 4.000 | 194.52 | 194.94 | 291.22 @ 384
390x844 | hmc1->laurier | 4.000 | 194.52 | 194.94 | 292.70 @ 3648
390x844 | hmc1->mohawk | 4.240 | 193.90 | 194.27 | 267.13 @ 432
390x844 | mohawk->hmc1 | 4.240 | 193.69 | 194.40 | 268.55 @ 3840
390x844 | mohawk->hmc2 | 4.400 | 233.59 | 234.12 | 311.29 @ 4016
390x844 | hmc2->mohawk | 4.400 | 233.61 | 234.01 | 309.81 @ 416
390x844 | hmc2->interkom | 3.440 | 136.66 | 136.99 | 223.74 @ 3136
390x844 | interkom->hmc2 | 3.440 | 136.65 | 136.98 | 222.92 @ 336
390x844 | interkom->lennard | 4.000 | 223.60 | 224.24 | 333.67 @ 368
390x844 | lennard->interkom | 4.000 | 223.57 | 224.43 | 335.29 @ 3648
390x844 | lennard->x | 2.608 | 81.17 | 103.46 | 290.08 @ 2400
390x844 | x->lennard | 2.608 | 81.26 | 103.83 | 290.01 @ 240
D5 view | press | runs | worst centre acceleration | five-point peak | arrival range s | total range s
1440x900 | Back | 42 | 1703.88 | 838.77 | 0.656-4.176 | 0.656-4.176
1440x900 | hurry | 49 | 4319.97 | 1755.52 | 0.464-4.768 | 0.464-5.056
1440x900 | Next-reverse | 42 | 1727.01 | 815.11 | 0.720-4.176 | 0.720-4.176
1440x900 | Back-Next | 7 | 1119.42 | 524.20 | 1.152-1.872 | 1.456-2.176
1440x900 | go-back | 14 | 1687.93 | 838.77 | 1.312-2.928 | 1.312-2.928
1440x900 | go-next | 14 | 1725.25 | 815.11 | 1.312-2.656 | 1.312-2.656
390x844 | Back | 42 | 1006.19 | 461.68 | 0.656-4.368 | 0.656-4.368
390x844 | hurry | 49 | 2530.15 | 950.09 | 0.464-6.720 | 0.464-7.024
390x844 | Next-reverse | 42 | 1011.15 | 461.68 | 0.768-4.368 | 0.768-4.368
390x844 | Back-Next | 7 | 714.22 | 282.55 | 1.152-1.952 | 1.456-2.256
390x844 | go-back | 14 | 925.68 | 461.68 | 1.312-2.224 | 1.312-2.224
390x844 | go-next | 14 | 890.26 | 461.68 | 1.312-2.224 | 1.312-2.224
ok: 28 rest glides, 336 carry runs and 14 late-hurry guards; 16 ms acceleration/five probes, analytic continuity, bounded reversals through 99 percent, exact settled arrivals, faster feasible hurry and fresh set(P) equality
```

## node tools/hammer-test.mjs (exit 0)

```text
ok: D3 foe heights incl stroke: giants/chief 16, hunched draugr 11, low full-width wolf 8; wave 1 varies; five overlapping shields span each unchanged segment
ok: original Norse foe silhouettes and their strokes fit unchanged hit boxes
ok: identical seeds and inputs match step for step
ok: 350 seeded formations/bosses fit their wave rows; unique fates; clay at 60%, heart at 30%
ok: 34 per-level rune effect checks; excluded runes absent
ok: cold includes both flights and glove; heat splits twice; draugr rises once; need multiplies the return upgrade; exposed stone heart doubles a hit
ok: return/catch, first-hit memory, shields, bridge loss; pool sizes and identities unchanged after 10,000 steps
steady: 200 seeds; wave 4 74.0%; wins 17.5%; ended by wave 3 26.0%; longest 223.6s; 0.00076 ms/step; 1.7s wall
ends {"6:bridge":6,"7:won":35,"5:bridge":10,"3:hearts":35,"5:hearts":42,"6:hearts":14,"4:hearts":28,"4:bridge":8,"2:hearts":12,"3:bridge":3,"7:hearts":5,"2:bridge":1,"1:hearts":1}
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00070 ms/step; 2.1s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

## node tools/frame-cost-test.mjs (exit 0)

```text
ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature
ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work
```

## node tools/frame-performance-test.mjs (exit 1)

```text
file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/trip.mjs:301
  window.addEventListener('jm-explore', () => {
  ^

ReferenceError: window is not defined
    at Module.tripBuild (file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/trip.mjs:301:3)
    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/frame-performance-test.mjs:28:5
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v26.7.0
```

## node tools/frame-render-test.mjs (exit 0)

```text
phone explore zoom 1: scratch pixels cleared 3609120 -> 871895 (75.8% less); same drawing commands
phone explore zoom 2: scratch pixels cleared 3609120 -> 1037640 (71.2% less); same drawing commands
phone explore zoom 3: scratch pixels cleared 3609120 -> 760250 (78.9% less); same drawing commands
ok: 21 desktop/phone/1200-star WHIRL2 drawing-command snapshots; original blast primitives pinned by whirl2-test; not a pixel comparison
```

## node tools/whirl2-test.mjs (exit 0)

```text
ok: 1440x900/map 29 trip/find stills; added 144; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 412x730/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 360x640/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 1440x900/1200 29 trip/find stills; added 2; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 412x730/278 29 trip/find stills; added 79; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/305 29 trip/find stills; added 78; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 360x640/213 29 trip/find stills; added 81; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/240 29 trip/find stills; added 77; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: all sector targets survive full pointer look and 16 hero-dwell cases (1/5/30/120 s); no late creation or replacement
ok: WHIRL2 261 trail/sea still comparisons; 45 unchanged blast/remnant primitive comparisons (not pixels); source 0ea9f4bac16d6872c9f3798e45a58d9cbd5e461bdaab825cd3f70e1b2e17c246
```

## node tools/comb-c-tail-test.mjs (exit 0)

```text
1440x900: bounded tail max 38.000 px, proportional base, closed tail hidden
1024x600: bounded tail max 29.808 px, proportional base, closed tail hidden
412x730: bounded tail max 14.000 px, proportional base, closed tail hidden
390x844: bounded tail max 14.000 px, proportional base, closed tail hidden
360x640: bounded tail max 14.000 px, proportional base, closed tail hidden
844x390: bounded tail max 21.000 px, proportional base, closed tail hidden
ok: 1092 projected card samples; 360 ember/coast rays
```

## node tools/comb-b-layout-test.mjs (exit 1)

```text
412x730 zoom 0: [{"text":"Laurier","gap":6.49,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMCConnections","gap":-0.6,"near":".jg-hump","at":"580 224","from":"0.6706592295668311"},{"text":"Mohawk","gap":4.95,"near":"#f-mist .mist-cloud","at":"238 436","from":"0.6706592295668311"},{"text":"HMC,again","gap":8.82,"near":"#f-beacon > g","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":-0.6,"near":"#f-beacon > g","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":4.31,"near":".st-line","at":"313 702","from":"0.6706592295668311"},{"text":"X marksthe work","gap":4.39,"near":"rect null","at":"118 796","from":"0.6706592295668311"},{"text":"autumn 2022","gap":6.86,"near":".st-line","at":"490 503","from":"0.6209807681174362"}]
412x730 zoom 1: [{"text":"Laurier","gap":78.29,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMCConnections","gap":-0.6,"near":".jg-hump","at":"580 224","from":"0.6706592295668311"},{"text":"Mohawk","gap":75.08,"near":"#f-mist .mist-cloud","at":"238 436","from":"0.6706592295668311"},{"text":"HMC,again","gap":125.6,"near":"#f-beacon > g","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":-0.6,"near":"#f-beacon > g","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":78.12,"near":".st-line","at":"313 702","from":"0.6706592295668311"},{"text":"X marksthe work","gap":63.62,"near":"#f-wayfinder","at":"118 796","from":"0.6706592295668311"},{"text":"2016 to 2017, game design","gap":18.34,"near":"trail-done","at":"178 232","from":"1.4826138895086802"},{"text":"summers 2018 and 2020","gap":-0.6,"near":".jg-hump","at":"592 180.31556502375656","from":"0.9422279300768691"},{"text":"2019 to 2021","gap":57.9,"near":"trail-done","at":"250 452","from":"0.9422279300768691"},{"text":"on contract, 2021 to 2022","gap":125.99,"near":"path pf","at":"592 308.31556502375656","from":"0.9422279300768691"},{"text":"autumn 2022","gap":80.06,"near":".st-line","at":"490 503","from":"0.6209807681174362"},{"text":"2023 to now","gap":57.27,"near":"trail-done","at":"289 730.2518566594401","from":"0.9422279300768691"}]
412x730 zoom 2: [{"text":"Laurier","gap":78.29,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMCConnections","gap":-0.6,"near":".jg-hump","at":"580 224","from":"0.6706592295668311"},{"text":"Mohawk","gap":75.08,"near":"#f-mist .mist-cloud","at":"238 436","from":"0.6706592295668311"},{"text":"HMC,again","gap":167.61,"near":"coast","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":-0.6,"near":"#f-beacon > g","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":78.12,"near":".st-line","at":"313 702","from":"0.6706592295668311"},{"text":"X marksthe work","gap":63.62,"near":"#f-wayfinder","at":"118 796","from":"0.6706592295668311"},{"text":"2016 to 2017, game design","gap":18.34,"near":"trail-done","at":"178 232","from":"1.4826138895086802"},{"text":"summers 2018 and 2020","gap":-0.6,"near":".jg-hump","at":"592 180.31556502375656","from":"0.9422279300768691"},{"text":"2019 to 2021","gap":57.9,"near":"trail-done","at":"250 452","from":"0.9422279300768691"},{"text":"on contract, 2021 to 2022","gap":125.99,"near":"path pf","at":"592 308.31556502375656","from":"0.9422279300768691"},{"text":"autumn 2022","gap":80.06,"near":".st-line","at":"490 503","from":"0.6209807681174362"},{"text":"2023 to now","gap":57.27,"near":"trail-done","at":"289 730.2518566594401","from":"0.9422279300768691"}]
390x844 zoom 0: [{"text":"Laurier","gap":5.71,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMCConnections","gap":-0.6,"near":".jg-hump","at":"586 224","from":"0.6409807355516638"},{"text":"Mohawk","gap":5.06,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC,again","gap":7.29,"near":"#f-beacon > g","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":-0.6,"near":"#f-beacon > g","at":"490 463","from":"0.6409807355516638"},{"text":"Lennard","gap":5.73,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marksthe work","gap":2.32,"near":"#f-wayfinder","at":"112 628","from":"0.6409807355516638"}]
390x844 zoom 1: [{"text":"Laurier","gap":73.67,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMCConnections","gap":-0.6,"near":".jg-hump","at":"586 224","from":"0.6409807355516638"},{"text":"Mohawk","gap":64.55,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC,again","gap":115.09,"near":"#f-beacon > g","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":-0.6,"near":"#f-beacon > g","at":"490 463","from":"0.6409807355516638"},{"text":"Lennard","gap":80.18,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marksthe work","gap":84.22,"near":"#f-wayfinder","at":"112 628","from":"0.6409807355516638"},{"text":"2016 to 2017, game design","gap":17.19,"near":"trail-done","at":"178 232","from":"1.4170041945895373"},{"text":"summers 2018 and 2020","gap":-0.6,"near":".jg-hump","at":"598 178.29290167353503","from":"0.9005317828371282"},{"text":"2019 to 2021","gap":46.79,"near":"trail-done","at":"244 452","from":"0.9005317828371282"},{"text":"on contract, 2021 to 2022","gap":119.52,"near":"path pf","at":"592 306.292901673535","from":"1.0085955967775837"},{"text":"autumn 2022","gap":55.99,"near":"#f-beacon > g","at":"490 492.5599654874892","from":"0.7178984238178635"},{"text":"2023 to now","gap":70.54,"near":"trail-done","at":"298 720","from":"0.9005317828371282"},{"text":"case studies and everything else","gap":58.57,"near":".jg-hump","at":"76 612","from":"1.1296270683908938"}]
390x844 zoom 2: [{"text":"Laurier","gap":73.67,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMCConnections","gap":-0.6,"near":".jg-hump","at":"586 224","from":"0.6409807355516638"},{"text":"Mohawk","gap":64.55,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC,again","gap":157.91,"near":"coast","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":-0.6,"near":"#f-beacon > g","at":"490 463","from":"0.6409807355516638"},{"text":"Lennard","gap":80.18,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marksthe work","gap":84.22,"near":"#f-wayfinder","at":"112 628","from":"0.6409807355516638"},{"text":"2016 to 2017, game design","gap":17.19,"near":"trail-done","at":"178 232","from":"1.4170041945895373"},{"text":"summers 2018 and 2020","gap":-0.6,"near":".jg-hump","at":"598 178.29290167353503","from":"0.9005317828371282"},{"text":"2019 to 2021","gap":46.79,"near":"trail-done","at":"244 452","from":"0.9005317828371282"},{"text":"on contract, 2021 to 2022","gap":119.52,"near":"path pf","at":"592 306.292901673535","from":"1.0085955967775837"},{"text":"autumn 2022","gap":55.99,"near":"#f-beacon > g","at":"490 492.5599654874892","from":"0.7178984238178635"},{"text":"2023 to now","gap":70.54,"near":"trail-done","at":"298 720","from":"0.9005317828371282"},{"text":"case studies and everything else","gap":58.57,"near":".jg-hump","at":"76 612","from":"1.1296270683908938"}]
360x640 zoom 0: [{"text":"Laurier","gap":5.36,"near":"circle g","at":"316 188","from":"0.5763095613531423"},{"text":"HMCConnections","gap":-0.6,"near":".jg-hump","at":"592 218","from":"0.5763095613531423"},{"text":"Mohawk","gap":5.79,"near":"#f-mist .mist-cloud","at":"244 442","from":"0.5763095613531423"},{"text":"HMC,again","gap":8.18,"near":"#f-beacon > g","at":"586 352","from":"0.5763095613531423"},{"text":"Interkom","gap":-0.6,"near":"#f-beacon > g","at":"490 457","from":"0.5763095613531423"},{"text":"Lennard","gap":4.7,"near":".st-line","at":"310 704","from":"0.5763095613531423"},{"text":"X marksthe work","gap":0.47,"near":"#f-wayfinder","at":"94 628","from":"0.5763095613531423"}]
360x640 zoom 1: [{"text":"Laurier","gap":58.99,"near":"circle g","at":"316 188","from":"0.5763095613531423"},{"text":"HMCConnections","gap":-0.6,"near":".jg-hump","at":"592 218","from":"0.5763095613531423"},{"text":"Mohawk","gap":84.16,"near":"path null","at":"244 442","from":"0.5763095613531423"},{"text":"HMC,again","gap":130.92,"near":"#f-beacon > g","at":"586 352","from":"0.5763095613531423"},{"text":"Interkom","gap":-0.6,"near":"#f-beacon > g","at":"490 457","from":"0.5763095613531423"},{"text":"Lennard","gap":71.13,"near":".st-line","at":"310 704","from":"0.5763095613531423"},{"text":"X marksthe work","gap":77.11,"near":"#f-wayfinder","at":"94 628","from":"0.5763095613531423"},{"text":"2016 to 2017, game design","gap":17.74,"near":"path t","at":"316 172","from":"1.274036832193746"},{"text":"summers 2018 and 2020","gap":-0.6,"near":".jg-hump","at":"592 167.16383230491408","from":"0.9068342521422774"},{"text":"2019 to 2021","gap":40.3,"near":"trail-done","at":"268 458","from":"0.9068342521422774"},{"text":"on contract, 2021 to 2022","gap":104.01,"near":"path g","at":"598 301.1638323049141","from":"0.7229227137613817"},{"text":"autumn 2022","gap":39.81,"near":"#f-beacon > g","at":"490 489.877067624152","from":"0.7229227137613817"},{"text":"2023 to now","gap":64.51,"near":"trail-done","at":"298 720","from":"0.9068342521422774"},{"text":"case studies and everything else","gap":28.03,"near":".jg-hump","at":"82 612","from":"1.137532885887273"}]
360x640 zoom 2: [{"text":"Laurier","gap":58.99,"near":"circle g","at":"316 188","from":"0.5763095613531423"},{"text":"HMCConnections","gap":-0.6,"near":".jg-hump","at":"592 218","from":"0.5763095613531423"},{"text":"Mohawk","gap":84.16,"near":"path null","at":"244 442","from":"0.5763095613531423"},{"text":"HMC,again","gap":169.31,"near":"coast","at":"586 352","from":"0.5763095613531423"},{"text":"Interkom","gap":-0.6,"near":"#f-beacon > g","at":"490 457","from":"0.5763095613531423"},{"text":"Lennard","gap":71.13,"near":".st-line","at":"310 704","from":"0.5763095613531423"},{"text":"X marksthe work","gap":77.11,"near":"#f-wayfinder","at":"94 628","from":"0.5763095613531423"},{"text":"2016 to 2017, game design","gap":17.74,"near":"path t","at":"316 172","from":"1.274036832193746"},{"text":"summers 2018 and 2020","gap":-0.6,"near":".jg-hump","at":"592 167.16383230491408","from":"0.9068342521422774"},{"text":"2019 to 2021","gap":40.3,"near":"trail-done","at":"268 458","from":"0.9068342521422774"},{"text":"on contract, 2021 to 2022","gap":104.01,"near":"path g","at":"598 301.1638323049141","from":"0.7229227137613817"},{"text":"autumn 2022","gap":39.81,"near":"#f-beacon > g","at":"490 489.877067624152","from":"0.7229227137613817"},{"text":"2023 to now","gap":64.51,"near":"trail-done","at":"298 720","from":"0.9068342521422774"},{"text":"case studies and everything else","gap":28.03,"near":".jg-hump","at":"82 612","from":"1.137532885887273"}]
1440x900 zoom 0: [{"text":"Laurier","gap":6.75,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMCConnections","gap":-0.6,"near":".jg-hump","at":"574 224","from":"0.7926827477867662"},{"text":"Mohawk","gap":-0.6,"near":".jg-hump","at":"52 394","from":"0.7926827477867662"},{"text":"HMC,again","gap":7.47,"near":"#f-beacon > g","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":-0.6,"near":"#f-beacon > g","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":6.35,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marksthe work","gap":6.16,"near":"rect null","at":"124 796","from":"0.7926827477867662"},{"text":"autumn 2022","gap":4.18,"near":"#f-beacon > g","at":"490 489.55871045223074","from":"0.7339655072099687"}]
1440x900 zoom 1: [{"text":"Laurier","gap":109.89,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMCConnections","gap":-0.6,"near":".jg-hump","at":"574 224","from":"0.7926827477867662"},{"text":"Mohawk","gap":-0.6,"near":".jg-hump","at":"52 394","from":"0.7926827477867662"},{"text":"HMC,again","gap":150.85,"near":"#f-beacon > g","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":-0.6,"near":"#f-beacon > g","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":139.24,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marksthe work","gap":98.41,"near":"#f-wayfinder","at":"124 796","from":"0.7926827477867662"},{"text":"2016 to 2017, game design","gap":29.08,"near":"trail-done","at":"184 232","from":"1.3969778479781314"},{"text":"summers 2018 and 2020","gap":-0.6,"near":".jg-hump","at":"598 182.9335924435366","from":"0.9943412388237197"},{"text":"2019 to 2021","gap":104.5,"near":".jg-hump","at":"52 410","from":"0.8878046775211782"},{"text":"on contract, 2021 to 2022","gap":240.06,"near":"path pf","at":"598 308.9335924435366","from":"0.8878046775211782"},{"text":"autumn 2022","gap":69.15,"near":"#f-beacon > g","at":"490 489.55871045223074","from":"0.7339655072099687"},{"text":"2023 to now","gap":116.78,"near":"trail-done","at":"301 718","from":"0.8878046775211782"}]
1440x900 zoom 2: [{"text":"Laurier","gap":109.89,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMCConnections","gap":-0.6,"near":".jg-hump","at":"574 224","from":"0.7926827477867662"},{"text":"Mohawk","gap":-0.6,"near":".jg-hump","at":"52 394","from":"0.7926827477867662"},{"text":"HMC,again","gap":219.88,"near":"coast","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":-0.6,"near":"#f-beacon > g","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":139.24,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marksthe work","gap":98.41,"near":"#f-wayfinder","at":"124 796","from":"0.7926827477867662"},{"text":"2016 to 2017, game design","gap":29.08,"near":"trail-done","at":"184 232","from":"1.3969778479781314"},{"text":"summers 2018 and 2020","gap":-0.6,"near":".jg-hump","at":"598 182.9335924435366","from":"0.9943412388237197"},{"text":"2019 to 2021","gap":104.5,"near":".jg-hump","at":"52 410","from":"0.8878046775211782"},{"text":"on contract, 2021 to 2022","gap":240.06,"near":"path pf","at":"598 308.9335924435366","from":"0.8878046775211782"},{"text":"autumn 2022","gap":43.95,"near":"#f-beacon > g","at":"490 489.55871045223074","from":"0.7339655072099687"},{"text":"2023 to now","gap":116.78,"near":"trail-done","at":"301 718","from":"0.8878046775211782"}]
Failures: ["412 zoom 0 HMCConnections gap -0.6 to .jg-hump","412 zoom 0 Interkom gap -0.6 to #f-beacon > g","412 zoom 1 HMCConnections gap -0.6 to .jg-hump","412 zoom 1 Interkom gap -0.6 to #f-beacon > g","412 zoom 1 summers 2018 and 2020 gap -0.6 to .jg-hump","412 zoom 2 HMCConnections gap -0.6 to .jg-hump","412 zoom 2 Interkom gap -0.6 to #f-beacon > g","412 zoom 2 summers 2018 and 2020 gap -0.6 to .jg-hump","390 zoom 0 HMCConnections gap -0.6 to .jg-hump","390 zoom 0 Interkom gap -0.6 to #f-beacon > g","390 zoom 0 X marksthe work gap 2.32 to #f-wayfinder","390 zoom 1 HMCConnections gap -0.6 to .jg-hump","390 zoom 1 Interkom gap -0.6 to #f-beacon > g","390 zoom 1 summers 2018 and 2020 gap -0.6 to .jg-hump","390 zoom 2 HMCConnections gap -0.6 to .jg-hump","390 zoom 2 Interkom gap -0.6 to #f-beacon > g","390 zoom 2 summers 2018 and 2020 gap -0.6 to .jg-hump","360 zoom 0 HMCConnections gap -0.6 to .jg-hump","360 zoom 0 Interkom gap -0.6 to #f-beacon > g","360 zoom 0 X marksthe work gap 0.47 to #f-wayfinder","360 zoom 1 HMCConnections gap -0.6 to .jg-hump","360 zoom 1 Interkom gap -0.6 to #f-beacon > g","360 zoom 1 summers 2018 and 2020 gap -0.6 to .jg-hump","360 zoom 2 HMCConnections gap -0.6 to .jg-hump","360 zoom 2 Interkom gap -0.6 to #f-beacon > g","360 zoom 2 summers 2018 and 2020 gap -0.6 to .jg-hump","1440 zoom 0 HMCConnections gap -0.6 to .jg-hump","1440 zoom 0 Mohawk gap -0.6 to .jg-hump","1440 zoom 0 Interkom gap -0.6 to #f-beacon > g","1440 zoom 1 HMCConnections gap -0.6 to .jg-hump","1440 zoom 1 Mohawk gap -0.6 to .jg-hump","1440 zoom 1 Interkom gap -0.6 to #f-beacon > g","1440 zoom 1 summers 2018 and 2020 gap -0.6 to .jg-hump","1440 zoom 2 HMCConnections gap -0.6 to .jg-hump","1440 zoom 2 Mohawk gap -0.6 to .jg-hump","1440 zoom 2 Interkom gap -0.6 to #f-beacon > g","1440 zoom 2 summers 2018 and 2020 gap -0.6 to .jg-hump","1440 no keyboard build-up ring {\"focus\":\"\",\"ring\":\"none\",\"count\":\"1\"}","1440 counter visible in build-up","Error: Runtime.evaluate timeout\n    at Timeout._onTimeout (file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/comb-b-browser-test.mjs:18:113)\n    at listOnTimeout (node:internal/timers:685:17)\n    at process.processTimers (node:internal/timers:618:7)"]
```

## node tools/comb-b-layout-test.mjs --labels (exit 1)

```text
412x730 zoom 0: [{"text":"Laurier","gap":6.51,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMC Connections","gap":5.66,"near":"path o","at":"598 284","from":"0.6706592295668311"},{"text":"Mohawk","gap":4.98,"near":"#f-mist .mist-cloud","at":"238 436","from":"0.6706592295668311"},{"text":"HMC, again","gap":11.44,"near":"coast","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":4.64,"near":".st-line","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":6.32,"near":".st-line","at":"310 704","from":"0.6706592295668311"},{"text":"X marks the work","gap":4.42,"near":"rect null","at":"118 796","from":"0.6706592295668311"},{"text":"autumn 2022","gap":6.87,"near":".st-line","at":"490 503","from":"0.6209807681174362"}]
412x730 zoom 1: [{"text":"Laurier","gap":17.77,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMC Connections","gap":22.06,"near":"path g","at":"598 284","from":"0.6706592295668311"},{"text":"Mohawk","gap":17.68,"near":"#f-mist .mist-cloud","at":"238 436","from":"0.6706592295668311"},{"text":"HMC, again","gap":37.2,"near":"coast","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":13.21,"near":"#f-beacon > g > .g","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":16.72,"near":".st-line","at":"310 704","from":"0.6706592295668311"},{"text":"X marks the work","gap":14.91,"near":"#f-wayfinder","at":"118 796","from":"0.6706592295668311"},{"text":"summers 2018 and 2020","gap":7.92,"near":".jg-hump","at":"598 240.31556502375656","from":"0.9422279300768691"},{"text":"2019 to 2021","gap":12.75,"near":"trail-done","at":"250 452","from":"0.9422279300768691"},{"text":"on contract, 2021 to 2022","gap":28.98,"near":"path pf","at":"592 312","from":"0.9422279300768691"},{"text":"autumn 2022","gap":18.37,"near":".st-line","at":"490 503","from":"0.6209807681174362"},{"text":"2023 to now","gap":9.02,"near":"trail-done","at":"310 720","from":"0.9422279300768691"}]
412x730 zoom 2: [{"text":"Laurier","gap":78.29,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMC Connections","gap":93.22,"near":"path g","at":"598 284","from":"0.6706592295668311"},{"text":"Mohawk","gap":75.08,"near":"#f-mist .mist-cloud","at":"238 436","from":"0.6706592295668311"},{"text":"HMC, again","gap":165.98,"near":"coast","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":56.6,"near":"#f-beacon > g > .g","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":86.87,"near":".st-line","at":"310 704","from":"0.6706592295668311"},{"text":"X marks the work","gap":63.62,"near":"#f-wayfinder","at":"118 796","from":"0.6706592295668311"},{"text":"2016 to 2017, game design","gap":21.63,"near":"path g","at":"154 260","from":"1.3237624013470357"},{"text":"summers 2018 and 2020","gap":35.04,"near":".jg-hump","at":"598 240.31556502375656","from":"0.9422279300768691"},{"text":"2019 to 2021","gap":57.9,"near":"trail-done","at":"250 452","from":"0.9422279300768691"},{"text":"on contract, 2021 to 2022","gap":125.82,"near":"path pf","at":"592 312","from":"0.9422279300768691"},{"text":"autumn 2022","gap":80.06,"near":".st-line","at":"490 503","from":"0.6209807681174362"},{"text":"2023 to now","gap":42.16,"near":"trail-done","at":"310 720","from":"0.9422279300768691"},{"text":"case studies and everything else","gap":9.28,"near":"#f-wayfinder","at":"94 782","from":"2.6128722575724272"}]
390x844 zoom 0: [{"text":"Laurier","gap":5.73,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMC Connections","gap":5.02,"near":"path g","at":"580 296","from":"0.6409807355516638"},{"text":"Mohawk","gap":5.08,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC, again","gap":9.78,"near":"coast","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":6.38,"near":"path l","at":"484 463","from":"0.6409807355516638"},{"text":"Lennard","gap":5.73,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marks the work","gap":2.35,"near":"#f-wayfinder","at":"112 628","from":"0.6409807355516638"},{"text":"autumn 2022","gap":5.35,"near":"circle g","at":"484 503","from":"0.5935006810663553"}]
390x844 zoom 1: [{"text":"Laurier","gap":16.92,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMC Connections","gap":19.54,"near":"path g","at":"580 296","from":"0.6409807355516638"},{"text":"Mohawk","gap":15.36,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC, again","gap":35.61,"near":"coast","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":19.34,"near":"#f-beacon > g > .g","at":"484 463","from":"0.6409807355516638"},{"text":"Lennard","gap":15.67,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marks the work","gap":20.18,"near":"#f-wayfinder","at":"112 628","from":"0.6409807355516638"},{"text":"summers 2018 and 2020","gap":8.76,"near":"path pf","at":"580 320","from":"1.1296270683908938"},{"text":"2019 to 2021","gap":9.81,"near":"trail-done","at":"244 452","from":"0.9005317828371282"},{"text":"autumn 2022","gap":22.86,"near":".st-line","at":"484 503","from":"0.5935006810663553"},{"text":"2023 to now","gap":16.02,"near":"trail-done","at":"298 720","from":"0.9005317828371282"},{"text":"case studies and everything else","gap":7.65,"near":".jg-hump","at":"76 612","from":"1.1296270683908938"}]
390x844 zoom 2: [{"text":"Laurier","gap":73.67,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMC Connections","gap":81.61,"near":"path g","at":"580 296","from":"0.6409807355516638"},{"text":"Mohawk","gap":64.55,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC, again","gap":156.37,"near":"coast","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":80.78,"near":"#f-beacon > g > .g","at":"484 463","from":"0.6409807355516638"},{"text":"Lennard","gap":80.18,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marks the work","gap":84.22,"near":"#f-wayfinder","at":"112 628","from":"0.6409807355516638"},{"text":"2016 to 2017, game design","gap":20.34,"near":"path g","at":"154 260","from":"1.2651823165978011"},{"text":"summers 2018 and 2020","gap":57.34,"near":"path pf","at":"580 320","from":"1.1296270683908938"},{"text":"2019 to 2021","gap":46.79,"near":"trail-done","at":"244 452","from":"0.9005317828371282"},{"text":"on contract, 2021 to 2022","gap":75.79,"near":"coast","at":"592 336","from":"1.2651823165978011"},{"text":"autumn 2022","gap":99.88,"near":".st-line","at":"484 503","from":"0.5935006810663553"},{"text":"2023 to now","gap":70.54,"near":"trail-done","at":"298 720","from":"0.9005317828371282"},{"text":"case studies and everything else","gap":58.57,"near":".jg-hump","at":"76 612","from":"1.1296270683908938"}]
360x640 zoom 0: [{"text":"Laurier","gap":4.35,"near":"trail-done","at":"172 248","from":"0.5763095613531423"},{"text":"HMC Connections","gap":-0.6,"near":"path g","at":"574 253","from":"0.5763095613531423"},{"text":"Mohawk","gap":5.81,"near":"#f-mist .mist-cloud","at":"244 442","from":"0.5763095613531423"},{"text":"HMC, again","gap":10.19,"near":"coast","at":"586 352","from":"0.5763095613531423"},{"text":"Interkom","gap":6.85,"near":".st-line","at":"484 457","from":"0.5763095613531423"},{"text":"Lennard","gap":7.31,"near":".jg-hump","at":"388 632","from":"0.5763095613531423"},{"text":"X marks the work","gap":0.49,"near":"#f-wayfinder","at":"94 628","from":"0.5763095613531423"}]
360x640 zoom 1: [{"text":"Laurier","gap":15.27,"near":"trail-done","at":"172 248","from":"0.5763095613531423"},{"text":"HMC Connections","gap":-0.6,"near":"path g","at":"574 253","from":"0.5763095613531423"},{"text":"Mohawk","gap":19.74,"near":"trail-done","at":"244 442","from":"0.5763095613531423"},{"text":"HMC, again","gap":38.74,"near":"coast","at":"586 352","from":"0.5763095613531423"},{"text":"Interkom","gap":19.58,"near":"#f-beacon > g > .g","at":"484 457","from":"0.5763095613531423"},{"text":"Lennard","gap":22.55,"near":"coast","at":"388 632","from":"0.5763095613531423"},{"text":"X marks the work","gap":18.31,"near":"#f-wayfinder","at":"94 628","from":"0.5763095613531423"},{"text":"summers 2018 and 2020","gap":13.61,"near":"path g","at":"598 293","from":"0.7229227137613817"},{"text":"2019 to 2021","gap":7.96,"near":"trail-done","at":"268 458","from":"0.9068342521422774"},{"text":"on contract, 2021 to 2022","gap":21.44,"near":"path pf","at":"598 312","from":"0.9068342521422774"},{"text":"autumn 2022","gap":18.06,"near":".st-line","at":"484 497","from":"0.6454667087155194"},{"text":"2023 to now","gap":14.33,"near":"coast","at":"388 608","from":"0.9068342521422774"}]
360x640 zoom 2: [{"text":"Laurier","gap":66.79,"near":"trail-done","at":"172 248","from":"0.5763095613531423"},{"text":"HMC Connections","gap":-0.6,"near":"path g","at":"574 253","from":"0.5763095613531423"},{"text":"Mohawk","gap":84.16,"near":"path null","at":"244 442","from":"0.5763095613531423"},{"text":"HMC, again","gap":167.9,"near":"coast","at":"586 352","from":"0.5763095613531423"},{"text":"Interkom","gap":81.62,"near":"#f-beacon > g > .g","at":"484 457","from":"0.5763095613531423"},{"text":"Lennard","gap":97.95,"near":"path l","at":"388 632","from":"0.5763095613531423"},{"text":"X marks the work","gap":77.11,"near":"#f-wayfinder","at":"94 628","from":"0.5763095613531423"},{"text":"2016 to 2017, game design","gap":18.59,"near":"path g","at":"148 260","from":"1.274036832193746"},{"text":"summers 2018 and 2020","gap":70.54,"near":"path g","at":"598 293","from":"0.7229227137613817"},{"text":"2019 to 2021","gap":40.3,"near":"trail-done","at":"268 458","from":"0.9068342521422774"},{"text":"on contract, 2021 to 2022","gap":134.1,"near":"path pf","at":"598 312","from":"0.9068342521422774"},{"text":"autumn 2022","gap":83.93,"near":".st-line","at":"484 497","from":"0.6454667087155194"},{"text":"2023 to now","gap":72.32,"near":"coast","at":"388 608","from":"0.9068342521422774"},{"text":"case studies and everything else","gap":79.2,"near":".jg-hump","at":"70 612","from":"1.137532885887273"}]
1440x900 zoom 0: [{"text":"Laurier","gap":6.8,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMC Connections","gap":5.37,"near":"path o","at":"592 284","from":"0.7926827477867662"},{"text":"Mohawk","gap":6.19,"near":".jg-hump","at":"52 412","from":"0.7926827477867662"},{"text":"HMC, again","gap":11,"near":"coast","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":7.41,"near":".st-line","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":6.36,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marks the work","gap":6.2,"near":"rect null","at":"124 796","from":"0.7926827477867662"},{"text":"autumn 2022","gap":6.8,"near":".st-line","at":"490 489.55871045223074","from":"0.7339655072099687"}]
1440x900 zoom 1: [{"text":"Laurier","gap":19.86,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMC Connections","gap":21.22,"near":"path g","at":"592 284","from":"0.7926827477867662"},{"text":"Mohawk","gap":16.04,"near":".jg-hump","at":"52 412","from":"0.7926827477867662"},{"text":"HMC, again","gap":36.37,"near":"coast","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":15.73,"near":"#f-beacon > g > .g","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":17.81,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marks the work","gap":17.73,"near":"#f-wayfinder","at":"124 796","from":"0.7926827477867662"},{"text":"2016 to 2017, game design","gap":5.75,"near":"path g","at":"148 260","from":"1.2473016499804743"},{"text":"summers 2018 and 2020","gap":8.57,"near":"path l","at":"592 242.9335924435366","from":"0.9943412388237197"},{"text":"2019 to 2021","gap":22.03,"near":"coast","at":"52 428","from":"0.9943412388237197"},{"text":"on contract, 2021 to 2022","gap":41.04,"near":"coast","at":"598 318","from":"0.8878046775211782"},{"text":"autumn 2022","gap":17.76,"near":".st-line","at":"490 489.55871045223074","from":"0.7339655072099687"},{"text":"2023 to now","gap":20.4,"near":"trail-done","at":"301 718","from":"0.8878046775211782"}]
1440x900 zoom 2: [{"text":"Laurier","gap":109.89,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMC Connections","gap":117.23,"near":"path g","at":"592 284","from":"0.7926827477867662"},{"text":"Mohawk","gap":89.27,"near":".jg-hump","at":"52 412","from":"0.7926827477867662"},{"text":"HMC, again","gap":217.37,"near":"coast","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":87.59,"near":"#f-beacon > g > .g","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":139.25,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marks the work","gap":98.41,"near":"#f-wayfinder","at":"124 796","from":"0.7926827477867662"},{"text":"2016 to 2017, game design","gap":33.67,"near":"path g","at":"148 260","from":"1.2473016499804743"},{"text":"summers 2018 and 2020","gap":48.95,"near":"path l","at":"592 242.9335924435366","from":"0.9943412388237197"},{"text":"2019 to 2021","gap":139.91,"near":"coast","at":"52 428","from":"0.9943412388237197"},{"text":"on contract, 2021 to 2022","gap":239.99,"near":"path pf","at":"598 318","from":"0.8878046775211782"},{"text":"autumn 2022","gap":116.19,"near":".st-line","at":"490 489.55871045223074","from":"0.7339655072099687"},{"text":"2023 to now","gap":116.78,"near":"trail-done","at":"301 718","from":"0.8878046775211782"},{"text":"case studies and everything else","gap":14.63,"near":"#f-wayfinder","at":"88 782","from":"2.4619522919988954"}]
Failures: ["390 zoom 0 X marks the work gap 2.35 to #f-wayfinder","360 zoom 0 HMC Connections gap -0.6 to path g","360 zoom 0 X marks the work gap 0.49 to #f-wayfinder","360 zoom 1 HMC Connections gap -0.6 to path g","360 zoom 2 HMC Connections gap -0.6 to path g"]
```

## node tools/comb-b-layout-test.mjs --behaviour (exit 1)

```text
1440x900: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0.000100452"}; explore {"count":"1","overlaps":[]}
1280x720: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
1024x600: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
820x1180: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
412x730: hero review overlaps []; 110 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
390x844: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
360x640: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
844x390: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
Failures: ["1440 counter visible in build-up"]
```

## node tools/comb-b-layout-test.mjs --labels (exit 1)

```text
412x730 zoom 0: [{"text":"Laurier","gap":6.51,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMC Connections","gap":5.65,"near":"path o","at":"598 284","from":"0.6706592295668311"},{"text":"Mohawk","gap":4.98,"near":"#f-mist .mist-cloud","at":"238 436","from":"0.6706592295668311"},{"text":"HMC, again","gap":11.43,"near":"coast","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":4.64,"near":".st-line","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":6.32,"near":".st-line","at":"310 704","from":"0.6706592295668311"},{"text":"X marks the work","gap":4.41,"near":"rect null","at":"118 796","from":"0.6706592295668311"},{"text":"autumn 2022","gap":6.87,"near":".st-line","at":"490 503","from":"0.6209807681174362"}]
412x730 zoom 1: [{"text":"Laurier","gap":17.77,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMC Connections","gap":22.06,"near":"path g","at":"598 284","from":"0.6706592295668311"},{"text":"Mohawk","gap":17.68,"near":"#f-mist .mist-cloud","at":"238 436","from":"0.6706592295668311"},{"text":"HMC, again","gap":37.2,"near":"coast","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":13.21,"near":"#f-beacon > g > .g","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":16.72,"near":".st-line","at":"310 704","from":"0.6706592295668311"},{"text":"X marks the work","gap":16.37,"near":"rect null","at":"118 796","from":"0.6706592295668311"},{"text":"summers 2018 and 2020","gap":7.92,"near":".jg-hump","at":"598 240.31556502375656","from":"0.9422279300768691"},{"text":"2019 to 2021","gap":12.75,"near":"trail-done","at":"250 452","from":"0.9422279300768691"},{"text":"on contract, 2021 to 2022","gap":38.23,"near":"coast","at":"604 320","from":"0.9422279300768691"},{"text":"autumn 2022","gap":18.37,"near":".st-line","at":"490 503","from":"0.6209807681174362"},{"text":"2023 to now","gap":9.02,"near":"trail-done","at":"310 720","from":"0.9422279300768691"},{"text":"case studies and everything else","gap":1.7,"near":"#f-wayfinder text","at":"82 780","from":"1.1819307154884247"}]
412x730 zoom 2: [{"text":"Laurier","gap":78.29,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMC Connections","gap":93.22,"near":"path g","at":"598 284","from":"0.6706592295668311"},{"text":"Mohawk","gap":75.08,"near":"#f-mist .mist-cloud","at":"238 436","from":"0.6706592295668311"},{"text":"HMC, again","gap":165.98,"near":"coast","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":56.6,"near":"#f-beacon > g > .g","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":86.87,"near":".st-line","at":"310 704","from":"0.6706592295668311"},{"text":"X marks the work","gap":69.67,"near":"rect null","at":"118 796","from":"0.6706592295668311"},{"text":"2016 to 2017, game design","gap":21.63,"near":"path g","at":"154 260","from":"1.3237624013470357"},{"text":"summers 2018 and 2020","gap":35.04,"near":".jg-hump","at":"598 240.31556502375656","from":"0.9422279300768691"},{"text":"2019 to 2021","gap":57.9,"near":"trail-done","at":"250 452","from":"0.9422279300768691"},{"text":"on contract, 2021 to 2022","gap":173.82,"near":"coast","at":"604 320","from":"0.9422279300768691"},{"text":"autumn 2022","gap":80.06,"near":".st-line","at":"490 503","from":"0.6209807681174362"},{"text":"2023 to now","gap":42.16,"near":"trail-done","at":"310 720","from":"0.9422279300768691"},{"text":"case studies and everything else","gap":14.22,"near":"#f-wayfinder text","at":"82 780","from":"1.1819307154884247"}]
390x844 zoom 0: [{"text":"Laurier","gap":5.72,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMC Connections","gap":5.16,"near":"path g","at":"604 284","from":"0.6409807355516638"},{"text":"Mohawk","gap":5.07,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC, again","gap":9.75,"near":"coast","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":6.34,"near":"path l","at":"484 463","from":"0.6409807355516638"},{"text":"Lennard","gap":5.73,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marks the work","gap":5.27,"near":"#f-wayfinder circle:not(.hit)","at":"106 790","from":"0.6409807355516638"},{"text":"autumn 2022","gap":5.29,"near":"circle g","at":"484 503","from":"0.5935006810663553"}]
390x844 zoom 1: [{"text":"Laurier","gap":16.92,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMC Connections","gap":26.24,"near":"path g","at":"604 284","from":"0.6409807355516638"},{"text":"Mohawk","gap":15.36,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC, again","gap":35.61,"near":"coast","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":19.34,"near":"#f-beacon > g > .g","at":"484 463","from":"0.6409807355516638"},{"text":"Lennard","gap":15.67,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marks the work","gap":9.66,"near":"#f-wayfinder text","at":"106 790","from":"0.6409807355516638"},{"text":"summers 2018 and 2020","gap":35.46,"near":"coast","at":"604 316","from":"0.9005317828371282"},{"text":"2019 to 2021","gap":9.82,"near":"trail-done","at":"244 452","from":"0.9005317828371282"},{"text":"autumn 2022","gap":22.86,"near":".st-line","at":"484 503","from":"0.5935006810663553"},{"text":"2023 to now","gap":16.02,"near":"trail-done","at":"298 720","from":"0.9005317828371282"},{"text":"case studies and everything else","gap":-0.6,"near":"#f-wayfinder text","at":"70 774","from":"1.1296270683908938"}]
390x844 zoom 2: [{"text":"Laurier","gap":73.67,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMC Connections","gap":108.94,"near":"path g","at":"604 284","from":"0.6409807355516638"},{"text":"Mohawk","gap":64.55,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC, again","gap":156.37,"near":"coast","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":80.78,"near":"#f-beacon > g > .g","at":"484 463","from":"0.6409807355516638"},{"text":"Lennard","gap":80.18,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marks the work","gap":45.94,"near":"#f-wayfinder text","at":"106 790","from":"0.6409807355516638"},{"text":"2016 to 2017, game design","gap":20.34,"near":"path g","at":"154 260","from":"1.2651823165978011"},{"text":"summers 2018 and 2020","gap":169.04,"near":"path pf","at":"604 316","from":"0.9005317828371282"},{"text":"2019 to 2021","gap":46.79,"near":"trail-done","at":"244 452","from":"0.9005317828371282"},{"text":"on contract, 2021 to 2022","gap":51.33,"near":"coast","at":"604 397.707098326465","from":"1.2651823165978011"},{"text":"autumn 2022","gap":99.88,"near":".st-line","at":"484 503","from":"0.5935006810663553"},{"text":"2023 to now","gap":70.54,"near":"trail-done","at":"298 720","from":"0.9005317828371282"},{"text":"case studies and everything else","gap":-0.6,"near":"#f-wayfinder text","at":"70 774","from":"1.1296270683908938"}]
360x640 zoom 0: [{"text":"Laurier","gap":4.36,"near":"trail-done","at":"172 248","from":"0.5763095613531423"},{"text":"HMC Connections","gap":8.14,"near":"path g","at":"604 302","from":"0.5763095613531423"},{"text":"Mohawk","gap":5.83,"near":"#f-mist .mist-cloud","at":"244 442","from":"0.5763095613531423"},{"text":"HMC, again","gap":10.23,"near":"coast","at":"586 352","from":"0.5763095613531423"},{"text":"Interkom","gap":6.86,"near":".st-line","at":"484 457","from":"0.5763095613531423"},{"text":"Lennard","gap":9.22,"near":"coast","at":"574 720","from":"0.5763095613531423"},{"text":"X marks the work","gap":4.02,"near":"#f-wayfinder circle:not(.hit)","at":"100 790","from":"0.5763095613531423"},{"text":"2023 to now","gap":15.54,"near":"coast","at":"598 752.877067624152","from":"0.5336199642158724"}]
360x640 zoom 1: [{"text":"Laurier","gap":15.27,"near":"trail-done","at":"172 248","from":"0.5763095613531423"},{"text":"HMC Connections","gap":38.18,"near":"path g","at":"604 302","from":"0.5763095613531423"},{"text":"Mohawk","gap":19.74,"near":"trail-done","at":"244 442","from":"0.5763095613531423"},{"text":"HMC, again","gap":38.74,"near":"coast","at":"586 352","from":"0.5763095613531423"},{"text":"Interkom","gap":19.58,"near":"#f-beacon > g > .g","at":"484 457","from":"0.5763095613531423"},{"text":"Lennard","gap":42.13,"near":"coast","at":"574 720","from":"0.5763095613531423"},{"text":"X marks the work","gap":8.68,"near":"#f-wayfinder text","at":"100 790","from":"0.5763095613531423"},{"text":"summers 2018 and 2020","gap":15.52,"near":"coast","at":"604 334","from":"1.0156543623993508"},{"text":"2019 to 2021","gap":7.95,"near":"trail-done","at":"268 458","from":"0.9068342521422774"},{"text":"on contract, 2021 to 2022","gap":7.96,"near":"path l","at":"550 301.1638323049141","from":"1.0156543623993508"},{"text":"autumn 2022","gap":18.06,"near":".st-line","at":"484 497","from":"0.6454667087155194"},{"text":"2023 to now","gap":63.54,"near":"coast","at":"598 752.877067624152","from":"0.5336199642158724"}]
360x640 zoom 2: [{"text":"Laurier","gap":66.79,"near":"trail-done","at":"172 248","from":"0.5763095613531423"},{"text":"HMC Connections","gap":157.38,"near":"path g","at":"604 302","from":"0.5763095613531423"},{"text":"Mohawk","gap":84.16,"near":"path null","at":"244 442","from":"0.5763095613531423"},{"text":"HMC, again","gap":167.9,"near":"coast","at":"586 352","from":"0.5763095613531423"},{"text":"Interkom","gap":81.62,"near":"#f-beacon > g > .g","at":"484 457","from":"0.5763095613531423"},{"text":"Lennard","gap":181.7,"near":"coast","at":"574 720","from":"0.5763095613531423"},{"text":"X marks the work","gap":42.04,"near":"#f-wayfinder text","at":"100 790","from":"0.5763095613531423"},{"text":"2016 to 2017, game design","gap":18.59,"near":"path g","at":"148 260","from":"1.274036832193746"},{"text":"summers 2018 and 2020","gap":113.32,"near":"coast","at":"604 334","from":"1.0156543623993508"},{"text":"2019 to 2021","gap":40.3,"near":"trail-done","at":"268 458","from":"0.9068342521422774"},{"text":"on contract, 2021 to 2022","gap":35.59,"near":"path l","at":"550 301.1638323049141","from":"1.0156543623993508"},{"text":"autumn 2022","gap":83.93,"near":".st-line","at":"484 497","from":"0.6454667087155194"},{"text":"2023 to now","gap":285.61,"near":"rect null","at":"598 752.877067624152","from":"0.5336199642158724"},{"text":"case studies and everything else","gap":-0.6,"near":"#f-wayfinder text","at":"76 774","from":"1.137532885887273"}]
1440x900 zoom 0: [{"text":"Laurier","gap":6.76,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMC Connections","gap":5.27,"near":"path o","at":"592 284","from":"0.7926827477867662"},{"text":"Mohawk","gap":6.17,"near":".jg-hump","at":"52 412","from":"0.7926827477867662"},{"text":"HMC, again","gap":10.94,"near":"coast","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":7.41,"near":".st-line","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":6.36,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marks the work","gap":6.17,"near":"rect null","at":"124 796","from":"0.7926827477867662"},{"text":"autumn 2022","gap":6.8,"near":".st-line","at":"490 489.55871045223074","from":"0.7339655072099687"}]
1440x900 zoom 1: [{"text":"Laurier","gap":19.86,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMC Connections","gap":21.22,"near":"path g","at":"592 284","from":"0.7926827477867662"},{"text":"Mohawk","gap":16.04,"near":".jg-hump","at":"52 412","from":"0.7926827477867662"},{"text":"HMC, again","gap":36.37,"near":"coast","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":15.73,"near":"#f-beacon > g > .g","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":17.81,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marks the work","gap":19.46,"near":"rect null","at":"124 796","from":"0.7926827477867662"},{"text":"2016 to 2017, game design","gap":5.75,"near":"path g","at":"148 260","from":"1.2473016499804743"},{"text":"summers 2018 and 2020","gap":8.9,"near":"path l","at":"604 242.9335924435366","from":"0.8878046775211782"},{"text":"2019 to 2021","gap":22.03,"near":"coast","at":"52 428","from":"0.9943412388237197"},{"text":"on contract, 2021 to 2022","gap":41.04,"near":"coast","at":"598 318","from":"0.8878046775211782"},{"text":"autumn 2022","gap":17.76,"near":".st-line","at":"490 489.55871045223074","from":"0.7339655072099687"},{"text":"2023 to now","gap":20.4,"near":"trail-done","at":"301 718","from":"0.8878046775211782"},{"text":"case studies and everything else","gap":2.22,"near":"#f-wayfinder text","at":"88 780","from":"1.2473016499804743"}]
1440x900 zoom 2: [{"text":"Laurier","gap":109.89,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMC Connections","gap":117.23,"near":"path g","at":"592 284","from":"0.7926827477867662"},{"text":"Mohawk","gap":89.27,"near":".jg-hump","at":"52 412","from":"0.7926827477867662"},{"text":"HMC, again","gap":217.37,"near":"coast","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":87.59,"near":"#f-beacon > g > .g","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":139.25,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marks the work","gap":107.74,"near":"rect null","at":"124 796","from":"0.7926827477867662"},{"text":"2016 to 2017, game design","gap":33.67,"near":"path g","at":"148 260","from":"1.2473016499804743"},{"text":"summers 2018 and 2020","gap":50.71,"near":"path l","at":"604 242.9335924435366","from":"0.8878046775211782"},{"text":"2019 to 2021","gap":139.91,"near":"coast","at":"52 428","from":"0.9943412388237197"},{"text":"on contract, 2021 to 2022","gap":239.99,"near":"path pf","at":"598 318","from":"0.8878046775211782"},{"text":"autumn 2022","gap":116.19,"near":".st-line","at":"490 489.55871045223074","from":"0.7339655072099687"},{"text":"2023 to now","gap":116.78,"near":"trail-done","at":"301 718","from":"0.8878046775211782"},{"text":"case studies and everything else","gap":29.86,"near":"#f-wayfinder text","at":"88 780","from":"1.2473016499804743"}]
Failures: ["412 zoom 1 case studies and everything else gap 1.7 to #f-wayfinder text","390 zoom 1 case studies and everything else gap -0.6 to #f-wayfinder text","390 zoom 2 case studies and everything else gap -0.6 to #f-wayfinder text","360 zoom 2 case studies and everything else gap -0.6 to #f-wayfinder text","1440 zoom 1 case studies and everything else gap 2.22 to #f-wayfinder text"]
```

## node tools/comb-b-layout-test.mjs --labels (exit 0)

```text
412x730 zoom 0: [{"text":"Laurier","gap":6.52,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMC Connections","gap":5.71,"near":"path o","at":"598 284","from":"0.6706592295668311"},{"text":"Mohawk","gap":5,"near":"#f-mist .mist-cloud","at":"238 436","from":"0.6706592295668311"},{"text":"HMC, again","gap":11.46,"near":"coast","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":4.64,"near":".st-line","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":6.32,"near":".st-line","at":"310 704","from":"0.6706592295668311"},{"text":"X marks the work","gap":4.43,"near":"rect null","at":"118 796","from":"0.6706592295668311"},{"text":"autumn 2022","gap":6.87,"near":".st-line","at":"490 503","from":"0.6209807681174362"}]
412x730 zoom 1: [{"text":"Laurier","gap":17.77,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMC Connections","gap":22.06,"near":"path g","at":"598 284","from":"0.6706592295668311"},{"text":"Mohawk","gap":17.68,"near":"#f-mist .mist-cloud","at":"238 436","from":"0.6706592295668311"},{"text":"HMC, again","gap":37.2,"near":"coast","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":13.21,"near":"#f-beacon > g > .g","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":16.72,"near":".st-line","at":"310 704","from":"0.6706592295668311"},{"text":"X marks the work","gap":16.37,"near":"rect null","at":"118 796","from":"0.6706592295668311"},{"text":"summers 2018 and 2020","gap":7.91,"near":".jg-hump","at":"598 240.31556502375656","from":"0.9422279300768691"},{"text":"2019 to 2021","gap":12.74,"near":"trail-done","at":"250 452","from":"0.9422279300768691"},{"text":"on contract, 2021 to 2022","gap":38.15,"near":"coast","at":"604 320","from":"0.9422279300768691"},{"text":"autumn 2022","gap":18.36,"near":".st-line","at":"490 503","from":"0.6209807681174362"},{"text":"2023 to now","gap":9.02,"near":"trail-done","at":"310 720","from":"0.9422279300768691"}]
412x730 zoom 2: [{"text":"Laurier","gap":78.29,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMC Connections","gap":93.22,"near":"path g","at":"598 284","from":"0.6706592295668311"},{"text":"Mohawk","gap":75.08,"near":"#f-mist .mist-cloud","at":"238 436","from":"0.6706592295668311"},{"text":"HMC, again","gap":165.98,"near":"coast","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":56.6,"near":"#f-beacon > g > .g","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":86.87,"near":".st-line","at":"310 704","from":"0.6706592295668311"},{"text":"X marks the work","gap":69.67,"near":"rect null","at":"118 796","from":"0.6706592295668311"},{"text":"2016 to 2017, game design","gap":21.63,"near":"path g","at":"154 260","from":"1.3237624013470357"},{"text":"summers 2018 and 2020","gap":35.04,"near":".jg-hump","at":"598 240.31556502375656","from":"0.9422279300768691"},{"text":"2019 to 2021","gap":57.9,"near":"trail-done","at":"250 452","from":"0.9422279300768691"},{"text":"on contract, 2021 to 2022","gap":173.82,"near":"coast","at":"604 320","from":"0.9422279300768691"},{"text":"autumn 2022","gap":80.06,"near":".st-line","at":"490 503","from":"0.6209807681174362"},{"text":"2023 to now","gap":42.16,"near":"trail-done","at":"310 720","from":"0.9422279300768691"},{"text":"case studies and everything else","gap":24.1,"near":"#f-wayfinder text","at":"94 782","from":"2.6128722575724272"}]
390x844 zoom 0: [{"text":"Laurier","gap":5.72,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMC Connections","gap":5.16,"near":"path g","at":"604 284","from":"0.6409807355516638"},{"text":"Mohawk","gap":5.07,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC, again","gap":9.76,"near":"coast","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":6.35,"near":"path l","at":"484 463","from":"0.6409807355516638"},{"text":"Lennard","gap":5.73,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marks the work","gap":5.37,"near":".marker-layer .mk","at":"70 634","from":"0.6409807355516638"},{"text":"autumn 2022","gap":5.31,"near":"circle g","at":"484 503","from":"0.5935006810663553"}]
390x844 zoom 1: [{"text":"Laurier","gap":16.92,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMC Connections","gap":26.24,"near":"path g","at":"604 284","from":"0.6409807355516638"},{"text":"Mohawk","gap":15.36,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC, again","gap":35.61,"near":"coast","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":19.34,"near":"#f-beacon > g > .g","at":"484 463","from":"0.6409807355516638"},{"text":"Lennard","gap":15.67,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marks the work","gap":14.48,"near":"#f-wayfinder text","at":"70 634","from":"0.6409807355516638"},{"text":"summers 2018 and 2020","gap":35.34,"near":"coast","at":"604 316","from":"0.9005317828371282"},{"text":"2019 to 2021","gap":9.8,"near":"trail-done","at":"244 452","from":"0.9005317828371282"},{"text":"autumn 2022","gap":22.86,"near":".st-line","at":"484 503","from":"0.5935006810663553"},{"text":"2023 to now","gap":16.02,"near":"trail-done","at":"298 720","from":"0.9005317828371282"},{"text":"case studies and everything else","gap":36.74,"near":"coast","at":"34 610","from":"0.9005317828371282"}]
390x844 zoom 2: [{"text":"Laurier","gap":73.67,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMC Connections","gap":108.94,"near":"path g","at":"604 284","from":"0.6409807355516638"},{"text":"Mohawk","gap":64.55,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC, again","gap":156.37,"near":"coast","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":80.78,"near":"#f-beacon > g > .g","at":"484 463","from":"0.6409807355516638"},{"text":"Lennard","gap":80.18,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marks the work","gap":93.53,"near":"#f-wayfinder circle:not(.hit)","at":"70 634","from":"0.6409807355516638"},{"text":"2016 to 2017, game design","gap":20.34,"near":"path g","at":"154 260","from":"1.2651823165978011"},{"text":"summers 2018 and 2020","gap":169.04,"near":"path pf","at":"604 316","from":"0.9005317828371282"},{"text":"2019 to 2021","gap":46.79,"near":"trail-done","at":"244 452","from":"0.9005317828371282"},{"text":"on contract, 2021 to 2022","gap":51.33,"near":"coast","at":"604 397.707098326465","from":"1.2651823165978011"},{"text":"autumn 2022","gap":99.88,"near":".st-line","at":"484 503","from":"0.5935006810663553"},{"text":"2023 to now","gap":70.54,"near":"trail-done","at":"298 720","from":"0.9005317828371282"},{"text":"case studies and everything else","gap":166.94,"near":"path l","at":"34 610","from":"0.9005317828371282"}]
360x640 zoom 0: [{"text":"Laurier","gap":4.36,"near":"trail-done","at":"172 248","from":"0.5763095613531423"},{"text":"HMC Connections","gap":8.12,"near":"path g","at":"604 302","from":"0.5763095613531423"},{"text":"Mohawk","gap":5.82,"near":"#f-mist .mist-cloud","at":"244 442","from":"0.5763095613531423"},{"text":"HMC, again","gap":10.21,"near":"coast","at":"586 352","from":"0.5763095613531423"},{"text":"Interkom","gap":6.86,"near":".st-line","at":"484 457","from":"0.5763095613531423"},{"text":"Lennard","gap":9.21,"near":"coast","at":"574 720","from":"0.5763095613531423"},{"text":"X marks the work","gap":5.79,"near":"#f-wayfinder circle:not(.hit)","at":"58 634","from":"0.5763095613531423"},{"text":"2023 to now","gap":15.51,"near":"coast","at":"598 752.877067624152","from":"0.5336199642158724"}]
360x640 zoom 1: [{"text":"Laurier","gap":15.27,"near":"trail-done","at":"172 248","from":"0.5763095613531423"},{"text":"HMC Connections","gap":38.18,"near":"path g","at":"604 302","from":"0.5763095613531423"},{"text":"Mohawk","gap":19.74,"near":"trail-done","at":"244 442","from":"0.5763095613531423"},{"text":"HMC, again","gap":38.74,"near":"coast","at":"586 352","from":"0.5763095613531423"},{"text":"Interkom","gap":19.58,"near":"#f-beacon > g > .g","at":"484 457","from":"0.5763095613531423"},{"text":"Lennard","gap":42.13,"near":"coast","at":"574 720","from":"0.5763095613531423"},{"text":"X marks the work","gap":12.05,"near":"#f-wayfinder text","at":"58 634","from":"0.5763095613531423"},{"text":"summers 2018 and 2020","gap":15.76,"near":"coast","at":"604 334","from":"1.0156543623993508"},{"text":"2019 to 2021","gap":7.97,"near":"trail-done","at":"268 458","from":"0.9068342521422774"},{"text":"on contract, 2021 to 2022","gap":7.96,"near":"path l","at":"550 301.1638323049141","from":"1.0156543623993508"},{"text":"autumn 2022","gap":18.06,"near":".st-line","at":"484 497","from":"0.6454667087155194"},{"text":"2023 to now","gap":63.68,"near":"coast","at":"598 752.877067624152","from":"0.5336199642158724"},{"text":"case studies and everything else","gap":28.28,"near":"coast","at":"34 610","from":"0.9068342521422774"}]
360x640 zoom 2: [{"text":"Laurier","gap":66.79,"near":"trail-done","at":"172 248","from":"0.5763095613531423"},{"text":"HMC Connections","gap":157.38,"near":"path g","at":"604 302","from":"0.5763095613531423"},{"text":"Mohawk","gap":84.16,"near":"path null","at":"244 442","from":"0.5763095613531423"},{"text":"HMC, again","gap":167.9,"near":"coast","at":"586 352","from":"0.5763095613531423"},{"text":"Interkom","gap":81.62,"near":"#f-beacon > g > .g","at":"484 457","from":"0.5763095613531423"},{"text":"Lennard","gap":181.7,"near":"coast","at":"574 720","from":"0.5763095613531423"},{"text":"X marks the work","gap":85.64,"near":"#f-wayfinder circle:not(.hit)","at":"58 634","from":"0.5763095613531423"},{"text":"2016 to 2017, game design","gap":18.59,"near":"path g","at":"148 260","from":"1.274036832193746"},{"text":"summers 2018 and 2020","gap":113.32,"near":"coast","at":"604 334","from":"1.0156543623993508"},{"text":"2019 to 2021","gap":40.3,"near":"trail-done","at":"268 458","from":"0.9068342521422774"},{"text":"on contract, 2021 to 2022","gap":35.59,"near":"path l","at":"550 301.1638323049141","from":"1.0156543623993508"},{"text":"autumn 2022","gap":83.93,"near":".st-line","at":"484 497","from":"0.6454667087155194"},{"text":"2023 to now","gap":285.61,"near":"rect null","at":"598 752.877067624152","from":"0.5336199642158724"},{"text":"case studies and everything else","gap":152.9,"near":"path l","at":"34 610","from":"0.9068342521422774"}]
1440x900 zoom 0: [{"text":"Laurier","gap":6.81,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMC Connections","gap":5.4,"near":"path o","at":"592 284","from":"0.7926827477867662"},{"text":"Mohawk","gap":6.19,"near":".jg-hump","at":"52 412","from":"0.7926827477867662"},{"text":"HMC, again","gap":11.02,"near":"coast","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":7.41,"near":".st-line","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":6.36,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marks the work","gap":6.21,"near":"rect null","at":"124 796","from":"0.7926827477867662"},{"text":"autumn 2022","gap":6.8,"near":".st-line","at":"490 489.55871045223074","from":"0.7339655072099687"}]
1440x900 zoom 1: [{"text":"Laurier","gap":19.86,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMC Connections","gap":21.22,"near":"path g","at":"592 284","from":"0.7926827477867662"},{"text":"Mohawk","gap":16.04,"near":".jg-hump","at":"52 412","from":"0.7926827477867662"},{"text":"HMC, again","gap":36.37,"near":"coast","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":15.73,"near":"#f-beacon > g > .g","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":17.81,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marks the work","gap":19.46,"near":"rect null","at":"124 796","from":"0.7926827477867662"},{"text":"2016 to 2017, game design","gap":5.75,"near":"path g","at":"148 260","from":"1.2473016499804743"},{"text":"summers 2018 and 2020","gap":8.9,"near":"path l","at":"604 242.9335924435366","from":"0.8878046775211782"},{"text":"2019 to 2021","gap":22.03,"near":"coast","at":"52 428","from":"0.9943412388237197"},{"text":"on contract, 2021 to 2022","gap":41.04,"near":"coast","at":"598 318","from":"0.8878046775211782"},{"text":"autumn 2022","gap":17.76,"near":".st-line","at":"490 489.55871045223074","from":"0.7339655072099687"},{"text":"2023 to now","gap":20.4,"near":"trail-done","at":"301 718","from":"0.8878046775211782"}]
1440x900 zoom 2: [{"text":"Laurier","gap":109.89,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMC Connections","gap":117.23,"near":"path g","at":"592 284","from":"0.7926827477867662"},{"text":"Mohawk","gap":89.27,"near":".jg-hump","at":"52 412","from":"0.7926827477867662"},{"text":"HMC, again","gap":217.37,"near":"coast","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":87.59,"near":"#f-beacon > g > .g","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":139.25,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marks the work","gap":107.74,"near":"rect null","at":"124 796","from":"0.7926827477867662"},{"text":"2016 to 2017, game design","gap":33.67,"near":"path g","at":"148 260","from":"1.2473016499804743"},{"text":"summers 2018 and 2020","gap":50.71,"near":"path l","at":"604 242.9335924435366","from":"0.8878046775211782"},{"text":"2019 to 2021","gap":139.91,"near":"coast","at":"52 428","from":"0.9943412388237197"},{"text":"on contract, 2021 to 2022","gap":239.99,"near":"path pf","at":"598 318","from":"0.8878046775211782"},{"text":"autumn 2022","gap":116.19,"near":".st-line","at":"490 489.55871045223074","from":"0.7339655072099687"},{"text":"2023 to now","gap":116.78,"near":"trail-done","at":"301 718","from":"0.8878046775211782"},{"text":"case studies and everything else","gap":45.1,"near":"#f-wayfinder text","at":"88 782","from":"2.4619522919988954"}]
Failures: []
```

## node --check art.mjs (exit 0)

```text
(no output)
```

## node --check cards.mjs (exit 0)

```text
(no output)
```

## node --check data.mjs (exit 0)

```text
(no output)
```

## node --check depth.mjs (exit 0)

```text
(no output)
```

## node --check explore.mjs (exit 0)

```text
(no output)
```

## node --check findall.mjs (exit 0)

```text
(no output)
```

## node --check findcreatures.mjs (exit 0)

```text
(no output)
```

## node --check findhammer.mjs (exit 0)

```text
(no output)
```

## node --check findhoards.mjs (exit 0)

```text
(no output)
```

## node --check findhorn.mjs (exit 0)

```text
(no output)
```

## node --check findkit.mjs (exit 0)

```text
(no output)
```

## node --check finds.mjs (exit 0)

```text
(no output)
```

## node --check findsheets.mjs (exit 0)

```text
(no output)
```

## node --check findwater.mjs (exit 0)

```text
(no output)
```

## node --check footer.mjs (exit 0)

```text
(no output)
```

## node --check footname.mjs (exit 0)

```text
(no output)
```

## node --check hammer.mjs (exit 0)

```text
(no output)
```

## node --check join.mjs (exit 0)

```text
(no output)
```

## node --check main.mjs (exit 0)

```text
(no output)
```

## node --check pace.mjs (exit 0)

```text
(no output)
```

## node --check stars.mjs (exit 0)

```text
(no output)
```

## node --check steps.mjs (exit 0)

```text
(no output)
```

## node --check timeline.mjs (exit 0)

```text
(no output)
```

## node --check trip.mjs (exit 0)

```text
(no output)
```

## node --check tools/audit-capture.mjs (exit 0)

```text
(no output)
```

## node --check tools/check.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-a-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-layout-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-behaviour-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-browser.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-legend-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-record-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-tail-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-close-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-extra-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-joined-reduced-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-reduced-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-reopen-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/depth-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/explore-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/finds-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-cost.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-performance-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-render-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-visual-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/hammer-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/layout-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/motion-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/nova-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/origin-check.mjs (exit 0)

```text
(no output)
```

## node --check tools/pack-joined.mjs (exit 0)

```text
(no output)
```

## node --check tools/pack.mjs (exit 0)

```text
(no output)
```

## node --check tools/steps-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/whirl2-test.mjs (exit 0)

```text
(no output)
```

## node tools/check.mjs (exit 0)

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 16.14 KB / 30; all map modules + CSS 175.22 KB / 185
gzip: dist/journey-map.html 291.53 KB / 320
gzip: dist/journey-joined.html 511.99 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

## node tools/steps-test.mjs (exit 0)

```text
ok: paceT strictly rises; paceP round trips every whole P and the rest boundary within 1e-6
move | forward seconds | back seconds
top -> map | 4.100 | 2.460
map -> laurier | 3.813 | 3.813
laurier -> hmc1 | 3.841 | 3.841
hmc1 -> mohawk | 4.053 | 4.053
mohawk -> hmc2 | 4.200 | 4.200
hmc2 -> interkom | 3.345 | 3.345
interkom -> lennard | 3.834 | 3.834
lennard -> x | 2.600 | 2.600
x -> end | 5.900 | 3.540
ok: all 18 moves start/end correctly and never turn back; D4 glides use equal 2.6-4.4 s durations both ways; X-to-end keeps the 3 s rush plus blast/settle
ok: D4 map title top/map wheel and touch, 120 ms easing, 10/30 percent settle, clamps, Start/Set out lock, Back reset, flicks, owned drags and taps
ok: D4 joined hero top/map wheel and touch, 120 ms easing, 10/30 percent settle, clamps, Start/Set out lock, Back reset, flicks, owned drags and taps
ok: address cannot select Scroll; review only Depth; locked wheel never steps; only end CTA explores; two Back presses return then step; keyboard still advances
ok: C1 1440x900 20 repeated Next keys preserve 5904 ms arrival; repeated Back returns only to X
ok: C1 412x730 20 repeated Next keys preserve 5904 ms arrival; repeated Back returns only to X
ok: ORIGIN 50 ms desktop/phone open and reverse-close recording: tail stays on rim through tilt; shield never scales with the face or fades; X is inside the header
ok: six card X controls; local reopen focuses X without scrolling; mid-move X cannot focus departed mark; departure forgets override; reduced-motion list has no X
D5 pace 1440 joined leave: incoming 121.481481, outgoing 121.481487 P/s; cross-frame change 2.954143, uninterrupted maximum 45.843915 P/s; arrival 0.352 s; PASS
D5 pace 1440 joined fall: incoming 46.857143, outgoing 46.857145 P/s; cross-frame change 0.472015, uninterrupted maximum 45.843915 P/s; arrival 0.944 s; PASS
D5 pace 1440 X rush: incoming 28.348348, outgoing 28.348350 P/s; cross-frame change 0.306336, uninterrupted maximum 21.554523 P/s; arrival 0.720 s; PASS
D5 pace 390 joined leave: incoming 121.481481, outgoing 121.481487 P/s; cross-frame change 2.954143, uninterrupted maximum 45.843915 P/s; arrival 0.352 s; PASS
D5 pace 390 joined fall: incoming 46.857143, outgoing 46.857145 P/s; cross-frame change 0.472015, uninterrupted maximum 45.843915 P/s; arrival 0.944 s; PASS
D5 pace 390 X rush: incoming 28.348348, outgoing 28.348350 P/s; cross-frame change 0.306336, uninterrupted maximum 21.554523 P/s; arrival 0.720 s; PASS
ok: joined leave/fall and X rush Back carry exact dP/dt, meet the uninterrupted 16 ms continuity gate, turn within their beat and settle exactly
ok: X frame/phone box clear controls; rush through settle hides stepper and restores main focus
```

## node tools/nova-test.mjs (exit 0)

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is available for live reduced-motion switching
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 standalone: added 144; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 standalone 1.00s: 271.41 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.00s: 802.49 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.50s: 980.73 px/s, 157/168 on way
WHIRL 1440x900 standalone 2.90s: 998.14 px/s, 52/168 on way
WHIRL 1440x900 standalone 2.98s: 1115.28 px/s, 31/168 on way
WHIRL 1440x900 standalone: minimum 271.41 px/s vs 271.41 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 standalone: added 80; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 standalone 1.00s: 127.09 px/s, 96/96 on way
WHIRL 412x730 standalone 2.00s: 336.72 px/s, 96/96 on way
WHIRL 412x730 standalone 2.50s: 400.63 px/s, 90/96 on way
WHIRL 412x730 standalone 2.90s: 403.38 px/s, 30/96 on way
WHIRL 412x730 standalone 2.98s: 404.07 px/s, 18/96 on way
WHIRL 412x730 standalone: minimum 127.09 px/s vs 127.09 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 standalone: added 80; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 map: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 standalone 1.00s: 131.37 px/s, 96/96 on way
WHIRL 390x844 standalone 2.00s: 332.59 px/s, 96/96 on way
WHIRL 390x844 standalone 2.50s: 404.63 px/s, 90/96 on way
WHIRL 390x844 standalone 2.90s: 445.40 px/s, 30/96 on way
WHIRL 390x844 standalone 2.98s: 490.87 px/s, 18/96 on way
WHIRL 390x844 standalone: minimum 131.37 px/s vs 131.37 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 standalone: added 80; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 standalone 1.00s: 110.53 px/s, 96/96 on way
WHIRL 360x640 standalone 2.00s: 297.61 px/s, 96/96 on way
WHIRL 360x640 standalone 2.50s: 357.20 px/s, 90/96 on way
WHIRL 360x640 standalone 2.90s: 400.54 px/s, 30/96 on way
WHIRL 360x640 standalone 2.98s: 445.19 px/s, 18/96 on way
WHIRL 360x640 standalone: minimum 110.53 px/s vs 110.53 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 joined 1200: added 2; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 joined 1.00s: 305.59 px/s, 168/168 on way
WHIRL 1440x900 joined 2.00s: 868.53 px/s, 168/168 on way
WHIRL 1440x900 joined 2.50s: 1044.04 px/s, 157/168 on way
WHIRL 1440x900 joined 2.90s: 1093.23 px/s, 52/168 on way
WHIRL 1440x900 joined 2.98s: 1221.24 px/s, 31/168 on way
WHIRL 1440x900 joined: minimum 305.59 px/s vs 305.59 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 joined 278: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 joined 278: added 79; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 joined 1.00s: 109.12 px/s, 96/96 on way
WHIRL 412x730 joined 2.00s: 309.01 px/s, 96/96 on way
WHIRL 412x730 joined 2.50s: 377.79 px/s, 90/96 on way
WHIRL 412x730 joined 2.90s: 415.79 px/s, 30/96 on way
WHIRL 412x730 joined 2.98s: 532.71 px/s, 18/96 on way
WHIRL 412x730 joined: minimum 109.12 px/s vs 109.12 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 305: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 305: added 78; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 305: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 joined 1.00s: 110.39 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 299.25 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 363.45 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 413.50 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 521.90 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 110.39 px/s vs 110.39 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 joined 213: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 joined 213: added 81; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 joined 1.00s: 95.37 px/s, 96/96 on way
WHIRL 360x640 joined 2.00s: 274.00 px/s, 96/96 on way
WHIRL 360x640 joined 2.50s: 331.58 px/s, 90/96 on way
WHIRL 360x640 joined 2.90s: 371.06 px/s, 30/96 on way
WHIRL 360x640 joined 2.98s: 470.46 px/s, 18/96 on way
WHIRL 360x640 joined: minimum 95.37 px/s vs 95.37 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 240: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 240: added 77; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 240: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 joined 1.00s: 117.65 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 306.06 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 372.39 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 461.79 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 586.97 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 117.65 px/s vs 117.65 at 1s; minimum on way 17.71%; last 3.000000s
ok: WHIRL balanced visible sectors, own-side ring approach, continuous drain through last frame, speed/5%/last-arrival gates and rising late heat/core/glow alpha
ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged
```

## node tools/depth-test.mjs (exit 0)

```text
ok 1440x900: whole-map clouds intact/deck hidden; all high cloud/deck heights passed at dive end and every whole hold/leg/legX P; 10 low clouds stay, outside the frame
ok 1440x900: all 6 leg midpoints have mist visibility >0.5; camera boundaries agree within 1e-6; longest leg rises; pointer leaves ground fixed
ok 1440x900: D4 depth off keeps held scale continuously on ordinary glides; C1 X fit has its own camera
ok 1440x900: every find/phone/chest/wide view and explore zoom, k in .05 steps, deck follows tripS
ok 390x844: whole-map clouds intact/deck hidden; all high cloud/deck heights passed at dive end and every whole hold/leg/legX P; 10 low clouds stay, outside the frame
ok 390x844: all 6 leg midpoints have mist visibility >0.5; camera boundaries agree within 1e-6; longest leg rises; pointer leaves ground fixed
ok 390x844: D4 depth off keeps held scale continuously on ordinary glides; C1 X fit has its own camera
ok 390x844: every find/phone/chest/wide view and explore zoom, k in .05 steps, deck follows tripS
ok 1440x900: recording canvas preserves all 1200 hero positions at switch; sky freezes; nova continues; still drawing ignores motion clocks
ok 390x844: recording canvas preserves all 240 hero positions at switch; sky freezes; nova continues; still drawing ignores motion clocks
ok: presses stack independently; first expires on time; cap rejects without mutation; additive shares clamp; expired flares leave the list
ok: gather endpoints and continuous ring tangent for 32 arrival angles; explore restores depth fade
```

## node tools/layout-test.mjs (exit 0)

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

## node tools/explore-test.mjs (exit 0)

```text
ok: desktop/phone zoom limits, bounded/centred cameras, fixed zoom anchor, damped glides with no overshoot, layer/inverse round trips
ok: end-only CTA entry, input takeover, pan/release, resize, exit and immediate departure reset; P and traveller unchanged
ok: copied name curves monotone, lens/rest geometry and knock spring settling
ok: arrows pan during explore without changing P; Escape ends explore
ok: actual footer fades in linear time, is gone by 600 ms, returns over last 500 ms of exit, and stays inert while exploring
ok: FRAMES stationary pointer cancellation wakes one raster commit, then returns to idle
ok: capture-phase pinch on nova/stop/horn; nova taps; owned single drags; drag-only pointer clicks; key/end/depart/reset/down/500 ms suppression clearing; temporary world promotion
ok: D3 real findsBuild horn/chest/beacon pinches at 0/30/100 ms preserve found/stage and zoom >=20%; taps act once, chest hold repeats, owned drags aim/wipe/turn and press drags pan
```

## node tools/finds-test.mjs (exit 0)

```text
ok: C1 ring sea baseline; coast unchanged; fill digest records only non-scaling coast tick metadata
ok: DEPTH/NOVA preserved; STARS.supply data digest recorded
ok: C1 camera/labels/tripS and deck source digests recorded
ok 1440x900: 36 views/cameras, k=0 deep-equal, k=1 centred/clamped/cards folded, monotone scale, P/traveller unchanged
ok 390x664: 36 views/cameras, k=0 deep-equal, k=1 centred/clamped/cards folded, monotone scale, P/traveller unchanged
ok: eleven accessible find groups, six marker ids and unnumbered legend id
ok: all-four mask derived from STOPS is Lennard alone; nineteen rune middles/letters; all piece icons available
ok: D2 tier-1 and sub-line groups fade to exact zero at find focus and return to one
ok: Jormungandr three leaves, five rapid pokes queue once, held leaf follows head, swells/closing/sleep/wake, one found count; eagle circle returns to perch
ok: recording DOM runs six Part A plays, kept state, all-four unlock, reel, chase, four notes, rubbing, copied review state and Back focus rules; no NaN attributes or frame layout reads
ok: hammer press/found/sheet; start/end fact; real button/rune focus; every game/explore key isolated, P unchanged; auto throwing; pointer speed; close/blur/hidden/focusout pause; resume/new seed; cached sprites; throwing storage reads/writes survive
ok: traveller wipes without finding; three mist thirds; all eleven hear timed horn; hold sounds, wide view and release; three Norns/stars/below tail; ship pennant/lamp; all-eleven landing/count/frame; overlays do not take pointers
ok: C2 ravens (tree drawn first, opaque birds, one drawing each, flights out of frame and back, facing, landing, reel and its kept items, epoch, shy hop, hear loop; outlines at least 1.20 units apart, largest pose step 7.78) and chests (staged dig, rattle, back lid, craft light, hints, kept popup): 1440x900: 1266 raven ticks; 390x844: 1266 raven ticks
ok: D2 falling quills fit one third of an open wing, stay behind takeoff/clear the other bird and expire by .8 s; 16 ms lid steps <=25 degrees, gentle start, .5 s peak, <=8 degree overshoot
ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast (8790 writes)
ok: reduced-motion serpent consumes leaves immediately with no swell; no shy hop; all tree actors stay still on hear
ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
ok: footer name layout reads 85 total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: {"resize":17,"fonts":17,"settle-end":17,"explore":34}
ok: actual timeline Home and End handlers select first and last stops
```

## node tools/motion-test.mjs (exit 0)

```text
view | move | measured seconds | centre peak px/s | five-point peak px/s | centre acceleration px/s^2
1440x900 | map->laurier | 3.824 | 226.46 | 383.45 | 528.63 @ 3488
1440x900 | laurier->map | 3.824 | 225.23 | 380.47 | 526.12 @ 352
1440x900 | laurier->hmc1 | 3.856 | 374.73 | 382.21 | 550.59 @ 368
1440x900 | hmc1->laurier | 3.856 | 374.07 | 383.61 | 558.24 @ 1504
1440x900 | hmc1->mohawk | 4.064 | 378.18 | 388.46 | 721.75 @ 1600
1440x900 | mohawk->hmc1 | 4.064 | 379.77 | 386.83 | 694.95 @ 2496
1440x900 | mohawk->hmc2 | 4.208 | 419.76 | 424.12 | 736.72 @ 2464
1440x900 | hmc2->mohawk | 4.208 | 420.32 | 425.49 | 741.84 @ 1776
1440x900 | hmc2->interkom | 3.360 | 290.50 | 291.60 | 494.00 @ 1696
1440x900 | interkom->hmc2 | 3.360 | 290.52 | 291.71 | 492.37 @ 1680
1440x900 | interkom->lennard | 3.840 | 414.00 | 422.55 | 1021.32 @ 1680
1440x900 | lennard->interkom | 3.840 | 416.58 | 421.07 | 1003.31 @ 2192
1440x900 | lennard->x | 2.608 | 170.15 | 179.17 | 416.84 @ 2320
1440x900 | x->lennard | 2.608 | 170.66 | 179.75 | 415.87 @ 304
390x844 | map->laurier | 3.968 | 139.30 | 221.15 | 311.15 @ 3632
390x844 | laurier->map | 3.968 | 138.60 | 219.75 | 309.67 @ 368
390x844 | laurier->hmc1 | 4.000 | 194.52 | 194.94 | 291.22 @ 384
390x844 | hmc1->laurier | 4.000 | 194.52 | 194.94 | 292.70 @ 3648
390x844 | hmc1->mohawk | 4.240 | 193.90 | 194.27 | 267.13 @ 432
390x844 | mohawk->hmc1 | 4.240 | 193.69 | 194.40 | 268.55 @ 3840
390x844 | mohawk->hmc2 | 4.400 | 233.59 | 234.12 | 311.29 @ 4016
390x844 | hmc2->mohawk | 4.400 | 233.61 | 234.01 | 309.81 @ 416
390x844 | hmc2->interkom | 3.440 | 136.66 | 136.99 | 223.74 @ 3136
390x844 | interkom->hmc2 | 3.440 | 136.65 | 136.98 | 222.92 @ 336
390x844 | interkom->lennard | 4.000 | 223.60 | 224.24 | 333.67 @ 368
390x844 | lennard->interkom | 4.000 | 223.57 | 224.43 | 335.29 @ 3648
390x844 | lennard->x | 2.608 | 81.17 | 103.46 | 290.08 @ 2400
390x844 | x->lennard | 2.608 | 81.26 | 103.83 | 290.01 @ 240
D5 view | press | runs | worst centre acceleration | five-point peak | arrival range s | total range s
1440x900 | Back | 42 | 1703.88 | 838.77 | 0.656-4.176 | 0.656-4.176
1440x900 | hurry | 49 | 4319.97 | 1755.52 | 0.464-4.768 | 0.464-5.056
1440x900 | Next-reverse | 42 | 1727.01 | 815.11 | 0.720-4.176 | 0.720-4.176
1440x900 | Back-Next | 7 | 1119.42 | 524.20 | 1.152-1.872 | 1.456-2.176
1440x900 | go-back | 14 | 1687.93 | 838.77 | 1.312-2.928 | 1.312-2.928
1440x900 | go-next | 14 | 1725.25 | 815.11 | 1.312-2.656 | 1.312-2.656
390x844 | Back | 42 | 1006.19 | 461.68 | 0.656-4.368 | 0.656-4.368
390x844 | hurry | 49 | 2530.15 | 950.09 | 0.464-6.720 | 0.464-7.024
390x844 | Next-reverse | 42 | 1011.15 | 461.68 | 0.768-4.368 | 0.768-4.368
390x844 | Back-Next | 7 | 714.22 | 282.55 | 1.152-1.952 | 1.456-2.256
390x844 | go-back | 14 | 925.68 | 461.68 | 1.312-2.224 | 1.312-2.224
390x844 | go-next | 14 | 890.26 | 461.68 | 1.312-2.224 | 1.312-2.224
ok: 28 rest glides, 336 carry runs and 14 late-hurry guards; 16 ms acceleration/five probes, analytic continuity, bounded reversals through 99 percent, exact settled arrivals, faster feasible hurry and fresh set(P) equality
```

## node tools/hammer-test.mjs (exit 0)

```text
ok: D3 foe heights incl stroke: giants/chief 16, hunched draugr 11, low full-width wolf 8; wave 1 varies; five overlapping shields span each unchanged segment
ok: original Norse foe silhouettes and their strokes fit unchanged hit boxes
ok: identical seeds and inputs match step for step
ok: 350 seeded formations/bosses fit their wave rows; unique fates; clay at 60%, heart at 30%
ok: 34 per-level rune effect checks; excluded runes absent
ok: cold includes both flights and glove; heat splits twice; draugr rises once; need multiplies the return upgrade; exposed stone heart doubles a hit
ok: return/catch, first-hit memory, shields, bridge loss; pool sizes and identities unchanged after 10,000 steps
steady: 200 seeds; wave 4 74.0%; wins 17.5%; ended by wave 3 26.0%; longest 223.6s; 0.00082 ms/step; 1.8s wall
ends {"6:bridge":6,"7:won":35,"5:bridge":10,"3:hearts":35,"5:hearts":42,"6:hearts":14,"4:hearts":28,"4:bridge":8,"2:hearts":12,"3:bridge":3,"7:hearts":5,"2:bridge":1,"1:hearts":1}
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00095 ms/step; 2.9s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

## node tools/frame-cost-test.mjs (exit 0)

```text
ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature
ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work
```

## node tools/frame-performance-test.mjs (exit 0)

```text
AFTER 412x730 / 72 moving frames: #cam writes 7; label writes 297; recovery 16 frames / 266.7 ms
ok: bounded pinch rasters agree with virtual camera; <=10% label settle steps; 250 ms recovery; translation-only raster; 50 real opening camera writes; interrupted zoom, resize/exit cleanup and zero idle writes
```

## node tools/frame-render-test.mjs (exit 0)

```text
phone explore zoom 1: scratch pixels cleared 3609120 -> 871895 (75.8% less); same drawing commands
phone explore zoom 2: scratch pixels cleared 3609120 -> 1037640 (71.2% less); same drawing commands
phone explore zoom 3: scratch pixels cleared 3609120 -> 760250 (78.9% less); same drawing commands
ok: 21 desktop/phone/1200-star WHIRL2 drawing-command snapshots; original blast primitives pinned by whirl2-test; not a pixel comparison
```

## node tools/whirl2-test.mjs (exit 0)

```text
ok: 1440x900/map 29 trip/find stills; added 144; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 412x730/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 360x640/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 1440x900/1200 29 trip/find stills; added 2; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 412x730/278 29 trip/find stills; added 79; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/305 29 trip/find stills; added 78; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 360x640/213 29 trip/find stills; added 81; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/240 29 trip/find stills; added 77; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: all sector targets survive full pointer look and 16 hero-dwell cases (1/5/30/120 s); no late creation or replacement
ok: WHIRL2 261 trail/sea still comparisons; 45 unchanged blast/remnant primitive comparisons (not pixels); source 0ea9f4bac16d6872c9f3798e45a58d9cbd5e461bdaab825cd3f70e1b2e17c246
```

## node tools/comb-c-tail-test.mjs (exit 0)

```text
1440x900: bounded tail max 38.000 px, proportional base, closed tail hidden
1024x600: bounded tail max 29.808 px, proportional base, closed tail hidden
412x730: bounded tail max 14.000 px, proportional base, closed tail hidden
390x844: bounded tail max 14.000 px, proportional base, closed tail hidden
360x640: bounded tail max 14.000 px, proportional base, closed tail hidden
844x390: bounded tail max 21.000 px, proportional base, closed tail hidden
ok: 1092 projected card samples; 360 ember/coast rays
```

## node tools/comb-b-layout-test.mjs  (exit 0)

```text
412x730 zoom 0: [{"text":"Laurier","gap":6.48,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMC Connections","gap":5.52,"near":"path o","at":"598 284","from":"0.6706592295668311"},{"text":"Mohawk","gap":4.55,"near":".jg-hump","at":"46 412","from":"0.6706592295668311"},{"text":"HMC, again","gap":11.35,"near":"coast","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":4.64,"near":".st-line","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":6.32,"near":".st-line","at":"310 704","from":"0.6706592295668311"},{"text":"X marks the work","gap":4.38,"near":"rect null","at":"118 796","from":"0.6706592295668311"},{"text":"autumn 2022","gap":6.85,"near":".st-line","at":"490 503","from":"0.6209807681174362"}]
412x730 zoom 1: [{"text":"Laurier","gap":17.77,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMC Connections","gap":22.06,"near":"path g","at":"598 284","from":"0.6706592295668311"},{"text":"Mohawk","gap":13.48,"near":".jg-hump","at":"46 412","from":"0.6706592295668311"},{"text":"HMC, again","gap":37.2,"near":"coast","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":13.21,"near":"#f-beacon > g > .g","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":16.72,"near":".st-line","at":"310 704","from":"0.6706592295668311"},{"text":"X marks the work","gap":16.37,"near":"rect null","at":"118 796","from":"0.6706592295668311"},{"text":"summers 2018 and 2020","gap":7.92,"near":".jg-hump","at":"598 240.31556502375656","from":"0.9422279300768691"},{"text":"2019 to 2021","gap":19.59,"near":"#f-horn .hn-horn","at":"46 440.2518566594401","from":"0.9422279300768691"},{"text":"on contract, 2021 to 2022","gap":38.22,"near":"coast","at":"604 320","from":"0.9422279300768691"},{"text":"autumn 2022","gap":18.37,"near":".st-line","at":"490 503","from":"0.6209807681174362"},{"text":"2023 to now","gap":9.02,"near":"trail-done","at":"310 720","from":"0.9422279300768691"}]
412x730 zoom 2: [{"text":"Laurier","gap":78.29,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMC Connections","gap":93.22,"near":"path g","at":"598 284","from":"0.6706592295668311"},{"text":"Mohawk","gap":57.69,"near":".jg-hump","at":"46 412","from":"0.6706592295668311"},{"text":"HMC, again","gap":165.98,"near":"coast","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":56.6,"near":"#f-beacon > g > .g","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":86.87,"near":".st-line","at":"310 704","from":"0.6706592295668311"},{"text":"X marks the work","gap":69.67,"near":"rect null","at":"118 796","from":"0.6706592295668311"},{"text":"2016 to 2017, game design","gap":21.63,"near":"path g","at":"154 260","from":"1.3237624013470357"},{"text":"summers 2018 and 2020","gap":35.04,"near":".jg-hump","at":"598 240.31556502375656","from":"0.9422279300768691"},{"text":"2019 to 2021","gap":83.12,"near":"#f-horn .hn-horn","at":"46 440.2518566594401","from":"0.9422279300768691"},{"text":"on contract, 2021 to 2022","gap":173.82,"near":"coast","at":"604 320","from":"0.9422279300768691"},{"text":"autumn 2022","gap":80.06,"near":".st-line","at":"490 503","from":"0.6209807681174362"},{"text":"2023 to now","gap":42.16,"near":"trail-done","at":"310 720","from":"0.9422279300768691"},{"text":"case studies and everything else","gap":23.37,"near":"coast","at":"166 812","from":"2.0829657665596515"}]
390x844 zoom 0: [{"text":"Laurier","gap":5.71,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMC Connections","gap":5.15,"near":"path g","at":"604 284","from":"0.6409807355516638"},{"text":"Mohawk","gap":5.06,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC, again","gap":9.71,"near":"coast","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":6.3,"near":"path l","at":"484 463","from":"0.6409807355516638"},{"text":"Lennard","gap":5.73,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marks the work","gap":5.26,"near":"#f-wayfinder circle:not(.hit)","at":"20 790","from":"0.6409807355516638"},{"text":"autumn 2022","gap":5.23,"near":"circle g","at":"484 503","from":"0.5935006810663553"}]
390x844 zoom 1: [{"text":"Laurier","gap":16.92,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMC Connections","gap":26.24,"near":"path g","at":"604 284","from":"0.6409807355516638"},{"text":"Mohawk","gap":15.36,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC, again","gap":35.61,"near":"coast","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":19.34,"near":"#f-beacon > g > .g","at":"484 463","from":"0.6409807355516638"},{"text":"Lennard","gap":15.67,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marks the work","gap":16.5,"near":"#f-wayfinder circle:not(.hit)","at":"20 790","from":"0.6409807355516638"},{"text":"summers 2018 and 2020","gap":35.37,"near":"coast","at":"604 316","from":"0.9005317828371282"},{"text":"2019 to 2021","gap":9.81,"near":"trail-done","at":"244 452","from":"0.9005317828371282"},{"text":"autumn 2022","gap":22.86,"near":".st-line","at":"484 503","from":"0.5935006810663553"},{"text":"2023 to now","gap":16.02,"near":"trail-done","at":"298 720","from":"0.9005317828371282"},{"text":"case studies and everything else","gap":15.22,"near":"rect null","at":"68 806","from":"0.9005317828371282"}]
390x844 zoom 2: [{"text":"Laurier","gap":73.67,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMC Connections","gap":108.94,"near":"path g","at":"604 284","from":"0.6409807355516638"},{"text":"Mohawk","gap":64.55,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC, again","gap":156.37,"near":"coast","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":80.78,"near":"#f-beacon > g > .g","at":"484 463","from":"0.6409807355516638"},{"text":"Lennard","gap":80.18,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marks the work","gap":69.21,"near":"#f-wayfinder circle:not(.hit)","at":"20 790","from":"0.6409807355516638"},{"text":"2016 to 2017, game design","gap":20.34,"near":"path g","at":"154 260","from":"1.2651823165978011"},{"text":"summers 2018 and 2020","gap":169.04,"near":"path pf","at":"604 316","from":"0.9005317828371282"},{"text":"2019 to 2021","gap":46.79,"near":"trail-done","at":"244 452","from":"0.9005317828371282"},{"text":"on contract, 2021 to 2022","gap":51.33,"near":"coast","at":"604 397.707098326465","from":"1.2651823165978011"},{"text":"autumn 2022","gap":99.88,"near":".st-line","at":"484 503","from":"0.5935006810663553"},{"text":"2023 to now","gap":70.54,"near":"trail-done","at":"298 720","from":"0.9005317828371282"},{"text":"case studies and everything else","gap":64.56,"near":"rect null","at":"68 806","from":"0.9005317828371282"}]
360x640 zoom 0: [{"text":"Laurier","gap":4.37,"near":"trail-done","at":"172 248","from":"0.5763095613531423"},{"text":"HMC Connections","gap":8.17,"near":"path g","at":"604 302","from":"0.5763095613531423"},{"text":"Mohawk","gap":5.85,"near":"#f-mist .mist-cloud","at":"244 442","from":"0.5763095613531423"},{"text":"HMC, again","gap":10.26,"near":"coast","at":"586 352","from":"0.5763095613531423"},{"text":"Interkom","gap":6.86,"near":".st-line","at":"484 457","from":"0.5763095613531423"},{"text":"Lennard","gap":9.26,"near":"coast","at":"574 720","from":"0.5763095613531423"},{"text":"X marks the work","gap":4.03,"near":"#f-wayfinder circle:not(.hit)","at":"20 790","from":"0.5763095613531423"},{"text":"2023 to now","gap":15.58,"near":"coast","at":"598 752.877067624152","from":"0.5336199642158724"}]
360x640 zoom 1: [{"text":"Laurier","gap":15.27,"near":"trail-done","at":"172 248","from":"0.5763095613531423"},{"text":"HMC Connections","gap":38.18,"near":"path g","at":"604 302","from":"0.5763095613531423"},{"text":"Mohawk","gap":19.74,"near":"trail-done","at":"244 442","from":"0.5763095613531423"},{"text":"HMC, again","gap":38.74,"near":"coast","at":"586 352","from":"0.5763095613531423"},{"text":"Interkom","gap":19.58,"near":"#f-beacon > g > .g","at":"484 457","from":"0.5763095613531423"},{"text":"Lennard","gap":42.13,"near":"coast","at":"574 720","from":"0.5763095613531423"},{"text":"X marks the work","gap":14.96,"near":"#f-wayfinder circle:not(.hit)","at":"20 790","from":"0.5763095613531423"},{"text":"summers 2018 and 2020","gap":15.52,"near":"coast","at":"604 334","from":"1.0156543623993508"},{"text":"2019 to 2021","gap":7.95,"near":"trail-done","at":"268 458","from":"0.9068342521422774"},{"text":"on contract, 2021 to 2022","gap":7.96,"near":"path l","at":"550 301.1638323049141","from":"1.0156543623993508"},{"text":"autumn 2022","gap":18.06,"near":".st-line","at":"484 497","from":"0.6454667087155194"},{"text":"2023 to now","gap":63.54,"near":"coast","at":"598 752.877067624152","from":"0.5336199642158724"},{"text":"case studies and everything else","gap":13.73,"near":"rect null","at":"68 806","from":"0.9068342521422774"}]
360x640 zoom 2: [{"text":"Laurier","gap":66.79,"near":"trail-done","at":"172 248","from":"0.5763095613531423"},{"text":"HMC Connections","gap":157.38,"near":"path g","at":"604 302","from":"0.5763095613531423"},{"text":"Mohawk","gap":84.16,"near":"path null","at":"244 442","from":"0.5763095613531423"},{"text":"HMC, again","gap":167.9,"near":"coast","at":"586 352","from":"0.5763095613531423"},{"text":"Interkom","gap":81.62,"near":"#f-beacon > g > .g","at":"484 457","from":"0.5763095613531423"},{"text":"Lennard","gap":181.7,"near":"coast","at":"574 720","from":"0.5763095613531423"},{"text":"X marks the work","gap":63.36,"near":"#f-wayfinder circle:not(.hit)","at":"20 790","from":"0.5763095613531423"},{"text":"2016 to 2017, game design","gap":18.59,"near":"path g","at":"148 260","from":"1.274036832193746"},{"text":"summers 2018 and 2020","gap":113.32,"near":"coast","at":"604 334","from":"1.0156543623993508"},{"text":"2019 to 2021","gap":40.3,"near":"trail-done","at":"268 458","from":"0.9068342521422774"},{"text":"on contract, 2021 to 2022","gap":35.59,"near":"path l","at":"550 301.1638323049141","from":"1.0156543623993508"},{"text":"autumn 2022","gap":83.93,"near":".st-line","at":"484 497","from":"0.6454667087155194"},{"text":"2023 to now","gap":285.61,"near":"rect null","at":"598 752.877067624152","from":"0.5336199642158724"},{"text":"case studies and everything else","gap":59.1,"near":"rect null","at":"68 806","from":"0.9068342521422774"}]
1440x900 zoom 0: [{"text":"Laurier","gap":6.75,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMC Connections","gap":5.23,"near":"path o","at":"592 284","from":"0.7926827477867662"},{"text":"Mohawk","gap":6.16,"near":".jg-hump","at":"52 412","from":"0.7926827477867662"},{"text":"HMC, again","gap":10.92,"near":"coast","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":7.41,"near":".st-line","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":6.35,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marks the work","gap":6.16,"near":"rect null","at":"124 796","from":"0.7926827477867662"},{"text":"autumn 2022","gap":6.8,"near":".st-line","at":"490 489.55871045223074","from":"0.7339655072099687"}]
1440x900 zoom 1: [{"text":"Laurier","gap":19.86,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMC Connections","gap":21.22,"near":"path g","at":"592 284","from":"0.7926827477867662"},{"text":"Mohawk","gap":16.04,"near":".jg-hump","at":"52 412","from":"0.7926827477867662"},{"text":"HMC, again","gap":36.37,"near":"coast","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":15.73,"near":"#f-beacon > g > .g","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":17.81,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marks the work","gap":19.46,"near":"rect null","at":"124 796","from":"0.7926827477867662"},{"text":"2016 to 2017, game design","gap":5.75,"near":"path g","at":"148 260","from":"1.2473016499804743"},{"text":"summers 2018 and 2020","gap":8.9,"near":"path l","at":"604 242.9335924435366","from":"0.8878046775211782"},{"text":"2019 to 2021","gap":22.03,"near":"coast","at":"52 428","from":"0.9943412388237197"},{"text":"on contract, 2021 to 2022","gap":41.04,"near":"coast","at":"598 318","from":"0.8878046775211782"},{"text":"autumn 2022","gap":17.76,"near":".st-line","at":"490 489.55871045223074","from":"0.7339655072099687"},{"text":"2023 to now","gap":20.4,"near":"trail-done","at":"301 718","from":"0.8878046775211782"}]
1440x900 zoom 2: [{"text":"Laurier","gap":109.89,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMC Connections","gap":117.23,"near":"path g","at":"592 284","from":"0.7926827477867662"},{"text":"Mohawk","gap":89.27,"near":".jg-hump","at":"52 412","from":"0.7926827477867662"},{"text":"HMC, again","gap":217.37,"near":"coast","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":87.59,"near":"#f-beacon > g > .g","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":139.25,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marks the work","gap":107.74,"near":"rect null","at":"124 796","from":"0.7926827477867662"},{"text":"2016 to 2017, game design","gap":33.67,"near":"path g","at":"148 260","from":"1.2473016499804743"},{"text":"summers 2018 and 2020","gap":50.71,"near":"path l","at":"604 242.9335924435366","from":"0.8878046775211782"},{"text":"2019 to 2021","gap":139.91,"near":"coast","at":"52 428","from":"0.9943412388237197"},{"text":"on contract, 2021 to 2022","gap":239.99,"near":"path pf","at":"598 318","from":"0.8878046775211782"},{"text":"autumn 2022","gap":116.19,"near":".st-line","at":"490 489.55871045223074","from":"0.7339655072099687"},{"text":"2023 to now","gap":116.78,"near":"trail-done","at":"301 718","from":"0.8878046775211782"},{"text":"case studies and everything else","gap":37.13,"near":"coast","at":"172 812","from":"1.962653294004221"}]
1440x900: hero review overlaps []; 111 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
1280x720: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
1024x600: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
820x1180: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
412x730: hero review overlaps []; 110 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
390x844: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
360x640: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
844x390: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
Failures: []
```

## Standalone drawing geometry check (exit 0)

```text
T6/T20: 5.90 map units between crowns; 2.30 CSS px between ink at 360 fit
T41/T42: 5.61 map units between crowns; 2.13 CSS px between ink at 360 fit
T57/T60: 6.27 map units between crowns; 2.51 CSS px between ink at 360 fit
ok: unchanged hammer/horn/mist/serpent hits; ink-only masked mist; omitted tiny actors; full cell rims and persistent sign hooks
```

## node --check art.mjs (exit 0)

```text
(no output)
```

## node --check cards.mjs (exit 0)

```text
(no output)
```

## node --check data.mjs (exit 0)

```text
(no output)
```

## node --check depth.mjs (exit 0)

```text
(no output)
```

## node --check explore.mjs (exit 0)

```text
(no output)
```

## node --check findall.mjs (exit 0)

```text
(no output)
```

## node --check findcreatures.mjs (exit 0)

```text
(no output)
```

## node --check findhammer.mjs (exit 0)

```text
(no output)
```

## node --check findhoards.mjs (exit 0)

```text
(no output)
```

## node --check findhorn.mjs (exit 0)

```text
(no output)
```

## node --check findkit.mjs (exit 0)

```text
(no output)
```

## node --check finds.mjs (exit 0)

```text
(no output)
```

## node --check findsheets.mjs (exit 0)

```text
(no output)
```

## node --check findwater.mjs (exit 0)

```text
(no output)
```

## node --check footer.mjs (exit 0)

```text
(no output)
```

## node --check footname.mjs (exit 0)

```text
(no output)
```

## node --check hammer.mjs (exit 0)

```text
(no output)
```

## node --check join.mjs (exit 0)

```text
(no output)
```

## node --check main.mjs (exit 0)

```text
(no output)
```

## node --check pace.mjs (exit 0)

```text
(no output)
```

## node --check stars.mjs (exit 0)

```text
(no output)
```

## node --check steps.mjs (exit 0)

```text
(no output)
```

## node --check timeline.mjs (exit 0)

```text
(no output)
```

## node --check trip.mjs (exit 0)

```text
(no output)
```

## node --check tools/audit-capture.mjs (exit 0)

```text
(no output)
```

## node --check tools/check.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-a-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-art-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-layout-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-behaviour-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-browser.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-legend-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-record-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-tail-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-close-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-extra-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-joined-reduced-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-reduced-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-reopen-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/depth-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/explore-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/finds-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-cost.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-performance-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-render-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-visual-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/hammer-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/layout-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/motion-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/nova-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/origin-check.mjs (exit 0)

```text
(no output)
```

## node --check tools/pack-joined.mjs (exit 0)

```text
(no output)
```

## node --check tools/pack.mjs (exit 0)

```text
(no output)
```

## node --check tools/steps-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/whirl2-test.mjs (exit 0)

```text
(no output)
```

## node tools/check.mjs (exit 0)

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 16.14 KB / 30; all map modules + CSS 175.24 KB / 185
gzip: dist/journey-map.html 291.55 KB / 320
gzip: dist/journey-joined.html 512.01 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

## node tools/steps-test.mjs (exit 0)

```text
ok: paceT strictly rises; paceP round trips every whole P and the rest boundary within 1e-6
move | forward seconds | back seconds
top -> map | 4.100 | 2.460
map -> laurier | 3.813 | 3.813
laurier -> hmc1 | 3.841 | 3.841
hmc1 -> mohawk | 4.053 | 4.053
mohawk -> hmc2 | 4.200 | 4.200
hmc2 -> interkom | 3.345 | 3.345
interkom -> lennard | 3.834 | 3.834
lennard -> x | 2.600 | 2.600
x -> end | 5.900 | 3.540
ok: all 18 moves start/end correctly and never turn back; D4 glides use equal 2.6-4.4 s durations both ways; X-to-end keeps the 3 s rush plus blast/settle
ok: D4 map title top/map wheel and touch, 120 ms easing, 10/30 percent settle, clamps, Start/Set out lock, Back reset, flicks, owned drags and taps
ok: D4 joined hero top/map wheel and touch, 120 ms easing, 10/30 percent settle, clamps, Start/Set out lock, Back reset, flicks, owned drags and taps
ok: address cannot select Scroll; review only Depth; locked wheel never steps; only end CTA explores; two Back presses return then step; keyboard still advances
ok: C1 1440x900 20 repeated Next keys preserve 5904 ms arrival; repeated Back returns only to X
ok: C1 412x730 20 repeated Next keys preserve 5904 ms arrival; repeated Back returns only to X
ok: ORIGIN 50 ms desktop/phone open and reverse-close recording: tail stays on rim through tilt; shield never scales with the face or fades; X is inside the header
ok: six card X controls; local reopen focuses X without scrolling; mid-move X cannot focus departed mark; departure forgets override; reduced-motion list has no X
D5 pace 1440 joined leave: incoming 121.481481, outgoing 121.481487 P/s; cross-frame change 2.954143, uninterrupted maximum 45.843915 P/s; arrival 0.352 s; PASS
D5 pace 1440 joined fall: incoming 46.857143, outgoing 46.857145 P/s; cross-frame change 0.472015, uninterrupted maximum 45.843915 P/s; arrival 0.944 s; PASS
D5 pace 1440 X rush: incoming 28.348348, outgoing 28.348350 P/s; cross-frame change 0.306336, uninterrupted maximum 21.554523 P/s; arrival 0.720 s; PASS
D5 pace 390 joined leave: incoming 121.481481, outgoing 121.481487 P/s; cross-frame change 2.954143, uninterrupted maximum 45.843915 P/s; arrival 0.352 s; PASS
D5 pace 390 joined fall: incoming 46.857143, outgoing 46.857145 P/s; cross-frame change 0.472015, uninterrupted maximum 45.843915 P/s; arrival 0.944 s; PASS
D5 pace 390 X rush: incoming 28.348348, outgoing 28.348350 P/s; cross-frame change 0.306336, uninterrupted maximum 21.554523 P/s; arrival 0.720 s; PASS
ok: joined leave/fall and X rush Back carry exact dP/dt, meet the uninterrupted 16 ms continuity gate, turn within their beat and settle exactly
ok: X frame/phone box clear controls; rush through settle hides stepper and restores main focus
```

## node tools/nova-test.mjs (exit 0)

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is available for live reduced-motion switching
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 standalone: added 144; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 standalone 1.00s: 271.41 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.00s: 802.49 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.50s: 980.73 px/s, 157/168 on way
WHIRL 1440x900 standalone 2.90s: 998.14 px/s, 52/168 on way
WHIRL 1440x900 standalone 2.98s: 1115.28 px/s, 31/168 on way
WHIRL 1440x900 standalone: minimum 271.41 px/s vs 271.41 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 standalone: added 80; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 standalone 1.00s: 127.09 px/s, 96/96 on way
WHIRL 412x730 standalone 2.00s: 336.72 px/s, 96/96 on way
WHIRL 412x730 standalone 2.50s: 400.63 px/s, 90/96 on way
WHIRL 412x730 standalone 2.90s: 403.38 px/s, 30/96 on way
WHIRL 412x730 standalone 2.98s: 404.07 px/s, 18/96 on way
WHIRL 412x730 standalone: minimum 127.09 px/s vs 127.09 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 standalone: added 80; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 map: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 standalone 1.00s: 131.37 px/s, 96/96 on way
WHIRL 390x844 standalone 2.00s: 332.59 px/s, 96/96 on way
WHIRL 390x844 standalone 2.50s: 404.63 px/s, 90/96 on way
WHIRL 390x844 standalone 2.90s: 445.40 px/s, 30/96 on way
WHIRL 390x844 standalone 2.98s: 490.87 px/s, 18/96 on way
WHIRL 390x844 standalone: minimum 131.37 px/s vs 131.37 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 standalone: added 80; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 standalone 1.00s: 110.53 px/s, 96/96 on way
WHIRL 360x640 standalone 2.00s: 297.61 px/s, 96/96 on way
WHIRL 360x640 standalone 2.50s: 357.20 px/s, 90/96 on way
WHIRL 360x640 standalone 2.90s: 400.54 px/s, 30/96 on way
WHIRL 360x640 standalone 2.98s: 445.19 px/s, 18/96 on way
WHIRL 360x640 standalone: minimum 110.53 px/s vs 110.53 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 joined 1200: added 2; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 joined 1.00s: 305.59 px/s, 168/168 on way
WHIRL 1440x900 joined 2.00s: 868.53 px/s, 168/168 on way
WHIRL 1440x900 joined 2.50s: 1044.04 px/s, 157/168 on way
WHIRL 1440x900 joined 2.90s: 1093.23 px/s, 52/168 on way
WHIRL 1440x900 joined 2.98s: 1221.24 px/s, 31/168 on way
WHIRL 1440x900 joined: minimum 305.59 px/s vs 305.59 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 joined 278: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 joined 278: added 79; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 joined 1.00s: 109.12 px/s, 96/96 on way
WHIRL 412x730 joined 2.00s: 309.01 px/s, 96/96 on way
WHIRL 412x730 joined 2.50s: 377.79 px/s, 90/96 on way
WHIRL 412x730 joined 2.90s: 415.79 px/s, 30/96 on way
WHIRL 412x730 joined 2.98s: 532.71 px/s, 18/96 on way
WHIRL 412x730 joined: minimum 109.12 px/s vs 109.12 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 305: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 305: added 78; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 305: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 joined 1.00s: 110.39 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 299.25 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 363.45 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 413.50 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 521.90 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 110.39 px/s vs 110.39 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 joined 213: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 joined 213: added 81; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 joined 1.00s: 95.37 px/s, 96/96 on way
WHIRL 360x640 joined 2.00s: 274.00 px/s, 96/96 on way
WHIRL 360x640 joined 2.50s: 331.58 px/s, 90/96 on way
WHIRL 360x640 joined 2.90s: 371.06 px/s, 30/96 on way
WHIRL 360x640 joined 2.98s: 470.46 px/s, 18/96 on way
WHIRL 360x640 joined: minimum 95.37 px/s vs 95.37 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 240: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 240: added 77; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 240: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 joined 1.00s: 117.65 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 306.06 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 372.39 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 461.79 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 586.97 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 117.65 px/s vs 117.65 at 1s; minimum on way 17.71%; last 3.000000s
ok: WHIRL balanced visible sectors, own-side ring approach, continuous drain through last frame, speed/5%/last-arrival gates and rising late heat/core/glow alpha
ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged
```

## node tools/depth-test.mjs (exit 0)

```text
ok 1440x900: whole-map clouds intact/deck hidden; all high cloud/deck heights passed at dive end and every whole hold/leg/legX P; 10 low clouds stay, outside the frame
ok 1440x900: all 6 leg midpoints have mist visibility >0.5; camera boundaries agree within 1e-6; longest leg rises; pointer leaves ground fixed
ok 1440x900: D4 depth off keeps held scale continuously on ordinary glides; C1 X fit has its own camera
ok 1440x900: every find/phone/chest/wide view and explore zoom, k in .05 steps, deck follows tripS
ok 390x844: whole-map clouds intact/deck hidden; all high cloud/deck heights passed at dive end and every whole hold/leg/legX P; 10 low clouds stay, outside the frame
ok 390x844: all 6 leg midpoints have mist visibility >0.5; camera boundaries agree within 1e-6; longest leg rises; pointer leaves ground fixed
ok 390x844: D4 depth off keeps held scale continuously on ordinary glides; C1 X fit has its own camera
ok 390x844: every find/phone/chest/wide view and explore zoom, k in .05 steps, deck follows tripS
ok 1440x900: recording canvas preserves all 1200 hero positions at switch; sky freezes; nova continues; still drawing ignores motion clocks
ok 390x844: recording canvas preserves all 240 hero positions at switch; sky freezes; nova continues; still drawing ignores motion clocks
ok: presses stack independently; first expires on time; cap rejects without mutation; additive shares clamp; expired flares leave the list
ok: gather endpoints and continuous ring tangent for 32 arrival angles; explore restores depth fade
```

## node tools/layout-test.mjs (exit 0)

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

## node tools/explore-test.mjs (exit 0)

```text
ok: desktop/phone zoom limits, bounded/centred cameras, fixed zoom anchor, damped glides with no overshoot, layer/inverse round trips
ok: end-only CTA entry, input takeover, pan/release, resize, exit and immediate departure reset; P and traveller unchanged
ok: copied name curves monotone, lens/rest geometry and knock spring settling
ok: arrows pan during explore without changing P; Escape ends explore
ok: actual footer fades in linear time, is gone by 600 ms, returns over last 500 ms of exit, and stays inert while exploring
ok: FRAMES stationary pointer cancellation wakes one raster commit, then returns to idle
ok: capture-phase pinch on nova/stop/horn; nova taps; owned single drags; drag-only pointer clicks; key/end/depart/reset/down/500 ms suppression clearing; temporary world promotion
ok: D3 real findsBuild horn/chest/beacon pinches at 0/30/100 ms preserve found/stage and zoom >=20%; taps act once, chest hold repeats, owned drags aim/wipe/turn and press drags pan
```

## node tools/finds-test.mjs (exit 0)

```text
ok: C1 ring sea baseline; coast unchanged; fill digest records only non-scaling coast tick metadata
ok: DEPTH/NOVA preserved; STARS.supply data digest recorded
ok: C1 camera/labels/tripS and deck source digests recorded
ok 1440x900: 36 views/cameras, k=0 deep-equal, k=1 centred/clamped/cards folded, monotone scale, P/traveller unchanged
ok 390x664: 36 views/cameras, k=0 deep-equal, k=1 centred/clamped/cards folded, monotone scale, P/traveller unchanged
ok: eleven accessible find groups, six marker ids and unnumbered legend id
ok: all-four mask derived from STOPS is Lennard alone; nineteen rune middles/letters; all piece icons available
ok: D2 tier-1 and sub-line groups fade to exact zero at find focus and return to one
ok: Jormungandr three leaves, five rapid pokes queue once, held leaf follows head, swells/closing/sleep/wake, one found count; eagle circle returns to perch
ok: recording DOM runs six Part A plays, kept state, all-four unlock, reel, chase, four notes, rubbing, copied review state and Back focus rules; no NaN attributes or frame layout reads
ok: hammer press/found/sheet; start/end fact; real button/rune focus; every game/explore key isolated, P unchanged; auto throwing; pointer speed; close/blur/hidden/focusout pause; resume/new seed; cached sprites; throwing storage reads/writes survive
ok: traveller wipes without finding; three mist thirds; all eleven hear timed horn; hold sounds, wide view and release; three Norns/stars/below tail; ship pennant/lamp; all-eleven landing/count/frame; overlays do not take pointers
ok: C2 ravens (tree drawn first, opaque birds, one drawing each, flights out of frame and back, facing, landing, reel and its kept items, epoch, shy hop, hear loop; outlines at least 1.20 units apart, largest pose step 7.78) and chests (staged dig, rattle, back lid, craft light, hints, kept popup): 1440x900: 1266 raven ticks; 390x844: 1266 raven ticks
ok: D2 falling quills fit one third of an open wing, stay behind takeoff/clear the other bird and expire by .8 s; 16 ms lid steps <=25 degrees, gentle start, .5 s peak, <=8 degree overshoot
ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast (8790 writes)
ok: reduced-motion serpent consumes leaves immediately with no swell; no shy hop; all tree actors stay still on hear
ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
ok: footer name layout reads 85 total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: {"resize":17,"fonts":17,"settle-end":17,"explore":34}
ok: actual timeline Home and End handlers select first and last stops
```

## node tools/motion-test.mjs (exit 0)

```text
view | move | measured seconds | centre peak px/s | five-point peak px/s | centre acceleration px/s^2
1440x900 | map->laurier | 3.824 | 226.46 | 383.45 | 528.63 @ 3488
1440x900 | laurier->map | 3.824 | 225.23 | 380.47 | 526.12 @ 352
1440x900 | laurier->hmc1 | 3.856 | 374.73 | 382.21 | 550.59 @ 368
1440x900 | hmc1->laurier | 3.856 | 374.07 | 383.61 | 558.24 @ 1504
1440x900 | hmc1->mohawk | 4.064 | 378.18 | 388.46 | 721.75 @ 1600
1440x900 | mohawk->hmc1 | 4.064 | 379.77 | 386.83 | 694.95 @ 2496
1440x900 | mohawk->hmc2 | 4.208 | 419.76 | 424.12 | 736.72 @ 2464
1440x900 | hmc2->mohawk | 4.208 | 420.32 | 425.49 | 741.84 @ 1776
1440x900 | hmc2->interkom | 3.360 | 290.50 | 291.60 | 494.00 @ 1696
1440x900 | interkom->hmc2 | 3.360 | 290.52 | 291.71 | 492.37 @ 1680
1440x900 | interkom->lennard | 3.840 | 414.00 | 422.55 | 1021.32 @ 1680
1440x900 | lennard->interkom | 3.840 | 416.58 | 421.07 | 1003.31 @ 2192
1440x900 | lennard->x | 2.608 | 170.15 | 179.17 | 416.84 @ 2320
1440x900 | x->lennard | 2.608 | 170.66 | 179.75 | 415.87 @ 304
390x844 | map->laurier | 3.968 | 139.30 | 221.15 | 311.15 @ 3632
390x844 | laurier->map | 3.968 | 138.60 | 219.75 | 309.67 @ 368
390x844 | laurier->hmc1 | 4.000 | 194.52 | 194.94 | 291.22 @ 384
390x844 | hmc1->laurier | 4.000 | 194.52 | 194.94 | 292.70 @ 3648
390x844 | hmc1->mohawk | 4.240 | 193.90 | 194.27 | 267.13 @ 432
390x844 | mohawk->hmc1 | 4.240 | 193.69 | 194.40 | 268.55 @ 3840
390x844 | mohawk->hmc2 | 4.400 | 233.59 | 234.12 | 311.29 @ 4016
390x844 | hmc2->mohawk | 4.400 | 233.61 | 234.01 | 309.81 @ 416
390x844 | hmc2->interkom | 3.440 | 136.66 | 136.99 | 223.74 @ 3136
390x844 | interkom->hmc2 | 3.440 | 136.65 | 136.98 | 222.92 @ 336
390x844 | interkom->lennard | 4.000 | 223.60 | 224.24 | 333.67 @ 368
390x844 | lennard->interkom | 4.000 | 223.57 | 224.43 | 335.29 @ 3648
390x844 | lennard->x | 2.608 | 81.17 | 103.46 | 290.08 @ 2400
390x844 | x->lennard | 2.608 | 81.26 | 103.83 | 290.01 @ 240
D5 view | press | runs | worst centre acceleration | five-point peak | arrival range s | total range s
1440x900 | Back | 42 | 1703.88 | 838.77 | 0.656-4.176 | 0.656-4.176
1440x900 | hurry | 49 | 4319.97 | 1755.52 | 0.464-4.768 | 0.464-5.056
1440x900 | Next-reverse | 42 | 1727.01 | 815.11 | 0.720-4.176 | 0.720-4.176
1440x900 | Back-Next | 7 | 1119.42 | 524.20 | 1.152-1.872 | 1.456-2.176
1440x900 | go-back | 14 | 1687.93 | 838.77 | 1.312-2.928 | 1.312-2.928
1440x900 | go-next | 14 | 1725.25 | 815.11 | 1.312-2.656 | 1.312-2.656
390x844 | Back | 42 | 1006.19 | 461.68 | 0.656-4.368 | 0.656-4.368
390x844 | hurry | 49 | 2530.15 | 950.09 | 0.464-6.720 | 0.464-7.024
390x844 | Next-reverse | 42 | 1011.15 | 461.68 | 0.768-4.368 | 0.768-4.368
390x844 | Back-Next | 7 | 714.22 | 282.55 | 1.152-1.952 | 1.456-2.256
390x844 | go-back | 14 | 925.68 | 461.68 | 1.312-2.224 | 1.312-2.224
390x844 | go-next | 14 | 890.26 | 461.68 | 1.312-2.224 | 1.312-2.224
ok: 28 rest glides, 336 carry runs and 14 late-hurry guards; 16 ms acceleration/five probes, analytic continuity, bounded reversals through 99 percent, exact settled arrivals, faster feasible hurry and fresh set(P) equality
```

## node tools/hammer-test.mjs (exit 0)

```text
ok: D3 foe heights incl stroke: giants/chief 16, hunched draugr 11, low full-width wolf 8; wave 1 varies; five overlapping shields span each unchanged segment
ok: original Norse foe silhouettes and their strokes fit unchanged hit boxes
ok: identical seeds and inputs match step for step
ok: 350 seeded formations/bosses fit their wave rows; unique fates; clay at 60%, heart at 30%
ok: 34 per-level rune effect checks; excluded runes absent
ok: cold includes both flights and glove; heat splits twice; draugr rises once; need multiplies the return upgrade; exposed stone heart doubles a hit
ok: return/catch, first-hit memory, shields, bridge loss; pool sizes and identities unchanged after 10,000 steps
steady: 200 seeds; wave 4 74.0%; wins 17.5%; ended by wave 3 26.0%; longest 223.6s; 0.00081 ms/step; 1.8s wall
ends {"6:bridge":6,"7:won":35,"5:bridge":10,"3:hearts":35,"5:hearts":42,"6:hearts":14,"4:hearts":28,"4:bridge":8,"2:hearts":12,"3:bridge":3,"7:hearts":5,"2:bridge":1,"1:hearts":1}
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00087 ms/step; 2.6s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

## node tools/frame-cost-test.mjs (exit 0)

```text
ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature
ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work
```

## node tools/frame-performance-test.mjs (exit 0)

```text
AFTER 412x730 / 72 moving frames: #cam writes 7; label writes 297; recovery 16 frames / 266.7 ms
ok: bounded pinch rasters agree with virtual camera; <=10% label settle steps; 250 ms recovery; translation-only raster; 50 real opening camera writes; interrupted zoom, resize/exit cleanup and zero idle writes
```

## node tools/frame-render-test.mjs (exit 0)

```text
phone explore zoom 1: scratch pixels cleared 3609120 -> 871895 (75.8% less); same drawing commands
phone explore zoom 2: scratch pixels cleared 3609120 -> 1037640 (71.2% less); same drawing commands
phone explore zoom 3: scratch pixels cleared 3609120 -> 760250 (78.9% less); same drawing commands
ok: 21 desktop/phone/1200-star WHIRL2 drawing-command snapshots; original blast primitives pinned by whirl2-test; not a pixel comparison
```

## node tools/whirl2-test.mjs (exit 0)

```text
ok: 1440x900/map 29 trip/find stills; added 144; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 412x730/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 360x640/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 1440x900/1200 29 trip/find stills; added 2; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 412x730/278 29 trip/find stills; added 79; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/305 29 trip/find stills; added 78; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 360x640/213 29 trip/find stills; added 81; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/240 29 trip/find stills; added 77; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: all sector targets survive full pointer look and 16 hero-dwell cases (1/5/30/120 s); no late creation or replacement
ok: WHIRL2 261 trail/sea still comparisons; 45 unchanged blast/remnant primitive comparisons (not pixels); source 0ea9f4bac16d6872c9f3798e45a58d9cbd5e461bdaab825cd3f70e1b2e17c246
```

## node tools/comb-c-tail-test.mjs (exit 0)

```text
1440x900: bounded tail max 38.000 px, proportional base, closed tail hidden
1024x600: bounded tail max 29.808 px, proportional base, closed tail hidden
412x730: bounded tail max 14.000 px, proportional base, closed tail hidden
390x844: bounded tail max 14.000 px, proportional base, closed tail hidden
360x640: bounded tail max 14.000 px, proportional base, closed tail hidden
844x390: bounded tail max 21.000 px, proportional base, closed tail hidden
ok: 1092 projected card samples; 360 ember/coast rays
```

## node tools/comb-b-art-test.mjs (exit 0)

```text
T6/T20: 5.90 map units between crowns; 2.30 CSS px between ink at 360 fit
T41/T42: 5.61 map units between crowns; 2.13 CSS px between ink at 360 fit
T57/T60: 6.27 map units between crowns; 2.51 CSS px between ink at 360 fit
ok: unchanged hammer/horn/mist/serpent hits; ink-only masked mist; omitted tiny actors; full cell rims and persistent sign hooks
```

## node tools/comb-b-detail-test.mjs (exit 0)

```text
412x730: three deepest-zoom grove views, full crown silhouette at the well view (DPR 2), shield field at DPR 1; no browser exceptions
1440x900: three deepest-zoom grove views, full crown silhouette at the well view (DPR 2), shield field at DPR 1; no browser exceptions
```

## node tools/origin-check.mjs --cdp LOCAL  (exit 0)

```text
1440x900: PASS heights [laurier:360, hmc1:379, mohawk:359, hmc2:398, interkom:359, lennard:432]; max rim error 0.011 px
1280x720: PASS heights [laurier:269, hmc1:292, mohawk:274, hmc2:325, interkom:292, lennard:333]; max rim error 0.003 px
1024x600: PASS heights [laurier:269, hmc1:292, mohawk:274, hmc2:325, interkom:292, lennard:333]; max rim error 0.014 px
820x1180: PASS heights [laurier:360, hmc1:379, mohawk:359, hmc2:398, interkom:359, lennard:432]; max rim error 0.000 px
390x844: PASS heights [laurier:314, hmc1:337, mohawk:319, hmc2:370, interkom:337, lennard:395]; max rim error 0.003 px
412x730: PASS heights [laurier:314, hmc1:337, mohawk:319, hmc2:370, interkom:337, lennard:395]; max rim error 0.005 px
360x640: PASS heights [laurier:314, hmc1:337, mohawk:319, hmc2:370, interkom:354, lennard:395]; max rim error 0.000 px
844x390: PASS heights [laurier:200, hmc1:220, mohawk:203, hmc2:252, interkom:220, lennard:254]; max rim error 0.000 px
```

## node tools/frame-cost.mjs --cdp LOCAL --passes timing (exit 0)

```text
browser: Edg/158.0.4370.33; 412x730; DPR 2.625; touch true; CPU x4
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 103 | 29.20 | 66.70 | 79.30 | 48 | 0 | 11.41 | 8.34 | 4.46 | 3.89 | 5.37 | 1.46 | 6.63 | 0.91 | 10.16 | 17 / 67.00 | N/A |
| fling + glide timing | 119 | 16.70 | 29.20 | 58.40 | 3 | 0 | 7.61 | 1.18 | 0.45 | 0.73 | 3.20 | 0.39 | 5.38 | 0.46 | 0.55 | 1 / 58.00 | N/A |
| wayfinder / one turn in 1.5 s timing | 151 | 16.80 | 29.10 | 41.70 | 2 | 0 | 6.90 | 0.95 | 0.38 | 0.57 | 3.05 | 0.41 | 5.57 | 0.58 | 0.52 | 0 / 0.00 | N/A |
| slow pan with glow timing | 175 | 20.80 | 29.20 | 54.20 | 4 | 0 | 7.86 | 1.27 | 0.41 | 0.86 | 3.81 | 0.47 | 5.37 | 0.70 | 0.37 | 2 / 54.00 | N/A |
| stop glide timing | 180 | 29.20 | 41.60 | 50.10 | 64 | 0 | 6.31 | 6.85 | 5.67 | 1.18 | 4.57 | 2.02 | 5.00 | 0.50 | 7.53 | 0 / 0.00 | N/A |
| rush into blast timing | 403 | 12.50 | 33.40 | 87.60 | 42 | 0 | 6.84 | 2.45 | 1.82 | 0.63 | 1.72 | 0.81 | 2.39 | 0.42 | 1.52 | 0 / 0.00 | N/A |
| map -> Laurier timing | 133 | 29.20 | 37.60 | 41.80 | 39 | 0 | 7.13 | 8.13 | 6.91 | 1.23 | 4.39 | 2.36 | 5.14 | 0.61 | 8.91 | 0 / 0.00 | N/A |
| Laurier -> HMC timing | 137 | 29.10 | 37.60 | 41.80 | 41 | 0 | 6.63 | 7.89 | 6.59 | 1.30 | 4.56 | 2.51 | 4.98 | 0.59 | 9.10 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 117 | 29.20 | 37.50 | 45.80 | 33 | 0 | 6.66 | 7.86 | 6.48 | 1.38 | 4.52 | 2.51 | 5.21 | 0.61 | 8.10 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 112 | 29.20 | 41.70 | 46.00 | 46 | 0 | 7.04 | 8.39 | 6.90 | 1.49 | 4.69 | 2.69 | 5.38 | 0.64 | 8.14 | 0 / 0.00 | N/A |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 116 | 25.00 | 54.30 | 66.70 | 36 | 0 | 7.57 | 6.29 | 3.23 | 3.06 | 3.95 | 1.20 | 5.88 | 0.70 | 9.24 | 6 / 60.00 | N/A |
| fling + glide timing | 135 | 16.60 | 25.10 | 45.80 | 3 | 0 | 5.35 | 0.98 | 0.43 | 0.55 | 2.65 | 0.38 | 5.05 | 0.44 | 0.50 | 0 / 0.00 | N/A |
| wayfinder / one turn in 1.5 s timing | 168 | 16.70 | 25.00 | 37.50 | 2 | 0 | 5.06 | 0.92 | 0.37 | 0.55 | 2.94 | 0.37 | 5.47 | 0.52 | 0.50 | 0 / 0.00 | N/A |
| slow pan with glow timing | 223 | 16.60 | 24.90 | 54.20 | 3 | 0 | 5.07 | 1.03 | 0.33 | 0.70 | 3.06 | 0.37 | 4.50 | 0.55 | 0.32 | 1 / 51.00 | N/A |
| stop glide timing | 177 | 25.10 | 41.80 | 54.20 | 57 | 0 | 5.97 | 7.50 | 6.15 | 1.35 | 4.61 | 1.92 | 4.43 | 0.56 | 7.62 | 0 / 0.00 | N/A |
| rush into blast timing | 439 | 8.40 | 33.50 | 45.80 | 41 | 0 | 5.50 | 2.54 | 1.82 | 0.72 | 1.79 | 0.77 | 2.12 | 0.44 | 1.27 | 0 / 0.00 | N/A |
| map -> Laurier timing | 126 | 29.20 | 41.80 | 62.50 | 46 | 0 | 6.98 | 9.72 | 8.15 | 1.56 | 5.52 | 2.21 | 4.77 | 0.71 | 8.75 | 1 / 56.00 | N/A |
| Laurier -> HMC timing | 115 | 33.40 | 50.00 | 54.20 | 71 | 0 | 7.58 | 10.57 | 8.70 | 1.86 | 6.59 | 2.58 | 4.99 | 0.76 | 9.32 | 5 / 52.00 | N/A |
| HMC again -> Interkom timing | 118 | 29.10 | 37.60 | 54.20 | 39 | 0 | 6.34 | 8.49 | 6.87 | 1.62 | 4.85 | 2.32 | 4.70 | 0.66 | 7.75 | 1 / 51.00 | N/A |
| Interkom -> HMC again / Back timing | 109 | 29.20 | 45.80 | 46.00 | 48 | 0 | 6.55 | 9.27 | 7.53 | 1.74 | 5.07 | 2.46 | 4.89 | 0.70 | 7.54 | 0 / 0.00 | N/A |
```

```text
COMB-C last-table p95 comparison: [{"key":"/journey-map.html/map -> Laurier timing","before":50.1,"after":37.6,"pass":true},{"key":"/journey-map.html/Laurier -> HMC timing","before":45.9,"after":37.6,"pass":true},{"key":"/journey-map.html/HMC again -> Interkom timing","before":41.8,"after":37.5,"pass":true},{"key":"/journey-map.html/Interkom -> HMC again / Back timing","before":45.9,"after":41.7,"pass":true},{"key":"/journey-joined.html/map -> Laurier timing","before":45.9,"after":41.8,"pass":true},{"key":"/journey-joined.html/Laurier -> HMC timing","before":41.7,"after":50,"pass":false},{"key":"/journey-joined.html/HMC again -> Interkom timing","before":45.8,"after":37.6,"pass":true},{"key":"/journey-joined.html/Interkom -> HMC again / Back timing","before":45.8,"after":45.8,"pass":true}]
```

## node tools/frame-cost.mjs --cdp LOCAL --passes timing --scenarios 6,7,8,9 --width 1440 --height 900 --dpr 1 --cpu 1 (exit 0)

```text
browser: Edg/158.0.4370.33; 1440x900; DPR 1; touch false; CPU x1
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| map -> Laurier timing | 425 | 8.40 | 12.60 | 20.80 | 0 | 0 | 1.42 | 4.44 | 4.23 | 0.21 | 0.82 | 0.44 | 1.09 | 0.15 | 9.80 | 0 / 0.00 | N/A |
| Laurier -> HMC timing | 391 | 8.40 | 12.60 | 20.90 | 0 | 0 | 1.34 | 5.38 | 5.15 | 0.23 | 0.83 | 0.48 | 1.06 | 0.13 | 8.77 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 358 | 8.40 | 12.60 | 16.70 | 0 | 0 | 1.25 | 5.14 | 4.92 | 0.22 | 0.83 | 0.47 | 1.00 | 0.12 | 6.24 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 368 | 8.40 | 12.60 | 16.70 | 0 | 0 | 1.16 | 5.19 | 4.98 | 0.21 | 0.79 | 0.44 | 0.96 | 0.11 | 6.23 | 0 / 0.00 | N/A |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| map -> Laurier timing | 421 | 8.40 | 12.60 | 16.80 | 0 | 0 | 1.35 | 4.59 | 4.38 | 0.21 | 0.84 | 0.45 | 1.09 | 0.16 | 9.83 | 0 / 0.00 | N/A |
| Laurier -> HMC timing | 377 | 8.40 | 12.60 | 20.90 | 0 | 0 | 1.30 | 5.64 | 5.41 | 0.24 | 0.92 | 0.50 | 1.08 | 0.14 | 8.97 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 354 | 8.40 | 12.60 | 20.90 | 0 | 0 | 1.19 | 5.20 | 4.97 | 0.23 | 0.88 | 0.47 | 1.02 | 0.12 | 6.29 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 353 | 8.40 | 12.60 | 20.90 | 0 | 0 | 1.15 | 5.41 | 5.19 | 0.22 | 0.86 | 0.46 | 0.99 | 0.12 | 6.17 | 0 / 0.00 | N/A |
```

## Measurement notes before the final confirmation

The first cost wrapper exited 1: seven COMB-C comparisons passed, but joined Laurier -> HMC measured 50.00 ms p95 against 41.70 ms. That broad run had already played all six interactive scenarios before the glides. The final comparison uses only the same four glides on fresh pages, matching the supplied last table. Both outputs are retained. A final T60 correction also removed its sideways offset, keeping only the authorized 5-unit upward nudge so T56 stays clear. The final suite, label check and affected captures are repeated for that data.

## node tools/comb-b-layout-test.mjs --labels (exit 0)

```text
412x730 zoom 0: [{"text":"Laurier","gap":6.48,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMC Connections","gap":5.52,"near":"path o","at":"598 284","from":"0.6706592295668311"},{"text":"Mohawk","gap":4.55,"near":".jg-hump","at":"46 412","from":"0.6706592295668311"},{"text":"HMC, again","gap":11.35,"near":"coast","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":4.64,"near":".st-line","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":6.32,"near":".st-line","at":"310 704","from":"0.6706592295668311"},{"text":"X marks the work","gap":4.38,"near":"rect null","at":"118 796","from":"0.6706592295668311"},{"text":"autumn 2022","gap":6.85,"near":".st-line","at":"490 503","from":"0.6209807681174362"}]
412x730 zoom 1: [{"text":"Laurier","gap":17.77,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMC Connections","gap":22.06,"near":"path g","at":"598 284","from":"0.6706592295668311"},{"text":"Mohawk","gap":13.48,"near":".jg-hump","at":"46 412","from":"0.6706592295668311"},{"text":"HMC, again","gap":37.2,"near":"coast","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":13.21,"near":"#f-beacon > g > .g","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":16.72,"near":".st-line","at":"310 704","from":"0.6706592295668311"},{"text":"X marks the work","gap":16.37,"near":"rect null","at":"118 796","from":"0.6706592295668311"},{"text":"summers 2018 and 2020","gap":7.91,"near":".jg-hump","at":"598 240.31556502375656","from":"0.9422279300768691"},{"text":"2019 to 2021","gap":19.59,"near":"#f-horn .hn-horn","at":"46 440.2518566594401","from":"0.9422279300768691"},{"text":"on contract, 2021 to 2022","gap":38.2,"near":"coast","at":"604 320","from":"0.9422279300768691"},{"text":"autumn 2022","gap":18.36,"near":".st-line","at":"490 503","from":"0.6209807681174362"},{"text":"2023 to now","gap":9.02,"near":"trail-done","at":"310 720","from":"0.9422279300768691"}]
412x730 zoom 2: [{"text":"Laurier","gap":78.29,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMC Connections","gap":93.22,"near":"path g","at":"598 284","from":"0.6706592295668311"},{"text":"Mohawk","gap":57.69,"near":".jg-hump","at":"46 412","from":"0.6706592295668311"},{"text":"HMC, again","gap":165.98,"near":"coast","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":56.6,"near":"#f-beacon > g > .g","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":86.87,"near":".st-line","at":"310 704","from":"0.6706592295668311"},{"text":"X marks the work","gap":69.67,"near":"rect null","at":"118 796","from":"0.6706592295668311"},{"text":"2016 to 2017, game design","gap":21.63,"near":"path g","at":"154 260","from":"1.3237624013470357"},{"text":"summers 2018 and 2020","gap":35.04,"near":".jg-hump","at":"598 240.31556502375656","from":"0.9422279300768691"},{"text":"2019 to 2021","gap":83.12,"near":"#f-horn .hn-horn","at":"46 440.2518566594401","from":"0.9422279300768691"},{"text":"on contract, 2021 to 2022","gap":173.82,"near":"coast","at":"604 320","from":"0.9422279300768691"},{"text":"autumn 2022","gap":80.06,"near":".st-line","at":"490 503","from":"0.6209807681174362"},{"text":"2023 to now","gap":42.16,"near":"trail-done","at":"310 720","from":"0.9422279300768691"},{"text":"case studies and everything else","gap":23.37,"near":"coast","at":"166 812","from":"2.0829657665596515"}]
390x844 zoom 0: [{"text":"Laurier","gap":5.73,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMC Connections","gap":5.17,"near":"path g","at":"604 284","from":"0.6409807355516638"},{"text":"Mohawk","gap":5.08,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC, again","gap":9.77,"near":"coast","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":6.36,"near":"path l","at":"484 463","from":"0.6409807355516638"},{"text":"Lennard","gap":5.73,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marks the work","gap":5.28,"near":"#f-wayfinder circle:not(.hit)","at":"20 790","from":"0.6409807355516638"},{"text":"autumn 2022","gap":5.33,"near":"circle g","at":"484 503","from":"0.5935006810663553"}]
390x844 zoom 1: [{"text":"Laurier","gap":16.92,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMC Connections","gap":26.24,"near":"path g","at":"604 284","from":"0.6409807355516638"},{"text":"Mohawk","gap":15.36,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC, again","gap":35.61,"near":"coast","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":19.34,"near":"#f-beacon > g > .g","at":"484 463","from":"0.6409807355516638"},{"text":"Lennard","gap":15.67,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marks the work","gap":16.5,"near":"#f-wayfinder circle:not(.hit)","at":"20 790","from":"0.6409807355516638"},{"text":"summers 2018 and 2020","gap":35.38,"near":"coast","at":"604 316","from":"0.9005317828371282"},{"text":"2019 to 2021","gap":9.81,"near":"trail-done","at":"244 452","from":"0.9005317828371282"},{"text":"autumn 2022","gap":22.86,"near":".st-line","at":"484 503","from":"0.5935006810663553"},{"text":"2023 to now","gap":16.02,"near":"trail-done","at":"298 720","from":"0.9005317828371282"},{"text":"case studies and everything else","gap":15.22,"near":"rect null","at":"68 806","from":"0.9005317828371282"}]
390x844 zoom 2: [{"text":"Laurier","gap":73.67,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMC Connections","gap":108.94,"near":"path g","at":"604 284","from":"0.6409807355516638"},{"text":"Mohawk","gap":64.55,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC, again","gap":156.37,"near":"coast","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":80.78,"near":"#f-beacon > g > .g","at":"484 463","from":"0.6409807355516638"},{"text":"Lennard","gap":80.18,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marks the work","gap":69.21,"near":"#f-wayfinder circle:not(.hit)","at":"20 790","from":"0.6409807355516638"},{"text":"2016 to 2017, game design","gap":20.34,"near":"path g","at":"154 260","from":"1.2651823165978011"},{"text":"summers 2018 and 2020","gap":169.04,"near":"path pf","at":"604 316","from":"0.9005317828371282"},{"text":"2019 to 2021","gap":46.79,"near":"trail-done","at":"244 452","from":"0.9005317828371282"},{"text":"on contract, 2021 to 2022","gap":51.33,"near":"coast","at":"604 397.707098326465","from":"1.2651823165978011"},{"text":"autumn 2022","gap":99.88,"near":".st-line","at":"484 503","from":"0.5935006810663553"},{"text":"2023 to now","gap":70.54,"near":"trail-done","at":"298 720","from":"0.9005317828371282"},{"text":"case studies and everything else","gap":64.56,"near":"rect null","at":"68 806","from":"0.9005317828371282"}]
360x640 zoom 0: [{"text":"Laurier","gap":4.34,"near":"trail-done","at":"172 248","from":"0.5763095613531423"},{"text":"HMC Connections","gap":8.06,"near":"path g","at":"604 302","from":"0.5763095613531423"},{"text":"Mohawk","gap":5.78,"near":"#f-mist .mist-cloud","at":"244 442","from":"0.5763095613531423"},{"text":"HMC, again","gap":10.15,"near":"coast","at":"586 352","from":"0.5763095613531423"},{"text":"Interkom","gap":6.85,"near":".st-line","at":"484 457","from":"0.5763095613531423"},{"text":"Lennard","gap":9.12,"near":"coast","at":"574 720","from":"0.5763095613531423"},{"text":"X marks the work","gap":4,"near":"#f-wayfinder circle:not(.hit)","at":"20 790","from":"0.5763095613531423"},{"text":"2023 to now","gap":15.41,"near":"coast","at":"598 752.877067624152","from":"0.5336199642158724"}]
360x640 zoom 1: [{"text":"Laurier","gap":15.27,"near":"trail-done","at":"172 248","from":"0.5763095613531423"},{"text":"HMC Connections","gap":38.18,"near":"path g","at":"604 302","from":"0.5763095613531423"},{"text":"Mohawk","gap":19.74,"near":"trail-done","at":"244 442","from":"0.5763095613531423"},{"text":"HMC, again","gap":38.74,"near":"coast","at":"586 352","from":"0.5763095613531423"},{"text":"Interkom","gap":19.58,"near":"#f-beacon > g > .g","at":"484 457","from":"0.5763095613531423"},{"text":"Lennard","gap":42.13,"near":"coast","at":"574 720","from":"0.5763095613531423"},{"text":"X marks the work","gap":14.95,"near":"#f-wayfinder circle:not(.hit)","at":"20 790","from":"0.5763095613531423"},{"text":"summers 2018 and 2020","gap":15.48,"near":"coast","at":"604 334","from":"1.0156543623993508"},{"text":"2019 to 2021","gap":7.95,"near":"trail-done","at":"268 458","from":"0.9068342521422774"},{"text":"on contract, 2021 to 2022","gap":7.95,"near":"path l","at":"550 301.1638323049141","from":"1.0156543623993508"},{"text":"autumn 2022","gap":18.05,"near":".st-line","at":"484 497","from":"0.6454667087155194"},{"text":"2023 to now","gap":63.51,"near":"coast","at":"598 752.877067624152","from":"0.5336199642158724"},{"text":"case studies and everything else","gap":13.73,"near":"rect null","at":"68 806","from":"0.9068342521422774"}]
360x640 zoom 2: [{"text":"Laurier","gap":66.79,"near":"trail-done","at":"172 248","from":"0.5763095613531423"},{"text":"HMC Connections","gap":157.38,"near":"path g","at":"604 302","from":"0.5763095613531423"},{"text":"Mohawk","gap":84.16,"near":"path null","at":"244 442","from":"0.5763095613531423"},{"text":"HMC, again","gap":167.9,"near":"coast","at":"586 352","from":"0.5763095613531423"},{"text":"Interkom","gap":81.62,"near":"#f-beacon > g > .g","at":"484 457","from":"0.5763095613531423"},{"text":"Lennard","gap":181.7,"near":"coast","at":"574 720","from":"0.5763095613531423"},{"text":"X marks the work","gap":63.36,"near":"#f-wayfinder circle:not(.hit)","at":"20 790","from":"0.5763095613531423"},{"text":"2016 to 2017, game design","gap":18.59,"near":"path g","at":"148 260","from":"1.274036832193746"},{"text":"summers 2018 and 2020","gap":113.32,"near":"coast","at":"604 334","from":"1.0156543623993508"},{"text":"2019 to 2021","gap":40.3,"near":"trail-done","at":"268 458","from":"0.9068342521422774"},{"text":"on contract, 2021 to 2022","gap":35.59,"near":"path l","at":"550 301.1638323049141","from":"1.0156543623993508"},{"text":"autumn 2022","gap":83.93,"near":".st-line","at":"484 497","from":"0.6454667087155194"},{"text":"2023 to now","gap":285.61,"near":"rect null","at":"598 752.877067624152","from":"0.5336199642158724"},{"text":"case studies and everything else","gap":59.1,"near":"rect null","at":"68 806","from":"0.9068342521422774"}]
1440x900 zoom 0: [{"text":"Laurier","gap":6.81,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMC Connections","gap":5.4,"near":"path o","at":"592 284","from":"0.7926827477867662"},{"text":"Mohawk","gap":6.19,"near":".jg-hump","at":"52 412","from":"0.7926827477867662"},{"text":"HMC, again","gap":11.02,"near":"coast","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":7.41,"near":".st-line","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":6.36,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marks the work","gap":6.21,"near":"rect null","at":"124 796","from":"0.7926827477867662"},{"text":"autumn 2022","gap":6.8,"near":".st-line","at":"490 489.55871045223074","from":"0.7339655072099687"}]
1440x900 zoom 1: [{"text":"Laurier","gap":19.86,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMC Connections","gap":21.22,"near":"path g","at":"592 284","from":"0.7926827477867662"},{"text":"Mohawk","gap":16.04,"near":".jg-hump","at":"52 412","from":"0.7926827477867662"},{"text":"HMC, again","gap":36.37,"near":"coast","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":15.73,"near":"#f-beacon > g > .g","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":17.81,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marks the work","gap":19.46,"near":"rect null","at":"124 796","from":"0.7926827477867662"},{"text":"2016 to 2017, game design","gap":5.75,"near":"path g","at":"148 260","from":"1.2473016499804743"},{"text":"summers 2018 and 2020","gap":8.9,"near":"path l","at":"604 242.9335924435366","from":"0.8878046775211782"},{"text":"2019 to 2021","gap":22.03,"near":"coast","at":"52 428","from":"0.9943412388237197"},{"text":"on contract, 2021 to 2022","gap":41.04,"near":"coast","at":"598 318","from":"0.8878046775211782"},{"text":"autumn 2022","gap":17.76,"near":".st-line","at":"490 489.55871045223074","from":"0.7339655072099687"},{"text":"2023 to now","gap":20.4,"near":"trail-done","at":"301 718","from":"0.8878046775211782"}]
1440x900 zoom 2: [{"text":"Laurier","gap":109.89,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMC Connections","gap":117.23,"near":"path g","at":"592 284","from":"0.7926827477867662"},{"text":"Mohawk","gap":89.27,"near":".jg-hump","at":"52 412","from":"0.7926827477867662"},{"text":"HMC, again","gap":217.37,"near":"coast","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":87.59,"near":"#f-beacon > g > .g","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":139.25,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marks the work","gap":107.74,"near":"rect null","at":"124 796","from":"0.7926827477867662"},{"text":"2016 to 2017, game design","gap":33.67,"near":"path g","at":"148 260","from":"1.2473016499804743"},{"text":"summers 2018 and 2020","gap":50.71,"near":"path l","at":"604 242.9335924435366","from":"0.8878046775211782"},{"text":"2019 to 2021","gap":139.91,"near":"coast","at":"52 428","from":"0.9943412388237197"},{"text":"on contract, 2021 to 2022","gap":239.99,"near":"path pf","at":"598 318","from":"0.8878046775211782"},{"text":"autumn 2022","gap":116.19,"near":".st-line","at":"490 489.55871045223074","from":"0.7339655072099687"},{"text":"2023 to now","gap":116.78,"near":"trail-done","at":"301 718","from":"0.8878046775211782"},{"text":"case studies and everything else","gap":37.13,"near":"coast","at":"172 812","from":"1.962653294004221"}]
Failures: []
```

## node tools/comb-b-detail-test.mjs --refresh (exit 0)

```text
412x730: refreshed final overview, explore and south grove after T60 neighbour correction; closed-game hammer and found-map signs remain ["1","1"]
1440x900: refreshed final overview, explore and south grove after T60 neighbour correction; closed-game hammer and found-map signs remain ["1","1"]
```

## node --check art.mjs (exit 0)

```text
(no output)
```

## node --check cards.mjs (exit 0)

```text
(no output)
```

## node --check data.mjs (exit 0)

```text
(no output)
```

## node --check depth.mjs (exit 0)

```text
(no output)
```

## node --check explore.mjs (exit 0)

```text
(no output)
```

## node --check findall.mjs (exit 0)

```text
(no output)
```

## node --check findcreatures.mjs (exit 0)

```text
(no output)
```

## node --check findhammer.mjs (exit 0)

```text
(no output)
```

## node --check findhoards.mjs (exit 0)

```text
(no output)
```

## node --check findhorn.mjs (exit 0)

```text
(no output)
```

## node --check findkit.mjs (exit 0)

```text
(no output)
```

## node --check finds.mjs (exit 0)

```text
(no output)
```

## node --check findsheets.mjs (exit 0)

```text
(no output)
```

## node --check findwater.mjs (exit 0)

```text
(no output)
```

## node --check footer.mjs (exit 0)

```text
(no output)
```

## node --check footname.mjs (exit 0)

```text
(no output)
```

## node --check hammer.mjs (exit 0)

```text
(no output)
```

## node --check join.mjs (exit 0)

```text
(no output)
```

## node --check main.mjs (exit 0)

```text
(no output)
```

## node --check pace.mjs (exit 0)

```text
(no output)
```

## node --check stars.mjs (exit 0)

```text
(no output)
```

## node --check steps.mjs (exit 0)

```text
(no output)
```

## node --check timeline.mjs (exit 0)

```text
(no output)
```

## node --check trip.mjs (exit 0)

```text
(no output)
```

## node --check tools/audit-capture.mjs (exit 0)

```text
(no output)
```

## node --check tools/check.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-a-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-art-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-detail-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-layout-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-behaviour-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-browser.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-legend-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-record-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-tail-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-close-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-extra-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-joined-reduced-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-reduced-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-reopen-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/depth-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/explore-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/finds-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-cost.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-performance-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-render-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-visual-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/hammer-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/layout-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/motion-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/nova-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/origin-check.mjs (exit 0)

```text
(no output)
```

## node --check tools/pack-joined.mjs (exit 0)

```text
(no output)
```

## node --check tools/pack.mjs (exit 0)

```text
(no output)
```

## node --check tools/steps-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/whirl2-test.mjs (exit 0)

```text
(no output)
```

## node tools/check.mjs (exit 0)

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 16.14 KB / 30; all map modules + CSS 175.24 KB / 185
gzip: dist/journey-map.html 291.55 KB / 320
gzip: dist/journey-joined.html 512.01 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

## node tools/steps-test.mjs (exit 0)

```text
ok: paceT strictly rises; paceP round trips every whole P and the rest boundary within 1e-6
move | forward seconds | back seconds
top -> map | 4.100 | 2.460
map -> laurier | 3.813 | 3.813
laurier -> hmc1 | 3.841 | 3.841
hmc1 -> mohawk | 4.053 | 4.053
mohawk -> hmc2 | 4.200 | 4.200
hmc2 -> interkom | 3.345 | 3.345
interkom -> lennard | 3.834 | 3.834
lennard -> x | 2.600 | 2.600
x -> end | 5.900 | 3.540
ok: all 18 moves start/end correctly and never turn back; D4 glides use equal 2.6-4.4 s durations both ways; X-to-end keeps the 3 s rush plus blast/settle
ok: D4 map title top/map wheel and touch, 120 ms easing, 10/30 percent settle, clamps, Start/Set out lock, Back reset, flicks, owned drags and taps
ok: D4 joined hero top/map wheel and touch, 120 ms easing, 10/30 percent settle, clamps, Start/Set out lock, Back reset, flicks, owned drags and taps
ok: address cannot select Scroll; review only Depth; locked wheel never steps; only end CTA explores; two Back presses return then step; keyboard still advances
ok: C1 1440x900 20 repeated Next keys preserve 5904 ms arrival; repeated Back returns only to X
ok: C1 412x730 20 repeated Next keys preserve 5904 ms arrival; repeated Back returns only to X
ok: ORIGIN 50 ms desktop/phone open and reverse-close recording: tail stays on rim through tilt; shield never scales with the face or fades; X is inside the header
ok: six card X controls; local reopen focuses X without scrolling; mid-move X cannot focus departed mark; departure forgets override; reduced-motion list has no X
D5 pace 1440 joined leave: incoming 121.481481, outgoing 121.481487 P/s; cross-frame change 2.954143, uninterrupted maximum 45.843915 P/s; arrival 0.352 s; PASS
D5 pace 1440 joined fall: incoming 46.857143, outgoing 46.857145 P/s; cross-frame change 0.472015, uninterrupted maximum 45.843915 P/s; arrival 0.944 s; PASS
D5 pace 1440 X rush: incoming 28.348348, outgoing 28.348350 P/s; cross-frame change 0.306336, uninterrupted maximum 21.554523 P/s; arrival 0.720 s; PASS
D5 pace 390 joined leave: incoming 121.481481, outgoing 121.481487 P/s; cross-frame change 2.954143, uninterrupted maximum 45.843915 P/s; arrival 0.352 s; PASS
D5 pace 390 joined fall: incoming 46.857143, outgoing 46.857145 P/s; cross-frame change 0.472015, uninterrupted maximum 45.843915 P/s; arrival 0.944 s; PASS
D5 pace 390 X rush: incoming 28.348348, outgoing 28.348350 P/s; cross-frame change 0.306336, uninterrupted maximum 21.554523 P/s; arrival 0.720 s; PASS
ok: joined leave/fall and X rush Back carry exact dP/dt, meet the uninterrupted 16 ms continuity gate, turn within their beat and settle exactly
ok: X frame/phone box clear controls; rush through settle hides stepper and restores main focus
```

## node tools/nova-test.mjs (exit 0)

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is available for live reduced-motion switching
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 standalone: added 144; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 standalone 1.00s: 271.41 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.00s: 802.49 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.50s: 980.73 px/s, 157/168 on way
WHIRL 1440x900 standalone 2.90s: 998.14 px/s, 52/168 on way
WHIRL 1440x900 standalone 2.98s: 1115.28 px/s, 31/168 on way
WHIRL 1440x900 standalone: minimum 271.41 px/s vs 271.41 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 standalone: added 80; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 standalone 1.00s: 127.09 px/s, 96/96 on way
WHIRL 412x730 standalone 2.00s: 336.72 px/s, 96/96 on way
WHIRL 412x730 standalone 2.50s: 400.63 px/s, 90/96 on way
WHIRL 412x730 standalone 2.90s: 403.38 px/s, 30/96 on way
WHIRL 412x730 standalone 2.98s: 404.07 px/s, 18/96 on way
WHIRL 412x730 standalone: minimum 127.09 px/s vs 127.09 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 standalone: added 80; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 map: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 standalone 1.00s: 131.37 px/s, 96/96 on way
WHIRL 390x844 standalone 2.00s: 332.59 px/s, 96/96 on way
WHIRL 390x844 standalone 2.50s: 404.63 px/s, 90/96 on way
WHIRL 390x844 standalone 2.90s: 445.40 px/s, 30/96 on way
WHIRL 390x844 standalone 2.98s: 490.87 px/s, 18/96 on way
WHIRL 390x844 standalone: minimum 131.37 px/s vs 131.37 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 standalone: added 80; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 standalone 1.00s: 110.53 px/s, 96/96 on way
WHIRL 360x640 standalone 2.00s: 297.61 px/s, 96/96 on way
WHIRL 360x640 standalone 2.50s: 357.20 px/s, 90/96 on way
WHIRL 360x640 standalone 2.90s: 400.54 px/s, 30/96 on way
WHIRL 360x640 standalone 2.98s: 445.19 px/s, 18/96 on way
WHIRL 360x640 standalone: minimum 110.53 px/s vs 110.53 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 joined 1200: added 2; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 joined 1.00s: 305.59 px/s, 168/168 on way
WHIRL 1440x900 joined 2.00s: 868.53 px/s, 168/168 on way
WHIRL 1440x900 joined 2.50s: 1044.04 px/s, 157/168 on way
WHIRL 1440x900 joined 2.90s: 1093.23 px/s, 52/168 on way
WHIRL 1440x900 joined 2.98s: 1221.24 px/s, 31/168 on way
WHIRL 1440x900 joined: minimum 305.59 px/s vs 305.59 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 joined 278: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 joined 278: added 79; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 joined 1.00s: 109.12 px/s, 96/96 on way
WHIRL 412x730 joined 2.00s: 309.01 px/s, 96/96 on way
WHIRL 412x730 joined 2.50s: 377.79 px/s, 90/96 on way
WHIRL 412x730 joined 2.90s: 415.79 px/s, 30/96 on way
WHIRL 412x730 joined 2.98s: 532.71 px/s, 18/96 on way
WHIRL 412x730 joined: minimum 109.12 px/s vs 109.12 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 305: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 305: added 78; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 305: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 joined 1.00s: 110.39 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 299.25 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 363.45 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 413.50 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 521.90 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 110.39 px/s vs 110.39 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 joined 213: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 joined 213: added 81; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 joined 1.00s: 95.37 px/s, 96/96 on way
WHIRL 360x640 joined 2.00s: 274.00 px/s, 96/96 on way
WHIRL 360x640 joined 2.50s: 331.58 px/s, 90/96 on way
WHIRL 360x640 joined 2.90s: 371.06 px/s, 30/96 on way
WHIRL 360x640 joined 2.98s: 470.46 px/s, 18/96 on way
WHIRL 360x640 joined: minimum 95.37 px/s vs 95.37 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 240: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 240: added 77; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 240: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 joined 1.00s: 117.65 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 306.06 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 372.39 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 461.79 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 586.97 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 117.65 px/s vs 117.65 at 1s; minimum on way 17.71%; last 3.000000s
ok: WHIRL balanced visible sectors, own-side ring approach, continuous drain through last frame, speed/5%/last-arrival gates and rising late heat/core/glow alpha
ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged
```

## node tools/depth-test.mjs (exit 0)

```text
ok 1440x900: whole-map clouds intact/deck hidden; all high cloud/deck heights passed at dive end and every whole hold/leg/legX P; 10 low clouds stay, outside the frame
ok 1440x900: all 6 leg midpoints have mist visibility >0.5; camera boundaries agree within 1e-6; longest leg rises; pointer leaves ground fixed
ok 1440x900: D4 depth off keeps held scale continuously on ordinary glides; C1 X fit has its own camera
ok 1440x900: every find/phone/chest/wide view and explore zoom, k in .05 steps, deck follows tripS
ok 390x844: whole-map clouds intact/deck hidden; all high cloud/deck heights passed at dive end and every whole hold/leg/legX P; 10 low clouds stay, outside the frame
ok 390x844: all 6 leg midpoints have mist visibility >0.5; camera boundaries agree within 1e-6; longest leg rises; pointer leaves ground fixed
ok 390x844: D4 depth off keeps held scale continuously on ordinary glides; C1 X fit has its own camera
ok 390x844: every find/phone/chest/wide view and explore zoom, k in .05 steps, deck follows tripS
ok 1440x900: recording canvas preserves all 1200 hero positions at switch; sky freezes; nova continues; still drawing ignores motion clocks
ok 390x844: recording canvas preserves all 240 hero positions at switch; sky freezes; nova continues; still drawing ignores motion clocks
ok: presses stack independently; first expires on time; cap rejects without mutation; additive shares clamp; expired flares leave the list
ok: gather endpoints and continuous ring tangent for 32 arrival angles; explore restores depth fade
```

## node tools/layout-test.mjs (exit 0)

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

## node tools/explore-test.mjs (exit 0)

```text
ok: desktop/phone zoom limits, bounded/centred cameras, fixed zoom anchor, damped glides with no overshoot, layer/inverse round trips
ok: end-only CTA entry, input takeover, pan/release, resize, exit and immediate departure reset; P and traveller unchanged
ok: copied name curves monotone, lens/rest geometry and knock spring settling
ok: arrows pan during explore without changing P; Escape ends explore
ok: actual footer fades in linear time, is gone by 600 ms, returns over last 500 ms of exit, and stays inert while exploring
ok: FRAMES stationary pointer cancellation wakes one raster commit, then returns to idle
ok: capture-phase pinch on nova/stop/horn; nova taps; owned single drags; drag-only pointer clicks; key/end/depart/reset/down/500 ms suppression clearing; temporary world promotion
ok: D3 real findsBuild horn/chest/beacon pinches at 0/30/100 ms preserve found/stage and zoom >=20%; taps act once, chest hold repeats, owned drags aim/wipe/turn and press drags pan
```

## node tools/finds-test.mjs (exit 0)

```text
ok: B3 surfaced-hump sea digest recorded; coast and fill unchanged
ok: DEPTH/NOVA preserved; STARS.supply data digest recorded
ok: C1 camera/labels/tripS and deck source digests recorded
ok 1440x900: 36 views/cameras, k=0 deep-equal, k=1 centred/clamped/cards folded, monotone scale, P/traveller unchanged
ok 390x664: 36 views/cameras, k=0 deep-equal, k=1 centred/clamped/cards folded, monotone scale, P/traveller unchanged
ok: eleven accessible find groups, six marker ids and unnumbered legend id
ok: all-four mask derived from STOPS is Lennard alone; nineteen rune middles/letters; all piece icons available
ok: D2 tier-1 and sub-line groups fade to exact zero at find focus and return to one
ok: Jormungandr three leaves, five rapid pokes queue once, held leaf follows head, swells/closing/sleep/wake, one found count; eagle circle returns to perch
ok: recording DOM runs six Part A plays, kept state, all-four unlock, reel, chase, four notes, rubbing, copied review state and Back focus rules; no NaN attributes or frame layout reads
ok: hammer press/found/sheet; start/end fact; real button/rune focus; every game/explore key isolated, P unchanged; auto throwing; pointer speed; close/blur/hidden/focusout pause; resume/new seed; cached sprites; throwing storage reads/writes survive
ok: traveller wipes without finding; three mist thirds; all eleven hear timed horn; hold sounds, wide view and release; three Norns/stars/below tail; ship pennant/lamp; all-eleven landing/count/frame; overlays do not take pointers
ok: C2 ravens (tree drawn first, opaque birds, one drawing each, flights out of frame and back, facing, landing, reel and its kept items, epoch, shy hop, hear loop; outlines at least 1.20 units apart, largest pose step 7.78) and chests (staged dig, rattle, back lid, craft light, hints, kept popup): 1440x900: 1266 raven ticks; 390x844: 1266 raven ticks
ok: D2 falling quills fit one third of an open wing, stay behind takeoff/clear the other bird and expire by .8 s; 16 ms lid steps <=25 degrees, gentle start, .5 s peak, <=8 degree overshoot
ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast (8790 writes)
ok: reduced-motion serpent consumes leaves immediately with no swell; no shy hop; all tree actors stay still on hear
ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
ok: footer name layout reads 85 total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: {"resize":17,"fonts":17,"settle-end":17,"explore":34}
ok: actual timeline Home and End handlers select first and last stops
```

## node tools/motion-test.mjs (exit 0)

```text
view | move | measured seconds | centre peak px/s | five-point peak px/s | centre acceleration px/s^2
1440x900 | map->laurier | 3.824 | 226.46 | 383.45 | 528.63 @ 3488
1440x900 | laurier->map | 3.824 | 225.23 | 380.47 | 526.12 @ 352
1440x900 | laurier->hmc1 | 3.856 | 374.73 | 382.21 | 550.59 @ 368
1440x900 | hmc1->laurier | 3.856 | 374.07 | 383.61 | 558.24 @ 1504
1440x900 | hmc1->mohawk | 4.064 | 378.18 | 388.46 | 721.75 @ 1600
1440x900 | mohawk->hmc1 | 4.064 | 379.77 | 386.83 | 694.95 @ 2496
1440x900 | mohawk->hmc2 | 4.208 | 419.76 | 424.12 | 736.72 @ 2464
1440x900 | hmc2->mohawk | 4.208 | 420.32 | 425.49 | 741.84 @ 1776
1440x900 | hmc2->interkom | 3.360 | 290.50 | 291.60 | 494.00 @ 1696
1440x900 | interkom->hmc2 | 3.360 | 290.52 | 291.71 | 492.37 @ 1680
1440x900 | interkom->lennard | 3.840 | 414.00 | 422.55 | 1021.32 @ 1680
1440x900 | lennard->interkom | 3.840 | 416.58 | 421.07 | 1003.31 @ 2192
1440x900 | lennard->x | 2.608 | 170.15 | 179.17 | 416.84 @ 2320
1440x900 | x->lennard | 2.608 | 170.66 | 179.75 | 415.87 @ 304
390x844 | map->laurier | 3.968 | 139.30 | 221.15 | 311.15 @ 3632
390x844 | laurier->map | 3.968 | 138.60 | 219.75 | 309.67 @ 368
390x844 | laurier->hmc1 | 4.000 | 194.52 | 194.94 | 291.22 @ 384
390x844 | hmc1->laurier | 4.000 | 194.52 | 194.94 | 292.70 @ 3648
390x844 | hmc1->mohawk | 4.240 | 193.90 | 194.27 | 267.13 @ 432
390x844 | mohawk->hmc1 | 4.240 | 193.69 | 194.40 | 268.55 @ 3840
390x844 | mohawk->hmc2 | 4.400 | 233.59 | 234.12 | 311.29 @ 4016
390x844 | hmc2->mohawk | 4.400 | 233.61 | 234.01 | 309.81 @ 416
390x844 | hmc2->interkom | 3.440 | 136.66 | 136.99 | 223.74 @ 3136
390x844 | interkom->hmc2 | 3.440 | 136.65 | 136.98 | 222.92 @ 336
390x844 | interkom->lennard | 4.000 | 223.60 | 224.24 | 333.67 @ 368
390x844 | lennard->interkom | 4.000 | 223.57 | 224.43 | 335.29 @ 3648
390x844 | lennard->x | 2.608 | 81.17 | 103.46 | 290.08 @ 2400
390x844 | x->lennard | 2.608 | 81.26 | 103.83 | 290.01 @ 240
D5 view | press | runs | worst centre acceleration | five-point peak | arrival range s | total range s
1440x900 | Back | 42 | 1703.88 | 838.77 | 0.656-4.176 | 0.656-4.176
1440x900 | hurry | 49 | 4319.97 | 1755.52 | 0.464-4.768 | 0.464-5.056
1440x900 | Next-reverse | 42 | 1727.01 | 815.11 | 0.720-4.176 | 0.720-4.176
1440x900 | Back-Next | 7 | 1119.42 | 524.20 | 1.152-1.872 | 1.456-2.176
1440x900 | go-back | 14 | 1687.93 | 838.77 | 1.312-2.928 | 1.312-2.928
1440x900 | go-next | 14 | 1725.25 | 815.11 | 1.312-2.656 | 1.312-2.656
390x844 | Back | 42 | 1006.19 | 461.68 | 0.656-4.368 | 0.656-4.368
390x844 | hurry | 49 | 2530.15 | 950.09 | 0.464-6.720 | 0.464-7.024
390x844 | Next-reverse | 42 | 1011.15 | 461.68 | 0.768-4.368 | 0.768-4.368
390x844 | Back-Next | 7 | 714.22 | 282.55 | 1.152-1.952 | 1.456-2.256
390x844 | go-back | 14 | 925.68 | 461.68 | 1.312-2.224 | 1.312-2.224
390x844 | go-next | 14 | 890.26 | 461.68 | 1.312-2.224 | 1.312-2.224
ok: 28 rest glides, 336 carry runs and 14 late-hurry guards; 16 ms acceleration/five probes, analytic continuity, bounded reversals through 99 percent, exact settled arrivals, faster feasible hurry and fresh set(P) equality
```

## node tools/hammer-test.mjs (exit 0)

```text
ok: D3 foe heights incl stroke: giants/chief 16, hunched draugr 11, low full-width wolf 8; wave 1 varies; five overlapping shields span each unchanged segment
ok: original Norse foe silhouettes and their strokes fit unchanged hit boxes
ok: identical seeds and inputs match step for step
ok: 350 seeded formations/bosses fit their wave rows; unique fates; clay at 60%, heart at 30%
ok: 34 per-level rune effect checks; excluded runes absent
ok: cold includes both flights and glove; heat splits twice; draugr rises once; need multiplies the return upgrade; exposed stone heart doubles a hit
ok: return/catch, first-hit memory, shields, bridge loss; pool sizes and identities unchanged after 10,000 steps
steady: 200 seeds; wave 4 74.0%; wins 17.5%; ended by wave 3 26.0%; longest 223.6s; 0.00086 ms/step; 1.9s wall
ends {"6:bridge":6,"7:won":35,"5:bridge":10,"3:hearts":35,"5:hearts":42,"6:hearts":14,"4:hearts":28,"4:bridge":8,"2:hearts":12,"3:bridge":3,"7:hearts":5,"2:bridge":1,"1:hearts":1}
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00075 ms/step; 2.3s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

## node tools/frame-cost-test.mjs (exit 0)

```text
ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature
ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work
```

## node tools/frame-performance-test.mjs (exit 0)

```text
AFTER 412x730 / 72 moving frames: #cam writes 7; label writes 297; recovery 16 frames / 266.7 ms
ok: bounded pinch rasters agree with virtual camera; <=10% label settle steps; 250 ms recovery; translation-only raster; 50 real opening camera writes; interrupted zoom, resize/exit cleanup and zero idle writes
```

## node tools/frame-render-test.mjs (exit 0)

```text
phone explore zoom 1: scratch pixels cleared 3609120 -> 871895 (75.8% less); same drawing commands
phone explore zoom 2: scratch pixels cleared 3609120 -> 1037640 (71.2% less); same drawing commands
phone explore zoom 3: scratch pixels cleared 3609120 -> 760250 (78.9% less); same drawing commands
ok: 21 desktop/phone/1200-star WHIRL2 drawing-command snapshots; original blast primitives pinned by whirl2-test; not a pixel comparison
```

## node tools/whirl2-test.mjs (exit 0)

```text
ok: 1440x900/map 29 trip/find stills; added 144; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 412x730/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 360x640/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 1440x900/1200 29 trip/find stills; added 2; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 412x730/278 29 trip/find stills; added 79; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/305 29 trip/find stills; added 78; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 360x640/213 29 trip/find stills; added 81; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/240 29 trip/find stills; added 77; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: all sector targets survive full pointer look and 16 hero-dwell cases (1/5/30/120 s); no late creation or replacement
ok: WHIRL2 261 trail/sea still comparisons; 45 unchanged blast/remnant primitive comparisons (not pixels); source 0ea9f4bac16d6872c9f3798e45a58d9cbd5e461bdaab825cd3f70e1b2e17c246
```

## node tools/comb-c-tail-test.mjs (exit 0)

```text
1440x900: bounded tail max 38.000 px, proportional base, closed tail hidden
1024x600: bounded tail max 29.808 px, proportional base, closed tail hidden
412x730: bounded tail max 14.000 px, proportional base, closed tail hidden
390x844: bounded tail max 14.000 px, proportional base, closed tail hidden
360x640: bounded tail max 14.000 px, proportional base, closed tail hidden
844x390: bounded tail max 21.000 px, proportional base, closed tail hidden
ok: 1092 projected card samples; 360 ember/coast rays
```

## node tools/comb-b-art-test.mjs (exit 0)

```text
T6/T20: 5.90 map units between crowns; 2.30 CSS px between ink at 360 fit
T41/T42: 5.61 map units between crowns; 2.13 CSS px between ink at 360 fit
T57/T60: 6.27 map units between crowns; 2.51 CSS px between ink at 360 fit
T6: all-neighbour ink gap >= 2.48 CSS px at 360 fit
T42: all-neighbour ink gap >= 1.05 CSS px at 360 fit
T60: all-neighbour ink gap >= 1.59 CSS px at 360 fit
ok: unchanged hammer/horn/mist/serpent hits; ink-only masked mist; omitted tiny actors; full cell rims and persistent sign hooks
```

## node tools/frame-cost.mjs --cdp LOCAL --passes timing --scenarios 6,7,8,9 (exit 0)

```text
browser: Edg/158.0.4370.33; 412x730; DPR 2.625; touch true; CPU x4
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| map -> Laurier timing | 110 | 33.40 | 79.20 | 145.80 | 74 | 2 | 9.07 | 10.45 | 8.92 | 1.54 | 5.52 | 2.72 | 5.50 | 0.75 | 9.12 | 4 / 63.00 | N/A |
| Laurier -> HMC timing | 115 | 33.40 | 50.00 | 54.20 | 75 | 0 | 8.36 | 9.47 | 7.92 | 1.55 | 5.48 | 2.82 | 5.21 | 0.71 | 9.94 | 1 / 51.00 | N/A |
| HMC again -> Interkom timing | 109 | 29.20 | 41.70 | 45.90 | 46 | 0 | 7.21 | 8.70 | 7.26 | 1.44 | 4.66 | 2.55 | 5.19 | 0.68 | 8.26 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 113 | 29.20 | 37.60 | 45.90 | 37 | 0 | 6.98 | 8.18 | 6.78 | 1.40 | 4.62 | 2.60 | 5.31 | 0.66 | 8.15 | 0 / 0.00 | N/A |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| map -> Laurier timing | 131 | 29.20 | 41.60 | 58.30 | 36 | 0 | 6.96 | 8.77 | 7.46 | 1.31 | 4.74 | 2.44 | 5.02 | 0.64 | 8.89 | 2 / 59.00 | N/A |
| Laurier -> HMC timing | 114 | 33.40 | 50.00 | 58.40 | 74 | 0 | 7.63 | 10.26 | 8.49 | 1.77 | 5.89 | 2.70 | 4.88 | 0.78 | 9.53 | 3 / 52.00 | N/A |
| HMC again -> Interkom timing | 114 | 29.20 | 41.60 | 46.00 | 37 | 0 | 6.19 | 8.82 | 7.22 | 1.60 | 4.99 | 2.42 | 4.74 | 0.67 | 7.92 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 102 | 33.30 | 41.80 | 49.90 | 56 | 0 | 6.75 | 10.08 | 8.34 | 1.75 | 5.76 | 2.61 | 4.97 | 0.73 | 7.88 | 0 / 0.00 | N/A |
```

```text
COMB-C last-table p95 comparison: [{"key":"/journey-map.html/map -> Laurier timing","before":50.1,"after":79.2,"pass":false},{"key":"/journey-map.html/Laurier -> HMC timing","before":45.9,"after":50,"pass":false},{"key":"/journey-map.html/HMC again -> Interkom timing","before":41.8,"after":41.7,"pass":true},{"key":"/journey-map.html/Interkom -> HMC again / Back timing","before":45.9,"after":37.6,"pass":true},{"key":"/journey-joined.html/map -> Laurier timing","before":45.9,"after":41.6,"pass":true},{"key":"/journey-joined.html/Laurier -> HMC timing","before":41.7,"after":50,"pass":false},{"key":"/journey-joined.html/HMC again -> Interkom timing","before":45.8,"after":41.6,"pass":true},{"key":"/journey-joined.html/Interkom -> HMC again / Back timing","before":45.8,"after":41.8,"pass":true}]
```

## node --check art.mjs (exit 0)

```text
(no output)
```

## node --check cards.mjs (exit 0)

```text
(no output)
```

## node --check data.mjs (exit 0)

```text
(no output)
```

## node --check depth.mjs (exit 0)

```text
(no output)
```

## node --check explore.mjs (exit 0)

```text
(no output)
```

## node --check findall.mjs (exit 0)

```text
(no output)
```

## node --check findcreatures.mjs (exit 0)

```text
(no output)
```

## node --check findhammer.mjs (exit 0)

```text
(no output)
```

## node --check findhoards.mjs (exit 0)

```text
(no output)
```

## node --check findhorn.mjs (exit 0)

```text
(no output)
```

## node --check findkit.mjs (exit 0)

```text
(no output)
```

## node --check finds.mjs (exit 0)

```text
(no output)
```

## node --check findsheets.mjs (exit 0)

```text
(no output)
```

## node --check findwater.mjs (exit 0)

```text
(no output)
```

## node --check footer.mjs (exit 0)

```text
(no output)
```

## node --check footname.mjs (exit 0)

```text
(no output)
```

## node --check hammer.mjs (exit 0)

```text
(no output)
```

## node --check join.mjs (exit 0)

```text
(no output)
```

## node --check main.mjs (exit 0)

```text
(no output)
```

## node --check pace.mjs (exit 0)

```text
(no output)
```

## node --check stars.mjs (exit 0)

```text
(no output)
```

## node --check steps.mjs (exit 0)

```text
(no output)
```

## node --check timeline.mjs (exit 0)

```text
(no output)
```

## node --check trip.mjs (exit 0)

```text
(no output)
```

## node --check tools/audit-capture.mjs (exit 0)

```text
(no output)
```

## node --check tools/check.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-a-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-art-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-detail-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-layout-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-behaviour-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-browser.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-legend-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-record-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-tail-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-close-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-extra-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-joined-reduced-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-reduced-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-reopen-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/depth-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/explore-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/finds-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-cost.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-performance-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-render-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-visual-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/hammer-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/layout-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/motion-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/nova-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/origin-check.mjs (exit 0)

```text
(no output)
```

## node --check tools/pack-joined.mjs (exit 0)

```text
(no output)
```

## node --check tools/pack.mjs (exit 0)

```text
(no output)
```

## node --check tools/steps-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/whirl2-test.mjs (exit 0)

```text
(no output)
```

## node tools/check.mjs (exit 0)

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 16.14 KB / 30; all map modules + CSS 175.29 KB / 185
gzip: dist/journey-map.html 291.59 KB / 320
gzip: dist/journey-joined.html 512.06 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

## node tools/steps-test.mjs (exit 0)

```text
ok: paceT strictly rises; paceP round trips every whole P and the rest boundary within 1e-6
move | forward seconds | back seconds
top -> map | 4.100 | 2.460
map -> laurier | 3.813 | 3.813
laurier -> hmc1 | 3.841 | 3.841
hmc1 -> mohawk | 4.053 | 4.053
mohawk -> hmc2 | 4.200 | 4.200
hmc2 -> interkom | 3.345 | 3.345
interkom -> lennard | 3.834 | 3.834
lennard -> x | 2.600 | 2.600
x -> end | 5.900 | 3.540
ok: all 18 moves start/end correctly and never turn back; D4 glides use equal 2.6-4.4 s durations both ways; X-to-end keeps the 3 s rush plus blast/settle
ok: D4 map title top/map wheel and touch, 120 ms easing, 10/30 percent settle, clamps, Start/Set out lock, Back reset, flicks, owned drags and taps
ok: D4 joined hero top/map wheel and touch, 120 ms easing, 10/30 percent settle, clamps, Start/Set out lock, Back reset, flicks, owned drags and taps
ok: address cannot select Scroll; review only Depth; locked wheel never steps; only end CTA explores; two Back presses return then step; keyboard still advances
ok: C1 1440x900 20 repeated Next keys preserve 5904 ms arrival; repeated Back returns only to X
ok: C1 412x730 20 repeated Next keys preserve 5904 ms arrival; repeated Back returns only to X
ok: ORIGIN 50 ms desktop/phone open and reverse-close recording: tail stays on rim through tilt; shield never scales with the face or fades; X is inside the header
ok: six card X controls; local reopen focuses X without scrolling; mid-move X cannot focus departed mark; departure forgets override; reduced-motion list has no X
D5 pace 1440 joined leave: incoming 121.481481, outgoing 121.481487 P/s; cross-frame change 2.954143, uninterrupted maximum 45.843915 P/s; arrival 0.352 s; PASS
D5 pace 1440 joined fall: incoming 46.857143, outgoing 46.857145 P/s; cross-frame change 0.472015, uninterrupted maximum 45.843915 P/s; arrival 0.944 s; PASS
D5 pace 1440 X rush: incoming 28.348348, outgoing 28.348350 P/s; cross-frame change 0.306336, uninterrupted maximum 21.554523 P/s; arrival 0.720 s; PASS
D5 pace 390 joined leave: incoming 121.481481, outgoing 121.481487 P/s; cross-frame change 2.954143, uninterrupted maximum 45.843915 P/s; arrival 0.352 s; PASS
D5 pace 390 joined fall: incoming 46.857143, outgoing 46.857145 P/s; cross-frame change 0.472015, uninterrupted maximum 45.843915 P/s; arrival 0.944 s; PASS
D5 pace 390 X rush: incoming 28.348348, outgoing 28.348350 P/s; cross-frame change 0.306336, uninterrupted maximum 21.554523 P/s; arrival 0.720 s; PASS
ok: joined leave/fall and X rush Back carry exact dP/dt, meet the uninterrupted 16 ms continuity gate, turn within their beat and settle exactly
ok: X frame/phone box clear controls; rush through settle hides stepper and restores main focus
```

## node tools/nova-test.mjs (exit 0)

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is available for live reduced-motion switching
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 standalone: added 144; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 standalone 1.00s: 271.41 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.00s: 802.49 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.50s: 980.73 px/s, 157/168 on way
WHIRL 1440x900 standalone 2.90s: 998.14 px/s, 52/168 on way
WHIRL 1440x900 standalone 2.98s: 1115.28 px/s, 31/168 on way
WHIRL 1440x900 standalone: minimum 271.41 px/s vs 271.41 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 standalone: added 80; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 standalone 1.00s: 127.09 px/s, 96/96 on way
WHIRL 412x730 standalone 2.00s: 336.72 px/s, 96/96 on way
WHIRL 412x730 standalone 2.50s: 400.63 px/s, 90/96 on way
WHIRL 412x730 standalone 2.90s: 403.38 px/s, 30/96 on way
WHIRL 412x730 standalone 2.98s: 404.07 px/s, 18/96 on way
WHIRL 412x730 standalone: minimum 127.09 px/s vs 127.09 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 standalone: added 80; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 map: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 standalone 1.00s: 131.37 px/s, 96/96 on way
WHIRL 390x844 standalone 2.00s: 332.59 px/s, 96/96 on way
WHIRL 390x844 standalone 2.50s: 404.63 px/s, 90/96 on way
WHIRL 390x844 standalone 2.90s: 445.40 px/s, 30/96 on way
WHIRL 390x844 standalone 2.98s: 490.87 px/s, 18/96 on way
WHIRL 390x844 standalone: minimum 131.37 px/s vs 131.37 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 standalone: added 80; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 standalone 1.00s: 110.53 px/s, 96/96 on way
WHIRL 360x640 standalone 2.00s: 297.61 px/s, 96/96 on way
WHIRL 360x640 standalone 2.50s: 357.20 px/s, 90/96 on way
WHIRL 360x640 standalone 2.90s: 400.54 px/s, 30/96 on way
WHIRL 360x640 standalone 2.98s: 445.19 px/s, 18/96 on way
WHIRL 360x640 standalone: minimum 110.53 px/s vs 110.53 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 joined 1200: added 2; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 joined 1.00s: 305.59 px/s, 168/168 on way
WHIRL 1440x900 joined 2.00s: 868.53 px/s, 168/168 on way
WHIRL 1440x900 joined 2.50s: 1044.04 px/s, 157/168 on way
WHIRL 1440x900 joined 2.90s: 1093.23 px/s, 52/168 on way
WHIRL 1440x900 joined 2.98s: 1221.24 px/s, 31/168 on way
WHIRL 1440x900 joined: minimum 305.59 px/s vs 305.59 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 joined 278: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 joined 278: added 79; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 joined 1.00s: 109.12 px/s, 96/96 on way
WHIRL 412x730 joined 2.00s: 309.01 px/s, 96/96 on way
WHIRL 412x730 joined 2.50s: 377.79 px/s, 90/96 on way
WHIRL 412x730 joined 2.90s: 415.79 px/s, 30/96 on way
WHIRL 412x730 joined 2.98s: 532.71 px/s, 18/96 on way
WHIRL 412x730 joined: minimum 109.12 px/s vs 109.12 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 305: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 305: added 78; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 305: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 joined 1.00s: 110.39 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 299.25 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 363.45 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 413.50 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 521.90 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 110.39 px/s vs 110.39 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 joined 213: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 joined 213: added 81; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 joined 1.00s: 95.37 px/s, 96/96 on way
WHIRL 360x640 joined 2.00s: 274.00 px/s, 96/96 on way
WHIRL 360x640 joined 2.50s: 331.58 px/s, 90/96 on way
WHIRL 360x640 joined 2.90s: 371.06 px/s, 30/96 on way
WHIRL 360x640 joined 2.98s: 470.46 px/s, 18/96 on way
WHIRL 360x640 joined: minimum 95.37 px/s vs 95.37 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 240: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 240: added 77; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 240: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 joined 1.00s: 117.65 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 306.06 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 372.39 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 461.79 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 586.97 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 117.65 px/s vs 117.65 at 1s; minimum on way 17.71%; last 3.000000s
ok: WHIRL balanced visible sectors, own-side ring approach, continuous drain through last frame, speed/5%/last-arrival gates and rising late heat/core/glow alpha
ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged
```

## node tools/depth-test.mjs (exit 0)

```text
ok 1440x900: whole-map clouds intact/deck hidden; all high cloud/deck heights passed at dive end and every whole hold/leg/legX P; 10 low clouds stay, outside the frame
ok 1440x900: all 6 leg midpoints have mist visibility >0.5; camera boundaries agree within 1e-6; longest leg rises; pointer leaves ground fixed
ok 1440x900: D4 depth off keeps held scale continuously on ordinary glides; C1 X fit has its own camera
ok 1440x900: every find/phone/chest/wide view and explore zoom, k in .05 steps, deck follows tripS
ok 390x844: whole-map clouds intact/deck hidden; all high cloud/deck heights passed at dive end and every whole hold/leg/legX P; 10 low clouds stay, outside the frame
ok 390x844: all 6 leg midpoints have mist visibility >0.5; camera boundaries agree within 1e-6; longest leg rises; pointer leaves ground fixed
ok 390x844: D4 depth off keeps held scale continuously on ordinary glides; C1 X fit has its own camera
ok 390x844: every find/phone/chest/wide view and explore zoom, k in .05 steps, deck follows tripS
ok 1440x900: recording canvas preserves all 1200 hero positions at switch; sky freezes; nova continues; still drawing ignores motion clocks
ok 390x844: recording canvas preserves all 240 hero positions at switch; sky freezes; nova continues; still drawing ignores motion clocks
ok: presses stack independently; first expires on time; cap rejects without mutation; additive shares clamp; expired flares leave the list
ok: gather endpoints and continuous ring tangent for 32 arrival angles; explore restores depth fade
```

## node tools/layout-test.mjs (exit 0)

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

## node tools/explore-test.mjs (exit 0)

```text
ok: desktop/phone zoom limits, bounded/centred cameras, fixed zoom anchor, damped glides with no overshoot, layer/inverse round trips
ok: end-only CTA entry, input takeover, pan/release, resize, exit and immediate departure reset; P and traveller unchanged
ok: copied name curves monotone, lens/rest geometry and knock spring settling
ok: arrows pan during explore without changing P; Escape ends explore
ok: actual footer fades in linear time, is gone by 600 ms, returns over last 500 ms of exit, and stays inert while exploring
ok: FRAMES stationary pointer cancellation wakes one raster commit, then returns to idle
ok: capture-phase pinch on nova/stop/horn; nova taps; owned single drags; drag-only pointer clicks; key/end/depart/reset/down/500 ms suppression clearing; temporary world promotion
ok: D3 real findsBuild horn/chest/beacon pinches at 0/30/100 ms preserve found/stage and zoom >=20%; taps act once, chest hold repeats, owned drags aim/wipe/turn and press drags pan
```

## node tools/finds-test.mjs (exit 0)

```text
ok: B3 surfaced-hump sea digest recorded; coast and fill unchanged
ok: DEPTH/NOVA preserved; STARS.supply data digest recorded
ok: C1 camera/labels/tripS and deck source digests recorded
ok 1440x900: 36 views/cameras, k=0 deep-equal, k=1 centred/clamped/cards folded, monotone scale, P/traveller unchanged
ok 390x664: 36 views/cameras, k=0 deep-equal, k=1 centred/clamped/cards folded, monotone scale, P/traveller unchanged
ok: eleven accessible find groups, six marker ids and unnumbered legend id
ok: all-four mask derived from STOPS is Lennard alone; nineteen rune middles/letters; all piece icons available
ok: D2 tier-1 and sub-line groups fade to exact zero at find focus and return to one
ok: Jormungandr three leaves, five rapid pokes queue once, held leaf follows head, swells/closing/sleep/wake, one found count; eagle circle returns to perch
ok: recording DOM runs six Part A plays, kept state, all-four unlock, reel, chase, four notes, rubbing, copied review state and Back focus rules; no NaN attributes or frame layout reads
ok: hammer press/found/sheet; start/end fact; real button/rune focus; every game/explore key isolated, P unchanged; auto throwing; pointer speed; close/blur/hidden/focusout pause; resume/new seed; cached sprites; throwing storage reads/writes survive
ok: traveller wipes without finding; three mist thirds; all eleven hear timed horn; hold sounds, wide view and release; three Norns/stars/below tail; ship pennant/lamp; all-eleven landing/count/frame; overlays do not take pointers
ok: C2 ravens (tree drawn first, opaque birds, one drawing each, flights out of frame and back, facing, landing, reel and its kept items, epoch, shy hop, hear loop; outlines at least 1.20 units apart, largest pose step 7.78) and chests (staged dig, rattle, back lid, craft light, hints, kept popup): 1440x900: 1266 raven ticks; 390x844: 1266 raven ticks
ok: D2 falling quills fit one third of an open wing, stay behind takeoff/clear the other bird and expire by .8 s; 16 ms lid steps <=25 degrees, gentle start, .5 s peak, <=8 degree overshoot
ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast (8790 writes)
ok: reduced-motion serpent consumes leaves immediately with no swell; no shy hop; all tree actors stay still on hear
ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
ok: footer name layout reads 85 total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: {"resize":17,"fonts":17,"settle-end":17,"explore":34}
ok: actual timeline Home and End handlers select first and last stops
```

## node tools/motion-test.mjs (exit 0)

```text
view | move | measured seconds | centre peak px/s | five-point peak px/s | centre acceleration px/s^2
1440x900 | map->laurier | 3.824 | 226.46 | 383.45 | 528.63 @ 3488
1440x900 | laurier->map | 3.824 | 225.23 | 380.47 | 526.12 @ 352
1440x900 | laurier->hmc1 | 3.856 | 374.73 | 382.21 | 550.59 @ 368
1440x900 | hmc1->laurier | 3.856 | 374.07 | 383.61 | 558.24 @ 1504
1440x900 | hmc1->mohawk | 4.064 | 378.18 | 388.46 | 721.75 @ 1600
1440x900 | mohawk->hmc1 | 4.064 | 379.77 | 386.83 | 694.95 @ 2496
1440x900 | mohawk->hmc2 | 4.208 | 419.76 | 424.12 | 736.72 @ 2464
1440x900 | hmc2->mohawk | 4.208 | 420.32 | 425.49 | 741.84 @ 1776
1440x900 | hmc2->interkom | 3.360 | 290.50 | 291.60 | 494.00 @ 1696
1440x900 | interkom->hmc2 | 3.360 | 290.52 | 291.71 | 492.37 @ 1680
1440x900 | interkom->lennard | 3.840 | 414.00 | 422.55 | 1021.32 @ 1680
1440x900 | lennard->interkom | 3.840 | 416.58 | 421.07 | 1003.31 @ 2192
1440x900 | lennard->x | 2.608 | 170.15 | 179.17 | 416.84 @ 2320
1440x900 | x->lennard | 2.608 | 170.66 | 179.75 | 415.87 @ 304
390x844 | map->laurier | 3.968 | 139.30 | 221.15 | 311.15 @ 3632
390x844 | laurier->map | 3.968 | 138.60 | 219.75 | 309.67 @ 368
390x844 | laurier->hmc1 | 4.000 | 194.52 | 194.94 | 291.22 @ 384
390x844 | hmc1->laurier | 4.000 | 194.52 | 194.94 | 292.70 @ 3648
390x844 | hmc1->mohawk | 4.240 | 193.90 | 194.27 | 267.13 @ 432
390x844 | mohawk->hmc1 | 4.240 | 193.69 | 194.40 | 268.55 @ 3840
390x844 | mohawk->hmc2 | 4.400 | 233.59 | 234.12 | 311.29 @ 4016
390x844 | hmc2->mohawk | 4.400 | 233.61 | 234.01 | 309.81 @ 416
390x844 | hmc2->interkom | 3.440 | 136.66 | 136.99 | 223.74 @ 3136
390x844 | interkom->hmc2 | 3.440 | 136.65 | 136.98 | 222.92 @ 336
390x844 | interkom->lennard | 4.000 | 223.60 | 224.24 | 333.67 @ 368
390x844 | lennard->interkom | 4.000 | 223.57 | 224.43 | 335.29 @ 3648
390x844 | lennard->x | 2.608 | 81.17 | 103.46 | 290.08 @ 2400
390x844 | x->lennard | 2.608 | 81.26 | 103.83 | 290.01 @ 240
D5 view | press | runs | worst centre acceleration | five-point peak | arrival range s | total range s
1440x900 | Back | 42 | 1703.88 | 838.77 | 0.656-4.176 | 0.656-4.176
1440x900 | hurry | 49 | 4319.97 | 1755.52 | 0.464-4.768 | 0.464-5.056
1440x900 | Next-reverse | 42 | 1727.01 | 815.11 | 0.720-4.176 | 0.720-4.176
1440x900 | Back-Next | 7 | 1119.42 | 524.20 | 1.152-1.872 | 1.456-2.176
1440x900 | go-back | 14 | 1687.93 | 838.77 | 1.312-2.928 | 1.312-2.928
1440x900 | go-next | 14 | 1725.25 | 815.11 | 1.312-2.656 | 1.312-2.656
390x844 | Back | 42 | 1006.19 | 461.68 | 0.656-4.368 | 0.656-4.368
390x844 | hurry | 49 | 2530.15 | 950.09 | 0.464-6.720 | 0.464-7.024
390x844 | Next-reverse | 42 | 1011.15 | 461.68 | 0.768-4.368 | 0.768-4.368
390x844 | Back-Next | 7 | 714.22 | 282.55 | 1.152-1.952 | 1.456-2.256
390x844 | go-back | 14 | 925.68 | 461.68 | 1.312-2.224 | 1.312-2.224
390x844 | go-next | 14 | 890.26 | 461.68 | 1.312-2.224 | 1.312-2.224
ok: 28 rest glides, 336 carry runs and 14 late-hurry guards; 16 ms acceleration/five probes, analytic continuity, bounded reversals through 99 percent, exact settled arrivals, faster feasible hurry and fresh set(P) equality
```

## node tools/hammer-test.mjs (exit 0)

```text
ok: D3 foe heights incl stroke: giants/chief 16, hunched draugr 11, low full-width wolf 8; wave 1 varies; five overlapping shields span each unchanged segment
ok: original Norse foe silhouettes and their strokes fit unchanged hit boxes
ok: identical seeds and inputs match step for step
ok: 350 seeded formations/bosses fit their wave rows; unique fates; clay at 60%, heart at 30%
ok: 34 per-level rune effect checks; excluded runes absent
ok: cold includes both flights and glove; heat splits twice; draugr rises once; need multiplies the return upgrade; exposed stone heart doubles a hit
ok: return/catch, first-hit memory, shields, bridge loss; pool sizes and identities unchanged after 10,000 steps
steady: 200 seeds; wave 4 74.0%; wins 17.5%; ended by wave 3 26.0%; longest 223.6s; 0.00077 ms/step; 1.7s wall
ends {"6:bridge":6,"7:won":35,"5:bridge":10,"3:hearts":35,"5:hearts":42,"6:hearts":14,"4:hearts":28,"4:bridge":8,"2:hearts":12,"3:bridge":3,"7:hearts":5,"2:bridge":1,"1:hearts":1}
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00070 ms/step; 2.1s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

## node tools/frame-cost-test.mjs (exit 0)

```text
ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature
ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work
```

## node tools/frame-performance-test.mjs (exit 0)

```text
AFTER 412x730 / 72 moving frames: #cam writes 7; label writes 297; recovery 16 frames / 266.7 ms
ok: bounded pinch rasters agree with virtual camera; <=10% label settle steps; 250 ms recovery; translation-only raster; 50 real opening camera writes; interrupted zoom, resize/exit cleanup and zero idle writes
```

## node tools/frame-render-test.mjs (exit 0)

```text
phone explore zoom 1: scratch pixels cleared 3609120 -> 871895 (75.8% less); same drawing commands
phone explore zoom 2: scratch pixels cleared 3609120 -> 1037640 (71.2% less); same drawing commands
phone explore zoom 3: scratch pixels cleared 3609120 -> 760250 (78.9% less); same drawing commands
ok: 21 desktop/phone/1200-star WHIRL2 drawing-command snapshots; original blast primitives pinned by whirl2-test; not a pixel comparison
```

## node tools/whirl2-test.mjs (exit 0)

```text
ok: 1440x900/map 29 trip/find stills; added 144; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 412x730/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 360x640/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 1440x900/1200 29 trip/find stills; added 2; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 412x730/278 29 trip/find stills; added 79; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/305 29 trip/find stills; added 78; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 360x640/213 29 trip/find stills; added 81; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/240 29 trip/find stills; added 77; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: all sector targets survive full pointer look and 16 hero-dwell cases (1/5/30/120 s); no late creation or replacement
ok: WHIRL2 261 trail/sea still comparisons; 45 unchanged blast/remnant primitive comparisons (not pixels); source 0ea9f4bac16d6872c9f3798e45a58d9cbd5e461bdaab825cd3f70e1b2e17c246
```

## node tools/comb-c-tail-test.mjs (exit 0)

```text
1440x900: bounded tail max 38.000 px, proportional base, closed tail hidden
1024x600: bounded tail max 29.808 px, proportional base, closed tail hidden
412x730: bounded tail max 14.000 px, proportional base, closed tail hidden
390x844: bounded tail max 14.000 px, proportional base, closed tail hidden
360x640: bounded tail max 14.000 px, proportional base, closed tail hidden
844x390: bounded tail max 21.000 px, proportional base, closed tail hidden
ok: 1092 projected card samples; 360 ember/coast rays
```

## node tools/comb-b-art-test.mjs (exit 0)

```text
T6/T20: 5.90 map units between crowns; 2.30 CSS px between ink at 360 fit
T41/T42: 5.61 map units between crowns; 2.13 CSS px between ink at 360 fit
T57/T60: 6.27 map units between crowns; 2.51 CSS px between ink at 360 fit
T6: all-neighbour ink gap >= 2.48 CSS px at 360 fit
T42: all-neighbour ink gap >= 1.05 CSS px at 360 fit
T60: all-neighbour ink gap >= 1.59 CSS px at 360 fit
ok: unchanged hammer/horn/mist/serpent hits; ink-only masked mist; omitted tiny actors; full cell rims and persistent sign hooks
```

## node tools/frame-cost.mjs --cdp LOCAL --passes timing --scenarios 6,7,8,9 (exit 0)

```text
browser: Edg/158.0.4370.33; 412x730; DPR 2.625; touch true; CPU x4
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| map -> Laurier timing | 128 | 29.20 | 58.30 | 154.40 | 38 | 3 | 7.58 | 8.36 | 7.16 | 1.20 | 4.89 | 2.38 | 5.02 | 0.64 | 8.39 | 1 / 50.00 | N/A |
| Laurier -> HMC timing | 138 | 29.10 | 37.50 | 45.90 | 33 | 0 | 6.75 | 7.91 | 6.67 | 1.24 | 4.57 | 2.44 | 4.81 | 0.61 | 9.04 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 117 | 29.20 | 37.50 | 45.90 | 26 | 0 | 6.63 | 7.76 | 6.46 | 1.29 | 4.44 | 2.54 | 5.13 | 0.61 | 8.13 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 116 | 29.10 | 41.60 | 45.90 | 38 | 0 | 6.60 | 8.10 | 6.77 | 1.32 | 4.43 | 2.57 | 5.24 | 0.59 | 7.99 | 0 / 0.00 | N/A |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| map -> Laurier timing | 128 | 29.20 | 45.90 | 58.50 | 43 | 0 | 6.96 | 8.85 | 7.55 | 1.30 | 4.86 | 2.46 | 5.18 | 0.65 | 8.88 | 2 / 58.00 | N/A |
| Laurier -> HMC timing | 128 | 29.20 | 41.70 | 50.10 | 41 | 0 | 6.77 | 8.86 | 7.43 | 1.43 | 5.40 | 2.64 | 5.01 | 0.67 | 9.16 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 111 | 29.20 | 41.80 | 54.20 | 44 | 0 | 6.37 | 8.64 | 7.11 | 1.54 | 5.18 | 2.74 | 5.37 | 0.64 | 8.27 | 1 / 51.00 | N/A |
| Interkom -> HMC again / Back timing | 118 | 29.10 | 37.60 | 50.10 | 33 | 0 | 5.90 | 8.20 | 6.77 | 1.43 | 4.57 | 2.58 | 5.23 | 0.61 | 8.03 | 0 / 0.00 | N/A |
```

```text
COMB-C last-table p95 comparison: [{"key":"/journey-map.html/map -> Laurier timing","before":50.1,"after":58.3,"pass":false},{"key":"/journey-map.html/Laurier -> HMC timing","before":45.9,"after":37.5,"pass":true},{"key":"/journey-map.html/HMC again -> Interkom timing","before":41.8,"after":37.5,"pass":true},{"key":"/journey-map.html/Interkom -> HMC again / Back timing","before":45.9,"after":41.6,"pass":true},{"key":"/journey-joined.html/map -> Laurier timing","before":45.9,"after":45.9,"pass":true},{"key":"/journey-joined.html/Laurier -> HMC timing","before":41.7,"after":41.7,"pass":true},{"key":"/journey-joined.html/HMC again -> Interkom timing","before":45.8,"after":41.8,"pass":true},{"key":"/journey-joined.html/Interkom -> HMC again / Back timing","before":45.8,"after":37.6,"pass":true}]
```

## Capture command output

```text
node tools/comb-b-browser-test.mjs before: exit 0
ok: before phone/desktop drawing captures at DPR 2; exceptions=[]
node tools/comb-b-browser-test.mjs after: exit 0
ok: after phone/desktop drawing captures at DPR 2; exceptions=[]
node tools/comb-b-browser-test.mjs final: exit 0
final-412x730 cached explore label zoom writes: {"anchorTransforms":0,"markup":0,"visibilityChanges":6}
final-1440x900 cached explore label zoom writes: {"anchorTransforms":0,"markup":0,"visibilityChanges":6}
ok: final phone/desktop drawing captures at DPR 2; exceptions=[]
node --check trip.mjs (ad hoc before packing): exit 0, no output
```

## Cold-glide follow-up

The fresh-page confirmation still failed the standalone first glide: 58.30 ms p95 against 50.10 ms. Seven other comparisons passed. Removed per-segment temporary box allocation and unnecessary text-node replacement from label measurement. The final change also defers the unused explore placement search to its first entry boundary, and recomputes it on resize only while explore is open. Font metrics remain cached at resize. No placement search or layout read was added to the frame loop. The next outputs are the final verification, including any remaining failure.

## node tools/comb-b-layout-test.mjs --labels (exit 0)

```text
412x730 zoom 0: [{"text":"Laurier","gap":6.5,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMC Connections","gap":5.62,"near":"path o","at":"598 284","from":"0.6706592295668311"},{"text":"Mohawk","gap":4.57,"near":".jg-hump","at":"46 412","from":"0.6706592295668311"},{"text":"HMC, again","gap":11.41,"near":"coast","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":4.64,"near":".st-line","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":6.32,"near":".st-line","at":"310 704","from":"0.6706592295668311"},{"text":"X marks the work","gap":4.4,"near":"rect null","at":"118 796","from":"0.6706592295668311"},{"text":"autumn 2022","gap":6.86,"near":".st-line","at":"490 503","from":"0.6209807681174362"}]
412x730 zoom 1: [{"text":"Laurier","gap":17.77,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMC Connections","gap":22.06,"near":"path g","at":"598 284","from":"0.6706592295668311"},{"text":"Mohawk","gap":13.48,"near":".jg-hump","at":"46 412","from":"0.6706592295668311"},{"text":"HMC, again","gap":37.2,"near":"coast","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":13.21,"near":"#f-beacon > g > .g","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":16.72,"near":".st-line","at":"310 704","from":"0.6706592295668311"},{"text":"X marks the work","gap":16.37,"near":"rect null","at":"118 796","from":"0.6706592295668311"},{"text":"summers 2018 and 2020","gap":7.89,"near":".jg-hump","at":"598 240.31556502375656","from":"0.9422279300768691"},{"text":"2019 to 2021","gap":19.58,"near":"#f-horn .hn-horn","at":"46 440.2518566594401","from":"0.9422279300768691"},{"text":"on contract, 2021 to 2022","gap":38,"near":"coast","at":"604 320","from":"0.9422279300768691"},{"text":"autumn 2022","gap":18.35,"near":".st-line","at":"490 503","from":"0.6209807681174362"},{"text":"2023 to now","gap":9.01,"near":"trail-done","at":"310 720","from":"0.9422279300768691"}]
412x730 zoom 2: [{"text":"Laurier","gap":78.29,"near":"trail-done","at":"166 248","from":"0.6706592295668311"},{"text":"HMC Connections","gap":93.22,"near":"path g","at":"598 284","from":"0.6706592295668311"},{"text":"Mohawk","gap":57.69,"near":".jg-hump","at":"46 412","from":"0.6706592295668311"},{"text":"HMC, again","gap":165.98,"near":"coast","at":"580 352","from":"0.6706592295668311"},{"text":"Interkom","gap":56.6,"near":"#f-beacon > g > .g","at":"490 463","from":"0.6706592295668311"},{"text":"Lennard","gap":86.87,"near":".st-line","at":"310 704","from":"0.6706592295668311"},{"text":"X marks the work","gap":69.67,"near":"rect null","at":"118 796","from":"0.6706592295668311"},{"text":"2016 to 2017, game design","gap":21.63,"near":"path g","at":"154 260","from":"1.3237624013470357"},{"text":"summers 2018 and 2020","gap":35.04,"near":".jg-hump","at":"598 240.31556502375656","from":"0.9422279300768691"},{"text":"2019 to 2021","gap":83.12,"near":"#f-horn .hn-horn","at":"46 440.2518566594401","from":"0.9422279300768691"},{"text":"on contract, 2021 to 2022","gap":173.82,"near":"coast","at":"604 320","from":"0.9422279300768691"},{"text":"autumn 2022","gap":80.06,"near":".st-line","at":"490 503","from":"0.6209807681174362"},{"text":"2023 to now","gap":42.16,"near":"trail-done","at":"310 720","from":"0.9422279300768691"},{"text":"case studies and everything else","gap":23.37,"near":"coast","at":"166 812","from":"2.0829657665596515"}]
390x844 zoom 0: [{"text":"Laurier","gap":5.75,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMC Connections","gap":5.19,"near":"path g","at":"604 284","from":"0.6409807355516638"},{"text":"Mohawk","gap":5.1,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC, again","gap":9.83,"near":"coast","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":6.43,"near":"path l","at":"484 463","from":"0.6409807355516638"},{"text":"Lennard","gap":5.73,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marks the work","gap":5.3,"near":"#f-wayfinder circle:not(.hit)","at":"20 790","from":"0.6409807355516638"},{"text":"autumn 2022","gap":5.44,"near":"circle g","at":"484 503","from":"0.5935006810663553"}]
390x844 zoom 1: [{"text":"Laurier","gap":16.92,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMC Connections","gap":26.24,"near":"path g","at":"604 284","from":"0.6409807355516638"},{"text":"Mohawk","gap":15.36,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC, again","gap":35.61,"near":"coast","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":19.34,"near":"#f-beacon > g > .g","at":"484 463","from":"0.6409807355516638"},{"text":"Lennard","gap":15.67,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marks the work","gap":16.5,"near":"#f-wayfinder circle:not(.hit)","at":"20 790","from":"0.6409807355516638"},{"text":"summers 2018 and 2020","gap":35.55,"near":"coast","at":"604 316","from":"0.9005317828371282"},{"text":"2019 to 2021","gap":9.84,"near":"trail-done","at":"244 452","from":"0.9005317828371282"},{"text":"autumn 2022","gap":22.87,"near":".st-line","at":"484 503","from":"0.5935006810663553"},{"text":"2023 to now","gap":16.03,"near":"trail-done","at":"298 720","from":"0.9005317828371282"},{"text":"case studies and everything else","gap":15.23,"near":"rect null","at":"68 806","from":"0.9005317828371282"}]
390x844 zoom 2: [{"text":"Laurier","gap":73.67,"near":"trail-done","at":"166 248","from":"0.6409807355516638"},{"text":"HMC Connections","gap":108.94,"near":"path g","at":"604 284","from":"0.6409807355516638"},{"text":"Mohawk","gap":64.55,"near":"path null","at":"244 436","from":"0.6409807355516638"},{"text":"HMC, again","gap":156.37,"near":"coast","at":"580 352","from":"0.6409807355516638"},{"text":"Interkom","gap":80.78,"near":"#f-beacon > g > .g","at":"484 463","from":"0.6409807355516638"},{"text":"Lennard","gap":80.18,"near":".st-line","at":"310 704","from":"0.6409807355516638"},{"text":"X marks the work","gap":69.21,"near":"#f-wayfinder circle:not(.hit)","at":"20 790","from":"0.6409807355516638"},{"text":"2016 to 2017, game design","gap":20.34,"near":"path g","at":"154 260","from":"1.2651823165978011"},{"text":"summers 2018 and 2020","gap":169.04,"near":"path pf","at":"604 316","from":"0.9005317828371282"},{"text":"2019 to 2021","gap":46.79,"near":"trail-done","at":"244 452","from":"0.9005317828371282"},{"text":"on contract, 2021 to 2022","gap":51.33,"near":"coast","at":"604 397.707098326465","from":"1.2651823165978011"},{"text":"autumn 2022","gap":99.88,"near":".st-line","at":"484 503","from":"0.5935006810663553"},{"text":"2023 to now","gap":70.54,"near":"trail-done","at":"298 720","from":"0.9005317828371282"},{"text":"case studies and everything else","gap":64.56,"near":"rect null","at":"68 806","from":"0.9005317828371282"}]
360x640 zoom 0: [{"text":"Laurier","gap":4.37,"near":"trail-done","at":"166 248","from":"0.5884413309982487"},{"text":"HMC Connections","gap":8.15,"near":"path g","at":"604 302","from":"0.5884413309982487"},{"text":"Mohawk","gap":5.84,"near":"#f-mist .mist-cloud","at":"244 442","from":"0.5884413309982487"},{"text":"HMC, again","gap":10.24,"near":"coast","at":"586 352","from":"0.5884413309982487"},{"text":"Interkom","gap":6.86,"near":".st-line","at":"484 457","from":"0.5884413309982487"},{"text":"Lennard","gap":9.24,"near":"coast","at":"574 720","from":"0.5884413309982487"},{"text":"X marks the work","gap":4.03,"near":"#f-wayfinder circle:not(.hit)","at":"20 790","from":"0.5884413309982487"},{"text":"2023 to now","gap":8.53,"near":"coast","at":"586 752.1992481203008","from":"0.5448530842576377"}]
360x640 zoom 1: [{"text":"Laurier","gap":15.41,"near":"trail-done","at":"166 248","from":"0.5884413309982487"},{"text":"HMC Connections","gap":38.18,"near":"path g","at":"604 302","from":"0.5884413309982487"},{"text":"Mohawk","gap":19.74,"near":"trail-done","at":"244 442","from":"0.5884413309982487"},{"text":"HMC, again","gap":38.74,"near":"coast","at":"586 352","from":"0.5884413309982487"},{"text":"Interkom","gap":19.58,"near":"#f-beacon > g > .g","at":"484 457","from":"0.5884413309982487"},{"text":"Lennard","gap":42.13,"near":"coast","at":"574 720","from":"0.5884413309982487"},{"text":"X marks the work","gap":14.95,"near":"#f-wayfinder circle:not(.hit)","at":"20 790","from":"0.5884413309982487"},{"text":"summers 2018 and 2020","gap":15.46,"near":"coast","at":"604 334","from":"1.0370346857359023"},{"text":"2019 to 2021","gap":7.95,"near":"trail-done","at":"268 458","from":"0.9259238265499127"},{"text":"on contract, 2021 to 2022","gap":6.86,"near":"path l","at":"550 302.2119107515292","from":"1.0370346857359023"},{"text":"autumn 2022","gap":18.05,"near":".st-line","at":"484 497","from":"0.6590542907180386"},{"text":"2023 to now","gap":50.99,"near":"coast","at":"586 752.1992481203008","from":"0.5448530842576377"},{"text":"case studies and everything else","gap":13.73,"near":"rect null","at":"68 806","from":"0.9259238265499127"}]
360x640 zoom 2: [{"text":"Laurier","gap":67.37,"near":"trail-done","at":"166 248","from":"0.5884413309982487"},{"text":"HMC Connections","gap":157.38,"near":"path g","at":"604 302","from":"0.5884413309982487"},{"text":"Mohawk","gap":84.16,"near":"path null","at":"244 442","from":"0.5884413309982487"},{"text":"HMC, again","gap":167.9,"near":"coast","at":"586 352","from":"0.5884413309982487"},{"text":"Interkom","gap":81.62,"near":"#f-beacon > g > .g","at":"484 457","from":"0.5884413309982487"},{"text":"Lennard","gap":181.7,"near":"coast","at":"574 720","from":"0.5884413309982487"},{"text":"X marks the work","gap":63.36,"near":"#f-wayfinder circle:not(.hit)","at":"20 790","from":"0.5884413309982487"},{"text":"2016 to 2017, game design","gap":18.59,"near":"path g","at":"154 260","from":"1.300856309787116"},{"text":"summers 2018 and 2020","gap":113.32,"near":"coast","at":"604 334","from":"1.0370346857359023"},{"text":"2019 to 2021","gap":40.3,"near":"trail-done","at":"268 458","from":"0.9259238265499127"},{"text":"on contract, 2021 to 2022","gap":31.12,"near":"path l","at":"550 302.2119107515292","from":"1.0370346857359023"},{"text":"autumn 2022","gap":83.93,"near":".st-line","at":"484 497","from":"0.6590542907180386"},{"text":"2023 to now","gap":241.93,"near":"coast","at":"586 752.1992481203008","from":"0.5448530842576377"},{"text":"case studies and everything else","gap":59.1,"near":"rect null","at":"68 806","from":"0.9259238265499127"}]
1440x900 zoom 0: [{"text":"Laurier","gap":6.75,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMC Connections","gap":5.23,"near":"path o","at":"592 284","from":"0.7926827477867662"},{"text":"Mohawk","gap":6.16,"near":".jg-hump","at":"52 412","from":"0.7926827477867662"},{"text":"HMC, again","gap":10.92,"near":"coast","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":7.41,"near":".st-line","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":6.35,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marks the work","gap":6.16,"near":"rect null","at":"124 796","from":"0.7926827477867662"},{"text":"autumn 2022","gap":6.8,"near":".st-line","at":"490 489.55871045223074","from":"0.7339655072099687"}]
1440x900 zoom 1: [{"text":"Laurier","gap":19.86,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMC Connections","gap":21.22,"near":"path g","at":"592 284","from":"0.7926827477867662"},{"text":"Mohawk","gap":16.04,"near":".jg-hump","at":"52 412","from":"0.7926827477867662"},{"text":"HMC, again","gap":36.37,"near":"coast","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":15.73,"near":"#f-beacon > g > .g","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":17.81,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marks the work","gap":19.46,"near":"rect null","at":"124 796","from":"0.7926827477867662"},{"text":"2016 to 2017, game design","gap":5.75,"near":"path g","at":"148 260","from":"1.2473016499804743"},{"text":"summers 2018 and 2020","gap":8.9,"near":"path l","at":"604 242.9335924435366","from":"0.8878046775211782"},{"text":"2019 to 2021","gap":22.03,"near":"coast","at":"52 428","from":"0.9943412388237197"},{"text":"on contract, 2021 to 2022","gap":41.04,"near":"coast","at":"598 318","from":"0.8878046775211782"},{"text":"autumn 2022","gap":17.76,"near":".st-line","at":"490 489.55871045223074","from":"0.7339655072099687"},{"text":"2023 to now","gap":20.4,"near":"trail-done","at":"301 718","from":"0.8878046775211782"}]
1440x900 zoom 2: [{"text":"Laurier","gap":109.89,"near":"#f-hammer .hm-lift","at":"160 248","from":"0.7926827477867662"},{"text":"HMC Connections","gap":117.23,"near":"path g","at":"592 284","from":"0.7926827477867662"},{"text":"Mohawk","gap":89.27,"near":".jg-hump","at":"52 412","from":"0.7926827477867662"},{"text":"HMC, again","gap":217.37,"near":"coast","at":"574 350","from":"0.7926827477867662"},{"text":"Interkom","gap":87.59,"near":"#f-beacon > g > .g","at":"490 463","from":"0.7926827477867662"},{"text":"Lennard","gap":139.25,"near":".st-line","at":"313 702","from":"0.7926827477867662"},{"text":"X marks the work","gap":107.74,"near":"rect null","at":"124 796","from":"0.7926827477867662"},{"text":"2016 to 2017, game design","gap":33.67,"near":"path g","at":"148 260","from":"1.2473016499804743"},{"text":"summers 2018 and 2020","gap":50.71,"near":"path l","at":"604 242.9335924435366","from":"0.8878046775211782"},{"text":"2019 to 2021","gap":139.91,"near":"coast","at":"52 428","from":"0.9943412388237197"},{"text":"on contract, 2021 to 2022","gap":239.99,"near":"path pf","at":"598 318","from":"0.8878046775211782"},{"text":"autumn 2022","gap":116.19,"near":".st-line","at":"490 489.55871045223074","from":"0.7339655072099687"},{"text":"2023 to now","gap":116.78,"near":"trail-done","at":"301 718","from":"0.8878046775211782"},{"text":"case studies and everything else","gap":37.13,"near":"coast","at":"172 812","from":"1.962653294004221"}]
Failures: []
```

## node --check art.mjs (exit 0)

```text
(no output)
```

## node --check cards.mjs (exit 0)

```text
(no output)
```

## node --check data.mjs (exit 0)

```text
(no output)
```

## node --check depth.mjs (exit 0)

```text
(no output)
```

## node --check explore.mjs (exit 0)

```text
(no output)
```

## node --check findall.mjs (exit 0)

```text
(no output)
```

## node --check findcreatures.mjs (exit 0)

```text
(no output)
```

## node --check findhammer.mjs (exit 0)

```text
(no output)
```

## node --check findhoards.mjs (exit 0)

```text
(no output)
```

## node --check findhorn.mjs (exit 0)

```text
(no output)
```

## node --check findkit.mjs (exit 0)

```text
(no output)
```

## node --check finds.mjs (exit 0)

```text
(no output)
```

## node --check findsheets.mjs (exit 0)

```text
(no output)
```

## node --check findwater.mjs (exit 0)

```text
(no output)
```

## node --check footer.mjs (exit 0)

```text
(no output)
```

## node --check footname.mjs (exit 0)

```text
(no output)
```

## node --check hammer.mjs (exit 0)

```text
(no output)
```

## node --check join.mjs (exit 0)

```text
(no output)
```

## node --check main.mjs (exit 0)

```text
(no output)
```

## node --check pace.mjs (exit 0)

```text
(no output)
```

## node --check stars.mjs (exit 0)

```text
(no output)
```

## node --check steps.mjs (exit 0)

```text
(no output)
```

## node --check timeline.mjs (exit 0)

```text
(no output)
```

## node --check trip.mjs (exit 0)

```text
(no output)
```

## node --check tools/audit-capture.mjs (exit 0)

```text
(no output)
```

## node --check tools/check.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-a-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-art-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-detail-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-layout-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-behaviour-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-browser.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-legend-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-record-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-tail-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-close-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-extra-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-joined-reduced-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-reduced-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-reopen-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/depth-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/explore-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/finds-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-cost.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-performance-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-render-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-visual-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/hammer-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/layout-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/motion-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/nova-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/origin-check.mjs (exit 0)

```text
(no output)
```

## node --check tools/pack-joined.mjs (exit 0)

```text
(no output)
```

## node --check tools/pack.mjs (exit 0)

```text
(no output)
```

## node --check tools/steps-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/whirl2-test.mjs (exit 0)

```text
(no output)
```

## node tools/check.mjs (exit 0)

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 16.14 KB / 30; all map modules + CSS 175.32 KB / 185
gzip: dist/journey-map.html 291.62 KB / 320
gzip: dist/journey-joined.html 512.09 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

## node tools/steps-test.mjs (exit 0)

```text
ok: paceT strictly rises; paceP round trips every whole P and the rest boundary within 1e-6
move | forward seconds | back seconds
top -> map | 4.100 | 2.460
map -> laurier | 3.813 | 3.813
laurier -> hmc1 | 3.841 | 3.841
hmc1 -> mohawk | 4.053 | 4.053
mohawk -> hmc2 | 4.200 | 4.200
hmc2 -> interkom | 3.345 | 3.345
interkom -> lennard | 3.834 | 3.834
lennard -> x | 2.600 | 2.600
x -> end | 5.900 | 3.540
ok: all 18 moves start/end correctly and never turn back; D4 glides use equal 2.6-4.4 s durations both ways; X-to-end keeps the 3 s rush plus blast/settle
ok: D4 map title top/map wheel and touch, 120 ms easing, 10/30 percent settle, clamps, Start/Set out lock, Back reset, flicks, owned drags and taps
ok: D4 joined hero top/map wheel and touch, 120 ms easing, 10/30 percent settle, clamps, Start/Set out lock, Back reset, flicks, owned drags and taps
ok: address cannot select Scroll; review only Depth; locked wheel never steps; only end CTA explores; two Back presses return then step; keyboard still advances
ok: C1 1440x900 20 repeated Next keys preserve 5904 ms arrival; repeated Back returns only to X
ok: C1 412x730 20 repeated Next keys preserve 5904 ms arrival; repeated Back returns only to X
ok: ORIGIN 50 ms desktop/phone open and reverse-close recording: tail stays on rim through tilt; shield never scales with the face or fades; X is inside the header
ok: six card X controls; local reopen focuses X without scrolling; mid-move X cannot focus departed mark; departure forgets override; reduced-motion list has no X
D5 pace 1440 joined leave: incoming 121.481481, outgoing 121.481487 P/s; cross-frame change 2.954143, uninterrupted maximum 45.843915 P/s; arrival 0.352 s; PASS
D5 pace 1440 joined fall: incoming 46.857143, outgoing 46.857145 P/s; cross-frame change 0.472015, uninterrupted maximum 45.843915 P/s; arrival 0.944 s; PASS
D5 pace 1440 X rush: incoming 28.348348, outgoing 28.348350 P/s; cross-frame change 0.306336, uninterrupted maximum 21.554523 P/s; arrival 0.720 s; PASS
D5 pace 390 joined leave: incoming 121.481481, outgoing 121.481487 P/s; cross-frame change 2.954143, uninterrupted maximum 45.843915 P/s; arrival 0.352 s; PASS
D5 pace 390 joined fall: incoming 46.857143, outgoing 46.857145 P/s; cross-frame change 0.472015, uninterrupted maximum 45.843915 P/s; arrival 0.944 s; PASS
D5 pace 390 X rush: incoming 28.348348, outgoing 28.348350 P/s; cross-frame change 0.306336, uninterrupted maximum 21.554523 P/s; arrival 0.720 s; PASS
ok: joined leave/fall and X rush Back carry exact dP/dt, meet the uninterrupted 16 ms continuity gate, turn within their beat and settle exactly
ok: X frame/phone box clear controls; rush through settle hides stepper and restores main focus
```

## node tools/nova-test.mjs (exit 0)

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is available for live reduced-motion switching
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 standalone: added 144; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 standalone 1.00s: 271.41 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.00s: 802.49 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.50s: 980.73 px/s, 157/168 on way
WHIRL 1440x900 standalone 2.90s: 998.14 px/s, 52/168 on way
WHIRL 1440x900 standalone 2.98s: 1115.28 px/s, 31/168 on way
WHIRL 1440x900 standalone: minimum 271.41 px/s vs 271.41 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 standalone: added 80; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 standalone 1.00s: 127.09 px/s, 96/96 on way
WHIRL 412x730 standalone 2.00s: 336.72 px/s, 96/96 on way
WHIRL 412x730 standalone 2.50s: 400.63 px/s, 90/96 on way
WHIRL 412x730 standalone 2.90s: 403.38 px/s, 30/96 on way
WHIRL 412x730 standalone 2.98s: 404.07 px/s, 18/96 on way
WHIRL 412x730 standalone: minimum 127.09 px/s vs 127.09 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 standalone: added 80; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 map: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 standalone 1.00s: 131.37 px/s, 96/96 on way
WHIRL 390x844 standalone 2.00s: 332.59 px/s, 96/96 on way
WHIRL 390x844 standalone 2.50s: 404.63 px/s, 90/96 on way
WHIRL 390x844 standalone 2.90s: 445.40 px/s, 30/96 on way
WHIRL 390x844 standalone 2.98s: 490.87 px/s, 18/96 on way
WHIRL 390x844 standalone: minimum 131.37 px/s vs 131.37 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 standalone: added 80; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 standalone 1.00s: 110.53 px/s, 96/96 on way
WHIRL 360x640 standalone 2.00s: 297.61 px/s, 96/96 on way
WHIRL 360x640 standalone 2.50s: 357.20 px/s, 90/96 on way
WHIRL 360x640 standalone 2.90s: 400.54 px/s, 30/96 on way
WHIRL 360x640 standalone 2.98s: 445.19 px/s, 18/96 on way
WHIRL 360x640 standalone: minimum 110.53 px/s vs 110.53 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 joined 1200: added 2; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 joined 1.00s: 305.59 px/s, 168/168 on way
WHIRL 1440x900 joined 2.00s: 868.53 px/s, 168/168 on way
WHIRL 1440x900 joined 2.50s: 1044.04 px/s, 157/168 on way
WHIRL 1440x900 joined 2.90s: 1093.23 px/s, 52/168 on way
WHIRL 1440x900 joined 2.98s: 1221.24 px/s, 31/168 on way
WHIRL 1440x900 joined: minimum 305.59 px/s vs 305.59 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 joined 278: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 joined 278: added 79; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 joined 1.00s: 109.12 px/s, 96/96 on way
WHIRL 412x730 joined 2.00s: 309.01 px/s, 96/96 on way
WHIRL 412x730 joined 2.50s: 377.79 px/s, 90/96 on way
WHIRL 412x730 joined 2.90s: 415.79 px/s, 30/96 on way
WHIRL 412x730 joined 2.98s: 532.71 px/s, 18/96 on way
WHIRL 412x730 joined: minimum 109.12 px/s vs 109.12 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 305: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 305: added 78; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 305: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 joined 1.00s: 110.39 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 299.25 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 363.45 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 413.50 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 521.90 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 110.39 px/s vs 110.39 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 joined 213: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 joined 213: added 81; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 joined 1.00s: 95.37 px/s, 96/96 on way
WHIRL 360x640 joined 2.00s: 274.00 px/s, 96/96 on way
WHIRL 360x640 joined 2.50s: 331.58 px/s, 90/96 on way
WHIRL 360x640 joined 2.90s: 371.06 px/s, 30/96 on way
WHIRL 360x640 joined 2.98s: 470.46 px/s, 18/96 on way
WHIRL 360x640 joined: minimum 95.37 px/s vs 95.37 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 240: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 240: added 77; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 240: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 joined 1.00s: 117.65 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 306.06 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 372.39 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 461.79 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 586.97 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 117.65 px/s vs 117.65 at 1s; minimum on way 17.71%; last 3.000000s
ok: WHIRL balanced visible sectors, own-side ring approach, continuous drain through last frame, speed/5%/last-arrival gates and rising late heat/core/glow alpha
ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged
```

## node tools/depth-test.mjs (exit 0)

```text
ok 1440x900: whole-map clouds intact/deck hidden; all high cloud/deck heights passed at dive end and every whole hold/leg/legX P; 10 low clouds stay, outside the frame
ok 1440x900: all 6 leg midpoints have mist visibility >0.5; camera boundaries agree within 1e-6; longest leg rises; pointer leaves ground fixed
ok 1440x900: D4 depth off keeps held scale continuously on ordinary glides; C1 X fit has its own camera
ok 1440x900: every find/phone/chest/wide view and explore zoom, k in .05 steps, deck follows tripS
ok 390x844: whole-map clouds intact/deck hidden; all high cloud/deck heights passed at dive end and every whole hold/leg/legX P; 10 low clouds stay, outside the frame
ok 390x844: all 6 leg midpoints have mist visibility >0.5; camera boundaries agree within 1e-6; longest leg rises; pointer leaves ground fixed
ok 390x844: D4 depth off keeps held scale continuously on ordinary glides; C1 X fit has its own camera
ok 390x844: every find/phone/chest/wide view and explore zoom, k in .05 steps, deck follows tripS
ok 1440x900: recording canvas preserves all 1200 hero positions at switch; sky freezes; nova continues; still drawing ignores motion clocks
ok 390x844: recording canvas preserves all 240 hero positions at switch; sky freezes; nova continues; still drawing ignores motion clocks
ok: presses stack independently; first expires on time; cap rejects without mutation; additive shares clamp; expired flares leave the list
ok: gather endpoints and continuous ring tangent for 32 arrival angles; explore restores depth fade
```

## node tools/layout-test.mjs (exit 0)

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

## node tools/explore-test.mjs (exit 0)

```text
ok: desktop/phone zoom limits, bounded/centred cameras, fixed zoom anchor, damped glides with no overshoot, layer/inverse round trips
ok: end-only CTA entry, input takeover, pan/release, resize, exit and immediate departure reset; P and traveller unchanged
ok: copied name curves monotone, lens/rest geometry and knock spring settling
ok: arrows pan during explore without changing P; Escape ends explore
ok: actual footer fades in linear time, is gone by 600 ms, returns over last 500 ms of exit, and stays inert while exploring
ok: FRAMES stationary pointer cancellation wakes one raster commit, then returns to idle
ok: capture-phase pinch on nova/stop/horn; nova taps; owned single drags; drag-only pointer clicks; key/end/depart/reset/down/500 ms suppression clearing; temporary world promotion
ok: D3 real findsBuild horn/chest/beacon pinches at 0/30/100 ms preserve found/stage and zoom >=20%; taps act once, chest hold repeats, owned drags aim/wipe/turn and press drags pan
```

## node tools/finds-test.mjs (exit 0)

```text
ok: B3 surfaced-hump sea digest recorded; coast and fill unchanged
ok: DEPTH/NOVA preserved; STARS.supply data digest recorded
ok: C1 camera/labels/tripS and deck source digests recorded
ok 1440x900: 36 views/cameras, k=0 deep-equal, k=1 centred/clamped/cards folded, monotone scale, P/traveller unchanged
ok 390x664: 36 views/cameras, k=0 deep-equal, k=1 centred/clamped/cards folded, monotone scale, P/traveller unchanged
ok: eleven accessible find groups, six marker ids and unnumbered legend id
ok: all-four mask derived from STOPS is Lennard alone; nineteen rune middles/letters; all piece icons available
ok: D2 tier-1 and sub-line groups fade to exact zero at find focus and return to one
ok: Jormungandr three leaves, five rapid pokes queue once, held leaf follows head, swells/closing/sleep/wake, one found count; eagle circle returns to perch
ok: recording DOM runs six Part A plays, kept state, all-four unlock, reel, chase, four notes, rubbing, copied review state and Back focus rules; no NaN attributes or frame layout reads
ok: hammer press/found/sheet; start/end fact; real button/rune focus; every game/explore key isolated, P unchanged; auto throwing; pointer speed; close/blur/hidden/focusout pause; resume/new seed; cached sprites; throwing storage reads/writes survive
ok: traveller wipes without finding; three mist thirds; all eleven hear timed horn; hold sounds, wide view and release; three Norns/stars/below tail; ship pennant/lamp; all-eleven landing/count/frame; overlays do not take pointers
ok: C2 ravens (tree drawn first, opaque birds, one drawing each, flights out of frame and back, facing, landing, reel and its kept items, epoch, shy hop, hear loop; outlines at least 1.20 units apart, largest pose step 7.78) and chests (staged dig, rattle, back lid, craft light, hints, kept popup): 1440x900: 1266 raven ticks; 390x844: 1266 raven ticks
ok: D2 falling quills fit one third of an open wing, stay behind takeoff/clear the other bird and expire by .8 s; 16 ms lid steps <=25 degrees, gentle start, .5 s peak, <=8 degree overshoot
ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast (8790 writes)
ok: reduced-motion serpent consumes leaves immediately with no swell; no shy hop; all tree actors stay still on hear
ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
ok: footer name layout reads 85 total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: {"resize":17,"fonts":17,"settle-end":17,"explore":34}
ok: actual timeline Home and End handlers select first and last stops
```

## node tools/motion-test.mjs (exit 0)

```text
view | move | measured seconds | centre peak px/s | five-point peak px/s | centre acceleration px/s^2
1440x900 | map->laurier | 3.824 | 226.46 | 383.45 | 528.63 @ 3488
1440x900 | laurier->map | 3.824 | 225.23 | 380.47 | 526.12 @ 352
1440x900 | laurier->hmc1 | 3.856 | 374.73 | 382.21 | 550.59 @ 368
1440x900 | hmc1->laurier | 3.856 | 374.07 | 383.61 | 558.24 @ 1504
1440x900 | hmc1->mohawk | 4.064 | 378.18 | 388.46 | 721.75 @ 1600
1440x900 | mohawk->hmc1 | 4.064 | 379.77 | 386.83 | 694.95 @ 2496
1440x900 | mohawk->hmc2 | 4.208 | 419.76 | 424.12 | 736.72 @ 2464
1440x900 | hmc2->mohawk | 4.208 | 420.32 | 425.49 | 741.84 @ 1776
1440x900 | hmc2->interkom | 3.360 | 290.50 | 291.60 | 494.00 @ 1696
1440x900 | interkom->hmc2 | 3.360 | 290.52 | 291.71 | 492.37 @ 1680
1440x900 | interkom->lennard | 3.840 | 414.00 | 422.55 | 1021.32 @ 1680
1440x900 | lennard->interkom | 3.840 | 416.58 | 421.07 | 1003.31 @ 2192
1440x900 | lennard->x | 2.608 | 170.15 | 179.17 | 416.84 @ 2320
1440x900 | x->lennard | 2.608 | 170.66 | 179.75 | 415.87 @ 304
390x844 | map->laurier | 3.968 | 139.30 | 221.15 | 311.15 @ 3632
390x844 | laurier->map | 3.968 | 138.60 | 219.75 | 309.67 @ 368
390x844 | laurier->hmc1 | 4.000 | 194.52 | 194.94 | 291.22 @ 384
390x844 | hmc1->laurier | 4.000 | 194.52 | 194.94 | 292.70 @ 3648
390x844 | hmc1->mohawk | 4.240 | 193.90 | 194.27 | 267.13 @ 432
390x844 | mohawk->hmc1 | 4.240 | 193.69 | 194.40 | 268.55 @ 3840
390x844 | mohawk->hmc2 | 4.400 | 233.59 | 234.12 | 311.29 @ 4016
390x844 | hmc2->mohawk | 4.400 | 233.61 | 234.01 | 309.81 @ 416
390x844 | hmc2->interkom | 3.440 | 136.66 | 136.99 | 223.74 @ 3136
390x844 | interkom->hmc2 | 3.440 | 136.65 | 136.98 | 222.92 @ 336
390x844 | interkom->lennard | 4.000 | 223.60 | 224.24 | 333.67 @ 368
390x844 | lennard->interkom | 4.000 | 223.57 | 224.43 | 335.29 @ 3648
390x844 | lennard->x | 2.608 | 81.17 | 103.46 | 290.08 @ 2400
390x844 | x->lennard | 2.608 | 81.26 | 103.83 | 290.01 @ 240
D5 view | press | runs | worst centre acceleration | five-point peak | arrival range s | total range s
1440x900 | Back | 42 | 1703.88 | 838.77 | 0.656-4.176 | 0.656-4.176
1440x900 | hurry | 49 | 4319.97 | 1755.52 | 0.464-4.768 | 0.464-5.056
1440x900 | Next-reverse | 42 | 1727.01 | 815.11 | 0.720-4.176 | 0.720-4.176
1440x900 | Back-Next | 7 | 1119.42 | 524.20 | 1.152-1.872 | 1.456-2.176
1440x900 | go-back | 14 | 1687.93 | 838.77 | 1.312-2.928 | 1.312-2.928
1440x900 | go-next | 14 | 1725.25 | 815.11 | 1.312-2.656 | 1.312-2.656
390x844 | Back | 42 | 1006.19 | 461.68 | 0.656-4.368 | 0.656-4.368
390x844 | hurry | 49 | 2530.15 | 950.09 | 0.464-6.720 | 0.464-7.024
390x844 | Next-reverse | 42 | 1011.15 | 461.68 | 0.768-4.368 | 0.768-4.368
390x844 | Back-Next | 7 | 714.22 | 282.55 | 1.152-1.952 | 1.456-2.256
390x844 | go-back | 14 | 925.68 | 461.68 | 1.312-2.224 | 1.312-2.224
390x844 | go-next | 14 | 890.26 | 461.68 | 1.312-2.224 | 1.312-2.224
ok: 28 rest glides, 336 carry runs and 14 late-hurry guards; 16 ms acceleration/five probes, analytic continuity, bounded reversals through 99 percent, exact settled arrivals, faster feasible hurry and fresh set(P) equality
```

## node tools/hammer-test.mjs (exit 0)

```text
ok: D3 foe heights incl stroke: giants/chief 16, hunched draugr 11, low full-width wolf 8; wave 1 varies; five overlapping shields span each unchanged segment
ok: original Norse foe silhouettes and their strokes fit unchanged hit boxes
ok: identical seeds and inputs match step for step
ok: 350 seeded formations/bosses fit their wave rows; unique fates; clay at 60%, heart at 30%
ok: 34 per-level rune effect checks; excluded runes absent
ok: cold includes both flights and glove; heat splits twice; draugr rises once; need multiplies the return upgrade; exposed stone heart doubles a hit
ok: return/catch, first-hit memory, shields, bridge loss; pool sizes and identities unchanged after 10,000 steps
steady: 200 seeds; wave 4 74.0%; wins 17.5%; ended by wave 3 26.0%; longest 223.6s; 0.00080 ms/step; 1.8s wall
ends {"6:bridge":6,"7:won":35,"5:bridge":10,"3:hearts":35,"5:hearts":42,"6:hearts":14,"4:hearts":28,"4:bridge":8,"2:hearts":12,"3:bridge":3,"7:hearts":5,"2:bridge":1,"1:hearts":1}
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00082 ms/step; 2.5s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

## node tools/frame-cost-test.mjs (exit 0)

```text
ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature
ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work
```

## node tools/frame-performance-test.mjs (exit 0)

```text
AFTER 412x730 / 72 moving frames: #cam writes 7; label writes 297; recovery 16 frames / 266.7 ms
ok: bounded pinch rasters agree with virtual camera; <=10% label settle steps; 250 ms recovery; translation-only raster; 50 real opening camera writes; interrupted zoom, resize/exit cleanup and zero idle writes
```

## node tools/frame-render-test.mjs (exit 0)

```text
phone explore zoom 1: scratch pixels cleared 3609120 -> 871895 (75.8% less); same drawing commands
phone explore zoom 2: scratch pixels cleared 3609120 -> 1037640 (71.2% less); same drawing commands
phone explore zoom 3: scratch pixels cleared 3609120 -> 760250 (78.9% less); same drawing commands
ok: 21 desktop/phone/1200-star WHIRL2 drawing-command snapshots; original blast primitives pinned by whirl2-test; not a pixel comparison
```

## node tools/whirl2-test.mjs (exit 0)

```text
ok: 1440x900/map 29 trip/find stills; added 144; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 412x730/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 360x640/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 1440x900/1200 29 trip/find stills; added 2; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 412x730/278 29 trip/find stills; added 79; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/305 29 trip/find stills; added 78; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 360x640/213 29 trip/find stills; added 81; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/240 29 trip/find stills; added 77; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: all sector targets survive full pointer look and 16 hero-dwell cases (1/5/30/120 s); no late creation or replacement
ok: WHIRL2 261 trail/sea still comparisons; 45 unchanged blast/remnant primitive comparisons (not pixels); source 0ea9f4bac16d6872c9f3798e45a58d9cbd5e461bdaab825cd3f70e1b2e17c246
```

## node tools/comb-c-tail-test.mjs (exit 0)

```text
1440x900: bounded tail max 38.000 px, proportional base, closed tail hidden
1024x600: bounded tail max 29.808 px, proportional base, closed tail hidden
412x730: bounded tail max 14.000 px, proportional base, closed tail hidden
390x844: bounded tail max 14.000 px, proportional base, closed tail hidden
360x640: bounded tail max 14.000 px, proportional base, closed tail hidden
844x390: bounded tail max 21.000 px, proportional base, closed tail hidden
ok: 1092 projected card samples; 360 ember/coast rays
```

## node tools/comb-b-art-test.mjs (exit 0)

```text
T6/T20: 5.90 map units between crowns; 2.30 CSS px between ink at 360 fit
T41/T42: 5.61 map units between crowns; 2.13 CSS px between ink at 360 fit
T57/T60: 6.27 map units between crowns; 2.51 CSS px between ink at 360 fit
T6: all-neighbour ink gap >= 2.48 CSS px at 360 fit
T42: all-neighbour ink gap >= 1.05 CSS px at 360 fit
T60: all-neighbour ink gap >= 1.59 CSS px at 360 fit
ok: unchanged hammer/horn/mist/serpent hits; ink-only masked mist; omitted tiny actors; full cell rims and persistent sign hooks
```

## node tools/frame-cost.mjs --cdp LOCAL --passes timing --scenarios 6,7,8,9 (exit 0)

```text
browser: Edg/158.0.4370.33; 412x730; DPR 2.625; touch true; CPU x4
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| map -> Laurier timing | 114 | 33.40 | 79.20 | 137.50 | 69 | 2 | 8.64 | 9.65 | 8.22 | 1.42 | 5.43 | 2.61 | 5.36 | 0.75 | 8.65 | 1 / 50.00 | N/A |
| Laurier -> HMC timing | 113 | 33.40 | 45.80 | 50.10 | 85 | 0 | 8.50 | 9.82 | 8.22 | 1.60 | 5.81 | 2.86 | 5.30 | 0.74 | 9.82 | 1 / 52.00 | N/A |
| HMC again -> Interkom timing | 110 | 29.20 | 41.70 | 50.00 | 40 | 0 | 7.07 | 8.68 | 7.29 | 1.39 | 4.75 | 2.65 | 5.26 | 0.63 | 8.51 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 118 | 29.20 | 37.50 | 41.70 | 31 | 0 | 6.61 | 7.83 | 6.47 | 1.35 | 4.50 | 2.50 | 5.21 | 0.63 | 7.69 | 0 / 0.00 | N/A |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| map -> Laurier timing | 116 | 33.40 | 45.90 | 50.10 | 74 | 0 | 7.81 | 10.12 | 8.59 | 1.53 | 5.41 | 2.65 | 5.42 | 0.74 | 8.92 | 1 / 52.00 | N/A |
| Laurier -> HMC timing | 116 | 33.40 | 45.90 | 58.30 | 73 | 0 | 7.48 | 9.65 | 8.03 | 1.62 | 5.72 | 2.80 | 5.38 | 0.80 | 9.72 | 1 / 50.00 | N/A |
| HMC again -> Interkom timing | 115 | 29.20 | 41.70 | 45.90 | 35 | 0 | 6.08 | 8.47 | 7.02 | 1.45 | 4.65 | 2.61 | 5.18 | 0.62 | 8.09 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 114 | 29.20 | 41.70 | 50.10 | 43 | 0 | 6.18 | 8.46 | 6.91 | 1.55 | 4.95 | 2.66 | 5.21 | 0.64 | 7.82 | 0 / 0.00 | N/A |
```

```text
COMB-C last-table p95 comparison: [{"key":"/journey-map.html/map -> Laurier timing","before":50.1,"after":79.2,"pass":false},{"key":"/journey-map.html/Laurier -> HMC timing","before":45.9,"after":45.8,"pass":true},{"key":"/journey-map.html/HMC again -> Interkom timing","before":41.8,"after":41.7,"pass":true},{"key":"/journey-map.html/Interkom -> HMC again / Back timing","before":45.9,"after":37.5,"pass":true},{"key":"/journey-joined.html/map -> Laurier timing","before":45.9,"after":45.9,"pass":true},{"key":"/journey-joined.html/Laurier -> HMC timing","before":41.7,"after":45.9,"pass":false},{"key":"/journey-joined.html/HMC again -> Interkom timing","before":45.8,"after":41.7,"pass":true},{"key":"/journey-joined.html/Interkom -> HMC again / Back timing","before":45.8,"after":41.7,"pass":true}]
```

## node --check art.mjs (exit 0)

```text
(no output)
```

## node --check cards.mjs (exit 0)

```text
(no output)
```

## node --check data.mjs (exit 0)

```text
(no output)
```

## node --check depth.mjs (exit 0)

```text
(no output)
```

## node --check explore.mjs (exit 0)

```text
(no output)
```

## node --check findall.mjs (exit 0)

```text
(no output)
```

## node --check findcreatures.mjs (exit 0)

```text
(no output)
```

## node --check findhammer.mjs (exit 0)

```text
(no output)
```

## node --check findhoards.mjs (exit 0)

```text
(no output)
```

## node --check findhorn.mjs (exit 0)

```text
(no output)
```

## node --check findkit.mjs (exit 0)

```text
(no output)
```

## node --check finds.mjs (exit 0)

```text
(no output)
```

## node --check findsheets.mjs (exit 0)

```text
(no output)
```

## node --check findwater.mjs (exit 0)

```text
(no output)
```

## node --check footer.mjs (exit 0)

```text
(no output)
```

## node --check footname.mjs (exit 0)

```text
(no output)
```

## node --check hammer.mjs (exit 0)

```text
(no output)
```

## node --check join.mjs (exit 0)

```text
(no output)
```

## node --check main.mjs (exit 0)

```text
(no output)
```

## node --check pace.mjs (exit 0)

```text
(no output)
```

## node --check stars.mjs (exit 0)

```text
(no output)
```

## node --check steps.mjs (exit 0)

```text
(no output)
```

## node --check timeline.mjs (exit 0)

```text
(no output)
```

## node --check trip.mjs (exit 0)

```text
(no output)
```

## node --check tools/audit-capture.mjs (exit 0)

```text
(no output)
```

## node --check tools/check.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-a-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-art-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-detail-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-layout-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-b-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-behaviour-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-browser.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-browser-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-legend-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-record-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-c-tail-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-close-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-extra-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-joined-reduced-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-reduced-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-reopen-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/comb-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/depth-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/explore-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/finds-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-cost-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-cost.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-performance-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/frame-render-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-report-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-suite-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/glide-visual-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/hammer-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/layout-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/motion-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/nova-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/origin-check.mjs (exit 0)

```text
(no output)
```

## node --check tools/pack-joined.mjs (exit 0)

```text
(no output)
```

## node --check tools/pack.mjs (exit 0)

```text
(no output)
```

## node --check tools/steps-test.mjs (exit 0)

```text
(no output)
```

## node --check tools/whirl2-test.mjs (exit 0)

```text
(no output)
```

## node tools/check.mjs (exit 0)

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 16.14 KB / 30; all map modules + CSS 175.33 KB / 185
gzip: dist/journey-map.html 291.63 KB / 320
gzip: dist/journey-joined.html 512.10 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

## node tools/steps-test.mjs (exit 0)

```text
ok: paceT strictly rises; paceP round trips every whole P and the rest boundary within 1e-6
move | forward seconds | back seconds
top -> map | 4.100 | 2.460
map -> laurier | 3.813 | 3.813
laurier -> hmc1 | 3.841 | 3.841
hmc1 -> mohawk | 4.053 | 4.053
mohawk -> hmc2 | 4.200 | 4.200
hmc2 -> interkom | 3.345 | 3.345
interkom -> lennard | 3.834 | 3.834
lennard -> x | 2.600 | 2.600
x -> end | 5.900 | 3.540
ok: all 18 moves start/end correctly and never turn back; D4 glides use equal 2.6-4.4 s durations both ways; X-to-end keeps the 3 s rush plus blast/settle
ok: D4 map title top/map wheel and touch, 120 ms easing, 10/30 percent settle, clamps, Start/Set out lock, Back reset, flicks, owned drags and taps
ok: D4 joined hero top/map wheel and touch, 120 ms easing, 10/30 percent settle, clamps, Start/Set out lock, Back reset, flicks, owned drags and taps
ok: address cannot select Scroll; review only Depth; locked wheel never steps; only end CTA explores; two Back presses return then step; keyboard still advances
ok: C1 1440x900 20 repeated Next keys preserve 5904 ms arrival; repeated Back returns only to X
ok: C1 412x730 20 repeated Next keys preserve 5904 ms arrival; repeated Back returns only to X
ok: ORIGIN 50 ms desktop/phone open and reverse-close recording: tail stays on rim through tilt; shield never scales with the face or fades; X is inside the header
ok: six card X controls; local reopen focuses X without scrolling; mid-move X cannot focus departed mark; departure forgets override; reduced-motion list has no X
D5 pace 1440 joined leave: incoming 121.481481, outgoing 121.481487 P/s; cross-frame change 2.954143, uninterrupted maximum 45.843915 P/s; arrival 0.352 s; PASS
D5 pace 1440 joined fall: incoming 46.857143, outgoing 46.857145 P/s; cross-frame change 0.472015, uninterrupted maximum 45.843915 P/s; arrival 0.944 s; PASS
D5 pace 1440 X rush: incoming 28.348348, outgoing 28.348350 P/s; cross-frame change 0.306336, uninterrupted maximum 21.554523 P/s; arrival 0.720 s; PASS
D5 pace 390 joined leave: incoming 121.481481, outgoing 121.481487 P/s; cross-frame change 2.954143, uninterrupted maximum 45.843915 P/s; arrival 0.352 s; PASS
D5 pace 390 joined fall: incoming 46.857143, outgoing 46.857145 P/s; cross-frame change 0.472015, uninterrupted maximum 45.843915 P/s; arrival 0.944 s; PASS
D5 pace 390 X rush: incoming 28.348348, outgoing 28.348350 P/s; cross-frame change 0.306336, uninterrupted maximum 21.554523 P/s; arrival 0.720 s; PASS
ok: joined leave/fall and X rush Back carry exact dP/dt, meet the uninterrupted 16 ms continuity gate, turn within their beat and settle exactly
ok: X frame/phone box clear controls; rush through settle hides stepper and restores main focus
```

## node tools/nova-test.mjs (exit 0)

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is available for live reduced-motion switching
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 standalone: added 144; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 standalone 1.00s: 271.41 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.00s: 802.49 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.50s: 980.73 px/s, 157/168 on way
WHIRL 1440x900 standalone 2.90s: 998.14 px/s, 52/168 on way
WHIRL 1440x900 standalone 2.98s: 1115.28 px/s, 31/168 on way
WHIRL 1440x900 standalone: minimum 271.41 px/s vs 271.41 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 standalone: added 80; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 standalone 1.00s: 127.09 px/s, 96/96 on way
WHIRL 412x730 standalone 2.00s: 336.72 px/s, 96/96 on way
WHIRL 412x730 standalone 2.50s: 400.63 px/s, 90/96 on way
WHIRL 412x730 standalone 2.90s: 403.38 px/s, 30/96 on way
WHIRL 412x730 standalone 2.98s: 404.07 px/s, 18/96 on way
WHIRL 412x730 standalone: minimum 127.09 px/s vs 127.09 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 standalone: added 80; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 map: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 standalone 1.00s: 131.37 px/s, 96/96 on way
WHIRL 390x844 standalone 2.00s: 332.59 px/s, 96/96 on way
WHIRL 390x844 standalone 2.50s: 404.63 px/s, 90/96 on way
WHIRL 390x844 standalone 2.90s: 445.40 px/s, 30/96 on way
WHIRL 390x844 standalone 2.98s: 490.87 px/s, 18/96 on way
WHIRL 390x844 standalone: minimum 131.37 px/s vs 131.37 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 standalone: added 80; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 standalone 1.00s: 110.53 px/s, 96/96 on way
WHIRL 360x640 standalone 2.00s: 297.61 px/s, 96/96 on way
WHIRL 360x640 standalone 2.50s: 357.20 px/s, 90/96 on way
WHIRL 360x640 standalone 2.90s: 400.54 px/s, 30/96 on way
WHIRL 360x640 standalone 2.98s: 445.19 px/s, 18/96 on way
WHIRL 360x640 standalone: minimum 110.53 px/s vs 110.53 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 joined 1200: added 2; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 joined 1.00s: 305.59 px/s, 168/168 on way
WHIRL 1440x900 joined 2.00s: 868.53 px/s, 168/168 on way
WHIRL 1440x900 joined 2.50s: 1044.04 px/s, 157/168 on way
WHIRL 1440x900 joined 2.90s: 1093.23 px/s, 52/168 on way
WHIRL 1440x900 joined 2.98s: 1221.24 px/s, 31/168 on way
WHIRL 1440x900 joined: minimum 305.59 px/s vs 305.59 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 joined 278: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 joined 278: added 79; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 joined 1.00s: 109.12 px/s, 96/96 on way
WHIRL 412x730 joined 2.00s: 309.01 px/s, 96/96 on way
WHIRL 412x730 joined 2.50s: 377.79 px/s, 90/96 on way
WHIRL 412x730 joined 2.90s: 415.79 px/s, 30/96 on way
WHIRL 412x730 joined 2.98s: 532.71 px/s, 18/96 on way
WHIRL 412x730 joined: minimum 109.12 px/s vs 109.12 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 305: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 305: added 78; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 305: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 joined 1.00s: 110.39 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 299.25 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 363.45 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 413.50 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 521.90 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 110.39 px/s vs 110.39 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 joined 213: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 joined 213: added 81; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 joined 1.00s: 95.37 px/s, 96/96 on way
WHIRL 360x640 joined 2.00s: 274.00 px/s, 96/96 on way
WHIRL 360x640 joined 2.50s: 331.58 px/s, 90/96 on way
WHIRL 360x640 joined 2.90s: 371.06 px/s, 30/96 on way
WHIRL 360x640 joined 2.98s: 470.46 px/s, 18/96 on way
WHIRL 360x640 joined: minimum 95.37 px/s vs 95.37 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 240: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 240: added 77; trail 308/308; sea 112; coast-only reservation
TRAIL 390x844 240: 42 draws of an earlier leg at the top edge leave with the camera before t .9
WHIRL 390x844 joined 1.00s: 117.65 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 306.06 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 372.39 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 461.79 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 586.97 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 117.65 px/s vs 117.65 at 1s; minimum on way 17.71%; last 3.000000s
ok: WHIRL balanced visible sectors, own-side ring approach, continuous drain through last frame, speed/5%/last-arrival gates and rising late heat/core/glow alpha
ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged
```

## node tools/depth-test.mjs (exit 0)

```text
ok 1440x900: whole-map clouds intact/deck hidden; all high cloud/deck heights passed at dive end and every whole hold/leg/legX P; 10 low clouds stay, outside the frame
ok 1440x900: all 6 leg midpoints have mist visibility >0.5; camera boundaries agree within 1e-6; longest leg rises; pointer leaves ground fixed
ok 1440x900: D4 depth off keeps held scale continuously on ordinary glides; C1 X fit has its own camera
ok 1440x900: every find/phone/chest/wide view and explore zoom, k in .05 steps, deck follows tripS
ok 390x844: whole-map clouds intact/deck hidden; all high cloud/deck heights passed at dive end and every whole hold/leg/legX P; 10 low clouds stay, outside the frame
ok 390x844: all 6 leg midpoints have mist visibility >0.5; camera boundaries agree within 1e-6; longest leg rises; pointer leaves ground fixed
ok 390x844: D4 depth off keeps held scale continuously on ordinary glides; C1 X fit has its own camera
ok 390x844: every find/phone/chest/wide view and explore zoom, k in .05 steps, deck follows tripS
ok 1440x900: recording canvas preserves all 1200 hero positions at switch; sky freezes; nova continues; still drawing ignores motion clocks
ok 390x844: recording canvas preserves all 240 hero positions at switch; sky freezes; nova continues; still drawing ignores motion clocks
ok: presses stack independently; first expires on time; cap rejects without mutation; additive shares clamp; expired flares leave the list
ok: gather endpoints and continuous ring tangent for 32 arrival angles; explore restores depth fade
```

## node tools/layout-test.mjs (exit 0)

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

## node tools/explore-test.mjs (exit 0)

```text
ok: desktop/phone zoom limits, bounded/centred cameras, fixed zoom anchor, damped glides with no overshoot, layer/inverse round trips
ok: end-only CTA entry, input takeover, pan/release, resize, exit and immediate departure reset; P and traveller unchanged
ok: copied name curves monotone, lens/rest geometry and knock spring settling
ok: arrows pan during explore without changing P; Escape ends explore
ok: actual footer fades in linear time, is gone by 600 ms, returns over last 500 ms of exit, and stays inert while exploring
ok: FRAMES stationary pointer cancellation wakes one raster commit, then returns to idle
ok: capture-phase pinch on nova/stop/horn; nova taps; owned single drags; drag-only pointer clicks; key/end/depart/reset/down/500 ms suppression clearing; temporary world promotion
ok: D3 real findsBuild horn/chest/beacon pinches at 0/30/100 ms preserve found/stage and zoom >=20%; taps act once, chest hold repeats, owned drags aim/wipe/turn and press drags pan
```

## node tools/finds-test.mjs (exit 0)

```text
ok: B3 surfaced-hump sea digest recorded; coast and fill unchanged
ok: DEPTH/NOVA preserved; STARS.supply data digest recorded
ok: C1 camera/labels/tripS and deck source digests recorded
ok 1440x900: 36 views/cameras, k=0 deep-equal, k=1 centred/clamped/cards folded, monotone scale, P/traveller unchanged
ok 390x664: 36 views/cameras, k=0 deep-equal, k=1 centred/clamped/cards folded, monotone scale, P/traveller unchanged
ok: eleven accessible find groups, six marker ids and unnumbered legend id
ok: all-four mask derived from STOPS is Lennard alone; nineteen rune middles/letters; all piece icons available
ok: D2 tier-1 and sub-line groups fade to exact zero at find focus and return to one
ok: Jormungandr three leaves, five rapid pokes queue once, held leaf follows head, swells/closing/sleep/wake, one found count; eagle circle returns to perch
ok: recording DOM runs six Part A plays, kept state, all-four unlock, reel, chase, four notes, rubbing, copied review state and Back focus rules; no NaN attributes or frame layout reads
ok: hammer press/found/sheet; start/end fact; real button/rune focus; every game/explore key isolated, P unchanged; auto throwing; pointer speed; close/blur/hidden/focusout pause; resume/new seed; cached sprites; throwing storage reads/writes survive
ok: traveller wipes without finding; three mist thirds; all eleven hear timed horn; hold sounds, wide view and release; three Norns/stars/below tail; ship pennant/lamp; all-eleven landing/count/frame; overlays do not take pointers
ok: C2 ravens (tree drawn first, opaque birds, one drawing each, flights out of frame and back, facing, landing, reel and its kept items, epoch, shy hop, hear loop; outlines at least 1.20 units apart, largest pose step 7.78) and chests (staged dig, rattle, back lid, craft light, hints, kept popup): 1440x900: 1266 raven ticks; 390x844: 1266 raven ticks
ok: D2 falling quills fit one third of an open wing, stay behind takeoff/clear the other bird and expire by .8 s; 16 ms lid steps <=25 degrees, gentle start, .5 s peak, <=8 degree overshoot
ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast (8790 writes)
ok: reduced-motion serpent consumes leaves immediately with no swell; no shy hop; all tree actors stay still on hear
ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
ok: footer name layout reads 85 total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: {"resize":17,"fonts":17,"settle-end":17,"explore":34}
ok: actual timeline Home and End handlers select first and last stops
```

## node tools/motion-test.mjs (exit 0)

```text
view | move | measured seconds | centre peak px/s | five-point peak px/s | centre acceleration px/s^2
1440x900 | map->laurier | 3.824 | 226.46 | 383.45 | 528.63 @ 3488
1440x900 | laurier->map | 3.824 | 225.23 | 380.47 | 526.12 @ 352
1440x900 | laurier->hmc1 | 3.856 | 374.73 | 382.21 | 550.59 @ 368
1440x900 | hmc1->laurier | 3.856 | 374.07 | 383.61 | 558.24 @ 1504
1440x900 | hmc1->mohawk | 4.064 | 378.18 | 388.46 | 721.75 @ 1600
1440x900 | mohawk->hmc1 | 4.064 | 379.77 | 386.83 | 694.95 @ 2496
1440x900 | mohawk->hmc2 | 4.208 | 419.76 | 424.12 | 736.72 @ 2464
1440x900 | hmc2->mohawk | 4.208 | 420.32 | 425.49 | 741.84 @ 1776
1440x900 | hmc2->interkom | 3.360 | 290.50 | 291.60 | 494.00 @ 1696
1440x900 | interkom->hmc2 | 3.360 | 290.52 | 291.71 | 492.37 @ 1680
1440x900 | interkom->lennard | 3.840 | 414.00 | 422.55 | 1021.32 @ 1680
1440x900 | lennard->interkom | 3.840 | 416.58 | 421.07 | 1003.31 @ 2192
1440x900 | lennard->x | 2.608 | 170.15 | 179.17 | 416.84 @ 2320
1440x900 | x->lennard | 2.608 | 170.66 | 179.75 | 415.87 @ 304
390x844 | map->laurier | 3.968 | 139.30 | 221.15 | 311.15 @ 3632
390x844 | laurier->map | 3.968 | 138.60 | 219.75 | 309.67 @ 368
390x844 | laurier->hmc1 | 4.000 | 194.52 | 194.94 | 291.22 @ 384
390x844 | hmc1->laurier | 4.000 | 194.52 | 194.94 | 292.70 @ 3648
390x844 | hmc1->mohawk | 4.240 | 193.90 | 194.27 | 267.13 @ 432
390x844 | mohawk->hmc1 | 4.240 | 193.69 | 194.40 | 268.55 @ 3840
390x844 | mohawk->hmc2 | 4.400 | 233.59 | 234.12 | 311.29 @ 4016
390x844 | hmc2->mohawk | 4.400 | 233.61 | 234.01 | 309.81 @ 416
390x844 | hmc2->interkom | 3.440 | 136.66 | 136.99 | 223.74 @ 3136
390x844 | interkom->hmc2 | 3.440 | 136.65 | 136.98 | 222.92 @ 336
390x844 | interkom->lennard | 4.000 | 223.60 | 224.24 | 333.67 @ 368
390x844 | lennard->interkom | 4.000 | 223.57 | 224.43 | 335.29 @ 3648
390x844 | lennard->x | 2.608 | 81.17 | 103.46 | 290.08 @ 2400
390x844 | x->lennard | 2.608 | 81.26 | 103.83 | 290.01 @ 240
D5 view | press | runs | worst centre acceleration | five-point peak | arrival range s | total range s
1440x900 | Back | 42 | 1703.88 | 838.77 | 0.656-4.176 | 0.656-4.176
1440x900 | hurry | 49 | 4319.97 | 1755.52 | 0.464-4.768 | 0.464-5.056
1440x900 | Next-reverse | 42 | 1727.01 | 815.11 | 0.720-4.176 | 0.720-4.176
1440x900 | Back-Next | 7 | 1119.42 | 524.20 | 1.152-1.872 | 1.456-2.176
1440x900 | go-back | 14 | 1687.93 | 838.77 | 1.312-2.928 | 1.312-2.928
1440x900 | go-next | 14 | 1725.25 | 815.11 | 1.312-2.656 | 1.312-2.656
390x844 | Back | 42 | 1006.19 | 461.68 | 0.656-4.368 | 0.656-4.368
390x844 | hurry | 49 | 2530.15 | 950.09 | 0.464-6.720 | 0.464-7.024
390x844 | Next-reverse | 42 | 1011.15 | 461.68 | 0.768-4.368 | 0.768-4.368
390x844 | Back-Next | 7 | 714.22 | 282.55 | 1.152-1.952 | 1.456-2.256
390x844 | go-back | 14 | 925.68 | 461.68 | 1.312-2.224 | 1.312-2.224
390x844 | go-next | 14 | 890.26 | 461.68 | 1.312-2.224 | 1.312-2.224
ok: 28 rest glides, 336 carry runs and 14 late-hurry guards; 16 ms acceleration/five probes, analytic continuity, bounded reversals through 99 percent, exact settled arrivals, faster feasible hurry and fresh set(P) equality
```

## node tools/hammer-test.mjs (exit 0)

```text
ok: D3 foe heights incl stroke: giants/chief 16, hunched draugr 11, low full-width wolf 8; wave 1 varies; five overlapping shields span each unchanged segment
ok: original Norse foe silhouettes and their strokes fit unchanged hit boxes
ok: identical seeds and inputs match step for step
ok: 350 seeded formations/bosses fit their wave rows; unique fates; clay at 60%, heart at 30%
ok: 34 per-level rune effect checks; excluded runes absent
ok: cold includes both flights and glove; heat splits twice; draugr rises once; need multiplies the return upgrade; exposed stone heart doubles a hit
ok: return/catch, first-hit memory, shields, bridge loss; pool sizes and identities unchanged after 10,000 steps
steady: 200 seeds; wave 4 74.0%; wins 17.5%; ended by wave 3 26.0%; longest 223.6s; 0.00081 ms/step; 1.8s wall
ends {"6:bridge":6,"7:won":35,"5:bridge":10,"3:hearts":35,"5:hearts":42,"6:hearts":14,"4:hearts":28,"4:bridge":8,"2:hearts":12,"3:bridge":3,"7:hearts":5,"2:bridge":1,"1:hearts":1}
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00076 ms/step; 2.3s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

## node tools/frame-cost-test.mjs (exit 0)

```text
ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature
ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work
```

## node tools/frame-performance-test.mjs (exit 0)

```text
AFTER 412x730 / 72 moving frames: #cam writes 7; label writes 297; recovery 16 frames / 266.7 ms
ok: bounded pinch rasters agree with virtual camera; <=10% label settle steps; 250 ms recovery; translation-only raster; 50 real opening camera writes; interrupted zoom, resize/exit cleanup and zero idle writes
```

## node tools/frame-render-test.mjs (exit 0)

```text
phone explore zoom 1: scratch pixels cleared 3609120 -> 871895 (75.8% less); same drawing commands
phone explore zoom 2: scratch pixels cleared 3609120 -> 1037640 (71.2% less); same drawing commands
phone explore zoom 3: scratch pixels cleared 3609120 -> 760250 (78.9% less); same drawing commands
ok: 21 desktop/phone/1200-star WHIRL2 drawing-command snapshots; original blast primitives pinned by whirl2-test; not a pixel comparison
```

## node tools/whirl2-test.mjs (exit 0)

```text
ok: 1440x900/map 29 trip/find stills; added 144; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 412x730/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 360x640/map 29 trip/find stills; added 80; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 1440x900/1200 29 trip/find stills; added 2; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 412x730/278 29 trip/find stills; added 79; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/305 29 trip/find stills; added 78; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 360x640/213 29 trip/find stills; added 81; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/240 29 trip/find stills; added 77; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: all sector targets survive full pointer look and 16 hero-dwell cases (1/5/30/120 s); no late creation or replacement
ok: WHIRL2 261 trail/sea still comparisons; 45 unchanged blast/remnant primitive comparisons (not pixels); source 0ea9f4bac16d6872c9f3798e45a58d9cbd5e461bdaab825cd3f70e1b2e17c246
```

## node tools/comb-c-tail-test.mjs (exit 0)

```text
1440x900: bounded tail max 38.000 px, proportional base, closed tail hidden
1024x600: bounded tail max 29.808 px, proportional base, closed tail hidden
412x730: bounded tail max 14.000 px, proportional base, closed tail hidden
390x844: bounded tail max 14.000 px, proportional base, closed tail hidden
360x640: bounded tail max 14.000 px, proportional base, closed tail hidden
844x390: bounded tail max 21.000 px, proportional base, closed tail hidden
ok: 1092 projected card samples; 360 ember/coast rays
```

## node tools/comb-b-art-test.mjs (exit 0)

```text
T6/T20: 5.90 map units between crowns; 2.30 CSS px between ink at 360 fit
T41/T42: 5.61 map units between crowns; 2.13 CSS px between ink at 360 fit
T57/T60: 6.27 map units between crowns; 2.51 CSS px between ink at 360 fit
T6: all-neighbour ink gap >= 2.48 CSS px at 360 fit
T42: all-neighbour ink gap >= 1.05 CSS px at 360 fit
T60: all-neighbour ink gap >= 1.59 CSS px at 360 fit
ok: unchanged hammer/horn/mist/serpent hits; ink-only masked mist; omitted tiny actors; full cell rims and persistent sign hooks
```

## node tools/comb-b-layout-test.mjs --behaviour (exit 0)

```text
1440x900: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
1280x720: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
1024x600: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
820x1180: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
412x730: hero review overlaps []; 110 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
390x844: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
360x640: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
844x390: hero review overlaps []; 112 rush/end samples, build-up {"focus":"nova-hit","ring":"solid","count":"0"}; explore {"count":"1","overlaps":[]}
412x730 reduced-motion switch at end: {"reduced":true,"opacity":"1","screen":false}
Failures: []
```

## Final file and evidence integrity

Only the permitted source/test/report files and pack-generated outputs were written in the worktree. Browser profiles and captures are in the authorized comb-b run folder. No git command, install, external request or agent/reviewer was used. Every linked PNG exists. Plain ASCII punctuation was verified for this report. Runtime Edge profiles and the local test servers were closed by their fixtures.
