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

