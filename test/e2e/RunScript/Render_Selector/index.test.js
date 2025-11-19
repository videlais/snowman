import { test, expect } from '@playwright/test';

test.describe('RunScript - Render Selector Test', () => {
  test('Should display "Hey!"', async ({ page }) => {
    await page.goto('/e2e/RunScript/Render_Selector/index.html');
    await expect(page.locator('body')).toContainText('Hey!');
  });
});
