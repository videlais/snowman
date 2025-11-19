import { test, expect } from '@playwright/test';

test.describe('Cookbook - Player Statistics', () => {
  test('Should display increased empathy value', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Player-Statistics/index.html');
    await page.waitForSelector('[id="empathyIncrease"]');
    await page.click('[id="empathyIncrease"]');
    await expect(page.locator('body')).toContainText('Empathy: 11');
  });
});