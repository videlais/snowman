/**
 * @jest-environment puppeteer
 */
const ShellJS = require('shelljs');
const path = require('path');
require('expect-puppeteer');
    
ShellJS.exec(`extwee -c -s dist/format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);
      
describe('Cookbook - Saving Games', () => {
    beforeAll(async () => {
        await page.goto(`file://${path.join(__dirname, 'index.html')}`);
    });
    
    afterAll(async () => {
        ShellJS.rm(`${path.join(__dirname, 'index.html')}`);
    });
     
    it('Should display session messages', async () => {
        await page.click('[data-passage="Save the session"]');
        await expect(page).toMatch('Session has been saved!');
        await page.click('[data-passage="Start"]');
        await page.click('[data-passage="Delete previous session?"]');
        await expect(page).toMatch('Save removed!');
    });
});