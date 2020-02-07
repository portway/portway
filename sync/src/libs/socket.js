import io from 'socket.io'

let loadedIO

export function loadIO(server) {
  io(server)
}

export default loadedIO