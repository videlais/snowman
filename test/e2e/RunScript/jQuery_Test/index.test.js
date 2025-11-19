import { test, expect } from '@playwright/test';

test.describe('RunScript - jQuery Test', () => {
  test('Should display greeting', async ({ page }) => {
    await page.goto('/e2e/RunScript/jQuery_Test/index.html');
    await expect(page.locator('body')).toContainText('Hi');
  });
});