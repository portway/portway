import webpack from 'webpack'
import express, { json, urlencoded } from 'express'

import createError from 'http-errors'
import { normalizePort } from './libs/express-utilities'
import { join } from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

// Express Middleware
import webpackMiddleware  from 'webpack-dev-middleware'
import webpackHotMiddleware  from 'webpack-hot-middleware'
import sassMiddleware from 'node-sass-middleware'

import { createServer } from 'http'

import indexRouter from './routes/index'
import usersRouter from './routes/users'

const app = express()
const port = normalizePort(process.env.PORT || '3000')
const webpackConfig = require('../webpack.config')
const compiler = webpack(webpackConfig)

// view engine setup
app.set('views', join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.set('port', port)

app.use(logger('dev'))
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cookieParser())
app.use(webpackMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
  mode: 'development'
}))
app.use(webpackHotMiddleware(compiler))
app.use(
  sassMiddleware({
    src: join(__dirname, 'sass'),
    dest: join(__dirname, 'public'),
    indentedSyntax: false, // true = .sass and false = .scss
    sourceMap: true
  })
)
app.use(express.static(join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

/**
 * Create HTTP server.
 */
var server = createServer(app)

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

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port)
server.on('error', onError)
server.on('listening', onListening)

export default app
