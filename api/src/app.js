//packages
import express from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'
import logger from 'morgan'
//libs
import envVarValidation from './libs/envVarValidation'
import auth from './libs/auth'
import controllerLoader from './controllers/loader'

// Check if required env vars are set the right format
envVarValidation()

//instances
const app = express()

//logging
app.use(logger('dev'))

//bodyparser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET,HEAD,OPTIONS,POST,PUT,DELETE'
  )
  res.setHeader(
    'Access-Control-Allow-Headers',
    // eslint-disable-next-line max-len
    'Access-Control-Allow-Headers, Authorization, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers'
  )
  // remove caching to ensure fresh results
  res.setHeader('Cache-Control', 'no-cache')

  // Respond to OPTION requests before doing anything else
  if (req.method === 'OPTIONS') {
    res.setHeader('Content-Length', '0')
    res.statusCode = 204
    res.end()
  } else {
    next()
  }
})

app.use(passport.initialize())
auth.init(passport)

//ROUTES
//=============================================================================

const router = express.Router()

// Mount router at /api
app.use('/api', router)

//now we can set the route path & initialize the API
router.get('/', (req, res) => {
  res.json({ message: 'API Initialized!' })
})

controllerLoader(router)

export default app
