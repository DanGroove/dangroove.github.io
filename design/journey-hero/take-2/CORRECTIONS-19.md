# Round 19: a short loader, and a calmer entrance

Dan, 24 Nov, 3:28 AM ET: "can we do a short loading thing before the in animations on the hero? the in animations also happen too fast and happen too much at the same time, hard to process".

Build on `0f38758` (round 18). Change nothing that this file does not name. Brand rules hold: ink #151314, paper #F7F6F3, #F0484F for small red on ink, Outfit, square corners, hard-edged motion (wipes and cuts, no opacity fades) except the stars and the name.

## What happens now (read in the code at 0f38758)

`ENTRANCE` in `entrance.mjs` runs everything in 1.4 s from the first frame that can draw: the mark (0 to 0.3 s), the nav cuts (0.24, 0.3), the name's two lines (0.08 to 0.4, 0.16 to 0.48), the lede (0.4 to 0.75), the craft hairlines (0.55 to 0.95), the floor and the star rings (0.2 to 0.9), the screen's clip plane (0.5 to 1.1) and the foot (1.1, 1.2). Between about 0.2 and 0.9 s, six of these move at once. Before the first frame, `play.mjs` waits for `fontsReady()`, `makeAtlas()` and `document.fonts.ready`, and the page shows ink with the entering parts held back (`.hero.is-entering` in `take-2.css`).

## L1 The loader

1. **What it shows.** On the page's own ink, the DG mark in paper (the header's own mark artwork, as an inline SVG, so it needs no font and no script), centred in the first screen: 44 px tall on desktop, 36 px on phones. 20 px under it, a 2 px hairline track as wide as the mark, one step lighter than the ink (#2B2829), which fills left to right in #F0484F. Square ends. Nothing else shows: no star field, no floor, no text.
2. **It shows from the first paint.** Its markup and CSS are in the page itself (`tools/page.mjs` builds the page; the offline preview from `tools/preview.mjs` must carry them too). It does not wait for any script, font or picture.
3. **The fill is real.** The boot steps that `play.mjs` already waits for (fonts ready, the atlas built, the first frame drawn) each move the fill's target on by their share. The drawn fill moves toward its target at a steady speed (it fills its whole width in no less than 0.8 s), never jumps, and never goes back.
4. **Short.** It is on screen for at least 0.8 s, and it ends when every step is done and the fill has reached the end. Then it holds full for 0.15 s, and the mark and hairline wipe out together, left to right, over 0.3 s (a hard-edged clip with `EASE.wipe`). The entrance starts when that wipe ends.
5. **Reduced motion.** The mark and an empty track show while loading; the track fills in hard steps as each boot step completes; then a cut to the finished page (the existing reduced-motion state). No wipe.
6. **Review links skip it.** A page opened with `?t=` (the film, sheet and pixel tools, Dan's review links) skips the loader as it skips the entrance now. `__hero.entrance` holds and `window.__ready` keep working as they do.

## L2 A calmer entrance

The same parts, the same wipes and cuts, the same order, but slower and one idea at a time: at any instant at most two groups move, in reading order. New `ENTRANCE` (seconds from the loader's end; old values in brackets):

| Part | New | Old |
|---|---|---|
| mark (wipe) | 0.00 to 0.45 | 0 to 0.3 |
| nav (cuts) | 0.35, 0.45 | 0.24, 0.3 |
| name: Danial, Endrawes (wipe up, weight 300 to 800) | 0.40 to 1.00, 0.60 to 1.20 | 0.08 to 0.4, 0.16 to 0.48 |
| lede (one wipe per line) | start 1.05, end 2.00, step 0.15 | 0.4, 0.75, 0.06 |
| floor and stars (rings from the stage's centre) | 1.80 to 2.80 | 0.2 to 0.9 |
| screen (clip plane rising) | 2.40 to 3.20 | 0.5 to 1.1 |
| crafts (hairlines) | start 3.00, end 3.60, step 0.10 | 0.55, 0.95, 0.05 |
| foot (cuts) | 3.60, 3.70 | 1.1, 1.2 |
| end | 3.80 | 1.4 |

- The loop's clock still starts when the screen's wipe ends (now 3.20 s), so the current craft's row is lit as its row cuts in.
- The star field takes the pointer when its rings end (2.80 s, was 0.90 s); the name reacts once the entrance has ended (3.80 s), as now.
- Every other rule of the round 6 entrance stays: hard edges, `staggerSpans`, the floor's and stars' wholly-on-or-off rings, the screen's clip plane, the review hold.

## Checks

1. Update `tools/entrance-checks.mjs` (and any other check that reads the old timetable) to the new numbers, and list every changed expectation with its old and new value.
2. Add a check that samples the new timetable every 1/60 s and finds at most two groups in motion at any instant (cuts count only at their instant), with the groups in the order of the table. Negative control: the screen back at 0.5 to 1.1 must fail it.
3. Write the loader's timing as a pure function of time and boot progress (where the fill is, when it holds, when the wipe runs, when the entrance starts), and check it in Node: the fill never jumps or goes back; the loader lasts at least 0.8 s when everything is ready at once; the wipe is 0.3 s; the entrance starts at its end; `?t=` and reduced motion take their own paths. Negative control: a loader that ends at 0.5 s must fail.
4. Run `tools/checks.mjs` to `all clean`, and every negative control fails at its gate.

## Done when

- The checks above pass and every control fails at its gate.
- BUILD.md has a "Round 19" part: what changed, the old and new numbers, every earlier check that changed, and anything you could not do or decided differently, with why.
