/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - CSS and Passage Tags', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/CSS-Passage-Tags/index.html');
  });

 
  it('Should use "tags="yellow"', async () => {
    await page.click('[data-passage="Second"]');
    await page.waitForSelector('[tags="yellow"]');
    await expect(page).toMatchTextContent("black text");
  });
});