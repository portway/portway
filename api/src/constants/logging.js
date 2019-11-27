export const LOG_TOKEN = process.env.LOG_TOKEN

export const LOG_LEVELS = {
  INFO: 'info',
  ERROR: 'error'
}

export const LOGGER_TYPES = {
  R7_INSIGHT: 'r7insight',
  CONSOLE: 'console'
}

export const DEFAULT_LOG_LEVEL = LOG_LEVELS.INFO

export const LOGGER = process.env.LOGGER || LOGGER_TYPES.CONSOLE


