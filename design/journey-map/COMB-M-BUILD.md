M1-M4 are implemented. Behaviour and regression checks pass except the M4 layer gate, which remains failed in Edge 158.0.4370.33. The exact required CSS rule is retained; this is not an all-gates-pass build.

- M1: steps.mjs remembers the explore-origin stop through direct stop-id navigation, finds and resize. Next, Back, non-stop navigation, set/scrub, moving scroll/swipe, reduced motion and return clear it. main.mjs is unchanged.
- M2: cardsClose supplies CD.last.cam to a covered return to the end beat. exploreResume sets the clamped camera, k=1, footer=0, no hint and the explore say line immediately. The covered-arrival route retains the existing cut clock and lets explore survive JOURNEY.moving while that cut lifts. This avoids a separate cover clock and cancellation handoff. Bar reveal does not replay; input works during lift. X, Escape and shield share the path.
- M3: cardsOverride multiplies the original hold dim by the fold's closed.k with lerp(1, st.dim, closed.k), restoring it on reopen.
- M4: map.css adds only the requested opacity will-change rule and one-line comment. Marker/timeline retention improves, but the fixed go-light still repeatedly receives new painted layer IDs. For example, phone Laurier builds 279 go-light layers at 242x86 CSS px. No additional CSS fix is authorized.

LayerTree counts below are unique painted layer IDs built/destroyed (B/D), starting 100 ms after the real Next press and ending 1 s after arrival. Large means width >100 or height >30 CSS px. Rule-off uses the explicitly allowed page style override. These are layer counts, not timing measurements. The six stop-to-stop windows all fail the strict large-layer gate. Set out and Explore entry are reported without a gate.

| View / DPR | Press from | Rule off B/D | Rule on B/D | Rule on large builds |
| --- | --- | --- | --- | --- |
| 360x660 / 3 touch | Set out | 252/247 | 269/270 | 268 |
| 360x660 / 3 touch | Laurier | 314/316 | 281/283 | 279 |
| 360x660 / 3 touch | HMC Connections | 303/305 | 300/300 | 298 |
| 360x660 / 3 touch | Mohawk | 313/312 | 303/305 | 301 |
| 360x660 / 3 touch | Explore entry | 5/13 | 3/8 | 3 |
| 1920x950 / 2 mouse | Set out | 226/217 | 206/206 | 2 |
| 1920x950 / 2 mouse | Laurier | 305/307 | 241/242 | 1 |
| 1920x950 / 2 mouse | HMC Connections | 294/295 | 242/243 | 1 |
| 1920x950 / 2 mouse | Mohawk | 299/301 | 241/242 | 3 |
| 1920x950 / 2 mouse | Explore entry | 10/19 | 4/6 | 4 |

Full owner-tagged events and the extra Dig windows: [layers-results.json](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-m/layers-results.json). The collector was corrected to track layer identity rather than changes to drawsContent and to avoid recounting the same ID. Earlier diagnostic runs remain in its full log; the table uses the final collector. Only one product implementation was attempted.

Added tests: comb-m-fixture provides isolated Edge/CDP input, observation hooks and profile deletion after browser exit; comb-m-browser checks desktop X/Escape/shield, A-to-B, guided dim/reopen, find release, resize, repeats, phone drag/pinch, keyboard and reduced motion; comb-m-state checks navigation memory, input during cover lift and original/revised captures; comb-m-layers checks the specified layer windows; comb-m-scope checks file hashes, exact CSS addition, line endings and report ASCII. All new page control uses CDP Input commands.

Existing comb-close-test only gains the missing getElementById stub returning null for its absent timeline. Its unchanged sheet-close assertions now pass. No existing assertion was changed. Required older browser fixtures are redirected in a run-folder loader so profiles, snapshots, captures and logs stay here. The required steps-test emits its existing analytic simulated-clock continuity values; no browser timing or tracing tool was run.

check.mjs changes only RUNTIME_KB and its dated note: 188.2 to 189.7 KB; measured 189.61 KB. Packed map/joined gzip sizes are 306.14/553.14 KB. All three HTML outputs came only from the two pack tools; joined.html regenerated to identical bytes. Prohibited source files and earlier reports retain their starting hashes.

| Test or tool | Last exit |
| --- | --- |
| tools/check.mjs | 0 |
| tools/comb-close-test.mjs | 0 |
| tools/comb-g-focus-test.mjs | 0 |
| tools/comb-g3-interaction-test.mjs | 0 |
| tools/comb-g3-press-test.mjs | 0 |
| tools/comb-l-explore-test.mjs | 0 |
| tools/comb-l2-explore-state-test.mjs | 0 |
| tools/comb-m-browser-test.mjs | 0 |
| tools/comb-m-layers-test.mjs | 1 |
| tools/comb-m-scope-test.mjs | 0 |
| tools/comb-m-state-test.mjs | 0 |
| tools/comb-reopen-test.mjs | 0 |
| tools/explore-test.mjs | 0 |
| tools/pack-joined.mjs | 0 |
| tools/pack.mjs | 0 |
| tools/steps-test.mjs | 0 |

[Full test logs](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-m/all-test-output.log), [last exits](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-m/last-exits.json), [scope](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-m/scope-results.json), [acceptance](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-m/acceptance.txt) and [comparison gallery](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-m/evidence.html) are outside deliverables.

Review the same-view close on desktop and phone, input during the cover lift, shield focus after the first close, guided dim/reopen, and the remaining go-light layer churn in a real browser. Original/revised card captures preserve the existing hierarchy and artwork; this is a visual comparison, not a pixel-equivalence certification. Agent critique and UI CLI setup were omitted under the explicit no-agents/no-installs/no-network rules. No git, network, installs, timing tools or performance traces were used.

Automatic approval review blocked recursive deletion of the exited legacy profile C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-m/profile-1795693202239 with "blocked by policy". It remains in the run folder. New tests delete their own profiles automatically after browser exit.
