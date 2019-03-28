import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import tokenSettings from './tokenSettings'

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: tokenSettings.tokenSecret,
  issuer: tokenSettings.issuer
}

export default function(passport) {
  passport.use(
    new JwtStrategy(options, (payload, done) => {
      if (payload.userId) {
        done(null, { id: payload.userId, orgId: payload.orgId })
      } else {
        done(null, false)
      }
    })
  )
}
