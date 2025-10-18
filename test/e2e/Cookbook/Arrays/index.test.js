/**
 * @jest-environment puppeteer
 */
const path = require('path');
require('expect-puppeteer');

describe('Cookbook - Arrays', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/Arrays/index.html');
  });
 
  it('Should display "a sword, a shield, a suit of armor" after opening chest', async () => {
    await page.click('[data-passage="hallway"]');
    await page.click('[data-passage="chest"]');
    await expect(page).toMatchTextContent("a sword, a shield, a suit of armor");
  });
});