import Constants from 'Shared/constants'
import { Documents } from './index'
import { add, fetch, update, remove } from '../api'

export const fetchDocuments = (projectId) => {
  return async (dispatch) => {
    dispatch(Documents.requestList(projectId))
    const { data } = await fetch(`projects/${projectId}/documents`)
    dispatch(Documents.receiveList(projectId, data))
  }
}

export const fetchDocument = (projectId, documentId) => {
  return async (dispatch) => {
    dispatch(Documents.requestOne(projectId, documentId))
    const { data } = await fetch(`projects/${projectId}/documents/${documentId}`)
    dispatch(Documents.receiveOne(data))
  }
}

export const createDocument = (projectId, history, body) => {
  return async (dispatch) => {
    dispatch(Documents.create(projectId, body))
    const { data } = await add(`projects/${projectId}/documents`, body)
    dispatch(Documents.receiveOneCreated(data))
    history.push({ pathname: `${Constants.PATH_PROJECT}/${projectId}/document/${data.id}` })
  }
}

export const updateDocument = (projectId, documentId, body) => {
  return async (dispatch) => {
    dispatch(Documents.update(projectId, documentId, body))
    const data = await update(`projects/${projectId}/documents/${documentId}`, body)
    dispatch(Documents.receiveOneUpdated(data))
  }
}

export const deleteDocument = (projectId, documentId, history) => {
  return async (dispatch) => {
    dispatch(Documents.delete(projectId, documentId))
    const data = await remove(`projects/${projectId}/documents/${documentId}`, {
      projectId: projectId,
      id: documentId
    })
    dispatch(Documents.deleted(projectId, documentId, data))
    history.push({ pathname: `${Constants.PATH_PROJECT}/${projectId}` })
  }
}
