/**
 * @jest-environment puppeteer
 */
const ShellJS = require('shelljs');
const path = require('path');
require('expect-puppeteer');
   
ShellJS.exec(`extwee -c -s dist/format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);
     
describe('Cookbook - Programmatic Undo', () => {
    beforeAll(async () => {
        await page.goto(`file://${path.join(__dirname, 'index.html')}`);
    });
   
    afterAll(async () => {
        ShellJS.rm(`${path.join(__dirname, 'index.html')}`);
    });
    
    it('Should display "Ready to enter the darkness?"', async () => {
        await page.click('[data-passage="Enter the Darkness"]');
        await page.click('[id="return"]');
        await expect(page).toMatchTextContent("Ready to enter the darkness?");
    });
 });