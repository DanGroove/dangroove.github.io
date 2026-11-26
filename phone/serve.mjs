// Serves this folder on 127.0.0.1:8765 only (no firewall prompt). Stop with Ctrl+C or by killing the process.
import { createServer } from 'node:http'; import { readFileSync, existsSync } from 'node:fs'; import { join, dirname, basename } from 'node:path'; import { fileURLToPath } from 'node:url';
const dir = dirname(fileURLToPath(import.meta.url));
createServer((q, s) => { const f = join(dir, basename(decodeURIComponent(new URL(q.url, 'http://x').pathname)) || 'fps.html');
  if (!f.endsWith('.html') || !existsSync(f)) { s.writeHead(404); return s.end(); }
  s.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }); s.end(readFileSync(f)); })
  .listen(8765, '127.0.0.1', () => console.log('serving ' + dir + ' on http://127.0.0.1:8765'));
