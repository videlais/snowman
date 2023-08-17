/**
 * @jest-environment puppeteer
 */
const ShellJS = require('shelljs');
const path = require('path');
require('expect-puppeteer');
 
ShellJS.exec(`extwee -c -s dist/format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);
  
describe('Cookbook - Lock and Key: Variable', () => {
   beforeAll(async () => {
     await page.goto(`file://${path.join(__dirname, 'index.html')}`);
   });

   afterAll(async () => {
    ShellJS.rm(`${path.join(__dirname, 'index.html')}`);
   });
 
    it('Should display result', async () => {
        await page.click('[data-passage="Back Room"]');
        await page.click('[class="key-item"]');
        await page.click('[data-passage="Front Room"]');
        await page.click('[data-passage="Exit"]');
        await expect(page).toMatchTextContent('You found the key and went through the door!');
   });
 });