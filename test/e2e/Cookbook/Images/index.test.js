/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - Images', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/Images/index.html');
  });

 
  it('Should display result', async () => {
    await expect(page).toMatchTextContent('This is a Base64-encoded CSS image background:');
  });
});