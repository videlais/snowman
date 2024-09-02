/**
 * @jest-environment puppeteer
 */
const ShellJS = require('shelljs');
const path = require('path');
require('expect-puppeteer');
 
// 10 seconds
jest.setTimeout(10000);
   
ShellJS.exec(`extwee -c -s dist/format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);
    
describe('Cookbook - Timed Progress Bars', () => {
    beforeAll(async () => {
        await page.goto(`file://${path.join(__dirname, 'index.html')}`);
    });
  
    afterAll(async () => {
        ShellJS.rm(`${path.join(__dirname, 'index.html')}`);
    });
   
    it('Should display "too late"', async () => {
        // Wait for 7 seconds
        await page.waitForTimeout(7000);
        await expect(page).toMatchTextContent('Too late!');
    });
});