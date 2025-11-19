import { test, expect } from '@playwright/test';

test.describe('Cookbook - Left Sidebar', () => {
  test('Should display "Name: Jane Doe" after story start', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Sidebar/index.html');
    await expect(page.locator('body')).toContainText('Name: Jane Doe');
  });
});