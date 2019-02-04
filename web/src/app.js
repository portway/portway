import express, { json, urlencoded } from 'express'
import { createServer } from 'http'
import createError from 'http-errors'
import { join } from 'path'
import logger from 'morgan'

// Custom libraries
import { normalizePort } from './libs/express-utilities'

// Routes
import indexRouter from './routes/index'
import registrationRouter from './routes/registration'

const app = express()
const port = normalizePort(process.env.PORT || '3000')
const devMode = process.env.NODE_ENV !== 'production'

// Set up the routes
app.use('/', indexRouter)
app.use('/registration', registrationRouter)

// If we're in development mode, load the development Webpack config
// and use the Webpack Express Middleware to run webpack when the server
// starts.
if (devMode) {

  const webpackConfig = require('../tools/webpack.dev')
  const webpack = require('webpack')
  const webpackMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const sassMiddleware = require('node-sass-middleware')

  // Enable the Webpack middleware, with Webpack options
  const compiler = webpack(webpackConfig)
  app.use(webpackMiddleware(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath,
    mode: 'development'
  }))
  // Enable Webpack hot reloading with Express
  app.use(webpackHotMiddleware(compiler))
  // Set up Sass middleware for Sass compilation of global Sass files in
  // ./src/sass – These will be output to the css directory in public
  app.use(
    sassMiddleware({
      src: join(__dirname),
      dest: join(__dirname, '../dist'),
      indentedSyntax: false, // true = .sass and false = .scss
      sourceMap: true,
      debug: false
    })
  )
  // Scan the Webpack Development config for entries, creating a bundle
  // object keyed by the base bundle name
  // This is passed to the views using Express's app.locals global store
  // so that we can import the right bundle in development or production
  const bundleKeys = Object.keys(webpackConfig.entry)
  const bundleObject = {}
  bundleKeys.forEach((key) => {
    bundleObject[`vendor~${key}.js`] = `/js/vendor~${key}.bundle.js`
    bundleObject[`${key}.js`] = `/js/${key}.bundle.js`
  })
  app.locals.bundles = bundleObject

} else {
  // Using the WebpackAssetsManifest plugin output in production, store the
  // dynamic bundle names (hashed) in  JSON file for use in the Express views
  app.locals.bundles = require('../dist/manifest.json')
}

// Set public directory for static assets
// NOTE – This has to be after sassMiddleware for sass compilation to work
app.use(express.static(join(__dirname, '../dist')))

// Set up Express
app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('port', port)
app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))

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
  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port
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
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// Finally, create the web server
const server = createServer(app)
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

export default app
