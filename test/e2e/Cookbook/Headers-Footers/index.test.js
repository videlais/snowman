import { test, expect } from '@playwright/test';

test.describe('Cookbook - Headers and Footers', () => {
  test('Should display footer', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Headers-Footers/index.html');
    await expect(page.locator('body')).toContainText('This is the footer!');
  });
});