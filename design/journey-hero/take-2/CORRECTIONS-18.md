# Round 18 corrections: one clip, one layout

Dan's note, pinned on v28 at Loop 73.78 s (After Effects 10.62 s, while the player plays): "This card layout inside the player looks different than when exported". And in the thread: "please make sure you catch inconsistencies like this".

Build on `6ee3a6d`. Change no time, size, place, picture or colour that this file does not name.

## What is wrong (read in the code at 6ee3a6d)

- The built comp puts the three list cards in a cascade. `ROWS` and `saas()` in `art.mjs` offset the rows by 0, 0.09 and 0.24 of a row's width (the comment calls it a still of the motion, "the last one is still on its way"). `constructedComp` draws the `rowA`/`rowB` tiles at `ROWS`, so the in-app viewer and its thumbnail show the cascade while the comp is built, and again between the end of play and the export.
- `animatedComp` in `stage.mjs` plays the clip. Each row slides in from the right in its `LAYERS[3..5][5]` window (1.2 to 1.7, 1.35 to 1.85, 1.5 to 2.0 clip seconds) and rests at `rx + offset * rw - parked * 0.75 * rw`, where `parked` is how far the row still had to go at 1.6 s. So the clip passes through the built cascade at 1.6 s and ends with the cards in a different place (a stack at the list's left edge).
- The player shows the clip while it plays, and the three exported screens (`playback`, shapes 4, 1 and 2) rest on its last frame. The still pictures `motWide`, `motTall` and `motSq` draw the cascade through `saas()`. So one design shows two card layouts, and which one you see depends on where and when you look.
- The head in the timeline does not match the frame in the viewer either: it is dragged to 1.45 s and parks at 1.6 s, while the viewer shows all three cards in place.

## C18-1 One clip, one layout (After Effects)

The export is the reference. Dan pinned the player as the odd one, and uneven steps read as a frame caught mid-motion, not as a designed list.

1. The cards rest in one stack, left-aligned at the list's x, in every format: `WIDE.rows[0]` in the wide frame and each format's own `rows[0]` in its own layout. Keep their heights, widths and row spacing. Drop the `[0, 0.09, 0.24]` offsets from `ROWS`, `saas()` and `animatedComp`, and drop the `parked` shift, so the clip lands each card exactly where it is built.
2. The entrance stays as it is: each card slides in from the right, one after another, in its `LAYERS` window with `EASE.enter`, and lands at its built place. The words, the ball's path, the keys and the graph do not change.
3. The comp you build is the clip's last frame. At clip time 2.0 s and after, the clip's frame equals the built comp exactly (words wiped in, ball landed, three cards in place). The still pictures `motWide`, `motTall`, `motSq`, `compWide`, `rowA` and `rowB` show that same layout.
4. The viewer always shows the frame at the head. While the comp is built, the head's drag (the `head` action) ends at 2.0 s instead of 1.45 s, and it parks at 2.0 s instead of 1.6 s. When play ends, the head stays at the clip's end (2.4 s), and the viewer and its thumbnail hold the clip's last frame until the export plays. Play still starts from 0 s. If moving the head touches anything outside the After Effects timeline lane, keep the head where it was and say so in the report.

## C18-2 One table for the motion layouts

The layouts are written twice today: `animatedComp`'s own table in `stage.mjs`, and the objects passed to `saas()` by `motWide`, `motTall` and `motSq` in `art.mjs`. They match now, but nothing keeps them matched.

- Put each format's layout in one exported table in `art.mjs` (the in-app tile at y 116, the y 104 tile, the player and tablet, the story, the feed square and its 184 px offset), and use it from both `saas()` and `animatedComp`.
- Add one pure function in `art.mjs` that returns a layout's card rectangles at rest. `saas()` and `animatedComp` both use it for where the cards land.

## C18-3 The same check wherever a design appears

Dan wants inconsistencies like this caught before he sees them. A design that appears in more than one place must look the same at rest in every place, apart from each format's own layout and its own chrome.

1. **A check in `tools/checks.mjs`, named `consistency`.** For After Effects: the built comp's pieces after `copies` and the clip's last frame (shape 3, clock 1) give the same rectangles for `wMake`, `wMove`, `redBall`, `rowA` and `rowB`, within 0.5 px in the 480 x 270 frame. For shapes 4, 1 and 2, the clip's last-frame card rectangles equal the rest rectangles from C18-2's function for that format. The head's lane position equals the clip time of the frame that the viewer shows, at sample times before play, during play, after play and during the export.
2. **A negative control in `tools/round17-checks.mjs --controls`.** Put a 0.09 rw offset back on one card in `animatedComp`'s rest position. The `consistency` check must fail.
3. **An audit of the other scenes, by reading the code.** For each design that is drawn in more than one place, list every place and compare what each place draws at rest: content, layout, position, count, colour and crop. That covers Premiere (the program monitor and its thumbnail against the three exported screens), InDesign (the spreads and their page thumbnails against the exported pages), Figma (the canvas frames against the prototype on the three devices), and any other scene whose work appears twice. Put the list in BUILD.md as a table, one row per pair, marked "same", "intended" (a format's own layout: wide against a tall story or a feed square; chrome such as play bars, story bars, feed headers, the tap dot) or "different".
   - Fix a "different" row only when the same design shows a different layout or content at rest in two places, the same way as C18-1 (the export is the reference), and add it to the `consistency` check.
   - If you are not sure whether a difference is intended, do not change it; list it as "unsure" with the two places and what differs.

## C18-4 What the cursor draws grows from where the drag starts (every scene)

Dan's second note, pinned on v28 at Loop 82.85 s (Figma +1.90 s): "The mouse draws these from top left but they grow from bottom left". The cursor drags each wireframe from its top-left corner to its bottom-right, but on screen the frame grows out of its bottom-left corner (cloud frames at 82.45, 82.65, 82.85 and 83.05 s, 411 x 730). `drawnFrame` in `stage.mjs` grows `[x, y + h * (1 - p), w * p, h * p]`, and the corner helpers are `topLeft = r => [r[0], r[1] + r[3]]` and `bottomRight = r => [r[0] + r[2], r[1]]`, so the growing piece and the cursor do not agree on which way is up. Illustrator's artboards (`board0`, `board1`) use the same `drawnFrame`.

1. Every shape the cursor draws (each `kind: 'draw'` action with a tool: the Figma frames, picture box and button, Illustrator's boards, badge and block, InDesign's blobs and buttons, After Effects' row and ball) keeps one corner fixed where the drag starts, and has its opposite corner under the cursor's tip in every frame of the drag, as Figma, Illustrator and After Effects draw. A marquee's selection box also runs from the drag start to the cursor; check it too.
2. Fix the cause where it is (the growing shape's anchor, or the mapping between the cursor's space and the board's), not by moving the cursor. The drags' paths, timing and end states stay as they are.
3. Add to the `consistency` check: for every such action in every scene, at five points of its duration, the shape's corner at the drag start stays put and its opposite corner is at the cursor's tip within 0.5 px in board units. Add a negative control that grows one frame from the opposite corner; the check must fail.

## Done when

- `node design/journey-hero/take-2/tools/checks.mjs` prints `all clean`, and `node design/journey-hero/take-2/tools/round17-checks.mjs --controls` makes every negative control fail at its gate, the new controls of C18-3 and C18-4 included.
- The loop is still 99.491 s, and no time changes except the head's in C18-1.4.
- BUILD.md has a "Round 18" part: what changed, the audit table, every earlier check that got new numbers (old and new), and anything you could not do or decided differently, with why.
