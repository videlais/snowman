import { test, expect } from '@playwright/test';

test.describe('Cookbook - Modularity', () => {
  test('Should display "Drop some knowledge"', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Modularity/index.html');
    await expect(page.locator('body')).toContainText('Drop some knowledge');
  });
});