# Round 7 part D2 build

Status: all D2 runtime fixes are implemented, all eight tests pass, and both packs are complete. No visual or browser check was made.

## Evidence and acceptance criteria

REVIEW2.md was read first in full, followed by FLASH.md, FLASH-BUILD.md,
the named sources and tools. Existing WORLD and CREATURES build records,
the original brief, and current drawing/data geometry inform this revision.
The approved map structure, line work, content, D1 canvas handoff and
gesture ownership remain constraints.

- Format whole-number rune values and number-sensitive hammer nouns.
- Restore focus to a reopened card's X; ignore X while the journey moves.
- Fade primary and secondary stop labels under find focus, with cached
  writes and exact endpoints; give hints a solid Ink ground.
- Measure phone footer/control geometry on resize, maintaining 16 px
  vertical separation and never moving the nova above its existing anchor.
- Keep phone explore controls in one pill row, clear of the fitted title.
- Meet overview text floors and test actual shared analytic label/glyph
  boxes, preserving the stops, trail, X and finds.
- Draw original Norse foes and a damaged round-shield wall inside existing
  hit geometry; preserve all simulation and balance tuning.
- Ease the chest lid gently to its peak at about 0.5 s, at no more than
  25 degrees per 16 ms; keep overshoot at most 8 degrees.
- Replace take-off leaves with small falling quills, gone within 0.8 s.
- Draw a wider-than-tall ash crown with separate foliage masses, visible
  limbs and light hatching, keeping the trunk, roots, well and place.

The installed UI routing, motion-playbook and design-critique-loop
instructions were read. Network/CLI discovery, rendered comparison and
independent critique are omitted because this task prohibits network,
browser work and agents. No independent-review pass or score is claimed.
This permitted report is the project record; no other Markdown is written.

## What was built and drawn

- D2-1/2: hammerRuneNumber rounds every return value. hammerText uses foes for the stats suffix, max for the heart-capacity suffix, and n elsewhere. Stats now uses foe{s}; the capacity label also handles a capacity of one. The checks format every rune level, every numeric hammer template at independent 1/2 values, and each rune line at 1/2.
- D2-4: a local mark reopen records a pending focus transfer. Once cardsFrame has made that card open and removed inert from its face, its X receives focus with preventScroll. A moving journey cancels the pending transfer. cardsClose ignores moving journeys, including actual X clicks.
- V2-1: stop names, the X name, title, kicker and legend text share g.map-tier1. All stop sub-lines, including the X sub-line, live in tier 2 on both viewport types. The primary group and map-subs fade with 1 - smooth(0, .4, focusK), hide at zero, ignore changes of .01 or less, and snap to exact endpoints. The hint has full Ink background, 6/12 px padding and an 8 px radius.
- V2-2: footerResize measures the end bar, headline, talk button and name. It temporarily measures the real end labels even when controls are hidden, focused on a find, or exploring, then restores their live state. A shared pure box function starts the CTA at max(14vh, bar bottom + 16 px), computes the minimum downward nova shift, and reserves a minimum flow spacer through target bottom + 16 px before the name. The phone anchor remains x .58 and never goes above y .5. tripState reads the stored pixel y; no frame reads layout. Phone tagline margins leave more room, and the talk button has a defined 46 px height.
- Phone explore uses a 44 px tall pill for Back to the end, a one-line top button, an 8 px gap, and the reserved bottom band, clear of the fitted title. stepsExploreBoxes and PHONE_LAYOUT supply the same row dimensions used by the CSS/resize writer.
- V11/V2-5: removed label caps that defeated the floors. Stop names and X have 10 px desktop/9 px phone floors; kicker and legend have 9 px floors; numbered marker text has a 6 px floor. Stop sub-lines retain a 7.6 px floor when revealed. The deadline calendar signs and small compass lettering join tier 2. Actual markup is walked to reject visible text below 6 px at both overviews.
- V2-4: drew a lean hunched draugr with a torn cloak and notched blade; a broad rime giant with a pointed icicle beard and club; a tall flame-haired son of Muspell with a blade; a low, running wolf in profile; and a wider horn-helmed chief gripping a club with both hands. Hrungnir is a much larger horned figure with a two-handed club, and the clay helper has a separate craggy silhouette. Every endpoint/control point and its stroke stays inside its existing hit rectangle.
- The shield wall has three unchanged cell segments. Each normal segment draws three overlapping round shields with rims, bosses and planks. The doubled fate adds a second row over its existing cells. A clip assembled from live cell tiles removes the corresponding piece when a cell is destroyed. The recording test checks the actual changed clip. hammer.mjs and every simulation/balance number are unchanged.
- V5: the lid now reaches 118 degrees in .5 s with a cosine ease and zero starting/peak velocity, then settles to 110 over .18 s with the same smooth endpoint behavior. Bounce lasts .3 s. The 8 degree overshoot remains. Recording tests sample at intervals no longer than 16 ms, cap every step at 25 degrees, and check the gentle start and .5 s peak.
- V2-3: drew a short shaft and two narrow open vanes in the thin line style. Two small quills shed behind the tail when takeoff actually begins, including each staggered hear-loop takeoff. They fall with positive y velocity/gravity and fade over .65-.75 s. Recording tests follow both birds and the emitted paths, compare quill dimensions with one third of the open rig wing, reject overlap with the other bird, and check expiry by .8 s.
- V2-6: redrew the crown as three asymmetric lobed foliage masses at different heights, with open gaps between their outlines. Added extensions of the existing three trunk limbs and sparse twig/leaf hatching. There is no flat crown fill. The crown is wider than tall and remains the largest drawing on its island. The original trunk, roots, rootlets, well, tree position and actors remain. The original conservative crown envelope stays as the grove/well exclusion; actual drawn mass contours additionally supply the label box, star-containment and open-gap checks.

## Label decisions and deliberate adaptations

All moves below are relative to the starting sources, in map units:

- HMC Connections: anchor left 6; name tracking -0.55 units per gap. Its existing sub-line offset is retained.
- HMC, again: anchor right 6, carrying its sub-line right 6. The sub-line uses -0.15 unit tracking to clear the crown at the trip scale.
- Kicker: down 6. Its plate is fitted more closely above/below the letters so the enlarged subtitle stays below the title.
- X name: same anchor and words, set on two lines, X marks / the work. This gives the required readable size without crossing the adjacent tent/caret drawings or moving the X, trail, stops or finds. Its sub-line moves down 6 and remains hidden at the overview.
- No decorative tent/caret glyph was moved. Their analytic boxes, the primary label boxes and the actual crown box clear the visible labels by at least 2 units at both required overview sizes. No floor was lowered.

These are source and analytic layout results. Real font metrics, rendered line work, phone tap behavior, and the crown/foe silhouettes still require the external browser review.

## Tests, baselines and packing

All eight test programs pass. Both original pack tools ran successfully without modification, including the standalone packer. All 34 top-level runtime/tool .mjs files also passed node --check.

Changed existing assertions only where D2 deliberately changes behavior:

- check.mjs now excludes desktop sub-lines from the visible overview tier, enforces the new floors, and exercises numeric formatting rather than the old formatter's exact source spelling.
- steps-test sets its card fixture at a stopped journey before closing, then tests actual reopen focus and moving-X rejection.
- finds-test waits .75 s for the new .68 s open/settle instead of .6 s. Its existing 25 degree lid-step limit and 118/110 angle assertions remain.
- finds-test re-records trip.mjs's LF-normalized FNV digest from 1420657627 to 3574899642 for the authorized label fade/scaling and measured phone footer anchor. No other digest was re-recorded.
- Existing depth.mjs digest 3982895838, STARS/DEPTH/NOVA digest 1195292270, sea hash 3547300242, fill hash 3665486802 and coast hash 2408021381 still pass unchanged.

The phone layout gate uses conservative analytic fixtures: a three-line 24 px headline, 46 px talk button, measured-bar boxes, and a lower name-stack reservation. It exercises the actual resize writer with recording elements, including restoration of hidden/current labels and a taller bar, at 390x844, 360x640 and 412x915. It also uses the actual fitted explore camera. This is not a browser/font-layout check.

The 200-seed hammer results match HAMMER-BUILD.md: steady wave-4 reach 74.0%, steady wins 17.5%, idle termination by wave 3 91.5%.

Pack last lines:

- node tools/pack.mjs: dist/journey-map.html 586.9 KB
- node tools/pack-joined.mjs: dist/journey-joined.html 1126.3 KB

joined.html was regenerated and is byte-identical to its starting version.
Final gzip sizes: hammer 15.64/30 KB, combined map modules/CSS 135.23/150 KB, standalone 251.75/320 KB, joined 472.01/540 KB.

## Scope and things left out

No requested runtime fix was omitted. No browser, visual comparison, screenshot, rendered-frame inspection, device recording or independent critique was made. The user's explicit restrictions reserve that review for elsewhere and prohibit agents. There is no visual quality pass or manufactured critique score.

RTK was unavailable (command-not-found); no utility was installed. The UI skill's network-capable CLI discovery and motion skill's rendered preview steps were left out under this task's restrictions. No git, network, installation, server, reviewer agent or sub-agent was used. No server was started or left running.

A SHA-256 inventory confirms that all changed/new files are on section 3's allowlist. Wrote art.mjs, cards.mjs, data.mjs, findcreatures.mjs, findhammer.mjs, findhoards.mjs, footer.mjs (measuring/layout only), map.css, steps.mjs, trip.mjs, tools/check.mjs, tools/finds-test.mjs, tools/hammer-test.mjs, tools/steps-test.mjs, new tools/layout-test.mjs, this report, and the permitted pack outputs. The packers also wrote the unchanged joined.html.

hero-copy/, reference/, assets/, index.html, explore.mjs, main.mjs, join.mjs, hammer.mjs, every other Markdown file and every unlisted module retain their original hashes. No file was removed. Every existing non-ASCII character sequence in the source is unchanged, including the Norse names in data.mjs. This report uses ASCII only.

## Each test's exact last output line

| Program | Result | Last output line |
| --- | --- | --- |
| node tools/check.mjs | PASS | `ok: 6 stops, 5 palettes (Lennard band verified), 11 finds, acts total 2224.8 vh, 24 modules with unique top-level names; STEPS numbers finite/positive; 10 strictly rising beats; X camera continuous at desktop/phone sizes; DEPTH/NOVA/STARS numbers finite; 20 cloud rows valid; rings.colour in C; FIND_PLAY finite, slots have text, five known hoard kinds, one bounded world serpent/three leaves, nine fixed views; Part B tables, Norns, fog, crown stars, shields, hammer rows and approved runes valid` |
| node tools/steps-test.mjs | PASS | `ok: X frame/phone box clear controls; rush through settle hides stepper and restores main focus` |
| node tools/depth-test.mjs | PASS | `ok: gather endpoints and continuous ring tangent for 32 arrival angles; explore restores depth fade` |
| node tools/finds-test.mjs | PASS | `ok: actual timeline Home and End handlers select first and last stops` |
| node tools/hammer-test.mjs | PASS | `ok: 200-seed balance bounds, finite runs and <20-minute termination` |
| node tools/explore-test.mjs | PASS | `ok: capture-phase pinch on nova/stop/horn; nova taps; owned single drags; drag-only pointer clicks; key/end/depart/reset/down/500 ms suppression clearing; temporary world promotion` |
| node tools/nova-test.mjs | PASS | `ok: rough sprite grows on resize; reduced motion leaves canvas empty and static SVG X unchanged` |
| node tools/layout-test.mjs | PASS | `ok: resize reads/restores hidden end controls; shared analytic boxes cover taller bars and all three phones; no frame layout reads` |
