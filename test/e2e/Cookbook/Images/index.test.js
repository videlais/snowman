import { test, expect } from '@playwright/test';

test.describe('Cookbook - Images', () => {
  test('Should display result', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Images/index.html');
    await expect(page.locator('body')).toContainText('This is a Base64-encoded CSS image background:');
  });
});