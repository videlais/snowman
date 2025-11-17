/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
   
describe('Cookbook - Moving through a dungeon', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Cookbook/Dungeon/index.html');
    });
 
  
    it('Should display "#.P.#.....#"', async () => {
        await page.waitForSelector('[data-move="e"]');
        await page.click('[data-move="e"]');
        await expect(page).toMatchTextContent("#.P.#.....#");
    });
});