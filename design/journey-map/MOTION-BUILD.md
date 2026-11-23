# Round 7 part D4 build

Status: D4 is built and its fake-clock checks pass. Eight test programs
pass. tools/check.mjs still fails the same 13 D3 label-clearance assertions
that failed before any D4 edit. The all-tests-pass requirement is NOT met.
Both pack tools ran successfully. No visual or browser check was made.

## Evidence and acceptance criteria

Read MOTION.md in full first, then REVIEW3.md, REVIEW3-BUILD.md, the named
runtime modules, their timing tables and the tools. The D3 record explicitly
documents its unresolved label gate. The existing hero leave, map fall,
held views, X framing, card controls and D1-D3 recording checks constrain
this change. Read the installed motion-playbook and design-critique-loop.
Applied continuous speed, spatial consistency and reversible timing.
Independent reviewers and rendered comparison were omitted under the
user's explicit restrictions. No independent-review pass or score is claimed.

Acceptance criteria used before editing:

- Scroll only between top P=0 and whole-map P=255, through the original
  hero and handoff score. One viewport height targets 100 P; smooth with
  a 120 ms time constant, clamp both ends and settle after 400 ms.
- A scroll under 12 percent returns to its origin; a larger scroll follows
  the last direction. A release above 0.5 px/ms follows its own direction.
- Start, Set out and navigation to a stop lock scroll immediately. Only
  return to top unlocks it. No scrolling from the map into Laurier.
- Preserve owned hero drags, taps, keys, sheets, card scrolling, explore
  gestures and the reduced-motion native page.
- Give each map/stop/X rest-to-rest interval one P-driven camera score,
  with immediate onset, one broad speed hill, concurrent cards and equal
  forward/back durations on desktop and phone. Keep the X's own acts.
- Sample all 28 directed moves every 16 ms. Enforce the requested speed,
  acceleration, duration, card-window, same-P and hurry gates.

This allowed report is the project record for this scope. Protected sources
and actual recording results were compared throughout; there is no rendered
or side-by-side visual evidence in this environment.

## Scroll stretch

steps.mjs owns the scroll target as well as P. Wheel/trackpad deltas normalize
pixel, line and page modes; a line is 16 px. They add deltaY / VIEW.unit to
the clamped target. Each frame follows that target by 1-exp(-dt/0.12).
No native window scroll is used in the motion page.

The target retains the origin and last direction of its input burst. At
400 ms idle, less than 0.12 * 255 P of net travel returns to that origin;
otherwise it finishes at top or map according to the last direction. This
finish uses the existing step pace, including the original hero/fall score.
An input can interrupt that finish at its current P. A fast touch release
above 0.5 px/ms overrides the small-distance return and follows its velocity.
Velocity uses a recent 80 ms sample window; vertical intent has 6 px slop.

Touch starts and moves are observed after the element's own handlers.
Default-prevented starts/moves, a default-prevented touch pointerdown and
touch-action:none on a hero ancestor leave the gesture with that element.
Horizontal gestures and multi-touch are not adopted. A tap keeps its click;
a claimed drag suppresses its compatibility click. A fresh pointerdown
clears stale suppression. Sheets, faces and the timeline keep their input.
Locked journey swipes are prevented without changing P.

The joined hero button already calls JOURNEY.next(), so it takes the same
immediate lock as the map title's Start control. Set out and all forward
steps also lock. Stop navigation by go/set locks; returning only to map
does not unlock. Back to top and Back steps reaching top unlock on arrival.
At map, scrolling down cannot enter a stop; at top, scrolling up is clamped.

join.mjs and main.mjs needed no edits. The joined page's existing place(P)
still calls the real hero API's setLeave(min(P,100) * viewportHeight/100),
and main still invokes it directly after stepsFrame. The new steps test
executes that actual leave function with a recording API, on the fake clock,
alongside both page configurations. This is not a browser test.

## One continuous glide

trip.mjs defines seven intervals from the overview midpoint through each
stop's held midpoint to the start of the X's rush. Existing beat P values,
SEQ, date mapping, HOLD and ACTS tables are retained. steps.mjs uses
glideMove for an interval inside one of these stretches; hero/fall, cuts
and the X-to-end score continue using the existing pace module. pace.mjs
was not changed because it is outside the allowlist.

P is linear in a normal glide's elapsed fraction. One cosine-ramped ease
turns that fraction into T. Its speed rises during the first 18 percent,
has a shallow 5 percent swell through its middle, then falls during the
last 18 percent. There is no fold pause, separate zoom clock or arrival
hold. Repeated Next uses the existing 0.3 s hurry path through the same P
frames. Back uses the same interval and duration in reverse.

Camera centres use a degree-eight Bezier through nine smoothed trail
samples. Endpoint offsets carry that path exactly into the existing held
views, including the phone's wider X/Lennard/skyline framing. Set out blends
the overview centre into Laurier's held centre. The traveller follows the
actual trail with the same camera path parameter.

Scale is one continuous log-scale bowl: interpolate the endpoint log scales
and subtract depth * 4*q*(1-q). Depth is
log(1.35/(1-0.26)) * min(1, trailDistance*0.45/160), with no bowl for Set out
or when Depth is off. The longest ordinary leg reaches 0.74 * VIEW.sT at
the bowl's deepest point, matching the old maximum arc depth. Shorter legs
have shallower bowls. Depth off retains the held scale throughout ordinary
glides. The X's fitted scale remains its exact endpoint.

A 2048-interval lookup integrates the maximum screen velocity at the view
centre and four quarter points, and maps T to distance on that camera path.
It prevents the path's changing pan/zoom proportions from causing a stop
or speed trough. Tables depend on view geometry and Depth, and clear on
resize. They contain no animation clock or direction state.

The outgoing card folds in the first 0.5 s while the camera already moves.
The incoming card opens in the final 0.5 s, entirely inside the requested
last-0.6-s window, and is fully open at camera arrival. The symmetric 0.5 s
windows deliberately make card frames reversible at identical P; there is
no additional 0.3 s after-stop wait. Existing cards.mjs consumes this score,
so its marks, card motion, close control and focus rules need no changes.
The map dimming follows the same card score through its existing one-layer
opacity writer. Labels travel with the camera. No nova work was moved into
the SVG. The X beat and its 3.0 s rush, blast and settle remain unchanged.

## Final STEPS tables

All new tuning is in data.mjs:

```text
STEPS.scroll:
  ease 0.12 s; settle 0.4 s; threshold 0.12; flick 0.5 px/ms
  slop 6 px; line 16 px; velocityWindow 80 ms

STEPS.glide:
  seconds [2.6, 4.2]; ease cosine-ramp
  ramp 0.18; cruiseSwell 0.05; distancePower 0.5
  fold 0.5 s; open 0.5 s; openWindow 0.6 s
  zoomOut 0.26; zoomLength 160 vh
  overviewDistance 300 map units; controls 8; samples 2048
```

Let d be the trail distance, with Set out assigned overviewDistance=300.
Across these seven distances, duration is
2.6 + 1.6 * sqrt((d-minDistance)/(maxDistance-minDistance)) seconds.
The same rule and values apply in both directions and at both sizes.

## Measured moves

These are actual stepsFrame fake-clock runs at 16 ms intervals. Duration is
press to arrival and the next card fully open, rounded up to a sample.
Nominal durations appear in steps-test. Speeds are px/s; acceleration is
px/s^2. Centre means instantaneous optical motion at the viewport centre;
five-point peak is the largest speed among the centre and four quarter-view
probes. These measurements do not represent rendered pixels or device FPS.

| View | Move | Measured s | Centre peak | Five-point peak | Centre acceleration |
| --- | --- | ---: | ---: | ---: | ---: |
| 1440x900 | map -> laurier | 3.824 | 218.95 | 380.61 | 511.03 |
| 1440x900 | laurier -> map | 3.824 | 217.69 | 377.69 | 508.45 |
| 1440x900 | laurier -> hmc1 | 3.856 | 360.62 | 362.92 | 523.40 |
| 1440x900 | hmc1 -> laurier | 3.856 | 360.41 | 363.38 | 528.51 |
| 1440x900 | hmc1 -> mohawk | 4.064 | 373.47 | 377.13 | 786.80 |
| 1440x900 | mohawk -> hmc1 | 4.064 | 372.16 | 376.52 | 804.11 |
| 1440x900 | mohawk -> hmc2 | 4.208 | 401.82 | 404.71 | 594.11 |
| 1440x900 | hmc2 -> mohawk | 4.208 | 402.32 | 404.70 | 605.31 |
| 1440x900 | hmc2 -> interkom | 3.360 | 246.56 | 247.67 | 391.25 |
| 1440x900 | interkom -> hmc2 | 3.360 | 246.50 | 247.57 | 389.62 |
| 1440x900 | interkom -> lennard | 3.840 | 372.90 | 378.68 | 637.73 |
| 1440x900 | lennard -> interkom | 3.840 | 374.84 | 377.70 | 616.66 |
| 1440x900 | lennard -> x | 2.608 | 196.64 | 206.74 | 500.83 |
| 1440x900 | x -> lennard | 2.608 | 196.60 | 207.40 | 499.82 |
| 390x844 | map -> laurier | 3.824 | 144.62 | 232.10 | 335.87 |
| 390x844 | laurier -> map | 3.824 | 143.90 | 230.56 | 334.19 |
| 390x844 | laurier -> hmc1 | 3.856 | 197.29 | 198.12 | 260.39 |
| 390x844 | hmc1 -> laurier | 3.856 | 197.16 | 198.02 | 262.31 |
| 390x844 | hmc1 -> mohawk | 4.064 | 207.52 | 209.08 | 346.96 |
| 390x844 | mohawk -> hmc1 | 4.064 | 207.51 | 208.64 | 347.07 |
| 390x844 | mohawk -> hmc2 | 4.208 | 228.24 | 229.39 | 254.39 |
| 390x844 | hmc2 -> mohawk | 4.208 | 228.64 | 229.20 | 252.56 |
| 390x844 | hmc2 -> interkom | 3.360 | 149.55 | 150.59 | 232.05 |
| 390x844 | interkom -> hmc2 | 3.360 | 149.55 | 150.40 | 231.11 |
| 390x844 | interkom -> lennard | 3.840 | 222.16 | 223.89 | 315.22 |
| 390x844 | lennard -> interkom | 3.840 | 221.25 | 223.49 | 317.59 |
| 390x844 | lennard -> x | 2.608 | 91.17 | 96.49 | 261.10 |
| 390x844 | x -> lennard | 2.608 | 90.45 | 96.84 | 260.86 |

All moves change camera by the 32 ms sample. After the initial ascent from
half to 60 percent of peak, no five-point speed drops below 60 percent
before its final descent. The analytic ease has one broad speed hill.
The test also checks arrival stays settled, departure starts within 100 ms,
fold completion within 0.5 s plus one sample, opening inside the last 0.6 s,
full opening at arrival, identical same-P frames and hurry completion.

Worst centre peaks: 402.32 desktop (limit 864), 228.64 phone (limit 234).
Worst centre accelerations: 804.11 desktop (limit 1728), 347.07 phone
(limit 468). Normal measured arrivals span 2.608 to 4.208 s.

## Test changes and preserved sources

- steps-test now samples the authorized glide clock for neighbouring
  stop moves, checks equal forward/back durations, and replaces the old
  no-touch-listeners/all-wheel-blocked assertions with top/map scroll and
  locked-journey checks for both pages. It additionally checks native
  reduced-motion input. Existing key, explore, close/focus and X gates pass.
- motion-test is new. Its five probes use each frame's camera transform to
  measure optical flow and centre vector acceleration, including backwards.
- depth-test changes the depth-off ordinary-leg expectation from VIEW.sT
  to the continuously held CAMERA.holdZoom * VIEW.sT. Boundary, arc, cloud,
  deck, focus, star and nova checks remain enforced.
- check.mjs now permits and verifies STEPS.glide.ease='cosine-ramp'; all
  numeric tuning still must be finite and positive. No label gate changed.
- finds-test re-records the LF-normalized trip.mjs FNV digest from
  3050818230 to 16753574. depth.mjs remains 3982895838, and the
  STARS/DEPTH/NOVA data digest remains 3076901412. Sea/fill/coast hashes
  remain unchanged. No other digest was re-recorded.

SHA-256 and non-ASCII-sequence inventories were compared with the starting
118 files. Changed runtime files are only data.mjs, steps.mjs and trip.mjs.
Changed tests are check, depth-test, finds-test and steps-test; motion-test
is new. The two dist files and this report are the other changed/new files.
joined.html was regenerated and remains byte-identical to its starting copy.
No existing file was deleted; no existing non-ASCII sequence changed,
including every accented Norse name in data.mjs. This report is ASCII only.

cards.mjs, join.mjs, main.mjs, explore.mjs, depth.mjs, map.css, pace.mjs,
hammer.mjs, footer.mjs, every find module, index.html, hero-copy/, reference/,
assets/, every other Markdown file and every unlisted module retain their
starting hashes. All 36 top-level runtime/tool modules pass node --check.

## Packs and limitations

Both original tools ran without modification:

- node tools/pack.mjs: dist/journey-map.html 605.6 KB.
- node tools/pack-joined.mjs: dist/journey-joined.html 1144.9 KB;
  joined.html regenerated.

Post-pack gzip checks: hammer 15.87/30 KB, map modules/CSS 141.35/150 KB,
standalone 257.85/320 KB, joined 478.15/540 KB.

Left out: repairing D3 label clearances. The initial check already failed
the same 13 coast/ring assertions; REVIEW3-BUILD.md records why its label
translation could not fit. MOTION.md says D1-D3 stay as they are and must
not be reworked. Changing label geometry, text floors, coast or marks, or
weakening the assertions, would work around that rule. None was done.
The final check failure is identical to the initial failure. Packed pages
are review candidates with this existing gate still failing.

The incoming card uses 0.5 s of the available 0.6 s opening window, as
described above. No D4 input or glide check was omitted. No browser, visual
comparison, screenshot, device performance test, server, reviewer or
sub-agent was used. audit-capture.mjs was not executed because it launches
a browser and writes capture files outside the allowlist. No git,
installation or network operation ran. RTK was unavailable
(command-not-found); no replacement was installed.

## Each test's exact last output line

| Program | Result | Last output line |
| --- | --- | --- |
| tools/check.mjs | FAIL: existing D3 label gate | ` - 390: D3 tier-1 stop-ring clearance Lennard -5.29` |
| tools/motion-test.mjs | PASS | `ok: 28 desktop/phone forward/back glides move by 32 ms, have one speed hill, meet speed/acceleration/duration/card gates, reproduce the same P and still hurry` |
| tools/steps-test.mjs | PASS | `ok: X frame/phone box clear controls; rush through settle hides stepper and restores main focus` |
| tools/depth-test.mjs | PASS | `ok: gather endpoints and continuous ring tangent for 32 arrival angles; explore restores depth fade` |
| tools/finds-test.mjs | PASS | `ok: actual timeline Home and End handlers select first and last stops` |
| tools/hammer-test.mjs | PASS | `ok: 200-seed balance bounds, finite runs and <20-minute termination` |
| tools/explore-test.mjs | PASS | `ok: D3 real findsBuild horn/chest/beacon pinches at 0/30/100 ms preserve found/stage and zoom >=20%; taps act once, chest hold repeats, owned drags aim/wipe/turn and press drags pan` |
| tools/layout-test.mjs | PASS | `ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads` |
| tools/nova-test.mjs | PASS | `ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged` |
