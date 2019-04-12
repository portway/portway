import { Fields } from './index'
import { add, fetch, update, remove } from '../api'

export const fetchFields = (documentId) => {
  console.log(documentId) // logs a handful of times
  return async (dispatch) => {
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

export const updateField = (id, documentId, body) => {
  return async (dispatch) => {
    dispatch(Fields.initiateUpdate())
    const { data } = await update(`documents/${documentId}/fields/${id}`, body)
    dispatch(Fields.receiveOneUpdated(data))
  }
}

export const removeField = (id, documentId) => {
  return async (dispatch) => {
    dispatch(Fields.initiateRemove())
    await remove(`documents/${documentId}/fields`)
    dispatch(Fields.removeOne(id, documentId))
  }
}
