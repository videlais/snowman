import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compiledHtmlPath = join(__dirname, 'snowman_cycling.html');

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

test.describe('Cycling Choices Example', () => {
  test('should load without errors', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    logErrors(consoleErrors, pageErrors);
    
    expect(pageErrors, 'Page should load without JavaScript errors').toHaveLength(0);
    expect(consoleErrors, 'Page should load without console errors').toHaveLength(0);
  });
  
  test('should display initial cycling choice', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const cycleElement = page.locator('#cycleOne');
    await expect(cycleElement).toBeVisible();
    await expect(cycleElement).toHaveText('One');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should cycle through choices on click', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const cycleElement = page.locator('#cycleOne');
    
    // Initial state: "One"
    await expect(cycleElement).toHaveText('One');
    
    // Click to cycle to "Two"
    await cycleElement.click();
    await expect(cycleElement).toHaveText('Two');
    
    // Click to cycle to "Three"
    await cycleElement.click();
    await expect(cycleElement).toHaveText('Three');
    
    // Click to cycle back to "One"
    await cycleElement.click();
    await expect(cycleElement).toHaveText('One');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors, 'Should cycle without errors').toHaveLength(0);
  });
  
  test('should preserve selection when navigating to results', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const cycleElement = page.locator('#cycleOne');
    
    // Cycle to "Two"
    await cycleElement.click();
    await expect(cycleElement).toHaveText('Two');
    
    // Navigate to Results
    await page.click('a:has-text("Submit")');
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Results passage should display "Two"
    const passageContent = await page.textContent('tw-passage');
    expect(passageContent).toContain('Two');
    
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
