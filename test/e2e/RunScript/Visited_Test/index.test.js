import { test, expect } from '@playwright/test';

test.describe('RunScript - Visited Test', () => {
  test('Should display correct number of visits', async ({ page }) => {
    await page.goto('/e2e/RunScript/Visited_Test/index.html');
    await page.click('[data-passage="Another Passage"]');
    await page.click('[data-passage="Start"]');
    await expect(page.locator('body')).toContainText("been visited? 1");
  });
});