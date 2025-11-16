module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  testMatch: [
    '<rootDir>/test/**/*.test.js',
    '<rootDir>/test/*.test.js'
  ],
  testPathIgnorePatterns: [
    'test/integration/html-comparison.test.js',
    'test/integration/complete-html-comparison.test.js',
    'test/integration/reference-comparison.test.js',
    'test/integration/cookbook-examples.test.js',
    'test/playwright/'  // Exclude Playwright tests from Jest
  ],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(marked)/)'  // Transform marked package
  ],
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/test/'
  ]
};
