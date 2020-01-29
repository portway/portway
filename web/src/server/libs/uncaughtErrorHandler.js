import { LOG_LEVELS } from '../constants'
import logger from './logger'

const uncaughtErrorHandler = () => {
  process.on('unhandledRejection', (error) => {
    logger(LOG_LEVELS.ERROR, { error })
  })
}

export default uncaughtErrorHandler
