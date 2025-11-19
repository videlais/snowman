import { test, expect } from '@playwright/test';

test.describe('Cookbook - Date and Time', () => {
  test('Should display current year on page', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Date-Time/index.html');
    const year = new Date().getFullYear().toString();
    await expect(page.locator('body')).toContainText(year);
  });
});