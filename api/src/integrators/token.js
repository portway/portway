import jwt from 'jsonwebtoken'
import tokenSettings from '../libs/tokenSettings'

// TODO: make these asynchronous

const generateToken = (userId, orgRoleId, orgId) => {
  return jwt.sign(
    {
      userId,
      oRId: orgRoleId,
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

const generateAccountInviteToken = (id, resetKey) => {
  return jwt.sign(
    {
      id,
      resetKey
    },
    tokenSettings.passwordResetTokenSecret,
    {
      expiresIn: tokenSettings.accountInviteExpiration,
      issuer: tokenSettings.issuer
    }
  )
}

const generateProjectToken = (id, secret, orgId) => {
  return jwt.sign(
    {
      id,
      orgId
    },
    secret,
    {
      issuer: tokenSettings.issuer
    }
  )
}

export default {
  generateToken,
  generatePasswordResetToken,
  generateAccountInviteToken,
  generateProjectToken
}
