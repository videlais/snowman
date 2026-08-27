import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compiledHtmlPath = join(__dirname, 'snowman_restartingstory.html');

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

test.describe('Restarting the Story Example', () => {
  test('should load without errors', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);

    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    expect(pageErrors, 'Page should load without JavaScript errors').toHaveLength(0);
    expect(consoleErrors, 'Page should load without console errors').toHaveLength(0);
  });

  test('should reset story state back to its initial values', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);

    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    await expect(page.locator('tw-passage')).toContainText('visited this passage 1 time(s)');

    await page.click('a:has-text("Visit again")');
    await expect(page.locator('tw-passage')).toContainText('visited this passage 2 time(s)');

    await page.click('#restart-link');
    await expect(page.locator('tw-passage')).toContainText('visited this passage 1 time(s)');

    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
  });
});
