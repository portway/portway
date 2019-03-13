import { Strategy as LocalStrategy } from 'passport-local'
import UserCoordinator from '../coordinators/user'
import ono from 'ono'

const options = {
  session: false,
  usernameField: 'email'
}

export default function(passport) {
  passport.use(
    new LocalStrategy(options, async (email, password, done) => {
      let user

      try {
        user = await UserCoordinator.validateEmailPasswordCombo(
          email,
          password
        )
      } catch (err) {
        done(ono(err, `Invalid user/pass ${email}`))
      }

      console.info('logging in ' + email)
      return done(null, user)
    })
  )
}
