let localRoomState = {}

export default (io) => {
  const documentsIO = io.of('/documents')

  documentsIO.on('connection', (socket) => {
    socket.on('room', (documentId, userId) => {
      const room = documentId
      socket.join(room)
      const currentRoomUsers = localRoomState[room] ? { ...localRoomState[room] } : {}
      localRoomState = { ...localRoomState, [room]: { ...currentRoomUsers, [userId]: true } }
      const roomUsers = Object.keys(localRoomState[room])
      documentsIO.in(room).emit('userChange', roomUsers)
    })
  })
}