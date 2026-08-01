// scripts/prerender.mjs
//
// Runs after `vite build`. This SPA serves the same index.html for every
// route, so crawlers that don't execute JavaScript (GPTBot, ClaudeBot,
// PerplexityBot, CCBot, and most others) see identical, generic content no
// matter which page they fetch.
//
// This script fixes that: it spins up a local static server for the built
// `dist/` folder, visits every URL listed in sitemap.xml with headless
// Chrome (so React, React Router, and react-helmet-async all run exactly
// as they would in a real browser), waits for the page to finish
// rendering, and writes the fully-rendered HTML to disk at the matching
// path (e.g. dist/services/index.html). Firebase Hosting serves a static
// file at that path before it ever falls back to the SPA rewrite rule, so
// each route now serves its own real content to every visitor — human,
// browser-executing crawler, or not.
//
// Root ("/") is processed last and written last, since the local server
// uses the original dist/index.html as its SPA fallback while every other
// route is still being rendered.

import puppeteer from 'puppeteer';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');
const PORT = 4173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

function readSitemapPaths() {
  const xml = readFileSync(join(DIST, 'sitemap.xml'), 'utf-8');
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
  return locs.map((loc) => {
    const url = new URL(loc);
    return url.pathname === '' ? '/' : url.pathname;
  });
}

function startStaticServer() {
  const server = createServer((req, res) => {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    let filePath = join(DIST, reqPath);

    // Directory or clean-URL request -> look for an index.html at that path first
    if (existsSync(filePath) && statSync(filePath).isDirectory()) {
      filePath = join(filePath, 'index.html');
    }

    // No file extension and no matching file -> SPA fallback to root index.html
    // (this is what lets not-yet-prerendered routes still boot the real app)
    if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
      if (extname(filePath) === '') {
        filePath = join(DIST, 'index.html');
      }
    }

    if (!existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const ext = extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(readFileSync(filePath));
  });

  return new Promise((resolve) => {
    server.listen(PORT, () => resolve(server));
  });
}

function writeRenderedHtml(routePath, html) {
  const outDir = routePath === '/' ? DIST : join(DIST, routePath);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
}

async function prerenderRoute(page, routePath, isRoot = false) {
  const url = `http://localhost:${PORT}${routePath}`;
  const timeout = isRoot ? 60000 : 30000;
  await page.goto(url, { waitUntil: 'networkidle0', timeout });

  // Give React an extra beat after networkidle to settle, especially on /.
  if (isRoot) {
    await new Promise((r) => setTimeout(r, 2000));
  }
  // react-helmet-async and framer-motion mount synchronously with React,
  // but give a short grace period for any late-microtask head updates.
  await new Promise((r) => setTimeout(r, 300));
  return page.content();
}

async function main() {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.error('[prerender] dist/index.html not found — run `vite build` first.');
    process.exit(1);
  }

  const routePaths = readSitemapPaths();
  console.log(`[prerender] Found ${routePaths.length} routes in sitemap.xml`);

  const server = await startStaticServer();
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const failures = [];
  const rendered = {};

  try {
    const page = await browser.newPage();
    await page.setUserAgent('HappyHunterDigital-Prerenderer/1.0 (+build-time static rendering)');

    // Process every route except "/" first — the local server needs the
    // original dist/index.html intact as the SPA fallback until then.
    const nonRoot = routePaths.filter((p) => p !== '/');
    const hasRoot = routePaths.includes('/');

    for (const routePath of nonRoot) {
      try {
        const html = await prerenderRoute(page, routePath);
        rendered[routePath] = html;
        console.log(`[prerender] ✓ ${routePath}`);
      } catch (err) {
        failures.push({ routePath, error: err.message });
        console.error(`[prerender] ✗ ${routePath} — ${err.message}`);
      }
    }

    // Write out all non-root pages now that we're done reading through the server
    for (const [routePath, html] of Object.entries(rendered)) {
      writeRenderedHtml(routePath, html);
    }

    // Root last: render it, then overwrite dist/index.html
    if (hasRoot) {
      try {
        const html = await prerenderRoute(page, '/');
        writeRenderedHtml('/', html);
        console.log('[prerender] ✓ /');
      } catch (err) {
        failures.push({ routePath: '/', error: err.message });
        console.error(`[prerender] ✗ / — ${err.message}`);
      }
    }
  } finally {
    await browser.close();
    server.close();
  }

  if (failures.length > 0) {
    console.warn(`\n[prerender] WARNING: ${failures.length} route(s) failed to prerender and will fall back to the standard SPA shell (same behavior as today):`);
    failures.forEach((f) => console.warn(`  - ${f.routePath}: ${f.error}`));
    console.warn('[prerender] Continuing build — this is not a fatal error.\n');
  }

  console.log(`[prerender] Done. ${routePaths.length - failures.length}/${routePaths.length} routes prerendered to static HTML.`);
}

main().catch((err) => {
  // Never block a deploy over a prerender problem — worst case, every route
  // just serves the app shell like it did before this script existed.
  console.error('[prerender] Non-fatal error, build will continue:', err);
});
