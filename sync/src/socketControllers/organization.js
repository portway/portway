import redis from '../libs/redis'
import { extractJwtPayloadWithoutVerification } from '../libs/ioAuth'
import logger from '../libs/logger'
import { LOG_LEVELS } from '../constants'

const USER_SOCKET_ROOM_CACHE_EXPIRATION = 60 * 60// 1 hour
const USER_SOCKET_FOCUSED_FIELD_EXPIRATION = 60 * 5// 5 minutes

export default (io) => {
  const organizationIO = io.of('/organization')

  organizationIO.on('connection', (socket) => {
    // Payload is already verified against the secret in middleware auth step for all routes
    // just get the decodable info from the jwt
    const { orgId, userId } = extractJwtPayloadWithoutVerification(socket.handshake.query.token)

    joinRoom(orgId)
    // Document Room
    socket.on('documentCreated', async (projectId) => {
      await socket.emit('documentCreated', projectId)
    })
  })
}
