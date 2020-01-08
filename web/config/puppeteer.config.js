// This is the puppeteer config! It is used by jest-puppeteer to set the config
// for puppeteer. If you want to configure jest for jest-puppeteer use, use
// jest-puppeteer.config.js

// Config options defined here:
// https://github.com/puppeteer/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
module.exports = {
  launch: {
    headless: true
  }
}