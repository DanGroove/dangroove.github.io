# Round 14: journey hero, second take: the craft list changes with a letter roll

This brief is for the builder. Dan, 21 November, 3:21 AM ET, on round 12's selection box: "hmmm not a fan of this idea, can you look up a bunch of selection UI that would work in this scenario?" He was shown eight live studies on the real list (Artifact "Craft list studies"). At 3:39 AM ET he chose "E. Letter roll".

This replaces round 12's L2 (the selection box), which replaced round 11's C1 (the red rule). Everything else in `CORRECTIONS-2.md` to `CORRECTIONS-13.md` still holds. Nothing here touches anything outside `design/journey-hero/take-2/`, and `public/` stays untouched (`journey.css` and `index.html` are read only, so take-two styles go in `take-2.css`).

## K1 (major). The current craft's letters roll up into place

**At rest:** the current row's number is red `#F0484F` and its text paper. The other rows are muted. The hairlines are as `journey.css` draws them, with nothing over them. This is the look from before round 11, with no extra mark.

**The roll:** every glyph of a row (the two digits of its number, then each letter of its label, spaces included) has two copies stacked in a mask the height of the line box.
- The **out copy** is the row's at-rest colour when not current: muted, or paper while hovered (it follows the button's own colour, so hover keeps working).
- The **in copy** is the current look: paper for the label, red `#F0484F` for the number.
- A glyph's roll moves the out copy up by 110 % of the line box and brings the in copy up from 110 % below to 0. Nothing fades. The mask is a hard clip: the line box's height, and 0.2 em of slack left and right so no glyph's side is cut.
- Each glyph takes **0.38 s** with `EASE.wipe`. Glyph `i` of the row starts `i x 0.018 s` after the change. The digits are 0 and 1, and the label's letters follow from 2. So the roll sweeps across the row from left to right, and the longest row ("Graphic design", 16 glyphs) is done at 0.38 + 15 x 0.018 = 0.65 s.

**A change:** at the change, the new row rolls in (up) and the old row rolls back out (down: its in copy goes back down to 110 %, its out copy comes back down to 0), both starting at once with the same per-glyph timing. `aria-current` moves at once, as today.

**A change during a change:** each glyph of each row goes on from where it is to its new target, starting again on the same timetable (its own delay, then 0.38 s), so nothing jumps. A row that was rolling in and is no longer current rolls back from where it got to. The list never rests with two rows lit.

**Exact letters:** the rolled glyphs must sit exactly where the flow text's letters sit, with the font's own kerning and the 0.12 em tracking.
- Measure the pen positions from the flow text and place the glyph copies there, the way `name-react.mjs` does for the name (round 8, N1).
- Do not split the flow text into inline blocks, which drops kerning.
- The flow text keeps the layout and is what screen readers read. The copies are `aria-hidden`, and the flow text is painted transparent only while the overlay is live.
- Re-measure on font load and on resize (and when the phone grid switches), not per frame.

**Kept from rounds 11 and 12:**
- it runs on its own clock, not on the loop's time, so it finishes while the loop is paused and with the stage held;
- every trigger: the loop moving on, the wrap from 04 to 01, a click on a row, a click on the stage;
- it always runs from the craft that was actually current (a click from 01 to 03 rolls only those two rows);
- the entrance and the loop's first start make no change (the current row appears lit when its row appears in the entrance);
- reduced motion cuts at once to the rest state;
- without scripts there is no current row, as today;
- `__hero.crafts(p)` holds the current change at progress `p` (0 to 1 over its whole length, 0.65 s for the longest row), and `__hero.crafts(null)` lets it run;
- no layout number changes (the H12 craft-number measures, `--name-ink-shift` and the phone layout give the same numbers as `0bf5341`);
- the button keeps `aria-current`, hover and its focus ring.

**On phones**, in the 2 x 2 grid, the roll is the same, cell by cell.

**Remove** round 12's selection box: its CSS (`.is-selected`, the `::before`/`::after` rectangle and handles, the `--sl/--sr/--st/--sb` properties), its model and its entrance step. Keep the file name `craft-wipe.mjs` and its exports if the player's seams need them, as round 12 did.

## Checks

- **In Node, as a pure model:**
  - One change: each glyph's offsets against time, ending exactly at rest.
  - The order: glyph `i` starts `i x 0.018 s` after the change, so digits lead, then the label left to right.
  - A second change 0.2 s into the first: no glyph jumps (at 60 frames a second, no copy moves more than its per-frame share of the eased curve allows; pick the bound from the curve and print it), and every row ends at rest.
  - 01 to 03 touches only rows 01 and 03.
  - Reduced motion cuts at once.
  - No change at the first loop start after the entrance.
  - **Negative controls:**
    - start every glyph together, and the order check fails;
    - restart a glyph from its rest position instead of from where it is, and the no-jump check fails.
- Remove round 12's L2 checks, keep its S1 checks, and keep `node design/journey-hero/take-2/tools/checks.mjs` printing all clean.
- **In a browser (Playwright is preinstalled; see `tools/film.mjs` for the launch flags):**
  - At 1440 x 900, film the craft list, cropped to it at device pixel ratio 2, every 0.05 s through the loop's change from 01 to 02 and through a click from 02 to 04.
  - At 390 x 844, film one change in the 2 x 2 grid.
  - Film a click on a row while paused.
  - Confirm that each overlay glyph sits within 0.5 px of its flow-text letter at rest, at both sizes.
  - Confirm the hero's layout numbers at 1440 x 900 and 390 x 844 match `0bf5341`, with a short script as round 9 did (`.scratch/review-out/r9/layout.mjs`).
  - Do not run the full `tools/browser-check.mjs`.
- Put the films in `.scratch/review-out/r14/`.

## Records

Add a "CORRECTIONS-14" section to BUILD.md, and change README's line on the craft list.
