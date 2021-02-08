import io from 'socket.io'

const { CLIENT_URL } = process.env

let loadedIO

export function loadIO(server) {
  loadedIO = io(server, {
    cors: {
      origin: CLIENT_URL,
      methods: ['GET', 'POST']
    }
  })
  return loadedIO
}

export function getIO() {
  return loadedIO
}
