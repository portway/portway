import { Fields } from './index'
import { add, update, remove } from '../api'

export const createField = (docId, body) => {
  return async (dispatch) => {
    const { data } = await add(`documents/${docId}/fields`, body)
    dispatch(Fields.receiveOneCreated(data))
  }
}

export const updateField = (id, docId, body) => {
  return async (dispatch) => {
    dispatch(Fields.initiateUpdate())
    const { data } = await update(`documents/${docId}/fields/${id}`, body)
    dispatch(Fields.receiveOneUpdated(data))
  }
}

export const removeField = (id, docId) => {
  return async (dispatch) => {
    dispatch(Fields.initiateRemove())
    await remove(`documents/${docId}/fields`)
    dispatch(Fields.removeOne(id, docId))
  }
}
