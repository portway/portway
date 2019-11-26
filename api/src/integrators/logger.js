import Logger from 'r7insight_node'

const LOG_LEVELS = {
  INFO: 'info',
  ERROR: 'error'
}
const VALID_LOG_LEVEL_VALUES = Object.values(LOG_LEVELS)

const DEFAULT_LOG_LEVEL = LOG_LEVELS.INFO

const logger = new Logger({
  // TODO: make this env var, kube secret
  token: 'd984edf9-07a7-4ff6-94ce-00a519bc7fa9',
  region: 'us',
  console: true // send output to console too
})

export default (level, message) => {
  // First arg is optional level. If only one arg passed, it's the log message so give it the
  // default log level
  if (!message) {
    message = level
    level = DEFAULT_LOG_LEVEL
  } else {
    if (!VALID_LOG_LEVEL_VALUES.includes(level)) {
      throw new Error(`${level} is not a valid log level, must be one of ${VALID_LOG_LEVEL_VALUES}`)
    }
  }

  if (typeof message === 'string') {
    message = { message }
  }

  logger.log(level, message)
}
