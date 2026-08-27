import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compiledHtmlPath = join(__dirname, 'snowman_debuginspector.html');

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

test.describe('Debug State Inspector Panel Example', () => {
  test('should load without errors', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);

    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    expect(pageErrors, 'Page should load without JavaScript errors').toHaveLength(0);
    expect(consoleErrors, 'Page should load without console errors').toHaveLength(0);
  });

  test('should be hidden by default and reveal state JSON when toggled', async ({ page }) => {
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    const panelContent = page.locator('#debug-panel-content');
    await expect(panelContent).toBeHidden();

    await page.click('#debug-toggle');
    await expect(panelContent).toBeVisible();
    await expect(panelContent).toContainText('"health": 100');
    await expect(panelContent).toContainText('"gold": 20');
  });

  test('should update the displayed state after a passage change', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);

    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    await page.click('#debug-toggle');
    await page.click('a:has-text("Take damage")');

    await expect(page.locator('#debug-panel-content')).toContainText('"health": 90');

    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
  });
});
