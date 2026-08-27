import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compiledHtmlPath = join(__dirname, 'snowman_workingwithjsondata.html');

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

test.describe('Working with JSON Data Example', () => {
  test('should load without errors', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);

    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    expect(pageErrors, 'Page should load without JavaScript errors').toHaveLength(0);
    expect(consoleErrors, 'Page should load without console errors').toHaveLength(0);
  });

  test('should parse the embedded JSON and list each character', async ({ page }) => {
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    const items = page.locator('#character-list li');
    await expect(items).toHaveCount(3);
    await expect(items.nth(0)).toContainText('Ari the Ranger');
    await expect(items.nth(1)).toContainText('Bex the Mage');
    await expect(items.nth(2)).toContainText('Cato the Warrior');

    await expect(page.locator('tw-passage')).toContainText('3 characters available');
  });
});
