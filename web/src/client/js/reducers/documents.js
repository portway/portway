/* eslint-disable max-len */
import { ActionTypes } from '../actions'

const initialState = {
  projectDocumentsById: {},
  loading: {
    byProject: {},
    byId: {}
  }
}

export const documents = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.REQUEST_DOCUMENTS: {
      const byProject = { ...state.loading.byProject, [action.projectId]: true }
      return {
        ...state,
        loading: {
          ...state.loading,
          byProject
        }
      }
    }
    case ActionTypes.RECEIVE_DOCUMENTS: {
      const loadingList = { ...state.loading.byProject, [action.projectId]: false }
      const documentsObject = action.data.reduce((object, doc) => {
        object[doc.id] = doc
        return object
      }, {})
      const projectDocumentsById = { ...state.projectDocumentsById, [action.projectId]: documentsObject }
      return {
        ...state,
        projectDocumentsById,
        loading: {
          ...state.loading,
          byProject: loadingList
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
      const project = { ...state.projectDocumentsById[action.data.projectId], [action.data.id]: action.data }
      const projectDocumentsById = { ...state.projectDocumentsById, [action.data.projectId]: project }
      return {
        ...state,
        currentDocumentId,
        projectDocumentsById,
        loading: {
          ...state.loading,
          byId
        }
      }
    }
    case ActionTypes.RECEIVE_CREATED_DOCUMENT: {
      const byId = { ...state.loading.byId, [action.data.id]: false }
      const byProject = { ...state.loading.byProject, [action.projectId]: false }
      const currentDocumentId = action.data.id
      const project = { ...state.projectDocumentsById[action.data.projectId], [action.data.id]: action.data }
      const projectDocumentsById = { ...state.projectDocumentsById, [action.data.projectId]: project }
      return {
        ...state,
        currentDocumentId,
        projectDocumentsById,
        loading: {
          ...state.loading,
          byProject,
          byId
        }
      }
    }
    case ActionTypes.INITIATE_UPDATE_DOCUMENT: {
      const byId = { ...state.loading.byId, [action.documentId]: true }
      const byProject = { ...state.loading.byProject, [action.projectId]: true }
      return {
        ...state,
        loading: {
          ...state.loading,
          byId,
          byProject
        }
      }
    }
    case ActionTypes.RECEIVE_UPDATED_DOCUMENT: {
      const byId = { ...state.loading.byId, [action.data.id]: false }
      const byProject = { ...state.loading.byProject, [action.data.projectId]: false }
      const listDoc = state.projectDocumentsById[action.data.projectId][action.data.id]
      const updatedDoc = {
        ...listDoc,
        name: action.data.name,
        updatedAt: action.data.updatedAt
      }
      const project = { ...state.projectDocumentsById[action.data.projectId], [action.data.id]: updatedDoc }
      const projectDocumentsById = { ...state.projectDocumentsById, [action.data.projectId]: project }
      return {
        ...state,
        projectDocumentsById,
        loading: {
          ...state.loading,
          byProject,
          byId
        }
      }
    }
    case ActionTypes.DOCUMENT_REMOVED: {
      const { documentId, projectId } = action
      // Set loading to false
      const byId = { ...state.loading.byId, [documentId]: false }
      const listLoading = { ...state.loading.byProject, [projectId]: false }
      // Remove from list
      // create new object with [documentId] item left out - assigned to throwaway __ const
      // eslint-disable-next-line no-unused-vars
      const { [documentId]: ___, ...restDocumentList } = state.projectDocumentsById[projectId]
      const list = { ...state.projectDocumentsById, [projectId]: restDocumentList }
      // Remove from documentsById
      // eslint-disable-next-line no-unused-vars
      const { [documentId]: __, documentsById } = state.documentsById
      return {
        ...state,
        list,
        documentsById,
        loading: {
          ...state.loading,
          list: listLoading,
          byId
        }
      }
    }
    default:
      return state
  }
}
