import axios from 'axios'
import { getCookieValue } from '../utilities/cookieParser'

const token = getCookieValue('token')

// Express renders the app html page and sets API_PUBLIC_URL in order to keep
// this webpack bundle API-location agnostic. To set the API url, the node.js
// express server needs process.env.API_PUBLIC_URL set
// eslint-disable-next-line no-undef
const baseURL = (new URL('api', API_PUBLIC_URL)).href
const globalErrorCodes = [403, 404, 408, 500, 503]
const validationCodes = [400, 402, 409, 413, 415]

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 0,
  headers: {
    Authorization: `Bearer ${token}`
  }
})

async function fetch(resource) {
  try {
    const { data: { data, page, perPage, total, totalPages }, status } = await axiosInstance.get(resource)
    return { data, status, page, perPage, total, totalPages }
  } catch (error) {
    const { data, status } = error.response || { status: 408, data: {} }
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

export { fetch, add, update, remove, globalErrorCodes, validationCodes, baseURL }
