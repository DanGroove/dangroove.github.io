# COMB-C build record

The implementation and verification record for polish round 2, part 4b.

## Constraints and acceptance criteria, recorded before editing

Read BRIEF, AUDIT-R2, COMB-A and its build record, COMB-C, and the two delta audits. Studied the approved map and cards/footer reference sheets. Preserve the thin chart, dense information hierarchy, real place palettes, original card sections, and the existing objects through each move. Reference copy is not new factual content.

Acceptance: Next cannot shorten Dig-to-end; opening explore uses the real camera; gesture raster scale stays near 1; sharp settle uses screen thresholds; labels ease for 0.25 seconds; card feedback starts at its shield within 100 ms; tails grow without exceeding their rest length or 0.8 shield widths at the base; shadow paints underneath; dark joins remain visible; phone traveller clears tails; shields toggle and show 2 px focus; beacon clears Interkom; X sky remains live; compact cards fit above controls with no scrolling; explore card controls are inert; mini dots use two large colour regions; remnant rings fade at wide views and embers stay on the X island.

No agents, git, installation, or external network are authorized. The original map illustrations are outside this part's scope. The standing independent critique loop is therefore omitted. The UI routing CLI was not run because it may install or use the network; the installed motion-playbook spatial continuity and feedback guidance was read and applied. RTK was absent from PATH and the usual local bin paths; direct local commands are used. The initial RTK attempts failed with command-not-found (exit 1).

## Final handoff

Implemented C1-C16 within the file allowlist. The latest thirteen required Node suites, native origin check, full functional film pass and final card film pass pass. Performance gates are reported separately below: 7 of the eight strict dense-text glide comparisons fail. The pinch still exceeds 33 ms; the exact excess is in the table. No independent design pass or real-phone pass is claimed.

### Item record

| Item | Change and location | Check and result |
| --- | --- | --- |
| C1 | stepsNext ignores repeat Next during Dig-to-end. Repeated Back targets X until its return completes. Home/End explicitly request jumps. | steps-test: 40 repeat-key cases at 0.5/1.5/2.5 s and in blast/settle retain the 5904 ms sampled clock; two Back presses stop at X; Home/End jump. Both-page films press Next again at 1.5 s and arrive near 5.95 s. |
| C2 | exploreApply marks scripted motion, uses 0.1 px axis / 0.1% scale residuals and a 6 px/s fling floor, and signals the quiet-motion camera commit. tripApply drives opening through cam and rebases gestures outside 0.87-1.15. Labels retain displayed state, ease with FRAME_PERF.labelSettle=0.25, and have their own explicit 15% true-size bound while easing. | Fifty opening camera writes in fifty frames; seven camera rebases in a 72-frame 3x model pinch; no translation-only camera/label rewrites; <=10% settle changes. Native wheel is 1.7789x and pinch about 3x. Sharp camera commit occurs on the first sampled <0.5 px/frame frame (0 ms delay). Full gesture scale ranges, actual label-size errors and settle steps are retained in the final explore film log. |
| C3 | cardsFrame shows the same face from its first growing frame at the shield. cardsTailLayout projects the actual tilted edge and moves the card in as needed to bound the join. Inside the face, the tail hides. | First visible native frame is 16 ms and overlaps the drawn shield. 1092 projected samples plus native 16 ms close/reopen sequences retain the cap. Desktop 38 px, phone 14 px; smaller shields cap further. |
| C4 | The shadow is a sibling under the tail and face. The base is <=0.8 shield widths; length is <=1.5 widths and the rest limit. A low-alpha Paper edge runs down the two long sides and around the face. The existing tail paths now use screen coordinates, with no CSS scale, so the hairline is really 1 px. Invisible faces/shadows keep their transforms until the first opening frame, avoiding extra hidden layer writes. | Native screen CTM is identity apart from translation, with 1 px computed stroke. Close-up review caught and corrected an early CSS-scaled thick edge. Final card films and Mohawk/Interkom stills were recaptured. |
| C5 | starsFrame fades the phone traveller and its glow before the opening tail becomes visible, restoring them as it folds away. | Raw stars-canvas readback finds zero traveller-red pixels in each tail box plus 6 px, for all six cards at 412x730 and 390x844 on both pages. |
| C6 | The current stop's shield toggles locally. Close/Open names come from COPY; pointer events and Tab eligibility include the open current shield. Closure retains focus on it. | Both native pages close with the shield, retain focus, and expose the Open name; reopened keyboard cards still focus X. |
| C7 | map.css gives the existing unscaled 44 px shield target an explicit 2 px Paper outline with an Ink separator. Part 4 had already removed the 400 px scaled hit box. | Native current-shield target is 44 px; outline is 2 px at desktop and phone. Same rule applies at overview and explore. |
| C8 | FINDS beacon moves to (514,472), with view (458,482,100) and marker (532,420), above the card and clear of the first reading. Interkom waypoint and all four approved COMB.readings stay unchanged. | Native flame bounds clear shield, tail and card at both main sizes/pages; all four readings complete with the Interkom chest open. Eight-size origin/card checks retain their clearances. The first attempted relocation put one note out of beam reach and was corrected. A later 2 px desktop edge overlap was also corrected. |
| C9 | The twinkle clock remains live into and at X. During the first 0.3 s of rush, light blends to deterministic rush twinkle without sweeping its clock. | nova-test compares positions only during those first 0.3 s, then positions and light. Rest X light changes without position changes. Both-page 3 s rest films show continuing twinkle. |
| C10 | main toggles jm-nova-away throughout Dig-to-end; map.css suppresses legend words and symbols. Reduced motion is exempt. | 50 ms film samples retain at most the X's 0.15 dim value, then zero. A separate real-time legend test records zero opacity through the build and blast. The test accepts dimmed or hidden, as C10 specifies. |
| C11 | Kept COMB-A's landscape reading grid and step-bar reservation. No extra compaction was needed. | Every 844x390 card has no inner scroll. Native bottoms are about 264-294 px, above the 302 px step-bar top. Eight-size origin check passes. |
| C12 | Removed the late 11 px compact-crafts override; compact crafts and kicker are 9 px. Roomy crafts stay 11 px. | All six cards at phone sizes, 1024x600, 1280x720 and 844x390 measure 9 px and fit without scrolling, including 360x640. |
| C13 | Preserved part 4's step-bar exit fade and focus return. cardsFrame independently keeps each face and Close inert during explore, even if its visual state is cached. | Existing steps/focus tests pass; all six faces and Close controls are inert during both-page explore. Inert faces remove their case-study controls from Tab too. |
| C14 | Mini-map dots use two broad colour regions instead of four quarters. Interkom stays cream-led with a smaller coral region. | CSS and 1x desktop still comparison; six-pixel dots retain the original paint clock and colours. timeline.mjs was not changed. |
| C15 | Removed stepsCanScroll and the face touch exclusion. X rest caches its rush plan by the X camera and viewport, rather than rebuilding each star frame. | Steps/gesture tests pass; whirl2-test retains the same plan object over 30 X rest draws per configuration. NOVA.build.core is unchanged. |
| C16 | Only in explore, footer remnant wave/flare/shell rings fade with wider scale; stars bound ember reach against the existing south coast with an 8-unit margin, blending the handover during opening. | Explore zoom 1/2/3 command snapshots refreshed (nine values only). 360 coast rays are finite. The protected pre-WHIRL2 blast/remnant primitive digest still passes. Wide explore films show fading rings and settled embers confined to the X island. depth.mjs is unchanged. |

### Films and visual comparison

All captures and profiles are under C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-c. There are 2042 PNG captures, listed individually in captures.json. Films are frame sequences, not MP4 files. JS advances on a controlled 16 ms clock; native Edge draws every saved frame. CSS/compositor timing remains native, so the separate real-time frame-cost runs are the timing evidence. Desktop is 1440x900 DPR 1; Dan's phone is 412x730 DPR 2.625.

For each map/joined and desktop/phone prefix:

- origin-open, origin-close, origin-reopen, card-close, card-reopen and card-close-x: 0-464 ms every 16 ms. They show the same face growing from its shield, returning and reopening, with a bounded tail. The origin series also covers 1024x600 on both pages. The final screen-coordinate edge correction recaptured the card sequences and every card still; it does not paint in the already-recorded closed-card nova/explore films.
- next2: 0-6200 ms every 50 ms. A repeat Next at 1500 ms leaves the build-up, flash, blast and settle intact.
- x-rest: 0-3000 ms every 50 ms. The sky twinkles while X waits.
- explore-open: 0-1900 ms every 50 ms, including 300 ms after the 1.6 s opening. Real line weights and label floors persist.
- wheel: three notches 50 ms apart, followed by zoom-settle 0-1800 ms every 50 ms. The latter includes more than 300 ms after motion settles.
- pinch: phone gesture samples every 25 ms (including every 50 ms) from 1x to 3x, followed by the same settle sequence. The bounded raster remains in range throughout.
- card-<id>: each of the six open cards. Additional 390x844, 360x640 and 844x390 stills cover phone tails and compact fit.
- beacon-reading-1 through -4: all readings with the chest already open, preserving part 4's placement.

Viewed the approved reference/sheet-map.jpg and reference/sheet-cards-footer.jpg, then compared the retained COMB-A desktop Interkom image with the revision at the same reading scale. The original hierarchy, card content sections, real logos, band/field system, chart density and pair composition remain. The beacon is now a separate tower beside the shield; the cream tail has one continuous face colour. Reviewed the phone Mohawk edge close-up after correcting the scaled stroke, plus opening, wheel, pinch, nova and wide-explore frames in context. No reviewer score is invented.

| Capture prefix | Count |
| --- | ---: |
| map-1440x900-origin-open-* | 30 |
| map-1440x900-origin-close-* | 30 |
| map-1440x900-origin-reopen-* | 30 |
| map-1440x900-card-close-* | 30 |
| map-1440x900-card-reopen-* | 30 |
| map-1440x900-card-close-x-* | 30 |
| map-1440x900-x-rest-* | 61 |
| map-1440x900-next2-* | 125 |
| map-1440x900-explore-open-* | 39 |
| map-1440x900-zoom-settle-* | 37 |
| map-1440x900-wheel-* | 3 |
| map-1440x900-card-* | 6 |
| map-1440x900-beacon-reading-* | 4 |
| map-412x730-origin-open-* | 30 |
| map-412x730-origin-close-* | 30 |
| map-412x730-origin-reopen-* | 30 |
| map-412x730-card-close-* | 30 |
| map-412x730-card-reopen-* | 30 |
| map-412x730-card-close-x-* | 30 |
| map-412x730-x-rest-* | 61 |
| map-412x730-next2-* | 125 |
| map-412x730-explore-open-* | 39 |
| map-412x730-zoom-settle-* | 37 |
| map-412x730-pinch-* | 12 |
| map-412x730-card-* | 6 |
| map-412x730-beacon-reading-* | 4 |
| map-1024x600-origin-open-* | 30 |
| map-1024x600-origin-close-* | 30 |
| map-1024x600-origin-reopen-* | 30 |
| joined-1440x900-origin-open-* | 30 |
| joined-1440x900-origin-close-* | 30 |
| joined-1440x900-origin-reopen-* | 30 |
| joined-1440x900-card-close-* | 30 |
| joined-1440x900-card-reopen-* | 30 |
| joined-1440x900-card-close-x-* | 30 |
| joined-1440x900-x-rest-* | 61 |
| joined-1440x900-next2-* | 125 |
| joined-1440x900-explore-open-* | 39 |
| joined-1440x900-zoom-settle-* | 37 |
| joined-1440x900-wheel-* | 3 |
| joined-1440x900-card-* | 6 |
| joined-1440x900-beacon-reading-* | 4 |
| joined-412x730-origin-open-* | 30 |
| joined-412x730-origin-close-* | 30 |
| joined-412x730-origin-reopen-* | 30 |
| joined-412x730-card-close-* | 30 |
| joined-412x730-card-reopen-* | 30 |
| joined-412x730-card-close-x-* | 30 |
| joined-412x730-x-rest-* | 61 |
| joined-412x730-next2-* | 125 |
| joined-412x730-explore-open-* | 39 |
| joined-412x730-zoom-settle-* | 37 |
| joined-412x730-pinch-* | 12 |
| joined-412x730-card-* | 6 |
| joined-412x730-beacon-reading-* | 4 |
| joined-1024x600-origin-open-* | 30 |
| joined-1024x600-origin-close-* | 30 |
| joined-1024x600-origin-reopen-* | 30 |

### Test changes

- steps-test: adds repeat Next at the specified rush times, blast and settle for all four keys, repeated Back, and explicit Home/End; tail probes follow the same path's screen-coordinate tip.
- nova-test: first 0.3 s replay compares positions only, as C9 permits; later replay still compares positions and light. Adds live X twinkle with fixed positions.
- finds-test: normalized trip/data source pins re-recorded only for the authorized raster/label and data changes. Final trip/data hashes are 1367940136 / 4140766664. The depth pin stays 4010889213, and coast/sea/fill guards pass.
- whirl2-test: adds rush-plan identity reuse at X. Its protected original blast/remnant SHA-256 stays e8869ea46198b38fa9b82b73e3eb74a5dd399180ad685e9f2d149c5969274c0e.
- frame-performance-test: replaces the obsolete zero-camera-writes-during-3x-zoom expectation with bounded raster rebases; adds real-camera opening, translation-only reuse and <=10% label steps. Recovery is about 0.25 s (16 sampled frames / 266.7 ms), while camera sharpness is tested separately at 150 ms.
- frame-render-test: re-records the nine explore zoom/remnant/ember snapshots. Overview, rush, blast and settle snapshots are unchanged.
- origin-check: reads the actual screen-coordinate path tip instead of assuming a transformed unit triangle.
- comb-browser: only its profile/capture root changes to comb-c. New comb-c suite/cost/browser/tail/legend/record/report tests retain outputs, drive Edge and check the requested gates. The one-time probe migration helper was removed after use.

Every test run's full output, including failed/superseded runs, is below. Early failures were a missing recording-DOM API, the deliberately changed twinkle-light pin, old digest/zero-camera-write pins, an unreachable beacon note, and the over-strict zero-opacity film assertion. One 390x844 fixture measured a remembered-closed Laurier card; it now explicitly opens it before testing the open tail, and all six then pass. Geometry and visual checks also caught the beacon overlap and thick CSS-scaled edge; both were corrected. Film output from early runs is retained; matching PNG names were overwritten by the final applicable capture pass. Syntax checks on cards/trip/browser harness passed. The first probe migration printed: "ok: tail browser probes measure the existing path, not its 1 px overflow SVG viewport". Both pack tools exited 0 on every invocation; final outputs are dist/journey-map.html 706.5 KB and dist/journey-joined.html 1247.0 KB, with joined.html emitted by pack-joined. No packed file was hand-edited.

### Frame cost

FRAMES scenarios 1-4, before and final, at 412x730 DPR 2.625 CPU x4. Each measurement is an isolated real-time Edge timing pass without screenshots. Costs are ms/frame. The final pinch's p95 overrun is reported rather than traded for stretched strokes.

| Page / scenario | Before p50 / p95 / max ms | Final p50 / p95 / max ms | Before script / style+layout / raster ms | Final script / style+layout / raster ms | Final p95 above 33 ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| map / pinch x3 / 300 ms out + 300 ms in / three repeats | 20.90 / 58.40 / 108.50 | 33.30 / 70.90 / 95.90 | 8.53 / 4.48 / 2.49 | 12.48 / 8.4 / 10.46 | 37.90 |
| map / fling + glide | 16.70 / 25.00 / 50.10 | 16.70 / 29.10 / 58.40 | 5.89 / 0.91 / 0.62 | 7.55 / 1.12 / 0.72 | 0.00 |
| map / wayfinder / one turn in 1.5 s | 16.70 / 25.00 / 37.60 | 16.80 / 25.10 / 37.50 | 5.45 / 0.7 / 0.44 | 7.01 / 0.9 / 0.52 | 0.00 |
| map / slow pan with glow | 16.70 / 21.00 / 45.90 | 16.80 / 25.10 / 58.40 | 5.89 / 0.9 / 0.42 | 7.57 / 1.1 / 0.49 | 0.00 |
| joined / pinch x3 / 300 ms out + 300 ms in / three repeats | 20.80 / 66.60 / 71.00 | 29.20 / 66.80 / 91.60 | 6.57 / 4.64 / 2.44 | 10.03 / 8.57 / 11.11 | 33.80 |
| joined / fling + glide | 16.60 / 20.90 / 41.70 | 16.70 / 25.10 / 45.90 | 4.39 / 0.87 / 0.60 | 5.93 / 1.11 / 0.75 | 0.00 |
| joined / wayfinder / one turn in 1.5 s | 16.60 / 20.90 / 37.50 | 20.90 / 33.30 / 45.80 | 4.17 / 0.79 / 0.43 | 7.58 / 1.41 / 0.65 | 0.30 |
| joined / slow pan with glow | 16.60 / 21.00 / 54.30 | 20.80 / 29.20 / 62.60 | 4.61 / 0.95 / 0.43 | 6.93 / 1.37 / 0.60 | 0.00 |

Four named glides against the actual saved glide/dense-text/frame-cost-timing.txt (same phone emulation). Any positive difference is a strict failure, including timer-scale differences; no gate is silently relaxed.

| Page / glide | Dense-text p95 ms | Final p95 ms | Difference ms | No worse |
| --- | ---: | ---: | ---: | --- |
| map / map -> Laurier | 75.00 | 54.20 | -20.80 | PASS |
| map / Laurier -> HMC | 37.60 | 45.90 | 8.30 | FAIL |
| map / HMC again -> Interkom | 41.70 | 54.30 | 12.60 | FAIL |
| map / Interkom -> HMC again / Back | 37.60 | 54.20 | 16.60 | FAIL |
| joined / map -> Laurier | 41.70 | 41.80 | 0.10 | FAIL |
| joined / Laurier -> HMC | 37.50 | 58.40 | 20.90 | FAIL |
| joined / HMC again -> Interkom | 45.80 | 45.90 | 0.10 | FAIL |
| joined / Interkom -> HMC again / Back | 37.60 | 50.00 | 12.40 | FAIL |

Desktop final timing, 1440x900 DPR 1 CPU x1. The named dense-text baseline file supplies phone values, so no desktop baseline is invented.

| Page / glide | Frames | p50 ms | p95 ms | max ms | script ms | style+layout ms |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| map / map -> Laurier | 359 | 12.4 | 16.6 | 20.9 | 1.6 | 5.38 |
| map / Laurier -> HMC | 312 | 12.5 | 16.7 | 24.9 | 1.57 | 6.9 |
| map / HMC again -> Interkom | 322 | 12.4 | 12.6 | 20.9 | 1.28 | 6.03 |
| map / Interkom -> HMC again / Back | 313 | 12.5 | 12.6 | 20.8 | 1.29 | 6.14 |
| joined / map -> Laurier | 334 | 12.5 | 16.7 | 20.9 | 1.62 | 5.84 |
| joined / Laurier -> HMC | 307 | 12.5 | 16.8 | 25.1 | 1.5 | 6.95 |
| joined / HMC again -> Interkom | 322 | 12.4 | 16.6 | 20.8 | 1.21 | 5.97 |
| joined / Interkom -> HMC again / Back | 325 | 12.4 | 16.6 | 20.8 | 1.18 | 5.98 |

The final FRAMES capture pass recorded 0 blank candidates across 1114 captures in all eight page/scenario rows. These are sampled connected-line checks, not proof about every physical-device frame. Their full capture-cost tables remain below and are not mixed with timing-only costs. Intermediate timing runs overlapped a short Node verification and are retained as history; the final comparison uses the final build in a separate timing-only pass.

### Limits and real-phone review

No item was omitted because it required a forbidden production file. depth.mjs, art drawings, hero-copy, other briefs/reports/audits and all other non-allowlisted files were left untouched. The standing agent/reviewer loop and network-dependent routing CLI were omitted under the explicit no-agent/no-install/no-network instructions. This report is the only project record written, as the prompt allows no separate notes folder. RTK's unavailable wrapper is recorded above.

The 33 ms pinch target is not fully met. Strict glide results are exactly as listed above. A 4x desktop emulation is not Dan's actual phone GPU. No physical phone, Safari/Firefox or screen-reader session was available. Review on the phone: continuous line weight through opening/pinch, sharp release under repeated wheel/pinch input, dark-card tail edges and focus rings, rapid close/reopen, landscape rotation while a card opens, Interkom tower/beam/readings with its chest open, three-minute X idle into Dig, repeated Next/Back during the build-up, live reduced-motion changes, and wide explore rings/embers. Review those elements together with labels, controls and neighbouring drawings.

## Test output, chronological

## before frame-cost --passes timing --scenarios 0,1,2,3 (exit 0)

```text
browser: Edg/158.0.4370.33; 412x730; DPR 2.625; touch true; CPU x4
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 122 | 20.90 | 58.40 | 108.50 | 14 | 1 | 8.53 | 4.48 | 1.69 | 2.79 | 3.66 | 0.72 | 5.75 | 0.66 | 2.49 | 7 / 59.00 | N/A |
| fling + glide timing | 134 | 16.70 | 25.00 | 50.10 | 2 | 0 | 5.89 | 0.91 | 0.35 | 0.56 | 2.53 | 0.35 | 5.43 | 0.39 | 0.62 | 0 / 0.00 | N/A |
| wayfinder / one turn in 1.5 s timing | 177 | 16.70 | 25.00 | 37.60 | 1 | 0 | 5.45 | 0.70 | 0.29 | 0.41 | 2.51 | 0.32 | 5.39 | 0.47 | 0.44 | 0 / 0.00 | N/A |
| slow pan with glow timing | 209 | 16.70 | 21.00 | 45.90 | 3 | 0 | 5.89 | 0.90 | 0.29 | 0.62 | 2.65 | 0.34 | 5.39 | 0.57 | 0.42 | 0 / 0.00 | N/A |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 133 | 20.80 | 66.60 | 71.00 | 17 | 0 | 6.57 | 4.64 | 1.74 | 2.90 | 3.26 | 0.75 | 5.78 | 0.66 | 2.44 | 6 / 66.00 | N/A |
| fling + glide timing | 141 | 16.60 | 20.90 | 41.70 | 3 | 0 | 4.39 | 0.87 | 0.38 | 0.49 | 2.67 | 0.34 | 5.45 | 0.39 | 0.60 | 0 / 0.00 | N/A |
| wayfinder / one turn in 1.5 s timing | 186 | 16.60 | 20.90 | 37.50 | 1 | 0 | 4.17 | 0.79 | 0.33 | 0.46 | 2.66 | 0.33 | 5.48 | 0.48 | 0.43 | 0 / 0.00 | N/A |
| slow pan with glow timing | 223 | 16.60 | 21.00 | 54.30 | 3 | 0 | 4.61 | 0.95 | 0.30 | 0.65 | 2.66 | 0.35 | 5.36 | 0.54 | 0.43 | 0 / 0.00 | N/A |
```

## check (exit 0)

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 16.05 KB / 30; all map modules + CSS 172.47 KB / 185
gzip: dist/journey-map.html 288.79 KB / 320
gzip: dist/journey-joined.html 509.35 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

## steps-test (exit 1)

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
file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/cards.mjs:57
    if (tail) tail.insertAdjacentHTML('beforeend', '<path class="c-tail-edge" d="M0 0L1 .5L0 1"/>');
                   ^

TypeError: tail.insertAdjacentHTML is not a function
    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/cards.mjs:57:20
    at Array.forEach (<anonymous>)
    at cardsBuild (file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/cards.mjs:22:9)
    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/steps-test.mjs:127:60
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v26.7.0
```

## nova-test (exit 1)

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is available for live reduced-motion switching
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: stars ignore elapsed clock during rush at 0.01
    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/nova-test.mjs:182:61
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: false,
  expected: true,
  operator: '==',
  diff: 'simple'
}

Node.js v26.7.0
```

## depth-test (exit 0)

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

## layout-test (exit 0)

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

## explore-test (exit 0)

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

## finds-test (exit 1)

```text
ok: C1 ring sea baseline; coast unchanged; fill digest records only non-scaling coast tick metadata
ok: DEPTH/NOVA preserved; STARS.supply data digest recorded
node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: trip.mjs changed
+ actual - expected

+ 1146397867
- 3091424451

    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/finds-test.mjs:42:8
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: 1146397867,
  expected: 3091424451,
  operator: 'strictEqual',
  diff: 'simple'
}

Node.js v26.7.0
```

## motion-test (exit 0)

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

## hammer-test (exit 0)

```text
ok: D3 foe heights incl stroke: giants/chief 16, hunched draugr 11, low full-width wolf 8; wave 1 varies; five overlapping shields span each unchanged segment
ok: original Norse foe silhouettes and their strokes fit unchanged hit boxes
ok: identical seeds and inputs match step for step
ok: 350 seeded formations/bosses fit their wave rows; unique fates; clay at 60%, heart at 30%
ok: 34 per-level rune effect checks; excluded runes absent
ok: cold includes both flights and glove; heat splits twice; draugr rises once; need multiplies the return upgrade; exposed stone heart doubles a hit
ok: return/catch, first-hit memory, shields, bridge loss; pool sizes and identities unchanged after 10,000 steps
steady: 200 seeds; wave 4 74.0%; wins 17.5%; ended by wave 3 26.0%; longest 223.6s; 0.00075 ms/step; 1.7s wall
ends {"6:bridge":6,"7:won":35,"5:bridge":10,"3:hearts":35,"5:hearts":42,"6:hearts":14,"4:hearts":28,"4:bridge":8,"2:hearts":12,"3:bridge":3,"7:hearts":5,"2:bridge":1,"1:hearts":1}
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00071 ms/step; 2.2s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

## whirl2-test (exit 0)

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
ok: WHIRL2 261 trail/sea still comparisons; 45 unchanged blast/remnant primitive comparisons (not pixels); source 5a29e5aacb7921fa157f2e699fd228dac52f4534c66f3abe9fd48bec5a9d80a0
```

## frame-cost-test (exit 0)

```text
ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature
ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work
```

## frame-performance-test (exit 1)

```text
AFTER 412x730 / 72 moving frames: #cam writes 7; label writes 297; recovery 30 frames / 500.0 ms
node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

7 !== 0

    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/frame-performance-test.mjs:53:10
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: 7,
  expected: 0,
  operator: 'strictEqual',
  diff: 'simple'
}

Node.js v26.7.0
```

## frame-render-test (exit 1)

```text
node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: 1440x900/0/4 drawing commands changed
+ actual - expected

+ '56fc11e7fe607aeb1fc4f4d2ea9ba285bfdebdc4a5631b1f327d2cd8d9d4da17'
- '417aa059b18237244d664a06fecb5821aa38cc240b992969f5520d9b0792b2be'

    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/frame-render-test.mjs:70:26
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: '56fc11e7fe607aeb1fc4f4d2ea9ba285bfdebdc4a5631b1f327d2cd8d9d4da17',
  expected: '417aa059b18237244d664a06fecb5821aa38cc240b992969f5520d9b0792b2be',
  operator: 'strictEqual',
  diff: 'simple'
}

Node.js v26.7.0
```

## comb-c-tail-test (exit 0)

```text
1440x900: bounded tail max 38.000 px, proportional base, closed tail hidden
1024x600: bounded tail max 29.808 px, proportional base, closed tail hidden
412x730: bounded tail max 14.000 px, proportional base, closed tail hidden
390x844: bounded tail max 14.000 px, proportional base, closed tail hidden
360x640: bounded tail max 14.000 px, proportional base, closed tail hidden
844x390: bounded tail max 21.000 px, proportional base, closed tail hidden
ok: 1092 projected card samples; 360 ember/coast rays
```

## steps-test (exit 1)

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

Error: reopened card must focus its X without scrolling
    at stepAssert (file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/steps-test.mjs:11:68)
    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/steps-test.mjs:138:60
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v26.7.0
```

## comb-c-browser-test 

```text
PASS map-1440x900 laurier tail proportions {"length":38.00000000000006,"base":27.417600000000036,"shield":34.265625,"opacity":1,"face":[436.5089416503906,258.015380859375,1076.5635070800781,618.093505859375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 laurier fit/paint {"scroll":0,"bottom":618.093505859375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS map-1440x900 hmc1 tail proportions {"length":37.99999999999994,"base":27.417600000000025,"shield":34.265625,"opacity":1,"face":[436.4877014160156,248.52880859375,1076.5847473144531,627.6068115234375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 hmc1 fit/paint {"scroll":0,"bottom":627.6068115234375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-1440x900 mohawk tail proportions {"length":38,"base":27.417600000000007,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 mohawk fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS map-1440x900 hmc2 tail proportions {"length":37.99999999999994,"base":27.417599999999958,"shield":34.265625,"opacity":1,"face":[436.4851989746094,239.0318145751953,1076.5872497558594,637.1098175048828],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 hmc2 fit/paint {"scroll":0,"bottom":637.1098175048828,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-1440x900 interkom tail proportions {"length":38,"base":27.417599999999993,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 interkom fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS map-1440x900 lennard tail proportions {"length":37.99999999999994,"base":27.417599999999993,"shield":34.265625,"opacity":1,"face":[436.48089599609375,222.0374298095703,1076.591552734375,653.5528717041016],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 lennard fit/paint {"scroll":0,"bottom":653.5528717041016,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS map-1440x900 shield closes and retains focus
PASS map-1440x900 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS map-1440x900 first visible frame touches shield <=100 ms {"ms":48,"length":0,"base":0,"shield":34.265625,"opacity":0.0523769,"face":[362.57366943359375,428.78900146484375,398.6258544921875,447.89886474609375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":"st-btn"}
PASS map-1440x900 16 ms close/reopen tails bounded
PASS map-1440x900 X twinkles for 3 s
PASS map-1440x900 second Next preserves full supernova {"ms":5950,"P":2144.7776094010915,"moving":false,"legend":true}
FAIL map-1440x900 legend stays hidden through blast
PASS map-1440x900 opening uses true camera
PASS map-1440x900 explore card controls inert
PASS map-1440x900 compositor scale bounded {"min":1,"max":1.10937}
PASS map-1440x900 sharp final camera
PASS map-412x730 laurier tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,358,412,672.03125],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":""}
PASS map-412x730 laurier fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS map-412x730 hmc1 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS map-412x730 hmc1 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-412x730 mohawk tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,353,412,672.03125],"stone":[194.890625,315.5536804199219,217.109375,337.7724304199219],"focus":""}
PASS map-412x730 mohawk fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS map-412x730 hmc2 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,302,412,671.578125],"stone":[194.890625,264.5536804199219,217.109375,286.7724304199219],"focus":""}
PASS map-412x730 hmc2 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-412x730 interkom tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS map-412x730 interkom fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS map-412x730 lennard tail proportions {"length":13.999999999999886,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,277,412,672.125],"stone":[194.890625,239.55368041992188,217.109375,261.7724304199219],"focus":""}
PASS map-412x730 lennard fit/paint {"scroll":0,"bottom":672.125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS map-412x730 shield closes and retains focus
PASS map-412x730 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS map-412x730 first visible frame touches shield <=100 ms {"ms":48,"length":0,"base":0,"shield":22.21875,"opacity":0.0523769,"face":[194.72634887695312,323.07098388671875,217.27365112304688,340.2568359375],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":"st-btn"}
PASS map-412x730 16 ms close/reopen tails bounded
PASS map-412x730 X twinkles for 3 s
PASS map-412x730 second Next preserves full supernova {"ms":5950,"P":2144.7776094010915,"moving":false,"legend":true}
FAIL map-412x730 legend stays hidden through blast
PASS map-412x730 opening uses true camera
PASS map-412x730 explore card controls inert
PASS map-412x730 compositor scale bounded {"min":1,"max":1.13333}
PASS map-412x730 sharp final camera
PASS joined-1440x900 laurier tail proportions {"length":38.00000000000006,"base":27.417600000000036,"shield":34.265625,"opacity":1,"face":[436.5089416503906,258.015380859375,1076.5635070800781,618.093505859375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 laurier fit/paint {"scroll":0,"bottom":618.093505859375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS joined-1440x900 hmc1 tail proportions {"length":37.99999999999994,"base":27.417600000000025,"shield":34.265625,"opacity":1,"face":[436.4877014160156,248.52880859375,1076.5847473144531,627.6068115234375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 hmc1 fit/paint {"scroll":0,"bottom":627.6068115234375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-1440x900 mohawk tail proportions {"length":38,"base":27.417600000000007,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 mohawk fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS joined-1440x900 hmc2 tail proportions {"length":37.99999999999994,"base":27.417599999999958,"shield":34.265625,"opacity":1,"face":[436.4851989746094,239.0318145751953,1076.5872497558594,637.1098175048828],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 hmc2 fit/paint {"scroll":0,"bottom":637.1098175048828,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-1440x900 interkom tail proportions {"length":38,"base":27.417599999999993,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 interkom fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS joined-1440x900 lennard tail proportions {"length":37.99999999999994,"base":27.417599999999993,"shield":34.265625,"opacity":1,"face":[436.48089599609375,222.0374298095703,1076.591552734375,653.5528717041016],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 lennard fit/paint {"scroll":0,"bottom":653.5528717041016,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS joined-1440x900 shield closes and retains focus
PASS joined-1440x900 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS joined-1440x900 first visible frame touches shield <=100 ms {"ms":48,"length":0,"base":0,"shield":34.265625,"opacity":0.0523769,"face":[362.57366943359375,428.78900146484375,398.6258544921875,447.89886474609375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":"st-btn"}
PASS joined-1440x900 16 ms close/reopen tails bounded
PASS joined-1440x900 X twinkles for 3 s
PASS joined-1440x900 second Next preserves full supernova {"ms":5950,"P":2144.7776094010915,"moving":false,"legend":true}
FAIL joined-1440x900 legend stays hidden through blast
PASS joined-1440x900 opening uses true camera
PASS joined-1440x900 explore card controls inert
PASS joined-1440x900 compositor scale bounded {"min":1,"max":1.10937}
PASS joined-1440x900 sharp final camera
PASS joined-412x730 laurier tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,358,412,672.03125],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":""}
PASS joined-412x730 laurier fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS joined-412x730 hmc1 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS joined-412x730 hmc1 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-412x730 mohawk tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,353,412,672.03125],"stone":[194.890625,315.5536804199219,217.109375,337.7724304199219],"focus":""}
PASS joined-412x730 mohawk fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS joined-412x730 hmc2 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,302,412,671.578125],"stone":[194.890625,264.5536804199219,217.109375,286.7724304199219],"focus":""}
PASS joined-412x730 hmc2 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-412x730 interkom tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS joined-412x730 interkom fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS joined-412x730 lennard tail proportions {"length":13.999999999999886,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,277,412,672.125],"stone":[194.890625,239.55368041992188,217.109375,261.7724304199219],"focus":""}
PASS joined-412x730 lennard fit/paint {"scroll":0,"bottom":672.125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS joined-412x730 shield closes and retains focus
PASS joined-412x730 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS joined-412x730 first visible frame touches shield <=100 ms {"ms":48,"length":0,"base":0,"shield":22.21875,"opacity":0.0523769,"face":[194.72634887695312,323.07098388671875,217.27365112304688,340.2568359375],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":"st-btn"}
PASS joined-412x730 16 ms close/reopen tails bounded
PASS joined-412x730 X twinkles for 3 s
PASS joined-412x730 second Next preserves full supernova {"ms":5950,"P":2144.7776094010915,"moving":false,"legend":true}
FAIL joined-412x730 legend stays hidden through blast
PASS joined-412x730 opening uses true camera
PASS joined-412x730 explore card controls inert
PASS joined-412x730 compositor scale bounded {"min":1,"max":1.13333}
PASS joined-412x730 sharp final camera
PASS 1024x600 laurier compact fit {"bottom":423.00962829589844,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 hmc1 compact fit {"bottom":434.0677490234375,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 mohawk compact fit {"bottom":425.5166931152344,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 hmc2 compact fit {"bottom":450.57655334472656,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 interkom compact fit {"bottom":434.0677795410156,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 lennard compact fit {"bottom":454.5788269042969,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 laurier compact fit {"bottom":483.00962829589844,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 hmc1 compact fit {"bottom":494.0677490234375,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 mohawk compact fit {"bottom":485.5166931152344,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 hmc2 compact fit {"bottom":510.57655334472656,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 interkom compact fit {"bottom":494.0677795410156,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 lennard compact fit {"bottom":514.578857421875,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 laurier compact fit {"bottom":582.03125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 hmc1 compact fit {"bottom":581.578125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 mohawk compact fit {"bottom":582.03125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 hmc2 compact fit {"bottom":581.578125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 interkom compact fit {"bottom":582.125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 lennard compact fit {"bottom":582.125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 laurier compact fit {"bottom":263.70130157470703,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 hmc1 compact fit {"bottom":263.5517578125,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 mohawk compact fit {"bottom":264.2989273071289,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 hmc2 compact fit {"bottom":291.62078857421875,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 interkom compact fit {"bottom":263.55181884765625,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 lennard compact fit {"bottom":293.55870819091797,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS no browser exceptions []
```

## comb-c-record-test (exit 0)

```text
C8/C2 data/trip normalized digests: 1979462879 / 3057476541
C16 remnant/ember command snapshots changed: 1440x900/0/4, 1440x900/0/5, 1440x900/0/6, 412x730/0/4, 412x730/0/5, 412x730/0/6, 412x730/1200/4, 412x730/1200/5, 412x730/1200/6
{
  "1440x900/0/0": "a76b1e95ba298d093ac9168b5e00b0f3a8c060585f9c4c64538161b08cad4cb8",
  "1440x900/0/1": "643118161d7feaefb667c5a092d54a30f22b34055de4aa6b9c87fb31b2b2b625",
  "1440x900/0/2": "e6bd47bc1cc4c74f4498227f47aba10c7f448ed1548e5fce16055957707cc10b",
  "1440x900/0/3": "9bcbf832a686e8e90169b31ea834cfae7e7669320e482fb2c0bfd32c096de19e",
  "1440x900/0/4": "56fc11e7fe607aeb1fc4f4d2ea9ba285bfdebdc4a5631b1f327d2cd8d9d4da17",
  "1440x900/0/5": "832c19de891003eb81be61969f1189d79fa93eef70d4497c6056ddd8cb795374",
  "1440x900/0/6": "5e34adbcae8f61b083c792afdd5b4fd281a855ae84931801d710cd6819057458",
  "412x730/0/0": "de1d8423649b63a2ca69cabf631b332dee747dfb98f137196c5d86242ae2534c",
  "412x730/0/1": "0b31e6289175353ca9eeb178917cbb09971e47a2d5f463d9f1373f528b53f38e",
  "412x730/0/2": "5c3c5bca58c301d3bb55d8cccef76d8c738e0dae41796b6b3a269d62cdc513c5",
  "412x730/0/3": "bb725ebea004bb701dc88e0b6a938fc7b8af3d6980c89a8c29f57545fcc4254b",
  "412x730/0/4": "7ef2f50b28da51ad0ad5e6d8e180c260087d99514ed451a8ce9d0637112a7a6d",
  "412x730/0/5": "75de9db3b6fedb74ec2c75025f631e9c42c45748709bd75dd12ac365c132c3da",
  "412x730/0/6": "e545bae22696a918266f9c2b5ef2c4dc58fd1f86bc17baf19e972a695ef16de9",
  "412x730/1200/0": "e43c832d4a60fb7dc376b9a2e0ff6fdf161ab07e09584cbca33794b064ea095c",
  "412x730/1200/1": "5518818512f23318684761ac584df64d27d06d9fd02913cf7062596f950e46f9",
  "412x730/1200/2": "f8ebfc054059723febb72e0b9878a0ed720ba4b491506058fa5c3f383be35997",
  "412x730/1200/3": "5d09036a38343a60ff39d0d306a1d64747f56af63af53a78d9782c120cdd3046",
  "412x730/1200/4": "2769f01781441edc3a0e3cb364021d027ffc3b40cf1d38e4f7500607b8db83df",
  "412x730/1200/5": "2563831d87d30156ad41c3bb0e591a290980173b1f9a8e959a700d502009896b",
  "412x730/1200/6": "40275570ea7b55630be1f0c1932170dc649d2083665289192172b32e1759bd6d"
}
```

## steps-test (exit 0)

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

## nova-test (exit 0)

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

## finds-test (exit 1)

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
AssertionError [ERR_ASSERTION]: Expected values to be strictly equal:

0 !== 4

    at testPlays (file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/finds-test.mjs:230:8) {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: 0,
  expected: 4,
  operator: 'strictEqual',
  diff: 'simple'
}
```

## frame-performance-test (exit 0)

```text
AFTER 412x730 / 72 moving frames: #cam writes 7; label writes 297; recovery 16 frames / 266.7 ms
ok: bounded pinch rasters agree with virtual camera; <=10% label settle steps; 250 ms recovery; translation-only raster; 50 real opening camera writes; interrupted zoom, resize/exit cleanup and zero idle writes
```

## frame-render-test (exit 0)

```text
phone explore zoom 1: scratch pixels cleared 3609120 -> 871895 (75.8% less); same drawing commands
phone explore zoom 2: scratch pixels cleared 3609120 -> 1037640 (71.2% less); same drawing commands
phone explore zoom 3: scratch pixels cleared 3609120 -> 760250 (78.9% less); same drawing commands
ok: 21 desktop/phone/1200-star WHIRL2 drawing-command snapshots; original blast primitives pinned by whirl2-test; not a pixel comparison
```

## comb-c-record-test (exit 0)

```text
C8/C2 data/trip normalized digests: 1011269041 / 3057476541
C16 remnant/ember command snapshots changed: 
{
  "1440x900/0/0": "a76b1e95ba298d093ac9168b5e00b0f3a8c060585f9c4c64538161b08cad4cb8",
  "1440x900/0/1": "643118161d7feaefb667c5a092d54a30f22b34055de4aa6b9c87fb31b2b2b625",
  "1440x900/0/2": "e6bd47bc1cc4c74f4498227f47aba10c7f448ed1548e5fce16055957707cc10b",
  "1440x900/0/3": "9bcbf832a686e8e90169b31ea834cfae7e7669320e482fb2c0bfd32c096de19e",
  "1440x900/0/4": "56fc11e7fe607aeb1fc4f4d2ea9ba285bfdebdc4a5631b1f327d2cd8d9d4da17",
  "1440x900/0/5": "832c19de891003eb81be61969f1189d79fa93eef70d4497c6056ddd8cb795374",
  "1440x900/0/6": "5e34adbcae8f61b083c792afdd5b4fd281a855ae84931801d710cd6819057458",
  "412x730/0/0": "de1d8423649b63a2ca69cabf631b332dee747dfb98f137196c5d86242ae2534c",
  "412x730/0/1": "0b31e6289175353ca9eeb178917cbb09971e47a2d5f463d9f1373f528b53f38e",
  "412x730/0/2": "5c3c5bca58c301d3bb55d8cccef76d8c738e0dae41796b6b3a269d62cdc513c5",
  "412x730/0/3": "bb725ebea004bb701dc88e0b6a938fc7b8af3d6980c89a8c29f57545fcc4254b",
  "412x730/0/4": "7ef2f50b28da51ad0ad5e6d8e180c260087d99514ed451a8ce9d0637112a7a6d",
  "412x730/0/5": "75de9db3b6fedb74ec2c75025f631e9c42c45748709bd75dd12ac365c132c3da",
  "412x730/0/6": "e545bae22696a918266f9c2b5ef2c4dc58fd1f86bc17baf19e972a695ef16de9",
  "412x730/1200/0": "e43c832d4a60fb7dc376b9a2e0ff6fdf161ab07e09584cbca33794b064ea095c",
  "412x730/1200/1": "5518818512f23318684761ac584df64d27d06d9fd02913cf7062596f950e46f9",
  "412x730/1200/2": "f8ebfc054059723febb72e0b9878a0ed720ba4b491506058fa5c3f383be35997",
  "412x730/1200/3": "5d09036a38343a60ff39d0d306a1d64747f56af63af53a78d9782c120cdd3046",
  "412x730/1200/4": "2769f01781441edc3a0e3cb364021d027ffc3b40cf1d38e4f7500607b8db83df",
  "412x730/1200/5": "2563831d87d30156ad41c3bb0e591a290980173b1f9a8e959a700d502009896b",
  "412x730/1200/6": "40275570ea7b55630be1f0c1932170dc649d2083665289192172b32e1759bd6d"
}
```

## finds-test (exit 0)

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
ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast (9223 writes)
ok: reduced-motion serpent consumes leaves immediately with no swell; no shy hop; all tree actors stay still on hear
ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
ok: footer name layout reads 85 total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: {"resize":17,"fonts":17,"settle-end":17,"explore":34}
ok: actual timeline Home and End handlers select first and last stops
```

## after origin-check  (exit 0)

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

## after frame-cost --passes timing --scenarios 0,1,2,3,6,7,8,9 (exit 0)

```text
browser: Edg/158.0.4370.33; 412x730; DPR 2.625; touch true; CPU x4
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 109 | 25.00 | 54.20 | 71.00 | 38 | 0 | 9.57 | 6.02 | 3.05 | 2.98 | 3.63 | 1.16 | 5.70 | 0.74 | 9.85 | 2 / 53.00 | N/A |
| fling + glide timing | 129 | 16.70 | 25.00 | 45.80 | 2 | 0 | 6.75 | 0.92 | 0.37 | 0.56 | 2.36 | 0.32 | 5.37 | 0.39 | 0.53 | 0 / 0.00 | N/A |
| wayfinder / one turn in 1.5 s timing | 154 | 16.70 | 29.20 | 41.70 | 3 | 0 | 7.06 | 0.87 | 0.36 | 0.52 | 2.88 | 0.37 | 5.65 | 0.55 | 0.52 | 0 / 0.00 | N/A |
| slow pan with glow timing | 196 | 16.70 | 25.00 | 45.90 | 4 | 0 | 7.00 | 0.96 | 0.30 | 0.66 | 2.82 | 0.35 | 5.46 | 0.58 | 0.49 | 0 / 0.00 | N/A |
| map -> Laurier timing | 100 | 37.50 | 54.20 | 70.80 | 88 | 0 | 10.01 | 11.82 | 9.95 | 1.87 | 6.24 | 2.93 | 6.22 | 0.80 | 10.25 | 11 / 69.00 | N/A |
| Laurier -> HMC timing | 146 | 25.10 | 37.50 | 41.70 | 26 | 0 | 6.39 | 7.70 | 6.32 | 1.38 | 4.30 | 2.11 | 4.41 | 0.55 | 8.44 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 129 | 25.00 | 33.40 | 41.70 | 20 | 0 | 6.05 | 7.64 | 6.25 | 1.39 | 4.01 | 2.12 | 4.40 | 0.56 | 7.36 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 135 | 25.00 | 33.40 | 41.80 | 14 | 0 | 5.85 | 6.93 | 5.62 | 1.31 | 3.79 | 2.06 | 4.33 | 0.54 | 6.96 | 0 / 0.00 | N/A |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 137 | 20.80 | 49.90 | 54.30 | 18 | 0 | 6.62 | 5.22 | 2.77 | 2.45 | 3.34 | 0.95 | 4.80 | 0.63 | 8.80 | 2 / 56.00 | N/A |
| fling + glide timing | 156 | 12.50 | 20.90 | 50.00 | 2 | 0 | 4.75 | 0.85 | 0.36 | 0.49 | 2.11 | 0.32 | 4.62 | 0.36 | 0.51 | 0 / 0.00 | N/A |
| wayfinder / one turn in 1.5 s timing | 195 | 12.60 | 21.00 | 33.40 | 1 | 0 | 4.53 | 0.76 | 0.31 | 0.44 | 2.39 | 0.30 | 4.70 | 0.44 | 0.41 | 0 / 0.00 | N/A |
| slow pan with glow timing | 241 | 12.60 | 20.90 | 50.10 | 2 | 0 | 4.71 | 0.83 | 0.29 | 0.55 | 2.35 | 0.31 | 4.57 | 0.50 | 0.40 | 0 / 0.00 | N/A |
| map -> Laurier timing | 156 | 25.00 | 33.40 | 45.90 | 13 | 0 | 5.64 | 7.63 | 6.44 | 1.19 | 3.74 | 1.85 | 4.31 | 0.53 | 7.91 | 0 / 0.00 | N/A |
| Laurier -> HMC timing | 145 | 25.10 | 37.60 | 45.90 | 32 | 0 | 6.01 | 8.08 | 6.59 | 1.49 | 4.56 | 2.13 | 4.34 | 0.56 | 8.37 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 134 | 25.00 | 33.40 | 37.50 | 8 | 0 | 5.25 | 7.35 | 5.95 | 1.40 | 4.07 | 2.06 | 4.32 | 0.54 | 7.37 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 138 | 25.00 | 33.30 | 41.70 | 8 | 0 | 5.18 | 6.87 | 5.51 | 1.36 | 4.05 | 2.03 | 4.31 | 0.55 | 7.03 | 0 / 0.00 | N/A |
```

## comb-c-record-test (exit 0)

```text
C8/C2 data/trip normalized digests: 1875534729 / 3057476541
C16 remnant/ember command snapshots changed: 
{
  "1440x900/0/0": "a76b1e95ba298d093ac9168b5e00b0f3a8c060585f9c4c64538161b08cad4cb8",
  "1440x900/0/1": "643118161d7feaefb667c5a092d54a30f22b34055de4aa6b9c87fb31b2b2b625",
  "1440x900/0/2": "e6bd47bc1cc4c74f4498227f47aba10c7f448ed1548e5fce16055957707cc10b",
  "1440x900/0/3": "9bcbf832a686e8e90169b31ea834cfae7e7669320e482fb2c0bfd32c096de19e",
  "1440x900/0/4": "56fc11e7fe607aeb1fc4f4d2ea9ba285bfdebdc4a5631b1f327d2cd8d9d4da17",
  "1440x900/0/5": "832c19de891003eb81be61969f1189d79fa93eef70d4497c6056ddd8cb795374",
  "1440x900/0/6": "5e34adbcae8f61b083c792afdd5b4fd281a855ae84931801d710cd6819057458",
  "412x730/0/0": "de1d8423649b63a2ca69cabf631b332dee747dfb98f137196c5d86242ae2534c",
  "412x730/0/1": "0b31e6289175353ca9eeb178917cbb09971e47a2d5f463d9f1373f528b53f38e",
  "412x730/0/2": "5c3c5bca58c301d3bb55d8cccef76d8c738e0dae41796b6b3a269d62cdc513c5",
  "412x730/0/3": "bb725ebea004bb701dc88e0b6a938fc7b8af3d6980c89a8c29f57545fcc4254b",
  "412x730/0/4": "7ef2f50b28da51ad0ad5e6d8e180c260087d99514ed451a8ce9d0637112a7a6d",
  "412x730/0/5": "75de9db3b6fedb74ec2c75025f631e9c42c45748709bd75dd12ac365c132c3da",
  "412x730/0/6": "e545bae22696a918266f9c2b5ef2c4dc58fd1f86bc17baf19e972a695ef16de9",
  "412x730/1200/0": "e43c832d4a60fb7dc376b9a2e0ff6fdf161ab07e09584cbca33794b064ea095c",
  "412x730/1200/1": "5518818512f23318684761ac584df64d27d06d9fd02913cf7062596f950e46f9",
  "412x730/1200/2": "f8ebfc054059723febb72e0b9878a0ed720ba4b491506058fa5c3f383be35997",
  "412x730/1200/3": "5d09036a38343a60ff39d0d306a1d64747f56af63af53a78d9782c120cdd3046",
  "412x730/1200/4": "2769f01781441edc3a0e3cb364021d027ffc3b40cf1d38e4f7500607b8db83df",
  "412x730/1200/5": "2563831d87d30156ad41c3bb0e591a290980173b1f9a8e959a700d502009896b",
  "412x730/1200/6": "40275570ea7b55630be1f0c1932170dc649d2083665289192172b32e1759bd6d"
}
```

## after frame-cost --passes capture --scenarios 0,1,2,3 (exit 0)

```text
browser: Edg/158.0.4370.33; 412x730; DPR 2.625; touch true; CPU x4
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats capture | 130 | 20.90 | 50.00 | 58.40 | 32 | 0 | 8.34 | 5.49 | 3.04 | 2.44 | 3.32 | 1.01 | 4.89 | 0.68 | 8.70 | 3 / 51.00 | 0 / 152 |
| fling + glide capture | 137 | 16.70 | 20.90 | 41.60 | 2 | 0 | 6.49 | 0.91 | 0.38 | 0.54 | 2.27 | 0.33 | 4.66 | 0.37 | 0.55 | 0 / 0.00 | 0 / 140 |
| wayfinder / one turn in 1.5 s capture | 178 | 16.60 | 25.00 | 37.40 | 2 | 0 | 6.01 | 0.79 | 0.33 | 0.46 | 2.60 | 0.34 | 4.89 | 0.47 | 0.44 | 0 / 0.00 | 0 / 195 |
| slow pan with glow capture | 221 | 16.60 | 20.90 | 45.90 | 3 | 0 | 6.10 | 0.90 | 0.30 | 0.60 | 2.55 | 0.33 | 4.69 | 0.53 | 0.43 | 0 / 0.00 | 0 / 224 |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats capture | 134 | 20.80 | 50.00 | 58.40 | 22 | 0 | 6.83 | 5.41 | 2.88 | 2.53 | 3.49 | 1.00 | 4.89 | 0.67 | 8.58 | 1 / 53.00 | 0 / 154 |
| fling + glide capture | 142 | 12.60 | 21.00 | 41.80 | 3 | 0 | 5.50 | 0.99 | 0.38 | 0.61 | 2.16 | 0.34 | 4.60 | 0.40 | 0.57 | 0 / 0.00 | 0 / 145 |
| wayfinder / one turn in 1.5 s capture | 184 | 16.60 | 25.00 | 33.30 | 1 | 0 | 4.79 | 0.81 | 0.34 | 0.47 | 2.65 | 0.32 | 4.87 | 0.47 | 0.45 | 0 / 0.00 | 0 / 194 |
| slow pan with glow capture | 229 | 16.60 | 20.90 | 50.00 | 2 | 0 | 5.09 | 0.88 | 0.29 | 0.59 | 2.49 | 0.32 | 4.70 | 0.52 | 0.43 | 0 / 0.00 | 0 / 232 |
```

## comb-c-record-test (exit 0)

```text
C8/C2 data/trip normalized digests: 3952659537 / 3057476541
C16 remnant/ember command snapshots changed: 
{
  "1440x900/0/0": "a76b1e95ba298d093ac9168b5e00b0f3a8c060585f9c4c64538161b08cad4cb8",
  "1440x900/0/1": "643118161d7feaefb667c5a092d54a30f22b34055de4aa6b9c87fb31b2b2b625",
  "1440x900/0/2": "e6bd47bc1cc4c74f4498227f47aba10c7f448ed1548e5fce16055957707cc10b",
  "1440x900/0/3": "9bcbf832a686e8e90169b31ea834cfae7e7669320e482fb2c0bfd32c096de19e",
  "1440x900/0/4": "56fc11e7fe607aeb1fc4f4d2ea9ba285bfdebdc4a5631b1f327d2cd8d9d4da17",
  "1440x900/0/5": "832c19de891003eb81be61969f1189d79fa93eef70d4497c6056ddd8cb795374",
  "1440x900/0/6": "5e34adbcae8f61b083c792afdd5b4fd281a855ae84931801d710cd6819057458",
  "412x730/0/0": "de1d8423649b63a2ca69cabf631b332dee747dfb98f137196c5d86242ae2534c",
  "412x730/0/1": "0b31e6289175353ca9eeb178917cbb09971e47a2d5f463d9f1373f528b53f38e",
  "412x730/0/2": "5c3c5bca58c301d3bb55d8cccef76d8c738e0dae41796b6b3a269d62cdc513c5",
  "412x730/0/3": "bb725ebea004bb701dc88e0b6a938fc7b8af3d6980c89a8c29f57545fcc4254b",
  "412x730/0/4": "7ef2f50b28da51ad0ad5e6d8e180c260087d99514ed451a8ce9d0637112a7a6d",
  "412x730/0/5": "75de9db3b6fedb74ec2c75025f631e9c42c45748709bd75dd12ac365c132c3da",
  "412x730/0/6": "e545bae22696a918266f9c2b5ef2c4dc58fd1f86bc17baf19e972a695ef16de9",
  "412x730/1200/0": "e43c832d4a60fb7dc376b9a2e0ff6fdf161ab07e09584cbca33794b064ea095c",
  "412x730/1200/1": "5518818512f23318684761ac584df64d27d06d9fd02913cf7062596f950e46f9",
  "412x730/1200/2": "f8ebfc054059723febb72e0b9878a0ed720ba4b491506058fa5c3f383be35997",
  "412x730/1200/3": "5d09036a38343a60ff39d0d306a1d64747f56af63af53a78d9782c120cdd3046",
  "412x730/1200/4": "2769f01781441edc3a0e3cb364021d027ffc3b40cf1d38e4f7500607b8db83df",
  "412x730/1200/5": "2563831d87d30156ad41c3bb0e591a290980173b1f9a8e959a700d502009896b",
  "412x730/1200/6": "40275570ea7b55630be1f0c1932170dc649d2083665289192172b32e1759bd6d"
}
```

## check (exit 0)

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 16.05 KB / 30; all map modules + CSS 172.50 KB / 185
gzip: dist/journey-map.html 288.83 KB / 320
gzip: dist/journey-joined.html 509.39 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

## steps-test (exit 0)

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

## nova-test (exit 0)

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

## depth-test (exit 0)

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

## layout-test (exit 0)

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

## explore-test (exit 0)

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

## finds-test (exit 0)

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
ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast (8241 writes)
ok: reduced-motion serpent consumes leaves immediately with no swell; no shy hop; all tree actors stay still on hear
ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
ok: footer name layout reads 85 total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: {"resize":17,"fonts":17,"settle-end":17,"explore":34}
ok: actual timeline Home and End handlers select first and last stops
```

## motion-test (exit 0)

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

## hammer-test (exit 0)

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
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00066 ms/step; 2.0s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

## whirl2-test (exit 0)

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

## frame-cost-test (exit 0)

```text
ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature
ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work
```

## frame-performance-test (exit 0)

```text
AFTER 412x730 / 72 moving frames: #cam writes 7; label writes 297; recovery 16 frames / 266.7 ms
ok: bounded pinch rasters agree with virtual camera; <=10% label settle steps; 250 ms recovery; translation-only raster; 50 real opening camera writes; interrupted zoom, resize/exit cleanup and zero idle writes
```

## frame-render-test (exit 0)

```text
phone explore zoom 1: scratch pixels cleared 3609120 -> 871895 (75.8% less); same drawing commands
phone explore zoom 2: scratch pixels cleared 3609120 -> 1037640 (71.2% less); same drawing commands
phone explore zoom 3: scratch pixels cleared 3609120 -> 760250 (78.9% less); same drawing commands
ok: 21 desktop/phone/1200-star WHIRL2 drawing-command snapshots; original blast primitives pinned by whirl2-test; not a pixel comparison
```

## comb-c-legend-test

```text
[
  {
    "P": 1908.5276297597356,
    "root": "jm-steps jm-moving jm-nova-away",
    "legend": [
      {
        "tag": "g",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<g class=\"legend-symbol\" data-i=\"0\" data-x=\"68\" data-y=\"836\" transform=\"translate(-13.263157894736842 -0.236842105263122"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"1\" data-x=\"68\" data-y=\"857\" d=\"M64 853l8 8m0 -8l-8 8\" stroke=\"#F0484F\" stroke-width="
      },
      {
        "tag": "g",
        "cls": "mk legend-symbol",
        "opacity": "0",
        "html": "<g class=\"mk legend-symbol\" data-i=\"2\" data-x=\"140\" data-y=\"838\" transform=\"translate(18.94736842105263 -2.2368421052631"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"3\" data-x=\"140\" data-y=\"857\" d=\"M133 857h14\" stroke=\"#F7F6F3\" stroke-width=\"2.3\" str"
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 840.5)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" data-unit=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 868.921052631579)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" "
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 840.5)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"leg"
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 868.921052631579)\" style=\"opacity: 0;\"><g class=\"label-scale\" data"
      }
    ]
  },
  {
    "P": 1919.9099577494396,
    "root": "jm-steps jm-moving jm-nova-away",
    "legend": [
      {
        "tag": "g",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<g class=\"legend-symbol\" data-i=\"0\" data-x=\"68\" data-y=\"836\" transform=\"translate(-13.263157894736842 -0.236842105263122"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"1\" data-x=\"68\" data-y=\"857\" d=\"M64 853l8 8m0 -8l-8 8\" stroke=\"#F0484F\" stroke-width="
      },
      {
        "tag": "g",
        "cls": "mk legend-symbol",
        "opacity": "0",
        "html": "<g class=\"mk legend-symbol\" data-i=\"2\" data-x=\"140\" data-y=\"838\" transform=\"translate(18.94736842105263 -2.2368421052631"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"3\" data-x=\"140\" data-y=\"857\" d=\"M133 857h14\" stroke=\"#F7F6F3\" stroke-width=\"2.3\" str"
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 840.5)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" data-unit=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 868.921052631579)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" "
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 840.5)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"leg"
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 868.921052631579)\" style=\"opacity: 0;\"><g class=\"label-scale\" data"
      }
    ]
  },
  {
    "P": 1931.4902580497399,
    "root": "jm-steps jm-moving jm-nova-away",
    "legend": [
      {
        "tag": "g",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<g class=\"legend-symbol\" data-i=\"0\" data-x=\"68\" data-y=\"836\" transform=\"translate(-13.263157894736842 -0.236842105263122"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"1\" data-x=\"68\" data-y=\"857\" d=\"M64 853l8 8m0 -8l-8 8\" stroke=\"#F0484F\" stroke-width="
      },
      {
        "tag": "g",
        "cls": "mk legend-symbol",
        "opacity": "0",
        "html": "<g class=\"mk legend-symbol\" data-i=\"2\" data-x=\"140\" data-y=\"838\" transform=\"translate(18.94736842105263 -2.2368421052631"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"3\" data-x=\"140\" data-y=\"857\" d=\"M133 857h14\" stroke=\"#F7F6F3\" stroke-width=\"2.3\" str"
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 840.5)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" data-unit=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 868.921052631579)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" "
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 840.5)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" data-label=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 868.921052631579)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" d"
      }
    ]
  },
  {
    "P": 1942.954330121812,
    "root": "jm-steps jm-moving jm-nova-away",
    "legend": [
      {
        "tag": "g",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<g class=\"legend-symbol\" data-i=\"0\" data-x=\"68\" data-y=\"836\" transform=\"translate(-13.263157894736842 -0.236842105263122"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"1\" data-x=\"68\" data-y=\"857\" d=\"M64 853l8 8m0 -8l-8 8\" stroke=\"#F0484F\" stroke-width="
      },
      {
        "tag": "g",
        "cls": "mk legend-symbol",
        "opacity": "0",
        "html": "<g class=\"mk legend-symbol\" data-i=\"2\" data-x=\"140\" data-y=\"838\" transform=\"translate(18.94736842105263 -2.2368421052631"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"3\" data-x=\"140\" data-y=\"857\" d=\"M133 857h14\" stroke=\"#F7F6F3\" stroke-width=\"2.3\" str"
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 840.5)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" data-unit=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 868.921052631579)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" "
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 840.5)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" data-label=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 868.921052631579)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" d"
      }
    ]
  },
  {
    "P": 1954.4155673590494,
    "root": "jm-steps jm-moving jm-nova-away",
    "legend": [
      {
        "tag": "g",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<g class=\"legend-symbol\" data-i=\"0\" data-x=\"68\" data-y=\"836\" transform=\"translate(-13.263157894736842 -0.236842105263122"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"1\" data-x=\"68\" data-y=\"857\" d=\"M64 853l8 8m0 -8l-8 8\" stroke=\"#F0484F\" stroke-width="
      },
      {
        "tag": "g",
        "cls": "mk legend-symbol",
        "opacity": "0",
        "html": "<g class=\"mk legend-symbol\" data-i=\"2\" data-x=\"140\" data-y=\"838\" transform=\"translate(18.94736842105263 -2.2368421052631"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"3\" data-x=\"140\" data-y=\"857\" d=\"M133 857h14\" stroke=\"#F7F6F3\" stroke-width=\"2.3\" str"
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 840.5)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" data-unit=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 868.921052631579)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" "
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 840.5)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" data-label=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 868.921052631579)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" d"
      }
    ]
  },
  {
    "P": 1965.9987024941845,
    "root": "jm-steps jm-moving jm-nova-away",
    "legend": [
      {
        "tag": "g",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<g class=\"legend-symbol\" data-i=\"0\" data-x=\"68\" data-y=\"836\" transform=\"translate(-13.263157894736842 -0.236842105263122"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"1\" data-x=\"68\" data-y=\"857\" d=\"M64 853l8 8m0 -8l-8 8\" stroke=\"#F0484F\" stroke-width="
      },
      {
        "tag": "g",
        "cls": "mk legend-symbol",
        "opacity": "0",
        "html": "<g class=\"mk legend-symbol\" data-i=\"2\" data-x=\"140\" data-y=\"838\" transform=\"translate(18.94736842105263 -2.2368421052631"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"3\" data-x=\"140\" data-y=\"857\" d=\"M133 857h14\" stroke=\"#F7F6F3\" stroke-width=\"2.3\" str"
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 840.5)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" data-unit=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 868.921052631579)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" "
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 840.5)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" data-label=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 868.921052631579)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" d"
      }
    ]
  },
  {
    "P": 1977.4599397314219,
    "root": "jm-steps jm-moving jm-nova-away",
    "legend": [
      {
        "tag": "g",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<g class=\"legend-symbol\" data-i=\"0\" data-x=\"68\" data-y=\"836\" transform=\"translate(-13.263157894736842 -0.236842105263122"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"1\" data-x=\"68\" data-y=\"857\" d=\"M64 853l8 8m0 -8l-8 8\" stroke=\"#F0484F\" stroke-width="
      },
      {
        "tag": "g",
        "cls": "mk legend-symbol",
        "opacity": "0",
        "html": "<g class=\"mk legend-symbol\" data-i=\"2\" data-x=\"140\" data-y=\"838\" transform=\"translate(18.94736842105263 -2.2368421052631"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"3\" data-x=\"140\" data-y=\"857\" d=\"M133 857h14\" stroke=\"#F7F6F3\" stroke-width=\"2.3\" str"
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 840.5)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" data-unit=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 868.921052631579)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" "
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 840.5)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" data-label=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 868.921052631579)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" d"
      }
    ]
  },
  {
    "P": 1985.5469675092,
    "root": "jm-steps jm-moving jm-nova-away",
    "legend": [
      {
        "tag": "g",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<g class=\"legend-symbol\" data-i=\"0\" data-x=\"68\" data-y=\"836\" transform=\"translate(-13.263157894736842 -0.236842105263122"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"1\" data-x=\"68\" data-y=\"857\" d=\"M64 853l8 8m0 -8l-8 8\" stroke=\"#F0484F\" stroke-width="
      },
      {
        "tag": "g",
        "cls": "mk legend-symbol",
        "opacity": "0",
        "html": "<g class=\"mk legend-symbol\" data-i=\"2\" data-x=\"140\" data-y=\"838\" transform=\"translate(18.94736842105263 -2.2368421052631"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"3\" data-x=\"140\" data-y=\"857\" d=\"M133 857h14\" stroke=\"#F7F6F3\" stroke-width=\"2.3\" str"
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 840.5)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" data-unit=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 868.921052631579)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" "
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 840.5)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" data-label=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 868.921052631579)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" d"
      }
    ]
  },
  {
    "P": 2009.2266972389298,
    "root": "jm-steps jm-moving jm-nova-away",
    "legend": [
      {
        "tag": "g",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<g class=\"legend-symbol\" data-i=\"0\" data-x=\"68\" data-y=\"836\" transform=\"translate(-13.263157894736842 -0.236842105263122"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"1\" data-x=\"68\" data-y=\"857\" d=\"M64 853l8 8m0 -8l-8 8\" stroke=\"#F0484F\" stroke-width="
      },
      {
        "tag": "g",
        "cls": "mk legend-symbol",
        "opacity": "0",
        "html": "<g class=\"mk legend-symbol\" data-i=\"2\" data-x=\"140\" data-y=\"838\" transform=\"translate(18.94736842105263 -2.2368421052631"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"3\" data-x=\"140\" data-y=\"857\" d=\"M133 857h14\" stroke=\"#F7F6F3\" stroke-width=\"2.3\" str"
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 840.5)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" data-unit=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 868.921052631579)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" "
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 840.5)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" data-label=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 868.921052631579)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" d"
      }
    ]
  },
  {
    "P": 2033.408724265957,
    "root": "jm-steps jm-moving jm-nova-away",
    "legend": [
      {
        "tag": "g",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<g class=\"legend-symbol\" data-i=\"0\" data-x=\"68\" data-y=\"836\" transform=\"translate(-13.263157894736842 -0.236842105263122"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"1\" data-x=\"68\" data-y=\"857\" d=\"M64 853l8 8m0 -8l-8 8\" stroke=\"#F0484F\" stroke-width="
      },
      {
        "tag": "g",
        "cls": "mk legend-symbol",
        "opacity": "0",
        "html": "<g class=\"mk legend-symbol\" data-i=\"2\" data-x=\"140\" data-y=\"838\" transform=\"translate(18.94736842105263 -2.2368421052631"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"3\" data-x=\"140\" data-y=\"857\" d=\"M133 857h14\" stroke=\"#F7F6F3\" stroke-width=\"2.3\" str"
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 840.5)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" data-unit=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 868.921052631579)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" "
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 840.5)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" data-label=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 868.921052631579)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" d"
      }
    ]
  },
  {
    "P": 2057.590751292984,
    "root": "jm-steps jm-moving jm-nova-away",
    "legend": [
      {
        "tag": "g",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<g class=\"legend-symbol\" data-i=\"0\" data-x=\"68\" data-y=\"836\" transform=\"translate(-13.263157894736842 -0.236842105263122"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"1\" data-x=\"68\" data-y=\"857\" d=\"M64 853l8 8m0 -8l-8 8\" stroke=\"#F0484F\" stroke-width="
      },
      {
        "tag": "g",
        "cls": "mk legend-symbol",
        "opacity": "0",
        "html": "<g class=\"mk legend-symbol\" data-i=\"2\" data-x=\"140\" data-y=\"838\" transform=\"translate(18.94736842105263 -2.2368421052631"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"3\" data-x=\"140\" data-y=\"857\" d=\"M133 857h14\" stroke=\"#F7F6F3\" stroke-width=\"2.3\" str"
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 840.5)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" data-unit=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 868.921052631579)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" "
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 840.5)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" data-label=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 868.921052631579)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" d"
      }
    ]
  },
  {
    "P": 2081.233423676906,
    "root": "jm-steps jm-moving jm-nova-away",
    "legend": [
      {
        "tag": "g",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<g class=\"legend-symbol\" data-i=\"0\" data-x=\"68\" data-y=\"836\" transform=\"translate(-13.263157894736842 -0.236842105263122"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"1\" data-x=\"68\" data-y=\"857\" d=\"M64 853l8 8m0 -8l-8 8\" stroke=\"#F0484F\" stroke-width="
      },
      {
        "tag": "g",
        "cls": "mk legend-symbol",
        "opacity": "0",
        "html": "<g class=\"mk legend-symbol\" data-i=\"2\" data-x=\"140\" data-y=\"838\" transform=\"translate(18.94736842105263 -2.2368421052631"
      },
      {
        "tag": "path",
        "cls": "legend-symbol",
        "opacity": "0",
        "html": "<path class=\"legend-symbol\" data-i=\"3\" data-x=\"140\" data-y=\"857\" d=\"M133 857h14\" stroke=\"#F7F6F3\" stroke-width=\"2.3\" str"
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 840.5)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" data-unit=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(80 868.921052631579)\" style=\"opacity: 0;\"><g class=\"label-scale\" data-label=\"legend\" "
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 840.5)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" data-label=\""
      },
      {
        "tag": "g",
        "cls": "lg",
        "opacity": "0",
        "html": "<g class=\"lg\" transform=\"translate(184.21052631578948 868.921052631579)\" style=\"opacity: 0.15;\"><g class=\"label-scale\" d"
      }
    ]
  }
]
```

## comb-c-browser-test --film

```text
PASS map-1440x900 laurier tail proportions {"length":38.00000000000006,"base":27.41760000000002,"shield":34.265625,"opacity":1,"face":[436.5115051269531,258.013916015625,1076.5609436035156,618.092041015625],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 laurier fit/paint {"scroll":0,"bottom":618.092041015625,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS map-1440x900 hmc1 tail proportions {"length":37.99999999999994,"base":27.417600000000007,"shield":34.265625,"opacity":1,"face":[436.4810791015625,248.53274536132812,1076.5914306640625,627.6107177734375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 hmc1 fit/paint {"scroll":0,"bottom":627.6107177734375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-1440x900 mohawk tail proportions {"length":38.00000000000006,"base":27.417599999999997,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 mohawk fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS map-1440x900 hmc2 tail proportions {"length":37.99999999999994,"base":27.417600000000064,"shield":34.265625,"opacity":1,"face":[436.4851989746094,239.0318145751953,1076.5872497558594,637.1098175048828],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 hmc2 fit/paint {"scroll":0,"bottom":637.1098175048828,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-1440x900 interkom tail proportions {"length":38,"base":27.417599999999993,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 interkom fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Interkom card","red":0,"shadowBelow":true}
FAIL map-1440x900 beacon clears Interkom {"shield":false,"tail":false,"card":true}
PASS map-1440x900 lennard tail proportions {"length":37.99999999999994,"base":27.41760000000002,"shield":34.265625,"opacity":1,"face":[436.4733581542969,222.04254150390625,1076.5990905761719,653.557861328125],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 lennard fit/paint {"scroll":0,"bottom":653.557861328125,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS map-1440x900 four beacon readings with chest open {"fire":4,"chest":true}
PASS map-1440x900 shield closes and retains focus
PASS map-1440x900 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS map-1440x900 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":34.265625,"opacity":0.0227921,"face":[362.8388977050781,428.8907165527344,398.3606262207031,447.76800537109375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":"st-btn"}
PASS map-1440x900 16 ms close/reopen tails bounded
PASS map-1440x900 X twinkles for 3 s
PASS map-1440x900 second Next preserves full supernova {"ms":5950,"P":2144.7776094010915,"moving":false,"legend":true}
FAIL map-1440x900 legend stays hidden through blast
PASS map-1440x900 opening uses true camera
PASS map-1440x900 explore card controls inert
PASS map-1440x900 compositor scale bounded {"min":1,"max":1.11504}
PASS map-1440x900 sharp final camera
PASS map-1440x900 sharp within 150 ms of <0.5 px/frame {"delay":0,"maxLabelStep":0.014525423795353265}
PASS map-1440x900 settle label steps <=10%
PASS map-1440x900 full gesture composited scale bounded
PASS map-412x730 laurier tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,358,412,672.03125],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":""}
PASS map-412x730 laurier fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS map-412x730 hmc1 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS map-412x730 hmc1 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-412x730 mohawk tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,353,412,672.03125],"stone":[194.890625,315.5536804199219,217.109375,337.7724304199219],"focus":""}
PASS map-412x730 mohawk fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS map-412x730 hmc2 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,302,412,671.578125],"stone":[194.890625,264.5536804199219,217.109375,286.7724304199219],"focus":""}
PASS map-412x730 hmc2 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-412x730 interkom tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS map-412x730 interkom fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS map-412x730 beacon clears Interkom {"shield":false,"tail":false,"card":false}
PASS map-412x730 lennard tail proportions {"length":13.999999999999886,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,277,412,672.125],"stone":[194.890625,239.55368041992188,217.109375,261.7724304199219],"focus":""}
PASS map-412x730 lennard fit/paint {"scroll":0,"bottom":672.125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS map-412x730 four beacon readings with chest open {"fire":4,"chest":true}
PASS map-412x730 shield closes and retains focus
PASS map-412x730 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS map-412x730 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":22.21875,"opacity":0.0227921,"face":[194.87916564941406,323.1874694824219,217.12083435058594,340.14031982421875],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":"st-btn"}
PASS map-412x730 16 ms close/reopen tails bounded
PASS map-412x730 X twinkles for 3 s
PASS map-412x730 second Next preserves full supernova {"ms":5950,"P":2144.7776094010915,"moving":false,"legend":true}
FAIL map-412x730 legend stays hidden through blast
PASS map-412x730 opening uses true camera
PASS map-412x730 explore card controls inert
PASS map-412x730 compositor scale bounded {"min":1,"max":1}
PASS map-412x730 sharp final camera
PASS map-412x730 sharp within 150 ms of <0.5 px/frame {"delay":0,"maxLabelStep":0.008399316005067936}
PASS map-412x730 settle label steps <=10%
PASS map-412x730 full gesture composited scale bounded
PASS map-412x730 390x844 laurier no traveller pixels at tail 0
PASS map-412x730 390x844 hmc1 no traveller pixels at tail 0
PASS map-412x730 390x844 mohawk no traveller pixels at tail 0
PASS map-412x730 390x844 hmc2 no traveller pixels at tail 0
PASS map-412x730 390x844 interkom no traveller pixels at tail 0
PASS map-412x730 390x844 lennard no traveller pixels at tail 0
PASS joined-1440x900 laurier tail proportions {"length":38.00000000000006,"base":27.41760000000002,"shield":34.265625,"opacity":1,"face":[436.5115051269531,258.013916015625,1076.5609436035156,618.092041015625],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 laurier fit/paint {"scroll":0,"bottom":618.092041015625,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS joined-1440x900 hmc1 tail proportions {"length":37.99999999999994,"base":27.417600000000007,"shield":34.265625,"opacity":1,"face":[436.4810791015625,248.53274536132812,1076.5914306640625,627.6107177734375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 hmc1 fit/paint {"scroll":0,"bottom":627.6107177734375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-1440x900 mohawk tail proportions {"length":38.00000000000006,"base":27.417599999999997,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 mohawk fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS joined-1440x900 hmc2 tail proportions {"length":37.99999999999994,"base":27.417600000000064,"shield":34.265625,"opacity":1,"face":[436.4851989746094,239.0318145751953,1076.5872497558594,637.1098175048828],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 hmc2 fit/paint {"scroll":0,"bottom":637.1098175048828,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-1440x900 interkom tail proportions {"length":38,"base":27.417599999999993,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 interkom fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Interkom card","red":0,"shadowBelow":true}
FAIL joined-1440x900 beacon clears Interkom {"shield":false,"tail":false,"card":true}
PASS joined-1440x900 lennard tail proportions {"length":37.99999999999994,"base":27.41760000000002,"shield":34.265625,"opacity":1,"face":[436.4733581542969,222.04254150390625,1076.5990905761719,653.557861328125],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 lennard fit/paint {"scroll":0,"bottom":653.557861328125,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS joined-1440x900 four beacon readings with chest open {"fire":4,"chest":true}
PASS joined-1440x900 shield closes and retains focus
PASS joined-1440x900 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS joined-1440x900 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":34.265625,"opacity":0.0227921,"face":[362.8388977050781,428.8907165527344,398.3606262207031,447.76800537109375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":"st-btn"}
PASS joined-1440x900 16 ms close/reopen tails bounded
PASS joined-1440x900 X twinkles for 3 s
PASS joined-1440x900 second Next preserves full supernova {"ms":5950,"P":2144.7776094010915,"moving":false,"legend":true}
FAIL joined-1440x900 legend stays hidden through blast
PASS joined-1440x900 opening uses true camera
PASS joined-1440x900 explore card controls inert
PASS joined-1440x900 compositor scale bounded {"min":1,"max":1.11504}
PASS joined-1440x900 sharp final camera
PASS joined-1440x900 sharp within 150 ms of <0.5 px/frame {"delay":0,"maxLabelStep":0.014525423795353265}
PASS joined-1440x900 settle label steps <=10%
PASS joined-1440x900 full gesture composited scale bounded
PASS joined-412x730 laurier tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,358,412,672.03125],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":""}
PASS joined-412x730 laurier fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS joined-412x730 hmc1 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS joined-412x730 hmc1 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-412x730 mohawk tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,353,412,672.03125],"stone":[194.890625,315.5536804199219,217.109375,337.7724304199219],"focus":""}
PASS joined-412x730 mohawk fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS joined-412x730 hmc2 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,302,412,671.578125],"stone":[194.890625,264.5536804199219,217.109375,286.7724304199219],"focus":""}
PASS joined-412x730 hmc2 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-412x730 interkom tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS joined-412x730 interkom fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS joined-412x730 beacon clears Interkom {"shield":false,"tail":false,"card":false}
PASS joined-412x730 lennard tail proportions {"length":13.999999999999886,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,277,412,672.125],"stone":[194.890625,239.55368041992188,217.109375,261.7724304199219],"focus":""}
PASS joined-412x730 lennard fit/paint {"scroll":0,"bottom":672.125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS joined-412x730 four beacon readings with chest open {"fire":4,"chest":true}
PASS joined-412x730 shield closes and retains focus
PASS joined-412x730 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS joined-412x730 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":22.21875,"opacity":0.0227921,"face":[194.87916564941406,323.1874694824219,217.12083435058594,340.14031982421875],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":"st-btn"}
PASS joined-412x730 16 ms close/reopen tails bounded
PASS joined-412x730 X twinkles for 3 s
PASS joined-412x730 second Next preserves full supernova {"ms":5950,"P":2144.7776094010915,"moving":false,"legend":true}
FAIL joined-412x730 legend stays hidden through blast
PASS joined-412x730 opening uses true camera
PASS joined-412x730 explore card controls inert
PASS joined-412x730 compositor scale bounded {"min":1,"max":1.13333}
PASS joined-412x730 sharp final camera
PASS joined-412x730 sharp within 150 ms of <0.5 px/frame {"delay":0,"maxLabelStep":0.0087936457998532}
PASS joined-412x730 settle label steps <=10%
PASS joined-412x730 full gesture composited scale bounded
PASS joined-412x730 390x844 laurier no traveller pixels at tail 0
PASS joined-412x730 390x844 hmc1 no traveller pixels at tail 0
PASS joined-412x730 390x844 mohawk no traveller pixels at tail 0
PASS joined-412x730 390x844 hmc2 no traveller pixels at tail 0
PASS joined-412x730 390x844 interkom no traveller pixels at tail 0
PASS joined-412x730 390x844 lennard no traveller pixels at tail 0
PASS 1024x600 laurier compact fit {"bottom":423.0088653564453,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 hmc1 compact fit {"bottom":434.07264709472656,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 mohawk compact fit {"bottom":425.5166931152344,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 hmc2 compact fit {"bottom":450.5826721191406,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 interkom compact fit {"bottom":434.0677795410156,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 lennard compact fit {"bottom":454.5852508544922,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 laurier compact fit {"bottom":483.0088653564453,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 hmc1 compact fit {"bottom":494.07264709472656,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 mohawk compact fit {"bottom":485.5166931152344,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 hmc2 compact fit {"bottom":510.5826721191406,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 interkom compact fit {"bottom":494.0677795410156,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 lennard compact fit {"bottom":514.5852508544922,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 laurier compact fit {"bottom":582.03125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 hmc1 compact fit {"bottom":581.578125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 mohawk compact fit {"bottom":582.03125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 hmc2 compact fit {"bottom":581.578125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 interkom compact fit {"bottom":582.125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 lennard compact fit {"bottom":582.125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 laurier compact fit {"bottom":263.70086669921875,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 hmc1 compact fit {"bottom":263.55452728271484,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 mohawk compact fit {"bottom":264.2989273071289,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 hmc2 compact fit {"bottom":291.6244430541992,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 interkom compact fit {"bottom":263.55181884765625,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 lennard compact fit {"bottom":293.56243896484375,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS no browser exceptions []
```

## comb-c-record-test (exit 0)

```text
C8/C2 data/trip normalized digests: 3228382006 / 3057476541
C16 remnant/ember command snapshots changed: 
{
  "1440x900/0/0": "a76b1e95ba298d093ac9168b5e00b0f3a8c060585f9c4c64538161b08cad4cb8",
  "1440x900/0/1": "643118161d7feaefb667c5a092d54a30f22b34055de4aa6b9c87fb31b2b2b625",
  "1440x900/0/2": "e6bd47bc1cc4c74f4498227f47aba10c7f448ed1548e5fce16055957707cc10b",
  "1440x900/0/3": "9bcbf832a686e8e90169b31ea834cfae7e7669320e482fb2c0bfd32c096de19e",
  "1440x900/0/4": "56fc11e7fe607aeb1fc4f4d2ea9ba285bfdebdc4a5631b1f327d2cd8d9d4da17",
  "1440x900/0/5": "832c19de891003eb81be61969f1189d79fa93eef70d4497c6056ddd8cb795374",
  "1440x900/0/6": "5e34adbcae8f61b083c792afdd5b4fd281a855ae84931801d710cd6819057458",
  "412x730/0/0": "de1d8423649b63a2ca69cabf631b332dee747dfb98f137196c5d86242ae2534c",
  "412x730/0/1": "0b31e6289175353ca9eeb178917cbb09971e47a2d5f463d9f1373f528b53f38e",
  "412x730/0/2": "5c3c5bca58c301d3bb55d8cccef76d8c738e0dae41796b6b3a269d62cdc513c5",
  "412x730/0/3": "bb725ebea004bb701dc88e0b6a938fc7b8af3d6980c89a8c29f57545fcc4254b",
  "412x730/0/4": "7ef2f50b28da51ad0ad5e6d8e180c260087d99514ed451a8ce9d0637112a7a6d",
  "412x730/0/5": "75de9db3b6fedb74ec2c75025f631e9c42c45748709bd75dd12ac365c132c3da",
  "412x730/0/6": "e545bae22696a918266f9c2b5ef2c4dc58fd1f86bc17baf19e972a695ef16de9",
  "412x730/1200/0": "e43c832d4a60fb7dc376b9a2e0ff6fdf161ab07e09584cbca33794b064ea095c",
  "412x730/1200/1": "5518818512f23318684761ac584df64d27d06d9fd02913cf7062596f950e46f9",
  "412x730/1200/2": "f8ebfc054059723febb72e0b9878a0ed720ba4b491506058fa5c3f383be35997",
  "412x730/1200/3": "5d09036a38343a60ff39d0d306a1d64747f56af63af53a78d9782c120cdd3046",
  "412x730/1200/4": "2769f01781441edc3a0e3cb364021d027ffc3b40cf1d38e4f7500607b8db83df",
  "412x730/1200/5": "2563831d87d30156ad41c3bb0e591a290980173b1f9a8e959a700d502009896b",
  "412x730/1200/6": "40275570ea7b55630be1f0c1932170dc649d2083665289192172b32e1759bd6d"
}
```

## steps-test (exit 0)

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

## comb-c-tail-test (exit 0)

```text
1440x900: bounded tail max 38.000 px, proportional base, closed tail hidden
1024x600: bounded tail max 29.808 px, proportional base, closed tail hidden
412x730: bounded tail max 14.000 px, proportional base, closed tail hidden
390x844: bounded tail max 14.000 px, proportional base, closed tail hidden
360x640: bounded tail max 14.000 px, proportional base, closed tail hidden
844x390: bounded tail max 21.000 px, proportional base, closed tail hidden
ok: 1092 projected card samples; 360 ember/coast rays
```

## comb-c-browser-test --film

```text
PASS map-1440x900 laurier tail proportions {"length":38.00000000000006,"base":27.41760000000002,"shield":34.265625,"opacity":1,"face":[436.5115051269531,258.013916015625,1076.5609436035156,618.092041015625],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 laurier fit/paint {"scroll":0,"bottom":618.092041015625,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS map-1440x900 hmc1 tail proportions {"length":37.99999999999994,"base":27.417600000000007,"shield":34.265625,"opacity":1,"face":[436.4810791015625,248.53274536132812,1076.5914306640625,627.6107177734375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 hmc1 fit/paint {"scroll":0,"bottom":627.6107177734375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-1440x900 mohawk tail proportions {"length":38.00000000000006,"base":27.417599999999997,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 mohawk fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS map-1440x900 hmc2 tail proportions {"length":37.99999999999994,"base":27.417600000000064,"shield":34.265625,"opacity":1,"face":[436.4851989746094,239.0318145751953,1076.5872497558594,637.1098175048828],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 hmc2 fit/paint {"scroll":0,"bottom":637.1098175048828,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-1440x900 interkom tail proportions {"length":38,"base":27.417599999999993,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 interkom fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS map-1440x900 beacon clears Interkom {"shield":false,"tail":false,"card":false}
PASS map-1440x900 lennard tail proportions {"length":37.99999999999994,"base":27.41760000000002,"shield":34.265625,"opacity":1,"face":[436.4733581542969,222.04254150390625,1076.5990905761719,653.557861328125],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 lennard fit/paint {"scroll":0,"bottom":653.557861328125,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS map-1440x900 four beacon readings with chest open {"fire":4,"chest":true}
PASS map-1440x900 shield closes and retains focus
PASS map-1440x900 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS map-1440x900 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":34.265625,"opacity":0.0227921,"face":[362.8388977050781,428.8907165527344,398.3606262207031,447.76800537109375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":"st-btn"}
PASS map-1440x900 16 ms close/reopen tails bounded
PASS map-1440x900 X twinkles for 3 s
PASS map-1440x900 second Next preserves full supernova {"ms":5950,"P":2144.7776094010915,"moving":false,"legend":true}
PASS map-1440x900 legend stays dimmed or hidden through blast {"failedFrames":[]}
PASS map-1440x900 opening uses true camera
PASS map-1440x900 explore card controls inert
PASS map-1440x900 compositor scale bounded {"min":1,"max":1.11504}
PASS map-1440x900 sharp final camera
PASS map-1440x900 sharp within 150 ms of <0.5 px/frame {"delay":0,"maxLabelStep":0.014525423795353265}
PASS map-1440x900 settle label steps <=10%
PASS map-1440x900 full gesture composited scale bounded {"min":1,"max":1.14903,"zoom":1.7788570707707834}
PASS map-412x730 laurier tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,358,412,672.03125],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":""}
PASS map-412x730 laurier fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS map-412x730 hmc1 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS map-412x730 hmc1 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-412x730 mohawk tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,353,412,672.03125],"stone":[194.890625,315.5536804199219,217.109375,337.7724304199219],"focus":""}
PASS map-412x730 mohawk fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS map-412x730 hmc2 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,302,412,671.578125],"stone":[194.890625,264.5536804199219,217.109375,286.7724304199219],"focus":""}
PASS map-412x730 hmc2 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-412x730 interkom tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS map-412x730 interkom fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS map-412x730 beacon clears Interkom {"shield":false,"tail":false,"card":false}
PASS map-412x730 lennard tail proportions {"length":13.999999999999886,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,277,412,672.125],"stone":[194.890625,239.55368041992188,217.109375,261.7724304199219],"focus":""}
PASS map-412x730 lennard fit/paint {"scroll":0,"bottom":672.125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS map-412x730 four beacon readings with chest open {"fire":4,"chest":true}
PASS map-412x730 shield closes and retains focus
PASS map-412x730 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS map-412x730 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":22.21875,"opacity":0.0227921,"face":[194.87916564941406,323.1874694824219,217.12083435058594,340.14031982421875],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":"st-btn"}
PASS map-412x730 16 ms close/reopen tails bounded
PASS map-412x730 X twinkles for 3 s
PASS map-412x730 second Next preserves full supernova {"ms":5950,"P":2144.7776094010915,"moving":false,"legend":true}
PASS map-412x730 legend stays dimmed or hidden through blast {"failedFrames":[]}
PASS map-412x730 opening uses true camera
PASS map-412x730 explore card controls inert
PASS map-412x730 compositor scale bounded {"min":1,"max":1.0625}
PASS map-412x730 sharp final camera
PASS map-412x730 sharp within 150 ms of <0.5 px/frame {"delay":0,"maxLabelStep":0.02826003097153229}
PASS map-412x730 settle label steps <=10%
PASS map-412x730 full gesture composited scale bounded {"min":1,"max":1.14286,"zoom":2.9998509020426423}
PASS map-412x730 390x844 laurier no traveller pixels at tail 0
PASS map-412x730 390x844 hmc1 no traveller pixels at tail 0
PASS map-412x730 390x844 mohawk no traveller pixels at tail 0
PASS map-412x730 390x844 hmc2 no traveller pixels at tail 0
PASS map-412x730 390x844 interkom no traveller pixels at tail 0
PASS map-412x730 390x844 lennard no traveller pixels at tail 0
PASS joined-1440x900 laurier tail proportions {"length":38.00000000000006,"base":27.41760000000002,"shield":34.265625,"opacity":1,"face":[436.5115051269531,258.013916015625,1076.5609436035156,618.092041015625],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 laurier fit/paint {"scroll":0,"bottom":618.092041015625,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS joined-1440x900 hmc1 tail proportions {"length":37.99999999999994,"base":27.417600000000007,"shield":34.265625,"opacity":1,"face":[436.4810791015625,248.53274536132812,1076.5914306640625,627.6107177734375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 hmc1 fit/paint {"scroll":0,"bottom":627.6107177734375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-1440x900 mohawk tail proportions {"length":38.00000000000006,"base":27.417599999999997,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 mohawk fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS joined-1440x900 hmc2 tail proportions {"length":37.99999999999994,"base":27.417600000000064,"shield":34.265625,"opacity":1,"face":[436.4851989746094,239.0318145751953,1076.5872497558594,637.1098175048828],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 hmc2 fit/paint {"scroll":0,"bottom":637.1098175048828,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-1440x900 interkom tail proportions {"length":38,"base":27.417599999999993,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 interkom fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS joined-1440x900 beacon clears Interkom {"shield":false,"tail":false,"card":false}
PASS joined-1440x900 lennard tail proportions {"length":37.99999999999994,"base":27.41760000000002,"shield":34.265625,"opacity":1,"face":[436.4733581542969,222.04254150390625,1076.5990905761719,653.557861328125],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 lennard fit/paint {"scroll":0,"bottom":653.557861328125,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS joined-1440x900 four beacon readings with chest open {"fire":4,"chest":true}
PASS joined-1440x900 shield closes and retains focus
PASS joined-1440x900 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS joined-1440x900 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":34.265625,"opacity":0.0227921,"face":[362.8388977050781,428.8907165527344,398.3606262207031,447.76800537109375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":"st-btn"}
PASS joined-1440x900 16 ms close/reopen tails bounded
PASS joined-1440x900 X twinkles for 3 s
PASS joined-1440x900 second Next preserves full supernova {"ms":5950,"P":2144.7776094010915,"moving":false,"legend":true}
PASS joined-1440x900 legend stays dimmed or hidden through blast {"failedFrames":[]}
PASS joined-1440x900 opening uses true camera
PASS joined-1440x900 explore card controls inert
PASS joined-1440x900 compositor scale bounded {"min":1,"max":1.11504}
PASS joined-1440x900 sharp final camera
PASS joined-1440x900 sharp within 150 ms of <0.5 px/frame {"delay":0,"maxLabelStep":0.014525423795353265}
PASS joined-1440x900 settle label steps <=10%
PASS joined-1440x900 full gesture composited scale bounded {"min":1,"max":1.14903,"zoom":1.7788570707707834}
PASS joined-412x730 laurier tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,358,412,672.03125],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":""}
PASS joined-412x730 laurier fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS joined-412x730 hmc1 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS joined-412x730 hmc1 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-412x730 mohawk tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,353,412,672.03125],"stone":[194.890625,315.5536804199219,217.109375,337.7724304199219],"focus":""}
PASS joined-412x730 mohawk fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS joined-412x730 hmc2 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,302,412,671.578125],"stone":[194.890625,264.5536804199219,217.109375,286.7724304199219],"focus":""}
PASS joined-412x730 hmc2 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-412x730 interkom tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS joined-412x730 interkom fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS joined-412x730 beacon clears Interkom {"shield":false,"tail":false,"card":false}
PASS joined-412x730 lennard tail proportions {"length":13.999999999999886,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,277,412,672.125],"stone":[194.890625,239.55368041992188,217.109375,261.7724304199219],"focus":""}
PASS joined-412x730 lennard fit/paint {"scroll":0,"bottom":672.125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS joined-412x730 four beacon readings with chest open {"fire":4,"chest":true}
PASS joined-412x730 shield closes and retains focus
PASS joined-412x730 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS joined-412x730 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":22.21875,"opacity":0.0227921,"face":[194.87916564941406,323.1874694824219,217.12083435058594,340.14031982421875],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":"st-btn"}
PASS joined-412x730 16 ms close/reopen tails bounded
PASS joined-412x730 X twinkles for 3 s
PASS joined-412x730 second Next preserves full supernova {"ms":5950,"P":2144.7776094010915,"moving":false,"legend":true}
PASS joined-412x730 legend stays dimmed or hidden through blast {"failedFrames":[]}
PASS joined-412x730 opening uses true camera
PASS joined-412x730 explore card controls inert
PASS joined-412x730 compositor scale bounded {"min":1,"max":1.0625}
PASS joined-412x730 sharp final camera
PASS joined-412x730 sharp within 150 ms of <0.5 px/frame {"delay":0,"maxLabelStep":0.028827355799445953}
PASS joined-412x730 settle label steps <=10%
PASS joined-412x730 full gesture composited scale bounded {"min":1,"max":1.11111,"zoom":2.9998509020426423}
PASS joined-412x730 390x844 laurier no traveller pixels at tail 0
PASS joined-412x730 390x844 hmc1 no traveller pixels at tail 0
PASS joined-412x730 390x844 mohawk no traveller pixels at tail 0
PASS joined-412x730 390x844 hmc2 no traveller pixels at tail 0
PASS joined-412x730 390x844 interkom no traveller pixels at tail 0
PASS joined-412x730 390x844 lennard no traveller pixels at tail 0
PASS 1024x600 laurier compact fit {"bottom":423.0088653564453,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 hmc1 compact fit {"bottom":434.07264709472656,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 mohawk compact fit {"bottom":425.5166931152344,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 hmc2 compact fit {"bottom":450.5826721191406,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 interkom compact fit {"bottom":434.0677795410156,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 lennard compact fit {"bottom":454.5852508544922,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 laurier compact fit {"bottom":483.0088653564453,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 hmc1 compact fit {"bottom":494.07264709472656,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 mohawk compact fit {"bottom":485.5166931152344,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 hmc2 compact fit {"bottom":510.5826721191406,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 interkom compact fit {"bottom":494.0677795410156,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 lennard compact fit {"bottom":514.5852508544922,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 laurier compact fit {"bottom":582.03125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 hmc1 compact fit {"bottom":581.578125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 mohawk compact fit {"bottom":582.03125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 hmc2 compact fit {"bottom":581.578125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 interkom compact fit {"bottom":582.125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 lennard compact fit {"bottom":582.125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 laurier compact fit {"bottom":263.70086669921875,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 hmc1 compact fit {"bottom":263.55452728271484,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 mohawk compact fit {"bottom":264.2989273071289,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 hmc2 compact fit {"bottom":291.6244430541992,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 interkom compact fit {"bottom":263.55181884765625,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 lennard compact fit {"bottom":293.56243896484375,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS no browser exceptions []
```

## check (exit 0)

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 16.05 KB / 30; all map modules + CSS 172.62 KB / 185
gzip: dist/journey-map.html 288.96 KB / 320
gzip: dist/journey-joined.html 509.52 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

## steps-test (exit 0)

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

## nova-test (exit 0)

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

## depth-test (exit 0)

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

## layout-test (exit 0)

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

## explore-test (exit 0)

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

## finds-test (exit 0)

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
ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast (8242 writes)
ok: reduced-motion serpent consumes leaves immediately with no swell; no shy hop; all tree actors stay still on hear
ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
ok: footer name layout reads 85 total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: {"resize":17,"fonts":17,"settle-end":17,"explore":34}
ok: actual timeline Home and End handlers select first and last stops
```

## motion-test (exit 0)

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

## hammer-test (exit 0)

```text
ok: D3 foe heights incl stroke: giants/chief 16, hunched draugr 11, low full-width wolf 8; wave 1 varies; five overlapping shields span each unchanged segment
ok: original Norse foe silhouettes and their strokes fit unchanged hit boxes
ok: identical seeds and inputs match step for step
ok: 350 seeded formations/bosses fit their wave rows; unique fates; clay at 60%, heart at 30%
ok: 34 per-level rune effect checks; excluded runes absent
ok: cold includes both flights and glove; heat splits twice; draugr rises once; need multiplies the return upgrade; exposed stone heart doubles a hit
ok: return/catch, first-hit memory, shields, bridge loss; pool sizes and identities unchanged after 10,000 steps
steady: 200 seeds; wave 4 74.0%; wins 17.5%; ended by wave 3 26.0%; longest 223.6s; 0.00078 ms/step; 1.7s wall
ends {"6:bridge":6,"7:won":35,"5:bridge":10,"3:hearts":35,"5:hearts":42,"6:hearts":14,"4:hearts":28,"4:bridge":8,"2:hearts":12,"3:bridge":3,"7:hearts":5,"2:bridge":1,"1:hearts":1}
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00101 ms/step; 3.1s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

## whirl2-test (exit 0)

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

## frame-cost-test (exit 0)

```text
ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature
ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work
```

## frame-performance-test (exit 0)

```text
AFTER 412x730 / 72 moving frames: #cam writes 7; label writes 297; recovery 16 frames / 266.7 ms
ok: bounded pinch rasters agree with virtual camera; <=10% label settle steps; 250 ms recovery; translation-only raster; 50 real opening camera writes; interrupted zoom, resize/exit cleanup and zero idle writes
```

## frame-render-test (exit 0)

```text
phone explore zoom 1: scratch pixels cleared 3609120 -> 871895 (75.8% less); same drawing commands
phone explore zoom 2: scratch pixels cleared 3609120 -> 1037640 (71.2% less); same drawing commands
phone explore zoom 3: scratch pixels cleared 3609120 -> 760250 (78.9% less); same drawing commands
ok: 21 desktop/phone/1200-star WHIRL2 drawing-command snapshots; original blast primitives pinned by whirl2-test; not a pixel comparison
```

## comb-c-browser-test --film --cards-only

```text
PASS map-1440x900 laurier tail proportions {"length":38.00000000000006,"base":27.41760000000008,"shield":34.265625,"opacity":1,"face":[436.5115051269531,258.013916015625,1076.5609436035156,618.092041015625],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 laurier fit/paint {"scroll":0,"bottom":618.092041015625,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS map-1440x900 hmc1 tail proportions {"length":37.99999999999994,"base":27.417600000000007,"shield":34.265625,"opacity":1,"face":[436.4810791015625,248.53274536132812,1076.5914306640625,627.6107177734375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 hmc1 fit/paint {"scroll":0,"bottom":627.6107177734375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-1440x900 mohawk tail proportions {"length":38,"base":27.417599999999997,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 mohawk fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS map-1440x900 hmc2 tail proportions {"length":37.99999999999994,"base":27.417600000000007,"shield":34.265625,"opacity":1,"face":[436.4851989746094,239.0318145751953,1076.5872497558594,637.1098175048828],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 hmc2 fit/paint {"scroll":0,"bottom":637.1098175048828,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-1440x900 interkom tail proportions {"length":37.99999999999994,"base":27.417599999999993,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 interkom fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS map-1440x900 beacon clears Interkom {"shield":false,"tail":false,"card":false}
PASS map-1440x900 lennard tail proportions {"length":37.99999999999994,"base":27.41760000000002,"shield":34.265625,"opacity":1,"face":[436.4733581542969,222.04254150390625,1076.5990905761719,653.557861328125],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 lennard fit/paint {"scroll":0,"bottom":653.557861328125,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS map-1440x900 tail edge is 1 screen px {"stroke":1,"a":1,"b":0,"c":0,"d":1}
PASS map-1440x900 four beacon readings with chest open {"fire":4,"chest":true}
PASS map-1440x900 shield closes and retains focus
PASS map-1440x900 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS map-1440x900 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":34.265625,"opacity":0.0227921,"face":[362.8388977050781,428.8907165527344,398.3606262207031,447.76800537109375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":"st-btn"}
PASS map-1440x900 16 ms close/reopen tails bounded
PASS map-412x730 laurier tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,358,412,672.03125],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":""}
PASS map-412x730 laurier fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS map-412x730 hmc1 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS map-412x730 hmc1 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-412x730 mohawk tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,353,412,672.03125],"stone":[194.890625,315.5536804199219,217.109375,337.7724304199219],"focus":""}
PASS map-412x730 mohawk fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS map-412x730 hmc2 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,302,412,671.578125],"stone":[194.890625,264.5536804199219,217.109375,286.7724304199219],"focus":""}
PASS map-412x730 hmc2 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-412x730 interkom tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS map-412x730 interkom fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS map-412x730 beacon clears Interkom {"shield":false,"tail":false,"card":false}
PASS map-412x730 lennard tail proportions {"length":13.999999999999886,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,277,412,672.125],"stone":[194.890625,239.55368041992188,217.109375,261.7724304199219],"focus":""}
PASS map-412x730 lennard fit/paint {"scroll":0,"bottom":672.125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS map-412x730 tail edge is 1 screen px {"stroke":1,"a":1,"b":0,"c":0,"d":1}
PASS map-412x730 four beacon readings with chest open {"fire":4,"chest":true}
PASS map-412x730 shield closes and retains focus
PASS map-412x730 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS map-412x730 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":22.21875,"opacity":0.0227921,"face":[194.87916564941406,323.1874694824219,217.12083435058594,340.14031982421875],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":"st-btn"}
PASS map-412x730 16 ms close/reopen tails bounded
FAIL map-412x730 390x844 laurier no traveller pixels at tail 49
PASS map-412x730 390x844 hmc1 no traveller pixels at tail 0
PASS map-412x730 390x844 mohawk no traveller pixels at tail 0
PASS map-412x730 390x844 hmc2 no traveller pixels at tail 0
PASS map-412x730 390x844 interkom no traveller pixels at tail 0
PASS map-412x730 390x844 lennard no traveller pixels at tail 0
PASS joined-1440x900 laurier tail proportions {"length":38.00000000000006,"base":27.41760000000008,"shield":34.265625,"opacity":1,"face":[436.5115051269531,258.013916015625,1076.5609436035156,618.092041015625],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 laurier fit/paint {"scroll":0,"bottom":618.092041015625,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS joined-1440x900 hmc1 tail proportions {"length":37.99999999999994,"base":27.417600000000007,"shield":34.265625,"opacity":1,"face":[436.4810791015625,248.53274536132812,1076.5914306640625,627.6107177734375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 hmc1 fit/paint {"scroll":0,"bottom":627.6107177734375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-1440x900 mohawk tail proportions {"length":38,"base":27.417599999999997,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 mohawk fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS joined-1440x900 hmc2 tail proportions {"length":37.99999999999994,"base":27.417600000000007,"shield":34.265625,"opacity":1,"face":[436.4851989746094,239.0318145751953,1076.5872497558594,637.1098175048828],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 hmc2 fit/paint {"scroll":0,"bottom":637.1098175048828,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-1440x900 interkom tail proportions {"length":37.99999999999994,"base":27.417599999999993,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 interkom fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS joined-1440x900 beacon clears Interkom {"shield":false,"tail":false,"card":false}
PASS joined-1440x900 lennard tail proportions {"length":37.99999999999994,"base":27.41760000000002,"shield":34.265625,"opacity":1,"face":[436.4733581542969,222.04254150390625,1076.5990905761719,653.557861328125],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 lennard fit/paint {"scroll":0,"bottom":653.557861328125,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS joined-1440x900 tail edge is 1 screen px {"stroke":1,"a":1,"b":0,"c":0,"d":1}
PASS joined-1440x900 four beacon readings with chest open {"fire":4,"chest":true}
PASS joined-1440x900 shield closes and retains focus
PASS joined-1440x900 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS joined-1440x900 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":34.265625,"opacity":0.0227921,"face":[362.8388977050781,428.8907165527344,398.3606262207031,447.76800537109375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":"st-btn"}
PASS joined-1440x900 16 ms close/reopen tails bounded
PASS joined-412x730 laurier tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,358,412,672.03125],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":""}
PASS joined-412x730 laurier fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS joined-412x730 hmc1 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS joined-412x730 hmc1 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-412x730 mohawk tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,353,412,672.03125],"stone":[194.890625,315.5536804199219,217.109375,337.7724304199219],"focus":""}
PASS joined-412x730 mohawk fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS joined-412x730 hmc2 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,302,412,671.578125],"stone":[194.890625,264.5536804199219,217.109375,286.7724304199219],"focus":""}
PASS joined-412x730 hmc2 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-412x730 interkom tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS joined-412x730 interkom fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS joined-412x730 beacon clears Interkom {"shield":false,"tail":false,"card":false}
PASS joined-412x730 lennard tail proportions {"length":13.999999999999886,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,277,412,672.125],"stone":[194.890625,239.55368041992188,217.109375,261.7724304199219],"focus":""}
PASS joined-412x730 lennard fit/paint {"scroll":0,"bottom":672.125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS joined-412x730 tail edge is 1 screen px {"stroke":1,"a":1,"b":0,"c":0,"d":1}
PASS joined-412x730 four beacon readings with chest open {"fire":4,"chest":true}
PASS joined-412x730 shield closes and retains focus
PASS joined-412x730 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS joined-412x730 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":22.21875,"opacity":0.0227921,"face":[194.87916564941406,323.1874694824219,217.12083435058594,340.14031982421875],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":"st-btn"}
PASS joined-412x730 16 ms close/reopen tails bounded
FAIL joined-412x730 390x844 laurier no traveller pixels at tail 49
PASS joined-412x730 390x844 hmc1 no traveller pixels at tail 0
PASS joined-412x730 390x844 mohawk no traveller pixels at tail 0
PASS joined-412x730 390x844 hmc2 no traveller pixels at tail 0
PASS joined-412x730 390x844 interkom no traveller pixels at tail 0
PASS joined-412x730 390x844 lennard no traveller pixels at tail 0
PASS 1024x600 laurier compact fit {"bottom":423.0088653564453,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 hmc1 compact fit {"bottom":434.07264709472656,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 mohawk compact fit {"bottom":425.5166931152344,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 hmc2 compact fit {"bottom":450.5826721191406,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 interkom compact fit {"bottom":434.0677795410156,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 lennard compact fit {"bottom":454.5852508544922,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 laurier compact fit {"bottom":483.0088653564453,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 hmc1 compact fit {"bottom":494.07264709472656,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 mohawk compact fit {"bottom":485.5166931152344,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 hmc2 compact fit {"bottom":510.5826721191406,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 interkom compact fit {"bottom":494.0677795410156,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 lennard compact fit {"bottom":514.5852508544922,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 laurier compact fit {"bottom":582.03125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 hmc1 compact fit {"bottom":581.578125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 mohawk compact fit {"bottom":582.03125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 hmc2 compact fit {"bottom":581.578125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 interkom compact fit {"bottom":582.125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 lennard compact fit {"bottom":582.125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 laurier compact fit {"bottom":263.70086669921875,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 hmc1 compact fit {"bottom":263.55452728271484,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 mohawk compact fit {"bottom":264.2989273071289,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 hmc2 compact fit {"bottom":291.6244430541992,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 interkom compact fit {"bottom":263.55181884765625,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 lennard compact fit {"bottom":293.56243896484375,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS no browser exceptions []
```

## comb-c-fixture-test (exit 0)

```text
ok: 390x844 fixture explicitly opens a remembered-closed Laurier card before measuring the open tail
```

## comb-c-browser-test --film --cards-only

```text
PASS map-1440x900 laurier tail proportions {"length":38.00000000000006,"base":27.41760000000008,"shield":34.265625,"opacity":1,"face":[436.5115051269531,258.013916015625,1076.5609436035156,618.092041015625],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 laurier fit/paint {"scroll":0,"bottom":618.092041015625,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS map-1440x900 hmc1 tail proportions {"length":37.99999999999994,"base":27.417600000000007,"shield":34.265625,"opacity":1,"face":[436.4810791015625,248.53274536132812,1076.5914306640625,627.6107177734375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 hmc1 fit/paint {"scroll":0,"bottom":627.6107177734375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-1440x900 mohawk tail proportions {"length":38,"base":27.417599999999997,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 mohawk fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS map-1440x900 hmc2 tail proportions {"length":37.99999999999994,"base":27.417600000000007,"shield":34.265625,"opacity":1,"face":[436.4851989746094,239.0318145751953,1076.5872497558594,637.1098175048828],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 hmc2 fit/paint {"scroll":0,"bottom":637.1098175048828,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-1440x900 interkom tail proportions {"length":37.99999999999994,"base":27.417599999999993,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 interkom fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS map-1440x900 beacon clears Interkom {"shield":false,"tail":false,"card":false}
PASS map-1440x900 lennard tail proportions {"length":37.99999999999994,"base":27.41760000000002,"shield":34.265625,"opacity":1,"face":[436.4733581542969,222.04254150390625,1076.5990905761719,653.557861328125],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 lennard fit/paint {"scroll":0,"bottom":653.557861328125,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS map-1440x900 tail edge is 1 screen px {"stroke":1,"a":1,"b":0,"c":0,"d":1}
PASS map-1440x900 four beacon readings with chest open {"fire":4,"chest":true}
PASS map-1440x900 shield closes and retains focus
PASS map-1440x900 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS map-1440x900 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":34.265625,"opacity":0.0227921,"face":[362.8388977050781,428.8907165527344,398.3606262207031,447.76800537109375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":"st-btn"}
PASS map-1440x900 16 ms close/reopen tails bounded
PASS map-412x730 laurier tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,358,412,672.03125],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":""}
PASS map-412x730 laurier fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS map-412x730 hmc1 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS map-412x730 hmc1 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-412x730 mohawk tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,353,412,672.03125],"stone":[194.890625,315.5536804199219,217.109375,337.7724304199219],"focus":""}
PASS map-412x730 mohawk fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS map-412x730 hmc2 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,302,412,671.578125],"stone":[194.890625,264.5536804199219,217.109375,286.7724304199219],"focus":""}
PASS map-412x730 hmc2 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-412x730 interkom tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS map-412x730 interkom fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS map-412x730 beacon clears Interkom {"shield":false,"tail":false,"card":false}
PASS map-412x730 lennard tail proportions {"length":13.999999999999886,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,277,412,672.125],"stone":[194.890625,239.55368041992188,217.109375,261.7724304199219],"focus":""}
PASS map-412x730 lennard fit/paint {"scroll":0,"bottom":672.125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS map-412x730 tail edge is 1 screen px {"stroke":1,"a":1,"b":0,"c":0,"d":1}
PASS map-412x730 four beacon readings with chest open {"fire":4,"chest":true}
PASS map-412x730 shield closes and retains focus
PASS map-412x730 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS map-412x730 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":22.21875,"opacity":0.0227921,"face":[194.87916564941406,323.1874694824219,217.12083435058594,340.14031982421875],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":"st-btn"}
PASS map-412x730 16 ms close/reopen tails bounded
PASS map-412x730 390x844 laurier no traveller pixels at tail 0
PASS map-412x730 390x844 hmc1 no traveller pixels at tail 0
PASS map-412x730 390x844 mohawk no traveller pixels at tail 0
PASS map-412x730 390x844 hmc2 no traveller pixels at tail 0
PASS map-412x730 390x844 interkom no traveller pixels at tail 0
PASS map-412x730 390x844 lennard no traveller pixels at tail 0
PASS joined-1440x900 laurier tail proportions {"length":38.00000000000006,"base":27.41760000000008,"shield":34.265625,"opacity":1,"face":[436.5115051269531,258.013916015625,1076.5609436035156,618.092041015625],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 laurier fit/paint {"scroll":0,"bottom":618.092041015625,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS joined-1440x900 hmc1 tail proportions {"length":37.99999999999994,"base":27.417600000000007,"shield":34.265625,"opacity":1,"face":[436.4810791015625,248.53274536132812,1076.5914306640625,627.6107177734375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 hmc1 fit/paint {"scroll":0,"bottom":627.6107177734375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-1440x900 mohawk tail proportions {"length":38,"base":27.417599999999997,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 mohawk fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS joined-1440x900 hmc2 tail proportions {"length":37.99999999999994,"base":27.417600000000007,"shield":34.265625,"opacity":1,"face":[436.4851989746094,239.0318145751953,1076.5872497558594,637.1098175048828],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 hmc2 fit/paint {"scroll":0,"bottom":637.1098175048828,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-1440x900 interkom tail proportions {"length":37.99999999999994,"base":27.417599999999993,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 interkom fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS joined-1440x900 beacon clears Interkom {"shield":false,"tail":false,"card":false}
PASS joined-1440x900 lennard tail proportions {"length":37.99999999999994,"base":27.41760000000002,"shield":34.265625,"opacity":1,"face":[436.4733581542969,222.04254150390625,1076.5990905761719,653.557861328125],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 lennard fit/paint {"scroll":0,"bottom":653.557861328125,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS joined-1440x900 tail edge is 1 screen px {"stroke":1,"a":1,"b":0,"c":0,"d":1}
PASS joined-1440x900 four beacon readings with chest open {"fire":4,"chest":true}
PASS joined-1440x900 shield closes and retains focus
PASS joined-1440x900 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS joined-1440x900 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":34.265625,"opacity":0.0227921,"face":[362.8388977050781,428.8907165527344,398.3606262207031,447.76800537109375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":"st-btn"}
PASS joined-1440x900 16 ms close/reopen tails bounded
PASS joined-412x730 laurier tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,358,412,672.03125],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":""}
PASS joined-412x730 laurier fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS joined-412x730 hmc1 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS joined-412x730 hmc1 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-412x730 mohawk tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,353,412,672.03125],"stone":[194.890625,315.5536804199219,217.109375,337.7724304199219],"focus":""}
PASS joined-412x730 mohawk fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS joined-412x730 hmc2 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,302,412,671.578125],"stone":[194.890625,264.5536804199219,217.109375,286.7724304199219],"focus":""}
PASS joined-412x730 hmc2 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-412x730 interkom tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS joined-412x730 interkom fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS joined-412x730 beacon clears Interkom {"shield":false,"tail":false,"card":false}
PASS joined-412x730 lennard tail proportions {"length":13.999999999999886,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,277,412,672.125],"stone":[194.890625,239.55368041992188,217.109375,261.7724304199219],"focus":""}
PASS joined-412x730 lennard fit/paint {"scroll":0,"bottom":672.125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS joined-412x730 tail edge is 1 screen px {"stroke":1,"a":1,"b":0,"c":0,"d":1}
PASS joined-412x730 four beacon readings with chest open {"fire":4,"chest":true}
PASS joined-412x730 shield closes and retains focus
PASS joined-412x730 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS joined-412x730 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":22.21875,"opacity":0.0227921,"face":[194.87916564941406,323.1874694824219,217.12083435058594,340.14031982421875],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":"st-btn"}
PASS joined-412x730 16 ms close/reopen tails bounded
PASS joined-412x730 390x844 laurier no traveller pixels at tail 0
PASS joined-412x730 390x844 hmc1 no traveller pixels at tail 0
PASS joined-412x730 390x844 mohawk no traveller pixels at tail 0
PASS joined-412x730 390x844 hmc2 no traveller pixels at tail 0
PASS joined-412x730 390x844 interkom no traveller pixels at tail 0
PASS joined-412x730 390x844 lennard no traveller pixels at tail 0
PASS 1024x600 laurier compact fit {"bottom":423.0088653564453,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 hmc1 compact fit {"bottom":434.07264709472656,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 mohawk compact fit {"bottom":425.5166931152344,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 hmc2 compact fit {"bottom":450.5826721191406,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 interkom compact fit {"bottom":434.0677795410156,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 lennard compact fit {"bottom":454.5852508544922,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 laurier compact fit {"bottom":483.0088653564453,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 hmc1 compact fit {"bottom":494.07264709472656,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 mohawk compact fit {"bottom":485.5166931152344,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 hmc2 compact fit {"bottom":510.5826721191406,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 interkom compact fit {"bottom":494.0677795410156,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 lennard compact fit {"bottom":514.5852508544922,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 laurier compact fit {"bottom":582.03125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 hmc1 compact fit {"bottom":581.578125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 mohawk compact fit {"bottom":582.03125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 hmc2 compact fit {"bottom":581.578125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 interkom compact fit {"bottom":582.125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 lennard compact fit {"bottom":582.125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 laurier compact fit {"bottom":263.70086669921875,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 hmc1 compact fit {"bottom":263.55452728271484,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 mohawk compact fit {"bottom":264.2989273071289,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 hmc2 compact fit {"bottom":291.6244430541992,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 interkom compact fit {"bottom":263.55181884765625,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 lennard compact fit {"bottom":293.56243896484375,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS no browser exceptions []
```

## final origin-check  (exit 0)

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

## final frame-cost --passes timing --scenarios 0,1,2,3,6,7,8,9 (exit 0)

```text
browser: Edg/158.0.4370.33; 412x730; DPR 2.625; touch true; CPU x4
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 106 | 29.20 | 66.70 | 75.00 | 38 | 0 | 10.94 | 7.31 | 3.66 | 3.64 | 4.36 | 1.28 | 6.18 | 0.81 | 10.57 | 8 / 64.00 | N/A |
| fling + glide timing | 106 | 20.80 | 29.30 | 58.40 | 5 | 0 | 8.33 | 1.41 | 0.50 | 0.91 | 3.49 | 0.42 | 6.09 | 0.51 | 0.77 | 2 / 61.00 | N/A |
| wayfinder / one turn in 1.5 s timing | 110 | 25.10 | 37.50 | 50.00 | 15 | 0 | 10.08 | 1.42 | 0.60 | 0.81 | 4.61 | 0.51 | 7.19 | 0.75 | 0.67 | 0 / 0.00 | N/A |
| slow pan with glow timing | 198 | 16.70 | 25.00 | 50.10 | 2 | 0 | 6.91 | 0.95 | 0.30 | 0.65 | 2.67 | 0.34 | 5.51 | 0.57 | 0.44 | 0 / 0.00 | N/A |
| map -> Laurier timing | 117 | 33.30 | 45.80 | 54.20 | 68 | 0 | 8.41 | 9.74 | 8.25 | 1.49 | 5.04 | 2.51 | 5.48 | 0.69 | 9.32 | 1 / 50.00 | N/A |
| Laurier -> HMC timing | 131 | 29.20 | 41.60 | 45.90 | 45 | 0 | 7.15 | 8.53 | 7.08 | 1.45 | 4.70 | 2.58 | 5.10 | 0.61 | 9.61 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 104 | 29.20 | 50.10 | 58.40 | 50 | 0 | 7.48 | 9.20 | 7.52 | 1.68 | 5.49 | 2.73 | 5.49 | 0.67 | 8.81 | 4 / 57.00 | N/A |
| Interkom -> HMC again / Back timing | 98 | 33.40 | 45.90 | 50.00 | 65 | 0 | 8.07 | 9.86 | 8.12 | 1.74 | 5.31 | 2.96 | 5.83 | 0.69 | 8.58 | 0 / 0.00 | N/A |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 112 | 25.00 | 66.70 | 79.20 | 37 | 0 | 8.95 | 7.47 | 3.77 | 3.69 | 4.62 | 1.31 | 6.26 | 0.79 | 10.83 | 10 / 67.00 | N/A |
| fling + glide timing | 104 | 20.90 | 29.20 | 54.20 | 5 | 0 | 7.46 | 1.41 | 0.58 | 0.84 | 3.71 | 0.47 | 6.65 | 0.56 | 0.89 | 2 / 55.00 | N/A |
| wayfinder / one turn in 1.5 s timing | 171 | 16.70 | 25.00 | 41.70 | 3 | 0 | 5.46 | 0.92 | 0.38 | 0.55 | 3.13 | 0.36 | 5.87 | 0.50 | 0.51 | 0 / 0.00 | N/A |
| slow pan with glow timing | 190 | 16.70 | 25.10 | 58.40 | 4 | 0 | 6.22 | 1.19 | 0.36 | 0.83 | 3.38 | 0.38 | 5.99 | 0.61 | 0.50 | 1 / 55.00 | N/A |
| map -> Laurier timing | 98 | 37.60 | 54.30 | 79.20 | 98 | 0 | 8.96 | 12.81 | 10.85 | 1.96 | 6.54 | 3.14 | 6.51 | 0.82 | 10.43 | 6 / 81.00 | N/A |
| Laurier -> HMC timing | 133 | 29.20 | 37.60 | 50.10 | 43 | 0 | 6.42 | 8.45 | 7.00 | 1.45 | 4.61 | 2.49 | 5.06 | 0.65 | 9.39 | 1 / 50.00 | N/A |
| HMC again -> Interkom timing | 111 | 29.20 | 37.60 | 50.00 | 49 | 0 | 6.39 | 8.61 | 6.99 | 1.62 | 4.96 | 2.64 | 5.34 | 0.66 | 8.35 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 119 | 25.10 | 41.60 | 54.20 | 32 | 0 | 6.13 | 8.00 | 6.43 | 1.57 | 4.35 | 2.59 | 5.18 | 0.61 | 8.03 | 1 / 55.00 | N/A |
```

## final frame-cost --passes timing --scenarios 6,7,8,9 --width 1440 --height 900 --dpr 1 --cpu 1 (exit 0)

```text
browser: Edg/158.0.4370.33; 1440x900; DPR 1; touch false; CPU x1
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| map -> Laurier timing | 397 | 8.40 | 12.60 | 16.80 | 0 | 0 | 1.42 | 4.88 | 4.69 | 0.20 | 0.85 | 0.50 | 1.21 | 0.15 | 10.61 | 0 / 0.00 | N/A |
| Laurier -> HMC timing | 367 | 12.40 | 12.60 | 16.70 | 0 | 0 | 1.31 | 5.93 | 5.70 | 0.23 | 0.91 | 0.54 | 1.15 | 0.13 | 9.44 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 321 | 12.40 | 16.60 | 20.80 | 0 | 0 | 1.37 | 5.91 | 5.65 | 0.25 | 0.91 | 0.52 | 1.11 | 0.13 | 6.94 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 355 | 8.40 | 12.60 | 16.70 | 0 | 0 | 1.17 | 5.40 | 5.19 | 0.21 | 0.78 | 0.46 | 1.02 | 0.11 | 6.60 | 0 / 0.00 | N/A |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| map -> Laurier timing | 391 | 8.40 | 12.60 | 16.80 | 0 | 0 | 1.35 | 5.03 | 4.82 | 0.20 | 0.85 | 0.50 | 1.22 | 0.16 | 10.67 | 0 / 0.00 | N/A |
| Laurier -> HMC timing | 363 | 12.40 | 12.70 | 16.70 | 0 | 0 | 1.25 | 6.02 | 5.79 | 0.23 | 0.89 | 0.52 | 1.13 | 0.14 | 9.40 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 335 | 8.40 | 12.60 | 16.80 | 0 | 0 | 1.20 | 5.77 | 5.54 | 0.22 | 0.87 | 0.49 | 1.06 | 0.12 | 6.75 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 340 | 8.40 | 12.60 | 16.80 | 0 | 0 | 1.15 | 5.88 | 5.66 | 0.22 | 0.81 | 0.47 | 1.02 | 0.12 | 6.69 | 0 / 0.00 | N/A |
```

## check (exit 0)

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 16.05 KB / 30; all map modules + CSS 172.72 KB / 185
gzip: dist/journey-map.html 289.05 KB / 320
gzip: dist/journey-joined.html 509.61 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

## steps-test (exit 0)

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

## nova-test (exit 0)

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

## depth-test (exit 0)

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

## layout-test (exit 0)

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

## explore-test (exit 0)

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

## finds-test (exit 0)

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
ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast (8242 writes)
ok: reduced-motion serpent consumes leaves immediately with no swell; no shy hop; all tree actors stay still on hear
ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
ok: footer name layout reads 85 total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: {"resize":17,"fonts":17,"settle-end":17,"explore":34}
ok: actual timeline Home and End handlers select first and last stops
```

## motion-test (exit 0)

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

## hammer-test (exit 0)

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
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00094 ms/step; 2.9s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

## whirl2-test (exit 0)

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

## frame-cost-test (exit 0)

```text
ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature
ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work
```

## frame-performance-test (exit 0)

```text
AFTER 412x730 / 72 moving frames: #cam writes 7; label writes 297; recovery 16 frames / 266.7 ms
ok: bounded pinch rasters agree with virtual camera; <=10% label settle steps; 250 ms recovery; translation-only raster; 50 real opening camera writes; interrupted zoom, resize/exit cleanup and zero idle writes
```

## frame-render-test (exit 0)

```text
phone explore zoom 1: scratch pixels cleared 3609120 -> 871895 (75.8% less); same drawing commands
phone explore zoom 2: scratch pixels cleared 3609120 -> 1037640 (71.2% less); same drawing commands
phone explore zoom 3: scratch pixels cleared 3609120 -> 760250 (78.9% less); same drawing commands
ok: 21 desktop/phone/1200-star WHIRL2 drawing-command snapshots; original blast primitives pinned by whirl2-test; not a pixel comparison
```

## comb-c-browser-test --film --open-only

```text
PASS map-1440x900 16 ms open tail bounds
PASS map-1440x900 opening answers <=100 ms {"ms":16,"length":0,"base":0,"shield":34.265625,"opacity":0.0227921,"face":[362.76318359375,428.980224609375,398.43634033203125,447.7518005371094],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 16 ms close tail bounds
PASS map-1440x900 16 ms reopen tail bounds
PASS map-412x730 16 ms open tail bounds
PASS map-412x730 opening answers <=100 ms {"ms":16,"length":0,"base":0,"shield":22.21875,"opacity":0.0227921,"face":[194.87916564941406,323.1874694824219,217.12083435058594,340.14031982421875],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":""}
PASS map-412x730 16 ms close tail bounds
PASS map-412x730 16 ms reopen tail bounds
PASS map-1024x600 16 ms open tail bounds
PASS map-1024x600 opening answers <=100 ms {"ms":16,"length":0,"base":0,"shield":19.859375,"opacity":0.0227921,"face":[162.1084442138672,284.0548095703125,182.5870819091797,292.1965026855469],"stone":[162.41026306152344,278.0625,182.26963806152344,297.921875],"focus":""}
PASS map-1024x600 16 ms close tail bounds
PASS map-1024x600 16 ms reopen tail bounds
PASS joined-1440x900 16 ms open tail bounds
PASS joined-1440x900 opening answers <=100 ms {"ms":16,"length":0,"base":0,"shield":34.265625,"opacity":0.0227921,"face":[362.76318359375,428.980224609375,398.43634033203125,447.7518005371094],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 16 ms close tail bounds
PASS joined-1440x900 16 ms reopen tail bounds
PASS joined-412x730 16 ms open tail bounds
PASS joined-412x730 opening answers <=100 ms {"ms":16,"length":0,"base":0,"shield":22.21875,"opacity":0.0227921,"face":[194.87916564941406,323.1874694824219,217.12083435058594,340.14031982421875],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":""}
PASS joined-412x730 16 ms close tail bounds
PASS joined-412x730 16 ms reopen tail bounds
PASS joined-1024x600 16 ms open tail bounds
PASS joined-1024x600 opening answers <=100 ms {"ms":16,"length":0,"base":0,"shield":19.859375,"opacity":0.0227921,"face":[162.1084442138672,284.0548095703125,182.5870819091797,292.1965026855469],"stone":[162.41026306152344,278.0625,182.26963806152344,297.921875],"focus":""}
PASS joined-1024x600 16 ms close tail bounds
PASS joined-1024x600 16 ms reopen tail bounds
PASS 1024x600 laurier compact fit {"bottom":423.0088653564453,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 hmc1 compact fit {"bottom":434.07264709472656,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 mohawk compact fit {"bottom":425.5166931152344,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 hmc2 compact fit {"bottom":450.5826721191406,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 interkom compact fit {"bottom":434.0677795410156,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 lennard compact fit {"bottom":454.5852508544922,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 laurier compact fit {"bottom":483.0088653564453,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 hmc1 compact fit {"bottom":494.07264709472656,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 mohawk compact fit {"bottom":485.5166931152344,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 hmc2 compact fit {"bottom":510.5826721191406,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 interkom compact fit {"bottom":494.0677795410156,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 lennard compact fit {"bottom":514.5852508544922,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 laurier compact fit {"bottom":582.03125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 hmc1 compact fit {"bottom":581.578125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 mohawk compact fit {"bottom":582.03125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 hmc2 compact fit {"bottom":581.578125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 interkom compact fit {"bottom":582.125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 lennard compact fit {"bottom":582.125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 laurier compact fit {"bottom":263.70086669921875,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 hmc1 compact fit {"bottom":263.55452728271484,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 mohawk compact fit {"bottom":264.2989273071289,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 hmc2 compact fit {"bottom":291.6244430541992,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 interkom compact fit {"bottom":263.55181884765625,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 lennard compact fit {"bottom":293.56243896484375,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS no browser exceptions []
```

## final origin-check  (exit 0)

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

## comb-c-record-test (exit 0)

```text
C8/C2 data/trip normalized digests: 3228382006 / 1367940136
C16 remnant/ember command snapshots changed: 
{
  "1440x900/0/0": "a76b1e95ba298d093ac9168b5e00b0f3a8c060585f9c4c64538161b08cad4cb8",
  "1440x900/0/1": "643118161d7feaefb667c5a092d54a30f22b34055de4aa6b9c87fb31b2b2b625",
  "1440x900/0/2": "e6bd47bc1cc4c74f4498227f47aba10c7f448ed1548e5fce16055957707cc10b",
  "1440x900/0/3": "9bcbf832a686e8e90169b31ea834cfae7e7669320e482fb2c0bfd32c096de19e",
  "1440x900/0/4": "56fc11e7fe607aeb1fc4f4d2ea9ba285bfdebdc4a5631b1f327d2cd8d9d4da17",
  "1440x900/0/5": "832c19de891003eb81be61969f1189d79fa93eef70d4497c6056ddd8cb795374",
  "1440x900/0/6": "5e34adbcae8f61b083c792afdd5b4fd281a855ae84931801d710cd6819057458",
  "412x730/0/0": "de1d8423649b63a2ca69cabf631b332dee747dfb98f137196c5d86242ae2534c",
  "412x730/0/1": "0b31e6289175353ca9eeb178917cbb09971e47a2d5f463d9f1373f528b53f38e",
  "412x730/0/2": "5c3c5bca58c301d3bb55d8cccef76d8c738e0dae41796b6b3a269d62cdc513c5",
  "412x730/0/3": "bb725ebea004bb701dc88e0b6a938fc7b8af3d6980c89a8c29f57545fcc4254b",
  "412x730/0/4": "7ef2f50b28da51ad0ad5e6d8e180c260087d99514ed451a8ce9d0637112a7a6d",
  "412x730/0/5": "75de9db3b6fedb74ec2c75025f631e9c42c45748709bd75dd12ac365c132c3da",
  "412x730/0/6": "e545bae22696a918266f9c2b5ef2c4dc58fd1f86bc17baf19e972a695ef16de9",
  "412x730/1200/0": "e43c832d4a60fb7dc376b9a2e0ff6fdf161ab07e09584cbca33794b064ea095c",
  "412x730/1200/1": "5518818512f23318684761ac584df64d27d06d9fd02913cf7062596f950e46f9",
  "412x730/1200/2": "f8ebfc054059723febb72e0b9878a0ed720ba4b491506058fa5c3f383be35997",
  "412x730/1200/3": "5d09036a38343a60ff39d0d306a1d64747f56af63af53a78d9782c120cdd3046",
  "412x730/1200/4": "2769f01781441edc3a0e3cb364021d027ffc3b40cf1d38e4f7500607b8db83df",
  "412x730/1200/5": "2563831d87d30156ad41c3bb0e591a290980173b1f9a8e959a700d502009896b",
  "412x730/1200/6": "40275570ea7b55630be1f0c1932170dc649d2083665289192172b32e1759bd6d"
}
```

## frame-performance-test (exit 0)

```text
AFTER 412x730 / 72 moving frames: #cam writes 7; label writes 297; recovery 16 frames / 266.7 ms
ok: bounded pinch rasters agree with virtual camera; <=10% label settle steps; 250 ms recovery; translation-only raster; 50 real opening camera writes; interrupted zoom, resize/exit cleanup and zero idle writes
```

## finds-test (exit 0)

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
ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast (8242 writes)
ok: reduced-motion serpent consumes leaves immediately with no swell; no shy hop; all tree actors stay still on hear
ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
ok: footer name layout reads 85 total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: {"resize":17,"fonts":17,"settle-end":17,"explore":34}
ok: actual timeline Home and End handlers select first and last stops
```

## final frame-cost --passes timing --scenarios 0,1,2,3,6,7,8,9 (exit 0)

```text
browser: Edg/158.0.4370.33; 412x730; DPR 2.625; touch true; CPU x4
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 114 | 25.10 | 58.30 | 66.70 | 38 | 0 | 9.47 | 6.03 | 3.15 | 2.89 | 3.92 | 1.17 | 5.70 | 0.75 | 9.90 | 4 / 54.00 | N/A |
| fling + glide timing | 131 | 16.70 | 24.90 | 45.80 | 2 | 0 | 6.46 | 0.88 | 0.36 | 0.52 | 2.47 | 0.33 | 5.34 | 0.41 | 0.61 | 0 / 0.00 | N/A |
| wayfinder / one turn in 1.5 s timing | 159 | 16.70 | 25.10 | 45.80 | 4 | 0 | 6.79 | 0.90 | 0.38 | 0.52 | 2.93 | 0.37 | 5.55 | 0.54 | 0.54 | 0 / 0.00 | N/A |
| slow pan with glow timing | 197 | 16.70 | 25.00 | 54.10 | 4 | 0 | 6.88 | 1.00 | 0.31 | 0.69 | 2.96 | 0.35 | 5.30 | 0.59 | 0.46 | 1 / 52.00 | N/A |
| map -> Laurier timing | 112 | 33.40 | 50.10 | 62.50 | 69 | 0 | 8.45 | 10.25 | 8.72 | 1.53 | 5.81 | 2.65 | 5.52 | 0.74 | 9.50 | 5 / 61.00 | N/A |
| Laurier -> HMC timing | 133 | 29.20 | 37.50 | 45.80 | 45 | 0 | 6.86 | 8.36 | 7.01 | 1.36 | 4.86 | 2.57 | 5.00 | 0.62 | 9.48 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 110 | 29.20 | 45.80 | 54.20 | 45 | 0 | 6.71 | 8.35 | 6.97 | 1.38 | 4.76 | 2.64 | 5.29 | 0.62 | 8.31 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 110 | 29.20 | 41.70 | 50.10 | 46 | 0 | 6.93 | 8.19 | 6.73 | 1.46 | 5.00 | 2.73 | 5.47 | 0.66 | 7.94 | 0 / 0.00 | N/A |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 118 | 21.00 | 62.40 | 70.90 | 40 | 0 | 8.26 | 6.66 | 3.43 | 3.23 | 4.65 | 1.30 | 5.78 | 0.73 | 10.52 | 6 / 60.00 | N/A |
| fling + glide timing | 139 | 16.60 | 25.00 | 50.00 | 3 | 0 | 5.35 | 0.99 | 0.39 | 0.60 | 2.34 | 0.34 | 5.40 | 0.40 | 0.66 | 1 / 51.00 | N/A |
| wayfinder / one turn in 1.5 s timing | 151 | 16.70 | 29.20 | 45.80 | 6 | 0 | 5.97 | 1.07 | 0.44 | 0.63 | 3.67 | 0.44 | 5.89 | 0.60 | 0.52 | 0 / 0.00 | N/A |
| slow pan with glow timing | 218 | 16.70 | 20.90 | 50.00 | 3 | 0 | 5.33 | 0.95 | 0.31 | 0.64 | 2.91 | 0.33 | 5.24 | 0.54 | 0.44 | 0 / 0.00 | N/A |
| map -> Laurier timing | 132 | 29.20 | 37.60 | 54.30 | 46 | 0 | 6.35 | 8.63 | 7.32 | 1.31 | 4.70 | 2.39 | 5.01 | 0.65 | 8.77 | 1 / 51.00 | N/A |
| Laurier -> HMC timing | 135 | 29.10 | 37.60 | 50.10 | 43 | 0 | 6.01 | 8.40 | 6.97 | 1.43 | 4.83 | 2.62 | 4.96 | 0.63 | 9.50 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 117 | 29.20 | 37.50 | 50.00 | 33 | 0 | 5.76 | 8.02 | 6.58 | 1.44 | 4.71 | 2.52 | 5.13 | 0.63 | 8.23 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 120 | 29.10 | 37.50 | 45.90 | 29 | 0 | 5.78 | 7.74 | 6.30 | 1.44 | 4.71 | 2.58 | 5.19 | 0.63 | 7.85 | 0 / 0.00 | N/A |
```

## final frame-cost --passes timing --scenarios 6,7,8,9 --width 1440 --height 900 --dpr 1 --cpu 1 (exit 0)

```text
browser: Edg/158.0.4370.33; 1440x900; DPR 1; touch false; CPU x1
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| map -> Laurier timing | 400 | 8.40 | 12.60 | 16.70 | 0 | 0 | 1.36 | 4.86 | 4.67 | 0.19 | 0.88 | 0.51 | 1.19 | 0.15 | 10.47 | 0 / 0.00 | N/A |
| Laurier -> HMC timing | 354 | 12.40 | 16.70 | 16.70 | 0 | 0 | 1.36 | 6.09 | 5.85 | 0.24 | 0.94 | 0.56 | 1.17 | 0.14 | 9.72 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 317 | 12.40 | 12.60 | 20.70 | 0 | 0 | 1.28 | 5.89 | 5.67 | 0.22 | 0.93 | 0.59 | 1.25 | 0.12 | 6.64 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 338 | 8.40 | 12.60 | 16.80 | 0 | 0 | 1.19 | 5.71 | 5.50 | 0.21 | 0.86 | 0.48 | 1.06 | 0.12 | 6.71 | 0 / 0.00 | N/A |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| map -> Laurier timing | 386 | 8.40 | 12.60 | 16.70 | 0 | 0 | 1.30 | 5.12 | 4.92 | 0.20 | 0.88 | 0.51 | 1.20 | 0.16 | 10.77 | 0 / 0.00 | N/A |
| Laurier -> HMC timing | 333 | 12.50 | 16.70 | 29.20 | 0 | 0 | 1.33 | 6.69 | 6.44 | 0.25 | 1.01 | 0.57 | 1.19 | 0.15 | 10.13 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 317 | 12.40 | 16.70 | 20.90 | 0 | 0 | 1.18 | 6.20 | 5.97 | 0.22 | 0.90 | 0.52 | 1.10 | 0.12 | 6.97 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 318 | 12.40 | 16.60 | 20.90 | 0 | 0 | 1.17 | 6.12 | 5.89 | 0.23 | 0.95 | 0.51 | 1.12 | 0.13 | 6.96 | 0 / 0.00 | N/A |
```

## comb-c-record-test (exit 0)

```text
C8/C2 data/trip normalized digests: 4140766664 / 1367940136
C16 remnant/ember command snapshots changed: 
{
  "1440x900/0/0": "a76b1e95ba298d093ac9168b5e00b0f3a8c060585f9c4c64538161b08cad4cb8",
  "1440x900/0/1": "643118161d7feaefb667c5a092d54a30f22b34055de4aa6b9c87fb31b2b2b625",
  "1440x900/0/2": "e6bd47bc1cc4c74f4498227f47aba10c7f448ed1548e5fce16055957707cc10b",
  "1440x900/0/3": "9bcbf832a686e8e90169b31ea834cfae7e7669320e482fb2c0bfd32c096de19e",
  "1440x900/0/4": "56fc11e7fe607aeb1fc4f4d2ea9ba285bfdebdc4a5631b1f327d2cd8d9d4da17",
  "1440x900/0/5": "832c19de891003eb81be61969f1189d79fa93eef70d4497c6056ddd8cb795374",
  "1440x900/0/6": "5e34adbcae8f61b083c792afdd5b4fd281a855ae84931801d710cd6819057458",
  "412x730/0/0": "de1d8423649b63a2ca69cabf631b332dee747dfb98f137196c5d86242ae2534c",
  "412x730/0/1": "0b31e6289175353ca9eeb178917cbb09971e47a2d5f463d9f1373f528b53f38e",
  "412x730/0/2": "5c3c5bca58c301d3bb55d8cccef76d8c738e0dae41796b6b3a269d62cdc513c5",
  "412x730/0/3": "bb725ebea004bb701dc88e0b6a938fc7b8af3d6980c89a8c29f57545fcc4254b",
  "412x730/0/4": "7ef2f50b28da51ad0ad5e6d8e180c260087d99514ed451a8ce9d0637112a7a6d",
  "412x730/0/5": "75de9db3b6fedb74ec2c75025f631e9c42c45748709bd75dd12ac365c132c3da",
  "412x730/0/6": "e545bae22696a918266f9c2b5ef2c4dc58fd1f86bc17baf19e972a695ef16de9",
  "412x730/1200/0": "e43c832d4a60fb7dc376b9a2e0ff6fdf161ab07e09584cbca33794b064ea095c",
  "412x730/1200/1": "5518818512f23318684761ac584df64d27d06d9fd02913cf7062596f950e46f9",
  "412x730/1200/2": "f8ebfc054059723febb72e0b9878a0ed720ba4b491506058fa5c3f383be35997",
  "412x730/1200/3": "5d09036a38343a60ff39d0d306a1d64747f56af63af53a78d9782c120cdd3046",
  "412x730/1200/4": "2769f01781441edc3a0e3cb364021d027ffc3b40cf1d38e4f7500607b8db83df",
  "412x730/1200/5": "2563831d87d30156ad41c3bb0e591a290980173b1f9a8e959a700d502009896b",
  "412x730/1200/6": "40275570ea7b55630be1f0c1932170dc649d2083665289192172b32e1759bd6d"
}
```

## check (exit 0)

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 16.05 KB / 30; all map modules + CSS 172.76 KB / 185
gzip: dist/journey-map.html 289.09 KB / 320
gzip: dist/journey-joined.html 509.65 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

## steps-test (exit 0)

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

## nova-test (exit 0)

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

## depth-test (exit 0)

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

## layout-test (exit 0)

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

## explore-test (exit 0)

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

## finds-test (exit 0)

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
ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast (8242 writes)
ok: reduced-motion serpent consumes leaves immediately with no swell; no shy hop; all tree actors stay still on hear
ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
ok: footer name layout reads 85 total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: {"resize":17,"fonts":17,"settle-end":17,"explore":34}
ok: actual timeline Home and End handlers select first and last stops
```

## motion-test (exit 0)

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

## hammer-test (exit 0)

```text
ok: D3 foe heights incl stroke: giants/chief 16, hunched draugr 11, low full-width wolf 8; wave 1 varies; five overlapping shields span each unchanged segment
ok: original Norse foe silhouettes and their strokes fit unchanged hit boxes
ok: identical seeds and inputs match step for step
ok: 350 seeded formations/bosses fit their wave rows; unique fates; clay at 60%, heart at 30%
ok: 34 per-level rune effect checks; excluded runes absent
ok: cold includes both flights and glove; heat splits twice; draugr rises once; need multiplies the return upgrade; exposed stone heart doubles a hit
ok: return/catch, first-hit memory, shields, bridge loss; pool sizes and identities unchanged after 10,000 steps
steady: 200 seeds; wave 4 74.0%; wins 17.5%; ended by wave 3 26.0%; longest 223.6s; 0.00088 ms/step; 2.0s wall
ends {"6:bridge":6,"7:won":35,"5:bridge":10,"3:hearts":35,"5:hearts":42,"6:hearts":14,"4:hearts":28,"4:bridge":8,"2:hearts":12,"3:bridge":3,"7:hearts":5,"2:bridge":1,"1:hearts":1}
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00072 ms/step; 2.2s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

## whirl2-test (exit 0)

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

## frame-cost-test (exit 0)

```text
ok: PNG RGB/RGBA, split IDAT, all five scanline filters and invalid signature
ok: neutral-line classifier, interval percentiles/thresholds, exclusive nested main-thread costs, B/E spans, target renderer and separate raster work
```

## frame-performance-test (exit 0)

```text
AFTER 412x730 / 72 moving frames: #cam writes 7; label writes 297; recovery 16 frames / 266.7 ms
ok: bounded pinch rasters agree with virtual camera; <=10% label settle steps; 250 ms recovery; translation-only raster; 50 real opening camera writes; interrupted zoom, resize/exit cleanup and zero idle writes
```

## frame-render-test (exit 0)

```text
phone explore zoom 1: scratch pixels cleared 3609120 -> 871895 (75.8% less); same drawing commands
phone explore zoom 2: scratch pixels cleared 3609120 -> 1037640 (71.2% less); same drawing commands
phone explore zoom 3: scratch pixels cleared 3609120 -> 760250 (78.9% less); same drawing commands
ok: 21 desktop/phone/1200-star WHIRL2 drawing-command snapshots; original blast primitives pinned by whirl2-test; not a pixel comparison
```

## comb-c-browser-test --film

```text
PASS map-1440x900 laurier tail proportions {"length":38.00000000000006,"base":27.41760000000008,"shield":34.265625,"opacity":1,"face":[436.5115051269531,258.013916015625,1076.5609436035156,618.092041015625],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 laurier fit/paint {"scroll":0,"bottom":618.092041015625,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS map-1440x900 hmc1 tail proportions {"length":37.99999999999994,"base":27.417600000000007,"shield":34.265625,"opacity":1,"face":[436.4810791015625,248.53274536132812,1076.5914306640625,627.6107177734375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 hmc1 fit/paint {"scroll":0,"bottom":627.6107177734375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-1440x900 mohawk tail proportions {"length":38,"base":27.417599999999997,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 mohawk fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS map-1440x900 hmc2 tail proportions {"length":37.99999999999994,"base":27.417600000000007,"shield":34.265625,"opacity":1,"face":[436.4851989746094,239.0318145751953,1076.5872497558594,637.1098175048828],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 hmc2 fit/paint {"scroll":0,"bottom":637.1098175048828,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-1440x900 interkom tail proportions {"length":37.99999999999994,"base":27.417599999999993,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 interkom fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS map-1440x900 beacon clears Interkom {"shield":false,"tail":false,"card":false}
PASS map-1440x900 lennard tail proportions {"length":37.99999999999994,"base":27.41760000000002,"shield":34.265625,"opacity":1,"face":[436.4733581542969,222.04254150390625,1076.5990905761719,653.557861328125],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS map-1440x900 lennard fit/paint {"scroll":0,"bottom":653.557861328125,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS map-1440x900 tail edge is 1 screen px {"stroke":1,"a":1,"b":0,"c":0,"d":1}
PASS map-1440x900 four beacon readings with chest open {"fire":4,"chest":true}
PASS map-1440x900 shield closes and retains focus
PASS map-1440x900 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS map-1440x900 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":34.265625,"opacity":0.0227921,"face":[362.8388977050781,428.8907165527344,398.3606262207031,447.76800537109375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":"st-btn"}
PASS map-1440x900 16 ms close/reopen tails bounded
PASS map-1440x900 X twinkles for 3 s
PASS map-1440x900 second Next preserves full supernova {"ms":5950,"P":2144.7776094010915,"moving":false,"legend":true}
PASS map-1440x900 legend stays dimmed or hidden through blast {"failedFrames":[]}
PASS map-1440x900 opening uses true camera
PASS map-1440x900 explore card controls inert
PASS map-1440x900 compositor scale bounded {"min":1,"max":1.11504}
PASS map-1440x900 sharp final camera
PASS map-1440x900 sharp within 150 ms of <0.5 px/frame {"delay":0,"maxLabelStep":0.014413256693179388}
PASS map-1440x900 settle label steps <=10%
PASS map-1440x900 full gesture composited scale bounded {"min":1,"max":1.14903,"zoom":1.7788570707707834}
PASS map-1440x900 labels stay within 15% of true size {"maxError":0.15000468828203628}
PASS map-412x730 laurier tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,358,412,672.03125],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":""}
PASS map-412x730 laurier fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS map-412x730 hmc1 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS map-412x730 hmc1 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-412x730 mohawk tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,353,412,672.03125],"stone":[194.890625,315.5536804199219,217.109375,337.7724304199219],"focus":""}
PASS map-412x730 mohawk fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS map-412x730 hmc2 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,302,412,671.578125],"stone":[194.890625,264.5536804199219,217.109375,286.7724304199219],"focus":""}
PASS map-412x730 hmc2 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS map-412x730 interkom tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS map-412x730 interkom fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS map-412x730 beacon clears Interkom {"shield":false,"tail":false,"card":false}
PASS map-412x730 lennard tail proportions {"length":13.999999999999886,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,277,412,672.125],"stone":[194.890625,239.55368041992188,217.109375,261.7724304199219],"focus":""}
PASS map-412x730 lennard fit/paint {"scroll":0,"bottom":672.125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS map-412x730 tail edge is 1 screen px {"stroke":1,"a":1,"b":0,"c":0,"d":1}
PASS map-412x730 four beacon readings with chest open {"fire":4,"chest":true}
PASS map-412x730 shield closes and retains focus
PASS map-412x730 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS map-412x730 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":22.21875,"opacity":0.0227921,"face":[194.87916564941406,323.1874694824219,217.12083435058594,340.14031982421875],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":"st-btn"}
PASS map-412x730 16 ms close/reopen tails bounded
PASS map-412x730 X twinkles for 3 s
PASS map-412x730 second Next preserves full supernova {"ms":5950,"P":2144.7776094010915,"moving":false,"legend":true}
PASS map-412x730 legend stays dimmed or hidden through blast {"failedFrames":[]}
PASS map-412x730 opening uses true camera
PASS map-412x730 explore card controls inert
PASS map-412x730 compositor scale bounded {"min":1,"max":1.0625}
PASS map-412x730 sharp final camera
PASS map-412x730 sharp within 150 ms of <0.5 px/frame {"delay":0,"maxLabelStep":0.005024435939571026}
PASS map-412x730 settle label steps <=10%
PASS map-412x730 full gesture composited scale bounded {"min":1,"max":1.14286,"zoom":2.9998509020426423}
PASS map-412x730 labels stay within 15% of true size {"maxError":0.1500128239725882}
PASS map-412x730 390x844 laurier no traveller pixels at tail 0
PASS map-412x730 390x844 hmc1 no traveller pixels at tail 0
PASS map-412x730 390x844 mohawk no traveller pixels at tail 0
PASS map-412x730 390x844 hmc2 no traveller pixels at tail 0
PASS map-412x730 390x844 interkom no traveller pixels at tail 0
PASS map-412x730 390x844 lennard no traveller pixels at tail 0
PASS joined-1440x900 laurier tail proportions {"length":38.00000000000006,"base":27.41760000000008,"shield":34.265625,"opacity":1,"face":[436.5115051269531,258.013916015625,1076.5609436035156,618.092041015625],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 laurier fit/paint {"scroll":0,"bottom":618.092041015625,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS joined-1440x900 hmc1 tail proportions {"length":37.99999999999994,"base":27.417600000000007,"shield":34.265625,"opacity":1,"face":[436.4810791015625,248.53274536132812,1076.5914306640625,627.6107177734375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 hmc1 fit/paint {"scroll":0,"bottom":627.6107177734375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-1440x900 mohawk tail proportions {"length":38,"base":27.417599999999997,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 mohawk fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS joined-1440x900 hmc2 tail proportions {"length":37.99999999999994,"base":27.417600000000007,"shield":34.265625,"opacity":1,"face":[436.4851989746094,239.0318145751953,1076.5872497558594,637.1098175048828],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 hmc2 fit/paint {"scroll":0,"bottom":637.1098175048828,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-1440x900 interkom tail proportions {"length":37.99999999999994,"base":27.417599999999993,"shield":34.265625,"opacity":1,"face":[436.4902038574219,258.52587890625,1076.5822448730469,617.6038818359375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 interkom fit/paint {"scroll":0,"bottom":617.6038818359375,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS joined-1440x900 beacon clears Interkom {"shield":false,"tail":false,"card":false}
PASS joined-1440x900 lennard tail proportions {"length":37.99999999999994,"base":27.41760000000002,"shield":34.265625,"opacity":1,"face":[436.4733581542969,222.04254150390625,1076.5990905761719,653.557861328125],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":""}
PASS joined-1440x900 lennard fit/paint {"scroll":0,"bottom":653.557861328125,"bar":786,"kick":"9.5px","craft":"11px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS joined-1440x900 tail edge is 1 screen px {"stroke":1,"a":1,"b":0,"c":0,"d":1}
PASS joined-1440x900 four beacon readings with chest open {"fire":4,"chest":true}
PASS joined-1440x900 shield closes and retains focus
PASS joined-1440x900 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS joined-1440x900 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":34.265625,"opacity":0.0227921,"face":[362.8388977050781,428.8907165527344,398.3606262207031,447.76800537109375],"stone":[363.4591369628906,420.859375,397.7247619628906,455.125],"focus":"st-btn"}
PASS joined-1440x900 16 ms close/reopen tails bounded
PASS joined-1440x900 X twinkles for 3 s
PASS joined-1440x900 second Next preserves full supernova {"ms":5950,"P":2144.7776094010915,"moving":false,"legend":true}
PASS joined-1440x900 legend stays dimmed or hidden through blast {"failedFrames":[]}
PASS joined-1440x900 opening uses true camera
PASS joined-1440x900 explore card controls inert
PASS joined-1440x900 compositor scale bounded {"min":1,"max":1.11504}
PASS joined-1440x900 sharp final camera
PASS joined-1440x900 sharp within 150 ms of <0.5 px/frame {"delay":0,"maxLabelStep":0.014413256693179388}
PASS joined-1440x900 settle label steps <=10%
PASS joined-1440x900 full gesture composited scale bounded {"min":1,"max":1.14903,"zoom":1.7788570707707834}
PASS joined-1440x900 labels stay within 15% of true size {"maxError":0.15000468828203628}
PASS joined-412x730 laurier tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,358,412,672.03125],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":""}
PASS joined-412x730 laurier fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Wilfrid Laurier University card","red":0,"shadowBelow":true}
PASS joined-412x730 hmc1 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS joined-412x730 hmc1 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-412x730 mohawk tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,353,412,672.03125],"stone":[194.890625,315.5536804199219,217.109375,337.7724304199219],"focus":""}
PASS joined-412x730 mohawk fit/paint {"scroll":0,"bottom":672.03125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Mohawk College card","red":0,"shadowBelow":true}
PASS joined-412x730 hmc2 tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,302,412,671.578125],"stone":[194.890625,264.5536804199219,217.109375,286.7724304199219],"focus":""}
PASS joined-412x730 hmc2 fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the HMC Connections card","red":0,"shadowBelow":true}
PASS joined-412x730 interkom tail proportions {"length":14,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,335,412,671.578125],"stone":[194.890625,297.5536804199219,217.109375,319.7724304199219],"focus":""}
PASS joined-412x730 interkom fit/paint {"scroll":0,"bottom":671.578125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Interkom card","red":0,"shadowBelow":true}
PASS joined-412x730 beacon clears Interkom {"shield":false,"tail":false,"card":false}
PASS joined-412x730 lennard tail proportions {"length":13.999999999999886,"base":17.78400000000002,"shield":22.21875,"opacity":1,"face":[0,277,412,672.125],"stone":[194.890625,239.55368041992188,217.109375,261.7724304199219],"focus":""}
PASS joined-412x730 lennard fit/paint {"scroll":0,"bottom":672.125,"bar":678,"kick":"9px","craft":"9px","name":"Close the Lennard Commercial Realty card","red":0,"shadowBelow":true}
PASS joined-412x730 tail edge is 1 screen px {"stroke":1,"a":1,"b":0,"c":0,"d":1}
PASS joined-412x730 four beacon readings with chest open {"fire":4,"chest":true}
PASS joined-412x730 shield closes and retains focus
PASS joined-412x730 focus ring >=2 px and Open name {"width":2,"box":44,"name":"Open the Wilfrid Laurier University card"}
PASS joined-412x730 first visible frame touches shield <=100 ms {"ms":16,"length":0,"base":0,"shield":22.21875,"opacity":0.0227921,"face":[194.87916564941406,323.1874694824219,217.12083435058594,340.14031982421875],"stone":[194.890625,320.5536804199219,217.109375,342.7724304199219],"focus":"st-btn"}
PASS joined-412x730 16 ms close/reopen tails bounded
PASS joined-412x730 X twinkles for 3 s
PASS joined-412x730 second Next preserves full supernova {"ms":5950,"P":2144.7776094010915,"moving":false,"legend":true}
PASS joined-412x730 legend stays dimmed or hidden through blast {"failedFrames":[]}
PASS joined-412x730 opening uses true camera
PASS joined-412x730 explore card controls inert
PASS joined-412x730 compositor scale bounded {"min":1,"max":1}
PASS joined-412x730 sharp final camera
PASS joined-412x730 sharp within 150 ms of <0.5 px/frame {"delay":0,"maxLabelStep":0.005024435939571026}
PASS joined-412x730 settle label steps <=10%
PASS joined-412x730 full gesture composited scale bounded {"min":1,"max":1.14286,"zoom":2.9998509020426423}
PASS joined-412x730 labels stay within 15% of true size {"maxError":0.1500128239725882}
PASS joined-412x730 390x844 laurier no traveller pixels at tail 0
PASS joined-412x730 390x844 hmc1 no traveller pixels at tail 0
PASS joined-412x730 390x844 mohawk no traveller pixels at tail 0
PASS joined-412x730 390x844 hmc2 no traveller pixels at tail 0
PASS joined-412x730 390x844 interkom no traveller pixels at tail 0
PASS joined-412x730 390x844 lennard no traveller pixels at tail 0
PASS 1024x600 laurier compact fit {"bottom":423.0088653564453,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 hmc1 compact fit {"bottom":434.07264709472656,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 mohawk compact fit {"bottom":425.5166931152344,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 hmc2 compact fit {"bottom":450.5826721191406,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 interkom compact fit {"bottom":434.0677795410156,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1024x600 lennard compact fit {"bottom":454.5852508544922,"bar":486,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 laurier compact fit {"bottom":483.0088653564453,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 hmc1 compact fit {"bottom":494.07264709472656,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 mohawk compact fit {"bottom":485.5166931152344,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 hmc2 compact fit {"bottom":510.5826721191406,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 interkom compact fit {"bottom":494.0677795410156,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 1280x720 lennard compact fit {"bottom":514.5852508544922,"bar":606,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 laurier compact fit {"bottom":582.03125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 hmc1 compact fit {"bottom":581.578125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 mohawk compact fit {"bottom":582.03125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 hmc2 compact fit {"bottom":581.578125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 interkom compact fit {"bottom":582.125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 360x640 lennard compact fit {"bottom":582.125,"bar":588,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 laurier compact fit {"bottom":263.70086669921875,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 hmc1 compact fit {"bottom":263.55452728271484,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 mohawk compact fit {"bottom":264.2989273071289,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 hmc2 compact fit {"bottom":291.6244430541992,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 interkom compact fit {"bottom":263.55181884765625,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS 844x390 lennard compact fit {"bottom":293.56243896484375,"bar":302,"scroll":0,"kick":"9px","craft":"9px"}
PASS no browser exceptions []
```

## final origin-check  (exit 0)

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

## final frame-cost --passes timing --scenarios 0,1,2,3,6,7,8,9 (exit 0)

```text
browser: Edg/158.0.4370.33; 412x730; DPR 2.625; touch true; CPU x4
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 98 | 33.30 | 70.90 | 95.90 | 51 | 0 | 12.48 | 8.40 | 4.08 | 4.31 | 5.52 | 1.56 | 6.56 | 1.02 | 10.46 | 17 / 82.00 | N/A |
| fling + glide timing | 118 | 16.70 | 29.10 | 58.40 | 4 | 0 | 7.55 | 1.12 | 0.43 | 0.69 | 3.00 | 0.39 | 5.61 | 0.47 | 0.72 | 2 / 55.00 | N/A |
| wayfinder / one turn in 1.5 s timing | 155 | 16.80 | 25.10 | 37.50 | 2 | 0 | 7.01 | 0.90 | 0.37 | 0.53 | 2.98 | 0.39 | 5.62 | 0.56 | 0.52 | 0 / 0.00 | N/A |
| slow pan with glow timing | 186 | 16.80 | 25.10 | 58.40 | 3 | 0 | 7.57 | 1.10 | 0.34 | 0.76 | 2.97 | 0.39 | 5.46 | 0.62 | 0.49 | 2 / 50.00 | N/A |
| map -> Laurier timing | 96 | 41.70 | 54.20 | 83.40 | 94 | 0 | 10.20 | 11.97 | 10.11 | 1.86 | 7.05 | 3.17 | 6.18 | 0.89 | 10.36 | 11 / 72.00 | N/A |
| Laurier -> HMC timing | 107 | 37.50 | 45.90 | 54.20 | 95 | 0 | 8.58 | 10.69 | 8.93 | 1.76 | 6.41 | 2.96 | 5.67 | 0.71 | 10.52 | 1 / 52.00 | N/A |
| HMC again -> Interkom timing | 86 | 37.50 | 54.30 | 83.40 | 82 | 0 | 9.10 | 12.03 | 9.90 | 2.14 | 7.05 | 3.39 | 6.41 | 0.79 | 9.55 | 5 / 77.00 | N/A |
| Interkom -> HMC again / Back timing | 81 | 41.70 | 54.20 | 58.40 | 80 | 0 | 9.42 | 12.32 | 10.11 | 2.21 | 7.31 | 3.52 | 6.61 | 0.88 | 9.43 | 2 / 51.00 | N/A |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats timing | 102 | 29.20 | 66.80 | 91.60 | 44 | 0 | 10.03 | 8.57 | 4.07 | 4.50 | 5.30 | 1.48 | 6.36 | 0.87 | 11.11 | 12 / 72.00 | N/A |
| fling + glide timing | 125 | 16.70 | 25.10 | 45.90 | 3 | 0 | 5.93 | 1.11 | 0.48 | 0.63 | 3.01 | 0.40 | 5.77 | 0.45 | 0.75 | 0 / 0.00 | N/A |
| wayfinder / one turn in 1.5 s timing | 130 | 20.90 | 33.30 | 45.80 | 10 | 0 | 7.58 | 1.41 | 0.59 | 0.83 | 4.73 | 0.50 | 6.80 | 0.72 | 0.65 | 0 / 0.00 | N/A |
| slow pan with glow timing | 176 | 20.80 | 29.20 | 62.60 | 5 | 0 | 6.93 | 1.37 | 0.45 | 0.92 | 3.88 | 0.49 | 5.89 | 0.72 | 0.60 | 2 / 63.00 | N/A |
| map -> Laurier timing | 121 | 33.30 | 41.80 | 62.40 | 61 | 0 | 7.22 | 9.76 | 8.27 | 1.49 | 5.31 | 2.56 | 5.26 | 0.71 | 9.03 | 1 / 62.00 | N/A |
| Laurier -> HMC timing | 103 | 37.50 | 58.40 | 116.70 | 88 | 1 | 8.85 | 11.58 | 9.62 | 1.96 | 6.93 | 3.11 | 5.89 | 0.92 | 10.31 | 7 / 115.00 | N/A |
| HMC again -> Interkom timing | 95 | 37.40 | 45.90 | 58.40 | 65 | 0 | 7.42 | 10.54 | 8.67 | 1.87 | 6.21 | 2.95 | 5.89 | 0.73 | 9.07 | 1 / 59.00 | N/A |
| Interkom -> HMC again / Back timing | 93 | 37.40 | 50.00 | 58.40 | 75 | 0 | 7.31 | 10.80 | 8.80 | 2.00 | 6.81 | 3.05 | 5.99 | 0.75 | 8.88 | 3 / 54.00 | N/A |
```

## final frame-cost --passes timing --scenarios 6,7,8,9 --width 1440 --height 900 --dpr 1 --cpu 1 (exit 0)

```text
browser: Edg/158.0.4370.33; 1440x900; DPR 1; touch false; CPU x1
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| map -> Laurier timing | 359 | 12.40 | 16.60 | 20.90 | 0 | 0 | 1.60 | 5.38 | 5.15 | 0.23 | 0.99 | 0.56 | 1.34 | 0.17 | 11.28 | 0 / 0.00 | N/A |
| Laurier -> HMC timing | 312 | 12.50 | 16.70 | 24.90 | 0 | 0 | 1.57 | 6.90 | 6.63 | 0.27 | 1.09 | 0.64 | 1.37 | 0.15 | 10.76 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 322 | 12.40 | 12.60 | 20.90 | 0 | 0 | 1.28 | 6.03 | 5.81 | 0.22 | 0.89 | 0.51 | 1.11 | 0.12 | 7.05 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 313 | 12.50 | 12.60 | 20.80 | 0 | 0 | 1.29 | 6.14 | 5.91 | 0.23 | 0.92 | 0.52 | 1.13 | 0.12 | 7.20 | 0 / 0.00 | N/A |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| map -> Laurier timing | 334 | 12.50 | 16.70 | 20.90 | 0 | 0 | 1.62 | 5.84 | 5.58 | 0.26 | 1.12 | 0.61 | 1.41 | 0.19 | 11.63 | 0 / 0.00 | N/A |
| Laurier -> HMC timing | 307 | 12.50 | 16.80 | 25.10 | 0 | 0 | 1.50 | 6.95 | 6.66 | 0.28 | 1.21 | 0.65 | 1.40 | 0.17 | 10.97 | 0 / 0.00 | N/A |
| HMC again -> Interkom timing | 322 | 12.40 | 16.60 | 20.80 | 0 | 0 | 1.21 | 5.97 | 5.75 | 0.22 | 0.92 | 0.51 | 1.09 | 0.13 | 6.80 | 0 / 0.00 | N/A |
| Interkom -> HMC again / Back timing | 325 | 12.40 | 16.60 | 20.80 | 0 | 0 | 1.18 | 5.98 | 5.77 | 0.22 | 0.89 | 0.51 | 1.09 | 0.13 | 6.92 | 0 / 0.00 | N/A |
```

## final frame-cost --passes capture --scenarios 0,1,2,3 (exit 0)

```text
browser: Edg/158.0.4370.33; 412x730; DPR 2.625; touch true; CPU x4
GPU: {"devices":[{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"NVIDIA","driverVersion":"32.0.16.1088"},{"vendorId":4098,"deviceId":5056,"subSysId":2119242850,"revision":203,"vendorString":"","deviceString":"AMD Radeon(TM) Graphics","driverVendor":"","driverVersion":"32.0.21045.29003"},{"vendorId":4318,"deviceId":9860,"subSysId":2296778819,"revision":161,"vendorString":"","deviceString":"NVIDIA GeForce RTX 4090","driverVendor":"","driverVersion":"32.0.16.1088"},{"vendorId":5140,"deviceId":140,"subSysId":0,"revision":0,"vendorString":"","deviceString":"Microsoft Basic Render Driver","driverVendor":"","driverVersion":"10.0.26100.9818"}],"features":{"2d_canvas":"enabled","direct_rendering_display_compositor":"disabled_off_ok","gpu_compositing":"enabled","multiple_raster_threads":"enabled_on","opengl":"enabled_on","rasterization":"enabled","skia_graphite":"enabled_on","trees_in_viz":"disabled_off","video_decode":"enabled","video_encode":"enabled","webgl":"enabled","webgpu":"enabled","webnn":"disabled_off"}}

/journey-map.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats capture | 109 | 25.10 | 62.50 | 75.00 | 44 | 0 | 10.45 | 7.00 | 3.68 | 3.33 | 4.54 | 1.30 | 6.02 | 0.83 | 9.54 | 6 / 58.00 | 0 / 134 |
| fling + glide capture | 112 | 20.80 | 25.10 | 58.40 | 3 | 0 | 8.53 | 1.23 | 0.50 | 0.73 | 3.18 | 0.45 | 5.99 | 0.50 | 0.75 | 2 / 56.00 | 0 / 115 |
| wayfinder / one turn in 1.5 s capture | 139 | 20.80 | 29.20 | 45.80 | 5 | 0 | 8.07 | 1.07 | 0.46 | 0.62 | 3.65 | 0.47 | 6.11 | 0.65 | 0.61 | 0 / 0.00 | 0 / 165 |
| slow pan with glow capture | 165 | 20.90 | 29.20 | 66.60 | 4 | 0 | 8.35 | 1.35 | 0.41 | 0.94 | 3.43 | 0.45 | 5.94 | 0.70 | 0.52 | 2 / 61.00 | 0 / 168 |

/journey-joined.html (timing pass excludes screenshots; capture pass measures its own overhead)
| scenario | frames | p50 ms | p95 ms | max ms | >33 | >100 | script | style+layout | layout | style | paint | pre-paint | layerize | commit | raster | long tasks / max ms | blank candidates / captures |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| pinch x3 / 300 ms out + 300 ms in / three repeats capture | 98 | 33.40 | 83.40 | 95.90 | 61 | 0 | 11.69 | 9.65 | 4.80 | 4.85 | 7.26 | 1.94 | 7.57 | 1.10 | 10.97 | 29 / 76.00 | 0 / 124 |
| fling + glide capture | 91 | 25.00 | 37.50 | 66.70 | 8 | 0 | 8.79 | 1.85 | 0.76 | 1.09 | 4.98 | 0.70 | 7.22 | 0.75 | 0.94 | 2 / 65.00 | 0 / 94 |
| wayfinder / one turn in 1.5 s capture | 119 | 25.00 | 37.60 | 54.20 | 16 | 0 | 7.90 | 1.54 | 0.65 | 0.90 | 4.92 | 0.64 | 7.13 | 0.81 | 0.68 | 1 / 52.00 | 0 / 150 |
| slow pan with glow capture | 162 | 20.90 | 29.20 | 66.80 | 5 | 0 | 7.35 | 1.53 | 0.48 | 1.05 | 4.45 | 0.52 | 6.47 | 0.75 | 0.59 | 2 / 64.00 | 0 / 164 |
```

## comb-c-report-test (exit 0)

```text
ok: 16 item records; 2042 existing captures; 13 latest suites pass; frame tables and 7 explicit glide failures; ASCII report
```
