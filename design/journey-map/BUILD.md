# Journey map: build 1

Open `dist/journey-map.html` straight from disk. `index.html` loads ES modules, which browsers block over `file://`, so it needs a local static server.

## Files

- `data.mjs`: every fact, date, colour, palette, label, line of copy, timing (`ACTS`, `CAMERA`, `HOLD`, `FIND_TIMING`) and the map geometry from the reference.
- `art.mjs`: the coasts and trail (ported `spline`), the 24 Elder Futhark runes and `runeWord`, every glyph, `bigMap()` with the Norse changes, the stop stones, the mini-map.
- `trip.mjs`: the act sequence, progress to camera, traveller position, the date for a progress value, coast draw-on, the solid trail, the longship ride and the mini-map.
- `stars.mjs`: the star canvas: the hero field, the hand-off into trail dots and sea sparkle, the lean, rush and blast, and the traveller.
- `cards.mjs`: the six stops; each is one `article` that is the standing stone at rest and the card when open.
- `timeline.mjs`: the bar, slider semantics, scrubbing, jumping, the find count, the morph into the footer rule.
- `footer.mjs`: the X strokes and the supernova (in the map's camera group), and the footer text, with the name refitted on resize.
- `finds.mjs`: the eleven finds.
- `main.mjs`: builds the page, the single rAF loop (paused when the tab is hidden), resize, reduced motion.
- `tools/check.mjs`: the data checks in section 14. It also checks that top-level names are unique across modules and that there are no colour literals outside `data.mjs`.
- `tools/pack.mjs`: writes `dist/journey-map.html`.

Sizes: unpacked CSS and JS come to 125 KB. `dist/journey-map.html` is 288 KB, with the font and images inlined.

## Checked

- `node --check` passes on every module. `node tools/check.mjs` and `node tools/pack.mjs` pass. The packed file contains none of the banned strings.
- Headless Chromium (Playwright) at 1440x900, DPR 1, file opened from disk:
  - Screenshots of the hero, hand-off, overview, push-in, a mid-leg, three open cards (Laurier band, HMC 2 with its piece, Lennard with steps), the water crossing, the X, the rush, the blast, settling and the footer.
  - 390x844: the overview, an open card (as a bottom sheet) and the footer.
  - One full-page pass with reduced motion emulated.
  - Every find was triggered by keyboard, and the count reached 11 of 11. The well undid the last hoard.
  - No console errors and no network requests.
- Not checked: real touch gestures (the swipe strip, mist wiping by finger), frame rate on real hardware, screen-reader output, and browsers other than Chromium.

## Departures from the brief

- Palettes follow the revised brief: Lennard has a white ground, Warm Gray text and an orange headline, plus `headline` and `mark` values. Each palette also has a `hairline` value, used for the card's rules.
- Hoards: the reference has no chest near HMC Connections (summers). The chest that sat at (128, 502) in open country is moved to (404, 304), near that stop. The chest near Laurier holds the fifth piece, "Piece to come".
- The map's printed scale and timeline (`SCALE: ... THE TIMELINE YOU DRAG`) is dropped, because the live timeline bar does that job and would show a second red playhead. The legend stays, shifted to make room for the corner knots.
- The sketch labelled HMC "summers 2018, 2020, 2021". The map label now uses the resume facts: "summers 2018 and 2020".
- Sea dots drawn in SVG in the reference are replaced by the canvas stars that are not on the trail, so every dot on the sea is one of the hero's stars. The red hero stars turn Paper as they land, so that Red stays reserved.
- The serpent's calendar leaf has a Note band, not the sketch's red band, to keep Red to its four uses.
- Timeline dates are mapped literally: HMC's hold runs to August 2020 and Mohawk starts in January 2019, so on that leg the playhead slides back. That is the honest overlap.
- The raven reel runs for 5 seconds plus its flight, so this find takes about 7 seconds, over the 5-second guideline. The 5 seconds come from the brief.
- In reduced motion, the wayfinder lights hoards only. The stacked cards do not dim.

## Known gaps

- Focusing a find that is off screen by keyboard does not move the camera to it.
- On phones the timeline strip scrubs by swipe distance. It was not tried with a real finger.
- The serpent's over-and-under knot is a single crossing in the tail. It is simple and may want a better drawing.
