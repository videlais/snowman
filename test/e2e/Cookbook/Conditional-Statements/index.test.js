/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');

 
describe('Cookbook - Conditional Statements', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/Conditional-Statements/index.html');
  });

 
  it(`Should display "It's a horse!"`, async () => {
    await expect(page).toMatchTextContent("It's a horse!");
  });
});