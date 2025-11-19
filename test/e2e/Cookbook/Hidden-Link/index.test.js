import { test, expect } from '@playwright/test';

test.describe('Cookbook - Hidden Link', () => {
  test('Should display result', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Hidden-Link/index.html');
    await page.click('[data-passage="A hidden link"]');
    await expect(page.locator('body')).toContainText('You found it!');
  });
});