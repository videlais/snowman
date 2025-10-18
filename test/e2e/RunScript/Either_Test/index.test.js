/**
 * @jest-environment puppeteer
 */
 const path = require('path');
 require('expect-puppeteer');
 
 // Create the index.html file to test
  
describe('RunScript - Either Test', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/RunScript/Either_Test/index.html');
  });   it('Should display number', async () => {
        await expect(page).toMatchTextContent(/\d/g);
   });
 });