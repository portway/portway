export const LOG_TOKEN_SYNC = process.env.LOG_TOKEN_SYNC

// NOTE: if you change these levels, make sure
// the r7 insights logger will accept them!
export const LOG_LEVELS = {
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'err'
}

export const LOGGER_TYPES = {
  R7_INSIGHT: 'r7insight',
  CONSOLE: 'console'
}

export const DEFAULT_LOG_LEVEL = LOG_LEVELS.INFO

export const LOGGER = process.env.LOGGER || LOGGER_TYPES.CONSOLE

console.info(`Logger: ${LOGGER}`)
