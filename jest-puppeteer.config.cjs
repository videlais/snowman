// Configuration that handles both Firefox and Chrome for CI environments
const isCI = !!process.env.CI;

module.exports = {
  server: {
    command: "npx serve ./test",
    port: 3000,
  },
  launch: {
      dumpio: false, // should we see logs?
      timeout: 30000, // 30 seconds
      headless: true, // false to open a browser
      // Use Chrome in CI if Firefox isn't available
      product: isCI ? "chrome" : "firefox",
      ignoreHTTPSErrors: true,
      devtools: !isCI, // Disable devtools in CI
      // Browser args for CI environments
      args: isCI ? [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding'
      ] : []
  },
  browserContext: "default", // "incognito" or "default"
};