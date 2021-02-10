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
    const { orgId } = extractJwtPayloadWithoutVerification(socket.handshake.query.token)

    const orgRoomNs = `orgRoom:${orgId}`

    socket.join(orgRoomNs)

    socket.on('documentCreated', async (projectId) => {
      await socket.to(orgRoomNs).emit('orgDocumentCreated', projectId)
    })
  })
}
