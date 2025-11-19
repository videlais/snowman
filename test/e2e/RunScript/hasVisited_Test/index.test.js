import { test, expect } from '@playwright/test';

test.describe('RunScript - hasVisited Test', () => {
  test('Should display "Hi!"', async ({ page }) => {
    await page.goto('/e2e/RunScript/hasVisited_Test/index.html');
    await page.click('[data-passage="Another"]');
    await expect(page.locator('body')).toContainText('Hi!');
  });
});