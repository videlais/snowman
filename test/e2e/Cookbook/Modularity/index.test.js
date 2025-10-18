/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - Modularity', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/Modularity/index.html');
  });

 
  it('Should display "Drop some knowledge"', async () => {
    await expect(page).toMatchTextContent('Drop some knowledge');
  });
});