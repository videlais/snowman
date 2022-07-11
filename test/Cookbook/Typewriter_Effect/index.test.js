/**
 * @jest-environment puppeteer
 */
const ShellJS = require('shelljs');
const path = require('path');
require('expect-puppeteer');
 
// 15 seconds
jest.setTimeout(15000);
   
ShellJS.exec(`extwee -c -s dist/format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);
    
describe('Cookbook - Typewriter Effect', () => {
    beforeAll(async () => {
        await page.goto(`file://${path.join(__dirname, 'index.html')}`);
    });
  
    afterAll(async () => {
        ShellJS.rm(`${path.join(__dirname, 'index.html')}`);
    });
   
    it('Should display "Hello, world!"', async () => {
        // Wait for 12 seconds
        await page.waitForTimeout(12000);
        await expect(page).toMatch('Hello, world!');
    });
});