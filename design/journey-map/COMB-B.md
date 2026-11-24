# Polish round 2, part 5: the fine-toothed comb, B (the drawings)

Dan, 2026-11-24, 4:02 AM ET: "does this drawing look nice or messy" (ygdrasil), "are these things intuitive?", "nothing should be looked at only in a vacuum, needs to be both".

Read `BRIEF.md` first, then `AUDIT-R2.md` (group C, drawing craft, above all). Ids in brackets point at the audits as in `COMB-A.md`: L-n the Opus look report (`audit-r2/opus-look.md`), aL-n and aB-n astra's look and behaviour reports (`audit-r2/astra-look.md`, `audit-r2/astra-behaviour.md`). Parts 3b (`GLIDE.md`) and 4 (`COMB-A.md`) have run before this one; keep everything they did, and keep part 3b's frame cost.

## The map's hand

Every drawing on the chart is ink line work: Paper strokes on the dark land and sea, one family of stroke weights, closed silhouettes that read at a glance, sparse hatching that runs one way, no blur filters, no airbrushing, nothing that looks like a letter or a word. Each drawing below must, at the overview on Dan's phone (412 x 730) and on desktop (1440 x 900) and at the closest zoom a visitor reaches (a stop hold, a find's view, explore's deepest zoom):

- read as what it is at first glance, and as nothing else;
- be in the same hand as its neighbours (stroke weight, detail, style);
- have no line that crosses another without meaning, no gaps or seams, no stray ends;
- sit at a size that fits its importance beside its neighbours, clear of labels.

Keep each find's behaviour, hit area and animations unless an item says otherwise; change the drawing.

## The drawings

- **B1. Yggdrasil** (Dan named it). Today it reads as clouds or broccoli and its parts tangle [L-4, aL-3, aB-3]: the crown is five separate scalloped puffs on spokes, spread like a diagram, so it has less weight than its roots; the hatching inside runs a different way in each puff (nearly level in the outer ones), like rain or scribble; the trunk ends in a flat lid under the crown instead of forking; the added limbs run through the bough and puff outlines and stop in stubs in the gaps; a long level line at the trunk's foot cuts across the roots; rootlets cross the letters of URD'S WELL; Nidhogg at the roots reads as a snail and Ratatoskr on the trunk as a squiggle, legible at no zoom a visitor can reach; the right root runs far out into empty land and ends in a spike. Make it one great ash, the world tree, keeping its place, its footprint, its roots' spread, the eagle at the top and the well with its rings: a crown that reads as one canopy (its masses vary in size and overlap, with a few windows where limbs show through; not a row of separate clouds, not one smooth blob) with a living, leafy edge; hatching one way, or short arcs that follow the edge; a strong trunk that forks into three or four limbs that taper and join cleanly, clipped where they meet an outline; three great roots that taper. Nidhogg (a coiled dragon gnawing a root) and Ratatoskr (a squirrel with a big tail, mid-run on the trunk) are drawn large enough to read at the stop hold zoom with one clear silhouette each, or left out. The well's label stays clear of every line. Check the crown's silhouette with no inner strokes first, then at the overview size.
- **B2. The mist of 2020** is Gaussian-blurred white blobs: a smudge at the overview and airbrushed fog with a hard-edged blur box close in, the only drawing in another hand; the stepped glyphs inside it cannot be told apart [L-9]. Draw it as layered wavy ink strokes over a faint fill, keep the wipe and its mask, and make the glyphs read as what they are, or drop them.
- **B3. Jormungandr's surfaced stretches** are flat, parallel, round-ended bands: rods or capsules at the overview, zipper belts close in; the pad above his head reads as an empty checkbox [L-10]. Draw each stretch as an arched hump of the serpent's body rising from the sea, with a broken waterline at its feet, tapering into the water; draw the pad as what it stands for, or drop it.
- **B4. The hoards' five dig marks** read as a tiny garbled word ("u x ^"), like a typo on the chart [L-11]. Draw each as a small mound of disturbed ground with a spade's nick, never letter-shaped, and never an X (the X is the work's mark).
- **B5. The horn and the hammer on the map.** The horn is a curved band of constant width with square ends: a pipe elbow or a boomerang [L-12]. Taper it to a curled tip with a rim at its mouth and two bands. The horn's own view is mostly empty sea where the sky stars read as TV static [round 1 L-18, L-29]: frame it so the horn and its shore fill the view. The hammer's map drawing reads as a jetty or a cake stand: draw a short-handled hammer with a heavy head standing on its stone.
- **B6. The ravens' gift** on the branch is a plain white bar that reads as a glitch [L-25]: draw it as the thing it is.
- **B7. The game's shield wall.** At play size each intact segment reads as a row of brackets or bent pipes: the round shields are cut flat at the segment's edges, top and bottom, with their bosses left as loose dots, at device scale 1 and 2 [aL-13]. Fit the shields inside each live cell so every intact one shows its whole round rim; keep the three segments, their gaps and their hit geometry, and draw no cover outside it.
- **B8. Three pairs of small trees touch** and read as one odd shape: a pine's lower corner on a round crown in the north grove, and two pines sitting on round crowns east of Yggdrasil and in the south island's grove (T06 and T20, T41 and T42, T57 and T60 in astra's inventory, with their coordinates) [aL-14]. Move each just enough for a clear gap, judging by the crowns' boxes, not the trunk points; keep the groves' density and the simple tree glyphs.
- **B9. The hammer and the horn keep a found look.** After the game is played or the horn sounded, both return to the map looking as they did before, while every other find keeps a sign (a filled marker, an open chest, the cleared mist, the well's rings) [aL-15]. Give each a small lasting sign on its own drawing once found, in the map's ink, not by colour alone, in the same spirit as the others.

Not in scope: the hammer game's layout (Dan asked for "a space invaders like game", 2026-11-23); the creatures' and finds' animations; the X; the coasts.

## Checks

- All tests pass: `node tools/check.mjs`, `steps-test`, `nova-test`, `depth-test`, `layout-test`, `explore-test`, `finds-test`, `motion-test`, `hammer-test`, `frame-cost-test`, `frame-performance-test`, `frame-render-test`, `tools/origin-check.mjs`, and `tools/frame-cost.mjs` with no worse p95 than part 3b's last table. Update tests only where this brief changes what they pin, and say which and why; re-record the `finds-test` digests that change.
- For each drawing, screenshots before and after with the local headless Edge (127.0.0.1 only; its profile and captures in the run folder your prompt names, never in the repository) at device scale 2: the overview at 412 x 730 and 1440 x 900, and its closest zoom (the stop hold or the find's view, explore's deepest zoom for Yggdrasil, the game's field for the shield wall). List them in the report with one line on what each shows.
- The gzip budgets in `tools/check.mjs` hold.

## Rules

- You may write only these files, all under `design/journey-map/`: `art.mjs`, `data.mjs` (drawing data and views only), `find*.mjs` (the drawings, the found looks and the horn's view only), the test files in `tools/`, `dist/journey-map.html`, `dist/journey-joined.html` and `joined.html` (the last three only through `node tools/pack.mjs` and `node tools/pack-joined.mjs`), and your report `COMB-B-BUILD.md`. The browser's profile and captures go only in the run folder your prompt names.
- Never touch `depth.mjs` (not even a comment), `trip.mjs`, `hero-copy/`, the briefs and other build reports, or anything else outside `design/journey-map/`.
- Never run git, never install anything, never use the network (the local headless Edge on 127.0.0.1 is not the network), never start reviewer agents or other agents.
- If a rule stops you from doing something this brief asks, leave it out and say so in your report. Do not work around a rule.
- Plain ASCII punctuation in `COMB-B-BUILD.md`.

## Report

`COMB-B-BUILD.md`: for each drawing, what you changed and why, with the before and after screenshots; each test you changed and why; the output of every test run; anything you left out and why; what the review should look at.
