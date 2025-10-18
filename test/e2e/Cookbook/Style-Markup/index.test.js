/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
  
   
describe('Cookbook - Style Markup', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Cookbook/Style-Markup/index.html');
    });
 
  
    it('Should display "This line is part of the same quote."', async () => {
        await expect(page).toMatchTextContent('This line is part of the same quote.');
    });
});