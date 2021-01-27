
export const SIGNUP_DISABLED = process.env.FLAG_DISABLE_SIGNUP === 'true'

export const LOG_TOKEN_WEB = process.env.LOG_TOKEN_WEB

// NOTE: if you change these levels, make sure
// the r7 insights logger will accept them!
export const LOG_LEVELS = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'err'
}

export const LOGGER_TYPES = {
  R7_INSIGHT: 'r7insight',
  CONSOLE: 'console',
  NONE: 'none'
}

export const DEFAULT_LOG_LEVEL = LOG_LEVELS.INFO

export const LOGGER = process.env.LOGGER || LOGGER_TYPES.CONSOLE

export const MAILCHIMP_API_URL = 'https://us19.api.mailchimp.com'
export const MAILCHIMP_LIST_ID = 'c1174861df'

console.info(`Logger: ${LOGGER}`)


