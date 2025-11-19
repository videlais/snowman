import { test, expect } from '@playwright/test';

test.describe('Cookbook - Adding Functionality', () => {
  test('Should display current year on page', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Adding-Functionality/index.html');
    const year = new Date().getFullYear().toString();
    await expect(page.locator('body')).toContainText(year);
  });
});