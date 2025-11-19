import { test, expect } from '@playwright/test';

test.describe('Cookbook - Dropdown', () => {
  test('Should display up', async ({ page }) => {
    await page.goto('/e2e/Cookbook/Dropdown/index.html');
    // Select an option.
    await page.selectOption('select#directions', 'up');
    // Go to next passage.
    await page.click('[data-passage="Show Direction"]');
    // Expect to see "up".
    await expect(page.locator('body')).toContainText('The direction was up.');
  });
});