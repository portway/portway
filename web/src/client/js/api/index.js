import axios from 'axios'
import { getCookieValue } from '../utilities/cookieParser'

const token = getCookieValue('token')
const baseURL = new URL('api/', VAR_API_URL)

const axiosInstance = axios.create({
  baseURL: baseURL.toString(),
  timeout: 5000,
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

async function fetch(resource) {
  const res = await axiosInstance.get(resource)
  return res.data
}

export {
  fetch
}