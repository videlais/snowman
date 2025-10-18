/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - Static Healthbars', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Cookbook/Static-Healthbars/index.html');
    });

 
    it('Should display meter', async () => {
        // Wait for the <meter>.
        await page.waitForSelector('meter');
        // Check for the text before it.
        await expect(page).toMatchTextContent('Show a healthbar using a Meter element:');
    });
});