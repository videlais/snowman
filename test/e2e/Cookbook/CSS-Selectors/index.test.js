/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - CSS Selectors', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/CSS-Selectors/index.html');
  });

 
  it('Should have border color of red', async () => {
    await page.click('[data-passage="Second"]');
    await expect(page).toMatchTextContent('This passage also has a red border.');
  });
});