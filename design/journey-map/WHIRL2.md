# Polish round 2, part 2b: a whole trail, and a fuller whirl on phones

Dan's note (verbatim), 2026-11-24, 3:35 AM ET: "the stars still all come from above when they should come from 360"

Read `BRIEF.md`, then `WHIRL.md` and `WHIRL-BUILD.md` (part 2, commit 5babf0c). Everything part 2 built stays: twelve balanced sectors, each star along its own bearing, the polar whirl with no chord, the light running to the blast, the blast unchanged. This part fixes one regression and thins nothing else.

## What the review found (cloud, Playwright Chromium, fake clock at 2026-11-23T17:00Z)

1. **The trail has gaps on the joined page on phones.** At 412 x 730 (Dan's phone, 278 hero stars) and 360 x 640 (213 hero stars) the dotted trail between the stops is missing many dots at every beat of the trip, from the map overview on (Laurier to HMC, HMC to Mohawk, Mohawk to Interkom, HMC again to Interkom are visibly broken). The same page packed before part 2 (commit 466d5ac) has a whole trail at both sizes. 1440 x 900 (1200 hero stars) and 390 x 844 (305) are whole. The cause is `starsReserveSky`: to give every sector sky stars it keeps hero identities in the sky and, when coast and sea run out on a side, takes trail identities, so their trail dots are left out during the trip. Dan looks at this page on his phone, so this is the first thing he would see.
2. **The whirl is thin on phones.** The per-sector count is the smallest sector's supply: 3 per sector (36 stars) on the map page at 390 x 844, 1 per sector (12) in the 240-star joined fixture. Filmed at 412 x 730 the gathering streaks are faint and few; on desktop (11 and 14 per sector) the whirl reads well.
3. Fine and to keep: the last 0.3 s before the blast now moves (mean frame-to-frame change of a centre crop 0.2 to 0.55, against 0.004 to 0.22 before); the blast frames at 3.15 s and 3.3 s are pixel-identical to before part 2.

## The fix

- **The map never loses a star it shows.** Trail dots and sea sparkle keep their hero stars on every page at every size, so in every still frame of the trip (map overview, each stop, the X beat, each find at rest) the trail and the sea look as they do in the 466d5ac pack; only the sky may differ, by the stars this part adds (at most 1 % of pixels in all). Only coast identities, which are not shown during the trip, may stay in the sky as today.
- **Where a side is still short, add faint sky stars.** When the field cannot give a sector its count from sky stars and coast identities, add new sky stars on that side. On the joined page they fade up in place during the last part of the hand-over, the way places with no hero star already fade up on small phones (`s.fade`); on the map page they are part of its sky from the start. They look like the sky's other faint stars, never pop, and do nothing until the rush. They then gather like the rest and, at the blast, leave from inside the first flash like other gathered sky stars.
- **Counts.** Every one of the 12 sectors sends the same number: 8 on phones (412 x 730, 390 x 844, 360 x 640) and 14 on desktop sizes, on both pages, with the real hero star counts of those sizes (measure them from the hero; 278, 305 and 213 on the phones, 1200 at 1440 x 900).
- **Readable on a phone.** At a device pixel ratio of 2.6 the gathering stars and their tails are as visible as on desktop: the same width and alpha in CSS pixels.
- Everything else from part 2 holds: own bearing, no chord, the speed and 5 % on-the-way rules, the last arrival on the blast's first frame, rising light, Back and a scrub replaying exactly, reduced motion, the blast and remnant unchanged.

## Checks

- All tests pass: `node tools/check.mjs`, `steps-test`, `nova-test`, `depth-test`, `layout-test`, `explore-test`, `finds-test`, `motion-test`, `hammer-test`, and `tools/origin-check.mjs` against a local headless Edge as before.
- Add to `nova-test`: on the joined fixtures with 278, 305 and 213 hero stars at the three phone sizes, every `TRAIL_DOTS` and sea destination has its own star during the trip, and every sector sends 8; at 1440 x 900 every sector sends 14. Re-record the `finds-test` digests that change, and say which.
- Measure with the browser if `tools/frame-cost.mjs` from part 3 exists: the rush at 412 x 730 with 4x CPU slowdown, before and after; the added stars must not raise its p95 frame interval by more than 2 ms.

## Rules

- You may write only these files under `design/journey-map/`: `stars.mjs`, `data.mjs` (STARS and NOVA only), the test files in `tools/`, `dist/journey-map.html`, `dist/journey-joined.html` and `joined.html` (the last three only through `node tools/pack.mjs` and `node tools/pack-joined.mjs`), and your report `WHIRL2-BUILD.md`.
- Never touch `depth.mjs` (not even a comment), `trip.mjs`, `hero-copy/`, the briefs and build reports, or anything outside `design/journey-map/`.
- Never run git, never install anything, never use the network, never start reviewer agents or other agents.
- If a rule stops you from doing something this brief asks, leave it out and say so in your report. Do not work around a rule.
- Plain ASCII punctuation in `WHIRL2-BUILD.md`.

## Report

`WHIRL2-BUILD.md`: what you changed and why; the sector counts and the number of added stars per size and page; the trail and sea check; the still-frame comparison against 466d5ac; each test you changed and why; the output of every test run; anything you left out and why; what the review should look at on a real phone.
