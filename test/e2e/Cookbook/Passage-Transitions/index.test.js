/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
   
     
describe('Cookbook - Passage Transitions', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Cookbook/Passage-Transitions/index.html');
    });
   
    
    it('Should display "A Third Passage"', async () => {
        await page.click('[data-passage="Another Passage"]');
        await expect(page).toMatchTextContent("A Third Passage");
    });
 });