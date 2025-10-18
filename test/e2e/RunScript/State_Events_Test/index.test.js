/**
 * @jest-environment puppeteer
 */
 const path = require('path');
 require('expect-puppeteer');
 
 // Create the index.html file to test
  
describe('RunScript - State Events Test', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/RunScript/State_Events_Test/index.html');
  });   it('Should display "This one."', async () => {
        await page.click('[role="link"]');
        await expect(page).toMatchTextContent('This one.');
   });
 });