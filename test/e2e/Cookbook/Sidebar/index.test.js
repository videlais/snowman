/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
   
describe('Cookbook - Left Sidebar', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Cookbook/Sidebar/index.html');
    });
 
  
    it('Should display "Name: Jane Doe" after story start', async () => {
        await expect(page).toMatchTextContent('Name: Jane Doe');
    });
 });