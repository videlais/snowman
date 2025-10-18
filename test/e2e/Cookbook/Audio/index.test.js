/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');
 
  
describe('Cookbook - Audio', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/Audio/index.html');
  });

 
  it('Should not load audio', async () => {
    await expect(page).toMatchTextContent("Your browser does not support the audio element.");
  });
});