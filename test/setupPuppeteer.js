/**
 * Setup file for Puppeteer E2E tests
 * Configures expect-puppeteer timeout to match Jest timeout
 */

// Set Jest timeout to 30 seconds
jest.setTimeout(30000);

// Configure expect-puppeteer default options
// This must be done before any tests run
const { setDefaultOptions } = require('expect-puppeteer');

setDefaultOptions({
  timeout: 30000  // 30 seconds for all expect-puppeteer matchers
});

// Set up global configuration for all Puppeteer pages
// This sets the default timeout for page.waitForSelector, page.waitForFunction, etc.
beforeEach(async () => {
  if (page) {
    page.setDefaultTimeout(30000);
    page.setDefaultNavigationTimeout(30000);
  }
});

// Clean up after each test to prevent state leakage
afterEach(async () => {
  if (page) {
    // Clear any dialogs
    try {
      await page.evaluate(() => {
        // Clear any timers
        const highestTimeoutId = setTimeout(() => {}, 0);
        for (let i = 0; i < highestTimeoutId; i++) {
          clearTimeout(i);
        }
        const highestIntervalId = setInterval(() => {}, 0);
        for (let i = 0; i < highestIntervalId; i++) {
          clearInterval(i);
        }
      });
    } catch (e) {
      // Page might be closed, ignore
    }
  }
});

