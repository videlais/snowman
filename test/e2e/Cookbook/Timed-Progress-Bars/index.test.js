import { test, expect } from '@playwright/test';

test.describe('Cookbook - Timed Progress Bars', () => {
  test('Should display "too late"', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Timed-Progress-Bars/index.html');
    // Wait for 7 seconds
    await page.waitForTimeout(7000);
    await expect(page.locator('body')).toContainText('Too late!');
  });
});