import redis from '../libs/redis'
import { extractJwtPayloadWithoutVerification } from '../libs/ioAuth'
import logger from '../libs/logger'
import { LOG_LEVELS } from '../constants'

const USER_SOCKET_ROOM_CACHE_EXPIRATION = 60 * 60// 1 hour
const USER_SOCKET_FOCUSED_FIELD_EXPIRATION = 60 * 5// 5 minutes

export default (io) => {
  const documentsIO = io.of('/documents')

  documentsIO.on('connection', (socket) => {
    const updateAndBroadcastRoomUsers = async (documentId, orgId) => {
      const currentRoomUsers = await getReconciledRoomUsers(documentId, orgId)
      const uniqueRoomUserIds = getUniqueRoomUserIds(currentRoomUsers)
      documentsIO.in(documentId).emit('documentRoomUsersUpdated', uniqueRoomUserIds)
    }

    const updateAndBroadcastFieldFocus = async (documentId, userSocketNs, userId, fieldId) => {
      // set the currently focused field for the user
      const userSocketFieldNs = getFocusedFieldNs(userSocketNs)
      await redis.set(userSocketFieldNs, fieldId, 'EX', USER_SOCKET_FOCUSED_FIELD_EXPIRATION)
      // broadcast it to the everyone else in the room
      socket.to(documentId).emit('userFocusChange', userId, fieldId)
    }
    // Payload is already verified against the secret in middleware auth step for all routes
    // just get the decodable info from the jwt
    const { orgId, userId } = extractJwtPayloadWithoutVerification(socket.handshake.query.token)

    const socketId = socket.id
    const userSocketNs = `sync:org:${orgId}:user:${userId}:socket:${socketId}`
    const userSocketRoomNs = getUserSocketRoomNs(userSocketNs)

    const leaveRoom = async (documentId) => {
      if (typeof documentId !== 'string') return

      socket.leave(documentId)
      // remove user from document room Set
      const docRoomNs = getDocRoomNs(documentId, orgId)
      await redis.srem(docRoomNs, userSocketNs)

      // delete user/socket current room
      await redis.del(userSocketRoomNs)
      // remove user's focused field
      await redis.del(getFocusedFieldNs(userSocketNs))

      await updateAndBroadcastRoomUsers(documentId, orgId)
    }

    const joinRoom = async (documentId) => {
      if (typeof documentId !== 'string') {
        logger(LOG_LEVELS.WARNING, `joinRoom for document id ${documentId} expects a string, received ${typeof documentId}`)
        return
      }

      const currentDocumentRoomId = await redis.get(userSocketRoomNs)
      if (currentDocumentRoomId === documentId) return

      // automatically leave current room if there is one, only one room at a time
      if (currentDocumentRoomId) {
        await leaveRoom(currentDocumentRoomId)
      }

      socket.join(`docRoom:${documentId}`)
      // add user to document room Set
      const docRoomNs = getDocRoomNs(documentId, orgId)
      await redis.sadd(docRoomNs, userSocketNs)

      // cache current room and set expiration
      await redis.set(userSocketRoomNs, documentId, 'EX', USER_SOCKET_ROOM_CACHE_EXPIRATION)

      // send user change message to all room users, including current user
      await updateAndBroadcastRoomUsers(documentId, orgId)
    }
    // Document Room
    socket.on('joinRoom', joinRoom)

    socket.on('leaveRoom', leaveRoom)

    socket.on('disconnect', async () => {
      const documentId = await redis.get(userSocketRoomNs)

      if (!documentId) return

      // remove user from document room Set
      await redis.srem(getDocRoomNs(documentId, orgId), userSocketNs)
      // remove user/socket cached current room
      await redis.del(userSocketRoomNs)
      // remove user's focused field
      await redis.del(getFocusedFieldNs(userSocketNs))
      // broadcast to all users in current room
      await updateAndBroadcastRoomUsers(documentId, orgId)
    })

    // Fields
    socket.on('fieldFocus', async (fieldId, documentId) => {
      // set the user's current room to the one with target field
      await joinRoom(documentId)

      // update and broadcast the update to everyone in the room
      await updateAndBroadcastFieldFocus(documentId, userSocketNs, userId, fieldId)
      // refresh the document room expiration, give them more time before deleting
      await redis.expire(userSocketRoomNs, USER_SOCKET_ROOM_CACHE_EXPIRATION)
    })

    socket.on('fieldChange', async (fieldId, documentId) => {
      // set the user's current room to the one with target field
      await joinRoom(documentId)
      // make sure user is currently in a document room
      if (!documentId) return
      // broadcast the update to everyone else in the room
      await socket.to(documentId).emit('userFieldChange', userId, fieldId)
      // refresh the document room expiration, give them more time before deleting
      await redis.expire(userSocketRoomNs, USER_SOCKET_ROOM_CACHE_EXPIRATION)
    })
  })
}

const getDocRoomNs = (documentId, orgId) => {
  return `sync:org:${orgId}:docRoom:${documentId}`
}

const getUserSocketRoomNs = (userSocketNs) => {
  return `${userSocketNs}:currentRoom`
}

const getFocusedFieldNs = (userSocketNs) => {
  return `${userSocketNs}:focusedField`
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
