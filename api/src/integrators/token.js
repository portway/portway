import jwt from 'jsonwebtoken'
import tokenSettings from '../libs/tokenSettings'

const generateToken = (email) => {
  return jwt.sign(
    {
      email
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
