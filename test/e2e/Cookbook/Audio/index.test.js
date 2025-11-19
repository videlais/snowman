import { test, expect } from '@playwright/test';

test.describe('Cookbook - Audio', () => {
  test('Should not load audio', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Audio/index.html');
    await expect(page.locator('body')).toContainText("Your browser does not support the audio element.");
  });
});