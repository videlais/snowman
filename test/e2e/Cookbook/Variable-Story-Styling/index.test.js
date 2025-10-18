/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
   
describe('Cookbook - Variable Story Styling', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Cookbook/Variable-Story-Styling/index.html');
    });
 
  
    it('Should display "This text is white on a black background."', async () => {
        await page.click('[data-passage="Next Passage"]');
        await expect(page).toMatchTextContent("This text is white on a black background.");
    });
});