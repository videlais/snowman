/**
 * @jest-environment puppeteer
 */
const ShellJS = require('shelljs');
const path = require('path');
require('expect-puppeteer');
  
ShellJS.exec(`extwee -c -s dist/snowman-2.2.0-format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);
    
describe('Cookbook - Moving through a dungeon', () => {
    beforeAll(async () => {
        await page.goto(`file://${path.join(__dirname, 'index.html')}`);
    });
  
    afterAll(async () => {
        ShellJS.rm(`${path.join(__dirname, 'index.html')}`);
    });
   
    it('Should display "This is the footer!"', async () => {
        await expect(page).toMatch("This is the footer!");
    });
});