import axios from 'axios'
import { getCookieValue } from '../utilities/cookieParser'

const token = getCookieValue('token')

// Webpack's DefinePlugin sets VAR_API_URL during build from
// process.env.API_PUBLIC_URL
// eslint-disable-next-line no-undef
const baseURL = new URL('api/', VAR_API_URL)
const globalErrorCodes = [403, 404, 408, 413, 422, 500]
const validationCodes = [400, 409, 402]

const axiosInstance = axios.create({
  baseURL: baseURL.toString(),
  timeout: 0,
  headers: {
    Authorization: `Bearer ${token}`
  }
})

async function fetch(resource) {
  try {
    const { data: { data }, status } = await axiosInstance.get(resource)
    return { data, status }
  } catch (error) {
    const { data, status } = error.response || { status: 408 , data: {} }
    return { data, status }
  }
}

async function add(resource, body) {
  try {
    const { data: { data }, status } = await axiosInstance.post(resource, body)
    return { data, status }
  } catch (error) {
    const { data, status } = error.response || { status: 408, data: {} }
    return { data, status }
  }
}

async function update(resource, body) {
  try {
    const { data: { data }, status } = await axiosInstance.put(resource, body)
    return { data, status }
  } catch (error) {
    const { data, status } = error.response || { status: 408, data: {} }
    return { data, status }
  }
}

async function remove(resource) {
  try {
    // All of our actions expect an object to be returned, however delete()
    // doesn't return anything. We return an empty object here to prevent
    // errors on trying to access data or status
    await axiosInstance.delete(resource)
    return {} // keep this here ^
  } catch (error) {
    const { data, status } = error.response || { status: 408, data: {} }
    return { data, status }
  }
}

export { fetch, add, update, remove, globalErrorCodes, validationCodes }
