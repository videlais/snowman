import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compiledHtmlPath = join(__dirname, 'snowman_quizscoring.html');

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

test.describe('Yes or No Quiz Example', () => {
  test('should load without errors', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);

    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    expect(pageErrors, 'Page should load without JavaScript errors').toHaveLength(0);
    expect(consoleErrors, 'Page should load without console errors').toHaveLength(0);
  });

  test('should score 2 out of 2 when answering correctly', async ({ page }) => {
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    await page.click('a:has-text("Yes")');
    await expect(page.locator('tw-passage')).toContainText('Correct!');

    await page.click('a:has-text("Next question")');
    await page.click('a:has-text("No")');
    await expect(page.locator('tw-passage')).toContainText('Correct!');

    await page.click('a:has-text("See results")');
    await expect(page.locator('tw-passage')).toContainText('2 out of 2');
  });

  test('should score 0 out of 2 when answering incorrectly', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);

    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    await page.click('a:has-text("No")');
    await expect(page.locator('tw-passage')).toContainText("That's incorrect.");

    await page.click('a:has-text("Next question")');
    await page.click('a:has-text("Yes")');
    await expect(page.locator('tw-passage')).toContainText("That's incorrect.");

    await page.click('a:has-text("See results")');
    await expect(page.locator('tw-passage')).toContainText('0 out of 2');

    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
  });
});
