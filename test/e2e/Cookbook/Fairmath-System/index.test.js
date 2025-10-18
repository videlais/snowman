/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - Fairmath System', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/Fairmath-System/index.html');
  });

 
  it('Should display "50"', async () => {
    await expect(page).toMatchTextContent(/Decrease 100 by 50% using Fairmath: \d\d/g);
  });
});