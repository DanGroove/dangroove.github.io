COMB-R build, 2026-11-27. The standalone revision is built. Acceptance remains incomplete: R9 could not launch, the preservation gate fails, and the failed gates below remain. Work followed R1, R2, R3, R5, R4, R6, R7, then R9 preflight.

Both initial dist pages were copied before runtime edits. The 93 starting test-command exits and logs are in [baseline](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-r/baseline) and [baseline-extra](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-r/baseline-extra). Research, source authority, acceptance criteria, decisions and evidence are kept in [the external record](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-r/decisions.json).

- R1: quantized needle writes to 0.05 degrees, stopped settled springs, removed idle drift and rune rotation, and ended ring pulses. Idle ink now lives in map-anim, with original hit groups retained; growing lines have their own masked layer. Focus rasters commit one layer per frame, ahead on zoom-out and sharp at rest. Four craft cases record zero settled needle/rune/arm/ring mutations over two seconds, two hole builds each, and at most one observed commit per layer. Paint/FPS acceptance is unverified: the LayerTree paint-event probe emitted no positive-control events, so it was excluded from the required mutation test and retained as [an inconclusive diagnostic](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-r/r-compass-native-inconclusive.json).
- R2: explore stays active and glides to the journey hold camera with easeIO, geometric scale and the requested distance-based duration. Card growth and dim run over the final 0.5 s. Mouse/touch visits, X, Esc, dragging, rapid reopening and absence of a cut cover pass the targeted checks.
- R3: closing uses the reverse 0.5 s smooth curve and the opening pose history. Matched card boxes differ by 0.00 px in the tested desktop/phone cases; camera values stay within 0.01 px and 0.0001 scale.
- R5: ported the approved tankard paths, four poses, place calculation, mirror and ground line. Raise, 0.12 s clink, 0.3 s return, splash, clink-point rings, hints, hit box and reduced swaps are implemented. The ring origin is approximately (144, 501.476). Skal and the existing stage/hook names remain.
- R4: three supplied note positions and todo slots, glyph-bound word wrapping for English and its caption, ember arcs, staged flame/glow growth and the finale are implemented. Peak sampled English widths are 41.44 land / 38.94 sea units. Peak sea ink clearances are at least 7.16 coast / 3.01 frame units. The phone sea flash is 1.10 instead of 1.12 to preserve that clearance. Tests observe the flame reaching 3.40, ring radius 150, one beam turn, final flame 2.40, full notes and reduced-motion final states.
- R6: names are data-driven through final_v3_FINAL_real, four laps precede shipping on poke five, and extensions cycle. Neck curves counter-rotate into the current ribbon, including its hear swell; maximum sampled seam error is 0.050 map units and tangent error 1.88 degrees. The longest phone tag uses 85 percent type size after the measured viewport failure; desktop sizes remain unchanged.
- R7: the band is y851/height26, with its line at 851.5 and one centred row at y864. Pixel-sampled lowercase centres are within 0.2 px and gap spread within 0.5 px at all four requested sizes. 360 uses 4 px layout gaps; 8.5 px words were unnecessary. Short landscape retains its column. Underlying sea art is preserved, including its existing y818 stipple cutoff.

R8 now locates the audited pines by (357.8, 158.1) and (403.0, 351.4). The unchanged east-pine assertion still fails: its closest crown gap is about 0.60 map units, or -0.75 CSS px after ink at the tested fit. The tree drawing is outside the permitted edits; its threshold and the other pair assertions were retained.

Only node tools/pack.mjs refreshed dist/journey-map.html. pack-joined.mjs was omitted because it also writes protected joined.html; dist/journey-joined.html remains byte-identical to its initial copy. Joined-based tests therefore do not validate this revision. Reduced motion retains the existing static card list; no separate explore-visiting route exists there. Changing that main wiring is outside the permitted main.mjs layer edit.

Final runtime gzip is 216.13 KB / 216.3; standalone gzip 332.41 KB / 332.6. Budget increases are dated and limited to this part. Scope checks preserve 347 original file hashes, unlisted data/art and other find functions. Syntax checks passed.

R9: no paired PC pass ran. The guard observed external Codex processes from 17:41 through 17:59 UTC and actively waited 11.6 minutes in two intervals. PIDs 70232 (app-server), 64064 (exec-server), 21780 and 49732 (service/helpers) remained when the latest start time fitting the task budget passed. They were not terminated. No rAF/GPU/late-paint bar is assessed, and trace-hitches was not run without R9 traces. The [phone pass](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-r/phone-pass.ps1) is staged and syntax-checked only; it was never run and adb was never used.

Every N/A below covers unavailable FPS, over-25/50 counts, maximum interval, GPU main p50/p90/max and node repaint counts from +1.5 s.

| Build | Row | rAF fps | >25 / >50 | Max ms | GPU p50/p90/max ms | Late repaints by node |
| --- | --- | --- | --- | --- | --- | --- |
| base | press:print | N/A | N/A | N/A | N/A | N/A |
| new | press:print | N/A | N/A | N/A | N/A | N/A |
| base | press:video | N/A | N/A | N/A | N/A | N/A |
| new | press:video | N/A | N/A | N/A | N/A | N/A |
| base | press:motion | N/A | N/A | N/A | N/A | N/A |
| new | press:motion | N/A | N/A | N/A | N/A | N/A |
| base | press:screen | N/A | N/A | N/A | N/A | N/A |
| new | press:screen | N/A | N/A | N/A | N/A | N/A |
| base | map | N/A | N/A | N/A | N/A | N/A |
| new | map | N/A | N/A | N/A | N/A | N/A |
| base | hmc1 | N/A | N/A | N/A | N/A | N/A |
| new | hmc1 | N/A | N/A | N/A | N/A | N/A |
| base | end | N/A | N/A | N/A | N/A | N/A |
| new | end | N/A | N/A | N/A | N/A | N/A |
| base | explore:pinch | N/A | N/A | N/A | N/A | N/A |
| new | explore:pinch | N/A | N/A | N/A | N/A | N/A |
| base | visit:laurier | N/A | N/A | N/A | N/A | N/A |
| new | visit:laurier | N/A | N/A | N/A | N/A | N/A |
| base | visit:lennard | N/A | N/A | N/A | N/A | N/A |
| new | visit:lennard | N/A | N/A | N/A | N/A | N/A |

The fixed-clock, DPR 1 picture check uses the saved initial build, finished finite CSS animation states, and masks only the requested drawing changes. All ten views exceed 3/255 outside those masks. Captures and mask/camera metadata are in [the picture results](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-r/r-picture-results.json). Added differences include explore label placement and serpent detail levels at the sharper focus rasters; this gate is not signed off.

| View | 1920x950 largest difference | 412x915 largest difference |
| --- | --- | --- |
| Overview | 55/255 | 55/255 |
| Explore fit | 218/255 | 173/255 |
| Compass close-up | 20/255 | 23/255 |
| Beacon close-up | 49/255 | 54/255 |
| Serpent close-up | 41/255 | 54/255 |

Added tests: comb-r-compass, visit, close, skal, beacon, serpent and legend check the requested behavior/state/counts/geometry with real CDP input; picture checks preservation; scope checks protected bytes and unlisted content. The fixture supplies a deterministic clock; the loader/suite route artifacts, use PID-based profiles and close browsers. No new test asserts performance timings.

Changed existing tests: finds-test re-records only trip/data pins and updates three-note/five-poke expectations; steps-test uses the specified 0.5 s fold; finds/explore mocks gain replaceChildren. comb-b-art pins supplied tree positions and the new cup hit box. comb-q-serpent checks five names, shipping, queues and the logical drawn group. comb-d-readings, comb-e-beam and comb-d-evidence expect three notes. comb-p-quiet replaces only the old focus-scale band with the two-commit rule; its other assertions remain.

Layer-location updates only: comb-c-browser-test, comb-d-beacon-probe-test, comb-d-drawings-test, comb-g-layout-test, comb-g-spatial-test, comb-g2-actions-test, comb-g2-spatial-test, comb-g3-card-test, comb-g3-extra-test, comb-g3-interaction-test, comb-g3-press-test, comb-l-spatial-test, comb-l-spatial2-test. These inspect moved ink and preserved hit groups; their behavior/clearance thresholds remain. frame-render-test retains its already failing pin because changing it would repair an unrelated starting failure.

Additional failed gates observed: check now rejects the required three notes because its four-note assertion is outside the allowed budget-only edit; comb-d-layout adds phone idle-label transform writes; comb-o-dim adds ten instrument-pixel failures. The new preservation test fails as above. Other No entries mean no additional failed gate observed, with the limitations of missing historical records, early stops and the unchanged joined bundle. Full gate comparisons are in [test-comparison.json](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-r/test-comparison.json).

| Test/support command | Base exit | Last exit | Added failure observed |
| --- | --- | --- | --- |
| check | 0 | 1 | Yes: note count |
| comb-a-browser-test | 1 | 1 | No |
| comb-b-art-test | 1 | 1 | No new art; corrected pin exposes old gap |
| comb-b-browser-test | 0 | 0 | No |
| comb-b-detail-test | 0 | 0 | No |
| comb-b-layout-test | 1 | 1 | No |
| comb-behaviour-test | 0 | 0 | No |
| comb-c-browser-test | 1 | 1 | No |
| comb-c-legend-test | 0 | 0 | No |
| comb-d-beacon-probe-test | 0 | 0 | No |
| comb-d-capture-test | 0 | 0 | No |
| comb-d-drawings-test | 0 | 0 | No |
| comb-d-evidence-test | 1 | 0 | No |
| comb-d-ink-test | 0 | 0 | No |
| comb-d-layout-test | 1 | 1 | Yes |
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
| comb-g2-shine-test | 0 | 0 | No |
| comb-g2-spatial-test | 0 | 0 | No |
| comb-g3-card-test | 0 | 0 | No |
| comb-g3-console-test | 0 | 0 | No |
| comb-g3-extra-test | 0 | 0 | No |
| comb-g3-interaction-test | 1 | 1 | No |
| comb-g3-press-test | 0 | 0 | No |
| comb-l-drag-test | 1 | 1 | No |
| comb-l-explore-test | 0 | 0 | No |
| comb-l-layers-test | 0 | 0 | No |
| comb-l-motion-test | 1 | 1 | No |
| comb-l-preservation-test | 1 | 1 | No |
| comb-l-spatial-test | 0 | 0 | No |
| comb-l-spatial2-test | 0 | 0 | No |
| comb-l-summary-test | 1 | 1 | No |
| comb-l2-all-finds-test | 0 | 0 | No |
| comb-l2-beacon-test | 1 | 1 | No |
| comb-l2-checkpoints-test | 1 | 1 | No |
| comb-l2-counts-test | 1 | 1 | No |
| comb-l2-explore-state-test | 1 | 1 | No |
| comb-l2-finds-test | 0 | 0 | No |
| comb-l2-layers-test | 0 | 0 | No |
| comb-l2-phone-pixels-test | 1 | 1 | No |
| comb-l2-pixels-test | 1 | 1 | No |
| comb-l2-scope-test | 1 | 1 | No |
| comb-l2-smoke-test | 0 | 0 | No |
| comb-l2-wide-test | 0 | 0 | No |
| comb-m-browser-test | 0 | 0 | No |
| comb-m-layers-test | 1 | 1 | No |
| comb-m-state-test | 1 | 1 | No |
| comb-m2-bar-test | 0 | 0 | No |
| comb-m2-ship-test | 1 | 1 | No |
| comb-n-hold-test | 1 | 1 | No |
| comb-n-trail-test | 1 | 1 | No |
| comb-n-wolves-test | 0 | 0 | No |
| comb-o-dim-test | 1 | 1 | Yes |
| comb-o-focus-test | 0 | 0 | No |
| comb-o-ring-test | 0 | 0 | No |
| comb-p-chase-test | 0 | 0 | No |
| comb-p-quiet-test | 1 | 1 | No |
| comb-p-style-test | 0 | 0 | No |
| comb-q-serpent-test | 0 | 0 | No |
| comb-q-ygg-test | 0 | 0 | No |
| comb-r-beacon-test | - | 0 | No (new test) |
| comb-r-close-test | - | 0 | No (new test) |
| comb-r-compass-test | - | 0 | No (new test) |
| comb-r-legend-test | - | 0 | No (new test) |
| comb-r-picture-test | - | 1 | Yes: new preservation gate |
| comb-r-scope-test | - | 0 | No (new test) |
| comb-r-serpent-test | - | 0 | No (new test) |
| comb-r-skal-test | - | 0 | No (new test) |
| comb-r-visit-test | - | 0 | No (new test) |
| comb-reduced-test | 0 | 0 | No |
| depth-test | 0 | 0 | No |
| explore-test | 0 | 0 | No |
| finds-test | 0 | 0 | No |
| frame-performance-test | 1 | 1 | No |
| frame-render-test | 1 | 1 | No |
| glide-visual-test | 1 | 1 | No |
| layout-test | 0 | 0 | No |
| nova-test | 1 | 1 | No |
| steps-test | 0 | 0 | No |
| whirl2-test | 0 | 0 | No |
| comb-r-suite-test (orchestration only) | 0 | 0 | No acceptance implied |

Protected report writers, historical pin writers and duplicate suite wrappers were omitted; exact names/reasons are in [the inventory](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-r/final/inventory.json). The old sharpness timing probe was omitted under the checks timing restriction. glide-visual stops at the artifact write guard. UI Skills CLI setup was omitted under install/network/write restrictions. The [design-critique-loop skill](C:/Users/Admin/.codex/skills/design-critique-loop/SKILL.md) requires "Use two reviewers other than the implementer"; the explicit no-agents rule prevents that gate. No independent approval or design score is claimed.

Automatic approval review rejected removal of inactive profiles and completed test traces with reason "blocked by policy". Six inactive profile directories and 27 test trace files remain in the run folder; no alternate deletion method was used. There are no running browser processes using this run folder. Raw logs, retained artifacts and [the cleanup record](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-r/cleanup-rejections.json) are available for review.
