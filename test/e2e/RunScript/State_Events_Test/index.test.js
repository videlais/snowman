import { test, expect } from '@playwright/test';

test.describe('RunScript - State Events Test', () => {
  test('Should display "This one."', async ({ page }) => {
    await page.goto('/e2e/RunScript/State_Events_Test/index.html');
    await page.waitForSelector('[role="link"]');
    await page.click('[role="link"]');
    await expect(page.locator('body')).toContainText('This one.');
  });
});