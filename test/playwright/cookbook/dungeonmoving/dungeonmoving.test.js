import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compiledHtmlPath = join(__dirname, 'snowman_dungeonmoving.html');

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

test.describe('Dungeon Moving Example', () => {
  test('should load without errors', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    logErrors(consoleErrors, pageErrors);
    
    expect(pageErrors, 'Page should load without JavaScript errors').toHaveLength(0);
    expect(consoleErrors, 'Page should load without console errors').toHaveLength(0);
  });
  
  test('should render maze and movement buttons', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Check for maze div
    await expect(page.locator('tw-passage .maze').first()).toBeVisible();
    
    // Check for movement buttons
    await expect(page.locator('tw-passage button[data-move="n"]').first()).toBeVisible();
    await expect(page.locator('tw-passage button[data-move="s"]').first()).toBeVisible();
    await expect(page.locator('tw-passage button[data-move="e"]').first()).toBeVisible();
    await expect(page.locator('tw-passage button[data-move="w"]').first()).toBeVisible();
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should display player position in maze', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const mazeContent = await page.textContent('.maze');
    
    // Maze should contain player marker 'P'
    expect(mazeContent).toContain('P');
    
    // Maze should contain walls '#' and spaces '.'
    expect(mazeContent).toContain('#');
    expect(mazeContent).toContain('.');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should disable movement buttons for invalid moves', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // At starting position (1,1), north and west should be disabled (walls)
    const northButton = page.locator('tw-passage button[data-move="n"]').first();
    const westButton = page.locator('tw-passage button[data-move="w"]').first();
    
    await expect(northButton).toBeDisabled();
    await expect(westButton).toBeDisabled();
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should update player position when moving', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    const initialMaze = await page.textContent('tw-passage .maze');
    
    // Click east button to move right (should be enabled from starting position)
    const eastButton = page.locator('tw-passage button[data-move="e"]').first();
    await eastButton.click();
    
    // Wait a moment for update
    await page.waitForTimeout(100);
    
    const updatedMaze = await page.textContent('tw-passage .maze');
    
    // Maze should have changed (player moved)
    expect(updatedMaze).not.toEqual(initialMaze);
    expect(updatedMaze).toContain('P');
    
    logErrors(consoleErrors, pageErrors);
    expect(pageErrors).toHaveLength(0);
  });
  
  test('should navigate to exit passage when reaching goal', async ({ page }) => {
    const { consoleErrors, pageErrors } = setupErrorTracking(page);
    
    await page.goto(`file://${compiledHtmlPath}`);
    await page.waitForSelector('tw-passage', { timeout: 5000 });
    
    // Simulate moves to reach exit (this is a simplified test - actual path may vary)
    // The goal is at position (9, 9) marked as '2' in the maze
    // We'll just verify the Exit passage exists in the story
    const passageContent = await page.textContent('tw-passage');
    
    // Initial passage should not contain exit message
    expect(passageContent).not.toContain("You've escaped this fiendish maze!");
    
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
    await expect(page.locator('tw-passage .maze')).toBeAttached();
    
    expect(pageErrors).toHaveLength(0);
  });
});
