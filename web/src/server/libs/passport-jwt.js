import { Strategy as JwtStrategy } from 'passport-jwt'

const extractTokenFromCookie = (req) => {
  if (req && req.cookies) {
    return req.cookies.token
  }
  return null
}

const options = {
  jwtFromRequest: extractTokenFromCookie,
  secretOrKey: process.env.JWT_SECRET,
  issuer: 'bonkeybong'
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