Built L1b, L2 and the tested L3 paths, and retained the better of two L4 attempts. The first-glide label split is removed. L4's 1440 px explore gate still fails, and full pixel equivalence is not established. This is not an all-tests-pass release.

The required briefs and prior build records, saved starting sources/pages, prototype and approved map evidence governed the work. Acceptance and decisions are in [acceptance.txt](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l2/acceptance.txt) and [decisions.txt](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l2/decisions.txt). No prototype or reference was changed.

- L1b: compare the last air drawing's screen-space beam origin and three far endpoints with the current beam. More than 0.5 CSS px sets an urgent air-only flag; smaller changes keep the idle rule. Desktop/touch snap samples consumed 70/70 and 59/59 urgent flags on the next frame. Two-second beacon rests have 24 air clears and zero deep clears. The air hook and its condition are the only depth.mjs changes.
- L2: move the existing base nodes into map-base/cam-base, keep tree-and-later drawing nodes at the start of cam, and preserve both original opacity ancestors with b-rest/b-rest-detail. Update coasts, ticks, label sampling, resize, dimming, hero inert and serpent swell lookup. Defs remain in map. All 30 desktop/phone find-target activations pass; the four swell groups remain attached.
- L3: permanent base promotion/visible overflow, a 0.5-1.15 hold, raster-ahead up to 1.15 and the known destination scale, and an exact stationary commit. Explore copies the existing L5 camera and CSS hold in the same tripApply call; explore.mjs itself stays unchanged. The foreground retains its existing camera writer. Across all recorded desktop glides, the largest serialized matrix discrepancy is 0.010365 CSS px. Dynamic held-find view swaps were observed in the wide-view test; their ahead endpoint clamp was not asserted.
- L4: clear every tier-2 group opacity, multiply the main t2b labels' own alpha, and fade wrapped drawing text through fill/stroke alpha while retaining its authored opacity and the existing focus transition. Selected wayfinder results stay visible. At fractional fade, a wayfinder word's halo/fill overlap can differ; 0 and 1 keep the original drawing. No other fade or transition was changed.

Two-second sampled paintCount deltas below are old shared map -> new base/new foreground. The end has hidden map layers.

| CSS size, scale | Whole map | Laurier | X | Zoomed explore |
| --- | --- | --- | --- | --- |
| 1440 x 900, 1 | 154 -> 0/479 | 266 -> 0/478 | 463 -> 0/479 | 107 -> 0/313 |
| 1920 x 950, 2 | 139 -> 0/479 | 228 -> 0/472 | 264 -> 0/479 | 104 -> 0/280 |
| 412 x 730, 2.625 | 173 -> 0/475 | 130 -> 0/80 | 278 -> 0/479 | 125 -> 0/325 |
| 844 x 390, 3 | 227 -> 0/479 | 258 -> 0/477 | 372 -> 0/479 | 198 -> 0/344 |

Every visible-base rest sample has zero base paints. [Full rest/glide counts](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l2/part10-to-10b-counts.csv) includes both layers, tile totals, worst source-frame tile counts and matrix checks; [raw per-frame records](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l2/counts.json) retains every sample. The following cells are new base camera writes / paints / tile rasters (worst source frame). Old shared-map raster counts are beside them in the CSV.

| Glide | 1440 x 900, scale 1 | 1920 x 950, scale 2 |
| --- | --- | --- |
| Map -> Laurier | 6 / 7 / 92 (30) | 6 / 7 / 97 (30) |
| Laurier -> HMC 1 | 1 / 0 / 0 (0) | 1 / 0 / 0 (0) |
| HMC 1 -> Mohawk | 1 / 1 / 18 (18) | 1 / 1 / 20 (20) |
| Mohawk -> HMC 2 | 1 / 0 / 9 (3) | 1 / 0 / 10 (3) |
| HMC 2 -> Interkom | 1 / 0 / 0 (0) | 1 / 0 / 0 (0) |
| Interkom -> Lennard | 1 / 1 / 18 (18) | 1 / 1 / 21 (21) |
| Lennard -> X | 1 / 1 / 4 (4) | 1 / 1 / 5 (5) |
| X -> Lennard | 2 / 3 / 55 (18) | 2 / 3 / 64 (21) |
| Lennard -> Interkom | 1 / 0 / 8 (3) | 1 / 0 / 6 (3) |
| Interkom -> HMC 2 | 1 / 0 / 0 (0) | 1 / 0 / 0 (0) |
| HMC 2 -> Mohawk | 1 / 1 / 18 (18) | 1 / 1 / 20 (20) |
| Mohawk -> HMC 1 | 1 / 0 / 6 (3) | 1 / 0 / 7 (3) |
| HMC 1 -> Laurier | 1 / 1 / 18 (18) | 1 / 1 / 18 (18) |
| Laurier -> Map | 3 / 3 / 19 (5) | 3 / 3 / 20 (6) |

First-glide base writes/paints are 6/7 at both desktop sizes. All sampled base paint deltas stay within camera writes plus one. Shield, X jump, X/end both ways, timeline, mini-map and Home/End records are in [routes.json](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l2/routes.json) and the count CSV. The route collector does not assert every destination (the 412 timeline tap produced no base write).

L4 peak layers, built / labels forced opaque, for first glide; explore entry; explore exit:

| Browser | CSS width (scale) | First | Entry | Exit |
| --- | --- | --- | --- | --- |
| Chrome 157.0.8103.79 | 1440 (1) | 44 / 44 | 65 / 63 | 61 / 60 |
| Chrome 157.0.8103.79 | 1920 (2) | 42 / 42 | 54 / 54 | 53 / 53 |
| Chrome 157.0.8103.79 | 412 (2.625) | 32 / 32 | 32 / 32 | 30 / 30 |
| Edge 158.0.4370.33 | 1440 (1) | 44 / 44 | 65 / 63 | 61 / 59 |
| Edge 158.0.4370.33 | 1920 (2) | 42 / 42 | 54 / 54 | 53 / 53 |
| Edge 158.0.4370.33 | 412 (2.625) | 32 / 32 | 32 / 32 | 30 / 30 |

Attempt 1 had Chrome 1440 entry 70/63 and exit 67/59. The retained second attempt is better but misses the one-layer allowance at 1440; no third drawing attempt was made. Fresh first-glide baseline peaks are 56 at 1440, 41 at 1920 and 31 at 412 for both 9c895f9 and part 10. The fresh Edge sweep also measured these peaks. Its 1440 case uses scale 1; the inherited part 10 layer sweep uses scale 2 there, so its earlier 41-layer figure is a different scale case. [Frame-by-frame baselines and retained counts](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l2/first-glide-comparison.json) and [browser versions](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l2/versions.json) identify the observations.

Other layer changes are retained and reported in [layer-owners-and-reasons.json](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l2/layer-owners-and-reasons.json): mk-size has an active opacity transition; label-anchor/legend groups and frame/trail/find parts appear through overlap; SVGs carry their own promotion reasons. Chrome hammer/raven/wayfinder take peaks at 1440 are 121/120/108; at 1920, 107/106/96; at 412, 87/86/78. [find-layers.json](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l2/find-layers.json) contains each take and release, with the owner attributes and reasons.

[Comparison gallery](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l2/evidence.html) contains the four sizes at map/Laurier/X/end/explore and five matched progress points of the handoff and first glide at desktop/phone widths. All checkpoint progress values match exactly. Static desktop Laurier differs on 87 pixels over 8/255 (max 37); scale-2 Laurier on 468 (max 42). The static 412 X case is 18,899 over 8 (max 75), and its initial explore pair has an unreliable count state. A repeat and a normal-clock check agree on count visibility and both cameras, but the repeat still differs on 66,560 pixels over 8 (max 111). These larger phone differences are not certified as antialiasing. Other pairs, raw maxima and 3 x 3 blurred maxima are in [image-differences.json](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l2/image-differences.json). Held-raster softness, independent hero idle clocks and the phone differences prevent claiming a complete pixel gate. Reduced-motion stills and camera equality pass at 1440 and 412.

Part 10's canvas comparison has 72 cases and 2 failures: 1920 laurier deep (raw 36, blurred 10.78); 1920 x stars (raw 33, blurred 8.67). [pixels.json](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l2/pixels.json) retains the bounds. Its five drawing switches remain on and their implementation is unchanged.

Tests added: comb-l2 beacon, counts, layers, fresh baseline layers, finds/layer reasons, all finds, routes, fixed-frame pixels/checkpoints, phone repeat/normal-state check, PNG differences, scope, versions, the wide-view tick check and summary. Tests drive controls through CDP Input commands. The summaries stream case records above V8's single-string limit. The count retry fixes a parser that split scientific notation; it resumes the missing cases without changing product code. The initial pixel collector timed out freezing the hero's loader; the separate checkpoint collector completes all 40 records. Part 10 test roots now point only here; its scope test delegates to the 10b scope guard. Updated pins: authorized depth source in finds/D/F checks, and data/trip digests via comb-d-pins --record. Drawing, sky, route and canvas-command pins retain their values.

Gzip KB: modules/CSS 186.13 -> 187.64; limit 186.2 -> 187.7 with a dated comment. Hammer 16.53/30. Packed map 304.06/320; packed joined 551.22/567. The three HTML outputs came only from pack.mjs and pack-joined.mjs. stars.mjs, cards.mjs, steps.mjs, art.mjs, footer.mjs, hero-copy, facts, palettes, motion constants, briefs and other reports retain their starting bytes. Original runtime line endings are preserved.

Last exits of every invoked test/tool follow. Collector exit 0 means collection completed; the explicit failed gates remain failed. [Full output](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l2/all-test-output.log) and [machine-readable exits](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-l2/last-exits.json) retain failures and retries.

| Test or tool | Last exit |
| --- | --- |
| COMB_BROWSER=chrome tools/comb-l2-layers-test.mjs | 1 |
| COMB_BROWSER=edge tools/comb-l2-layers-test.mjs | 1 |
| tools/check.mjs | 0 |
| tools/comb-d-pins-test.mjs | 0 |
| tools/comb-f-pins-test.mjs | 0 |
| tools/comb-l-browser-test.mjs | 0 |
| tools/comb-l-drag-test.mjs | 0 |
| tools/comb-l-explore-test.mjs | 0 |
| tools/comb-l-layers-test.mjs | 0 |
| tools/comb-l-motion-test.mjs | 0 |
| tools/comb-l-pixels-test.mjs | 1 |
| tools/comb-l-preservation-test.mjs | 0 |
| tools/comb-l-run-test.mjs (targeted units) | 0 |
| tools/comb-l-scope-test.mjs | 0 |
| tools/comb-l-spatial-test.mjs --hits-only | 0 |
| tools/comb-l-spatial2-test.mjs | 0 |
| tools/comb-l-structure-test.mjs | 0 |
| tools/comb-l-summary-test.mjs | 0 |
| tools/comb-l2-all-finds-test.mjs | 0 |
| tools/comb-l2-baseline-layers-test.mjs | 0 |
| tools/comb-l2-beacon-test.mjs | 0 |
| tools/comb-l2-checkpoints-test.mjs | 0 |
| tools/comb-l2-counts-test.mjs --resume | 0 |
| tools/comb-l2-explore-state-test.mjs | 0 |
| tools/comb-l2-finds-test.mjs | 0 |
| tools/comb-l2-image-diff-test.mjs | 0 |
| tools/comb-l2-phone-pixels-test.mjs | 0 |
| tools/comb-l2-pixels-test.mjs | 1 |
| tools/comb-l2-regression-test.mjs (collector) | 0 |
| tools/comb-l2-report-test.mjs | 0 |
| tools/comb-l2-routes-test.mjs | 0 |
| tools/comb-l2-scope-test.mjs | 0 |
| tools/comb-l2-smoke-test.mjs | 0 |
| tools/comb-l2-summary-test.mjs | 0 |
| tools/comb-l2-version-test.mjs | 0 |
| tools/comb-l2-wide-test.mjs | 0 |
| tools/depth-test.mjs | 0 |
| tools/explore-test.mjs | 0 |
| tools/finds-test.mjs | 0 |
| tools/frame-render-test.mjs | 0 |
| tools/motion-test.mjs | 0 |
| tools/nova-test.mjs | 0 |
| tools/pack-joined.mjs | 0 |
| tools/pack.mjs | 0 |
| tools/steps-test.mjs | 0 |
| tools/whirl2-test.mjs | 0 |

No owned test browser process remains. No git, installs, agents, external network, frame-cost run or browser timing measurement was used. The inherited analytic motion unit test exercises a simulated path clock. Agent critique and the UI CLI setup were omitted under the explicit user rules. The full older E/F/G browser suite was not rerun. Review the failed 1440 explore layer gate, fractional text halos, phone pixels, held-base sharpness and the canvas comparison results; then run the separate Chrome/Edge timing pass.
