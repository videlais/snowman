/**
 * @jest-environment puppeteer
 */
const ShellJS = require('shelljs');
const path = require('path');
require('expect-puppeteer');
 
ShellJS.exec(`extwee -c -s dist/snowman-2.2.0-format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);
  
describe('Cookbook - Static Healthbars', () => {
    beforeAll(async () => {
        await page.goto(`file://${path.join(__dirname, 'index.html')}`);
    });

    afterAll(async () => {
        ShellJS.rm(`${path.join(__dirname, 'index.html')}`);
    });
 
    it('Should display meter', async () => {
        // Wait for the <meter>.
        await page.waitForSelector('meter');
        // Check for the text before it.
        await expect(page).toMatch('Show a healthbar using a Meter element:');
    });
});