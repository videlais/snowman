import { test, expect } from '@playwright/test';

test.describe('Cookbook - Static Healthbars', () => {
  test('Should display meter', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Static-Healthbars/index.html');
    // Wait for the <meter>.
    await page.waitForSelector('meter');
    // Check for the text before it.
    await expect(page.locator('body')).toContainText('Show a healthbar using a Meter element:');
  });
});