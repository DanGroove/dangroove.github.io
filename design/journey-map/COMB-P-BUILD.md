COMB-P build, 2026-11-26. P7, P1, P2 and P3 are implemented. P5 is partial; its strict quiet gate remains failed. Built in the requested priority order, then corrected findings from the checks. Only the standalone page was repacked.

The implementation carries forward COMB-P, the COMB-N/O research and review record, the original source/drawings, the approved cards/footer sheet and the saved starting packed pages. Acceptance criteria were visible-height navigation, bounded and quieter rasters, constant chase separation, traveller-centred X framing, and the approved Paper leader geometry. Before/after Laurier crops were compared side by side at desktop and phone reading scales. Art, card identity and content were preserved.

- P7: resize sets the stage to innerHeight in pixels; CSS keeps its initial 100vh. All three sizes pass load, shorter-window and real Back-input checks.
- P5: removed the inline-style selector in favour of sky-off. Paused idle finds and pooled bits during held glides, kept beacon sky pieces, used raster scale for markers/ticks/compass words, added ahead rasters and a shared map/base/sky redraw slot with immediate base coverage protection. The style trace averages 47.76 elements per rAF; no style-attribute selector remains. Idle wayfinder, ravens, serpent, beacon, runestone, hammer, mist, horn, well, stationary longship and five hoards pause conditionally; playing/focused/sheet-owned finds and the crossing ship continue.
- P1: Skoll and Hati retain their drawings, windows, arc, gallop, glow and motes. Constant lag replaces the catch. Bite/clip, halo, dim, sparkles, ghost and fill blending were removed, including their unused data. Each bird exposes the six-field chase hook. All six chase cases pass.
- P2: X framing is centred on the traveller, fits around the X, preserves the vertical placement and reverses along the same path. Desktop skyline, smoothness and rush-centering checks pass. The phone floor is 0.8 of the former scale: the skyline's right edge is cut by 60.58 CSS px at 412x915 and 56.15 CSS px at 390x844. The footer score and blast drawing code were not edited; WHIRL2 passes.
- P3: the wedge became a Paper line, dot and tilted edge bar with the requested dimensions and gaps. Desktop separation grows by 44 px; phone links extend to at least 16 px. Geometry, colour and face-fade checks pass. That phone extension moves the face about 17 px under the navigation bar; existing phone/landscape fit gates remain failed. Card internals are outside the permitted edits.

One Set out, saved base -> build: map 11 -> 6 rebases; base 6 -> 6. Clouds 0-9: [9,10,9,9,9,10,8,8,9,10] -> 3 each. Clouds 10-19: [13,14,13,13,13,13,13,14,13,13] -> 5 each. Every requested Set out count ratio passes.

P5 omissions: tripLabels still writes the X subtitle's anchor outside rebase frames (53 Set out records, 11 compass-focus records). Interkom has 154 X-stroke width writes from main's frame loop. Those writers are outside the allowed parts. Focus-move serialization was left out after its queue exceeded the permitted raster scale bounds; changing the focus score would require protected steps.mjs. Focus now keeps bounded rasters, but the probe records 11 simultaneous-raster frames. The quiet test reports all four failures. The final sky rerun reports 0 scale-bound failures and 7 total failed gates; its remaining failures are retained in sky-results.json.

Added comb-p-bar/style/quiet/chase/x/leader-test and comb-p-fixture/loader/suite-test for real CDP input, state/count/pixel observations, artifact routing and profile cleanup. Quiet also probes Interkom and compass focus.

Changed existing tests: finds-test re-records five authorized data/source pins. steps-test, comb-c-tail-test, comb-c-browser-test and origin-check replace wedge/rim assertions with leader/ring/bar geometry. comb-n-fixture records chase, glide and raster-settling state; comb-n-wolves checks constant lag and unchanged fills; comb-n-sky uses the new hold ranges, includes the final moving frame, and checks sharp rest rasters. comb-o-eclipse-test is retired in favour of the chase test and delegates to it. nova-test and frame-performance-test only received missing DOM-fixture lookups; their assertions remain. check.mjs changes only RUNTIME_KB and its dated note: 199.2 KB for an actual 199.13 KB. Other assertions were retained.

Names below are tools/*.mjs. Nonzero exits are failures, not acceptance passes. The suite row is orchestration only.

| Test | Last exit |
| --- | --- |
| comb-p-bar-test | 0 |
| comb-p-style-test | 0 |
| comb-p-quiet-test | 1 |
| comb-p-chase-test | 0 |
| comb-p-x-test | 0 |
| comb-p-leader-test | 0 |
| check | 0 |
| finds-test | 0 |
| steps-test | 0 |
| explore-test | 0 |
| depth-test | 0 |
| nova-test | 1 |
| whirl2-test | 0 |
| comb-n-wolves-test | 0 |
| comb-o-eclipse-test | 0 |
| comb-o-ring-test | 0 |
| comb-o-dim-test | 1 |
| comb-m-layers-test | 1 |
| comb-n-hold-test | 1 |
| comb-n-sky-test | 1 |
| comb-n-trail-test | 1 |
| comb-l2-all-finds-test | 0 |
| comb-c-tail-test | 0 |
| comb-c-browser-test | 1 |
| origin-check | 1 |
| frame-performance-test | 1 |
| comb-d-beacon-probe-test | 0 |
| comb-d-drawings-test | 1 |
| comb-f-route-test | 0 |
| comb-l-pixels-test | 1 |
| comb-l2-scope-test | 1 |
| comb-p-suite-test (runner) | 0 |

Retained failed gates include veil/pixel comparisons, map layer splits, old rest-camera/full-page comparisons affected by the new placement, phone/landscape face clearance, three canvas pixel comparisons, and sky pixel/rest checks. nova-test stops on its existing trail-done opacity expectation; frame-performance-test fails its promotion expectation. comb-l2-scope-test lacks its historical scope-before.json. Full results and captures are under C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-p.

pack.mjs completed successfully. pack-joined.mjs was not run: it unconditionally writes unlisted joined.html as well as the allowed dist file. The joined bundle is unchanged, so joined-based results do not validate this build. Historical report generators were not run because they overwrite protected reports. Independent critique and UI-registry setup were omitted under the no-agents/no-install/no-network/write rules. No git, install, nonlocal network or performance timing measurements were used. All browser profiles were deleted. No COMB-Q or protected drawing/source was edited.
