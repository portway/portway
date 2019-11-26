import logger from '../../integrators/logger'

/**
- response size
- time (ms)
- url (path)
- method
- user agent
- user (id? email?)
- machine (host?) name
- timestamp (utc)
 */

const logFuncs = {
  url: (req) => { return req.originalUrl || req.url },
  method: req => req.method,
  status: (req, res) => { res.statusCode },
  ip: (req) => {
    return req.ip ||
      req._remoteAddress ||
      (req.connection && req.connection.remoteAddress) ||
      undefined
  },
  res_size: (req, res) => res['content-length'],
  http_version: (req) => { req.httpVersionMajor + '.' + req.httpVersionMinor },
  user_agent: req => req.headers['user-agent'],
  res_size: (req, res) => { return res.getHeader('content-length') },


}

const httpLogger = (req, res, next) => {
  req._portway = {} // Setup namespace
}

export default httpLogger