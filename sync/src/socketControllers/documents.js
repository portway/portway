import redis from '../libs/redis'

const USER_SOCKET_ROOM_CACHE_EXPIRATION = 300 // 5 Minutes
const USER_SOCKET_FOCUSED_FIELD_EXPIRATION = 300 // 5 Minutes

export default (io) => {
  const documentsIO = io.of('/documents')

  const updateAndBroadcastRoomUsers = async (documentId) => {
    const currentRoomUsers = await getReconciledRoomUsers(documentId)
    const uniqueRoomUserIds = getUniqueRoomUserIds(currentRoomUsers)
    documentsIO.in(documentId).emit('userChange', uniqueRoomUserIds)
  }

  const updateAndBroadcastFieldFocus = async (documentId, userSocketNs, userId, fieldId) => {
    // set the currently focused field for the user
    const userSocketFieldNs = getFocusedFieldNs(userSocketNs)
    await redis.set(userSocketFieldNs, fieldId, 'EX', USER_SOCKET_FOCUSED_FIELD_EXPIRATION)
    // broadcast it to the room
    documentsIO.in(documentId).emit('userFocusChange', userId, fieldId)
  }

  documentsIO.on('connection', (socket) => {
    const socketId = socket.id
    const userId = socket.handshake.query.userId
    const userSocketNs = getUserSocketNs(userId, socketId)
    const userSocketRoomNs = getUserSocketRoomNs(userSocketNs)

    // Document Room
    socket.on('joinRoom', async (documentId) => {
      if (typeof documentId !== 'string') return

      socket.join(documentId)
      // add user to document room Set
      const docRoomNs = getDocRoomNs(documentId)
      await redis.sadd(docRoomNs, userSocketNs)

      // cache current room and set expiration
      // TODO: refresh this whenever user does something (changes a field, highlights a field etc.)
      await redis.set(userSocketRoomNs, documentId, 'EX', USER_SOCKET_ROOM_CACHE_EXPIRATION)

      // send user change message to all room users, including current user
      await updateAndBroadcastRoomUsers(documentId)
    })

    socket.on('leaveRoom', async (documentId) => {
      if (typeof documentId !== 'string') return

      socket.leave(documentId)
      // remove user from document room Set
      await redis.srem(getDocRoomNs(documentId), userSocketNs)
      // remove user/socket cached current room
      await redis.del(userSocketRoomNs)
      // remove user's focused field
      await redis.del(getFocusedFieldNs(userSocketNs))

      await updateAndBroadcastRoomUsers(documentId)
    })

    socket.on('disconnect', async () => {
      const documentId = await redis.get(userSocketRoomNs)

      if (!documentId) return

      // remove user from document room Set
      await redis.srem(getDocRoomNs(documentId), userSocketNs)
      // remove user/socket cached current room
      await redis.del(userSocketRoomNs)
      // remove user's focused field
      await redis.del(getFocusedFieldNs(userSocketNs))
      // broadcast to all users in current room
      await updateAndBroadcastRoomUsers(documentId)
    })

    // Fields
    socket.on('fieldFocus', async (fieldId) => {
      const documentId = await redis.get(userSocketRoomNs)
      // make sure user is currently in a document room
      if (!documentId) return
      // update and broadcast the update to everyone in the room
      await updateAndBroadcastFieldFocus(documentId, userSocketNs, userId, fieldId)
      // refresh the document room expiration, give them more time before deleting
      await redis.expire(userSocketRoomNs, USER_SOCKET_ROOM_CACHE_EXPIRATION)
    })
  })
}

const getDocRoomNs = (documentId) => {
  return `sync:docRoom:${documentId}`
}

const getUserSocketNs = (userId, socketId) => {
  return `sync:user:${userId}:socket:${socketId}`
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
const getReconciledRoomUsers = async (documentId) => {
  const docRoomNs = getDocRoomNs(documentId)
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
    return userSocket.split(':')[2]
  })
  return [...new Set(userIds)]
}
