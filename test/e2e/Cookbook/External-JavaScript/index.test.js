/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - Importing External JavaScript', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/External-JavaScript/index.html');
  });
 
  it('Should load external script', async () => {
    await expect(page).toMatchTextContent('Click on the grey box');
  });
});