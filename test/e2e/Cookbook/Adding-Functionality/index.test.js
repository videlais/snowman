const ShellJS = require('shelljs');
const path = require('path');
require('expect-puppeteer');
 
describe('Cookbook - Adding Functionality', () => {
  beforeAll(async () => {

    await page.goto('http://localhost:3000/e2e/Cookbook/Adding-Functionality/index.html');
  });

  it('Should display current year on page', async () => {
    const year = new Date().getFullYear().toString();
    await expect(page).toMatchTextContent(year);
  });
});