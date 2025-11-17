/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
  
   
describe('Cookbook - Space Exploration', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Cookbook/Space-Exploration/index.html');
    });
 
  
    it('Should display health', async () => {
        await page.waitForSelector('[data-passage="Space"]');
        await page.click('[data-passage="Space"]');
        // Check for the text before it.
        await expect(page).toMatchTextContent('Health: 20');
    });
});