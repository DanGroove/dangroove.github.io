# FRAMES build

Implementation candidate for external browser review. The standalone page is packed.
All available Node regression checks pass. Browser timing, blank-frame and pixel
comparison gates are NOT VERIFIED. The joined packed page was not rebuilt.

## Constraints and evidence

Read BRIEF.md before FRAMES.md, then the audit tool, current camera, explore,
stars, nova, frame loop, find writers and tests. Carried forward ORIGIN-BUILD,
WHIRL-BUILD, MOTION-BUILD and the current layout/review records. Applied the
installed motion-performance and motion-playbook guidance. The UI skill CLI
was omitted because it can require installation/network. No design reviewers
or other agents ran.

Acceptance criteria before implementation: preserve geometry, content, colors,
star identities, animation clocks, journey timing, reduced-motion behavior and
all existing tests; move the existing SVG during explore motion; retain sharp
constant-size labels at rest; avoid frame layout reads and extra animation
loops; keep all gzip budgets. Rendered comparison with approved references,
the previous page, every beat and every find remains pending.

Source inspection confirmed the repeated #cam matrix writes, label-scale writes,
full-screen scratch clears/copies in the nova groups, and discarded star
release calculations at full explore. It did not establish a measured ranking
of browser costs. No FPS improvement or zero-blank-frame result is claimed.

## Changes

- explore.mjs supplies movement/elapsed-frame information to the existing frame
  loop, removes two per-frame camera JSON serializations, and invalidates on
  stationary release/cancel, capture loss and blur. A release with no glide
  still causes the final SVG camera commit.
- trip.mjs changes the camera/label writer only. During explore movement the
  existing SVG receives a CSS matrix relative to its last raster camera. Its
  #cam, label transforms and completed-trail dash stay held. Overflow exposes
  the whole map during pans; the stage still clips the viewport. Promotion is
  retained throughout explore, including rest. On settle the real camera is
  written once and the CSS matrix clears in the same frame. Label transforms
  recover over 120 ms. Their old epsilon decisions continue in memory so the
  final text scale equals the previous writer's at the same camera. Resize and
  exit restore the normal camera path. There is no duplicate SVG or snapshot.
- map.css supplies only the SVG's zero transform origin.
- main.mjs keeps the existing single visibility-paused requestAnimationFrame
  loop alive during the brief label recovery. Unchanged star-canvas opacity
  assignments are skipped. There are no new frame layout reads.
- stars.mjs bypasses release, orbit and tail calculations for map stars that
  have completely returned home at exploreK=1. The same stars, positions,
  radii, opacity bins and colors are drawn. Sky, embers, twinkle, transitions
  and reduced-motion drawing remain on their existing clocks.
- footer.mjs clears and copies integer-device-pixel crops of the existing
  scratch canvas, with conservative ink bounds and a two-CSS-pixel guard.
  The original pixel grid, resolution, sprites, group alpha, draw order,
  shapes and clocks remain. Scratch allocation does not change per frame.
  This does not lower the canvas resolution or remove any effect.
- data.mjs adds only FRAME_PERF: labelSettle=0.12 seconds and rasterPad=2 CSS px.
- tools/frame-cost.mjs attaches to an existing local headless Edge/Chrome CDP
  endpoint. It serves only the requested packed pages on 127.0.0.1, blocks
  outside page requests, emulates 412x730/DPR 2.625/mobile/touch/CPU x4, drives
  all six scenarios, and prints intervals, exclusive main-thread script/
  style+layout/paint time, separate raster work and long tasks. Each scenario
  has a timing pass without screenshots and a separate PNG screencast pass,
  so capture overhead is reported separately. PNGs and traces stay in memory;
  the target, loopback server and socket close on exit.
- The PNG classifier counts neutral connected linework excluding tiny stars
  and UI bands, then flags a middle capture below half of both neighbors.
  These are blank-frame candidates, with sample counts and timestamps.
  Screencast sampling can miss displayed frames. It cannot certify zero blanks.

No find module was changed. Its live attribute equality check already skips
unchanged attributes, and the existing redundant-write test continues to pass.
No redraw was suppressed while a visible effect's clock could change its look.

## Before and after browser measurements

Both invocations below were made, before runtime edits and after the last
runtime edit/standalone pack. Neither opened a browser. Process inspection
found no existing headless Edge/Chrome debugging endpoint. Creating a browser
profile would write unlisted files, so it was omitted under the explicit
write rule. Missing measurements are not zeros.

Before: standalone (packed with tools/pack.mjs).

dist/journey-map.html

| Scenario | p50 / p95 / max / >33 / >100 | Script / style+layout / paint / raster | Long tasks | Blank frames |
| --- | --- | --- | --- | --- |
| Pinch x3 out/back, 300 ms each, three repeats | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Fling and glide | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Wayfinder, one turn in 1.5 s | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Slow pan with after-glow | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Stop glide | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Rush into blast | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |

Before: joined (existing packed file; fresh packing prohibited).

dist/journey-joined.html

| Scenario | p50 / p95 / max / >33 / >100 | Script / style+layout / paint / raster | Long tasks | Blank frames |
| --- | --- | --- | --- | --- |
| Pinch x3 out/back, 300 ms each, three repeats | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Fling and glide | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Wayfinder, one turn in 1.5 s | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Slow pan with after-glow | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Stop glide | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Rush into blast | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |

After: standalone (final standalone pack).

dist/journey-map.html

| Scenario | p50 / p95 / max / >33 / >100 | Script / style+layout / paint / raster | Long tasks | Blank frames |
| --- | --- | --- | --- | --- |
| Pinch x3 out/back, 300 ms each, three repeats | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Fling and glide | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Wayfinder, one turn in 1.5 s | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Slow pan with after-glow | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Stop glide | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Rush into blast | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |

After: joined (unchanged existing packed file; fresh packing prohibited).

dist/journey-joined.html

| Scenario | p50 / p95 / max / >33 / >100 | Script / style+layout / paint / raster | Long tasks | Blank frames |
| --- | --- | --- | --- | --- |
| Pinch x3 out/back, 300 ms each, three repeats | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Fling and glide | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Wayfinder, one turn in 1.5 s | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Slow pan with after-glow | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Stop glide | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |
| Rush into blast | NOT RUN | NOT RUN | NOT RUN | NOT MEASURED |

The <=33 ms p95 aim, no >100 ms holds, zero blanks and sharp-within-150 ms
device gates therefore remain open. The browser path of the new tool has not
been executed here. Its PNG, percentile, classifier and trace reducers have
independent Node fixtures; those pass.

## Recorded work reduction, not browser timing

The camera fixture invokes the actual writers on recording nodes at 412x730,
using 72 changing camera frames. The BEFORE writer was extracted read-only
from the pre-change standalone pack before the final pack overwrote it.
This is a source/command comparison, not a browser trace.

| Work in 72 moving frames | Before | After |
| --- | ---: | ---: |
| #cam matrix writes | 72 | 0 |
| Label transform writes (five representative label kinds) | 147 | 0 |
| Camera commit after movement | ordinary final-frame write | 1 |
| Label recovery after movement | no deferred recovery | 8 samples, 133.3 ms at 60 Hz |

The composited and virtual projections agree within the original rounded
matrix's 0.1 px tolerance. Final label scales equal the old epsilon writer.
Identical idle frames make no writes. Cancellation, interrupted zoom and
resize/exit cleanup are covered. The 133.3 ms is a fake-clock result, not a
real raster readiness measurement.

| Phone explore zoom | Old scratch pixels cleared per sampled frame | New | Reduction |
| --- | ---: | ---: | ---: |
| 1 | 3,609,120 | 871,895 | 75.8% |
| 2 | 3,609,120 | 1,037,640 | 71.2% |
| 3 | 3,609,120 | 760,250 | 78.9% |

These are recorded device-pixel areas at the capped 2x canvas resolution,
not paint time, GPU time or FPS. The crop also bounds scratch copying.

## Still comparison results

| Requested evidence | Result |
| --- | --- |
| All beats, rendered before/after | NOT RUN |
| Explore at rest, three zooms, <=1% pixel change | NOT RUN |
| Each find at rest | NOT RUN |
| No changed text pixels | NOT RUN |
| Stars/nova command snapshots | PASS, 21 fixtures |
| Rest label scale against old writer | PASS, five label kinds |

The 21 snapshots were recorded before the runtime edits, for desktop,
412x730 standalone, and a 1200-star joined-source fixture: overview, rush,
blast, settled footer and three explore zooms. Coordinates are normalized
to 1e-8 for floating-point endpoint equivalence. Scratch clear rectangles
and scratch-copy rectangles are excluded; their painted children stay
pinned. They prove command preservation for these fixtures, not raster
clipping correctness, text appearance or a screenshot match. No screenshot
difference percentage or visual pass is claimed.

## Tests changed

- tools/finds-test.mjs re-records only the authorized LF-normalized FNV source
  digests: trip.mjs 839897416 -> 1103612252; data.mjs 352845678 -> 2384053998.
  STARS/DEPTH/NOVA data and depth.mjs digests are unchanged.
- tools/nova-test.mjs updates only two explore will-change expectations to
  persistent "transform, opacity". Its non-explore opacity and drawing gates
  remain unchanged.
- tools/explore-test.mjs adds stationary cancellation invalidation/idle checks.
  Existing gesture, ownership, suppression and find interaction gates remain.
- New tools/frame-performance-test.mjs verifies composed geometry, zero
  moving SVG/label writes, one commit, label recovery, exact old rest scales,
  interruption, resize/exit and idle writes. Its optional --baseline mode
  requires an original packed standalone; it rejects the new pack.
- New tools/frame-render-test.mjs pins the 21 original command digests and
  reports bounded scratch area. Digests were not re-recorded after editing.
- New tools/frame-cost-test.mjs tests RGB/RGBA PNG decoding, all five filters,
  split IDAT, invalid signature, line/glow classification, percentiles,
  exclusive nested/B-E trace costs, renderer selection and raster accounting.
- No other existing test was changed or weakened.

An intermediate recording test lacked appendChild in its fake node; that
fixture was corrected. An initial optimized renderer snapshot failed because
an entirely offscreen group was skipped. The renderer was corrected to retain
all original drawing commands and omit only empty scratch copies; the original
snapshot hashes then passed. The original nova assertion failed until its
two authorized promotion expectations were updated. All failed outputs are
retained below.

## Packs, scope and omissions

tools/pack.mjs succeeded before and after. Final standalone size: 653.0 KB
uncompressed, 273.07 KB gzip. All map modules/CSS: 156.33 KB gzip / 160.
Hammer: 15.87 / 30 KB gzip. The unchanged old joined file is 491.65 / 540 KB
gzip; that size does not represent the new implementation.

tools/pack-joined.mjs was NOT run. Its unconditional writeFileSync to
joined.html would modify an unlisted file even if the bytes were identical.
Neither that tool nor joined.html was changed. dist/journey-joined.html is
unchanged and does not contain this work. No alternate packing workaround
was used.

Origin browser checks also report NOT RUN for lack of an existing endpoint.
No browser, profile, screenshot file, trace file, dependency installation,
external network access, git command, reviewer, other agent or persistent
server was used. RTK was unavailable; direct installed shell tools were used.

SHA-256 comparison against the starting 129-file inventory verifies no
deletions and no changes to protected files. depth.mjs remains exactly:
0FA0CA11A03AC830DBF148A68828EBFD1B47FA98875A48D2F433EC3C09473AC2
hero-copy/, reference/, assets/, existing briefs/build reports, both pack
tools, joined.html and every unlisted runtime module retain their original
hashes. Only listed runtime/test files, the standalone dist and this report
were changed or created.

The primary performance acceptance gates remain incomplete because the write
rule prevented rendered measurements. Lower-resolution glow rendering and
additional find redraw changes were left out without rendered equivalence
evidence. Do not interpret the passing Node suite as a phone-performance pass.

For external review, first produce an authorized fresh joined pack, then run
the new tool with an existing local headless endpoint. On a real phone check
fast two-finger reversals, stationary release and cancelled touch, fling
boundaries, SVG overflow at all edges, wayfinder turns and the after-glow.
Check for missing tiles, label recovery without snaps, sharpness within
150 ms, text/pixel equivalence at every beat/find/zoom, and promotion memory
cost at the largest zoom. Compare both standalone and joined against the
previous version; the joined hero and protected depth renderer may still
contribute costs outside this patch.

## Output of every test invocation

Commands ran from design/journey-map with Node. Output is preserved below,
including intermediate failures. NOT RUN programs set process.exitCode=2;
the Windows command adapter reported exit 1 for those invocations. Successful
tests reported 0. This distinction does not turn an unavailable gate into a pass.

### Run 1: Before: node tools/pack.mjs

Observed command exit: 0.

```text
packed data.mjs, art.mjs, trip.mjs, depth.mjs, stars.mjs, pace.mjs, timeline.mjs, findkit.mjs, explore.mjs, steps.mjs, cards.mjs, footname.mjs, footer.mjs, findhoards.mjs, findcreatures.mjs, findsheets.mjs, hammer.mjs, findhammer.mjs, findwater.mjs, findhorn.mjs, findall.mjs, finds.mjs, main.mjs
dist/journey-map.html 648.5 KB
```

### Run 2: Before: node tools/check.mjs

Observed command exit: 0.

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 15.87 KB / 30; all map modules + CSS 154.99 KB / 160
gzip: dist/journey-map.html 271.71 KB / 320
gzip: dist/journey-joined.html 491.65 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

### Run 3: Before: node tools/steps-test.mjs

Observed command exit: 0.

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

### Run 4: Before: node tools/nova-test.mjs

Observed command exit: 0.

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is omitted in reduced motion
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11; 132 gathering
WHIRL 1440x900 standalone 1.00s: 297.00 px/s, 132/132 on way
WHIRL 1440x900 standalone 2.00s: 906.40 px/s, 132/132 on way
WHIRL 1440x900 standalone 2.50s: 1088.86 px/s, 123/132 on way
WHIRL 1440x900 standalone 2.90s: 1204.52 px/s, 41/132 on way
WHIRL 1440x900 standalone 2.98s: 1514.22 px/s, 24/132 on way
WHIRL 1440x900 standalone: minimum 297.00 px/s vs 297.00 at 1s; minimum on way 18.18%; last 3.000000s
WHIRL 390x844 standalone: sectors 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3; 36 gathering
WHIRL 390x844 standalone 1.00s: 148.65 px/s, 36/36 on way
WHIRL 390x844 standalone 2.00s: 398.51 px/s, 36/36 on way
WHIRL 390x844 standalone 2.50s: 493.79 px/s, 33/36 on way
WHIRL 390x844 standalone 2.90s: 522.82 px/s, 11/36 on way
WHIRL 390x844 standalone 2.98s: 713.84 px/s, 7/36 on way
WHIRL 390x844 standalone: minimum 148.65 px/s vs 148.65 at 1s; minimum on way 19.44%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL 1440x900 joined 1.00s: 333.80 px/s, 168/168 on way
WHIRL 1440x900 joined 2.00s: 1018.17 px/s, 168/168 on way
WHIRL 1440x900 joined 2.50s: 1239.05 px/s, 157/168 on way
WHIRL 1440x900 joined 2.90s: 1245.03 px/s, 52/168 on way
WHIRL 1440x900 joined 2.98s: 1371.15 px/s, 31/168 on way
WHIRL 1440x900 joined: minimum 333.80 px/s vs 333.80 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 390x844 joined 240: sectors 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1; 12 gathering
WHIRL 390x844 joined 1.00s: 134.40 px/s, 12/12 on way
WHIRL 390x844 joined 2.00s: 411.78 px/s, 12/12 on way
WHIRL 390x844 joined 2.50s: 487.34 px/s, 11/12 on way
WHIRL 390x844 joined 2.90s: 424.20 px/s, 4/12 on way
WHIRL 390x844 joined 2.98s: 491.27 px/s, 2/12 on way
WHIRL 390x844 joined: minimum 134.40 px/s vs 134.40 at 1s; minimum on way 16.67%; last 3.000000s
ok: WHIRL balanced visible sectors, own-side ring approach, continuous drain through last frame, speed/5%/last-arrival gates and rising late heat/core/glow alpha
ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged
```

### Run 5: Before: node tools/depth-test.mjs

Observed command exit: 0.

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

### Run 6: Before: node tools/layout-test.mjs

Observed command exit: 0.

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

### Run 7: Before: node tools/explore-test.mjs

Observed command exit: 0.

```text
ok: desktop/phone zoom limits, bounded/centred cameras, fixed zoom anchor, damped glides with no overshoot, layer/inverse round trips
ok: end-only CTA entry, input takeover, pan/release, resize, exit and immediate departure reset; P and traveller unchanged
ok: copied name curves monotone, lens/rest geometry and knock spring settling
ok: arrows pan during explore without changing P; Escape ends explore
ok: actual footer fades in linear time, is gone by 600 ms, returns over last 500 ms of exit, and stays inert while exploring
ok: capture-phase pinch on nova/stop/horn; nova taps; owned single drags; drag-only pointer clicks; key/end/depart/reset/down/500 ms suppression clearing; temporary world promotion
ok: D3 real findsBuild horn/chest/beacon pinches at 0/30/100 ms preserve found/stage and zoom >=20%; taps act once, chest hold repeats, owned drags aim/wipe/turn and press drags pan
```

### Run 8: Before: node tools/finds-test.mjs

Observed command exit: 0.

```text
ok: C1 ring sea baseline; original fill/coast lengths and hashes unchanged
ok: STARS/DEPTH preserved; NOVA.build data digest recorded
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
ok: C2 ravens (tree drawn first, opaque birds, one drawing each, flights out of frame and back, facing, landing, reel and its kept items, epoch, shy hop, hear loop; outlines at least 1.32 units apart, largest pose step 7.78) and chests (staged dig, rattle, back lid, craft light, hints, kept popup): 1440x900: 1266 raven ticks; 390x844: 1266 raven ticks
ok: D2 falling quills fit one third of an open wing, stay behind takeoff/clear the other bird and expire by .8 s; 16 ms lid steps <=25 degrees, gentle start, .5 s peak, <=8 degree overshoot
ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast (9638 writes)
ok: reduced-motion serpent consumes leaves immediately with no swell; no shy hop; all tree actors stay still on hear
ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
ok: footer name layout reads 85 total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: {"resize":17,"fonts":17,"settle-end":17,"explore":34}
ok: actual timeline Home and End handlers select first and last stops
```

### Run 9: Before: node tools/motion-test.mjs

Observed command exit: 0.

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
1440x900 | lennard->x | 2.608 | 265.18 | 276.34 | 729.56 @ 2368
1440x900 | x->lennard | 2.608 | 265.26 | 277.10 | 728.26 @ 272
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
390x844 | lennard->x | 2.608 | 79.40 | 83.88 | 249.46 @ 2352
390x844 | x->lennard | 2.608 | 79.56 | 84.10 | 249.17 @ 272
D5 view | press | runs | worst centre acceleration | five-point peak | arrival range s | total range s
1440x900 | Back | 63 | 1703.88 | 838.77 | 0.656-4.176 | 0.656-4.176
1440x900 | hurry | 21 | 4178.30 | 1441.72 | 0.464-1.808 | 0.464-1.808
1440x900 | Next-reverse | 42 | 1727.01 | 815.11 | 0.896-4.176 | 0.896-4.176
1440x900 | Back-Next | 14 | 1721.91 | 764.49 | 1.152-3.472 | 1.456-3.776
1440x900 | go-back | 14 | 1687.93 | 838.77 | 1.312-2.928 | 1.312-2.928
1440x900 | go-next | 14 | 1725.25 | 815.11 | 1.312-2.656 | 1.312-2.656
390x844 | Back | 63 | 1006.19 | 461.68 | 0.656-4.368 | 0.656-4.368
390x844 | hurry | 21 | 2515.55 | 828.84 | 0.464-1.408 | 0.464-1.408
390x844 | Next-reverse | 42 | 1011.15 | 461.68 | 0.720-4.368 | 0.720-4.368
390x844 | Back-Next | 14 | 796.61 | 466.34 | 1.152-2.512 | 1.456-2.816
390x844 | go-back | 14 | 925.68 | 461.68 | 1.312-2.224 | 1.312-2.224
390x844 | go-next | 14 | 890.26 | 461.68 | 1.312-2.224 | 1.312-2.224
ok: 28 rest glides, 336 carry runs and 14 late-hurry guards; 16 ms acceleration/five probes, analytic continuity, bounded reversals through 99 percent, exact settled arrivals, faster feasible hurry and fresh set(P) equality
```

### Run 10: Before: node tools/hammer-test.mjs

Observed command exit: 0.

```text
ok: D3 foe heights incl stroke: giants/chief 16, hunched draugr 11, low full-width wolf 8; wave 1 varies; five overlapping shields span each unchanged segment
ok: original Norse foe silhouettes and their strokes fit unchanged hit boxes
ok: identical seeds and inputs match step for step
ok: 350 seeded formations/bosses fit their wave rows; unique fates; clay at 60%, heart at 30%
ok: 34 per-level rune effect checks; excluded runes absent
ok: cold includes both flights and glove; heat splits twice; draugr rises once; need multiplies the return upgrade; exposed stone heart doubles a hit
ok: return/catch, first-hit memory, shields, bridge loss; pool sizes and identities unchanged after 10,000 steps
steady: 200 seeds; wave 4 74.0%; wins 17.5%; ended by wave 3 26.0%; longest 223.6s; 0.00079 ms/step; 1.8s wall
ends {"6:bridge":6,"7:won":35,"5:bridge":10,"3:hearts":35,"5:hearts":42,"6:hearts":14,"4:hearts":28,"4:bridge":8,"2:hearts":12,"3:bridge":3,"7:hearts":5,"2:bridge":1,"1:hearts":1}
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00072 ms/step; 2.2s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

### Run 11: Before: node tools/origin-check.mjs

Observed command exit: 1.

```text
1440x900: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
1280x720: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
1024x600: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
820x1180: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
390x844: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
412x730: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
360x640: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
```

### Run 12: Before: node tools/frame-cost.mjs

Observed command exit: 1.

```text
dist/journey-map.html - 412x730, DPR 2.625, touch, CPU x4
| scenario | intervals / script / style+layout / paint / raster / long tasks | blank frames |
| --- | --- | --- |
| pinch x3 / 300 ms out + 300 ms in / three repeats | NOT RUN | NOT MEASURED |
| fling + glide | NOT RUN | NOT MEASURED |
| wayfinder / one turn in 1.5 s | NOT RUN | NOT MEASURED |
| slow pan with glow | NOT RUN | NOT MEASURED |
| stop glide | NOT RUN | NOT MEASURED |
| rush into blast | NOT RUN | NOT MEASURED |
dist/journey-joined.html - 412x730, DPR 2.625, touch, CPU x4
| scenario | intervals / script / style+layout / paint / raster / long tasks | blank frames |
| --- | --- | --- |
| pinch x3 / 300 ms out + 300 ms in / three repeats | NOT RUN | NOT MEASURED |
| fling + glide | NOT RUN | NOT MEASURED |
| wayfinder / one turn in 1.5 s | NOT RUN | NOT MEASURED |
| slow pan with glow | NOT RUN | NOT MEASURED |
| stop glide | NOT RUN | NOT MEASURED |
| rush into blast | NOT RUN | NOT MEASURED |
NOT RUN: no existing local headless CDP endpoint; write allowlist forbids creating a browser profile. Pass --cdp ws://127.0.0.1:PORT/devtools/browser/ID.
```

### Run 13: Before snapshots: node tools/frame-render-test.mjs --record (raw floating-point hashes)

Observed command exit: 0.

```text
{
  "1440x900/0/0": "c70e6b6a6bd1216d4d5f11933792a8cf033f6db9d110e3a96aa986adb5b98963",
  "1440x900/0/1": "62140943458d300d1450390337fe62ac0c19f2255c939ce88dcf261cd049ad09",
  "1440x900/0/2": "c6b8877479341aac66d20ade1e31e6cba3c1226040423b7665dc622af7352636",
  "1440x900/0/3": "3cc4d83d994943d5ae2bf935f31c740c2c020722376d65b014cac3ac19b06532",
  "1440x900/0/4": "ec62314892f29c1e4ce88435c4a524b45c3b52bb63e470d27bb12023ccfd98c2",
  "1440x900/0/5": "8a45f66d5aaa44c9110a4701d6f4c65cb308c25eb168df37cd70f5d53d43bd92",
  "1440x900/0/6": "015c23ba5c8f0bbb4aade5ec330a0f61f765bd0327c3d5c41996b972e07b1641",
  "412x730/0/0": "dbaf55663336f33676d21565ae713590a435620e3c08a1651c7c05f2460d45a2",
  "412x730/0/1": "8b4539b513f54e861fbced84e8caf5eebdc7cacdd714c48a05115f08c0bc163d",
  "412x730/0/2": "ece893ec6290d19c4afcde2d75bc9e239344de77aa49c9746e2435d4b78aab88",
  "412x730/0/3": "7e15ee9064d002b090498ee803e18f9e8a293ef56c4b5b79342cf73ff5c031f2",
  "412x730/0/4": "a0dbc9955292fe56323da717dde0f36bd65b3877b25b5bed0ecd553e22190bf0",
  "412x730/0/5": "19d4269bfe1b5e6bc3eb485e4bf3a165ad9106e57e6b76ddae2ba798c89365ec",
  "412x730/0/6": "235d87ee344f435d1a4ff509fb944679f35d172b6df8a8499f971774bf09285c",
  "412x730/1200/0": "7da714bd9a2e26c75d6a4076da12cb0dcdab15328a3e1e983b4c0a204c124333",
  "412x730/1200/1": "5aac71af773fec6c2535fc5b0ffa08d165e5a46df16a3ecbf7b2b8efaa5b08f6",
  "412x730/1200/2": "691bfb55f6797c2d4cb00231b4a941398e983029484dbf2ec6938ecbeff92cfb",
  "412x730/1200/3": "15e9db968bf275f02ff60b52c053ee62ae84d7d191192405533d4f3f82b5c42c",
  "412x730/1200/4": "64cf56172ef95217326d9e6b67581d8bacfeb5487c56c56bd8cf6a939148a690",
  "412x730/1200/5": "7f2b88108c75afdfb2857e3527e74d51cd8ab7510c52e1c16560e72a8143578a",
  "412x730/1200/6": "e28eeed733b4773e986de99756600cbb6302654f1d02bdd4594150c8ef3c9a66"
}
```

### Run 14: Before snapshots: node tools/frame-render-test.mjs --record (normalized 1e-8 hashes retained)

Observed command exit: 0.

```text
{
  "1440x900/0/0": "c1295233b9bb9297beaa6d95d00f02597be5e2e8e3b347ef6d92b9574420b52a",
  "1440x900/0/1": "9b9104fba3b3249872b1a1b3eb3049981c469bc902a399b976bef7cb4de86bf7",
  "1440x900/0/2": "2dd9e5c9341791f17b3fccc38e94f5457e2f4eb510e465c7d8318dae9e24593a",
  "1440x900/0/3": "1759c05c0687c7919c0f097c4804e1525421cf6f80e292855e4e8e0ca770cfc2",
  "1440x900/0/4": "4da98936662e424f3e81e8c2c0054faacc97edd47cbf610ef249ed18bc345150",
  "1440x900/0/5": "bbd600a850a8927930cb947df9ff6a788143b6fe54d4fea44a578d2ef16a21ff",
  "1440x900/0/6": "460f29fb84442048856b32a9fc927799818b195fcf238da2067da40e2739cf2f",
  "412x730/0/0": "e1199b07f654053b356d94e8a3eddd222f35a23f034914be458029ab29435a75",
  "412x730/0/1": "bc3c98368213cbea9035fc5d201c2928d6070c506078f366a3c6e0609bac24dc",
  "412x730/0/2": "39579b6ad29acba334ec47d8aa76d394b96b738e5699af57528122ed5b9ec1da",
  "412x730/0/3": "672c5157a06c435bc0e68fc09881e6abbba468149a87636eed4c8acc5479eaf8",
  "412x730/0/4": "f801aeff8aeb52c2fde0e5bd712178f11279b9892248719235b0922eaeceed2c",
  "412x730/0/5": "dbae02a8cfb86f28cdc7741b5d301137643c0a4fb201df20bfe1be9cc2931b63",
  "412x730/0/6": "0efa0abe79d40484d3f2c3e10a622bf67731b526bb150ade236dd8981e6fb81b",
  "412x730/1200/0": "578c51f67a8df70dd74c4af2f83e191def6ff57640e36f4fc53fb72ff6397b1e",
  "412x730/1200/1": "ec36555db76cce758f27eed54237c54ae568e5c136491ff7a330fb4ed157234d",
  "412x730/1200/2": "476510a54c45c9e91d1301f94a5855475616937ba448c6983d8ca4a75d93745a",
  "412x730/1200/3": "e46b21aac56a68d5ec0182e09ecb3c2ab725b9abf47cd94bd88901ba17621b04",
  "412x730/1200/4": "2390eb748305e7f59a5198420685ad730f4383fb7cdbd9e77a58738f08b5209a",
  "412x730/1200/5": "c539e00e99fe9995634e8c023686945986214df3d3aacb8a9fbba97dbedb9018",
  "412x730/1200/6": "5318b5f5b33cec4b751d64dce8b8247e211b63060fa1ce4b5aa3eb3c816b7c75"
}
```

### Run 15: Intermediate 1: node tools/frame-render-test.mjs

Observed command exit: 1.

```text
node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: 1440x900/0/6 drawing commands changed
+ actual - expected

+ 'f49aefcd34600f1e69594f1df2b3c1b73ee19c8725d51cd1c4e758535a331299'
- '460f29fb84442048856b32a9fc927799818b195fcf238da2067da40e2739cf2f'

    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/frame-render-test.mjs:64:26
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: 'f49aefcd34600f1e69594f1df2b3c1b73ee19c8725d51cd1c4e758535a331299',
  expected: '460f29fb84442048856b32a9fc927799818b195fcf238da2067da40e2739cf2f',
  operator: 'strictEqual',
  diff: 'simple'
}

Node.js v26.7.0
```

### Run 16: Intermediate 1: node tools/nova-test.mjs

Observed command exit: 1.

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is omitted in reduced motion
node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:
+ actual - expected

+ 'transform, opacity'
- 'opacity'

    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/nova-test.mjs:89:67
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: 'transform, opacity',
  expected: 'opacity',
  operator: 'strictEqual',
  diff: 'simple'
}

Node.js v26.7.0
```

### Run 17: Intermediate 1: node tools/explore-test.mjs

Observed command exit: 0.

```text
ok: desktop/phone zoom limits, bounded/centred cameras, fixed zoom anchor, damped glides with no overshoot, layer/inverse round trips
ok: end-only CTA entry, input takeover, pan/release, resize, exit and immediate departure reset; P and traveller unchanged
ok: copied name curves monotone, lens/rest geometry and knock spring settling
ok: arrows pan during explore without changing P; Escape ends explore
ok: actual footer fades in linear time, is gone by 600 ms, returns over last 500 ms of exit, and stays inert while exploring
ok: capture-phase pinch on nova/stop/horn; nova taps; owned single drags; drag-only pointer clicks; key/end/depart/reset/down/500 ms suppression clearing; temporary world promotion
ok: D3 real findsBuild horn/chest/beacon pinches at 0/30/100 ms preserve found/stage and zoom >=20%; taps act once, chest hold repeats, owned drags aim/wipe/turn and press drags pan
```

### Run 18: Intermediate 1: node tools/layout-test.mjs

Observed command exit: 0.

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

### Run 19: Intermediate 2: node tools/frame-render-test.mjs

Observed command exit: 0.

```text
ok: 21 desktop/phone/1200-star drawing-command snapshots match pre-FRAMES; not a pixel comparison
```

### Run 20: Intermediate 2: node tools/nova-test.mjs

Observed command exit: 0.

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is omitted in reduced motion
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11; 132 gathering
WHIRL 1440x900 standalone 1.00s: 297.00 px/s, 132/132 on way
WHIRL 1440x900 standalone 2.00s: 906.40 px/s, 132/132 on way
WHIRL 1440x900 standalone 2.50s: 1088.86 px/s, 123/132 on way
WHIRL 1440x900 standalone 2.90s: 1204.52 px/s, 41/132 on way
WHIRL 1440x900 standalone 2.98s: 1514.22 px/s, 24/132 on way
WHIRL 1440x900 standalone: minimum 297.00 px/s vs 297.00 at 1s; minimum on way 18.18%; last 3.000000s
WHIRL 390x844 standalone: sectors 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3; 36 gathering
WHIRL 390x844 standalone 1.00s: 148.65 px/s, 36/36 on way
WHIRL 390x844 standalone 2.00s: 398.51 px/s, 36/36 on way
WHIRL 390x844 standalone 2.50s: 493.79 px/s, 33/36 on way
WHIRL 390x844 standalone 2.90s: 522.82 px/s, 11/36 on way
WHIRL 390x844 standalone 2.98s: 713.84 px/s, 7/36 on way
WHIRL 390x844 standalone: minimum 148.65 px/s vs 148.65 at 1s; minimum on way 19.44%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL 1440x900 joined 1.00s: 333.80 px/s, 168/168 on way
WHIRL 1440x900 joined 2.00s: 1018.17 px/s, 168/168 on way
WHIRL 1440x900 joined 2.50s: 1239.05 px/s, 157/168 on way
WHIRL 1440x900 joined 2.90s: 1245.03 px/s, 52/168 on way
WHIRL 1440x900 joined 2.98s: 1371.15 px/s, 31/168 on way
WHIRL 1440x900 joined: minimum 333.80 px/s vs 333.80 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 390x844 joined 240: sectors 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1; 12 gathering
WHIRL 390x844 joined 1.00s: 134.40 px/s, 12/12 on way
WHIRL 390x844 joined 2.00s: 411.78 px/s, 12/12 on way
WHIRL 390x844 joined 2.50s: 487.34 px/s, 11/12 on way
WHIRL 390x844 joined 2.90s: 424.20 px/s, 4/12 on way
WHIRL 390x844 joined 2.98s: 491.27 px/s, 2/12 on way
WHIRL 390x844 joined: minimum 134.40 px/s vs 134.40 at 1s; minimum on way 16.67%; last 3.000000s
ok: WHIRL balanced visible sectors, own-side ring approach, continuous drain through last frame, speed/5%/last-arrival gates and rising late heat/core/glow alpha
ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged
```

### Run 21: Tool reducer tests: node tools/frame-cost-test.mjs

Observed command exit: 0.

```text
ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature
ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work
```

### Run 22: Camera fixture, initial: node tools/frame-performance-test.mjs --baseline

Observed command exit: 1.

```text
<anonymous_script>:267
  TRIP_EL.scrim = document.createElement('div'); TRIP_EL.scrim.className = 'stage-scrim'; TRIP_EL.scrim.setAttribute('aria-hidden', 'true'); TRIP_EL.scrim.style.height = WORLD.scrim[VIEW.phone ? 1 : 0] + 'px'; TRIP_EL.scrim.style.background = 'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--ink) ' + WORLD.scrim[2] * 100 + '%, transparent))'; els.svg.parentElement.appendChild(TRIP_EL.scrim);
                                                                                                                                                                                                                                                                                                                                                                                               ^

TypeError: els.svg.parentElement.appendChild is not a function
    at Object.tripBuild (eval at <anonymous> (file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/frame-performance-test.mjs:13:35), <anonymous>:267:384)
    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/frame-performance-test.mjs:27:5
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v26.7.0
```

### Run 23: Camera fixture, initial: node tools/frame-performance-test.mjs

Observed command exit: 1.

```text
file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/trip.mjs:266
  TRIP_EL.scrim = document.createElement('div'); TRIP_EL.scrim.className = 'stage-scrim'; TRIP_EL.scrim.setAttribute('aria-hidden', 'true'); TRIP_EL.scrim.style.height = WORLD.scrim[VIEW.phone ? 1 : 0] + 'px'; TRIP_EL.scrim.style.background = 'linear-gradient(to bottom, transparent, color-mix(in srgb, var(--ink) ' + WORLD.scrim[2] * 100 + '%, transparent))'; els.svg.parentElement.appendChild(TRIP_EL.scrim);
                                                                                                                                                                                                                                                                                                                                                                                               ^

TypeError: els.svg.parentElement.appendChild is not a function
    at Module.tripBuild (file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/trip.mjs:266:384)
    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/frame-performance-test.mjs:27:5
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v26.7.0
```

### Run 24: Camera fixture, corrected: node tools/frame-performance-test.mjs --baseline

Observed command exit: 0.

```text
BEFORE 412x730 / 72 moving frames: #cam writes 72; label writes 147; recovery 1 frames / 16.7 ms
```

### Run 25: Camera fixture, corrected: node tools/frame-performance-test.mjs

Observed command exit: 0.

```text
AFTER 412x730 / 72 moving frames: #cam writes 0; label writes 0; recovery 8 frames / 133.3 ms
ok: compositor/virtual camera agree within original matrix rounding; one settle commit; rest label scales unchanged; interrupted zoom, resize/exit cleanup and zero idle writes
```

### Run 26: Scratch-area recording: node tools/frame-render-test.mjs

Observed command exit: 0.

```text
phone explore zoom 1: scratch pixels cleared 3609120 -> 871895 (75.8% less); same drawing commands
phone explore zoom 2: scratch pixels cleared 3609120 -> 1037640 (71.2% less); same drawing commands
phone explore zoom 3: scratch pixels cleared 3609120 -> 760250 (78.9% less); same drawing commands
ok: 21 desktop/phone/1200-star drawing-command snapshots match pre-FRAMES; not a pixel comparison
```

### Run 27: Digest update: node tools/finds-test.mjs

Observed command exit: 0.

```text
ok: C1 ring sea baseline; original fill/coast lengths and hashes unchanged
ok: STARS/DEPTH preserved; NOVA.build data digest recorded
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
ok: C2 ravens (tree drawn first, opaque birds, one drawing each, flights out of frame and back, facing, landing, reel and its kept items, epoch, shy hop, hear loop; outlines at least 1.32 units apart, largest pose step 7.78) and chests (staged dig, rattle, back lid, craft light, hints, kept popup): 1440x900: 1266 raven ticks; 390x844: 1266 raven ticks
ok: D2 falling quills fit one third of an open wing, stay behind takeoff/clear the other bird and expire by .8 s; 16 ms lid steps <=25 degrees, gentle start, .5 s peak, <=8 degree overshoot
ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast (9638 writes)
ok: reduced-motion serpent consumes leaves immediately with no swell; no shy hop; all tree actors stay still on hear
ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
ok: footer name layout reads 85 total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: {"resize":17,"fonts":17,"settle-end":17,"explore":34}
ok: actual timeline Home and End handlers select first and last stops
```

### Run 28: Intermediate 3: node tools/frame-cost-test.mjs

Observed command exit: 0.

```text
ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature
ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work
```

### Run 29: Intermediate 3: node tools/frame-performance-test.mjs

Observed command exit: 0.

```text
AFTER 412x730 / 72 moving frames: #cam writes 0; label writes 0; recovery 8 frames / 133.3 ms
ok: compositor/virtual camera agree within original matrix rounding; one settle commit; rest label scales unchanged; interrupted zoom, resize/exit cleanup and zero idle writes
```

### Run 30: Intermediate 3: node tools/frame-render-test.mjs

Observed command exit: 0.

```text
phone explore zoom 1: scratch pixels cleared 3609120 -> 871895 (75.8% less); same drawing commands
phone explore zoom 2: scratch pixels cleared 3609120 -> 1037640 (71.2% less); same drawing commands
phone explore zoom 3: scratch pixels cleared 3609120 -> 760250 (78.9% less); same drawing commands
ok: 21 desktop/phone/1200-star drawing-command snapshots match pre-FRAMES; not a pixel comparison
```

### Run 31: Intermediate 3: node tools/explore-test.mjs

Observed command exit: 0.

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

### Run 32: Final: node --check on all 41 runtime/tool modules

Observed command exit: 0.

```text
PASS: node --check on all 41 runtime/tool .mjs files; hero-copy excluded.
```

### Run 33: Final: node tools/pack.mjs

Observed command exit: 0.

```text
packed data.mjs, art.mjs, trip.mjs, depth.mjs, stars.mjs, pace.mjs, timeline.mjs, findkit.mjs, explore.mjs, steps.mjs, cards.mjs, footname.mjs, footer.mjs, findhoards.mjs, findcreatures.mjs, findsheets.mjs, hammer.mjs, findhammer.mjs, findwater.mjs, findhorn.mjs, findall.mjs, finds.mjs, main.mjs
dist/journey-map.html 653.0 KB
```

### Run 34: Final: node tools/check.mjs

Observed command exit: 0.

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 15.87 KB / 30; all map modules + CSS 156.33 KB / 160
gzip: dist/journey-map.html 273.07 KB / 320
gzip: dist/journey-joined.html 491.65 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

### Run 35: Final: node tools/steps-test.mjs

Observed command exit: 0.

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

### Run 36: Final: node tools/nova-test.mjs

Observed command exit: 0.

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is omitted in reduced motion
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11; 132 gathering
WHIRL 1440x900 standalone 1.00s: 297.00 px/s, 132/132 on way
WHIRL 1440x900 standalone 2.00s: 906.40 px/s, 132/132 on way
WHIRL 1440x900 standalone 2.50s: 1088.86 px/s, 123/132 on way
WHIRL 1440x900 standalone 2.90s: 1204.52 px/s, 41/132 on way
WHIRL 1440x900 standalone 2.98s: 1514.22 px/s, 24/132 on way
WHIRL 1440x900 standalone: minimum 297.00 px/s vs 297.00 at 1s; minimum on way 18.18%; last 3.000000s
WHIRL 390x844 standalone: sectors 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3; 36 gathering
WHIRL 390x844 standalone 1.00s: 148.65 px/s, 36/36 on way
WHIRL 390x844 standalone 2.00s: 398.51 px/s, 36/36 on way
WHIRL 390x844 standalone 2.50s: 493.79 px/s, 33/36 on way
WHIRL 390x844 standalone 2.90s: 522.82 px/s, 11/36 on way
WHIRL 390x844 standalone 2.98s: 713.84 px/s, 7/36 on way
WHIRL 390x844 standalone: minimum 148.65 px/s vs 148.65 at 1s; minimum on way 19.44%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL 1440x900 joined 1.00s: 333.80 px/s, 168/168 on way
WHIRL 1440x900 joined 2.00s: 1018.17 px/s, 168/168 on way
WHIRL 1440x900 joined 2.50s: 1239.05 px/s, 157/168 on way
WHIRL 1440x900 joined 2.90s: 1245.03 px/s, 52/168 on way
WHIRL 1440x900 joined 2.98s: 1371.15 px/s, 31/168 on way
WHIRL 1440x900 joined: minimum 333.80 px/s vs 333.80 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 390x844 joined 240: sectors 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1; 12 gathering
WHIRL 390x844 joined 1.00s: 134.40 px/s, 12/12 on way
WHIRL 390x844 joined 2.00s: 411.78 px/s, 12/12 on way
WHIRL 390x844 joined 2.50s: 487.34 px/s, 11/12 on way
WHIRL 390x844 joined 2.90s: 424.20 px/s, 4/12 on way
WHIRL 390x844 joined 2.98s: 491.27 px/s, 2/12 on way
WHIRL 390x844 joined: minimum 134.40 px/s vs 134.40 at 1s; minimum on way 16.67%; last 3.000000s
ok: WHIRL balanced visible sectors, own-side ring approach, continuous drain through last frame, speed/5%/last-arrival gates and rising late heat/core/glow alpha
ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged
```

### Run 37: Final: node tools/depth-test.mjs

Observed command exit: 0.

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

### Run 38: Final: node tools/layout-test.mjs

Observed command exit: 0.

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

### Run 39: Final: node tools/explore-test.mjs

Observed command exit: 0.

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

### Run 40: Final: node tools/finds-test.mjs

Observed command exit: 0.

```text
ok: C1 ring sea baseline; original fill/coast lengths and hashes unchanged
ok: STARS/DEPTH preserved; NOVA.build data digest recorded
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
ok: C2 ravens (tree drawn first, opaque birds, one drawing each, flights out of frame and back, facing, landing, reel and its kept items, epoch, shy hop, hear loop; outlines at least 1.32 units apart, largest pose step 7.78) and chests (staged dig, rattle, back lid, craft light, hints, kept popup): 1440x900: 1266 raven ticks; 390x844: 1266 raven ticks
ok: D2 falling quills fit one third of an open wing, stay behind takeoff/clear the other bird and expire by .8 s; 16 ms lid steps <=25 degrees, gentle start, .5 s peak, <=8 degree overshoot
ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast (9638 writes)
ok: reduced-motion serpent consumes leaves immediately with no swell; no shy hop; all tree actors stay still on hear
ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
ok: footer name layout reads 85 total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: {"resize":17,"fonts":17,"settle-end":17,"explore":34}
ok: actual timeline Home and End handlers select first and last stops
```

### Run 41: Final: node tools/motion-test.mjs

Observed command exit: 0.

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
1440x900 | lennard->x | 2.608 | 265.18 | 276.34 | 729.56 @ 2368
1440x900 | x->lennard | 2.608 | 265.26 | 277.10 | 728.26 @ 272
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
390x844 | lennard->x | 2.608 | 79.40 | 83.88 | 249.46 @ 2352
390x844 | x->lennard | 2.608 | 79.56 | 84.10 | 249.17 @ 272
D5 view | press | runs | worst centre acceleration | five-point peak | arrival range s | total range s
1440x900 | Back | 63 | 1703.88 | 838.77 | 0.656-4.176 | 0.656-4.176
1440x900 | hurry | 21 | 4178.30 | 1441.72 | 0.464-1.808 | 0.464-1.808
1440x900 | Next-reverse | 42 | 1727.01 | 815.11 | 0.896-4.176 | 0.896-4.176
1440x900 | Back-Next | 14 | 1721.91 | 764.49 | 1.152-3.472 | 1.456-3.776
1440x900 | go-back | 14 | 1687.93 | 838.77 | 1.312-2.928 | 1.312-2.928
1440x900 | go-next | 14 | 1725.25 | 815.11 | 1.312-2.656 | 1.312-2.656
390x844 | Back | 63 | 1006.19 | 461.68 | 0.656-4.368 | 0.656-4.368
390x844 | hurry | 21 | 2515.55 | 828.84 | 0.464-1.408 | 0.464-1.408
390x844 | Next-reverse | 42 | 1011.15 | 461.68 | 0.720-4.368 | 0.720-4.368
390x844 | Back-Next | 14 | 796.61 | 466.34 | 1.152-2.512 | 1.456-2.816
390x844 | go-back | 14 | 925.68 | 461.68 | 1.312-2.224 | 1.312-2.224
390x844 | go-next | 14 | 890.26 | 461.68 | 1.312-2.224 | 1.312-2.224
ok: 28 rest glides, 336 carry runs and 14 late-hurry guards; 16 ms acceleration/five probes, analytic continuity, bounded reversals through 99 percent, exact settled arrivals, faster feasible hurry and fresh set(P) equality
```

### Run 42: Final: node tools/hammer-test.mjs

Observed command exit: 0.

```text
ok: D3 foe heights incl stroke: giants/chief 16, hunched draugr 11, low full-width wolf 8; wave 1 varies; five overlapping shields span each unchanged segment
ok: original Norse foe silhouettes and their strokes fit unchanged hit boxes
ok: identical seeds and inputs match step for step
ok: 350 seeded formations/bosses fit their wave rows; unique fates; clay at 60%, heart at 30%
ok: 34 per-level rune effect checks; excluded runes absent
ok: cold includes both flights and glove; heat splits twice; draugr rises once; need multiplies the return upgrade; exposed stone heart doubles a hit
ok: return/catch, first-hit memory, shields, bridge loss; pool sizes and identities unchanged after 10,000 steps
steady: 200 seeds; wave 4 74.0%; wins 17.5%; ended by wave 3 26.0%; longest 223.6s; 0.00079 ms/step; 1.8s wall
ends {"6:bridge":6,"7:won":35,"5:bridge":10,"3:hearts":35,"5:hearts":42,"6:hearts":14,"4:hearts":28,"4:bridge":8,"2:hearts":12,"3:bridge":3,"7:hearts":5,"2:bridge":1,"1:hearts":1}
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00068 ms/step; 2.1s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

### Run 43: Final: node tools/frame-cost-test.mjs

Observed command exit: 0.

```text
ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature
ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work
```

### Run 44: Final: node tools/frame-performance-test.mjs

Observed command exit: 0.

```text
AFTER 412x730 / 72 moving frames: #cam writes 0; label writes 0; recovery 8 frames / 133.3 ms
ok: compositor/virtual camera agree within original matrix rounding; one settle commit; rest label scales unchanged; interrupted zoom, resize/exit cleanup and zero idle writes
```

### Run 45: Final: node tools/frame-render-test.mjs

Observed command exit: 0.

```text
phone explore zoom 1: scratch pixels cleared 3609120 -> 871895 (75.8% less); same drawing commands
phone explore zoom 2: scratch pixels cleared 3609120 -> 1037640 (71.2% less); same drawing commands
phone explore zoom 3: scratch pixels cleared 3609120 -> 760250 (78.9% less); same drawing commands
ok: 21 desktop/phone/1200-star drawing-command snapshots match pre-FRAMES; not a pixel comparison
```

### Run 46: Final: node tools/origin-check.mjs

Observed command exit: 1.

```text
1440x900: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
1280x720: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
1024x600: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
820x1180: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
390x844: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
412x730: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
360x640: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
```

### Run 47: Final: node tools/frame-cost.mjs

Observed command exit: 1.

```text
dist/journey-map.html - 412x730, DPR 2.625, touch, CPU x4
| scenario | intervals / script / style+layout / paint / raster / long tasks | blank frames |
| --- | --- | --- |
| pinch x3 / 300 ms out + 300 ms in / three repeats | NOT RUN | NOT MEASURED |
| fling + glide | NOT RUN | NOT MEASURED |
| wayfinder / one turn in 1.5 s | NOT RUN | NOT MEASURED |
| slow pan with glow | NOT RUN | NOT MEASURED |
| stop glide | NOT RUN | NOT MEASURED |
| rush into blast | NOT RUN | NOT MEASURED |
dist/journey-joined.html - 412x730, DPR 2.625, touch, CPU x4
| scenario | intervals / script / style+layout / paint / raster / long tasks | blank frames |
| --- | --- | --- |
| pinch x3 / 300 ms out + 300 ms in / three repeats | NOT RUN | NOT MEASURED |
| fling + glide | NOT RUN | NOT MEASURED |
| wayfinder / one turn in 1.5 s | NOT RUN | NOT MEASURED |
| slow pan with glow | NOT RUN | NOT MEASURED |
| stop glide | NOT RUN | NOT MEASURED |
| rush into blast | NOT RUN | NOT MEASURED |
NOT RUN: no existing local headless CDP endpoint; write allowlist forbids creating a browser profile. Pass --cdp ws://127.0.0.1:PORT/devtools/browser/ID.
```
