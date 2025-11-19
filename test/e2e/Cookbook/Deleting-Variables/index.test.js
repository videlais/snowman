import { test, expect } from '@playwright/test';

test.describe('Cookbook - Deleting Variables', () => {
  test('Should display "Does "example" still exist as part of the object window.story? false" after opening chest', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Deleting-Variables/index.html');
    await page.click('[data-passage="Delete the value!"]');
    await page.click('[data-passage="Test for value"]');
    await expect(page.locator('body')).toContainText('Does "example" still exist as part of the global store? false');
  });
});