/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
// 15 seconds
jest.setTimeout(15000);
   
    
describe('Cookbook - Typewriter Effect', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Cookbook/Typewriter-Effect/index.html');
    });
  
   
    it('Should display "Hello, world!"', async () => {
        // Wait for 12 seconds
        await new Promise(resolve => setTimeout(resolve, 12000));
        await expect(page).toMatchTextContent('Hello, world!');
    });
});