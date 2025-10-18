/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
   
describe('Cookbook - Player Statistics', () => {
     beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Cookbook/Player-Statistics/index.html');
     });
 
  
    it('Should display increased empathy value', async () => {
        await page.click('[id="empathyIncrease"]');
        await expect(page).toMatchTextContent('Empathy: 11');
    });
});