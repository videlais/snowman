import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compiledHtmlPath = join(__dirname, 'snowman_randomtext.html');

const possibleFlavorTexts = [
  'The wind howls through the trees.',
  'A distant bell tolls somewhere in the village.',
  'You hear footsteps behind you, but no one is there.'
];

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

test.describe('Random Flavor Text Example', () => {
  test('should load without errors', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);

    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    expect(pageErrors, 'Page should load without JavaScript errors').toHaveLength(0);
    expect(consoleErrors, 'Page should load without console errors').toHaveLength(0);
  });

  test('should display one of the possible flavor texts', async ({ page }) => {
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    const passageContent = (await page.textContent('tw-passage')).trim();
    const matchesOneOption = possibleFlavorTexts.some(text => passageContent.includes(text));
    expect(matchesOneOption, `Expected passage to contain one of: ${possibleFlavorTexts.join(' | ')}`).toBe(true);
  });

  test('should be able to reroll the flavor text multiple times without errors', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);

    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });

    for (let i = 0; i < 5; i++) {
      await page.click('a:has-text("Listen again")');
      const passageContent = (await page.textContent('tw-passage')).trim();
      const matchesOneOption = possibleFlavorTexts.some(text => passageContent.includes(text));
      expect(matchesOneOption).toBe(true);
    }

    expect(pageErrors).toHaveLength(0);
    expect(consoleErrors).toHaveLength(0);
  });
});
