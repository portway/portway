import axios from 'axios'

const API_URL = process.env.API_URL

const fetchProjectDocuments = async function(projectId) {
  const documents = await fetch(path.resolve(API_URL, `projects/${projectId}/documents?draft=true`))
  return documents
}

const fetchFullDocument = async function(documentId) {
  const document = await fetch(path.resolve(API_URL), `documents/${documentId}?draft=true`)
  return document
}

const fetch = async function(url) {
  let data
  try {
    data = (await axios.get(url)).data
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
