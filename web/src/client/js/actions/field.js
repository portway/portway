import { Fields } from './index'
import { add, fetch, update, remove } from '../api'

export const fetchFields = (documentId) => {
  return async (dispatch) => {
    if (!documentId) return
    dispatch(Fields.requestList(documentId)) // only happens on initial page load
    const { data } = await fetch(`documents/${documentId}/fields`)
    dispatch(Fields.receiveList(documentId, data))
  }
}

export const createField = (documentId, body) => {
  return async (dispatch) => {
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

export const removeField = (documentId, fieldId) => {
  return async (dispatch) => {
    dispatch(Fields.initiateRemove())
    await remove(`documents/${documentId}/fields`)
    dispatch(Fields.removeOne(documentId, fieldId))
  }
}
