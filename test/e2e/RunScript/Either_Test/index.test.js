import { test, expect } from '@playwright/test';

test.describe('RunScript - Either Test', () => {
  test('Should display number', async ({ page }) => {
    await page.goto('/e2e/RunScript/Either_Test/index.html');
    await expect(page.locator('body')).toContainText(/\d/g);
  });
});