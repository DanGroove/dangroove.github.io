Partial build. L1 is implemented, L5's camera hold is implemented, and L6/L7 have the work and limits below. L2/L3 are omitted under the source allowlist. L4's two attempts were reverted. This is not a completed part 10 or an all-tests-pass release.

The required briefs and build reports were read first. The saved starting sources, acceptance criteria, decisions, captures, traces and logs are in [comb-l](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l/). The historical comparison uses the saved `lag-6/page/before-9c895f9.html`, copied read-only into this run. The initial 8261269 worktree captures are also retained and labeled separately.

| Item | Change and result |
| --- | --- |
| L1 | Snap all four tilt components to their actual target once all are within `cfg.flat`; existing cached writers then stop the face, shadow and tail mutations. Guard the step bar's class add/remove. Beam changes set an air-only flag while the last veil has nonzero v; air consumes it at its idle boundary. They never set `DP.force`. All 63 settled beat samples and seven explore rests have zero deep clears and zero card/go mutations; air has at most 24 clears per two-second sample. Finds and clouds retain their own motion. |
| L2 | Omitted. `findcreatures.mjs:185` discovers the serpent's `.jg-swell` elements through the original SVG. They are inside the sea that L2 moves. Preserving this animation requires changing that lookup, but this file is authorized only for L4 fades. The main setup call is also outside its markup/frame-call allowance. No duplicate drawing, lookup monkey-patch or broken serpent was substituted. The original single SVG remains. |
| L3 | Omitted because it depends on L2. There is no isolated base, compositor base hold, ahead rebase or base paint-count claim. |
| L4 | Tried leaf wrappers and then direct primitive alpha. Both added layers: the desktop first glide peaked at 43 and 63, versus 41 in the historical baseline. Other glides also grew. Restored the original fades after these two attempts. The retained first-glide range is 31-41 on desktop, as before; layer constancy is still failed. `trip.mjs`, all finds and `footer.mjs` are byte-identical to the starting sources. |
| L5 | Explore no longer labels the small eased tail as sharp. Its existing hold continues until the camera stops or leaves the existing scale window, then commits the exact camera and uses the existing F10 release. The change is only in `explore.mjs`. Zoom-key camera writes drop from 18/19/21/33 to 2/1/1/2 at 1440/1920/412/844 widths. The whole-map paint-count gate remains unmet: idle finds and label writes still repaint the shared SVG. |
| L6 | Added `FRAME_PERF.starPaths`, `outerGeometry`, `rayBands`, `ringPieces` and `airEmpty`, all on. Discs and tails draw individually; rings use bounded pieces and carried dash phase; outer dust is cut geometrically; rays use filled convex outside pieces; already-empty air skips clearing. Waves, nova, canvas resolution and animation clocks remain unchanged. Limits: a ray can be partitioned into multiple convex pieces; disabling ray bands restores an even-odd clip for rays, so independent five-way isolation is incomplete. Two strict pixel cases remain failed after the better second drawing attempt; see below. |
| L7 | Added the CDP probe, canvas init wrappers, mutation counts, per-frame LayerTree counts/paintCounts/owners and RasterTask counts by tileData layer/source frame. Only counts and pixels are analyzed. No frame intervals, task durations, GPU times or FPS were measured. The save helper writes cases separately to avoid JavaScript's single-string limit. |

Two-second rest clear counts at 1440 x 900, pointer off the card, historical -> retained:

| Beat | Deep | Air | Stars |
| --- | --- | --- | --- |
| Whole map | 0 -> 0 | 0 -> 0 | 23 -> 24 |
| Laurier | 395 -> 0 | 395 -> 24 | 0 -> 0 |
| HMC 1 | 378 -> 0 | 378 -> 24 | 24 -> 23 |
| Mohawk | 394 -> 0 | 394 -> 23 | 0 -> 0 |
| HMC 2 | 429 -> 0 | 429 -> 24 | 24 -> 24 |
| Interkom | 412 -> 0 | 412 -> 23 | 23 -> 23 |
| Lennard | 392 -> 0 | 392 -> 24 | 23 -> 24 |
| X | 397 -> 0 | 397 -> 23 | 24 -> 23 |
| End | 0 -> 0 | 0 -> 0 | 478 -> 480 |

The different counts within idle ceilings reflect different sampled frames, not a timing result. These rest/motion comparisons use the joined page on both sides; standalone runs are additional coverage. End/explore stars and visible nova still draw every frame. [metrics.json](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l/metrics.json) contains every size, pointer position, canvas call count per redraw, paint count and layer range. [first-glide-layers.json](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l/first-glide-layers.json) places the historical and retained frame-by-frame counts together. [glides.csv](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l/glides.csv) contains every recorded glide, wheel, pinch and drag, including map tile totals and worst frames. No isolated-base counts exist.

Root SVG tile rasters below are total/worst single source-frame count, historical -> retained. These are counts for the joined page, including arrival settle; they are not timing results. All individual layer/frame records remain in the run.

| Glide | 1440 x 900 | 1920 x 950, scale 2 |
| --- | --- | --- |
| Map -> Laurier | 1016/4 -> 1520/4 | 1130/4 -> 1405/4 |
| Laurier -> HMC 1 | 1004/4 -> 1290/4 | 1245/4 -> 1652/4 |
| HMC 1 -> Mohawk | 1031/4 -> 1253/4 | 1197/4 -> 1523/4 |
| Mohawk -> HMC 2 | 1118/4 -> 1234/4 | 1292/4 -> 1593/4 |
| HMC 2 -> Interkom | 1203/4 -> 1199/4 | 1152/4 -> 1509/4 |
| Interkom -> Lennard | 886/4 -> 885/4 | 1095/4 -> 1480/4 |
| Lennard -> X | 635/4 -> 746/4 | 1049/4 -> 1167/4 |
| Laurier -> Map | 1194/4 -> 1410/4 | 1128/4 -> 1448/4 |
| HMC 1 -> Laurier | 1276/4 -> 1422/4 | 1450/4 -> 1797/4 |
| Mohawk -> HMC 1 | 1278/4 -> 1323/4 | 1402/4 -> 1585/4 |
| HMC 2 -> Mohawk | 1250/4 -> 1376/4 | 1324/4 -> 1558/4 |
| Interkom -> HMC 2 | 1002/4 -> 1151/4 | 1355/4 -> 1449/4 |
| Lennard -> Interkom | 1182/4 -> 1356/4 | 1394/4 -> 1727/4 |
| X -> Lennard | 628/4 -> 681/4 | 925/4 -> 952/4 |

Wheel camera writes at 1440/1920 widths are 22/21 -> 9/5; the phone pinch is 5 -> 5. The SVG paint-count gate fails despite the camera hold: shared-map idle motion still paints. The regular motion suite uses a 160 px drag after wheel zoom. Four additional joined 400 px gestures at the fit view are in `fit-drag.json`; the fit camera is clamped, so those gestures also exercise pointer parallax.


At the 1920 x 950 fit-view gesture, stars retain 596 arcs per redraw, with fills changing from 22.13 binned fills to 596 individual fills. Deep clips fall from two to one; strokes rise from 518 long/wave strokes to 592 short/wave strokes. The empty air canvas clears 255 -> 0 times in that window (323 -> 0 at 1440). More small calls are intentional; no timing gain is inferred from them.

The seeded, fixed-clock L6 comparison on the standalone page has 72 canvas cases at 1440 x 900 and 1920 x 950, scale 2 at the latter. Nova matches exactly; air differs by at most 1/255. The largest raw differences across the cases are 36/255 for deep and 38/255 for stars. Two cases exceed the 8/255 blurred bound: Laurier deep at scale 2 has raw maximum 36/255 and 3 x 3 blurred maximum 10.78/255; X stars at scale 2 has raw maximum 33/255 and blurred maximum 8.67/255. The second ring attempt fixes the first attempt's reversed dash phase. No further drawing attempts were made. Joined-page, dynamic/glide, reduced-motion and individual-switch pixel equivalence are not established. [pixels.json](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l/pixels.json) retains every maximum and failure; [evidence gallery](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l/evidence.html) presents the pairs at a useful reading size. These are not a visual approval.

New tests: `comb-l-browser-test` and `comb-l-probe` provide the offline fixture and structural instrumentation; `structure` checks settled beats; `explore` checks rest and zoom keys; `motion` records both-way glides, ten real wheel notches, drag and pinch; `drag` adds the 400 px fit-view gestures; `layers` records all glides, three find take/release cycles, hero entry and explore entry/exit; `pixels` compares seeded canvas buffers; `spatial`, `spatial2` and `preservation` repeat the prior G14/G14b and G3 real-input cases with output redirected here. `scope` protects source boundaries; `run` logs selected inherited unit checks; `summary` produces the count tables. Page-driving input uses CDP Input commands; no page control functions or synthetic DOM input are used by these new browser tests.

Updated test pins: the authorized depth/data source digests in finds/D/F checks, and 21 frame-render command snapshots for the new individual paths. Original art/route/sky data pins remain; the new scope check compares cloud/look/build code to the saved sources. The full inherited browser suite, timeline/mini-map-specific raster sweeps, five pinned hero comparison frames and direct sharpness crops were not completed. L2/L3/L4 and the strict L5/L6 gates remain open.

Gzip KB: modules plus CSS 184.98 -> 186.13; runtime limit 185 -> 186.2 with the required dated comment. Hammer 16.53/30; packed map 302.58/320; packed joined 549.73/567. All three HTML outputs came only from the two pack tools. Client facts, palettes, route, hero-copy, CSS, join, footer, cloud code and all find modules retain their starting bytes. Scope and runtime syntax checks pass.

Last exit of each invoked test/tool is below. A collection test exiting 0 does not imply that the unimplemented layer/raster gates passed. [Full test output](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l/full-test-output.log) includes the earlier failed attempts; [last exits](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l/last-exits.json) is the machine-readable table. No owned test browser process remains.

| Test or tool | Last exit |
| --- | --- |
| tools/check.mjs | 0 |
| tools/depth-test.mjs | 0 |
| tools/explore-test.mjs | 0 |
| tools/steps-test.mjs | 0 |
| tools/motion-test.mjs | 0 |
| tools/nova-test.mjs | 0 |
| tools/finds-test.mjs | 0 |
| tools/frame-render-test.mjs | 0 |
| tools/whirl2-test.mjs | 0 |
| tools/comb-d-pins-test.mjs | 0 |
| tools/comb-f-pins-test.mjs | 0 |
| tools/comb-l-structure-test.mjs | 0 |
| tools/comb-l-motion-test.mjs | 0 |
| tools/comb-l-layers-test.mjs | 0 |
| tools/comb-l-explore-test.mjs | 0 |
| tools/comb-l-drag-test.mjs | 0 |
| tools/comb-l-spatial-test.mjs | 0 |
| tools/comb-l-spatial2-test.mjs | 0 |
| tools/comb-l-preservation-test.mjs | 0 |
| tools/comb-l-scope-test.mjs | 0 |
| tools/comb-l-summary-test.mjs | 0 |
| tools/comb-l-run-test.mjs | 0 |
| tools/comb-l-pixels-test.mjs | 1 |
| tools/pack.mjs | 0 |
| tools/pack-joined.mjs | 0 |
| node --check (runtime modules) | 0 |

Review the failed ring joins and star overlaps at scale 2, the five switch interactions, and tail sharpness. L2 needs a permitted serpent lookup change before L3 can be built; L4 needs another approach in a later pass. Run Dan's Chrome/Edge timing pass separately, with the limits above in view. No git, installs, agents, external network, cost launcher or timing measurement was used. Independent review remains elsewhere as instructed.
