# Round 8: journey hero, second take: the name reacts, a star field behind, and no lifting frames

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

## F1 and F2: withdrawn

Dan, 7:24 AM ET: "not the floor. please leave the floor as is, im looking to get something similar the background that parallaxes like the example does". Do not build `swell`, `ring`, `ripple` or `stir`, and add no `__hero.floorStyle`. If any of it is already written, take it out.

## F3 (minor). The floor goes back to plain

Dan does not like today's red-dot hover (his screenshot). Remove it: no hover reaction on the floor at all. Remove the `redDot` hover path and its uniform, and leave the floor's dots, pool and click exactly as they are otherwise. (My reading of "leave the floor as is" together with "i dont really like this"; Dan can ask for the red dots back.)

## B1 (major). A star field behind the hero that parallaxes and stirs

The reference Dan likes is a dark page with a field of stars that reacts to the mouse. Read in a browser and in its shader source, it does two things:
- **Parallax:** the stars sit at different depths, so as the view shifts they move at different rates.
- **Stirring:** the moving pointer pushes the stars it sweeps through along its own path. Each star has its own mass and coasts back home, with velocity decaying (drag about 2.3 divided by the square root of the mass) and position returning on about e to the minus its age. There is no spring toward the cursor and no overshoot, and a still pointer pushes nothing.

Build that as the hero's background:

- **Where.** Fill the whole hero box behind everything: the name, the text, the craft list and the stage. The scene (screen, floor and exports) draws over the stars, and pointer events pass through to everything as now. Draw it in the existing renderer as a first pass of points (preferred), or in a canvas of its own behind the hero canvas; no second WebGL context if you can avoid it.
- **Look.** Brand colours only. About 1,200 stars at 1440 x 900, scaled with the hero's area. Each has a depth `d` from 0 (far) to 1 (near).
  - **Size and brightness:** 0.6 px to 2.2 px across, and brighter with `d`. Use paper `#F7F6F3` mixed into ink `#151314`, about 12 % for the farthest and 55 % for the nearest.
  - **Red stars:** about 3 % are red `#F0484F` at the same mix.
  - **Static colour:** no twinkle, and no animated opacity (the brand has no fades). The stars stay dim enough that the name and lede keep their contrast.
- **Parallax with the mouse.** Take the pointer's offset from the hero's centre as a fraction of the hero's size (-0.5 to 0.5).
  - Each star's target offset is minus that fraction times 28 px times `(0.12 + 0.88 d²)`, in both axes.
  - The field follows the target smoothly and critically damped, with a time constant of about 0.3 s and no overshoot.
  - When the pointer leaves the page, the target goes back to 0.
- **Parallax with scroll.** As the page scrolls the hero away, near stars move up to 12 % faster than the page and far ones at the page's speed.
- **Stirring with the mouse,** as in the reference:
  - **Push:** the pointer's path segment since the last frame pushes stars within about 60 px of it, along the segment. Weight them by `(1 - smoothstep(0, r, distance))²`, scale by the pointer's speed, and cap the impulse.
  - **Coast:** each star's mass comes from a hash, from 0.6 to 1.6. It coasts home as above, and its largest offset stays under 40 px.
  - **Combine:** stirring adds to the parallax offset.
- **Entrance.** The stars switch on in rings from the stage's centre outward, from 0.20 to 0.90 s, the same as the floor's dots. Each star is wholly on or off. Add this to `entrance.mjs`'s timetable and to `__hero.entrance(t)`.
- **Off states.** With reduced motion, the field is static: no parallax and no stirring. Touch only: no stirring, scroll parallax only. Without JavaScript: no field. The Pause button stops the loop, not the field.
- **Cost.** At most one draw call for the field per frame, with no layout reads per frame. The field's state lives in a JavaScript array (a few thousand numbers at most) uploaded only while something is moving, and the field sleeps when settled. It must not change the loop, the layout or any measured number.

## B2 (major). Hold to gather the stars, let go to blast them

Dan, 7:25 AM ET: "would be cool if you clicked, the stars would get attracted to the mouse and blast away on mouse up. longer you hold, the more stars get attracted and the bigger the blast is".

- **Press.** On a mouse or pen press anywhere in the hero, stars start to gather toward the pointer. This does not apply on the links, the craft list, Pause or the name, which keep their own clicks.
  - **Capture.** The capture radius grows with the hold: `80 + 260 * min(1, held / 2.5)` px. A star inside it is captured and stays captured until release.
  - **Pull.** Captured stars are pulled toward the pointer and settle into a loose cluster around it. Each star takes a hashed orbit radius of 6 to 36 px, scaled up gently with the number captured. They turn slowly around the pointer, about a quarter turn a second, like the reference's spiral.
  - **Moving while held.** The pull is critically damped, so no star overshoots the pointer. The cluster follows the pointer if it moves while held.
- **Release: the blast.** Each captured star gets an outward impulse from the pointer, of `(300 + 1700 * min(1, held / 2.5)) / mass` px/s. Uncaptured stars within twice the capture radius get a weaker push, falling off with distance. Every star then coasts home as in B1, with no spring and no overshoot, and its largest offset stays under 45 % of the hero's width. So the longer the hold, the more stars and the bigger the blast.
- **The stage's click.**
  - A press on the stage that ends within 0.25 s and moves less than 6 px is still a click: it goes to the next craft, as now, with a small blast from the few stars it gathered.
  - A longer press is a hold, and its release does not change the craft.
  - Pressing anywhere else behaves the same, except there is no craft change.
- **Off states.** Touch does nothing, so the page still scrolls. Reduced motion does nothing. Pausing the loop does not stop it.
- **Checks.** In Node:
  - the capture radius against hold time;
  - captured stars never cross the pointer, and stay within their orbit radius plus a margin once settled;
  - the blast impulse scales with hold time;
  - every star returns home monotonically after the blast, with no overshoot;
  - a short stage click still changes the craft, and a long hold does not.

  Add a negative control. In the browser, film a 0.3 s hold and a 2.5 s hold, with each release, at 1440 x 900.

## G1 (major). Frames and selection must not lift off the canvas while a picture is carried

Dan, 7:23 AM ET, with a screenshot: "for some reason, the frames and the selection lifts off the canvas at multiple parts during the indesign section 27.83, 28.68 31.05 33.03".

Measured on `b5cce1d`: while InDesign's cursor carries a picture over the page (actions `map` 25.22, `loc` 27.79, `photo` 28.58, `postPhoto` 31.03 and `mailPhoto` 33.01), the empty frames and selection guides rise off the canvas. For example, 27.71 to 27.83 s:
- every empty-frame overlay goes from z -1.6161 to -1.5725, and the guides with it;
- some picture faces drop from -1.6134 to -1.681.

Moving a piece along the screen's normal shifts it on the page in this camera, so it reads as a lift. The cause is `separateFaces()`: the carried pieces (`where === 'travel'`) count in its tallest-picture height and in its collision placement, so every overlay jumps above the carried picture. It was there on round 6 too (22.26, 24.45, 25.16, 27.25, 29.03 s). Round 7's slower drags made it last longer.

- Exclude the carried stack of the current drag (its `travel` pieces and the cursor) from `separateFaces()`. `liftDragStack()` already puts the stack in front by moving it along the view vector, which does not move it on the page.
- No piece that is not carried may change position while a picture is carried over it.
- Keep the visual order as now: the carried picture and cursor in front of what they pass over.
- Look for the same cause in the other apps' drags (Premiere's clips, Figma's picture, Photoshop) and fix it the same way.
- **Check:** at every 0.01 s through every drag in the loop, every non-carried piece's position equals its position computed with the carried stack removed. Add a negative control (put the stack back into `separateFaces`).
- **Film:** InDesign at 0.02 s steps around 27.83, 28.68, 31.05 and 33.03, before and after, cropped to the screen at device pixel ratio 2.

## Checks

- In Node:
  - **N1, as a pure model:** the circle radius as the pointer nears the name, each letter's rest height against pointer distance, the wave delays of a knock, and "off during the entrance".
  - **F3:** the floor reacts to nothing on hover.
  - **B1:** the parallax offset for set pointer positions and depths, the critically damped follow (no overshoot), stirring only near the path and along it, and coasting home monotonically. Also: static with reduced motion, and the entrance's rings.
  - **B2 and G1:** as listed under each.
  - **Negative controls:** one each for N1, B1, B2 and G1.
- Keep `node design/journey-hero/take-2/tools/checks.mjs` printing all clean.
- **In a browser (Playwright is preinstalled):**
  - At 1440 x 900, move the mouse across both lines of the name and film it. Show the red circle and the lift, then a click and its wave.
  - Film the star field: a slow and a fast mouse pass (parallax and stirring), a 0.3 s hold and a 2.5 s hold with their releases, and the entrance's frames 0.15 to 0.95 s.
  - Film G1's before and after strips.
  - At 390 x 844, a tap on the name knocks the letters, and the layout is unchanged.
  - Run `tools/browser-check.mjs` once at the end; it takes about 18 minutes.
- Put the films and sheets in `.scratch/review-out/r8/`.

## Records

Add a "CORRECTIONS-8" section to BUILD.md and note the name interaction, the star field and its hold-and-blast in README.
