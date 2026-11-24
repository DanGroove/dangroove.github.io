# A copy of the journey hero

This folder is a copy of the journey hero's second take. It is here so the map can be joined under the real hero without touching the original.

- Source: branch `claude/project-thread-avrkbm`, commit `3232c60` (round 19, L13, L13b, L14, L13c and L15), refreshed on 2026-11-24 from the first copy of `0f38758`. The refresh took every file from `3232c60` and merged the copy's own changes back into the two files that have them (see `CHANGES.md`); `loader-stars.mjs` and `export-sparks.mjs` are new in the copy because the player now imports them.
- The files sit at their own paths (`design/journey-hero/take-2/`, `public/journey/`, `public/holding/fonts/`), so every import resolves unchanged when this folder is the server root.
- Apart from the changes listed in `CHANGES.md` and marked `// JOIN:` in the code, every file is the source commit's byte for byte.
- The original is another thread's work. Nothing changed here goes back to it by itself.

To run it alone: from this folder run `node design/journey-hero/take-2/tools/page.mjs`, serve this folder as the root, and open `/design/journey-hero/take-2/.scratch/play.html`.
