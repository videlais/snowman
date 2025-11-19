import { test, expect } from '@playwright/test';

test.describe('RunScript - getPassageByName Test', () => {
  test('Should display storage passage content', async ({ page }) => {
    await page.goto('/e2e/RunScript/getPassageByName_Test/index.html');
    await expect(page.locator('body')).toContainText('This is content in the storage passage!');
  });
});