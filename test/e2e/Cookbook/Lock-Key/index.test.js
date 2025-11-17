/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');

jest.setTimeout(15000);
 
  
describe('Cookbook - Lock and Key: Variable', () => {
   beforeAll(async () => {
     await page.goto('http://localhost:3000/e2e/Cookbook/Lock-Key/index.html');
   });

 
    it('Should display result', async () => {
        await page.waitForSelector('[data-passage="Back Room"]', { visible: true });
        await page.click('[data-passage="Back Room"]');
        await page.waitForSelector('[class="key-item"]', { visible: true });
        await page.click('[class="key-item"]');
        await page.waitForSelector('[data-passage="Front Room"]', { visible: true });
        await page.click('[data-passage="Front Room"]');
        await page.waitForSelector('[data-passage="Exit"]', { visible: true });
        await page.click('[data-passage="Exit"]');
        await expect(page).toMatchTextContent('You found the key and went through the door!');
   });
 });