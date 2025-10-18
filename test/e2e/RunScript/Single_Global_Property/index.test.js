/**
 * @jest-environment puppeteer
 */
 const path = require('path');
 require('expect-puppeteer');
 
 // Create the index.html file to test
  
describe('RunScript - Single Global Property Test', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/RunScript/Single_Global_Property/index.html');
  });   it('Should display 5', async () => {
        await expect(page).toMatchTextContent('Value is 5');
   });
 });