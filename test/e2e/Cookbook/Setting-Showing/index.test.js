/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 

  
describe('Cookbook - Setting and Showing Variables', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/Setting-Showing/index.html');
  });

 
  it('Should display result', async () => {
    await expect(page).toMatchTextContent('The value is 6 and five.');
  });
});