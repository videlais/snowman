import { test, expect } from '@playwright/test';

test.describe('Cookbook - Moving through a dungeon', () => {
  test('Should display "#.P.#.....#"', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Dungeon/index.html');
    await page.waitForSelector('[data-move="e"]');
    await page.click('[data-move="e"]');
    await expect(page.locator('body')).toContainText("#.P.#.....#");
  });
});