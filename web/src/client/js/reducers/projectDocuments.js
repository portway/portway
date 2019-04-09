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
      console.log(action)
      const byId = { ...state.loading.byId, [action.projectId]: false }
      if (action.data.length === 0) {
        return { ...state, loading: { byId } }
      }
      // const projectDocumentId = action.data[0].id
      const documentsByProjectId = { ...state.documentsByProjectId, [action.projectId]: action.data }
      return { ...state, documentsByProjectId, loading: { byId } }
    }
    default:
      return state
  }
}
