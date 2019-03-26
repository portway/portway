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
      if (payload.email) {
        done(null, { email: payload.email, id: payload.id, orgId: payload.orgId })
      } else {
        done(null, false)
      }
    })
  )
}
