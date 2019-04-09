import { ActionTypes } from '../actions'

const initialState = {
  documentsById: {},
  loading: {
    byId: {}
  }
}

export const documents = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_DOCUMENT:
      const byId = { ...state.loading.byId, [action.documentId]: true }
      return {
        ...state,
        loading: { byId }
      }
    case ActionTypes.RECEIVE_DOCUMENT: {
      const byId = { ...state.loading.byId, [action.data.id]: false }
      const documentsById = {
        ...state.documentsById,
        [action.data.id]: action.data
      }
      return { ...state, documentsById, loading: { byId } }
    }
    default:
      return state
  }
}
