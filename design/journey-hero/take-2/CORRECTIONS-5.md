# Corrections, round 5: journey hero, second take (Dan's notes on the preview)

This brief is for the builder. Dan reviewed the round 4 build (`7590b44`) in the preview with a time slider and left seven notes on 20 November (04:47 to 05:07 UTC). His words are quoted with each item. Everything in `CORRECTIONS-2.md` to `CORRECTIONS-4.md` still holds unless an item below replaces it. Nothing here touches anything outside `design/journey-hero/take-2/`.

**Take two borrows the first take's page.** `tools/page.mjs` and `tools/preview.mjs` read `public/journey/index.html` and `public/journey/journey.css`, which belong to the first take and must not change. Put every layout change for take two in a new take-two-only stylesheet inside `design/journey-hero/take-2/` (or in `play.mjs`), loaded after `journey.css` by `page.mjs` and inlined by `preview.mjs` the same way.

Measured on the round 4 pack in Chromium at device scale 1 (pixel ink, not boxes):

| Size | Name ink left / lede ink left (gutter) | Name-to-lede gap | Name ink top / logo bottom | Text ink right | Scene left / right space |
|---|---|---|---|---|---|
| 768 x 1024 | 44 / 41 (40) | 36 | 338 / 76 | 315 | box-limited |
| 1024 x 768 | 45 / 41 (40) | 38 | 209 / 76 | 408 | box-limited |
| 1280 x 800 | 70 / 65 (64) | 40 | 211 / 76 | 501 | 130 / 132 |
| 1366 x 657 | 70 / 65 (64) | 41 | 135 / 76 | 505 | 160 / 132 |
| 1440 x 900 | 71 / 65 (64) | 41 | 252 / 76 | 529 | 177 / 137 |
| 1680 x 1050 | 71 / 65 (64) | 42 | 327 / 76 | 531 | 288 / 143 |
| 1920 x 1080 | 71 / 65 (64) | 42 | 342 / 76 | 531 | 448 / 199 |
| 2560 x 1440 | 71 / 65 (64) | 42 | 522 / 76 | 531 | 764 / 233 |

"Scene" is the stills envelope: the `need` box in `play.mjs` without its 0.25 padding on each side (world x along the camera's right, −2.331 to 3.429 now). "Right space" runs to the window's right edge.

## H1 (major). InDesign: the spread frame is swapped at the end of its draw (20.28 s)

Dan: "From this frame to the next, it looks janky … its on the indesign one about 20.24 to 20.37".

While `frame0` is drawn (19.98 to 20.28 s), `drawnFrame(D, ID.spread, p, 'night', true)` shows a `night` plate over the whole spread with a corner-to-corner X. When `done(frame0)`, it is replaced in one frame by two `ink` page plates (`ID.left`, `ID.right`, `FLYER.coal` tones) and `emptyFrame(ID.frame, false)`, whose outline and X are inset to `ID.frame`. Fill, edges and cross all jump as the cursor lets go.

Fix: draw what stays from the first moment of the drag. The two ink pages and the `ID.frame` outline and X grow with the drag, in their final proportions, lifts and thicknesses, inside the growing rectangle, so that at the end of the drag nothing changes but the cursor.
- Pass, in Node: the non-cursor pieces at 20.28 s minus and plus 0.0005 s are identical; at every 0.005 s over the drag, each piece's corners lie inside the growing rectangle; at the drag's end they match the `done` state exactly.
- No other draw in the loop swaps (checked here: every `draw` end, pieces at minus and plus 5 ms, then frames). Keep it that way: add the minus/plus 0.0005 s comparison for every `draw` action to the checks, with InDesign `frame0`'s old drawing as its negative control.

## H2 (major). InDesign's labels stay up longer

Dan: "These leading lines and the words should stay longer", then "only the indesign needs to be longer".

InDesign's labels show during `land` (1.2 s, 31.98 to 33.18 s) and cut at `pickup`. Make `land` 3.0 s. Video, motion and UX/UI label times stay as they are.
- The loop grows by 1.8 s, to 83.04 s. Premiere Pro, After Effects and Figma start 1.8 s later (39.88, 55.10, 69.13 s).
- Each still shows the same picture as now; InDesign's still moves with its action (it falls after `land`), later stills move by 1.8 s.
- Update everything that states the loop length, the scene starts or the still times (README, BUILD, tools, fixtures, checks), and the label timing checks.

## H3 (major). The laptop faces the lower left

Dan: "the laptop needs face bottom left". This replaces "a laptop facing the bottom right corner" in `CORRECTIONS-2.md`. "laptop should slide in from top left" still holds.

Now the hinge runs in world z and the lid faces +x (the viewer's lower right). Turn the laptop a quarter turn: the hinge runs in world x, the lid stands along the deck's back edge (low z) and faces +z (the viewer's lower left), still leaning 12 degrees back; the keyboard turns with the deck.
- It still slides in from the top left (along −x), the same object, never respawned.
- The app still runs on its screen ("make sure the app actually moves on the devices"), and its picture is not mirrored.
- The tablet and phone keep their places beside it; the row stays centred where it is now. Nothing overlaps; the lid hides nothing that a viewer needs to see.
- The "Laptop" label's mark sits on the lid's top-left or top-right corner (otherwise the middle of its bottom edge), with the label outside the group on a long leader, as before. All label rules and checks still pass.
- Report the scene envelope before and after; if the laptop widens it, H6 uses the new envelope.

## H4 (minor). The name lines up with the text beneath it

Dan: "My name and the text beneath it dont visually line up on the left".

The name's D and E carry their side bearing (6 px at 104 px), so its ink starts 5 to 6 px right of the lede's. Pull the name left by the difference, measured from the font at weight 800 (the weight the name animates to), so that both name lines, the lede and the craft numbers start on one pixel column within 1 px at every size, phones included. The name's weight animation stays.

## H5 (minor). The text block moves up by the name-to-lede gap

Dan: "move this section up by the pixel count amount that is between my name and the text beneath it", then "the section unnder the text with 01 02 etc will move with them, yeah?" (answered yes).

In the side-by-side layout (720 px wide and up), move the whole `.hero-say` block (name, lede and craft list together; their spacing unchanged) up by the visible gap between the bottom of "Endrawes" and the top of the lede at that size (table above), within 1 px.
- Guard (told to Dan): the name's ink stays at least 48 px below the logo's bottom. Where that limits the move (about 1366 x 657, and the 640 px minimum height), the block moves up only as far as the guard allows.
- Phones (719 px and narrower) are unchanged.
- Labels still keep their clearance from the page text at every size.

## H6 (major). Equal space on both sides of the animation on wide screens

Dan: "on wider screens the space in the middle grows too large, lets have it be the same length on both sides of the animation".

The scene is fitted to the stage box's height, so on wide screens all extra width goes between the text and the scene (table above). When the scene is narrower than the room beside the text, centre it between the text's right edge (the widest line of the name, lede or craft list, measured from its text, not the block's box) and the window's right edge, so the two spaces match within 8 px of pixel ink. Expected: about 323 px each at 1920 x 1080 and 498 at 2560 x 1440; at 1280 x 800 it barely moves.
- The scene's position and size change continuously as the window is resized: no jump at any width (check every 10 px from 720 to 2560 wide at heights 640, 900 and 1440).
- The scene's size does not shrink by more than 2% at any of the browser check's ten sizes; report it before and after.
- The click target (the stage box) still covers the scene where it is drawn.
- Labels keep their clearance from the page text and the window; the label checks pass at all ten sizes.
- No layout reads in every frame: measure the text when the layout, the fonts or the name's weight animation change.

## H7 (minor). The floor answers the cursor

Dan: "can we make the floor interactive as well as the background?", chose hover, then "i wouldnt move the floor as it could be disorienting."

While a mouse pointer is over the hero, the floor's dots inside a circle of radius 0.75 world units (1.5 dot pitches) around the pointer's point on the floor turn brand red (`#C0262E`). Nothing else on the floor changes or moves: not the dots' places, not the pool of light, not the camera.
- Hard-edged: each dot is wholly red or wholly grey, decided by its own centre's distance from the pointer's point; no fade, no partial dots, no blur.
- Red dots appear only where grey dots show (no red beyond the floor), and are clearly visible wherever grey dots are.
- The pointer's floor point is where its viewing ray meets the floor plane (y = 0) in the current view.
- Only for a hovering fine pointer (`(hover: hover) and (pointer: fine)`), not under reduced motion. On leaving the hero the dots go back to grey at once.
- While playing, it shows from the next frame. While paused or held by a seek, at most one redraw per animation frame, and only when the pointer moves.
- The stage click (next craft), the craft buttons and Pause work as before.

## H8 (minor). Records

Add a "CORRECTIONS-5" section to BUILD.md: what was done for H1 to H7, any departure and its reason, the negative controls (each control's edit matching exactly one place), the scene envelope and scene size before and after, and the `checks.mjs` output. Update README for the loop length, the new stylesheet, the floor hover, and the tools' commands if they changed.

No hardware run. The browser checks cannot run on the builder's machine; they are run elsewhere, with frames at each note.

## Addendum after the build `796c0f1` (checked in a browser)

H1, H2, H4, H5 and H7 check out in frames and pixels: the spread now grows as its pages and nothing changes at 20.28 s but the cursor; name, lede and numbers share one ink column at every size; the block rises by the gap (41 at 1920 x 1080, 10 at 1366 x 657 under the guard); the side spaces match within 2 px from 1280 to 2560 wide; the red dots work, hard-edged, and clear on leaving. Two faults remain, and `browser-check.mjs` fails ("1000x640: H6 resize step").

### H9 (major). Each measurement grows the stage box, so the scene creeps larger

`page-layout.mjs` `measure()` removes the stage box's inline `left` and `width` only when `stage.style[key] === target[key]`. Chromium serialises the values it was given with fewer digits (set `306.388…px`, read back `306.375px`), so the test fails, the enlarged box from `cover()` stays, and the next measurement reads it as the stage. Measured in Chromium at 768 x 1024: on load S is 62.0 (round 4: 54.7, box 390); three calls of `__hero.measure()` give box widths 422, 453, 489 and S 62.0, 62.0, 67.9. At 1024 x 768 the box reads 578 (round 4: 533) and S is 85.1 (round 4: 80.0), so the scene comes within 20 px of the text (round 4: 49). At 1920 x 1080 the box reads 1045 (1011); S is height-limited there, so it hides.

Fix: never measure a box that was changed for the click target. Leave the stage box's own geometry alone and cover the shifted scene some other way (a separate target, or a hit test on the hero), or clear the inline values unconditionally before measuring.
- Pass: ten calls of `__hero.measure()`, and resizing away and back, leave S, cx, cy and the measured box unchanged to 0.01 px at every browser-check size.
- S at each of the ten sizes is within 2% of round 4's (`7590b44`) or larger only where H6's centring needs no extra room; report the table.
- `browser-check.mjs` passes, including the resize steps.
- Add a negative control: the current string comparison must fail the repeated-measure check.

### H10 (major). The laptop's lid now runs into the app screen

Facing the lower left (H3), the lid stands at the deck's back edge, and its top edge now meets the bottom edge of the big app screen: at 1440 x 900, from about 79.4 s to the end of the Figma scene, the lid's top right overlaps the screen's lower left, and the "Laptop" mark sits on the screen's corner. In round 4 there was a clear gap.

Fix: keep a clear gap between the laptop (lid and deck) and the app screen throughout the Figma scene, as round 4 had. Move the device row forward on the floor, toward the viewer, or lower the lid, whichever keeps the row's look; the tablet and phone stay beside the laptop and nothing overlaps.
- Pass, in Node: at every 0.02 s of the Figma scene, the laptop's projected outline and the app screen's projected outline are at least 12 px apart at 1440 x 900 (S 103.6), and the "Laptop" mark's ring does not touch the app screen.
- Report the scene envelope and S before and after; if the envelope changes, H6 uses the new one.
