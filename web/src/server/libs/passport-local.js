import LocalStrategy from 'passport-local'
import DangerAPI from './api'

const API = new DangerAPI(process.env.API_URL)

const authUserFunc = async function(email, password, done) {
  let token
  try {
    token = await API.authenticate(email, password)
  } catch (error) {
    console.info(error.toString())
  }
  if (token) {
    done(null, { email, token })
  } else {
    done(null, false)
  }
}

export default function(passport) {
  passport.use(new LocalStrategy(
    {
      usernameField: 'email',
      session: false
    },
    authUserFunc
  ))
}