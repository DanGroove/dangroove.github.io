# Round 7 part D5: a move that starts while the journey is moving

Read this whole file before you change anything. Then read the files in section 5.

Parts D1 to D4 stay as they are; do not undo or rework them. This part changes one thing, found by the two reviewers on version 11: what happens when a move starts while P is already moving. The reviewers' other finding (the X's look changing in one frame as the build-up starts) is being fixed separately in `footer.mjs`; do not touch `footer.mjs`, `stars.mjs` or `tools/nova-test.mjs`.

## 1. The defect

Dan asked for moves between stops that are "slower and smoother". Part D4 made every move one slow glide, but a press during a glide still jolts the camera. Measured on version 11, desktop 1440 x 900, fake clock:

- **Back during a glide.** At HMC press Next, then Back 1.28 s later. The camera moves +9.16, +3.57 px per 16 ms frame in the frame before Back and -9.16, -3.57 px in the frame after: a reversal of about 1,180 px/s in one frame, about 74,000 px/s squared, against motion-test's own gate of 1.2 view widths per second squared (1,728 px/s squared at 1440 wide).
- **Next again during a glide (the hurry).** Pressed at the same point, the camera jumps from 9 to 213 px per frame in one frame (23 times faster), then swerves through the trail's bend in three frames.

**Cause.** Inside a glide stretch, P is linear in time (`stepsFrame` in steps.mjs, `fraction = q`), and the ease lives in the P-to-camera mapping (`glideState` in trip.mjs). `stepsPlay` builds every new move from the current P as if P were at rest: a new linear glide for Back (the camera runs the same curve backward at the speed it already had), or the hurry's ease-out cubic over at most `STEPS.hurry` (0.3 s), whose first frame runs at three times its mean speed. Moves on the pace score (the hero's leave and the fall, the X's acts) restart the same way.

## 2. The change: a move that starts while moving carries its speed

When a move starts while another is moving (`SC.move` is active), the new move starts at P's current velocity and changes it smoothly:

- **One curve.** Take the active move's exact current dP/dt (from its own curve, analytically, not from frame differences) and build the new move as one smooth curve P(t) from (P now, v now) to (P target, v end) over a duration D. A cubic Hermite in t is the suggested shape: one formula covers a reversal, a hurry and repeated presses, and every new press simply starts again from the current P and dP/dt, with no special case.
- **v end** is the P velocity a normal move arrives with at that beat: inside a glide stretch, that glide's constant P speed in the direction of travel (so the camera's arrival is the glide's own ease, exactly as in a normal glide); for a move on the pace score, 0.
- **A reversal** (Back during a forward move, or Next during a backward one) slows to a stop and comes back. Its overshoot must never take P past the end of the stretch it is in (for a glide, the stretch's `a` and `b` in trip.mjs `GLIDES`) and never across a beat.
- **Duration.** For a move toward a new target (Back, or Next while moving backward, or a neighbouring stop pressed on the mini-map or the timeline): the shortest D that is at least the normal duration of the remaining distance (for a glide, `glideSeconds(g) * |P target - P now| / (b - a)`; on the pace score, what `paceMove` would give) and at least 0.35 s, and that keeps the gates below and the overshoot rule. For **the hurry** (Next pressed again toward the move's own target): the shortest D from 0.45 s up that keeps the hurry gate; it must arrive sooner than the move would have without the press. Choose D deterministically at the press by sampling the camera on candidate durations (for example in 50 ms steps), the way motion-test measures it.
- **Unchanged:** every move that starts from rest; the far-stop jump cover (`stepsJump`, for a stop two or more beats away); the timeline scrub and `set(P)` (instant); `go(id, { instant })`; the scroll stretch between the top and the map and its settle; reduced motion; cards, marks, labels, focus and the step buttons, which keep following P.
- **P stays the single owner.** The camera, the cards and everything else stay functions of P alone, so the same P gives the same frame (Back, the timeline and a reload), as today.

**Gates** (motion-test's own measure: the screen-centre point's vector velocity and acceleration from 16 ms samples, and its five-point probes):
- A move started while moving, other than the hurry: centre acceleration at most 1.2 view widths per second squared from the frame before the press to arrival, on desktop and phone.
- The hurry: centre acceleration at most 3 view widths per second squared from the frame before the press to arrival, and it arrives sooner than the unpressed move would have.
- Every move ends exactly on its beat (P equals the beat's P) and the beat then settles as today.
- On the pace score (where the camera is not the measure, for example the hero rising on the joined page): dP/dt is continuous across the press, that is, no change of dP/dt between two 16 ms frames across the press is larger than the largest such change inside the same move when nothing is pressed.

Put the new numbers in one table in data.mjs, for example `STEPS.carry` (minimum seconds 0.35, hurry minimum 0.45, the two acceleration gates in view widths per second squared, the search step), and give the final values in your report. `STEPS.hurry` may stay for moves that start from rest, if any still use it.

## 3. Tests

Every existing test must still pass, plus:

- **motion-test**, desktop 1440 x 900 and phone 390 x 844, for every glide forward and back: press Back at 25, 50 and 75 % of the move; press Next (the hurry) at the same points; press Back then Next 0.3 s apart at 50 %; press the mini-map's neighbouring stop mid-glide (through `go(id)`, as `goStop` does). Each run samples the camera every 16 ms from before the press to arrival and applies the gates above; arrival is exact; and a mid-curve frame still equals a fresh `set(P)` at the same P. These new checks must fail on version 11's `stepsPlay` and `stepsFrame`: run them against a copy of the old code and say in the report what they reported.
- **steps-test:** Back pressed during the joined page's fall, and Back during the X's rush, keep dP/dt continuous by the rule above.
- Where an existing assertion reads something you changed on purpose (for example a hurry finishing within 0.3 s), change it to the new rule and say so in the report.
- If a test holds a digest of a file you changed (tools/finds-test.mjs locks trip.mjs's digest), re-record it and list it in the report.

## 4. Files

You may write only these, all under `design/journey-map/`: `steps.mjs`, `trip.mjs` (only to expose a helper the move builder needs), `data.mjs` (only the STEPS table), `tools/motion-test.mjs`, `tools/steps-test.mjs`, `tools/finds-test.mjs` (only a digest re-record), `tools/check.mjs` (only if a new STEPS value needs its rule), the files the two pack tools write (`joined.html`, `dist/journey-map.html`, `dist/journey-joined.html`), and your report `REVIEW4-BUILD.md` (new). Never change `footer.mjs`, `stars.mjs`, `tools/nova-test.mjs`, `cards.mjs`, `join.mjs`, `main.mjs`, `hammer.mjs`, any find module, `hero-copy/`, `reference/`, `assets/` or any other .md file.

## 5. Read first

`MOTION.md` and `MOTION-BUILD.md` (part D4), then `steps.mjs` (`stepsPlay`, `stepsFrame`, `stepsNavigate`, `stepsJump`, `stepsBack`, `stepsNext`, `stepsGo`, which the mini-map, the timeline and the stop marks call through `goStop` in main.mjs), `trip.mjs` (`GLIDES`, `glideMove`, `glideSeconds`, `glideState`, `glidePath`), `pace.mjs` (`paceMove`, `paceAt`, `paceP`), `data.mjs` (`STEPS`) and the tests in `tools/`, `motion-test.mjs` first.

## 6. Done means

All tests in `tools/` pass, both pack tools have run, and `REVIEW4-BUILD.md` says what you built (the curve, how D is chosen, how the overshoot is bounded), the final `STEPS.carry` numbers, the worst measured centre acceleration and the arrival times for each kind of press on desktop and phone, what the new checks reported against version 11's code, which existing assertions changed and why, what you left out and why, and each test's last line. Do not claim any visual or browser check: the review happens elsewhere in a real browser.
