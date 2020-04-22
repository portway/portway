import openSocket from 'socket.io-client'
import { getCookieValue } from '../utilities/cookieParser'

const token = getCookieValue('token')
// sync url is defined by the index.ejs template
// eslint-disable-next-line no-undef
const documentUrl = new URL(`/documents?token=${token}`, SYNC_URL)

// socket-io will exponentially backoff connection attempts with
// a randomization factor and the reconnectionDelay, up to reconnectionDelayMax
const documentSocket = openSocket(documentUrl.href, {
  reconnectionAttempts: 100,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 1200000 // 20 minutes
})

documentSocket.on('connect', () => {
  console.info('Connected to sync service')
})

export default documentSocket
