import assert from 'node:assert/strict';
import http from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const root = path.dirname(fileURLToPath(import.meta.url));
const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const server = http.createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const filename = path.resolve(root, '.' + (pathname === '/' ? '/index.html' : pathname));
  if (!filename.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }
  try {
    const bytes = await readFile(filename);
    res.writeHead(200, { 'Content-Type': mime[path.extname(filename)] || 'application/octet-stream' });
    res.end(bytes);
  } catch { res.writeHead(404); res.end(); }
});
await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
const target = process.env.WS_TEST_URL || `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch(process.env.WS_CHROME_PATH
  ? { executablePath: process.env.WS_CHROME_PATH, headless: true }
  : process.platform === 'win32'
    ? { executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', headless: true }
    : { channel: 'chrome', headless: true });
const results = [];
try {
  await mkdir(path.join(root, 'screenshots'), { recursive: true });
  for (const width of [320, 390, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(target, { waitUntil: 'networkidle' });
    assert.equal(response.status(), 200);
    await page.locator('img').evaluateAll(async images => {
      await Promise.all(images.map(async image => { image.loading = 'eager'; await image.decode(); }));
    });
    const layout = await page.evaluate(() => {
      const h1 = document.querySelector('h1');
      return {
        width: innerWidth,
        pageWidth: document.documentElement.scrollWidth,
        headlineLines: Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight)),
        missingImages: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src),
        missingDimensions: [...document.images].filter(i => !i.hasAttribute('width') || !i.hasAttribute('height')).map(i => i.src),
        missingAnchors: [...document.querySelectorAll('a[href^="#"]')].map(a => a.getAttribute('href')).filter(h => !document.getElementById(h.slice(1))),
        unsafeLinks: [...document.querySelectorAll('a[target="_blank"]')].filter(a => !a.rel.includes('noopener')).map(a => a.href)
      };
    });
    assert.equal(layout.pageWidth, width, `Horizontal overflow at ${width}px`);
    assert.ok(layout.headlineLines <= 2, `Headline wraps at ${width}px`);
    for (const key of ['missingImages', 'missingDimensions', 'missingAnchors', 'unsafeLinks']) assert.deepEqual(layout[key], [], key);
    for (const link of await page.locator('[data-whatsapp]').evaluateAll(links => links.map(a => ({ href: a.href, product: a.dataset.whatsapp })))) {
      const url = new URL(link.href);
      assert.equal(url.hostname, 'wa.me');
      assert.equal(url.pathname, '/5566996965492');
      assert.ok(url.searchParams.get('text').includes('Sistemas WS'));
      if (['clipppro', 'zweb', 'gfood'].includes(link.product)) assert.ok(url.searchParams.get('text').toLowerCase().includes(link.product));
    }
    if (width <= 760) {
      const menu = page.getByRole('button', { name: /Menu/ });
      await menu.focus();
      await page.keyboard.press('Enter');
      await page.getByRole('navigation').waitFor({ state: 'visible' });
      assert.equal(await menu.getAttribute('aria-expanded'), 'true');
      await page.keyboard.press('Escape');
      assert.equal(await menu.getAttribute('aria-expanded'), 'false');
      assert.equal(await menu.evaluate(element => element === document.activeElement), true);
      await menu.click();
      await page.getByRole('navigation').getByRole('link', { name: 'Sistemas', exact: true }).click();
      assert.equal(await menu.getAttribute('aria-expanded'), 'false');
    }
    await page.goto(target);
    const accessibility = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
    assert.deepEqual(accessibility.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.map(n => n.target) })), [], `Accessibility at ${width}px`);
    assert.deepEqual(errors, []);
    await page.locator('img').evaluateAll(async images => {
      await Promise.all(images.map(async image => { image.loading = 'eager'; await image.decode(); }));
    });
    await page.screenshot({ path: path.join(root, 'screenshots', `${width}.png`), fullPage: true });
    results.push({ ...layout, accessibilityViolations: 0, runtimeErrors: 0 });
    await context.close();
  }
  const fallback = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const fallbackPage = await fallback.newPage();
  await fallbackPage.goto(target);
  assert.equal(await fallbackPage.getByRole('navigation').isVisible(), true);
  assert.equal(await fallbackPage.getByRole('button', { name: /Menu/ }).isVisible(), false);
  assert.ok((await fallbackPage.locator('[data-whatsapp="orientacao"]').first().getAttribute('href')).startsWith('https://wa.me/'));
  await fallback.close();
  const configFallback = await browser.newPage();
  await configFallback.route('**/config.js', route => route.fulfill({ contentType: 'application/javascript', body: '' }));
  await configFallback.goto(target);
  assert.ok((await configFallback.locator('[data-whatsapp="geral"]').getAttribute('href')).includes('5566996965492'));
  await configFallback.close();
  await writeFile(path.join(root, 'verification.json'), JSON.stringify({ target, results, noJavaScriptFallback: true, configFallback: true }, null, 2));
  console.log(JSON.stringify({ target, widths: results.map(r => r.width), headlineLines: results.map(r => r.headlineLines), accessibilityViolations: 0, noJavaScriptFallback: true, configFallback: true }));
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
