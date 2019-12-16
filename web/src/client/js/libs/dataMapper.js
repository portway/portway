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
import { fetchUser, fetchUsers, fetchUserProjectAssignments, searchByName } from 'Actions/user'
import { fetchProject, fetchProjects, fetchProjectsForUser, fetchProjectAssignees, fetchProjectTokens } from 'Actions/project'
import { fetchOrganization, fetchOrganizationBilling } from 'Actions/organization'
import { currentUserId, currentOrgId } from './currentIds'

function returnNull() {
  return {
    fetchAction: () => null,
    getLoadingStatusFromState: () => null,
    getDataFromState: () => null
  }
}

export default {
  documents: {
    list: function(projectId) {
      if (!projectId || isNaN(projectId)) return returnNull()
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
      if (!documentId || isNaN(documentId) || isNaN(projectId)) return returnNull()
      return {
        fetchAction: fetchDocument(documentId),
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
      if (!documentId || isNaN(documentId)) return returnNull()
      return {
        fetchAction: fetchDocument(documentId),
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
    listForUser: function(userId) {
      if (!userId) return returnNull()
      return {
        fetchAction: fetchProjectsForUser(userId),
        getLoadingStatusFromState: (state) => {
          return state.userProjects.loading.byUserId[userId]
        },
        getDataFromState: (state) => {
          return state.userProjects.projectsByUserId[userId]
        }
      }
    },
    id: function(projectId) {
      if (!projectId || isNaN(projectId)) return returnNull()
      return {
        fetchAction: fetchProject(projectId),
        getLoadingStatusFromState: (state) => {
          return state.projects.loading.byId[projectId]
        },
        getDataFromState: (state) => {
          return state.projects.projectsById[projectId]
        }
      }
    },
    projectUsers: function(projectId) {
      if (!projectId || isNaN(projectId)) return returnNull()
      return {
        fetchAction: fetchProjectAssignees(projectId),
        getLoadingStatusFromState: (state) => {
          return state.projectUsers.loading.usersByProjectId[projectId]
        },
        getDataFromState: (state) => {
          return state.projectUsers.usersByProjectId[projectId]
        }
      }
    },
    projectAssignments: function(projectId) {
      if (!projectId || isNaN(projectId)) return returnNull()
      return {
        fetchAction: fetchProjectAssignees(projectId),
        getLoadingStatusFromState: (state) => {
          return state.projectAssignments.loading.assignmentsByProjectId[projectId]
        },
        getDataFromState: (state) => {
          return state.projectAssignments.assignmentsByProjectId[projectId]
        }
      }
    },
    tokens: function(projectId) {
      if (!projectId || isNaN(projectId)) return returnNull()
      return {
        fetchAction: fetchProjectTokens(projectId),
        getLoadingStatusFromState: (state) => {
          return state.projectTokens.loading.tokensByProjectId[projectId]
        },
        getDataFromState: (state) => {
          return state.projectTokens.tokensByProjectId[projectId]
        }
      }
    }
  },
  users: {
    list: function(page, sortBy, sortMethod) {
      return {
        fetchAction: fetchUsers(page, sortBy, sortMethod),
        getLoadingStatusFromState: (state) => {
          return state.users.loading.byPage[page]
        },
        getDataFromState: (state) => {
          const ids = state.users.userIdsByPage[page]
          const users = ids && ids.map(id => state.users.usersById[id])
          const totalPages = state.users.totalPages
          return { users, totalPages }
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
    projectAssignmentsForUser: function(userId) {
      if (!userId) return returnNull()
      return {
        fetchAction: fetchUserProjectAssignments(userId),
        getLoadingStatusFromState: (state) => {
          return state.userAssignments.loading.byUserId[userId]
        },
        getDataFromState: (state) => {
          return state.userAssignments.assignmentsByUserId[userId]
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
    },
    currentUserProjectAssignments: function() {
      return {
        fetchAction: fetchUserProjectAssignments(currentUserId),
        getLoadingStatusFromState: (state) => {
          return state.userAssignments.loading.byUserId[currentUserId]
        },
        getDataFromState: (state) => {
          return state.userAssignments.assignmentsByUserId[currentUserId]
        }
      }
    },
    searchByName: function(partialNameString) {
      return {
        fetchAction: searchByName(partialNameString),
        getLoadingStatusFromState: (state) => {
          return state.users.loading.byNameString[partialNameString]
        },
        getDataFromState: (state) => {
          const ids = state.users.userSearchResultIdsByNameString[partialNameString]
          const users = ids && ids.map(id => state.users.usersById[id])
          return users
        }
      }
    }
  },
  organizations: {
    current: function() {
      return {
        fetchAction: fetchOrganization(currentOrgId),
        getLoadingStatusFromState: (state) => {
          return state.organizations.loading.byId[currentOrgId]
        },
        getDataFromState: (state) => {
          return state.organizations.organizationsById[currentOrgId]
        }
      }
    },
    billing: function() {
      return {
        fetchAction: fetchOrganizationBilling(currentOrgId),
        getLoadingStatusFromState: (state) => {
          return state.organizations.loading.billingById[currentOrgId]
        },
        getDataFromState: (state) => {
          return state.organizations.organizationsBillingById[currentOrgId]
        }
      }
    }
  }
}
