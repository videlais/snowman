import { test, expect } from '@playwright/test';

test.describe('Cookbook - Space Exploration', () => {
  test('Should display health', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Space-Exploration/index.html');
    await page.waitForSelector('[data-passage="Space"]');
    await page.click('[data-passage="Space"]');
    // Check for the text before it.
    await expect(page.locator('body')).toContainText('Health: 20');
  });
});