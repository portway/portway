import redis from '../libs/redis'

const USER_SOCKET_ROOM_CACHE_EXPIRATION = 30

export default (io) => {
  const documentsIO = io.of('/documents')

  const updateAndBroadcastRoomUsers = async (documentId) => {
    const currentRoomUsers = await getReconciledRoomUsers(documentId)
    const uniqueRoomUserIds = getUniqueRoomUserIds(currentRoomUsers)
    documentsIO.in(documentId).emit('userChange', uniqueRoomUserIds)
  }

  documentsIO.on('connection', (socket) => {
    const socketId = socket.id
    const userId = socket.handshake.query.userId
    const userSocketNs = `sync:user:${userId}:socket:${socketId}`
    const userSocketRoomNs = getUserSocketRoomNs(userSocketNs)

    socket.on('joinRoom', async (documentId) => {
      socket.join(documentId)
      // add user to document room Set
      const docRoomNs = getDocRoomNs(documentId)
      await redis.sadd(docRoomNs, userSocketNs)

      // cache current room and set expiration, need to refresh this whenever user does something
      await redis.set(userSocketRoomNs, documentId, 'EX', USER_SOCKET_ROOM_CACHE_EXPIRATION)

      // add room to user rooms Set, DO WE NEED TO DO THIS???
      // const userRoomsNs = getUserRoomsNs(userSocketNs)
      // await redis.sadd(userRoomsNs, documentId)


      // send user change message to all room users, including current user
      await updateAndBroadcastRoomUsers(documentId)
    })

    socket.on('leaveRoom', async (documentId) => {
      socket.leave(documentId)
      // remove user from document room Set
      const docRoomNs = getDocRoomNs(documentId)
      await redis.srem(docRoomNs, userSocketNs)

      // delete user/socket current room
      await redis.del(userSocketRoomNs)

      // remove room from user rooms Set, DO WE NEED TO DO THIS???
      // const userRoomsNs = getUserRoomsNs(userSocketNs)
      // await redis.srem(userRoomsNs, documentId)

      await updateAndBroadcastRoomUsers(documentId)
    })

    socket.on('disconnect', async (data) => {
      const documentId = await redis.get(userSocketRoomNs)
      console.log('on disconnect', documentId)

      if (!documentId) return

      // remove user from document room Set
      await redis.srem(getDocRoomNs(documentId), userSocketNs)
      // remove user/socket cached current room
      await redis.del(userSocketRoomNs)
      // broadcast to all users in current room
      await updateAndBroadcastRoomUsers(documentId)
    })
  })
}

const getDocRoomNs = (documentId) => {
  return `sync:docRoom:${documentId}`
}

// const getUserRoomsNs = (userSocketNs) => {
//   return `sync:userDocRooms:${userSocketNs}`
// }

const getUserSocketRoomNs = (userSocketNs) => {
  return `${userSocketNs}:currentRoom`
}

const getReconciledRoomUsers = async (documentId) => {
  const docRoomNs = getDocRoomNs(documentId)
  const roomUserSockets = await redis.smembers(docRoomNs)
  await Promise.all(roomUserSockets.map(async (userSocketNs) => {
    const currentUserSocketRoom = await redis.get(getUserSocketRoomNs(userSocketNs))
    console.log(userSocketNs)
    console.log('current user socket room', currentUserSocketRoom)
    console.log(currentUserSocketRoom)
    console.log('room document id', documentId)
    console.log(documentId)
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
