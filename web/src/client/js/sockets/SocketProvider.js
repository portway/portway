import openSocket from 'socket.io-client'
import { getCookieValue } from '../utilities/cookieParser'

const RECONNECTION_ATTEMPTS = 100
const RECONNECTION_DELAY = 1000
const RECONNECTION_DELAY_MAX = 1200000 // 20 minutes

const token = getCookieValue('token')
// sync url is defined by the index.ejs template
// eslint-disable-next-line no-undef
const documentUrl = new URL(`/documents?token=${token}`, SYNC_URL)
const organizationUrl = new URL(`/organizations?token=${token}`, SYNC_URL)

// socket-io will exponentially backoff connection attempts with
// a randomization factor and the reconnectionDelay, up to reconnectionDelayMax
export const documentSocket = openSocket(documentUrl.href, {
  reconnectionAttempts: RECONNECTION_ATTEMPTS,
  reconnectionDelay: RECONNECTION_DELAY,
  reconnectionDelayMax: RECONNECTION_DELAY_MAX
})

export const organizationSocket = openSocket(organizationUrl.href, {
  reconnectionAttempts: RECONNECTION_ATTEMPTS,
  reconnectionDelay: RECONNECTION_DELAY,
  reconnectionDelayMax: RECONNECTION_DELAY_MAX
})

documentSocket.on('connect', () => {
  console.info('Connected to document socket')
})

organizationSocket.on('connect', () => {
  console.info('Connected to organization socket')
})
