/**
 * @jest-environment puppeteer
 */
 const path = require('path');
 require('expect-puppeteer');
   
 
describe('Errors - Story JavaScript Template Test', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Errors/Story-JavaScript-Template/index.html');
    });    it('Should not produce any errors and run passage template', async () => {
        await expect(page).toMatchTextContent('Hi');
    });
 });
 