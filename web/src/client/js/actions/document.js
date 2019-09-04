import { FIELD_TYPES, PATH_PROJECT, NOTIFICATION_RESOURCE, NOTIFICATION_TYPES } from 'Shared/constants'
import { Documents, Validation, Notifications } from './index'
import { createField } from './field'
import { add, fetch, update, remove, globalErrorCodes, validationCodes } from '../api'

export const fetchDocuments = (projectId) => {
  return async (dispatch) => {
    dispatch(Documents.requestList(projectId))
    const { data, status } = await fetch(`projects/${projectId}/documents`)
    globalErrorCodes.includes(status) ?
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.DOCUMENTS, status)) :
      dispatch(Documents.receiveList(projectId, data))
  }
}

export const fetchDocument = (documentId) => {
  return async (dispatch) => {
    dispatch(Documents.requestOne(documentId))
    const { data, status } = await fetch(`documents/${documentId}?draft=true`)
    globalErrorCodes.includes(status) ?
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.DOCUMENT, status)) :
      dispatch(Documents.receiveOne(data))
  }
}

export const createDocument = (projectId, history, body, preventRedirect = false, withBody = null) => {
  return async (dispatch) => {
    dispatch(Documents.create(projectId, body))
    const { data, status } = await add(`projects/${projectId}/documents`, body)
    if (validationCodes.includes(status)) {
      dispatch(Validation.create('document', data, status))
      return
    }
    if (withBody) {
      await dispatch(createField(projectId, data.id, FIELD_TYPES.TEXT, {
        name: 'text-area-1',
        type: FIELD_TYPES.TEXT,
        value: withBody
      }))
    }
    dispatch(Documents.receiveOneCreated(data))
    if (!preventRedirect) {
      history.push({ pathname: `${PATH_PROJECT}/${projectId}/document/${data.id}` })
    }
  }
}

export const publishDocument = (documentId) => {
  return async (dispatch) => {
    dispatch(Documents.publish(documentId))
    const { data } = await add(`documents/${documentId}/publish`)
    dispatch(Documents.receivePublishedVersion(data))
  }
}

export const updateDocument = (projectId, documentId, body) => {
  return async (dispatch) => {
    dispatch(Documents.update(projectId, documentId, body))
    const { data, status } = await update(`projects/${projectId}/documents/${documentId}`, body)
    validationCodes.includes(status) ?
      dispatch(Validation.create('document', data, status)) :
      dispatch(Documents.receiveOneUpdated(data))
  }
}

export const deleteDocument = (projectId, documentId, history) => {
  return async (dispatch) => {
    dispatch(Documents.delete(projectId, documentId))
    const { data, status } = await remove(`projects/${projectId}/documents/${documentId}`, {
      projectId: projectId,
      id: documentId
    })
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.DOCUMENT, status))
      return
    }
    dispatch(Documents.deleted(projectId, documentId, data))
    history.push({ pathname: `${PATH_PROJECT}/${projectId}` })
  }
}
