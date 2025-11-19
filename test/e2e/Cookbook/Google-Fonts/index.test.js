import { test, expect } from '@playwright/test';

test.describe('Cookbook - Google Fonts', () => {
  test('Should display message', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Google-Fonts/index.html');
    await expect(page.locator('body')).toContainText('This text is styled using a Google Font');
  });
});