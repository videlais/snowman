/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');

   
describe('RunScript - Goto Test', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/RunScript/Goto_Test/index.html');
    });    it('Should display paragraph', async () => {
        await expect(page).toMatchTextContent('Show me!');
    });
});