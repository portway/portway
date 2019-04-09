import { ActionTypes } from '../actions'

const initialState = {
  documentsByProjectId: {},
  loading: {
    byId: {}
  }
}

export const projectDocuments = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.STUPID_TEST_ACTION: {
      const doc = state.documentsByProjectId[110000][action.id]
      const newDoc = { ...doc, name: action.data }
      const project = { ...state.documentsByProjectId[110000], [action.id]: newDoc }
      return {
        ...state,
        documentsByProjectId: { ...state.documentsByProjectId, [110000]: project }
      }
    }
    case ActionTypes.REQUEST_PROJECT_DOCUMENTS: {
      const byId = { ...state.loading.byId, [action.id]: true }
      return { ...state, loading: { byId } }
    }
    case ActionTypes.RECEIVE_PROJECT_DOCUMENTS: {
      const byId = { ...state.loading.byId, [action.projectId]: false }
      if (action.data.length === 0) {
        return { ...state, loading: { byId } }
      }
      const documentsById = action.data.reduce((object, doc) => {
        object[doc.id] = doc
        return object
      }, {})
      const documentsByProjectId = {
        ...state.documentsByProjectId,
        [action.projectId]: documentsById
      }
      return { ...state, documentsByProjectId, loading: { byId } }
    }
    case ActionTypes.REQUEST_DOCUMENT: {
      const byId = { ...state.loading.byId, [action.projectId]: true }
      return { ...state, loading: { byId } }
    }
    case ActionTypes.RECEIVE_DOCUMENT: {
      const byId = { ...state.loading.byId, [action.data.projectId]: false }
      const documents = {
        ...state.documentsByProjectId[action.data.projectId],
        [action.data.id]: action.data
      }
      const documentsByProjectId = {
        ...state.documentsByProjectId,
        [action.data.projectId]: documents
      }
      return { ...state, documentsByProjectId, loading: { byId } }
    }
    default:
      return state
  }
}
