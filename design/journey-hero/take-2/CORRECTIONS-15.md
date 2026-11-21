# Round 15: journey hero, second take: the exports pop out as a sphere, and Dan's four preview notes

This brief is for the builder. Dan, 21 November, 6:31 to 6:44 AM ET. He left four comments on the preview. The preview recorded the loop time and stage position of each (viewport 1474 x 996). Then he wrote in the thread and chose on a card.

| Note | Loop time | Where on the stage | Dan's words |
|---|---|---|---|
| N1 | 24.99 s (InDesign +3.80) | 57 % across, 28 % down | "remove this red outlione", then: "th eindesign screne with the red bounding box around the amenities map" |
| N2 | 30.56 s (InDesign +9.37) | 63 % across, 53 % down, on the cover page | "This moves forward for some reason." |
| N3 | 33.52 s (InDesign +12.33) | area 23 to 71 % across, 59 to 89 % down, over the landing exports | "This doesnt look right", then: "This also goes way too fast" |
| N4 | 41.50 s (InDesign +20.31) | area 0 to 81 % across, 52 to 100 % down, over the floor | "This into the next frames where it goes back into the screen doesnt make sense either." |

Then, in the thread: "I think for the exports, when export is clicked, a 3d sphere pops out of it upwards and lands on the floor then splits into the export shapes then morphs into the device/asset".

Asked how the exports should leave, he chose "Sink into the floor": "The exports drop straight down through the floor behind a hard edge, then the next app starts."

S1 replaces round 13's E1 (peel, tip, split, become). S2 replaces E2 (the return played backwards). N3 and N4 are answered by S1 and S2. Everything else in `CORRECTIONS-2.md` to `CORRECTIONS-14.md` still holds unless it is changed here, including round 13's U1 and I2: the landed layouts, their alignments and the labels do not move. Nothing here touches anything outside `design/journey-hero/take-2/`, and `public/` stays untouched.

## N1. No selection box on the amenities map

Today the map gets a red selection outline and eight handles once it is placed. Two places draw it:
- `editedInDesign`, once `map` is done;
- `approvedDocument`, the finished document.

So it stays from about 22.7 s to the end of InDesign. Remove both. The map is placed and shown as it is today, with no outline and no handles.

The Pages panel's red background behind the amenities spread is the panel's page selection. Dan did not pin it, so it stays.

## N2. A dragged picture slides flat across the screen

Every drag on a screen lifts the carried picture toward the viewer in an arc: `+ 0.08 * sin(pi p)` on its lift. That is in `travel()`, `dragPicture()`, Figma's `copies`, and the grey rim that travels with a dock picture. Because the screen is seen at an angle, the arc moves the picture out of its straight path in the picture. Dan saw this on the cover page when its photo is dragged to the post and the e-blast.

- A carried picture keeps one height above the screen's face from pickup to drop: its placed height. It moves along a straight line in `HAND` progress, as it does today.
- Where it must pass in front of taller content, raise it only along the view direction. This is round 8's G1 `clearCarried` idea, which does not move it in the picture. Extend that so it clears any face the picture overlaps, not only near ties.
- This applies to every app's drags.

## S1 (major). Export pops a sphere that becomes the exports

This covers the four exports that land on the floor: InDesign, Premiere Pro, After Effects and Figma. Photoshop's and Illustrator's exports carry their work into the next app as today and get no sphere.

The motion stays hard-edged: no fades and no blur. There is no bounce or squash on landing. The ball's arc is the one curve that is not `EASE.wipe`, because it falls under gravity.

Starting numbers, at `PACE` 1, as one table so Dan can tune them:

```
BALL = { pop: 0.3, arc: 0.8, rest: 0.15, split: 0.6, hold: 0.15, become: 0.6, stagger: 0.1, lid: 0.4, sink: 0.5 }
```

The ball is one red superquadric (`tone: 'red'`, `e: [1, 1]`). `sq.mjs` already draws a ball, and it draws anything between a ball and a sharp box, so every morph below is an interpolation of `p`, `s` and `e`. Give the ball the flat-lying rotation of the shapes it becomes from the start. A ball does not show its rotation, so nothing has to turn later.

The beats:

1. **Pop (`pop`).** At the Export click (the start of the scene's `export` action), the ball comes out of the button's face. It starts no bigger than the button, with its silhouette inside the button. It grows to full size as it moves out from the screen along its normal and up. Clip it at the button's face plane until it is clear, so it reads as coming out of the button rather than appearing in front of it. Full size is a diameter of about 0.6 world units, about the width of the phone it will help make.
2. **Arc (`arc`).** One ballistic arc to its resting place:
   - Horizontal and depth motion are linear in time. Height follows a true parabola (constant downward acceleration).
   - It rises clearly above where it left the button, about one diameter, then falls in front of the screen.
   - It comes to rest sitting on the floor (its bottom at `y = 0`) at the centre of the combined footprint of the three shapes it will become.
   - Lower the peak only if the stage box needs it, and report the height used.
   - It never passes through the screen, the bar, the button or the floor. Its shadow on the floor follows it, from the existing shadow map.
3. **Rest (`rest`).** It touches down and stops dead. Its height never rises again after touchdown.
4. **Split (`split`, `EASE.wipe`).** The ball becomes one piece per export, three in every scene:
   - InDesign: the booklet stack, the phone and the tablet.
   - Premiere Pro and After Effects: the tablet on its side and the two phones.
   - Figma: the laptop (closed), the tablet and the phone.

   At the split's first frame, the three pieces are exact copies of the resting ball, so the frame matches the one before it. They move apart along the floor to their places. At the same time, each morphs from the ball to its **export shape**: a plain red block with the exact footprint and thickness of its finished format.
   - The stack's block has the stack's height.
   - A device's block has its body's thickness and corner rounding.
   - The laptop's block is the closed laptop: the deck with the lid shut on it.

   Each piece's bottom stays on the floor throughout.
5. **Hold (`hold`).** The three red shapes rest, so they read as the formats' shapes.
6. **Become (`become`, `stagger`).** One hard wipe crosses each shape left to right, in world x, with `EASE.wipe`. The pieces start `stagger` apart, left to right across the row.
   - Behind the wipe's edge is the finished format, in exactly the landed pose round 13, U1 and I2 give it today. Ahead of the edge is the red shape.
   - The two share one clip plane with opposite signs, so there is never a gap or an overlap at the edge.
   - Because the shape and the format have the same bounds, the shape turns into the format.
   - The laptop's lid rises from shut to its 12 degree lean over `lid` after its wipe ends.
   - **Figma's laptop no longer slides in from the top left.** Dan's new idea, that the sphere splits into the shapes and they morph into the devices, replaces that 19 November note. Say so in BUILD.md.

After the beats:
- **Plays start** on a device only once its wipe has ended, and on the laptop once its lid has opened. They stay in step with the big screen as today.
- **Labels** start from the last piece's become end, with their existing entrances.
- **InDesign's** land, pickup, opening and leaf turns follow as today.
- **The screen** keeps showing the finished work throughout. Figma's three frames stay on its canvas.
- **The cursor** clicks Export, then stays still and unpressed. Where it overlaps the ball, it stays in front, as it does over everything. Every hand rule from round 7 holds.

Remove round 13's sheet, peel and tip, and any code they leave unused (`sheetOf`, `carry` and `workIn` if nothing else needs them, and the `DROP` table). `DROP` is replaced by `BALL`.

Two renderer notes:
- `sq.mjs` keeps one clip plane per piece. If a format's piece already needs its own clip while it is being wiped or sunk, extend the renderer to two planes. `sq.mjs` is inside take-2. Do not drop either clip.
- The clips must hold in the shadow pass too.

## S2. The exports sink into the floor

Where the return plays today (the scene's last `DROP.back` before the next app), every export piece instead moves straight down over `sink` with `EASE.wipe`.
- Its x and z stay fixed.
- It is clipped at the floor plane (`y >= 0`), so it disappears behind the floor's edge, a hard edge with nothing faded.
- All pieces sink together. In InDesign that includes the copy lying open in front.
- When the sink ends, nothing of the exports remains, and the next app starts as today.
- The labels finish their existing exit by the moment the sink starts.

Remove `DROP.back`'s backwards play.

## Timing

- Each export scene grows by the new entrance less the old. The return is replaced by the sink.
- The loop's length follows: expect about 97 s. Raise the checks' loop ceiling from 92 s to 100 s, and report the new length and each scene's start.
- Nothing in the export may cross the craft list, the text or the page's edges at any size from 360 x 780 to 1920 x 1080. The ball's projected box stays inside the stage's box all the way through its arc.

## Checks

**In Node, at 0.01 s steps through every export and every sink:**
- No export piece exists anywhere before the Export click.
- Pop: the ball's silhouette starts inside the button's face. It is at full size by the end of the pop.
- Arc:
  - The ball's height has a constant second difference.
  - Its horizontal and depth position are linear.
  - It never goes below the floor.
  - It rests with its bottom on the floor (within 1e-6) at the centre of the three shapes' combined footprint.
- No bounce: after touchdown, its height never increases.
- Split:
  - At its first frame, each piece equals the ball.
  - At its end, each piece equals its export shape: footprint and thickness within 0.001, and the exact `e`.
  - Every bottom stays on the floor.
- Become:
  - The red shape and the format are kept on opposite sides of one plane, with no gap and no overlap.
  - The wipe's edge moves monotonically left to right.
  - No play starts before its wipe ends, or before the laptop's lid has opened.
- At rest: every piece equals today's (`e1e55af`) final pose, so the U1 and I2 alignment checks and the label checks pass unchanged.
- Sink:
  - Every piece's x and z are fixed.
  - Every piece is clipped at `y = 0` in every pass.
  - At its end, nothing remains above the floor.
- N1: no outline bar or handle lies on the map frame's (`ID.frame`) edges at any time in InDesign.
- N2: through every drag in every app, the carried picture's projected corners match those of the same rect lying at one constant height above the screen's face, within 0.1 px at 1440 x 900.

**Negative controls**, each of which must make its check fail:
- give the ball a bounce after touchdown;
- start one device's play before its wipe ends;
- leave one piece unclipped during the sink;
- restore the map's outline;
- restore the drag arc.

Keep every other existing check clean. Retire round 13's peel and tip checks, and say which ones you retired. `node design/journey-hero/take-2/tools/checks.mjs` must print all clean.

**In a browser (Playwright is preinstalled; see `tools/film.mjs` for the launch flags):**
- At 1474 x 996 (Dan's view), film each of the four exports at 0.05 s steps, cropped to the stage. Run from 0.2 s before Export to 0.4 s after the last piece is built. Film each sink the same way.
- At 390 x 844, film InDesign's export and sink.
- Film the e-blast photo drag (InDesign) at 0.05 s steps, cropped to the screen, before and after N2.
- Take a still of InDesign at 25.0 s, before and after N1.
- `tools/browser-check.mjs` reports UNAVAILABLE in this container. Run `node design/journey-hero/take-2/.scratch/review-out/r12/browser-r12.mjs design/journey-hero/take-2` once at the end instead (about 19 minutes).

Put everything in `.scratch/review-out/r15/`.

## Records

Add a "CORRECTIONS-15" section to BUILD.md, and update README's "Exports that play", its timetable and the loop length.
