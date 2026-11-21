# Round 13: journey hero, second take: the exports drop out of the screen

This brief is for the builder. Dan, 21 November, 2:39 AM ET: "right now the exports look like they materialize out of nothing, can we do something creative with how they come in?" At 2:44 AM he chose the option "Drop out of the screen". Its words were: "The work on screen peels off, tips down to the floor, and splits into the formats. In Figma, the three frames each drop into their device."

Everything in `CORRECTIONS-2.md` to `CORRECTIONS-12.md` still holds unless it is changed here. Build on round 12. Nothing here touches anything outside `design/journey-hero/take-2/`, and `public/` stays untouched.

## Today

When Export is clicked, every export slides toward the viewer out of an undrawn slot at the mat's back edge. That is `feed()` in `stage.mjs`, clipped at `z = MAT.z`. The first piece lands 0.55 s after Export. When the scene ends, everything slides back into the slot (`takeBack()`). With nothing visible to come from, the pieces seem to appear out of nothing.

## E1 (major). The work leaves the screen and becomes its formats

Use one idea in every scene that exports, in four beats. The motion stays hard-edged: cuts and wipes, `EASE.wipe` for movement, no fades, no bounce on landing, no blur.

1. **Peel (about 0.15 s).** At the Export click, a flat copy of the finished work cuts in exactly over the work on the screen's face. It then moves straight out from the screen, along its normal, by a small distance. The screen keeps showing the work, so nothing jumps.
2. **Tip and drop (about 0.5 s).**
   - The copy tips forward from upright to flat.
   - At the same time, it travels down and toward the viewer, and scales to the export group's footprint.
   - It lands lying flat on the floor exactly where the group will sit, with `EXPORT_SHIFT` applied. It does not pass through the screen, the floor or the app.
3. **Split (about 0.35 s).** The landed sheet cuts along hard edges into the parts that become the formats. Each part slides to its own place.
4. **Become (about 0.25 s).** Each part turns into its format.
   - A device's body builds around its screen: the rim wipes out from the screen's edge, and the body's thickness rises from the floor.
   - The booklet stack rises under its top copy, as its thickness wipes up from the floor.
   - What plays on a device starts only once its body is built.

What each scene's sheet is and what it becomes:
- **InDesign:** the sheet is the finished document as it shows on the screen. It splits into the flyer (the top copy of the booklet stack, which then rises under it), the LinkedIn post (into the phone) and the e-blast (into the tablet). The pickup, the opening and the leaf turns that follow stay as they are.
- **Video (Premiere Pro) and Motion (After Effects):** the sheet is the viewer's picture. It splits into three copies, cropped wide, tall and square. They slide to the tablet and the two phones, whose bodies build round them. Then the plays start, in step with the screen as now.
- **UX/UI (Figma):**
  - The three frames on the canvas each peel off the canvas on their own, staggered by 0.1 s. Each tips down to its device's place: the laptop's screen, the tablet and the phone. Figma has no shared sheet and no split.
  - The tablet's and phone's bodies build round their screens.
  - Dan asked earlier for the laptop to slide in from the top left. Keep that, but give it something to meet: its body slides in from the top left under its dropped screen, and the lid rises to its 12 degree lean as they meet.
- **Photoshop and Illustrator** do not export to the floor today. They stay as they are.

## E2. The return plays the drop backwards

The pieces should not vanish into a slot any more. When a scene's exports leave, the drop plays backwards, faster (about 0.6 s in all):
1. Each format turns back into its part.
2. The parts close into one sheet.
3. The sheet lifts and tips back up into the screen, and cuts out on the screen's face as the app changes.

In Figma, each frame goes back to its place on the canvas. Remove the slot clip and `feed`/`takeBack` where they are no longer used.

## Timing

- Labels, plays and the UX/UI cycle start from each piece's "become" end, not from today's landing times.
- The scene grows by the longer entrance and return. The loop's length follows; report it.
- The cursor stays still and unpressed through the drop, as it does through the landing today. Every hand rule from round 7 still holds.
- Nothing in the drop may cross the craft list, the text or the page's edges at any size from 360 x 780 to 1920 x 1080. The tipping sheet's projected box must stay inside the stage's box. If it cannot at the largest scale, shrink the copy before it tips.

## Checks

- **In Node, at 0.01 s steps through every export:**
  - The copy starts exactly over the screen's work.
  - Its tilt runs monotonically from upright to flat.
  - It lands exactly on the group's footprint.
  - Every part ends at its piece's final place and size.
  - No device plays before its body is built.
  - The return ends with nothing on the floor.
  - Nothing appears without coming from the screen: before the peel, no export piece exists anywhere.
  - Every existing check stays clean, including labels, centring and the no-lift rule of round 8's G1 (the carried copy counts as a carried stack).
  - **Negative control:** start one device's body before its part has arrived, and the check fails.
- **In a browser (Playwright is preinstalled):**
  - At 1440 x 900, film each of the four export scenes from 0.2 s before Export to 0.4 s after its last piece is built, at 0.05 s steps. Do the same for each return.
  - Repeat one scene at 390 x 844.
  - Run `tools/browser-check.mjs` once at the end.
- Put the films in `.scratch/review-out/r13/`.

## Records

Add a "CORRECTIONS-13" section to BUILD.md, and update README's "Exports that play" and timetable.
