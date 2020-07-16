import axios from 'axios'
import url from 'url'

const API_URL = process.env.API_URL
const baseURL = (new url.URL('api/v1', API_URL)).href

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

module.exports = {
  fetchProjectDocuments,
  fetchFullDocument
}
