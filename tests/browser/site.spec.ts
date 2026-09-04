import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

// Never send analytics, forms, or other requests to a live service from tests.
test.beforeEach(async ({ context }) => {
  await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
});

test('mobile navigation works with keyboard and restores focus on Escape', async ({ page }) => {
  await page.goto('/');
  const toggle = page.locator('[data-mobile-nav-toggle]');
  await toggle.focus();
  await page.keyboard.press('Enter');
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(page.locator('#mobile-nav-panel')).toBeVisible();
  await page.locator('#mobile-nav-panel a').first().focus();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
  await expect(page.locator('#mobile-nav-panel')).toBeHidden();
});

test('calendar and homepage retain ongoing events through their last day', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-10-17T19:00:00Z'));
  await page.goto('/calendar');
  await expect(page.locator('[data-events-upcoming] #event-2026-10-16-calgames')).toBeVisible();
  await page.goto('/');
  await expect(page.locator('[data-upcoming-link][data-event-title="CalGames"]')).toBeVisible();
  await page.clock.setFixedTime(new Date('2026-10-19T19:00:00Z'));
  await page.goto('/calendar');
  await expect(page.locator('[data-events-past] #event-2026-10-16-calgames')).toBeVisible();
});

test('same-day homepage links reach the matching calendar event', async ({ page }) => {
  await page.clock.setFixedTime(new Date('2026-12-01T20:00:00Z'));
  await page.goto('/');
  const links = await page.locator('[data-upcoming-link]:visible').evaluateAll(nodes => nodes.map(node => ({href:node.getAttribute('href')!,title:node.getAttribute('data-event-title')!})));
  expect(links.length).toBeGreaterThan(1);
  expect(new Set(links.map(link => link.href)).size).toBe(links.length);
  for (const link of links) {
    await page.goto(link.href);
    await expect(page.locator(new URL(page.url()).hash)).toContainText(link.title);
  }
});

test('newsletter rejects invalid addresses and submits valid input only to the intercepted endpoint', async ({ page, context }) => {
  let submitted = '';
  await context.route('https://piedmontmakers.us3.list-manage.com/**', async route => {
    submitted = route.request().postData() ?? '';
    await route.fulfill({contentType:'text/html',body:'Preview submission intercepted'});
  });
  await page.goto('/');
  const email = page.locator('#newsletter-email');
  await email.fill('invalid');
  await page.locator('#newsletter button[type="submit"]').click();
  expect(await email.evaluate((el: HTMLInputElement) => el.validity.valid)).toBe(false);
  expect(submitted).toBe('');
  await email.fill('test@example.org');
  const popup = page.waitForEvent('popup');
  await page.locator('#newsletter button[type="submit"]').click();
  await (await popup).waitForLoadState();
  expect(submitted).toContain('EMAIL=test%40example.org');
});

for (const path of ['/', '/calendar', '/robotics']) {
  test(`WCAG A accessibility and mobile overflow: ${path}`, async ({ page }) => {
    await page.goto(path);
    const results = await new AxeBuilder({page}).withTags(['wcag2a','wcag21a']).analyze();
    expect(results.violations).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  });
}

function htmlFiles(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const file = join(dir,name);
    return statSync(file).isDirectory() ? htmlFiles(file) : file.endsWith('.html') ? [file] : [];
  });
}

test('rendered pages have valid local destinations, images, and image alternatives', async ({ page }) => {
  test.setTimeout(120_000);
  const failures: string[] = [];
  const root = resolve('dist');
  for (const file of htmlFiles(root)) {
    const html = readFileSync(file,'utf8');
    if (/http-equiv="refresh"/i.test(html) || file.includes('/admin/')) continue;
    const path = file.slice(root.length).replace(/index\.html$/, '');
    await page.goto(path);
    const refs = await page.locator('a[href], img[src]').evaluateAll(nodes => nodes.map(node => ({
      url: node instanceof HTMLImageElement ? node.src : (node as HTMLAnchorElement).href,
      image: node instanceof HTMLImageElement,
      alt: node.getAttribute('alt'),
    })));
    for (const ref of refs) {
      if (ref.image && ref.alt === null) failures.push(`${path}: image missing alt ${ref.url}`);
      const url = new URL(ref.url);
      if (!['127.0.0.1', 'piedmontmakers.org'].includes(url.hostname)) continue;
      const target = join(root,decodeURIComponent(url.pathname));
      if (!existsSync(target) && !existsSync(join(target,'index.html'))) failures.push(`${path}: missing ${url.pathname}`);
    }
  }
  expect(failures).toEqual([]);
});
