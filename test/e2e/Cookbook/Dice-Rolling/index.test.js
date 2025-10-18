/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - Dice Rolling', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/Dice-Rolling/index.html');
  });

 
  it('Should display random 1d4 number', async () => {
    await expect(page).toMatchTextContent(/Rolling a 1d4: \d/g);
  });
});