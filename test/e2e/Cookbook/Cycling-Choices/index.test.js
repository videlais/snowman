/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - Cycling choices', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/Cycling-Choices/index.html');
  });

 
  it('Should display "Two" after link is clicked once', async () => {
    await page.click('[class="cycle"]');
    await expect(page).toMatchTextContent("Two");
  });
});