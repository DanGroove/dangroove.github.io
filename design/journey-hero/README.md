# Journey hero: design files

The hero at the top of the journey page. Four bars, one for each craft, open the page as flat stripes, fold into a deck, and then
keep re-forming on a twelve second loop: a swatch fan, a clapperboard, a turning stack, a window.

This folder is the design, and the tools for holding a build up against it. None of it is published: the site's build only copies `public/`.

## What is where

| Path | What it is |
| --- | --- |
| `rough-cut/` | The design, moving: one page with its markup, CSS and player, drawing in SVG. The site's page has to match it |
| `frames/` | Screenshots of the rough cut at held moments. The number in each name is the time in seconds |
| `tools/` | Review tools, described below |
| `BRIEF.md` | The brief the first build of the page was made from |
| `../../public/journey/hero/engine.mjs`, `timeline.mjs`, `layout.mjs` | The choreography itself. The rough cut and the site run the same three files, so there is one copy of every number |

## Looking at it

Browsers do not load modules from disk, so serve the repository:

```
node design/journey-hero/tools/serve.mjs
```

- `http://localhost:4173/design/journey-hero/rough-cut/` is the rough cut
- `http://localhost:4173/public/journey/` is the page as built for the site

Add `?t=6` to either address to hold the moment six seconds in. The opening runs from 0 to 3: the stripes draw on, hold, and fold
into the deck. Each craft then has three seconds: graphic design until 5, video until 8, motion until 11, UX/UI until 14, and round again.

## The tools

`serve.mjs` and `checks.mjs` need only Node. The others drive a real browser through Playwright, which is not a dependency of this
repository: they run where it is installed globally, as it is on the cloud review machine.

The sizes they use include phones as a browser shows them (390 x 664 rather than 390 x 844): a phone's first screen is the screen
less the browser's bars, and the hero has to fit that.

| Tool | What it answers |
| --- | --- |
| `checks.mjs` | Do bars ever pass through each other? Does the paint order ever disagree with what is in front, or change where it shows? Does a bar ever come within 8px of the text? Run over every layout saved in `layouts.json` |
| `measure.mjs` | Where does a page put the text and the art at each of the screen sizes listed in `browser.mjs`? `rough --write` saves the rough cut's answer to `layouts.json`; `built` says where the site's page differs from it |
| `compare.mjs` | Does the built page show the same picture as the rough cut, at twenty held moments and four sizes? |
| `live.mjs` | Plays a page and uses it: timing, craft buttons, pause, stage, keyboard, resize, reduced motion |
| `shots.mjs` | Screenshots of a page at the moments you name |
| `sheet.mjs` | The contact sheet of six moments on desktop and phone that goes out for comments |
| `preview.mjs` | Packs a page into a single self-contained file, for a preview that has to travel as one file |

## Changing the motion

The numbers in `timeline.mjs` and `layout.mjs` are design decisions. After changing any of them:

1. `node design/journey-hero/tools/checks.mjs` has to print `all clean`. Paint order may only change at a moment when the bars it
   reorders are more than a gap apart on screen: `checks.mjs near <beat>` shows when that is.
2. If the page layout or the opening changed, `measure.mjs rough --write`, then `checks.mjs` again.
3. `compare.mjs` to see that the site still matches the rough cut, and `sheet.mjs` for a new sheet to review.
