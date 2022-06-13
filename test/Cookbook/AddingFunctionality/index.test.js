/**
 * @jest-environment puppeteer
 */
const ShellJS = require('shelljs');
const path = require('path');
require('expect-puppeteer');

// Create the index.html file to test
ShellJS.exec("extwee -c -s dist/snowman-2.2.0-format.js -i test/Cookbook/AddingFunctionality/snowman_adding_functionality.twee -o test/Cookbook/AddingFunctionality/index.html");

describe('Cookbook - Adding Functionality', () => {
  beforeAll(async () => {
    await page.goto(`file://${path.join(__dirname, 'index.html')}`);
  });

  it('Should display "The current time is" on page', async () => {
    await expect(page).toMatch('The current time is');
  });
})