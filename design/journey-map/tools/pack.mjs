// Packs the prototype into one offline file: dist/journey-map.html. Node, no dependencies.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FONT = join(ROOT, '..', '..', 'public', 'holding', 'fonts', 'outfit-latin-wght-normal.woff2');
const read = p => readFileSync(join(ROOT, p), 'utf8');
const dataUri = (abs, mime) => `data:${mime};base64,` + readFileSync(abs).toString('base64');
const MIME = { png: 'image/png', jpg: 'image/jpeg' };

// modules in dependency order, found from their import lines
const IMPORT = /^import\s*\{[^}]*\}\s*from\s*'\.\/([\w-]+\.mjs)';\s*$/gm;
const order = [], seen = new Set();
const visit = f => { if (seen.has(f)) return; seen.add(f); for (const m of read(f).matchAll(IMPORT)) visit(m[1]); order.push(f); };
visit('main.mjs');

let js = order.map(f => `// ---- ${f} ----\n` + read(f).replace(IMPORT, '').replace(/^export\s+(const|let|function|class)\s/gm, '$1 ')).join('\n');
if (/^\s*(import|export)\s/m.test(js)) throw new Error('an import or export line was left in the packed script');
js = js.replace(/(['"`])(assets\/[\w\/.-]+\.(png|jpg))\1/g, (m, q, p, ext) => q + dataUri(join(ROOT, p), MIME[ext]) + q);
if (/<\/script/i.test(js)) throw new Error('script contains a closing script tag');

let css = read('map.css').replace(/url\(\.\.\/\.\.\/public\/holding\/fonts\/outfit-latin-wght-normal\.woff2\)/, () => `url(${dataUri(FONT, 'font/woff2')})`);
let html = read('index.html')
  .replace('<link rel="stylesheet" href="map.css">', () => `<style>\n${css}\n</style>`)
  .replace('<script type="module" src="main.mjs"></script>', () => `<script type="module">\n${js}\n</script>`);

const banned = ['src="http', 'url(http', '@import', 'fetch(', 'mailto:', 'href="http'];
const hits = banned.filter(b => html.includes(b));
if (hits.length) throw new Error('packed file contains: ' + hits.join(', '));
if (/assets\/|\.woff2\)|src="main\.mjs"|href="map\.css"/.test(html.replace(/data:[^'"`)]+/g, ''))) throw new Error('a local file reference was left unpacked');
mkdirSync(join(ROOT, 'dist'), { recursive: true });
writeFileSync(join(ROOT, 'dist', 'journey-map.html'), html);
console.log(`packed ${order.join(', ')}\ndist/journey-map.html ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
