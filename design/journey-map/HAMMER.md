# Journey map, round 7 part B: the board game becomes a hammer-throwing shooter with roguelike runs

Read this whole file before writing anything. Read `findboard.mjs`, `tafl.mjs`, `findkit.mjs`, `finds.mjs`, `findall.mjs`, `data.mjs` (the `FINDS`, `FIND_COPY`, `FIND_PLAY` and `C` tables), `art.mjs` (the `tafl()` drawing, `runeGlyph`, `RUNES`), `map.css` (the board's rules) and `tools/finds-test.mjs` as well. `FINDS.md` section 10 and `FINDS-BUILD.md` say how the board came to be. Part A of this round (`EXPLORE.md`) is built just before you; do not undo any of it.

## 1. Why

Dan, on preview version 6: "lets turn the game into a space invaders like game but lets have it have some depth with roguelike aspects". The game is the hnefatafl board near Laurier (Laurier is where Dan studied game design). It becomes a fixed shooter (one thrower along the bottom, a formation that marches side to side and steps down) with runs that differ every time: runes to choose between waves, fates that bend a wave, elites, a boss, and one life of hearts per run.

It must be its own game in that genre. Nothing from Space Invaders or any other game: no pixel aliens, no green bunkers, no saucer, none of its names, sounds or layout tricks. Everything here comes from Norse mythology itself, drawn in this map's own line style. Nothing from God of War or any other game, film or show.

## 2. Hard rules

The sandbox on this machine is off, so these matter.

- Change files only inside `design/journey-map/`, and only these:
  - `data.mjs`, `art.mjs`, `finds.mjs`, `findkit.mjs`, `findall.mjs`, `map.css`, `tools/check.mjs`, `tools/finds-test.mjs`
  - new: `hammer.mjs` (the game's rules, pure), `findhammer.mjs` (the find, its sheet, input and drawing), `tools/hammer-test.mjs`, `HAMMER-BUILD.md`
  - delete: `tafl.mjs`, `findboard.mjs`, `tools/tafl-test.mjs`
  - written by the pack tools: `joined.html`, `dist/journey-map.html`, `dist/journey-joined.html`
- Never change anything in `hero-copy/`, `reference/` or `assets/`, any other `.md` file, `index.html`, or any module not listed (`main.mjs`, `trip.mjs`, `steps.mjs`, `explore.mjs`, `footname.mjs`, `footer.mjs`, `depth.mjs`, `stars.mjs`, `cards.mjs`, `timeline.mjs`, `join.mjs`, `pace.mjs` and the other find modules stay as they are). Change `tools/pack.mjs` or `tools/pack-joined.mjs` only if packing fails without it, and say why.
- Never touch any other path on the machine. Never run git. Never install anything. No network access, at build time or at run time.
- Do not start reviewer agents or sub-agents, even if your global instructions say to. The review happens elsewhere, in a real browser. Do not leave a server running. Do not claim a visual check you did not make.
- You may run `node` on files inside `design/journey-map/`.
- Module style, as now (`tools/check.mjs` enforces it): named exports and named imports only, each import on one line from a sibling file, no default exports, no dynamic imports, no top-level await, every top-level name unique across all modules, no colour literal outside `data.mjs`, none in `map.css`. Every line of copy, every number you tune, every timing and every drawing path lives in `data.mjs` (drawings may be built in `art.mjs` from data, as now).
- `hammer.mjs` is pure: no DOM, no `window`, no `Math.random` (take a seeded random), no clock (time comes in as `dt`), so Node can run whole games.
- No per-frame layout reads in anything the frame loop calls.
- If a rule stops you from doing something the plain way, leave that thing out and say so in your report. Do not work around a rule.
- Plain ASCII punctuation in `HAMMER-BUILD.md`. In copy shown to visitors, Norse names keep their letters (Mjölnir, Bifröst, Járngreipr, Hrímþursar, Múspell, Mökkurkálfi).

## 3. The find on the map

- The find's id becomes `hammer` everywhere (it was `tafl`): the `FINDS` row keeps `n: 0`, `x: 112`, `y: 222` and its view; its label becomes `FIND_COPY`-style draft copy: "Mjölnir on a stone near Laurier. Press it to hold the bridge." Its hint (`FIND_COPY.hints.hammer`): "Press the hammer to play." The finds still number eleven, and finding all eleven still runs the finish.
- The drawing (`art.mjs`, replacing `tafl()`): Mjölnir standing head down on a low flat stone, in the map's line style: a short handle (in the myth it came out short), a ring at the handle's end, a head wider at its two faces with a band of simple knotwork lines, about the size the board was. Idle: every few seconds a tiny spark crackles at the head (two or three short Paper strokes that flick and go). When the pointer comes near (`attend`, as other finds do), the hammer trembles as if it wants to be lifted. When the horn's sound reaches it (`hear`), it rings: a short hop and a spark.
- A press counts the find as found and opens the game's sheet, growing from the find the way the board's sheet does. Escape and Close close it, as with every sheet.

## 4. The game

### 4.1 The field

A playfield of 300 x 400 units, drawn on a `<canvas>` inside the sheet at the device's pixel ratio (at most 2), scaled to the canvas box. Ink ground, Paper line art (about 1.2 px lines at the box's scale), Dim and Note for quiet parts, `C.warm` for fire. No Red anywhere in the game (Red stays for the traveller, the X, the find markers and the playhead). At the bottom, Bifröst: three thin parallel arcs in Dim and Note across the field (the bridge, never in rainbow colours), with the thrower on it.

### 4.2 The thrower and the hammer

- The thrower is Járngreipr, Thor's iron glove: a fist with a flared cuff and rivets, Paper outline, about 20 x 14 units, moving along the bridge (x from 16 to 284). It holds Mjölnir.
- Throw: Mjölnir leaves the glove straight up, spinning, at `HAMMER.throw.speed`. It hits the first foe it meets (1 damage), or reaches the top, and turns back. It flies back to the glove wherever the glove now is, steering toward it (`HAMMER.throw.back`, `turn`), and the glove catches it. It also hits foes on the way back (each foe at most once per throw). Only one hammer, so a throw that misses takes longer to come back: that is the game's skill.
- Holding the throw input throws again each time the hammer is caught.
- A hit flashes the foe, throws a few sparks and shakes the field slightly (`HAMMER.fx`; no shake and no flash under reduced motion).

### 4.3 The foes (draw each as Paper line art, original, about 18 x 14 units)

| kind | name in copy | hearts | silver | what it does |
|---|---|---|---|---|
| draugr | Draugr | 1 | 10 | drops bone shards straight down, slow |
| rime | Rime giant | 2 (cracks after the first hit) | 20 | drops icicles straight down, fast |
| fire | Son of Múspell | 1 | 15 | drops embers that split in two, angled apart, halfway down |
| wolf | Wolf | 1 | 25 | from wave 3: now and then a front wolf leaves the ranks and runs at the glove on a curve, then goes back to its place if it misses |
| chief | Giant chief | 4 | 60 | from wave 4: a rune on its brow, drops a fan of three icicles; when it falls, the foes beside it stop for a moment |

The formation: columns 26 units apart, rows 22 apart, starting near the top. It marches sideways; when an end foe reaches the side margin, every foe steps down and the march turns. It speeds up as foes fall (`speed x (1 + HAMMER.march.boost x share fallen)`). Shots come from the lowest foe in a random column, at the wave's rate, with a cap on how many are falling at once.

The shield wall: three low walls of overlapping round shields above the bridge, made of small cells. Foes' shots and foes that march into them knock cells out; the hammer passes over them. They come back whole at the start of each wave.

A Valkyrie rides across the top every `HAMMER.valkyrie.every` seconds (a range): one hit and she leaves a gift, one heart (up to the most) and `HAMMER.valkyrie.silver` silver.

### 4.4 A run

- Hearts: start at 3, at most 5. A shot or a running wolf that touches the glove takes one heart, then the glove flickers and cannot be hit for `HAMMER.hurt` seconds. No hearts left, or any foe reaching the bridge: the run is over.
- Seven waves. Waves 1 to 6 are formations; wave 7 is the boss. Each wave's rows, kinds, gaps and elites are drawn from the run's seed within that wave's row of `HAMMER.waves` (sizes, the kinds allowed with their weights, march speed, shot rate, shots at once), so no two runs look alike.
- After each of waves 1 to 6: "Wave {n} held. Take a rune." Three runes, drawn at random from the pool (never a rune already at its top level), each shown as a card: the rune drawn large (`runeGlyph`), its name, one line of what it does (with its next level's number). Pick one by press or the 1, 2 or 3 key. Then the next wave.
- Fates: from wave 2, a wave has a `HAMMER.fates.chance` chance of a fate (never the same one twice in a run), named at the wave's start:
  - Fimbulwinter: everything moves slower in the cold, the glove too.
  - Múspell's heat: embers split twice.
  - Wolf-age: wolves run in packs.
  - Shield-maidens: the shield wall stands doubled.
  - Hel's tide: a fallen draugr rises once.
- Silver is the score: each foe's silver, a bonus for each wave held (`50 x wave`), and a bonus for a wave held without losing a heart.
- The end: "Hrungnir falls. The bridge holds." when the boss falls; "The bridge fell at wave {n}." or "Your hearts gave out at wave {n}." otherwise. Then the run's silver, foes felled, runes taken (drawn small), the best run so far (kept in `localStorage` under `jm-hammer-best`, every read and write in try/catch; without storage it lives for the page), and the slot `FIND_COPY.hammerFact` (the board's "A fact from the game design year goes here.", marked YOURS TO WRITE, as now). Buttons: "New run" and "Close".

### 4.5 The runes (each up to three levels)

Elder Futhark, from the map's own `RUNES`. Exactly these twelve, with these meanings:

| rune | name | does, per level |
|---|---|---|
| ᚦ th | Thurisaz, thorn | the hammer goes through one more foe on its way up |
| ᚱ r | Raidho, ride | the hammer flies 20% faster, out and back |
| ᚲ k | Kenaz, torch | a hit sets the foe burning: 1 more damage after 0.8 s, which spreads to one more neighbour |
| ᚷ g | Gebo, gift | one heart now and one more at most (two levels) |
| ᚺ h | Hagalaz, hail | when the hammer turns back it throws two hail shards sideways (two more per level), 1 damage each |
| ᚾ n | Naudiz, need | with one heart left, the hammer hits twice as hard (three times at level 2; two levels) |
| ᛁ i | Isa, ice | foes and their shots move 12% slower |
| ᛃ j | Jera, harvest | holding a wave heals one heart |
| ᛇ ei | Eihwaz, yew | the hammer hits one harder on its way back |
| ᛚ l | Laguz, water | the hammer bends toward the nearest foe on its way up |
| ᛞ d | Dagaz, day | once per level in a run, a blow that would end the run instead clears every falling shot and leaves one heart |
| ᛖ e | Ehwaz, horse | the glove moves 20% faster |

Never use Algiz, Sowilo, Tiwaz or Othala in the game: those runes are also used as hate symbols, and Dan's portfolio must not show them.

### 4.6 The boss: Hrungnir

From the Prose Edda: the giant with a head and heart of stone, who fought Thor with a whetstone, with a giant of clay, Mökkurkálfi, made to stand with him.

- Hrungnir's stone head and shoulders fill the top of the field (about 120 units wide), moving slowly side to side. `HAMMER.boss.hearts` hearts, shown as a bar under him.
- He throws whetstone shards in fans aimed at the glove, every `HAMMER.boss.fan` seconds.
- At 60% Mökkurkálfi rises in the middle of the field and walks back and forth: he takes the hammer's throws (`HAMMER.boss.clay` hearts) and while he stands, Hrungnir throws faster.
- At 30% Hrungnir's three-cornered stone heart shows through a crack in his chest: hits on it count double. (Draw the heart as a plain three-cornered stone, never as interlocked triangles.)
- When he falls, the head cracks apart in pieces that fall away.

### 4.7 Controls

- Keys (while the playfield has focus): Left and Right or A and D move; Space, Up or W throws (hold to keep throwing); P pauses and resumes; 1, 2, 3 pick a rune. Every key the game uses stops there and never reaches the page's own keys (the journey's step keys). Escape closes the sheet, as for every sheet.
- Mouse: the glove follows the pointer's x over the field (at most `HAMMER.glove.follow` units a second, so it never jumps); a press throws, holding keeps throwing.
- Finger: touch and drag anywhere on the field: the glove follows the finger's x (the finger can stay above it); while a finger is down the hammer throws itself each time it is caught. `touch-action: none` on the field.
- The run pauses when the sheet closes, when the page is hidden, and on P. Opening the find again shows the paused run with Resume and New run.

### 4.8 The sheet

- About 330 units wide on a desktop, the playfield 300 x 400 inside it; on a phone it fits the width (`FIND_PLAY.kit.sheet.edge` from each side) and scales down as a whole. Ink, Paper text, the find sheets' border and radius.
- Above the field: "Wave 3 of 7" with the fate's name when there is one; on the right, the hearts (small Paper heart shapes, hollow when lost) and the silver.
- Over the field, as HTML (so it can be read and pressed): the start card (title "Hold the bridge", one line "Giants march on Bifröst. Throw Mjölnir at them; it always flies back to your hand.", the controls line for mouse and keys or for a finger, "Start a run"), the rune choice, the pause card, the end card.
- Under the field: a status line (`role="status"`, polite) that says what happens in words: a wave's start and fate, a heart lost, a rune taken, the end; then the buttons Pause and Close.
- The canvas has `role="img"` and a label; the cards' buttons are real buttons in the tab order; focus moves to the start button or the field when the sheet opens.
- All copy is draft, in `FIND_COPY.hammer` (title, intro, controls, start, waveLine, fate names and lines, rune names and lines, runeTitle, runeKeys, pause, resume, newRun, close, lost, lostHearts, won, stats, best).

### 4.9 Running and drawing

- The game steps at a fixed `1/120` s (at most 8 steps per frame) only while the sheet is open and the run is not paused, from the find kit's frame (`o.tick`).
- Shots, sparks and shield cells live in pools made once; nothing is allocated per frame. Each foe kind, the glove, the hammer and the Valkyrie are drawn once to an offscreen canvas per scale and redrawn only on resize.
- Under reduced motion the game still plays (the visitor drives it), without shake, flashes, trails or sparks.

## 5. Data (`data.mjs`)

Remove the board's rows (`FIND_PLAY.tafl`, the `tafl*` copy) and add `HAMMER` (every number this brief names: throw, glove, march, waves, fates, valkyrie, boss, hurt, fx, the drawings' paths) and `FIND_COPY.hammer`, `FIND_COPY.hammerFact`, `FIND_COPY.hints.hammer`. Starting numbers are yours; section 6's bots decide where they end.

## 6. Checks before you finish

- `tools/hammer-test.mjs` (Node, on `hammer.mjs` alone):
  - The same seed and the same inputs give the same run, step for step.
  - Every wave's formation fits the field and keeps its row's rules; wave 7 is Hrungnir; Mökkurkálfi rises at 60% and the heart shows at 30%.
  - Each rune does what its row says (one check per rune, per level), and the four excluded runes never appear.
  - A steady bot (stays under the lowest foe's column, throws whenever it can, steps aside from any shot due to reach it within half a second, picks runes at random) over 200 seeded runs: reaches wave 4 in at least 60% and beats Hrungnir in 15% to 45%.
  - An idle bot (never moves, always throws) over 200 seeded runs: at least 80% end by wave 3.
  - Every run ends, inside 20 minutes of game time; no NaN; a step averages under 0.3 ms.
  - Tune `HAMMER` until these hold, and print the rates.
- `tools/finds-test.mjs`: replace the board's checks with the hammer find's (it is found on a press, its sheet opens and closes, the run pauses on close, the eleven finds still finish); everything else in it passes unchanged.
- `node tools/check.mjs`, `node tools/finds-test.mjs`, `node tools/hammer-test.mjs`, `node tools/steps-test.mjs`, `node tools/depth-test.mjs`, `node tools/explore-test.mjs` all pass.
- Pack both pages: `node tools/pack.mjs` and `node tools/pack-joined.mjs`.

## 7. Report: `HAMMER-BUILD.md`

What you built, file by file; the bots' rates; where you differ from this brief and why; anything you left out (and which rule stopped you); what a browser review should look at first. Plain ASCII punctuation.
