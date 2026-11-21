// A small static server for looking at the journey page while working on it. No dependencies.
//
//   node design/journey-hero/tools/serve.mjs [port]
//
//   http://localhost:4173/public/journey/                  the page as built for the site
//   http://localhost:4173/design/journey-hero/rough-cut/   the rough cut it has to match
//
// It serves the repository root, read only, to this computer only. Add ?t=6 to either address to hold a moment.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
// BUILT=/some/folder/ points the review tools at another copy of the built page (a path from the repository root, ending in a slash)
export const PAGES = { built: process.env.BUILT || '/public/journey/', rough: '/design/journey-hero/rough-cut/' };

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

// port 0 picks a free one. Resolves with { server, port, url }.
export function serve(port = 4173) {
  const server = http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return void res.writeHead(405).end();
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    } catch {
      return void res.writeHead(400).end();
    }
    let file = path.join(ROOT, pathname);
    if (file !== ROOT && !file.startsWith(ROOT + path.sep)) return void res.writeHead(403).end();
    fs.stat(file, (err, stat) => {
      if (!err && stat.isDirectory()) {
        if (!pathname.endsWith('/')) return void res.writeHead(301, { Location: pathname + '/' }).end();
        file = path.join(file, 'index.html');
      }
      fs.readFile(file, (err2, body) => {
        if (err2) return void res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not found');
        res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
        res.end(req.method === 'HEAD' ? undefined : body);
      });
    });
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => {
      const at = server.address().port;
      resolve({ server, port: at, url: `http://localhost:${at}` });
    });
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { url } = await serve(+(process.argv[2] || 4173));
  console.log(`built page  ${url}${PAGES.built}`);
  console.log(`rough cut   ${url}${PAGES.rough}`);
  console.log('Ctrl+C stops it.');
}
