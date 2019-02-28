
import passport from 'passport'
import localAuth from './passport-local'
import JWTAuth from './passport-jwt'

passport.serializeUser((user, done) => {
  done(null, user.email)
})

passport.deserializeUser((id, done) => {
  done(null, id)
})

localAuth(passport)
JWTAuth(passport)

export default {
  loginMiddleware: passport.authenticate('local', { session: false }),
  jwtMiddleware: passport.authenticate('jwt', { session: false })
}