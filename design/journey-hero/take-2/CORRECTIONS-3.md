# Corrections, round 3: journey hero, second take

This brief is for the builder. Both critics reviewed `48aea47` independently and failed it on the same two faults; this brief fixes those, one smaller fault, and the minor findings. Everything in `CORRECTIONS-2.md` still holds except where this brief amends it. Dan's words win over this brief. Nothing here touches `public/journey/` (the first take), the home page, `src/`, `public/CNAME`, or anything outside `design/journey-hero/take-2/`.

Times are loop seconds in `48aea47` (loop 81.24 s). Every time scales with `PACE`. Do not change `PACE`, the loop length, the scene starts or the six still times: none of the fixes below needs time.

## A. Major (both critics found these on their own)

**F1. The LinkedIn post's empty frame vanishes 2 s early** (visual V13, integrity N2; A2 is not met). `stage.mjs` 1056 computes `filled` with `.some()` over all four drags, so the post's frame counts as filled when the cover photo's drag passes near it: at 25.225 s the post's frame, which the cursor drew at 21.06, disappears whole (plate, outline and cross), and the post's slot is bare wall until the post photo arrives at about 27.4 s. The map, cover and e-blast frames also lose their plates 0.33, 0.28 and 0.18 s before their own pictures land.
- A frame's outline and cross stop only when **its own** picture's drag touches it (frame 0 with `map`, 1 with `photo`, 2 with `postPhoto`, 3 with `mailPhoto`), and they stay off after that (A2's rule holds).
- A frame's plate stays until its own picture is placed on it; the picture replaces it in the same frame, with no frame of bare wall between.
- A picture travelling over **another** frame is drawn above that frame's outline and cross while it travels: no frame line may lie over any travelling picture (A2's Node criterion holds), but the other frame is not removed: it is whole in the first frame after the travelling picture's screen rectangle no longer overlaps it. Do this in the drawing order (for example, `separateFaces()` lifts the travelling picture above the overlays it crosses), not by hiding the other frame, and apply it only to InDesign's travelling pictures.
- Pass: in Node, every 0.005 s over 19.9 to 30.8 s, each frame's overlay is present without a gap from its drawing until its own picture's contact; each plate is present until its own picture's placement; no frame overlay overlaps a `where: 'travel'` face in screen order. Frames every 0.02 s over 24.9 to 25.6 s and 27.1 to 27.6 s show the post's crossed frame until the post photo meets it. The canvas at the Photoshop, Illustrator and InDesign stills is pixel-identical to `48aea47` (labels aside), and `checks.mjs` is all clean.

**F2. On a tall phone the Figma "LAPTOP" label is drawn over its own ring** (visual V14, integrity N1). At 390 x 844 the words sit at x 16 to 56.5 and the ring at x 54 to 65, from 78.24 s through the Figma still at 78.94 s; the leader is a stub that turns back inward. The build's own `tools/browser-check.mjs` fails on it ("390/78.94: line on label words"). Cause: `fitCalloutView` (`labels.mjs`) makes room only for the right word column; the left label's end is then clamped to `16 + leftWidth + 7` (line 43), which lies right of the laptop mark, and line 69 forces the elbow back.
- `fitCalloutView` solves both columns: the view is scaled and shifted so that, for every left label, the mark's x minus the 45° run and a horizontal run of at least 12 px (8 px when S < 70) leaves room for its words inside the 16 px gutter, and the same for the right column. Keep the stage as large as these allow.
- Every leader runs outward and never turns back: for a left label, elbow x ≤ start x − 3 and end x ≤ elbow x − 8 (−12 when S ≥ 70); mirrored for the right.
- No label's words touch any ring (its radius plus 2 px), mark or line, its own included.
- Pass: `tools/browser-check.mjs` passes, run by the builder, with its output pasted into BUILD.md, at 390 x 664, 390 x 844, 360 x 780, 375 x 667, 412 x 915, 768 x 1024, 1440 x 900 and 1920 x 1080. Add the four new sizes to the tool.
- The 12 px rule also moves the desktop: at 1440 x 900 the LAPTOP leader's last run is only 3.6 px today (mark 791, elbow 752.1, end 748.5), so the Figma scene's left column moves further left at 1440 and 1920. Pass also: the Figma still at 1440 x 900 and 1920 x 1080 still matches Dan's approved mock (labels outside the group, left labels sharing one x, clear of the page's text and controls), checked in frames.

## B. Minor

**F3. The labels twitch while the videos play** (visual V15). Each mark's height is the top of whatever faces lie at the mark point (`stage.mjs` 1328), which includes the playing content's stacked layers, so the rings, lines and words shift 0.2 px for a frame or two several times a second in Premiere, jump about 1 px at 65.35 s in After Effects, and move 7 times per cycle in Figma. Both hardware runs flag it on the label words.
- Take each mark from the asset's own landed top face (the device's body or screen face, not its playback layers), so it is fixed for the whole label window. The shared low level is then fixed too.
- Update R14's face and corner check to the landed top face, so that it and the new fixed-mark check agree.
- Pass: in Node, every 1/60 s across each label window, every mark's world position and the low level are constant (to 1e-9). The InDesign labels are unchanged.

**F4. A new prototype cycle starts on the leaving devices** (integrity N4d). During Figma's 0.4 s return after `off[0]`, the devices hold the frame they show at `off[0]`; no new cycle starts.

**F5. At 280 px wide the stage moves into the 16 px gutter** (integrity N4c). Keep the stage inside the 16 px side gutters at every width down to 280 px.

**F6. `tools/measure.mjs` can write absolute paths into a report** (integrity N5). For a failed phase, write the error's message only, with any path made relative to the repository; never `error.stack`.

## C. Checks

**F7. Gaps in the checks** (integrity, category 15). Each new or changed check gets a negative control that fails it:
- R5: a block tagged with an action passes only from that action's start (today any valid tag passes at any time; X1b).
- The UX/UI "something changes at least every 0.6 s" rule counts only the three designs on the screen and the three devices, not the progress rail (X5).
- The canvas-clearance check includes the bottom toolbar (≥ 0.1, today exactly 0.100).
- New R15: nothing made by an action disappears before the action that removes or replaces it. Its controls: `48aea47`'s post frame at 25.229 s must fail it, and the fixed build must pass it where a picture replaces its plate on the same frame (a placement is not a disappearance; show this with a control).
- F2's label rules (outward leaders, words clear of rings, marks and lines) as a check in `tools/browser-check.mjs`, and F3's fixed marks as a Node check.

**F8. The negative-control table** (integrity N3). Each control's edit must match exactly one place in its file (the tool fails the control if its search text matches none or several); R1 and R2 get distinct edits. Put the table's results (rule, edit, caught) in BUILD.md; `results.json` stays out of the repository.

## D. Records

**F9.** README: the hardware section describes the committed runs of `48aea47` (figures from `review/hardware/measure.md` and `dpr2/measure.md`), not "pending"; atlas page 5's real size; a note that round 3 was not re-measured on hardware because it changes which pieces are drawn and where the labels sit, not the renderer. BUILD.md: a section "CORRECTIONS-3" with what was done for each item and any departure with its reason; the real pack size; the laptop's behaviour on a phone (it appears whole and fully on screen at 390 x 664 and 390 x 844, then slides); `checks.mjs`, `correction-checks.mjs`, `phase-checks.mjs` and `browser-check.mjs` outputs.

No hardware re-run this round (Dan prefers that long runs are not repeated after small changes); the PC session runs `checks.mjs` only.

## The re-review (Dan's choice, 19 November, 8:51 PM ET)

Dan chose "Only what changed, 20 min cap": the critics recheck F1 to F9 and Dan's labels and devices where these fixes touch them, with real frames, skip retesting the tools themselves beyond F7 and F8, and stop at 20 minutes. They run `tools/browser-check.mjs` themselves at all eight sizes, and look at the Figma still at 1440 x 900 and 1920 x 1080 as well as the phone sizes. Category 14 rests on the `48aea47` hardware runs; visual's classification of their flags stands and is not reopened.

## Agreement

Both critics accepted this brief on 20 November at about 02:02 UTC (9:02 PM ET on 19 November), with conditions now written in: visual, the desktop Figma still under F2's 12 px rule; integrity, F1's drawing order for InDesign only with unchanged stills, the critics running the browser check themselves, R14 updated under F3, R15's placement control, and the testable wording of F1's "whole again".
