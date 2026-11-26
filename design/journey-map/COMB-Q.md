# Polish round 3, part 13b: the old ash and the carved serpent's revision loop (COMB-Q)

On the commit with part 13 (`COMB-P.md`, built by the previous run; its report is `COMB-P-BUILD.md`). Keep everything part 13 did, including P5's quiet map while gliding: the new tree's and serpent's idle life ticks through `findsFrame` like every other find's, so it pauses while the camera glides. Dan's notes of 2026-11-26 (ET), in his words:

- 1:25 PM, on a screenshot of Yggdrasil with the creature at its roots circled: "remove this little thing and please make the tree way more impressive than this. this is Yggdrasil for gods sake lol what are those roots??". At 2:18 PM he picked "A, The old ash" from a sketch sheet.
- 1:26 PM and 1:27 PM, on the serpent: "still not impressed by this drawing" and "it still doesnt really mean anything to the viewer when they click on jormungandr eats a deadline lol." At 2:20 PM he picked "A, The carved serpent" to carry the revision loop he chose on 2026-11-25.

Priority if time runs short: Q1, then Q2. Finish within about 100 minutes.

## Items

**Q1. Yggdrasil becomes the old ash, and the creature at its roots goes (`art.mjs` the `ygg` group, `YGG_CROWN`, `YGG_ROOTS`, `YGG_TRUNK` and `yggClear`; `data.mjs` `YGG` and `FIND_PLAY.well`'s `trunk` and `stars`; `findwater.mjs` the tree's life only; `map.css` only if the tree needs a rule).** The approved drawing is `tools/ygg-old-ash/yggdrasil-A-old-ash.svg`.
- **What it looks like:** `reference-old-ash.png` (the well close-up and the whole map) and `reference-old-ash-phone.png` (412 wide), both in that folder. `optA.mjs` and `lib.mjs` are its generator, for reference.
- **Coordinates:** the tree's foot at the origin (map 304,374), in map units, with the page's classes (`.l`, `.g`, `.t`, `.o`) and three inline `style="stroke-width:2.3"` outlines. Its groups are `g.yg-roots`, `g.yg-trunk` and `g.yg-crown`.
- **The drawing:** inside `g.ygg` (same transform), replace today's roots, rootlets, trunk, canopy, boughs and hatching with this markup, as is.
- **Eagle and squirrel:** keep both actors (`.yg-eagle`, `.yg-rat`) and their animations, moved by the offsets in the file's `<!--META-->` comment: the eagle by (-3, 1) from today's `eagleAt`, the squirrel by (0, -6) from today's `ratAt`. The squirrel's climb follows the new trunk: `YGG.fork` and the climb line `FIND_PLAY.well.trunk` move to the new trunk's centre line, which runs at about x 297 (`YGG_TRUNK` with them).
- **The creature at the roots:** remove it completely. That is `YGG.nid`, `YGG.nidAt`, the `yg-nid` actor in `art.mjs`, `.yg-nid-head` and its animation in `findwater.mjs`, and any `YGG.life` keys only it used.
- **Geometry the map reads from the tree**, so nothing collides with the new shape:
  - `YGG.crown`, the polygon behind `YGG_CROWN` and `yggClear`, traced around `g.yg-crown`'s outline to within 2 units;
  - `YGG.roots` (`YGG_ROOTS`) as centre-line polylines with widths along the big roots in `g.yg-roots`;
  - `FIND_PLAY.well.stars`, so every star of the well's answer lands inside the new crown's foliage (same rows, same count).
  - The groves of small trees then keep their distance from the new tree. List any grove tree that moved or went.
- **The YGGDRASIL label** (`YGG.label`, `labelBox`): keep it if it is 2 units clear of every tree line at the well close-up. Otherwise move it the least distance that clears it, and say where.
- **Check at three views:** the well close-up (`?beat=map`, press `#f-well`), the map overview, and 412x915. In each, the tree must stay 4 units clear of the trail line (the loop above the crown), the Urd's Well labels, marker 2's bubble and every other find.

**Q2. The carved serpent and the revision loop (`findcreatures.mjs` the serpent only, `art.mjs` `jormungandr` and the serpent's body and lumps, `data.mjs` `MAP.jorm` drawing keys, `FIND_PLAY.serpent`, `FIND_ART.serpent` and the serpent's `FIND_COPY` and caption, the `HERE BE DEADLINES` label only, `map.css` serpent rules).**

*The drawing*
- The approved drawing is `tools/jorm-carved/jormungandr-A.svg`. It is in map coordinates: `.jo-body` belongs in `#b-sea`, `.jo-head` (with `.jo-jaw`, the moving jaw) in `#finds`, and every `g.jd` is close-up-only detail.
- What it must look like: `reference-carved.png` (the close-up and the whole map), `reference-revision-loop.png` (the four states below) and `reference-phone.png` (412x915). All are in `tools/jorm-carved/`.
- `draw.cjs` is the generator, and `strip.cjs`'s `STATES` holds the exact parameters of the four states. `draw.cjs` builds the body as a ribbon along `MAP.jorm.ring` (the `lead` and the `tail` ends per option), with the lump's swelling and the open tail. Port option A's parts from it.
- `shoot.cjs` and `strip.cjs` are cloud sketch scripts that will not run on the PC. Read them for the injection and the states only.
- Replace today's head, jaw, eye, crest, tail stub, the calendar pad and its leaves (`FIND_ART.serpent`) with A's head. Keep the hooks the behaviour needs, giving the new parts the old roles: the head turns, the jaw opens about its hinge, and the eye shuts when he dozes.
- Replace the body `art.mjs` draws today (`jormungandr()`, the double line, chevrons and humps) with A's banded ribbon along the same ring, surfacing where it surfaces now. Keep `jormPoint` on that ring, so anything that rides the body still follows it.
- `g.jd` detail shows only at the serpent's close-up zoom and above. Fade it with the camera scale between the map beat's scale and the close-up's.
- `HERE BE DEADLINES` moves up 14 map units, to clear the file and its name.

*The behaviour (Dan's pick of 2026-11-25: "please think it very thoroughly as this needs to be understandable instantly")*
1. **The first press** on the serpent, while the camera is not on him, only brings the camera in, as his marker does. Caption: "Jörmungandr, the revision loop. Poke him." (replaces "Jörmungandr, the world serpent. Poke it." and the find's label).
2. **At rest:** a file icon bobs gently by his mouth, at about map (434, 90). It is a page with a folded corner, about 13 px tall on a phone, with its name in a tag above it: `final.pdf`.
3. **Pokes 1 and 2:**
   - He bites the file and swallows.
   - A lump with the file's outline travels once round his whole body along the ring. It goes slowly where it is on screen near the head and the tail, and fast where it is out of view; the whole lap takes about 2.4 s.
   - At the tail end, which is in his mouth, he spits the file back out with a longer name. The new part types in letter by letter, bold and underlined: `final_v2.pdf`, then `final_v2_FINAL.pdf`.
   - Pokes during a lap wait for it to finish.
4. **Poke 3:**
   - No bite. He lets go of his tail: the tail tip retracts with a taper, a small ripple, and a clear gap opens in the loop.
   - The file floats up, and SHIPPED stamps onto it in ink (`C.ink` on `C.paper`, never red).
   - The find's card shows "Shipped" and a line that is Dan's to write. Use the existing slot style (`findSlot` with `todo: 1`, text "A shipped story goes here.").
   - He dozes with the loop open. Caption: "Shipped. Poke him to start the next one."
5. **The next poke** closes the loop (the tail slides back into his mouth) and a new file floats in by his mouth. The rounds cycle through `final.pdf`, `final.mp4`, `final.aep` and `final.fig`, and each round runs 3 to 4 again.
6. **The horn** still makes him hear and surface as it does now (`o.hear` and the swell humps keep working with the new body).
7. **Reduced motion:** the names swap in place, the lump does not travel, the loop opens and closes without travel, and the stamp just appears.
8. **Clearance:** every part, including the floating file and its name, stays 4 px clear of every label and marker at 1920x950, 1440x900 and 412x915.

## Checks

New tests go in `tools/`:
- Use real CDP input only.
- Read state through computed styles, classes, attributes, `LayerTree`, `Animation` and the page's existing test hooks.
- Check behaviour, state, counts and pixels, never time.
- "The base build" means the packed pages from before your changes, saved in the run folder at the start.

1. `comb-q-ygg-test.mjs`: the new tree's markup matches `yggdrasil-A-old-ash.svg`, with no `yg-nid` anywhere. The eagle and squirrel animate on their new spots. At the well close-up, the overview and 412x915, there are no overlaps with the trail, labels or finds (box tests with the gaps above). The well's stars all land inside the crown.
2. `comb-q-serpent-test.mjs`: at 1920x950 mouse and 412x915 touch, by real presses:
   - the first press only focuses;
   - pokes 1 and 2 give `final_v2.pdf` and then `final_v2_FINAL.pdf`, and the lump is seen near the head and near the tail during each lap;
   - poke 3 opens the loop and stamps SHIPPED, with the card's slot showing;
   - poke 4 closes the loop with `final.mp4`;
   - reduced motion gives the same names and states without travel;
   - nothing red;
   - the 4 px clearances hold.
3. Rerun `node tools/check.mjs`, `finds-test`, `steps-test`, `explore-test`, `depth-test`, `comb-p-quiet-test`, `comb-p-style-test`, `comb-b-art-test`, `comb-d-drawings-test`, `comb-l2-all-finds-test`, `comb-m-layers-test`, `comb-n-hold-test` and every test that names the serpent, `jg-`, `yg-`, `YGG` or the well. Change an existing assertion only where it encodes what this brief changes on purpose (the old tree, the creature, the old serpent and its leaves), and list each such change.

## Rules

- **You may write only the following, all under `design/journey-map/`:**
  - the files and parts named in each item above;
  - the tests in `tools/` as the checks say;
  - `tools/check.mjs` (`RUNTIME_KB` only, raised by what this part needs, with a dated note);
  - `dist/journey-map.html` and `dist/journey-joined.html`, only through `node tools/pack.mjs` and `node tools/pack-joined.mjs`;
  - your report `COMB-Q-BUILD.md`.
- Browser profiles, captures and full logs go only in the run folder `journey-map-runs\comb-q` (env `COMB_RUN=comb-q`). Delete browser profiles when a test ends.
- **Never touch:**
  - `steps.mjs`, `explore.mjs`, `stars.mjs`, `footer.mjs`, `trip.mjs`, `depth.mjs`, `cards.mjs` or `finds.mjs`;
  - the other find modules and finds;
  - `hero-copy/`, `tools/sky-wolves/`, `tools/ygg-old-ash/` or `tools/jorm-carved/` (read only);
  - the briefs, the other build reports or the audits;
  - anything outside `design/journey-map/`.
- Never run git, never install anything, and never use the network (a local headless Edge or Chrome on 127.0.0.1 is not the network). Never start reviewer agents or other agents.
- No timing measurements: tests check behaviour, state, counts and pixels, never time.
- rtk is not installed on this PC: run local commands (node, PowerShell) directly, without the rtk prefix, as in earlier runs; this is not getting round a rule.
- If a rule stops you from doing something this brief asks, leave it out and say so in your report. Do not work around a rule.
- Use plain ASCII punctuation in `COMB-Q-BUILD.md`, and write Jormungandr and Yggdrasil there.

## Report

Write `COMB-Q-BUILD.md`, kept short. It should cover:
- what you changed for each item and why;
- Q1's grove changes and the label;
- Q2's states, with a still of each at 1920x950 saved in the run folder;
- each test you changed or added, and why;
- one table with the last exit of every test you ran;
- anything you left out, and why.
