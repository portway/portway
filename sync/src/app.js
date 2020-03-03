import express, { json, urlencoded } from 'express'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import { LOG_LEVELS } from './constants'

const app = express()

// Middlewares
app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cookieParser())
// Mount a base router to respond to / requests
// for verifying service is running at FQDN.
// Added for letsencrypt verification of running service
const baseRouter = express.Router()
app.use('/', baseRouter)
baseRouter.get('/', (req, res) => {
  res.json({ message: 'Sync Initialized' })
})

process.on('uncaughtException', (error) => {
  logger(LOG_LEVELS.ERROR, error)
})

export default app
