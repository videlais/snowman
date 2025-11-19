import { test, expect } from '@playwright/test';

test.describe('Cookbook - CSS and Passage Tags', () => {
  test('Should use "tags="yellow"', async ({ page }) => {
    await page.goto('/e2e/Cookbook/CSS-Passage-Tags/index.html');
    await page.click('[data-passage="Second"]');
    await page.waitForSelector('[tags="yellow"]');
    await expect(page.locator('body')).toContainText("black text");
  });
});