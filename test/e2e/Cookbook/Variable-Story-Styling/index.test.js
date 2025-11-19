import { test, expect } from '@playwright/test';

test.describe('Cookbook - Variable Story Styling', () => {
  test('Should display "This text is white on a black background."', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Variable-Story-Styling/index.html');
    await page.click('[data-passage="Next Passage"]');
    await expect(page.locator('body')).toContainText("This text is white on a black background.");
  });
});