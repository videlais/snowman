/**
 * @jest-environment puppeteer
 */
const ShellJS = require('shelljs');
const path = require('path');
require('expect-puppeteer');

ShellJS.exec(`extwee -c -s dist/format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);
  
describe('Cookbook - Passages in Passages', () => {
    beforeAll(async () => {
        await page.goto(`file://${path.join(__dirname, 'index.html')}`);
    });

    afterAll(async () => {
        ShellJS.rm(`${path.join(__dirname, 'index.html')}`);
    });
 
    it('Should display "And this is Another passage!"', async () => {
        await expect(page).toMatch('And this is Another passage!');
   });
 });