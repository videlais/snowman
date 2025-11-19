import { test, expect } from '@playwright/test';

test.describe('RunScript - Render Test', () => {
  test('Should display "Hey!"', async ({ page }) => {
    await page.goto('/e2e/RunScript/Include_Test/index.html');
    await expect(page.locator('body')).toContainText('Hey!');
  });
});
