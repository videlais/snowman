/**
 * @jest-environment puppeteer
 */
const ShellJS = require('shelljs');
const path = require('path');
require('expect-puppeteer');

jest.setTimeout(15000);

ShellJS.exec(`extwee -c -s dist/format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);
  
describe('Cookbook - Delayed Text', () => {
  beforeAll(async () => {
    await page.goto(`file://${path.join(__dirname, 'index.html')}`);
  });

  afterAll(async () => {
    ShellJS.rm(`${path.join(__dirname, 'index.html')}`);
  });
 
  it('Should display "5 seconds" after at least five seconds', async () => {
    // Should be done under 10 seconds
    // Wait for #timer, which should be 5 seconds
    await page.waitForSelector('#timer');
    // Check page now has text
    await expect(page).toMatch('It has been 5 seconds. Show the text!');
   });
 });