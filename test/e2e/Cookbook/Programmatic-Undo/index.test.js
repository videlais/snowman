/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
   
     
describe('Cookbook - Programmatic Undo', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Cookbook/Programmatic-Undo/index.html');
    });
   
    
    it('Should display "Ready to enter the darkness?"', async () => {
        await page.waitForSelector('[data-passage="Enter the Darkness"]');
        await page.click('[data-passage="Enter the Darkness"]');
        await page.waitForSelector('[id="return"]');
        await page.click('[id="return"]');
        await expect(page).toMatchTextContent("Ready to enter the darkness?");
    });
 });