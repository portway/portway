import { NOTIFICATION_RESOURCE, NOTIFICATION_TYPES } from 'Shared/constants'
import { Fields, Notifications, Validation } from './index'
import { add, update, remove, globalErrorCodes, validationCodes } from '../api'

export const createField = (projectId, documentId, fieldType, body) => {
  return async (dispatch) => {
    dispatch(Fields.initiateCreate(documentId, fieldType))
    const { data, status } = await add(`documents/${documentId}/fields`, body)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }
    validationCodes.includes(status) ?
      dispatch(Validation.create('field', data, status)) :
      dispatch(Fields.receiveOneCreated(projectId, documentId, data))
  }
}

export const updateField = (projectId, documentId, fieldId, body) => {
  return async (dispatch) => {
    dispatch(Fields.initiateUpdate(fieldId))
    let data
    let status
    // if we're getting FormData here, it's a file upload, pass the FormData as the body
    if (body.value instanceof FormData) {
      ({ data, status } = await update(`documents/${documentId}/fields/${fieldId}`, body.value))
    } else {
      ({ data, status } = await update(`documents/${documentId}/fields/${fieldId}`, body))
    }
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.USER, status))
      return
    }
    validationCodes.includes(status) ?
      dispatch(Validation.create('field', data, status)) :
      dispatch(Fields.receiveOneUpdated(projectId, documentId, data))
  }
}

export const updateFieldOrder = (documentId, fieldId, newOrder) => {
  return async (dispatch) => {
    dispatch(Fields.initiateOrderUpdate(documentId, fieldId, newOrder))
    await update(`documents/${documentId}/fields/${fieldId}/order`, { order: newOrder })
  }
}

export const removeField = (projectId, documentId, fieldId) => {
  return async (dispatch) => {
    dispatch(Fields.initiateRemove())
    const { data, status } = await remove(`documents/${documentId}/fields/${fieldId}`)
    if (globalErrorCodes.includes(status)) {
      dispatch(Notifications.create(data.error, NOTIFICATION_TYPES.ERROR, NOTIFICATION_RESOURCE.FIELD, status))
      return
    }
    dispatch(Fields.removeOne(projectId, documentId, fieldId))
  }
}

/**
 * Creates a new field in newDocumentId using an existing field's data
 * Then removes that field from the currentDocumentId
 * This is triggered by dragging a field to a document in the list without the
 * modifier key (option/alt) held
 */
export const moveField = (projectId, currentDocumentId, newDocumentId, field) => {
  const body = {
    name: field.name,
    type: field.type,
    value: field.value
  }
  return async (dispatch) => {
    dispatch(Fields.initiateMove(projectId, currentDocumentId, newDocumentId, field.id))
    await createField(projectId, newDocumentId, field.type, body)(dispatch)
    await removeField(projectId, currentDocumentId, field.id)(dispatch)
    dispatch(Fields.movedField(projectId, currentDocumentId, newDocumentId, field.id))
  }
}

/**
 * Copies an existing field to newDocumentId
 * This is triggered by dragging a field to a document in the list with the
 * modifier key (option/alt) held
 */
export const copyField = (projectId, currentDocumentId, newDocumentId, field) => {
  const body = {
    name: field.name,
    type: field.type,
    value: field.value
  }
  return async (dispatch) => {
    dispatch(Fields.initiateCopy(projectId, currentDocumentId, newDocumentId, field.id))
    await createField(projectId, newDocumentId, field.type, body)(dispatch)
    dispatch(Fields.copiedField(projectId, currentDocumentId, newDocumentId, field.id))
  }
}
