/**
 * @jest-environment puppeteer
 */
const ShellJS = require('shelljs');
const path = require('path');
require('expect-puppeteer');

// 15 seconds
jest.setTimeout(15000);
  
ShellJS.exec(`extwee -c -s dist/format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);
   
describe('Cookbook - Timed Passages', () => {
    beforeAll(async () => {
        await page.goto(`file://${path.join(__dirname, 'index.html')}`);
    });
 
    afterAll(async () => {
        ShellJS.rm(`${path.join(__dirname, 'index.html')}`);
    });
  
    it('Should display "world ended"', async () => {
        // Wait for 11 seconds
        await new Promise(resolve => setTimeout(resolve, 11000));
        await expect(page).toMatchTextContent('The world ended.');
    });
});