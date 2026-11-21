# Round 10: journey hero, second take: blasted stars fade back to their own colour

This brief is for the builder. Dan, 21 November, 12:34 AM ET: "the stars when they explode from the DG logo their color pops back to their original after a few seconds, can it fade back instead?"

Everything in `CORRECTIONS-2.md` to `CORRECTIONS-9.md` still holds, except the one rule this round replaces: in round 9, a star cuts back to its own colour, size and layer at once when it is home. Nothing here touches anything outside `design/journey-hero/take-2/`, and `public/` stays untouched. The brand's motion is hard-edged, but Dan asked for this fade, and the stars are already the soft exception.

## R1 (major). After the release, a star eases back to its own look on its way home

- **The return weight.** For each star that is drawn in front when the hold is released (in the mark or not), keep a weight `w`:
  - `w` is 1 from the release until the star's offset starts to shrink;
  - after that, `w` is its current offset divided by its largest offset since the release;
  - `w` never grows (round 9's guard already makes the offset shrink steadily once it falls), and it is near 0 when the star comes to rest at home.
- **How it draws.**
  - The pass behind the scene draws every star in its own colour and size at its current position, including stars that are out.
  - The pass in front draws each star that is out over that, in its front look (the mark colour and mark size if it arrived in the mark, its own colour and size otherwise), at opacity `w`.
  - Over ink, the star's colour and size ease from the mark's to its own as it travels home. Over the big screen, the star fades out instead of vanishing behind it at once.
  - At home, the front copy is already at about 0 opacity. It then leaves the front pass, so nothing pops.
- **Unchanged.**
  - The hold, the gathering, the formation and the mark's arrival cut stay as round 9 built them. Captured stars draw in front at full opacity until the release. Dan asked only about the return.
  - The blast's impulses, the caps, the coast home and its no-overshoot guard all stay.
  - At most two draw calls for the field per frame, and one when no star is out. No layout reads per frame. The field still sleeps when settled.
  - Touch, reduced motion, Pause and `?stars=0` behave as now.

## Checks

- In Node:
  - **The weight:** `w` is 1 at the release and never grows. It stays 1 until the offset falls. When a star is declared home, `w` is at most 0.02. At 60 frames a second, `w` changes by at most 0.1 in one frame.
  - **The draw:** the behind pass includes every star, and the front pass only stars that are out, each with its weight. Two draw calls at most.
  - **Round 9's checks** still pass. Rewrite only the colour rule that said "back only at home": the colour still cuts to the mark colour only on arrival within 1 px.
  - **Negative control:** hold `w` at 1 until home (the old pop), and the "near 0 at home" check fails.
- Keep `node design/journey-hero/take-2/tools/checks.mjs` printing all clean.
- In a browser (Playwright is preinstalled), at 1440 x 900:
  - Film the release of a 3 s hold, every 0.25 s for 4 s after the release. Do it once in an empty part of the hero and once over the big screen.
  - Add a crop at device pixel ratio 2 that shows stars partway home in between colours.
  - Do not run the full `tools/browser-check.mjs`, since this round changes only how the stars draw.
- Put the films in `.scratch/review-out/r10/`.

## Records

Add a "CORRECTIONS-10" section to BUILD.md and a line to README's note on the hold and blast.
