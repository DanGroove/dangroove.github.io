// The built hero's markup, with only its script swapped. Generated pages stay in this prototype.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const TAKE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const ROOT = path.resolve(TAKE, '../../..');

export function outputPath(name) {
  const file = path.resolve(name);
  if (!file.startsWith(TAKE + path.sep)) {
    throw new Error('output must be inside design/journey-hero/take-2/');
  }
  const relative = path.relative(TAKE, file).toLowerCase().split(path.sep).join('/');
  if (['motion.md', 'motion-2.md', 'corrections-1.md', 'corrections-2.md', 'corrections-3.md', 'corrections-4.md', 'corrections-5.md'].includes(relative) || ['.scratch/crit', 'review/hardware'].some(p => relative === p || relative.startsWith(p + '/'))) throw new Error('the briefs and protected review records are read only');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  return file;
}

export function pageMarkup(kind = 'play') {
  if (!['play', 'stills'].includes(kind)) throw new Error('unknown page kind');
  let html = fs.readFileSync(path.join(ROOT, 'public/journey/index.html'), 'utf8');
  html = html.replace('<link rel="stylesheet" href="journey.css" />', '<link rel="stylesheet" href="journey.css" />\n    <link rel="stylesheet" href="/design/journey-hero/take-2/take-2.css" />');
  html = html.replace(/\s*<link rel="modulepreload"[^>]*>/g, '').replace(/<noscript>[\s\S]*?<\/noscript>/g, '');
  html = html.replace('<script type="module" src="hero/hero.mjs"></script>', `<script type="module" src="/design/journey-hero/take-2/${kind}.mjs"></script>`);
  // Dan, 21 November: his welcome under the name, the greeting on its own line. The first take in public/ keeps its own line.
  html = html.replace(/(<p class="hero-lede" data-lede>)[\s\S]*?(<\/p>)/, '$1\n            Hey, I&rsquo;m Dan! <span class="hero-lede-more">Welcome to my portfolio, where I show how I go from first sketch to final cut, and everything in between.</span>\n          $2');
  return html.replace('<meta charset="utf-8" />', '<meta charset="utf-8" />\n    <base href="/public/journey/" />');
}

export function writePage(kind = 'play') {
  const file = outputPath(path.join(TAKE, '.scratch', kind + '.html'));
  fs.writeFileSync(file, pageMarkup(kind));
  return '/' + path.relative(ROOT, file).split(path.sep).join('/');
}

export const writeStillsPage = () => writePage('stills');
export const writePlayerPage = () => writePage('play');

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  console.log(writeStillsPage());
  console.log(writePlayerPage());
}
