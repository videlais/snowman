import { test, expect } from '@playwright/test';

test.describe('Cookbook - Programmatic Undo', () => {
  test('Should display "Ready to enter the darkness?"', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Programmatic-Undo/index.html');
    await page.waitForSelector('[data-passage="Enter the Darkness"]');
    await page.click('[data-passage="Enter the Darkness"]');
    await page.waitForSelector('[id="return"]');
    await page.click('[id="return"]');
    await expect(page.locator('body')).toContainText("Ready to enter the darkness?");
  });
});