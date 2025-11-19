import { test, expect } from '@playwright/test';

test.describe('Cookbook - Cycling choices', () => {
  test('Should display "Two" after link is clicked once', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Cycling-Choices/index.html');
    await page.waitForSelector('[class="cycle"]');
    await page.click('[class="cycle"]');
    await expect(page.locator('body')).toContainText("Two");
  });
});