import { test, expect } from '@playwright/test';

test.describe('Cookbook - Looping', () => {
  test('Should display inventory', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Looping/index.html');
    await expect(page.locator('body')).toContainText('You have Bread');
  });
});