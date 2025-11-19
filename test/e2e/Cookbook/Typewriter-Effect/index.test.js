import { test, expect } from '@playwright/test';

test.describe('Cookbook - Typewriter Effect', () => {
  test('Should display "Hello, world!"', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Typewriter-Effect/index.html');
    // Wait for 12 seconds
    await page.waitForTimeout(12000);
    await expect(page.locator('body')).toContainText('Hello, world!');
  });
});