import { test, expect } from '@playwright/test';

test.describe('RunScript - RandomInt Test', () => {
  test('Should display random number', async ({ page }) => {
    await page.goto('/e2e/RunScript/RandomInt_Test/index.html');
    await expect(page.locator('body')).toContainText(/\d/g);
  });
});