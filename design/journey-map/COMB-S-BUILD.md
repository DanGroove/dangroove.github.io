COMB-S build, 2026-11-27. Standalone built; acceptance remains incomplete. The picture gate fails, several performance bars fail, and the exact phone blink cause remains unconfirmed.

Both initial dist pages were copied before runtime edits. All 102 starting leaf checks returned; 30 had nonzero exits after artifact-routing retries. The full 107-check sweep was followed by targeted checks for the final measured correction. No starting failure was deliberately repaired. [Evidence and decisions](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-s/decisions.json).

- S1: one scheduler gives map, base, live, finds, anim, lines and veil independent current-camera rasters. No map raster draws ahead. Slack and base-coverage exceptions are retained and listed. The desktop/phone raster check passes all 16 move cases, confirms base coverage, final camera equality, and partial-trail dash error at most 0.051 px. [Frame/forced-slot records](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-s/s-raster-results.json).
- S2: looping ink uses ordered bounded SVGs, offscreen write guards and paused per-piece clocks. The final build has 32 ink pieces plus one clipped trail SVG. The resume check sampled 79 boundaries: largest translation and rotation changes were 0 map units and 0 degrees. Rigid loops still repaint their small SVGs and pause during camera moves; compositor-only rigid animation was not implemented. [Every layer box, write and resume sample](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-s/s-idle-results.json).
- S4: the p28 b strip has the Mohawk marker at 17.234522 s, lacks it at 17.251178 s, and has it again at 17.267622 s. The a strip keeps it. Cards/marker code is identical between those phone builds. Native diagnostics show the base markers sharing overlay backing; the revision keeps a persistent 44x44 marker backing. A preliminary PC trace then attributed a 19841x17901 paint clip to a marker. Stable promotion plus paint containment now bounds its paint, retaining 4 px for the keyboard outline; final hmc1 traces report 104x104 physical marker clips at DPR 2. This supports a backing/clip cause; no disappearing native frame was reproduced, so the exact phone cause is not signed off. [Layer evidence](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-s/s4-marker-analysis.json).
- S3: shadows use cached transform/opacity layers and invisible shadows stop receiving transform writes; the head has a 14 px paint clip. The growing trail uses one viewport-clipped SVG and its own held scale. A label-layer trial was reverted after 17343 desktop compass pixels exceeded 3/255. Labels remain in map-live, so their moving fades can still repaint a large layer. In the available hmc1 pair, large live paints fall from 528 to 9; shadow/head large paints fall from 851/526 to 0/0. [Rejected trial evidence](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-s/s3-label-trial/results.json).

The first PC main attempt exposed the excessive trail-layer/marker-clip cost and failed trace serialization. Consolidation reduced the unchanged style-count check from 155.28 to 102.81 elements/frame (limit 150). Final targeted raster, idle, source, scope, compass, beacon and budget checks pass; picture preservation does not. The failed preliminary pass is retained in [its complete console log](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-s/pc-main-console.log).

S6 used local headless Chrome, 127.0.0.1, 1920x950, DPR 2, trace and two alternating runs. Both preflight guards found no other Codex exec/wrapper; idle ChatGPT helpers were excluded. The final main invocation again hit "Invalid string length" serializing the new pinch trace. Run 2 of that invocation was never reached. The brief permits phone-fps edits only for rest beats, so the trace writer was left unchanged. Visit and rest groups completed both runs. The table contains 27 of 40 expected final windows; missing samples are N/A, not zero. [Final preflight/hash](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-s/pc-final-preflight.json), [Per-run metrics](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-s/metrics.json).

FPS and GPU p50/p90 are means of available runs; maximums are worst observed. >25/>50 are unrounded page-timestamp counts in run1/run2 order. GPU busy time is the union on CrGpuMain between ExecuteFrameCallbacks batches, as in R9. Large paints use finite clips larger than the physical viewport, from +1.5 s for moving rows and the whole rest window. M/B/L/F/A/V/N mean map/base/live/finds/anim/veil/lines; other nodes are named separately. [Every large paint node and clip](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-s/large-paints.csv).

| Row | Build | Runs | FPS | >25 r1/r2 | >50 r1/r2 | Max ms | GPU p50/p90/max ms | Large M/B/L/F/A/V/N | Other large paints |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| press:print | base | 1/2 | 202.2 | 0/N/A | 0/N/A | 25 | 1/6.63/24.32 | 0/0/0/0/692/0/0 | 0 |
| press:print | new | 1/2 | 199.8 | 3/N/A | 0/N/A | 29.2 | 1.09/5.71/29.22 | 0/0/0/0/0/0/0 | 0 |
| press:screen | base | 1/2 | 202.9 | 1/N/A | 0/N/A | 29.1 | 1.26/6.59/29.2 | 0/0/0/0/690/0/0 | 0 |
| press:screen | new | 1/2 | 196.4 | 5/N/A | 0/N/A | 37.6 | 1.21/6.01/38.76 | 0/0/0/0/0/0/0 | 0 |
| map | base | 1/2 | 189.8 | 12/N/A | 3/N/A | 75.1 | 3.85/5.78/73.66 | 4/5/18/4/114/0/0 | svg:39, div.tl-head:180, div.tl-rows.tl-f:1, div.tl-track:1, div#go:1 |
| map | new | 1/2 | 140.4 | 15/N/A | 0/N/A | 37.5 | 6.04/9.31/39.38 | 8/9/22/8/8/0/0 | svg:40, div.tl-track:1, div#go:1 |
| hmc1 | base | 1/2 | 200.4 | 9/N/A | 0/N/A | 45.9 | 3.56/5.42/46.7 | 3/2/528/4/66/0/0 | div.c-shadow:851, div.tl-head:526, svg:32, div.tl-track:1 |
| hmc1 | new | 1/2 | 163.1 | 4/N/A | 1/N/A | 54.3 | 5.12/7.57/55.84 | 5/2/9/8/6/0/0 | svg:30, div.tl-track:1 |
| end | base | 1/2 | 140.7 | 5/N/A | 0/N/A | 33.4 | 6.29/8.54/33.17 | 0/2/13/0/0/0/0 | svg:20 |
| end | new | 1/2 | 182.2 | 4/N/A | 0/N/A | 41.7 | 3.8/8.33/40.4 | 2/3/46/2/1/0/0 | svg:20 |
| explore:pinch | base | 1/2 | 134.1 | 51/N/A | 7/N/A | 54.3 | 5.96/9.9/55.35 | 43/43/548/243/243/0/0 | svg:684 |
| explore:pinch | new | 0/2 | N/A | N/A/N/A | N/A/N/A | N/A | N/A | N/A | N/A |
| visit:laurier | base | 2/2 | 175 | 12/8 | 3/0 | 79.2 | 4.71/6.62/76.21 | 0/0/0/0/0/0/0 | 0 |
| visit:laurier | new | 2/2 | 193.35 | 8/8 | 0/0 | 45.9 | 1.94/6.34/46.62 | 0/0/0/0/0/0/0 | 0 |
| visit:lennard | base | 2/2 | 202.9 | 4/5 | 0/0 | 41.7 | 2.97/5.93/42.25 | 0/0/0/0/0/0/0 | 0 |
| visit:lennard | new | 2/2 | 200.2 | 3/3 | 0/0 | 41.6 | 3.2/6.9/42.02 | 0/0/0/0/0/0/0 | 0 |
| rest:map | base | 2/2 | 234.3 | 0/0 | 0/0 | 8.4 | 1.22/1.55/6.5 | 0/0/0/0/1055.5/0/0 | 0 |
| rest:map | new | 2/2 | 234.45 | 0/0 | 0/0 | 8.4 | 1.08/1.5/4.28 | 0/0/0/0/0/0/0 | 0 |
| rest:compass | base | 2/2 | 234.7 | 0/0 | 0/0 | 4.4 | 0.87/1.24/3.25 | 0/0/0/0/1057/0/0 | 0 |
| rest:compass | new | 2/2 | 234.55 | 0/0 | 0/0 | 4.5 | 0.52/0.78/2.33 | 0/0/0/0/0/0/0 | 0 |

The unchanged runner acquires roughly 100 ms less than its nominal window and divides by that nominal duration. At 240 Hz this caps its reported 4.5 s FPS near 234.67, below the requested rest bar of 236. No extrapolation or timing-tool edit was made.

Worst recorded excesses against each new-build bar are below; "-" means that bar does not apply. Full per-run limits and missing-sample entries are in [the bar audit](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-s/bar-misses.json).

| Row | FPS shortfall | GPU p90 excess ms | Extra >25 frames | Extra >50 frames | Large paints |
| --- | --- | --- | --- | --- | --- |
| press:print | 30.2 | 1.71 | 2 | 0 | 0 |
| press:screen | 33.6 | 2.01 | 4 | 0 | 0 |
| map | - | - | 9 | 0 | - |
| hmc1 | - | - | 0 | 1 | - |
| end | - | - | 0 | 0 | - |
| explore:pinch | N/A | N/A | N/A | N/A | N/A |
| visit:laurier | 23.2 | - | 6 | 0 | - |
| visit:lennard | 14.8 | - | 1 | 0 | - |
| rest:map | 1.8 | 0 | 0 | 0 | 0 |
| rest:compass | 1.6 | 0 | 0 | 0 | 0 |

Trace attribution from the first recorded new window for each row (self time, not GPU time assigned to individual DOM nodes):

- press:print: GPU Flush 942.7 ms, Deserializing 832.1 ms; main FunctionCall 909.1 ms, PaintArtifactCompositor::Update 462.1 ms.
- press:screen: GPU Flush 1018.7 ms, Deserializing 856.1 ms; main FunctionCall 920.4 ms, PaintArtifactCompositor::Update 472.8 ms.
- map: GPU Flush 1665.4 ms, Deserializing 1551.9 ms; main FunctionCall 1219.6 ms, PaintArtifactCompositor::Update 419.2 ms.
- hmc1: GPU Flush 1860.1 ms, Deserializing 1292.9 ms; main FunctionCall 1381.8 ms, PaintArtifactCompositor::Update 475.7 ms.
- end: GPU Flush 1953 ms, Deserializing 1415.3 ms; main FunctionCall 1762.5 ms, PaintArtifactCompositor::Update 463.8 ms.
- visit:laurier: GPU Flush 1257.9 ms, Deserializing 921.3 ms; main FunctionCall 1434 ms, PaintArtifactCompositor::Update 393.7 ms.
- visit:lennard: GPU Deserializing 1745.5 ms, Flush 1231.6 ms; main FunctionCall 1498.3 ms, PaintArtifactCompositor::Update 383.8 ms.
- rest:map: GPU Flush 597 ms, Deserializing 326.9 ms; main FunctionCall 805.1 ms, PaintArtifactCompositor::Update 549.1 ms.
- rest:compass: GPU Flush 233.8 ms, Deserializing 136.4 ms; main FunctionCall 548.3 ms, PaintArtifactCompositor::Update 418.7 ms.

The unmasked picture check uses equal deterministic idle-clock reads and final finite CSS-animation times. No tolerance was raised. Largest channel differences:

| View | 1920x950 | 412x915 |
| --- | --- | --- |
| overview | 68/255 | 77/255 |
| explore | 74/255 | 86/255 |
| compass | 115/255 | 0/255 |
| beacon | 207/255 | 108/255 |
| serpent | 61/255 | 111/255 |

Test changes: added comb-s-raster (CDP moves, forced slots, coverage, final cameras, trail scale), comb-s-idle (bounded boxes, offscreen/moving writes, clocks and resume poses), unmasked comb-s-picture, native comb-s-marker, and byte-scope checks. The fixture/loader/suite route artifacts and suppress deletion without changing assertions. The trip source pin was re-recorded with a dated note; failed legacy drawing pins were retained. R compass now observes seven rasters and forced exceptions instead of the old two-commit focus cap, and accepts bounded idle ownership; R beacon changes only layer ownership. Q serpent waits through the staggered rest flush before its final detail sample; its fade thresholds are unchanged. Runtime/page budgets rose by 1.9 KB with a dated note. Only rest:map/rest:compass were added to phone-fps.

Last exits below include retries. "Yes" is a newly nonzero exit relative to the starting result; existing failing suites can stop at an earlier assertion. The earlier style-count regression was corrected. Q detail timing, E-probe startup EBUSY, and the unchanged joined-page air-count boundary passed on recheck. Legacy motion/find trace gates remain incomplete (IO.read timeout / Invalid string length); the full sweep was not repeated after the final two measured corrections, which received the targeted checks above.

| Test | Start | Last | New failure |
| --- | --- | --- | --- |
| S6 metrics analysis | - | 0 | New check |
| check | 0 | 0 | No |
| comb-a-browser-test | 1 | 1 | No |
| comb-b-art-test | 0 | 0 | No |
| comb-b-browser-test | 0 | 0 | No |
| comb-b-detail-test | 0 | 0 | No |
| comb-b-layout-test | 1 | 1 | No |
| comb-behaviour-test | 0 | 0 | No |
| comb-c-browser-test | 1 | 1 | No |
| comb-c-legend-test | 0 | 0 | No |
| comb-d-beacon-probe-test | 0 | 0 | No |
| comb-d-capture-test | 0 | 0 | No |
| comb-d-drawings-test | 0 | 0 | No |
| comb-d-evidence-test | 0 | 0 | No |
| comb-d-ink-test | 0 | 0 | No |
| comb-d-layout-test | 1 | 1 | No |
| comb-d-readings-test | 1 | 1 | No |
| comb-e-beam-test | 0 | 0 | No |
| comb-e-capture-test | 0 | 0 | No |
| comb-e-label-study-test | 0 | 0 | No |
| comb-e-place-test | 0 | 0 | No |
| comb-e-probe-test | 0 | 0 | No |
| comb-e-warm-test | 1 | 1 | No |
| comb-extra-test | 0 | 0 | No |
| comb-f-compare-test | 1 | 1 | No |
| comb-f-controls-test | 0 | 0 | No |
| comb-f-evidence-test | 0 | 0 | No |
| comb-f-interaction-test | 1 | 1 | No |
| comb-f-labels-test | 0 | 0 | No |
| comb-f-names-test | 0 | 0 | No |
| comb-f-report-test | 1 | 1 | No |
| comb-g-bar-test | 0 | 0 | No |
| comb-g-input-test | 1 | 0 | No |
| comb-g-layout-test | 0 | 0 | No |
| comb-g-preservation-test | 1 | 1 | No |
| comb-g-resize-test | 0 | 0 | No |
| comb-g-spatial-test | 0 | 0 | No |
| comb-g-wayfinder-test | 0 | 0 | No |
| comb-g2-actions-test | 0 | 0 | No |
| comb-g2-shine-extra-test | 0 | 0 | No |
| comb-g2-shine-test | 1 | 0 | No |
| comb-g2-spatial-test | 0 | 0 | No |
| comb-g3-card-test | 0 | 0 | No |
| comb-g3-console-test | 0 | 0 | No |
| comb-g3-extra-test | 0 | 0 | No |
| comb-g3-interaction-test | 0 | 0 | No |
| comb-g3-press-test | 0 | 0 | No |
| comb-l-drag-test | 0 | 0 | No |
| comb-l-explore-test | 0 | 0 | No |
| comb-l-layers-test | 0 | 0 | No |
| comb-l-motion-test | 0 | 1 | Yes |
| comb-l-preservation-test | 0 | 0 | No |
| comb-l-spatial-test | 0 | 0 | No |
| comb-l-spatial2-test | 0 | 0 | No |
| comb-l-summary-test | 1 | 1 | No |
| comb-l2-all-finds-test | 0 | 0 | No |
| comb-l2-beacon-test | 0 | 0 | No |
| comb-l2-checkpoints-test | 0 | 0 | No |
| comb-l2-counts-test | 1 | 1 | No |
| comb-l2-explore-state-test | 0 | 0 | No |
| comb-l2-finds-test | 0 | 1 | Yes |
| comb-l2-layers-test | 0 | 0 | No |
| comb-l2-phone-pixels-test | 0 | 0 | No |
| comb-l2-pixels-test | 1 | 1 | No |
| comb-l2-scope-test | 1 | 1 | No |
| comb-l2-smoke-test | 0 | 0 | No |
| comb-l2-wide-test | 0 | 0 | No |
| comb-m-browser-test | 1 | 1 | No |
| comb-m-layers-test | 1 | 1 | No |
| comb-m-state-test | 1 | 1 | No |
| comb-m2-bar-test | 0 | 0 | No |
| comb-m2-ship-test | 1 | 1 | No |
| comb-n-hold-test | 1 | 1 | No |
| comb-n-trail-test | 1 | 1 | No |
| comb-n-wolves-test | 0 | 0 | No |
| comb-o-dim-test | 1 | 1 | No |
| comb-o-focus-test | 0 | 0 | No |
| comb-o-ring-test | 0 | 0 | No |
| comb-p-chase-test | 0 | 0 | No |
| comb-p-quiet-test | 1 | 1 | No |
| comb-p-style-test | 0 | 0 | No |
| comb-q-serpent-test | 0 | 0 | No |
| comb-q-ygg-test | 0 | 0 | No |
| comb-r-beacon-test | 0 | 0 | No |
| comb-r-close-test | 0 | 0 | No |
| comb-r-compass-test | 0 | 0 | No |
| comb-r-legend-test | 0 | 0 | No |
| comb-r-picture-test | 1 | 1 | Yes, expanded views |
| comb-r-scope-test | 1 | 1 | No |
| comb-r-serpent-test | 0 | 0 | No |
| comb-r-skal-test | 0 | 0 | No |
| comb-r-visit-test | 0 | 0 | No |
| comb-reduced-test | 0 | 0 | No |
| comb-s-idle-test | - | 0 | New check |
| comb-s-marker-test | - | 0 | New check |
| comb-s-picture-test | - | 1 | New check, failed |
| comb-s-raster-test | - | 0 | New check |
| comb-s-scope-test | - | 0 | New check |
| depth-test | 0 | 0 | No |
| explore-test | 0 | 0 | No |
| finds-test | 0 | 0 | No |
| frame-performance-test | 1 | 1 | No |
| frame-render-test | 1 | 1 | No |
| glide-visual-test | 1 | 1 | No |
| layout-test | 0 | 0 | No |
| nova-test | 1 | 1 | No |
| phone-fps pc-main | - | 1 | New check, failed |
| phone-fps pc-main-final | - | 1 | New check, failed |
| phone-fps pc-rest-final | - | 0 | New check |
| phone-fps pc-visit-final | - | 0 | New check |
| phone-pass syntax (not executed) | - | 0 | New check |
| steps-test | 0 | 0 | No |
| syntax (24 files) | - | 0 | New check |
| trace-hitches moving (analysis) | - | 0 | New check |
| whirl2-test | 0 | 0 | No |

Omissions/limits: dist/journey-joined.html is byte-identical to its initial copy. pack-joined also writes protected joined.html, so it was not run; joined-file checks do not validate the revised standalone. The old R orchestration wrapper was replaced by the guarded S runner for its leaf inventory. The full phone blink/marker film gate is unrun. Remaining strict picture differences, compositor-only rigid loops, moving label paints, and missed performance bars are unresolved. The moving-window hitch analysis is in [the trace attribution](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-s/hitches-moving.log).

The staged [phone pass](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-s/phone-pass.ps1) serves fixed base/new copies under phone/, checks their SHA256 hashes, records 180 s chunks with rec-log.txt, runs map,hmc1,visit:laurier,press:screen,rest:map with --runs 2 --trace, then scans the films. Estimated running time is 13-16 minutes, including the final recording chunk and scan. The script was syntax-checked only. It was never run; adb was never invoked.

The approved Jormungandr, Skal and Skoll drawings and other protected files remain unchanged. [Scope evidence](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-s/s-scope-results.json). Browser profiles, partial captures and traces remain for cleanup; no cleanup deletions were performed.

The [design-critique-loop skill](C:/Users/Admin/.codex/skills/design-critique-loop/SKILL.md) requires "Use two reviewers other than the implementer". The explicit no-agents rule prevents that independent gate. No independent approval or visual score is claimed.
