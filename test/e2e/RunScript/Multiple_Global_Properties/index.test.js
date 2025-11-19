import { test, expect } from '@playwright/test';

test.describe('RunScript - Multiple Global Properties Test', () => {
  test('Should display values', async ({ page }) => {
    await page.goto('/e2e/RunScript/Multiple_Global_Properties/index.html');
    await expect(page.locator('body')).toContainText('Values are 5 and 56');
  });
});