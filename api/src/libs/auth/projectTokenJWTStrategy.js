/**
 * Module dependencies.
 */
import passport from 'passport-strategy'
import util from 'util'
import { ExtractJwt } from 'passport-jwt'

// Why re-invent the wheel holmes?
const getTokenFromReq = ExtractJwt.fromAuthHeaderAsBearerToken()

/**
 * `Strategy` constructor.
 *
 * The token authentication strategy authenticates requests based on the
 * credentials submitted through standard request headers or body.
 *
 * Applications must supply a `verify` callback which accepts
 * unique `token` credentials, and then calls the `done` callback supplying a
 * `user`, which should be set to `false` if the credentials are not valid.
 * If an exception occured, `err` should be set.
 *
 * Optionally, `options` can be used to change the fields in which the
 * credentials are found.
 *
 * Options:
 *
 *   - `tokenField`  field name where the token is found, defaults to 'token'
 *   - `tokenQuery`  query string name where the token is found, defaults to 'token'
 *   - `tokenParams`  params name where the token is found, defaults to 'token'
 *   - `tokenHeader`  header name where the token is found, defaults to 'token'
 *   - `passReqToCallback`  when `true`, `req` is the first argument to the verify callback (default: `false`)
 *
 * Examples:
 *
 *     passport.use(new UniqueTokenStrategy(
 *       function(token, done) {
 *         User.findOne({ token: token }, function (err, user) {
 *           done(err, user);
 *         });
 *       }
 *     ));
 *
 * @param {Object} options
 * @param {Function} verify
 * @api public
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

/**
 * Authenticate request based on the contents of a form submission.
 *
 * @param {Object} req
 * @param {Object} options
 * @api protected
 */
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
 * Expose `Strategy`.
 */
export default Strategy
