/**
 * @jest-environment puppeteer
 */
const ShellJS = require('shelljs');
const path = require('path');
require('expect-puppeteer');
 
ShellJS.exec(`extwee -c -s dist/format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);
  
describe('Cookbook - Dropdown', () => {
    beforeAll(async () => {
        await page.goto(`file://${path.join(__dirname, 'index.html')}`);
    });

    afterAll(async () => {
        ShellJS.rm(`${path.join(__dirname, 'index.html')}`);
    });
 
    it('Should display up', async () => {
        // Select an option.
        await page.select('select#directions', 'up');
        // Go to next passage.
        await page.click('[data-passage="Show Direction"]');
        // Expect to see "up".
        await expect(page).toMatch('The direction was up.');
    });
 });