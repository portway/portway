module.exports = {
  rootDir: '../',
  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: ['<rootDir>/config/jestenv.config.js'],
  testRegex: 'src/.*\\.test-(u|a|i)\\.js$',
  verbose: true,
  testEnvironment: 'node'
}
