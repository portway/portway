/**
 * Middleware request logger for Portway
 */
import logger from './logger'
import { LOG_LEVELS } from '../constants'
/* eslint-disable camelcase */

// Keys are the key that will be logged, and values are functions that will
// be passed the express req, res vars at the end of a request. Functions must
// be synchronous and return a value for the given key
const endFuncs = {
  url: (req) => {
    return req.originalUrl || req.url
  },
  // endpoint: (req) => {
  //   // Turn the url into a route-like endpoint
  //   // eg 'api/v1/users/12' becomes 'api/v1/users/:id'
  //   // Makes log aggregation much simpler to dig into endpoint performance
  //   const url = req.originalUrl || req.url
  //   const path = url.split('?')[0].split('/')
  //   return path.map(i => i.replace(/^\d+$/, ':id')).join('/')
  // },
  method: req => req.method,
  status: (req, res) => res.statusCode,
  ip: (req) => {
    return (
      req.ip || req._remoteAddress || (req.connection && req.connection.remoteAddress) || undefined
    )
  },
  http_version: (req) => {
    return req.httpVersionMajor + '.' + req.httpVersionMinor
  },
  user_id: (req) => {
    return req.user ? req.user.id : null
  },
  user_agent: req => req.headers['user-agent'],
  res_size: (req, res) => {
    return res.getHeader('content-length')
  },
  res_time: (req) => {
    const endAt = process.hrtime()
    const startAt = req._portwayHttpLog.startAt
    if (!startAt) {
      return
    }
    // Calculation from morgan
    // https://github.com/expressjs/morgan/blob/master/index.js#L235
    const ms = (endAt[0] - startAt[0]) * 1e3 + (endAt[1] - startAt[1]) * 1e-6

    return ms.toFixed(2)
  },
  time: req => req._portwayHttpLog.startTime
}

const httpLogger = (req, res, next) => {
  if (req.method === 'OPTIONS') return next()

  req._portwayHttpLog = {} // Setup namespace
  req._portwayHttpLog.startAt = process.hrtime()
  req._portwayHttpLog.startTime = Date.now()

  res.on('finish', () => {
    const reqLog = Object.keys(endFuncs).reduce((log, key) => {
      log[key] = endFuncs[key].call(this, req, res)
      return log
    }, {})

    logger(LOG_LEVELS.INFO, reqLog)
  })

  next()
}

export default httpLogger
