/**
 * @jest-environment puppeteer
 */
const ShellJS = require('shelljs');
const path = require('path');
require('expect-puppeteer');
 
ShellJS.exec(`extwee -c -s dist/format.js -i ${path.join(__dirname, 'index.twee')} -o ${path.join(__dirname, 'index.html')}`);
  
describe('Cookbook - Fairmath System', () => {
  beforeAll(async () => {
    await page.goto(`file://${path.join(__dirname, 'index.html')}`);
  });

  afterAll(async () => {
    ShellJS.rm(`${path.join(__dirname, 'index.html')}`);
  });
 
  it('Should display "50"', async () => {
    await expect(page).toMatchTextContent(/Decrease 100 by 50% using Fairmath: \d\d/g);
  });
});