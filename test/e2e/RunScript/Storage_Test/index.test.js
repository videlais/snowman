import { test, expect } from '@playwright/test';

test.describe('RunScript - Storage Test', () => {
  test('Should display session messages', async ({ page }) => {
    await page.goto('/e2e/RunScript/Storage_Test/index.html');
    await page.click('[data-passage="Save the session"]');
    await expect(page.locator('body')).toContainText('Session has been saved!');
    await page.click('[data-passage="Start"]');
    await page.click('[data-passage="Delete previous session?"]');
    await expect(page.locator('body')).toContainText('Save removed!');
  });
});