import { test, expect } from '@playwright/test';

test.describe('Cookbook - Delayed Text', () => {
  test('Should display "5 seconds" after at least five seconds', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Delayed-Text/index.html');
    // Should be done under 10 seconds
    // Wait for #timer, which should be 5 seconds
    await page.waitForSelector('#timer');
    // Check page now has text
    await expect(page.locator('body')).toContainText('It has been 5 seconds. Show the text!');
  });
});