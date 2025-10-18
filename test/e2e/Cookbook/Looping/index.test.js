/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
  
   
describe('Cookbook - Looping', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Cookbook/Looping/index.html');
    });
 
  
    it('Should display inventory', async () => {
        await expect(page).toMatchTextContent('You have Bread');
    });
  });