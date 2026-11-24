# Polish round 2, part 2: the whirl into the blast, stars from all around

Dan's notes (verbatim):

- 2026-11-24, 3:34 AM ET: "the pause before the supernova explosion should be replaced with something, not just a static pause"
- 2026-11-24, 3:35 AM ET: "the stars still all come from above when they should come from 360"
- earlier, 2026-11-23, 5:16 AM ET: "The stars that gather into the supernova all come from above it so it looks weird"

Read `BRIEF.md` first; its rules still hold, and these matter most here: an animation always moves the object that is already there (no star appears from nowhere); the build-up's rhythm lives in light only (the four throbs swell and relax the light; nothing that travels or grows may lurch, stall or ratchet in steps); the rush is a pure function of `rushT` (Back and a scrub replay it exactly; never integrate `dt`).

## What is there now (version 14, commit aadb2f7, rush 3.0 s)

- **The pause.** The gathering stars finish their spiral into the X at about 2.3 to 2.5 s and fade out there (`stars.mjs`, `al *= 1 - smooth(.94, 1, gt)`); the arms finish compressing at `NOVA.build.hold` 0.93 (2.79 s); after that only the tremble moves (0.5 to 2 px). Measured at 1440 x 900 on a fake clock (mean frame-to-frame change of a centre crop, 0 to 255, every 48 ms): 2.0 at 2.0 s, 1.3 at 2.2 s, 0.9 at 2.4 s, 0.25 at 2.56 s, 0.11 at 2.75 s, then 0.02 to 0.05 until the blast at 3.0 s. Half a second of nearly still frames is the pause Dan sees.
- **From above.** `starsAngles` makes every map star (trail dots, sea sparkle, coast stars) and half the sky stars gather. The map lies above the X, so most of them start above it, many off the top of the screen; at 0.8 to 1.4 s the streams pour in from the top edge on desktop and phone. Each star's ring angle comes from a golden-angle shuffle (`s.ang`), not from where the star is, so many stars cross over the X to reach a ring point on its far side.

## 1. Stars come from all around

- **Their own direction.** Each gathering star's ring angle is its own bearing from the X at the rush's start (plus the swirl's turn), so it travels inward from where it is and never crosses over the X.
- **An even ring of sources.** Split the circle around the X into 12 sectors of 30 degrees. Every sector sends the same number of stars, so the gather reads as coming from every side at once. Choose them, seeded and stable, from the stars visible on screen at the rush's start (sky stars and map stars alike, spread across each sector's whole depth, not only the nearest). If a sector is short, use sky stars from that side (they cover the whole screen, behind the map, and today's gathering sky stars already fade in as they come). Stars off screen at the rush's start do not gather.
- **The ones that stay.** Stars that do not gather stay where they are through the rush and never jump: at the blast they are washed by its light and pushed by its shock ring the way non-gathering sky stars are today (`STARS.skyPush`, the ring's bump), or fade under the flash. The blast must look as it does now: the same number of stars bursting out of the X, the same reach, timing and remnant field. If that needs stars that did not gather, they leave from inside the first flash, where nobody can see them appear.
- Same on the joined page, where the stars are the hero's own (`SK.src`), and on phones.

## 2. No pause: one whirl into the blast

Replace the held stretch with the gather's last act. The gathered stars do not finish early: they keep circling the X on a tightening spiral, faster the closer they get (like water down a drain: the angle turns faster as the radius shrinks), and the last of them reaches the core on the blast's first frame. Their arrivals spread over the last part of the rush (seeded, by `ord2`), so stars keep arriving until the end instead of all at once. Their tails lengthen with their speed; the light at the core keeps rising with each arrival.

- The arms' compression and the X's light (heat, core, glow alpha, the white cross) run to the blast: `NOVA.build.hold` moves to 1.0 or its stretch is otherwise filled, so no score in `novaBuild` is flat over the last part of the rush. The tremble grows to the blast instead of stopping before it.
- Nothing travels backwards or slows to a stop before the blast. Measured from the model (positions from `novaGatherPoint` and the build score at 60 steps per second): from 1.0 s to the blast, the mean screen speed of the gathering stars that are still on their way never falls below its value at 1.0 s; at every step until the blast's first frame at least 5 % of them are still on their way.
- Keep: the rush's length (3.0 s), the four throbs (light only), the kindle, Back and a scrub replaying the rush exactly, reduced motion (no gather, as today), the phone's smaller numbers. The blast itself is unchanged.

## Checks

- All existing tests pass: `node tools/check.mjs`, `steps-test`, `nova-test`, `depth-test`, `layout-test`, `explore-test`, `finds-test`, `motion-test`, `hammer-test` (run from `design/journey-map`). Update tests only where this brief changes the behaviour they pin, and say which and why. `finds-test.mjs` digests: re-record the data digest (`[STARS, DEPTH, NOVA]`) and the `trip.mjs` digest if they change. **Never change `depth.mjs` at all, not even a comment.**
- Add to `tools/nova-test.mjs`: (a) the sector balance: at desktop and phone sizes, at the X beat, the 12 sectors' counts of gathering stars are equal (within 1); (b) no gathering star's path passes closer to the X than its ring radius before it reaches its ring point; (c) the speed rule and the 5 % rule above, every 1/60 s from 1.0 s to the blast; (d) the last arrival lands within one frame of `rushT` 1; (e) the build score's heat, core and glow alpha rise (never fall, never sit flat for more than 0.1 s) from 2.0 s to the blast, apart from the throbs' swell.

## Rules

- You may write only these files, all under `design/journey-map/`: `stars.mjs`, `trip.mjs` (the build-up functions only: `novaBuild`, `novaBuildGather` and their helpers), `data.mjs` (`NOVA` and `STARS` only), `footer.mjs` (only if the X's light needs it), `tools/nova-test.mjs`, `tools/finds-test.mjs` (digests only), any other test in `tools/` only where it pins what this brief changes, `dist/journey-map.html` and `dist/journey-joined.html` (only through `node tools/pack.mjs` and `node tools/pack-joined.mjs`), and your report `WHIRL-BUILD.md`.
- Never touch `depth.mjs`, `hero-copy/`, the cards (`cards.mjs`, the card and shield styles, `ORIGIN.md`'s work), the other briefs and build reports, or anything outside `design/journey-map/`.
- Never run git, never install anything, never use the network, never start reviewer agents or other agents. The review happens elsewhere, in a real browser.
- If a rule stops you from doing something this brief asks, leave it out and say so in your report. Do not work around a rule.
- Plain ASCII punctuation in `WHIRL-BUILD.md`.

## Report

`WHIRL-BUILD.md`: what you changed and where, each test you changed or added and why, the output of every test run, the sector counts and the speed numbers at 1.0, 2.0, 2.5, 2.9 and 2.98 s (desktop and phone), anything you left out and why, and anything the review should look at closely.
