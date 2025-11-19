import { test, expect } from '@playwright/test';

test.describe('Cookbook - Passage Visits', () => {
  test('Should display 1 visit count', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Passage_Visits/index.html');
    await page.click('[data-passage="Another Passage"]');
    await page.click('[data-passage="Start"]');
    await expect(page.locator('body')).toContainText("been visited? 1");
  });
});