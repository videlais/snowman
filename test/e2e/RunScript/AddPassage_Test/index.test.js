import { test, expect } from '@playwright/test';

test.describe('RunScript - Add Passage Test', () => {
  test('Should display paragraph', async ({ page }) => {
    await page.goto('/e2e/RunScript/AddPassage_Test/index.html');
    await expect(page.locator('body')).toContainText('Show me!');
  });
});