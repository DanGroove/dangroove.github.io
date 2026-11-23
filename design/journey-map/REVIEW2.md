# Round 7 part D2: the critique's round 2 fixes

Read this whole file before you change anything. Then read the files in section 4.

Two reviewers looked at the page after part C2 (one for the look, one for behaviour and code) and agreed on these fixes. Part D1 (`FLASH.md`) already moved the supernova to its own canvas and fixed explore's gestures; do not undo or rework any of that. Each item below says what to change and how it will be checked. Where an item is a drawing, it will be judged on real frames in a browser after you finish, so describe in your report what you drew.

## 1. Fixes

### 1.1 Hammer game copy (D2-1, D2-2)
- The rune cards print "Fly 60.00000000000001% faster": `hammerRuneNumber` (findhammer.mjs) multiplies floats. Round every number it returns to a whole number.
- The run's end prints "1 foes felled.": `stats` in `FIND_COPY.hammer` (data.mjs) needs `foe{s}`, with `s` worked out from the foe count, not from `n`.
- Check (check.mjs): format every rune line at every level and every `FIND_COPY.hammer` string that holds a number, with each number at 1 and at 2. Fail on any `\d\.\d{3,}`, on "1 foes", "1 hearts" or any other "1" before a plural, and on a singular after "2" (for example "2 foe ").

### 1.2 Card focus (D2-4)
- When a closed card is reopened from its stop mark (`.st-btn`, cards.mjs), focus is left on the mark, which is then hidden and takes no tab stop. Once the reopened card is open (its state becomes `open`), move focus to that card's X (`.c-close`), without scrolling.
- The card X still acts while the journey moves. Ignore X presses while `JOURNEY.moving` is true, like the Escape path in main.mjs, so focus never lands on the stop mark of a stop the journey is leaving.
- Check (steps-test): a case that fails if the focus move is removed, and a case that presses X mid-move and finds focus not on the departed stop's mark.

### 1.3 The hint line over giant stop labels (V2-1)
At find zooms (a find holds the camera), the stop names and their sub-lines are scaled up to 40 to 60 px and the hint line sits on top of them.
- Wrap the tier-1 labels that `bigMap` (art.mjs) adds straight into the camera group in one group, `g.map-tier1`. While a find holds the camera, fade it and `g.map-subs` out with `st.focusK` (for example `1 - smooth(0, .4, focusK)`), set `visibility: hidden` at 0, and write each value only when it changes by more than 0.01, snapping to exactly 0 and 1 at the ends. They come back as the find lets the camera go.
- Give the hint text (`.find-hint`, used by finds and by the explore hint) a solid Ink box: background `var(--ink)` at full opacity, padding about 6 px 12 px, radius 8 px.
- Check (finds-test): with focus k at 1 the tier-1 and sub-line groups are at opacity 0; at 0 they are at 1.

### 1.4 The phone end screen and the explore controls (V2-2)
At 390 x 844 the end screen's controls collide with the call to action: "Back to the top" (the second row of the `.go` bar, about y 96 to 128) runs into the headline "Got an idea that needs carrying to the final cut?" (`.ft-q`, from y 118). At 360 x 640 the headline starts at y 90, under both rows.
- On phones, start the footer's call to action (`.ft-q` and the "Let's talk" button) at least 16 px below the bottom of the `.go` bar, whatever its height. Measure at resize, never in a frame.
- The supernova on the phone end screen sits at `CAMERA.footerXPhone` (x 0.58, y 0.5 of the screen; Dan asked for it lower than before, so never move it up). If the call to action's bottom plus 16 px would reach the supernova's press target (the round button from part D1, radius `NOVA.flare.hit` px), move the supernova down just far enough, and no further, and keep the press target at least 16 px above the footer name.
- Check (steps-test or a new layout test): at 390 x 844, 360 x 640 and 412 x 915 the `.go` controls, the headline, the "Let's talk" button, the supernova's press target and the footer name do not overlap and have at least 16 px between them. Use the same analytic boxes the code uses for layout.
- In explore on the phone, the back control reads "Back to the end" but stays a 44 px circle (the phone rule `.go-end .go-back` wins over `.jm-explore .go-back`), so its words wrap into four lines over the map, and the row sits on the map's title "The saga so far". Give it the pill shape and one-line label it has in explore on desktop, keep it and "Back to the top" on one row at least 8 px apart, and keep that row clear of the map title when explore opens at its fitted view.
- Check: in explore at 390 x 844 and 360 x 640, the back control's label is on one line and inside its button, and the row's boxes do not overlap each other or the title's box.

### 1.5 Label sizes and collisions at the overview (V11, V2-5)
`LABELS` (data.mjs) caps the label scale, so at the overview the stop names come out at 7 to 8 px, below their own floors. Agreed sizes on screen at the overview, at desktop (1440 x 900) and phone (390 x 844) sizes:
- stop names and the X label: 10 px or more on desktop, 9 px or more on the phone;
- the legend and the subtitle: 9 px or more on both;
- stop sub-lines may stay at 7.6 px if they fade in with tier 2 (move them into tier 2's fade);
- the deadline signs (the 2 px signs on the deadline shields) join tier 2.
Clear the collisions this makes or already has: "X marks the work" and the tent and caret glyphs near it; the HMC-again sub-line ("on contract, 2021 to 2022") and Yggdrasil's crown. Moves of up to 6 map units per label or glyph are fine; never move a stop, the trail, the X or a find.
- Check (check.mjs): at both overview sizes, every visible tier-1 text is at or above its floor, no visible text is under 6 px, and the analytic boxes of the labels, the tents, the carets and the crown are at least 2 map units apart.

### 1.6 The hammer game's look (V2-4)
Dan asked for a shooter "like" the arcade classic; the agreed reading is an original Norse game, and today's foes read as the arcade's crab invaders and its three bunkers. Change the drawing only:
- Foes as Norse silhouettes in the game's line style, each one clearly its kind: draugr (gaunt, hunched, ragged cloak, notched blade), rime giant (broad shoulders, icicle beard, club), son of Múspell (tall, flame-tongue hair, a blade), wolf (low, running, in profile), giant chief (the biggest: horned helm, two-handed club). Vary their proportions so the rows read at different heights (giants tall, draugr lean, wolves low and long), but keep every drawing inside its own hit box (`HAMMER.foe` and the boss sizes), so a hit on the drawing is a hit in the game.
- The three shield blocks become a shield wall in three segments: each segment a row of overlapping round shields (rim, boss, a few planks) built over the same cells (`HAMMER.shield`), and a destroyed cell bites a piece out of its shield.
- No change to the march, the formation, the timings, hit boxes, cell positions or any balance number. hammer-test's balance results must stay as they are now.

### 1.7 The chest lid's speed (V5)
The lid does most of its swing in about 48 ms. The agreed limit: at most 25 degrees per 16 ms frame at any point of the swing and the settle, about 0.5 s to the peak, starting gently, overshoot at most 8 degrees. Change the lid's timing and curve in `FIND_PLAY` and findhoards.mjs only.
- Check (finds-test): step the open at 16 ms frames and assert every frame's lid step is at most 25 degrees.

### 1.8 The take-off feathers (V2-3)
When a raven takes off, its "feathers" hang on the boughs and read as leaves on the bare tree. Make them small quill marks (a shaft with a thin vane) that start behind the bird, drift down and fade out within 0.8 s.
- Check (finds-test): each feather's box is at most a third of a wing's box, its y increases over its life, it never overlaps the other bird, and it is gone by 0.8 s.

### 1.9 Yggdrasil's crown (V2-6, lower priority)
The crown reads as a cloud or broccoli. Dan asked for Yggdrasil to be "much more impressive". Redraw the crown as an ash's crown: three to five lobed masses of foliage at different heights with gaps between them where the limbs show, the trunk splitting into three or four main limbs that run up into the masses, wider than tall, in the map's line style (outlines and light hatching, no flat fill that reads as cloud). It stays the largest drawing on its island. Keep the trunk, roots, well, labels and the tree's place as they are, apart from the moves 1.5 allows.

## 2. Tests
Every existing test must still pass, plus the checks named in section 1. Where an existing assertion reads something you changed on purpose, change it to the new behaviour and say so in the report.

## 3. Files
You may write only these, all under `design/journey-map/`: `findhammer.mjs`, `hammer.mjs`, `data.mjs`, `cards.mjs`, `steps.mjs`, `trip.mjs`, `art.mjs`, `map.css`, `footer.mjs` (only for 1.4's measuring), `findcreatures.mjs`, `findhoards.mjs`, `findkit.mjs` (only if the hint box needs it), `tools/check.mjs`, `tools/finds-test.mjs`, `tools/steps-test.mjs`, `tools/hammer-test.mjs`, `tools/explore-test.mjs` (only if an existing assertion must follow), a new `tools/layout-test.mjs` if you want one, the files the two pack tools write (`joined.html`, `dist/journey-map.html`, `dist/journey-joined.html`), and your report `REVIEW2-BUILD.md` (new). If check.mjs or any test in tools/ holds a digest of a file you changed (tools/finds-test.mjs locks the digest of trip.mjs, for example), re-record it and list it in the report.

## 4. Read first
`FLASH.md` and `FLASH-BUILD.md` (what part D1 changed), `findhammer.mjs`, `hammer.mjs` and the `HAMMER` table, `cards.mjs`, `steps.mjs` (focus and `JOURNEY.moving`), `trip.mjs` (`tripApply`, `tripFocus`, `labelScale`), `art.mjs` (`bigMap`, the label rows, Yggdrasil, the tents and carets), `map.css` (`.find-hint`, the footer and `.go` rules), `findcreatures.mjs` (`findBits('feather', ...)`), `findhoards.mjs` (the lid), `data.mjs` (`LABELS`, `FIND_PLAY.hoard`, `FIND_PLAY.bits`, `YGG`, `CAMERA.footerXPhone`, `FIND_COPY.hammer`), and the tests in `tools/`.

## 5. Done means
All tests in `tools/` pass, both pack tools have run, and `REVIEW2-BUILD.md` says what you built and drew, what you left out and why, and each test's last line. Do not claim any visual or browser check: the review happens elsewhere in a real browser.
