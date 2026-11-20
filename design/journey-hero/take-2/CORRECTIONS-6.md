# Round 6: journey hero, second take: the entrance

This brief is for the builder. Dan, 20 November, 2:57 AM ET: "Can you do a nice in animation on everything when the page first loads?" Everything in `CORRECTIONS-2.md` to `CORRECTIONS-5.md` still holds. Nothing here touches anything outside `design/journey-hero/take-2/`; the first take's `public/journey/` files stay untouched (take two's own CSS is `take-2.css`).

## The brand's motion rules apply

Hard-edged only: cuts and wipes, no fades, no opacity ramps, no bounce or overshoot, no blur. The same object moves or is revealed; nothing is respawned. Use the existing easings in `public/journey/hero/engine.mjs` (`EASE.wipe`, `EASE.enter`) without changing that file.

## E1 (major). One entrance, about 1.4 s, on first load

Today the page holds everything until it is ready (`.hero.is-entering`), then shows it all at once, with only the name's weight animation. Replace that with this sequence. Times are from the moment the first frame can draw (fonts and pictures ready), so nothing pops in before its turn.

| Time (s) | What | How |
|---|---|---|
| 0.00 to 0.30 | DG mark | Wipes in left to right (clip). |
| 0.24, 0.30 | Journey, Contact | Each cuts in. |
| 0.08 to 0.48 | "Danial", then "Endrawes" 0.08 s later | Each line wipes up from its own baseline (a clip rising from below the letters), while its weight goes from 300 to 800 as now. |
| 0.40 to 0.75 | Lede | Wipes in left to right, line by line, 0.06 s apart. |
| 0.55 to 0.95 | Craft list | Each hairline draws left to right (a wipe, 0.05 s apart); a row's number and word cut in as its line passes them. |
| 0.20 to 0.90 | Floor | Dots switch on in rings from the floor's centre outward: each dot wholly on or off, a hard-edged circle growing to the pool's edge. The pool of light grows with the same circle. |
| 0.50 to 1.10 | The app screen | Revealed by a hard-edged wipe rising from its bottom edge to its top (a clip plane in the renderer, not a fade). Photoshop's empty document and the cursor are already on it; its shadow on the floor is revealed with it. |
| 1.10 to 1.40 | Scroll for the journey, Pause | Each cuts in (1.10 and 1.20). |

- The loop's clock starts at 0 when the screen's wipe ends, so no part of the loop is skipped.
- Phones (the stacked layout) use the same order and timing.
- It plays once per page load. It does not replay on resize, on returning to the tab, or when the hero scrolls back into view.
- A click on a craft, on the stage or on Pause during the entrance ends the entrance at once (everything shown) and then does what the click does.
- The floor hover (H7) starts only after the floor's wipe ends.
- Reduced motion: no entrance; everything shows at once, as now. Without JavaScript the page shows everything (the existing `noscript` rule).
- Only clip, transform and the renderer's own uniforms animate; no layout reads in each frame.

## E2 (minor). A way to hold the entrance for review

Add `__hero.entrance(time)`: it shows the entrance held at `time` seconds (0 to 1.4) and draws that frame; `__hero.entrance(null)` returns to normal. Review tools use it to film the entrance at fixed times.

## E3 (minor). Correct one browser check

`browser-check.mjs` asserts "H6 equal side spaces (H12 actual ink)" within 8 px at 1280 wide and up. H12 takes the text's edge from the lede's box, which leaves 13 px at 1280 x 800 (lede box right 514, its ink 501), so the assertion contradicts the brief. Allow 16 px below 1440 wide and keep 8 px at 1440 and up. With that change the check passed all 150 rows on `984c8b1` here.

## Checks

- In Node: the timetable above (each part's start and end, the screen's clip plane at 0, 0.5, 0.8 and 1.1 s, the floor circle's radius over time, each dot wholly on or off), the loop clock starting at 0 when the screen's wipe ends, and that a click during the entrance ends it. Each with a negative control.
- Keep `node design/journey-hero/take-2/tools/checks.mjs` printing all clean.
- The frames will be checked elsewhere in a browser, every 0.05 s through the entrance at 1440 x 900 and 390 x 844.

## Records

Add a "CORRECTIONS-6" section to BUILD.md (what was done, departures and why, negative controls, checks output) and note the entrance and `__hero.entrance` in README.
