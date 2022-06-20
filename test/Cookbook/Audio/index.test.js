/**
 * @jest-environment puppeteer
 */
 const ShellJS = require('shelljs');
 const path = require('path');
 require('expect-puppeteer');
 
 // Create the index.html file to test
 ShellJS.exec(`extwee -c -s dist/snowman-2.2.0-format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);
  
 describe('Cookbook - Audio', () => {
   beforeAll(async () => {
     await page.goto(`file://${path.join(__dirname, 'index.html')}`);
   });
 
   it('Should not load audio', async () => {
     await expect(page).toMatch("Your browser does not support the audio element.");
   });
 });