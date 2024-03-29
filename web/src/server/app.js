import express, { json, urlencoded } from 'express'
import gzipStatic from 'connect-gzip-static'
import { createServer } from 'http'
import createError from 'http-errors'
import { join } from 'path'
import passport from 'passport'
import logger from 'morgan'
import cookieParser from 'cookie-parser'

// Custom libraries
import { normalizePort, renderBundles } from './libs/express-utilities'
import controllerLoader from './controllers/loader'
import portwayMiddleware from './libs/portwayMiddleware'
import httpLogger from './libs/httpLogger'
import uncaughtErrorHandler from './libs/uncaughtErrorHandler'

import { SUPPORT_LINK } from '../shared/constants'

// Setup a listener on uncaught errors to log them
uncaughtErrorHandler()

const app = express()
app.use(httpLogger)

const port = normalizePort(process.env.PORT || '3000')
const devMode = process.env.NODE_ENV !== 'production'

// If we're in development mode, load the development Webpack config
// and use the Webpack Express Middleware to run webpack when the server
// starts.
if (devMode) {
  const webpackDevMiddleware = require('./libs/webpackDevMiddleware').default
  webpackDevMiddleware(app)
} else {
  const entrypointBundles = require('./entrypoints.json')
  app.locals.bundles = entrypointBundles
}

// Middlewares
app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(cookieParser())
app.use(portwayMiddleware)
app.use(passport.initialize())

// Dont cache these items
const cacheControl = ['manifest.json', 'service-worker.js', '.html']
function setCustomCacheControl(res, path) {
  // Make sure associated domains file is JSON
  if (path.includes('apple-app-site-association')) {
    res.setHeader('Content-Type', 'application/json')
  }

  cacheControl.forEach((item) => {
    if (path.includes(item)) {
      // Custom Cache-Control for web manifest
      res.setHeader('Cache-Control', 'public, max-age=0')
    }
  })
}

// Set public directory for static assets
// NOTE – This has to be after sassMiddleware for sass compilation to work
if (devMode) {
  app.use(express.static(join(__dirname, './public'), { setHeaders: setCustomCacheControl }))
} else {
  const expire = 3.154e+10 // 1 year - Google suggests this
  app.use(gzipStatic(join(__dirname, './public'), { maxAge: expire, setHeaders: setCustomCacheControl }))
}

// Set up Express
app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('port', port)

const router = express.Router()
controllerLoader(router)
app.use(router)

// Server Events
const onListening = () => {
  const addr = server.address()
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
  console.info(`Listening on ${bind}`)
}

const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }
  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)
      break
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

// error handler
app.use((err, req, res, next) => {
  console.info('ERROR HANDLER')
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  console.info(err)
  // render the error page
  res.status(err.status || 500)
  const bundleTemplateVars = renderBundles(req, 'Error', 'index', { supportLink: SUPPORT_LINK })
  res.render('error', { ...bundleTemplateVars, error: err })
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// Finally, create the web server
const server = createServer(app)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

export default app
