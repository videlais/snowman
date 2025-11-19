import { test, expect } from '@playwright/test';

test.describe('Cookbook - Importing External JavaScript', () => {
  test('Should load external script', async ({ page }) => {
    await page.goto('/e2e/Cookbook/External-JavaScript/index.html');
    await expect(page.locator('body')).toContainText('Click on the grey box');
  });
});