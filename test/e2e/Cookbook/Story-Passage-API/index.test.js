import { test, expect } from '@playwright/test';

test.describe('Cookbook - Story and Passage API', () => {
  test('Should display storage passage content', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Story-Passage-API/index.html');
    await expect(page.locator('body')).toContainText('This is content in the storage passage!');
  });
});