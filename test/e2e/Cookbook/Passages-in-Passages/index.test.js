/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');

  
describe('Cookbook - Passages in Passages', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Cookbook/Passages-in-Passages/index.html');
    });

 
    it('Should display "And this is Another passage!"', async () => {
        await expect(page).toMatchTextContent('And this is Another passage!');
   });
 });