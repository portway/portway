import { getCookieValue } from '../utilities/cookieParser'

const token = getCookieValue('token')

async function fetch(resource) {
  console.info(`Fetching ${resource} with token ${token}`)
}

export default {
  fetch
}