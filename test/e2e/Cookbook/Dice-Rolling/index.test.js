import { test, expect } from '@playwright/test';

test.describe('Cookbook - Dice Rolling', () => {
  test('Should display random 1d4 number', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Dice-Rolling/index.html');
    await expect(page.locator('body')).toContainText(/Rolling a 1d4: \d/g);
  });
});