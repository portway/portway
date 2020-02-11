/**
 * Dogfooding Portway
 *
 * Use public API to do Portway things
 */
import axios from 'axios'

// Exports

export const getProjectDocuments = async (id, key) => {
  const url = getProjectDocumentsUrl(id)
  const res = await sendAuthorizedRequest(url, key)
  return res.data
}

export const getDocumentWithFields = async (id, key) => {
  const url = getDocWithFieldsUrl(id)
  const res = await sendAuthorizedRequest(url, key)
  return res.data
}

// Helpers

const sendAuthorizedRequest = async (url, key, method = 'get') => {
  return axios({
    method,
    url,
    headers: {
      'Authorization': `Bearer ${key}`
    }
  })
}

const getProjectDocumentsUrl = (id) => {
  return `https://api.portway.app/api/v1/projects/${id}/documents`
}

const getDocWithFieldsUrl = (id) => {
  return `https://api.portway.app/api/v1/documents/${id}`
}