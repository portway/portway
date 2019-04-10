import Constants from 'Shared/constants'
import { Documents } from './index'
import { add, fetch, update } from '../api'

export const fetchDocuments = (projectId) => {
  return async (dispatch) => {
    dispatch(Documents.requestList(projectId))
    const data = await fetch(`projects/${projectId}/documents`)
    dispatch(Documents.receiveList(projectId, data))
  }
}

export const fetchDocument = (projectId, documentId) => {
  return async (dispatch) => {
    dispatch(Documents.requestOne(projectId, documentId))
    const data = await fetch(`projects/${projectId}/documents/${documentId}`)
    dispatch(Documents.receiveOne(data))
  }
}

export const createDocument = (projectId, history, body) => {
  return async (dispatch) => {
    dispatch(Documents.create(projectId, body))
    const data = await add(`projects/${projectId}/documents`, body)
    dispatch(Documents.receiveOneCreated(data))
    history.push({ pathname: `${Constants.PATH_PROJECT}/${projectId}/document/${data.id}` })
  }
}

export const updateDocument = (documentId, projectId, body) => {
  return async (dispatch) => {
    dispatch(Documents.update(documentId))
    const data = await update(`projects/${projectId}/documents/${documentId}`, body)
    dispatch(Documents.receiveOneUpdated(data))
  }
}
