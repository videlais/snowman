import { test, expect } from '@playwright/test';

test.describe('Cookbook - Turn Counter', () => {
  test('Should display "It is morning." after opening chest', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Turn-Counter/index.html');
    await page.click('[data-passage="Left Room"]');
    await expect(page.locator('body')).toContainText("It is morning.");
  });
});