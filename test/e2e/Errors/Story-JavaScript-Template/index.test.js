import { test, expect } from '@playwright/test';

test.describe('Errors - Story JavaScript Template Test', () => {
  test('Should not produce any errors and run passage template', async ({ page }) => {
    await page.goto('/e2e/Errors/Story-JavaScript-Template/index.html');
    await expect(page.locator('body')).toContainText('Hi');
  });
});
 