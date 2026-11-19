// Pack the player as one offline frame. The small bundler supports this project's named ES modules.
// node design/journey-hero/take-2/tools/preview.mjs <out.html>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { ROOT, TAKE, pageMarkup, outputPath } from './page.mjs';

// Split a declaration only at its own level, leaving strings, templates and nested expressions intact.
function splitTop(source, separator) {
  const out = [];
  let start = 0, depth = 0, quote = '', comment = '';
  for (let i = 0; i < source.length; i++) {
    const c = source[i], n = source[i + 1];
    if (comment) {
      if (comment === 'line' && c === '\n') comment = '';
      else if (comment === 'block' && c === '*' && n === '/') { comment = ''; i++; }
      continue;
    }
    if (quote) { if (c === '\\') i++; else if (c === quote) quote = ''; continue; }
    if (c === '/' && n === '/') { comment = 'line'; i++; continue; }
    if (c === '/' && n === '*') { comment = 'block'; i++; continue; }
    if ('\'"`'.includes(c)) { quote = c; continue; }
    if ('([{'.includes(c)) depth++;
    else if (')]}'.includes(c)) depth--;
    else if (c === separator && depth === 0) { out.push(source.slice(start, i)); start = i + 1; }
  }
  out.push(source.slice(start));
  return out;
}

export function pack(entry) {
  const modules = new Map(), ordered = [], visiting = new Set();
  function visit(file) {
    file = path.resolve(file);
    if (!file.startsWith(ROOT + path.sep)) throw new Error('module outside repository');
    if (visiting.has(file)) throw new Error('module cycle: ' + path.relative(ROOT, file));
    if (modules.has(file)) return modules.get(file);
    visiting.add(file);
    let source = fs.readFileSync(file, 'utf8');
    const imports = [];
    source = source.replace(/^import\s+\{([^}]+)\}\s+from\s+(['"])([^'"]+)\2;\s*$/gm, (_all, names, _quote, ref) => {
      if (!ref.startsWith('.')) throw new Error('only relative imports can be packed: ' + ref);
      const dependency = visit(path.resolve(path.dirname(file), ref));
      imports.push(`const { ${names.trim().replace(/\s+as\s+/g, ': ')} } = ${dependency};`);
      return '';
    });
    if (/^import\s/m.test(source)) throw new Error('unsupported import in ' + file);
    const exports = new Set();
    for (const m of source.matchAll(/^export\s+(?:async\s+)?function\s+(\w+)/gm)) exports.add(m[1]);
    for (const m of source.matchAll(/^export\s+(?:const|let|var)\s+/gm)) {
      const declaration = splitTop(source.slice(m.index + m[0].length), ';')[0];
      for (const part of splitTop(declaration, ',')) {
        const name = part.trim().match(/^(\w+)\s*=/)?.[1];
        if (!name) throw new Error('unsupported export declaration in ' + file);
        exports.add(name);
      }
    }
    source = source.replace(/^export\s*\{([^}]+)\};?\s*$/gm, (_all, names) => {
      names.split(',').map(n => n.trim()).filter(Boolean).forEach(name => exports.add(name.replace(/\s+as\s+/, ': ')));
      return '';
    });
    source = source.replace(/^export\s+/gm, '');
    const id = '__module' + ordered.length, isEntry = file === path.resolve(entry);
    ordered.push(`// ${path.relative(ROOT, file).split(path.sep).join('/')}\nconst ${id} = ${isEntry ? 'await (async ' : '('}function () {\n${imports.join('\n')}\n${source}\nreturn { ${[...exports].join(', ')} };\n})();`);
    modules.set(file, id); visiting.delete(file);
    return id;
  }
  visit(entry);
  return ordered.join('\n').replace(/<\/script/gi, '<\\/script');
}

export function previewMarkup() {
  let html = pageMarkup('play');
  const font = fs.readFileSync(path.join(ROOT, 'public/holding/fonts/outfit-latin-wght-normal.woff2')).toString('base64');
  const css = fs.readFileSync(path.join(ROOT, 'public/journey/journey.css'), 'utf8').replace(/url\([^)]*\)/g, `url(data:font/woff2;base64,${font})`);
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
  const clean = body.replace(/\s+href=(['"])[\s\S]*?\1/g, '').replace(/<style>[\s\S]*?<\/style>/g, '');
  const faces = Object.fromEntries(['gelasio-400.woff2', 'gelasio-700.woff2', 'rokkitt-800.woff2'].map(file => [file, 'data:font/woff2;base64,' + fs.readFileSync(path.join(TAKE, 'fonts', file)).toString('base64')]));
  return `<title>Journey hero preview</title>
<meta name="claude:viewport-fit-sides" content="cover">
<style>${css}</style>
<style>
html,body,main{height:100%}
.hero{min-height:max(100%,640px)!important}
@media(max-width:719px){.hero{min-height:100%!important}}
</style>
${clean.trim()}
<script>globalThis.__heroFonts=${JSON.stringify(faces)};</script>
<script type="module">${pack(path.join(TAKE, 'play.mjs'))}</script>
`;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!process.argv[2]) throw new Error('usage: preview.mjs <out.html>');
  const out = outputPath(process.argv[2]), html = previewMarkup();
  fs.writeFileSync(out, html);
  console.log(`${out} (${Math.ceil(Buffer.byteLength(html) / 1024)} KB)`);
}
