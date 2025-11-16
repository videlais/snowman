import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the compiled HTML file (created by global-setup.js)
const compiledHtmlPath = join(__dirname, 'snowman_cssselectors.html');

/**
 * Set up error tracking for a page
 * @param {import('@playwright/test').Page} page 
 * @returns {{consoleErrors: string[], pageErrors: Array<{message: string, stack: string, name: string}>}}
 */
function setupErrorTracking(page) {
  const consoleErrors = [];
  const pageErrors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  page.on('pageerror', error => {
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      name: error.name
    };
    pageErrors.push(errorDetails);
  });
  
  return { consoleErrors, pageErrors };
}

/**
 * Log captured errors with detailed information
 * @param {string[]} consoleErrors 
 * @param {Array<{message: string, stack: string, name: string}>} pageErrors 
 */
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

test.describe('CSS Selectors Example', () => {
  test('should load without errors', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    
    // Wait for Snowman to initialize
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Log any captured errors
    logErrors(consoleErrors, pageErrors);
    
    // Verify no JavaScript errors occurred
    expect(pageErrors, 'Page should load without JavaScript errors').toHaveLength(0);
    expect(consoleErrors, 'Page should load without console errors').toHaveLength(0);
  });
  
  test('should apply green background to body element', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Check body background color
    const bodyBgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    
    // lightgreen = rgb(144, 238, 144)
    expect(bodyBgColor, 'Body should have lightgreen background').toBe('rgb(144, 238, 144)');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors, 'Should apply CSS without errors').toHaveLength(0);
  });
  
  test('should apply red border to tw-passage element', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Check passage border
    const passageBorder = await page.evaluate(() => {
      const passage = document.querySelector('tw-passage');
      const styles = window.getComputedStyle(passage);
      return {
        borderWidth: styles.borderWidth,
        borderStyle: styles.borderStyle,
        borderColor: styles.borderColor
      };
    });
    
    expect(passageBorder.borderWidth, 'Passage should have 1px border width').toBe('1px');
    expect(passageBorder.borderStyle, 'Passage should have solid border').toBe('solid');
    expect(passageBorder.borderColor, 'Passage should have red border').toBe('rgb(255, 0, 0)');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should display correct passage content', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Verify initial passage content
    const passageContent = await page.textContent('tw-passage');
    expect(passageContent).toContain('The page has a green background');
    expect(passageContent).toContain('this passage, which has a red border');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should navigate to second passage with same CSS styling', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Click link to Second passage
    const secondLink = page.locator('a:has-text("Second")');
    await expect(secondLink).toBeVisible();
    await secondLink.click();
    
    // Wait for passage to update
    await page.waitForSelector('tw-passage:has-text("This passage also has a red border")', { timeout: 5000 });
    
    // Verify content
    const passageContent = await page.textContent('tw-passage');
    expect(passageContent).toContain('This passage also has a red border');
    
    // Verify CSS still applied after navigation
    const passageBorder = await page.evaluate(() => {
      const passage = document.querySelector('tw-passage');
      return window.getComputedStyle(passage).borderColor;
    });
    
    expect(passageBorder, 'Second passage should also have red border').toBe('rgb(255, 0, 0)');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors, 'Should navigate without errors').toHaveLength(0);
  });
  
  test('should maintain body background color across passages', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Check initial body background
    let bodyBgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    expect(bodyBgColor).toBe('rgb(144, 238, 144)');
    
    // Navigate to second passage
    await page.click('a:has-text("Second")');
    await page.waitForSelector('tw-passage:has-text("This passage also has a red border")', { timeout: 5000 });
    
    // Check body background after navigation
    bodyBgColor = await page.evaluate(() => {
      return window.getComputedStyle(document.body).backgroundColor;
    });
    expect(bodyBgColor, 'Body background should persist across passages').toBe('rgb(144, 238, 144)');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should render passage element with correct structure', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    logErrors(consoleErrors, pageErrors);
    
    // Verify Snowman story structure
    await expect(page.locator('tw-storydata')).toBeAttached();
    await expect(page.locator('tw-passage')).toBeVisible();
    
    // Verify link to second passage exists
    await expect(page.locator('a')).toHaveCount(1);
    
    // Verify no errors
    expect(pageErrors).toHaveLength(0);
  });
});
