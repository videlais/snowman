import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compiledHtmlPath = join(__dirname, 'snowman_googlefonts.html');

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

test.describe('Google Fonts Example', () => {
  test('should load without errors', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    logErrors(consoleErrors, pageErrors);
    
    expect(pageErrors, 'Page should load without JavaScript errors').toHaveLength(0);
    expect(consoleErrors, 'Page should load without console errors').toHaveLength(0);
  });
  
  test('should display message with custom class', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const messageDiv = page.locator('.message');
    await expect(messageDiv).toBeVisible();
    await expect(messageDiv).toHaveText('This text is styled using a Google Font');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should apply Roboto font family to message', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const fontFamily = await page.locator('.message').evaluate(el => {
      return window.getComputedStyle(el).fontFamily;
    });
    
    // Should include Roboto in font stack
    expect(fontFamily).toContain('Roboto');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should have Google Fonts import in stylesheet', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Check for @import in stylesheets
    const hasGoogleFontImport = await page.evaluate(() => {
      const stylesheets = Array.from(document.styleSheets);
      return stylesheets.some(sheet => {
        try {
          const rules = Array.from(sheet.cssRules || []);
          return rules.some(rule => {
            return rule.cssText && rule.cssText.includes('fonts.googleapis.com');
          });
        } catch (e) {
          // Cross-origin stylesheet, can't access rules
          return false;
        }
      });
    });
    
    expect(hasGoogleFontImport, 'Should have Google Fonts import').toBe(true);
    
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
    await expect(page.locator('.message')).toBeAttached();
    
    expect(pageErrors).toHaveLength(0);
  });
});
