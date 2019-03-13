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
import { fetchProjects } from 'Actions/project'
import { fetchProject } from '../actions/project'

export default {
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
    }
  },
  project: {
    id: function(id) {
      return {
        fetchAction: fetchProject(id), //(dispatch) => { dispatch(fetchProject(id)) },
        getLoadingStatusFromState: (state) => {
          return state.project.loading.byId[id]
        },
        getDataFromState: (state) => {
          return state.project.projectById[id]
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
    }
  }
}
