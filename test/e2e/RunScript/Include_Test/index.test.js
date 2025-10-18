/**
 * @jest-environment puppeteer
 */
 const path = require('path');
 require('expect-puppeteer');
 
 // Create the index.html file to test
  
 describe('RunScript - Render Test', () => {
   beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/RunScript/Include_Test/index.html');
   });
 
   it('Should display "Hey!"', async () => {
        await expect(page).toMatchTextContent('Hey!');
   });
 });
