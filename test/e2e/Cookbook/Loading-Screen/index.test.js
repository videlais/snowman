import { test, expect } from '@playwright/test';

test.describe('Cookbook - Loading Screen', () => {
  test('Should display message', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Loading-Screen/index.html');
    // Wait for seven seconds.
    await page.waitForTimeout(7000);
    await expect(page.locator('body')).toContainText("You can now see this after the long pause!");
  });
});