import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import ono from 'ono'
import tokenSettings from '../tokenSettings'
import UserCoordinator from '../../coordinators/user'

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: tokenSettings.passwordResetTokenSecret,
  issuer: tokenSettings.issuer
}

export default function(passport) {
  passport.use(
    'jwt-password-reset',
    new JwtStrategy(options, async (payload, done) => {
      let user

      try {
        user = await UserCoordinator.validatePasswordResetKey(payload.id, payload.resetKey)
      } catch (err) {
        done(ono(err, `Invalid reset key}`))
      }

      return done(null, user)
    })
  )
}
