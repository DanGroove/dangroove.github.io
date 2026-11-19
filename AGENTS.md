# Working in this repository

The personal portfolio site of Danial Endrawes, live at https://danialendrawes.com/.

## How the site is put together

- It is a Create React App project, published with GitHub Pages. The build copies everything in `public/` to the site as it is.
  Only `public/index.html` passes through the build, so only that file may use `%PUBLIC_URL%`. Every other file in `public/` must use relative addresses.
- `public/index.html` with `public/holding/` is the live home page, an "under construction" page. It is static HTML, CSS and JavaScript.
- `src/` is the previous React site. It still loads at `/?classic`.
- `public/journey/` is the journey page: static HTML, one stylesheet and ES modules. No framework, no dependencies, no build step.
- `design/` holds design references and review tools. Nothing in it is published.

## Rules

- **Never publish.** Merging does not publish the site; `npm run deploy` does. Do not run it. Only the owner decides when the site goes live.
- **Never change or delete `public/CNAME`.** Without it the site loses its domain.
- Leave the home page (`public/index.html`, `public/holding/`) and `src/` alone unless the task is about them.
- Do not add dependencies, frameworks or build steps unless the task asks for them.
- Work on the branch you were given. Never commit to or push `main` or `gh-pages`.
- Do not put secrets, tokens or personal details in the repository.

## The journey page

- The design files, the brief and the review tools are in `design/journey-hero/`. Start with its `README.md`.
- `public/journey/hero/engine.mjs`, `timeline.mjs` and `layout.mjs` are the design of the hero's motion, as code. Their numbers are
  design decisions. Do not change them unless the task is to change the motion, and after any change
  `node design/journey-hero/tools/checks.mjs` must print `all clean`.
- The brand: ink `#151314`, paper `#F7F6F3`, red `#C0262E` (small red text on ink is `#F0484F`), and the typeface Outfit, which is
  self-hosted in `public/holding/fonts/`. Square corners. Motion is hard edged: things cut or wipe, they do not fade, bounce or blur.

## Style

- Code is formatted to `.prettierrc`. The three design files above are the exception: they are laid out by hand, with one idea to a line.
- Write for the next reader: plain names, and comments that say why.
