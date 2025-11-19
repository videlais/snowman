import { test, expect } from '@playwright/test';

test.describe('RunScript - Single Global Property Test', () => {
  test('Should display 5', async ({ page }) => {
    await page.goto('/e2e/RunScript/Single_Global_Property/index.html');
    await expect(page.locator('body')).toContainText('Value is 5');
  });
});