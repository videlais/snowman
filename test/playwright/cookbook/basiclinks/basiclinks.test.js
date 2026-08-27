import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compiledHtmlPath = join(__dirname, 'snowman_basiclinks.html');

function setupErrorTracking(page) {
  const consoleErrors = [];
  const pageErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', error => {
    pageErrors.push({
      message: error.message,
      stack: error.stack,
      name: error.name
    });
  });

  return { consoleErrors, pageErrors };
}

function logErrors(consoleErrors, pageErrors) {
  if (consoleErrors.length > 0) {
    console.log('Console errors:', consoleErrors);
  }

  if (pageErrors.length > 0) {
    console.log('Page errors:', pageErrors);
  }
}

test.describe('Basic Links Example', () => {
  test('should load without errors', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);

    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    logErrors(consoleErrors, pageErrors);

    expect(pageErrors, 'Page should load without JavaScript errors').toHaveLength(0);
    expect(consoleErrors, 'Page should load without console errors').toHaveLength(0);
  });

  test('should show both path links at the start', async ({ page }) => {
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    await expect(page.locator('a:has-text("Take the left path")')).toBeVisible();
    await expect(page.locator('a:has-text("Take the right path")')).toBeVisible();
  });

  test('should reach the good ending via the left path', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);

    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    await page.click('a:has-text("Take the left path")');
    await expect(page.locator('tw-passage')).toContainText('treasure chest');

    await page.click('a:has-text("Continue")');
    await expect(page.locator('tw-passage')).toContainText('Treasure Found');

    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });

  test('should reach the bad ending via the right path', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);

    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    await page.click('a:has-text("Take the right path")');
    await expect(page.locator('tw-passage')).toContainText('pit trap');

    await page.click('a:has-text("Continue")');
    await expect(page.locator('tw-passage')).toContainText('You Lost');

    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
});
