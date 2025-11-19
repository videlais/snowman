import { test, expect } from '@playwright/test';

test.describe('Cookbook - CSS Selectors', () => {
  test('Should have border color of red', async ({ page }) => {
    await page.goto('/e2e/Cookbook/CSS-Selectors/index.html');
    await page.click('[data-passage="Second"]');
    await expect(page.locator('body')).toContainText('This passage also has a red border.');
  });
});