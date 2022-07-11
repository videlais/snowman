/**
 * @jest-environment puppeteer
 */
const ShellJS = require('shelljs');
const path = require('path');
require('expect-puppeteer');
 
ShellJS.exec(`extwee -c -s dist/format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);
  
describe('Cookbook - Deleting Variables', () => {
  beforeAll(async () => {
    await page.goto(`file://${path.join(__dirname, 'index.html')}`);
  });

  afterAll(async () => {
    ShellJS.rm(`${path.join(__dirname, 'index.html')}`);
  });
 
  it('Should display "Does "example" still exist as part of the object window.story? false" after opening chest', async () => {
    await page.click('[data-passage="Delete the value!"]');
    await page.click('[data-passage="Test for value"]');
    await expect(page).toMatch('Does "example" still exist as part of the object window.story? false');
  });
});