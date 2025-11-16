import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compiledHtmlPath = join(__dirname, 'snowman_hiddenlink.html');

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

test.describe('Hidden Link Example', () => {
  test('should load without errors', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    logErrors(consoleErrors, pageErrors);
    
    expect(pageErrors, 'Page should load without JavaScript errors').toHaveLength(0);
    expect(consoleErrors, 'Page should load without console errors').toHaveLength(0);
  });
  
  test('should have all three hidden link spans', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // There are 3 .hidden elements: one always-hidden, and two that get .hidden class added by JavaScript
    await expect(page.locator('.hidden')).toHaveCount(3);
    await expect(page.locator('.hides')).toHaveCount(1);
    await expect(page.locator('.reveals')).toHaveCount(1);
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should style always-hidden link with transparent color', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const linkColor = await page.locator('.hidden a').evaluate(el => {
      return window.getComputedStyle(el).color;
    });
    
    // Transparent color should be rgba(0, 0, 0, 0) or similar
    expect(linkColor).toMatch(/rgba?\(0,\s*0,\s*0,\s*0\)/);
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should reveal "hides" link on hover', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const hidesSpan = page.locator('.hides');
    
    // Initially should have 'hidden' class
    await expect(hidesSpan).toHaveClass(/hidden/);
    
    // Hover over the span
    await hidesSpan.hover();
    
    // Should remove 'hidden' class
    await expect(hidesSpan).not.toHaveClass(/hidden/);
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should permanently reveal "reveals" link on first hover', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const revealsSpan = page.locator('.reveals');
    
    // Initially should have 'hidden' class
    await expect(revealsSpan).toHaveClass(/hidden/);
    
    // Hover over the span
    await revealsSpan.hover();
    
    // Should remove 'hidden' class
    await expect(revealsSpan).not.toHaveClass(/hidden/);
    
    // Move mouse away
    await page.mouse.move(0, 0);
    
    // Should still not have 'hidden' class (permanent reveal)
    await expect(revealsSpan).not.toHaveClass(/hidden/);
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should navigate to destination when clicking hidden link', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Reveal the "reveals" link first
    const revealsSpan = page.locator('.reveals');
    await revealsSpan.hover();
    
    // Click the link inside
    await revealsSpan.locator('a').click();
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const passageContent = await page.textContent('tw-passage');
    expect(passageContent).toContain('You found it!');
    
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
