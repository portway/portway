import jwt from 'jsonwebtoken'
import tokenSettings from '../libs/tokenSettings'

const generateToken = (email, userId, orgId) => {
  return jwt.sign(
    {
      email,
      userId,
      orgId
    },
    tokenSettings.tokenSecret,
    {
      expiresIn: tokenSettings.expiration,
      issuer: tokenSettings.issuer
    }
  )
}

export default {
  generateToken
}
