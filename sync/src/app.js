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

// Set up Express
const router = express.Router()
app.use(router)

process.on('uncaughtException', (error) => {
  logger(LOG_LEVELS.ERROR, error)
})

export default app
