import { test, expect } from '@playwright/test';

test.describe('Cookbook - Style Markup', () => {
  test('Should display "This line is part of the same quote."', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Style-Markup/index.html');
    await expect(page.locator('body')).toContainText('This line is part of the same quote.');
  });
});