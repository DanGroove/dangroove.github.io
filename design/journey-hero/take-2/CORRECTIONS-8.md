# Round 8: journey hero, second take: the name reacts, and three floors to try

This brief is for the builder. Dan, 20 November, 7:17 AM ET: "can we do the same interactivity we have on the under construction text on my name? Also, i dont really like this in the screenshot, can we try something else?" The screenshot shows today's floor hover: the dots under the pointer turned red inside a hard-edged circle, which reads as a sparse diamond of nine red dots.

Everything in `CORRECTIONS-2.md` to `CORRECTIONS-7.md` still holds. Nothing here touches anything outside `design/journey-hero/take-2/`. `public/` stays untouched, including the live page's `public/holding/title.js` and `field.js`: read them, never change them.

## N1 (major). The name reacts the way the live page's headline does

Port the behaviour of `public/holding/title.js` to the hero's name ("Danial" / "Endrawes", the two `.name-line` spans built in `page-layout.mjs`). Keep its numbers and its feel, since Dan asked for "the same":

- A red copy of the name sits exactly over it. A circle around the pointer shows the red letters in place of the plain ones. It opens as the pointer comes within 1.2 em of the name's box and closes as it leaves (radius 0.95 em, the same eased opening as `title.js`). Red is `#F0484F` (the brand's red for text on ink, as the live page uses on dark).
- The letters nearest the pointer lift a little (0.07 em, felt within 1.3 em) and spring there, as in `title.js`.
- A click or tap on the name knocks the letters up in a wave from where it landed (0.16 em), and they drop back into place.
- Hover follows a mouse only. Screen readers get the plain name once. With reduced motion nothing moves and no red copy shows.
- It starts only after the entrance ends, so it never fights the entrance's wipes or weight. During a held entrance (`__hero.entrance(t)`) it stays off.
- The name's layout must not change. Its ink edge, the `--name-ink-shift` alignment, the H12 measures and the phone layout must give the same numbers as on `b5cce1d`. Split the letters inside the existing `.name-line` spans, and position the red copy so it overlays both lines exactly at every size. Use only transform and clip-path each frame, with no layout reads per frame. Measure on resize, on scroll and when fonts are ready, as `title.js` does.
- A click on the name does not change the craft.

## F1 (major). Three floors to try, switchable for review

Replace today's red-dot hover with three variants that Dan can switch between in the preview. Add `__hero.floorStyle(name)`, which sets the variant live and returns it; `__hero.floorStyle()` returns the current one. The default is `swell`. Every variant follows Dan's earlier rule: the floor, its dots and its pool of light never move or tilt, and nothing leans. Each variant starts only after the entrance's floor wipe, and shows nothing with reduced motion or without a mouse.

| Name | Hover | Click on the floor |
|---|---|---|
| `swell` (default) | Like the live page's dot field (`field.js`), without the lean: dots within about 1.2 floor units of the pointer grow in place, up to about 1.8 times their radius, smoothly less with distance. They keep their colour. | A ring travels out from the click across the floor at about 5 units per second and ends at the pool's edge (4.8). The dots it passes swell as it crosses them, then settle. |
| `ring` | The labels' six-dash red ring (`#F0484F`, same dash pattern and slow turn as `labels.mjs`) lies flat on the floor under the pointer, about 0.35 units in radius, drawn in the floor's perspective. It cuts in when the pointer reaches the floor and cuts out when it leaves. | As now (the click does what clicking the stage does). |
| `ripple` | Nothing. | A hard-edged red ring travels out from the click at about 5 units per second to the pool's edge. Each dot turns red, wholly on, only while the ring is over it, then wholly off. |

- A click on the floor still does what it does today (it goes to the next craft) in every variant. The ring is feedback only.
- `swell`'s growth is the one place on the floor that eases softly, matching the live page; `ripple` stays hard-edged.
- Do all of this in the floor shader and its uniforms: no per-dot JavaScript, and no layout reads per frame. A click ring is a uniform (start time and centre); at most two rings at once.
- Remove the old red-circle hover (`redDot` and its uniform use), or keep it only as an internal helper if a check needs it.

## F2 (major). A fourth floor, `stir`, the new default

Dan, 7:19 AM ET, with a link to a page whose star field reacts to the mouse: "I like the background on this page and how it reacts to my mouse, can we do something similar?" The reference was read in a browser and its shader read in its source. How it works:

- The moving pointer pushes the stars it sweeps through, along the line of its own motion. The push comes from the pointer's path segment since the last frame, not from where the pointer sits, so a still pointer pushes nothing.
- Each star has its own mass and coasts: its velocity decays (a drag of about 2.3 divided by the square root of its mass), and it drifts back home on an exponential (about e to the minus its age). The source says so itself: individual momentum, with no spring pulling toward the cursor. Nothing overshoots or bounces.

Do the same with the floor's dots, as variant `stir`, and make it the default instead of `swell`:

- **The push.** Each frame, take the pointer's path segment on the floor plane (`pointerFloor` at the last and current positions). Dots within about 0.6 floor units of that segment get an impulse along it. Use `(1 - smoothstep(0, r, distance))²` weighting, in proportion to the pointer's speed, with the impulse capped so a fast flick cannot fling a dot far.
- **Each dot's mass** comes from a fixed hash of its grid cell, between about 0.6 and 1.6, so neighbours move differently.
- **The coast.** Each dot coasts and returns home as above. The largest offset stays under 0.35 units (the pitch is 0.5), and dots never swap places.
- **What does not move.** The floor plane, the pool of light and every unstirred dot stay put, so nothing moves unless the pointer moves through it. That keeps to Dan's rule that the floor itself does not move.
- **Colour and size.** Dots keep their colour and size.
- **Clicks.** A click on the floor still goes to the next craft; no ring.
- **How to build it.** There are only a few hundred dots (pool radius 4.8, pitch 0.5), so a JavaScript simulation of their offsets is fine. Upload the offsets to a small texture each frame, only while any dot is away from home, and let the floor shader draw each dot at home plus offset. Check the neighbouring cells so a moved dot is never clipped by its own cell. Sleep when everything has settled.
- **When it is off.** It starts only after the entrance's floor wipe. It is off with reduced motion and without a mouse. The other variants keep their behaviour.
- **Checks.** In Node:
  - a still pointer moves nothing;
  - a sweep moves only dots near its path, and along it;
  - every dot returns home monotonically with no overshoot, within 0.35 units;
  - two dots of different mass in the same sweep end up different.

  Add a negative control. In the browser, film a slow sweep and a fast flick across the floor at 1440 x 900.

## Checks

- In Node:
  - **N1, as a pure model:** the circle radius as the pointer nears the name, each letter's rest height against pointer distance, the wave delays of a knock, and "off during the entrance".
  - **F1:** for each variant, a dot's radius or colour at set distances from the pointer, the ring's radius over time and its end at 4.8, every dot wholly on or off in `ripple`, and nothing at all with reduced motion.
  - **Negative controls:** one for N1 and one for each floor variant.
- Keep `node design/journey-hero/take-2/tools/checks.mjs` printing all clean.
- **In a browser (Playwright is preinstalled):**
  - At 1440 x 900, move the mouse across both lines of the name and film it. Show the red circle and the lift, then a click and its wave.
  - For each floor variant, film a hover pass and a click on the floor.
  - At 390 x 844, a tap on the name knocks the letters, and the layout is unchanged.
  - Run `tools/browser-check.mjs` once at the end; it takes about 18 minutes.
- Put the films and sheets in `.scratch/review-out/r8/`.

## Records

Add a "CORRECTIONS-8" section to BUILD.md and note the name interaction and `__hero.floorStyle` in README.
