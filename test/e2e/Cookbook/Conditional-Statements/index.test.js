import { test, expect } from '@playwright/test';

test.describe('Cookbook - Conditional Statements', () => {
  test(`Should display "It's a horse!"`, async ({ page }) => {
    await page.goto('/e2e/Cookbook/Conditional-Statements/index.html');
    await expect(page.locator('body')).toContainText("It's a horse!");
  });
});