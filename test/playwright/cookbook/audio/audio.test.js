import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the compiled HTML file (created by global-setup.js)
const compiledHtmlPath = join(__dirname, 'snowman_audio.html');

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

test.describe('Audio Example', () => {
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
  
  test('should contain audio element with controls', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Verify audio element exists
    const audioElement = page.locator('audio');
    await expect(audioElement).toBeAttached();
    
    // Verify audio has controls attribute
    await expect(audioElement).toHaveAttribute('controls');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors, 'Should load audio element without errors').toHaveLength(0);
  });
  
  test('should have multiple audio source elements', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Verify audio element exists
    const audioElement = page.locator('audio');
    await expect(audioElement).toBeAttached();
    
    // Verify source elements exist
    const sources = page.locator('audio source');
    const sourceCount = await sources.count();
    expect(sourceCount, 'Should have multiple audio source elements').toBeGreaterThanOrEqual(1);
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should have audio sources with correct attributes', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Get all source elements
    const sources = page.locator('audio source');
    const sourceCount = await sources.count();
    
    // Verify each source has src and type attributes
    for (let i = 0; i < sourceCount; i++) {
      const source = sources.nth(i);
      await expect(source, `Source ${i} should have src attribute`).toHaveAttribute('src');
      await expect(source, `Source ${i} should have type attribute`).toHaveAttribute('type');
    }
    
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
    
    // Verify audio element is within the passage
    const audioInPassage = page.locator('tw-passage audio');
    await expect(audioInPassage).toBeAttached();
    
    // Verify no errors
    expect(pageErrors).toHaveLength(0);
  });
});
