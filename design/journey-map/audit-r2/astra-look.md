# Auditor L (look), astra - round 2

Frozen build: 7d81592. Read-only audit. All outputs are confined to this folder. Images were inspected.

## 1. Additional questions written before inspecting the design

1. Does the initial viewport communicate whose journey this is and why a visitor should follow it?
2. Can a visitor distinguish geographic space from chronological distance without an explanation?
3. Does the same place appearing twice read as a return, rather than an accidental duplicate?
4. Does the journey explain how education led to each kind of creative work?
5. Is there a clear visual difference between primary progress, optional discovery, and review controls?
6. Can a visitor anticipate the next camera destination before the movement begins?
7. Does camera framing preserve enough landmarks to avoid disorientation between stops?
8. Does the camera ever put the focal object in a visually empty or obstructed part of the screen?
9. Do label backgrounds and halos preserve the map beneath them without letting it impair reading?
10. Are all silhouettes recognizable without relying on their labels?
11. Do tiny decorative marks combine into accidental faces, symbols, or dark blobs?
12. Do coastlines, contours, roots, branches, and trail strokes remain distinguishable when they overlap?
13. Is repeated ornament varied with intention, rather than visibly stamped?
14. Do the frame corners, joins, and knots form a coherent border at cropped camera positions?
15. Does the map balance quiet space with focal detail at every story stop?
16. Does the traveller retain a readable silhouette and direction of travel against every background?
17. Does the trail suggest an intentional route, rather than wandering around content arbitrarily?
18. Are text line lengths and paragraph breaks comfortable on the smallest supported phone?
19. Does visual order match reading order when cards change layout across breakpoints?
20. Is the relationship between each brand, time period, role, and work sample immediate?
21. Do controls have enough visual separation to prevent accidental adjacent taps?
22. Are disabled controls visibly different without becoming illegible?
23. Do hints disappear before they obscure the action they describe?
24. Do optional discoveries reward attention without stealing the main journey's climax?
25. Do discovered and undiscovered objects differ in shape or text, as well as color?
26. Does each game's opening frame explain its objective, controls, and exit before movement starts?
27. Does each success, failure, reset, and replay state feel visually resolved?
28. Is motion's direction consistent with forward, backward, opening, closing, and returning?
29. Does the blast preserve readable control placement and a comprehensible transition to the ending?
30. Does the ending deliver a clear emotional and practical destination after the spectacle?
31. Are simultaneous glows, particles, labels, and interface changes sequenced to avoid visual noise?
32. Does reduced motion preserve meaning and state changes rather than merely removing movement?
33. Do light flashes avoid creating abrupt full-screen luminance shocks during normal progression?
34. Does a rotation leave the visitor looking at the same object with equally useful framing?
35. Is the map enjoyable when viewed without interacting for thirty seconds?
36. Does the joined page's hand-over establish continuity in scale, tone, and control expectations?
37. Are small text and thin lines robust at ordinary device pixel ratios, not only retina captures?
38. Does any decorative object inadvertently look more clickable than an actual find?
39. Can a visitor tell what has already been explored without memorizing the map?
40. Does the visual complexity support Dan's professional identity as strongly as the fantasy theme?

## 2. Inventory and question-group verdicts

Auditor: L (look), astra on Dan's PC. Revision: `7d815925728fbdfdbef583af5cf843d1309661c1`. Both packed pages were opened from disk. The ordinary joined-page journey was captured on desktop and at Dan's 412x730 size. The standalone surface was checked at every required size. No other round-2 auditor's report was read.

### What the verdicts mean

Columns A-M are the brief's exact groups: purpose; entrances/exits; drawing; motion; intuition; hierarchy/reading; belonging; color/brand; layout; states; felt speed; accessibility; standing rules. The 40 questions above were also applied, with their numbers cited in the findings.

- `P`: pass for the **look evidence actually sampled**, alone and in context; no additional issue found. It does not certify every behavior, assistive technology, hardware or timing scenario in that group.
- `L-n`: additional finding below. It is not a blanket failure of every question in that group.
- `-`: not applicable to this static/decorative element at this granularity.
- `U`: unverified portion. This is deliberately not a passing verdict.
- `R`: explicit design exception/tension: wayfinder selected words, rune trace, poster accents, footer CTA/name lens use Red beyond question H47's literal list; the supplied briefs intentionally ask for these. Game headings use the explicit HAMMER 600 setting rather than the general 800 rule. I recorded these contradictions and did not silently reinterpret them as accidental defects.
- `K1`: known card-to-shield provenance; `K2`: known full shield/brand-palette request; `K3`: known card-X belonging; `K4`: known scrolling cards; `K5`: known nova pause/gather/embers; `K6`: known phone explore blanking/lag; `K7`: known horn view; `K8`: known tablet VIDEO clipping; `K9`: known hammer outer-close animation; `K10`: authorized placeholder/inert-prototype scope. These are not new findings or passes.

The inventory contains **710 rows**. Repeated drawings receive individual rows (including all 65 small trees, all 20 cloud placements, 8 peaks, 7 hills and each skyline building). Shared particle pools and repeated stroke systems are inventoried as systems, not as thousands of indistinguishable individual dots. An observation includes both an enlarged/isolated inspection and its normal contextual view where available. Unseen game phases are marked U.

### Evidence key

- `O`: `large/desk-whole-map-large.png`, with normal reading-size `desk-all/desk-beat-map.png`, `walk-dan/dan-02-overview.png` and `layout/` comparisons.
- `A`: `drawing-atlas.jpg`, enlarged crops of the actual chart, compared with the approved original sheets and round7 references. `T01`-`T65`: cells of `tree-atlas.jpg`; coordinates in `world-data.json`.
- `D`: `desk-all/desk-beat-*.png`, `desk-all/desk-find-*.png`. `F`: matching desktop and `dan-finds/dan-find-*.png` states.
- `W`: `walk-desk/` and `walk-dan/` normal-input joined journeys. `H`: `handoff-desk.jpg` and `handoff-dan.jpg`. `Cards/<id>`: that stop's rest frames in both walks plus all eight `layout/` sizes.
- `L`: `layout/desk-<width>x<height>-<beat>.png`; `layout.log` contains measured boxes/scroll sizes.
- `Y`: `desk-all/desk-find-well-*.png`, `corrected-dan/dan-well-*.png`, `large/desk-well-tree-*.png`.
- `All`: `all-states/desk-*.png`, `all-states.log`. `Bc`: its `beacon-note-*` frames. `Way`: `way-dan/` plus `all-states/desk-way-*`.
- `Rune`: `corrected-dan/` open, partial, complete, reverse and exit frames. `Details`: **valid hammer/raven portions only** of `details-dan/`.
- `Game`: `game-dan/` play/rune/loss/win frames and `game-dan.log`; `game-runes.jpg`, `game-boss.jpg`. `DPR2`: `game-dpr2/dan-game-dpr2.png`. `Crop`: `game-art-crops.png`.
- `C`: `completion/desk-eleventh-*.png`, `completion-strip.jpg`, `completion.log`. `Rev`: `reversal-dan/`, `reversal-strip.jpg`, `hurry-strip.jpg`. `Idle`: `idle/` 30-second overview and tree-idle samples.
- `Focus`: `focus/` keyboard/focus frames. `Hint`: `hint-check/` and its log. `RM`: `reduced-dan/`, `reduced-timeline/` and their logs.
- `Nova`: the 35-frame strips from each joined walk, `nova-desk.jpg`, `nova-dan.jpg`. Capture waits are real time; screenshot overhead makes actual intervals longer than the requested sleeps. These are visual samples, not a 60 fps performance recording.


### Entry, chart structure, sea and frame

| Row | Element/state | A | B | C | D | E | F | G | H | I | J | K | L | M | Evidence | Alone and in-context observation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I001 | Joined hero-to-map hand-over | P | P | P | P | P | P | P | P | P | U | U | U | P | W, H | Existing hero rises; stars/coasts stage the hand-over. Hero internal design excluded. |
| I002 | Standalone opening caption | P | P | P | P | - | P | P | P | P | - | - | P | P | D/top | Prototype caption remains readable; draft content excluded. |
| I003 | Standalone Start the journey | P | P | P | P | P | P | P | P | P | U | U | U | P | D/top | Primary action is apparent. |
| I004 | Joined Start the journey hand-over control | P | P | P | P | P | P | P | P | U | U | U | U | P | W/00-hero | Only its hand-over behavior is in scope. |
| I005 | The saga so far title | P | P | P | P | - | L-7 | P | P | L-7 | - | - | P | P | O,L/map | Strong overview title; landscape composition fails. |
| I006 | Map kicker and its rule/Ink plate | P | P | L-7 | P | - | L-7 | P | P | L-7 | - | - | P | P | O,L/map | Clear at portrait sizes; protrudes at landscape size. |
| I007 | Main island land fill | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,L/map | Thin chart language retained; outline/stipple density supports the land. |
| I008 | South island land fill | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,L/map | Thin chart language retained; outline/stipple density supports the land. |
| I009 | Main coastline | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,L/map | Thin chart language retained; outline/stipple density supports the land. |
| I010 | South coastline | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,L/map | Thin chart language retained; outline/stipple density supports the land. |
| I011 | Main coast inset band | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,L/map | Thin chart language retained; outline/stipple density supports the land. |
| I012 | South coast inset band | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,L/map | Thin chart language retained; outline/stipple density supports the land. |
| I013 | Main shore hatch/stipple field | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,L/map | Thin chart language retained; outline/stipple density supports the land. |
| I014 | South shore hatch/stipple field | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,L/map | Thin chart language retained; outline/stipple density supports the land. |
| I015 | Sea ground | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,L/map | Thin chart language retained; outline/stipple density supports the land. |
| I016 | Rhumb-line fan | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,L/map | Thin chart language retained; outline/stipple density supports the land. |
| I017 | Sea wave 01 at [40, 200] | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A | Recognizable small water mark; unobtrusive beside route. |
| I018 | Sea wave 02 at [52, 300] | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A | Recognizable small water mark; unobtrusive beside route. |
| I019 | Sea wave 03 at [36, 560] | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A | Recognizable small water mark; unobtrusive beside route. |
| I020 | Sea wave 04 at [150, 640] | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A | Recognizable small water mark; unobtrusive beside route. |
| I021 | Sea wave 05 at [60, 610] | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A | Recognizable small water mark; unobtrusive beside route. |
| I022 | Sea wave 06 at [536, 300] | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A | Recognizable small water mark; unobtrusive beside route. |
| I023 | Sea wave 07 at [548, 420] | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A | Recognizable small water mark; unobtrusive beside route. |
| I024 | Sea wave 08 at [552, 600] | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A | Recognizable small water mark; unobtrusive beside route. |
| I025 | Sea wave 09 at [520, 690] | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A | Recognizable small water mark; unobtrusive beside route. |
| I026 | Sea wave 10 at [250, 630] | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A | Recognizable small water mark; unobtrusive beside route. |
| I027 | Sea wave 11 at [340, 622] | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A | Recognizable small water mark; unobtrusive beside route. |
| I028 | Sea wave 12 at [120, 790] | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A | Recognizable small water mark; unobtrusive beside route. |
| I029 | Sea wave 13 at [540, 780] | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A | Recognizable small water mark; unobtrusive beside route. |
| I030 | Sea wave 14 at [380, 100] | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A | Recognizable small water mark; unobtrusive beside route. |
| I031 | Sea wave 15 at [330, 70] | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A | Recognizable small water mark; unobtrusive beside route. |
| I032 | Sea wave 16 at [560, 170] | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A | Recognizable small water mark; unobtrusive beside route. |
| I033 | Sea wave 17 at [40, 420] | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A | Recognizable small water mark; unobtrusive beside route. |
| I034 | Outer frame | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,L/x | Object-sized chart frame, tidy joins; no added whole-page motif. |
| I035 | Ruler tick frame | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,L/x | Object-sized chart frame, tidy joins; no added whole-page motif. |
| I036 | Inner frame | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,L/x | Object-sized chart frame, tidy joins; no added whole-page motif. |
| I037 | Legend ground and top rule | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,L/x | Object-sized chart frame, tidy joins; no added whole-page motif. |
| I038 | Top-left interlace knot | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,C | Same small rosette/knot treatment; completion rotation sampled. |
| I039 | Top-right interlace knot | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,C | Same small rosette/knot treatment; completion rotation sampled. |
| I040 | Bottom-left interlace knot | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,C | Same small rosette/knot treatment; completion rotation sampled. |
| I041 | Bottom-right interlace knot | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,C | Same small rosette/knot treatment; completion rotation sampled. |
| I042 | Legend Shield symbol | P | P | P | P | - | P | P | P | L-7 | - | - | - | P | O,L/map | Symbols correspond to the drawn map. |
| I043 | Legend words: a stop | P | P | P | P | - | L-7 | P | P | L-7 | - | - | P | P | O,L/map | Readable portrait legend; crowding in landscape. |
| I044 | Legend Numbered red circle symbol | P | P | P | P | - | P | P | P | L-7 | - | - | - | P | O,L/map | Symbols correspond to the drawn map. |
| I045 | Legend words: something to play with | P | P | P | P | - | L-7 | P | P | L-7 | - | - | P | P | O,L/map | Readable portrait legend; crowding in landscape. |
| I046 | Legend Red X symbol | P | P | P | P | - | P | P | P | L-7 | - | - | - | P | O,L/map | Symbols correspond to the drawn map. |
| I047 | Legend words: the work | P | P | P | P | - | L-7 | P | P | L-7 | - | - | P | P | O,L/map | Readable portrait legend; crowding in landscape. |
| I048 | Legend Dotted segment symbol | P | P | P | P | - | P | P | P | L-7 | - | - | - | P | O,L/map | Symbols correspond to the drawn map. |
| I049 | Legend words: the trail | P | P | P | P | - | L-7 | P | P | L-7 | - | - | P | P | O,L/map | Readable portrait legend; crowding in landscape. |

### Terrain, buildings and small trees

| Row | Element/state | A | B | C | D | E | F | G | H | I | J | K | L | M | Evidence | Alone and in-context observation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I050 | West inlet river | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,D | Individual silhouette checked; meaningful chart shorthand; route remains separate. |
| I051 | Well-to-south river | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,D | Individual silhouette checked; meaningful chart shorthand; route remains separate. |
| I052 | Well basin outline | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,D | Individual silhouette checked; meaningful chart shorthand; route remains separate. |
| I053 | Two water marks in basin | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,D | Individual silhouette checked; meaningful chart shorthand; route remains separate. |
| I054 | Mohawk cliff/hatching | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,D | Individual silhouette checked; meaningful chart shorthand; route remains separate. |
| I055 | Cliff waterfall bars | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,D | Individual silhouette checked; meaningful chart shorthand; route remains separate. |
| I056 | Cliff water ripple | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,D | Individual silhouette checked; meaningful chart shorthand; route remains separate. |
| I057 | Trail river bridge | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,D | Individual silhouette checked; meaningful chart shorthand; route remains separate. |
| I058 | Side road not taken | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,D | Individual silhouette checked; meaningful chart shorthand; route remains separate. |
| I059 | Side-road signpost | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,D | Individual silhouette checked; meaningful chart shorthand; route remains separate. |
| I060 | Dashed arrival route | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,D | Individual silhouette checked; meaningful chart shorthand; route remains separate. |
| I061 | Laurier hall and flag | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,D | Individual silhouette checked; meaningful chart shorthand; route remains separate. |
| I062 | Laurier landing sailboat | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,D | Individual silhouette checked; meaningful chart shorthand; route remains separate. |
| I063 | HMC summers dock and three flags | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,D | Individual silhouette checked; meaningful chart shorthand; route remains separate. |
| I064 | HMC contract dock and three flags | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,D | Individual silhouette checked; meaningful chart shorthand; route remains separate. |
| I065 | HMC outer sailboat 1 | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,D | Individual silhouette checked; meaningful chart shorthand; route remains separate. |
| I066 | HMC outer sailboat 2 | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,D | Individual silhouette checked; meaningful chart shorthand; route remains separate. |
| I067 | Mohawk campus and flag | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,D | Individual silhouette checked; meaningful chart shorthand; route remains separate. |
| I068 | South landing post | P | P | P | P | - | P | P | P | P | - | - | - | P | O,A,D | Individual silhouette checked; meaningful chart shorthand; route remains separate. |
| I069 | Mountain 1 at [96, 306] | P | P | P | P | - | P | P | P | P | - | - | - | P | A/Mountains,D/mohawk | Peak/profile clear. West-edge peaks are tight to the coast but not mistaken for controls. |
| I070 | Mountain 2 at [126, 292] | P | P | P | P | - | P | P | P | P | - | - | - | P | A/Mountains,D/mohawk | Peak/profile clear. West-edge peaks are tight to the coast but not mistaken for controls. |
| I071 | Mountain 3 at [160, 300] | P | P | P | P | - | P | P | P | P | - | - | - | P | A/Mountains,D/mohawk | Peak/profile clear. West-edge peaks are tight to the coast but not mistaken for controls. |
| I072 | Mountain 4 at [186, 314] | P | P | P | P | - | P | P | P | P | - | - | - | P | A/Mountains,D/mohawk | Peak/profile clear. West-edge peaks are tight to the coast but not mistaken for controls. |
| I073 | Mountain 5 at [84, 340] | P | P | P | P | - | P | P | P | P | - | - | - | P | A/Mountains,D/mohawk | Peak/profile clear. West-edge peaks are tight to the coast but not mistaken for controls. |
| I074 | Mountain 6 at [112, 334] | P | P | P | P | - | P | P | P | P | - | - | - | P | A/Mountains,D/mohawk | Peak/profile clear. West-edge peaks are tight to the coast but not mistaken for controls. |
| I075 | Mountain 7 at [146, 336] | P | P | P | P | - | P | P | P | P | - | - | - | P | A/Mountains,D/mohawk | Peak/profile clear. West-edge peaks are tight to the coast but not mistaken for controls. |
| I076 | Mountain 8 at [92, 374] | P | P | P | P | - | P | P | P | P | - | - | - | P | A/Mountains,D/mohawk | Peak/profile clear. West-edge peaks are tight to the coast but not mistaken for controls. |
| I077 | Hill 1 at [140, 516] | P | P | P | P | - | P | P | P | P | - | - | - | P | A,O,Bc | Quiet rounded relief mark. |
| I078 | Hill 2 at [206, 522] | P | P | P | P | - | P | P | P | P | - | - | - | P | A,O,Bc | Quiet rounded relief mark. |
| I079 | Hill 3 at [128, 568] | P | P | P | P | - | P | P | P | P | - | - | - | P | A,O,Bc | Quiet rounded relief mark. |
| I080 | Hill 4 at [222, 574] | P | P | P | P | - | P | P | P | P | - | - | - | P | A,O,Bc | Quiet rounded relief mark. |
| I081 | Hill 5 at [408, 478] | P | P | P | P | - | P | P | P | P | - | - | - | P | A,O,Bc | Quiet rounded relief mark. |
| I082 | Hill 6 at [404, 548] | P | P | L-8 | P | - | P | P | P | L-8 | - | - | - | P | A,O,Bc | Quiet rounded relief mark. |
| I083 | Hill 7 at [230, 700] | P | P | P | P | - | P | P | P | P | - | - | - | P | A,O,Bc | Quiet rounded relief mark. |
| I084 | T01: round tree at (375.4, 199.3) | P | P | P | P | - | P | P | P | P | - | - | - | P | T01,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I085 | T02: round tree at (236.0, 190.4) | P | P | P | P | - | P | P | P | P | - | - | - | P | T02,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I086 | T03: pine at (274.1, 200.2) | P | P | P | P | - | P | P | P | P | - | - | - | P | T03,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I087 | T04: round tree at (344.9, 154.7) | P | P | P | P | - | P | P | P | P | - | - | - | P | T04,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I088 | T05: pine at (253.5, 176.5) | P | P | P | P | - | P | P | P | P | - | - | - | P | T05,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I089 | T06: pine at (365.8, 158.1) | P | P | L-14 | P | - | P | P | P | L-14 | - | - | - | P | T06,O,A | Merged/tangent pair; keep density, separate silhouettes. |
| I090 | T07: round tree at (391.1, 202.2) | P | P | P | P | - | P | P | P | P | - | - | - | P | T07,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I091 | T08: pine at (376.6, 183.6) | P | P | P | P | - | P | P | P | P | - | - | - | P | T08,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I092 | T09: pine at (270.4, 214.5) | P | P | P | P | - | P | P | P | P | - | - | - | P | T09,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I093 | T10: round tree at (356.6, 202.4) | P | P | P | P | - | P | P | P | P | - | - | - | P | T10,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I094 | T11: pine at (402.3, 187.9) | P | P | P | P | - | P | P | P | P | - | - | - | P | T11,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I095 | T12: pine at (315.9, 158.0) | P | P | P | P | - | P | P | P | P | - | - | - | P | T12,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I096 | T13: round tree at (384.0, 161.3) | P | P | P | P | - | P | P | P | P | - | - | - | P | T13,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I097 | T14: pine at (365.0, 209.2) | P | P | P | P | - | P | P | P | P | - | - | - | P | T14,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I098 | T15: round tree at (388.4, 185.5) | P | P | P | P | - | P | P | P | P | - | - | - | P | T15,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I099 | T16: pine at (395.8, 167.6) | P | P | P | P | - | P | P | P | P | - | - | - | P | T16,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I100 | T17: pine at (261.0, 199.8) | P | P | P | P | - | P | P | P | P | - | - | - | P | T17,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I101 | T18: round tree at (272.5, 190.6) | P | P | P | P | - | P | P | P | P | - | - | - | P | T18,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I102 | T19: round tree at (342.9, 214.3) | P | P | P | P | - | P | P | P | P | - | - | - | P | T19,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I103 | T20: round tree at (371.5, 165.7) | P | P | L-14 | P | - | P | P | P | L-14 | - | - | - | P | T20,O,A | Merged/tangent pair; keep density, separate silhouettes. |
| I104 | T21: round tree at (399.8, 178.5) | P | P | P | P | - | P | P | P | P | - | - | - | P | T21,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I105 | T22: round tree at (328.1, 222.5) | P | P | P | P | - | P | P | P | P | - | - | - | P | T22,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I106 | T23: round tree at (375.7, 212.5) | P | P | P | P | - | P | P | P | P | - | - | - | P | T23,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I107 | T24: pine at (281.9, 214.2) | P | P | P | P | - | P | P | P | P | - | - | - | P | T24,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I108 | T25: round tree at (244.4, 181.5) | P | P | P | P | - | P | P | P | P | - | - | - | P | T25,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I109 | T26: round tree at (249.6, 162.0) | P | P | P | P | - | P | P | P | P | - | - | - | P | T26,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I110 | T27: round tree at (298.1, 221.1) | P | P | P | P | - | P | P | P | P | - | - | - | P | T27,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I111 | T28: round tree at (251.3, 208.9) | P | P | P | P | - | P | P | P | P | - | - | - | P | T28,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I112 | T29: round tree at (276.1, 160.6) | P | P | P | P | - | P | P | P | P | - | - | - | P | T29,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I113 | T30: pine at (356.4, 212.2) | P | P | P | P | - | P | P | P | P | - | - | - | P | T30,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I114 | T31: round tree at (287.4, 161.7) | P | P | P | P | - | P | P | P | P | - | - | - | P | T31,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I115 | T32: round tree at (362.4, 192.9) | P | P | P | P | - | P | P | P | P | - | - | - | P | T32,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I116 | T33: pine at (237.8, 169.7) | P | P | P | P | - | P | P | P | P | - | - | - | P | T33,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I117 | T34: pine at (260.7, 211.5) | P | P | P | P | - | P | P | P | P | - | - | - | P | T34,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I118 | T35: pine at (377.4, 173.7) | P | P | P | P | - | P | P | P | P | - | - | - | P | T35,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I119 | T36: pine at (332.9, 155.4) | P | P | P | P | - | P | P | P | P | - | - | - | P | T36,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I120 | T37: round tree at (410.3, 402.1) | P | P | P | P | - | P | P | P | P | - | - | - | P | T37,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I121 | T38: pine at (387.6, 396.1) | P | P | P | P | - | P | P | P | P | - | - | - | P | T38,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I122 | T39: pine at (391.4, 368.3) | P | P | P | P | - | P | P | P | P | - | - | - | P | T39,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I123 | T40: round tree at (426.6, 361.3) | P | P | P | P | - | P | P | P | P | - | - | - | P | T40,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I124 | T41: round tree at (400.8, 361.7) | P | P | L-14 | P | - | P | P | P | L-14 | - | - | - | P | T41,O,A | Merged/tangent pair; keep density, separate silhouettes. |
| I125 | T42: pine at (403.0, 351.4) | P | P | L-14 | P | - | P | P | P | L-14 | - | - | - | P | T42,O,A | Merged/tangent pair; keep density, separate silhouettes. |
| I126 | T43: round tree at (412.8, 369.7) | P | P | P | P | - | P | P | P | P | - | - | - | P | T43,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I127 | T44: round tree at (414.1, 351.9) | P | P | P | P | - | P | P | P | P | - | - | - | P | T44,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I128 | T45: round tree at (397.5, 403.9) | P | P | P | P | - | P | P | P | P | - | - | - | P | T45,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I129 | T46: pine at (422.9, 393.4) | P | P | P | P | - | P | P | P | P | - | - | - | P | T46,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I130 | T47: round tree at (399.1, 514.2) | P | P | P | P | - | P | P | P | P | - | - | - | P | T47,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I131 | T48: pine at (396.4, 544.8) | P | P | P | P | - | P | P | P | P | - | - | - | P | T48,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I132 | T49: pine at (376.2, 544.1) | P | P | P | P | - | P | P | P | P | - | - | - | P | T49,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I133 | T50: pine at (382.2, 532.6) | P | P | P | P | - | P | P | P | P | - | - | - | P | T50,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I134 | T51: pine at (387.3, 551.3) | P | P | P | P | - | P | P | P | P | - | - | - | P | T51,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I135 | T52: round tree at (405.5, 558.2) | P | P | P | P | - | P | P | P | P | - | - | - | P | T52,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I136 | T53: round tree at (372.1, 531.6) | P | P | P | P | - | P | P | P | P | - | - | - | P | T53,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I137 | T54: round tree at (384.6, 517.9) | P | P | P | P | - | P | P | P | P | - | - | - | P | T54,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I138 | T55: round tree at (393.0, 524.7) | P | P | P | P | - | P | P | P | P | - | - | - | P | T55,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I139 | T56: pine at (376.4, 777.1) | P | P | P | P | - | P | P | P | P | - | - | - | P | T56,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I140 | T57: round tree at (364.8, 780.7) | P | P | L-14 | P | - | P | P | P | L-14 | - | - | - | P | T57,O,A | Merged/tangent pair; keep density, separate silhouettes. |
| I141 | T58: pine at (393.8, 785.6) | P | P | P | P | - | P | P | P | P | - | - | - | P | T58,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I142 | T59: pine at (356.3, 774.1) | P | P | P | P | - | P | P | P | P | - | - | - | P | T59,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I143 | T60: pine at (367.7, 772.0) | P | P | L-14 | P | - | P | P | P | L-14 | - | - | - | P | T60,O,A | Merged/tangent pair; keep density, separate silhouettes. |
| I144 | T61: pine at (157.7, 500.9) | P | P | P | P | - | P | P | P | P | - | - | - | P | T61,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I145 | T62: pine at (172.5, 495.1) | P | P | P | P | - | P | P | P | P | - | - | - | P | T62,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I146 | T63: round tree at (210.4, 508.2) | P | P | P | P | - | P | P | P | P | - | - | - | P | T63,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I147 | T64: pine at (166.2, 506.9) | P | P | P | P | - | P | P | P | P | - | - | - | P | T64,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I148 | T65: round tree at (183.9, 507.4) | P | P | P | P | - | P | P | P | P | - | - | - | P | T65,O,A | Individual crown/stem legible; checked with immediate neighbours and in its grove. |
| I149 | Toronto: Rogers Centre dome | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O,L/x | Recognizable distinct height/profile in full drawing; final phone/tablet crop loses context. |
| I150 | Toronto: CN Tower (shaft, main pod, SkyPod, mast) | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O,L/x | Recognizable distinct height/profile in full drawing; final phone/tablet crop loses context. |
| I151 | Toronto: Royal Bank Plaza | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O,L/x | Recognizable distinct height/profile in full drawing; final phone/tablet crop loses context. |
| I152 | Toronto: Brookfield Place | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O,L/x | Recognizable distinct height/profile in full drawing; final phone/tablet crop loses context. |
| I153 | Toronto: TD Bank Tower | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O,L/x | Recognizable distinct height/profile in full drawing; final phone/tablet crop loses context. |
| I154 | Toronto: First Canadian Place | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O,L/x | Recognizable distinct height/profile in full drawing; final phone/tablet crop loses context. |
| I155 | Toronto: Commerce Court West | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O,L/x | Recognizable distinct height/profile in full drawing; final phone/tablet crop loses context. |
| I156 | Toronto: Scotia Plaza | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O,L/x | Recognizable distinct height/profile in full drawing; final phone/tablet crop loses context. |
| I157 | Toronto: Bay Adelaide Centre West | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O,L/x | Recognizable distinct height/profile in full drawing; final phone/tablet crop loses context. |
| I158 | Toronto: CIBC Square | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O,L/x | Recognizable distinct height/profile in full drawing; final phone/tablet crop loses context. |
| I159 | Toronto back-row building 1 (18.5) | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O | Quiet rear stroke provides depth without competing. |
| I160 | Toronto back-row building 2 (30.5) | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O | Quiet rear stroke provides depth without competing. |
| I161 | Toronto back-row building 3 (33.6) | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O | Quiet rear stroke provides depth without competing. |
| I162 | Toronto back-row building 4 (40.5) | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O | Quiet rear stroke provides depth without competing. |
| I163 | Toronto back-row building 5 (52) | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O | Quiet rear stroke provides depth without competing. |
| I164 | Toronto back-row building 6 (60.5) | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O | Quiet rear stroke provides depth without competing. |
| I165 | Toronto back-row building 7 (77) | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O | Quiet rear stroke provides depth without competing. |
| I166 | Toronto back-row building 8 (86) | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O | Quiet rear stroke provides depth without competing. |
| I167 | Toronto back-row building 9 (101) | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O | Quiet rear stroke provides depth without competing. |
| I168 | Toronto back-row building 10 (111) | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O | Quiet rear stroke provides depth without competing. |
| I169 | Toronto east low tower 1 (97) | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O | Small tower/facade consistent with the skyline. |
| I170 | Toronto east low tower 2 (102.4) | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O | Small tower/facade consistent with the skyline. |
| I171 | Toronto east low tower 3 (108.2) | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O | Small tower/facade consistent with the skyline. |
| I172 | Toronto baseline and water | P | P | P | P | - | P | P | P | L-4 | - | - | - | P | A/Toronto,O,L/x | Baseline unifies skyline; whole composition cropped at final narrow hold. |

### Yggdrasil and its living detail

| Row | Element/state | A | B | C | D | E | F | G | H | I | J | K | L | M | Evidence | Alone and in-context observation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I173 | Yggdrasil overall silhouette | P | P | L-3 | P | - | L-3 | P | P | P | - | - | - | P | Y,A,O | Strong roots/scale; diagram-like puff crown. |
| I174 | Main trunk and original fork | P | P | L-3 | P | - | P | P | P | P | - | - | - | P | Y,A | Useful mass; added boughs need unified joins. |
| I175 | Added limb/branch path 1 | P | P | L-3 | P | - | P | P | P | P | - | - | - | P | Y,A | Crossing/open-ended branch construction assessed in full canopy. |
| I176 | Added limb/branch path 2 | P | P | L-3 | P | - | P | P | P | P | - | - | - | P | Y,A | Crossing/open-ended branch construction assessed in full canopy. |
| I177 | Added limb/branch path 3 | P | P | L-3 | P | - | P | P | P | P | - | - | - | P | Y,A | Crossing/open-ended branch construction assessed in full canopy. |
| I178 | Added limb/branch path 4 | P | P | L-3 | P | - | P | P | P | P | - | - | - | P | Y,A | Crossing/open-ended branch construction assessed in full canopy. |
| I179 | Added limb/branch path 5 | P | P | L-3 | P | - | P | P | P | P | - | - | - | P | Y,A | Crossing/open-ended branch construction assessed in full canopy. |
| I180 | Added limb/branch path 6 | P | P | L-3 | P | - | P | P | P | P | - | - | - | P | Y,A | Crossing/open-ended branch construction assessed in full canopy. |
| I181 | Added limb/branch path 7 | P | P | L-3 | P | - | P | P | P | P | - | - | - | P | Y,A | Crossing/open-ended branch construction assessed in full canopy. |
| I182 | Added limb/branch path 8 | P | P | L-3 | P | - | P | P | P | P | - | - | - | P | Y,A | Crossing/open-ended branch construction assessed in full canopy. |
| I183 | Crown foliage mass 1, outline and hatch | P | P | L-3 | P | - | L-3 | P | P | P | - | - | - | P | Y,A,O | Mass isolation/scallops/hatch reinforce cloud-like canopy. |
| I184 | Crown foliage mass 2, outline and hatch | P | P | L-3 | P | - | L-3 | P | P | P | - | - | - | P | Y,A,O | Mass isolation/scallops/hatch reinforce cloud-like canopy. |
| I185 | Crown foliage mass 3, outline and hatch | P | P | L-3 | P | - | L-3 | P | P | P | - | - | - | P | Y,A,O | Mass isolation/scallops/hatch reinforce cloud-like canopy. |
| I186 | Crown foliage mass 4, outline and hatch | P | P | L-3 | P | - | L-3 | P | P | P | - | - | - | P | Y,A,O | Mass isolation/scallops/hatch reinforce cloud-like canopy. |
| I187 | Crown foliage mass 5, outline and hatch | P | P | L-3 | P | - | L-3 | P | P | P | - | - | - | P | Y,A,O | Mass isolation/scallops/hatch reinforce cloud-like canopy. |
| I188 | Root 1 | P | P | P | P | - | P | P | P | P | - | - | - | P | Y,A | Weight and outward taper support landmark; roots meet well in context. |
| I189 | Root 2 | P | P | P | P | - | P | P | P | P | - | - | - | P | Y,A | Weight and outward taper support landmark; roots meet well in context. |
| I190 | Root 3 | P | P | P | P | - | P | P | P | P | - | - | - | P | Y,A | Weight and outward taper support landmark; roots meet well in context. |
| I191 | Root 4 | P | P | P | P | - | P | P | P | P | - | - | - | P | Y,A | Weight and outward taper support landmark; roots meet well in context. |
| I192 | Root 5 | P | P | P | P | - | P | P | P | P | - | - | - | P | Y,A | Weight and outward taper support landmark; roots meet well in context. |
| I193 | Fine rootlets in well | P | P | P | P | - | P | P | P | P | - | - | - | P | Y,A | Fine endings avoid a solid black/white tangle; keep their delicacy. |
| I194 | Eagle body and wing silhouette | P | P | P | P | P | P | P | P | P | P | - | U | P | Y,A,Idle | Readable perched actor, wing stretch sampled. |
| I195 | Eagle horn-response flight | P | P | P | U | P | P | P | P | P | U | U | U | P | all-states/horn-sound | Wide response sampled; full close-up flight not frame-combed. |
| I196 | Ratatoskr and tail | P | P | P | P | P | P | P | P | P | P | - | U | P | Y,Idle | Squirrel profile readable; climb/return remains a small secondary beat. |
| I197 | Nidhogg and gnawing head | P | P | P | P | P | P | P | P | P | P | - | U | P | Y,Idle | Curled profile has a clear root relationship; subtle idle motion. |
| I198 | Well crown reward star batch 1 | P | P | P | P | P | P | P | P | P | P | - | U | P | Y/all3 | Stars brighten existing canopy; all centres geometrically inside foliage. |
| I199 | Well crown reward star batch 2 | P | P | P | P | P | P | P | P | P | P | - | U | P | Y/all3 | Stars brighten existing canopy; all centres geometrically inside foliage. |
| I200 | Well crown reward star batch 3 | P | P | P | P | P | P | P | P | P | P | - | U | P | Y/all3 | Stars brighten existing canopy; all centres geometrically inside foliage. |

### Map wording, regions and notes

| Row | Element/state | A | B | C | D | E | F | G | H | I | J | K | L | M | Evidence | Alone and in-context observation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I201 | Region: LAURIERVIK | P | P | P | P | - | L-5 | P | P | P | - | - | L-5 | P | O,D,F | Quiet region vocabulary belongs to the map; blanket focus fade weakens reading. |
| I202 | Rune line: lauriervik | P | P | P | P | - | P | P | P | P | - | - | - | P | O,D,F | Small secondary transliteration; decorative, not the only readable label. |
| I203 | Region: THE IRONWOOD | P | P | P | P | - | L-5 | P | P | P | - | - | L-5 | P | O,D,F | Quiet region vocabulary belongs to the map; blanket focus fade weakens reading. |
| I204 | Rune line: the ironwood | P | P | P | P | - | P | P | P | P | - | - | - | P | O,D,F | Small secondary transliteration; decorative, not the only readable label. |
| I205 | Region: MOHAWKFJELL | P | P | P | P | - | L-5 | P | P | P | - | - | L-5 | P | O,D,F | Quiet region vocabulary belongs to the map; blanket focus fade weakens reading. |
| I206 | Rune line: mohawkfjell | P | P | P | P | - | P | P | P | P | - | - | - | P | O,D,F | Small secondary transliteration; decorative, not the only readable label. |
| I207 | Region: THE MARGINS | P | P | P | P | - | L-5 | P | P | P | - | - | L-5 | P | O,D,F | Quiet region vocabulary belongs to the map; blanket focus fade weakens reading. |
| I208 | Region: KERNING NARROWS | P | P | P | P | - | L-5 | P | P | P | - | - | L-5 | P | O,D,F | Quiet region vocabulary belongs to the map; blanket focus fade weakens reading. |
| I209 | Region: LENNARDGARD | P | P | P | P | - | L-5 | P | P | P | - | - | L-5 | P | O,D,F | Quiet region vocabulary belongs to the map; blanket focus fade weakens reading. |
| I210 | Rune line: lennardgard | P | P | P | P | - | P | P | P | P | - | - | - | P | O,D,F | Small secondary transliteration; decorative, not the only readable label. |
| I211 | Region: HERE BE DEADLINES | P | P | P | P | - | L-5 | P | P | P | - | - | L-5 | P | O,D,F | Quiet region vocabulary belongs to the map; blanket focus fade weakens reading. |
| I212 | Aside: the diploma climb | P | P | P | P | - | L-5 | P | P | P | - | - | L-5 | P | O,D,Y | On-theme aside, with a quieter hierarchy; focused text has low contrast. |
| I213 | Aside: the mist of 2020 | P | P | P | P | - | L-5 | P | P | P | - | - | L-5 | P | O,D,Y | On-theme aside, with a quieter hierarchy; focused text has low contrast. |
| I214 | Aside: left intentionally blank | P | P | P | P | - | L-5 | P | P | P | - | - | L-5 | P | O,D,Y | On-theme aside, with a quieter hierarchy; focused text has low contrast. |
| I215 | Aside: the 2023 crossing | P | P | P | P | - | L-5 | P | P | P | - | - | L-5 | P | O,D,Y | On-theme aside, with a quieter hierarchy; focused text has low contrast. |
| I216 | Aside: the road not taken: game dev | P | P | P | P | - | L-5 | P | P | P | - | - | L-5 | P | O,D,Y | On-theme aside, with a quieter hierarchy; focused text has low contrast. |
| I217 | SEA OF REVISIONS label | P | P | P | P | - | L-5 | P | P | P | - | - | L-5 | P | Y,O,D | Active landmark labels especially should survive focus dimming. |
| I218 | YGGDRASIL label | P | P | P | P | - | L-5 | P | P | P | - | - | L-5 | P | Y,O,D | Active landmark labels especially should survive focus dimming. |
| I219 | URD'S WELL label | P | P | P | P | - | L-5 | P | P | P | - | - | L-5 | P | Y,O,D | Active landmark labels especially should survive focus dimming. |
| I220 | was, is, shall be label | P | P | P | P | - | L-5 | P | P | P | - | - | L-5 | P | Y,O,D | Active landmark labels especially should survive focus dimming. |

### Atmosphere and journey motion

| Row | Element/state | A | B | C | D | E | F | G | H | I | J | K | L | M | Evidence | Alone and in-context observation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I221 | Sky cloud 01: variant 3, world (-150, 150) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I222 | Sky cloud 02: variant 1, world (-250, 520) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I223 | Sky cloud 03: variant 2, world (-90, 800) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I224 | Sky cloud 04: variant 1, world (760, 110) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I225 | Sky cloud 05: variant 3, world (860, 430) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I226 | Sky cloud 06: variant 2, world (720, 760) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I227 | Sky cloud 07: variant 2, world (30, 330) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I228 | Sky cloud 08: variant 2, world (575, 690) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I229 | Sky cloud 09: variant 3, world (300, -30) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I230 | Sky cloud 10: variant 1, world (330, 935) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I231 | Sky cloud 11: variant 2, world (-62, 150) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I232 | Sky cloud 12: variant 1, world (-96, 300) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I233 | Sky cloud 13: variant 2, world (-58, 452) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I234 | Sky cloud 14: variant 3, world (-104, 610) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I235 | Sky cloud 15: variant 1, world (-64, 770) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I236 | Sky cloud 16: variant 1, world (662, 120) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I237 | Sky cloud 17: variant 2, world (700, 270) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I238 | Sky cloud 18: variant 3, world (668, 420) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I239 | Sky cloud 19: variant 2, world (706, 570) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I240 | Sky cloud 20: variant 1, world (666, 730) | P | P | P | P | - | P | P | P | P | U | - | - | P | O,W,H,Idle | Shared contour variant checked alone in frame enlargements; placement sampled at overview/hand-over. Some large-cloud edges intentionally leave viewport. |
| I241 | Depth raven 1 | P | P | P | P | - | P | P | P | P | U | - | - | P | W/moves,source depth.mjs | Crossing silhouette supports depth; no new defect in sampled motion. |
| I242 | Depth raven 2 | P | P | P | P | - | P | P | P | P | U | - | - | P | W/moves,source depth.mjs | Crossing silhouette supports depth; no new defect in sampled motion. |
| I243 | Depth cloud deck | P | P | P | P | P | P | P | P | P | U | U | U | P | W,H,D,Idle | Observed within hand-over/glides; non-scaling strokes preserve line weight. |
| I244 | Map mist atmosphere | P | P | P | P | P | P | P | P | P | U | U | U | P | W,H,D,Idle | Observed within hand-over/glides; non-scaling strokes preserve line weight. |
| I245 | Sea sparkle/stars | P | P | P | P | P | P | P | P | P | U | U | U | P | W,H,D,Idle | Observed within hand-over/glides; non-scaling strokes preserve line weight. |
| I246 | Trail stars before travel | P | P | P | P | P | P | P | P | P | U | U | U | P | W,H,D,Idle | Observed within hand-over/glides; non-scaling strokes preserve line weight. |
| I247 | Coast stars during draw-on | P | P | P | P | P | P | P | P | P | U | U | U | P | W,H,D,Idle | Observed within hand-over/glides; non-scaling strokes preserve line weight. |
| I248 | Traveller red star | P | P | P | P | P | P | P | P | P | U | U | U | P | W,H,D,Idle | Observed within hand-over/glides; non-scaling strokes preserve line weight. |
| I249 | Traveller halo/light | P | P | P | P | P | P | P | P | P | U | U | U | P | W,H,D,Idle | Observed within hand-over/glides; non-scaling strokes preserve line weight. |
| I250 | Travelled solid trail | P | P | P | P | P | P | P | P | P | U | U | U | P | W,H,D,Idle | Observed within hand-over/glides; non-scaling strokes preserve line weight. |
| I251 | Future dotted trail | P | P | P | P | P | P | P | P | P | U | U | U | P | W,H,D,Idle | Observed within hand-over/glides; non-scaling strokes preserve line weight. |
| I252 | Traveller boarding ship | P | P | P | P | P | P | P | P | P | U | U | U | P | W,H,D,Idle | Observed within hand-over/glides; non-scaling strokes preserve line weight. |
| I253 | Traveller leaving ship | P | P | P | P | P | P | P | P | P | U | U | U | P | W,H,D,Idle | Observed within hand-over/glides; non-scaling strokes preserve line weight. |
| I254 | Map-to-Laurier glide | P | P | P | P | P | P | P | P | P | P | U | U | P | W,Rev | Continuous position in sampled strips; rotation restores settled layout. No frame-rate certification. |
| I255 | Laurier-to-HMC glide | P | P | P | P | P | P | P | P | P | P | U | U | P | W,Rev | Continuous position in sampled strips; rotation restores settled layout. No frame-rate certification. |
| I256 | HMC-to-Mohawk glide | P | P | P | P | P | P | P | P | P | P | U | U | P | W,Rev | Continuous position in sampled strips; rotation restores settled layout. No frame-rate certification. |
| I257 | Mohawk-to-HMC-again glide | P | P | P | P | P | P | P | P | P | P | U | U | P | W,Rev | Continuous position in sampled strips; rotation restores settled layout. No frame-rate certification. |
| I258 | HMC-again-to-Interkom glide | P | P | P | P | P | P | P | P | P | P | U | U | P | W,Rev | Continuous position in sampled strips; rotation restores settled layout. No frame-rate certification. |
| I259 | Interkom-to-Lennard crossing | P | P | P | P | P | P | P | P | P | P | U | U | P | W,Rev | Continuous position in sampled strips; rotation restores settled layout. No frame-rate certification. |
| I260 | Lennard-to-X glide | P | P | P | P | P | P | P | P | P | P | U | U | P | W,Rev | Continuous position in sampled strips; rotation restores settled layout. No frame-rate certification. |
| I261 | Back during glide | P | P | P | P | P | P | P | P | P | P | U | U | P | W,Rev | Continuous position in sampled strips; rotation restores settled layout. No frame-rate certification. |
| I262 | Repeated Next/hurry | P | P | P | P | P | P | P | P | P | P | U | U | P | W,Rev | Continuous position in sampled strips; rotation restores settled layout. No frame-rate certification. |
| I263 | Rotation during a glide | P | P | P | P | P | P | P | P | L-7 | P | U | U | P | W,Rev | Continuous position in sampled strips; rotation restores settled layout. No frame-rate certification. |

### Every stop, card field and control

| Row | Element/state | A | B | C | D | E | F | G | H | I | J | K | L | M | Evidence | Alone and in-context observation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I264 | Laurier shield: unvisited | P | P | P | P | P | P | P | K2 | L-12 | U | U | L-12 | P | O,Cards/laurier | Small shield silhouette; full-palette revision already known. |
| I265 | Laurier shield: visited/lit | P | P | P | P | P | P | P | K2 | L-12 | U | U | L-12 | P | D,Cards/laurier | Quarter fill differentiates visit; full brand palette known. |
| I266 | Laurier map name | P | P | P | P | - | L-2/L-7 | P | P | L-7 | - | - | P | P | O,D,W | Readable floor at required portrait sizes; hidden in wayfinder result; landscape crowding. |
| I267 | Laurier map dates/role sub-line | P | P | P | P | - | L-2 | P | P | P | - | - | P | P | D,W | Agrees with card; secondary tier reveals at zoom. |
| I268 | Laurier card: opening/open/closing container | P | K1 | P | P | P | P | K1 | P | K4 | U | U | U | P | Cards/laurier,W | Retained colored panel; source-to-shield belonging issue excluded. |
| I269 | Laurier logo | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/laurier | Proportions retained; correct light/dark field. |
| I270 | Laurier date pill: 2016 to 2017 | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/laurier | Dates agree with source/card/timeline. |
| I271 | Laurier headline | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/laurier | One clear Outfit headline. |
| I272 | Laurier role line | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/laurier | Clear supporting role. |
| I273 | Laurier paragraph | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/laurier | Legible first-person career summary; no invented fact identified. |
| I274 | Laurier WHAT I TOOK WITH ME kicker | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/laurier | Consistent small-cap hierarchy. |
| I275 | Laurier takeaway line | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/laurier | Clear emphasis beneath body. |
| I276 | Laurier piece frame/image | P | P | P | P | - | P | P | P | K4 | - | - | P | P | Cards/laurier | Real HMC image preserved; missing-piece content is exempt. |
| I277 | Laurier piece caption | P | P | P | P | - | P | P | P | K4 | - | - | P | P | Cards/laurier | HMC caption agrees with image; absent captions not invented. |
| I278 | Laurier craft stripe/label: Print | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/laurier | Lit/dim state checked against source crafts; consistent ordering. |
| I279 | Laurier craft stripe/label: Video | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/laurier | Lit/dim state checked against source crafts; consistent ordering. |
| I280 | Laurier craft stripe/label: Motion | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/laurier | Lit/dim state checked against source crafts; consistent ordering. |
| I281 | Laurier craft stripe/label: Screen | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/laurier | Lit/dim state checked against source crafts; consistent ordering. |
| I282 | Laurier See the case study button | P | P | P | P | K10 | P | P | P | L-12 | U | U | L-12 | P | Cards/laurier | Explicitly inert prototype; target height below requested floor. |
| I283 | Laurier close X: open/moving/closed | P | P | P | P | P | P | K3 | P | P | P | U | P | P | Cards/laurier,D/card-closed | 44 px target; known request to make it belong to card retained as excluded. |
| I284 | HMC summers shield: unvisited | P | P | P | P | P | P | P | K2 | L-12 | U | U | L-12 | P | O,Cards/hmc1 | Small shield silhouette; full-palette revision already known. |
| I285 | HMC summers shield: visited/lit | P | P | P | P | P | P | P | K2 | L-12 | U | U | L-12 | P | D,Cards/hmc1 | Quarter fill differentiates visit; full brand palette known. |
| I286 | HMC summers map name | P | P | P | P | - | L-2/L-7 | P | P | L-7 | - | - | P | P | O,D,W | Readable floor at required portrait sizes; hidden in wayfinder result; landscape crowding. |
| I287 | HMC summers map dates/role sub-line | P | P | P | P | - | L-2 | P | P | P | - | - | P | P | D,W | Agrees with card; secondary tier reveals at zoom. |
| I288 | HMC summers card: opening/open/closing container | P | K1 | P | P | P | P | K1 | P | K4 | U | U | U | P | Cards/hmc1,W | Retained colored panel; source-to-shield belonging issue excluded. |
| I289 | HMC summers logo | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc1 | Proportions retained; correct light/dark field. |
| I290 | HMC summers date pill: Summers 2018 and 2020 | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc1 | Dates agree with source/card/timeline. |
| I291 | HMC summers headline | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc1 | One clear Outfit headline. |
| I292 | HMC summers role line | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc1 | Clear supporting role. |
| I293 | HMC summers paragraph | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc1 | Legible first-person career summary; no invented fact identified. |
| I294 | HMC summers WHAT I TOOK WITH ME kicker | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc1 | Consistent small-cap hierarchy. |
| I295 | HMC summers takeaway line | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc1 | Clear emphasis beneath body. |
| I296 | HMC summers piece frame/image | P | P | P | P | - | P | P | P | K4 | - | - | P | P | Cards/hmc1 | Real HMC image preserved; missing-piece content is exempt. |
| I297 | HMC summers piece caption | P | P | P | P | - | P | P | P | K4 | - | - | P | P | Cards/hmc1 | HMC caption agrees with image; absent captions not invented. |
| I298 | HMC summers craft stripe/label: Print | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc1 | Lit/dim state checked against source crafts; consistent ordering. |
| I299 | HMC summers craft stripe/label: Video | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc1 | Lit/dim state checked against source crafts; consistent ordering. |
| I300 | HMC summers craft stripe/label: Motion | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc1 | Lit/dim state checked against source crafts; consistent ordering. |
| I301 | HMC summers craft stripe/label: Screen | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc1 | Lit/dim state checked against source crafts; consistent ordering. |
| I302 | HMC summers See the case study button | P | P | P | P | K10 | P | P | P | L-12 | U | U | L-12 | P | Cards/hmc1 | Explicitly inert prototype; target height below requested floor. |
| I303 | HMC summers close X: open/moving/closed | P | P | P | P | P | P | K3 | P | P | P | U | P | P | Cards/hmc1,D/card-closed | 44 px target; known request to make it belong to card retained as excluded. |
| I304 | Mohawk shield: unvisited | P | P | P | P | P | P | P | K2 | L-12 | U | U | L-12 | P | O,Cards/mohawk | Small shield silhouette; full-palette revision already known. |
| I305 | Mohawk shield: visited/lit | P | P | P | P | P | P | P | K2 | L-12 | U | U | L-12 | P | D,Cards/mohawk | Quarter fill differentiates visit; full brand palette known. |
| I306 | Mohawk map name | P | P | P | P | - | L-2/L-7 | P | P | L-7 | - | - | P | P | O,D,W | Readable floor at required portrait sizes; hidden in wayfinder result; landscape crowding. |
| I307 | Mohawk map dates/role sub-line | P | P | P | P | - | L-2 | P | P | P | - | - | P | P | D,W | Agrees with card; secondary tier reveals at zoom. |
| I308 | Mohawk card: opening/open/closing container | P | K1 | P | P | P | P | K1 | P | K4 | U | U | U | P | Cards/mohawk,W | Retained colored panel; source-to-shield belonging issue excluded. |
| I309 | Mohawk logo | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/mohawk | Proportions retained; correct light/dark field. |
| I310 | Mohawk date pill: 2019 to 2021 | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/mohawk | Dates agree with source/card/timeline. |
| I311 | Mohawk headline | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/mohawk | One clear Outfit headline. |
| I312 | Mohawk role line | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/mohawk | Clear supporting role. |
| I313 | Mohawk paragraph | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/mohawk | Legible first-person career summary; no invented fact identified. |
| I314 | Mohawk WHAT I TOOK WITH ME kicker | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/mohawk | Consistent small-cap hierarchy. |
| I315 | Mohawk takeaway line | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/mohawk | Clear emphasis beneath body. |
| I316 | Mohawk piece frame/image | P | P | P | P | - | P | P | P | K4 | - | - | P | P | Cards/mohawk | Real HMC image preserved; missing-piece content is exempt. |
| I317 | Mohawk piece caption | P | P | P | P | - | P | P | P | K4 | - | - | P | P | Cards/mohawk | HMC caption agrees with image; absent captions not invented. |
| I318 | Mohawk craft stripe/label: Print | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/mohawk | Lit/dim state checked against source crafts; consistent ordering. |
| I319 | Mohawk craft stripe/label: Video | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/mohawk | Lit/dim state checked against source crafts; consistent ordering. |
| I320 | Mohawk craft stripe/label: Motion | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/mohawk | Lit/dim state checked against source crafts; consistent ordering. |
| I321 | Mohawk craft stripe/label: Screen | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/mohawk | Lit/dim state checked against source crafts; consistent ordering. |
| I322 | Mohawk See the case study button | P | P | P | P | K10 | P | P | P | L-12 | U | U | L-12 | P | Cards/mohawk | Explicitly inert prototype; target height below requested floor. |
| I323 | Mohawk close X: open/moving/closed | P | P | P | P | P | P | K3 | P | P | P | U | P | P | Cards/mohawk,D/card-closed | 44 px target; known request to make it belong to card retained as excluded. |
| I324 | HMC again shield: unvisited | P | P | P | P | P | P | P | K2 | L-12 | U | U | L-12 | P | O,Cards/hmc2 | Small shield silhouette; full-palette revision already known. |
| I325 | HMC again shield: visited/lit | P | P | P | P | P | P | P | K2 | L-12 | U | U | L-12 | P | D,Cards/hmc2 | Quarter fill differentiates visit; full brand palette known. |
| I326 | HMC again map name | P | P | P | P | - | L-2/L-7 | P | P | L-7 | - | - | P | P | O,D,W | Readable floor at required portrait sizes; hidden in wayfinder result; landscape crowding. |
| I327 | HMC again map dates/role sub-line | P | P | P | P | - | L-2 | P | P | P | - | - | P | P | D,W | Agrees with card; secondary tier reveals at zoom. |
| I328 | HMC again card: opening/open/closing container | P | K1 | P | P | P | P | K1 | P | K4 | U | U | U | P | Cards/hmc2,W | Retained colored panel; source-to-shield belonging issue excluded. |
| I329 | HMC again logo | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc2 | Proportions retained; correct light/dark field. |
| I330 | HMC again date pill: 2021 to 2022 | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc2 | Dates agree with source/card/timeline. |
| I331 | HMC again headline | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc2 | One clear Outfit headline. |
| I332 | HMC again role line | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc2 | Clear supporting role. |
| I333 | HMC again paragraph | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc2 | Legible first-person career summary; no invented fact identified. |
| I334 | HMC again WHAT I TOOK WITH ME kicker | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc2 | Consistent small-cap hierarchy. |
| I335 | HMC again takeaway line | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc2 | Clear emphasis beneath body. |
| I336 | HMC again piece frame/image | P | P | P | P | - | P | P | P | K4 | - | - | P | P | Cards/hmc2 | Real HMC image preserved; missing-piece content is exempt. |
| I337 | HMC again piece caption | P | P | P | P | - | P | P | P | K4 | - | - | P | P | Cards/hmc2 | HMC caption agrees with image; absent captions not invented. |
| I338 | HMC again craft stripe/label: Print | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc2 | Lit/dim state checked against source crafts; consistent ordering. |
| I339 | HMC again craft stripe/label: Video | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc2 | Lit/dim state checked against source crafts; consistent ordering. |
| I340 | HMC again craft stripe/label: Motion | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc2 | Lit/dim state checked against source crafts; consistent ordering. |
| I341 | HMC again craft stripe/label: Screen | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/hmc2 | Lit/dim state checked against source crafts; consistent ordering. |
| I342 | HMC again See the case study button | P | P | P | P | K10 | P | P | P | L-12 | U | U | L-12 | P | Cards/hmc2 | Explicitly inert prototype; target height below requested floor. |
| I343 | HMC again close X: open/moving/closed | P | P | P | P | P | P | K3 | P | P | P | U | P | P | Cards/hmc2,D/card-closed | 44 px target; known request to make it belong to card retained as excluded. |
| I344 | Interkom shield: unvisited | P | P | P | P | P | P | P | K2 | L-12 | U | U | L-12 | P | O,Cards/interkom | Small shield silhouette; full-palette revision already known. |
| I345 | Interkom shield: visited/lit | P | P | P | P | P | P | P | K2 | L-12 | U | U | L-12 | P | D,Cards/interkom | Quarter fill differentiates visit; full brand palette known. |
| I346 | Interkom map name | P | P | P | P | - | L-2/L-7 | P | P | L-7 | - | - | P | P | O,D,W | Readable floor at required portrait sizes; hidden in wayfinder result; landscape crowding. |
| I347 | Interkom map dates/role sub-line | P | P | P | P | - | L-2 | P | P | P | - | - | P | P | D,W | Agrees with card; secondary tier reveals at zoom. |
| I348 | Interkom card: opening/open/closing container | P | K1 | P | P | P | P | K1 | P | K4 | U | U | U | P | Cards/interkom,W | Retained colored panel; source-to-shield belonging issue excluded. |
| I349 | Interkom logo | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/interkom | Proportions retained; correct light/dark field. |
| I350 | Interkom date pill: Autumn 2022 | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/interkom | Dates agree with source/card/timeline. |
| I351 | Interkom headline | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/interkom | One clear Outfit headline. |
| I352 | Interkom role line | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/interkom | Clear supporting role. |
| I353 | Interkom paragraph | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/interkom | Legible first-person career summary; no invented fact identified. |
| I354 | Interkom WHAT I TOOK WITH ME kicker | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/interkom | Consistent small-cap hierarchy. |
| I355 | Interkom takeaway line | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/interkom | Clear emphasis beneath body. |
| I356 | Interkom piece frame/image | P | P | P | P | - | P | P | P | K4 | - | - | P | P | Cards/interkom | Real HMC image preserved; missing-piece content is exempt. |
| I357 | Interkom piece caption | P | P | P | P | - | P | P | P | K4 | - | - | P | P | Cards/interkom | HMC caption agrees with image; absent captions not invented. |
| I358 | Interkom craft stripe/label: Print | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/interkom | Lit/dim state checked against source crafts; consistent ordering. |
| I359 | Interkom craft stripe/label: Video | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/interkom | Lit/dim state checked against source crafts; consistent ordering. |
| I360 | Interkom craft stripe/label: Motion | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/interkom | Lit/dim state checked against source crafts; consistent ordering. |
| I361 | Interkom craft stripe/label: Screen | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/interkom | Lit/dim state checked against source crafts; consistent ordering. |
| I362 | Interkom See the case study button | P | P | P | P | K10 | P | P | P | L-12 | U | U | L-12 | P | Cards/interkom | Explicitly inert prototype; target height below requested floor. |
| I363 | Interkom close X: open/moving/closed | P | P | P | P | P | P | K3 | P | P | P | U | P | P | Cards/interkom,D/card-closed | 44 px target; known request to make it belong to card retained as excluded. |
| I364 | Lennard shield: unvisited | P | P | P | P | P | P | P | K2 | L-12 | U | U | L-12 | P | O,Cards/lennard | Small shield silhouette; full-palette revision already known. |
| I365 | Lennard shield: visited/lit | P | P | P | P | P | P | P | K2 | L-12 | U | U | L-12 | P | D,Cards/lennard | Quarter fill differentiates visit; full brand palette known. |
| I366 | Lennard map name | P | P | P | P | - | L-2/L-7 | P | P | L-7 | - | - | P | P | O,D,W | Readable floor at required portrait sizes; hidden in wayfinder result; landscape crowding. |
| I367 | Lennard map dates/role sub-line | P | P | P | P | - | L-2 | P | P | P | - | - | P | P | D,W | Agrees with card; secondary tier reveals at zoom. |
| I368 | Lennard card: opening/open/closing container | P | K1 | P | P | P | P | K1 | P | K4 | U | U | U | P | Cards/lennard,W | Retained colored panel; source-to-shield belonging issue excluded. |
| I369 | Lennard logo | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/lennard | Proportions retained; correct light/dark field. |
| I370 | Lennard date pill: 2023 to now | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/lennard | Dates agree with source/card/timeline. |
| I371 | Lennard headline | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/lennard | One clear Outfit headline. |
| I372 | Lennard role line | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/lennard | Clear supporting role. |
| I373 | Lennard paragraph | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/lennard | Legible first-person career summary; no invented fact identified. |
| I374 | Lennard WHAT I TOOK WITH ME kicker | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/lennard | Consistent small-cap hierarchy. |
| I375 | Lennard takeaway line | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/lennard | Clear emphasis beneath body. |
| I376 | Lennard piece frame/image | P | P | P | P | - | P | P | P | K4 | - | - | P | P | Cards/lennard | Real HMC image preserved; missing-piece content is exempt. |
| I377 | Lennard piece caption | P | P | P | P | - | P | P | P | K4 | - | - | P | P | Cards/lennard | HMC caption agrees with image; absent captions not invented. |
| I378 | Lennard progression: Freelance 2023 | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/lennard | Dates and increasing responsibility agree. |
| I379 | Lennard progression: Junior 2024 | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/lennard | Dates and increasing responsibility agree. |
| I380 | Lennard progression: Graphic designer 2025 | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/lennard | Dates and increasing responsibility agree. |
| I381 | Lennard white content panel on orange | P | P | P | P | - | P | P | P | P | - | - | - | P | Cards/lennard | Warm Gray text on white is readable; preserves client orange field. |
| I382 | Lennard craft stripe/label: Print | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/lennard | Lit/dim state checked against source crafts; consistent ordering. |
| I383 | Lennard craft stripe/label: Video | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/lennard | Lit/dim state checked against source crafts; consistent ordering. |
| I384 | Lennard craft stripe/label: Motion | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/lennard | Lit/dim state checked against source crafts; consistent ordering. |
| I385 | Lennard craft stripe/label: Screen | P | P | P | P | - | P | P | P | P | - | - | P | P | Cards/lennard | Lit/dim state checked against source crafts; consistent ordering. |
| I386 | Lennard See the case study button | P | P | P | P | K10 | P | P | P | L-12 | U | U | L-12 | P | Cards/lennard | Explicitly inert prototype; target height below requested floor. |
| I387 | Lennard close X: open/moving/closed | P | P | P | P | P | P | K3 | P | P | P | U | P | P | Cards/lennard,D/card-closed | 44 px target; known request to make it belong to card retained as excluded. |

### Main navigation, mini-map and timeline

| Row | Element/state | A | B | C | D | E | F | G | H | I | J | K | L | M | Evidence | Alone and in-context observation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I388 | Back at overview | P | P | P | P | P | P | P | P | P | P | U | P | P | W,D,F | Clear forward/back words; adequate principal target sizes. |
| I389 | Set out | P | P | P | P | P | P | P | P | P | P | U | P | P | W,D,F | Clear forward/back words; adequate principal target sizes. |
| I390 | Next: HMC Connections | P | P | P | P | P | P | P | P | P | P | U | P | P | W,D,F | Clear forward/back words; adequate principal target sizes. |
| I391 | Next: Mohawk | P | P | P | P | P | P | P | P | P | P | U | P | P | W,D,F | Clear forward/back words; adequate principal target sizes. |
| I392 | Next: HMC, again | P | P | P | P | P | P | P | P | P | P | U | P | P | W,D,F | Clear forward/back words; adequate principal target sizes. |
| I393 | Next: Interkom | P | P | P | P | P | P | P | P | P | P | U | P | P | W,D,F | Clear forward/back words; adequate principal target sizes. |
| I394 | Next: Lennard | P | P | P | P | P | P | P | P | P | P | U | P | P | W,D,F | Clear forward/back words; adequate principal target sizes. |
| I395 | Next: the X | P | P | P | P | P | P | P | P | P | P | U | P | P | W,D,F | Clear forward/back words; adequate principal target sizes. |
| I396 | Dig here | P | P | P | P | P | P | P | P | P | P | U | P | P | W,D,F | Clear forward/back words; adequate principal target sizes. |
| I397 | Back to the trail | P | P | P | P | P | P | P | P | P | P | U | P | P | W,D,F | Clear forward/back words; adequate principal target sizes. |
| I398 | Step progress fill and arrow | P | P | P | P | P | P | P | P | P | P | U | U | P | W,Rev | Progress acknowledges movement; stays in the same control. |
| I399 | Preview-only label | P | P | P | P | - | P | P | P | P | - | - | P | P | W,D | Preview existence is excluded from findings. |
| I400 | Depth review switch | P | P | P | P | P | P | P | P | P | U | U | U | P | W,D | Preview switch present; not treated as product-navigation defect. |
| I401 | Mini-map coasts | P | P | P | P | - | P | P | P | P | - | - | - | P | D,W,Focus | Compact orientation reference stays coherent with camera. |
| I402 | Mini-map trail | P | P | P | P | - | P | P | P | P | - | - | - | P | D,W,Focus | Compact orientation reference stays coherent with camera. |
| I403 | Mini-map traveller | P | P | P | P | - | P | P | P | P | - | - | - | P | D,W,Focus | Compact orientation reference stays coherent with camera. |
| I404 | Mini-map camera rectangle | P | P | P | P | - | P | P | P | P | - | - | - | P | D,W,Focus | Compact orientation reference stays coherent with camera. |
| I405 | Mini-map stop: Laurier | P | P | P | P | P | P | P | K2 | L-12 | U | U | L-12 | P | D,Focus | Accessible name includes place/date; 24 px target. |
| I406 | Mini-map stop: HMC summers | P | P | P | P | P | P | P | K2 | L-12 | U | U | L-12 | P | D,Focus | Accessible name includes place/date; 24 px target. |
| I407 | Mini-map stop: Mohawk | P | P | P | P | P | P | P | K2 | L-12 | U | U | L-12 | P | D,Focus | Accessible name includes place/date; 24 px target. |
| I408 | Mini-map stop: HMC again | P | P | P | P | P | P | P | K2 | L-12 | U | U | L-12 | P | D,Focus | Accessible name includes place/date; 24 px target. |
| I409 | Mini-map stop: Interkom | P | P | P | P | P | P | P | K2 | L-12 | U | U | L-12 | P | D,Focus | Accessible name includes place/date; 24 px target. |
| I410 | Mini-map stop: Lennard | P | P | P | P | P | P | P | K2 | L-12 | U | U | L-12 | P | D,Focus | Accessible name includes place/date; 24 px target. |
| I411 | Timeline base/ruler | P | P | P | P | P | P | P | P | L-6 | L-6 | U | U | P | D,W,C,RM | Two tracks preserve real overlap; narrow reduced-motion range fails. |
| I412 | Timeline school row | P | P | P | P | P | P | P | P | L-6 | L-6 | U | U | P | D,W,C,RM | Two tracks preserve real overlap; narrow reduced-motion range fails. |
| I413 | Timeline work row | P | P | P | P | P | P | P | P | L-6 | L-6 | U | U | P | D,W,C,RM | Two tracks preserve real overlap; narrow reduced-motion range fails. |
| I414 | Timeline playhead | P | P | P | P | P | P | P | P | L-6 | L-6 | U | U | P | D,W,C,RM | Two tracks preserve real overlap; narrow reduced-motion range fails. |
| I415 | Timeline count (0 to 11) | P | P | P | P | P | P | P | P | L-6 | L-6 | U | U | P | D,W,C,RM | Two tracks preserve real overlap; narrow reduced-motion range fails. |
| I416 | Timeline all-found count | P | P | P | P | P | P | P | P | L-6 | L-6 | U | U | P | D,W,C,RM | Two tracks preserve real overlap; narrow reduced-motion range fails. |
| I417 | Timeline year tick 2016 | P | P | P | P | - | P | P | P | P | - | - | P | P | L,W,RM | Consistent abbreviated year; later years inaccessible in narrow RM menu. |
| I418 | Timeline year tick 2017 | P | P | P | P | - | P | P | P | P | - | - | P | P | L,W,RM | Consistent abbreviated year; later years inaccessible in narrow RM menu. |
| I419 | Timeline year tick 2018 | P | P | P | P | - | P | P | P | P | - | - | P | P | L,W,RM | Consistent abbreviated year; later years inaccessible in narrow RM menu. |
| I420 | Timeline year tick 2019 | P | P | P | P | - | P | P | P | P | - | - | P | P | L,W,RM | Consistent abbreviated year; later years inaccessible in narrow RM menu. |
| I421 | Timeline year tick 2020 | P | P | P | P | - | P | P | P | P | - | - | P | P | L,W,RM | Consistent abbreviated year; later years inaccessible in narrow RM menu. |
| I422 | Timeline year tick 2021 | P | P | P | P | - | P | P | P | L-6 | - | - | P | P | L,W,RM | Consistent abbreviated year; later years inaccessible in narrow RM menu. |
| I423 | Timeline year tick 2022 | P | P | P | P | - | P | P | P | L-6 | - | - | P | P | L,W,RM | Consistent abbreviated year; later years inaccessible in narrow RM menu. |
| I424 | Timeline year tick 2023 | P | P | P | P | - | P | P | P | L-6 | - | - | P | P | L,W,RM | Consistent abbreviated year; later years inaccessible in narrow RM menu. |
| I425 | Timeline year tick 2024 | P | P | P | P | - | P | P | P | L-6 | - | - | P | P | L,W,RM | Consistent abbreviated year; later years inaccessible in narrow RM menu. |
| I426 | Timeline year tick 2025 | P | P | P | P | - | P | P | P | L-6 | - | - | P | P | L,W,RM | Consistent abbreviated year; later years inaccessible in narrow RM menu. |
| I427 | Timeline year tick 2026 | P | P | P | P | - | P | P | P | L-6 | - | - | P | P | L,W,RM | Consistent abbreviated year; later years inaccessible in narrow RM menu. |
| I428 | Timeline block: Laurier 2016-2017 | P | P | P | P | P | P | P | K2 | L-6/L-12 | L-6 | U | U | P | L,W,RM | Span/order matches supplied career data; meaningful color after visit. |
| I429 | Timeline block: HMC summer 2018 | P | P | P | P | P | P | P | K2 | L-6/L-12 | L-6 | U | U | P | L,W,RM | Span/order matches supplied career data; meaningful color after visit. |
| I430 | Timeline block: HMC summer 2020 | P | P | P | P | P | P | P | K2 | L-6/L-12 | L-6 | U | U | P | L,W,RM | Span/order matches supplied career data; meaningful color after visit. |
| I431 | Timeline block: Mohawk 2019-2021 | P | P | P | P | P | P | P | K2 | L-6/L-12 | L-6 | U | U | P | L,W,RM | Span/order matches supplied career data; meaningful color after visit. |
| I432 | Timeline block: HMC contract 2021-2022 | P | P | P | P | P | P | P | K2 | L-6/L-12 | L-6 | U | U | P | L,W,RM | Span/order matches supplied career data; meaningful color after visit. |
| I433 | Timeline block: Interkom autumn 2022 | P | P | P | P | P | P | P | K2 | L-6/L-12 | L-6 | U | U | P | L,W,RM | Span/order matches supplied career data; meaningful color after visit. |
| I434 | Timeline block: Lennard freelance 2023-2024 | P | P | P | P | P | P | P | K2 | L-6/L-12 | L-6 | U | U | P | L,W,RM | Span/order matches supplied career data; meaningful color after visit. |
| I435 | Timeline block: Lennard junior 2024-2025 | P | P | P | P | P | P | P | K2 | L-6/L-12 | L-6 | U | U | P | L,W,RM | Span/order matches supplied career data; meaningful color after visit. |
| I436 | Timeline block: Lennard graphic designer 2025-now | P | P | P | P | P | P | P | K2 | L-6/L-12 | L-6 | U | U | P | L,W,RM | Span/order matches supplied career data; meaningful color after visit. |
| I437 | Timeline hover/focus tooltip | P | U | U | U | P | U | P | P | U | U | U | U | P | Focus,source timeline.mjs | Naming logic checked; pointer hover at every block not exhaustively sampled. |

### Discovery framework and all find states

| Row | Element/state | A | B | C | D | E | F | G | H | I | J | K | L | M | Evidence | Alone and in-context observation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I438 | Numbered find marker 1: wayfinder | P | P | P | P | P | P | P | P | P | P | U | U | P | O,F,All | Ring to filled mark gives retained found feedback. |
| I439 | Numbered find marker 2: hoards | P | P | P | P | P | P | P | P | P | P | U | U | P | O,F,All | Ring to filled mark gives retained found feedback. |
| I440 | Numbered find marker 3: ravens | P | P | P | P | P | P | P | P | P | P | U | U | P | O,F,All | Ring to filled mark gives retained found feedback. |
| I441 | Numbered find marker 4: serpent | P | P | P | P | P | P | P | P | P | P | U | U | P | O,F,All | Ring to filled mark gives retained found feedback. |
| I442 | Numbered find marker 5: beacon | P | P | P | P | P | P | P | P | P | P | U | U | P | O,F,All | Ring to filled mark gives retained found feedback. |
| I443 | Numbered find marker 6: runestone | P | P | P | P | P | P | P | P | P | P | U | U | P | O,F,All | Ring to filled mark gives retained found feedback. |
| I444 | Discovery credit star and count bump | P | P | P | P | P | P | P | P | P | P | U | U | P | C,F | Same pooled credit follows the source-to-count arc. |
| I445 | Find hint surface and text | P | L-1 | P | P | L-1 | L-1 | L-1 | P | L-1 | - | - | P | P | F,Hint,Way | Both hint nodes become opaque under find focus. |
| I446 | Explore hint reused after return | P | L-1 | P | P | L-1 | L-1 | L-1 | P | L-1 | - | - | P | P | Hint | Old instruction covers current find instruction. |
| I447 | Popup ground/tail/body | P | L-9 | P | L-9 | P | P | L-9 | P | P | U | U | U | P | F,All,Y | Opaque ground and anchor-tail work; instantaneous exit breaks continuity. |
| I448 | Popup case-study link | P | P | P | P | K10 | P | P | P | L-12 | U | U | L-12 | P | All/hoards | Inert by brief; small actual target. |
| I449 | All-eleven border comet | P | P | P | L-16 | P | L-16 | L-16 | P | P | P | U | U | P | C | Reward belongs to chart; forced camera competes with eleventh find. |
| I450 | All-eleven knot turns and marker pulse | P | P | P | L-16 | P | L-16 | P | P | P | P | U | U | P | C | Small accents are consistent; camera dominates their importance. |
| I451 | All-eleven wide-camera and return | P | P | P | L-16 | P | L-16 | L-16 | P | P | P | U | U | P | C | In-close/out-wide/back-close around one press. |
| I452 | Wayfinder body, rune ring and four short arms | L-2 | P | P | P | L-2 | L-2 | P | P | L-2 | P | U | U | P | Way,All/way | Instrument drawing works; results lack visible named destinations. |
| I453 | Needle at rest | L-2 | P | P | P | L-2 | L-2 | P | P | L-2 | P | U | U | P | Way,All/way | Instrument drawing works; results lack visible named destinations. |
| I454 | Print arm and selected label | L-2 | P | P | P | L-2 | L-2 | P | R | L-2 | P | U | U | P | Way,All/way | Instrument drawing works; results lack visible named destinations. |
| I455 | Video arm and selected label | L-2 | P | P | P | L-2 | L-2 | P | R | L-2 | P | U | U | P | Way,All/way | Instrument drawing works; results lack visible named destinations. |
| I456 | Motion arm and selected label | L-2 | P | P | P | L-2 | L-2 | P | R | L-2 | P | U | U | P | Way,All/way | Instrument drawing works; results lack visible named destinations. |
| I457 | Screen arm and selected label | L-2 | P | P | P | L-2 | L-2 | P | R | L-2 | P | U | U | P | Way,All/way | Instrument drawing works; results lack visible named destinations. |
| I458 | Connecting lines and arrival pings | L-2 | P | P | P | L-2 | L-2 | P | P | L-2 | P | U | U | P | Way,All/way | Instrument drawing works; results lack visible named destinations. |
| I459 | Craft result count | L-2 | P | P | P | L-2 | L-2 | P | P | L-2 | P | U | U | P | Way,All/way | Instrument drawing works; results lack visible named destinations. |
| I460 | Unlocked centre pulse | L-2 | P | P | P | L-2 | L-2 | P | P | L-2 | P | U | U | P | Way,All/way | Instrument drawing works; results lack visible named destinations. |
| I461 | All-four result | L-2 | P | P | P | L-2 | L-2 | P | R | L-2 | P | U | U | P | Way,All/way | Instrument drawing works; results lack visible named destinations. |
| I462 | Clear/return state | L-2 | P | P | P | L-2 | L-2 | P | P | L-2 | P | U | U | P | Way,All/way | Instrument drawing works; results lack visible named destinations. |
| I463 | Laurier hoard: scratch/glint | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-laurier | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I464 | Laurier hoard: dig one/hole/clods | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-laurier | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I465 | Laurier hoard: dig two/partial lid | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-laurier | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I466 | Laurier hoard: dig three/rise/rattle | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-laurier | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I467 | Laurier hoard: lid opening and stars | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-laurier | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I468 | Laurier hoard: open chest/popup | P | L-9 | P | P | P | P | P | P | P | P | U | U | P | All/hoard-laurier | Persistent local stages and grounded opening; popup exit cuts. |
| I469 | Laurier hoard: popup closed/reopen bounce | P | L-9 | P | L-9 | P | P | P | P | P | P | U | U | P | All/hoard-laurier | Persistent local stages and grounded opening; popup exit cuts. |
| I470 | HMC summers hoard: scratch/glint | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-hmc1 | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I471 | HMC summers hoard: dig one/hole/clods | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-hmc1 | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I472 | HMC summers hoard: dig two/partial lid | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-hmc1 | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I473 | HMC summers hoard: dig three/rise/rattle | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-hmc1 | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I474 | HMC summers hoard: lid opening and stars | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-hmc1 | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I475 | HMC summers hoard: open chest/popup | P | L-9 | P | P | P | P | P | P | P | P | U | U | P | All/hoard-hmc1 | Persistent local stages and grounded opening; popup exit cuts. |
| I476 | HMC summers hoard: popup closed/reopen bounce | P | L-9 | P | L-9 | P | P | P | P | P | P | U | U | P | All/hoard-hmc1 | Persistent local stages and grounded opening; popup exit cuts. |
| I477 | HMC contract hoard: scratch/glint | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-hmc2 | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I478 | HMC contract hoard: dig one/hole/clods | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-hmc2 | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I479 | HMC contract hoard: dig two/partial lid | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-hmc2 | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I480 | HMC contract hoard: dig three/rise/rattle | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-hmc2 | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I481 | HMC contract hoard: lid opening and stars | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-hmc2 | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I482 | HMC contract hoard: open chest/popup | P | L-9 | P | P | P | P | P | P | P | P | U | U | P | All/hoard-hmc2 | Persistent local stages and grounded opening; popup exit cuts. |
| I483 | HMC contract hoard: popup closed/reopen bounce | P | L-9 | P | L-9 | P | P | P | P | P | P | U | U | P | All/hoard-hmc2 | Persistent local stages and grounded opening; popup exit cuts. |
| I484 | Interkom hoard: scratch/glint | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-interkom | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I485 | Interkom hoard: dig one/hole/clods | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-interkom | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I486 | Interkom hoard: dig two/partial lid | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-interkom | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I487 | Interkom hoard: dig three/rise/rattle | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-interkom | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I488 | Interkom hoard: lid opening and stars | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-interkom | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I489 | Interkom hoard: open chest/popup | P | L-9 | P | P | P | P | P | P | L-8 | P | U | U | P | All/hoard-interkom | Persistent local stages and grounded opening; popup exit cuts. |
| I490 | Interkom hoard: popup closed/reopen bounce | P | L-9 | P | L-9 | P | P | P | P | P | P | U | U | P | All/hoard-interkom | Persistent local stages and grounded opening; popup exit cuts. |
| I491 | Lennard hoard: scratch/glint | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-lennard | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I492 | Lennard hoard: dig one/hole/clods | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-lennard | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I493 | Lennard hoard: dig two/partial lid | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-lennard | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I494 | Lennard hoard: dig three/rise/rattle | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-lennard | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I495 | Lennard hoard: lid opening and stars | P | P | P | P | P | P | P | P | P | P | U | U | P | All/hoard-lennard | Specific chest and neighbouring terrain checked; staged dig remains understandable. |
| I496 | Lennard hoard: open chest/popup | P | L-9 | P | P | P | P | P | P | P | P | U | U | P | All/hoard-lennard | Persistent local stages and grounded opening; popup exit cuts. |
| I497 | Lennard hoard: popup closed/reopen bounce | P | L-9 | P | L-9 | P | P | P | P | P | P | U | U | P | All/hoard-lennard | Persistent local stages and grounded opening; popup exit cuts. |
| I498 | Raven perch tree | P | P | P | P | P | P | P | P | P | P | U | U | P | F/ravens,All/raven,Details | Independent bird identity and perched partner retained; reel natural close composed. |
| I499 | Huginn at rest/attention/preen | P | P | P | P | P | P | P | P | P | P | U | U | P | F/ravens,All/raven,Details | Independent bird identity and perched partner retained; reel natural close composed. |
| I500 | Muninn at rest/attention/preen | P | P | P | P | P | P | P | P | P | P | U | U | P | F/ravens,All/raven,Details | Independent bird identity and perched partner retained; reel natural close composed. |
| I501 | Huginn crouch/outbound | P | P | P | P | P | P | P | P | P | P | U | U | P | F/ravens,All/raven,Details | Independent bird identity and perched partner retained; reel natural close composed. |
| I502 | Huginn return/landing/turn | P | P | P | P | P | P | P | P | P | P | U | U | P | F/ravens,All/raven,Details | Independent bird identity and perched partner retained; reel natural close composed. |
| I503 | Thought slip and thought popup | P | L-9 | P | P | P | P | P | P | P | P | U | U | P | F/ravens,All/raven,Details | Independent bird identity and perched partner retained; reel natural close composed. |
| I504 | Muninn outbound/return with frame | P | P | P | P | P | P | P | P | P | P | U | U | P | F/ravens,All/raven,Details | Independent bird identity and perched partner retained; reel natural close composed. |
| I505 | Raven tally scratches | P | P | P | P | P | P | P | P | P | P | U | U | P | F/ravens,All/raven,Details | Independent bird identity and perched partner retained; reel natural close composed. |
| I506 | Muninn reel opening/player/timecode | P | P | P | P | L-10 | P | P | P | P | P | U | U | P | F/ravens,All/raven,Details | Independent bird identity and perched partner retained; reel natural close composed. |
| I507 | Reel moving placeholder shapes | P | P | P | P | P | P | P | P | P | P | U | U | P | F/ravens,All/raven,Details | Independent bird identity and perched partner retained; reel natural close composed. |
| I508 | Reel natural iris exit | P | P | P | P | P | P | P | P | P | P | U | U | P | F/ravens,All/raven,Details | Independent bird identity and perched partner retained; reel natural close composed. |
| I509 | Reel manual Escape exit | P | L-9 | P | L-9 | P | P | P | P | P | P | U | U | P | F/ravens,All/raven,Details | Independent bird identity and perched partner retained; reel natural close composed. |
| I510 | Two-raven horn response | P | P | P | U | P | P | P | P | P | P | U | U | P | F/ravens,All/raven,Details | Independent bird identity and perched partner retained; reel natural close composed. |
| I511 | Jormungandr submerged ring | P | P | P | P | P | P | P | P | P | P | U | U | P | F/serpent,All/serpent,O | Ring reads as mythic world serpent; distinct head and three real leaves. |
| I512 | Jormungandr surfaced stretch 1 | P | P | P | P | P | P | P | P | P | P | U | U | P | F/serpent,All/serpent,O | Ring reads as mythic world serpent; distinct head and three real leaves. |
| I513 | Jormungandr surfaced stretch 2 | P | P | P | P | P | P | P | P | P | P | U | U | P | F/serpent,All/serpent,O | Ring reads as mythic world serpent; distinct head and three real leaves. |
| I514 | Jormungandr surfaced stretch 3 | P | P | P | P | P | P | P | P | P | P | U | U | P | F/serpent,All/serpent,O | Ring reads as mythic world serpent; distinct head and three real leaves. |
| I515 | Jormungandr surfaced stretch 4 | P | P | P | P | P | P | P | P | P | P | U | U | P | F/serpent,All/serpent,O | Ring reads as mythic world serpent; distinct head and three real leaves. |
| I516 | Jormungandr surfaced stretch 5 | P | P | P | P | P | P | P | P | P | P | U | U | P | F/serpent,All/serpent,O | Ring reads as mythic world serpent; distinct head and three real leaves. |
| I517 | Head/eye/jaw/tongue at rest | P | P | P | P | P | P | P | P | P | P | U | U | P | F/serpent,All/serpent,O | Ring reads as mythic world serpent; distinct head and three real leaves. |
| I518 | Tail in mouth/released | P | P | P | P | P | P | P | P | P | P | U | U | P | F/serpent,All/serpent,O | Ring reads as mythic world serpent; distinct head and three real leaves. |
| I519 | Calendar FRI / 5 PM | P | P | P | P | P | P | P | P | P | P | U | U | P | F/serpent,All/serpent,O | Ring reads as mythic world serpent; distinct head and three real leaves. |
| I520 | Calendar TODAY / EOD | P | P | P | P | P | P | P | P | P | P | U | U | P | F/serpent,All/serpent,O | Ring reads as mythic world serpent; distinct head and three real leaves. |
| I521 | Calendar NOW / ASAP | P | P | P | P | P | P | P | P | P | P | U | U | P | F/serpent,All/serpent,O | Ring reads as mythic world serpent; distinct head and three real leaves. |
| I522 | Bite/held leaf/swallow | P | P | P | P | P | P | P | P | P | P | U | U | P | F/serpent,All/serpent,O | Ring reads as mythic world serpent; distinct head and three real leaves. |
| I523 | Travelling body bulge | P | P | P | P | P | P | P | P | P | P | U | U | P | F/serpent,All/serpent,O | Ring reads as mythic world serpent; distinct head and three real leaves. |
| I524 | Pad sinking and sleep | P | P | P | P | P | P | P | P | P | P | U | U | P | F/serpent,All/serpent,O | Ring reads as mythic world serpent; distinct head and three real leaves. |
| I525 | Deadline popup | P | L-9 | P | P | P | P | P | P | P | P | U | U | P | F/serpent,All/serpent,O | Ring reads as mythic world serpent; distinct head and three real leaves. |
| I526 | Wake/new pad | P | P | P | P | P | P | P | P | P | P | U | U | P | F/serpent,All/serpent,O | Ring reads as mythic world serpent; distinct head and three real leaves. |
| I527 | Horn-response head/swell | P | P | P | U | P | P | P | P | P | P | U | U | P | F/serpent,All/serpent,O | Ring reads as mythic world serpent; distinct head and three real leaves. |
| I528 | Beacon stone tower | P | P | P | P | P | P | P | P | P | P | U | U | P | Bc,F/beacon,All | Reward persists; fourth note collides after chest/terrain context is included. |
| I529 | Beacon basket/fire | P | P | P | P | P | P | P | P | P | P | U | U | P | Bc,F/beacon,All | Reward persists; fourth note collides after chest/terrain context is included. |
| I530 | Idle sweeping beam | P | P | P | P | P | P | P | P | P | P | U | U | P | Bc,F/beacon,All | Reward persists; fourth note collides after chest/terrain context is included. |
| I531 | Manual aim/snap beam | P | P | P | P | P | P | P | P | P | P | U | U | P | Bc,F/beacon,All | Reward persists; fourth note collides after chest/terrain context is included. |
| I532 | Reading 1 runes and translation | P | P | P | P | P | P | P | P | P | P | U | U | P | Bc,F/beacon,All | Reward persists; fourth note collides after chest/terrain context is included. |
| I533 | Reading 2 runes and translation | P | P | P | P | P | P | P | P | P | P | U | U | P | Bc,F/beacon,All | Reward persists; fourth note collides after chest/terrain context is included. |
| I534 | Reading 3 runes and translation | P | P | P | P | P | P | P | P | P | P | U | U | P | Bc,F/beacon,All | Reward persists; fourth note collides after chest/terrain context is included. |
| I535 | Reading 4 runes and translation | P | P | L-8 | P | P | L-8 | P | P | L-8 | P | U | U | P | Bc,F/beacon,All | Reward persists; fourth note collides after chest/terrain context is included. |
| I536 | Four-read large flame/rotating beam | P | P | P | P | P | P | P | P | P | P | U | U | P | Bc,F/beacon,All | Reward persists; fourth note collides after chest/terrain context is included. |
| I537 | Beacon-linked ship lamp | P | P | P | P | P | P | P | P | P | P | U | U | P | Bc,F/beacon,All | Reward persists; fourth note collides after chest/terrain context is included. |
| I538 | Rune stone resting carving | P | P | P | P | P | P | P | P | P | P | U | U | P | Rune | Paper/stone relationship reads; native partial-rub state and completed flip verified. |
| I539 | Carving trace | P | P | P | P | P | P | P | R | P | P | U | U | P | Rune | Paper/stone relationship reads; native partial-rub state and completed flip verified. |
| I540 | Paper sheet entrance | P | P | P | P | P | P | P | P | P | P | U | U | P | Rune | Paper/stone relationship reads; native partial-rub state and completed flip verified. |
| I541 | Partial user rubbing | P | P | P | P | L-10 | P | L-10 | P | P | P | U | U | P | Rune | Paper/stone relationship reads; native partial-rub state and completed flip verified. |
| I542 | Rub it for me button | P | P | P | P | P | P | P | P | L-12 | P | U | L-12 | P | Rune | Paper/stone relationship reads; native partial-rub state and completed flip verified. |
| I543 | Automatic rubbing sequence | P | P | P | P | P | P | P | P | P | P | U | U | P | Rune | Paper/stone relationship reads; native partial-rub state and completed flip verified. |
| I544 | Completed English/rune face | P | P | P | P | P | P | P | P | P | P | U | U | P | Rune | Paper/stone relationship reads; native partial-rub state and completed flip verified. |
| I545 | Flip it over button | P | P | P | P | P | P | P | P | L-12 | P | U | L-12 | P | Rune | Paper/stone relationship reads; native partial-rub state and completed flip verified. |
| I546 | Poster reverse headline/picture/copy | P | P | P | P | P | P | P | P | P | P | U | U | P | Rune | Paper/stone relationship reads; native partial-rub state and completed flip verified. |
| I547 | Poster reward/stamp/fold | P | P | P | P | P | P | P | R | P | P | U | U | P | Rune | Paper/stone relationship reads; native partial-rub state and completed flip verified. |
| I548 | Close button before completion | P | P | P | P | L-10 | P | L-10 | P | L-12 | P | U | L-12 | P | Rune | Paper/stone relationship reads; native partial-rub state and completed flip verified. |
| I549 | Close button after completion | P | P | P | P | P | P | P | P | L-12 | P | U | L-12 | P | Rune | Paper/stone relationship reads; native partial-rub state and completed flip verified. |
| I550 | Sheet fold-back exit | P | P | P | P | P | P | P | P | P | P | U | U | P | Rune | Paper/stone relationship reads; native partial-rub state and completed flip verified. |
| I551 | Hammer on stone, resting | P | P | P | P | P | P | P | P | P | P | U | U | P | F/hammer,Details,Focus | Original short-handle drawing; persistent found appearance absent. |
| I552 | Hammer idle spark/attention tremble | P | P | P | P | P | P | P | P | P | P | U | U | P | F/hammer,Details,Focus | Original short-handle drawing; persistent found appearance absent. |
| I553 | Hammer horn hop | P | P | P | P | P | P | P | P | P | P | U | U | P | F/hammer,Details,Focus | Original short-handle drawing; persistent found appearance absent. |
| I554 | Hammer sheet entrance | P | P | P | P | P | P | P | P | P | P | U | U | P | F/hammer,Details,Focus | Original short-handle drawing; persistent found appearance absent. |
| I555 | Hammer sheet outer close | P | K9 | P | P | P | P | P | P | P | P | U | U | P | F/hammer,Details,Focus | Original short-handle drawing; persistent found appearance absent. |
| I556 | Hammer revisited after a run | P | P | P | P | P | P | L-15 | P | P | P | U | U | P | F/hammer,Details,Focus | Original short-handle drawing; persistent found appearance absent. |
| I557 | Mist resting six puffs | P | P | P | P | P | P | P | P | P | P | U | U | P | All/mist,F/mist,W | Softness belongs to fog; stone cairns and cleared route remain. |
| I558 | Mist partial wipe | P | P | P | P | P | P | P | P | P | P | U | U | P | All/mist,F/mist,W | Softness belongs to fog; stone cairns and cleared route remain. |
| I559 | Mist clearing second third | P | P | P | P | P | P | P | P | P | P | U | U | P | All/mist,F/mist,W | Softness belongs to fog; stone cairns and cleared route remain. |
| I560 | Mist fully lifted | P | P | P | P | P | P | P | P | P | P | U | U | P | All/mist,F/mist,W | Softness belongs to fog; stone cairns and cleared route remain. |
| I561 | Cairn 1 | P | P | P | P | P | P | P | P | P | P | U | U | P | All/mist,F/mist,W | Softness belongs to fog; stone cairns and cleared route remain. |
| I562 | Cairn 2 | P | P | P | P | P | P | P | P | P | P | U | U | P | All/mist,F/mist,W | Softness belongs to fog; stone cairns and cleared route remain. |
| I563 | Cairn 3 | P | P | P | P | P | P | P | P | P | P | U | U | P | All/mist,F/mist,W | Softness belongs to fog; stone cairns and cleared route remain. |
| I564 | Mist reward glints | P | P | P | P | P | P | P | P | P | P | U | U | P | All/mist,F/mist,W | Softness belongs to fog; stone cairns and cleared route remain. |
| I565 | Traveller-wiped corridor | P | P | P | P | P | P | P | P | P | P | U | U | P | All/mist,F/mist,W | Softness belongs to fog; stone cairns and cleared route remain. |
| I566 | Mist horn drift | P | P | P | P | P | P | P | P | P | P | U | U | P | All/mist,F/mist,W | Softness belongs to fog; stone cairns and cleared route remain. |
| I567 | Horn at rest | P | P | P | P | P | P | P | P | K7 | P | U | U | P | All/horn,F/horn | Known horn framing excluded; raised/lowered shape is readable. |
| I568 | Horn raising | P | P | P | P | P | P | P | P | K7 | P | U | U | P | All/horn,F/horn | Known horn framing excluded; raised/lowered shape is readable. |
| I569 | Raised horn popup | P | L-9 | P | P | P | P | P | P | K7 | P | U | U | P | All/horn,F/horn | Known horn framing excluded; raised/lowered shape is readable. |
| I570 | Sound rings | P | P | P | P | P | P | P | P | K7 | P | U | U | P | All/horn,F/horn | Known horn framing excluded; raised/lowered shape is readable. |
| I571 | Map-wide responses/glints | P | P | P | P | P | P | P | P | K7 | P | U | U | P | All/horn,F/horn | Known horn framing excluded; raised/lowered shape is readable. |
| I572 | Horn lowering/echo | P | P | P | P | P | P | P | P | K7 | P | U | U | P | All/horn,F/horn | Known horn framing excluded; raised/lowered shape is readable. |
| I573 | Horn revisited after sounding | P | P | P | P | P | P | L-15 | P | K7 | P | U | U | P | All/horn,F/horn | Known horn framing excluded; raised/lowered shape is readable. |
| I574 | Well resting water and drip | P | P | P | P | P | L-5 | P | P | P | P | U | U | P | Y,Rune,All/well | Norns use existing journey state; focal labels too dim. |
| I575 | Thrown pebble | P | P | P | P | P | L-5 | P | P | P | P | U | U | P | Y,Rune,All/well | Norns use existing journey state; focal labels too dim. |
| I576 | Ripple/splash | P | P | P | P | P | L-5 | P | P | P | P | U | U | P | Y,Rune,All/well | Norns use existing journey state; focal labels too dim. |
| I577 | Urd: what was | P | P | P | P | P | L-5 | P | P | P | P | U | U | P | Y,Rune,All/well | Norns use existing journey state; focal labels too dim. |
| I578 | Verdandi: what is | P | P | P | P | P | L-5 | P | P | P | P | U | U | P | Y,Rune,All/well | Norns use existing journey state; focal labels too dim. |
| I579 | Skuld: what shall be | P | P | P | P | P | L-5 | P | P | P | P | U | U | P | Y,Rune,All/well | Norns use existing journey state; focal labels too dim. |
| I580 | Well popup close | P | L-9 | P | P | P | L-5 | P | P | P | P | U | U | P | Y,Rune,All/well | Norns use existing journey state; focal labels too dim. |
| I581 | Trunk stream and permanent stars | P | P | P | P | P | L-5 | P | P | P | P | U | U | P | Y,Rune,All/well | Norns use existing journey state; focal labels too dim. |
| I582 | Longship hull and prow | P | P | P | P | P | P | P | P | P | P | U | U | P | All/ship,W,C | Consistent line art; oars/pennant are readable rewards. |
| I583 | Square sail and mast | P | P | P | P | P | P | P | P | P | P | U | U | P | All/ship,W,C | Consistent line art; oars/pennant are readable rewards. |
| I584 | Six rail shields | P | P | P | P | P | P | P | P | P | P | U | U | P | All/ship,W,C | Consistent line art; oars/pennant are readable rewards. |
| I585 | Ship rocking/breathing | P | P | P | P | P | P | P | P | P | P | U | U | P | All/ship,W,C | Consistent line art; oars/pennant are readable rewards. |
| I586 | Oar pull 1 | P | P | P | P | P | P | P | P | P | P | U | U | P | All/ship,W,C | Consistent line art; oars/pennant are readable rewards. |
| I587 | Oar pull 2 | P | P | P | P | P | P | P | P | P | P | U | U | P | All/ship,W,C | Consistent line art; oars/pennant are readable rewards. |
| I588 | Oar pull 3 and pennant | P | P | P | P | P | P | P | P | P | P | U | U | P | All/ship,W,C | Consistent line art; oars/pennant are readable rewards. |
| I589 | Permanent lamp when beacon read | P | P | P | P | P | P | P | P | P | P | U | U | P | All/ship,W,C | Consistent line art; oars/pennant are readable rewards. |
| I590 | Ship log popup | P | L-9 | P | P | P | P | P | P | P | P | U | U | P | All/ship,W,C | Consistent line art; oars/pennant are readable rewards. |
| I591 | Ship travelling water crossing | P | P | P | P | P | P | P | P | P | P | U | U | P | All/ship,W,C | Consistent line art; oars/pennant are readable rewards. |

### Hammer game: every screen and drawing family

| Row | Element/state | A | B | C | D | E | F | G | H | I | J | K | L | M | Evidence | Alone and in-context observation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I592 | Outer panel and field frame | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I593 | Start card title/intro | P | L-11 | P | L-11 | P | P | P | R | P | P | U | U | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I594 | Mouse/keyboard instructions | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I595 | Touch instructions | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I596 | Start a run | P | P | P | P | P | P | P | P | L-12 | P | U | L-12 | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I597 | Wave counter | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I598 | Fate line | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I599 | Heart icons (filled/lost) | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I600 | Silver total | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I601 | Battlefield during play | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I602 | Pause card | P | L-11 | P | L-11 | P | P | P | P | P | P | U | U | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I603 | Resume inside panel | P | P | P | P | P | P | P | P | L-12 | P | U | L-12 | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I604 | Resume in bottom row | P | P | P | P | P | P | P | P | L-12 | P | U | L-12 | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I605 | New run | P | P | P | P | P | P | P | P | L-12 | P | U | L-12 | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I606 | Keep throwing toggle | P | P | P | P | P | P | P | P | L-12 | P | U | L-12 | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I607 | Pause control | P | P | P | P | P | P | P | P | L-12 | P | U | L-12 | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I608 | Close control | P | P | P | P | P | P | P | P | L-12 | P | U | L-12 | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I609 | Status/live-message line | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I610 | Rune-choice screen | P | L-11 | P | L-11 | P | P | P | P | P | P | U | U | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I611 | Loss screen | P | L-11 | P | L-11 | P | P | P | P | P | P | U | U | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I612 | Win screen | P | L-11 | P | L-11 | P | P | P | P | P | P | U | U | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I613 | Best-run score | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I614 | Runes taken list | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I615 | New-run reset | P | L-11 | P | L-11 | P | P | P | P | P | P | U | U | P | Game,Details,Focus | Observed across two natural-control runs, including loss and win; no invented score. |
| I616 | Game art: Draugr | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,DPR2 | Original line silhouettes; tall/short foe proportions distinguish rows. |
| I617 | Game art: Rime giant (intact/cracked) | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,DPR2 | Original line silhouettes; tall/short foe proportions distinguish rows. |
| I618 | Game art: Son of Muspell | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,DPR2 | Original line silhouettes; tall/short foe proportions distinguish rows. |
| I619 | Game art: Wolf | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,DPR2 | Original line silhouettes; tall/short foe proportions distinguish rows. |
| I620 | Game art: Giant chief | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,DPR2 | Original line silhouettes; tall/short foe proportions distinguish rows. |
| I621 | Game art: Valkyrie | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,DPR2 | Original line silhouettes; tall/short foe proportions distinguish rows. |
| I622 | Game art: Jarngreipr glove | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,DPR2 | Original line silhouettes; tall/short foe proportions distinguish rows. |
| I623 | Game art: Mjolnir held/outbound/returning | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,DPR2 | Original line silhouettes; tall/short foe proportions distinguish rows. |
| I624 | Game art: Bone shards | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,DPR2 | Original line silhouettes; tall/short foe proportions distinguish rows. |
| I625 | Game art: Icicles | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,DPR2 | Original line silhouettes; tall/short foe proportions distinguish rows. |
| I626 | Game art: Splitting embers | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,DPR2 | Original line silhouettes; tall/short foe proportions distinguish rows. |
| I627 | Game art: Hail shards | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,DPR2 | Original line silhouettes; tall/short foe proportions distinguish rows. |
| I628 | Game art: Hit sparks/field shake | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,DPR2 | Original line silhouettes; tall/short foe proportions distinguish rows. |
| I629 | Game art: Bifrost three arcs | P | P | P | P | P | P | P | P | P | P | U | U | P | Game,DPR2 | Original line silhouettes; tall/short foe proportions distinguish rows. |
| I630 | Game art: Left wall segment | P | P | L-13 | P | P | P | P | P | P | P | U | U | P | Game,DPR2,Crop | Intact circular rims are cropped into bracket-like pieces. |
| I631 | Game art: Centre wall segment | P | P | L-13 | P | P | P | P | P | P | P | U | U | P | Game,DPR2,Crop | Intact circular rims are cropped into bracket-like pieces. |
| I632 | Game art: Right wall segment | P | P | L-13 | P | P | P | P | P | P | P | U | U | P | Game,DPR2,Crop | Intact circular rims are cropped into bracket-like pieces. |
| I633 | Game art: Damaged wall cells | P | P | L-13 | P | P | P | P | P | P | P | U | U | P | Game,DPR2,Crop | Intact circular rims are cropped into bracket-like pieces. |
| I634 | Game art: Double wall fate | P | P | L-13 | P | P | P | P | P | P | P | U | U | P | Game,DPR2,Crop | Intact circular rims are cropped into bracket-like pieces. |
| I635 | Boss: Hrungnir head/shoulders/club | P | P | P | P | P | P | P | P | P | P | U | U | P | Game/boss | Boss and heart observed; win card covers much of the falling geometry. |
| I636 | Boss: Boss health bar | P | P | P | P | P | P | P | P | P | P | U | U | P | Game/boss | Boss and heart observed; win card covers much of the falling geometry. |
| I637 | Boss: Exposed triangular stone heart | P | P | P | P | P | P | P | P | P | P | U | U | P | Game/boss | Boss and heart observed; win card covers much of the falling geometry. |
| I638 | Boss: Boss death fragments | P | L-11 | P | L-11 | P | P | P | P | P | P | U | U | P | Game/boss | Boss and heart observed; win card covers much of the falling geometry. |
| I639 | Boss: Mokkurkalfi appearance and motion | U | U | U | U | U | U | U | U | U | U | U | U | U | source only | Passed through its threshold in winning run; actual clay phase not captured at useful reading scale. |
| I640 | Rune choice: Thurisaz | P | L-11 | P | L-11 | P | P | P | P | P | U | U | U | P | Game/runes | All twelve names/art seen across choices. Not every upgrade level independently rendered. |
| I641 | Rune choice: Raidho | P | L-11 | P | L-11 | P | P | P | P | P | U | U | U | P | Game/runes | All twelve names/art seen across choices. Not every upgrade level independently rendered. |
| I642 | Rune choice: Kenaz | P | L-11 | P | L-11 | P | P | P | P | P | U | U | U | P | Game/runes | All twelve names/art seen across choices. Not every upgrade level independently rendered. |
| I643 | Rune choice: Gebo | P | L-11 | P | L-11 | P | P | P | P | P | U | U | U | P | Game/runes | All twelve names/art seen across choices. Not every upgrade level independently rendered. |
| I644 | Rune choice: Hagalaz | P | L-11 | P | L-11 | P | P | P | P | P | U | U | U | P | Game/runes | All twelve names/art seen across choices. Not every upgrade level independently rendered. |
| I645 | Rune choice: Naudiz | P | L-11 | P | L-11 | P | P | P | P | P | U | U | U | P | Game/runes | All twelve names/art seen across choices. Not every upgrade level independently rendered. |
| I646 | Rune choice: Isa | P | L-11 | P | L-11 | P | P | P | P | P | U | U | U | P | Game/runes | All twelve names/art seen across choices. Not every upgrade level independently rendered. |
| I647 | Rune choice: Jera | P | L-11 | P | L-11 | P | P | P | P | P | U | U | U | P | Game/runes | All twelve names/art seen across choices. Not every upgrade level independently rendered. |
| I648 | Rune choice: Eihwaz | P | L-11 | P | L-11 | P | P | P | P | P | U | U | U | P | Game/runes | All twelve names/art seen across choices. Not every upgrade level independently rendered. |
| I649 | Rune choice: Laguz | P | L-11 | P | L-11 | P | P | P | P | P | U | U | U | P | Game/runes | All twelve names/art seen across choices. Not every upgrade level independently rendered. |
| I650 | Rune choice: Dagaz | P | L-11 | P | L-11 | P | P | P | P | P | U | U | U | P | Game/runes | All twelve names/art seen across choices. Not every upgrade level independently rendered. |
| I651 | Rune choice: Ehwaz | P | L-11 | P | L-11 | P | P | P | P | P | U | U | U | P | Game/runes | All twelve names/art seen across choices. Not every upgrade level independently rendered. |
| I652 | Fate: Fimbulwinter | U | U | U | U | U | U | U | U | U | U | U | U | U | Game or source | Source reviewed; not drawn in the two sampled runs. |
| I653 | Fate: Muspell heat | U | U | U | U | U | U | U | U | U | U | U | U | U | Game or source | Source reviewed; not drawn in the two sampled runs. |
| I654 | Fate: Wolf-age | P | P | P | P | P | P | P | P | P | P | U | U | P | Game or source | Rendered in run 2. |
| I655 | Fate: Shield-maidens | P | P | P | P | P | P | P | P | P | P | U | U | P | Game or source | Rendered in run 2. |
| I656 | Fate: Hel tide | P | P | P | P | P | P | P | P | P | P | U | U | P | Game or source | Rendered in run 2. |

### X, nova, ending and Explore

| Row | Element/state | A | B | C | D | E | F | G | H | I | J | K | L | M | Evidence | Alone and in-context observation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| I657 | Resting rough red X | P | P | P | P | P | P | P | P | L-4 | P | U | U | P | W/x,L/x | Focal X is clear; neighbouring skyline composition clipped. |
| I658 | X label: X marks the work | P | P | P | P | P | P | P | P | L-4 | P | U | U | P | W/x,L/x | Focal X is clear; neighbouring skyline composition clipped. |
| I659 | X sub-line: case studies and everything else | P | P | P | P | P | P | P | P | L-4 | P | U | U | P | W/x,L/x | Focal X is clear; neighbouring skyline composition clipped. |
| I660 | X clickable hit area | P | P | P | P | P | P | P | P | L-4 | P | U | U | P | W/x,L/x | Focal X is clear; neighbouring skyline composition clipped. |
| I661 | Kindle onset | P | P | P | P | P | P | P | P | P | U | U | U | P | Nova,W,source | Existing known gather/pause/ember issues excluded; sampled blast has no whole-screen white flash. |
| I662 | Heartbeat light throbs | P | P | P | P | P | P | P | P | P | U | U | U | P | Nova,W,source | Existing known gather/pause/ember issues excluded; sampled blast has no whole-screen white flash. |
| I663 | Gathering map stars | P | P | P | K5 | P | P | P | P | P | U | U | U | P | Nova,W,source | Existing known gather/pause/ember issues excluded; sampled blast has no whole-screen white flash. |
| I664 | Gathering sky stars | P | P | P | K5 | P | P | P | P | P | U | U | U | P | Nova,W,source | Existing known gather/pause/ember issues excluded; sampled blast has no whole-screen white flash. |
| I665 | Draw-in/compressed cross | P | P | P | P | P | P | P | P | P | U | U | U | P | Nova,W,source | Existing known gather/pause/ember issues excluded; sampled blast has no whole-screen white flash. |
| I666 | Held pre-blast pause | P | P | P | K5 | P | P | P | P | P | U | U | U | P | Nova,W,source | Existing known gather/pause/ember issues excluded; sampled blast has no whole-screen white flash. |
| I667 | Blast spikes | P | P | P | P | P | P | P | P | P | U | U | U | P | Nova,W,source | Existing known gather/pause/ember issues excluded; sampled blast has no whole-screen white flash. |
| I668 | Expanding blast rings | P | P | P | P | P | P | P | P | P | U | U | U | P | Nova,W,source | Existing known gather/pause/ember issues excluded; sampled blast has no whole-screen white flash. |
| I669 | Outgoing rays/streaks | P | P | P | P | P | P | P | P | P | U | U | U | P | Nova,W,source | Existing known gather/pause/ember issues excluded; sampled blast has no whole-screen white flash. |
| I670 | Map fade during blast | P | P | P | P | P | P | P | P | P | U | U | U | P | Nova,W,source | Existing known gather/pause/ember issues excluded; sampled blast has no whole-screen white flash. |
| I671 | Camera recoil | P | P | P | P | P | P | P | P | P | U | U | U | P | Nova,W,source | Existing known gather/pause/ember issues excluded; sampled blast has no whole-screen white flash. |
| I672 | Settle glow/core | P | P | P | P | P | P | P | P | P | U | U | U | P | Nova,W,source | Existing known gather/pause/ember issues excluded; sampled blast has no whole-screen white flash. |
| I673 | Settled orbit/rings | P | P | P | P | P | P | P | P | P | U | U | U | P | Nova,W,source | Existing known gather/pause/ember issues excluded; sampled blast has no whole-screen white flash. |
| I674 | Post-blast embers | P | P | P | K5 | P | P | P | P | P | U | U | U | P | Nova,W,source | Existing known gather/pause/ember issues excluded; sampled blast has no whole-screen white flash. |
| I675 | Press-stacked flares | P | P | P | P | P | P | P | P | P | U | U | U | P | Nova,W,source | Existing known gather/pause/ember issues excluded; sampled blast has no whole-screen white flash. |
| I676 | Hidden controls through rush/blast and end reveal | P | P | P | P | P | P | P | P | P | P | U | U | P | Nova,W | Controls return with completed ending, not over the blast. |
| I677 | End CTA headline | P | P | P | P | P | P | P | P | L-7 | U | U | U | P | W/end,L/end,RM | Name/layout continuity to hero preserved; prototype destination actions are inert. |
| I678 | Let us talk pill | P | P | P | P | K10 | P | P | R | P | U | U | U | P | W/end,L/end,RM | Name/layout continuity to hero preserved; prototype destination actions are inert. |
| I679 | Footer name wipe/weight | P | P | P | P | P | P | P | P | P | U | U | U | P | W/end,L/end,RM | Name/layout continuity to hero preserved; prototype destination actions are inert. |
| I680 | Footer name hover red lens/lift | P | P | P | P | P | P | P | R | P | U | U | U | P | W/end,L/end,RM | Name/layout continuity to hero preserved; prototype destination actions are inert. |
| I681 | Footer name pressed spring wave | P | P | P | P | P | P | P | P | P | P | U | U | P | W/end,L/end,RM | Name/layout continuity to hero preserved; prototype destination actions are inert. |
| I682 | Footer tagline | P | P | P | P | P | P | P | P | P | U | U | U | P | W/end,L/end,RM | Name/layout continuity to hero preserved; prototype destination actions are inert. |
| I683 | Timeline transformed to footer rule | P | P | P | P | P | P | P | P | P | U | U | U | P | W/end,L/end,RM | Name/layout continuity to hero preserved; prototype destination actions are inert. |
| I684 | Rule red end dot | P | P | P | P | P | P | P | P | P | U | U | U | P | W/end,L/end,RM | Name/layout continuity to hero preserved; prototype destination actions are inert. |
| I685 | Case studies link | P | P | P | P | K10 | P | P | P | L-12 | U | U | L-12 | P | W/end,L/end,RM | Name/layout continuity to hero preserved; prototype destination actions are inert. |
| I686 | Work link | P | P | P | P | K10 | P | P | P | L-12 | U | U | L-12 | P | W/end,L/end,RM | Name/layout continuity to hero preserved; prototype destination actions are inert. |
| I687 | LinkedIn link | P | P | P | P | K10 | P | P | P | L-12 | U | U | L-12 | P | W/end,L/end,RM | Name/layout continuity to hero preserved; prototype destination actions are inert. |
| I688 | Email link | P | P | P | P | K10 | P | P | P | L-12 | U | U | L-12 | P | W/end,L/end,RM | Name/layout continuity to hero preserved; prototype destination actions are inert. |
| I689 | Resume link | P | P | P | P | K10 | P | P | P | L-12 | U | U | L-12 | P | W/end,L/end,RM | Name/layout continuity to hero preserved; prototype destination actions are inert. |
| I690 | Back at end | P | P | P | P | P | P | P | P | L-7 | U | U | U | P | W/end,L/end,RM | Name/layout continuity to hero preserved; prototype destination actions are inert. |
| I691 | Explore the map CTA | P | P | P | P | P | P | P | P | L-7 | U | U | U | P | W/end,L/end,RM | Name/layout continuity to hero preserved; prototype destination actions are inert. |
| I692 | Back to the top | P | P | P | P | P | P | P | P | L-12 | U | U | L-12 | P | W/end,L/end,RM | Name/layout continuity to hero preserved; prototype destination actions are inert. |
| I693 | Explore entry map restoration | P | P | P | P | P | P | P | P | P | U | U | U | P | W/explore,All/explore,source | Restoration and return sampled; physical-phone lag/fast-pinch failures are known exclusions. |
| I694 | Explore fitted map | P | P | P | P | P | P | P | P | P | U | U | U | P | W/explore,All/explore,source | Restoration and return sampled; physical-phone lag/fast-pinch failures are known exclusions. |
| I695 | Explore maximum zoom | P | P | P | P | P | P | P | P | P | U | K6 | U | P | W/explore,All/explore,source | Restoration and return sampled; physical-phone lag/fast-pinch failures are known exclusions. |
| I696 | Explore pan bounds | P | P | P | P | P | P | P | P | P | U | K6 | U | P | W/explore,All/explore,source | Restoration and return sampled; physical-phone lag/fast-pinch failures are known exclusions. |
| I697 | Explore wheel zoom | P | P | P | P | P | P | P | P | P | U | U | U | P | W/explore,All/explore,source | Restoration and return sampled; physical-phone lag/fast-pinch failures are known exclusions. |
| I698 | Explore phone pinch | P | P | P | P | P | P | P | P | P | U | K6 | U | P | W/explore,All/explore,source | Restoration and return sampled; physical-phone lag/fast-pinch failures are known exclusions. |
| I699 | Explore drag | P | P | P | P | P | P | P | P | P | U | U | U | P | W/explore,All/explore,source | Restoration and return sampled; physical-phone lag/fast-pinch failures are known exclusions. |
| I700 | Explore arrow-key pan | P | P | P | P | P | P | P | P | P | U | U | U | P | W/explore,All/explore,source | Restoration and return sampled; physical-phone lag/fast-pinch failures are known exclusions. |
| I701 | Explore Back to end | P | P | P | P | P | P | P | P | P | U | U | U | P | W/explore,All/explore,source | Restoration and return sampled; physical-phone lag/fast-pinch failures are known exclusions. |
| I702 | Explore Back to top | P | P | P | P | P | P | P | P | P | U | U | U | P | W/explore,All/explore,source | Restoration and return sampled; physical-phone lag/fast-pinch failures are known exclusions. |
| I703 | Explore one-time hint | P | L-1 | P | P | L-1 | L-1 | P | P | P | U | U | U | P | W/explore,All/explore,source | Restoration and return sampled; physical-phone lag/fast-pinch failures are known exclusions. |
| I704 | Explore exit to footer | P | P | P | P | P | P | P | P | P | U | U | U | P | W/explore,All/explore,source | Restoration and return sampled; physical-phone lag/fast-pinch failures are known exclusions. |
| I705 | Finds played after completion | P | P | P | P | P | P | P | P | P | U | U | U | P | W/explore,All/explore,source | Restoration and return sampled; physical-phone lag/fast-pinch failures are known exclusions. |
| I706 | Reduced-motion hero/map hand-over | P | P | P | P | P | P | P | P | P | P | U | U | P | RM | Stacked content/quiet footer checked; later phone timeline destinations fail. |
| I707 | Reduced-motion six-card list | P | P | P | P | P | P | P | P | P | P | U | U | P | RM | Stacked content/quiet footer checked; later phone timeline destinations fail. |
| I708 | Reduced-motion sticky timeline | P | P | P | P | P | P | P | P | L-6 | L-6 | U | U | P | RM | Stacked content/quiet footer checked; later phone timeline destinations fail. |
| I709 | Reduced-motion static footer | P | P | P | P | P | P | P | P | P | P | U | U | P | RM | Stacked content/quiet footer checked; later phone timeline destinations fail. |
| I710 | Reduced-motion find/game response | P | P | P | U | P | P | P | P | P | U | U | U | P | RM | Stacked content/quiet footer checked; later phone timeline destinations fail. |

## 3. Findings, ordered by visibility and impact

These are additional findings. K1-K6 in the coverage key are excluded known issues, not counted again. "Both" means the shared map surface in both packed pages; a finding reproduced on only one packed page is identified as such. Source paths below are relative to the frozen worktree. Corrections are proposals only; no product file was edited.

### L-1. The exploration hint covers the actual find instructions

- **Where:** Both pages' shared find UI; directly reproduced on the standalone map at 1440x900 and 412x730. Every focused find is exposed.
- **Wrong:** There are two `.find-hint` elements. `.jm-focus .find-hint` makes both opaque. Before exploring, the unused exploration hint is an empty, opaque Ink rectangle that cuts through the bottom of the real hint on a phone. After entering and leaving Explore, its old "Scroll to zoom. Drag to look around." text completely covers "Dig twice more." It advertises a gesture that does nothing in this state. At 412x730, the real hint is y597.2-626, while the empty overlay is y614-626, both 380 px wide. In the desktop reproduction both opacities are 1; a wheel input leaves P unchanged. A further first-explore check opened the hammer while the one-time hint was still live: the hint covered the game action row. The later `.explore-hint.on` rule defeats the sheet-open hiding rule at equal specificity.
- **Questions:** B10-11, E29-32/35, F38, G42-43, I50; own 5, 23, 36.
- **Repeat:** End -> Explore the map -> Escape -> HMC Connections -> close its card -> press its buried chest. Also try a fresh load -> map -> wayfinder, without ever exploring.
- **Evidence:** `hint-check/desk-stale-hint.png`, `hint-check/desk-stale-hint-wheel.png`, `hint-check.log`; `way-dan/dan-way-print.png` shows the fresh-load clipping; `explore-walk/dan-explore-hammer.png` shows the covered game controls.
- **Severity:** **Fix now.** It conceals the instructions needed to understand the discoveries.
- **Correction/source:** Scope the focus rule to the actual find hint, and show the exploration hint only during its own active state. An unused hint must contribute no visible background. `map.css:300-304`; `explore.mjs` hint creation/reset; `findkit.mjs:213`.

### L-2. The wayfinder hides the names and, on the phone, the places it is supposed to explain

- **Where:** Standalone map, wayfinder Print/Video/Motion/Screen/all-four states; 1440x900 and 412x730.
- **Wrong:** Selecting a craft draws connections and colors shields, but the primary stop-name group remains hidden by find focus. On desktop the camera pulls back to a chart of anonymous highlighted dots. On the phone it stays tightly on the compass while every matched stop lies outside the viewport. "PRINT: 5 of 6 stops" is a count, not an explanation of which five. The desktop all-four result is also partly behind the Back pill. This undermines the one find that directly explains Dan's range of work.
- **Questions:** A2-3/5, E30-31, F36/38, G42, I50; own 5, 20, 24, 39-40.
- **Repeat:** Map -> press wayfinder -> focus it and press Right through all four crafts, then Right once more. Compare phone and desktop.
- **Evidence:** `all-states/desk-way-0.png` through `desk-way-4.png`; `way-dan/dan-way-print.png`, `dan-way-all.png`; `way-dan.log`.
- **Severity:** **Fix now.** The feature's stated purpose is not communicated by its result.
- **Correction/source:** Keep the selected stops identifiable: restore their names in the desktop result view and provide an on-screen named result on the narrow layout. Reserve a clear result area for the tally, including the all-four line. `trip.mjs:303-315` hides tier 1/sub-lines for all focus; `findhoards.mjs:34-49` changes the view only on non-phones and builds the tally; `data.mjs` wayfinder views and `FIND_PLAY.way`.

### L-3. Yggdrasil's crown and branch joins still look assembled rather than grown

- **Where:** Both pages' central landmark; overview, Mohawk/HMC-again surroundings, and focused well. Especially clear at 1440x900 and in the enlarged actual chart.
- **Wrong, specifically:** The trunk has useful weight, the spreading roots establish importance, and the eagle/squirrel/root creature give it a mythic identity. Those parts work. Above them, five separated, similarly scalloped puffs read as small clouds on stalks. The added thin branch paths cross the broad fork's existing outlines, and several terminate as exposed straight or hooked stubs rather than joining a convincing taper. Outer-mass hatches run nearly horizontally and reinforce the cloud reading. At overview scale these joins become a white tangle; at well scale the disconnected construction becomes obvious. The central mass is tall, while the side puffs are spread like a diagram, so the overall tree has less canopy weight than its roots suggest.
- **Questions:** C13-20, F36, G45, H49; own 10-13, 15, 37, 40.
- **Repeat:** Map -> press Urd's Well; compare before and after three pebble drops. Also look at Mohawk with its card closed.
- **Evidence:** `desk-all/desk-find-well-1.png`, `desk-find-well-3.png`; `corrected-dan/dan-well-three.png`; `drawing-atlas.jpg` and the normal-size map frames. Compared with `reference/round7/ygg-5px.png` and the later REVIEW2/REVIEW3 crown requirements.
- **Severity:** **Polish, high priority.** This is the map's central drawing and Dan explicitly requested this judgment.
- **Correction/source:** Preserve the location, roots, actors, well and large footprint. Reconcile the trunk and branch outlines into three or four tapered, continuous limbs with clean occlusion at joins. Make the five foliage masses read as one irregular ash canopy through varied size, partial overlap and a few deliberate limb windows. Use sparse directional twig/leaf marks, not horizontal cloud dashes. Review the silhouette without interior strokes first, then at the actual overview size. `art.mjs:108-126`, `data.mjs:567` (`YGG.masses`, `branches`, `trunk`, `massFrom`). All 15 reward-star **centres** were checked inside actual foliage; I am not claiming they are outside it.

### L-4. The resting X composition slices through Toronto

- **Where:** Both pages at 412x730; standalone also at 390x844, 360x640 and 820x1180, X beat.
- **Wrong:** The X and its label are safely visible, but the skyline is cut through the financial towers at the right edge. On the portrait tablet most of the skyline is outside the frame. The partially visible city looks accidentally cropped during the main journey's final hold. The complete skyline is one of the best-drawn assets; the final composition fails to show it coherently.
- **Questions:** C16-17, F36, I50/52; own 7-8, 15, 34.
- **Repeat:** Progress from Lennard to the X; wait for movement to stop. Compare with desktop and overview.
- **Evidence:** `walk-dan/dan-9-x-rest.png`; `layout/desk-390x844-x.png`, `desk-360x640-x.png`, `desk-820x1180-x.png`; `drawing-atlas.jpg` for the complete drawing.
- **Severity:** **Polish.** This is separate from the already-known tablet wayfinder "VIDEO" clipping.
- **Correction/source:** Fit the final focal composition using the X, its copy, Lennard marker and complete skyline as a group, leaving meaningful margins. The current `xGroupPhone` deliberately fits only the X/copy region; this is a composition criticism, not a claim that the current code accidentally ignores its own numbers. `trip.mjs:108-119`; `data.mjs:283`; compare WORLD section 9's earlier full-group intent.

### L-5. Focusing the well makes its own identity too dim to read comfortably

- **Where:** Standalone, focused well at 1440x900 and 412x730; the shared focus rule also affects other landmark/region text.
- **Wrong:** "YGGDRASIL", "URD'S WELL" and "was, is, shall be" fade to 0.3 opacity exactly when the visitor investigates them. This is not the background card dimming: the actual map and label-parent opacities are 1. At 412x730 the labels are about 11-14 px high. Approximate solid-background contrast is only 1.65:1 for Dim over Land and 2.04:1 for Note over Ink after compositing. The popup names a Norn, so the nearby landmark names would help explain the scene, but are harder to see than the drawing's incidental lines.
- **Questions:** A1/4, F38-39, H48, L59; own 9, 18, 37.
- **Repeat:** Map -> Urd's Well -> wait -> inspect the landmark labels, then leave focus and compare.
- **Evidence:** `corrected-dan/dan-well-three.png`, `corrected-dan.log` computed fill/opacity/rects; `desk-all/desk-find-well-1.png`. Contrast calculation is reproduced by `audit_inspect.py`.
- **Severity:** **Fix now** for the focal identity text; quieter unrelated labels are appropriate.
- **Correction/source:** Exempt the active landmark's identity from the blanket 0.3 text fade and use the existing readable Note/Dim colors at an opacity that preserves contrast. Continue fading unrelated words. `map.css:306-308`; label generation in `art.mjs:212-220`.

### L-6. Reduced-motion phone visitors lose the later half of the timeline

- **Where:** Joined page, reduced motion, 412x730, stacked HMC-again/Interkom/Lennard cards.
- **Wrong:** The sticky jump menu remains on approximately 2016-2020 even while the visitor reads 2022 or 2023-now. The track is 604.8 px wide inside a roughly 252 px clipped viewport. Its later blocks are off-screen. A native horizontal touch drag did not expose them. Thus the promised reduced-motion jump menu cannot show all destinations by touch.
- **Questions:** E33-34, F41, G43, I50/52, J55, L59; own 19, 32, 34.
- **Repeat:** Load with `prefers-reduced-motion: reduce`; scroll to Lennard; swipe the bottom timeline horizontally.
- **Evidence:** `reduced-dan/dan-scroll-4200.png`, `dan-scroll-5000.png`; `reduced-timeline/dan-lennard-before-swipe.png`, `dan-timeline-after-swipe.png`, `reduced-timeline.log`.
- **Severity:** **Fix now.** This removes visible navigation destinations from the alternative presentation.
- **Correction/source:** Give the reduced-motion timeline an independently usable full-range layout or native horizontal scroll, with the current section brought into view. Do not retain the motion-mode 2.4x track while disabling both ways of moving it. `timeline.mjs:41`, `65`, `74`; `map.css:167` (`overflow: clip`); `main.mjs:42` supplies the otherwise-correct jump action.

### L-7. Landscape phone layout collapses into competing labels and controls

- **Where:** Standalone map, 844x390 stretch viewport, overview and end; rotation from the joined phone journey also exercised.
- **Wrong:** The overview's map shrinks to roughly a narrow vertical strip while minimum text sizes remain large relative to it. The kicker protrudes well past the map frame, stop labels crowd across the land, and legend symbols/words collide. At the end, the desktop control row ends at y64 while the headline box starts at y58.5. The visible result is a row of navigation pressed against/over the first headline line, with little separation from the name below.
- **Questions:** C17-19, F36/38, I50/52/54, J55; own 8, 15, 19, 34.
- **Repeat:** Set viewport to 844x390 -> map -> end; also rotate midway through a phone move and let it settle.
- **Evidence:** `layout/desk-844x390-map.png`, `desk-844x390-end.png`, `layout.log`; `reversal-dan/dan-rotate-landscape.png`.
- **Severity:** **Polish / stretch-layout fix.** It should not be represented as a passing responsive size.
- **Correction/source:** Add a short-height composition: reserve control/headline space before fitting the map, and change the overview label presentation when its text floors no longer fit. Maintain actual reading sizes instead of squeezing the entire portrait composition. `trip.mjs:81-89`, `105`; `map.css:183`, `276`, `283-295`; `footer.mjs` resize layout.

### L-8. The beacon's fourth reading is drawn through terrain and an opened chest

- **Where:** Standalone 1440x900, beacon after all four notes have been read, with the Interkom chest already opened.
- **Wrong:** The fourth English line crosses a pine/hill group and the top of the chest's raised lid. The third line is also uncomfortably close to a round tree. A note that is only legible when isolated is not adequately laid out in the persistent, explored map. This finding concerns geometry and contrast, not the placeholder wording.
- **Questions:** C17-19, F38, G43, I50/54; own 9, 12, 15, 39.
- **Repeat:** Open the Interkom hoard fully; return to map; press beacon through its four readings.
- **Evidence:** `all-states/desk-beacon-note-2.png`, `desk-beacon-note-3.png`; `beacon-all.jpg`.
- **Severity:** **Polish.** It obscures a reward after several deliberate actions.
- **Correction/source:** Reserve the full rendered rune/translation box against terrain and the chest's open bounds, not just a circle around the note anchor. Reposition the affected reading and give its letters a quiet, matching Ink halo where necessary. `data.mjs:225-228`; `art.mjs` grove KEEP exclusions and beacon-note markup; `findsheets.mjs:37-49`.

### L-9. Popup exits cut instantly; the raven reel's manual exit skips its iris

- **Where:** Hoard, thought, serpent, well and ship popups; raven reel closed with Escape. Desktop and phone frames sampled.
- **Wrong:** Popups have a visible scale entrance, but closing removes their contents immediately. The eye gets no return to the chest, bird, well or ship. The reel has a composed natural iris close, but Escape removes it in one step. That inconsistency is noticeable after seeing the animated entrances and the rune sheet's proper return animation.
- **Questions:** B7-12, D21-22/27-28, G42; own 23, 27-28.
- **Repeat:** Open a hoard/well popup, then Escape or tap empty map. Open Muninn's reel, then Escape before it ends; compare with its natural timeout.
- **Evidence:** `all-states/desk-hoard-hmc1-open.png` and `desk-hoard-hmc1-pop-closed.png`; `corrected-dan/dan-popup-exit-000.png`; `details-dan/dan-raven-reel.png`, `dan-reel-close-000.png`; natural-exit frames in `all-states/`.
- **Severity:** **Polish.** The known hammer-sheet closing defect is excluded from this finding.
- **Correction/source:** Keep the actual popup/sheet instance alive through a brief reversible exit anchored to its source; make manual reel dismissal run its existing iris path. Restore focus after the visual exit. `findkit.mjs:119-121`, `148-153`; `findcreatures.mjs:46-53`, `159-170`.

### L-10. Two sheets lack a local exit during their first visible state

- **Where:** Rune rubbing sheet before completion and raven reel; particularly relevant to touch, 412x730.
- **Wrong:** The rune sheet initially exposes only "Rub it for me". Its Close control is hidden until the full rubbing/read sequence completes. A single partial rub stops the automatic sequence and can leave this state indefinitely. The reel has no local close button at all. "Back to the trail" remains visible and can leave the find, so this is **not** a claim that visitors are trapped; it is an inconsistent, spatially detached exit affordance.
- **Questions:** A5, E30-31/33-34, G42, L59; own 21, 23, 26.
- **Repeat:** Open rune stone, touch the paper once before auto-rubbing starts, wait; compare with the completed sheet. Open Muninn's reel on a phone.
- **Evidence:** `corrected-dan/dan-rune-open.png`, `dan-rune-partial-after-wait.png`, `dan-rune-read.png`, `corrected-dan.log`; `details-dan/dan-raven-reel.png`.
- **Severity:** **Polish.** The remote Back button mitigates the problem.
- **Correction/source:** Keep one obvious local Close control available from the first visible frame through all sheet states. Its exit should use the same anchored closing motion. `findsheets.mjs` sheet markup and `o.controls` reveal; `findcreatures.mjs:48-53` reel markup.

### L-11. Game state panels appear and vanish abruptly, and the win panel covers the boss's fall

- **Where:** Hammer game start -> play, wave -> rune choice, pause/resume and win/loss. Captured at 412x730.
- **Wrong:** The outer sheet grows in, but its interior panels cut between states with no entrance or exit. When Hrungnir reaches zero, the win panel immediately occupies the same region where the falling boss pieces are drawn. The headline says he falls while the designed fall is largely hidden. This is a different issue from the already-known outer sheet's missing close animation.
- **Questions:** B7/10-11, D21/23/27, F36, G42; own 26-29, 31.
- **Repeat:** Start a run, pause/resume, complete a wave, and win. The supplied bot uses only actual control clicks and pointer movement; run 2 reaches the win normally.
- **Evidence:** `details-dan/dan-hammer-playing.png`, `dan-hammer-paused.png`; `game-dan/dan-run2-6-runes-3-2--false.png`, `dan-run2-7-play-4--1--false.png`, `dan-run2-7-end-4--1--true.png`; `game-dan.log`.
- **Severity:** **Polish.** The play/rune/end information itself is readable and numerically coherent in the observed runs.
- **Correction/source:** Give panel changes a restrained, consistent transition and let the existing boss fall finish before the win panel takes its space. Under reduced motion show the resolved state immediately. `findhammer.mjs:27-43`, particularly direct `innerHTML`/`hidden` changes at 38; draw logic around the won fragments; `map.css:361-363`.

### L-12. Several real controls miss the requested 44 px target size

- **Where:** 412x730 phone game and rune sheets; tablet mini-map; phone card CTAs and footer/end controls.
- **Wrong:** Measured sheet action buttons are 36 px high; rune rubbing/flip/close controls are 29 px; the mini-map's six buttons are 24x24; card case-study CTAs are about 37 px high. Footer text buttons are only 14 or 21 px high, and Back to the top is about 32 px. Small type and tight button gaps make the sheet targets particularly fiddly. The card X is 44x44 and the main step controls are 44/52 px, so they demonstrate the intended standard.
- **Questions:** E34, I53, L59; own 21-22, 37.
- **Repeat:** Open the game/rune sheets and inspect each button's bounding box; compare with Next and the card X. Check the mini-map at tablet width.
- **Evidence:** `corrected-dan.log`, `details-dan.log` valid hammer-state records, `hint-check.log` mini-map geometry; the corresponding sheet and card frames. Footer actions are intentionally inert prototype controls; their geometry is recorded, not reported as broken links.
- **Severity:** **Fix now** for active find/game controls; extend the same correction to the remaining visible controls before they become live.
- **Correction/source:** Keep the visual scale if desired, but enlarge real non-overlapping hit regions to at least 44x44 and preserve sufficient separation. Let the game reflow rather than uniformly shrinking its controls. This is the project's explicit 44 px rule, not a claim about a particular WCAG minimum. `data.mjs:181`; `map.css:75`, `98-105`, `165-181`, `367`; rune `.pz-ctl button` rules.

### L-13. The game's shield wall is visibly cropped into brackets

- **Where:** Hammer playfield, all intact wall states; 412x730 at DPR 1 and 2.
- **Wrong:** At actual play size each segment reads as a row of narrow brackets/curved pipes. Enlarging the actual frame shows the round rim shapes cut flat at the segment edges and top/bottom, with detached-looking boss dots at the edge. This is not just DPR-1 blur: it persists in the DPR-2 capture. Foes have distinguishable tall/short proportions, so I am not grouping their small silhouettes into this finding.
- **Questions:** C13-15/19, G45; own 10-12, 37.
- **Repeat:** Start a game before the wall is damaged. Look at all three intact segments, then compare a damaged one.
- **Evidence:** `details-dan/dan-hammer-playing.png`, `game-art-crops.png`, `game-dpr2/dan-game-dpr2.png`, `game-boss.jpg`.
- **Severity:** **Polish.** The cover behaves consistently in the observed play.
- **Correction/source:** Fit the overlapping shield artwork inside its actual live-cell envelope so intact shields retain readable circular rims. Retain the three collision segments and real gaps; do not draw apparent cover outside the hit geometry. `findhammer.mjs:87-100`; `data.mjs` `HAMMER.shield` and `HAMMER.paths.wall`.

### L-14. Three small-tree pairs create accidental merged silhouettes

- **Where:** North grove, east of Yggdrasil, south-island grove. Most visible enlarged, still visible at a stop zoom.
- **Wrong:** A pine's lower corner meets a round tree's crown in the northern pair; two more pines sit almost directly on round crowns with little visual separation, making ice-cream/cone symbols. These are local tangencies or near-tangencies, not a request to thin out the forest. The other 59 tree placements do not need the same cleanup.
- **Questions:** C13-14/17-19, I54; own 11-13.
- **Repeat/evidence:** `tree-atlas.jpg`: T06/T20, T41/T42, T57/T60; `drawing-atlas.jpg`; `large/desk-whole-map-large.png`. Coordinates are in the inventory and `world-data.json`.
- **Severity:** **Polish, low priority.** Preserve the grove density and simple original glyph system.
- **Correction/source:** Move the affected glyphs just enough to create a deliberate gap or a properly masked overlap; evaluate actual crown boxes rather than only trunk-point separation. `art.mjs:236-244`, especially the 9-unit centre spacing test.

### L-15. The hammer and horn have no durable visual "found" state

- **Where:** Explore/revisit after playing the hammer or sounding the horn, then returning to the map.
- **Wrong:** Both return to the same map appearance as before discovery. Unlike numbered finds, they have no marker that fills; unlike the well, chests, mist or ship, their resting drawing does not retain an obvious reward. A visitor working toward 11 finds must remember these two. The hidden-versus-numbered discovery mix itself is intentional and is not the finding.
- **Questions:** E30, F36, G43, J55; own 25, 39.
- **Repeat:** Play/close hammer; raise/sound horn; leave their focus and revisit in Explore. Compare with a fresh overview.
- **Evidence:** `desk-all/desk-beat-map.png`, `all-states/desk-explore-found.png`, `all-states/desk-horn-rest.png`; confirmed found set in `all-states.log`.
- **Severity:** **Polish.** It affects completion clarity, not normal journey progression.
- **Correction/source:** Add a small persistent non-color-only found treatment to these actual map objects, consistent with existing discovered states. `findkit.mjs:89-94` marks only `#mk-<id>`; these two FINDS rows have `n: 0`; their map renderers do not consume `FD.found` for a retained treatment.

### L-16. Finding the eleventh object interrupts its own reveal with a camera round trip

- **Where:** Standalone 1440x900; longship is the eleventh new find.
- **Wrong:** The initial press zooms toward the ship and opens its log. As the count lands, the camera pulls back to the whole chart for the border celebration, then returns to the ship. The visitor gets three framing changes around one press, with the new log relocating while it is being read. The border accent is quiet compared with the camera movement that presents it.
- **Questions:** A6, D23-25/28, F36-37, G42-43; own 6-8, 23-24, 31.
- **Repeat:** Find the other ten types, then press the longship for the first time from the map overview. `completion.json` performs that setup and samples the actual eleventh press.
- **Evidence:** `completion/desk-eleventh-000.png` through `desk-eleventh-044.png`, `completion-strip.jpg`, `completion.log`. The set genuinely reaches all eleven.
- **Severity:** **Polish.** The celebration is justified; its timing competes with the final discovery.
- **Correction/source:** Let the final find finish its focal action/read state before taking the camera for the chart celebration. A local count acknowledgment can happen immediately. Preserve the existing border/knot reward when attention is available. `findkit.mjs:95-103`, `findall.mjs:13-22` and the restoration at the end of its tick.


## 4. The walk, with timed first-pass notes

These are scripted visitor routes driven by real browser input. Times are elapsed capture-log times, rounded to a tenth of a second. They include deliberate waits and screenshot overhead, so they must not be read as animation durations or device latency. Reactions below were recorded on first inspection of those frames. This is an auditor's walkthrough, not a recruited-user usability test. Full sequences and timestamps are in `walk-desk.log` and `walk-dan.log`.

### Desktop joined page, 1440x900

| Time | Encounter | First-pass reaction and context |
|---|---|---|
| 0.0 s | Hero | Clear identity and a visible Start cue. Hero's internal design is outside scope. |
| 0.1-6.3 s | Start, rising hero, stars, coastline, overview | The shift from solid 3D hero to drawn chart is intelligible because the Ink ground and star field continue. The brief star-only interval feels like staging, not a broken page. Coasts appear before detail. No extra finding here. |
| 6.3 s | Whole map | Strong title and legible overall route. The large surrounding clouds make a rich world; they do not obscure the main chart. The miniature legend explains symbols, although there is a lot to discover. |
| 12.2 s | Laurier | Clean logo band, clear headline, first-person summary. The card's missing visible source relationship is noticed, but excluded as K1. |
| 18.0 s | HMC summers | Navy/green, taller logo and role line distinguish it. The two summers are clear. The map remains present behind it. |
| 23.7 s | Mohawk | Black/orange/maroon reads as a different place. The short "Type first" takeaway is immediate. Yggdrasil is now conspicuous beside the card and looks too schematic in its upper branches. L-3. |
| 29.4 s | HMC again | Returning navy identity makes sense. The real annual-report image is a useful concrete reward. The label "again" prevents confusion with the earlier stop. |
| 35.0 s | Interkom | Cream provides a welcome contrast without abandoning the card system. The body is denser but remains coherent. |
| 40.5 s | Lennard | Orange/white panel and three progression pills explain growth. The existing 8 px internal scroll is measured, not added as a new finding. K4. |
| 46.2 s | X hold | The X and "Dig here" are easy to connect. Desktop skyline is complete. The legend at the lower chart edge is still contextual rather than another action. |
| 46.3 s onward | Build-up and blast | The first press has a clear consequence; the focus is unmistakable. Known one-sided star arrival and held pause are excluded. The sampled blast remains colored, not a whole-screen white flash. |
| 61.7 s | End | Name, invitation and links settle into a strong ending. The red lens on the name matches the hero behavior. Repeated rings/embers are the already-open nova work, not new findings. |
| 61.9-67.5 s | Explore | Restoring the same map makes sense. The camera gives room to roam, and Back names the return destination. |
| 68.6 s | Zoom | The map remains legible and vector strokes remain fine. This capture is not a performance pass. |
| 71.2 s | Back to the end | Returns to a recognizable ending with the same name and CTA placement. |

### Dan's joined-page size, 412x730

| Time | Encounter | First-pass reaction and context |
|---|---|---|
| 0.0 s | Hero | Start remains available. Hero internals excluded. |
| 0.1-5.7 s | Hand-over | The star field and gradual coastline reveal bridge the change of medium well. The entire map fits in portrait. |
| 5.7 s | Overview | Much smaller detail than desktop, but a readable primary route and Set out. Tiny optional objects naturally require exploration. |
| 11.4 s | Laurier | A well-ordered bottom sheet: logo/date, headline, copy, takeaway, piece, crafts, action. The sheet covers the local map context; the missing tether is known. |
| 16.5 s | HMC summers | Role/copy remain readable. The bottom CTA is close to the viewport reservation; this card has the measured known 10 px overflow. |
| 21.7 s | Mohawk | Headline fits; concise body gives this card comfortable breathing room. |
| 26.8 s | HMC again | The large image is useful, but the bottom action is partly below the card's cap. Known 29 px scroll. |
| 31.8 s | Interkom | Clear cream surface and straightforward agency story. No additional field-level layout defect. |
| 36.9 s | Lennard | The real progression pills help, but the CTA is below the visible bottom of the card. Known 61 px scroll. |
| 41.9 s | X hold | The right-hand city is sliced off, which reads as an unfinished composition. L-4. The main action is clear. |
| 42.0 s onward | Build-up/blast | Strong consequence and clear single focal event; known gather/pause issues remain excluded. |
| 53.9 s | End | The invitation, nova, name and footer links fit in portrait without the previous headline/control overlap. |
| 54.0-59.3 s | Explore | Clear change to free exploration; map restored. |
| 60.4 s | Zoom | The enlarged map is understandable. No claim about the actual phone's GPU or frame pacing. |
| 62.9 s | Return | End layout restores coherently. |

### First encounters with finds and follow-up exploration

The find pass used fresh or reset map views so each discovery could be judged alone. It was not timed as part of the uninterrupted hero run. Actual frame names/logs preserve the input timing.

| Relative time from the relevant press | Encounter | Reaction |
|---|---|---|
| About 0.7-3 s | Chest focus and first dig | The hole, then partial lid, then full chest make a sensible progression. The hint must remain readable; the overlaid/empty explore hint defeats this. L-1. |
| Four deliberate presses | Open hoard | Chest reward and popup tail have a good spatial relationship. Closing the popup instantly feels unfinished beside the careful lid animation. L-9. |
| About 2-4 s | First raven | Flight, return and a thought about Dan's work form a coherent optional reward. The other bird remains perched. |
| Next raven, then five-second reel | Memory | The reel entrance belongs to the returned frame. Natural iris exit is composed; manual exit/local close affordance differ. L-9/L-10. |
| Three serpent pokes | Deadline | Calendar leaves and the encircling body make the joke understandable. Each leaf is consumed rather than replaced by a different character. |
| Four beacon readings | Light reveals notes | Read notes persisting is useful. The fourth reading collides with terrain and an opened chest, something an isolated fresh beacon view misses. L-8. |
| 1.1 s, then a partial rub and 3.2 s wait | Rune sheet | A partial touch leaves just a patch of carving and no local Close. Rub it for me still works, and Back remains available. The later poster and flip are readable. L-10. |
| Immediate start; later wave changes | Game | Objective and controls are understandable. Rune choices and score/hearts communicate the run. State panels cut rather than transition, the win obscures the fall, and targets are too small. L-11/L-12. |
| Three well drops | Norns/tree | The canopy lighting is a pleasant retained reward. The very labels explaining this landmark dim excessively. L-3/L-5. |
| Wayfinder craft selection | Career meaning | I can see a count and lines, but on desktop not the place names, and on phone not the destination stops. L-2. |
| Eleventh discovery | Completion | Count succeeds, then the camera makes a distracting close/wide/close detour while the last log is new. L-16. |

The additional fresh joined-phone `explore-walk/` pass entered Explore, tried the well, hammer and horn, closed their overlays and returned to the end. This verified the free-map context separately from guided find focus and exposed the additional L-1 case where the live Explore hint covers the game controls. The 30-second overview and well-idle samples are in `idle/`: the scenery remains quiet enough to dwell on; no new recurring idle seam was identified at the sampled cadence.

## 5. Clean checks, boundaries and incomplete checks

### What was checked and found clean, within the stated limits

- Both offline packed pages render. The joined hand-over preserves the star/Ink continuity, with the hero's internal design deliberately excluded.
- All six stops appear in the required order, both HMC visits are distinguishable, and the observed names/dates/role copy agree with the supplied data. Timeline school/work overlap is structurally honest.
- The shared card system has consistent header, headline, body, takeaway, piece, crafts and action order. Logos retain their proportions; Interkom contrast and the Lennard white content panel work. All six cards were compared across all eight required sizes; the per-stop contact sheets are `card-sizes-*.jpg`.
- Every small tree, mountain, hill and skyline building was inventoried. Most glyphs fit the chart's fine-line hand. Toronto is a strong complete drawing, and the island contours, sea marks, inset bands, frame and small corner knots belong together. The two islands and crossing explain the route without generic boxes replacing the map.
- All eleven find types genuinely reached the found set. All five chests were opened through actual stages. Wayfinder four crafts/all-four/clear, serpent three leaves/sleep/restart, four beacon readings, partial/automatic rune rubbing, the poster flip/close, raven thought/reel, mist thirds, horn response, three Norns and ship pennant/lamp were exercised.
- The game was played in the real browser through normal pointer movement and button actions by an audit bot. Run 1 ended on wave 5 with no hearts; run 2 defeated Hrungnir, ending at 4800 silver and 115 foes. The bot did not change game state or accelerate the clock. All seven waves and all twelve rune names were seen across offers; loss, win, pause, resume and new-run screens were inspected. Bot success is not evidence of human difficulty balance.
- Sampled normal glides, a mid-glide Back, repeated Next and rotation settled into the intended stop without a visible position discontinuity in the captured strips. The visual evidence does not certify continuous 60 fps motion.
- Keyboard focus is visibly drawn on the timeline, a find, the game Start and Keep throwing controls. Native Tab advanced from Start to Keep throwing. Full focus order and speech output were not certified.
- Reduced motion gives a scrolling card list and static footer without the journey camera travel. Its timeline has the specific failure L-6.
- No additional whole-screen white frame was seen in sampled nova frames. The known Android flash/lag problem is not considered cleared by this desktop Edge result.
- The real page's CSS and sampled drag prevent selection; no selected text was produced by the card drag check. The main journey does not respond to the tested wheel input after starting.
- `remaining/` additionally checks the footer name's pressed wave/return, repeated zoom requests to the widest/deepest views, a pan toward the east bound, and return from Explore. These looked coherent in the desktop sample; the other bounds and physical pinch remain unverified.

### Known card scrolling, measured but not counted again

Values below are `scrollHeight - clientHeight` in CSS pixels for the open face. Positive values are the already-known K4 issue. This table demonstrates that the small sizes were actually inspected; it is not a new finding list.

| Size | Laurier | HMC summers | Mohawk | HMC contract | Interkom | Lennard |
|---|---:|---:|---:|---:|---:|---:|
| 1440x900 | 0 | 0 | 0 | 0 | 0 | 8 |
| 1280x720 | 0 | 0 | 0 | 0 | 0 | 8 |
| 1024x600 | 0 | 0 | 0 | 0 | 0 | 8 |
| 820x1180 | 0 | 0 | 0 | 0 | 0 | 8 |
| 412x730 | 0 | 10 | 0 | 29 | 0 | 61 |
| 390x844 | 0 | 0 | 0 | 0 | 0 | 0 |
| 360x640 | 21 | 79 | 26 | 99 | 65 | 160 |
| 844x390 | 100 | 119 | 99 | 138 | 99 | 176 |

### Reference-derived constraints carried through the audit

The original map and card/footer sheets, round7 drawing references, BRIEF, the ten round7 briefs named in AUDIT-R2 and their BUILD records informed the comparison. JOIN's hand-over intent was also read; ORIGIN and FRAMES clarify the explicitly excluded in-progress work. Historical failing tests in BUILD records were not treated as present failures. The governing constraints are the detailed map structure, thin non-scaling line hand, Ink/Paper/Red hierarchy, each place's own palette, actual career facts, original myth-derived art, same-object motion, button/key journey control, light-only nova rhythm, and name behavior continuous with the hero. No outside visual reference contributed factual content.

The read-only UI-audit and motion-playbook skills informed evidence quality, spatial continuity, timing and staging. The audit brief overrides their narrower output/path defaults. No external UI CLI discovery or network research was attempted. The independent design-critique workflow was not run because this task explicitly forbids other reviewers/agents. No substitute score or fabricated passing gate is offered.

### What could not be checked or was deliberately left out

- **Physical phone:** This is local headless Edge with the required CSS dimensions and touch emulation, not Dan's Android WebView. Its hardware lag, compositor tile loss, actual browser/system bars, thermal conditions and touch ergonomics remain unverified. DPR 2 was additionally checked for the small game drawings; this does not reproduce the physical device.
- **Felt speed:** Real-time screenshots have capture overhead, and some independent capture processes overlapped. No p95, sub-100 ms response, dropped-frame, GPU, or slow-phone performance pass is claimed. K-column U entries mean exactly this.
- **Assistive technology:** No screen-reader listening session, switch-control session, forced-colors check or comprehensive browser-zoom/text-resize pass. Visible focus and selected semantic/state reads are narrower checks.
- **Combinatorial state coverage:** Not every simultaneous pinch/sheet action, repeated reversal time, hidden-tab restoration, saved-storage revisit, blocked-storage condition, maximum rune level or fate was rendered. Fimbulwinter and Muspell heat were not drawn in the two game runs. Mokkurkalfi's threshold was crossed in the winning run, but its short-lived on-screen phase was not captured at a useful reading scale. These remain U, not passes.
- **Motion precision:** Stills/strips cannot establish every one-frame artifact or every easing derivative. Macro staging, object continuity and abrupt DOM removal are supported; 16 ms mathematical gates were not rerun as a substitute for seeing motion.
- **Other surfaces:** No hero internals, other checkout, current uncommitted redesign, external destinations, third-party source service or other auditors' reports were inspected.
- **Known exclusions:** K1-K9 remain excluded, including the existing hammer outer-close defect and tablet VIDEO clipping. Placeholder copy and deliberately inert prototype links are not defects. H47's literal color restriction conflicts with specific approved uses, recorded as R rather than invented new findings.
- **Audit tooling correction:** One early `details-dan` attempt dispatched a synthetic pointer with no active capture, generating one audit-induced browser error. It then attempted a now-hidden button. The invalid rune-complete/flip/poster and offscreen-well frames from that run were discarded. Native-touch replacements in `corrected-dan` completed with zero page errors. No product finding relies on that error. Other successful capture-run logs report zero captured page errors; this is not an exhaustive console audit.
- **Filesystem/tool limits:** Product packers, installs, source-writing tests, git status/diff helpers that mutate state, network tools and other agents were not run. RTK's normal persistent tracking was omitted under the stricter output-location constraint. The supplied capture tool was copied and extended only in this run folder. HTTP(S) page requests were blocked and browser background-network flags disabled. The only browser-control connection was the brief-authorized loopback CDP connection. Browsers were closed after capture. `git log` confirmed the revision and `git diff --stat 7d81592` returned no tracked differences.

### Read-only outcome

No change, addition or deletion was made in either product checkout. All explicit script, image, data, note and report writes are in `C:\Users\Admin\Documents\Portfolio\journey-map-runs\astra-look\`; browser temporary profiles use the permitted system-temp exception. The result is an audit with proposed fixes, not an implementation or an overall approval.

## 6. Top findings (under 300 words)

The highest-priority problem is the hint layer: an unused exploration hint masks the real instructions on first use, then replaces them with stale zoom instructions after Explore. The wayfinder also loses its purpose: highlighted stops have no visible names on desktop and are off-screen on the phone.

Reduced-motion phone visitors can see only the early years of the timeline. Focused landmark labels fade below comfortable reading contrast. Small game/rune controls miss the project's 44 px target requirement.

Yggdrasil needs a targeted drawing pass: preserve the strong roots and actors, unify the branch joins, and turn the five cloud-like puffs into a convincing ash canopy. The final phone/tablet X view slices Toronto, landscape composition breaks, and the beacon's last reading collides with explored terrain/chest states.

Motion polish remains beyond the known hammer-close defect: popups disappear instantly, manual reel exit skips its iris, game state panels cut, the win panel covers the boss fall, and all-found celebration interrupts the final discovery with a camera round trip.

The report records 16 additional findings and 710 element/state rows. Known in-progress issues are excluded. There is no blanket visual, accessibility or performance pass.
