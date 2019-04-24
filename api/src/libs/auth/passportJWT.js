import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import tokenSettings from '../tokenSettings'
import RESOURCE_TYPES from '../../constants/resourceTypes'

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: tokenSettings.tokenSecret,
  issuer: tokenSettings.issuer
}

export default function(passport) {
  passport.use(
    new JwtStrategy(options, (payload, done) => {
      if (payload.userId) {
        const userData = {
          id: payload.userId,
          orgId: payload.orgId,
          orgRoleId: payload.oRId,
          type: RESOURCE_TYPES.USER
        }
        done(null, userData)
      } else {
        done(null, false)
      }
    })
  )
}
