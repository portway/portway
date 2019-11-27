import Logger from 'r7insight_node'
import { LOGGER, LOG_TOKEN, LOG_LEVELS, DEFAULT_LOG_LEVEL, LOGGER_TYPES } from '../constants/logging'
import { processId } from '../integrators/uniqueId'

const VALID_LOG_LEVEL_VALUES = Object.values(LOG_LEVELS)

let logger

switch (LOGGER) {
  case LOGGER_TYPES.R7_INSIGHT:
    console.info(LOG_TOKEN)
    logger = new Logger({
      token: LOG_TOKEN,
      region: 'us',
      console: true // send output to console too
    })

    logger.on('error', console.error)
    break
  default:
    // eslint-disable-next-line no-console
    logger = console
}

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

  // Add the machine id to anything logged
  // eslint-disable-next-line camelcase
  message.machine_id = processId

  logger.log(level, message)
}
