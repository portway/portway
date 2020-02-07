import express, { json, urlencoded } from 'express'
import passport from 'passport'
import logger from 'morgan'
import cookieParser from 'cookie-parser'

const app = express()

const controllerLoader = () => {}

// Middlewares
app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cookieParser())
app.use(passport.initialize())

// Set up Express
const router = express.Router()
controllerLoader(router)
app.use(router)

export default app
