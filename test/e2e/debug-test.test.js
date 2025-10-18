/**
 * @jest-environment puppeteer
 */
require('expect-puppeteer');

describe('Debug Test', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:3000/e2e/Cookbook/Arrays/index.html');
  });
 
  it('Should debug what is rendered on the page', async () => {
    // Check for JavaScript errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    page.on('pageerror', error => {
      errors.push(error.message);
    });
    
    // Wait for the page to load
    await page.waitForSelector('tw-story', { timeout: 5000 });
    
    // Wait a bit more to see if anything gets loaded
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('JavaScript errors:', errors);
    
    // Get the page content
    const content = await page.content();
    console.log('Page HTML length:', content.length);
    
    // Check what's in tw-passage
    const passageContent = await page.$eval('tw-passage', el => el.innerHTML);
    console.log('Passage content:', passageContent);
    
    // Check if the story data is there
    const storyData = await page.$eval('tw-storydata', el => el.getAttribute('name'));
    console.log('Story name:', storyData);
    
    // Check if there are any links
    const links = await page.$$('[data-passage]');
    console.log('Found links with data-passage:', links.length);
    
    // Check if there are any tw-link elements
    const twLinks = await page.$$('tw-link');
    console.log('Found tw-link elements:', twLinks.length);
    
    // Check for any regular links
    const regularLinks = await page.$$('a');
    console.log('Found regular links:', regularLinks.length);
  });
});