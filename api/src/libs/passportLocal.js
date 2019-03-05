import { Strategy as LocalStrategy } from 'passport-local'
import BusinessUser from '../businesstime/user'

const options = {
  session: false,
  usernameField: 'email'
}

export default function(passport) {
  passport.use(
    new LocalStrategy(options, async(email, password, done) => {
      const user = await BusinessUser.findByEmail(email)
      if (!user) {
        done(new Error(`Invalid user/pass ${email}`))
      }
      const validPassword = await BusinessUser.validatePassword(user, password)

      if (validPassword) {
        console.info('logging in ' + email)
        return done(null, user)
      } else {
        return done(new Error(`Invalid user/pass ${email}`))
      }
    })
  )
}
