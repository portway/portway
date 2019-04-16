/**
 * Resource-centric data flow definitions
 *
 * Used in conjunction with the useDataService hook
 *
 * Define a resource view, and an associated set of functions to enable
 * React components to consume that resource without needing to interact directly
 * with Redux actions or the Store
 *
 * A resource view value is a function that returns an object:
 * {
 *  fetchAction: function()
 *  getLoadingStatusFromState function(state)
 *  getDataFromState: function(state)
 * }
 *
 * A view can optionally take arguments to the function, for instance to fetch a resource by id
 */
import { fetchDocuments, fetchDocument } from 'Actions/document'
import { fetchFields } from 'Actions/field'
import { fetchProject, fetchProjects } from 'Actions/project'
import { fetchUser, fetchUsers } from 'Actions/user'
import currentUserId from './currentUserId'

export default {
  documents: {
    list: function(projectId) {
      return {
        fetchAction: fetchDocuments(projectId),
        getLoadingStatusFromState: (state) => {
          return state.documents.loading.byProject[projectId]
        },
        getDataFromState: (state) => {
          return state.documents.projectDocumentsById[projectId]
        }
      }
    },
    id: function(projectId, documentId) {
      return {
        fetchAction: fetchDocument(projectId, documentId),
        getLoadingStatusFromState: (state) => {
          return state.documents.loading.byId[documentId]
        },
        getDataFromState: (state) => {
          return state.documents.projectDocumentsById[projectId] &&
            state.documents.projectDocumentsById[projectId][documentId]
        }
      }
    }
  },
  fields: {
    list: function(documentId) {
      return {
        fetchAction: fetchFields(documentId),
        getLoadingStatusFromState: (state) => {
          return state.documentFields.loading.byDocument[documentId]
        },
        getDataFromState: (state) => {
          return state.documentFields.documentFieldsById[documentId]
        }
      }
    },
  },
  projects: {
    list: function() {
      return {
        fetchAction: fetchProjects,
        getLoadingStatusFromState: (state) => {
          return state.projects.loading.list
        },
        getDataFromState: (state) => {
          return state.projects.projectsById
        }
      }
    },
    id: function(id) {
      return {
        fetchAction: fetchProject(id),
        getLoadingStatusFromState: (state) => {
          return state.projects.loading.byId[id]
        },
        getDataFromState: (state) => {
          return state.projects.projectsById[id]
        }
      }
    }
  },
  users: {
    list: function() {
      return {
        fetchAction: fetchUsers,
        getLoadingStatusFromState: (state) => {
          return state.users.loading.list
        },
        getDataFromState: (state) => {
          return state.users.usersById
        }
      }
    },
    id: function(id) {
      return {
        fetchAction: fetchUser(id),
        getLoadingStatusFromState: (state) => {
          return state.users.loading.byId[id]
        },
        getDataFromState: (state) => {
          return state.users.usersById[id]
        }
      }
    },
    current: function() {
      return {
        fetchAction: fetchUser(currentUserId),
        getLoadingStatusFromState: (state) => {
          return state.users.loading.byId[currentUserId]
        },
        getDataFromState: (state) => {
          return state.users.usersById[currentUserId]
        }
      }
    }
  }
}
