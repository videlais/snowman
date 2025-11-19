import { test, expect } from '@playwright/test';

test.describe('Cookbook - Modal', () => {
  test('Should display and close modal', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Modal/index.html');
    await page.waitForSelector('[id="myBtn"]');
    await page.click('[id="myBtn"]');
    await page.waitForSelector('[class="close"]');
    await page.click('[class="close"]');
    await expect(page.locator('body')).toContainText('Example text in the modal');
  });
});