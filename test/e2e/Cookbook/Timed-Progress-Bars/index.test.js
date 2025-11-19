/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');    
describe('Cookbook - Timed Progress Bars', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Cookbook/Timed-Progress-Bars/index.html');
    });
  
   
    it('Should display "too late"', async () => {
        // Wait for 7 seconds
        await new Promise(resolve => setTimeout(resolve, 7000));
        await expect(page).toMatchTextContent('Too late!');
    });
});