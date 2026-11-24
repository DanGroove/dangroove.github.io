# ORIGIN build

This is an implementation candidate for external browser review. The rendered
fit, before/after card heights and real-browser tail gate are NOT verified.
The browser check exits 2 with one NOT RUN line per requested size. No visual
pass, reviewer score or real-device performance result is claimed.

## Evidence and acceptance criteria

Read BRIEF.md, then ORIGIN.md, the existing cards/camera/steps/layout code,
REVIEW4-BUILD.md and MOTION-BUILD.md. Viewed both approved reference sheets.
The existing white logo bands, brand fields, Lennard white content panel,
type hierarchy, piece framing, map line work and footer remain the visual
constraints. Applied the installed UI Skills routing and Impeccable craft
guidance; the user's specific instructions take precedence.

Criteria established before editing: preserve the shield as the same map
button; grow and close the same face behind it; join the real tilted edge
to the real rim; keep desktop pairs centred and phone sheets above the
step bar; put the X in the header; retain all copy and 44 px targets;
measure natural content height rather than cap it; paint A/B/C with a
400 ms fade; pin every hold/glide endpoint to the measured pair; retain
the motion, carry and hurry gates. Browser-only criteria remain pending.

This allowed report is the project record for this task. No additional
Markdown, screenshots, profiles or coordination files were created.

## Changes

- cards.mjs: the original article owns its shield, a new tail, and a
  growing c-card wrapper around the original face. The article translates
  with its map point; the shield keeps its rest size and opacity. Only the
  wrapper scales and moves to the pair position. The face keeps its existing
  pointer tilt; the tail projects its edge mathematically outside that tilt.
  Its point stays at the outer rim plus CARD_TAIL.gap, including while the
  base has zero length under the shield. No duplicate face or shield appears.
  The close button is the last item inside c-top. Its old separate display
  switch is gone; it inherits the words' opacity, growth and tilt. Existing
  close/reopen, inert-during-motion and focus-return behavior remains.
  Resize measures the whole c-in, with no cap. Piece/takeaway occupy separate
  grid areas so the compact layout can place them beside each other.
- art.mjs: all four shield quarters paint, with A on the original quarters,
  B on the others, C on the boss. Paper ring/highlight and the original
  silhouette remain. Ink planks now cross every painted quarter. Added the
  unit triangle drawing returned by cardTailSvg().
- data.mjs: added the exact five shield triples and CARD_TAIL settings.
  Removed the unused 420 px cap, phone height share and cap slack. Phone
  glides use a shallower 0.10 pullback and a 2.6-4.4 s duration range instead
  of 0.26 and 2.6-4.2 s. New off-centre anchors exceeded the unchanged phone
  speed gates with the old settings; these continuous curves pass the same
  gates. Desktop timing and all opening/folding windows stay unchanged.
  Facts, copy, STARS, DEPTH and NOVA tables are preserved.
- trip.mjs: tripCardPlace shares analytic pair geometry between measurement
  and camera tests. tripStopCamera pins the actual map waypoint, including
  the shield's existing stand offset, to the pair's shield centre. Holds
  and both ends of every glide use it. The path cache key includes every
  pair anchor. Overview, explore and the X retain their original framing.
- map.css: the shield has its own layer above face and shadow-free tail;
  active articles sit above other stops. Removed face scrolling, its pan-y
  touch action, overscroll behavior, floating X rules and reserved header
  padding. Phones and desktops up to 720 px high use the compact layout:
  whole paragraph, takeaway beside a smaller 3:2 piece, and crafts/button
  sharing a row. Type floors are 13/22/12/11/9 px and both buttons retain
  44 px targets. The reduced-motion cards retain the roomy page layout.
  Mini-map dots use a quartered A/B conic gradient and the same paint alpha.
- main.mjs: assigns the mini-map palette variables and remeasures/invalidates
  after image loads and late font loading. Resize remains the only other
  layout measurement boundary; frame callbacks do not read layout.
- dist/journey-map.html: rebuilt only by node tools/pack.mjs.

## Changed tests

No existing assertion was relaxed or removed.

- tools/check.mjs permits shield and requires exactly three 6-digit hex
  values in every palette.
- tools/steps-test.mjs adds the required header DOM containment/order and
  separated wrapper checks. Recording frames at 50 ms intervals through an
  open and reverse close at desktop and phone sizes check rim attachment,
  fixed shield opacity and absence of an article scale, including pointer
  tilt. These are Node recording nodes, not browser geometry measurements.
- tools/layout-test.mjs adds seven-size analytic pair fixtures, exact hold
  anchors, pair centring, narrowing, phone rim/review clearance and cache
  invalidation after changed anchors. Heights are explicit fixtures, not
  measured card heights. Existing footer and frame-read gates remain.
- tools/motion-test.mjs supplies content-height fixtures through the shared
  placement function. This makes its unchanged speed/acceleration, one
  glide, carry, no-hurry-jump and arrival gates exercise the new anchors
  rather than the old fallback camera.
- tools/finds-test.mjs re-records trip's LF-normalized FNV digest to
  2259295218 and adds the full data.mjs digest 3500859031. Its existing
  STARS/DEPTH/NOVA digest stays 4178723640. The protected depth.mjs digest
  stays 4010889213; depth.mjs was not edited at all.
- tools/origin-check.mjs is new. It accepts an existing headless Edge/Chrome
  DevTools WebSocket endpoint on 127.0.0.1, serves the packed standalone page
  on 127.0.0.1, blocks other page requests, visits all six stops at all seven
  sizes, and checks real face/shield/tail geometry, overlap, scroll equality,
  X containment/target and opacity. At desktop and phone it also collects
  tail measurements with a browser-side 50 ms interval through close/open.
  It writes no files, creates no profile, closes only its own tab and server,
  and refuses a non-loopback or non-headless endpoint.

## Rules that prevent requested work

No headless Chrome/Edge process with a remote debugging endpoint was
available. Launching one would create a browser profile, cache or temporary
files outside the explicit write allowlist. I did not launch one, substitute
another browser surface, create a profile in a disguised path, or run the
capture utility. origin-check is runnable with an already-existing local
headless endpoint via --cdp ws://127.0.0.1:PORT/devtools/browser/ID. Its
default invocation reports NOT RUN and exits 2, never a fake pass.

The unchanged tools/pack-joined.mjs writes joined.html as well as its dist
file and reads hero-copy. joined.html is not allowed by ORIGIN's Rules.
I left that tool and dist/journey-joined.html untouched, and did not
intercept, redirect or work around its write. The joined dist remains the
baseline version and is not an ORIGIN preview. Review the standalone dist.

Independent critics/agents, network research, installs and the skill CLIs
were omitted under the task rules. RTK was not on PATH; no replacement was
installed. No git command was run. No server was started or left running.

## Card heights before and after

No card height was measured in a real browser in this run. At each size,
all six before values and all six after values are unmeasured:

| Size | Before, all six | After, all six |
| --- | --- | --- |
| 1440 x 900 | unmeasured | unmeasured |
| 1280 x 720 | unmeasured | unmeasured |
| 1024 x 600 | unmeasured | unmeasured |
| 820 x 1180 | unmeasured | unmeasured |
| 390 x 844 | unmeasured | unmeasured |
| 412 x 730 | unmeasured | unmeasured |
| 360 x 640 | unmeasured | unmeasured |

ORIGIN.md reports baseline Lennard 428/420 at 1440 x 900, 1280 x 720 and
820 x 1180; at 412 x 730 it reports HMC 557/547, HMC again 576/547 and
Lennard 608/547; at 360 x 640 it reports 494-633/473. Those are supplied
historical measurements, not measurements reproduced here. The compact
fixtures in Node tests must not be substituted for rendered heights.

External review should look closely at the full Lennard card at 360 x 640,
all six faces' scrollHeight/clientHeight equality, HMC's longer date pill,
the tilted tail's base seam and colour, phone review-switch clearance,
paint going backwards through the first visit, and late-font/rotation
behavior. A real side-by-side comparison with the approved sheets and the
baseline rendered page still needs to happen elsewhere as instructed.

## Run record before the final transcript

All tests below were run with node from design/journey-map. Successful
intermediate repeats are recorded compactly here; the final run's complete
stdout/stderr is appended below.

1. Baseline: check, steps-test, nova-test, depth-test, layout-test,
   explore-test, finds-test, motion-test and hammer-test all exited 0.
   check output: modules/CSS 150.63/160 KB gzip, standalone 267.18/320,
   joined 487.28/540, hammer 15.87/30; six stops, five palettes, eleven
   finds, acts total 2224.8 vh, 24 modules with unique top-level names.
   motion output: 28 rest glides, 336 carry runs, 14 late-hurry guards pass.
   Other final lines: X frame/phone box clear controls; rough sprite grows
   on resize; gather endpoints and continuous ring tangent for 32 angles;
   no frame layout reads; D3 real findsBuild gestures preserved; actual
   timeline Home/End select first/last; 200-seed balance bounds pass.
2. First implementation check exited 0 (152.52 KB gzip). steps-test failed
   with TypeError: document.querySelectorAll is not a function at cards.mjs
   line 137. Fixed by caching each mini-map node during build, removing the
   new per-frame document query. motion-test at this point exited 0 but
   still used old fallback anchors; it was strengthened with pair fixtures.
3. New-anchor motion run failed four unchanged speed gates:
   390 mohawk->hmc2 250.55 px/s; hmc2->mohawk 250.55;
   interkom->lennard 238.70; lennard->interkom 238.63. Limit 234.
   steps-test exited 0, including existing X/focus and all carry checks.
4. Shallower phone pullback motion run failed two unchanged speed gates:
   mohawk->hmc2 244.77 and reverse 244.89 px/s. Limit 234.
   depth-test exited 0: existing cloud, mist, continuity, depth-off, gather
   and star identity assertions all pass.
5. Phone 2.6-4.4 s timing run: motion-test exited 0. Phone worst normal
   centre speed 233.61 px/s; acceleration 363.09 px/s^2 before the longer
   timing, 336.39 or less after it. Desktop worst normal centre speed
   420.32 px/s and acceleration 1021.32 px/s^2. Carry/hurry gates pass.
6. Added DOM and analytic pair assertions: steps-test and layout-test
   exited 0. New layout output: exact hold anchors, centred desktop pairs,
   phone rim gap/review clearance, narrowed cards and anchor-aware cache.
7. Added 50 ms tail recording assertions: steps-test exited 0. New output:
   tail stays on rim through tilt; shield never scales with the face or
   fades; X is inside the header.
8. First standalone pack exited 0: dist/journey-map.html 640.6 KB raw.
   origin-check exited 2 with seven NOT RUN lines (same reason as below).
9. After removing obsolete cap data: check and finds-test exited 0.
   check output: modules/CSS 152.57/160 KB gzip, standalone 269.29/320
   (the prior pack), joined 487.28/540, hammer 15.87/30. finds output:
   protected depth and STARS/DEPTH/NOVA digests pass; all eleven find plays,
   focus, gestures, repeated-write and reduced-motion checks pass.

An initial Node inline harness failed to parse because PowerShell stripped
its quotes; no tests executed in that attempt. It was rerun using stdin.
Shell read attempts through unavailable RTK and two malformed rg paths
failed without changing files; direct reads were used afterward.

## Final verification transcript

```text
node --check: 37 modules, 0 failures
```

### node tools/pack.mjs (exit 0)

```text
packed data.mjs, art.mjs, trip.mjs, depth.mjs, stars.mjs, pace.mjs, timeline.mjs, findkit.mjs, explore.mjs, steps.mjs, cards.mjs, footname.mjs, footer.mjs, findhoards.mjs, findcreatures.mjs, findsheets.mjs, hammer.mjs, findhammer.mjs, findwater.mjs, findhorn.mjs, findall.mjs, finds.mjs, main.mjs
dist/journey-map.html 640.5 KB
```

### node tools/check.mjs (exit 0)

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 15.87 KB / 30; all map modules + CSS 152.57 KB / 160
gzip: dist/journey-map.html 269.27 KB / 320
gzip: dist/journey-joined.html 487.28 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

### node tools/steps-test.mjs (exit 0)

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

### node tools/nova-test.mjs (exit 0)

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is omitted in reduced motion
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; gather complete at .93; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged
```

### node tools/depth-test.mjs (exit 0)

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

### node tools/layout-test.mjs (exit 0)

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

### node tools/explore-test.mjs (exit 0)

```text
ok: desktop/phone zoom limits, bounded/centred cameras, fixed zoom anchor, damped glides with no overshoot, layer/inverse round trips
ok: end-only CTA entry, input takeover, pan/release, resize, exit and immediate departure reset; P and traveller unchanged
ok: copied name curves monotone, lens/rest geometry and knock spring settling
ok: arrows pan during explore without changing P; Escape ends explore
ok: actual footer fades in linear time, is gone by 600 ms, returns over last 500 ms of exit, and stays inert while exploring
ok: capture-phase pinch on nova/stop/horn; nova taps; owned single drags; drag-only pointer clicks; key/end/depart/reset/down/500 ms suppression clearing; temporary world promotion
ok: D3 real findsBuild horn/chest/beacon pinches at 0/30/100 ms preserve found/stage and zoom >=20%; taps act once, chest hold repeats, owned drags aim/wipe/turn and press drags pan
```

### node tools/finds-test.mjs (exit 0)

```text
ok: C1 ring sea baseline; original fill/coast lengths and hashes unchanged
ok: STARS/DEPTH preserved; NOVA.build data digest recorded
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
ok: C2 ravens (tree drawn first, opaque birds, one drawing each, flights out of frame and back, facing, landing, reel and its kept items, epoch, shy hop, hear loop; outlines at least 1.32 units apart, largest pose step 7.78) and chests (staged dig, rattle, back lid, craft light, hints, kept popup): 1440x900: 1266 raven ticks; 390x844: 1266 raven ticks
ok: D2 falling quills fit one third of an open wing, stay behind takeoff/clear the other bird and expire by .8 s; 16 ms lid steps <=25 degrees, gentle start, .5 s peak, <=8 degree overshoot
ok: D3 live attribute equality skips stale/same values; attribute MutationObserver recording rejects every redundant write over 2 s at a stop and 2 s of blast (9638 writes)
ok: reduced-motion serpent consumes leaves immediately with no swell; no shy hop; all tree actors stay still on hear
ok: reduced-motion Part A plays land immediately, memory remains readable for five seconds, no live bits/flights/focus, camera unchanged
ok: reduced-motion hammer plays/pauses without map sparks/tremble/hop; mist, horn, Norns, stars, pennant and all-eleven feedback land immediately with no bits, flights or camera change
ok: footer name layout reads 85 total, only resize/fonts/settle-end/two explore boundaries; none in idle frames or knock: {"resize":17,"fonts":17,"settle-end":17,"explore":34}
ok: actual timeline Home and End handlers select first and last stops
```

### node tools/motion-test.mjs (exit 0)

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
1440x900 | lennard->x | 2.608 | 265.18 | 276.34 | 729.56 @ 2368
1440x900 | x->lennard | 2.608 | 265.26 | 277.10 | 728.26 @ 272
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
390x844 | lennard->x | 2.608 | 79.40 | 83.88 | 249.46 @ 2352
390x844 | x->lennard | 2.608 | 79.56 | 84.10 | 249.17 @ 272
D5 view | press | runs | worst centre acceleration | five-point peak | arrival range s | total range s
1440x900 | Back | 63 | 1703.88 | 838.77 | 0.656-4.176 | 0.656-4.176
1440x900 | hurry | 21 | 4178.30 | 1441.72 | 0.464-1.808 | 0.464-1.808
1440x900 | Next-reverse | 42 | 1727.01 | 815.11 | 0.896-4.176 | 0.896-4.176
1440x900 | Back-Next | 14 | 1721.91 | 764.49 | 1.152-3.472 | 1.456-3.776
1440x900 | go-back | 14 | 1687.93 | 838.77 | 1.312-2.928 | 1.312-2.928
1440x900 | go-next | 14 | 1725.25 | 815.11 | 1.312-2.656 | 1.312-2.656
390x844 | Back | 63 | 1006.19 | 461.68 | 0.656-4.368 | 0.656-4.368
390x844 | hurry | 21 | 2515.55 | 828.84 | 0.464-1.408 | 0.464-1.408
390x844 | Next-reverse | 42 | 1011.15 | 461.68 | 0.720-4.368 | 0.720-4.368
390x844 | Back-Next | 14 | 796.61 | 466.34 | 1.152-2.512 | 1.456-2.816
390x844 | go-back | 14 | 925.68 | 461.68 | 1.312-2.224 | 1.312-2.224
390x844 | go-next | 14 | 890.26 | 461.68 | 1.312-2.224 | 1.312-2.224
ok: 28 rest glides, 336 carry runs and 14 late-hurry guards; 16 ms acceleration/five probes, analytic continuity, bounded reversals through 99 percent, exact settled arrivals, faster feasible hurry and fresh set(P) equality
```

### node tools/hammer-test.mjs (exit 0)

```text
ok: D3 foe heights incl stroke: giants/chief 16, hunched draugr 11, low full-width wolf 8; wave 1 varies; five overlapping shields span each unchanged segment
ok: original Norse foe silhouettes and their strokes fit unchanged hit boxes
ok: identical seeds and inputs match step for step
ok: 350 seeded formations/bosses fit their wave rows; unique fates; clay at 60%, heart at 30%
ok: 34 per-level rune effect checks; excluded runes absent
ok: cold includes both flights and glove; heat splits twice; draugr rises once; need multiplies the return upgrade; exposed stone heart doubles a hit
ok: return/catch, first-hit memory, shields, bridge loss; pool sizes and identities unchanged after 10,000 steps
steady: 200 seeds; wave 4 74.0%; wins 17.5%; ended by wave 3 26.0%; longest 223.6s; 0.00103 ms/step; 2.3s wall
ends {"6:bridge":6,"7:won":35,"5:bridge":10,"3:hearts":35,"5:hearts":42,"6:hearts":14,"4:hearts":28,"4:bridge":8,"2:hearts":12,"3:bridge":3,"7:hearts":5,"2:bridge":1,"1:hearts":1}
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00096 ms/step; 2.9s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

### node tools/origin-check.mjs (exit 2)

```text
1440x900: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
1280x720: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
1024x600: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
820x1180: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
390x844: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
412x730: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
360x640: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
```

## Sizes

Unpacked modules/CSS: 504238 bytes, 156233 bytes gzip. Standalone packed: 655893 bytes, 275733 bytes gzip. Joined dist unchanged.

## Final source reread correction

The tail base now intersects the line from the actual projected face centre
to the shield, rather than assuming the edge midpoint during travelling
frames. This keeps the base centred on that line through tilt and both
moves. The correction changes only cards.mjs. Relevant checks were rerun:

### node --check cards.mjs (exit 0)

```text
```

### node tools/pack.mjs (exit 0)

```text
packed data.mjs, art.mjs, trip.mjs, depth.mjs, stars.mjs, pace.mjs, timeline.mjs, findkit.mjs, explore.mjs, steps.mjs, cards.mjs, footname.mjs, footer.mjs, findhoards.mjs, findcreatures.mjs, findsheets.mjs, hammer.mjs, findhammer.mjs, findwater.mjs, findhorn.mjs, findall.mjs, finds.mjs, main.mjs
dist/journey-map.html 641.2 KB
```

### node tools/check.mjs (exit 0)

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 15.87 KB / 30; all map modules + CSS 152.84 KB / 160
gzip: dist/journey-map.html 269.54 KB / 320
gzip: dist/journey-joined.html 487.28 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

### node tools/steps-test.mjs (exit 0)

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

### node tools/origin-check.mjs (exit 2)

```text
1440x900: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
1280x720: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
1024x600: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
820x1180: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
390x844: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
412x730: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
360x640: NOT RUN; no existing headless CDP endpoint; write allowlist forbids creating a browser profile; heights unmeasured
```


## Final integrity and sizes

SHA-256 comparison against the starting in-memory inventory:

```json
{
  "changed": [
    "art.mjs",
    "cards.mjs",
    "data.mjs",
    "dist\\journey-map.html",
    "main.mjs",
    "map.css",
    "ORIGIN-BUILD.md",
    "tools\\check.mjs",
    "tools\\finds-test.mjs",
    "tools\\layout-test.mjs",
    "tools\\motion-test.mjs",
    "tools\\origin-check.mjs",
    "tools\\steps-test.mjs",
    "trip.mjs"
  ],
  "deleted": [],
  "unlistedChanges": [],
  "reportAscii": true,
  "depthUnchanged": true,
  "joinedUnchanged": true,
  "codeBytes": 504901,
  "codeGzip": 156507,
  "packedBytes": 656556,
  "packedGzip": 276007
}
```

Only the listed allowlisted paths changed. Protected depth.mjs, hero-copy/,
reference/, assets/, joined.html and every other pre-existing build report
retain their starting hashes. No pre-existing file was deleted. The report
is ASCII. No new product copy replaced an accented character with a question
mark; the palette and timing additions contain no accented copy.

All nine required Node test programs pass. All 37 modules passed syntax
checks; the last tail-only correction also passed its syntax, card/focus
recordings, pack and sanity/budget checks. Browser origin checks remain NOT
RUN at all seven sizes. The joined pack remains deliberately unchanged.
