
import passport from 'passport'
import LocalStrategy from 'passport-local'

import DangerAPI from './api'

const API = new DangerAPI(process.env.API_URL)

passport.serializeUser((user, done) => {
  done(null, user.email)
})

passport.deserializeUser((id, done) => {
  done(null, id)
})

const authUserFunc = async function(email, password, done) {
  console.info('authUserFunc')
  console.info(email, password)
  let token
  try {
    token = await API.authenticate(email, password)
  } catch (error) {
    console.info('error')
    console.info(error)
  }
  if (token) {
    done(null, { email, token })
  } else {
    done(null, false)
  }
}

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    session: false
  },
  authUserFunc
))

export default {
  loginMiddleware: passport.authenticate('local', { session: false })
}