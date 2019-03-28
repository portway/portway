import jwt from 'jsonwebtoken'
import tokenSettings from '../libs/tokenSettings'

const generateToken = (userId, orgId) => {
  return jwt.sign(
    {
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

const generatePasswordResetToken = (id, resetKey) => {
  return jwt.sign(
    {
      id,
      resetKey
    },
    tokenSettings.passwordResetTokenSecret,
    {
      expiresIn: tokenSettings.passwordResetExpiration,
      issuer: tokenSettings.issuer
    }
  )
}

export default {
  generateToken,
  generatePasswordResetToken
}
