import { LOG_LEVELS } from '../constants/logging'
import logger from '../integrators/logger'

const uncaughtErrorHandler = () => {
  process.on('unhandledRejection', (error) => {
    logger(LOG_LEVELS.ERROR, { error })
  })
}

export default uncaughtErrorHandler