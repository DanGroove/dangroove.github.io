# Round 7 part D3 build

Status: the four-phase rush and seven runtime/drawing fixes are built. V3-3
(section 2.6, overview label clearance) is left out because the permitted
six-map-unit translations cannot clear the existing coast. Seven test
programs pass; tools/check.mjs fails its new, unweakened D3 label gate.
The all-tests-pass requirement is therefore NOT met. Both pack tools ran.
No visual or browser check was made.

## Evidence and acceptance criteria

Read REVIEW3.md first, in full, then FLASH.md, FLASH-BUILD.md, REVIEW2.md,
REVIEW2-BUILD.md and the named source/test files. The existing D1/D2 records,
current drawings, shared analytic label geometry, actual find handlers and
recording tests supplied the implementation constraints.

- Keep the nova on canvas#nova, the stars on their existing canvas, and the
  map fade on the complete SVG. No per-frame nova/veil SVG elements.
- Preserve the journey/rest X, reduced-motion page, joined-page path,
  traveller light fade, settled nova and existing blast effects.
- Derive every rush value from rushT. Four increasing radius maxima, at
  least 340 ms apart, with soft alpha changes and a compressed pre-blast X.
- Defer only explore touch pointerdown intent through one helper. Preserve
  taps, repeat holds, owned drags, other input methods and camera pinches.
- Make moving card X controls inert and preserve useful focus after travel.
- Compare every find attribute with its live value before writing.
- Alter foe/wall drawings within existing hit/cell geometry. Preserve the
  complete simulation and its 200-seed balance results.
- Draw five irregular, ground-filled foliage masses with visible limb gaps,
  interrupted outlines and light directional hatching. Keep all tree actors.
- Check overview coast/ring clearance without moving protected geometry or
  reducing D2's text floors; retain a failure when the move limit blocks it.
- Delay the explore row until 400 ms and fade it over 200 ms.

Read the installed motion-playbook, UI routing and design-critique-loop
instructions. Applied anticipation, staging, anchored scale, smooth timing
and reversible motion principles. Their browser/render preview, CLI
discovery and independent reviewer steps were omitted under the user's
explicit restrictions. No review score or independent-review pass is claimed.
This allowed report is the only new project record.

## What was built and drawn

The rush is 3.0 seconds. novaBuild in trip.mjs is a pure score shared by the
camera, footer canvas and gathering stars. novaBuildGather gives each
existing star its deterministic position on the existing gather path.
There are no new sparks, particles, trail fuses or incoming objects.

1. Kindle, rushT 0 to .20 (0 to .60 s): the first positive rush frame gets
   a 36 px low red halo at alpha .025. A square-root onset grows it to
   104 px/.18, warming the crossing from orange while the arms remain red.
   The existing rough red X keeps its rest length and width. The hot centre
   starts small (up to 4 px), the veil begins darkening, the camera begins
   its push and the existing stars begin stirring inward. No initial .5 s
   dead ramp remains in the score.
2. Heartbeat, .20 to .76 (.60 to 2.28 s): four smooth throbs peak at
   .26/.45/.60/.72, or .78/1.35/1.80/2.16 s. Gaps are .57/.45/.36 s.
   Each rises over 80 ms and falls over 250 ms. Red glow radii peak at
   119.60/126.88/134.16/140.40 px, 15/22/29/35 percent above the 104 px
   resting envelope. Glow alpha peaks are .325/.420/.515/.620; the throb
   contributions are only .08/.11/.14/.18. Spikes ratchet to base lengths
   1.28/1.56/1.84/2.12 and kick to 1.36/1.64/1.92/2.20 times rest at the
   peaks. Centre heat steps to .3375/.525/.7125/.9000; core radius steps
   to 6.25/8.50/10.75/13 px. Existing stars lurch with each rising step,
   drifting between them. The veil darkens by .0975 per completed throb
   on desktop (.0675 on phone).
3. Draw-in, .76 to .93 (2.28 to 2.79 s): spikes retract smoothly to .60
   times rest while thickening to 1.12. The red halo contracts to 22 px,
   the centre to 9 px, and heat/core alpha reach 1. The remaining stars
   finish their paths and fade into the centre before .93. Seeded,
   interpolated jitter has a .5 to 2 screen-pixel amplitude envelope,
   bounded by vector magnitude, with short start/stop ramps. Camera push
   stops increasing at .76. No elapsed-time accumulator drives this phase.
4. Held breath, .93 to 1 (2.79 to 3.00 s): jitter is exactly zero. The
   small white cross holds length .60, thickness 1.12, 22 px red halo,
   9 px hot centre, and the darkest veil. The veil hole is .18 of the
   shorter screen side. Gathering stars have disappeared.

The veil is Ink, drawn before the nova glow with a clear round centre and
a soft transition beginning at .45 of the hole radius. Stars paint above
it on their existing canvas. Maximum veil alpha is .65 desktop/.45 phone;
its hole begins at .60 of the shorter side. Its small throb breathing
relaxes to zero during draw-in. The veil is blown away in .25 s of blast.
The existing traveller-light fade in depth.mjs is unchanged.

The camera push is 8 percent desktop/6 percent phone, with smooth onset
and stop, scaled around the X's existing screen position. Recoil removes
it with out-cubic easing in the first .40 s of blast, before settle.
The blast's spikes grow from .60 rather than rushLen 2.4; their thickness
also starts from the held state. The blast glows, rings, rays, streaks,
lobes, waves, flares, clocks and settled behavior retain their old rules.

The canvas hand-over uses the existing rasterized SVG rough sprite, with
the identical path M-12.7 0H12.7, 3.6 stroke width, round caps, rotations
45/-45, and the same turbulence/displacement filter in its original user
space. At the limit rushT=0, both canvas scales are exactly the camera
scale, length is 1, thickness is 1 and red alpha is 1. There is no sudden
thin/crisp replacement stroke. Resize still prepares the high-density
sprite in advance and keeps the D1 DPR cap of 2; the original fallback
remains if the image has not decoded. Recording checks cover DPR inputs
1 and 3. Pixel-level hand-over equivalence remains for external review.

Back and scrubbing reproduce the same recorded rush canvas and star
commands at the same rushT; hurry still traverses that same score. Reduced
motion keeps the static overview and empty nova canvas. The joined pack
uses the identical modules; main.mjs and join.mjs were not edited.

Other fixes:

- D3-1: findPointer/findPointerMove/findPointerCancel in findkit.mjs own
  the shared 120 ms touch wait. Horn, all chests, beacon, mist and wayfinder
  use it. A second pointer cancels pending actions before stage pinch
  capture. A pending horn/chest drag drops the press and becomes a pan;
  beacon/mist/wayfinder drags start immediately past the slop. Tap callbacks
  act on release without attempting pointer capture after release. Holds
  retain their existing repetition/action. Stage suppression owns the pinch/pan click; cancellation leaves the next keyboard click usable. Lifecycle cancellation also
  stops active holds/drags. Mouse, keyboard, reduced motion and ordinary
  journey pointerdown behavior keep their original path.
- D3-2: cardsFrame sets each X inert during JOURNEY.moving. If focus was
  already on that X, it transfers to the main step button before inertness.
  The test drives HMC Next, attempts an X press after 200 ms, completes
  travel and rejects focus on body or anywhere in the departed card.
- H3-2: attr compares getAttribute(k) directly with String(v). The test
  checks an external attribute change and records attribute mutations over
  2 s at a stop and 2 s of blast sampling, rejecting every same-value write.
  Its MutationObserver protocol is a Node recording fake, not a browser
  MutationObserver run. The rest of finds-test still passes.
- V3-2: with the 1.2 px stroke included, rime/fire giants and chief are
  16 px tall, the hunched draugr 11 px, and the low wolf 8 px tall by 20 px
  wide. They stay inside the unchanged 20 x 16 hit box. The original first
  seed's wave 1 has multiple drawn heights. Boss drawings are unchanged.
  Each shield segment now has five round shields at offsets
  -17.5/-8.75/0/8.75/17.5, radius 7.5: overlapping rims continue across
  the entire segment width. Existing live-cell clips remove destroyed
  pieces and prevent drawing into either opening. Cell positions, rows,
  hit tests, formation and every balance number are unchanged.
- V3-1: five asymmetric leaf-clump masses form a wider-than-tall crown
  across three principal heights. Uneven short quadratic bumps vary in
  size and direction. Each mass first paints an opaque land-colored fill,
  then its outline with an opening facing the supporting limb. All main
  limb/trunk paths paint below every mass, hiding internal wireframe lines;
  limbs remain visible in the gaps. Sparse hatching follows the direction
  from the limbs into each mass and is clipped to its foliage. The crown
  remains the island's largest drawing. Roots, trunk, well, labels, place,
  eagle, squirrel and root creature remain intact. The original conservative
  crown exclusion envelope and all fifteen well-star positions are retained;
  the new actual foliage still contains those stars and has open gaps.
- V3-4: rough-sprite hand-over as described above.
- V3-5: the explore go row has a .4 s delayed, .2 s linear CSS opacity
  entrance with backwards fill; it overrides the previous reveal animation
  while exploring. The analytic 360 x 640 test samples every millisecond
  through 600 ms against the actual footer opacity writer and a deliberately
  overlapping conservative link band. No frame shows the row over a link
  whose opacity exceeds .2.

## Final NOVA.build numbers

All configured build-up values are in this single table in data.mjs:

```text
kindle .20; draw .76; hold .93
throbs [.26, .45, .60, .72]; rise .08 s; fall .25 s
push .08; pushPhone .06; recoil .40 s
veil .65; veilPhone .45; veilOut .25 s
hole [.60, .18]; holeBreath .04
kindleGlow 36 px; kindleAlpha .025; kindleHeat .015
glow [104, 22] px; swell [.15, .22, .29, .35]
glowAlpha [.18, .44, .56]; throbAlpha [.08, .11, .14, .18]
spikeStep .28; spikeKick .08; compressed .60; thickness 1.12
heat [.15, .90, 1]; core [4, 13, 9] px
gatherKindle .04; gatherDrift .18; gatherStep .13; gatherStagger .035
jitter [.5, 2] screen px; jitterHz 24
```

STEPS.pace.rush is 3.0 s. The other new EXPLORE values are pressWait 120 ms,
rowDelay .4 s and rowFade .2 s; footerFade .5 s and slop 6 px are retained.

## Left out: V3-3 cannot fit the allowed translation

No label, stop, trail, X, find or coast was moved. Lowering text floors,
changing text geometry, changing anchors or moving the coast would be a
workaround to the six-unit label-move instruction, so none was used.

The evidence is stronger than a sampled search: a fixed coast vertex lies
inside each HMC label box after eroding that box by six units on every
side. Such a point stays inside the box under ANY translation with both
coordinates within six units, including every move of length at most six.
Therefore even zero coast clearance is impossible with the allowed move.

At 390 x 844, the existing shared analytic boxes and coast witnesses are:

| Label | Box [left, top, right, bottom] | Fixed coast point inside its six-unit inset |
| --- | --- | --- |
| HMC Connections | [457.618, 231.551, 576.860, 251.398] | [484.183, 239.414] |
| HMC, again | [377.149, 303.551, 466.382, 323.398] | [455.168, 311.376] |

At 1440 x 900 there are analogous witnesses [481.984, 242.672] and
[458.984, 314.188]. Run node tools/check.mjs --label-options for boxes,
witnesses and a bounded translation search. The ordinary check has no
exemption: it still requires every tier-1 label box to clear the coast and
the actual rest-ring geometry by two map units at both sizes. It reports
additional existing Mohawk/Interkom/Lennard clearances, as the requested
all-label gate requires. These failures are not represented as a pass.

No visual comparison, browser, screenshot, real font layout, pixel check,
device recording, server, independent reviewer or sub-agent was used.
No git, installation or network operation was run. RTK was unavailable
(command-not-found); nothing was installed to replace it.

## Verification, preserved sources and packs

All seven other test programs pass. All pre-existing check.mjs gates also
run without reported errors; its failures are the new D3 coast/ring gate.
All 34 top-level runtime/tool modules pass node --check.

Deliberately updated assertions/baselines:

- steps-test: X-to-end is now 5.9 s (3.0 + 1.6 + 1.3); the old universal
  5-second upper limit now applies to ordinary moves, with the X move
  checked against its explicit three-act duration.
- finds-test: LF-normalized trip.mjs FNV digest changes from 3574899642
  to 3050818230 for the shared rush score and anchored camera push/recoil.
- finds-test: JSON [STARS, DEPTH, NOVA] digest changes from 1195292270 to
  3076901412 solely because NOVA.build is added. Existing tables/values
  outside the added build table stay intact.
- depth.mjs digest 3982895838, sea hash 3547300242, fill hash 3665486802
  and coast hash 2408021381 still pass unchanged.

Hammer's final 200-seed outcomes match the existing baseline: steady
wave-4 reach 74.0 percent, wins 17.5 percent, idle termination by wave 3
91.5 percent. Complete end-reason distributions are unchanged. No hit or
simulation code in hammer.mjs was edited.

Both original pack tools ran successfully without modification:

- node tools/pack.mjs: dist/journey-map.html 596.4 KB
- node tools/pack-joined.mjs: dist/journey-joined.html 1135.8 KB

joined.html was regenerated and remains byte-identical to its starting
version. The final gzip budget check reports hammer 15.87/30 KB, map
modules/CSS 138.58/150 KB, standalone 255.18/320 KB, joined 475.46/540 KB.
Packed files are review candidates with the label gate still failing.

SHA-256 and non-ASCII-sequence inventories were compared with the starting
files. Changed runtime files: art.mjs, cards.mjs, data.mjs, explore.mjs,
findhoards.mjs, findhorn.mjs, findkit.mjs, findsheets.mjs (only D3-1),
findwater.mjs, footer.mjs, map.css, stars.mjs and trip.mjs. Changed tests:
check, explore-test, finds-test, hammer-test, layout-test, nova-test and
steps-test. The two changed dist outputs and this new report are allowed.
No file was removed. No existing non-ASCII source sequence changed,
including the Norse names in data.mjs. This report contains ASCII only.

hammer.mjs, findhammer.mjs, depth.mjs, steps.mjs, finds.mjs, main.mjs,
join.mjs, index.html, hero-copy/, reference/, assets/, every other Markdown
file and every unlisted module retain their starting hashes.

## Each test's exact last output line

| Program | Result | Last output line |
| --- | --- | --- |
| node tools/check.mjs | FAIL: D3 label clearance | ` - 390: D3 tier-1 stop-ring clearance Lennard -5.29` |
| node tools/nova-test.mjs | PASS | `ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged` |
| node tools/steps-test.mjs | PASS | `ok: X frame/phone box clear controls; rush through settle hides stepper and restores main focus` |
| node tools/depth-test.mjs | PASS | `ok: gather endpoints and continuous ring tangent for 32 arrival angles; explore restores depth fade` |
| node tools/finds-test.mjs | PASS | `ok: actual timeline Home and End handlers select first and last stops` |
| node tools/hammer-test.mjs | PASS | `ok: 200-seed balance bounds, finite runs and <20-minute termination` |
| node tools/explore-test.mjs | PASS | `ok: D3 real findsBuild horn/chest/beacon pinches at 0/30/100 ms preserve found/stage and zoom >=20%; taps act once, chest hold repeats, owned drags aim/wipe/turn and press drags pan` |
| node tools/layout-test.mjs | PASS | `ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads` |
