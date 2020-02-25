import jwt from 'jsonwebtoken'
import logger from '../libs/logger'
import { LOG_LEVELS } from '../constants'

const secret = process.env.JWT_SECRET

export const jwtMiddleware = (socket, next) => {
  const token = socket.handshake.query && socket.handshake.query.token

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      logger(LOG_LEVELS.WARNING, 'Invalid token')
      return next(err)
    }
    next(null)
  })
}

export const extractJwtPayloadWithoutVerification = (token) => {
  const decoded = jwt.decode(token)
  return decoded
}
