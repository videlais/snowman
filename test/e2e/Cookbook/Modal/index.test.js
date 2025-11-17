/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');

jest.setTimeout(15000);
 
   
describe('Cookbook - Modal', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:3000/e2e/Cookbook/Modal/index.html');
    });
 
  
    it('Should display and close modal', async () => {
        await page.waitForSelector('[id="myBtn"]', { visible: true });
        await page.click('[id="myBtn"]');
        await page.waitForSelector('[class="close"]', { visible: true });
        await page.click('[class="close"]');
        await expect(page).toMatchTextContent('Example text in the modal');
    });
  });