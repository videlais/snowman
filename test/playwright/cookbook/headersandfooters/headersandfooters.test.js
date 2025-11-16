import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compiledHtmlPath = join(__dirname, 'snowman_headersandfooters.html');

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

test.describe('Headers and Footers Example', () => {
  test('should load without errors', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    logErrors(consoleErrors, pageErrors);
    
    expect(pageErrors, 'Page should load without JavaScript errors').toHaveLength(0);
    expect(consoleErrors, 'Page should load without console errors').toHaveLength(0);
  });
  
  test('should render header content', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const passageContent = await page.textContent('tw-passage');
    
    // Header should be rendered
    expect(passageContent).toContain('This is the header!');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should render footer content', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const passageContent = await page.textContent('tw-passage');
    
    // Footer should be rendered
    expect(passageContent).toContain('This is the footer!');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should render main content between header and footer', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const passageContent = await page.textContent('tw-passage');
    
    // Main content should be present
    expect(passageContent).toContain('This content is between the header and the footer.');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should render content in correct order', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const passageContent = await page.textContent('tw-passage');
    
    // Check order: header -> content -> footer
    const headerIndex = passageContent.indexOf('This is the header!');
    const contentIndex = passageContent.indexOf('This content is between the header and the footer.');
    const footerIndex = passageContent.indexOf('This is the footer!');
    
    expect(headerIndex).toBeLessThan(contentIndex);
    expect(contentIndex).toBeLessThan(footerIndex);
    
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
