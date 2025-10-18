/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - Lock and Key: Variable', () => {
   beforeAll(async () => {
     await page.goto('http://localhost:3000/e2e/Cookbook/Lock-Key/index.html');
   });

 
    it('Should display result', async () => {
        await page.click('[data-passage="Back Room"]');
        await page.click('[class="key-item"]');
        await page.click('[data-passage="Front Room"]');
        await page.click('[data-passage="Exit"]');
        await expect(page).toMatchTextContent('You found the key and went through the door!');
   });
 });