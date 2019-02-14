import { Strategy as LocalStrategy } from 'passport-local'

// TODO: remove and plugin with real users
const staticEmail = process.env.STATIC_EMAIL
const staticPassword = process.env.STATIC_PASSWORD

const options = {
  session: false,
  usernameField: 'email'
}

export default function(passport) {
  passport.use(
    new LocalStrategy(options, (email, password, done) => {
      if (email === staticEmail && password === staticPassword) {
        console.info('logging in ' + email)
        const user = {
          email
        }
        return done(null, user)
      } else {
        return done(new Error(`Invalid user/pass ${email}`))
      }
    })
  )
}
