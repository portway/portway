import { ActionTypes } from '../actions'

const initialState = {
  currentDocumentId: null,
  projectDocumentsById: {},
  documentSearchResults: null,
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
    case ActionTypes.RECEIVE_DOCUMENT_ERROR: {
      const { documentId } = action
      const byId = { ...state.loading.byId, [documentId]: false }
      return {
        ...state,
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
    case ActionTypes.INITIATE_DOCUMENT_UPDATE: {
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
    // Update the document's publishedAt property
    case ActionTypes.RECEIVE_PUBLISHED_DOCUMENT: {
      const listDoc = state.projectDocumentsById[action.data.projectId][action.data.id]
      const updatedDoc = {
        ...listDoc,
        name: action.data.name,
        updatedAt: action.data.updatedAt,
        lastPublishedAt: action.data.lastPublishedAt
      }
      const project = { ...state.projectDocumentsById[action.data.projectId], [action.data.id]: updatedDoc }
      const projectDocumentsById = { ...state.projectDocumentsById, [action.data.projectId]: project }
      return {
        ...state,
        projectDocumentsById
      }
    }
    // Remove the published value
    case ActionTypes.RECEIVE_UNPUBLISHED_DOCUMENT: {
      const listDoc = state.projectDocumentsById[action.data.projectId][action.data.id]
      const updatedDoc = {
        ...listDoc,
        lastPublishedAt: action.data.lastPublishedAt,
        publishedVersionId: action.data.publishedVersionId,
      }
      const project = { ...state.projectDocumentsById[action.data.projectId], [action.data.id]: updatedDoc }
      const projectDocumentsById = { ...state.projectDocumentsById, [action.data.projectId]: project }
      return {
        ...state,
        projectDocumentsById
      }
    }
    case ActionTypes.REMOVE_DOCUMENT: {
      const { documentId, projectId } = action
      const byId = { ...state.loading.byId, [documentId]: false }
      const byProject = { ...state.loading.byProject, [projectId]: false }
      // create new object with [documentId] item left out - assigned to throwaway __ const
      // eslint-disable-next-line no-unused-vars
      const { [documentId]: ___, ...restDocumentList } = state.projectDocumentsById[projectId]
      const projectDocumentsById = { ...state.projectDocumentsById, [projectId]: restDocumentList }
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
    // When fields are added/updated/removed, adjust the updatedAt field
    // accordingly, only client-side... next request for document will get the
    // right date
    case ActionTypes.RECEIVE_CREATED_FIELD:
    case ActionTypes.RECEIVE_UPDATED_FIELD:
    case ActionTypes.REMOVE_FIELD: {
      const documentToUpdate = { ...state.projectDocumentsById[action.projectId][action.documentId] }
      documentToUpdate.updatedAt = Date.now()
      const project = { ...state.projectDocumentsById[action.projectId], [action.documentId]: documentToUpdate }
      const projectDocumentsById = { ...state.projectDocumentsById, [action.projectId]: project }
      return {
        ...state,
        projectDocumentsById
      }
    }
    default:
      return state
  }
}
