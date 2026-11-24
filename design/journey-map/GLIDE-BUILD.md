# GLIDE build

The change-only write cleanup is packed on both pages. The phone performance
target is NOT MET. The faster geometricPrecision candidate was rejected and
removed because its label boxes violate the 0.5 px limit. Desktop timing
passes: all eight measured glides are below 33 ms, worst 20.9 ms.

The isolated final image comparison passes its rest-pixel and glide-box/width
gates. All requested Node regression tests, the additional whirl2-test, syntax
checks and the seven-size origin audit pass. The final screencasts contain
zero blank-frame candidates in 2,877 samples. The phone performance target
and a blanket no-worse timing gate remain failed; no real-phone pass is claimed.

Acceptance criteria fixed before runtime edits: preserve every beat, card,
find and explore rest frame within 0.5 percent changed pixels, with no visible
changed shape; preserve glide label boxes within 0.5 CSS px and screen-width
strokes; keep draw order, P-driven replay, controls, clocks and reduced motion.
Target phone glide p95 <=50 ms and style plus layout <=12 ms/frame on both
packed pages; desktop has no glide frame over 33 ms. Preserve explore and nova
performance and check sampled frames for blanks. Keep existing gzip budgets.

Read BRIEF.md, FRAMES.md, FRAMES-BUILD.md, the current motion review, runtime
writers and test tools. Applied local motion-performance and motion-playbook
guidance. No UI CLI, installs, network, git or agents. All browser profile,
temporary browser files and captures are under the authorized glide run folder.
Evidence root: C:\Users\Admin\Documents\Portfolio\journey-map-runs\glide.

## Retained changes and measured savings

- cards.mjs: close-button inert writes are guarded; the card, shield, face,
  shadow, words, paint and tail style writers skip unchanged authored values.
  Mini-map paint updates only when paint changes. Caches retain both authored
  and canonical CSSOM values, so normalized decimals/spacing do not defeat the
  guard, and an outside edit is repaired. The six close inert assignments per
  idle frame become zero after initialization (source-level count). Geometry,
  numerical values and drawing order are unchanged.
- steps.mjs: hidden, aria-label, Back text, end text, go-end/jm-moving classes
  and fill transform are written only on change. This removes repeated hidden
  and accessible-label mutations without changing focus or navigation.
- timeline.mjs: unchanged transforms, opacity and visited-block paint are
  skipped; aria-valuetext and aria-valuenow update independently. Resize edits
  are detected through the live canonical value, so caches cannot hide them.
- footer.mjs: canonical CSSOM-aware caching stops the repeated nova-hit width,
  height and transform assignments; footer item styles and hit accessibility
  properties update only on change. A changing hit box still follows the same
  camera; no hit geometry, nova pixels or clock is changed.
- findkit.mjs, findcreatures.mjs, findsheets.mjs and findhammer.mjs: unchanged
  popup, sheet, iris, rubbing, stamp and found-star styles are skipped. The
  same expressions and clocks still drive changing values, including idle
  find motion. No actor, state, animation or drawing is removed.

The before, write-only, rejected precision, and final write-only tables below
are separate runs. There is no consistent stop-glide timing win from write
guards alone, and no individual helper's milliseconds can be isolated from
these end-to-end runs. Do not interpret run-to-run variation as its savings.
The retained cleanup lowers some explore style/layout costs: standalone fling
1.66 to 0.87 ms/frame, wayfinder 0.93 to 0.49; joined slow pan 2.32 to 0.90.
The joined wayfinder p95 is 20.9 before and 24.9 after, despite lower style work.
The strict no-worse performance goal is therefore not claimed for every row.

Final named phone glides, p95 / style+layout ms per frame:

| Page / glide | Before | Retained final |
| --- | ---: | ---: |
| Map / whole map to Laurier | 70.90 / 31.39 | 66.80 / 31.17 |
| Map / Laurier to HMC | 70.80 / 33.14 | 71.00 / 34.35 |
| Map / HMC again to Interkom | 74.90 / 35.68 | 75.00 / 34.07 |
| Map / Interkom Back to HMC again | 75.10 / 35.39 | 70.90 / 33.42 |
| Joined / whole map to Laurier | 66.70 / 31.62 | 75.00 / 32.37 |
| Joined / Laurier to HMC | 83.40 / 40.59 | 79.10 / 34.70 |
| Joined / HMC again to Interkom | 75.00 / 37.05 | 79.20 / 36.61 |
| Joined / Interkom Back to HMC again | 79.20 / 37.72 | 70.90 / 35.20 |

## Rejected optimization

Tested text-rendering: geometricPrecision on .map text, then removed it.
It cut standalone named-glide p95 to 33.4-45.8 ms and style+layout to
6.43-9.21 ms/frame; joined to 25.1-41.7 ms and 5.63-8.67 ms/frame. Relative
to the preceding write-only run, the whole-map-to-Laurier style+layout saving
was 21.85 ms/frame standalone and 32.23 joined. This would meet the phone
timing target in those runs, but it failed the visual contract.

The 72 fixed-time glide captures have a worst label-box delta of 6.446289 px
("summers 2018 and 2020" at desktop 3600 ms); every nonempty label type exceeds
0.5 px somewhere in the sampled desktop/phone sequences. Eight of the 192
rest comparisons also exceed the raw 0.5 percent pixel limit. The evidence
is preserved in precision-visual and precision-timing. No selective text
exception passed the measured box limit. No compensation or threshold change
was used to retain this candidate. map.css has its original text rendering.

The first comparison tool incorrectly applied the still-frame pixel limit
to glide frames as well. Its gating was corrected to the brief: raw counts
for every frame are retained, rest uses 0.5 percent, and glide uses label boxes
and stroke width. A same-code/default-text control also showed small GPU
rounding variation, mostly one channel level, in high-DPR moving captures.
An optional repeated-screenshot stability experiment is retained in control;
the final comparison uses the original one-screenshot-per-time protocol.
These observations do not excuse the precision candidate's box failure.

## Checks, scope and omissions

tools/frame-cost.mjs now reports layout, style, paint, pre-paint, layerize,
script and commit separately, plus raster worker time. It adds the four named
glides, measures their moving frames without idle tails, supports desktop
metrics, and optionally saves traces, screencasts and summary JSON only in
the authorized run directory. Both pages were packed before the initial run
and after each runtime step. The baseline raw trace names originally collided
between pages; the independent per-page result JSON and all table values
remain. Later trace/capture names include the page and do not collide.

Headless Edge 158.0.4370.33 reports the RTX 4090, GPU compositing, rasterization
and 2D canvas enabled. Phone timing: 412x730, DPR 2.625, touch/mobile, CPU x4.
Desktop timing: 1440x900, DPR 1, CPU x1. Capture passes have their own overhead
and are not used to claim the timing target. These are single-run comparisons,
not a confidence interval or a real-phone performance certification.

Tests changed:

- frame-cost-test.mjs adds the seven-stage trace accounting fixture and pins
  the newly returned fields, retaining the original exclusive-cost assertions.
- motion-test.mjs adds missing getAttribute to its DOM mock for the new live
  aria-label equality check. No motion gate is changed.
- New glide-visual-test.mjs captures deterministic beats, six closed cards,
  fifteen focused find/hoard views, explore rest and twelve glide times per
  page/configuration. The fake Date epoch is 2026-11-23T17:00:00Z; frames step
  at 60 Hz, with samples at 300 through 3600 ms. It records label boxes and
  every selected stroke's vector-effect and screen width, and writes raw diff
  images/counts. CSS transitions are finished for the sampled P; this does not
  replace the external live-motion review.
- New glide-suite-test.mjs runs checks and preserves their actual stdout,
  stderr and exit status in this report. New glide-report-test.mjs validates
  trace totals/render gates and generates the full evidence tables.
- finds-test.mjs is unchanged. No digest is re-recorded: trip.mjs, data.mjs,
  depth.mjs and their pinned values are unchanged. Existing drawing snapshots,
  geometry, motion and reduced-motion assertions remain in force.

The initial suite failures were a numeric-vs-string style value in a plain
mock and its missing getAttribute. Helpers now pass the original value to
the setter (real CSSOM still canonicalizes it); the mock API was completed.
The failing outputs remain below, followed by the successful complete suite.
No assertion was weakened.

An initial origin audit and final image capture were incorrectly run at the
same time. The origin target did not receive the frames needed to open its
cards, and one concurrent high-DPR horn still exceeded the pixel threshold.
Both failed outputs are retained. The audits were then run serially: origin
passes all seven sizes, and the full isolated 264-image comparison passes.
The concurrent run is final-visual; the authoritative serial run is
final-isolated. No failed image was replaced inside either run.

No screen-width stroke was removed or scaled, no words were moved to a
snapshot layer, and no path merging was retained. Scaling an entire glide
layer would scale its text and strokes; removing non-scaling-stroke would
directly violate the width requirement. Their savings were not measured here.
The brief's 3.5 ms layout / 7 ms paint estimate is prior evidence, not a result
of this implementation. None of the rejected precision savings is shipped.

The write allowlist prevents editing redundant writers in footname.mjs,
depth.mjs, stars.mjs and join.mjs. They were left alone, with no wrapper or
alternate writer used to bypass that restriction. No new production module,
font measurement pass, frame loop, dependency or external project record was
created. This permitted report is the project record. The UI skill CLI and
reviewer loop were omitted under the no-install/no-network/no-agent rules.
RTK is unavailable on PATH; direct installed tools were used.

All retained JS, CSS and generated pages remain within the listed files.
Protected depth.mjs SHA-256 is unchanged:
0FA0CA11A03AC830DBF148A68828EBFD1B47FA98875A48D2F433EC3C09473AC2.
File-hash comparison also checks hero-copy, assets, reference, briefs, other
build reports and unlisted runtime files; none was edited or deleted.

Gzip: hammer 15.88/30 KB; all map modules/CSS 157.88/160 KB;
packed map 274.47/320 KB; packed joined 494.53/540 KB.

On a real phone, check Set out and every Next/Back glide, a reversal midway,
timeline scrub/replay, all six card close/reopen focus paths, fast pinch
reversals and release/cancel, a wayfinder turn, the idle ravens/beacon/ship/
needle, and forward/back through the rush and blast. Compare label placement,
thin strokes, text-over-art/card-over-text order and any missing SVG tiles.
The phone lag remains a known limitation of the retained build.

## Final rendered comparison

The serial final run contains 192 rest views and 72 glide samples across both
pages at 1440x900/DPR 1, 412x730/DPR 1 and 412x730/DPR 2.625. Of the rest
views, 172 are pixel-identical. The worst is Mohawk on the standalone phone
at DPR 2.625: 10,250/2,073,112 pixels, 0.494426 percent. Every rest view is
below 0.5 percent. All 72 glide label boxes and stroke widths are identical
to their baseline measurements (0 px maximum delta).

Inspected the amplified difference locations and the original/retained
Mohawk pair side by side at reading scale. The largest rest count is mainly
tiny rounding along the lower UI/paint edges; it does not form a visible
changed shape in the unamplified pair. Typography, card structure, shield,
tail, thin line work, spacing and image treatment remain visually the same.
The pair is mohawk-before-after.png in the run folder (original left).
All raw counts, bounds, JSON geometry and PNG differences remain available;
no nonzero pixels were discarded to obtain a pass.

The 12 glide times cover 300, 600, 900, 1200, 1500, 1800, 2100, 2400,
2700, 3000, 3300 and 3600 ms on the fake clock. This is sampled evidence,
not proof about every displayed frame on a phone. Node motion/replay and
reduced-motion checks pass; reduced motion has no separate raster baseline.

## Final blank-frame samples and completion

All ten scenarios were captured separately on each packed page at the phone
emulation. Standalone: 0 candidates / 1,367 PNG captures. Joined: 0 / 1,510.
The classifier found no middle frame with less than half the neighboring
neutral line work. Screencast can omit displayed frames, so this is zero
sampled candidates, not a certification of every physical display frame.
The initial baseline was timing-only: before blank counts are NOT MEASURED,
not zero. The separate final capture timing includes screenshot overhead;
its 116.7 ms pinch maxima are not substituted into the timing-only table.

The report/evidence validator passes trace-total consistency and isolated
rest-pixel/glide-geometry gates, and explicitly prints FAIL for the phone
timing/layout target. Both packed pages and joined.html were produced only
by the original pack tools. The task's headless Edge was closed through CDP;
all per-run targets, loopback servers and sockets close in their tools.

## Command output

Initial node tools/pack.mjs: exit 0.

```text
packed data.mjs, art.mjs, trip.mjs, depth.mjs, stars.mjs, pace.mjs, timeline.mjs, findkit.mjs, explore.mjs, steps.mjs, cards.mjs, footname.mjs, footer.mjs, findhoards.mjs, findcreatures.mjs, findsheets.mjs, hammer.mjs, findhammer.mjs, findwater.mjs, findhorn.mjs, findall.mjs, finds.mjs, main.mjs
dist/journey-map.html 656.1 KB
```

Initial node tools/pack-joined.mjs: exit 0.

```text
joined.html written
map modules: data.mjs, art.mjs, trip.mjs, depth.mjs, stars.mjs, pace.mjs, timeline.mjs, findkit.mjs, explore.mjs, steps.mjs, cards.mjs, footname.mjs, footer.mjs, findhoards.mjs, findcreatures.mjs, findsheets.mjs, hammer.mjs, findhammer.mjs, findwater.mjs, findhorn.mjs, findall.mjs, finds.mjs, main.mjs, join.mjs
dist/journey-joined.html 1195.1 KB
```

### pack: node tools/pack.mjs

Exit 0.

```text
packed data.mjs, art.mjs, trip.mjs, depth.mjs, stars.mjs, pace.mjs, timeline.mjs, findkit.mjs, explore.mjs, steps.mjs, cards.mjs, footname.mjs, footer.mjs, findhoards.mjs, findcreatures.mjs, findsheets.mjs, hammer.mjs, findhammer.mjs, findwater.mjs, findhorn.mjs, findall.mjs, finds.mjs, main.mjs
dist/journey-map.html 658.1 KB
```

### pack: node tools/pack-joined.mjs

Exit 0.

```text
joined.html written
map modules: data.mjs, art.mjs, trip.mjs, depth.mjs, stars.mjs, pace.mjs, timeline.mjs, findkit.mjs, explore.mjs, steps.mjs, cards.mjs, footname.mjs, footer.mjs, findhoards.mjs, findcreatures.mjs, findsheets.mjs, hammer.mjs, findhammer.mjs, findwater.mjs, findhorn.mjs, findall.mjs, finds.mjs, main.mjs, join.mjs
dist/journey-joined.html 1197.2 KB
```

### writes: node tools/frame-cost.mjs --cdp ws://127.0.0.1:55020/devtools/browser/22bdeafe-8624-4f46-b421-225503cac1b4 --out C:\Users\Admin\Documents\Portfolio\journey-map-runs\glide\writes-timing --passes timing

Exit 0.

```text
browser: Edg/158.0.4370.33; 412x730; DPR 2.625; touch true; CPU x4
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 134 | 20.80 | 62.50 | 95.90 | 17 | 0 | 7.31 | 4.47 | 2.30 | 2.16 | 3.04 | 0.61 | 5.93 | 0.61 | 1.62 | 7 / 92.00 | N/A |
| fling + glide timing | 122 | 16.70 | 25.10 | 54.20 | 2 | 0 | 6.14 | 1.06 | 0.42 | 0.64 | 2.69 | 0.40 | 6.74 | 0.46 | 0.48 | 1 / 50.00 | N/A |
| wayfinder / one turn in 1.5 s timing | 173 | 16.70 | 25.00 | 33.30 | 1 | 0 | 5.40 | 0.49 | 0.29 | 0.21 | 2.55 | 0.33 | 6.26 | 0.45 | 0.33 | 0 / 0.00 | N/A |
| slow pan with glow timing | 191 | 16.70 | 25.10 | 62.60 | 3 | 0 | 5.97 | 0.97 | 0.31 | 0.66 | 2.97 | 0.36 | 6.64 | 0.56 | 0.42 | 1 / 53.00 | N/A |
| stop glide timing | 80 | 62.50 | 70.90 | 79.10 | 78 | 0 | 8.09 | 37.03 | 35.48 | 1.56 | 5.29 | 2.67 | 5.09 | 0.67 | 6.62 | 72 / 86.00 | N/A |
| rush into blast timing | 283 | 12.60 | 66.60 | 83.40 | 57 | 0 | 7.46 | 7.40 | 6.71 | 0.69 | 2.10 | 0.82 | 2.83 | 0.49 | 0.97 | 45 / 82.00 | N/A |
| map -> Laurier timing | 83 | 50.10 | 71.00 | 83.40 | 80 | 0 | 7.46 | 31.06 | 29.88 | 1.18 | 4.77 | 2.57 | 5.43 | 0.68 | 6.08 | 48 / 76.00 | N/A |
| Laurier -> HMC timing | 85 | 54.20 | 75.10 | 91.70 | 79 | 0 | 6.64 | 33.85 | 32.43 | 1.42 | 5.22 | 2.33 | 4.57 | 0.57 | 5.73 | 48 / 91.00 | N/A |
| HMC again -> Interkom timing | 76 | 50.00 | 70.90 | 79.40 | 65 | 0 | 5.67 | 30.48 | 29.25 | 1.23 | 4.26 | 1.98 | 4.19 | 0.52 | 3.59 | 30 / 74.00 | N/A |
| Interkom -> HMC again / Back timing | 74 | 54.20 | 70.90 | 79.30 | 63 | 0 | 6.10 | 34.61 | 33.25 | 1.36 | 4.61 | 2.17 | 4.41 | 0.53 | 3.76 | 47 / 79.00 | N/A |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 133 | 20.90 | 66.70 | 116.80 | 20 | 1 | 6.67 | 5.68 | 3.04 | 2.63 | 4.04 | 0.77 | 6.49 | 0.69 | 2.01 | 9 / 111.00 | N/A |
| fling + glide timing | 134 | 16.70 | 20.90 | 54.20 | 2 | 0 | 4.55 | 1.03 | 0.42 | 0.62 | 3.03 | 0.38 | 6.49 | 0.45 | 0.45 | 1 / 53.00 | N/A |
| wayfinder / one turn in 1.5 s timing | 163 | 16.70 | 25.10 | 37.50 | 4 | 0 | 4.91 | 0.67 | 0.39 | 0.28 | 3.52 | 0.42 | 7.14 | 0.56 | 0.39 | 0 / 0.00 | N/A |
| slow pan with glow timing | 139 | 25.10 | 37.50 | 75.00 | 18 | 0 | 7.42 | 1.76 | 0.62 | 1.14 | 5.20 | 0.70 | 8.67 | 0.94 | 0.67 | 1 / 64.00 | N/A |
| stop glide timing | 68 | 70.90 | 95.80 | 116.70 | 67 | 1 | 9.05 | 44.33 | 42.26 | 2.07 | 7.18 | 3.16 | 5.98 | 0.91 | 7.55 | 60 / 113.00 | N/A |
| rush into blast timing | 314 | 12.40 | 75.00 | 83.40 | 53 | 0 | 5.79 | 7.13 | 6.37 | 0.76 | 2.41 | 0.87 | 2.77 | 0.50 | 0.93 | 44 / 81.00 | N/A |
| map -> Laurier timing | 79 | 66.70 | 91.70 | 99.80 | 78 | 0 | 8.67 | 40.90 | 39.19 | 1.71 | 6.70 | 2.99 | 5.98 | 0.95 | 6.84 | 75 / 101.00 | N/A |
| Laurier -> HMC timing | 82 | 66.70 | 87.50 | 91.80 | 80 | 0 | 7.53 | 41.17 | 39.45 | 1.73 | 6.31 | 2.77 | 5.33 | 0.75 | 6.30 | 74 / 90.00 | N/A |
| HMC again -> Interkom timing | 70 | 62.40 | 75.10 | 79.20 | 69 | 0 | 6.49 | 37.73 | 36.24 | 1.50 | 5.06 | 2.49 | 4.85 | 0.68 | 4.14 | 59 / 77.00 | N/A |
| Interkom -> HMC again / Back timing | 72 | 62.50 | 87.60 | 91.70 | 67 | 0 | 6.61 | 40.32 | 38.70 | 1.62 | 6.29 | 2.70 | 5.22 | 0.71 | 4.26 | 61 / 90.00 | N/A |
```

### suite: node tools/check.mjs

Exit 0.

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 15.87 KB / 30; all map modules + CSS 157.75 KB / 160
gzip: dist/journey-map.html 274.43 KB / 320
gzip: dist/journey-joined.html 494.49 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

### suite: node tools/steps-test.mjs

Exit 1.

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
file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/steps-test.mjs:11
const stepAssert = (condition, message) => { if (!condition) throw new Error(message); };
                                                                   ^

Error: opening must never fade the shield
    at stepAssert (file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/steps-test.mjs:11:68)
    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/steps-test.mjs:146:5
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v26.7.0
```

### suite: node tools/nova-test.mjs

Exit 0.

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is omitted in reduced motion
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 standalone: added 122; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 standalone 1.00s: 281.88 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.00s: 874.78 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.50s: 1046.42 px/s, 157/168 on way
WHIRL 1440x900 standalone 2.90s: 1084.53 px/s, 52/168 on way
WHIRL 1440x900 standalone 2.98s: 1179.19 px/s, 31/168 on way
WHIRL 1440x900 standalone: minimum 281.88 px/s vs 281.88 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 standalone: added 77; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 standalone 1.00s: 137.00 px/s, 96/96 on way
WHIRL 412x730 standalone 2.00s: 401.37 px/s, 96/96 on way
WHIRL 412x730 standalone 2.50s: 493.78 px/s, 90/96 on way
WHIRL 412x730 standalone 2.90s: 450.69 px/s, 30/96 on way
WHIRL 412x730 standalone 2.98s: 538.38 px/s, 18/96 on way
WHIRL 412x730 standalone: minimum 137.00 px/s vs 137.00 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 standalone: added 69; trail 308/308; sea 112; coast-only reservation
WHIRL 390x844 standalone 1.00s: 147.64 px/s, 96/96 on way
WHIRL 390x844 standalone 2.00s: 391.88 px/s, 96/96 on way
WHIRL 390x844 standalone 2.50s: 482.95 px/s, 90/96 on way
WHIRL 390x844 standalone 2.90s: 490.81 px/s, 30/96 on way
WHIRL 390x844 standalone 2.98s: 616.53 px/s, 18/96 on way
WHIRL 390x844 standalone: minimum 147.64 px/s vs 147.64 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 standalone: added 77; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 standalone 1.00s: 118.79 px/s, 96/96 on way
WHIRL 360x640 standalone 2.00s: 346.47 px/s, 96/96 on way
WHIRL 360x640 standalone 2.50s: 419.09 px/s, 90/96 on way
WHIRL 360x640 standalone 2.90s: 438.57 px/s, 30/96 on way
WHIRL 360x640 standalone 2.98s: 513.24 px/s, 18/96 on way
WHIRL 360x640 standalone: minimum 118.79 px/s vs 118.79 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 joined 1200: added 5; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 joined 1.00s: 332.93 px/s, 168/168 on way
WHIRL 1440x900 joined 2.00s: 1015.17 px/s, 168/168 on way
WHIRL 1440x900 joined 2.50s: 1234.84 px/s, 157/168 on way
WHIRL 1440x900 joined 2.90s: 1221.50 px/s, 52/168 on way
WHIRL 1440x900 joined 2.98s: 1365.68 px/s, 31/168 on way
WHIRL 1440x900 joined: minimum 332.93 px/s vs 332.93 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 joined 278: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 joined 278: added 79; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 joined 1.00s: 121.72 px/s, 96/96 on way
WHIRL 412x730 joined 2.00s: 371.05 px/s, 96/96 on way
WHIRL 412x730 joined 2.50s: 460.94 px/s, 90/96 on way
WHIRL 412x730 joined 2.90s: 523.11 px/s, 30/96 on way
WHIRL 412x730 joined 2.98s: 604.58 px/s, 18/96 on way
WHIRL 412x730 joined: minimum 121.72 px/s vs 121.72 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 305: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 305: added 70; trail 308/308; sea 112; coast-only reservation
WHIRL 390x844 joined 1.00s: 143.40 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 366.92 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 445.99 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 521.10 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 574.14 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 143.40 px/s vs 143.40 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 joined 213: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 joined 213: added 79; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 joined 1.00s: 106.87 px/s, 96/96 on way
WHIRL 360x640 joined 2.00s: 330.25 px/s, 96/96 on way
WHIRL 360x640 joined 2.50s: 409.63 px/s, 90/96 on way
WHIRL 360x640 joined 2.90s: 445.43 px/s, 30/96 on way
WHIRL 360x640 joined 2.98s: 520.58 px/s, 18/96 on way
WHIRL 360x640 joined: minimum 106.87 px/s vs 106.87 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 240: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 240: added 71; trail 308/308; sea 112; coast-only reservation
WHIRL 390x844 joined 1.00s: 146.30 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 365.94 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 442.64 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 491.47 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 569.78 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 146.30 px/s vs 146.30 at 1s; minimum on way 17.71%; last 3.000000s
ok: WHIRL balanced visible sectors, own-side ring approach, continuous drain through last frame, speed/5%/last-arrival gates and rising late heat/core/glow alpha
ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged
```

### suite: node tools/depth-test.mjs

Exit 0.

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

### suite: node tools/layout-test.mjs

Exit 0.

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

### suite: node tools/explore-test.mjs

Exit 0.

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

### suite: node tools/finds-test.mjs

Exit 0.

```text
ok: C1 ring sea baseline; original fill/coast lengths and hashes unchanged
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
ok: C2 ravens (tree drawn first, opaque birds, one drawing each, flights out of frame and back, facing, landing, reel and its kept items, epoch, shy hop, hear loop; outlines at least 1.32 units apart, largest pose step 7.78) and chests (staged dig, rattle, back lid, craft light, hints, kept popup): 1440x900: 1266 raven ticks; 390x844: 1266 raven ticks
ok: D2 falling quills fit one third of an open wing, stay behind takeoff/clear the other bird and expire by .8 s; 16 ms lid steps <=25 degrees, gentle start, .5 s peak, <=8 degree overshoot
ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast (9638 writes)
ok: reduced-motion serpent consumes leaves immediately with no swell; no shy hop; all tree actors stay still on hear
ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
ok: footer name layout reads 85 total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: {"resize":17,"fonts":17,"settle-end":17,"explore":34}
ok: actual timeline Home and End handlers select first and last stops
```

### suite: node tools/motion-test.mjs

Exit 1.

```text
file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/steps.mjs:86
  if (back.getAttribute('aria-label') !== label) back.setAttribute('aria-label', label);
           ^

TypeError: back.getAttribute is not a function
    at stepsButtons (file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/steps.mjs:86:12)
    at stepsArrive (file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/steps.mjs:116:3)
    at stepsBuild (file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/steps.mjs:385:19)
    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/motion-test.mjs:30:1
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v26.7.0
```

### suite: node tools/hammer-test.mjs

Exit 0.

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
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00074 ms/step; 2.3s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

### suite: node tools/frame-cost-test.mjs

Exit 0.

```text
ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature
ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work
```

### suite: node tools/frame-performance-test.mjs

Exit 0.

```text
AFTER 412x730 / 72 moving frames: #cam writes 0; label writes 0; recovery 8 frames / 133.3 ms
ok: compositor/virtual camera agree within original matrix rounding; one settle commit; rest label scales unchanged; interrupted zoom, resize/exit cleanup and zero idle writes
```

### suite: node tools/frame-render-test.mjs

Exit 0.

```text
phone explore zoom 1: scratch pixels cleared 3609120 -> 871895 (75.8% less); same drawing commands
phone explore zoom 2: scratch pixels cleared 3609120 -> 1037640 (71.2% less); same drawing commands
phone explore zoom 3: scratch pixels cleared 3609120 -> 760250 (78.9% less); same drawing commands
ok: 21 desktop/phone/1200-star WHIRL2 drawing-command snapshots; original blast primitives pinned by whirl2-test; not a pixel comparison
```

### pack: node tools/pack.mjs

Exit 0.

```text
packed data.mjs, art.mjs, trip.mjs, depth.mjs, stars.mjs, pace.mjs, timeline.mjs, findkit.mjs, explore.mjs, steps.mjs, cards.mjs, footname.mjs, footer.mjs, findhoards.mjs, findcreatures.mjs, findsheets.mjs, hammer.mjs, findhammer.mjs, findwater.mjs, findhorn.mjs, findall.mjs, finds.mjs, main.mjs
dist/journey-map.html 658.2 KB
```

### pack: node tools/pack-joined.mjs

Exit 0.

```text
joined.html written
map modules: data.mjs, art.mjs, trip.mjs, depth.mjs, stars.mjs, pace.mjs, timeline.mjs, findkit.mjs, explore.mjs, steps.mjs, cards.mjs, footname.mjs, footer.mjs, findhoards.mjs, findcreatures.mjs, findsheets.mjs, hammer.mjs, findhammer.mjs, findwater.mjs, findhorn.mjs, findall.mjs, finds.mjs, main.mjs, join.mjs
dist/journey-joined.html 1197.2 KB
```

### visual-writes: node tools/glide-visual-test.mjs --cdp ws://127.0.0.1:55020/devtools/browser/22bdeafe-8624-4f46-b421-225503cac1b4 --out C:\Users\Admin\Documents\Portfolio\journey-map-runs\glide\writes-visual --compare C:\Users\Admin\Documents\Portfolio\journey-map-runs\glide\before

Exit 1.

```text
{"name":"412x730x2.625-journey-map-glide-0900","changed":49121,"total":2073112,"percent":2.3694330069962453,"bounds":[0,24,1081,1779],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-0600","changed":44585,"total":2073112,"percent":2.1506315143610184,"bounds":[0,24,1081,1778],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-1800","changed":102126,"total":2073112,"percent":4.926217203894435,"bounds":[0,24,1081,1778],"labelMax":0,"strokeMax":0,"geometry":true}
{"captures":264,"changed":34,"maxPercent":4.926217203894435,"labelMax":0.0468597412109375,"strokeMax":0}
```

### visual-control: node tools/glide-visual-test.mjs --cdp ws://127.0.0.1:55020/devtools/browser/22bdeafe-8624-4f46-b421-225503cac1b4 --out C:\Users\Admin\Documents\Portfolio\journey-map-runs\glide\control --sizes 412x730x2.625 --plan glides --default-text yes --compare C:\Users\Admin\Documents\Portfolio\journey-map-runs\glide\writes-visual

Exit 1.

```text
{"name":"412x730x2.625-journey-map-glide-0300","stable":true,"changed":43251,"total":2073112,"percent":2.086283809075438,"bounds":[0,24,1081,1778],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-0600","stable":true,"changed":44206,"total":2073112,"percent":2.1323498199807824,"bounds":[0,24,1081,1778],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-1200","stable":false,"changed":102014,"total":2073112,"percent":4.920814697903442,"bounds":[0,24,1081,1778],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-1500","stable":true,"changed":108419,"total":2073112,"percent":5.229770509263369,"bounds":[0,232,1081,1779],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-1800","stable":true,"changed":101747,"total":2073112,"percent":4.907935509514199,"bounds":[0,24,1081,1778],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-2100","stable":true,"changed":102053,"total":2073112,"percent":4.922695927668163,"bounds":[0,24,1081,1779],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-2400","stable":true,"changed":108889,"total":2073112,"percent":5.252441739761286,"bounds":[0,24,1081,1778],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-2700","stable":true,"changed":99100,"total":2073112,"percent":4.780253068816349,"bounds":[0,24,1081,1779],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-3000","stable":true,"changed":98201,"total":2073112,"percent":4.736888310906502,"bounds":[0,24,1081,1779],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-3300","stable":true,"changed":98616,"total":2073112,"percent":4.7569065250695575,"bounds":[0,24,1081,1778],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-3600","stable":true,"changed":130569,"total":2073112,"percent":6.298212542303551,"bounds":[0,24,1081,1778],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-0600","stable":false,"changed":44585,"total":2073112,"percent":2.1506315143610184,"bounds":[0,24,1081,1778],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-0900","stable":false,"changed":49462,"total":2073112,"percent":2.3858817082723944,"bounds":[0,24,1081,1779],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-1200","stable":false,"changed":102292,"total":2073112,"percent":4.934224489559657,"bounds":[0,24,1081,1778],"labelMax":0.0468597412109375,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-1500","stable":true,"changed":108798,"total":2073112,"percent":5.248052203643605,"bounds":[0,232,1081,1779],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-2100","stable":false,"changed":102437,"total":2073112,"percent":4.941218805351568,"bounds":[0,24,1081,1779],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-2400","stable":true,"changed":109268,"total":2073112,"percent":5.270723434141523,"bounds":[0,24,1081,1778],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-2700","stable":true,"changed":99477,"total":2073112,"percent":4.798438289875318,"bounds":[0,24,1081,1779],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-3000","stable":true,"changed":98358,"total":2073112,"percent":4.74446146662602,"bounds":[0,24,1081,1779],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-3300","stable":true,"changed":98550,"total":2073112,"percent":4.753722905467722,"bounds":[0,24,1081,1778],"labelMax":0,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-3600","stable":true,"changed":129699,"total":2073112,"percent":6.256246647552086,"bounds":[0,24,1081,1778],"labelMax":0,"strokeMax":0,"geometry":true}
{"captures":24,"changed":22,"maxPercent":6.298212542303551,"labelMax":0.0468597412109375,"strokeMax":0}
```

### precision: node tools/frame-cost.mjs --cdp ws://127.0.0.1:55020/devtools/browser/22bdeafe-8624-4f46-b421-225503cac1b4 --out C:\Users\Admin\Documents\Portfolio\journey-map-runs\glide\precision-timing --passes timing

Exit 0.

```text
browser: Edg/158.0.4370.33; 412x730; DPR 2.625; touch true; CPU x4
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 115 | 25.00 | 66.60 | 83.30 | 27 | 0 | 10.20 | 4.57 | 1.40 | 3.16 | 4.64 | 0.89 | 6.57 | 0.88 | 2.18 | 11 / 65.00 | N/A |
| fling + glide timing | 135 | 16.60 | 25.00 | 54.20 | 2 | 0 | 6.16 | 0.94 | 0.38 | 0.55 | 2.41 | 0.35 | 5.12 | 0.42 | 0.60 | 1 / 53.00 | N/A |
| wayfinder / one turn in 1.5 s timing | 186 | 16.60 | 24.90 | 29.20 | 0 | 0 | 5.47 | 0.50 | 0.30 | 0.21 | 2.58 | 0.33 | 5.05 | 0.47 | 0.31 | 0 / 0.00 | N/A |
| slow pan with glow timing | 194 | 16.70 | 25.10 | 58.40 | 5 | 0 | 6.46 | 1.07 | 0.35 | 0.72 | 3.13 | 0.38 | 5.37 | 0.64 | 0.51 | 1 / 56.00 | N/A |
| stop glide timing | 171 | 29.30 | 41.70 | 54.20 | 84 | 0 | 7.39 | 6.46 | 5.14 | 1.32 | 4.89 | 2.09 | 5.50 | 0.56 | 6.91 | 0 / 0.00 | N/A |
| rush into blast timing | 398 | 12.50 | 33.40 | 49.90 | 38 | 0 | 7.15 | 2.34 | 1.72 | 0.62 | 1.78 | 0.81 | 2.57 | 0.46 | 1.46 | 0 / 0.00 | N/A |
| map -> Laurier timing | 110 | 33.40 | 45.80 | 46.00 | 93 | 0 | 8.98 | 9.21 | 7.62 | 1.59 | 6.08 | 2.75 | 5.93 | 0.81 | 8.77 | 0 / 0.00 | N/A |
| Laurier -> HMC timing | 138 | 29.10 | 37.60 | 41.80 | 45 | 0 | 6.87 | 7.63 | 6.05 | 1.58 | 5.22 | 2.26 | 4.67 | 0.59 | 8.21 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 115 | 29.20 | 37.50 | 37.50 | 30 | 0 | 6.92 | 7.77 | 6.20 | 1.57 | 5.13 | 2.30 | 4.84 | 0.62 | 5.51 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 136 | 25.00 | 33.40 | 41.80 | 18 | 0 | 5.76 | 6.43 | 5.15 | 1.28 | 4.16 | 2.05 | 4.36 | 0.51 | 4.82 | 0 / 0.00 | N/A |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 163 | 16.60 | 45.70 | 62.60 | 13 | 0 | 4.94 | 2.67 | 0.85 | 1.82 | 2.87 | 0.51 | 4.68 | 0.53 | 1.67 | 2 / 52.00 | N/A |
| fling + glide timing | 151 | 12.50 | 20.90 | 37.60 | 2 | 0 | 4.46 | 1.12 | 0.35 | 0.78 | 2.09 | 0.35 | 4.53 | 0.43 | 0.57 | 0 / 0.00 | N/A |
| wayfinder / one turn in 1.5 s timing | 224 | 12.50 | 16.70 | 25.10 | 0 | 0 | 3.46 | 0.43 | 0.26 | 0.17 | 2.22 | 0.28 | 4.46 | 0.40 | 0.27 | 0 / 0.00 | N/A |
| slow pan with glow timing | 269 | 12.50 | 20.70 | 45.90 | 3 | 0 | 3.73 | 0.81 | 0.26 | 0.55 | 2.32 | 0.30 | 4.46 | 0.50 | 0.38 | 0 / 0.00 | N/A |
| stop glide timing | 265 | 20.80 | 25.10 | 37.50 | 5 | 0 | 4.12 | 4.37 | 3.47 | 0.90 | 2.99 | 1.43 | 3.99 | 0.37 | 5.92 | 0 / 0.00 | N/A |
| rush into blast timing | 553 | 8.40 | 25.00 | 37.60 | 4 | 0 | 4.30 | 1.72 | 1.24 | 0.48 | 1.34 | 0.61 | 2.10 | 0.35 | 1.13 | 0 / 0.00 | N/A |
| map -> Laurier timing | 119 | 33.30 | 41.70 | 41.80 | 80 | 0 | 7.39 | 8.67 | 7.08 | 1.59 | 6.08 | 2.49 | 5.56 | 0.78 | 8.30 | 0 / 0.00 | N/A |
| Laurier -> HMC timing | 184 | 20.90 | 29.10 | 33.30 | 3 | 0 | 4.71 | 5.70 | 4.52 | 1.18 | 3.63 | 1.83 | 4.00 | 0.42 | 7.22 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 160 | 20.80 | 25.10 | 37.50 | 2 | 0 | 4.47 | 5.63 | 4.51 | 1.12 | 3.47 | 1.82 | 4.07 | 0.42 | 4.76 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 155 | 20.90 | 29.20 | 37.50 | 5 | 0 | 4.61 | 5.77 | 4.61 | 1.16 | 3.65 | 1.87 | 4.13 | 0.45 | 4.65 | 0 / 0.00 | N/A |
```

### pack: node tools/pack.mjs

Exit 0.

```text
packed data.mjs, art.mjs, trip.mjs, depth.mjs, stars.mjs, pace.mjs, timeline.mjs, findkit.mjs, explore.mjs, steps.mjs, cards.mjs, footname.mjs, footer.mjs, findhoards.mjs, findcreatures.mjs, findsheets.mjs, hammer.mjs, findhammer.mjs, findwater.mjs, findhorn.mjs, findall.mjs, finds.mjs, main.mjs
dist/journey-map.html 658.6 KB
```

### pack: node tools/pack-joined.mjs

Exit 0.

```text
joined.html written
map modules: data.mjs, art.mjs, trip.mjs, depth.mjs, stars.mjs, pace.mjs, timeline.mjs, findkit.mjs, explore.mjs, steps.mjs, cards.mjs, footname.mjs, footer.mjs, findhoards.mjs, findcreatures.mjs, findsheets.mjs, hammer.mjs, findhammer.mjs, findwater.mjs, findhorn.mjs, findall.mjs, finds.mjs, main.mjs, join.mjs
dist/journey-joined.html 1197.6 KB
```

### suite: node tools/check.mjs

Exit 0.

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 15.88 KB / 30; all map modules + CSS 157.89 KB / 160
gzip: dist/journey-map.html 274.49 KB / 320
gzip: dist/journey-joined.html 494.55 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

### suite: node tools/steps-test.mjs

Exit 0.

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

### suite: node tools/nova-test.mjs

Exit 0.

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is omitted in reduced motion
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 standalone: added 122; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 standalone 1.00s: 281.88 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.00s: 874.78 px/s, 168/168 on way
WHIRL 1440x900 standalone 2.50s: 1046.42 px/s, 157/168 on way
WHIRL 1440x900 standalone 2.90s: 1084.53 px/s, 52/168 on way
WHIRL 1440x900 standalone 2.98s: 1179.19 px/s, 31/168 on way
WHIRL 1440x900 standalone: minimum 281.88 px/s vs 281.88 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 standalone: added 77; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 standalone 1.00s: 137.00 px/s, 96/96 on way
WHIRL 412x730 standalone 2.00s: 401.37 px/s, 96/96 on way
WHIRL 412x730 standalone 2.50s: 493.78 px/s, 90/96 on way
WHIRL 412x730 standalone 2.90s: 450.69 px/s, 30/96 on way
WHIRL 412x730 standalone 2.98s: 538.38 px/s, 18/96 on way
WHIRL 412x730 standalone: minimum 137.00 px/s vs 137.00 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 standalone: added 69; trail 308/308; sea 112; coast-only reservation
WHIRL 390x844 standalone 1.00s: 147.64 px/s, 96/96 on way
WHIRL 390x844 standalone 2.00s: 391.88 px/s, 96/96 on way
WHIRL 390x844 standalone 2.50s: 482.95 px/s, 90/96 on way
WHIRL 390x844 standalone 2.90s: 490.81 px/s, 30/96 on way
WHIRL 390x844 standalone 2.98s: 616.53 px/s, 18/96 on way
WHIRL 390x844 standalone: minimum 147.64 px/s vs 147.64 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 standalone: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 standalone: added 77; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 standalone 1.00s: 118.79 px/s, 96/96 on way
WHIRL 360x640 standalone 2.00s: 346.47 px/s, 96/96 on way
WHIRL 360x640 standalone 2.50s: 419.09 px/s, 90/96 on way
WHIRL 360x640 standalone 2.90s: 438.57 px/s, 30/96 on way
WHIRL 360x640 standalone 2.98s: 513.24 px/s, 18/96 on way
WHIRL 360x640 standalone: minimum 118.79 px/s vs 118.79 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL2 1440x900 joined 1200: added 5; trail 308/308; sea 112; coast-only reservation
WHIRL 1440x900 joined 1.00s: 332.93 px/s, 168/168 on way
WHIRL 1440x900 joined 2.00s: 1015.17 px/s, 168/168 on way
WHIRL 1440x900 joined 2.50s: 1234.84 px/s, 157/168 on way
WHIRL 1440x900 joined 2.90s: 1221.50 px/s, 52/168 on way
WHIRL 1440x900 joined 2.98s: 1365.68 px/s, 31/168 on way
WHIRL 1440x900 joined: minimum 332.93 px/s vs 332.93 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 412x730 joined 278: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 412x730 joined 278: added 79; trail 308/308; sea 112; coast-only reservation
WHIRL 412x730 joined 1.00s: 121.72 px/s, 96/96 on way
WHIRL 412x730 joined 2.00s: 371.05 px/s, 96/96 on way
WHIRL 412x730 joined 2.50s: 460.94 px/s, 90/96 on way
WHIRL 412x730 joined 2.90s: 523.11 px/s, 30/96 on way
WHIRL 412x730 joined 2.98s: 604.58 px/s, 18/96 on way
WHIRL 412x730 joined: minimum 121.72 px/s vs 121.72 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 305: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 305: added 70; trail 308/308; sea 112; coast-only reservation
WHIRL 390x844 joined 1.00s: 143.40 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 366.92 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 445.99 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 521.10 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 574.14 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 143.40 px/s vs 143.40 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 360x640 joined 213: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 360x640 joined 213: added 79; trail 308/308; sea 112; coast-only reservation
WHIRL 360x640 joined 1.00s: 106.87 px/s, 96/96 on way
WHIRL 360x640 joined 2.00s: 330.25 px/s, 96/96 on way
WHIRL 360x640 joined 2.50s: 409.63 px/s, 90/96 on way
WHIRL 360x640 joined 2.90s: 445.43 px/s, 30/96 on way
WHIRL 360x640 joined 2.98s: 520.58 px/s, 18/96 on way
WHIRL 360x640 joined: minimum 106.87 px/s vs 106.87 at 1s; minimum on way 17.71%; last 3.000000s
WHIRL 390x844 joined 240: sectors 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8; 96 gathering
WHIRL2 390x844 joined 240: added 71; trail 308/308; sea 112; coast-only reservation
WHIRL 390x844 joined 1.00s: 146.30 px/s, 96/96 on way
WHIRL 390x844 joined 2.00s: 365.94 px/s, 96/96 on way
WHIRL 390x844 joined 2.50s: 442.64 px/s, 90/96 on way
WHIRL 390x844 joined 2.90s: 491.47 px/s, 30/96 on way
WHIRL 390x844 joined 2.98s: 569.78 px/s, 18/96 on way
WHIRL 390x844 joined: minimum 146.30 px/s vs 146.30 at 1s; minimum on way 17.71%; last 3.000000s
ok: WHIRL balanced visible sectors, own-side ring approach, continuous drain through last frame, speed/5%/last-arrival gates and rising late heat/core/glow alpha
ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged
```

### suite: node tools/depth-test.mjs

Exit 0.

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

### suite: node tools/layout-test.mjs

Exit 0.

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

### suite: node tools/explore-test.mjs

Exit 0.

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

### suite: node tools/finds-test.mjs

Exit 0.

```text
ok: C1 ring sea baseline; original fill/coast lengths and hashes unchanged
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
ok: C2 ravens (tree drawn first, opaque birds, one drawing each, flights out of frame and back, facing, landing, reel and its kept items, epoch, shy hop, hear loop; outlines at least 1.32 units apart, largest pose step 7.78) and chests (staged dig, rattle, back lid, craft light, hints, kept popup): 1440x900: 1266 raven ticks; 390x844: 1266 raven ticks
ok: D2 falling quills fit one third of an open wing, stay behind takeoff/clear the other bird and expire by .8 s; 16 ms lid steps <=25 degrees, gentle start, .5 s peak, <=8 degree overshoot
ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast (9638 writes)
ok: reduced-motion serpent consumes leaves immediately with no swell; no shy hop; all tree actors stay still on hear
ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
ok: footer name layout reads 85 total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: {"resize":17,"fonts":17,"settle-end":17,"explore":34}
ok: actual timeline Home and End handlers select first and last stops
```

### suite: node tools/motion-test.mjs

Exit 0.

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

### suite: node tools/hammer-test.mjs

Exit 0.

```text
ok: D3 foe heights incl stroke: giants/chief 16, hunched draugr 11, low full-width wolf 8; wave 1 varies; five overlapping shields span each unchanged segment
ok: original Norse foe silhouettes and their strokes fit unchanged hit boxes
ok: identical seeds and inputs match step for step
ok: 350 seeded formations/bosses fit their wave rows; unique fates; clay at 60%, heart at 30%
ok: 34 per-level rune effect checks; excluded runes absent
ok: cold includes both flights and glove; heat splits twice; draugr rises once; need multiplies the return upgrade; exposed stone heart doubles a hit
ok: return/catch, first-hit memory, shields, bridge loss; pool sizes and identities unchanged after 10,000 steps
steady: 200 seeds; wave 4 74.0%; wins 17.5%; ended by wave 3 26.0%; longest 223.6s; 0.00091 ms/step; 2.0s wall
ends {"6:bridge":6,"7:won":35,"5:bridge":10,"3:hearts":35,"5:hearts":42,"6:hearts":14,"4:hearts":28,"4:bridge":8,"2:hearts":12,"3:bridge":3,"7:hearts":5,"2:bridge":1,"1:hearts":1}
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00078 ms/step; 2.4s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

### suite: node tools/frame-cost-test.mjs

Exit 0.

```text
ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature
ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work
```

### suite: node tools/frame-performance-test.mjs

Exit 0.

```text
AFTER 412x730 / 72 moving frames: #cam writes 0; label writes 0; recovery 8 frames / 133.3 ms
ok: compositor/virtual camera agree within original matrix rounding; one settle commit; rest label scales unchanged; interrupted zoom, resize/exit cleanup and zero idle writes
```

### suite: node tools/frame-render-test.mjs

Exit 0.

```text
phone explore zoom 1: scratch pixels cleared 3609120 -> 871895 (75.8% less); same drawing commands
phone explore zoom 2: scratch pixels cleared 3609120 -> 1037640 (71.2% less); same drawing commands
phone explore zoom 3: scratch pixels cleared 3609120 -> 760250 (78.9% less); same drawing commands
ok: 21 desktop/phone/1200-star WHIRL2 drawing-command snapshots; original blast primitives pinned by whirl2-test; not a pixel comparison
```

### visual-final: node tools/glide-visual-test.mjs --cdp ws://127.0.0.1:55020/devtools/browser/22bdeafe-8624-4f46-b421-225503cac1b4 --out C:\Users\Admin\Documents\Portfolio\journey-map-runs\glide\precision-visual --compare C:\Users\Admin\Documents\Portfolio\journey-map-runs\glide\before

Exit 1.

```text
{"name":"1440x900x1-journey-map-glide-0300","stable":true,"changed":240,"total":1296000,"percent":0.018518518518518517,"bounds":[525,69,930,718],"labelMax":1.56085205078125,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-map-glide-0600","stable":true,"changed":1524,"total":1296000,"percent":0.1175925925925926,"bounds":[469,52,902,768],"labelMax":1.46112060546875,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-map-glide-0900","stable":true,"changed":1184,"total":1296000,"percent":0.09135802469135802,"bounds":[388,29,965,797],"labelMax":1.563201904296875,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-map-glide-1200","stable":true,"changed":2538,"total":1296000,"percent":0.19583333333333333,"bounds":[314,3,999,847],"labelMax":1.46783447265625,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-map-glide-1500","stable":true,"changed":2468,"total":1296000,"percent":0.1904320987654321,"bounds":[284,0,1016,821],"labelMax":2.6961669921875,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-map-glide-1800","stable":true,"changed":2288,"total":1296000,"percent":0.1765432098765432,"bounds":[205,0,1130,821],"labelMax":3.12005615234375,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-map-glide-2100","stable":true,"changed":2039,"total":1296000,"percent":0.15733024691358025,"bounds":[149,82,1218,826],"labelMax":3.61260986328125,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-map-glide-2400","stable":true,"changed":2296,"total":1296000,"percent":0.17716049382716048,"bounds":[98,90,1241,779],"labelMax":4.2711181640625,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-map-glide-2700","stable":true,"changed":3862,"total":1296000,"percent":0.29799382716049383,"bounds":[53,102,1358,844],"labelMax":4.87109375,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-map-glide-3000","stable":true,"changed":2483,"total":1296000,"percent":0.1915895061728395,"bounds":[229,132,1411,769],"labelMax":5.6732177734375,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-map-glide-3300","stable":true,"changed":2493,"total":1296000,"percent":0.19236111111111112,"bounds":[217,265,1264,600],"labelMax":6.1688232421875,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-map-glide-3600","stable":true,"changed":1672,"total":1296000,"percent":0.12901234567901235,"bounds":[213,4,1424,898],"labelMax":6.4462890625,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-joined-glide-0300","stable":true,"changed":240,"total":1296000,"percent":0.018518518518518517,"bounds":[525,69,930,718],"labelMax":1.56085205078125,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-joined-glide-0600","stable":true,"changed":1524,"total":1296000,"percent":0.1175925925925926,"bounds":[469,52,902,768],"labelMax":1.46112060546875,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-joined-glide-0900","stable":true,"changed":1184,"total":1296000,"percent":0.09135802469135802,"bounds":[388,29,965,797],"labelMax":1.563201904296875,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-joined-glide-1200","stable":true,"changed":2538,"total":1296000,"percent":0.19583333333333333,"bounds":[314,3,999,847],"labelMax":1.46783447265625,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-joined-glide-1500","stable":true,"changed":2468,"total":1296000,"percent":0.1904320987654321,"bounds":[284,0,1016,821],"labelMax":2.6961669921875,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-joined-glide-1800","stable":true,"changed":2288,"total":1296000,"percent":0.1765432098765432,"bounds":[205,0,1130,821],"labelMax":3.12005615234375,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-joined-glide-2100","stable":true,"changed":2041,"total":1296000,"percent":0.15748456790123458,"bounds":[149,82,1218,826],"labelMax":3.61260986328125,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-joined-glide-2400","stable":true,"changed":2296,"total":1296000,"percent":0.17716049382716048,"bounds":[98,90,1241,779],"labelMax":4.2711181640625,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-joined-glide-2700","stable":true,"changed":3862,"total":1296000,"percent":0.29799382716049383,"bounds":[53,102,1358,844],"labelMax":4.87109375,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-joined-glide-3000","stable":true,"changed":2483,"total":1296000,"percent":0.1915895061728395,"bounds":[229,132,1411,769],"labelMax":5.6732177734375,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-joined-glide-3300","stable":true,"changed":2493,"total":1296000,"percent":0.19236111111111112,"bounds":[217,265,1264,600],"labelMax":6.1688232421875,"strokeMax":0,"geometry":true}
{"name":"1440x900x1-journey-joined-glide-3600","stable":true,"changed":1672,"total":1296000,"percent":0.12901234567901235,"bounds":[213,4,1424,898],"labelMax":6.4462890625,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-map-explore","stable":true,"changed":10580,"total":300760,"percent":3.5177550206144437,"bounds":[15,13,396,595],"labelMax":1.831024169921875,"strokeMax":0,"geometry":false}
{"name":"412x730x1-journey-map-glide-0300","stable":true,"changed":1223,"total":300760,"percent":0.40663652081393803,"bounds":[44,61,375,578],"labelMax":1.46112060546875,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-map-glide-0600","stable":true,"changed":730,"total":300760,"percent":0.24271844660194172,"bounds":[47,54,399,610],"labelMax":1.867584228515625,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-map-glide-0900","stable":true,"changed":38,"total":300760,"percent":0.012634658864210665,"bounds":[35,43,394,562],"labelMax":1.548492431640625,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-map-glide-1200","stable":true,"changed":2296,"total":300760,"percent":0.7633993882165182,"bounds":[10,31,397,600],"labelMax":1.4610595703125,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-map-glide-1500","stable":true,"changed":1504,"total":300760,"percent":0.5000664982045485,"bounds":[1,32,407,544],"labelMax":1.48199462890625,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-map-glide-1800","stable":true,"changed":1634,"total":300760,"percent":0.5432903311610586,"bounds":[0,31,364,607],"labelMax":2.18096923828125,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-map-glide-2100","stable":true,"changed":716,"total":300760,"percent":0.23806357228354835,"bounds":[56,157,391,597],"labelMax":2.898162841796875,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-map-glide-2400","stable":true,"changed":735,"total":300760,"percent":0.2443809017156537,"bounds":[62,169,384,621],"labelMax":3.812255859375,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-map-glide-2700","stable":true,"changed":850,"total":300760,"percent":0.28261736933102805,"bounds":[72,187,376,601],"labelMax":4.617523193359375,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-map-glide-3000","stable":true,"changed":343,"total":300760,"percent":0.11404442080063838,"bounds":[82,208,229,384],"labelMax":5.28765869140625,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-map-glide-3300","stable":true,"changed":366,"total":300760,"percent":0.12169171432371326,"bounds":[100,234,262,425],"labelMax":5.4461669921875,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-map-glide-3600","stable":true,"changed":318,"total":300760,"percent":0.10573214523207873,"bounds":[109,256,283,462],"labelMax":6.17626953125,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-joined-explore","stable":true,"changed":10587,"total":300760,"percent":3.52008245777364,"bounds":[15,13,396,595],"labelMax":1.831024169921875,"strokeMax":0,"geometry":false}
{"name":"412x730x1-journey-joined-glide-0300","stable":true,"changed":1223,"total":300760,"percent":0.40663652081393803,"bounds":[44,61,375,578],"labelMax":1.46112060546875,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-joined-glide-0600","stable":true,"changed":730,"total":300760,"percent":0.24271844660194172,"bounds":[47,54,399,610],"labelMax":1.867584228515625,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-joined-glide-0900","stable":true,"changed":38,"total":300760,"percent":0.012634658864210665,"bounds":[35,43,394,562],"labelMax":1.548492431640625,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-joined-glide-1200","stable":true,"changed":2340,"total":300760,"percent":0.7780289932171831,"bounds":[10,31,397,600],"labelMax":1.4610595703125,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-joined-glide-1500","stable":true,"changed":1507,"total":300760,"percent":0.5010639712727756,"bounds":[1,32,407,544],"labelMax":1.48199462890625,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-joined-glide-1800","stable":true,"changed":1634,"total":300760,"percent":0.5432903311610586,"bounds":[0,31,364,607],"labelMax":2.18096923828125,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-joined-glide-2100","stable":true,"changed":716,"total":300760,"percent":0.23806357228354835,"bounds":[56,157,391,597],"labelMax":2.898162841796875,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-joined-glide-2400","stable":true,"changed":735,"total":300760,"percent":0.2443809017156537,"bounds":[62,169,384,621],"labelMax":3.812255859375,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-joined-glide-2700","stable":true,"changed":850,"total":300760,"percent":0.28261736933102805,"bounds":[72,187,376,601],"labelMax":4.617523193359375,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-joined-glide-3000","stable":true,"changed":343,"total":300760,"percent":0.11404442080063838,"bounds":[82,208,229,384],"labelMax":5.28765869140625,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-joined-glide-3300","stable":true,"changed":366,"total":300760,"percent":0.12169171432371326,"bounds":[100,234,262,425],"labelMax":5.4461669921875,"strokeMax":0,"geometry":true}
{"name":"412x730x1-journey-joined-glide-3600","stable":true,"changed":318,"total":300760,"percent":0.10573214523207873,"bounds":[109,256,283,462],"labelMax":6.17626953125,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-beat-map","stable":true,"changed":56906,"total":2073112,"percent":2.7449554100309097,"bounds":[0,24,1081,1778],"labelMax":1.46087646484375,"strokeMax":0,"geometry":false}
{"name":"412x730x2.625-journey-map-beat-laurier","stable":true,"changed":10447,"total":2073112,"percent":0.5039283936420222,"bounds":[0,24,1081,1779],"labelMax":6.34564208984375,"strokeMax":0,"geometry":false}
{"name":"412x730x2.625-journey-map-beat-hmc1","stable":true,"changed":10710,"total":2073112,"percent":0.5166146353887296,"bounds":[0,24,1081,1779],"labelMax":6.345611572265625,"strokeMax":0,"geometry":false}
{"name":"412x730x2.625-journey-map-beat-hmc2","stable":true,"changed":10964,"total":2073112,"percent":0.5288667471897321,"bounds":[0,24,1081,1779],"labelMax":6.345611572265625,"strokeMax":0,"geometry":false}
{"name":"412x730x2.625-journey-map-beat-interkom","stable":true,"changed":11399,"total":2073112,"percent":0.5498496945654648,"bounds":[0,24,1081,1779],"labelMax":6.345611572265625,"strokeMax":0,"geometry":false}
{"name":"412x730x2.625-journey-map-beat-lennard","stable":true,"changed":11224,"total":2073112,"percent":0.5414082789545379,"bounds":[0,4,1081,1779],"labelMax":6.34564208984375,"strokeMax":0,"geometry":false}
{"name":"412x730x2.625-journey-map-glide-0300","stable":true,"changed":50727,"total":2073112,"percent":2.446901083974238,"bounds":[0,24,1081,1778],"labelMax":1.46112060546875,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-0600","stable":true,"changed":45189,"total":2073112,"percent":2.179766457383875,"bounds":[0,24,1081,1778],"labelMax":1.867584228515625,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-0900","stable":false,"changed":50353,"total":2073112,"percent":2.4288605728971713,"bounds":[0,24,1081,1779],"labelMax":1.548492431640625,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-1200","stable":true,"changed":114206,"total":2073112,"percent":5.508916064351564,"bounds":[0,24,1081,1778],"labelMax":1.4610595703125,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-1500","stable":true,"changed":119130,"total":2073112,"percent":5.746433381312731,"bounds":[0,60,1081,1779],"labelMax":1.48199462890625,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-1800","stable":true,"changed":112407,"total":2073112,"percent":5.422138311871235,"bounds":[0,24,1081,1778],"labelMax":2.18096923828125,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-2100","stable":true,"changed":106926,"total":2073112,"percent":5.157753174937003,"bounds":[0,24,1081,1779],"labelMax":2.898162841796875,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-2400","stable":true,"changed":112456,"total":2073112,"percent":5.424501908242295,"bounds":[0,24,1081,1778],"labelMax":3.812255859375,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-2700","stable":true,"changed":103574,"total":2073112,"percent":4.996063888492277,"bounds":[0,24,1081,1779],"labelMax":4.617523193359375,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-3000","stable":true,"changed":99777,"total":2073112,"percent":4.8129092880654785,"bounds":[0,24,1081,1779],"labelMax":5.28765869140625,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-3300","stable":true,"changed":101066,"total":2073112,"percent":4.8750863436225345,"bounds":[0,24,1081,1778],"labelMax":5.4461669921875,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-map-glide-3600","stable":true,"changed":133568,"total":2073112,"percent":6.442874287544523,"bounds":[0,24,1081,1778],"labelMax":6.17626953125,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-0300","stable":true,"changed":7596,"total":2073112,"percent":0.36640567417486364,"bounds":[111,161,985,1521],"labelMax":1.46112060546875,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-0600","stable":true,"changed":1018,"total":2073112,"percent":0.04910492052527794,"bounds":[93,139,993,1601],"labelMax":1.867584228515625,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-0900","stable":true,"changed":50693,"total":2073112,"percent":2.445261037512686,"bounds":[0,24,1081,1779],"labelMax":1.548492431640625,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-1200","stable":true,"changed":114458,"total":2073112,"percent":5.521071702831299,"bounds":[0,24,1081,1778],"labelMax":1.4610595703125,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-1500","stable":true,"changed":119509,"total":2073112,"percent":5.764715075692968,"bounds":[0,60,1081,1779],"labelMax":1.48199462890625,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-1800","stable":true,"changed":112786,"total":2073112,"percent":5.440420006251472,"bounds":[0,24,1081,1778],"labelMax":2.18096923828125,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-2100","stable":true,"changed":107308,"total":2073112,"percent":5.1761795792991405,"bounds":[0,24,1081,1779],"labelMax":2.898162841796875,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-2400","stable":true,"changed":112835,"total":2073112,"percent":5.442783602622531,"bounds":[0,24,1081,1778],"labelMax":3.812255859375,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-2700","stable":true,"changed":103953,"total":2073112,"percent":5.0143455828725125,"bounds":[0,24,1081,1779],"labelMax":4.617523193359375,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-3000","stable":true,"changed":99934,"total":2073112,"percent":4.820482443784996,"bounds":[0,24,1081,1779],"labelMax":5.28765869140625,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-3300","stable":true,"changed":101001,"total":2073112,"percent":4.871950960681333,"bounds":[0,24,1081,1778],"labelMax":5.4461669921875,"strokeMax":0,"geometry":true}
{"name":"412x730x2.625-journey-joined-glide-3600","stable":true,"changed":132699,"total":2073112,"percent":6.400956629453692,"bounds":[0,24,1081,1778],"labelMax":6.17626953125,"strokeMax":0,"geometry":true}
{"captures":264,"changed":218,"maxPercent":6.442874287544523,"labelMax":6.4462890625,"strokeMax":0}
```

### pack: node tools/pack.mjs

Exit 0.

```text
packed data.mjs, art.mjs, trip.mjs, depth.mjs, stars.mjs, pace.mjs, timeline.mjs, findkit.mjs, explore.mjs, steps.mjs, cards.mjs, footname.mjs, footer.mjs, findhoards.mjs, findcreatures.mjs, findsheets.mjs, hammer.mjs, findhammer.mjs, findwater.mjs, findhorn.mjs, findall.mjs, finds.mjs, main.mjs
dist/journey-map.html 658.6 KB
```

### pack: node tools/pack-joined.mjs

Exit 0.

```text
joined.html written
map modules: data.mjs, art.mjs, trip.mjs, depth.mjs, stars.mjs, pace.mjs, timeline.mjs, findkit.mjs, explore.mjs, steps.mjs, cards.mjs, footname.mjs, footer.mjs, findhoards.mjs, findcreatures.mjs, findsheets.mjs, hammer.mjs, findhammer.mjs, findwater.mjs, findhorn.mjs, findall.mjs, finds.mjs, main.mjs, join.mjs
dist/journey-joined.html 1197.6 KB
```

### final-phone: node tools/frame-cost.mjs --cdp ws://127.0.0.1:55020/devtools/browser/22bdeafe-8624-4f46-b421-225503cac1b4 --out C:\Users\Admin\Documents\Portfolio\journey-map-runs\glide\find-writes-timing --passes timing

Exit 0.

```text
browser: Edg/158.0.4370.33; 412x730; DPR 2.625; touch true; CPU x4
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 133 | 20.80 | 58.40 | 96.00 | 21 | 0 | 7.32 | 4.74 | 2.52 | 2.22 | 3.21 | 0.62 | 6.06 | 0.63 | 1.63 | 6 / 92.00 | N/A |
| fling + glide timing | 130 | 16.70 | 25.00 | 41.60 | 2 | 0 | 5.60 | 0.87 | 0.35 | 0.52 | 2.39 | 0.33 | 6.57 | 0.41 | 0.42 | 0 / 0.00 | N/A |
| wayfinder / one turn in 1.5 s timing | 172 | 16.70 | 25.00 | 29.30 | 0 | 0 | 5.44 | 0.49 | 0.28 | 0.21 | 2.60 | 0.33 | 6.33 | 0.46 | 0.34 | 0 / 0.00 | N/A |
| slow pan with glow timing | 192 | 16.70 | 25.10 | 58.40 | 4 | 0 | 5.94 | 0.97 | 0.30 | 0.67 | 2.87 | 0.35 | 6.54 | 0.55 | 0.41 | 0 / 0.00 | N/A |
| stop glide timing | 84 | 58.30 | 75.10 | 87.70 | 82 | 0 | 7.08 | 35.64 | 34.24 | 1.40 | 4.94 | 2.52 | 5.01 | 0.60 | 6.21 | 66 / 89.00 | N/A |
| rush into blast timing | 332 | 12.50 | 62.50 | 79.20 | 52 | 0 | 6.66 | 6.02 | 5.43 | 0.59 | 1.74 | 0.73 | 2.57 | 0.43 | 0.82 | 40 / 71.00 | N/A |
| map -> Laurier timing | 81 | 54.20 | 66.80 | 91.80 | 80 | 0 | 7.65 | 31.17 | 30.03 | 1.14 | 4.93 | 2.48 | 5.28 | 0.68 | 6.09 | 49 / 83.00 | N/A |
| Laurier -> HMC timing | 82 | 58.30 | 71.00 | 83.40 | 78 | 0 | 6.83 | 34.35 | 33.04 | 1.32 | 5.19 | 2.56 | 4.99 | 0.57 | 6.05 | 70 / 81.00 | N/A |
| HMC again -> Interkom timing | 72 | 58.30 | 75.00 | 100.10 | 66 | 1 | 6.56 | 34.07 | 32.77 | 1.30 | 5.05 | 2.50 | 5.10 | 0.58 | 4.05 | 62 / 89.00 | N/A |
| Interkom -> HMC again / Back timing | 72 | 54.30 | 70.90 | 75.10 | 67 | 0 | 6.31 | 33.42 | 32.15 | 1.27 | 4.62 | 2.46 | 4.95 | 0.56 | 4.00 | 53 / 72.00 | N/A |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 148 | 16.70 | 58.30 | 87.60 | 18 | 0 | 5.18 | 4.29 | 2.20 | 2.09 | 3.18 | 0.58 | 5.82 | 0.57 | 1.47 | 6 / 89.00 | N/A |
| fling + glide timing | 123 | 16.70 | 25.00 | 45.90 | 3 | 0 | 4.99 | 1.30 | 0.41 | 0.89 | 2.60 | 0.40 | 6.64 | 0.47 | 0.46 | 0 / 0.00 | N/A |
| wayfinder / one turn in 1.5 s timing | 179 | 16.70 | 24.90 | 29.20 | 0 | 0 | 3.85 | 0.56 | 0.32 | 0.23 | 2.79 | 0.34 | 6.48 | 0.47 | 0.33 | 0 / 0.00 | N/A |
| slow pan with glow timing | 222 | 16.60 | 20.90 | 50.00 | 2 | 0 | 4.02 | 0.90 | 0.29 | 0.60 | 2.74 | 0.33 | 6.54 | 0.51 | 0.39 | 0 / 0.00 | N/A |
| stop glide timing | 80 | 62.50 | 83.40 | 91.70 | 77 | 0 | 6.87 | 37.46 | 35.91 | 1.55 | 5.48 | 2.70 | 5.25 | 0.72 | 6.86 | 67 / 88.00 | N/A |
| rush into blast timing | 389 | 8.40 | 58.40 | 79.00 | 53 | 0 | 4.59 | 5.37 | 4.84 | 0.53 | 1.68 | 0.66 | 2.48 | 0.39 | 0.71 | 39 / 80.00 | N/A |
| map -> Laurier timing | 83 | 54.20 | 75.00 | 87.50 | 80 | 0 | 6.38 | 32.37 | 31.18 | 1.19 | 5.03 | 2.49 | 5.28 | 0.70 | 5.94 | 48 / 81.00 | N/A |
| Laurier -> HMC timing | 85 | 58.30 | 79.10 | 83.40 | 79 | 0 | 6.09 | 34.70 | 33.26 | 1.45 | 5.62 | 2.60 | 5.03 | 0.62 | 6.23 | 64 / 83.00 | N/A |
| HMC again -> Interkom timing | 72 | 58.30 | 79.20 | 87.50 | 68 | 0 | 5.59 | 36.61 | 35.21 | 1.40 | 4.87 | 2.60 | 5.12 | 0.64 | 4.09 | 59 / 83.00 | N/A |
| Interkom -> HMC again / Back timing | 72 | 58.30 | 70.90 | 75.00 | 66 | 0 | 5.45 | 35.20 | 33.86 | 1.34 | 4.78 | 2.56 | 4.98 | 0.57 | 4.03 | 58 / 73.00 | N/A |
```

### desktop: node tools/frame-cost.mjs --cdp ws://127.0.0.1:55020/devtools/browser/22bdeafe-8624-4f46-b421-225503cac1b4 --width 1440 --height 900 --dpr 1 --cpu 1 --scenarios 6,7,8,9 --passes timing --out C:\Users\Admin\Documents\Portfolio\journey-map-runs\glide\desktop-timing

Exit 0.

```text
browser: Edg/158.0.4370.33; 1440x900; DPR 1; touch false; CPU x1
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| map -> Laurier timing | 401 | 8.40 | 12.60 | 20.90 | 0 | 0 | 1.33 | 5.15 | 4.98 | 0.17 | 0.81 | 0.48 | 1.14 | 0.15 | 8.54 | 0 / 0.00 | N/A |
| Laurier -> HMC timing | 380 | 8.40 | 12.60 | 16.70 | 0 | 0 | 1.14 | 6.13 | 5.94 | 0.19 | 0.75 | 0.47 | 1.04 | 0.12 | 9.55 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 329 | 8.40 | 12.60 | 16.80 | 0 | 0 | 1.16 | 5.94 | 5.74 | 0.20 | 0.75 | 0.45 | 1.17 | 0.15 | 10.79 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 316 | 12.40 | 12.60 | 16.70 | 0 | 0 | 1.23 | 6.11 | 5.89 | 0.21 | 0.84 | 0.49 | 1.24 | 0.16 | 10.84 | 0 / 0.00 | N/A |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| map -> Laurier timing | 455 | 8.30 | 12.50 | 16.70 | 0 | 0 | 1.15 | 4.45 | 4.29 | 0.16 | 0.71 | 0.38 | 1.00 | 0.14 | 7.51 | 0 / 0.00 | N/A |
| Laurier -> HMC timing | 396 | 8.40 | 12.60 | 16.80 | 0 | 0 | 1.13 | 5.64 | 5.45 | 0.20 | 0.80 | 0.43 | 1.02 | 0.13 | 8.80 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 302 | 12.40 | 16.70 | 20.90 | 0 | 0 | 1.27 | 6.52 | 6.29 | 0.23 | 0.86 | 0.47 | 1.19 | 0.17 | 10.13 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 359 | 8.40 | 12.60 | 16.80 | 0 | 0 | 1.04 | 5.34 | 5.14 | 0.20 | 0.72 | 0.41 | 1.08 | 0.15 | 9.27 | 0 / 0.00 | N/A |
```

### syntax: node --check art.mjs

Exit 0.

```text
```

### syntax: node --check cards.mjs

Exit 0.

```text
```

### syntax: node --check data.mjs

Exit 0.

```text
```

### syntax: node --check depth.mjs

Exit 0.

```text
```

### syntax: node --check explore.mjs

Exit 0.

```text
```

### syntax: node --check findall.mjs

Exit 0.

```text
```

### syntax: node --check findcreatures.mjs

Exit 0.

```text
```

### final-check: node tools/check.mjs

Exit 0.

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 15.88 KB / 30; all map modules + CSS 157.88 KB / 160
gzip: dist/journey-map.html 274.47 KB / 320
gzip: dist/journey-joined.html 494.53 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

### syntax: node --check findhammer.mjs

Exit 0.

```text
```

### syntax: node --check findhoards.mjs

Exit 0.

```text
```

### syntax: node --check findhorn.mjs

Exit 0.

```text
```

### syntax: node --check findkit.mjs

Exit 0.

```text
```

### syntax: node --check finds.mjs

Exit 0.

```text
```

### syntax: node --check findsheets.mjs

Exit 0.

```text
```

### syntax: node --check findwater.mjs

Exit 0.

```text
```

### syntax: node --check footer.mjs

Exit 0.

```text
```

### syntax: node --check footname.mjs

Exit 0.

```text
```

### syntax: node --check hammer.mjs

Exit 0.

```text
```

### syntax: node --check join.mjs

Exit 0.

```text
```

### syntax: node --check main.mjs

Exit 0.

```text
```

### syntax: node --check pace.mjs

Exit 0.

```text
```

### syntax: node --check stars.mjs

Exit 0.

```text
```

### syntax: node --check steps.mjs

Exit 0.

```text
```

### syntax: node --check timeline.mjs

Exit 0.

```text
```

### syntax: node --check trip.mjs

Exit 0.

```text
```

### syntax: node --check tools/audit-capture.mjs

Exit 0.

```text
```

### syntax: node --check tools/check.mjs

Exit 0.

```text
```

### syntax: node --check tools/depth-test.mjs

Exit 0.

```text
```

### syntax: node --check tools/explore-test.mjs

Exit 0.

```text
```

### syntax: node --check tools/finds-test.mjs

Exit 0.

```text
```

### syntax: node --check tools/frame-cost-test.mjs

Exit 0.

```text
```

### syntax: node --check tools/frame-cost.mjs

Exit 0.

```text
```

### syntax: node --check tools/frame-performance-test.mjs

Exit 0.

```text
```

### syntax: node --check tools/frame-render-test.mjs

Exit 0.

```text
```

### syntax: node --check tools/glide-report-test.mjs

Exit 0.

```text
```

### syntax: node --check tools/glide-suite-test.mjs

Exit 0.

```text
```

### syntax: node --check tools/glide-visual-test.mjs

Exit 0.

```text
```

### syntax: node --check tools/hammer-test.mjs

Exit 0.

```text
```

### final-check: node tools/whirl2-test.mjs

Exit 0.

```text
ok: 1440x900/map 29 trip/find stills; added 122; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 412x730/map 29 trip/find stills; added 77; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/map 29 trip/find stills; added 69; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 360x640/map 29 trip/find stills; added 77; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 1440x900/1200 29 trip/find stills; added 5; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 412x730/278 29 trip/find stills; added 79; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/305 29 trip/find stills; added 70; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 360x640/213 29 trip/find stills; added 79; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: 390x844/240 29 trip/find stills; added 71; full trail/sea, flash-only additions, replay, reduced motion, DPR 1/2.6
ok: all sector targets survive full pointer look and 16 hero-dwell cases (1/5/30/120 s); no late creation or replacement
ok: WHIRL2 261 trail/sea still comparisons; 45 unchanged blast/remnant primitive comparisons (not pixels); source 19baa591a4c40930d25989dba56279d36251048ffa94f9105095978ae18ad2c0
```

### syntax: node --check tools/layout-test.mjs

Exit 0.

```text
```

### syntax: node --check tools/motion-test.mjs

Exit 0.

```text
```

### syntax: node --check tools/nova-test.mjs

Exit 0.

```text
```

### syntax: node --check tools/origin-check.mjs

Exit 0.

```text
```

### syntax: node --check tools/pack-joined.mjs

Exit 0.

```text
```

### syntax: node --check tools/pack.mjs

Exit 0.

```text
```

### syntax: node --check tools/steps-test.mjs

Exit 0.

```text
```

### syntax: node --check tools/whirl2-test.mjs

Exit 0.

```text
```

### origin: node tools/origin-check.mjs --cdp ws://127.0.0.1:55020/devtools/browser/22bdeafe-8624-4f46-b421-225503cac1b4

Exit 1.

```text
1440x900: FAIL heights []; max rim error 0.000 px; card did not open within 5 seconds
1280x720: FAIL heights []; max rim error 0.000 px; card did not open within 5 seconds
1024x600: FAIL heights []; max rim error 0.000 px; card did not open within 5 seconds
820x1180: FAIL heights []; max rim error 0.000 px; card did not open within 5 seconds
390x844: FAIL heights []; max rim error 0.000 px; card did not open within 5 seconds
412x730: FAIL heights []; max rim error 0.000 px; card did not open within 5 seconds
360x640: FAIL heights []; max rim error 0.000 px; card did not open within 5 seconds
```

### visual-retained: node tools/glide-visual-test.mjs --cdp ws://127.0.0.1:55020/devtools/browser/22bdeafe-8624-4f46-b421-225503cac1b4 --out C:\Users\Admin\Documents\Portfolio\journey-map-runs\glide\final-visual --compare C:\Users\Admin\Documents\Portfolio\journey-map-runs\glide\before

Exit 1.

```text
{"name":"412x730x2.625-journey-map-find-horn","stable":false,"changed":67424,"total":2073112,"percent":3.252308606577937,"bounds":[0,11,1081,1779],"labelMax":0,"strokeMax":0,"geometry":false}
{"captures":264,"changed":42,"maxPercent":3.252308606577937,"labelMax":0.0468597412109375,"strokeMax":0}
```

### origin: node tools/origin-check.mjs --cdp ws://127.0.0.1:55020/devtools/browser/22bdeafe-8624-4f46-b421-225503cac1b4

Exit 0.

```text
1440x900: PASS heights [laurier:360, hmc1:379, mohawk:359, hmc2:398, interkom:359, lennard:432]; max rim error 0.000 px
1280x720: PASS heights [laurier:269, hmc1:292, mohawk:274, hmc2:325, interkom:292, lennard:333]; max rim error 0.000 px
1024x600: PASS heights [laurier:269, hmc1:292, mohawk:274, hmc2:325, interkom:292, lennard:333]; max rim error 0.000 px
820x1180: PASS heights [laurier:360, hmc1:379, mohawk:359, hmc2:398, interkom:359, lennard:432]; max rim error 0.000 px
390x844: PASS heights [laurier:287, hmc1:310, mohawk:292, hmc2:343, interkom:310, lennard:368]; max rim error 0.000 px
412x730: PASS heights [laurier:287, hmc1:310, mohawk:292, hmc2:343, interkom:310, lennard:368]; max rim error 0.000 px
360x640: PASS heights [laurier:287, hmc1:310, mohawk:292, hmc2:343, interkom:327, lennard:368]; max rim error 0.000 px
```

### visual-isolated: node tools/glide-visual-test.mjs --cdp ws://127.0.0.1:55020/devtools/browser/22bdeafe-8624-4f46-b421-225503cac1b4 --out C:\Users\Admin\Documents\Portfolio\journey-map-runs\glide\final-isolated --compare C:\Users\Admin\Documents\Portfolio\journey-map-runs\glide\before

Exit 0.

```text
{"captures":264,"changed":33,"maxPercent":2.369191823693076,"labelMax":0,"strokeMax":0}
```

### blank-captures: node tools/frame-cost.mjs --cdp ws://127.0.0.1:55020/devtools/browser/22bdeafe-8624-4f46-b421-225503cac1b4 --passes capture --out C:\Users\Admin\Documents\Portfolio\journey-map-runs\glide\final-capture

Exit 0.

```text
browser: Edg/158.0.4370.33; 412x730; DPR 2.625; touch true; CPU x4
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats capture | 125 | 24.90 | 58.40 | 116.70 | 26 | 1 | 8.68 | 5.17 | 2.73 | 2.44 | 3.43 | 0.75 | 6.51 | 0.75 | 1.67 | 7 / 110.00 | 0 / 146 |
| fling + glide capture | 117 | 16.80 | 25.00 | 45.90 | 3 | 0 | 6.75 | 1.28 | 0.41 | 0.87 | 2.58 | 0.42 | 6.57 | 0.50 | 0.46 | 0 / 0.00 | 0 / 120 |
| wayfinder / one turn in 1.5 s capture | 149 | 20.80 | 25.10 | 37.60 | 3 | 0 | 6.36 | 0.65 | 0.38 | 0.27 | 3.24 | 0.42 | 6.92 | 0.56 | 0.40 | 0 / 0.00 | 0 / 152 |
| slow pan with glow capture | 185 | 20.70 | 25.10 | 62.60 | 3 | 0 | 6.38 | 1.04 | 0.32 | 0.72 | 3.04 | 0.35 | 6.80 | 0.57 | 0.43 | 1 / 62.00 | 0 / 188 |
| stop glide capture | 86 | 58.30 | 75.00 | 83.40 | 84 | 0 | 7.09 | 35.29 | 33.92 | 1.37 | 4.67 | 2.54 | 4.90 | 0.58 | 6.20 | 71 / 79.00 | 0 / 89 |
| rush into blast capture | 310 | 12.60 | 58.30 | 70.90 | 56 | 0 | 7.23 | 6.21 | 5.58 | 0.63 | 1.80 | 0.76 | 2.77 | 0.46 | 0.84 | 37 / 69.00 | 0 / 313 |
| map -> Laurier capture | 81 | 54.20 | 66.70 | 70.90 | 80 | 0 | 7.47 | 31.31 | 30.12 | 1.19 | 4.91 | 2.52 | 5.30 | 0.71 | 5.94 | 51 / 71.00 | 0 / 88 |
| Laurier -> HMC capture | 84 | 54.30 | 70.90 | 75.00 | 77 | 0 | 6.70 | 33.30 | 31.96 | 1.34 | 4.93 | 2.50 | 4.85 | 0.57 | 5.91 | 66 / 74.00 | 0 / 96 |
| HMC again -> Interkom capture | 72 | 54.30 | 66.70 | 75.10 | 67 | 0 | 6.38 | 33.69 | 32.36 | 1.33 | 4.56 | 2.49 | 4.95 | 0.57 | 3.94 | 60 / 69.00 | 0 / 86 |
| Interkom -> HMC again / Back capture | 72 | 54.20 | 71.00 | 75.10 | 69 | 0 | 6.48 | 33.63 | 32.31 | 1.32 | 4.72 | 2.47 | 5.00 | 0.60 | 3.96 | 60 / 73.00 | 0 / 89 |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats capture | 142 | 16.80 | 58.40 | 116.70 | 23 | 1 | 5.91 | 4.92 | 2.55 | 2.37 | 3.15 | 0.66 | 6.09 | 0.63 | 1.67 | 6 / 105.00 | 0 / 162 |
| fling + glide capture | 133 | 16.70 | 25.00 | 37.60 | 2 | 0 | 4.15 | 0.91 | 0.41 | 0.50 | 2.86 | 0.37 | 6.64 | 0.41 | 0.37 | 0 / 0.00 | 0 / 136 |
| wayfinder / one turn in 1.5 s capture | 186 | 16.60 | 20.90 | 33.30 | 1 | 0 | 3.86 | 0.52 | 0.31 | 0.21 | 2.77 | 0.34 | 6.32 | 0.46 | 0.32 | 0 / 0.00 | 0 / 190 |
| slow pan with glow capture | 209 | 16.70 | 25.00 | 66.70 | 3 | 0 | 4.46 | 0.97 | 0.30 | 0.67 | 2.93 | 0.33 | 6.81 | 0.53 | 0.40 | 1 / 63.00 | 0 / 212 |
| stop glide capture | 98 | 54.20 | 70.80 | 75.00 | 85 | 0 | 5.91 | 31.25 | 29.93 | 1.32 | 4.38 | 2.30 | 4.74 | 0.56 | 5.93 | 61 / 76.00 | 0 / 96 |
| rush into blast capture | 361 | 12.40 | 58.30 | 75.00 | 53 | 0 | 5.18 | 5.67 | 5.11 | 0.56 | 1.81 | 0.70 | 2.59 | 0.41 | 0.74 | 40 / 74.00 | 0 / 350 |
| map -> Laurier capture | 80 | 54.30 | 70.80 | 71.00 | 79 | 0 | 6.61 | 34.49 | 33.23 | 1.26 | 5.44 | 2.51 | 5.23 | 0.72 | 6.22 | 64 / 71.00 | 0 / 89 |
| Laurier -> HMC capture | 82 | 58.40 | 79.20 | 83.50 | 78 | 0 | 6.55 | 37.54 | 36.02 | 1.51 | 5.34 | 2.63 | 5.05 | 0.64 | 6.03 | 75 / 80.00 | 0 / 97 |
| HMC again -> Interkom capture | 71 | 62.50 | 71.00 | 75.00 | 69 | 0 | 6.21 | 37.04 | 35.56 | 1.47 | 5.26 | 2.59 | 5.09 | 0.63 | 3.96 | 61 / 74.00 | 0 / 88 |
| Interkom -> HMC again / Back capture | 71 | 58.40 | 75.00 | 79.20 | 66 | 0 | 6.00 | 36.75 | 35.30 | 1.45 | 4.98 | 2.54 | 5.02 | 0.62 | 4.07 | 62 / 74.00 | 0 / 90 |
```

## Captured performance tables

All costs are exclusive renderer-main-thread milliseconds per measured frame.
Raster is separate worker time. Paint excludes pre-paint; style+layout is
the sum of those two columns. Missing evidence is not zero. The four named
glides exclude idle tails; the six original scenarios retain their original
windows. Screenshots run separately and include capture overhead.

Initial standalone frame-cost-test run: exit 0.

```text
ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature
ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work
```

Initial visual baseline command: exit 0. Each emitted record is retained
below; comparison fields are null because this is the reference capture.

```text
{"name":"1440x900x1-journey-map-beat-top","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-beat-map","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-beat-laurier","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-beat-hmc1","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-beat-mohawk","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-beat-hmc2","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-beat-interkom","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-beat-lennard","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-beat-x","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-beat-end","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-closed-laurier","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-closed-hmc1","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-closed-mohawk","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-closed-hmc2","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-closed-interkom","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-closed-lennard","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-explore","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-find-wayfinder","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-find-hoard-laurier","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-find-hoard-hmc1","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-find-hoard-hmc2","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-find-hoard-interkom","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-find-hoard-lennard","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-find-ravens","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-find-serpent","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-find-beacon","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-find-runestone","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-find-hammer","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-find-mist","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-find-horn","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-find-well","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-find-longship","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-glide-0300","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-glide-0600","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-glide-0900","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-glide-1200","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-glide-1500","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-glide-1800","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-glide-2100","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-glide-2400","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-glide-2700","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-glide-3000","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-glide-3300","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-map-glide-3600","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-beat-top","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-beat-map","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-beat-laurier","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-beat-hmc1","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-beat-mohawk","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-beat-hmc2","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-beat-interkom","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-beat-lennard","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-beat-x","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-beat-end","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-closed-laurier","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-closed-hmc1","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-closed-mohawk","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-closed-hmc2","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-closed-interkom","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-closed-lennard","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-explore","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-find-wayfinder","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-find-hoard-laurier","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-find-hoard-hmc1","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-find-hoard-hmc2","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-find-hoard-interkom","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-find-hoard-lennard","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-find-ravens","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-find-serpent","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-find-beacon","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-find-runestone","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-find-hammer","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-find-mist","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-find-horn","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-find-well","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-find-longship","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-glide-0300","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-glide-0600","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-glide-0900","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-glide-1200","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-glide-1500","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-glide-1800","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-glide-2100","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-glide-2400","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-glide-2700","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-glide-3000","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-glide-3300","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"1440x900x1-journey-joined-glide-3600","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-beat-top","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-beat-map","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-beat-laurier","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-beat-hmc1","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-beat-mohawk","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-beat-hmc2","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-beat-interkom","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-beat-lennard","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-beat-x","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-beat-end","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-closed-laurier","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-closed-hmc1","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-closed-mohawk","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-closed-hmc2","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-closed-interkom","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-closed-lennard","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-explore","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-find-wayfinder","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-find-hoard-laurier","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-find-hoard-hmc1","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-find-hoard-hmc2","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-find-hoard-interkom","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-find-hoard-lennard","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-find-ravens","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-find-serpent","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-find-beacon","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-find-runestone","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-find-hammer","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-find-mist","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-find-horn","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-find-well","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-find-longship","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-glide-0300","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-glide-0600","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-glide-0900","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-glide-1200","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-glide-1500","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-glide-1800","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-glide-2100","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-glide-2400","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-glide-2700","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-glide-3000","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-glide-3300","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-map-glide-3600","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-beat-top","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-beat-map","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-beat-laurier","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-beat-hmc1","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-beat-mohawk","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-beat-hmc2","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-beat-interkom","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-beat-lennard","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-beat-x","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-beat-end","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-closed-laurier","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-closed-hmc1","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-closed-mohawk","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-closed-hmc2","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-closed-interkom","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-closed-lennard","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-explore","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-find-wayfinder","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-find-hoard-laurier","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-find-hoard-hmc1","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-find-hoard-hmc2","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-find-hoard-interkom","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-find-hoard-lennard","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-find-ravens","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-find-serpent","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-find-beacon","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-find-runestone","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-find-hammer","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-find-mist","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-find-horn","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-find-well","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-find-longship","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-glide-0300","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-glide-0600","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-glide-0900","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-glide-1200","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-glide-1500","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-glide-1800","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-glide-2100","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-glide-2400","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-glide-2700","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-glide-3000","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-glide-3300","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x1-journey-joined-glide-3600","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-beat-top","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-beat-map","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-beat-laurier","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-beat-hmc1","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-beat-mohawk","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-beat-hmc2","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-beat-interkom","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-beat-lennard","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-beat-x","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-beat-end","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-closed-laurier","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-closed-hmc1","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-closed-mohawk","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-closed-hmc2","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-closed-interkom","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-closed-lennard","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-explore","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-find-wayfinder","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-find-hoard-laurier","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-find-hoard-hmc1","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-find-hoard-hmc2","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-find-hoard-interkom","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-find-hoard-lennard","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-find-ravens","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-find-serpent","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-find-beacon","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-find-runestone","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-find-hammer","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-find-mist","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-find-horn","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-find-well","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-find-longship","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-glide-0300","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-glide-0600","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-glide-0900","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-glide-1200","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-glide-1500","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-glide-1800","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-glide-2100","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-glide-2400","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-glide-2700","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-glide-3000","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-glide-3300","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-map-glide-3600","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-beat-top","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-beat-map","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-beat-laurier","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-beat-hmc1","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-beat-mohawk","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-beat-hmc2","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-beat-interkom","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-beat-lennard","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-beat-x","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-beat-end","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-closed-laurier","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-closed-hmc1","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-closed-mohawk","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-closed-hmc2","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-closed-interkom","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-closed-lennard","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-explore","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-find-wayfinder","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-find-hoard-laurier","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-find-hoard-hmc1","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-find-hoard-hmc2","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-find-hoard-interkom","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-find-hoard-lennard","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-find-ravens","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-find-serpent","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-find-beacon","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-find-runestone","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-find-hammer","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-find-mist","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-find-horn","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-find-well","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-find-longship","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-glide-0300","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-glide-0600","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-glide-0900","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-glide-1200","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-glide-1500","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-glide-1800","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-glide-2100","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-glide-2400","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-glide-2700","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-glide-3000","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-glide-3300","changed":null,"total":null,"labelMax":null,"strokeMax":null}
{"name":"412x730x2.625-journey-joined-glide-3600","changed":null,"total":null,"labelMax":null,"strokeMax":null}
```

### baseline-timing / journey-map

| Scenario | Frames | p50 | p95 | Max | >33 | >100 | Script | Style+layout | Layout | Style | Paint | Pre-paint | Layerize | Commit | Raster | Long/max | Blank/captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 136 | 20.80 | 62.50 | 91.70 | 19 | 0 | 7.32 | 4.81 | 2.55 | 2.26 | 3.24 | 0.65 | 5.98 | 0.61 | 1.61 | 6/88.00 | not sampled |
| fling + glide timing | 117 | 16.80 | 25.10 | 45.80 | 3 | 0 | 6.54 | 1.66 | 0.68 | 0.98 | 2.41 | 0.43 | 6.52 | 0.49 | 0.48 | 0/0.00 | not sampled |
| wayfinder / one turn in 1.5 s timing | 168 | 16.70 | 25.00 | 33.40 | 1 | 0 | 5.39 | 0.93 | 0.60 | 0.33 | 2.51 | 0.37 | 6.38 | 0.48 | 0.35 | 0/0.00 | not sampled |
| slow pan with glow timing | 193 | 16.70 | 25.00 | 45.90 | 2 | 0 | 5.70 | 1.29 | 0.59 | 0.70 | 2.84 | 0.37 | 6.50 | 0.55 | 0.42 | 0/0.00 | not sampled |
| stop glide timing | 87 | 58.30 | 70.90 | 83.30 | 83 | 0 | 6.63 | 34.78 | 33.31 | 1.47 | 4.89 | 2.49 | 4.93 | 0.59 | 6.38 | 71/81.00 | not sampled |
| rush into blast timing | 329 | 12.50 | 62.50 | 87.50 | 54 | 0 | 6.44 | 6.09 | 5.40 | 0.69 | 1.79 | 0.73 | 2.59 | 0.43 | 0.86 | 37/83.00 | not sampled |
| map -> Laurier timing | 82 | 54.20 | 70.90 | 79.30 | 80 | 0 | 7.40 | 31.39 | 30.07 | 1.31 | 4.82 | 2.50 | 5.27 | 0.70 | 6.11 | 51/76.00 | not sampled |
| Laurier -> HMC timing | 84 | 58.30 | 70.80 | 83.50 | 78 | 0 | 6.48 | 33.14 | 31.72 | 1.42 | 4.89 | 2.44 | 4.86 | 0.55 | 5.92 | 63/80.00 | not sampled |
| HMC again -> Interkom timing | 72 | 58.40 | 74.90 | 79.30 | 67 | 0 | 6.42 | 35.68 | 34.16 | 1.52 | 5.26 | 2.60 | 5.15 | 0.63 | 4.11 | 60/72.00 | not sampled |
| Interkom -> HMC again / Back timing | 72 | 58.40 | 75.10 | 87.60 | 69 | 0 | 6.56 | 35.39 | 33.83 | 1.55 | 5.09 | 2.61 | 5.27 | 0.65 | 4.03 | 61/86.00 | not sampled |

### baseline-timing / journey-joined

| Scenario | Frames | p50 | p95 | Max | >33 | >100 | Script | Style+layout | Layout | Style | Paint | Pre-paint | Layerize | Commit | Raster | Long/max | Blank/captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 147 | 16.70 | 58.40 | 100.10 | 18 | 1 | 5.38 | 5.08 | 2.85 | 2.23 | 2.74 | 0.62 | 6.01 | 0.54 | 1.83 | 6/92.00 | not sampled |
| fling + glide timing | 125 | 16.70 | 29.20 | 62.50 | 3 | 0 | 4.83 | 1.81 | 0.93 | 0.88 | 2.79 | 0.43 | 6.22 | 0.47 | 0.49 | 2/63.00 | not sampled |
| wayfinder / one turn in 1.5 s timing | 176 | 16.70 | 20.90 | 33.30 | 1 | 0 | 3.85 | 1.06 | 0.68 | 0.38 | 2.65 | 0.35 | 6.45 | 0.45 | 0.33 | 0/0.00 | not sampled |
| slow pan with glow timing | 157 | 20.90 | 33.40 | 70.90 | 11 | 0 | 6.06 | 2.32 | 1.16 | 1.17 | 4.33 | 0.56 | 7.68 | 0.72 | 0.57 | 1/69.00 | not sampled |
| stop glide timing | 88 | 54.20 | 83.40 | 91.60 | 84 | 0 | 5.85 | 36.65 | 34.97 | 1.68 | 5.02 | 2.20 | 4.30 | 0.63 | 6.18 | 51/91.00 | not sampled |
| rush into blast timing | 413 | 8.40 | 58.40 | 79.20 | 52 | 0 | 4.44 | 5.28 | 4.63 | 0.65 | 1.44 | 0.58 | 2.08 | 0.37 | 0.63 | 41/75.00 | not sampled |
| map -> Laurier timing | 84 | 50.00 | 66.70 | 75.00 | 81 | 0 | 5.93 | 31.62 | 30.23 | 1.39 | 5.11 | 2.03 | 4.47 | 0.67 | 5.66 | 40/71.00 | not sampled |
| Laurier -> HMC timing | 83 | 66.70 | 83.40 | 95.90 | 80 | 0 | 7.06 | 40.59 | 38.70 | 1.89 | 6.44 | 2.71 | 5.21 | 0.71 | 6.43 | 72/85.00 | not sampled |
| HMC again -> Interkom timing | 71 | 58.40 | 75.00 | 79.30 | 69 | 0 | 6.02 | 37.05 | 35.45 | 1.59 | 5.11 | 2.59 | 5.17 | 0.64 | 3.97 | 63/78.00 | not sampled |
| Interkom -> HMC again / Back timing | 71 | 58.40 | 79.20 | 87.60 | 66 | 0 | 6.30 | 37.72 | 36.00 | 1.72 | 5.44 | 2.66 | 5.25 | 0.69 | 4.09 | 62/86.00 | not sampled |

### writes-timing / journey-map

| Scenario | Frames | p50 | p95 | Max | >33 | >100 | Script | Style+layout | Layout | Style | Paint | Pre-paint | Layerize | Commit | Raster | Long/max | Blank/captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 134 | 20.80 | 62.50 | 95.90 | 17 | 0 | 7.31 | 4.47 | 2.30 | 2.16 | 3.04 | 0.61 | 5.93 | 0.61 | 1.62 | 7/92.00 | not sampled |
| fling + glide timing | 122 | 16.70 | 25.10 | 54.20 | 2 | 0 | 6.14 | 1.06 | 0.42 | 0.64 | 2.69 | 0.40 | 6.74 | 0.46 | 0.48 | 1/50.00 | not sampled |
| wayfinder / one turn in 1.5 s timing | 173 | 16.70 | 25.00 | 33.30 | 1 | 0 | 5.40 | 0.49 | 0.29 | 0.21 | 2.55 | 0.33 | 6.26 | 0.45 | 0.33 | 0/0.00 | not sampled |
| slow pan with glow timing | 191 | 16.70 | 25.10 | 62.60 | 3 | 0 | 5.97 | 0.97 | 0.31 | 0.66 | 2.97 | 0.36 | 6.64 | 0.56 | 0.42 | 1/53.00 | not sampled |
| stop glide timing | 80 | 62.50 | 70.90 | 79.10 | 78 | 0 | 8.09 | 37.03 | 35.48 | 1.56 | 5.29 | 2.67 | 5.09 | 0.67 | 6.62 | 72/86.00 | not sampled |
| rush into blast timing | 283 | 12.60 | 66.60 | 83.40 | 57 | 0 | 7.46 | 7.40 | 6.71 | 0.69 | 2.10 | 0.82 | 2.83 | 0.49 | 0.97 | 45/82.00 | not sampled |
| map -> Laurier timing | 83 | 50.10 | 71.00 | 83.40 | 80 | 0 | 7.46 | 31.06 | 29.88 | 1.18 | 4.77 | 2.57 | 5.43 | 0.68 | 6.08 | 48/76.00 | not sampled |
| Laurier -> HMC timing | 85 | 54.20 | 75.10 | 91.70 | 79 | 0 | 6.64 | 33.85 | 32.43 | 1.42 | 5.22 | 2.33 | 4.57 | 0.57 | 5.73 | 48/91.00 | not sampled |
| HMC again -> Interkom timing | 76 | 50.00 | 70.90 | 79.40 | 65 | 0 | 5.67 | 30.48 | 29.25 | 1.23 | 4.26 | 1.98 | 4.19 | 0.52 | 3.59 | 30/74.00 | not sampled |
| Interkom -> HMC again / Back timing | 74 | 54.20 | 70.90 | 79.30 | 63 | 0 | 6.10 | 34.61 | 33.25 | 1.36 | 4.61 | 2.17 | 4.41 | 0.53 | 3.76 | 47/79.00 | not sampled |

### writes-timing / journey-joined

| Scenario | Frames | p50 | p95 | Max | >33 | >100 | Script | Style+layout | Layout | Style | Paint | Pre-paint | Layerize | Commit | Raster | Long/max | Blank/captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 133 | 20.90 | 66.70 | 116.80 | 20 | 1 | 6.67 | 5.68 | 3.04 | 2.63 | 4.04 | 0.77 | 6.49 | 0.69 | 2.01 | 9/111.00 | not sampled |
| fling + glide timing | 134 | 16.70 | 20.90 | 54.20 | 2 | 0 | 4.55 | 1.03 | 0.42 | 0.62 | 3.03 | 0.38 | 6.49 | 0.45 | 0.45 | 1/53.00 | not sampled |
| wayfinder / one turn in 1.5 s timing | 163 | 16.70 | 25.10 | 37.50 | 4 | 0 | 4.91 | 0.67 | 0.39 | 0.28 | 3.52 | 0.42 | 7.14 | 0.56 | 0.39 | 0/0.00 | not sampled |
| slow pan with glow timing | 139 | 25.10 | 37.50 | 75.00 | 18 | 0 | 7.42 | 1.76 | 0.62 | 1.14 | 5.20 | 0.70 | 8.67 | 0.94 | 0.67 | 1/64.00 | not sampled |
| stop glide timing | 68 | 70.90 | 95.80 | 116.70 | 67 | 1 | 9.05 | 44.33 | 42.26 | 2.07 | 7.18 | 3.16 | 5.98 | 0.91 | 7.55 | 60/113.00 | not sampled |
| rush into blast timing | 314 | 12.40 | 75.00 | 83.40 | 53 | 0 | 5.79 | 7.13 | 6.37 | 0.76 | 2.41 | 0.87 | 2.77 | 0.50 | 0.93 | 44/81.00 | not sampled |
| map -> Laurier timing | 79 | 66.70 | 91.70 | 99.80 | 78 | 0 | 8.67 | 40.90 | 39.19 | 1.71 | 6.70 | 2.99 | 5.98 | 0.95 | 6.84 | 75/101.00 | not sampled |
| Laurier -> HMC timing | 82 | 66.70 | 87.50 | 91.80 | 80 | 0 | 7.53 | 41.17 | 39.45 | 1.73 | 6.31 | 2.77 | 5.33 | 0.75 | 6.30 | 74/90.00 | not sampled |
| HMC again -> Interkom timing | 70 | 62.40 | 75.10 | 79.20 | 69 | 0 | 6.49 | 37.73 | 36.24 | 1.50 | 5.06 | 2.49 | 4.85 | 0.68 | 4.14 | 59/77.00 | not sampled |
| Interkom -> HMC again / Back timing | 72 | 62.50 | 87.60 | 91.70 | 67 | 0 | 6.61 | 40.32 | 38.70 | 1.62 | 6.29 | 2.70 | 5.22 | 0.71 | 4.26 | 61/90.00 | not sampled |

### precision-timing / journey-map

| Scenario | Frames | p50 | p95 | Max | >33 | >100 | Script | Style+layout | Layout | Style | Paint | Pre-paint | Layerize | Commit | Raster | Long/max | Blank/captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 115 | 25.00 | 66.60 | 83.30 | 27 | 0 | 10.20 | 4.57 | 1.40 | 3.16 | 4.64 | 0.89 | 6.57 | 0.88 | 2.18 | 11/65.00 | not sampled |
| fling + glide timing | 135 | 16.60 | 25.00 | 54.20 | 2 | 0 | 6.16 | 0.94 | 0.38 | 0.55 | 2.41 | 0.35 | 5.12 | 0.42 | 0.60 | 1/53.00 | not sampled |
| wayfinder / one turn in 1.5 s timing | 186 | 16.60 | 24.90 | 29.20 | 0 | 0 | 5.47 | 0.50 | 0.30 | 0.21 | 2.58 | 0.33 | 5.05 | 0.47 | 0.31 | 0/0.00 | not sampled |
| slow pan with glow timing | 194 | 16.70 | 25.10 | 58.40 | 5 | 0 | 6.46 | 1.07 | 0.35 | 0.72 | 3.13 | 0.38 | 5.37 | 0.64 | 0.51 | 1/56.00 | not sampled |
| stop glide timing | 171 | 29.30 | 41.70 | 54.20 | 84 | 0 | 7.39 | 6.46 | 5.14 | 1.32 | 4.89 | 2.09 | 5.50 | 0.56 | 6.91 | 0/0.00 | not sampled |
| rush into blast timing | 398 | 12.50 | 33.40 | 49.90 | 38 | 0 | 7.15 | 2.34 | 1.72 | 0.62 | 1.78 | 0.81 | 2.57 | 0.46 | 1.46 | 0/0.00 | not sampled |
| map -> Laurier timing | 110 | 33.40 | 45.80 | 46.00 | 93 | 0 | 8.98 | 9.21 | 7.62 | 1.59 | 6.08 | 2.75 | 5.93 | 0.81 | 8.77 | 0/0.00 | not sampled |
| Laurier -> HMC timing | 138 | 29.10 | 37.60 | 41.80 | 45 | 0 | 6.87 | 7.63 | 6.05 | 1.58 | 5.22 | 2.26 | 4.67 | 0.59 | 8.21 | 0/0.00 | not sampled |
| HMC again -> Interkom timing | 115 | 29.20 | 37.50 | 37.50 | 30 | 0 | 6.92 | 7.77 | 6.20 | 1.57 | 5.13 | 2.30 | 4.84 | 0.62 | 5.51 | 0/0.00 | not sampled |
| Interkom -> HMC again / Back timing | 136 | 25.00 | 33.40 | 41.80 | 18 | 0 | 5.76 | 6.43 | 5.15 | 1.28 | 4.16 | 2.05 | 4.36 | 0.51 | 4.82 | 0/0.00 | not sampled |

### precision-timing / journey-joined

| Scenario | Frames | p50 | p95 | Max | >33 | >100 | Script | Style+layout | Layout | Style | Paint | Pre-paint | Layerize | Commit | Raster | Long/max | Blank/captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 163 | 16.60 | 45.70 | 62.60 | 13 | 0 | 4.94 | 2.67 | 0.85 | 1.82 | 2.87 | 0.51 | 4.68 | 0.53 | 1.67 | 2/52.00 | not sampled |
| fling + glide timing | 151 | 12.50 | 20.90 | 37.60 | 2 | 0 | 4.46 | 1.12 | 0.35 | 0.78 | 2.09 | 0.35 | 4.53 | 0.43 | 0.57 | 0/0.00 | not sampled |
| wayfinder / one turn in 1.5 s timing | 224 | 12.50 | 16.70 | 25.10 | 0 | 0 | 3.46 | 0.43 | 0.26 | 0.17 | 2.22 | 0.28 | 4.46 | 0.40 | 0.27 | 0/0.00 | not sampled |
| slow pan with glow timing | 269 | 12.50 | 20.70 | 45.90 | 3 | 0 | 3.73 | 0.81 | 0.26 | 0.55 | 2.32 | 0.30 | 4.46 | 0.50 | 0.38 | 0/0.00 | not sampled |
| stop glide timing | 265 | 20.80 | 25.10 | 37.50 | 5 | 0 | 4.12 | 4.37 | 3.47 | 0.90 | 2.99 | 1.43 | 3.99 | 0.37 | 5.92 | 0/0.00 | not sampled |
| rush into blast timing | 553 | 8.40 | 25.00 | 37.60 | 4 | 0 | 4.30 | 1.72 | 1.24 | 0.48 | 1.34 | 0.61 | 2.10 | 0.35 | 1.13 | 0/0.00 | not sampled |
| map -> Laurier timing | 119 | 33.30 | 41.70 | 41.80 | 80 | 0 | 7.39 | 8.67 | 7.08 | 1.59 | 6.08 | 2.49 | 5.56 | 0.78 | 8.30 | 0/0.00 | not sampled |
| Laurier -> HMC timing | 184 | 20.90 | 29.10 | 33.30 | 3 | 0 | 4.71 | 5.70 | 4.52 | 1.18 | 3.63 | 1.83 | 4.00 | 0.42 | 7.22 | 0/0.00 | not sampled |
| HMC again -> Interkom timing | 160 | 20.80 | 25.10 | 37.50 | 2 | 0 | 4.47 | 5.63 | 4.51 | 1.12 | 3.47 | 1.82 | 4.07 | 0.42 | 4.76 | 0/0.00 | not sampled |
| Interkom -> HMC again / Back timing | 155 | 20.90 | 29.20 | 37.50 | 5 | 0 | 4.61 | 5.77 | 4.61 | 1.16 | 3.65 | 1.87 | 4.13 | 0.45 | 4.65 | 0/0.00 | not sampled |

### find-writes-timing / journey-map

| Scenario | Frames | p50 | p95 | Max | >33 | >100 | Script | Style+layout | Layout | Style | Paint | Pre-paint | Layerize | Commit | Raster | Long/max | Blank/captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 133 | 20.80 | 58.40 | 96.00 | 21 | 0 | 7.32 | 4.74 | 2.52 | 2.22 | 3.21 | 0.62 | 6.06 | 0.63 | 1.63 | 6/92.00 | not sampled |
| fling + glide timing | 130 | 16.70 | 25.00 | 41.60 | 2 | 0 | 5.60 | 0.87 | 0.35 | 0.52 | 2.39 | 0.33 | 6.57 | 0.41 | 0.42 | 0/0.00 | not sampled |
| wayfinder / one turn in 1.5 s timing | 172 | 16.70 | 25.00 | 29.30 | 0 | 0 | 5.44 | 0.49 | 0.28 | 0.21 | 2.60 | 0.33 | 6.33 | 0.46 | 0.34 | 0/0.00 | not sampled |
| slow pan with glow timing | 192 | 16.70 | 25.10 | 58.40 | 4 | 0 | 5.94 | 0.97 | 0.30 | 0.67 | 2.87 | 0.35 | 6.54 | 0.55 | 0.41 | 0/0.00 | not sampled |
| stop glide timing | 84 | 58.30 | 75.10 | 87.70 | 82 | 0 | 7.08 | 35.64 | 34.24 | 1.40 | 4.94 | 2.52 | 5.01 | 0.60 | 6.21 | 66/89.00 | not sampled |
| rush into blast timing | 332 | 12.50 | 62.50 | 79.20 | 52 | 0 | 6.66 | 6.02 | 5.43 | 0.59 | 1.74 | 0.73 | 2.57 | 0.43 | 0.82 | 40/71.00 | not sampled |
| map -> Laurier timing | 81 | 54.20 | 66.80 | 91.80 | 80 | 0 | 7.65 | 31.17 | 30.03 | 1.14 | 4.93 | 2.48 | 5.28 | 0.68 | 6.09 | 49/83.00 | not sampled |
| Laurier -> HMC timing | 82 | 58.30 | 71.00 | 83.40 | 78 | 0 | 6.83 | 34.35 | 33.04 | 1.32 | 5.19 | 2.56 | 4.99 | 0.57 | 6.05 | 70/81.00 | not sampled |
| HMC again -> Interkom timing | 72 | 58.30 | 75.00 | 100.10 | 66 | 1 | 6.56 | 34.07 | 32.77 | 1.30 | 5.05 | 2.50 | 5.10 | 0.58 | 4.05 | 62/89.00 | not sampled |
| Interkom -> HMC again / Back timing | 72 | 54.30 | 70.90 | 75.10 | 67 | 0 | 6.31 | 33.42 | 32.15 | 1.27 | 4.62 | 2.46 | 4.95 | 0.56 | 4.00 | 53/72.00 | not sampled |

### find-writes-timing / journey-joined

| Scenario | Frames | p50 | p95 | Max | >33 | >100 | Script | Style+layout | Layout | Style | Paint | Pre-paint | Layerize | Commit | Raster | Long/max | Blank/captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 148 | 16.70 | 58.30 | 87.60 | 18 | 0 | 5.18 | 4.29 | 2.20 | 2.09 | 3.18 | 0.58 | 5.82 | 0.57 | 1.47 | 6/89.00 | not sampled |
| fling + glide timing | 123 | 16.70 | 25.00 | 45.90 | 3 | 0 | 4.99 | 1.30 | 0.41 | 0.89 | 2.60 | 0.40 | 6.64 | 0.47 | 0.46 | 0/0.00 | not sampled |
| wayfinder / one turn in 1.5 s timing | 179 | 16.70 | 24.90 | 29.20 | 0 | 0 | 3.85 | 0.56 | 0.32 | 0.23 | 2.79 | 0.34 | 6.48 | 0.47 | 0.33 | 0/0.00 | not sampled |
| slow pan with glow timing | 222 | 16.60 | 20.90 | 50.00 | 2 | 0 | 4.02 | 0.90 | 0.29 | 0.60 | 2.74 | 0.33 | 6.54 | 0.51 | 0.39 | 0/0.00 | not sampled |
| stop glide timing | 80 | 62.50 | 83.40 | 91.70 | 77 | 0 | 6.87 | 37.46 | 35.91 | 1.55 | 5.48 | 2.70 | 5.25 | 0.72 | 6.86 | 67/88.00 | not sampled |
| rush into blast timing | 389 | 8.40 | 58.40 | 79.00 | 53 | 0 | 4.59 | 5.37 | 4.84 | 0.53 | 1.68 | 0.66 | 2.48 | 0.39 | 0.71 | 39/80.00 | not sampled |
| map -> Laurier timing | 83 | 54.20 | 75.00 | 87.50 | 80 | 0 | 6.38 | 32.37 | 31.18 | 1.19 | 5.03 | 2.49 | 5.28 | 0.70 | 5.94 | 48/81.00 | not sampled |
| Laurier -> HMC timing | 85 | 58.30 | 79.10 | 83.40 | 79 | 0 | 6.09 | 34.70 | 33.26 | 1.45 | 5.62 | 2.60 | 5.03 | 0.62 | 6.23 | 64/83.00 | not sampled |
| HMC again -> Interkom timing | 72 | 58.30 | 79.20 | 87.50 | 68 | 0 | 5.59 | 36.61 | 35.21 | 1.40 | 4.87 | 2.60 | 5.12 | 0.64 | 4.09 | 59/83.00 | not sampled |
| Interkom -> HMC again / Back timing | 72 | 58.30 | 70.90 | 75.00 | 66 | 0 | 5.45 | 35.20 | 33.86 | 1.34 | 4.78 | 2.56 | 4.98 | 0.57 | 4.03 | 58/73.00 | not sampled |

### desktop-timing / journey-map

| Scenario | Frames | p50 | p95 | Max | >33 | >100 | Script | Style+layout | Layout | Style | Paint | Pre-paint | Layerize | Commit | Raster | Long/max | Blank/captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| map -> Laurier timing | 401 | 8.40 | 12.60 | 20.90 | 0 | 0 | 1.33 | 5.15 | 4.98 | 0.17 | 0.81 | 0.48 | 1.14 | 0.15 | 8.54 | 0/0.00 | not sampled |
| Laurier -> HMC timing | 380 | 8.40 | 12.60 | 16.70 | 0 | 0 | 1.14 | 6.13 | 5.94 | 0.19 | 0.75 | 0.47 | 1.04 | 0.12 | 9.55 | 0/0.00 | not sampled |
| HMC again -> Interkom timing | 329 | 8.40 | 12.60 | 16.80 | 0 | 0 | 1.16 | 5.94 | 5.74 | 0.20 | 0.75 | 0.45 | 1.17 | 0.15 | 10.79 | 0/0.00 | not sampled |
| Interkom -> HMC again / Back timing | 316 | 12.40 | 12.60 | 16.70 | 0 | 0 | 1.23 | 6.11 | 5.89 | 0.21 | 0.84 | 0.49 | 1.24 | 0.16 | 10.84 | 0/0.00 | not sampled |

### desktop-timing / journey-joined

| Scenario | Frames | p50 | p95 | Max | >33 | >100 | Script | Style+layout | Layout | Style | Paint | Pre-paint | Layerize | Commit | Raster | Long/max | Blank/captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| map -> Laurier timing | 455 | 8.30 | 12.50 | 16.70 | 0 | 0 | 1.15 | 4.45 | 4.29 | 0.16 | 0.71 | 0.38 | 1.00 | 0.14 | 7.51 | 0/0.00 | not sampled |
| Laurier -> HMC timing | 396 | 8.40 | 12.60 | 16.80 | 0 | 0 | 1.13 | 5.64 | 5.45 | 0.20 | 0.80 | 0.43 | 1.02 | 0.13 | 8.80 | 0/0.00 | not sampled |
| HMC again -> Interkom timing | 302 | 12.40 | 16.70 | 20.90 | 0 | 0 | 1.27 | 6.52 | 6.29 | 0.23 | 0.86 | 0.47 | 1.19 | 0.17 | 10.13 | 0/0.00 | not sampled |
| Interkom -> HMC again / Back timing | 359 | 8.40 | 12.60 | 16.80 | 0 | 0 | 1.04 | 5.34 | 5.14 | 0.20 | 0.72 | 0.41 | 1.08 | 0.15 | 9.27 | 0/0.00 | not sampled |

### final-capture / journey-map

| Scenario | Frames | p50 | p95 | Max | >33 | >100 | Script | Style+layout | Layout | Style | Paint | Pre-paint | Layerize | Commit | Raster | Long/max | Blank/captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats capture | 125 | 24.90 | 58.40 | 116.70 | 26 | 1 | 8.68 | 5.17 | 2.73 | 2.44 | 3.43 | 0.75 | 6.51 | 0.75 | 1.67 | 7/110.00 | 0/146 |
| fling + glide capture | 117 | 16.80 | 25.00 | 45.90 | 3 | 0 | 6.75 | 1.28 | 0.41 | 0.87 | 2.58 | 0.42 | 6.57 | 0.50 | 0.46 | 0/0.00 | 0/120 |
| wayfinder / one turn in 1.5 s capture | 149 | 20.80 | 25.10 | 37.60 | 3 | 0 | 6.36 | 0.65 | 0.38 | 0.27 | 3.24 | 0.42 | 6.92 | 0.56 | 0.40 | 0/0.00 | 0/152 |
| slow pan with glow capture | 185 | 20.70 | 25.10 | 62.60 | 3 | 0 | 6.38 | 1.04 | 0.32 | 0.72 | 3.04 | 0.35 | 6.80 | 0.57 | 0.43 | 1/62.00 | 0/188 |
| stop glide capture | 86 | 58.30 | 75.00 | 83.40 | 84 | 0 | 7.09 | 35.29 | 33.92 | 1.37 | 4.67 | 2.54 | 4.90 | 0.58 | 6.20 | 71/79.00 | 0/89 |
| rush into blast capture | 310 | 12.60 | 58.30 | 70.90 | 56 | 0 | 7.23 | 6.21 | 5.58 | 0.63 | 1.80 | 0.76 | 2.77 | 0.46 | 0.84 | 37/69.00 | 0/313 |
| map -> Laurier capture | 81 | 54.20 | 66.70 | 70.90 | 80 | 0 | 7.47 | 31.31 | 30.12 | 1.19 | 4.91 | 2.52 | 5.30 | 0.71 | 5.94 | 51/71.00 | 0/88 |
| Laurier -> HMC capture | 84 | 54.30 | 70.90 | 75.00 | 77 | 0 | 6.70 | 33.30 | 31.96 | 1.34 | 4.93 | 2.50 | 4.85 | 0.57 | 5.91 | 66/74.00 | 0/96 |
| HMC again -> Interkom capture | 72 | 54.30 | 66.70 | 75.10 | 67 | 0 | 6.38 | 33.69 | 32.36 | 1.33 | 4.56 | 2.49 | 4.95 | 0.57 | 3.94 | 60/69.00 | 0/86 |
| Interkom -> HMC again / Back capture | 72 | 54.20 | 71.00 | 75.10 | 69 | 0 | 6.48 | 33.63 | 32.31 | 1.32 | 4.72 | 2.47 | 5.00 | 0.60 | 3.96 | 60/73.00 | 0/89 |

### final-capture / journey-joined

| Scenario | Frames | p50 | p95 | Max | >33 | >100 | Script | Style+layout | Layout | Style | Paint | Pre-paint | Layerize | Commit | Raster | Long/max | Blank/captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats capture | 142 | 16.80 | 58.40 | 116.70 | 23 | 1 | 5.91 | 4.92 | 2.55 | 2.37 | 3.15 | 0.66 | 6.09 | 0.63 | 1.67 | 6/105.00 | 0/162 |
| fling + glide capture | 133 | 16.70 | 25.00 | 37.60 | 2 | 0 | 4.15 | 0.91 | 0.41 | 0.50 | 2.86 | 0.37 | 6.64 | 0.41 | 0.37 | 0/0.00 | 0/136 |
| wayfinder / one turn in 1.5 s capture | 186 | 16.60 | 20.90 | 33.30 | 1 | 0 | 3.86 | 0.52 | 0.31 | 0.21 | 2.77 | 0.34 | 6.32 | 0.46 | 0.32 | 0/0.00 | 0/190 |
| slow pan with glow capture | 209 | 16.70 | 25.00 | 66.70 | 3 | 0 | 4.46 | 0.97 | 0.30 | 0.67 | 2.93 | 0.33 | 6.81 | 0.53 | 0.40 | 1/63.00 | 0/212 |
| stop glide capture | 98 | 54.20 | 70.80 | 75.00 | 85 | 0 | 5.91 | 31.25 | 29.93 | 1.32 | 4.38 | 2.30 | 4.74 | 0.56 | 5.93 | 61/76.00 | 0/96 |
| rush into blast capture | 361 | 12.40 | 58.30 | 75.00 | 53 | 0 | 5.18 | 5.67 | 5.11 | 0.56 | 1.81 | 0.70 | 2.59 | 0.41 | 0.74 | 40/74.00 | 0/350 |
| map -> Laurier capture | 80 | 54.30 | 70.80 | 71.00 | 79 | 0 | 6.61 | 34.49 | 33.23 | 1.26 | 5.44 | 2.51 | 5.23 | 0.72 | 6.22 | 64/71.00 | 0/89 |
| Laurier -> HMC capture | 82 | 58.40 | 79.20 | 83.50 | 78 | 0 | 6.55 | 37.54 | 36.02 | 1.51 | 5.34 | 2.63 | 5.05 | 0.64 | 6.03 | 75/80.00 | 0/97 |
| HMC again -> Interkom capture | 71 | 62.50 | 71.00 | 75.00 | 69 | 0 | 6.21 | 37.04 | 35.56 | 1.47 | 5.26 | 2.59 | 5.09 | 0.63 | 3.96 | 61/74.00 | 0/88 |
| Interkom -> HMC again / Back capture | 71 | 58.40 | 75.00 | 79.20 | 66 | 0 | 6.00 | 36.75 | 35.30 | 1.45 | 4.98 | 2.54 | 5.02 | 0.62 | 4.07 | 62/74.00 | 0/90 |

## Rendered comparison counts

Raw changed pixels, without a color tolerance, against the pre-edit captures.
Glides use the brief's label-box (0.5 CSS px) and constant-stroke gates;
the 0.5 percent raster limit applies to rest frames. Tiny GPU rounding
differences in glides are retained here rather than discarded.

### writes-visual

| Capture | Changed/total pixels | Percent | Max label-box delta px | Max stroke-width delta px |
| --- | ---: | ---: | ---: | ---: |
| 1440x900x1-journey-map-beat-top | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-map | 2/1296000 | 0.000154 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-laurier | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-hmc1 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-mohawk | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-hmc2 | 1/1296000 | 0.000077 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-interkom | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-lennard | 2/1296000 | 0.000154 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-x | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-end | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-closed-laurier | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-closed-hmc1 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-closed-mohawk | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-closed-hmc2 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-closed-interkom | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-closed-lennard | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-explore | 3/1296000 | 0.000231 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-wayfinder | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-laurier | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-hmc1 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-hmc2 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-interkom | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-lennard | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-ravens | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-serpent | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-beacon | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-runestone | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-hammer | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-mist | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-horn | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-well | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-longship | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-0300 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-0600 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-0900 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-1200 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-1500 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-1800 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-2100 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-2400 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-2700 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-3000 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-3300 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-3600 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-top | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-map | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-laurier | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-hmc1 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-mohawk | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-hmc2 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-interkom | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-lennard | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-x | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-end | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-closed-laurier | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-closed-hmc1 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-closed-mohawk | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-closed-hmc2 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-closed-interkom | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-closed-lennard | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-explore | 18/1296000 | 0.001389 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-wayfinder | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-laurier | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-hmc1 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-hmc2 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-interkom | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-lennard | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-ravens | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-serpent | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-beacon | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-runestone | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-hammer | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-mist | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-horn | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-well | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-longship | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-0300 | 1/1296000 | 0.000077 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-0600 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-0900 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-1200 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-1500 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-1800 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-2100 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-2400 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-2700 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-3000 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-3300 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-3600 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-top | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-map | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-laurier | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-hmc1 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-mohawk | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-hmc2 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-interkom | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-lennard | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-x | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-end | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-closed-laurier | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-closed-hmc1 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-closed-mohawk | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-closed-hmc2 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-closed-interkom | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-closed-lennard | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-explore | 7/300760 | 0.002327 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-wayfinder | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-hoard-laurier | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-hoard-hmc1 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-hoard-hmc2 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-hoard-interkom | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-hoard-lennard | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-ravens | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-serpent | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-beacon | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-runestone | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-hammer | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-mist | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-horn | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-well | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-longship | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-0300 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-0600 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-0900 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-1200 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-1500 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-1800 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-2100 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-2400 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-2700 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-3000 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-3300 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-3600 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-top | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-map | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-laurier | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-hmc1 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-mohawk | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-hmc2 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-interkom | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-lennard | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-x | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-end | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-closed-laurier | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-closed-hmc1 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-closed-mohawk | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-closed-hmc2 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-closed-interkom | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-closed-lennard | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-explore | 7/300760 | 0.002327 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-wayfinder | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-laurier | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-hmc1 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-hmc2 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-interkom | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-lennard | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-ravens | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-serpent | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-beacon | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-runestone | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-hammer | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-mist | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-horn | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-well | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-longship | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-0300 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-0600 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-0900 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-1200 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-1500 | 3/300760 | 0.000997 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-1800 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-2100 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-2400 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-2700 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-3000 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-3300 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-3600 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-top | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-map | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-laurier | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-hmc1 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-mohawk | 10250/2073112 | 0.494426 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-hmc2 | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-interkom | 163/2073112 | 0.007863 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-lennard | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-x | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-end | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-closed-laurier | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-closed-hmc1 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-closed-mohawk | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-closed-hmc2 | 2/2073112 | 0.000096 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-closed-interkom | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-closed-lennard | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-explore | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-wayfinder | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-laurier | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-hmc1 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-hmc2 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-interkom | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-lennard | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-ravens | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-serpent | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-beacon | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-runestone | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-hammer | 16/2073112 | 0.000772 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-mist | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-horn | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-well | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-longship | 3/2073112 | 0.000145 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-0300 | 3/2073112 | 0.000145 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-0600 | 7/2073112 | 0.000338 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-0900 | 49121/2073112 | 2.369433 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-1200 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-1500 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-1800 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-2100 | 2/2073112 | 0.000096 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-2400 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-2700 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-3000 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-3300 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-3600 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-top | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-map | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-laurier | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-hmc1 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-mohawk | 7556/2073112 | 0.364476 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-hmc2 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-interkom | 163/2073112 | 0.007863 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-lennard | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-x | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-end | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-closed-laurier | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-closed-hmc1 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-closed-mohawk | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-closed-hmc2 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-closed-interkom | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-closed-lennard | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-explore | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-wayfinder | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-laurier | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-hmc1 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-hmc2 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-interkom | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-lennard | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-ravens | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-serpent | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-beacon | 1106/2073112 | 0.053350 | 0.072327 | 0.000000 |
| 412x730x2.625-journey-joined-find-runestone | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-hammer | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-mist | 0/2073112 | 0.000000 | 0.140625 | 0.000000 |
| 412x730x2.625-journey-joined-find-horn | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-well | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-longship | 7/2073112 | 0.000338 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-0300 | 12/2073112 | 0.000579 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-0600 | 44585/2073112 | 2.150632 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-0900 | 14/2073112 | 0.000675 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-1200 | 138/2073112 | 0.006657 | 0.046860 | 0.000000 |
| 412x730x2.625-journey-joined-glide-1500 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-1800 | 102126/2073112 | 4.926217 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-2100 | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-2400 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-2700 | 2/2073112 | 0.000096 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-3000 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-3300 | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-3600 | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |

Rest frames: 192; worst 0.494426 percent. Glide frames: 72; max label-box delta 0.046860 px; max stroke-width delta 0.000000 px.

### precision-visual

| Capture | Changed/total pixels | Percent | Max label-box delta px | Max stroke-width delta px |
| --- | ---: | ---: | ---: | ---: |
| 1440x900x1-journey-map-beat-top | 0/1296000 | 0.000000 | 1.611938 | 0.000000 |
| 1440x900x1-journey-map-beat-map | 1199/1296000 | 0.092515 | 1.612366 | 0.000000 |
| 1440x900x1-journey-map-beat-laurier | 1319/1296000 | 0.101775 | 6.423096 | 0.000000 |
| 1440x900x1-journey-map-beat-hmc1 | 292/1296000 | 0.022531 | 6.423080 | 0.000000 |
| 1440x900x1-journey-map-beat-mohawk | 1528/1296000 | 0.117901 | 6.423096 | 0.000000 |
| 1440x900x1-journey-map-beat-hmc2 | 695/1296000 | 0.053627 | 6.423080 | 0.000000 |
| 1440x900x1-journey-map-beat-interkom | 2556/1296000 | 0.197222 | 6.423065 | 0.000000 |
| 1440x900x1-journey-map-beat-lennard | 482/1296000 | 0.037191 | 6.423035 | 0.000000 |
| 1440x900x1-journey-map-beat-x | 4362/1296000 | 0.336574 | 4.705200 | 0.000000 |
| 1440x900x1-journey-map-beat-end | 0/1296000 | 0.000000 | 4.705200 | 0.000000 |
| 1440x900x1-journey-map-closed-laurier | 2204/1296000 | 0.170062 | 6.423096 | 0.000000 |
| 1440x900x1-journey-map-closed-hmc1 | 1329/1296000 | 0.102546 | 6.423080 | 0.000000 |
| 1440x900x1-journey-map-closed-mohawk | 2293/1296000 | 0.176929 | 6.423096 | 0.000000 |
| 1440x900x1-journey-map-closed-hmc2 | 1016/1296000 | 0.078395 | 6.423080 | 0.000000 |
| 1440x900x1-journey-map-closed-interkom | 3025/1296000 | 0.233410 | 6.423065 | 0.000000 |
| 1440x900x1-journey-map-closed-lennard | 1071/1296000 | 0.082639 | 6.423035 | 0.000000 |
| 1440x900x1-journey-map-explore | 776/1296000 | 0.059877 | 1.617126 | 0.000000 |
| 1440x900x1-journey-map-find-wayfinder | 1944/1296000 | 0.150000 | 4.041443 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-laurier | 1348/1296000 | 0.104012 | 15.128418 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-hmc1 | 104/1296000 | 0.008025 | 15.113159 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-hmc2 | 2271/1296000 | 0.175231 | 15.141235 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-interkom | 1761/1296000 | 0.135880 | 15.109924 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-lennard | 384/1296000 | 0.029630 | 15.132813 | 0.000000 |
| 1440x900x1-journey-map-find-ravens | 1761/1296000 | 0.135880 | 15.140198 | 0.000000 |
| 1440x900x1-journey-map-find-serpent | 725/1296000 | 0.055941 | 12.414978 | 0.000000 |
| 1440x900x1-journey-map-find-beacon | 2764/1296000 | 0.213272 | 6.658295 | 0.000000 |
| 1440x900x1-journey-map-find-runestone | 140/1296000 | 0.010802 | 15.137207 | 0.000000 |
| 1440x900x1-journey-map-find-hammer | 1020/1296000 | 0.078704 | 15.097900 | 0.000000 |
| 1440x900x1-journey-map-find-mist | 1320/1296000 | 0.101852 | 10.167236 | 0.000000 |
| 1440x900x1-journey-map-find-horn | 51/1296000 | 0.003935 | 15.133057 | 0.000000 |
| 1440x900x1-journey-map-find-well | 510/1296000 | 0.039352 | 8.499878 | 0.000000 |
| 1440x900x1-journey-map-find-longship | 1621/1296000 | 0.125077 | 15.140900 | 0.000000 |
| 1440x900x1-journey-map-glide-0300 | 240/1296000 | 0.018519 | 1.560852 | 0.000000 |
| 1440x900x1-journey-map-glide-0600 | 1524/1296000 | 0.117593 | 1.461121 | 0.000000 |
| 1440x900x1-journey-map-glide-0900 | 1184/1296000 | 0.091358 | 1.563202 | 0.000000 |
| 1440x900x1-journey-map-glide-1200 | 2538/1296000 | 0.195833 | 1.467834 | 0.000000 |
| 1440x900x1-journey-map-glide-1500 | 2468/1296000 | 0.190432 | 2.696167 | 0.000000 |
| 1440x900x1-journey-map-glide-1800 | 2288/1296000 | 0.176543 | 3.120056 | 0.000000 |
| 1440x900x1-journey-map-glide-2100 | 2039/1296000 | 0.157330 | 3.612610 | 0.000000 |
| 1440x900x1-journey-map-glide-2400 | 2296/1296000 | 0.177160 | 4.271118 | 0.000000 |
| 1440x900x1-journey-map-glide-2700 | 3862/1296000 | 0.297994 | 4.871094 | 0.000000 |
| 1440x900x1-journey-map-glide-3000 | 2483/1296000 | 0.191590 | 5.673218 | 0.000000 |
| 1440x900x1-journey-map-glide-3300 | 2493/1296000 | 0.192361 | 6.168823 | 0.000000 |
| 1440x900x1-journey-map-glide-3600 | 1672/1296000 | 0.129012 | 6.446289 | 0.000000 |
| 1440x900x1-journey-joined-beat-top | 0/1296000 | 0.000000 | 1.611938 | 0.000000 |
| 1440x900x1-journey-joined-beat-map | 1201/1296000 | 0.092670 | 1.612366 | 0.000000 |
| 1440x900x1-journey-joined-beat-laurier | 1319/1296000 | 0.101775 | 6.423096 | 0.000000 |
| 1440x900x1-journey-joined-beat-hmc1 | 292/1296000 | 0.022531 | 6.423080 | 0.000000 |
| 1440x900x1-journey-joined-beat-mohawk | 1528/1296000 | 0.117901 | 6.423096 | 0.000000 |
| 1440x900x1-journey-joined-beat-hmc2 | 694/1296000 | 0.053549 | 6.423080 | 0.000000 |
| 1440x900x1-journey-joined-beat-interkom | 2556/1296000 | 0.197222 | 6.423065 | 0.000000 |
| 1440x900x1-journey-joined-beat-lennard | 482/1296000 | 0.037191 | 6.423035 | 0.000000 |
| 1440x900x1-journey-joined-beat-x | 4451/1296000 | 0.343441 | 4.705200 | 0.000000 |
| 1440x900x1-journey-joined-beat-end | 0/1296000 | 0.000000 | 4.705200 | 0.000000 |
| 1440x900x1-journey-joined-closed-laurier | 2204/1296000 | 0.170062 | 6.423096 | 0.000000 |
| 1440x900x1-journey-joined-closed-hmc1 | 1329/1296000 | 0.102546 | 6.423080 | 0.000000 |
| 1440x900x1-journey-joined-closed-mohawk | 2293/1296000 | 0.176929 | 6.423096 | 0.000000 |
| 1440x900x1-journey-joined-closed-hmc2 | 1016/1296000 | 0.078395 | 6.423080 | 0.000000 |
| 1440x900x1-journey-joined-closed-interkom | 3058/1296000 | 0.235957 | 6.423065 | 0.000000 |
| 1440x900x1-journey-joined-closed-lennard | 1070/1296000 | 0.082562 | 6.423035 | 0.000000 |
| 1440x900x1-journey-joined-explore | 785/1296000 | 0.060571 | 1.617126 | 0.000000 |
| 1440x900x1-journey-joined-find-wayfinder | 1944/1296000 | 0.150000 | 4.041443 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-laurier | 1348/1296000 | 0.104012 | 15.128418 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-hmc1 | 104/1296000 | 0.008025 | 15.113159 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-hmc2 | 2271/1296000 | 0.175231 | 15.141235 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-interkom | 1761/1296000 | 0.135880 | 15.109924 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-lennard | 384/1296000 | 0.029630 | 15.132813 | 0.000000 |
| 1440x900x1-journey-joined-find-ravens | 1761/1296000 | 0.135880 | 15.140198 | 0.000000 |
| 1440x900x1-journey-joined-find-serpent | 725/1296000 | 0.055941 | 12.414978 | 0.000000 |
| 1440x900x1-journey-joined-find-beacon | 2764/1296000 | 0.213272 | 6.658295 | 0.000000 |
| 1440x900x1-journey-joined-find-runestone | 140/1296000 | 0.010802 | 15.137207 | 0.000000 |
| 1440x900x1-journey-joined-find-hammer | 1020/1296000 | 0.078704 | 15.097900 | 0.000000 |
| 1440x900x1-journey-joined-find-mist | 1320/1296000 | 0.101852 | 10.167236 | 0.000000 |
| 1440x900x1-journey-joined-find-horn | 51/1296000 | 0.003935 | 15.133057 | 0.000000 |
| 1440x900x1-journey-joined-find-well | 510/1296000 | 0.039352 | 8.499878 | 0.000000 |
| 1440x900x1-journey-joined-find-longship | 1621/1296000 | 0.125077 | 15.140900 | 0.000000 |
| 1440x900x1-journey-joined-glide-0300 | 240/1296000 | 0.018519 | 1.560852 | 0.000000 |
| 1440x900x1-journey-joined-glide-0600 | 1524/1296000 | 0.117593 | 1.461121 | 0.000000 |
| 1440x900x1-journey-joined-glide-0900 | 1184/1296000 | 0.091358 | 1.563202 | 0.000000 |
| 1440x900x1-journey-joined-glide-1200 | 2538/1296000 | 0.195833 | 1.467834 | 0.000000 |
| 1440x900x1-journey-joined-glide-1500 | 2468/1296000 | 0.190432 | 2.696167 | 0.000000 |
| 1440x900x1-journey-joined-glide-1800 | 2288/1296000 | 0.176543 | 3.120056 | 0.000000 |
| 1440x900x1-journey-joined-glide-2100 | 2041/1296000 | 0.157485 | 3.612610 | 0.000000 |
| 1440x900x1-journey-joined-glide-2400 | 2296/1296000 | 0.177160 | 4.271118 | 0.000000 |
| 1440x900x1-journey-joined-glide-2700 | 3862/1296000 | 0.297994 | 4.871094 | 0.000000 |
| 1440x900x1-journey-joined-glide-3000 | 2483/1296000 | 0.191590 | 5.673218 | 0.000000 |
| 1440x900x1-journey-joined-glide-3300 | 2493/1296000 | 0.192361 | 6.168823 | 0.000000 |
| 1440x900x1-journey-joined-glide-3600 | 1672/1296000 | 0.129012 | 6.446289 | 0.000000 |
| 412x730x1-journey-map-beat-top | 0/300760 | 0.000000 | 1.460876 | 0.000000 |
| 412x730x1-journey-map-beat-map | 1179/300760 | 0.392007 | 1.460876 | 0.000000 |
| 412x730x1-journey-map-beat-laurier | 4/300760 | 0.001330 | 6.345642 | 0.000000 |
| 412x730x1-journey-map-beat-hmc1 | 62/300760 | 0.020614 | 6.345612 | 0.000000 |
| 412x730x1-journey-map-beat-mohawk | 404/300760 | 0.134326 | 6.345642 | 0.000000 |
| 412x730x1-journey-map-beat-hmc2 | 0/300760 | 0.000000 | 6.345612 | 0.000000 |
| 412x730x1-journey-map-beat-interkom | 0/300760 | 0.000000 | 6.345612 | 0.000000 |
| 412x730x1-journey-map-beat-lennard | 19/300760 | 0.006317 | 6.345642 | 0.000000 |
| 412x730x1-journey-map-beat-x | 456/300760 | 0.151616 | 4.495636 | 0.000000 |
| 412x730x1-journey-map-beat-end | 0/300760 | 0.000000 | 4.495636 | 0.000000 |
| 412x730x1-journey-map-closed-laurier | 423/300760 | 0.140644 | 6.345642 | 0.000000 |
| 412x730x1-journey-map-closed-hmc1 | 830/300760 | 0.275968 | 6.345612 | 0.000000 |
| 412x730x1-journey-map-closed-mohawk | 840/300760 | 0.279292 | 6.345642 | 0.000000 |
| 412x730x1-journey-map-closed-hmc2 | 372/300760 | 0.123687 | 6.345612 | 0.000000 |
| 412x730x1-journey-map-closed-interkom | 251/300760 | 0.083455 | 6.345612 | 0.000000 |
| 412x730x1-journey-map-closed-lennard | 331/300760 | 0.110055 | 6.345642 | 0.000000 |
| 412x730x1-journey-map-explore | 10580/300760 | 3.517755 | 1.831024 | 0.000000 |
| 412x730x1-journey-map-find-wayfinder | 160/300760 | 0.053199 | 5.150940 | 0.000000 |
| 412x730x1-journey-map-find-hoard-laurier | 0/300760 | 0.000000 | 13.990051 | 0.000000 |
| 412x730x1-journey-map-find-hoard-hmc1 | 0/300760 | 0.000000 | 13.990112 | 0.000000 |
| 412x730x1-journey-map-find-hoard-hmc2 | 0/300760 | 0.000000 | 13.990112 | 0.000000 |
| 412x730x1-journey-map-find-hoard-interkom | 0/300760 | 0.000000 | 13.990112 | 0.000000 |
| 412x730x1-journey-map-find-hoard-lennard | 0/300760 | 0.000000 | 13.990051 | 0.000000 |
| 412x730x1-journey-map-find-ravens | 0/300760 | 0.000000 | 10.074005 | 0.000000 |
| 412x730x1-journey-map-find-serpent | 200/300760 | 0.066498 | 8.499176 | 0.000000 |
| 412x730x1-journey-map-find-beacon | 482/300760 | 0.160261 | 4.322464 | 0.000000 |
| 412x730x1-journey-map-find-runestone | 0/300760 | 0.000000 | 10.577209 | 0.000000 |
| 412x730x1-journey-map-find-hammer | 0/300760 | 0.000000 | 12.401245 | 0.000000 |
| 412x730x1-journey-map-find-mist | 220/300760 | 0.073148 | 6.878540 | 0.000000 |
| 412x730x1-journey-map-find-horn | 1/300760 | 0.000332 | 13.990112 | 0.000000 |
| 412x730x1-journey-map-find-well | 247/300760 | 0.082125 | 5.630615 | 0.000000 |
| 412x730x1-journey-map-find-longship | 40/300760 | 0.013300 | 12.401215 | 0.000000 |
| 412x730x1-journey-map-glide-0300 | 1223/300760 | 0.406637 | 1.461121 | 0.000000 |
| 412x730x1-journey-map-glide-0600 | 730/300760 | 0.242718 | 1.867584 | 0.000000 |
| 412x730x1-journey-map-glide-0900 | 38/300760 | 0.012635 | 1.548492 | 0.000000 |
| 412x730x1-journey-map-glide-1200 | 2296/300760 | 0.763399 | 1.461060 | 0.000000 |
| 412x730x1-journey-map-glide-1500 | 1504/300760 | 0.500066 | 1.481995 | 0.000000 |
| 412x730x1-journey-map-glide-1800 | 1634/300760 | 0.543290 | 2.180969 | 0.000000 |
| 412x730x1-journey-map-glide-2100 | 716/300760 | 0.238064 | 2.898163 | 0.000000 |
| 412x730x1-journey-map-glide-2400 | 735/300760 | 0.244381 | 3.812256 | 0.000000 |
| 412x730x1-journey-map-glide-2700 | 850/300760 | 0.282617 | 4.617523 | 0.000000 |
| 412x730x1-journey-map-glide-3000 | 343/300760 | 0.114044 | 5.287659 | 0.000000 |
| 412x730x1-journey-map-glide-3300 | 366/300760 | 0.121692 | 5.446167 | 0.000000 |
| 412x730x1-journey-map-glide-3600 | 318/300760 | 0.105732 | 6.176270 | 0.000000 |
| 412x730x1-journey-joined-beat-top | 0/300760 | 0.000000 | 1.460876 | 0.000000 |
| 412x730x1-journey-joined-beat-map | 1178/300760 | 0.391674 | 1.460876 | 0.000000 |
| 412x730x1-journey-joined-beat-laurier | 4/300760 | 0.001330 | 6.345642 | 0.000000 |
| 412x730x1-journey-joined-beat-hmc1 | 62/300760 | 0.020614 | 6.345612 | 0.000000 |
| 412x730x1-journey-joined-beat-mohawk | 404/300760 | 0.134326 | 6.345642 | 0.000000 |
| 412x730x1-journey-joined-beat-hmc2 | 0/300760 | 0.000000 | 6.345612 | 0.000000 |
| 412x730x1-journey-joined-beat-interkom | 0/300760 | 0.000000 | 6.345612 | 0.000000 |
| 412x730x1-journey-joined-beat-lennard | 19/300760 | 0.006317 | 6.345642 | 0.000000 |
| 412x730x1-journey-joined-beat-x | 456/300760 | 0.151616 | 4.495636 | 0.000000 |
| 412x730x1-journey-joined-beat-end | 0/300760 | 0.000000 | 4.495636 | 0.000000 |
| 412x730x1-journey-joined-closed-laurier | 423/300760 | 0.140644 | 6.345642 | 0.000000 |
| 412x730x1-journey-joined-closed-hmc1 | 830/300760 | 0.275968 | 6.345612 | 0.000000 |
| 412x730x1-journey-joined-closed-mohawk | 840/300760 | 0.279292 | 6.345642 | 0.000000 |
| 412x730x1-journey-joined-closed-hmc2 | 372/300760 | 0.123687 | 6.345612 | 0.000000 |
| 412x730x1-journey-joined-closed-interkom | 251/300760 | 0.083455 | 6.345612 | 0.000000 |
| 412x730x1-journey-joined-closed-lennard | 331/300760 | 0.110055 | 6.345642 | 0.000000 |
| 412x730x1-journey-joined-explore | 10587/300760 | 3.520082 | 1.831024 | 0.000000 |
| 412x730x1-journey-joined-find-wayfinder | 160/300760 | 0.053199 | 5.150940 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-laurier | 0/300760 | 0.000000 | 13.990051 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-hmc1 | 0/300760 | 0.000000 | 13.990112 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-hmc2 | 0/300760 | 0.000000 | 13.990112 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-interkom | 0/300760 | 0.000000 | 13.990112 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-lennard | 0/300760 | 0.000000 | 13.990051 | 0.000000 |
| 412x730x1-journey-joined-find-ravens | 0/300760 | 0.000000 | 10.074005 | 0.000000 |
| 412x730x1-journey-joined-find-serpent | 200/300760 | 0.066498 | 8.499176 | 0.000000 |
| 412x730x1-journey-joined-find-beacon | 482/300760 | 0.160261 | 4.322464 | 0.000000 |
| 412x730x1-journey-joined-find-runestone | 0/300760 | 0.000000 | 10.577209 | 0.000000 |
| 412x730x1-journey-joined-find-hammer | 0/300760 | 0.000000 | 12.401245 | 0.000000 |
| 412x730x1-journey-joined-find-mist | 220/300760 | 0.073148 | 6.878540 | 0.000000 |
| 412x730x1-journey-joined-find-horn | 1/300760 | 0.000332 | 13.990112 | 0.000000 |
| 412x730x1-journey-joined-find-well | 247/300760 | 0.082125 | 5.630615 | 0.000000 |
| 412x730x1-journey-joined-find-longship | 40/300760 | 0.013300 | 12.401215 | 0.000000 |
| 412x730x1-journey-joined-glide-0300 | 1223/300760 | 0.406637 | 1.461121 | 0.000000 |
| 412x730x1-journey-joined-glide-0600 | 730/300760 | 0.242718 | 1.867584 | 0.000000 |
| 412x730x1-journey-joined-glide-0900 | 38/300760 | 0.012635 | 1.548492 | 0.000000 |
| 412x730x1-journey-joined-glide-1200 | 2340/300760 | 0.778029 | 1.461060 | 0.000000 |
| 412x730x1-journey-joined-glide-1500 | 1507/300760 | 0.501064 | 1.481995 | 0.000000 |
| 412x730x1-journey-joined-glide-1800 | 1634/300760 | 0.543290 | 2.180969 | 0.000000 |
| 412x730x1-journey-joined-glide-2100 | 716/300760 | 0.238064 | 2.898163 | 0.000000 |
| 412x730x1-journey-joined-glide-2400 | 735/300760 | 0.244381 | 3.812256 | 0.000000 |
| 412x730x1-journey-joined-glide-2700 | 850/300760 | 0.282617 | 4.617523 | 0.000000 |
| 412x730x1-journey-joined-glide-3000 | 343/300760 | 0.114044 | 5.287659 | 0.000000 |
| 412x730x1-journey-joined-glide-3300 | 366/300760 | 0.121692 | 5.446167 | 0.000000 |
| 412x730x1-journey-joined-glide-3600 | 318/300760 | 0.105732 | 6.176270 | 0.000000 |
| 412x730x2.625-journey-map-beat-top | 0/2073112 | 0.000000 | 1.460876 | 0.000000 |
| 412x730x2.625-journey-map-beat-map | 56906/2073112 | 2.744955 | 1.460876 | 0.000000 |
| 412x730x2.625-journey-map-beat-laurier | 10447/2073112 | 0.503928 | 6.345642 | 0.000000 |
| 412x730x2.625-journey-map-beat-hmc1 | 10710/2073112 | 0.516615 | 6.345612 | 0.000000 |
| 412x730x2.625-journey-map-beat-mohawk | 1445/2073112 | 0.069702 | 6.345642 | 0.000000 |
| 412x730x2.625-journey-map-beat-hmc2 | 10964/2073112 | 0.528867 | 6.345612 | 0.000000 |
| 412x730x2.625-journey-map-beat-interkom | 11399/2073112 | 0.549850 | 6.345612 | 0.000000 |
| 412x730x2.625-journey-map-beat-lennard | 11224/2073112 | 0.541408 | 6.345642 | 0.000000 |
| 412x730x2.625-journey-map-beat-x | 2535/2073112 | 0.122280 | 4.495636 | 0.000000 |
| 412x730x2.625-journey-map-beat-end | 0/2073112 | 0.000000 | 4.495636 | 0.000000 |
| 412x730x2.625-journey-map-closed-laurier | 2146/2073112 | 0.103516 | 6.345642 | 0.000000 |
| 412x730x2.625-journey-map-closed-hmc1 | 3839/2073112 | 0.185181 | 6.345612 | 0.000000 |
| 412x730x2.625-journey-map-closed-mohawk | 3944/2073112 | 0.190245 | 6.345642 | 0.000000 |
| 412x730x2.625-journey-map-closed-hmc2 | 2914/2073112 | 0.140562 | 6.345612 | 0.000000 |
| 412x730x2.625-journey-map-closed-interkom | 2094/2073112 | 0.101008 | 6.345612 | 0.000000 |
| 412x730x2.625-journey-map-closed-lennard | 5007/2073112 | 0.241521 | 6.345642 | 0.000000 |
| 412x730x2.625-journey-map-explore | 2605/2073112 | 0.125657 | 1.831024 | 0.000000 |
| 412x730x2.625-journey-map-find-wayfinder | 1400/2073112 | 0.067531 | 5.150940 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-laurier | 0/2073112 | 0.000000 | 13.990051 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-hmc1 | 0/2073112 | 0.000000 | 13.990112 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-hmc2 | 0/2073112 | 0.000000 | 13.990112 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-interkom | 0/2073112 | 0.000000 | 13.990112 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-lennard | 0/2073112 | 0.000000 | 13.990051 | 0.000000 |
| 412x730x2.625-journey-map-find-ravens | 0/2073112 | 0.000000 | 10.074005 | 0.000000 |
| 412x730x2.625-journey-map-find-serpent | 1101/2073112 | 0.053109 | 8.499176 | 0.000000 |
| 412x730x2.625-journey-map-find-beacon | 2214/2073112 | 0.106796 | 4.322464 | 0.000000 |
| 412x730x2.625-journey-map-find-runestone | 0/2073112 | 0.000000 | 10.577209 | 0.000000 |
| 412x730x2.625-journey-map-find-hammer | 16/2073112 | 0.000772 | 12.401245 | 0.000000 |
| 412x730x2.625-journey-map-find-mist | 1370/2073112 | 0.066084 | 6.878540 | 0.000000 |
| 412x730x2.625-journey-map-find-horn | 9/2073112 | 0.000434 | 13.990112 | 0.000000 |
| 412x730x2.625-journey-map-find-well | 2362/2073112 | 0.113935 | 5.630615 | 0.000000 |
| 412x730x2.625-journey-map-find-longship | 1221/2073112 | 0.058897 | 12.401215 | 0.000000 |
| 412x730x2.625-journey-map-glide-0300 | 50727/2073112 | 2.446901 | 1.461121 | 0.000000 |
| 412x730x2.625-journey-map-glide-0600 | 45189/2073112 | 2.179766 | 1.867584 | 0.000000 |
| 412x730x2.625-journey-map-glide-0900 | 50353/2073112 | 2.428861 | 1.548492 | 0.000000 |
| 412x730x2.625-journey-map-glide-1200 | 114206/2073112 | 5.508916 | 1.461060 | 0.000000 |
| 412x730x2.625-journey-map-glide-1500 | 119130/2073112 | 5.746433 | 1.481995 | 0.000000 |
| 412x730x2.625-journey-map-glide-1800 | 112407/2073112 | 5.422138 | 2.180969 | 0.000000 |
| 412x730x2.625-journey-map-glide-2100 | 106926/2073112 | 5.157753 | 2.898163 | 0.000000 |
| 412x730x2.625-journey-map-glide-2400 | 112456/2073112 | 5.424502 | 3.812256 | 0.000000 |
| 412x730x2.625-journey-map-glide-2700 | 103574/2073112 | 4.996064 | 4.617523 | 0.000000 |
| 412x730x2.625-journey-map-glide-3000 | 99777/2073112 | 4.812909 | 5.287659 | 0.000000 |
| 412x730x2.625-journey-map-glide-3300 | 101066/2073112 | 4.875086 | 5.446167 | 0.000000 |
| 412x730x2.625-journey-map-glide-3600 | 133568/2073112 | 6.442874 | 6.176270 | 0.000000 |
| 412x730x2.625-journey-joined-beat-top | 49/2073112 | 0.002364 | 1.460876 | 0.000000 |
| 412x730x2.625-journey-joined-beat-map | 7912/2073112 | 0.381648 | 1.460876 | 0.000000 |
| 412x730x2.625-journey-joined-beat-laurier | 7751/2073112 | 0.373882 | 6.345642 | 0.000000 |
| 412x730x2.625-journey-joined-beat-hmc1 | 8015/2073112 | 0.386617 | 6.345612 | 0.000000 |
| 412x730x2.625-journey-joined-beat-mohawk | 9001/2073112 | 0.434178 | 6.345642 | 0.000000 |
| 412x730x2.625-journey-joined-beat-hmc2 | 8269/2073112 | 0.398869 | 6.345612 | 0.000000 |
| 412x730x2.625-journey-joined-beat-interkom | 8859/2073112 | 0.427329 | 6.345612 | 0.000000 |
| 412x730x2.625-journey-joined-beat-lennard | 8528/2073112 | 0.411362 | 6.345642 | 0.000000 |
| 412x730x2.625-journey-joined-beat-x | 2535/2073112 | 0.122280 | 4.495636 | 0.000000 |
| 412x730x2.625-journey-joined-beat-end | 0/2073112 | 0.000000 | 4.495636 | 0.000000 |
| 412x730x2.625-journey-joined-closed-laurier | 2146/2073112 | 0.103516 | 6.345642 | 0.000000 |
| 412x730x2.625-journey-joined-closed-hmc1 | 3841/2073112 | 0.185277 | 6.345612 | 0.000000 |
| 412x730x2.625-journey-joined-closed-mohawk | 3944/2073112 | 0.190245 | 6.345642 | 0.000000 |
| 412x730x2.625-journey-joined-closed-hmc2 | 2914/2073112 | 0.140562 | 6.345612 | 0.000000 |
| 412x730x2.625-journey-joined-closed-interkom | 2094/2073112 | 0.101008 | 6.345612 | 0.000000 |
| 412x730x2.625-journey-joined-closed-lennard | 5007/2073112 | 0.241521 | 6.345642 | 0.000000 |
| 412x730x2.625-journey-joined-explore | 2610/2073112 | 0.125898 | 1.831024 | 0.000000 |
| 412x730x2.625-journey-joined-find-wayfinder | 1400/2073112 | 0.067531 | 5.150940 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-laurier | 0/2073112 | 0.000000 | 13.990051 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-hmc1 | 0/2073112 | 0.000000 | 13.990112 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-hmc2 | 0/2073112 | 0.000000 | 13.990112 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-interkom | 0/2073112 | 0.000000 | 13.990112 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-lennard | 0/2073112 | 0.000000 | 13.990051 | 0.000000 |
| 412x730x2.625-journey-joined-find-ravens | 0/2073112 | 0.000000 | 10.074005 | 0.000000 |
| 412x730x2.625-journey-joined-find-serpent | 1057/2073112 | 0.050986 | 8.499176 | 0.000000 |
| 412x730x2.625-journey-joined-find-beacon | 2914/2073112 | 0.140562 | 4.322464 | 0.000000 |
| 412x730x2.625-journey-joined-find-runestone | 0/2073112 | 0.000000 | 10.577209 | 0.000000 |
| 412x730x2.625-journey-joined-find-hammer | 0/2073112 | 0.000000 | 12.401245 | 0.000000 |
| 412x730x2.625-journey-joined-find-mist | 1370/2073112 | 0.066084 | 6.878540 | 0.000000 |
| 412x730x2.625-journey-joined-find-horn | 9/2073112 | 0.000434 | 13.990112 | 0.000000 |
| 412x730x2.625-journey-joined-find-well | 2362/2073112 | 0.113935 | 5.630615 | 0.000000 |
| 412x730x2.625-journey-joined-find-longship | 1225/2073112 | 0.059090 | 12.401215 | 0.000000 |
| 412x730x2.625-journey-joined-glide-0300 | 7596/2073112 | 0.366406 | 1.461121 | 0.000000 |
| 412x730x2.625-journey-joined-glide-0600 | 1018/2073112 | 0.049105 | 1.867584 | 0.000000 |
| 412x730x2.625-journey-joined-glide-0900 | 50693/2073112 | 2.445261 | 1.548492 | 0.000000 |
| 412x730x2.625-journey-joined-glide-1200 | 114458/2073112 | 5.521072 | 1.461060 | 0.000000 |
| 412x730x2.625-journey-joined-glide-1500 | 119509/2073112 | 5.764715 | 1.481995 | 0.000000 |
| 412x730x2.625-journey-joined-glide-1800 | 112786/2073112 | 5.440420 | 2.180969 | 0.000000 |
| 412x730x2.625-journey-joined-glide-2100 | 107308/2073112 | 5.176180 | 2.898163 | 0.000000 |
| 412x730x2.625-journey-joined-glide-2400 | 112835/2073112 | 5.442784 | 3.812256 | 0.000000 |
| 412x730x2.625-journey-joined-glide-2700 | 103953/2073112 | 5.014346 | 4.617523 | 0.000000 |
| 412x730x2.625-journey-joined-glide-3000 | 99934/2073112 | 4.820482 | 5.287659 | 0.000000 |
| 412x730x2.625-journey-joined-glide-3300 | 101001/2073112 | 4.871951 | 5.446167 | 0.000000 |
| 412x730x2.625-journey-joined-glide-3600 | 132699/2073112 | 6.400957 | 6.176270 | 0.000000 |

Rest frames: 192; worst 3.520082 percent. Glide frames: 72; max label-box delta 6.446289 px; max stroke-width delta 0.000000 px.

### final-visual

| Capture | Changed/total pixels | Percent | Max label-box delta px | Max stroke-width delta px |
| --- | ---: | ---: | ---: | ---: |
| 1440x900x1-journey-map-beat-top | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-map | 2/1296000 | 0.000154 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-laurier | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-hmc1 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-mohawk | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-hmc2 | 1/1296000 | 0.000077 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-interkom | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-lennard | 1/1296000 | 0.000077 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-x | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-end | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-closed-laurier | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-closed-hmc1 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-closed-mohawk | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-closed-hmc2 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-closed-interkom | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-closed-lennard | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-explore | 3/1296000 | 0.000231 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-wayfinder | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-laurier | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-hmc1 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-hmc2 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-interkom | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-lennard | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-ravens | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-serpent | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-beacon | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-runestone | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-hammer | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-mist | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-horn | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-well | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-longship | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-0300 | 1/1296000 | 0.000077 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-0600 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-0900 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-1200 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-1500 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-1800 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-2100 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-2400 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-2700 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-3000 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-3300 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-3600 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-top | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-map | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-laurier | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-hmc1 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-mohawk | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-hmc2 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-interkom | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-lennard | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-x | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-end | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-closed-laurier | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-closed-hmc1 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-closed-mohawk | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-closed-hmc2 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-closed-interkom | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-closed-lennard | 1/1296000 | 0.000077 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-explore | 18/1296000 | 0.001389 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-wayfinder | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-laurier | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-hmc1 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-hmc2 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-interkom | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-lennard | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-ravens | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-serpent | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-beacon | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-runestone | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-hammer | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-mist | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-horn | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-well | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-longship | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-0300 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-0600 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-0900 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-1200 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-1500 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-1800 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-2100 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-2400 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-2700 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-3000 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-3300 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-3600 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-top | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-map | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-laurier | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-hmc1 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-mohawk | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-hmc2 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-interkom | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-lennard | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-x | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-end | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-closed-laurier | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-closed-hmc1 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-closed-mohawk | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-closed-hmc2 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-closed-interkom | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-closed-lennard | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-explore | 7/300760 | 0.002327 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-wayfinder | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-hoard-laurier | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-hoard-hmc1 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-hoard-hmc2 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-hoard-interkom | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-hoard-lennard | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-ravens | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-serpent | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-beacon | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-runestone | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-hammer | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-mist | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-horn | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-well | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-longship | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-0300 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-0600 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-0900 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-1200 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-1500 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-1800 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-2100 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-2400 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-2700 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-3000 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-3300 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-3600 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-top | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-map | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-laurier | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-hmc1 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-mohawk | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-hmc2 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-interkom | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-lennard | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-x | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-end | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-closed-laurier | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-closed-hmc1 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-closed-mohawk | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-closed-hmc2 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-closed-interkom | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-closed-lennard | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-explore | 7/300760 | 0.002327 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-wayfinder | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-laurier | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-hmc1 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-hmc2 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-interkom | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-lennard | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-ravens | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-serpent | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-beacon | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-runestone | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-hammer | 5/300760 | 0.001662 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-mist | 5/300760 | 0.001662 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-horn | 5/300760 | 0.001662 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-well | 5/300760 | 0.001662 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-longship | 5/300760 | 0.001662 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-0300 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-0600 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-0900 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-1200 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-1500 | 3/300760 | 0.000997 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-1800 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-2100 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-2400 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-2700 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-3000 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-3300 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-3600 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-top | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-map | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-laurier | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-hmc1 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-mohawk | 10252/2073112 | 0.494522 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-hmc2 | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-interkom | 2/2073112 | 0.000096 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-lennard | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-x | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-end | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-closed-laurier | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-closed-hmc1 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-closed-mohawk | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-closed-hmc2 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-closed-interkom | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-closed-lennard | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-explore | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-wayfinder | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-laurier | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-hmc1 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-hmc2 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-interkom | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-lennard | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-ravens | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-serpent | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-beacon | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-runestone | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-hammer | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-mist | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-horn | 67424/2073112 | 3.252309 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-well | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-longship | 3/2073112 | 0.000145 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-0300 | 3/2073112 | 0.000145 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-0600 | 6/2073112 | 0.000289 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-0900 | 68/2073112 | 0.003280 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-1200 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-1500 | 2/2073112 | 0.000096 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-1800 | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-2100 | 3/2073112 | 0.000145 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-2400 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-2700 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-3000 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-3300 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-3600 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-top | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-map | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-laurier | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-hmc1 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-mohawk | 7556/2073112 | 0.364476 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-hmc2 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-interkom | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-lennard | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-x | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-end | 2/2073112 | 0.000096 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-closed-laurier | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-closed-hmc1 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-closed-mohawk | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-closed-hmc2 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-closed-interkom | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-closed-lennard | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-explore | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-wayfinder | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-laurier | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-hmc1 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-hmc2 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-interkom | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-lennard | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-ravens | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-serpent | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-beacon | 1106/2073112 | 0.053350 | 0.072327 | 0.000000 |
| 412x730x2.625-journey-joined-find-runestone | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-hammer | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-mist | 0/2073112 | 0.000000 | 0.140625 | 0.000000 |
| 412x730x2.625-journey-joined-find-horn | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-well | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-longship | 7/2073112 | 0.000338 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-0300 | 12/2073112 | 0.000579 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-0600 | 44587/2073112 | 2.150728 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-0900 | 11/2073112 | 0.000531 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-1200 | 140/2073112 | 0.006753 | 0.046860 | 0.000000 |
| 412x730x2.625-journey-joined-glide-1500 | 2/2073112 | 0.000096 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-1800 | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-2100 | 4/2073112 | 0.000193 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-2400 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-2700 | 7/2073112 | 0.000338 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-3000 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-3300 | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-3600 | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |

Rest frames: 192; worst 3.252309 percent. Glide frames: 72; max label-box delta 0.046860 px; max stroke-width delta 0.000000 px.

### final-isolated

| Capture | Changed/total pixels | Percent | Max label-box delta px | Max stroke-width delta px |
| --- | ---: | ---: | ---: | ---: |
| 1440x900x1-journey-map-beat-top | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-map | 2/1296000 | 0.000154 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-laurier | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-hmc1 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-mohawk | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-hmc2 | 1/1296000 | 0.000077 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-interkom | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-lennard | 1/1296000 | 0.000077 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-x | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-beat-end | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-closed-laurier | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-closed-hmc1 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-closed-mohawk | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-closed-hmc2 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-closed-interkom | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-closed-lennard | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-explore | 3/1296000 | 0.000231 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-wayfinder | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-laurier | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-hmc1 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-hmc2 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-interkom | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-hoard-lennard | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-ravens | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-serpent | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-beacon | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-runestone | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-hammer | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-mist | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-horn | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-well | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-find-longship | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-0300 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-0600 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-0900 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-1200 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-1500 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-1800 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-2100 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-2400 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-2700 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-3000 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-3300 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-map-glide-3600 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-top | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-map | 2/1296000 | 0.000154 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-laurier | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-hmc1 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-mohawk | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-hmc2 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-interkom | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-lennard | 1/1296000 | 0.000077 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-x | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-beat-end | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-closed-laurier | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-closed-hmc1 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-closed-mohawk | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-closed-hmc2 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-closed-interkom | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-closed-lennard | 1/1296000 | 0.000077 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-explore | 18/1296000 | 0.001389 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-wayfinder | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-laurier | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-hmc1 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-hmc2 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-interkom | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-hoard-lennard | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-ravens | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-serpent | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-beacon | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-runestone | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-hammer | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-mist | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-horn | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-well | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-find-longship | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-0300 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-0600 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-0900 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-1200 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-1500 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-1800 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-2100 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-2400 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-2700 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-3000 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-3300 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 1440x900x1-journey-joined-glide-3600 | 0/1296000 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-top | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-map | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-laurier | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-hmc1 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-mohawk | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-hmc2 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-interkom | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-lennard | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-x | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-beat-end | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-closed-laurier | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-closed-hmc1 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-closed-mohawk | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-closed-hmc2 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-closed-interkom | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-closed-lennard | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-explore | 7/300760 | 0.002327 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-wayfinder | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-hoard-laurier | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-hoard-hmc1 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-hoard-hmc2 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-hoard-interkom | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-hoard-lennard | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-ravens | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-serpent | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-beacon | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-runestone | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-hammer | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-mist | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-horn | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-well | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-find-longship | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-0300 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-0600 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-0900 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-1200 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-1500 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-1800 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-2100 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-2400 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-2700 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-3000 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-3300 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-map-glide-3600 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-top | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-map | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-laurier | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-hmc1 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-mohawk | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-hmc2 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-interkom | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-lennard | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-x | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-beat-end | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-closed-laurier | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-closed-hmc1 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-closed-mohawk | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-closed-hmc2 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-closed-interkom | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-closed-lennard | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-explore | 7/300760 | 0.002327 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-wayfinder | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-laurier | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-hmc1 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-hmc2 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-interkom | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-hoard-lennard | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-ravens | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-serpent | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-beacon | 157/300760 | 0.052201 | 0.072327 | 0.000000 |
| 412x730x1-journey-joined-find-runestone | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-hammer | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-mist | 0/300760 | 0.000000 | 0.140625 | 0.000000 |
| 412x730x1-journey-joined-find-horn | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-well | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-find-longship | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-0300 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-0600 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-0900 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-1200 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-1500 | 3/300760 | 0.000997 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-1800 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-2100 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-2400 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-2700 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-3000 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-3300 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x1-journey-joined-glide-3600 | 0/300760 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-top | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-map | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-laurier | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-hmc1 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-mohawk | 10250/2073112 | 0.494426 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-hmc2 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-interkom | 2/2073112 | 0.000096 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-lennard | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-x | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-beat-end | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-closed-laurier | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-closed-hmc1 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-closed-mohawk | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-closed-hmc2 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-closed-interkom | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-closed-lennard | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-explore | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-wayfinder | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-laurier | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-hmc1 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-hmc2 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-interkom | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-hoard-lennard | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-ravens | 43/2073112 | 0.002074 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-serpent | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-beacon | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-runestone | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-hammer | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-mist | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-horn | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-well | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-find-longship | 3/2073112 | 0.000145 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-0300 | 3/2073112 | 0.000145 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-0600 | 6/2073112 | 0.000289 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-0900 | 49116/2073112 | 2.369192 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-1200 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-1500 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-1800 | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-2100 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-2400 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-2700 | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-3000 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-3300 | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-map-glide-3600 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-top | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-map | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-laurier | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-hmc1 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-mohawk | 3/2073112 | 0.000145 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-hmc2 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-interkom | 163/2073112 | 0.007863 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-lennard | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-x | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-beat-end | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-closed-laurier | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-closed-hmc1 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-closed-mohawk | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-closed-hmc2 | 2/2073112 | 0.000096 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-closed-interkom | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-closed-lennard | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-explore | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-wayfinder | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-laurier | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-hmc1 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-hmc2 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-interkom | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-hoard-lennard | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-ravens | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-serpent | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-beacon | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-runestone | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-hammer | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-mist | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-horn | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-well | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-find-longship | 7/2073112 | 0.000338 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-0300 | 12/2073112 | 0.000579 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-0600 | 44585/2073112 | 2.150632 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-0900 | 28/2073112 | 0.001351 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-1200 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-1500 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-1800 | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-2100 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-2400 | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-2700 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-3000 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-3300 | 1/2073112 | 0.000048 | 0.000000 | 0.000000 |
| 412x730x2.625-journey-joined-glide-3600 | 0/2073112 | 0.000000 | 0.000000 | 0.000000 |

Rest frames: 192; worst 0.494426 percent. Glide frames: 72; max label-box delta 0.000000 px; max stroke-width delta 0.000000 px.

Final phone performance gate: FAIL.

### report: node tools/glide-report-test.mjs

Exit 0.

```text
appended captured performance tables and every rendered pixel count
phone glide p95 <=50 ms and style+layout <=12 ms/frame: FAIL
isolated final rest pixel and glide label/stroke gates: PASS
```
