import { NOTIFICATION_RESOURCE, NOTIFICATION_TYPES } from 'Shared/constants'
import { Fields, Notifications, Validation } from './index'
import { add, update, remove, globalErrorCodes, validationCodes } from '../api'

export const createField = (projectId, documentId, fieldType, body) => {
  return async (dispatch) => {
    dispatch(Fields.initiateCreate(documentId, fieldType))
    const { data, status } = await add(`documents/${documentId}/fields`, body)
    validationCodes.includes(status) ?
      dispatch(Validation.create('field', data, status)) :
      dispatch(Fields.receiveOneCreated(projectId, documentId, data))
  }
}

export const updateField = (projectId, documentId, fieldId, body) => {
  return async (dispatch) => {
    dispatch(Fields.initiateUpdate(fieldId))
    const { data, status } = await update(`documents/${documentId}/fields/${fieldId}`, body)
    validationCodes.includes(status) ?
      dispatch(Validation.create('field', data, status)) :
      dispatch(Fields.receiveOneUpdated(projectId, documentId, data))
  }
}

export const updateFieldOrder = (projectId, documentId, fieldId, newOrder) => {
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
