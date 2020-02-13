import redis from '../libs/redis'

export default (io) => {
  const documentsIO = io.of('/documents')

  documentsIO.on('connection', (socket) => {
    const userId = socket.handshake.query.userId

    socket.on('joinRoom', async (documentId) => {
      socket.join(documentId)
      // add user to document room Set
      const docRoomNs = `docRoom:${documentId}`
      await redis.sadd(docRoomNs, userId)
      // add room to user rooms Set
      const userRoomsNs = getUserRoomsNs(userId)
      await redis.sadd(userRoomsNs, documentId)

      const currentRoomUsers = await redis.smembers(docRoomNs)
      // send user change message to all room users, including current user
      documentsIO.in(documentId).emit('userChange', currentRoomUsers)
    })

    socket.on('leaveRoom', async (documentId) => {
      socket.leave(documentId)
      // remove user from document room Set
      const docRoomNs = getDocRoomNs(documentId)
      await redis.srem(docRoomNs, userId)
      const currentRoomUsers = await redis.smembers(docRoomNs)
      // send user change message to all room users, including current user
      documentsIO.in(documentId).emit('userChange', currentRoomUsers)
    })

    socket.on('disconnect', async (data) => {
      console.log(`${userId} disconnected`)
      // send user change message to all room users, including current user
      // documentsIO.emit('someone left')
    })
  })
}

const getDocRoomNs = (documentId) => {
  return `docRoom:${documentId}`
}

const getUserRoomsNs = (userId) => {
  return `userDocRooms:${userId}`
}