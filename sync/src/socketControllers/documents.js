import io from '../libs/io'

const documentsIO = io.of('/documents')

documentsIO.on('connection', (socket) => {
  console.log('someone connected to the document namespace')
  socket.on('room', (fieldId, userId) => {
    const room = fieldId
    console.log(`${userId} connected to the ${room} room`)
    socket.join(room)
    socket.to(room).emit('activeUser', userId)
  })
  socket.to()
})
