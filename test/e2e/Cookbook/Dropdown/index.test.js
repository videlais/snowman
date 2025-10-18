/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - Dropdown', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Cookbook/Dropdown/index.html');
    });

 
    it('Should display up', async () => {
        // Select an option.
        await page.select('select#directions', 'up');
        // Go to next passage.
        await page.click('[data-passage="Show Direction"]');
        // Expect to see "up".
        await expect(page).toMatchTextContent('The direction was up.');
    });
 });