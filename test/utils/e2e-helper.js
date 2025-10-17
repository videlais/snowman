/**
 * Shared utilities for E2E tests to reduce duplication
 */
const ShellJS = require('shelljs');
const path = require('path');
require('expect-puppeteer');

/**
 * Compile a Twee file to HTML using extwee
 * @param {string} testDir - Directory containing the test files
 * @param {string} inputFile - Input .twee file name (default: 'index.twee')
 * @param {string} outputFile - Output .html file name (default: 'index.html')
 */
function compileStory(testDir, inputFile = 'index.twee', outputFile = 'index.html') {
  const inputPath = path.join(testDir, inputFile);
  const outputPath = path.join(testDir, outputFile);
  
  ShellJS.exec(`extwee -c -s dist/format.js -i ${inputPath} -o ${outputPath}`);
  
  return outputPath;
}

/**
 * Standard setup for E2E tests
 * @param {string} testDir - Directory containing the test files
 * @param {Object} options - Configuration options
 * @param {string} options.inputFile - Input .twee file name
 * @param {string} options.outputFile - Output .html file name
 * @param {boolean} options.useLocalhost - Whether to use localhost server
 * @param {number} options.timeout - Custom timeout in milliseconds
 */
function setupE2ETest(testDir, options = {}) {
  const {
    inputFile = 'index.twee',
    outputFile = 'index.html',
    useLocalhost = false,
    timeout = 5000
  } = options;

  if (timeout !== 5000) {
    jest.setTimeout(timeout);
  }

  const outputPath = compileStory(testDir, inputFile, outputFile);
  
  const testUrl = useLocalhost 
    ? `http://localhost:3000/e2e/${path.relative(path.join(__dirname, '../e2e'), testDir)}/${outputFile}`
    : `file://${outputPath}`;

  return {
    outputPath,
    testUrl,
    cleanup: () => ShellJS.rm(outputPath)
  };
}

/**
 * Standard describe block for E2E tests
 * @param {string} title - Test suite title
 * @param {string} testDir - Directory containing the test files
 * @param {Function} testFn - Test function
 * @param {Object} options - Configuration options
 */
function describeE2E(title, testDir, testFn, options = {}) {
  describe(title, () => {
    let e2eSetup;

    beforeAll(async () => {
      e2eSetup = setupE2ETest(testDir, options);
      await page.goto(e2eSetup.testUrl);
    });

    afterAll(async () => {
      if (e2eSetup) {
        e2eSetup.cleanup();
      }
    });

    testFn();
  });
}

module.exports = {
  compileStory,
  setupE2ETest,
  describeE2E
};