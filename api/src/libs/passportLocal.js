import { Strategy as LocalStrategy } from 'passport-local'
import UserCoordinator from '../coordinators/user'

const options = {
  session: false,
  usernameField: 'email'
}

export default function(passport) {
  passport.use(
    new LocalStrategy(options, async(email, password, done) => {
      let user

      try {
        user = await UserCoordinator.validateEmailPasswordCombo(email, password)
      } catch (err) {
        done(new Error(`Invalid user/pass ${email}`))
      }

      console.info('logging in ' + email)
      return done(null, user)
    })
  )
}
