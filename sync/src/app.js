import express, { json, urlencoded } from 'express'
import passport from 'passport'
import logger from 'morgan'
import cookieParser from 'cookie-parser'

const app = express()

// Middlewares
app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cookieParser())
app.use(passport.initialize())

// Set up Express
const router = express.Router()
app.use(router)

process.on('uncaughtException', (error) => {
  console.error(error)
})

export default app
