import { test, expect } from '@playwright/test';

test.describe('Cookbook - Keyboard Events', () => {
  test('Should display "alert" after pressing key', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Keyboard-Events/index.html');
    let result = false;
    page.on('dialog', async (dialog) => {
      result = true;
      await dialog.dismiss();
      await expect(result).toBe(true);
    });
    await page.keyboard.press('a');
  });
});