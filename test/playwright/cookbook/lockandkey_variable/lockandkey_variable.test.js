import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compiledHtmlPath = join(__dirname, 'snowman_lockandkey_variable.html');

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

test.describe('Lock and Key Variable Example', () => {
  test('should load without errors', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    logErrors(consoleErrors, pageErrors);
    
    expect(pageErrors, 'Page should load without JavaScript errors').toHaveLength(0);
    expect(consoleErrors, 'Page should load without console errors').toHaveLength(0);
  });
  
  test('should start at front room with locked door', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Navigate to Front Room
    await page.click('a:has-text("Front Room")');
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const passageContent = await page.textContent('tw-passage');
    // Note: Asterisks are literal text, not markdown formatting
    expect(passageContent).toContain('Locked Door');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should allow picking up key in back room', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Navigate to Back Room
    await page.click('a:has-text("Back Room")');
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    let passageContent = await page.textContent('tw-passage');
    expect(passageContent).toContain('Pick up key');
    
    // Click to pick up key
    await page.click('.key-item');
    await page.waitForTimeout(500);
    
    passageContent = await page.textContent('tw-passage');
    expect(passageContent).toContain('You have a key');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should unlock door after getting key', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Navigate to Back Room
    await page.click('a:has-text("Back Room")');
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Pick up key
    await page.click('.key-item');
    await page.waitForTimeout(500);
    
    // Navigate to Front Room
    await page.click('a:has-text("Front Room")');
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Exit link should now be available
    const exitLink = page.locator('a:has-text("Exit")');
    await expect(exitLink).toBeVisible();
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should complete puzzle by exiting', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Navigate to Back Room
    await page.click('a:has-text("Back Room")');
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Pick up key
    await page.click('.key-item');
    await page.waitForTimeout(500);
    
    // Navigate to Front Room
    await page.click('a:has-text("Front Room")');
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Click Exit
    await page.click('a:has-text("Exit")');
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const passageContent = await page.textContent('tw-passage');
    expect(passageContent).toContain('You found the key and went through the door!');
    
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
