# COMB-G2 build record

Built G12, G27, G14b, G16a, G16b and G30. Their targeted real-input checks pass. Inherited failures are listed below, so this is not an all-tests-pass release or an independent visual approval.

The required briefs, part 9's report, saved starting sources and approved map sheet informed the work. Acceptance criteria are in [acceptance.txt](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2/acceptance.txt). The original chart, client facts, art, route, card styling and cloud fixes were retained. Motion-playbook guided the Paper feedback; bug-finder guided the final local correctness pass. No credible bugs found in the final allowed-source self-review.

| Item | Change and result |
| --- | --- |
| G12 | New destinations clear the pending press, including a shield's retained arrival, timeline jumps and scroll reversals. The existing inline mini-map route reaches the same destination gate; there is no minimap.mjs in this checkout. At both sizes, chest/raven presses followed by Next, Back, Home, End or a visible timeline mark leave no find focus, popup, sheet or dig after arrival plus 3 seconds. Both uncontested presses still replay. |
| G27 | An X press from afar uses a covered jump, writes The X and Dig here immediately, and focuses Next. A cut landing at the X is no longer treated as a dig. All 100 ms samples at overview and Lennard, mouse and touch, keep the bar and correct focus/words. A real Dig starts the build-up. |
| G14b | Only the resting X in short landscape loses its 44 px minimum and uses its drawn mark's bounds. Touch overlap selection explicitly prefers the nearer Lennard chest. G14 access rows pass all nine sizes; real touches dig the chest and still press the X at both short sizes. |
| G16a | Assign each chest its number once, on first opening. Lennard stays 1 and HMC stays 2 on reopening, after Top and in Explore. |
| G16b | Keep a bounded queue of accepted taps, qualify the pennant from tap times, and begin each queued pull at the prior pull's end. Three taps 150 ms apart produce three consecutive pulls and the pennant at both sizes; one tap produces one pull. Reduced-motion taps retain immediate pulls. |
| G30 | Two aria-hidden light layers decorate the existing buttons. First map reveal shines Next once per load; blocked vertical gestures shine the directional button, grouped by the existing 250 ms gesture window with a 2500 ms per-button cooldown. The 700 ms Paper/light sweep and glow use transform/opacity only. Cancelled shines are cleared on bar hiding, and Explore exit stays quiet. No Red, movement, label, focus or hit-area change. Phone glow stays within the full-width bar. Reduced motion specifies a 600 ms opacity glow with no sweep; the existing reduced-motion stacked route hides the step bar. |

Screenshots at device scale 2: [comparison gallery](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2/evidence.html). Required mid-shine captures: phone [Next](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2/G30-412-map-Next-mid.png) / [Back](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2/G30-412-map-Back-mid.png); desktop [Next](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2/G30-1440-map-Next-mid.png) / [Back](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2/G30-1440-map-Back-mid.png). Short landscape chest presses: [844 x 390](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2/G14b-844-chest.png) / [730 x 412](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2/G14b-730-chest.png). X route samples, pull starts and numbering are in [actions-results.json](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2/actions-results.json); the other result JSON files sit beside it.

New tests: comb-g2-browser is the offline CDP fixture; pending covers cancellation and retained replay; actions covers X jump/dig, persistent numbering and quick pulls; spatial repeats part 9's nine-size G14 rows and adds short-landscape touch checks; shine covers first reveal, directions, timing, geometry, focus, gesture grouping and exclusions; shine-extra adds both input types at each beat, direct map load, end/card/popup exclusions, a fresh gesture inside cooldown, reduced styles, Explore exit suppression and cancellation cleanup on Top/reduced-motion round trips; preservation checks scope, cloud blocks and unchanged client data/accents, plus ASCII and evidence links in the final report; evidence captures before/after map and bar views. All new driving input uses CDP Input commands, with no page-control calls or synthetic DOM input.

Inherited test changes: [the per-file list](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2/test-root-changes.json) redirects 48 test artifact paths to comb-g2. steps-test and nova-test gained missing DOM mock methods. check.mjs recognizes the timeline's cancellation wrapper without changing its navigation assertion or any budget. comb-g-preservation now permits the authorized G2 changes while retaining cloud/protected checks. comb-d-pins --record refreshed only finds-test's data source digest (2550069667) for STEPS.shine; art, trip, depth, sky and drawing-command pins did not change. No comb-f drawing pins required recording.

Last exits of every test/tool invoked follow. Full output, including failed and superseded attempts, is in [tests.log](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2/tests.log); [exits.jsonl](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2/exits.jsonl) records each invocation.

| Test or tool | Last exit |
| --- | --- |
| --record (invalid setup invocation) | 9 |
| tools/check.mjs | 0 |
| tools/comb-b-art-test.mjs | 0 |
| tools/comb-b-browser-test.mjs | 0 |
| tools/comb-b-detail-test.mjs | 0 |
| tools/comb-b-layout-test.mjs | 1 |
| tools/comb-c-tail-test.mjs | 0 |
| tools/comb-d-beacon-probe-test.mjs | 0 |
| tools/comb-d-capture-test.mjs | 0 |
| tools/comb-d-conflict-test.mjs | 0 |
| tools/comb-d-drawings-test.mjs | 1 |
| tools/comb-d-evidence-test.mjs | 1 |
| tools/comb-d-label-probe-test.mjs | 0 |
| tools/comb-d-layout-test.mjs | 1 |
| tools/comb-d-opening-capture-test.mjs | 0 |
| tools/comb-d-opening-ink-test.mjs | 1 |
| tools/comb-d-opening-test.mjs | 1 |
| tools/comb-d-origin-test.mjs | 0 |
| tools/comb-d-pins-test.mjs --record | 0 |
| tools/comb-d-pins-test.mjs (initial invocation) | 0 |
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
| tools/comb-f-gesture-test.mjs | 0 |
| tools/comb-f-motion-test.mjs | 0 |
| tools/comb-f-names-test.mjs | 0 |
| tools/comb-f-pins-test.mjs | 0 |
| tools/comb-f-route-test.mjs | 1 |
| tools/comb-f-suite-test.mjs (inherited browser batch) | 1 |
| tools/comb-f-syntax-test.mjs | 0 |
| tools/comb-g-bar-test.mjs | 0 |
| tools/comb-g-focus-test.mjs | 0 |
| tools/comb-g-hammer-test.mjs | 0 |
| tools/comb-g-hero-test.mjs | 0 |
| tools/comb-g-input-test.mjs | 0 |
| tools/comb-g-layout-test.mjs | 0 |
| tools/comb-g-preservation-test.mjs | 0 |
| tools/comb-g-resize-test.mjs | 0 |
| tools/comb-g-spatial-test.mjs --hits-only | 0 |
| tools/comb-g-wayfinder-test.mjs | 0 |
| tools/comb-g2-actions-test.mjs | 0 |
| tools/comb-g2-evidence-test.mjs | 0 |
| tools/comb-g2-pending-test.mjs | 0 |
| tools/comb-g2-preservation-test.mjs | 0 |
| tools/comb-g2-shine-extra-test.mjs | 0 |
| tools/comb-g2-shine-test.mjs | 0 |
| tools/comb-g2-spatial-test.mjs | 0 |
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
| tools/origin-check.mjs --cdp LOCAL | 0 |
| tools/pack-joined.mjs | 0 |
| tools/pack.mjs | 0 |
| tools/steps-test.mjs | 0 |
| tools/whirl2-test.mjs | 0 |

Budget evidence: gzip: hammer 16.46 KB / 30; all map modules + CSS 184.13 KB / 185; gzip: dist/journey-map.html 300.48 KB / 320; gzip: dist/journey-joined.html 547.57 KB / 567. Limits were not raised. All three HTML outputs were regenerated only by the two pack tools. Syntax, source scope, accents and the protected depth digest pass. No forbidden frame-cost launcher was run; frame-cost-test is the existing helper unit test.

No requested 9b item was left out. The inherited warm-up slice/guard checks pass; its separate 16 ms startup-module gate remains failed (211.643 to 517.323 ms at CPU x4), as in part 9. No timing pass is claimed. Unrelated inherited layout, label/ink, opening, beacon, route, strict startup and protected-report failures remain outside the allowed item scope; the last-exit table identifies the checks actually run. No git, install, agents or external network were used. The UI CLI install/fetch step and independent agent critique were omitted under the prompt's rules; review remains elsewhere.

Artifact-location exception: before their roots were redirected, inherited F fixtures wrote four PNGs and three profile directories into the previous comb-g folder. [Exact manifest](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-g2/stray-artifacts.json). They were left in place because writes outside the current allowlist are forbidden. Subsequent profiles, captures and logs use comb-g2. This exception prevents claiming perfect compliance with the output-folder rule.

Review the shine's direction and strength on the phone bar and desktop pill, X/chest selection in short landscape, and rapid ship taps in a real browser. Review inherited failures separately. No independent design score or physical-device pass is claimed.
