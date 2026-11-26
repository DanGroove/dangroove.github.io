COMB-O build, 2026-11-26. Built O1, O3, E1, T1 and T2 and packed both pages. O2 is omitted. Check 1 and the two layer gates still fail; no complete acceptance pass is claimed.

Scope and visual acceptance: preserve the approved map, shield placement, compass screen-size words, wolf paths, colours and gallop. Add one camera-matched dim layer, a traveller ring, and one eclipse per forward wolf run. Evidence is the starting packed pages, COMB-O, COMB-N and its review record, the incumbent drawings and the original map references. All browser artifacts and full logs are in C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-o. The starting pages are in before/ there.

O1: added the veil directly above the map with a matching camera, soft radial holes, compositor opacity transition, reduced-motion handling and moved lines. Mask selection no longer changes map/base opacity, notes, find mask values or hoard opacity. Hoard craft lighting, cards and timeline remain. Holes use actual compass text and stop label geometry and refresh at mask changes and zoom changes over 10%. The line mask preserves the compass's foreground occlusion. Clearing the hub now uses findView, restoring the phone's original focused camera instead of the desktop view.

O2: omitted. The first pull-back starts at 2.157 times the destination zoom on desktop and 3.123 times on phone. Rasterizing at that destination at the start exceeds the item's 1.6 limit. Changing the focus or move to conceal this is outside the authorized scope. Camera writes before and after remain desktop [5,1,4,4], phone [7,1,2,2], in Print, Video, Motion, Screen order. Full state observations are in o-focus-results.json.

O3: a 1.2 px SVG ring in traveller red, 2 px beyond the shield, follows the traveller's distance fade. It is hidden in explore, the end and reduced motion. SVG avoids CSS border quantization.

E1: Skoll and Hati retain their approved wolf geometry and gallop. Forward runs use the open-sky band, specified desktop windows and phone fallback. Added enlarged discs, glow, drifting local motes, closing/reopening lag, silhouette fill, clipped bite, light rings and a compositor sky dim. Hati adds the grey moon and eighteen stars. Hidden pieces lose promotion. Glow and dim move/fade through CSS only. The six eclipse cases pass, including peak overlap, bite/ring pixels, grey moon pixels, Back and explore exclusions, and mutation restrictions.

T1: layout-test now multiplies the former shield lift by MARK.lift, checking the trail-centred shield. The four spatial tests (comb-g, comb-g2, comb-l, comb-l-spatial2) replace the old 4 px ink-clearance gate with the current wordRing/wordGap screen-pixel placement and font-size rule. Other T1 assertions are retained.

T2: hold/layer tests allow only the named g groups and rect/path chunks with empty CDP compositing reasons. Reasons are captured while layers exist. Unresolved overlap splits remain failures. Hold, trail and sky stills use a fixed clock and held CSS animation phase. The trail comparison also replays the same idle holds before its explore still.

Other test changes: finds-test re-records the authorized sky/data/camera pins; finds-test and explore-test supply the relocated line group in their recording DOM fixtures. steps-test adds SVG creation and firstElementChild to its DOM mock for the ring, with no assertion changes. comb-n-wolves checks the new window, catch lag and silhouette blend. comb-n-sky accepts the specified small eclipse attribute writes. New comb-o dim, ring, eclipse and focus tests use real CDP input. The new fixture supplies fixed-clock observations and pixel comparison; the suite and loader route inherited artifacts into COMB_RUN=comb-o and remove profiles. The historical part9 page needed by comb-g3-interaction was copied unchanged into the run folder. check.mjs changes only RUNTIME_KB and its dated note.

The independent design-critique gate was omitted because COMB-O forbids agents. UI CLI setup was omitted because the rules prohibit installs, network and writes outside the allowlist. No git, installation, external network, agents or timing measurements were used.

Run-folder mistake: two inline probes (the clock smoke and first reference capture) omitted COMB_RUN and briefly created the existing fixture's default comb-n profile. Both profiles were deleted by finally/close; no capture or log was saved there. This violated the profile location rule. The probes were corrected and the COMB-O fixture now refuses to run unless COMB_RUN=comb-o is already set. Main suite runs set it explicitly.



Check 1: 40 before/after press cases, each with a matched no-press control, exactly 600 ms of fixed-clock mutation observation and a one-second still. All 720 recorded after-build camera frames match the veil camera. CSS opacity transition, promotion, hidden-on-clear and input selection gates pass. Both explore views have zero residual mutation keys. Steps still has camera, label and find-visibility mutations absent from a stationary no-press control. Those failures are retained.

Press mutation lists, compact form:

- Before: #b-all/opacity, #b-rest/opacity, #bc-notes/opacity; --jm-find on beacon, hammer, hoard-hmc1, hoard-hmc2, hoard-interkom, hoard-laurier, horn, longship, mist, ravens, runestone, serpent and well; opacity on all five hoards.
- After: none of those dim writes. Retained writes are the compass subtree and setCraftLit's scratch/ring bits. Steps additionally changes #cam, #cam-base, map/base CSS transforms, label transforms and find visibility/tab attributes as its camera pulls back. Residual unique key counts, Print/Video/Motion/Screen/hub: 1920: [39, 39, 9, 39, 30]; 412: [59, 59, 47, 59, 44]; 

The complete per-press before/after/control lists, frames, boxes and pixel counts are in [o-dim-results.json](C:/Users/Admin/Documents/Portfolio/journey-map-runs/comb-o/o-dim-results.json).

Visible-box pixels differing by more than 24, with a 0.5% per-box limit:

- Instrument: 31,224/2,249,612 pixels; 2/20 boxes fail.
- Words/title: 6,840/430,051 pixels; 24/100 boxes fail.
- Lit labels: 40,511/139,375 pixels; 36/36 boxes fail.
- Lit chests: 6,093/81,582 pixels; 22/34 boxes fail.
- Hub restore versus the pre-selection frame: 1920 explore 76,307/7,296,000; 1920 steps 11,735/7,296,000; 412 explore 6,326/2,598,964; 412 steps 6,582/2,598,964.

The clear holes brighten labels and surrounding map ink that ace2798 dimmed. Lines inside a veil whose own opacity is 0.45 also inherit that opacity; their original brightness cannot be preserved in that structure. These pixel gates remain failed. Explore unlit sample ratios stay within 15% of ace2798. Desktop steps sample ratios fail; three phone steps views have no eligible fully veiled bright sample. Desktop explore's restore gate also fails. The phone hub camera now restores correctly; its older ace2798 hub view differs. No tolerance was relaxed to conceal these results.

T2 results: hold allows 56 map-split instances (22 phone, 34 desktop); layers allows 76 across all observation windows, including 19 in its six rule-on stop glides, and skips 16 timeline instances. Hold still reports seven desktop overlap instances. The layer gate also reports required new eclipse layers/filter surfaces and the retained runestone split. All hold pixel gates pass; end frames have zero changed pixels. Fixed-phase trail explore crops are 0/637856 phone and 1/574620 desktop. Sky crop gates pass. Full counts are in hold-results.json, trail-results.json, sky-results.json and layers-results.json in the run folder.

Eclipse pixel evidence: all six rings occupy 36/36 sampled angular sectors, k reaches 1 at u 0.4613-0.4645, and the dim reaches 0.5. Hati's grey-moon matching pixel counts are 1440: 11,856, 1920: 13,012, 412: 7,711. Approved eye colours are checked before the catch. Reference and revised peak captures were visually compared.

Scope verification passes: protected packed modules are unchanged after newline normalization; trip outside tripApply, main after stage markup, depth outside sky, cards outside the ring, findhoards outside permitted mask/lookup handling, art outside the line group, findkit outside its mask term and data outside allowed tables remain unchanged. CSS verification accounts for packer font inlining. See scope-evidence.json and syntax-results.json. Runtime gzip is about 197.9 KB against the dated 198.0 KB limit.

Last exits (full logs are in the run folder; test-exits.ndjson identifies the latest log):

| Test or build tool | Last exit |
| --- | --- |
| tools/check.mjs | 0 |
| tools/finds-test.mjs | 0 |
| tools/steps-test.mjs | 0 |
| tools/explore-test.mjs | 0 |
| tools/comb-f-geometry-test.mjs | 0 |
| tools/comb-m-state-test.mjs | 0 |
| tools/comb-m-browser-test.mjs | 0 |
| tools/comb-m-layers-test.mjs | 1 |
| tools/comb-m2-bar-test.mjs | 0 |
| tools/comb-m2-ship-test.mjs | 0 |
| tools/comb-n-hold-test.mjs | 1 |
| tools/comb-n-trail-test.mjs | 0 |
| tools/comb-n-sky-test.mjs | 0 |
| tools/comb-n-wolves-test.mjs | 0 |
| tools/comb-g-wayfinder-test.mjs | 0 |
| tools/comb-g-layout-test.mjs | 0 |
| tools/comb-g-spatial-test.mjs | 0 |
| tools/comb-g2-spatial-test.mjs | 0 |
| tools/comb-l-spatial-test.mjs | 0 |
| tools/comb-l-spatial2-test.mjs | 0 |
| tools/comb-c-tail-test.mjs | 0 |
| tools/layout-test.mjs | 0 |
| tools/comb-extra-test.mjs | 0 |
| tools/comb-close-test.mjs | 0 |
| tools/comb-reopen-test.mjs | 0 |
| tools/comb-g-focus-test.mjs | 0 |
| tools/comb-g3-interaction-test.mjs | 0 |
| tools/comb-g3-press-test.mjs | 0 |
| tools/comb-l-explore-test.mjs | 0 |
| tools/comb-l2-explore-state-test.mjs | 0 |
| tools/comb-o-dim-test.mjs | 1 |
| tools/comb-o-ring-test.mjs | 0 |
| tools/comb-o-eclipse-test.mjs | 0 |
| tools/comb-o-focus-test.mjs | 0 |
| tools/pack.mjs | 0 |
| tools/pack-joined.mjs | 0 |
| tools/comb-o-suite-test.mjs (last invocation: focus) | 0 |
| COMB-O syntax checks | 0 |
| Scope/ASCII/name checks | 0 |
| Camera-frame audit | 0 |
| Clock smoke, corrected inline probe | 0 |
| Reference capture, corrected inline probe | 0 |

No test browser remains running. Three retired profiles remain under the comb-o run folder: profile-15484-1795712869988, profile-1795712485322 and profile-1795713490490. cleanup-status.json contains their full paths and zero active owner processes; no default comb-n profile remains. Profile cleanup is incomplete.

Automatic approval review rejected both the checked bulk deletion and explicit-path deletion of these profiles. Its stated reason was "blocked by policy". No alternative deletion method was used for these three profiles.
