import { test, expect } from '@playwright/test';

test.describe('Cookbook - Passages in Passages', () => {
  test('Should display "And this is Another passage!"', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Passages-in-Passages/index.html');
    await expect(page.locator('body')).toContainText('And this is Another passage!');
  });
});