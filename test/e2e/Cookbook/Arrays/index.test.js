import { test, expect } from '@playwright/test';

test.describe('Cookbook - Arrays', () => {
  test('Should display "a sword, a shield, a suit of armor" after opening chest', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Arrays/index.html');
    await page.click('[data-passage="hallway"]');
    await page.click('[data-passage="chest"]');
    await expect(page.locator('body')).toContainText("a sword, a shield, a suit of armor");
  });
});