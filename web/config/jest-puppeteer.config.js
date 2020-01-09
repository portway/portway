module.exports = {
  // Tell jest to use jest-puppeteer
  preset: 'jest-puppeteer',

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json', 'jsx'],

  rootDir: '../',

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '<rootDir>/puppeteer_tests/**/?(*.)+(spec|test).js?(x)'
  ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['\\\\node_modules\\\\'],

  transform: {
    '^.+\\.(js|jsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/config/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|css|json)$)': '<rootDir>/config/jest/fileTransform.js'
  },

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],

  // Indicates whether each individual test should be reported during the run
  verbose: false
}
