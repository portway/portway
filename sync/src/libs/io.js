import io from 'socket.io'

let loadedIO

export function loadIO(server) {
  loadedIO = io(server, {
    cors: {
      origin: '*'
    }
  })
  return loadedIO
}

export function getIO() {
  return loadedIO
}
