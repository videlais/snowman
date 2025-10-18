/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - Hidden Link', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/Hidden-Link/index.html');
  });

 
  it('Should display result', async () => {
    await page.click('[data-passage="A hidden link"]');
    await expect(page).toMatchTextContent('You found it!');
  });
});