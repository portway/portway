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
  let returnValue
  switch (resourceName) {
    case 'project':
      // Specifically look at project here, as we may be looking at documents
      matchResults = matchPath(path, {
        path: '/project/:projectId',
        exact: true,
        strict: false
      })
      func = dataMapper.projects.id
      if (matchResults) {
        returnValue = matchResults.params.projectId ?
          func(matchResults.params.projectId) : returnNull()
      } else {
        returnValue = returnNull()
      }
      break
    case 'document':
      matchResults = matchPath(path, {
        path: '/project/:projectId/document/:documentId',
        exact: true,
        strict: false
      })
      func = dataMapper.projectDocuments.id
      if (matchResults) {
        if (matchResults.params.projectId && matchResults.params.documentId) {
          returnValue = func(matchResults.params.projectId, matchResults.params.documentId)
        } else {
          returnValue = returnNull()
        }
      }
      break
    default:
      // Return empty functions
      returnNull()
      break
  }
  return returnValue
}

export default currentResource
