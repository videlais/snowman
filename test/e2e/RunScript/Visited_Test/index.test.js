/**
 * @jest-environment puppeteer
 */
 const path = require('path');
 require('expect-puppeteer');
 
 // Create the index.html file to test
  
describe('RunScript - Visited Test', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/RunScript/Visited_Test/index.html');
  });   it('Should display correct number of visits', async () => {
        await page.click('[data-passage="Another Passage"]');
        await page.click('[data-passage="Start"]');
        await expect(page).toMatchTextContent("been visited? 1");
   });
 });