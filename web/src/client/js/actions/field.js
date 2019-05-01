import { Fields } from './index'
import { add, update, remove } from '../api'

export const createField = (documentId, fieldType, body) => {
  return async (dispatch) => {
    dispatch(Fields.initiateCreate(documentId, fieldType))
    const { data } = await add(`documents/${documentId}/fields`, body)
    dispatch(Fields.receiveOneCreated(data))
  }
}

export const updateField = (documentId, fieldId, body) => {
  return async (dispatch) => {
    dispatch(Fields.initiateUpdate(fieldId))
    const { data } = await update(`documents/${documentId}/fields/${fieldId}`, body)
    dispatch(Fields.receiveOneUpdated(data))
  }
}

export const updateFieldOrder = (documentId, fieldId, newOrder) => {
  return async (dispatch) => {
    dispatch(Fields.initiateOrderUpdate(documentId, fieldId, newOrder))
    await update(`documents/${documentId}/fields/${fieldId}/order`, { order: newOrder })
  }
}

export const removeField = (documentId, fieldId) => {
  return async (dispatch) => {
    dispatch(Fields.initiateRemove())
    await remove(`documents/${documentId}/fields/${fieldId}`)
    dispatch(Fields.removeOne(documentId, fieldId))
  }
}
