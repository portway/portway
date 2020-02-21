import redis from '../libs/redis'
import { extractJwtPayloadWithoutVerification } from '../libs/ioAuth'

// 5 Minutees in seconds, 5 * 60 = 300
const USER_SOCKET_ROOM_CACHE_EXPIRATION = 300

export default (io) => {
  const documentsIO = io.of('/documents')

  const updateAndBroadcastRoomUsers = async (documentId, orgId) => {
    const currentRoomUsers = await getReconciledRoomUsers(documentId, orgId)
    const uniqueRoomUserIds = getUniqueRoomUserIds(currentRoomUsers)
    documentsIO.in(documentId).emit('userChange', uniqueRoomUserIds)
  }

  documentsIO.on('connection', (socket) => {
    // Payload is already verified against the secret in middleware auth step for all routes
    // just get the decodable info from the jwt
    const { orgId, userId } = extractJwtPayloadWithoutVerification(socket.handshake.query.token)

    const socketId = socket.id
    const userSocketNs = `sync:org:${orgId}:user:${userId}:socket:${socketId}`
    const userSocketRoomNs = getUserSocketRoomNs(userSocketNs)

    socket.on('joinRoom', async (documentId) => {
      if (typeof documentId !== 'string') return

      socket.join(documentId)
      // add user to document room Set
      const docRoomNs = getDocRoomNs(documentId, orgId)
      await redis.sadd(docRoomNs, userSocketNs)

      // cache current room and set expiration
      // TODO: refresh this whenever user does something (changes a field, highlights a field etc.)
      await redis.set(userSocketRoomNs, documentId, 'EX', USER_SOCKET_ROOM_CACHE_EXPIRATION)

      // send user change message to all room users, including current user
      await updateAndBroadcastRoomUsers(documentId, orgId)
    })

    socket.on('leaveRoom', async (documentId) => {
      if (typeof documentId !== 'string') return

      socket.leave(documentId)
      // remove user from document room Set
      const docRoomNs = getDocRoomNs(documentId, orgId)
      await redis.srem(docRoomNs, userSocketNs)

      // delete user/socket current room
      await redis.del(userSocketRoomNs)

      await updateAndBroadcastRoomUsers(documentId, orgId)
    })

    socket.on('disconnect', async (data) => {
      const documentId = await redis.get(userSocketRoomNs)

      if (!documentId) return

      // remove user from document room Set
      await redis.srem(getDocRoomNs(documentId, orgId), userSocketNs)
      // remove user/socket cached current room
      await redis.del(userSocketRoomNs)
      // broadcast to all users in current room
      await updateAndBroadcastRoomUsers(documentId, orgId)
    })
  })
}

const getDocRoomNs = (documentId, orgId) => {
  return `sync:org:${orgId}:docRoom:${documentId}`
}

const getUserSocketRoomNs = (userSocketNs) => {
  return `${userSocketNs}:currentRoom`
}

// NOTE: This will mutate redis data
// Goes through the listed user/sockets in the room Set and looks at each user/socket(key) to cached room value in redis
// if the cached value doesn't match, either because it's expired, they've disconnected and it doesn't exist,
// or because they've switched rooms. Then we remove it from the Set
const getReconciledRoomUsers = async (documentId, orgId) => {
  const docRoomNs = getDocRoomNs(documentId, orgId)
  const roomUserSockets = await redis.smembers(docRoomNs)
  await Promise.all(roomUserSockets.map(async (userSocketNs) => {
    const currentUserSocketRoom = await redis.get(getUserSocketRoomNs(userSocketNs))
    // this user/socket isn't currently in this room, remove from Set
    if (currentUserSocketRoom !== documentId) {
      await redis.srem(docRoomNs, userSocketNs)
    }
  }))
  return redis.smembers(docRoomNs)
}

const getUniqueRoomUserIds = (roomUsers) => {
  const userIds = roomUsers.map((userSocket) => {
    return userSocket.split(':')[4]
  })
  return [...new Set(userIds)]
}
