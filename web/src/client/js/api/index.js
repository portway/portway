import axios from 'axios'
import { getCookieValue } from '../utilities/cookieParser'

const token = getCookieValue('token')

// Webpack's DefinePlugin sets VAR_API_URL during build from
// process.env.API_PUBLIC_URL
// eslint-disable-next-line no-undef
const baseURL = new URL('api/', VAR_API_URL)
const globalErrorCodes = [403, 404, 409, 500]

const axiosInstance = axios.create({
  baseURL: baseURL.toString(),
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${token}`
  }
})

async function fetch(resource) {
  try {
    const { data } = await axiosInstance.get(resource)
    return data
  } catch (error) {
    return error.response
  }
}

async function add(resource, body) {
  const { data } = await axiosInstance.post(resource, body)
  return data
}

async function update(resource, body) {
  const { data } = await axiosInstance.put(resource, body)
  return data
}

async function remove(resource) {
  const { data } = await axiosInstance.delete(resource)
  return data
}

export { fetch, add, update, remove, globalErrorCodes }
