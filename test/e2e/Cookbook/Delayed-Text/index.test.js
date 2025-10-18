/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');

jest.setTimeout(15000);

  
describe('Cookbook - Delayed Text', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/Delayed-Text/index.html');
  });

 
  it('Should display "5 seconds" after at least five seconds', async () => {
    // Should be done under 10 seconds
    // Wait for #timer, which should be 5 seconds
    await page.waitForSelector('#timer');
    // Check page now has text
    await expect(page).toMatchTextContent('It has been 5 seconds. Show the text!');
   });
 });