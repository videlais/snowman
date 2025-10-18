/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - Date and Time', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/Date-Time/index.html');
  });

 
  it('Should display current year on page', async () => {
    const year = new Date().getFullYear().toString();
    await expect(page).toMatchTextContent(year);
  });
});