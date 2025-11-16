import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compiledHtmlPath = join(__dirname, 'snowman_dicerolling.html');

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
    pageErrors.forEach((err, idx) => {
      console.log(`\nError ${idx + 1}:`);
      console.log(`  Name: ${err.name}`);
      console.log(`  Message: ${err.message}`);
      if (err.stack) {
        console.log(`  Stack:\n${err.stack}`);
      }
    });
  }
}

test.describe('Dice Rolling Example', () => {
  test('should load without errors', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    logErrors(consoleErrors, pageErrors);
    
    expect(pageErrors, 'Page should load without JavaScript errors').toHaveLength(0);
    expect(consoleErrors, 'Page should load without console errors').toHaveLength(0);
  });
  
  test('should display dice roll results', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const passageContent = await page.textContent('tw-passage');
    
    // Check for various dice rolls
    expect(passageContent).toMatch(/Rolling a 1d4: \d+/);
    expect(passageContent).toMatch(/Rolling a 1d6: \d+/);
    expect(passageContent).toMatch(/Rolling a 1d8: \d+/);
    expect(passageContent).toMatch(/Rolling a 1d10: \d+/);
    expect(passageContent).toMatch(/Rolling a 1d12: \d+/);
    expect(passageContent).toMatch(/Rolling a 1d20: \d+/);
    expect(passageContent).toMatch(/Rolling a 1d100: \d+/);
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should display dice rolls with modifiers', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const passageContent = await page.textContent('tw-passage');
    
    // Check for modified rolls
    expect(passageContent).toMatch(/Rolling a 1d4 \+ 4: \d+/);
    expect(passageContent).toMatch(/Rolling a 1d6 - 2: -?\d+/);
    expect(passageContent).toMatch(/Rolling a 2d6 \+ 10: \d+/);
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should generate values within expected ranges', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const passageContent = await page.textContent('tw-passage');
    
    // Extract dice roll values
    const d4Match = passageContent.match(/Rolling a 1d4: (\d+)/);
    const d6Match = passageContent.match(/Rolling a 1d6: (\d+)/);
    const d20Match = passageContent.match(/Rolling a 1d20: (\d+)/);
    
    if (d4Match) {
      const d4Value = parseInt(d4Match[1]);
      expect(d4Value).toBeGreaterThanOrEqual(1);
      expect(d4Value).toBeLessThanOrEqual(4);
    }
    
    if (d6Match) {
      const d6Value = parseInt(d6Match[1]);
      expect(d6Value).toBeGreaterThanOrEqual(1);
      expect(d6Value).toBeLessThanOrEqual(6);
    }
    
    if (d20Match) {
      const d20Value = parseInt(d20Match[1]);
      expect(d20Value).toBeGreaterThanOrEqual(1);
      expect(d20Value).toBeLessThanOrEqual(20);
    }
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should render passage element with correct structure', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    logErrors(consoleErrors, pageErrors);
    
    await expect(page.locator('tw-storydata')).toBeAttached();
    await expect(page.locator('tw-passage')).toBeVisible();
    
    expect(pageErrors).toHaveLength(0);
  });
});
