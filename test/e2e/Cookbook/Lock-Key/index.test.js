import { test, expect } from '@playwright/test';

test.describe('Cookbook - Lock and Key: Variable', () => {
  test('Should display result', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Lock-Key/index.html');
    await page.waitForSelector('[data-passage="Back Room"]');
    await page.click('[data-passage="Back Room"]');
    await page.waitForSelector('[class="key-item"]');
    await page.click('[class="key-item"]');
    await page.waitForSelector('[data-passage="Front Room"]');
    await page.click('[data-passage="Front Room"]');
    await page.waitForSelector('[data-passage="Exit"]');
    await page.click('[data-passage="Exit"]');
    await expect(page.locator('body')).toContainText('You found the key and went through the door!');
  });
});