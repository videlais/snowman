/**
 * @jest-environment puppeteer
 */
 const ShellJS = require('shelljs');
 const path = require('path');
 require('expect-puppeteer');
 
 // Create the index.html file to test
 ShellJS.exec(`extwee -c -s dist/snowman-2.2.0-format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);
  
 describe('Cookbook - CSS and Passage Tags', () => {
   beforeAll(async () => {
     await page.goto(`file://${path.join(__dirname, 'index.html')}`);
   });
 
   it('Should use "tags="yellow"', async () => {
        await page.click('[data-passage="Second"]');
        await page.waitForSelector('[tags="yellow"]');
        await expect(page).toMatch("black text");
   });
 });