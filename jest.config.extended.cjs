module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  testMatch: [
    '<rootDir>/test/integration/reference-comparison.test.js'
  ],
  transform: {
    '^.+\\.js$': 'babel-jest'
  },
  collectCoverage: false
};