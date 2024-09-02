/**
 * @jest-environment puppeteer
 */
const ShellJS = require('shelljs');
const path = require('path');
require('expect-puppeteer');
 

ShellJS.exec(`extwee -c -s dist/format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);
  
describe('Cookbook - Setting and Showing Variables', () => {
  beforeAll(async () => {
    await page.goto(`file://${path.join(__dirname, 'index.html')}`);
  });

  afterAll(async () => {
    ShellJS.rm(`${path.join(__dirname, 'index.html')}`);
  });
 
  it('Should display result', async () => {
    await expect(page).toMatchTextContent('The value is 6 and five.');
  });
});