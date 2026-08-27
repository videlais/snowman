import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compiledHtmlPath = join(__dirname, 'snowman_statemachinebranching.html');

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

async function provoke(page) {
  await page.click('a:has-text("Provoke them")');
  await page.click('a:has-text("Continue")');
}

async function compliment(page) {
  await page.click('a:has-text("Compliment them")');
  await page.click('a:has-text("Continue")');
}

test.describe('Finite-State Machine Branching Example', () => {
  test('should load without errors', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);

    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    expect(pageErrors, 'Page should load without JavaScript errors').toHaveLength(0);
    expect(consoleErrors, 'Page should load without console errors').toHaveLength(0);
  });

  test('should start in the calm state', async ({ page }) => {
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    await expect(page.locator('tw-passage')).toContainText('mood is: calm');
  });

  test('should transition through states following the lookup table', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);

    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    await provoke(page);
    await expect(page.locator('tw-passage')).toContainText('mood is: annoyed');

    await provoke(page);
    await expect(page.locator('tw-passage')).toContainText('mood is: angry');

    await compliment(page);
    await expect(page.locator('tw-passage')).toContainText('mood is: annoyed');

    await compliment(page);
    await expect(page.locator('tw-passage')).toContainText('mood is: calm');

    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
  });
});
