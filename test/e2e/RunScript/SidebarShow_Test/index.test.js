import { test, expect } from '@playwright/test';

test.describe('RunScript - SidebarShow Test', () => {
  test('Should display paragraph', async ({ page }) => {
    await page.goto('/e2e/RunScript/SidebarShow_Test/index.html');
    await expect(page.locator('body')).toContainText('Show me!');
  });
});