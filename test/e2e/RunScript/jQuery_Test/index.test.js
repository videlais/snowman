/**
 * @jest-environment puppeteer
 */
 const path = require('path');
 require('expect-puppeteer');
 
 // Create the index.html file to test
  
describe('RunScript - jQuery Test', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/RunScript/jQuery_Test/index.html');
  });   it('Should display greeting', async () => {
        await expect(page).toMatchTextContent('Hi');
   });
 });