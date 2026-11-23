# Journey map, round 7 part C1: Yggdrasil, Jörmungandr, shield stop marks, the Toronto skyline, and the review's layout fixes

Read this whole file before writing anything. Then read `reference/round7/drawings.cjs` and look at its pictures in the same folder (`ygg-5px.png`, `ygg-ov.png`, `jorm-full.png`, `jorm-head.png`, `jorm-narrows.png`, `shields.png`, `toronto-close.png`, `toronto-ctx.png`; `drawings-preview.svg` shows the drawings alone, placed where they go). Read `art.mjs`, `data.mjs`, `cards.mjs`, `map.css`, `findcreatures.mjs` (`findSerpent`), `findwater.mjs` (`findWell`), `finds.mjs`, `findkit.mjs`, `trip.mjs`, `steps.mjs`, `explore.mjs`, `footer.mjs`, `depth.mjs` and every file in `tools/` as well.

Parts A (`EXPLORE.md`) and B (`HAMMER.md`) of this round are built before you. Do not undo any of their work. Part C2 (the ravens, the chests' animation and the rest of the review's fixes) comes after you; leave the ravens and the chests' behaviour alone.

## 1. Why

Dan's notes on preview version 6, in his words:

- "that tree in the middle should be ygdrasil instead and shuld look much more impressive"
- "that serpent in the top right should be jormangandr"
- "the toronto depiction needs to look much nicer and have more accurate skyline buildings and height"
- "they norse nodes look like gravestones, can we do something else?" Dan was told the stop marks become round Norse shields, painted in each place's colour once visited.
- "can you run a critique loop as well?" Two critics reviewed version 6 and agreed the layout, label, card and camera fixes in sections 7 to 10.

Everything stays in Norse mythology itself, drawn in this map's own line style. Nothing from God of War or any other game, film or show.

## 2. Hard rules

The sandbox on this machine is off, so these matter.

- Change files only inside `design/journey-map/`, and only these:
  - `data.mjs`, `art.mjs`, `cards.mjs`, `map.css`, `findcreatures.mjs` (only `findSerpent` and what it alone uses), `findwater.mjs`, `finds.mjs`, `findkit.mjs`, `trip.mjs`, `steps.mjs`, `explore.mjs`, `footer.mjs`, `depth.mjs`
  - `tools/check.mjs`, `tools/finds-test.mjs`, `tools/depth-test.mjs`, `tools/steps-test.mjs`, `tools/explore-test.mjs`
  - new: `WORLD-BUILD.md`
  - written by the pack tools: `joined.html`, `dist/journey-map.html`, `dist/journey-joined.html`
- Never change anything in `hero-copy/`, `reference/` or `assets/`, any other `.md` file, `index.html`, or any module not listed (`main.mjs`, `stars.mjs`, `timeline.mjs`, `join.mjs`, `join.css`, `pace.mjs`, `footname.mjs`, `findhoards.mjs`, `findsheets.mjs`, `findhorn.mjs`, `findall.mjs`, `hammer.mjs`, `findhammer.mjs` stay as they are; the ravens in `findcreatures.mjs` are part C2's and stay as they are). Change `tools/pack.mjs` or `tools/pack-joined.mjs` only if packing fails without it, and say why.
- Never touch any other path on the machine. Never run git. Never install anything. No network access, at build time or at run time.
- Do not start reviewer agents or sub-agents, even if your global instructions say to. The review happens elsewhere, in a real browser. Do not leave a server running. Do not claim a visual check you did not make.
- You may run `node` on files inside `design/journey-map/`.
- Module style, as now (`tools/check.mjs` enforces it): named exports and named imports only, each import on one line from a sibling file, no default exports, no dynamic imports, no top-level await, every top-level name unique across all modules, no colour literal outside `data.mjs`, none in `map.css`. Every line of copy, every number you tune, every timing and every drawing path lives in `data.mjs` (drawings may be built in `art.mjs` from data, as now).
- `reference/round7/drawings.cjs` is a reference. Port its shapes and numbers into `art.mjs` and `data.mjs`; never import it. Its colour literals become `C` tokens.
- Do not change the `STARS`, `DEPTH` or `NOVA` tables (the review tunes those). New numbers go in other tables.
- No per-frame layout reads in anything the frame loop calls. The frame writes transforms and opacities; anything else happens on a state change, on resize or when fonts are ready.
- "An animation always moves the object that is already there" (Dan). Nothing pops in or out that could move in.
- If a rule stops you from doing something the plain way, leave that thing out and say so in your report. Do not work around a rule.
- Plain ASCII punctuation in `WORLD-BUILD.md`. In copy shown to visitors, Norse names keep their letters (Jörmungandr).

## 3. Yggdrasil

### 3.1 The drawing

- `MAP.ygg` becomes `[304, 374]` (the trunk's foot).
- Replace `yggdrasil(x, y)` in `art.mjs` with the reference's `yggdrasil(fx, fy)`: five roots (`tube`), rootlets in the well, the trunk forking into three boughs, the crown (`CROWN` with outward scallops from seed 7), the four overlap chains (`LAYERS`, seeds 20 to 23), 46 leaf marks (seed 33), the eagle on the crown with raised wings, Ratatoskr on the trunk and Nidhogg gnawing the left root. Port `scallop` and `tube` next to `spline`. All points, paths, seeds and counts go to `data.mjs` (a `YGG` table).
- Draw order as in the reference: roots, rootlets, trunk, crown, overlaps, leaf marks, eagle, Ratatoskr, Nidhogg. The tree stays in the `detail` layer after the grove trees, where the old one was.
- Give the moving parts their own groups so the frame can move them by transform: `.yg-eagle` (with `.yg-wings` inside), `.yg-rat`, `.yg-nid` (with `.yg-nid-head` inside). Each group's resting transform is the reference's placement.
- Grove trees: replace the `KEEP` circle `[300, 340, 44]` with a test that keeps every grove tree out of the crown outline grown by 6 units and at least 6 units from the trunk and every root. Keep `[300, 392, 46]` for the well.

### 3.2 Its label and the well

- `COPY.ygg` moves to `(318, 361)`, start-anchored, same size and spacing. Its box keeps at least 2 units from the crown, trunk, roots, Ratatoskr and the hoard's scratch mark beside it. It is a tier 2 label (section 7).
- `FIND_PLAY.well.root` becomes `[303, 389]` (the tip of the well root), `trunk` becomes `[[304, 373], [304, 323]]`.
- The three star batches (`FIND_PLAY.well.stars`, offsets from `MAP.ygg`) are spread across the new crown: every star inside the crown outline shrunk by 5 units, at least 7 units from the others in its batch and 4 from every other star, none within 6 units of the eagle.
- The well's view (`FINDS` row `well`) becomes `[306, 350, 72]`, so the whole tree and the well show when it has the camera.
- The chest near HMC, again (`hoard-hmc2`) moves from `(366, 354)` to `(372, 368)`, and its `KEEP` circle with it, so a risen chest and its opened lid stay clear of the bigger crown.

### 3.3 Its life (in `findWell`'s tick; nothing under reduced motion)

- Ratatoskr runs: every 9 to 15 s (seeded), he climbs from his place to the fork (`(304, 336)`) in 0.9 s, pauses 1.2 s with two tail flicks (rotate 15 degrees about his tail's root and back), and slides back down in 0.9 s.
- The eagle stretches: every 6 to 10 s its wings lift (scale y 0.78 to 0.95 and back over 0.7 s).
- Nidhogg gnaws: his head moves 0.5 units toward the root tip and back (0.3 s each way) every 2.5 s.
- When the horn sounds (`hear`): the eagle rises 6 units, flies one circle (radius 16, centred 14 units above its perch) in 2.6 s with its wings flapping (scale y between 0.6 and 1, four times a second), and lands where it was. The well find counts as playing while the eagle flies.

## 4. Jörmungandr

The serpent becomes Jörmungandr, the world serpent: one body circling the main island with its tail in its mouth, its head where the serpent was. The find's id stays `serpent` (tests and the count depend on it). Remove the old serpent's drawing, its three surfacing spots and its swimming.

### 4.1 The ring (static, in the sea)

- Port `jormungandr()` from the reference: `RING` (the centreline, clockwise from the back of the head to the tail tip), `SURF` (the five surfaced stretches as shares of the length), `W` 6.4 (the tail tapers over the last tenth to 30 percent), the faint submerged body (Ink at 0.55 with dashed Paper edges at 0.22) and the surfaced bands (an Ink band with Paper edges, chevron scales, water breaking at both ends). Numbers to `data.mjs` (`MAP.jorm`).
- Draw it in the `sea` part of `bigMap()`, after the waves and shore dots and inside the `#neat` clip, so the land, the coasts, every drawing and every find sit above it.
- The static ring stops 9 units before the tail tip. The last 9 units are the find's `.jg-tail` (4.2), so the tail can leave the mouth.
- The trail's "2023 crossing" passes over the body between the islands; the longship sails over it. Both stay as they are.

### 4.2 The head and the pad (the find's drawing)

- `FINDS` row `serpent`: `x: 500, y: 101` (the joint where the head meets the ring), `view: [478, 96, 50]`, `mark` stays `[550, 74]`, label "Jörmungandr, the world serpent. Poke it three times to feed it a deadline." `FIND_COPY.hints.serpent`: "Jörmungandr, the world serpent. Poke it." `serpentLeaves`, `serpentFed` and `serpentLines` stay as they are.
- `FIND_PLAY.drawings.serpent` is rebuilt in local units with the origin at the joint and scale 1 (`FIND_PLAY.serpent.scale: 1`), from the reference's `HEAD`:
  - `.jg-tail`: the tail tip (the ring's last 9 units, tapering to 1.9 units), lying in the mouth at local `(-32, 1.5)`, drawn under the head.
  - `.jg-head`, turning about the joint, holding `.jg-skull` (the upper head with the eye, the curled lappet, the cheek spiral and the upper fangs) and `.jg-jaw` (the lower jaw, from the mouth's corner `(-24, -0.6)` forward round the chin and back along the throat to about `(-9, 7)`, hinged at about `(-14, 1.6)`). Each part's fill reaches 4 units behind the head's back, so no seam shows when the head turns. The outlines stay open at the neck, as in the reference.
  - `.jg-eye` (the almond and pupil) and `.jg-shut` (a closed lid line, hidden while awake).
  - `.jg-tongue`: a forked tongue from the snout tip `(-37, -1)`, shown only while awake and the pointer is within `near` of the head, flicking as the old one did.
  - `.jg-pad`: a tear-off calendar pad floating at local `(-41, -20)` (map `(459, 81)`): a backing board 12 x 14 in Land with a Paper line; three leaves on it, each 11 x 13, Ink with a Paper line, a 1.6-unit binding strip with two ring dots along its top, the day (`serpentLeaves[i][0]`, 3 units, weight 700) and the time (`serpentLeaves[i][1]`, 3.6 units) centred. Each lower leaf sits 0.6 units right and 0.6 down from the one above, so its edges show. A short wave mark under the pad.
  - `.hit`: one rectangle covering the head, the jaw and the pad (about local `(-50, -30)` to `(6, 12)`).

### 4.3 Its play (`findSerpent`, rewritten)

- **Awake and ready** (a round's start): the eye is open, the jaws are closed on the tail. The head follows the pointer within 10 degrees about the joint (`attend`, as now). The pad bobs: rotate 2.5 degrees and move 0.5 units up and down over 3.4 s.
- **A poke** (press, Enter or Space) counts the find as found on the first poke, then runs, in order:
  1. Release, 0.14 s: the jaw opens 20 degrees; the tail tip slides 3 units back along the ring and droops 1 unit.
  2. Lunge, 0.2 s, easing out with a 3 degree overshoot: the head turns about the joint until the snout reaches the top leaf's near edge (about 24 degrees up from rest).
  3. Bite, 0.08 s: the jaw closes on the leaf; two Paper `drop` bits fly from the tear. From here the leaf moves with the head: its transform is the head's turn about the joint, then its place in the mouth.
  4. Back, 0.35 s, easing in and out: the head turns back to rest with the leaf in its jaws; the leaf flutters 6 degrees either way three times a second.
  5. Swallow, 0.3 s: the head tosses 10 degrees up and back while the leaf shrinks into the mouth's corner.
  6. The swell starts as the leaf goes: a bulge travels along the whole body from the joint to the tail, as a gulp moves down a snake. Draw it as one short wide piece (14 units long, `W + 3` wide, Ink with Paper edges) placed by transform at samples of the ring's centreline and turned to its tangent. It takes `swell[n - 1]` seconds (2.4, 2.1, 1.8), easing in at the neck and out at the tail. Over submerged stretches it shows at 0.45 opacity and over surfaced ones at 1, ramping over 3 units at the stretch ends. When it reaches the tail, the tail tip twitches (1.5 units, 0.3 s).
  7. Hungry, between pokes: the jaw rests open 6 degrees, the tail tip waits 3 units out of the mouth, and the pad shows the leaf that was under the eaten one.
  - Presses during steps 1 to 5 are ignored, except one, which waits and starts when step 5 ends. Fast pokes never skip a leaf or tear two at once.
- **After the third leaf:** as its swell starts, the pad's empty backing board sinks (4 units down and fading over 0.6 s) with one `ring` bit. When the third swell reaches the tail, the jaw opens (0.1 s), the tail tip slides back into the mouth (0.25 s) and the jaw closes (0.08 s). The ring is whole. The popup opens above and left of the head, clear of where the pad was: kicker `FIND_COPY.serpentFed`, then the slot `serpentLines[round % 3]`, as now. Then it sleeps: the eye shuts, the head rests 3 degrees down and breathes (1 degree either way over 4.8 s).
- **Poked asleep:** it wakes (the eye opens, 0.2 s) and a fresh pad bobs up from under the water at the same place (rising 4 units and fading in over 0.6 s, with one `ring` bit), showing the first leaf again. A new round starts (`round + 1`).
- **When the horn sounds** (`hear`): the head lifts 8 degrees and settles, and a slow, half-height swell (`W + 1.5` wide) runs once round the ring in 4 s.
- **Reduced motion:** no swell, bob, tongue or breathing. A poke takes one leaf at once (it disappears and the next shows). After the third, the tail is in the mouth, the popup shows and the eye is shut.
- `o.place()` returns the joint. In `finds.mjs`, the serpent's on-screen radius no longer reads `serpent.spots`; use its view radius plus `near`. The find counts as playing while a swell or a step runs.

## 5. The stop marks become round shields

- `shieldSvg()` in `art.mjs` replaces `stoneSvg(rune)`, from the reference's `shield()` kind B (the geometry in `data.mjs`, a `MARK` table). Viewbox `0 0 400 400`:
  - the ground shadow (an ellipse at `(200, 392)`, 120 x 10, Black at 0.35);
  - the face (`.st-ink`, a circle of radius 176, Ink) with six Paper plank lines at 0.28 (vertical, at x = 200 plus and minus 24, 72 and 120, clipped to the face);
  - `.st-fill`, a group shown when the stop is visited (or lit by the wayfinder, as now): the two painted quarters (top right and bottom left, `fill: var(--mk)`) and over them the plank lines in Ink at 0.35, drawn only inside those quarters;
  - the rim (`.st-line`, the radius 176 circle stroked Paper at 20), the boss (a circle of radius 54, Ink, stroked Paper at 16), its highlight (radius 12 at `(186, 186)`, Paper at 0.55) and eight studs on the rim (radius 9, Ink, stroked Paper at 5, every 45 degrees);
  - `.st-glow` behind it all, as now.
- No rune on the shield. The stops keep their `rune` data.
- `cards.mjs`: the shield's diameter on screen is `markPx = clamp(MARK.min, MARK.max, MARK.k * cam.s)` with `k: 10, min: 14, max: 36`. The shield stands on the trail point: its centre at `p[1] - markPx * 0.5 - 3`. `.st-btn` becomes `aspect-ratio: 1 / 1` with `border-radius: 50%`, and the article still scales out of it into the card.
- The legend's stop glyph (in `bigMap()`) becomes a small shield at `(68, 836)` of radius 4.6: Ink face, Paper rim (0.9 wide), a Paper boss dot of radius 1.2, and two opposite quarters filled with Note at 0.45, so it reads as the painted shield in grey.

## 6. Toronto

- Replace `city()` and its `grp(404, 752, .62, city())` with the reference's `toronto()`, its base line at `(368, 752)`, west on the left, every height `metres x 0.105` units. The facts go in `data.mjs` (`MAP.toronto`): CN Tower 553.3 m (main pod 346, SkyPod 447, mast from 457), Rogers Centre 86, First Canadian Place 298, Scotia Plaza 275, CIBC Square 241, Commerce Court West 239, TD Bank Tower 223, Bay Adelaide Centre West 218, Brookfield Place (Bay Wellington) 207, Royal Bank Plaza 180, and the reference's widths, positions, back row and three lower towers to the east.
- Keep `<path class="l" d="M404 662v-11"/>` (the landing post) as it is. Remove the `#win` pattern from `mapDefs()` if nothing else uses it.
- The `KEEP` circle `[408, 738, 42]` becomes the skyline's box `[362, 688, 494, 758]` for keeping grove trees out.

## 7. Map labels in two tiers

At the overview the map is about 0.72 to 0.86 screen px per unit on a desktop, which leaves its labels at 3 to 5 px. Two tiers fix that.

- **Tier 1, floored:** the six stop names, "X marks the work", and (smaller floor) the six stop sub-lines, the X's sub-line, the kicker under the title and the legend's four words.
  - Size on screen: `unit x s x k`, with `s` the camera's scale and `k = min(cap, max(1, floor / (unit x s)))`.
  - Floors and caps, in `data.mjs` (`LABELS`): names and the X label, floor 10 px, cap 1.6 on desktop and floor 7.5 px, cap 1.4 on the phone; the sub-lines, the X sub-line, the kicker and the legend, floor 8 px, cap 1.6 on desktop; on the phone the kicker and the legend floor 7 px, cap 1.8, and the stop sub-lines move to tier 2.
  - Draw each tier-1 label in its own group translated to its anchor, with the text (and, for the kicker, its Ink plate and rule) at the origin, and write only that group's scale. Write it only when `k` changes by more than half a percent. Never write font sizes per frame.
- **Tier 2, faded in:** the region names and their rune lines, the italic asides (`COPY.notes`, "left intentionally blank" among them), "SEA OF REVISIONS", "HERE BE DEADLINES", Yggdrasil, Urd's Well and its line (and the stop sub-lines on the phone). One group, one opacity: `smooth(1.3, 1.5, s / VIEW.s0)`, so they are gone at the overview and at the explore fit, and fully there at the stops and when zoomed in.
- Do this in `trip.mjs` (`tripBuild` collects the groups, `tripApply` writes them), from data in `data.mjs`.
- No tier-1 label may cross the map's inner frame or another tier-1 label at the overview, on 1440 x 900 and on 390 x 844 (section 11). If one would, you may move that label up to 6 units, or lower that kind's floor for that viewport, and say which in the report.

## 8. Cards

- **One layout for all six cards:** the headline leaves `.c-body` and sits under the header, full width. `.c-body` keeps two columns (the text, and the piece with its caption). A new full-width row, `.c-foot`, closes the card: the four crafts on the left (in one row, at most 340 px wide) and the button on the right. On the phone, the foot row stacks (crafts, then the button full width).
- **The card's height follows its content** on desktop. Measure each card's content height on resize and when fonts are ready (never in the frame), cap it at today's available height, and let the face scroll inside when it is taller (as now). Each card keeps its own height; the morph out of the shield uses it. No empty block taller than 80 px is left in either column.
- **Lennard:** the white small text on the orange fails contrast (3.34:1). Keep the white logo band, the orange field and the white headline (26 px, 800, which passes as large text). Everything else, the role, paragraph, step pills, kicker, "what I took" line, piece and caption, crafts and button, sits in a white panel (radius 10 px, padding 16 px) on the orange field, in Warm Gray 11 (`#706259`, 5.87:1). Inside the panel the button is Warm Gray 11 with white text, and the step pills are outlined in Warm Gray 11. New `PALETTES.lennard` keys: `panel`, `panelText`, `panelHair`, `panelButton`, `panelButtonText`. Only Lennard has a panel.
- **Interkom:** the button becomes `#242021` with cream `#F7F3E2` text (14.48:1); its arrow stays coral `#E85155` (a new `arrow` key).

## 9. Layout

- **A scrim under the controls.** An Ink gradient (transparent at its top to 0.85 at the bottom), 150 px tall on desktop and 190 px on the phone, across the bottom of the stage: above the map and the depth layers, under the hint line, the stepper, the timeline, popups, sheets and cards. Its opacity follows the camera, `smooth(1.3, 1.5, s / VIEW.s0)`: there at the stops, the finds and when zoomed in; gone at the top and the overview.
- **The X beat, desktop.** The frame's bottom edge (y = 885.5) must sit at least 12 px above the stepper's top. Lower the X beat's anchor (a new `CAMERA.xAnchorY`, never below 0.42) and, only if that is not enough on a short window, ease its zoom (never below 0.85 of `VIEW.sT`). The X leg eases into this view over its second half, and the rush to the footer starts from it.
- **The X beat, phone.** A view that fits the box `CAMERA.xBoxPhone = [244, 690, 494, 792]` (the X and its label, Lennard's shield and the skyline) with 16 px side margins, between 16 px from the top and 16 px above the step bar. The X leg eases into it over its second half, and the rush starts from it.
- **The compass.** Its "SCREEN" label crosses the frame's left ruler. Move the wayfinder 10 units east (`FINDS` `wayfinder` x 92 to 102; its `view` and `viewPhone` follow) and set its side words at plus and minus 46. "SCREEN"'s box keeps at least 4 units from the inner frame (x = 22.5), and "VIDEO"'s box at least 4 units from the south island's coast halo (the coast plus 6).
- **Popups.** A popup's ground and tail are opaque Ink from their first frame. The entrance scales the box as now, and only `.pop-body` fades in. The map's own type never shows through a popup.
- **Tap highlight.** `-webkit-tap-highlight-color: transparent` on `html`.
- **The stepper through the blast.** The stepper hides from the start of the rush until the settle ends, then returns with the end's buttons and its reveal. If focus was in the stepper, it goes back to the stepper's main button when it shows again.

## 10. Explore

- **The footer gives way.** While exploring, the footer's text and buttons (the call to action, "Let's talk", the links, the tagline and the name) fade with `1 - exploreK` and take no pointer events, so the whole map shows and the hint line sits clear. They come back with "Back to the end".
- **The supernova calms.** While exploring, its glow, rays and lobes fade to 0.35 and shrink to 0.6 of their size, scaled by `exploreK` (new numbers in `EXPLORE`, not `NOVA`). Presses still flare and stack.
- **Auto flares** skip while the live flares number `NOVA.flare.cap - 2` or more, so a visitor's presses always have room.
- **"Back to the top"** gets the same Ink ground and border as "Back to the end" whenever it shows, so the sky's clouds never cross its words.
- **Arrow keys pan while exploring:** each press moves the camera `EXPLORE.keyPan` (90 px; three times that with Shift) in its direction, eased like the wheel and bounded like a drag. They never move the journey. Outside exploring, the arrows keep their meaning. Escape and "Back to the end" end exploring, as now.
- **No grey flash (the cloud deck).** The deck's puffs pass their brightest band whenever the camera's scale crosses it, so a find's zoom or an explore zoom washes the screen grey. `tripState` keeps the trip's own camera scale as `st.tripS` before `tripFocus` or exploring write `st.cam`, and `depthDeckAlpha` takes its depth from `st.tripS`. The puffs still sit where the shown camera puts them. The deck then plays only on the dive between the map and Laurier and back, as `DEPTH.md` 7.3 meant.

## 11. Checks before you finish

Run every test in `tools/` and the two pack tools. Re-run only what failed while you fix it.

- `tools/check.mjs`:
  - Yggdrasil: every grove tree outside the crown grown by 6 and clear of the trunk and roots; the Yggdrasil label's box clear by 2 units of the drawing and the hoard mark; every well star inside the crown shrunk by 5 and spaced as in 3.2.
  - Jörmungandr: every ring sample inside the inner frame; every sample at least `W / 2 + 6` units from both coastlines; the trail crosses the ring exactly once; the head and the pad inside the inner frame; three leaves.
  - Toronto: each building's drawn height equals its metres x 0.105 within 0.15 units; the CN Tower is the tallest and First Canadian Place the tallest office tower; the west-to-east order as listed; the whole skyline inside `COAST_B`.
  - Labels: at the overview on 1440 x 900 and on 390 x 844 (use `tripResize` with the timeline height the page uses), no tier-1 label box crosses the inner frame or another tier-1 box, and every desktop tier-1 name is at least 10 px. The compass's words keep the clearances in section 9.
  - Cards: every small text colour on its ground (the panel where there is one) at least 4.5:1, every headline at least 3:1 on its field.
  - `map.css` has `-webkit-tap-highlight-color: transparent`. The gzip budgets from part B still pass.
- `tools/finds-test.mjs`:
  - Jörmungandr: three pokes show FRI / 5 PM, TODAY / EOD, NOW / ASAP in turn and count the find once; five presses 0.05 s apart take one leaf and queue at most one more; while a leaf is held, its transform follows the head; after the third, the tail is back in the mouth, the popup holds "Deadline met" and the eye is shut; poked asleep, a new pad shows the first leaf; reduced motion runs the same states with no swell.
  - The tree: the eagle's circle on `hear` ends where it began; nothing moves under reduced motion.
  - Re-record the `sea` digest after adding the ring (only the ring changes the sea); `fill` and `coast` stay as recorded. Re-record the `trip.mjs` and `depth.mjs` source digests and say why. `STARS`, `DEPTH` and `NOVA` keep their digest.
- `tools/depth-test.mjs`: for every `FINDS` view, a chest's view and `focus.wide`, at focus `k` from 0 to 1 in steps of 0.05, from the map beat and from a stop beat, the deck's alpha never exceeds the trip's own at that `P`; the same for the explore camera from its fit to its closest zoom.
- `tools/steps-test.mjs`: the stepper is hidden from the rush's start to the settle's end; at the X beat on 1440 x 900 the frame's bottom edge is at least 12 px above the stepper's top; on 390 x 844 the X, Lennard's waypoint and the skyline's box are inside the view with 16 px to spare and above the step bar.
- `tools/explore-test.mjs`: arrows pan while exploring and leave `P` unchanged; Escape ends exploring; the footer's opacity is `1 - exploreK`.

## 12. Report: `WORLD-BUILD.md`

What you built, section by section; anything left out and the rule that stopped it; any label you moved or floor you lowered (section 7); the digests you re-recorded and why; every test's last output line; the packed sizes and gzip numbers. Say plainly that no browser check was made.
