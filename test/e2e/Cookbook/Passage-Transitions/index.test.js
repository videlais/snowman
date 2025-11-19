import { test, expect } from '@playwright/test';

test.describe('Cookbook - Passage Transitions', () => {
  test('Should display "A Third Passage"', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Passage-Transitions/index.html');
    await page.click('[data-passage="Another Passage"]');
    await expect(page.locator('body')).toContainText("A Third Passage");
  });
});