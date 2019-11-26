/**
 * Middleware request logger for Portway
 */
import logger from '../../integrators/logger'
import { processId } from '../../integrators/uniqueId'
import { LOG_LEVELS } from '../../constants/logging'
/* eslint-disable camelcase */

// Keys are the key that will be logged, and values are functions that will
// be passed the express req, res vars at the end of a request. Functions must
// be synchronous and return a value for the given key
const endFuncs = {
  url: (req) => {
    return req.originalUrl || req.url
  },
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
    const startAt = req._portway.startAt
    if (!startAt) {
      return
    }
    // Calculation from morgan
    // https://github.com/expressjs/morgan/blob/master/index.js#L235
    const ms = (endAt[0] - startAt[0]) * 1e3 + (endAt[1] - startAt[1]) * 1e-6

    return ms.toFixed(2)
  },
  time: req => req._portway.startTime,
  machine_id: () => {
    return processId
  }
}

const httpLogger = (req, res, next) => {
  if (req.method === 'OPTIONS') return next()

  req._portway = {} // Setup namespace
  req._portway.startAt = process.hrtime()
  req._portway.startTime = Date.now()

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