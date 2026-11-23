# Join the map under the real hero

Read `BRIEF.md` and `BUILD.md` first for what the map is. This brief adds one thing: a page where Dan's real hero sits on top and the map follows, so he can scroll the true transition.

## 1. Why

Dan, 22 November: "Are you building underneath the hero or separately?", then "I think I need to see the scroll transition to get a good feel for it", then "You can copy so you don't break the original".

So the hero is now in this folder as a copy. The original lives on another branch and is another thread's work. Never look for it, fetch it or change it.

## 2. Rules

- Write only inside `design/journey-map/`. Never write to `BRIEF.md`, `JOIN.md`, `reference/` or `assets/`.
- Inside `hero-copy/` make only the edits in section 5. Mark each with a `// JOIN:` comment and list it in `hero-copy/CHANGES.md` (file, what, why). Everything else in the copy stays byte for byte.
- Never run git. Never install anything. No network. No sub-agents or reviewers. Nothing from any game.
- The stand-in page (`index.html`, `dist/journey-map.html`) must keep working as it does now.
- Change nothing about the map after the overview: no new looks, copy or timings there.

## 3. What is in `hero-copy/`

A mirror of the hero's runtime at its own paths, so its imports resolve unchanged when `hero-copy/` is the server root:

- `hero-copy/design/journey-hero/take-2/`: `play.mjs` (the player and entry, top-level await, sets `window.__hero` and `window.__ready`), `stars.mjs` (the star field: `createField`, `createStars`), `sq.mjs` (WebGL2 renderer; it draws the stars first, then the scene, on one opaque canvas), `stage.mjs`, `art.mjs`, `entrance.mjs`, `labels.mjs`, `name-react.mjs`, `craft-wipe.mjs`, `page-layout.mjs`, `view.mjs`, `kit.mjs`, `stills.mjs`, `take-2.css`, `fonts/`, and `tools/page.mjs` (the hero's markup, `pageMarkup('play')`) and `tools/preview.mjs` (its one-file packer, `pack()` and `previewMarkup()`).
- `hero-copy/public/journey/`: `index.html` (markup source), `journey.css`, `hero/engine.mjs`. `hero-copy/public/holding/fonts/` holds Outfit.

It was checked to run on its own: `node hero-copy/design/journey-hero/take-2/tools/page.mjs`, serve `hero-copy/` as the root, open `/design/journey-hero/take-2/.scratch/play.html`. At 1440 by 900 it has 1200 stars. `?t=6` holds a frame.

You do not need to read `stage.mjs`, `art.mjs` or `sq.mjs` beyond the star shader in `sq.mjs` (`VERT_STARS`, `FRAG_STARS`).

## 4. What the visitor gets

One page, `joined.html`: one scroller and the map's one sticky stage. The hero section sits inside the stage and fills it, so the hero's box and the map's star canvas are the same rectangle.

1. **At the top** the page is the hero exactly as on its own page: entrance, loop, craft buttons, Pause, the name, and the stars with their parallax, stir, hold to gather and release.
2. **The leave** (the `hero` act, 100): everything the hero shows except its stars rises with the scroll, one for one, the way an ordinary page scrolls: nav, name, welcome, craft list, the cue and Pause, the 3D scene with its floor, and the scene's labels. The stars stay behind as the sky. They keep only the hero's own depth drift (the nearest rise 12 percent of the scroll).
3. **The fall** (the `handoff` act, 120): the same stars become the map. Every star keeps its identity from the hero's field to its place on the map, starts exactly where the hero drew it, and goes back there when the visitor scrolls up again.
4. **From the overview on** the page is the map as built.

Nothing else in `ACTS` changes.

## 5. The only edits allowed in the copy

1. **A lift, in `play.mjs`.** A number of CSS px. The view handed to `renderer.draw` and `callouts.draw` is a copy of the layout's view with `cy` less the lift (never mutate the cached view; `layout.cover` keeps the unlifted one). The hero's own DOM (`.hero-nav`, `.hero-say`, `.hero-foot`) moves by the same amount through a CSS variable `--leave` on the hero, applied in `join.css` with the `translate` property, because the hero's CSS already uses `transform`. `measure()` sets `--leave` to 0 while it reads geometry, then restores it. A lift above 0 first ends the entrance (as Pause does) and releases any hold, so every star is out and free before anything moves. When the loop is paused or motion is reduced, a change of lift still redraws.
2. **Away, in `play.mjs`.** A flag. While away, `running()` and the stars' `available()` are false and nothing draws. The join hides the hero as well (`visibility: hidden`), so it takes no pointer or focus. Coming back clears the flag and calls `schedule()`.
3. **Pinned, in `stars.mjs` `createStars`.** The hero no longer scrolls with the window, so a pointer's place is `clientY - box.top`, and the scroll term the renderer gets is the lift, not the window's scroll.
4. **What is drawn, in `stars.mjs`.** Add `drawn(i, out)`: where the renderer draws star `i`, in the hero's own px. It is the vertex shader's `p`: home, plus the star's own offset, less the parallax by its depth weight, less the scroll term. Add `look(i)`: its drawn size, colour and opacity, following the shader (size across by depth, paper or red mixed into ink by depth, and the mark weight for a star still flying home).
5. **One handle, in `play.mjs`.** `window.__heroJoin = { setLeave(px), setAway(on), stars: { count, drawn, look } }`, set once the hero is ready.

Not allowed: any change to `sq.mjs`, `stage.mjs`, `art.mjs`, the entrance, the labels, the hero's CSS files, or any timing.

## 6. The map's side

- **Star source.** `stars.mjs` can build its list from the hero's stars instead of the stand-in: the count comes from the hero (up to 2000), each star's start is read from `drawn(i)` on every frame of the fall, and its start look from `look(i)`. On an ink ground, paper at the mix's opacity is the same colour the hero draws.
- **Where the stars go.** Trail dots first, by the build's own rule. Then the sea sparkle, as many as the build has now. All the rest fall onto the coasts: spread evenly along the coast outlines, arriving before the coast line draws itself, then dissolving into the line as it passes them. If that reads as noise rather than a coast taking shape, fade the surplus out during the fall instead and say so. If the hero has fewer stars than the trail has dots (small phones), the missing dots fade up in place.
- **The traveller** starts as a real red star of the hero's field (the red one nearest the middle of the view) and grows from that star's look into the traveller's.
- **The switch.** During the leave the star canvas draws nothing, because the hero draws its own stars behind its scene. Over the last few percent of the leave the star canvas fades in, drawing the same stars in the same places, and at the end of the leave the hero goes away. Use the smallest overlap that makes the switch impossible to see, in both directions.
- **Pointer and order.** While the hero is present, every pointer event in the view reaches it as on its own page, and nothing of the map shows. Once it is away it takes none.
- **The first stars start to move within the first 3 percent of the fall**, so the view of stars alone is a beat, not a pause.
- **The footer** ends with about as many resting stars as the stand-in build has now: scale the share that stays, since the hero brings more stars.
- **Speed.** Up to 2000 stars at a steady 60 frames a second. Draw stars under 1.5 px as rectangles, and group the rest by colour and opacity rather than changing state per star. While the hero is away its loop must not run.
- **Reduced motion.** The leave still follows the scroll. The fall becomes a cross-fade from the sky to the map's own still.
- **One height.** Use the stage's height for the hero too. On a view shorter than 640 px the hero is squeezed; note it, do not solve it.

## 7. Files to deliver

- `join.mjs` and `join.css`: the join's own logic and rules. It waits for `window.__heroJoin`, since the hero's script has a top-level await.
- `joined.html`: the page for development. The hero's markup must come from the copy's `pageMarkup('play')`, not be retyped, so Dan's welcome line is the current one. A small tool may write the page.
- `tools/pack-joined.mjs`, which writes `dist/journey-joined.html`: one offline file. Follow the copy's `previewMarkup()` for the hero half (its CSS with Outfit inlined, `take-2.css`, `globalThis.__heroFonts`, `pack()` for `play.mjs`, every `href` removed) and the map's own packer for the map half. Two module scripts, so their top-level names cannot collide. The file must hold no `mailto`, no `href` with an address, and no `http` address except the SVG and XLink namespace strings.
- `hero-copy/CHANGES.md` and `JOIN-BUILD.md` (what you built, what you checked and how, what you left open).

## 8. Checks, in a real browser (at most three rounds)

Use Playwright and the Chromium already installed; screenshots at device scale 1 into the scratch folder you were given.

1. At scroll 0, with the same held frame (`__hero.seek(6)`), `joined.html` and the copy's own page show the same picture at 1440 by 900, within antialiasing.
2. Through the leave (0, 25, 50, 75, 100 percent): the name's top is its start less the scroll; the stars have moved only by their depth drift.
3. One pixel before and after the switch, the star field differs by less than you can see; report the largest pixel difference.
4. Through the fall (five steps), ending equal to the stand-in build's overview apart from the star count.
5. Back at scroll 0 after a trip to the overview: the hero is as it was, its loop runs, a 1.5 second hold still gathers stars (`__hero.stars.holding`), and a craft button still changes the craft.
6. While the hero is away, no frame of it is drawn.
7. The same at 390 by 664.
8. `dist/journey-joined.html` opens from the file system with no network and no console errors, and passes the address rule in section 7.

## 9. Report

Every file written; each edit to the copy; what each check showed, with numbers; where you departed from this brief and why; what is unfinished; the screenshot paths; the size of `dist/journey-joined.html`.
