import { test, expect } from '@playwright/test';

test.describe('Cookbook - Fairmath System', () => {
  test('Should display "50"', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Fairmath-System/index.html');
    await expect(page.locator('body')).toContainText('Decrease 100 by 50% using Fairmath:');
    await expect(page.locator('body')).toContainText('50');
  });
});