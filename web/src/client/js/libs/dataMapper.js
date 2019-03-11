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

export default {
  projects: {
    list: function() {
      return {
        fetchAction: fetchProjects,
        getLoadingStatusFromState: function(state) {
          return state.projects.loading.list
        },
        getDataFromState: function(state) {
          return state.projects.projectsById
        }
      }
    }
  }
}
