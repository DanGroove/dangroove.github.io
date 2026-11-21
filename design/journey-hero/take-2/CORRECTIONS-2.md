# Corrections, round 2: journey hero, second take

This brief is for the builder. It has three parts: what the two critics found in the corrected build (`341f94f`) and agreed to fix (part A), Dan's new requests made while they reviewed it (parts B and C), and the measurement (part D). Dan's words are quoted; where this brief and his words differ, his words win. Nothing here touches `public/journey/` (the first take), the home page, `src/`, `public/CNAME`, or anything outside `design/journey-hero/take-2/`.

Times are loop seconds in `341f94f`; they move as actions change. Every time below scales with `PACE`.

## A. Fixes from the critique (both critics agreed)

Both critics accepted this part, with the conditions now written into A2, A5, A6 and D2 (their "Agreement" sections, 19 November, about 23:50 UTC).

**A1 (major; C3 is not met for the LinkedIn post). The dropped photo must not cover the post and the e-blast as they are built.** `stage.mjs` line 974 calls `dragPicture(… key + 'Photo' …, 'kPhoto')` on every frame after the drop, so a plain copy of the photo lies over the post from 27.26 s and hides the band, foot, small blob, the typed title and the drawn gold blob until the finished `kPost` cuts in at 28.46 s; on the e-blast it hides the gold photo frame until 30.68 s. Draw the dragged photo only while the drag runs: `if (!done(s, key + 'Photo', t)) dragPicture(…)`. The cover already works this way (`travel`).
- Pass: frames every 0.05 s over 27.20 to 28.60 s and 28.95 to 30.80 s. The post's band, foot and small blob arrive with `postPhoto`; its title types visibly; its gold blob grows under the cursor; the e-blast's gold photo frame arrives with `mailPhoto`. At the end of `postButton` only the button changes; when the finished `eblast` replaces its construction nothing changes on screen. At each photo drop, the carried photo becomes the placed, frame-styled photo in one frame with no jump of more than 2 px at 1x, and no frame shows the frame empty.

**A2 (minor). The empty frame's cross and outline are drawn over the picture landing in it** (the last 0.25 s or so of the `map`, `photo` and `postPhoto` drags, and `mailPhoto`). Cause: frame outlines and diagonals are `overlay: true`, and `separateFaces()` lifts every overlay above the tallest art face, the carried picture included. Do not change the overlay flag. Stop drawing the empty frame's outline and diagonals (`emptyFrame` line 928, `drawnFrame` line 929) from the moment the carried piece overlaps the frame's rectangle.
- Once a frame's outline and cross stop, they stay off for that frame: they must not come back after the drop (today the outline is drawn until the title is typed, line 929, so stopping it early and drawing it again would make it vanish and return). This amends C6: the outline now goes with the picture's drop, since the frame is then filled and styled.
- Pass: frames every 0.02 s over the last 0.3 s of each of the four drags show no frame line across the picture; in Node, no frame overlay overlaps a face with `where: 'travel'`; over 21.9 to 30.8 s no frame line returns once gone; the InDesign still is unchanged.

**A3 (minor). The cursor jumps 1.303 units at the cut from Illustrator to InDesign (18.904 s).** Illustrator ends on `locExport` with the cursor on the dock chip, but every `script()` starts at `previous = EXPORT` (line 364). Give `script()` a `start` option that defaults to `EXPORT`, and pass `start: centre(DOCK.loc)` to InDesign's script only. No time is added.
- Pass: no cursor step over 0.3 units per 1/240 s at any of the six scene changes or at the loop's wrap.

**A4 (minor). The cursor whips 3.9 units in 0.08 s on `spreadType` (23.75 to 23.83 s).** Its `duration` is 0.08 against 0.14 to 0.21 s for every other run. Make it 0.3. The loop gets 0.22 s longer.
- Pass: no cursor step over 0.3 units per 1/240 s anywhere; the six text frames still fill in order and the Amenities row still arrives on `spreadType`.

**A5 (minor). Faint dotted plate edges show beside "it" and "move" on the After Effects devices and screen**, though the agreed colour test passes. The word plates' side faces are what shows. Make the plates thin enough that they have no visible side (`t` about 0.001, or `cut: true`), keeping their faces where they are.
- Pass: at 2x, in the 3 px band along each plate's edge, every pixel is within 3 levels of the same crop rendered without the words (so the letters themselves are not counted); the After Effects still is otherwise unchanged.

**A6. The checks must catch these faults.** Today `checks.mjs` passes four injected faults: a block from nowhere in Premiere's lanes, a plate from nowhere in InDesign's panel (R5 exempts by screen region, not by role), a picture laid over the landed post (no rule looks at what covers a document piece), and a press with no action behind it (R8 looks only at waits). Change:
- R5: exempt echo pieces only by a role tag on the piece, `echo: '<source action id>'`; remove the region exemptions for Premiere and InDesign. Must fail on both injected pieces.
- R8: over the whole loop, the cursor may be pressed only inside an action's 0.05 s press window or during a `drag`, `draw`, `slide` or `stroke`. Must fail on an injected 0.3 s press in Premiere at local 12.5 to 12.8 s.
- R9 (new, occlusion): at each action's end and 0.1 s later, no non-overlay art face born later may cover the centre of a document piece that action made. Must fail on a picture injected over the landed post, and on line 974 as it is now. Today the finished `kPost` and `eblast` are drawn over their construction pieces, which are still drawn underneath (for example the typed `idFlyer` patch under `eblast`, line 988): stop drawing the post's and the e-blast's construction pieces from the frame their finished picture is drawn, as the cover already does, so R9 holds on the correct build. Positive control: the build with A1 passes R9.
- R10 (new, cursor continuity): no cursor step over 0.3 units per 1/240 s. Must fail on A3 and A4 undone.
- BUILD.md names the exact edit used as each rule's negative control, R1 to R10; R3's control must be an edit that fails on its own (the gate the brief named for R3 is redundant).

**A7. README and BUILD say what the build shows.** After A1 to A4, reword README's lines on the post and the e-blast and BUILD's line on R3, and list R9 and R10 with their controls.

**A8. A pixel ceiling for the canvas.** At 1920 x 1080 and a device pixel ratio of 2 the canvas costs about 393 MiB by the measuring tool's own arithmetic, past the agreed 400 MB line. In `play.mjs`, cap the canvas's backing store at 5.2 million device pixels: `dpr = Math.min(2, devicePixelRatio || 1, Math.sqrt(5.2e6 / (W * H)))`. That leaves a 1440 x 900 window at 2x untouched. README states the cost term by term at the cap (atlas with mipmaps 92.25 MiB, shadow 16 MiB, and 36 bytes per device pixel for the resolved colour, 4x multisample colour and depth: about 287 MiB at most).

**A9. A code comment names the firm** (`art.mjs` line 164, "for Lennard"). Make it generic ("the 1 King Street W flyer"). No firm or agent name in code, comments, pictures or documents.

Not changed (both critics): Premiere's caption bar is empty for 0.033 s between captions, as on the timeline lanes; the leaf crosses the page in about 0.1 s (approved).

## B. Labels on the exports (Dan's new request)

Dan, 18:18 to 18:45 on 19 November: "should we do leading lines that point out what the asset is? like for GD, it's flyer, linkedin post, email. for video, its youtube, insta, tiktok, etc.?" "I would do it where it is an overlay and ontop of a corner of the asset instead of pointing underneath with the perspective." "also the leading lines can bend and be longer to fit better." "lets do top left/right corners as options where it makes sense and the labels can go to the outside with long leading lines. theyre way too close now." "lets also add an animated dashed circle stroke around the end of the leading line that has 6 dashes." "when it is not a top left or right corner, it should be middle of bottom edge."

The approved mock is `/mnt/project-files/journey-hero/labels-mock-4-desktop.png` and `labels-mock-4-phone.png` (the throwaway script that made it is not in the repository; this section is its full specification).

**What a label is.** A flat, screen-space overlay above the stage: a mark on the asset, a six-dash ring around the mark, a line that leaves the ring, bends once and runs out to a small label beside the group.

**Data, in `stage.mjs`.** `export function calloutsAt(t)`: pure, on the same clock as `frameAt`, returning `[]` when nothing is labelled, else one entry per label: `{ id, words, mark: [x, y, z], side: 'left' | 'right', level: 'up' | 'low', grow: 0..1, text: 0..1 }`. `mark` is a world point on the asset's top face. It follows the asset (it is computed from the same rectangles that place it).

**Where the marks are.** An asset's own corners are named as it reads lying flat: its top edge is the one toward the screen (smallest z), its bottom edge the one toward us. A mark sits on the asset's top-left or top-right corner, inset 0.1 units diagonally into the face, or, where neither top corner is free, on the middle of its bottom edge, inset 0.06 units.

| Scene | Label | Mark | Side, level |
| --- | --- | --- | --- |
| InDesign | Flyer | top-left corner of the stack's top copy | left, up |
| InDesign | LinkedIn post | middle of the post's bottom edge | left, low |
| InDesign | Email | top-right corner of the e-blast's tablet | right, low |
| Premiere Pro | YouTube | top-left corner of the wide tablet | left, up |
| Premiere Pro | TikTok | middle of the tall phone's bottom edge | left, low |
| Premiere Pro | Instagram | top-right corner of the square-feed phone | right, low |
| After Effects | Website, Story, Feed post | as Premiere Pro, in the same order | as Premiere Pro |
| Figma | Laptop | on the lid's screen face: its top edge, at the end with the largest z (the left end as seen), inset 0.06 down and 0.08 along | left, up |
| Figma | Tablet | middle of the tablet's bottom edge | left, low |
| Figma | Phone | top-right corner of the phone | right, low |

Photoshop and Illustrator have none (nothing lands).

**Drawing, in `play.mjs` and the page.** One overlay inside the hero, above the canvas and below the page's controls: `pointer-events: none`, `aria-hidden="true"`; an inline SVG for the lines, rings and marks, and positioned elements for the words. Reuse the nodes; do not rebuild them every frame. On every draw, project the marks with the canvas's own `S`, `cx`, `cy` and camera, so the overlay holds on resize. Then, in CSS pixels, with `S` the canvas's pixels per world unit:
- Mark: a 3 x 3 px square, `#F0484F`, centred on the projected mark.
- Ring: a circle around the mark, radius 8 px (5.5 px when `S` < 70), stroke `#F0484F` 1.25 px (1 px when small), six dashes of equal length with gaps of 38% of each sixth (`stroke-dasharray` from the circumference). It turns continuously at 60 degrees per second of hero time (`angle = 60 * t`), so a seeked frame is exact. With reduced motion it does not turn.
- Line: 1 px, paper `#F7F6F3`, no fill, starting 3 px outside the ring on the line's path. From the mark it runs at 45 degrees on screen (up and outward for `up`, down and outward for `low`) to an elbow, then horizontally out to the label. `up` elbows are 0.45 `S` above their mark. All `low` labels of a scene share one level, 0.45 `S` below the lowest `low` mark.
- Labels: left labels end at one x, 0.35 `S` left of the export group's leftmost projected point; right labels start at one x, 0.27 `S` right of the big screen's rightmost projected point (the screen's, not the group's, so they clear the screen's lower right end). The line ends there; the words sit 7 px beyond its end, vertically centred on it. Every label and line stays inside the hero with its 16 px side gutter; when a label would cross the gutter, its x is clamped and its line shortened to suit.
- Words: Outfit (the face the page already loads), 400, 11 px (9 px when `S` < 70), line-height 1.2, letter-spacing 0.12em, uppercase, paper, never wrapping. Real text, so they stay sharp.
- Nothing is drawn when `S` < 34.
- No mark, ring, line or word may overlap the page's own content: the headline, the intro, the craft list, the nav, the footer line or Pause. Where one would, clamp its position and shorten its line, as for the gutter.

**Timing.** Hard-edged, like everything else: things cut or wipe; nothing fades.
- A label begins when its asset has finished landing (rows: that device's landing end in `playbackSpans`; InDesign: when the three pieces have landed).
- The mark and ring cut in; the line grows from the ring to its end over 0.25 s with the engine's wipe ease (`grow`); then the words are wiped in from the line's end outward over 0.15 s (`text`).
- All of a scene's labels cut out together in one frame: rows when `takeBack` starts (`off[0]`); InDesign when `pickup` starts, because the LinkedIn post's line crosses the strip where the opened copy lands. InDesign's `land` wait grows from 0.3 s to 1.2 s so they can be read.
- InDesign's still has none (it is mid-leaf); the Premiere Pro, After Effects and Figma stills show theirs complete. The stills page draws them with the same code as the player.

**Checks.**
- R11: labels exist only in id, pr, ae and fig, with exactly the words and sides in the table, three per scene.
- R12: whenever a label is present, every piece of its asset is in its landed pose; no label in a frame where its asset is absent, moving or being taken back.
- R13: `grow` never decreases while present; `text` > 0 only once `grow` is 1; a scene's labels end in the same frame; InDesign's end exactly at `pickup`'s start.
- R14: every mark lies on its asset's top face (the laptop's: on its lid's screen face), at the corner or edge middle named in the table, inset as stated.
- A browser check, as a tool in `tools/` run in the review (not in `checks.mjs`, which has no browser): at 390 x 664, 390 x 844, 1440 x 900 and 1920 x 1080, at the stills and at each label's fully grown frame: each mark is within 1 px of its projected position; every label and line stays inside the 16 px gutters; no label's box overlaps another label or the page's text and controls; no words wrap; nothing is drawn when `S` < 34; under reduced motion the ring does not turn.

## C. UX/UI on a laptop, a tablet and a phone (Dan's new request)

Dan, 18:32 to 18:35: "also for the UX/UI, it should be a laptop facing the bottom right corner, a tablet and one phone. this should be reflected onto the app screen as well. you may need to rethink how the animation and layout of this section looks to be able to fit this onto the big app screen." "laptop should slide in from top left." "make sure the app actually moves on the devices for UX/UI."

The rough sketch in the mock (the Figma panel) shows the intent only; build it properly.

**On the floor.** Three devices in one row on the mat, the group's footprint centred on `SCREEN.l + SCREEN.w / 2` in world x like every other export, square to the screen, same depth band as the rows (`MAT.z` to `MAT.z + ROW`):
- A laptop, open, its screen facing the bottom right corner: the deck lies flat with its hinge along the deck's left edge (parallel to z), the lid stands on that edge tilted back about 12 degrees, and its screen faces world +x, which in the home view points to the picture's lower right, as in the approved mock. Screen 16:10. Keyboard and trackpad drawn simply (dark plates on the deck), no logo.
- A tablet, flat on its back, portrait (3:4), like the other devices.
- One phone, flat on its back (9:19.5), like the other devices.
- Sizes and gaps: the laptop's screen is the widest picture on the floor; gaps equal; nothing overhangs the mat's ends by more than the old row did.
- The laptop slides in along the floor from the top left: it appears whole, by a cut, 1.6 units toward world -x from its slot, and slides into its slot over 0.5 s with the engine's enter ease. No clip plane: nothing may seem to grow out of an invisible line on bare floor (the rows' clip works only because they come out from under the screen). Its path must never pass over the page's text, nav or controls, at desktop or phone size (on a phone it starts partly off the screen's left edge, which reads as sliding in from off-frame). The tablet and the phone feed out from under the screen as the rows do now. All three return the way the rows return (`takeBack`).
- The laptop's standing lid must never cover the Figma canvas, the Export button or the tablet in the home view, at desktop or phone size.
- Pass: frames every 0.05 s through the laptop's entry and its return; the lid's projected outline never overlaps the canvas, Export or the tablet.

**On the Figma screen.** The canvas holds the same page designed three times: for the laptop (16:10), the tablet (3:4) and the phone (9:19.5), side by side, in the existing two rows (wireframes above, designs below, the same row height 0.86, which fits: about 2.8 units of a 2.98-unit canvas). Replace today's desktop and two phones; keep the build's beats and their kind (frames drawn with the frame tool, picture box, heading typed, button drawn, details run, marquee, copies dragged down, fills, the hero picture dragged in from the right panel, the name typed, accents, the prototype set up in the right panel, Export), adapted to these three frames. The prototype beat: a hotspot on the "Video" craft item, then the interaction set in the right panel (on tap, change to the Video state, instant). No second copy of a frame is needed for the second state.
- Dan, on the sketch, with the top of the phone frame circled where it ran up beside the Export button: "be careful with this overlap". Nothing on the canvas (frames, their name tags above them, the hotspot, the link) may reach into the top bar, under or beside the Export button, or into the panels on either side: keep at least 0.1 units clear of each, as today's rows do (wireframe tops at 2.44 under `TOP` 2.59). Check: no canvas piece's rectangle comes within 0.1 of the bar, the Export button or a side panel, in any frame of the scene.

**The prototype that plays.** Dan: "make sure the app actually moves". One sequence, the same on the three designs on the screen and on the three devices on the floor, each in its own layout, on Figma's own export clock, in a 3.0 s cycle:
- 0.00 to 0.15: a tap mark on the "Video" craft item.
- 0.15 to 0.30: a hard wipe to the Video state: that item turns red, the hero picture changes to the video craft's picture.
- 0.40 to 1.00: the page scrolls up by about 40% of the screen inside each device's viewport (a hard clip at the viewport's edges), showing a row of work cards under the hero.
- 1.00 to 1.55: held; at 1.25 one card is tapped (a tap mark) and lifts by a hard step.
- 1.55 to 2.15: the page scrolls back to the top (the card steps back down as it starts).
- 2.15 to 2.30: a tap on "Graphic design"; 2.30 to 2.45: a hard wipe back to the first state.
- 2.45 to 3.00: held; then the cycle repeats.
- Figma's devices start their return when one whole cycle has played (`off[0]` = landing + 3.0 s), and its labels cut out then.
- Figma's still is at 1.10 s into the first cycle (scrolled, in the Video state, before the card is tapped).
- Something on every device changes at least every 0.6 s. Pages scroll by moving a picture window over a taller page picture; nothing stretches.
- Each device's chrome stays (the laptop's browser bar, the tablet's and the phone's status bars) with the page moving inside it.
- The Figma scene may grow by at most 2.0 s for this.

**Checks.** The device-count rule expects exactly a laptop, a tablet and a phone in Figma. The "feed and return move only in z" rule allows the laptop its x path, and only the laptop. The "exports centred on world x 0.200" rule measures the laptop from its landing to `takeBack`, using the middle of its whole projected footprint (deck and lid). A new rule: on each device and on each design on the screen, the playing picture differs between any two samples 0.6 s apart.

## D. The measurement, after the build

**D1. `tools/measure.mjs` always reaches its scan.** Run each phase (each playback size, the flicker scan, the sheets) in its own `try`; record a phase's error in the report; always run `scanWindows()` and write the sheets; exit 1 if any phase failed, and say "playback incomplete" in `measure.md` when a playback phase did not finish. Add `--dpr <n>` (default 1) for the device scale factor, and make the report state it.
- Pass: a run with the playback limit forced low scans more than 0 frames, writes the sheets, says "playback incomplete", and exits 1.

**D2. Re-run on the desktop's real graphics card,** into `review/hardware/` (replacing the files there): the default run, plus one run at `--size 1920x1080 --dpr 2` into `review/hardware/dpr2/`. Every report states the canvas's real backing size and computes memory from it (with the A8 ceiling, 1920 x 1080 at 2x gives a ratio of about 1.58, not 2). The flicker scan captures the stage box plus the label overlay's whole area, and `__hero.seek` redraws the overlay at once, so the repeat test covers the labels. Thresholds as agreed: median frame at most 17 ms, 95th percentile at most 25 ms, at most 3 frames over 50 ms after the first second, ready within 2.5 s, computed allocation at most 400 MB, flicker repeat test at most 0.1% of pixels differing by more than 2. The scan's windows must include the new labels' and laptop's windows.

## Loop length

A1 to A5 add about 0.22 s; B adds 0.9 s; C at most 2.0 s. The loop may run to about 83.4 s at `PACE` 1. Widen the check's range to 70 to 86 s. Total length stays Dan's decision (his card is open); do not change `PACE`.

## Records

BUILD.md: a section "CORRECTIONS-2" with what was done for each item, departures and their reasons, the negative control for each rule, and the new scene starts, still times and loop length. README: the timetable, the label specification in short, the UX/UI section, the pixel ceiling and cost, and the production list (unchanged items stay).
