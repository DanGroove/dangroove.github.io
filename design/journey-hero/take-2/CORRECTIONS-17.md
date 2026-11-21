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

**Not in this run:** Dan also asked (10:55 to 11:14 AM) for one tablet and one phone model in every scene, bigger, and "high end". That is R12, below, built in the run after F1 to F3. Do not change any device's size, shape or look in the F1 to F3 run.

Everything in `CORRECTIONS-2.md` to `CORRECTIONS-16.md` still holds unless it is changed here. The motion stays hard-edged: no fades and no blur. Nothing here touches anything outside `design/journey-hero/take-2/`.

## R12. One phone and one tablet everywhere: bigger, and high end

Build this after F1 to F3, on top of them, and keep everything they did.

Dan, 21 November, 10:55 to 11:28 AM ET:
- "make sure all phones and tablets are the same size throughout? the UXUI versions are dfferent for some reason"
- "just use the same model for all please"
- "make sure the tablet size works for all orientations that it will be in, right now the last one is too small looking and the other one is too wide/tall", then "Portrait/landscape I meant"
- On a decision card about the first mock, he picked "Laptop grows with it".
- "I Think the laptop and phone on all need to be bigger", then "These devices need to look high end please"
- On the mock of what follows (11:28 AM): "Make sure the video/motion fills the screens properly. Otherwise go for it"

Today there are three phones and three tablets:
- InDesign: a phone 0.418 x 0.861 and an upright tablet 1.047 x 1.45.
- Premiere Pro and After Effects: phones 0.718 x 1.480 and a 3.09 x 1.8 "tablet" in landscape, which is 16 : 9 rather than a tablet's shape.
- Figma: a phone 0.317 x 0.653 and a tablet 0.855 x 1.1.

Each scene also has its own rims, corners and screen shapes. After R12 there is one phone and one tablet. They differ only in where they lie, which way they face and what they show.

### The two models (world units)

| | Tablet | Phone |
|---|---|---|
| Body shape | 179.5 x 248.6 mm (a real tablet) | 77.6 x 163.0 mm (a large phone) |
| Body, portrait (w x d) | 1.1914 x 1.65 | 0.5150 x 1.0819 (true proportion to the tablet: 163.0 / 248.6 of its long side) |
| Screen | 1640 : 2360, an even rim of 0.0734 (`rimFor`), so the screen is 1.0447 x 1.5033 | 9 : 19.5, an even rim of 0.0146, so the screen is 0.4858 x 1.0527 |
| Thickness | 0.04 | 0.05 |
| Corner roundness (`e` around) | 0.1 | 0.16 |
| Top edge (`e` up) | 0.35: a rounded edge that catches the light | 0.35 |
| Detail | a front camera: a dot 0.018 across, centred in the bezel of one long side (the top bezel in landscape, the right bezel in portrait), lens tones `#3C4A56 / #26313A / #141A20` | an island: a flat pill in the glass tone (`#121111`), centred across the screen, 0.1425 x 0.0389 (88 x 24 px of the phone's 300 x 650 picture), its top 0.0194 (12 px) inside the screen's top edge, which is where the pictures draw their islands today. It lies just above the highest picture layer that phone ever has, at the same height in every frame. |

**Tones.** The body is metal on its sides and black glass on top. As `tones` (lit side, top, shaded side): `['#ABA59E', '#121111', '#4A4541']`. The screen's pictures start on the glass with no gap. Each device's layers start from its own face (R9).

**The tablet's orientation.** The tablet is portrait in InDesign and Figma, and landscape in Premiere Pro and After Effects (the same body, turned 90°). The phones are portrait everywhere.

### Pictures fill their screens

Dan's condition: the video and motion fill the screens properly. So every picture fills its whole screen, out to the rim: no black bars, no glass showing, and nothing stretched. A picture whose art has another shape is drawn again at its screen's shape: 2360 : 1640 on the landscape tablet, 1640 : 2360 on the upright one, 9 : 19.5 on the phone. It is never stretched, and never zoomed so far that its furniture or its subject is cut off.

- **The landscape tablet (Premiere Pro and After Effects).**
  - The video and the motion are drawn at 2360 : 1640 (for example 472 x 328) and fill the screen.
  - The shots (`SHOTS`) and the motion (`saas`) are drawn to fill any frame. So lay them out again for this frame, the way the tall and square exports already are. The person, the sun and the skyline fill the frame. "Make it move", the ball's path and the list rows keep their size, with margins at least as wide as today's.
  - The player's furniture (the play icon and the scrub bar) keeps its size and its distance from the bottom and left edges. The bar ends at the same distance from the right edge.
  - This replaces `playerWide`, `chromePlayer`, `motWide`, `chromeMotion`, and the shots and layout that `movie()` and `animatedComp()` use for the tablet. Premiere Pro's own program monitor and After Effects' comp stay 16 : 9.
- **The phones (Premiere Pro and After Effects).** Each phone picture is drawn at 9 : 19.5 (300 x 650) and fills the screen.
  - What hangs from the top stays where it is: the progress bars, the header and the status area.
  - What hangs from the foot moves down the extra 50 px: the nav bar, the home bar, the reel's account lines and side buttons, and the story's call to act.
  - The picture between them grows. The tall video and the story fill the full height. The feeds keep their square picture under the header, and show the top of the next post in the extra space (its avatar and name lines, drawn like the first post's), not an empty band.
  - This covers `reel`, `feedSq`, `motTall`, `motSq`, their chrome arts and the tall shots. It also covers `movie()`'s and `animatedComp()`'s layouts for the phones and `playback()`'s progress lines.
- **The captions.** Today the reel's caption is drawn 13 % taller than its art and the feed's 8 % flatter. Each keeps its art's shape (352 : 74) on every screen.
- **InDesign.** Its phone shows the LinkedIn post redrawn at 300 x 650 (today 300 x 664). Its tablet shows the e-blast in the mail app, redrawn at 1640 : 2360 (today 362 x 516, 1 % off).
- **Figma.** Its tablet pictures are redrawn at 1640 : 2360, as a website fills its screen: `wireTablet`, `uiTablet`, `chromeTablet`, and the work pictures and prototype states drawn for the tablet. Figma's canvas frame for the tablet takes that shape too (`FIG`'s `tw`). Its phone pictures are 9 : 19.5 already.
- **One island.** No picture draws an island or a notch of its own: remove `island()` from the arts and the bar at the top of `chromeHandset`. Each phone's own island (in the table) is then the only one, the same on every phone.

### The laptop

Space grey aluminium:
- the deck and lid: `['#86807A', '#3E3A37', '#252220']`;
- the keyboard well's top: `#121111`;
- the keys: `['#2C2928', '#1B1918', '#111010']`;
- the trackpad: `['#86807A', '#4A4643', '#252220']`.

It scales by 1.4 about its hinge's left end. `lidW` becomes 2.17, and `lidH` and `deck` become 1.54. The keyboard, the trackpad, the bezels and the chin scale with it. The deck's thickness stays 0.08, and R10's flush lid holds at the new size. The laptop's own screen pictures keep their shape (16 : 10).

Dan's round 13 rule (U1) made the tablet exactly as deep as the deck. At this size, a deck as deep as the tablet (1.65) runs off the stage's left edge, or puts the lid over Figma's canvas. So:
- the deck is 1.54;
- the tablet's and the phone's front edges stay on the deck's front edge;
- the tablet reaches 0.11 further back.

### Where they lie

**InDesign.** The booklet keeps its size. The row behind still spans exactly the open copy's width, with two equal gutters (I2): stack, phone, tablet. That makes each gutter 0.085. All three front edges are on the stack's front edge, and the tablet, being taller than a page, reaches 0.2 further back. The export's piece grouping (the indices in the comment at "floor: as prints() builds it") must follow the new pieces.

**Premiere Pro and After Effects.** Left to right: the landscape tablet, then the two phones. The phones' front edges are on the tablet's, with 0.25 gaps, centred on the mat as now. The mat is 3.18 wide.

**Figma.** The row (laptop, tablet, phone, with 0.3 gaps) stays centred where it is now and moves 0.47 further forward (`forward` 0.93), with no sideways move. On my mock that is the least forward shift that gives H10's 12 px: `laptopClearance()` measures 12.4 px. In every frame:
- the open lid clears the canvas frames, the toolbar and the bar by at least 12 px (H10), and the Laptop ring stays clear;
- every device lies inside the pinned fit (below);
- the labels keep clear of the page's text, the craft list and the page's edges at every size, as `fitCalloutView()` solves now. The Laptop and Tablet labels sit further left than today, as the Phone label already sits beyond the stage box on the right.

If any of these cannot hold, tell me the numbers rather than shrinking anything.

### The camera stays where it is

Pin the camera's fit for the default camera to today's numbers: `{ w: 6.472556630033903, h: 7.02662378036781, x: 0.4431895737378033, y: 1.9701472394822923 }`. `play.mjs`, `stills.mjs` and `sceneEnvelope()` (view.mjs) all compute it from the six stills today. Make them read this one constant for the default camera, so that nothing on the page moves or scales because of R12. A camera turned by `yaw` or `pitch` still computes its own fit.

Why: measured on my mock, the bigger Figma laptop widens the stills' envelope. At the placement above it would grow to w 6.580 and h 7.084, and the whole scene would shrink by 1 to 2 % at every larger size. Pinned, Figma's devices still lie inside the fit: their leftmost point is 0.14 and their lowest point 0.19 inside the box's edges, out of the 0.25 margin.

With the pin, the scene's scale `S` stays the same or grows at each of the ten browser sizes. On my mock it is unchanged at seven of the ten sizes. It grows 7 to 11 % at 390 x 844, 360 x 780 and 412 x 915, probably because the video row's labels bound it there today and the new row is narrower. Report all ten before and after.

### What stays

- The timing: R12 changes no time, and the loop stays as F2 left it.
- The ball, which still splits into the red blocks of the new bodies' footprints.
- The wipes, the sinks (each by its own height, R11) and the labels. Each label anchors to its device's new corner.

### Checks for R12

Add these to `tools/round17-checks.mjs`, with negative controls under `--controls`:
- **The models are identical.** Every phone in every scene has the same body size, thickness, rim, tones, roundness and island. Every tablet has the same size, rim, tones, roundness and camera, landscape being the same body turned 90°.
- **Every screen is filled.** In every frame where a device shows pictures, its picture layers cover its whole screen out to the rim (within 0.001), with no bars and no glass showing.
- **Every picture keeps its shape.** Every picture layer on a device keeps its art's aspect within 0.5 %, the captions and chrome included.
- **No gap** between a screen's pictures and its glass: each device's first layer sits on its own face.
- **One island.** No phone art draws an island or a notch. Each phone's island has the same size, place and height in every frame.
- **The laptop and the camera.**
  - The laptop's scale.
  - H10's 12 px clearance (`laptopClearance()`) and the Laptop ring in every Figma frame.
  - The pinned fit, with every piece of the six stills and of every Figma frame inside it.
  - `S` at the ten browser sizes the same as today or larger.

Earlier checks that pin a device's old size, rim, placement or picture shape (for example in `round12-checks.mjs`, `round13-checks.mjs`, `correction-checks.mjs` and `controls.mjs`) take R12's numbers. List each in BUILD.md with its old and new number, and change nothing else about them.

**Negative controls**, each of which must make its check fail:
- one old phone size in one scene;
- the 16 : 9 picture letterboxed on the landscape tablet;
- a phone's 300 x 600 picture centred on its 9 : 19.5 screen, with bars at both ends;
- a stretched picture;
- a phone art that draws its own island again;
- Figma's row at its old `forward` (0.46), with the lid over the canvas;
- the fit computed from the stills instead of pinned.

### Records for R12

- BUILD.md: add a "Round 17, R12" part. It covers the two models, every picture redrawn and its new size, the placements, the pinned fit, the ten sizes' `S` before and after, and the checks changed.
- README: the devices, and the screens the exports play on.

## Critique round 1: three corrections (C1 to C3)

Build these on top of R12 (`6e790cf`) and keep everything else. Two independent critics reviewed `6e790cf` in a real browser and agreed these defects, their causes and how each will be judged. Change nothing else: no time, size, place, picture or colour that these corrections do not name.

### C1. No dark star on any device screen

What shows: on every phone and tablet screen, in every scene, a black star of spikes at the middle of the screen (Premiere Pro's still at 59.514 s, After Effects' at 77.296 s, and the others).

Cause: each device's lowest picture layer has its top face exactly at the body's top (0.05 phone, 0.04 tablet). The body is a superellipsoid whose top is slightly domed (`e` up 0.35), so the two surfaces fight for depth around the pole. The check "R12 no gap" asserts that coplanar state, so it passes on the starred build.

- Every picture layer on a device lies on the glass: its underside on the body's top face, its top 0.002 above it. `device()` places its own screen picture from `m.t`, not `m.t - 0.002`. The device painters (`floorPainter` for the playback and the prototype) start their first layer's underside at the device's face: pass that base explicitly from the device, with no test on its value.
- The phone's island rises by the same 0.002: `face` 0.052 + 16 x 0.0008 = 0.0648 (underside 0.0646). It must stay above every layer that phone ever has; today Figma's tap dot reaches 0.0628 once the layers rise. Same size, place and tone as now.
- The tablet's camera stays where it is (it lies in the bezel, under no picture).
- The laptop's lid pictures are not part of this correction.

Checks: "R12 no gap" compares each device's lowest layer's **underside** with the glass top (within 1e-9). Add: each device's lowest layer's **top** is at least one `LAYER_STEP` above the glass, for every phone and tablet in every frame before its sink. "R12 one island: fixed height" expects 0.002 + 16 x 0.0008. Negative control: the old placement (`m.t - 0.002` and the painter starting at the face) must fail both no-gap assertions. Update BUILD.md's island numbers (0.0648, 0.0646, highest layer 0.0628).

How it will be judged: dpr 2 frames of each device at the four floor stills (40.380, 59.514, 77.296, 96.191) show no star and no step between a picture and its glass at the rim, and R9's still faces stay still through the restarts.

### C2. Every object goes under the floor whole, and all of them together

What shows, in every floor sink:
- InDesign (`return`, 42.782 to 43.782): the open reading copy is gone at +0.13 to +0.22 s while the stack, phone and tablet last to about +0.635 s. The phone's body is gone at +0.43 s, but its island stays alone on the floor until +0.635 s, about 12 frames.
- Premiere Pro (62.164 to 63.164) and After Effects (79.946 to 80.946): the bodies are gone at +0.365 s; their pictures stay to +0.41 s and the chrome and islands to +0.445 s (the tablet's play icon and scrub bar, the phones' header cards and account lines, "move" and the list rows float alone).
- Figma (98.491 to 99.491): the tablet's and phone's bodies are gone at +0.40 s; their lines float beside the shut lid until +0.535 s.

This breaks R11: "all three start together and are gone together", and "every piece starts and finishes together".

Cause: `exportOut()` moves each format rigidly by one depth taken from its tallest piece. The reading copy shares format 0's depth with the 0.3 tall stack, so it goes far sooner. Within a device, the tallest piece is a layer on the glass (the island at 16 layer steps, or a picture), so the body's top, which is lower, crosses the floor first and everything stacked on it is left on show.

- The objects are: in InDesign, the reading copy (both halves together), the stack, the phone and the tablet; in Premiere Pro and After Effects, the tablet and each phone; in Figma, the laptop (deck and shut lid), the tablet and the phone.
- Each object sinks by its own height, taken from its body's top (a device's top face, the stack's top, the reading copy's own top, the shut lid's top), with the shared proportional clearance the build uses now (`depth = H x (1 + 0.02 / max H)` within each scene), so all of a scene's objects cross the floor together.
- Everything a device carries (its screen pictures, chrome, overlays and tap dots, island and camera) sinks with it and is not drawn once its body's top is under the floor: clip each such layer at its own rest height above the glass, so it goes under on the same frame as its body. Nothing may show as a sliver after its body.
- Keep the 1.0 s span, the curve, x and z fixed, the floor's clip, and the lid shut before Figma's sink starts.

Checks, at 0.01 s steps in all four sinks:
- every object's last drawn sample is within 0.01 s of the others in its scene;
- no carried piece is drawn after its body's last drawn sample;
- every piece is under the floor by the end of the span.

Negative controls, each of which must fail: the carried layers without their clip; the reading copy grouped with the stack again; heights from the tallest piece instead of the body's top.

How it will be judged: browser frames at every 1/60 s over each whole sink (corrected in critique round 2: the window first written here, the last 0.4 s, began after the thin devices' crossings), at 1474 x 996, dpr 1 and dpr 2. After the frame in which an object's body is last drawn, no pixel in that object's footprint differs from the empty floor by more than 8 levels (the cursor, the big app screen above and the labels excluded).

### C3. Illustrator's badge release changes nothing but the cursor and the rail

What shows: at the badge's release (Illustrator, 14.082 s), every white marker square and grey street bar on the upper map gains its soft edge in one frame. Nothing moves, but about 2,479 pixels brighten by up to 105 levels at dpr 1. This is rule G's table entry for the badge and R2: "At release, only the cursor and the rail change."

Cause: until the badge ends, the upper map's base is `mapStreet` (the map without markers, labels and badge), and the markers and bars are crops of `kMap` (`AM_MARKERS`, 30 x 30; `AM_LABEL_BARS`, 11 wide, `art.mjs` about lines 877 and 878, drawn by `mapRegion()`). Each crop ends exactly at its shape's edge, so `kMap`'s anti-aliased fringe just outside it is missing. When `kMap` replaces the build, every fringe appears at once.

- Every crop of `kMap` laid on `mapStreet` covers every pixel of `kMap` that differs from `mapStreet` around its shape: for example, pad each `AM_MARKERS` and `AM_LABEL_BARS` region by at least 2 px of the 2200 x 850 map (one texel) on every side. The padding shows `kMap`'s own pixels, which match `mapStreet` outside the shapes. Keep the bars' upward reveal as it is.
- Look for any other place where crops of a finished picture sit on a base that the finished picture later replaces, and treat it the same way; list what you found in BUILD.md.

Check: at the badge's release, every texel where `kMap` differs from `mapStreet` lies inside the crops drawn in the frame before. Negative control: today's tight regions must fail.

How it will be judged: browser frames at 14.080 and 14.084 (dpr 1) and 14.081 and 14.083 (dpr 2). Outside the cursor and the tool rail, no pixel differs by more than 8 levels.

### Not in this run

These were found and will be put to Dan separately. Do not change them: the browser check's H6 at 1280 x 800 and H5 "logo guard" at 1366 x 657 (both fail since `d251dce`, before round 17); how long the sink stays in view; the STORY ring over the story's call to act; the ball over the Export button's red end as it pops; the laptop lid's pictures on its flat glass.

### Records for C1 to C3

BUILD.md: add a "Round 17, critique round 1" part: each correction with its numbers, the checks and controls added, and every earlier check changed with its old and new number.

## Critique round 2: C3 again, C4 to C6

Build these on top of `dcb8094` and keep everything else, C1 and C2 included. Both critics re-reviewed `dcb8094` in a real browser. C1 passes: no star, no step at the rims, the island and the tablet camera right, R9's faces still. C2 passes as judged: every object of a scene is last drawn in the same frame (InDesign 43.415, Premiere Pro 62.581, After Effects 80.363, Figma 99.024). C3 does not hold, and the re-review found two smaller defects in the sinks. Change nothing else: no time, size, place, picture or colour that these corrections do not name.

### C3 again. Cut-outs instead of padded crops, so a release changes nothing

What shows: at the badge's release (14.080 against 14.084 s), outside the cursor and the rail, about 1,737 to 2,208 pixels still change by more than 8 levels at 1474 x 996, dpr 1 (up to 80 levels), and about 880 to 1,001 at dpr 2 (up to 49). The markers' and bars' soft edges still appear in one frame. And the stills after a release are not the finished picture, because the crops are still drawn over it: at 18.881 s the upper map differs from a plain render of `kMap` by 2,527 pixels over 8 levels.

Cause: the atlas is sampled with mipmaps (`LINEAR_MIPMAP_LINEAR`, levels 0 to 3, 4x anisotropy; `sq.mjs` lines 328 to 335). So a shape's soft edge on screen spreads over about 1.5 x 2^L atlas texels, L being the mip level the picture is drawn at: about 6 texels at 1474 x 996 dpr 1, about 3 at dpr 2, and 12 or more at 390 x 664. C3's pads are 1 to 2.5 texels. Neighbouring marks are about 7 texels apart, so no pad is wide enough at every size without showing a neighbour's edge before that neighbour is placed. A hard mask has the same limit.

Correction:
- Replace every crop that C3 padded (BUILD.md's inventory, 157 regions: on the upper map the 48 markers, 48 bars, the north sign and the badge; on the lower map the 21 blocks and the 22 pins, the building among them; in InDesign the cover, post and mail blobs and the mail button; in Figma the hero box, the two headings and the nine detail regions) by a cut-out: a picture of that one mark alone on a transparent ground.
- Paint each cut-out with the finished picture's own drawing code: the paint commands that the finished picture adds to its base (C3's Node proof already records them), replayed in their original order on a transparent canvas. No new artwork, no redrawn shape.
- Each mark that is placed on its own has its own cut-out picture. Each cut-out picture keeps a transparent margin of at least 24 atlas texels around its mark, and its drawn quad covers that margin (clipped to the base picture's outer edges), so the mark's whole filtered edge is drawn at every size. In the atlas, keep a transparent gutter of at least 24 texels around every cut-out picture, so that no texel of another picture reaches its samples at mip level 3 (the coarsest level the atlas samples, `TEXTURE_MAX_LEVEL` 3), with the bilinear neighbour and the anisotropic spread.
- Blend the cut-outs, never alpha-test them: premultiplied colour, blended `ONE, ONE_MINUS_SRC_ALPHA` over what is drawn beneath, lit as today's crops are. Never `cut: true`: that would bring back the hard edges F3 removed. This needs a blended pass in `sq.mjs`: pieces marked for it are drawn after the solid, cut and outline passes and before the floor, in the finished picture's paint order, with depth testing on and depth writes off. Only their picture face is drawn; they cast no shadow and get no outline, as today's crops.
- Reveals do not change: each mark appears at its own time and place, the bars rise in their eight steps, the badge and the block grow from the drag's corner, and the typing and the wipes are as today. Only what is drawn changes, not when or where.
- In the release frame itself, the finished picture alone replaces the base and all its cut-outs: Illustrator's upper map at 14.082 and lower map at 16.806, and InDesign's and Figma's pictures at their own releases (list them in BUILD.md). From then on no cut-out of that picture is drawn.
- F3's typed letters stay as they are, unless the pixel gate below shows them changing at a release. Then list where, and give them the same treatment.
- If `sq.mjs` cannot be given a blended pass, stop and report. Do not fall back to wider padding.

Checks:
- Node, an exactness proof on the recorded paint commands, in place of C3's coverage proof. For every picture: the finished picture's commands are its base's commands plus every cut-out's commands, each in its original order; each cut-out holds only its own mark's commands, and none is missing or repeated; every one of them paints source-over, so the composite equals the finished picture up to rounding. List any exception (a base command painted after a mark that it overlaps, a composite mode other than source-over, a clip shared by two marks) with its count; there should be none. Also: every cut-out's margin and atlas gutter are at least 24 texels; no cut-out of a picture is drawn at or after its release; the release frame draws the finished picture alone.
- Browser, in the new pixel gate (below): at every rule G release (Photoshop 2.296 and 2.991; Illustrator 14.082, 14.528 and 16.806; InDesign 22.667, 25.233, 27.066, 29.779 and 32.350; and each picture release that C3 found in Figma), compare the frame 0.002 s before the release with the frame 0.002 s after it, with the cursor's projected box grown by 4 px, the caret and the tool rail masked. Sizes: 1474 x 996 at dpr 1 and dpr 2, and 390 x 844 at dpr 2. No pixel may differ by more than 8 levels; at 390 x 844 only, at most 0.5 % of the changed picture's pixels may, each one counted and recorded.

Negative controls: the Node proof fails with one marker's cut-out removed. C3's control "old tight regions" goes: it tested only the coverage proof, which passed a release that changes on screen. The coordinator runs the pixel gate on `dcb8094`'s packed preview, where it must fail at 14.082.

How it will be judged: frames at every release above; in Illustrator's marker, label, title and badge builds (11.728 to 14.082 s, every 1/60 s), no mark shows before it is placed, and each placement changes pixels only around its own mark, apart from the cursor and the caret; the stills with a finished picture (18.881 among them) match a plain render of the finished picture within 8 levels.

### C4. The reading copy's two halves sink by their own heights

What shows: in InDesign's sink (42.782 to 43.782 s), the open reading copy's right half (the "Main Lobby" page) is under the floor at 43.037 s, +0.255 s, while its left half, the stack, the phone and the tablet stay until 43.420 s, +0.638 s.

Cause: C2 sinks the reading copy as one object by its own top, which is the top of its taller left half (0.040). The right half is 0.010 tall, so it crosses once the copy has sunk 0.010.

Correction:
- In the sink, the reading copy is two objects, its left half and its right half, split at the spine (about x = -0.1). Every piece of the copy belongs to one half; report any piece that spans both.
- Each half sinks by its own top with InDesign's shared factor: the left half 0.040 x 1.08 = 0.0432, the right half 0.010 x 1.08 = 0.0108. Both cross the floor with the others at +0.638 s. InDesign then has five objects.
- Nothing else about the copy changes: x and z stay fixed, the floor clip stays, and the halves do not part (the step at the spine just shrinks with their heights).

Checks: C2's checks with five InDesign objects, every one last drawn within 0.01 s of the others. Negative control: the two halves grouped as one object again must fail.

How it will be judged: every 1/60 s frame of the whole InDesign sink at 1474 x 996, dpr 1 and dpr 2: the right half is still drawn at 43.400 s and last drawn in the same frame as the rest, and no floor shows between the halves at the spine before then.

### C5. Nothing breaks up in the frame before it goes under

What shows: in the frame just before a crossing, dark patches on the objects' tops: an X across Figma's shut lid at 99.025 s, dark wedges on InDesign's pages at 43.410 and 43.415 s. It is older than round 17, but C2 puts every object's crossing in the same frame, and after C4 the 0.010 right half would stay in the band where it happens for about 54 ms, three frames, on every loop.

Cause: depth precision. `sq.mjs` tests depth with `LEQUAL` (line 408) and draws the floor after the pieces (lines 486 to 495). When a top face is within about 0.0002 world of y = 0, the floor wins in patches that follow the face's mesh lines: the lid is clean at 99.024 s with its top 0.00024 above the floor, and broken at 99.025 s.

Correction:
- Draw the floor with a depth offset away from the viewer: `POLYGON_OFFSET_FILL` with a factor of at least 1 and at least 2 units, on for the floor's draw only and off again after it. Nothing that lies on or above the floor then loses to it.
- Every sinking piece is already clipped at y >= 0 and culled once its body's top is under the floor, so every crossing stays as it is (+0.638, +0.419, +0.419, +0.535 s) and C2's numbers do not change. If anything passes through the floor without the floor's clip, give it the clip, so the offset cannot show what lies just under the floor.
- Do not hide objects early by a distance from the floor. Each top falls as H x (1 - k g), so thin objects reach any fixed distance sooner: a 0.002 margin would hide the right half about 0.2 s before the stack, and break "together".
- Everything that lies on the floor on purpose (the shadows, the light pool, the mat, the floor dots, the red blocks, the landed ball) must look as it does now.

Checks: Node, through C2's WebGL recorder: the floor's draw call is made with the polygon offset on and positive, and the state is restored after it. Browser, in the pixel gate: in each sink, sampled every 1 ms from 0.1 s before the scene's crossing to 0.02 s after it, at 1474 x 996, dpr 1 and dpr 2: within the sinking objects' projected footprint, the count of pixels that differ from the empty floor (the frame at the sink's end) by more than 8 levels never falls by more than 5 % from one sample to the next before the crossing, and is 0 after it. Negative control: the Node gate fails without the offset. The coordinator runs the pixel gate on `dcb8094`, which must fail it.

How it will be judged: the same 1 ms frames; and nothing else changes: the six stills, one rest frame in each floor scene (after its landings, before its sink) and one frame in each sink's first 0.3 s match `dcb8094` within 8 levels, apart from the pictures C3 changes, which match a plain render of their finished pictures.

### C6. The sink's control tests behaviour

C2's control "carried layers without their clip" now fails only at a structural assertion, because the whole-object cull already ends the carried layers. Replace it with a control that removes both the cull and the clip. It must fail at the behaviour gate "C2 carried lifetime: drawn after body".

### The pixel gate

Put C3's and C5's browser gates in a new file, `tools/round17-pixel-checks.mjs`. Playwright is not installed on the PC, so it cannot run there; the coordinator runs it in the cloud. Write it so that it runs there without changes:
- Export `checkRound17Pixels(chromium, previewPath)`: it runs every gate on the packed preview at `previewPath` with the given Playwright browser type, and returns its rows and its failures. Add a command line, `node design/journey-hero/take-2/tools/round17-pixel-checks.mjs [packed preview]`: it finds Playwright the way `runBrowserCheck()` does (prints UNAVAILABLE and exits 2 when it is missing), packs this build's preview with `previewMarkup()` when no path is given, prints one line per gate with its numbers, and exits 1 on any failure.
- Launch Chromium with `GL` from `tools/sheet.mjs`, as `film.mjs` does. Use one context per size and dpr (`viewport` and `deviceScaleFactor`), with service workers blocked and every request other than file, data and blob aborted, as `runBrowserCheck()` does. Wait for `window.__ready` and `document.fonts.ready` before the first frame.
- Seek with `window.__hero.seek(t)`, take `page.screenshot` clipped to what the gate compares (as `film.mjs` does), and decode the PNG with Node's zlib as `tools/measure.mjs` does. No new dependencies.
- Find the cursor's, the caret's and the tool rail's boxes and the sinking objects' footprints from `__hero.pieces` and `__hero.view` with `visibleProjection`, as `checkBrowser()` projects the laptop, and convert them to the screenshot's device pixels.
- Test its decoding, masking and counting in Node on small synthetic images, since it cannot be run on the PC.

### Not in this run, still

Unchanged from round 1's list: the browser check's H6 and H5 (failing since `d251dce`), how long the sink stays in view, the STORY ring over the story's call to act, the ball over the Export button's red end as it pops, and the laptop lid's pictures on its flat glass.

### Records for C3 to C6

BUILD.md: add a "Round 17, critique round 2" part: C3's cut-outs (how many for each picture, their atlas pages and gutters, the blended pass, the release frames), C4's halves (their pieces, heights, depths and crossings), C5's offset, the checks and controls added or changed, every earlier check changed with its old and new number, and how to run the pixel gate.

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
