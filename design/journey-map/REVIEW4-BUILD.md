# Round 7 part D5 build

Motion is built; all nine tests pass and both packs ran. Temporary-copy
cleanup was rejected by automatic approval review, so that done gate is
incomplete. Details and the late-hurry constraint conflict are below.

Acceptance criteria, fixed before editing:

- Keep the D4 rest-start glides, pace score, scroll/settle, jump cover,
  instant navigation, reduced motion and P-driven frames unchanged.
- Retarget active moves with one curve carrying analytic dP/dt, ending
  at the target beat with the normal arrival velocity.
- Bound the entire curve, including extrema, to its current beat stretch.
- Search durations deterministically from the brief's minima. Check the
  screen-centre vector acceleration with 16 ms samples and five probes.
- Exercise all seven glides both ways at desktop and phone sizes, including
  reversals, hurry, repeated reversal and neighbouring go(id) navigation.
- Check pace-score continuity during the joined fall and X rush, exact
  arrival, settled frames and fresh set(P) equality. Run the new checks
  on copied old code, all existing tests, and both unmodified pack tools.

Evidence read: REVIEW4.md, MOTION.md, MOTION-BUILD.md, the named runtime
modules/tables and test tools. Applied the installed motion-playbook's
analytic speed continuity and spatial consistency guidance. This is a
targeted motion correction, not a redesign. No visual/browser check or
independent reviewer is available or claimed. RTK is unavailable on PATH;
no installation or replacement was attempted.
## Result and curve

All nine test programs pass. Both original pack tools ran successfully.
The cleanup part of the done gate is incomplete: automatic approval review
rejected deletion of .review4-old as "blocked by policy". The 37 copied
files remain there. No alternate deletion method was attempted.

stepsPlay now retargets an active move using its exact analytic dP/dt.
A normal glide contributes its constant signed P speed; the pace score
contributes the derivative of paceEase times its current PACE_PART slope;
an interrupted carry contributes the quotient-rule derivative of its own
curve. There are no frame-difference velocity estimates in the runtime.

Every replacement uses one rational quintic Hermite curve in normalized
time q=t/D. The suggested ordinary cubic could not always satisfy both the
duration floor and the bound near a stretch's end. The quintic keeps exact
start/end velocities and zero endpoint P acceleration; positive rational
weights shorten the handles without discarding velocity. The same formula
handles reversal, hurry, repeated presses and neighbouring go(id) calls.

For a glide, v1 is sign(target-P0)*(b-a)/glideSeconds(g). For a pace move,
v1=0. For a reversal, the initial velocity still points the old way, then
passes smoothly through zero and comes back.

Let d0=v0*D, d1=v1*D, r0 be room from P0 in v0's direction, and r1 be
room from the target opposite v1's direction. Zero velocities omit their
room ratio. The curve uses:

```text
w = max(1, abs(d0)/(5*r0), abs(d1)/(5*r1))
z = max(1, abs(d0)*(5*w-1)/(10*r0),
           abs(d1)*(5*w-1)/(10*r1))
h = (5*w-1)/(10*z)
weights = [1,w,z,z,w,1]
controls = [P0, P0+d0/(5*w), P0+d0*h,
            target-d1*h, target-d1/(5*w), target]
P(q) = sum(Bernstein5[i](q)*weights[i]*controls[i])
       / sum(Bernstein5[i](q)*weights[i])
```

All six controls lie inside the current stretch. Positive rational
Bernstein weights make every point a convex combination of those controls.
This bounds the entire curve, including between samples, without clamping
P or its velocity. Glide bounds are the unchanged GLIDES a/b; pace bounds
are the surrounding beats. Unit weights reduce to polynomial quintic
Hermite. Position and velocity use the same formula and its analytic
derivative. Arrival writes the exact target P and uses the existing settle.

P remains the sole progress owner. Camera, cards, marks, labels, focus and
buttons still consume P. Rest-start moves retain the original linear glide
clock or paceAt clock. Jump covers, instant go/set, scrub, scroll/settle,
reduced motion and the D1-D4 drawing/input modules were not reworked.

## Duration search and final STEPS.carry

| Field | Final value | Meaning |
| --- | ---: | --- |
| min | 0.35 | Ordinary interruption minimum seconds |
| hurryMin | 0.45 | Next-to-own-target hurry minimum seconds |
| acceleration | 1.2 | Ordinary centre acceleration, view widths/s^2 |
| hurryAcceleration | 3 | Hurry centre acceleration, view widths/s^2 |
| searchStep | 0.05 | Candidate duration increment, seconds |
| sample | 0.016 | Camera/continuity sampling interval, seconds |
| searchMax | 30 | Finite defensive search ceiling, seconds |

For ordinary presses, start at max(0.35, normal remaining duration).
For glides, the latter is glideSeconds(g)*abs(target-P0)/(b-a); for pace,
it is paceMove(P0,target).D. Test that floor, then add exactly 0.05 s per
candidate and accept the first passing candidate. This is the shortest
accepted duration on that deterministic search grid.

Only Next toward the active move's own target is the hurry. Repeated Back
and go(id) use the ordinary gate, even when selecting the current target.
Hurry candidates start at 0.45 s and must be strictly shorter than the
unpressed move's remaining duration.

Each glide candidate samples the camera at 16 ms intervals, starting with
the active curve's preceding 16 ms velocity, and continuing through two
samples beyond arrival. It uses motion-test's optical-flow formula at the
centre and four quarter points, rejects nonfinite probes, and checks the
centre vector acceleration against the applicable width-scaled limit.
The pace branch compares the cross-press analytic speed change with the
uninterrupted move's largest 16 ms speed change.

If no admissible candidate exists, the existing curve is retained.
Specifically, with less than 0.45 s left, a hurry cannot both last at least
0.45 s and arrive earlier. The 14 late-hurry guards verify retention of the
unpressed P trajectory and arrival in that contradictory case. A request
at a boundary with nonzero outward P velocity also cannot have a bounded
continuation; the same retention applies. The 30 s search ceiling is a
defensive finite limit. Every tested ordinary retarget found a candidate,
and every tested 25/50/75-percent forward hurry arrived earlier.

## Measured glide interruptions

Actual Node fake-clock runs, not rendered/browser/device measurements.
Camera velocities span 16 ms. The control clock ticks at 4 ms so the second
press can be exactly 300 ms after the first; each press starts its own
16 ms measurement phase, including the preceding frame. Arrival numbers
are rounded up to that 16 ms phase.

The requested 252 interruption runs cover all seven glides in both
directions on desktop 1440x900 and phone 390x844: Back and Next at 25/50/75
percent, Back then Next 300 ms apart at 50 percent, and both neighbouring
go(id) targets at 50 percent. Another 84 reversal runs cover 90/95/99
percent. All 336 check exact target P, the stretch bound, analytic incoming
speed through an independent tiny one-sided probe, acceleration through
settle, minimum duration, and fresh set(P) camera equality.

Acceleration is px/s^2; five-point peak is px/s. Arrival is measured from
the last press. Back-Next's total is measured from its first press.
Back includes both reversing a forward move and repeating Back while
travelling backward. Next-reverse means Next during backward travel.

| View | Press | Runs | Worst centre acceleration | Five-point peak | Arrival s | Total s |
| --- | --- | ---: | ---: | ---: | --- | --- |
| 1440x900 | Back | 63 | 1722.85 | 745.78 | 0.656-4.176 | 0.656-4.176 |
| 1440x900 | Hurry | 21 | 4307.48 | 1431.51 | 0.464-1.712 | 0.464-1.712 |
| 1440x900 | Next-reverse | 42 | 1721.94 | 749.70 | 0.768-4.176 | 0.768-4.176 |
| 1440x900 | Back-Next | 14 | 1713.46 | 759.00 | 1.152-3.296 | 1.456-3.584 |
| 1440x900 | go-back | 14 | 1722.85 | 738.43 | 1.312-2.784 | 1.312-2.784 |
| 1440x900 | go-next | 14 | 1721.94 | 749.70 | 1.312-2.496 | 1.312-2.496 |
| 390x844 | Back | 63 | 467.46 | 404.29 | 0.656-4.496 | 0.656-4.496 |
| 390x844 | Hurry | 21 | 1169.91 | 567.68 | 0.464-2.000 | 0.464-2.000 |
| 390x844 | Next-reverse | 42 | 466.51 | 342.89 | 1.216-4.448 | 1.216-4.448 |
| 390x844 | Back-Next | 14 | 467.30 | 334.41 | 1.408-4.592 | 1.696-4.896 |
| 390x844 | go-back | 14 | 467.46 | 363.08 | 1.312-4.496 | 1.312-4.496 |
| 390x844 | go-next | 14 | 466.51 | 323.39 | 1.312-3.936 | 1.312-3.936 |

Ordinary acceleration limits are 1728 desktop and 468 phone. Hurry limits
are 4320 desktop and 1170 phone. The worst ordinary results are 1722.85
and 467.46; the worst hurries are 4307.48 and 1169.91, respectively.
All gates passed. These gates do not impose a separate hurry speed cap;
the five-point peaks are recorded, not substituted for acceleration.

The original 28 rest-start glide checks still pass unchanged: onset by
32 ms, one broad five-point speed hill, original speed/acceleration/card
windows, durations 2.608-4.208 s, and reversible same-P camera. Their worst
centre accelerations remain 804.11 desktop and 347.07 phone.

## Pace-score interruptions

Back during joined leave at 400 ms, joined fall at 1600 ms, and X rush
at 1280 ms passes on both desktop and phone. These P-only measurements
are identical at both view sizes. The derivative is carried analytically;
the outgoing value below is an independent 0.0001 ms one-sided probe.

| Press | Incoming P/s | Outgoing P/s probe | Cross-frame change P/s | Unpressed maximum P/s | Arrival s |
| --- | ---: | ---: | ---: | ---: | ---: |
| Joined leave Back | 121.481481 | 121.481487 | 2.954143 | 45.843915 | 0.352 |
| Joined fall Back | 46.857143 | 46.857145 | 0.472015 | 45.843915 | 0.944 |
| X rush Back | 28.348348 | 28.348350 | 0.306336 | 21.554523 | 0.720 |

Each reversal first continues in its incoming direction, turns without
crossing a beat, arrives at the exact target and stays settled. Camera
acceleration is not the pace-score measure specified by the brief.

## Checks against the old code

Before editing, copied all top-level runtime modules, map.css and tool
modules into .review4-old inside design/journey-map. Only the two updated
test files were then copied into its tools directory. The old steps.mjs
and trip.mjs hashes were verified against the starting inventory; its
runtime and old STEPS data were never patched for this comparison.

Running the final motion-test against that copy exits 1 and reports
"D5 FAIL 770 checks" / "770 D5 carry checks failed". The failures include
lost incoming velocity, excessive acceleration, the old hurry's 0.304 s
sampled duration below the new floor, and changed late-hurry trajectories.
Worst old acceleration: 423748.96 desktop and 260918.50 phone across the
Back/repeated-press cases; old forward hurries reach 413930.68 desktop and
241881.85 phone. All 28 old rest-start glide checks still pass.

The final steps-test against the old copy exits 1. All six desktop/phone
pace continuity runs fail, and all six lack the required slowing overshoot.
Old outgoing analytic velocity is zero (the tiny probes are approximately
-0.000061/-0.000016/-0.000014 P/s for leave/fall/rush). Its cross-frame
changes are 131.200000, 49.466931 and 30.366320 P/s, exceeding uninterrupted
maxima 45.843915, 45.843915 and 21.554523 P/s.

The copied files remain only because cleanup was rejected as described
above; removal before finish is the one unmet filesystem done condition.

## Existing assertions, scope and packs

Replaced motion-test's old hurry-within-400-ms fixture, which depended on
the old 0.3 s cap, with the new speed-continuous, acceleration-gated and
earlier-than-unpressed rule. The 0.45 s floor now applies. All original
normal-glide assertions remain. steps-test adds continuity and arrival
checks without weakening existing scroll, card, focus, X or reduced-motion
assertions.

No digest was re-recorded: trip.mjs did not need a helper or any edit.
finds-test's existing LF-normalized trip digest 756308495 and depth digest
3982895838 still pass. check.mjs already accepts positive numeric nested
STEPS tables and needed no new rule.

SHA-256 comparison with the starting 121-file inventory found only these
six existing files changed: steps.mjs, data.mjs, tools/motion-test.mjs,
tools/steps-test.mjs, dist/journey-map.html and dist/journey-joined.html.
REVIEW4-BUILD.md is new. joined.html was regenerated and is byte-identical.
Apart from the explicitly allowed old-code copies, no unlisted file was
created, changed or deleted. data.mjs outside the STEPS table is exactly
equal to the starting copy. Its entire non-ASCII character sequence is
unchanged, including the accented Norse names.

The protected footer, stars, nova-test, cards, join, main, hammer, finds,
pace, art, CSS, index, hero-copy, reference, assets and every existing
Markdown file retain their starting hashes. The earlier D4 report's label
failures are historical: the current baseline and final check both pass.
No label assertion or geometry was changed here.

Both unmodified pack tools completed:

- node tools/pack.mjs: dist/journey-map.html 610.9 KB.
- node tools/pack-joined.mjs: joined.html written;
  dist/journey-joined.html 1150.3 KB.

The post-pack check passes. Gzip sizes: map modules/CSS 143.12/150 KB,
standalone 259.67/320 KB, joined 479.94/540 KB, hammer 15.87/30 KB.

Left out: impossible late-hurry speedups, infeasible retargets under the
explicit bound/search conditions above, and deletion of the old-code
folder after automatic approval review rejected it. No specified 25/50/75
percent glide or pace-score check was omitted. Browser/visual checks,
audit-capture.mjs, screenshots, device performance measurements, servers,
reviewer agents and sub-agents were omitted under the user's restrictions.
No git, installation or network operation ran. RTK was not on PATH and
was left out; no replacement was installed.

## Each test's exact last output line

All nine test programs pass. audit-capture.mjs is a browser capture utility,
not a Node-only test, and was not executed.

| Program | Result | Last output line |
| --- | --- | --- |
| tools/check.mjs | PASS | `ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid` |
| tools/motion-test.mjs | PASS | `ok: 28 rest glides, 336 carry runs and 14 late-hurry guards; 16 ms acceleration/five probes, analytic continuity, bounded reversals through 99 percent, exact settled arrivals, faster feasible hurry and fresh set(P) equality` |
| tools/steps-test.mjs | PASS | `ok: X frame/phone box clear controls; rush through settle hides stepper and restores main focus` |
| tools/depth-test.mjs | PASS | `ok: gather endpoints and continuous ring tangent for 32 arrival angles; explore restores depth fade` |
| tools/finds-test.mjs | PASS | `ok: actual timeline Home and End handlers select first and last stops` |
| tools/hammer-test.mjs | PASS | `ok: 200-seed balance bounds, finite runs and <20-minute termination` |
| tools/explore-test.mjs | PASS | `ok: D3 real findsBuild horn/chest/beacon pinches at 0/30/100 ms preserve found/stage and zoom >=20%; taps act once, chest hold repeats, owned drags aim/wipe/turn and press drags pan` |
| tools/layout-test.mjs | PASS | `ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads` |
| tools/nova-test.mjs | PASS | `ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged` |
