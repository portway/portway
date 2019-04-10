import { ActionTypes } from '../actions'

const initialState = {
  list: {},
  documentsById: {},
  loading: {
    list: {},
    byId: {}
  }
}

export const documents = (state = initialState, action) => {
  switch (action.type) {
    // Multiple documents
    case ActionTypes.REQUEST_DOCUMENTS: {
      const list = { ...state.loading.list, [action.projectId]: true }
      return {
        ...state,
        loading: {
          ...state.loading,
          list
        }
      }
    }
    case ActionTypes.RECEIVE_DOCUMENTS: {
      const loadingList = { ...state.loading.list, [action.projectId]: false }
      const documentsObject = action.data.reduce((object, doc) => {
        object[doc.id] = doc
        return object
      }, {})
      const list = { ...state.list, [action.projectId]: documentsObject }
      return {
        ...state,
        list,
        loading: {
          ...state.loading,
          list: loadingList
        }
      }
    }
    // Single document
    case ActionTypes.REQUEST_DOCUMENT:
      const byId = { ...state.loading.byId, [action.documentId]: true }
      return {
        ...state,
        loading: {
          ...state.loading,
          byId
        }
      }
    case ActionTypes.RECEIVE_DOCUMENT: {
      const byId = { ...state.loading.byId, [action.data.id]: false }
      const currentDocumentId = action.data.id
      const documentsById = {
        ...state.documentsById,
        [action.data.id]: action.data
      }
      return {
        ...state,
        currentDocumentId,
        documentsById,
        loading: {
          ...state.loading,
          byId
        }
      }
    }
    case ActionTypes.RECEIVE_UPDATED_DOCUMENT:
      const listDoc = state.list[action.data.projectId][action.data.id]
      const updatedDoc = {
        ...listDoc,
        name: action.data.name,
        updatedAt: action.data.updatedAt
      }
      const project = {
        ...state.list[action.data.projectId],
        [action.data.id]: updatedDoc
      }
      return {
        ...state,
        list: {
          ...state.list,
          [action.data.projectId]: project
        }
      }
    default:
      return state
  }
}
