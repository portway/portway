import axios from 'axios'
import url from 'url'

const API_URL = process.env.API_URL
const baseURL = (new url.URL('api/v1', API_URL)).href
const ADMIN_SECRET_KEY = process.env.ADMIN_SECRET_KEY

const fetchProject = async function(projectId, token) {
  const project = await fetch(`projects/${projectId}`, token)
  return project
}

const fetchProjectDocuments = async function(projectId, token) {
  const documents = await fetch(`projects/${projectId}/documents?draft=true`, token)
  return documents
}

const fetchFullDocument = async function(documentId, token) {
  const document = await fetch(`documents/${documentId}?draft=true`, token)
  return document
}

const fetch = async function(url, token) {
  let data
  try {
    data = (await axios.get(url, {
      baseURL,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })).data
  } catch (err) {
    const customError = new Error()
    if (err.response) {
      // non-2xx response condition
      customError.message = err.response.data
      customError.statusCode = err.response.status
    } else if (err.request) {
      // no response
      customError.message = 'no response received from api'
      customError.statusCode = 504
    } else {
      // configuration error
      customError.message = err.message
      customError.statusCode = 500
    }
    throw customError
  }

  return data
}

const updateFieldFormats = async function(documentId, fieldId, orgId, formats) {
  let data
  const url = (new URL(`admin/organizations/${orgId}/documents/${documentId}/fields/${fieldId}/formats`, API_URL)).href
  try {
    data = (await axios.put(url,
      formats,
      {
        headers: {
          Authorization: `Admin ${ADMIN_SECRET_KEY}`
      }
    })).data
  } catch (err) {
    const customError = new Error()
    if (err.response) {
      // non-2xx response condition
      customError.message = err.response.data
      customError.statusCode = err.response.status
    } else if (err.request) {
      // no response
      customError.message = 'no response received from api'
      customError.statusCode = 504
    } else {
      // configuration error
      customError.message = err.message
      customError.statusCode = 500
    }
    throw customError
  }

  return data
}

export default {
  fetchProject,
  fetchProjectDocuments,
  fetchFullDocument,
  updateFieldFormats
}
