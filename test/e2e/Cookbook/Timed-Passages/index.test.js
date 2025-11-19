/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
  
   
describe('Cookbook - Timed Passages', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Cookbook/Timed-Passages/index.html');
    });
 
  
    it('Should display "world ended"', async () => {
        // Wait for 11 seconds
        await new Promise(resolve => setTimeout(resolve, 11000));
        await expect(page).toMatchTextContent('The world ended.');
    });
});