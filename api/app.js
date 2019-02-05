//BASE SETUP
//=============================================================================

//packages
import express from 'express'
import fs from 'fs'
import path from 'path'
import bodyParser from 'body-parser'

//instances
const app = express()

//bodyparser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//cors
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  )
  //and remove cacheing so we get the most recent comments
  res.setHeader('Cache-Control', 'no-cache')
  next()
})

//ROUTES
//=============================================================================

const router = express.Router()

//Use our router configuration when we call /api
app.use('/api', router)

//now we can set the route path & initialize the API
router.get('/', function (req, res) {
  res.json({ message: 'API Initialized!' })
})

//Load the controllers
import billingController from './controllers/billing'

billingController(router)

export default app
