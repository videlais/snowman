/**
 * @jest-environment puppeteer
 */
 const ShellJS = require('shelljs');
 const path = require('path');
 require('expect-puppeteer');
   
 ShellJS.exec(`extwee -c -s dist/format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);
 
 describe('Story JavaScript - Template', () => {
    beforeAll(async () => {
        await page.goto(`file://${path.join(__dirname, 'index.html')}`);
    });
   
    afterAll(async () => {
        ShellJS.rm(`${path.join(__dirname, 'index.html')}`);
    });
    
    it('Should not produce any errors and run passage template', async () => {
        await expect(page).toMatch('Hi');
    });
 });
 