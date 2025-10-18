/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - Passage Visits', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/Passage_Visits/index.html');
  });

 
  it('Should display 1 visit count', async () => {
    await page.click('[data-passage="Another Passage"]');
    await page.click('[data-passage="Start"]');
    await expect(page).toMatchTextContent("been visited? 1");
  });
});