# Round 7: journey hero, second take: a cursor the eye can follow

This brief is for the builder. Dan, 20 November, 6:15 AM ET: "Do you think the mouse moves too fast at times?" Everything in `CORRECTIONS-2.md` to `CORRECTIONS-6.md` still holds. Nothing here touches anything outside `design/journey-hero/take-2/`; `public/journey/` (including `engine.mjs`) stays untouched.

## What was measured (on `c8c876d`, 1440 x 900, S 103.6, about 86 px per screen-local unit)

- The cursor's on-page speed, sampled every 1/60 s over the loop: half of its 82 movements peak above 2,000 px/s; the fastest reach about 5,000 px/s (Figma 73.15 s, Premiere 40.68 s, InDesign 23.47 s, Illustrator 8.30 s, Photoshop's move to Export 6.27 s).
- Two causes, both in `stage.mjs`:
  1. `script()` gives every approach 0.12, 0.2 or 0.28 s by distance band, so a move of 4 units (most of the screen) takes 0.28 s.
  2. `actionCursor()` moves the cursor with `progress()`, that is `EASE.wipe`, and drags, draws, slides, strokes and runs with `EASE.wipe(phase)`. `EASE.wipe` is the brand's wipe curve; its top speed is 3.8 times its average, so on a cursor it reads as a jump.
- 22 of the 64 drags, draws, slides, strokes and runs peak above 1,800 px/s.

## K1 (major). One hand easing for the cursor

Add `HAND`, the minimum-jerk curve `x => x * x * x * (10 + x * (6 * x - 15))` (top speed 1.875 times its average, no overshoot), in `stage.mjs` (not in `engine.mjs`).

- The cursor's approach to each action uses `HAND` instead of `progress()`'s `EASE.wipe`.
- For actions of kind `drag`, `draw`, `slide`, `stroke` and `run`, the cursor's point uses `HAND(phase)`, and so does every piece that follows that action (the frame being drawn, the picture being dragged, a slider's knob, a stroke, anything that today reads `eased(s, id, t)` or `EASE.wipe(phase(...))` for that action), so the cursor stays exactly on what it moves. Find every such reader; do not leave one on the old curve.
- Everything that is not the hand keeps `EASE.wipe`: screen changes, wipes, page flips, exports landing, labels, the entrance.

## K2 (major). Longer moves take longer

Do this after K1, as a separate step (if Dan chooses to keep 83.04 s, only K1 ships).

- An approach of distance `d` (screen-local units, as `script()` measures it now) takes `min(0.5, 0.18 + 0.07 * d) * PACE` instead of the three bands. A zero-length approach still takes 0.
- A `drag`, `draw`, `slide`, `stroke` or `run` of path length `d` takes `max(authored duration, (0.12 + 0.08 * d) * PACE)`. Path length is the sum of its `path` segments, or `from` to `to`.
- Expected: approaches add about 6.9 s and drags about 0.9 s, so the loop grows from 83.04 to about 90.8 s. Report the exact new `LOOP` and each scene's length.
- Everything timed from actions (labels, exports, InDesign's pickup and `still`, the Figma prototype taps, the morphs) must follow automatically. Check that nothing is timed in absolute seconds that should have moved.

## K3. Checks

- A new check in Node: project the cursor with `HOME` at S 103.6 (1440 x 900) every 1/120 s over the whole loop; its peak speed stays at or under 1,500 px/s with K2 (report the number with K1 alone too). Negative control: put `EASE.wipe` back on the approach and the check must fail.
- During every hand action, the cursor's point and the piece it moves stay together (distance within 0.002 units). Negative control: one reader left on `EASE.wipe` must fail.
- Update the checks that hard-code 83.04 s or absolute times (`round5-checks.mjs` H2, `entrance-checks.mjs` E4, the H1 InDesign window and any others) to the new values, deriving them from the scripts where possible rather than typing new constants.
- Keep `node design/journey-hero/take-2/tools/checks.mjs` printing all clean, and `tools/browser-check.mjs` passing all rows (run it once at the end; it takes 10 to 15 minutes).
- Film the five worst moves above at 0.02 s steps before and after, and put the strips in `.scratch/review-out/r7/`.

## Records

Add a "CORRECTIONS-7" section to BUILD.md (what was done, the new loop and scene lengths, departures and why, negative controls, checks output) and update README's timetable and loop length.
