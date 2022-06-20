/**
 * @jest-environment puppeteer
 */
 const ShellJS = require('shelljs');
 const path = require('path');
 require('expect-puppeteer');
 
 // Create the index.html file to test
 ShellJS.exec(`extwee -c -s dist/snowman-2.2.0-format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);
  
 describe('Cookbook - Cycling choices', () => {
   beforeAll(async () => {
     await page.goto(`file://${path.join(__dirname, 'index.html')}`);
   });
 
   it('Should display "a sword, a shield, a suit of armor" after opening chest', async () => {
        await page.click('[data-passage="hallway"]');
        await page.click('[data-passage="chest"]');
        await expect(page).toMatch("a sword, a shield, a suit of armor");
   });
 });