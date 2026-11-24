# Polish round 2, part 7: the fix part (E)

Dan, 2026-11-24: "does this drawing look nice or messy", "are these things intuitive?", "nothing should be looked at only in a vacuum, needs to be both". Every item below comes from the review of part 6 (`COMB-D-BUILD.md`, commit bfc6a94, with the hero copy refreshed in 5d2347b) on phones (412 x 730, 360 x 640) and on desktop (1440 x 900), or from what part 6 left open.

Read `BRIEF.md` first; its rules hold. Then `COMB-D.md` and your `COMB-D-BUILD.md`. Keep everything parts 3b to 6 did unless an item here says otherwise, in particular part 6's idle-time label placement, the sub-line fade, the batched shore stipple, the opening's first second under 16 ms, and part 5's counter, focus and review switch. Each item says what is wrong today and the result that must hold.

## 1. Names on their own drawings (D1, still open)

- **E1.** At explore's rest on phones, "Mohawk" lies on its building's flag and "HMC, again" on its pier; at 360 x 640 "HMC Connections" touches its pier's flags; on desktop "Mohawk" lies on the flag too. HMC's two sub-lines ("summers 2018 and 2020", "on contract, 2021 to 2022") never show in explore. The result that must hold is D1's: each name beside its own shield, one line, inside the frame, never cut at rest, no stroke, trail dot, coast line, coast tick or find marker inside its box grown by 2 px, and each sub-line under its name from the zoom where it fits, fading in and out. To get there you may now:
  - move a stop's own small drawing (Laurier's house, Mohawk's building and flag, the two HMC piers) up to 12 map units, keeping it beside its stop and off the trail and the coast;
  - put a name on another side of its shield than part 4b's when its own drawing is on that side.
  Each HMC sub-line shows at least from the closest zoom a visitor reaches. Nothing else about part 6's placement changes.
  Test: D1's test at its four sizes, at rest and three zooms, for the six names, the X's words and the sub-lines.

## 2. Drawings

- **E2. The serpent's humps stand sideways.** Each surfaced stretch follows the ring's normal, so on the map's sides it stands sideways like a bracket, at the bottom it hangs upside down like a horseshoe magnet, and on desktop the top hump sits on "NOW" in the map's kicker. Each surfaced hump stands upright on the screen (arching toward the top of the map) with both feet level on a short broken waterline, centred on its own point of the ring, whatever the ring's direction there. Keep part 6's band, back line, scale ticks, neck and tail fin. Every hump, the head and the calendar pad keep 4 px from every label, the map's title and kicker included, at the eight sizes.
- **E3. The beam leaves the map.** At rest and in explore the lighthouse's beam runs past the map's frame into the sky and over the clouds (phones and desktop). Clip the beam, resting and aimed, to the map's inner frame, so no light falls on the frame, the sky or the clouds. Keep part 6's 8-degree rest sweep, and the four readings stay reachable.
- **E4. The dig marks read as tiny flags.** At the overview the spade's ball grip on its stick reads as a flag or a small figure. Draw the spade so it reads as a spade at the overview: a straight handle leaning about 15 degrees with a T grip (a short crossbar, never a ball) and a pointed blade half sunk in the mound. Keep the smooth mound and the two or three clods, nothing that reads as a letter, never an X; make the mark at least 14 CSS px wide at the 412 x 730 overview where its clearances allow. For D2's clearances you may now move each hoard's mark up to 16 map units (its pit, chest, hit area and hint with it), staying in its own region near its stop, so that it keeps 4 px from every date and name at the eight sizes.

## Checks

- Time: aim to finish within 90 minutes. If an item still fails after two real attempts, keep the better attempt, record what is left and move on; do not loop on one item.
- All tests pass, as listed in `COMB-D.md`'s Checks, plus your `comb-d-*` tests. Update tests only where this brief changes what they pin, and say which and why; re-record the `finds-test` digests that change.
- Do not run `tools/frame-cost.mjs` or the comb-b and comb-c cost launchers: the timing pass runs separately. Add no per-frame work.
- Screenshots before and after with the local headless Edge (127.0.0.1 only; its profile and captures in the run folder your prompt names) at device scale 2: the overview at 412 x 730 and 1440 x 900; explore at rest at 412 x 730, 360 x 640 and 1440 x 900; the serpent's, the beacon's and one hoard's closest view at 412 x 730.
- The gzip budgets in `tools/check.mjs` hold.

## Rules

- You may write only these files, all under `design/journey-map/`: `art.mjs`, `data.mjs` (the stops' small drawings' places, the hoards' places, the serpent's drawing data, the beacon's beam and explore's label data only), `find*.mjs` (the serpent's, the beacon's and the hoards' drawings and places only), `trip.mjs` (explore's labels only), the test files in `tools/`, `dist/journey-map.html` and `dist/journey-joined.html` (only through `node tools/pack.mjs` and `node tools/pack-joined.mjs`), and your report `COMB-E-BUILD.md`. The browser's profile, captures and full test logs go only in the run folder your prompt names.
- Never touch `depth.mjs` (not even a comment), `map.css`, `cards.mjs`, `join.css`, `joined.html`, `hero-copy/`, the briefs and other build reports, the audits, or anything else outside `design/journey-map/`.
- Never run git, never install anything, never use the network (the local headless Edge on 127.0.0.1 is not the network), never start reviewer agents or other agents.
- If a rule stops you from doing something this brief asks, leave it out and say so in your report. Do not work around a rule.
- Plain ASCII punctuation in `COMB-E-BUILD.md`.

## Report

`COMB-E-BUILD.md`, short: for each item, what you changed and why, with the before and after screenshots; each test you changed or added and why; one table with the last exit of every test you ran; anything you left out and why; what the review should look at. Put full test output in a log file in the run folder, not in the report (part 6's report ran to 15,618 lines).
