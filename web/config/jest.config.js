module.exports = {
  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  collectCoverageFrom: ['<rootDir>/src/**/*.{js,jsx,mjs}'],

  // The directory where Jest should output its coverage files
  coverageDirectory: '<rootDir>/coverage',

  // An array of file extensions your modules use
  moduleFileExtensions: ['js', 'json', 'jsx'],

  rootDir: '../',

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: ['<rootDir>/config/enzyme.config.js'],

  // The test environment that will be used for testing
  testEnvironment: 'jsdom',

  // The glob patterns Jest uses to detect test files
  // testMatch: [
  //   '<rootDir>/src/**/?(*.)+(spec|test).js?(x)'
  // ],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ['\\\\node_modules\\\\', 'puppeteer_tests'],

  // This option sets the URL for the jsdom environment. It is reflected in properties such as location.href
  testURL: 'http://localhost',

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
