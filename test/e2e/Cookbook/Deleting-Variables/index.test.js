/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - Deleting Variables', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/Deleting-Variables/index.html');
  });

 
  it('Should display "Does "example" still exist as part of the object window.story? false" after opening chest', async () => {
    await page.click('[data-passage="Delete the value!"]');
    await page.click('[data-passage="Test for value"]');
    await expect(page).toMatchTextContent('Does "example" still exist as part of the global store? false');
  });
});