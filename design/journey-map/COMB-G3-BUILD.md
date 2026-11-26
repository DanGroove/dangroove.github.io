# COMB-G3 build record

Built H1-H8. The exercised targeted checks pass. H6's overflowing-card case could not be exercised on an unmodified page; the inherited suite still has failures below. This is not an all-tests-pass or independent visual approval.

The required briefs, previous build records, saved starting sources and rendered comparisons governed the changes. Facts, art, route, palettes, cloud fixes, depth.mjs and hero-copy remain unchanged. Acceptance and decisions are in the run folder.

- H1: Latch the joined whole-map landing once per arrival. Closing sheets and popups can return focus to their finds without the next frame stealing it. Hammer/rune keyboard and touch returns, popup return, and G20 pass.
- H2: Short-landscape sheets fade the bar/timeline out and make them inert until close. The hammer uses a full-height left field/run card and right controls. Fits are 0.814 at 844 x 390 and 0.865 at 730 x 412; tested words are at least 10 px and buttons at least 44 px. Touch movement/throw, pause/resume, both Closes, timeline restoration and rune choice pass. Portrait/desktop layout code is retained. Play captures: [844](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/after-H2-play-844.png), [730](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/after-H2-play-730.png); [rune choice](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/H2-runes-844.png).
- H3: join.css selects landscape by orientation below 680 px high, reserves the device's right column and gives single-line crafts wider first columns. All six requested sizes fit after the real entrance. Captures: [667](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/after-H3-667.png), [730](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/after-H3-730.png), [844](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/after-H3-844.png).
- H4: Restore the square fill inside the clipped Next pill. Anchor its existing light layer outside that clip; the sweep still clips itself and the Paper glow still extends beyond the pill. Timing/keyframes remain identical. Third-glide captures: [part 9 saved baseline](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/H4-fill-part9.png), [current](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/H4-fill-after.png); [current shine](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/H4-shine-after.png).
- H5: Full-width bars use inset focus outlines, Paper on Back and Ink on Next for contrast. Pill bars retain their styling. DPR 2 captures: [412 Back](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/H5-Back-412.png), [412 Next](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/H5-Next-412.png), [640 Back](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/H5-Back-640.png), [640 Next](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/H5-Next-640.png). Shine remains clipped to the bar.
- H6: Card gestures shine directionally unless an overflow scroller has room that way. Such a scroller consumes wheel/touch movement; one scrolling swipe never turns into a shine at its end. Sheets/popups keep their exclusions. Both directions pass over Laurier at 1440 x 900, 412 x 730, 360 x 640 and 844 x 390. None of these cards has overflowing content in this checkout, so the requested real scrolling/end-of-scroll case is unverified. map.css is authorized only for H2, H4 and H5, so no scrolling layout was introduced to manufacture that test case.
- H7: Unowned finds defer their own handlers and camera until a click/tap survives the 6 px slop. Moving/cancelled presses are rejected; keyboard activation and owned drags remain. Touch/mouse gestures and taps pass at the whole map after real Start and on visible drawings at Laurier. Off-drawing touch pick, glide-swipe cancellation, G3/G13, G14's nine sizes and G12 pass. Seven Laurier rows have off-screen drawings and are recorded as skips, not passes. The first direct-map attempt exposed F1 returning to the hero. The final press capture consumes unowned touch moves too; direct-map tests now keep P fixed and taps still open. Scrolls elsewhere retain F1. Touch swipes consumed by this find-press gate do not shine.
- H8: A touch on a find's own ink wins immediately; padding/interstitial touches still use proximity. Lennard chest ink and the X both work at both short-landscape sizes; G14/G14b pass. [844 chest](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/H8-chest-844.png), [730 chest](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/H8-chest-730.png).

[Comparison gallery](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/evidence.html) includes before/after hammer and hero captures and the saved 9b shine references. All captures use device scale 2. [Interaction results](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/interaction-results.json), [layout results](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/after-g3-layout.json), and [scope record](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/scope.json) retain measurements and skips.

New tests: comb-g3-browser supplies the offline CDP fixture; layout covers H1-H3 and required size captures; interaction covers H4-H8 and real Start arrivals; press adds the scroll-enabled direct-map regression; console checks errors plus G20/H1/H6 on the final joined page; extra covers touch game input, restored controls, popup focus, glide swipes and owned dragging; card repeats the final H6 gesture checks; rune reaches a real landscape rune choice and measures its text; evidence captures the original H2/H3 states; scope checks protected hashes, cloud blocks, unchanged shine styles and runtime syntax. New page driving uses only CDP Input commands. Inherited G1 landscape bounds now allow the full height in H2, and the old card-no-shine assertion now expects H6 feedback. The warm fixture also allows tracing completion to finish before the next case, retaining all slice/busy/startup assertions. Other inherited test changes only redirect output to this run folder; [exact file list](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/test-root-changes.json). No drawing/data/motion pins changed or needed recording; comb-d-pins and comb-f-pins pass unchanged.

Gzip KB: hammer 16.53 / 30; modules plus CSS 184.98 / 185; packed map 301.45 / 320; packed joined 548.65 / 567. Budgets were not raised. The three HTML outputs came only from the two pack tools. All 146 permitted source/tool syntax checks pass.

Last exits of every invoked test/tool follow. Failed/superseded attempts remain in [tests.log](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/tests.log); [exits.jsonl](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/exits.jsonl) records each invocation. Additional nested legacy stdout is in [inherited-tests.log](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/inherited-tests.log). Results are scoped evidence, not a design score.

| Test or tool | Last exit |
| --- | --- |
| tools/check.mjs | 0 |
| tools/comb-b-art-test.mjs | 0 |
| tools/comb-b-browser-test.mjs | 0 |
| tools/comb-b-detail-test.mjs | 0 |
| tools/comb-b-layout-test.mjs | 1 |
| tools/comb-c-tail-test.mjs | 0 |
| tools/comb-d-beacon-probe-test.mjs | 0 |
| tools/comb-d-capture-test.mjs | 0 |
| tools/comb-d-conflict-test.mjs | 0 |
| tools/comb-d-evidence-test.mjs | 1 |
| tools/comb-d-label-probe-test.mjs | 0 |
| tools/comb-d-layout-test.mjs | 1 |
| tools/comb-d-opening-capture-test.mjs | 0 |
| tools/comb-d-opening-ink-test.mjs | 1 |
| tools/comb-d-opening-test.mjs | 1 |
| tools/comb-d-origin-test.mjs | 1 |
| tools/comb-d-pins-test.mjs | 0 |
| tools/comb-d-readings-test.mjs | 1 |
| tools/comb-d-stipple-test.mjs | 0 |
| tools/comb-e-beam-test.mjs | 0 |
| tools/comb-e-capture-test.mjs | 0 |
| tools/comb-e-label-study-test.mjs | 0 |
| tools/comb-e-place-test.mjs | 0 |
| tools/comb-e-probe-test.mjs | 0 |
| tools/comb-e-report-test.mjs | 1 |
| tools/comb-e-scope-test.mjs | 0 |
| tools/comb-e-trace-audit-test.mjs | 1 |
| tools/comb-e-warm-test.mjs | 0 |
| tools/comb-f-controls-test.mjs | 0 |
| tools/comb-f-geometry-test.mjs | 0 |
| tools/comb-f-motion-test.mjs | 0 |
| tools/comb-f-pins-test.mjs | 0 |
| tools/comb-f-route-test.mjs | 1 |
| tools/comb-f-suite-test.mjs | 1 |
| tools/comb-f-syntax-test.mjs | 0 |
| tools/comb-g-focus-test.mjs | 0 |
| tools/comb-g-hammer-test.mjs | 0 |
| tools/comb-g-input-test.mjs | 0 |
| tools/comb-g-layout-test.mjs | 0 |
| tools/comb-g2-actions-test.mjs | 0 |
| tools/comb-g2-pending-test.mjs | 0 |
| tools/comb-g2-shine-extra-test.mjs | 0 |
| tools/comb-g2-shine-test.mjs | 0 |
| tools/comb-g2-spatial-test.mjs | 0 |
| tools/comb-g3-card-test.mjs | 0 |
| tools/comb-g3-console-test.mjs | 0 |
| tools/comb-g3-evidence-test.mjs | 0 |
| tools/comb-g3-extra-test.mjs | 0 |
| tools/comb-g3-interaction-test.mjs | 0 |
| tools/comb-g3-layout-test.mjs | 0 |
| tools/comb-g3-press-test.mjs | 0 |
| tools/comb-g3-rune-test.mjs | 0 |
| tools/comb-g3-scope-test.mjs | 0 |
| tools/depth-test.mjs | 0 |
| tools/explore-test.mjs | 0 |
| tools/finds-test.mjs | 0 |
| tools/frame-cost-test.mjs | 0 |
| tools/frame-performance-test.mjs | 0 |
| tools/frame-render-test.mjs | 0 |
| tools/hammer-test.mjs | 0 |
| tools/layout-test.mjs | 0 |
| tools/motion-test.mjs | 0 |
| tools/nova-test.mjs | 0 |
| tools/origin-check.mjs --cdp LOCAL | 1 |
| tools/pack-joined.mjs | 0 |
| tools/pack.mjs | 0 |
| tools/steps-test.mjs | 0 |
| tools/whirl2-test.mjs | 0 |

Inherited failures remain in label/ink/rim clearance, opening placement, route clearance, horn/popup overlap, the desktop HMC close target, the strict startup module gate and the protected COMB-E report wording. These are outside the allowed source/report scope and were left unchanged. The first warm trace attempt failed acquisition. Its single retry acquired all four traces and passed the idle slice/busy guards; the separate 16 ms startup audit still fails at 276.642-583.993 ms. No timing pass is claimed.

No git, installs, agents, external network or forbidden cost launcher was used. frame-cost-test is the existing helper unit test. CLI setup, report-writing modes of inherited tests and independent agent critique were omitted under the prompt's rules. After the exception below, profiles, captures and logs use comb-g3; protected reports were left alone. Browser fixtures close their local Edge processes.

Review the landscape hammer/run cards, rolling craft alignment, keyboard rings, fill/glow relationship, card gestures and chest/X selection in the real browser. H6's scrolling-card case, off-screen Laurier rows and the inherited failures need separate review. No physical-device, startup timing or independent critique pass is claimed.

Output-location violation: comb-f-controls wrote one profile directory and four PNGs into comb-g2 before its fixture root was redirected. The origin wrapper later appended comb-g2/inherited-tests.log before its transitive logging root was corrected. [Exact manifest](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g3/stray-artifacts.json). I missed those inherited writer paths before their runs. Those files were left in place because moving or deleting them would write outside the allowlist. Both writer paths and the remaining inherited test roots are now redirected. Perfect compliance with the output-folder rule is not claimed.
