import { test, expect } from '@playwright/test';

test.describe('Cookbook - Passage Events', () => {
  test('Should display "This is the footer!"', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Passage-Events/index.html');
    await expect(page.locator('body')).toContainText("This is the footer!");
  });
});