import redis from '../libs/redis'

export default (io) => {
  const documentsIO = io.of('/documents')

  documentsIO.on('connection', (socket) => {
    socket.on('joinRoom', async (documentId, userId) => {
      socket.join(documentId)
      // add user to document room Set
      const docRoomNs = `docRoom:${documentId}`
      await redis.sadd(docRoomNs, userId)
      const currentRoomUsers = await redis.smembers(docRoomNs)
      // send user change message to all room users, including current user
      documentsIO.in(documentId).emit('userChange', currentRoomUsers)
    })

    socket.on('leaveRoom', async (documentId, userId) => {
      socket.leave(documentId)
      // remove user from document room Set
      const docRoomNs = getDocRoomNs(documentId)
      await redis.srem(docRoomNs, userId)
      const currentRoomUsers = await redis.smembers(docRoomNs)
      // send user change message to all room users, including current user
      documentsIO.in(documentId).emit('userChange', currentRoomUsers)
    })
  })
}

const getDocRoomNs = (documentId) => {
  return `docRoom:${documentId}`
}