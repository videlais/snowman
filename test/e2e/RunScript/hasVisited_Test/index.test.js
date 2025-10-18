/**
 * @jest-environment puppeteer
 */
 const path = require('path');
 require('expect-puppeteer');
 
 // Create the index.html file to test
  
 describe('RunScript - hasVisited Test', () => {
   beforeAll(async () => {
     await page.goto('http://localhost:3000/e2e/RunScript/hasVisited_Test/index.html');
   });
 
   it('Should display "Hi!"', async () => {
        await page.click('[data-passage="Another"]');
        await expect(page).toMatchTextContent('Hi!');
   });
 });