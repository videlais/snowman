/**
 * @jest-environment puppeteer
 */
 const path = require('path');
 require('expect-puppeteer');
 
 // Create the index.html file to test
  
describe('RunScript - getPassageByName Test', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/RunScript/getPassageByName_Test/index.html');
  });   it('Should display storage passage content', async () => {
        await expect(page).toMatchTextContent('This is content in the storage passage!');
   });
 });