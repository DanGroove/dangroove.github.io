# Round 7 part D3: the supernova's build-up and the critique's round 3 fixes

Read this whole file before you change anything. Then read the files in section 5.

Dan tested version 9 on his Android phone: the flash is gone. Parts D1 (`FLASH.md`) and D2 (`REVIEW2.md`) stay as they are; do not undo or rework them. In particular the supernova stays on `canvas#nova`, nothing of the supernova is drawn or written inside `svg#map`, and the map fades as one layer. Anything you add to the build-up below is drawn on canvases, never as per-frame writes inside `svg#map`.

This part has two halves: Dan's new note (section 1) and eight fixes the two reviewers agreed after looking at version 9 (section 2). Drawings and motion will be judged on real frames in a browser after you finish, so describe in your report what you drew and how each phase moves.

## 1. Dan's note: more build-up before the explosion

Dan's words: "i think the supernova animation needs some more buildup/tension before the explosion".

**Today.** After Next at the X beat, the rush (`STEPS.pace.rush`, 1.3 s) eases in so slowly that almost nothing changes for the first 0.5 s; then the X turns into a soft white blob by about 0.8 s and holds that look until the blast. It is a short, smooth ramp with no rhythm and no anticipation.

**The build-up.** Lengthen the rush to 3.0 s and give it four phases, as fractions of `st.rushT`. Everything that moves is something already on screen: the X itself, its glow, the stars that already gather into it, the camera and the light on the map. Add no new kind of object (no sparks, no fuse along the trail, no particles that fly in; Dan rejected an earlier idea of sparks gathering to ignite the star).

1. **Kindle (0 to 0.2, about 0.6 s).** Something visibly starts on the first frame: the X's red strokes begin to glow from their crossing outward (the crossing turns orange, the arms stay red), a low red glow starts to breathe around it, the camera starts a slow push toward the X, and the map begins to dim around it (see "veil" below). The stars start to stir toward the X.
2. **Heartbeat (0.2 to 0.76, about 1.7 s).** Four throbs, each sooner and stronger than the last, centred near rushT 0.26, 0.45, 0.60 and 0.72 (gaps of about 0.57, 0.45 and 0.36 s; never closer than 0.34 s). A throb is a quick rise (about 80 ms) and a slower fall (about 250 ms). On each throb:
   - the red glow swells and relaxes (radius up by about 15 % on the first throb and about 35 % on the fourth);
   - the X's spikes kick outward and only partly fall back, so their length climbs in steps (a ratchet), from 1 to about 2.2 times the rest length by the fourth throb;
   - the white-hot centre grows a step, so by the fourth throb the X is white at the crossing and red only at the tips;
   - the gathering stars lurch inward a step, and drift slowly between throbs;
   - the veil darkens a notch.
3. **Draw-in (0.76 to 0.93, about 0.5 s).** The anticipation before the blow: the X pulls in on itself. Its spikes retract to about 0.6 times the rest length and grow slightly thicker, the glow contracts to a tight, hot core, the last stars run the final stretch and vanish into it, the camera's push stops, and the X trembles (a seeded jitter growing from about 0.5 to 2 screen px; deterministic, a function of rushT).
4. **Held breath (0.93 to 1.0, about 0.2 s).** Near stillness: the tremble stops, the X holds as a small, intense white cross with a tight red halo, and the veil is at its darkest. Then the blast.

**The blast** stays as it is, except that it now starts from the held breath's small, compressed X (today it starts from `rushLen`), so the spikes shoot out from the compressed state. The camera's push is undone over the first 0.4 s of the blast with an out-cubic ease, a recoil, and is fully gone before the settle begins.

**Numbers to start from** (put them in one `NOVA.build` table in data.mjs; tune within these ranges if needed and give the final values in your report):
- `STEPS.pace.rush`: 3.0 s.
- Camera push: scale up 6 to 10 % by the end of the heartbeat, eased in and out, toward the X (the X stays where the rush already moves it, the centre of the screen).
- Veil: drawn on `canvas#nova` before the glow, so it dims the map under the supernova and never covers the glow or the stars: Ink, with a soft round hole centred on the X. Its darkness grows from 0 to about 0.65 by the held breath (0.45 on the phone); the hole's radius shrinks from about 0.6 to 0.18 of the shorter screen side, and breathes a little with each throb. At the blast the veil is blown away within the first 0.25 s. The traveller's light on `canvas#air` already fades out through the rush; keep that.
- Throbs: the glow's alpha changes by at most 0.2 per throb, and no glow, veil or core alpha moves by more than 0.08 between two 16 ms frames anywhere in the rush. Big soft swells, never flashes: Dan's phone had a flash problem, and rapid bright changes are also a photosensitivity risk.

**Rules for the build-up:**
- Every value in the build-up is a pure function of `st.rushT` (and the X beat's own state), with no clock of its own, so Back during the rush reverses it frame for frame, a timeline scrub shows the same frame for the same position, and `hurry` still works.
- Reduced motion: unchanged (no build-up, as today).
- Phone: the same phases; the veil's darkness and the camera push may be lighter (numbers in `NOVA.build`).
- The joined page: the same.
- The X beat at rest, the X's look in the journey and the settled supernova on the end screen do not change.

## 2. The round 3 fixes

### 2.1 A pinch in explore presses a find (D3-1)
In explore on a phone, a pinch whose first finger lands on the horn, a chest (`hoard-*`) or the beacon still presses that find: the horn raises and sounds, the chest digs, the beacon aims. These finds act on their own `pointerdown`, and explore never stops them (FLASH-BUILD.md says the cancel hooks were left out).
- While exploring, for touch pointers only: a find's pointerdown action waits until either the finger lifts within `EXPLORE.slop` (a tap: act then) or it stays down and still for 120 ms (a hold: act then). If a second finger arrives in that window, drop the press and let explore's pinch take both fingers. If the finger moves past the slop in the window: for press finds (horn, chests) drop the press and let explore pan; for finds that own a one-finger drag (the beacon's aim, the mist, the wayfinder) start their drag at once, as today.
- Outside explore, and for the mouse, the keyboard and reduced motion, nothing changes.
- Put the waiting in one shared helper in findkit.mjs that each find's pointerdown goes through, rather than a copy in each find.
- Check (explore-test): drive the real finds (`findsBuild` on the test page), not a stand-in. A pinch starting on the horn, `hoard-hmc1` and the beacon, with the second finger 0, 30 and 100 ms after the first, leaves `found()` and each find's stage unchanged and scales the camera by 20 % or more. A tap on each still acts; a chest hold still repeats; a one-finger drag on the beacon still aims.

### 2.2 A card's X pressed while the journey moves (D3-2)
The X of a card whose stop the journey is leaving is ignored while `JOURNEY.moving` (part D2), but it still takes focus, so after the move focus is left on `<body>`. Make that X `inert` (no focus, no press) while the journey moves.
- Check (steps-test): at HMC press Next, then the HMC card's X at 200 ms; after arrival focus is neither on `<body>` nor inside the departed card. The test fails without the fix.

### 2.3 Same-value writes (H3-2)
The finds write about 100 attributes per frame inside `svg#map` that already hold that value. In findkit.mjs, `attr(el, k, v)` skips the write when `el.getAttribute(k)` already equals `String(v)` (compare with the live attribute, not a cache, so nothing can go stale).
- Check (finds-test): count writes through a MutationObserver over 2 s of the blast and 2 s at a stop: no write sets an attribute to the value it already had; every finds-test result is unchanged.

### 2.4 The hammer game: foe heights and the shield wall (V3-2)
The foes are all drawn the same height in a uniform grid, so the rows read alike.
- Draw the foe kinds at clearly different heights inside the one hit box (`HAMMER.foe`; no part of a drawing outside it): giants and the giant chief use the box's full height, draugr are hunched and about two thirds of it, wolves low and long (about half the height, the full width). Wave 1 must show at least two clearly different drawn heights.
- The wall stays three segments over the same cells (a reviewer asked for decorative shields in the gaps; that is turned down, because what looks like cover must block a shot). Make each segment a continuous run of overlapping round shields across the full width of its own cells, rims overlapping like a real shield wall, so the three read as one wall with two openings. Draw nothing between the segments.
- No change to hit boxes, cell positions, the formation (no row offset), timings or any balance number. hammer-test's balance output must be identical; hammer.mjs's hit code must not change.

### 2.5 Yggdrasil's crown (V3-1)
The crown's three masses are smooth closed ovals that read as balloons, and at find zooms the limb lines run straight through them, like a wireframe.
- Fill each mass with the colour of the ground under the tree (so the fill itself is invisible), then its outline, so the limbs disappear behind the foliage and show only in the gaps between masses and below them.
- Make five masses at three heights, the crown wider than tall, with gaps between at least three pairs of masses where limbs show; two limbs may reach past the outer masses.
- Edges: irregular leaf clumps (uneven bumps of different sizes, the outline broken where a limb enters a mass), not even scallops; no horizontal hatching (that read as a cloud in round 2). Hatch inside the masses along the direction of the limb beneath, lightly.
- It stays the largest drawing on its island. Keep the trunk, roots, well, the eagle, the squirrel, Nidhogg at the roots, the labels and the tree's place.
- Check (check.mjs): five masses; the crown's box wider than tall; no limb segment is drawn after (above) a mass that covers it.

### 2.6 Two labels at the overview (V3-3)
"HMC Connections" sits across the island's coast line, and "HMC, again" touches its stop ring. Move "HMC Connections" off the coast band (up to 6 map units, 2 units or more of clear space) and keep "HMC, again" 2 units or more from its ring. Never move a stop, the trail, the X or a find.
- Check (check.mjs): at both overview sizes (1440 x 900 and 390 x 844), every visible tier-1 label's analytic box is 2 map units or more from the coast line and from every stop ring.

### 2.7 The X's hand-over to the canvas (V3-4)
At the first frame of the rush the X turns from the map's roughened, slightly soft stroke to a crisp, marginally thinner canvas stroke in one frame. With the longer build-up the X stays visible as strokes for longer, so this shows more. Make the canvas X's first frame match the SVG X: the same stroke widths and the same roughened edge (draw it from the rough sprite at the SVG stroke's width, or from a bitmap of the SVG X rasterised when the X beat settles), then let the build-up change it.
- Check: describe in the report how the first canvas frame matches; the review will compare the X at 0 and 16 ms at device pixel ratios 1 and 3.

### 2.8 The explore row over the footer on small phones (V3-5)
At 360 x 640, for the first 300 ms of explore the "Back to the end" and "Back to the top" row appears over the footer links that are still fading. Fade the explore row in once the footer is gone (from about 400 ms into explore, over about 200 ms).
- Check (explore-test or layout-test): at 360 x 640, in the first 600 ms of explore no frame has the explore row's boxes over a footer link whose opacity is above 0.2.

## 3. Tests
Every existing test must still pass, plus the checks named above, plus these for the build-up (in nova-test):
- `STEPS.pace.rush` is 3.0 s (or your tuned value from 2.6 to 3.4 s).
- Drawing the build-up at the same rushT twice gives the same values, and stepping rushT backward reproduces the forward values.
- In the heartbeat there are exactly four throbs (four local maxima of the glow radius), never closer than 0.34 s, each larger than the one before.
- The spikes are shorter at the end of the draw-in than at the fourth throb, and the blast's first frames grow from the held breath's length.
- Every gathering star has reached the X by rushT 0.93.
- No glow, veil or core alpha moves by more than 0.08 between two 16 ms frames in the rush.
- No supernova or veil element is created or written inside `svg#map` during the rush and blast.
Where an existing assertion reads something you changed on purpose (the rush's length, the blast's starting length), change it to the new behaviour and say so in the report.

## 4. Files
You may write only these, all under `design/journey-map/`: `footer.mjs`, `stars.mjs`, `trip.mjs`, `data.mjs`, `depth.mjs` (only if the traveller's light needs it), `findkit.mjs`, `finds.mjs`, `findhoards.mjs`, `findhorn.mjs`, `findwater.mjs`, `findsheets.mjs` (only for 2.1), `explore.mjs`, `cards.mjs`, `steps.mjs` (only if 2.2 needs it), `findhammer.mjs`, `art.mjs`, `map.css`, `tools/check.mjs`, `tools/nova-test.mjs`, `tools/explore-test.mjs`, `tools/steps-test.mjs`, `tools/finds-test.mjs`, `tools/hammer-test.mjs`, `tools/layout-test.mjs`, `tools/depth-test.mjs` (only if an existing assertion must follow), the files the two pack tools write (`joined.html`, `dist/journey-map.html`, `dist/journey-joined.html`), and your report `REVIEW3-BUILD.md` (new). If a test holds a digest of a file you changed (tools/finds-test.mjs locks trip.mjs's digest), re-record it and list it in the report. `hammer.mjs` must not change.

## 5. Read first
`FLASH.md`, `FLASH-BUILD.md`, `REVIEW2.md` and `REVIEW2-BUILD.md`; `footer.mjs` (the rush, blast and settle drawing, the rough sprite, the X hand-over), `stars.mjs` (`gatherT`, `novaGatherPoint`), `trip.mjs` (the footer acts' camera), `depth.mjs` (the light on `canvas#air`), `data.mjs` (`STEPS`, `NOVA`, `HAMMER`, `YGG`, `LABELS`, `EXPLORE`), `findkit.mjs`, `finds.mjs`, the finds that act on `pointerdown` (`findhoards.mjs`, `findhorn.mjs`, `findwater.mjs`, `findsheets.mjs`), `explore.mjs`, `cards.mjs`, `findhammer.mjs`, `art.mjs` (`yggdrasil`, the label rows) and the tests in `tools/`.

## 6. Done means
All tests in `tools/` pass, both pack tools have run, and `REVIEW3-BUILD.md` says what you built and drew (each build-up phase, the final `NOVA.build` numbers, the foes' drawn heights, the crown), what you left out and why, and each test's last line. Do not claim any visual or browser check: the review happens elsewhere in a real browser.
