/**
 * Module dependencies.
 */
import passport from 'passport-strategy'
import util from 'util'
import { ExtractJwt } from 'passport-jwt'

// Re-use the wheel, use passport-jwt's token header extractor
const getTokenFromReq = ExtractJwt.fromAuthHeaderAsBearerToken()

/**
 * `Strategy` constructor. Needs to be a named export
 */
export function Strategy(options, verify) {
  if (typeof options === 'function') {
    verify = options
    options = {}
  }

  if (!verify) {
    throw new TypeError('Danger authentication strategy requires a verify function')
  }

  passport.Strategy.call(this)
  this.name = 'dangerProjectToken'
  this._verify = verify
}

/**
 * Inherit from `passport.Strategy`.
 */
util.inherits(Strategy, passport.Strategy)

Strategy.prototype.authenticate = function(req, options) {
  options = options || {}
  const self = this

  const token = getTokenFromReq(req)

  if (!token) {
    return self.pass()
  }

  function verified(err, user, info) {
    if (err) {
      return self.error(err)
    }
    if (!user) {
      return self.fail(info)
    }
    self.success(user, info)
  }

  try {
    this._verify(token, verified)
  } catch (ex) {
    return self.error(ex)
  }
}

/**
 * Expose `Strategy` as default export too, because passport
 */
export default Strategy
