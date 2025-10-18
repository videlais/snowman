/**
 * @jest-environment puppeteer
 */
 const path = require('path');
 require('expect-puppeteer');
 
 // Create the index.html file to test
  
describe('RunScript - Multiple Global Properties Test', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/RunScript/Multiple_Global_Properties/index.html');
  });   it('Should display values', async () => {
        await expect(page).toMatchTextContent('Values are 5 and 56');
   });
 });