/**
 * @jest-environment puppeteer
 */
const ShellJS = require('shelljs');
const path = require('path');
require('expect-puppeteer');
  
// Extend timeout to 10 seconds.
jest.setTimeout(10000);

ShellJS.exec(`extwee -c -s dist/format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);

describe('Cookbook - Loading Screen', () => {
    beforeAll(async () => {
        await page.goto(`file://${path.join(__dirname, 'index.html')}`);
    });
  
    afterAll(async () => {
        ShellJS.rm(`${path.join(__dirname, 'index.html')}`);
    });
   
    it('Should display message', async () => {
        // Wait for seven seconds.
        await page.waitForTimeout(7000);
        await expect(page).toMatchTextContent("You can now see this after the long pause!");
    });
});