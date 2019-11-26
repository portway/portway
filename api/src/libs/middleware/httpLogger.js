import logger from '../../integrators/logger'

/* eslint-disable camelcase */

/**
- //response size
- //res time (ms)
- //url (path)
- //method
- //user agent
- //user (id? email?)
- machine (host?) name
- //timestamp (utc)
 */

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
    req.httpVersionMajor + '.' + req.httpVersionMinor
  },
  user: (req) => {
    return req.user ? req.user.id : null
  },
  user_agent: req => req.headers['user-agent'],
  res_size: (req, res) => {
    return res.getHeader('content-length')
  },
  res_time: (req) => {
    const endAt = process.hrtime
    const startAt = req._portway.startAt
    if (!startAt) {
      return
    }
    // Calculation from morgan
    // https://github.com/expressjs/morgan/blob/master/index.js#L235
    const ms = (endAt[0] - startAt[0]) * 1e3 + (endAt[1] - startAt[1]) * 1e-6

    return ms.toFixed(3)
  },
  time: req => req._portway.startTime
}

const httpLogger = (req, res, next) => {
  req._portway = {} // Setup namespace
  req._portway.startAt = process.hrtime()
  req._portway.startTime = Date.now()

  res.on('finish', () => {
    const reqLog = Object.keys(endFuncs).reduce((log, key) => {
      log[key] = endFuncs[key].call(this, req, res)
      return log
    }, {})

    //logger('info', reqLog)
    console.info(reqLog)
  })

  next()
}

export default httpLogger