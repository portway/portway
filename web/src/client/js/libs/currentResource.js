// Get the current resource based on the url
// Takes react-router's location path as arg, and produces params using matchPath
// This is so components _outside_ of a Route still work
//
// useDataService compatible function
import { matchPath } from 'react-router-dom'
import dataMapper from './dataMapper'

function returnNull() {
  return {
    fetchAction: () => {},
    getLoadingStatusFromState: () => false,
    getDataFromState: () => {}
  }
}

/**
 * @param resourceName {String} resource name for switch statement
 * @param path {String} React Router location.pathname
 * Marks a resource for fetch or return of cached redux state
 * Returns an object of functions to be consumed by useDataService React Hook
 */
const currentResource = (resourceName, path) => {
  let func
  let matchResults
  switch (resourceName) {
    case 'project':
      matchResults = matchPath(path, {
        path: '/project/:id',
        exact: true,
        strict: false
      })
      func = dataMapper.projects.id
      break
    default:
      // Return empty functions
      returnNull()
      break
  }
  return matchResults && matchResults.params.id ? func(matchResults.params.id) : returnNull()
}

export default currentResource
