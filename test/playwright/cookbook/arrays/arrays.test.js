import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the compiled HTML file (created by global-setup.js)
const compiledHtmlPath = join(__dirname, 'snowman_arrays.html');

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

test.describe('Arrays Example - Inventory System', () => {
  test('should start with empty inventory and pick up sword', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    
    // Wait for Snowman to initialize
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Log any captured errors
    logErrors(consoleErrors, pageErrors);
    
    // Verify no JavaScript errors occurred
    expect(pageErrors, 'Page should load without JavaScript errors').toHaveLength(0);
    expect(consoleErrors, 'Page should load without console errors').toHaveLength(0);
    
    // Verify initial passage content (note: textContent includes whitespace/newlines)
    const passageContent = await page.textContent('tw-passage');
    expect(passageContent).toContain('You are currently carrying:');
    expect(passageContent).toContain('nothing.');
    expect(passageContent).toContain('You find yourself inside a small room.');
    expect(passageContent).toContain('In the corner, you see a sword, and decide to pick it up.');
    
    // Verify link is present
    await expect(page.locator('a', { hasText: 'hallway' })).toBeVisible();
  });
  
  test('should update inventory after picking up sword', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Click the link to hallway (labeled "Continue" in the passage, but links to "hallway")
    const hallwayLink = page.locator('a', { hasText: 'hallway' });
    await expect(hallwayLink).toBeVisible();
    await hallwayLink.click();
    
    // Wait for passage to update
    await page.waitForSelector('tw-passage:has-text("You see a chest")', { timeout: 5000 });
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors, 'Should navigate without errors').toHaveLength(0);
    
    // Verify inventory now shows sword
    const passageContent = await page.textContent('tw-passage');
    expect(passageContent).toContain('You are currently carrying:');
    expect(passageContent).toContain('a sword.');
    expect(passageContent).toContain('You see a chest here in the hallway.');
    expect(passageContent).toContain('Do you want to open it?');
  });
  
  test('should add multiple items from chest to inventory', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Navigate to the hallway
    await page.click('a:has-text("hallway")');
    await page.waitForSelector('tw-passage:has-text("You see a chest")', { timeout: 5000 });
    
    // Open the chest
    const chestLink = page.locator('a:has-text("chest")');
    await expect(chestLink).toBeVisible();
    await chestLink.click();
    
    // Wait for passage to update
    await page.waitForSelector('tw-passage:has-text("You open the chest")', { timeout: 5000 });
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors, 'Should open chest without errors').toHaveLength(0);
    
    // Verify final inventory contains all items
    const passageContent = await page.textContent('tw-passage');
    expect(passageContent).toContain('You are currently carrying:');
    expect(passageContent).toContain('a sword, a shield, a suit of armor.');
    expect(passageContent).toContain('You open the chest and find a shield and a suit of armor.');
  });
  
  test('should maintain correct inventory state throughout navigation', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Step 1: Start with nothing
    let passageContent = await page.textContent('tw-passage');
    expect(passageContent).toContain('nothing');
    
    // Step 2: Pick up sword and go to hallway
    await page.click('a:has-text("hallway")');
    await page.waitForSelector('tw-passage:has-text("You see a chest")', { timeout: 5000 });
    passageContent = await page.textContent('tw-passage');
    expect(passageContent).toContain('a sword');
    expect(passageContent).not.toContain('a shield');
    
    // Step 3: Open chest and get shield and armor
    await page.click('a:has-text("chest")');
    await page.waitForSelector('tw-passage:has-text("You open the chest")', { timeout: 5000 });
    passageContent = await page.textContent('tw-passage');
    expect(passageContent).toContain('a sword, a shield, a suit of armor');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors, 'Should complete full navigation without errors').toHaveLength(0);
  });
  
  test('should render passage element with correct structure', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    logErrors(consoleErrors, pageErrors);
    
    // Verify Snowman story structure
    await expect(page.locator('tw-storydata')).toBeAttached();
    await expect(page.locator('tw-passage')).toBeVisible();
    
    // Verify links are present
    await expect(page.locator('a')).toHaveCount(1); // Should have "Continue" link
    
    // Verify no errors
    expect(pageErrors).toHaveLength(0);
  });
});
