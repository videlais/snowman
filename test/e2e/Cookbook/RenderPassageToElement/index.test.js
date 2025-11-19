import { test, expect } from '@playwright/test';

test.describe('Cookbook - Render Passage to Element', () => {
  test('Should display "This is the HUD!"', async ({ page }) => {
    await page.goto('/e2e/Cookbook/RenderPassageToElement/index.html');
    await expect(page.locator('body')).toContainText('This is the HUD!');
  });
});