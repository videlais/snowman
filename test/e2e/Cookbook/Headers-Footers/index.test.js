/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - Headers and Footers', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/Headers-Footers/index.html');
  });

 
  it('Should display footer', async () => {
    await expect(page).toMatchTextContent('This is the footer!');
  });
});