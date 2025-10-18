/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
  
    
describe('Cookbook - Passage Events', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Cookbook/Passage-Events/index.html');
    });
  
   
    it('Should display "This is the footer!"', async () => {
        await expect(page).toMatchTextContent("This is the footer!");
    });
});