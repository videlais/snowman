import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the compiled HTML file (created by global-setup.js)
const compiledHtmlPath = join(__dirname, 'snowman_clamping_numbers.html');

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

test.describe('Clamping Numbers Example', () => {
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
  
  test('should display initial value correctly', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Verify initial value is 5
    const passageContent = await page.textContent('tw-passage');
    expect(passageContent).toContain('Current value: 5');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors, 'Should initialize value without errors').toHaveLength(0);
  });
  
  test('should clamp value within range when adding', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const passageContent = await page.textContent('tw-passage');
    
    // Initial value: 5
    expect(passageContent).toContain('Current value: 5');
    
    // After adding 1 (5 + 1 = 6, within range 1-10)
    expect(passageContent).toMatch(/Add 1[\s\S]*?New value:\s*6/);
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should clamp value to maximum when exceeding upper bound', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const passageContent = await page.textContent('tw-passage');
    
    // After adding 100 to 6 (6 + 100 = 106, clamped to max 10)
    expect(passageContent).toMatch(/Add 100[\s\S]*?New value:\s*10/);
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors, 'Should clamp to maximum without errors').toHaveLength(0);
  });
  
  test('should clamp value within range when subtracting', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const passageContent = await page.textContent('tw-passage');
    
    // After subtracting 5 from 10 (10 - 5 = 5, within range 1-10)
    expect(passageContent).toMatch(/Minus 5[\s\S]*?New value:\s*5/);
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should clamp value to minimum when exceeding lower bound', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const passageContent = await page.textContent('tw-passage');
    
    // After subtracting 100 from 5 (5 - 100 = -95, clamped to min 1)
    expect(passageContent).toMatch(/Minus 100[\s\S]*?New value:\s*1/);
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors, 'Should clamp to minimum without errors').toHaveLength(0);
  });
  
  test('should display all clamp operations in sequence', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const passageContent = await page.textContent('tw-passage');
    
    // Verify the complete sequence of values
    const valuePattern = /New value:\s*(\d+)/g;
    const matches = [...passageContent.matchAll(valuePattern)];
    const values = matches.map(m => parseInt(m[1]));
    
    // Expected sequence: 6 (5+1), 10 (6+100 clamped), 5 (10-5), 1 (5-100 clamped)
    expect(values, 'Should have 4 "New value" outputs').toHaveLength(4);
    expect(values[0], 'First operation: 5 + 1 = 6').toBe(6);
    expect(values[1], 'Second operation: 6 + 100 = 10 (clamped to max)').toBe(10);
    expect(values[2], 'Third operation: 10 - 5 = 5').toBe(5);
    expect(values[3], 'Fourth operation: 5 - 100 = 1 (clamped to min)').toBe(1);
    
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
    
    // Verify bold elements are present for emphasis
    const boldElements = page.locator('tw-passage b');
    const boldCount = await boldElements.count();
    expect(boldCount, 'Should have multiple bold elements for emphasis').toBeGreaterThan(0);
    
    // Verify no errors
    expect(pageErrors).toHaveLength(0);
  });
});
