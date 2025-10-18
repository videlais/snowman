/**
 * @jest-environment puppeteer
 */
 const path = require('path');
 require('expect-puppeteer');
 
 // Create the index.html file to test
  
describe('RunScript - RandomInt Test', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/RunScript/RandomInt_Test/index.html');
  });   it('Should display random number', async () => {
        await expect(page).toMatchTextContent(/\d/g);
   });
 });