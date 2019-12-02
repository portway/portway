//packages
import express from 'express'
import bodyParser from 'body-parser'
import passport from 'passport'
//libs
import envVarValidation from './libs/envVarValidation'
import uncaughtErrorHandler from './libs/uncaughtErrorHandler'
import auth from './libs/auth/auth'
import controllerLoader from './controllers/loader'
import apiErrorHandler from './libs/middleware/apiErrorHandler'
import noRouteHandler from './libs/middleware/noRouteHandler'
import httpLogger from './libs/middleware/httpLogger'

// Check if required env vars are set the right format
envVarValidation()

// Setup a listener on uncaught errors to log them
uncaughtErrorHandler()

//instances
const app = express()

// request logging
app.use(httpLogger)

//bodyparser, NOTE: json parsing is applied in the controller loader file
app.use(bodyParser.urlencoded({ extended: true }))

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
//=============================================================================//

// Mount a base router to respond to / requests
// for verifying service is running at FQDN.
// Added for letsencrypt verification of running service
const baseRouter = express.Router()
app.use('/', baseRouter)
baseRouter.get('/', (req, res) => {
  res.json({ message: 'API Initialized' })
})

const router = express.Router()

// Mount router at /api
app.use('/api', router)

//now we can set the route path & initialize the API
router.get('/', (req, res) => {
  res.json({ message: 'API Initialized!' })
})

controllerLoader(router)

// ERROR HANDLING - This should always be the last set of middleware!

//=============================================================================//
// We're only here if no routes matched, throws a 404 to the apiErrorHandler
app.use(noRouteHandler)
// Get here by calling next(error) in a controller
app.use(apiErrorHandler)
//=============================================================================//

export default app
