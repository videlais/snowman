/**
 * @jest-environment puppeteer
 */
const path = require('node:path');
require('expect-puppeteer');
   
// Extend timeout to 10 seconds.
jest.setTimeout(10000);
 
 
describe('Cookbook - Loading Screen', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/RunScript/Loading_Test/index.html');
    });
    
    it('Should display message', async () => {
        // Wait for seven seconds.
        await new Promise(resolve => setTimeout(resolve, 7000));
        await expect(page).toMatchTextContent("You can now see this after the long pause!");
    });
});