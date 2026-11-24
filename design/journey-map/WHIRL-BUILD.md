# WHIRL build

2026-11-24. Implemented the balanced, continuous whirl. All nine required Node tests and all 37 syntax checks pass. Rebuilt dist/journey-map.html. The joined source is implemented and tested with hero-star fixtures, but dist/journey-joined.html was NOT rebuilt because its pack tool also writes the unlisted joined.html. That packed joined file still contains the previous build.

## Evidence and acceptance criteria

Read BRIEF.md before WHIRL.md, then the original stars, build score, footer renderer and tests, plus FLASH-BUILD.md, MOTION-BUILD.md and STEPS-BUILD.md. Used the installed motion-playbook skill. WHIRL and the user's file/operation rules take precedence over its general review advice.

The constraints carried into editing were:
- Select only existing on-screen sources at the X beat, with the same count in every one of 12 sectors and samples across each sector's full depth.
- Preserve identity from the source into its own-bearing ring approach. Never take a chord across the X.
- Keep the 3.0 s rush, kindle and four light-only throbs. Keep motion continuous, with no heartbeat steps or dt integration in the rush.
- Continue a tightening spiral, compression, heating, core growth, glow charge and tremble into the blast. Keep at least 5% arriving until its first frame.
- Preserve the original blast count, paths, reach, timing and remnant field, plus reduced motion, cards, finds, layout and navigation.

This is a motion/model verification, not a rendered design approval. No browser, pixel comparison, screenshot or device-performance check was made. The external review remains necessary. No reviewer agents or other agents were started.

## Changes and scope

- stars.mjs: split the seeded original burst identities from the new gathering membership. The new novaGatherSources planner rejects off-screen sources, balances 12 sectors, and picks one seeded source from every depth stratum. Gathering order is the stable rank of ord2, so sparse fields also have a final cohort.
- stars.mjs: novaGatherPoint is polar throughout. A quadratic inward approach meets the spiral with matching radial and angular derivatives. Inside the ring, radius follows a fractional power while angular speed rises as radius shrinks. The core's camera translation carries the entire spiral; it cannot make a star back away radially.
- stars.mjs: tails measure a fixed interval of rush time, so they follow speed. Stars stay visible until the last fraction of their approach. Non-gatherers retain their X-beat screen positions and sky coverage during the rush. Existing burst stars that did not gather still leave from inside the first flash.
- stars.mjs: the joined assignment retains enough existing real hero identities in the sky before handoff to supply otherwise empty sides. It allocates coast identities first, then sea, then trail only if needed. It does not add stars or duplicate their map destinations. The original map burst data remains on those same identities. In the sparse 240-star phone fixture, some trail destinations are therefore omitted during the trip so their real stars can stay in the sky; review that density closely. Reduced-motion drawing bypasses this reservation.
- stars.mjs: bring the sky twinkle phase to zero smoothly on the final leg, then derive it from rushT. A replay after returning to the X reproduces light as well as position. The original blast/explore release path is retained as novaReleasePoint.
- trip.mjs: changed only novaBuild and novaBuildGather and their internal calculations. Compression runs to hold=1; heat, core and glow alpha continue charging; tremble amplitude continues to the blast. Arrivals run from 82% of the rush to 100%, ordered by seeded ord2 rank, with the final 15% reaching the core at the blast. The four original throb centres and envelopes remain light only.
- data.mjs: changed NOVA only: hold, arrival timing and the source/drain/twinkle settings. STARS and DEPTH values were not changed.
- tools/nova-test.mjs: changes and additions described below.
- tools/depth-test.mjs: changes only the approach-direction fixture described below.
- tools/finds-test.mjs: three digest numbers only.
- dist/journey-map.html: generated only by node tools/pack.mjs.
- WHIRL-BUILD.md: this record.

No footer.mjs change was needed. No depth.mjs edit was made, including comments. Its SHA-256 remains 0FA0CA11A03AC830DBF148A68828EBFD1B47FA98875A48D2F433EC3C09473AC2.
The part of trip.mjs beginning with the trail geometry is unchanged after normalizing line endings. A full comparison confirms finds-test changed only the three digest numbers. All other top-level source/report files and tools retain their starting hashes. Cards, CSS, hero-copy, reference, assets, joined.html and the existing joined pack were left alone.

No git, installation, network operation, server or agent was used. RTK was unavailable (command-not-found); no replacement was installed.

## Test changes

tools/nova-test.mjs:
- Replaced only the obsolete .93 completion/zero-jitter/vanished-before-held-breath expectations with completion at the blast and continued tremble.
- Added equal sector counts for standalone 1440x900 and 390x844, plus joined fixtures with 1200 and 240 real hero stars.
- Added on-screen membership, deterministic selection and one selection from every depth stratum.
- Added the own-bearing-plus-turn ring endpoint and dense pre-ring radius checks.
- Added a radius-monotonicity check in the moving camera at every 1/60 s.
- Added the speed floor and 5% still-on-the-way checks at every 1/60 s from 1.0 s through the last pre-blast frame. The last-arrival check requires arrival within one frame of rushT=1 and all sources at the core at 1.
- Added heat/core/glow-alpha rise checks from 2.0 s through the blast, with the existing throb relaxation excluded for glow alpha, and no flat run longer than 0.1 s.
- Added actual canvas checks that visible non-gatherers stay in place and that returning to the X then replaying reproduces all recorded rush positions and light.
- Retained the existing four-throb, 16 ms alpha/lurch, reverse score, handover, camera, DPR and reduced-motion gates.

tools/depth-test.mjs:
- Its old 32-angle test assigned unrelated ring angles to one fixed source. WHIRL replaces that behavior. It now puts sources at 32 actual bearings and sets each ring direction to its own bearing plus the swirl. Endpoint and C1 tangent checks keep the same tolerances.

tools/finds-test.mjs, digest-only changes:
- [STARS, DEPTH, NOVA]: 4178723640 -> 2413750747, for NOVA changes.
- trip.mjs, LF normalized: 2259295218 -> 839897416, for the build functions.
- data.mjs, LF normalized: 3500859031 -> 352845678, because its whole-source pin also includes NOVA.
- depth.mjs remains pinned at 4010889213.

An additional in-memory comparison loaded the saved original stars module alongside the revised module, using the same current data, fake canvas, clocks and hero fixtures. At blastT 0.00001, 0.05, 0.3, 0.7 and 1, sorted recording-call SHA-256 hashes are identical for all four fixtures (20 comparisons). This checks draw commands and their alpha/colour, not rendered pixels. The complete outputs, including an initial shell-quoting invocation error, appear below.

## Final model measurements

Screen speeds are px/s, measured as screen displacement over the preceding 1/60 s. Means include only gathering stars still on their way at the sample time. The actual rush camera translation is included.

| View/source | 1.0 s | 2.0 s | 2.5 s | 2.9 s | 2.98 s |
| --- | ---: | ---: | ---: | ---: | ---: |
| 1440x900 standalone | 297.00 | 906.40 | 1088.86 | 1204.52 | 1514.22 |
| 390x844 standalone | 148.65 | 398.51 | 493.79 | 522.82 | 713.84 |
| 1440x900 joined, 1200 stars | 333.80 | 1018.17 | 1239.05 | 1245.03 | 1371.15 |
| 390x844 joined, 240 stars | 134.40 | 411.78 | 487.34 | 424.20 | 491.27 |

Sector counts, in angular order around the X:
- 1440x900 standalone: 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11 (132).
- 390x844 standalone: 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3 (36).
- 1440x900 joined: 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14 (168).
- 390x844 joined: 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 (12).

The minimum mean speed from 1.0 s to the last pre-blast frame equals its 1.0 s value in every fixture. Minimum on-way populations are respectively 18.18%, 19.44%, 17.86% and 16.67%. Every last arrival is 3.000000 s. The smaller joined fixture remains sparse rather than inventing extra stars.

Final nova-test model output:

```text
WHIRL 1440x900 standalone: sectors 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11; 132 gathering
WHIRL 1440x900 standalone 1.00s: 297.00 px/s, 132/132 on way
WHIRL 1440x900 standalone 2.00s: 906.40 px/s, 132/132 on way
WHIRL 1440x900 standalone 2.50s: 1088.86 px/s, 123/132 on way
WHIRL 1440x900 standalone 2.90s: 1204.52 px/s, 41/132 on way
WHIRL 1440x900 standalone 2.98s: 1514.22 px/s, 24/132 on way
WHIRL 1440x900 standalone: minimum 297.00 px/s vs 297.00 at 1s; minimum on way 18.18%; last 3.000000s
WHIRL 390x844 standalone: sectors 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3; 36 gathering
WHIRL 390x844 standalone 1.00s: 148.65 px/s, 36/36 on way
WHIRL 390x844 standalone 2.00s: 398.51 px/s, 36/36 on way
WHIRL 390x844 standalone 2.50s: 493.79 px/s, 33/36 on way
WHIRL 390x844 standalone 2.90s: 522.82 px/s, 11/36 on way
WHIRL 390x844 standalone 2.98s: 713.84 px/s, 7/36 on way
WHIRL 390x844 standalone: minimum 148.65 px/s vs 148.65 at 1s; minimum on way 19.44%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL 1440x900 joined 1.00s: 333.80 px/s, 168/168 on way
WHIRL 1440x900 joined 2.00s: 1018.17 px/s, 168/168 on way
WHIRL 1440x900 joined 2.50s: 1239.05 px/s, 157/168 on way
WHIRL 1440x900 joined 2.90s: 1245.03 px/s, 52/168 on way
WHIRL 1440x900 joined 2.98s: 1371.15 px/s, 31/168 on way
WHIRL 1440x900 joined: minimum 333.80 px/s vs 333.80 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 390x844 joined 240: sectors 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1; 12 gathering
WHIRL 390x844 joined 1.00s: 134.40 px/s, 12/12 on way
WHIRL 390x844 joined 2.00s: 411.78 px/s, 12/12 on way
WHIRL 390x844 joined 2.50s: 487.34 px/s, 11/12 on way
WHIRL 390x844 joined 2.90s: 424.20 px/s, 4/12 on way
WHIRL 390x844 joined 2.98s: 491.27 px/s, 2/12 on way
WHIRL 390x844 joined: minimum 134.40 px/s vs 134.40 at 1s; minimum on way 16.67%; last 3.000000s
```

## Sizes and pack limitation

- All 24 runtime modules plus map.css: 512169 bytes (500.17 KB) unpacked; 154.90 KB gzip, within 160 KB.
- Rebuilt standalone: 663794 bytes (648.24 KB) unpacked; 271.62 KB gzip, within 320 KB.
- Hammer bundle remains 15.87 KB gzip, within 30 KB.
- Existing joined pack: 1208518 bytes; 489.53 KB gzip, within 540 KB. This is the PREVIOUS pack, not a WHIRL delivery.

Left out: node tools/pack-joined.mjs. Its code unconditionally writes joined.html before dist/journey-joined.html. WHIRL's Rules allow the latter but not the former. The packer itself is also outside the allowed edits. I did not run it, intercept its writes, restore an unlisted file after writing it, or modify the tool. The current dist/journey-joined.html is stale. Joined runtime behavior is covered by source fixtures, not by a newly packed joined artifact.

No browser/visual gate is claimed. No independent critique was run because agents are prohibited. The authorized report is the project record for this narrowly scoped motion revision.

## External review focus

- Read the gather at normal speed on desktop and phone: 360-degree sources, an inward whirl through the last half-second, and no perceived pause before the first flash.
- Compare the unchanged blast and remnant against the prior build. The source recording hashes agree, but pixel appearance was not checked.
- Inspect low-count joined phones: limited source count and retained sky identities can thin some trail destinations. Coast and sea identities are preferred to minimize this.
- Check the hero handoff, returning to the hero, Back to the X, direct scrubbing, repeated replays and resize in the real joined page.
- Confirm late tails, light-only throbs, compression and tremble feel continuous rather than noisy at device frame rates.

## Test run outputs

Before editing, all nine required tests passed. The baseline's final output line per test is recorded here; subsequent implementation and verification invocations are reproduced in full below. The initial check reported 152.84 KB gzip for runtime/CSS, 269.54 KB for the standalone pack and 489.53 KB for the existing joined pack.

### Baseline: node tools/check.mjs (PASS)

```text
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

### Baseline: node tools/steps-test.mjs (PASS)

```text
ok: X frame/phone box clear controls; rush through settle hides stepper and restores main focus
```

### Baseline: node tools/nova-test.mjs (PASS)

```text
ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged
```

### Baseline: node tools/depth-test.mjs (PASS)

```text
ok: gather endpoints and continuous ring tangent for 32 arrival angles; explore restores depth fade
```

### Baseline: node tools/layout-test.mjs (PASS)

```text
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

### Baseline: node tools/explore-test.mjs (PASS)

```text
ok: D3 real findsBuild horn/chest/beacon pinches at 0/30/100 ms preserve found/stage and zoom >=20%; taps act once, chest hold repeats, owned drags aim/wipe/turn and press drags pan
```

### Baseline: node tools/finds-test.mjs (PASS)

```text
ok: actual timeline Home and End handlers select first and last stops
```

### Baseline: node tools/motion-test.mjs (PASS)

```text
ok: 28 rest glides, 336 carry runs and 14 late-hurry guards; 16 ms acceleration/five probes, analytic continuity, bounded reversals through 99 percent, exact settled arrivals, faster feasible hurry and fresh set(P) equality
```

### Baseline: node tools/hammer-test.mjs (PASS)

```text
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

The intermediate failures below were development checks, not suppressed release failures:
- The first retained test still required jitter to stop at .93.
- The first sector implementation exposed the existing zero-sky joined phone; a depth-stratum boundary could also select an identity twice.
- The next model run exposed a sparse-field last-arrival gap and the obsolete arbitrary-direction tangent fixture.
- A diagnostic shell invocation had a quoting error and was corrected using stdin.
- The added radial check exposed the rush camera's translation changing a star's radius; the complete spiral now translates with the core.
All required final tests pass.

### Run 1: First implementation: node tools/nova-test.mjs

Exit code: 1.

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is omitted in reduced motion
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: Expected values to be strictly deep-equal:
+ actual - expected

  [
+   -0.55770458671159,
+   1.330436448852014
-   0,
-   0
  ]

    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/nova-test.mjs:115:110
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMessage: true,
  code: 'ERR_ASSERTION',
  actual: [ -0.55770458671159, 1.330436448852014 ],
  expected: [ 0, 0 ],
  operator: 'deepStrictEqual',
  diff: 'simple'
}

Node.js v26.7.0
```

### Run 2: WHIRL model tests, first run

Exit code: 1.

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is omitted in reduced motion
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 11, 11, 11, 10, 11, 11, 11, 11, 11, 11, 11, 11; 131 gathering
WHIRL 1440x900 standalone 1.00s: 312.02 px/s, 131/131 on way
WHIRL 1440x900 standalone 2.00s: 1075.79 px/s, 131/131 on way
WHIRL 1440x900 standalone 2.50s: 2800.69 px/s, 120/131 on way
WHIRL 1440x900 standalone 2.90s: 5640.71 px/s, 35/131 on way
WHIRL 1440x900 standalone 2.98s: 9482.11 px/s, 16/131 on way
WHIRL 1440x900 standalone: minimum 312.02 px/s vs 312.02 at 1s; minimum on way 12.21%; last 3.000000s
WHIRL 390x844 standalone: sectors 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3; 36 gathering
WHIRL 390x844 standalone 1.00s: 155.24 px/s, 36/36 on way
WHIRL 390x844 standalone 2.00s: 441.61 px/s, 36/36 on way
WHIRL 390x844 standalone 2.50s: 1071.36 px/s, 34/36 on way
WHIRL 390x844 standalone 2.90s: 2125.03 px/s, 13/36 on way
WHIRL 390x844 standalone 2.98s: 5768.77 px/s, 7/36 on way
WHIRL 390x844 standalone: minimum 155.24 px/s vs 155.24 at 1s; minimum on way 16.67%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1; 12 gathering
WHIRL 1440x900 joined 1.00s: 370.08 px/s, 12/12 on way
WHIRL 1440x900 joined 2.00s: 1521.08 px/s, 12/12 on way
WHIRL 1440x900 joined 2.50s: 5579.40 px/s, 11/12 on way
WHIRL 1440x900 joined 2.90s: 12806.01 px/s, 4/12 on way
WHIRL 1440x900 joined 2.98s: 12895.89 px/s, 2/12 on way
WHIRL 1440x900 joined: minimum 370.08 px/s vs 370.08 at 1s; minimum on way 16.67%; last 3.000000s
WHIRL 390x844 joined 240: sectors 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0; 0 gathering
node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: a visible source in every sector is required
    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/nova-test.mjs:203:10
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: false,
  expected: true,
  operator: '==',
  diff: 'simple'
}

Node.js v26.7.0
```

### Run 3: Balanced reserve and drain: nova-test and depth-test

Exit code: 1.

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is omitted in reduced motion
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11; 132 gathering
WHIRL 1440x900 standalone 1.00s: 305.12 px/s, 132/132 on way
WHIRL 1440x900 standalone 2.00s: 987.85 px/s, 132/132 on way
WHIRL 1440x900 standalone 2.50s: 1128.49 px/s, 120/132 on way
WHIRL 1440x900 standalone 2.90s: 1252.79 px/s, 38/132 on way
WHIRL 1440x900 standalone 2.98s: 1390.08 px/s, 20/132 on way
WHIRL 1440x900 standalone: minimum 305.12 px/s vs 305.12 at 1s; minimum on way 15.15%; last 3.000000s
WHIRL 390x844 standalone: sectors 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3; 36 gathering
WHIRL 390x844 standalone 1.00s: 145.63 px/s, 36/36 on way
WHIRL 390x844 standalone 2.00s: 375.50 px/s, 36/36 on way
WHIRL 390x844 standalone 2.50s: 468.30 px/s, 35/36 on way
WHIRL 390x844 standalone 2.90s: 396.75 px/s, 13/36 on way
WHIRL 390x844 standalone 2.98s: 575.03 px/s, 9/36 on way
WHIRL 390x844 standalone: minimum 145.63 px/s vs 145.63 at 1s; minimum on way 25.00%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL 1440x900 joined 1.00s: 346.41 px/s, 168/168 on way
WHIRL 1440x900 joined 2.00s: 1060.93 px/s, 168/168 on way
WHIRL 1440x900 joined 2.50s: 1297.61 px/s, 152/168 on way
WHIRL 1440x900 joined 2.90s: 1292.42 px/s, 47/168 on way
WHIRL 1440x900 joined 2.98s: 1453.93 px/s, 27/168 on way
WHIRL 1440x900 joined: minimum 346.41 px/s vs 346.41 at 1s; minimum on way 16.07%; last 3.000000s
WHIRL 390x844 joined 240: sectors 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1; 12 gathering
node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: mean speed falls below 1 s: 2.95s NaN < 143.17835599691927
    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/nova-test.mjs:218:170
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: false,
  expected: true,
  operator: '==',
  diff: 'simple'
}

Node.js v26.7.0
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
file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/depth-test.mjs:7
const depthAssert = (condition, message) => { if (!condition) throw new Error(message); };
                                                                    ^

Error: gather has a corner at ring
    at depthAssert (file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/depth-test.mjs:7:69)
    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/depth-test.mjs:117:5
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)

Node.js v26.7.0
```

### Run 4: Ranked seeded arrivals and own-bearing tangent fixture: nova-test and depth-test

Exit code: 0.

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is omitted in reduced motion
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11; 132 gathering
WHIRL 1440x900 standalone 1.00s: 297.73 px/s, 132/132 on way
WHIRL 1440x900 standalone 2.00s: 971.27 px/s, 132/132 on way
WHIRL 1440x900 standalone 2.50s: 1122.05 px/s, 123/132 on way
WHIRL 1440x900 standalone 2.90s: 1233.77 px/s, 41/132 on way
WHIRL 1440x900 standalone 2.98s: 1589.25 px/s, 24/132 on way
WHIRL 1440x900 standalone: minimum 297.73 px/s vs 297.73 at 1s; minimum on way 18.18%; last 3.000000s
WHIRL 390x844 standalone: sectors 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3; 36 gathering
WHIRL 390x844 standalone 1.00s: 150.33 px/s, 36/36 on way
WHIRL 390x844 standalone 2.00s: 384.90 px/s, 36/36 on way
WHIRL 390x844 standalone 2.50s: 457.41 px/s, 33/36 on way
WHIRL 390x844 standalone 2.90s: 427.58 px/s, 11/36 on way
WHIRL 390x844 standalone 2.98s: 576.77 px/s, 7/36 on way
WHIRL 390x844 standalone: minimum 150.33 px/s vs 150.33 at 1s; minimum on way 19.44%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL 1440x900 joined 1.00s: 337.60 px/s, 168/168 on way
WHIRL 1440x900 joined 2.00s: 1041.46 px/s, 168/168 on way
WHIRL 1440x900 joined 2.50s: 1283.45 px/s, 157/168 on way
WHIRL 1440x900 joined 2.90s: 1272.33 px/s, 52/168 on way
WHIRL 1440x900 joined 2.98s: 1445.17 px/s, 31/168 on way
WHIRL 1440x900 joined: minimum 337.60 px/s vs 337.60 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 390x844 joined 240: sectors 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1; 12 gathering
WHIRL 390x844 joined 1.00s: 135.63 px/s, 12/12 on way
WHIRL 390x844 joined 2.00s: 374.37 px/s, 12/12 on way
WHIRL 390x844 joined 2.50s: 416.35 px/s, 11/12 on way
WHIRL 390x844 joined 2.90s: 461.21 px/s, 4/12 on way
WHIRL 390x844 joined 2.98s: 571.18 px/s, 2/12 on way
WHIRL 390x844 joined: minimum 135.63 px/s vs 135.63 at 1s; minimum on way 16.67%; last 3.000000s
ok: WHIRL balanced visible sectors, own-side ring approach, continuous drain through last frame, speed/5%/last-arrival gates and rising late heat/core/glow alpha
ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged
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

### Run 5: Original versus revised burst recording at five blast frames in four view/source fixtures

Exit code: 1.

```text
file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/[eval1]:4
const old=await import('data:text/javascript;base64,'+Buffer.from(process.env.WHIRL_ORIGINAL.replaceAll(from
                                                                                                        ^^^^

SyntaxError: missing ) after argument list
    at compileSourceTextModule (node:internal/modules/esm/utils:355:16)
    at ModuleLoader.createModuleWrap (node:internal/modules/esm/loader:212:12)
    at ModuleLoader.eval (node:internal/modules/esm/loader:250:23)
    at node:internal/process/execution:79:24
    at asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:11)
    at Object.runEntryPointWithESMLoader (node:internal/modules/run_main:123:19)
    at evalModuleEntryPoint (node:internal/process/execution:78:47)
    at node:internal/main/eval_string:37:3

Node.js v26.7.0
```

### Run 6: Original versus revised burst recording, corrected stdin invocation

Exit code: 0.

```text
1440 900 0 ["27052392fb236933fe1a2d4b6429c609aeec3fd29654169e62412a7015165113","66184b708ca763d160f971f860897d5cdc60399678c5f99eef6f7721ad4bef0b","b85dc5012a5553a1da952b4cda894d9d5ef0786f2634617ee3a4301d3459d7bb","844224a4f1a4b06f1b1a264b29170cc9daf5838ca8375cc067483e22b983f319","55e8947eb0faacf0a67441addd2a3ebd9c471549182f7bf0c682ba411e40168c"] IDENTICAL
390 844 0 ["87ae9a43c39a73fe8d68ea5594718cce93665ceb55ac00324f28179da641867c","37b13c3d3d0ce8536b25c41474f02412522dc9045c52d6d7d8c86fcd60581fd6","f77070ace8e07ce8ceb69ed56395abf5f6cf965013ba4bebf98c983d24f4b082","8078d454913592aae77d8f35f0c9664e471531309aead3166efed6325bc16e6f","016d75fd477de0e88226aa31af9e29fe440cdd1141578071aa487ebb3f0878a7"] IDENTICAL
1440 900 1200 ["c828c07c8b0efb4ac50d81359045cedf1c35b604b5ca5e957fca57dfe3a10401","c0372c0122016ce7c8d6539dcf81a3308477f228ccd573c9119fc90dddb287b6","10ce2f23bc94cd1e09b08de4db944cd4fe04e1463a24697f79f13e444aac3e17","14a37d7a6d82026af132ecd675535a7c457f6ff4a8654b55e44a36627f845339","4a6bd4c00752966cae6017f019d01753924b567fee24111888fef7db19428773"] IDENTICAL
390 844 240 ["3a02f5bc723436293a591e55b112e4668111c0eebd43b4108c64f9a21bf135da","b663725fc6d2a150e04bc3f27b2d074a105ffbe175f7d5e714b5289a2dd60adb","b8005b03ffe957bef1822e4683c5823d000a794a5c86bd409339865371fc17e9","7d2f936fba3cff8c5206af82cc5a9350fda866e3e57fcf02cdc35d1de83d24c7","0b8b1155de4d0034df5532b31d5366451128d8e310e489a81f5c47a8bff93eb7"] IDENTICAL
```

### Run 7: WHIRL replay, full-depth sampling and stationary survivors

Exit code: 1.

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is omitted in reduced motion
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11; 132 gathering
node:internal/modules/run_main:107
    triggerUncaughtException(
    ^

AssertionError [ERR_ASSERTION]: radius must never travel backwards
    at file:///C:/Users/Admin/Documents/Portfolio/journey-map/design/journey-map/tools/nova-test.mjs:226:255
    at ModuleJob.run (node:internal/modules/esm/module_job:569:25)
    at async node:internal/modules/esm/loader:650:26
    at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5) {
  generatedMessage: false,
  code: 'ERR_ASSERTION',
  actual: false,
  expected: true,
  operator: '==',
  diff: 'simple'
}

Node.js v26.7.0
```

### Run 8: Source-centred drain follows camera translation without radial reversal

Exit code: 0.

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is omitted in reduced motion
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11; 132 gathering
WHIRL 1440x900 standalone 1.00s: 297.00 px/s, 132/132 on way
WHIRL 1440x900 standalone 2.00s: 906.40 px/s, 132/132 on way
WHIRL 1440x900 standalone 2.50s: 1088.86 px/s, 123/132 on way
WHIRL 1440x900 standalone 2.90s: 1204.52 px/s, 41/132 on way
WHIRL 1440x900 standalone 2.98s: 1514.22 px/s, 24/132 on way
WHIRL 1440x900 standalone: minimum 297.00 px/s vs 297.00 at 1s; minimum on way 18.18%; last 3.000000s
WHIRL 390x844 standalone: sectors 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3; 36 gathering
WHIRL 390x844 standalone 1.00s: 148.65 px/s, 36/36 on way
WHIRL 390x844 standalone 2.00s: 398.51 px/s, 36/36 on way
WHIRL 390x844 standalone 2.50s: 493.79 px/s, 33/36 on way
WHIRL 390x844 standalone 2.90s: 522.82 px/s, 11/36 on way
WHIRL 390x844 standalone 2.98s: 713.84 px/s, 7/36 on way
WHIRL 390x844 standalone: minimum 148.65 px/s vs 148.65 at 1s; minimum on way 19.44%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL 1440x900 joined 1.00s: 334.50 px/s, 168/168 on way
WHIRL 1440x900 joined 2.00s: 1019.43 px/s, 168/168 on way
WHIRL 1440x900 joined 2.50s: 1235.81 px/s, 157/168 on way
WHIRL 1440x900 joined 2.90s: 1246.34 px/s, 52/168 on way
WHIRL 1440x900 joined 2.98s: 1382.80 px/s, 31/168 on way
WHIRL 1440x900 joined: minimum 334.50 px/s vs 334.50 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 390x844 joined 240: sectors 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1; 12 gathering
WHIRL 390x844 joined 1.00s: 134.40 px/s, 12/12 on way
WHIRL 390x844 joined 2.00s: 411.78 px/s, 12/12 on way
WHIRL 390x844 joined 2.50s: 487.34 px/s, 11/12 on way
WHIRL 390x844 joined 2.90s: 424.20 px/s, 4/12 on way
WHIRL 390x844 joined 2.98s: 491.27 px/s, 2/12 on way
WHIRL 390x844 joined: minimum 134.40 px/s vs 134.40 at 1s; minimum on way 16.67%; last 3.000000s
ok: WHIRL balanced visible sectors, own-side ring approach, continuous drain through last frame, speed/5%/last-arrival gates and rising late heat/core/glow alpha
ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged
```

### Run 9: Final suite: node tools/check.mjs

Exit code: 0.

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 15.87 KB / 30; all map modules + CSS 154.80 KB / 160
gzip: dist/journey-map.html 269.54 KB / 320
gzip: dist/journey-joined.html 489.53 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

### Run 10: Final suite: node tools/steps-test.mjs

Exit code: 0.

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

### Run 11: Final suite: node tools/nova-test.mjs

Exit code: 0.

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is omitted in reduced motion
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11; 132 gathering
WHIRL 1440x900 standalone 1.00s: 297.00 px/s, 132/132 on way
WHIRL 1440x900 standalone 2.00s: 906.40 px/s, 132/132 on way
WHIRL 1440x900 standalone 2.50s: 1088.86 px/s, 123/132 on way
WHIRL 1440x900 standalone 2.90s: 1204.52 px/s, 41/132 on way
WHIRL 1440x900 standalone 2.98s: 1514.22 px/s, 24/132 on way
WHIRL 1440x900 standalone: minimum 297.00 px/s vs 297.00 at 1s; minimum on way 18.18%; last 3.000000s
WHIRL 390x844 standalone: sectors 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3; 36 gathering
WHIRL 390x844 standalone 1.00s: 148.65 px/s, 36/36 on way
WHIRL 390x844 standalone 2.00s: 398.51 px/s, 36/36 on way
WHIRL 390x844 standalone 2.50s: 493.79 px/s, 33/36 on way
WHIRL 390x844 standalone 2.90s: 522.82 px/s, 11/36 on way
WHIRL 390x844 standalone 2.98s: 713.84 px/s, 7/36 on way
WHIRL 390x844 standalone: minimum 148.65 px/s vs 148.65 at 1s; minimum on way 19.44%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL 1440x900 joined 1.00s: 334.50 px/s, 168/168 on way
WHIRL 1440x900 joined 2.00s: 1019.43 px/s, 168/168 on way
WHIRL 1440x900 joined 2.50s: 1235.81 px/s, 157/168 on way
WHIRL 1440x900 joined 2.90s: 1246.34 px/s, 52/168 on way
WHIRL 1440x900 joined 2.98s: 1382.80 px/s, 31/168 on way
WHIRL 1440x900 joined: minimum 334.50 px/s vs 334.50 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 390x844 joined 240: sectors 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1; 12 gathering
WHIRL 390x844 joined 1.00s: 134.40 px/s, 12/12 on way
WHIRL 390x844 joined 2.00s: 411.78 px/s, 12/12 on way
WHIRL 390x844 joined 2.50s: 487.34 px/s, 11/12 on way
WHIRL 390x844 joined 2.90s: 424.20 px/s, 4/12 on way
WHIRL 390x844 joined 2.98s: 491.27 px/s, 2/12 on way
WHIRL 390x844 joined: minimum 134.40 px/s vs 134.40 at 1s; minimum on way 16.67%; last 3.000000s
ok: WHIRL balanced visible sectors, own-side ring approach, continuous drain through last frame, speed/5%/last-arrival gates and rising late heat/core/glow alpha
ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged
```

### Run 12: Final suite: node tools/depth-test.mjs

Exit code: 0.

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

### Run 13: Final suite: node tools/layout-test.mjs

Exit code: 0.

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

### Run 14: Final suite: node tools/explore-test.mjs

Exit code: 0.

```text
ok: desktop/phone zoom limits, bounded/centred cameras, fixed zoom anchor, damped glides with no overshoot, layer/inverse round trips
ok: end-only CTA entry, input takeover, pan/release, resize, exit and immediate departure reset; P and traveller unchanged
ok: copied name curves monotone, lens/rest geometry and knock spring settling
ok: arrows pan during explore without changing P; Escape ends explore
ok: actual footer fades in linear time, is gone by 600 ms, returns over last 500 ms of exit, and stays inert while exploring
ok: capture-phase pinch on nova/stop/horn; nova taps; owned single drags; drag-only pointer clicks; key/end/depart/reset/down/500 ms suppression clearing; temporary world promotion
ok: D3 real findsBuild horn/chest/beacon pinches at 0/30/100 ms preserve found/stage and zoom >=20%; taps act once, chest hold repeats, owned drags aim/wipe/turn and press drags pan
```

### Run 15: Final suite: node tools/finds-test.mjs

Exit code: 0.

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

### Run 16: Final suite: node tools/motion-test.mjs

Exit code: 0.

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

### Run 17: Final suite: node tools/hammer-test.mjs

Exit code: 0.

```text
ok: D3 foe heights incl stroke: giants/chief 16, hunched draugr 11, low full-width wolf 8; wave 1 varies; five overlapping shields span each unchanged segment
ok: original Norse foe silhouettes and their strokes fit unchanged hit boxes
ok: identical seeds and inputs match step for step
ok: 350 seeded formations/bosses fit their wave rows; unique fates; clay at 60%, heart at 30%
ok: 34 per-level rune effect checks; excluded runes absent
ok: cold includes both flights and glove; heat splits twice; draugr rises once; need multiplies the return upgrade; exposed stone heart doubles a hit
ok: return/catch, first-hit memory, shields, bridge loss; pool sizes and identities unchanged after 10,000 steps
steady: 200 seeds; wave 4 74.0%; wins 17.5%; ended by wave 3 26.0%; longest 223.6s; 0.00092 ms/step; 2.0s wall
ends {"6:bridge":6,"7:won":35,"5:bridge":10,"3:hearts":35,"5:hearts":42,"6:hearts":14,"4:hearts":28,"4:bridge":8,"2:hearts":12,"3:bridge":3,"7:hearts":5,"2:bridge":1,"1:hearts":1}
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00105 ms/step; 3.2s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

### Run 18: Node syntax checks

Exit code: 0.

```text
PASS: node --check on all 37 top-level and tools .mjs files; hero-copy excluded.
```

### Run 19: Standalone pack

Exit code: 0.

```text
packed data.mjs, art.mjs, trip.mjs, depth.mjs, stars.mjs, pace.mjs, timeline.mjs, findkit.mjs, explore.mjs, steps.mjs, cards.mjs, footname.mjs, footer.mjs, findhoards.mjs, findcreatures.mjs, findsheets.mjs, hammer.mjs, findhammer.mjs, findwater.mjs, findhorn.mjs, findall.mjs, finds.mjs, main.mjs
dist/journey-map.html 648.0 KB
```

### Run 20: Post-pack check

Exit code: 0.

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 15.87 KB / 30; all map modules + CSS 154.80 KB / 160
gzip: dist/journey-map.html 271.52 KB / 320
gzip: dist/journey-joined.html 489.53 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

### Run 21: Final original/revised burst multiset comparison: five blast times x four fixtures

Exit code: 0.

```text
1440 900 0 ["27052392fb236933fe1a2d4b6429c609aeec3fd29654169e62412a7015165113","66184b708ca763d160f971f860897d5cdc60399678c5f99eef6f7721ad4bef0b","b85dc5012a5553a1da952b4cda894d9d5ef0786f2634617ee3a4301d3459d7bb","844224a4f1a4b06f1b1a264b29170cc9daf5838ca8375cc067483e22b983f319","55e8947eb0faacf0a67441addd2a3ebd9c471549182f7bf0c682ba411e40168c"] IDENTICAL
390 844 0 ["87ae9a43c39a73fe8d68ea5594718cce93665ceb55ac00324f28179da641867c","37b13c3d3d0ce8536b25c41474f02412522dc9045c52d6d7d8c86fcd60581fd6","f77070ace8e07ce8ceb69ed56395abf5f6cf965013ba4bebf98c983d24f4b082","8078d454913592aae77d8f35f0c9664e471531309aead3166efed6325bc16e6f","016d75fd477de0e88226aa31af9e29fe440cdd1141578071aa487ebb3f0878a7"] IDENTICAL
1440 900 1200 ["c828c07c8b0efb4ac50d81359045cedf1c35b604b5ca5e957fca57dfe3a10401","c0372c0122016ce7c8d6539dcf81a3308477f228ccd573c9119fc90dddb287b6","10ce2f23bc94cd1e09b08de4db944cd4fe04e1463a24697f79f13e444aac3e17","14a37d7a6d82026af132ecd675535a7c457f6ff4a8654b55e44a36627f845339","4a6bd4c00752966cae6017f019d01753924b567fee24111888fef7db19428773"] IDENTICAL
390 844 240 ["3a02f5bc723436293a591e55b112e4668111c0eebd43b4108c64f9a21bf135da","b663725fc6d2a150e04bc3f27b2d074a105ffbe175f7d5e714b5289a2dd60adb","b8005b03ffe957bef1822e4683c5823d000a794a5c86bd409339865371fc17e9","7d2f936fba3cff8c5206af82cc5a9350fda866e3e57fcf02cdc35d1de83d24c7","0b8b1155de4d0034df5532b31d5366451128d8e310e489a81f5c47a8bff93eb7"] IDENTICAL
```

### Run 22: Final source after coast-first sky reserve: node tools/check.mjs

Exit code: 0.

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 15.87 KB / 30; all map modules + CSS 154.90 KB / 160
gzip: dist/journey-map.html 271.52 KB / 320
gzip: dist/journey-joined.html 489.53 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

### Run 23: Final source after coast-first sky reserve: node tools/steps-test.mjs

Exit code: 0.

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

### Run 24: Final source after coast-first sky reserve: node tools/nova-test.mjs

Exit code: 0.

```text
ok: SVG X retains only rough red strokes; nova canvas follows map; native HTML hit precedes cards and is omitted in reduced motion
ok: dpr cap, original rough filter, fallback then sprite, rush/blast/settle continuous drawing, screen mapping, no still-frame SVG/button writes, clear-once rest, one-layer map fade
ok: V4-1 hand-over sprite at DPR 1/3: map X strokes and rough filter at exact scale, 1:1 device pixels in its own canvas, shown in place of the SVG X on the first rush frame, canvas X fades in under it, then it fades out; kept for Back, freed at the blast
ok: D3 3 s reversible canvas/star score; four increasing throbs >=340 ms apart (light only); stars and spikes speed up without lurches; 16 ms alpha deltas <=.08; tremble to the blast; compressed blast, anchored push/recoil and rough 3.6-width handoff at DPR 1/3
WHIRL 1440x900 standalone: sectors 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11; 132 gathering
WHIRL 1440x900 standalone 1.00s: 297.00 px/s, 132/132 on way
WHIRL 1440x900 standalone 2.00s: 906.40 px/s, 132/132 on way
WHIRL 1440x900 standalone 2.50s: 1088.86 px/s, 123/132 on way
WHIRL 1440x900 standalone 2.90s: 1204.52 px/s, 41/132 on way
WHIRL 1440x900 standalone 2.98s: 1514.22 px/s, 24/132 on way
WHIRL 1440x900 standalone: minimum 297.00 px/s vs 297.00 at 1s; minimum on way 18.18%; last 3.000000s
WHIRL 390x844 standalone: sectors 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3; 36 gathering
WHIRL 390x844 standalone 1.00s: 148.65 px/s, 36/36 on way
WHIRL 390x844 standalone 2.00s: 398.51 px/s, 36/36 on way
WHIRL 390x844 standalone 2.50s: 493.79 px/s, 33/36 on way
WHIRL 390x844 standalone 2.90s: 522.82 px/s, 11/36 on way
WHIRL 390x844 standalone 2.98s: 713.84 px/s, 7/36 on way
WHIRL 390x844 standalone: minimum 148.65 px/s vs 148.65 at 1s; minimum on way 19.44%; last 3.000000s
WHIRL 1440x900 joined 1200: sectors 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14; 168 gathering
WHIRL 1440x900 joined 1.00s: 333.80 px/s, 168/168 on way
WHIRL 1440x900 joined 2.00s: 1018.17 px/s, 168/168 on way
WHIRL 1440x900 joined 2.50s: 1239.05 px/s, 157/168 on way
WHIRL 1440x900 joined 2.90s: 1245.03 px/s, 52/168 on way
WHIRL 1440x900 joined 2.98s: 1371.15 px/s, 31/168 on way
WHIRL 1440x900 joined: minimum 333.80 px/s vs 333.80 at 1s; minimum on way 17.86%; last 3.000000s
WHIRL 390x844 joined 240: sectors 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1; 12 gathering
WHIRL 390x844 joined 1.00s: 134.40 px/s, 12/12 on way
WHIRL 390x844 joined 2.00s: 411.78 px/s, 12/12 on way
WHIRL 390x844 joined 2.50s: 487.34 px/s, 11/12 on way
WHIRL 390x844 joined 2.90s: 424.20 px/s, 4/12 on way
WHIRL 390x844 joined 2.98s: 491.27 px/s, 2/12 on way
WHIRL 390x844 joined: minimum 134.40 px/s vs 134.40 at 1s; minimum on way 16.67%; last 3.000000s
ok: WHIRL balanced visible sectors, own-side ring approach, continuous drain through last frame, speed/5%/last-arrival gates and rising late heat/core/glow alpha
ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged
```

### Run 25: Final source after coast-first sky reserve: node tools/depth-test.mjs

Exit code: 0.

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

### Run 26: Final source after coast-first sky reserve: node tools/layout-test.mjs

Exit code: 0.

```text
ok 390x844: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 360x640: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok 412x915: measured footer boxes separated by 16 px; minimal downward nova shift; one-line explore pills clear fitted title
ok: D3 360x640 entry row stays transparent through 400 ms and fades over 200 ms; no overlapping analytic frame above footer opacity .2 in the first 600 ms
ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads
ok: ORIGIN analytic pair fixtures at seven sizes: exact hold anchors, centred desktop pairs, phone rim gap/review clearance, narrowed cards and anchor-aware glide cache
```

### Run 27: Final source after coast-first sky reserve: node tools/explore-test.mjs

Exit code: 0.

```text
ok: desktop/phone zoom limits, bounded/centred cameras, fixed zoom anchor, damped glides with no overshoot, layer/inverse round trips
ok: end-only CTA entry, input takeover, pan/release, resize, exit and immediate departure reset; P and traveller unchanged
ok: copied name curves monotone, lens/rest geometry and knock spring settling
ok: arrows pan during explore without changing P; Escape ends explore
ok: actual footer fades in linear time, is gone by 600 ms, returns over last 500 ms of exit, and stays inert while exploring
ok: capture-phase pinch on nova/stop/horn; nova taps; owned single drags; drag-only pointer clicks; key/end/depart/reset/down/500 ms suppression clearing; temporary world promotion
ok: D3 real findsBuild horn/chest/beacon pinches at 0/30/100 ms preserve found/stage and zoom >=20%; taps act once, chest hold repeats, owned drags aim/wipe/turn and press drags pan
```

### Run 28: Final source after coast-first sky reserve: node tools/finds-test.mjs

Exit code: 0.

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

### Run 29: Final source after coast-first sky reserve: node tools/motion-test.mjs

Exit code: 0.

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

### Run 30: Final source after coast-first sky reserve: node tools/hammer-test.mjs

Exit code: 0.

```text
ok: D3 foe heights incl stroke: giants/chief 16, hunched draugr 11, low full-width wolf 8; wave 1 varies; five overlapping shields span each unchanged segment
ok: original Norse foe silhouettes and their strokes fit unchanged hit boxes
ok: identical seeds and inputs match step for step
ok: 350 seeded formations/bosses fit their wave rows; unique fates; clay at 60%, heart at 30%
ok: 34 per-level rune effect checks; excluded runes absent
ok: cold includes both flights and glove; heat splits twice; draugr rises once; need multiplies the return upgrade; exposed stone heart doubles a hit
ok: return/catch, first-hit memory, shields, bridge loss; pool sizes and identities unchanged after 10,000 steps
steady: 200 seeds; wave 4 74.0%; wins 17.5%; ended by wave 3 26.0%; longest 223.6s; 0.00089 ms/step; 2.0s wall
ends {"6:bridge":6,"7:won":35,"5:bridge":10,"3:hearts":35,"5:hearts":42,"6:hearts":14,"4:hearts":28,"4:bridge":8,"2:hearts":12,"3:bridge":3,"7:hearts":5,"2:bridge":1,"1:hearts":1}
idle: 200 seeds; wave 4 8.5%; wins 0.0%; ended by wave 3 91.5%; longest 216.3s; 0.00103 ms/step; 3.2s wall
ends {"2:bridge":84,"4:bridge":14,"1:bridge":60,"3:bridge":34,"5:bridge":1,"2:hearts":3,"3:hearts":2,"6:bridge":1,"4:hearts":1}
ok: 200-seed balance bounds, finite runs and <20-minute termination
```

### Run 31: Final standalone pack

Exit code: 0.

```text
packed data.mjs, art.mjs, trip.mjs, depth.mjs, stars.mjs, pace.mjs, timeline.mjs, findkit.mjs, explore.mjs, steps.mjs, cards.mjs, footname.mjs, footer.mjs, findhoards.mjs, findcreatures.mjs, findsheets.mjs, hammer.mjs, findhammer.mjs, findwater.mjs, findhorn.mjs, findall.mjs, finds.mjs, main.mjs
dist/journey-map.html 648.2 KB
```

### Run 32: Final syntax checks

Exit code: 0.

```text
PASS: node --check on all 37 top-level and tools .mjs files; hero-copy excluded.
```

### Run 33: Final source original/revised burst multiset comparison

Exit code: 0.

```text
1440 900 0 ["27052392fb236933fe1a2d4b6429c609aeec3fd29654169e62412a7015165113","66184b708ca763d160f971f860897d5cdc60399678c5f99eef6f7721ad4bef0b","b85dc5012a5553a1da952b4cda894d9d5ef0786f2634617ee3a4301d3459d7bb","844224a4f1a4b06f1b1a264b29170cc9daf5838ca8375cc067483e22b983f319","55e8947eb0faacf0a67441addd2a3ebd9c471549182f7bf0c682ba411e40168c"] IDENTICAL
390 844 0 ["87ae9a43c39a73fe8d68ea5594718cce93665ceb55ac00324f28179da641867c","37b13c3d3d0ce8536b25c41474f02412522dc9045c52d6d7d8c86fcd60581fd6","f77070ace8e07ce8ceb69ed56395abf5f6cf965013ba4bebf98c983d24f4b082","8078d454913592aae77d8f35f0c9664e471531309aead3166efed6325bc16e6f","016d75fd477de0e88226aa31af9e29fe440cdd1141578071aa487ebb3f0878a7"] IDENTICAL
1440 900 1200 ["c828c07c8b0efb4ac50d81359045cedf1c35b604b5ca5e957fca57dfe3a10401","c0372c0122016ce7c8d6539dcf81a3308477f228ccd573c9119fc90dddb287b6","10ce2f23bc94cd1e09b08de4db944cd4fe04e1463a24697f79f13e444aac3e17","14a37d7a6d82026af132ecd675535a7c457f6ff4a8654b55e44a36627f845339","4a6bd4c00752966cae6017f019d01753924b567fee24111888fef7db19428773"] IDENTICAL
390 844 240 ["3a02f5bc723436293a591e55b112e4668111c0eebd43b4108c64f9a21bf135da","b663725fc6d2a150e04bc3f27b2d074a105ffbe175f7d5e714b5289a2dd60adb","b8005b03ffe957bef1822e4683c5823d000a794a5c86bd409339865371fc17e9","7d2f936fba3cff8c5206af82cc5a9350fda866e3e57fcf02cdc35d1de83d24c7","0b8b1155de4d0034df5532b31d5366451128d8e310e489a81f5c47a8bff93eb7"] IDENTICAL
```

### Run 34: Final source post-pack check

Exit code: 0.

```text
ok: C1 tree, stars, ring/coasts/crossing, Toronto heights/order/coast, analytic tier-1 boxes, compass and card contrast
ok: D2 whole-number runes at every level; all numeric hammer copy at independent 1/2 counts
C2 analytic rest clearances coast 4.86, mark 4.31, regions 31.80 map units; hit padding, hoards group, timeline keys, early hero leave, sheet hint and hammer plurals
gzip: hammer 15.87 KB / 30; all map modules + CSS 154.90 KB / 160
gzip: dist/journey-map.html 271.62 KB / 320
gzip: dist/journey-joined.html 489.53 KB / 540
ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid
```

