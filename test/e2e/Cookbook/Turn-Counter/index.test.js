/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - Turn Counter', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/Turn-Counter/index.html');
  });

 
  it('Should display "It is morning." after opening chest', async () => {
    await page.click('[data-passage="Left Room"]');
    await expect(page).toMatchTextContent("It is morning.");
  });
});