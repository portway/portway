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
  loginMiddleware: passport.authenticate('local', { session: false, failureRedirect: '/sign-in?message=login' }),
  jwtMiddleware: (req, res, next) => {
    passport.authenticate('jwt', (err, user, info) => {
      if (err) {
        return next(err)
      }
      if (!user) {
        return res.redirect(`/sign-in?url=${encodeURIComponent(req.path)}`)
      } else {
        req._portway.loggedIn = true
      }
      // We're not actually logging in the user with passport, just validating the token is good
      return next()
    })(req, res, next)
  },
  // This auth only validates if there's a token present, for cases where
  // the user is already logged in but on a non-auth required route
  jwtOptionalUser: (req, res, next) => {
    passport.authenticate('jwt', (err, user, info) => {
      if (err) {
        return next(err)
      }
      if (user) {
        req._portway.loggedIn = true
      }
      return next()
    })(req, res, next)
  }
}