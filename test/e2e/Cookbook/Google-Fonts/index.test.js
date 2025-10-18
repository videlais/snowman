/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - Google Fonts', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/Google-Fonts/index.html');
  });

 
  it('Should display message', async () => {
    await expect(page).toMatchTextContent('This text is styled using a Google Font');
  });
});