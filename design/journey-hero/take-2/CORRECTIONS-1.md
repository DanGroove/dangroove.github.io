# Journey hero, second take: corrections from the critique, round 1

Two independent reviewers went through the second pass (build `3d26f58`) frame by frame in a real browser and against Dan's
own words. They found the faults below, tested each other's findings and agreed this list. Every fault here was seen in
rendered frames; none is a guess. This file is the brief for the correction. It does not replace `MOTION-2.md` or
`MOTION.md`: where this file differs from them, this file wins, because Dan's words outrank both:

> honestly, for every part, it should start empty with me filling everything in. look at every piece and have it actually
> build it like if there is text, it should show it typing that.

The house rule that goes with it: an animation moves the same object that is already there. It never respawns or resets it.

## Ground rules

- You may write: `stage.mjs`, `art.mjs`, `play.mjs`, `tools/checks.mjs`, `tools/sheet.mjs`, `README.md`, `BUILD.md`, and two
  new things: `tools/measure.mjs` and the folder `review/hardware/` (the measuring tool's output). All in
  `design/journey-hero/take-2/`.
- Read only: this file, `MOTION.md`, `MOTION-2.md`, and everything outside `design/journey-hero/take-2/`.
- Everything in `MOTION-2.md`'s ground rules still holds: hard edges, one cursor, the three `EASE` curves, no new
  dependencies, the approved stills are the destination.
- **The finished state of every document, just before its Export click, must be exactly what it is today.** The six stills
  must not change, with one exception named in C4. Only how things arrive changes.
- Do not hand-write absolute times. New actions go into the scripts and the scheduler places them.

## The corrections

### C1. InDesign: the placed amenities map must stay visible (major)

Seen: the map is dragged from the dock and lands in the spread; the moment the drag ends it disappears, the heading is typed
over an empty charcoal spread, and the map cuts back in when `spreadType` ends (about 1.2 s later).

Cause: after the drag the map is still the travel piece at lift 0.06, the same height as the spread's coal plates, and the
face-separation pass puts the plates in front.

Correction: while `done(map) && !done(spreadType)`, do not draw the map through `travel`. Draw it as a document piece a full
step above the plates (`lift: 0.08`, thin, art `kMap`, with the travel piece's end window), so it does not depend on a
tie-break and nothing jumps when `spreadType` ends. The drag itself looks as it does today. The frame's red outline and
handles stay visible over the placed map.

### C2. InDesign: a page reaches the pages panel only when it is made (major)

Seen: when `spreadType` ends, the panel fills at once with The Offering, Amenities, the Gallery and the back cover. Only
Amenities has been made, and three of those thumbnails show the building photo a second before it leaves the dock.

Correction:
- Amenities appears at the end of `spreadType`, Location on the release of `loc`, the cover at the end of `coverTitle`.
- The Offering, the Gallery and the back cover arrive in a new `pages` **run** of three, placed right after `coverTitle`:
  the cursor goes to the panel and runs down it, and the three rows cut in 0.07 s apart in page order.
- No thumbnail or page that contains the photo may be visible anywhere before the `photo` drag ends.
- After the run the panel is exactly as in today's still.

### C3. InDesign: the cover, the post and the e-blast are finished by hand (major)

Seen: on the release of `postButton` the finished post picture cuts in, adding its band, foot and the big gold blob at once;
the e-blast's band and gold frame arrive with its photo, and on the release of `mailButton` its blob and the button with the
words "View the flyer" cut in, untyped; on the cover, the tab and small blob arrive when the building blob ends.

Correction, in two classes:
- **Made by the cursor.** The gold building blob on the post (`postBlob`, after `postTitle`) and on the e-blast (`mailBlob`,
  after `mailTitle`): each a `draw` that grows from its corner under the cursor, exactly like the cover's `blob`. The words
  "View the flyer": a `type` action after `mailButton`, at the 0.4 s minimum, with a prefix and a caret. The cover's gold
  tab: present from the start of `coverTitle` (the click that makes the text frame), not before and not on the blob.
- **Arrive with the photo drop, as the frame's style.** The post's band and dark foot, the e-blast's band, gold photo frame
  and divider, the cover's woven ground, and the firm's small blob. Each appears exactly at the end of its own photo drag
  (`photo`, `postPhoto`, `mailPhoto`) and at no other moment. README names each of these parts as frame style.
- Across `postButton` and `mailButton` only the button itself may change. A title's tag looks final from the moment it is
  typed.
- A finished picture (`kCover`, `kPost`, `eblast`) may replace the built pieces only once every one of its parts has been
  made, so that the replacement changes nothing on screen.

### C4. After Effects exports: no plates behind the words (major)

Seen: on all three devices, "Make it" and "move." sit on paper-coloured rectangles that are lighter than the device's comp
ground, for the whole export play.

Cause: the shader keeps a picture's own colours but shades a plain piece by its angle to the light. The word plates are
pictures; the device's comp ground is a plain piece lying flat.

Correction: draw the comp ground in `animatedComp` with a small all-paper picture (for example an 8 x 8 `paperTile`), on the
devices and on the screen alike, so ground and plates follow one rule wherever they lie. Keep the words on opaque plates.
This is the one permitted still change: the motion devices' ground becomes paper. The comp on the big screen and its
thumbnail must look as they do today.

### C5. Premiere Pro: the two new captions are typed (minor, but Dan's literal words)

Seen: only "Look good." is typed. The `captions` run cuts in "Move well." and "Work right." whole.

Correction: "Move well." and "Work right." each get a `type` action (0.4 s) in the viewer, like the first: a prefix, a caret,
and the caption's block growing on the caption lane as it is typed, with the viewer showing the frame at that caption's
place. The two repeats ("Look good.", "Move well.") stay a run of two. The exported devices must still mirror the viewer.

### C6. InDesign: an empty frame's diagonals go when its picture lands (minor)

Seen: the X of an empty graphics frame stays drawn over the placed photo on the cover, the post and the e-blast until each
title is typed. Stop drawing the diagonals at the end of each photo drag. The outline stays.

### C7. Photoshop: the cone heal leaves no seam (minor)

Seen: from the cone heal's release until the crane heal ends, a thin dark vertical line hangs from the building's base, with
faint orange specks where the cone was.

Correction: no patch after the heal is done. Add one base picture, `photoNoCone` (the sky-replaced photo without the cone and
barrier, crane still there), and use it as the base from the end of `cone` to the end of `crane`, the way `photoClean` is the
base afterwards. The atlas stays at five pages. The crane heal must not leave a new edge either.

### C8. Figma: the hero picture is in the panel from the start (minor)

Seen: the hero's source picture cuts into the empty right panel on `fill0`, with the cursor elsewhere. Make it part of the
panel's furniture, an asset that arrives with the opening wipe. The drag carries that same piece; its slot is empty after.
It appears on no other action.

### C9. Figma: the lit tool matches the action (minor)

Seen: the Type tool stays lit while the accents are set. Name the arrow on the `accent*` actions, and on `fill*` too so the
intent is explicit. Type is lit only during `name`.

### C10. `tools/sheet.mjs`

Its Photoshop caption still describes the old split still. Correct it.

### C11. The player's clock: a ceiling on one step

In `play.mjs`'s `tick`, clamp the step to 0.1 s. The motion then runs in real time down to 10 frames a second, and a stall
longer than that resumes where it stopped instead of skipping actions. Seeked frames must not change.

### C12. The build checks itself

Add these rules to `tools/checks.mjs`, sampled like the existing ones:

- **R1.** Nothing that contains the photograph is visible before the drag that carries the photo there has ended.
- **R2.** A pages-panel row first appears only during the action that makes its page (`spreadType`, `loc`, `coverTitle`,
  `pages`).
- **R3.** `kCover`, `kPost` and `eblast` first appear only after the `draw` of their own blob has ended.
- **R4.** Every text first appears as a typing prefix with a caret. A repeated caption counts as typed if the same text was
  typed earlier in the scene.
- **R5.** A new document piece first appears near the cursor (within 0.6 screen units of it, or of the action's own points,
  or inside a run's bounding box). The exemptions are a closed list in the check, written by role, each with its reason:
  furniture during the opening wipe; playback pieces; the members of a run; echoes of a cursor-made piece in the same frame
  (layer rows, lane blocks, the After Effects thumbnail, Figma's phone copies, the viewer); overlays and carets; the piece
  being dragged. Any other new piece fails.
- **R6.** A placed picture never disappears: until its own action removes or replaces it, no plain plate covers its centre,
  and a landed drag piece is at least 0.0006 in front of every face it overlaps.
- **R7.** During a `set`, `drag` or `click`, the lit tool is the arrow unless the action names another.

For each rule, undo its correction for a moment, see the rule fail, and restore it. Say in `BUILD.md` that you did, rule by
rule. The loop's allowed range becomes **70 to 82 s at `PACE` 1** (the corrections add about 2.3 to 2.5 s); replace the old
70 to 78 everywhere it is written.

### C13. README and BUILD

- README: the new timetable; the frame-style note of C3, part by part; what the hero costs (the atlas pages and their size
  in memory with mipmaps, the canvas at up to 2x, MSAA, the shadow map); the real reason `preserveDrawingBuffer: true` is on,
  and that the production build switches it off (do not change it now); and a production list naming a lost WebGL context
  (the canvas stays blank), no WebGL2 (dead controls, no still), phones, and the fallback to stills.
- BUILD: a new section for this correction, with what was done for each of C1 to C14, the rule-by-rule note of C12, and
  anything not done.

### C14. A measuring tool for a real graphics card: `tools/measure.mjs`

Nothing has ever been measured on real hardware, and the fixes above rest on height steps of 0.0006 to 0.0008 that a hardware
depth buffer may resolve differently from software. Write a small tool with no dependencies (Node's own modules and its
built-in `WebSocket`, speaking the DevTools protocol to a Chromium browser) that measures the packed preview.

`node design/journey-hero/take-2/tools/measure.mjs [--browser <path>] [--out <folder>] [--size 1440x900]`

- It packs the preview with the existing packer into `.scratch/measure/`, wrapped in a plain document skeleton, and loads it
  from that file. It starts the browser headless (new headless mode) with a throwaway profile folder inside
  `.scratch/measure/` and closes it when done. It finds Microsoft Edge on Windows by itself; `--browser` names any other
  Chromium (it must also run on Linux this way). It never uses an existing browser profile, never opens a network address,
  and loads nothing but that one file.
- It records: the browser's version; the graphics card as WebGL reports it (the unmasked vendor and renderer); whether that
  is a software renderer (for example SwiftShader, llvmpipe, Basic Render Driver), said loudly; whether WebGL2 exists; console
  errors; the time from navigation to `window.__ready`.
- **Frame times:** one full loop played without seeking, at 1440 x 900 and again at 1920 x 1080: the number of frames, the
  median and the 95th percentile of the gaps between frames, the worst gap, the number of gaps over 50 ms after the first
  second, and how far the hero's clock moved against the wall clock.
- **Memory:** the allocation worked out term by term from measured sizes: each atlas page plus a third for mipmaps; the
  drawing buffer and the multisample buffers at their real sample count; depth; the shadow map; the measured canvas size.
- **A flicker scan**, with the stage clipped out of page screenshots, every 0.05 s across these windows (taken from the
  scripts, not typed in): Photoshop from the start of `cone` to the start of `grade`; InDesign from the start of the `map`
  drag to the end of the scene; and in Premiere Pro, After Effects and Figma from the start of `export` to the end of the
  scene. Each time is seeked and captured twice, with a seek elsewhere in between: the frame fails if more than 0.1 % of its
  pixels differ by more than 2 per channel. And the blink rule: report every 8 x 8 block that matches between t - 0.05 and
  t + 0.05 within 3 per channel but differs at t by more than 24, with its time and place.
- **Contact sheets** of the same windows at 0.2 s steps, eight frames to a row at half size, each frame labelled with its
  time and scene, saved as JPEG with the window and its times in the file name, each sheet no wider than 1,600 px, the whole
  folder under 3 MB.
- It writes `measure.json` (everything above) and `measure.md` (the same, readable, with the card and browser at the top)
  and the sheets into `review/hardware/` (or `--out`).

Run it once yourself to prove it works and leave its output in `review/hardware/`. If Edge renders in software there, say so
in your report and leave the output anyway.

## Order of work, and the clock

Note the time when you start. Build in this order and keep `tools/checks.mjs` clean after each: C1, C2, C3, C6 (InDesign
together), C4, C5, C7, C8, C9, C10, C11; then C12; then C13; then C14. If about 60 minutes have passed and work remains, stop
there: the corrections matter more than the measuring tool. Say plainly in your report what is done and what is not.

## Done when

- `node design/journey-hero/take-2/tools/checks.mjs` prints `all clean`, with R1 to R7 in it.
- The six stills are what they are today, apart from the motion devices' ground (C4).
- The loop is between 70 and 82 s at `PACE` 1, its seam back to the start is continuous, and README's timetable matches.
- No new fade, bounce, blur or soft edge anywhere.
- `BUILD.md` has the record, and `review/hardware/` has the measurement, or the report says why not.

The reviewers will look at the corrected build in a real browser: frames every 0.05 s across every window you changed, the
stills against today's pixel for pixel, a scan of the whole loop for anything that disappears and comes back, and the
measurement above.
