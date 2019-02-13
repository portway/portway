import passport from 'passport'
import JWTAuth from './passportJWT'
import localAuth from './passportLocal'

const init = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.email)
  })

  passport.deserializeUser((id, done) => {
    done(null, id)
  })

  JWTAuth(passport)
  localAuth(passport)
}

export default {
  jwtMiddleware: passport.authenticate('jwt', { session: false }),
  loginMiddleware: passport.authenticate('local', { session: false }),
  init
}
