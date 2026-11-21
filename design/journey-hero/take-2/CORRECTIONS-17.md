# Round 17: journey hero, second take: Dan's eleven notes on versions 26 and 27

This brief is for the builder. Dan, 21 November, 9:33 to 9:42 AM ET, left eleven comments on the preview. The preview recorded each one's loop time and stage position (viewport 1474 x 996, loop 97.691 s). Line numbers below are as of `12ea0de`.

| Note | Loop time | Where | Dan's words |
|---|---|---|---|
| R1 | 2.43 s (Photoshop +2.43) | 85 % across, 48 % down, the levels sliders | "The colors should change as the mouse changes them, not pop in" |
| R2 | 13.96 s (Illustrator +5.91) | 64 % across, 39 % down | "This frame and the next pop the rectangle back for some reason" |
| R3 | 16.70 s (Illustrator +8.65) | 51 % across, 45 % down | "Same here" |
| R4 | 19.80 s (Illustrator +11.75) | 62 % across, 29 % down | "This broke, its behind the rectangle and same for the transit map" |
| R5 | 31.96 s (InDesign +10.77) | 60 % across, 49 % down | "All of these panels move backward suddenly" |
| R6 | 32.94 s (InDesign +11.75) | 82 % across, 34 % down | "The ball should come out of the top of the export button and have momentum up then down" |
| R7 | 33.93 s (InDesign +12.74) | 46 % across, 70 % down | "There is too big of a pause between the ball landing and then morphing" |
| R8 | 43.00 s (InDesign +21.81) | 38 % across, 76 % down | "sinking into the floor is too fast" |
| R9 | 77.72 s (After Effects +15.26) | 49 % across, 74 % down | "The screens sink after the first loop", then, in the thread: "That's not what I was saying about after effects", "They sink like a pixel or two" |
| R10 | 93.82 s (Figma +13.92) | 30 % across, 70 % down | "Please make the top of the laptop flush with the bottom half" |
| R11 | 97.34 s (Figma +17.44) | 36 % across, 70 % down | "Close the laptop before making it sink, make sure the sink is still on time with the others. the laptop shouldnt be closing while the others already sank" |

**Changed at 10:16 AM ET, after the first build was sent:** R9 was misread. Dan: "That's not what I was saying about after effects", then "They sink like a pixel or two". Revert the first build's R9 (After Effects sinking after one play); the R9 below replaces it.

**Changed at 10:52 AM ET:** on R5, with a screenshot of the panels just after they move back, Dan: "the backwards position on these is the correct one, not what they were before". So the finished pictures' places are the reference: under rule G the build moves to where the finished picture sits, never the other way. R5 below says it for InDesign.

## Follow-up after the first build (`db65772`), 11:20 AM ET

The first build is reviewed: R1, R4, R6, R7, R8, R10 and R11 look right in a browser, and the checks print `all clean`. Build the three items below on top of it, and keep everything else it did.

**F1. R5 went the wrong way.** The first build raised `approvedDocument()` to the build's heights (spread pages at face 0.084; cover, post and e-blast at 0.088). Dan wants the opposite ("the backwards position on these is the correct one"), so the finished document's version 27 heights are the reference:
- Restore `approvedDocument()`'s pages to version 27's (`12ea0de`, line 208): the spread's two pages, the cover, the post and the e-blast at lift 0.06, thickness 0.02 (face 0.080). The pages panel's thumbnails stay as they are.
- Then lower the build to those heights. From the moment each is placed, the spread's pages, the cover, the post and the e-blast sit at face 0.080. What is drawn onto them sits at most a few `LAYER_STEP`s above that, and never lifts a page. A carried picture lands at the height of the page it lands on.
- At 32.350 s nothing moves (rule G). Keep the first build's fix that stops the e-blast's overlapping lines collapsing backward, at the new height.

**F2. R9 was built from my first, wrong reading.** The first build makes After Effects play once (sink at `land + 1.6`). Revert that: After Effects plays twice and sinks at `land + 3.2`, as in version 27. Then build R9 as written below: each device's layers start from that device's own base, no device body or screen face moves through any play or restart, and `stacks.screen` gets the same fix. Expect the loop to grow by about 1.6 s, to about 99.5 s; the ceiling stays 100 s.

**F3. Typed letters now break up into dots (a regression from R3).** Measured in Chromium at 1474 x 996, dpr 1:
- From the start of `labels` (12.43 s) until `badge` ends (14.082 s), the upper map's cross-street names and "King Street W" show as broken dots and fragments, not letters.
- At 14.09 s, when `kMap` replaces them, they turn into whole letters in one frame. Version 27 shows whole letters in all of those frames.
- My reading of the cause: the letters-only crops are drawn with `cut: true`, which is alpha-tested at 0.5. Small anti-aliased type has few texels above 0.5, so most of each stroke is cut away.
- `cityLabels` and the e-blast's `mailTitle` use the same mechanism, so they need the same fix. So does any other piece this round made `cut: true` from anti-aliased art: list them in BUILD.md.

What is required: once a letter is revealed, it looks exactly like the same letter in the finished picture, with the same weight and colour and no gaps, and the swap to the finished picture changes nothing on screen. One way to do it is to give each letters-only crop a mask that is opaque wherever the finished letter has any coverage (alpha above 0, grown by one texel), coloured with the finished picture's own pixels. Then, wherever the mask shows, the pixels are exactly the finished picture's. Blending these pieces by alpha instead of testing it would also work.

You cannot render on the PC, so I will check the result in a browser. Add a Node check that at least proves each mask covers every texel where its finished letters have coverage. Its negative control is a 0.5 threshold, which must fail.

**Not in this run:** Dan also asked (10:55 to 11:14 AM) for one tablet and one phone model in every scene, bigger, and "high end". That comes as R12 in a separate brief once he has approved a mock. Do not change any device's size, shape or look in this run.

Everything in `CORRECTIONS-2.md` to `CORRECTIONS-16.md` still holds unless it is changed here. The motion stays hard-edged: no fades and no blur. Nothing here touches anything outside `design/journey-hero/take-2/`.

## G. The swap rule (R2, R3, R5 and their kin)

Several notes are one fault. A scene builds something out of parts on the screen, then replaces the parts with the finished picture in one frame, and the finished picture does not sit where the parts were. So something jumps, or something the parts hid comes back.

**Rule:** wherever a build, a drag or a typed word is replaced by its finished picture, nothing moves and nothing appears or disappears except what the action itself adds. Every picture keeps its projected corners (within 0.1 px at 1474 x 996) and its face height (within one `LAYER_STEP`) across the replacement. Fix the cause, not the frame. The finished picture's place is the reference (Dan, 10:52 AM, on R5): make the build's layers sit at the finished picture's height and register exactly with it.

Known places today, measured in a browser at the action's end, 2 ms each side:

| Where | Action end | What jumps |
|---|---|---|
| Photoshop | `black` 2.296 s, `white` 2.991 s | the photo's colours and the histogram (R1) |
| Illustrator | `badge` 14.082 s | the drawn box vanishes, the lines it hid return, and the whole upper map shifts about 1 px when `kMap` replaces the build (R2) |
| Illustrator | `block` 14.528 s | the same drawn box on the lower map |
| Illustrator | `cityLabels` 16.806 s | the lower map shifts about 1 px when `kLoc` replaces the build (R3) |
| InDesign | `map` 22.667 s, `loc` 25.233 s | a dropped picture does not land at the height it was carried: the map is carried at face 0.080 and placed at 0.084; the location map lands in the pages panel at 0.073 |
| InDesign | `coverTitle` 27.066 s | the cover drops 0.004 (`coverDecor` at face 0.088, `kCover` at 0.084) |
| InDesign | `postButton` 29.779 s | the post jumps forward 0.021 (face 0.088 to 0.109) |
| InDesign | `mailFlyer` 32.350 s | `approvedDocument()` puts every page at face 0.080: the post and the e-blast drop 0.029 and the cover and spread 0.004 (R5) |

Look for any other place of the same kind and fix it the same way; list what you found in BUILD.md. A release that is meant to change the picture (a clip landing on the timeline, a frame filling with its photo, a tool changing in the rail) is not a swap.

## R1. Photoshop: the colours follow the handles

Today `editedPhoto` (lines 813 to 852) picks the photo by `done()`: `photoRaw`, then `photoHalf` once `black` ends, then `photoLevels` once `white` ends. The handles move smoothly, but the colours change in one frame at each handle's release. The histogram swaps from `histoDark` to `histo` the same way.

- While the black handle moves, the photo's colours change continuously from `photoRaw` to `photoHalf`, by `handed(s, 'black', t)`. While the white handle moves, from `photoHalf` to `photoLevels`, by `handed(s, 'white', t)`. Before, between and after the slides, the photo is exactly today's picture.
- Do it as a per-pixel mix of the two neighbouring pictures on one piece. For example, add an optional second picture and a mix amount to a piece, and mix in `sq.mjs`'s fragment shader. Do not step through extra pictures, and do not fade a piece against the screen.
- The histogram follows the same handles. Make it one set of 48 bars whose heights move: from `histoDark`'s bars at the start of `black`, to bars tracing the graded histogram (today's `histo` shape) at the end of `white`, by `handed()` over both slides. The graded histogram becomes those bars from then on, so nothing swaps at the end. No crossfade of two pictures.
- The heal clicks, the sky and the grade stay as they are.

## R2. Illustrator: the badge and the block draw as themselves

Today `badge` (13.902 to 14.082 s) and `block` (14.348 to 14.528 s) call `drawnFrame()`. It grows an opaque untextured box (`grey`, `dark`) that hides the streets and labels under it. At release the box goes and the finished picture appears.

- While each is drawn, what grows from the drag's start corner to the cursor is the finished shape itself. Use the finished picture cropped to the growing rectangle, registered exactly on its map, as InDesign's drawn shapes do with `drawnRegion()`. Nothing else in that rectangle changes.
- At release, only the cursor and the rail change. The rest of the map does not move (rule G).
- `drawnFrame()` stays for the artboards (`board0`, `board1`): an artboard is an opaque page, as today.

## R3. Illustrator: typed labels show only their letters

Today `mapTyping()` (line 1317) shows each label as a window of the finished picture (`kMap`, `kLoc`), placed at lift 0.09. That is above the build's own faces, so the window is misregistered, and it shows whatever the finished picture has inside its rectangle. On screen each label arrives as a rectangular patch with the letters in it.

- A typed label shows only its letters, appearing letter by letter at the caret, as today. Nothing else in its rectangle changes: no ground, no lines, no offset.
- One way: draw the letters from a picture of the label alone on a transparent ground, as a cut-out (`cut: true`; `sq.mjs` already discards below alpha 0.5). Register it exactly on its map, clip it at the typing edge, and keep the caret as today. Build such pictures from the same drawing code as the finished map, so the letters match it pixel for pixel.
- This covers `labels`, `title` and `cityLabels`, and InDesign's `mailTitle`, which also uses `mapTyping()`.

## R4. Illustrator: the exports stay in front of everything they pass over

Today `mapExport` (19.534 to 20.034 s) and `locExport` (20.394 to 20.894 s) carry the maps to the dock with `travel()`. The maps are hidden behind the artboards until they clear them. This came back in round 15.

The cause: `travel()` tags its pieces `action: key`, the picture's key (`map`, `loc`, `photo`). `carriedStack()` (line 1484) keeps only pieces whose `action` equals `P.action`, the active action's id (`mapExport`, `locExport`, Photoshop's `export`). The two differ, so the stack is empty and `clearCarried()` never raises these pictures. Since N2 removed the arc, the map is carried at lift 0.055, no higher than the artboard's own face, and nothing raises it.

- Every carried or travelling picture, in every app, is in front of everything it passes over at every instant, and stays flat: N2's one height on the page, raised only along the view. The cursor stays in front of it.
- Fix the tagging so every carry is seen by `carriedStack()`, including Photoshop's export and InDesign's drags.

## R5. InDesign: the panels sit back from the start

At `mailFlyer`'s end (32.350 s) the build is replaced by `approvedDocument()`, which places every page at lift 0.06, thickness 0.02 (face 0.080). The build had the post at face 0.109 (since `postButton` ended) and the cover and spread at 0.084, so all of them move back in one frame.

Dan: "the backwards position on these is the correct one, not what they were before", then, with a screenshot of the finished document just after the move (arrow tool, cursor on Export): "this is how it should look". So:
- Every page and panel sits where `approvedDocument()` puts it (face 0.080) from the moment it is placed, all through the build. That covers the spread's pages, the cover, the post, the e-blast and the pages panel's thumbnails.
- What is drawn onto a page while it is built (typed words, drawn shapes, a dropped photo) sits on that page, at most a few layer steps above it, and never lifts the page itself.
- At 32.350 s nothing moves (rule G).

## R6. The ball comes out of the top of the Export button, with momentum

Today the pop (`ballAt`, line 293) grows the ball out of the button's face along the screen's normal with `EASE.wipe`. So it slows almost to a stop in front of the button: between 32.95 and 33.00 s only 358 pixels change, against about 5,000 per 0.05 s in flight. Then the arc starts with a fresh upward speed. Dan wants it to come out of the top and move like a thrown ball.

- **Where it comes out:** the top side of the Export button. It starts small, inside the button just below its top side and centred along it. It comes up through the top side, clipped at that side's plane, so nothing of it shows below the button's top edge until it is clear. It grows to full size (0.6 diameter) during `pop`. It never touches the screen, the bar or the button: move it out from the screen at least as fast as it grows.
- **How it moves:** from its first frame to touchdown, its centre follows one ballistic path:
  - horizontal and depth motion linear in time;
  - height a true parabola under constant gravity;
  - launched upward, so it rises, slows, peaks about one diameter above the button's top, then falls.
  - There is no stop and no ease anywhere between the pop and the fall, so the velocity is continuous.
  - The flight lasts `pop + arc` (1.1 s, as now).
- **Landing:** it lands sitting on the floor at the centre of the three shapes' combined footprint, as now, and still never bounces. Its shadow follows it.
- The Export button and the cursor behave as today.

## R7. No pause between the landing and the split

Today the ball lands at 33.832 s, rests 0.15 s (`rest`), and the split starts on `EASE.wipe`, which barely moves at first. Between 33.85 and 34.00 s nothing on screen changes.

- `rest` becomes 0: the split starts on the frame the ball touches down.
- The split moves visibly from its first frame. Use an ease that starts at speed (`EASE.enter`), not `EASE.wipe`. Its first frame still equals the ball, and its end still equals the three red shapes exactly.
- `hold` and the wipes stay as they are.

This applies to all four scenes that export to the floor.

## R8. The sink is slower

`sink` goes from 0.5 s to 1.0 s, with the same curve, in all four scenes, InDesign's `return` included.

## R9. The exported screens never move while they play

Measured on version 27 at 1474 x 996:
- After Effects' two phones rise 1 px while the motion builds (76.6 to 77.0 s), then drop 1 px when it restarts at 77.796 s.
- Premiere Pro's phones rise 2 px and drop at its restart, 60.363 s.
- The tablet does not move.

The cause: `floorPainter()` (line 459) puts every layer at `stacks.floor + LAYER_STEP`, and `stacks` (line 446) is shared by every painter in the frame. The phones are painted after the tablet, so their faces start above however many layers the tablet has drawn. They move whenever that count changes.

- Each device's layers start from that device's own base height. A layer's height depends only on its own device and its place in that device's stack, never on what another device shows.
- Through every play and every restart (Premiere Pro, After Effects, Figma), each device's body and the faces of its screen keep their projected corners within 0.1 px. Only the content meant to move moves.
- After Effects keeps its two plays, with the sink at `land + 3.2` as before. Revert the first build's R9.
- `screenPainter()` shares `stacks.screen` the same way, which may be one cause of rule G's 1 px map shifts. Fix it there too, keeping pictures that overlap on the screen in their drawing order.

## R10. The laptop's lid sits flush on its deck

Today the lid is `lidH` = (1.55 - 0.08) / 1.6 + 0.08 = 0.999 deep, but the deck is 1.1 deep. `poseLid()` also lifts it 0.03 when shut (`lift = 0.03 * max(0, -sin theta)`). So the shut laptop shows a 0.1 strip of the deck, with the trackpad, in front of the lid, and the lid floats above the deck. The same mismatch shapes the red block that wipes into the laptop.

- When shut, the lid's footprint is the deck's: the same width and depth, all four edges aligned, resting directly on the deck with no gap.
- Make the lid as deep as the deck. Put the extra 0.1 into its lower bezel (the chin at the hinge), so the screen's picture keeps its size, its 16 : 10 shape and its distance from the lid's top edge.
- Keep the hinge on the deck's back top edge. When open at 12 degrees, the lid's lower edge meets the deck's back edge as now. Let `lean`, and the tablet and phone placed from it, follow the new `lidH`; report the shift.
- The keys and trackpad must not show through the shut lid or hold it up. Sink them to the deck's top, or leave them out while the lid is shut and turned away.
- The red block for the laptop (`formats[0].shape`) equals the shut laptop exactly. The wipe still turns the block into the laptop with nothing moving.

## R11. Figma: the laptop closes, then all three sink together

Today the sink moves every piece down by one depth: the tallest top (the open lid, about 1.1) plus 0.02. So the tablet and phone (about 0.09 thick) are gone in the sink's first tenth, while the open lid takes the whole sink. Cut by the floor, the lid looks as if it is closing while the others have already gone.

- After the 3.0 s cycle, the lid closes from 12 degrees to shut over `lid` (0.4 s), with `EASE.wipe`, the reverse of its opening. It ends flush, as in R10. The tablet and phone hold their last frame meanwhile.
- Then the sink: all three start together and are gone together.
- **In every scene, each export sinks by its own height**: its tallest top plus 0.02, over the same span and curve. That way every piece starts and finishes together: InDesign's stack (0.3 tall) with its phone and tablet, and Figma's shut laptop with its tablet and phone. x and z stay fixed and the floor's clip stays, as in S2.
- Figma's scene gets `lid` longer.

## Timing

```
BALL = { pop: 0.3, arc: 0.8, rest: 0, split: 0.6, hold: 0.15, become: 0.6, stagger: 0.1, lid: 0.4, sink: 1.0 }
```

- Premiere Pro's and After Effects' sinks start at `land + 3.2`, as before (R9's first reading is reverted).
- Figma: `land + 3.0`, then the lid closes over `lid`, then the sink.
- Report the new loop length and every scene's start. Expect about 99.5 s. The checks' ceiling stays 100 s.

## Checks

**Node** (`tools/round17-checks.mjs`, run from `tools/checks.mjs`, with `--controls` for the negative controls), on `frameAt()` and the scripts:

- **G:** at every action end in the loop (end ± 0.001 s), every document picture keeps its projected corners within 0.1 px at 1474 x 996 and its face height within one `LAYER_STEP`, apart from what the action adds. It must pass at every place in G's table.
- **R1:**
  - During `black`, the photo's mix equals `handed(black)`; during `white`, `handed(white)`. It is exactly 0 or 1 before, between and after.
  - The 48 bar heights change by no more than the handles' step allows at 0.01 s, and never jump at a slide's end.
- **R2:** while `badge` and `block` are drawn, no untextured opaque piece lies over either map. The drawn piece shows the finished picture registered within 0.1 px.
- **R3:** every typed label is a cut-out registered within 0.1 px on its map. No label piece shows ground.
- **R4:** at 0.01 s steps through every carry in every app, after the frame's separation and `clearCarried()`, each carried face is above every face it overlaps on screen by at least one `LAYER_STEP` along the view. Its projected corners match one flat height (N2's check) within 0.1 px.
- **R6:** at 0.01 s steps from the Export click to touchdown, in all four scenes:
  - the vertical velocity is continuous and the vertical acceleration constant (within 1e-6 per step), with x and z linear;
  - the first vertical velocity is upward and the peak is above the button's top;
  - while emerging, nothing of the ball shows below the plane of the button's top side or behind the screen's face;
  - it rests on the floor (1e-6) at the footprint's centre.
- **R7:** the split starts on the touchdown frame, and the pieces' footprint moves on its first 0.01 s step.
- **R8, R11:**
  - every sink lasts 1.0 s, and Premiere Pro's and After Effects' sinks start at `land + 3.2`;
  - every export's pieces are all above the floor at the sink's start and all below it at its end;
  - no export piece of a scene is gone more than 0.01 s before the others;
  - Figma's lid is shut (within 1e-6) before its sink starts.
- **R9:** at 0.01 s steps through every play on the floor, and 0.001 s either side of every restart, each device's body and the faces of its screen keep their projected corners within 0.1 px, and each face's height depends only on its own device's stack.
- **R10:** when shut, the lid's footprint equals the deck's within 0.001, with no gap between them, and no key or trackpad face above the deck's top. The laptop's red block equals the shut laptop.

**Negative controls**, each of which must make its check fail:
- restore the `done()` picture choice in Photoshop;
- restore `drawnFrame()` for the badge;
- move a label's window back to lift 0.09;
- restore `action: key` in `travel()`;
- restore `approvedDocument()`'s lifts;
- put an ease between the pop and the arc;
- set `rest` back to 0.15;
- give the lid its 0.03 lift back;
- sink every piece by one depth again;
- share one floor stack across the devices again.

Keep every other check clean; update earlier checks only where a number changed here, and say which. `node design/journey-hero/take-2/tools/checks.mjs` must print all clean.

**Browser:** none on this machine. The review films and compares frames in the cloud. Do not take screenshots to judge the work.

## Records

- Add a "CORRECTIONS-17" section to BUILD.md: each note, its cause, what changed, what you found under rule G, and the new loop length and scene starts.
- Update README's timetable, its loop length, "Exports that play", and the Photoshop and Illustrator scene notes.
