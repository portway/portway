let localRoomState = {}

export default (io) => {
  const documentsIO = io.of('/documents')

  documentsIO.on('connection', (socket) => {
    socket.on('joinRoom', (documentId, userId) => {
      const room = documentId
      socket.join(room)
      const currentRoomUsers = localRoomState[room] ? { ...localRoomState[room] } : {}
      localRoomState = { ...localRoomState, [room]: { ...currentRoomUsers, [userId]: true } }
      const roomUsers = Object.keys(localRoomState[room])
      // send user change message to all room users, including current user
      documentsIO.in(room).emit('userChange', roomUsers)
    })

    socket.on('leaveRoom', (documentId, userId) => {
      const room = documentId
      socket.leave(room)
    })
  })
}