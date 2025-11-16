import { test, expect } from '@playwright/test';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the compiled HTML file (created by global-setup.js)
const compiledHtmlPath = join(__dirname, 'snowman_adding_functionality.html');

test('Adding functionality to display current time', async ({ page }) => {
  // Capture console errors and page errors with full details
  const consoleErrors = [];
  const pageErrors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  page.on('pageerror', error => {
    // Capture full error details including stack trace
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      name: error.name
    };
    pageErrors.push(errorDetails);
    console.log('Page Error Details:', JSON.stringify(errorDetails, null, 2));
  });  await page.goto(`file://${compiledHtmlPath}`);
  
  // Log any errors for debugging
  if (consoleErrors.length > 0) {
    console.log('Console errors:', consoleErrors);
  }
  if (pageErrors.length > 0) {
    console.log('Page errors:', pageErrors);
    // Print detailed error information
    pageErrors.forEach((err, idx) => {
      console.log(`\nError ${idx + 1}:`);
      console.log(`  Name: ${err.name}`);
      console.log(`  Message: ${err.message}`);
      if (err.stack) {
        console.log(`  Stack:\n${err.stack}`);
      }
    });
  }
  
  // Give Snowman a moment to initialize (it runs on DOMContentLoaded)
  await page.waitForTimeout(1000);
  
  // Check if there are JavaScript errors preventing execution
  expect(pageErrors.length).toBe(0);
  
  // Check for the passage content
  const passageContent = await page.textContent('tw-passage');
  expect(passageContent).toContain('The current time is');
  
  // Check for time-like data pattern
  const timePattern = /\d{1,2}:\d{2}(:\d{2})?(\s*(AM|PM))?/i;
  expect(passageContent).toMatch(timePattern);
});