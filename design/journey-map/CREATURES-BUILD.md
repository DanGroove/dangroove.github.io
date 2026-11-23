# Round 7 C2 build

Status: implementation and both packs are written, but this is not an all-tests-passing build. Four test programs pass. `tools/check.mjs` and `tools/finds-test.mjs` deliberately exit 1 on the remaining raven geometry gates described below. No thresholds were relaxed to obtain a passing result.

No browser check was made. No rendered revision, pixel comparison, browser interaction, or independent review was performed. The four supplied PNGs were studied as references only. No server, network access, installation, git command, reviewer agent, or sub-agent was used.

## Evidence and acceptance criteria

Read CREATURES.md in full first, then creatures.cjs, its four PNGs, every named runtime file, and all eight files in tools/. The supplied rig and lid are the drawing authority. Shapes, poses, joint positions, tree tubes and paths were ported into data.mjs, without importing the reference at build time or runtime. The reference's warm stroke uses C.warm.

The implementation criteria were: one continuous rig per bird; retained map line styles and reference silhouettes; all limb outlines before all tree fills; visible camera-gated takeoff and landing; separate flight sides; level perched transforms; active idle poses through the reel; one queued early press per find; completed dig/rattle/open stages; a back-edge lid; persistent open-chest popup elements; no buried craft glow; stage-specific hints; and the five small review fixes. C1's findSerpent implementation, Yggdrasil, well, camera/depth sources and protected data tables were preserved.

The new checks are numeric/source/recording-DOM checks, not substitutes for browser review. Path sampling uses 20 samples per curve in check.mjs and 24 in the C2 motion checks. C2 visits use ticks no longer than 16 ms, fake clocks and microtask flushes, with no real waits.

## Section 3: camera-ready presses and overlays

- Added findReady(id), including focus id, k === 1 and completed view swap. Exploring and reduced motion are immediately ready.
- stepsFocusNow() now reports swapped. Its camera behavior was not changed.
- Ravens and individual chests retain at most one press before their gate opens. Additional early presses are dropped. Chests also retain one press during a rise, rattle, opening or bounce.
- showPop returns false for an obsolete overlay epoch and true after showing. A thought and its tally advance only on true.
- Sheet open/close sets and clears jm-sheet-open. Its CSS rule fades the find hint out.

## Section 4: Huginn and Muninn

- Replaced the stone and alternate sitting/flying drawings with the six-limb bare tree and one articulated rig per bird. Far wing, legs, body/tail, seamless head, bill/eye/item, and near wing retain the reference drawing order.
- Ported every reference pose and used mixed transforms for squash, tilt, head, wings and legs. No bird opacity swap, enlargement or flight fade remains.
- Set the required find position, view, mark, scale, perches and outward facings. Moved all six tally scratches to the specified ground area.
- Added crouch, side-specific cubic outward/return travel, off-frame range calculation from camera numbers, away time, return flaps, flare/settle, smooth mirrored turns, perch hop and item placement. The reel starts at the set-down item's screen position.
- Bird posing runs through the whole reel. The inactive bird keeps its outer transform while its body/head remain alive. landTs changes only on the bird that moved.
- Added pointer-limited heads, alternating preen tucks, outward bough hops, waking ruffles and takeoff feathers. The horn starts the two staggered loops. Reduced motion delivers immediately without flight.
- Muninn's takeoff closes Huginn's popup. An obsolete thought remains owed. Items remain while the popup or reel owns the overlay and fade after closing.

## Section 5: chests

- Added per-chest clips combining the upper half-plane and current hole ellipse, a front rim over the chest, and a dirt pile growing about its own foot.
- Dig fractions are 0.18, 0.24 and 1. Each rise starts from its displayed position and completes once. The third rise is followed by three bottom-corner rocks before opening is allowed.
- Replaced shared clods/puffs with 21 local clod slots per chest, seven per dig, behind the chest. They travel outward from the two hole rims and land outside them. No chest puffs are emitted.
- Ported the back-hinged dome, dark mouth, warm mouth line, inside face and three thin plank lines. During lid motion only the face's d changes; dome, mouth, planks and inside group use transforms. Opening peaks at 118 and rests at 110. Open-chest presses bounce without replacing an already-open popup.
- Kept the opening glow/star burst. Buried and rising chests get no craft glow. A craft selection gives buried scratches full width and one ring ping.
- Added all five stage hints, omitted a duplicate empty-piece title, changed each hit area to the required circle, and made f-hoards a labelled group without tabindex or a press handler.

## Section 6: review fixes

- Timeline Home and End select the first and last stops. The actual handlers are tested.
- main.mjs calls JOIN.leave immediately after stepsFrame. join.mjs's frame hook no longer calls place.
- The footer-name read audit first failed on a measure queued by the reveal frame before settle ended. Only after that failure was footname.mjs changed: measurement now queues at settle end, and a pointer knock uses cached geometry. The audit records 85 reads total: resize 17, fonts 17, settle end 17, and two explore boundaries 34. Idle frames and knocks read no layout.
- Sheet hints fade under jm-sheet-open.
- Hammer numeral copy has plural marks, including foes, neighbours, hearts, hail shards, times and ending blows. Eihwaz says damage; heart loss says heart/ hearts left. Only copy formatting changed in findhammer.mjs.

## Chosen values and deliberate details

All runtime drawing paths, copy, dimensions and tuned timings are in data.mjs. Reference geometry and numbers were copied unchanged unless noted here. Existing reel, popup, particle, icon and general kit tuning was retained.

- Raven hit rectangle: [-31.4, -61, 63.8, 67], providing at least 3 find units around the sampled rest drawing. Conservative stored rest bounds: [-28.4, -58, 29.4, 3].
- Popup height: 61 find units, approximately 4.5 above Muninn's neutral head. Item anchor at the bill is [10.2, -0.7]; the final bough offset is [4, -1].
- Bough hop slopes: -0.087 and -0.174. Idle breathing amplitude: 0.012, period: 2.8 s. Existing head ease 6, idle frequency 0.7 and idle amplitude share 0.43 were retained.
- Off-frame endpoint padding includes an additional 18 find units for the whole bird silhouette, beyond the required 12 map units. Minimum range remains 177. No layout read is used to choose it.
- Facing uses smoothstep interpolation over 0.12 s, with 0.1 s hysteresis; the flap pose interpolation also uses smoothstep. Its maximum facing rate is checked at 16 ms. Return flap blending uses a sine-squared weight. The two loop centre components [20.8, -12] imply radius 24.0133 from the perch because the reference centre is rounded; those supplied components were retained.
- Chest travel is 64 rather than the old 60. With the required first-dig fraction, the lid's top remains below the first hole ellipse; the second dig reveals it inside the hole. No opacity trick hides the chest.
- Back-out coefficient: 0.8. With travel 64, the largest third-rise overshoot is approximately 1.14 find units, below 1.2.
- Chest upper clip rectangle: [-240, -200, 480, 200]. Pile foot: [48, 2], with local outline x -7 to 6, clear of the largest hole's right rim.
- Clod upward speed: [28, 44], landing foot y: 2. Existing horizontal speed [18, 34], lifetime 0.6 s and spin 80 were retained in local chest units. Gravity is calculated to land each clod at that foot at the end of its lifetime.
- Existing chest glow radius 46 and eight drawn stars at y -44 with sizes [6, 4] were retained. Reference lid dimensions, mouth opacity 0.7, warm line width 1.2, and inside plank geometry were ported directly.
- Required values used unchanged include raven scale 0.62, bird scale 0.85, shy distance 4, 4 flaps/s, all specified flight/loop/turn/dip/fade times, hole radii [16, 28, 38], rise times [0.28, 0.28, 0.5], lid times 0.4/0.12/0.25, and lid angles 118/110.

## Left unfinished and why

No browser/reviewer/critique-loop work was attempted, as explicitly prohibited. No outside skill or coordination file was opened under the task's path restriction.

The following requested raven guarantees are not achieved. They remain explicit failing gates rather than being removed, weakened, or called visually acceptable:

1. At the exact required find position and scale, the sampled neutral drawing clears the coastline by 8.74351 map units. The existing 12-unit-wide coast band extends 6 units from that line, leaving 2.74351, below the required 4. Mark clearance is 4.31 and region-label clearance is 30.30, both passing. Moving the find or changing the specified rig/scale would depart from the supplied requirements, so it was not done.
2. Some flight bounding boxes overlap the bough beyond the 3-unit perch exception. One observed outbound case has feet [-17.3995, -29.5632] and box [-26.6485, -48.5255, 1.8425, -26.6281] in find units. The required early cubic climb and rig silhouette were retained instead of routing around the gate.
3. The prescribed hear-loop geometry produces an early overlap between the two birds' axis-aligned boxes. The loop centres, perches and bird scale were retained. This is a bounding-box failure; no claim of a rendered silhouette collision or clearance is made.
4. Some reference pose transitions exceed 15 percent box-area change at 16 ms even away from turns. The literal screen-area rule also conflicts with the required turn through x scale 0: projected area reaches zero, so it cannot keep a 15 percent relative bound. Smooth facing and finite transforms pass, but the area guarantee does not.

These unresolved acceptance guarantees are the things left out. No runtime feature was silently disabled to hide them. The instruction to preserve the specified geometry and not work around a rule prevents reporting this as a passing build. Resolving the conflicts requires changing an explicit geometry requirement or the associated acceptance criterion outside this build.

## Digests and preservation

No digest was re-recorded. All existing recorded baselines still pass:

- STARS/DEPTH/NOVA combined: 1195292270.
- trip.mjs source: 180365617; depth.mjs source: 3982895838.
- Sea: length 100054, hash 3547300242; fill: length 12855, hash 3665486802; coast: length 4401, hash 2408021381.

No edits were made to hero-copy/, reference/, assets/, index.html, other Markdown files, or unlisted runtime modules. Neither pack tool needed modification.

## Test and pack results

All six test programs and both pack tools were run. Passed programs were not rerun while fixing failed checks. Final last output lines:

| Program | Exit | Last output line |
| --- | --- | --- |
| tools/check.mjs | 1 | ` - raven rest drawing coast band clearance: 2.7435104607300627` |
| tools/finds-test.mjs | 1 | `FAIL: C2 raven geometry gates unmet (4)` |
| tools/depth-test.mjs | 0 | `ok: gather endpoints and continuous ring tangent for 32 arrival angles; explore restores depth fade` |
| tools/steps-test.mjs | 0 | `ok: X frame/phone box clear controls; rush through settle hides stepper and restores main focus` |
| tools/explore-test.mjs | 0 | `ok: actual footer writer sets opacity to 1 - exploreK and disables its controls while exploring` |
| tools/hammer-test.mjs | 0 | `ok: 200-seed balance bounds, finite runs and <20-minute termination` |
| tools/pack.mjs | 0 | `dist/journey-map.html 570.9 KB` |
| tools/pack-joined.mjs | 0 | `dist/journey-joined.html 1110.2 KB` |

The finds test completes the functional assertions and reports all four geometric failures at the end. It records 1266 raven ticks for each of 1440 x 900 and 390 x 844. Checks cover camera waits, one queued press, both flights and loops, both facing directions, inactive outer transforms through the whole reel, landTs ownership, cancelled thought/tally, shy hops, flight visibility, serpent/stepper clearance, chest staging, lid speed/angles, rise overshoot, third-hole width, rattle corners, craft light, hints, popup identity, reduced motion, footer reads and timeline endpoints.

## Packed files and gzip budgets

Both packers completed without modification. No standalone-packer limitation occurred. joined.html is 4157 bytes. The packed standalone is 584603 bytes (570.9 KB); the packed joined page is 1136809 bytes (1110.2 KB).

Final gzip measurements from check.mjs, in KB as reported by that tool:

- Hammer rules/find/data/drawings: 15.10 / 30.
- All map runtime modules plus CSS: 130.36 / 150.
- dist/journey-map.html: 247.20 / 320.
- dist/journey-joined.html: 467.30 / 540.

Every gzip budget passes. The overall requested all-tests-pass gate does not.
