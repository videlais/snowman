import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compiledHtmlPath = join(__dirname, 'snowman_images.html');

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

test.describe('Images Example', () => {
  test('should load without errors', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    logErrors(consoleErrors, pageErrors);
    
    expect(pageErrors, 'Page should load without JavaScript errors').toHaveLength(0);
    expect(consoleErrors, 'Page should load without console errors').toHaveLength(0);
  });
  
  test('should display img element', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const imgElement = page.locator('img');
    await expect(imgElement).toBeVisible();
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should have img element with correct attributes', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const imgElement = page.locator('img');
    
    // Check src attribute
    const src = await imgElement.getAttribute('src');
    expect(src).toContain('twinery.org');
    
    // Check dimensions
    await expect(imgElement).toHaveAttribute('width', '256');
    await expect(imgElement).toHaveAttribute('height', '256');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should display base64 CSS background image', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const base64Div = page.locator('.base64image');
    await expect(base64Div).toBeVisible();
    
    // Check that it has background-image style
    const backgroundImage = await base64Div.evaluate(el => {
      return window.getComputedStyle(el).backgroundImage;
    });
    
    expect(backgroundImage).toContain('data:image/png;base64');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should have base64image div with correct dimensions', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const base64Div = page.locator('.base64image');
    
    const width = await base64Div.evaluate(el => {
      return window.getComputedStyle(el).width;
    });
    
    const height = await base64Div.evaluate(el => {
      return window.getComputedStyle(el).height;
    });
    
    expect(width).toBe('256px');
    expect(height).toBe('256px');
    
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
    await expect(page.locator('img')).toBeAttached();
    await expect(page.locator('.base64image')).toBeAttached();
    
    expect(pageErrors).toHaveLength(0);
  });
});
