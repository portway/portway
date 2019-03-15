import jwt from 'jsonwebtoken'
import tokenSettings from '../libs/tokenSettings'

const generateToken = (email, id) => {
  return jwt.sign(
    {
      email,
      id
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
