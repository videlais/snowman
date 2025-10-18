/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('RunScript - Storage Test', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/RunScript/Storage_Test/index.html');
    });
 
    it('Should display session messages', async () => {
        await page.click('[data-passage="Save the session"]');
        await expect(page).toMatchTextContent('Session has been saved!');
        await page.click('[data-passage="Start"]');
        await page.click('[data-passage="Delete previous session?"]');
        await expect(page).toMatchTextContent('Save removed!');
    });
});