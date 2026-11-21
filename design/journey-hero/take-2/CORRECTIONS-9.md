# Round 9: journey hero, second take: a long hold draws the DG mark in stars

This brief is for the builder. Dan, 20 November, 8:44 AM ET: "oh also when i hold click for long enough, can the shape the stars make, resemble my logo?"

Everything in `CORRECTIONS-2.md` to `CORRECTIONS-8.md` still holds, B2 included: the capture radius, the pull, the blast and the stage's click keep their numbers. Nothing here touches anything outside `design/journey-hero/take-2/`. `public/` stays untouched: read `public/journey/index.html` for the mark, never change it.

## L1 (major). Held long enough, the captured stars form the DG mark

Today a hold gathers stars into a loose, slowly turning cluster around the pointer. From a set point in the hold, the cluster stops turning and the stars move into the shape of Dan's DG mark, centred on the pointer, so a full hold ends as the logo drawn in stars. The release blasts it as now.

- **The shape comes from the page's own mark.** The hero's `[data-mark]` link holds the SVG (viewBox `0 0 1080 797.3`): two paths filled paper `#F7F6F3` are the G, and one path filled red `#C0262E` is the D. Read the paths' `d` and `fill` from the DOM, so the stars follow the mark if it ever changes. Do not copy the path data into a module.
  - Sample target points inside each path's fill. Write the sampler as a pure function that takes `[{ d, fill }]` and a count, so Node can run it on the `d` strings read from `public/journey/index.html`. The paths use only `M`, `L`, `C` and `Z`; flatten the curves and test points against the filled shapes.
  - Order the points so that any first N of them cover the whole mark evenly (for example farthest-point order over a fine jittered grid). Fewer stars then give a sparser mark, never half of one.
  - Keep each point's shape: points from the paper paths are G points, and points from the red path are D points. The split follows the shapes' areas.
  - Prepare about 600 points once per hero size, at measure time, never per frame.
- **Size and place.** Upright and not mirrored (SVG y runs down, like the page). About 20 % of the hero's height tall (180 px at 1440 x 900), keeping the mark's own proportions. Its centre is the hold's anchor (which already follows the pointer, critically damped), clamped so the whole mark stays inside the hero box with a 16 px margin.
- **When.**
  - From the press to 1.4 s held: as now (gather and turn).
  - At 1.4 s: the cluster stops turning. The captured stars are given the first points of the order, matched cheaply so paths do not cross the whole mark (for example sort the stars and the points by angle around the anchor and pair them in order).
  - Each assigned star then moves to its point, critically damped from rest, with the time constant of B2's pull (0.2 s), relative to the anchor, so the mark follows the pointer. No star passes its point: its distance to its point never grows. The mark is formed by about 2.4 s.
  - A star captured after 1.4 s takes the next free point and goes straight there by the same rule. Once every point is taken, further captured stars keep turning as a ring just outside the mark.
  - A release before 1.4 s blasts the cluster as now, with no mark. A release mid-formation blasts whatever is there.
- **Colour and size: hard cuts only.** A star keeps its own colour while it travels. When it arrives within 1 px of its point, it cuts at once to the mark's colour at full strength and at least 2 px across: paper `#F7F6F3` for G points, red `#F0484F` for D points (the brand's red for small red on ink, as the name's red copy uses). No fade, no animated opacity, no in-between colours. Each star cuts back to its own colour and size when it comes to rest at home after the blast. If 180 px and 2.2 px do not read as the DG mark at 1440 x 900 from a 2.5 s hold, you may change the mark's height (150 to 200 px) and the star size (2 to 3 px). Record what you chose.
- **In front of the scene.** Holds often happen over the big screen. A captured star draws in front of the scene's pieces from the moment it is captured until it is home again, then it cuts back behind. This allows a second draw of the field's points while any captured star is out (two draw calls at most, one otherwise). Uncaptured stars stay behind everything. The page's text stays above the canvas, as now.
- **Unchanged:** B2's capture radius, pull, blast impulse, weak push, offset caps and click rule; the stage's short click still changes the craft and a hold still does not; touch and reduced motion do nothing; Pause does not stop it; `?stars=0` turns it all off. Still no layout reads per frame, the field's state stays in typed arrays uploaded only while something moves, and the field sleeps when settled.
- Expose what the checks need on `__hero.stars` (for example how many stars are in the mark and how many have arrived).

## Checks

- In Node, as a pure model:
  - **Sampler:** every point lies inside its own path's fill. For N of 100, 200, 300 and 600, the largest empty gap inside the mark is at most 2.2 times `sqrt(area / N)`. The D share of points is within 10 % of the D's share of the area.
  - **Timing:** no star has a point before 1.4 s held, and the cluster turns as before until then.
  - **Formation:** each assigned star's distance to its point never grows. Stars assigned at 1.4 s are within 1 px by 2.4 s. The mark is upright and centred on the anchor, and stays inside the hero when the pointer is at a corner.
  - **Colour:** a star shows only its own colour or its mark colour. It cuts to the mark colour only on arriving within 1 px, and back only at home.
  - **Overflow:** stars beyond the point count keep turning outside the mark.
  - **Release:** a formed mark blasts with B2's impulses, and every star returns home monotonically with no overshoot.
  - **Clicks:** a short stage click still changes the craft and forms no mark; a hold does neither.
  - **Negative controls:** formation switched off fails the formation check; D and G colours swapped fail the colour check; one point moved outside the mark fails the sampler check.
- Keep `node design/journey-hero/take-2/tools/checks.mjs` printing all clean.
- In a browser (Playwright is preinstalled), at 1440 x 900:
  - Film a 2.5 s hold in an empty part of the hero and one over the big screen, with frames at 0.5, 1.0, 1.5, 2.0, 2.5 and 3.0 s held, then the release at 0.05, 0.2, 0.5 and 1.5 s after.
  - Film a 0.3 s hold: no mark.
  - Show one frame of the formed mark cropped at device pixel ratio 2, so the logo's legibility can be judged.
  - Confirm the hero's layout numbers at 1440 x 900 and 390 x 844 match `152ee78` with a short script. Do not run the full `tools/browser-check.mjs`: this round changes only the stars, and Dan asked not to repeat long runs for small changes.
- Put the films and sheets in `.scratch/review-out/r9/`.

## Records

Add a "CORRECTIONS-9" section to BUILD.md and note the mark in README's line on the hold and blast.
