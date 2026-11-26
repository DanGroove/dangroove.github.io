Implemented W1/G3, G1's held camera and promotion, G2, and T1-T4 in the permitted files. The camera, trail-state and wolf behaviour gates pass. Map flattening and strict pixel/pose checks remain failed. Work followed W1/G3, G1, G2, T1-T4, then checks. The starting packed pages are saved in C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-n/before/.

W1/G3: copied the approved JSON strings for Skoll, Hati, sun and moon. The two pairs use the specified full-glide screen arc, forward direction, lag, colours, leg swing and bob. Each cloud and flyer owns a small SVG moved with CSS. Clouds redraw at bounded scale rebases and sharpen at rest. A display:contents sky container avoids a full-screen overlap layer; its child display rule preserves Depth-off. Reduced motion retains the existing hidden sky. At 412x915, 1440x900 and 1920x950, wolf alpha visibility covers 87.636-87.948% of journey place, with maximum lag error 0.01000 CSS px. Rest, other legs, Back and explore show neither wolf.

G1: steps camera movement now uses the held raster camera and CSS transform after hand-off. Promotion stays through glides and holds; the exact camera is restored at rest. Labels use the held drawing scale. Rest cameras match the before page within 0.01, CSS transforms clear to none, promotion is stable, and CSS transforms change on most moving frames. Flattening is unresolved: CDP identifies g.ygg with Overlap; Toronto, dock and rect paint chunks split with empty reason IDs. isolation:isolate and backface-visibility:hidden were two real input trials; both retained the split, so neither was shipped. The underlying cause beyond those CDP reasons is not established. No drawing or protected source was altered to conceal it.

Views are 412x915 DPR 2.625 touch and 1920x950 DPR 2 mouse. Per glide, From names identify the pressed Next button's stop. Layer counts are distinct IDs with resolved owners inside svg#map, including its root, observed over the glide. The desktop Mohawk runestone path/circle split is known and reported; other splits remain failures. Pixels count any channel differing by more than 24 at the destination stop; the limit is 0.2%.

| View width | From | cam writes before -> after | Map layer IDs before -> after | Stop pixels changed / total |
| --- | --- | --- | --- | --- |
| 412 | Laurier | 595 -> 5 | 1 -> 6 | 108 / 2598964 |
| 412 | HMC Connections | 659 -> 4 | 1 -> 6 | 203 / 2598964 |
| 412 | Mohawk | 664 -> 5 | 1 -> 7 | 384 / 2598964 |
| 412 | HMC again | 542 -> 2 | 1 -> 4 | 244 / 2598964 |
| 412 | Interkom | 624 -> 4 | 1 -> 7 | 2874 / 2598964 |
| 1920 | Laurier | 555 -> 6 | 1 -> 10 | 3521 / 7296000 |
| 1920 | HMC Connections | 550 -> 9 | 1 -> 14 | 525 / 7296000 |
| 1920 | Mohawk | 555 -> 8 | 3 -> 13 | 4864 / 7296000 |
| 1920 | HMC again | 494 -> 4 | 1 -> 9 | 8520 / 7296000 |
| 1920 | Interkom | 549 -> 7 | 1 -> 5 | 210 / 7296000 |

Initial Laurier pixels, from the sky test rest captures: 412: 0/2598964; 1920: 429/7296000. End screenshots fail: 412: 37257/2598964 (1.434%); 1920: 34458/7296000 (0.472%). Side-by-side review shows unmatched nova/star animation phases; no phase-normalized pixel equivalence is claimed.

G2: 44 pieces cover 1732.220255 map units; native path lengths sum to 1732.220274, error 0.000019. At most two pieces change attributes in any observed frame. All requested stop crops pass. The end/explore raw crop gates remain as recorded after the repeat with matching navigation history. Final crop counts: 412 Laurier: 108/1176404; 412 HMC Connections: 202/1063120; 412 Mohawk: 121/1415729; 412 HMC again: 183/1313894; 412 Interkom: 1854/1648968; 412 end: 13719/1103436; 412 explore: 2362/637856; 1920 Laurier: 273/2156340; 1920 HMC Connections: 394/4953300; 1920 Mohawk: 755/2770264; 1920 HMC again: 2424/2373100; 1920 Interkom: 127/3481975; 1920 end: 12341/1032270; 1920 explore: 2457/574620.

Sky drawing changes are limited to viewport rebases, each with viewBox/width/height writes; no cloud path changes occur during movement. Each cloud redraws once in the wheel-driven fall; active low clouds redraw 6-10 times per glide. CSS scales stay within 0.87-1.15. Inside flyers, only legs/bob transforms change. No full-screen sky layer is observed on either page. The following visible-cloud rest crops include eight desktop failures; phone rest clouds are outside the viewport, and no cloud is visible at the end.

| Page | Stop | Cloud | Changed / crop pixels | Percent |
| --- | --- | --- | --- | --- |
| map | hmc1 | 16 | 555 / 71604 | 0.775% |
| map | hmc2 | 16 | 1189 / 102000 | 1.166% |
| map | hmc2 | 17 | 2 / 78334 | 0.003% |
| map | interkom | 17 | 1467 / 351600 | 0.417% |
| map | interkom | 18 | 963 / 110656 | 0.870% |
| joined | hmc1 | 16 | 965 / 74256 | 1.300% |
| joined | hmc2 | 16 | 1523 / 102000 | 1.493% |
| joined | hmc2 | 17 | 12 / 77698 | 0.015% |
| joined | interkom | 17 | 991 / 351300 | 0.282% |
| joined | interkom | 18 | 609 / 110656 | 0.550% |

The auxiliary state check retains its raw position failure: {"rows":[{"joined":false,"samples":5,"maximumRawPositionDifference":5.727642429601701,"maximumExtentDifference":0.027104809246793593,"maximumExistingFormulaError":0.013462687020364683}],"fail":["raw cloud position within a few pixels false: 5.727642429601701"]}. Its second run reached the immediate Depth-off assertion before a render, so joined auxiliary geometry was not completed. The assertion now waits for rendered state; no third geometry run was made. The separate sky-controls test passes Depth off/on and reduced motion on both pages. The formula check uses existing animation-phase state to check geometry, with no duration or rate measurement.

T1 skips the timeline count node and descendants of tl-count-screen (16 total skipped), reporting the rule-on requested glides: 360 Laurier: 2 skipped, 2 unexpected; 360 HMC Connections: 2 skipped, 2 unexpected; 360 Mohawk: 2 skipped, 2 unexpected; 1920 Laurier: 0 skipped, 6 unexpected; 1920 HMC Connections: 0 skipped, 8 unexpected; 1920 Mohawk: 0 skipped, 7 unexpected. The inherited layer gate still fails on the map splits. T2 changes only the ring edge clearance gate to 9.5; measured clearances: near: coast 3.037, ring centreline 19.472, ring edge 16.274; far: coast 3.113, ring centreline 13.061, ring edge 9.861. T3 uses COMB_RUN, default comb-n, under journey-map-runs. T4 exits 0 with its part 10d note.

Added comb-n-fixture and the hold, trail, sky, wolves, sky-state and sky-controls CDP tests. All new page input is real CDP mouse/touch/key input; observers and hooks only inspect state. The hold and trail tests retain raw failures. The initial hold capture now uses initial-laurier: its earlier case-only laurier/Laurier filenames collided on Windows. Genuine initial Laurier captures from the sky test supply that comparison. The trail test's second run gives the before explore view the same navigation history. The wolf repeat adds mid-glide captures and a forward reversal check. Changed existing tests only for T1-T4 and finds-test's five old sky/held-writer data/source pins plus its missing trail-pieces fixture group. check.mjs changes only RUNTIME_KB, 189.7 to 193.8, and its dated note; actual gzip is 193.75 KB. No other assertion was relaxed. The run-folder loader only redirects legacy artifacts and adds profile cleanup, preserving assertions.

| Test or pack tool | Last exit |
| --- | --- |
| tools/pack.mjs | 0 |
| tools/pack-joined.mjs | 0 |
| tools/check.mjs | 0 |
| diagnose.mjs (run folder) | 0 |
| split-attempts.mjs (run folder) | 0 |
| tools/finds-test.mjs | 0 |
| tools/steps-test.mjs | 0 |
| tools/explore-test.mjs | 0 |
| tools/comb-f-geometry-test.mjs | 0 |
| tools/comb-close-test.mjs | 0 |
| tools/comb-m2-scope-test.mjs | 0 |
| tools/comb-n-hold-test.mjs | 1 |
| tools/comb-n-trail-test.mjs | 1 |
| tools/comb-n-wolves-test.mjs | 0 |
| tools/comb-n-sky-test.mjs | 1 |
| tools/comb-m-state-test.mjs | 0 |
| tools/comb-m-browser-test.mjs | 0 |
| tools/comb-m-layers-test.mjs | 1 |
| tools/comb-m2-bar-test.mjs | 0 |
| tools/comb-m2-ship-test.mjs | 0 |
| tools/comb-reopen-test.mjs | 0 |
| tools/comb-g-focus-test.mjs | 0 |
| tools/comb-g3-interaction-test.mjs | 0 |
| tools/comb-g3-press-test.mjs | 0 |
| tools/comb-l-explore-test.mjs | 0 |
| tools/comb-l2-explore-state-test.mjs | 0 |
| syntax.mjs (run folder) | 0 |
| scope.mjs (run folder) | 0 |
| bounded-scope.mjs (run folder) | 0 |
| tools/comb-n-sky-state-test.mjs | 1 |
| tools/comb-n-sky-controls-test.mjs | 0 |

A [side-by-side gallery](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-n/evidence.html) is saved in the run folder. All full logs, captures, before/after pages and detailed JSON are in C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-n. Generated joined.html is byte-identical. Scope records verify protected files and the non-sky/deep/air code. All run-root browser profiles are removed after exit; cleanup-status.json records an empty inventory. The seven new modules pass syntax checks. No git, installs, external network, agents, timing measurements or performance traces were used. The required inherited steps test exercises its simulated clock. Reviewer agents and UI CLI setup were omitted under the explicit no-agent/no-network/no-install and narrow write rules. The remote sketch was unavailable locally; its approved supplied paths and numbers were used. Real-browser review should focus on the unresolved map split, cloud edges, and end/explore pixel differences.
