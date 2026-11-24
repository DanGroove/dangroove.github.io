// Writes the joined page twice: joined.html (for development, served from the repository root) and
// dist/journey-joined.html (one offline file). The hero's markup comes from the copy's own pageMarkup('play').
// Run: node tools/pack-joined.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { pageMarkup, TAKE, ROOT as HERO_ROOT, LOADER_CSS, LOADER_SKIP, LOADER_SCRIPT } from '../hero-copy/design/journey-hero/take-2/tools/page.mjs';
import { pack } from '../hero-copy/design/journey-hero/take-2/tools/preview.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(join(ROOT, p), 'utf8');
const dataUri = (abs, mime) => `data:${mime};base64,` + readFileSync(abs).toString('base64');
const MIME = { png: 'image/png', jpg: 'image/jpeg' };
const OUTFIT = join(HERO_ROOT, 'public/holding/fonts/outfit-latin-wght-normal.woff2');

// the hero section, exactly as the copy's page has it (with its loader inside it); the loader's style, skip switch and script
// go where the copy's page puts them: the first two in the head, the script right before the hero's own.
const heroPage = pageMarkup('play');
const heroSection = heroPage.match(/<section class="hero[\s\S]*?<\/section>/)[0];
if (!/data-hero/.test(heroSection)) throw new Error('hero section not found in pageMarkup');
const HERO_CSS = 'hero-copy/public/journey/journey.css', TAKE_CSS = 'hero-copy/design/journey-hero/take-2/take-2.css';
const HERO_JS = 'hero-copy/design/journey-hero/take-2/play.mjs';

const page = (head, body) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Journey map, joined</title>
${head}
</head>
<body>
${body}
</body>
</html>
`;

// ---- joined.html: links and module scripts. The map's script comes first, so the hero is in the stage before its own runs.
const loaderHead = `<style>${LOADER_CSS}</style>\n<script>${LOADER_SKIP}</script>`, loaderBody = `<script>${LOADER_SCRIPT}</script>`;
const dev = page(
  ['map.css', HERO_CSS, TAKE_CSS, 'join.css'].map(f => `<link rel="stylesheet" href="${f}">`).join('\n') + '\n' + loaderHead,
  `<main id="jm"></main>\n${heroSection}\n<script type="module" src="join.mjs"></script>\n${loaderBody}\n<script type="module" src="${HERO_JS}"></script>`);
writeFileSync(join(ROOT, 'joined.html'), dev);

// ---- dist/journey-joined.html
// the map half, as tools/pack.mjs packs it, from join.mjs
const IMPORT = /^import\s*\{[^}]*\}\s*from\s*'\.\/([\w-]+\.mjs)';\s*$/gm;
const order = [], seen = new Set();
const visit = f => { if (seen.has(f)) return; seen.add(f); for (const m of read(f).matchAll(IMPORT)) visit(m[1]); order.push(f); };
visit('join.mjs');
let mapJs = order.map(f => `// ---- ${f} ----\n` + read(f).replace(IMPORT, '').replace(/^export\s+(const|let|function|class)\s/gm, '$1 ')).join('\n');
if (/^\s*(import|export)\s/m.test(mapJs)) throw new Error('an import or export line was left in the packed map script');
mapJs = mapJs.replace(/(['"`])(assets\/[\w\/.-]+\.(png|jpg))\1/g, (m, q, p, ext) => q + dataUri(join(ROOT, p), MIME[ext]) + q);
const mapCss = read('map.css').replace(/url\(\.\.\/\.\.\/public\/holding\/fonts\/outfit-latin-wght-normal\.woff2\)/, () => `url(${dataUri(OUTFIT, 'font/woff2')})`);
// the hero half, as the copy's previewMarkup() packs it: its CSS with Outfit inlined, take-2.css, the hero fonts, play.mjs packed
const heroCss = read(HERO_CSS).replace(/url\([^)]*\)/g, () => `url(${dataUri(OUTFIT, 'font/woff2')})`);
const faces = Object.fromEntries(['gelasio-400.woff2', 'gelasio-700.woff2', 'rokkitt-800.woff2'].map(f => [f, dataUri(join(TAKE, 'fonts', f), 'font/woff2')]));
const heroJs = pack(join(TAKE, 'play.mjs'));
const cleanSection = heroSection.replace(/\s+href=(['"])[\s\S]*?\1/g, '').replace(/<style>[\s\S]*?<\/style>/g, '');
for (const js of [mapJs, heroJs, LOADER_SCRIPT]) if (/<\/script/i.test(js)) throw new Error('script contains a closing script tag');

const html = page(
  [mapCss, heroCss, read(TAKE_CSS), read('join.css')].map(c => `<style>\n${c}\n</style>`).join('\n') + '\n' + loaderHead,
  `<main id="jm"></main>\n${cleanSection}\n<script>globalThis.__heroFonts=${JSON.stringify(faces)};</script>\n<script type="module">\n${mapJs}\n</script>\n${loaderBody}\n<script type="module">\n${heroJs}\n</script>`);

// the address rule: no mailto, no href with an address, no http address but the SVG and XLink namespaces
const bare = html.replace(/data:[^'"`)]+/g, '');
const problems = [];
if (/mailto/i.test(html)) problems.push('mailto');
if (/href\s*=\s*["'][^"']*(@|:\/\/)/i.test(bare)) problems.push('href with an address');
const https = [...bare.matchAll(/https?:\/\/[^\s'"`)<>]*/gi)].map(m => m[0]).filter(u => !/^http:\/\/www\.w3\.org\/(2000\/svg|1999\/xlink)$/.test(u));
if (https.length) problems.push('addresses: ' + [...new Set(https)].join(', '));
if (/<link\b|<script[^>]*\ssrc=|@import|assets\/[\w\/.-]+\.(png|jpg)|url\((?!data:|#|\$\{)[^)]*\.woff2/i.test(bare)) problems.push('an outside file reference');
if (problems.length) throw new Error('dist/journey-joined.html: ' + problems.join('; '));

mkdirSync(join(ROOT, 'dist'), { recursive: true });
writeFileSync(join(ROOT, 'dist', 'journey-joined.html'), html);
console.log(`joined.html written\nmap modules: ${order.join(', ')}\ndist/journey-joined.html ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
