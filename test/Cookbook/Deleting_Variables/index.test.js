/**
 * @jest-environment puppeteer
 */
 const ShellJS = require('shelljs');
 const path = require('path');
 require('expect-puppeteer');
 
 // Create the index.html file to test
 ShellJS.exec(`extwee -c -s dist/snowman-2.2.0-format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);
  
 describe('Cookbook - Deleting Variables', () => {
   beforeAll(async () => {
     await page.goto(`file://${path.join(__dirname, 'index.html')}`);
   });
 
   it('Should display "Does "example" still exist as part of the object window.story? false" after opening chest', async () => {
        await page.click('[data-passage="Delete the value!"]');
        await page.click('[data-passage="Test for value"]');
        await expect(page).toMatch('Does "example" still exist as part of the object window.story? false');
   });
 });