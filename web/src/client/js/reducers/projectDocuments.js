import { ActionTypes } from '../actions'

const initialState = {
  documentsByProjectId: {},
  loading: {
    byId: {}
  }
}

export const projectDocuments = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_PROJECT_DOCUMENTS: {
      const byId = { ...state.loading.byId, [action.id]: true }
      return { ...state, loading: { byId } }
    }
    case ActionTypes.RECEIVE_PROJECT_DOCUMENTS: {
      if (action.data.length === 0) {
        return { ...state }
      }
      const projectId = action.data[0].projectId
      const documentsByProjectId = { ...state.documentsByProjectId, [projectId]: action.data }
      const byId = { ...state.loading.byId, [projectId]: false }
      return { ...state, documentsByProjectId, loading: { byId } }
    }
    default:
      return state
  }
}
