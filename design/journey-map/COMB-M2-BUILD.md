N1 and N2 are implemented exactly as COMB-M2 specifies. This is not an all-gates-pass build: the stricter layer gate fails on the phone timeline counter, and the far berth misses the serpent outer-edge clearance by 0.139 map units. The prescribed product edits are retained.

N1 makes the cut/resume operand boolean, preventing an undefined toggle force. The CDP bar test passes at 360x660 DPR 3 touch and 1920x950 DPR 2 mouse: no go-end transitions during the three requested Next glides or Explore entry; the end style is on at the end beat and off elsewhere. No other steps.mjs text changed.

LayerTree counts are unique painted layers built/destroyed (B/D), from 100 ms after real Next until 1 s after arrival. Large means either side exceeds 48 CSS px; the before-run large counts below are recomputed from its stored events using that same definition. Off/on refer to part 10c's retention rule. Set out and Explore are reported without a gate.

| View / DPR | Press from | Before off B/D | Before on B/D | After off B/D | After on B/D | On large before / after |
| --- | --- | --- | --- | --- | --- | --- |
| 360x660 / 3 touch | Set out | 298/291 | 293/293 | 13/6 | 4/4 | 293 / 4 |
| 360x660 / 3 touch | Laurier | 355/356 | 307/309 | 12/12 | 2/4 | 307 / 2 |
| 360x660 / 3 touch | HMC Connections | 375/378 | 324/324 | 10/11 | 2/2 | 324 / 2 |
| 360x660 / 3 touch | Mohawk | 370/369 | 337/339 | 12/11 | 2/4 | 337 / 2 |
| 360x660 / 3 touch | Explore | 5/12 | 3/8 | 5/13 | 3/8 | 3 / 3 |
| 1920x950 / 2 mouse | Set out | 258/249 | 216/216 | 11/3 | 3/3 | 2 / 2 |
| 1920x950 / 2 mouse | Laurier | 327/330 | 235/236 | 10/11 | 2/2 | 0 / 0 |
| 1920x950 / 2 mouse | HMC Connections | 335/335 | 243/243 | 9/9 | 2/2 | 0 / 0 |
| 1920x950 / 2 mouse | Mohawk | 323/323 | 245/246 | 11/11 | 4/4 | 2 / 2 |
| 1920x950 / 2 mouse | Explore | 10/19 | 5/7 | 10/19 | 5/7 | 5 / 5 |

Identified phone rule-on go-light builds, before -> after: Laurier 305 -> 0, HMC Connections 322 -> 0, Mohawk 335 -> 0. The remaining phone failures are two 92x21 SPAN.tl-count.tl-f.tl-count-screen layers in each requested glide. Desktop Laurier and HMC build no large layer; Mohawk's only large builds are the permitted path.l.rs-trace and matching full-screen layer. The exception is owner/size-specific; the phone failures remain failures. The revised layer collection was repeated, with the same phone failure. Full events and both rule settings are in layers-before.json and layers-results.json.

N2 replaces shipY/shipWaterY with shipBerth: [40, 11, 0] and uses the exact trail clamp. The transform matches these berths within 0.5 map units at the map start beat, Interkom, Lennard and end, at both input sizes. The hero top has no rendered trip state; start is checked at map. Real Next from Interkom to Lennard gives maximum sampled trail error 0.00673 map units. The original geometry test still passes throughout the crossing.

| Berth | Map x, y | Minimum coast gap | Ring centreline gap | Ring outer-edge gap |
| --- | --- | --- | --- | --- |
| Near | 472.015, 600.515 | 3.037 | 19.472 | 16.274 |
| Far | 417.047, 649.893 | 3.113 | 13.061 | 9.861 |

Clearances use all twelve supplied hull/curl points at scale 0.55 and both coasts. The new ship test checks the ring's actual jormEdges boundaries, not just its centreline. The far stern curl fails the 10-unit gate; the local result differs from the brief's cloud measurement. No further geometry change is authorized by the exact N2 instructions.

At 1440x900, 1280x720, 1024x600, 820x1180, 412x730, 390x844, 360x640, 844x390, both berths were checked against map-label screen boxes (near at map, far after real Explore entry). No visible label is within 4 px of the ship's screen box. At every listed size, the hidden "the 2023 crossing" label has a 0 px box gap at the near berth; each is reported with visible:false. The far berth has no label under 4 px. Labels were not moved. Phone and desktop before/after captures were visually compared; the established composition is preserved.

Added comb-m2-bar-test (MutationObserver and motion-state checks), comb-m2-ship-test (transforms, real crossing, coast/ring clearance and labels), and comb-m2-scope-test (starting hashes and exact product edits). Changed comb-m-layers-test only for the 48 px gate and narrow runestone exception; comb-m-scope-test now exits 0 with the requested part 10c note. comb-m-fixture only redirects its run root and retains profile deletion after browser exit. finds-test changes the trip/data source pins containing the old ship placement, and its synthetic ship-focus view now uses longshipPoint without the old +5 offset. No other existing assertion was changed. An inherited run-folder loader redirects older fixtures and gives them cleanup after exit; it changes no product files or assertions.

RUNTIME_KB is unchanged: runtime gzip is 189.63 KB within 189.7 KB. All three HTML outputs came only from pack.mjs and pack-joined.mjs; joined.html regenerated identically. The scope check verifies every protected design/journey-map file against this run's starting hashes.

| Test or pack tool | Last exit |
| --- | --- |
| tools/check.mjs | 0 |
| tools/comb-close-test.mjs | 0 |
| tools/comb-f-geometry-test.mjs | 0 |
| tools/comb-g-focus-test.mjs | 0 |
| tools/comb-g3-interaction-test.mjs | 0 |
| tools/comb-g3-press-test.mjs | 0 |
| tools/comb-l-explore-test.mjs | 0 |
| tools/comb-l2-explore-state-test.mjs | 0 |
| tools/comb-m-browser-test.mjs | 0 |
| tools/comb-m-layers-test.mjs | 1 |
| tools/comb-m-scope-test.mjs | 0 |
| tools/comb-m-state-test.mjs | 0 |
| tools/comb-m2-bar-test.mjs | 0 |
| tools/comb-m2-scope-test.mjs | 0 |
| tools/comb-m2-ship-test.mjs | 1 |
| tools/comb-reopen-test.mjs | 0 |
| tools/explore-test.mjs | 0 |
| tools/finds-test.mjs | 0 |
| tools/pack-joined.mjs | 0 |
| tools/pack.mjs | 0 |
| tools/steps-test.mjs | 0 |

Full logs, screenshots, before copies, acceptance criteria and state/geometry evidence are in C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-m2. No git, installs, external network, agents, performance traces or performance measurement tools were used. The required inherited steps test exercises its simulated clock; no browser timing benchmark was run. The file boundary prevents changing timeline promotion, labels, serpent art or any other product behavior to resolve the reported gates. Independent reviewer agents were omitted under the explicit no-agent rule; real-browser review happens elsewhere.

Automatic approval review rejected removal of the exited legacy profile profile-1795695751795 with the reason "blocked by policy". It remains in the run folder; no alternate deletion was attempted. New browser tests delete their own profiles after exit. The run-folder cleanup-status.json records the final inventory.
