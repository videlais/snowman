/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - Story and Passage API', () => {
   beforeAll(async () => {
     await page.goto('http://localhost:3000/e2e/Cookbook/Story-Passage-API/index.html');
   });

 
    it('Should display storage passage content', async () => {
        await expect(page).toMatchTextContent('This is content in the storage passage!');
   });
 });