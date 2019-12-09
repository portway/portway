import { FIELD_TYPES, PATH_PROJECT, NOTIFICATION_RESOURCE, NOTIFICATION_TYPES } from 'Shared/constants'
import { Documents, Validation, Notifications } from './index'
import { createField } from './field'
import { add, fetch, update, remove, globalErrorCodes, validationCodes } from '../api'

export const fetchDocuments = (projectId) => {
  return async (dispatch) => {
    dispatch(Documents.requestList(projectId))
    const { data, status } = await fetch(`projects/${projectId}/documents?draft=true`)
    globalErrorCodes.includes(status) ?
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.DOCUMENTS, status)) :
      dispatch(Documents.receiveList(projectId, data))
  }
}

export const fetchDocument = (documentId) => {
  return async (dispatch) => {
    dispatch(Documents.requestOne(documentId))
    const { data, status } = await fetch(`documents/${documentId}?draft=true`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Documents.receiveError(documentId))
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.DOCUMENT, status))
      return
    }
    dispatch(Documents.receiveOne(data))
  }
}

export const searchDocuments = (projectId, searchValue) => {
  return async (dispatch) => {
    dispatch(Documents.initiateSearch(searchValue))
    const { data, status } = await fetch(`projects/${projectId}/documents?search=`, searchValue)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.DOCUMENTS, status))
      return
    }
    dispatch(Documents.receiveSearchResults(data))
  }
}

export const createDocument = (projectId, history, body, options = {}) => {
  const { preventRedirect, createFieldWithBody } = options

  return async (dispatch) => {
    dispatch(Documents.create(projectId, body))
    const { data, status } = await add(`projects/${projectId}/documents`, body)
    if (validationCodes.includes(status)) {
      dispatch(Validation.create('document', data, status))
      return
    }
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }
    const createFieldBody = {
      name: 'text-area-1',
      type: FIELD_TYPES.TEXT
    }
    if (typeof createFieldWithBody === 'string') {
      createFieldBody.value = createFieldWithBody
    }
    await dispatch(
      createField(projectId, data.id, FIELD_TYPES.TEXT, createFieldBody)
    )

    dispatch(Documents.receiveOneCreated(data))
    if (!preventRedirect) {
      history.push({ pathname: `${PATH_PROJECT}/${projectId}/document/${data.id}` })
    }
  }
}

export const publishDocument = (documentId) => {
  return async (dispatch) => {
    dispatch(Documents.publish(documentId))
    const { data, status } = await add(`documents/${documentId}/publish`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }
    dispatch(Documents.receivePublishedVersion(data))
  }
}

export const updateDocument = (projectId, documentId, body) => {
  return async (dispatch) => {
    dispatch(Documents.update(projectId, documentId, body))
    const { data, status } = await update(`projects/${projectId}/documents/${documentId}`, body)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }
    validationCodes.includes(status) ?
      dispatch(Validation.create('document', data, status)) :
      dispatch(Documents.receiveOneUpdated(data))
  }
}

export const unpublishDocument = (documentId) => {
  return async (dispatch) => {
    dispatch(Documents.unpublish(documentId))
    const { data, status } = await add(`documents/${documentId}/unpublish`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }
    dispatch(Documents.receiveUnpublishedVersion(data))
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
