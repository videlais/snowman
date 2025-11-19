import { test, expect } from '@playwright/test';

test.describe('Cookbook - Timed Passages', () => {
  test('Should display "world ended"', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Timed-Passages/index.html');
    // Wait for 11 seconds
    await page.waitForTimeout(11000);
    await expect(page.locator('body')).toContainText('The world ended.');
  });
});