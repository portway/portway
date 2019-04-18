
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

const passportResponse = {
  session: false,
  failureRedirect: '/sign-in?message=login'
}

export default {
  loginMiddleware: passport.authenticate('local', passportResponse),
  jwtMiddleware: passport.authenticate('jwt', passportResponse)
}
