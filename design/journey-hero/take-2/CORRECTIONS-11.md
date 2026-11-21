# Round 11: journey hero, second take: the craft list changes with a wipe

This brief is for the builder. Dan, 21 November, 1:38 AM ET: "when it moves from one category to the other can we do a transition animation on the left table?"

Everything in `CORRECTIONS-2.md` to `CORRECTIONS-10.md` still holds. Nothing here touches anything outside `design/journey-hero/take-2/`, and `public/` stays untouched (`journey.css` and `index.html` are read only, so take-two styles go in `take-2.css`).

## Today

The craft list is the four rows `01 Graphic design`, `02 Video`, `03 Motion` and `04 UX/UI` (`[data-crafts]`). Each row has a 1 px top hairline (`--line`), and the last row also has a bottom one. When the craft changes, `play.mjs` moves `aria-current` at once. The new row's text cuts from muted to paper and its number cuts to red `#F0484F`. The old row cuts back. On phones the list is a 2 x 2 grid with no hairlines.

## C1 (major). The current craft is marked by a red hairline that wipes across, carrying the colour with it

In the brand's language this is a wipe, the same move as the entrance drawing the list's hairlines.

- **At rest:** the current row has a red `#F0484F` 1 px rule exactly over its top hairline, the full width of the row. Its number is red and its text paper, as today. The other rows are as today. On phones, where the rows have no hairlines, the rule sits along the top edge of the current cell, the cell's width.
- **When the craft changes:**
  - The old row clears in 0.35 s with `EASE.wipe`, left to right. Its red rule retracts toward the right. A hard-edged front sweeps through its text, changing it from paper back to muted. Its number cuts from red to muted as the front passes it.
  - The new row starts 0.1 s after the change and takes 0.4 s, with `EASE.wipe`, left to right. Its red rule draws across from the left. Its text changes from muted to paper behind the same front, and its number cuts to red as the front passes it.
  - The whole change is over in 0.5 s. The colour change is a hard edge moving through the letters, never a fade.
- **What triggers it:** every craft change. That covers the loop moving on (at 44.285, 60.967 and 76.049 s, and 3 to 0 at the wrap), a click on a craft row, and a click on the stage. It always runs from the craft that was actually current before. So a click from 01 to 03 clears 01 and draws 03, and 02 does nothing.
- **A change during a change:** if the craft changes again before 0.5 s, the row still clearing finishes clearing or cuts clear. The row that was drawing now clears from where it is. The newest row draws from the start. The list never shows two rows as current at rest.
- **Its clock:** it runs on its own clock, like the name's reaction, not on the loop's time. So it still finishes while the loop is paused (a click on a craft row while paused must still mark the new craft), and with the stage held. Expose `__hero.crafts(p)` to hold the current change at progress `p` (0 to 1) for review, and `__hero.crafts(null)` to let it run.
- **First load:** the entrance already draws the list's hairlines. The current row's red rule draws with its own hairline, in the same wipe and at the same time. After the entrance there is no extra change: the loop's start at t = 0 is not a change from 04.
- **Off states:** with reduced motion, every change cuts at once to the rest state. Without scripts there is no current row, as today.
- **Layout:** nothing may change any layout number. Use transforms, `clip-path` or a clipped overlay, and no change to padding, border or font. The H12 craft-number measures, `--name-ink-shift` and the phone layout must give the same numbers as `d9774ea`. The button keeps `aria-current`, its hover and its focus ring.

## Checks

- **In Node, as a pure model of the change:**
  - The progress of each row's rule and text front against time for one change, which ends exactly at the rest state.
  - The number cuts when the front passes it.
  - A second change at 0.2 s into the first.
  - A click from 01 to 03 touches only those two rows.
  - Reduced motion cuts at once.
  - There is no change at the first loop start after the entrance.
  - **Negative control:** make the change start from the loop's previous scene instead of the actually current craft, and the 01 to 03 check fails.
- Keep `node design/journey-hero/take-2/tools/checks.mjs` printing all clean.
- **In a browser (Playwright is preinstalled):**
  - At 1440 x 900, film the craft list, cropped to it at device pixel ratio 2, every 0.05 s through the loop's change from 01 to 02, and through a click from 02 to 04.
  - At 390 x 844, film one change in the 2 x 2 grid.
  - Film a click on a row while paused.
  - Confirm the hero's layout numbers at 1440 x 900 and 390 x 844 match `d9774ea` with a short script, as round 9 did (`.scratch/review-out/r9/layout.mjs`).
  - Do not run the full `tools/browser-check.mjs`.
- Put the films in `.scratch/review-out/r11/`.

## Records

Add a "CORRECTIONS-11" section to BUILD.md and a line to README.
