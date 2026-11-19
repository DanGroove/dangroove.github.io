// Packs a page into one self-contained file: styles, scripts and the font all inline. For previews that have to travel as one file.
//
//   node design/journey-hero/tools/preview.mjs <built|rough> <out.html> [--frame] [--title "Journey hero preview"]
//
// --frame shapes the file for a host that wraps the page in a document of its own and shows it in a frame instead of a window:
// no doctype, html, head or body tags, the hero fills the frame it is given, and the page's own links are switched off.
// Scripts are bundled with esbuild, which npx fetches on first use.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { ROOT, PAGES } from './serve.mjs';

const args = process.argv.slice(2), which = args[0] === 'rough' ? 'rough' : 'built', out = args[1], frame = args.includes('--frame');
if (!out) { console.log('usage: preview.mjs <built|rough> <out.html> [--frame] [--title "..."]'); process.exit(1); }
const title = args.includes('--title') ? args[args.indexOf('--title') + 1] : null;
const dir = path.join(ROOT, PAGES[which]);
let html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');

const MIME = { '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.png': 'image/png' };
// every file a stylesheet points at goes inline
const inlineUrls = (css, from) => css.replace(/url\(\s*(["']?)([^"')]+)\1\s*\)/g, (all, _q, ref) => {
  if (/^(data:|https?:|#)/.test(ref)) return all;
  const file = path.resolve(from, ref.split(/[?#]/)[0]);
  return `url(data:${MIME[path.extname(file)] ?? 'application/octet-stream'};base64,${fs.readFileSync(file).toString('base64')})`;
});
function bundle(entry, code) {
  const run = spawnSync('npx', ['--yes', 'esbuild@0.25.0', ...(entry ? [entry] : ['--loader=js']), '--bundle', '--format=esm', '--target=es2022', '--log-level=warning'],
    { cwd: dir, input: code, encoding: 'utf8', maxBuffer: 1 << 26, shell: process.platform === 'win32' });
  if (run.status !== 0) throw new Error('esbuild failed:\n' + run.stderr);
  return run.stdout.replace(/<\/script/gi, '<\\/script');
}

html = html.replace(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi, tag => {
  const href = tag.match(/href=["']([^"']+)["']/)[1], file = path.resolve(dir, href);
  return `<style>\n${inlineUrls(fs.readFileSync(file, 'utf8'), path.dirname(file))}\n</style>`;
});
html = html.replace(/<style>([\s\S]*?)<\/style>/g, (_all, css) => `<style>${inlineUrls(css, dir)}</style>`);
html = html.replace(/[ \t]*<link\b[^>]*rel=["'](?:preload|modulepreload|icon|apple-touch-icon)["'][^>]*>\n?/gi, '');
html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (all, attrs, code) => {
  if (!/type=["']module["']/.test(attrs)) return all;
  const src = attrs.match(/src=["']([^"']+)["']/);
  return `<script type="module">\n${src ? bundle(src[1]) : bundle(null, code)}</script>`;
});

if (frame) {
  const styles = [...html.matchAll(/<style>[\s\S]*?<\/style>/g)].map(m => m[0]).join('\n');
  const head = html.match(/<head>([\s\S]*?)<\/head>/)[1], body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
  const early = [...head.matchAll(/<script\b[^>]*>[\s\S]*?<\/script>/gi)].map(m => m[0]).join('\n');
  const name = title ?? head.match(/<title>([\s\S]*?)<\/title>/)[1];
  html = `<title>${name}</title>
<meta name="claude:viewport-fit-sides" content="cover">
${styles}
<style>
html,body,main{height:100%}
.hero{min-height:max(100%,640px)!important}
@media (max-width:719px){.hero{min-height:100%!important}}
</style>
${early}
${body.replace(/<style>[\s\S]*?<\/style>/g, '').trim()}
<script>document.addEventListener('click', e => { const a = e.target.closest('a'); if (a && !/^https?:/.test(a.getAttribute('href') || '')) e.preventDefault(); });</script>
`;
} else if (title) html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);

fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
fs.writeFileSync(out, html);
console.log(`${out}  ${(html.length / 1024).toFixed(0)} KB`);
