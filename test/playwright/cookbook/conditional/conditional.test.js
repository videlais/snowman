import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the compiled HTML file (created by global-setup.js)
const compiledHtmlPath = join(__dirname, 'snowman_conditional.html');

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

test.describe('Conditional Statements Example', () => {
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
  
  test('should display correct conditional output', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Verify conditional logic executed correctly
    const passageContent = await page.textContent('tw-passage');
    expect(passageContent).toContain("It's a horse!");
    expect(passageContent).not.toContain("It's a dog!");
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors, 'Should execute conditional without errors').toHaveLength(0);
  });
  
  test('should execute conditional statement based on variable', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Verify the variable was set and conditional evaluated
    const passageContent = await page.textContent('tw-passage');
    
    // Since s.animal = "horse", the else branch should execute
    expect(passageContent, 'Should show horse message from else branch').toContain("It's a horse!");
    
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
    
    // Verify no errors
    expect(pageErrors).toHaveLength(0);
  });
});
