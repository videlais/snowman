module.exports = {
  server: {
    command: "npx serve ./test",
    port: 3000,
  },
  launch: {
      dumpio: false, // should we see logs?
      timeout: 30000, // 30 seconds
      headless: true, // false to open a browser
      product: "firefox",
      ignoreHTTPSErrors: true,
      devtools: true
  },
  browserContext: "default", // "incognito" or "default"
};