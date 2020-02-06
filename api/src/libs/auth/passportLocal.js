import { Strategy as LocalStrategy } from 'passport-local'
import UserCoordinator from '../../coordinators/user'
import ono from 'ono'
import logger from '../../integrators/logger'
import { LOG_LEVELS } from '../../constants/logging'

const options = {
  session: false,
  usernameField: 'email'
}

export default function(passport) {
  passport.use(
    new LocalStrategy(options, async (email, password, done) => {
      let user

      try {
        user = await UserCoordinator.validateEmailPasswordCombo(email, password)
      } catch (err) {
        return done(ono({ code: 401, logLevel: LOG_LEVELS.INFO }, `Invalid user/pass ${email}`))
      }

      logger(LOG_LEVELS.INFO, 'logging in ' + email)

      return done(null, user)
    })
  )
}
