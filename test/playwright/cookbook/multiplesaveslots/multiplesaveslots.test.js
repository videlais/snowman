import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compiledHtmlPath = join(__dirname, 'snowman_multiplesaveslots.html');

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

async function increaseProgress(page, times) {
  for (let i = 0; i < times; i++) {
    await page.click('a:has-text("Increase progress")');
    await page.click('a:has-text("Back to start")');
  }
}

test.describe('Multiple Save Slots Example', () => {
  test('should load without errors', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);

    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    expect(pageErrors, 'Page should load without JavaScript errors').toHaveLength(0);
    expect(consoleErrors, 'Page should load without console errors').toHaveLength(0);
  });

  test('should save and load independent slots correctly', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);

    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    // Progress to 1 and save to slot 1.
    await increaseProgress(page, 1);
    await expect(page.locator('tw-passage')).toContainText('Progress: 1');
    await page.click('#save-slot-1');

    // Progress further to 3 and save to slot 2.
    await increaseProgress(page, 2);
    await expect(page.locator('tw-passage')).toContainText('Progress: 3');
    await page.click('#save-slot-2');

    // Loading slot 1 should restore progress to 1.
    await page.click('#load-slot-1');
    await expect(page.locator('tw-passage')).toContainText('Progress: 1');

    // Loading slot 2 should restore progress to 3.
    await page.click('#load-slot-2');
    await expect(page.locator('tw-passage')).toContainText('Progress: 3');

    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
  });
});
