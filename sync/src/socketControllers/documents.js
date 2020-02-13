import redis from '../libs/redis'

export default (io) => {
  const documentsIO = io.of('/documents')

  documentsIO.on('connection', (socket) => {
    console.log(socket)
    const userId = socket.handshake.query.userId
    // For each socket connection (single tab in browser), user can only be connected to one doc room
    // Cache that here so we can remove them on disconnect
    let currentDocRoom

    socket.on('joinRoom', async (documentId) => {
      socket.join(documentId)
      // add user to document room Set
      const docRoomNs = `docRoom:${documentId}`
      await redis.sadd(docRoomNs, userId)
      // add room to user rooms Set
      const userRoomsNs = getUserRoomsNs(userId)
      await redis.sadd(userRoomsNs, documentId)
      // set the cached current doc room
      currentDocRoom = documentId
      // send user change message to all room users, including current user
      const currentRoomUsers = await redis.smembers(docRoomNs)
      documentsIO.in(documentId).emit('userChange', currentRoomUsers)
    })

    socket.on('leaveRoom', async (documentId) => {
      socket.leave(documentId)
      // remove user from document room Set
      const docRoomNs = getDocRoomNs(documentId)
      await redis.srem(docRoomNs, userId)
      // remove room from user rooms Set
      const userRoomsNs = getUserRoomsNs(userId)
      await redis.srem(userRoomsNs, documentId)
      // clear the cached current doc room
      currentDocRoom = documentId
      // send user change message to all room users, including current user
      const currentRoomUsers = await redis.smembers(docRoomNs)
      documentsIO.in(documentId).emit('userChange', currentRoomUsers)
    })

    socket.on('disconnect', async (data) => {
      console.log(data)
      console.log(`${userId} disconnected`)
      const userRoomsNs = getUserRoomsNs(userId)
      const userRooms = await redis.smembers(userRoomsNs)
      // remove user from all document rooms
      await Promise.all(userRooms.map((documentId) => {
        
        const docRoomNs = getDocRoomNs(documentId)
        return redis.srem(docRoomNs)
      }))
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