/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
  
    
describe('Cookbook - Render Passage to Element', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Cookbook/RenderPassageToElement/index.html');
    });
  
   
    it('Should display "This is the HUD!"', async () => {
        await expect(page).toMatchTextContent('This is the HUD!');
    });
});