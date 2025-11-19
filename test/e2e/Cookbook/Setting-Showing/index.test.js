import { test, expect } from '@playwright/test';

test.describe('Cookbook - Setting and Showing Variables', () => {
  test('Should display result', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Setting-Showing/index.html');
    await expect(page.locator('body')).toContainText('The value is 6 and five.');
  });
});